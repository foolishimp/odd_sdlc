---
id: T-048
title: Track ABG M05 sandbox/archive framework public export for common sandbox convergence
type: dependency
ticket_category: build_wave_followup
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Track the upstream substrate dependency needed for odd_sdlc.TS to converge on a common ABG sandbox/archive framework rather than retaining a tenant-local archive writer.
change_class: design_reframe
re_entry_point: design
affected_boundary: ABIogenesis TypeScript M05 qualification exports, odd_sdlc TypeScript sandbox archive lane, common sandbox framework adoption
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26T18:10:29Z
completed_at: 2026-04-26T18:10:29Z
dependencies:
  - T-047 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: T-047 found that ABIogenesis TypeScript M05 sandbox/archive code exists, but is not exported through the public package surface consumed by odd_sdlc.TS.
target_truth: odd_sdlc.TS consumes a public, reusable ABG TypeScript sandbox/archive qualification framework instead of depending on private ABIogenesis paths or long-lived tenant-local duplicate archive mechanics.
superseded_truth: A tenant-local odd_sdlc sandbox archive writer is sufficient as the enduring common sandbox framework.
closure_law: This ticket closes only when an upstream ABIogenesis ticket or release exposes the relevant M05 sandbox/archive framework as public TypeScript API and odd_sdlc.TS either consumes it or records an explicit design decision not to.
---

# T-048: Track ABG M05 Sandbox/Archive Framework Public Export

## Problem

T-047 creates a lawful pre-refactor sandbox lane for `odd_sdlc.TS`.

That lane intentionally uses public `odd_sdlc.TS` and public ABG package
surfaces. It does not import private ABIogenesis M05 paths.

ABIogenesis already contains M05 sandbox/archive framework code and proof
lanes, but the current TypeScript package exports expose M01, M02, M03, and M04
surfaces only. M05 qualification surfaces are built and tested inside
ABIogenesis, but they are not a public dependency surface for downstream
products.

## Target Truth

The long-term common sandbox framework should be ABG-owned or ABG-published.

`odd_sdlc.TS` should not grow a permanent duplicate framework if ABG already
owns the reusable archive and sandbox primitives.

## Scope

This ticket tracks the dependency from the `odd_sdlc` side.

It does not authorize editing ABIogenesis from this repository. An upstream
ABIogenesis ticket or release must carry the actual package-export change.

## Evaluation Criteria

- Identify the exact ABIogenesis M05 surfaces needed by `odd_sdlc.TS`.
- Create or link the upstream ABIogenesis ticket that makes those surfaces
  public.
- Reprice the `odd_sdlc.TS` sandbox lane after the upstream public API exists.
- Either consume the public ABG framework or record why the local sandbox archive
  lane remains the correct bounded adapter.

## Non-Closure Conditions

- `odd_sdlc.TS` imports private ABIogenesis build paths.
- duplicate archive mechanics become permanent without design review.
- common sandbox convergence is assumed from local test success alone.
- T-047 sandbox proof is treated as full T-041 operational replacement.

## Completion Record

This odd_sdlc-side dependency tracker is closed by upstream handoff and local
design decision.

Upstream ABIogenesis ticket:

- `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/backlog/T-077-export-typescript-m05-sandbox-archive-framework-as-public-downstream-api.md`

Local decision for the current TypeScript RC wave:

- `odd_sdlc.TS` does not import private ABIogenesis M05 paths.
- current sandbox and live lanes use public ABG installer/package surfaces and
  local archive writers only as bounded tenant proof adapters.
- the tenant-local archive lane is not declared the permanent common sandbox
  framework.
- after ABG T-077 publishes a public M05 API, `odd_sdlc.TS` must be repriced
  before claiming common sandbox framework convergence.

Proof now present on the odd_sdlc side:

- T-052: current sandbox lanes require ABG-populated installed workspaces.
- T-053: live `data_mapper` proof archives ABG install, worker, event,
  projection, and postmortem evidence.
- T-059: install/release adapters publish package, command, ABG install,
  normalization, and release-cut evidence through public package surfaces.
