# REVIEW: TypeScript Tenant Independent Code Review

**Author**: Claude
**Date**: 2026-04-27T02:00:00Z
**Scope**: `odd_sdlc/build_tenants/typescript/code/src` and adjacent `qualification/` and `test_env/live` surfaces, read independently of Codex's `20260427T005906Z_REVIEW_stdo_governance_typescript_work_against_python.md`.
**Posture**: Commentary, not law. Reviewer-only; no code changes.

## Method Anchoring

I read directly:

- `SPEC_METHOD.md` (constitutional chain, change classes, trace closure)
- `ODD_METHOD.md` (graph-function-as-carrier, ABG-owned continuation, outcome-first realization)
- `DESIGN_MODULE_METHOD.md` (effect-shell discipline, projection-source coherence law)
- `TICKET_METHOD.md` (governance-scope expansion, RC qualification gates)

Findings are anchored to `file:line` against the TS tenant. STDO scope letters S/T/D/O are used to anchor each finding to the constitutional method whose authority is at stake.

## Agreement And Delta With Codex

I read Codex's review only after forming my own. Where I converge:

- Bounded RC vs full Python replacement is the load-bearing distinction (their §1; my §1 below).
- `cli/command.ts` is carrying multiple roles (their §3; my §4).
- T-053 proves boundary mechanics, not behavioural sufficiency (their §4; my §6).
- Package install/release should drift toward ABG (their §5; my §7).

What Codex underweights or omits, and where this review adds value:

- The "executive graph functions" are flatten-concatenations of leaf vectors, not graph programs (§2 below). This is the strongest divergence from ODD_METHOD §11.7.
- The `assertModuleMatchesCatalog` structural-drift guard in `query_domain.ts` is a genuinely novel and method-aligned realization of DESIGN_MODULE_METHOD's projection-source coherence law (§3 below). Codex did not call it out.
- `rc_qualification.ts` is a hand-curated frozen object that asserts its own verdict (§5 below). It is correct content but a category error in carrier terms.
- `DEFAULT_PACKAGE_SOURCE_ROOT` and `defaultAbgPackageSourceRoot` in `cli/command.ts` (lines 132–149) embed filesystem-shape heuristics into the CLI module. Codex's CLI critique is too narrow.
- The hook postflight evaluator (§8) checks a real materialization predicate but treats `materialized=true` as truth on the worker's word. This is shape, not evidence. Codex did not separate these.

## Findings

### 1. High [O,S]: the bounded RC claim is correctly scoped, but `rc_qualification.ts` self-attests its own verdict

The non-claim is recorded in `build_tenants/typescript/code/src/qualification/rc_qualification.ts:9-13`:

```
nonClaimedScope: ["full operational Python replacement at Python historical multi-edge data_mapper realization depth"]
```

This is the right place to put it and the wording is precise. The verdict (`bounded_rc_ready`) and the gate list (`rc_qualification.ts:16-103`) are also internally coherent.

The structural concern is that `verdict` is hard-coded into the same module that publishes the claim. There is no derivation from observed gate outcomes — `status: "passed"` for each gate is a string literal in the source. If a downstream gate were to fail, the report would still publish `bounded_rc_ready` until a human edits this file. SPEC_METHOD §"Derived artifacts" wants verdicts derivable from evidence, not asserted.

This is a low risk in practice (the gate list is short and human-edited each release) but a category error worth fixing before this file scales. A `deriveRcReport({ semanticPassed, sandboxPassed, livePassed, ... })` function over admitted gate outcomes would put the report on the right side of the projection-source coherence law (`DESIGN_MODULE_METHOD.md` 2026-04-26 amendment).

### 2. High [O]: "executive graph functions" are flat vector concatenations, not graph programs

`graph/module.ts:310-372` (`constructExecutive`) builds an "executive" by:

1. flat-mapping `materializeGraphFunction(f).vectors` for each leaf function,
2. taking the last vector's target as the executive's output,
3. computing inputs as "vectors' source nodes that no later vector produces."

That is a topological-sort-by-position over a hand-ordered list. It is not a graph program in the GTL/ABG sense. There is no:

- gating, fan-out, or fan-in (`gtl.algebra` exposes these but they are unused);
- explicit refinement boundary or candidate family (none in the module — see `module.ts:464-465`, both arrays empty);
- evidence that the order is constrained by anything other than the order of `BOOTSTRAP_RELEASE_FUNCTION_CATALOG` in `graph/catalog.ts`.

By ODD_METHOD §11.7, a graph function is a published reusable form whose composition is itself a declarative graph. By that definition, `bootstrap_release_self_test` and `release_operational_cycle` are not graph functions — they are name-stamped arrays of leaf vectors.

This is harder to fix than it looks because the leaves themselves are also single-vector edges (`graph/module.ts:195-225`). The correct shape is to define explicit composition operators (`compose`, `gate`, `fan_out`, `fan_in`, `recurse`) over published library forms, then build executives from those operators. Until that lands, the `executive` tag in `module.ts:345` is overstating what the carrier publishes.

Codex flagged "future route binding ... should be lifted into reusable graph-program forms" but did not name this as a gap in the *current* executive — only as future work. The current executives already fail the bar.

### 3. Medium [D]: the structural-drift guard in `query_domain.ts` is the best DESIGN_MODULE_METHOD realization in the tenant

`projection/query_domain.ts:assertModuleMatchesCatalog` (around lines 200–340 in the file) compares a candidate module's published graph functions against `constructSdlcGtlModule()` by:

- structural signature (id, input/output names, vector signatures, declaration signature, tags, effects);
- start-target signature (job-name → graph-function-id → graph-function-name);
- presence of expected names and absence of unexpected names.

This directly realizes DESIGN_MODULE_METHOD's 2026-04-26 amendment requiring projections to derive from admitted carrier truth or fail closed on structural drift. Same-name-different-shape drift is detected, not just missing-name drift. This is the kind of guard SPEC_METHOD wants every projection module to carry.

This pattern should be lifted into ABG as a reusable `assertProjectionDerivesFromModule` substrate so other tenants do not have to re-author it. It is currently locked inside a private function in this projection. (Compare Codex §5: same conclusion class for package binding, but stronger argument here because this code is more clearly substrate-shaped.)

### 4. Medium [D]: `cli/command.ts` is not yet a monolith, but it has embedded substrate heuristics

Codex called for splitting the CLI by command kind. I see that, but I think the more urgent issue is two embedded heuristics:

- `DEFAULT_PACKAGE_SOURCE_ROOT = resolve(CLI_MODULE_ROOT, "../../../../..")` (`cli/command.ts:131-132`). Five-level relative ascent from a built `.js` file's URL is a fragile coupling between source layout and runtime resolution. If this code ships from a different relative position (e.g., a flatter `dist/`), the default breaks silently.
- `defaultAbgPackageSourceRoot()` (`cli/command.ts:134-147`) probes `node_modules/@abiogenesis/typescript-tenant`, then falls back to `../../@abiogenesis/typescript-tenant` (a sibling-monorepo assumption). This is workspace-layout knowledge baked into the public CLI.

Both belong in the install adapter or in workspace ingress, not in command parsing. The fix is one carrier (`OddSdlcTypescriptDistributionLayout`) admitted at install time and threaded through, not two `resolve()` calls in the option parser.

The role-spread Codex flagged is real but secondary — most of `commandPayload` (lines 477–491) is a clean dispatch over admitted requests. The split into `runOddSdlcCli` and `runOddSdlcCliAsync` (lines 511–536) is also defensible: sync surfaces stay sync, side-effect surfaces go async.

### 5. Medium [O,S]: `Implements:` header comments are the only trace anchor and are unverified

Every source file opens with one or more `// Implements: REQ-F-ODDSDLC-NNN` lines (e.g., `cli/command.ts:1-2`, `graph/library.ts:1-6`, `package_binding/node_package.ts:1`). This is the visible traceability surface from code → requirement.

There is no test or build step (that I found in `npm run test:semantic` setup) that:

- verifies every `REQ-F-ODDSDLC-*` referenced exists in `specification/requirements/`;
- verifies every live requirement has at least one `Implements:` reference;
- detects references to retired or renamed requirements.

This means `requirement_closure.ts` projects requirement closure against admitted authority (good), but the carrier pointing back to those requirements is grep-only (weaker). SPEC_METHOD treats missing traceability as a defect; the trace is technically present but not enforced.

A small verifier (admit the requirement set, scan source for `Implements:` headers, fail closed on dangling refs) would close this. This is genuinely lower priority than §1 and §2 but ties into the structural-drift theme: drift between code annotations and the requirement carrier is currently silent.

### 6. Medium [O,T]: T-053 acceptance is single-edge and shape-oriented (concur with Codex §4, narrower)

Codex covered this. Adding precision:

`test_env/live/test_t053_live_fp_data_mapper.test.mjs:217-237` admits the result on `existsSync(outputFile) && content.trim().length > 0`, then computes a sha256 and stamps `materialized: true, satisfied: true` into the constructor result — the test itself authors those bits. The hook postflight then evaluates a record the test just hand-built. The check is not "did the worker produce a satisfied generated asset" — it is "did the test author a record claiming the worker did, with non-empty bytes."

`readGeneratedWorkReport` (`test_t053_live_fp_data_mapper.test.mjs:262-278`) reads the worker's own `work_report.json` and asserts `kind`, `graphFunctionName == "derive_code_surface"`, target asset type membership, generated file path equality, and non-empty summary string. This is shape conformance against a worker self-report, not external attestation.

For a bounded live-edge claim, this is acceptable. To support a behavioural-sufficiency claim, the postflight would need:

- a `tsc --noEmit` (or equivalent) on the generated file;
- a deterministic test execution against the generated artifact;
- an external (non-worker-authored) attestation of `materialized` and `satisfied`.

This matches Codex's "compile, test report, generated source inventory, generated test inventory" optimisation but with the diagnosis grounded in which assertion in which file is the authority for which fact.

### 7. Low [D]: package binding mechanics are correct but should not live in `odd_sdlc`

Concur with Codex §5. Adding: `package_binding/node_package.ts:129-186` (`locateDependencySource`, `extractPackage`, `linkPackageDependencies`) is a generic Node package-extract-and-link substrate. It walks parents looking for `node_modules/<name>`, extracts a tarball under a temp dir, copies to `node_modules/<name>`, then symlinks transitive dependencies. Nothing in this code is `odd_sdlc`-specific.

The `bindCommand` function (`node_package.ts:188-206`) hardcodes `node_modules/.bin` and chmods the target to 0o755. This is npm-shape knowledge that ABG (or a build-substrate package) should own.

The migration is straightforward: move `node_package.ts` carriers and functions into `@abiogenesis/typescript-tenant/app/package-binding`, leave `installer.ts` here as the thin product-identity-aware caller. No public API change — `installer.ts:installPackedNodePackage` already imports from `../package_binding/index.js`.

### 8. Low [D]: hook postflight evaluator is shape-strict but evidence-light

`hooks/evaluators.ts:104-186` (`evaluateSdlcHookPostflight`) checks an impressive 12 distinct blocking reasons against a `SdlcWorkReport`. The strict checks are:

- edge-name and edge-class match the contract;
- target binding declares the contract output;
- output identity declared type matches the target asset type;
- output identity is bound to the target binding;
- requested operation matches operation type;
- generated-asset authority binds to the contract's edge name and target asset type;
- generated-asset authority's target asset id matches output identity asset id;
- generated-asset contract's target asset id matches output identity asset id;
- evidence refs are non-empty;
- ambiguity candidates and foreign realization candidates are absent.

That is a strong shape contract. What it does not check:

- evidence ref *targets* exist or hash to the digest claimed in `outputIdentity`;
- `materialized: true` is independently confirmed against the filesystem or a runtime probe;
- `satisfied: true` is supported by a deterministic check against the generated asset.

The work report can claim `materialized && satisfied` and the hook will accept it as long as the *shape* of the claim is consistent. This is consistent with the bounded-RC posture (T-053 admits the worker's word as authority for the bounded edge) but it bears repeating: `evaluateSdlcHookPostflight` enforces *contract shape*, not *evidence-for-claim*. The names "preflight_fd"/"postflight_fd" suggest deterministic checks of *facts*; today they are deterministic checks of *coherent self-reports*.

### 9. Low [D]: 815-LOC `enterprise_core_iteration_sandbox.ts` is the right size for what it does, but is a single-file proof harness

`qualification/enterprise_core_iteration_sandbox.ts:519-739` runs the sandbox loop, derives advance/retry decisions, builds events, evaluates iteration-proven-vs-abg-gap-detected. This is the file Codex flagged at 815 LOC.

What I see is that ~60% of the file is carrier definitions, expected-event-sequence constants, scripted-plugin stubs, and postmortem rendering — not actual loop logic. The loop body is `runEnterpriseCoreOutcomeIterationSandbox` (lines 519–739, ~220 LOC) and is dense but readable. Splitting for splitting's sake would not improve it.

What *would* improve it: extracting `constructScriptedEnterpriseCoreConstructorPlugin` (lines 396–465) into a fixtures module so the loop file does not own three different attempts of hand-scripted-component-list test data. Today the loop file mixes the harness (production-shape) with the scenario script (test fixture) which makes it harder to swap in a different scripted scenario.

This is a refactor, not a defect. The current shape is internally coherent.

## Method-Standard Optimisations (additive to Codex's list)

1. Lift `assertModuleMatchesCatalog` into ABG as a reusable projection-coherence guard. Cite it in `DESIGN_MODULE_METHOD.md` as a worked example of the projection-source coherence law.

2. Add a `deriveRcReport` constructor over admitted gate outcomes; deprecate hand-frozen verdicts in `rc_qualification.ts`.

3. Specify (in `ODD_METHOD.md` §11.7 or in a new "Graph Program Composition" appendix) what makes a published graph function actually a graph program vs a flat vector concatenation. Without this clause, "executive graph function" can be claimed by carriers like the current TS tenant's that do not yet meet it.

4. Specify (in `DESIGN_MODULE_METHOD.md`) that `Implements:` header comments require a verifier that fails closed on dangling refs. Currently the trace is convention, not constraint.

5. Specify (likely in a hooks/evaluators clause) that `materialized` and `satisfied` claims in a generated-asset contract require independent attestation, not worker self-report. Today's implementation conflates contract shape with claim evidence.

## Engineering Optimisations (additive to Codex's list)

1. Move `DEFAULT_PACKAGE_SOURCE_ROOT` and `defaultAbgPackageSourceRoot()` out of `cli/command.ts` into an admitted distribution-layout carrier produced at install time.

2. Extract `constructScriptedEnterpriseCoreConstructorPlugin` from `enterprise_core_iteration_sandbox.ts` into `qualification/fixtures/enterprise_core_scenarios.ts` so the harness file no longer owns scenario data.

3. Build a `verifyRequirementImplementsTrace` script that admits the requirement set and scans source for `Implements:` headers; wire into `npm run lint:semantic`.

4. Replace the ordered-leaf flatten in `constructExecutive` with explicit `compose`/`gate`/`fan_out` operators once `gtl.algebra` exposure stabilises in the tenant. Until then, rename "executive" to "ordered_leaf_program" so the carrier does not over-promise.

5. For T-053 successors: have the live worker write its `work_report.json` *and* a separate test process verify `materialized` and `satisfied` independently against the generated file (e.g., `tsc --noEmit`, deterministic test exec, hash check against a registered evidence ref).

## Bottom Line

The TypeScript tenant is significantly closer to ODD_METHOD-compliant carrier shape than the Python tenant — agreed with Codex's headline. The bounded RC claim is supportable.

The two structural concerns I would prioritise above any item on Codex's list:

- **§2** (executives are not graph programs) — this directly affects whether the tenant can claim ODD-native carrier shape when challenged.
- **§5/§8** (verdicts and evidence claims are self-attested) — these undermine the "RC qualification" framing more than the multi-edge depth gap does, because they affect what *current* claims actually mean.

The multi-edge `data_mapper` depth gap (Codex §1, T-041) remains the critical blocker for any "full Python replacement" claim, but for the bounded RC claim, the shape concerns above are more load-bearing.
