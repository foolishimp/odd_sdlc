---
id: T-112
title: Model complete semantic lifecycle over ABG 3.5 substrate
type: feature
ticket_category: architecture_follow_on
status: completed
goal: typescript-rc-runtime-architecture
change_intent: Define the full odd_sdlc semantic lifecycle over ABG 3.5 runtime truth so process success, transform admission, semantic evaluation, ledger projection, retry, reentry, and closure remain distinct.
change_class: design_reframe
re_entry_point: design
affected_boundary: installed operator lifecycle, assurance ledgers, retry frontier, graph-span reentry, gap dossier projection, release qualification
priority: critical
triaged_at: 2026-05-03
created_at: 2026-05-03
updated_at: 2026-05-10
completed_at: 2026-05-10
build_tenant: typescript
owner: unassigned
review_status: closed_superseded_retired
depends_on:
  - T-110 ABG 3.5.0-rc.1 traced callout migration completed 2026-05-04
  - T-102 first-class F_P transform/evaluate carrier split completed 2026-05-04
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: ABG 3.5 fixes framework-owned process/callout substrate but does not by itself define odd_sdlc's complete semantic lifecycle model.
target_truth: odd_sdlc lifecycle state is a composition of ABG process truth, admitted transform evidence, SDLC semantic evaluation rows, ledger projection, retry/reentry projection, and closure decision; no single process or report result collapses the lifecycle.
superseded_truth: successful worker process completion or accepted legacy report shape is treated as sufficient lifecycle progress or closure.
closure_law: This ticket closes only when design, code, and proof lanes show the complete lifecycle as typed phases with explicit producers, consumers, and blocking/retry/reentry outcomes.
evaluation_criteria:
  - process outcome is not semantic outcome.
  - transform admission is not semantic closure.
  - semantic evaluation rows are distinct from materialization ledgers.
  - retry and graph-span reentry consume projected evidence, not branch-local booleans.
  - release qualification consumes lifecycle projections rather than worker self-report.
proof_surface:
  - lifecycle design document
  - carrier/projection mapping table
  - deterministic lifecycle tests
  - data-mapper sandbox proof across multiple edges
  - live evidence after T-110/T-102 where feasible
non_closure_conditions:
  - Closing by showing ABG process traces only.
  - Closing by showing transform/evaluate split only for one artificial edge.
  - Preserving branch-local closure booleans as lifecycle authority.
  - Hiding retry/reentry policy inside prompt text.
---

# T-112: Model Complete Semantic Lifecycle Over ABG 3.5 Substrate

## Current Blocker - 2026-05-06

Still active. The lifecycle model is substantially proven through process
truth, transform admission, semantic evaluation, component-depth repair, and
release-depth blocking, but release closure remains open.

Current proof:

- `npm run test:semantic` passed: 216/216.
- `npm run test:sandbox` passed: 15/15.
- `ODD_SDLC_TS_T115_DATA_MAPPER_LIVE=1 npm run test:t115:data-mapper-repair-live`
  passed and proved failed governed execution flowing into component failure
  attribution and repair schedule truth.

Current non-closure evidence:

- Live T-109 remains at `derive_release_depth_parity_surface`.
- Release-depth parity is blocked by missing pass evidence after a generated
  test compile failure. This keeps release qualification open under the T-112
  closure law.

## Dependency Checkpoint - 2026-05-04

T-102 is closed for the first-class transform/evaluate carrier split. This
ticket now inherits those carriers as available substrate evidence.

T-110 proved the installed-operator ABG 3.5 callout path with live Claude
`pty-terminal` evidence and typed negative/forced-failure outcomes on
2026-05-04. T-112 is active because the RC wave now needs complete semantic
lifecycle modeling alongside T-113's component-depth enforcement.

## STDO Triage

### First Missing Layer

Design.

ABG 3.5.0-rc.1 gives `odd_sdlc` a reliable process/callout substrate. That
removes a major source of randomness, but it does not model the whole semantic
lifecycle of an SDLC edge.

This ticket defines that lifecycle explicitly so later implementation work does
not confuse transport success with product progress.

## Lifecycle Phases

The lifecycle must keep these phases distinct:

1. operator intent admission
2. graph-function/vector selection by ABG
3. worker process callout and traced execution
4. transform payload/file evidence admission
5. deterministic envelope checks
6. F_P semantic evaluation
7. ledger projection
8. retry-frontier projection
9. graph-span reentry projection
10. closure or lawful block

## T-113 Carrier Boundary Dependency

T-112 owns the broader semantic lifecycle model. T-113 owns the concrete
component-depth graph-function and postflight enforcement lane. The two tickets
meet at the typed admission boundary:

- F_P.transform may produce component-depth register carriers.
- odd_sdlc must admit or reject those carriers as typed framework truth.
- F_P.evaluate and assurance folding compare admitted carriers against
  materialized files, execution evidence, and requirement/testcase allocation.
- Release closure must depend on admitted lifecycle phases, not markdown prose
  or worker_result_report.json authority.

For T-112, component-depth evidence is one lifecycle phase among process,
transform admission, semantic evaluation, ledger projection, retry, reentry,
and closure. It must not collapse back into generic worker success.

The T-113 typed carrier/parser detail is intentionally upstream of closure for
this ticket: lifecycle modeling is incomplete if component-depth carrier
admission remains a prompt convention instead of a typed phase.

## Required Design Work

Produce or update a design surface that maps each phase to:

- owner
- carrier
- producer
- consumer
- event/projection surface
- failure/blocking outcomes
- proof lane

Minimum owner split:

| Phase | Owner |
| --- | --- |
| process/callout trace | ABG |
| traversal/iteration | ABG |
| transform/evaluate carrier admission | ABG plus odd_sdlc plugin mapping |
| SDLC semantic meaning | odd_sdlc |
| ledger projection | ABG substrate plus odd_sdlc domain rows |
| release interpretation | odd_sdlc |

## Acceptance Criteria

- AC-1: design names every lifecycle phase and owner.
- AC-2: code has no normal path where process exit success implies semantic
  closure.
- AC-3: code has no normal path where materialized file existence implies
  obligation fulfillment.
- AC-4: retry/reentry/closure consume projected lifecycle state.
- AC-5: tests cover process success with semantic failure.
- AC-6: tests cover process failure after useful artifact materialization.
- AC-7: tests cover semantic failure that routes to graph-span reentry or
  lawful block rather than generic retry.

## Out Of Scope

- Executor implementation details.
- Sticky-session optimization.
- UI redesign.

## 2026-05-07 Lifecycle Boundary Checkpoint

The current ticket wave strengthened the lifecycle boundary but does not close
T-112.

Implemented/reconciled surfaces:

- T-120 removed the old `cli/command.ts` command/control module.
- `spec_method/entry.ts` now admits operator intent and calls the installed
  odd_sdlc/ABG boundary; it does not own retry iteration, retry budget,
  traversal selection, or retry context synthesis.
- `operator/installed_operator.ts` owns installed retry/reentry projection
  behind the ABG/runtime boundary.
- B-085 adds `SdlcComponentRepairReentryPlan` so semantic failure at
  release-depth parity can become a typed repair-reentry package rather than
  worker prose or process success.
- T-123 now treats ABG-selected traversal strategy as authoritative; retry
  context cannot override ABG-selected full breadth.

Verification:

- combined focused suite passed: 57/57
- `npm run test:semantic` passed: 239/239
- `npm run test:sandbox` passed: 15/15

Remaining T-112 work:

The lifecycle design still needs review as a complete phase map from operator
intent through closure/reentry, and live data_mapper proof still must show the
B-085 semantic failure route consumed by the installed product path.

## Closure Note - 2026-05-10

Closed as superseded/retired, not as an implementation-complete lifecycle
proof.

T-112 was an ABG 3.5 umbrella ticket for keeping process truth, transform
admission, semantic evaluation, ledger projection, retry, reentry, and closure
distinct. That target is no longer best tracked as one broad active lifecycle
ticket. The current line has repriced the work into narrower controlling
surfaces:

- T-109 ratifies the traversal-consequence/evaluator constitutional target.
- T-135 through T-140 implement the runner, yield, target binding, replay,
  public gaps, and local-iteration retirement slices.
- T-141/T-142 carry the requirement-to-product materialization boundary and
  autonomous consequence-chain proof.
- T-134/T-133/T-132/T-131 now carry live-lane proof at concrete product
  boundaries.

Keeping T-112 active now adds duplicate closure pressure and stale ABG 3.5
wording without improving implementation control. Any remaining real defect
must be reopened as a narrow ticket against the current ABG 3.7.1/evaluator
line, with its own proof surface, rather than by reviving this umbrella.

Closure disposition:

- closed reason: superseded by current evaluator/traversal-consequence ticket
  wave
- not claimed: full data_mapper parity
- not claimed: complete release-depth lifecycle proof
- carried forward: lifecycle phases must remain distinct; process success,
  transform admission, materialization, semantic fulfillment, closure, retry,
  reentry, and yield cannot collapse into one authority surface
