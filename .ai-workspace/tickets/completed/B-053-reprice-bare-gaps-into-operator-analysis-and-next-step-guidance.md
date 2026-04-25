---
id: B-053
title: Reprice bare gaps into operator analysis and next-step guidance
type: feature
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: operator-facing-gap-analysis-over-one-authoritative-dossier
change_intent: bare `odd_sdlc gaps` currently behaves too much like raw dossier projection over explicit scope grammar. The primary operator UX is the agentic coder CLI (`claude`, `codex`, `gemini`) running the domain package as its workspace tool, so the public contract should default to workspace scope and return one governed gap analysis with frontier classification and concrete next steps, while machine/raw output remains explicit opt-in.
change_class: product_reprice
re_entry_point: product
affected_boundary: `build_tenants/python/code/odd_sdlc/app.py`, installed bootstrap surfaces (`AGENTS.md`/`CLAUDE.md` generation), `gap_dossier.py`, published gap-analysis projections, CLI help/docs, and source/install operator proofs
priority: high
triaged_at: 2026-04-24
created_at: 2026-04-24
updated_at: 2026-04-25
dependencies:
  - B-051 completed
  - B-052 completed
intake_source: operator UX review 2026-04-24 after the `test38` and `test39` closure wave; current `gaps` law is still too adapter-shaped for the expected agentic coder CLI experience
target_truth: bare `odd_sdlc gaps` means `scope=workspace` and returns one operator-facing gap analysis projected from the published workspace dossier. The default surface is optimized for the installed Python CLI path used by the agentic coder CLI (`claude`, `codex`, `gemini`) and names the dominant frontier, classifies the blocker kind, and suggests the next lawful moves without inventing a second rival truth model. The installed bootstrap guidance and Python CLI help teach this as the ordinary path. Raw machine output remains an explicit opt-in mode.
superseded_truth: operators must remember `--scope workspace` and manually interpret raw dossier or JSON output to infer the frontier and next action. Suggestions, when they exist, are scattered across comments, logs, or operator folklore rather than projected from one admitted gap surface.
closure_law: this ticket closes when bare `gaps` defaults to workspace analysis in the installed Python CLI, the bootstrap/help surfaces teach bare `gaps` as the normal operator path, the operator-facing output is a projection over one authoritative gap dossier rather than a rival heuristic model, machine/raw output is explicit opt-in, and source/install proofs cover both the default and the machine mode.
evaluation_criteria:
  - bare `gaps` defaults to workspace scope without requiring flag folklore in the installed Python CLI path
  - the default output names the frontier, blocker class, and next lawful steps
  - the analysis is derived from one published dossier/read-model family rather than controller-side reconstruction
  - explicit raw/json output remains available for scripts and proofs
  - malformed or missing published dossier truth still fails closed instead of silently inventing guidance
proof_surface:
  - source proof that bare `gaps` defaults to workspace scope and emits operator-facing analysis with next-step guidance
  - source proof that explicit raw/json mode still emits the machine carrier without narrative reshaping
  - install proof on an imported workspace that the frontier classification and suggested next steps agree with the published dossier head
non_closure_conditions:
  - closure is claimed while bare `gaps` still requires `--scope workspace` for ordinary operator use
  - the default analysis is assembled from controller-local heuristics that can disagree with the published dossier
  - raw machine output is removed instead of made explicit
  - a second gap-analysis model is introduced beside the admitted dossier/read-model family
---

## Why This Ticket Exists

The current public story is correct in structure but too low-level in use.

`odd_sdlc` already teaches `start` / `gaps` as the operator surface, but the
installed Python CLI still treats bare `gaps` too much like a read-model
inspection tool rather than the ordinary operator answer.

The primary operator here is not a bespoke browser shell or a raw human
memorizing control-plane flags. It is the agentic coder CLI running the
installed Python CLI in the workspace and asking the domain package what is
wrong and what comes next.

The operator expectation is:

- "what is wrong?"
- "what is next?"
- "what do I do?"

That should be projected from one truthful gap surface, not reconstructed by
operator archaeology across dossier JSON, frontier notes, and comments.

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`

This ticket reads current design truth from:

- `build_tenants/python/design/README.md`
- `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`
- `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`

## Migration Declaration

- old_truth_path: bare `gaps` exposes explicit scope grammar and raw dossier-oriented output as the normal operator path
- new_truth_path: bare `gaps` projects one workspace-scoped operator analysis with frontier classification and next-step guidance, while raw machine output becomes explicit opt-in
- producers_old:
  - `app.py` gaps command binding
  - raw dossier/read-model projection without operator summary law
- producers_new:
  - one workspace-scoped gap analysis projection owned by the admitted dossier family
- consumers_old:
  - human operators reading raw gap payloads
  - comments/posts that restate next steps manually
- consumers_new:
  - human operators using bare `gaps`
  - scripts or tests using explicit raw/json mode

## Functional Review Criteria

1. Does the new operator analysis read from one admitted dossier family rather than a second heuristic summary?
2. Does the default output answer frontier + blocker class + next lawful move directly?
3. Is raw machine output still available for scripts and proofs?
4. Does the default output serve the agentic coder CLI directly rather than assuming a browser-first or raw-shell-forensics workflow?
5. Does bare `gaps` remain subordinate to ABG/odd_sdlc truth instead of becoming an advisory sidecar?

## Evaluator Gate

### 1. Authority Seam Closure

- [x] one authoritative dossier/read-model family still owns gap truth
- [x] the operator analysis is projected from that family rather than reconstructed from logs or event archaeology

### 2. Essential Carrier Consolidation

- [x] no second peer "gap summary" carrier becomes rival authority
- [x] frontier, blocker class, and next-step hints remain subordinate projections over the existing dossier family

### 3. Enforcement After Proof

- [x] source proof lands for bare `gaps`
- [x] source proof lands for explicit raw/json mode
- [x] install proof lands against a real imported workspace before closure

## Regression Governance

This is a regression-governed UX ticket.

The current miss is not that `gaps` lacks data. It is that the public operator
surface does not turn the admitted data into the answer an operator expects.

- [x] the proofs cover the human default surface
- [x] the proofs cover the explicit machine surface
- [x] the proofs ensure both surfaces agree on the same frontier and blocker truth
- [x] comments/posts are not accepted as substitute operator guidance

## Required Break Order

1. Add source proof for the desired bare `gaps` default.
2. Add source proof for explicit raw/json output.
3. Add install proof over an imported workspace.
4. Only then reprice the installed bootstrap/help surfaces and CLI/app projection.

## Initial Direction

1. bind bare `gaps` to workspace scope in the installed Python CLI public operator surface
2. project one operator-facing analysis from the published dossier head
3. keep explicit raw/json output as the script/proof path
4. update installed bootstrap guidance plus install/source tests before claiming repair

## 2026-04-25 RC Deferral Note

At the RC deferral point, B-053 remained active as an operator UX/product reprice. It was explicitly deferred from the B-057 data_mapper RC traversal gate because the RC proof used the then-current executable machine surface:

`odd_sdlc gaps --scope workspace --zoom combined --include-dependent`

The fresh reset proof showed the underlying dossier/gap truth converged after `start`; it did not attempt to close the default bare `gaps` UX contract. That deferral treated this ticket as a follow-up for operator ergonomics, not a blocker for the data_mapper traversal bug closure.

## 2026-04-25 Closure

`odd_sdlc gaps` now defaults to the workspace-scoped operator analysis. The
operator analysis is projected by `gap_dossier.py` from the published dossier
head and carries frontier, blocker class, public-start resolution, raw-carrier
command, and next lawful steps.

Raw machine output remains available through explicit `odd_sdlc gaps --format
json`.

Proofs:

- source: `test_operator_gap_analysis_projects_from_published_dossier_head`
- source: `test_cli_bare_gaps_defaults_to_workspace_operator_analysis`
- source: `test_cli_gaps_raw_json_mode_returns_machine_dossier`
- source: `test_operator_gap_analysis_fails_closed_when_dossier_unavailable`
- source: `test_cli_gaps_help_teaches_bare_operator_path`
- install: clean `/tmp/odd_sdlc_b053_install_20260425T0715Z` from
  `data_mapper.template`; bare installed `gaps` returned
  `analysis_kind=odd_sdlc.operator_gap_analysis`, frontier
  `derive_intent_surface`, blocker `advance_fixed_vector`, and next step
  `odd_sdlc start --scope workspace --target next --until first_traversal`
- install: the same workspace returned raw dossier carrier through
  `odd_sdlc gaps --format json`, with the raw head matching the operator
  frontier and route state
