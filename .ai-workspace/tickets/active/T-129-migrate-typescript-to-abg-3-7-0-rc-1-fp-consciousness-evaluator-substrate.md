---
id: T-129
title: Migrate odd_sdlc TypeScript to ABG 3.7.0-rc.1 F_P consciousness evaluator substrate
type: migration
ticket_category: implementation_migration
status: active
goal: typescript-rc-runtime-architecture
change_intent: Reprice active T-129 from the ABG 3.6.0-rc.1 temporal/runtime checkpoint to ABG 3.7.0-rc.1 after the v3.7.0-rc.1 release cut, and consume the current temporal/runtime/F_P consciousness evaluator/public-gaps contract without creating odd_sdlc-local shadow truth.
change_class: design_reframe
re_entry_point: design
affected_boundary:
  - build_tenants/typescript/package.json
  - build_tenants/typescript/package-lock.json
  - build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts
  - build_tenants/typescript/code/src/graph/
  - build_tenants/typescript/code/src/install/
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
priority: critical
build_tenant: typescript
triaged_at: 2026-05-06
created_at: 2026-05-06
updated_at: 2026-05-08
completed_at: null
review_status: implemented_deterministic_and_t110_live_pending_review
owning_repo: odd_sdlc
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
dependencies:
  - ABG release cut v3.7.0-rc.1
  - ABG T-127 generic F_P consciousness evaluator substrate
  - ABG T-128 post-3.7 runner-level construction intent execution follow-up
  - Historical T-129 RC2 checkpoint evidence
  - odd_sdlc T-105 ABG-owned whole-graph iteration migration
  - odd_sdlc T-110 ABG 3.5.0-rc.1 traced callout migration
  - odd_sdlc T-124 TypeScript install default ABG source-root resolution
related_tickets:
  - odd_sdlc T-123 consume per-edge traversal strategy and delay steel-thread scope
  - odd_sdlc T-120 realize retry local repair prompts from typed gap dossiers
  - ABG T-118 complete ABG defaults bundle expansion after plugin observer slice
  - ABG T-127 define generic F_P consciousness loop with GTL plugin overrides
  - ABG T-128 realize F_P consciousness runner over admitted construction intent
library_usage: consume
migration_strategy: consume_current_abg_release_line_without_local_runtime_shadow
governing_library: ABG 3.7.0-rc.1 TypeScript temporal/runtime/F_P consciousness evaluator substrate
intake_source: Current sibling ABIogenesis TypeScript source reports 3.7.0-rc.1 at commit b3182fe on branch rc/3.7.0 with tag v3.7.0-rc.1; prior T-129 3.6.0-rc.1 proof is historical checkpoint evidence, not current closure proof.
target_truth: odd_sdlc TypeScript consumes ABG 3.7.0-rc.1 as the sole substrate for runtime events, temporal/time-related replay truth, actor/worker process facts, successful terminal session identity, plugin traversal prompt materialization truth, installed ABG fallback config, and the ABG F_P construction evaluator/public-gaps read-only ranking surface where odd_sdlc projects gap or next-action previews. odd_sdlc keeps SDLC domain policy, handoff, postflight, gap dossier, repair-prompt packaging, and operator-facing read-model semantics.
superseded_truth: T-129 remains only a closed ABG 3.5.0-rc.2 or 3.6.0-rc.1 checkpoint, the active design contract still names RC2/3.6 as the current target, odd_sdlc consumes temporal/runtime/evaluator behavior through local shadow code instead of ABG substrate truth, or public gaps/next-action ranking is rebuilt in odd_sdlc when ABG 3.7 evaluator truth is available.
closure_law: Close only when odd_sdlc TypeScript lock/design/test/live surfaces name and consume ABG 3.7.0-rc.1, installed workspaces prove the ABG fallback config is present and refresh-safe, successful PTY terminalSessionId is projected from ABG runtime event truth into odd_sdlc operator evidence, temporal/time-related substrate boundaries are documented as ABG-owned, ABG 3.7 F_P construction evaluator/public-gaps truth is either consumed as the one ranking surface or explicitly declared out of scope for a given odd_sdlc view, and deterministic plus live installed lanes pass.
non_closure_conditions:
  - Claiming migration by relying on a file dependency while package-lock, installed package metadata, design, or live proof still records 3.5.0-rc.2 or 3.6.0-rc.1 as the current target.
  - Updating docs/version strings without running the installed TypeScript installer proof.
  - Reading successful PTY terminal session identity only from ABG trace result files instead of admitted ABG runtime event/projection truth.
  - Treating RC2 or ABG 3.6 fallback/defaults/temporal proof as sufficient for the ABG 3.7 evaluator/runtime migration.
  - Allowing odd_sdlc-local worker archives to compete with ABG trace/archive authority.
  - Adding odd_sdlc-local timer, schedule, or wall-clock authority instead of consuming ABG temporal substrate truth.
  - Rebuilding public gaps, repair-route ranking, next-action priority, or bootstrap induction as odd_sdlc-local controller logic when the ABG 3.7 evaluator surface is the declared authority.
  - Claiming ABG T-128 installed construction-runner behavior as available through 3.7.0-rc.1; T-128 is post-3.7 and not part of this migration target.
  - Breaking the T-124 default sibling ABG source-root behavior.
proof_commands:
  - npm install
  - npm run build:semantic
  - npm run lint:semantic
  - npm run test:t028
  - npm run test:t059
  - npm run test:t129
  - npm run test:t110:abg37-sandbox
  - npm run test:t110:abg37-live
  - npm run test:t102-t110:abg37-sandbox
  - npm run test:semantic
  - npm run test:sandbox
  - npm run test:t109:data-mapper-live
  - git diff --check
---

# T-129: Migrate odd_sdlc TypeScript To ABG 3.7.0-rc.1

## Repriced For 3.7 Migration - 2026-05-08

T-129 is now the controlling ticket for the ABG 3.7 migration. The previous
3.6 work remains valid historical checkpoint evidence, but it is not the
current closure target.

Current upstream evidence:

- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/package.json`
  reports `3.7.0-rc.1`.
- `/Users/jim/src/apps/abiogenesis` is on `rc/3.7.0` at commit `b3182fe`,
  tagged `v3.7.0-rc.1`.
- ABG `3.7.0-rc.1` preserves the 3.6 temporal/Event Calculus substrate and adds
  the T-127 F_P consciousness evaluator substrate.

Current target:

- refresh odd_sdlc's ABG substrate design contract from `3.6.0-rc.1` to
  `3.7.0-rc.1`;
- update dependency, lockfile, installed metadata, and test assertions to the
  ABG 3.7 package identity;
- preserve the 3.6 temporal/runtime proof as a regression boundary under the
  3.7 package identity;
- add or rename proof surfaces so test names match the 3.7 target rather than
  continuing to advertise `abg36` as the current migration lane;
- consume the ABG 3.7 F_P construction evaluator/public-gaps boundary as a
  read-only ranking surface where odd_sdlc projects next asset/action gaps;
- keep odd_sdlc-owned SDLC semantics limited to domain policy, handoff,
  postflight, gap dossier, repair-prompt packaging, and operator read models;
- do not claim the ABG T-128 installed construction runner. That is explicitly
  post-3.7.0-rc.1.

No duplicate migration ticket is opened. T-129 remains the active migration
ticket for this release-line bump.

## Historical 3.6 Migration Checkpoint - 2026-05-07

T-129 was reopened for the ABG 3.6 migration on 2026-05-07.

The prior RC2 work remains valid as historical checkpoint evidence, but it is
not the current closure target. Workspace evidence at that checkpoint:

- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/package.json`
  reports `3.6.0-rc.1`.
- `build_tenants/typescript/package-lock.json` records
  `@abiogenesis/typescript-tenant` root package version `3.6.0-rc.1`.
- `build_tenants/typescript/package.json` consumes the sibling ABG TypeScript
  source by file dependency.

Target at that checkpoint:

- refresh odd_sdlc's ABG substrate design contract from RC2 to `3.6.0-rc.1`;
- verify installed workspaces consume the 3.6 package identity, fallback config,
  and runtime event/projection truth;
- document temporal/time-related substrate boundaries as ABG-owned and keep
  SDLC policy interpretation in odd_sdlc;
- rerun deterministic, sandbox, and live installed proof before closure.

That 3.6 target is now superseded by the 3.7 target above.

## Historical RC2 Implementation Checkpoint - 2026-05-06

The migration has been applied to the TypeScript tenant and is closed with a
scoped operator exception for the remaining `.metals` source-root update
observed during the downstream T-109 data_mapper live lane. The exception is
limited to T-129 migration closure and does not close B-083.

Applied surfaces:

- `build_tenants/typescript/package-lock.json` records
  `@abiogenesis/typescript-tenant` `3.5.0-rc.2`.
- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
  names the ABG RC2 substrate boundary and non-claims.
- `build_tenants/typescript/code/src/operator/installed_operator.ts` consumes
  successful PTY `terminalSessionId` from the ABG `actor_process_started`
  runtime event before falling back to trace projection evidence.
- `worker_process_started_context.json` now records successful PTY
  `terminalSessionId` as odd_sdlc operator evidence over ABG runtime truth.
- `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`
  proves installed `.abiogenesis/config/abg.fallbacks.json` creation,
  refresh-preserved local edits, installed command bindings, package
  dependency preservation, and fail-closed malformed fallback config behavior
  through the public installed CLI path.
- `build_tenants/typescript/code/src/operator/handoff.ts` now carries
  `requirementTraceObligationIds` in the compact prompt projection so live
  workers receive the complete requirement trace checklist while long source
  snippets remain indexed in the manifest.

Proof run from `build_tenants/typescript`:

- `npm install` passed.
- `npm run build:semantic` passed.
- `npm run lint:semantic` passed.
- `npm run test:t059` passed: 6 tests.
- `node --test test_env/tests/test_t099_tranched_indexed_pressure.test.mjs`
  passed: 2 tests.
- `npm run test:t110:abg35-sandbox` passed: 2 tests.
- `ODD_SDLC_TS_T110_LIVE=1 npm run test:t110:abg35-live` passed: 1 test.
- `git diff --check` passed.

Live RC2 evidence:

- T-110 live installed workspace:
  `build_tenants/typescript/test_env/test_runs/t110_live_claude_pty_installed_operator/20260505T163859355Z_pid6827/workspace`.
- Observed installed ABG version: `3.5.0-rc.2`.
- Installed ABG fallback config:
  `build_tenants/typescript/test_env/test_runs/t110_live_claude_pty_installed_operator/20260505T163859355Z_pid6827/workspace/.abiogenesis/config/abg.fallbacks.json`.
- Fallback config digest:
  `sha256:08372a2a641f0dacaa30f1e06be72f3d28e3bb96e704b81cfb55473f62ee0245`.
- Worker process started context:
  `build_tenants/typescript/test_env/test_runs/t110_live_claude_pty_installed_operator/20260505T163859355Z_pid6827/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260505T163900507Z_pid6827/worker_process_started_context.json`.
- Successful PTY terminal session id:
  `abg-mosus527-ksnv2wotqv`.

Downstream live blocker:

- First T-109 rerun reached ABG PTY worker execution and failed postflight at
  `derive_requirement_surface` because the compact prompt had omitted eight
  requirement trace obligations. The prompt projection fix above adds complete
  `requirementTraceObligationIds` and deterministic T-099 coverage.
- Second T-109 rerun reached ABG PTY worker execution with installed ABG
  `3.5.0-rc.2`, terminal session id `abg-mosv58br-s0e3i5hke1`, and exited
  status `0`, then failed the existing source-root hygiene guard because
  `/Users/jim/src/apps/odd_sdlc/.metals` was updated during the run.
- The `.metals` failure is governed by active ticket B-083. On 2026-05-06 the
  operator granted a scoped exception to ignore that `.metals` update for T-129
  closure only. The exception does not apply to `.scala-build`, `.bloop`,
  `.bsp`, `.genesis`, `.abiogenesis`, `build_tenants/scala_spark`, or
  source-root `cdme-*` leaks, and does not satisfy B-083 closure.

## Historical RC2 Closure Note - 2026-05-06

Closed under STDO with deterministic proof, installed live RC2 proof, and the
operator-granted `.metals` exception above.

Closure evidence:

- lock/design/code/test surfaces consume ABG `3.5.0-rc.2`;
- installed workspace proves `.abiogenesis/config/abg.fallbacks.json` exists;
- installed CLI/fallback config refresh and malformed-config behavior are
  covered by `test:t059`;
- successful PTY `terminalSessionId` is carried from ABG runtime event truth
  into odd_sdlc operator evidence;
- T-109 live continuation reached installed ABG `3.5.0-rc.2`, successful PTY
  terminal session id `abg-mosv58br-s0e3i5hke1`, and worker exit status `0`
  before the scoped `.metals` hygiene exception applied.

## STDO Triage

### First Missing Layer

Design.

ABG 3.7 preserves the 3.6 temporal/runtime/defaults contract and adds the F_P
construction evaluator/public-gaps read-only ranking surface. `odd_sdlc` does
not need a product reprice: it remains the ODD software-domain product over
ABG. The missing layer is the downstream realization/design contract that says
which new ABG substrate facts are consumed, which odd_sdlc views must remain
read models, and which semantics remain outside `odd_sdlc` authority.

### Lawful Re-Entry

`design_reframe`.

This is a substrate migration over the TypeScript build tenant. It should not
change `odd_sdlc` product semantics, steel-thread policy, feature-scope law,
SDLC domain closure rules, or scheduling policy semantics except where those
surfaces consume new ABG temporal/event/installer/evaluator truth.

## ABG 3.7 Surfaces To Consume

ABG `v3.7.0-rc.1` is the current target substrate. This ticket must update the
odd_sdlc design and proof surfaces against the current ABG release line before
claiming closure.

Minimum 3.7 migration posture:

- consume ABG as the sole source of runtime events, projection facts,
  continuations, and temporal/time-related substrate truth;
- keep wall-clock, timer, schedule, and deadline authority out of odd_sdlc-local
  imperative loops unless admitted through ABG substrate events/projections;
- consume ABG's F_P construction evaluator/public-gaps read-only surface as the
  single ranking authority for typed asset gaps and lawful candidate graph
  actions wherever odd_sdlc renders next-action or gap previews;
- do not move ABG 3.7 evaluator truth into CLI loops, operator retry glue,
  prompt prose, or odd_sdlc-local priority sorters;
- preserve the RC2 PTY `terminalSessionId`, fallback config, and plugin
  observer consumption checks as regression evidence under the 3.7 package
  identity;
- keep odd_sdlc-owned domain interpretation limited to SDLC policy, handoff,
  postflight, gap dossier, repair-prompt packaging, and operator read-model
  semantics.

## Evaluator-Driven Traversal Impact Assessment

ABG 3.7 changes the odd_sdlc migration shape from "consume a newer runtime
package" to "stop maintaining local substitutes for the evaluator's
observation-to-action decision surface."

The controlling model is:

```text
admitted runtime/workspace truth
  -> construction observation snapshot
  -> lawful action catalog rows
  -> observation-to-action binding
  -> configured priority / affect adjustment
  -> ranked construction priority projection
  -> read-only gaps / next-action preview
```

For ABG 3.7, public gaps is a read-only evaluator interface. It may expose the
highest-value typed asset gap, candidate graph function/vector, blockers,
ranking reasons, and repair pressure. It must not append events, admit intent,
dispatch graph work, synthesize retry context, or own a retry loop.

The evaluator is therefore the single surface that maps current ledger state,
error state, workspace state, typed asset gaps, and declared policy to a lawful
next graph-function candidate. odd_sdlc may add SDLC domain meaning to the
observation rows and to the rendered operator view, but it must not create a
parallel selector.

### Points Of Impact On odd_sdlc Evaluator Boundaries

1. Public `gaps` and query-domain projection

   The current odd_sdlc `gaps` surface must become a read-only view over the
   evaluator projection or explicitly declare a narrower out-of-scope preview.
   It cannot own gap ordering, next-action ranking, retry eligibility, or
   bootstrap induction by local status sorting.

   Impacted surfaces:

   - `build_tenants/typescript/code/src/spec_method/entry.ts`
   - `build_tenants/typescript/code/src/qualification/rc_qualification.ts`
   - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SPEC_METHOD_ENTRYPOINT.md`
   - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md`

2. Gap dossier and repair reentry

   T-120 and B-085 should bind retry-local repair pressure as evaluator input:
   an admitted gap dossier, component repair schedule row, scalac diagnostic,
   rejected carrier schema, and no-broad-regeneration rule become observation
   pressure over lawful repair actions. They should not be consumed by CLI
   loops, hand-authored retry prompts, or archive-inspection fallbacks.

   Impacted surfaces:

   - `build_tenants/typescript/code/src/operator/handoff.ts`
   - `build_tenants/typescript/code/src/operator/assurance_gate.ts`
   - `build_tenants/typescript/code/src/assurance/component_depth.ts`
   - `build_tenants/typescript/code/src/graph/catalog.ts`
   - active T-120 and B-085

3. Traversal strategy

   T-123's per-edge traversal strategy plan should become configured priority
   and admissibility input to the evaluator, not a second traversal selector.
   "steel_thread", "full_breadth", and "targeted_repair" remain product-owned
   policy labels; the evaluator projects their effect over lawful action rows.

   Impacted surfaces:

   - `build_tenants/typescript/code/src/operator/traversal_strategy.ts`
   - `build_tenants/typescript/code/src/shared/traversal_strategy_plan.ts`
   - `build_tenants/typescript/code/src/graph/module.ts`
   - active T-123

4. Assurance fold and F_D/F_P boundary

   Assurance outputs should become typed observation pressure. They should not
   collapse every non-reprice gap into `same_edge_retry` or let deterministic
   ambiguity checks force canonical output when the input did not disambiguate
   the identity. F_D may block exact envelope/protocol defects. For allowed
   ambiguity, F_D escalates to F_P/evaluator pressure; it does not force a
   failure that the source law did not require.

   Impacted surfaces:

   - `build_tenants/typescript/code/src/assurance/fold.ts`
   - `build_tenants/typescript/code/src/assurance/shared.ts`
   - `build_tenants/typescript/code/src/assurance/design_completeness.ts`
   - `build_tenants/typescript/code/src/assurance/materialization.ts`
   - active B-086

5. Component/design-depth registers

   Register admission remains exact where protocol law is exact, but ambiguous
   domain identity should produce evaluator pressure instead of local coercion
   or tenant-specific normalization in generic core. Missing target identity,
   contradictory module ownership, or malformed carrier shape must fail closed;
   underspecified semantic aliases should be admitted as ambiguity where the
   source did not disambiguate.

   Impacted surfaces:

   - `build_tenants/typescript/code/src/operator/component_depth_register.ts`
   - `build_tenants/typescript/code/src/operator/design_depth_register.ts`
   - active B-084 and B-086

6. Installed operator and Spec Method entrypoint

   The entrypoint and installed operator must be invocation/rendering surfaces.
   They may call ABG/odd_sdlc runtime boundaries and render projections. They
   must not own retry iteration, retry budget, selected graph function, or
   synthesized retry context.

   Impacted surfaces:

   - `build_tenants/typescript/code/src/spec_method/entry.ts`
   - `build_tenants/typescript/code/src/operator/installed_operator.ts`
   - deleted historical `build_tenants/typescript/code/src/cli/command.ts`

7. Worker invocation package

   Worker prompt/input packaging should be derived from the selected evaluator
   action and typed repair/reentry plan. It should not broaden regeneration
   because the operator wants "self-healing"; self-healing comes from bounded
   evaluator reentry over admitted truth.

   Impacted surfaces:

   - `build_tenants/typescript/code/src/operator/handoff.ts`
   - `build_tenants/typescript/test_env/tests/test_t118_worker_invocation_package.test.mjs`
   - active T-118 and T-120

8. RC qualification

   RC reports must not preserve older bounded-ready claims or manually rank
   open gaps. They should report the evaluator projection, current blockers,
   active repair/reentry routes, and live proof state.

   Impacted surfaces:

   - `build_tenants/typescript/code/src/qualification/rc_qualification.ts`
   - `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_RC_QUALIFICATION_REPORT.md`
   - active T-041

### Tech Debt Retirement Opened By This Migration

Yes: the evaluator-driven model allows odd_sdlc to retire accumulated tech debt
whose only purpose was to force iteration or approximate next-action selection.
Retirement must be staged by authority boundary.

Immediately targetable under T-129 / active odd_sdlc tickets:

- Retire CLI-owned or entrypoint-owned retry loops. The historical
  `cli/command.ts` loop shape is not a valid self-healing model.
- Retire local "best next action" sorters in public gaps/query/report code when
  ABG 3.7 evaluator projection is available.
- Retire same-edge fallback coercion that hides more specific typed routes such
  as `repair_worker_output`, `plan_repair_reentry_with_gap_dossier`, or
  `component_repair_row_open:*`.
- Retire duplicate traversal-strategy truth surfaces by treating strategy rows
  as priority/admissibility policy input to the evaluator.
- Retire prompt-prose repair routes where a typed gap dossier and repair row can
  bind a lawful repair action.
- Retire deterministic F_D checks that force canonical semantic identity when
  the source input only supports allowed ambiguity.
- Retire stale `abg36` active-lane names after the 3.7 migration is applied;
  keep 3.6 names only for historical checkpoint evidence.

Gated on ABG T-128, not closable by this ticket:

- Retiring the installed runner-level construction loop entirely. ABG 3.7 gives
  the evaluator/read-only ranking substrate; ABG T-128 owns consuming admitted
  construction intent and invoking graph work recursively through the installed
  runner.
- Claiming public gaps can start or continue graph work. It remains read-only
  until a runner consumes admitted intent.
- Removing odd_sdlc runtime reentry adapters that still bridge to current ABG
  start/iterate behavior. These can only be simplified once ABG exposes the
  T-128 runner path.

Not retireable because it is odd_sdlc product law:

- SDLC domain policy and acceptance interpretation.
- Handoff semantics and worker invocation package content.
- Postflight domain assurance and gap dossier schema.
- Ticket-routing semantics after an evaluated outcome demands durable work.
- Operator-facing read-model and RC reporting vocabulary.

## Historical ABG RC2 Surfaces Consumed

ABG `v3.5.0-rc.2` publishes these downstream-relevant changes:

- `ActorProcessStartedEvent.terminalSessionId` for successful PTY actor
  process starts;
- projection of successful PTY terminal session identity from admitted runtime
  events, not only failed-start events or trace-local files;
- plugin traversal observer binding resolution for Transform and Eval through
  GTL declarations or opt-in `abg_defaults`;
- unique `plugin_traversal_prompt_materialized` identity per materialization;
- shipped reference fallback bundle:
  `build_tenants/abiogenesis/typescript/config/abg.reference-fallbacks.json`;
- installed editable fallback config:
  `.abiogenesis/config/abg.fallbacks.json`;
- public installed CLI loading of the fallback config with fail-closed malformed
  config behavior.

## Required Migration Work

### F1: Dependency And Design Contract Rebase

Update TypeScript dependency truth and design prose from the historical RC2/3.6
checkpoints to ABG `3.7.0-rc.1`.

Required surfaces:

- `build_tenants/typescript/package-lock.json`
- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
- tests and package scripts that assert or advertise the installed ABG line

The package dependency may remain a sibling source `file:` dependency, but the
lockfile and installed package metadata must record the `3.7.0-rc.1` package
identity after `npm install`.

### F1a: Temporal Substrate Boundary

Temporal/time-related behavior belongs to ABG substrate truth, not odd_sdlc
control flow.

Required proof:

- design text names ABG as the owner of temporal runtime facts, timer events,
  continuations, and replay-derived projections;
- odd_sdlc does not add a local timer/schedule controller or wall-clock
  authority surface while consuming the ABG 3.7 substrate;
- GTL/ABG-facing temporal behavior is represented as admitted substrate truth
  and then projected into odd_sdlc only as a domain read model where needed.

### F2: Successful PTY Terminal Session Identity Consumption

`odd_sdlc` already records worker process context and summaries as domain read
models over ABG process facts. Under the current migration, successful PTY
terminal session identity must continue to be consumed from the ABG
`actor_process_started` event/projection boundary.

Required proof:

- successful PTY actor/worker process evidence contains non-empty
  `terminalSessionId`;
- `worker_process_started_context.json` or the equivalent operator evidence
  records that id from ABG event/projection truth;
- live and deterministic assertions do not rely only on ABG trace result JSON
  for successful terminal session identity;
- failure paths introduced by T-110/T-115 remain distinct from successful
  process-start projection.

### F3: Installed ABG Fallback Config Proof

The odd_sdlc installer consumes the public ABG TypeScript installer. Under the
current migration, installed target workspaces must expose and preserve the ABG
fallback config surface.

Required proof:

- install creates `.abiogenesis/config/abg.fallbacks.json`;
- refresh preserves local edits to that config;
- installed `package.json` keeps both `@odd-sdlc/typescript-tenant` and
  `@abiogenesis/typescript-tenant`;
- installed command bindings include `odd-sdlc-ts`, `abiogenesis-ts`, and
  `genesis-ts`;
- a malformed edited ABG fallback config fails closed through the public
  installed ABG CLI path rather than silently falling back.

### F4: Plugin Traversal Observer Boundary

The historical RC2 plugin traversal observer materialization surface remains a
regression boundary under 3.7. `odd_sdlc` must keep its downstream posture
explicit.

Minimum current migration behavior:

- ordinary odd_sdlc TypeScript runs do not implicitly activate ABG observer
  fallback prompts;
- when ABG emits `plugin_traversal_prompt_materialized`, odd_sdlc treats it as
  ABG runtime truth and may project it only as a read model;
- custom SDLC prompt/handoff policy remains odd_sdlc domain law, not hidden ABG
  prompt prose;
- any later use of ABG observer fallback for SDLC Transform/Eval work must be
  ticketed with explicit GTL hook/config authority.

### F5: Preserve Follow-Up Boundaries

Do not claim more than the current ABG release provides.

- ABG T-117 is plugin observer fallback defaults only.
- ABG T-118 owns broader defaults externalization.
- ABG T-127 owns the substrate-level F_P construction evaluator and read-only
  public gaps projection.
- ABG T-128 owns installed runner-level consumption of admitted construction
  intent and graph work invocation; odd_sdlc must not claim it as part of this
  3.7 migration.
- Historical RC2 and ABG 3.6 proof does not close the 3.7
  temporal/runtime/evaluator migration.

## Expected Verification

Run from `build_tenants/typescript`:

```bash
npm install
npm run build:semantic
npm run lint:semantic
npm run test:t059
npm run test:t129
npm run test:t110:abg37-sandbox
npm run test:t102-t110:abg37-sandbox
npm run test:sandbox
```

Run live only after deterministic proof is green and after reinstalling a fresh
target workspace from current source:

```bash
ODD_SDLC_TS_T110_LIVE=1 npm run test:t110:abg37-live
npm run test:t109:data-mapper-live
```

The final closure checkpoint must include:

- exact installed workspace path;
- ABG package version `3.7.0-rc.1` observed from installed `node_modules`;
- ABG fallback config path and digest;
- worker process started context path;
- successful PTY `terminalSessionId`;
- temporal/runtime substrate boundary evidence;
- F_P construction evaluator/public-gaps read-only boundary evidence, or an
  explicit out-of-scope statement for views that do not consume that surface;
- live operator-run archive path;
- `git diff --check` result.

## Non-Closure Statement

This ticket is not closed by a package bump alone. It closes only when
`odd_sdlc` has proved that its installed operator and installer consume ABG
`3.7.0-rc.1` runtime/defaults/temporal/evaluator truth while preserving the
product boundary: ABG owns runtime facts, temporal substrate truth, substrate
config, and the construction evaluator/public-gaps ranking carrier; `odd_sdlc`
owns SDLC domain interpretation and operator-facing read models.

## Current 3.7 Checklist

- [ ] Run `npm install` from `build_tenants/typescript` so the lockfile records
      installed ABG package identity `3.7.0-rc.1`.
- [ ] Update `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts`
      from ABG `3.6.0-rc.1` to `3.7.0-rc.1`.
- [ ] Update
      `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
      to name ABG 3.7 and the F_P construction evaluator/public-gaps read-only
      boundary.
- [ ] Rename or supersede `abg36` fixture/test/script names that are now the
      active migration lane, or explicitly mark them historical.
- [ ] Keep the ABG 3.6 temporal/runtime tests as regression coverage under the
      ABG 3.7 package identity.
- [ ] Add focused downstream coverage that odd_sdlc does not rebuild ABG 3.7
      construction-evaluator ranking in CLI/operator glue.
- [ ] Audit and either retire or explicitly justify each local iteration-forcing
      seam listed in "Tech Debt Retirement Opened By This Migration".
- [ ] Update active T-120, T-123, B-085, B-086, and T-041 closure expectations
      where their current implementation depends on local retry/ranking/fold
      behavior superseded by the evaluator-driven model.
- [ ] Add or update live T-110 assertions to require installed ABG
      `3.7.0-rc.1`, installed fallback config path/digest, and successful PTY
      terminalSessionId from ABG runtime truth.
- [ ] Run deterministic proof: `npm run build:semantic`,
      `npm run lint:semantic`, `npm run test:t028`, `npm run test:t059`,
      `npm run test:t129`, `npm run test:t110:abg37-sandbox`,
      `npm run test:t102-t110:abg37-sandbox`, `npm run test:semantic`, and
      `npm run test:sandbox`.
- [ ] Run live proof: `ODD_SDLC_TS_T110_LIVE=1 npm run test:t110:abg37-live`
      and `npm run test:t109:data-mapper-live`.
- [ ] Record final installed workspace path, ABG version, fallback config path
      and digest, worker process context path, terminalSessionId, operator-run
      archive, and `git diff --check`.
- [ ] Operator review before closure.

## Historical 3.6 Completeness Review - 2026-05-07

Status at that checkpoint: implemented for deterministic and T-110 live review;
not closed.

Observations:

- Focused proof refreshed on 2026-05-07: `npm run test:t059` passed, including
  the T-129 editable ABG fallback config regression.
- The ticket target has been repriced from the historical ABG `3.5.0-rc.2`
  checkpoint to ABG `3.6.0-rc.1`.
- Workspace evidence at that checkpoint: the sibling ABG TypeScript source reported
  `3.6.0-rc.1`, and the TypeScript package lock records the root package
  version `3.6.0-rc.1`.
- The design contract and exported TypeScript substrate contract now name the
  then-current temporal/runtime release line.
- This checkpoint does not rely on the historical `.metals` exception. B-083 is
  closed as project-scope complete with remaining `.metals` writes attributed to
  the external VS Code Metals operator environment.
- The implementation consumes successful PTY `terminalSessionId` from
  `actor_process_started` before trace fallback, and the T-110 live proof has
  been rerun against installed ABG `3.6.0-rc.1`.

## Implementation Checkpoint - 2026-05-07

Applied surfaces:

- `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts` now
  exports ABG `3.6.0-rc.1` as the consumed substrate contract and names ABG as
  temporal and Event Calculus replay truth authority.
- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
  now documents ABG `3.6.0-rc.1` as owner of admitted runtime events,
  replay-derived `HoldsAt`, `abg.temporal_constraint`, timer intent/outcome,
  deadline breach, scheduled continuation, temporal projection rows, and
  homeostatic temporal pressure.
- `build_tenants/typescript/test_env/tests/test_t129_abg36_temporal_substrate.test.mjs`
  adds focused substrate-boundary coverage over ABG 3.6 temporal/runtime
  features through a synthetic ABG graph, not an odd_sdlc temporal traversal
  claim:
  temporal GTL syntax, timer outcome admission, provider receipt non-authority,
  scheduled continuation replay, deadline F_H pressure, and fail-closed
  temporal event identity.
- `build_tenants/typescript/test_env/live/test_t110_live_claude_pty_installed_operator.test.mjs`
  now asserts installed ABG package version `3.6.0-rc.1` and installed
  `.abiogenesis/config/abg.fallbacks.json` digest/path in the live lane.
- T-110/T-109 test names, fixture names, graph ids, and package scripts now use
  ABG 3.6 wording instead of ABG 3.5/RC7 wording.

Verification run from `build_tenants/typescript`:

- `npm install` passed: up to date, 0 vulnerabilities.
- `npm run lint:semantic` passed.
- `npm run test:t028` passed: 3/3.
- `npm run test:t059` passed: 7/7.
- `npm run test:t129` passed: 5/5.
- `npm run test:t110:abg36-sandbox` passed: 2/2.
- `npm run test:t102-t110:abg36-sandbox` passed: 5/5.
- `npm run test:semantic` passed: 263/263.
- `npm run test:sandbox` passed: 15/15.
- `ODD_SDLC_TS_T110_LIVE=1 npm run test:t110:abg36-live` passed: 1/1.
- `git diff --check` passed.

Additional review follow-up:

- Encoded the previously manual T-110 live installed ABG version and fallback
  config digest evidence as assertions in the live test.
- Renamed the T-102/T-109 ABG 3.6 sandbox/live test files and shared fixture
  away from the historical `abg_rc7` names.
- Kept the T-129 temporal test described as substrate-boundary proof. It proves
  ABG temporal behavior is consumable and exposed through the odd_sdlc substrate
  contract; it does not claim odd_sdlc temporal traversal semantics.
- Review follow-up verification passed:
  `npm run test:t129`, `npm run test:t110:abg36-sandbox`,
  `npm run test:t102-t110:abg36-sandbox`,
  `node --test test_env/tests/test_t109_traversal_ledger_solution.test.mjs`,
  `npm run lint:semantic`, `npm run test:semantic`, `npm run test:sandbox`,
  `ODD_SDLC_TS_T110_LIVE=1 npm run test:t110:abg36-live`, and
  `git diff --check`.

T-110 live evidence:

- installed workspace:
  `/var/folders/rz/r6wxvr0n15d906k2s0jw8j2h0000gn/T/odd-sdlc-ts-live-test-runs/t110_live_claude_pty_installed_operator/20260507T084222474Z_pid21055/workspace`
- observed installed ABG version: `3.6.0-rc.1`
- installed ABG fallback config:
  `/var/folders/rz/r6wxvr0n15d906k2s0jw8j2h0000gn/T/odd-sdlc-ts-live-test-runs/t110_live_claude_pty_installed_operator/20260507T084222474Z_pid21055/workspace/.abiogenesis/config/abg.fallbacks.json`
- fallback config digest:
  `sha256:08372a2a641f0dacaa30f1e06be72f3d28e3bb96e704b81cfb55473f62ee0245`
- installed ABG substrate snapshot:
  `/var/folders/rz/r6wxvr0n15d906k2s0jw8j2h0000gn/T/odd-sdlc-ts-live-test-runs/t110_live_claude_pty_installed_operator/20260507T084222474Z_pid21055/installed_abg_substrate_snapshot.json`
- operator-run archive:
  `/var/folders/rz/r6wxvr0n15d906k2s0jw8j2h0000gn/T/odd-sdlc-ts-live-test-runs/t110_live_claude_pty_installed_operator/20260507T084222474Z_pid21055/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260507T084223867Z_pid21055`
- worker process started context:
  `/var/folders/rz/r6wxvr0n15d906k2s0jw8j2h0000gn/T/odd-sdlc-ts-live-test-runs/t110_live_claude_pty_installed_operator/20260507T084222474Z_pid21055/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260507T084223867Z_pid21055/worker_process_started_context.json`
- successful PTY terminal session id:
  `abg-mov8mx33-vfpc6se0fo`
- `worker_process_started_context.json` and `worker_run.json` both carry
  `abg-mov8mx33-vfpc6se0fo`; runtime events include
  `actor_process_started.terminalSessionId` with the same id.

Historical 3.6 remaining work before the 3.7 reprice:

- Run and review the heavier `npm run test:t109:data-mapper-live` RC lane under
  the then-current ABG `3.6.0-rc.1` substrate before moving this ticket out of
  active.
- Operator review of the deterministic and T-110 live results above.

Historical 3.6 checklist before the 3.7 reprice:

- [x] Reprice the ticket target from ABG `3.5.0-rc.2` to the then-current ABG
      release line, or explicitly supersede this ticket with a 3.6 migration
      ticket.
- [x] Update the substrate design contract and proof text to the current ABG
      version.
- [x] Add/confirm temporal substrate boundary proof for the ABG 3.6 migration.
- [x] Re-run installer, sandbox, and live PTY proof against the then-current ABG
      version.
- [x] Resolve or explicitly re-authorize the `.metals` exception for the current
      RC cut: no T-129 `.metals` exception is used by this checkpoint; B-083 is
      closed as project-scope complete with remaining `.metals` writes
      attributed to the external VS Code Metals operator environment.
- [ ] Run and review `npm run test:t109:data-mapper-live` before closure.
- [ ] Operator review of the checkpoint results before closure.
