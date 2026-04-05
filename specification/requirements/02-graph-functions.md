# Graph-Function Requirements

**Family**: REQ-F-GFUNC-*
**Status**: Active
**Category**: Capability

This family defines graph functions as the primary constructive carrier in
`odd_method`.

### REQ-F-GFUNC-001 — Graph functions are the primary execution carrier

`odd_method` realizes outcome transitions through GTL graph functions interpreted by
ABG.

**Acceptance Criteria**:
- AC-1: every operative constructive step is carried by one named graph
  function or one lawful graph-function composition
- AC-2: graph-function execution remains subordinate to GTL contracts and ABG
  interpretation law
- AC-3: `odd_method` does not introduce a rival execution primitive for constructive
  work

### REQ-F-GFUNC-002 — Work vectors are productized views over graph functions

`odd_method` may publish work vectors, but a work vector is the product/method view
over one graph function or one lawful graph-function composition rather than a
separate executor.

**Acceptance Criteria**:
- AC-1: a published work vector records the backing graph function or graph
  function composition it productizes
- AC-2: work vectors may add policy, selection meaning, and closure
  expectations without redefining the underlying constructive carrier
- AC-3: `odd_method` defines no separate work-vector runtime substrate

### REQ-F-GFUNC-003 — Composition and recursion are first-class adopted capabilities

`odd_method` adopts GTL graph-function composition and recursion as live capability
surfaces rather than treating graph functions as single-edge wrappers only.

**Acceptance Criteria**:
- AC-1: `odd_method` may publish graph functions realized by lawful composition
- AC-2: `odd_method` may publish recursive graph functions with explicit termination
  and foldback contracts
- AC-3: recursive or composed graph functions preserve an inspectable outer
  contract and publishable lineage

### REQ-F-GFUNC-004 — The graph-function catalog is explicit and machine-readable

The live `odd_method` line publishes its operative graph-function catalog as an
inspectable machine-readable surface.

**Acceptance Criteria**:
- AC-1: the published catalog records each graph function name, inputs,
  outputs, and intent
- AC-2: catalog publication does not require prompt text or discussion history
- AC-3: the catalog distinguishes edge-realization graph functions from
  reusable higher-order or library graph functions
