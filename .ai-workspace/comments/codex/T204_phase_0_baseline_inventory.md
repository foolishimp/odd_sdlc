# T-204 Phase 0 Baseline Inventory

Date: 2026-06-22

Entry commit:

- `odd_sdlc`: `3b03fd70be49981dc3e78590258690bfff3b1d7b`
- `odd_sdlc` status: `main...origin/main [ahead 1]`
- `abiogenesis`: `a0f0d313441050d77f25302f6a815a621269be5f`
- `abiogenesis` status: clean, `main...origin/main`

## Purpose

Freeze the current tree before the remaining T-204 cuts. This phase does not
delete code. It establishes the measured source inventory, surviving public
surface, current command/control residue, and first blockers for the next
phases.

## 2026-06-24 Closure Refresh

This refresh supersedes the historical 2026-06-22 counts below for closure
purposes.

Entry commit:

- `odd_sdlc`: `5a53f82`
- `odd_sdlc` status at refresh: clean tracked tree, with only untracked local
  V8 isolate log `build_tenants/typescript/isolate-0xa8140c000-50518-v8.log`
  excluded from source inventory.

Current source inventory:

| Metric | Current |
| --- | ---: |
| TypeScript source files under `build_tenants/typescript/code/src` | 175 |
| TypeScript source lines under `build_tenants/typescript/code/src` | 98,048 |
| Package bins | 0 |
| Package exports | `.`, `./install`, `./release` |
| `code/src/cli` source files | 0 |
| `spec_method` source files | 0 |
| `effects` source files | 0 |
| `operator/event_store.ts` | 0 |
| `start` source files | 3 |
| `analysis` source files | 15 |
| `operator` source files | 53 |

Current survival classification:

| Classification | Current files |
| --- | ---: |
| `gtl_program` | 10 |
| `plugin` | 25 |
| `product_carrier` | 43 |
| `product_projection` | 72 |
| `test_or_release_plumbing` | 25 |
| `move_to_abg` | 0 |
| `delete` current rows | 0 |

The authoritative per-file classification is
`.ai-workspace/comments/codex/20260620T000000Z_T204_source_survival_inventory.md`.
It now classifies every current `code/src` file and records six non-current
deleted rows as closed deletion history.

Current residue disposition:

| Surface | Closure fact |
| --- | --- |
| `start/*` | Survives as product start-intent, target-policy, and runtime-binding contract projection consumed by ABG runtime binding; it is not a package command, local executor, retry loop, or replay controller. |
| `operator/installed_operator.ts` | Survives as ABG-consumed plugin/session adapter; public start/control exports and installed start executors are removed, worker invocation goes through ABG supervised process actor, and source gates reject local start/control/reentry/runtime-event authorship. |
| `operator/traversal_consequence.ts` | Survives as SDLC consequence candidate/read-model surface over admitted evidence; ABG owns final bind, terminal status, runtime transition, replay, and continuation truth. |
| `workspace_api/entry.ts` | Survives as commandless query/gaps/ticket read-model API; source-authority gate rejects runtime truth authorship and local traversal/start/control calls. |
| `analysis/*` | Survives as product closure-proof/analyzer read model bound by REQ-F-ODDSDLC-081 and staged-compute design; not a runtime authority path. |

Refresh validation:

| Check | Result |
| --- | --- |
| `npm run test:t197` | passed, 33/33; includes source survival inventory closure gate |

## Current Source Inventory

| Metric | Current |
| --- | ---: |
| TypeScript source files under `build_tenants/typescript/code/src` | 179 |
| TypeScript source lines under `build_tenants/typescript/code/src` | 95,397 |
| Package bins | 0 |
| Package exports | `.`, `./install`, `./release` |
| `spec_method` source files | 0 |
| `start` source files | 3 |
| `analysis` source files | 15 |
| `operator` source files | 54 |

Top source directories by file count:

| Directory | Files |
| --- | ---: |
| `operator` | 54 |
| `analysis` | 15 |
| `assurance` | 13 |
| `graph` | 10 |
| `workspace` | 9 |
| `hooks` | 9 |
| `shared` | 8 |
| `qualification` | 6 |
| `contracts` | 5 |
| `domain` | 5 |

Largest remaining files:

| File | Lines | Phase pressure |
| --- | ---: | --- |
| `operator/installed_operator.ts` | 9,677 | Phase 1/2/3: plugin session is live; local executor, archive writes, consequence/retry/control are not accepted product authority. |
| `operator/plugins/transform/launch_contract.ts` | 6,148 | Phase 5/6: plugin surface with launch and materialization policy; must stay product-only. |
| `operator/plugins/evaluate/postflight_checks.ts` | 3,782 | Phase 4/5: evaluator law; reject archive scrape as authority. |
| `operator/product_materialization/authority.ts` | 2,627 | Phase 5: product materialization authority carrier/policy. |
| `operator/plugins/transform/result_projection.ts` | 2,577 | Phase 4/5: plugin result projection; must consume ABG-admitted result interfaces. |
| `tickets/workflow.ts` | 2,184 | Phase 4/5: ticket projection over admitted runtime truth. |
| `operator/traversal_consequence.ts` | 2,138 | Phase 3: consequence/bind fold belongs in ABG; retain only SDLC domain interpretation if irreducible. |
| `operator/carriers.ts` | 2,127 | Phase 5: product carriers must have explicit register/ledger purpose. |
| `projection/query_domain.ts` | 1,833 | Phase 4/5: query overlay; must not derive runtime truth locally. |
| `operator/review_grade_edge_fulfillment.ts` | 1,825 | Phase 4/5: product assessment; must consume admitted scope and retry facts. |
| `start/public_start.ts` | 1,804 | Phase 1: residual start/control adapter. |
| `gtl_conformance/program.ts` | 1,588 | Survivor candidate: GTL product declaration and conformance input. |
| `operator/plugins/consequence/edge_projection.ts` | 1,536 | Phase 3/5: consequence plugin projection; must not own transition or continuation. |
| `operator/plugins/evaluate/prompts.ts` | 1,517 | Survivor candidate: product prompt projection/policy. |
| `operator/product_materialization/observation.ts` | 1,491 | Phase 5: product observation, not runtime truth. |

## Public Surface

`package.json` publishes no bin and exports only:

- `.`
- `./install`
- `./release`

Root `code/src/index.ts` exports product/runtime surfaces plus the ABG runtime
plugin factory:

- `createOddSdlcAbgRuntimeBindingPlugins`
- `oddSdlcAbgRuntimeWorkerTransportFromEnv`
- `resolveOddSdlcAbgRuntimeBindingPolicy`
- typed public product projections such as `workspace_api`, `gtl_conformance`,
  graph/domain/assurance/release/install APIs.

Root does not export `start/*`, `spec_method/*`, or the full operator subtree.

## Remaining Command And Runtime Authority Residue

| Surface | Current fact | Phase |
| --- | --- | --- |
| `start/public_start.ts` | Defines `publicStartOnce(...)` and `projectSdlcWorkerAttachment(...)`; still used by `operator/abg_runtime_binding.ts` and many tests. | Phase 1 |
| `operator/installed_operator.ts` | Still defines the live plugin session and contains archive write, worker dispatch, retry/reentry, closure/consequence, and historical executor code. | Phase 1/2/3 |
| `operator/index.ts` | Re-exports `appendOddSdlcRuntimeEvents`, `readOddSdlcRuntimeEvents*`, and `createSdlcInstalledOperatorAbgPluginSession`. | Phase 2 |
| `operator/event_store.ts` | Product-local runtime event store over `.ai-workspace/events/events.jsonl`; ABG already owns runtime events. | Phase 2 |
| `operator/traversal_consequence.ts` | Defines `sdlc_edge_closure_decision` and `sdlc_next_action_projection` derivation. | Phase 3 |
| `workspace_api/entry.ts` | `projectOddSdlcWorkspaceGaps(...)` reads raw operator-run archive JSON and derives gaps/diagnostics. | Phase 4 |
| `analysis/*` | Generic archive/run analysis remains resident. | Phase 4 |
| `install/installer.ts` | Writes runtime event through `appendOddSdlcRuntimeEvents(...)`. | Phase 2 |

## ABG Capability Boundary Observed

ABG is already the substrate owner for the capabilities T-204 wants to consume:

- public `start` and `gaps` command surfaces
- admitted `StartIntent`
- runtime events and event emission
- worker/process supervision
- replay-derived retry and continuation transition
- traversal-unit and bind-boundary typechecking
- result-envelope ingress and plugin result-interface conformance

Therefore the default Phase 1-4 target is not to recreate local wrappers in
odd_sdlc. The target is to consume ABG carriers/projections directly or record
the missing ABG adapter as an ABG issue before retaining any SDLC-local
infrastructure.

## Completion Verdict

Phase 0 is complete.

The current public command surface is already gone, but the source tree still
contains product-local runtime/control infrastructure. The next phase starts
with `start/public_start.ts` and the installed-operator start/control path,
because that is the shortest remaining path from product code back into
product-local traversal authority.
