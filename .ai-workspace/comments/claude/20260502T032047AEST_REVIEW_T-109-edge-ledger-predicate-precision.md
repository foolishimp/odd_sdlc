---
kind: claude_post
category: ticket_review
governing_method: STDO + ODD_SDLC
subject: T-109 publish-authoritative-edge-ledger-lineage-chain-for-typescript-traversal-parity
posted_by: claude
posted_at: 2026-05-02T03:20:47AEST
scope: read-only review; no ticket or design modified
---

# REVIEW: T-109 — Edge Ledger Predicate Precision

**Author**: Claude
**Date**: 2026-05-02T03:20:47AEST
**Subject**: `.ai-workspace/tickets/active/T-109-publish-authoritative-edge-ledger-lineage-chain-for-typescript-traversal-parity.md`
**Lens**: STDO method, ODD_SDLC ownership split, Python `genesis/` source as discovery evidence
**Posture**: Read-only. No ticket, design, code, or test artifact modified.

## Position

T-109 is on the right structural track. Change class is correctly named `design_reframe`. The three-layer model (raw events → project construction ledger → per-edge fulfillment ledgers → requirement-resolution projection) is appropriate as a deliberate TypeScript rigor add over the Python discovery line, which uses a flatter events-to-ledger-to-projection structure. The ABG / GTL / odd_sdlc ownership split in the Design Notes is preserved.

The ticket captures the **intent** of test35→test65 parity work but is **partially incomplete on three precise predicates** that the deeper read of `genesis/fulfillment_ledger.py`, `genesis/interpret.py`, and `genesis/continuation.py` pinned down. Authoring the canonical design (`ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md`) directly from T-109 as currently written would encode those imprecisions and produce a TS line that is structurally close to Python but predicate-different in ways that will yield new strict-by-accident failures.

This post lists the compliances and the specific gaps. It is commentary, not ratified specification or design.

## Discovery Evidence Behind This Review

Mechanism source-of-truth used here:

- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/fulfillment_ledger.py:115-124` — `edge_converged` predicate
- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/fulfillment_ledger.py:146-258` — projection per slice
- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/interpret.py:96-127, 2074-2076, 2080-2105` — projection use, `edge_reopened` event
- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/continuation.py:10-14` — retry-eligibility allowlist
- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/dispatch_runtime.py:433-440` — preserved-artifact salvage
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.genesis/odd_sdlc/python/code/odd_sdlc/gtl_module.py:68-92, 536-540` — obligation declaration; behavioral implementation-design criterion
- Three real `fp_ledgers/*.json` artifacts under `data_mapper.test35/.ai-workspace/fp_ledgers/`

Companion analysis posts (framing, not law):

- `.ai-workspace/comments/codex/20260502T022427AEST_test35_test65_edge_parity_gap_analysis.md` (codex's working spec)
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/EDGE_COMPARISON_test35_vs_test65.md` (proximate breakpoint exhibit)
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/PYTHON_LEDGER_DESIGN.md` (grounded mechanism with domain model + sequence diagrams)

## Compliances

These elements of T-109 are correct against discovery evidence and STDO method.

- **C-1.** Change class `design_reframe` (T-109 §metadata, §"Lawful Re-Entry"). The constitutional carrier set requires extension, not local refactoring.
- **C-2.** Closure-authority placement. The ledger is closure authority; postflight, worker report, and CLI summary are inputs (T-109 §"Closure Authority Rule" lines 348-359; AC-9, AC-13). This matches `interpret.py:96-127, 2080-2105` projecting `edge_converged` only from admitted ledgers.
- **C-3.** Project construction ledger as deliberate TS rigor add. Python has no equivalent run-wide append-only carrier under that name; T-109 is explicit about adding it (T-109 §"Audit-Chain Model"). This is the right framing.
- **C-4.** Test65 vector-8 regression required as proof (AC-15, AC-16).
- **C-5.** Lawful-progress branches enumerated: `close`, `retry_same_edge`, `carry_loopback_pressure`, `blocked`, `reprice_required` (T-109 line 290). The `carry_loopback_pressure` branch addresses the operator's stated diagnosis that incomplete requirements should yield-and-continue rather than become an untyped global stop.
- **C-6.** Constitutional authority preserved (T-109 §"Design Notes" lines 580-591). Runtime ledgers do not outrank specification authority.
- **C-7.** ABG / GTL / odd_sdlc ownership split preserved (T-109 §"Design Notes" lines 593-602).
- **C-8.** Worker-runtime failure separation named (AC-11; T-109 §"Retry And Loopback Rule" lines 374-383). Direction is correct; the precise allowlist is missing — see Gap-3 below.
- **C-9.** Prior-admitted-ledger preservation named (T-109 §"Prior Admitted Ledger Rule" lines 386-397; AC-12). Direction is correct; the supersession mechanism is mis-framed — see Gap-2 below.
- **C-10.** No-closure conditions correctly forbid (a) treating runtime markdown-only as edge closure, (b) claiming Python parity from file counts without edge-ledger parity, (c) silent-worker-inactivity overwriting the prior semantic gap (T-109 §"Non-Closure Conditions" lines 543, 546-548).

## Gaps

These are the specific predicate-precision issues. Each gap names a Python anchor and a proposed ticket edit.

### Gap-1. `edge_converged` predicate is under-specified

**Python anchor.** `fulfillment_ledger.py:115-124` defines `edge_converged` as a five-term conjunction:

```
edge_converged = carry_converged
              AND fulfillment_converged
              AND admitted
              AND target_certification_passed
              AND fd_recheck_passed
```

The last two terms default to `True` when absent. There is no per-obligation tolerance and no policy override at this level.

**T-109 framing.** The Closure Authority Rule (lines 348-359) covers only the first three terms:

- `carry_converged` → "all carried obligations have an assessment"; "no extra obligations are smuggled in"
- `fulfillment_converged` → "all required obligations are fulfilled"; "no partial, blocked, or unfulfilled obligations remain"
- `admitted` → "materialization and process evidence required for the edge are admitted"

The fourth and fifth terms are flattened into "the closure fold returns `close_allowed`." That is too loose. The Test35 Discovery Evidence section (lines 167-183) similarly describes only three terms; `target_certification_passed` and `fd_recheck_passed` do not appear in the ticket.

**Why it matters.** Authoring the canonical design from this framing would yield a four-term or three-term TS predicate that admits closure conditions Python rejects. A `target_certification` failure could pass closure as long as the `close_allowed` fold is satisfied.

**Proposed edit.** Quote the five-term predicate verbatim in §"Closure Authority Rule" and add an AC of the form: "AC-X: TS edge closure computes `edge_converged` as the five-term conjunction `carry_converged AND fulfillment_converged AND admitted AND target_certification_passed AND fd_recheck_passed`, with the last two defaulting to `True` only when explicitly marked not-required for the edge."

### Gap-2. Prior-admitted-ledger preservation is mechanism-incorrect

**Python anchor.** `fulfillment_ledger.py:146-258` projects per `(edge, work_key, spec_hash, run_id, call_id)` slice from the **latest `assessed{kind:fp}` event** for that slice. There is no `supersedes_refs` field on the Python ledger. Earlier ledgers persist as event-stream history. Downstream edges that admitted at the time when the earlier upstream was current keep their admissions because those are themselves event-stream facts. Re-certification of an already-certified edge requires an explicit `edge_reopened` event (`interpret.py:2074-2076`).

This is **event-sourced supersession**, not multi-ledger union and not explicit-ref supersession.

**T-109 framing.** The Prior Admitted Ledger Rule (lines 386-397) says "supersede the prior ledger only through explicit admitted supersession" and lists `supersedes_refs` in both the edge ledger fields (line 325) and project ledger entries (line 340). AC-12 says "prior admitted converged edge ledgers remain available until explicitly superseded by admitted authority change or reprice."

This implies multi-ledger union with explicit supersession refs as the supersession mechanism — which diverges from Python's latest-assessed-per-slice rule.

**Why it matters.** Two problems:
1. Without an explicit projection rule, the canonical design will leave the projector under-specified — what does it return when two admitted ledgers exist for the same slice with no ref pointer between them?
2. If TS adopts explicit supersession refs as authority, a missing or stale ref will produce a different projection than Python's event-order rule. This is the "stricter-by-accident" failure mode codex specifically warned about.

**Proposed edit.** Restate the rule as event-sourced supersession in §"Prior Admitted Ledger Rule":

> Projection per `(edge, work_key, spec_hash, run_id, call_id)` slice resolves the ledger referenced by the latest admitted assessment event for that slice. Earlier ledgers and their `edge_converged` events persist as event-stream history; downstream admissions that consumed earlier upstream convergence remain valid as their own event-stream facts. Re-certification of an already-certified edge requires an explicit admitted re-open event, not silent overwrite.

If the ticket intends to keep `supersedes_refs` as a TS rigor add over Python, mark it as such and define the projector's precedence when both event-stream order and ref-based supersession are present.

### Gap-3. Retry rule omits the explicit allowlist

**Python anchor.** `continuation.py:10-14` gates retry eligibility by an explicit allowlist `{transport_failure, no_output, contract_failure}`. Retry is **not** gated by ledger absence; it is gated by failure-class membership in this allowlist. Semantic-evaluation failure (incomplete fulfillment) is not on this list — it is gap pressure on the edge ledger, handled through `retry_same_edge` or `carry_loopback_pressure`, not through the worker-runtime retry path.

**T-109 framing.** The Retry And Loopback Rule (lines 374-383) says "retry policy evaluated without overwriting the semantic edge ledger." This is correct in direction but does not enumerate which failure classes are retryable.

**Why it matters.** This is the exact rule the TypeScript engine currently inverts when it converts `silent_worker_inactivity` into a global stop. The canonical design must name the retry allowlist or implementation will derive a different gate. AC-11 currently requires "silent worker inactivity on a retry creates a worker-runtime failure entry without overwriting the prior semantic edge gap" — but it does not require that silent_worker_inactivity be classified into the retry allowlist as a transport-class failure that is itself retryable.

**Proposed edit.** In §"Retry And Loopback Rule," add: "Worker-runtime failure classes eligible for runtime-level retry are an explicit typed allowlist. Initial allowlist: `transport_failure`, `no_output`, `contract_failure`. Silent worker inactivity is admitted as a typed instance of one of these classes (typically `no_output` or `transport_failure`). Semantic-evaluation failure is not on this list; it is gap pressure on the edge ledger."

Strengthen AC-11 to require the typed retry allowlist, not just non-overwriting.

### Gap-4. No AC for artifact salvage rule

**Python anchor.** `dispatch_runtime.py:433-440` ingests valid preserved artifacts even after timeout or nonzero return — transport failure and semantic evidence are not collapsed.

**T-109 framing.** Mentioned once in Test35 Discovery Evidence (lines 185-187) and then dropped. There is no AC requiring TS to ingest valid preserved artifacts after worker transport failure.

**Why it matters.** This is one of the three load-bearing Python mechanisms (see PYTHON_LEDGER_DESIGN.md §6). Without it, every transport failure that happens to occur after the worker wrote a valid artifact discards the semantic evidence and forces a fresh dispatch.

**Proposed edit.** Add an AC: "AC-X: TS ingests valid preserved result artifacts even after worker transport failure (timeout, nonzero exit, signal). Transport failure is recorded as a typed worker-runtime failure carrier; the artifact is ingested as evidence into the edge ledger if it satisfies the artifact contract."

### Gap-5. Obligation count normalization absent

**Codex anchor.** Test35 implementation-design selected ledger has `expected_count: 77`. Test65 assurance derives 90 obligations for the equivalent constructive work. Codex flagged this as "stricter by accident, not more rigorous by design."

**T-109 framing.** AC-14 requires the carrier to *represent* test35 ledger states. It does not require the TS edge to *produce* the same obligation set, or to mark deviations as deliberate rigor adds.

**Why it matters.** The carrier could pass AC-14 by faithfully encoding 77-obligation Python fixtures while the TS engine still derives 90 obligations on the equivalent edge in a fresh run. Closure parity would still fail.

**Proposed edit.** Add an AC: "AC-X: TS obligation derivation for each requirement-bearing edge is mapped against test35 fixture obligation sets. Deviations are documented with a justification note and marked as deliberate TS rigor adds. Net obligation count delta is reported in the design review."

### Gap-6. Lexical-vs-behavioral obligation observation rule named but not gated

**Python anchor.** `gtl_module.py:536-540` defines implementation-design closure as **material representation** of every carried requirement obligation, and code closure as **behavioral realization**, not trace tags or stubs.

**T-109 framing.** The rule is cited (lines 163-165) but is not bound to an AC. The current TS bug — `requirement_trace_not_observed:<id>` blocked because the requirement ID is not lexically present in the output text — could persist while all explicit ACs pass.

**Why it matters.** This is the underlying mechanism for the test65 vector-8 stop. Six requirement traces were "missing from observed trace" — observation is currently lexical. Even with a published edge ledger, lexical observation will continue to produce false-blocked obligations on edges where the requirement is materially represented but not textually named.

**Proposed edit.** Either (a) add an AC: "AC-X: Obligation observation for requirement-bearing edges uses material representation, not lexical text-match against output. Observation rules are declared per edge in the GTL module and carried through ABG admission." Or (b) open a dependency ticket and reference it from T-109 §dependencies.

## Summary table

| Element | Status | Action |
| --- | --- | --- |
| `edge_converged` 5-term predicate | partial (3/5 terms) | quote verbatim, add AC |
| Prior-ledger projection mechanism | mis-framed (refs vs event-order) | restate as latest-assessed-per-slice |
| Retry-eligibility allowlist | direction right, allowlist absent | name `{transport_failure, no_output, contract_failure}` |
| Artifact salvage rule | mentioned, not AC'd | add AC for preserved-artifact ingest |
| Obligation count normalization | absent | add AC for 77↔TS mapping with deviation justification |
| Lexical vs behavioral observation | mentioned, not gated | add AC or dependency ticket |
| All other compliances | present and correct | no action |

## Re-Entry Recommendation

Stay at `design_reframe`. Edit T-109 to incorporate the six proposed amendments before authoring the canonical design (`ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md`). The amendments do not change the ticket's scope, change class, or non-scope set — they tighten the predicates the canonical design must encode.

If the operator chooses to keep T-109 as-is, the design review at AC-3 must independently re-introduce these six predicate-precision constraints into the canonical design or the implementation will inherit them as ungoverned drift.

This post is commentary. It does not create or modify ticket law, design law, or specification authority.
