# ODD SDLC TypeScript Traversal Assurance Integration

## Authority

- Ticket: `T-066`, `T-094`, `T-095`, `T-100`, `T-101`
- Requirements: `REQ-F-ODDSDLC-013`, `REQ-F-ODDSDLC-051`,
  `REQ-F-ODDSDLC-053`, `REQ-F-ODDSDLC-055`, `REQ-F-ODDSDLC-058`,
  `REQ-F-ODDSDLC-061`, `REQ-F-ODDSDLC-062`
- Design pack:
  - `ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md`
  - `ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md`
  - `ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md`

## Purpose

The installed operator must not close a product-realization edge only because a
worker wrote files that pass path and digest checks.

For materialization edges, the worker result surface is admitted through this
deterministic sequence:

```text
worker result report
  -> product materialization postflight
  -> traversal assurance ledgers
  -> ledger fold
  -> edge closure or replayable gap pressure
```

The ledgers are graph-function-owned evaluators. They are not commentary and
not a separate report lane.

## Cumulative Obligation Context

The installed operator must give every requirement-bearing realization edge one
self-contained traversal obligation context.

The context is the current edge's obligation basis:

```text
TraversalObligationContext =
  source asset types
  + target asset type
  + requirement authority refs
  + design/module authority refs
  + prior edge evidence refs
  + runtime context refs
  + retry gap dossiers
  + current delta summary
```

The worker must assess that context in its result report. The operator must
fold the worker assessments, materialized evidence, requirement closure truth,
and prior gap truth before edge closure.

This is not prompt guidance. It is the closure contract for product
realization:

```text
TraversalObligationContext
  -> F_P candidate output + WorkerObligationAssessment[]
  -> F_D assurance ledgers
  -> TraversalRequirementSatisfaction
  -> close | retry_same_edge | blocked | reprice_required
```

Large surfaces are carried by stable references and digests. The manifest may
also include compact current-state summaries for the actively blocking delta.
This distributes LLM compute across intermediate states without permitting
obligation loss.

## Carrier Boundary

| Carrier | Producer | Consumer | Closure Role |
| --- | --- | --- | --- |
| `SdlcWorkerResultReport` | F_P worker | installed operator | candidate result surface |
| `SdlcTraversalObligationContext` | installed operator | F_P worker and assurance gate | cumulative requirement/design/module/prior-edge pressure |
| `SdlcWorkerObligationAssessment[]` | F_P worker | requirement fulfillment ledger | worker-declared fulfillment over manifest obligations |
| `SdlcPostflightResult` | operator F_D postflight | materialization ledger | file/path/digest admission |
| `SdlcWorkerExecutionEvidence` | worker or execution adapter | operator F_D postflight | build/test command result admission |
| `SdlcAssuranceLedger[]` | operator assurance gate | ledger fold | dimension-specific realization truth |
| `SdlcTraversalRequirementSatisfaction` | ledger fold | installed operator | total closure/retry decision |
| `SdlcPostflightGapDossier` | installed operator | ABG-compatible retry events | replayable gap pressure |

## Required Dimensions

For non-product edges, product assurance is not applicable.

For product materialization edges:

- `materialization` is required
- `shallow_realization` is required
- `requirement_fulfillment` is required when the handoff carries requirement
  obligations
- `obligation_carry` is required when replay-derived retry gap dossiers are
  present
- `capability` is required on `code_surface` when the conformed project
  declares capability contracts for the active tenant

For `test_run_archive_surface`:

- `SdlcWorkerExecutionEvidence` is required
- the lane must be `test`
- the command must match the conformed project test execution contract
- status must be `succeeded`
- observed tests must be greater than zero
- report refs must be present

The admitted status vocabulary is closed:

- `succeeded`
- `failed`
- `pending`

Legacy or worker-emitted `not_run` is normalized to `pending` at report
admission. `pending` is admissible as a carrier state, but it is not closure
evidence. The archive edge blocks until execution evidence is `succeeded` with
observed tests, report refs, and zero failures.

For `test_module_surface`:

- materialized test files must be discoverable by the declared test execution
  contract
- when the contract is `sbt test`, standalone `object ... main` programs are
  not test-module closure evidence
- if the selected tenant build configuration lacks a discoverable test
  framework binding, the worker must materialize or update build configuration
  and report the file as `build_config`
- non-discoverable test materialization blocks before the test-run archive edge
  and is emitted as replay-visible gap pressure

The fold result is total:

| Fold Status | Operator Transition |
| --- | --- |
| `close_allowed` | continue to hook postflight and accepted runtime events |
| `retry_same_edge` | emit gap dossier and same-edge retry pressure |
| `blocked` | emit typed blocked gap pressure |
| `reprice_required` | emit typed reprice pressure |

## Autonomous Retry Closure

Worker report admission failure is not success, but it is also not terminal
when the operator has already converted it into retry/repair runtime truth.

The installed loop follows the operator transition, not the symptom label:

```text
worker report missing or malformed
  -> report-admission postflight blocked
  -> SdlcPostflightGapDossier
  -> retry/continuation runtime events
  -> nextLawfulAction = retry_same_edge_with_gap_dossier
  -> continue start loop with prior gap pressure
```

The next attempt receives the prior gap dossier as
`prior_gap:*` traversal obligations. The loop stops only when the retry policy
does not emit retry repair truth, or when a genuine terminal blocked, failed,
or converged state is reached.

## Design Rule

An assurance finding is part of traversal state. It must be archived and, when
not close-allowed, converted into replay-visible gap/continuation pressure
before the operator returns.
