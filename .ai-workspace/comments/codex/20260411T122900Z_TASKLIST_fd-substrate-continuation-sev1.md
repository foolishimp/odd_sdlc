# Sev 1 Task List — F_D Substrate Continuation Drift

## Incident

The GTL/ABG substrate currently treats selected-edge `F_D` failure as an unconditional
blocking reason during `start --auto`, even when the declared policy bundle says
`F_D -> F_P` continuation is lawful and defaults `fd_fail_with_transition_action` to
`"continue"`.

This is substrate drift, not an `odd_sdlc`-local rule.

## Intake Triage

- Intake label: bug / regression / release blocker
- Lawful change class: `realization_refactor`
- Lawful re-entry point: substrate runtime implementation
- Primary source of truth: `abiogenesis`
- Required mirror: `odd_method/.genesis`

The existing method/spec already says:

- generic constructive stance favors `F_P`
- `F_D -> F_P` continuation is part of escalation law
- hard-stop `F_D` is only lawful for explicit structural or domain-declared fail-closed classes

So this wave is not a product or requirement reprice. It is a substrate implementation
repair to bring runtime behavior back into alignment with declared law.

## Root Cause

Current behavior is internally inconsistent:

- policy declares `F_D -> F_P` and `fd_fail_with_transition_action = "continue"`
- runtime blocking logic maps any selected-edge failing `F_D` to `fd_gap`
- `start --auto` stops immediately on `fd_gap`

Net effect:

- untuned generic domains can be sole-arbitrated by `F_D`
- early planning-edge `F_D` can own the frontier and prevent downstream constructive realization
- domain authors compensate in app-level graphs for a substrate bug

## Action Order

### 1. Fix canonical substrate stop semantics in `abiogenesis`

Target files:

- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/interpret.py`
- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/cli_adapter.py`
- likely `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/policy_defaults.py` only if additional policy surface is needed

Required action:

- make selected-edge `F_D` handling consult the resolved escalation policy instead of hard-coding `fd_gap`
- preserve hard-stop behavior for:
  - unresolved/conflicting carried environment
  - undeclared structural invocation/materialization classes
  - explicit domain-declared hard-stop prerequisite classes

Success criteria:

- default generic policy allows `F_D -> F_P` continuation where policy says `continue`
- `fd_gap` is reserved for actual fail-closed cases, not every selected-edge `F_D`

### 2. Mirror the same kernel fix into `odd_method/.genesis`

Target files:

- `/Users/jim/src/apps/odd_method/.genesis/genesis/interpret.py`
- `/Users/jim/src/apps/odd_method/.genesis/genesis/cli_adapter.py`

Required action:

- keep source-workspace behavior aligned with the canonical engine until the next engine refresh

Success criteria:

- local source workspace and installed-workspace runtime semantics match

### 3. Add substrate regression coverage

Primary target:

- `abiogenesis` runtime tests around planner / blocking / auto traversal

Minimum proof cases:

- case A: selected-edge `F_D` failure with default `F_D -> F_P` continuation policy does not stop auto traversal
- case B: explicit no-transition or fail-closed policy still stops
- case C: unresolved environment still fail-closes before constructive dispatch
- case D: explicit domain hard-stop prerequisite still stops

Success criteria:

- the runtime proves policy-governed distinction between advisory/carryable `F_D` and fail-closed `F_D`

### 4. Re-run `odd_sdlc` on a fresh evidence workspace

Target workspace:

- fresh `data_mapper.test27` or equivalent from `data_mapper.template`

Required action:

- install the repaired RC
- run full bounded traversal again
- compare against `test24`, `test25`, `test26`

Success criteria:

- the run does not stop solely because an early planning-edge `F_D` owns the frontier
- constructive downstream edges can run where policy allows continuation

### 5. Only after substrate repair, retune `odd_sdlc` domain F_D attachments if still needed

Potential target:

- `/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py`

Required action:

- review whether `planned_test_traceability_present` is attached at the right graph boundary
- tune domain overrides only after the substrate obeys declared continuation law

Success criteria:

- no domain-level compensating hacks for substrate stop semantics

## Non-Actions

Do not start here:

- do not patch `data_mapper.test26`
- do not weaken `odd_sdlc` evaluators first
- do not tune release handling first
- do not compensate in app graphs for substrate stop behavior

Those would misplace the re-entry point and hide the substrate defect.

## Immediate Execution Plan

1. Patch `abiogenesis` selected-edge blocking semantics to honor resolved escalation policy.
2. Mirror the patch into `odd_method/.genesis`.
3. Add regression tests proving `F_D -> F_P` continuation and fail-closed exceptions.
4. Cut a new RC candidate.
5. Install into a fresh `data_mapper.test27`.
6. Run the traversal and compare the stop signature against `test26`.

## Execution Status

Done in this wave:

- step 1 complete in canonical `abiogenesis`
- step 2 complete in vendored `odd_method/.genesis`
- step 3 complete with targeted substrate regression coverage

Still open:

- step 4 cut the next RC candidate
- step 5 install into fresh `data_mapper.test27`
- step 6 run and compare against `test26`

## Done Means

This incident is not closed when `test26` can be coaxed further manually.

It is closed when:

- the substrate honors its own declared policy model
- generic untuned domains are not sole-arbitrated by `F_D`
- explicit fail-closed behavior happens only for lawful structural or domain-declared hard-stop cases
- a fresh evidence run proves the corrected semantics in practice
