# T-106 Close Conformed Project Profile Authority Seam

- id: T-106
- type: bug
- ticket_category: ordinary
- status: completed
- goal: typescript-rc-runtime-architecture
- change_intent: admit `SdlcConformProjectProfile` once at workspace ingress and thread that carrier through start/operator surfaces instead of re-walking the filesystem per edge
- change_class: design_reframe
- re_entry_point: design
- triaged_at: 2026-05-01
- created_at: 2026-05-01
- updated_at: 2026-05-01
- completed_at: 2026-05-01
- priority: medium
- build_tenant: typescript
- owner: unassigned
- review_status: external_review_accepted
- intake_source: Claude DMM review CC-2 authority-seam closure finding.
- affected_boundary: `cli/command.ts`, `start/public_start.ts`, `workspace/project_profile.ts`, `operator/handoff.ts`, `operator/installed_operator.ts`, `qualification/installed_initial_state.ts`

## STDO Triage

### First Missing Layer

Design.

The TypeScript runtime derives the same conformed project profile from the
workspace filesystem at multiple call sites. That repeats ingress admission and
risks drift between start, handoff, qualification, and materialization surfaces.

## Target Truth

`SdlcConformProjectProfile` is an admitted carrier for the run. It is created
once from workspace ingress and then consumed by:

- query-domain projection
- public start contract
- worker handoff manifest construction
- installed qualification initial-state checks
- materialization contract selection

## Acceptance Criteria

- AC-1: start admission carries a single conformed project profile or a stable
  ref to one.
- AC-2: worker handoff construction consumes the admitted profile, not a fresh
  filesystem walk.
- AC-3: qualification paths either consume the same profile or explicitly run a
  separate qualification ingress with a named reason.
- AC-4: deterministic tests prove a profile drift fixture cannot produce mixed
  profile truth in one run.

## Non-Closure Conditions

- Adding another profile cache without naming authority.
- Hiding repeated filesystem walks behind helper functions.
- Closing without a carrier-threading proof.

## Implementation Checkpoint - 2026-05-01

Implemented pending external review.

- `SdlcExecutionContract` now carries the admitted
  `SdlcConformProjectProfile`.
- CLI start derives the profile once in workspace ingress context and passes it
  into public start.
- installed operator handoff construction consumes
  `executionContract.conformedProject` and no longer calls
  `deriveSdlcConformProjectProfileFromWorkspace` per F_P dispatch.
- Regression coverage:
  - `T-033 F_P public start blocks on unattached worker after execution contract admission`
    asserts the execution contract carries the profile.
  - `T-106 installed operator uses admitted conformed profile after workspace drift`
    mutates `project_constraints.yml` after start admission and proves the
    installed operator manifest and materialization contract still use the
    admitted `executionContract.conformedProject`.

Verification:

- `npm run build:semantic` passed.
- focused T-033/T-038/T-064/T-066/T-076 suite passed 35/35.
- `npm run lint:semantic` passed.
- `npm run test:semantic` passed 156/156.
- Post-review tightening on 2026-05-01:
  `npm run build:semantic` passed and focused
  `node --test test_env/tests/test_t064_installed_operator_ux.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs test_env/tests/test_t086_blocking_reason_carriers.test.mjs`
  passed 29/29.
- Full tranche verification on 2026-05-01:
  `npm run lint:semantic` passed, `npm run test:semantic` passed 160/160,
  and `git diff --check` passed.

Remaining before closure:

- external STDO review accepted on 2026-05-01. No separate live gate remains.
