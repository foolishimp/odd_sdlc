---
id: T-179
title: Align odd_sdlc with ABIogenesis compute epistemology
type: requirement_alignment
ticket_category: specification_compliance
status: completed
proof_status: carrier_alignment_verified
priority: high
owner: odd_sdlc
build_tenant: typescript
created_at: 2026-05-23
updated_at: 2026-05-23
completed_at: 2026-05-23
triaged_at: 2026-05-23
activated_at: 2026-05-23
goal: make odd_sdlc explicitly compliant with the ABIogenesis RC3 ontology/epistemology split and prove the compliance surface with deterministic tests
change_class: requirement_reprice
re_entry_point: runtime_governance
first_missing_layer: downstream product epistemology over ABG/GTL ontology
governance_scope: STDO Method / ODD Method / odd_sdlc TypeScript tenant / ABIogenesis RC3 compute notation
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/03-runtime-governance.md
  - specification/requirements/18-typed-construction-algebra.md
  - getting_started.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/gtl/REQ-L-GTL3-COMPUTE-NOTATION.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-FN-COMPOSITION.md
  - /Users/jim/src/apps/abiogenesis/specification/PRODUCT.md
related_tickets:
  - .ai-workspace/tickets/completed/T-178-migrate-typescript-tenant-to-abg-3-8-0-rc-3.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-143-define-gtl-compute-notation-types-over-ratified-carriers.md
affected_boundary:
  specification:
    - specification/PRODUCT.md
    - specification/requirements/03-runtime-governance.md
    - specification/requirements/18-typed-construction-algebra.md
    - specification/GOALS.md
  documentation:
    - getting_started.md
    - build_tenants/typescript/code/src/install/instruction_files.ts
  runtime_carriers:
    - build_tenants/typescript/code/src/operator/composition_identity.ts
    - build_tenants/typescript/code/src/operator/carriers.ts
    - build_tenants/typescript/code/src/operator/handoff.ts
    - build_tenants/typescript/code/src/operator/traversal_consequence.ts
    - build_tenants/typescript/code/src/operator/installed_operator.ts
    - build_tenants/typescript/code/src/start/public_start.ts
  tests:
    - build_tenants/typescript/test_env/tests/test_t179_epistemology_compliance.test.mjs
    - build_tenants/typescript/test_env/tests/test_t138_traversal_consequence_replayability.test.mjs
    - build_tenants/typescript/package.json
target_truth: odd_sdlc treats C, transform.C, evaluate.C, and consequence.C as epistemic notation over selected abg.fn_composition and ABG-admitted runtime truth, while odd_sdlc retains product-owned SDLC pressure, gain, closure interpretation, and query/read-model meaning.
superseded_truth: odd_sdlc documentation may imply a product-local ComputeUnit/ReliableCompute carrier, a ledger writer outside ABG admission, or a generic F_P transform/evaluator stage with closure or runtime-truth authority.
closure_law: This ticket closes only when product, requirements, operator guidance, and deterministic tests prove that odd_sdlc preserves the GTL/ABG ontology names, treats compute notation as epistemology only, keeps ABG as owner of event/ledger/projection/fold/traversal/replay truth, and keeps product pressure/query/read-model interpretation in odd_sdlc.
non_closure_conditions:
  - odd_sdlc introduces ComputeUnit, ReliableCompute, or another product-local execution carrier as public law
  - transform.C or F_P.transform is documented as a ledger, event, projection, traversal, or closure writer
  - evaluate.C or F_P.evaluate is documented as a closure authority rather than a finding producer
  - consequence.C is documented as an independent action stage rather than a projection reference over ABG-admitted facts
  - pressure maps or gain interpretation are moved into generic GTL/ABG ontology instead of remaining odd_sdlc product projections
  - tests check only package pinning and do not assert the epistemology boundary
proof_surface:
  static:
    - npm run build:semantic
    - npm run lint:semantic
  focused:
    - npm run test:t179
    - npm run test:t175
  hygiene:
    - git diff --check
---

# T-179: Align odd_sdlc With ABIogenesis Compute Epistemology

## STDO Intake

Smallest lawful re-entry point: `requirement_reprice` at the runtime governance
and typed construction algebra boundary.

Reason: `odd_sdlc.TS` now consumes ABIogenesis `3.8.0-rc.3`, whose active law
defines compute notation as epistemology over the ratified GTL/ABG ontology.
`odd_sdlc` already follows most of the runtime split in implementation, but its
product and operator surfaces still leave room for an agent to infer hidden
product-local compute carriers or ledger writers.

## Required Alignment

1. State that `odd_sdlc` is a downstream product over GTL and ABG ontology.
2. Preserve existing GTL and ABG carrier names instead of introducing a new
   public `ComputeUnit` or `ReliableCompute` carrier.
3. Define `C`, `transform.C`, `evaluate.C`, and `consequence.C` as notation over
   selected `abg.fn_composition` and ABG-admitted truth.
4. Keep ABG ownership explicit for event emission, admission, payload ledgers,
   assurance projection, closure fold, traversal transition, continuation, and
   replay truth.
5. Keep `odd_sdlc` ownership explicit for SDLC edge meaning, pressure maps,
   gain interpretation, proof interpretation, and query/read-model overlays.
6. Add deterministic compliance tests that fail if the documentation or prompt
   boundary regresses.

## Initial Proof Plan

- `npm run build:semantic`
- `npm run test:t179`
- `npm run test:t175`
- `npm run lint:semantic`
- `git diff --check`

## Implementation Pass: 2026-05-23

Completed the downstream epistemology alignment without changing GTL or ABG:

- `specification/PRODUCT.md` now states the ontology/epistemology split:
  GTL owns authored carrier names, ABG owns runtime ontology and admitted truth,
  and `odd_sdlc` owns software-domain meaning and product projections.
- `specification/requirements/03-runtime-governance.md` now carries
  `REQ-F-RUNTIME-006`, making `C`, `transform.C`, `evaluate.C`, and
  `consequence.C` notation over selected `abg.fn_composition`, not new
  execution carriers.
- `specification/requirements/18-typed-construction-algebra.md` now carries the
  selected-composition algebra and `REQ-F-ODDSDLC-084`.
- `specification/GOALS.md` now names selected composition `C` in the current
  computational target.
- `getting_started.md` now teaches the W/L/E/Ev/C algebra and states that
  ledgers/events/projections/fold truth are ABG-owned while pressure/query
  views are product read models.
- `test_t179_epistemology_compliance.test.mjs` proves the definition surfaces
  and checks that the live `F_P.transform` prompt remains inside transform
  authority without evaluator, ledger, projection, or closure file refs.
- `package.json` now exposes `npm run test:t179`.

## Closure Proof: 2026-05-23

Passed:

- `npm run test:t179`
- `npm run test:t175`
- `npm run lint:semantic`
- `npm run lint:test-harness`
- `git diff --check`

`npm run test:t179` includes `npm run build:semantic` and passed four focused
tests:

- product surface declares SDLC epistemology over ABG ontology
- requirements make the notation non-authoritative and ABG-owned
- operator guide teaches C notation without hiding ledgers in plugins
- `F_P.transform` prompt stays inside `transform.C` authority

## Corrective Carrier Alignment Pass: 2026-05-23

Independent review found that the first closure pass aligned documentation but
did not carry selected `abg.fn_composition` identity through the live
evaluation, admitted-state, and consequence carriers required by ABIogenesis
T-143.

Resolved:

- added `SdlcSelectedAbgFnCompositionIdentity` as odd_sdlc notation over the
  existing selected `abg.fn_composition` identity;
- threaded `compositionRef`, `compositionDigest`, and
  `compositionSelectionRef` through `SdlcFpEvaluateResult`,
  `SdlcEdgeFulfillmentLedger`, `SdlcEdgeClosureDecision`,
  `SdlcNextActionProjection`, `SdlcInstalledOperatorTraversalConsequence`, and
  traversal replay refs;
- shaped `SdlcFpEvaluateResult` as `evaluate.C` notation by adding
  T-143-compatible `GtlEvaluation` and `GtlEvaluationFindingRef` projections;
- added top-level `GtlAdmittedStateRef` and `GtlConsequenceProjectionRef`
  surfaces to installed traversal consequences and archive output;
- updated installed cold-agent guidance so `C`, `transform.C`, `evaluate.C`,
  `consequence.C`, and selected composition identity are present in generated
  `AGENTS.md`/`CLAUDE.md`; and
- strengthened T-179 tests so they construct runtime carriers and fail if the
  selected composition identity is absent.

Corrective proof:

- `npm run test:t179` - 6/6 passed
- `node --test test_env/tests/test_t138_traversal_consequence_replayability.test.mjs` - 8/8 passed
- `npm run test:t175` - 17/17 passed
- `npm run build:semantic`
- `npm run lint:semantic`
- `git diff --check`
