---
id: T-040
title: Govern TypeScript data-mapper fixture proof portability and test-lane authority
type: corrective
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Ensure TypeScript test closure separates portable semantic proof from external fixture, sandbox, live, and reference-comparison evidence.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript test surface map, data_mapper fixture binding, semantic lane, sandbox/reference qualification lanes
priority: P1
triaged_at: 2026-04-26
created_at: 2026-04-26
completed_at: 2026-04-26
governance_scope: STDO Method
---

# T-040: Govern TypeScript data-mapper fixture proof portability and test-lane authority

## Review Finding

The TypeScript semantic lane still depends on the external
`data_mapper.template` fixture through a local default path. The fixture locator
can be overridden with `ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT`, but a clean checkout
without the external workspace cannot run the full semantic lane.

Source finding:

- `.ai-workspace/comments/codex/20260426T040716Z_CORRECTIVE_REVIEW_typescript_build_wave_before_close.md`
- current review follow-up: fixture portability is improved but still external
  to the semantic lane

## Target Truth

Portable semantic/unit closure is independent of undeclared local filesystem
state. External project fixtures are either captured by a checked-in minimal
fixture/manifest or moved to an explicit sandbox/UAT lane with declared fixture
authority.

## Superseded Truth

A local external workspace path can count as semantic closure evidence for the
TypeScript tenant.

## Closure Law

This ticket closes only when every TypeScript test lane declares whether it is:

- portable module/design conformance proof
- harnessed sandbox/UAT proof
- live sandbox/UAT proof
- optional local reference comparison

The default semantic lane must run from a clean checkout or clearly exclude
external-fixture tests from semantic closure.

## Evaluation Criteria

- classify the data-mapper fixture test under the constitutional testing
  taxonomy
- remove undeclared local path dependency from required semantic closure, or
  replace it with a checked-in minimal fixture/manifest
- if the full external fixture remains useful, bind it through an explicit
  sandbox or reference-comparison script
- record the fixture source/version used for RC qualification
- ensure missing external fixture diagnostics are governed and do not masquerade
  as semantic failure

## Proof Surface

- updated test surface map
- updated package scripts if lanes change
- fixture manifest or checked-in minimal fixture if semantic lane retains the
  scenario
- test run evidence for semantic lane and any new sandbox/reference lane
- STDO closure review comment

## Non-Closure Conditions

- semantic closure requires Jim's local path
- an external reference fixture is required but not declared in the lane map
- a missing external fixture reports as a generic test failure
- RC proof uses the fixture without recording source/version

## Closure Evidence

- Required semantic T-031 proof now uses checked-in portable source snapshots.
- The full external `data_mapper.template` proof moved to
  `test_t031_data_mapper_reference.reference.mjs`, outside the `*.test.mjs`
  semantic lane.
- `data_mapper_reference_manifest.md` declares fixture authority, environment
  binding, expected local source, and lane classification.
- `data_mapper_fixture.mjs` now requires `ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT`
  and reports a governed optional-reference diagnostic when absent.
- `test:t040` proves semantic closure excludes external reference fixtures.
- `test:reference:data-mapper` proves the retained external comparison lane when
  the fixture is explicitly bound.
- `npm run test:t031`, `npm run test:t040`, `npm run test:semantic`,
  `npm run lint:semantic`, and `test:reference:data-mapper` passed.
