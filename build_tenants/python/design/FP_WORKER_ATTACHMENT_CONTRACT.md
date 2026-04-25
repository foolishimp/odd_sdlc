# F_P Worker Attachment Contract

**Status**: Ratified
**Implements**: REQ-F-ODDSDLC-003, REQ-F-ODDSDLC-029
**Ticket**: B-055

## Claim

Public `odd_sdlc start --target next --until converged` treats F_P worker
readiness as admitted runtime truth, not as an inferred queue side effect.

## Carrier

The authoritative projection is `odd_sdlc.fp_worker_attachment`.

It is derived from the installed runtime config and currently admits one
attachment contract:

- `transport_contract`

An installed workspace with no `transport_contract` is `unattached`. Public
start returns:

- `blocking_reason=fp_worker_unattached`
- `stop_predicate=worker_attachment_required`
- `stopped_by=worker_attachment`

The result carries the worker attachment projection so the operator can see
which runtime truth is missing.

## Boundary

ABG remains the owner of F_P dispatch, runtime events, result ingest,
continuation, and re-entry.

`odd_sdlc` does not start a worker loop. It only refuses to treat an F_P
handoff as progress in an installed workspace until the worker attachment
contract is present.

## Proof Rule

Closure requires both paths:

- no installed `transport_contract` returns the typed worker-unattached public
  result without invoking a worker
- an installed test `transport_contract` can consume one F_P dispatch through
  the normal ABG transport and result ingress
