# Adoption Boundary Requirements

**Family**: REQ-F-UPSTREAM-*
**Status**: Active
**Category**: Governance

This family defines how `odd_sdlc` handles carried-forward source material on
the current constitutional line.

### REQ-F-UPSTREAM-001 — Source material is not live authority until re-adopted

`odd_sdlc` may read prior source material as input, but that material is not
co-equal live authority for the `odd_sdlc` line.

**Acceptance Criteria**:
- AC-1: `odd_sdlc` maintains its own project-owned method, intent, product, and
  requirements surfaces
- AC-2: no carried-forward requirement or design statement is treated as live
  `odd_sdlc` law unless explicitly re-adopted into a `odd_sdlc` constitutional surface
- AC-3: references to prior source material in `odd_sdlc` are bounded
  provenance rather than hidden authority

### REQ-F-UPSTREAM-002 — Imported truth is classified explicitly before downstream use

Every imported statement that `odd_sdlc` keeps in scope must be classified
as adopted, deferred, superseded, or orphaned on the new line.

**Acceptance Criteria**:
- AC-1: retained upstream truth is explicitly classified on the `odd_sdlc` line
- AC-2: no inherited upstream statement remains live but unclassified
- AC-3: downstream design and code derive from the `odd_sdlc` classification and
  adoption surface, not from ambient upstream precedent

### REQ-F-UPSTREAM-003 — Prior runtime/control-plane baggage does not carry forward by default

The `odd_sdlc` line does not inherit prior runtime-control surfaces,
install-managed topology, or product-local post-dispatch runtime logic unless
explicitly re-derived and re-adopted.

**Acceptance Criteria**:
- AC-1: `odd_sdlc` defines its own runtime and packaging surfaces rather than
  presuming inherited compatibility
- AC-2: equivalent shadow-runtime seams from prior lines
  are not treated as default `odd_sdlc` product behavior
- AC-3: any retained compatibility feature must be named,
  justified, and tested as intentional `odd_sdlc` product behavior
