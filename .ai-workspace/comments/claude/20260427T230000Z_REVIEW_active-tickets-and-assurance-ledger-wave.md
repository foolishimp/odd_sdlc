# REVIEW: Active Tickets + Recently-Closed Assurance Ledger Wave

**Author**: Claude
**Date**: 2026-04-27T23:00:00Z
**Scope**:
- Active: T-041, T-066, T-069, T-076 (already reviewed separately), T-085
- Recently closed: T-077–T-084 (assurance ledger family, closed today)
- Predecessor closed: T-070–T-075 (closed today, surveyed for cross-reference)
**Posture**: Commentary, not law. Reviewer-only; no edits.
**Anchoring**: STDO scope letters S/T/D/O annotate each finding.
**Methodology**: Tickets read directly. Code surfaces read for the live algebra, not for line-by-line comparison.

## Headline

The TypeScript tenant has accumulated three load-bearing pieces of work over the past day that are individually well-typed but collectively under-integrated:

1. **The deterministic-traversal slice (T-076)** — postflight failure now emits ABG retry truth. *Reviewed separately.* (`20260427T201500Z_REVIEW_T-076-typescript-implementation-code-review.md`)
2. **The assurance-ledger family (T-077–T-084)** — seven typed evaluators + a fold, with full unit-test coverage at the carrier level.
3. **The installed-operator slice (T-064 closed earlier; T-066/T-069 active)** — runs a worker, applies a path-basis postflight, returns a typed outcome.

The unifying defect is that **(2) and (3) are not connected**. The assurance ledgers are typed reusable functions and graph-function catalog entries, but no edge in the live operator traversal *invokes* them. The operator's deterministic postflight (`evaluateWorkerResultPostflight` at `handoff.ts:474`) checks file-level path/digest/byte contracts — not realization quality. The `derive_code_surface` edge can pass postflight today with placeholder Scala source, because shallow-realization is implemented in `assurance/shallow_realization.ts` but is never called during traversal.

This is the gap T-066's `non_closure_conditions` line 70 explicitly forbids ("postflight still labels a single markdown surface as product-code materialization"). The assurance ledgers exist; the wiring does not.

## Per-Ticket Status

### T-041 — Evaluate TypeScript Full Operational Python-Replacement RC Lane

**Status**: active, `change_class: product_reprice`, `re_entry_point: product_definition`.

**Read**: this is a parent meta-ticket that depends on T-066, T-069, T-076, plus the consolidated T-072–T-075. Its `closure_law` (line 47 of T-041) requires "unit, harnessed sandbox, live F_P, installed-workspace, release-cut, active total-function traversal evidence, and a governed data_mapper/test35 comparator applied to admitted Python and TypeScript evidence". It is not closeable until the dependents close.

**Code review verdict**: no T-041-specific code surface. The triage in the body (line 53–62 of T-041 body) correctly states this. No code review action.

**Coordination concern [T,O]**: T-041's `evaluation_criteria` line 55 ("data_mapper/test35 comparator reports baseline metrics, required functional families, recursive-deepening evidence, authority-to-code gaps, code-to-test gaps, execution reports, and explicit repricing for intentional differences") — the `recursive-deepening evidence` and `authority-to-code gaps` / `code-to-test gaps` map to the assurance-ledger fold *and* the unwired traversal evaluators. T-041 cannot close until those are wired (see T-066 finding below).

### T-066 — Refactor Downstream Materialization And Closure Evaluators

**Status**: active, `change_class: realization_refactor`, `re_entry_point: code_and_proof`.

**Code surfaces examined**:
- `build_tenants/typescript/code/src/operator/installed_operator.ts:359-692` (executeInstalledOperatorStart)
- `build_tenants/typescript/code/src/operator/handoff.ts:419-520` (evaluateMaterializedProductFiles, evaluateWorkerResultPostflight)
- `build_tenants/typescript/code/src/hooks/evaluators.ts:169-171` (only `ambiguity_candidates_preserved` blocking reason)

**Findings**:

- **High [O]: Shallow-realization evaluator is implemented but not invoked on the traversal path.** The path is:
  1. `executeInstalledOperatorStart` calls worker → `evaluateWorkerResultPostflight` → `runSdlcHookTurn`.
  2. `evaluateWorkerResultPostflight` in `handoff.ts:474-520` checks: output file existence, digest, byte count, materialization path basis, materialized file digests, `unresolvedReasons.length`. None of these run the shallow-realization classifier.
  3. `runSdlcHookTurn` in the hooks module checks evaluator-defined predicates from `hookContractByEdgeName`. The hook evaluators in `hooks/evaluators.ts` reference `ambiguity_candidates_preserved` only.
  4. `assurance/shallow_realization.ts` exports `deriveSdlcShallowRealizationAssuranceLedger` with verdict `satisfied | open_gap | blocked | reprice_required | not_applicable`. **No file under `code/src/operator/` or `code/src/hooks/` imports this function.** Verified by `grep -rn "from.*assurance" code/src/` returning only `graph/library.ts` (catalog entry) and `code/src/index.ts` (barrel re-export).

  Closure-law line 47 of T-066 requires: "rejects shallow realization patterns". `non_closure_conditions` line 70: "shallow findings are warnings only". Today they are not even warnings — they don't fire on the live path. **This is the most material defect in the active wave.**

- **High [O,D]: same diagnosis applies to materialization, capability, and requirement-fulfillment ledgers.** Same import-graph result. Each ledger has carrier types and unit tests; none is on the operator traversal path. T-066's `evaluation_criteria` lines 50–58 list six closure conditions that depend on these evaluators *running during a real edge*: capability inventory coverage, behavioral test inventory, code-to-test coverage, shallow-realization rejection, postflight rejection of markdown-only edges, and admission of evaluator findings as typed gap evidence. None of these obtain today because the ledgers are not invoked.

- **Medium [D]: handoff manifest correctly directs the worker to write under `tenantRoot`.** `handoff.ts:201-203` adds `materialization.tenantRoot` to `allowedWriteRoots` when materialization is required. The prompt at `handoff.ts:251-256` instructs explicit tenant-relative writes. So T-066 evaluation criterion line 50 ("generated code is written under `build_tenants/<active_tenant>/`") is *enforceable* by the path-basis postflight (Finding 1 of the T-076 review). The worker can be made to comply. But the realization-quality check is missing.

- **Recommendation**: route the worker postflight result (`evaluateWorkerResultPostflight`) and the constructor result through the assurance ledger fold (`assurance/fold.ts:75`) before the run is admitted. The fold's verdicts already map to the deterministic-traversal-state-machine's branches (`close_allowed → S19; retry_same_edge → S18; blocked → S17 → terminal; reprice_required → S17 → reprice`). Wire it as a stage between `evaluateWorkerResultPostflight` and `runSdlcHookTurn`, or fold the hook evaluators *into* it.

- **Low [T]**: a `test_t066_product_materialization_contract.test.mjs` exists in `test_env/tests/` (untracked). T-066 closure says (line 47) "live `data_mapper.test46.ts` or successor reaches a product-code inventory comparable enough to test35". The unit test alone won't satisfy this — `non_closure_conditions` line 75 names this exact substitution. Out of scope for this review; flag for the next live-run gate.

### T-069 — Refactor data_mapper Qualification To Prove Valid Installed Initial State

**Status**: active, `change_class: realization_refactor`, `re_entry_point: code_and_proof`.

**Code surfaces examined**:
- `build_tenants/typescript/code/src/install/installer.ts:1-209` (installAdmittedOddSdlcTypescript)
- `build_tenants/typescript/code/src/install/admission.ts:1-36` (request admission)
- `build_tenants/typescript/code/src/install/instruction_files.ts` (signature + use)
- `build_tenants/typescript/code/src/operator/installed_operator.ts:359-453` (executeInstalledOperatorStart preflight)

**Findings**:

- **High [O,D]: no pre-graph topology validation gate exists.** T-069 evaluation_criteria line 71 ("topology validation fails closed before graph execution if required installed surfaces are absent") is unmet. `executeInstalledOperatorStart` at `installed_operator.ts:359-453` checks only:
  - `start.executionContract === null` → `target_unavailable`
  - `workerTransport === null` → `fp_worker_unattached`
  - `decision.kind === "converged"` → terminal converged
  - `transition.kind !== "fp_dispatch"` → `unsupported_transition`

  There is no check for the presence of `.abiogenesis/odd_sdlc/typescript/install-manifest.json`, no check for `bootstrapGuidePath`, no check for `instructionFiles`, no check for `runtimeIdentity`. A `start --target next --until converged` invocation against a workspace with broken or partial install topology would proceed to dispatch a worker and (probably) fail later with a less-informative blocking reason.

  T-069's `non_closure_conditions` line 70 explicitly names this: "topology or conformed profile is checked after graph execution rather than before it".

- **Medium [O]: no T-069-specific test exists.** `test_env/tests/` contains `test_t059_install_release_adapter.test.mjs` and `test_t068_conform_project_profile.test.mjs`, but nothing under `test_t069_*`. The closure requires (line 76) "a deterministic topology and conformed-profile assertion test". Per T-069's own `non_closure_conditions` line 75 ("evidence relies only on previous T-052/T-059/T-063 tests without a data_mapper successor run"), this gap is named.

- **Medium [O]: install rejection path is opaque.** `installAdmittedOddSdlcTypescript` at `installer.ts:194-200` catches every error and returns `{ kind: "rejected", reason: error.message }`. The reason is a string. No structured diagnosis (e.g., "ABG install failed at packing step" vs "package extraction failed"). T-069 evaluation_criteria line 75 wants "validation result is archived with the run" — a stringly-typed reason is what the path-basis defect originally looked like in T-076. **Recommendation**: replace `reason: string` with a typed `RejectionReason` union (`abg_pack_failed | abg_extract_failed | command_binding_failed | ...`).

- **Low [O]: `requireInstalledAbg` throws on rejection** (`installer.ts:60-67`), then the catch in `installAdmittedOddSdlcTypescript` swallows it back to a string `reason`. This loses the typed `abgOutcome.kind: "rejected"` discriminant. **Recommendation**: don't throw in `requireInstalledAbg`; return a discriminated rejection that the outer function maps directly into its return shape.

- **Recommendation for the topology gate**: add `validateInstalledTopology(workspaceRoot): TopologyValidationOutcome` that checks for the manifest, command bindings, ABG install manifest, conformed-project-profile path, and bootstrap guidance. Call it as the *first* check in `executeInstalledOperatorStart`. On failure, return `terminalOutcome({status: "blocked", blockingReason: "installed_topology_invalid", ...})` *before* `start.executionContract === null` is even checked. Archive the outcome to `topology_validation.json`. This is the deterministic gate T-069 requires.

### T-076 — Reconcile test35 And TypeScript Deterministic Traversal State Machines

**Status**: active.

**Reviewed separately** in `20260427T201500Z_REVIEW_T-076-typescript-implementation-code-review.md` (code review of the implementation slice) and `20260427T173000Z_REVIEW_T-076-deterministic-traversal-state-machines.md` (review of the ticket itself).

**Cross-cut findings to carry forward into this wave**:
- Finding 1 of the code review (hook-postflight failure recreates the archive-only defect) intersects T-066's "postflight rejects code/test realization edges". When the assurance ledger fold (recommended above) is added to the operator path, it should reuse the *same* event-emission machinery as the worker-postflight failure path, not be hooked through `runSdlcHookTurn`.
- Finding 3 (`manifestId` overloading at the ABG seam) is the open abiogenesis-ticket candidate. Naming proposal: `abiogenesis/T-???-add-typed-gap-dossier-ref-to-retry-events`.

### T-085 — Harden Assurance Ledger Validation And Ticket Closure Claims

**Status**: active, `change_class: realization_refactor`, `re_entry_point: code_and_proof`. Filed today after STDO audit `20260427T165941Z_AUDIT_assurance_ledger_wave_against_stdo.md`.

**Code surfaces examined**: all of `build_tenants/typescript/code/src/assurance/*.ts`, both assurance test files, and `graph/module.ts:433-487` for T-030 reach.

**Headline finding**: **T-085's named gaps are largely already closed in code, with one partial exception.** Each named gap was traced to its claimed-missing implementation and matching test. The detailed audit:

| T-085 Named Gap | Status | File:Line |
| --- | --- | --- |
| T-079: blocked obligation states | **closed** | `obligation_carry.ts:72-77` (blocked codes); test `:325, :330` |
| T-079: reprice obligation states | **closed** | `obligation_carry.ts:44-49` (reprice codes); test `:331` |
| T-080: outside-edge requirement evidence | **closed** | `requirement_fulfillment.ts:61-70`; reason `requirement_outside_edge_authority`; test `:385` |
| T-080: ambiguous/contradictory requirement authority | **closed** | `requirement_fulfillment.ts:75-82`; reasons `ambiguous_*`, `contradictory_*`; test `:389` |
| T-081: missing required evidence vs incomplete repairable ambiguity | **closed** | `ambiguity.ts:25, 38-50` (`resolution` field with three lawful re-entry paths); test `:413-451` |
| T-082: contradictory capability authority | **closed** | `capability.ts:146-152`; reason `capability_authority_contradictory`; test `:537` |
| T-082: placeholder/identity code as capability evidence | **closed** | `capability.ts:74-83` (separate evidence-quality enum); test `:532` |
| T-030: every assurance graph function asserted | **partially closed** | `test_t030_graph_catalog_module.test.mjs:140-142` enumerates each name in a loop; uses `includes()` membership rather than fetching each function and verifying I/O signatures |

**Recommended T-085 retriage [T]**: T-085 was filed against a snapshot where most of these gaps existed. Several appear to have been closed by the same wave that closed T-077–T-084 (or by quick fix-ups before completion). T-085 should be re-triaged:
- For each named gap, either confirm it's still real with current `file:line` evidence and keep it active, or move it to a `superseded_truth` line and close it.
- Promote the T-030 partial-closure finding into a concrete obligation: "test should fetch each graph function by name and assert input-set/output-set match `*_INPUTS`/`*_OUTPUTS` constants in `library.ts`". This is one small test change away.

**Major finding [O,D]: T-085 misses the actual load-bearing defect**, which is **the assurance ledgers are typed but unwired** (see T-066 above). The audit notes it obliquely (`closure_law` line 47: "T-066/T-076 no longer cite first-slice ledger proof as deeper data_mapper RC assurance"), but does not file the integration gap as a primary T-085 obligation. Today the T-077–T-084 ledgers can pass all their unit tests *while* the operator pipeline performs a `derive_code_surface` traversal that emits placeholder Scala without rejection. **Recommendation**: extend T-085's required work to include "wire at least the materialization, shallow-realization, and capability ledgers into the operator postflight, on the operator's algebra-aware path". Without this, the wave is proof-by-unit-test rather than proof-by-traversal — exactly the substitution `non_closure_conditions` line 70 forbids.

## Recently-Closed Tickets — Spot Review

### T-077 through T-084 (assurance-ledger wave, closed today)

**Verdict on the closures themselves**: each individual ledger module has a correct typed shape, a defensible verdict alphabet, an admit/derive seam, and unit-test coverage. The closures are not unsafe at the carrier level. The wave is correct as **carrier-and-fold engineering**.

**Verdict on the closures as RC proof**: insufficient. The wave produced *typed evaluators* without *traversal wiring*. T-077's evaluation criteria are met; its claim "downstream product realization is rejected when only markdown is produced" is *technically true for the ledger function* but *not enforced on the operator path*. Future tickets should not cite T-077–T-084 as evidence of operator-level rejection.

This is the same fault line `feedback_realization_choices_in_tenant_adrs.md` flags: "tenant-local realization decisions go in build_tenants/<tenant>/design/ ADRs, not PRODUCT.md". The realization decision here was "build the ledgers as standalone reusable functions and wire them later". That decision is fine if the wiring ticket exists. T-066 *is* the wiring ticket. But T-077–T-084 closed without an explicit cross-link in their `closure_law` to T-066's wiring milestone. **Recommendation**: when closing wave tickets that produce reusable building blocks, mark explicitly which downstream ticket owns the integration milestone. Otherwise the closures read as "system property X is now true" when only "function X exists" is true.

### T-070–T-075 (closed today, surveyed)

Read titles only; not deeply spot-checked given scope of this review:
- T-070: bind conformed project profile into installed realization handoff — appears integrated (`handoff.ts:166` accepts `conformedProject`).
- T-071: realize stateful recursive deepening over installed graph program.
- T-072–T-075: capability inventory, behavioral test inventory, deterministic shallow-realization evaluators, success comparator.

Cross-cut concern [T]: T-072–T-074 are listed under T-066's dependencies as `consolidated`, suggesting their content was rolled into T-066. If so, T-066 inherits all their evaluation criteria. The T-077–T-084 wave likely realized the *evaluator functions* T-072–T-074 declared, but not the wiring. **The integration gap therefore spans at least three closed tickets and one active one.** Worth confirming with whoever did the consolidation.

## Cross-Cutting Findings

### CC-1 [O,D]: integration gap between assurance ledgers and operator traversal

Already covered above. Single most important defect in the wave. Fix is one to two days of TypeScript work — bridge `evaluateWorkerResultPostflight` + constructor result → `deriveSdlcMaterializationAssuranceLedger` and `deriveSdlcShallowRealizationAssuranceLedger` → fold → `appendPostflightFailureRuntimeEvents` (reused from the T-076 slice).

### CC-2 [O]: rejection paths use stringly-typed reasons in multiple places

- `OddSdlcTypescriptInstallOutcome.reason: string` (`install/carriers.ts`)
- `SdlcPostflightResult.blockingReasons: readonly string[]` (`operator/carriers.ts:168`)
- `SdlcOperatorSummary.blockingReason: string | null` (`operator/carriers.ts:26`)

Per `feedback_stdo_constitutional_governance.md` and the `non_closure_conditions` of multiple tickets, "reviews anchor findings to specific §-clauses" — strings don't anchor. **Recommendation**: introduce a single closed `BlockingReason` discriminated union shared across operator + install + assurance, mapped to reason classes. Today `classifyPostflightGapReason` (`handoff.ts:541`) does this with substring matching; the type system can do it deterministically.

### CC-3 [T]: ticket-closure claims drifting ahead of code

T-085 itself is evidence of this drift; this review documents that T-077–T-084 closed with valid carrier-level proofs but invalid traversal-level claims. **Recommendation**: introduce a `wiring_milestone:` field in the ticket frontmatter that names the downstream ticket which owns integration of the closure's outputs. When the closure produces a reusable carrier or evaluator, the wiring ticket must be active or completed for the closure to be load-bearing.

### CC-4 [D]: design surfaces are present but not always cross-linked

T-066's `active_design_refs` lists `ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md`, `ODD_SDLC_TYPESCRIPT_HOOK_CONTRACTS.md`, `ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md`, `ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md`. The traversal-state-machine doc was reviewed separately and is correct for the slice it covers. The reusable-graph-function-library design owns the assurance ledgers as graph functions. The integration boundary (operator → ledger fold → state machine) is not in any single design doc. **Recommendation**: add a one-page design `ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md` that names the call sites and the typed seam. This is the design that closes the wiring gap before T-066 closes.

## Closing

The wave is well-typed at the carrier level and well-implemented at the slice level (T-076). The structural defect is integration: the assurance ledgers are not on the operator's algebra path, the install topology gate is not present pre-graph, and rejection-reason carriers across three modules are still strings. None of these is a deep design defect — each is a small, named integration that the ticket frontmatter says should already exist.

The action surface is concentrated:
1. Wire ledger fold into operator postflight (closes most of T-066, supports T-041).
2. Add pre-graph topology validation in `executeInstalledOperatorStart` (closes T-069's primary gate).
3. Re-triage T-085 against the corrected gap status above.
4. Promote stringly-typed blocking reasons to a closed union (CC-2).

Once (1) and (2) land, T-066, T-069, and downstream T-041 closure depend only on a live `data_mapper.test*` run with admitted topology and admitted realization evidence — which is exactly the proof T-041's closure law requires.
