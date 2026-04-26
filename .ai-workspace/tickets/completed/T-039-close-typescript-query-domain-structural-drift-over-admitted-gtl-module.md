---
id: T-039
title: Close TypeScript query-domain structural drift over admitted GTL module
type: corrective
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Prevent TypeScript query-domain from publishing read-model truth that is not structurally supported by the admitted GTL module.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript query-domain projection, GTL module publication, public start target resolution, semantic tests
priority: P0
triaged_at: 2026-04-26
created_at: 2026-04-26
completed_at: 2026-04-26
governance_scope: STDO Method
---

# T-039: Close TypeScript query-domain structural drift over admitted GTL module

## Review Finding

`projectSdlcQueryDomain` checks that expected graph-function names exist in the
admitted module, but still publishes catalog-derived functions, executive
programs, and asset ownership from a fresh canonical catalog. A same-name graph
function with different inputs, outputs, vectors, declarations, or ownership
shape can still pass the current guard.

Source finding:

- `.ai-workspace/comments/codex/20260426T040716Z_CORRECTIVE_REVIEW_typescript_build_wave_before_close.md`
- current review follow-up: query-domain drift is only partially fixed

## Target Truth

The TypeScript query-domain projection is a downstream read model over the
admitted GTL module and admitted source carriers. It cannot publish function,
ownership, start-target, or executable-query truth that is not structurally
present in the admitted module.

## Superseded Truth

Query-domain closure is proven by graph-function name presence while catalog,
program, and ownership truth are reconstructed from a separate canonical catalog.

## Closure Law

This ticket closes only when query-domain projection either derives its published
function/program/ownership/start surfaces from the admitted GTL module or fails
closed after structural comparison between the admitted module and catalog truth.

Name equality is not sufficient closure evidence.

## Evaluation Criteria

- compare graph-function structural signatures, including inputs, outputs,
  executable vector names, declarations needed by the domain contract, and public
  callable role
- reject same-name graph functions whose structure differs from catalog truth
- reject ownership/start/program projections that cannot be derived from or
  reconciled to the admitted module
- preserve read-only projection behavior; query-domain must not emit runtime
  events or own traversal
- add negative tests where same graph-function names carry divergent outputs or
  vectors
- add negative tests where stale ownership/program projections would otherwise
  publish a false public start target

## Proof Surface

- updated TypeScript projection code
- updated TypeScript design note if the projection-source coherence rule changes
  the module topology
- focused T-032/T-039 tests
- semantic test lane
- STDO closure review comment

## Non-Closure Conditions

- missing-name tests are the only negative proof
- a projection can still pass while using a same-name but structurally different
  graph function
- catalog truth remains an independent authority beside the admitted module
- public start can receive query-domain ownership/program truth that is not
  supported by the admitted module

## Closure Evidence

- `projectSdlcQueryDomain` now compares admitted module graph-function
  signatures against canonical GTL publication before publishing query-domain
  catalog, program, ownership, and start-target read models.
- Structural signature covers graph-function id, inputs, outputs, vector
  signatures, declarations, tags, effects, and job/start-target bindings.
- Same-name output drift, vector drift, and start-target drift fail closed.
- Focused proof: `npm run test:t039` passed.
- Regression proof: `npm run test:semantic` passed with 34 tests.
- Static proof: `npm run lint:semantic` passed.
