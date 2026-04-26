---
id: T-044
title: Admit worker attachment through non-empty transport contract
type: defect
ticket_category: forensic_review_remediation
status: completed
goal: keep-public-start-worker-readiness-honest
change_intent: Prevent empty or whitespace transport contracts from satisfying the F_P worker attachment gate.
change_class: realization_refactor
re_entry_point: design_reframe
affected_boundary: TypeScript public start worker attachment
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-033 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/codex/20260426T161728Z_FORENSIC_STDO_REVIEW_typescript_tenant_T025_T041.md
target_truth: Public start treats only a trimmed non-empty transport contract as attached F_P worker truth.
superseded_truth: Any non-null transportContract value is enough to mark a worker attached.
closure_law: this ticket closes when empty and whitespace transports fail closed and valid transports are normalized.
evaluation_criteria:
  - null transport remains unattached
  - empty and whitespace transports throw
  - valid transport trims and attaches
proof_surface:
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/test_env/tests/test_t033_public_start.test.mjs
non_closure_conditions:
  - empty string produces attached worker status
  - whitespace-only string produces attached worker status
---

## Closure Evidence

`projectSdlcWorkerAttachment` now parses the transport contract through a
trimmed non-empty string gate.

Focused `T-044` coverage proves null, empty, whitespace, and valid transport
behavior.
