# odd_sdlc TypeScript ABIogenesis Substrate Contract

**Status**: Active
**Date**: 2026-04-26
**Authority**: T-028

## Claim

`odd_sdlc.TS` consumes ABIogenesis TypeScript as runtime substrate. It does not
own GTL carrier admission, ABG execution basis law, runtime event families,
replay projection, iteration selection, advancement transitions, or traversal
structure probes.

## Binding

| Surface | Binding |
| --- | --- |
| Package | `@abiogenesis/typescript-tenant` |
| Version | `3.5.0-rc.1` |
| Dependency form | local source product dependency |
| odd_sdlc role | domain product over ABIogenesis substrate |
| ABIogenesis role | GTL/ABG carrier and runtime truth authority |

## Adapter Boundary

The TypeScript tenant may construct SDLC-owned graph functions and modules, then
admit them through ABIogenesis public carriers:

```text
SDLC graph function -> ABIogenesis Module -> ABIogenesis ExecutionBasis
ExecutionBasis + RuntimeEvent replay -> ABIogenesis projection and transition
```

The TypeScript tenant must not:

- define local runtime event families
- choose the next vector from local controller state
- treat local orchestration state as runtime truth
- copy ABG projection or iteration mechanics
- fork GTL carrier admission
- own framework-level agent process execution, Claude stream-json parsing, or
  PTY terminal execution semantics

## Initial Proof Basis

The first proof graph function is intentionally small:

```text
ODD_SDLC_SUBSTRATE_PROBE:
  SdlcWorksite -> SdlcWorkReport
```

It validates that SDLC-owned type names can be carried through GTL and admitted
into one ABI `ExecutionBasis`.

## Source Assumptions

The adapter relies on ABIogenesis TypeScript evidence:

- `T-060`: missing compute basis fails closed
- `T-065`: traversal structure probe exposes deterministic diagnostic evidence
- `T-066`: ABG internal control loop owns iteration sufficiency

These assumptions are dependencies, not copied law.

## ABG 3.5 Process Callout Substrate

As of ABG `3.5.0-rc.1`, worker process execution is also substrate-owned.

`odd_sdlc.TS` admits SDLC worker bindings such as `process://claude`, derives
SDLC handoff manifests and domain postflight projections, then lowers the
process call to ABG traced actor/worker callout semantics.

ABG owns:

- `runAgentActorWorkerCallout`
- `TracedProcessOutcome`
- `local-spawn` and `pty-terminal` executor profiles
- Claude stream-json parsing
- api-retry, tool-call, and structured-parse observations
- trace archive paths
- hard timeout, inactivity timeout, executor-unavailable, launch-failed, and
  lost-terminal process outcomes

`odd_sdlc.TS` may preserve worker archive filenames as compatibility
read-models, but their process facts are projections over ABG trace truth.
