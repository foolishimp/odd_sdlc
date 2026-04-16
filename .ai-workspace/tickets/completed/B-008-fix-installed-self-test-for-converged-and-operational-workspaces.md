# B-008 Fix Installed Self-Test For Converged And Operational Workspaces

- id: B-008
- title: Make installed odd_sdlc self-test terminate lawfully on already-converged workspaces and on workspaces with active operational-cycle edges
- type: bug
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: high
- created_at: 2026-04-16
- updated_at: 2026-04-16
- dependencies: B-005, B-007, T-006

## Triage

- intake: downstream dogfood failure / installed-product operator bug / operational-cycle continuation defect
- lawful_change_class: interface_reprice
- affected_boundary: installed odd_sdlc self-test/operator surface over bootstrap completion, operational-cycle continuation, and yielded manifest handling
- lawful_re_entry: odd_sdlc installed CLI/operator surface, self-test program semantics, and installed-workspace proof over capability-enabled workspaces
- downstream_proof_span: replay on `data_mapper.test32` plus one focused installed-workspace regression covering already-converged bootstrap state and operational-cycle activation

## Why This Ticket Exists

Dogfooding `odd_sdlc` against
`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`
exposed a real installed-product bug in the current `self-test` path.

The active workspace had already converged through the bootstrap release line,
and after declaring tenant capability contracts it lawfully exposed the
operational continuation line:

- `prepare_deployment_surface`
- `derive_runtime_observation_surface`
- `derive_retrofit_plan_surface`

But the released installed `odd_sdlc` self-test path does not handle this
state correctly.

### Observed failures

1. In the released upstream surface, `self_test.run_program()` expects every
   `start(app)` call inside the bootstrap program loop to return
   `status == "iterated"`.
2. On an already-converged bootstrap workspace, `start(app)` can lawfully
   return `status == "converged"`.
3. That causes the installed self-test to fail instead of reporting a clean
   already-converged result.
4. After operational capability contracts are declared, the workspace can also
   be bootstrap-converged while still having live operational edges.
5. In that state, the installed self-test/operator path falls back into yielded
   manifest dispatch for operational continuation rather than returning a clean
   operator-usable summary.

This is not a `data_mapper.test32` bug.

It is an `odd_sdlc` installed-product bug in how self-test and continuation are
modeled over already-converged or partially operational workspaces.

## Concrete Reproduction

Using the installed workspace:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`

1. Start from a bootstrap-converged workspace.
2. Declare:
   - `test_execution_contract: "sbt test"`
   - `deployment_contract: "docs/deployment-contract.md"`
   - `runtime_observation_contract: "docs/runtime-observation-contract.md"`
3. Run:
   - `PYTHONPATH=.genesis:.odd_sdlc/python/code python -m odd_sdlc catalog --workspace .`
   - `PYTHONPATH=.genesis:.odd_sdlc/python/code python -m odd_sdlc self-test --workspace .`

Observed behavior:

- the workspace lawfully exposes `release_operational_cycle`
- bootstrap is already converged
- upstream `self_test.py` does not terminate cleanly on that state
- operator progression required manual authored surfaces plus explicit FP result
  ingestion instead of a clean installed self-test outcome

## Intended Direction

The installed `odd_sdlc` self-test surface should be lawful over both of these
states:

1. bootstrap already converged, no remaining work
2. bootstrap converged, operational cycle active

That means:

- if bootstrap is already converged, self-test should return a clean success
  payload rather than raising
- if operational-cycle edges are active, self-test must not pretend bootstrap
  iteration is the only valid program state
- installed operator behavior must remain explicit about yielded FP seams, but
  it must not strand the operator in a half-published continuation path

## Scope Boundary

This ticket is in scope for:

- fixing the installed `self_test.py` control flow for already-converged
  bootstrap workspaces
- deciding the lawful installed behavior when operational-cycle edges are active
- proving the fixed behavior on a capability-enabled installed workspace

This ticket is not in scope for:

- removing yielded FP handoff from odd_sdlc
- redesigning the entire operational state model
- changing GTL or ABG semantics

## Current Workaround

The current operator-workable workaround on `data_mapper.test32` was:

- patch the embedded local `self_test.py` so `status == "converged"` returns a
  clean already-converged result when bootstrap work is done
- author operational generated surfaces manually from emitted manifests
- ingest FP results explicitly through `genesis.result_ingest`

That workaround is good enough to keep dogfood moving, but it is not a proper
released installed surface.

## Task List

- [x] Reprice installed self-test semantics so already-converged bootstrap state
  is treated as lawful success rather than failure.
- [x] Decide whether self-test should stop at bootstrap completion or compose
  bootstrap plus operational continuation when `release_operational_cycle` is
  active.
- [x] Ensure installed self-test does not strand the operator in yielded
  manifest dispatch without a clear continuation surface.
- [x] Add focused regression proof for:
  - already-converged bootstrap workspace
  - capability-enabled workspace with active operational-cycle edges
- [x] Replay the proof on `data_mapper.test32` or an equivalent installed
  fixture.

## Acceptance

- installed `odd_sdlc self-test` returns lawful success on an already-converged
  bootstrap workspace
- installed `odd_sdlc self-test` behaves coherently when operational-cycle
  edges are active
- capability-enabled installed workspaces no longer require ad hoc operator
  folklore just to understand whether self-test succeeded or what it expects
  next

## Links

- downstream workspace: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`
- related bug: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-005-adopt-abg-yielded-handoff-in-odd-sdlc.md`
- related bug: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-007-publish-lawful-installed-fp-result-ingest-and-continuation-surface.md`
- related feature: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/T-006-add-declarative-operational-state-transitions-for-build-test-and-deploy.md`

## Completion Notes

- `odd_sdlc self-test` now treats “current bootstrap program already complete”
  as lawful success instead of raising, whether the workspace returns plain
  `status: converged` or is already positioned at a follow-on executive edge.
- The self-test payload now surfaces `already_converged`,
  `other_active_programs`, and `follow_on_program` so capability-enabled
  workspaces remain operator-usable instead of looking like bootstrap failure.
- Focused regression proof is green:
  `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py -q -k 'self_test_command_drives_the_current_executive_program or already_complete or fully_converged'`
- Direct replay against the original dogfood workspace is green:
  `PYTHONPATH=.genesis:build_tenants/python/code python -m odd_sdlc self-test --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`
- The dogfood replay now returns `status: ok`, `already_converged: true`,
  `completed_edges: []`, and keeps `release_operational_cycle` visible as an
  active follow-on program instead of raising on bootstrap completion.
