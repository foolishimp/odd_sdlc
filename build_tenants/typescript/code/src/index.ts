// Implements: REQ-F-ODDSDLC-040
// Implements: REQ-F-ODDSDLC-043

export const ODD_SDLC_TYPESCRIPT_TENANT_KIND =
  "odd_sdlc_typescript_tenant" as const;

export const ODD_SDLC_TYPESCRIPT_TENANT_STATUS =
  "bounded_rc_qualified" as const;

export const ODD_SDLC_TYPESCRIPT_TENANT_CAPABILITIES = Object.freeze([
  "abiogenesis_substrate_bound",
  "domain_carriers",
  "gtl_module_publication",
  "workspace_ingress",
  "query_domain_projection",
  "abg_runtime_plugin_binding",
  "hook_contracts",
  "traceability_requirement_closure",
  "gap_triage_route_binding",
  "typed_workspace_product_api",
  "ticket_workflow_projection",
  "typescript_install_adapter",
  "assurance_ledger_composition",
  "scheduling_phase",
  "release_cut_packaging",
  "rc_qualification"
] as const);

export interface OddSdlcTypescriptTenantInfo {
  readonly kind: typeof ODD_SDLC_TYPESCRIPT_TENANT_KIND;
  readonly status: typeof ODD_SDLC_TYPESCRIPT_TENANT_STATUS;
  readonly product: "odd_sdlc";
  readonly capabilities: typeof ODD_SDLC_TYPESCRIPT_TENANT_CAPABILITIES;
}

export function describeOddSdlcTypescriptTenant(): OddSdlcTypescriptTenantInfo {
  return Object.freeze({
    kind: ODD_SDLC_TYPESCRIPT_TENANT_KIND,
    status: ODD_SDLC_TYPESCRIPT_TENANT_STATUS,
    product: "odd_sdlc",
    capabilities: ODD_SDLC_TYPESCRIPT_TENANT_CAPABILITIES
  });
}

export * from "./runtime/index.js";
export * from "./contracts/index.js";
export * from "./admission/index.js";
export * from "./authority/index.js";
export * from "./shared/blocking_reason.js";
export * from "./shared/overlay_strategy.js";
export * from "./domain/index.js";
export * from "./graph/index.js";
export * from "./workspace/index.js";
export * from "./projection/index.js";
export * from "./hooks/index.js";
export * from "./triage/index.js";
export * from "./tickets/index.js";
export * from "./operational/index.js";
export * from "./qualification/index.js";
export * from "./package_binding/index.js";
export * from "./package_api/index.js";
export * from "./install/index.js";
export {
  createOddSdlcAbgRuntimeBindingPlugins,
  oddSdlcAbgRuntimeWorkerTransportFromEnv,
  resolveOddSdlcAbgRuntimeBindingPolicy,
  type OddSdlcAbgRuntimeBindingPluginFactoryInput,
  type OddSdlcAbgRuntimeBindingPolicyInput
} from "./operator/abg_runtime_binding.js";
export * from "./postflight/index.js";
export * from "./assurance/index.js";
export * from "./release/index.js";
export * from "./workspace_api/index.js";
export * from "./gtl_conformance/index.js";
