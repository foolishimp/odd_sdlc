---
id: T-024
title: Promote odd_sdlc execution-contract and runtime binding to a typed graph-owned carrier
type: bug
ticket_category: implementation_migration
status: completed
goal: remove residual controller-owned execution law left after T-023 under the ABG 3.2 review bar
change_intent: Replace the remaining open-dict execution contract, app-owned admission binding, and work-item route rereads with one typed graph-owned execution-contract carrier consumed by public start, prompt, manifest, closure, and gap-analysis surfaces; keep the source query-assets runtime binding explicit and prove it cannot regress to runtime_config fallback
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc runtime contract bootstrap, execution_contract_surface admission, public start binding, work-item route carrier publication, prompt/manifest provenance, and closure/gap-analysis handoff
priority: high
triaged_at: 2026-04-21
created_at: 2026-04-21
updated_at: 2026-04-22
dependencies:
  - odd_sdlc T-023 completed
  - odd_sdlc T-020 active
  - ABG 3.2.0 runtime carrier line completed
old_path_classification: app.start admission branching, execution_contract dict payloads, target_truth.get reconstruction, and work-item route helper rereads = replace; runtime_config.domain_package fallback = demoted by explicit query-assets binding; route helper retained only as asset-carrier producer until demoted
governing_design:
  - ABG 3.2.0 runtime carrier and event-first line
  - ABG ADR-034 runtime execution law is carrier and event owned
  - ABG ADR-036 runtime advancement uses execution basis and advancement transition
  - odd_sdlc T-023 execution-contract admission surface
  - odd_sdlc T-024 impacted-interface review checklist
constitutional_requirements:
  - REQ-F-ODDSDLC-007
  - REQ-F-ODDSDLC-029
  - REQ-F-ODDSDLC-035
  - REQ-F-ODDSDLC-037
  - REQ-F-ODDSDLC-040
authoritative_contract: odd_sdlc start, gaps, query-domain/catalog, prompt/manifest provenance, and execution_contract_surface remain public surfaces while execution law migrates to the typed graph-owned carrier
intake_source: post-T-023 contract-standard assurance walkthrough applying ABG B-027 review criteria to the completed execution-contract wave
target_truth: one typed execution-contract carrier owns source runtime binding, target truth, work-item route truth, admission status, criteria, proof surface, and downstream execution basis; public start and downstream consumers pattern-match that carrier instead of reconstructing truth from open dicts, target strings, ticket rereads, or runtime_config side channels
superseded_truth: execution law remains spread across app.start direct admission calls, dict-shaped execution_contract payloads, target_truth.get(...) reconstruction, and work-item route_contract helper rereads; the prior source runtime_config domain_package fallback has been closed by explicit query-assets binding and remains in scope only as a regression proof
closure_law: closes only when execution_contract_surface is a typed closed carrier, graph-owned admission is authoritative before work executes, runtime_config cannot invent asset-binding truth from domain_package, route_contract is carried by the published asset carrier, and mixed old/new execution-basis proofs do not count
evaluation_criteria:
  - source bootstrap publishes an explicit query-assets asset-binding contract and never falls back to query-domain through runtime_config.domain_package
  - execution_contract_surface is represented as a typed carrier family rather than dict[str, Any] payloads interpreted per consumer
  - public start is a delivery binding over graph-owned contract admission, not the owner of execution law
  - work-item route_contract truth is published on the asset carrier and consumed from there by execution-contract admission
  - prompt assembly, manifest provenance, closure checks, and gap/dossier handoff consume the same admitted carrier
  - tests prove carrier removal or corruption fails closed rather than falling back to target strings, raw ticket body, route helpers, or runtime_config defaults
non_closure_conditions:
  - app.start or any helper still owns execution-law branching beyond delivery binding
  - execution basis is reconstructed from open dict .get(...) payloads in normal execution
  - StartTarget is rebuilt from target_truth dicts instead of a typed admitted target variant
  - source bootstrap can reach ABG asset binding with only runtime_config.domain_package as authority
  - work-item route truth is recomputed from ticket markdown after the asset carrier has been published
  - query-domain, gap dossier, prompt, or closure consumers accept raw execution basis when the admitted carrier is missing or corrupt
proof_surface:
  - source runtime bootstrap test proving default query-assets binding and no query-domain fallback
  - source-line proof over typed execution-contract carrier variants
  - start-path proof that public start consumes graph-owned admission truth
  - route-contract proof that work-item asset carrier publishes and admission consumes route truth
  - negative proof that corrupt or missing execution_contract_surface blocks prompt/manifest/closure consumption
  - focused sandbox/catalog proof repriced to execution_contract_surface and graph functions
---

## Migration Declaration

- old_truth_path: T-023 introduced execution_contract_surface, but current code
  still admits and consumes it as open dictionaries; `app.start(...)` directly
  calls the admitter, helper code reconstructs `StartTarget` from
  `target_truth.get(...)`, source bootstrap may rely on `domain_package` when no
  explicit asset-binding contract exists, and work-item route truth is reread
  from ticket surfaces instead of carried by the published asset carrier
- new_truth_path: a typed execution-contract carrier family carries runtime
  binding, target truth, route truth, admission status, criteria, proof surface,
  and downstream execution basis; graph-owned derive/admit transitions publish
  that carrier; public start and all consumers pattern-match the carrier
- producers_old:
  - `odd_sdlc.app.bootstrap(...)` with implicit `domain_package` fallback
  - `odd_sdlc.app.start(...)` direct admission/branching
  - `odd_sdlc.execution_contract` open dict assembly
  - `odd_sdlc.start_targeting.resolve_start_target(...)` with route_contract=None
  - work-item route helper rereads from ticket markdown
- producers_new:
  - source/bootstrap runtime query-assets binding carrier
  - typed execution-contract draft/admission carrier
  - published asset ownership entry carrying route_contract for work items
  - graph-owned derive/admit execution-contract transitions
- consumers_old:
  - prompt context rendering
  - manifest provenance
  - public start binding
  - closure/gap-analysis handoff
  - sandbox/catalog tests asserting old list/count/event coincidences
- consumers_new:
  - public start as thin delivery binding
  - ABG prompt and manifest contexts
  - closure/gap-analysis handoff
  - query-domain/catalog projections
  - proof lanes over the admitted carrier

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old/new behavior are removed or repriced
- [x] ticket wording, product wording, and proof claims are reconciled before closure

## Required Break Order

1. Remove stale source runtime fallback and make `query-assets` the explicit
   source bootstrap asset-binding contract.
2. Publish work-item `route_contract` on the asset ownership carrier.
3. Replace dict-shaped execution-contract payloads with typed carrier variants:
   ordinary operator request, ticket work item, admitted target variant,
   rejected contract, superseded contract.
4. Rebind `bound_execution_start_from_contract(...)` to pattern-match typed
   target variants instead of reconstructing from open dicts.
5. Rebind public start so graph-owned admission is the authoritative transition
   and `app.start(...)` remains delivery shell.
6. Reprice prompt, manifest, closure, and gap/dossier consumers to the typed
   admitted carrier.
7. Reprice stale catalog/query/observation tests to the typed admitted carrier
   after source-carrier and consumer rebinding lands. Early proof cleanup is
   allowed as in-flight hygiene, but it is not closure evidence.
8. Add mixed-state negative proof and remove old raw/dict proof expectations.

## Break-To-Closure Map

- Break 1 closes the source-runtime fallback clause.
- Breaks 2-4 close the typed carrier and route truth clause.
- Breaks 5-6 close the public start and downstream consumer clause.
- Break 7 closes the stale-proof repricing clause only after the source carrier
  and consumers are rebound.
- Break 8 closes the mixed-state rejection clause.

## Impacted Interface Review Checklist

Every implementation and review pass must walk this list before tests are used
as closure evidence. A checked item means the interface consumes a typed
execution-contract carrier or is explicitly demoted to a pure projection over
that carrier. A path that can still derive execution basis from raw target
strings, raw ticket markdown, open dict payloads, route helper rereads, or
runtime_config side channels blocks ticket closure.

- [x] `runtime_contract.query_assets_binding_contract(...)`,
  `runtime_contract_lines(...)`, installer release wiring, and `app.bootstrap(...)`
  publish explicit `query-assets` binding and cannot fall back to
  `runtime_config.domain_package` / `query-domain` as asset-binding authority.
- [x] `published_asset_ownership_index(...)` publishes work-item
  `route_contract` on the asset carrier before execution-contract admission
  consumes route truth.
- [x] `ResolvedOddStartTarget` and `resolve_start_target(...)` carry typed
  target and route variants; work-item route truth is not returned as `None` and
  later recomputed from the ticket surface.
- [x] `work_item_route_contract_from_ticket_metadata(...)` is either a producer
  for asset-carrier publication or demoted to install/catalog projection; it is
  not a normal-execution admission fallback.
- [x] `_ordinary_execution_contract(...)`, `_ticket_execution_contract(...)`,
  `derive_execution_contract_surface(...)`, and
  `admit_execution_contract_surface(...)` return a typed execution-contract
  carrier family, not `dict[str, Any]` payloads interpreted per consumer.
- [x] `_validate_execution_contract(...)` pattern-matches typed contract
  variants and fails closed on missing route, target, criteria, proof, or
  admission state.
- [x] `_start_target_from_execution_contract(...)` is removed or replaced by
  pattern-matching typed admitted target variants; `target_truth.get(...)` is
  not a live execution-basis path.
- [x] `bound_execution_start_from_contract(...)` binds from the typed admitted
  carrier and does not reconstruct `StartTarget`, `Scope`, or diagnostic edge
  overrides from open dict fields.
- [x] `app.start(...)` is a thin delivery shell over graph-owned admission; it
  does not own execution-law branching beyond delivery flags and ABG call
  selection.
- [x] GTL graph functions for derive/admit execution contract are the
  authoritative carrier transitions before work executes, not metadata beside a
  controller-owned admission path.
- [x] prompt context, manifest provenance, gap/dossier handoff, query-domain,
  and catalog consumers consume the same admitted carrier projection. Corrupt
  persisted carrier state fails closed; missing carrier state is lawful only
  for pre-start read-model projection and is not treated as admitted execution
  truth.
- [x] tests include mixed-state negative proof: corrupting/removing the admitted
  execution-contract carrier prevents prompt, manifest, closure, gap/dossier,
  and public start consumers from passing through raw target, ticket, helper, or
  runtime_config fallback.

## Progress Notes - 2026-04-21

- Break 1 is implemented at the odd_sdlc source boundary: `bootstrap(...)`
  installs an explicit `query-assets` asset-binding contract when no installed
  runtime contract exists, and stale self-query `query-domain` contracts are
  stripped instead of preserved as runtime authority.
- Proof cleanup for stale catalog/query/observation failures has partially
  landed as in-flight hygiene: catalog/count assertions now price the
  `execution_contract_surface` carrier, observation proofs no longer depend on
  last-event coincidences, and software-mode generated test-design surfaces now
  carry explicit `Validates:` requirement tags. This cleanup does not count as
  closure evidence until Breaks 2-6 land.
- The active residuals are Breaks 2-8: `route_contract` is still absent from the
  published asset carrier, `execution_contract_surface` is still an open dict,
  public start still calls admission directly, and downstream consumers still
  need mixed-state negative proof against raw target/ticket/helper fallback.

## Progress Notes - 2026-04-22

- Breaks 2-5 are implemented in code. Work-item `route_contract` is now
  published on `published_asset_ownership_index(...)`, carried through
  `ResolvedOddStartTarget`, and consumed by execution-contract admission without
  rereading route truth from ticket markdown.
- `execution_contract_surface` now uses typed carrier variants in normal
  execution: `DraftExecutionContract`, `AdmittedExecutionContract`,
  `RejectedExecutionContract`, `SupersededExecutionContract`,
  `OperatorExecutionSource`, `TicketWorkItemExecutionSource`, and typed target
  variants for `next`, `graph_function`, and `asset`.
- `bound_execution_start_from_contract(...)` now requires an
  `AdmittedExecutionContract` and pattern-matches target variants. Open dict
  payloads fail closed instead of being rehydrated into current execution truth.
- `app.start(...)` now calls `admit_bound_execution_start(...)` and no longer
  sequences admit-then-bind directly. It remains responsible for delivery/run
  mode selection after the execution-contract boundary has admitted the carrier.
- Focused proof run:
  `test_odd_sdlc_first_slice.py -k "execution_contract or route_contract or admitted_target or ticket_asset_start or ordinary_asset_target or supersedes or open_dict"`:
  9 passed, 53 deselected.
- Installed proof run:
  `test_install_query_domain_publishes_triaged_work_item_asset_with_route_contract`
  and `test_install_start_routes_ticket_asset_without_manual_upstream_edit`: 2
  passed.
- Full `test_odd_sdlc_first_slice.py` is not green yet due an unrelated
  repair-frontier prompt-budget failure:
  `test_code_edge_prompt_includes_realization_deepening_context` expects
  `## Code Frontier` in the assembled prompt after context compaction. That
  belongs to the prompt/traceability surface, not this execution-contract
  carrier slice.
- Break 6 is implemented for the persisted downstream consumer seam:
  catalog, query-domain, and gap-dossier surfaces now load one validated
  admitted `execution_contract_surface` projection. Missing carrier state is
  represented as no current execution basis; corrupt carrier state raises an
  `ExecutionContractSurfaceError` instead of falling back to raw target strings,
  ticket markdown, or runtime configuration.
- Gap-dossier register and context publication now carry the admitted
  execution-contract projection when one exists, so later review has the same
  contract id/source/target basis that prompt and manifest provenance use.
- Focused proof after the downstream carrier-consumer slice:
  `test_odd_sdlc_first_slice.py -k "execution_contract or route_contract or admitted_target or ticket_asset_start or ordinary_asset_target or supersedes or open_dict or corrupt"`:
  10 passed, 53 deselected.
- Full first-slice proof after query-domain `v16` repricing and latest ABG
  prompt-budget carrier integration:
  `test_odd_sdlc_first_slice.py`: 63 passed.
- Additional latest-build consumer proof:
  `test_odd_sdlc_disambiguation_usecase.py::test_normalization_publishes_and_reduces_major_ambiguity`
  and
  `test_odd_sdlc_iterative_closure_traceability_usecase.py::test_iterative_requirement_closure_and_generated_traceability`:
  2 passed.
- Installed sandbox proof:
  `test_odd_sdlc_sandbox_usecase.py::test_canonical_sandbox_usecase_runs_from_installed_workspace`:
  1 passed.
- B-028 downstream regression proof:
  `test_odd_sdlc_test28_regression.py`: 4 passed.

## Mixed-State Negative Proof

Closure requires all three conditions:

1. Corrupting or removing the admitted `execution_contract_surface` makes
   admission, public start binding, prompt assembly, manifest provenance, and
   gap/dossier handoff fail closed rather than silently degrading to old truth.
2. Every derive/admit/supersede execution-contract transition is replay-visible
   in the event stream before work executes.
3. Prompt, manifest, closure, gap/dossier, query-domain, and catalog consumers
   can only pass through the typed admitted carrier. A path that falls back to
   raw operator strings, raw ticket markdown, route helpers, open dict payloads,
   or `runtime_config.domain_package` proves this ticket remains open.

## Functional Review Criteria

Every implementation and review pass must ask:

1. Did the slice reduce the execution-law semantic center, or only wrap the old
   dict/helper path in another carrier name?
2. Is every execution-basis variant explicit and typed enough for consumers to
   pattern-match?
3. Can a consumer compute execution basis from raw target strings, raw ticket
   text, route helper rereads, or runtime_config fallback and still pass?
4. Does public start call into graph-owned admission truth as a delivery shell,
   or does it own execution law?
5. Is route_contract carried by the published asset carrier before admission
   consumes it?
6. Are query-domain/catalog/observation tests asserting carrier law rather than
   stale counts, ordering, or last-event coincidences?
7. Does removing the carrier make execution impossible rather than degraded?

Passing traversal tests do not satisfy this ticket if the old open-dict or
runtime_config fallback path still passes in normal execution.
