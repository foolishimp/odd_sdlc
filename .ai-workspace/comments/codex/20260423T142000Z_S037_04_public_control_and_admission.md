# S-037 Review 04: Public Control, Target Binding, and Admission

Files reviewed:

- `app.py`
- `start_targeting.py`
- `execution_contract.py`
- `query.py`

## app.py

- purpose: expose the public odd_sdlc control surface and bind public commands
  to published carriers and admitted execution
- role: binding/adapter module with public control logic

### Prime entry points

- `bootstrap(...)`
- `catalog(...)`
- `gaps(...)`
- `_resolve_public_next_iteration(...)`
- `_run_public_next_start(...)`
- `start(...)`

### Sequence: `gaps(...)`

```mermaid
sequenceDiagram
    participant Operator
    participant App as app.py
    participant Span as span_analysis.py
    participant Gap as _build_gap_surface

    Operator->>App: gaps(scope, from_edge?, to_edge?)
    alt span request
        App->>Span: span_gap_analysis(...)
        Span-->>Operator: span view
    else workspace request
        App->>Gap: _build_gap_surface(publish=true)
        Gap-->>Operator: gap dossier surface
    end
```

### Sequence: `_resolve_public_next_iteration(...)`

```mermaid
sequenceDiagram
    participant App as app.py
    participant Dossier as gap_dossier.py
    participant Contract as execution_contract.py

    App->>Dossier: load_gap_dossier_read_model(...)
    App->>Dossier: project_public_next_start_resolution(...)
    alt pending constitutional gate
        App-->>App: publish fh_gate_pending
        App-->>Caller: blocked result
    else blocked by read-model state
        App-->>Caller: blocked result
    else directive
        App->>Contract: admit_bound_execution_start(...)
        Contract-->>App: bound execution start
    end
```

### Sequence: `_run_public_next_start(...)`

```mermaid
sequenceDiagram
    participant Operator
    participant App as app.py
    participant Loop as homeostatic_loop.py
    participant Analysis as analysis.py
    participant ABG as abiogenesis

    Operator->>App: start(target=\"next\", until=\"converged\")
    loop each iteration
        App->>App: _resolve_public_next_iteration(...)
        alt blocked pending_fh and human-proxy
            App->>Loop: apply_constitutional_proposal(...)
            App->>Analysis: republish homeostatic surface
        else admitted directive
            App->>ABG: gen_start / auto dispatch
            alt traversal or dispatch changed workspace
                App->>Analysis: republish homeostatic surface
            else yield or stop
                App-->>Operator: public result
            end
        else blocked
            App-->>Operator: blocked result
        end
    end
```

### Sequence: `start(...)`

```mermaid
sequenceDiagram
    participant Operator
    participant App as app.py
    participant Contract as execution_contract.py
    participant ABG as abiogenesis

    Operator->>App: start(scope, target, until, fh_mode, root_mode)
    App->>App: ensure_workspace_ready(...)
    alt target == next
        App->>App: _run_public_next_start(...)
        App-->>Operator: public next result
    else explicit target
        App->>Contract: admit_bound_execution_start(...)
        App->>ABG: gen_start or converged runner
        App-->>Operator: result
    end
```

### Fault lines

- hidden semantic center: highest-risk file in the core. If domain meaning is
  invented here instead of consumed from `gap_dossier.py` and
  `execution_contract.py`, migrations regress immediately.
- incorrect boundary ownership: any use of generic ABG FH helpers for
  constitutional progression is wrong in this file.
- incomplete migration: historical bugs in this wave were exactly controller
  bypasses inside `app.py`.

### Design judgment

Keep `app.py` thin. Its lawful job is orchestration and binding, not domain
meaning. Every future bug fix here should start by asking whether the missing
truth belongs in a carrier/projection file instead.

## start_targeting.py

- purpose: publish the start-target catalog and bind published target handles to
  GTL start targets
- role: binding/adapter module

### Prime entry points

- `graph_function_entries(...)`
- `published_start_target_catalog(...)`
- `published_asset_ownership_index(...)`
- `resolve_start_target(...)`

### Sequence: `published_start_target_catalog(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Targeting as start_targeting.py
    participant GTL as module graph_functions/jobs

    Caller->>Targeting: published_start_target_catalog(module)
    Targeting->>GTL: graph_function_entries(module)
    Targeting->>Targeting: classify carrier class and start addressability
    Targeting-->>Caller: published start target catalog
```

### Sequence: `published_asset_ownership_index(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Targeting as start_targeting.py
    participant Assets as workspace_assets

    Caller->>Targeting: published_asset_ownership_index(workspace_root, module)
    Targeting->>Targeting: published_start_target_catalog(module)
    Targeting->>Assets: bootstrap_assets(workspace_root)
    Targeting->>Targeting: map assets to governing operator target
    Targeting-->>Caller: asset ownership index
```

### Sequence: `resolve_start_target(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Targeting as start_targeting.py
    participant Catalog as published target catalog
    participant Index as published asset ownership index

    Caller->>Targeting: resolve_start_target(workspace_root, module, raw_target)
    alt raw_target == next
        Targeting-->>Caller: StartTarget.next()
    else graph_function handle
        Targeting->>Catalog: validate published handle
        Targeting-->>Caller: resolved graph_function target
    else asset handle
        Targeting->>Index: validate asset ownership and route contract
        Targeting-->>Caller: resolved asset target
    end
```

### Fault lines

- proxy compatibility authority risk: low if this file only consumes published
  catalogs.
- hidden GTL reinvention risk: medium if raw controller code skips these
  published catalogs and rebuilds target identity by convention.

### Design judgment

This file is prime and lawful. It is the correct adapter boundary between GTL
publication and public odd_sdlc targeting.

## execution_contract.py

- purpose: admit a typed execution basis from a published target and bind it to
  an executable start scope
- role: carrier module plus admission boundary

### Prime entry points

- `derive_execution_contract_surface(...)`
- `admit_execution_contract_surface(...)`
- `bound_execution_start_from_contract(...)`
- `admit_bound_execution_start(...)`

### Sequence: `derive_execution_contract_surface(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Contract as execution_contract.py
    participant Targeting as start_targeting.py
    participant Events as runtime event stream

    Caller->>Contract: derive_execution_contract_surface(raw_target, next_edge_override?)
    alt raw_target == next with no override
        Contract-->>Caller: ValueError
    else
        Contract->>Targeting: resolve_start_target(...)
        Contract->>Contract: build source and target carriers
        Contract->>Events: execution_contract_drafted
        Contract-->>Caller: DraftExecutionContract
    end
```

### Sequence: `admit_execution_contract_surface(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Contract as execution_contract.py
    participant Files as execution contract register/context
    participant Events as runtime event stream

    Caller->>Contract: admit_execution_contract_surface(...)
    Contract->>Contract: derive_execution_contract_surface(...)
    Contract->>Contract: validate draft
    alt invalid
        Contract->>Files: write rejected contract
        Contract->>Events: execution_contract_rejected
        Contract-->>Caller: ValueError
    else valid
        Contract->>Files: write admitted contract
        Contract->>Events: execution_contract_admitted
        Contract-->>Caller: AdmittedExecutionContract
    end
```

### Sequence: `bound_execution_start_from_contract(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Contract as execution_contract.py
    participant Scope as current scope/module

    Caller->>Contract: bound_execution_start_from_contract(scope, admitted contract)
    Contract->>Contract: pattern-match admitted target variant
    alt graph_function or asset
        Contract->>Scope: inject target job if needed
    else next
        Contract->>Scope: override diagnostic edge from contract
    end
    Contract-->>Caller: BoundExecutionStart
```

### Fault lines

- incomplete migration risk: if any caller still admits raw `next` without a
  published override, this boundary is bypassed.
- lawful but over-coupled: carrier definitions and file publication live in one
  file, but this is acceptable because admission is one prime boundary.

### Design judgment

This is the right hard-break surface. The explicit rejection of raw
`target == next` without a published override is a stabilizing design choice and
should remain.

## query.py

- purpose: expose read-only domain projections to operator tooling and other
  consumers
- role: projection module

### Prime entry point

- `query_domain(...)`

### Sequence: `query_domain(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Query as query.py
    participant App as app.catalog()
    participant Dossier as gap_dossier.py

    Caller->>Query: query_domain(app)
    Query->>App: catalog(app)
    Query->>Dossier: load_gap_dossier_read_model(workspace_root)
    Query-->>Caller: aggregated domain read model
```

### Fault lines

- interface bleed risk: if `query.py` begins rebuilding missing truth instead of
  loading published read models, it becomes a semantic center.

### Design judgment

Keep this file as a thin projection aggregator. It is lawful only while it
remains read-only and fail-closed.
