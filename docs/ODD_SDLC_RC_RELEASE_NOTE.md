# odd_sdlc RC Release Note

This release candidate closes the current `odd_sdlc` framework-strengthening
wave around capability governance, ambiguity governance, iterative requirement
closure, and generated traceability.

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
- generated source and test trace authority through `Implements:` and
  `Validates:` markers
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

Framework suite:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests -q`
- result: `36 passed, 4 skipped`

## Known RC Limitation

Generated trace-path discovery is still self-hosting-oriented and resolves some
surfaces through fixed `build_tenants/odd_sdlc/python/...` paths.

This is documented in [ODD_SDLC_RC_NOTES.md](/Users/jim/src/apps/odd_method/docs/ODD_SDLC_RC_NOTES.md)
and is accepted as non-blocking for this RC.
