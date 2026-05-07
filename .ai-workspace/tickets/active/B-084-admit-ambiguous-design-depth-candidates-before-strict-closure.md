---
id: B-084
title: Admit ambiguous design-depth candidates before strict closure
type: bug
ticket_category: design_depth_admission
status: active
review_status: reopened_closure_evidence_invalid_generic_builder_risks
goal: odd-sdlc-rc-data-mapper-production-depth
change_intent: Fix design-depth ingest so useful ambiguous or partial F_P design candidates are admitted, normalized where lawful, archived, and forced into later detail gaps without inventing missing identity, embedding tenant-specific vocabulary, or drifting worker repair schema from parser law.
change_class: design_reframe
re_entry_point: design
affected_boundary:
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/operator/design_depth_register.ts
  - build_tenants/typescript/code/src/assurance/design_completeness.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/test_env/tests/
priority: critical
build_tenant: typescript
triaged_at: 2026-05-05
created_at: 2026-05-05
updated_at: 2026-05-07
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
dependencies:
  - T-116 completed module schema/state and aggregate design surfaces
  - T-122 active feature scope carrier for steel-thread closure
  - T-123 active traversal strategy authority correction
evidence_refs:
  - /Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/T-122-add-feature-scope-carrier-for-steel-thread-closure.md
  - /Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/T-123-consume-per-edge-traversal-strategy-and-delay-steel-thread-scope.md
rejected_evidence_refs:
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test69.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260505T005157506Z_pid11743/gap_dossier.json
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test69.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260505T005736850Z_pid11743/gap_dossier.json
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test69.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260505T010214202Z_pid11743/gap_dossier.json
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test69.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260505T010533826Z_pid11743/gap_dossier.json
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test69.TS.cx/.ai-workspace/runtime/odd_sdlc/assets/20260505T010533826Z_pid11743/implementation_module_surface.md
supporting_evidence_refs:
  - build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260505T180726166Z_pid44582/workspace
proof_commands:
  - npm run build:semantic
  - node --test build_tenants/typescript/test_env/tests/test_t122_feature_scope_closure.test.mjs
  - ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE=pty-terminal node_modules/.bin/odd-sdlc-ts start --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test69.TS.cx --target next --until converged --worker 'process://claude'
intake_source: Fresh data_mapper test69 Claude PTY run stopped at derive_implementation_module_surface after multiple successful worker calls. Postflight rejected design_depth_register candidates for unexpected fields and relational schema shape, even though the artifacts contained useful production-shaped module, entity, attribute, and operation information.
target_truth: F_P design-depth output is ingested through a lifecycle-appropriate candidate admission path. Early design candidates may be ambiguous, partial, or relational. The framework preserves raw candidate evidence, normalizes safe generic shapes into typed carriers, rejects missing target identity and contradictory ownership, classifies missing forced details as open gap pressure, and reserves strict closure for the point where downstream code/materialization depends on exact structure.
superseded_truth: design_depth_register ingest uses a closed-record parser as the first gate and rejects useful candidates as malformed when they contain extra metadata, relational entity/attribute rows, or partial detail.
closure_law: Close only when useful ambiguous design-depth candidates admit as normalized or partial carriers, malformed candidates still reject, missing target identity and contradictory ownership reject or become typed ambiguity pressure, no tenant-specific CDME/data_mapper vocabulary is embedded in generic odd_sdlc core, worker retry field sets match parser law, missing forced details surface as typed gaps, and live data_mapper retry can advance past the observed test69 schema-mismatch loop without weakening final design-depth closure.
evaluation_criteria:
  - relational but useful design-depth candidates admit as normalized or partial carriers.
  - malformed JSON remains rejected.
  - missing module or target identity is rejected or becomes typed ambiguity pressure; it is not normalized to a fake identity.
  - contradictory schema/entity/module ownership is rejected or becomes typed ambiguity pressure.
  - F_D design-completeness assurance compares entity and operation identities at the level of disambiguation supplied by the carrier, including scoped alias forms when the carrier has not selected one canonical spelling.
  - Scoped axis-status qualifiers such as `satisfied_for_steel_thread` are admitted as the corresponding base status when the selected feature scope supplies that qualifier context.
  - Standard attribute cardinality aliases such as `1..1`, `0..1`, and `0..*` admit as the corresponding base cardinality when the carrier context has not required the private enum spelling.
  - Ambiguous design-depth semantics with no hard source signal route to F_P escalation rather than F_D failure.
  - generic odd_sdlc code does not infer tenant module identity from CDME/data_mapper-specific names.
  - retry field-set guidance and parser-required design completeness verdict shape stay aligned.
  - raw and normalized candidate sidecars are archived when an archive root is available.
  - deterministic tests cover missing identity, contradictory ownership, malformed JSON sidecars, and retry field-set drift.
proof_surface:
  - deterministic B-084 admission tests
  - parser/worker accepted-carrier field-set tests
  - live data_mapper handoff/archive evidence after the normalization fixes
non_closure_conditions:
  - accepting arbitrary unknown JSON as closure authority
  - weakening final design-depth closure gates
  - treating worker-authored metadata such as runId or includedModuleNames as register law
  - silently dropping useful candidate evidence without archiving or traceability
  - normalizing contradictory or impossible structures as if unambiguous
  - inventing `unnamed-module` or other fake target identity for missing module identity
  - hardcoding tenant-specific CDME/data_mapper vocabulary in generic odd_sdlc core
  - telling workers to emit a retry carrier shape the parser does not admit
  - failing a carrier only because equivalent ambiguous entity or operation identity was spelled in a non-canonical but allowed form
  - failing a carrier only because a closed design-completeness status is qualified by the current feature scope instead of emitted as the unqualified base enum
  - failing a carrier only because standard cardinality notation is used where the handoff did not require the private `one | optional | many` enum spelling
  - forcing F_D failure for semantic disambiguation that must escalate to F_P
  - rerunning live tests without changing the ingest/admission boundary
---

## Reopen Finding - 2026-05-07

Reopened under STDO. The completed claim is not accepted.

Findings:

- The ticket says "Closed under STDO" while its own focused verification says
  live data_mapper proof remains outstanding. That is not a lawful completed
  state for an RC blocker.
- The cited test69 evidence refs are pre-fix failure dossiers. They prove the
  original failure class, not closure.
- Later T-109 evidence is supporting but not closure proof: the lane advanced
  past the original loop, but it still contains intermediate
  `design_depth_register_invalid` failures on aggregate/sunny-day design
  surfaces before later progress.
- `design_depth_register.ts` normalizes a missing schema module name to
  `unnamed-module`; that can convert missing target identity into partial/open
  gap pressure instead of rejection.
- `design_depth_register.ts` contains CDME-specific module inference
  (`compiler.*` -> `cdme-compiler`) inside generic odd_sdlc core. Module identity
  must come from emitted schema, feature scope, target authority, or typed
  reentry context, not tenant vocabulary.
- Accepted retry field-set guidance advertises
  `designCompletenessVerdict.axisVerdicts`, while the parser expects
  `designCompletenessVerdict.entity`, `.attribute`, and `.flow`.
- Contradictory ownership is not currently rejected: entity/module ownership can
  diverge from the containing schema module and still parse.
- Traceability was incomplete: `design_depth_register.ts` and the focused test
  file did not identify B-084 even though they carry B-084 implementation and
  regression coverage.

## Corrected Closure Bar - 2026-05-07

B-084 closes only when:

- missing target/module identity is rejected or emitted as typed ambiguity
  pressure, not normalized to `unnamed-module`;
- tenant-specific CDME/data_mapper inference is removed from generic
  `odd_sdlc` core or moved behind tenant-owned authority;
- contradictory schema/entity/module ownership rejects or emits typed ambiguity
  pressure;
- accepted carrier field sets and strict parser law use one surface;
- deterministic tests cover missing module identity, contradictory ownership,
  malformed JSON sidecar behavior, and retry field-set/parser drift;
- live data_mapper evidence proves advancement past the original schema mismatch
  without intermediate unaddressed design-depth parser drift being claimed as
  closure.

## Implementation Checkpoint - 2026-05-07

Status: active, pending operator review of test results and live data_mapper
proof.

Implemented deterministic corrections for the reopened findings:

- `design_depth_register.ts` no longer normalizes a missing schema `moduleName`
  to `unnamed-module`; missing module identity rejects admission.
- generic design-depth core no longer maps `compiler.*` identifiers to
  `cdme-compiler`.
- state diagram module inference falls back only to containing/default module
  authority instead of tenant vocabulary.
- schema/entity and schema/operation module contradictions reject during strict
  module schema admission.

Verification run for operator review:

- `npm run build:semantic && node --test test_env/tests/test_t122_feature_scope_closure.test.mjs` passed: 19/19.

This checkpoint does not close B-084. Remaining closure still requires live
data_mapper evidence and operator review of the focused test results.

## F_D Assurance Clarification - 2026-05-07

Status: active, pending operator review and fresh live data_mapper proof.

The 2026-05-07 T-109 live run
`build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260507T013551288Z_pid99914`
exposed a ticket-level assurance defect rather than a worker-output defect.
The aggregate/sunny-day design carrier preserved useful identity, but F_D
assurance compared operation/entity IDs at a stricter canonical spelling level
than the input contract had disambiguated. That produced false blockers such as
`design_flow_operation_missing:operation:bindtypes` when the carrier used an
allowed camelCase operation identity.

B-084 now requires F_D design-completeness checks to evaluate identity at the
level of supplied disambiguation:

- if module identity is declared on both sides and conflicts, the match fails;
- if module identity is compatible and the carrier has not required one exact
  spelling, scheme prefixes, local names, separator/case variants, and compact
  alphanumeric aliases are equivalent for assurance comparison;
- strict rejection remains valid for missing hard-required target identity,
  contradictory ownership, malformed carrier shape, and impossible structures;
  ambiguous semantics without a hard source signal must escalate to F_P instead
  of becoming F_D failure;
- F_D must not require a worker to emit one canonical operation/entity spelling
  unless the ticket, handoff, or source authority explicitly made that spelling
  part of the contract.
- F_D must not reject a design-completeness axis solely because a closed status
  is qualified by the selected feature scope, for example
  `satisfied_for_steel_thread`; the base status remains `satisfied`.

Implementation checkpoint for review:

- `design_completeness.ts` now compares aggregate/sunny-day operation and
  entity references through scoped alias equivalence.
- `design_depth_register.ts` preserves typed sunny-day step operation IDs
  instead of rewriting them during candidate normalization.
- `design_depth_register.ts` normalizes scoped design-completeness status
  qualifiers such as `satisfied_for_steel_thread` to their base closed status.
- `design_depth_register.ts` normalizes standard cardinality aliases such as
  `1..1`, `0..1`, and `0..*` to the admitted base cardinality.
- `test_t122_feature_scope_closure.test.mjs` includes a B-084 regression where
  `bindTypes`, `operation:bindtypes`, `entity:MappingSource`, and
  `mapping-source` are accepted as equivalent only because identity was not
  further disambiguated.
- the same focused test file includes the live-shaped
  `flowAxis.verdict: "satisfied_for_steel_thread"` case, proving the scoped
  status alias does not create a false strict-parser failure.

Verification run for operator review:

- `npm run build:semantic && node --test test_env/tests/test_t122_feature_scope_closure.test.mjs test_env/tests/test_t116_design_depth_steel_thread.test.mjs` passed: 25/25.
- `npm run test:semantic` passed: 240/240.
- `npm run test:sandbox` passed: 15/15.

Stopped live archive for this finding:

- `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260507T023042351Z_pid93685`
  reached `derive_aggregate_domain_model_surface` and started same-edge retry
  after rejecting `flowAxis.verdict: "satisfied_for_steel_thread"`. That run is
  evidence for the ticket-level assurance correction, not RC proof.
- `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260507T025957794Z_pid37324`
  reached `derive_implementation_module_surface`; after same-edge repair added
  the missing typed attributes, F_D rejected
  `design_depth_register.moduleSchemaFragments[0].entities[0].attributes[0].cardinality`
  because the worker used `1..1` instead of the private enum spelling. That run
  is evidence for the B-086 full F_D sweep and the B-084 cardinality admission
  correction, not RC proof.

This does not close B-084. Remaining closure still requires fresh live
data_mapper evidence proving the lane advances past the observed false
operation-ID, scoped-status, and cardinality blockers without weakening strict
malformed/contradictory identity rejection.

## Superseded Closure Note - 2026-05-06

Closed under STDO.

Current proof:

- `npm run test:semantic` passed: 216/216.
- `npm run test:sandbox` passed: 15/15.
- Focused design-depth regressions passed inside
  `test_t122_feature_scope_closure.test.mjs`.
- The live T-109 PTY workspace
  `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260505T180726166Z_pid44582/workspace`
  advanced beyond the observed design-depth schema mismatch class and now
  blocks at `derive_release_depth_parity_surface`, not on
  `design_depth_register_invalid`.

# B-084: Admit Ambiguous Design-Depth Candidates Before Strict Closure

## STDO Triage

### First Missing Layer

Design.

The observed failure is not a transport issue and not merely a
prompt-compliance issue. The framework is applying a closure-grade strict
parser at an ambiguity-heavy design induction point.

At `derive_implementation_module_surface`, the worker produced useful
production-shaped design facts:

- selected module: `cdme-compiler`
- named entities
- typed attribute rows
- operations and requirement refs
- incomplete state semantics

The framework rejected the candidate before it could classify those facts
because the JSON shape used relational rows:

```text
moduleSchemaFragments[].entities = string[]
moduleSchemaFragments[].attributes = typed rows
```

while the parser required nested entities:

```text
moduleSchemaFragments[].entities[].attributes[]
```

Strict closure is still required. It is just being applied too early.

### Lawful Re-Entry

`design_reframe`.

The bug is at the boundary between F_P design construction and deterministic
carrier admission. The framework needs a lifecycle-aware ingest path before
strict closure.

## Root Cause

`design_depth_register` admission currently had only:

```text
admitted | rejected | not_required
```

That collapsed useful but incomplete design candidates into the same category
as malformed JSON or impossible structure.

The live retry sequence shows the same class repeatedly:

- `runId` at root was rejected as an unexpected field
- `includedModuleNames` at root was rejected as an unexpected field
- relational `moduleSchemaFragments[].attributes` was rejected as an
  unexpected field
- one attempt passed schema shape far enough to expose substantive requirement
  trace gaps

The worker was not failing to produce useful data. The framework was failing to
manage ambiguity before forcing detail.

## Target Flow

```text
F_P transform output
  -> raw structured candidate extraction
  -> tolerant candidate normalization
  -> ambiguity/partial classification
  -> admitted partial design-depth projection
  -> typed gap pressure for missing forced detail
  -> strict closure only when downstream safety requires exact detail
```

## Required Refactoring Points

1. Add partial admission status.

`SdlcDesignDepthRegisterAdmissionStatus` must distinguish a parsed but
incomplete candidate from a rejected malformed candidate.

2. Normalize safe relational candidates.

The ingest path should normalize:

- root metadata such as `runId` and `includedModuleNames` out of register law
- `entities: string[]`
- schema-level `attributes: [{ entity, attribute, type }]`
- operation rows missing only canonical `kind`

3. Preserve strict rejection for malformed or impossible candidates.

Malformed JSON, non-object registers, missing target identity, contradictory
ownership, and impossible attribute rows remain rejected.

4. Surface missing forced detail as gap pressure.

Missing state diagrams, missing entity attributes, empty operations, or partial
axis verdicts should become assurance reasons, not parser failures.

5. Archive raw and normalized candidate evidence.

Rejected and normalized candidates should be first-class forensic artifacts,
not recoverable only by manually extracting markdown fences.

6. Tighten worker prompt projection.

The prompt should show the canonical shape or a compact schema example so the
worker is steered toward the strict form without making strictness the first
ingest gate.

7. Add deterministic regression tests.

Tests must cover:

- live test69 relational shape normalizes and yields partial/open-gap pressure
- root metadata does not block admission
- missing state diagram remains an open gap
- malformed JSON remains rejected
- contradictory entity/attribute rows remain rejected or forced to ambiguity

8. Add live proof.

Rerun the test69 lane from `derive_implementation_module_surface`. The edge
must no longer stop on `design_depth_register_invalid` for the observed
relational candidate shape. It may still stop on substantive missing detail.

## Current Patch State

First patch applied on 2026-05-05:

- added `partial` design-depth admission status
- added safe normalization for relational module schema candidates
- added a T-122 regression fixture for the live relational shape

The patch is not yet proven by build/test/live rerun.

## Closure Criteria

- Build passes.
- Deterministic regression proves the test69 relational shape admits as partial
  or normalized open-gap, not `design_depth_register_invalid`.
- Malformed candidates still reject.
- Missing state/detail remains gap pressure.
- Raw/normalized candidate evidence is archived or otherwise forensic-friendly.
- Live test69 rerun advances past the observed schema mismatch or fails only on
  substantive design-depth gaps.

## Non-Closure Conditions

This ticket is not closed by:

- removing `parseClosedRecord` globally;
- accepting extra fields as closure truth;
- suppressing design-depth assurance reasons;
- changing only prompt text while ingest remains all-or-nothing;
- rerunning the same edge until the worker happens to emit the strict form;
- claiming closure without preserving final strict safety gates.


## 2026-05-05 Patch Note

The design-depth register admission path now persists forensic candidate sidecars when an invocation archive root is available:
- `design_depth_candidate_<n>_raw.json`
- `design_depth_candidate_<n>_normalized.json`

Admission evidence refs now include these sidecars for admitted, partial, and rejected candidates after candidate extraction. This closes the raw-vs-normalized observability gap without making worker result prose authoritative.

Status: patched pending proof. Closure still requires the focused admission regression and a live data-mapper lane that demonstrates partial/admitted design-depth evidence in the archive.

## 2026-05-05 Non-Live/Sandbox Proof

Passed from `build_tenants/typescript` after reconciling expected outcomes against B-084, T-116, T-122, and T-123 contract law:

```bash
npm run test:semantic
npm run test:sandbox
```

Observed proof:
- `test:semantic`: 187 passed, 0 failed.
- `test:sandbox`: 15 passed, 0 failed.
- B-084 relational/partial design-depth admission regression passed inside `test_t122_feature_scope_closure.test.mjs`.
- Steel-thread deferred breadth regression remained strict: worker-authored deferred verdict cannot block scoped closure.
- Deterministic data-mapper fixture workers were reconciled to emit typed design-depth registers for the scoped `cdme-compiler` module instead of weakening design-completeness expectations.

Status: patched with non-live and sandbox proof. Live data-mapper proof remains outstanding for full closure.

## 2026-05-06 Focused Verification

Passed from `build_tenants/typescript`:

```bash
npm run build:semantic
node --test test_env/tests/test_t122_feature_scope_closure.test.mjs
```

Observed proof:
- `build:semantic` passed.
- `test_t122_feature_scope_closure.test.mjs` passed: 8 tests, including the
  B-084 relational/partial design-depth admission regression.

Status: deterministic proof refreshed. Live data-mapper proof remains
outstanding for full closure.

## 2026-05-07 Generic-Builder Guard Refresh

Tightened the design-depth admission path to preserve generic-builder law:

- missing module identity is rejected instead of normalized to an invented
  module;
- tenant-specific `compiler.* -> cdme-compiler` inference is removed from the
  generic design-depth register;
- contradictory schema/entity module ownership is rejected;
- the strict parser and retry field-set surface now stay aligned on
  `designCompletenessVerdict.entity`, `.attribute`, and `.flow`.

Focused regressions added to
`build_tenants/typescript/test_env/tests/test_t122_feature_scope_closure.test.mjs`:

- missing module identity rejects;
- contradictory schema/entity ownership rejects;
- source guard prevents `unnamed-module` and tenant-specific compiler-module
  inference from returning.

Verification:

- `npm run build:semantic`
- focused T-122/B-084 suite:
  `node --test test_env/tests/test_t122_feature_scope_closure.test.mjs`
  -> 19/19 passed
- `npm run test:semantic` -> 239/239 passed
- `npm run test:sandbox` -> 15/15 passed

Status: deterministic and sandbox proof refreshed. Live data-mapper proof
remains outstanding for full closure.
