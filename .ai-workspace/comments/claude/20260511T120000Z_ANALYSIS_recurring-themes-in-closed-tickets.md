# Recurring Themes In 369 Closed Tickets: Development Traps Under Iterative LLM Engineering

- author: claude (analysis only — commentary, not law)
- scope: `abiogenesis/.ai-workspace/tickets/completed/` (157 tickets) and `odd_sdlc/.ai-workspace/tickets/completed/` (212 tickets), all closed
- date_range_observed: 2026-04-11 through 2026-05-10 (one month; ~85% in April)
- method: frontmatter pass over 369 tickets + targeted full-body reads on ~25 representative tickets
- discipline: present-tense active surface; ticket vocabulary preserved (F_P/F_D, traversal consequence, lineage, closure decision, projection vs admission, replay-derived truth, carrier, admission)

## Executive Summary

Five themes account for most defect regeneration and most repricings across both repos:

1. **F_P / F_D authority leaks through "second closure" paths.** Substrate runtime keeps re-asserting deterministic checks after a successful F_P turn, or treats worker-narrated `unresolvedReasons` as closure authority. The boundary "F_P owns per-obligation semantic judgment; F_D owns mechanics" keeps getting violated by adjacent code that looks lawful.

2. **Replay-visible runtime truth gets bypassed by local controller state, caller-supplied arguments, or prompt-prose routing.** Closure decisions, retry/repair, iteration advancement, and next-action selection regenerate from in-process state instead of being derived from admitted events. The "only `emit()` writes runtime truth; projection is replay-derived" rule keeps slipping.

3. **Closure decisions are made from lossy carriers — strings, IDs, marker files, or summary fields — not from typed admitted carriers with causal predecessor refs.** `00-imported-sources.md` as the sole REQ authority. `worker_result_report.json.unresolvedReasons` as authority. Generic ID stubs in obligation dossiers instead of payload+digest pressure.

4. **Substrate and domain blur: ABG keeps absorbing domain semantics; ODD keeps reaching into substrate.** Hidden defaults, hardcoded ecosystem grammars, controller-owned semantic centers, and `runtime_config` carrying operator policy instead of ingress-only. The "ABG is mechanism-only; domains supply meaning" rule keeps regenerating violations.

5. **Local rival iteration authority and forced-iteration shims accumulate next to (or instead of) the lawful evaluator-owned runner.** CLI retry controllers, prompt-prose action strings, local fallback heuristics, and harness-directed loops repeatedly stand in for the canonical `start → iterate` spine, then have to be retired in a later cleanup wave.

The dominant LLM-specific mechanism: **when a tenant-local construct exists but is not in the immediate prompt context, the model regenerates the ecosystem default plausible-but-wrong shape** (worker reports as authority; in-process counters as iteration state; prompt prose as routing; marker files as full requirement payload). Each individual regeneration looks locally lawful, which is why these defects evade prompt-time review and only surface in live data_mapper traversal evidence or downstream forensic review.

## Methodology

Sample: 369 closed tickets, all from a single rolling month (2026-04-11 to 2026-05-10).
First pass: frontmatter extraction over 100% of tickets via fielded scan (id, title, type, change_class, change_intent, target_truth, superseded_truth, re_entry_point, intake_source, affected_boundary, closure_law). The bullet-list-style frontmatter (used in older tickets) and YAML-style frontmatter (used in newer tickets) were both parsed.

Second pass: full-body reads on ~25 tickets selected to span themes: B-003 (F_D authority inversion), B-014 (typed fulfillment carrier), B-027 (controller-owned semantic center), B-028 (prompt assembly), B-029 (marker contract drift), B-031 (substrate vs domain), T-051 (event admission centralization), T-074 (assessed-result replay), T-091 (lossy obligation carrier), T-114 (worker report demotion), T-117 (hidden defaults), T-118 (worker invocation package slim), T-121 (steel-thread default), T-138 (causal chain replayability), T-140 (forced-iteration retirement), T-141 (GTL transform boundary).

Cluster method: regex over title + target_truth + superseded_truth + change_intent + intake_source + affected_boundary, with overlap permitted (one ticket can exemplify multiple themes). The user's own vocabulary (F_P/F_D, replay-derived, admitted, carrier, projection, closure law, causal predecessor refs) drove theme naming.

Distribution signal: dates span ~30 days, so "per quarter" framing is unavailable. The signal recorded is "tickets per repo per theme during this wave."

What this analysis cannot resolve:
- Selection bias from ticket-as-classification-unit. Some defects are diffused across many tickets; some big tickets aggregate many smaller regenerations.
- Single-author bias. One developer drives both repos, so themes may reflect personal style more than universal LLM-iteration patterns.
- One-month window. Cycles longer than a month are invisible.
- "Reframe under STDO" can split a single conceptual issue into one design ticket + one realization ticket + one cleanup ticket, inflating apparent counts.

## Themes Table

Counts overlap; one ticket can match multiple themes. abg = abiogenesis, sdlc = odd_sdlc.

| # | Theme | Count | abg/sdlc split | Constitutional truth at stake |
|---|-------|-------|----------------|-------------------------------|
| 1 | Sandbox/install/tenant topology blur | 177 | 68/109 | Source project ≠ release cut ≠ install ≠ builder substrate; PRODUCT.md is product-definition surface, not artifact |
| 2 | Worker transport envelope is lossy | 149 | 63/86 | Worker prompts and result reports are read models, not closure authority; admitted typed carriers are |
| 3 | Replay-visible state is required | 127 | 72/55 | Only `emit()` writes runtime truth; projection is replay-derived; no hidden controller state |
| 4 | Normalization / imported ingress lossiness | 92 | 29/63 | Induction carriers preserve full source payload (ref+digest+marker+normalized+text+family); IDs alone are not authority |
| 5 | F_P/F_D boundary authority inversion | 90 | 46/44 | F_P owns per-obligation semantic judgment; F_D owns mechanics; deterministic re-check after F_P closure does not own authority |
| 6 | Ecosystem grammar leaked into core | 84 | 45/39 | ABG knows only generic traversal mechanism; domain/tenant supplies meaning and concrete implementations |
| 7 | Retry/repair as local rival iteration authority | 81 | 37/44 | The only lawful iteration is closure-disposition + evaluator-selected intent over admitted truth; CLI loops, prompt prose, fallback heuristics are not iteration authority |
| 8 | Gap/triage carry-forward as substrate-owned | 81 | 31/50 | Obligation carry-forward, gap dossier construction, and triage are domain-owned; ABG admits events and projects status |
| 9 | Hidden defaults and implicit policy | 79 | 36/43 | Defaults are visible, versioned, replay-traceable; `??` fallbacks, helper constants, and prompt prose are not policy authority |
| 10 | Requirement authority and traceability | 79 | 28/51 | Requirements are constitutional; design/code/tests trace to them; "marker present" is not a requirement-authority surface |
| 11 | Spec/design constitutional drift (monolith, missing layer) | 60 | 31/29 | Specification surfaces are active-tense and constitutional; design surfaces decompose into governed modules with explicit derivation; STDO governs change |
| 12 | Identity/provenance/nonce distinction | 47 | 29/18 | Identity is constitutional; reproducibility uses nonces and digests, not implicit defaults |
| 13 | Authority lookup via published register | 43 | 13/30 | Published catalogs (asset registry, start-target catalog, function catalog) are how callers address graph functions; not string parsing, not local helper lookups |
| 14 | Typed carrier vs open payload bag | 36 | 19/17 | Payloads cross admission boundaries as schema-admitted carriers, not `Readonly<Record<string, unknown>>` |
| 15 | Closure authority misplacement | 17 | 11/6 | Compatibility read-models do not own closure; closure derives from typed lifecycle projection over admitted events |

## Per-Theme Deep Analysis

### 1. Sandbox / install / tenant topology blur (177)

**Examples:** abg B-001, B-031, B-032; abg T-019, T-022, T-029, T-076, T-077, T-078, T-079, T-080, T-083; sdlc T-013, T-014, T-015, T-052, T-061, T-062, T-064, T-069, T-070

**Constitutional truth at stake (present tense):**
Source project, release cut, product, install, and dev product are distinct ontology positions. The source project is mutable; the release cut is immutable; the product is the released thing; the install is a stamped workspace; the builder substrate is whatever installed product is acting as builder. PRODUCT.md is the source project's product-definition surface, not the artifact and not the builder substrate.

**Why the trap regenerates under LLM iteration:**
Most file-tree operations look ambiguous because the same path can be source, install, sandbox, or test fixture depending on context. The model's default reach is "treat this directory like the project," collapsing the source/install/builder distinction. The trap shows up as: install-time bootstrap data appearing in source workspace files; `runtime_config` carrying both ingress and semantic authority; tests writing into source roots; sandbox state bleeding into source publication. Every fix is local-correct (move this file, scope that path), but the construct keeps regenerating because the underlying ontology is named in CLAUDE.md but not enforced as a typed boundary that fails closed.

**Drift vs noise:** Mostly drift. The ontology is named in the workspace bootstrap (`Source Project`, `Release Cut`, `Product`, `Install`, `Dev Product`) but the realization surfaces (`workspace://` URL scheme, `.genesis/` install root, `.ai-workspace/runtime/`, `build_tenants/<family>/<variant>/`) carry the distinction implicitly. Each ticket that lands re-asserts it locally; the construct is not yet a primary fail-closed boundary in the substrate.

**Distribution:** Both repos heavily; sdlc skews higher because it crosses tenant + builder substrate + downstream sandbox lanes in a single operation more than abg does.

### 2. Worker transport envelope is lossy (149)

**Examples:** abg B-005, B-006, B-007, B-009, B-010, B-019, B-028; abg T-026, T-084, T-085, T-087, T-097, T-108, T-111, T-114, T-115; sdlc B-055, T-021, T-033, T-044, T-055, T-070, T-080, T-118, T-125, T-126, T-127, T-128

**Constitutional truth at stake:**
Worker invocation packages, prompt text, and `worker_result_report.json` are read models and transport adapters. Closure authority lives in typed admitted carriers — `FpTransformResult`, obligation assessment rows, admitted output digests, evaluation evidence. Worker narrative cannot close obligations; worker file/digest output admitted as typed carrier can.

**Why the trap regenerates under LLM iteration:**
This is the most LLM-specific pattern in the entire set. The worker is itself an LLM (Claude). The handoff from substrate to worker is a prompt; the return is a JSON report. The model writing substrate code defaults to "use the prompt to instruct, use the report to close" because that is the dominant ecosystem template. Each individual handoff looks reasonable. But the report becomes load-bearing for closure decisions; `unresolvedReasons` becomes the postflight signal; the prompt becomes routing authority; the full handoff manifest becomes a 445 KB file that the worker can't read (T-109/T-118). The fix is structural: demote the report to compatibility read-model, slim the worker invocation package, route closure through typed carriers. But the next worker integration regenerates the same defect unless the typed admission boundary is the immediately-visible default in the substrate.

**Drift vs noise:** Drift. The pattern is that "tell the worker, read the report" is *plausible architecture*, and resisting it requires the typed admission boundary to be primary in the substrate's own ergonomics. Tickets keep landing because each new live integration finds another corner where worker-narrated truth slipped past admission.

**Distribution:** Skews sdlc because sdlc is the consumer of worker dispatches at a much higher integration depth than abg.

### 3. Replay-visible state is required (127)

**Examples:** abg B-027 (controller orchestration), T-018, T-041, T-044, T-046, T-049 (retry from replay), T-054, T-055, T-058 (gen-gaps over replay), T-074 (assessed-result advances runner), T-088, T-091, T-092, T-095 (event-sourced ledger), T-098, T-121; sdlc T-105 (whole-graph iteration), T-135, T-138 (causal chain replayability), T-140 (retire forced iteration)

**Constitutional truth at stake:**
The event stream is append-only. `emit()` is the only lawful write into runtime truth. Projection is replay-derived. Delta is derived, not stored authority. Iteration advancement is derived from `IterationAdvanceDecision` over replayed events, not from in-process loops over caller-supplied state. T-138 codifies it as: **a decision is lawful only if replay can reproduce it.**

**Why the trap regenerates under LLM iteration:**
"Loop until done" is the most plausible imperative shape for any iteration task. The model writes a controller that keeps a counter, a last-result, a retry-attempt-id, and decides what to do next from in-process state. This produces tests that pass because they share the controller's frame; it produces runs that succeed because the in-process closure is consistent with itself. It does not produce replayable truth. Every audit pass discovers another carrier (caller-supplied `candidateManifestId`, controller-local `last_outcome_kind`, harness-directed dispatch) that has to be reconstituted from admitted event truth. T-049 is the cleanest example: `deriveRetryRepairDecision(...)` was accepting caller-supplied attempt count and manifest id; the fix is to derive both from replayed runtime facts.

**Drift vs noise:** Drift, persistently. This is the dominant abg theme (72 tickets, 56.7% of theme matches). Replay-derivation is named everywhere in the bootstrap but the immediate ergonomics of writing a controller pull toward in-process state. Without runtime types that *refuse to construct* from non-admitted state, the model regenerates the defect.

**Distribution:** Skews abg because abg owns the runtime substrate; sdlc consumes the runtime contract.

### 4. Normalization / imported ingress lossiness (92)

**Examples:** sdlc B-006, B-010, B-014, B-016, B-026, B-045, B-051, B-056, B-063; sdlc T-091 (lossy obligation carrier), T-094, T-095, T-096, T-097 (managed traversal bootstrap), T-099 (tranched pressure), T-134 (conform project authority)

**Constitutional truth at stake:**
Induction carriers preserve concrete source authority: source ref, digest, marker, normalized marker, extracted text or bounded summary, family allocation, ambiguity state, evidence refs. Generic ID stubs are not authority for downstream prompt edges. `00-imported-sources.md` is a lineage/index ledger, not the only requirement authority.

**Why the trap regenerates under LLM iteration:**
Imported authority is variable-shaped. The model reaches for the most uniform projection it can find — a list of marker IDs, a normalized ID surface, a "requirements present" boolean — and treats that as sufficient pressure for downstream construction. T-091 is the exemplar: `Fg_conform_project` closes from a thin marker ledger; downstream `derive_intent_surface` receives generic ID obligations rather than full imported requirement pressure; the F_P worker produces output that cites IDs without actually addressing the imported content because the prompt didn't carry the imported content. The fix re-installs the rule that every prompt-bearing edge receives a typed obligation dossier with source payload or bounded summaries.

**Drift vs noise:** Drift specific to bootstrap/induction work, but it generalizes — "every prompt-bearing edge needs payload pressure, not ID pressure" is the universal form. The construct is not yet primary in the carrier law.

**Distribution:** Heavy sdlc (68%) because sdlc owns the imported-project ingress lane.

### 5. F_P / F_D boundary authority inversion (90)

**Examples:** abg B-003 (gap-first F_D restored), B-013 (obligation ledger declaration), B-014 (typed fulfillment assessments), B-017 (target certification), B-018 (proof-hold), T-091 (premature closure guards), T-114 (worker report demotion); sdlc B-002, B-019 (gap analysis vs implementation completeness), B-020, B-041, B-086 (F_D disambiguation), T-080 (requirement fulfillment ledger), T-114, T-139 (public gaps as read-only)

**Constitutional truth at stake:**
F_P owns the per-obligation semantic judgment of `A.req_i → B.result_i`. F_D owns mechanical envelope checks: existence, schema, digest, write-root, identity, admission envelope, target certification. Determinism does not reclassify a check as F_D. Subdivision of one requirement into many obligations is structural; each per-obligation check is still F_P.

**Why the trap regenerates under LLM iteration:**
"Just check it deterministically" is a plausible-and-tempting bug fix when an F_P turn produced something close-but-not-right. The post-F_P deterministic recheck is locally lawful, mechanically correct, and visibly tightens the system. B-003 caught the regression: after a successful `F_P` turn on `derive_implementation_design_surface`, `result_ingest.py` reran manifest-local `F_D` and emitted `closure_failed` with `policy_reason = fd_failures_unresolved_after_fp`. The recheck reads like an audit; it is an authority inversion. The same template regenerates whenever someone tightens "obvious" checks behind a successful semantic turn.

The recurring memory feedback (feedback_fp_fd_boundary.md) explicitly names this as a recurring bug class (B-003 / B-013 / B-014 / B-016 / B-017). "Behavioral F_D" is the code smell.

**Drift vs noise:** Drift, with strong evidence of recurrence. The construct is named in CLAUDE.md (§4 GTL/ABG Boundary, last paragraph), but the substrate ergonomics still permit deterministic checks to be wired post-F_P in a closure-authority slot.

**Distribution:** Balanced across both repos (51%/49%).

### 6. Ecosystem grammar leaked into core (84)

**Examples:** abg B-014, B-015 (publication ledger backend neutrality), B-016 (IoC contract model), B-027 (controller-owned semantic center), T-008 (one runtime execution law), T-038 (constitutional design monoliths split), T-068 (research scenario catalog); sdlc B-001 (released ABG boundary), B-074 (scala cross-suffix), B-075 (build tool byproducts), T-002 (pure function builder framing → stateful), T-066 (downstream materialization over graph functions)

**Constitutional truth at stake:**
ABG knows only generic traversal mechanism. Domains supply meaning and concrete implementations. Hooks ABG consumes are IoC-shaped: contract, reference, resolver. Scala/sbt/maven/openlineage knowledge belongs in tenant generation code, not in substrate runtime. Python-specific or TypeScript-specific knowledge belongs in tenant lanes.

**Why the trap regenerates under LLM iteration:**
This is the strongest form of ecosystem-default reach. The model knows sbt's `%%` cross-suffix convention; it knows scala dependency coordinates; it knows how `claude-cli` is invoked. When asked to generate or modify substrate code, the model brings ecosystem-default shape into substrate because that's the dominant template. B-074 is the cleanest exemplar: the data_mapper build tenant emitted `openlineage-spark_2.13_2.13:1.13.1` because the artifact id already had a Scala suffix and `%%` added it again — a defect specifically because the substrate-vs-tenant knowledge boundary was not enforced. B-016 is the more general form: ABG hooks were inconsistent IoC shapes because each hook was added by reaching for whatever pattern was locally plausible, not by binding to one consistent IoC model.

**Drift vs noise:** Drift, and probably the single most recurring trap in LLM-driven substrate work. The model has strong defaults for every common ecosystem; the substrate has weaker defaults for its own boundary; the model wins by volume unless the substrate's IoC contracts are the immediately-visible default.

**Distribution:** Slight abg skew (54/46) — abg is the core substrate so it accumulates more of these boundary violations.

### 7. Retry/repair as local rival iteration authority (81)

**Examples:** sdlc T-049 (retry freshness from replay), T-101 (retry-eligible worker report rejection), T-120 (retry-local repair from gap dossiers), T-129 (evaluator/liveness substrate), T-135 (evaluator-owned runner spine), T-140 (retire local forced-iteration tech debt); abg T-003 (repair signal / control plane), T-005 (root run supervisor), B-002 (generic retry manifest), T-042 (generic retry/repair), T-045 (retry/repair/leaf-task), T-114 (bounded attempt exit)

**Constitutional truth at stake:**
The only lawful iteration states are closure dispositions and evaluator-selected intents over admitted truth. Local loops, local retry strings, broad fallback heuristics, prompt-pressure action prose, and CLI retry controllers are not iteration authority. Effect adapters, process supervision, and rendering code are permitted; iteration-decision code is not.

**Why the trap regenerates under LLM iteration:**
Iteration is the most natural imperative shape. "If it failed, try again" pulls toward a retry function. A retry function pulls toward retry budget, attempt counter, last-error inspection, branching on string content. Each retry function lands as a "small helper" that becomes the actual iteration center. The model is not malicious here — the substrate is asking for an explicit evaluator-owned runner, and the model is producing the more familiar local control loop because that's plausible. T-140 is the explicit retirement: installed-operator local attempt loops, local action strings used as executable commands, prompt-prose instructions that function as routing authority, CLI retry/context injection business logic, local public-gaps ranking/fallback. All of those existed; all of them had to be retired *after* the evaluator-owned spine landed.

**Drift vs noise:** Drift. The construct (evaluator-owned runner; closure-disposition algebra) is named but the ergonomic gravity of "write a loop" is constant.

**Distribution:** Slight sdlc skew (54/46) because sdlc is where the operator-facing iteration accumulates.

### 8. Gap/triage carry-forward as substrate-owned (81)

**Examples:** sdlc B-019 (gap analysis vs implementation completeness), B-025 (canonical capability truth), B-028 (manifest gap scope), B-031 (obligation-ledger carry-forward externalized to abg), B-053 (bare gaps → operator analysis), T-008 (zoom over any two graph points), T-022 (gap-analysis dossier), T-067 (gap triage as graph-function-addressable follow-up), T-120 (retry from typed gap dossiers); abg B-018 (proof-hold policy), T-067

**Constitutional truth at stake:**
Obligation carry-forward, gap dossier construction, and triage are domain-owned. ABG admits events and projects status; ABG does not synthesize obligation topology inside runtime. GTL/domain author the obligation-ledger declaration; ABG validates, carries, publishes, and consumes that declaration.

**Why the trap regenerates under LLM iteration:**
Gap analysis sits between substrate and domain in a way the model finds hard to maintain. When asked "why didn't this close," the natural fix is to add the obligation check at the substrate level because the substrate has the runtime state. But that absorbs domain knowledge into substrate. B-013 / B-014 / B-015 / B-031 form a sequence: each ticket pushes obligation topology back out of abg runtime into GTL declaration + domain consumption, but the next gap tightening regenerates a small substrate-owned check.

**Drift vs noise:** Drift, with a clear consolidation arc through B-013/B-014/B-015. The construct is named (GTL declares obligation_ledger; ABG validates) but the temptation to "just check it here" persists.

**Distribution:** Skews sdlc (62%) — sdlc is the gap-analysis consumer.

### 9. Hidden defaults and implicit policy (79)

**Examples:** abg T-117 (audit hidden defaults and externalize abg_defaults bundle), B-028 (prompt-budget carrier), B-010 (env sanitizer narrow); sdlc B-029 (marker certification drift), B-014 (family-header IDs admitted as requirements), B-016 (normalization defaulting), T-051 (event/failure literal centralization), T-065 (STDO aliases and first-missing-layer triage)

**Constitutional truth at stake:**
Defaults are visible, versioned, replay-traceable, and live in one bundle (`abg_defaults`) with digest/provenance. `??` fallbacks, helper constants, prompt prose, and helper conventions are not policy authority. When a default participates in a runtime selection, the selection records that the default participated.

**Why the trap regenerates under LLM iteration:**
This is the cleanest LLM-mechanism trap. The model reaches for `??` and optional-parameter defaults because they're idiomatic. Each individual default is locally reasonable. The defects only surface when (a) a default needs to change and there's no central surface, or (b) a default causes a divergence the operator can't explain because it never appeared in a config. T-117 explicitly inventoried hidden defaults across `??`, optional parameter fallbacks, prompt prose, local test conventions, and hidden runtime constants — externalizing them into one versioned bundle.

**Drift vs noise:** Drift. The ergonomic gravity of `value ?? DEFAULT` is constant; without a substrate-level "all defaults appear in `abg_defaults`" boundary, the model will continue regenerating local defaults.

**Distribution:** Balanced (46/54).

### 10. Requirement authority and traceability (79)

**Examples:** sdlc B-006 (live requirement authority in bootstrap), B-009 (traceability evaluators), B-010 (imported REQ IDs), B-014 (family header IDs), B-045 (canonicalize imported requirement authority), B-051 (imported intent carry-forward), T-010 (bidirectional traceability), T-035 (requirement-closure projections), T-042 (requirement-closure bound to asset contract), T-072 (capability inventory from requirements)

**Constitutional truth at stake:**
Requirements are constitutional. Design/code/tests trace to them. Imported requirement authority canonicalizes before any constructive dispatch. "Marker present" is not authority; "requirement-id present in a file" is not authority; only typed admitted requirement-family carriers with source ref, digest, marker, normalized marker, family allocation, ambiguity state, and evidence refs are authority.

**Why the trap regenerates under LLM iteration:**
The model treats requirements as documentation, not as a typed carrier. When asked to ingest imported requirements, the model writes a markdown file, lists IDs, marks the file present, and reports done. Downstream traceability evaluators then see ID matches and call the trace closed. The actual constitutional content (what each requirement says, what evidence covers it, what gaps remain) never enters typed admitted authority.

**Drift vs noise:** Drift, deeply tangled with theme 4 (normalization lossiness). The two themes are nearly the same defect at different stages: ingress carrier lossiness produces downstream traceability lossiness.

**Distribution:** Heavy sdlc (65%) — sdlc owns requirement-bearing traversal.

### 11. Spec/design constitutional drift (60)

**Examples:** abg T-008 (one runtime execution law), T-038 (constitutional design monoliths into authority surfaces), T-040 (delete retired monolith stubs); sdlc T-003 (spec-method build topology), T-004 (homeostatic loop), T-009 (closure with constitutional reentry), T-018 (workspace assets canonical path), T-064 (ABG and odd_sdlc installer contract before RC), T-093 (governed scheduling phase between design and realization)

**Constitutional truth at stake:**
Specification surfaces are active-tense and constitutional. Design surfaces decompose into governed modules with explicit derivation back to specification. STDO (SPEC + TICKET + DESIGN_MODULE + ODD) governs change. No constitutional change is lawful outside these four methods. Monolithic design documents lose the per-module derivation; they need to be split into constituent authority surfaces.

**Why the trap regenerates under LLM iteration:**
Design documents grow because the model writes coherent paragraphs that span topics, and reviewers (including the model itself) accept the coherence as authoritative. The decomposition discipline ("this paragraph is its own module with its own requirement trace") requires resisting prose flow. T-038 split GTL/ABG constitutional design monoliths into constituent authority surfaces; T-040 retired the monolith stubs; the cycle is likely to repeat as new design work accretes.

**Drift vs noise:** Mixed. Some of this is normal-iteration noise — design grows, design splits, design grows again. The drift component is the model's preference for narrative coherence over modular derivation.

**Distribution:** Balanced (52/48).

### 12. Identity / provenance / nonce distinction (47)

**Examples:** abg B-012 (default identity creation/detection), T-069 (idempotent typed graph instances), T-075 (nonce-bound derived content), T-079 (installer standards reference copy), T-088, T-089, T-095 (event-sourced ledger); sdlc T-045 (sha256 digests), T-099 (tranched pressure)

**Constitutional truth at stake:**
Identity is constitutional and follows IDENTITY_METHOD. Reproducibility uses nonces and digests; provenance carries source ref + digest. Runs, attempts, calls, and frames each have distinct identities; collapsing them loses replay fidelity.

**Why the trap regenerates under LLM iteration:**
Identity feels like plumbing. The model writes UUIDs in casual places, treats run-id and attempt-id as interchangeable, or uses local counters. Each integration finds that some downstream consumer needed a distinct identity that wasn't being threaded.

**Distribution:** Skews abg (62%) — substrate-side identity discipline.

### 13. Authority lookup via published register (43)

**Examples:** abg B-024 (operator asset registry and ownership), T-014 (publication lookup), T-025 (M04 public asset addressing), T-069 (idempotent graph instances); sdlc T-017 (start-target catalog and asset-ownership index), T-030 (TypeScript GTL function catalog), T-058 (CLI adapter over graph/query/start surfaces)

**Constitutional truth at stake:**
Published catalogs are how callers address graph functions and assets. `graph_function:` and `asset:` handles resolve through `query_domain`, which publishes `start_target_catalog`, `asset_ownership_index`, and `execution_contract_surface` projections. String parsing, local helper lookups, and "search the workspace for files matching this name" are not lookup authority.

**Why the trap regenerates under LLM iteration:**
"Just look it up" reaches for `glob`, `find`, or a string-match helper. Each instance is locally functional; the construct fails to scale because every caller writes its own lookup, drift accumulates, and the published catalog never becomes load-bearing.

**Distribution:** Skews sdlc (70%) — sdlc owns the operator-facing addressing surface.

### 14. Typed carrier vs open payload bag (36)

**Examples:** abg T-048 (replace leaf-task open payload bags with schema-admitted carriers), T-090 (assurance carriers and plugin seams); sdlc T-024 (execution contract runtime binding to typed carrier), T-049 (closed runtime effects ingress), T-086 (closed_blocking_reason carriers), T-122 (feature scope carrier)

**Constitutional truth at stake:**
Payloads cross admission boundaries as schema-admitted typed carriers. `Readonly<Record<string, unknown>>` is not admission; it is a hole in admission. `LeafTaskEnvelope.input` and `LeafTaskCompletedEvent.output` as open JSON bags fail; closed admitted carriers succeed.

**Why the trap regenerates under LLM iteration:**
TypeScript and Python both allow open records easily; closing them to typed carriers requires explicit design work for each carrier family. The model produces `Record<string, unknown>` when uncertain, and once that exists in one place it gets reused as the path of least resistance.

**Distribution:** Balanced (53/47).

### 15. Closure authority misplacement (17)

**Examples:** abg B-029 (continuation-owned yield vs failure-shaped public status), T-034 (proof-hold projection demoted), T-114 (assessed-result advances runner); sdlc T-114 (worker_result_report demotion), T-139 (public gaps as read-only evaluator view)

**Constitutional truth at stake:**
Compatibility read-models do not own closure. Closure derives from typed lifecycle projection over admitted events. `worker_result_report.json` is a read model. `public gaps` is a read model. Continuation-owned yield truth, not failure-shaped public status, is the authority for what to do next.

**Why the trap regenerates under LLM iteration:**
Read models look like authority because they expose the relevant information in convenient shape. The model reaches for them when writing closure logic because that's where the data is. Demoting them to compatibility shape requires a separate authority surface to exist *first*, which is iteration order the model often gets wrong.

**Distribution:** Skews abg (65%) — substrate is where closure authority is defined.

## Cross-Cutting Patterns

### Pattern A: "Each fix looks local-correct; the construct keeps regenerating"

Every ticket here is a fix that landed and passed proof. Every ticket records a defect that *reappeared in a different form* shortly after the constitutional fix. This is the strongest signal that the issue is not the individual defects but the substrate's failure to make the right shape *the immediately-visible default*.

Examples:
- B-003 fixed gap-first F_D authority; B-013 / B-014 / B-015 / B-017 then revisited the obligation-ledger / fulfillment / target-certification family because the same authority inversion regenerated in adjacent code.
- T-026 / T-027 / T-076 / T-079 / T-080 form a long arc of installer/topology fixes that each fixed a specific divergence but didn't prevent the next divergence.
- T-049 / T-074 / T-105 / T-138 / T-140 form the replay-derivation arc; each ticket either restored replay-derivation or retired local rival iteration; T-140 retires forced-iteration shims that had accumulated despite earlier tickets.

### Pattern B: "Live data_mapper traversal is the dominant defect-discovery surface"

85 of 369 tickets cite `data_mapper.testNN` or `dmt.testNN` as intake source — about 23%. Code review and forensic posts cite a further 106. This means **roughly 50% of all defects in the wave were discovered by running the system through a single integration test against an actual project**, not by unit tests or proof gates. The system passes its own proof gates and then fails on live traversal because the proof gates don't exercise the integration paths where the recurring traps live.

T-121 codified the response: steel-thread delivery by default. Land the smallest typed vertical slice with deterministic fixtures before widening to full live runs. But the steel-thread discipline itself can be defeated by the same traps if the steel-thread fixtures are themselves lossy (T-091 was reopened *because the steel-thread fixtures used the same lossy ingress shape as the full live run*).

### Pattern C: "Substrate and domain blur in both directions"

Substrate (abg) keeps absorbing domain semantics: obligation topology, gap classification, fulfillment assessment, asset marker contracts. Domain (sdlc) keeps reaching into substrate: traversal control, retry decisions, iteration order, prompt routing. The boundary "ABG is mechanism-only; domains supply meaning" is named in CLAUDE.md but defects regenerate on both sides.

The deeper mechanism: the model's planning is *not boundary-aware*. When asked "make this work," the model picks the layer it has the most information about, not the layer that owns the law. If ABG state is visible to the model in the current context, the model fixes it in ABG. If the SDLC carrier is visible, the model fixes it in SDLC. Each fix is locally lawful and produces a defect on the other side of the boundary.

### Pattern D: "STDO-process tickets and reframe tickets compete with implementation tickets for closure authority"

A significant number of tickets are not "fix a bug" but "fix the way we fix bugs" — reframe under STDO, split a monolithic design surface, retire a deprecated path, externalize hidden defaults. These tickets are necessary and they land lawfully under TICKET_METHOD. They also signal that the iteration discipline itself is being repeatedly tightened against a regenerating drift.

This is not a flaw in STDO; it's the cost of constitutional governance over LLM-driven engineering. Each STDO tightening ticket buys a real piece of discipline that the model would otherwise erode.

### Meta-pattern: Repo-specific failure modes

Examining the repo distribution per theme surfaces three repo-specific patterns the user may not have anticipated:

1. **abg is the replay-derivation theme home (theme 3: 72/55 split toward abg)**. This is expected — abg owns runtime substrate — but the size is striking. Replay-derivation as a discipline is being defended primarily in the substrate, not in the consumer.

2. **sdlc is the lookup-via-published-register theme home (theme 13: 13/30 split toward sdlc)** and the requirement-authority/traceability theme home (theme 10: 28/51 toward sdlc). sdlc is the operator-facing addressing and requirement-handling layer; these themes localize there. But the *defect class* is identical in both repos — string-based lookup vs typed register lookup, marker-based authority vs payload-based authority. The construct is universal; the location varies.

3. **Closure-authority-misplacement (theme 15) is small (17) but skews hard to abg (65%)**. This suggests the substrate is more proximate to closure decisions and therefore more vulnerable to misplacing them. The construct "compatibility read-models do not own closure" probably needs to be primary in *ABG* documentation more than in sdlc documentation.

4. **Worker-transport-envelope (theme 2) and gap-triage-carry-forward (theme 8) both skew sdlc** because they're integration boundaries — and integration boundaries are where the model reaches hardest for ecosystem defaults. The two are largely the same defect class (lossy compression at a boundary that should preserve typed payload).

## Primacy Recommendations

What to elevate, where to elevate it, and why current placement fails to constrain behavior.

### P1: The constructive carrier discipline must be primary in `ODD_METHOD.md`

**Truth to elevate:** An ODD product is a graph: typed assets, published graph functions, runtime that admits typed carriers, projection over admitted events. The constructive carrier is the primary realization shape. Imperative service methods, orchestration loops, and one-off scripts are not lawful substitutes.

**Current placement:** Named in `CLAUDE.md` `## Embedded Method Compression / ODD Compression` (workspace bootstrap). Visible only when the workspace bootstrap is in context.

**Why it fails to constrain:** The construct is in the bootstrap, but the substrate's own ergonomics (TypeScript module shape, helper functions, controller classes) make the imperative alternative the path of least resistance. The model writes the loop because the loop is in scope; the constructive carrier is in the docs.

**Primacy proposal:** ODD_METHOD.md §1 (Core Position) should open with the constructive carrier rule and name the failure modes — orchestration loops, controller-owned semantic centers, prompt-prose routing, CLI retry controllers — as primary anti-patterns. Then ODD-shaped repos should have a `make-carrier.sh` or equivalent template that produces a typed carrier scaffold by default when adding new state, so the path of least resistance flips.

### P2: "Closure decision is replay-reproducible" must be primary in `ODD_METHOD.md` and `SPEC_METHOD.md`

**Truth to elevate:** A closure decision is lawful only if replay can reproduce it. Carriers in the consequence chain carry predecessor refs sufficient to reconstruct the decision from the event log without local memory, wall-clock ordering, or runner-local arrays.

**Current placement:** T-138 codifies it as ticket-local closure law; it appears in CLAUDE.md §7 Runtime Truth Rules as items 1–6 but not as the primary headline rule.

**Why it fails to constrain:** Replay-reproducibility is one rule among many in §7. The model treats it as "good practice" and complies when reminded, but reaches for in-process state when not reminded. The construct is not in the model's *default planning* for runtime work.

**Primacy proposal:** SPEC_METHOD.md should declare "replay-reproducibility is a closure prerequisite" at constitutional level, and any closure decision admitted without predecessor refs should be a process defect. ODD_METHOD.md should specify that admitting evidence without causal basis fails closed at the carrier admission boundary, not at later projection time.

### P3: "F_P owns per-obligation semantic judgment; deterministic checks behind F_P are still F_P" needs a primary fail-closed boundary

**Truth to elevate:** F_P owns the semantic quality of `A.req_i → B.result_i`. F_D owns mechanics. Subdivision per obligation is structural; each per-obligation check remains F_P. Deterministic does not reclassify as F_D. Behavioral F_D is a code smell.

**Current placement:** CLAUDE.md §4 (last paragraph). Stated, but as a paragraph buried in the GTL/ABG Boundary section.

**Why it fails to constrain:** The construct keeps regenerating because each new "obvious" deterministic check looks like F_D mechanics. There's no fail-closed substrate boundary that refuses to admit a post-F_P deterministic-check edge into closure-authority position. The construct is policy; it needs to be a typed boundary.

**Primacy proposal:** Make the closure-fold typed admission refuse closure when a deterministic check sits between F_P assessment and closure decision unless that check is explicitly registered as F_D-mechanics-class (existence, schema, digest, write-root, identity, admission envelope, target certification). Anything outside that closed class fails admission as "behavioral F_D leakage." Document the closed F_D-mechanics class in ODD_METHOD.md as primary.

### P4: "Source project / release cut / product / install / dev product" must be a typed boundary, not a documented ontology

**Truth to elevate:** Source project ≠ release cut ≠ product ≠ install ≠ builder substrate. PRODUCT.md is product-definition surface, not artifact. `.genesis/` is install root, not source. `build_tenants/<family>/<variant>/` is tenant lane, not source-tree root.

**Current placement:** CLAUDE.md `## Recursive Product Taxonomy`.

**Why it fails to constrain:** Stated as ontology. Not enforced by the file system, by URL scheme strictness, or by typed path carriers. The model reads the names and then writes file operations against bare paths that don't preserve the distinction.

**Primacy proposal:** Introduce typed path carriers (`SourceTreePath`, `InstallRoot`, `TenantLane`, `SandboxPath`, `BuilderSubstrate`) that are mutually non-assignable. Bare file operations against unknown paths fail closed. Update ODD_METHOD.md and SPEC_METHOD.md to require typed path carriers at the substrate boundary. This is the same construct as theme P1 (typed carrier) applied to filesystem operations.

### P5: "Published catalog is the only lookup authority" needs to be primary in operator-facing surfaces

**Truth to elevate:** `query_domain` publishes `start_target_catalog`, `asset_ownership_index`, and `execution_contract_surface`. Callers resolve `graph_function:` and `asset:` handles through these catalogs. String parsing, glob search, and local helper lookups are not lookup authority.

**Current placement:** sdlc CLAUDE.md `## 4. Start Here` mentions `query_domain`. ODD_METHOD.md does not centralize the rule.

**Why it fails to constrain:** Operator-facing code keeps regenerating string-match lookups because they're easier to write than catalog-driven resolution. The construct only becomes primary when the catalog is the easiest thing to reach for.

**Primacy proposal:** ODD_METHOD.md should declare published catalog as the only lookup authority for graph-function and asset handles. CLI surfaces should fail closed on unresolved handles rather than falling back to glob/grep. Tenant scaffolds should ship with catalog-driven lookup helpers as the default.

### P6: "Worker narrative is read-model; typed admission is authority" needs to be primary in worker-integration sections

**Truth to elevate:** Worker prompts are transport. `worker_result_report.json` is a compatibility read-model. Closure derives from typed admitted carriers — file existence, digest, materialized-file admission, execution evidence, obligation assessment carriers. `unresolvedReasons` is advisory prose, not closure input.

**Current placement:** T-114 and T-118 codified it; CLAUDE.md does not yet name it as a primary rule.

**Why it fails to constrain:** Worker integration is a frequent surface in both repos. The model reaches for the most plausible shape — instruct via prompt, close via report. The construct needs to be in the immediate context whenever worker code is being written.

**Primacy proposal:** Add a "Worker Transport Discipline" section to ODD_METHOD.md and to the GTL bootloader (§7 Runtime Truth Rules) that explicitly demotes worker reports and prompts to read-model status and names typed admission as closure authority. The construct should appear in worker_invocation_package generation code as a structural comment so it survives in immediate context.

### P7: "All defaults are visible in `abg_defaults`" needs to be a real config surface, not policy

**Truth to elevate:** ABG defaults live in one versioned bundle with digest/provenance. `??` fallbacks, helper constants, prompt prose conventions, and helper-function defaults are forbidden. Runtime selections that participate with a default record that the default participated.

**Current placement:** T-117 created the construct; T-117 is closed but the audit was scoped (`plugin_traversal_observer_fallback_slice_plus_audit_inventory`).

**Why it fails to constrain:** Even with one bundle, the next new feature adds another local default unless adding to the bundle is the easier path. The construct becomes primary only if the substrate's own ergonomics push defaults into the bundle.

**Primacy proposal:** Make `abg_defaults` a real strongly-typed config carrier that substrate code reads via a single API (`getDefault(key)`). Lint or test against `??` and optional-parameter fallback patterns in substrate code. Document the discipline as primary in `REQ-R-ABG3-POLICY`.

## Caveats

- **One-month window.** Cycles longer than 30 days are invisible. Themes that recur every 6 weeks would show as one ticket here.
- **Ticket-as-classification-unit bias.** A single conceptual issue can show up as one design ticket + one realization ticket + one cleanup ticket, inflating counts. Conversely, a diffuse pattern may not surface as any single ticket.
- **Single-author bias.** The themes may reflect one developer's preferences plus one model's defaults more than a universal pattern.
- **Selection bias toward closed tickets.** Open backlog and abandoned work are not in the sample. Themes that the developer chose not to close may differ.
- **Theme overlap is high.** A single ticket frequently matches 3–5 themes. The counts are correlated; the *primacy* recommendations are not.
- **Active-surface writing discipline assertion.** The themes are written present-tense; the analysis text describes recurring failures in past tense where the failure itself is historical. This is commentary, not constitutional law.
- **No code was read or modified.** This analysis is over ticket text and CLAUDE.md context only.

## Closing Observation

The dominant signal across these 369 tickets is not that any one theme is dominant — the top five themes are within 2x of each other in count. The dominant signal is **the same defect class regenerating in adjacent code after a constitutional fix landed**. That is the development trap. It is not solvable by tightening individual fixes; it is solvable by making the right construct the immediately-visible default in the substrate's own ergonomics.

Six of the seven primacy recommendations above (P1–P3, P5–P7) reduce to the same proposal: take a construct that is currently *policy* and make it a *fail-closed typed boundary*. The seventh (P4) does the same for the source/install ontology.

Whether the methodology surfaces (`SPEC_METHOD.md`, `ODD_METHOD.md`, `TICKET_METHOD.md`, `DESIGN_MODULE_METHOD.md`) need to add those constructs as primary content, or whether the substrate code needs to enforce them at the typed boundary, is the next decision.
