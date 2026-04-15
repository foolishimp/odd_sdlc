# Scenario Bundle - odd_service Orchestration Plane

**Validates**: REQ-F-ODDSVC-001, REQ-F-ODDSVC-002, REQ-F-ODDSVC-003, REQ-F-ODDSVC-004, REQ-F-ODDSVC-005, REQ-F-ODDSVC-006, REQ-F-ODDSVC-007, REQ-F-ODDSVC-008, REQ-F-ODDSVC-009

**Purpose**: Prove that `odd_service` can incubate as an `odd_sdlc` service
line that wraps the existing local GTL/ABG + `odd_sdlc` execution path, owns
session and worker orchestration without becoming a rival runtime, and exposes
one client-facing coordination surface that both CLI and browser clients can
consume.

## Scenario

Create or use a bounded workspace governed by `odd_sdlc`, start one run through
the local execution path, then interpose `odd_service` as the orchestration
plane around that same run so multiple client surfaces and named workers can
coordinate over one ABG runtime truth:

- workspace-scoped start through the existing installed runtime contract
- run-scoped observe, gaps, and step surfaces
- worker registration and contract-driven routing
- gate approval from one client while another client continues observation
- consensus as the first higher-order harness consumer
- optional remote transport only when snapshot provenance and ingest
  verification are present

## Significant Paths

- incubation path: `odd_service` is realized as its own tenant line under
  `build_tenants/odd_service/` while still incubating inside `odd_sdlc`
- authority path: the service owns orchestration and worker-session state while
  ABG remains authoritative for runs, graph calls, convergence, and provenance
- wrapper path: the service drives the same local engine/runtime contract used
  by direct CLI execution rather than defining a second traversal loop
- client path: CLI and browser clients talk to one service API instead of
  competing browser-local and terminal-local session owners
- routing path: worker choice for higher-order harnesses such as consensus is
  driven by declared domain or policy contract rather than ad hoc UI rules
- history path: worker conversation history remains service observation state
  and does not outrank ABG runtime truth
- remote path: when remote execution exists, workspace snapshot identity is
  recorded at dispatch and verified or failed closed on ingest
- odd_manager path: browser observation and gate handling move to a service
  client model while `gterm` remains an operator affordance rather than the
  owner of orchestration state

## Expected Outcomes

1. `odd_service` is a distinct product line inside `odd_sdlc`, not a hidden
   utility buried inside `odd_sdlc` or `odd_manager`
2. the service can coordinate one run without redefining runtime truth already
   owned by ABG
3. the same run can be started from one client surface and observed or resumed
   from another without split authority
4. named workers can be registered and routed by contract over ordinary GTL,
   ABG, and `odd_sdlc` execution law
5. consensus becomes the first serious proving lane for the service because it
   needs named workers, async dispatch, resumed observation, and policy-driven
   routing
6. remote transport is admitted only through explicit snapshot provenance and
   fail-closed ingest verification
