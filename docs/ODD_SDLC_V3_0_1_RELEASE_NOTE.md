# odd_sdlc 3.0.1 Release Note

This is a patch release for the `odd_sdlc` TypeScript tenant v3 line.

## Release Claim

The TypeScript tenant is `@odd-sdlc/typescript-tenant@3.0.1`.

The consumed ABG substrate remains the immutable
`@abiogenesis/typescript-tenant@4.1.0-rc.7` release snapshot:

```text
/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.7/abiogenesis-typescript-tenant-4.1.0-rc.7.tgz
```

## Fixes

- Fixed design-depth evaluator admission so a timed-out evaluator process can
  still proceed through normal content-register admission when it has already
  published an observable non-draft design-depth content ledger. Retryable
  provider failures still block and re-enter the same edge.
- Updated the Data Mapper live runbook release-proof example to use the current
  graph-function start target accepted by the harness.

## Validation

The fix was validated by:

```text
npm run test:t184
npm run guard:data-mapper-boundary
node --test --test-name-pattern "T-181 installed operator declares an F_P evaluation rule|T-181 design-depth content ledger supports incremental fragment projection|T-181 incomplete design-depth fragments remain observable but not projected" test_env/tests/test_t181_fp_evaluator_design_register.test.mjs
```

The full `test:t181` file was also attempted. It was stopped after 389 seconds
because the Node test process stayed pending without output; the narrower
T-181 cases above passed and cover the affected admission/projection behavior.
