# SCHEMA: Requirements-Lineage References Across Constitutional, ABG, and odd_sdlc Surfaces

**Author**: claude
**Date**: 2026-05-10T14:00:00Z
**Addresses**: T-004 (`tickets/active/T-004-restore-homeostatic-gap-triage-and-intent-renewal.md`) — operator note "we have rediscovered lineage again"
**Status**: Open

## Summary

Inventory of every reference to "lineage" in the intent/product/requirements surfaces of `abiogenesis`, `odd_sdlc`, and the constitutional `specification_methodology` standards. The system carries **seven distinct lineage strands**, only one of which is the requirements-traceability lineage T-004 needs. The "rediscovery" is real because the runtime/causal lineage strands are heavily formalized while the requirements-traceability strand is thinly anchored — the latter is what gap triage and intent-renewal must consume to close the homeostatic loop.

This post describes current reality. It does not change code or close tickets.

## Analysis

### Strand 1 — Requirements-traceability lineage (intent → requirement → evidence)

This is the strand T-004 implicitly demands. It is the chain that lets gap analysis triage "missing implementation vs missing design vs missing requirement vs missing intent."

**Strongest single anchor:**

- `abiogenesis/specification/requirements/product/REQ-P-QUAL.md:13` — "lineage cannot be established from intent through to test evidence" if qualification has no requirements.
- `abiogenesis/specification/requirements/product/REQ-P-QUAL.md:139` — `REQ-P-QUAL-019`: "Every test file shall carry `# Validates: REQ-P-QUAL-*` tags... This establishes traceable lineage from intent (INT-005) through requirement (REQ-P-QUAL) to test evidence."
- `odd_sdlc/specification/requirements/02-graph-functions.md:48` — graph functions must publish "contract and publishable lineage."
- `odd_sdlc/specification/requirements/10-odd-sdlc-software-domain-buildout.md:137` — `AC-3`: "lineage and provenance remain attributable across release, runtime."
- `abiogenesis/specification/scenarios/09-research-product-lab-scenario-catalog.md:27, 40, 64, 98` — closure requires "source-input lineage for every" output; scenarios that emit output without source-input lineage fail.

**Constitutional anchor:** none directly in `SPEC_METHOD.md`. `SPEC_METHOD.md` returns zero hits for "lineage" — the constitutional method does not name requirements traceability as lineage. This is part of why the concept gets rediscovered.

### Strand 2 — Intent lineage (event-log-projected)

Newer, formalized in ODD_METHOD §11.5D as `IntentLineage`. This is **not** the same as requirements traceability — it's the projection of admitted source intent over the event log.

- `ODD_METHOD.md:697` — "from intent lineage and model synthesis through observation to next lawful action"
- `ODD_METHOD.md:708, 774, 964, 1006` — `IntentLineage` as a typed object in the constitutional equation
- `ODD_METHOD.md:725` — `IntentLineage` definition: "Admitted source intent and its lineage refs: human, imported source, prior product, intent engine, or prior synthesized construction intent"
- `ODD_METHOD.md:748, 757` — `synthesize_model` consumes `IntentLineage`; "Intent has lineage through the loop"
- `ODD_METHOD.md:849` — "event-log-backed intent lineage, prior model, and admitted product truth only"

This strand seeds the `ProductAssetModel` for `eval_gap`. It is forward-looking (what we are building from), not backward-looking (which requirement traces to which evidence).

### Strand 3 — Causal / work lineage (ABG runtime)

The most heavily formalized lineage strand. ABG's typed identity and event causation.

- `abiogenesis/specification/requirements/abg/REQ-R-ABG3-LINEAGE.md` — entire requirement file, 5 acceptance criteria:
  - LINEAGE-001: `work_key` is the lineage identity across run attempts
  - LINEAGE-002: spawn/foldback/substitution/fan-out/fan-in preserve lineage through event causation/correlation
  - LINEAGE-003: `frame_lineage_id` stable across reopen/retry; `frame_attempt_id` minted fresh
  - LINEAGE-004: each retry/reopen mints fresh `GraphCall` identity; cross-call relation via causation, not aggregate
  - LINEAGE-005: `Continuation` is run-local; cross-run carry-forward closes old continuation + opens new with explicit causal link
- `abiogenesis/specification/requirements/abg/REQ-R-ABG3-FRAME.md:19, 21` — `frame_attempt_id`, `frame_lineage_id`, `call_id` identity rules
- `abiogenesis/specification/requirements/abg/REQ-R-ABG3-EVENTS.md:34, 48` — event envelope preserves frame attempt/lineage identity; traversal modulation events preserve `frame lineage`
- `abiogenesis/specification/requirements/abg/REQ-R-ABG3-PROVENANCE.md:21` — `PROVENANCE-003`: frame-local and foldback activity preserve frame attempt identity, frame lineage identity, parent call/frame relation
- `abiogenesis/specification/requirements/abg/REQ-R-ABG3-FP-CONSCIOUSNESS.md:48, 52` — admission rejects malformed lineage; admitted construction intent invokes work only through ABG-owned graph-call/frame/continuation/event/lineage/projection mechanics
- `abiogenesis/specification/scenarios/06-replay-lineage-and-correction.md:7, 19, 29` — replay-derived current truth proves lineage, retries mint fresh attempt identities without losing lawful lineage

Constitutional anchors:

- `ODD_METHOD.md:431, 538` — ABG owns "lineage and provenance"; selection/closure semantics/lineage truth must not be reinterpreted by hidden controllers
- `ODD_METHOD.md:765` — replay-visible lineage and selected action that produced it
- `RELEASE_METHOD.md:277` — "the published RC lineage for that release is internally coherent"

### Strand 4 — Workspace / binding lineage

- `abiogenesis/specification/requirements/abg/REQ-R-ABG3-BINDING.md:45` — `BINDING-015`: "preserve input-workspace lineage plus output-workspace lineage in plugin handoff, runtime event, and projection truth"

This is a binding-level concern, not requirements traceability.

### Strand 5 — Recursion lineage (GTL)

- `abiogenesis/specification/requirements/gtl/REQ-L-GTL3-LAWS.md:32` — `LAWS-009`: "Recursion with preserved lineage and explicit foldback — recursive graph application preserves explainable lineage and declared rebinding law"
- `abiogenesis/specification/requirements/gtl/REQ-L-GTL3-RECURSE.md:26` — `RECURSE-006`: "Recursion shall preserve explainable work lineage across parent and child application"
- `abiogenesis/specification/requirements/gtl/REQ-L-GTL3-LANGUAGE.md:25` — `LANGUAGE-005`: GTL owns language law; engines own "execution, workers, runs, facts, projection, convergence, lineage, provenance, replay..."

This is causal lineage applied across recursive frames. Adjacent to Strand 3.

### Strand 6 — Engine / framework lineage (compiler-line context)

- `abiogenesis/specification/INTENT.md:12` — "AI SDLC engine lineage (`ai_sdlc_method` v3.1.0) is effective, but it is not [sufficient]"
- `abiogenesis/specification/INTENT.md:141` — "GCC analogy materialised: GTL is the language, ai_sdlc_method is the earlier compiler lineage, and abiogenesis is the self-hosting compiler/runtime line"
- `abiogenesis/specification/INTENT.md:275` — "OpenLineage adoption (deferred — add as projection layer when external lineage consumers exist)"
- `abiogenesis/specification/INTENT.md:423` — "Work-lineage-scoped correction — event log remains truthful"
- `abiogenesis/specification/INTENT.md:538` — "ABG realizes traversal, event emission, lineage, and provenance"

This is product-line / compiler-line context. Not the requirements strand.

### Strand 7 — Bootstrap / installed-product lineage

- `odd_sdlc/specification/PRODUCT.md:33` — abiogenesis TS substrate proves "bootstrap-lineage slices that `odd_sdlc.TS` may consume"
- `odd_sdlc/specification/INTENT.md:70` — odd_sdlc subordinate to ABG for "runs, events, convergence, lineage, and provenance"
- `odd_sdlc/specification/PRODUCT.md:158` — runtime contract binds "graph-call, frame, continuation, lineage, event, ledger"
- `odd_sdlc/specification/PRODUCT.md:198` — "worker, binding, run, and lineage semantics"
- `odd_sdlc/specification/PRODUCT.md:377` — ownership table: `ABG` owns "traversal governance, binding, runs, lineage, correction, provenance"
- `odd_sdlc/specification/requirements/09-odd-service-orchestration-plane.md:33` — orchestration plane subordinate to ABG for "convergence, lineage, or provenance"

Mostly downstream restatements that ABG owns the runtime lineage strand.

### Cross-strand inventory by surface

| Surface | Strands present |
| --- | --- |
| `specification_methodology/specification/standards/SPEC_METHOD.md` | none — zero hits |
| `specification_methodology/specification/standards/ODD_METHOD.md` | 2 (Intent), 3 (causal/work), 7 (subordinate runtime) |
| `specification_methodology/specification/standards/RELEASE_METHOD.md` | 7 (RC lineage coherence) |
| `abiogenesis/specification/INTENT.md` | 6 (engine line) |
| `abiogenesis/specification/PRODUCT.md` | 3 (causal/work) |
| `abiogenesis/specification/requirements/abg/*` | 3 (causal/work), 4 (workspace), partial 1 (admission) |
| `abiogenesis/specification/requirements/gtl/*` | 5 (recursion) |
| `abiogenesis/specification/requirements/product/REQ-P-QUAL.md` | **1 (requirements traceability)** |
| `abiogenesis/specification/scenarios/*` | 1 (requirements traceability), 3 (causal) |
| `odd_sdlc/specification/INTENT.md` | 7 (subordinate) |
| `odd_sdlc/specification/PRODUCT.md` | 7 (subordinate), 3 (ownership table) |
| `odd_sdlc/specification/requirements/02-graph-functions.md` | 1 (publishable lineage) |
| `odd_sdlc/specification/requirements/10-odd-sdlc-software-domain-buildout.md` | 1 (lineage attributable across release/runtime) |
| `odd_sdlc/specification/requirements/09-odd-service-orchestration-plane.md` | 7 (subordinate) |

### Why T-004 keeps rediscovering this

The requirements-traceability strand (Strand 1) is the thinnest anchored:

- **`SPEC_METHOD.md` does not name it.** The constitutional method has zero "lineage" hits. The closest concept is the Constitutional Chain (`Goals → Intent → Product → Requirements → Design → Code → Events → Projection → Delta → Scenarios → Gap Analysis → Repricing`) but that chain is not called "lineage" anywhere in the constitutional surface.
- **`REQ-P-QUAL-019` is the only first-class definition.** It lives in abiogenesis's product-qualification requirements, not in `odd_sdlc` or the shared methodology. The mechanism (`# Validates: REQ-* tags in test files`) is operationally simple but constitutionally unprivileged.
- **`odd_sdlc` references it indirectly** (`02-graph-functions.md:48` "publishable lineage"; `10-buildout.md:137` "lineage and provenance remain attributable") without typing the carrier.
- **The runtime strands (3, 4, 5)** dominate the requirements vocabulary because they have to: replay, frames, continuation, recursion, retry — all need explicit lineage to be replayable. Requirements traceability has no equivalent runtime pressure forcing its formalization.

So when T-004 attempts to triage "where does this gap belong in the chain?", it must reconstruct Strand 1 from sparse anchors. The implementation keeps reinventing the relationship rather than consuming a stable carrier.

### What the homeostatic loop actually needs

T-004's homeostatic reverse path is `Current spec → real-world use case → gap analysis → new goals/intent`. To classify a gap correctly, the triage must answer:

1. Is there a live requirement governing this behavior? (requirement-existence check)
2. Is there a design decision realizing it? (design-existence check)
3. Did code deviate? (realization check)
4. Is there a test/evidence that witnesses or fails this requirement? (evidence-existence check)

These four questions are exactly the requirements-traceability strand. Without typed carriers for it, every gap-triage instance re-derives the lineage from the available raw signals (ambiguity register, requirement closure register, event history, projection, delta).

`REQ-P-QUAL-019`'s `# Validates:` tag mechanism is a partial existing surface but only at the test-file level. The operational T-004 surfaces (`odd_sdlc.app.gaps()`, `gen_gaps()`) do not consume it.

## Recommended Action

This post is informational. Recommended actionable follow-ups:

1. **Promote requirements-traceability lineage to a constitutional concept.** Either:
   - Add a `Requirements Traceability Lineage` section to `SPEC_METHOD.md` naming the constitutional chain as the lineage spine and `# Validates:` (or its successor) as the carrier shape, OR
   - Add it to `ODD_METHOD.md` as a typed `RequirementsTraceabilityLineage` object alongside `IntentLineage`, `ProductAssetModel`, etc. — fed into `eval_gap` as an input alongside event-log-derived intent lineage.

2. **Type the carrier in `odd_sdlc`.** The `requirement closure register` already exists (`odd_sdlc/.ai-workspace/runtime/odd_sdlc-requirement-closure.json` per workspace CLAUDE.md). Promote it from a raw runtime artifact to a typed projection consumed by `eval_gap`. The carrier should answer the four triage questions for each gap.

3. **Cross-reference `REQ-P-QUAL-019` in odd_sdlc.** Either inherit it via `odd_sdlc/specification/requirements/*` or introduce an `odd_sdlc` parallel (`REQ-F-ODDSDLC-LINEAGE-*`) so `# Validates:` tags become a method-level discipline both products share.

4. **Disambiguate the lineage strands in T-004's body.** T-004 currently uses "lineage" colloquially. Naming it as **Requirements Traceability Lineage** (Strand 1) and explicitly citing the four-question triage would make its scope reviewable separately from runtime strands.

Until one of these lands, T-004 will continue to rediscover the relationship every time gap triage needs to classify a mismatch — because the system has six well-anchored lineage strands and one weakly-anchored one, and the weakly-anchored one is the one homeostatic gap analysis needs.

This post is commentary, not law.
