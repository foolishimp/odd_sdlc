# Scenario Bundle - Tenant Realization Topology

**Validates**: REQ-F-REALIZATION-001, REQ-F-REALIZATION-002, REQ-F-REALIZATION-003, REQ-F-REALIZATION-004, REQ-F-REALIZATION-005, REQ-F-REALIZATION-006

**Purpose**: Prove that `odd_sdlc` adopts the standard realization structure from
bootstrap, keeps mutable named instances subordinate beneath tenant
`workspaces/`, and does not carry a repo-root installed runtime as source
authority.

This scenario validates the `odd_sdlc` source repository. Downstream
installed workspace topology is governed separately by `REQ-F-ODDSDLC-032`.

## Scenario

Inspect the live `odd_sdlc` project tree and the active specification and
design surfaces after bootstrap.

## Significant Paths

- success path: `build_tenants/` exists with canonical registry and shared
  `common/` realization root in the source repository
- boundary path: `specification/` remains singleton constitutional authority
  while realization structure lives beneath `build_tenants/`
- instance path: any mutable named instances remain subordinate beneath tenant
  `workspaces/` rather than competing with source realization roots
- runtime-boundary path: repo-root `.genesis/` is absent from the source
  repository; source commands bind to the ABG source/release substrate and
  installed workspaces receive their own `.genesis/` runtime during install
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
5. mutable named instances, when introduced, belong beneath
   `build_tenants/<tenant>/workspaces/<name>/` and do not become source
   authority
6. repo-root `.genesis/` is not present in the source repository and is not
   treated as source truth
