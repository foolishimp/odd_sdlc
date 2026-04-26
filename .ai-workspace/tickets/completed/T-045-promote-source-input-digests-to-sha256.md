---
id: T-045
title: Promote source-input digests to SHA-256
type: defect
ticket_category: forensic_review_remediation
status: completed
goal: keep-source-lineage-evidence-release-grade
change_intent: Replace 32-bit source-input evidence identity with SHA-256 before full operational RC work depends on archive comparison.
change_class: realization_refactor
re_entry_point: design_reframe
affected_boundary: TypeScript workspace ingress source-input identity
priority: medium
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-031 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/codex/20260426T161728Z_FORENSIC_STDO_REVIEW_typescript_tenant_T025_T041.md
target_truth: Source-input lineage uses SHA-256 evidence identity.
superseded_truth: 32-bit FNV-1a digest is enough for release-grade source evidence identity.
closure_law: this ticket closes when derived source inputs carry `sha256:<64 hex>` digests and a known SHA-256 vector is tested.
evaluation_criteria:
  - source input derivation emits `sha256` digests
  - known `abc` SHA-256 vector passes
  - imported requirement authority continues carrying source digests
proof_surface:
  - build_tenants/typescript/code/src/workspace/source_input.ts
  - build_tenants/typescript/package.json
  - build_tenants/typescript/tsconfig.semantic-strict.json
  - build_tenants/typescript/test_env/tests/test_t031_workspace_ingress.test.mjs
non_closure_conditions:
  - source inputs still derive authoritative lineage through `fnv1a32`
  - digest carrier is untested
---

## Closure Evidence

`deriveSdlcSourceInput` now emits SHA-256 source digests through Node's
built-in `crypto` primitive.

The prior FNV helper remains as a non-authoritative quick fingerprint export,
but source lineage no longer uses it.
