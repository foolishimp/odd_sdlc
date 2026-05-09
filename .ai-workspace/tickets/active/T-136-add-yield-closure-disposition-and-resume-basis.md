---
id: T-136
title: Add yield closure disposition and resume basis
type: feature
ticket_category: ordinary
status: active
review_status: triaged_pending_implementation
goal: typescript-rc-lawful-iterate-disposition
build_tenant: typescript
owner: odd_sdlc
change_intent: Add `yield` as a first-class replay-visible SdlcEdgeClosureDecision disposition so lawful open/progress states stop being collapsed into retry, block, timeout, or local runner loops.
change_class: realization_refactor
re_entry_point: code
affected_boundary:
  - build_tenants/typescript/code/src/assurance/
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/runtime/
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md
  - build_tenants/typescript/test_env/tests/
priority: critical
rc_blocker: true
release_blocker_reason: Non-close progress currently has no lawful yield disposition and can collapse into retry, block, timeout, or hidden local loops.
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-09
completed_at: null
source_ticket: T-109
governance_scope: STDO Method
dependencies:
  - T-109 publish authoritative edge ledger lineage chain
  - T-129 ABG 3.7.1 evaluator and liveness substrate migration
related_tickets:
  - T-135 realize evaluator-owned runner traversal spine
intake_source: The T-109 axiom review restored yield as the lawful iteration boundary, matching the successful Python/test35 substrate behavior where yielded is an active state distinct from completed, failed, timed_out, and superseded.
target_truth: `SdlcEdgeClosureDecision` is a sum type over `close | yield | retry | repair | re-enter | reprice | block`. `yield` keeps the same edge/attempt lawfully open through replay-visible resume truth when progress or waiting state is admitted.
superseded_truth: Non-close work is flattened into retry, block, timeout, local installed-operator waiting, or hidden CLI process continuation.
closure_law: This ticket closes only when yield is represented in typed closure carriers, projection, runner behavior, public read models, and deterministic tests; and when timeout/liveness cannot silently promote yield into semantic failure or closure.
evaluation_criteria:
  - `SdlcEdgeClosureDecision` includes a `yield` disposition.
  - Yield carries `yield_kind`, `resume_basis_ref`, `current_edge_ref`, `admitted_progress_refs`, and `liveness_projection_ref` or equivalent typed refs.
  - Supported yield kinds include process active under liveness observer, budget checkpoint with admitted progress, awaiting external execution evidence, bounded operator pause, and partial product evidence admitted for current edge.
  - Awaiting F_H input is yield only when same-edge resume is lawful; absent constitutional/product/design authority remains reprice or block.
  - The runner returns control on yield and does not dispatch a new graph action.
  - Public status/gaps can display yield without treating it as failure.
  - Liveness inactivity alone cannot create semantic failure, semantic closure, or requirement non-satisfaction.
  - A positive test proves admitted progress plus bounded stop yields and later resumes the same edge from the resume basis.
  - A negative test proves no yield is admitted when the resume basis is missing or the current edge is no longer lawful.
  - A negative test proves process timeout/interruption is not reclassified as yield without typed resume truth.
proof_surface:
  - build_tenants/typescript/test_env/tests/test_t136_yield_closure_disposition.test.mjs
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md
  - runtime closure decision archives carrying yield disposition and resume refs
non_closure_conditions:
  - Yield exists only as prompt prose or status text.
  - Yield is represented as retry_same_edge.
  - Yield is represented as block, timeout, or generic pending.
  - The runner keeps a hidden local loop alive instead of returning a replay-visible yield disposition.
  - Yield can resume without predecessor refs and current-edge legality proof.
---

# T-136: Add Yield Closure Disposition And Resume Basis

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

Change-class note: this is a realization refactor only under the T-109 design
surface. This ticket cannot close until T-109 ratifies the yield disposition in
the axiomatic closure target.

The design target already changed under T-109. This ticket realizes the missing
closure state. It does not redefine bootstrap, graph functions, or ABG liveness.

## Yield Law

```text
same edge/attempt remains lawful
progress or waiting state is admitted
resume basis is replay-visible
control returns without failure classification
```

Yield is not retry. Yield is not block. Yield is not timeout. Yield is not a CLI
loop.

## Implementation Notes

- Add yield to the typed closure decision carrier before adapting runner logic.
- Treat liveness as supporting evidence only.
- Keep resume semantics replay-derived; do not store hidden process/session
  state as the resume authority.
