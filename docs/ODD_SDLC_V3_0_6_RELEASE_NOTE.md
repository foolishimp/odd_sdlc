# odd_sdlc 3.0.6 Release Note

This is a patch release for the `odd_sdlc` TypeScript tenant v3 line.

## Release Claim

The TypeScript tenant is `@odd-sdlc/typescript-tenant@3.0.6`.

The consumed ABG substrate is the immutable
`@abiogenesis/typescript-tenant@4.1.0-rc.8` release snapshot:

```text
/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.8/abiogenesis-typescript-tenant-4.1.0-rc.8.tgz
```

## Fixes

- Aligns live product/runtime substrate authority with ABG `4.1.0-rc.8`.
- Changes the design-depth F_P evaluator prompt so the first post-update
  progress checkpoint is a non-empty component/file-target semantic checkpoint,
  not an empty stack-profile placeholder followed by bounded ADR reads.
- Keeps the semantic floor strict: implementation-design registers still must
  publish non-empty stack, module, component topology, component realization,
  and file-target sections before projection.

## Validation

The fix was validated by:

```text
npm run build:semantic
node --test test_env/tests/test_t028_abiogenesis_substrate_binding.test.mjs
node --test test_env/tests/test_t180_abg_4_current_staged_compute_boundary.test.mjs
node --test --test-name-pattern "T-181 installed operator declares an F_P evaluation rule|T-181 design-depth content ledger supports incremental fragment projection|T-181 design-depth content ledger rejects empty full-section implementation pressure|T-181 incomplete design-depth fragments remain observable but not projected" test_env/tests/test_t181_fp_evaluator_design_register.test.mjs
npm run test:t184
node --test test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs
npm run guard:data-mapper-boundary
node --test test_env/tests/test_t059_install_release_adapter.test.mjs
npm_config_cache=/tmp/odd-sdlc-npm-cache npm pack --dry-run --json
```
