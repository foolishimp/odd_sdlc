// Validates: REQ-F-ODDSDLC-033
// Validates: REQ-F-ODDSDLC-053
// Validates: T-091

import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  assertTraversalIntentPackagePressure,
  deriveWorkerHandoffManifest,
  evaluateWorkerResultPostflight,
  hookContractByEdgeName,
  materializeSdlcProjectConformance,
  sha256Text,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";

function writeConstraints(root) {
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t091_payload",
      "active_tenant: scala_spark",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark",
      "    language: scala",
      "    build_tool: sbt",
      "    module_structure:",
      "      - payload-core"
    ].join("\n"),
    "utf8"
  );
}

function workspaceWithImportedRequirement() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t091-rich-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  writeConstraints(root);
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-091: Preserve concrete traversal pressure.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    [
      "# Requirements",
      "",
      "REQ-T091-001: Preserve the concrete source requirement text in every prompt-bearing traversal.",
      "REQ-T091-002: Reject a fulfilled requirement assessment when output coverage is absent."
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function workspaceWithMarkerOnlyRequirement() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t091-lossy-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, "specification"), { recursive: true });
  writeConstraints(root);
  writeFileSync(path.join(root, "specification/INTENT.md"), "# Intent\n", "utf8");
  writeFileSync(
    path.join(root, "specification/requirements/01-lossy.md"),
    ["# Lossy Requirements", "", "- REQ-T091-999"].join("\n"),
    "utf8"
  );
  return root;
}

function workspaceWithLocalHeadingRequirement() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t091-local-heading-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, "specification"), { recursive: true });
  writeConstraints(root);
  writeFileSync(path.join(root, "specification/INTENT.md"), "# Intent\n", "utf8");
  writeFileSync(
    path.join(root, "specification/requirements/10-product-identity.md"),
    [
      "# Product Identity Requirements",
      "",
      "## R-10.1 Project Identity",
      "",
      "- `project_slug` MUST equal `t091_payload`."
    ].join("\n"),
    "utf8"
  );
  return root;
}

function manifestFor(workspaceRoot) {
  const contract = hookContractByEdgeName("derive_intent_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t091-obligation-payload"
  });
}

function writeOutput(manifest) {
  const content = "# Intent Surface\n\nConcrete requirement pressure was consumed.\n";
  mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, content, "utf8");
  return sha256Text(content);
}

function reportFor(manifest, obligationAssessments) {
  return {
    kind: "odd_sdlc.worker_result_report",
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    outputFile: manifest.outputFile,
    digest: writeOutput(manifest),
    summary: "Generated intent surface.",
    unresolvedReasons: [],
    materializedFiles: [],
    executionEvidence: null,
    obligationAssessments
  };
}

test("T-091 derives concrete requirement payload from imported source refs, not only marker ledger IDs", () => {
  const manifest = manifestFor(workspaceWithImportedRequirement());
  const familyPath = path.join(
    manifest.workspaceRoot,
    "specification/requirements/01-t091-requirements.md"
  );
  assert.equal(existsSync(familyPath), true);
  assert.match(
    readFileSync(familyPath, "utf8"),
    /REQ-T091-001: Preserve the concrete source requirement text/u
  );
  const obligation = manifest.traversalObligationContext.obligations.find(
    (item) => item.obligationId === "requirement:REQ-T091-001"
  );

  assert(obligation);
  assert.equal(obligation.payload.status, "concrete");
  assert.match(
    obligation.summary,
    /Preserve the concrete source requirement text/u
  );
  assert(
    obligation.payload.sourceRefs.some((ref) =>
      ref.endsWith("specification/REQUIREMENTS.md")
    )
  );
  assert(
    obligation.payload.sourceDigests.every((digest) =>
      digest.startsWith("sha256:")
    )
  );
  assert(
    obligation.payload.sourceSnippets.some((snippet) =>
      snippet.includes("REQ-T091-001: Preserve")
    )
  );
  assert.doesNotThrow(() => assertTraversalIntentPackagePressure(manifest));
});

test("T-091 rejects marker-only requirement pressure before worker handoff is admitted", () => {
  const manifest = manifestFor(workspaceWithMarkerOnlyRequirement());
  const obligation = manifest.traversalObligationContext.obligations.find(
    (item) => item.obligationId === "requirement:REQ-T091-999"
  );

  assert(obligation);
  assert.equal(obligation.payload.status, "reference_only");
  assert.throws(
    () => writeHandoffFiles(manifest),
    /traversal obligation payload insufficient: requirement:REQ-T091-999/u
  );
});

test("T-091 derives concrete payload from local requirement headings after blank lines", () => {
  const manifest = manifestFor(workspaceWithLocalHeadingRequirement());
  const obligation = manifest.traversalObligationContext.obligations.find(
    (item) =>
      item.obligationId.includes("/R-010/1-project-identity/")
  );

  assert(obligation);
  assert.equal(obligation.payload.status, "concrete");
  assert(
    obligation.payload.sourceSnippets.some((snippet) =>
      snippet.includes("R-10.1 Project Identity")
    )
  );
  assert.doesNotThrow(() => writeHandoffFiles(manifest));
});

test("T-091 postflight rejects fulfilled requirement without output coverage evidence", () => {
  const manifest = manifestFor(workspaceWithImportedRequirement());
  const report = reportFor(
    manifest,
    manifest.traversalObligationContext.obligations.map((obligation) => ({
      kind: "sdlc_worker_obligation_assessment",
      obligationId: obligation.obligationId,
      fulfillmentStatus: "fulfilled",
      evidenceRefs:
        obligation.obligationKind === "requirement"
          ? obligation.evidenceRefs
          : [manifest.outputFile],
      blockingReasons: []
    }))
  );

  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(postflight.status, "blocked");
  assert(
    postflight.blockingReasonCarriers.some(
      (reason) =>
        reason.code === "obligation_fulfilled_without_output_coverage" &&
        reason.detail === "requirement:REQ-T091-001"
    )
  );
});

test("T-091 postflight admits anchored output evidence for requirement coverage", () => {
  const manifest = manifestFor(workspaceWithImportedRequirement());
  const outputRef = `${pathToFileURL(manifest.outputFile).href}#requirement-req-t091-001`;
  const report = reportFor(
    manifest,
    manifest.traversalObligationContext.obligations.map((obligation) => ({
      kind: "sdlc_worker_obligation_assessment",
      obligationId: obligation.obligationId,
      fulfillmentStatus: "fulfilled",
      evidenceRefs:
        obligation.obligationKind === "requirement"
          ? [outputRef]
          : [manifest.outputFile],
      blockingReasons: []
    }))
  );

  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(postflight.status, "passed");
});

test("T-091 postflight admits generated asset ref as output coverage evidence", () => {
  const manifest = manifestFor(workspaceWithImportedRequirement());
  const outputRef = `asset://${manifest.targetAssetType}@${path
    .relative(manifest.workspaceRoot, manifest.outputFile)
    .split(path.sep)
    .join("/")}#requirement-req-t091-001`;
  const report = reportFor(
    manifest,
    manifest.traversalObligationContext.obligations.map((obligation) => ({
      kind: "sdlc_worker_obligation_assessment",
      obligationId: obligation.obligationId,
      fulfillmentStatus: "fulfilled",
      evidenceRefs:
        obligation.obligationKind === "requirement"
          ? [outputRef]
          : [manifest.outputFile],
      blockingReasons: []
    }))
  );

  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(postflight.status, "passed");
});
