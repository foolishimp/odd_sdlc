# GAP: odd_sdlc Product / Requirement / Code Reconciliation

**Author**: grok
**Date**: 2026-06-09T02:29:18Z
**Addresses**:
  - `specification/PRODUCT.md`
  - `specification/INTENT.md`
  - `specification/requirements/03-runtime-governance.md`
  - `specification/requirements/09-odd-service-orchestration-plane.md`
  - `specification/requirements/14-odd-sdlc-installed-product-contract.md`
  - `specification/requirements/16-edge-gain-closure-contract.md`
  - `specification/requirements/18-typed-construction-algebra.md`
  - `build_tenants/typescript/code/src/`
**Status**: Open (merged into active T-197)
**Active ticket**: `.ai-workspace/tickets/active/T-197-reconcile-product-boundary-and-remove-authority-leakage.md`
**Peer post (horizontal axis)**: `.ai-workspace/comments/claude/20260609T025417Z_GAP_framework-code-out-of-scope-reconciliation.md`

## Summary

`odd_sdlc.TS` is largely aligned on **what SDLC should own**: graph overlays,
edge assurance semantics, product read models, prompt overlay policy, and
installed-operator UX over ABG.

The main reconciliation gap is not missing requirements. It is **authority
leakage**: TypeScript realization still contains runtime-truth synthesis,
orchestration transport, generic ecosystem law, and local contract-law surfaces
that PRODUCT and requirements assign to **ABG**, **GTL/abiogenesis**, or the
future **odd_service** line.

This post classifies code by constitutional owner and recommends disposition.

## Constitutional Ownership (compressed)

From `PRODUCT.md` and REQ families 03/14/16/18:

| Owner | Owns | odd_sdlc must not own |
| --- | --- | --- |
| **GTL / abiogenesis** | Language law, graph algebra, target-carrier contract law, `AssetSurface`, `abg.fn_composition`, `typecheckGtlProgram(...)` | Second parsers, local GTL conformance engines, parallel contract-law registries |
| **ABG** | Runtime events, admission, payload ledgers, assurance fold, traversal transition, continuation, replay, frontier scheduling | Shadow runtime loops, locally invented vector lifecycle, rival event authority |
| **odd_service** (incubating) | Session lifecycle, worker registry, transport profiles, client-safe observation | Rival convergence model or event store |
| **odd_sdlc** | SDLC edge meaning, overlays, gain/closure interpretation, product assets, analyzer projections, prompt policy overlays, installed Spec Method entry | Domain runtime truth, GTL semantics, orchestration plane |

Mandatory consumption gate (PRODUCT): ABG `typecheckGtlProgram(...)` before
claiming graph/prompt/plugin conformance.

## What Should Stay In SDLC (lawful core)

These are **in-scope** and requirement-backed:

- **Graph publication** — `graph/module.ts`, `graph/catalog.ts`, `graph/overlays.ts`
- **Edge assurance matrix + semantic kernels** — `graph/edge_gain_closure_contracts.ts`, `operator/edge_gain_closure.ts`, `operator/traversal_consequence.ts` (product gain/close *meaning* over admitted evidence)
- **Compute-stage plugin data** — `operator/plugins/transform|evaluate|consequence/*` when limited to candidate/evidence/projection payloads
- **Product read models** — `projection/query_domain.ts`, `projection/requirement_closure.ts`, `analysis/*`
- **Prompt overlay policy** — `operator/prompt_assets.ts`, `operator/plugins/transform/prompt_edge_policy.ts` (policy over GTL `AssetSurface`, not parallel GTL law)
- **Target-carrier read model** — `graph/target_carrier_contracts.ts` when declarations come from graph vectors and validation delegates to abiogenesis
- **Workspace conformance ingress** — `workspace/project_profile.ts` (tenant stack + execution contracts as product authority surfaces)
- **Installed Spec Method entry** — `spec_method/entry.ts`, `start/public_start.ts` (ignition only)
- **Scenario/test harness** — `test_env/sandbox/*` as proof setup, not closure authority

REQ-F-ODDSDLC-077 AC-4 explicitly places **installed-operator shard execution**
and `sdlc_worker_execution_evidence` publication in SDLC. That is lawful product
behavior when bound to execution-result edges and declared contracts.

## Functionality That Should Not Be In SDLC

Prioritized by constitutional severity.

### A. ABG-owned runtime truth (defect / active leakage)

| ID | Code surface | Why it violates boundary | Requirement / PRODUCT | Disposition |
| --- | --- | --- | --- | --- |
| A1 | `installed_operator.ts` `replayEventsWithGraphContinuationCursor` (L1765–1840) synthesizes `vector_traversal_planned`, `vector_evaluated`, `vector_closed` events for prior vectors | SDLC invents traversal lifecycle facts ABG did not emit | REQ-F-RUNTIME-001; REQ-F-ODDSDLC-075; `abiogenesis_substrate.ts` `choosesNextVectorLocally: false` | **Delete/reframe** as read-only replay repair; require ABG continuation events |
| A2 | `installed_operator.ts` `executeInstalledOperatorStartWithReentry` (L10170+) multi-attempt convergence loop with local reentry guards | Product CLI orchestration has grown into continuation authority over closure dispositions | REQ-F-RUNTIME-002 AC-3; REQ-F-ODDSDLC-086; borderline with installed UX loop | **Reframe**: one admitted ABG turn per invocation unless substrate owns `--until converged` |
| A3 | `installed_operator.ts` inline `runEventedNativeSagaFrontier` path (L2813+) during operator audit | SDLC runs parallel frontier with local saga executor instead of ABG frontier scheduling | REQ-F-RUNTIME-005 AC-1/AC-2 | **Move scheduling to ABG**; SDLC keeps DAG compilation only (`feature_dependency_dag.ts`) |
| A4 | `event_store.ts` + callers constructing events locally before `emit()` | Even with ABG `emit()` validation, SDLC still **authors** runtime events (e.g. conform_project fd path L8937+, append sites L5656/9984) | REQ-F-RUNTIME-001 AC-1 | **Move event authorship to ABG/system APIs**; keep append as sink only |
| A5 | `traversal_consequence.ts` + `installed_operator.ts` closure chain assembling fulfillment ledger, edge gain, closure decision, next-action as one local engine | Blurs product interpretation vs ABG admission/fold | REQ-F-ODDSDLC-074/076/086; PRODUCT epistemic flow | **Split**: SDLC emits typed candidates; ABG admits fold/transition; archives project admitted facts |

**Note:** `appendOddSdlcRuntimeEvents` through ABG `emit()` (T-184 fix) is a
lawful **sink** pattern. The defect is **who constructs the events**, not the
file append.

### B. GTL / abiogenesis-owned contract law (defect / consumption gap)

| ID | Code surface | Why it violates boundary | Requirement / PRODUCT | Disposition |
| --- | --- | --- | --- | --- |
| B1 | No `typecheckGtlProgram` / `admitGtlProgramConformanceInput` usage in `code/src/` (only `test_env/tests/test_t194_*`) | PRODUCT mandates programmatic gate before runtime/live proof | PRODUCT GTL/ABG Consumption; abiogenesis T-152/T-153 | **Wire ABG gate** into build/start/publish preflight in product code |
| B2 | `component_depth_register.ts` local contract enums/protocols (`admitExactContractEnum`, envelope refs) | Risk of second target-carrier law if not traceable to GTL vector declarations | PRODUCT one-truth rule; T-153 owner classification | **Reframe as read model** over GTL declarations; reject local wrapper contract refs |
| B3 | `prompt_assets.ts` SDLC prompt kind/version/family registers + clause schema | Structural literals parallel GTL `AssetSurface` law | REQ-F-ODDSDLC-087; PRODUCT prompt overlay boundary | **Keep overlay policy**; delete structural duplication beyond product policy validation |
| B4 (historical) | `review_grade_edge_fulfillment.ts` contract-fulfillment binding path | Current T-197 disposition splits this: ABI constructor/admitter consumption is lawful; command-string residual remains B4b | PRODUCT Handoff fulfillment binding row | **Keep** published abiogenesis binding constructors as the only binding surface |

Current disposition note, 2026-06-09: T-197 splits this historical B4 finding.
The binding constructor/admitter path is now verified lawful because
`review_grade_edge_fulfillment.ts` imports the ABI carrier from
`@abiogenesis/typescript-tenant`; only the downstream command-string OR-clause
residual remains open as T-197 B4b.

### C. odd_service-owned orchestration (debt / premature embedding)

| ID | Code surface | Why it violates boundary | Requirement / PRODUCT | Disposition |
| --- | --- | --- | --- | --- |
| C1 | `operator/transport.ts` worker spawn args, executor profiles, agent CLI routing | REQ-F-ODDSVC-002/005 assigns transport/registry to odd_service | REQ-F-ODDSVC-* | **Carve toward odd_service** incubation module; thin adapter in SDLC |
| C2 | `install/instruction_files.ts` documents `--until converged --worker process://claude|codex` in product install | Acceptable UX docs, but transport naming is orchestration surface | REQ-F-ODDSVC-003 | **Keep docs**; implementation should not accumulate service/session state in SDLC core |
| C3 | No standalone odd_service server yet (positive) | — | REQ-F-ODDSVC-001 | **Keep absent** until promotion; do not grow SDLC into service runtime |

### D. Generic SDLC law encoded as ecosystem-specific branches (defect)

| ID | Code surface | Why it violates boundary | Requirement / PRODUCT | Disposition |
| --- | --- | --- | --- | --- |
| D1 | `live_fp_parallel_materialization_frontier.ts` `classifySdlcLiveParallelModuleLane` (L192–204) path regexes for `src/`, `index.tsx` | PRODUCT: `Cargo.toml`, `package.json`, etc. are tenant-spec data, not generic SDLC law | REQ-F-ODDSDLC-085 AC-6/AC-12; PRODUCT staged construction | **Delete path heuristics**; derive lanes from admitted tenant stack + materialization targets |
| D2 | `decomposition_admission.ts` `dependencyTraversalMethod` (L249–269) chooses `steel_thread` / `parallel` / `serial` from map topology | PRODUCT: traversal method is evaluator-selected over admitted evidence, not deterministic SDLC choice | REQ-F-ODDSDLC-080 AC-9; REQ-F-ODDSDLC-082 | **Reframe**: F_D admits map; evaluator-selected method admitted as carrier |
| D3 | `start/public_start.ts` bootstrap hop/decomposition selection from profile literals | Same as D2 for lite/framework-smoke starts | REQ-F-ODDSDLC-082 AC-10 | **Mark projection-only** until archived complexity evidence exists |

### E. Borderline / historically lawful but drift-prone

| ID | Code surface | Assessment | Disposition |
| --- | --- | --- | --- |
| E1 | `plugins/consequence/edge_projection.ts` `runInstalledOperatorShardCommand` | **Lawful per REQ-077 AC-4** if bound to execution-result edges; stage placement (consequence vs post-transform) is design debt, not owner violation | Keep owner in SDLC; verify bind-chain stage only |
| E2 | `assurance_gate.ts` now returns empty ledgers | T-184 removed F_D assurance ledger authority — **aligned** | Keep stub; ensure no caller treats as closure authority |
| E3 | `closure_state_machine.ts` string-ref heuristics (`includes("triage_gap")`) | Weak typing for continuation; conflicts with REQ-F-ODDSDLC-086 total typed transitions | Replace with typed carrier inputs |
| E4 | `feature_dependency_dag.ts` local topological order | Lawful as declaration compile **if never used as dispatch order** | Audit callers; document projection-only role |
| E5 | `qualification/*`, `enterprise_core_iteration_sandbox.ts` | Qualification lanes are product proof, not runtime | Keep; must not become second traversal truth |

## Requirement Reconciliation Matrix (sample)

| Requirement | Code reality | Verdict |
| --- | --- | --- |
| REQ-F-RUNTIME-001 ABG owns runtime facts | SDLC synthesizes vector cursor events (A1) | **Fail** |
| REQ-F-RUNTIME-002 no shadow runtime | Convergence/reentry loop + local closure engine (A2/A5) | **Partial fail** |
| REQ-F-RUNTIME-005 ABG owns frontier | Inline saga frontier in installed operator (A3) | **Fail** |
| REQ-F-RUNTIME-006 ontology split | `abiogenesis_substrate.ts` documents correct split; `installed_operator.ts` contradicts | **Intent pass / implementation fail** |
| REQ-F-ODDSDLC-077 execution evidence on execution edges | Consequence projection runs shards; live lite proof passes | **Pass** (with stage-placement debt) |
| PRODUCT mandatory `typecheckGtlProgram` | Only test_env proof (B1) | **Fail** |
| PRODUCT tenant stack not generic law | Path-based lane classifier (D1) | **Fail** |
| REQ-F-ODDSDLC-082 evaluator-selected traversal depth | `decomposition_admission.ts` deterministic method pick (D2) | **Fail** |
| REQ-F-ODDSDLC-063..068 edge assurance | Matrix + kernels in graph/operator | **Pass** (lawful SDLC) |
| REQ-F-ODDSVC-002 transport/session | Embedded in `operator/transport.ts` (C1) | **Debt** (incubation OK, not long-term) |

## Positive Findings

- `handoff.ts` deleted; compute-stage partition direction is correct (T-184).
- `assurance_gate.ts` no longer fabricates assurance ledgers for closure.
- `abiogenesis_substrate.ts` explicitly documents consumed substrate contract
  including T-152 conformance gate **as assumption** — good boundary doc.
- Prompt and target-carrier paths import abiogenesis constructors/validators.
- Scenario proof now requires graph-owned `sdlc_worker_execution_evidence`
  (lite live path) instead of harness-only `processChecks`.
- No odd_service HTTP/MCP server in `code/src` yet — avoids rival runtime.

## Recommended Remediation Waves

### Wave 1 — stop authority leakage (ABG)

1. Remove or gate `replayEventsWithGraphContinuationCursor` event synthesis (A1).
2. Remove inline `runEventedNativeSagaFrontier` from live operator path (A3).
3. Route event authorship through ABG/system commands; SDLC keeps projection only (A4/A5).

### Wave 2 — consume constitutional gates (GTL/ABG)

1. Wire `typecheckGtlProgram(...)` into TS tenant build/start/publish path (B1).
2. Audit `component_depth_register`, `prompt_assets`, `review_grade_edge_fulfillment` for parallel law (B2–B4).

### Wave 3 — extract orchestration (odd_service)

1. Carve `operator/transport.ts` + worker profile surfaces toward odd_service incubation (C1).
2. Keep SDLC entry as thin wrapper per REQ-F-ODDSVC-003.

### Wave 4 — remove generic ecosystem law (SDLC hygiene)

1. Delete path-based parallel lane classifier (D1).
2. Make traversal method evaluator-admitted, not `decomposition_admission` chosen (D2/D3).

## Ticket / Re-Entry Guidance

Consolidated active ticket: **T-197** (`.ai-workspace/tickets/active/T-197-reconcile-product-boundary-and-remove-authority-leakage.md`).

| Wave | Smallest lawful re-entry | Ticket |
| --- | --- | --- |
| ABG runtime leakage | `design_reframe` (runtime governance) | T-197 Wave 1 (extends T-184 pressure) |
| GTL gate wiring | `realization_refactor` with requirement trace | T-197 Wave 2 + T-195 hygiene |
| odd_service carve-out | `product_reprice` / `design_reframe` | T-197 Wave 3 + B-004 |
| Ecosystem law removal | `realization_refactor` | T-197 Wave 4 |

## Bottom Line

**odd_sdlc should remain the software-domain meaning layer over GTL/ABG**, not a
second runtime, GTL compiler, or orchestration server.

The highest-risk code to relocate or delete is:

1. synthesized vector lifecycle events (`replayEventsWithGraphContinuationCursor`)
2. inline saga frontier scheduling in `installed_operator.ts`
3. missing in-product `typecheckGtlProgram` consumption
4. generic path/traversal heuristics (`live_fp_parallel_materialization_frontier.ts`, `decomposition_admission.ts`)
5. embedded worker transport that belongs to odd_service long-term

Everything else in the operator/graph/projection tree is largely **lawful SDLC**
if it stays on the product side of the epistemic flow and stops short of
emitting or folding runtime truth locally.
