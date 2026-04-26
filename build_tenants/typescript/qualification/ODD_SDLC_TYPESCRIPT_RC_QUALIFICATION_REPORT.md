# odd_sdlc TypeScript RC Qualification Report

**Status**: Active
**Date**: 2026-04-26
**Implements**: REQ-F-ODDSDLC-024, REQ-F-ODDSDLC-040, REQ-F-ODDSDLC-041, REQ-F-ODDSDLC-043
**Derives From**: `specification/requirements/13-odd-sdlc-typescript-tenant.md`, `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`, `.ai-workspace/tickets/completed/T-038-qualify-odd-sdlc-typescript-rc-against-python-functionality-and-odd-scenarios.md`

## Verdict

The TypeScript tenant is RC-qualified for a bounded ODD-native package claim.

That claim includes strict build, graph publication, pure workspace ingress,
read/query projections, public ABG handoff, hook contracts, traceability
closure, triage routing, operational command/result projection, and a composed
harnessed scenario proof.

That claim does not replace the Python tenant as a side-effecting installed
workspace application. It does not claim live external `F_P` generation over the
`data_mapper` workspace. It does not claim release-cut packaging or binary
distribution.

## Gate Results

- `npm run test:t038`: proves the composed harnessed sandbox path across
  ingress, query/start, hook evidence, requirement closure, triage route, build
  result admission, and runtime-return observation.
- `npm run test:semantic`: proves the full required TypeScript semantic lane.
- `npm run lint:semantic`: proves the strict lint lane.
- `npm run test:reference:data-mapper` with
  `ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT=/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template`:
  proves optional local comparison against the full data_mapper fixture.

## Python Comparison

Install and normalize:

- Python owns side-effecting install and workspace normalization.
- TypeScript owns pure ingress, source-input admission, project constraints,
  imported requirement authority, and bootstrap lineage.
- Status: partial by design for the bounded RC claim.

Start:

- Python owns installed-workspace public start.
- TypeScript admits one public boundary, resolves graph-function and asset
  targets, constructs an ABG `ExecutionBasis`, requires worker attachment for
  `F_P`, and refuses tenant-local continuation.
- Status: bounded parity.

Gaps and query:

- Python owns query, gap dossier, and span analysis read models.
- TypeScript publishes read-only query, gap, dossier, span, start-target, and
  ownership surfaces from admitted module and ABG replay truth.
- Status: bounded parity.

Triage:

- Python owns broad triage and homeostatic loop behavior.
- TypeScript splits observation, classification, route binding, repricing
  proposal, ticket work-item route, and loopback retirement. Ticket writing
  remains under `TICKET_METHOD`, not hidden triage code.
- Status: bounded parity.

Constructors and evaluators:

- Python owns real asset generation and deterministic checks.
- TypeScript owns hook contracts, preflight/postflight `F_D`, `F_P` work-report
  admission, generated-asset authority, and ambiguity preservation.
- Status: bounded parity for harnessed proof. Live external worker generation is
  outside this RC claim.

Traceability:

- Python owns traceability indexes, reports, and requirement closure.
- TypeScript owns lineage ledger, closure register, and repair frontier.
  Trace-only proof remains partial and unresolved requirements remain active
  pressure.
- Status: bounded parity.

Operational return:

- Python owns cooperative operational dispatch.
- TypeScript owns capability-gated command surfaces, returned result admission,
  operational state projection, and runtime-return observation feeding retrofit
  graph functions.
- Status: bounded parity.

Release:

- Python can produce operational release and run evidence inside installed
  workspaces.
- TypeScript publishes `prepare_release_surface` and operational graph
  functions, but does not claim release-cut packaging or binary distribution.
- Status: partial by design for the bounded RC claim.

## Remaining Gap Ticket

The future full Python-replacement RC claim is tracked by:

- `.ai-workspace/tickets/backlog/T-041-realize-typescript-full-operational-python-replacement-rc-lane.md`

That ticket owns the side-effecting install/normalize adapter, public CLI
surface, live `F_P` data_mapper generation lane, release-cut packaging, and
postmortem archive comparison needed before TypeScript can replace Python as
the operational tenant.
