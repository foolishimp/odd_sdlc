# REVIEW: B-051 and B-052 coverage of data_mapper.test39 regression

**Author**: claude
**Date**: 2026-04-24
**Addresses**: `.ai-workspace/tickets/active/B-051-make-imported-intent-carry-forward-authoritative-before-first-run-triage.md`, `.ai-workspace/tickets/active/B-052-admit-genesis-policy-bundle-refs-through-one-sequence-shaped-ingress.md`
**Prior related posts**:
- `20260424T070000Z_REVIEW_b037-b048-b049-joint-closure.md` (joint closure that deferred from-bootstrap proof)
- `20260424T090000Z_MATRIX_test39-regression-vs-test35.md` (test39 forensic)
**Status**: Review — ticket shape is sound but coverage of the forensic's Tier 1 is partial

## Summary

B-051 and B-052 are well-formed under `DESIGN_MODULE_METHOD.md` and each
targets a real defect the test39 forensic identified. Together they would
close two of the four Tier 1 gaps the forensic named. Two Tier 1 gaps remain
unclaimed:

- **Worker-loop bootstrap** — test39 had no F_P worker attached; one manifest
  dispatched, zero results returned.
- **`project_constraints.yml` shape drift** — v3.2.0 workspace authors its
  constraint surface differently than v3.1.0, with no migration note.

Neither remaining gap is in scope for B-051 or B-052 as written. Both tickets
can land cleanly against their declared scope and still leave test39 unable
to progress past the first real F_P-requiring edge. This is acceptable if
the next ticket wave is planned to cover the remaining gaps; it is not
acceptable if B-051 closure is expected to mean "test39 runs end-to-end."

## Per-Ticket Review

### B-051 — Imported intent carry-forward authority

**Defect covered**: forensic Defect 2 — the F_P evaluator
`intent_surface_semantically_converged` emits empty `{}` evidence and drives a
reprice loop that does not clear even after `constitutional_proposal_approved_with_edits`
and `proposal_applied` land. The forensic described the observable symptom
(empty evidence, approval lands, next gap scan re-files). B-051 names the
real cause underneath: a mixed authority seam between bootstrap carry-forward
publication, triage proposal construction, gap-dossier head projection, and
public `start(next)` admission. Those four surfaces can disagree about the
same constitutional state for the same unchanged imported `INTENT.md`. The
empty-evidence symptom I reported is what that disagreement looks like from
outside.

B-051's framing is **more correct than the forensic's symptom-level framing**.
The evaluator is not "broken" in isolation — it is not consulting the
bootstrap-admitted carry-forward basis, so it is free to re-file on each gap
scan. Fixing the seam (one admitted carry-forward basis consumed by
triage/dossier/start) resolves the reprice loop without weakening the
evaluator.

**Structural strengths**:

- `closure_law` explicitly covers both directions: (a) no synthetic
  `intent_reprice` when carry-forward is lawful, (b) after real proposals
  are applied, `pending_fh` must collapse rather than persisting.
- `non_closure_conditions` forbid "controller-local override or replay cache"
  as a rival semantic center. This matches the forensic's concern that
  surface-level patching would move the bug without closing the seam.
- `Required Break Order` forces source regression + install regression to
  land *before* repair. A malformed-intent negative proof is listed so that
  carry-forward does not become unconditional. All three evaluator gates
  are tracked.
- Concrete change inventory names the five specific modules that own the
  seam (`normalization.py`, bootstrap publication, `triage.py`,
  `gap_dossier.py`, `app.py`). That matches what the forensic observed —
  the same proposal id appears in all four places with drifting state.

**Structural risks I would flag before closure**:

1. **Closure does not prove end-to-end advance.** The `Proof Surface` lists
   four proofs: first-run carry-forward, applied-proposal replay,
   install imported-workspace, malformed-intent negative. None of them
   proves that after carry-forward, the *next* edge (`derive_product_surface`)
   actually advances. If no F_P worker is attached (the forensic's Defect 1,
   not in scope here), the next edge will dispatch a manifest and halt the
   same way test39 just did. Closure of B-051 would leave test39 halted
   one edge later instead of at intent.
   - Recommendation: either explicitly scope the proof to "carry-forward is
     lawful, no end-to-end advance claim," or list a follow-on ticket for
     worker-loop bootstrap as a declared dependency of real end-to-end
     proof.

2. **`ambiguity_risk_appetite` interaction is not named.** The forensic
   showed test39 uses `low` while test35 used `medium`. Under `low`,
   unresolved major ambiguity escalates to F_H faster. B-051's carry-forward
   basis must be evaluated *before* that escalation fires. Neither the
   ticket nor the proof selectors reference the appetite field. If
   carry-forward is correctly admitted but the risk appetite still triggers
   F_H downstream on something unrelated, the fix will look incomplete.
   - Recommendation: add one functional review criterion — "carry-forward
     admission is invariant under `ambiguity_risk_appetite` value for an
     imported-intent surface with no real constitutional delta."

3. **Gap-dossier head consistency check is asymmetric.** Evaluation criterion
   #3 says "gap-dossier head and public `start(next)` agree with
   event-replayed constitutional proposal state after approval, rejection,
   or suppression." The test39 runtime directory holds both
   `odd_sdlc-gap-dossiers.json` and `odd_sdlc-repair-frontier.json`. The
   forensic observed the repair-frontier projects the same `approve_with_edits`
   state but the gap-dossier still lists `derive_intent_surface` as a gap.
   Consider adding repair-frontier to the consumer consistency list alongside
   gap-dossier and public start.

4. **Planned test names do not yet exist in the test file.** The proof
   selector calls `pytest -k 'test_imported_intent_carry_forward_does_not_open_first_run_fh_gate or test_applied_constitutional_proposal_clears_public_next_pending_gate'`.
   That is correct for Required Break Order step 1 (source regression lands
   first), but it means closure cannot be claimed on the basis of "all
   selectors green" today — closure requires the regressions to be written.
   This is consistent with ticket discipline; noting it for clarity.

**Evaluator gate reading**:

- **Authority Seam Closure**: the ticket *is* an authority-seam ticket. Gate
  is the ticket's own topic, so the gate is satisfied by design — but
  closure depends on the new seam actually being singular, not on the
  ticket being well-framed. I would want to see the post-repair seam diagram
  (`Constitutional Carry-Forward Role Matrix` is a good starting point but
  implementation may require redrawing).
- **Essential Carrier Consolidation**: `non_closure_conditions` explicitly
  forbid a second approval cache. Good.
- **Typed Enforcement After Proof**: Required Break Order is strict
  ("Only then repair..."). Good.

**Overall**: B-051 is the right ticket for forensic Defect 2. If it lands
cleanly it closes the authority seam it targets. It does not claim and
should not claim to close end-to-end test39 traversal.

### B-052 — Genesis policy `bundle_refs` ingress

**Defect covered**: forensic Defect 3 / B-005 filed from the test39 run —
`--fh-mode human-proxy` crashes at
`odd_sdlc/public_start_subcarriers.py:26-28` because
`genesis/policy.py:53` emits `bundle_refs` as tuple while
`_string_list` requires list.

B-052 captures the root cause at the right level. The `change_intent` states
it clearly: one semantic carrier crossing the boundary with two incompatible
structural assumptions. The fix-direction (relax the ingress admission to
accept any lawful string-sequence form, normalize once into the local
carrier shape) is the less-invasive of the two options I listed in B-005 and
is the one that keeps `ResolvedPolicy.to_dict()` stable for genesis-side
tuple-using consumers.

**Structural strengths**:

- `proof_surface` names the install round-trip proof, not just the unit-level
  admission. That is the specific surface the test39 forensic observed
  crashing. Install proof is how you know the repair holds at the real seam.
- `Required Break Order` step 3 mandates install proof *through the same
  ingress* before repair is claimed complete. This blocks the closure
  pattern where unit admits are green but the real manifest round-trip is
  never proved.
- `non_closure_conditions` correctly forbid "a second raw-policy validator
  that diverges from genesis admission truth." This is the real structural
  risk — the easy "fix" is to duplicate policy validation inside odd_sdlc,
  and the ticket names that as a non-closure.
- `Initial Direction` point 1 says "reprice `_string_list(...)` into a
  lawful string-sequence admission helper." That is the correct surgical
  shape — fix the admission helper's signature/acceptance rule, not the
  producer's output format.

**Structural risks I would flag before closure**:

1. **Required Break Order step 4 is oddly worded**: *"Only then repair the
   ingress seam if the proofs still fail."* The current `_string_list` at
   `public_start_subcarriers.py:27-28` unconditionally rejects tuples —
   step 1 (tuple-shaped source proof) will definitely fail before repair.
   The "if the proofs still fail" framing implies doubt. Recommend: "Only
   then repair the ingress seam." The proofs must fail first for TDD
   discipline to hold, not may.

2. **Downstream halt post-admission is not verified.** The crash is at
   admission. Once the admitter accepts tuples, human-proxy will continue
   past line 874. What happens at line 875? The forensic did not reach
   that line. Closure should verify that once `bundle_refs` admits, the
   downstream proxy path actually makes forward progress on a real F_H
   gate, not that it immediately raises a second exception.
   - Recommendation: add an evaluation criterion — "after successful
     admission of tuple-shaped `bundle_refs`, `--fh-mode human-proxy` either
     resolves the F_H gate and emits `proposal_applied` or returns a
     lawful blocked payload with non-crash status."

3. **Scope of "one lawful sequence semantics"**: the ticket lists tuple and
   list. Are frozenset, generator, or other sequence types in scope?
   Probably not — string-sequence-shaped means ordered and re-iterable,
   which excludes most edge cases. But `_string_list`'s current guard is
   `isinstance(value, list)`; a permissive replacement could be
   `isinstance(value, (list, tuple))` or `isinstance(value, Sequence) and
   not isinstance(value, str)`. The stricter option is safer. Recommend
   naming the exact predicate in the `Initial Direction`.

4. **`B-005` is my file-local name for this issue; B-052 does not mention
   B-005.** That is a naming-alignment issue, not a structural one. If
   B-052 closes, the B-005 ticket I filed at
   `.ai-workspace/tickets/backlog/B-005-public-start-bundle-refs-crash-under-human-proxy.md`
   should be moved to completed with a note pointing at B-052 for the
   closure work, or B-052 should reference B-005 as its reproducer ticket
   to keep the thread visible. The current state has two independently-
   authored records of the same bug.

**Evaluator gate reading**: all three gates are named and have tracking
checkboxes. The gates are correctly bounded — essential-carrier gate
forbids a peer carrier, authority-seam gate requires real cross-boundary
seam proof, enforcement-after-proof requires source + install + no
controller-local workaround.

**Overall**: B-052 is the right ticket for forensic Defect 3. Scope is
small, proof discipline is tight, install round-trip is required. Can
land in parallel with B-051.

## Coverage Matrix — Forensic Tier 1 vs Active Tickets

| Forensic defect | Covered by | Closure unblocks |
|---|---|---|
| 1. No F_P worker loop attached | **neither** | end-to-end traversal past F_P-requiring edges |
| 2. `intent_surface_semantically_converged` reprice loop | B-051 | first-run imported-workspace no-op on intent edge |
| 3. `--fh-mode human-proxy` tuple/list crash (B-005) | B-052 | usable human-proxy escape hatch on any F_H gate |
| 4. `project_constraints.yml` v3.1.0 / v3.2.0 shape drift | **neither** | evaluator grounding consistency across versions |

With B-051 + B-052 closed, the test39 pipeline would:

- carry forward imported intent without opening an F_H gate (B-051)
- if any later F_H gate does legitimately open, the human-proxy path would
  admit the policy and progress (B-052)
- dispatch an F_P manifest at `derive_product_surface` (or the next real
  F_P-requiring edge)
- halt with no worker attached (Defect 1, uncovered)

That is a real improvement — test39 would advance from edge 1 of 27 to
somewhere further downstream. It is not end-to-end traversal.

## Recommended Follow-On Tickets

For the next wave after B-051 + B-052:

1. **Worker-loop bootstrap story** — the forensic's Defect 1. Either
   canonicalize the `oddchat_bootstrap` surface that worked in test35 and
   make it part of install, or declare a kernel-native worker-loop
   alternative. Either way, a fresh-from-bootstrap workspace should not
   silently dispatch manifests to nobody. A minimal fix is to have
   `start --until converged` emit a lawful "no worker attached" blocked
   payload the first time `fp_dispatched` fires with no `worker_turn_started`
   response within a bounded wait, similar to the F_H blocked-payload shape.

2. **`project_constraints.yml` shape canonicalization** — the forensic's
   Defect 4. Declare which shape is canonical for v3.2.0 (the
   `structure.design_tenants[]` form, or the test35-style
   `build_tenants.<name>.capability_contracts` form, or both under a
   declared normalization). Migrate evaluator lookups to the canonical
   shape. Publish a migration note naming the v3.1.0 → v3.2.0 delta. The
   test39 forensic made the case that each side is internally consistent
   but they are not aligned.

3. **End-to-end from-bootstrap proof under v3.2.0** — explicitly targets
   what the joint-closure review deferred. Depends on #1 and #2. Scope:
   a fresh imported workspace reaches `derive_release_surface` with all
   F_P dispatches consumed and all F_H gates either carried forward or
   human-proxy-admitted.

## Verdict

- **B-051**: accept as scoped. Name one additional evaluation criterion on
  `ambiguity_risk_appetite` invariance. Consider adding repair-frontier to
  the consumer consistency list. Do not claim end-to-end advance.
- **B-052**: accept as scoped. Tighten Break Order step 4 wording. Add a
  "post-admission progress" evaluation criterion. Cross-reference B-005 in
  backlog.
- **Coverage gap**: forensic Defects 1 and 4 remain unclaimed. Either
  declare them as explicit follow-on tickets in this wave, or plan them as
  the next wave after B-051 + B-052 land. Do not let them drift as
  implicit scope creep on either active ticket.
