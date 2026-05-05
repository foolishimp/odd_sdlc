---
id: T-115
title: Realize ABG-prime execution-failure to component-repair flow
type: design
ticket_category: graph_repair_flow
status: completed
goal: typescript-test35-production-depth-parity
change_intent: Make failed governed test execution an ABG-owned typed traversal input that schedules bounded component code/test repair without relying on an external harness loop.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript GTL graph catalog, installed operator handoff/admission, component-depth assurance, test execution result admission, ABG whole-graph iteration
priority: critical
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-04
build_tenant: typescript
owner: unassigned
review_status: closed
governance_scope: STDO Method
parent_tickets:
  - T-102
  - T-105
  - T-113
  - T-114
intake_source: Test35 forensic review showed deep production shape came from stateful ABG/Genesis evaluator/ledger repair pressure, while current TS detects execution failures but does not yet convert them into ABG-owned component repair traversal.
---

# T-115: Realize ABG-Prime Execution-Failure To Component-Repair Flow

## STDO Triage

### First Missing Layer

Design.

The missing layer is not another harness loop and not a broader lifecycle
expansion. The missing layer is a prime ABG graph flow:

```text
test execution truth
  -> typed failure attribution
  -> bounded component repair schedule
  -> existing component code/test realization in repair mode
  -> rerun affected governed execution shards
  -> archive/release closure only after repaired execution evidence converges
```

This must be expressed as graph functions, typed carriers, ABG events, and
ledger folds. It must not be implemented as a live-test wrapper that repeatedly
calls `gaps` and `start` until the generated code happens to pass.

### Lawful Change Class

`design_reframe`.

The current TypeScript realization already has ABG-owned whole-graph iteration
from T-105 and typed F_P transform/evaluate separation from T-102. This ticket
does not change product intent. It re-frames failed execution as a constructive
ABG traversal input instead of a terminal operator/harness concern.

## Current Reality

The TypeScript graph already has several required pieces:

- `prepare_test_execution_surface`
- `derive_test_execution_result_surface`
- `derive_test_run_archive_surface`
- `qualify_component_test_execution_surface`
- `derive_release_depth_parity_surface`
- `prepare_release_surface`
- component-depth registers for implementation and test materialization

The runtime can currently detect and classify:

- missing execution evidence
- invalid execution carrier
- command mismatch
- shard mismatch
- zero tests observed
- failed execution
- contradictory execution counts
- pending execution
- worker timeout / lost terminal / launch failure

However, after this classification the result is still mostly a gap dossier and
lawful operator action. That is not enough to restore test35 behavior through
ABG. A failed execution needs to become a typed input to the next graph step,
not just a reason for an external harness to call `start` again.

## Test35 Evidence

The Python-era `data_mapper.test35` evidence shows real iterative pressure:

- `4662` runtime events.
- `82` FP manifests.
- `81` FP results.
- `80` FP ledgers.
- `derive_code_surface` had repeated manifests/results/ledgers.
- `derive_test_run_archive_surface` had repeated manifests/results/ledgers.
- `proof_failed`, `graph_call_failed`, `continuation_opened`, and `run_failed`
  events were emitted when proof did not converge.

The key mechanism was not an external shell loop alone. The installed Python
runtime published a stateful builder control frame, deterministic F_D checks,
F_P semantic convergence evaluators, fulfillment ledgers, and continuation
events. The worker was driven by current workspace state and failing evaluator
truth.

The TS replacement should preserve that ABG-owned pressure, but with a more
lawful typed shape:

- failed test execution must be admitted as execution truth;
- failure attribution must map to component/testcase/requirement rows;
- repair must be scheduled by graph truth;
- code/test repair must be bounded by those rows;
- execution must rerun as an ABG consequence of repair closure.

### Test35 Parity Source Authority

Test35 parity cannot be proven against the internal `odd_sdlc`
`data_mapper_induction` fixture alone. That fixture is a local regression seed
owned by the TypeScript test environment and does not carry the full external
`data_mapper.template` obligation surface.

Any closure claim that compares T-115 against test35 must use the external
template source:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template
```

The parity lane must assert before traversal closure that the admitted
requirement surface includes the production-shaped obligations present in the
external template, including:

- `REQ-ENG-001` through `REQ-ENG-007`
- `REQ-BT-001` through `REQ-BT-004`

The internal sandbox may prove deterministic mechanics. It must not be used as
the sole evidence for production-depth or test35 parity.

## Prime Flow

Keep the flow minimal. Do not add a broad runtime-return or deployment-retrofit
model in this ticket.

## Implementation Slice - 2026-05-04

The TypeScript tenant now carries the first prime-flow implementation slice:

- `component_test_qualification_surface` admits a typed
  `componentExecutionFailureRegister` for failed governed execution rows.
- `derive_component_repair_schedule_surface` publishes
  `component_repair_schedule_surface` as the bounded repair carrier.
- component code/test prompts accept an admitted repair schedule as repair-mode
  input without creating a parallel repair graph.
- release-depth parity blocks over open repair rows instead of letting archive
  or release closure outrun repair truth.
- deterministic tests prove typed attribution, missing-attribution rejection,
  and repair-schedule admission.
- the live installed data-mapper lane
  `test_t115_live_installed_data_mapper_repair_flow.test.mjs` seeds from the
  external `data_mapper.template`, asserts the `REQ-ENG-*` and `REQ-BT-*`
  parity obligations, injects failed execution evidence through the installed
  process worker path, and requires typed failure attribution plus
  `repair_required` schedule truth.
- `derive_test_execution_result_surface` now admits failed-but-structurally
  valid execution evidence as graph truth. Pending, malformed,
  contradictory, zero-test, command-mismatch, lane-mismatch, missing-shard, and
  missing-report evidence still block at the execution-result edge.

This slice deliberately uses a controlled process worker for the live repair
lane. Claude/PTY live lanes remain useful for production generation evidence,
but this repair-flow proof must be deterministic about the failure class so it
can prove ABG graph mechanics rather than API variance.

### Proof - 2026-05-04

- `npm run build:semantic` passed.
- `npm run test:semantic` passed `172/172`.
- `node --test test_env/tests/test_t066_product_materialization_contract.test.mjs`
  passed `20/20`.
- `node --test test_env/tests/test_t086_blocking_reason_carriers.test.mjs`
  passed `5/5`.
- `node --test test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs`
  passed `3/3`.
- `ODD_SDLC_TS_T115_DATA_MAPPER_LIVE=1 node --test test_env/live/test_t115_live_installed_data_mapper_repair_flow.test.mjs`
  passed `1/1`.
- Live archive:
  `build_tenants/typescript/test_env/test_runs/t115_live_installed_data_mapper_repair_flow/20260504T094333074Z_pid21003`.

### Existing Edges To Reuse

Reuse these existing edges and carriers:

- `derive_test_execution_result_surface`
- `qualify_component_test_execution_surface`
- `derive_component_code_surface`
- `derive_component_test_surface`
- `derive_test_schedule_surface`
- `prepare_test_execution_surface`
- `derive_test_run_archive_surface`
- `derive_release_depth_parity_surface`
- `prepare_release_surface`

### New Surface

Add one new target surface:

- `component_repair_schedule_surface`

### Expanded Existing Surface

Expand `component_test_qualification_surface` to include a typed failure
attribution register when execution does not fully pass:

```json
{
  "kind": "component_execution_failure_register",
  "registerVersion": "ts-component-depth-v1",
  "failureRows": [
    {
      "failureId": "failure://cdme-compiler/TopologicalCompilerSpec/TC-COMP-003",
      "shardId": "test-shard-01-cdme-compiler",
      "moduleName": "cdme-compiler",
      "testClassId": "TopologicalCompilerSpec",
      "testcaseIds": ["TC-COMP-003"],
      "componentIds": ["compiler-topological-compiler"],
      "requirementIds": ["REQ-LDM-003", "REQ-TYP-003"],
      "failureKind": "assertion_failure",
      "repairTarget": "component_code",
      "lawfulReentryPoint": "repair_component_realization",
      "sourceRefs": [
        "build_tenants/scala_spark/cdme-compiler/src/main/scala/..."
      ],
      "testRefs": [
        "build_tenants/scala_spark/cdme-compiler/src/test/scala/..."
      ],
      "evidenceRefs": [
        "artifact://odd-sdlc/test-execution/cdme-compiler"
      ]
    }
  ]
}
```

### New Edge

Add one graph edge:

```text
derive_component_repair_schedule_surface
  source:
    - component_test_qualification_surface
    - test_execution_result_surface
    - component_realization_qualification_surface
  target:
    - component_repair_schedule_surface
```

This edge is active only when the failure register contains repairable rows.
If there are no repairable rows, it must be skipped or close as
`no_repair_required` without creating a fake repair plan.

### Repair Mode

Do not add separate `repair_component_code_surface` and
`repair_component_test_surface` edges unless implementation proves the existing
component edges cannot lawfully accept repair input.

Preferred prime design:

- `derive_component_code_surface` accepts optional
  `component_repair_schedule_surface` input when repair rows target source
  code.
- `derive_component_test_surface` accepts optional
  `component_repair_schedule_surface` input when repair rows target tests.
- The component-depth register must mark rows as repair-mode rows and cite the
  failure rows being repaired.

This keeps repair inside the existing component realization graph instead of
creating a parallel repair graph.

## Failure Classification

Classify execution failure before repair. No source/test mutation is lawful
until failure attribution succeeds.

| Failure class | Lawful target |
|---|---|
| `execution_evidence_missing` | same-edge retry or worker-output repair |
| `execution_carrier_invalid` | repair worker output, not product code |
| `execution_command_mismatch` | test schedule / execution surface repair |
| `execution_shard_mismatch` | test schedule / execution surface repair |
| `zero_tests_observed` | test stack, test module, or test schedule repair |
| `source_compile_error` | component code repair |
| `test_compile_error` | component test repair unless diagnostic proves missing product symbol |
| `assertion_failure` | component code repair by default |
| `testcase_authority_contradiction` | testcase/design/requirement reprice |
| `runtime_exception` | component code repair |
| `worker_timeout_or_lost_terminal` | inspect worker archive first |
| `network_or_transport_failure` | transport retry / inspect archive, not product repair |

The classifier must emit `triage_gap` when it cannot map a failure to at least
one testcase/component/requirement row.

## Triage Mechanism

Triage is an ABG admission step over typed evidence, not an operator judgment
embedded in prose.

Prime triage flow:

```text
test_execution_result_surface
  + test_component_topology_surface
  + component_test_surface
  + implementation_component_topology_surface
  + component_realization_qualification_surface
  + testcase_authority_surface
  -> component_execution_failure_register
  -> component_repair_schedule_surface
```

The classifier is deterministic-first with an explicit F_P fallback. It is not
deterministic-only.

When deterministic parsing and topology lookup can fully attribute the failure,
ABG admits deterministic failure rows directly. When deterministic evidence is
incomplete or ambiguous, ABG dispatches a bounded `F_P.triage` transform over
the admitted execution evidence and topology surfaces. `F_P.triage` may propose
typed candidate rows, but ABG admission still decides whether those rows are
valid and whether repair is lawful.

### Triage Steps

1. Normalize execution evidence.
   - Parse shard status, command, module, report refs, stdout/stderr refs,
     test counts, failed test names, compile diagnostics, runtime exceptions,
     and timeout/transport outcomes.
2. Classify the failure kind.
   - Use the closed failure class list in this ticket.
3. Bind the failure to graph topology.
   - shard -> module
   - failed class -> `testClassId`
   - test class -> `testcaseIds`
   - testcase -> `componentIds`
   - component -> `sourceRefs`
   - testcase/component -> `requirementIds`
4. Decide the repair target.
   - product source repair
   - component test repair
   - test module/topology/schedule repair
   - implementation design/module reframe
   - testcase authority repair
   - requirement reprice
   - inspect worker archive / transport retry
5. If deterministic attribution is incomplete, dispatch bounded `F_P.triage`.
   - The prompt must include only admitted execution evidence, topology
     surfaces, testcase authority, component realization evidence, and the
     closed failure-class schema.
   - The worker must return only typed candidate failure rows.
   - The worker must not mutate files.
   - The worker must not decide closure.
   - The worker must not invent testcase, component, or requirement ids outside
     admitted topology/authority surfaces.
6. Admit or reject F_P candidate rows.
   - ABG validates schema, references, id membership, source/test refs, and
     lawful reentry.
   - Invalid rows become `triage_gap` evidence, not repair authority.
7. Assign confidence.
   - `high`: ABG may schedule bounded repair.
   - `medium`: ABG may produce a repair schedule only if the next edge keeps
     repair scope narrow and cites unresolved ambiguity.
   - `low`: ABG emits `triage_gap`; no code/test mutation is lawful.
8. Emit a typed row.
   - The admitted row is closure/repair authority, not worker prose.

### F_P Triage Fallback

`F_P.triage` is a bounded interpretation function, not a repair function.

Purpose:

- interpret ambiguous compiler/test diagnostics;
- map diagnostic text to already-admitted topology ids;
- explain whether the failure is source, test, schedule, design, authority, or
  requirement scoped;
- produce typed candidate failure rows for ABG admission.

Non-purpose:

- no source/test/design mutation;
- no new requirements;
- no new topology ids;
- no closure decision;
- no release readiness claim.

Candidate row shape:

```json
{
  "kind": "component_execution_failure_candidate",
  "candidateSource": "F_P.triage",
  "failureId": "failure://cdme-compiler/TopologicalCompilerSpec/TC-COMP-003",
  "shardId": "test-shard-01-cdme-compiler",
  "moduleName": "cdme-compiler",
  "testClassId": "TopologicalCompilerSpec",
  "testcaseIds": ["TC-COMP-003"],
  "componentIds": ["compiler-topological-compiler"],
  "requirementIds": ["REQ-LDM-003"],
  "failureKind": "assertion_failure",
  "repairTarget": "component_code",
  "lawfulReentryPoint": "repair_component_realization",
  "attributionConfidence": "medium",
  "sourceRefs": [
    "build_tenants/scala_spark/cdme-compiler/src/main/scala/..."
  ],
  "testRefs": [
    "build_tenants/scala_spark/cdme-compiler/src/test/scala/..."
  ],
  "evidenceRefs": [
    "artifact://odd-sdlc/test-execution/cdme-compiler"
  ],
  "interpretation": "The failed assertion belongs to the admitted compiler path-compilation testcase and targets the topological compiler component."
}
```

ABG may admit an `F_P.triage` candidate as a repairable row only if every id
and ref resolves against admitted graph evidence. Otherwise the row remains
diagnostic evidence and the traversal emits `triage_gap`.

### Required Failure Row Fields

Every repairable failure row must include:

- `failureId`
- `shardId`
- `moduleName`
- `testClassId`
- `testcaseIds`
- `componentIds`
- `requirementIds`
- `failureKind`
- `repairTarget`
- `lawfulReentryPoint`
- `attributionConfidence`
- `sourceRefs`
- `testRefs`
- `evidenceRefs`

Rows missing any of these fields are not repairable rows. They may be admitted
only as non-repair triage rows.

### Confidence Gate

Automatic bounded repair requires `attributionConfidence: "high"`.

Rows produced by `F_P.triage` default to `medium` confidence unless deterministic
post-admission checks independently confirm all required bindings and no
alternate repair target remains plausible.

`medium` confidence may route only to a constrained repair schedule with an
explicit ambiguity note and no release closure. A second failed repair at
medium confidence must escalate to `triage_gap`.

`low` confidence must not mutate product code or tests.

### Design Loopback Criteria

Execution failure may loop back to design only when the triage row proves one
of these design-owned defects:

- A test expects a product API required by admitted testcase authority, but the
  implementation design/module surface never declared that API or equivalent
  behavior.
- A component cannot satisfy a requirement because the admitted component
  topology assigned the obligation to the wrong module or concern boundary.
- The implementation module surface omits a dependency required to realize the
  admitted requirement/testcase.
- A repeated high-confidence component repair fails because the current design
  lacks enough authority to choose between multiple valid implementations.

Design loopback row example:

```json
{
  "failureId": "failure://cdme-compiler/TopologicalCompilerSpec/TC-COMP-003",
  "shardId": "test-shard-01-cdme-compiler",
  "moduleName": "cdme-compiler",
  "testClassId": "TopologicalCompilerSpec",
  "testcaseIds": ["TC-COMP-003"],
  "componentIds": ["compiler-topological-compiler"],
  "requirementIds": ["REQ-LDM-003"],
  "failureKind": "test_compile_error",
  "repairTarget": "implementation_design",
  "lawfulReentryPoint": "design_reframe",
  "attributionConfidence": "high",
  "sourceRefs": [],
  "testRefs": [
    "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/TopologicalCompilerSpec.scala"
  ],
  "evidenceRefs": [
    "artifact://odd-sdlc/test-execution/cdme-compiler"
  ],
  "reason": "test expects compilePath API required by admitted testcase authority, but implementation module/design surface never declared a corresponding public boundary"
}
```

### No-Mutation Rule

If triage cannot bind a failure to at least:

```text
testcaseId + componentId + requirementId
```

then the system must not mutate source code, tests, design, or requirements.
It must emit `triage_gap` with evidence refs and stop for lawful review.

## ABG Ownership Rule

The repair loop must be owned by ABG iteration.

Required rule:

```text
ABG fold sees failed execution qualification
  -> ABG admits failure register
  -> ABG traverses component repair schedule
  -> ABG traverses bounded component code/test repair
  -> ABG reruns affected execution shards
```

Forbidden rule:

```text
external harness sees failed test
  -> external harness calls start again
  -> worker opportunistically edits files
```

The live test harness may observe and assert this flow. It must not be the flow.

## Proof Lane Split

T-115 has two distinct proof lanes.

### Sandbox Mechanism Lane

The sandbox lane may use checked-in deterministic fixtures, including the
internal data_mapper induction fixture, to prove:

- failure evidence normalization;
- deterministic-first attribution;
- bounded `F_P.triage` fallback;
- `component_execution_failure_register` admission;
- `component_repair_schedule_surface` emission;
- repair-mode routing into existing component code/test edges;
- no mutation when attribution fails.

This lane proves the mechanism. It does not prove test35 parity.

### Test35 Parity Live Lane

The parity lane must seed from external `data_mapper.template`, not the
internal induction fixture. Before comparing to test35, the lane must admit and
archive a source-authority assertion showing that the live workspace contains
the external production-depth obligations, including `REQ-ENG-*` and `REQ-BT-*`.

The parity lane must then prove that any governed execution failure is routed
through ABG-owned repair flow and that archive/release closure remains blocked
until repairable rows close.

## Acceptance Criteria

- AC-1: `component_test_qualification_surface` admits a typed
  `component_execution_failure_register` when governed test execution does not
  fully pass.
- AC-2: every repairable failure row maps to `shardId`, `moduleName`,
  `testClassId`, `testcaseIds`, `componentIds`, `requirementIds`, `sourceRefs`,
  `testRefs`, `failureKind`, and `repairTarget`.
- AC-3: unattributed failures produce `triage_gap` and do not trigger code/test
  mutation.
- AC-4: `derive_component_repair_schedule_surface` is the only new graph edge
  required for the first slice.
- AC-5: existing component code/test edges support repair mode by consuming the
  repair schedule and citing repaired failure rows.
- AC-6: failed source compile or assertion evidence can trigger bounded source
  repair through ABG traversal.
- AC-7: failed test compile evidence can trigger bounded test repair through
  ABG traversal unless classified as missing product symbol.
- AC-8: rerunning affected test shards is a graph consequence of repair
  closure, not an external harness loop.
- AC-9: `derive_test_run_archive_surface`, `derive_release_depth_parity_surface`,
  and `prepare_release_surface` cannot close while repairable execution failure
  rows remain open.
- AC-10: a sandbox proof uses recorded execution-failure fixtures to show
  failure attribution, repair scheduling, and bounded repair routing without
  calling a live model.
- AC-11: a live data_mapper proof reaches a real execution failure or forced
  fixture-equivalent failure, routes it through ABG-owned repair flow, reruns
  execution, and archives the repair lineage.
- AC-12: any test35 parity closure uses external `data_mapper.template` as the
  source seed and asserts the presence of `REQ-ENG-*` and `REQ-BT-*` before
  comparing depth, event counts, or asset quality to test35.

## Non-Closure Conditions

- Closing by increasing live harness `MAX_STEPS` only.
- Closing by adding another external `while gaps; start` loop.
- Closing by asking a worker prompt to "fix tests" without a typed failure
  attribution register.
- Closing by creating broad runtime-return/deployment retrofit machinery.
- Closing by adding many new graph edges when repair-mode reuse of component
  edges would be sufficient.
- Closing when failure classification can mutate code without component,
  testcase, and requirement attribution.
- Closing when archive/release can pass while repairable execution failure rows
  remain open.
- Closing by treating worker-authored prose as closure authority.
- Closing test35 parity by using only the internal `data_mapper_induction`
  fixture.
- Closing parity without asserting that the external template's production-depth
  `REQ-ENG-*` and `REQ-BT-*` obligations were admitted into the live workspace.

## Design Slice Plan

1. Define `component_execution_failure_register` schema and parser/admission
   tests.
2. Expand `qualify_component_test_execution_surface` guidance and postflight
   admission to publish failure rows.
3. Add `derive_component_repair_schedule_surface` to the graph catalog and
   domain catalog.
4. Add repair-mode input handling to existing component code/test surfaces.
5. Add closure fold logic so open repair rows block archive/release and route
   traversal to the repair schedule.
6. Add deterministic sandbox fixtures:
   - source compile error
   - test compile error
   - assertion failure
   - zero tests observed
   - unattributed failure
7. Add a source-authority assertion for the external data_mapper template that
   proves `REQ-ENG-*` and `REQ-BT-*` are admitted before test35 parity
   comparison.
8. Add one live external-template data_mapper lane that proves ABG-owned repair
   flow, with the harness only observing the ABG event/ledger sequence.

## Proof Commands

Deterministic proof should be the first closure gate:

```bash
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run test:semantic
```

Focused tests to add or extend:

```bash
node --test test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs
```

Live proof is required after deterministic proof:

```bash
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
ODD_SDLC_TS_T109_DATA_MAPPER_LIVE=1 \
ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT=/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template \
npm run test:t109:data-mapper-live
```

The live proof must show ABG-owned repair events and ledgers. The harness log is
supporting evidence only.

For test35 parity, the live proof must also archive the source-authority
assertion that the external template obligations were admitted before traversal
closure.

## Implementation Slice - 2026-05-04

First code slice implemented:

- added typed `component_execution_failure_register` rows to component-depth
  carriers;
- added typed `component_repair_schedule_surface` and repair schedule rows;
- added `derive_component_repair_schedule_surface` to the graph catalog after
  component test qualification and before test-run archive;
- extended component-depth admission and assurance so failed component-test
  qualification requires typed attribution before it can become repair input;
- extended release-depth parity checks so open repair rows block parity closure;
- updated worker prompts so component code/test edges can run in repair mode
  when an admitted repair schedule exists;
- added deterministic T-115 carrier/assurance proof fixture.

Remaining closure evidence:

- run deterministic proof after build;
- run external-template live data_mapper proof;
- confirm repair lineage appears in ABG event/ledger archives, not only harness
  logs.
