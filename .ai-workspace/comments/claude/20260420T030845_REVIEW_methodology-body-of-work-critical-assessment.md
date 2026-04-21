# REVIEW: Methodology Body of Work — Critical Assessment

**Author**: claude
**Date**: 2026-04-20
**Addresses**: `specification_methodology/specification/standards/` (SPEC_METHOD.md,
ODD_METHOD.md, TICKET_METHOD.md, POSTING_GUIDE.md, WRITING_GUIDE.md), odd_sdlc
as an implementation of that method, abiogenesis as the edge-traversal
probabilistic unit of compute
**Status**: Draft — commentary, not ratified

## Summary

The body of work is three layers:

1. **SPEC_METHOD and its companion standards** — the constitutional source
2. **odd_sdlc** — an implementation of the method over project work; not yet
   bootstrapped to self-improvement, so it still follows the convention as
   written
3. **abiogenesis** — the probabilistic unit of compute; one edge traversal is
   the smallest lawful probabilistic operation under F_P

The constitutional chain plus change-class plus lawful re-entry is the
strongest contribution and is load-bearing correct. The single biggest gap is
a **maturity model for method implementations**. The method is written as
though an implementation is already Stage 3 (mechanized, self-hosting), but
odd_sdlc is transitioning Stage 1 (human-enforced) to Stage 2 (mechanized
F_D). The T-022/T-023 ordering inversion I flagged earlier is one symptom of
that missing stage contract.

This post describes current reality as I read it, then target direction.

---

## Analysis

### Layer 1 — SPEC_METHOD and companion standards

**Strongest, load-bearing correct**

- The constitutional chain:
  `Goals → Intent → Product Definition → Requirements → Design → Code → Events
  → Projection → Delta → Scenarios → Gap Analysis → Repricing`.
  It is the one surface that makes traceability checkable rather than
  aspirational. Every other rule in the method hangs off it.
- The change-class × re-entry-point pairing
  (`goal_reprice`, `intent_reprice`, `product_reprice`, `requirement_reprice`,
  `design_reframe`, `realization_refactor`). This is the rule that prevents
  bugs and features from skipping triage and landing straight in code. It is
  the single most valuable piece of process economy in the method.
- Events + projection as the only lawful write discipline. `emit()` as the
  sole entry to runtime truth, projection as replay-derived, delta as derived
  not stored, correction as shadowing not erasure. Once this is internalized
  it makes almost every "what is actually true right now" question
  mechanically answerable.
- The substrate/product split (GTL as language, ABG as runtime, the product
  as the domain thing over that substrate). This prevents the common collapse
  where the runtime's internal types become the product's ontology.
- Present-tense active truth + historical material demoted to design history,
  comments, or release notes. This is unusual and correct — it forces the
  live surface to stay readable as a current contract, not as an archaeology
  site.

**Load-bearing correct but under-specified**

- **Enforcement layer is not named.** The method states obligations
  ("no bug skips triage", "derived artifacts do not outrank live spec", "old
  truth path must be removed before closure"). It does not say which
  enforcement regime owns each obligation. Some obligations are naturally
  F_D (schema, hash, traceability key presence). Some are F_P (did the
  migration narrative match the code?). Some are F_H (does this reprice
  reflect real intent?). The method treats the distinction as obvious; it is
  not obvious inside an implementation.
- **Comment → specification ratification path is opaque.** POSTING_GUIDE says
  "A post becomes consequential only when its content is explicitly adopted
  into specification, ratified design, or accepted implementation." It does
  not say by whom, under which change class, or with which evidence. This is
  exactly the surface where drift starts.
- **F_H review surface shape is absent.** The method invokes `F_H` heavily
  (human approval lane, escalation, ambiguity hard-stop). There is no
  specification of what the human is actually given, in what format, with
  what closure contract. The current operator-review dossier work in T-022
  is filling this gap by accident.
- **Live requirement retirement has no class.** The change classes cover
  additive and refactoring motion. Retiring a live requirement that was
  previously ratified but is now obsolete is a distinct motion. It is closer
  to `requirement_reprice` than any other but not named.
- **Composition order among companion standards is unclear.** SPEC_METHOD,
  ODD_METHOD, TICKET_METHOD, POSTING_GUIDE, WRITING_GUIDE each claim a slice.
  The precedence when they overlap (e.g. TICKET_METHOD's Migration Checklist
  vs POSTING_GUIDE's post lifecycle) is left to the reader.
- **Major vs minor ambiguity is subjective.** `ambiguity_risk_appetite`
  gates whether an unresolved major ambiguity is carried by F_P or escalated
  to F_H. Nothing in the method tells F_P how to classify an ambiguity as
  major. In practice this becomes a per-run calibration problem.
- **Self-hosting boundary is asserted but not drawn.** The method says ABG
  must not depend on GTL, and that derived artifacts do not outrank live
  spec. It does not specify which directories, modules, or surfaces are
  substrate, which are product, and what the mechanical check for the
  boundary is.

### Layer 2 — odd_sdlc as an implementation

odd_sdlc implements the method over project work. The user flagged that it
is **not yet bootstrapped to self-improvement**, so it follows the convention
as written. Two observations from recent triage:

- **Inside-Out Ticket Sequencing violated by T-022/T-023.** T-022 (downstream
  dossier) is active while T-023 (upstream execution-contract source carrier)
  is in backlog. TICKET_METHOD is explicit that upstream source carriers must
  lead. The dependency graph is also circular (T-022 lists T-023, T-023
  lists T-022). This is a mechanical violation of a rule the method already
  states — it was not caught because no layer enforces the rule.
- **Execution-contract admission fields not carried on T-023.** TICKET_METHOD
  names six admission fields (`admit_source_carrier`,
  `admitted_contract_id`, `admission_event_id`, `admission_evaluator`,
  `admission_proof`, `admission_checkpoint`). T-023's header does not carry
  them as first-class fields. This is the class of defect the method says is
  process drift.

These are not failures of the method. They are failures of
**implementation-time enforcement**. The method stated the rule; nothing
mechanical caught the break.

### Layer 3 — abiogenesis as the probabilistic unit of compute

Abiogenesis treats one edge traversal as the smallest lawful probabilistic
operation:

```
Job → GraphFunction → GraphCall → Frame → vector-local traversal → foldback
```

This is the correct granularity. The things that hang off it:

- **F_P output is scoped to one frame.** The frame is invocation-local,
  fail-closed. Frame-local publication does not bleed into global module
  topology.
- **Foldback is the only lawful return path.** Parent truth is re-evaluated
  after child rebind. The parent does not auto-certify on child completion.
- **Reset/reopen mints a fresh attempt identity.** Prior attempts are
  shadowed, not erased. This is the correction law at traversal scale.

The abiogenesis unit is what makes `F_P` a bounded probabilistic operation
rather than an unbounded LLM call. That is the piece of the method that
actually makes "probabilistic evaluator" a tractable contract.

What is under-specified here is the **contract between abiogenesis and
TICKET_METHOD**. A ticket's `admit_source_carrier` admission event and a
GraphCall's frame-local publication are both lawful-admission boundaries.
The method does not yet say whether they are the same boundary at two
granularities or two distinct boundaries.

---

### The core structural weakness — a bootstrap/maturity gap

Every piece above points at the same missing artifact. The method is
written as though an implementation can be Stage 3 from day one. No
implementation of any method is Stage 3 from day one.

Implementations evolve through stages. I would name them:

- **Stage 0** — no method. Work happens; precedent is the only rule.
- **Stage 1** — documented, human-enforced. The method exists as text. A
  human reviewer is the enforcement layer. Drift is the default failure
  mode.
- **Stage 2** — mechanized F_D checks. Schema validation, traceability key
  presence, Migration Checklist completeness, ticket admission fields — all
  the things a deterministic checker can verify without reading intent.
  F_P and F_H still handle everything else.
- **Stage 3** — mechanized F_P + F_D. The probabilistic evaluator is
  scoped, bounded, and attestable. Frame-local publication is enforced.
  Comment → specification ratification has a machine-readable gate.
- **Stage 4** — self-hosting. The method implementation can rewrite itself
  under its own method. `specification_methodology` is a Stage 4 target;
  odd_sdlc is not.

odd_sdlc is transitioning Stage 1 → Stage 2 right now. TICKET_METHOD's
Inside-Out Sequencing rule and admission fields are exactly the kind of
Stage 2 check that would catch T-022/T-023 mechanically. They are currently
Stage 1 — written down, human-enforced, missed.

The absence of this staged contract is why the method reads as
contradictory in practice: it says "enforcement is present tense" while the
implementation is obviously in mid-transition.

---

## Recommended Action

Treat the following as candidate commentary toward ratification, not as
decided spec.

1. **Add a Maturity Method to `specification_methodology/`.** Name the
   stages. For each stage give:
   - the enforcement regime the stage guarantees (F_H-only, F_D-mechanical,
     F_P-bounded, self-hosting)
   - the closure_law for exiting the stage (what must be true before the
     next stage can be claimed)
   - the allowed gap between written method and implementation behavior at
     that stage
   This gives implementations an honest current-state contract and removes
   the implicit assumption of Stage 3.

2. **Promote T-023 active, demote T-022 active, break the circular
   dependency.** T-023 is the upstream source carrier; Inside-Out
   Sequencing says it must lead. Add the six execution-contract admission
   fields as first-class header on T-023. T-022 keeps its `closure_law`
   block on T-023 admission but moves back to backlog until T-023's
   admission event has been emitted.

3. **Name the enforcement regime on each rule in SPEC_METHOD and
   TICKET_METHOD.** One-line annotation per rule: F_D-checkable,
   F_P-attestable, F_H-approvable. This alone collapses much of the
   under-specification I named above.

4. **Specify the comment → specification ratification path.** One
   lifecycle: `post (commentary) → ratification review (F_H) → specification
   edit under named change class → post marked superseded`. Without this,
   posts silently drift into de facto law.

5. **Name the live-requirement-retirement change class.** Either add
   `requirement_retire` or state explicitly that retirement is
   `requirement_reprice` with target_truth = retirement.

6. **State the abiogenesis ↔ ticket admission boundary.** Are they the same
   lawful-admission boundary at two granularities, or two distinct
   boundaries? This determines whether T-023's admission event is emitted
   at ticket-open time or at first GraphCall frame open.

Of these, item 1 is the one that changes everything else. If the Maturity
Method exists, the current state of odd_sdlc is legible as Stage 1 → Stage 2,
not as drift.
