# Scenario Bundle - First odd_sdlc Asset Function Call

**Validates**: REQ-F-ASSETMODEL-001, REQ-F-ASSETMODEL-002, REQ-F-ASSETMODEL-003, REQ-F-ASSETMODEL-004, REQ-F-ASSETMODEL-005, REQ-F-ODDSDLC-001, REQ-F-ODDSDLC-002, REQ-F-ODDSDLC-003, REQ-F-ODDSDLC-004, REQ-F-ODDSDLC-005, REQ-F-ODDSDLC-006, REQ-F-ODDSDLC-008

**Purpose**: Prove that `odd_sdlc` can bind workspace assets by URI, publish
the first asset-function catalog, run the first bootstrap-plus-fanout
dependency chain through ABG, and audit the result from substrate fact truth.

## Scenario

Create or use a bounded workspace with either the canonical bootstrap
specification surfaces already present or an imported project shape that
`odd_sdlc` can deterministically normalize for its own operation, then bind
those surfaces into the first `odd_sdlc` asset nodes and run the first declared
dependency chain through the tenant’s app-owned entry surface in an installed
development environment:

- `derive_intent_surface`
- `derive_product_surface`
- `derive_goal_surface`
- `derive_requirement_surface`
- `derive_feature_decomp_surface`
- `derive_uat_testcases_surface`
- `derive_design_surface`
- `derive_scenario_surface`
- `derive_implementation_design_surface`
- `select_implementation_stack_profile`
- `derive_implementation_module_surface`
- `derive_code_surface`
- `derive_test_design_surface`
- `select_test_stack_profile`
- `derive_test_module_surface`
- `derive_test_run_archive_surface`
- `qualify_testcase_authority`
- `prepare_release_surface`

## Significant Paths

- publication path: the tenant publishes a GTL module with the first
  `odd_sdlc` function catalog
- install-and-normalize path: the tenant can install itself into an imported or
  stale workspace, write the runtime contract, and standardize the canonical
  bootstrap surfaces required for operation
- binding path: workspace assets are inventoried and classified by URI and
  asset type
- gaps path: the tenant can project the first runtime gaps over the published
  function catalog
- start path: the dependency chain advances through the bootstrap calls in
  declared order
- fan-out path: the generated requirement surface becomes the lawful source for
  both feature decomposition and UAT testcase outputs
- downstream path: the generated feature decomposition and UAT testcase
  surfaces become lawful sources for design, then design becomes a lawful
  source for scenarios, and UAT plus scenarios become lawful sources for
  testcase-authority output
- recursive-implementation path: the generated design and scenario surfaces
  open a bounded recursive implementation SDLC that yields implementation
  design, explicit stack choice, generated module structure, and executable
  code under `build_tenants/odd_method/python/code`
- recursive-test path: the generated design and scenario surfaces open a
  bounded recursive test SDLC that yields test design, explicit stack choice,
  generated test module structure, and archived test-run evidence
- release path: the generated design, scenarios, executable code, testcase
  authority, and test archive evidence become lawful inputs to release
  together with requirements
- query path: the tenant exposes a domain query library that a UI can compose
  with ABG runtime projections
- executive path: the tenant exposes one public GTL executive graph function
  whose materialized vectors drive the current published asset-function chain
  through the bounded constructor and assessed-result loop
- audit path: the proving lane reads the resulting event log and verifies the
  graph-call and run lifecycle from substrate facts
- consensus path: the tenant also publishes one isolated consensus round and
  one reusable higher-order consensus harness over typed
  `design -> review_assessment -> consensus_decision -> reviewed_design`
  assets, with live proof that two reviewer identities can assess the same
  design surface through ordinary ABG ingest

## Expected Outcomes

1. the first `odd_sdlc` asset catalog is inspectable and machine-readable
2. assets are bound into typed asset nodes rather than treated as one hidden
   project graph
3. `odd_sdlc` executes through GTL and ABG rather than a product-local
   imperative controller
4. the proving lane explains the bootstrap chain, the first requirements
   fan-out, the deeper scenario/authority branch, the recursive
   implementation-SDLC branch, and the recursive test-SDLC-to-release branch
   from emitted runtime facts
5. the tenant exposes domain query logic without duplicating the ABG runtime
   model that the UI should already understand directly
6. the tenant exposes one executive GTL graph function that can drive the
   current toy subgraph to `release_surface` without redefining ABG runtime
   semantics
7. imported or stale workspaces can be normalized into the canonical odd_sdlc
   runtime shape without manual bootstrap surgery
8. the tenant exposes one reusable higher-order consensus harness whose outer
   contract and injected stage functions are machine-readable and whose live
   proof remains attributable through ordinary ABG event and provenance flow
