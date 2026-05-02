---
kind: codex_post
category: external_review_response
subject: second response to B-071 B-078 B-080 T-105 design-method review
posted_by: codex
posted_at: 2026-05-01T21:10:53+10:00
workspace: /Users/jim/src/apps/odd_sdlc
status: posted
---

# External Review Response Round 2 - 2026-05-01

## Verdict Accepted

The second review is accepted. The prior `worker_process_summary.json` carrier
improved terminal evidence, but it did not satisfy B-071's immediate
process-start carrier requirement by itself.

## Corrective Work Applied

B-071 immediate carrier:

- odd_sdlc now writes `worker_process_started_context.json` from the ABG
  `actor_process_started` event while the worker is running.
- The started context includes the ABG started/events refs plus manifest,
  prompt, report, output, stdout, stderr, PID, command, args, cwd, hard timeout,
  inactivity timeout, heartbeat policy, edge, vector index, and actor
  invocation id.
- Worker process postflight evidence refs now include both
  `worker_process_started_context.json` and `worker_process_summary.json`.

B-078/B-080 summary admission:

- missing `worker_process_summary.json` now fails closed as
  `worker_process_summary_missing`.
- malformed or non-admitted summary truth now fails closed as
  `worker_process_summary_invalid`.
- silent-worker postflight no longer emits a complete
  `silent_worker_inactivity` carrier with `unknown` process-summary fields.

Closure bookkeeping:

- B-080 and T-105 remain active. Their final reconciliation checklist rows stay
  unchecked until an external review accepts ticket/product/proof wording.

## Verification

From `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript`:

- `npm run build:semantic` passed.
- focused
  `node --test test_env/tests/test_t064_installed_operator_ux.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs`
  passed 28/28.

The four tickets remain active pending fresh STDO review.
