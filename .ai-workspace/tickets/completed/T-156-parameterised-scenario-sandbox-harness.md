---
id: T-156
title: Parameterised scenario sandbox harness for app-building rebuilds
type: feature
ticket_category: realization_carrier
status: completed
review_status: back_filled_after_landing
goal: typescript-rc-guided-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Extract the six-step recipe proven by the internal data_mapper induction lane into a generic scenario harness so any candidate app (data_mapper, T-131 odd_chat, future MindForge overlay) can be rebuilt over and over in a fresh sandbox from a fixture directory plus a descriptor, with no harness change required per app.
change_class: realization_refactor
re_entry_point: realization
affected_boundary:
  - build_tenants/typescript/test_env/sandbox/scenario_sandbox.mjs
  - build_tenants/typescript/test_env/sandbox/scenarios/
  - build_tenants/typescript/test_env/sandbox/test_scenario_sandbox.test.mjs
  - build_tenants/typescript/package.json
priority: medium
triaged_at: 2026-05-11
created_at: 2026-05-11
updated_at: 2026-05-11
completed_at: 2026-05-11
governance_scope: STDO Method
dependencies:
  - T-087/T-091/T-096 internal data_mapper induction sandbox (proven six-step recipe)
  - T-131 active guided odd_chat live-build lane (candidate-app validator)
related_tickets:
  - T-131 remains active; its existing live-build test continues to validate the bootstrap.md contract independently of this harness
  - T-041 data_mapper end-goal / stress lane is unchanged
  - T-109 / T-115 live PTY data_mapper lanes are unchanged
intake_source: Operator asked for the data_mapper sandbox pattern to be templated or parameterised so different app-building sandboxes can stand up the same way data_mapper does. Operator nominated T-131 (guided odd_chat live-build lane) as the first candidate app to rebuild over and over against the new harness.
target_truth: The TypeScript test_env carries a generic scenario sandbox harness that accepts a data descriptor and runs the six-step recipe (mint run root, provision ABG installed sandbox, copy fixture into workspace, install odd_sdlc, gaps, start) against any candidate app. Adding a new app sandbox is two files (fixture directory and descriptor) plus one test entry. The harness is exercised through two deterministic scenarios (data_mapper internal induction, T-131 odd_chat bootstrap induction) and one opt-in live multi-advance variant.
superseded_truth: The data_mapper sandbox shape is copy-paste-only and each new app sandbox must duplicate the install/copy/gaps/start scaffolding.
closure_law: This ticket closes when the generic harness, the two deterministic scenario descriptors, the driver test, and the npm scripts exist; both deterministic scenarios pass through the harness against the current build_tenants/typescript runtime; the live opt-in scenario skips lawfully when its env var is not set; and the existing data_mapper internal sandbox test and T-131 live-build test remain untouched.
evaluation_criteria:
  - build_tenants/typescript/test_env/sandbox/scenario_sandbox.mjs exports runScenarioSandbox(scenario) and assertScenarioExpectations(result, scenario).
  - build_tenants/typescript/test_env/sandbox/scenarios/data_mapper_internal.scenario.mjs and build_tenants/typescript/test_env/sandbox/scenarios/t131_odd_chat.scenario.mjs declare descriptor data only; no harness logic lives in descriptors.
  - build_tenants/typescript/test_env/sandbox/test_scenario_sandbox.test.mjs runs both deterministic scenarios and one opt-in live scenario gated on ODD_SDLC_TS_T131_ODD_CHAT_SCENARIO_LIVE=1.
  - npm run test:scenario-sandbox runs the deterministic scenarios green against the current installed runtime.
  - npm run test:scenario:t131-odd-chat-live runs the opt-in T-131 live build loop when invoked.
  - The harness archive each run under a fresh test_env/test_runs/<scenarioId>/<timestamp>_pid<pid>/ root with workspace, installed sandbox evidence, and command output.
  - Adding a new candidate app requires only a fixture directory plus a *.scenario.mjs descriptor plus a one-line test entry; no edit to scenario_sandbox.mjs.
  - Existing test_t087_t091_t096_internal_data_mapper_induction_sandbox.test.mjs and test_t131_guided_odd_chat_live_build.test.mjs are not modified.
proof_surface:
  - build_tenants/typescript/test_env/sandbox/scenario_sandbox.mjs
  - build_tenants/typescript/test_env/sandbox/scenarios/README.md
  - build_tenants/typescript/test_env/sandbox/scenarios/data_mapper_internal.scenario.mjs
  - build_tenants/typescript/test_env/sandbox/scenarios/t131_odd_chat.scenario.mjs
  - build_tenants/typescript/test_env/sandbox/test_scenario_sandbox.test.mjs
  - npm run test:scenario-sandbox
  - npm run test:scenario:t131-odd-chat-live
non_closure_conditions:
  - The harness duplicates or shadows ABG install, odd_sdlc install, or invokeOddSdlcSpecMethodCommand logic instead of delegating to the existing exported entrypoints.
  - A scenario descriptor carries harness logic (control flow, file writes, install calls) instead of being pure data.
  - The harness modifies the source fixture during a run.
  - The harness skips fixture-file assertion before copy, allowing partial fixtures to flow into a sandbox silently.
  - The harness writes outside test_env/test_runs/<scenarioId>/<timestamp>_pid<pid>/.
  - test:scenario-sandbox depends on a live worker by default.
  - The data_mapper internal lane and the T-131 guided live-build lane are coupled to this harness as their only proof surface.
---

# T-156: Parameterised Scenario Sandbox Harness

## STDO Triage

First missing layer: realization.

Specification, intent, product, and requirements already declare that
`odd_sdlc` rebuilds candidate apps in fresh sandboxes through the installed
runtime. The data_mapper internal induction lane proved the recipe end-to-end.
The missing realization carrier is a generic harness so that recipe is
reusable as data rather than as a copied scaffold per candidate app.

## What Lands

### Generic Harness

`build_tenants/typescript/test_env/sandbox/scenario_sandbox.mjs` exports:

- `runScenarioSandbox(scenario, options?)` — mints a run root, provisions an
  ABG installed sandbox, asserts sandbox evidence, copies the scenario
  fixture into the workspace, installs odd_sdlc TS into the workspace, then
  loops `gaps -> start` until a lawful stop, `maxAdvances`, or an error.
  Returns `{scenarioId, runRoot, workspace, installedWorkspace, install,
  advances, lastStatus}`.
- `assertScenarioExpectations(result, scenario)` — enforces descriptor
  assertions over the first advance: `firstEdge`, `firstStartStatus`,
  `firstEventKinds`, `requirementIds`, `archiveArtifacts`.
- `mintRunId()`, `assertFixtureFiles()`, `copyFixture()` — exposed helpers.

The harness delegates to existing entrypoints:
`provisionAbgInstalledSandbox`, `assertAbgInstalledSandboxEvidence`,
`installOddSdlcTypescript`, `invokeOddSdlcSpecMethodCommand`. It does not
reimplement install or command-invocation logic.

### Scenario Descriptors

Pure data. One descriptor per candidate app.

- `scenarios/data_mapper_internal.scenario.mjs` — reproduces the internal
  data_mapper induction lane against the bundled
  `test_env/fixtures/data_mapper_induction/` corpus. Expects
  `FG_CONFORM_PROJECT` as the first edge and `REQ-LDM-001` / `REQ-COV-008`
  among lifted requirement ids.
- `scenarios/t131_odd_chat.scenario.mjs` — exports `t131OddChatScenario`
  (deterministic single-advance over the existing
  `test_env/fixtures/t131_guided_odd_chat/bootstrap.md`) and a
  `t131OddChatLiveScenario({worker, maxAdvances, startUntil})` factory for
  opt-in multi-advance live builds.
- `scenarios/README.md` documents the descriptor schema and the
  two-files-no-harness-change contract for new candidate apps.

### Driver Test

`test_env/sandbox/test_scenario_sandbox.test.mjs` runs both deterministic
scenarios and one opt-in live scenario gated on
`ODD_SDLC_TS_T131_ODD_CHAT_SCENARIO_LIVE=1`.

### Package Scripts

- `npm run test:scenario-sandbox` — deterministic scenarios.
- `npm run test:scenario:t131-odd-chat-live` — opt-in T-131 live build loop.

## Proof

`npm run test:scenario-sandbox` is green on 2026-05-11:

- `scenario sandbox: data_mapper internal induction` — pass (~3.2 s).
- `scenario sandbox: T-131 odd_chat bootstrap induction` — pass (~3.1 s).
- `scenario sandbox: T-131 odd_chat live build loop (opt-in)` — lawfully
  skipped when the env var is unset.

The empirical first edge for the T-131 bootstrap-only fixture is
`FG_CONFORM_PROJECT` (the same conformance gate the data_mapper internal
lane converges on); the descriptor records that observation.

## How To Add A New Candidate App

1. Drop a fixture directory under `test_env/fixtures/<app>/` carrying the
   source-of-truth project that the harness will install odd_sdlc on top of.
2. Author `test_env/sandbox/scenarios/<app>.scenario.mjs` exporting an object
   with `scenarioId`, `fixture.{root,sourceFiles}`, and optional
   `expectations`, `maxAdvances`, `liveWorker`, `startTarget`, `startUntil`.
3. Add one `test(...)` entry in `test_scenario_sandbox.test.mjs` calling
   `runScenarioSandbox(scenario)` followed by
   `assertScenarioExpectations(result, scenario)`.

No edit to `scenario_sandbox.mjs` is required.

## Boundary

This ticket adds a realization carrier in the TypeScript tenant only. It
does not change abiogenesis substrate, the constitutional surface, the
data_mapper or T-131 existing test files, the install command surface, or
the public CLI. The existing
`test_t087_t091_t096_internal_data_mapper_induction_sandbox.test.mjs` and
`test_t131_guided_odd_chat_live_build.test.mjs` continue to act as their own
regression anchors.

This ticket does not close T-131. T-131 owns the guided odd_chat live-build
lane and its bootstrap-document contract; T-156 only adds a parallel
parameterised path that can also rebuild that candidate app.

## Correction 2026-05-11 — Fail-Closed Command Contract

Review surfaced a deterministic false-positive risk: `runScenarioSandbox`
broke the loop on `start.status !== "ok"` but still returned a result, so a
scenario asserting only `firstEdge` could stay green while a CLI-level
command failure passed unnoticed.

Corrections:

- `scenario_sandbox.mjs` throws when `gaps.status !== "ok"` or
  `start.status !== "ok"` unless the descriptor declares
  `expectCommandFailure: true`. This is the command-envelope status; the
  traversal-payload status (`converged`, `fp_worker_unattached`, `blocked`,
  `yielded`) still controls lawful loop stops through `stopOnLawful`.
- `assertScenarioExpectations` accepts `expectations.terminalStatus` so live
  multi-advance scenarios can pin the final `lastStatus`.
- `t131OddChatScenario` pins `firstStartStatus: "converged"`.
- `t131OddChatLiveScenario` pins `firstStartStatus` and `terminalStatus` to
  `"converged"` so an opt-in live run cannot exhaust `maxAdvances` without
  the requested `startUntil` actually being reached.

`npm run test:scenario-sandbox` remains green after the corrections.
