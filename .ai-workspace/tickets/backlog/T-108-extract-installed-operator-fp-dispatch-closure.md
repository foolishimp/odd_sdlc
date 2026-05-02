# T-108 Extract Installed Operator F_P Dispatch Closure

Status: backlog

Type: technical debt

Change class: realization_refactor

Created: 2026-05-01

Updated: 2026-05-01

Build tenant: typescript

Related:

- T-102 Define Typed F_P Function Stages And ABG-Owned Admission Flow
- T-107 Split Operator Handoff Into Prime Domain Modules
- B-076 Consolidate Recurring Shared Helpers Under Shared Domain Utilities

## Intake

Claude DMM review identified that `installed_operator.ts` still keeps a large
F_P dispatch closure as the local coordination center for semantic decisions,
worker execution, archive writes, postflight evaluation, gap dossier handling,
and assurance projection.

The implementation direction may be behaviorally valid, but STDO closure should
not treat a mixed semantic/effect closure as the durable module boundary.

## Problem

The installed operator's F_P dispatch path currently interleaves:

- worker process execution
- worker result admission
- legacy report carrier handling
- archive and evidence file writes
- postflight verdict construction
- gap dossier construction
- assurance archive projection
- ABG dispatch outcome construction

That makes the dispatch closure both a semantic edge and an effect shell. It
also keeps part of T-102's typed F_P architecture debt hidden inside a runtime
callback.

## Target

Extract the installed F_P dispatch path into a typed edge runner, such as:

```text
runFpDispatchEdge(input): SdlcInstalledEdgeOutcome
```

The exact name may differ, but the resulting boundary must make these roles
explicit:

- the plugin dispatch callback adapts ABG runtime invocation to the typed edge
- semantic steps return typed carrier data
- archive/evidence writers consume typed carrier data
- postflight and gap dossier evaluation are not buried inside an anonymous
  dispatch closure

## Acceptance

- `installed_operator.ts` no longer contains the full F_P dispatch algorithm as
  one inline callback.
- The extracted edge runner has a typed input and typed output carrier.
- Semantic decision functions and effectful archive writes are separated by
  module or by clear function boundary.
- Existing runtime behavior is preserved.
- Existing semantic lint and semantic test suites pass.
- The work does not reintroduce a tenant-owned traversal loop; ABG remains the
  owner of graph iteration.

## Non-Closure

- Mechanical extraction that keeps one mixed semantic/effect center under a new
  filename.
- Treating the current legacy worker-result report bridge as the final T-102
  architecture.
- Moving ABG traversal ownership back into the installed operator.
- Broad unrelated refactors of worker process transport, helper utilities, or
  handoff module splits beyond what this edge extraction requires.

