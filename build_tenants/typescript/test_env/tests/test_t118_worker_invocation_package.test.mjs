// Validates: T-118

import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  materializeSdlcProjectConformance,
  sha256Text,
  stableOperatorJson,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";

function writeConstraints(root) {
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t118_invocation_package",
      "active_tenant: scala_spark",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark",
      "    language: scala",
      "    build_tool: sbt",
      "    module_structure:",
      "      - invocation-core"
    ].join("\n"),
    "utf8"
  );
}

function workspaceWithLargeRequirementSurface() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t118-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  writeConstraints(root);
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-118: prove compact worker package.\n",
    "utf8"
  );
  const longClause = "Preserve compact package law ".repeat(95);
  const requirements = ["# Requirements", ""];
  for (let index = 1; index <= 160; index += 1) {
    const id = String(index).padStart(3, "0");
    requirements.push(
      `REQ-T118-${id}: ${longClause}Requirement ${id} must remain traceable without requiring the worker to read the full forensic manifest first.`
    );
  }
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    requirements.join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function manifestForLargeSurface() {
  const contract = hookContractByEdgeName("derive_intent_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot: workspaceWithLargeRequirementSurface(),
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t118-worker-invocation-package"
  });
}

test("T-118 writes a compact worker invocation package while preserving the full manifest by reference", () => {
  const manifest = manifestForLargeSurface();
  const files = writeHandoffFiles(manifest);
  const relativeToWorkspace = (filePath) =>
    path.relative(manifest.workspaceRoot, filePath);
  const fullManifestSize = statSync(files.manifestPath).size;
  const invocationPackageSize = statSync(files.invocationPackagePath).size;
  const workerBriefSize = statSync(files.workerBriefPath).size;
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const workerBrief = JSON.parse(readFileSync(files.workerBriefPath, "utf8"));
  const escapedWorkspaceRoot = new RegExp(
    manifest.workspaceRoot.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"),
    "u"
  );
  const { packageDigest, ...digestBasis } = invocationPackage;

  assert(fullManifestSize > 256 * 1024);
  assert(invocationPackageSize < 32 * 1024);
  assert(workerBriefSize < 4 * 1024);
  assert.equal(invocationPackage.kind, "sdlc_worker_invocation_package");
  assert.equal(invocationPackage.packageVersion, "ts-invocation-v1");
  assert.equal(invocationPackage.manifestPath, relativeToWorkspace(files.manifestPath));
  assert.equal(
    invocationPackage.manifestRef,
    `workspace://${relativeToWorkspace(files.manifestPath)}`
  );
  assert.equal(path.isAbsolute(invocationPackage.manifestPath), false);
  assert.equal(invocationPackage.traversalIntentPackagePath.endsWith("traversal_intent_package.json"), true);
  assert.equal(
    invocationPackage.manifestDigest,
    sha256Text(readFileSync(files.manifestPath, "utf8"))
  );
  assert.equal(packageDigest, sha256Text(stableOperatorJson(digestBasis)));
  assert.equal(
    invocationPackage.outputContract.outputFile,
    relativeToWorkspace(manifest.outputFile)
  );
  assert.equal(
    invocationPackage.outputContract.reportFile,
    relativeToWorkspace(manifest.reportFile)
  );
  assert.deepStrictEqual(
    invocationPackage.allowedWriteRoots,
    manifest.allowedWriteRoots.map(relativeToWorkspace)
  );
  assert.equal(invocationPackage.retryFrontier.kind, "sdlc_worker_invocation_retry_frontier");
  assert(invocationPackage.inlineObligations.length <= 24);
  assert.equal(
    invocationPackage.inlineObligations.filter(
      (obligation) => obligation.obligationKind === "requirement"
    ).length,
    12
  );
  assert.equal(invocationPackage.requirementTraceObligationIds.length, 160);
  assert(invocationPackage.omittedObligationCount > 100);
  assert.equal(workerBrief.kind, "sdlc_worker_brief");
  assert.equal(
    workerBrief.refs.workerInvocationPackagePath,
    relativeToWorkspace(files.invocationPackagePath)
  );
  assert.equal(workerBrief.refs.handoffManifestPath, relativeToWorkspace(files.manifestPath));
  assert.equal(path.isAbsolute(workerBrief.outputFile), false);
  assert.equal(
    workerBrief.digests.workerInvocationPackageDigest,
    invocationPackage.packageDigest
  );
  assert.deepEqual(workerBrief.requiredSchema, manifest.resultReportSchema);
  assert.doesNotMatch(
    readFileSync(files.invocationPackagePath, "utf8"),
    escapedWorkspaceRoot
  );
  assert.doesNotMatch(readFileSync(files.workerBriefPath, "utf8"), escapedWorkspaceRoot);
});

test("T-118 prompt points workers to the compact package before the forensic manifest", () => {
  const manifest = manifestForLargeSurface();
  const files = writeHandoffFiles(manifest);
  const prompt = readFileSync(files.promptPath, "utf8");

  assert(Buffer.byteLength(prompt, "utf8") < 8 * 1024);
  assert.doesNotMatch(prompt, new RegExp(manifest.workspaceRoot.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));
  assert.match(prompt, /Read the worker brief first:/u);
  assert.match(prompt, /worker_invocation_package\.json/u);
  assert.match(prompt, /worker_brief\.json/u);
  assert.match(prompt, /full forensic handoff manifest remains archived by reference/u);
  assert.doesNotMatch(prompt, /Read the full handoff manifest before writing output/u);
  assert.match(prompt, /Use workerInvocationPackage\.requirementTraceObligationIds/u);
  assert.doesNotMatch(prompt, /Compact worker invocation package:/u);
  assert.doesNotMatch(prompt, /Legacy compact prompt pressure projection:/u);
  assert.doesNotMatch(prompt, /"kind": "sdlc_worker_invocation_package"/u);
  assert.doesNotMatch(prompt, /sdlc_worker_prompt_pressure_projection/u);
});
