// Validates: REQ-F-ODDSDLC-009
// Validates: REQ-F-ODDSDLC-010
// Validates: REQ-F-ODDSDLC-011
// Validates: REQ-F-ODDSDLC-012
// Validates: REQ-F-ODDSDLC-015
// Validates: REQ-F-ODDSDLC-016
// Validates: REQ-F-ODDSDLC-038
// Investigates: T-029

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  SOFTWARE_DOMAIN_ASSET_FAMILIES,
  SOFTWARE_DOMAIN_ASSET_TYPES,
  SOFTWARE_DOMAIN_WORK_ACT_TYPES,
  admitSdlcAsset,
  admitSdlcAssetBinding,
  admitSdlcCapability,
  admitSdlcOperationalResult,
  admitSdlcOperationalTransitionCommand,
  admitSdlcWorkAct,
  admitSdlcWorksite,
  projectSdlcOperationalState
} from "../../build/semantic/code/src/index.js";

function pythonCatalogSource() {
  return readFileSync(
    new URL(
      "../../../python/code/odd_sdlc/software_domain_catalog.py",
      import.meta.url
    ),
    "utf8"
  );
}

function namesFromConstructor(source, constructorName) {
  const expression = new RegExp(`${constructorName}\\(\\s*name="([^"]+)"`, "g");
  return [...source.matchAll(expression)].map((match) => match[1]);
}

test("T-029 admits closed SDLC asset, binding, worksite, and capability carriers", () => {
  const asset = admitSdlcAsset({
    assetId: "asset://req/001",
    uri: "file://specification/requirements/example.md",
    declaredType: "requirement_surface",
    family: "worksite_inputs",
    mutability: "mutable_checkpointed",
    provenance: {
      model: "imported",
      source: "operator",
      mutable: true,
      historyBasis: "imported workspace surface"
    },
    checkpoint: {
      exists: true,
      pathKind: "file",
      contentDigest: "sha256:abc",
      byteCount: 42
    }
  });
  const binding = admitSdlcAssetBinding({
    nodeName: "RequirementSurface",
    assetIds: [asset.assetId]
  });
  const worksite = admitSdlcWorksite({
    worksiteId: "worksite://example",
    rootUri: "file:///tmp/example",
    lifecycleState: "designing",
    activeAssetIds: [asset.assetId]
  });
  const capability = admitSdlcCapability({
    capabilityId: "capability://ts/core-fd",
    family: "core_fd",
    binding: "fd://typescript/core",
    supportsAssetFamilies: ["worksite_inputs"],
    evidenceExpectation: "closed carrier admission"
  });
  const workAct = admitSdlcWorkAct({
    workActId: "work-act://import/001",
    descriptorName: "import",
    inputAssetIds: [],
    outputAssetIds: [asset.assetId],
    evidenceAssetIds: ["asset://evidence/import/001"],
    provenance: {
      model: "imported",
      source: "operator",
      mutable: false,
      historyBasis: "explicit import act"
    }
  });

  assert.equal(asset.kind, "sdlc_asset");
  assert.equal(asset.provenance.model, "imported");
  assert.equal(binding.nodeName, "RequirementSurface");
  assert.equal(worksite.lifecycleState, "designing");
  assert.equal(workAct.kind, "sdlc_work_act");
  assert.equal(workAct.descriptorName, "import");
  assert.equal(capability.family, "core_fd");
  assert(Object.isFrozen(asset));
  assert(Object.isFrozen(worksite));
});

test("T-029 admission rejects open payloads and malformed lifecycle values", () => {
  assert.throws(
    () =>
      admitSdlcWorksite({
        worksiteId: "worksite://bad",
        rootUri: "file:///tmp/bad",
        lifecycleState: "unknown",
        activeAssetIds: []
      }),
    /lifecycleState/
  );
  assert.throws(
    () =>
      admitSdlcAsset({
        assetId: "asset://bad",
        uri: "file://bad",
        declaredType: "code_surface",
        family: "implementation_branch",
        mutability: "mutable_checkpointed",
        provenance: {
          model: "generated",
          source: "fp",
          mutable: true,
          historyBasis: "test"
        },
        checkpoint: null,
        loose: true
      }),
    /unexpected field/
  );
});

test("T-029 TypeScript catalog preserves Python software-domain family and work-act names", () => {
  const source = pythonCatalogSource();
  assert.deepStrictEqual(
    SOFTWARE_DOMAIN_ASSET_FAMILIES.map((entry) => entry.name),
    [
      ...namesFromConstructor(source, "AssetFamilyDescriptor"),
      "governance_loop"
    ]
  );
  assert.deepStrictEqual(
    SOFTWARE_DOMAIN_WORK_ACT_TYPES.map((entry) => entry.name),
    namesFromConstructor(source, "WorkActDescriptor")
  );

  const assetTypeNames = new Set(SOFTWARE_DOMAIN_ASSET_TYPES.map((entry) => entry.name));
  for (const family of SOFTWARE_DOMAIN_ASSET_FAMILIES) {
    for (const assetTypeName of family.representativeAssetTypes) {
      assert(assetTypeNames.has(assetTypeName), assetTypeName);
    }
  }
});

test("T-029 operational command, result, and projection remain distinct for runtime return", () => {
  const command = admitSdlcOperationalTransitionCommand({
    commandId: "command://runtime-return/001",
    lane: "runtime_return",
    requiredSubstrateBinding: "runtime://abiogenesis/typescript",
    capabilityContract: "operational_fd",
    returnedEvidenceExpectation: "runtime observation asset",
    targetAssetIds: ["asset://runtime/observation/001"]
  });
  const pending = projectSdlcOperationalState({
    command,
    results: [],
    runtimeFactRefs: ["abg://run/001"]
  });
  const result = admitSdlcOperationalResult({
    kind: "sdlc_operational_result",
    resultId: "result://runtime-return/001",
    commandId: command.commandId,
    status: "succeeded",
    evidenceAssetIds: ["asset://runtime/observation/001"],
    returnedAt: "2026-04-26T00:00:00Z"
  });
  const projected = projectSdlcOperationalState({
    command,
    results: [result],
    runtimeFactRefs: ["abg://run/001", "abg://event/returned"]
  });

  assert.equal(command.kind, "sdlc_operational_transition_command");
  assert.equal(result.kind, "sdlc_operational_result");
  assert.equal(pending.state, "pending");
  assert.equal(projected.kind, "sdlc_operational_state_projection");
  assert.equal(projected.state, "succeeded");
  assert.deepStrictEqual(projected.sourceResultIds, [result.resultId]);
  assert.throws(
    () =>
      projectSdlcOperationalState({
        command,
        results: [
          admitSdlcOperationalResult({
            kind: "sdlc_operational_result",
            resultId: "result://other",
            commandId: "command://other",
            status: "failed",
            evidenceAssetIds: [],
            returnedAt: null
          })
        ],
        runtimeFactRefs: []
      }),
    /another command/
  );
  assert.throws(
    () =>
      admitSdlcOperationalResult({
        kind: "not_sdlc_operational_result",
        resultId: "result://bad-kind",
        commandId: command.commandId,
        status: "succeeded",
        evidenceAssetIds: [],
        returnedAt: null
      }),
    /kind/
  );
});
