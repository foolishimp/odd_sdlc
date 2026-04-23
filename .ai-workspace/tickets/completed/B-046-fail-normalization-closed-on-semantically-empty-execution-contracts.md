---
id: B-046
title: Fail normalization closed on semantically empty execution contracts
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: truthful-operational-capability-declaration-at-normalization
change_intent: stop `normalize_workspace` and `install` from synthesizing semantically empty execution-contract fields such as `build_execution_contract: ""` and letting the defect surface only later as `capability_blocked` on operational edges. Empty string is not lawful declared capability truth. This ticket closes that normalization seam so operational capability state is explicit and fail-closed at intake time.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: `build_tenants/python/code/odd_sdlc/normalization.py`, installed workspace bootstrap/defaulting of project constraints, project profile resolution, and the operational-capability publication path that currently tolerates semantically empty execution-contract strings
priority: high
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-24
dependencies: B-025 completed (one operational-capability truth across normalization/gaps/edge diagnostics)
intake_source: test38 session finding that manual in-session edits to `project_constraints.yml` were required before build/test/deploy/runtime-return edges could proceed; follow-on Claude ticket-gap analysis on 2026-04-23
target_truth: normalization never publishes semantically empty execution-contract declarations. For each executional/operational capability lane, the workspace either carries an explicitly declared contract surface or fails closed at normalization with a named diagnostic. Empty string is not treated as lawful declared capability state.
superseded_truth: normalization can write or preserve empty-string execution-contract fields and let the defect emerge later as `capability_blocked` only after multiple operational edges are already stalled.
closure_law: this migration closes only when semantically empty execution-contract declarations are rejected or rewritten into one explicit fail-closed diagnostic at normalization time. No installed workspace may proceed with `\"\"` as if it were a meaningful capability contract.
evaluation_criteria:
  - normalization rejects semantically empty execution-contract declarations before operational traversal is expected
  - project profile and operational-capability projections do not treat empty string as declared capability truth
  - installed proofs no longer require manual in-session edits to `project_constraints.yml` just to expose the real defect
  - the closure shape remains compatible with lawful `undeclared` capability publication where that state is explicit rather than hidden inside `\"\"`
proof_surface:
  - source normalization proof for semantically empty execution-contract fields
  - installation proof that the named diagnostic appears before operational-edge traversal is attempted
  - negative proof that empty-string contracts can no longer pass as lawful declarations
non_closure_conditions:
  - closure is claimed while normalization or install still writes `\"\"` as execution-contract truth
  - empty-string capability publication is merely translated later into `capability_blocked`
  - a second downstream capability classifier is introduced instead of fixing normalization ingress
  - closure is claimed without an explicit authoritative-vs-downstream capability publication matrix
---

## Why This Ticket Exists

test38 exposed a hygiene defect at the normalization boundary:

- the workspace normalized
- execution-contract fields remained empty strings
- operational edges later stalled as `capability_blocked`
- the operator had to repair `project_constraints.yml` mid-session

That is too late.

The defect should be surfaced where capability truth is first published.

## Scope

In scope:

- normalization and install-time handling of
  - `build_execution_contract`
  - `test_execution_contract`
  - `deployment_contract`
  - `runtime_observation_contract`
- the diagnostic path that explains why a workspace cannot proceed

Out of scope:

- redesigning the operational edge family itself
- forcing deployment/runtime-return capability into workspaces that truly do not
  declare those lanes

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/09-odd-service-orchestration-plane.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`
- `specification/scenarios/10-capability-gated-operational-convergence.md`
- `specification/scenarios/14-declarative-operational-state-transitions.md`

This ticket reads current design truth from:

- `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`
- `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`
- `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`
- `build_tenants/python/design/README.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`

## Migration Declaration

- old_truth_path: normalization/install can publish semantically empty execution contracts and only expose the defect later through stalled operational edges
- new_truth_path: normalization/install either publishes an explicit declared/undeclared capability state or fails closed immediately with a named diagnostic
- producers_old:
  - `build_tenants/python/code/odd_sdlc/normalization.py`
  - defaulted `project_constraints.yml` templates with `\"\"` contracts
  - install/bootstrap paths that tolerate empty strings
- producers_new:
  - normalization/install capability publication with explicit malformed/undeclared handling
  - project profile resolution consuming admitted capability truth only
- consumers_old:
  - project profile resolution
  - operational-capability projections
  - triage/operational traversal that discovers the defect late
- consumers_new:
  - normalization diagnostics
  - install bootstrap
  - project profile and operational-capability projections consuming explicit truth
- derived_surfaces:
  - `project_constraints.yml`
  - operational capability diagnostics
  - install/source proof surfaces

## Migration Checklist

- [x] old empty-string truth path is named explicitly
- [x] new explicit capability publication path is named explicitly
- [x] producer and consumer sets are listed
- [x] empty-string contracts are removed or demoted from authority
- [x] install/source proofs and ticket wording are reconciled before closure

## Functional Review Criteria

1. Did the defect move to normalization/install ingress instead of remaining a delayed operational failure?
2. Is there one explicit capability publication model for declared, undeclared, and malformed states?
3. Do project profile and operational projections consume admitted capability truth rather than interpreting blanks?
4. Does the fix avoid inventing a second downstream capability classifier?
5. Can an operator tell immediately why the workspace cannot proceed without editing files mid-session?

## Evaluator Gate

### 1. Authority Seam Closure

- [x] normalization/install becomes the single authority for semantically empty execution-contract handling
- [x] downstream operational paths no longer reinterpret `\"\"` as if it were declared capability truth
- [x] deleting the explicit validation/fail-closed step causes clear failure, not silent fallback to blanks

### 2. Essential Carrier Consolidation

- [x] the fix reuses the existing execution-contract / operational-capability carriers instead of inventing parallel “validation result” authorities
- [x] malformed capability state remains subordinate to the one capability publication path
- [x] no extra wrapper layer is introduced solely to preserve legacy blank-string behavior

### 3. Typed Enforcement After Proof

- [x] empty-string validation happens at normalization/install ingress
- [x] downstream consumers do not repeatedly re-check blank strings
- [x] no `Any`/open-dict escape hatch is introduced to carry malformed capability truth through the semantic center

## Capability Publication Role Matrix

| Surface | Role | Closure expectation |
| --- | --- | --- |
| `normalization.py` / install bootstrap | authoritative | admits declared, undeclared, or malformed capability state once |
| `project_constraints.yml` defaults | ingress input | may seed input, but not act as semantic truth when values are empty |
| project profile resolution | downstream consumer | consumes admitted capability truth only |
| operational traversal / diagnostics | downstream consumer | reports the explicit admitted state, not reconstructed blank handling |

## Concrete Change Inventory

- [x] `build_tenants/python/code/odd_sdlc/normalization.py`
  - [x] detect semantically empty execution-contract declarations
  - [x] publish explicit undeclared capability truth and named pending-capability diagnostics before operational traversal
  - [x] stop writing `\"\"` as if it were lawful capability truth
- [x] install/bootstrap path
  - [x] surface the same diagnostic during install-time workspace creation/checks
- [x] project profile / capability publication
  - [x] consume explicit declared/undeclared truth
  - [x] remove any interpretation of empty string as capability declaration
- [x] proofs
  - [x] add source normalization proof
  - [x] add installation fail-closed proof
  - [x] add negative proof that blank contracts cannot pass silently

## Impacted Interface Review Checklist

- [x] `normalize_workspace(...)` rejects or explicitly classifies semantically empty contracts
- [x] workspace/default constraints no longer seed deceptive blank capability truth
- [x] project profile resolution is reviewed for blank-string handling
- [x] operational convergence diagnostics are reviewed for early fail-closed behavior

## Proof Selector Plan

Structural selectors used for closure:

```bash
rg -n 'build_execution_contract: \"\"|test_execution_contract: \"\"|deployment_contract: \"\"|runtime_observation_contract: \"\"' specification build_tenants/python/code -g'*.md' -g'*.py'
rg -n 'capability_blocked|execution_contract' build_tenants/python/code/odd_sdlc/{normalization,project_profile,operational_dispatch}.py
```

Results:

- first selector: no hits in `specification/` or `build_tenants/python/code`
- second selector: capability publication is explicit in `normalization.py`,
  `project_profile.py`, and `operational_dispatch.py`

Closure source selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q \
  -k 'test_normalize_workspace_publishes_named_diagnostic_for_empty_execution_contracts'
```

Result:

- `1 passed, 96 deselected`

Closure installation selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q \
  -k 'test_install_reports_named_capability_diagnostic_before_operational_traversal'
```

Result:

- `1 passed, 37 deselected`

Shared normalization-regression selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q \
  -k 'test_normalize_workspace_standardizes_imported_workspace_shape'
```

Result:

- `1 passed, 37 deselected`

## Initial Direction

1. treat empty string as malformed capability declaration, not as declared truth
2. fail closed at normalization or install-time publication with one named
   diagnostic
3. keep `undeclared` lawful only when it is explicit publication, not hidden in
   a blank field
4. pin the behavior with one imported-workspace install proof

## Closure Note

Closed on 2026-04-24.

What landed:

- normalization defaults and legacy-tenant projection now publish
  `undeclared`, not `\"\"`, for the four execution-contract fields
- `project_profile.py` now normalizes execution-contract declarations once and
  exposes declared/undeclared capability truth to downstream consumers
- `operational_dispatch.py` now treats semantically empty execution contracts as
  `undeclared`, not as latent declared capability
- normalization provenance now records a rewrite only when the ingress value was
  actually semantically empty; already-canonical `undeclared` values do not
  falsely report another rewrite on a second normalization pass
- source/install proofs now pin the named `pending_capability` diagnostic path
  before operational traversal

Package typing sanity at closure:

```bash
python -m mypy --config-file mypy.ini -p odd_sdlc
```

Result:

- `Success: no issues found in 48 source files`
