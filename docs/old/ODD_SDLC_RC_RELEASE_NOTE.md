# odd_sdlc RC Release Note

## RC Identity

- product: `odd_sdlc`
- candidate: `v1.0.0-rc.2`
- RC branch: `rc/1.0.0`
- release state: second published release candidate for the `1.0.0` line

This RC publishes the current odd_sdlc source cut after the inside-out repair
wave that:

- moved runtime execution law onto a typed execution-contract carrier
- moved requirement and obligation truth onto a traceability-index /
  requirement-closure carrier family
- collapsed duplicate helper families under one prime owner per semantic job
- hardened public-start and continuation behavior around one published
  homeostatic carrier story

## What Shipped

### Public-Start Carrier Hardening

- public `start` now consumes the published homeostatic gap carrier before
  admission for:
  - `target=next`
  - explicit `graph_function:` targets
  - explicit `asset:` targets
- published `pending_fh` on the head edge now stops public start at `fh_gate`
  before `execution_contract_drafted`, `run_bound`, or `fp_dispatched`
- explicit public starts no longer use a narrow pending-FH intercept plus a
  direct admission fallback; they now consume the same published head-gap
  resolution family as `next`
- fresh or stale public-start entry now fails closed when the published gap
  carrier is unavailable

### Yielded Continuation And Re-Entry Alignment

- public yielded continuation now projects through one `odd_sdlc`-owned
  `public_start` carrier instead of controller-local `status` string logic
- `continue` now refreshes analysis, republishes the workspace gap-dossier
  carrier, and returns the same published workspace story that the next public
  `start(next)` consumes
- proof-driven continuation-opened states now remain lawful `yield`; true
  no-continuation failure remains failure

### Constitutional Surface And Identity Stabilization

- shared constitutional-surface normalization and digest law now lives in
  `odd_sdlc.constitutional_surface`
- constitutional proposal identity is now stable across wording-only
  reprojection, scope-sensitive where it should be, and renewed when the
  governing constitutional surface changes materially
- `constitutional_proposal_recorded` now emits `identity_hash` and
  `target_surface_digest` for event-level auditability

### Scope-Owned Gap-Dossier Publication

- `gaps --scope work_key:<id>` now publishes a scope-owned dossier carrier
  instead of overwriting the workspace-global dossier register
- workspace `query-domain` and workspace `start(next)` continue to consume the
  workspace dossier carrier explicitly
- work-key scope publication no longer poisons workspace public-start or query
  truth

## Qualification Bundle

This RC was qualified on the exact source cut published as `v1.0.0-rc.2`.

- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q -k 'explicit_public_start_requires_published_gap_dossier_before_admission or explicit_public_start_targets_stop_at_published_constitutional_head_gate or start_routes_ticket_asset_to_declared_reentry_vector or start_uses_admitted_route_contract_for_diagnostic_override or start_uses_admitted_target_truth_for_start_intent or start_rejects_unpublished_ticket_asset_handle or start_rejects_backlog_ticket_asset_handle or start_rejects_ticket_asset_without_published_route_contract or ticket_asset_start_carries_ticket_execution_context_into_manifest_prompt or new_execution_contract_supersedes_previous_admitted_contract'`
- result: `12 passed, 73 deselected in 48.22s`

- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q -k 'project_public_start_gen_start_outcome_projects_proof_hold_before_dispatch or start_next_converged_surfaces_yielded_dispatch_contract or start_next_converged_preserves_true_runtime_failure_without_continuation or continue_with_result_publishes_workspace_gap_surface_and_uses_published_status'`
- result: `4 passed, 79 deselected`

- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q -k 'install_exposes_public_odd_sdlc_start_contract or install_exposes_public_odd_sdlc_graph_function_and_asset_targets or install_start_routes_ticket_asset_without_manual_upstream_edit or default_claude_manifest_declares_domain_dispatch_timeout or install_explicit_asset_start_also_stops_at_published_constitutional_fh_gate or install_public_next_varies_only_with_published_carrier_truth_between_pristine_and_progressed_workspaces'`
- result: `6 passed, 29 deselected in 43.96s`

<<<<<<< Updated upstream
- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py -q -k 'sandbox_forensic_public_start_stops_before_constructive_events_at_published_fh_gate'`
- result: `1 passed, 12 deselected in 4.67s`
=======
- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests -q`
- result: green at the RC boundary cut; subsequent follow-on topology,
  traceability, and iterator regressions were added afterward and are tracked
  through their own targeted lanes

Current targeted follow-on regressions:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q`
- result: green

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_test28_regression.py -q`
- result: green
>>>>>>> Stashed changes

## RC Scope

This RC certifies the current source and installed-workspace governance line for
odd_sdlc.

<<<<<<< Updated upstream
It does not claim that every future orchestration, service, or external live
agent lane is part of this source-cut qualification. Accepted RC-scoped
behavior and caveats are recorded in
[ODD_SDLC_RC_NOTES.md](/Users/jim/src/apps/odd_sdlc/docs/ODD_SDLC_RC_NOTES.md).
=======
## Known RC Limitation

The full homeostatic gap-triage loop remains post-RC work.

This is documented in [ODD_SDLC_RC_NOTES.md](/Users/jim/src/apps/odd_method/docs/ODD_SDLC_RC_NOTES.md)
and remains outside this RC cut.
>>>>>>> Stashed changes
