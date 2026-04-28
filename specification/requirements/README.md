# odd_sdlc Requirements

Project-specific requirement families live in this folder.

Use `/Users/jim/src/apps/specification_methodology/specification/standards/`
as the governing method reference when writing or revising these files.

## Rules

- Write requirement families as separate `*.md` files.
- Use deterministic REQ headers in the form `### REQ-...`.
- Make lifecycle status and category explicit in each family header.
- Treat carried-forward material as non-authoritative until it is explicitly
  re-adopted here.
- Active requirement families must publish `**Carries Forward From**:` as either
  `None` or one or more backticked `*.md` source references.
- Active requirement families must publish `**Authoring Design**:` as either
  `None` or one or more backticked ratified design or ADR paths.
- `Carries Forward From:` is the explicit carried-source publication field. It
  replaces reliance on grep history or reviewer memory for whether the family
  is a fresh authored line or a re-adopted one.
- `Authoring Design:` is the requirement-side link in the bidirectional
  requirement/design traceability chain.
- Ratified design remains the reciprocal side of that chain through its own
  `**Implements**:` requirement identifiers and `**Derives From**:` references.

## Active Families

- `13-odd-sdlc-typescript-tenant.md` opens the `odd_sdlc.TS` build line as a
  governed TypeScript realization over the singleton product specification.
- `14-odd-sdlc-installed-product-contract.md` defines the installed development
  product contract that build tenants must satisfy for operator and sandbox use.
- `15-odd-sdlc-scheduling-phase.md` defines the graph-owned schedule/work-plan,
  tranche, dependency-graph, and indexed-pressure surfaces that constrain
  realization edges before materialization.
