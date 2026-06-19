# odd_sdlc Installed Product Contract Requirements

**Family**: REQ-F-ODDSDLC-*
**Status**: Active
**Category**: Product
**Carries Forward From**: `specification/requirements/10-odd-sdlc-software-domain-buildout.md`, `specification/requirements/13-odd-sdlc-typescript-tenant.md`
**Authoring Design**: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md`

This family defines the installed product contract for `odd_sdlc`.

The installer contract is product law. Build tenants must implement it from
requirements and design. They must not infer it from Python installer precedent,
ticket commentary, or manual sandbox setup.

### REQ-F-ODDSDLC-044 - odd_sdlc publishes an installed development product contract

`odd_sdlc` shall publish installer behavior as product behavior for independent
target workspaces.

Acceptance criteria:

- AC-1: the installer prepares a target workspace for `odd_sdlc` operation
  without treating the mutable `odd_sdlc` source checkout as the installed
  product
- AC-2: the installed target is a development product that can be used by
  agents, operators, and sandbox qualification lanes
- AC-3: build tenants implement the installer from live requirements and
  design surfaces, not from implicit Python behavior

### REQ-F-ODDSDLC-045 - odd_sdlc consumes ABG installed substrate truth

`odd_sdlc` shall use the public ABG installer to populate substrate truth in an
installed target workspace. TypeScript install defaults shall invoke that
installer from the pinned ABG release package, not from a mutable sibling source
checkout.

Acceptance criteria:

- AC-1: install and sandbox lanes call or consume a public ABG installer surface
  for `.abiogenesis/` substrate population
- AC-2: `odd_sdlc` does not copy private ABG runtime fixtures, source-tree
  internals, event roots, projection roots, or package bindings
- AC-3: `odd_sdlc` treats ABG install manifests, runtime identity, event roots,
  projection roots, method reference copies, and substrate command bindings as
  ABG-owned installed truth
- AC-4: ABG substrate gaps block RC as upstream installer gaps rather than being
  patched locally inside `odd_sdlc`
- AC-5: TypeScript default install resolution prefers the package-local
  `@abiogenesis/typescript-tenant` dependency installed from a release snapshot
  tarball
- AC-6: if package-local ABG release consumption is used, ABG docs and shared
  standards roots are passed explicitly so `odd_sdlc` docs cannot be mistaken
  for ABG docs

### REQ-F-ODDSDLC-046 - odd_sdlc installs product payload under the ABG product/tenant topology

`odd_sdlc` shall install its product-owned payload beneath the ABG installed
root using the product/build-tenant topology.

Acceptance criteria:

- AC-1: TypeScript product payload installs under
  `.abiogenesis/odd_sdlc/typescript/`
- AC-2: future build tenants install under
  `.abiogenesis/odd_sdlc/<build_tenant>/`
- AC-3: product manifests name the product, build tenant, installed payload
  root, command bindings, and runtime dependency on ABG substrate truth
- AC-4: product install refresh does not overwrite ABG-owned substrate truth or
  target-project-owned specification/source truth

### REQ-F-ODDSDLC-047 - installed odd_sdlc workspaces are cold-agent operable

An installed target workspace shall be operable by a cold agent without prior
session memory.

Acceptance criteria:

- AC-1: root `AGENTS.md` and `CLAUDE.md` carry marker-governed `odd_sdlc`
  instruction sections when those files are present or created by install
- AC-2: the instruction sections explain the target workspace ownership split:
  project-owned specification/source truth, ABG-owned substrate truth, and
  `odd_sdlc`-owned domain install truth
- AC-3: the instruction sections map operator `gaps` to the installed ABG
  command binding with `--scope workspace` over the installed `odd_sdlc`
  runtime contract
- AC-4: the instruction sections map operator `start` to the installed ABG
  command binding, selected `odd_sdlc` graph-function target, and active
  runtime contract. `odd_sdlc` must not publish a separate product-local
  orchestration command for this path.
- AC-5: instruction sections reference shared method through
  `workspace://.abiogenesis/docs/standards/...`, not through absolute source
  workspace paths
- AC-6: the installed workspace publishes or references the operational read
  models needed for cold-agent traversal, including project bootstrap,
  normalization report, ambiguity register, requirement closure register,
  analysis manifest or equivalent workspace-state projection, and runtime
  contract binding
- AC-7: the instruction sections identify those operational read models by
  workspace-relative or `workspace://` references so a cold agent can inspect
  current state before acting
- AC-8: instruction sections and installed bootstrap provenance define
  `STDO law`, `STDO governance`, `STDO Constitution`, and `STDO Method` as
  aliases for the same governance stack:
  `SPEC_METHOD.md`, `TICKET_METHOD.md`, `DESIGN_MODULE_METHOD.md`, and
  `ODD_METHOD.md`
- AC-9: instruction sections and installed bootstrap provenance define
  `STDO-UX` as the UI/operator-surface application of the same STDO governance
  stack
- AC-10: instruction sections and installed bootstrap provenance require
  first-missing-layer triage before substantive ticket execution, using:
  `Goals -> Intent -> Product -> Requirements -> Design -> Code -> Tests/Proof -> Release`
- AC-11: instruction sections state that the symptom layer is not the
  re-entry authority; the ticket must fix its execution contract before
  implementation when triage reveals a higher missing layer

### REQ-F-ODDSDLC-048 - installed standards references remain ABG-installed read models

`odd_sdlc` shall reference installed method standards as ABG-provided local read
models.

Acceptance criteria:

- AC-1: `odd_sdlc` installer output may reference
  `workspace://.abiogenesis/docs/standards/SPEC_METHOD.md`,
  `workspace://.abiogenesis/docs/standards/TICKET_METHOD.md`,
  `workspace://.abiogenesis/docs/standards/DESIGN_MODULE_METHOD.md`, and
  `workspace://.abiogenesis/docs/standards/ODD_METHOD.md`
- AC-2: `odd_sdlc` shall not independently install or mutate the ABG standards
  copy
- AC-3: installed standards references are operational guidance for a target
  workspace; they do not replace project-owned `specification/` truth or
  upstream shared method authority

### REQ-F-ODDSDLC-049 - installed sandbox proof uses the same installer contract as operators

Sandbox and data-mapper qualification shall use the same installed product
contract as an operator-facing install.

Acceptance criteria:

- AC-1: sandbox targets are populated through ABG installed substrate plus
  `odd_sdlc` product install, not through private harness-created runtime files
- AC-2: `data_mapper.test46.ts` or its successor starts from
  `data_mapper.template` and proves the installed contract in an independent
  target workspace
- AC-3: proof includes ABG install manifest, ABG installer manifest,
  `odd_sdlc` product install manifest, ABG command bindings, cold-agent
  instruction files, method standard references, and command sanity for `gaps`
  and `start`
- AC-4: live or sandbox UAT claims distinguish installed-command proof from
  source-line unit proof
- AC-5: proof includes `odd_sdlc` runtime contract binding to the installed ABG
  substrate, and the binding is visible through the product install manifest or
  an equivalent installed read model
- AC-6: proof includes the installed operational read models required by
  `REQ-F-ODDSDLC-047`: project bootstrap, normalization report, ambiguity
  register, requirement closure register, analysis manifest or equivalent
  workspace-state projection, and runtime contract binding
- AC-7: persistent archive proof includes invoked command lines, stdout/stderr,
  event sequence, manifest/result evidence where present, runtime snapshots,
  run metadata, summary/postmortem output, and the installed workspace evidence
  needed for replay-free diagnosis

### REQ-F-ODDSDLC-050 - installer gaps remain visible product gaps

Installer incompleteness shall remain visible as product gaps until closed by
the owning product.

Acceptance criteria:

- AC-1: missing ABG installer behavior is tracked as an upstream ABIogenesis
  ticket and blocks `odd_sdlc` RC claims that depend on it
- AC-2: missing `odd_sdlc` installer behavior is tracked as an `odd_sdlc`
  product or tenant ticket and cannot be closed by citing ABG substrate proof
  alone
- AC-3: ticket closure cites live requirement/design authority and installed
  proof rather than informal session memory

### REQ-F-ODDSDLC-051 - installed operator loop is a product contract

An installed `odd_sdlc` workspace shall expose a coherent operator loop over
`gaps`, `start`, worker execution, result ingestion, runtime projection, and
archive proof.

Acceptance criteria:

- AC-1: `gaps` reports the current graph function, current edge, status,
  blocking reason, and next lawful action without requiring the operator to
  inspect the full GTL module
- AC-2: `start` reports one truthful state: worker required, dispatch required,
  yielded handoff, convergence, or explicit gap/error
- AC-3: after a constructive worker run, rerunning `gaps` reflects replay or
  admitted runtime truth rather than restarting from the same unchanged first
  edge
- AC-4: installed ABG command proof is distinct from source-line unit tests and
  private harness proof
- AC-5: the installed operator handoff shall support the agentic coder as the
  user interface over the same installed ABG/`odd_sdlc` contract:
  `User -> Agentic_Coder_CLI -> ABG command intent -> installed odd_sdlc runtime contract -> ABG`
- AC-6: the agentic coder CLI shall be treated as the user interface over
  installed product truth, not as a second runtime or hidden controller
- AC-7: plain shell execution may launch the installed ABG command binding, but
  it shall not define product command law, own retry/reentry, or become
  compatibility facade truth

### REQ-F-ODDSDLC-052 - supplied worker transport triggers governed execution

When installed `start` is invoked with a valid worker transport contract, the
TypeScript tenant shall execute the selected graph-function edge through a
governed worker handoff path rather than stopping at an unconsumed
`dispatch_required` projection.

Acceptance criteria:

- AC-1: `--worker` is admitted as a transport contract with explicit command,
  workspace, timeout/progress, result-artifact, and archive expectations
- AC-2: worker execution is invoked by an installed command or installed
  runtime path, not by a test-only harness
- AC-3: worker transport failures, timeouts, missing output, malformed output,
  and postflight failures remain distinguishable result classes
- AC-4: worker execution remains subordinate to ABG runtime truth and does not
  create an `odd_sdlc` shadow runtime
- AC-5: when the same executable family can act as both agentic UI and `F_P`
  worker, the worker role shall remain explicit through the transport contract,
  handoff manifest, result report, and archive proof

### REQ-F-ODDSDLC-053 - worker handoff manifest is graph-function derived

The worker handoff shall be derived from the admitted workspace ingress, the
selected GTL graph-function edge, source asset bindings, target output binding,
method references, and proof obligations.

Acceptance criteria:

- AC-1: handoff manifests identify workspace, graph function, edge, input asset
  bindings, target asset type, output binding, allowed write roots, result
  report schema, and method references
- AC-2: handoff manifests are archived before or during worker execution
- AC-3: worker prompts are derived from the manifest and do not replace the
  manifest as authority
- AC-4: first-slice implementation may use an explicit transitional output
  binding while ABIogenesis output allocation is still open, but that binding
  must be admitted, visible, and replaceable by ABG-owned allocation
- AC-5: product-realization handoff manifests carry a traversal obligation
  context that references the required source asset types, target asset type,
  prior edge evidence, requirement/design/module authority surfaces, runtime
  context surfaces, retry gap dossiers, and a compact delta summary
- AC-6: handoff prompts may embed compact current-state summaries, but large
  authority surfaces and prior ledgers are carried by stable references and
  digests so the worker can traverse the full obligation chain without
  restating inert context

### REQ-F-ODDSDLC-054 - materialized outputs are admitted as typed assets

Constructive worker output shall be admitted as a typed asset with provenance,
digest, materialization path, generating graph function, and edge identity.

Acceptance criteria:

- AC-1: output files must exist and be non-empty before postflight can pass
- AC-2: output path must be inside the admitted output root or ABG allocation
  root
- AC-3: output asset type must match the selected graph-function edge target
- AC-4: output digest must be recorded and verified against materialized
  content
- AC-5: produced asset identity and path must be visible in the installed
  command result or associated archive/projection

### REQ-F-ODDSDLC-055 - worker result ingestion updates runtime-visible truth

Worker results shall be ingested through typed carriers and deterministic
postflight checks, then surfaced through ABG-compatible runtime event or
projection truth.

Acceptance criteria:

- AC-1: worker result reports are schema-admitted before postflight evaluation
- AC-2: postflight verifies graph function, edge, target asset type, output
  digest, output root, and materialization status
- AC-3: successful result ingestion records enough runtime-visible truth for
  `gaps` to move to the next lawful edge or report a specific yielded/gap state
- AC-4: failed result ingestion records a diagnosable gap rather than silently
  succeeding or restarting from the same state
- AC-5: successful result ingestion for a product-realization edge is gated by
  deterministic assurance over the cumulative traversal obligation context,
  including requirement fulfillment and prior obligation carry; the current
  artifact alone is not sufficient closure evidence when live obligations
  remain open

### REQ-F-ODDSDLC-056 - test46 proves installed UX over a real independent workload

`data_mapper.test46.ts` or its successor shall prove the installed TypeScript
operator UX over the independent `data_mapper` workload.

Acceptance criteria:

- AC-1: the workspace is rebuilt from `data_mapper.template` and populated by
  public ABG and `odd_sdlc` installers
- AC-2: proof uses installed ABG commands from the target workspace
- AC-3: first `gaps` identifies the current open edge
- AC-4: `start --worker ...` invokes a real worker and materializes at least
  one declared output asset
- AC-5: second `gaps` reflects the admitted result and does not show the same
  unchanged initial state unless a specific postflight/yield/gap reason is
  recorded
- AC-6: archive proof includes command lines, manifests, prompts, stdout/stderr,
  generated asset files, result reports, postflight status, runtime/projection
  evidence, elapsed time, and postmortem

### REQ-F-ODDSDLC-058 - test-run archives require governed test execution evidence

`derive_test_run_archive_surface` shall close only on governed test execution
evidence or explicitly block as pending/failed evidence.

Acceptance criteria:

- AC-1: the worker handoff prompt publishes the closed execution-evidence
  status vocabulary `succeeded`, `failed`, and `pending`
- AC-2: legacy or worker-emitted `not_run` evidence is admitted only as
  `pending`, not as a successful archive
- AC-3: when a conformed project declares a test execution contract, the
  archive edge requires evidence for that command or a typed pending/blocking
  reason
- AC-4: a closing archive includes test lane evidence, the declared command,
  durable report refs, observed test count, passed count, failed count, and
  zero failures
- AC-5: missing execution evidence, pending/non-succeeded evidence, zero
  observed tests, missing report refs, or test failures block closure and
  produce replay-visible gap pressure

### REQ-F-ODDSDLC-061 - component tests are discoverable by declared test contract

`derive_component_test_surface` shall materialize test files that are discoverable
by the conformed project's declared test execution contract, or block with a
typed gap before the test-run archive edge.

Acceptance criteria:

- AC-1: when `conformedProject.testExecutionContract` is declared, generated
  component tests are not sufficient unless the declared command can discover
  them as tests
- AC-2: for `sbt test`, standalone `main` objects are not closure evidence for
  `component_test_surface`
- AC-3: when the selected tenant build configuration lacks a discoverable test
  framework binding, the worker must materialize or update build configuration
  and report it as `build_config`
- AC-4: `component_test_surface` postflight blocks with a typed reason when
  generated tests are not discoverable under the declared test execution
  contract
- AC-5: blocking discoverability findings become replay-visible gap pressure
  and do not wait for `derive_test_run_archive_surface` to rediscover the same
  defect

### REQ-F-ODDSDLC-062 - retry-eligible report rejection remains inside the autonomous loop

`start --until blocked` shall continue when a worker report rejection has been
converted into retry-visible runtime truth.

Acceptance criteria:

- AC-1: when report admission fails and the installed operator emits
  retry/repair runtime events, the autonomous loop treats
  `nextLawfulAction: retry_same_edge_with_gap_dossier` as a continuing state
  rather than a terminal stop
- AC-2: the following worker attempt receives the prior gap dossier through the
  traversal obligation context
- AC-3: the loop stops only when retry policy no longer emits retry repair
  truth, a non-retryable worker/report failure occurs, a real blocked state
  occurs, or convergence occurs
- AC-4: missing or malformed worker reports are never admitted as successful
  result carriers
