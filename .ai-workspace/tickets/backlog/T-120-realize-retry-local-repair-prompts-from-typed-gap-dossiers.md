---
id: T-120
title: Realize retry-local repair prompts from typed gap dossiers
type: feature
ticket_category: lawful_retry_repair
status: backlog
review_status: pending
goal: typescript-rc-live-lane-retry-quality
build_tenant: typescript
owner: unassigned
change_intent: Make same-edge retry prompts consume typed postflight gap dossiers and accepted carrier schemas so retry attempts repair the exact rejected surface instead of regenerating broadly.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: retry frontier, worker_prompt.md, component_depth_register admission, assurance postflight, live data-mapper same-edge retries
priority: high
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-04
governance_scope: STDO Method
depends_on:
  - T-101 honor retry-eligible worker report rejection in autonomous start loop
  - T-113 restore test35 production depth through component graph functions
  - T-115 ABG-prime execution failure to component repair flow
intake_source: T-109 data-mapper PTY live run reached derive_implementation_component_topology_surface and produced a retry-eligible typed postflight blocker: component_depth_register_invalid:component_depth_register.bindingId: unexpected field. The retry frontier was lawful, but retry quality depends on feeding the exact parser error and accepted carrier shape back into the worker.
target_truth: A retry-eligible postflight gap produces a retry-local repair prompt containing the rejected artifact ref, exact typed error, accepted carrier schema, non-closure rule, and instruction to minimally repair the same edge. The retry does not ask for a fresh broad regeneration unless the gap dossier says the output is unrecoverable.
superseded_truth: Same-edge retries receive generic prior gap context and rely on the worker to infer the accepted carrier shape.
closure_law: This ticket closes only when typed retry evidence is projected into the worker prompt as lawful repair input and deterministic tests show broad regeneration is not required for schema-local carrier fixes.
evaluation_criteria:
  - retry prompt includes exact postflight reason and reason class
  - retry prompt includes accepted carrier field set or schema ref for the rejected carrier
  - retry prompt identifies rejected artifact and report refs
  - retry prompt says whether the repair is schema-local, semantic-local, or broad regeneration
  - component_depth_register unexpected-field failure repairs by removing or mapping the invalid field, not by rewriting unrelated surfaces
  - retry remains governed by ABG/odd_sdlc postflight truth and does not loop externally
proof_surface:
  - deterministic retry fixture for unexpected field on component_depth_register
  - negative fixture where retry prompt omits accepted schema and test fails
  - live data-mapper replay or rerun showing retry-local repair prompt on a component topology blocker
non_closure_conditions:
  - retry prompt only says "try again"
  - retry prompt requires human-authored external loop logic
  - retry repair bypasses F_P/F_D postflight
  - accepted schema is embedded as stale prose with no typed source ref or generated field list
---

# T-120: Retry-Local Repair Prompts

## STDO Triage

The missing layer is realization prompt construction over admitted gap truth.
ABG owns continuation and retry frontier truth. odd_sdlc owns the
software-domain worker prompt that turns a typed postflight blocker into a
bounded repair attempt.

This is the lawful in-ABG loopback the user asked for: no external loop, no
ambient prompt folklore, and no broad regeneration when the gap is a local
carrier mismatch.
