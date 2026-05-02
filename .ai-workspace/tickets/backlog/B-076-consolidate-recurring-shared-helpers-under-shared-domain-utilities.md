# B-076 Consolidate Recurring Shared Helpers Under Shared Domain Utilities

- id: B-076
- type: bug
- ticket_category: ordinary
- status: backlog
- goal: typescript-rc-maintainability
- change_intent: remove repeated local implementations of stable JSON, sorting, hashing, and parser helpers by introducing canonical shared utilities
- change_class: realization_refactor
- re_entry_point: code
- triaged_at: 2026-05-01
- created_at: 2026-05-01
- updated_at: 2026-05-01
- priority: low
- build_tenant: typescript
- owner: unassigned
- review_status: awaiting_implementation
- intake_source: Claude DMM review CC-1 recurrence-extraction finding.
- affected_boundary: `assurance/`, `operator/`, `workspace/`, `projection/`, `triage/`, `install/`, `release/`, `shared/`

## Problem

The TypeScript tenant has repeated local helper definitions for:

- `uniqueSorted`
- `stableJson` / `stableOperatorJson`
- `sha256Text`
- `parseNonNegativeInteger`
- `parseArray`

This violates the DMM recurrence rule and increases drift risk across
admission, projection, and archive code.

## Acceptance Criteria

- AC-1: canonical helpers live under `shared/`.
- AC-2: all repeated call sites import the canonical helpers.
- AC-3: helper names do not imply domain authority where the helper is purely
  mechanical.
- AC-4: semantic tests and lint pass.

## Non-Closure Conditions

- Introducing a broad kitchen-sink utility module with domain decisions.
- Changing serialization or digest formats without a migration ticket.
