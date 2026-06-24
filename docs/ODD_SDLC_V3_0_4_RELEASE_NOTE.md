# odd_sdlc 3.0.4 Release Note

This is a patch release for the `odd_sdlc` TypeScript tenant v3 line.

## Release Claim

The TypeScript tenant is `@odd-sdlc/typescript-tenant@3.0.4`.

The consumed ABG substrate remains the immutable
`@abiogenesis/typescript-tenant@4.1.0-rc.7` release snapshot:

```text
/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.7/abiogenesis-typescript-tenant-4.1.0-rc.7.tgz
```

## Fixes

- Added a design-depth evaluator inactivity lease and persisted it in the
  evaluator run artifact.
- Added a distinct `design_depth_fp_evaluator_semantic_checkpoint_timeout`
  blocker for evaluators that publish the initial content-ledger checkpoint but
  never publish the required component/file-target semantic checkpoint. This
  routes to triage instead of automatic same-edge retry.
- Passed a compact ADR implementation-design evidence summary into the F_P
  evaluator prompt so the evaluator can write the component/file-target
  checkpoint without rediscovering large ADR tables.

## Validation

The fix was validated by:

```text
npm run build:semantic
node --test --test-name-pattern "T-181 design-depth content ledger supports incremental fragment projection|T-181 design-depth content ledger rejects empty full-section implementation pressure|T-181 incomplete design-depth fragments remain observable but not projected|T-181 installed operator declares an F_P evaluation rule" test_env/tests/test_t181_fp_evaluator_design_register.test.mjs
npm run test:t184
node --test test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs
npm run guard:data-mapper-boundary
```
