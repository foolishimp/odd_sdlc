---
agent: claude
kind: GAP
topic: SDLC PRODUCT.md + requirements ↔ code/src reconciliation — framework code that should not live in odd_sdlc
status: commentary
method: requirement↔code reconciliation; multi-agent scan with per-finding adversarial verification
scope: build_tenants/typescript/code/src (172 files, ~86k LOC)
authority_note: This is commentary, not ratified specification or design. It proposes re-entry; it does not enact it.
peer_post: ../grok/20260609T022918Z_GAP_sdlc-product-requirement-code-reconciliation.md
created_at: 2026-06-09
---

# Reconciliation Investigation — Framework Code That Should Not Live In odd_sdlc

**Method note.** Scope boundary extracted from PRODUCT.md + 21 requirements + CLAUDE.md by parallel readers, merged into one scope model. Then 12 code units scanned for out-of-scope functionality; **every candidate was adversarially verified** against the scope model (default-to-reject). Result: **26 confirmed violations, 17 rejected**. Bounded to the enumerated candidate set, not an exhaustive tree sweep; per-finding confidence carried through.

**Executive verdict.** Reconciling PRODUCT.md + requirements (the WHAT) against `build_tenants/typescript/code/src` (odd_sdlc's own ODD-native framework realization per TENANT_REGISTRY.md — framework source, not governed-target code) confirms **26 real out-of-scope violations**, all of one root shape: live-run hardening against the `data_mapper` / `hello_world` targets leaked target identity and downstream-stack grammar into the generic framework, almost always *bypassing a generic mechanism that already exists*. The leak is concentrated, not pervasive: only **two** items are high-severity on verification (`result_projection.ts` lineage ranking and `enterprise_core_inventory.ts` target-architecture inventory); most claimed-high findings verified down to medium/low because the offending tokens are additive/inert rather than load-bearing closure law. Remediation is overwhelmingly `realization_refactor` (route through the existing generic path), not `requirement_reprice` — the law already forbids these leaks.

---

## Scope Boundary (from PRODUCT.md + requirements)

odd_sdlc is **governance/runtime law over an arbitrary target project**, not a description of any target. The constructive carrier is GTL graph functions interpreted by ABG; GTL/ABG are substrate. SDLC owns: the generic outcome-driven method (graph overlays, typed traversals, asset/edge ontology, worksite lifecycle), the generic computation regime (F_P/F_D/F_H), the prompt/admission/evaluator boundary, product-side projections over ABG facts, verification authority, and the tenanted realization topology.

Forbidden categories that govern this reconciliation:

- **downstream-tech-specific-command-grammar** — test-runner/build/launch invocation syntax (npm/cargo/pytest/sbt) must not live in framework source; SDLC requires/admits/routes *declared* validator evidence generically (PRODUCT.md#Technology-Capability-Asset, REQ-F-ODDSDLC-017 AC-2, CLAUDE.md#6).
- **tenant-stack-truth / hardcoded-tenant-fixture-paths-and-manifest-names** — stack-specific layout, manifest/directory names, tenant fixture filenames are tenant spec data, consumed generically (REQ-F-ODDSDLC-011 AC-3, REQ-F-ODDSDLC-080 AC-10/11/12).
- **domain-identity-of-target-project** — the target's purpose, subsystem architecture, requirement vocabulary, idiosyncratic filenames must not be inferred into or encoded in framework source (CLAUDE.md#2/#5, REQ-F-ODDSDLC-032, REQ-F-ODDSDLC-046 AC-4).
- **tech-specific-prompt-launch-knowledge-and-defect-grammars** — prompt text hard-coding a stack's launch/build knowledge, and encoded defect/diagnostic grammars, must not become product law (REQ-F-ODDSDLC-087 AC-3/AC-7, CLAUDE.md#6).
- **deterministic-domain-optimization-presumed-from-observed-tech** — a trivial/optimized path needs an explicit product-owned contract or admitted evidence, never inference from a name (REQ-F-RUNTIME-003 AC-5, REQ-F-ODDSDLC-082).

**Load-bearing premise:** the confirmed/rejected split rests on `code/src` being odd_sdlc's *own* framework realization. Where a literal is the tenant's self-reference (its own package, its own CLI worker transport, its own qualification), it is lawful realization; where a literal names the *governed target* (`data_mapper`, `mapper_requirements.md`, CDME subsystems) or a *downstream target stack's grammar*, it is a violation regardless of implementation language. The pivotal discriminator is **load-bearingness**: structurally-identical `npm test` sites were cleared as inert disjuncts (`launch_contract.ts:4197`) while confirmed where the token participates in classification (`prompt_edge_policy.ts:226`).

---

## Confirmed Out-of-Scope Code

Ordered high → low by **verified** severity. Where claimed severity diverged from verification, both are noted (verdicts systematically downgraded "high" claims that turned out additive/inert).

### Category: domain-identity-of-target-project

**HIGH**

- **`src/qualification/enterprise_core_inventory.ts:5-17` (`ENTERPRISE_CORE_COMPONENTS`)** — freezes the governed target's internal subsystem architecture (`TypeResolver, TopologicalCompiler, MorphismExecutor, SynthesisEngine, AdjointCompiler, FidelityVerificationService, CdmeEngine`, …) as the **default required-component set** that `evaluateEnterpriseCoreInventory` blocks qualification on (`requiredComponents ?? capabilityInventory.map(sourceComponent)`, emitting `missing_source_component`). This is `data_mapper`'s (the CDME engine's) business identity encoded as a blocking framework gate; a different target stack could not qualify without editing this source — the defining test of a real violation. *Proper home:* the target's own imported/declared authority surfaces, consumed generically. *Severity: high (claimed high, confirmed high).*

**MEDIUM**

- **`src/workspace/source_input.ts:41` (`detectRole`)** — `relativePath === "specification/mapper_requirements.md"` hard-codes the `data_mapper` target's requirements filename as a recognized `requirement_surface` in generic ingress classification. A target whose requirements file is named differently is not classified unless this constant is edited. The same literal recurs across ~8 framework files. *Proper home:* generic `specification/requirements/` topology + project-declared imported-authority list (`00-imported-sources.md`). *Severity: medium (claimed high → verified medium; degraded classification, not a hard break).*

- **`src/workspace/project_profile.ts:954-956` (`workspaceAuthorityRelativePaths`) and `1039-1041` (`readOrderLines`)** — both enumerate `specification/mapper_requirements.md` as a preferred-ordering / primary-read-order authority path, despite the lawful generic channel (`importedSourceRelativePaths` / `IMPORTED_SOURCES_RELATIVE_PATH`) sitting immediately adjacent. *Proper home:* the existing generic imported-sources discovery channel. *Severity: medium each (claimed high → verified medium; inert for non-data_mapper tenants).*

- **`src/workspace/project_profile.ts:1014-1017` (`ontologyAnchorLines`)** — heading-detection regex includes tokens `morphisms`, `fidelity`, `error domain` — the `data_mapper`/formal-mapping domain ontology vocabulary (same triple in `enterprise_core_inventory.ts`), absent from odd_sdlc's own constitutional surfaces. *Proper home:* spec-method-neutral markers (`^INT-`, `^REQ-`) + generic spec words; domain-ontology vocabulary stays with the target's imported authority. *Severity: medium (confirmed medium).*

- **`src/analysis/types.ts:19-26` (`SDLC_FD_RUN_ANALYSIS_PROFILE_VALUES`)** — the framework-source profile enum is **closed** over two named governed targets (`"hello_world"`, `"data_mapper"`) plus `"generic"`, and the names carry behavioral payload (per-target thresholds, `expectedRetryFloor`, lineage flags via a name switch in `profiles.ts`; `analyze.ts:362` branches on `"hello_world"`). Onboarding a third target requires editing this enum. *Proper home:* an open profile identifier resolved from admitted tenant profile spec data; framework retains only the `generic` default. *Severity: medium (confirmed medium).*

- **`src/analysis/analyze.ts:358-364` (`outcomeClassForAnalysisProfile`)** — `trivialProduct: profile === "hello_world"` infers a product's domain character (trivial → `framework_smoke`) from a name-equality test. The same primitive is called the *correct* declaration-driven way at `start/public_start.ts:355` via `truthyCapability(profile, "trivial_product")` — proving the generic mechanism exists and is bypassed here. *Proper home:* a declared `trivial_product` capability through `resolveSdlcTraversalOutcomeClass`. *Severity: medium (claimed high → verified medium; post-hoc analyzer, not the live closure engine).*

**LOW**

- **`src/analysis/profiles.ts:9-19,45-56,88-89` (`HELLO_WORLD_PROFILE` / `DATA_MAPPER` counterparts / `resolveSdlcFdRunAnalysisProfile`)** — named sibling targets as code constants with per-target tuned thresholds and policy flags, resolved by a name switch; no config-backed loading path, so the `policy://` strings are inert labels. *Proper home:* config-backed tenant profile spec data resolved generically. *Severity: low (claimed high → verified low; read-only F_D tooling, operator-selected, generic default works).*

- **`src/spec_method/entry.ts:289-297` (`DEFAULT_SOURCE_PATHS`)** — lists `specification/mapper_requirements.md` among default source-discovery paths. A real identity leak, but **behaviorally inert**: existence-gated and redundant with the recursive `visit()` walk that discovers any tenant's real spec files. *Proper home:* generic spec surfaces + the extension-typed walk. *Severity: low (claimed high → verified low; portability not broken).*

- **`src/qualification/enterprise_core_inventory.ts:30-108` (`ENTERPRISE_CORE_CAPABILITY_INVENTORY`)** — hard-codes the target's `cdme_*` capability catalog, subsystem→evidence-contract prose, and **target-owned** requirement refs (`REQ-TYP/LDM/TRV/ADJ/FID…`, not framework `REQ-F-ODDSDLC-*`) as the gate's default. Shipped framework code, not a fixture. *Proper home:* the target's own capability catalog as admitted authority; at most a non-exported proving fixture for the B-068 probe. *Severity: medium (claimed high → verified medium; default gate truth, bounded to the probe).*

- **`src/qualification/enterprise_core_iteration_sandbox.ts:425-462` (`constructScriptedEnterpriseCoreConstructorPlugin`)** — scripts a construction sequence naming the target's `TopologicalCompiler/MorphismExecutor/SynthesisEngine/RunManifestManager` as the expected materialization sequence, requirement-traced under `code/src/qualification/`. Orphaned (not re-exported), which bounds blast radius. *Proper home:* a tenant-local proving fixture (`build_tenants/typescript/test_env/`) with synthetic component names. *Severity: medium (confirmed medium).*

### Category: hardcoded-tenant-fixture-paths-and-manifest-names

**HIGH**

- **`src/operator/plugins/transform/result_projection.ts:1552` (`requirementLineageAuthorityRank`)** — `ref.endsWith("/specification/mapper_requirements.md")` awards rank 1 inside a pure lineage-authority ranker. Line 1551 already covers generic `/specification/REQUIREMENTS.md`; line 1552 bolts on one target's filename, so a differently-named tenant falls through to default rank and mis-ranks its canonical trace. *Proper home:* recognize only generic requirements topology; the project-specific filename comes from the conformed project's declared spec topology. *Severity: high (confirmed high — embeds governed-target identity into framework ranking law and recurs widely).*

**MEDIUM**

- **`src/operator/plugins/evaluate/postflight_checks.ts:2347-2364` (`requirementLineageAuthorityRank`)** — same `mapper_requirements.md` ranking leak in the evaluate plugin; additive over the lawful generic surfaces. *Proper home:* generic `specification/requirements/` + declared imported-authority surface. *Severity: medium (confirmed medium).*

- **`src/operator/plugins/transform/launch_contract.ts:225, 2621, 5965` (`TRAVERSAL_AUTHORITY_PATHS` / `expandedRequirementAuthorityRefs` / `requirementLineageAuthorityRank`)** — three sites list/classify/rank `specification/mapper_requirements.md` as a recognized authority surface; generic requirement topology already sits adjacent. *Proper home:* the existing imported-sources discovery mechanism. *Severity: medium (claimed high → verified medium).*

- **`src/operator/product_materialization/authority.ts:1638-1639` (`designSourceTargetSeedFromComponentRelativePath`)** — excludes `.test.`/`.spec.` infixes as test-file markers (JS/TS naming). Python `test_*.py` / Go `*_test.go` are not caught, so they mis-seed as source. **Category corrected** to file-*naming* grammar. The same file already implements the lawful `TenantStackTargetSeed` mechanism (`stackSection "testing"`) that this bypasses. *Proper home:* derive source-vs-test from the tenant-declared testing-stack/file-target roles. *Severity: medium (confirmed medium).*

- **`src/operator/product_materialization/authority.ts:514,523` (`targetsFromDeclaredModuleTargets`)** — appends a literal `/src` per-module source subtree to a bare module name from PRODUCT.md; no `moduleLayout` indirection. A flat/`lib/`/`packages/<m>/src` target gets wrong synthesized authority targets. *Proper home:* tenant realization profile declaring per-module source layout. *Severity: medium (confirmed medium; soft expectation targets).*

- **`src/analysis/analyze.ts:211-290` (`TEST35_CONCEPTUAL_STAGES`)** — the **stage content is lawful generic SDLC lifecycle law**; only the **identity labeling** leaks: the constant name and every `test35://stage/...` ref bind the generic expected-pipeline to one named `data_mapper` live-run scenario. *Proper home:* derive canonical stage refs from the generic edge/graph-function catalog (`sdlc://stage/...`); scenario identity stays in fixture data. *Severity: low (claimed medium → verified low; labeling defect, runs identically across scenarios).*

**LOW**

- **`src/operator/product_materialization/authority.ts:221-223` (`declaredProductTargetLooksLikeDirectory`)** — special-cases `"project"` as a directory; this is SBT/Scala's build-definition directory, declared only by the `scala_spark` tenant's `TECH_STACK.json` (which *already declares* `project/`). *Proper home:* consume the tenant's declared directory list. *Severity: low (confirmed low).*

- **`src/analysis/render_markdown.ts:243-248` (`renderConceptualStageCoverage`)** — fixed `"## Test35 Conceptual Stage Coverage"` heading and `"test35 stage"` column bake a proving-fixture scenario name into the operator-facing read model (propagates through `test35StageRef`). *Proper home:* generic labels; scenario id flows as a data value. *Severity: low (confirmed low).*

### Category: downstream-tech-specific-command-grammar

**MEDIUM**

- **`src/operator/plugins/transform/prompt_edge_policy.ts:226,238` (`isCurrentEdgeDownstreamTestPressure`)** — matches the literal `"npm test"` in pressure classification. Confirmed (vs. the cleared `launch_contract.ts:4197`) because the discriminator is token load-bearingness; a cargo/pytest/sbt tenant emits a different command and is silently missed. *Proper home:* match technology-neutral SDLC pressure identifiers; read command grammar from the tenant capability declaration / `testExecutionContract`. *Severity: medium (claimed high → verified medium).*

**LOW**

- **`src/operator/review_grade_edge_fulfillment.ts:191-193` (`reviewGradeFindingIsDownstreamStagePressure`)** — string-matches `"process-exit-plus-stdout"`, `"node --test"`, `"npm test"` against worker prose. Mitigated: the real routing is gated by typed `failureClass`/`targetAssetType`; these are redundant OR-clauses. *Proper home:* keep neutral role tokens + typed gating; route declared test-runner evidence against `testExecutionContract`. *Severity: low (claimed medium → verified low).*

- **`src/operator/plugins/evaluate/prompts.ts:1059` (`reviewGradeEdgeFulfillmentPromptLineGroups`)** — the review-rule prompt line names `"npm test"` as the example; the rule is already stated generically, so the token is droppable with no loss and is inconsistent with the file's own neutrality discipline (lines 983-985). *Proper home:* reference the declared `role=test` targets generically. *Severity: low (claimed medium → verified low).*

### Category: tech-specific-prompt-launch-knowledge-and-defect-grammars

**MEDIUM**

- **`src/operator/plugins/consequence/repair_reentry.ts:575-578` (`diagnosticNeedlesForRepairRow`)** — grep needles hard-code a specific toolchain's compiler/test defect grammar (`"type mismatch"`, `"Cannot prove"` — companion fixture feeds Scala/SBT `Int <:< AnyRef` proof errors — and `"test_compile_failed"`, *not* the framework's `succeeded/failed/pending/not_run` vocabulary). Generic row-derived needles still fire, so a Rust/Python tenant gets degraded (not blocked) excerpting. *Proper home:* tenant-declared diagnostic-phrase data (`TECH_STACK.*`/`TESTING_TECH_STACK.*`); key excerpting off admitted evidence/row refs. *Severity: medium (confirmed medium).*

**LOW**

- **`src/operator/transport.ts:147-172` (`claudeArgs`)** — hard-codes the Claude Code CLI's proprietary launch grammar (`-p`, `--output-format stream-json`, `--disable-slash-commands`, `--permission-mode bypassPermissions`, …). Owning worker transport is lawful (REQ-F-ODDSDLC-051/052/053), and a generic transport path already exists (`admitWorkerTransport` parses `process://` → `[...transport.args, manifestPath]`); only the per-tool flag grammar is the avoidable embedding. *Proper home:* a worker capability-contract declaration carrying launch command/flags/parser, through the existing transport contract. *Severity: low (claimed high → verified low; tenant realization layer, generic fallback works).*

  *(Sibling per-tool transport sites — `codexArgs`, `transportAgentKey`, `parserForWorkerTransport`, the `agentKey==="codex"` output-path branches, `installed_operator.ts` — were **rejected**: they route the F_P *worker* backend, orthogonal to the target stack, and are owned worker-transport realization. `claudeArgs` is confirmed only as the low-severity "even worker-launch defaults ideally come from a declared capability asset" residual.)*

### Category: tenant-stack-truth

**LOW**

- **`src/workspace/project_profile.ts:153-159` (`canonicalTenantName`)** — hard-codes `spark_scala → scala_spark` alias normalization for one stack; the live canonical name is `scala_spark` everywhere and the alias appears only in `docs/old/`, so this is framework code compensating for a stale legacy reference. Also a correctness hazard: any project legitimately declaring `spark_scala` is silently rewritten. *Proper home:* tenant-declared identity (`TENANT_REGISTRY.md` / `active_tenant`), or simply fix the stale reference. *Severity: low (claimed medium → verified low).*

### Mixed-category (target-identity + downstream-grammar)

**LOW**

- **`src/operator/plugins/transform/prompt_edge_policy.ts:851` (`outcomeDirectivesForWorker`)** — the worked example `// requirement:data_mapper.requirements.req_dq_001` bundles two claims; verification split them. The `//` comment syntax is **not** a violation (the directive itself says "native comment syntax"; a Python worker writes `#`). The `data_mapper.requirements.req_dq_001` value **is** a target-identity leak — the canonical-id *format* is lawful framework law (`CANONICAL_REQUIREMENT_REGEX`), but the concrete example value names the live target plus a concrete business requirement. *Proper home:* a tenant-neutral placeholder (`<project>.requirements.<req_id>`); the format stays framework-owned. *Severity: low (claimed high → verified low).*

---

## Rejected / Lawful-On-Inspection

These 17 candidates verified `isRealViolation:false` — do not re-flag:

**Worker-transport backend (F_P constructor axis, orthogonal to target stack; owned per REQ-F-ODDSDLC-051/052/053):**
- `transport.ts:109-145` (`codexArgs`), `:15-30` (`transportAgentKey`), `:276-282` (`parserForWorkerTransport`) — route the agentic *worker* CLI, not the target tenant stack; `TracedProcessParser` is an ABG-owned enum; a generic declared-args path already overrides defaults.
- `installed_operator.ts:4071-4074/4514-4517/5131` (`outputLastMessagePath`, `agentKey==="codex"`) — the consumer half of the lawful codex transport mechanic; depends on which worker CLI drives construction, not the target stack.

**Inert/generic-token classifiers:**
- `launch_contract.ts:4197,4209` (`isCurrentEdgeDownstreamTestPressure`) — `"npm test"` is an inert redundant disjunct gated behind generic tokens; removing it doesn't change classification for a non-npm tenant (the load-bearingness discriminator vs. the *confirmed* `prompt_edge_policy.ts:226`).

**Generic/self-referential layout & tenant identity (tenant realization, not framework law):**
- `authority.ts:1643-1648` (`src/`/`lib/`/`app/`/`code/` heuristic) and `observation.ts:50-74` (`src`/`test` role inference) — cross-ecosystem conventions, overridable fallbacks after declared authority wins.
- `launch_contract.ts:1871,1875` (`?? "typescript"` default tenant) and `project_profile.ts:400,608` (`nonEmpty(active,"typescript")`) — unreachable defensive fallbacks; self-reference to the tenant the code realizes; a tenant *name* carries no ecosystem grammar.
- `work_category_governance.ts:58` (`node_modules/@odd-sdlc/typescript-tenant/...`) and `installed_initial_state.ts:105` (`node_modules/.bin/<cmd>`) — resolve odd_sdlc's *own* published package/CLI binaries in its own Node realization; self-reference.

**Lawful framework_smoke / trivial-product mechanics (REQ-F-ODDSDLC-082 AC-3/AC-4, PRODUCT.md trivial-product law):**
- `public_start.ts:376-397`, `:450-486`, `:375/449` (`frontDoorTraversalSelection` / `overlayTraversalSelection` / `upstreamRef`) — `framework_smoke`/`hello-world` is the framework's own degenerate self-test class, gated on the *admitted* conformed-profile `trivial_product` capability (not inferred from tech). Only residual is a DRY refactor.

**Tenant qualification surfaces / proving fixtures (owned concern, correct locality):**
- `profiles.ts:21-31/58-69/90-91` (`DATA_MAPPER_PROFILE`) — read-only, operator-`--profile`-selected, generic-defaulted diagnostic thresholds; no auto-inference path.
- `enterprise_core_iteration_sandbox.ts:327-332` (`/workspace/data_mapper_enterprise_core_minimal`) — synthetic B-068 proving scenario label in a non-exported qualification harness.
- `rc_qualification.ts:21-100` (npm-command gate rows) — the TypeScript tenant's own frozen self-qualification report; embedding its own declared commands *satisfies* the declared-command-evidence requirement (REQ-F-ODDSDLC-058/061).

---

## Patterns & Root Causes

Three recurring shapes, one root cause: **live-run hardening against the `data_mapper`/`hello_world` targets leaked target identity and downstream-stack grammar into the generic framework, bypassing generic mechanisms that already exist.**

1. **The `mapper_requirements.md` recurrence (target-fixture filename as framework law).** One governed target's idiosyncratic requirements filename is special-cased across ~8 framework files (`source_input.ts`, `project_profile.ts` ×2, `launch_contract.ts` ×3, `postflight_checks.ts`, `result_projection.ts`, `spec_method/entry.ts`) in ingress role-detection, authority-path lists, and lineage rankers. **Breaches** domain-identity / hardcoded-fixture-paths (CLAUDE.md#2, REQ-F-ODDSDLC-046 AC-4). The framework *already owns* generic per-project authority discovery (`importedSourceRelativePaths` / `00-imported-sources.md`), which every site bypasses.

2. **Named-target constants/enums (target identity as code structure).** `data_mapper`/`hello_world` appear as closed enums (`analysis/types.ts`), name-keyed profile switches (`profiles.ts`, `analyze.ts`), name-equality outcome branches (`analyze.ts:362`), and a frozen target-subsystem inventory used as a default qualification gate (`enterprise_core_inventory.ts`). **Breaches** the rule that SDLC governs the target without naming/describing it; per-target tuning must be config-backed profile data (REQ-F-ODDSDLC-011 AC-3, REQ-F-ODDSDLC-032). The correct declaration-driven path exists (`truthyCapability(profile,"trivial_product")`) and is used elsewhere.

3. **Downstream tech grammar embedded in classifiers/prompts/diagnostics.** `npm test` / `node --test` test-runner syntax in pressure classifiers and prompts (`prompt_edge_policy.ts`, `review_grade_edge_fulfillment.ts`, `prompts.ts`), Scala/SBT defect phrases in repair needles (`repair_reentry.ts`), JS/TS `.test.`/`.spec.` file-naming and SBT `project/` directory grammar in materialization (`authority.ts`), and the Claude CLI flag grammar in transport (`transport.ts`). **Breaches** downstream-tech-specific-command-grammar / defect-grammars / tenant-stack-truth (REQ-F-ODDSDLC-017 AC-2, CLAUDE.md#6). The lawful surfaces — `testExecutionContract`, `TenantStackTargetSeed`, declared capability assets — already exist and are bypassed.

Secondary shape: **proving-scenario identity (`test35`) leaking into generic analyzer/read-model naming** (`analyze.ts`, `render_markdown.ts`), where the stage *content* is correct generic law but the *labels/refs* are branded with a fixture scenario.

---

## Recommended Re-Entry

Nearly every cluster resolves to **`realization_refactor`** — the generic mechanism already exists and the law already forbids the leak; code bypassed it. None require `requirement_reprice`. Grouped into remediation tickets (no time estimates; sequencing only):

**R1 — Eliminate `mapper_requirements.md` from framework authority/ingress/lineage law** (`realization_refactor`). Sites: `source_input.ts:41`, `project_profile.ts:954-956/1039-1041`, `launch_contract.ts:225/2621/5965`, `postflight_checks.ts:2347-2364`, `result_projection.ts:1552` (lone confirmed-high), `spec_method/entry.ts:289-297`. Route all requirement-surface recognition and lineage ranking through generic `specification/requirements/` topology + the existing `importedSourceRelativePaths`/`00-imported-sources.md` channel.

**R2 — De-name the analysis profile space** (`realization_refactor`). Sites: `analysis/types.ts:19-26`, `analysis/profiles.ts:9-91`, `analyze.ts:358-364`. Open the profile identifier to admitted tenant profile spec data; replace `profile === "hello_world"` with `truthyCapability(profile, "trivial_product")` (pattern already at `public_start.ts:355`); retain only `generic` in source.

**R3 — Lift target-subsystem qualification inventory out of framework source** (mixed: the default-gate aspect is `realization_refactor`; if the required-component set is genuinely framework law for any target, that is `requirement_reprice` — verdicts indicate target-owned, so refactor). Sites: `enterprise_core_inventory.ts:5-108`, `enterprise_core_iteration_sandbox.ts:425-462`. Consume the component/capability inventory as admitted tenant authority; relocate any retained B-068 proving material to a non-exported `build_tenants/typescript/test_env/` fixture with synthetic names.

**R4 — Drop downstream command/defect/file-naming grammar from generic classifiers** (`realization_refactor`). Sites: `prompt_edge_policy.ts:226/238`, `review_grade_edge_fulfillment.ts:191-193`, `prompts.ts:1059`, `repair_reentry.ts:575-578`, `authority.ts:1638-1639` (`.test.`/`.spec.` → `TenantStackTargetSeed`), `authority.ts:221-223` (`project` → declared directory list), `authority.ts:514/523` (`/src` → declared module layout). Home: `testExecutionContract` / `TECH_STACK.*` / `TESTING_TECH_STACK.*` capability declarations.

**R5 — Lift the Claude CLI launch grammar into a declared worker capability asset** (`realization_refactor`, low). Site: `transport.ts:147-172` (`claudeArgs`). Carry launch command/flags/parser as a declared worker capability-contract asset through the existing `transport.args` contract; remove the `agentKey`-branched hardcoded builder.

**R6 — De-brand generic analyzer stage identity from `test35`** (`realization_refactor`, low). Sites: `analyze.ts:211-290` (`TEST35_CONCEPTUAL_STAGES`, `test35://stage/...`, `test35StageRef`) and `render_markdown.ts:243-248`. Rename to generic conceptual-stage refs (`sdlc://stage/...`) and neutral headings; scenario id flows as a data value.

**R7 — Remove the `spark_scala` alias special-case and the `data_mapper` prompt example** (`realization_refactor`, low). Sites: `project_profile.ts:153-159` (consume tenant-declared identity / fix the stale `docs/old/` reference) and `prompt_edge_policy.ts:851` (tenant-neutral placeholder; canonical-id format stays framework-owned).

---

*Investigation produced by a 63-agent reconciliation workflow (scope extraction → 12-unit scan → per-finding adversarial verification → synthesis). 43 candidates raised, 26 confirmed, 17 rejected. Commentary, not law — proposes re-entry, does not enact it.*
