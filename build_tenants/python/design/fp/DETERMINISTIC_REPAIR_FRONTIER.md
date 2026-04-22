# odd_sdlc Deterministic Repair Frontier

**Status**: Active
**Implements**: REQ-F-ODDSDLC-020, REQ-F-ODDSDLC-035
**Derives From**: `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`, `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`, `build_tenants/python/design/REQUIREMENT_CLOSURE_CARRIER_AND_PROJECTION_BOUNDARY.md`, `build_tenants/python/design/fp/STATEFUL_ITERATOR_CONTROL_FRAME.md`, `build_tenants/python/design/fp/REALIZATION_DEEPENING_CONTROL_FRAME.md`

## Position

`odd_sdlc` keeps generic builder prompts, but generic does not mean blank-slate.

Constructive `F_P` builders operate over an enduring asset under construction.
That means the domain must publish one deterministic repair-frontier surface so
the builder can distinguish:

- structure that must be preserved
- current unmet requirement pressure
- lawful in-place deepening
- lawful widening

The repair frontier is a builder-facing read model. It does not become a second
tracker and it does not outrank requirement closure, traceability, or gap
truth.

## Source Truth

The repair frontier is derived from existing domain truth:

- requirement closure register
- requirement closure prompt context
- realization-deepening control frame
- current project profile and selected realization root

It is not hand-authored in prompt assembly and it is not inferred from agent
output after the fact.

The frontier remains downstream of the requirement-closure carrier boundary.

It must not reconstruct requirement carry, fulfillment, or closure semantics
through independent helper scans.

## Published Surfaces

The active publication pair is:

- `.ai-workspace/runtime/odd_sdlc-repair-frontier.json`
- `.ai-workspace/runtime/odd_sdlc-repair-frontier.md`

The JSON register is the machine-readable source for deterministic frontier
structure.

The markdown context is the builder-facing prompt carrier injected into the
constructive lanes.

## Frontier Shape

The published frontier names the current bounded lanes:

- `requirements`
- `design`
- `code`
- `test`

Each lane publishes:

- `target_asset`
- `unmet_requirement_ids`
- `preservation_requirement_ids`
- `lawful_edit_frontier`
- `lawful_proof_frontier`
- `widening_conditions`

## Runtime Rule

The active builder lanes must consume the repair frontier together with the
existing stateful-builder and realization-deepening control frames.

That means:

- requirement-bearing authoring lanes receive the frontier as current context
- realization lanes receive the frontier plus deepening law
- realized-test lanes receive the frontier plus realized-test source obligation

## Closure Rule

This design is only behaving lawfully when:

- builders no longer depend on prompt discretion alone for scope control
- the frontier explicitly treats existing satisfied structure as preservation
  pressure
- widening beyond the published frontier is justified by one named widening
  condition rather than by ambient rewrite behavior
- the frontier consumes the same requirement-closure carrier and prompt-context
  truth used by F_D checks, query surfaces, and dossier publication
