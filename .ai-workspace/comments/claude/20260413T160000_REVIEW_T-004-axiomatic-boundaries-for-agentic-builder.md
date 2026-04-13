# REVIEW: T-004 Axiomatic Boundaries for an Agentic Builder

**Author**: claude
**Date**: 2026-04-13T16:00:00Z
**Addresses**: `.ai-workspace/tickets/active/T-004-restore-homeostatic-gap-triage-and-intent-renewal.md`
**Companion**: `claude/20260413T150000_REVIEW_odd-sdlc-in-progress-refactor.md`
**Frame**: The operator works with an agentic builder (claude, codex, gemini) under `odd_sdlc` law. The ticket must set axiomatic boundaries the builder cannot lawfully cross, while leaving declared extension points where the builder has freedom to go beyond.

Unpacks recommendations #3–#7 from the inline T-004 review. Each section states the axiom (hard constraint), the extension surface (where the builder may extend), and the enforcement (how the runtime proves the boundary held).

---

## #3. Artifact Boundary — Where Does the Triage Product Live?

### The choice

Two candidate homes for per-edge triage results:

- **(A) field inside the workspace-state artifact** — `runtime/odd_sdlc-workspace-state.yml` gets a `gap_triage:` block
- **(B) sibling file** — `runtime/odd_sdlc-gap-triage.json`, referenced by checkpoint hash from workspace-state

### Recommendation: (B) sibling file, pointer in state

**Axiom (hard):**

- workspace-state remains the single authority on readiness, mode, selected_root, and checkpoint hashes
- triage results are durable, queryable, and addressable by `(edge_id, traversal_id, checkpoint)` triple
- workspace-state carries only a `gap_triage.artifact_path` and `gap_triage.checkpoint` — never inlined results

**Why not (A):**

- workspace-state is read on every runtime boot; inlining triage would bloat a hot-path artifact with per-edge payload that grows with traversal depth
- workspace-state's purpose is "is the tree ready to traverse"; triage is "what did the last traversal learn" — different lifecycles, different consumers
- analysis-refresh boundary (see schema Appendix A, step 2) must rewrite the whole state file atomically; triage results should be append-only per traversal

**Extension surface (builder freedom):**

- the triage artifact schema declares `extensions: {}` — a free-form namespaced map
- agentic builders may add `extensions.<vendor>.<key>` fields (e.g., `extensions.claude.confidence`, `extensions.codex.alternative_routes`) without schema version bump
- consumers ignore unknown extension keys by contract; query surfaces surface them as opaque JSON
- new `gap_kind` values are lawful additions in `extensions.domain_gap_kinds[]` — the core taxonomy in §Gap Triage Model stays closed, the extension list is open

**Enforcement:**

- workspace-state `gap_triage.checkpoint` must equal the artifact's top-level checkpoint; mismatch → STALE
- query surface `query_gap_triage(edge_id)` reads the artifact only — never reconstructs from events
- contract test: write triage artifact A1, rebuild workspace-state, assert `gap_triage.artifact_path` points at A1 and checkpoint hashes match

---

## #4. Mode-Gate Constitutional Repricing

### The risk

`constitutional_insufficiency: true` means the triage result recommends writing `GOALS.md` or `INTENT.md`. In test_sandbox, seeded fixtures will reliably produce this signal — triage will keep recommending goal rewrites in workspaces that exist solely to exercise the runtime. In installed_target, the agentic builder should never silently mutate constitutional surfaces.

### Recommendation

Two independent gates, both required for the write to happen:

**Gate 1 — workspace_mode permission:**

| mode | constitutional repricing |
|---|---|
| `source_domain_repo` | allowed with F_H approval |
| `installed_target` | allowed with F_H approval |
| `test_sandbox` | **suppressed** — triage result records the recommendation, but no file write is scheduled |

**Gate 2 — F_H approval lane:**

- the repricing vector is emitted as a `proposed_constitutional_change` event
- state field `constitutional_changes_pending: [<vector_id>]` blocks traversal `start` until resolved
- resolution path: operator calls `genesis approve-repricing <vector_id>` or `genesis reject-repricing <vector_id>`
- approve → write happens, event `constitutional_change_applied`, traversal unblocks
- reject → event `constitutional_change_rejected`, vector retained in history, traversal unblocks with the original constitution intact

**Axiom (hard):**

- no code path may write `specification/INTENT.md` or `specification/GOALS.md` without a corresponding approved `proposed_constitutional_change` event
- `_build_module` and runtime-construction paths are forbidden to write these files under any mode

**Extension surface (builder freedom):**

- builders may propose repricing vectors with structured rationale in `proposed_constitutional_change.evidence[]`
- builders may propose *multiple alternative* repricing vectors for the same mismatch; operator picks one on approval
- builders may attach `extensions.proposed_diff` as a concrete textual diff for the operator to review

**Enforcement:**

- contract test: triage result with `constitutional_insufficiency: true` under `workspace_mode: test_sandbox` → state recorded, file system unchanged
- contract test: same triage under `installed_target` with no approval → `genesis start` blocks with clear reason
- fd-check: scan events for any constitutional-file write not preceded by approval; fail with `unsanctioned_constitutional_write`

---

## #5. Fallback for F_P Triage Failure

### The risk

The triage layer is F_P (agentic reasoning). F_P can time out, return malformed JSON, or produce a triage that fails schema validation. Without a declared fallback, the runtime either hangs or silently treats "no triage" as "no gap," which regresses to pre-T-004 behavior.

### Recommendation

**Axiom (hard):**

- every edge that enters gap triage must exit with exactly one of: `triage_produced`, `triage_failed_fallback_dependency_gap`, or `triage_suppressed` (the last only in `test_sandbox` when Gate 1 from #4 blocks)
- "no output" is not a lawful state — the runtime emits `triage_failed_fallback_dependency_gap` after the retry budget exhausts

**Retry semantics:**

- `N = 3` attempts, exponential backoff 10s / 30s / 90s
- each attempt records a `triage_attempt_failed` event with the failure class (`timeout`, `schema_invalid`, `transport_error`, `empty_response`)
- after N failures, emit `triage_failed_fallback` with `fallback_kind: dependency_gap`
- `dependency_gap` is a first-class member of the gap taxonomy (add to §Gap Triage Model) meaning "the builder cannot currently classify this edge; treat as a dependency on analytical capability"

**Why `dependency_gap` and not `retry_forever`:**

- `retry_forever` masks infrastructure problems as runtime progress
- `dependency_gap` surfaces the failure as a first-class gap in the same query surface as all other gaps — the operator sees it in `gaps()` output, not buried in logs
- the gap recommends a `capability_probe` or `source_finding` next intent, which routes through the same candidate-family selection as any other dynamic next intent (#6)

**Extension surface (builder freedom):**

- builders may declare a richer `failure_evidence` payload in the attempt event (partial reasoning, tokens consumed, last good parse)
- builders may register a `triage_retry_hint` in future attempts (e.g., "prompt was too long, try with evidence slice only") — these are advisory, not binding
- the fallback `dependency_gap` result is itself a lawful triage product that downstream routing (#6) can pick up — so a builder in a later pass can attempt triage again and succeed

**Enforcement:**

- contract test: inject an F_P failure at edge E, run traversal, assert events include 3 `triage_attempt_failed` + 1 `triage_failed_fallback`, and `gaps()` output includes `dependency_gap` for E
- contract test: after `dependency_gap` is emitted, a new traversal can produce a successful triage that overrides it (shadows the prior result, does not erase history)

---

## #6. Selection Policy for Dynamic Routes

### The risk

The ticket describes both fixed next intents (repair, deepen, reopen) and dynamic next intents (discovery, PoC, capability probe, source-finding, "future domain-declared graphfunctions"). Dynamic means multiple lawful candidate-family members may match a single triage result. Without a declared selection algorithm, two agentic builders will pick different routes on the same input — not lawful determinism.

### Recommendation

**Axiom (hard):**

- selection is a total function: `(triage_result, candidate_family) → selected_graphfunction`
- selection is deterministic given the same inputs and the same workspace state
- selection never consults "most recently used" or "builder preference" — only declared policy

**Algorithm:**

1. **Filter by gap_kind match.** Each candidate graphfunction declares in its module `applicable_gap_kinds: [<kind>...]`. Candidates whose list does not include the triage's `gap_kind` are excluded.
2. **Filter by workspace_mode.** Candidates declare `applicable_modes: [source_domain_repo|installed_target|test_sandbox]`. Mode mismatches are excluded.
3. **Filter by capability contract.** Candidate declares `required_capabilities: [...]`. Missing capabilities in the active tenant → excluded (same mechanism already used for deployment/runtime stages per CLAUDE.md §4).
4. **Rank by declared priority.** Candidate declares integer `priority: N` (default 100). Lowest wins.
5. **Tie-break by lexicographic graphfunction name.** Stable, deterministic, no hidden state.
6. **If zero candidates remain:** emit `no_lawful_route` event, fall through to fixed `repair` intent on the originating edge, record the exhaustion.

**Extension surface (builder freedom):**

- new graphfunctions may be added under `build_tenants/<tenant>/gtl/graphfunctions/` declaring their own `applicable_gap_kinds` and `priority`
- a builder may propose a *new* candidate family by emitting a `proposed_graphfunction` event — this is the F_H-gated equivalent of #4 for routing extensions
- the builder may extend `applicable_gap_kinds` with new domain-declared kinds (from the extension list in #3) — selection handles these uniformly
- operators can override priority via `project_constraints.yml` → `routing.priority_overrides: {<graphfunction_name>: N}` for local policy

**Enforcement:**

- contract test: two candidate families match triage T, one with priority 50, one with priority 100 → selection returns the priority-50 family deterministically across 10 runs
- contract test: triage with unknown gap_kind + no matching candidate → `no_lawful_route` event emitted, fallback to `repair`, no exception raised
- contract test: `routing.priority_overrides` in constraints flips the tie-breaker; event carries `priority_source: constraint_override`

---

## #7. Strengthen the Proof Bar — Anchor on Test28.02 Shallow Survivors

### The risk

The current Proof Required section lists categories ("missing implementation only", "missing test only", etc.) without naming the concrete failure cases the ticket was *born from*. The test28.02 evidence cited in the ticket names specific shallow survivors — the proof bar should pin the acceptance tests to those names. Otherwise the ticket can be "completed" against synthetic fixtures that the builder self-shaped to pass.

### Recommendation

Replace the bulleted proof-required list with named acceptance tests anchored to concrete test28.02 survivors plus the ambiguity/closure register scenarios. Each test names the edge, the expected triage kind, and the expected route selection.

**Named acceptance tests:**

1. **`JobSubmitter.submit()` still `???`** — edge: `module_realization(JobSubmitter)`. Expected triage: `code_gap` with `shallow_existing_realization: true`. Expected route: `deepen_realization` (fixed intent) — *not* `repair` and *not* "new capability group". Proof: the artifact shows the specific method signature and the `???` literal as evidence.
2. **`SparkMorphismExecutor` still `val output = input`** — edge: `module_realization(SparkMorphismExecutor)`. Expected triage: `code_gap` with `shallow_existing_realization: true` and `evidence.trivial_passthrough: true`. Expected route: `deepen_realization`. Proof: the artifact cites the specific pass-through line.
3. **`Reconciler.isConsistent` hard-codes `true`** — edge: `module_realization(Reconciler)`. Expected triage: `code_gap` with `shallow_existing_realization: true` and `evidence.hard_coded_success: true`. Expected route: `deepen_realization`. Proof: artifact cites the literal `isConsistent = true`.
4. **Lateral-only addition regression** — a second pass that adds a new module *sibling* without deepening an existing shallow sibling should be flagged as `topology_gap` with `deepening_preferred_over_expansion: true`. Proof: run the reset/replay fixture that produced the 4 lateral-only groups in test28.02, assert the triage recommends deepening the 8 byte-identical survivors first.
5. **Ambiguity register unresolved major → `ambiguity_gap`** — seed an unresolved major ambiguity in the register, run gaps(), assert triage produces `ambiguity_gap` with `policy_escalation: <risk_appetite>` field populated.
6. **Requirement missing from current surface → `requirement_gap`** — seed a `missing_from_current_requirement_surface` entry, assert triage produces `requirement_gap` and recommends `reopen_requirements` (not `code_gap` on a downstream edge).
7. **Constitutional insufficiency under `test_sandbox` is suppressed** — #4 Gate 1 test.
8. **Constitutional insufficiency under `installed_target` blocks traversal until F_H approval** — #4 Gate 2 test.
9. **F_P triage failure produces `dependency_gap`** — #5 contract test.
10. **Deterministic selection across two matching candidate families** — #6 contract test.

**Axiom (hard):**

- the triage artifact must cite *file path + line number + literal text* as evidence for shallow_existing_realization findings
- the artifact must NOT claim realization is complete when the cited line is a literal `???`, a pass-through assignment, or a hard-coded success

**Extension surface (builder freedom):**

- builders may extend the `evidence` block with richer classification (call-graph depth, cyclomatic complexity, test coverage ratio) under `extensions.<vendor>.evidence.*`
- builders may propose additional "shallow patterns" beyond the three named above — these become new entries in `extensions.shallow_pattern_catalog[]`
- the acceptance tests fix the three named survivors; the pattern catalog is open

**Enforcement:**

- the test28.02 workspace itself becomes a fixture in `test_env/fixtures/test28_pass2_replay/` — the three named modules are checked into the fixture, the test runs the real triage pipeline against them
- the test fails if any of the three shallow survivors is classified as `realized` or `complete`
- the test fails if the triage artifact lacks file+line+literal-text evidence for the shallow classification

---

## Summary for the agentic-builder frame

Across #3–#7 the pattern is the same:

- **Closed axioms** at the runtime-contract boundary (artifact schemas, permission gates, retry budgets, selection determinism, evidence requirements)
- **Open extension surfaces** declared in schema (`extensions.*`, `applicable_gap_kinds`, `shallow_pattern_catalog`, new graphfunctions under declared directories, operator-level priority overrides)

The builder cannot:
- write constitutional files without F_H approval
- hang on F_P failure
- pick a non-deterministic route
- claim realization against a `???`

The builder can:
- add new gap kinds under the extension list
- propose new graphfunctions as candidate-family members
- declare richer evidence and rationale
- classify shallow patterns beyond the three named

That is the "axiomatic boundary with freedom to go beyond" shape for T-004. The ticket's task list and acceptance section should be rewritten to pin these axioms and name these extension surfaces explicitly — right now they are implicit and a builder could lawfully diverge from operator intent.

## Suggested ticket-text edits

Three concrete text edits to T-004 before implementation starts:

1. **§Gap Triage Model**: add `dependency_gap` to the taxonomy and add an `extensions: {}` clause naming it the lawful extension point for new kinds.
2. **§Analytical Capability Boundary**: append a paragraph stating the mode/approval gate for constitutional repricing, referencing #4.
3. **§Proof Required**: replace the bulleted list with the ten named acceptance tests from #7, with the test28.02 fixture checked in at `test_env/fixtures/test28_pass2_replay/`.

These edits are enough to move the ticket from "right direction" to "an agentic builder can implement it without asking what the boundaries are."
