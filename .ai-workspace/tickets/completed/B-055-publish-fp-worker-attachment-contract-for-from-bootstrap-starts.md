---
id: B-055
title: Publish F_P worker attachment contract for from-bootstrap starts
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: none
library_rationale: this is the odd_sdlc-installed workspace boundary between public start, ABG dispatch, and the operator-provided worker runtime; no existing reusable local library owns this attachment/readiness contract
status: completed
goal: no-silent-fp-dispatch-without-worker
change_intent: `data_mapper.test39` showed that a fresh installed workspace can admit execution, dispatch an F_P manifest, and then wait forever because no worker loop is attached. The public `start --until converged` path must either prove that an admitted worker attachment exists before F_P dispatch, or return a lawful blocked/yielded public result that tells the operator which worker attachment is missing. It must not silently enqueue work to a queue with no consumer.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: installed runtime contract, workspace bootstrap guidance, public `start(next)` F_P dispatch readiness, ABG dispatch handoff status, fp manifest/result queue projections, runtime events, source/install proof lanes
priority: critical
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
dependencies:
  - B-051 completed
  - B-052 completed
  - B-054 active
intake_source: `data_mapper.test39` forensic and `20260424T100000Z_REVIEW_b051-b052-test39-remediation-coverage.md`; test39 dispatched one F_P manifest and received zero worker results because no `oddchat`/worker loop was attached
target_truth: a from-bootstrap installed workspace has one explicit F_P worker attachment/readiness contract before public start can treat F_P dispatch as progress. If the worker loop is not attached, `start --until converged` stops with an operator-facing blocked/yielded result such as worker-unattached, names the expected queue/attachment surface, and leaves runtime truth inspectable. If a worker loop is attached, F_P dispatch is consumed through that admitted attachment rather than through undocumented sidecar folklore.
superseded_truth: installed public start may write an F_P manifest to `.ai-workspace/fp_manifests/` and wait for `.ai-workspace/fp_results/` even when no worker process, worker-room bootstrap, or runtime attachment exists. The only evidence is a missing result directory or an empty queue, which makes the run look stalled rather than lawfully blocked.
closure_law: this ticket closes when the worker attachment/readiness seam is declared, projected, and enforced before or at the first F_P dispatch boundary. Closure requires source and install proofs for both cases: no attached worker produces a lawful operator-facing blocked/yielded result without silent hang, and an admitted test worker attachment consumes at least one F_P dispatch in a fresh installed workspace. The fix must remain subordinate to ABG continuation and must not create a second tenant-owned traversal loop.
evaluation_criteria:
  - no-worker fresh install does not silently dispatch and wait forever
  - the public result names the missing worker attachment/readiness truth in operator terms
  - an admitted test worker attachment can consume an F_P manifest and return a result through the normal ABG/odd_sdlc result ingress
  - bootstrap/runtime contract text states how the worker attachment is provided or why the run is blocked
  - odd_sdlc does not own a rival multi-step worker loop beside ABG continuation
proof_surface:
  - source proof that public start classifies no-worker F_P dispatch readiness as a lawful blocked/yielded result
  - source proof that attached test worker readiness allows one F_P dispatch/result round trip through the normal ingress
  - install proof on a fresh imported workspace that no-worker start does not hang or silently enqueue unconsumed work
  - install proof on a fresh imported workspace with admitted test worker attachment that at least one F_P dispatch is consumed
non_closure_conditions:
  - closure is claimed while a fresh install can still emit `fp_dispatched` with no worker attachment and no classified public stop
  - the repair relies on undocumented operator side effects or local shell folklore not represented in bootstrap/runtime truth
  - odd_sdlc starts a tenant-owned multi-step runtime loop that bypasses ABG continuation authority
  - a primed workspace or manually edited queue is used as proof for the from-bootstrap path
---

## Why This Ticket Exists

`data_mapper.test39` proved that the current installed path can dispatch work
to nobody.

The last successful comparable run, `data_mapper.test35`, had an external
worker/chat loop attached outside `genesis.yml`. The fresh v3.2.0 workspace did
not. The product should not require hidden runtime folklore to distinguish
"work is running" from "no worker is attached."

This is an RC blocker because from-bootstrap traversal cannot be considered
live while the first F_P dispatch can disappear into an unconsumed manifest
queue.

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`

This ticket reads current design truth from:

- `build_tenants/python/design/README.md`
- `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`
- `build_tenants/python/design/adrs/ADR-002-abg-continuation-authority-and-cooperative-operational-dispatch.md`

This ticket reads current forensic truth from:

- `.ai-workspace/comments/claude/20260424T090000Z_MATRIX_test39-regression-vs-test35.md`
- `.ai-workspace/comments/claude/20260424T100000Z_REVIEW_b051-b052-test39-remediation-coverage.md`
- `.ai-workspace/comments/codex/20260424T101838Z_FORENSIC_test39_failure_ledger.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`

## Migration Declaration

- old_truth_path: F_P worker readiness is implicit operator/environment folklore; public start treats manifest dispatch as progress even when no worker can consume it
- new_truth_path: one admitted worker attachment/readiness contract governs whether public start may dispatch F_P work or must stop with classified no-worker truth
- producers_old:
  - external `oddchat_bootstrap` or manual operator process, when present
  - `.ai-workspace/fp_manifests/` as an unowned queue
  - operator inference from missing `.ai-workspace/fp_results/`
- producers_new:
  - installed runtime contract or workspace runtime projection declaring worker attachment/readiness
  - public start/dispatch readiness check over that projection
  - runtime event/result projection for no-worker blocked/yielded state
- consumers_old:
  - human operators watching an unconsumed manifest queue
  - RC reviewers reconstructing missing worker state from events
- consumers_new:
  - public `start(next)` result classification
  - `gaps` / operator analysis surfaces
  - from-bootstrap RC proof harness
  - installed bootstrap guidance
- projections_and_proofs:
  - public start payload
  - runtime events around `fp_dispatched` / worker readiness
  - fp manifest/result queue state
  - source and installed no-worker/attached-worker proofs

## Interface Inventory

- installed runtime contract: `.genesis/odd_sdlc/release/genesis.yml`
- bootstrap guidance: generated `AGENTS.md`, `CLAUDE.md`, and project bootstrap context
- public start dispatch boundary: `odd_sdlc.app.start` and F_P dispatch integration
- ABG dispatch handoff: manifest/result queue and continuation facts
- runtime projection: events and any worker-readiness/read-model surface
- proof fixtures: source fake/test worker and installed imported workspace worker attachment

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old/new behavior are removed or repriced
- [x] recurring realization patterns are checked against existing library/commonization surfaces
- [x] ticket declares library usage and names the governing library or rationale
- [x] if the work exists in more than one build tenant, this backlog/active ticket carries only one tenant lifecycle and any sibling tenant work lives on its own suffixed ticket
- [x] ticket wording, product wording, and proof claims are reconciled before closure

## Functional Review Criteria

1. Does public start distinguish "F_P dispatched to an attached worker" from "no worker attached"?
2. Is the no-worker state a typed/public result, not an inferred timeout or missing file?
3. Is any worker-loop attachment represented in runtime/bootstrap truth before it is treated as current?
4. Does the solution remain cooperative with ABG continuation rather than becoming a tenant-owned loop?
5. Can a fresh installed workspace prove both no-worker fail-closed behavior and attached-worker progress?

## Evaluator Gate

### 1. Authority Seam Closure

- [x] one worker attachment/readiness contract owns F_P readiness truth
- [x] public start and bootstrap guidance consume that same contract

### 2. Essential Carrier Consolidation

- [x] no sidecar-only or comment-only worker readiness carrier is accepted as closure
- [x] manifest queue existence alone does not count as worker readiness

### 3. Enforcement After Proof

- [x] no-worker regression proof lands before repair
- [x] attached-worker regression proof lands before closure
- [x] installed from-bootstrap proof exercises the real manifest/result seam

## Required Break Order

1. Add no-worker source proof showing the current silent dispatch/hang risk.
2. Add no-worker installed proof over a fresh imported workspace.
3. Declare and implement one worker attachment/readiness contract or blocked projection.
4. Rebind public start dispatch readiness to that contract.
5. Add attached-worker source and install proofs through the normal F_P result ingress.
6. Update bootstrap/runtime guidance only after the contract is authoritative.
7. Verify no tenant-owned multi-step traversal loop was introduced.

## Initial Direction

1. prefer a lawful blocked/yielded public result for no-worker state before adding any worker launcher
2. if an installed worker attachment is introduced, represent it as admitted runtime truth
3. keep ABG continuation as the owner of traversal and result ingestion
4. make B-057 depend on this ticket before claiming RC readiness

## Closure Note

Closed by:

- `build_tenants/python/design/FP_WORKER_ATTACHMENT_CONTRACT.md`
- `build_tenants/python/code/odd_sdlc/worker_attachment.py`
- public-start blocked projection `blocking_reason=fp_worker_unattached`
- installed runtime guidance `worker_attachment_contract: transport_contract`
- source tests `test_b055_public_start_projects_no_worker_dispatch_as_blocked` and `test_b055_public_start_accepts_explicit_transport_contract_as_worker_attachment`
- installed tests `test_b055_install_no_worker_start_blocks_without_silent_dispatch_wait` and the attached-worker assertions in `test_b052_install_human_proxy_advances_after_resolved_policy_bundle_ref_admission`
