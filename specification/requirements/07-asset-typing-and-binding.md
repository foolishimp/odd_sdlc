# Asset Typing And Binding Requirements

**Family**: REQ-F-ASSETMODEL-*
**Status**: Active
**Category**: Capability
**Carries Forward From**: None
**Authoring Design**: None

This family defines the first live ODD asset model.

### REQ-F-ASSETMODEL-001 — Assets are identified by URI

`odd_sdlc` treats assets as first-class domain objects addressed by URI.

**Acceptance Criteria**:
- AC-1: every asset has stable URI identity
- AC-2: the first live fulfillment surface supports `file://`
- AC-3: unsupported URI schemes fail closed rather than degrading to ambient
  path handling

### REQ-F-ASSETMODEL-002 — Asset types are semantic carriers

`AssetType` is more than a label. It carries domain role and evaluation
meaning.

**Acceptance Criteria**:
- AC-1: the live asset model records a declared type for each asset
- AC-2: an asset type may define deterministic evaluation, probabilistic gap
  evaluation, and probabilistic descriptive framing
- AC-3: type meaning does not depend on one hidden global controller prompt
- AC-4: asset types are designed as reusable semantic library surfaces rather
  than as one flat project-local enum
- AC-5: the live library may expose generic reusable asset definitions together
  with sharper local specializations for one concrete toy or domain slice

### REQ-F-ASSETMODEL-003 — Concrete assets bind into typed asset nodes

Function calls operate over typed asset nodes rather than over one hidden
project-global graph.

**Acceptance Criteria**:
- AC-1: the live model includes typed asset nodes
- AC-2: concrete assets or asset collections bind into those nodes explicitly
- AC-3: the binding surface is inspectable and machine-readable

### REQ-F-ASSETMODEL-004 — Asset graphs are callable through named functions

The dependency topology over typed asset nodes is made callable through named
functions realized as GTL graph functions.

**Acceptance Criteria**:
- AC-1: the live catalog names functions over typed asset nodes
- AC-2: each published function records its input and output node types
- AC-3: the callable carrier remains GTL `GraphFunction` rather than a second
  product-local executor

### REQ-F-ASSETMODEL-005 — Assets are governed through provenance and projection

An instantiated asset without provenance and constructive history is
under-governed.

ODD therefore distinguishes the governing history of an asset from the current
visible asset checkpoint.

**Acceptance Criteria**:
- AC-1: the live asset model distinguishes asset identity from the current
  materialized checkpoint
- AC-2: mutable assets are treated as current projections over constructive
  history rather than as isolated blobs
- AC-3: immutable assets are allowed as stable adopted, imported, or published
  surfaces
- AC-4: repeated constructive turns remain attributable through runtime fact
  truth and provenance rather than by silent overwrite
