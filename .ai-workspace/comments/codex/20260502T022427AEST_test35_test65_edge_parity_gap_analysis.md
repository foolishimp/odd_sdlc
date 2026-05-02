# STDO Post: Test35 Python vs Test65 TypeScript Edge Parity Gap Analysis

Author: Codex
Date: 2026-05-02 AEST

## Purpose

This post compares the successful Python `data_mapper.test35` run against the current TypeScript `data_mapper.test65.TS.cl` run at edge grain. The purpose is to deconstruct the code paths, data carriers, artifacts, and decision rules that let test35 traverse to product proof, then identify what TS needs to reproduce that success in a stricter form.

The target is not to copy Python looseness. The target is to copy the successful traversal semantics:

- each edge has a typed constructive output
- each edge has a published obligation/fulfillment carrier
- incomplete requirements create same-edge iteration or future loopback pressure
- incomplete requirements do not become an untyped global traversal stop
- a worker-runtime failure is distinguished from a semantic edge failure
- a later failed retry does not erase an earlier admitted edge-converged fact

## Compared Workspaces

Python reference:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`

TypeScript current reproduction:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test65.TS.cl`

Relevant source runtimes:

- Python installed odd_sdlc module: `data_mapper.test35/.genesis/odd_sdlc/python/code/odd_sdlc/gtl_module.py`
- Python ABG ingest/runtime: `data_mapper.test35/.genesis/genesis/result_ingest.py`, `dispatch_runtime.py`, `interpret.py`
- TS odd_sdlc source: `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src`

Scope note: "test35 success" in this post means traversal success and artifact production, not present-tense RC closure. A current `PYTHONPATH=.genesis python -m genesis gaps --workspace .` probe in test35 reports `converged: false`, `jobs_considered: 18`, and open pressure around `derive_implementation_design_surface` and `prepare_release_surface`. That current gap pressure is consistent with the ledger nuance below: test35 contains earlier admitted edge-converged ledgers and later failed or expanded proof pressure. The useful algorithmic evidence is that Python reached downstream stack, module, code, test, archive, release, and execution-result artifacts while preserving typed edge proof facts.

## Executive Finding

Test35 succeeds because its edge algorithm is ledger-centered. The Python runtime declares requirement obligations per edge, requires workers to publish `fulfillment_assessments`, builds a published fulfillment ledger, and only emits `edge_converged` when carry and fulfillment converge. That is visible in `result_ingest.py`: expected obligations come from the manifest, assessments are required, missing/partial/blocked/unfulfilled are counted, and `edge_converged` is computed from those counts plus admission (`result_ingest.py:325-415`, `480-510`). The interpreter then projects `edge_converged` from that published fulfillment ledger (`interpret.py:96-127`, `2080-2105`).

Test65 is stricter at the text-observation layer but weaker at the traversal algorithm layer. It correctly detected that `derive_implementation_design_surface` missed six requirement traces, produced an open gap dossier, and selected `retry_same_edge`. The retry then produced no stdout, stderr, report, or output progress for ten minutes, so process supervision converted the run to `silent_worker_inactivity` with `lawfulReentryPoint: triage_gap`. The traversal stopped at vector 8.

The failure is not that TS noticed missing requirements. That part is correct. The gap is that TS does not yet preserve the Python-style edge ledger semantics strongly enough: incomplete requirements should drive bounded same-edge iteration or carry-forward loopback pressure, while worker silence should be classified as a worker-runtime failure on the retry attempt, not as the semantic algorithm's final answer for the edge.

## Per-Edge Traversal Comparison

The table below uses the latest successful test35 ledger for each edge where available. For `derive_implementation_design_surface`, test35 has both an earlier accepted ledger and a later blocked retry. That distinction matters.

| Edge | Test35 Python result and artifacts | Test65 TS result and artifacts | Parity gap |
| --- | --- | --- | --- |
| `derive_intent_surface` | 4 attempts. Selected ledger `20260418T203754131623Z` converged. Artifacts included `specification/INTENT.md`, `specification/REQUIREMENTS.md`, `specification/appendices/APPENDIX_A_FROBENIUS_ALGEBRAS.md`, `specification/mapper_requirements.md`. | Vector 0 run `20260501T135301344Z_pid65991` passed postflight and assurance. Artifact: `.ai-workspace/runtime/odd_sdlc/assets/20260501T135301344Z_pid65991/intent_surface.md`. | TS has a valid runtime asset, but the edge output is not yet materially equivalent to the Python published/project surface set. |
| `derive_product_surface` | 4 attempts. Selected ledger `20260418T204047789670Z` converged. Artifacts included `specification/PRODUCT.md` and `specification/INTENT.md`. | Vector 1 run `20260501T135644808Z_pid65991` passed. Artifact: runtime `product_surface.md`. | Same pattern: TS runtime carrier exists, but materialized constitutional surface parity is thinner. |
| `derive_goal_surface` | 4 attempts. Selected ledger `20260418T204330686285Z` converged. Artifacts included `specification/GOALS.md`, `specification/INTENT.md`, `specification/PRODUCT.md`, plus prior FP result refs. | Vector 2 run `20260501T140115402Z_pid65991` passed. Artifact: runtime `goal_surface.md`. | Runtime-only artifact; Python had durable project surface materialization. |
| `derive_requirement_surface` | 6 attempts. Selected ledger `20260419T103015576845Z` converged. Artifacts included `specification/REQUIREMENTS.md` and `specification/requirements/10-generated-bootstrap.md`. | Vector 3 run `20260501T140554097Z_pid65991` passed. Artifact: runtime `requirement_surface.md`. | TS carries a richer split requirement inventory, but the generated edge surface remains in runtime assets. Requirement count normalization is needed before parity claims. |
| `derive_feature_decomp_surface` | 4 attempts. Selected ledger `20260418T205025887892Z` converged. Artifacts included `build_tenants/scala_spark/design/20-generated-feature-decomp.md`, `specification/GOALS.md`, `specification/REQUIREMENTS.md`, `specification/mapper_requirements.md`. | Vector 4 run `20260501T141129441Z_pid65991` passed. Artifact: runtime `feature_decomp_surface.md`. | TS has no `build_tenants/scala_spark/design/20-generated-feature-decomp.md` materialization in test65. |
| `derive_uat_testcases_surface` | 4 attempts. Selected ledger `20260418T205404886711Z` converged. Artifacts included `specification/scenarios/20-generated-uat-testcases.md` and requirement surfaces. | Vector 5 run `20260501T141706070Z_pid65991` passed. Artifact: runtime `uat_testcases_surface.md`. | TS passed the edge, but durable scenario materialization parity is missing. |
| `derive_design_surface` | 5 attempts. Selected ledger `20260419T175949529277Z` converged. Artifacts included `build_tenants/python/design/20-generated-feature-decomp.md`, `build_tenants/python/design/30-generated-odd-design.md`, `specification/requirements/10-generated-bootstrap.md`. The selected tenant path is historically odd, but the run also contains Scala design outputs. | Vector 6 run `20260501T142250671Z_pid65991` passed. Artifact: runtime `design_surface.md`. | TS generated a runtime design surface but did not materialize the equivalent tenant design files. |
| `derive_scenario_surface` | 4 attempts. Selected ledger `20260418T210347019986Z` converged. Artifacts included `build_tenants/scala_spark/design/30-generated-odd-design.md`, `specification/requirements/10-generated-bootstrap.md`, `specification/scenarios/40-generated-scenarios.md`. | Vector 7 run `20260501T143007840Z_pid65991` passed. Artifact: runtime `scenario_surface.md`. | TS passed, but scenario output is still runtime-local. |
| `derive_implementation_design_surface` | Important split. Earlier selected ledger `20260419T103335367453Z` converged with `expected_count: 77`, `fulfilled_count: 77`, `missing_count: 0`, `edge_converged: true`; evidence points into `build_tenants/scala_spark/design/40-generated-implementation-design.md` (`fp_ledgers/...103335367453Z.json:1-24`, `90-130`). Later retry `20260419T180828511506Z` was blocked with `expected_count: 81`, `fulfilled_count: 80`, `blocking_reasons: ["dbt_build_artifacts_not_present"]`, `edge_converged: false` (`fp_ledgers/...180828511506Z.json:1-30`). | Vector 8 first run `20260501T143724759Z_pid65991` passed base postflight, with evidence refs to output, result report, and materialization manifest (`postflight.json:1-10`). Assurance then blocked six requirements: `REQ-INT-002`, `REQ-INT-004`, `REQ-INT-005`, `REQ-INT-006`, `REQ-LDM-005`, `REQ-PDM-004` (`assurance_postflight.json:1-23`). Gap dossier selected `retry_same_edge` (`gap_dossier.json:1-18`, `719-724`). Retry run `20260501T144605455Z_pid65991` timed out silently and moved to `triage_gap` (`worker_process_failure_postflight.json:1-14`; `worker_process_summary.json:1-38`). | This is the current reproduction break. TS correctly diagnosed incomplete coverage, but the algorithm stopped after a silent retry. Python shows the intended behavior: incomplete or later-blocked evidence is iteration pressure, not global traversal invalidation. |
| `select_implementation_stack_profile` | 2 attempts. Selected ledger `20260418T211300542754Z` converged. Artifacts included `build_tenants/scala_spark/design/40-generated-implementation-stack.md` and implementation design refs. | Not reached in test65. TS graph includes the edge after implementation design (`catalog.ts:121-126`). | Blocked behind vector 8. |
| `derive_implementation_module_surface` | 3 attempts. Selected ledger `20260419T104549995160Z` converged. Artifacts included module design and many Scala files under tenant modules. | Not reached. TS graph includes this edge (`catalog.ts:127-132`). | Blocked behind vector 8. |
| `derive_realization_schedule_surface` | No direct Python test35 edge in the selected summary. Python graph went from module/stack toward code/test/release without this TS-specific edge. | Not reached. TS graph adds this stricter edge, deriving realization schedule from implementation design, module surface, and stack profile (`catalog.ts:133-142`). | This is an intentional TS rigor addition, but it must not become a new dead stop. It needs the same ledger/iteration semantics as other constructive edges. |
| `derive_code_surface` | 14 attempts. Latest selected ledger `20260419T121644750776Z` converged with `77/77`. Artifacts included 105 main Scala files and 35 test Scala files across `cdme-accounting`, `cdme-adjoint`, `cdme-assurance`, `cdme-compiler`, `cdme-engine`, `cdme-executor`, and `cdme-fidelity`. | Not reached in test65. TS graph defines code as downstream of implementation modules, stack profile, and realization schedule (`catalog.ts:143-150`). | Largest material gap. Test65 currently has nine runtime markdown assets and no `build_tenants/scala_spark` tree. |
| `derive_test_design_surface` | 3 attempts. Selected ledger `20260419T122911217823Z` converged. Artifact: `build_tenants/scala_spark/design/40-generated-test-design.md`. | Not reached. | Blocked behind implementation design. |
| `select_test_stack_profile` | 2 attempts. Selected ledger `20260418T215313843686Z` converged. Artifact: `build_tenants/scala_spark/test_env/40-generated-test-stack.md`. | Not reached. | Blocked behind implementation design. |
| `derive_test_module_surface` | 3 attempts. Selected ledger `20260419T123836015642Z` converged. Artifacts included `build_tenants/scala_spark/test_env/tests/40-generated-test-modules.md` and Scala test files. | Not reached. | Blocked behind implementation design. |
| `derive_test_run_archive_surface` | 8 attempts. Selected ledger `20260419T130433671620Z` converged. Artifacts included `build_tenants/scala_spark/test_env/50-generated-run-archive.md` and test refs. | Not reached. | Blocked behind implementation design. |
| `qualify_testcase_authority` | 3 attempts. Selected ledger `20260419T131645993868Z` converged. Artifacts included `specification/scenarios/30-generated-testcase-authority.md`. | Not reached. | Blocked behind implementation design. |
| `prepare_release_surface` | 1 attempt. Selected ledger converged with `71/71`. Artifacts included `build_tenants/scala_spark/release/60-generated-release-surface.md` and test report refs. | Not reached. | Blocked behind implementation design. |
| `prepare_test_execution_surface` | 1 attempt. Selected ledger converged. Artifacts included `docs/47-generated-test-execution.md`, `docs/40-generated-release.md`, and run archive. | Not reached. | Blocked behind implementation design. |
| `derive_test_execution_result_surface` | 1 attempt. Selected ledger converged. Artifacts included `docs/48-generated-test-execution-result.md`, `docs/47-generated-test-execution.md`, and run archive. | Not reached. | Blocked behind implementation design. |

## Test35 Artifact Shape

Test35 produced a full product-shaped tree:

- 140 Scala files under `build_tenants/scala_spark`
- 105 main Scala files under `src/main/scala`
- 35 test Scala files under `src/test/scala`
- 33 XML test reports under `target/test-reports`
- tenant design surfaces:
  - `build_tenants/scala_spark/design/20-generated-feature-decomp.md`
  - `build_tenants/scala_spark/design/30-generated-odd-design.md`
  - `build_tenants/scala_spark/design/40-generated-implementation-design.md`
  - `build_tenants/scala_spark/design/40-generated-implementation-stack.md`
  - `build_tenants/scala_spark/design/40-generated-implementation-modules.md`
  - `build_tenants/scala_spark/design/40-generated-test-design.md`
- tenant test/release surfaces:
  - `build_tenants/scala_spark/test_env/40-generated-test-stack.md`
  - `build_tenants/scala_spark/test_env/tests/40-generated-test-modules.md`
  - `build_tenants/scala_spark/test_env/50-generated-run-archive.md`
  - `build_tenants/scala_spark/release/60-generated-release-surface.md`
- execution docs:
  - `docs/47-generated-test-execution.md`
  - `docs/48-generated-test-execution-result.md`

Test65 currently has nine runtime assets:

- `intent_surface.md`
- `product_surface.md`
- `goal_surface.md`
- `requirement_surface.md`
- `feature_decomp_surface.md`
- `uat_testcases_surface.md`
- `design_surface.md`
- `scenario_surface.md`
- `implementation_design_surface.md`

The test65 product materialization manifest for the failed implementation-design edge declares `build_tenants/scala_spark` as the selected output root and lists the seven expected modules, but `required` is false and `files` is empty (`product_materialization_manifest.json:1-25`). The tenant tree does not exist in test65 at the point of failure.

## Python Algorithm From Code

The Python installed module declares per-edge requirement obligation ledgers. `_requirement_edge_obligation_ledger` uses:

- `obligation_source_ref: requirement_surface`
- `obligation_source_admission_basis: authority_or_current_surface`
- `carry_rule: deterministic_requirement_membership`
- adapter `odd_sdlc.traceability:declared_requirement_edge_gap`

That declaration is in `gtl_module.py:68-92`.

The Python implementation-design F_P criterion is not "mention some requirements." It says the edge is semantically converged only when each carried requirement obligation is materially represented by implementation design records that explain how the behavior will be realized (`gtl_module.py:536-540`). The module and code criteria are similarly behavioral: implementation modules must map obligations into concrete module boundaries, and code must behaviorally realize the obligations rather than preserve tags or stubs (`gtl_module.py:546-555`).

The runtime then enforces this through a published ledger:

- expected obligations are read from the manifest (`result_ingest.py:325-336`)
- worker output must include `fulfillment_assessments` (`result_ingest.py:337-340`)
- missing assessments become unfulfilled rows (`result_ingest.py:346-375`)
- statuses are counted as fulfilled, partial, blocked, or unfulfilled (`result_ingest.py:376-386`)
- carry convergence requires no missing or extra obligations (`result_ingest.py:408`)
- fulfillment convergence requires every row fulfilled and zero partial/blocked/unfulfilled (`result_ingest.py:409-415`)
- the ledger publishes `expected_count`, `fulfilled_count`, `partial_count`, `blocked_count`, `unfulfilled_count`, `missing_count`, `extra_count`, and `edge_converged` (`result_ingest.py:480-510`)

The interpreter projects `edge_converged` only from this published fulfillment ledger (`interpret.py:96-127`, `2080-2105`).

Important runtime detail: Python can salvage a valid preserved result artifact after timeout or nonzero return (`dispatch_runtime.py:433-440`). That means transport failure and semantic result evidence are not collapsed. The worker process can fail, but if a valid artifact exists, the artifact can still be ingested as evidence.

## TypeScript Algorithm From Code

The TS graph catalog defines the equivalent constructive chain:

- `derive_implementation_design_surface` from design and scenario (`catalog.ts:116-120`)
- `select_implementation_stack_profile` (`catalog.ts:121-126`)
- `derive_implementation_module_surface` (`catalog.ts:127-132`)
- `derive_realization_schedule_surface` as an added stricter edge (`catalog.ts:133-142`)
- `derive_code_surface` downstream of modules, stack, and schedule (`catalog.ts:143-150`)

The CLI projects a public start and then delegates to the installed operator for worker-backed execution (`command.ts:505-516`). The installed operator calls `runEngineIterateAsync` with `maxAttachedFpAttempts: 3` (`installed_operator.ts:1773-1782`).

The TS obligation assessment path currently observes requirement IDs in the output file and materialized files. If a requirement ID is not observed, post-transform assessment marks that obligation `blocked` with `requirement_trace_not_observed:<id>` (`handoff.ts:2299-2325`). The assurance gate then turns blocked assessments into `obligation_assessment_blocked:<obligationId>` reasons (`assurance_gate.ts:187-196`, `229-235`). Open assessments use `same_edge_retry`, but blocked assessments are folded as operator-blocked reasons in the assurance ledger (`assurance_gate.ts:237-243`).

The gap dossier constructor can still classify blocked postflight reasons as retryable when their lawful reentry point is `same_edge_retry` or `repair_worker_output`, and it emits `retry_same_edge` when that is present (`handoff.ts:3188-3212`). In test65, the first implementation-design attempt did exactly that.

Worker process failure handling is now typed. Silent inactivity is recognized when the process times out with zero stdout, zero stderr, and no report file (`installed_operator.ts:960-970`). If the process summary is admitted, TS emits a `silent_worker_inactivity` carrier with PID, hard timeout, inactivity timeout, heartbeat, last heartbeat, signal sequence, and prior silent-attempt count (`installed_operator.ts:996-1009`). In test65, that carrier moved the second implementation-design attempt to `triage_gap`.

## Edge 8 Failure Reconstruction

At vector 8, test65 did not fail because the worker produced no artifact. The first attempt produced an implementation-design artifact and base postflight passed:

- output: `.ai-workspace/runtime/odd_sdlc/assets/20260501T143724759Z_pid65991/implementation_design_surface.md`
- base postflight status: `passed`
- evidence refs: output file, worker result report, product materialization manifest (`postflight.json:1-10`)

The failure was semantic assurance:

- `REQ-INT-002` missing from observed trace
- `REQ-INT-004` missing from observed trace
- `REQ-INT-005` missing from observed trace
- `REQ-INT-006` missing from observed trace
- `REQ-LDM-005` missing from observed trace
- `REQ-PDM-004` missing from observed trace

Those are recorded in `assurance_postflight.json:1-23`. The gap dossier then recorded:

- graph function: `bootstrap_release_self_test`
- edge: `derive_implementation_design_surface`
- vector: 8
- status: `open`
- `retryEligible: true`
- `nextLawfulActions: ["retry_same_edge"]`

That is recorded in `gap_dossier.json:1-18`, `719-724`.

The second attempt was a worker-runtime failure, not a semantic repair result. The worker prompt linked the prior gap dossier and explicitly listed the blocked requirement obligations and sample reason codes (`worker_prompt.md:1-14`, `716-738`, `1100-1122`). The worker then ran as PID 99735, produced zero stdout and zero stderr, hit the 600000 ms inactivity timeout, received `SIGTERM` at 600004 ms, and exited with status 143 (`worker_process_summary.json:1-38`). The failure postflight carrier classified that as `silent_worker_inactivity` and selected `triage_gap` (`worker_process_failure_postflight.json:1-14`).

That is the test65 stop.

## The Bad Interpretation

The bad interpretation is treating incomplete requirement evidence as a traversal stop with no productive continuation semantics.

The correct interpretation under the successful test35 algorithm is:

- if an edge has missing or partial requirement fulfillment, the edge has not closed
- if the worker produced a useful artifact, ingest and type that evidence
- if the gap is repairable, iterate on the same edge with the gap dossier
- if the edge had already converged in an earlier accepted ledger, a later failed repair is new pressure, not retroactive invalidation of the admitted chain
- if a retry worker is silent, classify the worker runtime failure separately from the semantic gap

Test35 demonstrates this distinction. Its earlier implementation-design ledger converged `77/77` with `edge_converged: true`. A later implementation-design retry expanded the obligation set to 81 and failed on one blocked proof reason, `dbt_build_artifacts_not_present`, with `edge_converged: false`. That later failed retry did not erase the already admitted downstream chain.

TS currently has the right first move: it emits `retry_same_edge`. It needs the stronger second move: after a silent retry, retain the semantic gap state and either schedule another bounded same-edge attempt with adjusted worker/runtime policy or keep a typed loopback pressure carrier. Do not collapse "six requirements not observed" plus "retry worker was silent" into the algorithmic conclusion that traversal is done.

## Data Gaps To Close For TS Parity

1. Published edge fulfillment ledger

TS needs a first-class ledger equivalent to Python `fp_ledgers/*`. The current TS carrier set is useful but split across worker report, postflight, assurance postflight, gap dossier, and process summary. For parity, each constructive edge should publish one admitted edge ledger with:

- edge name
- target asset
- manifest ref
- output refs
- materialized file refs
- obligation source refs
- expected obligation count
- assessment count
- missing, extra, fulfilled, partial, blocked, unfulfilled counts
- blocking reasons
- evidence refs per obligation
- admission basis
- `edge_converged`

2. Requirement inventory normalization

Test35 implementation design selected ledger had 77 expected obligations. Test65 early assurance uses 90 requirement obligations. The stricter TS split may be correct, but parity needs a mapping from Python's 77 carried obligations to TS's 90 split obligations. Otherwise TS can be stricter by accident rather than more rigorous by design.

3. Runtime failure separation

TS has a good `worker_process_summary` carrier now. The remaining algorithm gap is to keep worker-runtime failure separate from semantic edge status. A silent retry should not overwrite the prior semantic gap. It should produce a worker failure attached to the retry attempt and leave the edge in a repairable state unless the retry budget or policy says otherwise.

4. Materialization parity

Test35 materialized durable tenant/product files. Test65 currently has runtime markdown assets and an empty materialization manifest for implementation design. The TypeScript reproduction should materialize at least the equivalent tenant design surfaces before claiming implementation-design parity:

- `build_tenants/scala_spark/design/20-generated-feature-decomp.md`
- `build_tenants/scala_spark/design/30-generated-odd-design.md`
- `build_tenants/scala_spark/design/40-generated-implementation-design.md`
- `build_tenants/scala_spark/design/40-generated-implementation-stack.md`
- `build_tenants/scala_spark/design/40-generated-implementation-modules.md`

5. Bounded same-edge iteration policy

The policy should be explicit:

- semantic missing coverage -> same-edge retry
- retry worker silence -> worker-runtime failure carrier plus preserved prior semantic gap
- retry budget remaining -> retry same edge with sharpened prompt/runtime policy
- retry budget exhausted -> stop with typed gap dossier that names semantic blockers and worker-runtime blockers separately
- prior admitted edge ledger remains available as traversal fact unless invalidated by a newer admitted requirement/design reprice

6. Python salvage equivalent

Python can ingest a valid preserved artifact after timeout or nonzero return. TS should make the equivalent rule explicit. If an output artifact and report are valid, transport failure should not automatically discard semantic evidence. If no report exists, classify worker-runtime failure but preserve the prior gap dossier.

## Final Algorithm Comparison

Python test35 algorithm:

1. GTL declares edge obligations.
2. Worker produces artifact plus fulfillment assessments.
3. Runtime builds a published fulfillment ledger.
4. Interpreter projects edge convergence from the ledger.
5. Incomplete obligations fail edge closure but remain typed.
6. Valid artifacts can be salvaged across transport failure.
7. Later failed retries do not erase earlier admitted edge-converged facts.
8. Traversal reaches code, tests, run archive, release, and execution-result surfaces.

TypeScript test65 algorithm today:

1. ABG executes one public edge at a time through the installed operator.
2. Worker produces runtime asset and result report.
3. Post-transform code observes requirement IDs in output/materialized files.
4. Assurance blocks missing observed requirement IDs.
5. Gap dossier can request `retry_same_edge`.
6. A silent retry becomes `silent_worker_inactivity`.
7. Current run stops at implementation design with `review_dossier` / `triage_gap` pressure.
8. Downstream stack, module, schedule, code, test, archive, release, and execution-result edges are not reached.

The TS target should be:

1. Keep ABG-owned traversal and the stricter assurance model.
2. Add the Python-style published edge fulfillment ledger as the closure authority carrier.
3. Treat missing requirement fulfillment as repairable edge pressure unless policy proves otherwise.
4. Treat worker silence as a worker-runtime fact attached to an attempt, not as the semantic answer for the edge.
5. Carry prior admitted edge convergence forward until a governed reprice invalidates it.
6. Materialize tenant/product artifacts as the graph advances, not only runtime markdown assets.

That is the route to test35 parity in a more rigorous TS form.
