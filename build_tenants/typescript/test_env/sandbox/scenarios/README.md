# Scenario Sandbox Descriptors

Each `*.scenario.mjs` file in this directory is a data descriptor for a
rebuildable app-building sandbox driven by
`../scenario_sandbox.mjs`.

A scenario descriptor declares:

- `scenarioId` — unique id, used in the archive root and installed package name
- `fixture.root` — absolute path to the source-of-truth project the harness
  will copy into a fresh workspace before installing odd_sdlc
- `fixture.sourceFiles` — files the harness asserts before copying
- `expectations` — optional assertions over the first advance:
  - `firstEdge` — expected `targetGraphFunction` returned by the first `gaps`
  - `firstStartStatus` — expected `status` returned by the first `start`
  - `firstEventKinds` — runtime event kinds that must appear in the first start
  - `requirementIds` — ids that must be lifted into requirement families
  - `archiveArtifacts` — files that must exist under the first start's archive
- `maxAdvances` — how many `gaps -> start` cycles to run (default 1)
- `liveWorker` — opt-in worker URI (e.g. `process://claude`); omit for
  deterministic single-advance lanes
- `startTarget`, `startUntil` — passed through to `start --target / --until`

Run any scenario through `runScenarioSandbox(scenario)` exported by
`../scenario_sandbox.mjs`. The result includes the run root, the workspace
path, the install outcome, and the captured advances; pass it to
`assertScenarioExpectations(result, scenario)` to enforce the descriptor's
assertions.

Adding a new app-building sandbox is two files: a fixture directory and one
descriptor. No harness change is required.
