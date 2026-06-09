---
id: T-197
title: Reconcile product boundary and remove authority leakage
type: chore
ticket_category: implementation_migration
status: active
proof_status: pending
goal: preserve odd_sdlc as the software-domain meaning layer over GTL/ABG without rival runtime, GTL, orchestration, or governed-target identity encoded as framework law
build_tenant: typescript
owner: odd_sdlc
change_intent: >-
  Merge the vertical constitutional-reconciliation axis (ABG/GTL/odd_service
  authority leakage) and the horizontal target-identity axis (downstream
  tenant/tech/domain literals leaking into generic framework source). Ratify
  owner partition design, execute remediation waves with per-finding verification,
  and close the T-152/T-153 consumer gap by wiring typecheckGtlProgram into
  product code before further runtime/live proof claims.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-06-09
created_at: 2026-06-09
updated_at: 2026-06-09
activated_at: 2026-06-09
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
  - .ai-workspace/comments/claude/20260609T025417Z_GAP_framework-code-out-of-scope-reconciliation.md
related_tickets:
  - .ai-workspace/tickets/completed/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - .ai-workspace/tickets/completed/T-195-close-t194-proof-and-release-hygiene.md
  - .ai-workspace/tickets/backlog/T-198-prove-data-mapper-breadth-live-after-t197-boundary-cleanup.md
  - .ai-workspace/tickets/backlog/B-004-track-odd-service-remote-client-and-consensus-scope-debt.md
  - .ai-workspace/tickets/backlog/T-196-adaptive-high-capacity-agent-overlay-latitude.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-152-gtl-program-conformance-gate-for-typescript-tenant.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-153-consolidate-gtl-contract-law-api-requirement-surface.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/backlog/T-154-expose-runtime-authorship-routes-for-downstream-resume-and-span-reentry.md
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
  - build_tenants/typescript/code/src/operator/plugins/transform/result_projection.ts
  - build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts
  - build_tenants/typescript/code/src/operator/plugins/transform/prompt_edge_policy.ts
  - build_tenants/typescript/code/src/operator/plugins/evaluate/postflight_checks.ts
  - build_tenants/typescript/code/src/operator/product_materialization/authority.ts
  - build_tenants/typescript/code/src/operator/plugins/consequence/repair_reentry.ts
  - build_tenants/typescript/code/src/workspace/project_profile.ts
  - build_tenants/typescript/code/src/workspace/source_input.ts
  - build_tenants/typescript/code/src/analysis/
  - build_tenants/typescript/code/src/qualification/enterprise_core_inventory.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/test_env/tests/
excluded_boundary:
  - adaptive high-capacity overlay latitude (T-196)
  - odd_service HTTP/MCP server promotion (B-004 activation scope)
  - abiogenesis GTL language-law edits except consumption hooks already owned by T-152/T-153
  - new SDLC edge assurance contract families (T-164 matrix already lawful)
  - prompt-only fixes that bypass admitted carriers and deterministic proof
  - retaining synthesized vector lifecycle events as a legacy shadow path
  - deleting lawful worker-transport backend routing (codex/claude agent CLI axis per REQ-F-ODDSDLC-051/052/053) — only grammar extraction and odd_service trajectory apply
target_truth: >-
  odd_sdlc remains the software-domain meaning layer over GTL/ABG. ABG owns
  runtime events, admission, payload ledgers, assurance fold, traversal
  transition, continuation, replay, and frontier scheduling. GTL/abiogenesis owns
  language law, graph algebra, target-carrier contract law, AssetSurface, and
  typecheckGtlProgram(...). odd_service owns session lifecycle, worker registry,
  and transport profiles when promoted. odd_sdlc owns graph overlays, edge
  assurance semantics, compute-stage plugin payloads, product read models,
  prompt overlay policy, workspace conformance ingress, and installed-operator
  UX over admitted ABG truth. The generic framework must not encode governed-target
  identity (data_mapper, hello_world, mapper_requirements.md, CDME subsystems),
  downstream stack command grammar, or tenant-specific layout as product law.
superseded_truth: >-
  TypeScript realization may synthesize vector lifecycle events during replay,
  run inline saga frontier scheduling, author runtime events before ABG emit,
  assemble closure/gain/next-action as one local engine, skip in-product
  typecheckGtlProgram consumption, maintain parallel contract-law registries,
  embed worker transport as long-term SDLC core, encode ecosystem-specific
  path/traversal heuristics as generic SDLC law, and hard-code one governed
  target's requirements filename, subsystem inventory, and analysis profile enum
  across framework modules.
closure_law: >-
  This ticket closes only when every ledger row reaches terminal disposition with
  proof, the ratified design publishes IACS, reference-to-target derivation, and
  module-bounded structural carrier diagram, typecheckGtlProgram runs in product
  build/start/publish preflight (B1), no SDLC path synthesizes rival ABG runtime
  facts without an explicit deferred debt row, mapper_requirements.md and named-target
  profile enums are absent from framework authority law (H-cluster), and
  deterministic plus installed proof lanes pass on the reconciled revision.
evaluation_criteria:
  - merged vertical + horizontal ledger rows all terminal with proof references
  - B1 wired in code/src before wave-1 ABG deletion work claims closure
  - A1 verified synthesis removed or reframed with ABG continuation events only
  - design module extends staged-compute boundary with owner partition and decommission register
  - IACS names module roles without interface bleed across ABG/GTL/odd_service/target-identity borders
  - reference-to-target derivation maps each deleted surface to constitutional owner API
  - H1 mapper_requirements.md absent from lineage rankers and authority ingress
  - H3 enterprise_core_inventory is either absent from product/live default gates or consumes admitted tenant authority instead of frozen CDME names
  - analysis profile space open to admitted tenant spec; only generic default in source
  - B1 product-path preflight feeds the live SDLC graph/prompt/plugin inventory to `typecheckGtlProgram(...)`, not an empty, synthetic, or partial manifest
  - W-105 records ABG/GTL sufficiency for every Wave-1 authority removal: use an existing ABG/GTL route when present; otherwise file or link an upstream ABG/GTL dependency before SDLC code deletes or substitutes the authority
  - P1-P3 transferred T-184 proof residuals are terminal with proof or explicit deferral
  - path regex lane classifier and deterministic traversal-method selection removed or projection-only
  - transport lawful as worker backend now; C1a carve-out or B-004 deferral documented; C1b grammar in declared capability asset
proof_surface:
  - ratified design module addendum with IACS, structural carrier diagram, reference-to-target derivation, decommission register
  - focused source tests per ledger row rejecting deleted authority surfaces
  - in-product GTL gate hook tests on build/start/publish path (B1) with non-trivial production inventory coverage
  - test:t194 remains green; T-195 hygiene closed; broader B1 product-code gate owned here
  - test:t184 boundary suite remains green after ABG-leakage removals
  - P-series production-path proof rows inherited from T-184 are terminal
  - horizontal-axis grep tests (no mapper_requirements.md in framework rankers; no closed hello_world/data_mapper enum)
  - deterministic three-edge assurance chain (T-164) unchanged or strengthened
  - installed lite live proof with graph-owned sdlc_worker_execution_evidence
  - semantic suite on reconciled revision
  - closure post refreshing both GAP comments with terminal ledger states
non_closure_conditions:
  - B1 remains test_env-only while claiming constitutional alignment
  - A-section rows deleted without adversarial verification pass documented in ledger
  - A-section rows replace missing ABG/GTL capability with SDLC-local substitutes instead of recording an upstream ABG/GTL dependency
  - design-method completion claimed without IACS, structural diagram, or reference-to-target assets
  - handoff.ts partition (T-184) treated as sufficient without A1–A5 and H-cluster work
  - mapper_requirements.md or ENTERPRISE_CORE_COMPONENTS remain default framework gate truth
  - legacy shadow paths preserve synthesized events or local frontier scheduling without debt ticket
  - proof relies on harness-only execution evidence instead of graph-bound REQ-077 carriers
---

# T-197: Reconcile Product Boundary And Remove Authority Leakage

## STDO Triage

First missing layer: design.

Two independent reconciliation passes on 2026-06-09 answered **different
questions under the same prompt**. This ticket merges them into one governed
active cleanup surface with a unified audit ledger, verification status, and
wave sequencing.

| field | value |
| --- | --- |
| intake | merged GAP posts (grok vertical + claude horizontal) after T-184 lite-overlay verification |
| lawful change class | `design_reframe` for vertical waves A–C; `realization_refactor` for horizontal wave H and parts of D |
| lawful re-entry | design — extend `ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md` |
| first missing layer | ratified owner partition + verification-gated disposition before deletion |
| upstream pressure | T-184 closed handoff partition; constitutional and target-identity gaps remain |
| downstream proof span | design assets → B1 product hook → verified deletions → semantic + installed proof |

T-197 runs alongside the T-164 edge-assurance baseline. Wave 1 A5 (closure
admission split) intersects T-164 runtime carriage; Wave 0 B1 and the H/D
realization-refactor rows do not block the T-164 matrix/semantic proof, but
must not claim runtime-carriage closure without the T-197 design lock.

## Supersession Hygiene - 2026-06-09

T-197 is now the sole active cleanup authority for the T-184/T-195 residual
cluster.

- T-184 is completed as the compute-stage handoff partition slice. Its remaining
  generated-asset production proof, data-mapper live breadth proof, and
  design-method owner-partition residuals are transferred into this ticket's
  A/B/H ledger rows instead of keeping T-184 open as a second active authority
  surface.
- T-195 is completed as T-194 release/proof hygiene. T-194's pending commit
  evidence is resolved to checkpoint commit `6af364e`; the broader in-product
  `typecheckGtlProgram(...)` hook is not T-195 scope and remains P0/B1 here.
- The GAP comments remain commentary inputs. Their terminal owner is this active
  ticket, not a backlog ticket or either completed predecessor.

### Dual-Axis Model

```text
VERTICAL (constitutional ownership)          HORIZONTAL (target-identity leakage)
grok GAP + ledger A–E                        claude GAP + ledger H + R1–R7
─────────────────────────────────            ─────────────────────────────────
ABG runtime synthesis (A1–A5)                mapper_requirements.md recurrence (H1)
GTL gate + parallel law (B1–B4)            named-target enums/profiles (H2)
odd_service trajectory (C1a)                 CDME default/sandbox gates (H3–H4)
ecosystem heuristics (D1–D3)                 npm/Scala defect grammar (H5–H7)
                                             test35 branding (H8–H9)
```

Neither axis alone is complete. Together they are the full "what should not be
in SDLC" picture for `build_tenants/typescript/code/src`.

### Peer Evidence

| post | axis | method | findings |
| --- | --- | --- | --- |
| grok `20260609T022918Z_GAP_sdlc-product-requirement-code-reconciliation.md` | vertical | owner partition from PRODUCT + REQ 03/09/14/16/18 | ~20 architectural rows |
| claude `20260609T025417Z_GAP_framework-code-out-of-scope-reconciliation.md` | horizontal | 12-unit scan + adversarial verify | 26 confirmed / 17 rejected |

Claude's rejected list is **negative evidence** for this ticket: do not re-flag
those surfaces during remediation.

## Cold Context Start

Read in this order before changing code:

1. `specification/PRODUCT.md` — GTL/ABG consumption gate, epistemic flow, tenant stack boundary, technology-capability law
2. `specification/requirements/03-runtime-governance.md` — ABG runtime ownership
3. `specification/requirements/14-odd-sdlc-installed-product-contract.md` — installed-operator contract including REQ-F-ODDSDLC-077
4. `specification/requirements/16-edge-gain-closure-contract.md` — lawful SDLC edge assurance (keep)
5. `specification/requirements/09-odd-service-orchestration-plane.md` — transport debt scope
6. `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md` — staged compute one-truth rule
7. **This ticket** — merged ledger, verification column, wave order
8. grok GAP — vertical discovery evidence
9. claude GAP — horizontal discovery evidence + 17 rejected false positives
10. `.ai-workspace/tickets/completed/T-184-partition-handoff-into-compute-stage-boundary-modules.md` — what T-184 closed
11. `build_tenants/typescript/code/src/operator/abiogenesis_substrate.ts` — consumed substrate contract
12. `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md` — IACS, structural diagram, reference-to-target

**Positive baseline (do not regress):**

- `handoff.ts` deleted; compute-stage plugin partition direction is correct
- `event_store.ts` appends through ABG `emit()` as lawful sink
- `assurance_gate.ts` no longer fabricates F_D assurance ledgers for closure
- lite live proof uses graph-owned `sdlc_worker_execution_evidence`
- no odd_service HTTP/MCP server in `code/src`
- worker transport backend (codex/claude CLI routing) is lawful F_P worker realization per REQ-F-ODDSDLC-051/052/053 (claude rejected list)

**This ticket is not:** T-196, B-004 promotion, T-195 alone, or worker-backend deletion.

## Activation Policy

- Wave 0 B1 may start immediately as a `realization_refactor` because the ABG
  conformance gate already exists and the product-code consumption gap is
  verified.
- B1 is not satisfied by invoking `typecheckGtlProgram(...)` over a caller-made
  empty or partial manifest. It must feed the live TypeScript graph program,
  target-carrier, edge-closure, overlay, public-start, prompt-asset,
  plugin-contract, source-identity, and T-153 feature-coverage surfaces used by
  the production catalog.
- Wave 5 H1/H3 may start as bounded `realization_refactor` work where it routes
  through existing generic authority channels (`importedSourceRelativePaths`,
  admitted tenant profiles, and tenant capability carriers) and does not touch
  A-row runtime authorship.
- Wave 1 A-row realization must wait for W-006 plus W-010/W-020/W-030 design
  assets. A1/A4 are verified defects. A2/A3/A5 are verified owner-boundary
  tensions and must not be deleted until the design lock names the target ABG
  API or the lawful SDLC thin-caller/read-model role.
- If a wave becomes too large for one active slice, spawn child execution
  tickets (`T-197-W0`, `T-197-H1`, etc.) that name this ticket as authority and
  update the work ledger here.

## Execution Plan - 2026-06-09

This is the operative plan for executing T-197 after the Grok/Claude reviews.

| phase | work | change class | gate |
| --- | --- | --- | --- |
| 0 | W-006/W-007 adversarial verification for A2/A3/A5/H3; tighten B1 and P2 dispositions | commentary + ledger | no code changes; line-level proof post |
| 1 | W-010/W-020/W-030 owner partition design addendum: IACS, structural carrier diagram, reference-to-target derivation, decommission register | `design_reframe` | blocks Wave 1 A-row code |
| 2 | W-050 Wave 0 B1: wire product-code `typecheckGtlProgram(...)` preflight over live SDLC inventory | `realization_refactor` | non-trivial production inventory; empty/partial manifest fails |
| 3 | W-500 horizontal hygiene, starting H1 and probe-only H3 containment | `realization_refactor` | grep/source tests per row |
| 4 | W-100/W-110 Wave 1 ABG authority split in order A4 -> A1 -> A3 -> A5 -> A2 | `design_reframe` then `realization_refactor` | design lock plus T-164 edge-assurance proof unchanged |
| 5 | W-200/W-300/W-400 vertical cleanup B/C/D rows | `realization_refactor` unless verification proves a design gap | row tests and semantic proof |
| 6 | W-040 P-series residuals: P1/P3 stay here; P2 is deferred to T-198 | proof cleanup | terminal P rows or explicit successor |
| 7 | W-600 closure | closure | all ledger rows terminal; deterministic + installed proof green |

Critical path: Phase 0 -> Phase 1 design lock -> A4/A1 -> A5 with T-164 gate
-> closure. Fast wins that may run before design lock: B1 and H1.

Phase 0 dispositions recorded on 2026-06-09:

- B1 acceptance is pinned to the live SDLC graph/prompt/plugin/public-start
  inventory and T-153 feature coverage. A call over an empty, partial, or
  caller-fabricated manifest is non-closure.
- P2 data-mapper breadth live proof is not part of T-197's closure law because
  this ticket's installed proof lane is the lite live lane with graph-owned
  `sdlc_worker_execution_evidence`. P2 is deferred to T-198 and does not block
  T-197 unless closure law is later repriced.
- A2, A3, and A5 remain design-lock rows. Verification found real boundary
  tension, not a safe immediate deletion target.
- H3 is probe-only in current reachability and is downgraded from live/default
  gate severity; remediation is containment or relocation of the B-068 fixture
  surface.

## Constitutional Ownership (Vertical Frame)

| Owner | Owns | odd_sdlc must not own |
| --- | --- | --- |
| GTL / abiogenesis | Language law, graph algebra, target-carrier contract law, `AssetSurface`, `abg.fn_composition`, `typecheckGtlProgram(...)` | Second parsers, local GTL conformance engines, parallel contract-law registries |
| ABG | Runtime events, admission, payload ledgers, assurance fold, traversal transition, continuation, replay, frontier scheduling | Shadow runtime loops, locally invented vector lifecycle, rival event authority |
| odd_service (incubating) | Session lifecycle, worker registry, transport profiles, client-safe observation | Rival convergence model or event store long-term |
| odd_sdlc | SDLC edge meaning, overlays, gain/closure interpretation, product assets, analyzer projections, prompt policy overlays, installed Spec Method entry | Domain runtime truth, GTL semantics, orchestration plane, **governed-target identity as framework law** |

Mandatory consumption gate (`PRODUCT.md`): ABG `typecheckGtlProgram(...)` before
claiming graph/prompt/plugin conformance in **product code**.

## Forbidden Categories (Horizontal Frame)

From claude scope model (CLAUDE.md §6, REQ-F-ODDSDLC-011/017/032/046/087):

- **downstream-tech-specific-command-grammar** — npm/cargo/pytest/sbt syntax in framework classifiers
- **tenant-stack-truth / hardcoded-tenant-fixture-paths** — stack layout and manifest names as SDLC law
- **domain-identity-of-target-project** — target purpose, subsystem names, idiosyncratic filenames in framework source
- **tech-specific-prompt-launch-knowledge-and-defect-grammars** — stack launch knowledge and defect needles as product law
- **deterministic-domain-optimization-presumed-from-observed-tech** — trivial/optimized path without declared capability

**Load-bearingness rule:** a literal is a violation only when it participates in
classification, ranking, blocking gates, or closure law — not when it is an
inert disjunct or existence-gated default (claude rejected class).

## Lawful SDLC Core (Scoped Keep)

Keep these surfaces; remediation must not delete lawful core behavior:

- graph publication — `graph/module.ts`, `graph/catalog.ts`, `graph/overlays.ts`
- edge assurance matrix + semantic kernels — `graph/edge_gain_closure_contracts.ts`, `operator/edge_gain_closure.ts`, `operator/traversal_consequence.ts` (product gain/close *meaning* over admitted evidence)
- compute-stage plugin data — `operator/plugins/transform|evaluate|consequence/*`
- product read models — `projection/*`
- analysis tooling — `analysis/*` **as generic F_D run analysis** (not closed over named targets; see H2)
- prompt overlay policy — `operator/prompt_assets.ts`, `operator/plugins/transform/prompt_edge_policy.ts` (policy over GTL `AssetSurface`)
- target-carrier read model — `graph/target_carrier_contracts.ts`
- workspace conformance ingress — `workspace/project_profile.ts` (generic channels only after H1)
- installed Spec Method entry — `spec_method/entry.ts`, `start/public_start.ts` (`framework_smoke` paths lawful when `trivial_product` admitted — claude verified)
- qualification harnesses — non-exported proving fixtures in `test_env/` (not default blocking gate truth — see H3)
- REQ-F-ODDSDLC-077 AC-4 execution evidence on execution-result edges when graph-bound

## Unified Auditability Ledger

Terminal `status`: `open`, `verified`, `design_locked`, `in_progress`, `done`,
`deferred`, `rejected`. Every transition cites proof (test, archive, design §,
or verification note).

`verification` column records adversarial pass outcome where run.

---

### P0 — GTL consumption gap (top priority across both posts)

| id | code surface | axis | owner | verdict | verification | disposition | proof required | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **B1** | zero `typecheckGtlProgram` / `admitGtlProgramConformanceInput` usage in `code/src/` (only `test_env/tests/test_t194_*`) | vertical | GTL/ABG | **fixed** | **done 2026-06-09** — `gtl_conformance/program.ts` builds the live SDLC graph/prompt/plugin/source inventory and calls ABG `admitGtlProgramConformanceInput(...)` + `typecheckGtlProgram(...)`; `start/public_start.ts`, `spec_method/entry.ts`, `release/release_cut.ts`, `release/release_snapshot.ts`, and `build:semantic` call `assertCurrentSdlcGtlProgramConformance(...)` | product-code ABG gate now uses `constructSdlcGraphFunctionCatalog()`, `constructSdlcGtlModule()`, `constructSdlcTargetCarrierRegistry(...)`, edge-closure contracts, overlay catalog, public starts, prompt assets, plugin contracts, source identities, and T-153 feature coverage; installed packages use a packaged source-identity row when source-tree scan roots are absent | `test:t194` 2/2 and `test:t197` 6/6 prove non-trivial production coverage: graph functions/vectors > 0; target-carrier and edge-closure counts equal graph-vector count; prompt assets = 3; plugin contracts = 5; source identities > 0; installed-package source identity = 1; issueCount = 0; missing target-carrier rows fail closed | done |

Closes the loop on abiogenesis T-150/T-152/T-153: gate built in substrate; SDLC
consumer does not call it.

---

### Wave A — ABG-owned runtime truth (vertical)

| id | code surface | owner | verdict | verification | disposition | proof required | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | `installed_operator.ts` `replayEventsWithGraphContinuationCursor` (L1765–1840) | ABG | fail REQ-F-RUNTIME-001 | **verified synthesis** — for prior unclosed vector indexes, calls `constructVectorTraversalPlannedEvent`, `constructVectorEvaluatedEvent`, `constructVectorClosedEvent` (L1815–1830); merged into replay at L1836–1838; appended at L8990–8994. Also filters existing `vector_closed` (L1733/1797) — both read and synthesize. | design-locked in staged-compute addendum: require ABG continuation events; delete synthetic cursor construction | source test rejects `cursorEvents.length > 0` on conform path without ABG authorship | design_locked |
| A2 | `installed_operator.ts` `executeInstalledOperatorStartWithReentry` (L10170+) | ABG / UX | design-lock needed | **verified tension** — bounded loop selects max attempts from runtime policy (L10195–10199), re-runs `executeInstalledOperatorStart(...)` (L10205–10218), evaluates closure/re-entry blockers (L10238–10280), derives retry context (L10286–10292), and refreshes replay state through the supplied callback (L10293–10296). This is a real multi-attempt installed loop, but not enough evidence to call it rival ABG runtime before the A5 closure boundary is locked. | design-locked in staged-compute addendum: ratify as installed UX over admitted ABG turns or move convergence ownership into an ABG continuation API after A5 defines the fold/transition boundary | adversarial note plus installed single-turn/until-converged ownership test | design_locked |
| A3 | `installed_operator.ts` inline `runEventedNativeSagaFrontier` (L2813+) live parallel materialization | ABG | design-lock needed | **verified tension** — SDLC compiles DAG, builds policy/tasks locally, and calls ABG frontier with local `eventSink` (L2813–2846); artifact names `executionAuthority: "abg_evented_saga_frontier"` and `parallelismControl: "abg_branch_execution_policy"` (L2851–2854). It uses an ABG frontier API, so Wave 1 must decide whether this is lawful orchestration of an ABG primitive or rival scheduler ownership before moving it. | design-locked in staged-compute addendum: either move live parallel dispatch behind an ABG-owned entry or explicitly ratify SDLC as a thin caller over ABG scheduling while keeping DAG compilation projection-only | source test; live path audit; design disposition | design_locked |
| A4 | `event_store.ts` + callers constructing events before `appendOddSdlcRuntimeEvents` | ABG | fail REQ-F-RUNTIME-001 AC-1 | **verified** — `constructVector*` / `constructGraphSpan*` / `constructFdAuthority*` at L1816+, L1924+, L5645+, L8991+, L9984+ before append. Sink lawful; authorship is defect. | design-locked in staged-compute addendum: move authorship to ABG/system APIs; enumerate and rehome each construct site | construct-site inventory test | design_locked |
| A5 | `traversal_consequence.ts` + `installed_operator.ts` closure chain | ABG + SDLC | design-lock needed | **verified tension** — SDLC constructs worksite evidence, edge gain, residual pressure, edge ledger, closure decision, next-action projection, admitted-state ref, and consequence projection in one chain (`installed_operator.ts` L7936–8289). The closure constructor validates assurance-drift and derives disposition from ledger/edge-assurance/policy inputs (`traversal_consequence.ts` L751–989, L991–1235). Product meaning is real; final admission/fold/transition ownership needs design split before code deletion. | design-locked in staged-compute addendum: SDLC may construct product candidates/read models over admitted evidence; ABG must own any final runtime fold, transition, continuation, and replay truth if the chain claims closure authority | adversarial note plus three-edge chain admission boundary test | design_locked |

**A-section gate:** do not delete A1/A3/A4 code until design locks target ABG
API or owner boundary for each construct site. Verification confirms A1/A4
defects and A3 tension; disposition still needs design reframe, not blind
deletion.

**Lawful sink note (A4):** `appendOddSdlcRuntimeEvents` through ABG `emit()`
(T-184) is lawful. Defect is **who constructs events**.

---

### Wave B — GTL / abiogenesis contract law (vertical, after B1)

| id | code surface | owner | verdict | verification | disposition | status |
| --- | --- | --- | --- | --- | --- | --- |
| B2 | `component_depth_register.ts` local contract enums/protocols | GTL read model | risk parallel law | architectural | reframe as read model over GTL declarations | open |
| B3 | `prompt_assets.ts` SDLC prompt registers + clause schema | GTL + policy | risk parallel law | architectural | keep overlay policy; delete structural duplication | open |
| B4a | `review_grade_edge_fulfillment.ts` GTL contract-fulfillment binding constructor/admitter usage | abiogenesis | baseline lawful | **verified current** — imports `constructGtlContractFulfillmentBinding` and `admitGtlContractFulfillmentBinding` from `@abiogenesis/typescript-tenant`; `selectComponentRowForObligation(...)` returns `null` for unmatched module/requirement obligations instead of `rows[0]` | keep ABI constructors as sole binding surface; guard against local lookalike reintroduction | done |
| B4b | `review_grade_edge_fulfillment.ts` L191–193 downstream command string match | horizontal | inert OR-clause | **verified low** per claude — typed `failureClass` gates real routing | drop redundant `"npm test"` / `"node --test"` OR-clauses | open |

---

### Wave C — odd_service trajectory (vertical; lawful now)

| id | code surface | owner | verdict | verification | disposition | status |
| --- | --- | --- | --- | --- | --- | --- |
| C1a | `operator/transport.ts` worker spawn, executor profiles, session trajectory | odd_service long-term | debt REQ-ODDSVC-002/005 | reconciled — lawful incubation now; constitutional carve-out later | thin adapter; link B-004; no session registry growth in SDLC core | open |
| C1b | `transport.ts` L147–172 `claudeArgs` hard-coded CLI flag grammar | worker capability | low refactor | **verified** per claude — worker backend lawful; only flag grammar avoidable | declared worker capability asset through existing `transport.args` contract (claude R5) | open |
| C2 | `install/instruction_files.ts` UX docs for `--until converged --worker process://...` | odd_service UX | acceptable | — | keep docs; no service state in core | open |
| C3 | no odd_service HTTP/MCP server | — | pass | grep | keep absent | done |

**Rejected (do not remediate as part of C-wave):** `codexArgs`, `transportAgentKey`,
`parserForWorkerTransport`, `installed_operator.ts` codex output-path branches —
lawful worker-backend realization (claude rejected list).

---

### Wave D — generic ecosystem law (vertical + horizontal overlap)

| id | code surface | axis | verdict | verification | disposition | status |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | `live_fp_parallel_materialization_frontier.ts` L192–204 `classifySdlcLiveParallelModuleLane` (`src/`, `index.tsx` regex) | vertical | fail REQ-085 | **verified** — path regex at L197–201 | delete; derive lanes from admitted tenant stack | open |
| D2 | `decomposition_admission.ts` `dependencyTraversalMethod` deterministic pick | vertical | fail REQ-082 | architectural | evaluator-selected method as admitted carrier | open |
| D3 | `start/public_start.ts` bootstrap selection | vertical | **narrowed** | **partially rejected** — `framework_smoke` / `trivial_product` paths at L376–486 lawful per claude + REQ-082 AC-3/4 | only remediate sites that pick traversal method without admitted evidence; not whole `public_start` | open |
| D4 | `authority.ts` L1638–1639 `.test.`/`.spec.` infix exclusion | horizontal | medium | claude confirmed | use `TenantStackTargetSeed` testing-stack roles (claude R4) | open |
| D5 | `authority.ts` L514,523 bare `/src` append | horizontal | medium | claude confirmed | declared `moduleLayout` from tenant profile (claude R4) | open |
| D6 | `authority.ts` L221–223 `"project"` directory special-case | horizontal | low | claude confirmed | consume tenant declared directory list | open |

**Rejected:** `authority.ts` L1643–1648 `src/lib/app/code` heuristic and
`observation.ts` role inference — overridable cross-ecosystem fallback (claude).

---

### Wave H — Target-identity leakage (horizontal; claude R1–R7)

| id | cluster | code surface | severity | verification | disposition | status |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | R1 | `mapper_requirements.md` in `source_input.ts:41`, `project_profile.ts:954-956/1039-1041`, `launch_contract.ts:225/2621/5965`, `postflight_checks.ts:2347-2364`, `result_projection.ts:1552`, `spec_method/entry.ts:289-297` | **high** (1552 load-bearing rank) | **done 2026-06-09** — code/src grep has zero `specification/mapper_requirements.md`; `deriveSdlcSourceInput(...)` no longer classifies the target-specific filename as `requirement_surface`; generic `specification/requirements/*` remains classified as requirement authority | recognition now routes through `specification/requirements/`, `specification/REQUIREMENTS.md`, and imported-source discovery; target-specific filename remains valid only as tenant data/fixture text, not framework law | done |
| H2 | R2 | `analysis/types.ts:19-26` closed enum `hello_world`/`data_mapper`/`generic`; `profiles.ts`, `analyze.ts:358-364` name switches | medium | claude confirmed | open profile id to admitted tenant spec; use `truthyCapability(profile,"trivial_product")` (pattern at `public_start.ts:355`) | open |
| H3 | R3 | `qualification/enterprise_core_inventory.ts:5-108` `ENTERPRISE_CORE_COMPONENTS` + `ENTERPRISE_CORE_CAPABILITY_INVENTORY` as default gate | **medium, probe-only current reachability** | **verified probe-only** — current `code/src` usage is `qualification/enterprise_core_iteration_sandbox.ts`, a B-068 probe graph (`function_kind: "odd_outcome_iteration_probe"` at L286–288) whose evaluator calls `evaluateEnterpriseCoreInventory(...)` (L467–474); `test_env/sandbox/test_b068_*` is the only active test consumer. No public-start/operator live default gate caller found in active source grep. | contain as B-068 proof fixture or relocate to `test_env/`; do not treat as live default gate until a production caller is proven | open |
| H4 | R3 | `qualification/enterprise_core_iteration_sandbox.ts:425-462` scripted CDME constructor sequence | medium | claude confirmed | move to non-exported `test_env/` fixture with synthetic names | open |
| H5 | R4 | `prompt_edge_policy.ts:226,238` `"npm test"` pressure classifier | medium | claude confirmed load-bearing (vs rejected `launch_contract.ts:4197` inert) | match neutral SDLC pressure ids; read grammar from `testExecutionContract` | open |
| H6 | R4 | `repair_reentry.ts:575-578` Scala/SBT defect needles | medium | claude confirmed | tenant-declared diagnostic phrases in `TECH_STACK.*` | open |
| H7 | R4 | `prompts.ts:1059` review prompt names `npm test` | low | claude confirmed | generic `role=test` reference | open |
| H8 | R6 | `analyze.ts:211-290` `TEST35_CONCEPTUAL_STAGES` / `test35://stage/...` | low | claude confirmed | generic `sdlc://stage/...`; scenario id as data | open |
| H9 | R6 | `render_markdown.ts:243-248` test35-branded headings | low | claude confirmed | neutral headings | open |
| H10 | R7 | `project_profile.ts:153-159` `spark_scala` alias | low | claude confirmed | fix stale ref or tenant-declared identity | open |
| H11 | R7 | `prompt_edge_policy.ts:851` `data_mapper.requirements.req_dq_001` example | low | claude confirmed | tenant-neutral placeholder; keep `CANONICAL_REQUIREMENT_REGEX` format | open |
| H12 | — | `project_profile.ts:1014-1017` ontology heading tokens (`morphisms`, `fidelity`, `error domain`) | medium | claude confirmed | spec-method-neutral markers only | open |

---

### Borderline / tracked (E-series)

| id | code surface | assessment | disposition | status |
| --- | --- | --- | --- | --- |
| E1 | `edge_projection.ts` `runInstalledOperatorShardCommand` | lawful REQ-077 AC-4 if graph-bound | verify bind-chain stage | open |
| E2 | `assurance_gate.ts` empty ledgers | aligned post T-184 | keep stub | done |
| E3 | `closure_state_machine.ts` string-ref heuristics | weak vs REQ-086 | typed carrier inputs | open |
| E4 | `feature_dependency_dag.ts` topological order | lawful if projection-only | audit callers | open |
| E5 | `rc_qualification.ts`, non-exported sandbox paths | lawful self-qualification / fixtures | keep; claude rejected re-flag | done |

---

### Proof Residuals Transferred From T-184 (P-series)

These rows prevent the T-184 partition proof debt from becoming orphaned after
the supersession hygiene close.

| id | source | transferred pressure | disposition | proof required | status |
| --- | --- | --- | --- | --- | --- |
| P1 | T-184 H-060 generated-asset production-path closure | generated-asset closure must require selected `evaluate.C` evidence and selected composition identity in all production paths, not only constructors | prove production closure cannot bypass selected F_P review through legacy writers, deterministic postflight, workspace file presence, or raw worker reports | source negative test plus generated-asset production-path proof | open |
| P2 | T-184 H-140 data-mapper clean live gate | data-mapper breadth proof must close or block lawfully with PTY/process finalization and graph-owned execution evidence | deferred to T-198 because T-197 closure law is the lite installed proof lane plus boundary cleanup, not data-mapper breadth; T-198 owns a clean data-mapper live lane after B1/H1 stabilize | successor ticket `.ai-workspace/tickets/backlog/T-198-prove-data-mapper-breadth-live-after-t197-boundary-cleanup.md` | deferred |
| P3 | T-184 H-240 stale proof fixture hygiene | semantic tests must not keep deleted handoff/fenced-carrier/legacy writer surfaces alive | keep focused proof green and sweep semantic fixtures when they preserve deleted surfaces | semantic proof plus source grep for old imports/fenced alias acceptance | partial |

---

### Rejected Findings Register (claude negative evidence)

Do **not** open remediation rows for these without new adversarial proof:

| surface | reason |
| --- | --- |
| `launch_contract.ts:4197,4209` `npm test` in pressure check | inert disjunct behind generic tokens |
| `transport.ts` codexArgs, transportAgentKey, parserForWorkerTransport | lawful worker-backend (REQ-051/052/053) |
| `installed_operator.ts` codex output-path branches | consumer of lawful codex transport |
| `public_start.ts:376-486` framework_smoke + trivial_product | lawful per REQ-082 AC-3/4 when capability admitted |
| `authority.ts:1643-1648` src/lib/app heuristic | overridable fallback |
| `profiles.ts` DATA_MAPPER_PROFILE as operator-selected diagnostic | read-only; generic default works |
| `enterprise_core_iteration_sandbox.ts:327-332` synthetic path label | non-exported proving fixture |
| `rc_qualification.ts` npm gate rows | tenant self-qualification report |
| `work_category_governance.ts`, `installed_initial_state.ts` node_modules paths | odd_sdlc self-reference |

Full list: claude GAP § "Rejected / Lawful-On-Inspection" (17 items).

---

## Requirement Reconciliation Matrix (Merged)

| requirement | code reality | verdict | ledger |
| --- | --- | --- | --- |
| PRODUCT `typecheckGtlProgram` before runtime proof | `code/src/gtl_conformance/program.ts` builds the live inventory; public start, spec-method, release, and `build:semantic` preflight call the gate | **pass** | **B1 done** |
| REQ-F-RUNTIME-001 ABG owns runtime facts | SDLC synthesizes vector cursor events | fail | A1, A4 |
| REQ-F-RUNTIME-002 no shadow runtime | convergence loop + local closure engine | verified boundary tension; design-lock needed | A2, A5 |
| REQ-F-RUNTIME-005 ABG owns frontier | SDLC invokes ABG frontier from local live path | verified boundary tension; design-lock needed | A3 |
| REQ-F-ODDSDLC-011 AC-3 tenant stack not generic law | H1 target filename fixed; `/src` append and path regex rows remain | partial | H1 done; D1, D5 open |
| REQ-F-ODDSDLC-017 AC-2 declared validator evidence | npm test in classifiers | fail | H5, B4b |
| REQ-F-ODDSDLC-032 domain identity | CDME components as default gate; named profile enum | fail | H2, H3 |
| REQ-F-ODDSDLC-046 AC-4 imported authority | H1 target filename no longer bypasses imported-sources; generic requirement surfaces remain | **pass** | H1 done |
| REQ-F-ODDSDLC-082 evaluator-selected depth | deterministic method pick | fail | D2; D3 narrowed |
| REQ-F-ODDSDLC-063..068 edge assurance | matrix + kernels | pass | — |
| REQ-F-ODDSDLC-077 execution evidence | graph-bound lite live | pass (stage debt) | E1 |
| REQ-F-ODDSVC-002 transport | embedded; lawful now, debt long-term | debt | C1a |
| REQ-F-ODDSDLC-051/052/053 worker transport | codex/claude routing | pass | rejected list |

---

## Remediation Waves (Execution Order)

### Wave 0 — B1 product GTL gate (P0, before destructive A-work)

1. Wire `typecheckGtlProgram(...)` into `code/src` build/start/publish preflight
2. Preserve the T-195 proof-hygiene baseline and keep B1 product-code gate work in this ticket
3. Reuse or factor the production inventory builder proven by `test:t194`;
   do not create a second test-only conformance manifest.
4. Proof: product-path test with the live catalog inventory and non-trivial
   coverage assertions; `test:t194` remains green on closing revision.

**Change class:** `realization_refactor` with requirement trace to T-152/T-153.

**W-050 implementation evidence — 2026-06-09:**

- Production inventory builder: `build_tenants/typescript/code/src/gtl_conformance/program.ts`
- Product hooks: `start/public_start.ts`, `spec_method/entry.ts` start ignition, `release/release_cut.ts`,
  `release/release_snapshot.ts`, and package `build:semantic` via `preflight:gtl`
- Proof: `npm run test:t194` passed 2/2; `npm run test:t197` passed 6/6
- Runtime counts on this revision: graph vectors = target-carrier rows =
  edge-closure rows; prompt assets = 3; plugin contracts = 5; source identity
  surfaces > 0; issueCount = 0
- Negative proof: `test:t197` removes target-carrier rows and ABG reports a
  failed conformance report with `target_carrier_contract` issues.
- Installed-package proof: `test:t197` forces a missing active source checkout
  and still requires one packaged source-identity surface; `test:t059` proves
  installed `odd-sdlc-ts gaps` runs through the same gate instead of bypassing it.

### Wave 1 — ABG authority leakage (vertical; design lock required)

0. A4 inventory gate: **done 2026-06-09** in staged-compute design W-105
   inventory. Existing ABG routes cover deterministic conformance F_D advance
   and F_D audit outcomes; explicit graph-vector resume cursor plus graph-span
   reentry application are blocked on upstream ABG T-154 or equivalent existing
   route proof before deleting any A1/A4 site.
1. A1: stop synthetic cursor event construction; require ABG continuation
2. A4: enumerate construct-before-emit sites; rehome authorship
3. A3: resolve design-lock verdict before rehome/ratify live parallel frontier invocation
4. A5: split closure chain admission boundary after design lock names SDLC candidate/read-model role vs ABG fold/transition authority
5. A2: reframe `--until converged` ownership after A5 boundary is clear

**Change class:** `design_reframe` then `realization_refactor`.
**Gate:** adversarial verification note on file for each A-row before merge;
pin the current T-164 three-edge/residual-pressure proof before A5 edits
`traversal_consequence.ts`.

### Wave 2 — GTL parallel law audit (vertical)

1. B2–B3: consume abiogenesis/GTL carriers; no parallel law
2. B4a: keep the current ABI binding constructor/admitter path and guard
   against local lookalikes
3. B4b: drop inert command OR-clauses

### Wave 3 — odd_service trajectory (vertical; non-blocking)

1. C1a: document carve-out path; link B-004
2. C1b: declared worker capability asset for `claudeArgs`

### Wave 4 — Ecosystem + traversal hygiene (vertical)

1. D1–D3 (narrowed), D4–D6

### Wave 5 — Target-identity hygiene (horizontal; claude R1–R7)

1. **H1 / R1** — eliminate `mapper_requirements.md` from framework law (highest horizontal priority)
2. **H3 / R3** — current reachability is probe-only; contain or relocate as a
   B-068 fixture, and keep production default gates free of CDME names
3. **H2 / R2** — de-name analysis profile space
4. **H5–H7, H6 / R4** — drop downstream grammar from classifiers
5. **H8–H11 / R6–R7** — low-priority de-branding and alias cleanup

**Change class:** `realization_refactor` — generic mechanisms already exist.

---

## Priority Order (Cross-Axis)

1. **B1** — unwired ABG conformance gate (direct payoff of T-152/T-153)
2. **H1** — `mapper_requirements.md` lineage/ingress recurrence (highest horizontal)
3. **A1, A4** — verified synthetic runtime event authorship
4. **A5 design-lock disposition** — closure candidate/read-model vs ABG fold/transition split; coupled to T-164 proof
5. **A3 design-lock disposition** — ABG-owned entry vs lawful thin SDLC caller over ABG frontier
6. **A2 design-lock disposition** — installed `--until converged` loop after A5 boundary is clear
7. **H2, H5–H7, D1, D4–D5** — remaining horizontal + ecosystem hygiene
8. **B2–B3, D2–D3, C1a–C1b, H3–H12, P1/P3** — design-locked, probe-only, proof-residual, or low-severity

---

## Required Design Assets (Before Wave-1 Code)

Per `DESIGN_MODULE_METHOD.md`:

### 1. IACS (dual-axis)

Module inventory with owner: `SDLC product`, `ABG consumer`, `GTL read model`,
`odd_service adapter`, `tenant-authority consumer`, `proof harness`. Mark
horizontal-leak modules (`analysis/`, `qualification/`, `workspace/`) with
**must-not-name-governed-target** constraint.

### 2. Structural Carrier Diagram

Vertical spine (GTL → SDLC policy → ABG composition → plugins → ABG admit/fold)
plus horizontal ingress rule: **tenant authority flows through declared imported
sources and tenant stack profiles, never through hard-coded target filenames.**

### 3. Reference-To-Target Derivation

Every ledger row: constitutional owner API, current call site, target call site,
proof test name.

### 4. Decommission Register

Vertical: A1 synthesis, A3 live frontier path, A4 construct sites (enumerated),
D1 regex classifier, D2 method pick.

Horizontal: `mapper_requirements.md` special cases (7 files), `ENTERPRISE_CORE_*`
default gate exports, closed `SDLC_FD_RUN_ANALYSIS_PROFILE_VALUES` enum.

Target: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md`
addendum `T-197 Owner Partition And Decommission Register`.

---

## Work Ledger (Ticket-Level)

| id | task | closure proof | status |
| --- | --- | --- | --- |
| W-000 | Merge grok + claude GAP into this ticket | ticket + peer links | done |
| W-005 | Initial adversarial pass for A-section (A1/A3/A4) | verification column in ledger | done |
| W-006 | Adversarial verify A2/A5 before Wave-1 design lock | verification column updated with line-level proof; Phase 0 note `20260609T061330Z_T197-phase0-verification.md` | done |
| W-007 | Resolve A3 owner verdict and H3 reachability before ranking/remediation | A3 verified as design-lock tension; H3 verified probe-only; Phase 0 note `20260609T061330Z_T197-phase0-verification.md` | done |
| W-010 | Publish IACS (dual-axis) | `ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md` § T-197 IACS; `test:t197` design guard | done |
| W-020 | Publish structural carrier diagram | `ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md` § Structural Carrier Diagram; `test:t197` design guard | done |
| W-030 | Publish reference-to-target for all ledger rows | `ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md` § Reference-To-Target Derivation plus Decommission Register; `test:t197` design guard | done |
| W-040 | Close transferred T-184 P1-P3 proof residuals | P1/P3 terminal here; P2 explicitly deferred to T-198 | open |
| W-050 | **Wave 0: B1 product GTL gate** | `test:t194` 2/2; `test:t197` 6/6; `test:t059` 10/10 installed-package proof; `build:semantic` runs `preflight:gtl` over the live production inventory and rejects missing target-carrier rows | done |
| W-100 | Wave 1 design lock (A-rows) | A1-A5 statuses moved to `design_locked`; target owner dispositions are in staged-compute design addendum | done |
| W-105 | Wave 1 pre-realization gate | staged-compute design § W-105 Construct-Site Sufficiency Inventory; ABG T-154 filed for explicit resume cursor and graph-span reentry consumer route; existing ABG runner routes identified for deterministic conformance F_D advance and F_D audit outcomes; `npm run test:t164` passed 22/22 edge-contract + 1/1 Rust-service sandbox on 2026-06-09 | done |
| W-110 | Wave 1 realization | focused tests; semantic green | open |
| W-200 | Wave 2 B2-B3 plus B4b residual | T-153 audit tests | open |
| W-300 | Wave 3 C1a/C1b | B-004 link; capability asset | open |
| W-400 | Wave 4 D-rows | source tests | open |
| W-500 | Wave 5 H-rows (R1–R7) | H1 done by `test:t197` H1 grep/classifier proof; remaining H2-H12 open | in_progress |
| W-600 | Closure post; refresh both GAP comments | all rows terminal | open |

---

## Links

- vertical discovery: `.ai-workspace/comments/grok/20260609T022918Z_GAP_sdlc-product-requirement-code-reconciliation.md`
- horizontal discovery: `.ai-workspace/comments/claude/20260609T025417Z_GAP_framework-code-out-of-scope-reconciliation.md`
- compute partition: `.ai-workspace/tickets/completed/T-184-partition-handoff-into-compute-stage-boundary-modules.md`
- GTL proof hygiene: `.ai-workspace/tickets/completed/T-195-close-t194-proof-and-release-hygiene.md`
- odd_service debt: `.ai-workspace/tickets/backlog/B-004-track-odd-service-remote-client-and-consensus-scope-debt.md`
- abiogenesis gate: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-152-gtl-program-conformance-gate-for-typescript-tenant.md`
- contract-law API: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-153-consolidate-gtl-contract-law-api-requirement-surface.md`
- staged compute design: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md`
