# Forensic STDO Review: odd_sdlc TypeScript Tenant T-025 Through T-041

**Author**: Codex
**Date**: 2026-04-26T16:17:28Z
**Scope**: `odd_sdlc` TypeScript tenant tickets, design/code/test assets, and qualification evidence through the current `T-041` boundary.
**Method Basis**: STDO = `SPEC_METHOD.md`, `TICKET_METHOD.md`, `DESIGN_MODULE_METHOD.md`, `ODD_METHOD.md`.

## Verdict

The TypeScript tenant is coherent as a bounded ODD-native package RC through
`T-040`.

It is not a full operational Python replacement in this checkout. `T-041`
remains backlog and explicitly owns the missing CLI/install/normalize/live
`F_P`/release-cut proof surfaces.

The green semantic lane is useful evidence, but it misses three release-relevant
defects in closure, runtime-return binding, and worker attachment admission.
Those defects should be ticketed before claiming a stronger RC than the current
bounded package claim.

## Findings

### P0 - `T-041` is not complete, so "through T-041" is not a supported claim

Evidence:

- `.ai-workspace/tickets/backlog/T-041-realize-typescript-full-operational-python-replacement-rc-lane.md:6` has `status: backlog`.
- `.ai-workspace/tickets/backlog/T-041-realize-typescript-full-operational-python-replacement-rc-lane.md:27-39` requires unit, harnessed sandbox, live `F_P`, installed-workspace, release-cut, and Python comparison evidence.
- `.ai-workspace/tickets/backlog/T-041-realize-typescript-full-operational-python-replacement-rc-lane.md:58-66` states the ticket is not closable in the bounded RC pass and that the current tenant has no `cli/`, side-effecting install/normalize adapter, live external `F_P` data_mapper lane, or release-cut binary surface.
- `build_tenants/typescript/README.md:8-14` correctly limits the current status to a bounded RC-qualified package surface and disclaims Python replacement.

Impact:

Any release note, operator statement, or handoff saying the TypeScript tenant is
complete through `T-041` would outrun ticket authority and product evidence.

Required correction:

Keep the current claim as "bounded ODD-native TypeScript package RC through
`T-040`." Open or keep open `T-041` for the full operational replacement lane.

### P1 - Requirement closure can falsely combine proof from one asset with satisfied contract state from another

Evidence:

- `build_tenants/typescript/code/src/projection/requirement_closure.ts:255-270` computes `hasBehavioralEvidence` across all proofs for a requirement and `hasSatisfiedGeneratedAsset` across all lineage entries for that requirement, then marks the requirement fulfilled when both booleans are true.
- `build_tenants/typescript/code/src/projection/requirement_closure.ts:260-262` does not require the same lineage entry to carry both behavioral/runtime proof and a satisfied generated-asset contract.
- `build_tenants/typescript/test_env/tests/test_t035_traceability_requirement_closure.test.mjs:160-217` proves trace-only and missing cases, but does not prove the mixed-entry negative case.

Forensic probe:

I constructed a local Node probe with two lineage entries for the same
requirement:

- asset A had `behavioral_test` proof but `generatedAssetContractSatisfied=false`
- asset B had only `trace_tag` proof but `generatedAssetContractSatisfied=true`

The closure register marked the requirement `fulfilled`.

Impact:

This violates the ticket's core closure law: traceability must not be enough,
and behavioral proof must justify the same generated/adopted element that is
being counted as contract-satisfied. In a larger generated project this could
hide a real implementation gap behind a sibling trace-only asset.

Required correction:

Change closure evaluation to require at least one lineage entry for the
requirement where:

- `generatedAssetContractSatisfied === true`
- proof for that same entry includes `behavioral_test` or `runtime_result`

Add a negative test where behavioral proof and satisfied contract are split
across different assets and the requirement remains unresolved.

### P1 - Runtime-return observation accepts foreign command results

Evidence:

- `build_tenants/typescript/code/src/operational/operational.ts:107-127` creates a runtime-return observation from `command` and `result` without checking `result.commandId === command.commandId`.
- The same function does not check that `command.lane === "runtime_return"` before feeding `derive_runtime_observation_surface` and `derive_retrofit_plan_surface`.
- `build_tenants/typescript/code/src/domain/operational_projection.ts:25-30` already has the correct command/result binding guard for operational state projection.
- `build_tenants/typescript/test_env/tests/test_t037_operational_transition_runtime_return.test.mjs:73-103` proves `advanceSdlcOperationalTransitionOnce` rejects foreign results, but `test_t037...:106-137` does not test `observeSdlcRuntimeReturn` against a foreign result.

Forensic probe:

I passed `observeSdlcRuntimeReturn` a command with `commandId=command://a` and
a result with `commandId=command://b`. It returned a `returned` observation for
`command://a` using result `result://b`.

Impact:

Runtime-return evidence can be attributed to the wrong command and then fed into
retrofit graph functions. That is an evidence-binding defect, not just a test
gap.

Required correction:

Make `observeSdlcRuntimeReturn` fail closed unless:

- `input.command.lane === "runtime_return"`
- `input.result.commandId === input.command.commandId`

Add negative tests for both a foreign result and a non-runtime-return command.

### P1 - Public start treats an empty worker transport as attached

Evidence:

- `build_tenants/typescript/code/src/start/public_start.ts:121-130` sets
  `status: "attached"` whenever `transportContract !== null`.
- The function does not parse or trim `transportContract`.
- `build_tenants/typescript/test_env/tests/test_t033_public_start.test.mjs:59-79` covers `null`, and `test_t033...:81-103` covers a valid transport. It does not cover `""` or whitespace.

Forensic probe:

`projectSdlcWorkerAttachment({ transportContract: "" })` returned:

```json
{"kind":"sdlc_worker_attachment","status":"attached","transportContract":"","blockingReason":null}
```

Impact:

An `F_P` start can pass the tenant's worker-readiness gate with no real transport
contract. That weakens the T-033 claim that missing worker/capability truth
blocks before dispatch.

Required correction:

Admit worker attachment through a nullable non-empty transport contract parser.
Reject or block empty and whitespace-only transports. Add focused negative tests
for `""` and `"   "`.

### P2 - Source-input digest is not release-grade evidence identity

Evidence:

- `build_tenants/typescript/code/src/workspace/source_input.ts:21-28` uses a
  32-bit FNV-1a digest and labels it `fnv1a32`.
- `build_tenants/typescript/code/src/workspace/bootstrap_lineage.ts:35-40` carries
  that digest into imported requirement authority.

Impact:

This is adequate for a deterministic toy semantic lane, but weak for forensic
lineage, archive comparison, or release-cut evidence. `T-041` requires archive
and Python comparison evidence; those surfaces should not rely on 32-bit
identity.

Required correction:

Promote source and evidence identity to SHA-256 or an ABI-owned digest carrier
before T-041. Keep `fnv1a32` only as a non-authoritative quick fingerprint if it
is still useful.

### P2 - RC qualification report has a stale ticket path

Evidence:

- `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_RC_QUALIFICATION_REPORT.md:6`
  derives from `.ai-workspace/tickets/backlog/T-038...`.
- The actual ticket is
  `.ai-workspace/tickets/completed/T-038-qualify-odd-sdlc-typescript-rc-against-python-functionality-and-odd-scenarios.md`.

Impact:

Small but real traceability drift in the shareable RC report. Under STDO, a
qualification report should point at the authoritative ticket location.

Required correction:

Update the report path to the completed ticket.

## Ticket-To-Asset Review

### T-025 Product Reprice

Status: Pass.

The product, goals, requirement family, and tenant registry correctly open
`odd_sdlc.TS` as an ODD-native TypeScript build line. Python is discovery
evidence, not architecture authority. ABIogenesis TypeScript is substrate proof,
not SDLC completion.

### T-026 Design Pack

Status: Pass with one open follow-up.

The design pack names the correct module families: graph, runtime substrate,
domain carriers, workspace ingress, projection, start, hooks, triage,
operational return, qualification, and future CLI. The future CLI/install
surfaces are designed but not realized; that is correctly owned by `T-041`.

### T-027 Package Scaffold

Status: Pass.

Strict TypeScript, lint, build, export, and test harness exist. `test:semantic`
and `lint:semantic` passed during review.

### T-028 ABIogenesis Substrate Binding

Status: Pass.

The tenant consumes ABIogenesis through declared public carriers and does not
copy ABG runtime event or next-vector logic.

### T-029 Domain Carriers

Status: Pass.

Domain carriers are closed and immutable enough for the bounded tenant claim.
Operational command/result/projection families remain separate.

### T-030 Graph Catalog And Module

Status: Pass.

Graph functions are the primary program surface. Module jobs target published
executive graph functions. This satisfies the ODD constructive carrier rule for
the bounded package.

### T-031 Workspace Ingress

Status: Pass for semantic ingress; not enough for T-041.

Ingress is pure and typed. It does not mutate workspaces, which is correct for
the bounded claim. Side-effecting install/normalize remains `T-041`.

### T-032 Query/Gaps Projection

Status: Pass.

Projection-source coherence is now enforced by structural comparison against the
admitted GTL module before publishing query-domain read models.

### T-033 Public Start

Status: Needs correction.

The one-handoff public start shape is right, and ABG owns advancement. The
worker-attachment carrier is too weak because empty transport strings count as
attached.

### T-034 Hook Set

Status: Pass.

Hook contracts separate F_D preflight/postflight from F_P construction and carry
generated-asset authority. Trace-only shells are blocked by generated-asset
contract failure.

### T-035 Traceability And Requirement Closure

Status: Needs correction.

The lane correctly rejects simple trace-only shells, but it does not reject the
mixed-entry case where behavioral proof and satisfied generated-asset contract
state are split across different assets.

### T-036 Gap Triage

Status: Pass.

Observation, classification, route binding, repricing proposal, ticket route,
and loopback retirement are separate carriers. Triage proposes ticket work under
`TICKET_METHOD` and does not write process state.

### T-037 Operational Transition And Runtime Return

Status: Needs correction.

Command/result/projection separation is correct in the operational state
projection. Runtime-return observation needs the same command/result binding
guard and a lane guard.

### T-038 RC Qualification

Status: Pass only for bounded package RC.

The report correctly limits the claim and keeps T-041 open. It should not be
used as full operational parity evidence. The report path to T-038 should be
fixed.

### T-039 Query-Domain Structural Drift

Status: Pass.

This is the strongest corrective ticket in the wave. It directly implements the
ODD projection-source coherence rule: same-name graph functions are not enough.

### T-040 Fixture Portability

Status: Pass.

The required semantic lane no longer depends on Jim's local
`data_mapper.template`. The external fixture is classified as optional reference
comparison and requires explicit `ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT`.

### T-041 Full Operational Python-Replacement RC Lane

Status: Open backlog.

No full replacement closure exists in this checkout. The missing surfaces are
exactly the ticket's stated scope: CLI/install adapter, installed-workspace
normalization, live external `F_P` data_mapper traversal, release-cut packaging,
run archive, and Python parity postmortem.

## Verification Run

Commands run from `build_tenants/typescript`:

```text
npm run test:semantic
```

Result: 50 tests passed.

```text
npm run lint:semantic
```

Result: passed with zero warnings.

```text
ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT=/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template npm run test:reference:data-mapper
```

Result: 1 reference test passed.

Additional forensic probes were run for:

- empty worker transport admission
- foreign runtime-return result admission
- mixed requirement-closure evidence across separate assets

Those probes exposed the P1 findings above.

## Recommended Follow-Up Tickets

1. `T-042-TS` - Close requirement-closure fulfillment over same-entry behavioral proof and satisfied generated-asset contract.
2. `T-043-TS` - Bind runtime-return observation to runtime-return command identity and lane.
3. `T-044-TS` - Harden worker attachment admission for empty and whitespace transport contracts.
4. `T-045-TS` - Promote source/evidence digest identity to release-grade SHA-256 or ABI-owned digest before T-041.
5. `T-046-TS` - Repair RC qualification report trace path and declare durable evidence archive expectations for the next RC review.

## Confidence Assessment

The method is working in the important sense: the tickets separated bounded RC
from full operational replacement, corrective tickets T-039/T-040 caught real
proof drift, and the current package does not falsely claim Python replacement.

The current weak points are not architectural collapse. They are missing
negative proofs at carrier boundaries where evidence can be falsely combined or
misbound. Those are exactly the defects STDO is supposed to surface before the
release claim widens.

Do not advance the claim beyond bounded package RC until the P1 findings are
fixed and T-041 is opened with live operational evidence.
