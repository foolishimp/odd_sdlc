// Validates: REQ-F-ODDSDLC-007
// Validates: REQ-F-ODDSDLC-012
// Validates: REQ-F-ODDSDLC-016
// Validates: REQ-F-ODDSDLC-022
// Validates: REQ-F-ODDSDLC-032
// Investigates: T-031

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  admitSdlcProjectConstraints,
  admitSdlcSourceInput,
  deriveSdlcSourceInput,
  deriveSdlcWorkspaceIngressReport,
  parseProjectSlugFromConstraintText
} from "../../build/semantic/code/src/index.js";
import { canonicalDataMapperFixtureRoot } from "../fixtures/data_mapper_fixture.mjs";

const fixtureRoot = canonicalDataMapperFixtureRoot();

function fixtureSnapshot(relativePath) {
  return {
    uri: `file://${fixtureRoot}/${relativePath}`,
    relativePath,
    content: readFileSync(`${fixtureRoot}/${relativePath}`, "utf8")
  };
}

test("T-031 admits source inputs with digest, role, authority markers, and ambiguity", () => {
  const intent = deriveSdlcSourceInput(fixtureSnapshot("specification/INTENT.md"));
  const readme = deriveSdlcSourceInput(fixtureSnapshot("README.md"));
  const admitted = admitSdlcSourceInput(intent);

  assert.equal(admitted.detectedRole, "intent_surface");
  assert(admitted.digest.startsWith("fnv1a32:"));
  assert(admitted.authorityMarkers.includes("INT-001"));
  assert(admitted.authorityMarkers.some((marker) => marker.startsWith("Project:")));
  assert.equal(admitted.ambiguity.kind, "none");
  assert.equal(readme.detectedRole, "project_readme");
  assert.equal(readme.ambiguity.kind, "ambiguous");
  assert.throws(
    () =>
      admitSdlcSourceInput({
        ...intent,
        kind: "not_sdlc_source_input"
      }),
    /kind/
  );
});

test("T-031 project constraints admission fails closed on stale or malformed shapes", () => {
  assert.throws(
    () =>
      admitSdlcProjectConstraints({
        projectSlug: "data_mapper",
        activeTenant: "",
        selectedOutputRoot: "build_tenants/scala_spark",
        ambiguityRiskAppetite: "low",
        capabilityContracts: []
      }),
    /activeTenant/
  );
  assert.throws(
    () =>
      admitSdlcProjectConstraints({
        projectSlug: "data_mapper",
        activeTenant: "scala_spark",
        selectedOutputRoot: ".genesis/build_tenants/scala_spark",
        ambiguityRiskAppetite: "low",
        capabilityContracts: []
      }),
    /selectedOutputRoot/
  );
});

test("T-031 real data_mapper fixture derives imported requirement authority and lineage", () => {
  const constraintText = readFileSync(
    `${fixtureRoot}/.ai-workspace/context/project_constraints.yml`,
    "utf8"
  );
  const sourceInputs = [
    deriveSdlcSourceInput(fixtureSnapshot("README.md")),
    deriveSdlcSourceInput(fixtureSnapshot(".ai-workspace/context/project_constraints.yml")),
    deriveSdlcSourceInput(fixtureSnapshot("specification/INTENT.md")),
    deriveSdlcSourceInput(fixtureSnapshot("specification/REQUIREMENTS.md")),
    deriveSdlcSourceInput(fixtureSnapshot("specification/mapper_requirements.md")),
    deriveSdlcSourceInput(
      fixtureSnapshot("specification/appendices/APPENDIX_A_FROBENIUS_ALGEBRAS.md")
    )
  ];
  const constraints = admitSdlcProjectConstraints({
    projectSlug: parseProjectSlugFromConstraintText(constraintText),
    activeTenant: "scala_spark",
    selectedOutputRoot: "build_tenants/scala_spark",
    ambiguityRiskAppetite: "low",
    capabilityContracts: [
      "spark_session",
      "dataframe_reads",
      "cli_runner_class"
    ]
  });
  const report = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: `file://${fixtureRoot}`,
    projectConstraints: constraints,
    sourceInputs
  });

  assert.equal(report.kind, "sdlc_workspace_ingress_report");
  assert.equal(report.projectConstraints.activeTenant, "scala_spark");
  assert(report.importedRequirementAuthorities.length > 50);
  assert(
    report.importedRequirementAuthorities.some(
      (authority) => authority.requirementId === "REQ-LDM-001"
    )
  );
  assert(
    report.importedRequirementAuthorities.some(
      (authority) => authority.requirementId === "REQ-ENG-007"
    )
  );

  const projectLineage = report.lineage.find(
    (entry) => entry.elementId === "project:imported_project"
  );
  assert(projectLineage);
  assert(
    projectLineage.sourceInputUris.some((uri) =>
      uri.endsWith("specification/INTENT.md")
    )
  );

  const requirementLineage = report.lineage.find(
    (entry) => entry.elementId === "requirement:REQ-LDM-001"
  );
  assert(requirementLineage);
  assert(
    requirementLineage.sourceInputUris.some((uri) =>
      uri.endsWith("specification/REQUIREMENTS.md")
    )
  );
});
