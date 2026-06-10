<!-- ODD_SDLC_BOOTLOADER_START -->
# odd_sdlc Workspace Governance Surface

This workspace contains a target project governed by `odd_sdlc`.
It is not itself a GTL/ABG project in identity terms.
GTL/ABG are the substrate. `odd_sdlc` is the governance/runtime package.
The target project may be imported, partial, stale, or still underdefined.

## 1. Workspace Identity
- workspace: `odd_sdlc`
- project slug: `odd_sdlc`
- platform: `python`
- installed runtime contract: `workspace://.genesis/odd_sdlc/release/genesis.yml`
- normalization report: `workspace://.ai-workspace/runtime/odd_sdlc-workspace-normalization.json`
- ambiguity register: `workspace://.ai-workspace/runtime/odd_sdlc-ambiguity-register.json`
- requirement closure register: `workspace://.ai-workspace/runtime/odd_sdlc-requirement-closure.json`
- project bootstrap: `workspace://.ai-workspace/context/project_bootstrap.md`
- imported authority summary: `workspace://specification/requirements/00-imported-sources.md`

## 2. Agent Operating Rule
- start from project truth, not substrate ontology
- treat `odd_sdlc` as governance over the target project
- do not describe the project itself as a GTL/ABG app
- do not infer project purpose or business identity from repository name, sibling workspaces, template lineage, or methodology examples
- if the project identity is incomplete, say so explicitly
- use imported authority surfaces as the first description of the project

## 3. Read First
- `workspace://.ai-workspace/context/project_bootstrap.md`
- `workspace://specification/INTENT.md`
- `workspace://specification/requirements/00-imported-sources.md`
- `workspace://README.md` (provenance/context only; do not use as primary identity evidence)
- `workspace://.ai-workspace/runtime/odd_sdlc-workspace-normalization.json`
- `workspace://.ai-workspace/runtime/odd_sdlc-ambiguity-register.json`
- `workspace://.ai-workspace/runtime/odd_sdlc-requirement-closure.json`
- `workspace://.genesis/odd_sdlc/release/genesis.yml`
- `/Users/jim/src/apps/abiogenesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`

## 4. Start Here
- inspect the current pipeline state with `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc gaps --scope workspace --workspace .`
- when the operator says `start`, use odd_sdlc only as the domain shell over one admitted start boundary; layered `until converged` execution belongs to the ABG command binding / ABG control loop
- resolve published `graph_function:` and `asset:` targets through `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc query-domain --workspace .`, which publishes `start_target_catalog`, `asset_ownership_index`, and the current `execution_contract_surface` projection when one has been admitted
- if full convergence is requested, pass control to ABG and keep customization in GTL declarations plus governed plugins; do not create an odd_sdlc-local start/retry loop
- deployment, runtime-return, and other side-effect stages only traverse when the active build tenant declares the required technology capability contracts in `project_constraints.yml`
- major ambiguity is always recorded; `project_constraints.yml` declares `ambiguity_risk_appetite`, which governs whether unresolved major ambiguity is carried by `F_P` or escalated to `F_H` unless it is a hard-stop prerequisite
- unresolved live requirements remain active future pressure across iterations; inspect the requirement closure register before claiming completion on a partial wave
- if release/deployment/runtime settle at `pending_evidence` with no returned execution data, treat the run as `construction_complete_pending_execution`, not as fully qualified delivery
- if imported project docs contain historical bootstrap or install commands from older scaffolds, treat them as provenance only; the installed runtime contract above is authoritative for this workspace

## 5. Interpretation Rule
- substrate truth explains how work is executed
- governance truth explains how this project is operated
- imported project sources explain what the project is
- README/bootstrap history and template lineage are provenance unless imported authority makes them project-defining
- repository and sibling-workspace context may explain provenance, but must not be used as project identity evidence

If those layers disagree, imported project authority wins for project identity,
and GTL/ABG plus odd_sdlc govern how work proceeds over that authority.

## 6. Data Mapper Live-Run Boundary
- the purpose of a data_mapper run is to test whether odd_sdlc can build data_mapper, not to build data_mapper from outside the governed sandbox
- generated workspace compile, test, source, lineage, and tenant-stack failures are F_P worksite repair pressure by default
- only patch odd_sdlc when the observed defect is in SDLC framework law, ABG/GTL runtime, prompt/admission/evaluator boundaries, event/replay, projection, closure, or process supervision
- do not add downstream technology-specific knowledge to odd_sdlc source; tenant stack truth belongs in tenant design/spec artifacts and sandbox repairs belong in the active sandbox
- before any data_mapper live run or resume, apply the runbook at `build_tenants/typescript/test_env/live/DATA_MAPPER_LIVE_RUNBOOK.md`
<!-- ODD_SDLC_BOOTLOADER_END -->

<!-- GTL_BOOTLOADER_START -->
# GTL/ABG Source Substrate Reference

This source repository does not carry an installed repo-root `.genesis/`
runtime. GTL/ABG substrate truth is consumed from the sibling `abiogenesis`
source/release line.

Use these source references when substrate detail is needed:

- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/gtl_spec/GTL_BOOTLOADER.md`
- `/Users/jim/src/apps/abiogenesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`

For source-repo execution, bind ABG source explicitly:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc gaps --scope workspace --workspace .
```

Installed `.genesis/` payloads are created only in downstream or sandbox
workspaces by the installer.
<!-- GTL_BOOTLOADER_END -->
