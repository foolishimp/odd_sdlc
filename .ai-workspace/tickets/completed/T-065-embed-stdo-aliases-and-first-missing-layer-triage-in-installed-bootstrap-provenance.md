---
id: T-065
title: Embed STDO aliases and first-missing-layer triage in installed bootstrap provenance
type: bug
ticket_category: installer_bootstrap_provenance
status: completed
goal: cold-agent-ticket-execution-under-stdo
change_intent: Make installed odd_sdlc.TS workspaces carry enough bootstrap provenance for a cold agent to treat "STDO law", "STDO governance", "STDO Constitution", and "STDO Method" as equivalent governance scope aliases and to triage every substantive ticket by first missing layer before implementation.
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: installed cold-agent instruction files, bootstrap guide, install manifest, normalization projection, install proof tests, installed product requirements
priority: high
triaged_at: 2026-04-27T07:59:20Z
created_at: 2026-04-27T07:59:20Z
updated_at: 2026-04-27T18:20:36Z
completed_at: 2026-04-27T18:20:36Z
dependencies:
  - T-059 completed
  - T-062 completed
  - abiogenesis:B-021 completed
  - abiogenesis:B-022 completed
  - abiogenesis:B-030 completed
governance_scope: STDO Method
governance_scope_aliases:
  - STDO law
  - STDO governance
  - STDO Constitution
  - STDO Method
  - STDO-UX
method_authority:
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
product_authority:
  - specification/PRODUCT.md Installed Development Product Contract
  - specification/requirements/14-odd-sdlc-installed-product-contract.md REQ-F-ODDSDLC-047
  - specification/requirements/14-odd-sdlc-installed-product-contract.md REQ-F-ODDSDLC-048
intake_source: Cold-agent execution would not reliably know that STDO law/governance/Constitution/Method are aliases for the same four-method stack, or that ticket execution must first classify whether the defect is at goals, intent, product, requirements, design, code, tests/proof, or release scope.
target_truth: Installed bootstrap provenance makes the STDO alias set explicit, expands it to SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD, and ODD_METHOD, identifies STDO-UX as the UI/operator-surface application of the same law, and requires first-missing-layer triage before implementation or ticket closure.
superseded_truth: Installed `AGENTS.md` and `CLAUDE.md` only explain command usage and ownership split; session memory is needed to understand STDO ticket execution.
closure_law: close only when installed product requirements, TypeScript install design, generated `AGENTS.md`/`CLAUDE.md`, bootstrap guide, install manifest or normalization projection, and install tests all carry or prove the STDO alias set and first-missing-layer triage rule.
non_closure_conditions:
  - generated bootstrap mentions STDO but not all four aliases
  - generated bootstrap expands STDO but omits the first-missing-layer diagnostic
  - install manifest/projection omit governance bootstrap provenance
  - tests only inspect source files and do not prove generated installed surfaces
---

# T-065: STDO Bootstrap Provenance

## STDO Reading

This is a requirements-first installer defect.

The cold-agent requirement already exists, but it is under-specified. It says an
installed workspace must be operable by a cold agent and must reference method
standards. It does not explicitly require the installed bootstrap provenance to
carry:

- all accepted STDO aliases, including `STDO-UX` for UI/operator surfaces
- the four governing method documents
- the first-missing-layer triage diagnostic
- the rule that ticket execution must fix the execution contract before
  implementation

That means a cold agent can obey command usage while still misclassifying a
ticket as code work.

## First-Missing-Layer Diagnostic

For any substantive ticket or operator finding, the agent must classify the
first missing or stale layer before execution:

```text
Goals -> Intent -> Product -> Requirements -> Design -> Code -> Tests/Proof -> Release
```

The symptom layer is not authoritative. If code fails because requirements were
missing, the ticket is not a code refactor. If tests fail because design is
underspecified, the ticket is not a test-only fix.

## Required Changes

1. Reprice installed product requirements so cold-agent bootstrap provenance
   explicitly includes the STDO alias set and first-missing-layer triage rule.
2. Update the TypeScript install design to make this part of the install
   contract.
3. Update the install producer that writes `AGENTS.md`, `CLAUDE.md`, and
   `.ai-workspace/context/odd_sdlc_typescript_bootstrap.md`.
4. Add manifest/projection provenance so generated bootstrap text is not the
   only place the rule exists.
5. Extend install tests to prove generated installed surfaces, not only source
   strings.

## Closure Proof

Required proof:

- `npm run test:t059`
- generated instruction text includes `STDO law`, `STDO governance`,
  `STDO Constitution`, `STDO Method`, and `STDO-UX`
- generated instruction text expands STDO to the four method documents
- generated instruction text names the first-missing-layer order
- install manifest or normalization projection carries the same bootstrap
  provenance as structured data

## Implementation Evidence

Completed in the TypeScript tenant:

- repriced `REQ-F-ODDSDLC-047` so installed cold-agent operation includes the
  STDO alias set, `STDO-UX`, first-missing-layer triage, and ticket execution
  contract rule
- updated `ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md` so the install
  adapter owns STDO bootstrap provenance as part of generated cold-agent
  surfaces
- added `OddSdlcBootstrapGovernance` to the install manifest/projection carrier
  family
- updated the generated `AGENTS.md`, `CLAUDE.md`, and
  `.ai-workspace/context/odd_sdlc_typescript_bootstrap.md` text to carry:
  - accepted aliases: `STDO law`, `STDO governance`, `STDO Constitution`,
    `STDO Method`, `STDO-UX`
  - method references:
    `SPEC_METHOD.md`, `TICKET_METHOD.md`, `DESIGN_MODULE_METHOD.md`,
    `ODD_METHOD.md`
  - first-missing-layer order:
    `Goals -> Intent -> Product -> Requirements -> Design -> Code -> Tests/Proof -> Release`
  - the rule that symptom layer is not re-entry authority and ticket execution
    contract must be fixed before implementation when triage finds a higher
    missing layer
- extended `test_t059_install_release_adapter.test.mjs` to prove generated
  instruction text, bootstrap guide text, install manifest carrier, and
  normalization projection carrier

Verification:

- `npm run test:t059` passed, 4 tests
- refreshed `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test46.ts`
  through the public TypeScript installer
- generated `AGENTS.md`, `CLAUDE.md`, and
  `.ai-workspace/context/odd_sdlc_typescript_bootstrap.md` contain `STDO law`,
  `STDO governance`, `STDO Constitution`, `STDO Method`, `STDO-UX`, the
  first-missing-layer order, and the Agentic Coder CLI operator-surface rule
- `.abiogenesis/odd_sdlc/typescript/install-manifest.json` and
  `.ai-workspace/runtime/odd_sdlc-typescript-installation.json` contain the
  structured `bootstrapGovernance` carrier
- `npm run test:semantic` passed, 74 tests
- `npm run lint:semantic` passed
