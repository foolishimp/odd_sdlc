# Graph-Function Requirements

**Family**: REQ-F-GFUNC-*
**Status**: Active
**Category**: Capability
**Carries Forward From**: None
**Authoring Design**: None

This family defines graph functions as the primary constructive carrier in
`odd_sdlc`.

### REQ-F-GFUNC-001 — Graph functions are the primary execution carrier

`odd_sdlc` realizes outcome transitions through GTL graph functions interpreted by
ABG.

**Acceptance Criteria**:
- AC-1: every operative constructive step is carried by one named graph
  function or one lawful graph-function composition
- AC-2: graph-function execution remains subordinate to GTL contracts and ABG
  interpretation law
- AC-3: `odd_sdlc` does not introduce a rival execution primitive for constructive
  work

### REQ-F-GFUNC-002 — Work vectors are productized views over graph functions

`odd_sdlc` may publish work vectors, but a work vector is the product/method view
over one graph function or one lawful graph-function composition rather than a
separate executor.

**Acceptance Criteria**:
- AC-1: a published work vector records the backing graph function or graph
  function composition it productizes
- AC-2: work vectors may add policy, selection meaning, and closure
  expectations without redefining the underlying constructive carrier
- AC-3: `odd_sdlc` defines no separate work-vector runtime substrate

### REQ-F-GFUNC-003 — Composition and recursion are first-class adopted capabilities

`odd_sdlc` adopts GTL graph-function composition and recursion as live capability
surfaces rather than treating graph functions as single-edge wrappers only.

**Acceptance Criteria**:
- AC-1: `odd_sdlc` may publish graph functions realized by lawful composition
- AC-2: `odd_sdlc` may publish recursive graph functions with explicit termination
  and foldback contracts
- AC-3: recursive or composed graph functions preserve an inspectable outer
  contract and publishable lineage

### REQ-F-GFUNC-004 — The graph-function catalog is explicit and machine-readable

The live `odd_sdlc` line publishes its operative graph-function catalog as an
inspectable machine-readable surface.

**Acceptance Criteria**:
- AC-1: the published catalog records each graph function name, inputs,
  outputs, and intent
- AC-2: catalog publication does not require prompt text or discussion history
- AC-3: the catalog distinguishes edge-realization graph functions from
  reusable higher-order or library graph functions

### REQ-F-GFUNC-005 — Higher-order graph-function harnesses remain ordinary GTL carriers

`odd_sdlc` may publish reusable higher-order harnesses, but a higher-order
graph function remains an ordinary GTL carrier with an explicit outer contract.
Its internal topology may inject domain-specific review, reduction, promotion,
or apply stages, yet the caller consumes only the declared input/output asset
contract and the published higher-order policy/binding surface.

**Acceptance Criteria**:
- AC-1: a published higher-order graph function records its stable outer
  subject/review/decision/reviewed contract without requiring the caller to
  inspect its internal vectors
- AC-2: injected stage functions and policy are published as graph-function
  declarations or catalog-visible metadata rather than hidden in engine code or
  prompt folklore
- AC-3: a higher-order harness may itself be composed or recursively chained as
  one graph function inside larger GTL carriers
- AC-4: reusable higher-order graph-function plugins and host-specific bindings
  are distinguished explicitly in the catalog and design surfaces rather than
  being conflated into one product-local capability name
