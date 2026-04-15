# Bootstrap Assets And Recursive-Edge Requirements

**Family**: REQ-F-ASSET-*
**Status**: Active
**Category**: Capability

This family defines the bootstrap asset set and the first recursive graph
contracts on the `odd_sdlc` line.

### REQ-F-ASSET-001 — The bootstrap asset set is explicit

`odd_sdlc` defines an explicit bootstrap asset set rather than leaving the
bootstrap graph to ambient folder conventions.

**Acceptance Criteria**:
- AC-1: the bootstrap input asset set includes one bounded `input_set`
- AC-2: the bootstrap graph names `specification/INTENT.md`,
  `specification/PRODUCT.md`, `specification/GOALS.md`, and the
  requirement-family surface rooted at `specification/requirements/` as
  explicit assets
- AC-3: the bootstrap requirements output is carried as separate
  requirement-family files inside that rooted surface

### REQ-F-ASSET-002 — Intent and product are independently derivable from the input set

The bootstrap graph includes independent graph-function boundaries from
`input_set` to `specification/INTENT.md` and from `input_set` to
`specification/PRODUCT.md`.

**Acceptance Criteria**:
- AC-1: one published contract carries `{input_set} -> {specification/INTENT.md}`
- AC-2: one published contract carries `{input_set} -> {specification/PRODUCT.md}`
- AC-3: both contracts are inspectable as graph-function publication truth
  rather than ambient operator habit

### REQ-F-ASSET-003 — Requirements are derived downstream from inputs, intent, and product

The downstream requirements boundary consumes `input_set`,
`specification/INTENT.md`, `specification/PRODUCT.md`, and
`specification/GOALS.md`, then writes the requirement-family surface rooted at
`specification/requirements/`.

**Acceptance Criteria**:
- AC-1: one published contract carries
  `{input_set, specification/INTENT.md, specification/PRODUCT.md, specification/GOALS.md} -> {specification/requirements/}`
- AC-2: the output requirements surface is folderized and carried as separate
  `*.md` family files
- AC-3: output structure remains compatible with the singleton
  `specification/requirements/` authority model

### REQ-F-ASSET-004 — The bootstrap graph is recursive and decomposable

The bootstrap graph treats intent, product, and goals as independently
derivable upstream assets rather than as one fused precondition blob.

**Acceptance Criteria**:
- AC-1: `specification/INTENT.md`, `specification/PRODUCT.md`, and
  `specification/GOALS.md` may be derived or revised through their own
  graph-function boundaries before requirements derivation
- AC-2: resulting requirement families remain derivable from the resulting
  intent, product, and goals surfaces plus the governing `input_set`
- AC-3: the published outer contracts remain stable even if inner realization
  later refines how those surfaces are updated
