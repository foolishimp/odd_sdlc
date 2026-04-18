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
3. The same register keeps traceability presence separate from delivery
   completion for each live requirement in scope.
4. Generated implementation planning surfaces claim the requirements the active
   implementation branch intends to realize.
5. Generated source files in the governed code root carry `Implements:` tags
   for those claimed requirements.
6. Generated verification surfaces claim the requirements the active test
   branch intends to validate.
7. Generated test files in the governed code root carry `Validates:` tags for
   those claimed requirements.
8. Deterministic checks fail if:
   - live requirements disappear from the current generated requirement surface
   - imported intent identifiers disappear from the goals surface
   - generated source files that belong to the active branch carry no
     `Implements:` authority
   - generated test files that belong to the active branch carry no
     `Validates:` authority
   - a requirement remains a traceable stub with no substantive realized
     implementation evidence
9. The active requirement gap view publishes separate carry and fulfillment
   judgments for each live requirement rather than a single blended closure
   status.
10. Any bounded span view that depends on that requirement-realization truth
    preserves those separate carry and fulfillment judgments rather than
    collapsing them back into one scalar.

## Expected Result

- partial-wave completion remains lawful
- unresolved live requirements remain active future pressure
- the req -> design -> module -> code or test chain is machine-visible
- the active wave preserves a deterministic `n obligations` ledger and can
  report which of those `n` remain incomplete
- the same ledger reports carry and fulfillment separately for each obligation
- any derived scalar remains secondary to the explicit carry and fulfillment
  judgments
- later iterations can determine what actually closed and what remains open
