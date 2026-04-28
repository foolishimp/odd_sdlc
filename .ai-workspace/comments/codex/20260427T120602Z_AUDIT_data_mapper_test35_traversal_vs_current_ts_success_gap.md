# Audit: data_mapper.test35 Traversal Versus Current TypeScript Success Gap

**Status**: commentary audit  
**Date**: 2026-04-27  
**Scope**: `data_mapper.test35` full event log and artifact audit, compared
against the current `odd_sdlc.TS` proof state.  
**Governing frame**: STDO Method, with `data_mapper` treated as an independent
qualification workload, not as `odd_sdlc` product scope.

## Executive Finding

`data_mapper.test35` did not succeed because Python generated Scala once.

It succeeded because the Python line had a stateful, event-sourced,
proof-driven traversal loop that kept re-entering the same governed workspace,
deepened the realized product, repaired gaps, and eventually produced a
non-trivial compiled/tested downstream system.

The current TypeScript line has several important pieces of that capability:
installer, public `start`/`gaps`, ABG event projection, conformed project
profile, product-file materialization guards, live external `F_P` proof, and a
minimal materialized `data_mapper` smoke run.

It does not yet have the integrated success behavior demonstrated by
`test35`: one installed TypeScript run over the independent `data_mapper`
workload that recursively deepens the downstream product until a domain-shaped
implementation and governed test evidence converge.

That is the gap to success.

## Evidence Surfaces

Test35 source of truth:

- workspace:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`
- full event log:
  `.ai-workspace/events/events.jsonl`
- stateful builder control frame:
  `.ai-workspace/runtime/odd_sdlc-stateful-builder-control-frame.md`
- realization deepening control frame:
  `.ai-workspace/runtime/odd_sdlc-realization-deepening-control-frame.md`
- realized test source obligation:
  `.ai-workspace/runtime/odd_sdlc-realized-test-source-obligation.md`
- test execution surface:
  `docs/48-generated-test-execution-result.md`

Current TypeScript comparison surfaces:

- `odd_sdlc/.ai-workspace/tickets/backlog/T-041-realize-typescript-full-operational-python-replacement-rc-lane.md`
- `odd_sdlc/.ai-workspace/tickets/backlog/T-066-realize-typescript-downstream-product-code-materialization-over-odd-graph-functions.md`
- `odd_sdlc/.ai-workspace/tickets/completed/T-053-build-typescript-live-fp-data-mapper-qualification-lane.md`
- `odd_sdlc/.ai-workspace/tickets/completed/T-068-realize-typescript-conform-project-profile-before-product-materialization.md`
- `odd_sdlc/build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_LIVE_PYTHON_ARCHIVE_COMPARISON.md`
- installed TS smoke workspace:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test48.ts`

## test35 Traversal Audit

### Runtime Scale

The full event log records:

- `4662` total events
- first event: `2026-04-18T17:12:48Z`
- last event: `2026-04-19T18:16:33Z`
- `86` run starts
- `86` graph-call openings
- `57` `fp_dispatched` events
- `38` `found` events
- `79` proof passes
- `9` proof failures
- `10` continuation openings
- `13` run failures
- `3152` assessment events
- `82` F_P manifest files
- `81` F_P result files
- `80` F_P ledger files

This is not a one-shot generation trace. It is a long-running traversal and
repair record over the same workspace.

### Productive Traversal Shape

The productive path moves through these phases:

1. Install/runtime seed.
2. Repeated specification/bootstrap derivation:
   `intent -> product -> goals -> requirements -> features -> UAT -> design -> scenario`.
3. Implementation branch:
   `implementation design -> implementation stack profile -> implementation modules -> code`.
4. Test branch:
   `test design -> test stack profile -> test modules -> test run archive`.
5. Failure-driven repair:
   repeated `derive_test_run_archive_surface` proof failures and continuations.
6. Testcase authority qualification:
   `qualify_testcase_authority` fails once, opens a repair continuation, then later passes.
7. Release and execution:
   `prepare_release_surface -> prepare_test_execution_surface -> derive_test_execution_result_surface`.
8. Later re-entry:
   additional found/replay passes deepen code/test/design evidence and expose another incomplete implementation-design proof at the end of the log.

The final event log ends with a later `derive_implementation_design_surface`
`proof_incomplete` continuation. That does not erase the earlier productive
chain. It shows the same thing the method cares about: unresolved pressure stays
visible instead of disappearing.

### Edge-Level Signal

High-signal edges from the event audit:

- `derive_code_surface`
  - `16` run starts
  - `3` F_P dispatches
  - `14` found/replay observations
  - `1066` assessments
- `derive_test_run_archive_surface`
  - `9` run starts
  - `7` F_P dispatches
  - `7` proof failures
  - `716` assessments
- `qualify_testcase_authority`
  - `3` run starts
  - `2` F_P dispatches
  - `1` proof failure
  - `225` assessments
- implementation/test design and module edges each carry requirement-scale
  assessment counts around `219` to `300`.

This proves the important behavior: the heavy edges are not treated as scalar
file writes. They are assessed across the requirement/module/test inventory and
re-entered when proof is incomplete.

### Stateful Builder Law Present In test35

The runtime control frames make the intended behavior explicit:

- the current workspace is truth, not just serialized input
- existing files and module groups are obligations
- placeholder bodies, identity pass-throughs, constant-success paths, unused
  inputs, and unwired validation remain unresolved realization
- repair/deepening of existing artifacts is preferred before lateral expansion
- archive prose is not enough for test realization; real test source files must
  exist under governed code surfaces
- builder self-check guides more repair, but governed assessment closes the edge

That is the root capability. It is recursive stateful realization under proof
pressure.

## test35 Realized Product Inventory

The resulting downstream tenant is not shallow.

Confirmed filesystem inventory under `build_tenants/scala_spark`:

- main Scala files: `105`
- Scala test files: `35`
- CDME module roots: `7`
- JUnit XML report files currently present: `33`

Module spread:

- `cdme-accounting`: `6` main, `3` test
- `cdme-adjoint`: `18` main, `5` test
- `cdme-assurance`: `5` main, `1` test
- `cdme-compiler`: `24` main, `9` test
- `cdme-engine`: `2` main, `1` test
- `cdme-executor`: `24` main, `10` test
- `cdme-fidelity`: `26` main, `6` test

The admitted test execution surface states:

- command: `sbt test`
- working directory: `build_tenants/scala_spark/`
- result: passed
- total tests: `173`
- passed: `173`
- failed: `0`
- errors: `0`
- skipped: `0`
- suites executed: `32`
- report files parsed: `32 / 32`
- all `71` requirements have execution evidence

Note: the current filesystem contains `33` XML reports summing to `181` tests,
with later timestamps than the admitted Apr 19 execution surface. For the
traversal audit, the admitted execution surface remains the governed test35
claim: `173` passing tests across `32` suites.

## Current TypeScript State

The TypeScript line has made real progress:

- `T-053` proves a live external Codex `F_P` dispatch over `data_mapper`.
  The accepted run lasted about `150s`, selected `derive_code_surface`, and
  admitted returned worker output through the TypeScript hook path.
- `T-064`/installed operator work proves a public command path:
  `odd-sdlc-ts start --workspace . --target next --until blocked`.
- `T-066` adds the first product-materialization guard so markdown-only
  `code_surface.md` is no longer acceptable for code/test realization edges.
- `T-068` adds the missing generic conform-project layer:
  `{ documents, project_constraints } -> conformed project profile`.
- `data_mapper.test48.ts` proves the current installed smoke can traverse all
  `18` vectors and materialize product files under the active tenant root.

But the current installed TS `data_mapper` smoke inventory is:

- `1` main file:
  `build_tenants/scala_spark/src/main/scala/generated/DataMapper.scala`
- `1` test file:
  `build_tenants/scala_spark/src/test/scala/generated/DataMapperSpec.scala`
- `0` JUnit XML test reports
- `.ai-workspace/events/events.jsonl`: `90` events
- event kinds: `18` graph-call openings, `18` frame openings, `18` vector plans,
  `36` assessments
- no observed TS event family comparable to test35's runtime sequence of
  `fp_dispatched`, `result_artifact_observed`, `proof_failed`,
  `continuation_opened`, `edge_converged`, `graph_call_closed`, and
  `run_completed` across a deepening session

The current TS proof is a necessary smoke. It is not the test35 behavior.

## Gap To Success

The gap is not "make TS produce more files" in isolation.

The gap is:

`odd_sdlc.TS` must run an installed, graph-function-owned, ABG-visible
`data_mapper` traversal that recursively deepens a downstream product until
materialized source, materialized tests, deterministic inventory, and governed
execution evidence converge.

Concretely, TypeScript still needs one integrated proof lane with all of these
properties:

1. The run starts from a fresh independent `data_mapper` workspace populated
   through the current ABG and `odd_sdlc.TS` installers.
2. The run enters through the public installed operator path, not source-local
   helper code.
3. The graph program consumes conformed project truth before materialization.
4. Product realization edges write source and test files under
   `build_tenants/<active_tenant>/`.
5. Output expectations are derived from requirement/design/module/profile
   truth, not from data_mapper-specific hardcoded paths.
6. The implementation inventory is domain-shaped:
   compiler, fidelity, adjoint, assurance, accounting, executor, and engine
   capabilities are either produced or explicitly repriced with governed
   reasons.
7. The test inventory is behavioral, not scaffold-only.
8. Deterministic postflight rejects shallow realization:
   markdown-only outputs, one-file placeholders, identity pass-throughs,
   constant-success implementations, and trace-only test shells.
9. The same edge can re-enter against prior workspace state and prior gap
   evidence until the inventory and proof converge.
10. Build/test execution is dispatched under the declared execution contract.
11. JUnit or equivalent test report evidence is parsed and admitted.
12. The event archive shows the runtime sequence, including dispatch,
   admission, proof failure where applicable, continuation/re-entry, closure,
   and final projection.

## Success Bar

The minimum acceptable success bar is not exact file-count parity with test35.
ODD-native TypeScript should be allowed to be more compact and better
structured than Python's discovery implementation.

But it must clear a capability-equivalent bar:

- non-trivial multi-module downstream source inventory
- non-trivial behavioral test inventory
- compiled/tested execution evidence
- replayable ABG event/projection truth
- stateful recursive deepening proof
- explicit residual gaps where anything is intentionally smaller than test35

The strict comparator remains:

- test35: `105` main Scala files, `35` Scala test files, `173` admitted passing
  tests, `4662` runtime events, `86` runs, `57` F_P dispatches, `10`
  continuation openings.
- current TS smoke: `1` main Scala file, `1` Scala test file, `0` test reports,
  `90` events, no comparable deepening event stream.

## Ticket Consequence

`T-066` is the current closest owning ticket, but its title is narrower than
the full gap. The ticket should either be expanded or followed by a focused
critical ticket for:

`realize-typescript-data-mapper-recursive-realization-convergence-over-installed-graph-program`

That work must not patch toward Scala/data_mapper by hand. The lawful target is
generic SDLC realization:

```text
{ documents }
  -> conform project
  -> graph program execution
  -> materialized product source/test inventory
  -> build/test execution evidence
  -> gap/proof-driven re-entry
  -> convergence or explicit repricing
```

The outcome criterion is not "looks like test35." The outcome criterion is
that the TypeScript ODD-native line demonstrates the same root capability that
made test35 valuable: recursive, stateful, proof-driven construction of a real
downstream software product from governed graph traversal.

