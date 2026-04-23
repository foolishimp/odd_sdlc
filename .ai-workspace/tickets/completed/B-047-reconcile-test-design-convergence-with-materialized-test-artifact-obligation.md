---
id: B-047
title: Reconcile test-design convergence with materialized test-artifact obligation
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: truthful-upstream-test-lane-materialization-before-archive-closure
change_intent: B-037 already owns the `test_module_surface -> test_run_archive_surface` misalignment, but test38 review suggests there may be an upstream gap where `derive_test_design_surface` and possibly `derive_test_module_surface` converge as markdown-only planning surfaces while zero concrete Scala test artifacts exist. This ticket owns that upstream boundary so it is either folded explicitly into B-037 or closed as its own materialization obligation.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: `derive_test_design_surface`, `derive_test_module_surface`, and the handoff into the existing B-037 test-lane boundary when upstream surfaces can converge without non-zero realized test artifact materialization
priority: medium
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-24
dependencies: B-037 active
intake_source: test38 session review and Claude gap analysis on 2026-04-23 noting markdown-only test-design/test-module convergence with zero `.scala` test files on disk
target_truth: upstream test-lane surfaces are explicit about whether they are planned-only or materially realized. Neither `derive_test_design_surface` nor `derive_test_module_surface` may silently converge as if concrete test-artifact realization exists when the workspace still contains zero realized Scala test files for the carried requirement ids.
superseded_truth: markdown-only planning surfaces can appear converged while downstream reviewers still find zero concrete Scala test artifacts, leaving it ambiguous whether B-037 already owns the defect or whether the upstream surface is also over-converging.
closure_law: this ticket closes only when the upstream materialization responsibility is explicitly owned. Lawful closure shapes are: (1) B-037 is widened and this ticket retires by repricing into that owner, or (2) the upstream surface gains its own non-zero materialization obligation and mixed markdown-only convergence can no longer silently pass.
evaluation_criteria:
  - the owner of test-artifact materialization is explicit between test design, test module, and run archive
  - markdown-only convergence cannot silently satisfy a surface that semantically requires realized test artifacts
  - upstream proofs and downstream archive proofs agree on the same materialization law
proof_surface:
  - source proof over test-design and test-module convergence/materialization behavior
  - repricing proof if scope is folded into B-037 instead of closed here
  - negative proof that zero realized test artifacts cannot silently pass the chosen owner boundary
non_closure_conditions:
  - closure is claimed while test-design or test-module surfaces can still converge with zero realized Scala test artifacts and no explicit planned-only state
  - B-037 and this ticket both continue claiming the same seam without a repriced owner boundary
  - markdown-only planning output is still treated as realized test-materialization truth
  - closure is claimed without an explicit owner matrix for test design, test module, and test run archive
---

## Why This Ticket Exists

test38 clearly showed the downstream symptom:

- planned test markdown existed
- concrete Scala test files did not

B-037 already tracks the strongest known downstream boundary.

What is still not explicit is whether the upstream surfaces are also
over-converging before that handoff.

This ticket exists so that question has an owner.

## Scope

In scope:

- deciding whether `derive_test_design_surface` carries a realized-artifact
  obligation
- deciding whether `derive_test_module_surface` is the first lawful owner of
  that obligation
- repricing the ticket boundary so B-037 and this ticket do not both claim the
  same seam

Out of scope:

- broad test-lane retry or archive-governance redesign unrelated to
  materialization ownership

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/04-verification.md`
- `specification/requirements/08-odd-sdlc-first-slice.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/scenarios/06-first-odd-sdlc-asset-function-call.md`
- `specification/scenarios/07-canonical-sandbox-repeatability.md`
- `specification/scenarios/12-iterative-requirement-closure-and-generated-traceability.md`

This ticket reads current design truth from:

- `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`
- `build_tenants/python/design/REQUIREMENT_CLOSURE_CARRIER_AND_PROJECTION_BOUNDARY.md`
- `build_tenants/python/design/fp/REALIZED_TEST_SOURCE_OBLIGATION.md`
- `build_tenants/python/design/README.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`

## Migration Declaration

- old_truth_path: `derive_test_design_surface` and/or `derive_test_module_surface` may converge as markdown planning output while zero realized Scala test artifacts exist, leaving materialization ownership ambiguous against `test_run_archive_surface`
- new_truth_path: one explicit owner boundary governs non-zero realized test-artifact materialization, and upstream surfaces either stay planned-only explicitly or fail closed when they claim realized test truth
- producers_old:
  - upstream test design/module generation surfaces
  - downstream archive/traceability surfaces
- producers_new:
  - explicit owner surface for realized test artifacts
  - repriced upstream planned-only publication if that is the lawful line
- consumers_old:
  - traceability and test-lane reviewers reading markdown as if it were realized evidence
  - B-037 archive-side proof surfaces
- consumers_new:
  - test design/module/archive proofs all consuming the same materialization law
- derived_surfaces:
  - planned test design outputs
  - planned/generated test module outputs
  - realized Scala test artifacts
  - run archive surfaces

## Migration Checklist

- [ ] owner boundary for realized test-artifact materialization is explicit
- [ ] upstream planned-only vs realized states are explicit
- [ ] B-037 relationship is repriced clearly before closure
- [ ] mixed markdown-only convergence is no longer accepted as closure evidence
- [ ] proofs and ticket wording are reconciled before closure

## Functional Review Criteria

1. Which surface first semantically claims realized test artifacts?
2. If test design is planned-only, is that state explicit and impossible to confuse with materialized truth?
3. If test module owns materialization, can zero realized artifacts fail closed there?
4. Does B-037 remain the downstream archive boundary without duplicating this ticket’s owner claim?
5. Do source/test/archive proofs all point to the same materialization rule?

## Evaluator Gate

### 1. Authority Seam Closure

- [ ] one explicit owner surface governs realized test-artifact materialization
- [ ] downstream archive or traceability surfaces do not silently reconstruct realized test truth from markdown planning output
- [ ] deleting the owner check causes fail-closed behavior instead of ambient convergence

### 2. Essential Carrier Consolidation

- [ ] the fix reuses the existing test design / test module / test run archive carrier family rather than introducing a rival “realized test status” family
- [ ] planned-only state stays subordinate to the existing lane, not promoted as a parallel authority
- [ ] no new wrapper surface is introduced solely to mask missing realized artifacts

### 3. Typed Enforcement After Proof

- [ ] artifact-count/materialization admission occurs once at the chosen owner boundary
- [ ] downstream surfaces do not repeatedly infer realization from markdown or open file globs
- [ ] any dynamic filesystem scan is collapsed immediately into local admitted truth before semantic transforms

## Test Artifact Ownership Matrix

| Surface | Role | Closure expectation |
| --- | --- | --- |
| `derive_test_design_surface` | to be decided explicitly | either planned-only publication or first owner of realized obligation |
| `derive_test_module_surface` | to be decided explicitly | either first realized owner or downstream planned carrier |
| `derive_test_run_archive_surface` / B-037 | downstream/archive owner | must not silently inherit realized truth if the owner boundary has not been satisfied |
| realized `.scala` files on disk | evidence surface | non-zero evidence required wherever realized ownership is claimed |

## Concrete Change Inventory

- [ ] replay the test38-style markdown-only path over test design and test module
- [ ] decide the first lawful owner of realized test-artifact materialization
- [ ] if the owner is already B-037
  - [ ] widen/reprice B-037 explicitly
  - [ ] retire or narrow this ticket cleanly
- [ ] if the owner is upstream
  - [ ] add the non-zero artifact obligation there
  - [ ] keep B-037 downstream-only
- [ ] update design/requirements wording if it currently implies realized closure too early
- [ ] add one negative proof that zero `.scala` artifacts cannot silently pass the chosen owner boundary

## Impacted Interface Review Checklist

- [ ] `derive_test_design_surface` publication is reviewed for planned-only vs realized semantics
- [ ] `derive_test_module_surface` publication is reviewed for planned-only vs realized semantics
- [ ] test traceability/reporting is reviewed for silent materialization assumptions
- [ ] B-037 boundary text is repriced if ownership moves

## Proof Selector Plan

Structural selectors:

```bash
rg -n 'derive_test_design_surface|derive_test_module_surface|derive_test_run_archive_surface' build_tenants/python/code/odd_sdlc specification build_tenants/python/design
rg -n '\\.scala' build_tenants/python/test_env/tests build_tenants/python/code/odd_sdlc
```

Planned source selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q \
  -k 'test_test_design_surface_does_not_claim_realized_tests_without_materialized_scala_files or test_test_module_surface_fails_closed_when_realized_test_artifacts_are_absent or test_test_run_archive_surface_respects_materialization_owner_boundary'
```

Planned repricing selector if folded into B-037:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q \
  -k 'test_b037_owner_boundary_captures_upstream_markdown_only_test_convergence'
```

## Initial Direction

1. replay the test38-style markdown-only convergence path at test design and
   test module
2. identify the first surface that semantically claims realized test artifacts
3. either widen B-037 explicitly or close the upstream surface here
4. add one negative proof that zero `.scala` test artifacts cannot silently pass
   the chosen owner boundary

## Closure Note

Closed by repricing into `B-037`.

Owner review on the live line shows:

- `derive_test_design_surface` is already a planned-only carrier
  - graph law: `derivation_rule="validation_design_projection"`
  - evidence policy: `planned_test_design_coverage`
- `derive_test_module_surface` is already a planned-only carrier
  - graph law: `derivation_rule="validation_module_projection"`
  - evidence policy: `planned_test_module_coverage`
  - constructor text explicitly states that the surface does not itself count as
    realized test source
- `derive_test_run_archive_surface` is the first current edge that flips to
  `realized_validation_projection`

So the upstream surfaces are not silently claiming realized Scala test
artifacts. The live defect is downstream: the archive/release/execution boundary
is the place where realized-source and execution-evidence law is currently
misaligned.

That means this ticket does not own a separate upstream implementation defect.
Its useful outcome is the owner decision:

- upstream test design/test module surfaces remain planned-only
- downstream realized-source / execution-evidence misalignment remains owned by
  `B-037`

Proof used for closure:

- source proof:
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q -k 'test_b047_upstream_test_lane_surfaces_are_planned_only_before_archive_realization'`
