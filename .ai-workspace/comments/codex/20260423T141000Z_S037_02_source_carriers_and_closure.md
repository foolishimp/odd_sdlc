# S-037 Review 02: Source Carriers and Closure Family

Files reviewed:

- `analysis.py`
- `traceability_index.py`
- `requirement_closure.py`

## analysis.py

- purpose: publish the deterministic workspace-state and analysis identity that
  all later read models depend on
- role: effect shell module with a small projection aspect

### Prime entry points

- `build_analysis_manifest(...)`
- `write_analysis_manifest(...)`
- `write_workspace_state(...)`
- `refresh_analysis(...)`
- `ensure_workspace_ready(...)`

### Sequence: `refresh_analysis(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Analysis as analysis.py
    participant Ambiguity as ambiguity register
    participant Trace as requirement_closure.py
    participant Frontier as repair_frontier.py
    participant Files as published runtime files

    Caller->>Analysis: refresh_analysis(workspace_root, stage)
    Analysis->>Ambiguity: build ambiguity register
    Analysis->>Trace: build requirement closure register
    Analysis->>Trace: build prompt context from register
    Analysis->>Frontier: build repair frontier from requirement register
    Analysis->>Files: write published artifacts
    Analysis->>Analysis: write analysis manifest
    Analysis->>Analysis: write workspace state
    Analysis-->>Caller: ready workspace payload
```

### Sequence: `ensure_workspace_ready(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Analysis as analysis.py
    participant Files as published workspace state

    Caller->>Analysis: ensure_workspace_ready(workspace_root)
    Analysis->>Files: load published workspace state
    alt current and ready
        Analysis-->>Caller: workspace state
    else unpublished or stale
        Analysis-->>Caller: runtime error with explicit refresh instruction
    end
```

### Fault lines

- lawful but over-coupled: `refresh_analysis(...)` is a large publication
  pipeline. It is acceptable because it is an effect shell, but it is a
  pressure point for hidden authority if later semantic decisions are moved into
  it.
- hidden semantic center risk: low at present. The file mostly writes published
  outputs and does not itself decide route or closure meaning.

### Design judgment

Keep the file. Its prime purpose is valid: one explicit publication boundary for
current analysis identity. Refactor only if semantic law drifts into it.

## traceability_index.py

- purpose: build the authoritative requirement-traceability source carrier from
  workspace surfaces
- role: carrier module plus semantic-kernel builder

### Prime entry points

- `build_requirement_traceability_index(...)`
- `traceability_source_scan(...)`
- `requirement_family_traceability_publication(...)`

### Sequence: `build_requirement_traceability_index(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Index as traceability_index.py
    participant Scan as traceability_source_scan
    participant Family as requirement_family_traceability_publication
    participant Files as requirement and trace surfaces

    Caller->>Index: build_requirement_traceability_index(workspace_root)
    Index->>Scan: scan source and test files
    Index->>Family: inspect active requirement family publication
    Index->>Files: collect authority/current/surface refs
    Index-->>Caller: RequirementTraceabilityIndex
```

### Sequence: `traceability_source_scan(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Scan as traceability_index.py
    participant Code as code root

    Caller->>Scan: traceability_source_scan(workspace_root)
    Scan->>Code: iterate source files
    Scan->>Code: collect Implements:/Validates: tags
    Scan-->>Caller: TraceabilitySourceScan
```

### Sequence: `requirement_family_traceability_publication(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Family as traceability_index.py
    participant Files as requirement family markdown

    Caller->>Family: requirement_family_traceability_publication(workspace_root)
    Family->>Files: read active family headers
    Family->>Files: validate carry and authoring design refs
    Family-->>Caller: RequirementFamilyTraceabilityPublication
```

### Fault lines

- helper sprawl inside a prime boundary: many path and parsing helpers exist,
  but they still serve one coherent carrier-builder purpose.
- incomplete migration risk: if downstream modules read raw files again instead
  of consuming `RequirementTraceabilityIndex`, this file stops being
  authoritative.

### Design judgment

Keep the file as the source carrier boundary. The design is lawful. The main
discipline needed is downstream consumption, not another internal wrapper layer.

## requirement_closure.py

- purpose: project requirement closure and edge-obligation truth from the
  traceability index and publish fail-closed read models
- role: semantic kernel plus projection module

### Prime entry points

- `_build_requirement_closure_register_from_index(...)`
- `build_requirement_closure_register(...)`
- `declared_requirement_edge_gap(...)`
- `obligation_gap_from_declaration(...)`
- `collect_declared_obligation_gaps(...)`
- `load_requirement_closure_register_read_model(...)`

### Sequence: `_build_requirement_closure_register_from_index(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Closure as requirement_closure.py
    participant Index as RequirementTraceabilityIndex

    Caller->>Closure: _build_requirement_closure_register_from_index(index)
    Closure->>Index: read authority/current/surface refs
    Closure->>Index: read source scan and family publication
    Closure->>Closure: build per-requirement entries
    Closure->>Closure: aggregate summary counts and traceability gaps
    Closure-->>Caller: requirement closure register
```

### Sequence: `declared_requirement_edge_gap(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Closure as requirement_closure.py
    participant Index as RequirementTraceabilityIndex
    participant Register as closure register

    Caller->>Closure: declared_requirement_edge_gap(workspace_root, declaration, edge)
    Closure->>Index: build_requirement_traceability_index()
    Closure->>Register: _build_requirement_closure_register_from_index(index)
    Closure->>Closure: derive expected ids, carried ids, extra ids
    Closure->>Closure: build edge obligation ledger
    Closure-->>Caller: declared edge gap
```

### Sequence: `collect_declared_obligation_gaps(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Closure as requirement_closure.py

    Caller->>Closure: collect_declared_obligation_gaps(workspace_root, declarations_by_edge)
    loop each declared edge
        Closure->>Closure: obligation_gap_from_declaration(...)
    end
    Closure-->>Caller: declared obligation gaps
```

### Sequence: `load_requirement_closure_register_read_model(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Closure as requirement_closure.py
    participant Files as published register

    Caller->>Closure: load_requirement_closure_register_read_model(workspace_root)
    Closure->>Files: load published register
    alt published current register exists
        Closure-->>Caller: published register
    else
        Closure-->>Caller: unavailable projection
    end
```

### Fault lines

- lawful but over-coupled: this file mixes register building, edge-ledger
  projection, prompt-context generation, and published read-model loading.
- hidden semantic center risk: medium. Requirement closure truth and edge
  obligation truth both accumulate here, so future controller bypasses tend to
  orbit this file.
- interface bleed risk: high whenever downstream code uses internal builder
  functions instead of the published read model.

### Design judgment

The core design is right: one traceability-derived closure family. The next
stabilization pressure is not “split this file because it is long” but “keep
public consumers on the published read model and keep edge-obligation truth as a
projection over the same source carrier.”
