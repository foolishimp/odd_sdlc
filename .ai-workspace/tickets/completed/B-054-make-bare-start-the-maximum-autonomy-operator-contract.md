---
id: B-054
title: Make bare start the maximum-autonomy operator contract
type: feature
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
governing_library: none
library_usage: not_applicable
library_rationale: bootstrap/operator-guidance wording over existing odd_sdlc public-start carriers; no external or shared library is introduced
status: completed
goal: bare-start-runs-the-workspace-as-far-as-lawfully-possible
change_intent: bare `odd_sdlc start` currently leaves too much control-plane grammar exposed to the operator. The primary operator UX is the agentic coder CLI (`claude`, `codex`, `gemini`) running inside the workspace, so the public contract should treat bare `start` as the maximum-autonomy workspace progression profile, while explicit flags remain advanced overrides rather than mandatory folklore.
change_class: product_reprice
re_entry_point: product
affected_boundary: installed bootstrap surfaces (`AGENTS.md`/`CLAUDE.md` generation), local source bootstraps, tenant README, and bootstrap text proofs
priority: critical
triaged_at: 2026-04-24
created_at: 2026-04-24
updated_at: 2026-04-24
dependencies:
  - "B-053 active; B-054 may land independently, but gaps shorthand remains governed by B-053 until repriced"
intake_source: operator UX review 2026-04-24 after `test39`; current public start contract is still too close to substrate request grammar for normal agentic coder CLI use
target_truth: when the operator says `start`, bootstrap guidance means "run this workspace as far as it can lawfully go" and maps that operator intent to the existing installed Python CLI spelling for the maximum-autonomy profile. For the current cut that spelling is workspace scope, target `next`, stop condition `converged`, `--fh-mode human-proxy`, and `--root-mode supervised`. This ticket does not change CLI admission semantics.
superseded_truth: operators must remember `--scope workspace --target next --until converged` plus control-mode flags such as `--fh-mode human-proxy` and `--root-mode supervised` to get the behavior they mean by ordinary "start the project."
closure_law: this ticket closes when bootstrap/help surfaces teach operator `start` as the ordinary path and map it to the existing maximum-autonomy CLI spelling without introducing parser changes or a second tenant-owned runtime loop over ABG continuation truth.
evaluation_criteria:
  - bootstrap surfaces map operator `start` to the explicit maximum-autonomy CLI spelling
  - existing explicit request grammar remains unchanged
  - odd_sdlc remains a governance layer over ABG rather than a replacement runtime loop
  - generated and local bootstrap surfaces agree on the same command
proof_surface:
  - source text proof that local bootstraps teach the maximum-autonomy operator command
  - install text proof that generated bootstrap surfaces teach the same command
non_closure_conditions:
  - closure is claimed while generated bootstraps still teach the old partial `--scope --target --until` spelling as the ordinary path
  - bootstrap guidance teaches a CLI form that the current parser cannot execute
  - odd_sdlc introduces a second traversal loop instead of binding ABG continuation law
---

## Why This Ticket Exists

The operator expectation is simple:

- `gaps` explains the current problem
- `start` tries to finish the project

The current public `odd_sdlc` story is structurally correct but still too
adapter-shaped. The installed Python CLI requires the operator to know the
substrate request grammar and the right control-mode folklore just to say
"go."

The primary operator here is the agentic coder CLI running the installed
Python CLI in the workspace. So bare `start` should optimize for that
ordinary path first, not for raw substrate spelunking or a future browser
shell.

That is the wrong level of abstraction for the domain package.

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/requirements/11-homeostatic-gap-triage-and-ticket-work-item-routing.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`

This ticket reads current design truth from:

- `build_tenants/python/design/README.md`
- `build_tenants/python/design/START_TARGET_CATALOG_AND_ASSET_OWNERSHIP_INDEX.md`
- `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`
- `build_tenants/python/design/GAP_ANALYSIS_DOSSIER.md`
- `build_tenants/python/design/TICKET_WORK_ITEM_REENTRY_ROUTING.md`
- `build_tenants/python/design/adrs/ADR-002-abg-continuation-authority-and-cooperative-operational-dispatch.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`

## Migration Declaration

- old_truth_path: bare `start` is not the normal operator path; the operator must spell the request grammar and maximum-autonomy control modes explicitly
- new_truth_path: bootstrap guidance maps operator `start` to the existing explicit maximum-autonomy public request spelling
- producers_old:
  - installed bootstrap text carrying the partial old invocation
  - source bootloader/README text carrying the partial old invocation
- producers_new:
  - installed bootstrap text carrying the explicit maximum-autonomy invocation
  - source bootloader/README text carrying the explicit maximum-autonomy invocation
- operator_profile_spelling:
  - scope: `workspace`
  - target: `next`
  - until: `converged`
  - fh_mode: `human-proxy`
  - root_mode: `supervised`
- consumers_old:
  - human operators manually assembling the full invocation
- consumers_new:
  - human operators using bare `start`
  - advanced users using explicit overrides

## Interface Inventory

- bootstrap producers: `odd_sdlc.release.install.install` and `odd_sdlc.normalization.normalize_workspace`
- local bootstraps/docs: `AGENTS.md`, `CLAUDE.md`, and `build_tenants/python/README.md`
- current CLI consumer: copied installed Python package invoked as `python -m odd_sdlc start --scope workspace --target next --until converged --fh-mode human-proxy --root-mode supervised`
- proofs: generated bootstrap text assertions and source bootloader/readme review

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] declared operator profile spelling is explicit
- [x] installed bootstrap surfaces teach bare `start`
- [x] source bootstrap and README surfaces teach the same profile
- [x] install text proof checks generated bootstrap surfaces
- [x] no tenant-owned replacement continuation loop is introduced

## Impacted Interface Review Checklist

- [x] installed workspace bootstrap text maps operator `start` to the executable maximum-autonomy command
- [x] source README and local bootloader text map operator `start` to the same executable command
- [x] CLI/parser semantics are left unchanged
- [x] B-053 remains the owner for future `gaps` shorthand repricing

## Break-To-Closure Map

- break: bootstrap text teaches an incomplete old start spelling
  closure: bootstrap text teaches `workspace`, `next`, `converged`, `human-proxy`, and `supervised`
- break: maximum-autonomy behavior lives in operator folklore
  closure: bootstrap names the operator intent and gives the exact executable command
- break: generated and source bootstrap surfaces can diverge
  closure: install and normalization producers plus source bootstraps use the same command spelling

## Functional Review Criteria

1. Is bare `start` now the ordinary operator path?
2. Does bootstrap guidance bind ABG continuation truth through the existing CLI rather than implying a new loop?
3. Does the operator path include the full maximum-autonomy control profile?
4. Does the profile serve the agentic coder CLI directly rather than assuming the operator will remember substrate flags?
5. Do explicit control flags remain the executable spelling for this cut?

## Evaluator Gate

### 1. Authority Seam Closure

  - [x] one declared maximum-autonomy profile owns bare `start`
  - [x] bootstrap maps that profile to the current executable CLI spelling

### 2. Essential Carrier Consolidation

  - [x] no second tenant-owned runtime loop or peer continuation model is introduced
  - [x] explicit flags remain the current implementation carrier for the profile

### 3. Enforcement After Proof

  - [x] source bootstrap proof lands for the profile wording
  - [x] install bootstrap proof lands for generated workspace wording

## Regression Governance

This ticket is not closed by local commentary alone.

The generated and source bootstrap surfaces must both teach the same executable profile.

- [x] generated bootstrap text contains the full profile
- [x] local bootloader/readme text contains the full profile
- [x] no post-hoc documentation folklore is accepted as closure evidence

## Required Break Order

1. Reprice installed bootstrap producers to map operator `start` to the full maximum-autonomy command.
2. Reprice local source bootstraps and tenant README to the same command.
3. Preserve current CLI/parser semantics.
4. Add or update text proofs for generated bootstrap surfaces.
5. Close only after the bootstrap still delegates traversal truth to ABG through the existing CLI.

## Initial Direction

1. teach operator `start` as one declared maximum-autonomy profile in bootstrap text
2. keep explicit request/control flags as the executable CLI spelling for this cut
3. update installed bootstrap guidance together with source bootloader/readme surfaces
4. do not add a second tenant-owned continuation loop

## Closure Note

Closed by source and installed bootstrap wording that maps operator `start` to:

`python -m odd_sdlc start --scope workspace --target next --until converged --fh-mode human-proxy --root-mode supervised --workspace .`

Proof surfaces:

- source bootstraps: `AGENTS.md`, `CLAUDE.md`, and `build_tenants/python/README.md`
- install producers: `build_tenants/python/code/odd_sdlc/normalization.py` and `build_tenants/python/code/odd_sdlc/release/install.py`
- install text proof in `test_odd_sdlc_installation.py`
- fresh data_mapper reset proof at `/tmp/odd_sdlc_rc_data_mapper_20260425T041353Z`, where that explicit maximum-autonomy spelling converged
