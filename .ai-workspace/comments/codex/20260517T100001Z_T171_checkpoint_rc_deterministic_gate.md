# T-171 Checkpoint RC Deterministic Gate

Status: checkpoint release candidate cut on deterministic proof only.

This checkpoint does not claim live hello-world or data_mapper lifecycle proof.
Live lifecycle tests are post-RC evidence and must not be used to gate this
checkpoint cut.

## Deterministic Gate

Commands run from `build_tenants/typescript`:

```sh
npm run build:semantic
npm run lint:semantic
npm run lint:test-harness
npm run test:semantic
```

Results:

- semantic build: passed
- semantic lint: passed
- test-harness lint: passed
- full semantic suite: 617/617 passed

Focused regressions also passed before the full suite:

```sh
node --test test_env/tests/test_t093_scheduling_phase.test.mjs test_env/tests/test_t101_retry_report_rejection_loop.test.mjs
node --test --test-name-pattern "T-066 installed data_mapper successor materializes source and behavioral test inventory" test_env/tests/test_t066_product_materialization_contract.test.mjs
```

## Release Cut

Release archive:

`/Users/jim/src/apps/odd_sdlc/.ai-workspace/release-cuts/typescript/20260517T095944Z_t171_checkpoint_rc`

Release manifest:

`/Users/jim/src/apps/odd_sdlc/.ai-workspace/release-cuts/typescript/20260517T095944Z_t171_checkpoint_rc/release-cut-manifest.json`

Postmortem:

`/Users/jim/src/apps/odd_sdlc/.ai-workspace/release-cuts/typescript/20260517T095944Z_t171_checkpoint_rc/release-cut-postmortem.md`

## Bug Fixed During Gate

The graph was not the failing surface. The deterministic failures exposed a
runtime admission gap:

- `test_execution_surface` had a GTL target-carrier construction template.
- The installed operator did not have a corresponding
  `test_execution_surface` payload admission branch.
- The operator therefore fell through to the generic worker-result payload,
  causing target-carrier admission to reject the edge even when the artifact
  contained the typed preparation register.

Fix:

- Added `test_execution_surface_register` admission.
- Routed `targetCarrierPayloadForState()` through that admission for
  `test_execution_surface`.
- Updated deterministic workers to emit the same selected target-carrier
  envelope required by the live F_P prompt.

## Non-Claims

- This checkpoint does not close T-171.
- This checkpoint does not prove data_mapper live parity against test35.
- This checkpoint does not claim live PTY coverage; PTY remains an explicit
  post-RC live lane.
- This checkpoint does not replace the required post-RC lifecycle comparison
  where generated tests are run as graph products and execution evidence gates
  release-level closure.
