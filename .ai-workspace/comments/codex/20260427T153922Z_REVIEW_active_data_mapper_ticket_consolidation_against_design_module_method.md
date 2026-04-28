# Active Data Mapper Ticket Consolidation Against Design Module Method

## Claim

The `data_mapper` RC ticket set was over-factored.

The active design already lives in:

- `build_tenants/typescript/design/`
- `build_tenants/typescript/code/src/*` module surfaces

Tickets should therefore be refactor and proof surfaces over that design, not
parallel mini-design documents.

## Design Module Method Finding

The previous active set violated the method's authority-seam evaluator by
creating multiple peer tickets for one design surface:

- recursive deepening duplicated the total transition function
- conformed project handoff duplicated the valid installed initial-state
  surface
- capability inventory, behavioral test inventory, and shallow evaluators
  duplicated one materialization/evaluator closure surface
- the data_mapper comparator duplicated the RC envelope

That increased truth surfaces without improving implementation control.

## Consolidated Active Set

The active set is now four tickets:

- `T-076`: refactor installed traversal to realize the active total transition
  function
- `T-069`: refactor data_mapper qualification to prove valid installed initial
  state
- `T-066`: refactor downstream materialization and closure evaluators over the
  active design
- `T-041`: evaluate the TypeScript full operational Python-replacement RC lane

## Consolidated Completed Records

The following tickets are completed as consolidation-only records, not as
implemented feature closure:

- `T-070` -> `T-069`
- `T-071` -> `T-076`
- `T-072` -> `T-066`
- `T-073` -> `T-066`
- `T-074` -> `T-066`
- `T-075` -> `T-041`

## Execution Order

1. `T-076`: prove failed deterministic admission enters event/gap/retry truth.
2. `T-069`: prove the fresh installed `data_mapper` successor starts from
   valid installed initial state.
3. `T-066`: make materialization, capability, test, execution, and shallow
   evaluators feed typed gap pressure.
4. `T-041`: apply the comparator and decide RC go/no-go or reprice.

## Non-Regression Rule

No new active ticket should be opened for a sub-surface already represented by
the active design unless it owns a distinct refactor/proof boundary.

Design truth stays in design and module surfaces. Tickets carry bounded change
authority over that truth.
