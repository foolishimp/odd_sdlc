---
id: T-120
title: Realize retry-local repair prompts from typed gap dossiers
type: feature
ticket_category: lawful_retry_repair
status: active
review_status: active_runtime_reentry_authority_split_blocks_closure
goal: typescript-rc-live-lane-retry-quality
build_tenant: typescript
owner: unassigned
change_intent: Make ABG-visible retry/reentry prompts consume typed postflight gap dossiers and accepted carrier schemas so retry attempts repair the exact rejected surface instead of regenerating broadly.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: ABG-visible retry/reentry frontier, worker_prompt.md, component_depth_register admission, assurance postflight, installed runtime repair continuation, Spec Method entrypoint non-ownership, live data-mapper same-edge and graph-span retries
priority: high
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-07
governance_scope: STDO Method
depends_on:
  - T-101 honor retry-eligible worker report rejection in autonomous start loop
  - T-113 restore test35 production depth through component graph functions
  - T-115 ABG-prime execution failure to component repair flow
intake_source: T-109 data-mapper PTY live run reached derive_implementation_component_topology_surface and produced a retry-eligible typed postflight blocker: component_depth_register_invalid:component_depth_register.bindingId: unexpected field. The retry frontier was lawful, but retry quality depends on feeding the exact parser error and accepted carrier shape back into the worker.
target_truth: A retry-eligible postflight gap produces an ABG-visible retry/reentry repair prompt containing the rejected artifact ref, exact typed error, accepted carrier schema, non-closure rule, and instruction to minimally repair the selected repair edge. The retry does not ask for a fresh broad regeneration unless the gap dossier says the output is unrecoverable.
superseded_truth: Same-edge retries receive generic prior gap context and rely on the worker to infer the accepted carrier shape.
closure_law: This ticket closes only when typed retry evidence is projected through installed-runtime/ABG-visible reentry truth into the worker prompt as lawful repair input, deterministic tests show broad regeneration is not required for schema-local carrier fixes, and neither the Spec Method entrypoint nor the process launcher owns retry iteration or context synthesis.
evaluation_criteria:
  - retry prompt includes exact postflight reason and reason class
  - retry prompt includes accepted carrier field set or schema ref for the rejected carrier
  - retry prompt identifies rejected artifact and report refs
  - retry prompt says whether the repair is schema-local, semantic-local, or broad regeneration
  - component_depth_register unexpected-field failure repairs by removing or mapping the invalid field, not by rewriting unrelated surfaces
  - retry remains governed by ABG/odd_sdlc postflight truth and does not loop externally
proof_surface:
  - deterministic retry fixture for unexpected field on component_depth_register
  - negative fixture where retry prompt omits accepted schema and test fails
  - live data-mapper replay or rerun showing retry-local repair prompt on a component topology blocker
non_closure_conditions:
  - retry prompt only says "try again"
  - retry prompt requires human-authored external loop logic
  - Spec Method entrypoint or process launcher owns retry iteration, retry
    budget, retry context synthesis, or repair edge selection
  - retry repair bypasses F_P/F_D postflight
  - accepted schema is embedded as stale prose with no typed source ref or generated field list
---

## Runtime Reentry Review - 2026-05-07

T-120 remains active. The 2026-05-06 CLI-loop implementation is not accepted as
the self-healing solution.

Finding:

- `cli/command.ts` owns bounded retry iteration and synthesizes
  `SdlcWorkerRetryContext` overrides.
- `repair_worker_output` can appear in a typed gap dossier without becoming an
  installed-runtime repair continuation.
- retry-local prompt packaging is useful, but it is not lawful closure when the
  adapter decides whether to retry and manufactures the next retry context.

Corrected design:

```text
postflight gap dossier
  -> ABG/installed-runtime-visible retry or repair reentry plan
  -> selected same-edge or graph-span repair edge
  -> worker handoff with typed retryRepairInstructions
  -> F_P/F_D readmission
  -> projection
  -> Spec Method result projection
```

The Spec Method entrypoint may request `start` and project the returned result.
It must not own the self-healing loop, retry budget, retry context synthesis, or
repair edge selection.

## Spec Method Entrypoint Correction - 2026-05-07

Status: active, pending operator review of test results.

The command authority was strengthened from "CLI adapter non-ownership" to
"Spec Method entrypoint only, no shim." The old `cli/command.ts` surface has
been removed so future sessions do not treat CLI as a place to accumulate
business logic.

Changed surfaces:

- `specification/PRODUCT.md`
- `specification/requirements/08-odd-sdlc-first-slice.md`
- `specification/requirements/13-odd-sdlc-typescript-tenant.md`
- `specification/requirements/14-odd-sdlc-installed-product-contract.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SPEC_METHOD_ENTRYPOINT.md`
- `build_tenants/typescript/code/src/spec_method/entry.ts`
- `build_tenants/typescript/code/src/operator/installed_operator.ts`
- `build_tenants/typescript/code/src/cli/main.ts`

Realization result:

- `cli/command.ts` and `cli/index.ts` are removed.
- `spec_method/entry.ts` admits method command intent and projects results.
- `cli/main.ts` is only a process launcher over the Spec Method entrypoint.
- installed retry/reentry attempt control and retry context synthesis moved to
  `operator/installed_operator.ts` through
  `executeInstalledOperatorStartWithReentry`.
- `repair_worker_output` no longer falls through to the generic
  `inspect_worker_archive` next action; it projects
  `plan_repair_reentry_with_gap_dossier` for the B-085 graph-span repair work.

Verification run for operator review:

- `npm run build:semantic` passed.
- `node --test test_env/tests/test_t058_spec_method_entrypoint.test.mjs test_env/tests/test_t120_retry_local_repair_prompt.test.mjs test_env/tests/test_t064_installed_operator_ux.test.mjs` passed: 21/21.
- `npm run test:t059` passed: 6/6.

This checkpoint does not close T-120. Remaining closure still requires the live
data_mapper retry/reentry proof and user review of these test results.

For B-085, `component_repair_row_open:*` must become a typed repair reentry plan
that targets `derive_component_test_surface` when the admitted repair row targets
`component_test`. The worker prompt must receive the repair row, file path,
scalac diagnostics/evidence refs, accepted carrier shape, and no-broad-
regeneration rule as authority-bearing package data.

## Self-Healing Loop Update - 2026-05-06

The live T-109 regression showed that same-edge postflight gaps were still too
easy to treat as terminal test failures. That violated the installed operator
loop contract: a retry-eligible gap is allowed to expose non-alignment, but it
must re-enter a bounded self-healing loop before the operator reports a real
stop.

Historical implementation checkpoint:

- `start` now wraps installed operator execution in a bounded retry-visible
  loop. When an outcome carries `gapDossier.retryEligible: true` and
  `retry_same_edge`/`retry_same_edge_with_gap_dossier`, the command rereads ABG
  runtime events, reprojects the same start basis, and re-enters the edge
  automatically. The result payload carries `loop.kind:
  sdlc_installed_operator_start_loop`, attempt summaries, and terminal reason.
- Operator summary projection now reports
  `nextLawfulAction: retry_same_edge_with_gap_dossier` whenever admitted gap
  truth is retry-visible, even if the low-level emitted event set did not
  previously drive that summary field.
- The installed start loop now carries the just-observed postflight gap dossier
  into the next same-edge handoff as a `SdlcWorkerRetryContext` override when
  ABG did not emit a `retry_repair_planned` ref for the plugin postflight gap.
	  The installed operator merges that override with ABG-projected retry refs
	  before deriving `worker_invocation_package.json`.
- Design-depth retry repair instructions now include the full nested accepted
  `schema://odd_sdlc/design_depth_register` field set for both strict carrier
  parse failures and semantic-local design carrier failures such as
  `design_attribute_missing:*`.
- The design-depth normalizer now admits the live shorthand
  `{ "attributeId": "...", "type": "..." }` by deriving `name` from
  `attributeId` and mapping `type` to `valueType` before strict closed-record
  admission.

Live evidence:

- Fresh T-109 live run:
  `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260506T123737175Z_pid5086`.
- The run passed the old `derive_implementation_module_surface` blocker and
  advanced to `derive_aggregate_domain_model_surface`.
- It then produced a retry-visible design-depth gap:
  `design_depth_register_invalid:design_depth_register.aggregateDomainModel.includedModuleNames: unexpected field`.
- The installed command executed four same-edge attempts and returned
  `loop.terminalReason: retry_guard_exhausted`, proving the bounded
  self-healing loop was active.
- Forensics on the retry attempt showed the remaining defect:
  `worker_invocation_package.json` had empty `retryRepairInstructions` because
  plugin postflight gaps were visible to the CLI outcome as `gapDossier` truth
  but were not entering the next handoff's `retryContext`.
- That defect was patched by the retry-context override described above, but
  that override is now classified as transitional adapter-owned retry context,
  not closure proof for lawful installed-runtime reentry.
- Earlier live T-109 run:
  `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260506T120347174Z_pid96202`.
- The run passed through `select_implementation_stack_profile` and reached the
  prior failure edge `derive_implementation_module_surface`.
- The prior `unexpected field` failure did not recur. The first failing
  attempt instead produced typed semantic design-depth pressure:
  `design_attribute_missing:*`.
- The installed command did not stop at the first gap. It executed four
  same-edge attempts and returned a loop payload with
  `terminalReason: retry_guard_exhausted`, proving the self-healing loop was
  active.
- That run used an installed package created before the final
  `design_attribute_missing:*` accepted-carrier mapping was added, so it is not
  closure proof for fresh live repair success.

Review correction: the retry-prompt package work remains useful, but the
CLI-owned loop and CLI-synthesized retry context are now classified as the
authority defect this ticket must remove or relocate behind the installed
runtime/ABG-visible reentry boundary.

Current non-closure reason:

T-120 remains active until installed-runtime/ABG-visible reentry, not CLI retry
context override, produces a non-empty `retryRepairInstructions` package for a
real same-edge or graph-span design/component-depth gap and either advances the
edge or stops on a new typed gap after consuming that repair instruction.

## Build Verification - 2026-05-06

The T-120 non-live implementation is built and full-suite verified. The ticket
remains active because a live retry-local prompt with non-empty repair
instructions has not been proven on a real data_mapper retry after the
retry-context override.

Regression correction:

- `abg.traversal_strategy` is now the GTL vector qualifier consumed by ABG.
- odd_sdlc publishes per-edge strategy refs that mostly match T-123 policy:
  induction and normal execution-result edges stay full breadth, construction
  edges use steel-thread scope. The 2026-05-07 T-123 review supersedes the
  retry-context clause: targeted repair must enter through ABG-visible reentry
  truth or be used only when ABG provides no selected strategy.
- ABG strategy profiles include `atomic_attempt`, preserving ABG retry
  continuation instead of turning every modulated attempt into a bounded
  single-shot stop.
- repeated zero-output hard timeouts are counted as prior silent attempts even
  when their typed code is `worker_hard_timeout`, so B-080 retries once with a
  targeted shard and then stops as `triage_gap` on repeated silence.

Passed:

- focused retry/traversal group:
  `node --test test_env/tests/test_t076_deterministic_traversal_state_machine.test.mjs test_env/tests/test_t101_retry_report_rejection_loop.test.mjs test_env/tests/test_t030_graph_catalog_module.test.mjs test_env/tests/test_t064_installed_operator_ux.test.mjs test_env/tests/test_t123_per_edge_traversal_strategy.test.mjs`
  passed: 24/24.
- focused B-080 repeated-silence recovery:
  `node --test --test-name-pattern "B-080 silent execution-result recovery carries shard identity" test_env/tests/test_t066_product_materialization_contract.test.mjs`
  passed: 1/1.
- `npm run lint:semantic` passed.
- `npm run test:semantic` passed: 220/220.
- `npm run test:sandbox` passed: 15/15.

Live check:

- `ODD_SDLC_TS_T109_DATA_MAPPER_LIVE=1 node --test --test-concurrency=1
  test_env/live/test_t109_live_installed_data_mapper_pty.test.mjs` failed after
  proving same-edge retry loop execution on
  `derive_aggregate_domain_model_surface` and exposing the now-patched empty
  retry-context handoff; see the live evidence section above.

# T-120: Retry-Local Repair Prompts

## STDO Triage

The missing layer is realization prompt construction over admitted gap truth.
ABG owns continuation and retry frontier truth. odd_sdlc owns the
software-domain worker prompt that turns a typed postflight blocker into a
bounded repair attempt.

This is the lawful in-ABG loopback the user asked for: no external loop, no
ambient prompt folklore, and no broad regeneration when the gap is a local
carrier mismatch.

## STDO Solution

### Smallest Lawful Re-Entry

`realization_refactor` at `realization`.

No requirement or product truth needs repricing. ABG already owns the retry
frontier and postflight gap dossier truth. The missing odd_sdlc layer is the
worker-facing realization package that turns admitted retry truth into bounded
repair instructions.

### Solution Shape

The solution is to project retry-local repair law from typed postflight gap
dossiers into the worker invocation package, then make the prompt consume that
package as normal worker-facing authority.

The worker must not infer repair scope from prose or from a large historical
manifest. The framework derives a `sdlc_worker_retry_repair_instruction` for
each prior gap reason and carries:

- `repairScope`: `schema_local`, `semantic_local`, or `broad_regeneration`
- `gapDossierRef`
- exact `reason`
- exact `reasonClass`
- `blockingReasonCode`
- `blockingReasonDetail`
- rejected artifact and evidence refs
- `acceptedCarrierSchemaRef`
- `acceptedCarrierFieldSet`
- non-closure rules

For the motivating failure
`component_depth_register_invalid:component_depth_register.bindingId:
unexpected field`, the repair scope is `schema_local`. The accepted carrier is
`schema://odd_sdlc/component_depth_register`, with the generated component-depth
field set. The worker must repair the same rejected edge artifact by removing,
renaming, or mapping the invalid field into the accepted carrier shape. It must
not regenerate unrelated surfaces or decide closure.

For execution-evidence retry gaps, the same mechanism points at
`schema://odd_sdlc/test_execution_evidence` and carries the accepted JSON field
set, including shard evidence fields. This prevents YAML or narrative execution
evidence from being treated as retry repair.

### Carrier Flow

1. Postflight blocks an edge and emits a typed `sdlc_postflight_gap_dossier`.
2. ABG/installed-runtime replay projects the next retry or repair reentry
   context from the dossier. The CLI does not synthesize it.
3. `constructWorkerInvocationPackage` derives a compact
   `sdlc_worker_invocation_package`.
4. `retryRepairInstructionsForContext` maps each prior gap reason to a typed
   retry repair instruction with accepted carrier schema and field set.
5. `writeHandoffFiles` writes `worker_invocation_package.json` beside the full
   forensic handoff manifest and traversal intent package.
6. `promptForHandoff` tells the worker to read the compact invocation package
   first and treat non-empty `retryRepairInstructions` as retry-local repair
   law.
7. After the worker writes the bounded transform artifact, ABG/odd_sdlc
   postflight re-admits and re-evaluates the carrier. Worker process success,
   markdown prose, or a self-report never closes the edge by itself.

### Implementation Surfaces

- `build_tenants/typescript/code/src/operator/carriers.ts`
  defines `SdlcWorkerRetryRepairInstruction`,
  `SdlcComponentRepairReentryPlan`,
  `SdlcWorkerInvocationRetryFrontier`, and
  `SdlcWorkerInvocationPackage`.
- `build_tenants/typescript/code/src/operator/handoff.ts` derives accepted
  carrier schema refs and field sets, constructs retry repair instructions,
  derives canonical `repairReentryPlans` for
  `component_repair_row_open:*`, writes `worker_invocation_package.json`, and
  projects the prompt rule that non-empty `retryRepairInstructions` are
  retry-local repair law.
- `build_tenants/typescript/test_env/tests/test_t120_retry_local_repair_prompt.test.mjs`
  proves the component-depth invalid-field case, fails closed when schema
  fields are omitted, proves execution-evidence retries carry the accepted
  JSON carrier schema, proves repair-schedule semantic retry law, and proves
  the B-085 `DiagnosticsFinalizeSpec.scala` repair-row path targets
  `derive_component_test_surface`.

### 2026-05-07 B-085 Repair-Reentry Extension

`component_repair_row_open:*` now produces a typed component repair reentry plan
inside `worker_invocation_package.json`.

The canonical plan surface is `repairReentryPlans[]`. Retry instructions carry
only `repairReentryPlanId` so the package does not preserve two row truths.

The B-085 fixture proves:

- source gap: `derive_release_depth_parity_surface`
- reentry target: `derive_component_test_surface`
- target asset: `component_test_surface`
- repair target: `component_test`
- implicated test file:
  `DiagnosticsFinalizeSpec.scala`
- diagnostic excerpt includes:
  `type mismatch` and `Cannot prove that Int <:< AnyRef`
- accepted carrier:
  `schema://odd_sdlc/component_depth_register`
- no-broad-regeneration rule is present

Focused verification:

- `npm run build:semantic`
- `node --test test_env/tests/test_t120_retry_local_repair_prompt.test.mjs test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs`
  -> 16/16 passed

### Closure Path

Deterministic proof is sufficient for the realization slice but not for ticket
closure.

This ticket closes only after a live data_mapper retry produces a
`worker_invocation_package.json` with non-empty `retryRepairInstructions`, the
worker consumes those instructions in the next prompt, and the lane either
advances past the rejected carrier or blocks on a new typed postflight gap.

The live proof should archive:

- the prior `sdlc_postflight_gap_dossier`
- the retry `worker_invocation_package.json`
- the retry `worker_prompt.md`
- the repaired transform artifact
- the postflight result after retry

### Non-Solution

The solution is not:

- creating a new ticket for every retry attempt
- letting tickets carry runtime retry truth
- adding an external or CLI-owned retry loop around ABG
- treating `repair_worker_output` as prompt prose without an ABG-visible repair
  reentry plan
- asking the worker to read the full handoff manifest as the normal first
  repair surface
- broad regeneration when the gap dossier names a schema-local carrier defect
- accepting worker prose, process success, or report shape as closure authority
