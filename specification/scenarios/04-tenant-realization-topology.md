# Scenario Bundle - Tenant Realization Topology

**Validates**: REQ-F-REALIZATION-001, REQ-F-REALIZATION-002, REQ-F-REALIZATION-003, REQ-F-REALIZATION-004

**Purpose**: Prove that `odd_sdlc` adopts the standard realization structure from
bootstrap without inventing artificial tenant-local roots.

This scenario validates the `odd_sdlc` source repository. Downstream
installed workspace topology is governed separately by `REQ-F-ODDSDLC-032`.

## Scenario

Inspect the live `odd_sdlc` project tree and the active specification and design
surfaces after bootstrap.

## Significant Paths

- success path: `build_tenants/` exists with canonical registry and shared
  `common/` realization root in the source repository
- boundary path: `specification/` remains singleton constitutional authority
  while realization structure lives beneath `build_tenants/`
- fail-closed path: tenant-local roots are absent until real local realization
  law exists
- documentation path: supporting documentation stays outside the constitutional
  and realization-law roots

## Expected Outcomes

1. `build_tenants/` exists as the project-owned realization root
2. `build_tenants/TENANT_REGISTRY.md` records `common` as the source-repository
   bootstrap realization root
3. shared realization surfaces are explicit without inventing a fake tenant
4. `docs/` exists as a supporting, non-constitutional root
