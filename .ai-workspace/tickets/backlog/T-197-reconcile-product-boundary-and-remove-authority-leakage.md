---
id: T-197
title: Reconcile product boundary and remove authority leakage
type: chore
ticket_category: implementation_migration
status: backlog
proof_status: not_started
goal: preserve odd_sdlc as the software-domain meaning layer over GTL/ABG without rival runtime, GTL, or orchestration authority
build_tenant: typescript
owner: odd_sdlc
change_intent: >-
  Reconcile odd_sdlc PRODUCT and requirement truth against TypeScript realization,
  classify every authority-leakage surface by constitutional owner, ratify the
  staged-compute and runtime-governance design for lawful disposition, and
  execute remediation waves that stop SDLC from synthesizing ABG runtime facts,
  encoding parallel GTL law, embedding odd_service orchestration, or encoding
  generic ecosystem heuristics as product law.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-06-09
created_at: 2026-06-09
updated_at: 2026-06-09
governance_scope: STDO Method
migration_strategy: inside_out_hard_break
source_documents:
  - specification/GOALS.md
  - specification/INTENT.md
  - specification/PRODUCT.md
  - specification/requirements/03-runtime-governance.md
  - specification/requirements/09-odd-service-orchestration-plane.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/gtl/REQ-L-GTL3-CONTRACT-LAW-API.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md
  - .ai-workspace/comments/grok/20260609T022918Z_GAP_sdlc-product-requirement-code-reconciliation.md
related_tickets:
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - .ai-workspace/tickets/active/T-195-close-t194-proof-and-release-hygiene.md
  - .ai-workspace/tickets/backlog/B-004-track-odd-service-remote-client-and-consensus-scope-debt.md
  - .ai-workspace/tickets/backlog/T-196-adaptive-high-capacity-agent-overlay-latitude.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-152-gtl-program-conformance-gate-for-typescript-tenant.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-153-consolidate-gtl-contract-law-api-requirement-surface.md
affected_boundary:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/event_store.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/operator/transport.ts
  - build_tenants/typescript/code/src/operator/component_depth_register.ts
  - build_tenants/typescript/code/src/operator/prompt_assets.ts
  - build_tenants/typescript/code/src/operator/review_grade_edge_fulfillment.ts
  - build_tenants/typescript/code/src/operator/live_fp_parallel_materialization_frontier.ts
  - build_tenants/typescript/code/src/operator/decomposition_admission.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/code/src/workspace/project_profile.ts
  - build_tenants/typescript/test_env/tests/
excluded_boundary:
  - adaptive high-capacity overlay latitude (T-196)
  - odd_service HTTP/MCP server promotion (B-004 activation scope)
  - abiogenesis GTL language-law edits except consumption hooks already owned by T-152/T-153
  - new SDLC edge assurance contract families (T-164 matrix already lawful)
  - prompt-only fixes that bypass admitted carriers and deterministic proof
  - retaining synthesized vector lifecycle events as a compatibility shim
target_truth: >-
  odd_sdlc remains the software-domain meaning layer over GTL/ABG. ABG owns
  runtime events, admission, payload ledgers, assurance fold, traversal
  transition, continuation, replay, and frontier scheduling. GTL/abiogenesis owns
  language law, graph algebra, target-carrier contract law, AssetSurface, and
  typecheckGtlProgram(...). odd_service owns session lifecycle, worker registry,
  and transport profiles when promoted. odd_sdlc owns graph overlays, edge
  assurance semantics, compute-stage plugin payloads, product read models,
  prompt overlay policy, workspace conformance ingress, and installed-operator
  UX over admitted ABG truth — including REQ-F-ODDSDLC-077 execution evidence on
  execution-result edges when graph-bound.
superseded_truth: >-
  TypeScript realization may synthesize vector lifecycle events during replay,
  run inline saga frontier scheduling, author runtime events before ABG emit,
  assemble closure/gain/next-action as one local engine, skip in-product
  typecheckGtlProgram consumption, maintain parallel contract-law registries,
  embed worker transport as long-term SDLC core, and encode ecosystem-specific
  path/traversal heuristics as generic SDLC law.
closure_law: >-
  This ticket closes only when the auditability ledger rows A1–D3 and borderline
  rows E1–E5 reach terminal disposition with proof, the ratified design publishes
  IACS, reference-to-target derivation, and module-bounded structural carrier
  diagram for the reconciled boundary, PRODUCT mandatory typecheckGtlProgram
  consumption is wired in product code (not test_env only), no SDLC path
  synthesizes rival ABG runtime facts or frontier scheduling, odd_service
  transport surfaces are carved or explicitly deferred with B-004 linkage, and
  deterministic plus installed proof lanes pass on the reconciled revision.
evaluation_criteria:
  - every ledger row A1–E5 has terminal status, owner, disposition, and proof reference
  - design module extends staged-compute boundary with owner partition table and decommission register for deleted surfaces
  - IACS inventory names every surviving module role without interface bleed across ABG/GTL/odd_service borders
  - reference-to-target derivation maps each deleted or reframed surface to its constitutional owner API
  - typecheckGtlProgram runs in build/start/publish preflight in code/src, not only test_env
  - replayEventsWithGraphContinuationCursor no longer synthesizes vector lifecycle events
  - inline runEventedNativeSagaFrontier is removed from live installed-operator path
  - event authorship routes through ABG/system commands; event_store remains emit sink only
  - closure chain splits product candidate emission from ABG admission/fold/transition
  - component_depth_register, prompt_assets, and review_grade_edge_fulfillment consume abiogenesis carriers without parallel law
  - operator/transport.ts is thin adapter or moved toward odd_service incubation per REQ-F-ODDSVC-002/005
  - path-based parallel lane classifier and deterministic traversal-method selection are removed or reframed as projection-only
proof_surface:
  - ratified design module addendum with IACS, structural carrier diagram, reference-to-target derivation, decommission register
  - focused source tests per wave rejecting deleted authority surfaces
  - test:t194 and in-product GTL gate hook tests on build/start/publish path
  - test:t184 boundary suite remains green after ABG-leakage removals
  - deterministic three-edge assurance chain (T-164) unchanged or strengthened
  - installed lite live proof with graph-owned sdlc_worker_execution_evidence
  - semantic suite on reconciled revision
  - refreshed GAP comment or closure post citing ledger terminal states
non_closure_conditions:
  - ledger rows remain open while code still exercises the old authority path
  - design-method completion claimed without IACS, structural diagram, or reference-to-target assets
  - typecheckGtlProgram remains test_env-only (B1 unresolved)
  - handoff.ts partition (T-184) treated as sufficient without addressing A1–A5 runtime leakage
  - odd_service transport grows deeper session/registry state inside SDLC core instead of carve-out
  - path regexes or decomposition_admission deterministic method pick remain closure authority
  - compatibility shims preserve synthesized events or local frontier scheduling without explicit debt ticket
  - proof relies on harness-only execution evidence instead of graph-bound REQ-077 carriers
---

# T-197: Reconcile Product Boundary And Remove Authority Leakage

## STDO Triage

First missing layer: design.

T-184 removed `operator/handoff.ts` as an architectural home and aligned the
compute-stage partition direction. That work does not close the constitutional
gap identified in the 2026-06-09 product/requirement/code reconciliation:
**authority leakage** — SDLC realization still owns surfaces PRODUCT and
requirements assign to ABG, GTL/abiogenesis, or odd_service.

This backlog ticket records the full audit ledger, required design assets for a
cold-context start, and remediation waves. Activation begins at design re-entry,
not code deletion.

| field | value |
| --- | --- |
| intake | GAP post after T-184 lite-overlay verification and PRODUCT/requirement read |
| lawful change class | `design_reframe` (runtime governance / ownership partition); sub-waves `realization_refactor` |
| lawful re-entry | design — extend `ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md`, reconcile `EDGE_GAIN_CLOSURE` decommission register |
| first missing layer | ratified owner partition design before further authority deletion |
| upstream pressure | T-184 closure cannot claim full runtime-governance alignment while A1–A5 remain |
| downstream proof span | design assets → focused source tests → semantic suite → installed lite live |

## Cold Context Start

An agent or human with no prior session context should read in this order before
changing code:

1. `specification/PRODUCT.md` — GTL/ABG consumption gate, epistemic flow, tenant
   stack boundary
2. `specification/requirements/03-runtime-governance.md` — ABG runtime ownership
3. `specification/requirements/14-odd-sdlc-installed-product-contract.md` —
   installed-operator contract including REQ-F-ODDSDLC-077
4. `specification/requirements/16-edge-gain-closure-contract.md` — lawful SDLC
   edge assurance (keep)
5. `specification/requirements/09-odd-service-orchestration-plane.md` — transport
   debt scope (C-wave)
6. `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md`
   — staged compute one-truth rule (extend, do not contradict)
7. `.ai-workspace/comments/grok/20260609T022918Z_GAP_sdlc-product-requirement-code-reconciliation.md`
   — discovery evidence and row IDs
8. `.ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md`
   — what T-184 already closed vs what remains open
9. `build_tenants/typescript/code/src/operator/abiogenesis_substrate.ts` — documented
   consumed substrate contract (intent baseline)
10. `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
    — IACS, structural carrier diagram, reference-to-target requirements

**Positive baseline (do not regress):**

- `handoff.ts` deleted; compute-stage plugin partition direction is correct
- `event_store.ts` appends through ABG `emit()` as lawful sink
- `assurance_gate.ts` no longer fabricates F_D assurance ledgers for closure
- lite live proof uses graph-owned `sdlc_worker_execution_evidence`
- no odd_service HTTP/MCP server in `code/src`

**This ticket is not:**

- T-196 adaptive overlay latitude
- B-004 odd_service promotion (tracks C-wave carve-out debt)
- T-195 proof hygiene alone (B1 spans product code, not only test_env)
- a license to add compatibility shims that preserve rival runtime truth

## Constitutional Ownership (Compressed)

| Owner | Owns | odd_sdlc must not own |
| --- | --- | --- |
| GTL / abiogenesis | Language law, graph algebra, target-carrier contract law, `AssetSurface`, `abg.fn_composition`, `typecheckGtlProgram(...)` | Second parsers, local GTL conformance engines, parallel contract-law registries |
| ABG | Runtime events, admission, payload ledgers, assurance fold, traversal transition, continuation, replay, frontier scheduling | Shadow runtime loops, locally invented vector lifecycle, rival event authority |
| odd_service (incubating) | Session lifecycle, worker registry, transport profiles, client-safe observation | Rival convergence model or event store |
| odd_sdlc | SDLC edge meaning, overlays, gain/closure interpretation, product assets, analyzer projections, prompt policy overlays, installed Spec Method entry | Domain runtime truth, GTL semantics, orchestration plane |

Mandatory consumption gate (`PRODUCT.md`): ABG `typecheckGtlProgram(...)` before
claiming graph/prompt/plugin conformance in **product code**.

## Lawful SDLC Core (Keep)

These surfaces are in-scope and requirement-backed. Remediation must not delete
them:

- graph publication — `graph/module.ts`, `graph/catalog.ts`, `graph/overlays.ts`
- edge assurance matrix + semantic kernels — `graph/edge_gain_closure_contracts.ts`, `operator/edge_gain_closure.ts`, `operator/traversal_consequence.ts` (product gain/close *meaning* over admitted evidence only)
- compute-stage plugin data — `operator/plugins/transform|evaluate|consequence/*`
- product read models — `projection/*`, `analysis/*`
- prompt overlay policy — `operator/prompt_assets.ts`, `operator/plugins/transform/prompt_edge_policy.ts`
- target-carrier read model — `graph/target_carrier_contracts.ts` when declarations come from graph vectors
- workspace conformance ingress — `workspace/project_profile.ts`
- installed Spec Method entry — `spec_method/entry.ts`, `start/public_start.ts` (ignition only)
- scenario/test harness — `test_env/sandbox/*` as proof setup, not closure authority
- REQ-F-ODDSDLC-077 AC-4 execution evidence on execution-result edges when graph-bound

## Auditability Ledger

Terminal `status` values: `open`, `design_locked`, `in_progress`, `done`,
`deferred`, `wont_fix`. Every transition must cite proof (test name, archive id,
or design section).

### Wave A — ABG-owned runtime truth (defect / active leakage)

| id | code surface | owner | verdict | disposition | proof required | status |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | `installed_operator.ts` `replayEventsWithGraphContinuationCursor` (L1765–1840) synthesizes `vector_traversal_planned`, `vector_evaluated`, `vector_closed` | ABG | fail REQ-F-RUNTIME-001 | delete/reframe as read-only replay repair; require ABG continuation events | source test rejects synthesis; replay uses ABG-emitted facts only | open |
| A2 | `installed_operator.ts` `executeInstalledOperatorStartWithReentry` (L10170+) multi-attempt convergence loop | ABG / installed UX | partial fail REQ-F-RUNTIME-002 | reframe: one admitted ABG turn per invocation unless substrate owns `--until converged` | installed test proves single-turn default; substrate flag documented | open |
| A3 | `installed_operator.ts` inline `runEventedNativeSagaFrontier` (L2813+) during operator audit | ABG | fail REQ-F-RUNTIME-005 | move scheduling to ABG; SDLC keeps DAG compilation (`feature_dependency_dag.ts`) projection-only | grep + source test; live path uses ABG frontier | open |
| A4 | `event_store.ts` + callers constructing events locally before `emit()` | ABG | fail REQ-F-RUNTIME-001 AC-1 | move authorship to ABG/system APIs; keep append as sink only | source test enumerates construct-before-emit sites; each reframed | open |
| A5 | `traversal_consequence.ts` + `installed_operator.ts` closure chain assembling fulfillment ledger, edge gain, closure decision, next-action locally | ABG + SDLC split | partial fail REQ-F-ODDSDLC-074/076/086 | split: SDLC emits typed candidates; ABG admits fold/transition; archives project admitted facts | three-edge chain proves admission boundary | open |

**Note:** `appendOddSdlcRuntimeEvents` through ABG `emit()` (T-184) is lawful
**sink** pattern. Defect is **who constructs events**, not the file append.

### Wave B — GTL / abiogenesis contract law (defect / consumption gap)

| id | code surface | owner | verdict | disposition | proof required | status |
| --- | --- | --- | --- | --- | --- | --- |
| B1 | no `typecheckGtlProgram` / `admitGtlProgramConformanceInput` in `code/src/` (only `test_env/tests/test_t194_*`) | GTL/ABG | fail PRODUCT gate | wire ABG gate into build/start/publish preflight | product-path test + T-195 hygiene | open |
| B2 | `component_depth_register.ts` local contract enums/protocols | GTL read model | risk parallel law | reframe as read model over GTL declarations; reject local wrapper refs | T-153 owner audit test | open |
| B3 | `prompt_assets.ts` SDLC prompt kind/version/family registers | GTL AssetSurface + SDLC policy | risk parallel law | keep overlay policy; delete structural duplication beyond policy validation | T-194 prompt family proof | open |
| B4 | `review_grade_edge_fulfillment.ts` local binding construction | abiogenesis carrier | fail one-truth | consume only published abiogenesis binding constructors | T-194 binding proof; no `rows[0]` fallback | open |

### Wave C — odd_service orchestration (debt / premature embedding)

| id | code surface | owner | verdict | disposition | proof required | status |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | `operator/transport.ts` worker spawn, executor profiles, agent CLI routing | odd_service | debt REQ-F-ODDSVC-002/005 | carve toward odd_service incubation; thin SDLC adapter | B-004 linkage; adapter surface test | open |
| C2 | `install/instruction_files.ts` documents `--until converged --worker process://...` | odd_service UX | acceptable docs | keep docs; no service/session state in SDLC core | doc-only; no new registry in SDLC | open |
| C3 | no standalone odd_service server (positive) | odd_service | pass | keep absent until promotion | grep proves no HTTP/MCP server | done |

### Wave D — generic ecosystem law as SDLC branches (defect)

| id | code surface | owner | verdict | disposition | proof required | status |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | `live_fp_parallel_materialization_frontier.ts` `classifySdlcLiveParallelModuleLane` path regexes | tenant stack | fail PRODUCT / REQ-085 | delete path heuristics; derive lanes from admitted tenant stack | source test rejects `src/`/`index.tsx` regex authority | open |
| D2 | `decomposition_admission.ts` `dependencyTraversalMethod` deterministic steel_thread/parallel/serial | evaluator | fail REQ-F-ODDSDLC-082 | reframe: F_D admits map; evaluator-selected method admitted as carrier | admission test proves no SDLC method pick | open |
| D3 | `start/public_start.ts` bootstrap hop/decomposition from profile literals | projection | fail REQ-082 AC-10 | mark projection-only until archived complexity evidence | start path labeled projection; no closure authority | open |

### Borderline / drift-prone (track, do not auto-delete)

| id | code surface | assessment | disposition | proof required | status |
| --- | --- | --- | --- | --- | --- |
| E1 | `plugins/consequence/edge_projection.ts` `runInstalledOperatorShardCommand` | lawful per REQ-077 AC-4 if graph-bound | keep; verify bind-chain stage only | lite live `sdlc_worker_execution_evidence` on execution edge | open |
| E2 | `assurance_gate.ts` empty ledgers | aligned post T-184 | keep stub; no closure authority | caller audit | done |
| E3 | `closure_state_machine.ts` string-ref heuristics | weak typing vs REQ-086 | replace with typed carrier inputs | typed transition test | open |
| E4 | `feature_dependency_dag.ts` topological order | lawful if projection-only | audit callers; document projection role | caller grep + design note | open |
| E5 | `qualification/*`, `enterprise_core_iteration_sandbox.ts` | product proof lanes | keep; not traversal truth | qualification tests remain non-closure | open |

## Requirement Reconciliation Matrix

| requirement | code reality (2026-06-09) | verdict | ledger |
| --- | --- | --- | --- |
| REQ-F-RUNTIME-001 ABG owns runtime facts | SDLC synthesizes vector cursor events | fail | A1 |
| REQ-F-RUNTIME-002 no shadow runtime | convergence/reentry + local closure engine | partial fail | A2, A5 |
| REQ-F-RUNTIME-005 ABG owns frontier | inline saga frontier in installed operator | fail | A3 |
| REQ-F-RUNTIME-006 ontology split | substrate doc correct; installed_operator contradicts | intent pass / impl fail | A1–A5 |
| REQ-F-ODDSDLC-077 execution evidence on execution edges | consequence projection; lite live passes | pass (stage debt) | E1 |
| PRODUCT mandatory `typecheckGtlProgram` | test_env only | fail | B1 |
| PRODUCT tenant stack not generic law | path-based lane classifier | fail | D1 |
| REQ-F-ODDSDLC-082 evaluator-selected depth | deterministic method pick | fail | D2, D3 |
| REQ-F-ODDSDLC-063..068 edge assurance | matrix + kernels | pass | — |
| REQ-F-ODDSVC-002 transport/session | embedded in transport.ts | debt | C1 |

## Remediation Waves

Execute in order. Each wave needs design-locked disposition before code deletion.

### Wave 1 — Stop ABG authority leakage

1. A1: remove or gate `replayEventsWithGraphContinuationCursor` event synthesis
2. A3: remove inline `runEventedNativeSagaFrontier` from live operator path
3. A4/A5: route event authorship through ABG/system; split closure chain
4. A2: reframe installed convergence loop to substrate-owned `--until converged`

Suggested sub-ticket shape: extend T-184 runtime-governance slice or spawn
`T-197-A` active child when design locks.

### Wave 2 — Consume constitutional gates (GTL/ABG)

1. B1: wire `typecheckGtlProgram(...)` into TS build/start/publish preflight
2. B2–B4: audit parallel law surfaces; consume abiogenesis carriers only

Coordinate with T-195 for proof hygiene; T-197 owns **product code hook**, not
only test_env.

### Wave 3 — Extract orchestration (odd_service)

1. C1: carve `operator/transport.ts` toward odd_service incubation
2. keep SDLC entry as thin wrapper per REQ-F-ODDSVC-003
3. link deferred scope to B-004; do not grow SDLC into service runtime

### Wave 4 — Remove generic ecosystem law

1. D1: delete path-based parallel lane classifier
2. D2/D3: make traversal method evaluator-admitted, not SDLC-chosen

## Required Design Assets (Before Wave-1 Code)

Per `DESIGN_MODULE_METHOD.md`, design-method completion for this boundary
requires:

### 1. Irreducible Architectural Carrier Set (IACS)

Publish module inventory with:

- owner classification per module (`SDLC product`, `ABG consumer`, `GTL read model`, `odd_service adapter`, `proof harness`)
- visibility rule (public export vs internal)
- effect membrane (file write, process spawn, event emit, ledger read)
- deferred-family markers for C1 until odd_service promotion

### 2. Module-Bounded Structural Carrier Diagram

Mermaid or equivalent showing:

```text
GTL graph program
  -> SDLC edge policy / overlays
  -> ABG selected composition
  -> plugin.transform.C / evaluate.C / consequence.C
  -> ABG admit / write / fold / transition
  -> SDLC read-model projections only
```

Explicitly mark **deleted paths**: synthesized replay events, inline saga
frontier, local event construction, local closure fold.

### 3. Reference-To-Target Derivation Asset

Table mapping each ledger row surface to:

- constitutional owner API or carrier
- current SDLC call site
- target call site or deletion
- proof test name

### 4. Decommission Register

Named surfaces removed or reframed (extends T-184 decommission pattern):

- `replayEventsWithGraphContinuationCursor` synthesis
- inline `runEventedNativeSagaFrontier` in live path
- construct-before-emit event sites (enumerated)
- path regex lane classifier
- deterministic `dependencyTraversalMethod` selection

Target design path:
`build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md`
(addendum section `T-197 Owner Partition And Decommission Register`).

## Work Ledger (Ticket-Level)

| id | task | closure proof | status |
| --- | --- | --- | --- |
| W-000 | Ratify cold-context read order and ledger in this ticket | ticket exists; GAP post linked | done |
| W-010 | Publish IACS for reconciled operator/runtime boundary | design section + module inventory | open |
| W-020 | Publish structural carrier diagram | design mermaid/diagram | open |
| W-030 | Publish reference-to-target derivation for A1–D3 | design table with call sites | open |
| W-100 | Wave 1 design lock | design review; A1–A5 dispositions signed | open |
| W-110 | Wave 1 realization | focused tests; semantic green | open |
| W-200 | Wave 2 design lock + B1 product hook | preflight gate test in code/src | open |
| W-300 | Wave 3 carve-out design | B-004 updated; adapter boundary test | open |
| W-400 | Wave 4 hygiene | D1–D3 source tests | open |
| W-500 | Closure post refresh GAP comment statuses | all ledger rows terminal | open |

## Highest-Risk Surfaces (Priority Order)

1. synthesized vector lifecycle events (`replayEventsWithGraphContinuationCursor`)
2. inline saga frontier scheduling in `installed_operator.ts`
3. missing in-product `typecheckGtlProgram` consumption
4. generic path/traversal heuristics (`live_fp_parallel_materialization_frontier.ts`, `decomposition_admission.ts`)
5. embedded worker transport (`operator/transport.ts`)

## Links

- discovery: `.ai-workspace/comments/grok/20260609T022918Z_GAP_sdlc-product-requirement-code-reconciliation.md`
- compute partition: `.ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md`
- GTL proof hygiene: `.ai-workspace/tickets/active/T-195-close-t194-proof-and-release-hygiene.md`
- odd_service debt: `.ai-workspace/tickets/backlog/B-004-track-odd-service-remote-client-and-consensus-scope-debt.md`
- abiogenesis gate: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-152-gtl-program-conformance-gate-for-typescript-tenant.md`
- contract-law API: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-153-consolidate-gtl-contract-law-api-requirement-surface.md`
- staged compute design: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md`