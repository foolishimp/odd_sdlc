---
id: T-042
title: Bind requirement closure proof to same generated-asset contract
type: defect
ticket_category: forensic_review_remediation
status: completed
goal: keep-odd-sdlc-typescript-rc-evidence-lawful
change_intent: Prevent requirement closure from combining behavioral proof on one asset with satisfied generated-asset state on another asset.
change_class: realization_refactor
re_entry_point: design_reframe
affected_boundary: TypeScript requirement closure projection
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-035 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/codex/20260426T161728Z_FORENSIC_STDO_REVIEW_typescript_tenant_T025_T041.md
target_truth: A requirement is fulfilled only when at least one lineage entry for that requirement has both a satisfied generated-asset contract and behavioral/runtime proof on that same entry.
superseded_truth: Closure may combine any behavioral proof for a requirement with any satisfied generated asset for that requirement.
closure_law: this ticket closes when split-entry behavioral proof plus satisfied contract remains unresolved and carries an explicit open reason.
evaluation_criteria:
  - same-entry satisfied contract plus behavioral/runtime proof closes a requirement
  - split-entry proof and satisfaction remains partial
  - trace-only proof remains partial
proof_surface:
  - build_tenants/typescript/code/src/projection/requirement_closure.ts
  - build_tenants/typescript/test_env/tests/test_t035_traceability_requirement_closure.test.mjs
non_closure_conditions:
  - closure is based on aggregate booleans across sibling assets
  - trace-only proof satisfies closure
---

## Closure Evidence

Implemented same-entry closure binding in `requirement_closure.ts`.

Added `T-042` negative coverage where the behavioral proof and satisfied
contract are split across two generated assets. The requirement remains
partial and carried forward.
