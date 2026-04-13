# Scenario 13: Homeostatic Gap Triage And Intent Renewal

**Status**: Active
**Validates**: REQ-F-ODDSDLC-033, REQ-F-ODDSDLC-034, REQ-F-ODDSDLC-035, REQ-F-ODDSDLC-036, REQ-F-ODDSDLC-037

## Purpose

Prove that `odd_sdlc` turns detected mismatch into an explicit homeostatic
chain of observation, triage, route selection, and where necessary
constitutional repricing, while preserving ABG as the event-driven substrate.

## Preconditions

- current published analysis exists for the workspace
- at least one active edge or frontier disturbance is queryable
- the proving lane can expose both a realization-local gap and a gated or
  suppressed constitutional path

## Scenario

1. Start from a governed workspace with current published analysis and query the
   active frontier.
2. Introduce or expose one stale-analysis disturbance by changing an authority
   or trace-tagged input surface after analysis publication.
3. Re-run the relevant query or gap surface and verify that the workspace first
   records observation of the disturbance and blocks current triage or route
   truth until analysis is republished.
4. Use a shallow-realization proving lane, including the named
   `build_tenants/odd_sdlc/python/test_env/fixtures/test28_pass2_replay/`
   survivor fixture, and verify that triage names the affected layer, classifies
   the mismatch, and prefers lawful deepening over lateral expansion.
5. Use a major-ambiguity or unroutable case and verify that triage preserves
   the ambiguity or no-lawful-route outcome explicitly rather than silently
   demoting it to generic code repair.
6. Use a constitutional-insufficiency case and verify that the system emits an
   explicit constitutional proposal whose application is gated by policy and
   `F_H`, or explicitly suppressed where policy declares suppression.
7. Repeat triage against the same authority basis after a materially different
   semantic reading and verify that the current triage is superseded while the
   earlier result remains visible in divergence history.

## Significant Paths

- observation-first path: disturbance is recorded before successful triage
- stale-analysis path: stale published analysis blocks current route truth until
  republished
- shallow-realization path: existing shallow assets cause deepening pressure
  rather than silent lateral expansion
- ambiguity pass-through path: major ambiguity is wrapped into common triage
  shape without inventing a second ambiguity regime
- no-lawful-route path: unroutable gaps remain explicit and do not collapse into
  ambient repair
- constitutional-gate path: Goals or Intent repricing remains explicit and
  gated
- defer path: deferred constitutional proposals remain pending without silent
  write application
- divergence path: later triage may supersede current state while preserving
  prior history for comparison

## Expected Result

- observation, triage, route, and constitutional state remain distinct and
  correlated
- stale analysis prevents stale current triage or route state from being served
- shallow survivors produce lawful deepening pressure
- ambiguity and unroutable states remain explicit rather than being hidden by
  breadth-first continuation
- constitutional repricing never applies silently
- repeated triage preserves divergence history while leaving one clear current
  triage state for operational query
