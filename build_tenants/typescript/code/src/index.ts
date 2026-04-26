// Implements: REQ-F-ODDSDLC-040
// Implements: REQ-F-ODDSDLC-043

export const ODD_SDLC_TYPESCRIPT_TENANT_KIND =
  "odd_sdlc_typescript_tenant" as const;

export const ODD_SDLC_TYPESCRIPT_TENANT_STATUS = "build_active" as const;

export const ODD_SDLC_TYPESCRIPT_TENANT_CAPABILITIES = Object.freeze([
  "abiogenesis_substrate_bound",
  "domain_carriers",
  "gtl_module_publication",
  "workspace_ingress",
  "query_domain_projection",
  "public_start_handoff",
  "hook_contracts",
  "traceability_requirement_closure"
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
export * from "./domain/index.js";
export * from "./graph/index.js";
export * from "./workspace/index.js";
export * from "./projection/index.js";
export * from "./start/index.js";
export * from "./hooks/index.js";
