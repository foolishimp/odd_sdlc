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
      - verify whether deletion is possible once callers migrate.
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
- [ ] decision: delete `cli/main.ts`, move it to harness, or keep only as
      non-public transitional plumbing with no traversal imports.

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
| `ticket-intake` | `createSdlcTerminalGapTicketsFromOperatorRun(...)` | `temporary_blocker` | Review whether it is product ticket API or archive-analysis drift. |
| `gaps` | `gapsPayload(...)` | `odd_sdlc library API` plus ABG presentation | Must remain read-only; no traversal selection. |
| `start` | `installedStartPayloadFor(...)` | `ABG CLI` | Migration target; no SDLC CLI command law. |
| `install` | `installOddSdlcTypescript(...)` | `package/release API` | May survive as product installer API, not traversal command. |
| `release-cut` | `deriveOddSdlcTypescriptReleaseCut(...)` | `package/release API` | Review command binding proof dependency. |
| `release-snapshot` | `deriveOddSdlcTypescriptReleaseSnapshot(...)` | `package/release API` | Review command binding proof dependency. |
| `rc-report` | `describeOddSdlcTypescriptRcQualification()` | `product_projection` | Read-only proof projection. |
| `analyze-run` | `analyzeRunPayload(...)` | `temporary_blocker` or `move_to_abg` | Generic archive analysis likely ABG-owned. |

Phase output:

- [ ] completed command classification table.
- [ ] option classification table.
- [ ] list of command helpers that must become library functions, ABG calls,
      or disappear.

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
      file, current call, command class, replacement API/ABG call,
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
      - reject tests that prove `start` by private SDLC command helpers when
        the target owner is ABG.

Initial expected proof lanes after implementation begins:

- [ ] focused source-classification/product-gate tests.
- [ ] affected command/caller migration tests.
- [ ] affected scenario/sandbox tests.
- [ ] `npm run test:semantic`.
- [ ] Rust hello live proof through ABG-owned start/traversal invocation, or a
      recorded non-closure with ABG-side/product-side blocker evidence.

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
