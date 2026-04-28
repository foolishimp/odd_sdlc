---
id: T-062
title: Reprice TypeScript install for cold-agent bootloader operation
type: defect
ticket_category: corrective_followup
status: completed
goal: future-full-python-replacement-rc
change_intent: Make odd_sdlc.TS install create the same operator-discoverable instruction surface proven by odd_sdlc.python.install and ABG bootloader delivery, so a cold agent can answer `gaps` and `start` from target-local guidance.
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: TypeScript install requirements, AGENTS.md/CLAUDE.md bootloader injection, install manifest evidence, cold-agent command grammar
priority: high
triaged_at: 2026-04-27T01:41:42Z
created_at: 2026-04-27T01:41:42Z
updated_at: 2026-04-27T01:41:42Z
completed_at: 2026-04-27T01:41:42Z
dependencies:
  - T-059 completed
  - T-061 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: operator review of `data_mapper.test46.ts` install found no root `CLAUDE.md` or `AGENTS.md`, so a cold Claude/Codex session would not know that `gaps` and `start` map to installed odd_sdlc.TS commands.
target_truth: install is not complete until the target workspace contains marker-governed `AGENTS.md` and `CLAUDE.md` sections that identify odd_sdlc.TS governance, installed `.abiogenesis/odd_sdlc/typescript` payloads, read-first surfaces, and exact installed command grammar for `gaps` and `start`.
superseded_truth: writing `.ai-workspace/context/odd_sdlc_typescript_bootstrap.md` alone is enough operator bootstrap evidence.
triage_finding: requirements were underdefined for TypeScript install; REQ-F-ODDSDLC-007 named AGENTS/CLAUDE in broad terms but did not bind cold-agent command operation, marker replacement, installed command grammar, or manifest proof.
closure_law: close only when requirements, design, installer code, tests, and a data_mapper.test46.ts reinstall prove target-root instruction files exist and contain the installed `gaps` and `start` command grammar.
---

# T-062: Cold-Agent Install Bootloader

## Triage

The lawful re-entry point is `requirements`.

The defect is not a TypeScript formatting miss. It is an install contract gap.
The Python installer writes root `AGENTS.md` and `CLAUDE.md` sections with
operator commands and workspace interpretation rules. ABG TypeScript also has a
bootloader delivery surface for marker-governed instruction-file injection.

The TypeScript odd_sdlc installer wrote only a context note. That made the
installed workspace command-functional but not cold-agent functional.

## Requirement Gap

`REQ-F-ODDSDLC-007` requires `CLAUDE.md` and `AGENTS.md`, but the TypeScript
acceptance bar needs to say:

- target-root instruction files are install evidence, not optional docs
- marker-governed replacement preserves unrelated existing guidance
- `gaps` maps to `node_modules/.bin/odd-sdlc-ts gaps --workspace .`
- `start` maps to `node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked`
- manifest evidence records instruction-file verification

## Completion Record

Changed:

- `specification/requirements/08-odd-sdlc-first-slice.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md`
- `build_tenants/typescript/code/src/install/`
- `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`

Verification:

- `npm run test:t059` passed: 4 tests.
- `npm run test:semantic` passed: 73 tests.
- `npm run lint:semantic` passed.
- clean `data_mapper.test46.ts` reinstall wrote root `AGENTS.md` and `CLAUDE.md`
  with `ODD_SDLC_BOOTLOADER` markers, installed `gaps` / `start` command
  grammar, and manifest `instructionFiles[].verified=true`.
- installed `node_modules/.bin/odd-sdlc-ts gaps --workspace .` passed.
- installed `node_modules/.bin/odd-sdlc-ts start --workspace . --target next
  --until blocked` passed and lawfully returned `fp_worker_unattached`.
