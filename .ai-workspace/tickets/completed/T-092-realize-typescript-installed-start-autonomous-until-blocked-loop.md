---
id: T-092
title: Realize TypeScript installed start autonomous until-blocked loop
type: bug
ticket_category: rc_blocker
status: completed
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Make installed `odd-sdlc-ts start --workspace . --target next --until blocked --worker ...` behave as the operator-facing autonomous loop promised by PRODUCT.md and REQ-F-ODDSDLC-051, while keeping ABG event truth as the selection authority.
change_class: design_reframe
re_entry_point: design
affected_boundary: installed CLI start adapter, public start adapter, ABG replay-backed gap projection, installed operator loop, data_mapper live qualification
priority: critical
triaged_at: 2026-04-28T08:04:12Z
created_at: 2026-04-28T08:04:12Z
updated_at: 2026-04-28T15:16:56Z
completed_at: 2026-04-28T15:16:56Z
dependencies:
  - T-041 active
  - T-091 active
blocks:
  - T-041 active
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: data_mapper.test53.ts live run showed every successful TypeScript `start --until blocked --worker process://codex` invocation exits after one edge with `next_action: rerun_gaps_or_start_next_edge`. This proves manual continuation, not the test35-style autonomous operator loop requested for RC.
active_product_refs:
  - specification/PRODUCT.md#the-minimum-installed-operator-loop-is
active_requirement_refs:
  - specification/requirements/14-odd-sdlc-installed-product-contract.md#REQ-F-ODDSDLC-051
active_design_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_RECURSIVE_REALIZATION_DEEPENING.md
test53_evidence:
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test53.ts
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test53.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T071544053Z_pid39017
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test53.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T075655266Z_pid71617
target_truth: `publicStartOnce` remains one pure public-start projection over ABG. The installed CLI command `start --until blocked|converged` owns only the operator-facing repetition: re-read installed event truth, ask public start for the next ABG-selected transition, invoke the worker or F_D transition, append admitted events, and repeat until a real blocked/converged/worker-failed state or a bounded loop guard. The loop must expose its step count and stop reason in proof output.
superseded_truth: A successful installed `start --until blocked` may lawfully exit after one edge with `next_action: rerun_gaps_or_start_next_edge`, leaving the operator or agentic coder to manually run `gaps` and `start` for the next edge.
closure_law: this ticket closes only when a deterministic installed CLI test proves one command advances across multiple edges from ABG replay truth and stops on a real block, without moving traversal-selection authority into `publicStartOnce`; and a live successor run can use one `start --until blocked --worker process://codex` invocation as the autonomous test harness.
evaluation_criteria:
  - `publicStartOnce` remains a single projection with no hidden semantic loop
  - installed CLI `start --until first_traversal` preserves one-edge behavior
  - installed CLI `start --until blocked` repeats over ABG event truth when each edge closes
  - the loop stops on worker failure, worker report rejection, unsupported transition, topology block, true convergence, or bounded loop guard
  - compact output reports loop step count and loop stop reason
  - deterministic test proves at least two edge attempts occur inside one installed CLI invocation
  - test53 postmortem distinguishes manual-continuation evidence from autonomous-loop proof
non_closure_conditions:
  - the loop selects next edges from local mutable state instead of ABG replay/gaps projection
  - `publicStartOnce` becomes a recursive controller
  - CLI hides the number of steps or stop reason
  - live data_mapper evidence still requires manual `gaps -> start` between successful edges
---

## Supersession Notice - 2026-05-01

This ticket is superseded as architecture.

The implementation proved a useful operator shell, but the ticket's target
truth misframed that shell as an installed odd_sdlc autonomous loop. The
operator later clarified the intended boundary: odd_sdlc should not own a loop
that re-enters ABG one vector at a time. At most, odd_sdlc may provide a thin
shell or installed context instructions (`AGENTS.md` / `CLAUDE.md`) that tell
an agent how to start ABG. Runtime traversal, retry budget, vector advancement,
continuation, and closure are ABG responsibilities.

Therefore the completed evidence below is historical containment evidence, not
accepted final architecture. The active correction is:

- T-102: typed F_P function stages and ABG-owned admission flow.
- T-105: migrate `start --until converged` to ABG-owned whole-graph iteration.

T-092 must not be cited as authority for odd_sdlc owning an autonomous
multi-edge traversal loop.

## STDO Triage

First missing layer: design.

The product and requirement surfaces already require an installed operator
loop. The TypeScript design and tests intentionally protected
`publicStartOnce` from becoming a tenant-local hidden loop. That protection is
correct for the pure public-start adapter, but it was over-applied to the
installed CLI command. The installed CLI is the operator-facing effect shell and
may repeat the lawful cycle as long as each iteration re-enters through ABG
event truth.

## Observed Failure

`data_mapper.test53.ts` progressed through multiple edges only because Codex
manually repeated:

```text
gaps -> start -> gaps -> start
```

Each successful start exited with:

```text
status: worker_invoked
next_action: rerun_gaps_or_start_next_edge
```

That is not the test35-style external behavior where one operator command runs
until blocked.

## Design Correction

Keep this separation:

```text
publicStartOnce = pure one-step ABG handoff projection
installed CLI start --until blocked = bounded effect shell loop over ABG truth
```

The CLI loop does not choose graph edges. Each step reconstructs public start
from installed workspace state and reads the event log through existing ABG
projection machinery.

## Closure Evidence

The installed CLI now keeps `publicStartOnce` as a one-step projection and uses
the installed command as the bounded effect shell for `--until blocked`.

Verification:

- `npm run test:semantic`: passed, 137 tests.
- `npm run lint:semantic`: passed.

External live evidence:

- workspace:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test55.ts`
- command:
  `ODD_SDLC_TS_OUTPUT=json node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex`

The single command traversed the installed graph autonomously from bootstrap
through the test archive edge before stopping on a real worker-report/test
evidence issue. The run created the following ordered edge archives without
manual `gaps -> start` between successful edges:

- `20260428T132140789Z_pid36703` — `Fg_conform_project`
- `20260428T132140836Z_pid36703` — `derive_product_surface`
- `20260428T132543690Z_pid36703` — `derive_goal_surface`
- `20260428T132909460Z_pid36703` — `derive_requirement_surface`
- `20260428T133234737Z_pid36703` — `derive_feature_decomp_surface`
- `20260428T133604619Z_pid36703` — `derive_uat_testcases_surface`
- `20260428T134016361Z_pid36703` — `derive_design_surface`
- `20260428T134507413Z_pid36703` — `derive_scenario_surface`
- `20260428T134923904Z_pid36703` — `derive_implementation_design_surface`
- `20260428T135359288Z_pid36703` — `select_implementation_stack`
- `20260428T135811261Z_pid36703` — `derive_implementation_module_surface`
- `20260428T140055338Z_pid36703` — `derive_realization_schedule_surface`
- `20260428T140523595Z_pid36703` — `derive_code_surface`
- `20260428T141007615Z_pid36703` — `derive_test_design_surface`
- `20260428T141917840Z_pid36703` — `select_test_stack`
- `20260428T142336111Z_pid36703` — `derive_test_module_surface`
- `20260428T142609613Z_pid36703` — `derive_test_schedule_surface`
- `20260428T143553546Z_pid36703` — `derive_test_run_archive_surface`
- `20260428T144014538Z_pid36703` — same-edge retry/repair at
  `derive_test_run_archive_surface`

This closes the T-092 distinction: `publicStartOnce` remains non-recursive,
while installed `start --until blocked` is the autonomous operator loop.
