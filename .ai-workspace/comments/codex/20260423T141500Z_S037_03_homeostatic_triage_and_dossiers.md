# S-037 Review 03: Homeostatic Triage, Dossiers, and Constitutional Re-entry

Files reviewed:

- `triage.py`
- `gap_dossier.py`
- `homeostatic_loop.py`

## triage.py

- purpose: classify enriched gap observations into route-binding and
  constitutional-proposal truth, then publish the edge-triage artifact
- role: semantic kernel with embedded effect shell

### Prime entry points

- `enrich_gap_snapshot(...)`
- `_build_edge_projection(...)`
- `_build_triage(...)`
- `_build_constitutional_proposal(...)`
- `_publish_edge_projection(...)`
- `_build_route_binding(...)`

### Sequence: `enrich_gap_snapshot(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Triage as triage.py
    participant Files as published analysis state
    participant Events as event stream

    Caller->>Triage: enrich_gap_snapshot(raw_gap_payload, publish)
    Triage->>Files: load workspace state and analysis manifest
    Triage->>Events: load prior events
    loop each raw gap
        Triage->>Triage: load prior edge triage artifact
        Triage->>Triage: build or reuse edge projection
        opt publish
            Triage->>Events: publish observation/triage/route/constitutional events
            Triage->>Files: write current edge triage artifact
        end
    end
    Triage-->>Caller: enriched gap payload
```

### Sequence: `_build_edge_projection(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Triage as triage.py

    Caller->>Triage: _build_edge_projection(entry, prior, run_id)
    Triage->>Triage: _build_observation(...)
    Triage->>Triage: _build_triage(...)
    Triage->>Triage: semantic hash
    Triage->>Triage: _build_constitutional_proposal(...)
    Triage->>Triage: _build_route_binding(...)
    Triage-->>Caller: current edge projection
```

### Sequence: `_build_triage(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Triage as triage.py

    Caller->>Triage: _build_triage(entry, observation, runtime_config)
    Triage->>Triage: classify framework/reentry layer
    Triage->>Triage: derive authority_basis and realized_basis
    Triage->>Triage: classify outcome kind
    opt fixed or dynamic route
        Triage->>Triage: _assign_route_proposal(...)
    end
    Triage-->>Caller: triage payload
```

### Sequence: `_publish_edge_projection(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Triage as triage.py
    participant Events as runtime event stream
    participant Files as current triage artifact

    Caller->>Triage: _publish_edge_projection(projection, prior)
    Triage->>Events: observation_recorded
    Triage->>Events: triage_produced
    Triage->>Events: route_recorded
    opt constitutional proposal exists
        Triage->>Events: constitutional_proposal_recorded
    end
    opt semantic hash changed
        Triage->>Events: triage_divergence
    end
    Triage->>Files: write current edge triage JSON
    Triage-->>Caller: published projection
```

### Fault lines

- lawful but over-coupled: semantic classification and event publication live in
  one file.
- unstable identity across refresh or reprojection: proposal identity depends on
  what is included in the semantic hash. Small mistakes here cause repeated
  pending gates or false divergence.
- hidden semantic center risk: high. This file decides most of the domain’s
  “what is next?” meaning.

### Design judgment

Keep the file as the homeostatic semantic kernel. Do not move domain meaning up
into `app.py`. The right stabilization move is to keep this file authoritative
and keep publication deterministic.

## gap_dossier.py

- purpose: project canonical gap truth into a published dossier/read model and
  then classify the head dossier into public `next` resolution
- role: projection module plus binding adapter

### Prime entry points

- `project_gap_dossier_input(...)`
- `build_gap_dossier_register(...)`
- `load_gap_dossier_read_model(...)`
- `project_public_next_start_resolution(...)`
- `project_gap_dossier_surface(...)`

### Sequence: `build_gap_dossier_register(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Dossier as gap_dossier.py
    participant Input as GapDossierInput

    Caller->>Dossier: build_gap_dossier_register(workspace_root, gap_input, execution_contract)
    loop each gap row
        Dossier->>Dossier: summarize gap truth
        Dossier->>Dossier: attach observation/triage/route/constitutional fields
        Dossier->>Dossier: attach evidence bundle refs
    end
    Dossier-->>Caller: gap dossier register
```

### Sequence: `project_public_next_start_resolution(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Dossier as gap_dossier.py

    Caller->>Dossier: project_public_next_start_resolution(gap_dossier_surface)
    Dossier->>Dossier: project_unavailable_public_next_start_block(...)
    Dossier->>Dossier: project_pending_constitutional_start_gate(...)
    Dossier->>Dossier: project_blocked_public_next_start_block(...)
    Dossier->>Dossier: project_public_next_start_directive(...)
    Dossier-->>Caller: block, gate, or directive
```

### Sequence: `load_gap_dossier_read_model(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Dossier as gap_dossier.py
    participant Files as published dossier files

    Caller->>Dossier: load_gap_dossier_read_model(workspace_root)
    Dossier->>Files: load published dossier register
    alt published and current
        Dossier->>Dossier: project_gap_dossier_read_model(...)
        Dossier-->>Caller: published read model
    else
        Dossier-->>Caller: unavailable projection
    end
```

### Fault lines

- split carrier vs controller authority: this file must remain projection-only.
  If `app.py` or tests rebuild head-gap truth without this read model, a second
  admission path appears.
- proxy compatibility authority risk: medium. The read-model fallbacks are safe
  only if they remain unavailable projections, not silent rebuilds.

### Design judgment

This is the right place for public `next` head-gap classification. The design is
lawful if public callers consume only the published read model.

## homeostatic_loop.py

- purpose: apply domain-owned constitutional proposals and loop the resulting
  surface change back into homeostatic gap truth
- role: effect shell module

### Prime entry points

- `apply_constitutional_proposal(...)`
- `loopback_homeostatic_gap(...)`

### Sequence: `apply_constitutional_proposal(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Loop as homeostatic_loop.py
    participant Files as target constitutional surface
    participant Events as workspace runtime events
    participant Analysis as analysis.py

    Caller->>Loop: apply_constitutional_proposal(workspace_root, edge, proposal_id)
    Loop->>Files: load current triage artifact and target surface
    Loop->>Files: append application block if missing
    Loop->>Events: constitutional_proposal_approved_with_edits
    Loop->>Events: proposal_applied
    Loop->>Analysis: refresh_analysis(stage=\"proposal_applied\")
    Loop-->>Caller: applied payload
```

### Sequence: `loopback_homeostatic_gap(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Loop as homeostatic_loop.py
    participant Events as workspace runtime events

    Caller->>Loop: loopback_homeostatic_gap(app, edge, proposal_id, post_gap_payload)
    Loop->>Events: derivation_reopened
    alt gap retired
        Loop->>Events: gap_retired
        Loop-->>Caller: retired result
    else still open
        Loop->>Events: gap_event
        Loop-->>Caller: still_open result
    end
```

### Fault lines

- incorrect boundary ownership: if this path is implemented through a generic
  ABG approval helper, odd_sdlc loses ownership of constitutional meaning.
- unstable identity across refresh: if proposal identity is not stable,
  application can republish a new pending gate instead of progressing lawfully.

### Design judgment

Keep this as an odd_sdlc-owned effect shell. The file exists for a real prime
boundary: constitutional application is domain law, not generic runtime law.
