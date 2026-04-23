---
id: B-045
title: Canonicalize imported requirement authority before constructive dispatch
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: truthful-imported-authority-normalization-before-constructive-dispatch
change_intent: B-010 normalized two-digit and three-digit requirement identifiers into one lawful equivalence class for closure and traceability evaluation, but imported workspaces can still retain two-digit authority files while generated code, design, and test surfaces emit canonical three-digit ids. That leaves literal source authority and literal generated trace tags disagreeing even though the closure register now knows they are equivalent. This ticket closes the source-authority side of the mismatch by requiring normalization to publish one canonical requirement authority surface before constructive generation begins.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: `build_tenants/python/code/odd_sdlc/normalization.py`, imported requirement-family publication, generated requirement-bearing source/test/design surfaces, and read models that still expose mixed literal authority after normalization
priority: medium
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-24
dependencies: B-010 completed (normalized equivalence in closure/traceability law, but did not finish canonical source-authority publication)
intake_source: Session-2 review over test38 and the follow-on Claude analysis on 2026-04-23; concrete symptom described as `REQ-ADJ-01` in imported authority and `REQ-ADJ-001` in generated code/test tags with literal intersection zero
target_truth: after `normalize_workspace` on an imported workspace whose authority still uses two-digit requirement ids, odd_sdlc publishes one canonical live requirement authority surface before any constructive lane dispatches. Generated code, generated tests, generated design, query-domain, and traceability projections all consume that same canonical authority surface, so literal trace tags and literal authority ids agree without requiring downstream reviewers to know about an implicit equivalence rule.
superseded_truth: imported workspaces may keep two-digit authority files while generated surfaces emit canonical three-digit ids. The closure register can normalize equivalence, but literal source authority and literal generated traceability still disagree at review and tooling boundaries.
closure_law: this migration closes only when normalization either (1) rewrites or republishes imported requirement authority into one canonical three-digit live authority surface before constructive dispatch, or (2) publishes one canonical authority alias surface that all generators and read models consume as the single source of truth. Mixed literal authority across imported source files and generated trace tags is not lawful closure.
evaluation_criteria:
  - imported two-digit requirement authority is collapsed once at normalization, not repaired ad hoc by downstream generators
  - generated code/test/design surfaces emit requirement ids from the same canonical authority surface normalization published
  - query and traceability read models no longer need a hidden equivalence rule to explain literal source/generated disagreement
  - no second normalization rule is reintroduced downstream in code generation, prompt assembly, or query projection
proof_surface:
  - imported-workspace normalization proof on a data_mapper-shaped workspace
  - source proof that generated trace tags and published authority surfaces now use the same literal ids
  - negative proof that mixed two-digit authority plus three-digit generated tags cannot survive normalization silently
non_closure_conditions:
  - closure is claimed while imported authority still publishes two-digit ids and generated code/test/design still publish three-digit ids from a different source surface
  - normalization is left unchanged and downstream generators silently normalize literals ad hoc
  - query or traceability projections still rely on hidden equivalence logic to explain literal source/generated mismatch
  - closure is claimed without one authoritative-vs-downstream publication matrix for requirement id truth
---

## Why This Ticket Exists

Completed B-010 fixed the closure-register and traceability-equivalence side of
imported requirement numbering drift.

It did not finish the source-authority publication side.

That leaves a remaining review defect:

- imported authority may still read `REQ-ADJ-01`
- generated code/test/design may still emit `REQ-ADJ-001`
- the system can explain the mismatch internally
- but the literal surfaces still disagree

That is not a truthful one-authority closure shape.

## Scope

In scope:

- imported requirement authority publication during normalization
- canonical requirement-family publication used by constructive lanes
- generated trace-bearing surfaces that currently consume a different literal id
  shape from imported authority

Out of scope:

- reopening B-010 equivalence logic unless a regression is discovered there
- changing downstream domain requirement meaning

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/00-imported-sources.md`
- `specification/requirements/01-upstream-adoption.md`
- `specification/requirements/07-asset-typing-and-binding.md`
- `specification/requirements/08-odd-sdlc-first-slice.md`
- `specification/scenarios/01-upstream-adoption-boundary.md`
- `specification/scenarios/12-iterative-requirement-closure-and-generated-traceability.md`

This ticket reads current design truth from:

- `build_tenants/python/design/REQUIREMENT_CLOSURE_CARRIER_AND_PROJECTION_BOUNDARY.md`
- `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`
- `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`
- `build_tenants/python/design/README.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`

## Migration Declaration

- old_truth_path: imported requirement authority may remain literal two-digit while generators, traceability, and review surfaces emit literal three-digit ids from downstream normalization
- new_truth_path: normalization publishes one canonical imported requirement authority surface before constructive dispatch; generators and projections consume that same surface
- producers_old:
  - `build_tenants/python/code/odd_sdlc/normalization.py`
  - imported `mapper_requirements.md` / carried requirement-like sources
  - downstream literal normalization inside traceability/generation logic
- producers_new:
  - canonical imported requirement publication inside `normalization.py`
  - requirement-family/tracing builders reading that publication instead of re-normalizing privately
- consumers_old:
  - `traceability_index.py`
  - requirement-bearing generated code/test/design surfaces
  - query/read-model surfaces that explain mixed literals after the fact
- consumers_new:
  - `traceability_index.py`
  - generated requirement-bearing surfaces
  - query/read-model surfaces that simply republish canonical ids
- derived_surfaces:
  - `specification/requirements/00-imported-sources.md`
  - generated requirement-bearing design/code/test outputs
  - traceability/query projections

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for canonical requirement ids is listed
- [x] consumer set for canonical requirement ids is listed
- [x] old downstream normalization path is removed or demoted from authority
- [x] mixed two-digit/three-digit literal publication is no longer accepted as closure evidence
- [x] source/install proofs and ticket wording are reconciled before closure

## Functional Review Criteria

1. Did normalization become the single authoritative producer of canonical imported requirement ids?
2. Did the change remove downstream literal repair logic rather than merely hiding it?
3. Do generated code/test/design surfaces and traceability/query projections read the same canonical authority?
4. If imported source files are preserved unchanged, is there still one explicit canonical publication surface rather than a dual-authority compromise?
5. Do failure cases stop before constructive generation, instead of surfacing later as mismatched trace tags?

## Evaluator Gate

### 1. Authority Seam Closure

- [x] normalization publishes one authoritative canonical requirement-id surface
- [x] deleting or corrupting that canonical publication fails closed instead of letting generators silently renormalize elsewhere
- [x] query and traceability surfaces republish the canonical ids rather than reconstructing them

### 2. Essential Carrier Consolidation

- [x] the migration does not introduce a second peer “normalized requirement” carrier family beside the canonical authority surface
- [x] any alias/canonical mapping stays subordinate to the one authoritative publication and is not promoted as a rival authority
- [x] generators and projections reuse existing requirement/traceability carriers rather than inventing wrapper types for convenience

### 3. Typed Enforcement After Proof

- [x] imported requirement parsing/normalization occurs once at ingress/publication
- [x] downstream modules do not preserve literal mismatch through `dict` surgery, `cast(...)`, or repeated id normalization
- [x] any dynamic input remains confined to the normalization ingress, not the semantic center

## Canonical Requirement Authority Role Matrix

| Surface | Role | Closure expectation |
| --- | --- | --- |
| `normalization.py` imported requirement publication | authoritative | publishes one canonical imported requirement authority surface |
| imported source files (`mapper_requirements.md`, carried authority) | upstream input | preserved as source input, not consumed as literal downstream authority once canonicalized |
| `traceability_index.py` | downstream projection | consumes canonical ids only |
| generated code/test/design traces | downstream projection | emit canonical ids only |
| query/read models | downstream projection | explain current canonical authority without equivalence-side repair |

## Concrete Change Inventory

- [x] `build_tenants/python/code/odd_sdlc/normalization.py`
  - [x] identify the carried imported requirement source set
  - [x] publish one canonical imported authority surface before constructive generation
  - [x] reject or rewrite mixed literal authority so downstream lanes cannot consume raw two-digit ids as current truth
- [x] `build_tenants/python/code/odd_sdlc/traceability_index.py`
  - [x] stop using raw imported root files as current authority after normalization
  - [x] consume the canonical authority publication directly
- [x] generated requirement-bearing surfaces
  - [x] code/test traceability proofs consume canonical authority after normalization
  - [x] canonical requirement ids remain trace-equivalent after normalization on the fd-evidence proof surface
- [x] query/read-model surfaces
  - [x] no second imported-requirement authority producer remains beside the canonical publication
- [x] test/data-mapper imported workspace proof
  - [x] add one imported-workspace proof for canonicalized authority
  - [x] add one negative proof for corrupt/mixed authority

## Impacted Interface Review Checklist

- [x] `normalize_workspace(...)` has one authoritative canonicalization step for imported requirement ids
- [x] `specification/requirements/00-imported-sources.md` or successor publication clearly names the canonical authority shape
- [x] `traceability_index.py` no longer behaves like a second normalization authority
- [x] generated requirement-bearing outputs are reviewed for literal-id agreement
- [x] query-domain requirement-family publication is reviewed for literal-id agreement

## Proof Selector Plan

Structural selectors used for closure:

```bash
rg -n 'REQ-[A-Z]+-[0-9]{2}\\b' specification build_tenants/python/code -g'*.md' -g'*.py'
rg -n 'normalize_requirement_id|canonical requirement|imported requirement' build_tenants/python/code/odd_sdlc/{normalization,traceability_index}.py
```

Results:

- first selector: no hits in `specification/` or `build_tenants/python/code`
- second selector: canonicalization remains confined to `normalization.py` and `traceability_index.py`

Closure source selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q \
  -k 'test_normalize_workspace_canonicalizes_imported_requirement_authority'
```

Result:

- `1 passed, 96 deselected`

Closure installation/imported-workspace selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q \
  -k 'test_install_imported_workspace_publishes_canonical_requirement_authority'
```

Result:

- `1 passed, 37 deselected`

Closure negative-proof selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q \
  -k 'test_two_digit_imported_requirement_ids_remain_trace_equivalent_after_normalization'
```

Result:

- `1 passed, 26 deselected`

## Initial Direction

1. audit the current normalization publication path for imported
   `REQUIREMENTS.md` / `mapper_requirements.md` style workspaces
2. choose one canonical live authority surface published before generation
3. bind code/test/design generation to that canonical surface
4. add one imported-workspace proof that literal source authority and literal
   generated trace tags now agree

## Closure Note

Closed on 2026-04-24.

What landed:

- `normalization.py` now republishes imported two-digit requirement authority as
  one canonical live surface at
  `specification/requirements/00-imported-sources.md`
- `traceability_index.py` now treats that canonical publication as authority
  instead of falling back to imported root requirement files once the canonical
  surface exists
- imported-workspace source/install proofs now assert canonical three-digit
  authority ids directly
- fd-evidence proof now confirms requirement closure and traceability continue
  to agree after normalization under canonical tenant-rooted file paths

Package typing sanity at closure:

```bash
python -m mypy --config-file mypy.ini -p odd_sdlc
```

Result:

- `Success: no issues found in 48 source files`
