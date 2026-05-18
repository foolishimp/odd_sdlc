# T-102 Define Typed F_P Function Stages And ABG-Owned Admission Flow

- id: T-102
- type: bug
- ticket_category: ordinary
- status: completed
- goal: typescript-rc-fp-worker-coverage
- change_intent: implement the typed `F_P.fn` process model so constructive worker calls, evaluation, event emission, ledger projection, and closure are not collapsed into one worker-report contract
- change_class: requirement_reprice
- re_entry_point: requirements
- triaged_at: 2026-04-30
- created_at: 2026-04-30
- reopened_at: 2026-05-18
- closed_at: 2026-05-18
- updated_at: 2026-05-18
- priority: high
- build_tenant: typescript
- review_status: closed_stdo_single_surface_no_debt
- governing_requirements: `specification/requirements/18-typed-construction-algebra.md`
- governing_design: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md`
- live_proof_workspace: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test81.TS.cl`
- accepted_live_archive: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test81.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T093751760Z_pid4465`

## STDO Triage

First missing layer: requirements.

The original defect was not a local prompt bug. TypeScript had collapsed
`F_P.transform`, admission, evaluation, event emission, ledger projection, and
closure into a worker-report convention. That let the worker appear to own
ledger, result-report, evaluator, and closure truth.

The lawful re-entry point is `requirement_reprice`. The implementation descends
through the full STDO stack:

- Requirements: REQ-F-ODDSDLC-074..079 define the construction algebra.
- Design: the deterministic traversal state-machine design carries the algebra
  into the TypeScript runtime boundary.
- TypeScript realization: the installed operator, handoff, postflight,
  blocking-reason, replay, and carrier-admission code implement the typed stage
  split and fold law.
- Proof: deterministic tests and the accepted `data_mapper.test81.TS.cl` archive
  prove the construction algebra computationally and axiomatically.

## Single Surface

The T-102 authority surface is singular:

```text
REQ-F-ODDSDLC-074..079
  -> deterministic traversal design
  -> fp_transform_result.json + fp_evaluate_result.json
  -> ABG/runtime events, ledgers, fold, next action
```

`worker_result_report.json` is not an authority surface. It is archived only as
`projectionRole: "typed_fp_stage_projection"` and must cite
`authoritativeStageResultRef` resolving to the same archive's
`fp_evaluate_result.json`. It is not closure authority, not evaluator authority,
not a second report contract, and not deferred debt for another ticket.

## Implemented Requirements

- REQ-F-ODDSDLC-074: construction stages remain typed and separated.
- REQ-F-ODDSDLC-075: continuation follows fold disposition and vector relation.
- REQ-F-ODDSDLC-076: evidence admission does not imply closure.
- REQ-F-ODDSDLC-077: execution evidence stays on execution-result edges.
- REQ-F-ODDSDLC-078: edge permission constrains construction scope.
- REQ-F-ODDSDLC-079: construction algebra is proven by an axiomatic sweep.

## Implemented Runtime

- `handoff.ts` keeps evaluator, result-report, ledger, runtime-event,
  postflight, and closure work out of the `F_P.transform` prompt and
  worker-facing construction obligations.
- `handoff.ts` writes `fp_transform_result.json` and `fp_evaluate_result.json`
  as the governing stage carriers.
- `handoff.ts` marks any archived `worker_result_report.json` as a
  `typed_fp_stage_projection` over the typed stage result.
- `handoff.ts` fails report admission closed when the projection role is absent,
  wrong, or cites an evaluator file outside the current archive.
- `installed_operator.ts` carries `fp_evaluate_result.json` into
  `sdlc_edge_fulfillment_ledger.json` admission and predecessor refs; the
  transform result remains transform/output evidence and does not stand in for
  evaluation.
- `installed_operator.ts` normalizes `close` plus same-vector continuation away
  from same-edge retry and falls through to overlay continuation or terminal
  close.
- `spec_method/entry.ts` replays the latest admitted same-overlay successor and
  the just-admitted next-action projection before falling back to archive state.
- `installed_operator.ts`, `blocking_reason.ts`, and `retry_forensics.ts` type
  output-token limit failures as same-edge retry or repair pressure.
- `handoff.ts` keeps compile, discovery, and test non-zero exits inside the
  execution-result edge until success or a hard blocker.
- `handoff.ts` admits execution-repair scoped tenant source/test/build edits only
  for execution-result edges.
- `handoff.ts` preserves current observed product bytes and digests over stale
  replay manifest bytes while retaining replay lineage.
- `handoff.ts` enforces role-sensitive product lineage: source/test product
  files carry requirement lineage; declared auxiliary build/tool config remains
  admissible without pretending content closure.

## Attached data_mapper.test81 Fixes

Captured by REQ-F-ODDSDLC-074..079:

- all-edge transform/evaluator separation
- post-close continuation and archive/live re-entry law
- execution-result edge containment
- evidence/admission separation
- replay/current materialization precedence
- role-sensitive product lineage
- output-limit same-edge retry classification

Associated carrier-admission fixes retained under this ticket:

- design-depth carrier normalization for module refs, state diagrams, stack
  profile rows, aggregate model rows, sunny-day rows, file-target rows, component
  realization rows, shorthand verdict axes, and partial register envelopes
- component-depth normalization of boolean `publicBoundary` values
- design-completeness distinction between structural carrier absence and
  admitted content-gap assurance evidence
- prompt-budget/carrier compression for large artifact and bounded test-design
  workers as implementation support for the output-limit regression

## Proof Surfaces

- `test_t066_product_materialization_contract.test.mjs`
  - all published edge transform prompts exclude evaluator work
  - construction algebra sweep maps dispositions to next-action law
  - construction algebra sweep preserves vector relation law
  - construction algebra sweep separates evidence admission from edge permission
  - stale replay/current bytes and auxiliary build config lineage regressions
  - execution-repair containment regressions
- `test_t058_spec_method_entrypoint.test.mjs`
  - closed graph-function targets resume archived post-close successors
  - later same-overlay successors are selected on re-entry
- `test_t064_installed_operator_ux.test.mjs`
  - output-limit failures stay inside same-edge retry law
  - transform-only output archives only a typed stage projection report
  - same-archive projection admission fails closed for missing, wrong, or
    mismatched typed-stage citations
  - edge fulfillment ledger cites `fp_evaluate_result.json` as the evaluation
    fact and does not admit `fp_transform_result.json` as that fact
- `test_t089_traversal_pressure_enforcement.test.mjs`
  - early non-materializing edges keep evaluator contracts separate from
    transform obligations
- `test_t113_component_depth_register_admission.test.mjs`
  - boolean `publicBoundary` normalization
- `test_t122_feature_scope_closure.test.mjs`
  - design-depth carrier normalization for live-run shorthand shapes

## Live Proof

Accepted archive:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test81.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T093751760Z_pid4465`

Observed summary:

- `graphFunctionName`: `prepare_release_surface`
- `status`: `converged`
- `blockingReason`: `null`
- `blockingReasons`: `[]`
- `nextLawfulAction`: `disposition://close`

The live proof closes T-102's construction-stage authority defect. T-171 remains
the broader full test35 parity/refactor lane; it is not a deferral for T-102's
typed stage authority.

## Verification

- `npm run build:semantic` passed.
- focused T-064 T-102 projection/output-limit lane passed `3/3`.
- `test_t064_installed_operator_ux.test.mjs` passed `14/14`.
- `test_t066_product_materialization_contract.test.mjs` passed `85/85`.
- focused T-093/T-101 installed retry/schedule lane passed `4/4`.
- `npm run lint:semantic` passed.
- `npm run lint:test-harness` passed.
- `npm run test:semantic` passed `631/631`.
- `git diff --check` passed.

## Closure

T-102 is closed under STDO with one implementation surface and no T-102 tech
debt. The typed F_P stage carriers are the authoritative runtime surface. The
worker report is a derived projection only.
