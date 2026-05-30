# odd_sdlc TS Tenant Cleanup Audit — file-by-file evidence log (T-186)

- author: claude
- date: 2026-05-30
- scope: `build_tenants/typescript/code/src` (157 files / ~74.9k lines, 33 analysis units)
- method: deterministic export/import scan (F_D spine: 522/1310 exports referenced in no other src file) → 32 per-module analysis agents anchored to DESIGN_MODULE_METHOD §clauses → adversarial refutation of every removal claim against the call graph, tests, and the 4 package.json export roots → synthesis. 63 agents · ~4.7M tokens · 1,794 tool calls.
- governance: STDO. Findings anchor to DESIGN_MODULE_METHOD (§5C/§6/§9/§10/§11C/§12/§13) and PRODUCT.md §Generic-Computation-Regime (behavioral F_D).
- status: **commentary / evidence surface**. The actionable, behavior-preserving subset is ticketed as **T-186**; design-class items are flagged as follow-ups in §E.
- coverage caveat: 1 of 33 units (`assurance`) did not return structured output (one subagent skipped its StructuredOutput call); it is **backfilled inline** in §D from a direct importer scan.

This log is the proof surface for T-186: each cleanup row in the ticket cites a `DC-`/`CN-` id here, so closure is checkable against evidence rather than asserted.

---

## A. Dead code (verified against call graph + tests + public-API roots)

The deterministic scan flagged 522 candidate exports. Most are over-exported in-file-only types (boundary inflation, see TD-04), not deletable code. After adversarial refutation, removal candidates fall into four tiers:

### DC-01 — Safe internal-only dead exports (delete code, behavior-preserving)
- confidence: **high** · ~43 lines · 6 targets
- All confirmed zero-consumer (grep) and NOT contradicted by any refute (rec:remove). These are the only genuinely safe internal deletions; total is tiny (~43 lines). Each is plain §5C dead surface superseded by a live sibling (e.g. fnv1a->sha256 is NOT here - it was refuted). product_materialization/index.ts has no importer (launch_contract imports the unit modules directly).
- targets:
  - `analysis/archive_reader.ts:186-190 operatorRunRootsOldestFirst (5 lines)`
  - `analysis/diagnostics.ts:64-69 hasFailingDiagnostic (6 lines)`
  - `projection/query_domain.ts:991 assessmentStatusToClosureRegisterStatus (7 lines)`
  - `shared/fd_admission.ts:49-61 admitDeclaredAlias + :8-13 SdlcFdFieldClass (B-086 unwired, 20 lines)`
  - `shared/traversal_strategy_plan.ts:20-21 OddSdlcTraversalStrategyProfile dead union (2 lines)`
  - `operator/product_materialization/index.ts dead barrel (3 lines) + manifest.ts:6 ProductMaterializationManifestDeps de-export`

### DC-02 — Test-only fixtures shipped on the public barrel (remove_with_tests; relocate to test_env)
- confidence: **medium** · ~1791 lines · 6 targets
- TEST-ONLY. This is the bulk of removable lines (~1800). All have rec:remove_with_tests: zero src/spine reachability, kept alive only by a single .mjs test, but ride the public barrel. Remediation is relocation to test_env fixtures (or wire into a real evaluate.C/consequence.C node), not blind deletion. test_pipeline + sandbox modules also carry unsupported REQ claims (behavioral F_D never on the live spine).
- targets:
  - `qualification/sandbox_proof.ts whole file - T-047 (278 lines, only test_t047)`
  - `qualification/enterprise_core_iteration_sandbox.ts + enterprise_core_inventory.ts - B-068 (1026 lines, only test_b068)`
  - `operator/test_pipeline.ts whole file - REQ-010..015 never wired to spine (406 lines, only test_t168)`
  - `operator/edge_gain_closure.ts:564-596 composeSdlcPathGain + SdlcCompoundTraversalGain + edgeGainCloses (50 lines, only test_t164)`
  - `operator/traversal_consequence.ts:1798-1807 assertSdlcTraversalConsequenceReplayable proxy over replaySdlcTraversalConsequence (12 lines, tests call wrapper)`
  - `operator/review_grade_edge_fulfillment.ts:50-68 reviewGradeEdgeFulfillmentOpenPressureRefs - test-only twin of the src-used Assessment variant (19 lines)`

### DC-03 — Public-surface / product_reprice candidates (do NOT delete without a product decision)
- confidence: **low** · ~484 lines · 4 targets
- rec:remove but flagged low-confidence because each is exported via index.ts blanket export * so removal is a published-API change requiring product_reprice + confirmation of no out-of-workspace consumer. The lineage/repair-frontier (340 lines) is steel-thread spine built ahead of wiring - circle-back candidate, do NOT delete blind. NOT high-confidence dead.
- targets:
  - `effects/environment.ts whole module (33 lines) + effects/file_store.ts read_text_file path & SdlcFileStoreEffectKind (18 lines) - never constructed, only write path is live`
  - `release/carriers.ts:103-135 Legacy* release-snapshot carrier triad - zero producer/consumer (33 lines)`
  - `projection/requirement_closure.ts proof-claim/lineage/repair-frontier sub-feature (340 lines) + query_domain.ts:1742 projectSdlcSpanAnalysis (40 lines) - spine built ahead of operator/spec_method wiring; live path uses EMPTY_LINEAGE_LEDGER`
  - `operator/carriers.ts:612/834/842 SdlcOutcomeClassSelection, SdlcImplementationDesignBinding, SdlcTestDesignBinding - no embedder/consumer (20 lines)`

### DC-04 — Barrel narrowing (behavior-preserving export-surface reduction, NOT code deletion)
- confidence: **high** · ~31 lines · 3 targets
- BEHAVIOR-PRESERVING surface reduction (rec:remove for the operator-barrel and qualification cases). Replace blanket export * with explicit named re-exports of only consumed value exports. CRITICAL boundary: narrow at the barrel only - the per-symbol 'export' keyword demotions inside installed_operator (27 symbols), feature_scope (2 fns), feature_dependency_dag (deriveSdlcFeatureDependencyDag) were ALL refuted (rec:keep) because those symbols are spine-reachable live code; do not de-export them individually. Confirmed: index.ts has exactly 23 export* lines, one per unit.
- targets:
  - `index.ts:46-68 - 23 blanket 'export * from ./X/index.js' over every submodule barrel`
  - `operator/index.ts:47-65 - blanket export * over installed_operator, transform, traversal_*, decomposition, transport (republishes 9.3k+12.5k monolith internals as public API)`
  - `domain/index.ts, hooks/index.ts, effects/index.ts, triage/index.ts, projection/index.ts, qualification/index.ts, package_binding/index.ts, admission/index.ts - per-unit export* lifting in-file-only types onto the surface`

### Refute pass — false positives it caught (DO NOT delete)
The adversarial step overturned the largest raw candidates as **live, spine-reachable code** (deterministic scan flagged them only because no *other* src file imports the bare name; they are used intra-file or via the public barrel):
- `operator/installed_operator.ts` — 27 exported symbols (`MAX_INSTALLED_*`, reentry/disposition types): **keep** (live runtime constants/types).
- `operator/feature_scope.ts` (2 fns), `operator/feature_dependency_dag.ts` `deriveSdlcFeatureDependencyDag`: **keep** (spine-reachable).
- `admission/codecs.ts` `isFiniteNumber`/`recordHasKind`, `analysis/carrier_loaders.ts` 21 `*Record` types, `analysis/diagnostics.ts` `buildDiagnostic`: **keep** code (live intra-file); only the `export` keyword is surplus → TD-04.

### Appendix A1 — per-module removable verdicts (file-by-file)

| unit | target | ~lines | confidence | refute verdict |
| --- | --- | --- | --- | --- |
| analysis | operatorRunRootsOldestFirst export (code/src/analysis/archive_reader.ts:186-190) | 5 | high | remove |
| analysis | hasFailingDiagnostic export (code/src/analysis/diagnostics.ts:64-69) | 6 | high | (not-refuted) |
| effects | code/src/effects/environment.ts (SdlcEnvironmentReadPlan, SdlcEnvironmentReadRes | 33 | low | (not-refuted) |
| effects | code/src/effects/file_store.ts read-text-file branch (SdlcReadTextFilePlan, cons | 18 | low | (not-refuted) |
| graph | code/src/graph/library.ts:59-116 (SdlcComputeRegime + TypeSurfaceRef + TypedAsse | 58 | high | REFUTED→keep |
| graph | code/src/graph/target_carrier_contracts.ts:586-601 (constructSdlcTargetCarrierRo | 16 | medium | (not-refuted) |
| projection | code/src/projection/query_domain.ts:991 assessmentStatusToClosureRegisterStatus | 7 | high | (not-refuted) |
| projection | code/src/projection/requirement_closure.ts proof-claim + lineage + repair-fronti | 340 | low | (not-refuted) |
| projection | code/src/projection/query_domain.ts:1742 projectSdlcSpanAnalysis + SdlcSpanAnaly | 40 | low | (not-refuted) |
| qualification | /Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/qualification/san | 278 | medium | remove_with_tests |
| qualification | /Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/qualification/ent | 1026 | medium | (not-refuted) |
| qualification | qualification unit `export *` exposure via /Users/jim/src/apps/odd_sdlc/build_te | 1 | low | (not-refuted) |
| release | release/carriers.ts:103-135 — Legacy* carrier triad (OddSdlcTypescriptLegacyRele | 33 | low | (not-refuted) |
| runtime | runtime/abiogenesis_substrate.ts substrate-probe feature: ODD_SDLC_ABIOGENESIS_S | 200 | medium | (not-refuted) |
| runtime | runtime/abiogenesis_substrate.ts:220 ODD_SDLC_DEFAULT_EVALUATE_NEXT_PRIORITY_SCH | 2 | high | (not-refuted) |
| shared | shared/fd_admission.ts :: admitDeclaredAlias (lines 49-61) + SdlcFdFieldClass (l | 20 | high | remove |
| shared | shared/traversal_strategy_plan.ts :: OddSdlcTraversalStrategyProfile (lines 20-2 | 2 | high | remove |
| spec_method | export modifier on SdlcAnalyzeRunCliEnvelope (code/src/spec_method/entry.ts:2146 | 1 | high | (not-refuted) |
| spec_method | export of invokeOddSdlcSpecMethodCommandSync (code/src/spec_method/entry.ts:2273 | 25 | low | (not-refuted) |
| spec_method | export of resolveDefaultAbg{Package,Docs,Standards}SourceRoot (entry.ts:346/375/ | 3 | low | (not-refuted) |
| workspace | code/src/workspace/source_input.ts: fnv1aDigest (lines 22-29) | 8 | high | (not-refuted) |
| workspace | code/src/workspace/project_profile.ts: admitSdlcConformProjectProfile (lines 145 | 140 | medium | (not-refuted) |
| workspace | code/src/workspace/project_authority_conformance.ts (entire T-134 module) | ? | low | (not-refuted) |
| op/installed_operator | code/src/operator/installed_operator.ts: function deriveSdlcPostProductMateriali | 13 | high | REFUTED→keep |
| op/installed_operator | code/src/operator/installed_operator.ts: drop `export` keyword on the 27 interna | ? | high | (not-refuted) |
| op/carriers-closure | operator/edge_gain_closure.ts: composeSdlcPathGain + SdlcCompoundTraversalGain i | 50 | medium | (not-refuted) |
| op/carriers-closure | operator/composition_identity.ts: deriveLegacyReplayOnlySdlcSelectedAbgFnComposi | 9 | high | (not-refuted) |
| op/carriers-closure | operator/carriers.ts: SdlcOutcomeClassSelection (l612), SdlcImplementationDesign | 20 | low | (not-refuted) |
| op/traversal | assertSdlcTraversalConsequenceReplayable + replaySdlcTraversalConsequence proxy  | 12 | high | remove_with_tests |
| op/decomposition-frontier | operator/index.ts:50-58 blanket `export *` of the four modules; replace with exp | 9 | high | (not-refuted) |
| op/decomposition-frontier | operator/feature_scope.ts: drop `export` from sdlcModuleNameInFeatureScope and s | 2 | high | REFUTED→keep |
| op/decomposition-frontier | operator/feature_dependency_dag.ts: drop `export` from deriveSdlcFeatureDependen | 1 | medium | (not-refuted) |
| op/policy-pipeline | src/operator/test_pipeline.ts (whole file) | 406 | high | (not-refuted) |
| op/policy-pipeline | reviewGradeEdgeFulfillmentOpenPressureRefs (src/operator/review_grade_edge_fulfi | 19 | high | (not-refuted) |
| op/policy-pipeline | sdlcWorkCategoryForManifest (src/operator/work_category_governance.ts:67-72) | 6 | high | (not-refuted) |
| op/policy-pipeline | sdlcWorkCategoryGovernanceCategories + private SDLC_WORK_CATEGORY_GOVERNANCE_CAT | 11 | high | (not-refuted) |
| op/policy-pipeline | sdlcWorkCategoryGovernanceText + sdlcWorkCategoryGovernanceConfigPath (src/opera | 22 | high | (not-refuted) |
| op/product-materialization | operator/product_materialization/index.ts | 3 | high | (not-refuted) |
| op/product-materialization | ProductMaterializationManifestDeps export (de-export, not delete) | 1 | high | (not-refuted) |

---

## B. Tech debt (themes, §clause-anchored)

### TD-01 — [high] No Semantic Center / multi-role monoliths: production line-of-business meaning ('what closes' / 'what-is-next') is spread across a few mega-files a reviewer must read in full
- clause: DESIGN_MODULE_METHOD §10 No Semantic Center / §6 Taxonomy
- worst offenders:
  - operator/plugins/transform/launch_contract.ts (12469 lines, 41 exports, >=5 role clusters, misnamed 'transform')
  - operator/installed_operator.ts (9295 lines: transform+evaluate+consequence+admission+write+reentry)
  - spec_method/entry.ts (2896 lines, 7 roles, CLI re-derives closure/next-action)
  - operator/carriers.ts (2043 lines, every operator data shape)
  - projection/query_domain.ts (1769 lines)
  - workspace/project_profile.ts (1579 lines: YAML parse+profile+exec-inference+constraints+bootstrap-md+admit)

### TD-02 — [high] Effect-Edge violations: functions that DECIDE semantic meaning (closure/gap/next-action/verdict) also PERFORM filesystem writes or subprocess spawns in the same body
- clause: DESIGN_MODULE_METHOD §9 Effect-Edge Rule
- worst offenders:
  - operator/plugins/consequence/edge_projection.ts:1186/1300 (consequence.C projection spawns test subprocesses + embeds a 46-line node runner)
  - operator/installed_operator.ts:7663-9162 (executeInstalledOperatorStart decides closure AND 59 writeSdlcSystemArtifact sites)
  - workspace/project_authority_conformance.ts:390+:835 (decides nextActionRows; writer re-derives meaning + mkdir/writeFileSync)
  - release/release_snapshot.ts:601-795 (deriveOddSdlcTypescriptReleaseSnapshot decides gap/rejection AND writes)
  - qualification/installed_initial_state.ts:114-202 (readFileSync + valid/invalid verdict in one fn)
  - spec_method/entry.ts:2158-2203 (analyzeRunPayload decides analysis meaning + writes); operator/system_artifacts.ts:97-165 (payload-legality + archive write fused)

### TD-03 — [high] Behavioral F_D: F_D / read-model / transform code performs semantic-quality (F_P) interpretation that belongs to evaluate.C / consequence.C
- clause: PRODUCT §Generic-Computation-Regime (behavioral F_D)
- worst offenders:
  - operator/plugins/transform/launch_contract.ts:11360/11658/12056/9639 (F_D 'transform' module owns evaluateMaterializedProductFiles/ExecutionEvidence/ObligationAssessments)
  - spec_method/entry.ts:1035-1088,1215-1366 (CLI re-derives closure/next-action consequence.C already owns)
  - start/public_start.ts:498-556 (front door re-decides settled-closure prior-overlay truth)
  - workspace/project_profile.ts:597-693 (inferExecutionContracts interprets build/test/deploy via string heuristics)
  - operator/plugins/consequence/edge_projection.ts:626/707/1364/1515 (status/failure meaning decided in a projection file)
  - qualification/enterprise_core_iteration_sandbox.ts:234-247 (declared semantic_fp evaluator never run; structural F_D mislabeled as F_D+F_P)

### TD-04 — [high] Boundary Inflation: blanket export * republishes every in-file-only type, dead symbol, and internal guard onto the package public surface
- clause: DESIGN_MODULE_METHOD §5C Boundary Inflation Prohibition
- worst offenders:
  - index.ts:46-68 (23 blanket export* - root cause: public surface = transitive union of all 24 units)
  - operator/index.ts:47-65 (republishes 9.3k+12.5k monolith internals)
  - qualification/index.ts (export* x5 lifts ~30 test-only symbols incl sandbox_proof/enterprise_core onto the root - flagged HIGH)
  - domain/index.ts (publishes declared-but-unrealized carrier contracts)
  - hooks/index.ts, triage/index.ts, projection/index.ts:56 (37-symbol surface incl dead helpers), admission/codecs.ts (internal guards)
  - contracts/blocking_reason_catalog.ts:3-83 (full internal helper chain exported, one entry consumed)

### TD-05 — [high] Interface Bleed: a stage module reaches directly into another stage's internals or persisted artifact format; reciprocal cross-stage imports
- clause: DESIGN_MODULE_METHOD §12 Interface Bleed
- worst offenders:
  - operator/plugins/evaluate/postflight.ts:19-29 imports its evaluate* family FROM operator/plugins/transform/launch_contract.ts (F_P importing from F_D), which reciprocally imports admitImplementationDesignRegisterForManifest back
  - workspace/project_authority_conformance.ts:15 (ingress stage imports projection/query_domain type) <-> query_domain.ts:64 imports workspace (bidirectional)
  - spec_method/entry.ts:1013-1088 (CLI reaches into operator's persisted archive artifact JSON format instead of routing through analysis/carrier_loaders)
  - start/public_start.ts:306-325 (start stage rebuilds operator-run archive reader instead of using analysis/archive_reader+carrier_loaders)

### TD-06 — [medium] Proxy Interface: pass-through wrappers / unwired carriers kept alive only to keep a test green or a stale import surface stable
- clause: DESIGN_MODULE_METHOD §13 Proxy Interface
- worst offenders:
  - operator/plugins/transform/launch_contract.ts:9185/9976/9992/10002/11215/11225/12226 (7 deps-bound proxy wrappers forwarding to extracted product_materialization modules)
  - operator/traversal_consequence.ts:1798 assertSdlcTraversalConsequenceReplayable (pure pass-through over replay*)
  - operator/edge_gain_closure.ts:564-596 composeSdlcPathGain (compound layer kept green only by its own test)
  - operator/assurance_gate.ts:45-57 (no-op gate still threaded through dispatch + persisted as authority artifact)
  - operator/composition_identity.ts:146 deriveLegacyReplayOnly* (T-184 LD-008 claimed removal; export persists - claim vs code drift)

### TD-07 — [medium] Tenant-wide leaf-helper duplication: the same small utility re-implemented per file instead of consumed from shared/
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- worst offenders:
  - uniqueSorted (23 files; canonical already at assurance/shared.ts:15)
  - parseArray<T> (10 files; 4 register copies byte-identical)
  - local isRecord/isPlainRecord guard (10 files; canonical admission/codecs.ts:5)
  - sha256Text/sha256Digest (6 files)
  - pathIsInside (byte-identical twin transform/consequence)
  - requiredString/optionalString + typed-record-accessor toolkit (8+ files; canonical shared/validation.ts)

---

## C. Consolidation opportunities (§11C recurrence rule-of-two)

### CN-01 — uniqueSorted / sortedStrings / nonEmptyUniqueSorted frozen-unique-sorted-string helper
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: operator/installed_operator.ts, operator/traversal_consequence.ts, operator/traversal_strategy.ts, operator/traversal_complexity.ts, operator/edge_gain_closure.ts, operator/decomposition_admission.ts, operator/feature_dependency_dag.ts, operator/feature_scope.ts, operator/test_pipeline.ts, operator/review_grade_edge_fulfillment.ts, operator/plugins/evaluate/content_register.ts, operator/plugins/evaluate/design_depth_register.ts, operator/plugins/evaluate/postflight.ts, operator/plugins/consequence/edge_projection.ts, operator/plugins/transform/launch_contract.ts, projection/requirement_closure.ts, projection/query_domain.ts, triage/triage.ts, graph/edge_accounting.ts, contracts/product_graph_contract_catalog.ts, assurance/fold.ts, assurance/carriers.ts
- recommendation: GREP-CONFIRMED: 23 files define `function uniqueSorted` (+ inline sortedStrings in projection). Canonical exports already exist at assurance/shared.ts:15 and workspace/source_input.ts:35. Lift ONE shared/uniqueSorted (+ a nonEmptyUniqueSorted variant) and import everywhere; delete the 23 per-module copies. Highest-frequency, lowest-risk consolidation in the tenant.

### CN-02 — parseArray<T> private JSON-array admission helper (md5 9df6ea897675... in the 4 registers)
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: operator/design_depth_register.ts, operator/component_depth_register.ts, operator/test_design_register.ts, operator/test_execution_surface_register.ts, hooks/admission.ts, operator/review_grade_edge_fulfillment.ts, operator/plugins/transform/launch_contract.ts, operator/plugins/consequence/edge_projection.ts, operator/product_materialization/replay.ts, operator/product_materialization/observation.ts
- recommendation: GREP-CONFIRMED: 10 files define `function parseArray<`; the four op/registers copies are byte-identical (same md5). Add one exported parseArray<T> to shared/validation.ts (alongside parseClosedRecord/parseNonEmptyString/parseEnumValue) and import in all 10; retires the rule-of-four register scaffolding's array reader.

### CN-03 — sha256 hex-digest helper (sha256Text / sha256Digest over JSON or string)
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: workspace/project_profile.ts, workspace/project_authority_conformance.ts, workspace/source_input.ts, graph/overlays.ts, operator/plugins/transform/launch_contract.ts, operator/product_materialization/observation.ts, projection/query_domain.ts
- recommendation: GREP-CONFIRMED: 5 `function sha256Text` defs + 1 exported `sha256Digest` (workspace/source_input.ts:31); launch_contract.ts:344 is the only currently-exported sha256Text. Plus projection/query_domain.ts:279 domainDefaultsDigest hand-rolls the same SHA-256-JSON-digest+digestRef shape. Commonize one shared/digest.ts: sha256Text(string) + sha256JsonDigest(value) + digestRef(base,digest). Note canonical home should live in shared/, not the operator stage.

### CN-04 — isRecord / isPlainRecord / isStringRecord JSON record-shape guard (typeof==='object' && !==null && !Array.isArray)
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: admission/codecs.ts, install/admission.ts, install/installer.ts, release/release_cut.ts, release/release_snapshot.ts, package_binding/node_package.ts, analysis/edge_attempts.ts, spec_method/entry.ts, start/public_start.ts, operator/runtime_policy.ts
- recommendation: GREP-CONFIRMED: 10 modules carry a local record guard. admission/codecs.ts:5 isRecord is the canonical predicate; shared/validation.ts has parseClosedRecord (via private isStringRecord) but exports no bare guard. Export ONE isRecord from shared/validation.ts and import in all 10 sites; redirect install's isPlainRecord and the release/package_binding inline copies. Watch trim-semantics divergence in install/admission.ts.

### CN-05 — argv/string-coercion record-accessor toolkit (stringField/numberField/stringArrayField/childRecord) + requiredString/optionalString
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: spec_method/entry.ts, analysis/edge_attempts.ts, start/public_start.ts, release/release_snapshot.ts, release/release_cut.ts, package_binding/node_package.ts, admission/codecs.ts, operator/runtime_policy.ts, install/admission.ts
- recommendation: entry.ts:2341-2397 reimplements the typed-record-accessor family present in 8+ modules; requiredString/optionalString re-implemented in install/admission.ts:17 and both release adapters. shared/validation.ts:35-65 is the canonical home. Promote one typed-record-accessor module under shared/ and route all consumers through it (consume, don't re-derive).

### CN-06 — pathIsInside / assertWorkspaceRelativePath containment guard
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two / §12 Interface Bleed
- recurs in: operator/plugins/transform/launch_contract.ts, operator/plugins/consequence/edge_projection.ts, operator/plugins/evaluate/postflight.ts, workspace/runtime_layout.ts, workspace/project_authority_conformance.ts, operator/product_materialization/observation.ts
- recommendation: GREP-CONFIRMED: pathIsInside is byte-identical in launch_contract.ts:8582 (exported) and edge_projection.ts:822 (private copy); postflight.ts imports it. The workspace-relative-path guard recurs across workspace/* and operator/* (8 sites per workspace finding). Extract one assertWorkspaceRelativePath(value,label)/pathIsInside into shared/ (or operator/shared) before a third copy lands.

### CN-07 — emittedRuntimeEventKinds: readonly [] 'ABG owns events' read-only-carrier marker
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: operational/carriers.ts, operational/operational.ts, spec_method/entry.ts, hooks/carriers.ts, triage/carriers.ts, projection/query_domain.ts, projection/requirement_closure.ts
- recommendation: GREP-CONFIRMED in 6+ modules. Declare one shared NoEmittedRuntimeEvents mixin type + EMPTY_RUNTIME_EVENT_KINDS const so the 'this F_D stage emits no events' assertion is single-site, not re-declared per stage carrier.

### CN-08 — NextActionBasisKind 8-member union carrier
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: operator/traversal_consequence.ts, runtime/abiogenesis_substrate.ts
- recommendation: GREP-CONFIRMED: SdlcNextActionBasisKind (traversal_consequence.ts:31) and OddSdlcNextActionBasisKind (abiogenesis_substrate.ts:130) are the same 8-member union. Collapse to one carrier and import; abiogenesis_substrate is the duplicate.

### CN-09 — T-185 parallel-materialization frontier carriers (SdlcAbgFrontierCompilation vs SdlcLiveFpParallelMaterializationFrontier)
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: operator/carriers.ts, operator/feature_dependency_dag.ts, operator/live_fp_parallel_materialization_frontier.ts
- recommendation: GREP-CONFIRMED: SdlcAbgFrontierCompilation (carriers.ts:563, produced by feature_dependency_dag.ts:696 compileSdlcFeatureDependencyDagToAbgFrontier) and SdlcLiveFpParallelMaterializationFrontier (live_fp_...:38) re-encode the same DAG-derived frontier; SdlcLiveFpParallelMaterializationBranchRow additionally re-encodes SdlcFeatureDependencyDagNode fields. This is the named T-185 consolidation cluster - converge onto one frontier carrier.

### CN-10 — Per-carrier admission shape: parseClosedRecord(input,label,[keys]) -> Object.freeze({kind, ...per-field parseNonEmptyString/parseStringList/parseEnumValue/admitNested})
- clause: DESIGN_MODULE_METHOD §11C Recurrence / §5C IACS
- recurs in: domain/admission.ts, hooks/admission.ts, install/admission.ts, workspace/*carriers/admit, release/release_snapshot.ts, release/release_cut.ts, spec_method/entry.ts, operator (registers + carriers)
- recommendation: The frozen-{kind,...}-from-parseClosedRecord admit template recurs ~17x in domain/admission.ts alone and across nearly every Sdlc* carrier module tenant-wide. A schema-driven admit helper (kind + field-spec table) collapses ~40 lines per carrier. FLAG: this is a substrate / shared-method decision (cross-unit, not domain-local) - ratify the helper in shared/ or specification_methodology, do not normalize by repetition. Highest payoff but highest blast radius; sequence after the leaf-helper consolidations.

### CN-11 — Contracts catalog scaffolding: frozen const table + Row interface + per-row freeze + require*/assert* (throw TypeError) + reason-code string-union; and the (typeof CONST)[number] enum-from-frozen-array idiom
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: contracts/operator_run_artifact_catalog.ts, contracts/product_graph_contract_catalog.ts, contracts/carrier_domain_catalog.ts, contracts/blocking_reason_catalog.ts, domain/carriers.ts, operator/carriers.ts, triage/carriers.ts, shared/blocking_reason.ts, shared/overlay_strategy.ts, shared/traversal_strategy_plan.ts
- recommendation: Four contracts/* catalogs rebuild the identical table+row+require+reason-union shape; the const+`(typeof X)[number]` enum idiom repeats ~6x inside carrier_domain_catalog alone and across all carriers.ts modules. parseEnumValue (shared/validation.ts:79) is the canonical membership primitive - overlay_strategy.ts:58 hand-rolls the chain instead. Commonize a frozenTable<TRow>(rows)+makeRequire(table,key,errMsg)+makeLookup, and a makeEnum helper emitting {values,type}. Route enum admission through parseEnumValue.

### CN-12 — Per-register rule-of-four admission scaffolding: admit*RegisterFromArtifact envelope + requiredRowsPresent + JSON-fence candidate reader + Object.freeze rejection carriers
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: operator/design_depth_register.ts, operator/component_depth_register.ts, operator/test_design_register.ts, operator/test_execution_surface_register.ts, operator/plugins/evaluate/design_depth_register.ts, operator/plugins/evaluate/content_register.ts
- recommendation: Four op/registers siblings + two evaluate.C register gates rebuild admit-from-artifact + requiredRowsPresent + fenced-JSON candidate reader + status:'rejected' carrier. test_design_register.ts:396 and test_execution_surface_register.ts:143 readers are diff-identical. Extract a higher-order admitRegisterFromArtifact(parseRegister, requiredRowsPresent, kinds) + one parameterized fenced-JSON candidate reader into shared/. NOTE the per-register *RegisterAdmissionStatus types in operator/carriers.ts are intra-file-used (false positives of the dead heuristic), keep them.

### CN-13 — Plan/execute effect carrier: '{kind} Plan interface + construct<Plan>()(Object.freeze) + execute<Plan>():Result' + immediate construct-then-execute at call sites
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two / §9 Effect-Edge
- recurs in: effects/archive_store.ts, effects/environment.ts, effects/file_store.ts, effects/process_runner.ts, operator/system_artifacts.ts, operator/plugins/consequence/edge_projection.ts
- recommendation: All four effects/* peers rebuild the Sdlc*Plan/construct*/execute* shape independently, and every consumer immediately fuses construct-then-execute. Commonize a SdlcEffectPlan<kind>/SdlcEffectResult base + freezePlan helper. Decision point: if the plan is meant to be an admitted/replayable ABG carrier, route it through admission instead of fusing the two calls inline; if not, collapse each pair into one performEffect helper.

### CN-14 — DiagnosticDraft producer fan-out: every derive* returns { <payload>, diagnostics: readonly DiagnosticDraft[] }
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: analysis/runtime_gaps.ts, analysis/requirement_lineage.ts, analysis/retry_forensics.ts, analysis/bloat_slope.ts, analysis/summary_drift.ts, analysis/liveness.ts
- recommendation: All 6 analysis derive* modules return the same {payload, diagnostics} shape, concatenated in analyze.ts. Commonize a shared DerivationOutcome<T> type + a single diagnostics concat in analyze.ts. Local to the analysis unit; low blast radius.

### CN-15 — Hand-written string-code OR-chain reason classifiers (code==="x" || code.startsWith("y") bucketing free-form reasons into a closed taxonomy)
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two / PRODUCT §Generic-Computation-Regime
- recurs in: triage/triage.ts, shared/blocking_reason.ts, analysis/retry_forensics.ts, analysis/liveness.ts, analysis/edge_attempts.ts, contracts/carrier_domain_catalog.ts
- recommendation: triage/triage.ts:59-131 has 5 such classifiers in one module; shared/blocking_reason.ts metadataForCode/preservesLegacyReasonDetail encode the same SDLC reason->classification by hand. These are also behavioral-F_D smells (read-model projection deciding meaning). Centralize a single code->classification table; reuse from triage and blocking_reason.

### CN-16 — Register + RegisterAdmission envelope pair (status 'admitted'|'rejected'|'not_required' + targetAssetType + register|null + blockingReasons + evidenceRefs)
- clause: DESIGN_MODULE_METHOD §11C Recurrence rule-of-two
- recurs in: operator/carriers.ts, graph/target_carrier_contracts.ts, operator/edge_gain_closure.ts
- recommendation: operator/carriers.ts:792/925/964/1209 declare four peer SdlcXRegisterAdmission interfaces with parallel *AdmissionStatus unions; the same admit-envelope recurs in graph/target_carrier_contracts.ts (SdlcTargetCarrierCandidateAdmitted/Missing/Rejected). Collapse into one generic SdlcRegisterAdmission<TRegister>. Also extract resolveTargetCarrierAdmissionRefs + a TargetCarrierAdmissionRefs sub-record for the copied targetCarrier* field block + null-coalescing ladder across the four edge records.

---

## D. Negative findings / caveats (honoring the source's own corrections)

- **`event_store.ts` is NOT debt.** My audit hint claimed a T-184 `appendFile`→full-rewrite regression. Direct read shows current state is **append-only** (`appendFile`, lines 8/71) — the regression was reverted. Excluded. (This also makes the earlier T-184-review F2 finding stale against the current tree.)
- **`fd_admission` declared-value-alias consolidation: not substantiated.** Investigated and dropped; do not file.
- **`assurance/` (13 files / 3,177 lines) — backfill for the failed unit.** External importers are only: `index.ts:66` (`export *` public-barrel republish — §5C), `operator/assurance_gate.ts:9` (the **no-op gate** gutted by T-184 LD-016, itself flagged §13 / TD-06, still threaded through dispatch + persisted as an authority artifact), and `operator/carriers.ts:26` (one live **type** import `SdlcTraversalRequirementSatisfaction`). Every `derive*AssuranceLedger` + `foldSdlcAssuranceLedgers` has zero live caller. **Verdict: high-value removal candidate, but NOT a chore-delete** — it is entangled with the no-op gate (dispatch path + persisted artifact) and one live type, and 3 historical tests reference it. Removal is a `design_reframe` coordinated with T-184 LD-016/LD-019, not T-186. See §E.

---

## E. Disposition → tickets

**T-186 (this cleanup; `chore` / `realization_refactor`; behavior-preserving):**
- DC-01 — delete ~43 lines of genuinely-dead internal exports (zero-consumer, no refute contradiction).
- DC-04 — narrow blanket `export *` to explicit named re-exports at the barrels (surface reduction only; **not** per-symbol de-export inside monoliths — those were refuted).
- CN-01..CN-06 leaf-helper dedup — lift `uniqueSorted` / `parseArray` / `isRecord` / `sha256*` / `pathIsInside` into `shared/` and delete per-file copies (mechanical, byte-identical).

**Flagged follow-ups (NOT in T-186 — different change class):**
- DC-02 (relocate ~1,800 lines of test-only fixtures off the public barrel into `test_env`) — needs a test/product decision; some carry unsupported REQ claims.
- DC-03 (~484 lines public-surface / steel-thread-ahead-of-wiring, incl. the 340-line lineage/repair frontier) — `product_reprice` / circle-back; **do not delete blind**.
- TD-01/TD-03/TD-06 monolith decomposition + behavioral-F_D (`launch_contract.ts`, `installed_operator.ts`) — `design_reframe`; this is **T-184's** domain — coordinate, don't duplicate.
- TD-02 Effect-Edge seam extraction (consequence.C spawning subprocesses; 59 write sites) — `design_reframe`.
- `assurance/` subsystem removal (§D) — `design_reframe` coordinated with T-184 LD-016/LD-019.
- CN-10..CN-16 substrate-level templates (parseClosedRecord ~17×, contracts catalog rule-of-four, per-register rule-of-four) — ratify a shared admit helper in `specification_methodology` first (§11C: cross-unit shared law via separate design re-entry), do not normalize by repetition.

_Generated from workflow run `wf_ed6bdf04-e31`. Full structured result: session task `wisbkf7j6`._
