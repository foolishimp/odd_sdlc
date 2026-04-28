# Proof: Test35 Recursive Realization Deepening Is Missing From TS

## Lead

`data_mapper.test35` demonstrated the important capability: recursive
realization deepening over the same graph edge until the generated system had
real domain shape and execution evidence.

That capability should be inherent to ABG traversal. It was partially present
in the Python-era control loop, then lost or underpriced by later Python
refactors. The TypeScript line does not yet isolate or prove it.

This is not primarily a file-count problem. File count is only a symptom. The
real defect is that the current line can close a realization edge after a
single shallow construction pass, while test35 repeatedly re-entered the
realization edge against current workspace state.

## Product Consequence

`data_mapper.test35` generated the core of the enterprise solution: compiler,
resolver, executor, synthesis, manifest, assurance, accounting, fidelity, and
engine responsibilities with behavioral tests and execution evidence.

That is the distinction between vibe coding and solution delivery. Plausible
generated artifacts are not enough. Solution delivery needs a governed path
from requirements to domain-shaped implementation, behavioral tests, runtime
evidence, lineage, and repeatable closure.

The TypeScript line must preserve this boundary. The bar is not larger output;
the bar is governed construction of the enterprise core through ABG-managed
traversal and evidence-backed convergence.

## Capability Definition

Name: `realization-edge recursive deepening`

Required behavior:

- ABG runs a graph function edge against the current workspace state.
- F_D/F_P/F_H evidence identifies remaining gaps.
- If the target asset is still shallow, partial, or structurally incomplete,
  the same realization edge can be lawfully re-entered with current state as
  input.
- Each turn preserves provenance, requirement obligations, current target
  state, and prior evidence.
- Closure requires convergence of required inventory, behavioral evidence, and
  current execution proof, not just the existence of generated assets.

This capability belongs at ABG traversal/runtime level. The SDLC product should
provide domain graph functions, carriers, evaluators, hook contracts, and proof
interpretation. It should not own an ad hoc hidden loop.

## Test35 Evidence

`data_mapper.test35` shows repeated realization over `derive_code_surface`.

Observed evidence:

- `derive_code_surface` run-bound events: `16`
- `derive_code_surface` edge-converged events: `14`
- `derive_code_surface` result artifacts: `15`
- main Scala files: `105`
- test Scala files: `35`
- main Scala LOC: `5862`
- test Scala LOC: `3144`
- JUnit report files: `33`
- parsed `<testcase>` entries in JUnit XML: `181`

The manifests contain the essential control law:

- inspect the current target asset state before changing it
- treat current workspace state as truth
- continue construction from the present state
- reduce the unresolved gap before assessment
- iteration may continue within the edge while new signal appears

This is the productive behavior to preserve. The generated CDME system included
domain-shaped components such as:

- `TopologicalCompiler`
- `TypeResolver`
- `MorphismExecutor`
- `SynthesisEngine`
- `RunManifestManager`

## Current Test45 Evidence

`data_mapper.test45` does not prove the same capability.

Observed evidence:

- `derive_code_surface` run-bound events: `1`
- `derive_code_surface` edge-converged events: `1`
- `derive_code_surface` result artifacts: `1`
- main Scala files: `8`
- test Scala files: `14`
- main Scala LOC: `317`
- test Scala LOC: `466`
- JUnit report files: `0`
- docs/48-generated-test-execution-result.md reports `pending_external_evidence`
- docs/48-generated-test-execution-result.md reports `tests observed: 0`
- docs/46-generated-build-execution-result.md admits only `sbt clean assembly`

This proves a successful build dispatch, not a governed test dispatch or a
recursive realization capability.

## Current Python Refactor Evidence

The current Python constructor is module-shell oriented.

Evidence:

- `build_tenants/python/code/odd_sdlc/constructor.py:631` creates planned test
  files by iterating declared modules.
- `build_tenants/python/code/odd_sdlc/constructor.py:1022` constructs the
  planned software tree from declared module names.
- `build_tenants/python/code/odd_sdlc/requirement_closure.py:33` still treats
  generic tokens such as `return`, `assert`, `if`, `match`, and `try` as
  behavioral evidence.

That is not enough to distinguish real domain behavior from trace/spec
scaffolding.

## TypeScript Intake Evidence

At ticket intake, the TypeScript tenant did not close this gap.

Evidence:

- `build_tenants/typescript/code/src/qualification/rc_qualification.ts:13`
  explicitly excludes live probabilistic `data_mapper` generation from the
  current RC claim.
- `build_tenants/typescript/code/src/hooks/hook_set.ts:342` binds realization
  to `fp://odd-sdlc/generic-software-domain-constructor`.
- `build_tenants/typescript/code/src/hooks/hook_set.ts` published a closure
  policy whose only traversal posture was `maySelectNextTraversal: false`.

Those facts are compatible with a bounded package RC, but they do not model or
prove test35-style recursive deepening.

## B-067 Underpricing

B-067 targeted behavioral realization depth against test35, but its closure
accepted a lower bar:

- `8` main Scala files
- `317` main Scala LOC
- `14` test files
- `466` test LOC
- no claim of byte-for-byte or LOC parity
- test35 described as a broader precedent

That closure was useful local progress, but it should not be treated as closing
the test35 capability. It closed "not trace-only shell" better than it closed
"recursive realization deepening equivalent to test35."

## Established Defect

The current system is missing a governed TypeScript/ABG proof of
`realization-edge recursive deepening`.

The missing parts are:

1. an explicit ABG-native recursive realization capability
2. a TS hook/design surface that can admit lawful re-entry for realization
   edges without creating an SDLC-owned loop
3. a required CDME/source capability inventory derived from requirements and
   design
4. a behavioral test inventory comparable to test35's domain coverage
5. F_D/F_P evidence that rejects shallow module/spec scaffolds
6. operational sequencing that requires governed test evidence after build
7. a sandbox/live proof showing repeated edge re-entry until convergence

## Closure Implication

The fix belongs in the TypeScript/ODD line, with ABG as the traversal authority.

The TypeScript tenant should isolate the capability, express it through graph
functions, typed carriers, hook contracts, evaluators, and sandbox proof, and
only implement imperative code as bounded adapters around those surfaces.

B-067 must be superseded for this capability. T-041 cannot close the full
operational Python-replacement lane until this capability is proven.

## 2026-04-26 Sandbox Update

B-068 added a test35-derived enterprise-core outcome-iteration sandbox:

- graph function: `derive_enterprise_core_code_surface`
- constructor plugin: `plugin://odd_sdlc/enterprise-core-constructor/scripted`
- evaluator plugin: `plugin://odd_sdlc/enterprise-core-evaluator/fd-fp`
- deterministic inventory evaluator:
  `build_tenants/typescript/code/src/qualification/enterprise_core_inventory.ts`
- archive: `build_tenants/typescript/test_env/test_runs/b068_enterprise_core_outcome_iteration/20260426T091252811Z_pid44331/`

The sandbox run passed with:

- `laneVerdict=passed`
- `capabilityVerdict=proved`
- `success_mode=iteration_proven`

Observed sequence:

```text
execution_basis_constructed
graph_function_admitted
graph_call_opened
frame_opened
vector_traversal_planned
fp_plugin_turn_completed
fd_fp_evaluation_blocked
closure_denied
abg_retry_repair_planned
abg_retry_attempt_opened
abg_continuation_terminated
abg_continuation_reopened
abg_retry_progress_recorded
fp_plugin_turn_completed
fd_fp_evaluation_blocked
closure_denied
abg_retry_repair_planned
abg_retry_attempt_opened
abg_continuation_terminated
abg_continuation_reopened
abg_retry_progress_recorded
fp_plugin_turn_completed
fd_fp_evaluation_accepted
vector_closed
terminal_reached
```

This establishes that the capability does not require an immediate ABG
substrate change. ABG already exposes retry-repair, continuation, retry-stop,
and runtime event families sufficient to model same-edge re-entry and bounded
non-convergence.

Corrective review tightening:

- the constructor plugin now fails unless re-entry receives prior artifact
  state and prior blocking reasons
- attempt 2 consumes attempt 1 state and gaps
- attempt 3 consumes attempt 2 state and gaps
- the sandbox asserts the exact ordered ABG runtime event sequence
- diagnostic lane verdict and capability verdict are separate
- build/test evidence requires governed `build://` and `junit://` evidence refs
  in the sandbox archive
- ungoverned `present` build/test evidence is rejected

The deterministic evaluator rejects shallow output when required enterprise
source components, behavioral test components, governed build evidence, or
governed test evidence are absent. That keeps the sandbox from proving only
"attempts happened"; the same-edge re-entry must be driven by concrete missing
inventory and evidence.

The capability inventory is derived from test35's CDME shape and covers type
resolution, topological compilation, morphism execution, synthesis, run
manifest management, artifact versioning, assurance, accounting, adjoint
compilation, fidelity verification, and engine composition.

## 2026-04-26 Hook-Policy Update

The production hook policy now separates hook bounds from ABG re-entry
authority:

- `maySelectNextTraversal: false`
- `nextTraversalSelectionAuthority: "abg_runtime"`
- `unresolvedOutcomeAuthority: "abg_retry_repair"`
- `continuationEvidenceRequired: true`

This is not a tenant-local loop. It preserves the rule that SDLC hooks do not
select the next traversal, while giving unresolved realization depth an explicit
ABG retry/continuation consequence.

Verification:

```text
npm run test:t034
npm run test:semantic
npm run lint:semantic
npm run test:sandbox
```

## 2026-04-26 B-069 Hardening Update

The B-068 proof lane now has public handoff evidence and a non-convergent gap
path.

Successful archive:

```text
build_tenants/typescript/test_env/test_runs/b068_enterprise_core_outcome_iteration/20260426T091252811Z_pid44331/
```

Gap archive:

```text
build_tenants/typescript/test_env/test_runs/b068_enterprise_core_outcome_iteration/20260426T091252815Z_pid44331/
```

The successful archive records, per attempt, the prior artifact state and
unresolved reasons consumed by the constructor. The gap archive records
`successMode=abg_gap_detected`, `capabilityVerdict=not_proved`, and
`abg_retry_repair_stopped:retry_budget_exhausted`.

The T-047 sandbox archive also records fixture authority. Mutable local
`data_mapper.template` evidence is marked `forensic_local_reference`, not RC
proof authority.

## 2026-04-26 B-068 Closure Update

B-068 now closes as a refactor verification gate.

Successful archive:

```text
build_tenants/typescript/test_env/test_runs/b068_enterprise_core_outcome_iteration/20260426T091252811Z_pid44331/
```

Gap archive:

```text
build_tenants/typescript/test_env/test_runs/b068_enterprise_core_outcome_iteration/20260426T091252815Z_pid44331/
```

Closure facts:

- ABG owns retry, continuation, retry-stop, event truth, and stop law.
- odd_sdlc.TS owns the CDME inventory, hook policy, evaluator contract, plugin
  handoff, and proof interpretation.
- The sandbox proves two denied closures before convergence.
- The archive records prior-state handoff evidence for each re-entry.
- Shallow output and ungoverned build/test evidence fail deterministic
  evaluation.
- The result is not a Python loop copy because traversal re-entry is driven by
  ABG retry/continuation decision carriers, not a tenant-local next-step
  selector.

This does not claim full live Python replacement. External live F_P
substitution and live `data_mapper` RC qualification remain T-041 scope.
