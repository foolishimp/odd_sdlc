---
id: T-144
title: Reclassify repairable assurance findings and tenant grammar boundaries
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: refactor_existing_assurance_and_materialization_classification_surfaces
governing_library: odd_sdlc TypeScript assurance gate, product materialization postflight, component depth, and traversal consequence surfaces
status: active
review_status: pre_data_mapper_blocker_slice_implemented
goal: typescript-data-mapper-live-parity
build_tenant: typescript
owner: odd_sdlc
change_intent: Stop classifying repairable F_P/tenant-local evidence gaps as operator hard stops, and move ecosystem grammar out of core SDLC postflight into declared capability or worker evidence surfaces.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-05-11
created_at: 2026-05-11
updated_at: 2026-05-11
governance_scope: STDO Method
dependencies:
  - T-143 keeps product target authority F_P-visible instead of adding a pre-dispatch F_D gate.
affected_boundary:
  - build_tenants/typescript/code/src/operator/assurance_gate.ts
  - build_tenants/typescript/code/src/assurance/component_depth.ts
  - build_tenants/typescript/code/src/assurance/semantic_convergence.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/materialization/materialization.ts
  - build_tenants/typescript/test_env/tests/
intake_source: 2026-05-11 F_D-overreach review against PRODUCT.md Technology Capability Asset law and current T-143 product-authority correction.
target_truth: Core SDLC supplies lineage, target binding, allowed roots, worker handoff context, postflight mechanics, and admitted evidence routing. F_P and declared tenant/capability validators own constructive repair and ecosystem-specific grammar. F_D blocks closure/admission when evidence does not satisfy declared obligations; it blocks dispatch only for hard-stop prerequisites.
superseded_truth: Core assurance/postflight code classifies repairable missing obligation assessments, untyped repair evidence, ADR field shape, build-tool files, and test discovery patterns through hard-coded framework logic that can become an operator_blocked hard stop or hidden ecosystem grammar.
closure_law: This ticket closes when repairable obligation/reporting gaps re-enter via retry/repair/reprice dispositions instead of operator_blocked, and stack-specific file/test/build grammar is supplied by declared tenant/capability policy or worker evidence rather than hard-coded core runtime lists, without weakening deterministic admission mechanics.
non_closure_conditions:
  - Missing or repairable worker obligation assessment defaults to operator_blocked when a same-edge retry or repair-worker-output basis exists.
  - Semantic contradiction advertises design_reframe but returns a block verdict.
  - Component-depth repair gaps are stored as open gaps while carrying operator_blocked re-entry points.
  - Core SDLC requires ADR field strings, build tool names, or test path/extension patterns as hidden ecosystem law instead of declared capability policy or worker evidence.
  - Existing T-066/T-115/T-143 product materialization and repair-flow regressions lose deterministic closure/admission checks.
---

# T-144: Reclassify Repairable Assurance And Tenant Grammar Boundaries

## Root Cause

T-143 restored the correct dispatch boundary: product target ambiguity is F_P
visible lineage, not an F_D pre-dispatch gate. The same boundary is not yet
clean across assurance and postflight.

Current examples:

- `operator/assurance_gate.ts` maps missing, extra, and blocked obligation
  assessments into `operator_blocked`, even when the worker can repair/report
  the obligation on the same edge.
- `assurance/semantic_convergence.ts` gives contradictory semantic claims a
  `design_reframe` re-entry point but returns a `blocked` verdict.
- `assurance/component_depth.ts` mixes `operator_blocked` reasons into an
  `open_gap` ledger for failed tests without admitted attribution, low-confidence
  attribution, and repair-schedule triage gaps.
- `operator/handoff.ts` hard-codes ecosystem grammar for build config files,
  likely source/test paths, SBT discoverability, and ADR field strings.

## Required Fix

1. Reclassify repairable assurance findings:
   - missing worker assessment -> `same_edge_retry` or `repair_worker_output`
     when a lawful constructive basis exists;
   - failed execution without attribution -> repair schedule or worker-output
     repair, not operator hard stop by default;
   - true `operator_blocked` reserved for no lawful constructive basis.

2. Align verdicts and re-entry:
   - `design_reframe` reasons feed `reprice_required`;
   - `operator_blocked` reasons feed `blocked`;
   - retry/repair reasons feed `open_gap`.

3. Move ecosystem grammar behind declared surfaces:
   - role taxonomy can remain core (`source`, `test`, `build_config`, `design`,
     `documentation`, `other`);
   - role assignment patterns and test/build discovery rules come from
     technology capability assets, tenant policy, or worker evidence.

4. Preserve deterministic mechanics:
   - path containment, existence, digest, byte count, output-root containment,
     and report schema admission stay core F_D checks.

## Evaluation Criteria

- Focused tests prove missing obligation assessment re-enters via retry/repair
  when F_P has a lawful basis.
- Release-depth parity can consume an admitted component repair schedule from
  the canonical tenant-local design surface, not only from legacy runtime asset
  archives.
- Semantic contradiction returns `reprice_required` with `design_reframe`.
- Component-depth triage and unattributed execution failures do not silently
  become mixed open_gap/operator_blocked states.
- Product materialization still rejects unsafe paths, missing files, digest
  mismatches, and unreported materialization.
- Existing `npm run test:t066`, `npm run test:t115`, `npm run test:t143`, and
  relevant assurance ledger tests pass after repricing expected dispositions.

## Implemented Pre-Data-Mapper Blocker Slice

Landed on 2026-05-11 before the next data_mapper live run:

- `operator/assurance_gate.ts` no longer classifies missing, extra, or blocked
  traversal-obligation assessments as `operator_blocked`. Missing assessment
  now re-enters through `same_edge_retry`; extra and blocked assessments re-enter
  through `repair_worker_output`. The assurance gate still blocks closure until
  the obligation evidence is repaired.
- `assurance/component_depth.ts` now resolves the latest admitted component
  repair schedule from the selected tenant output root at
  `build_tenants/<tenant>/design/component_repair_schedule_surface.md`, while
  retaining legacy runtime-asset archive lookup. This preserves the current
  tenant-local design-output rule and prevents release-depth parity from losing
  an admitted repair schedule during data_mapper repair.

Validation:

- `npm run test:t066` passed 32/32, including a new T-144 regression proving
  missing obligation assessments route to same-edge retry instead of
  `operator_blocked`.
- `node --test test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs`
  passed 9/9 after the tenant-local repair schedule lookup fix.
- `npm run test:t143` passed 7/7.
- `npm run test:t077-t083` passed 15/15.

Remaining T-144 scope:

- Align semantic contradiction verdicts with `design_reframe` / reprice
  semantics.
- Finish the component-depth mixed-state cleanup for non-data-mapper-blocking
  open-gap/operator-blocked edge cases.
- Move ADR field grammar and ecosystem build/test discovery patterns behind
  declared tenant/capability surfaces without removing deterministic path,
  digest, existence, and containment checks.
