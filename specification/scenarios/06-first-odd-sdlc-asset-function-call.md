# Scenario Bundle - First odd_sdlc Asset Function Call

**Validates**: REQ-F-ASSETMODEL-001, REQ-F-ASSETMODEL-002, REQ-F-ASSETMODEL-003, REQ-F-ASSETMODEL-004, REQ-F-ASSETMODEL-005, REQ-F-ODDSDLC-001, REQ-F-ODDSDLC-002, REQ-F-ODDSDLC-003, REQ-F-ODDSDLC-004, REQ-F-ODDSDLC-005

**Purpose**: Prove that `odd_sdlc` can bind workspace assets by URI, publish
the first asset-function catalog, run one graph-function path through ABG, and
audit the result from substrate fact truth.

## Scenario

Create or use a bounded workspace with the bootstrap specification surfaces,
bind those surfaces into the first `odd_sdlc` asset nodes, then run the first
declared graph-function call through the tenant’s app-owned entry surface in an
installed development environment.

## Significant Paths

- publication path: the tenant publishes a GTL module with the first
  `odd_sdlc` function catalog
- binding path: workspace assets are inventoried and classified by URI and
  asset type
- gaps path: the tenant can project the first runtime gaps over the published
  function catalog
- start path: the first graph-function call opens ABG runtime truth
- query path: the tenant exposes a domain query library that a UI can compose
  with ABG runtime projections
- audit path: the proving lane reads the resulting event log and verifies the
  graph-call and run lifecycle from substrate facts

## Expected Outcomes

1. the first `odd_sdlc` asset catalog is inspectable and machine-readable
2. assets are bound into typed asset nodes rather than treated as one hidden
   project graph
3. `odd_sdlc` executes through GTL and ABG rather than a product-local
   imperative controller
4. the proving lane explains the result from emitted runtime facts
5. the tenant exposes domain query logic without duplicating the ABG runtime
   model that the UI should already understand directly
