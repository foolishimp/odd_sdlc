# Scenario Bundle - odd_sdlc Ambiguity Register And Disambiguation Pipeline

**Validates**: REQ-F-ODDSDLC-027, REQ-F-ODDSDLC-028

**Purpose**: Prove that `odd_sdlc` records major ambiguity explicitly and uses
that ambiguity state to make SDLC convergence more honest, more inspectable,
and policy-aware.

## Scenario

Use an inherited software workspace whose initial normalization leaves one or
more major ambiguities visible, for example:

- competing realization roots
- declared build-tenant root differing from the realized root
- execution capability not declared for a later side-effect stage
- governance-surface truth diverging from artifact truth

Install and normalize the workspace so that `odd_sdlc` publishes its initial
ambiguity register.

Then apply one or more lawful disambiguation steps such as:

- aligning the declared realization root with the actual governed code root
- declaring the missing build-tenant capability in `project_constraints.yml`
- removing a competing interpretation or subordinate scaffold

Re-run normalization or the relevant major boundary and inspect the updated
ambiguity register and query surfaces.

Then vary the declared ambiguity risk appetite and prove that the same major
ambiguity is handled differently:

- lower risk appetite escalates the ambiguity to `F_H`
- higher risk appetite allows bounded `F_P` carry or decision
- hard-stop prerequisite classes remain blocked regardless of appetite

## Significant Paths

- initial-register path: deterministic normalization creates a machine-readable
  ambiguity register for the imported workspace
- major-versus-micro path: the register records major ambiguity but does not
  explode into local implementation noise
- topology path: one ambiguity captures competing realization roots or declared
  versus realized root mismatch
- capability path: one ambiguity captures a missing technology capability for a
  later executional or operational stage
- reduction path: after lawful disambiguation, the register shows reduced or
  resolved ambiguity rather than silently losing the earlier evidence
- policy path: ambiguity entries record declared risk appetite, policy action,
  and the decision owner when traversal proceeds
- escalation path: lower risk appetite produces an `F_H` gate for a major
  ambiguity that is not a hard-stop prerequisite
- honest-convergence path: bounded completion remains honest while unresolved
  hard-stop ambiguity still blocks downstream operational closure

## Expected Outcomes

1. the workspace publishes an ambiguity register as current domain truth
2. at least one major ambiguity is explicitly visible after initial
   normalization
3. a later lawful change reduces or resolves that ambiguity without erasing its
   prior existence
4. the query or catalog surface exposes the ambiguity state directly
5. convergence semantics remain consistent with the ambiguity state and declared
   risk appetite rather than bypassing either of them
