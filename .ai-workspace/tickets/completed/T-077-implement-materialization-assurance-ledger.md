---
id: T-077
title: Implement materialization assurance ledger
type: feature
ticket_category: rc_blocker
status: completed
completion_type: implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Implement the materialization assurance ledger as an explicit odd_sdlc GTL graph asset and graph function so product file realization is assessed as typed traversal truth before the total transition function can close or re-enter an edge.
change_class: realization_refactor
re_entry_point: code_and_proof
affected_boundary: GTL graph-function catalog, materialized product file manifest, worker result admission, postflight evaluation, traversal satisfaction fold
priority: critical
triaged_at: 2026-04-27T16:24:29Z
created_at: 2026-04-27T16:24:29Z
updated_at: 2026-04-27T16:47:50Z
completed_at: 2026-04-27T16:47:50Z
dependencies:
  - T-066
  - T-076
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
active_design_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
active_module_refs:
  - build_tenants/typescript/code/src/graph/
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/hooks/
non_scope:
  - ABG engine changes
  - product-local retry runner
  - behavioral test adequacy
---

## Triage

First missing layer: realization refactor.

The product and design already require generated product artifacts to be
admitted as traversal surfaces. This ticket implements one ledger dimension
over that active design. It does not change ABG. ABG consumes the resulting
event and gap truth; odd_sdlc owns the materialization meaning.

## Ledger Contract

`MaterializationAssuranceLedger` evaluates whether the traversal result
materialized the declared product surface.

Inputs:

- graph function identity
- edge traversal contract
- worker result report
- allowed tenant root
- materialized file manifest
- output surface digest evidence
- deterministic postflight result

Outputs:

- `satisfied`
- `open_gap`
- `blocked`
- `reprice_required`
- `not_applicable`

The ledger must preserve the file path basis, declared output root, digest
coverage, missing files, disallowed files, and report/schema defects as typed
ledger evidence.

## Validation Tests

- accepts a valid tenant-root-relative file manifest with matching files and
  digests
- rejects workspace-relative paths when tenant-root-relative paths are required
- rejects an output markdown surface with no product file manifestation when
  the edge declares product materialization
- rejects files outside the allowed tenant root
- classifies missing report fields as `blocked`, not `satisfied`
- emits machine-readable reasons that can be folded by T-084

## Closure Law

This ticket closes only when the ledger is graph-catalog visible, has
deterministic unit tests, and T-084 can consume its output without ad hoc
string parsing.

## Completion Evidence

- `build_tenants/typescript/code/src/assurance/materialization.ts`
- `build_tenants/typescript/code/src/graph/library.ts`
- `build_tenants/typescript/test_env/tests/test_t077_t083_assurance_ledgers.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t084_assurance_ledger_composition.test.mjs`
- `npm run test:t077-t083` passed
- `npm run test:t084` passed
- `npm run test:semantic` passed: 97 tests
