# S-037 Review 05: Projections, Frontier, and Materialization

Files reviewed:

- `span_analysis.py`
- `repair_frontier.py`
- `constructor.py`

## span_analysis.py

- purpose: combine raw graph gaps and declared obligation gaps into canonical
  edge-gap truth and span-level summaries
- role: semantic kernel plus projection module

### Prime entry points

- `canonical_edge_gaps(...)`
- `aggregate_edge_gap_truth(...)`
- `span_gap_analysis(...)`

### Sequence: `span_gap_analysis(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Span as span_analysis.py
    participant ABG as gen_gaps
    participant Closure as requirement_closure.py
    participant Triage as triage.py

    Caller->>Span: span_gap_analysis(app, from_edge, to_edge, zoom)
    Span->>ABG: gen_gaps(resolved_scope)
    Span->>Closure: collect_declared_obligation_gaps(...)
    Span->>Span: canonical_edge_gaps(...)
    Span->>Triage: enrich_gap_snapshot(... publish=false)
    Span->>Span: aggregate_edge_gap_truth(...)
    Span-->>Caller: graph view, refined view, summary
```

### Sequence: `canonical_edge_gaps(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Span as span_analysis.py

    Caller->>Span: canonical_edge_gaps(edge_names, raw_graph_gaps, ledger_gaps)
    Span->>Span: align by edge
    Span->>Span: prefer declared gap projection when ledger exists
    Span->>Span: keep graph-only gap when no ledger exists
    Span-->>Caller: canonical edge gaps
```

### Fault lines

- interface bleed: this file must aggregate, not reinvent closure law.
- incomplete migration risk: if it drifts back to raw dict aggregation, it
  recreates a rival closure model beside `requirement_closure.py`.

### Design judgment

Keep the file. The move to typed canonical gap carriers is the right direction.
The stabilization rule is simple: no open-dict convergence logic should return.

## repair_frontier.py

- purpose: derive a deterministic builder-facing repair frontier from the
  published requirement register
- role: projection module

### Prime entry points

- `build_repair_frontier_register(...)`
- `build_repair_frontier_prompt_context(...)`

### Sequence: `build_repair_frontier_register(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Frontier as repair_frontier.py
    participant Register as requirement closure register
    participant Profile as project profile

    Caller->>Frontier: build_repair_frontier_register(workspace_root, requirement_register)
    Frontier->>Profile: load project profile
    Frontier->>Register: classify unmet and preservation ids per lane
    Frontier->>Frontier: derive lawful edit/proof frontiers
    Frontier-->>Caller: repair frontier register
```

### Fault lines

- projection-becoming-policy risk: this file should advise builder focus, not
  become the source of requirement closure truth.

### Design judgment

Keep this file as a downstream projection. It is lawful because it reads the
published requirement register and does not recalculate requirement status.

## constructor.py

- purpose: materialize governed asset surfaces and return attested constructed
  results
- role: constructor/materialization module

### Prime entry points

- `_construct_planned_software_tree(...)`
- `_constructed_content(...)`
- `construct_manifest(...)`

Most other `_construct_*` functions are family-specialized content builders
under the same materialization boundary. They are not individually prime public
entry points, but they do contribute to helper sprawl inside this file.

### Sequence: `_constructed_content(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Constructor as constructor.py

    Caller->>Constructor: _constructed_content(target_asset, workspace_root)
    Constructor->>Constructor: dispatch to one target-specific _construct_* function
    Constructor-->>Caller: content payload
```

### Sequence: `construct_manifest(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Constructor as constructor.py
    participant Files as target asset path
    participant Runtime as workspace runtime events

    Caller->>Constructor: construct_manifest(manifest_path, workspace_root)
    Constructor->>Constructor: load manifest and project profile
    Constructor->>Constructor: resolve target path and operation kind
    alt code surface
        Constructor->>Constructor: replace generated code surface
    else other surface
        Constructor->>Constructor: _constructed_content(...)
        Constructor->>Files: write target asset
    end
    Constructor->>Constructor: attest generated asset contract
    Constructor->>Runtime: publish asset_checkpoint_updated
    Constructor->>Files: write fp result payload
    Constructor-->>Caller: constructed result
```

### Sequence: `_construct_planned_software_tree(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Constructor as constructor.py
    participant Profile as project profile

    Caller->>Constructor: _construct_planned_software_tree(workspace_root)
    Constructor->>Profile: load project profile
    Constructor->>Constructor: derive module names and package paths
    Constructor->>Constructor: build file-content map
    Constructor-->>Caller: planned software tree
```

### Fault lines

- lawful but over-coupled: this file is very large and mixes profile lookup,
  content composition, file materialization, attestation, and event emission.
- helper sprawl inside a prime boundary: many `_construct_*` functions are
  legitimate specializations, but the router file is still doing a lot.
- hidden semantic center risk: medium. If future requirement or route meaning is
  added here, the file will become an unlawful semantic center very quickly.

### Design judgment

Keep `construct_manifest(...)` as the single public materialization boundary.
That is the right shape.

Do not split the file merely because it is long. Split only when a new module
can take one honest role:

- pure content family
- code-surface materialization
- asset attestation

The current main stabilization need is not “more wrappers,” it is “do not let
materialization own domain law.”
