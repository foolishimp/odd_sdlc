---
id: T-198
title: Prove data-mapper breadth live after T-197 boundary cleanup
type: chore
ticket_category: ordinary
status: backlog
proof_status: not_started
goal: prove the data_mapper breadth lane on the reconciled SDLC boundary without making T-197's owner-partition cleanup wait on broad live-lane cost
build_tenant: typescript
owner: odd_sdlc
change_intent: >-
  Carry the T-184 H-140 data-mapper breadth live proof after T-197 stabilizes the
  product GTL gate, target-identity ingress, and graph-owned execution evidence
  path. The lane must prove clean process finalization, graph-owned
  sdlc_worker_execution_evidence, final operator artifacts, and no legacy
  handoff/fenced-carrier closure bypass.
change_class: realization_refactor
re_entry_point: tests_proof
priority: medium
triaged_at: 2026-06-09
created_at: 2026-06-09
updated_at: 2026-06-09
governance_scope: STDO Method
source_documents:
  - .ai-workspace/tickets/active/T-197-reconcile-product-boundary-and-remove-authority-leakage.md
  - .ai-workspace/tickets/completed/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - specification/PRODUCT.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md
related_tickets:
  - .ai-workspace/tickets/active/T-197-reconcile-product-boundary-and-remove-authority-leakage.md
  - .ai-workspace/tickets/completed/T-184-partition-handoff-into-compute-stage-boundary-modules.md
affected_boundary:
  - build_tenants/typescript/test_env/live/
  - build_tenants/typescript/test_env/test_runs/
  - build_tenants/typescript/code/src/operator/plugins/consequence/edge_projection.ts
  - build_tenants/typescript/code/src/operator/plugins/transform/result_projection.ts
  - build_tenants/typescript/code/src/operator/plugins/evaluate/postflight_checks.ts
excluded_boundary:
  - T-197 Wave 0 B1 product GTL gate wiring
  - T-197 H1 mapper_requirements.md cleanup
  - T-197 Wave 1 ABG authority split
target_truth: >-
  data_mapper breadth live proof is a dedicated installed-lane proof over the
  reconciled T-197 boundary. It must prove actual graph-owned execution evidence
  and process finalization from the operator archive, not harness-only process
  checks, workspace file presence, legacy handoff writers, or stale generated
  fixture acceptance.
superseded_truth: >-
  T-197 must stay open until a broad data_mapper live lane passes, or a
  data_mapper live archive may be cited without proving process finalization,
  immediate termination cause, graph-owned sdlc_worker_execution_evidence, and
  final operator artifacts.
closure_law: >-
  This ticket closes when a clean data_mapper live lane runs on a revision after
  T-197's B1/H1 boundary cleanup, the operator archive contains graph-owned
  sdlc_worker_execution_evidence for execution-result closure, final operator
  artifacts record process lifecycle and immediate termination cause, and focused
  negative checks prove legacy handoff/fenced-carrier/raw-worker-report paths
  cannot satisfy closure without selected F_P evidence.
evaluation_criteria:
  - live archive path is recorded and reviewable
  - operator summary shows final process state and immediate termination cause
  - closure evidence includes sdlc_worker_execution_evidence, not harness-only checks
  - generated-asset closure cannot bypass selected evaluate.C evidence
  - no deleted T-184 handoff or fenced-carrier surfaces are imported by the proof lane
  - semantic proof remains green on the same revision
non_closure_conditions:
  - data_mapper proof uses only harness process checks or workspace file presence
  - process lifecycle is ambiguous or the PTY remains unfinalized
  - execution-result edge closes without graph-owned sdlc_worker_execution_evidence
  - legacy handoff/fenced-carrier/raw worker report paths can still satisfy closure
  - proof runs before T-197 B1/H1 cleanup and is cited as final breadth evidence
proof_surface:
  - clean data_mapper live archive
  - focused negative proof for legacy closure bypasses
  - semantic proof on the same revision
---

# T-198: Prove Data-Mapper Breadth Live After T-197 Boundary Cleanup

## STDO Triage

First missing layer: tests/proof.

This ticket is the explicit successor for T-197 P2. T-197 owns boundary cleanup
and the lite installed proof lane; this ticket owns the broader data_mapper live
evidence once the product GTL gate and target-identity cleanup stop the lane
from proving against stale framework assumptions.

## Execution Notes

Start only after T-197 Wave 0 B1 and H1 are complete or explicitly scoped out.
Use the operator archive as the proof surface. Do not cite a live lane as clean
unless the archive carries graph-owned `sdlc_worker_execution_evidence` and final
process lifecycle evidence.
