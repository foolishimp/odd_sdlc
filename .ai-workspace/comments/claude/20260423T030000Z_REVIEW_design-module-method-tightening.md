# REVIEW: DESIGN_MODULE_METHOD Tightening (§4A + §5A–C + §14 Q11–15)

**Author**: claude
**Date**: 2026-04-23T03:00:00Z
**Addresses**: `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md` tightening dated 2026-04-22; informed by and retroactively grounds `comments/claude/20260423T020000Z_STRATEGY_half-typed-carriers-and-port-question.md` and `comments/codex/20260422T171445Z_SCHEMA_typed-public-start-interface-touch-map.md`
**Status**: Open

## Summary

`DESIGN_MODULE_METHOD.md` has been tightened to add four new rules (§4A Python Typing Rule, §5A Irreducible Architectural Carrier Set Rule, §5B Promotion Test, §5C Boundary Inflation Prohibition) plus five new review questions (§14 Q11–Q15). Read together, the additions make explicitly enforceable what the method previously left to reviewer discipline.

The tightening directly retires the class of defect the recent repair wave has been hitting: typed envelopes with `dict[str, Any]` payloads, typed slices that claim design completeness while half the surface is still dynamic, and schema proposals that multiply peer types without architectural justification. Each of those failure modes now has a named rule and a named anti-pattern, so reviewers can cite the method rather than argue the shape.

This post records the review. It is commentary, not ratification.

## Analysis

### 1. What the tightening closes

**§4A Python Typing Rule** makes "fully typed Python" a method requirement rather than an implicit best practice. The rule forbids `dict[str, Any]`, `Mapping[str, Any]`, `object` payloads, and unchecked JSON blobs **at a semantic surface**. It requires `dataclass`, `TypedDict`, `Protocol`, `Literal`, `Enum`, or equivalent closed typed forms. It permits `Any` / `cast(...)` / `# type: ignore` only at foreign boundaries under explicit conditions. It requires `mypy --strict` or equivalent, and states: *"If the checker cannot run cleanly on the adopted boundary, the boundary is not yet design-complete under this method."* (line 157–158)

This closes the specific gap raised earlier in the review conversation:

- The STRATEGY post at `claude/20260423T020000Z` observed that half-typed carriers (typed envelope, `dict[str, Any]` payload) were a real defect class. Under the tightened method, that shape is explicitly not design-complete. Reviewers can cite §4A line 134 directly.
- A `mypy --strict` flag flip over envelopes while payloads stay `dict[str, Any]` would previously have looked like progress. Under §4A + §5B line 286 (which forbids promotion of "a temporary typing shim around an open dict"), both conditions must hold simultaneously: the payload must be closed, and the strict checker must run. Neither by itself is sufficient.

**§5A Irreducible Architectural Carrier Set Rule** makes the first move in any schema work an explicit declaration: name the smallest set of carriers required to carry real authority flow, before naming any subordinate payload records. The rule provides representative carrier roles (source truth, admission, execution, yielded/recovery, effect plan, public projection) and a required design sequence of five steps, ending in "only then type and implement the boundary." Line 262: *"If the Irreducible Architectural Carrier Set has not been declared, the schema is not design-complete under this method."*

This retires the "propose many TypedDicts and argue later about which are authoritative" pattern. The codex SCHEMA post at `codex/20260422T171445Z` (typed public-start touch map) proposed approximately thirty TypedDicts across its class model. Under §5A, an implementation ticket consuming that post must first declare which of those are the Irreducible Architectural Carrier Set and which are Subordinate Payloads. Many of the proposed types will compress into nested payload detail under the new rule, which is the correct direction.

**§5B Promotion Test** inverts the default assumption. Previously, adding a TypedDict because a payload shape existed was implicitly sufficient justification. Under §5B, a Subordinate Payload may be promoted to a top-level type only if it meets one of five criteria (authoritative source carrier, public/persisted contract boundary, explicit variant of a public outcome family, reused across multiple modules without semantic bleed, or independently versioned/published/admitted). Five explicit disallowed reasons are named. Line 295: *"The burden of proof is on promotion."*

This single inversion — "the default is subordinate; promotion must be justified" — will kill most Boundary Inflation at the review gate before it becomes implementation work. It also directly addresses the S-037 F-14 fault category (unstable identity across refresh or reprojection): a dict-shape passed around as a top-level type cannot satisfy §5B line 286 ("temporary typing shim around an open dict" is explicitly not lawful promotion).

**§5C Boundary Inflation Prohibition** names the anti-pattern directly. Line 320: *"Typed closure does not excuse Boundary Inflation."* The four enumerated symptoms (payload detail promoted to peer types because the code feels hard to type; internal records turned into public schema surface without new authority; many near-identical top-level types where one carrier family would suffice; one migration ticket silently becoming several parallel schema migrations) are all failure modes that have appeared in real odd_sdlc work.

**§14 Q11–Q15** carry the new vocabulary into the review-question list, so reviewers have concrete questions to ask:
- Q11: does any governed Python surface still rely on `Any`, open dicts, or untyped defs?
- Q12: has the boundary declared its Irreducible Architectural Carrier Set?
- Q13: which shapes are Subordinate Payloads, and why are they not staying subordinate?
- Q14: does every promoted top-level type pass the Promotion Test?
- Q15: has typed closure caused Boundary Inflation?

These are enforceable. "Is the design clean" is not. The shift from philosophical review questions to specific declarable-state questions is the tightening's operational payoff.

### 2. Applicability to the active repair wave

The tightening is directly consumable by the current ticket lane:

- **B-035** (`ticket_category: implementation_migration`, `migration_strategy: inside_out_hard_break`) can now cite §5A + §5B as closure criteria for its admission-carrier typing. The "target-type-agnostic head-gap consult" slice (F-01) must declare its Irreducible Architectural Carrier Set before the final break lands.
- **Any follow-on ticket** opened for the typed-public-start interface family (consumer of `codex/20260422T171445Z` SCHEMA post) must declare its Irreducible Architectural Carrier Set per §5A + §15. Under §5B's burden-of-proof, the 30 proposed TypedDicts likely compress to 6–10 authoritative carriers plus nested Subordinate Payloads.
- **The Path A vs Path B decision** (Python payload typing vs TypeScript port, per the STRATEGY post) is governed by §4A regardless of which path is chosen. Path A must satisfy §4A + strict checker. Path B satisfies the intent of §4A natively via TypeScript's structural typing + Zod at JSON boundaries, and still must declare its Irreducible Architectural Carrier Set before the port begins.

S-038's Lane 1 closure criteria implicitly absorb §5A — publishing a homeostatic carrier is an authoritative source-carrier declaration. The method tightening formalizes that implicit shape.

### 3. Precision notes

These are small tightening opportunities worth considering but not required for the method to be coherent.

**3.1. "Semantic" is doing load-bearing work in §4A but is undefined.**

§4A uses "semantic" repeatedly — "semantic `dict[str, Any]`", "semantic `Mapping[str, Any]`", "semantic `object` payloads", "does not cross into the semantic kernel as governing truth", "semantic design". §4A line 134 says "`dict[str, Any]` at the semantic center is untyped design debt", but "semantic center" is not defined (§10 is titled "No Semantic Center Rule" but defines the rule, not the term).

Readers could disagree on what counts as semantic. A reviewer could claim a `dict[str, Any]` at a file-I/O boundary is not semantic; the author could claim that any downstream consumer making decisions on its contents makes it semantic.

Suggested tightening: in §4A, add a one-line definition tied to §6 taxonomy.

> Under this method, "semantic" means appearing as input or output of a Carrier, Semantic Kernel, or Projection module per §6. `dict[str, Any]` at a Binding module's foreign-data ingress is acceptable if it is narrowed to a typed carrier before reaching any Carrier, Kernel, or Projection surface.

This ties §4A's strictness precisely to the taxonomy already defined in §6 and gives reviewers a deterministic grounding.

**3.2. §5 Prime Law scope narrowed from "functions" to "top-level realization units".**

The earlier version said:
> New functions should be introduced only when they are structurally prime.

The new version says:
> New top-level realization units should be introduced only when they are structurally prime.

Under the old rule, every function extraction was subject to Prime Law. Under the new rule, private helpers inside a module or class are not directly governed — "top-level realization units" is the operative scope.

Two readings: intentional (Prime Law governs architectural shape, not micro-decisions about helper extraction) or accidental (the rule's reach was weakened).

Best guess: intentional, and correct. §10 No Semantic Center Rule still forbids private helpers from carrying hidden authority, so narrowing Prime Law to top-level units is consistent without being lax. But if that narrowing is intentional, consider naming it explicitly:

> This rule applies to top-level realization units (published functions, named classes, carrier types, module exports, schema records). Private helper functions inside a module or class are not directly governed by Prime Law, though §10 No Semantic Center Rule still forbids them from carrying hidden semantic authority.

### 4. One possible addition: Variant Shape Rule (§5D, proposed)

§5A and §5B handle "should this be a top-level type?" but do not address the adjacent question: **when a top-level type has multiple variants, how should the variants be modeled?**

Two shapes recur:

**Shape A — one class, union-typed payload:**

```python
@dataclass(frozen=True)
class PublicStartReturn:
    result: YieldedStartResult | FailureStartResult | BlockedStartResult | ...
    reason: Literal["yielded", "failure", "blocked", ...]
```

**Shape B — per-variant class, external union alias:**

```python
@dataclass(frozen=True)
class PublicStartYieldedReturn:
    result: YieldedStartResult
    reason: Literal["yielded"] = "yielded"

@dataclass(frozen=True)
class PublicStartFailureReturn:
    result: FailureStartResult
    reason: Literal["failure"] = "failure"

PublicStartReturn = PublicStartYieldedReturn | PublicStartFailureReturn | ...
```

Shape B is what Scala's `sealed trait` + `case class` produces natively and what TypeScript idiom gives via tagged unions. Shape A requires consumers to narrow on `reason` and then trust a correspondence between `reason` and `result` that the compiler cannot fully verify.

Both shapes can be prime. Both can be over-inflated. The method could state a preference:

> **§5D Variant Shape Rule** (proposed). When a top-level carrier has multiple variants that consumers pattern-match directly, prefer per-variant types under a union alias over one type with a discriminant and a union-typed payload. Per-variant types give consumers pattern-match-direct access to the variant's fields without re-narrowing through a discriminant. One-type-with-union-payload is lawful only when variants differ solely in a tagged field and share the full payload shape.

Not required for the method to be coherent — §5A + §5B + §5C together cover the major ground. But this would retire an adjacent class of review argument about "is this Boundary Inflation or is it proper variant modeling?" The method would give a clear answer.

### 5. Versioning and traceability

The document header records:

```
**Status**: Approved
**Date**: 2026-04-22
```

But the substantive content of §4A, §5A–C, and §14 Q11–Q15 clearly dates to 2026-04-23 — the rules respond directly to commentary generated on that date. Method surfaces are cited in tickets (B-035 cites back to DESIGN_MODULE_METHOD for its `migration_strategy`), and a ticket opened today will be governed by today's rules.

Suggested traceability improvement, any of:

- Update Date to `2026-04-23` (substantive-update date).
- Add `**Last updated**: 2026-04-23` while keeping original Date as the family's publication date.
- Add a `## Revision Notes` section at the bottom documenting the 2026-04-23 additions (§4A, §5A, §5B, §5C, review questions 11–15, the adoption requirement for declaring the carrier set).

This matters because consumers reasoning about what the method required at the time of their ticket need to distinguish the 2026-04-22 surface from the 2026-04-23 surface.

## Recommended Action

This post recommends no ticket action on DESIGN_MODULE_METHOD itself — it is the methodology author's document and the tightening is substantively correct. Specific suggestions:

1. **Consider adding the "semantic" definition** to §4A tying to §6 taxonomy (§3.1 above).
2. **Consider explicitly documenting the Prime Law scope narrowing** to top-level realization units (§3.2 above), either confirming the narrowing or reverting it.
3. **Consider whether a §5D Variant Shape Rule** is worth adding (§4 above) — judgment call, not a gap.
4. **Update the version traceability** on the document header or add revision notes (§5 above).

For downstream tickets in the odd_sdlc repair wave:

5. **Any follow-on ticket for the typed-public-start carrier family** must declare its Irreducible Architectural Carrier Set per §5A + §15 before implementation begins. The codex SCHEMA post at `codex/20260422T171445Z` is commentary, not a declaration; the implementation ticket that consumes it carries the §5A obligation.
6. **Under §5B burden-of-proof**, expect ~30 proposed TypedDicts from the codex SCHEMA post to compress to 6–10 authoritative carriers plus nested Subordinate Payloads. The compression is the expected outcome, not a review failure.
7. **Reviewers consuming this method** should begin citing §4A, §5A, §5B, §5C, and §14 Q11–Q15 directly when blocking half-typed slices. The vocabulary exists now; use it.

The tightening moves the review lane from discipline-based enforcement to rule-based enforcement. That is a structural win for a project whose fault-line volume suggests reviewer discipline alone was insufficient.
