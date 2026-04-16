# odd_sdlc Declarative Operational State Transition Requirements

**Family**: REQ-F-ODDSDLC-*
**Status**: Active
**Category**: Capability

This family defines the operational-transition model for the active `odd_sdlc`
software-domain package.

It makes build, test execution, deployment, and runtime return explicit as
governed operational transitions rather than ambient commands or loosely
attached lifecycle documents.

### REQ-F-ODDSDLC-038 — odd_sdlc separates operational command surfaces, admitted result surfaces, and current state projections

`odd_sdlc` models operational work through explicit command-side transition
surfaces, admitted result/evidence surfaces, and current projected state
surfaces.

**Acceptance Criteria**:
- AC-1: build, test execution, deployment, and runtime-return lanes distinguish
  at least one command-side transition surface from at least one admitted
  result/evidence surface or explicit pending/failure state
- AC-2: current executional or operational state may only be projected from
  admitted governed result/evidence plus ABG runtime fact truth, not from
  intended/requested state alone
- AC-3: command-side transition surfaces declare the required substrate binding,
  capability contract, and returned-evidence expectation explicitly
- AC-4: command-side, result-side, and current-state surfaces remain typed,
  queryable, and distinct rather than collapsing into one ambiguous operational
  document

### REQ-F-ODDSDLC-039 — odd_sdlc operational transitions advance as event-driven sagas over ABG truth

`odd_sdlc` advances operational transitions as explicit event-driven sagas over
ABG event truth rather than as hidden side effects.

**Acceptance Criteria**:
- AC-1: operational transitions expose explicit prepared, dispatched,
  result-admitted, failed, reopened, deferred, or equivalent bounded progress
  states
- AC-2: ABG remains authoritative for event, continuation, and correlation
  truth while `odd_sdlc` projects domain-facing operational read models on top
- AC-3: missing returned evidence, failed dispatch, rejection, or unresolved
  external completion keeps the enclosing operational lane open and queryable
  rather than silently claiming success
- AC-4: retry, reopen, rollback/compensation, or pending-external-completion
  semantics remain explicit domain states rather than operator folklore or
  ambient logs
