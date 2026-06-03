---
id: T-188
title: Force F_P depth through same-sandbox iteration and prompt control
type: bug
ticket_category: implementation_migration
status: active
proof_status: pending
build_tenant: typescript
owner: odd_sdlc
goal: make data-mapper-scale depth emerge from repeated F_P construct/evaluate/repair turns instead of one-shot closure or F_D compensation
change_intent: Preserve the T-185/T-187 authority decisions while making broad SDLC work converge through agentic F_P iteration: transform workers may use subagents/workstreams, evaluators must emit concrete depth gaps, and ABG/F_D must admit, fold, and route those findings without evaluating product depth itself.
change_class: design_reframe
re_entry_point: design
priority: critical
triaged_at: 2026-06-01
created_at: 2026-06-01
updated_at: 2026-06-03
governance_scope: STDO Method
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - .ai-workspace/tickets/completed/T-185-agent-internal-subworkstreams-for-compute-stage-acceleration.md
  - .ai-workspace/tickets/completed/T-187-restore-fp-evaluator-prompt-boundary-and-proportionality.md
  - .ai-workspace/comments/codex/20260601T122142AEST_data_mapper_latest_vs_test35_depth_review.md
related_tickets:
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - .ai-workspace/tickets/completed/T-185-agent-internal-subworkstreams-for-compute-stage-acceleration.md
  - .ai-workspace/tickets/completed/T-187-restore-fp-evaluator-prompt-boundary-and-proportionality.md
  - .ai-workspace/tickets/completed/T-189-close-t188-runtime-authority-bug-ledger-and-abg-handoff.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-147-realize-t188-runtime-authority-invariants-in-abg.md
affected_boundary:
  - build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts
  - build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/operator/component_depth_register.ts
  - build_tenants/typescript/code/src/operator/plugins/consequence/edge_projection.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/fixtures/
  - build_tenants/typescript/test_env/sandbox/
  - build_tenants/typescript/test_env/live/
excluded_boundary:
  - F_D semantic evaluation of product depth
  - deterministic ADR/source/test parsing that decides product meaning in core SDLC
  - external patches to generated data_mapper product code
  - stack-specific defaults in SDLC core
  - new sandbox starts when same-sandbox repair/resume is possible
target_truth: Broad/data-mapper-scale work is expected to need many bounded F_P turns. `F_P.transform` may use agent-internal subagents or workstreams to materialize a tranche and return honest residual pressure. `evaluate.C/F_P` judges depth and emits fulfilled/partial/blocked findings with concrete repair actions. ABG/F_D admits those returned facts, folds residual pressure, and routes same-sandbox re-entry. It never decides product depth itself and never compensates for shallow product work.
superseded_truth: A data-mapper-scale lane can close from a shallow one-shot product artifact because broad obligations were cited, because partial findings were converted into unowned downstream carry, or because a blocked depth/parity carrier was structurally admitted while its blocked status was ignored.
closure_law: T-188 closes only when admitted evaluator open obligations and blocked depth/parity carriers cannot disappear during closure; broad prompts explicitly normalize tranche-based F_P iteration; same-sandbox repair is the default for depth gaps; and a live or sandbox data-mapper-scale proof shows depth pressure forcing F_P iteration without F_D semantic compensation or external product-code patches.
evaluation_criteria:
  - transform prompts for broad/domain-product work tell the worker to work in bounded tranches, use subagents/workstreams when useful, and return honest residual pressure rather than claiming final parity in one pass
  - evaluate prompts require concrete depth findings: missing behavior/test overlap is partial or blocked with specific repair actions, not fulfilled by tag/path/schema/test-smoke evidence alone
  - `fp_evaluate_result.status: admitted_with_open_obligations` contributes closure residual pressure unless every open finding is lawfully bound to a concrete downstream edge that still exists in the active graph
  - proof/release/terminal edges cannot hide open obligations as future pressure
  - `releaseDepthParity.status: blocked` or component repair schedule `triage_gap` remains valid admitted truth but prevents edge/route close until repaired or lawfully repriced
  - downstream carry requires explicit downstream graph-function refs, target binding refs, and ownership; otherwise the open obligation remains edge-local residual pressure
  - same-sandbox retry/repair preserves the active workspace and resumes from the failed edge when the defect is product-worksite depth, not framework/runtime failure
  - delivery includes a dedicated data_mapper-lite lifecycle sandbox/lane that is small enough for tight proof but still traverses requirement, design, component code, test design, component test, test execution result, repair if required, and release surfaces
  - data_mapper-lite bootstrap is sourced from the canonical data_mapper requirements document, selecting a small explicit requirement subset sufficient to prove depth, rather than inventing a toy product brief
  - the data_mapper-lite proof must generate product tests and run them through the normal installed operator test-execution evidence path
  - tests prove the above through synthetic bad-depth fixtures before any data-mapper live run is accepted as proof
proof_surface:
  - deterministic fixture for the latest-run failure shape: `fp_evaluate_result` has fulfilled plus partial obligations, and operator closure must not be `close`
  - deterministic fixture for blocked `releaseDepthParity` showing structural admission without closure
  - prompt-boundary tests proving broad workers receive tranche/iteration guidance but no F_D semantic recipe
  - consequence/closure tests proving downstream carry cannot erase open obligations without concrete downstream ownership
  - checked-in data_mapper-lite fixture generated from a documented subset of canonical data_mapper requirements, plus live/sandbox lifecycle runner that proves generated tests execute through the standard test lifecycle, not by a harness shortcut
  - same-sandbox live or sandbox data-mapper proof that shows multiple F_P iterations caused by admitted depth findings and no external product-code patching
non_closure_conditions:
  - F_D/core SDLC decides whether generated data_mapper code is behaviorally deep enough
  - a blocked/partial evaluator finding is accepted as closure because it has an evidence ref, source digest, or requirement marker
  - `release_depth_parity_surface` can close while its admitted payload says blocked
  - data-mapper product bugs are patched from outside the F_P sandbox
  - a new sandbox is started to avoid a repairable same-sandbox depth gap
  - only full data_mapper, hello-world, or synthetic fixtures are used as proof while no data_mapper-lite lifecycle lane exists
  - data_mapper-lite uses invented requirements or an untraceable mini-brief instead of a declared subset of the canonical data_mapper requirements document
  - data_mapper-lite closes without generated tests being executed through admitted test-execution evidence
  - prompt text reintroduces exact semantic construction scripts or stack-specific product repair recipes
  - tenant-stack ambiguity is resolved by SDLC-core ecosystem defaults instead of a generic F_P reconciliation protocol over tenant/worksite authority
---

# T-188: Force F_P Depth Through Same-Sandbox Iteration And Prompt Control

## Intake

The 2026-05-31 data-mapper-scale run proved the modern TypeScript lane can
reach release and execute tests, but it did not prove test35-level depth. The
run also exposed a closure defect: admitted open or blocked depth facts could be
narrowed away.

This is not a request for F_D to judge product depth. `PRODUCT.md` is explicit:
generic constructive SDLC gates expect F_P; F_D may validate, admit, fold, and
route admitted truth, but cannot replace product-changing judgment.

The desired behavior is the test35 pattern in lawful TS form:

```text
F_P transform bounded tranche
-> evaluate.C/F_P emits concrete depth gaps
-> ABG admits the findings
-> consequence routes same-sandbox repair/retry
-> F_P transform next tranche
-> repeat until evaluator passes
```

## Latest-Run Evidence

Latest completed archive under review:

`build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260531T154243945Z_pid19975`

Observed failure patterns:

- `derive_test_execution_result_surface` had `fp_evaluate_result` status
  `admitted_with_open_obligations` with 49 fulfilled and 150 partial, but the
  operator summary closed the edge as 49/49.
- `derive_component_repair_schedule_surface` materialized a triage-gap schedule
  over an unowned component-test qualification failure, but closure narrowed to
  the target asset row.
- `derive_release_depth_parity_surface` wrote `releaseDepthParity.status:
  blocked` with `component_repair_schedule_missing`, but the edge and final
  release surface closed.

These are framework closure/routing defects. They are not generated
data_mapper product defects.

## Design Direction

- F_P owns product depth work and semantic findings.
- F_D/ABG owns admission, event truth, ledger fold, closure fold, replay, and
  routing from admitted truth.
- Broad prompts must make iteration normal: tranche, assess, repair, continue.
- Stack ambiguity is a generic F_P disambiguation protocol: the worker is told
  where to look, what decision to record, and what proof to run, but SDLC core
  does not decide ecosystem semantics.
- Closure must honor admitted evaluator/depth facts even when the target carrier
  is structurally valid.
- Downstream carry is a typed obligation handoff, not a way to delete pressure.
- A dedicated data_mapper-lite lifecycle lane is part of this ticket delivery:
  it must be smaller than the full data_mapper run by selecting a few explicit
  requirements from the canonical data_mapper requirements document, but must
  still be deep enough to force design, implementation, generated tests, test
  execution evidence, and repair/release pressure through the normal
  installed-operator lifecycle.

## Initial Work Plan

1. Add the two failing deterministic closure fixtures from the latest run.
2. Patch closure folding so selected open evaluator results remain residual
   pressure unless lawfully owned downstream.
3. Patch blocked depth/parity carrier handling so admitted blocked truth blocks
   close without becoming F_D semantic evaluation.
4. Add a data_mapper-lite lifecycle fixture sourced from a small explicit
   subset of canonical data_mapper requirements, plus a runner that traverses
   through generated test execution evidence.
5. Tighten broad transform/evaluate prompts around tranche iteration, subagent
   permission, depth-gap findings, and same-sandbox repair.
6. Tighten tenant-stack repair prompts around generic F_P reconciliation:
   inspect tenant/worksite authority, record the stack reconciliation decision,
   prove with declared command or bounded probe when runnable, and never encode
   stack-specific defaults in SDLC core.
7. Re-run focused proof, then run a same-sandbox data-mapper proof only after
   the deterministic failures cannot close.

## Implementation Progress

### 2026-06-01 Slice 1

Status: landed source + deterministic proof, live proof still pending.

Changes:

- Added `test_t188_fp_depth_iteration_closure.test.mjs` for:
  - unowned downstream carry cannot erase partial obligation pressure;
  - owned downstream carry remains lawful when graph-function and target-binding
    refs are explicit;
  - `fp_evaluate_result.status: admitted_with_open_obligations` becomes edge
    residual pressure and blocks close.
- Tightened `deriveSdlcEdgeFulfillmentCountsFromAssessments` so downstream
  carry requires explicit downstream graph-function refs and target-binding
  refs. Missing ownership remains edge-local pressure.
- Added `sdlcFpEvaluateOpenObligationPressureRefs` and folded the
  installed-operator-published `fp_evaluate_result.json` status/counts into
  closure residual pressure. This is structural admission/fold only: it reads
  typed F_P evaluate facts and does not inspect product source, tests, logs, or
  tenant-language semantics.
- Added a checked-in `data_mapper_lite_lifecycle` fixture sourced from
  canonical data_mapper requirement IDs `REQ-LDM-01`, `REQ-LDM-02`, and
  `REQ-LDM-03`.
- Added `run_t188_data_mapper_lite_lifecycle.mjs`, a dedicated lifecycle runner
  that points the existing data_mapper sandbox runner at the lite fixture and
  asserts traversal through generated test execution evidence.
- Added `test_t188_data_mapper_lite_fixture.test.mjs` to prove the lite fixture
  is traceable to canonical requirements and contains no prebuilt generated
  product files.

Proof run:

```bash
npm run test:t188
node --test test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs test_env/tests/test_t148_collision_safe_requirement_authority_refs.test.mjs test_env/tests/test_t152_data_mapper_transformation_set_partition.test.mjs test_env/tests/test_t171_execution_backed_closure_law.test.mjs test_env/tests/test_t164_edge_gain_closure_contract.test.mjs
```

Result:

- `test:t188`: passed, 10/10 checks across build, guard, closure, and lite-fixture
  tests.
- Related closure/downstream tests: passed, 39/39.

Remaining:

- Run the T-188 data_mapper-lite lifecycle proof with a live worker:

```bash
npm run test:t188:data-mapper-lite-lifecycle-live
```

- If the lite lane exposes a product-worksite depth gap, preserve the sandbox
  and let F_P repair it; patch only framework/runtime/prompt/admission defects.

### 2026-06-01 Slice 2

Status: landed source + focused proof; live proof still pending.

Closure-gap fix:

- `component_depth_register.ts` now admits component-depth registers carried as
  Markdown-fenced JSON target carriers, matching the live
  `component_repair_schedule_surface.md` and `release_depth_parity_surface.md`
  shape.
- Added `componentDepthResidualPressureRefs`, an ABG/F_D structural fold over
  admitted component-depth status. It does not inspect product source or decide
  product semantics. It turns rejected component-depth admission,
  `componentRepairSchedule.scheduleStatus: triage_gap|repair_required`, repair
  rows, `releaseDepthParity.status: blocked`, and `releaseDepthParity.status:
  repriced` into closure residual pressure.
- `installed_operator.ts` folds those pressure refs into both selected F_P
  evaluation close disposition and edge residual pressure, so a structurally
  admitted blocked/triage carrier cannot close the edge.

Proof run:

```bash
npm run build:semantic
node --test test_env/tests/test_t113_component_depth_register_admission.test.mjs
node --test test_env/tests/test_t188_fp_depth_iteration_closure.test.mjs
npm run test:t188
git diff --check
```

Result:

- `build:semantic`: passed.
- Component-depth admission regression: passed, 7/7.
- T-188 closure regression: passed, 8/8.
- `test:t188`: passed, 12/12 after the new closure cases.
- `git diff --check`: clean.

### 2026-06-02 T-189 Runtime-Authority Carry-Forward

Status: landed source + focused proof against the ABG 3.9.0 release-candidate
line; T-189 is completed with proof passed.

Final data_mapper-lite proof archive:

`build_tenants/typescript/test_env/test_runs/t188_data_mapper_lite_lifecycle_live/20260601T133648251Z_pid66015`

Final observed operator run:

`.ai-workspace/runtime/odd_sdlc/operator-runs/20260601T191101732Z_pid13926`

Bug ledger disposition:

- SDLC-owned fixed bugs remain in T-189: worker tool boundary, component-depth
  carrier shape, bootstrap runtime/control path exclusion, and downstream
  obligation role filtering.
- ABG-shaped bugs are linked to ABG T-147 and carried forward through the
  release-candidate line:
  fresh retry context projection, target-carrier output admission before
  closure/transition, and admitted output-authority projection for source
  assets.
- odd_sdlc now consumes `EnginePluginInput.retryContext` for worker retry
  context projection and `EnginePluginInput.outputAuthorityProjections` for
  source-asset authority refs. Local code remains SDLC domain mapping over
  ABG-admitted facts, not generic replay/payload law.

Proof run:

```bash
npm run build:semantic
node --test test_env/tests/test_t180_abg_3_9_current_staged_compute_boundary.test.mjs test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs
node --test test_env/tests/test_b070_claude_worker_argv.test.mjs test_env/tests/test_t087_project_induction.test.mjs test_env/tests/test_t113_component_depth_register_admission.test.mjs test_env/tests/test_t120_retry_local_repair_prompt.test.mjs test_env/tests/test_t188_data_mapper_lite_fixture.test.mjs test_env/tests/test_t188_fp_depth_iteration_closure.test.mjs
git diff --check
```

Result:

- `build:semantic`: passed.
- T-066/T-140/T-180 focused pack: passed, 102/102.
- T-189 listed regression pack: passed, 58/58.
- `git diff --check`: clean.

### 2026-06-03 Tenant-Stack Reconciliation Extension

Status: product/requirement law ratified; prompt realization landed; focused
proof passed under this ticket.

This is a lawful T-188 extension because it preserves the same target truth:
generic work must converge through F_P construct/evaluate/repair turns without
F_D semantic compensation. The observed hello-world JS run showed a stack
ambiguity pattern inside `F_P.transform`: the worker first made an untested
tenant-stack repair, ran the declared test, observed the real execution context,
and then repaired its own work. The durable fix is not a JavaScript rule in
SDLC core. It is a generic worker protocol that makes F_P inspect the governing
tenant/worksite authority, record a compact reconciliation decision, and prove
the chosen repair before returning.

Requirement re-entry:

- `specification/PRODUCT.md` now states that tenant-stack disambiguation is an
  `F_P.transform` work protocol, not a deterministic stack engine in SDLC core.
- `specification/requirements/18-typed-construction-algebra.md` now includes
  `REQ-F-ODDSDLC-085`, requiring generic F_P tenant-stack reconciliation and
  forbidding SDLC core from encoding ecosystem-specific stack conclusions.

Prompt construction audit:

- Free-form prompt construction is currently three lawful surfaces:
  `promptForHandoff` for `transform.C`, `designDepthFpEvaluatorPrompt` for
  design-depth `evaluate.C`, and `reviewGradeEdgeFulfillmentPrompt` for
  review-grade `evaluate.C`.
- Transform prompt-source carriers are JSON packages beside the prompt
  (`worker_construction_brief.json`, `worker_invocation_package.json`,
  `worker_brief.json`); they are not additional free-form prompt constructors.
- Artifact catalog and analysis code reference prompt artifacts but do not
  construct prompt text.

Realization:

- `REQ-F-ODDSDLC-085` is projected into coding-build/component-code transform
  prompts when tenant stack authority is missing, invalid, contradictory, or
  underdefined.
- Transform prompts now require the generic stack reconciliation protocol:
  inspect tenant/worksite authority, accepted bootstrap/design/ADR refs,
  declared targets, declared commands, and worksite execution-context files;
  record a compact reconciliation decision; prove with declared command or a
  bounded probe when runnable; and do not infer stack-specific defaults.
- Review-grade evaluator prompts now verify agreement among tenant authority,
  emitted files/syntax, declared targets, declared execution commands, and
  returned evidence. The evaluator remains read-only and does not repair product
  files or tenant-stack authority.

Proof run:

```bash
npm run build:semantic
node --test test_env/tests/test_t143_product_materialization_authority_targets.test.mjs test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs test_env/tests/test_t187_fp_evaluator_prompt_boundary.test.mjs
```

Result:

- `build:semantic`: passed.
- Focused prompt/proportionality pack: passed, 64/64.

2026-06-03 live prompt audit update:

- Raw prompt artifacts are treated as contract code, not wording. A generated
  prompt that cannot be inspected directly is not an adequate proof surface.
- `specification/requirements/18-typed-construction-algebra.md` now extends
  `REQ-F-ODDSDLC-083` with AC-10: prompt-bearing edges must keep generated
  prompt artifacts directly inspectable; excess detail must move to typed
  referenced carriers, bounded summaries, or reusable prompt law.
- T-132 JS live PTY run:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260602T155109028Z_pid26716`.
- Actual generated prompt sizes from the first live operator run:
  - `worker_prompt.md`: 83 lines / 12,355 bytes.
  - `design_depth_fp_evaluator_prompt.md`: 242 lines / 40,017 bytes.
  - `review_grade_edge_fulfillment_prompt.md`: 135 lines / 22,106 bytes.
- Actual first worker prompt now projects the tenant-stack scalar contract:
  it requires ADR Stack Profile values from tenant authority for language,
  runtime/module system, build tool, build config, dependency policy, test
  runner, and test command; it also says not to use ecosystem defaults.
- Actual first design-depth evaluator prompt now forbids `null` inside required
  scalar fields and requires `stackProfileRows[].buildTool` to be a scalar string
  when a stack row is emitted.
- Live evaluator output initially drafted empty rows, then rewrote the register
  into semantic rows. Final admitted design-depth register contains
  `buildTool: node`, source target
  `build_tenants/hello_world_javascript/src/hello.js`, test target
  `build_tenants/hello_world_javascript/test/hello.test.js`, component
  `hello_world_main`, and no `package.json`/build_config target.
- Additional prompt ambiguity found and patched: the evaluator prompt example
  allowed trivial products to include build_config file targets without saying
  that build_config must be explicitly declared by authority. It now says
  build_config files are included only when the ADR Product File Targets table,
  tenant stack authority, or another higher accepted product authority explicitly
  declares that exact build/config target, and not from ecosystem convention.
- Additional transform prompt ambiguity found and patched: the worker prompt
  outcome header used `declared product file targets: none`, which can confuse
  current-edge materialization with downstream target design on design edges.
  It now says `current-edge materialized product file targets: none`.
- Additional auditability defect found and patched: ABG output authority
  projection support refs were being copied wholesale into source-asset
  obligation `evidenceRefs`, including serialized runtime/projection identity.
  SDLC now carries compact prompt-visible ABG authority handles and validation
  refs only; oversized/JSON-bearing refs are digest-compressed, and projection
  support evidence remains in ABG/archive surfaces.
- Prompt clause inspectability was tightened: generated evaluator prompts now
  have focused line-length proof, and component-depth transform directives use
  newline-separated clauses instead of multi-kilobyte single lines.
- Focused prompt tests were extended to assert stack scalar validity,
  build_config authority, current-edge materialization wording, ABG projection
  evidence-ref compactness, and generated prompt line inspectability.

### 2026-06-03 PTY Supervisor And Prompt-Profile Hardening

Status: landed source + focused proof + clean PTY hello-world integration proof
plus ABG release carry-forward. ABG `3.9.0-rc.9` is cut and tagged
`v3.9.0-rc.9`; odd_sdlc now pins the RC9 release snapshot tarball that contains
the supervisor, owner-exit cleanup, and retry-frontier coverage fixes.

ABG/runtime fixes:

- PTY execution now uses the topology
  `pty_terminal -> agent_supervisor -> local-spawn -> worker` instead of
  launching the worker directly under the terminal session.
- The supervisor owns hard timeout, inactivity timeout, and process-group
  cleanup for the local-spawned worker. It kills the worker process group and
  escalates after the declared grace interval.
- The supervisor request carries the owning runtime PID and polls that owner;
  if the owner exits, the supervisor terminates the worker process group instead
  of leaving a detached local-spawned worker behind.
- Supervisor decisions are emitted as runtime trace events:
  `terminal_agent_supervisor_configured`,
  `terminal_agent_supervisor_hard_timeout`, and
  `terminal_agent_supervisor_inactivity_timeout`, with legacy compatibility
  timeout events preserved for existing readers.
- Heartbeat/liveness rows no longer reset the progress lease. Progress lease
  reset is limited to substantive progress sources such as local-spawn stdout,
  local-spawn stderr, PTY transcript, structured agent stream, tool call, result
  artifact, and actor lifecycle fallback.
- `inactivityTimeoutMs` is propagated through supervised-process actor calls.
  Heartbeat-only but silent workers now trip inactivity instead of appearing
  active forever.
- The PTY supervisor request archive no longer serializes `env`. The worker
  still inherits `process.env` through the supervisor process, but the trace
  request does not persist environment values or secrets.

SDLC fixes:

- `installed_operator.ts` passes the profile/harness-provided
  `inactivityTimeoutMs` to transform workers, design-depth evaluators, and
  review-grade evaluators.
- Worker tool-profile classification is centralized in
  `worker_tool_profile.ts`, so prompt text and actual worker tool constraints
  use the same shell-capability predicate.
- Transform prompts are profile-aware:
  - shell-capable transform edges receive the command IO cap;
  - non-shell transform edges receive explicit `Read limit <=80` discipline and
    no shell/JQ/sed/cat guidance.
- Evaluator prompts are active-tool-list aware:
  - when command execution is unavailable, review-grade/design-depth evaluators
    use bounded file reads/writes;
  - when command execution is visible in the worker runtime, it is bounded to
    workspace-relative read-only inspection unless an execution probe is
    explicitly named;
  - evaluators are not told to run product, build, test, framework, traversal,
    background, or mutation commands.

### 2026-06-03 Data-Mapper Lite Resume And ABG RC9 Carry-Forward

Status: same-sandbox data_mapper-lite resume converged after one SDLC prompt
bug and one ABG retry-frontier replay bug were fixed. ABG `3.9.0-rc.9` is cut
and tagged `v3.9.0-rc.9`; odd_sdlc now pins the RC9 release snapshot tarball.

Active sandbox preserved and resumed:

`build_tenants/typescript/test_env/test_runs/t188_data_mapper_lite_lifecycle_live/20260602T194859322Z_pid79502/workspace`

Final observed operator run:

`.ai-workspace/runtime/odd_sdlc/operator-runs/20260603T023630429Z_pid54357`

Final observed state:

- `operator_summary.status=converged`
- edge: `prepare_release_surface`
- residual pressure: clear
- closure decision: `close`
- postflight: `passed`
- assurance: `close_allowed`
- next action: `disposition://close`

Bug classifications and fixes:

- SDLC prompt/tenant-authority bug: `component_repair_schedule_surface` prompt
  did not explicitly force non-repair component-depth fields empty/null, so the
  worker copied unrelated topology, realization, test, and qualification rows
  into a no-repair schedule. Fixed in `plugins/transform/launch_contract.ts`;
  regression added in `test_t066_product_materialization_contract.test.mjs`.
- ABG/GTL runtime bug: a `retry_attempt_stopped` event with
  `observedAttemptCount=0` was replayed as retry attempt coverage. ABG RC9 now
  treats zero-attempt stop/escalation events as admitted retry evidence with
  `attemptIndex=null`, not fake attempt coverage. Fixed in ABG
  `retry_frontier.ts`; regression added in ABG
  `test_t098_retry_frontier_projection.test.mjs`.

Proof run:

```bash
npm run build:semantic
node --test \
  test_env/tests/test_t066_product_materialization_contract.test.mjs \
  test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs \
  test_env/tests/test_b070_claude_worker_argv.test.mjs \
  test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs \
  test_env/tests/test_t187_fp_evaluator_prompt_boundary.test.mjs \
  test_env/tests/test_t188_data_mapper_live_boundary_guard.test.mjs \
  test_env/tests/test_t188_fp_depth_iteration_closure.test.mjs
```

Result:

- `build:semantic`: passed.
- Focused SDLC regression pack: passed, 161/161.
- Live data_mapper-lite same-sandbox resume: converged.
- Framework-smoke overlay now routes the terminal product target through the
  component-code producer edge so the smoke lane must dispatch code
  materialization instead of stopping after design evidence.
- Smoke/live script policy supplies the short hello-world lease values through
  harness environment variables. Longer data_mapper-scale leases remain
  profile/project policy, not ABG or SDLC core constants.

Boundary review against the supervisor-risk flags:

- No semantic prod vocabulary was added. The supervisor is control-plane only:
  timeout, inactivity, process exit, and process-group cleanup.
- The local-spawn fallback is not weaker than PTY supervision; the worker child
  is directly owned by the supervisor inside the PTY envelope.
- The smoke inactivity value is harness policy. It is intentionally short for
  hello-world and must not be reused as the data_mapper default.
- There is no automatic mid-artifact restart. Failures are recorded and the
  operator decides retry/repair through the normal admitted lifecycle.
- The PTY topology remains covered by a dedicated live proof instead of being
  bypassed by local-spawn-only smoke execution.
- Timeout/progress decisions are recorded in runtime trace artifacts rather
  than re-derived silently after the fact.

Focused proof:

```bash
# abiogenesis/build_tenants/abiogenesis/typescript
npm run build:semantic
node --test test_env/tests/test_t111_pty_terminal_executor.test.mjs \
  test_env/tests/test_t097_supervised_process_actor.test.mjs \
  test_env/tests/test_t129_runtime_liveness_observer.test.mjs
git diff --check

# odd_sdlc/build_tenants/typescript
npm run build:semantic
node --test test_env/tests/test_t187_fp_evaluator_prompt_boundary.test.mjs \
  test_env/tests/test_t181_fp_evaluator_design_register.test.mjs \
  test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs \
  test_env/tests/test_t086_blocking_reason_carriers.test.mjs \
  test_env/tests/test_t160_traversal_overlays.test.mjs \
  test_env/tests/test_t064_installed_operator_ux.test.mjs \
  test_env/tests/test_t110_abg37_callout_projection.test.mjs
git diff --check
```

Result:

- ABG build + supervisor/liveness tests: passed, 24/24.
- odd_sdlc build + prompt/routing/overlay focused pack: passed, 101/101.
- `git diff --check`: clean in both repos.

Clean live PTY proof:

```bash
npm run test:t132:hello-world-live:pty
```

Run archive:

`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260602T185439764Z_pid64209`

Observed proof:

- Scenario passed: 1/1, duration `1370936.680125ms` (about 22.85 minutes).
- No orphan screen/supervisor/worker processes remained for the run ids after
  completion.
- Design transform prompt:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260602T185447060Z_pid64209/worker_prompt.md`
  had explicit `Read limit <=80`; worker obeyed bounded reads.
- Design-depth evaluator prompt:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260602T185447060Z_pid64209/design_depth_fp_evaluator_prompt.md`
  ran under `Read,Write`, had explicit `Read limit <=80`, and exited cleanly.
- Design review-grade prompt:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260602T185447060Z_pid64209/review_grade_edge_fulfillment_prompt.md`
  ran under `Read,Write`, had no shell/Node helper guidance, and passed.
- Component-code transform prompt:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260602T190642743Z_pid64209/worker_prompt.md`
  was shell-capable, had command IO caps, materialized
  `src/hello.js` and `test/hello.test.js`, and ran the declared test command
  `node --test test/hello.test.js` with 1 pass / 0 fail.
- Component-code review-grade prompt:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260602T190642743Z_pid64209/review_grade_edge_fulfillment_prompt.md`
  ran under `Read,Write`, did not execute the product, and passed 5/5
  obligations from admitted evidence.
- Every inspected `agent_supervisor_request.json` in the clean proof used
  topology `pty_terminal_agent_supervisor_local_spawn_worker` and did not
  serialize an `env` object.

Defects found during the live audit and fixed before the clean proof:

- Old PTY topology could leave orphan worker/evaluator process trees after the
  parent terminal was stopped.
- The first supervisor request implementation archived environment values.
- Evaluator prompts had profile contradictions: `Read,Write` workers were told
  how to preserve env for child-process execution.
- Transform non-shell prompts carried shell syntax and did not give the worker
  explicit `Read limit <=80` discipline.
- Review/evaluator prompt profile and actual tool constraints used duplicated
  shell-profile predicates that could drift.
- The framework-smoke graph could stop after design evidence without dispatching
  the component-code edge.

Additional data_mapper-lite prompt-tool finding:

- The corrected GPT-5.5/Codex data_mapper-lite run showed that Codex exposes
  command execution even on edges whose SDLC profile is no-execution or
  evaluator read/write. The old prompt text therefore created a second surface
  of truth: it claimed `Read,Write` or bounded file tools while the active tool
  list exposed shell execution.
- Classification: prompt/runtime tool-profile honesty bug, not a generated
  data_mapper product defect.
- Fix: transform prompts now say no-execution planning edges may use visible
  commands only for bounded workspace-relative read-only inspection, never for
  product execution, build/test, framework/traversal, background jobs, or
  artifact writes. Evaluator prompts now say to obey the active tool list and
  bound visible command execution to read-only inspection unless an explicit
  execution probe is named.
- Focused proof:

```bash
npm run build:semantic
node --test test_env/tests/test_t187_fp_evaluator_prompt_boundary.test.mjs \
  test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs \
  test_env/tests/test_t188_data_mapper_live_boundary_guard.test.mjs \
  test_env/tests/test_t188_fp_depth_iteration_closure.test.mjs
```

- Result: build passed; focused prompt/depth/live-boundary pack passed, 53/53.
