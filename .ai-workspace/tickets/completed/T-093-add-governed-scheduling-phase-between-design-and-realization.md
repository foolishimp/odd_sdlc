# T-093 — Add Governed Scheduling Phase Between Design And Realization

status: completed
priority: high
change_class: product_reprice
re_entry_point: product
created: 2026-04-28
completed: 2026-04-28T15:16:56Z
owner: codex

## Claim

`odd_sdlc` needs a governed scheduling phase between design/module surfaces and
realization execution.

The current TypeScript executive graph can move directly from:

`design -> implementation design -> implementation modules -> code`

and from:

`test design -> test modules -> test run archive`

That is too abrupt for large outside builds such as `data_mapper`. The design
must decompose into an explicit schedule/work-plan surface before worker
synthesis. That schedule must then constrain iteration and execution.

## First Missing Layer

Product.

`specification/PRODUCT.md` currently names the proven bounded subset as
feature decomposition, UAT, design/scenario, bounded implementation recursion,
bounded test recursion, testcase authority, and release preparation. It does
not name a scheduling/work-plan phase as a product facet.

Requirements and design also lack a first-class scheduling asset carrier.

## Method Authority

- `SPEC_METHOD.md`: Product and requirements own current product truth.
- `TICKET_METHOD.md`: this ticket records the re-entry point before code work.
- `DESIGN_MODULE_METHOD.md`: scheduling should emerge from design/module
  structure, preserve traceability, and become evidence for later realization.
- `ODD_METHOD.md`: the schedule must be a graph asset/function carrier, not an
  implicit imperative orchestration loop.

## Observed Trigger

The external `data_mapper.test54.ts` one-shot run proved that the installed
operator can autonomously progress through many graph edges. It also showed the
current chain jumping from implementation module surfaces into code synthesis
without an intervening execution schedule.

The missing scheduling carrier matters because code/test workers need an
ordered work decomposition, dependency order, task acceptance criteria, and
iteration checkpoints, not only a large cumulative prompt.

## Target Product Shape

Add an explicit scheduling phase:

`requirements/design/module surfaces -> schedule/work-plan surface -> execute planned realization edges -> evaluate -> iterate`

The schedule surface should be comparable to a ticket plan or Gantt chart, but
it must remain graph-native:

- planned work packages
- dependency order
- phase gates
- expected output surfaces
- planned worker lanes
- acceptance/evidence checkpoints
- current blocked/open/done state
- re-entry conditions for same-edge deepening

## Required Follow-Up

1. Update product definition to include scheduling as a first-class `odd_sdlc`
   product facet.
2. Add requirements for a schedule/work-plan graph asset and graph function.
3. Add TypeScript design for the scheduling carrier, module boundaries, and
   graph integration.
4. Insert schedule-producing graph functions before code and test
   materialization.
5. Make realization edges consume the admitted schedule surface as an
   obligation source.
6. Add focused tests proving:
   - design/module inputs produce a schedule surface
   - code/test edges require and cite the schedule surface
   - `start --until blocked` preserves autonomous execution over the expanded
     graph
   - the schedule surface can represent blocked/open/done planned work

## Non-Goals

- Do not create a free-form project-management document outside graph state.
- Do not make the schedule a manual operator-only checklist.
- Do not hard-code `data_mapper` tasks into the product graph.
- Do not replace tickets; scheduling is execution planning over design-derived
  work, while tickets remain governance work items.

## Closure Bar

This ticket closes only when the scheduling phase is represented in product,
requirements, design, graph publication, TypeScript implementation, and tests.

External evidence should include a fresh `data_mapper.testNN.ts` run showing
the schedule surface is produced and consumed before realization.

## Closure Evidence

Implemented across product, requirements, design, graph publication, TypeScript
implementation, and tests.

Changed authority surfaces:

- `specification/PRODUCT.md`
- `specification/requirements/15-odd-sdlc-scheduling-phase.md`
- `specification/requirements/README.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SCHEDULING_PHASE.md`

Changed realization surfaces:

- `build_tenants/typescript/code/src/graph/catalog.ts`
- `build_tenants/typescript/code/src/domain/software_domain_catalog.ts`
- `build_tenants/typescript/code/src/hooks/policy.ts`
- `build_tenants/typescript/code/src/index.ts`
- `build_tenants/typescript/test_env/tests/test_t093_scheduling_phase.test.mjs`

The published graph now inserts `derive_realization_schedule_surface` before
`derive_code_surface`, and `derive_test_schedule_surface` before
`derive_test_run_archive_surface`. The code and test archive edges consume the
corresponding schedule surface as a source asset.

Verification:

- `npm run test:t093`: passed, 2 tests.
- `npm run test:semantic`: passed, 137 tests.
- `npm run lint:semantic`: passed.

External live evidence:

- workspace:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test55.ts`
- one-shot command:
  `ODD_SDLC_TS_OUTPUT=json node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex`
- schedule archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T140055338Z_pid36703`
- downstream code archive consuming schedule:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T140523595Z_pid36703`
- test schedule archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T142609613Z_pid36703`
- downstream test archive consuming schedule:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T143553546Z_pid36703`

The live run proved the new schedule edges are not isolated unit-test fixtures:
they are present in the installed graph and are traversed in the autonomous
data_mapper qualification lane.
