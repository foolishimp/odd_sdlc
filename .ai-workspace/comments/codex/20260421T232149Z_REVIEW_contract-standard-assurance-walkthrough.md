# Contract Standard Assurance Walkthrough

This review records the contract-by-contract assurance pass triggered by the
post-T-023 execution-contract standard and the ABG 3.2 B-027 refactor bar.

Status terms:

- `pass`: current surface satisfies the standard for this release line
- `partial`: current surface is lawful in-flight but must not be closure evidence
- `fail`: current surface violates the new standard or keeps hidden legacy truth
- `test-stale`: code is acceptable but proof assertions encode old contract shape

## Review Standard

Every live contract surface must answer these checks.

1. Source carrier: Is the current truth published by a named carrier, graph
   function, contract file, or event stream before consumers use it?
2. Closed shape: Is the carrier closed and typed enough that consumers
   pattern-match it instead of reconstructing meaning from open dictionaries or
   raw strings?
3. Ownership: Does the graph/carrier own the law, or does `app.start`, a helper,
   a report, or a test still decide the contract procedurally?
4. Runtime ingress: Is `runtime_config` only bootstrap/adapter input, never a
   hidden semantic fallback?
5. Event/projection: Are write effects event-owned and are projections derived
   from those events rather than filesystem side effects or stale snapshots?
6. Proof: Does the test assert the current carrier contract rather than an old
   count, list order, last-event coincidence, or raw helper behavior?

## Exhaustive Contract Surface Walk

### 1. Installed Runtime Contract

- Surface: `.genesis/odd_sdlc/release/genesis.yml`
- Producers: `odd_sdlc.release.install._runtime_contract_lines(...)`
- Consumers: `odd_sdlc.app._load_runtime_config(...)`, ABG bootstrap
- Status: `partial`
- Passes:
  - Installer writes the new `.genesis/odd_sdlc/release/genesis.yml` location.
  - Root `.odd_sdlc/release/genesis.yml` has been deleted from source.
- Fails:
  - `app._load_runtime_config(...)` still contains a stale `.odd_sdlc/release/genesis.yml`
    fallback.
  - Source execution with no installed `.genesis` can still reach ABG with only
    `domain_package` and no explicit `query-assets` binding contract.
- Action:
  - Remove the stale `.odd_sdlc` fallback.
  - Publish the default `query-assets` asset-binding contract at bootstrap when
    no installed contract supplies one.

### 2. Source Bootstrap Runtime Config

- Surface: `odd_sdlc.app.bootstrap(...)`
- Producers: `_load_runtime_config(...)`, `_sanitize_runtime_config_for_domain_commands(...)`
- Consumers: `OddSdlcApp.scope(...)`, ABG binding/admission
- Status: `fail`
- Fails:
  - `domain_package: odd_sdlc` is still injected without a guaranteed explicit
    asset-binding contract in source mode.
  - That leaves ABG able to invent the expensive `query-domain` asset-binding
    path from `runtime_config.domain_package`.
- Action:
  - Treat `query-assets` as the explicit local adapter contract.
  - Keep `domain_package` only as package identity, not as an asset-binding
    fallback source.

### 3. Start Target Catalog

- Surface: `odd_sdlc.start_targeting.published_start_target_catalog(...)`
- Producers: GTL module graph functions
- Consumers: `resolve_start_target(...)`, query-domain, catalog, tests
- Status: `pass`
- Passes:
  - Start-addressable graph functions are published in one catalog.
  - `graph_function:` handles resolve through the catalog rather than arbitrary
    runtime names.
- Residual risk:
  - Payload is still a dictionary read model. This is acceptable because it is a
    published query projection, not the execution-law carrier.

### 4. Asset Ownership Index

- Surface: `odd_sdlc.start_targeting.published_asset_ownership_index(...)`
- Producers: workspace asset publication plus start-target catalog
- Consumers: `asset:` target resolution, query-domain, execution-contract target truth
- Status: `partial`
- Passes:
  - Ordinary assets publish path, existence, path kind, and governing operator
    target.
  - The ordinary asset/ticket misclassification bug is fixed by requiring work
    item handles for ticket execution contracts.
- Fails:
  - Work-item entries do not publish `route_contract` on the asset carrier even
    though design says the published asset entry carries it.
  - `resolve_start_target(...)` returns `route_contract=None`, forcing
    execution-contract construction to reread ticket state.
- Action:
  - Move route truth onto the published asset ownership entry for work items.
  - Make execution-contract admission consume that carrier truth, not reread raw
    ticket text as normal authority.

### 5. Work-Item Route Contract

- Surface: `odd_sdlc.work_item_routing.*`
- Producers: ticket frontmatter and route-contract helper
- Consumers: execution-contract admission, target routing
- Status: `partial`
- Passes:
  - Ticket status and route metadata are interpreted through a named routing
    helper.
- Fails:
  - Route truth is not yet carried by the published asset carrier.
  - Helper reread remains a normal execution path.
- Action:
  - Rebind route-contract production to the asset ownership carrier.
  - Keep ticket-body reads as carrier production only, not downstream execution
    interpretation.

### 6. Execution Contract Surface

- Surface: `.ai-workspace/runtime/odd_sdlc-execution-contract.json`
- Producers: `derive_execution_contract_surface(...)`,
  `admit_execution_contract_surface(...)`
- Consumers: `bound_execution_start_from_contract(...)`, prompt context, manifest
  context, gap/dossier review
- Status: `fail`
- Passes:
  - Contract is drafted/admitted before traversal opens.
  - Runtime events are emitted for draft/admit/supersede/reject.
  - Ordinary asset targets now remain ordinary operator requests.
  - Target truth now preserves `asset_path_kind` and `asset_exists`.
- Fails:
  - The admitted payload is still `dict[str, Any]`.
  - `bound_execution_start_from_contract(...)` reconstructs `StartTarget` from
    `.get(...)` fields.
  - `app.start(...)` directly calls admission and then branches on execution
    mode, so it is not yet a thin graph-owned binding.
- Action:
  - Add a successor ticket to T-023 for a typed execution-contract carrier and
    graph-owned admission binding. Do not reopen T-023.

### 7. Execution-Contract Graph Functions

- Surface: `derive_execution_contract_surface`,
  `admit_execution_contract_surface` in `odd_sdlc.gtl_module`
- Producers: GTL module
- Consumers: catalog, prompt/manifest context declarations, tests
- Status: `partial`
- Passes:
  - The graph functions are published and catalog-visible.
  - The sandbox catalog test has been repriced to include them.
- Fails:
  - Public start still invokes Python admission directly rather than traversing
    the graph functions as the owning transition.
- Action:
  - Successor ticket should require public start to bind through the graph-owned
    carrier transition or prove why the direct binding is only delivery shell.

### 8. Prompt Context Carriage

- Surface: `odd_sdlc_execution_contract_context`
- Producers: execution-contract context renderer
- Consumers: ABG prompt assembly and manifest contexts
- Status: `pass`
- Passes:
  - Constructive graph functions declare the execution-contract context.
  - Negative proof exists for raw `gen_start` without admitted context.
- Residual risk:
  - This remains downstream of the open-dict execution-contract payload.

### 9. Query-Domain Contract

- Surface: `odd_sdlc.query_contract.query_domain_contract()`,
  `odd_sdlc.query.query_domain(...)`
- Producers: catalog, gap snapshot, query projections
- Consumers: CLI, ABG/domain query probes, tests
- Status: `test-stale`
- Passes:
  - Query-domain now publishes 33 assets and 10 graph functions, including the
    execution-contract carrier and graph functions.
- Fails:
  - Sandbox proof still encoded old exact asset count and graph-function list.
  - The key-order assertion was stale for `sorted(...)`.
- Action:
  - Reprice tests to assert the carrier’s presence and full current key set.

### 10. Query-Assets Binding Contract

- Surface: `odd_sdlc query-assets`
- Producers: `odd_sdlc.query.query_asset_bindings(...)`, installer runtime contract
- Consumers: ABG asset-binding admission
- Status: `pass`
- Passes:
  - Installer emits `query-assets`, not `query-domain`.
  - Source bootstrap now injects the same explicit `query-assets` contract when
    no installed runtime contract exists.
  - Stale self-query `query-domain` binding is stripped instead of preserved as
    runtime authority.

### 11. Generated Asset Contracts

- Surface: `GeneratedAssetContract` in `workspace_assets.py`
- Producers: workspace asset publication and constructor prompt contract
- Consumers: FD certification and F_P prompt constraints
- Status: `pass`
- Passes:
  - Generated assets carry marker contracts.
  - Prior proof covers prompt/certification parity.
  - Software-mode generated test-design surfaces now carry explicit `Validates:`
    requirement tags before FD recheck evaluates `test_design_surface_coverage`.

### 12. Edge Work-Report Contracts

- Surface: `software_domain_catalog.EDGE_CONTRACTS`
- Producers: ODD domain catalog
- Consumers: catalog, query-domain, prompt/gap projections
- Status: `pass`
- Passes:
  - Edge contracts are declared in one catalog and exported through query-domain.
- Residual risk:
  - Requirement carry and obligation closure are still T-020-owned.

### 13. Operational Capability Contracts

- Surface: `project_constraints.yml` capability fields and
  `operational_dispatch.py`
- Producers: normalization/project profile
- Consumers: operational dispatch and gap diagnostics
- Status: `pass`
- Passes:
  - Empty capability fields fail as missing contracts.
  - Declared side-effect commands are gated by project profile.
- Residual risk:
  - Command strings are intentionally side-effect contracts; not part of T-020
    traceability closure.

### 14. Traceability / Requirement Closure Carrier

- Surface: `traceability.py`, requirement closure register,
  declared obligation ledger
- Producers: traceability scan/register helpers
- Consumers: FD checks, gap dossier, query-domain, prompt/report contexts
- Status: `fail`, owned by active `T-020`
- Fails:
  - `traceability.py` still mixes index build, closure assembly, ledger
    computation, query helpers, and report rendering.
  - FD/gap consumers can still call raw helpers.
- Action:
  - T-020 must stay active and explicitly track the raw-helper consumer audit.

### 15. Gap Dossier Contract

- Surface: gap snapshot, dossier register, `gap_dossier.py`, `span_analysis.py`
- Producers: ABG gaps plus odd_sdlc declared-obligation ledgers
- Consumers: query-domain, tests, operator review
- Status: `partial`, owned by active `T-020`
- Fails:
  - Gap rows remain open dictionaries in places.
  - Span analysis still aggregates dict rows as closure evidence.
- Action:
  - Rebind to a closed obligation-ledger projection under T-020.

### 16. FD Check Contracts

- Surface: `fd_checks.py`
- Producers: deterministic evaluators
- Consumers: ABG F_D binding and proofs
- Status: `partial`, owned by active `T-020`
- Fails:
  - FD checks still import raw traceability helpers.
- Action:
  - Rebind to the requirement-closure/obligation carrier.

### 17. Report / Prompt Projection Contracts

- Surface: markdown reports, prompt contexts, traceability report helpers
- Producers: traceability/report modules
- Consumers: F_P prompts, review comments, docs
- Status: `partial`, owned by active `T-020`
- Fails:
  - Some report surfaces still compute closure-oriented meaning instead of only
    projecting carrier truth.
- Action:
  - Split rendering from closure decisions.

### 18. Ambiguity / Project Profile Contracts

- Surface: ambiguity register and project profile normalization
- Producers: `ambiguity.py`, `project_profile.py`, `normalization.py`
- Consumers: gap diagnostics, risk-appetite proof
- Status: `pass`
- Passes:
  - Ambiguity detection uses resolved project profile truth.
  - Materialized noncanonical output roots are preserved; stale unmaterialized
    roots normalize away.
- Proof consequence:
  - Risk-appetite tests were repriced from stale `declared-root-vs-realized-root-mismatch`
    expectations to live `multiple-realization-roots`.

### 19. Normalization / Mutable Worksite Boundary

- Surface: `normalization.py`
- Producers: source/import normalization
- Consumers: sandbox/install/usecase tests
- Status: `pass`
- Passes:
  - Generated materialization no longer deletes governance directories.
  - Materialized output roots are not collapsed just because they are
    noncanonical.

### 20. Runtime Event / Observation Projection

- Surface: ABG event stream, `odd_sdlc observe`, sandbox usecase assertions
- Producers: ABG traversal and odd_sdlc runtime events
- Consumers: observation projections and tests
- Status: `test-stale`
- Passes:
  - Events are present and contain `run_completed` and `edge_converged`.
- Fails:
  - Sandbox proof asserts `recent_events[-1] == "edge_converged"`, but current
    lawful event ordering can finish with `run_completed`.
- Action:
  - Reprice test to assert required event presence and per-edge closure, not an
    incidental last-event order.

### 21. Documentation / Installed Topology Contract

- Surface: `AGENTS.md`, `CLAUDE.md`, `README.md`, specification topology text,
  live docs
- Producers: source docs
- Consumers: operators, agents, tests
- Status: `partial`
- Passes:
  - Current live docs say source repo does not carry root `.genesis`.
  - Installed payload path is `.genesis/odd_sdlc/`.
- Fails:
  - Some historical docs still mention `.odd_sdlc/release/genesis.yml`.
- Action:
  - Move/delete stale live references or explicitly classify them as historical
    notes before release closure.

### 22. Ticket / Method Contract

- Surface: completed T-023 and active T-020
- Producers: `.ai-workspace/tickets`
- Consumers: implementors and reviewers
- Status: `partial`
- Passes:
  - T-020 remains active and correctly blocks traceability closure.
- Fails:
  - Completed T-023 claims closure at a stricter standard than current code now
    meets after applying ABG B-027 review criteria.
  - There is no active successor ticket for typed execution-contract carrier,
    graph-owned admission binding, and source runtime-contract fallback.
- Action:
  - Do not reopen T-023.
  - Create a successor active/backlog ticket that names the residual execution
    contract/source runtime carrier migration explicitly.

## Immediate Fix Order

1. Patch source bootstrap/runtime contract fallback:
   - remove `.odd_sdlc/release/genesis.yml`
   - inject explicit `query-assets` binding when no installed runtime contract
     supplies one
2. Patch test-stale proof:
   - query-domain catalog expects execution-contract carrier
   - observation proof must not depend on last-event coincidence
3. Update active T-020:
   - explicit residual consumer list for FD checks, gap dossier/span analysis,
     query-domain, prompt/report projections
4. Add successor ticket after T-023:
   - typed execution-contract carrier
   - graph-owned admission binding
   - route_contract on published asset carrier
   - no `runtime_config.domain_package` fallback for asset-binding authority
5. Rerun:
   - focused sandbox usecase
   - T-020 focused proof bundle
   - full ODD tenant suite
