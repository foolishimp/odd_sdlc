---
id: B-048
title: Close B-040 residual embedded open payload fields in the public-start carrier family
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: finish-residual-public-start-carrier-closure-after-b-040
change_intent: B-040 closed the main public-start carrier seams, but it explicitly left seven embedded open payload fields inside the carrier family as latent debt. This ticket closes those residual fields or explicitly demotes them to named foreign boundaries so the public-start family no longer relies on typed envelopes over open payload truth.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: `build_tenants/python/code/odd_sdlc/public_start_contract.py`, downstream consumers in `public_start.py`, `query_contract.py`, and related projections still carrying embedded `dict[str, object]` / `list[dict[str, object]]` subordinate payloads inside the B-040 carrier family
priority: medium
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-24
dependencies: B-040 completed
intake_source: B-040 second-closure review and Claude gap analysis on 2026-04-23
target_truth: the public-start carrier family uses closed subordinate payload carriers or one explicitly named foreign-boundary collapse at ingress. No authoritative or downstream public-start carrier field remains as a semantic `dict[str, object]` or `list[dict[str, object]]`.
superseded_truth: B-040 closed the main carrier family but left these embedded open payload fields:
  - `ObservationProjection.evidence`
  - `TriageProjection.evidence`
  - `resolved_policy`
  - `YieldedStartResult.prompt_compactions`
  - `YieldedStartResult.published_ledger_ref`
  - `YieldedStartResult.fulfillment_assessments`
  - `QueryDomainPayload.assets`
closure_law: this migration closes only when each residual embedded field is either (1) closed into a typed subordinate payload carrier, or (2) explicitly marked as a named foreign-boundary collapse point with one parse/normalize step at ingress. Typed envelopes over open payload truth are not lawful closure.
evaluation_criteria:
  - each residual field has one explicit owner decision: typed subordinate payload or named foreign boundary
  - public-start and query consumers no longer depend on embedded semantic dict/list payloads inside the authoritative carrier family
  - no fragment-class inflation is introduced just to satisfy typing; subordinate payloads stay subordinate
proof_surface:
  - bounded strict typing lane over the residual carrier slice
  - source proof that the seven residual fields are no longer embedded open payloads
  - negative proof that raw embedded dict/list payloads cannot survive ingress silently
non_closure_conditions:
  - closure is claimed while any field in the residual register remains an embedded semantic `dict[str, object]` or `list[dict[str, object]]`
  - typed envelopes remain but the same open payload truth still flows through them unchanged
  - fragment-class inflation is introduced just to satisfy typing convenience
  - closure is claimed without an explicit authoritative-vs-downstream carrier matrix for the residual fields
---

## Residual Register

The current residual fields to close are:

- `ObservationProjection.evidence: list[dict[str, object]]`
- `TriageProjection.evidence: list[dict[str, object]]`
- `resolved_policy: dict[str, object]`
- `YieldedStartResult.prompt_compactions: list[dict[str, object]]`
- `YieldedStartResult.published_ledger_ref: dict[str, object]`
- `YieldedStartResult.fulfillment_assessments: list[dict[str, object]]`
- `QueryDomainPayload.assets: list[dict[str, object]]`

## Owner Decisions

- `ObservationProjection.evidence` -> closed as `EvidenceItemPayload`
- `TriageProjection.evidence` -> closed as `EvidenceItemPayload`
- `resolved_policy` -> admitted once through `admit_resolved_policy_payload()` into `ResolvedPolicyPayload`; nested `GenesisPolicyConcernPayload.config` remains an explicit foreign ABG policy-config bag under a named subcarrier
- `YieldedStartResult.prompt_compactions` -> closed as `PromptCompactionPayload`
- `YieldedStartResult.published_ledger_ref` -> closed as `PublishedFulfillmentLedgerRefPayload`
- `YieldedStartResult.fulfillment_assessments` -> closed as `FulfillmentAssessmentPayload`
- `QueryDomainPayload.assets` -> closed as `AssetProjectionPayload`

## Scope

In scope:

- subordinate payload closure inside the B-040 public-start carrier family
- the downstream projections that consume those residual fields

Out of scope:

- reopening B-040 main seam claims that are already closed
- broad query/plugin or operational-dispatch debt already tracked by B-043

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/08-odd-sdlc-first-slice.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md`
- `specification/scenarios/12-iterative-requirement-closure-and-generated-traceability.md`

This ticket reads current design truth from:

- `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`
- `build_tenants/python/design/START_TARGET_CATALOG_AND_ASSET_OWNERSHIP_INDEX.md`
- `build_tenants/python/design/GAP_ANALYSIS_DOSSIER.md`
- `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`
- `build_tenants/python/design/README.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`

## Migration Declaration

- old_truth_path: the main B-040 carrier family is closed at the top level, but seven subordinate fields remain embedded open dict/list payloads inside the authoritative/downstream carrier family
- new_truth_path: each residual field is either a closed subordinate payload carrier or one named foreign-boundary collapse point parsed once at ingress
- producers_old:
  - `public_start_contract.py`
  - ingress/build helpers in the public-start/query slice
- producers_new:
  - explicit subordinate payload constructors/parsers
  - one named foreign-boundary adapter where justified
- consumers_old:
  - `public_start.py`
  - `query_contract.py`
  - `query.py`
  - related projections consuming embedded dict/list payloads
- consumers_new:
  - the same modules consuming typed subordinate carriers or explicit parsed foreign payloads only
- derived_surfaces:
  - public-start result carriers
  - query-domain payloads
  - dossier/query/operator projections that republish those fields

## Migration Checklist

- [x] every field in the residual register has one explicit owner decision
- [x] producer set for the closed subordinate payload truth is listed
- [x] consumer set for the closed subordinate payload truth is listed
- [x] embedded open payloads are removed or explicitly demoted to one ingress-only foreign boundary
- [x] mixed old/new embedded payload behavior is not accepted as closure evidence
- [x] bounded typing lane, source proofs, and ticket wording are reconciled before closure

## Functional Review Criteria

1. Did each residual field pass the Promotion Test before any new carrier was created?
2. Did the change actually remove embedded open payload truth, or only wrap it more tightly?
3. Is there one parser/constructor per residual field family instead of repeated local narrowing?
4. Do downstream public-start/query consumers read the same subordinate truth directly?
5. Did the migration avoid reopening B-040’s already-closed main seams?

## Evaluator Gate

### 1. Authority Seam Closure

- [x] no residual field remains as authoritative open dict/list truth inside the public-start carrier family
- [x] deleting the subordinate payload parser/constructor causes fail-closed behavior rather than silent dict passthrough
- [x] downstream query/public-start surfaces consume the same admitted subordinate truth directly

### 2. Essential Carrier Consolidation

- [x] new subordinate payload carriers are introduced only where §5B promotion is satisfied
- [x] no fragment-class or one-off TypedDict inflation appears just to make mypy happy
- [x] subordinate payloads remain subordinate to the existing public-start/query family

### 3. Typed Enforcement After Proof

- [x] each residual field is parsed/constructed once before downstream consumption
- [x] no `cast(...)`, `Any`, or dynamic dict mutation is used as fake closure for the residual register
- [x] the bounded strict lane enforces the proved subordinate payload shapes rather than relabeling open payloads

## Residual Payload Role Matrix

| Field | Role | Closure expectation |
| --- | --- | --- |
| `ObservationProjection.evidence` | subordinate payload | typed evidence carrier or one named foreign ingress |
| `TriageProjection.evidence` | subordinate payload | typed evidence carrier or one named foreign ingress |
| `resolved_policy` | subordinate payload | typed policy subcarrier or one named foreign ingress |
| `YieldedStartResult.prompt_compactions` | subordinate payload | typed compaction entries |
| `YieldedStartResult.published_ledger_ref` | subordinate payload | typed ledger-ref carrier |
| `YieldedStartResult.fulfillment_assessments` | subordinate payload | typed fulfillment-assessment entries |
| `QueryDomainPayload.assets` | downstream projection payload | typed asset projection entries |

## Concrete Change Inventory

- [x] `build_tenants/python/code/odd_sdlc/public_start_contract.py`
  - [x] classify each residual field under §5B promotion law
  - [x] replace embedded open dict/list fields with typed subordinate carriers where warranted
- [x] `build_tenants/python/code/odd_sdlc/public_start_subcarriers.py`
  - [x] admit each subordinate payload family once at ingress
  - [x] fail closed on malformed embedded payloads
- [x] `build_tenants/python/code/odd_sdlc/public_start.py`
  - [x] stop constructing residual fields through embedded dict/list passthrough
  - [x] consume subordinate parsers/builders only
- [x] `build_tenants/python/code/odd_sdlc/gap_dossier.py`
  - [x] route observation/triage evidence through the admitted evidence carrier
- [x] `build_tenants/python/code/odd_sdlc/query_contract.py`
  - [x] remove embedded open payload truth from downstream query carrier fields
- [x] `build_tenants/python/code/odd_sdlc/query.py`
  - [x] republish typed subordinate payloads instead of dict/list fragments
- [x] `build_tenants/python/code/odd_sdlc/domain_model.py`
  - [x] publish `AssetProjectionPayload` as the shared downstream asset subcarrier
- [x] proofs
  - [x] bounded mypy lane for the residual slice
  - [x] source proof that each residual field is retired from the register
  - [x] negative proof for raw embedded dict/list rejection

## Impacted Interface Review Checklist

- [x] authoritative carrier declarations are reviewed in `public_start_contract.py`
- [x] `public_start.py` producer/build paths are reviewed for residual dict/list construction
- [x] `query_contract.py` and `query.py` downstream projections are reviewed for residual dict/list publication
- [x] any retained foreign-boundary collapse point is named explicitly and justified in the ticket

## Proof Selector Plan

Structural selectors:

```bash
rg -n '_mapping_value|_mapping_list_value|evidence: list\\[dict\\[str, object\\]\\]|resolved_policy: dict\\[str, object\\]|prompt_compactions: list\\[dict\\[str, object\\]\\]|published_ledger_ref: dict\\[str, object\\]|fulfillment_assessments: list\\[dict\\[str, object\\]\\]|assets: list\\[dict\\[str, object\\]\\]' build_tenants/python/code/odd_sdlc
```

Planned typing selector:

```bash
python -m mypy --config-file mypy.ini \
  -m odd_sdlc.public_start_contract \
  -m odd_sdlc.public_start \
  -m odd_sdlc.query_contract \
  -m odd_sdlc.query \
  -m odd_sdlc.gap_dossier \
  -m odd_sdlc.public_start_subcarriers
```

Planned source selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q \
  -k 'test_b048_public_start_residual_payloads_are_closed or test_b048_query_domain_rejects_embedded_open_payload_fields or test_b048_public_start_residual_register_fails_closed_on_raw_embedded_payloads'
```

## Closure Note

Landed subordinate residual carriers:

- `EvidenceItemPayload`
- `ResolvedPolicyPayload`
- `PromptCompactionPayload`
- `PublishedFulfillmentLedgerRefPayload`
- `FulfillmentAssessmentPayload`
- `AssetProjectionPayload`

Ingress/build closure now happens once in:

- `public_start_subcarriers.py` for evidence, policy, compactions, ledger ref, and fulfillment assessments
- `gap_dossier.py` for observation/triage evidence projection
- `query.py` for downstream asset projection parsing

Proofs used for closure:

- bounded slice mypy:
  - `python -m mypy --config-file mypy.ini -m odd_sdlc.public_start_contract -m odd_sdlc.public_start -m odd_sdlc.query_contract -m odd_sdlc.query -m odd_sdlc.gap_dossier -m odd_sdlc.public_start_subcarriers`
  - `Success: no issues found in 6 source files`
- package strict lane:
  - `python -m mypy --config-file mypy.ini -p odd_sdlc`
  - `Success: no issues found in 50 source files`
- structural selector:
  - no hits
- source selector:
  - `3 passed, 101 deselected`

No live tests were used for this ticket.
