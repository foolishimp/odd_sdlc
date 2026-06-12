# REVIEW: T-197 Product Boundary Reconciliation And Code Audit (STDO)

**Author**: grok
**Date**: 2026-06-11T12:00:00Z
**Addresses**:
  - `.ai-workspace/tickets/active/T-197-reconcile-product-boundary-and-remove-authority-leakage.md`
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md` (T-197 addendum)
  - `build_tenants/typescript/code/src/` (B1, A1–A5, H1/H2/H5/H7, W-xxx slices)
  - `build_tenants/typescript/test_env/tests/test_t197_product_gtl_gate.test.mjs`
  - `specification/PRODUCT.md`, `specification/requirements/03-runtime-governance.md`, `14-odd-sdlc-installed-product-contract.md`, `16-edge-gain-closure-contract.md`, `18-typed-construction-algebra.md`
  - `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`, `TICKET_METHOD.md`, `DESIGN_MODULE_METHOD.md`, `ODD_METHOD.md`
**Status**: Commentary (terminal for completed waves; open rows remain active pressure)
**Related**: prior grok GAP 20260609T022918Z, claude GAP 20260609T025417Z, T-184/T-195 completed supersession, T-164 edge baseline, ABI T-152/T-153/T-154

## STDO Governance Context (read first)

STDO is the four-method constitutional governance surface:
- `SPEC_METHOD.md`: specification as sole `WHAT`; design/realization as `HOW`; no silent mutation; traceability mandatory; active surfaces present-tense.
- `TICKET_METHOD.md`: intake triage, change class declaration (`design_reframe`, `realization_refactor`), smallest lawful re-entry, unified ledger with terminal dispositions + proof citations, supersession hygiene.
- `DESIGN_MODULE_METHOD.md`: for design_reframe, publish IACS (irreducible carriers with owner), structural diagrams, reference-to-target derivation, decommission register before realization code; module boundaries explicit; no hidden authority.
- `ODD_METHOD.md`: graph functions primary constructive carrier; ABG owns runtime events/continuation/replay/assurance/fold/transition; product owns meaning, overlays, policy, read models, proof interpretation over admitted truth; no product-local shadow runtime or second closure law.

T-197 declared `governance_scope: STDO Method`, `change_class: design_reframe` (vertical) + `realization_refactor` (horizontal/parts), `re_entry_point: design`. Ticket explicitly lists "Cold Context Start" reading order (PRODUCT, REQs 03/14/16/09/18, staged-compute design, this ticket, GAPs, T-184, abiogenesis substrate, DESIGN_MODULE_METHOD). Dual-axis model (vertical constitutional ownership + horizontal target-identity leakage) merged from two independent GAP posts.

This review read in required order: root README, AGENTS.md/CLAUDE.md, specification/GOALS/INTENT/PRODUCT, requirements/*, ratified design (staged compute boundary), deeper methodology standards, the ticket, GAPs, then code + proof surfaces + git attribution.

## Work Executed (what the ticket and design claim as done)

### Wave 0 / P0 B1 — GTL consumption gate (highest priority, T-152/T-153 close)
- Live inventory builder `gtl_conformance/program.ts` (`constructCurrentSdlcGtlProgramConformanceInput`) assembles from product surfaces: `constructSdlcGraphFunctionCatalog`, `constructSdlcGtlModule`, `constructSdlcTargetCarrierRegistry`, overlays, `SDLC_EDGE_GAIN_CLOSURE_CONTRACTS`, prompt assets (exactly 3), plugin contracts (exactly 5), source identities, T-153 feature coverage (≥26 rows), public starts, etc.
- Gate wired in product paths: `start/public_start.ts:1302`, `spec_method/entry.ts:2197`, `release/release_cut.ts`, `release/release_snapshot.ts`, `build:semantic` via `preflight:gtl` (package.json).
- `assertCurrentSdlcGtlProgramConformance` (and negative: missing target-carrier rows fails with `target_carrier_contract` issue).
- Installed-package path still requires 1 packaged source-identity surface.
- Test coverage in `test:t194` (2/2) + `test:t197` (live counts + negative) + `test:t059` (10/10 installed).

**Verification (this run)**: `npm run test:t197` passed 19/19 after full semantic build + preflight gate. Inventory assertions: graph vectors >0, vectors == target carriers == edge closures, prompt=3, plugin=5, source identities >0, installed source identity=1, feature coverage ≥26, conformance passed, missing-carrier negative closed.

### Wave 1 A-rows — ABG runtime truth (design lock + ABI consumption)
- Design: T-197 IACS (GtlProgramDeclaration, AbgRuntimeTruth, SdlcConsequenceCandidate etc. with owner/<<prime>>/<<authoritative>>/<<downstream>> annotations), mermaid structural carrier diagram (vertical GTL→ABG spine + horizontal tenant ingress rule), full reference-to-target table, decommission register, W-105 construct-site inventory (every `construct*Event` site mapped to ABG route or explicit debt).
- A1: `installed_operator.ts` `replayEventsWithGraphContinuationCursor` now consumes ABI `applyExplicitGraphVectorResumeCursor(...)`; no local vector lifecycle synthesis in production path (source guard + negative test).
- A4: production `construct*Event` (vector, graph-span, fd authority, reentry) removed from `installed_operator.ts` / main paths; only `appendOddSdlcRuntimeEvents` sink remains; cursor/reentry now via ABI `apply*Route`; W-105 inventory + test guard classify remaining sites to B-068 fixture only.
- A3: ratified thin caller — `live_fp_parallel_materialization_frontier.ts` and saga call admit only `executionAuthority: "abg_evented_saga_frontier"` + `abg_branch_execution_policy`; SDLC owns DAG/payload candidates only.
- A5: `traversal_consequence.ts` consequence carriers are product read models (gain, ledger, closure decision, next-action projection); installed convergence requires ABG `terminalKind: "converged"` (via `deriveSdlcInstalledOperatorStatusFromAbgTerminal`); `gap_stop` not promoted by SDLC close; `traversalTransitionRef` now cites ABI runtime continuation transition projection ref (no local `nextActionProjectionRef` substitute).
- A2: `spec_method/entry.ts` + installed start is one-boundary shell (`executeInstalledOperatorStart`); legacy `executeInstalledOperatorStartWithReentry`, loop carriers, `installedReentry` policy controls deleted; layered `--until converged` routes to ABG (`genesis-ts start --until converged` in docs); `installed_operator.ts` no longer owns multi-attempt control loop.
- Design lock (W-100/W-105/W-110/W-115/W-116) preceded realization; T-164 edge proof preserved as gate.

**Verification**: `test:t197` has dedicated A1/A2/A3/A4/A5 guards (source regex on constructors, admission literals, terminal gate, transition-ref, until-converged ownership). W-105 test asserts exact construct-site list (only sandbox fixtures). Design ratification test scans staged-compute md for IACS/diagram/ref-to-target/decommission/W-105 content + all ledger row ids + ticket W-xxx rows. Commits carry explicit "T-197"/"Consume ABI ... for T-197" messages.

### Wave 2/5 B/H rows (GTL read models + horizontal target-identity)
- H1 (highest horizontal): zero occurrences of `specification/mapper_requirements.md` as framework classifier/ranker/ingress law in `code/src` (grep confirmed 0 matches); recognition now only generic `specification/requirements/*` + imported-sources + tenant profile. `deriveSdlcSourceInput` etc. cleaned.
- H2: analysis profile enum opened; only `generic` default remains; behavior via explicit `truthyCapability(..., "trivial_product")` / `sdlc_outcome_class` etc. (no `"hello_world" === profile` switches in core paths).
- H5/H7: prompt pressure and review prompts use neutral `component_test_surface` / `test-execution-contract` / declared roles instead of literal `"npm test"`.
- B2: component-depth register reframed as SDLC read model over GTL target-carrier law (`sdlcTargetCarrierOutputKind`, `sdlcTargetCarrierContractRef`); no local GTL contract constructor.
- B3: prompt assets emit `AssetSurface` + `Node` rows into ABG conformance input; SDLC owns only clause/policy/family overlays.
- B4b: command-string OR disjuncts removed from review-grade routing.

**Verification**: `test:t197` H1 grep guard, H2 profile guard, H5/H7 prompt policy guards, B2/B3/B4b conformance/source guards all pass. `test:t161` capability-driven profile proof. Horizontal ingress rule in design: "tenant source file → specification/requirements/00-imported-sources.md or specification/requirements/* → ... ; forbidden: target filename ... → framework classifier".

### Proof surfaces and hygiene
- `test:t197` 19/19 (this execution, post-build:semantic + preflight).
- `test:t164` baseline preserved (22/22 + Rust sandbox cited in design).
- Semantic proof lane referenced in related (T-198 data-mapper live 969/969 on rc.14 with graph-owned `sdlc_worker_execution_evidence`).
- Design self-audit test inside t197.
- Negative source guards + conformance negative + installed-package gate.
- Ledger in ticket + decommission in design + W-105 inventory + per-row "verification" / "done YYYY-MM-DD" columns with proof refs.

## Code Review Findings (positives)

1. **STDO process fidelity high**. Did not jump to code: dual GAPs → merged active ticket with explicit change class/re-entry → design addendum (IACS + diagram + ref-to-target + decommission) ratified before A-wave realization → per-finding adversarial verification notes → source-level negative guards + self-checking test → explicit commit messages → proof tied to ledger rows. Single authority surface (the ticket) for status; design doc is living ratified surface (enforced by test).

2. **Owner partition clean and enforced**. ABG/GTL surfaces consumed (ABI apply* routes, typecheckGtlProgram, AssetSurface, GtlContractFulfillmentBinding, runEventedNativeSagaFrontier with authority carrier, runtime continuation transition refs). SDLC owns only candidates/read models/policy/meaning. No re-synthesis of runtime events, no local closure fold, no second GTL law, no target filename as generic classifier (H1 zero matches confirmed).

3. **Generic mechanisms used, not bypassed**. Imported-sources + tenant stack profiles + declared capability + truthyCapability + test-execution-contract roles replace all hard-coded target identity and command grammar in load-bearing sites. The design "horizontal ingress rule" and "must-not-name-governed-target" constraint are implemented and guarded.

4. **Proof is adversarial and multi-lane**. Source guards (construct*Event inventory, literal greps), conformance negative (missing carriers), design ratification scan, live counts + invariants (vectors == carriers == closures), installed-package path, t164 preservation, external T-198 live archive. Test explicitly fails closed on deleted authority.

5. **Traceability**. Every major surface cites requirements (e.g. program.ts: REQ-F-ODDSDLC-040/088, Validates: T-197). Ticket cites source docs. Design cites PRODUCT/REQs + ABI T-153/T-154. Commits and ledger rows cross-reference.

6. **No overclaim**. Ticket correctly marks only completed rows "done"; open rows (C1a/C1b transport debt, D1/D2/D4–D6 ecosystem, H3/H4/H6/H8–H12, P1/P3, E-series) remain open with explicit dispositions or notes. Closure law in ticket is precise and not yet satisfied.

## Observations / Minor / Remaining Pressure (commentary)

- H3 `enterprise_core_inventory.ts` + `enterprise_core_iteration_sandbox.ts` correctly scoped as B-068 probe-only (test guard + design callout); current grep reachability is non-default. Any future promotion to live/default gate requires repricing + ticket update first. Monitor.

- D-rows (path regex lane classifier, deterministic traversal method pick, public-start bootstrap, bare `/src`, special dirs) are realization_refactor per ticket; still open. The generic `TenantStackTargetSeed` / `moduleLayout` / declared dir list channels exist; use them.

- C1a/C1b: transport is admitted worker backend (lawful per rejected list and REQ-051/052/053); grammar and session trajectory are tracked debt to B-004. Correctly not deleted here.

- P1 (generated-asset production closure must require selected evaluate.C review-grade + composition identity) and P3 (stale fixture hygiene) transferred from T-184; still open. P2 closed by T-198 (external evidence).

- E6 (nonlocal repair-surface yield / upstream re-entry routing primitive) documented from data_mapper live archive analysis; missing ABG/GTL primitive means F_D consequence cannot yet classify `upstream_reentry` vs same-edge. Ticket correctly treats as tracked missing primitive, not SDLC defect to paper over.

- ABI pin in design/ticket evolved (rc.7 → rc.15 in current surfaces); test and preflight use whatever is wired in node_modules + substrate contract. Keep synchronized with ABI T-154 consumption.

- Source guards are strong for this boundary (regex on constructors + literal presence); complement with runtime/ installed lanes for full closure.

- No authority re-leak observed in the done surfaces. The `append*` sink pattern (T-184) remains lawful; authorship moved to ABI.

## Recommendation

The completed waves (B1, A1–A5, H1/H2/H5/H7, design assets, W-xxx supporting) are well-executed, evidence-backed, and constitutionally aligned under STDO. Continue the same discipline on open rows: design delta if needed, per-row verification + guard extension in test:t197 or focused tests, explicit ABG/GTL route consumption or upstream dependency filing before deletion, update ledger + design decommission, preserve t164 + semantic + installed proof baselines.

When all rows reach terminal (with proof refs), execute W-600: refresh both originating GAP comments with terminal ledger states, confirm closure_law criteria (B1 wired in product, no rival ABG facts, mapper_requirements absent, H3 contained or relocated, P1/P3 terminal or deferred, IACS/diagram/ref-to-target present, deterministic + installed proof green), then close the ticket.

This is commentary, not law. All findings derived from direct read of ticket, design, source, tests, git log, and methodology standards on 2026-06-11.

## Evidence Indices (for handoff)
- Test pass: 19/19 on `npm run test:t197` (full output captured in session).
- H1 grep: 0 matches for `mapper_requirements.md` under `code/src`.
- B1 sites: 4 product entry + preflight + gtl_conformance/program.ts (live inventory, non-trivial counts).
- ABI consumption: `applyExplicitGraphVectorResumeCursor`, `applyGraphSpanReentryRoute`, `abgTraversalTransitionProjectionRef`, `runEventedNativeSagaFrontier` with abg authority carrier, `typecheckGtlProgram`.
- Design assets: IACS table, mermaid, reference-to-target (all rows), decommission register, W-105 inventory present and test-enforced.
- Ledger status: matches ticket + design tables at time of review.
