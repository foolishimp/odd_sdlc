# T-204 Phase 6a: Semantic Compiler Prompt Evaluation

## Entry

- entry commit: `dee84aa`
- worktree at entry: dirty from prompt/projection work in
  `build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts`,
  `build_tenants/typescript/code/src/operator/prompt_assets.ts`, and focused
  prompt tests
- re-entry: design reframe plus realization refactor
- purpose: reassert T-204 by moving prompt contradiction detection to the
  semantic compiler/release gate instead of patching installed-operator runtime
  liveness behavior

## Boundary

`PRODUCT.md` and T-204 already require this split:

- ABG owns graph conformance, traversal units, runtime truth, replay,
  continuation, closure, ledger/projection roots, and result admission.
- `odd_sdlc` owns graph declarations, product plugin meaning, prompt policy,
  target-carrier meaning, and read-model interpretation.
- prompt text is a rendered view over typed prompt assets and admitted graph
  carrier context, not a second schema or local runtime authority.

This phase does not add operator control, ledger storage, retry behavior,
runtime event authorship, or data-mapper-specific product knowledge.

## Source Delta

Changed source/tests:

- `build_tenants/typescript/code/src/gtl_conformance/program.ts`
  - replaced the hardcoded single-edge prompt review with graph-derived
    prompt materialization
  - materializes all hook-backed prompt projections from the current GTL module
  - feeds materialized prompt assets into ABG GTL conformance input
  - adds deterministic prompt checks for asset/carrier linkage and known
    target-carrier contradiction classes
  - adds deterministic source-authority checks over active source-identity
    surfaces for known T-204 regression classes:
    design-depth archive-status authority, review-grade retryable-postflight
    downgrade, and workspace-gaps archive reads escaping diagnostic/read-model
    boundaries, plus product-materialization requirement-marker rescans
  - publishes the same source-authority rules as structural
    `sourceAuthorityPolicies` rows in the GTL conformance input, so ABG
    `typecheckGtlProgram(...)` can enforce the rules once the refreshed
    compiler package is consumed
  - adds a switched final `F_P.eval` review gate:
    `ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL=required`
- `build_tenants/typescript/test_env/tests/test_t194_gtl_program_conformance.test.mjs`
  - proves prompt materialization counts
  - proves source-authority regression fixtures are rejected by the semantic
    compiler
  - proves the `F_P.eval` gate is skipped by default, fails closed without a
    review result, and passes with an admitted matching result
- `build_tenants/typescript/test_env/tests/test_t197_product_gtl_gate.test.mjs`
  - updates prompt asset coverage to require graph-derived materialized prompt
    rows

Pre-existing prompt optimization edits remain in:

- `build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts`
- `build_tenants/typescript/code/src/operator/prompt_assets.ts`
- `build_tenants/typescript/test_env/tests/test_t181_fp_evaluator_design_register.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs`

## Compiler Counts

| Surface | Count |
| --- | ---: |
| materialized graph vectors | 125 |
| hook-backed prompt projections | 99 |
| non-prompt graph vectors | 26 |
| prompt asset rows in GTL conformance input | 102 |
| deterministic prompt-review issues | 0 |
| source-authority issues | 0 |

## ABG Interface

Consumed ABG interface:

- `admitGtlProgramConformanceInput(...)`
- `typecheckGtlProgram(...)`
- `sourceAuthorityPolicies` over `sourceIdentitySurfaces`
- Node-borne GTL `AssetSurface` prompt asset law
- graph/vector/traversal-unit conformance rows

ABG compiler delta in `/Users/jim/src/apps/abiogenesis`:

- `GtlProgramConformanceInput` admits optional `sourceAuthorityPolicies`;
- `typecheckGtlProgram(...)` evaluates declared token predicates over admitted
  source identity surfaces and emits the policy ref as the conformance
  `ruleRef`;
- `GtlProgramConformanceInput` admits optional `semanticReviewGates`;
- `typecheckGtlProgram(...)` rejects stale, failed, finding-bearing, or
  duplicate semantic compiler F_P review gate rows;
- T-150 proves archive-status authority, retryable-postflight downgrade, and
  read-model writer/control regressions fail at compiler time;
- T-150 proves semantic review gate admission/checking fails closed.

## First-Update Timeout Root Cause

The data-mapper resume exposed repeated
`design_depth_fp_evaluator_first_update_timeout` and
`design_depth_fp_evaluator_progress_timeout` results. The continuation path was
lawful: ABG selected `same_edge_retry` and restarted the edge in the same
workspace. The defect was prompt projection. The design-depth evaluator prompt
first allowed evidence reads before the first non-draft content-ledger write,
then overcorrected into a mechanically impossible instruction: it told the
worker to overwrite a pre-created draft ledger before any `Read`, while the
active worker tool requires a prior `Read` before `Write` on that file. It also
treated an empty/null 12-section liveness packet as semantic progress, which
encouraged hidden full-register synthesis after the first write.

Applied prompt/projection fix:

- the only pre-write read is the existing draft content ledger slot, with a
  bounded `Read` needed to satisfy the worker tool's read-before-write policy;
- the next tool action must write one non-draft
  `designCompletenessVerdict` fragment with partial axes and explicit reasons;
- construction brief, ADR/output, worker report, invocation package, handoff
  manifest, and broad authority tables are post-first-write inputs;
- subsequent reads must be paired with the next write for a named section;
- the deterministic semantic prompt review rejects rendered design-depth prompts
  that forbid the required pre-write ledger read or claim empty/null liveness
  packets are semantic progress.

This deliberately avoids `installed_operator.ts` seed behavior or local runtime
liveness scaffolding.

Still explicit non-closure:

- this phase does not move remaining `move_to_abg` runtime/effects/archive
  files;
- this phase does not run the data-mapper live proof;
- this phase does not make `F_P.eval` automatic in ordinary deterministic
  builds.

## Validation

Passed:

```text
npm run build:semantic
```

Passed in ABG:

```text
npm run build:semantic
node --test test_env/tests/test_t150_gtl_program_conformance_tool.test.mjs
```

Result: 87/87 passing.

After the `semanticReviewGates` ABG compiler row was added:

```text
node --test test_env/tests/test_t150_gtl_program_conformance_tool.test.mjs
```

Result: 88/88 passing.

After source-authority policy coverage and traversal bind tests were completed:

```text
npm run build:semantic
node --test test_env/tests/test_t150_gtl_program_conformance_tool.test.mjs
```

Result: 89/89 passing.

Passed:

```text
node --test \
  test_env/tests/test_t194_gtl_program_conformance.test.mjs \
  test_env/tests/test_t197_product_gtl_gate.test.mjs
```

Result: 37/37 passing.

After the first-update prompt contract was tightened:

```text
node --test \
  test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs \
  test_env/tests/test_t194_gtl_program_conformance.test.mjs \
  test_env/tests/test_t197_product_gtl_gate.test.mjs
```

Result: 46/46 passing.

After the review-grade final-output-ban compiler check was added:

```text
npm run build:semantic
node --test \
  test_env/tests/test_t194_gtl_program_conformance.test.mjs \
  test_env/tests/test_t184_handoff_partition_boundary.test.mjs \
  test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs
```

Result: 38/38 passing.

Passed:

```text
node --test --test-name-pattern \
  'T-181 installed operator declares an F_P evaluation rule for register population' \
  test_env/tests/test_t181_fp_evaluator_design_register.test.mjs
```

Passed:

```text
npm run guard:pack-no-command-artifacts
```

Passed switch behavior:

- `ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL=required` without
  `ODD_SDLC_SEMANTIC_COMPILER_FP_REVIEW_RESULT` fails closed and reports the
  current deterministic digest.
- an admitted
  `sdlc_semantic_compiler_fp_review_result` fixture with matching digest,
  `status=passed`, and `findingCount=0` passes the gate.

## Verdict

Partial.

The semantic compiler now constructs all current graph-derived prompt-bearing
projections and supplies deterministic fail-fast checks plus a switched final
`F_P.eval` release gate. This closes the prompt-contradiction discovery gap that
caused live overwork and runtime discovery.

The compiler now also rejects the concrete T-204 source-authority regressions
identified during review: archive status cannot become design-depth acceptance
authority, review-grade cannot downgrade retryable current-postflight pressure
to a non-retryable triage gap, and the workspace gaps archive reader cannot
become an artifact writer or traversal/control caller.

The resumed data-mapper component-test review also exposed a review-grade
finalization defect in the old loaded prompt: final-decision prose could be
emitted before the durable assessment overwrite. The source prompt now carries
a final-decision output ban, and the semantic compiler rejects review-grade
prompt projections that do not require the next emitted item to be the `Write`
tool call after final status/findings are known.

The continued UAT-test source edge exposed a related transform prompt-scope
defect. The old loaded prompt rendered `obligations in scope: 170` while also
requiring the report to cover exactly the 22 `inlineObligationIds` in the active
edge package. The UAT target carrier was lawful; the defect was the prompt
label. The source transform prompt now distinguishes broad `authority
obligations visible` from the active `inlineObligationIds` report scope, and
the semantic compiler rejects the old ambiguous wording.

The same edge also exposed a carrier/projection defect after the prompt wording
was understood: the framework-generated post-transform `worker_result_report`
was emitted from the broad manifest obligation context instead of the active
edge report scope. That created 170 obligation assessments when the admitted
active package carried 22 `inlineObligationIds`. The fix adds
`activeReportObligationIds` to the handoff manifest, projects
post-transform report assessments from that active scope, preserves the older
requirement-surface conform-project behavior only when no active scope exists,
and adds a source-authority compiler rule rejecting broad-manifest report
projection. This is a T-204 adherence fix: the product plugin carries admitted
scope; `odd_sdlc` does not infer a second authority surface from archive or
manifest breadth.

The resumed data-mapper run proved this correction in the stale installed
runtime path: the retry at
`20260622T230124580Z_pid4921` emitted 22 report assessments, review-grade
passed all 22 findings, and the edge closed. The later terminal block was a
different product execution result: generated Scala/Spark tests failed because
Spark/Hadoop attempted `javax.security.auth.Subject.getSubject` while creating
`SparkSession`. ABG/odd_sdlc handled that as typed
`test_execution_result_failed` repair pressure on
`derive_test_execution_result_surface`; it was not a traversal-control crash or
a regression to local command orchestration.

Latest validation after this check:

```text
odd_sdlc npm run build:semantic
odd_sdlc node --test test_t194/test_t184/test_t192
odd_sdlc git diff --check
```

Result: 39/39 passing.

After the active-report-scope carrier/projection fix:

```text
odd_sdlc npm run build:semantic
odd_sdlc node --test test_t141_gtl_transform_boundary.test.mjs \
  test_t194_gtl_program_conformance.test.mjs
odd_sdlc git diff --check
```

Result: 18/18 passing.

```text
ABI npm run build:semantic
ABI node --test test_t150_gtl_program_conformance_tool.test.mjs
ABI git diff --check
```

Result: 89/89 passing.

Crash-resume validation on 2026-06-23:

```text
odd_sdlc npm run build:semantic
odd_sdlc node --test test_t192_evaluation_grid_prompt_contract.test.mjs
odd_sdlc node --test test_t141_gtl_transform_boundary.test.mjs \
  test_t181_fp_evaluator_design_register.test.mjs \
  test_t184_handoff_partition_boundary.test.mjs \
  test_t192_evaluation_grid_prompt_contract.test.mjs \
  test_t194_gtl_program_conformance.test.mjs
odd_sdlc npm run guard:pack-no-command-artifacts
odd_sdlc git diff --check
ABI npm run build:semantic
ABI node --test test_t150_gtl_program_conformance_tool.test.mjs
ABI git diff --check
```

Result:

- `npm run build:semantic` passed in both repos.
- T-192 passed 8/8 after compact review-grade progress wording was shortened
  while preserving the compiler-required read-only and final-write markers.
- The compact review-grade prompt fixture is 23,993 characters, under the
  24,000-character bound.
- T-141/T-184/T-192/T-194 passed in the combined focused run; the whole-file
  T-181 member was canceled after hanging outside the focused slice, but the
  recorded T-181 design-depth prompt source contract test passed in isolation.
- ABI T-150 passed 89/89.
- Pack guard and `git diff --check` passed.

T-204 remains open for the broader runtime/control/archive move-to-ABG work and
for renewed hello-world/data-mapper live proof after this compiler gate is
carried through the current tree.
