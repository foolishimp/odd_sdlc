# Upstream Adoption Requirements

**Family**: REQ-F-UPSTREAM-*
**Status**: Active
**Category**: Governance

This family defines how `odd_method` may use upstream `genesis_sdlc` material during
the new constitutional line.

### REQ-F-UPSTREAM-001 — `genesis_sdlc` is migration source material, not live authority

`odd_method` may read `genesis_sdlc` requirements, design notes, and qualification
surfaces as source input, but they are not co-equal live authority for the
`odd_method` line.

**Acceptance Criteria**:
- AC-1: `odd_method` maintains its own project-owned method, intent, product, and
  requirements surfaces
- AC-2: no `genesis_sdlc` requirement or design statement is treated as live
  `odd_method` law unless explicitly re-adopted into a `odd_method` constitutional surface
- AC-3: references to `genesis_sdlc` in `odd_method` are provenance or migration
  source links rather than hidden authority

### REQ-F-UPSTREAM-002 — Imported truth is classified explicitly before downstream use

Every imported upstream statement that `odd_method` keeps in scope must be classified
as adopted, deferred, superseded, or orphaned on the new line.

**Acceptance Criteria**:
- AC-1: retained upstream truth is explicitly classified on the `odd_method` line
- AC-2: no inherited upstream statement remains live but unclassified
- AC-3: downstream design and code derive from the `odd_method` classification and
  adoption surface, not from ambient upstream precedent

### REQ-F-UPSTREAM-003 — `genesis_sdlc` runtime/control-plane baggage does not carry forward by default

The `odd_method` line does not inherit `genesis_sdlc` runtime-control surfaces,
install-managed `.gsdlc` topology, or product-local post-dispatch runtime logic
unless explicitly re-derived and re-adopted.

**Acceptance Criteria**:
- AC-1: `odd_method` defines its own runtime and packaging surfaces rather than
  presuming `.gsdlc` compatibility
- AC-2: `genesis_sdlc.runtime.automation` and equivalent shadow-runtime seams
  are not treated as default `odd_method` product behavior
- AC-3: any compatibility feature retained from `genesis_sdlc` must be named,
  justified, and tested as intentional `odd_method` product behavior
