---
id: T-189
title: Close T-188 runtime-authority bug ledger and ABG handoff
type: bug
ticket_category: implementation_migration
status: completed
proof_status: passed
build_tenant: typescript
owner: odd_sdlc
created_at: 2026-06-02
updated_at: 2026-06-02
triaged_at: 2026-06-02
priority: high
change_class: realization_refactor
re_entry_point: realization
governance_scope: STDO Method
goal: close out every SDLC-owned and ABG-shaped framework bug surfaced during the T-188 data_mapper-lite live proof without hiding shared runtime-law debt inside odd_sdlc adapter code
source_documents:
  - specification/INTENT.md
  - specification/PRODUCT.md
  - specification/GOALS.md
  - .ai-workspace/tickets/active/T-188-force-fp-depth-through-iteration-and-prompt-control.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-147-realize-t188-runtime-authority-invariants-in-abg.md
related_tickets:
  - .ai-workspace/tickets/active/T-188-force-fp-depth-through-iteration-and-prompt-control.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-147-realize-t188-runtime-authority-invariants-in-abg.md
affected_boundary:
  local_runtime:
    - build_tenants/typescript/code/src/operator/installed_operator.ts
    - build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts
    - build_tenants/typescript/code/src/operator/component_depth_register.ts
    - build_tenants/typescript/code/src/operator/transport.ts
    - build_tenants/typescript/code/src/workspace/project_profile.ts
  tests:
    - build_tenants/typescript/test_env/tests/test_b070_claude_worker_argv.test.mjs
    - build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs
    - build_tenants/typescript/test_env/tests/test_t087_project_induction.test.mjs
    - build_tenants/typescript/test_env/tests/test_t113_component_depth_register_admission.test.mjs
    - build_tenants/typescript/test_env/tests/test_t120_retry_local_repair_prompt.test.mjs
    - build_tenants/typescript/test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs
    - build_tenants/typescript/test_env/tests/test_t188_data_mapper_lite_fixture.test.mjs
    - build_tenants/typescript/test_env/tests/test_t188_fp_depth_iteration_closure.test.mjs
  proof:
    - build_tenants/typescript/test_env/test_runs/t188_data_mapper_lite_lifecycle_live/20260601T133648251Z_pid66015
target_truth: T-188 live proof bugs are recorded as explicit system defects with owner, fix status, proof surface, and upstream/shared-law disposition. odd_sdlc may keep product-specific adapter realization, but any generic ABG runtime invariant remains tracked against ABG until the shared runtime law either adopts it or rejects it as product-specific.
superseded_truth: T-188 can close because the live lane reached final close while the bug fixes remain spread across code diffs, chat context, and implicit memory, or because ABG-shaped fixes in odd_sdlc are treated as permanently local without explicit upstream disposition.
closure_law: This ticket closes only when the T-188 bug ledger is durable, every fixed item has a focused regression or explicit accepted proof gap, every ABG-shaped item is either linked to ABG T-147 or classified as SDLC-only with reason, and T-188 closure text cites the live data_mapper-lite proof without claiming unresolved shared ABG law is closed.
non_closure_conditions:
  - an ABG/runtime/replay/projection fix remains only in odd_sdlc source with no upstream ABG disposition
  - a T-188 live-run framework bug is known only from chat or terminal history
  - generated data_mapper-lite product-code fixes are counted as SDLC framework fixes
  - stack-specific product facts are added to SDLC core instead of coming from tenant design/spec artifacts
  - T-188 is closed without a durable bug ledger and proof mapping
---

# T-189: Close T-188 Runtime-Authority Bug Ledger And ABG Handoff

## Intake

The T-188 data_mapper-lite live proof reached final close in sandbox:

`build_tenants/typescript/test_env/test_runs/t188_data_mapper_lite_lifecycle_live/20260601T133648251Z_pid66015`

Final observed state:

- final archive: `.ai-workspace/runtime/odd_sdlc/operator-runs/20260601T191101732Z_pid13926`
- final next action: `disposition://close`
- final residual pressure: clear
- final closure decision: `close`
- test execution evidence: `testsObserved=2`, `passedCount=2`, `failedCount=0`
- component repair schedule: `scheduleStatus=no_repair_required`

The run also exposed a cluster of framework bugs. Some are SDLC product-adapter
bugs. Some are ABG-shaped runtime-law bugs that were patched locally because
the active proof needed to continue, but they should not disappear as local
odd_sdlc precedent.

## Bug Ledger

### SDLC-owned fixed bugs

1. **Worker tool boundary blocked lawful artifact discovery**
   - classification: SDLC framework / worker-boundary bug
   - observed in: `derive_component_repair_schedule_surface`
   - defect: non-shell planning workers had `Read,Write,Edit` only, so they
     could not discover admitted artifacts without Bash/Grep.
   - fixed in: `installed_operator.ts`, `test_b070_claude_worker_argv.test.mjs`
   - target proof: focused argv regression plus T-188 live proof.

2. **Component-depth target carrier prompt and admission shape drift**
   - classification: SDLC framework / carrier-shape bug
   - defect: component-test and component-depth downstream carriers had prompt
     and schema mismatches, including invalid copied topology rows and noisy
     target-envelope parse failures.
   - fixed in: `component_depth_register.ts`,
     `plugins/transform/launch_contract.ts`,
     `test_t113_component_depth_register_admission.test.mjs`,
     `test_t120_retry_local_repair_prompt.test.mjs`
   - target proof: focused component-depth tests plus T-188 live proof.

3. **Project bootstrap admitted runtime/control/archive paths as project truth**
   - classification: SDLC framework / bootstrap authority bug
   - defect: project profile/bootstrap context could carry runtime archive or
     control paths into the worker's project authority surface.
   - fixed in: `workspace/project_profile.ts`,
     `test_t087_project_induction.test.mjs`
   - target proof: focused induction regression.

4. **Review/obligation role filtering leaked downstream obligations**
   - classification: SDLC prompt/admission bug
   - defect: component-code obligations could include downstream test-role
     pressure at the wrong edge.
   - fixed in: `plugins/transform/launch_contract.ts`,
     `test_t188_data_mapper_lite_fixture.test.mjs`
   - target proof: T-188 fixture/regression.

### ABG-shaped bugs handed upstream and carried forward through RC6

5. **Retry gap propagation used stale or weak context**
   - classification: ABG/GTL/runtime bug fixed in SDLC adapter
   - defect: retry context could omit the current review-grade gap dossier or
     prefer a stale projected context over a newer real same-edge gap.
   - local fix: `installed_operator.ts`,
     `test_t140_no_local_forced_iteration_authority.test.mjs`
   - upstream owner: ABG T-147.
   - ABG disposition: runtime wiring landed. ABG now publishes
     replay-derived `EnginePluginInput.retryContext` and rejects stale supplied
     retry frontiers in attached/no-artifact retry decisions.
   - SDLC result: odd_sdlc consumes `EnginePluginInput.retryContext` as ABG
     runtime truth. Local retry/gap code is worker-facing SDLC domain mapping
     over the ABG projection.

6. **No-dispatch projection was not written before closure checks**
   - classification: ABG projection/admission ordering bug fixed in SDLC adapter
   - defect: no-dispatch/system-projection edges could close against missing or
     stale declared edge projection output.
   - local fix: `installed_operator.ts`,
     `test_t066_product_materialization_contract.test.mjs`
   - upstream owner: ABG T-147.
   - ABG disposition: runtime wiring landed. Accepted attached F_P results now
     emit selected target-carrier `payload_observed` and `payload_validated`
     events before assurance fold and traversal transition, and ABG internal
     closure blocks when selected output authority is missing.
   - SDLC result: odd_sdlc is installed against ABG 3.9.0-rc.6 and relies on
     ABG output-admission ordering for generic closure law. The remaining
     declared-output writer is SDLC product projection realization.

7. **Prior source-asset authority projected report refs without admitted output artifacts**
   - classification: ABG-adjacent source-asset projection bug fixed in SDLC adapter
   - defect: downstream workers saw prior worker reports but not the actual
     admitted output artifact, causing a false missing-source gap for
     `test_execution_result_surface`.
   - local fix: `plugins/transform/launch_contract.ts`,
     `test_t066_product_materialization_contract.test.mjs`
   - upstream owner: ABG T-147.
   - ABG disposition: runtime wiring landed. ABG now publishes
     replay-derived `EnginePluginInput.outputAuthorityProjections` for current
     and closed vectors.
   - SDLC result: source-asset obligations map SDLC vocabulary over ABG
     `outputAuthorityProjections`, carrying admitted payload, validation,
     authority, and projection refs into source-asset evidence.

## Required Work

1. Update T-188 with the durable bug ledger and final live proof reference.
2. Confirm every fixed local item has focused regression coverage.
3. Cross-link ABG T-147 from T-188 and this ticket.
4. Decide which local code paths are permanent SDLC product-adapter law and
   which should be deleted or simplified after ABG publishes shared runtime
   primitives.
   - T-147 is now helper-plus-runtime wiring, not helper-only. This decision
     should be made against an installed ABG package that includes
     `EnginePluginInput.retryContext`,
     `EnginePluginInput.outputAuthorityProjections`, target-carrier output
     payload admission, and the output-authority closure block.
   - 2026-06-02 status: odd_sdlc TypeScript now pins
     `@abiogenesis/typescript-tenant@3.9.0-rc.6`, the RC containing T-147
     runtime wiring. Focused substrate proof passed through T-028/T-059/T-180
     after the install.
   - 2026-06-02 implementation slice: carry T-147 forward by consuming
     `EnginePluginInput.retryContext` for worker retry context projection and
     `EnginePluginInput.outputAuthorityProjections` for SDLC source-asset
     authority refs. Local retry/gap and source-asset logic remains only
     worker-facing SDLC domain mapping over ABG-admitted facts.
5. Run the focused test set:

```bash
npm run build:semantic
node --test test_env/tests/test_b070_claude_worker_argv.test.mjs
node --test test_env/tests/test_t066_product_materialization_contract.test.mjs
node --test test_env/tests/test_t087_project_induction.test.mjs
node --test test_env/tests/test_t113_component_depth_register_admission.test.mjs
node --test test_env/tests/test_t120_retry_local_repair_prompt.test.mjs
node --test test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs
node --test test_env/tests/test_t188_data_mapper_lite_fixture.test.mjs test_env/tests/test_t188_fp_depth_iteration_closure.test.mjs
```

6. Re-run or cite the completed T-188 data_mapper-lite proof archive.

## Implementation Result

Completed on 2026-06-02.

- Moved odd_sdlc to ABG `@abiogenesis/typescript-tenant@3.9.0-rc.6`.
- Replaced dispatch retry context projection from raw retry-attempt refs with
  `sdlcWorkerRetryContextFromAbgRetryContext(pluginInput.retryContext)`.
- Passed `pluginInput.outputAuthorityProjections` into worker handoff manifest
  derivation.
- Added SDLC source-asset mapping over admitted ABG
  `AdmittedOutputAuthorityProjection` rows.
- Widened traversal obligation authority refs so non-file ABG authority refs
  are preserved, while `authorityIndex` remains file/readable-ref derived.
- Updated T-188 with the durable T-189 bug ledger, ABG T-147 link, final
  data_mapper-lite proof archive, and focused proof result.
- ABG enforcement provenance is T-147's own TypeScript proof:
  `test_t147_runtime_authority_invariants.test.mjs` plus the T-147 focused
  suite. T-189 proves odd_sdlc consumes the published RC6 surfaces, not that
  ABG re-enforces them locally.

Proof run:

```bash
npm run build:semantic
node --test test_env/tests/test_t180_abg_3_9_current_staged_compute_boundary.test.mjs test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs
node --test test_env/tests/test_b070_claude_worker_argv.test.mjs test_env/tests/test_t087_project_induction.test.mjs test_env/tests/test_t113_component_depth_register_admission.test.mjs test_env/tests/test_t120_retry_local_repair_prompt.test.mjs test_env/tests/test_t188_data_mapper_lite_fixture.test.mjs test_env/tests/test_t188_fp_depth_iteration_closure.test.mjs
git diff --check
```

Result:

- `build:semantic`: passed.
- T-066/T-140/T-180 focused pack: passed, 102/102.
- T-189 listed regression pack: passed, 58/58.
- `git diff --check`: clean.

Review hardening after closure review:

- Added negative retry-seam proof: non-fresh ABG retry context or a retry
  frontier with rows but no selected rows fails closed in the SDLC adapter,
  while an actually empty frontier remains an empty retry context.
- Added negative output-authority proof: an empty ABG
  `outputAuthorityProjections` set cannot masquerade as admitted source-asset
  authority and still yields `source_asset_dependency_missing` in postflight.
- Review hardening proof: T-066/T-140/T-180 focused pack passed, 102/102;
  listed regression pack passed, 58/58; `git diff --check` clean.

## Acceptance Criteria

- The T-188 ticket has a current bug ledger and final proof section.
- Every SDLC-owned fixed bug above has a deterministic regression or explicit
  accepted proof gap.
- Every ABG-shaped bug above links to ABG T-147 and identifies the ABG runtime
  surface SDLC must consume.
- T-189 does not close until odd_sdlc is installed against an ABG package
  containing the T-147 runtime wiring and focused proof confirms the SDLC
  adapter consumes the RC6 retry and output-authority plugin input surfaces.
- No generated data_mapper-lite product-code repair is counted as an SDLC or
  ABG framework bug.
- `git diff --check` is clean.
- T-188 closure, when claimed, distinguishes local product-adapter closure from
  upstream ABG shared-law closure.
