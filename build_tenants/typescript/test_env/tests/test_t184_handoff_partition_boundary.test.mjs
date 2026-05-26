// Validates: T-184

import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  constructPostflightGapDossier,
  constructWorkerProcessFailurePostflight,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  SDLC_T172_FULL_TRAVERSAL_EDGE_ACCOUNTING,
  sdlcEdgeOutputPolicyForTargetAssetType
} from "../../build/semantic/code/src/index.js";

const PACKAGE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "../..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t184-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  writeFileSync(path.join(root, "README.md"), "# T-184 fixture\n", "utf8");
  return root;
}

function walkTsFiles(root) {
  const files = [];
  for (const entry of readdirSync(root)) {
    const absolutePath = path.join(root, entry);
    const stat = statSync(absolutePath);
    if (stat.isDirectory()) {
      files.push(...walkTsFiles(absolutePath));
      continue;
    }
    if (absolutePath.endsWith(".ts")) {
      files.push(absolutePath);
    }
  }
  return files;
}

test("T-184 removes handoff.ts as a public operator surface", () => {
  assert.equal(
    existsSync(path.join(REPO_ROOT, "build_tenants/typescript/code/src/operator/handoff.ts")),
    false,
    "handoff.ts must not remain as an owning module"
  );

  const operatorSourceRoot = path.join(
    REPO_ROOT,
    "build_tenants/typescript/code/src/operator"
  );
  for (const filePath of walkTsFiles(operatorSourceRoot)) {
    const source = readFileSync(filePath, "utf8");
    assert.doesNotMatch(source, /from "\.\/handoff\.js"/u, filePath);
    assert.doesNotMatch(source, /from "\.\.\/handoff\.js"/u, filePath);
    assert.doesNotMatch(source, /writeOperatorArchiveFile/u, filePath);
    assert.doesNotMatch(source, /writeInstalledOperatorNoDispatchArtifact/u, filePath);
    assert.doesNotMatch(source, /ensureObservedTransformOutput/u, filePath);
    assert.doesNotMatch(source, /__handoff/u, filePath);
    assert.doesNotMatch(source, /target_asset_catalog_fallback/u, filePath);
    assert.doesNotMatch(source, /legacyReplayOnlyCompositionIdentityForInput/u, filePath);
    assert.doesNotMatch(source, /installedOperatorOwnsEvaluationOutput/u, filePath);
    assert.doesNotMatch(source, /\bwriteFileSync\b/u, filePath);
    assert.doesNotMatch(source, /\bappendFileSync\b/u, filePath);
    assert.doesNotMatch(source, /\bcreateWriteStream\b/u, filePath);
  }

  const operatorIndex = readRepoFile(
    "build_tenants/typescript/code/src/operator/index.ts"
  );
  assert.match(operatorIndex, /from "\.\/plugins\/transform\/launch_contract\.js"/u);
  assert.match(operatorIndex, /export \* from "\.\/system_artifacts\.js"/u);
  assert.doesNotMatch(operatorIndex, /handoff\.js/u);
});

test("T-184 ticket carries the partition inventory and deletion gates", () => {
  const ticket = readRepoFile(
    ".ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md"
  );
  for (const row of ["H-001", "H-030", "H-060", "H-090", "H-100", "H-120", "H-130"]) {
    assert.match(ticket, new RegExp(`\\| ${row} \\|`, "u"), `${row} is tracked`);
  }
  assert.match(ticket, /operator\/plugins\/transform\/launch_contract\.ts/u);
  assert.match(ticket, /operator\/system_artifacts\.ts/u);
  assert.match(ticket, /No framework helper writes a transform output/u);
});

test("T-184 retryable provider connection failures remain same-edge retry", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_intent_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t184-provider-connection"
  });
  mkdirSync(manifest.archiveRoot, { recursive: true });
  const stdoutPath = path.join(manifest.archiveRoot, "worker_stdout.log");
  const stderrPath = path.join(manifest.archiveRoot, "worker_stderr.log");
  const finalOutputPath = path.join(manifest.archiveRoot, "final_output.txt");
  writeFileSync(
    stdoutPath,
    JSON.stringify({
      type: "rate_limit_event",
      rate_limit_info: { status: "allowed", rateLimitType: "five_hour" }
    }),
    "utf8"
  );
  writeFileSync(stderrPath, "", "utf8");
  writeFileSync(
    finalOutputPath,
    "API Error: Unable to connect to API (ECONNRESET)\n",
    "utf8"
  );

  const postflight = constructWorkerProcessFailurePostflight({
    manifest,
    workerRun: {
      kind: "sdlc_worker_run_result",
      command: "claude",
      args: [],
      cwd: workspace,
      outcome: { kind: "exited", status: 1 },
      executorProfile: "pty-terminal",
      streamModel: "terminal-transcript",
      finalOutputRef: pathToFileURL(finalOutputPath).href,
      status: 1,
      signal: null,
      elapsedMs: 425253,
      timedOut: false,
      stdoutByteCount: 128,
      stderrByteCount: 0,
      stdoutPath,
      stderrPath,
      outputLastMessagePath: null,
      error: null
    }
  });
  const dossier = constructPostflightGapDossier({ manifest, postflight });

  assert.equal(postflight.blockingReasonCarriers[0].code, "worker_connection_failed");
  assert.equal(
    postflight.blockingReasonCarriers[0].lawfulReentryPoint,
    "same_edge_retry"
  );
  assert.equal(dossier.retryEligible, true);
  assert.deepEqual(dossier.nextLawfulActions, ["retry_same_edge"]);
});

test("T-184 projection surfaces are declared by edge-output policy", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("qualify_component_realization_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: contract.edgeName,
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t184-workspace-target-surface"
  });
  const policy = sdlcEdgeOutputPolicyForTargetAssetType(manifest.targetAssetType);

  assert.equal(
    policy.outputProducer,
    "system_projection",
    "qualification surfaces are projection outputs declared by shared edge policy"
  );
  assert.equal(policy.reviewGradeAssessmentExempt, true);
  assert.equal(policy.workerAuthoredTargetCarrierProtocolRequired, false);
  assert.equal(existsSync(manifest.outputFile), false);
});

test("T-184 every no-dispatch edge uses system projection policy", () => {
  const workspace = makeWorkspace();
  for (const row of SDLC_T172_FULL_TRAVERSAL_EDGE_ACCOUNTING.filter(
    (edgeAccountingRow) => !edgeAccountingRow.workerDispatchAllowed
  )) {
    const contract = hookContractByEdgeName(row.edgeName);
    const manifest = deriveWorkerHandoffManifest({
      workspaceRoot: workspace,
      graphFunctionName: contract.edgeName,
      edgeName: contract.edgeName,
      vectorIndex: 0,
      contract,
      runId: `t184-${row.edgeName}`
    });
    const policy = sdlcEdgeOutputPolicyForTargetAssetType(manifest.targetAssetType);
    assert.equal(
      policy.outputProducer,
      "system_projection",
      `${row.edgeName} (${manifest.targetAssetType}) must not fall back to a no-dispatch artifact writer`
    );
  }
});
