# T-171 Hello-World Lifecycle RC Checkpoint

Status: RC checkpoint, not final release.

Scope: TypeScript hello-world lifecycle lane only. This checkpoint does not close
T-171 and does not claim data_mapper/test35 parity.

## Package Cut

- package: `@odd-sdlc/typescript-tenant@0.0.0-dev`
- binary: `odd-sdlc-ts`
- release cut: `.ai-workspace/release-cuts/typescript/20260518T125740Z_t171_hello_world_lifecycle_rc`
- tarball: `.ai-workspace/release-cuts/typescript/20260518T125740Z_t171_hello_world_lifecycle_rc/package/pack-8e6PCK/odd-sdlc-typescript-tenant-0.0.0-dev.tgz`
- source branch: `main`
- source commit: `3dfa7502e6de2e10948fce8eee30fe3fbeeffb2c`
- worktree state at cut: dirty checkpoint worktree, not a final clean release tag

## Live Evidence

- command: `npm run test:t132:hello-world-live`
- result: `tests 1`, `pass 1`, `fail 0`
- run archive: `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297`
- final edge: `prepare_release_surface -> release_surface`
- final closure disposition: `close`
- execution edge: `derive_test_execution_result_surface`
- execution evidence: `succeeded`
- execution command: `node --test test/hello.test.js`
- execution counts: `tests=1`, `passed=1`, `failed=0`

## Analyzer Evidence

- analysis JSON: `live-run-analysis.json`
- analysis markdown: `live-run-analysis.md`
- inspected kind: `run-archive`
- operator run count: `28`
- unique graph edges: `19`
- same-edge retries: `2`
- repair attempts: `4`
- blocked attempts: `2`
- yielded attempts: `0`
- aborted attempts: `0`
- final closure disposition: `close`

## Boundary

This is an RC checkpoint over the successful hello-world lifecycle proof plus
the package release-cut artifact. It is not a final release. It is not a
data_mapper successor proof. T-171 still requires the data_mapper/test35
comparison before closure.
