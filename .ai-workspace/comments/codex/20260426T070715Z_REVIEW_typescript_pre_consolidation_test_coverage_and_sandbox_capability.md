# Review: TypeScript Pre-Consolidation Test Coverage And Sandbox Capability

**Author**: Codex
**Date**: 2026-04-26T07:07:15Z
**Scope**: `odd_sdlc/build_tenants/typescript`
**Purpose**: Confirm the proof surface before starting consolidation refactor work.

## Verdict

Operator reprice on 2026-04-26: the TypeScript tenant must not begin
consolidation refactor work until a dedicated sandbox proof lane closes.

The TypeScript tenant had enough semantic coverage to describe where a bounded
consolidation refactor would be technically possible, but that refactor was not
authorized until T-047 closed.

It does not yet have enough sandbox capability to claim operational replacement,
installed-workspace parity, live `F_P` generation, or release-cut readiness.

The previously identified safe refactor boundary is now a future refactor
boundary, gated by T-047:

```text
carrier/module/projection/hook consolidation
with no widened product claim
after T-047 sandbox proof closes
and with test:semantic + lint + test:sandbox + data_mapper reference run after each slice
```

The unsafe refactor boundary is:

```text
CLI/install/live worker/release-cut consolidation
or any claim that TS replaces Python operationally
```

The wider operational replacement claim remains `T-041` scope.

The pre-refactor sandbox proof lane is closed under:

```text
.ai-workspace/tickets/completed/T-047-realize-typescript-pre-refactor-sandbox-proof-lane.md
```

## Verified Commands

Current verification on 2026-04-26:

```text
npm run test:semantic
  pass: 54 tests

npm run lint:semantic
  pass

ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT=/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template npm run test:reference:data-mapper
  pass: 1 reference test
```

## Current Test Surface

Required semantic lane:

```text
test:t027 scaffold
test:t028 ABIogenesis substrate binding
test:t029 domain carriers
test:t030 graph catalog/module
test:t031 workspace ingress/bootstrap lineage
test:t032 query/gap projection
test:t033 public start
test:t034 constructor/evaluator hooks
test:t035 traceability/requirement closure
test:t036 gap triage route
test:t037 operational transition/runtime return
test:t038 composed harnessed sandbox
test:t039 query-domain structural drift
test:t040 fixture portability
T-042..T-046 forensic remediation checks embedded in T031/T033/T035/T037/T038
```

Reference lane:

```text
test:reference:data-mapper
```

This reads the external full `data_mapper.template` fixture and proves imported
requirement authority and lineage. It is explicitly optional reference evidence,
not required semantic closure.

## What Is Covered Well

Strong coverage exists for:

- strict package build and exports
- ABG dependency/admission boundary
- typed domain carriers and closed admission
- graph-function catalog and GTL module publication
- jobs targeting only published graph functions
- pure workspace ingress and SHA-256 source identity
- imported requirement authority and bootstrap lineage
- query/gap/dossier/span projections
- structural drift rejection for same-name graph-function changes
- public start admission and stale target blocking
- `F_P` worker attachment gate
- hook contract catalog, preflight, postflight, work report admission
- graph-function authority for generated assets
- requirement lineage and closure, including trace-only and split-proof negatives
- gap observation/classification/route/repricing/ticket-route separation
- operational command/result/projection separation
- runtime-return command identity/lane binding
- composed harnessed path from ingress to runtime-return observation

## Sandbox Capability

Current TS sandbox capability is:

```text
one composed harnessed sandbox inside test_t038_rc_qualification.test.mjs
```

It walks:

```text
ingress
-> query/start
-> public ABG handoff
-> hook evidence
-> requirement closure
-> triage route
-> operational build result admission
-> runtime-return observation
```

This is valuable for consolidation refactors because it exercises multiple
module seams together.

Current TS sandbox limitations:

- no installed-workspace sandbox directory is created
- no `test_runs/` archive framework exists in TS
- no CLI-driven sandbox exists
- no side-effecting install/normalize adapter exists
- no live external `F_P` worker lane exists
- no real generated `data_mapper` asset run exists in TS
- no postmortem archive comparison against Python exists
- no release-cut packaging/binary lane exists

So the current sandbox is a harnessed in-process scenario, not an installed or
live operational sandbox.

## Refactor Readiness

Safe to start:

- split monolithic files without changing public behavior
- move carrier/admission/evaluator helpers into smaller modules
- convert hard-coded policy mappings into declared catalog data
- add reusable graph-function library surfaces where behavior is already
  covered by semantic tests
- preserve public exports and package command grammar

Not safe to claim yet:

- operational parity with Python
- live `data_mapper` generation
- installed product behavior
- CLI behavior
- release candidate replacement of Python

## Required Guardrails For Consolidation

Before each consolidation slice:

- identify the ticket/design authority
- state whether behavior changes or only module structure changes
- keep the current public package exports stable unless a ticket says otherwise

After each consolidation slice:

```text
npm run test:semantic
npm run lint:semantic
npm run test:t038
ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT=/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template npm run test:reference:data-mapper
```

For high-risk slices touching `hooks/`, `projection/`, `graph/`, or `start/`,
also run the focused ticket lane before the full suite:

```text
npm run test:t030
npm run test:t032
npm run test:t033
npm run test:t034
npm run test:t035
npm run test:t038
```

## Recommendation

T-047 is now the sandbox gate for consolidation. Bounded consolidation may begin
only while preserving the same proof guardrails.

After T-047 closes, the first consolidation target should be `hooks/hook_set.ts`,
with the existing T-034/T-035/T-038 lanes plus the new sandbox lane guarding the
change. The second target should be policy mapping extraction into declarative
catalog data.

Do not start CLI/install/live sandbox work under the same refactor. That is a
different product claim and belongs under `T-041`.
