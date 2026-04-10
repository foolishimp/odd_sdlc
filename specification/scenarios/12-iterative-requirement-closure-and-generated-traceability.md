# Scenario 12: Iterative Requirement Closure And Generated Traceability

**Status**: Active
**Validates**: REQ-F-ODDSDLC-029, REQ-F-ODDSDLC-030, REQ-F-ODDSDLC-031

## Purpose

Prove that `odd_sdlc` treats full closure as an iterative outcome rather than a
one-shot assumption, and that generated realization surfaces carry explicit
requirement trace authority down to source and test level.

## Preconditions

- imported authority contains a live requirement inventory
- the current generated requirement surface exists
- implementation and test planning surfaces exist
- a governed code root exists for the active realization

## Scenario

1. `odd_sdlc` normalizes or scans the workspace and publishes the requirement
   closure register.
2. The requirement closure register records every live requirement from
   authority, including requirements not yet realized in the current bounded
   wave.
3. Generated implementation planning surfaces claim the requirements the active
   implementation branch intends to realize.
4. Generated source files in the governed code root carry `Implements:` tags
   for those claimed requirements.
5. Generated verification surfaces claim the requirements the active test
   branch intends to validate.
6. Generated test files in the governed code root carry `Validates:` tags for
   those claimed requirements.
7. Deterministic checks fail if:
   - live requirements disappear from the current generated requirement surface
   - imported intent identifiers disappear from the goals surface
   - generated source files that belong to the active branch carry no
     `Implements:` authority
   - generated test files that belong to the active branch carry no
     `Validates:` authority

## Expected Result

- partial-wave completion remains lawful
- unresolved live requirements remain active future pressure
- the req -> design -> module -> code or test chain is machine-visible
- later iterations can determine what actually closed and what remains open
