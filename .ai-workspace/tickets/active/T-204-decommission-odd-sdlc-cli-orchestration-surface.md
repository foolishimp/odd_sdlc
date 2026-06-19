---
id: T-204
title: Decommission odd_sdlc orchestration code and shrink to GTL program plus plugins
type: chore
ticket_category: implementation_migration
status: active
goal: question every odd_sdlc source file and remove product-local orchestration so the package collapses toward a GTL program plus plugins, with only irreducible product carriers/proof surfaces retained
build_tenant: typescript
owner: odd_sdlc
change_intent: >-
  Retire `odd-sdlc-ts`, the SDLC spec-method command path, and any other
  product-local orchestration or runtime-control code. Move traversal start,
  continuation, replay, consequence projection, runtime-control behavior,
  generic archive analysis, generic workspace handling, and generic execution
  mechanics to ABG ownership. Treat the current TypeScript source tree as
  overgrown: every file under `code/src` must justify itself as GTL program
  declaration, plugin implementation, or an irreducible product carrier/proof
  surface. Everything else is deleted, moved to ABG, or reclassified as
  non-command common tooling. The SDLC CLI is deleted completely; it is not
  moved, hidden, renamed, or preserved as test harness plumbing. This is an
  inside-out breaking refactor under specification_method discipline: no
  compatibility layer, no compatibility shim, and no attempt to preserve
  historical SDLC command behavior while the source tree is being shrunk.
change_class: product_reprice
re_entry_point: product
priority: critical
triaged_at: 2026-06-17
created_at: 2026-06-17
updated_at: 2026-06-19
activated_at: 2026-06-17
governance_scope: STDO Method, ODD_METHOD, ABG/GTL substrate boundary
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/03-runtime-governance.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - specification/requirements/18-typed-construction-algebra.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-159-formalize-traversal-unit-and-consequence-bind-boundary.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SPEC_METHOD_ENTRYPOINT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md
  - .ai-workspace/comments/codex/20260617T113114Z_STRATEGY_traversal-unit-entry-triage.md
related_tickets:
  - .ai-workspace/tickets/backlog/B-076-consolidate-recurring-shared-helpers-under-shared-domain-utilities.md
  - .ai-workspace/tickets/completed/T-058-realize-typescript-public-cli-adapter-over-graph-query-start-surfaces.md
  - .ai-workspace/tickets/completed/T-105-migrate-start-until-converged-to-abg-owned-whole-graph-iteration.md
  - .ai-workspace/tickets/completed/T-151-runner-evaluator-sovereignty.md
  - .ai-workspace/tickets/completed/T-180-align-sdlc-plugin-stages-with-abg-t144-boundary.md
  - .ai-workspace/tickets/completed/T-197-reconcile-product-boundary-and-remove-authority-leakage.md
  - .ai-workspace/tickets/completed/T-203-factor-code-builder-graph-function-for-uat-test-generation-and-ticket-reentry.md
  - .ai-workspace/tickets/active/T-205-enforce-traversal-unit-bind-outcome-after-passed-compute-stage.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-159-formalize-traversal-unit-and-consequence-bind-boundary.md
affected_boundary:
  - specification/PRODUCT.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SPEC_METHOD_ENTRYPOINT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md
  - build_tenants/typescript/package.json
  - build_tenants/typescript/code/src/**
  - build_tenants/typescript/code/src/cli/main.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/sandbox/
excluded_boundary:
  - deleting GTL program declarations or product plugins that still have a positive survival proof
  - deleting typed product carriers that are required plugin I/O or GTL-public product meaning and cannot move to ABG without moving SDLC product meaning
  - moving SDLC product meaning into ABG
  - creating a new odd_sdlc CLI under a different filename
  - preserving local traversal control as a compatibility shim or forwarding shell
  - moving `code/src/cli/main.ts`, `invokeOddSdlcSpecMethodCommand*`, or the
    spec-method command dispatcher under test harness, non-public package
    plumbing, or another compatibility label
  - changing worker transport backends except where command ownership requires a caller adaptation
target_truth: >-
  odd_sdlc is an ODD product package consumed by GTL/ABG. Its durable source
  shape is a GTL program plus product plugins. Overlays, graph functions,
  edge contracts, prompt assets, and product carriers survive only when they
  are GTL declarations, plugin I/O, or product meaning that ABG must consume.
  Generic traversal mechanics, command/control, runtime observation,
  continuation, replay, archive analysis, workspace normalization, execution
  transport, and result ingress belong in ABG. The default answer for
  odd_sdlc TypeScript source is delete or move to ABG unless the file passes a
  positive survival test. Missing behavior discovered during unit or regression
  testing is reconstructed only after the smaller product shape is exposed; it
  is not protected by a compatibility layer. ABIogenesis T-159 supplies the substrate reason:
  `TraversalUnit<A, B>` is the closeable traversal atom and consequence bind
  belongs to ABG admission, transition, and replay, not to an SDLC-local
  controller.
superseded_truth: >-
  `odd-sdlc-ts` is a durable public command surface for `gaps`, `start`,
  `query-domain`, sandbox preparation, installed operator execution, or
  traversal orchestration; `spec_method/entry.ts` may grow command semantics
  when context is lost; public start may be driven by an SDLC CLI rather than
  by ABG traversal-unit and consequence-bind law; the current `code/src` module
  inventory is accepted as product architecture merely because tests pass or
  because historical tickets created it.
closure_law: >-
  This ticket closes only when every file under odd_sdlc `code/src` has an
  explicit survival classification, orchestration/runtime/controller files are
  deleted or moved to ABG, odd_sdlc has no public, private, transitional, or
  test-harness orchestration CLI, product/design text names ABG as the
  command/control/runtime owner, and product gates prove no remaining SDLC code
  owns traversal authority outside GTL declarations and plugins.
evaluation_criteria:
  - a source inventory classifies every current `build_tenants/typescript/code/src` file as `gtl_program`, `plugin`, `product_carrier`, `product_projection`, `test_or_release_plumbing`, `move_to_abg`, or `delete`
  - any file classified outside `gtl_program` or `plugin` carries a written survival proof explaining why it cannot be represented as GTL declaration, plugin I/O, generated artifact, ABG substrate code, or test harness
  - the inventory starts from the current 180-file TypeScript source tree and tracks file-count reduction across the refactoring wave
  - staged cuts prefer deletion and source-count reduction over compatibility preservation; missing features are reconstructed only when unit/regression failures prove a surviving product need
  - product text distinguishes odd_sdlc package APIs from ABG CLI command/control
  - `build_tenants/typescript/package.json` no longer publishes `odd-sdlc-ts` as a public orchestration bin
  - `code/src/cli/main.ts` is deleted, with no replacement SDLC CLI under test harness, non-public package plumbing, or another filename
  - `spec_method/entry.ts` stops being a CLI command implementation surface; `commandPayload*`, `invokeOddSdlcSpecMethodCommand*`, and CLI serializers are deleted rather than hidden
  - `start`, `continue`, `replay`, runtime worker attachment, and consequence projection are invoked through ABG CLI in tests and scenarios
  - operator `gaps` is an ABG CLI feature; any odd_sdlc gap/query-domain behavior that survives is read-model library support behind that surface, not CLI command law
  - tests reject new command semantics under `code/src/cli/` and reject imports from CLI into traversal/runtime internals
  - tests reject compatibility shims, forwarding commands, or historical command-preservation adapters under odd_sdlc
  - tests reject new product-local traversal runtime, replay, result-ingress, archive-analysis, or workspace-normalization controllers outside ABG CLI-mediated command/control
  - T-203 Rust hello live path uses ABG CLI start/traversal invocation rather than an SDLC CLI launcher
proof_surface:
  - source inventory and deletion/move table for every `code/src` file
  - product-gate test enforcing the source classification allowlist
  - product/design diffs naming the decommissioned command boundary
  - inventory table classifying every current `odd-sdlc-ts` command or option as ABG CLI, odd_sdlc library API, temporary blocker, or removed
  - focused product-gate test preventing CLI drift back into traversal authority
  - focused scenario/sandbox tests migrated away from SDLC CLI command semantics
  - semantic suite on the staged removal revision
  - live Rust hello proof after the command caller is migrated, or a recorded non-closure if the remaining blocker is ABG-side
non_closure_conditions:
  - any `code/src` file remains unclassified
  - any source file survives because it is historically convenient rather than because it is GTL program, plugin, irreducible product carrier/projection, or test/release plumbing
  - generic traversal runtime, replay, archive analysis, workspace normalization, result ingress, or command/control remains in odd_sdlc product code
  - `odd-sdlc-ts` still owns start target routing, worker attach semantics, retry/reentry, replay, or consequence projection
  - `spec_method/entry.ts` becomes the new CLI controller after `cli/main.ts` is deleted
  - `code/src/cli/main.ts`, `invokeOddSdlcSpecMethodCommand*`,
    `commandPayload*`, or the spec-method CLI serializer survives as a
    command/proof path under any label
  - any compatibility layer, compatibility shim, forwarding command, or
    historical command-preservation adapter is introduced to smooth the
    decommission
  - tests pass only because they call private odd_sdlc command helpers instead of ABG CLI
  - command behavior is removed without preserving odd_sdlc library/query APIs consumed by ABG
  - docs still teach operators that SDLC CLI is the runtime command surface
---

# T-204: Decommission odd_sdlc Orchestration Code

## STDO Triage

First missing layer: product.

The current product surface still treats too much odd_sdlc TypeScript as
product architecture. The CLI is the obvious drift magnet, but it is not the
whole problem. `code/src` currently has about 180 files, including command,
start, installed-operator, runtime, workspace, analysis, triage, release, and
projection code. That is materially larger than the intended product shape.

The working suspicion for this ticket is blunt: roughly half of the current
odd_sdlc code should not be product code. It is either ABG substrate behavior,
test harness plumbing, generated/read-model proof code, or historical glue that
survived because it was locally useful.

The burden of proof is reversed. A source file does not survive because it is
covered by tests or because a prior ticket introduced it. It survives only if
it is one of:

- GTL program declaration or catalog publication;
- product plugin implementation;
- typed product carrier required as plugin I/O or GTL-public product meaning;
- product projection/proof surface that cannot belong in ABG;
- package/release/test harness plumbing with no runtime traversal authority.

Everything else is deleted or moved to ABG.

Hard cut: `code/src/cli/main.ts`, the spec-method command dispatcher, and
`invokeOddSdlcSpecMethodCommand*` do not survive in any form. They are not
moved into a test harness, renamed, made private, or kept as a forwarding shell.
They are the drift source.

Inside-out break rule: this refactor intentionally breaks the SDLC command
surface from the inside out. Do not build a compatibility layer. Do not retain
old command semantics while relocating code. Do not preserve behavior merely
because historical tests prove it. The goal is to dramatically shrink the SDLC
codebase and remove accumulated orchestration debt. Unit and regression tests
may reveal genuinely missing product behavior; reconstruct that behavior in
the correct owner after the deletion exposes the need.

The current product surface also still treats `odd-sdlc-ts` / `odd_sdlc`
commands as operator-facing behavior in several places, even though the ratified
boundary already says command/control belongs to ABG and the TypeScript CLI is
only a process launcher. In practice the SDLC CLI has become a drift magnet:
when context is lost, traversal semantics, target routing, replay behavior, and
projection handling are repeatedly pulled back into the product shell.

The intended product shape is simpler:

```text
ABG CLI:
  traversal command/control, start, continue, replay, result ingress,
  consequence projection, worker attachment, runtime terminal reporting

odd_sdlc:
  GTL program + product plugins
  plus irreducible typed product carriers/proof surfaces where proven
```

This ticket removes the SDLC CLI as an orchestration surface and audits the
entire source tree so odd_sdlc collapses toward the smaller ODD shape: GTL
program plus plugins.

## Review-First Multiphase Plan

No refactor starts until the review phases below are complete enough to name
the files, command paths, authority conflicts, migration owner, and proof lane
for the first deletion cut. A phase may classify code as `delete` or
`move_to_abg`, but the phase itself does not delete or move code.

Each reviewed file receives one of these classifications:
`gtl_program`, `plugin`, `product_carrier`, `product_projection`,
`package_or_release_plumbing`, `test_or_live_harness`, `move_to_abg`,
`delete`, or `temporary_blocker`.

Each reviewed command receives one of these classifications:
`ABG CLI`, `odd_sdlc library API`, `package/release API`,
`test_or_live_harness`, `temporary_blocker`, or `remove`.

## Audit Tables

### 2026-06-19 Initial CLI-Path Function Audit

Scope: this is a first pass from the public package bin through
`code/src/cli/main.ts` into `code/src/spec_method/entry.ts` and the functions
that entrypoint directly calls. It is not the full dead-code or full source
inventory pass. The current source count remains 180 `.ts` files under
`build_tenants/typescript/code/src`.

Status meanings:

- `remove_public_cli`: remove as public command/shell law after callers migrate.
- `split_library_api`: keep product library behavior, but remove command grammar
  and process binding.
- `package_api`: retain as package/install/release API after command binding
  proof is repriced.
- `product_projection`: likely survives as odd_sdlc read-model/proof behavior,
  subject to full source inventory survival proof.
- `move_to_abg`: traversal, replay, archive, runtime-control, result-ingress, or
  generic execution behavior that belongs in ABG.
- `temporary_blocker`: cannot be deleted until a named caller/proof path is
  migrated to ABG CLI. Product library APIs may survive behind ABG CLI, but
  they are not replacement command surfaces.
- `shared_candidate`: recurring mechanical helper or helper family that should
  move to `shared/` if at least one owning caller survives T-204 classification.
- `common_tooling_candidate`: reusable offline inspection or archive-analysis
  convenience behavior. It may move to shared/common tooling if surviving
  callers remain, but it must not be runtime authority or ABG substrate law.
- `review_full_inventory`: reachable from CLI path, but survival cannot be
  decided without the full 180-file inventory.

| file.function | status | description |
| --- | --- | --- |
| `build_tenants/typescript/package.json#bin.odd-sdlc-ts` | `remove_public_cli` | Public orchestration bin still points to `./build/semantic/code/src/cli/main.js`; remove it. Remaining callers are blockers to delete, not reasons to preserve the bin. |
| `code/src/cli/main.ts#top-level` | `remove_public_cli` | Thin argv/stdout/stderr/exit launcher over `invokeOddSdlcSpecMethodCommand(...)`; delete completely. Do not move to harness, hide as non-public plumbing, or replace with a forwarding shell. |
| `code/src/spec_method/index.ts#export*` | `split_library_api` | Re-exports the whole command entrypoint. Replace with explicit library/query/install/release exports; do not export command controller helpers as package law. |
| `code/src/spec_method/entry.ts#ODD_SDLC_SPEC_METHOD_COMMAND_VALUES` | `split_library_api` | Current command registry includes read models, package APIs, start, ticket intake, and archive analysis in one grammar. Split read-model APIs from ABG CLI and package APIs. |
| `code/src/spec_method/entry.ts#resolveDefaultAbgPackageSourceRoot` | `package_api` | Default ABG package-source resolution for install/release paths. Move toward install package API if retained; keep out of Spec Method command controller. |
| `code/src/spec_method/entry.ts#resolveDefaultAbgStandardsSourceRoot` | `package_api` | Install-time default for ABG standards source. Survives only as installer/package plumbing. |
| `code/src/spec_method/entry.ts#resolveDefaultAbgDocsSourceRoot` | `package_api` | Install-time default for ABG docs source. Survives only as installer/package plumbing. |
| `code/src/spec_method/entry.ts#isCommand` | `remove_public_cli` | Command grammar helper; removed with public CLI grammar. |
| `code/src/spec_method/entry.ts#fail` | `remove_public_cli` | CLI-shaped result envelope helper. Delete with command result envelope; surviving package/read-model APIs use normal typed results. |
| `code/src/spec_method/entry.ts#ok` | `remove_public_cli` | CLI-shaped result envelope helper. Delete with command result envelope; surviving package/read-model APIs use normal typed results. |
| `code/src/spec_method/entry.ts#requireOptionValue` | `remove_public_cli` | Generic argv parser helper. Delete with command grammar; no private SDLC CLI parser survives. |
| `code/src/spec_method/entry.ts#parseUntil` | `move_to_abg` | Parses start/control-loop stop mode. ABG CLI owns `start --until`; SDLC may publish product intent, not command option law. |
| `code/src/spec_method/entry.ts#parseBooleanOption` | `remove_public_cli` | Generic argv parser helper for command options. Delete with command grammar unless reintroduced as typed package API admission with no CLI semantics. |
| `code/src/spec_method/entry.ts#parseNonEmptyOptionValue` | `remove_public_cli` | Generic argv parser helper. Delete with command grammar. |
| `code/src/spec_method/entry.ts#parseJsonOptionValue` | `remove_public_cli` | Generic argv JSON option helper. Delete with SDLC command grammar; any surviving operator flag is implemented in ABG CLI. |
| `code/src/spec_method/entry.ts#parseOptions` | `move_to_abg` | Parses traversal command options: workspace, output workspace, target, graph overlay, until, worker, evaluator priority, runtime traversal selections. ABG CLI owns operator parsing; `gaps` priority may survive only as product support input behind that surface. |
| `code/src/spec_method/entry.ts#parseInstallOptions` | `package_api` | Install API request parser. Keep only if a package/release command surface remains outside orchestration; otherwise expose typed API. |
| `code/src/spec_method/entry.ts#parseReleaseCutOptions` | `package_api` | Release-cut request parser. Current release proof depends on `odd-sdlc-ts` binary and must be repriced. |
| `code/src/spec_method/entry.ts#parseReleaseSnapshotOptions` | `package_api` | Release-snapshot request parser. Keep as release API plumbing, not traversal command law. |
| `code/src/spec_method/entry.ts#parseAnalyzeRunOptions` | `common_tooling_candidate` | Generic archive/run analysis option parser. Classify with offline archive-inspection tooling, not ABG runtime ownership. |
| `code/src/spec_method/entry.ts#parseTicketIntakeOptions` | `temporary_blocker` | Ticket intake currently consumes operator-run archives. Any surviving operator command must be ABG CLI; odd_sdlc may provide product ticket projection behind that surface. |
| `code/src/spec_method/entry.ts#parseTarget` | `move_to_abg` | Parses start target grammar for `next`, `graph_function`, `asset`, and `overlay`. ABG CLI should own command target parsing; odd_sdlc may retain typed target carriers consumed by ABG. |
| `code/src/spec_method/entry.ts#admitOddSdlcSpecMethodRequest` | `split_library_api` | Single admission point for all commands. Split into explicit library request admission for read models/package APIs and ABG-owned command request admission for start/control. |
| `code/src/spec_method/entry.ts#sourceFilePaths` | `review_full_inventory` | Workspace source discovery is generic enough to suspect ABG/workspace ownership, but query-domain/gaps need product source inputs. Requires full workspace module review. |
| `code/src/spec_method/entry.ts#readSourceInputs` | `review_full_inventory` | Reads workspace files into SDLC source-input carriers. Potential product projection survival, but generic workspace scanning may move to ABG. |
| `code/src/spec_method/entry.ts#projectConstraints` | `product_projection` | Thin call into workspace conformance. Likely survives as product domain input, but not in command controller. |
| `code/src/spec_method/entry.ts#outputWorkspaceRootFor` | `move_to_abg` | Command-level source/output workspace routing is generic execution/workspace handling. ABG or install harness should own this after migration. |
| `code/src/spec_method/entry.ts#workspaceContext` | `split_library_api` | Builds ingress, conformed project, and conformance reports. Keep only as query/read-model library helper if it passes full inventory survival proof. |
| `code/src/spec_method/entry.ts#queryDomainFor` | `product_projection` | Projects odd_sdlc query domain from GTL module and workspace ingress. Survives as library/read-model API, not CLI command law. |
| `code/src/spec_method/entry.ts#jsonRecordFromFile` | `common_tooling_candidate` | Generic local JSON archive reader. Runtime callers must move to admitted ABG facts; if archive analysis survives, this belongs in common tooling. |
| `code/src/spec_method/entry.ts#operatorRunArchiveRootsNewestFirst` | `common_tooling_candidate` | Local archive enumeration convenience. It cannot remain replay/gaps authority; retain only as offline archive-inspection tooling if needed. |
| `code/src/spec_method/entry.ts#edgeFulfillmentCountsFromRecord` | `move_to_abg` | Rehydrates fulfillment ledger shape from archive JSON. Replace with ABG-admitted projection or product query over admitted facts. |
| `code/src/spec_method/entry.ts#edgeFulfillmentLedgerFromArchive` | `move_to_abg` | Reads local ledger archive. This is runtime/archive reconstruction inside SDLC command path. |
| `code/src/spec_method/entry.ts#edgeClosureDispositionFromRecord` | `move_to_abg` | Parses closure disposition from archive JSON. Closure/fold truth belongs to ABG admission/projection. |
| `code/src/spec_method/entry.ts#edgeClosureDecisionFromArchive` | `move_to_abg` | Reads local closure decision archive. Replace with ABG projection consumption. |
| `code/src/spec_method/entry.ts#nextActionProjectionFromArchive` | `move_to_abg` | Reads local next-action archive. ABG owns continuation/transition projection; SDLC can interpret admitted meaning. |
| `code/src/spec_method/entry.ts#isSelectedNextGraphFunctionArchiveDiagnostic` | `move_to_abg` | Helper for archive-derived next-action diagnostics. Remove with local archive next-selection logic. |
| `code/src/spec_method/entry.ts#specMethodBlockingPayload` | `remove_public_cli` | Converts archive diagnostics into CLI blocking payloads. Product blocking carriers may survive elsewhere, but this envelope is command-specific. |
| `code/src/spec_method/entry.ts#completedGraphFunctionNameFromArchive` | `common_tooling_candidate` | Archive inference helper. It may support offline diagnostics, but cannot drive traversal continuation after runtime callers move to ABG projections. |
| `code/src/spec_method/entry.ts#selectedNextGraphFunctionFromOverlayCompletionArchive` | `move_to_abg` | Computes post-close overlay continuation from archive files. ABG owns continuation and graph-span/reentry application. |
| `code/src/spec_method/entry.ts#selectedNextGraphFunctionFromArchive` | `move_to_abg` | Central local next-traversal reconstruction from archives, closure, ledger, and next-action projection. Remove from odd_sdlc command path. |
| `code/src/spec_method/entry.ts#assessmentStatusFromRecord` | `move_to_abg` | Parses worker assessment archive data for requirement fulfillment rehydration. Needs ABG-admitted fact source. |
| `code/src/spec_method/entry.ts#requirementAssessmentsFromArchive` | `move_to_abg` | Reads `worker_result_report.json` assessments. Product requirement projection should consume admitted facts, not archive scraping. |
| `code/src/spec_method/entry.ts#archiveRefForRoot` | `common_tooling_candidate` | Archive URI helper used by local archive scan. Keep only if common archive-inspection tooling survives. |
| `code/src/spec_method/entry.ts#missingTraversalConsequenceArtifactRefs` | `common_tooling_candidate` | Offline diagnostic for missing consequence artifacts. Runtime completeness must come from ABG admitted facts/projections. |
| `code/src/spec_method/entry.ts#requirementFulfillmentForGaps` | `split_library_api` | Product requirement-fulfillment projection may survive, but its current archive rehydration path must move to ABG/admitted projections. |
| `code/src/spec_method/entry.ts#closureRegisterForHomeostaticTriage` | `product_projection` | Converts requirement fulfillment into a product closure register for triage. Candidate survivor as odd_sdlc read model. |
| `code/src/spec_method/entry.ts#homeostaticGapTriageForGaps` | `product_projection` | Product-domain observation/classification/route projection over gap pressure. Candidate survivor as library API, not command law. |
| `code/src/spec_method/entry.ts#defaultRegimeFor` | `split_library_api` | Contains product defaulting around `Fg_conform_project` and overlay membership. Keep only if represented as product policy consumed by ABG start intent; not as CLI runtime selection. |
| `code/src/spec_method/entry.ts#startOutcomeFor` | `move_to_abg` | Builds public start request, target, replay next-action fields, worker attachment, and calls `publicStartOnce`. Target resolution/intention may split out; start orchestration moves to ABG. |
| `code/src/spec_method/entry.ts#selectedActionRequiresFreshTargetTraversal` | `move_to_abg` | Detects repair/continuation actions that force fresh traversal. ABG owns continuation/reentry semantics. |
| `code/src/spec_method/entry.ts#basisIdValue` | `move_to_abg` | Runtime event inspection helper. ABG owns runtime event model and replay matching. |
| `code/src/spec_method/entry.ts#hasReplayForBasis` | `move_to_abg` | Local replay-presence check over runtime events. ABG owns replay truth. |
| `code/src/spec_method/entry.ts#selectedArchiveMatchesRequestedStart` | `move_to_abg` | Compares requested start against archive-derived next action/overlay sequence. This is command-side replay/continuation routing. |
| `code/src/spec_method/entry.ts#startOutcomeForObservedReplay` | `move_to_abg` | Central replay-aware start selector. It reconstructs next traversal from archives/events and falls back across `until` values/start targets. Remove from odd_sdlc. |
| `code/src/spec_method/entry.ts#replayEventsForBasis` | `move_to_abg` | Filters runtime events for an execution basis. ABG owns event replay/filtering. |
| `code/src/spec_method/entry.ts#startOutcomeRequiresFreshTargetTraversal` | `move_to_abg` | Command-side rule for clearing replay events on selected reentry actions. ABG-owned continuation policy. |
| `code/src/spec_method/entry.ts#constructionPrioritySchemeForSpecMethodGaps` | `product_projection` | Gaps-only domain priority policy over a named edge. Candidate survivor as read-model library input; command option parser must go away. |
| `code/src/spec_method/entry.ts#installedStartPayloadFor` | `move_to_abg` | Reads runtime events, derives replay-aware start, decides worker/deterministic dispatch, calls installed operator, and passes replay/event facts. This is the main SDLC-local orchestration path to retire. |
| `code/src/spec_method/entry.ts#gapsPayload` | `split_library_api` | Read-model payload is worth preserving, but current implementation invokes replay-aware start and local archive/event scanning. Split into product query over ABG projections plus product triage/dossier library. |
| `code/src/spec_method/entry.ts#SdlcAnalyzeRunCliEnvelope` | `common_tooling_candidate` | CLI envelope around generic run analysis. If retained, move out of product runtime into common tooling or harness. |
| `code/src/spec_method/entry.ts#analyzeRunPayload` | `common_tooling_candidate` | Generic archive analysis command, renderer, output writer, strict failure behavior. Treat as shared/common tooling candidate, not ABG runtime substrate. |
| `code/src/spec_method/entry.ts#commandPayload` | `remove_public_cli` | Sync command dispatcher. Delete; do not replace with a private SDLC command API. |
| `code/src/spec_method/entry.ts#commandPayloadAsync` | `remove_public_cli` | Async command dispatcher. Delete; start/gaps go through ABG CLI and install/release become package APIs without command dispatch. |
| `code/src/spec_method/entry.ts#invokeOddSdlcSpecMethodCommandSync` | `remove_public_cli` | Public command helper used by tests. Tests must migrate command/proof paths to ABG CLI; product library calls may only support behind-surface assertions. |
| `code/src/spec_method/entry.ts#invokeOddSdlcSpecMethodCommand` | `remove_public_cli` | Async public command helper used by CLI/tests/live harness. Delete completely after callers migrate to ABG CLI or non-command package/read-model APIs. |
| `code/src/spec_method/entry.ts#analyzeRunResult` | `remove_public_cli` | CLI-specific result exit-code envelope for analysis. Move with analyze-run or delete. |
| `code/src/spec_method/entry.ts#isAnalyzeRunCliEnvelope` | `remove_public_cli` | CLI serialization guard. Delete with analyze-run command envelope. |
| `code/src/spec_method/entry.ts#isUnknownArray` | `remove_public_cli` | Local parser/serializer helper. Keep only if reused by surviving typed library APIs. |
| `code/src/spec_method/entry.ts#stringField` | `review_full_inventory` | Generic unsafe JSON field reader used by archive/serialization logic. Likely delete/move with archive and CLI serializer, but full pass should confirm no library need. |
| `code/src/spec_method/entry.ts#numberArrayField` | `remove_public_cli` | Used by CLI output compaction; delete with CLI serializer unless archive projection split keeps it elsewhere. |
| `code/src/spec_method/entry.ts#numberField` | `review_full_inventory` | Used by archive rehydration and output compaction. Likely delete/move with those paths. |
| `code/src/spec_method/entry.ts#stringArrayField` | `review_full_inventory` | Used by archive rehydration and output compaction. Likely delete/move with those paths. |
| `code/src/spec_method/entry.ts#childRecord` | `remove_public_cli` | Generic CLI serializer helper; delete with serializer unless retained by product read-model API. |
| `code/src/spec_method/entry.ts#compactArrayValue` | `remove_public_cli` | Output-size compaction for CLI JSON. Delete with public CLI output surface. |
| `code/src/spec_method/entry.ts#compactEvidenceRefs` | `remove_public_cli` | CLI JSON compaction helper. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#omittedBlockingReasonCarrier` | `remove_public_cli` | Invents placeholder carrier for truncated CLI output. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactBlockingReasonCarrierArray` | `remove_public_cli` | CLI JSON compaction helper. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactGapReasonArray` | `remove_public_cli` | CLI JSON compaction helper. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactBlockingReasonCarrier` | `remove_public_cli` | CLI JSON compaction helper. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactGapReason` | `remove_public_cli` | CLI JSON compaction helper. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactGapDossier` | `remove_public_cli` | CLI JSON compaction helper. Delete with CLI serializer; product dossier data may survive elsewhere. |
| `code/src/spec_method/entry.ts#compactPostflight` | `remove_public_cli` | CLI JSON compaction helper for installed operator output. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactSummary` | `remove_public_cli` | CLI JSON compaction helper. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactInlineArchiveCarrier` | `remove_public_cli` | CLI compaction replaces inline payloads with archive refs. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactRetryContext` | `remove_public_cli` | CLI compaction helper over retry context. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactManifest` | `remove_public_cli` | CLI compaction helper over installed-operator manifest. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactInstalledStartJsonPayload` | `remove_public_cli` | Converts installed-operator outcome to CLI projection. Delete with public CLI start. |
| `code/src/spec_method/entry.ts#compactPublicStartForGapsJson` | `remove_public_cli` | CLI JSON compaction for gaps start preview. Product read model may provide a typed compact view separately. |
| `code/src/spec_method/entry.ts#compactGapsJsonPayload` | `remove_public_cli` | CLI JSON compaction for gaps output. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactRequirementFulfillmentRowForGapsJson` | `remove_public_cli` | CLI JSON compaction for requirement rows. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactRequirementFulfillmentForGapsJson` | `remove_public_cli` | CLI JSON compaction for requirement fulfillment. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactGapDossierForGapsJson` | `remove_public_cli` | CLI JSON compaction for gap dossier. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#jsonPayloadForResult` | `remove_public_cli` | Routes CLI JSON output compaction by command. Delete with CLI serializer. |
| `code/src/spec_method/entry.ts#compactGapsResult` | `remove_public_cli` | Human text output for `odd-sdlc-ts gaps`. Delete with public CLI. |
| `code/src/spec_method/entry.ts#compactInstalledStartResult` | `remove_public_cli` | Human text output for installed `odd-sdlc-ts start`. Delete with public CLI. |
| `code/src/spec_method/entry.ts#compactPublicStartResult` | `remove_public_cli` | Human text output for public start preview. Delete with public CLI. |
| `code/src/spec_method/entry.ts#serializeOddSdlcSpecMethodResult` | `remove_public_cli` | Top-level CLI serializer. Remove after process launcher and command helper are retired. |

### 2026-06-19 Direct Fan-Out Audit From CLI Path

| file.function | status | description |
| --- | --- | --- |
| `code/src/graph/index.ts#constructSdlcGraphFunctionCatalog` | `product_projection` | Read-only GTL catalog publication. Survives as product library/catalog API if full inventory confirms no command coupling. |
| `code/src/graph/index.ts#constructSdlcGtlModule` | `product_projection` | GTL module declaration. Positive survivor candidate. |
| `code/src/graph/index.ts#constructSdlcTraversalOverlayCatalog` | `product_projection` | Product overlay catalog over GTL graph. Survives as declaration/read model, not executor. |
| `code/src/start/index.ts#publicStartOnce` | `move_to_abg` | Current start projection is consumed as local command start basis. Needs split: SDLC may publish product start-intent data; ABG owns runtime start. |
| `code/src/start/index.ts#projectSdlcWorkerAttachment` | `move_to_abg` | Worker attachment is command/control and transport binding; ABG owns worker/transport admission. |
| `code/src/operator/index.ts#readOddSdlcRuntimeEvents` | `move_to_abg` | Runtime event reading belongs to ABG. |
| `code/src/operator/index.ts#readOddSdlcRuntimeEventsSync` | `move_to_abg` | Sync runtime event reading for gaps. Replace with ABG projection/query input. |
| `code/src/operator/index.ts#executeInstalledOperatorStart` | `move_to_abg` | Main installed start execution path. Product plugins/carriers may survive, but command/control/runtime loop ownership moves to ABG. |
| `code/src/analysis/index.ts#analyzeSdlcFdRunArchive` | `common_tooling_candidate` | Generic archive analysis. Likely common convenience tooling if callers remain; product-specific proof rows require separate survival proof. |
| `code/src/analysis/index.ts#renderSdlcFdRunAnalysisMarkdown` | `common_tooling_candidate` | Renderer for generic archive analysis command. Move with analyzer into common tooling or harness if retained. |
| `code/src/install/index.ts#installOddSdlcTypescript` | `package_api` | Product installer behavior survives, but current implementation still creates `odd-sdlc-ts` command binding and instruction guidance. |
| `code/src/release/index.ts#deriveOddSdlcTypescriptReleaseCut` | `package_api` | Release API survives only after binary-binding proof stops requiring `odd-sdlc-ts`. |
| `code/src/release/index.ts#deriveOddSdlcTypescriptReleaseSnapshot` | `package_api` | Release snapshot API likely survives as package/release proof, separate from orchestration CLI. |
| `code/src/qualification/index.ts#describeOddSdlcTypescriptRcQualification` | `product_projection` | Read-only proof projection. Must be updated where it cites `odd-sdlc-ts` command law. |
| `code/src/projection/index.ts#projectSdlcQueryDomain` | `product_projection` | Product query-domain projection. Survives as library API consumed by ABG/clients. |
| `code/src/projection/index.ts#deriveSdlcGapDossier` | `product_projection` | Product gap dossier over admitted/runtime facts. Survives only if fed by ABG projections instead of local archive scanning. |
| `code/src/projection/index.ts#evalSdlcGapFromReplay` | `move_to_abg` | Evaluates gaps from replay events in SDLC entrypoint. ABG owns replay; product may interpret projected gap facts. |
| `code/src/projection/index.ts#projectSdlcRequirementFulfillmentPublicViewFromPriorProjection` | `product_projection` | Product requirement read model can survive; archive rehydration inputs must change. |
| `code/src/triage/index.ts#observeSdlcGapPressure` | `product_projection` | Product gap-pressure observation. Candidate survivor over admitted projections. |
| `code/src/triage/index.ts#classifySdlcGapObservation` | `product_projection` | Product triage classification. Candidate survivor as library API. |
| `code/src/triage/index.ts#bindSdlcRoute` | `product_projection` | Product route-binding projection. Must not become ABG traversal command or local start control. |
| `code/src/workspace/index.ts#deriveSdlcWorkspaceIngressReport` | `review_full_inventory` | Workspace ingress is used by query/read models. Need full workspace-module survival proof because generic workspace handling is suspect. |
| `code/src/workspace/index.ts#deriveSdlcConformProjectProfileFromWorkspace` | `review_full_inventory` | Product conformance profile may survive, but source/workspace scan placement needs review. |
| `code/src/workspace/index.ts#deriveSdlcConformProjectReportFromWorkspace` | `review_full_inventory` | Product conformance report may survive as read model, not command/controller behavior. |
| `code/src/workspace/index.ts#deriveSdlcConformProjectReportFromWorkspaces` | `review_full_inventory` | Cross-workspace conformance report currently supports output-workspace routing. Generic workspace handling may move to ABG/test harness. |
| `code/src/tickets/index.ts#admitSdlcTicketExecutionContract` | `product_projection` | Ticket execution contract admission is product meaning. Shell command should disappear; library API may survive. |
| `code/src/tickets/index.ts#createSdlcTerminalGapTicketsFromOperatorRun` | `temporary_blocker` | Consumes operator-run archive data to create tickets. Any operator workflow must enter through ABG CLI; odd_sdlc may supply product ticket projection and common tooling may inspect archives. |
| `code/src/gtl_conformance/index.ts#assertCurrentSdlcGtlProgramConformance` | `product_projection` | Programmatic GTL conformance gate survives; command entrypoint should not be its owning surface. |

### 2026-06-19 Immediate Caller And Proof Blockers

Migration rule: every temporary blocker that currently proves or invokes
`odd-sdlc-ts start` or `odd-sdlc-ts gaps` must migrate to ABG CLI
(`genesis-ts` / `abiogenesis-ts`). If ABG CLI lacks exact SDLC parity for the
existing operator affordance, that is an ABG CLI feature gap, not a reason to
keep an SDLC command surface. odd_sdlc may retain product library projections,
carriers, GTL declarations, and plugins behind the ABG CLI surface, but tests,
live lanes, requirements, installer guidance, and release proofs must not use
private SDLC command helpers or `odd-sdlc-ts` as replacement command law.

| file.function | status | description |
| --- | --- | --- |
| `test_env/tests/test_t058_spec_method_entrypoint.test.mjs#invokeOddSdlcSpecMethodCommandSync` | `temporary_blocker` | Tests prove `start`, `gaps`, `query-domain`, and replay behavior through private SDLC command helper. `start` and `gaps` must migrate to ABG CLI; product read-model assertions can remain behind that surface. |
| `test_env/tests/test_t059_install_release_adapter.test.mjs#installed instruction assertions` | `temporary_blocker` | Still asserts `odd-sdlc-ts gaps` and `odd-sdlc-ts start` instruction text and release binary path. Must reprice installed contract to teach ABG CLI `gaps/start`. |
| `test_env/tests/test_t064_installed_operator_ux.test.mjs#CLI_MAIN` | `temporary_blocker` | Uses built `cli/main.js` in installed-operator UX proof. Must migrate UX proof to ABG CLI invocation. |
| `test_env/tests/test_t161_fd_run_analysis_linter.test.mjs#CLI_MAIN` | `temporary_blocker` | Exercises `analyze-run` through SDLC CLI. If exposed as an operator command, route through ABG CLI or common tooling; do not preserve SDLC CLI. |
| `test_env/live/test_t109_live_installed_data_mapper_pty.test.mjs#installedOddSdlcCommand` | `temporary_blocker` | Live installed data-mapper lane finds and runs `odd-sdlc-ts`. Must use ABG CLI `start`. |
| `test_env/live/test_t115_live_installed_data_mapper_repair_flow.test.mjs#installedOddSdlcCommand` | `temporary_blocker` | Live repair lane still requires installed `odd-sdlc-ts`. Must use ABG CLI `start`. |
| `test_env/live/test_t131_guided_odd_chat_live_build.test.mjs#SOURCE_ODD_SDLC_CLI` | `temporary_blocker` | Source install and installed start path use `build/semantic/code/src/cli/main.js` and installed `odd-sdlc-ts`. Must migrate to source/installed ABG CLI. |
| `test_env/live/test_t162_ticket_workflow_live.test.mjs#runCli` | `temporary_blocker` | Built CLI projects/admit/starts ticket workflow. Start/gaps phases must go through ABG CLI; odd_sdlc ticket/query projections may remain behind that path. |
| `test_env/live/run_full_external_data_mapper_sandbox.mjs#sourceCli` | `temporary_blocker` | Live sandbox script invokes source CLI and installed `odd-sdlc-ts`. Must use ABG CLI for operator commands. |
| `test_env/live/run_t199_data_mapper_code_depth_resume.mjs#sourceCli` | `temporary_blocker` | Already uses `genesis-ts start` for ABG runtime after install, but install still invokes source `odd-sdlc-ts` and asserts installed `odd-sdlc-ts` exists. Remove the remaining SDLC CLI install/proof dependency. |
| `test_env/sandbox/scenario_sandbox.mjs#buildStartArgs` | `temporary_blocker` | Scenario harness still constructs SDLC `start` command args. Must construct ABG CLI `start` args instead. |
| `test_env/sandbox/test_t087_t091_t096_internal_data_mapper_induction_sandbox.test.mjs#invokeOddSdlcSpecMethodCommand([start])` | `temporary_blocker` | Sandbox induction uses private SDLC command helper for start. Must migrate to ABG CLI `start`. |
| `specification/requirements/08-odd-sdlc-first-slice.md#REQ-F-ODDSDLC-007-AC-5a` | `temporary_blocker` | Active requirement still teaches `odd-sdlc-ts gaps/start`; reprice to ABG CLI `gaps/start`. |
| `specification/requirements/14-odd-sdlc-installed-product-contract.md#REQ-F-ODDSDLC-047` | `temporary_blocker` | Active installed contract maps operator `gaps/start` to `odd-sdlc-ts`. Must map operator command/control to ABG CLI. |
| `code/src/install/installer.ts#installAdmittedOddSdlcTypescript` | `temporary_blocker` | Installer passes `commandNames: ["odd-sdlc-ts"]` and fails if binding is absent. Must stop installing/proving SDLC CLI and rely on ABG CLI availability. |
| `code/src/install/instruction_files.ts#instructionLines` | `temporary_blocker` | Generated AGENTS/CLAUDE guidance still tells operators to run `odd-sdlc-ts gaps/start/rc-report`. Must teach ABG CLI for `gaps/start`. |
| `code/src/release/release_cut.ts#deriveOddSdlcTypescriptReleaseCut` | `temporary_blocker` | Release proof fails unless package publishes `odd-sdlc-ts`. Must prove ABG CLI integration instead. |
| `code/src/qualification/installed_initial_state.ts#commandChecks` | `temporary_blocker` | Installed sanity proof still requires `odd-sdlc-ts` command. Must check ABG CLI command availability/parity instead. |

### 2026-06-19 Legacy B-076 Helper-Refactor Overlap

Backlog ticket
`.ai-workspace/tickets/backlog/B-076-consolidate-recurring-shared-helpers-under-shared-domain-utilities.md`
tracks duplicated mechanical helpers: `uniqueSorted`, `stableJson` /
`stableOperatorJson`, `sha256Text`, `parseNonNegativeInteger`, and
`parseArray`. That ticket is a `realization_refactor`; T-204 is a
`product_reprice`. Therefore T-204 must actively identify `shared/` candidates
while deciding each owning file's survival. The sequence is:

1. classify the owning file/function under T-204;
2. classify the helper as `shared_candidate` when the helper is mechanical,
   recurring, and not itself domain authority;
3. promote the helper to `shared/` only if at least one surviving caller remains
   after command/runtime/archive code is moved, split, or deleted.

Do not promote a helper into `shared/` merely because it recurs if its only
surviving callers are `move_to_abg`, `remove_public_cli`, or deleted
orchestration/archive code.

| file.function | status | description |
| --- | --- | --- |
| `backlog/B-076#ticket` | `shared_candidate` | Keep as related cleanup and use it as the seed list for shared-candidate discovery. T-204 owns the survival decision; B-076 owns the later mechanical consolidation. |
| `code/src/shared/collections.ts#uniqueSorted` | `product_projection` | Existing canonical helper already supports many product projection/graph/triage modules. Full pass should classify each caller; no need to create a new broad utility module. |
| `code/src/shared/validation.ts#parseArray` | `product_projection` | Existing canonical parser is already used by `start/public_start.ts`, test-design registers, transform/evaluate plugins, and other carriers. Caller ownership still needs full inventory classification. |
| `code/src/shared/digest.ts#sha256Text` | `product_projection` | Existing canonical digest helper exists. Local duplicates should import it only in files that survive T-204. |
| `code/src/release/release_cut.ts#stableJson` | `shared_candidate` | Duplicate stable JSON in release-cut package proof. Promote to shared only if release proof survives after `odd-sdlc-ts` binary binding is removed. |
| `code/src/release/release_snapshot.ts#stableJson` | `shared_candidate` | Duplicate stable JSON in release-snapshot proof. Candidate for shared serializer if release module survives. |
| `code/src/install/installer.ts#stableJson` | `shared_candidate` | Duplicate stable JSON in installer. Candidate for shared serializer after installed command-binding contract is repriced. |
| `code/src/qualification/installed_initial_state.ts#stableJson` | `shared_candidate` | Duplicate stable JSON in installed sanity proof. Promote only if the qualification surface survives after it stops proving removed command law. |
| `code/src/graph/target_carrier_contracts.ts#stableJson` | `shared_candidate` | Stable JSON supports target-carrier contract digesting. Positive shared candidate if target-carrier declarations remain product law. |
| `code/src/operator/composition_identity.ts#stableJson` | `shared_candidate` | Stable JSON under operator domain. Promote only if composition identity remains product plugin/carrier behavior rather than ABG-owned runtime law. |
| `code/src/operator/edge_gain_closure.ts#stableJson` | `shared_candidate` | Stable JSON supports edge gain/closure digesting. Candidate shared serializer if edge gain/closure proof remains product meaning. |
| `code/src/operator/plugins/transform/launch_contract.ts#stableOperatorJson` | `shared_candidate` | Serializer is in worker handoff/orchestration-heavy module. Promote only after plugin-vs-ABG ownership is classified. |
| `code/src/operator/plugins/evaluate/content_register.ts#stableJson` | `shared_candidate` | Stable JSON supports evaluator content register. Candidate shared serializer if evaluator plugin survives. |
| `code/src/tickets/workflow.ts#sha256Text` | `shared_candidate` | Local duplicate should import `shared/digest.ts` if ticket workflow survives as product read model/API. |
| `code/src/hooks/admission.ts#parseNonNegativeInteger` | `shared_candidate` | Local parser in hook admission. Candidate for shared validation import if hook carriers survive. |
| `code/src/operator/product_materialization/observation.ts#parseNonNegativeInteger` | `shared_candidate` | Parser in product materialization observation. Promote only if product-materialization observation survives as product carrier/projection. |
| `code/src/operator/product_materialization/replay.ts#parseNonNegativeInteger` | `move_to_abg` | Parser in replay-named module; likely moves/deletes with replay ownership unless full inventory proves product projection only. |
| `code/src/operator/plugins/transform/result_projection.ts#parseNonNegativeInteger` | `shared_candidate` | Parser in transform result projection. Candidate shared-validation import if plugin result projection survives. |
| `code/src/operator/plugins/evaluate/postflight_checks.ts#parseNonNegativeInteger` | `shared_candidate` | Parser in evaluator postflight checks. Candidate shared-validation import if evaluator plugin survives. |
| `code/src/operator/plugins/consequence/edge_projection.ts#parseNonNegativeInteger` | `shared_candidate` | Parser in consequence edge projection. Promote only if consequence edge projection remains product read-model over ABG-admitted facts. |
| `code/src/operator/postflight/gap_dossier.ts#parseNonNegativeInteger` | `shared_candidate` | Parser in gap dossier projection. Candidate shared-validation import if dossier remains product projection and not command/archive controller. |
| `code/src/operator/review_grade_edge_fulfillment.ts#parseNonNegativeInteger` | `shared_candidate` | Parser in review-grade evaluator/plugin path. Candidate shared-validation import if plugin survives. |
| `code/src/operator/component_depth_register.ts#uniqueSortedStrings` | `shared_candidate` | Local unique-sort helper in operator register. Replace with shared helper only if the register survives T-204. |

### 2026-06-19 ABG Availability Audit For `move_to_abg` Rows

Scope: ABG availability check against
`/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript` on
2026-06-19. This does not perform the migration; it classifies whether the
earlier `move_to_abg` recommendation already has an ABG target.

Status meanings:

- `abg_exists`: ABG already has a public CLI/API/contract that owns the
  behavior. T-204 work is caller migration plus odd_sdlc deletion/splitting.
- `existing_abg_no_enhancement`: ABG already owns enough substrate to delete or
  adapt the SDLC code. No ABG enhancement is justified for the row.
- `abg_enhancement_candidate`: ABG has the substrate, but an ABG CLI/API parity
  gap may exist. It is not approved work until unit/regression testing proves a
  surviving product need.
- `abg_new_needed`: reserved for behavior that must be ABG runtime substrate
  and has no ABG surface yet. No row in this pass uses it after separating the
  common archive-tooling lane.
- `common_tooling_candidate`: no ABG runtime surface is expected. The behavior
  belongs to a reusable offline archive-inspection/tooling lane if it survives.

Strict bucket counts after challenging the prior 25 `abg_partial` rows:

| bucket | count | meaning |
| --- | ---: | --- |
| existing ABG | 26 | ABG already has enough owning surface or substrate. Delete/adapt SDLC code; no ABG enhancement is justified. This includes 7 exact `abg_exists` rows and 19 `existing_abg_no_enhancement` rows. |
| ABG enhancement/parity candidates | 4 | Possible ABG CLI/API parity only. These are not approved until unit/regression tests prove a surviving product need. |
| completely new ABG | 0 | No currently identified row requires brand-new ABG runtime law. Any future row in this bucket must justify why it is ABG runtime substrate rather than product code or common tooling. |
| common tooling | 10 | Offline archive-analysis/convenience behavior. Keep only as common tooling if tests prove ongoing value; never as SDLC runtime authority. |

ABG enhancement/parity validation checked these existing ABG surfaces:

- command surface: `src/cli/command.ts#runStartCommand`,
  `src/cli/command.ts#runGapsCommand`, `src/cli/command.ts#parseStartTarget`;
- start/input/output admission: `src/abg/m03/admission/carriers.ts#admitStartIntent`,
  `src/abg/m03/admission/carriers.ts#parseStartOutputWorkspaceBinding`,
  `src/app/m04/asset_addressing/resolve.ts#resolvePublicAssetTarget`;
- runtime/projection/replay: `src/app/m04/max_autonomy/callable_start.ts#publicCallableStartAsync`,
  `src/abg/m03/runner/engine_runner.ts#runEngineStartAsync`,
  `src/abg/m03/contracts/runtime_support.ts#runtimeEventsForBasis`,
  `src/abg/m03/contracts/projection.ts#deriveRuntimeAggregateProjection`;
- continuation/reentry: `src/abg/m03/contracts/continuation_transition.ts#deriveRuntimeContinuationTransitionProjection`,
  `src/abg/m03/contracts/traversal_non_progress.ts#deriveTraversalContinuationActionProjection`,
  `src/abg/m03/runner/runtime_authoring_routes.ts#applyGraphSpanReentryRoute`;
- payload/assurance/result: `src/abg/m03/contracts/payload_ledger.ts#derivePayloadLedgerProjection`,
  `src/abg/m03/contracts/assurance.ts#deriveAssuranceProjection`,
  `src/abg/m03/contracts/assurance.ts#deriveAssuranceClosureDecision`,
  `src/app/m04/result_assessment/assessment.ts#resultAssessment`,
  `src/abg/m03/runner/attached_fp_worker.ts#deriveAttachedFpResultDecision`;
- worker/transport: `src/abg/m03/transport/process_actor.ts`,
  `src/shared/abg_library/agent_transport.ts`.

ABG evidence found:

- `@abiogenesis/typescript-tenant@4.1.0-rc.1` publishes `abiogenesis-ts` and
  `genesis-ts` bins and exports `./abg/m03`, `./abg/m03/transport`,
  `./app/m04`, `./app/m04/gaps`, `./app/m04/max-autonomy`,
  `./app/m04/result-assessment`, and related app/runtime surfaces.
- `src/cli/command.ts#runStartCommand` implements `start` over a runtime
  binding, reads `.ai-workspace/events/events.jsonl`, calls
  `publicCallableStartAsync(...)`, and appends emitted runtime events.
- `src/cli/command.ts#runGapsCommand` implements `gaps` over
  `publicGaps(...)` and the same runtime event log.
- `odd-sdlc-ts` does not implement `start`/`gaps` by invoking ABG CLI. It
  duplicates the command surface and calls ABG package APIs directly:
  `spec_method/entry.ts#installedStartPayloadFor` reads runtime events,
  derives a local replay-aware start, then calls
  `operator/installed_operator.ts#executeInstalledOperatorStart`;
  `spec_method/entry.ts#gapsPayload` reads runtime events, derives the same
  local start, then calls `projection/index.ts#evalSdlcGapFromReplay`.
  `start/public_start.ts` imports ABG APIs such as `admitStartIntent`,
  `admitExecutionBasis`, and `deriveAdvancementTransition` from
  `@abiogenesis/typescript-tenant`. That direct-library implementation is the
  drift this ticket removes.
- `src/cli/command.ts#parseStartTarget` supports `next`,
  `graph_function:<handle>`, and `asset:<handle>`. No ABG CLI `overlay`
  target grammar was found.
- `src/abg/m03/admission/carriers.ts#admitStartIntent` admits start intent,
  input bindings, requested outputs/output workspace binding, and runtime
  traversal selections.
- Runtime ownership is present through `runEngineStart`,
  `runEngineStartAsync`, `deriveRuntimeAggregateProjection`,
  `runtimeEventsForBasis`, `deriveRuntimeContinuationTransitionProjection`,
  `deriveTraversalContinuationActionProjection`, retry frontier,
  graph-span reentry, output allocation, payload ledger, assurance, event
  admission, result assessment, live status, and event ingress surfaces.
- No public ABG `analyze-run` archive linter, generic operator-run archive
  root enumerator, or Markdown renderer equivalent was found. This is not an
  ABG runtime substrate gap; it is a separate common tooling candidate if a
  surviving caller still needs offline archive inspection.

ABG CLI parity rule for retired SDLC commands:

| Retired SDLC command | ABG CLI status | Required parity decision |
| --- | --- | --- |
| `odd-sdlc-ts start` | generic ABG CLI `start` exists through `genesis-ts` / `abiogenesis-ts` | Migrate callers to ABG CLI. If SDLC overlay targeting, product start-intent defaults, or installed-worker ergonomics are missing, add them as ABG CLI feature parity rather than preserving SDLC CLI. |
| `odd-sdlc-ts gaps` | generic ABG CLI `gaps` exists through `genesis-ts` / `abiogenesis-ts` | Migrate callers to ABG CLI. If SDLC-specific requirement fulfillment, gap dossier, ticket route, or priority projection is needed, expose it behind ABG CLI using odd_sdlc product projections. |

| odd_sdlc file.function | ABG availability | ABG surface checked | migration note |
| --- | --- | --- | --- |
| `code/src/spec_method/entry.ts#parseUntil` | `abg_exists` | `cli/command.ts#parseUntil`, `abg/m03/admission/carriers.ts#admitStartIntent` | ABG already owns `start --until` and typed `StartIntent.until`. Delete SDLC parser after callers move to ABG CLI. |
| `code/src/spec_method/entry.ts#parseOptions` | `abg_enhancement_candidate` | `cli/command.ts#parseStartCommand`, `cli/command.ts#parseGapsCommand`, `abg/m03/admission/carriers.ts#admitStartIntent` | ABG CLI already covers workspace, target, until, and mode flags; typed start admission already covers runtime traversal selections and output binding. Only test-proven CLI parity for those existing typed fields can justify ABG work. |
| `code/src/spec_method/entry.ts#parseAnalyzeRunOptions` | `common_tooling_candidate` | `rg analyze/archive` over ABG app/runtime sources | No ABG runtime API is expected here. Preserve only as common archive-analysis tooling or harness code. |
| `code/src/spec_method/entry.ts#parseTarget` | `abg_enhancement_candidate` | `cli/command.ts#parseStartTarget`, `cli/command.ts#resolveCliTarget`, `app/m04/asset_addressing/resolve.ts#resolvePublicAssetTarget` | ABG CLI already supports `next`, `graph_function`, and `asset`. SDLC `overlay` targeting is product meaning; ABG work is justified only if tests prove a generic public-target parity need. |
| `code/src/spec_method/entry.ts#outputWorkspaceRootFor` | `abg_enhancement_candidate` | `abg/m03/admission/carriers.ts#parseStartOutputWorkspaceBinding`, `abg/m03/contracts/output_allocation.ts#deriveOutputInstanceAllocation` | ABG already has typed output workspace binding and allocation law. Only ABG CLI exposure of that existing typed field is a possible test-proven parity enhancement. |
| `code/src/spec_method/entry.ts#jsonRecordFromFile` | `common_tooling_candidate` | `abg/m03/contracts/event_admission.ts#assertRuntimeEvent`, `abg/m03/contracts/projection.ts#deriveRuntimeAggregateProjection` | ABG owns admitted runtime facts, not this generic JSON file scraper. Delete for runtime; keep only if common archive tooling survives. |
| `code/src/spec_method/entry.ts#operatorRunArchiveRootsNewestFirst` | `common_tooling_candidate` | `rg operatorRunArchive/archive roots` over ABG sources | Runtime paths should use ABG event logs/projections. Archive enumeration is offline convenience tooling only if still required. |
| `code/src/spec_method/entry.ts#edgeFulfillmentCountsFromRecord` | `existing_abg_no_enhancement` | `abg/m03/contracts/payload_ledger.ts#derivePayloadLedgerProjection`, `abg/m03/contracts/assurance.ts#deriveAssuranceProjection` | ABG payload/assurance projections exist. SDLC requirement-fulfillment counts are product interpretation, not ABG enhancement work. |
| `code/src/spec_method/entry.ts#edgeFulfillmentLedgerFromArchive` | `existing_abg_no_enhancement` | `abg/m03/contracts/payload_ledger.ts#derivePayloadLedgerProjection`, `app/m04/result_assessment/assessment.ts#resultAssessment` | Replace archive ledger scraping with existing ABG payload/result facts plus product projection if it survives. |
| `code/src/spec_method/entry.ts#edgeClosureDispositionFromRecord` | `existing_abg_no_enhancement` | `abg/m03/contracts/assurance.ts#deriveAssuranceClosureDecision`, `abg/m03/contracts/continuation_transition.ts#deriveRuntimeContinuationTransitionProjection` | Closure/transition law exists in ABG. Delete local archive-record parsing. |
| `code/src/spec_method/entry.ts#edgeClosureDecisionFromArchive` | `existing_abg_no_enhancement` | `abg/m03/contracts/assurance.ts#deriveAssuranceClosureDecision`, `abg/m03/contracts/continuation_transition.ts#terminalTransitionForRuntimeContinuationProjection` | ABG can produce closure/terminal truth from admitted facts. Do not add an archive-file replacement. |
| `code/src/spec_method/entry.ts#nextActionProjectionFromArchive` | `existing_abg_no_enhancement` | `abg/m03/contracts/construction_intent.ts#selectAdmittedConstructionIntentByPriority`, `abg/m03/contracts/continuation_transition.ts#deriveRuntimeContinuationTransitionProjection` | ABG owns continuation and construction-intent selection. Delete the SDLC `next_action` archive shape from runtime. |
| `code/src/spec_method/entry.ts#isSelectedNextGraphFunctionArchiveDiagnostic` | `existing_abg_no_enhancement` | continuation transition, traversal non-progress, retry frontier projections | ABG provides typed evidence/projection rows. Delete this archive diagnostic from runtime. |
| `code/src/spec_method/entry.ts#completedGraphFunctionNameFromArchive` | `common_tooling_candidate` | ABG event/projection search for completed graph-function archive inference | Do not create ABG runtime law for this archive inference. Retain only as offline diagnostic convenience if a tooling caller remains. |
| `code/src/spec_method/entry.ts#selectedNextGraphFunctionFromOverlayCompletionArchive` | `existing_abg_no_enhancement` | `abg/m03/contracts/graph_span_reentry.ts`, `abg/m03/runner/runtime_authoring_routes.ts#applyGraphSpanReentryRoute` | ABG has graph-span/reentry mechanics. SDLC overlay completion archive parsing is product-specific/historical and not an ABG enhancement. |
| `code/src/spec_method/entry.ts#selectedNextGraphFunctionFromArchive` | `existing_abg_no_enhancement` | runtime aggregate projection, continuation transition, graph-span reentry, construction intent | ABG has the runtime decision substrate. Do not create an ABG archive-to-next-graph-function API. |
| `code/src/spec_method/entry.ts#assessmentStatusFromRecord` | `existing_abg_no_enhancement` | `app/m04/result_assessment/assessment.ts#resultAssessment`, `abg/m03/runner/attached_fp_worker.ts#deriveAttachedFpResultDecision` | ABG admits and assesses result artifacts. Replace the SDLC `worker_result_report.json` parser with admitted result facts. |
| `code/src/spec_method/entry.ts#requirementAssessmentsFromArchive` | `existing_abg_no_enhancement` | result assessment, payload ledger, assurance evidence rows | ABG owns result/payload facts. Product requirement projection may survive, but archive scraping does not justify ABG work. |
| `code/src/spec_method/entry.ts#archiveRefForRoot` | `common_tooling_candidate` | ABG archive/traced-process/qualification surfaces | Archive URI formatting belongs with common archive-inspection tooling if it survives. |
| `code/src/spec_method/entry.ts#missingTraversalConsequenceArtifactRefs` | `common_tooling_candidate` | `abg/m03/contracts/plugins.ts#constructConsequenceProjectionOutcome`, payload ledger, assurance | Runtime completeness comes from ABG consequence/result/payload contracts. This missing-artifact check is offline diagnostic tooling if retained. |
| `code/src/spec_method/entry.ts#startOutcomeFor` | `abg_enhancement_candidate` | `app/m04/max_autonomy/callable_start.ts#publicCallableStartAsync`, `app/m04/start.ts#startFromRequestAsync`, `abg/m03/runner/engine_runner.ts#runEngineStartAsync` | Runtime start exists. Any ABG work is limited to test-proven CLI/API parity for product target/default translation; otherwise delete/split the SDLC wrapper. |
| `code/src/spec_method/entry.ts#selectedActionRequiresFreshTargetTraversal` | `abg_exists` | `abg/m03/contracts/traversal_non_progress.ts#deriveTraversalContinuationActionProjection`, `abg/m03/runner/runtime_authoring_routes.ts#applyGraphSpanReentryRoute` | ABG owns continuation/reentry decisions. SDLC helper should be removed once callers use ABG transition projections. |
| `code/src/spec_method/entry.ts#basisIdValue` | `abg_exists` | `abg/m03/contracts/event_admission.ts#assertRuntimeEvent`, `abg/m03/contracts/runtime_support.ts#runtimeEventsForBasis` | Runtime event basis inspection exists in ABG. Do not keep SDLC event-shape helper. |
| `code/src/spec_method/entry.ts#hasReplayForBasis` | `abg_exists` | `abg/m03/contracts/runtime_support.ts#runtimeEventsForBasis`, `abg/m03/contracts/projection.ts#deriveRuntimeAggregateProjection` | ABG can scope replay by execution basis and derive projection from scoped events. |
| `code/src/spec_method/entry.ts#selectedArchiveMatchesRequestedStart` | `existing_abg_no_enhancement` | start intent admission, continuation transition, graph-span reentry | ABG owns requested start and continuation truth. Delete the SDLC archive-comparison wrapper. |
| `code/src/spec_method/entry.ts#startOutcomeForObservedReplay` | `existing_abg_no_enhancement` | `cli/command.ts#runStartCommand`, `runtimeEventsForBasis`, `deriveRuntimeAggregateProjection`, continuation transition | ABG start already consumes replay events. Delete the SDLC archive fallback and overlay-specific replay selector unless product input survives separately. |
| `code/src/spec_method/entry.ts#replayEventsForBasis` | `abg_exists` | `abg/m03/contracts/runtime_support.ts#runtimeEventsForBasis` | Direct ABG replacement exists. |
| `code/src/spec_method/entry.ts#startOutcomeRequiresFreshTargetTraversal` | `abg_exists` | traversal non-progress, continuation transition, graph-span reentry | ABG owns fresh traversal/reentry semantics. |
| `code/src/spec_method/entry.ts#installedStartPayloadFor` | `existing_abg_no_enhancement` | `cli/command.ts#runStartCommand`, `publicCallableStartAsync`, `runEngineStartAsync`, `app/m04/result_assessment`, `app/m04/live_status` | ABG owns command/control/runtime events and status. Split product proof/plugin pieces; do not create an ABG replacement for this SDLC orchestration wrapper. |
| `code/src/spec_method/entry.ts#SdlcAnalyzeRunCliEnvelope` | `common_tooling_candidate` | ABG archive/analyze search | No ABG analyze-run envelope is expected. Delete or move to common tooling/harness. |
| `code/src/spec_method/entry.ts#analyzeRunPayload` | `common_tooling_candidate` | ABG archive/analyze search | No public ABG analyzer/renderer/output writer equivalent was found; classify as common convenience tooling if retained. |
| `code/src/start/index.ts#publicStartOnce` | `existing_abg_no_enhancement` | `app/m04/public_start.ts#publicStartAsync`, `app/m04/max_autonomy/callable_start.ts#publicCallableStartAsync` | ABG runtime start exists. Shrink SDLC product start projection to product input or delete it; no ABG enhancement justified. |
| `code/src/start/index.ts#projectSdlcWorkerAttachment` | `existing_abg_no_enhancement` | `abg/m03/transport`, `abg/m03/runner/attached_fp_worker.ts`, `shared/abg_library/agent_transport.ts` | ABG has worker/transport substrate. The SDLC attached/unattached carrier is a product adapter or deletion candidate, not ABG work. |
| `code/src/operator/index.ts#readOddSdlcRuntimeEvents` | `existing_abg_no_enhancement` | `cli/command.ts#readReplayEvents`, `event_admission.ts#assertRuntimeEvent`, `runtime_support.ts#runtimeEventsForBasis` | ABG CLI reads the event log internally and exports event admission/scoping. Delete SDLC runtime event reader from command proof paths. |
| `code/src/operator/index.ts#readOddSdlcRuntimeEventsSync` | `existing_abg_no_enhancement` | same as async runtime event row | Same as async reader; command/proof paths use ABG CLI. No ABG enhancement justified. |
| `code/src/operator/index.ts#executeInstalledOperatorStart` | `existing_abg_no_enhancement` | `runEngineStartAsync`, `attached_fp_worker.ts#deriveAttachedFpResultDecision`, `process_actor.ts`, result assessment, live status | ABG owns start/worker/result runtime mechanics. Classify SDLC plugin session, installed topology proof, and product postflight outputs separately. |
| `code/src/analysis/index.ts#analyzeSdlcFdRunArchive` | `common_tooling_candidate` | ABG archive/analyze search | No ABG FD/run archive linter equivalent was found because this is a common convenience/tooling lane, not runtime substrate. |
| `code/src/analysis/index.ts#renderSdlcFdRunAnalysisMarkdown` | `common_tooling_candidate` | ABG archive/analyze search | No ABG Markdown renderer equivalent was found. Move with the common analyzer only if a surviving tooling lane requires it. |
| `code/src/projection/index.ts#evalSdlcGapFromReplay` | `abg_exists` | `app/m04/gaps/projection.ts#publicGaps`, `app/m04/gaps/projection.ts#projectPublicGapsFromRequest` | ABG already projects public gaps from runtime events. odd_sdlc can still interpret those projected facts into product-specific dossiers. |
| `code/src/operator/product_materialization/replay.ts#parseNonNegativeInteger` | `existing_abg_no_enhancement` | ABG replay/projection ownership; no specific parser target | This helper does not justify ABG work. Delete with SDLC replay code unless full inventory proves product projection survival. |

Immediate conclusion: most start/control/replay/result/gaps mechanics are
already in ABG or have ABG substrate. The archive-analysis/tooling lane
(`analyze-run`, archive root enumeration, Markdown rendering) is a separate
common convenience category, not a missing ABG runtime surface. The former
25-row `abg_partial` bucket is not justified as 25 ABG enhancements. Only four
rows remain possible ABG CLI/API parity candidates, and each requires
unit/regression proof before implementation. The rest are deletion,
caller-adaptation, product-support, or common-tooling work where odd_sdlc
product meaning (`overlay`, requirement fulfillment, ticket/gap dossier,
installed proof) must consume ABG facts instead of scraping local archives.

### Phase 0: Authority Conflict And Freeze Review

Purpose: identify the current law conflict before touching code. Product text
now says ABG owns command/control, but installed-product requirements and older
design/test surfaces still teach `odd-sdlc-ts` as the operator command.

Review checklist:

- [ ] `specification/PRODUCT.md`
      - confirm ABG owns command/control, result ingress, replay, continuation,
        and runtime truth.
      - list surviving odd_sdlc package duties: GTL program, plugins,
        product carriers, product projections, installer/package proof.
- [ ] `specification/requirements/08-odd-sdlc-first-slice.md`
      - mark any still-active `odd-sdlc-ts gaps/start` wording as superseded,
        still active, or requiring requirement reprice.
- [ ] `specification/requirements/14-odd-sdlc-installed-product-contract.md`
      - inspect REQ-F-ODDSDLC-047, 049, 051, and 052 for installed command
        obligations that conflict with ABG command/control ownership.
- [ ] `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SPEC_METHOD_ENTRYPOINT.md`
      - classify the document as retained library-entrypoint design,
        superseded CLI design, or partial migration source.
- [ ] `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md`
      - identify which operator UX carriers survive as product plugin/proof
        surfaces and which belong to ABG runtime ownership.
- [ ] `build_tenants/typescript/package.json`
      - record current public bin: `odd-sdlc-ts ->
        ./build/semantic/code/src/cli/main.js`.
- [ ] Record freeze rule in the ticket: no new CLI, traversal runtime, replay,
      archive-analysis, result-ingress, workspace-normalization, or generic
      execution behavior may be added to odd_sdlc product code during review.

Phase output:

- [ ] authority-conflict table: active law, superseded law, reprice required,
      target owner.
- [ ] pre-refactor source count: currently 180 files under
      `build_tenants/typescript/code/src`.
- [ ] first deletion must be blocked until the authority table is reviewed.

### Phase 1: Shell, Package, And Installed Command Binding Walkthrough

Purpose: isolate the public shell surface from the library surfaces it launches.

Code path:

```text
package.json bin
  -> code/src/cli/main.ts
    -> invokeOddSdlcSpecMethodCommand(argv)
    -> serializeOddSdlcSpecMethodResult(result)
```

Audit checklist:

- [ ] `build_tenants/typescript/package.json`
      - classify `bin.odd-sdlc-ts`.
      - list package exports that should survive as library APIs:
        `.`, `./spec-method`, `./install`, `./release`.
- [ ] `build_tenants/typescript/code/src/cli/main.ts`
      - confirm it remains a thin process launcher.
      - delete after caller migration; do not move, hide, or preserve as
        harness/non-public plumbing.
- [ ] `build_tenants/typescript/code/src/index.ts`
      - identify public exports that currently make spec-method/operator
        command helpers available to tests or consumers.
- [ ] `build_tenants/typescript/code/src/spec_method/index.ts`
      - classify as library API, temporary adapter, or removal candidate.
- [ ] `build_tenants/typescript/code/src/install/installer.ts`
      - inspect installed command binding creation.
- [ ] `build_tenants/typescript/code/src/install/instruction_files.ts`
      - inspect generated AGENTS/CLAUDE command guidance.
- [ ] `build_tenants/typescript/code/src/qualification/installed_initial_state.ts`
      - inspect installed command sanity proof for `odd-sdlc-ts`.
- [ ] `build_tenants/typescript/code/src/qualification/rc_qualification.ts`
      - inspect RC proof rows that cite `odd-sdlc-ts`.
- [ ] `build_tenants/typescript/code/src/release/carriers.ts`
      - inspect release proof carrier that names the command.
- [ ] `build_tenants/typescript/code/src/release/release_cut.ts`
      - inspect binary-binding evidence and failure behavior.

Caller/proof checklist:

- [ ] `build_tenants/typescript/test_env/tests/test_t058_spec_method_entrypoint.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t069_installed_initial_state.test.mjs`
- [ ] `build_tenants/typescript/test_env/test_surface_map.md`
- [ ] `docs/ODD_SDLC_V2_0_0_RELEASE_NOTE.md`
- [ ] `docs/ODD_SDLC_V2_0_0_RC_4_RELEASE_NOTE.md`

Phase output:

- [ ] installed command-binding inventory.
- [ ] list of tests/docs that must be migrated before removing the package bin.
- [ ] deletion plan for `cli/main.ts`, `invokeOddSdlcSpecMethodCommand*`,
      `commandPayload*`, and spec-method CLI serializers. There is no
      harness/non-public transitional retention option.

### Phase 2: Spec Method Command Registry And Option Admission Walkthrough

Purpose: review the real command grammar before classifying any command.

Primary file:

- [ ] `build_tenants/typescript/code/src/spec_method/entry.ts`

Subsections to audit in that file:

- [ ] `ODD_SDLC_SPEC_METHOD_COMMAND_VALUES`
      - commands currently present: `catalog`, `query-domain`, `tickets`,
        `reviewers`, `ticket-intake`, `ticket-admit`, `gaps`, `start`,
        `install`, `release-cut`, `release-snapshot`, `rc-report`,
        `analyze-run`.
- [ ] request carriers:
      `OddSdlcSpecMethodTraversalRequest`,
      `OddSdlcSpecMethodInstallRequest`,
      `OddSdlcSpecMethodReleaseCutRequest`,
      `OddSdlcSpecMethodReleaseSnapshotRequest`,
      `OddSdlcSpecMethodAnalyzeRunRequest`,
      `OddSdlcSpecMethodTicketIntakeRequest`,
      `OddSdlcSpecMethodResult`.
- [ ] option parsers:
      `parseOptions`, `parseInstallOptions`, `parseReleaseCutOptions`,
      `parseReleaseSnapshotOptions`, `parseAnalyzeRunOptions`,
      `parseTicketIntakeOptions`, `parseTarget`.
- [ ] option set:
      `--workspace`, `--output-workspace`, `--target`, `--graph-overlay`,
      `--until`, `--worker`, `--evaluator-priority-edge`,
      `--runtime-traversal-selection`,
      `--runtime-traversal-selections`,
      install/release/analyze/ticket options.
- [ ] sync/async command API split:
      `invokeOddSdlcSpecMethodCommandSync` versus
      `invokeOddSdlcSpecMethodCommand`.
- [ ] serialization layer:
      `serializeOddSdlcSpecMethodResult`,
      `compactGapsResult`,
      `compactInstalledStartResult`,
      `compactPublicStartResult`.

Command classification table to fill during review:

| Command | Current implementation path | Initial target class | Review notes |
| --- | --- | --- | --- |
| `catalog` | `constructSdlcGraphFunctionCatalog()` | `odd_sdlc library API` | Read-only GTL catalog projection candidate. |
| `query-domain` | `workspaceContext(...) -> queryDomainFor(...)` | `odd_sdlc library API` | Read model only if no start authority remains. |
| `tickets` | `queryDomain.ticketWorkflow` | `odd_sdlc library API` | Ticket workflow projection; check if ABG should present it. |
| `reviewers` | reviewer profile projection from ticket workflow | `odd_sdlc library API` | Read-only projection candidate. |
| `ticket-admit` | `admitSdlcTicketExecutionContract(...)` | `odd_sdlc library API` or `ABG CLI` | Admission carrier may survive; shell command should not. |
| `ticket-intake` | `createSdlcTerminalGapTicketsFromOperatorRun(...)` | `temporary_blocker` | If operator-facing, it must enter through ABG CLI. Product ticket projection may survive behind that surface; archive inspection is common tooling. |
| `gaps` | `gapsPayload(...)` | `ABG CLI` | `odd-sdlc-ts gaps` retires. ABG CLI owns operator presentation; odd_sdlc may provide read-only product projections behind that surface. |
| `start` | `installedStartPayloadFor(...)` | `ABG CLI` | Migration target; no SDLC CLI command law. |
| `install` | `installOddSdlcTypescript(...)` | `package/release API` | May survive as product installer API, not traversal command. |
| `release-cut` | `deriveOddSdlcTypescriptReleaseCut(...)` | `package/release API` | Review command binding proof dependency. |
| `release-snapshot` | `deriveOddSdlcTypescriptReleaseSnapshot(...)` | `package/release API` | Review command binding proof dependency. |
| `rc-report` | `describeOddSdlcTypescriptRcQualification()` | `product_projection` | Read-only proof projection. |
| `analyze-run` | `analyzeRunPayload(...)` | `common_tooling_candidate` or `test_or_live_harness` | Generic archive analysis is a common convenience/tooling lane, not ABG runtime ownership. |

Phase output:

- [ ] completed command classification table.
- [ ] option classification table.
- [ ] list of command helpers that must become product library support behind
      ABG CLI, direct ABG CLI calls, common tooling, or disappear.

### Phase 3: Read-Only Domain And Projection Command Walkthrough

Purpose: preserve product read models while removing command law.

Command paths to review:

```text
catalog
  -> graph/catalog.ts, graph/module.ts

query-domain / tickets / reviewers / ticket-admit
  -> workspace ingress
  -> graph module/catalog/overlays
  -> projection/query_domain.ts
  -> tickets/workflow.ts

gaps
  -> read runtime events
  -> public start projection
  -> projection gap dossier
  -> requirement fulfillment public view
  -> homeostatic triage read model
```

File checklist:

- [ ] `build_tenants/typescript/code/src/graph/catalog.ts`
- [ ] `build_tenants/typescript/code/src/graph/module.ts`
- [ ] `build_tenants/typescript/code/src/graph/overlays.ts`
- [ ] `build_tenants/typescript/code/src/graph/optimising_overlay.ts`
- [ ] `build_tenants/typescript/code/src/graph/target_carrier_contracts.ts`
- [ ] `build_tenants/typescript/code/src/gtl_conformance/program.ts`
- [ ] `build_tenants/typescript/code/src/projection/query_domain.ts`
- [ ] `build_tenants/typescript/code/src/projection/requirement_closure.ts`
- [ ] `build_tenants/typescript/code/src/tickets/workflow.ts`
- [ ] `build_tenants/typescript/code/src/tickets/index.ts`
- [ ] `build_tenants/typescript/code/src/triage/triage.ts`
- [ ] `build_tenants/typescript/code/src/triage/policy.ts`
- [ ] `build_tenants/typescript/code/src/domain/*.ts`
- [ ] `build_tenants/typescript/code/src/workspace/ingress.ts`
- [ ] `build_tenants/typescript/code/src/workspace/source_input.ts`
- [ ] `build_tenants/typescript/code/src/workspace/project_constraints.ts`
- [ ] `build_tenants/typescript/code/src/workspace/project_profile.ts`

Test/proof checklist:

- [ ] `build_tenants/typescript/test_env/tests/test_t030_graph_catalog_module.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t032_query_gap_projection.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t039_query_domain_structural_drift.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t139_public_gaps_read_only_evaluator_view.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t150_visible_defaults_catalog_lookup.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t162_ticket_workflow_projection.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t162_ticket_execution_contract_admission.test.mjs`
- [ ] `build_tenants/typescript/test_env/live/test_t162_ticket_workflow_live.test.mjs`

Phase output:

- [ ] list of read-only product APIs that survive without a CLI.
- [ ] list of projection helpers that currently reconstruct start/runtime
      authority and must be repriced.
- [ ] list of tests to migrate from command calls to library API calls.

### Phase 4: Start, Worker, Replay, And Runtime-Control Walkthrough

Purpose: identify every path where odd_sdlc still starts traversal, reads replay
truth, selects the next graph function, attaches a worker, emits runtime facts,
or projects consequence/closure behavior.

Command path:

```text
start
  -> assertCurrentSdlcGtlProgramConformance()
  -> installedStartPayloadFor(...)
    -> readOddSdlcRuntimeEvents(...)
    -> startOutcomeForObservedReplay(...)
      -> selectedNextGraphFunctionFromArchive(...)
      -> startOutcomeFor(...)
        -> publicStartOnce(...)
    -> executeInstalledOperatorStart(...)
```

File checklist:

- [ ] `build_tenants/typescript/code/src/spec_method/entry.ts`
      - audit `startOutcomeFor`, `selectedNextGraphFunctionFromArchive`,
        `startOutcomeForObservedReplay`, `replayEventsForBasis`,
        `startOutcomeRequiresFreshTargetTraversal`,
        `installedStartPayloadFor`, and `gapsPayload`.
- [ ] `build_tenants/typescript/code/src/start/public_start.ts`
      - classify public-start admission as product request data, ABG start
        input, or SDLC-local traversal authority.
- [ ] `build_tenants/typescript/code/src/start/policy.ts`
      - audit target resolution policy for local command semantics.
- [ ] `build_tenants/typescript/code/src/operator/event_store.ts`
      - decide whether event read/write belongs in ABG only.
- [ ] `build_tenants/typescript/code/src/operator/abg_runtime_binding.ts`
      - classify as ABG-owned API adapter, product binding, or move candidate.
- [ ] `build_tenants/typescript/code/src/operator/installed_operator.ts`
      - audit `executeInstalledOperatorStart(...)`, deterministic transition
        handling, worker dispatch, retry/reentry, archive writing,
        consequence projection, postflight, and closure summary.
- [ ] `build_tenants/typescript/code/src/operator/transport.ts`
      - classify worker process transport as ABG substrate behavior or product
        plugin transport declaration.
- [ ] `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
- [ ] `build_tenants/typescript/code/src/operator/traversal_strategy.ts`
- [ ] `build_tenants/typescript/code/src/operator/depth_traversal.ts`
- [ ] `build_tenants/typescript/code/src/operator/closure_state_machine.ts`
- [ ] `build_tenants/typescript/code/src/operator/runtime_policy.ts`
- [ ] `build_tenants/typescript/code/src/operator/postflight/gap_dossier.ts`
- [ ] `build_tenants/typescript/code/src/operator/product_materialization/*.ts`
- [ ] `build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts`
- [ ] `build_tenants/typescript/code/src/operator/plugins/transform/result_projection.ts`
- [ ] `build_tenants/typescript/code/src/operator/plugins/evaluate/*`
- [ ] `build_tenants/typescript/code/src/operator/plugins/consequence/*`
- [ ] `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts`
- [ ] `build_tenants/typescript/code/src/contracts/operator_run_artifact_catalog.ts`

Test/proof checklist:

- [ ] `build_tenants/typescript/test_env/tests/test_t033_public_start.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t058_spec_method_entrypoint.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t064_installed_operator_ux.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t076_deterministic_traversal_state_machine.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t096_managed_traversal_bootstrap.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t097_managed_traversal_carriers.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t101_retry_report_rejection_loop.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t120_retry_local_repair_prompt.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t145_replay_visible_closure_authority.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t151_runner_evaluator_sovereignty.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t158_consequence_admission_regression.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t180_abg_4_current_staged_compute_boundary.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t184_handoff_partition_boundary.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t197_product_gtl_gate.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t203_runtime_start_steel_thread.test.mjs`

Phase output:

- [ ] start-path authority map showing which decisions are ABG-owned,
      GTL-declared, plugin-owned, or currently SDLC-local.
- [ ] list of functions that must move to ABG before `start` command removal.
- [ ] list of product plugin/carrier files that survive the runtime migration.

### Phase 5: Install, Release, Analyze-Run, And Ticket-Support Walkthrough

Purpose: avoid deleting package behavior that is product-owned while removing
generic command/controller behavior from the same entrypoint.

Install/release files:

- [ ] `build_tenants/typescript/code/src/install/admission.ts`
- [ ] `build_tenants/typescript/code/src/install/carriers.ts`
- [ ] `build_tenants/typescript/code/src/install/installer.ts`
- [ ] `build_tenants/typescript/code/src/install/instruction_files.ts`
- [ ] `build_tenants/typescript/code/src/package_binding/*.ts`
- [ ] `build_tenants/typescript/code/src/release/carriers.ts`
- [ ] `build_tenants/typescript/code/src/release/release_cut.ts`
- [ ] `build_tenants/typescript/code/src/release/release_snapshot.ts`

Analyze-run/archive-analysis files:

- [ ] `build_tenants/typescript/code/src/analysis/analyze.ts`
- [ ] `build_tenants/typescript/code/src/analysis/archive_reader.ts`
- [ ] `build_tenants/typescript/code/src/analysis/bloat_slope.ts`
- [ ] `build_tenants/typescript/code/src/analysis/carrier_loaders.ts`
- [ ] `build_tenants/typescript/code/src/analysis/diagnostics.ts`
- [ ] `build_tenants/typescript/code/src/analysis/edge_attempts.ts`
- [ ] `build_tenants/typescript/code/src/analysis/liveness.ts`
- [ ] `build_tenants/typescript/code/src/analysis/profiles.ts`
- [ ] `build_tenants/typescript/code/src/analysis/render_markdown.ts`
- [ ] `build_tenants/typescript/code/src/analysis/requirement_lineage.ts`
- [ ] `build_tenants/typescript/code/src/analysis/retry_forensics.ts`
- [ ] `build_tenants/typescript/code/src/analysis/runtime_gaps.ts`
- [ ] `build_tenants/typescript/code/src/analysis/summary_drift.ts`
- [ ] `build_tenants/typescript/code/src/analysis/types.ts`

Ticket/intake files:

- [ ] `build_tenants/typescript/code/src/tickets/workflow.ts`
- [ ] `build_tenants/typescript/code/src/tickets/index.ts`
- [ ] `build_tenants/typescript/code/src/operator/plugins/consequence/edge_projection.ts`
      - inspect terminal-gap ticket projection inputs.

Test/proof checklist:

- [ ] `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t161_fd_run_analysis_linter.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t172_run_analysis_edge_accounting.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t162_terminal_gap_ticket_intake.test.mjs`
- [ ] `build_tenants/typescript/test_env/live/test_t162_ticket_workflow_live.test.mjs`

Phase output:

- [ ] install/release API survival table.
- [ ] analyze-run table: `move_to_abg`, `test_or_live_harness`, or
      product-specific proof surface.
- [ ] ticket-intake table: product ticket API, ABG archive-analysis API, or
      temporary blocker.

### Phase 6: Direct Caller, Fixture, Script, And Documentation Migration Review

Purpose: identify every caller that must stop depending on the SDLC CLI before
the bin is removed.

Direct library caller checklist:

- [ ] `build_tenants/typescript/test_env/sandbox/scenario_sandbox.mjs`
- [ ] `build_tenants/typescript/test_env/sandbox/test_t087_t091_t096_internal_data_mapper_induction_sandbox.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t058_spec_method_entrypoint.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t064_installed_operator_ux.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t086_blocking_reason_carriers.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t087_project_induction.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t096_managed_traversal_bootstrap.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t097_managed_traversal_carriers.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t101_retry_report_rejection_loop.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t110_typed_callout_projection.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t139_public_gaps_read_only_evaluator_view.test.mjs`
- [ ] `build_tenants/typescript/test_env/tests/test_t150_visible_defaults_catalog_lookup.test.mjs`

Built CLI / installed binary caller checklist:

- [ ] `build_tenants/typescript/test_env/live/test_t109_live_installed_data_mapper_pty.test.mjs`
- [ ] `build_tenants/typescript/test_env/live/test_t110_live_agent_pty_installed_operator.test.mjs`
- [ ] `build_tenants/typescript/test_env/live/test_t115_live_installed_data_mapper_repair_flow.test.mjs`
- [ ] `build_tenants/typescript/test_env/live/test_t131_guided_odd_chat_live_build.test.mjs`
- [ ] `build_tenants/typescript/test_env/live/test_t162_ticket_workflow_live.test.mjs`
- [ ] `build_tenants/typescript/test_env/live/run_full_external_data_mapper_sandbox.mjs`
- [ ] `build_tenants/typescript/test_env/live/run_t199_data_mapper_code_depth_resume.mjs`
- [ ] `build_tenants/typescript/test_env/live/resume_t164_data_mapper_full_capability_live.mjs`
- [ ] `build_tenants/typescript/test_env/sandbox/abg_installed_workspace.mjs`

Fixture/doc caller checklist:

- [ ] `build_tenants/typescript/test_env/fixtures/data_mapper_reference/data_mapper.template/README.md`
- [ ] `build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat/bootstrap.md`
- [ ] `build_tenants/typescript/test_env/fixtures/t133_rust_hello_world_minimal/bootstrap.md`
- [ ] `build_tenants/typescript/test_env/test_surface_map.md`
- [ ] `docs/ODD_SDLC_V2_0_0_RELEASE_NOTE.md`
- [ ] `docs/ODD_SDLC_V2_0_0_RC_4_RELEASE_NOTE.md`
- [ ] `docs/old/ODD_SDLC_DOMAIN_MODEL.md`

Phase output:

- [ ] caller migration table with columns:
      file, current call, command class, ABG CLI target or product support API,
      migration phase, blocker.
- [ ] separate list of historical docs that should remain historical and not be
      edited as active operator guidance.

### Phase 7: Full Source Inventory And Survival Review

Purpose: classify every TypeScript source file before deleting or moving code.

Inventory rule:

- [ ] Generate and commit/review a source inventory that starts from all 180
      files under `build_tenants/typescript/code/src`.
- [ ] Every row must include:
      file path, classification, current CLI/runtime relationship, survival
      proof or deletion/move plan, target owner, proof lane.

Directory buckets to review:

- [ ] `admission/`
- [ ] `analysis/`
- [ ] `assurance/`
- [ ] `authority/`
- [ ] `cli/`
- [ ] `contracts/`
- [ ] `domain/`
- [ ] `effects/`
- [ ] `graph/`
- [ ] `gtl_conformance/`
- [ ] `hooks/`
- [ ] `install/`
- [ ] `operational/`
- [ ] `operator/`
- [ ] `package_binding/`
- [ ] `postflight/`
- [ ] `projection/`
- [ ] `qualification/`
- [ ] `release/`
- [ ] `runtime/`
- [ ] `shared/`
- [ ] `spec_method/`
- [ ] `start/`
- [ ] `tickets/`
- [ ] `triage/`
- [ ] `workspace/`
- [ ] root `index.ts`

Positive survival tests:

- [ ] GTL program declaration or catalog publication.
- [ ] product plugin implementation.
- [ ] typed product carrier required as plugin I/O or GTL-public product
      meaning.
- [ ] product projection/proof surface that cannot belong in ABG.
- [ ] package/release/test harness plumbing with no traversal authority.

Deletion/move tests:

- [ ] owns traversal selection, continuation, retry/reentry, replay, closure
      fold, worker execution, runtime events, result ingress, or archive
      diagnosis generically.
- [ ] exists only to support `odd-sdlc-ts` command compatibility.
- [ ] reconstructs ABG/GTL truth from local files or command output.
- [ ] duplicates ABG public command/control behavior.

Phase output:

- [ ] full source inventory.
- [ ] first deletion batch proposal.
- [ ] explicit temporary blocker list with owner and removal condition.

### Phase 8: Pre-Refactor Gate And First Cut Authorization

The refactor may start only after the review artifacts above exist.

Gate checklist:

- [ ] authority-conflict table reviewed.
- [ ] command classification table reviewed.
- [ ] option classification table reviewed.
- [ ] caller migration table reviewed.
- [ ] source inventory reviewed.
- [ ] temporary blockers accepted or moved to prerequisite tickets.
- [ ] first deletion batch names exact files and proof lanes.
- [ ] product-gate tests are specified before implementation:
      - reject public `odd-sdlc-ts` orchestration bin.
      - reject `code/src/cli/` imports into traversal/runtime internals.
      - reject command-shaped product-local traversal/replay/archive/runtime
        controllers outside the allowlist.
      - reject tests that prove `start` or `gaps` by private SDLC command
        helpers.

Initial expected proof lanes after implementation begins:

- [ ] focused source-classification/product-gate tests.
- [ ] affected command/caller migration tests.
- [ ] affected scenario/sandbox tests.
- [ ] `npm run test:semantic`.
- [ ] Rust hello live proof through ABG CLI start/traversal invocation, or a
      recorded non-closure with ABG-side/product-side blocker evidence.

## Tonight Cut Line

The intended first-night closure is full deletion planning for the SDLC CLI
surface and an inside-out breaking cut, not compatibility preservation. The
minimum useful tonight cut is:

1. Freeze odd_sdlc product code against new traversal/runtime/controller
   behavior.
2. Inventory every `code/src` file and classify it under the survival test.
3. Inventory and classify commands.
4. Add the drift guards.
5. Name every direct command caller that blocks deletion of `cli/main.ts`,
   `invokeOddSdlcSpecMethodCommand*`, `commandPayload*`, or CLI serializers.
6. Migrate the Rust hello live launcher path away from SDLC CLI semantics.
7. Record any missing behavior found by tests as reconstruction work in the
   correct owner, not as a reason to restore SDLC CLI compatibility.

If any command caller cannot be migrated tonight, it must be explicitly listed
as a temporary blocker with owner, ABG CLI target, and removal condition. The
SDLC CLI still has no accepted compatibility shim, private helper path, or
non-public retention lane.

If any non-command source file cannot be deleted or moved tonight, it must also
be explicitly listed with a survival classification and a removal/migration
condition. Unclassified source is non-closure.
