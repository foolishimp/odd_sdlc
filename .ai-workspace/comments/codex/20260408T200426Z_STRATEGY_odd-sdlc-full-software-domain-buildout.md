# STRATEGY: odd_sdlc Full Software-Domain Buildout

**Author**: codex
**Date**: 2026-04-08T20:04:26Z
**Addresses**: full-domain strategy for `odd_sdlc`; supersedes the narrow upgrade-roadmap framing in `20260408T093052Z_STRATEGY_odd-sdlc-upgrade-roadmap.md`; grounded in the `data_mapper.test19` postmortem and primary-source `odd_method` runtime-boundary doctrine
**Status**: Draft

## Summary

This post describes both current reality and target direction.

Current reality:

- `odd_sdlc` is a real first tenant, but still shaped like a first-slice toy that proves a bootstrap-to-release chain rather than a full software-domain SDLC package
- the live asset graph still hard-wires placeholder implementation and test/release branches under `build_tenants/odd_method/python/...`
- the tenant still contains constructor-era placeholder generation in `build_tenants/odd_sdlc/python/code/odd_sdlc/constructor.py`
- the current deterministic layer in `build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py` is still mostly marker-oriented and under-governs imported, adopted, repaired, and real runtime-returned truth
- the `data_mapper.test19` postmortem proves that this first-slice shape is not enough to govern real software work

Target direction:

- `odd_sdlc` should be built out as the generic software-domain ODD package
- it should govern the full SDLC as a worksite lifecycle: request, gate, specify, design, implement, qualify, release, deploy, observe, return, retrofit, and relaunch
- configured `F_P` should be the normal supervisory transform for generic software-domain traversal
- layered `F_D` should instrument that work before and after traversal, and should become richer as the domain profile becomes more specific
- GTL/ABG should remain the substrate, with only minimal substrate alignment where default hook semantics are named but not honestly executed

The `data_mapper.test19` postmortem remains the proving failure for why this build-out is required:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test19/docs/POSTMORTEM_test19_odd_method_process_violation.md`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test19/docs/FORENSIC_ANALYSIS_test19_event_trace.md`

## Analysis

### Position

The correct strategic move is not to treat `odd_sdlc` as a narrow repair project.

It should be treated as a full domain build-out of SDLC over the generic software domain.

That conclusion follows from primary source:

- `odd_method` is explicitly lightweight, graph-native, and subordinate to GTL/ABG for runtime fact truth in `specification/INTENT.md`
- runtime governance explicitly says ABG owns runtime truth, `odd_method` must not create a shadow runtime, and the default constructive stance favors `F_P` in `specification/requirements/03-runtime-governance.md`
- the first live asset model is explicitly about typed assets, provenance, projection, and graph-function carriers in `specification/requirements/07-asset-typing-and-binding.md`
- the first `odd_sdlc` slice is explicitly a first tenant, not the final domain shape, in `specification/requirements/08-odd-sdlc-first-slice.md`
- the translation note already says ODD should keep semantics in typed assets and bounded domain law, not in a hidden controller layer, in `build_tenants/common/design/ODD_SDLC_TRANSLATION.md`

So the target is:

- keep the substrate small
- build the software-domain package properly
- let domain specificity drive stronger deterministic authority

### Why the earlier roadmap is too small

The earlier roadmap was still centered on repairing a failure pattern.

That is necessary, but not sufficient.

The deeper requirement is to build out `odd_sdlc` as a domain package that can lawfully govern:

- new projects
- imported projects
- adopted implementation branches
- release preparation
- deployment and runtime return
- retrofit and relaunch

Without that larger build-out, every repair remains a patch on a toy line.

### Domain definition

`odd_sdlc` should be the ODD software-domain package.

Its subject is not "generated documents."
Its subject is software delivery work over governed software assets and governed operational evidence.

The governing metaphor is an active worksite:

- the project is a shipyard or hangar
- software artifacts are built and qualified there
- releases are launched from there
- runtime evidence returns there
- retrofit and relaunch happen there

This is not an analogy-only flourish.
It changes the domain model:

- release is not terminal closure
- runtime-returned evidence is a first-class governed input
- adoption and retrofit are lawful acts, not side effects outside the graph

### Full SDLC scope

The full software-domain scope should cover these acts:

1. request and gate work
2. establish and refine governing specification
3. derive and review design
4. select or adopt implementation profiles
5. generate, adopt, repair, or retrofit implementation assets
6. derive and execute qualification lanes
7. assemble release evidence
8. launch or deploy
9. ingest runtime-returned evidence
10. derive repair or retrofit work
11. relaunch under the same governed line

That is the domain build-out target.

### Asset families for the software domain

The current first-slice asset family should be expanded into a real SDLC ontology.

Minimum families:

- `request_surface`
- `gate_decision_surface`
- `intent_surface`
- `product_surface`
- `goal_surface`
- `requirement_surface`
- `design_surface`
- `review_surface`
- `implementation_design_surface`
- `implementation_profile_surface`
- `implementation_module_surface`
- `implementation_asset_surface`
- `build_artifact_surface`
- `test_design_surface`
- `test_module_surface`
- `test_run_surface`
- `test_report_surface`
- `testcase_authority_surface`
- `release_surface`
- `deployment_surface`
- `runtime_observation_surface`
- `incident_or_gap_surface`
- `retrofit_plan_surface`
- `maintenance_release_surface`

This is still generic software-domain law.
It is not language-specific.
Language or stack specifics belong in profiles and specialized authorities.

### Work-act model

The domain must also model software work acts explicitly.

Minimum act classes:

- `generated`
- `adopted`
- `imported`
- `repaired`
- `retrofitted`
- `validated`
- `released`
- `deployed`
- `observed`
- `returned`

These acts should be visible through asset provenance and runtime fact history, not inferred from ambient file state.

### Edge regime for the software domain

Each `odd_sdlc` edge should carry a full traversal contract.

Minimum edge contract:

- source asset set
- target asset
- transform dependency or transform profile
- preflight `F_D`
- configured `F_P`
- postflight `F_D`
- optional `Capability F_D`
- optional `F_H`
- output/work-report contract
- proof policy
- closure policy

This is the place where the generic software domain stays general while still being governable.

In the generic software domain:

- configured `F_P` carries most traversal work
- `F_D` remains lighter but still authoritative at the boundary

In a more specific domain profile:

- the graph becomes more explicit
- `Capability F_D` becomes richer
- the same regime model stays intact

### Role of F_P in the full SDLC domain

For `odd_sdlc`, `F_P` should be treated as the configured builder-supervisor for generic software work.

It should:

- interpret the declared edge contract
- update the real governed artifacts
- resolve bounded local build problems
- emit a structured work report
- classify the act it performed
- state what evidence it produced

This is not a substrate expansion.
It is the correct domain use of the substrate.

### Role of F_D in the full SDLC domain

`F_D` should be layered, not weakened.

Minimum layers:

- `Core F_D`: bindings, identity, provenance, report shape, evidence presence, cross-surface consistency
- `Capability F_D`: specialized deterministic authorities for stack or subsystem profiles
- `Postflight F_D`: deterministic validation of the actual result of `F_P`
- `Operational F_D`: deterministic validation of returned runtime, release, and maintenance evidence

This is the correct shape for a general software domain.

### Substrate boundary

This strategy is a domain build-out, not a broad ABG redesign.

ABG changes should remain minimal and generic.

The current primary substrate issue is narrower:

- ABG already provides default policy-bundle resolution, override surfaces, an `F_P`-first escalation path, and fail-closed policy resolution
- but the shipped `proof` and `closure` defaults are named as executable semantics while current runtime behavior mostly emits proof/closure events from shortcut conditions

So the substrate work package for this strategy should be limited to:

- make default `proof` and `closure` concerns execute honestly as default hooks
- or rename those shipped defaults so they truthfully describe current runtime behavior
- keep this generic and domain-neutral

Everything else in this strategy belongs to the `odd_sdlc` domain package.

## Goals

### Goal 1: Build out odd_sdlc as the generic software-domain package

Success means `odd_sdlc` is no longer just a bootstrap proving toy.

It becomes the governing software-domain line for SDLC work over imported, generated, adopted, repaired, and operationally returned software assets.

### Goal 2: Expand the domain ontology from first-slice assets to full SDLC assets

Success means the asset model can lawfully represent request, implementation, qualification, release, deployment, runtime-return, and retrofit work.

### Goal 3: Make the SDLC graph explicit across the whole lifecycle

Success means `odd_sdlc` publishes graph-function carriers and edge contracts for the full software lifecycle, not only bootstrap-to-release generation.

### Goal 4: Make configured F_P the standard supervisory transform for generic software traversal

Success means most generic software-domain edges rely on configured `F_P` under explicit contracts rather than pretending marker-style deterministic checks are semantically sufficient.

### Goal 5: Make layered F_D a real authority around that work

Success means `F_D` can validate bindings, provenance, reports, evidence, runtime return, and specialized stack constraints without becoming a hidden controller runtime.

### Goal 6: Govern imported, adopted, and repaired truth explicitly

Success means the domain can distinguish generated code from adopted code, imported code, repaired code, and retrofitted code through first-class provenance rather than file accidents.

### Goal 7: Bring runtime-returned truth back into the governed SDLC

Success means operational evidence becomes an input to further governed work rather than an external afterthought.

### Goal 8: Keep ABG small and honest

Success means the substrate remains declarative, fail-closed, and overrideable, with only minimal generic fixes where named default behavior is not actually executed.

## Task Groups

### Task Group A: Ratify the software-domain doctrine

1. Write the full-software-domain position into `odd_sdlc` design commentary and then ratify it into tenant design law.
2. Record the active-worksite lifecycle as a domain doctrine: request, gate, build, qualify, release, deploy, observe, return, retrofit, relaunch.
3. Clarify that release is a governed transition, not end-of-project finality.

### Task Group B: Expand the asset ontology

1. Add the missing SDLC asset families for request, gate, implementation assets, build artifacts, test reports, deployment, runtime return, and retrofit.
2. Extend `AssetType` profiles to carry domain meaning for these new families.
3. Extend bindings and query surfaces so these assets remain machine-readable and inspectable.

### Task Group C: Add a first-class work-act and provenance model

1. Represent `generated`, `adopted`, `imported`, `repaired`, `retrofitted`, `released`, `deployed`, and `returned` as lawful provenance-bearing acts.
2. Extend the domain model so mutable checkpoints and constructive history stay attributable.
3. Make imported and adopted implementation branches lawful first-class states instead of out-of-graph accidents.

### Task Group D: Build the full SDLC graph

1. Expand the current graph from bootstrap-to-release into a full SDLC lifecycle graph.
2. Add graph-function carriers for request gating, implementation realization, qualification, release assembly, deployment, runtime return, and retrofit.
3. Keep graph functions as the carrier and avoid introducing any domain shadow runtime.

### Task Group E: Upgrade edge contracts

1. Make transform dependency explicit on every SDLC edge.
2. Make evaluator dependency explicit on every SDLC edge.
3. Split evaluator dependency into preflight `F_D`, configured `F_P`, postflight `F_D`, optional `Capability F_D`, and optional `F_H`.
4. Define per-edge work-report contracts.

### Task Group F: Build the generic-software F_P regime

1. Define the standard configured `F_P` traversal model for generic software edges.
2. Require `F_P` to modify the actual governed target artifacts and emit a structured work report.
3. Carry operation type, target binding, input/output digests, and evidence refs in that report.

### Task Group G: Build layered F_D for the software domain

1. Replace marker-only checks in `fd_checks.py` with truth-binding, provenance, and evidence-consistency checks.
2. Define `Core F_D` for universal software-domain checks.
3. Define the attachment model for `Capability F_D` without changing the regime model.
4. Make postflight validation mandatory before proof can count.
5. Add operational validation over returned release and runtime evidence.

### Task Group H: Replace placeholder first-slice assumptions

1. Remove hard-coded placeholder implementation, release, and archive bindings from `workspace_assets.py`.
2. Replace placeholder constructor behavior in `constructor.py` with lawful target-aware construction, adoption, or fail-closed unsupported behavior.
3. Align release, code, and qualification assets to the same governed branch.

### Task Group I: Build out qualification and operational return

1. Expand the qualification lane from generated archive narrative to real governed test/run evidence.
2. Add deployment and runtime-observation assets.
3. Add return and retrofit surfaces that can open new governed work from operational evidence.

### Task Group J: Minimal substrate alignment

1. Keep GTL/ABG changes generic and small.
2. Make default `proof` and `closure` concerns honest executable defaults or rename them truthfully.
3. Preserve fail-closed policy resolution and overrideability.
4. Do not move software-domain semantics into ABG.

### Task Group K: Regression and proving program

1. Keep `data_mapper.test19` as an anti-regression case.
2. Add regression lanes for adopted/imported implementation truth.
3. Add regression lanes for runtime-return and retrofit opening.
4. Add regression lanes proving that placeholder narratives cannot close a domain graph against contradictory real artifacts.

## Sequencing

### Phase 1: Domain doctrine and ontology

Do first:

- Task Group A
- Task Group B
- Task Group C

Reason:

The package needs a real software-domain model before implementation details are repriced again.

### Phase 2: Graph and edge build-out

Do second:

- Task Group D
- Task Group E
- Task Group F
- Task Group G

Reason:

This turns the domain model into an executable SDLC graph with explicit traversal law.

### Phase 3: Placeholder replacement and truth alignment

Do third:

- Task Group H
- Task Group J
- Task Group K

Reason:

These tasks replace the current toy failure modes and turn the postmortem into an enforceable boundary.

### Phase 4: Operational return and maintenance loop

Do fourth:

- Task Group I

Reason:

This completes the worksite lifecycle and makes `odd_sdlc` a true operational SDLC domain rather than a release-only one.

## Recommended Action

1. Treat this post as the new strategic frame for `odd_sdlc`.
2. Reclassify the earlier roadmap as a narrow repair view under this broader domain build-out.
3. Start ratification work from Phase 1, not from substrate-first changes.
4. Keep the ABG work package explicitly separate and minimal.
5. Use `data_mapper.test19` as the first proving failure, not as the whole strategy.
