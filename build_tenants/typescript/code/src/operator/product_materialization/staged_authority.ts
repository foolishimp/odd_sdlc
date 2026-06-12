import type {
  SdlcDesignDepthRegister,
  SdlcTestDesignRegister,
  SdlcWorkerHandoffManifest,
  SdlcDecompositionSummary,
  SdlcDependencyTraversalSelection,
  SdlcModuleDependencyMap,
  SdlcTestDependencyMap
} from "../carriers.js";import {
  admitImplementationDesignRegisterForManifest,
  admitImplementationDesignRegisterForRuntimeEvaluation
} from "../plugins/evaluate/design_depth_register.js";import {
  admitTestDesignRegisterFromArtifact
} from "../test_design_register.js";import {
  admitSdlcDependencyTraversalSelectedMethodCarrier,
  deriveSdlcTestDependencyMapFromImplementationDependencyMap,
  deriveSdlcStagedImplementationTopologyAuthority,
  deriveSdlcStagedTestTopologyAuthority,
  selectSdlcDependencyMapTraversal
} from "../decomposition_admission.js";import {
  existsSync
} from "node:fs";import {
  join
} from "node:path";import {
  requireOperatorRunArtifactRowForArtifactRef
} from "../../contracts/operator_run_artifact_catalog.js";

export interface SdlcStagedConstructionAuditCarrier {
  readonly artifactRef: string;
  readonly relativePath: string;
  readonly payload:
    | SdlcDecompositionSummary
    | SdlcModuleDependencyMap
    | SdlcTestDependencyMap
    | SdlcDependencyTraversalSelection;
}

const TENANT_LOCAL_SDLC_SURFACE_OUTPUT_PATHS = Object.freeze({
  feature_decomp_surface: "design/feature_decomp_surface.md",
  design_surface: "design/adrs/ADR-001-design-surface.md",
  scenario_surface: "design/scenario_surface.md",
  implementation_design_surface:
    "design/adrs/ADR-002-implementation-design-surface.md",
  component_code_surface: "design/component_code_surface.md",
  component_realization_qualification_surface:
    "design/component_realization_qualification_surface.md",
  code_surface: "design/code_surface.md",
  test_design_surface: "design/adrs/ADR-003-test-design-surface.md",
  component_test_surface: "design/component_test_surface.md",
  component_test_qualification_surface:
    "design/component_test_qualification_surface.md",
  component_repair_schedule_surface: "design/component_repair_schedule_surface.md",
  release_depth_parity_surface: "design/release_depth_parity_surface.md",
  release_surface: "design/release_surface.md",
  retrofit_design_surface: "design/adrs/ADR-004-retrofit-design-surface.md",
  retrofit_plan_surface: "design/retrofit_plan_surface.md",
  gap_observation_surface: "design/gap_observation_surface.md",
  gap_triage_surface: "design/gap_triage_surface.md",
  gap_route_surface: "design/gap_route_surface.md",
  repricing_proposal_surface: "design/repricing_proposal_surface.md",
  ticket_work_item_route_surface: "design/ticket_work_item_route_surface.md",
  gap_retirement_surface: "design/gap_retirement_surface.md"
} as const satisfies Record<string, string>);

function tenantLocalSdlcSurfaceRelativePath(targetAssetType: string): string | null {
  for (const [assetType, relativePath] of Object.entries(
    TENANT_LOCAL_SDLC_SURFACE_OUTPUT_PATHS
  )) {
    if (assetType === targetAssetType) {
      return relativePath;
    }
  }
  return null;
}

function manifestCapabilityValue(
  manifest: SdlcWorkerHandoffManifest,
  name: string
): string | null {
  return (
    manifest.conformedProject.capabilityContracts?.find(
      (contract) => contract.name === name
    )?.value ?? null
  );
}

function truthyCapabilityValue(value: string | null): boolean {
  const normalized = value?.trim().toLowerCase() ?? "";
  return (
    normalized === "1" ||
    normalized === "true" ||
    normalized === "yes" ||
    normalized === "on"
  );
}

function manifestRequiresTrivialDegenerateProduct(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return truthyCapabilityValue(manifestCapabilityValue(manifest, "trivial_product"));
}

function stagedAuditCarrier(
  artifactRef: string,
  payload: SdlcStagedConstructionAuditCarrier["payload"]
): SdlcStagedConstructionAuditCarrier {
  const artifact = requireOperatorRunArtifactRowForArtifactRef(artifactRef);
  return Object.freeze({
    artifactRef: artifact.artifactRef,
    relativePath: artifact.relativePath,
    payload
  });
}

function stagedParallelTraversalSelectedMethodCarrier(
  evidenceRefs: readonly string[]
) {
  return admitSdlcDependencyTraversalSelectedMethodCarrier({
    selectedMethod: "parallel",
    evidenceRefs: Object.freeze([
      "selection-policy://odd-sdlc/staged-topology/parallel",
      ...evidenceRefs
    ])
  });
}

export function deriveSdlcStagedConstructionAuditCarriers(
  manifest: SdlcWorkerHandoffManifest,
  fpEvaluatorAdmissionEvidenceRefs: readonly string[] = Object.freeze([])
): readonly SdlcStagedConstructionAuditCarrier[] {
  const carriers: SdlcStagedConstructionAuditCarrier[] = [];
  const requireTrivialDegenerateProduct =
    manifestRequiresTrivialDegenerateProduct(manifest);
  let implementationDependencyMap: SdlcModuleDependencyMap | null = null;
  const implementationRegister = readAdmittedImplementationDesign(
    manifest,
    fpEvaluatorAdmissionEvidenceRefs
  );
  if (implementationRegister !== null) {
    const authority = deriveSdlcStagedImplementationTopologyAuthority({
      register: implementationRegister,
      requireTrivialDegenerateProduct
    });
    implementationDependencyMap = authority.dependencyMap;
    carriers.push(
      stagedAuditCarrier(
        "operator-run-artifact://implementation-decomposition-summary",
        authority.summary
      ),
      stagedAuditCarrier(
        "operator-run-artifact://module-dependency-map",
        authority.dependencyMap
      ),
      stagedAuditCarrier(
        "operator-run-artifact://module-dependency-traversal-selection",
        selectSdlcDependencyMapTraversal({
          selectionRef: "selection://odd-sdlc/component-code/staged-topology",
          dependencyMap: authority.dependencyMap,
          selectedMethodCarrier: stagedParallelTraversalSelectedMethodCarrier(
            Object.freeze([
              "surface://implementation-decomposition-summary",
              "surface://module-dependency-map"
            ])
          ),
          policy: "parallel_when_partitioned",
          basisRefs: Object.freeze([
            "surface://implementation-decomposition-summary",
            "surface://module-dependency-map"
          ])
        })
      )
    );
  }

  const testRegister = readAdmittedTestDesign(manifest);
  if (testRegister !== null) {
    const authority = deriveSdlcStagedTestTopologyAuthority({
      register: testRegister,
      requireTrivialDegenerateProduct
    });
    carriers.push(
      stagedAuditCarrier(
        "operator-run-artifact://test-decomposition-summary",
        authority.summary
      ),
      stagedAuditCarrier(
        "operator-run-artifact://test-dependency-map",
        authority.dependencyMap
      ),
      stagedAuditCarrier(
        "operator-run-artifact://test-dependency-traversal-selection",
        selectSdlcDependencyMapTraversal({
          selectionRef: "selection://odd-sdlc/component-test/staged-topology",
          dependencyMap: authority.dependencyMap,
          selectedMethodCarrier: stagedParallelTraversalSelectedMethodCarrier(
            Object.freeze([
              "surface://test-decomposition-summary",
              "surface://test-dependency-map"
            ])
          ),
          policy: "parallel_when_partitioned",
          basisRefs: Object.freeze([
            "surface://test-decomposition-summary",
            "surface://test-dependency-map"
          ])
        })
      )
    );
  } else if (implementationDependencyMap !== null) {
    const derivedTestDependencyMap =
      deriveSdlcTestDependencyMapFromImplementationDependencyMap({
        moduleDependencyMap: implementationDependencyMap
      });
    if (derivedTestDependencyMap !== null) {
      carriers.push(
        stagedAuditCarrier(
          "operator-run-artifact://test-dependency-map",
          derivedTestDependencyMap
        ),
        stagedAuditCarrier(
          "operator-run-artifact://test-dependency-traversal-selection",
          selectSdlcDependencyMapTraversal({
            selectionRef:
              "selection://odd-sdlc/component-test/implementation-derived-topology",
            dependencyMap: derivedTestDependencyMap,
            selectedMethodCarrier: stagedParallelTraversalSelectedMethodCarrier(
              Object.freeze([
                implementationDependencyMap.mapRef,
                "surface://module-dependency-map",
                "surface://test-dependency-map"
              ])
            ),
            policy: "parallel_when_partitioned",
            basisRefs: Object.freeze([
              implementationDependencyMap.mapRef,
              "surface://module-dependency-map",
              "surface://test-dependency-map"
            ])
          })
        )
      );
    }
  }

  return Object.freeze(carriers);
}

function componentDepthSurfaceFile(
  manifest: SdlcWorkerHandoffManifest,
  targetAssetType: string
): string | null {
  const relativePath = tenantLocalSdlcSurfaceRelativePath(targetAssetType);
  if (relativePath === null) {
    return null;
  }
  return join(manifest.productMaterialization.tenantRoot, relativePath);
}

function readAdmittedImplementationDesign(
  manifest: SdlcWorkerHandoffManifest,
  fpEvaluatorAdmissionEvidenceRefs: readonly string[] = Object.freeze([])
): SdlcDesignDepthRegister | null {
  const admission =
    fpEvaluatorAdmissionEvidenceRefs.length > 0
      ? admitImplementationDesignRegisterForRuntimeEvaluation({
          manifest,
          fpEvaluatorAdmissionEvidenceRefs
        })
      : admitImplementationDesignRegisterForManifest({
          manifest
        });
  return admission.status === "admitted" ? admission.register : null;
}

function readAdmittedTestDesign(
  manifest: SdlcWorkerHandoffManifest
): SdlcTestDesignRegister | null {
  const outputFile = componentDepthSurfaceFile(manifest, "test_design_surface");
  if (outputFile === null || !existsSync(outputFile)) {
    return null;
  }
  const admission = admitTestDesignRegisterFromArtifact({
    targetAssetType: "test_design_surface",
    outputFile
  });
  return admission.status === "admitted" ? admission.register : null;
}
