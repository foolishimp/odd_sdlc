# odd_sdlc RC Release Note

This release candidate closes the current `odd_sdlc` framework-strengthening
wave around capability governance, ambiguity governance, iterative requirement
closure, generated traceability, installed-workspace requirement
carry-forward, and downstream uptake of the released ABG runtime boundary.

## What Shipped

- capability-gated operational traversal
- ambiguity register seeded at normalization and updated through runtime policy
- risk-appetite-driven ambiguity handling with `F_P` carry and `F_H` escalation
- iterative requirement-closure register for multi-wave completion
- deterministic scope and traceability gates:
  - `goal_surface_authority_validated`
  - `requirement_scope_complete`
  - `code_traceability_present`
  - `test_traceability_present`
- requirement-authority carry-forward on installed workspaces:
  `derive_requirement_surface` now carries the live requirement-closure
  register so imported REQ IDs remain literal downstream pressure
- downstream ABG uptake through installer composition:
  released ABG runtime truth is now consumed by reinstall, not by source
  `.genesis` mirroring
- installed proof lanes aligned to ABG certification semantics:
  unresolved post-`F_P` deterministic gaps may now emit
  `graph_call_failed` with `certification_failure` while the enclosing run
  still completes cleanly
- generated source and test trace authority through `Implements:` and
  `Validates:` markers
- developer-test branch refactor without public graph drift:
  realized generated test source now materializes within
  `derive_test_run_archive_surface`, while the public
  `test_module -> test_run_archive -> testcase_authority` branch shape stays
  stable
- archive-stage traceability repair:
  empty orphan generated test files are no longer emitted, and adopted
  code-surface deterministic gaps now surface back out as `fd_gap` after
  constructive continuation recheck
- workspace-root and catalog honesty fixes for installed workspaces
- repriced `data_mapper_test19_topology_regression` proving lane under current
  framework semantics

## Framework Position

This RC operates with a construction-first, governed-evidence admission policy.

That means:

- constructive SDLC surfaces may converge before execution capability is
  declared
- undeclared execution artifacts remain visible but ungoverned
- release and qualification stay at `pending_evidence` /
  `construction_complete_pending_execution` until declared capability and
  governed returned evidence exist

This preserves iterative closure without allowing false operational truth.

## Verification

Targeted red-lane recovery:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_test19_regression.py -q`
- result: `2 passed`

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_first_slice.py -q`
- result: `9 passed`

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py -q -k 'installed_self_test_command_drives_the_current_executive_program or operational_cycle_projects_deployment_runtime_and_retrofit_surfaces or canonical_sandbox_can_reset_runtime_state_and_rerun_cleanly'`
- result: `3 passed, 3 deselected`

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_installation.py -q -k 'data_mapper_template_as_is_requires_scope_and_traceability_work_before_auto_convergence'`
- result: `1 passed, 9 deselected`

Framework suite:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests -q`
- result: green at the RC boundary cut; subsequent follow-on topology,
  traceability, and iterator regressions were added afterward and are tracked
  through their own targeted lanes

Current targeted follow-on regressions:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q`
- result: green

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_test28_regression.py -q`
- result: green

Installed-workspace recovery:

- clean install proof on `data_mapper.test25`
- `derive_requirement_surface` retained `REQ-ACC-01..05`
- requirement closure reported `missing_from_current_requirement_surface = 0`

## Known RC Limitation

The full homeostatic gap-triage loop remains post-RC work.

This is documented in [ODD_SDLC_RC_NOTES.md](/Users/jim/src/apps/odd_method/docs/ODD_SDLC_RC_NOTES.md)
and remains outside this RC cut.
