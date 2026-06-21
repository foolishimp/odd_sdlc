# T-204 Phase 5 Register Purpose Cleanup

Status: completed

## Boundary

This phase applied `DESIGN_MODULE_METHOD.md` carrier consolidation to the
remaining register surface.

The rule used:

- keep SDLC product registers that carry domain meaning
- keep SDLC product projections only when they are read models over admitted
  truth
- delete wrappers that exist only to preserve installed-operator/runtime
  envelope identity
- make the evaluate content carrier one ledger-shaped carrier, not a ledger plus
  legacy register projection

## Changes

- Removed the retired `sdlc_installed_operator_traversal_consequence` envelope
  from `deriveInstalledTraversalConsequence(...)`.
- Removed `sdlc_installed_operator_traversal_consequence` from the register
  purpose catalog.
- Removed the `retired_adapter_only` purpose class because no current source
  carrier uses it.
- Promoted the F_P evaluator content artifact to
  `sdlc_evaluate_content_ledger` with `ledgerVersion:
  "ts-evaluate-content-ledger-v1"` and row kind
  `sdlc_evaluate_content_ledger_row`.
- Removed the legacy `sdlc_evaluate_content_register` projection constants from
  source.
- Renamed evaluate-content diagnostics from `evaluate_content_register_*` to
  `evaluate_content_ledger_*`.
- Kept non-ledger product registers on `registerVersion`; only the
  evaluate-content ledger uses `ledgerVersion`.

Compatibility note: helper function/type names containing `ContentRegister`
remain as local implementation names because the durable file path remains
`design_depth_fp_evaluator_content_register.json`. They no longer define a
separate carrier kind or purpose row.

## Current Source Size

- `build_tenants/typescript/code/src`: 175 TypeScript files
- source lines: 94,894
- delta from Phase 0 baseline: -4 files, -503 lines
- delta from Phase 4: 0 files, -38 lines

## Guards

Source scans pass with no matches under `build_tenants/typescript/code/src` for:

- `sdlc_evaluate_content_register`
- `ts-evaluate-content-register-v1`
- `SDLC_EVALUATE_CONTENT_REGISTER_*`
- `evaluate_content_register`
- `legacy_projection`
- `retired_adapter_only`
- `sdlc_installed_operator_traversal_consequence`

Additional scan pass:

- no non-ledger product register uses `ledgerVersion`
- no evaluate-content ledger fixture uses `registerVersion`

## Validation

Passed:

```text
npm run build:semantic
node --test \
  test_env/tests/test_t197_product_gtl_gate.test.mjs \
  test_env/tests/test_t184_handoff_partition_boundary.test.mjs \
  test_env/tests/test_t181_fp_evaluator_design_register.test.mjs \
  test_env/tests/test_t187_fp_evaluator_prompt_boundary.test.mjs \
  test_env/tests/test_t151_runner_evaluator_sovereignty.test.mjs \
  test_env/tests/test_t158_consequence_admission_regression.test.mjs \
  test_env/tests/test_t172_staged_target_carrier_contract.test.mjs \
  test_env/tests/test_t174_feature_dependency_dag_frontier.test.mjs
```

Focused result: 157 tests passed.
