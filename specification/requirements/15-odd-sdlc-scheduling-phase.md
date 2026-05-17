# odd_sdlc Scheduling Phase Requirements

**Status**: Active
**Category**: Capability
**Carries Forward From**: None
**Authoring Design**: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SCHEDULING_PHASE.md`

This family defines graph-owned work-plan rows inside the composite
implementation and test design carriers.

### REQ-F-ODDSDLC-057 - odd_sdlc schedules realization before materialization

`odd_sdlc` shall publish schedule/work-plan rows before code and test
materialization edges execute.

Acceptance criteria:

- AC-1: `implementation_design_surface` carries implementation work-plan rows
  before `component_code_surface` and `code_surface`
- AC-2: `test_design_surface` carries test execution schedule rows before
  `component_test_surface`, `test_execution_surface`, and
  `test_run_archive_surface`
- AC-3: code, test, execution, and archive edges declare the composite design
  carrier that owns their relevant schedule rows as a source asset type
- AC-4: schedule rows can carry planned work packages, dependency order,
  phase gates, expected output surfaces, worker lanes, evidence checkpoints,
  open/done/blocked state, and re-entry conditions
- AC-5: scheduling remains part of a GTL graph-function asset and does not replace
  governance tickets or become hidden imperative orchestration state

### REQ-F-ODDSDLC-059 - schedule surfaces tranche realization by dependency graph

`odd_sdlc` shall express large realization and qualification work as
dependency-ordered tranches when implementation design, test design, or
capability ledgers expose a decomposable work graph.

Acceptance criteria:

- AC-1: a schedule row set can carry a `module_dependency_graph` over declared
  modules, source assets, test assets, and evidence assets
- AC-2: a schedule row set can carry ordered realization or test tranches with
  dependency reasons
- AC-3: each tranche can carry a local obligation ledger that maps requirement,
  design, module, source-asset, and evaluator obligations to that tranche
- AC-4: each tranche can carry open, done, blocked, and carry-forward states
  without hiding those states outside graph evidence
- AC-5: tranche selection remains a graph/product planning surface and does not
  replace ABG runtime vector closure, retry, replay, or continuation truth

### REQ-F-ODDSDLC-060 - prompt workers receive indexed authority pressure

`odd_sdlc` shall provide prompt-bearing workers with indexed authority and
targeted local obligation pressure rather than requiring every source document
and every obligation payload to be inlined into the worker prompt.

Acceptance criteria:

- AC-1: the archived handoff manifest remains the complete authority carrier
  for the edge
- AC-2: the worker prompt includes refs to the full manifest and traversal
  intent package
- AC-3: the prompt includes an authority index with keys, refs, categories,
  titles, tags, and digests
- AC-4: the prompt includes tranche keys and retrieval hints for the current
  traversal
- AC-5: the prompt inlines only the local obligation slice needed to start the
  traversal while preserving complete obligation truth by reference
