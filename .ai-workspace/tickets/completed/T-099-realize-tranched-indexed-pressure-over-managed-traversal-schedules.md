# T-099 — Realize Tranched Indexed Pressure Over Managed Traversal Schedules

status: completed
priority: high
change_class: product_reprice
re_entry_point: product
created: 2026-04-28
completed: 2026-04-28T15:16:56Z
owner: codex

## Claim

Managed traversal needs dependency-ordered tranches and indexed pressure.

The assurance ledgers make the problem decomposable: modules, requirements,
tests, evidence, and gaps can be grouped into lawful work tranches. The worker
does not need every authority document and every obligation payload inlined into
one giant prompt. It needs full authority by reference, plus the targeted local
slice for the current traversal.

## First Missing Layer

Product.

`odd_sdlc` already has schedule/work-plan surfaces through T-093. The product
definition did not yet say that schedules can be dependency graphs over
tranches, nor that prompt pressure should be indexed rather than fully copied.

## Method Authority

- `SPEC_METHOD.md`: product and requirements own current product truth.
- `TICKET_METHOD.md`: this ticket records the product re-entry before design
  and code changes.
- `DESIGN_MODULE_METHOD.md`: tranche and pressure carriers must be prime
  surfaces, not hidden helper loops.
- `ODD_METHOD.md`: tranches and indexed pressure must remain graph/product
  assets over ABG runtime truth, not imperative orchestration.

## Trigger

Fresh external `data_mapper.test55.ts` run reached the test archive edge in one
autonomous `start --until blocked` loop. It also exposed two scaling facts:

- the test-module prompt was about 361 KB because pressure was copied into the
  prompt
- ledgers and module surfaces now provide enough structure to split work by
  module/dependency tranche

## Target Truth

Schedule surfaces can carry:

- `module_dependency_graph`
- `realization_tranches` or `test_tranches`
- `tranche_obligation_ledger`
- `tranche_gap_ledger`
- `next_tranche_selector`

Prompt-bearing handoffs carry:

- complete archived authority in `handoff_manifest.json`
- complete traversal intent package in `traversal_intent_package.json`
- compact prompt pressure projection with authority index, tranche keys,
  targeted inline obligations, retrieval hints, and omitted-obligation count

## Closure Bar

This ticket closes only when product, requirements, design, implementation, and
tests prove that schedule surfaces can express dependency tranches and prompt
handoffs expose indexed pressure instead of requiring fully inlined authority.

External proof may be a successor `data_mapper.testNN.ts` run showing reduced
prompt pressure and schedule/tranche references in the live archive.

## Closure Evidence

Implemented product, requirement, design, carrier, handoff, and test support
for dependency tranches and indexed prompt pressure.

Changed authority surfaces:

- `specification/PRODUCT.md`
- `specification/requirements/15-odd-sdlc-scheduling-phase.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SCHEDULING_PHASE.md`

Changed realization surfaces:

- `build_tenants/typescript/code/src/operator/carriers.ts`
- `build_tenants/typescript/code/src/operator/handoff.ts`
- `build_tenants/typescript/test_env/tests/test_t099_tranched_indexed_pressure.test.mjs`
- `build_tenants/typescript/package.json`

The handoff now carries:

- `authorityIndex`
- `trancheKeys`
- `retrievalHints`
- targeted inline obligations
- omitted-obligation count
- full manifest and traversal-intent package references

The prompt projection explicitly states that it is compact pressure, not a
replacement for the manifest or traversal intent package.

Verification:

- `npm run test:t099`: passed, 2 tests.
- `npm run test:t088`: passed, 2 tests.
- `npm run test:t091`: passed, 4 tests.
- `npm run test:t093`: passed, 2 tests.
- `npm run test:semantic`: passed, 137 tests.
- `npm run lint:semantic`: passed.

External live evidence:

- workspace:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test55.ts`
- pre-fix rejected prompt:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T144014538Z_pid36703/worker_prompt.md`
- post-fix retry prompt:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T150145425Z_pid89422/worker_prompt.md`

Observed prompt-size reduction:

```text
354222 bytes -> 56645 bytes
```

The retry prompt includes an authority index, module/test tranche keys, prior
gap keys, retrieval hints, and references to the full handoff manifest and
traversal intent package instead of copying the whole authority surface into
the prompt body.
