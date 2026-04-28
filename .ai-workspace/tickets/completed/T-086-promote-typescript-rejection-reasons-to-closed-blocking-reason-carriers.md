---
id: T-086
title: Promote TypeScript rejection reasons to closed blocking-reason carriers
type: defect
ticket_category: rc_blocker
status: completed
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Replace stringly rejection and blocking reasons across install, operator postflight, assurance, and summary surfaces with closed typed carriers that preserve reason class, lawful re-entry, and evidence refs.
change_class: realization_refactor
re_entry_point: design_and_code
affected_boundary: install outcome rejection, operator postflight blocking reasons, assurance fold reason codes, gap dossier classification, CLI summary payloads, archive proof
priority: high
triaged_at: 2026-04-27T17:42:23Z
created_at: 2026-04-27T17:42:23Z
updated_at: 2026-04-28T00:00:00Z
completed_at: 2026-04-28T00:00:00Z
dependencies:
  - T-066 active
  - T-076 completed
  - T-085 completed
  - T-087 completed
  - T-088 active
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/claude/20260427T230000Z_REVIEW_active-tickets-and-assurance-ledger-wave.md
authority_refs:
  - specification/requirements/12-declarative-operational-state-transitions.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
active_module_refs:
  - build_tenants/typescript/code/src/shared/blocking_reason.ts
  - build_tenants/typescript/code/src/install/
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/assurance/
target_truth: Every failed deterministic admission returns a closed typed reason carrier with stable code, class, lawful re-entry point, evidence refs, and projection/archive representation.
superseded_truth: Free-form strings such as `reason`, `blockingReason`, and `blockingReasons[]` are sufficient for event calculus, retry pressure, and RC proof.
closure_law: this ticket closes only when operator and install rejection surfaces expose typed blocking-reason carriers, gap dossier classification no longer depends on substring matching, CLI JSON preserves the typed shape, and compatibility summaries remain derived views over typed truth.
---

## STDO Triage

First missing layer: design and code.

The requirement for deterministic state transitions already existed. The gap was realization shape: failure reasons were string carriers in public and archive surfaces.

## Design

Design note:

- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_BLOCKING_REASON_CARRIERS.md`

Prime carrier:

- `SdlcBlockingReason` in `build_tenants/typescript/code/src/shared/blocking_reason.ts`

The carrier owns stable `code`, `reasonClass`, `lawfulReentryPoint`, `message`, `detail`, and `evidenceRefs`. String fields remain as compatibility projections.

## Realization

Implemented:

- operator summaries expose typed `blockingReasons`
- postflight results expose typed `blockingReasonCarriers`
- postflight gap dossiers carry typed `blockingReason`
- assurance fold reasons map to typed carriers before postflight archive
- install rejection exposes typed `blockingReason`
- gap dossier reason class is derived from typed carrier truth, not substring matching
- CLI JSON preserves typed summary shape while retaining compatibility strings

## Verification

Passed:

- `npm run build:semantic`
- `npm run test:t086`
- `npm run test:t066`
- `npm run test:t076`
- `npm run test:t077-t083`
- `npm run test:t084`
- `npm run test:semantic` passed, 121 tests

The T-086 proof test covers closed carrier admission, legacy projection, postflight carrier archive, gap dossier carrier classification, rejected install carrier, and CLI JSON summary carrier shape.
