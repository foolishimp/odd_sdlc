# odd_sdlc RC Notes

This note records accepted RC-scoped behavior and caveats for
`v1.0.0-rc.1`.

## Accepted RC Behavior

### Construction-First, Governed-Evidence Admission

The current odd_sdlc line permits constructive SDLC progress before an
execution capability is declared.

That means:

- constructive surfaces may converge before a declared execution contract
  exists
- undeclared execution artifacts may be visible without being admitted as
  governed execution truth
- release, deployment, and qualification remain at `pending_evidence` /
  `construction_complete_pending_execution` until declared capability and
  governed returned evidence exist

This remains intentional framework policy for the RC line. It preserves
iterative closure without allowing false operational truth.

### Source-Line Query And Prompt Surfaces Are Fail-Closed

The current RC does not rebuild current requirement or execution truth on read
paths when the published carrier is missing.

That means:

- source `query-domain` may return an unavailable requirement-closure read
  model before analysis is published
- requirement-closure prompt context requires an explicit register rather than
  silently rescanning current workspace truth
- execution-contract projection is published from runtime-contract truth; it is
  not reconstructed from stale local controller state

This is intentional. Read-path reconstruction was removed so mixed old/new
carrier authority cannot masquerade as healthy closure.

### Installed Runtime Truth Is Downstream, Not Source-Mirrored

The source repo does not carry an installed `.genesis` runtime at repo root.

That means:

- source execution and qualification bind ABG through explicit source
  `PYTHONPATH`
- installed runtime truth is created only in downstream installs and test
  sandboxes
- source release publication does not rely on `.odd_sdlc/release` mirror state

### Yielded Observer Handoff Remains Lawful For Non-Blocking Post-F_P Findings

The current RC accepts the ABG yielded-handoff envelope for non-blocking
deterministic findings that remain after constructive continuation.

That means:

- non-blocking deterministic findings may yield observer/handoff truth rather
  than flattening into generic runtime failure
- explicit blocker-class conditions still fail closed

## RC Qualification Boundary

The `v1.0.0-rc.1` qualification bundle is the deterministic source/install/yield
bundle listed in
[ODD_SDLC_RC_RELEASE_NOTE.md](/Users/jim/src/apps/odd_sdlc/docs/ODD_SDLC_RC_RELEASE_NOTE.md).

It does not certify external live agent, OAuth-dependent, or network-dependent
lanes as part of this offline source-cut publication.
