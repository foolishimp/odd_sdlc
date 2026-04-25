---
id: B-058
title: Admit operational execution edges through public start route law
type: bug
ticket_category: ordinary
status: completed
goal: public-start-can-advance-operational-execution-surfaces-after-code-convergence
change_intent: The B-057 reset repriced this ticket. Once B-059 removed the generated-code traceability blocker, the remaining RC blocker was not a stale yielded F_P resume state; it was public start route law that did not admit operational execution edges such as release, build, test, deployment, and runtime observation. Public start must classify the execution layer as an advanceable fixed-route layer and route execution edges through the bounded operational execution vector. The downstream retrofit plan remains a design/retrofit planning surface reached after runtime observation, not an execution-layer edge.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: public `start` route binding, execution-layer triage, operational graph functions, installed data_mapper RC traversal proof
priority: critical
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
dependencies:
  - B-055 completed
  - B-057 completed
  - B-059 completed
intake_source: B-057 reset sandbox at `/tmp/odd_sdlc_rc_data_mapper_20260425T041353Z`; original stale-yield symptom came from `/tmp/odd_sdlc_b057_data_mapper_20260425T022937Z`
target_truth: operational execution edges are known to triage and route binding as execution-layer fixed-route work. `start --scope workspace --target next --until converged --fh-mode human-proxy --root-mode supervised` can advance release, build, test, deployment, and runtime-observation surfaces without returning `no_lawful_route` for execution edges, then continue by ABG re-entry to the downstream design/retrofit plan surface.
superseded_truth: public start can converge through design/code and then stop at operational edges because `execution` is not an admitted re-entry/routing layer, even when the project profile declares build, test, deployment, and runtime observation contracts.
closure_law: this ticket closes when source and installed proof show execution-layer edges route through public start and the fresh data_mapper reset reaches `stop_predicate=no_open_gap` without yielded or failed runtime events.
evaluation_criteria:
  - execution-layer graph edges map to `advance_operational_execution`
  - route binding admits `execution` as an advanceable fixed-route layer
  - build/test/deployment/runtime observation edges no longer stop public start with `no_lawful_route`
  - the result does not introduce a tenant-owned traversal loop beside ABG continuation truth
proof_surface:
  - source regression test for operational execution edge routing
  - installed sandbox proof using the data_mapper template
  - event counts showing `edge_converged` and no `run_yielded` or `graph_call_failed`
non_closure_conditions:
  - closure is claimed by manually deleting runtime state or result files
  - execution edges still return `no_lawful_route`
  - the fix bypasses ABG continuation/event truth with an ad hoc odd_sdlc loop
---

## Failure Evidence

The B-057 sandbox run wrote:

- `.ai-workspace/fp_manifests/derive_code_surface_20260424T163505486316Z.json`
- `.ai-workspace/fp_results/derive_code_surface_20260424T163505486316Z.json`

The first public start yielded with:

- `status: yield`
- `handoff_reason: fd_findings`
- `stop_predicate: dispatch_required`
- `stopped_by: yield`

A second public start returned:

- `reason: F_P dispatch already in flight for edge 'derive_code_surface'`
- the same `manifest_id`
- the same `result_path`

That is a resume-state defect, not a missing worker attachment.

## Functional Review Criteria

1. Does public start classify execution as an admitted re-entry layer?
2. Do execution edges route through `advance_operational_execution` instead of `no_lawful_route`?
3. Does the route remain derived from admitted triage/gap truth rather than event archaeology?
4. Does the fix preserve ABG as the owner of run and continuation mechanics?

## 2026-04-25 Reprice And Closure Note

The original stale-yield evidence remains recorded above as intake. The reset run changed the concrete RC blocker: B-059 prevented the code-surface deterministic yield, so the public start path progressed to execution edges. The remaining failure class was an unadmitted execution re-entry/routing layer.

Closed by:

- execution-layer mapping in `build_tenants/python/code/odd_sdlc/triage.py`
- source test `test_b058_operational_execution_edges_have_public_start_route`
- fresh data_mapper reset proof at `/tmp/odd_sdlc_rc_data_mapper_20260425T041353Z`

Reset proof result:

- `status: converged`
- `stop_predicate: no_open_gap`
- final `gap_count: 0`
- event ledger: `edge_converged: 27`, `run_completed: 27`, `run_started: 27`, no `run_yielded`, no `graph_call_failed`

If the stale yielded-result resume state is reproduced independently after this RC path, it should be reopened as a separate ABI continuation/resume ticket with a focused yielded-state fixture.
