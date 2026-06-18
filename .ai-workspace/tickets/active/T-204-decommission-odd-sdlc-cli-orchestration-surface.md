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
  surface. Everything else is deleted, moved to ABG, or reduced to test-harness
  plumbing.
change_class: product_reprice
re_entry_point: product
priority: critical
triaged_at: 2026-06-17
created_at: 2026-06-17
updated_at: 2026-06-18
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
  positive survival test. ABIogenesis T-159 supplies the substrate reason:
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
  deleted or moved to ABG, odd_sdlc no longer publishes a public orchestration
  CLI, product/design text names ABG as the command/control/runtime owner, and
  product gates prove no remaining SDLC code owns traversal authority outside
  GTL declarations and plugins.
evaluation_criteria:
  - a source inventory classifies every current `build_tenants/typescript/code/src` file as `gtl_program`, `plugin`, `product_carrier`, `product_projection`, `test_or_release_plumbing`, `move_to_abg`, or `delete`
  - any file classified outside `gtl_program` or `plugin` carries a written survival proof explaining why it cannot be represented as GTL declaration, plugin I/O, generated artifact, ABG substrate code, or test harness
  - the inventory starts from the current 180-file TypeScript source tree and tracks file-count reduction across the refactoring wave
  - product text distinguishes odd_sdlc package APIs from ABG CLI command/control
  - `build_tenants/typescript/package.json` no longer publishes `odd-sdlc-ts` as a public orchestration bin
  - `code/src/cli/main.ts` is deleted, moved under test harness ownership, or reduced to non-public package plumbing that cannot import `start/public_start.ts`, `operator/installed_operator.ts`, or command-semantic spec-method internals
  - `spec_method/entry.ts` stops being a CLI command implementation surface; any surviving exports are library request/admission functions only
  - `start`, `continue`, `replay`, runtime worker attachment, and consequence projection are invoked through ABG CLI or ABG-owned runner APIs in tests and scenarios
  - `gaps` and query-domain remain odd_sdlc read-model library functions, not CLI command law
  - tests reject new command semantics under `code/src/cli/` and reject imports from CLI into traversal/runtime internals
  - tests reject new product-local traversal runtime, replay, result-ingress, archive-analysis, or workspace-normalization controllers outside ABG-owned APIs
  - T-203 Rust hello live path uses ABG-owned start/traversal invocation rather than an SDLC CLI launcher
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
  - `spec_method/entry.ts` becomes the new CLI controller after `cli/main.ts` is reduced
  - tests pass only because they call private odd_sdlc command helpers instead of ABG-owned traversal entry
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

## Stage Plan

### Stage 0: Freeze And Global Source Audit

- [ ] Add ticket/design note that no new command, traversal runtime, replay,
      result-ingress, archive-analysis, workspace-normalization, or generic
      execution behavior may be added to odd_sdlc product code.
- [ ] Inventory every current `build_tenants/typescript/code/src` file.
- [ ] Classify each source file:
      `gtl_program`, `plugin`, `product_carrier`, `product_projection`,
      `test_or_release_plumbing`, `move_to_abg`, or `delete`.
- [ ] For every file not classified `gtl_program` or `plugin`, write a survival
      reason or a deletion/move plan.
- [ ] Record current file count and target reduction estimate before code
      changes. Initial count observed during triage: 180 files under
      `build_tenants/typescript/code/src`.
- [ ] Add a focused product-gate test that fails if CLI code imports traversal,
      public-start, installed-operator, replay, or consequence internals.
- [ ] Add a product-gate test that fails if new product-local runtime/replay/
      archive-analysis/workspace-normalization controllers appear outside the
      source classification allowlist.
- [ ] Mark `odd-sdlc-ts` as deprecated in product/design text pending removal.

### Stage 1: Command Inventory

- [ ] Inventory current `odd-sdlc-ts` commands/options from `spec_method/entry.ts`
      and tests.
- [ ] Classify each command:
      `ABG CLI`, `odd_sdlc library API`, `temporary blocker`, or `remove`.
- [ ] Record replacement invocation for each ABG-owned command.

Expected classification direction:

| Current surface | Target owner | Notes |
| --- | --- | --- |
| `start` | ABG CLI | SDLC contributes graph/overlay/plugin package and product start request data only. |
| `continue` / replay behavior | ABG CLI | No SDLC-owned replay loop or cursor movement. |
| worker attachment | ABG CLI | SDLC plugin/handoff contracts remain product package truth. |
| consequence projection | ABG CLI / ABG runner | SDLC consequence policy remains plugin/product meaning. |
| `gaps` | odd_sdlc library read model, ABG CLI presentation | No independent command law. |
| `query-domain` | odd_sdlc library API | Consumable by ABG or clients, not runtime control. |
| install/release helpers | package/release APIs | Keep as library/release surfaces, not traversal CLI. |
| sandbox helpers | test harness only or remove | No product command truth. |

### Stage 2: Remove Command Surface

- [ ] Remove `odd-sdlc-ts` from the public package bin.
- [ ] Delete `cli/main.ts` or move any non-command package plumbing under a
      non-public library/test-harness owner.
- [ ] Prove no remaining command-shaped SDLC code imports traversal/runtime
      internals.
- [ ] Preserve library APIs for graph catalogs, overlays, plugins, query-domain
      projections, installers, release helpers, and proof surfaces.

### Stage 3: Caller Migration

- [ ] Update deterministic tests that currently exercise `odd-sdlc-ts` command
      semantics to call product library APIs or ABG-owned command APIs.
- [ ] Update sandbox/live launchers so they launch ABG traversal with the
      odd_sdlc product package loaded, not the SDLC CLI.
- [ ] Update installed bootstrap guidance to point at ABG CLI.
- [ ] Ensure T-203 Rust hello live proof no longer depends on an SDLC CLI
      launcher.

### Stage 4: Delete Residual Command Tests

- [ ] Delete command-semantic tests that only prove the old CLI surface.
- [ ] Keep product API tests for graph catalogs, overlays, plugins, start
      request data, query-domain projections, and installers.

### Stage 5: Closure Proof

- [ ] Run focused product-gate tests.
- [ ] Publish the final source inventory delta: starting file count, surviving
      files by classification, moved-to-ABG files, deleted files, and remaining
      blockers.
- [ ] Run affected scenario/sandbox tests.
- [ ] Run `npm run test:semantic`.
- [ ] Run the Rust hello live proof or record the remaining blocker as ABG-side
      / product-side with archive evidence.

## Tonight Cut Line

The intended first-night closure is not necessarily full deletion of every
historical command path. The minimum useful tonight cut is:

1. Freeze odd_sdlc product code against new traversal/runtime/controller
   behavior.
2. Inventory every `code/src` file and classify it under the survival test.
3. Inventory and classify commands.
4. Add the drift guards.
5. Remove `odd-sdlc-ts` from the public bin once direct command callers are
   migrated.
6. Migrate the Rust hello live launcher path away from SDLC CLI semantics.

If any command cannot be migrated tonight, it must be explicitly listed as a
temporary blocker with owner, replacement path, and removal condition. It is
not accepted as a compatibility shim.

If any non-command source file cannot be deleted or moved tonight, it must also
be explicitly listed with a survival classification and a removal/migration
condition. Unclassified source is non-closure.
