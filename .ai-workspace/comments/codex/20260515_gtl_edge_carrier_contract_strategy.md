# GTL Edge Carrier Contract Strategy

Status: Strategy commentary
Date: 2026-05-15
Workspace: `odd_sdlc`

## Claim

The current `odd_sdlc` GTL edge contract is split across graph publication,
edge assurance rows, handoff prompt fields, parser admission, and assurance
folds.

That split is lawful but incomplete. It declares which edge runs and how it
closes, but it does not make the target carrier shape a first-class GTL edge
contract section. The live T132 run exposed the gap: workers can produce
semantically plausible carrier prose while drifting exact protocol literals or
field shapes, and the framework must catch and retry those defects after the
fact.

GTL should not own raw prompt templates. GTL should own the typed edge boundary
that points to the carrier contract/template consumed by prompt construction,
parser admission, deterministic projection, tests, and closure.

## Current Contract Surface

For `derive_release_depth_parity_surface`, the current contract is distributed
across these surfaces.

### 1. Graph Vector Publication

Current location:

- `build_tenants/typescript/code/src/graph/catalog.ts`
- edge: `derive_release_depth_parity_surface`
- inputs:
  - `implementation_component_topology_surface`
  - `component_realization_qualification_surface`
  - `component_test_qualification_surface`
  - `component_repair_schedule_surface`
  - `test_run_archive_surface`
- output:
  - `release_depth_parity_surface`

Current role:

```yaml
graph_vector:
  edge: derive_release_depth_parity_surface
  intent: Derive release depth parity and co-affirmation evidence.
  inputs:
    - implementation_component_topology_surface
    - component_realization_qualification_surface
    - component_test_qualification_surface
    - component_repair_schedule_surface
    - test_run_archive_surface
  outputs:
    - release_depth_parity_surface
```

Why this section is needed:

The graph vector is the executable GTL boundary. It tells ABG/GTL which source
nodes are required, which target node is produced, and where the traversal sits
inside the graph function. Without this section, the runtime cannot select,
order, or resume the traversal lawfully.

#### Missing Components In This Contract

The graph vector publication is missing:

- target carrier identity: `component_depth_register.releaseDepthParity`
- target carrier kind: `sdlc_release_depth_parity_assessment`
- required envelope fields: `kind`, `registerVersion`, `targetAssetType`
- required nested fields: `releaseDepthParity.kind`,
  `releaseDepthParity.status`, `releaseDepthParity.summary`,
  `releaseDepthParity.blockingReasons`, `releaseDepthParity.evidenceRefs`
- allowed nested enum values: `met`, `blocked`, `repriced`
- template/scaffold ref for the target carrier
- parser admission ref for the target carrier
- deterministic projection eligibility for this edge
- ownership split between fixed protocol fields and worker-fillable domain fields
- round-trip proof requirement tying graph publication to parser/prompt/test shape

### 2. Edge Assurance Row

Current location:

- `build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts`
- row: `derive_release_depth_parity_surface`
- category: `repair_archive_release_qualification`
- closure classification: `close_capable`
- composition role: `proof`
- proof lane: `test://odd-sdlc/t164/release-readiness`
- residual pressure: `pressure://odd-sdlc/release-depth-parity`

Current role:

```yaml
edge_assurance:
  edgeRef: derive_release_depth_parity_surface
  category: repair_archive_release_qualification
  closureClassification: close_capable
  sourceAssetTypes:
    - implementation_component_topology_surface
    - component_realization_qualification_surface
    - component_test_qualification_surface
    - component_repair_schedule_surface
    - test_run_archive_surface
  targetAssetType: release_depth_parity_surface
  compositionRole: proof
  authorityBasisRefs: RELEASE_REFS
  proofLaneRefs:
    - test://odd-sdlc/t164/release-readiness
  residualPressureRefs:
    - pressure://odd-sdlc/release-depth-parity
```

Why this section is needed:

The edge assurance row is the product-owned closure contract. It tells the
runtime whether the vector is close-capable, which authority basis it uses, how
its gain participates in compound traversal, and which residual pressure remains
visible after the edge.

#### Missing Components In This Contract

The edge assurance row is missing:

- target carrier contract ref
- target carrier template/scaffold ref
- target carrier admission ref
- target carrier prompt projection ref
- explicit fixed protocol literals:
  - `kind = "sdlc_component_depth_register"`
  - `registerVersion = "ts-component-depth-v1"`
  - `targetAssetType = "release_depth_parity_surface"`
  - `releaseDepthParity.kind = "sdlc_release_depth_parity_assessment"`
- explicit closure predicate over the nested carrier:
  `releaseDepthParity.status == "met"`
- retry/reprice mapping from carrier status:
  - `blocked` -> retry or residual pressure
  - `repriced` -> reprice path
  - invalid shape -> repair worker output
- statement that worker assessments are evidence only after the target carrier
  contract admits them
- statement that protocol-shape defects are contract defects, not domain
  judgement defects

### 3. Handoff Field Projection

Current location:

- `build_tenants/typescript/code/src/operator/handoff.ts`
- `componentDepthFieldSetForTarget("release_depth_parity_surface")`

Current role:

```yaml
worker_projection:
  targetAssetType: release_depth_parity_surface
  required_fields:
    - kind
    - registerVersion
    - targetAssetType
    - releaseDepthParity.kind
    - releaseDepthParity.status
    - releaseDepthParity.evidenceRefs
```

Why this section is needed:

The worker must see a compact, edge-specific shape hint. Without a projection
into the handoff prompt, the worker has to infer protocol shape from prose and
nearby examples.

#### Missing Components In This Contract

The handoff field projection is missing:

- direct derivation from a graph-owned `target_carrier_contract`
- complete JSON skeleton with fixed protocol literals already filled
- explicit worker-fillable slots
- explicit worker-forbidden slots
- enum values for `releaseDepthParity.status`
- example valid carrier instance
- example invalid carrier defect classes
- admission error vocabulary the worker should repair against
- stable template ref emitted into the invocation package
- checksum/digest of the carrier contract used to build the prompt
- deterministic projection hint when the edge can be computed from admitted
  predecessors without an agent-authored carrier

### 4. Parser Admission Contract

Current location:

- `build_tenants/typescript/code/src/operator/carriers.ts`
- `build_tenants/typescript/code/src/operator/component_depth_register.ts`

Current role:

```yaml
parser_admission:
  envelope:
    kind: sdlc_component_depth_register
    registerVersion: ts-component-depth-v1
    targetAssetType: release_depth_parity_surface
  nested_carrier:
    path: releaseDepthParity
    kind: sdlc_release_depth_parity_assessment
    status:
      - met
      - blocked
      - repriced
    required_fields:
      - kind
      - status
      - summary
      - blockingReasons
      - evidenceRefs
```

Why this section is needed:

Parser admission is the deterministic truth boundary. It rejects malformed
worker output before closure. The T132 release-depth parity edge used this
boundary correctly: a bad `releaseDepthParity.kind` was rejected, the same edge
retried, and the corrected carrier admitted.

#### Missing Components In This Contract

The parser admission contract is missing:

- graph-visible `admission_ref`
- edge-visible binding from `targetAssetType` to the parser admission function
- template/schema artifact that can generate both parser tests and worker
  scaffolds
- round-trip examples published as contract fixtures
- failure-class mapping from parser rejection to lawful re-entry:
  - shape invalid -> `repair_worker_output`
  - status `blocked` -> same-edge retry or residual pressure
  - status `repriced` -> repricing route
- contract digest that lets replay decide whether an older admitted carrier is
  still reusable
- coverage rule proving every close-capable target asset has a parser admission
  binding
- prompt-projection parity test proving the worker was shown the same fixed
  literals the parser enforces

### 5. Assurance And Closure Fold

Current location:

- `build_tenants/typescript/code/src/assurance/component_depth.ts`
- edge assurance/closure code under `operator` and `graph`

Current role:

```yaml
closure_fold:
  required_ledgers:
    - materialization
    - semantic_convergence
    - component_depth
    - requirement_fulfillment
    - edge_gain
  close_when:
    - target carrier admitted
    - required ledgers satisfied
    - no blocking residual pressure remains
```

Why this section is needed:

Closure must consume admitted evidence and ledger rows, not artifact existence
or worker narration. This protects compound traversal from hiding an unclosed
edge behind later artifacts.

#### Missing Components In This Contract

The assurance and closure fold is missing:

- explicit dependency on `target_carrier_contract.admitted`
- explicit nested-carrier close predicate:
  `releaseDepthParity.status == "met"`
- explicit non-close mapping for admitted non-met carrier statuses
- edge-gain metric inputs tied to target carrier fields, not only ledgers
- residual-pressure derivation from carrier statuses and parser defects
- replay rule requiring target carrier contract digest equality
- compound traversal rule that a later artifact cannot hide a target carrier
  contract failure on this edge
- deterministic fast-path authority for pure projection edges
- test asserting closure is impossible when the target asset exists but the
  required target carrier contract is not admitted

## Missing Section

The missing GTL edge section is `target_carrier_contract`.

It should be part of the GTL vector or its product-owned edge assurance payload.
It should bind the target asset type to a typed carrier contract and a worker
template/scaffold reference.

Proposed section:

```yaml
target_carrier_contract:
  targetAssetType: release_depth_parity_surface

  envelope:
    kind: sdlc_component_depth_register
    registerVersion: ts-component-depth-v1
    targetAssetType: release_depth_parity_surface

  carrier:
    path: releaseDepthParity
    kind: sdlc_release_depth_parity_assessment
    required_fields:
      - kind
      - status
      - summary
      - blockingReasons
      - evidenceRefs
    enums:
      status:
        - met
        - blocked
        - repriced

  template_ref: schema-template://odd-sdlc/component_depth_register/release_depth_parity_surface/v1
  admission_ref: evaluator://odd-sdlc/component-depth-register/release-depth-parity/v1
  prompt_projection_ref: prompt-projection://odd-sdlc/component-depth-register/release-depth-parity/v1

  construction_ownership:
    mode: agent_constructed
    agent_may_fill:
      - releaseDepthParity.status
      - releaseDepthParity.summary
      - releaseDepthParity.blockingReasons
      - releaseDepthParity.evidenceRefs
    agent_must_not_change:
      - kind
      - registerVersion
      - targetAssetType
      - releaseDepthParity.kind

  deterministic_projection:
    eligible: true
    projection_inputs:
      - implementation_component_topology_surface
      - component_realization_qualification_surface
      - component_test_qualification_surface
      - component_repair_schedule_surface
      - test_run_archive_surface
    projection_ref: projection://odd-sdlc/release-depth-parity/from-admitted-predecessors/v1
```

Why this section is needed:

1. It turns carrier shape into graph law.

   The edge no longer merely says "produce `release_depth_parity_surface`". It
   says exactly which carrier inside that surface is required and which literals
   are fixed.

2. It removes prompt-only authority.

   Handoff prompts become a projection of the GTL carrier contract. The prompt is
   no longer the place where shape is invented, summarized, or partially copied.

3. It makes parser and worker share one source.

   The parser can reject using the same `admission_ref` that the worker scaffold
   was generated from. The worker sees exact slots; the parser admits exact
   slots.

4. It separates domain judgement from protocol shape.

   The worker may decide whether the parity result is `met`, `blocked`, or
   `repriced`. It must not decide that the carrier kind is
   `sdlc_release_depth_parity_layer` or any other plausible-but-invalid literal.

5. It enables deterministic fast paths.

   If a carrier is purely computed from admitted predecessors, the edge contract
   can declare deterministic projection eligibility. The installed operator can
   then skip an agent call for that edge or ask the agent only for domain
   exceptions.

6. It makes tests direct consumers of design.

   Tests can assert that every edge with `target_carrier_contract` has:
   - a template/scaffold;
   - parser admission;
   - prompt projection;
   - closure fold coverage;
   - round-trip examples for valid and invalid carrier instances.

## Current Contract Rewritten With The Missing Section

```yaml
graph_vector_contract:
  id: vector://odd-sdlc/derive_release_depth_parity_surface
  graph_function: derive_release_depth_parity_surface

  graph_vector:
    from:
      - implementation_component_topology_surface
      - component_realization_qualification_surface
      - component_test_qualification_surface
      - component_repair_schedule_surface
      - test_run_archive_surface
    to:
      - release_depth_parity_surface

  edge_assurance:
    category: repair_archive_release_qualification
    closureClassification: close_capable
    compositionRole: proof
    authorityBasisRefs: RELEASE_REFS
    proofLaneRefs:
      - test://odd-sdlc/t164/release-readiness
    residualPressureRefs:
      - pressure://odd-sdlc/release-depth-parity

  target_carrier_contract:
    targetAssetType: release_depth_parity_surface
    envelope:
      kind: sdlc_component_depth_register
      registerVersion: ts-component-depth-v1
      targetAssetType: release_depth_parity_surface
    carrier:
      path: releaseDepthParity
      kind: sdlc_release_depth_parity_assessment
      required_fields:
        - kind
        - status
        - summary
        - blockingReasons
        - evidenceRefs
      enums:
        status: [met, blocked, repriced]
    template_ref: schema-template://odd-sdlc/component_depth_register/release_depth_parity_surface/v1
    admission_ref: evaluator://odd-sdlc/component-depth-register/release-depth-parity/v1
    prompt_projection_ref: prompt-projection://odd-sdlc/component-depth-register/release-depth-parity/v1
    construction_ownership:
      mode: agent_constructed
      fixed_protocol_fields:
        - kind
        - registerVersion
        - targetAssetType
        - releaseDepthParity.kind
      fillable_domain_fields:
        - releaseDepthParity.status
        - releaseDepthParity.summary
        - releaseDepthParity.blockingReasons
        - releaseDepthParity.evidenceRefs

  closure:
    close_when:
      - target_carrier_contract admitted
      - releaseDepthParity.status == met
      - required assurance ledgers satisfied
      - no required residual pressure remains
    retry_when:
      - target_carrier_contract rejected and retry policy admits repair_worker_output
      - releaseDepthParity.status == blocked
    reprice_when:
      - releaseDepthParity.status == repriced
```

## Adoption Strategy

1. Define a `target_carrier_contract` carrier type.

   This belongs beside the edge assurance contract types because it is part of
   edge closure law, not just worker UX.

2. Add target carrier rows for the test/release edges first.

   Start with edges that produced live drift:
   - `component_test_surface`
   - `component_test_qualification_surface`
   - `component_repair_schedule_surface`
   - `release_depth_parity_surface`
   - `release_surface`

3. Generate worker prompt carrier skeletons from the contract.

   The prompt should include a JSON skeleton with fixed protocol literals
   already filled. The worker fills only declared slots.

4. Bind parser admission to the same contract refs.

   Current parser functions can stay, but each target must advertise its
   `admission_ref` from the edge contract.

5. Add round-trip proof.

   For each target carrier contract:
   - valid skeleton admits;
   - invalid kind rejects;
   - invalid enum rejects;
   - missing required field rejects;
   - prompt projection contains the same fixed literals as parser admission.

6. Declare deterministic projection eligibility.

   Where the target is a pure fold over admitted predecessor carriers, mark the
   edge deterministic and remove the live worker call from the steady-state path.
   Keep the worker as a fallback only when the edge contract declares open-ended
   constructive judgement.

## Acceptance Test Shape

The useful regression is not "hello world converges." The useful regression is:

```text
for each close-capable graph vector:
  graph catalog row exists
  edge assurance row exists
  target carrier contract exists
  parser admission exists
  prompt projection exists
  template/scaffold exists
  valid fixture admits
  invalid protocol literal rejects
  closure cannot proceed without admitted target carrier
```

For the T132/T168 lane, the live proof should additionally show:

```text
design obligations
-> test case rows
-> test data / expected result bindings
-> executable tests
-> execution evidence
-> verification rows
-> co-affirmation ledger
-> release-depth parity
-> release surface
```

That makes tests and implementation co-affirm their interpretation of the same
design assets, and it prevents carrier-shape drift from consuming hours of live
worker time.
