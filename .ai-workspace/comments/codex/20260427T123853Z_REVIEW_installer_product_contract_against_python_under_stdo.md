# Review: Installer Product Contract Against Python Under STDO

**Date**: 2026-04-27
**Reviewer**: codex
**Scope**: ABG installed substrate requirements, odd_sdlc installed product requirements, T-063/T-077/T-078/T-079, compared against Python ABG and Python odd_sdlc installer behavior.

## Verdict

Partial, not complete.

The new product-level move is correct. The installer is now treated as product
behavior rather than helper behavior, and the ABG/odd_sdlc ownership split is
much cleaner than the Python line.

But the new requirements still do not fully capture the useful Python installer
capability. The current product law catches the substrate root, manifests,
command bindings, installed standards references, cold-agent instruction files,
and sandbox proof. It under-specifies several Python-proven features:

- full method distribution copy, not only a short standards subset
- starter project scaffold decision for clean targets
- install event/provenance emission
- public verify/doctor behavior
- odd_sdlc normalization/read-model assets required by cold agents
- runtime contract wiring as an installed product obligation
- persistent archive detail at the downstream product layer

## STDO Reading

**S: Specification**

Good: installer behavior has moved into `PRODUCT.md` and live requirement
families:

- `abiogenesis/specification/requirements/product/REQ-P-INSTALL.md`
- `odd_sdlc/specification/requirements/14-odd-sdlc-installed-product-contract.md`

Gap: several Python-backed product behaviors are still only implicit in Python
tests/code or older requirements. The new installer requirements should either
adopt them or explicitly reject them.

**T: Ticket**

Good: T-063 now acts as a cross-boundary RC blocker inventory, and ABG-owned
work is split into ABG tickets:

- `abiogenesis/.ai-workspace/tickets/backlog/T-077-...`
- `abiogenesis/.ai-workspace/tickets/backlog/T-078-...`
- `abiogenesis/.ai-workspace/tickets/backlog/T-079-...`

Gap: there is no single ABG ticket to re-review the entire TypeScript installer
against `REQ-P-INSTALL` and the Python `gen-install.py` feature baseline. T-079
only covers standards copy. T-078 covers rerun/idempotency. T-077 covers archive
API. That leaves install event, verify mode, starter scaffold, and full docs
distribution as unowned unless folded into one of those tickets.

**D: Design Module Method**

No implementation closure is currently lawful. T-079 correctly requires design
and module surfaces before code, but the product requirements still need the
full carrier inventory:

- installed standards source/root/file inventory
- install manifest and installer manifest carrier fields
- install event/provenance emission
- instruction-file delivery state
- verify/doctor result carrier if retained
- clean-target scaffold mode versus imported-target mode

**O: ODD Method**

Good: the split avoids moving odd_sdlc domain HOW into ABG. ABG owns substrate
truth; odd_sdlc owns product/domain install truth.

Gap: odd_sdlc installed behavior still risks looking like imperative installer
magic unless its normalization/read-model assets are explicitly declared as
domain product carriers. Python proves these are operationally important:
project bootstrap, normalization report, ambiguity register, requirement closure
register, analysis manifest, runtime contract, and public command projections.

## Python Feature Baseline

### ABG Python Installer

Reference:

- `abiogenesis/build_tenants/abiogenesis/python/code/gen-install.py`
- `abiogenesis/build_tenants/abiogenesis/python/code/genesis/install.py`
- `abiogenesis/build_tenants/abiogenesis/python/test_env/tests/sandbox_runtime.py`
- `abiogenesis/build_tenants/abiogenesis/python/test_env/tests/test_sandbox_install.py`

Python ABG installs or proves:

- `.genesis/genesis/` engine modules
- `.genesis/gtl/` GTL modules
- `.genesis/docs/README.md`
- `.genesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`
- `.genesis/docs/USER_GUIDE.md`
- `.genesis/docs/GTL_BOOTLOADER.md`
- full `.genesis/docs/standards/` copy via `copytree`
- `.genesis/genesis.yml`
- `.ai-workspace/` runtime/event/context/review/comment skeleton
- project-owned starter `specification/`, `docs/`, and `build_tenants/`
- marker-governed `AGENTS.md` and `CLAUDE.md` GTL bootloader sections
- `genesis_installed` event
- `--verify` mode checking engine, GTL, docs, standards, instruction files, and config
- sandbox archive capture of install result and installed command execution

### odd_sdlc Python Installer

Reference:

- `odd_sdlc/build_tenants/python/code/odd_sdlc/release/install.py`
- `odd_sdlc/build_tenants/python/code/odd_sdlc/install_topology.py`
- `odd_sdlc/build_tenants/python/test_env/tests/test_odd_sdlc_installation.py`
- `odd_sdlc/build_tenants/python/test_env/tests/run_archive.py`

Python odd_sdlc installs or proves:

- calls ABG Python installer first
- product payload under `.genesis/odd_sdlc/python/code`
- product design assets under `.genesis/odd_sdlc/python/design`
- runtime contract under `.genesis/odd_sdlc/release/genesis.yml`
- kernel config wire-up to that runtime contract
- workspace normalization over imported/stale targets
- project bootstrap read model at `.ai-workspace/context/project_bootstrap.md`
- normalization report
- ambiguity register
- requirement closure register
- analysis manifest and workspace-state projection
- marker-governed `AGENTS.md` and `CLAUDE.md` odd_sdlc sections
- cold-agent start/gaps commands
- explicit `fp_worker_unattached` behavior
- installed `gaps`, `gaps --format json`, and `start` public command tests
- installed start-target catalog / asset ownership proof
- data_mapper iterative realization continuity proof
- persistent run archives with event sequence, manifests, results, snapshots, stdout/stderr, run metadata, and summary

## Findings

### 1. High: ABG requirements under-specify the full installed method distribution.

`REQ-P-INSTALL-021` requires only a minimum subset of standards. Python copies
the entire standards tree, including templates and secondary method surfaces.

This matters because the stated reason for installed standards is cold-agent
reference. Cold agents need more than `SPEC_METHOD`, `TICKET_METHOD`,
`DESIGN_MODULE_METHOD`, and `ODD_METHOD` in real work. `POSTING_GUIDE`,
`GLOSSARY_GUIDE`, templates, and future standards are part of the installed
method distribution pattern.

Recommendation: change ABG requirement from "minimum list" to "copy the full
standards tree", with the minimum list retained only as smoke/assertion
coverage.

### 2. High: clean-target project scaffold behavior is not decided.

Python ABG `gen-install.py` seeds starter project surfaces:

- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/GOALS.md`
- `specification/requirements/`
- `docs/README.md`
- `build_tenants/TENANT_REGISTRY.md`
- starter tenant design/code templates

The new ABG `REQ-P-INSTALL` does not adopt this and does not explicitly reject
it. That is an authority gap, not a TypeScript implementation detail.

Recommendation: add an ABG requirement that distinguishes install modes:

- imported target: preserve and only add substrate
- clean target: either scaffold starter project surfaces or explicitly return a
  typed "no project authority" condition

### 3. Medium: install event/provenance is missing from ABG product law.

Python emits `genesis_installed` into `.ai-workspace/events/events.jsonl`.
`REQ-P-INSTALL` requires event roots but not an install event or provenance
record.

Recommendation: require an installed-substrate event with version/package,
target, command bindings, manifest refs, standards-copy evidence, and installer
runtime identity.

### 4. Medium: public verify/doctor behavior is missing.

Python has `gen-install.py --verify`. The new TypeScript requirements require
archive proof and manifests but do not require an operator-facing verification
command.

Recommendation: decide whether TypeScript keeps a public verify command. If
yes, define the carrier. If no, explicitly state manifest/archive proof is the
replacement.

### 5. High: odd_sdlc installed contract under-specifies operational read models.

The new odd_sdlc contract requires cold-agent files and command sanity, but
Python proves a larger installed-state surface is operationally required:

- project bootstrap
- normalization report
- ambiguity register
- requirement closure register
- analysis manifest
- workspace-state projection
- runtime contract

Some of this exists in older requirements, but the installed product contract
does not cross-reference it tightly enough.

Recommendation: add acceptance criteria or explicit cross-references under
`REQ-F-ODDSDLC-047` and `REQ-F-ODDSDLC-049` for those installed read models.

### 6. Medium: odd_sdlc runtime contract wiring is not explicit enough.

Python writes the domain runtime contract and wires the ABG kernel config to it.
The new contract names command bindings and product payload but does not state
that an installed odd_sdlc workspace must bind ABG substrate to the odd_sdlc
runtime contract.

Recommendation: add a requirement that the installed product manifest and
bootstrap state prove the ABG-to-odd_sdlc runtime contract binding.

### 7. Medium: downstream archive requirements are weaker than Python proof.

ABG `REQ-P-INSTALL-041` requires installer archive/postmortem proof. odd_sdlc
`REQ-F-ODDSDLC-049` requires install proof contents, but not the full Python
run-archive shape: stdout/stderr, event sequence, manifest/result files,
runtime snapshots, run metadata, and summary.

Recommendation: odd_sdlc should require persistent archive proof for installed
sandbox/data_mapper lanes, not only command sanity and manifest presence.

### 8. Low: the `.abiogenesis` rename is governed enough.

The Python baseline uses `.genesis`; the new law uses `.abiogenesis`. That is
fine. The new requirements correctly distinguish the current topology instead
of copying the Python name.

## Completeness Assessment

ABG installed substrate contract:

- Correctly captures: substrate root, package/command identity, manifests,
  runtime identity, event/projection roots, installed standards concept,
  idempotency requirement, archive requirement, downstream substrate ownership.
- Missing or undecided: full standards tree, docs/bootloader distribution,
  starter project scaffold mode, install event, public verify mode, holistic
  re-review ticket against Python.

odd_sdlc installed product contract:

- Correctly captures: ABG substrate consumption, product/tenant topology,
  cold-agent instruction files, `gaps`/`start`, installed standards reference,
  sandbox/data_mapper proof, gap ownership.
- Missing or under-cross-referenced: runtime contract binding, normalization
  assets, project bootstrap, ambiguity/requirement closure registers, analysis
  manifest/workspace state, installed public start-target/catalog proof,
  persistent archive shape.

## Recommended Next Work

1. Add one ABG backlog ticket for full `REQ-P-INSTALL` / Python `gen-install.py`
   parity review. T-079/T-078/T-077 are necessary but not exhaustive.
2. Amend `REQ-P-INSTALL` to require the full standards tree or explicitly
   justify a subset.
3. Amend `REQ-P-INSTALL` to decide clean-target starter scaffold behavior.
4. Amend `REQ-P-INSTALL` to require install event/provenance and decide
   verify/doctor behavior.
5. Amend `REQ-F-ODDSDLC-047` / `REQ-F-ODDSDLC-049` to name the installed
   operational read models and runtime contract binding.
6. Keep Python as capability precedent, not architecture precedent: the
   TypeScript implementation should consolidate these features into typed
   carriers and graph/ABG-owned proof rather than copying the imperative
   installer shape.
