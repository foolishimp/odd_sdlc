---
id: T-118
title: Slim worker invocation packages and archive full manifests by reference
type: performance
ticket_category: worker_context_packaging
status: backlog
review_status: pending
goal: typescript-rc-live-lane-performance-and-worker-readability
build_tenant: typescript
owner: unassigned
change_intent: Replace large live worker handoff reads with a compact invocation package while retaining the full handoff manifest as archived forensic truth.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: worker_prompt.md, handoff_manifest.json, traversal_intent_package.json, fp_transform_request.json, process://claude worker contract, live data-mapper lane
priority: high
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-04
governance_scope: STDO Method
depends_on:
  - T-107 split operator handoff into prime domain modules
  - T-112 complete semantic lifecycle over abg35 substrate
  - T-114 worker_result_report demotion from closure authority
intake_source: T-109 data-mapper PTY live run showed Claude attempting to read a 445 KB handoff_manifest.json and hitting its 256 KB file read ceiling before falling back to traversal_intent_package.json. The full manifest is useful forensic evidence but too large as the primary worker-facing package.
target_truth: Workers receive a compact invocation package containing only the authoritative edge contract, output contract, immediate obligations, current retry frontier, allowed write roots, and compact refs to prior assets. The full manifest remains archived and addressable by reference, but workers are not instructed to read it wholesale.
superseded_truth: The full handoff manifest is both the forensic archive and the worker-facing primary package.
closure_law: This ticket closes only when the worker-facing package is compact by construction and the full manifest remains available as archive evidence without being the normal read path.
evaluation_criteria:
  - compact package size is bounded and measured in the archive
  - full manifest is still written for forensics
  - worker prompt points to compact package first
  - compact package includes typed refs to full manifest, traversal intent, retry frontier, output file, report file, and allowed write roots
  - live worker no longer attempts to read full handoff_manifest.json by default
  - postflight and assurance logic continue to consume typed outputs, not worker narrative
proof_surface:
  - deterministic test asserting compact package fields and size budget
  - fixture where full handoff_manifest exceeds 256 KB but compact package remains readable
  - live data-mapper archive showing no failed full-manifest read before worker output
non_closure_conditions:
  - deleting or truncating the forensic handoff manifest
  - compact package omits retry-frontier or obligation context needed for lawful repair
  - prompt still instructs worker to read the full manifest as the default first step
  - closure authority moves into the compact package narrative
---

# T-118: Slim Worker Invocation Packages

## STDO Triage

The missing layer is realization packaging. ABG owns runtime execution truth;
odd_sdlc owns the software-domain handoff package it gives a worker for one
edge.

The fix is not to remove evidence. The fix is to separate worker-readable input
from forensic archive truth.
