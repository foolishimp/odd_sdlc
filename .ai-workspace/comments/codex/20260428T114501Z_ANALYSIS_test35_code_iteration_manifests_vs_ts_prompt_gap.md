# Analysis: test35 Code Iteration Manifests Versus TypeScript Prompt Gap

**Status**: commentary analysis  
**Date**: 2026-04-28  
**Scope**: `data_mapper.test35` `derive_code_surface` loops, literal F_P
manifests, and comparison with the current TypeScript `data_mapper.test54.ts`
code-edge handoff.  
**Purpose**: isolate the mechanism that forced `test35` to keep deepening code
and identify the remaining gap in the TypeScript prompt/control surface.

## Source Surfaces

Python/test35 evidence:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/events/events.jsonl`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_manifests/derive_code_surface_*.json`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_results/derive_code_surface_*.json`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_ledgers/derive_code_surface_*.json`

TypeScript comparison evidence:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test54.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T085856107Z_pid94335/worker_prompt.md`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test54.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T085856107Z_pid94335/handoff_manifest.json`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test54.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T085856107Z_pid94335/traversal_intent_package.json`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test54.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T085856107Z_pid94335/worker_result_report.json`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test54.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T085856107Z_pid94335/assurance_satisfaction.json`

## Executive Finding

The missing capability is not simply "run the code worker more times."

`test35` had `16` code-edge manifests, `15` result files, `14` fulfillment
ledgers, `14` `edge_converged` closures, and only `3` explicit
`fp_dispatched` code turns. The later code passes were mostly
found/replay/salvage/proof pressure over the same code surface.

The productive mechanism was:

```text
current code surface
  + exact failing F_D evaluator output
  + declared requirement obligation ledger
  + current-state-first control frame
  + behavioral evidence policy
  + per-requirement result assessment
  -> repaired/deepened code or ledger
  -> proof/closure event
  -> later edge can still find/re-open code pressure
```

The current TypeScript line has a much larger prompt and better typed manifest
shape, but its code edge still closed too early because the evaluator accepted
one coarse materialized code surface as satisfying all obligations.

The gap is active pressure, not prompt size.

## Event Analysis Around Code Iterations

Fixed-width table for CLI readability:

```text
#   manifest time           terminal      driver events               F_D pressure at dispatch                     obs  result/ledger                evidence
--  ----------------------  ------------  --------------------------  -----------------------------------------  ---  ---------------------------  -----------------------------
1   20260418T190358184950Z  completed     found + fp + salvage        dependency + trace + ledger + semantic      71  result 71, ledger 71/71       61 scala refs, 6 modules
2   20260418T212427313054Z  failed        fp, no salvage              semantic convergence                         71  no admitted result/ledger      none
3   20260418T213651728764Z  completed     fp + salvage                semantic convergence                         71  result 71, ledger 71/71       63 scala refs, 6 modules
4   20260419T105551563800Z  completed     found + salvage             traceability + ledger                        77  result 77, ledger 77/77       78 scala refs, 6 modules
5   20260419T110544446467Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       78 scala refs, 6 modules
6   20260419T111234234518Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       78 scala refs, 6 modules
7   20260419T112047091989Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       77 scala refs, 6 modules
8   20260419T112706978318Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       77 scala refs, 6 modules
9   20260419T113433945460Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       77 scala refs, 6 modules
10  20260419T114155574394Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       76 scala refs, 6 modules
11  20260419T114907331529Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       76 scala refs, 6 modules
12  20260419T115454125068Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       76 scala refs, 6 modules
13  20260419T120200725094Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       76 scala refs, 6 modules
14  20260419T120953407959Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       76 scala refs, 6 modules
15  20260419T121644750776Z  completed     found + salvage             ledger carry                                 77  result 77, ledger 77/77       76 scala refs, 6 modules
16  20260419T122357637337Z  open/incomp.  found, observed result      ledger carry                                 77  result 77, no ledger          76 scala refs, 6 modules
```

Read of the table:

- pass `1` created or admitted a broad behavioral code surface from zero code
  pressure
- pass `2` failed under semantic convergence before a result/ledger was
  admitted
- pass `3` repaired the semantic pass
- pass `4` is the important repair pass: the code surface already had `105`
  code files and `34` test files, but F_D still reported missing requirement
  traces for `REQ-ENG-001` through `REQ-ENG-006`
- passes `5` through `15` repeatedly closed the declared obligation carry over
  the same code surface
- pass `16` observed a result but did not publish a ledger/closure before the
  log moved on

This is why file-count comparison alone is misleading. The crucial behavior is
that code remained a proof surface after code existed.

## What The Literal test35 Code Manifest Carried

Every `derive_code_surface` manifest carried these load-bearing fields:

```text
manifest_id
call_id
edge
vector_id
job_id
graph_function_id
materialization_id
source_asset
target_asset
failing_evaluators
fulfillment_obligations
obligation_ledger_policy
fd_failures
fd_results
delta
unresolved_count
delta_summary
contexts
current_asset
prompt
result_path
target_asset_binding
environment_asset_bindings
target_asset_surface
environment_asset_surfaces
runtime_environment_contract
requirements
resolved_policy
graph_call_terminal_on_result
selected_backend
```

The fields that forced multiple iterations were:

- `failing_evaluators`: exact F_D/F_P failures for the edge
- `fd_results`: executable check output, not just a reason string
- `delta_summary`: compact human/worker-facing summary of remaining failure
- `contexts`: mandatory control frames
- `current_asset`: current target surface state
- `fulfillment_obligations`: one declared requirement obligation per expected
  requirement
- `obligation_ledger_policy`: the rule for what counts as closure
- `prompt`: a projection over all of the above, not independent instruction

The three mandatory context frames on every inspected code manifest were:

```text
odd_sdlc_stateful_builder_control_frame
odd_sdlc_requirement_closure_builder_context
odd_sdlc_realization_deepening_control_frame
```

## The Prompt Pressure That Mattered

The prompt was not just bigger. It was sharper.

Representative pressure in pass `4`:

```text
[CURRENT STATE]
Edge: derive_code_surface
Source asset: implementation_module_surface x implementation_stack_profile
Target asset: code_surface
Status: converged
Edges converged: ['derive_implementation_module_surface']

[WORKING METHOD] - current-state-first execution is mandatory:
  1. Inspect the current target asset state in workspace before making changes.
  2. Determine what is already realized and what remains unresolved.
  3. Treat the current workspace state as truth; prior manifests and prior prompts are historical evidence only.
  4. Continue construction from the present state and reduce the unresolved gap before assessment.
```

The same manifest included exact F_D output:

```text
code_file_count: 105
test_file_count: 34
failure_kind: traceability_gap
missing_requirement_ids:
  REQ-ENG-001
  REQ-ENG-002
  REQ-ENG-003
  REQ-ENG-004
  REQ-ENG-005
  REQ-ENG-006
suggested_repair: Add Implements tags for the missing REQ ids and remove or tag orphan generated source files.
```

And it ended with hard execution rules:

```text
Update the workspace artifact(s), not just the assessment file.
Clear every deterministic F_D failure before treating the work as done.
Treat standards and output-contract contexts as mandatory acceptance checks.
Self-check the artifact against the target markov conditions before writing assessment JSON.
Mandatory contexts for this edge: published_source_code_surface
```

That is the core difference. `test35` did not ask the worker to "make code."
It told the worker which deterministic proof obligations were still failing
against the current code state.

## TypeScript Code Edge Prompt In test54

The TypeScript code-edge prompt in `test54` was not small or empty. It was much
larger than the Python prompts because it embedded the full handoff manifest.

Observed metrics:

```text
TS worker prompt length: 360,776 characters
TS code-edge obligations: 106
TS requirement obligations: 90
TS method refs: 4
TS authority refs: 22
TS runtimeContextRefs: 0
TS priorEdgeRefs: 0
TS priorGapDossierRefs: 0
TS retryAttemptRefs: 0
TS materialized files: 9
TS worker assessments: 106 fulfilled / 0 partial / 0 blocked
TS unique assessment evidence refs: 14
TS assurance status: close_allowed
```

The current TS prompt has strong contract mechanics:

- manifest authority
- exact result report schema
- product materialization contract
- tenant-root-relative path basis
- declared module list
- build and test execution contracts
- obligation assessment requirement
- concrete requirement payloads with source snippets and digests

The current TS prompt also has a serious pressure gap:

- no prior edge refs
- no prior gap dossier refs
- no runtime context refs
- no exact failing F_D output from a previous code state
- no current-state-first control frame equivalent
- no schedule/work-package target
- no evaluator that rejected the coarse seven-file implementation as
  under-realized
- no downstream test/code feedback that re-opened `derive_code_surface`

The result was a formally clean but shallow closure:

```text
7 main Scala files
build.sbt + plugins.sbt
106 obligations marked fulfilled
14 unique evidence refs
assurance_satisfaction.status = close_allowed
```

That is the algebraic break: the worker fulfilled the declared obligations as
the current evaluator understood them, but the evaluator did not force the
kind of behavioral coverage that `test35` forced.

## Prompt/Manifest Gap: test35 Versus Current TS

```text
Dimension                 test35 code manifest                                      current TS code handoff
------------------------  ------------------------------------------------------    -----------------------------------------------
Current state pressure    Embedded current target state and exact F_D failures       No priorEdgeRefs, priorGapDossierRefs, or runtimeContextRefs
Failure payload           Full fd_results stdout, missing REQ ids, file counts       No failing code-state payload on first code pass
Iteration trigger         F_D traceability/ledger failures re-opened code proof      Code postflight and assurance allowed closure
Worker instruction        Continue from current state and reduce unresolved gap       Produce target asset and report all obligations
Obligation unit           71/77 per-requirement obligations with behavioral refs      106 obligations, but coarse output evidence can satisfy many
Evidence standard         Behavioral code refs per requirement in fulfillment ledger  14 evidence refs across 106 fulfilled assessments
Control frames            Stateful builder + requirement closure + deepening frames  Method refs present; runtime context frames absent
Result lifecycle          observed -> salvage -> assessed -> proof -> closure        observed -> postflight -> close_allowed
Code reopening            Later passes found/replayed code and repaired carry gaps    Moved on to test design after one code pass
Depth mechanism           Repeated proof over current artifact state                  One broad materialization pass
```

The surprising point: TypeScript has more bytes and more typed structure in the
prompt, but less operational pressure. `test35` had smaller prompts that were
fed by sharper failure state.

## Why test35 Kept Going

The code surface remained live because each code pass was evaluated against
specific unresolved proof pressure:

```text
zero code
  -> dependency/trace/ledger/semantic failures
  -> broad code generation
  -> semantic failure
  -> repair
  -> traceability failure over 105 files and 34 tests
  -> repair missing REQ-ENG traces
  -> repeated obligation-ledger carry proof
  -> edge convergence
```

The key transition is pass `4`, where the system already had a large codebase
but still treated `derive_code_surface` as incomplete because F_D could point
to exact missing requirement traces.

Current TS did this instead:

```text
no code
  -> one broad code generation
  -> materialization satisfied
  -> shallow-realization satisfied
  -> capability satisfied
  -> semantic convergence satisfied
  -> requirement fulfillment satisfied
  -> next edge
```

That is premature closure.

## Concrete Gap To Implement

The missing TS solution is not another free-form prompt patch.

The required fix is to make the code edge produce and consume the same kind of
proof pressure that `test35` had, but in the TS/ODD architecture:

1. Add a schedule/work-package surface before code realization.
2. Execute code by bounded package or module work units, not one broad code
   surface.
3. After every code package, run deterministic F_D checks that can produce:
   - missing requirement coverage
   - missing module capability
   - shallow implementation
   - orphan files
   - missing test-facing API
   - missing execution/build compatibility
4. Emit those failures as typed gap dossiers, not only assurance archive
   content.
5. Feed those gap dossiers into the next code-package handoff as prior gap
   pressure.
6. Let later test/design/archive edges point back to code packages when their
   evidence proves code is incomplete.
7. Close `derive_code_surface` only when package-level coverage and aggregate
   code-surface coverage both pass.

The TS equivalent should look like:

```text
RealizationSchedule
  -> CodeWorkPackage[cdme-compiler:type-resolver]
  -> F_D coverage/proof
  -> GapDossier | PackageClosed
  -> CodeWorkPackage[cdme-executor:morphism-executor]
  -> F_D coverage/proof
  -> GapDossier | PackageClosed
  -> AggregateCodeSurface
  -> F_D aggregate coverage/proof
```

## Immediate Diagnostic Test

A focused next test should not try to finish all of `data_mapper`.

It should prove that a TS code edge with intentionally incomplete output does
not close:

```text
Input:
  requirements require at least two named capabilities
  implementation modules declare both capabilities
  worker produces one capability only

Expected:
  materialization may pass
  shallow-realization may pass
  aggregate requirement/module coverage must fail
  gap dossier must name the missing capability/requirement
  next handoff must include prior output + missing capability gap
  same code package or code edge must re-enter
```

That is the smallest TS proof corresponding to the `test35` pass-4 behavior.

## Bottom Line

`test35` achieved depth because the code edge was governed by current-state
failure pressure and per-requirement behavioral ledgers.

Current TS has a typed prompt, but the code edge still lacks a sufficiently
strict coverage evaluator and a work-package/deepening loop. The code worker
can claim all obligations fulfilled against a small set of broad module files,
and the assurance fold accepts it.

The next implementation should therefore focus on the code-edge evaluator and
schedule/package loop, not on making the prompt longer.

