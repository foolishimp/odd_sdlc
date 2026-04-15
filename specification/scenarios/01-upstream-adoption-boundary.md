# Scenario Bundle - Adoption Boundary

**Validates**: REQ-F-UPSTREAM-001, REQ-F-UPSTREAM-002, REQ-F-UPSTREAM-003

**Purpose**: Prove that `odd_sdlc` treats carried-forward source material as
bounded input rather than inherited live authority.

## Scenario

Bootstrap `odd_sdlc` from a clean project-owned specification root while
consulting selected prior requirement and strategy surfaces as source input.

## Significant Paths

- success path: required upstream truth is re-adopted explicitly into `odd_sdlc`
- fail-closed path: an upstream statement is referenced but not adopted, and is
  therefore treated as non-authoritative
- boundary path: `odd_sdlc` refuses to inherit prior runtime/control-plane
  baggage by default

## Expected Outcomes

1. `odd_sdlc` owns project method, intent, product, requirements, and design
   surfaces
2. retained upstream truth is explicitly classified and adopted
3. inherited runtime/control-plane surfaces do not become ambient `odd_sdlc` law
