# odd_sdlc 3.0.7 Release Note

This is a patch release for the `odd_sdlc` TypeScript tenant v3 line.

## Release Claim

The TypeScript tenant is `@odd-sdlc/typescript-tenant@3.0.7`.

The consumed ABG substrate is the immutable
`@abiogenesis/typescript-tenant@4.1.0-rc.8` release snapshot:

```text
/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.8/abiogenesis-typescript-tenant-4.1.0-rc.8.tgz
```

## Fixes

- Defines the design-depth F_P evaluator's minimum semantic checkpoint as one
  source file target plus one matching component topology row and one matching
  component realization row.
- Extends the design-depth semantic checkpoint watchdog to 180 seconds while
  preserving the evaluator hard timeout.
- Teaches the GTL prompt conformance compiler to reject design-depth prompts
  that omit the minimum checkpoint obligation.

## Validation

The fix was validated by:

```text
npm run build:semantic
node --test --test-name-pattern "T-181 installed operator declares an F_P evaluation rule|T-181 design-depth content ledger supports incremental fragment projection|T-181 design-depth content ledger rejects empty full-section implementation pressure|T-181 incomplete design-depth fragments remain observable but not projected" test_env/tests/test_t181_fp_evaluator_design_register.test.mjs
npm run test:t184
node --test test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs
node --test test_env/tests/test_t194_gtl_program_conformance.test.mjs
npm run guard:data-mapper-boundary
node --test test_env/tests/test_t059_install_release_adapter.test.mjs
git diff --check
npm_config_cache=/tmp/odd-sdlc-npm-cache npm pack --dry-run --json
```
