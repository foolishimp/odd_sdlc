# Closure Note: Hello-World Live Validation And T-143 Parser Regressions

## Status

Fresh Claude live runs passed for both hello-world lanes after replacing
brittle live assertions with deterministic generated-output validation.

Evidence:

- T-132 archive:
  `build_tenants/typescript/test_env/test_runs/t132_hello_world_single_tenant_bootstrap_sandbox/20260511T080121136Z_pid37429`
- T-133 archive:
  `build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260511T081405149Z_pid6629`

Both archives contain:

- `authority_conformance_live_validation.json` with `verdict: "passed"`
- `product_execution_live_validation.json` with `verdict: "passed"`
- `run_summary.json`

## Root Causes Fixed

1. Live tests were using brittle exact-string assertions against generated
   authority text. They now produce deterministic validation artifacts that lint
   the generated authority surfaces and product execution proof.

2. Local requirement headings could be misread as reference-only obligations
   because the heading regex used `\s{0,3}`, which can consume the newline
   before a heading. This made otherwise concrete generated requirement
   headings fail traversal-intent package admission. The regex now uses
   horizontal whitespace only.

3. Product materialization authority parsing did not accept role-annotated
   `Expected Files` headings and Rust file targets cleanly. The parser now
   accepts `Expected Files`, classifies `src/main.rs` as source, admits
   runner-prefixed execution evidence such as `cargo run --quiet` for a `cargo`
   contract, and strips backticked `(role: ...)` annotations without creating
   malformed duplicate targets.

## Verification

Commands run from `build_tenants/typescript`:

```text
npm run test:semantic
node --test test_env/live/test_t132_hello_world_single_tenant_live_build.test.mjs test_env/live/test_t133_rust_hello_world_minimal_live_build.test.mjs
TERM=xterm-256color ODD_SDLC_TS_T132_HELLO_WORLD_SINGLE_TENANT_WORKER='process://claude' ODD_SDLC_TS_T132_HELLO_WORLD_SINGLE_TENANT_INSTALLED_COMMAND_TIMEOUT_MS=900000 npm run test:t132:hello-world-live
TERM=xterm-256color ODD_SDLC_TS_T133_RUST_HELLO_WORLD_WORKER='process://claude' ODD_SDLC_TS_T133_RUST_HELLO_WORLD_INSTALLED_COMMAND_TIMEOUT_MS=900000 npm run test:t133:rust-live
```

Final semantic run after parser cleanup:

```text
423 pass, 0 fail
```

Final non-live hello-world syntax/fixture check:

```text
4 pass, 2 skipped
```

No leaked `screen`, Claude, test, or `odd-sdlc-ts start` workers remained after
the live runs.
