# odd_sdlc 3.0.5 Release Note

This is a patch release for the `odd_sdlc` TypeScript tenant v3 line.

## Release Claim

The TypeScript tenant is `@odd-sdlc/typescript-tenant@3.0.5`.

The consumed ABG substrate is the immutable
`@abiogenesis/typescript-tenant@4.1.0-rc.8` release snapshot:

```text
/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.8/abiogenesis-typescript-tenant-4.1.0-rc.8.tgz
```

## Fixes

- The design-depth evaluator now treats the required component/file-target
  content-register checkpoint as external process progress. Active terminal
  output no longer keeps an evaluator alive when durable semantic checkpoint
  rows are absent.
- The evaluator run artifact records `checkpointTimeoutMs` alongside hard,
  worker, inactivity, and stdout-budget limits.
- The Data Mapper failure mode exposed by the 3.0.4 proof is classified as an
  SDLC/ABG evaluator progress-boundary defect, not a Data Mapper source defect.

## Validation

The fix was validated by:

```text
npm run build:semantic
node --test --test-name-pattern "T-181 design-depth content ledger supports incremental fragment projection|T-181 design-depth content ledger rejects empty full-section implementation pressure|T-181 incomplete design-depth fragments remain observable but not projected|T-181 installed operator declares an F_P evaluation rule" test_env/tests/test_t181_fp_evaluator_design_register.test.mjs
npm run test:t184
node --test test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs
npm run guard:data-mapper-boundary
npm_config_cache=/tmp/odd-sdlc-npm-cache npm pack --dry-run --json
```
