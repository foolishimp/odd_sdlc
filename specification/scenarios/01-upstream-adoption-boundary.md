# Scenario Bundle - Upstream Adoption Boundary

**Validates**: REQ-F-UPSTREAM-001, REQ-F-UPSTREAM-002, REQ-F-UPSTREAM-003

**Purpose**: Prove that `odd_method` treats `genesis_sdlc` as migration source
material rather than inherited live authority.

## Scenario

Bootstrap `odd_method` from a clean project-owned specification root while consulting
selected `genesis_sdlc` requirement and strategy surfaces as source input.

## Significant Paths

- success path: required upstream truth is re-adopted explicitly into `odd_method`
- fail-closed path: an upstream statement is referenced but not adopted, and is
  therefore treated as non-authoritative
- boundary path: `odd_method` refuses to inherit `.gsdlc` runtime/control-plane
  baggage by default

## Expected Outcomes

1. `odd_method` owns project method, intent, product, requirements, and design
   surfaces
2. retained upstream truth is explicitly classified and adopted
3. inherited runtime/control-plane surfaces do not become ambient `odd_method` law
