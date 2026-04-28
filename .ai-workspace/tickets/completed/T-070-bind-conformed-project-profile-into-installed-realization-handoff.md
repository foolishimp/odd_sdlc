---
id: T-070
title: Bind conformed project profile into installed realization handoff
type: defect
ticket_category: rc_blocker
status: completed
resolution: consolidated_into_T-069
completion_type: consolidation_only_not_implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Close the correspondence between test35's normalized workspace truth and the TypeScript conform-project layer by making the conformed project profile a mandatory input to installed realization handoff and archive proof.
change_class: design_reframe
re_entry_point: design
affected_boundary: conform-project carrier, installed operator handoff, graph-function catalog, worker prompt construction, realization output contract
priority: critical
triaged_at: 2026-04-27T12:12:00Z
created_at: 2026-04-27T12:12:00Z
updated_at: 2026-04-27T12:12:00Z
dependencies:
  - T-041
  - T-066
  - T-068 completed
governance_scope: STDO Method
consolidated_into:
  - T-069
consolidation_reason: conformed project profile is part of the valid installed initial-state surface for the active domain model and total transition function, not an independent design surface.
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/codex/20260427T120602Z_AUDIT_data_mapper_test35_traversal_vs_current_ts_success_gap.md
test35_observed_capability: workspace/project truth is normalized before realization and remains active as traversal context.
current_ts_status: T-068 publishes generic `SdlcConformProjectProfile`, but full data_mapper realization has not proved that installed handoff and prompts are governed by it.
gap: TypeScript can still pass shallow scalar defaults or partial constraints into realization paths.
fill: require every realization handoff to carry the conformed project profile, provenance digest, declared modules, capability contracts, execution contracts, and selected output root.
target_truth: realization edges consume conformed project truth rather than rescanning or inferring project state ad hoc.
superseded_truth: deriving `activeTenant` and `selectedOutputRoot` at handoff time is sufficient project truth for downstream product realization.
closure_law: this ticket closes only when installed realization handoff fails without `conformed_project.json`, archives that profile with each materializing edge, and proves prompt/report construction derives from the profile.
evaluation_criteria:
  - handoff manifest includes conformed project identity, declared modules, selected tenant, output root, capability contracts, execution contracts, and provenance digest
  - materialization contract derives allowed output roots and required file families from the conformed profile
  - worker prompt includes conformed profile references without copying inert full context unnecessarily
  - postflight rejects realization output whose paths or declared capabilities contradict the conformed profile
  - tests use arbitrary tenant/module fixtures, not only data_mapper
proof_surface:
  - design update for conform-project handoff seam
  - handoff manifest fixture tests
  - installed data_mapper successor archive showing conformed profile carried into realization
non_closure_conditions:
  - realization code rescans raw project constraints instead of consuming the admitted profile
  - data_mapper-specific profile defaults are hardcoded
  - conformed profile is archived but not used by prompt, output contract, or postflight
---

## Design Method Notes

This ticket owns a carrier seam, not a service orchestration shortcut.

Design Module Method obligations:

- define or update the carrier diagram for conformed-project to realization handoff
- keep the transform from profile to materialization contract total or fail-closed
- keep prompt assembly as a projection over admitted carrier truth
- prevent duplicate project truth surfaces from appearing in operator code
