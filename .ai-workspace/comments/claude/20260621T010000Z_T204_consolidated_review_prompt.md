# Review Prompt — T-204 Decommission: Verification & Tech-Debt Closure

You are performing a ground-up STDO review of the T-204 decommission work in
`/Users/jim/src/apps/odd_sdlc`, build tenant `build_tenants/typescript`.

Ticket: `.ai-workspace/tickets/active/T-204-decommission-odd-sdlc-cli-orchestration-surface.md`

## Baseline & moving-tree warning

- Current HEAD when this prompt was written: `d7dac6b` ("T-204 tighten ABG-owned start proof"),
  on top of `ae0c0e4` ("Hard-break odd_sdlc installed executor") and `8bdf5a0`.
- The working tree is **live and actively changing** (concurrent in-flight edits to
  `operator/*`, `operator/plugins/evaluate/*`, `contracts/operator_run_artifact_catalog.ts`,
  several `design/*.md`, `test_t140/t184/t197`, the ticket, plus an in-flight `register_purpose.ts`
  rework tracked by `comments/codex/20260620T130634Z_T204_register_walk.md`).
- **Re-baseline before asserting anything.** Run `git status`, `git log --oneline -6`, rebuild,
  and re-read each file at the current HEAD+worktree. Every line number below is "as of the prior
  review" and must be re-verified — treat them as pointers, not facts.

## Governance & stance

- Authority order: `specification/PRODUCT.md`, `specification/requirements/*`, ratified
  `build_tenants/typescript/design/*`, then code/tests. `CLAUDE.md` and `specification_methodology`
  standards govern method.
- `specification/` + ratified design define WHAT/HOW-authority; **code/tests are realization**;
  **inventories, comments, dashboards, and prior reports are read-models / evidence only** and do
  NOT outrank live spec/design.
- **Do not trust claims — including the prior reports listed below, and including this prompt.**
  Reproduce every finding independently.
- This is a **review** (read-only) unless explicitly asked to change code. Findings first, ordered
  by severity, each with `file:line` and concrete failing/observed behavior.

## Three traps that bit the prior review — do not repeat them

1. **"Unreachable from package exports" ≠ dead.** A static import-graph rooted only at the 3
   published package entrypoints (`code/src/index.ts`, `install/index.ts`, `release/index.ts`)
   over-reports dead code. You MUST also check (a) `test_env/**` consumption — the test surface is
   real — and (b) **constitutional binding** (a requirement/ratified-design/gate that names the
   file). Code can be production-unreachable yet be the test API or a spec-bound proof surface.
2. **The type-only-edge trap.** `import type {…}` is erased by `tsc`; a module reachable only via
   type-only imports is runtime-dead — but may still be the legitimate test/dev API. Verify against
   the emitted `build/semantic/**` JS, not just the `.ts` import text.
3. **Read-model vs ratified authority.** The T-204 survival inventory
   (`comments/codex/20260620…source_survival_inventory.md`) is a read-model. Where it conflicts
   with a live requirement or ratified design, the inventory is the defect, not the code.

## Core questions

A. **Execution through ABG / single command-control surface** — is it STILL clean after
   `ae0c0e4` hard-broke the installed executor and `d7dac6b` tightened the start proof? odd_sdlc must
   own only GTL program + product plugins + product carriers/projections + prompt/policy; ABG
   (`genesis-ts` / ABG runtime) must own start, control, traversal, continuation, replay,
   worker-attachment, result-ingress, consequence-bind.
B. **Dead-code accuracy** — what is genuinely dead vs test-facing plumbing vs constitution-bound.
C. **`analysis/*` reclassification** — the prior review changed it `move_to_abg → product_projection`
   (KEEP in tenant). Verify the constitutional basis holds.
D. **Remaining `move_to_abg` debt** — `installed_operator.ts`, `start/*`, `operator/event_store.ts`
   (inventory now lists 8). Are they correctly tagged, and is the hard-break (`ae0c0e4`) moving the
   orchestration body toward ABG without leaving a local controller?
E. **The one open boundary question** — `operator/traversal_consequence.ts` locally derives the
   5-term edge-convergence predicate + closure fold + next-action projection. Is that product
   projection or usurped ABG authority? (Belongs to ABG **T-159** / odd_sdlc **T-205**.)

## Must-verify items (reproduce each; cite current file:line)

1. **Command/control boundary clean.** No `bin` in `package.json`; no `code/src/cli/`; no
   `invokeOddSdlcSpecMethodCommand*` / `commandPayload*` / spec-method dispatcher in `code/src`.
   `publicStartOnce` (`start/public_start.ts`) is single-shot (status `dispatch_required|advanced|converged`,
   no local while/until/retry loop). `runEngine`/`runEngineIterate` is **never** called in `code/src`.
   `createOddSdlcAbgRuntimeBindingPlugins` (`operator/abg_runtime_binding.ts`) calls `publicStartOnce`
   exactly once and returns `.plugins`. Gates: `test_t140` (no-local-forced-iteration), `test_t203`
   (start steel thread), `test_t197` (product GTL gate), `test_env/guards/pack_no_command_artifacts.mjs`.
   NOTE: `ae0c0e4` "hard-break installed executor" + uncommitted `installed_operator.ts` changes —
   re-verify the executor no longer holds a local run/iteration path.

2. **`analysis/*` is product proof-harness (KEEP), not dead.** Confirm the binding still holds:
   `specification/requirements/18-typed-construction-algebra.md` **REQ-F-ODDSDLC-081** (AC-6 analyzer
   reports edge-accounting rows; AC-7 "T-172 closure is blocked while any selected executive edge is
   unaccounted"; AC-9 analyzer output is the read-only selection projection); ratified design
   `design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md` ("analyzer proof: projections over admitted
   carriers"); gates `test_t197` and `test_t180` read `code/src/analysis/*.ts` by path. If any of those
   moved/changed in the live tree, re-judge. The inventory was corrected to `product_projection/survive`.

3. **Operator-subtree barrel is the TEST API, not dead.** `operator/index.ts` is imported by ~63
   `test_env` files (value imports); `operator/depth_traversal.ts` reaches tests through it (e.g.
   `test_t200_decomposition_trace_closure` uses `constructSdlcDecompositionTraceRegister`/
   `evaluateSdlcDecompositionTraceClosure`). `operator/register_purpose.ts` is production-dead but
   `test_t197`-pinned — and is being reworked in-flight (`register_walk`), so re-check its current state.
   Do not flag any of these as freely-deletable on a production-reachability signal alone.

4. **Effects deletion correctness.** `code/src/effects/environment.ts` + `effects/index.ts` were
   deleted (orphans, zero consumers in source or tests; live effects `archive_store`/`file_store`/
   `process_runner` are imported by direct path). Confirm nothing regressed; build + gates were green.

5. **Duplicate SDLC code (DRY).** ~11 confirmed clusters (verified low/medium): repair-reentry
   pressure-ref classifier + 4-attempt percent-decode (`edge_gain_closure.ts`, `traversal_consequence.ts`,
   `closure_state_machine.ts`); requirement-id normalizer clones (`result_projection.ts`,
   `launch_contract.ts`, `postflight_checks.ts`); `stableJson`/`sha256*`/validation/collections helpers
   vs `shared/*`. TWO are behavior-changing (requirement-id normalizer; key-sorted `stableJson` vs the
   plain `sha256JsonDigest`) — NOT drop-in. Several live in in-flight T-205 consequence files; weigh
   churn risk before recommending edits.

6. **`traversal_consequence.ts` boundary.** Re-audit the locally-derived 5-term `edgeConverged`
   predicate + `deriveSdlcEdgeClosureDecision` + `constructSdlcNextActionProjection` +
   `constructSdlcConsequenceTraversalActionBinding` (and the `installed_operator.ts`
   `deriveInstalledTraversalConsequence` mirror). Decide: product projection of admitted facts
   (allowed) vs local consequence-bind authority (must be ABG). Resolve under T-159/T-205, not T-204.

7. **Remaining `move_to_abg` inventory (now 8 files):** `installed_operator.ts`, `start/{index,policy,
   public_start}.ts`, `operator/event_store.ts`, plus the catalog-coupled bits. Confirm each is genuinely
   leaving (and the hard-break is relocating, not renaming) vs being kept as plugin support. NOTE:
   `event_store.ts` read fns have live test consumers (t184/t076/t066) — not freely deletable.

8. **Archive-truth consistency.** Latest T-132 live run under
   `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/…` — start steps
   report `converged` with exit 0 while the final workspace `gaps` reports `blocked` + N open gaps.
   Confirm this is consistent stepwise-partial (target edge converged; workspace not fully closed),
   and that no postflight/F_P/closure artifact claims *delivered/qualified* while gaps remain open.

9. **Test-suite reality.** `npm run test:semantic` (full `node --test test_env/tests/*.test.mjs`) is
   broadly red. Categorize, do NOT report as a flat blocker: (a) churn over removed command helpers
   (expected), (b) tests importing un-exported operator internals (rewire/migrate), (c) a Node
   multi-file-glob cascade ("Cannot find module index.js" though it loads standalone), (d) the
   pre-existing `sdlc_product_materialization_launch_blocked` class in `test_t066` (NOT a T-204
   regression). Confirm the **focused proof lane** (t140/t203/t197/t161/t172-run-analysis/pack guard)
   is green.

## Prior evidence artifacts (read; do not trust)

- `comments/claude/20260621T000000Z_T204_tech_debt_audit.md` — prior tech-debt report (with its own
  retractions: Layer B and event_store were over-claimed as dead and corrected). **Scrutinize the
  retractions and the analysis reclassification.**
- `comments/codex/20260620T000000Z_T204_source_survival_inventory.md` — survival inventory, as
  corrected 2026-06-21 (analysis 15 rows `move_to_abg→product_projection`; effects 2 rows `delete/done`;
  counts `move_to_abg 25→8`, `product_projection 53→68`, `total 180→178`).
- `comments/codex/20260620T130634Z_T204_register_walk.md` — in-flight register/barrel rework.
- The T-204 ticket's own audit tables and per-cut "Follow-Up One-Surface Proof" sections.
- The workflow audit (`t204-techdebt-audit`, 48 candidates → 31 confirmed / 17 refuted) — its
  production-only reachability over-claimed dead code; treat its dead-code numbers skeptically.

## Suggested commands

```bash
cd /Users/jim/src/apps/odd_sdlc
git log --oneline -6 && git status --short | grep -v build/semantic
cd build_tenants/typescript && npm run build:semantic          # rm -rf build/semantic + tsc + GTL preflight

# command-surface residue (should be empty in code/src):
rg -n "invokeOddSdlcSpecMethodCommand|commandPayload|spec_method/entry|code/src/cli" code/src
rg -n "runEngine\b|runEngineIterate" code/src                  # expect ZERO

# reachability (roots = the 3 package exports); then INTERSECT with test_env + constitution before calling dead:
#   build an import graph from code/src resolving ./*.js + ../*.js to .ts/index.ts, BFS from
#   index.ts/install/index.ts/release/index.ts; "unreachable" is a CANDIDATE, not a verdict.
rg -l "operator/index\.js" test_env                            # ~63 → barrel is test API
rg -n "REQ-F-ODDSDLC-081|analyzer|T-172 closure is blocked" specification/requirements/18-typed-construction-algebra.md

# focused proof lane (expect green):
node --test test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs \
            test_env/tests/test_t203_runtime_start_steel_thread.test.mjs \
            test_env/tests/test_t197_product_gtl_gate.test.mjs \
            test_env/tests/test_t161_fd_run_analysis_linter.test.mjs \
            test_env/tests/test_t172_run_analysis_edge_accounting.test.mjs \
            test_env/guards/pack_no_command_artifacts.mjs
# full suite ONLY to categorize redness, not to gate:
node --test test_env/tests/*.test.mjs 2>&1 | grep -E "not provide|Cannot find module|launch_blocked" | sort | uniq -c
```

## Output format

Findings first:
- **Blocker / High / Medium / Low** (calibrate per workspace rule: DRY/dead-export hygiene is never High;
  a broadly-red full suite that is churn is not a Blocker — substance over test count).
- `file:line`
- what is wrong
- why it violates STDO / T-204 (cite the requirement/design clause or closure-law line)
- concrete required fix

Then: Open questions · Validation performed (say what you ran, and what you did NOT rerun) ·
Bottom-line status — one of: "T-204 complete", "T-204 incomplete", or
"checkpoint acceptable but not complete" — with the single most important remaining item named.
