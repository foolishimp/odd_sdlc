# MATRIX: S-037 Fault-Line Synthesis

**Author**: Codex
**Date**: 2026-04-23T00:42:32Z
**Addresses**: S-037 Deliverable 3
**Status**: Open

## Summary

This post synthesizes the recurring fault lines found across the S-037 review
set and maps them to reviewed files and active tickets.

The headline is straightforward:

- the best odd_sdlc modules are typed carrier or projection kernels
- the most fragile modules are the public control surface and the dict-heavy
  triage/closure kernels
- the repo's recurring failures come less from module count and more from
  semantic concentration at controller or open-dict boundaries

## Analysis

### Matrix

| Fault-line category | Files | Why it recurs here | Active ticket linkage |
|---|---|---|---|
| hidden semantic center | [app.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/app.py:350), [triage.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/triage.py:303), [requirement_closure.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/requirement_closure.py:656) | public orchestration or dense rule ladders sit next to effect edges and tempt local reinterpretation | B-035, B-036 |
| split carrier vs controller authority | [app.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/app.py:494), [gap_dossier.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/gap_dossier.py:653), [execution_contract.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/execution_contract.py:794), [start_targeting.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/start_targeting.py:288) | start-path bugs appear when public control stops consuming the dossier/contract carriers and rebuilds meaning locally | B-035, B-036 |
| unstable identity or refresh semantics | [analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/analysis.py:232), [triage.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/triage.py:303), [gap_dossier.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/gap_dossier.py:468), [constructor.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py:1467) | fingerprint currentness, dossier head ordering, and retained legacy branches all change behavior across refresh/publication boundaries | follow-on design work likely from S-037 |
| interface bleed between admission, projection, and public control | [app.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/app.py:350), [gap_dossier.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/gap_dossier.py:545), [query.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/query.py:88) | the risk is not query itself; it is letting projection modules or public controllers take over admission meaning | B-035, B-036 |
| effect leakage or hidden mutation | [homeostatic_loop.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/homeostatic_loop.py:42), [triage.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/triage.py:1044), [analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/analysis.py:232), [constructor.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py:2198) | these files are allowed to write or emit, so the review burden is keeping semantic decisions upstream of the write edge | none direct; review guardrail |
| lawful but over-coupled kernel | [app.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/app.py:544), [triage.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/triage.py:303), [requirement_closure.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/requirement_closure.py:1037), [constructor.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py:752) | high local density is acceptable only while it still preserves one truth path | S-037 follow-on design decisions |
| lawful prime kernel worth preserving | [execution_contract.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/execution_contract.py:54), [start_targeting.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/start_targeting.py:72), [traceability_index.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/traceability_index.py:53), [span_analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:132), [repair_frontier.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/repair_frontier.py:65), [query.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/query.py:88) | these modules mostly consume one source and publish one clear result | preserve; use as reference shape |

### Synthesis

The repo is not failing because it lacks modules. It is failing where one file
simultaneously does too many of these things:

1. classify domain meaning
2. decide public control
3. emit runtime effects
4. patch over missing typing with dict branches

That combination appears most strongly in:

- `app.py`
- `triage.py`
- `requirement_closure.py`

The repo is strongest where one file does one of these things clearly:

- carry typed truth
- publish a bounded read model
- project a derivative context

That is why the best local shapes are:

- `execution_contract.py`
- `start_targeting.py`
- `traceability_index.py`
- `span_analysis.py`

### Ticket Mapping

- `B-035` is the clearest manifestation of split carrier vs controller authority
  in the public start path.
- `B-036` is the continuation/yield version of the same boundary failure:
  controller/public projection threatens to overrule continuation-owned truth.
- `S-037` should remain the review anchor until those two public-boundary bugs
  are closed from source-carrier truth rather than symptom branches.

## Recommended Action

1. Finish `B-035` and `B-036` as carrier-consumption fixes, not controller patch
   exercises.
2. Keep `app.py` thin by pushing decision meaning into `gap_dossier.py` and
   admitted carriers rather than adding more branches to the public wrapper.
3. Treat `triage.py` and `requirement_closure.py` as the next design-method
   tightening targets once the active start/yield bugs are closed.
4. Do not spend effort splitting `constructor.py` unless a true duplicate
   helper family appears. The bigger risk there is residual dual identity, not
   file size.
