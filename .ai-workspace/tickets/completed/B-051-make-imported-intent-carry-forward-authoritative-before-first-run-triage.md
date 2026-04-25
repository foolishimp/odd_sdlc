---
id: B-051
title: Make imported intent carry-forward authoritative before first-run triage
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: singular-bootstrap-carry-forward-and-constitutional-proposal-replay
change_intent: Fresh installed imported workspaces should not stop on a synthetic `intent_reprice` gate merely to restate imported project identity that bootstrap already admitted. The current line allows bootstrap/imported-authority carry-forward, triage proposal construction, gap-dossier head projection, and public `start(next)` to disagree about the same constitutional state. This ticket closes that authority seam so first-run governance either carries forward imported intent once or opens a real constitutional gate, but never both.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: `build_tenants/python/code/odd_sdlc/{normalization,triage,gap_dossier,app,homeostatic_loop}.py`, project bootstrap publication, first-run imported-workspace triage, and public `start(next)` constitutional-gate projection
priority: high
triaged_at: 2026-04-24
created_at: 2026-04-24
updated_at: 2026-04-24
dependencies:
  - B-046 completed
  - B-050 completed
intake_source: `data_mapper.test39` fresh installed workspace halts at `derive_intent_surface` with `intent_reprice` even though bootstrap already carries imported project identity from `specification/INTENT.md`; follow-on review also exposed mixed truth where proposal application exists in events and target surface while public start still reports `pending_fh`
target_truth: for a fresh imported workspace with a valid imported `specification/INTENT.md`, bootstrap/normalization publishes one authoritative carry-forward basis for constitutional intent truth before first constructive governance traversal. Triage, gap dossier, and public `start(next)` consume that same basis. If there is no real constitutional delta, first-run `derive_intent_surface` carries forward and does not emit `intent_reprice`. If there is a real delta and a constitutional proposal is emitted, event replay and public projections must collapse to the applied or rejected state after resolution and must not continue projecting `pending_fh`.
superseded_truth: bootstrap may successfully identify project identity and imported ontology from `specification/INTENT.md`, while triage still emits `process_outcome_kind=propose_constitutional_reprice`, the current-edge artifact records `pending_fh`, and public `start(next)` blocks on `constitutional_pending_fh` for the same proposal identity. This leaves imported authority carry-forward and constitutional proposal replay as rival truth surfaces.
closure_law: this ticket closes only when imported intent carry-forward and constitutional proposal resolution become a single authoritative seam across normalization/bootstrap, triage, gap dossier, and public start. A fresh imported workspace with valid imported intent must not open a human gate solely to restate imported identity. A genuinely malformed or materially insufficient imported intent surface may still open a constitutional gate, but after approval or rejection the public lane must project the resolved state rather than a stale `pending_fh`.
evaluation_criteria:
  - first-run imported workspace traversal distinguishes lawful carry-forward from real constitutional deficit without requiring human approval to restate imported identity
  - bootstrap/imported-authority publication is consumed by triage as admitted truth, not treated as commentary alongside a second proposal-construction path
  - gap-dossier head and public `start(next)` agree with event-replayed constitutional proposal state after approval, rejection, or suppression
  - no controller-local special case or approval cache is added as a rival semantic center
  - malformed or missing imported intent still fails closed through the constitutional gate
proof_surface:
  - source proof on a fresh imported workspace showing first-run `derive_intent_surface` does not stop on `pending_fh` when imported intent is already bootstrap-admitted
  - source proof that `proposal_applied` / `constitutional_proposal_approved_with_edits` collapses pending-gate projection and public `start(next)` no longer returns `fh_gate`
  - install/sandbox proof on a `data_mapper`-shaped imported workspace
  - negative proof that malformed or missing imported `INTENT.md` still opens the constitutional gate
non_closure_conditions:
  - bootstrap or `project_bootstrap.md` carries imported intent authority while first-run triage still opens `intent_reprice` for the same unchanged surface
  - gap dossier shows `approve_with_edits` or `constitutional_reprice_approved` while public `start(next)` still returns `pending_fh`
  - closure is claimed by adding a one-off controller override or replay cache instead of removing the mixed authority seam
  - malformed imported intent no longer gates because carry-forward logic became unconditional
---

## Why This Ticket Exists

`data_mapper.test39` is a clean imported-workspace reproducer for a real
authority-seam bug.

Bootstrap already publishes imported project identity from
`specification/INTENT.md`, including ontology anchors and read order, in:

- `.ai-workspace/context/project_bootstrap.md`

But first-run governance can still stop at `derive_intent_surface` and emit:

- `proposal_kind: intent_reprice`
- `state: pending_fh`
- `route state: await_fh_resolution`

That is not a missing-approval workflow. It is a mixed truth surface:

- bootstrap says imported intent is admitted project identity
- triage says intent still needs constitutional reprice
- after approval, projections can still drift across current-edge artifact,
  gap dossier, and public start

Under `DESIGN_MODULE_METHOD.md`, this fails Authority Seam Closure.

## Scope

In scope:

- imported-intent carry-forward truth published during normalization/bootstrap
- triage proposal construction and replay for `intent_reprice`
- gap-dossier pending constitutional gate projection
- public `start(next)` consumption of the same constitutional truth
- first-run imported-workspace proof and applied-proposal replay proof

Out of scope:

- ABG transport, salvage, or runtime supervision
- rewriting imported domain intent content beyond the already-admitted proposal path
- bootstrap-generated prose quality beyond what is needed for singular authority

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/00-imported-sources.md`
- `specification/requirements/01-upstream-adoption.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/06-bootstrap-assets-and-recursive-edges.md`
- `specification/requirements/08-odd-sdlc-first-slice.md`
- `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`

This ticket reads current design truth from:

- `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`
- `build_tenants/python/design/START_TARGET_CATALOG_AND_ASSET_OWNERSHIP_INDEX.md`
- `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`
- `build_tenants/python/design/README.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`

## Migration Declaration

- old_truth_path: bootstrap/imported-authority carry-forward, triage constitutional proposal state, gap-dossier head, and public `start(next)` can disagree on first-run constitutional status for imported intent
- new_truth_path: normalization/bootstrap publishes one admitted imported-intent carry-forward basis; triage consumes that basis and proposal replay deterministically; gap dossier and public start project the same resolved constitutional state
- producers_old:
  - `build_tenants/python/code/odd_sdlc/normalization.py`
  - `.ai-workspace/context/project_bootstrap.md`
  - `build_tenants/python/code/odd_sdlc/triage.py`
  - `build_tenants/python/code/odd_sdlc/homeostatic_loop.py`
- producers_new:
  - one explicit imported-intent carry-forward basis published during normalization/bootstrap
  - `triage.py` replaying proposal state from event truth against that same basis
  - `homeostatic_loop.py` proposal-application events that collapse pending state deterministically
- consumers_old:
  - `gap_dossier.py`
  - `app.py` public `start(next)` admission
  - current-edge triage artifact readers
- consumers_new:
  - `gap_dossier.py`
  - `app.py` public `start(next)` admission
  - source/install proof helpers over imported workspaces
- derived_surfaces:
  - `.ai-workspace/context/project_bootstrap.md`
  - `.ai-workspace/runtime/triage/*.json`
  - `.ai-workspace/runtime/odd_sdlc-gap-dossiers.{json,md}`
  - public `start(next)` payloads
  - `.ai-workspace/events/events.jsonl`

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] authoritative producer and downstream consumers are listed
- [x] the repeatable `test39` first-run failure is pinned by source regression before repair
- [x] the repeatable `test39` first-run failure is pinned by install `data_mapper` regression before repair
- [x] first-run imported intent carry-forward is singular
- [x] applied constitutional proposal replay removes stale `pending_fh` projection
- [x] mixed bootstrap/triage/gap/start behavior is not accepted as closure evidence
- [x] source and install proofs are reconciled before closure

## Functional Review Criteria

1. Did the slice eliminate the rival authority between bootstrap carry-forward and triage proposal construction?
2. Does first-run imported-workspace traversal now distinguish “already admitted imported intent” from “real constitutional deficit” without F_H ceremony?
3. After proposal application, do gap dossier and public start consume replayed resolution truth rather than stale current-edge artifacts?
4. Is the fix one authoritative carry-forward/replay seam rather than a controller-local override?
5. Do malformed imported-intent cases still fail closed through the constitutional gate?

## Evaluator Gate

### 1. Authority Seam Closure

- [x] bootstrap/normalization publishes one authoritative imported-intent carry-forward basis
- [x] triage consumes that basis and event replay instead of reconstructing proposal state independently
- [x] gap dossier and public start project the same resolved constitutional state

### 2. Essential Carrier Consolidation

- [x] the fix does not introduce a second approval cache, replay file, or bootstrap-only peer carrier
- [x] constitutional proposal state remains subordinate to one admitted carry-forward/proposal-resolution family
- [x] existing public-start and gap-dossier carriers are reused rather than wrapped in convenience mirrors

### 3. Typed Enforcement After Proof

- [x] imported intent admission and proposal replay collapse once at ingress/replay boundaries
- [x] no open dict surgery or controller-local `cast(...)` patch becomes the semantic center
- [x] source/install proofs lock the resolved seam after the authority path is made singular

## Constitutional Carry-Forward Role Matrix

| Surface | Role | Closure expectation |
| --- | --- | --- |
| `normalization.py` + bootstrap publication | authoritative | admit imported intent carry-forward once for fresh imported workspaces |
| `triage.py` | downstream authority consumer | consume carry-forward basis and event replay, not restate imported identity as pending proposal |
| `homeostatic_loop.py` events | authoritative replay input | approval/application events collapse constitutional proposal state deterministically |
| `gap_dossier.py` | downstream projection | project current resolved constitutional status only |
| `app.py` public `start(next)` | downstream projection | stop only on real current gate, not stale pending truth |

## Concrete Change Inventory

- [x] `build_tenants/python/code/odd_sdlc/normalization.py`
  - [x] publish or expose one admitted imported-intent carry-forward basis for fresh imported workspaces
- [x] `.ai-workspace/context/project_bootstrap.md` publication path
  - [x] confirm bootstrap identity publication is consumable as authority, not commentary only
- [x] `build_tenants/python/code/odd_sdlc/triage.py`
  - [x] suppress synthetic `intent_reprice` when imported intent is already admitted with no real constitutional delta
  - [x] replay `proposal_applied` / approved states into current triage artifacts without stale `pending_fh`
- [x] `build_tenants/python/code/odd_sdlc/gap_dossier.py`
  - [x] project pending constitutional gate only from current resolved proposal state
- [x] `build_tenants/python/code/odd_sdlc/app.py`
  - [x] ensure public `start(next)` consumes the republished current head truth, not stale pending metadata
- [x] proof surfaces
  - [x] source first-run imported-workspace proof
  - [x] source applied-proposal replay proof
  - [x] install imported-workspace proof
  - [x] malformed-intent negative proof

## Impacted Interface Review Checklist

- [x] bootstrap publication clearly states whether imported `INTENT.md` is admitted authority or provenance-only commentary
- [x] current-edge triage artifact reflects applied proposal state after replay
- [x] gap-dossier head no longer diverges from current-edge/public-start truth
- [x] `start(next)` no longer returns `fh_gate` when the same proposal identity is already applied
- [x] first-run imported-workspace bootstrap no longer requires human approval to restate unchanged imported intent

## Proof Selector Plan

Structural selectors to run during implementation:

```bash
rg -n 'intent_reprice|pending_fh|approve_with_edits|constitutional_reprice_approved|await_fh_resolution' \
  build_tenants/python/code/odd_sdlc/{normalization,triage,gap_dossier,app,homeostatic_loop}.py

rg -n 'proposal_applied|constitutional_proposal_approved_with_edits|constitutional_proposal_recorded' \
  build_tenants/python/code/odd_sdlc/{triage,homeostatic_loop,runtime_event_contract}.py
```

Source proof selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q \
  -k 'test_b051_valid_imported_intent_carries_forward_without_first_run_fh_gate or test_b051_malformed_imported_intent_still_requires_constitutional_gate or test_b051_applied_constitutional_proposal_clears_public_pending_gate'
```

Result:

- `3 passed, 109 deselected`

Install proof selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q \
  -k 'test_install_imported_workspace_does_not_pause_on_first_run_intent_reprice or test_install_explicit_asset_start_routes_without_synthetic_constitutional_gate or test_install_public_next_distinguishes_valid_imported_intent_from_malformed_imported_intent or test_install_malformed_imported_intent_approval_replay_clears_public_pending_gate'
```

Result:

- `4 passed, 36 deselected`

Package typing proof:

```bash
python -m mypy --config-file mypy.ini -p odd_sdlc
```

Result:

- `Success: no issues found in 52 source files`

Structural negative proof selector:

```bash
rg -n 'intent_reprice|pending_fh|approve_with_edits|constitutional_reprice_approved|await_fh_resolution' \
  build_tenants/python/code/odd_sdlc/{normalization,triage,gap_dossier,app,homeostatic_loop}.py
```

## Closure Note

The seam is closed on the current harnessed line.

- `imported_intent_carry_forward.py` is now the one admitted carry-forward basis
  for imported intent authority.
- `analysis.py` publishes that carry-forward basis in workspace state.
- `normalization.py` and bootstrap publication consume the same basis rather than
  re-deriving identity independently.
- `triage.py` now routes first-run valid imported intent through
  `advance_fixed_vector` / `resume_from_intent` instead of constructing a
  synthetic constitutional proposal, while still replaying real proposal
  approval state deterministically.
- source and install regressions now prove the valid, malformed, and
  replay-cleared cases against the real `data_mapper.template` boundary.

No live tests were run for this closure. Live-wave proof stays deferred until
the next full test pass.

## Regression Governance

This ticket is governed by `DESIGN_MODULE_METHOD.md` before repair work begins.

The regression lane must itself satisfy the three evaluators.

### 1. Authority Seam Closure

- [x] the regression tests name one authoritative constitutional truth path:
  bootstrap carry-forward -> triage -> gap dossier -> public start
- [x] the regression tests fail closed on disagreement instead of allowing one
  surface to silently outrank the others by convenience

### 2. Essential Carrier Consolidation

- [x] the regression tests prove the existing public-start/gap-dossier/current-edge
  carriers rather than introducing fixture-only peer mirrors
- [x] replay truth is proved through existing event/gap/start carriers, not a
  bespoke approval-cache fixture

### 3. Enforcement After Proof

- [x] source regression lands first and reproduces the bug on local carriers
- [x] install `data_mapper` regression lands second and reproduces the bug on
  the real imported-workspace boundary
- [x] only after those proofs exist may the repair work begin

## Required Break Order

1. Add source regression proving that valid imported intent does not lawfully
   require a synthetic first-run `intent_reprice` gate.
2. Add source regression proving that applied constitutional proposal replay
   clears stale public `pending_fh`.
3. Add source negative regression proving malformed or missing imported intent
   still opens the constitutional gate.
4. Add install `data_mapper` regression replacing the current stale expectation
   that first-run `start(next)` should stop at `pending_fh`.
5. Only then repair normalization/bootstrap/triage/gap/start authority.

## Initial Direction

1. identify the single lawful carry-forward basis for imported intent on fresh installed workspaces
2. make triage consume that basis before constructing `intent_reprice`
3. make proposal replay collapse pending-gate truth deterministically after `proposal_applied`
4. prove first-run carry-forward, applied-proposal replay, and malformed-intent fail-closed behavior
