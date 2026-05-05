---
id: T-112
title: Model complete semantic lifecycle over ABG 3.5 substrate
type: feature
ticket_category: architecture_follow_on
status: active
goal: typescript-rc-runtime-architecture
change_intent: Define the full odd_sdlc semantic lifecycle over ABG 3.5 runtime truth so process success, transform admission, semantic evaluation, ledger projection, retry, reentry, and closure remain distinct.
change_class: design_reframe
re_entry_point: design
affected_boundary: installed operator lifecycle, assurance ledgers, retry frontier, graph-span reentry, gap dossier projection, release qualification
priority: critical
triaged_at: 2026-05-03
created_at: 2026-05-03
updated_at: 2026-05-04
build_tenant: typescript
owner: unassigned
review_status: active_design_pending
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
