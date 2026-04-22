# odd_sdlc RC Notes

This note records accepted RC-scoped behavior and caveats for
`v1.0.0-rc.2`.

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

### Public Start Is Published-Carrier-Governed

The current RC treats public start admission as a published homeostatic-carrier
decision, not as a controller-local fallback.

That means:

- `target=next`, explicit `graph_function:` targets, and start-addressable
  `asset:` targets all consult the published head-gap carrier before admission
- published `pending_fh` on the head edge stops public start at `fh_gate`
  before execution-contract admission or constructive run events
- unpublished or stale public gap carriers fail closed before admission

This is intentional. Public start no longer carries a fresh-install shortcut or
an explicit-target bypass around published constitutional truth.

### Scope-Owned Gap Dossier Publication Is Intentional

The current RC keeps workspace and `work_key:<id>` gap publication distinct.

That means:

- `gaps --scope work_key:<id>` publishes to a scoped dossier carrier
- workspace `query-domain` and workspace `start` continue to consume workspace
  dossier truth
- scope-specific publication does not overwrite workspace gating truth

This is intentional. It keeps one carrier story per scope instead of letting
scoped publication poison workspace read models.

### Public Continue And Public Start Share One Published Re-Entry Story

The current RC accepts only one workspace re-entry carrier between `continue`
and the next public `start`.

That means:

- `continue` refreshes analysis and republishes the workspace gap-dossier
  carrier
- the next public `start(next)` consumes that same published workspace carrier
- proof-driven continuation-opened states remain lawful `yield`; they are not
  flattened into operator-facing runtime failure

## RC Qualification Boundary

The `v1.0.0-rc.2` qualification bundle is the deterministic source/install/yield
bundle listed in
[ODD_SDLC_RC_RELEASE_NOTE.md](/Users/jim/src/apps/odd_sdlc/docs/ODD_SDLC_RC_RELEASE_NOTE.md).

It does not certify external live agent, OAuth-dependent, or network-dependent
lanes as part of this offline source-cut publication.
