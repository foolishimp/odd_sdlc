# odd_sdlc v2.0.0-rc.4 Release Note

## RC Identity

- product: `odd_sdlc`
- candidate: `v2.0.0-rc.4`
- RC branch: `rc/2.0.0`
- predecessor: `v2.0.0-rc.3`
- release state: fourth published release candidate for the `2.0.0` line

## Position

`v2.0.0-rc.4` carries the T-171 data_mapper full-lifecycle proof from the
continued `test82` workspace and hardens the T-102 boundary around
framework-owned evaluation carriers.

The main runtime fixes are:

- installed-operator execution shards honor the manifest timeout unless an
  explicit cap is configured
- `derive_test_execution_result_surface` admits failed execution evidence as
  repair input without letting product-materialization edges close on failed
  execution
- execution-result surfaces can make scoped tenant source/test/build repairs,
  while the installed operator remains the writer of execution evidence
- framework-owned target carrier prompts no longer ask F_P workers to fill
  evaluator payload, summary, or evidence fields
- cross-archive worker-result consumers now reject unstamped projection reports

## Data Mapper Live Proof

The RC proof uses the preserved data_mapper `test82` workspace:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl
```

The final live command returned `status: converged`:

```text
node /Users/jim/src/apps/odd_sdlc/build_tenants/typescript/build/semantic/code/src/cli/main.js start --workspace . --target next --until converged --worker 'process://claude?model=sonnet&effort=xhigh'
```

Accepted terminal archive:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260519T045221059Z_pid80159
```

Accepted execution-result archive:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260519T042607954Z_pid80159
```

The accepted final segment closes:

- `derive_test_execution_result_surface`: `437/437`, all seven shards
  succeeded with `status = 0`
- `qualify_component_test_execution_surface`: `932/932`
- `derive_component_repair_schedule_surface`: `932/932`
- `derive_test_run_archive_surface`: `1052/1052`
- `derive_release_depth_parity_surface`: `1/1`
- `prepare_release_surface`: `1048/1048`

The proof summary is archived at:

```text
.ai-workspace/release-cuts/typescript/20260519T051709Z_t171_data_mapper_test82_rc4/t171-data-mapper-test82-rc4-proof-summary.json
```

## Qualification Bundle

- `npm run test:semantic` - 643/643 passed
- `npm run lint:semantic` - passed
- `npm run lint:test-harness` - passed
- `git diff --check` - passed
- `odd-sdlc-ts release-cut --archive-root .ai-workspace/release-cuts/typescript/20260519T051709Z_t171_data_mapper_test82_rc4` - passed

Release-cut artifact:

```text
.ai-workspace/release-cuts/typescript/20260519T051709Z_t171_data_mapper_test82_rc4/package/pack-dwdQfY/odd-sdlc-typescript-tenant-0.0.0-dev.tgz
```

## Known Limitations

- This is an RC, not the final `2.0.0` release.
- The `test82` workspace was intentionally continued rather than restarted;
  earlier failed attempts in that sandbox remain forensic evidence.
- The accepted RC4 live proof is the final data_mapper closure segment listed
  above, after the execution-result surface and downstream release surfaces
  converged.

## RC Boundary

- RC branch: `rc/2.0.0`
- RC tag: `v2.0.0-rc.4`

This RC tag is immutable. Further work in the `2.0.0` window must publish a new
RC tag rather than mutating this cut.
