---
id: T-204
title: Decommission odd_sdlc orchestration code and shrink to GTL program plus plugins
type: chore
ticket_category: implementation_migration
status: completed
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
updated_at: 2026-06-24
completed_at: 2026-06-24
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

The 2026-06-19 audit tables below are historical review evidence, not current
execution authority. Every file and function must be re-read against the
post-RC2, post-T-205 source tree before deletion, migration, or survival is
claimed. The current execution plan is:

1. Freeze and re-baseline the current tree: file count, line count, exports,
   imports, package bins, test callers, and command/helper call surfaces.
2. Reevaluate every exported function and every command-reachable internal
   function from current code, not from the old audit.
3. Build a call-surface map for `odd-sdlc-ts`, `code/src/cli/main.ts`,
   `invokeOddSdlcSpecMethodCommand*`, `commandPayload*`,
   `serializeOddSdlcSpecMethodResult`, `installedStartPayloadFor`, and
   `startOutcomeForObservedReplay`.
4. Add drift guards before broad deletion: reject public SDLC orchestration
   bins, `code/src/cli/` command surfaces, command dispatch exports, and tests
   that prove traversal/runtime behavior through private SDLC command helpers.
5. First cut: remove the public CLI bin and `code/src/cli/main.ts` only after
   direct callers have an accepted target.
6. Second cut: split `spec_method/entry.ts` into explicit product library,
   package/release API, and delete/move candidates; delete command grammar,
   argv parsing, CLI result envelopes, compact serializers, and dispatch.
7. Third cut: reevaluate `start/*`, `operator/installed_operator.ts`,
   archive analysis, replay helpers, and runtime event readers function by
   function. Keep only product plugin implementation and irreducible product
   carriers/projections.
8. Fourth cut: delete or isolate analysis/common tooling. It must not remain
   runtime authority.
9. At every checkpoint track total source files/lines, unclassified
   files/lines, `remove_public_cli` lines, `move_to_abg` lines,
   `temporary_blocker` count, command-helper imports in tests, and package bin
   count.
10. Close only when every source file/function is classified, command surfaces
    are gone, tests use ABG or product library APIs appropriately, and every
    remaining odd_sdlc source file has positive survival proof.

Each reviewed file receives one of these classifications:
`gtl_program`, `plugin`, `product_carrier`, `product_projection`,
`package_or_release_plumbing`, `test_or_live_harness`, `move_to_abg`,
`delete`, or `temporary_blocker`.

Each reviewed command receives one of these classifications:
`ABG CLI`, `odd_sdlc library API`, `package/release API`,
`test_or_live_harness`, `temporary_blocker`, or `remove`.

## Audit Tables

### 2026-06-19 Fresh Execution Baseline

Scope: generated from the current post-RC2, post-T-205 source tree before any
T-204 deletion or migration cut. Archived live-run output under
`test_env/test_runs` is excluded from caller counts. This baseline supersedes
the older "about 180 files" estimate for execution tracking, but it does not
classify files by itself.

| Metric | Current |
| --- | ---: |
| Active T-204 worktree source files under `code/src` | 180 |
| Active T-204 worktree source lines under `code/src` | 98,222 |
| Source files explicitly touched by the old audit tables | 38 |
| Lines in files explicitly touched by the old audit tables | 30,164 |
| Source files still requiring fresh survival classification | 142 |
| Lines still requiring fresh survival classification | 68,058 |
| Export declarations under `code/src` | 1,596 |
| Import statements under `code/src` | 653 |
| Published package bins | 1 |
| Published SDLC orchestration bin | `odd-sdlc-ts -> ./build/semantic/code/src/cli/main.js` |
| Current `code/src/cli` files | 1 |

Current line buckets:

| Area | Lines | Files |
| --- | ---: | ---: |
| `operator` | 55,014 | 53 |
| `graph` | 7,718 | 10 |
| `analysis` | 5,462 | 15 |
| `workspace` | 3,403 | 9 |
| `assurance` | 3,170 | 13 |
| `spec_method` | 3,110 | 2 |
| `projection` | 2,511 | 3 |
| `tickets` | 2,191 | 2 |
| `start` | 1,857 | 3 |
| `qualification` | 1,742 | 6 |
| `contracts` | 1,715 | 5 |
| `gtl_conformance` | 1,589 | 2 |
| `shared` | 1,547 | 8 |

Execution watchlists:

| Watchlist | Lines | Files | Tracking rule |
| --- | ---: | ---: | --- |
| Hard command surface: `cli/main.ts` plus `spec_method/*` | 3,126 | 3 | Must go to zero or be split into non-command library/package APIs. |
| Orchestration-heavy surface: CLI, spec_method, start, analysis, projection, workspace, runtime, `operator/installed_operator.ts`, `operator/index.ts`, and `operator/product_materialization/replay.ts` | 29,177 | 38 | Every line must be reclassified before deletion/move/survival. |
| Operator plugin subtree | 19,949 | 14 | Likely survivor zone, but plugin-vs-runtime authority must still be checked function by function. |

Largest current files to prioritize for function-level review:

| File | Lines | Initial reason to review |
| --- | ---: | --- |
| `operator/installed_operator.ts` | 10,937 | Largest runtime/dispatch concentration; likely split between plugin session, product proof, and ABG-owned orchestration. |
| `operator/plugins/transform/launch_contract.ts` | 6,126 | Plugin handoff surface mixed with launch/materialization authority. |
| `operator/plugins/evaluate/postflight_checks.ts` | 3,782 | Evaluator/postflight law; likely plugin survivor but must not own generic runtime closure. |
| `spec_method/entry.ts` | 3,109 | Command grammar, command dispatch, archive replay, gaps, start, install, release, and serializers mixed in one file. |
| `operator/plugins/transform/result_projection.ts` | 2,541 | Plugin result projection; check ABG result-ingress boundary. |
| `operator/product_materialization/authority.ts` | 2,470 | Product authority survivor candidate; check launch/runtime ownership. |
| `tickets/workflow.ts` | 2,190 | Product ticket projection/admission candidate; check command/archive coupling. |
| `operator/carriers.ts` | 2,183 | Product/plugin carrier survivor candidate; check generic runtime carrier drift. |
| `operator/traversal_consequence.ts` | 2,138 | Product interpretation over ABG consequence; check no local bind authority. |
| `projection/query_domain.ts` | 1,833 | Product read-model survivor candidate; keep command-free. |

### 2026-06-19 Fresh Command Caller Baseline

Caller counts below exclude archived `test_env/test_runs` output and count
current source, tests, sandbox/live scripts, fixtures, and specification text.

| Surface | Files | Matches | Current interpretation |
| --- | ---: | ---: | --- |
| `invokeOddSdlcSpecMethodCommand` | 22 | 99 | Broad async command-helper dependency across tests, sandbox, and live harness. |
| `invokeOddSdlcSpecMethodCommandSync` | 8 | 47 | Sync command-helper dependency concentrated in spec-method, gaps, replay, and archive tests. |
| `serializeOddSdlcSpecMethodResult` | 6 | 14 | CLI serializer still has test callers. |
| `odd-sdlc-ts` | 30 | 111 | Public command still appears in package/install/release/qualification/tests/live/fixtures/specs. |
| `build/semantic/code/src/cli/main.js` | 9 | 10 | Built source CLI path still appears in live and command tests. |
| `installedStartPayloadFor` | 2 | 3 | Runtime start payload remains in `spec_method/entry.ts`; product-gate test references it. |
| `startOutcomeForObservedReplay` | 3 | 5 | Replay-aware start selector remains in `spec_method/entry.ts`; tests pin it as drift evidence. |
| `commandPayload` | 1 | 5 | Internal command dispatcher remains confined to `spec_method/entry.ts`. |

Pre-cut first blocker set:

- `build_tenants/typescript/package.json` still publishes
  `bin.odd-sdlc-ts`.
- `build_tenants/typescript/code/src/cli/main.ts` still exists.
- `build_tenants/typescript/code/src/spec_method/entry.ts` still owns
  command dispatch, command serialization, replay-aware start selection, and
  installed start payload construction.
- Direct command-helper tests/harnesses still include
  `test_t058_spec_method_entrypoint`, `test_t059_install_release_adapter`,
  `test_t064_installed_operator_ux`, `test_t069_installed_initial_state`,
  `test_t086_blocking_reason_carriers`, `test_t087_project_induction`,
  `test_t093_scheduling_phase`, `test_t096_managed_traversal_bootstrap`,
  `test_t097_managed_traversal_carriers`,
  `test_t098_requirements_to_design_assurance`,
  `test_t101_retry_report_rejection_loop`,
  `test_t110_typed_callout_projection`,
  `test_t139_public_gaps_read_only_evaluator_view`,
  `test_t145_replay_visible_closure_authority`,
  `test_t150_visible_defaults_catalog_lookup`,
  `test_t158_consequence_admission_regression`,
  `test_t161_fd_run_analysis_linter`,
  `test_env/sandbox/scenario_sandbox.mjs`,
  `test_env/sandbox/test_t087_t091_t096_internal_data_mapper_induction_sandbox.test.mjs`,
  and `test_env/live/test_t110_live_agent_pty_installed_operator.test.mjs`.
- Install/release/qualification surfaces still assert or produce
  `odd-sdlc-ts`: `install/installer.ts`,
  `qualification/installed_initial_state.ts`,
  `qualification/rc_qualification.ts`, `release/carriers.ts`, and
  `release/release_cut.ts`.
- Specification still contains active `odd-sdlc-ts` command wording in
  `specification/requirements/08-odd-sdlc-first-slice.md` and
  `specification/requirements/14-odd-sdlc-installed-product-contract.md`.

Immediate next execution checkpoint:

- Add product-gate tests that reject `bin.odd-sdlc-ts`, `code/src/cli`, and
  exported command helpers. These should be introduced as failing/expected-red
  drift guards only when the first deletion cut starts, not during this
  baseline pass.
- Re-read `spec_method/entry.ts` function by function and split rows into:
  delete-now command plumbing, product read-model library API, package/release
  API, ABG CLI migration blocker, and common tooling candidate.
- For each direct command-helper caller, choose one migration target before
  deleting `cli/main.ts`: ABG CLI, product library API, package/release API,
  or deleted historical test.

### 2026-06-19 First Public CLI Cut Result

Cut scope: remove the public `odd-sdlc-ts` process entrypoint and reprice the
package/install/release/qualification contract away from an `odd_sdlc` command
binding. This cut intentionally does not delete `spec_method/entry.ts` command
helpers; they remain tracked blockers for the next T-204 cut.

| Metric | Baseline | After cut |
| --- | ---: | ---: |
| Active TS source files under `code/src` | 180 | 179 |
| Active TS source lines under `code/src` | 98,222 | 98,185 |
| Published package bins | 1 | 0 |
| `code/src/cli` files | 1 | 0 |
| `code/src/cli` directory present | yes | no |
| Hard command surface lines/files | 3,126 / 3 | 3,110 / 2 |

Changed contract:

- `package.json` and `package-lock.json` no longer publish `odd-sdlc-ts`.
- `code/src/cli/main.ts` is deleted; the source `cli/` directory is absent.
- install uses no `odd_sdlc` command binding and records ABG command paths only.
- generated `AGENTS.md`/`CLAUDE.md` guidance maps `gaps` and `start` to
  installed `genesis-ts` with `--scope workspace`.
- release-cut proof now fails closed if the package publishes any public
  command binding and records the retired command as release evidence.
- installed initial-state qualification requires `genesis-ts` and
  `abiogenesis-ts`, not `odd-sdlc-ts`.
- active requirements/design text no longer teaches `odd-sdlc-ts` as operator
  command law.

Remaining caller counts after this cut, excluding archived `test_env/test_runs`
and generated `build/semantic` output:

| Surface | Files | Matches | Interpretation |
| --- | ---: | ---: | --- |
| `invokeOddSdlcSpecMethodCommand` | 15 | 50 | Async private command-helper blocker remains across tests/live harnesses. |
| `invokeOddSdlcSpecMethodCommandSync` | 8 | 47 | Sync private command-helper blocker remains in replay/gaps/analyzer tests. |
| `serializeOddSdlcSpecMethodResult` | 5 | 12 | Serializer remains only for private helper/analyzer tests. |
| `odd-sdlc-ts` | 22 | 98 | Remaining hits are retired-command proof, negative assertions, temp prefixes, historical design/tests, and live harness blockers. |
| `build/semantic/code/src/cli/main.js` / `CLI_MAIN` | 6 | 10 | Remaining direct source-CLI callers are live harness blockers, not accepted package surfaces. |
| `installedStartPayloadFor` | 2 | 3 | Still in `spec_method/entry.ts`; next cut must classify library API versus delete. |
| `startOutcomeForObservedReplay` | 3 | 5 | Still in `spec_method/entry.ts`; next cut must move/delete replay helper authority. |
| `commandPayload` | 1 | 3 | Still confined to `spec_method/entry.ts`; delete with command dispatcher. |

Focused proof completed:

- `npm run build:semantic` passed.
- `node --test test_env/tests/test_t059_install_release_adapter.test.mjs`
  passed, including new T-204 gate rejecting package bin and `code/src/cli`.
- `node --test test_env/tests/test_t069_installed_initial_state.test.mjs`
  passed.
- `node --test` over `test_t058_spec_method_entrypoint.test.mjs`,
  `test_t118_worker_invocation_package.test.mjs`, and
  `test_t161_fd_run_analysis_linter.test.mjs` passed.
- Focused ESLint over edited harness files passed.

Rejected proof boundary:

- The broad `node --test` run over
  `test_t064_installed_operator_ux.test.mjs`,
  `test_t066_product_materialization_contract.test.mjs`, and
  `test_t076_deterministic_traversal_state_machine.test.mjs` failed in
  `test_t066_product_materialization_contract.test.mjs` on the
  existing product-materialization launch-blocker class
  `sdlc_product_materialization_launch_blocked:*`. That failure is not caused
  by the CLI cut and remains outside this first-cut proof lane.

Next blocker set:

- migrate or delete live harnesses that still reference
  `build/semantic/code/src/cli/main.js` or installed `odd-sdlc-ts`
- split `spec_method/entry.ts` into product read-model/package APIs versus
  deleted command grammar
- remove `invokeOddSdlcSpecMethodCommand*`, `commandPayload*`, and
  `serializeOddSdlcSpecMethodResult` after callers move to ABG CLI or typed
  product/package APIs

### 2026-06-19 Second Live Harness CLI Cut Result

Cut scope: remove active live-harness and fixture dependence on the deleted
semantic CLI path and installed `odd-sdlc-ts` command. This cut keeps
`spec_method/entry.ts` private package helpers as explicit remaining blockers;
it does not accept them as command law.

Changed contract:

- T-109, T-115, and T-131 live traversal harnesses install through
  `installOddSdlcTypescript(...)` and drive traversal through installed
  `genesis-ts`.
- T-131 guided odd_chat bootstrap fixture now teaches installed ABG
  `genesis-ts gaps/start --scope workspace`, not `odd-sdlc-ts`.
- T-162 ticket workflow live proof uses the package API and expects the package
  `sdlc_installed_operator_start_outcome`, not the retired CLI projection
  wrapper.
- `run_full_external_data_mapper_sandbox.mjs` and
  `run_t199_data_mapper_code_depth_resume.mjs` no longer invoke
  `build/semantic/code/src/cli/main.js` for install and no longer require an
  installed `odd-sdlc-ts` command path.
- active data_mapper and Rust hello-world fixture guidance now uses the package
  installer API plus installed ABG `genesis-ts` for `gaps/start`.
- the retired T-164 resume helper no longer names the retired command as the
  path to use.

Current tracked-file metrics after this cut, excluding archived
`test_env/test_runs` and generated `build/semantic` output:

| Surface | Files | Matches | Interpretation |
| --- | ---: | ---: | --- |
| Active TS source files under `code/src` | 179 | n/a | Unchanged from first cut; this cut only touched harness/fixture surfaces. |
| Active TS source lines under `code/src` | 98,185 | n/a | Unchanged from first cut. |
| `build/semantic/code/src/cli/main.js` / `CLI_MAIN` in active source/test/spec surfaces | 0 | 0 | No active caller remains; one historical docs release-note hit is retained as historical evidence. |
| hard retired command instructions in active source/test/spec surfaces | 1 | 4 | All four are negative assertions in `test_t059_install_release_adapter.test.mjs`; no positive instruction remains. |
| `invokeOddSdlcSpecMethodCommand` | 17 | 53 | Private package command-helper blocker remains across tests/live harnesses. |
| `invokeOddSdlcSpecMethodCommandSync` | 9 | 49 | Sync private command-helper blocker remains in replay/gaps/analyzer and package API live paths. |
| `serializeOddSdlcSpecMethodResult` | 5 | 12 | Serializer remains only for private helper/analyzer tests. |
| `odd-sdlc-ts` | 13 | 59 | Remaining hits are retired-command proof, negative assertions, temp prefixes, historical docs, and ticket text; no active live/source caller remains. |
| `installedStartPayloadFor` | 2 | 3 | Still in `spec_method/entry.ts`; next cut must classify library API versus delete. |
| `startOutcomeForObservedReplay` | 3 | 5 | Still in `spec_method/entry.ts`; next cut must move/delete replay helper authority. |
| `commandPayload` | 1 | 5 | Still confined to `spec_method/entry.ts`; delete or split with command dispatcher. |

Focused proof completed:

- `npm run build:semantic` passed.
- `node --check` passed for all edited live harness scripts.
- focused ESLint passed for all edited live harness scripts.
- `node --test` over T-109, T-115, T-131, and T-162 live harness files
  passed; live-gated tests skipped when their live env flags were absent.
- `node --test test_env/tests/test_t059_install_release_adapter.test.mjs test_env/tests/test_t087_project_induction.test.mjs`
  passed.

Next blocker set:

- split `spec_method/entry.ts` into typed product/package APIs versus deleted
  command grammar
- remove or replace `invokeOddSdlcSpecMethodCommand*`, `commandPayload*`, and
  `serializeOddSdlcSpecMethodResult`
- classify historical docs and temp-prefix references so they do not look like
  retained command law

### 2026-06-19 Typed Workspace API Cut Result

Cut scope: introduce structured package APIs for workspace ticket projection,
ticket admission, gaps projection, and installed start so live callers can stop
using argv-shaped private command helpers.

Changed contract:

- `spec_method/entry.ts` now exports typed workspace APIs:
  `projectOddSdlcWorkspaceTickets(...)`,
  `admitOddSdlcWorkspaceTicket(...)`,
  `projectOddSdlcWorkspaceGaps(...)`, and
  `startOddSdlcWorkspace(...)`.
- T-162 live ticket workflow now projects/admit/starts through those typed APIs
  instead of `invokeOddSdlcSpecMethodCommand(...)`.
- T-110 live PTY operator proof now uses typed gaps/start APIs instead of
  `invokeOddSdlcSpecMethodCommand(...)`.

Current private-helper metrics after this cut, excluding archived
`test_env/test_runs` and generated `build/semantic` output:

| Surface | Files | Matches | Delta from second cut |
| --- | ---: | ---: | ---: |
| `invokeOddSdlcSpecMethodCommand` | 15 | 48 | -2 files / -5 matches |
| `invokeOddSdlcSpecMethodCommandSync` | 9 | 49 | unchanged |
| `serializeOddSdlcSpecMethodResult` | 5 | 12 | unchanged |
| `commandPayload` | 1 | 5 | unchanged |

Focused proof completed:

- `npm run build:semantic` passed.
- `node --test test_env/live/test_t110_live_agent_pty_installed_operator.test.mjs test_env/live/test_t162_ticket_workflow_live.test.mjs`
  passed; T-110 skipped because its live env flag was absent, T-162 passed.
- focused ESLint passed for T-110 and T-162 live harness files.

Next blocker set:

- migrate remaining async helper users in sandbox/test package API callers where
  typed APIs now exist
- replace sync helper users in gaps/analyze-run tests with structured APIs or
  reclassify them as parser/serializer tests
- split command grammar and serialization into a quarantined legacy/parser
  surface before deletion

### 2026-06-19 Simple Async Test Caller Cut Result

Cut scope: migrate deterministic unit-test callers that only needed typed
`gaps` or `start` behavior off `invokeOddSdlcSpecMethodCommand(...)`.

Changed contract:

- T-087, T-096, and T-097 managed traversal tests use
  `projectOddSdlcWorkspaceGaps(...)` and `startOddSdlcWorkspace(...)`.
- T-069 and T-086 missing-installed-topology checks use
  `startOddSdlcWorkspace(...)` and assert the typed blocked outcome directly.
- T-098 and T-110 worker/start helper paths use `startOddSdlcWorkspace(...)`
  instead of constructing argv arrays.

Current private-helper metrics after this cut, excluding archived
`test_env/test_runs` and generated `build/semantic` output:

| Surface | Files | Matches | Delta from typed workspace API cut |
| --- | ---: | ---: | ---: |
| `invokeOddSdlcSpecMethodCommand` | 8 | 30 | -7 files / -18 matches |
| `invokeOddSdlcSpecMethodCommandSync` | 9 | 49 | unchanged |
| `serializeOddSdlcSpecMethodResult` | 5 | 12 | unchanged |
| `commandPayload` | 1 | 5 | unchanged |

Focused proof completed:

- `npm run build:semantic` passed.
- `node --test` over T-069, T-086, T-087, T-096, T-097, and T-110 passed
  with 17 tests.
- `node --test test_env/tests/test_t098_requirements_to_design_assurance.test.mjs`
  passed.
- focused ESLint passed for the migrated files.
- `node --check` passed for T-098.

Next blocker set:

- migrate sandbox/scenario helper users or quarantine them as harness-only
  package API callers
- classify remaining async helpers in release/install adapter tests as package
  API proof versus command-parser proof
- replace or quarantine sync helper users and serializer tests

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

- [x] `build_tenants/typescript/test_env/live/test_t109_live_installed_data_mapper_pty.test.mjs`
- [x] `build_tenants/typescript/test_env/live/test_t110_live_agent_pty_installed_operator.test.mjs`
- [x] `build_tenants/typescript/test_env/live/test_t115_live_installed_data_mapper_repair_flow.test.mjs`
- [x] `build_tenants/typescript/test_env/live/test_t131_guided_odd_chat_live_build.test.mjs`
- [x] `build_tenants/typescript/test_env/live/test_t162_ticket_workflow_live.test.mjs`
- [x] `build_tenants/typescript/test_env/live/run_full_external_data_mapper_sandbox.mjs`
- [x] `build_tenants/typescript/test_env/live/run_t199_data_mapper_code_depth_resume.mjs`
- [x] `build_tenants/typescript/test_env/live/resume_t164_data_mapper_full_capability_live.mjs`
- [x] `build_tenants/typescript/test_env/sandbox/abg_installed_workspace.mjs`

Fixture/doc caller checklist:

- [x] `build_tenants/typescript/test_env/fixtures/data_mapper_reference/data_mapper.template/README.md`
- [x] `build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat/bootstrap.md`
- [x] `build_tenants/typescript/test_env/fixtures/t133_rust_hello_world_minimal/bootstrap.md`
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

## Review Response Cut: Package Surface Closure And Proof-Lane Migration

Date: 2026-06-20

Review finding disposition:

- accepted: public bin deletion was not enough while `./spec-method` and root
  package exports still exposed command law.
- accepted: typed workspace helpers were proxying through an
  `OddSdlcSpecMethodTraversalRequest` with `command: "gaps" | "start"`.
- accepted: the active TypeScript design still described Spec Method as the
  operator entrypoint.
- accepted: scenario/live proof lanes still contained SDLC command grammar.

Cut result:

- `package.json` no longer exports `./spec-method`.
- root `index.ts` no longer re-exports `spec_method/index.ts`.
- `spec_method/index.ts` exports nothing.
- new narrow package exports exist under `workspace_api/` and `package_api/`.
  They expose typed product/package APIs only:
  `projectOddSdlcWorkspaceGaps`, `startOddSdlcWorkspace`,
  `projectOddSdlcWorkspaceTickets`, `admitOddSdlcWorkspaceTicket`, and ABG
  source-root resolver helpers.
- `projectOddSdlcWorkspaceGaps` and `startOddSdlcWorkspace` now normalize into a
  commandless `SdlcWorkspaceTraversalRequest`. They do not construct an
  `OddSdlcSpecMethodTraversalRequest` and do not carry a command discriminator.
- `ODD_SDLC_TYPESCRIPT_SPEC_METHOD_ENTRYPOINT.md` now states the current
  authority split: ABG CLI is the only installed operator command/control
  surface; odd_sdlc exposes product APIs, projections, policy overlays, and
  package APIs.
- `test_env/sandbox/scenario_sandbox.mjs` uses typed product APIs for product
  gaps/start and keeps ABG installed sandbox setup separate.
- `test_env/sandbox/test_t087_t091_t096_internal_data_mapper_induction_sandbox.test.mjs`
  uses typed product APIs and now accepts additional ABG-owned event kinds while
  still requiring the core traversal events in order.
- `test_env/live/run_full_external_data_mapper_sandbox.mjs` no longer creates
  `package-api:invokeOddSdlcSpecMethodCommand`; ABG CLI remains the external
  command path and overlay/ticket starts use typed package APIs.
- T-059 install/release tests use direct package APIs instead of
  `invokeOddSdlcSpecMethodCommand*`.

Current source/test/design metrics, excluding `test_env/test_runs` and ticket
text:

| Surface | Files | Matches | Current interpretation |
| --- | ---: | ---: | --- |
| `package-api:invokeOddSdlcSpecMethodCommand` | 0 | 0 | removed from live proof lane |
| package export `./spec-method` | 0 | 0 | removed from package law |
| root `export * from "./spec_method"` | 0 | 0 | removed from root package law |
| `invokeOddSdlcSpecMethodCommand` | 10 | 53 | remaining private parser/legacy-test debt |
| `invokeOddSdlcSpecMethodCommandSync` | 7 | 45 | remaining private parser/legacy-test debt |
| `serializeOddSdlcSpecMethodResult` | 5 | 12 | remaining serializer legacy-test debt |
| `commandPayload*` | 1 | 5 | confined to private `spec_method/entry.ts` pending deletion |

Remaining command-helper callers:

- `test_env/tests/test_t058_spec_method_entrypoint.test.mjs`
- `test_env/tests/test_t064_installed_operator_ux.test.mjs`
- `test_env/tests/test_t093_scheduling_phase.test.mjs`
- `test_env/tests/test_t101_retry_report_rejection_loop.test.mjs`
- `test_env/tests/test_t139_public_gaps_read_only_evaluator_view.test.mjs`
- `test_env/tests/test_t145_replay_visible_closure_authority.test.mjs`
- `test_env/tests/test_t150_visible_defaults_catalog_lookup.test.mjs`
- `test_env/tests/test_t158_consequence_admission_regression.test.mjs`
- `test_env/tests/test_t161_fd_run_analysis_linter.test.mjs`

Removal condition:

- read-model/query tests move to direct product projection APIs.
- start/gaps tests move to ABG CLI or typed product APIs, depending on whether
  the test is proving operator command/control or product projection behavior.
- analyzer formatting tests move to `analysis/` APIs or a non-command renderer.
- after those callers move, delete `admitOddSdlcSpecMethodRequest`,
  `commandPayload*`, `invokeOddSdlcSpecMethodCommand*`, and
  `serializeOddSdlcSpecMethodResult`.

Proof run:

- passed: `npm run build:semantic`
- passed: focused no-CLI lane, 30 tests:
  T-059, T-069, T-086, T-087, T-096, T-097, T-098, T-110, and T-162 live
  package API.
- passed: `npm run test:t132`
- passed: `npm run test:t087-t096:data-mapper-sandbox`

## 2026-06-20 Deletion Cut

Current reality:

- `spec_method/entry.ts` no longer contains the SDLC command registry, argv
  option parsers, command request/result envelope, command dispatchers,
  analyze-run CLI envelope, or CLI result serializer.
- the former implementation file has moved to `workspace_api/entry.ts`; the
  source tree no longer contains `code/src/spec_method/entry.ts`.
- Deleted symbols include `ODD_SDLC_SPEC_METHOD_COMMAND_VALUES`,
  `admitOddSdlcSpecMethodRequest`, `commandPayload`,
  `commandPayloadAsync`, `invokeOddSdlcSpecMethodCommandSync`,
  `invokeOddSdlcSpecMethodCommand`, `SdlcAnalyzeRunCliEnvelope`, and
  `serializeOddSdlcSpecMethodResult`.
- `workspace_api/` now exposes commandless workspace APIs:
  `projectOddSdlcWorkspaceGaps`, `projectOddSdlcWorkspaceStart`,
  `projectOddSdlcWorkspaceQueryDomain`, `projectOddSdlcWorkspaceTickets`, and
  `admitOddSdlcWorkspaceTicket`.
- `projectOddSdlcWorkspaceStart` preserves projection-only start behavior for
  read-model tests without dispatching a worker. The dispatching
  `startOddSdlcWorkspace` package API has been removed; source tests that need
  installed-operator execution use `test_env/workspace_start_harness.mjs`
  instead of package law.
- T-058, T-064, T-161, and T-203 no longer use the old command helper or CLI
  serializer. T-158 count assertions were updated for the current
  `publishDispatchState(current)` branches.
- root tenant capability metadata now advertises `typed_workspace_product_api`
  instead of `spec_method_installed_entrypoint`.
- `ODD_SDLC_TYPESCRIPT_SPEC_METHOD_ENTRYPOINT.md` now records that the
  command dispatcher has been deleted, ABG CLI is the only operator
  command/control ingress, and `workspace_api/entry.ts` is a projection host.

Current source/test metrics, excluding this ticket text and `test_runs`:

| Surface | Files | Matches | Current interpretation |
| --- | ---: | ---: | --- |
| `invokeOddSdlcSpecMethodCommand` | 0 | 0 | deleted from source/tests |
| `invokeOddSdlcSpecMethodCommandSync` | 0 | 0 | deleted from source/tests |
| `serializeOddSdlcSpecMethodResult` | 0 | 0 | deleted from source/tests |
| `admitOddSdlcSpecMethodRequest` | 0 | 0 | deleted from source/tests |
| `commandPayload*` | 0 | 0 | deleted from source/tests |
| `ODD_SDLC_SPEC_METHOD_COMMAND_VALUES` | 0 | 0 | deleted from source/tests |
| `SdlcAnalyzeRunCliEnvelope` | 0 | 0 | deleted from source/tests |
| public `startOddSdlcWorkspace` export | 0 | 0 | removed from package API |
| `package-api:startOddSdlcWorkspace` | 0 | 0 | removed from live proof lane |

Deletion-cut line movement:

| File group | Added | Deleted | Net |
| --- | ---: | ---: | ---: |
| `code/src/spec_method/entry.ts` | 46 | 1509 | -1463 |
| T-058/T-064/T-158/T-161/T-203 migrated tests | 320 | 527 | -207 |

Proof run:

- passed: `npm run build:semantic`
- passed: `node --test test_env/tests/test_t058_spec_method_entrypoint.test.mjs test_env/tests/test_t158_consequence_admission_regression.test.mjs`
  with 28/28 tests passing after the projection/marker fixes.
- passed: focused post-deletion no-command lane with 94/94 tests:
  T-058, T-064, T-093, T-101, T-139, T-145, T-150, T-158, T-161, and T-203.
- passed: post-metadata `npm run build:semantic`
- passed: `git diff --check`

## 2026-06-20 Review Follow-Up: Remove Dispatching Workspace Start API

Review finding disposition:

- accepted: `startOddSdlcWorkspace` was a second operative start surface even
  after the command helper deletion.
- accepted: public workspace API declarations must not return `unknown` or a
  mixed projection/execution carrier.
- accepted: live proof must not dispatch start through an odd_sdlc package API.

Cut result:

- `workspace_api/index.ts` no longer exports `startOddSdlcWorkspace` or
  `OddSdlcWorkspaceStartOutcome`.
- `workspace_api/entry.ts` no longer imports or calls
  `executeInstalledOperatorStart`; it is a projection/admission host only.
- the dispatching source-test path moved to
  `test_env/workspace_start_harness.mjs`, which composes
  `projectOddSdlcWorkspaceStart(...)` with `executeInstalledOperatorStart(...)`
  for installed-operator unit tests only.
- `run_full_external_data_mapper_sandbox.mjs` dispatches installed starts
  through `genesis-ts`/ABG CLI. Overlay targets are projected to graph-function
  targets before ABG CLI dispatch; runtime traversal selections now fail fast
  until ABG CLI exposes that carrier.
- active design now says `workspace_api/entry.ts` is the projection host and
  ABG CLI is the only operator command/control ingress.

Scans:

| Surface | Result |
| --- | --- |
| generated declarations for `startOddSdlcWorkspace` | 0 matches |
| source/test `package-api:startOddSdlcWorkspace` | 0 matches |
| source/test old command helpers and serializer | 0 matches |
| remaining `startOddSdlcWorkspace` source/test matches | T-188 negative assertions only |

Verification:

- passed: `npm run build:semantic`
- passed: full T-058 workspace API/projection lane, 19/19 tests. Runtime:
  206.4s; current hotspots are the read-only gap dossier/priority failure tests,
  not command dispatch.
- passed: T-188/T-164 boundary guard pair, 13 passed / 1 live-gated skipped.
- passed: migrated helper lane T-069/T-087/T-110, 7/7 tests.
- passed: `git diff --check`

Line movement note:

- tracked diff is 4,334 deleted / 1,044 added before untracked new files.
- new files are 1,879 lines total:
  `workspace_api/entry.ts`, `workspace_api/index.ts`, `package_api/index.ts`,
  and `test_env/workspace_start_harness.mjs`.
  The net cut is still materially negative because the old
  `spec_method/entry.ts` command surface was removed.

## 2026-06-20 Follow-Up: Current One-Surface Checkpoint

Current corrections to the earlier deletion-cut notes:

- `workspace_api/` currently exports
  `projectOddSdlcWorkspaceQueryDomain`, `projectOddSdlcWorkspaceGaps`,
  `projectOddSdlcWorkspaceTickets`, and `admitOddSdlcWorkspaceTicket`.
- `projectOddSdlcWorkspaceGaps` is read-only product projection support. It does
  not call `publicStartOnce`, construct a traversal request, dispatch workers,
  or choose next actions.
- `projectOddSdlcWorkspaceStart`, `startOddSdlcWorkspace`, and
  `test_env/workspace_start_harness.mjs` are not current surviving surfaces.
- `operator/index.ts` no longer re-exports `executeInstalledOperatorStart`.
  Tests that still prove installed-operator internals must import the owning
  internal module directly or migrate to ABG CLI/runtime-binding proof.
- semantic build now runs `clean:semantic` first. `prepack` runs the clean
  semantic build plus `guard:pack-no-command-artifacts`, preventing stale
  compiled `cli` or `spec_method` artifacts from entering the package.

Source inventory:

- current TypeScript source count: 180 files.
- inventory artifact:
  `.ai-workspace/comments/codex/20260620T000000Z_T204_source_survival_inventory.md`.
- classification counts:
  - `gtl_program`: 10
  - `plugin`: 24
  - `product_carrier`: 43
  - `product_projection`: 53
  - `test_or_release_plumbing`: 25
  - `move_to_abg`: 25
- this is not closure. Rows marked `move_to_abg` or `survival_pending` remain
  T-204 debt, especially `analysis/*`, `effects/*`, `start/*`,
  `operator/event_store.ts`, `operator/installed_operator.ts`, and the pending
  ABG/product split in `operator/traversal_consequence.ts`.

Validation at this checkpoint:

- passed: `npm run build:semantic`
- passed: `npm run guard:pack-no-command-artifacts`
- passed: `npm pack --dry-run --json` after clean build/guard; no stale
  `cli` or `spec_method` build artifacts are packed.
- passed: T-139/T-140/T-197/T-203 focused proof lane,
  61 tests after updating the A2 source guard to the T-204 split.
- passed: T-066 prompt-specific proof for component-depth envelope directives,
  including ESM component-test guidance and required
  `componentTestRows[].componentIds`.
- not complete: broad T-066 legacy materialization assertions still expose
  current target-carrier/postflight law drift under the stricter launch and
  component-depth carrier checks. Treat those as follow-up materialization-law
  migration, not a reason to restore command/start surfaces.

## 2026-06-20 Functional One-Surface Proof Checkpoint

Current functional split:

- public SDLC command/control is gone: no package bin, no `./spec-method`
  export, no root `spec_method` export, no `code/src/cli`, no
  `spec_method/entry.ts`, and no surviving command helper/serializer symbols in
  source or tests.
- `workspace_api/` is a commandless product read-model API for query-domain,
  gaps, tickets, and ticket admission. The gaps API projects archive diagnostics
  and requirement fulfillment, including the T-205
  `missing_bind_outcome_after_passed_compute` diagnostic, without dispatching
  traversal.
- ABG CLI owns the hello-world live start loop. The live sandbox drives starts
  through installed `genesis-ts`; odd_sdlc contributes product plugins,
  carriers, prompts, policy, and read-model projections.
- package publishing is guarded: semantic build cleans stale output first and
  `prepack` runs semantic build plus `guard:pack-no-command-artifacts`.

Clean live proof:

- archive:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260620T010934978Z_pid13932`
- command/test result:
  `node --test --test-name-pattern "T-132 JavaScript hello-world live build loop" test_env/sandbox/test_scenario_sandbox.test.mjs`
  passed with 1/1 tests in 1,588,069 ms.
- scenario progress:

| Step | Target graph function | Status | Step time |
| ---: | --- | --- | ---: |
| 0 | `Fg_conform_project` | converged | 0.02 |
| 1 | `derive_lite_design_adr_surface` | converged | 4.56 |
| 2 | `derive_lite_component_code_surface` | converged | 7.58 |
| 3 | `derive_lite_test_design_surface` | converged | 3.30 |
| 4 | `derive_lite_component_test_surface` | converged | 5.39 |
| 5 | `derive_lite_uat_test_source_surface` | converged | 4.12 |
| 6 | `prepare_test_execution_surface` | converged | 0.02 |
| 7 | `derive_test_execution_result_surface` | converged | 0.02 |

Final progress record: `advanceCount: 8`, `lastStatus: converged`,
`noProgressReason: null`, break reason `required_handoff_edges`.

Final checkpoint validation:

- passed: `npm run build:semantic`
- passed: `npm run guard:pack-no-command-artifacts`
- passed: `npm pack --dry-run --ignore-scripts --json`; 371 entries, no packed
  `build/semantic/code/src/cli/**` or
  `build/semantic/code/src/spec_method/**` artifacts.
- passed: `npm run test:t132`
- passed: T-058 workspace API/split proof, 6/6 tests.
- passed: T-150 visible defaults/gaps archive diagnostics, 4/4 tests.
- passed: T-139/T-140/T-197/T-203 focused proof lane, 61/61 tests.
- passed: T-066 prompt-specific component-depth prompt proof, 1/1 tests.
- passed: `git diff --check`
- scans: no `projectOddSdlcWorkspaceStart`, `startOddSdlcWorkspace`,
  `invokeOddSdlcSpecMethodCommand`, `serializeOddSdlcSpecMethodResult`, or
  `commandPayload` matches in `code/src` or `build/semantic/code/src`; no
  semantic `cli` or `spec_method` files are present.

Status:

- The functional one-surface split is proven for this checkpoint: ABG owns
  live command/control and odd_sdlc does not expose a replacement start/gaps
  surface.
- T-204 remains active under the strict shrink/closure law. The source
  inventory still classifies 25 files as `move_to_abg` or
  `survival_pending`, especially `analysis/*`, `effects/*`, `start/*`,
  `operator/event_store.ts`, `operator/installed_operator.ts`, and the final
  ABG/product fold in `operator/traversal_consequence.ts`.

## 2026-06-20 Follow-Up One-Surface Proof After Review Fixes

Review-response fixes in this cut:

- stale public-start and deleted workspace-start-harness tests now use explicit
  internal plugin-support imports or ABG CLI start proof; no public start/gaps
  package surface was reopened.
- `workspace/source_input.ts` is the single admitted workspace source-ingress
  helper used by runtime binding and read-model projection.
- `workspace_api` gaps archive reading is named as a read-model carrier rather
  than an implicit command/control replay surface.
- the live failure in archive
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260620T030936371Z_pid83731`
  found a real F_P-boundary bug: the design-depth evaluator emitted
  `designCompletenessVerdict.*.kind = "sdlc_verdict_axis"`. Typed admission
  correctly rejected it, but the root cause was relying on evaluator self-check
  for an exact carrier string already known as a legacy alias. The fix is a
  narrow deterministic canonicalization in the evaluator content-register
  projection before strict register admission; unknown axis kinds still fail.

Regression added:

- `test_env/tests/test_t181_fp_evaluator_design_register.test.mjs` now covers
  incremental design-depth fragments with the legacy axis alias and proves the
  projected register uses
  `sdlc_design_completeness_axis_verdict`.

Fresh clean live proof:

- archive:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260620T031939859Z_pid14825`
- command/test result:
  `npm run test:scenario:t132-hello-world-js-live`
  passed with 1/1 tests in 1,517,104 ms.
- total scenario progress from first step begin to return: 25.09.

| Step | Target graph function | Status | Step time |
| ---: | --- | --- | ---: |
| 0 | `Fg_conform_project` | converged | 0.02 |
| 1 | `derive_lite_design_adr_surface` | converged | 4.43 |
| 2 | `derive_lite_component_code_surface` | converged | 6.06 |
| 3 | `derive_lite_test_design_surface` | converged | 3.48 |
| 4 | `derive_lite_component_test_surface` | converged | 6.01 |
| 5 | `derive_lite_uat_test_source_surface` | converged | 4.26 |
| 6 | `prepare_test_execution_surface` | converged | 0.02 |
| 7 | `derive_test_execution_result_surface` | converged | 0.02 |

Archive consistency check:

- `derive_lite_design_adr_surface`: postflight `passed`, zero blocking reasons,
  closure artifact present.
- `derive_lite_component_code_surface`: postflight `passed`, zero blocking
  reasons, closure artifact present.
- `derive_lite_test_design_surface`: postflight `passed`, zero blocking
  reasons, closure artifact present.
- `derive_lite_component_test_surface`: postflight `passed`, zero blocking
  reasons, closure artifact present.
- `derive_lite_uat_test_source_surface`: postflight `passed`, zero blocking
  reasons, closure artifact present.
- `prepare_test_execution_surface`: postflight `passed`, zero blocking reasons,
  closure artifact present.
- `derive_test_execution_result_surface`: postflight `passed`, zero blocking
  reasons, closure artifact present.

Validation after the follow-up fix:

- passed: `npm run lint:semantic`
- passed: `npm run lint:test-harness`
- passed: `npm run build:semantic`
- passed: `node --test test_env/tests/test_t181_fp_evaluator_design_register.test.mjs`
- passed: `npm run test:scenario:t132-hello-world-js-live`
- passed: `npm run guard:pack-no-command-artifacts`
- passed: focused T-204/T-205/T-181/T-197/T-203 proof lane, 105/105 tests.

Status:

- Functional one-surface proof is refreshed after the review-response fixes and
  after the evaluator alias-boundary bug fix.
- Strict T-204 closure remains open only for the already-classified
  `move_to_abg`/`survival_pending` inventory, not because odd_sdlc exposes a
  second command/control truth surface.

## 2026-06-20 Hard-Break Executor Removal Checkpoint

Inside-out hard-break work in this cut:

- deleted `executeInstalledOperatorStart(...)` and the local terminal outcome,
  summary, run-archive, F_D append, graph-continuation cursor, and graph-span
  reentry helpers from `operator/installed_operator.ts`.
- removed the root public `effects/index.js` export; generic effects remain
  internal/move-to-ABG inventory and are no longer root package API.
- migrated stale proof tests away from root/internal executor imports. Tests now
  either import product-owned helpers from their owning modules or assert that
  the old local executor/event-authorship path is absent.
- changed T-140/T-197 gates so W-110/A5 assert ABG ownership by absence of
  odd_sdlc-local `runEngineIterateAsync`, explicit graph-vector cursor, and
  graph-span reentry event authorship.
- kept `workspace_api` gaps as a read-only projection, and added fail-fast
  archive diagnostics for malformed replayed `sdlc_next_action_projection.json`
  graph function/vector refs:
  `next_action_projection_graph_vector_missing`,
  `legacy_graph_function_boundary_ref`,
  `unknown_graph_function_boundary_ref`,
  `legacy_graph_vector_boundary_ref`, and
  `unknown_graph_vector_boundary_ref`.

Checkpoint validation:

- passed: `npm run build:semantic`
- passed: `npm run guard:pack-no-command-artifacts`
- passed: `git diff --check`
- passed: focused T-204/T-205/T-140/T-141/T-143/T-151/T-158/T-172/T-197/T-203
  proof lane, 126/126 tests.
- passed: scans show no `executeInstalledOperatorStart(...)` calls in
  `code/src`, `build/semantic/code/src`, or active test code; remaining textual
  mentions are negative/boundary assertions only.

Status:

- This cut removes the residual product-local installed start executor and the
  old local ABG event-authorship paths. Functional command/control truth remains
  ABG-owned.
- Strict closure still requires executing the existing `move_to_abg` inventory
  for generic analysis/effects/event-store/start mechanics and the remaining
  physical relocation work. This checkpoint does not claim release closure until
  a fresh hello-world live run passes after the hard break.

## 2026-06-20 Post-Hard-Break Hello-World Live Proof

Fresh clean live proof after deleting the residual local installed executor:

- archive:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260620T080343355Z_pid55860`
- command/test result:
  `npm run test:scenario:t132-hello-world-js-live`
  passed with 1/1 tests in 1,612,128 ms.
- direct tenant verification:
  `node --test test/hello.test.js` from the generated
  `build_tenants/hello_world_javascript` tenant passed 1/1 tests in 61 ms.
- total scenario progress from first step begin to return: 26.45.

| Step | Target graph function | Status | Step time | Prompt consistency |
| ---: | --- | --- | ---: | --- |
| 0 | `Fg_conform_project` | converged | 0.02 | no worker prompt |
| 1 | `derive_lite_design_adr_surface` | converged | 5.10 | consistent; implementation-design planning, no materialization target contradiction |
| 2 | `derive_lite_component_code_surface` | converged | 7.25 | consistent; materialization required with declared `src/hello.js`; review overworked |
| 3 | `derive_lite_test_design_surface` | converged | 4.24 | consistent; planning surface, materialization not required |
| 4 | `derive_lite_component_test_surface` | converged | 5.53 | consistent; materialization required with declared `test/hello.test.js`; worker over-read package context |
| 5 | `derive_lite_uat_test_source_surface` | converged | 3.47 | consistent; UAT source edge reused admitted role=test target and emitted UAT carrier |
| 6 | `prepare_test_execution_surface` | converged | 0.02 | execution-preparation system stage |
| 7 | `derive_test_execution_result_surface` | converged | 0.02 | execution-result system stage |

Prompt and evaluator proportionality notes from this run:

- `derive_lite_design_adr_surface`: worker prompt 13,958 chars /
  1,568 words; design-depth evaluator prompt 24,934 chars / 1,891 words.
- `derive_lite_component_code_surface`: worker prompt 20,526 chars /
  2,209 words; review-grade prompt 24,577 chars / 2,177 words; worker elapsed
  2.13; review elapsed 4.43. This is the main overwork signal: 4 reviewed
  obligations produced a large review trace even though the prompt was not
  contradictory.
- `derive_lite_test_design_surface`: worker prompt 14,183 chars / 1,359 words;
  review-grade prompt 17,997 chars / 1,504 words; worker elapsed 2.08; review
  elapsed 2.14. This is the cleaner planning-surface shape.
- `derive_lite_component_test_surface`: worker prompt 18,970 chars /
  1,969 words; review-grade prompt 21,123 chars / 1,745 words; worker elapsed
  2.46; review elapsed 3.03. Worker spent time rediscovering tenant/root and
  execution context from raw package files even though the top-level prompt
  carried enough context.
- `derive_lite_uat_test_source_surface`: worker prompt 15,305 chars /
  1,545 words; review-grade prompt 20,412 chars / 1,657 words; worker elapsed
  1.36; review elapsed 2.07. The prompt was smaller and the wait was
  proportional.

Archive consistency check:

- every graph stage with a worker prompt has `fp_evaluate_result.status =
  passed`, `postflight.status = passed`,
  `sdlc_edge_closure_decision.json` present, and
  `sdlc_next_action_projection.json` present.
- review-grade stages passed all reviewed obligations:
  component-code 4/4, test-design 2/2, component-test 5/5, UAT test source 5/5.
- generated product files are lawful and executable:
  `src/hello.js` emits `Hello, world!\n`, and `test/hello.test.js` imports
  Node built-ins and verifies stdout through `execFileSync`.

Validation after the post-hard-break live proof:

- passed: `npm run build:semantic`
- passed: `npm run guard:pack-no-command-artifacts`
- passed: `git diff --check`
- passed: focused T-204/T-205/T-140/T-141/T-143/T-151/T-158/T-172/T-197/T-203
  proof lane, 126/126 tests.
- passed: `npm run test:scenario:t132-hello-world-js-live`
- not green: broad `npm run test:semantic`. The failures are outside the
  one-surface/live proof lane and fall into two known classes:
  stale root-barrel imports over internal/product helpers that are no longer
  public API (`admitWorkerTransport`,
  `admitComponentDepthRegisterFromArtifact`, `declaredProductFileTargets`,
  `deriveWorkerHandoffManifest`, and traversal-pressure helpers), and older
  product-materialization assertions still priced against pre-tightening
  postflight/materialization law. Some later `ERR_MODULE_NOT_FOUND` entries are
  cascade/concurrency noise from the broad glob after package/release tests
  rebuild or clean semantic output while sibling test files are loading.

Status:

- The hard-break executor removal is live-proven. ABG-owned `genesis-ts start`
  drove the scenario; odd_sdlc did not restore a local start executor or
  command/control wrapper.
- No contradictory prompt was found in the live run. The remaining runtime-cost
  trend is review-grade overwork, especially component-code materialization
  binding language and raw sidecar/package discovery pressure.

## 2026-06-20 One-Surface Review Follow-Up Checkpoint

Review-response fixes in this cut:

- renamed the ABG CLI test start wrapper output from the retired local
  `sdlc_installed_operator_start_outcome` facade to
  `odd_sdlc_abg_cli_start_test_projection`; the wrapper now records explicit
  ABG CLI process and stdout-parse facts and throws when a failed ABG CLI call
  has no parseable output.
- removed the full data-mapper live harness local continuation loop:
  `sdlcOverlayStartLoop`, next-target reconstruction from
  `nextActionProjection`, retry-window progression, and first-traversal
  advance selection are gone. The harness now performs one installed
  `genesis-ts start --until converged` call and refuses overlay/runtime
  selection inputs that would require ABG target-carrier support not present on
  this harness path.
- removed the stale T-053 live use of `publicStartOnce`; that live test now
  records ABG command-binding evidence and keeps its external worker/result
  admission proof separate from installed traversal control.
- moved remaining stale test imports off the root product barrel for internal
  helpers (`admitComponentDepthRegisterFromArtifact` and sandbox archive proof
  helpers) instead of re-exporting those internals.
- restored the component-code review-grade prompt rule:
  downstream test files and declared test-execution-contract proof are not
  `test_overlap_missing` on `component_code_surface`.
- fixed release-snapshot `npm pack --json` parsing when lifecycle hook output
  precedes the JSON array.

Validation for this checkpoint:

- passed: `npm run build:semantic`
- passed: `git diff --check`
- passed: root-barrel stale import scan; `missing-root-import-files=0`
- passed: T-058/T-059 install-release/pack lane, 12/12 tests, including
  `guard:pack-no-command-artifacts`
- passed: T-197/T-203/T-164/T-053 focused boundary lane, 38/40 tests with the
  two live tests skipped by environment flags
- passed: T-188 data-mapper live boundary guard, 2/2 focused tests
- passed: T-160 workspace API overlay/read-model focused guard, 2/2 tests
- passed: T-184/T-187 focused prompt and operator-summary guards after rebuild
- passed: T-128 ABG CLI start wrapper process-failure proof and T-204 installed
  operator absence proof, 4/4 focused tests
- broad sequential semantic suite result:
  `node --test --test-concurrency=1 test_env/tests/*.test.mjs` produced
  1022/1065 passed and 43 failed in 384,051 ms. The remaining failures are the
  known product-materialization/tenant-role fixture cluster plus one liveness
  timing assertion; they are not public command-surface regressions and are not
  solved by restoring a local start/control path.

Status:

- The reviewed one-surface issues are fixed at the active proof boundary:
  no public CLI/spec-method/start/gaps surface, no local installed executor,
  no live data-mapper continuation loop, no old ABG CLI test outcome facade,
  and no stale root-barrel imports for removed internals.
- Strict T-204 closure still requires executing the existing
  `move_to_abg`/`survival_pending` inventory for generic `analysis/*`,
  `effects/*`, `start/*`, `operator/event_store.ts`, the remaining internal
  plugin-support split in `operator/installed_operator.ts`, and the final
  ABG/product fold in `operator/traversal_consequence.ts`.

## 2026-06-20 Fresh Hello-World Live Proof After One-Surface Follow-Up

Fresh clean live proof after the review follow-up cut:

- archive:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260620T101802962Z_pid88477`
- command/test result:
  `npm run test:t132:hello-world-live` passed with 1/1 tests in
  1,739,203 ms.
- direct tenant verification:
  `node --test test/hello.test.js` from generated
  `build_tenants/hello_world_javascript` passed 1/1 tests in 56 ms.
- final progress record: `advanceCount: 8`, `lastStatus: converged`,
  `noProgressReason: null`, break reason `required_handoff_edges`.

| Step | Target graph function | Status | Step time |
| ---: | --- | --- | ---: |
| 0 | `Fg_conform_project` | converged | 0.02 |
| 1 | `derive_lite_design_adr_surface` | converged | 6.02 |
| 2 | `derive_lite_component_code_surface` | converged | 6.27 |
| 3 | `derive_lite_test_design_surface` | converged | 4.04 |
| 4 | `derive_lite_component_test_surface` | converged | 7.26 |
| 5 | `derive_lite_uat_test_source_surface` | converged | 4.46 |
| 6 | `prepare_test_execution_surface` | converged | 0.02 |
| 7 | `derive_test_execution_result_surface` | converged | 0.02 |

Archive consistency check:

- every operator run has `postflight.status = passed`, zero blocking reasons,
  `fp_evaluate_result.status = passed`,
  `sdlc_edge_closure_decision.disposition = close`, and
  `sdlc_next_action_projection.json` present.
- review-grade assessments passed where present:
  component-code 4 findings, test-design 2 findings, component-test 5
  findings, UAT test source 5 findings.

Status:

- The one-surface follow-up is now hello-world live-proven. ABG-owned
  `genesis-ts start --until converged` drove every stage; no odd_sdlc local
  executor, command wrapper, or data-mapper continuation loop was restored.
- This does not close the physical shrink inventory; strict T-204 closure still
  requires moving/deleting the remaining `move_to_abg` rows.

## 2026-06-20 Register Walk And Remaining Tech-Debt Split

Register audit source:
`.ai-workspace/comments/codex/20260620T130634Z_T204_register_walk.md`.

Current conclusion:

- a register-shaped carrier is not itself legacy. Product semantic carriers
  survive when they are plugin I/O or irreducible SDLC domain meaning.
- the live defect is mixed ownership: product carriers are still tangled with
  installed-operator consequence/archive code and archive rehydration helpers.
- the clearest remaining migration surface is the evaluate content carrier:
  active staged-compute design names `sdlc_evaluate_content_ledger` as the
  concrete authority carrier. Implementation now names the ledger replacement
  target and classifies `sdlc_evaluate_content_register` as a legacy projection,
  and the operator-run artifact catalog now treats the legacy content-register
  archive as `read_model`; prompts, analysis loaders, and archive fixtures
  still use register wording.
- the verified isolated dead exports from the 2026-06-21 audit are removed:
  `writeTestExecutionResultSystemTransformOutput(...)`,
  `SdlcTicketDeclaredStatus`, and the unused closed-F_D mechanics descriptor
  object/check-list types. The retained closed-F_D mechanics ref remains the
  admitted assurance predecessor ref.
- `effects/file_store.ts` is narrowed to its live write-plan effect. The
  unused read-plan branch and read effect kind are removed; the file itself
  survives because `edge_projection.ts` and T-175 consume the write path.

Register classification:

| Carrier family | Classification | T-204 action |
| --- | --- | --- |
| `SdlcDesignDepthRegister` | survive: product evaluate.C carrier | Keep as admitted product carrier; prevent deterministic synthesis as closure truth. |
| `SdlcReviewGradeEdgeFulfillmentAssessment` | survive: product evaluate.C assessment | Keep as assessment sidecar; do not promote it into a new closure ledger. |
| `SdlcComponentDepthRegister` | survive: product target carrier | Keep and continue tightening target/role admission. |
| `SdlcTestDesignRegister` and `SdlcTestExecutionSurfaceRegister` | survive: product target carriers | Keep as target-carrier admissions only. |
| `SdlcDecompositionTraceRegister` | survive provisionally: product projection | Keep only as domain evidence/read model, not continuation or retry authority. |
| `SdlcLineageLedger` and `SdlcRequirementClosureRegister` | survive: product read model | Keep over admitted facts; do not let archive scraping become authority. |
| `SdlcEdgeFulfillmentLedger`, `SdlcEdgeClosureDecision`, `SdlcNextActionProjection` | split ownership | Product owns SDLC meaning; ABG owns final runtime ledger/projection authorship, replay, continuation, and consequence admission. |
| `SdlcEvaluateContentRegister` | migrate: legacy projection | Replace authority-register naming with `sdlc_evaluate_content_ledger`; keep legacy register artifact only as projection/compatibility where required. |
| `sdlc_installed_operator_traversal_consequence` | retire or adapter-only | Removed as a shared TypeScript carrier; remaining internal archive payload must move to ABG consequence projection or become non-authoritative projection only. |
| `SdlcInstalledOperatorStartOutcome` | deleted | Removed from current carrier code and artifact catalog; old archive `run.json` files are not product carrier truth. |

Next cuts:

1. Finish migrating evaluate content authority from register wording to ledger
   wording across prompts, analysis loaders, and archive fixtures. The code now
   carries ledger constants, the legacy artifact catalog row is `read_model`,
   and the guard no longer permits tests that require ledger terminology to be
   absent.
2. Split `operator/installed_operator.ts` into product plugin/session code and
   ABG-owned consequence/archive output.
3. Split `operator/traversal_consequence.ts` into SDLC product-domain fold
   functions versus ABG-owned replay, transition, and consequence projection.
4. Reprice `analysis/*` as product diagnostics over ABG projections or
   `move_to_abg`; no archive loader may be closure authority.
5. Add guards rejecting new installed-operator start/consequence truth carriers
   and rejecting archive JSON scraping as gap/closure authority unless it is
   explicitly ABG-admitted projection input.

## 2026-06-21 Extended Unmoved SDLC Functionality Inventory

Trigger evidence:

- data-mapper live archive:
  `build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260620T165425913Z_pid14480`
- worker transport:
  `process://codex?model=gpt-5.5&effort=high`
- command binding:
  `abg_cli_start_until_converged`
- `Fg_conform_project` converged.
- `lite_design_module_implementation` stopped with
  `abg_reported_lawful_gap_stop`.
- component-code worker materialized Scala/SBT source and `sbt test` passed.
- component-code review-grade wrote
  `review_grade_edge_fulfillment_assessment.status = blocked`, but admission
  rejected it as `review_grade_assessment_invalid` because the evaluator
  reviewed only 21 inline obligations while the prompt/admission path still
  carried the broader review-grade obligation set.

Historical comparison:

| Archive | Component-code review result | Gap code | Retry eligible | Outcome |
| --- | --- | --- | --- | --- |
| `20260612T204219281Z_pid13861` first component-code pass | 161 findings, blocked | `review_grade_edge_fulfillment_blocked` | yes | same-edge repair ran |
| `20260612T204219281Z_pid13861` second component-code pass | 64 fulfilled, 97 `wrong_stage` downstream/adjoined partials | closure `close` | n/a | ABG converged |
| `20260620T165425913Z_pid14480` component-code pass | 21 findings, blocked | `review_grade_assessment_invalid` | no | ABG stopped at `gap_stop` |

Conclusion:

- the generated data-mapper Scala implementation still had real semantic gaps,
  but those gaps should have been classified as repairable current-edge
  pressure, as in the earlier passing lineage.
- the pipeline root failure is not the Scala product alone. It is an
  incomplete T-204/T-205 split: review-grade scope ownership and same-edge
  repair continuation were not fully moved to ABG before local installed
  executor/retry behavior was removed.

### Newly Discovered Move/Split Defects

| Functionality | Current odd_sdlc surface | Target owner | Current defect |
| --- | --- | --- | --- |
| Review-grade scope carrier | `operator/plugins/evaluate/prompts.ts`, `operator/review_grade_edge_fulfillment.ts` | ABG/GTL admission plus odd_sdlc product semantics | Prompt says full admitted edge packet and also says scoped runs use only `invocationPackage.inlineObligationIds`; admission still rejects unreviewed broader obligations. This split made the live assessment invalid instead of retryable. |
| Same-edge repair continuation | `operator/installed_operator.ts` retry-context adapters | ABG | Old local behavior converted semantic review failure to `retry_same_edge`. After the hard break, ABG did not select an equivalent current-edge repair continuation for the data-mapper failure. |
| Gap dossier to retry context | `operator/installed_operator.ts#sdlcWorkerRetryContextFromAbgRetryContext`, `deriveSdlcWorkerRetryContextFromPostActionProjection`, `mergeSdlcWorkerRetryContextWithRuntimeGapRegister` | ABG | odd_sdlc still adapts runtime gap dossiers into worker retry context. The adapter exists, but did not preserve the earlier live repair behavior. |
| Review blocked versus invalid classification | review-grade admission, postflight gap dossier, blocking reason fold | ABG runtime/reentry fold with odd_sdlc product classification plugin | Repairable semantic pressure became `review_grade_assessment_invalid` with `lawfulReentryPoint=triage_gap`, `retryEligible=false`. It should become `review_grade_edge_fulfillment_blocked` or equivalent repairable ABG current-edge pressure when the assessment is semantically valid. |
| Feature-scope typing | worker invocation package and review-grade prompt/admission | GTL/ABG typed graph | Invocation package reports `featureScope.mode=full_breadth` while basis refs can say `steel_thread`; prompt and admission can legally read the same package differently. Scope mode, inline scope, requirement trace scope, and edge-packet scope need one typed carrier. |

### T-204 Known Unmoved Functionality

| Functionality | Current odd_sdlc surface | Target owner | Required T-204 action |
| --- | --- | --- | --- |
| Public start adapter | `start/index.ts`, `start/policy.ts`, `start/public_start.ts` | ABG | Split product start-intent/query data from runtime start. ABG owns `start`, stop predicates, worker attachment, and control-result truth. |
| Installed operator plugin mega-session | `operator/installed_operator.ts` | split | Keep ABG-consumed plugin/session callbacks and product carrier admission. Move or delete runtime/control/archive/retry/result-ingress behavior. |
| Runtime event store | `operator/event_store.ts` | ABG runtime/archive | Keep only test/read-model compatibility if explicitly non-authoritative. Runtime event authorship and replay belong to ABG. |
| Generic effect shells | `effects/archive_store.ts`, `effects/file_store.ts`, `effects/process_runner.ts` | ABG or shared substrate | Move generic IO/process effect mechanics out of odd_sdlc product code, or prove narrow package plumbing. |
| Traversal consequence final fold | `operator/traversal_consequence.ts`, mirrored consequence writing in `operator/installed_operator.ts` | split with ABG owning final bind | Product may expose SDLC domain interpretation. ABG owns consequence bind, continuation transition, replay, ledger/projection authorship, and final admission. |
| Workspace/gaps archive rehydration | `workspace_api/entry.ts`, `analysis/carrier_loaders.ts`, `analysis/runtime_gaps.ts` | ABG-admitted projection source plus odd_sdlc read model | Product read models may survive only over admitted ABG projection truth. Raw archive JSON scraping must not be closure or gap authority. |
| Product materialization replay/archive readers | `operator/product_materialization/replay.ts`, `manifest.ts`, `observation.ts` | split | Keep SDLC product-materialization meaning and target authority. Move generic replay/archive reconstruction to ABG. |
| Evaluate content register migration | `operator/plugins/evaluate/content_register.ts`, prompts, analysis loaders, archive fixtures | odd_sdlc product ledger with legacy projection | Finish migration from `sdlc_evaluate_content_register` authority language to `sdlc_evaluate_content_ledger`; retain old register only as read-model projection where needed. |
| Terminal gap and ticket workflow over runtime blocks | `tickets/workflow.ts`, live harness terminal-gap handling | split | Product ticket intake may stay. ABG must own runtime blocking facts, retry eligibility, and terminal-gap status. |

### Surviving odd_sdlc Product Surfaces

These are not T-204 move targets unless they start owning traversal/runtime
truth:

- GTL graph declarations and target-carrier contracts under `graph/*`.
- Product plugin contracts, prompt policy, transform/evaluate/consequence
  callback support under `operator/plugins/*` and `hooks/*`.
- Product semantic carriers: design-depth register, review-grade assessment,
  component-depth register, test-design register, and test-execution-surface
  register.
- Product materialization authority and target-role policy.
- `analysis/*` as product closure-proof diagnostics only when reading
  ABG-admitted facts or clearly labeled non-authoritative archive diagnostics.

### ABG Interface Complexity Rule

Treat `odd_sdlc` as a pure client of ABG services. ABG is currently realized
locally as a `build_tenant`, but that realization is not the downstream product
contract. ABG may later be a cloud service, queue-backed runtime, database-backed
ledger service, hosted worker fabric, or another substrate realization. The
`odd_sdlc` product boundary must therefore be:

```text
odd_sdlc domain declaration/plugin/read model
-> ABG substrate/service interface
-> concrete ABG realization
```

and never:

```text
odd_sdlc domain code
-> local filesystem/process/archive/ledger/runtime mechanics
-> reconstructed systems truth
```

If `odd_sdlc` needs a ledger, store it through ABG ledger interfaces. `odd_sdlc`
may define the SDLC domain schema, row meaning, product labels, and read-model
projection for a named ledger, but ABG owns ledger identity, storage, event
admission, replay, lifecycle, projection roots, and runtime authorship. The
point of the split is to manage system complexity through ABG interfaces rather
than rebuilding infrastructure inside each downstream product.

The same rule applies to runtime events, process/effect execution, archive
truth, retry/reentry state, traversal consequence, and closure projection:
`odd_sdlc` supplies domain meaning and plugin proposals; ABG supplies the
system capability that makes those proposals durable, replayable, and lawful.

### Closure Implications

T-204 cannot close while any of the following remain true:

1. review-grade prompt scope, invocation scope, and admission scope can disagree;
2. current-edge semantic repair pressure can become non-retryable operator
   triage because the assessment scope is invalid;
3. same-edge retry/reentry depends on odd_sdlc-installed-operator adapters
   rather than ABG-owned continuation/retry carriers;
4. odd_sdlc writes or owns final runtime consequence ledgers, next-action
   projections, or closure decisions as runtime truth;
5. read models reconstruct closure/gap truth directly from raw archive JSON
   instead of ABG-admitted projection facts.

## Remaining Work Execution Plan

Each phase must leave a durable audit log under:

```text
.ai-workspace/comments/codex/T204_phase_<n>_<name>.md
```

Every phase audit log must include:

- entry commit and worktree status;
- source and function inventory delta for the phase;
- files/functions deleted, moved, retained, or reclassified;
- ABG interface consumed or explicit ABG interface still missing;
- validation commands and exact results;
- completion verdict: `complete`, `partial`, or `blocked`.

### Phase 0: Re-Baseline Inventory

Purpose: make the post-`3.0.0-rc.1` T-204 inventory current before more
deletion or movement.

Work:

- re-run source file/function inventory over `build_tenants/typescript/code/src`;
- classify each current surface as `gtl_program`, `plugin`,
  `product_carrier`, `product_projection`, `test_or_release_plumbing`,
  `move_to_abg`, `delete`, or `survival_pending`;
- confirm public package exports remain command-free;
- record line counts for deletion/movement measurement.

Completion gate:

- audit log exists at
  `.ai-workspace/comments/codex/T204_phase_0_baseline_inventory.md`;
- no stale rows reference already-deleted command code as active blockers;
- every remaining `move_to_abg` row has a current file/function pointer.

### Phase 1: Start And Control Executor Boundary

Purpose: remove odd_sdlc-owned start/control execution authority.

Targets:

- `start/index.ts`;
- `start/policy.ts`;
- `start/public_start.ts`;
- `executeInstalledOperatorStart` and any remaining installed start outcome
  adapters;
- worker attachment and stop-predicate/`until` control logic.

Target state:

- odd_sdlc may publish product start intent, target carrier data, and plugin
  declarations;
- ABG owns start, continue, stop predicates, worker attachment, and
  control-result truth.

Completion gate:

- no odd_sdlc-local executor can start or continue traversal;
- T-140 and T-203 pass;
- no public or internal test proof depends on an odd_sdlc start wrapper.

Audit log:

```text
.ai-workspace/comments/codex/T204_phase_1_start_control_boundary.md
```

### Phase 2: Runtime Events, Effects, And Generic Infrastructure

Purpose: move generic runtime mechanics behind ABG interfaces.

Targets:

- `operator/event_store.ts`;
- `effects/archive_store.ts`;
- `effects/file_store.ts`;
- `effects/process_runner.ts`;
- any odd_sdlc runtime event writers or process/effect wrappers.

Target state:

- ABG owns runtime event authorship, event storage, process execution,
  archive writes, and replayable system facts;
- odd_sdlc supplies domain plugin proposals and product schema, not filesystem,
  process, event, or archive infrastructure.

Completion gate:

- runtime events and process/effect execution flow through ABG substrate
  interfaces;
- no odd_sdlc code writes ABG canonical runtime truth directly;
- product plugin tests still pass through ABG-owned execution plumbing.

Audit log:

```text
.ai-workspace/comments/codex/T204_phase_2_runtime_effects.md
```

### Phase 3: Consequence, Retry, Reentry, And Closure Authority

Purpose: move bind consequence and repair continuation truth to ABG.

Targets:

- `operator/traversal_consequence.ts`;
- consequence writing in `operator/installed_operator.ts`;
- retry/reentry context adapters;
- closure decision and next-action projection authorship.

Target state:

- ABG owns consequence bind, continuation transition, retry eligibility,
  reentry facts, closure decision, and next-action projection;
- odd_sdlc may classify SDLC product pressure and propose domain repair
  semantics through plugins.

Completion gate:

- same-edge retry/reentry no longer depends on odd_sdlc-installed-operator
  adapters;
- repairable review-grade pressure remains retryable;
- regression covers the prior downgrade from repairable pressure to
  non-retryable triage.

Audit log:

```text
.ai-workspace/comments/codex/T204_phase_3_consequence_retry.md
```

### Phase 4: Archive-Scrape Authority Removal

Purpose: raw archive JSON must not be authority for closure, gap, retry, or
next-action truth.

Targets:

- `workspace_api/entry.ts`;
- `analysis/carrier_loaders.ts`;
- `analysis/runtime_gaps.ts`;
- product-materialization replay/archive readers;
- any code path that reconstructs closure or gaps directly from local archive
  files.

Target state:

- product read models consume ABG-admitted projection facts;
- raw archive readers are deleted, moved to ABG, or explicitly diagnostic-only;
- diagnostic-only readers cannot influence traversal, closure, retry, or
  product gate truth.

Completion gate:

- guard or regression rejects archive-scrape-as-authority additions;
- no closure/gap/retry decision path consumes raw archive JSON as authoritative
  input;
- workspace gaps remain a read model over admitted ABG facts.

Audit log:

```text
.ai-workspace/comments/codex/T204_phase_4_archive_projection.md
```

### Phase 5: Register And Ledger Purpose Cleanup

Purpose: every register or ledger has one owner and one lawful purpose.

Targets:

- `operator/plugins/evaluate/content_register.ts`;
- evaluate prompt/admission content-register references;
- analysis loaders and fixtures that treat legacy registers as authority;
- installed-operator traversal/start legacy carriers;
- component/test/design registers whose purpose is unclear after T-204.

Target state:

- SDLC product carriers survive only when they express domain meaning;
- generic runtime ledgers are ABG named ledgers;
- `sdlc_evaluate_content_register` becomes `sdlc_evaluate_content_ledger`
  authority or a legacy projection only.

Completion gate:

- register-purpose audit names owner, authority, producer, consumer, and
  survival reason for each remaining register/ledger;
- no retired register name remains an authority surface;
- semantic tests cover the surviving carrier/ledger boundary.

Audit log:

```text
.ai-workspace/comments/codex/T204_phase_5_register_ledger_purpose.md
```

### Phase 6: Proof Surface And Test Migration

Purpose: make tests reflect the new product boundary.

Targets:

- stale tests importing removed local executor/start helpers;
- tests over `move_to_abg` internals that should become ABG tests;
- live harness continuation logic that still makes local traversal decisions.

Target state:

- traversal/start/retry proof goes through ABG;
- odd_sdlc tests cover domain plugins, carriers, GTL contracts, prompt policy,
  product projections, and release/install surfaces;
- tests for moved infrastructure live with ABG.

Completion gate:

- stale tests are deleted, rewritten as ABG tests, or narrowed to explicit
  product helper tests;
- `npm run build:semantic` passes;
- `npm run lint:semantic` passes;
- focused T-204 gates pass;
- broad suite status is recorded with failures categorized or green.

Audit log:

```text
.ai-workspace/comments/codex/T204_phase_6_test_surface.md
```

### Phase 7: Closure Proof

Purpose: close T-204 only after the product definition is true in code, tests,
and release packaging.

Closure gate:

- clean hello-world live run;
- data-mapper live run or an explicit ratified reason it is not required for
  this ticket closure;
- package guard passes;
- no public or local odd_sdlc command/control truth path remains;
- no raw archive authority path remains;
- no odd_sdlc-owned runtime event, process, retry, closure, or next-action
  system truth remains;
- final audit log and ticket closure section both record exact evidence.

Audit log:

```text
.ai-workspace/comments/codex/T204_phase_7_closure_review.md
```

## 2026-06-21 V3 RC1 Migration Evidence

`odd_sdlc` is being migrated to `3.0.0-rc.1` as the first release candidate over
the T-204 control-boundary break. This is a release migration checkpoint, not
T-204 closure. The substrate pin is `@abiogenesis/typescript-tenant@4.1.0-rc.3`
from:

```text
/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.3/abiogenesis-typescript-tenant-4.1.0-rc.3.tgz
```

The rc3 substrate carries the ABG-owned retry-attempt lever override and
traced-process live-proof substrate. `odd_sdlc` consumes those capabilities
through the ABG substrate contract; it does not regain local start/control
authority for this release.

Validation completed for the migration:

| Check | Result |
| --- | --- |
| `npm run build:semantic` | passed |
| `npm run lint:semantic` | passed |
| `npm run guard:pack-no-command-artifacts` | passed |
| T-028/T-180/T-197/T-203 focused boundary gate | passed, 49/49 |
| T-059 install/release adapter | passed, 11/11 |
| T-192 evaluation-grid prompt contract | passed, 7/7 |
| `npm pack --dry-run --json` | passed; package identity `odd-sdlc-typescript-tenant-3.0.0-rc.1.tgz` |
| T-132 JavaScript hello-world live build loop | passed, 1/1 |

T-132 live run evidence:

```text
build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260621T161811238Z_pid60714
```

Stage timing from the live run:

| Step | Target graph function | Start | End | Duration min.sec | Result |
| --- | --- | --- | --- | ---: | --- |
| 0 | `Fg_conform_project` | `2026-06-21T16:18:19.614Z` | `2026-06-21T16:18:21.529Z` | 0.02 | converged |
| 1 | `derive_lite_design_adr_surface` | `2026-06-21T16:18:21.529Z` | `2026-06-21T16:24:06.132Z` | 5.45 | converged |
| 2 | `derive_lite_component_code_surface` | `2026-06-21T16:24:06.133Z` | `2026-06-21T16:29:53.354Z` | 5.47 | converged |
| 3 | `derive_lite_test_design_surface` | `2026-06-21T16:29:53.355Z` | `2026-06-21T16:33:49.970Z` | 3.57 | converged |
| 4 | `derive_lite_component_test_surface` | `2026-06-21T16:33:49.972Z` | `2026-06-21T16:41:00.150Z` | 7.10 | converged |
| 5 | `derive_lite_uat_test_source_surface` | `2026-06-21T16:41:00.152Z` | `2026-06-21T16:45:28.437Z` | 4.28 | converged |
| 6 | `prepare_test_execution_surface` | `2026-06-21T16:45:28.439Z` | `2026-06-21T16:45:30.528Z` | 0.02 | converged |
| 7 | `derive_test_execution_result_surface` | `2026-06-21T16:45:30.530Z` | `2026-06-21T16:45:32.732Z` | 0.02 | converged |

Prompt consistency notes from the run:

- component-code, component-test, and UAT-test source stages each had a single
  declared product target and no contradictory materialization authority;
- the component-test worker spent extra time on the `.js`/ESM package boundary,
  but the scenario workspace root supplied `"type": "module"` and the generated
  `node --test test/hello.test.js` file passed directly before ABG closure;
- all closure artifacts for the inspected stages reported passed/converged.

## 2026-06-22 Data-Mapper Prompt Projection Review

During the active data-mapper live run, `derive_lite_test_design_surface`
exposed a contradictory test-design transform prompt. The selected
target-carrier contract required a top-level
`sdlc_test_design_surface_target_carrier` envelope, while legacy prompt text
still told the worker not to wrap the fenced register and another directive
described `sdlc_test_design_register` as the top-level kind.

Root cause:

- odd_sdlc prompt policy had two independent test-design carrier truth surfaces:
  the target-carrier projection directive and older register-shaped outcome
  directives;
- the existing semantic conformance gate materialized prompt assets as GTL
  surfaces, but did not review rendered edge prompts for semantic
  contradictions before runtime;
- the failure therefore appeared first as live review-grade pressure instead of
  failing fast during `build:semantic`.

Applied fix:

- collapsed the test-design prompt policy to one selected target-carrier
  envelope instruction;
- updated test-design register admission to require and unwrap the selected
  envelope when the manifest declares target-carrier identity;
- added a semantic prompt projection review to
  `assertCurrentSdlcGtlProgramConformance()` that materializes representative
  handoff prompts and rejects contradictory selected-envelope instructions;
- extended T-172 prompt coverage so the old contradictory phrases are negative
  assertions, not only absent by implication.

Validation:

| Check | Result |
| --- | --- |
| `npm run build:semantic` | passed; includes the new semantic prompt projection review |
| T-172 test-design/prompt carrier suite | passed, 22/22 |
| T-169 target-carrier contract suite | passed, 5/5 |
| `git diff --check` | passed |

T-204 implication: this is a lawful projection-review lane. The compiler is not
type-checking prose directly; it materializes the exact agent-facing prompt
projection from typed graph/manifest inputs and rejects semantic contradictions
before dispatch. This closes the observed prompt contradiction class without
adding a data-mapper-specific workaround.

## 2026-06-22 ABG RC6 Evaluation Retry And Hello-World Proof

This is a stabilization checkpoint over the T-204 split. It does not declare
strict T-204 closure. It proves the current `odd_sdlc` product-client boundary
can complete the hello-world live path while consuming ABG-owned traversal and
retry semantics.

Root cause of the prior hello-world instability:

- `odd_sdlc` correctly classified provider/stream idle evaluator failures as
  retryable same-edge pressure;
- ABG evaluation-set folding still terminalized blocked required
  `EvaluationRuleOutcome` rows before the retry continuation could be consumed;
- the result was a false terminal `gap_stop` on a repairable evaluator/provider
  failure, not a data-mapper-specific defect.

Applied fix:

- ABG `4.1.0-rc.6` adds an evaluation-set retry bridge: blocked required
  evaluation-rule outcomes with admitted `continuationRefs` fold to same-edge
  retry repair; missing continuation refs still fail fast;
- `odd_sdlc` now emits continuation refs for same-edge retry evaluator process
  failures and pins `@abiogenesis/typescript-tenant@4.1.0-rc.6`;
- compact review-grade prompt wording was corrected so the first-blocker
  protocol remains current-edge scoped.

Important boundary note:

- this 2026-06-22 checkpoint originally carried only a narrow semantic
  prompt-projection review inside `build:semantic`;
- that limitation was superseded by the 2026-06-23 semantic compiler expansion
  below, which materializes every graph-derived prompt-bearing projection and
  adds a switched final `F_P.eval` review gate.

Validation:

| Check | Result |
| --- | --- |
| ABI `npm run build:semantic` | passed |
| ABI T-145/T-084/T-152 focused retry/consequence suite | passed, 32/32 |
| ABI `npm run snapshot:release` | passed; produced `4.1.0-rc.6` |
| odd_sdlc `npm run build:semantic` | passed |
| odd_sdlc focused RC6/T-204/T-192/T-197 gate | passed, 118/118 |
| `git diff --check` | passed before live run |
| T-132 JavaScript hello-world live build loop | passed, 1/1 |

T-132 live run evidence:

```text
build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260622T133631077Z_pid89692
```

The run was continued in place and completed without starting a replacement
session.

## 2026-06-23 Semantic Compiler Prompt Construction And F_P Review Gate

This is a T-204 boundary reassertion checkpoint after drift was identified in
local operator-side symptom fixes. The lawful shape is compiler/release gating,
not installed-operator liveness behavior:

1. ABG `typecheckGtlProgram(...)` still owns static graph, overlay,
   traversal-unit, carrier, plugin, and bind conformance.
2. `odd_sdlc` now materializes graph-derived prompt-bearing projections during
   semantic conformance instead of reviewing one representative prompt.
3. Deterministic compiler checks run over every materialized prompt projection.
4. The final `F_P.eval` code-review gate is switch-controlled. Normal
   `build:semantic` remains deterministic; release can set
   `ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL=required`, which fails closed unless
   `ODD_SDLC_SEMANTIC_COMPILER_FP_REVIEW_RESULT` points at an admitted review
   result for the current deterministic package digest.
5. Source-authority regressions that previously appeared during live execution
   are now compiler checks over the active source-identity surfaces. This began
   as an `odd_sdlc` deterministic guard and has been promoted into the ABG GTL
   conformance interface through declared `sourceAuthorityPolicies` rows:
   - design-depth predecessor selection may not scrape `postflight.json` or
     `sdlc_edge_closure_decision.json` as acceptance authority;
   - review-grade current-postflight short-circuiting must exclude retryable
     reentry points before constructing a triage gap;
   - workspace gaps archive reads may survive only as diagnostic/read-model
     input and must not author artifacts, closure/next-action truth, or invoke
     local traversal/start/control;
   - product-materialization lineage and postflight checks must cache
     requirement markers per materialized file instead of repeatedly scanning
     file contents for every obligation/file pairing.

Current compiler materialization counts:

| Surface | Count |
| --- | ---: |
| materialized graph vectors | 125 |
| hook-backed prompt projections | 99 |
| non-prompt graph vectors | 26 |
| prompt asset rows in GTL conformance input | 102 |
| deterministic prompt-review issues | 0 |

The `F_P.eval` result is admitted as
`sdlc_semantic_compiler_fp_review_result` with
`reviewVersion=ts-semantic-compiler-fp-review-result-v1`, matching
`deterministicReportDigest`, `status=passed`, and `findingCount=0`. This gate
does not spawn workers during ordinary semantic builds and does not write
runtime truth. It is a release proof switch over the materialized compiler
package.

Validation:

| Check | Result |
| --- | --- |
| `npm run build:semantic` | passed |
| ABI `npm run build:semantic` | passed |
| ABI T-150 GTL conformance compiler gate | passed, 89/89 |
| T-184/T-192/T-194 compiler/product/prompt gate | passed, 38/38 |
| T-181 design-depth prompt source contract slice | passed, 1/1 |
| `npm run guard:pack-no-command-artifacts` | passed |
| `ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL=required` without review result | failed closed with digest |
| admitted review-result fixture against current digest | passed |

T-204 implication: prompt correctness is now evaluated before runtime at the
compiler boundary across the graph-derived prompt set. This is not a
data-mapper-specific repair and it does not move semantic judgment into `F_D`;
`F_D` constructs and validates the prompt package, while the switched final
`F_P.eval` gate supplies release-time code-review judgment over that materialized
package. The newly added source-authority checks make the same boundary
fail-fast for known T-204 regressions instead of rediscovering them through
hello-world/data-mapper runtime behavior.

ABG compiler implication: `typecheckGtlProgram(...)` now admits and evaluates
`sourceAuthorityPolicies` against `sourceIdentitySurfaces`. The policy rows are
generic compiler inventory, not odd_sdlc-specific ABG code. `odd_sdlc` publishes
five T-204 policy rows in its conformance input so the no-archive-authority,
no-local-control, retryability, read-model, and requirement-marker caching rules
travel with the graph inventory once the refreshed ABG package is consumed.

2026-06-23 update: the switched final `F_P.eval` code-review gate has also been
promoted into ABG compiler inventory. `typecheckGtlProgram(...)` now admits
`semanticReviewGates` and rejects stale or failed semantic compiler reviews:

- the gate subject must match the conformance input subject;
- `deterministicReportDigest` must be a `sha256:` digest;
- the result kind/version must be
  `sdlc_semantic_compiler_fp_review_result` /
  `ts-semantic-compiler-fp-review-result-v1`;
- `status` must be `passed`;
- `findingCount` must be `0`;
- duplicate gate refs fail.

`odd_sdlc` remains the product client that materializes its graph-derived prompt
package and, in release mode, supplies the admitted review row. ABG owns the
admission/check of the semantic review gate.

The data-mapper resume exposed a separate evaluator liveness defect:
`design_depth_fp_evaluator_first_update_timeout`, followed by
`design_depth_fp_evaluator_progress_timeout` after the first attempted repair.
The root cause was prompt projection, not traversal continuation: ABG selected
same-edge retry correctly, but the rendered design-depth evaluator prompt was
not mechanically lawful for the active worker. It first allowed evidence reads
before the first non-draft content-ledger write, then overcorrected into
`Do not Read anything before this Write` even though the pre-created draft
ledger file must be read before the worker tool will overwrite it. The same
prompt also treated an empty/null 12-section liveness packet as semantic
progress, which encouraged hidden full-register synthesis after the first
write.

The fix tightens the prompt contract and compiler gate:

- the only pre-write read is the existing draft content ledger slot, with
  `limit <=80`, solely to satisfy the worker tool read-before-write policy;
- the next tool action writes one non-draft
  `designCompletenessVerdict` fragment with partial axes and explicit reasons;
- construction brief, ADR/output artifact, worker result report, invocation
  package, handoff manifest, and broad authority tables are explicitly
  post-first-write inputs;
- subsequent exploratory reads must be paired with the next write for a named
  register section;
- the semantic compiler now rejects rendered design-depth prompts that forbid
  the required pre-write ledger read or claim empty/null liveness packets are
  semantic progress.

The resumed data-mapper component-test review exposed the same class at the
review-grade boundary: the old loaded prompt allowed final-decision prose such
as "writing the final assessment now" before the durable assessment overwrite.
The source prompt now carries a final-decision output ban, and the semantic
compiler rejects review-grade prompt projections that do not require the next
emitted item to be the `Write` tool call after final status/findings are known.

The continued data-mapper UAT-test source edge exposed another prompt
projection defect. The transform prompt rendered `obligations in scope: 170`
while the same prompt required `worker_result_report.obligationAssessments` to
cover exactly `obligations.inlineObligationIds`, which was 22 for the active
edge. That was not a product-domain conflict: the UAT target carrier lawfully
wraps the component-depth payload. The defect was ambiguous prompt scope
language that blurred broad authority visibility with the active report scope.
The source prompt now renders `authority obligations visible` separately from
`active report scope from inlineObligationIds`, and the semantic compiler
rejects transform prompts that keep the old ambiguous `obligations in scope`
wording without the active report-scope label.

The same edge exposed the corresponding carrier/projection defect after the
retry: the framework-generated `worker_result_report.json` still emitted broad
assessment rows from `manifest.traversalObligationContext.obligations`,
including generated requirement aliases, while the admitted active report scope
was the 22 inline obligations. That made the prompt contract and report carrier
disagree. The handoff manifest now carries `activeReportObligationIds` as
admitted scope truth, and post-transform report projection folds over that
carrier instead of broad traversal authority. The semantic source-authority
gate now rejects report projection code that maps broad
`traversalObligationContext.obligations` without the active report-scope
carrier.

This is intentionally a prompt/projection contract fix, not an
`installed_operator.ts` seed or runtime liveness scaffold.

Validation after the UAT prompt-scope compiler check:

| Check | Result |
| --- | --- |
| odd_sdlc `npm run build:semantic` | passed |
| T-184/T-192/T-194 compiler/product/prompt gate | passed, 39/39 |
| T-141/T-194 report-scope/compiler gate | passed, 18/18 |
| odd_sdlc `git diff --check` | passed |
| ABI `npm run build:semantic` | passed |
| ABI T-150 GTL conformance compiler gate | passed, 89/89 |
| ABI `git diff --check` | passed |

Crash-resume validation after compacting review-grade progress wording:

| Check | Result |
| --- | --- |
| odd_sdlc `npm run build:semantic` | passed |
| T-192 compact prompt contract | passed, 8/8; compact review-grade fixture is 23,993 chars under the 24,000-char bound |
| T-141/T-184/T-192/T-194 focused compiler/prompt/report-scope gate | passed; the combined T-181 file member was canceled after hanging outside the focused slice |
| T-181 design-depth prompt source contract slice | passed, 1/1 |
| odd_sdlc `npm run guard:pack-no-command-artifacts` | passed |
| odd_sdlc `git diff --check` | passed |
| ABI `npm run build:semantic` | passed |
| ABI T-150 GTL conformance compiler gate | passed, 89/89 |
| ABI `git diff --check` | passed |

Stage timing from the live run:

| Step | Target graph function | Start | End | Duration min.sec | Result |
| --- | --- | --- | --- | ---: | --- |
| 0 | `Fg_conform_project` | `2026-06-22T13:36:38.191Z` | `2026-06-22T13:36:39.929Z` | 0.02 | converged |
| 1 | `derive_lite_design_adr_surface` | `2026-06-22T13:36:39.929Z` | `2026-06-22T13:43:02.643Z` | 6.23 | converged |
| 2 | `derive_lite_component_code_surface` | `2026-06-22T13:43:02.643Z` | `2026-06-22T13:49:49.811Z` | 6.47 | converged |
| 3 | `derive_lite_test_design_surface` | `2026-06-22T13:49:49.812Z` | `2026-06-22T13:53:59.224Z` | 4.09 | converged |
| 4 | `derive_lite_component_test_surface` | `2026-06-22T13:53:59.225Z` | `2026-06-22T14:00:19.461Z` | 6.20 | converged |
| 5 | `derive_lite_uat_test_source_surface` | `2026-06-22T14:00:19.463Z` | `2026-06-22T14:04:44.308Z` | 4.25 | converged |
| 6 | `prepare_test_execution_surface` | `2026-06-22T14:04:44.310Z` | `2026-06-22T14:04:46.363Z` | 0.02 | converged |
| 7 | `derive_test_execution_result_surface` | `2026-06-22T14:04:46.365Z` | `2026-06-22T14:04:48.434Z` | 0.02 | converged |

Prompt consistency notes from the run:

- component-test and UAT-test source prompts were compact and bounded to the
  current edge; both had a single declared product test target and one selected
  carrier envelope;
- the component-test worker briefly interpreted the `.js`/ESM package boundary,
  but the live workspace and Node runtime accepted the generated ESM test and
  execution passed downstream;
- review-grade assessments for component-test and UAT-test source passed with
  exact scoped obligation coverage and no closure/status divergence.

## 2026-06-24 Closure Review

Verdict: completed for T-204.

The closeout is a source-inventory and command/control boundary close, not a
claim that every broader product-materialization fixture in the TypeScript
tenant is green.

Current source inventory:

| Surface | Count / status |
| --- | ---: |
| current `build_tenants/typescript/code/src/**/*.ts` files | 175 |
| `gtl_program` | 10 |
| `plugin` | 25 |
| `product_carrier` | 43 |
| `product_projection` | 72 |
| `test_or_release_plumbing` | 25 |
| current `move_to_abg` rows | 0 |
| current `delete` rows | 0 |
| `code/src/cli` files | 0 |
| `code/src/spec_method` files | 0 |
| `code/src/effects` files | 0 |
| `operator/event_store.ts` | absent |

Durable proof surfaces:

- `.ai-workspace/comments/codex/20260620T000000Z_T204_source_survival_inventory.md`
  now classifies every current `code/src` file and records deleted non-current
  rows as closed deletion history.
- `test_t197_product_gtl_gate` parses that inventory and fails if any current
  source file is missing, marked `move_to_abg`, marked `delete`, or carries
  `survival_pending`.
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md`
  now marks A2 done: public command/start surfaces and installed start
  executors are deleted; surviving `start/*` and
  `operator/installed_operator.ts` rows are product projection/plugin-session
  adapters with explicit survival proof.
- `specification/PRODUCT.md` names ABG 4.1.0-rc.7 as the substrate for runtime
  start traversal selection, retry/reentry, continuation projection, GTL
  conformance, source-authority policy rows, and semantic review gates.

Surviving former residue classification:

- `start/*` survives as product start-intent, target-policy, and
  runtime-binding contract projection consumed by ABG runtime binding. It is
  not a package command, local executor, retry loop, or replay controller.
- `operator/installed_operator.ts` survives as an ABG-consumed plugin/session
  adapter. Public start/control exports and installed start executors are gone;
  worker invocation goes through the ABG supervised process actor; source gates
  reject local start/control/reentry/runtime-event authorship.
- `operator/traversal_consequence.ts` survives as SDLC consequence
  candidate/read-model projection over admitted evidence. ABG owns final bind,
  terminal status, runtime transition, replay, and continuation truth.
- `workspace_api/entry.ts` survives as a commandless read-model API. The
  semantic source-authority gate rejects runtime truth authorship and local
  traversal/start/control calls from that surface.
- `analysis/*` survives as product closure-proof/analyzer projection bound by
  REQ-F-ODDSDLC-081 and staged-compute design, not as runtime authority.

Validation:

| Check | Result |
| --- | --- |
| `npm run build:semantic` | passed |
| `npm run lint:semantic` | passed |
| `npm run guard:pack-no-command-artifacts` | passed |
| Focused T-204 boundary gate: `test_t058`, `test_t140`, `test_t180`, `test_t194`, `test_t197`, `test_t203` | passed, 93/93 |
| `git diff --check` | passed |
| `npm run test:semantic` | red before completion; stopped after `test_t066_product_materialization_contract.test.mjs` produced 5 product-materialization fixture failures and the next file was cancelled by interruption |

Broad-suite residual classification:

The five observed broad-suite failures are in
`test_t066_product_materialization_contract.test.mjs`:

- `T-171 current component-test materialization supersedes empty predecessor
  replay` blocked on `staged_authority_missing`;
- `T-102 post-transform observation ignores tenant-declared component-test
  build byproducts` blocked rather than passed;
- `T-184 component-test observation classifies module src/test files as test
  materialization` blocked rather than passed;
- `B-081 test execution preparation carries admitted schedule commands`
  projected `sbt test` where the fixture expected `sbt "coreModel/test"`;
- `T-100 component-test postflight admits materialized tests before execution
  discoverability proof` blocked rather than passed.

These are product-materialization/staged-authority fixture expectations. They
are not evidence of a remaining odd_sdlc public/private command, local
start/control loop, local runtime event author, local replay controller, or
raw-archive command authority. They should be handled under the product
materialization/staged-authority lane, not by reopening T-204.

Data-mapper validation status:

The last T-204 data-mapper evidence remains the recorded resumed run in
`T204_phase_6a_semantic_compiler_prompt_eval.md`: run
`20260622T230124580Z_pid4921` emitted 22 report assessments, review-grade
passed all 22 findings, and the UAT-test source edge closed. The later terminal
block was product execution pressure around Spark/Hadoop
`javax.security.auth.Subject.getSubject`, not a T-204 traversal-control crash.

Closure law check:

- every current `code/src` file is explicitly classified;
- no current source file is classified `move_to_abg`, `delete`, or
  `survival_pending`;
- no public, private, transitional, or test-harness odd_sdlc orchestration CLI
  remains in source, build output, package exports, or package bin metadata;
- product/design text names ABG as command/control/runtime owner;
- product gates prove no remaining SDLC source owns traversal authority outside
  GTL declarations and ABG-consumed plugins.

## 2026-06-24 Carrier-Closure Compiler Lane

The post-closure Data Mapper release proof exposed the recurring pattern behind
the late T-204 fixes: live runs were discovering undefined cells between
materialized F_P carrier output, evaluator admission, postflight status, and
edge closure projection.

The 3.0.15 Data Mapper release proof at
`build_tenants/typescript/test_env/test_runs/data_mapper_v3_0_15_release_proof/20260624T115332321Z_pid80438`
did not close Data Mapper. It did prove the 3.0.15 framework fix: the previous
`closure_decision_missing` failure became a typed blocked closure. The run
materialized `design_depth_fp_evaluator_rule_outcome.json`,
`design_depth_fp_evaluator_postflight.json`, `fp_evaluate_result.json`,
`postflight.json`, `sdlc_edge_closure_decision.json`,
`sdlc_edge_fulfillment_ledger.json`, and `sdlc_edge_residual_pressure.json`.
The closure disposition was `block`; the fulfillment ledger counted
`expected=153`, `fulfilled=13`, `missing=140`; residual pressure remained
non-clear with 144 required refs. The design-depth F_P content ledger was
structurally full at 12 rows but semantically shallow: zero
`moduleSchemaFragments`, zero `moduleStateDiagramFragments`, zero aggregate
domain entities/operations, zero sunny-day steps, and partial
`designCompletenessVerdict` axes.

3.0.16 adds a deterministic semantic compiler lane over that class:

- it synthesizes a structurally valid but semantically shallow design-depth F_P
  evaluate content ledger and requires real materialization/admission to reject
  it at the semantic floor;
- it rejects source regressions where blocked design-depth F_P evaluator
  outcomes fail to publish dispatch state and therefore fail to materialize
  closure artifacts;
- it rejects F_P close-proposed evaluations that emit continuation refs.

This keeps the check at the compiler boundary: no Data Mapper worker is spawned
during `build:semantic`, but release preflight now fails if the
materialization -> F_P.eval -> postflight -> closure chain admits the known
shallow-carrier or missing-closure patterns again.
