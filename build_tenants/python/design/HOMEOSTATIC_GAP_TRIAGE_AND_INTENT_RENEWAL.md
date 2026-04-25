# odd_sdlc Homeostatic Gap Triage And Intent Renewal

**Status**: Active
**Date**: 2026-04-13
**Implements**: REQ-F-ODDSDLC-033, REQ-F-ODDSDLC-034, REQ-F-ODDSDLC-035, REQ-F-ODDSDLC-036, REQ-F-ODDSDLC-037
**Derives From**: `specification/PRODUCT.md`, `specification/requirements/03-runtime-governance.md`, `specification/requirements/10-odd-sdlc-software-domain-buildout.md`, `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`, `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`, `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`

## Position

`odd_sdlc` already carries forward ambiguity, closure, and traceability truth,
but it still needs a lawful reverse path from detected mismatch back into the
constitutional chain.

This design defines that reverse path as a homeostatic domain layer over the
existing GTL and ABG substrate.

The intended sequence is:

`observation -> triage -> route -> constitutional proposal -> renewed forward derivation`

This is domain design, not a second runtime.

ABG remains authoritative for:

- emitted event truth
- continuation truth
- routed selection provenance
- approval and revocation provenance

`odd_sdlc` owns only the domain semantics layered on top:

- observation meaning
- generic-first triage
- lawful re-entry
- route proposal and binding
- constitutional repricing proposal semantics

## Authority Surfaces

The reverse path uses three distinct current-state domain surfaces:

1. workspace state
   - mode
   - declared root
   - selected root
   - readiness
   - published-analysis identity
2. analysis manifest
   - published analysis artifacts
   - source-input fingerprint basis
   - selected-root attribution
3. current edge triage projection
   - current observation, triage, route, and constitutional proposal state for
     one edge

These surfaces must not be collapsed into one artifact.

The distinction is load-bearing:

- workspace state answers "can the runtime lawfully operate now"
- analysis manifest answers "what current analysis was published from which
  inputs"
- current edge triage answers "what is the current semantic mismatch and next
  action shape for this edge"

Historical causation, supersession, and divergence remain in ABG event truth.

## Process Classification

The reverse path is generic-first.

The first classification step is over:

- `framework_layer`
- `framework_condition`

Only then does `odd_sdlc` refine the result into domain-specific `gap_kind`,
`reentry_layer`, and route proposal.

This design keeps the outer process boundary total:

- every meaningful mismatch resolves to a named current outcome
- undeclared or unsupported combinations become `unclassified_gap`
- missing dynamic candidates become explicit `no_lawful_route`
- no branch may fall through into silent retry or ambient repair

Identity and divergence law:

- constitutional proposal identity stays stable across lawful reprojection when
  the governing constitutional surface has not materially changed
- constitutional proposal identity must mint a new proposal when the governing
  constitutional surface materially changes
- `triage_divergence` is semantic drift telemetry, not per-refresh noise;
  fingerprint-only refreshes must not emit divergence when current observation
  and triage meaning are unchanged

## Observation

Observation is the first-class disturbance signal.

It exists to make pressure visible before successful triage or route binding.

Observation is also the primary telemetry hook for future operator surfaces.

That means:

- disturbance detection must be durable even when triage later fails
- stale analysis, malformed generated assets, major ambiguity, missing
  capability, and shallow realization are all lawful observation sources
- observation does not replace ABG events; it provides the domain-facing
  current-state interpretation of that pressure

## Triage

Triage is the semantic appraisal step.

Its minimum output is:

- `framework_layer`
- `framework_condition`
- `gap_kind`
- `reentry_layer`
- evidence bundle
- policy gate state

Granularity law:

- the primary triage unit is the edge
- one edge triage may carry multiple nested `asset_findings[]`
- route selection still occurs at the edge boundary unless a future
  graphfunction explicitly declares per-finding execution

Ambiguity law:

- major ambiguity remains governed by the existing ambiguity register
- `ambiguity_gap` is a pass-through envelope over that truth for uniform route
  handling
- this design does not create a second ambiguity-classification regime

## Route And Re-entry

Route selection consumes triage. It does not replace it.

The route layer distinguishes:

- fixed-vector advance
- dynamic-family advance
- gated state
- suppressed state
- explicit no-lawful-route state

Route admission applies one precedence order:

1. realization-iteration graph-function re-entry when the current edge is
   already under governed deepening
2. explicitly declared authoritative head graph functions
3. graph-function-only guard rails that fail closed when declaration is absent
4. declared dynamic-routing candidates, including explicit no-lawful-route when
   no candidate matches
5. fixed-vector fallback only when no dynamic-routing declaration was supplied

Fixed-vector examples in the first implementation cut are:

- `repair_output_contract`
- `realize_missing_tests`
- `reopen_design`
- `reopen_product`
- `reopen_requirements`

The primary routing carrier is `reentry_layer`, not a boolean alarm.

Canonical re-entry layers are:

- `code`
- `test`
- `design`
- `requirements`
- `product`
- `goals`
- `intent`

Forward-authority law:

- once re-entry is chosen, derivation resumes from that layer and flows forward
- downstream work must not skip the named upstream authority layer

Governance boundary:

- route selection names lawful re-entry and route eligibility
- governance publication may describe preserved structure and unmet pressure
- builder strategy remains outside route publication

## Constitutional Gate

Constitutional repricing is reserved for gaps that cannot be resolved lawfully
beneath current Goals or Intent.

The design gate is:

1. workspace-mode or policy decision
2. explicit `F_H` approval unless suppression is the declared policy

Constitutional outcomes remain distinct:

- `approve`
- `approve_with_edits`
- `reject`
- `defer`

No semantic triage path may apply constitutional change silently.

Suppressed governed fixtures may carry the recommendation without applying it.

Deferred proposals remain pending until they are approved, rejected, or
superseded.

## Public Start Gate

Public `odd_sdlc start --target next` is downstream of the same current
homeostatic truth that `gaps` publishes.

That means public start must consume the current head gap dossier before any
execution-contract admission.

When the head dossier carries:

- `route_binding.state=await_fh_resolution`
- `constitutional_proposal.state=pending_fh`

public start must:

- stop with `fh_gate`
- emit no execution-contract admission
- emit no constructive run events

Lawful constructive dispatch can resume only after a recorded constitutional
resolution changes that current gate state.

## Freshness And Resumption

Current triage is only lawful against fresh published analysis.

If current analysis is stale against declared authority or trace-tagged
realization inputs:

- current route truth is blocked
- the edge remains in a stale-analysis state
- lawful re-entry occurs only after analysis is republished

Other blocked states remain explicit and name their own resumption trigger:

- missing capability -> declared capability changes
- pending constitutional approval -> approval or rejection is recorded

This keeps the reverse path stateful without making it ambient.

## Query Surface

`query-domain` remains the direct query surface for current domain semantics.

This design keeps the top-level query contract stable while enriching the
`gaps` payload.

The `gaps` payload is a read model over the requirement-closure carrier and the
canonical edge-gap projection boundary.

The `gaps` projection must expose at least:

- current analysis identity and freshness
- current edge-scoped observation state
- current edge-scoped triage state
- current route binding or unresolved-route state
- current constitutional proposal state where one is open

This is a current-state read model.

It must fail closed when the governing requirement-closure publication is
missing or stale.

It does not replace:

- ABG events for full history and causation
- ABG continuation truth
- ABG approval lineage

## Divergence And Supersession

Later triage may supersede earlier current triage for the same authority basis.

The design law is:

- one clear current triage projection exists for current domain query
- later materially different triage supersedes the current projection
- divergence remains visible through event correlation and explicit divergence
  signaling
- there is no rollback primitive for prior semantic triage

In an F_P-bearing system, divergence is information first.

## Proof Anchors

The design is considered real only if it closes against current proving
surfaces, especially:

- `specification/scenarios/11-ambiguity-register-disambiguation-pipeline.md`
- `specification/scenarios/12-iterative-requirement-closure-and-generated-traceability.md`
- `specification/scenarios/13-homeostatic-gap-triage-and-intent-renewal.md`
- `build_tenants/python/test_env/fixtures/test28_pass2_replay/`

The critical proving question is not only whether a gap is detected.

It is whether the system can:

- classify that gap honestly
- name the lawful re-entry layer
- preserve current-state and route truth without prescribing builder strategy
- gate constitutional repricing explicitly
- preserve divergence and current-state clarity at the same time
