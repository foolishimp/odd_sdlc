# STDO Audit: Assurance Ledger Wave

**Scope**: TypeScript assurance-ledger work T-077 through T-084, its design
trace, graph-function publication, unit proof, and integration with T-076.

**Verdict**: Partially conformant. The implementation is directionally correct
and materially improves the total transition model, but the completed ticket
claims are wider than the implemented validation surface. The slice should be
treated as a first deterministic carrier/fold implementation, not as full
assurance-ledger RC depth.

## STDO Checks

### S: Specification Authority

The work has valid requirement authority:

- graph functions are the primary constructive carrier:
  `specification/requirements/02-graph-functions.md`
- edge contracts, F_D/F_P/F_H separation, and postflight truth are governed by:
  `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- installed operator and worker result ingestion are governed by:
  `specification/requirements/14-odd-sdlc-installed-product-contract.md`
- TypeScript must use GTL graph functions and ABG truth, not a Python-shaped
  hidden controller:
  `specification/requirements/13-odd-sdlc-typescript-tenant.md`

No ABG engine change was introduced by this wave. That matches the current
decision that assurance ledgers are `odd_sdlc` domain truth consumed by the
transition model, while ABG owns traversal/runtime truth.

### T: Ticket Governance

T-077 through T-084 carry STDO metadata, active design refs, dependencies, and
completion evidence. They are now in `completed/`.

The main ticket-governance defect is that several completed tickets list
validation obligations that are not yet implemented or tested. That creates
closure ambiguity for T-066/T-076 if they cite these completed tickets as full
assurance proof.

T-085 has been opened to close that claim/evidence gap before the assurance
stack is used as RC proof.

### D: Design Module Method

What landed well:

- assurance carrier truth is concentrated in
  `build_tenants/typescript/code/src/assurance/carriers.ts`
- each assurance dimension is a small prime module under
  `build_tenants/typescript/code/src/assurance/`
- fold logic is isolated in
  `build_tenants/typescript/code/src/assurance/fold.ts`
- graph-function publication is visible in
  `build_tenants/typescript/code/src/graph/library.ts`
- the design pack now names assurance ledgers and the traversal fold in:
  `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md`
  and
  `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md`

The design patch was necessary because the implementation had introduced
public graph-function truth before the reusable library design explicitly named
those functions. That local trace defect is now corrected.

### O: ODD Method

The implementation follows the right ODD shape:

- the assurance dimensions are published as graph-function library entries
- the fold is a declared deterministic graph function
- the T-076 path folds typed ledger truth before closure/retry judgment
- no product-local loop was added
- no ABG runtime authority was copied into `odd_sdlc`

The residual problem is proof depth, not direction. Some ledger dimensions are
still skeletal relative to their ticket contracts.

## Findings

### High: Completed ledger tickets overclaim validation depth

T-079, T-080, T-081, and T-082 contain validation obligations that are not fully
represented in code or tests.

Examples:

- T-080 says the requirement ledger must reject outside-edge evidence and
  classify ambiguous or contradictory requirement authority as
  `reprice_required`, but the implementation only accepts a closure register
  and optional required requirement IDs.
- T-081 says ambiguity must distinguish missing required evidence as `blocked`
  and incomplete repairable evidence as `open_gap`, but the implementation
  only separates target/authority ambiguity from other findings.
- T-079 says obligation state can become `blocked` or `reprice_required`, but
  the implementation currently distinguishes only dropped, carried, closed, or
  not-applicable obligations.
- T-082 says contradictory capability authority and placeholder/identity code
  should be evaluated by the capability ledger, while current code only checks
  observed capability presence, evidence refs, and `substantive`.

Impact:

The current code is useful and green, but these completed tickets should not be
cited as proving full assurance-ledger evaluator depth for data_mapper RC.

Required action:

Use T-085 to either implement and test each listed validation obligation or
explicitly re-scope/defer the obligations so completed ticket truth matches
actual proof.

### Medium: Module publication proof is partly indirect

`test_t030_graph_catalog_module.test.mjs` asserts the full reusable catalog
contains every assurance function, and the module constructor maps the catalog
into GTL graph functions. The direct module assertion names only
`Fg_materialization_assurance_ledger` and `Fg_traversal_assurance_fold`.

Impact:

The implementation is probably correct because `constructSdlcGtlModule()`
materializes all catalog entries, but the guardrail would be stronger if the
test asserted every assurance graph function exists in `module.graphFunctions`.

Required action:

Fold this into T-085 as a low-cost guardrail.

## Verification

Commands run from `build_tenants/typescript`:

- `npm run test:t030` passed: 7 tests
- `npm run test:t076` passed: 1 test
- `npm run test:t077-t083` passed: 7 tests
- `npm run test:t084` passed: 8 tests
- `npm run test:semantic` passed: 97 tests
- `npm run lint:semantic` passed

## RC Position

The assurance-ledger wave is a valid foundation for T-066 and T-076. It is not
yet enough to claim data_mapper RC depth. T-066, T-069, T-076, and now T-085
remain active before the TypeScript tenant can use this assurance stack as full
RC evidence.
