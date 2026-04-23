---
id: B-044
title: Reconcile prepare_release_surface route authority across triage, public start, and executive programs
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: release-edge-route-law-and-executive-consistency
change_intent: Rebind the route-authority surface for `prepare_release_surface` so `odd_sdlc` no longer carries contradictory laws where the same release edge is published as `no_lawful_route` or `head_route_not_start_authoritative` in one lane but treated as a normal executable self-test step in another. The fix must place release-edge route authority on one declared current-tree carrier and make triage, published gap/public-start resolution, and executive-program consumers read that same truth instead of depending on ad hoc runtime-config candidates or ambient step expectations. `prepare_release_surface` remains a graph function, not a candidate-family/dynamic-route special case, and the bootstrap release program must terminate lawfully at the release boundary while CI/CD-style operational execution remains undeclared.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc execution-layer route authority for `prepare_release_surface` across `build_tenants/python/code/odd_sdlc/triage.py`, `gap_dossier.py`, `public_start.py`, `public_start_contract.py`, `self_test.py`, `program_catalog.py`, any GTL/module or candidate-family declaration surface that owns release-edge routing, and the proof lanes that currently disagree about whether the edge is executable
priority: high
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-23
dependencies: B-040 completed (typed public-start route carrier family is the current bounded source surface for any route-state extension); B-042 active (this ticket must not repair release-edge routing by reintroducing builder-strategy law or runtime-strategy heuristics); B-037 active (shared release-edge truth because `prepare_release_surface` sits in B-037's test-lane sequence and neither ticket may close against contradictory release-edge law)
intake_source: source review and targeted source proof on 2026-04-23 across `triage.py`, `gap_dossier.py`, `public_start.py`, `self_test.py`, `program_catalog.py`, `function_catalog.py`, `gtl_module.py`, and `test_odd_sdlc_first_slice.py`. Live proof pair: `test_release_gap_without_declared_route_is_explicit_no_lawful_route` passes while `test_self_test_executes_the_current_executive_program` fails with `bootstrap_release_self_test` remaining pending on `prepare_release_surface` after retry.
target_truth: When `prepare_release_surface` becomes the published head gap, `odd_sdlc` carries one authoritative route decision for that edge as a normal graph-function traversal. Triage, published gap dossier, public `start(next)` resolution, and executive-program/self-test consumers must all agree on that answer. Ad hoc `runtime_config["dynamic_routing"]` injection is not authoritative route law for the release edge. Because the repo does not yet declare a CI/CD-style operational execution contract as part of the bootstrap release program, lawful execution must also terminate cleanly at the release boundary rather than pend forever waiting for undeclared operational follow-on.
superseded_truth: The current tree splits release-edge route authority four ways. `triage.py` has no fixed-route mapping for execution-layer release prep and falls back to `no_lawful_route` when no dynamic candidate is injected. `gap_dossier.py` then blocks public `next` start with `head_route_not_start_authoritative`. Tests can still inject matching dynamic candidates through runtime config and prove `advance_dynamic_family`. `program_catalog.py` and `self_test.py` still treat `prepare_release_surface` as a normal executable step in `bootstrap_release_self_test`. The system therefore holds contradictory route laws simultaneously.
closure_law: This migration closes only when (1) `prepare_release_surface` route authority is declared on one current-tree source surface as direct graph-function law rather than inferred from ad hoc runtime config or executive-program expectation; (2) triage route binding, gap-dossier/public-start projection, and executive-program consumers all consume that same route truth; (3) the contradictory proof pair is reconciled so source proof no longer accepts both `no_lawful_route` and normal self-test traversal under the same boundary conditions; (4) the bootstrap release executive program terminates lawfully at the release boundary while CI/CD-style operational execution remains undeclared, instead of remaining pending on `prepare_release_surface` or silently requiring operational follow-on; (5) removing the authoritative route declaration produces explicit fail-closed behavior rather than fallback to hidden runtime-config dynamic candidates or ambient executive-program expectation; and (6) any route-state extension stays inside the existing typed public-start carrier family rather than reopening open-dict seams.
evaluation_criteria:
  - one declared source surface names how `prepare_release_surface` becomes executable as a graph function or blocked
  - `triage.py` no longer returns `no_lawful_route` for `prepare_release_surface` under the same conditions that `bootstrap_release_self_test` expects the edge to execute
  - `gap_dossier.py` no longer publishes `head_route_not_start_authoritative` for `prepare_release_surface` when the authoritative route surface says the edge is executable
  - `self_test.py` and `program_catalog.py` do not rely on implicit direct-edge authority that is absent from the published route binding
  - `bootstrap_release_self_test` terminates lawfully at the release boundary and does not require undeclared CI/CD follow-on to count as a clean stop
  - source, install, or sandbox proof lanes agree about the release-edge route answer on the same workspace truth
  - the fix does not introduce builder-strategy law, retry-budget law, or new framework-owned agent judgment while repairing the route defect
non_closure_conditions:
  - `prepare_release_surface` still has contradictory proof surfaces where one lane expects `no_lawful_route` and another expects direct execution under equivalent current-tree conditions
  - runtime-config-only dynamic candidates remain the only way to make `prepare_release_surface` routable
  - the repair converts `prepare_release_surface` into a candidate-family or dynamic-route special case instead of keeping it a graph function
  - public start still blocks on `route_binding_not_start_authoritative` or `head_route_not_start_authoritative` while executive programs still claim the edge is a normal executable step
  - bootstrap release still remains pending on `prepare_release_surface` or is forced into operational follow-on despite CI/CD-style execution remaining undeclared
  - closure is claimed by deleting or narrowing the failing self-test without reconciling route law
  - the fix introduces a second route-authority surface beside triage/gap-dossier/public-start rather than rebinding the existing one
proof_surface:
  - source proof for the current contradictory pair: explicit release no-route fixture and executive self-test fixture
  - source proof of the chosen authoritative route law for `prepare_release_surface`
  - source proof that public `next`-start resolution projects the same answer as triage for release-edge head state
  - source proof that bootstrap release terminates lawfully at the release boundary without CI/CD-style operational execution
  - install or sandbox proof that the release-edge route behavior matches the source law in a real workspace
  - negative proof that removing the authoritative route declaration fails closed instead of silently falling back to runtime-config-only dynamic candidates or ambient executive-program expectation
---

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/GOALS.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`

## Existing Live Reproduction

Targeted source proof with repo-authoritative ABG binding:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q \
  -k 'test_release_gap_without_declared_route_is_explicit_no_lawful_route or test_self_test_executes_the_current_executive_program'
```

Current result on the source tree:

- `test_release_gap_without_declared_route_is_explicit_no_lawful_route` passes
- `test_self_test_executes_the_current_executive_program` fails
- failure text: `bootstrap_release_self_test remained pending on 'prepare_release_surface' after retry`

That proves the current tree simultaneously accepts:

- published release-head route state `no_lawful_route`
- executive-program expectation that the same edge is executable

## Design Diagnosis

The defect is not just a failing self-test. The current route law for `prepare_release_surface` is structurally incomplete.

1. `prepare_release_surface` is a real graph function and a declared executive-program step.

- `build_tenants/python/code/odd_sdlc/gtl_module.py:1123-1144` declares `GF_PREPARE_RELEASE`
- `build_tenants/python/code/odd_sdlc/function_catalog.py:131-136` publishes it in the function catalog
- `build_tenants/python/code/odd_sdlc/program_catalog.py:14-19` includes it in `BOOTSTRAP_RELEASE_SELF_TEST`

2. `triage.py` has no first-class direct route law for execution-layer release prep.

- `build_tenants/python/code/odd_sdlc/triage.py:577-610` only emits fixed vectors for dependency/product/requirements/design/code/test re-entry layers
- `prepare_release_surface` sits on `framework_layer == "execution"`, so it falls out of the fixed-route branch
- `build_tenants/python/code/odd_sdlc/triage.py:621-695` only offers dynamic routing through `runtime_config["dynamic_routing"]["candidates"]`
- `build_tenants/python/code/odd_sdlc/triage.py:1359-1373` emits `state: "no_lawful_route"` when neither fixed nor dynamic routing is available

3. `gap_dossier.py` and public start only treat a small route-state set as start-authoritative.

- `build_tenants/python/code/odd_sdlc/gap_dossier.py:1158-1170` only admits `advance_dynamic_family`, `advance_fixed_vector`, `constitutional_reprice_approved`, and `suppressed_by_mode` as public-next directives
- `build_tenants/python/code/odd_sdlc/gap_dossier.py:1226-1249` blocks everything else as `head_route_not_start_authoritative`

4. The only current proof of lawful release-edge routing is ad hoc runtime-config injection in tests.

- `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py:3617-3676` proves dynamic routing only by injecting `runtime_config={"dynamic_routing": {"candidates": ...}}`

So the root cause is:

- `prepare_release_surface` is treated as executable by graph/program surfaces
- but the route-authority layer has no first-class declared execution law for it
- and the public-start boundary then blocks on the route layer's absence
- while the bootstrap release program still assumes a lawful stop at the release boundary even though no CI/CD-style operational continuation has been declared for that program

## Fix Direction

The design choice is now narrowed.

Required closure shape:

- keep `prepare_release_surface` as a graph function
- declare its route authority directly on one current-tree source surface
- make triage emit one start-authoritative release-edge answer from that source
- make gap/public-start consume that answer directly
- make bootstrap release terminate lawfully at the release boundary while CI/CD-style operational execution remains undeclared

Not acceptable:

- keeping runtime-config candidate injection as the only route source
- converting release prep into a candidate-family or dynamic-route special case
- adding a self-test-only bypass
- treating `prepare_release_surface` as executable in one lane and `no_lawful_route` in another

## Evaluator Gate

### 1. Authority Seam Closure

- [x] one current-tree source surface owns release-edge route authority
- [x] no controller-side reconstruction chooses a release-edge route outside that source surface
- [x] public start, gap dossier, and self-test consume the same route truth
- [x] deleting the authoritative route declaration fails closed rather than falling back to ambient expectations

### 2. Essential Carrier Consolidation

- [x] route repair reuses the existing typed public-start/route-binding carrier family instead of creating a second peer route payload family
- [x] if one new route state or discriminator is needed, it is justified against the existing carrier family rather than promoted as a fragment class
- [x] no self-test-only or program-only route carrier is introduced

### 3. Typed Enforcement After Proof

- [x] route-state changes are enforced through the existing typed carrier family in `public_start_contract.py`
- [x] no raw-dict bypass is introduced at `triage.py`, `gap_dossier.py`, `public_start.py`, or `self_test.py`
- [x] no `cast(...)`, `Any`, or `Mapping[str, object]` workaround is used to fake route-law closure at the semantic center

## Migration Checklist

- [x] old contradictory release-edge truth paths are named explicitly
- [x] one authoritative release-edge route source is named explicitly
- [x] all route consumers are listed
- [x] public-start route-authority states are repriced if needed
- [x] self-test/program assumptions are repriced if needed
- [x] lawful release-boundary termination is named explicitly while CI/CD-style operational execution is undeclared
- [x] runtime-config-only dynamic routing is removed or explicitly demoted from authority for the release edge
- [x] contradictory no-route vs executable proofs are reconciled before closure
- [x] ticket wording, route law, and proof claims are reconciled before closure

## Impacted Interface Review Checklist

- [x] `triage.py`
  Closure means `prepare_release_surface` route binding is derived from the chosen authoritative route source, not from absence of mapping.
- [x] `gap_dossier.py`
  Closure means `project_public_next_start_directive()` and `project_blocked_public_next_start_block()` return a release-edge answer consistent with triage.
- [x] `public_start.py` / `public_start_contract.py`
  Closure means any new route-authoritative state is typed and consumed without open-dict reconstruction.
- [x] `gtl_module.py` / any declared route-family source
  Closure means the route authority for `prepare_release_surface` is declared here if this layer owns the source truth.
- [x] `program_catalog.py` / `self_test.py`
  Closure means executive-program expectations are derived from the same route law, not from implicit edge executability, and bootstrap release stops lawfully at the release boundary while CI/CD-style operational execution remains undeclared.
- [x] `test_odd_sdlc_first_slice.py`
  Closure means the contradictory proof pair is resolved and selectors are reproducible.
- [x] install/sandbox proof lane
  Closure means installed/public execution follows the same release-edge route law as source.

## Required Break Order

1. Name the current contradictory route surfaces and decide the authoritative release-edge route source.
2. Publish/admit the new direct graph-function release-edge route law on that source surface.
3. Keep the old contradictory seam broken: no runtime-config-only fallback, no dynamic-family special case, and no ambient self-test assumption.
4. Rebind triage route binding to the new source.
5. Rebind gap-dossier/public-start route-authority consumption.
6. Rebind executive-program/self-test expectations and the lawful release-boundary termination.
7. Add negative proof that removing the route declaration fails closed.

## Mixed-State Negative Proof

- [x] a fixture with no authoritative release-edge route declaration fails closed and does not silently recover through runtime-config injection
- [x] a fixture where executive-program expectation disagrees with route binding fails closed instead of running ambiently
- [x] a fixture with undeclared CI/CD-style operational execution still terminates lawfully at the release boundary once `prepare_release_surface` succeeds

## Progress Note

Implemented on 2026-04-23:

- `gtl_module.py` declares `prepare_release_surface` on `start_authoritative_head_graph_functions`
- `triage.py` emits `advance_declared_graph_function` for the release head instead of falling through to `no_lawful_route`
- `gap_dossier.py` and `public_start.py` preserve that route state through the typed carrier family and admit the release edge through `target=next` plus `edge_override=prepare_release_surface`, keeping authority on the graph function without widening the public start-target catalog
- `self_test.py` terminates bootstrap release lawfully at the release boundary and reports `program_boundary_complete` with follow-on `release_operational_cycle`
- source proof selector:
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q -k 'test_release_gap_uses_declared_graph_function_route or test_release_gap_without_declared_route_is_explicit_no_lawful_route or test_release_gap_without_declaration_fails_closed_even_with_dynamic_candidate or test_dynamic_route_selection_is_deterministic_across_matching_candidates or test_zero_candidate_dynamic_route_is_explicit_no_lawful_route or test_self_test_executes_the_current_executive_program or test_self_test_fails_closed_when_release_route_declaration_is_removed'`
  - result: `7 passed, 83 deselected`
- install/sandbox proof selector:
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py -q -k 'test_installed_self_test_command_drives_the_current_executive_program or test_installed_self_test_returns_clean_success_when_bootstrap_is_already_complete or test_installed_self_test_resumes_bootstrap_from_the_current_active_edge'`
  - result: `3 passed, 10 deselected`

## Closure Note

Closed on 2026-04-23 after reconciling the final B-044 regressions:

- declaration removal plus injected dynamic candidate now fails closed for `prepare_release_surface`
- executive-program expectation disagreement now fails closed under test instead of running ambiently
- source and installed proof selectors are reproducible and agree on the same route law

## Links

- `build_tenants/python/code/odd_sdlc/triage.py`
- `build_tenants/python/code/odd_sdlc/gap_dossier.py`
- `build_tenants/python/code/odd_sdlc/public_start.py`
- `build_tenants/python/code/odd_sdlc/public_start_contract.py`
- `build_tenants/python/code/odd_sdlc/self_test.py`
- `build_tenants/python/code/odd_sdlc/program_catalog.py`
- `build_tenants/python/code/odd_sdlc/function_catalog.py`
- `build_tenants/python/code/odd_sdlc/gtl_module.py`
- `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py`
