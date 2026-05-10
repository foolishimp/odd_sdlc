---
id: T-139
title: Consolidate public gaps as read-only requirements-fulfillment evaluator view
type: feature
ticket_category: implementation_migration
status: completed
review_status: closed_implemented
goal: typescript-rc-one-public-requirements-fulfillment-evaluator-surface
build_tenant: typescript
owner: odd_sdlc
change_intent: Ensure `gaps`, query-domain, live status, and CLI summaries track and measure requirements fulfillment from the same evaluator/ledger truth consumed by the runner, without creating local ranking, local action refs, or executable traversal authority.
change_class: realization_refactor
re_entry_point: code
affected_boundary:
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/cli/main.ts
  - build_tenants/typescript/code/src/qualification/
  - build_tenants/typescript/package.json
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
priority: high
rc_blocker: true
release_blocker_reason: Public gaps/query-domain must not become a second action surface or a shallow next-action list; its primary job is to measure requirement fulfillment and expose the evaluator consequence as read-only truth.
migration_strategy: inside_out_hard_break
library_usage: consume
governing_library: T-109 traversal consequence carriers and ABG 3.7.1 construction evaluator projection
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-10
completed_at: 2026-05-10
source_ticket: T-109
governance_scope: STDO Method
dependencies:
  - T-109 publish authoritative edge ledger lineage chain
  - T-135 realize evaluator-owned runner traversal spine
related_tickets:
  - T-129 ABG 3.7.1 evaluator and liveness substrate migration
  - T-133 create minimum overhead Rust hello-world live lane
  - T-134 define bootstrap_sdlc induction graph function
intake_source: The T-109/T-135 spine established that the product loop exists to observe current worksite truth, bind gaps to exact target and requirement obligations, admit evidence, measure fulfillment, and then derive closure/next-action consequence. Public gaps is the read-only interface over that measurement. It must display the same truth the runner consumes but must not append events, invoke workers, admit intent, or choose traversal by itself.
target_truth: Public gaps, query-domain, live status, and RC summaries project requirements-fulfillment measurement from the evaluator consequence surface. They expose requirement obligations, target bindings, fulfillment counts, evidence refs, open reasons, closure dispositions, yield/resume state, and candidate actions as read-only rows. Candidate actions are consequences of the fulfillment measurement, not the purpose of the public surface. Public surfaces do not fabricate action refs, infer requirement closure from marker echo, or own ranking law.
superseded_truth: Public surfaces compute local `nextLawfulActions`, local priority ordering, local requirement status, local closure status, or local action refs that can drift from evaluator/runner truth.
closure_law: This ticket closes only when public surfaces render requirements-fulfillment truth through one adapter, deterministic tests prove no local requirement-status/ranking/action fabrication remains, and CLI output explicitly marks read-only projections as non-executable.
evaluation_criteria:
  - Public gaps consumes the T-135 evaluator/ledger adapter as the single source
    of requirements-fulfillment measurement.
  - Public output exposes requirement obligation ids, source/evidence refs,
    fulfillment status, open reason refs, and carry-forward pressure.
  - Public output exposes `SdlcEdgeFulfillmentLedger` counts and
    `SdlcEdgeClosureDecision` disposition when an attempted edge has evidence.
  - Public output does not treat a generated requirement surface or `REQ-*`
    marker echo as fulfilled requirement truth.
  - Query-domain uses the same projection for candidate action display, but
    candidate action display remains downstream of requirements fulfillment
    measurement.
  - CLI summaries do not synthesize retry context or traversal choice.
  - Public rows carry `readOnly: true` or equivalent non-executable disposition.
  - Public rows expose `choosesNextTraversal: false` unless the actual runner has admitted an executable intent.
  - Public action refs are refs to published action catalog/evaluator rows, not fabricated read-model ids.
  - Priority policy refs/digests are visible when ranking is displayed.
  - A negative test proves a public surface cannot mark a requirement fulfilled
    only because a requirement document contains that requirement id.
  - A positive test proves unresolved requirement obligations remain visible as
    carried-forward fulfillment pressure after requirement-surface generation.
  - A negative test proves changing local lexical/status order cannot change public ranking when evaluator projection is unchanged.
  - A negative test proves a public gaps candidate cannot be fed directly into runner invocation without admitted intent.
proof_surface:
  - build_tenants/typescript/test_env/tests/test_t139_public_gaps_read_only_evaluator_view.test.mjs
  - npm run test:t139
  - focused CLI/gaps JSON fixtures showing evaluator refs and read-only disposition
non_closure_conditions:
  - `gaps` computes a separate local sort or priority law.
  - `gaps` computes separate local requirement fulfillment or closure truth.
  - A public surface treats requirement-document presence or marker echo as
    requirement fulfillment.
  - Requirement obligations, fulfillment counts, evidence refs, or open reason
    refs are absent from the public measurement surface.
  - `nextLawfulActions` is treated as executable traversal authority.
  - Public gaps fabricates action/catalog refs instead of projecting published/evaluator refs.
  - CLI command code owns retry or re-entry control.
  - RC/live-status summaries disagree with evaluator/closure truth.
---

# T-139: Consolidate Public Gaps As Read-Only Requirements-Fulfillment Evaluator View

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

Change-class note: this is a realization refactor only under the T-109 design
surface. This ticket cannot close until T-109 ratifies public gaps as read-only
evaluator view.

The product rule is settled: gaps is a read-only interface over the evaluator.
The evaluator's public purpose is not a next-action menu. Its primary purpose
is to track and measure fulfillment of requirements against observed workspace
truth. Next action is a derived consequence after obligation binding,
evidence admission, fulfillment measurement, and closure disposition.

This ticket makes public surfaces obey that rule.

## Primary Purpose

T-139 owns the public requirements-fulfillment measurement surface.

The public loop is:

```text
observed workspace truth
-> requirement obligations and target bindings
-> admitted evidence and worksite records
-> SdlcEdgeFulfillmentLedger counts
-> SdlcEdgeClosureDecision
-> read-only evaluator view
-> optional candidate action display
```

The first-class public questions are:

- Which requirements are in scope?
- Which requirement obligations are fulfilled, partial, blocked,
  unfulfilled, missing, or extra?
- What evidence backs each status?
- Which obligations carry forward?
- What closure disposition follows from the ledger?
- What candidate action does the evaluator show as a consequence, if any?

If a surface answers only "what action is next" without the fulfillment
measurement that produced the action, it fails this ticket.

## Migration Declaration

- migration strategy: `inside_out_hard_break`
- old truth path: gaps/query-domain/live-status/CLI summaries derive local
  requirement status, local ranking, local `nextLawfulActions`, fabricated
  action refs, or executable traversal hints.
- new truth path: public surfaces render requirements-fulfillment measurement
  from the T-109/T-135 consequence carriers and evaluator projection as
  read-only rows.
- old producers: query-domain local sorting, gaps action-list builders, CLI
  summary synthesis, RC/live-status local projection code, marker-echo
  requirement status inference.
- new producers: admitted obligation assessments, `SdlcEdgeFulfillmentLedger`,
  `SdlcEdgeClosureDecision`, evaluator projection, target binding, visible
  policy refs, published action catalog refs.
- old consumers: CLI users, live harnesses, RC reports, operator summaries,
  downstream automation reading `nextLawfulActions`.
- new consumers: CLI/rendering only, public gaps read-only JSON, RC/live-status
  summaries derived from fulfillment/evaluator refs.
- projections/proof surfaces: gaps JSON, query-domain output, CLI output,
  live-status/RC summaries, read-only evaluator tests.
- migration closure: public surfaces can display candidate actions but cannot
  fabricate requirement status, rank, or execute traversal truth.

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old/new behavior are removed or repriced
- [x] recurring realization patterns are checked against existing library/commonization surfaces
- [x] ticket declares library usage and names the governing library or rationale
- [x] if the work exists in more than one build tenant, this backlog/active ticket carries only one tenant lifecycle and any sibling tenant work lives on its own suffixed ticket
- [x] ticket wording, product wording, and proof claims are reconciled before closure

## Functional Review Criteria

- [x] Gaps/query-domain/CLI outputs derive requirements fulfillment from the
      T-109/T-135 consequence surface.
- [x] Public rows identify their evaluator/closure/ledger/target-binding source
      refs.
- [x] Public rows expose requirement obligation ids, status, evidence refs,
      open reasons, and carry-forward pressure.
- [x] Public outputs are read-only and non-executable by construction.
- [x] Requirement-document presence and `REQ-*` marker echo cannot satisfy a
      public fulfillment row.
- [x] Local lexical/status sorting cannot alter ranking.
- [x] Public action refs are projected catalog/evaluator refs, not fabricated
      read-model ids.

## Impacted Interface Review Checklist

- [x] `projection/query_domain.ts`: no local ranking law or fabricated action
      authority.
- [x] `spec_method/entry.ts`: gaps output preserves read-only evaluator refs and
      prints fulfillment summary before candidate action.
- [x] `cli/main.ts`: delegates to Spec Method serialization; it does not
      synthesize retry or traversal choice.
- [x] RC report/live status: RC qualification names the T-139 public
      requirements-fulfillment proof lane.
- [x] tests/fixtures: legacy `nextLawfulActions` expectations are repriced to
      read-only candidate display where needed.

## Required Break Order

1. Inventory public surfaces that expose next-action/candidate/ranking data.
2. Publish/consume evaluator projection as the one read-model source.
3. Break local ranking/action-ref fabrication in gaps/query-domain.
4. Rebind CLI, live status, and RC reports to the evaluator projection.
5. Reprice tests that treated public gaps as executable authority.

## Break-To-Closure Map

- Breaking local ranking closes the one-public-evaluator-surface clause.
- Breaking fabricated action refs closes the published-action-ref clause.
- Rebinding CLI/live/RC summaries closes the public consumer clause.

## Mixed-State Negative Proof

At least one test must make old local ranking disagree with evaluator ranking.
The public output must follow evaluator truth or fail closed; local ranking must
not win.

## Boundary

Public gaps may show:

- requirement obligations
- fulfillment counts
- fulfilled, partial, blocked, unfulfilled, missing, and extra statuses
- requirement evidence refs and open reason refs
- carry-forward requirement pressure
- edge fulfillment ledger refs
- current closure disposition
- target obligation bindings
- candidate action refs
- ranking reasons
- yield/resume state
- block/reprice reasons

Public gaps may not:

- append events
- admit intent
- invoke workers
- decide traversal
- decide requirement fulfillment from local document scans
- collapse requirement-surface creation into requirement fulfillment
- invent action refs
- compute a separate ranking law

## Measurement Contract

The public measurement contract is:

```text
RequirementFulfillmentPublicRow =
  requirement obligation ref
  + source/evidence refs
  + fulfillment status
  + open reason refs
  + carry-forward flag
  + ledger / closure / evaluator source refs
  + readOnly=true
  + choosesNextTraversal=false
```

`RequirementFulfillmentPublicRow` is a derived projection over
`SdlcEdgeFulfillmentLedger`, `SdlcEdgeClosureDecision`, and evaluator source
refs. It is not a new ledger, not requirement authority, and not an executable
action selector. If an edge has not yet produced T-135 consequence truth, the
row may project source requirement closure/carry-forward truth as read-only
pressure, but it must mark that projection as measurement input rather than
closure proof.

Rows may include candidate action refs, but those refs are explanatory. They
are not commands. They become executable only after the runner admits a
construction intent through the T-135 spine.

## Implementation Evidence - 2026-05-10

The read-only requirements-fulfillment evaluator view is implemented.

Verified current state:

- `build_tenants/typescript/code/src/projection/query_domain.ts` derives gap
  dossier ranking through `deriveOddSdlcEvaluateNextReport`, marks dossiers
  `readOnly: true`, `choosesNextTraversal: false`, and
  `rankingAuthority: abiogenesis_construction_priority_projection`.
- `build_tenants/typescript/code/src/projection/query_domain.ts` now publishes
  `SdlcRequirementFulfillmentPublicProjection` and
  `SdlcRequirementFulfillmentPublicRow` over requirement closure truth, and can
  project rows from T-135 `SdlcEdgeFulfillmentLedger`,
  `SdlcEdgeClosureDecision`, and `SdlcNextActionProjection` refs. The public
  projection exposes `edgeFulfillmentCounts`, `edgeClosureDisposition`,
  ledger refs, closure refs, evaluator refs, explicit A4a function-source
  attribution, and `archiveRehydration` disposition when attempted-run
  consequence truth exists.
- `deriveSdlcGapDossier` carries `requirementFulfillment` before
  `nextLawfulActions`, keeping candidate action display downstream of
  measurement.
- `build_tenants/typescript/code/src/spec_method/entry.ts` rehydrates the
  newest installed operator archive that contains T-135
  `sdlc_edge_fulfillment_ledger.json`,
  `sdlc_edge_closure_decision.json`, and `sdlc_next_action_projection.json`,
  then threads that consequence-backed requirement fulfillment projection into
  `gaps` payloads. If no attempted-run consequence archive exists, gaps falls
  back to read-only ingress pressure with a typed `archiveRehydration`
  disposition instead of silent fall-through.
- `build_tenants/typescript/code/src/spec_method/entry.ts` compact output
  reports requirement unresolved/total counts before next action and prints
  `read_only: true` plus `chooses_next_traversal: false`.
- `build_tenants/typescript/code/src/qualification/rc_qualification.ts` names
  `npm run test:t139` as the public requirements-fulfillment gaps proof.
- `build_tenants/typescript/package.json` exposes `npm run test:t139`.
- `build_tenants/typescript/test_env/tests/test_t129_abg37_evaluator_substrate.test.mjs`
  proves public gap dossier default graph-following and priority override both
  come from the ABG evaluator projection.
- `build_tenants/typescript/test_env/tests/test_t032_query_gap_projection.test.mjs`
  proves query-domain/gaps projections are read-only and emit no runtime events.
- `build_tenants/typescript/test_env/tests/test_t058_spec_method_entrypoint.test.mjs`
  proves Spec Method gaps remains read-only and does not own retry/control
  authority.
- `build_tenants/typescript/test_env/tests/test_t139_public_gaps_read_only_evaluator_view.test.mjs`
  directly proves the public fulfillment rows, constructor convergence, T-135
  ledger/closure/evaluator ref bridge, production Spec Method gaps archive
  rehydration, incomplete-archive disposition, and read-only non-executable
  compact output.

Verification:

```bash
npm run test:t139
# 7/7 passed

npm run test:t038
# 4/4 passed

npm run test:t140
# 5/5 passed

npm run test:t032
# 4/4 passed

npm run test:t058
# 8/8 passed

npm run lint:semantic
# passed

npm run test:semantic
# 332/332 passed
```

Closure note: closed as the public read-only requirements-fulfillment evaluator
view. T-140 separately retired old forced-iteration cleanup after this closure.
