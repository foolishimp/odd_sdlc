# STRATEGY: odd_sdlc Upgrade Roadmap

**Author**: codex
**Date**: 2026-04-08T09:30:52Z
**Addresses**: upgrade roadmap for `odd_sdlc` after the `data_mapper.test19` process failure; operationalization of `20260408T091538Z_STRATEGY_odd-sdlc-worksite-fp-fd-regime.md`
**Status**: Draft

## Summary

This post sets goals and tasks for upgrading `odd_sdlc`.

It describes both current reality and target direction.

Current reality:

- `odd_sdlc` is still too close to a generated-surface line with hard-wired placeholder implementation paths in `build_tenants/odd_sdlc/python/code/odd_sdlc/workspace_assets.py`
- its implementation, release, and archive constructors remain placeholder-oriented in `build_tenants/odd_sdlc/python/code/odd_sdlc/constructor.py`
- its `F_D` layer is mostly fast structure checking in `build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py`
- the runtime prompt path already instructs the probabilistic worker to update real artifacts in `.genesis/genesis/binding.py`
- but proof still effectively trusts ingested `F_P` assessment payloads in `.genesis/genesis/result_ingest.py`

Target direction:

- `odd_sdlc` should become a real SDLC asset graph over the generic software domain
- `F_P` should be the configured supervisory transform for most generic software-domain edge traversals
- `F_D` should become layered and postflight-enforced rather than merely advisory
- the project should be treated as an active worksite with build, launch, return, retrofit, and relaunch acts

The key failure proving the need for this roadmap is documented in:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test19/docs/POSTMORTEM_test19_odd_method_process_violation.md`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test19/docs/FORENSIC_ANALYSIS_test19_event_trace.md`

## Analysis

### Position

The right upgrade is not "make everything deterministic."

The right upgrade is:

- keep GTL/ABG as the substrate
- keep `odd_sdlc` as a domain graph over software delivery
- make `F_P` the configured builder-supervisor for generic software edges
- make `F_D` a stronger deterministic instrumentation layer around that work
- allow richer and more domain-specific deterministic authorities where the domain justifies them

That preserves generality while tightening truth.

### Why the roadmap is needed

The `test19` failure happened because the current system still permits a divergence between:

- the governed asset graph
- the actual implementation branch
- the actual release and test evidence

The postmortem shows a concrete form of that divergence:

- placeholder implementation binding in `workspace_assets.py`
- placeholder code, release, and archive construction in `constructor.py`
- marker-oriented deterministic checks in `fd_checks.py`
- proof closure after ingested `F_P` assessment in `result_ingest.py`

That failure is not a one-off language issue.
It is a general methodology gap in the current `odd_sdlc` line.

## Goals

### Goal 1: Recast odd_sdlc as an active worksite domain

`odd_sdlc` should govern a project as a worksite for a precision instrument, not a static surface tree.

Success means:

- the lifecycle can express build, adopt, import, repair, launch, return, retrofit, and relaunch acts
- the graph can carry production-returned evidence back into governed maintenance work
- the SDLC line no longer assumes a one-pass generate-and-freeze flow

### Goal 2: Make configured F_P the normal supervisory transform for the generic software domain

For generic software work, the edge traversal should depend primarily on configured `F_P`, not on pretending generic `F_D` is semantically sufficient.

Success means:

- each generic software edge can declare its transform authority explicitly
- the `F_P` worker is responsible for real artifact change, not just descriptive assessment
- the worker emits a structured work report describing what it actually did

### Goal 3: Split F_D into layered deterministic authority

`F_D` should become stratified rather than reduced.

Success means:

- `Core F_D` handles universal truth checks
- `Capability F_D` handles domain- or stack-specific deterministic authority
- `Postflight F_D` validates the result of `F_P`
- `Operational F_D` validates returned runtime and release evidence

### Goal 4: Make proof and closure depend on postflight truth, not just F_P attestation

The current runtime naming says `rerun_after_fp`, but the proof path is still too trusting.

Success means:

- `proof_passed` is not emitted until postflight deterministic validation clears
- `closure_passed` is not emitted while code/test/release truth diverges
- release truth, test truth, and code truth are tied to the same governed target branch

### Goal 5: Preserve specialization without losing the general method

The upgrade must not collapse to generic-only software behavior.

Success means:

- edges can inject specialized deterministic evaluators where available
- richer domains can tighten their asset graph and their evaluator suite
- the same GTL/ABG regime model can carry both generic and highly specific domains

### Goal 6: Turn the postmortem into a standing regression boundary

The `test19` failure should become a permanent anti-regression case.

Success means:

- `odd_sdlc` cannot converge while real implementation truth lives outside the governed branch
- placeholder release or archive narratives cannot pass if real evidence contradicts them
- imported/adopted implementation acts require explicit provenance

## Tasks

### Task Group A: Doctrine and domain-model upgrade

1. Add an explicit worksite lifecycle doctrine to the `odd_sdlc` design line: build, launch, return, retrofit, relaunch.
2. Define first-class operation types for implementation acts:
   - `generated`
   - `adopted`
   - `imported`
   - `repaired`
   - `retrofitted`
3. Extend the asset/type model so these acts can be represented as lawful graph-state changes rather than hidden workspace side effects.
4. Define returned-runtime and returned-release evidence as governed assets, not external noise.

### Task Group B: Edge contract upgrade

1. Make transform dependency explicit on each `odd_sdlc` edge.
2. Make evaluator dependency explicit on each `odd_sdlc` edge.
3. Split evaluator dependency into:
   - preflight `F_D`
   - configured `F_P`
   - postflight `F_D`
   - optional `F_H`
4. Require each edge to declare a work-report schema for the `F_P` act.
5. Ensure `build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py` becomes the declared home of that richer edge contract.

### Task Group C: F_P work-report contract

1. Define a machine-readable work-report payload emitted by every `F_P` traversal.
2. Require the report to carry:
   - target asset id
   - target path or binding
   - operation type
   - source/input digests
   - output digests
   - evidence refs
   - claimed contracts satisfied
3. Update the prompt assembly in `.genesis/genesis/binding.py` so this report is part of the output contract, not an optional narrative.
4. Update runtime ingest in `.genesis/genesis/result_ingest.py` so ingest validates both the assessment payload and the work-report payload.

### Task Group D: Postflight F_D enforcement

1. Add postflight deterministic rerun after successful `F_P` work.
2. Fail proof if the work-report claims do not match the actual target artifacts.
3. Fail proof if release, archive, or code surfaces point at different governed branches.
4. Make the runtime behavior match the declared proof policy in `.genesis/genesis/policy_defaults.py`.
5. Keep preflight `F_D` lightweight enough to remain an optimization layer for generic software-domain traversal.

### Task Group E: Truth-binding repair in odd_sdlc

1. Remove hard-wired placeholder implementation assumptions from `build_tenants/odd_sdlc/python/code/odd_sdlc/workspace_assets.py`.
2. Replace placeholder code/release/archive constructors in `build_tenants/odd_sdlc/python/code/odd_sdlc/constructor.py` with target-aware construction or lawful failure when unsupported.
3. Replace marker-only checks in `build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py` with target-binding, provenance, and evidence consistency checks.
4. Add deterministic checks that explicitly detect:
   - real implementation outside governed branch
   - real test evidence outside governed archive
   - release narrative divergence from actual governed truth

### Task Group F: Specialization model

1. Define how specialized deterministic authorities are attached to an edge without changing the regime model.
2. Allow domain profiles to add richer `Capability F_D` sets on top of the generic software-domain baseline.
3. Ensure generic software-domain profiles remain heavy on configured `F_P` while specialized domains can be much stricter.
4. Document that specialization increases graph specificity and deterministic authority together.

### Task Group G: Runtime observability and failure semantics

1. Add explicit stale-run and timeout semantics for unresolved `fp_dispatched` states in `.genesis/genesis/run.py` and the dispatch path.
2. Distinguish install, restart, resume, and reattach events rather than collapsing them into repeated indistinguishable install noise.
3. Record stronger causation between dispatch, worker execution, report creation, assessment ingest, and proof closure.
4. Make unresolved `F_P` waits operationally visible as a first-class system state.

### Task Group H: Regression conversion

1. Encode `data_mapper.test19` as a standing regression pattern.
2. Add tests that fail if `odd_sdlc` converges while real code lives outside the governed branch.
3. Add tests that fail if release says "implementation pending" while governed evidence proves otherwise.
4. Add tests for adopted/imported implementation provenance.
5. Add tests for postflight `F_D` enforcement after successful `F_P` traversal.

## Sequencing

### Phase 1: Truth and proof repair

Do first:

- Task Group C
- Task Group D
- Task Group E
- Task Group H

Reason:

These tasks directly close the failure mode exposed by the postmortem.

### Phase 2: Edge-model and specialization upgrade

Do second:

- Task Group B
- Task Group F

Reason:

These tasks formalize the general-purpose method shape and prevent the repair from becoming a one-off patch.

### Phase 3: Worksite lifecycle expansion

Do third:

- Task Group A
- Task Group G

Reason:

These tasks complete the broader worksite model and turn `odd_sdlc` from a surface generator into a governed operational line.

## Recommended Action

1. Treat Phase 1 as the immediate upgrade program for `odd_sdlc`.
2. Treat the `test19` postmortem as the acceptance boundary for Phase 1 completion.
3. After Phase 1 is stable, ratify the edge-model direction for configured `F_P` plus layered `F_D` in project-owned design law.
4. Only after that, expand the worksite lifecycle into launch/return/retrofit surfaces.
