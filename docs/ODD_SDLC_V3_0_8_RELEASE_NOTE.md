# odd_sdlc 3.0.8 Release Note

This is a patch release for the `odd_sdlc` TypeScript tenant v3 line.

## Release Claim

The TypeScript tenant is `@odd-sdlc/typescript-tenant@3.0.8`.

The consumed ABG substrate is the immutable
`@abiogenesis/typescript-tenant@4.1.0-rc.8` release snapshot:

```text
/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.8/abiogenesis-typescript-tenant-4.1.0-rc.8.tgz
```

## Fixes

- Narrows the design-depth F_P minimum semantic checkpoint to exactly the first
  file target plus matching component topology and realization rows.
- Explicitly moves stack and module rows after the minimum checkpoint so the
  evaluator cannot inflate the checkpoint into a hidden full-register synthesis.
- Teaches the GTL prompt conformance compiler to require that narrower minimum
  checkpoint marker.

## Validation

The fix was validated by:

```text
npm run build:semantic
node --test test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs
node --test test_env/tests/test_t194_gtl_program_conformance.test.mjs
npm run test:t184
npm run guard:data-mapper-boundary
git diff --check
npm_config_cache=/tmp/odd-sdlc-npm-cache npm pack --dry-run --json
```
