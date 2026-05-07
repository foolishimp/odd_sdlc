---
id: T-124
title: Fix TypeScript install default ABG source-root resolution
type: bug
ticket_category: install_adapter
status: completed
goal: typescript-installed-source-checkout-install
change_intent: Fix default ABG source-root resolution for TypeScript install when --abg-package-source is omitted.
change_class: realization_refactor
re_entry_point: realization
triaged_at: 2026-05-05T00:00:00+10:00
created_at: 2026-05-05T00:00:00+10:00
updated_at: 2026-05-07T00:00:00+10:00
completed_at: 2026-05-07T00:00:00+10:00
review_status: completed_codex_rc_format_and_evidence_review
owning_repo: odd_sdlc
affected_boundary:
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs
  - build_tenants/typescript install CLI
related_requirements:
  - REQ-F-ODDSDLC-040
  - REQ-F-ODDSDLC-043
evidence_refs:
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test70.TS.cx
---

# T-124 Fix TypeScript install default ABG source-root resolution

## Problem

The TypeScript `odd-sdlc-ts install` command can reject a source-checkout install when `--abg-package-source` is omitted.

Observed rejection:

```text
ABG TypeScript install rejected: missing ABIogenesis docs source file /Users/jim/src/apps/odd_sdlc/docs/LLM_GTL_APP_BUILDER_GUIDE.md
```

The CLI default ABG source-root resolver selected `odd_sdlc/build_tenants/typescript/node_modules/@abiogenesis/typescript-tenant` when that dependency was present. ABG then walked upward from that path and found `odd_sdlc/docs`, not the ABG source docs. That is an invalid source-root choice for source-checkout installs.

## Lawful re-entry

`realization_refactor`.

The install requirement is unchanged: a source-checkout TypeScript installer must install ODD SDLC and the ABG substrate into a target workspace through the public install command. The defect is the local realization of the default ABG source-root resolver.

## Required behavior

When running from the local `/Users/jim/src/apps` source checkout, the default ABG package source must resolve to:

```text
/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript
```

The CLI must still support packaged installs by falling back to dependency locations when the sibling source checkout is not present.

## Implementation

- Prefer a usable sibling ABG TypeScript source checkout when it exists and its source docs authority is present.
- Fall back to packaged dependency locations only when the sibling source checkout is unavailable.
- Add a regression that runs `install` without `--abg-package-source` and proves the default resolves to the sibling ABG source checkout.

## Closure criteria

- `npm run test:t059` passes from `build_tenants/typescript`.
- A clean data-mapper test70 install succeeds without `--abg-package-source`.
- The clean install result reports ABG installed from the sibling ABG TypeScript source root.

## Closure evidence

- `npm run test:t059` passed from `build_tenants/typescript`.
- `T-124 CLI install resolves the sibling ABG source checkout by default` passed.
- Clean reinstall of `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test70.TS.cx` succeeded without `--abg-package-source`.
- Install result resolved `request.abgPackageSourceRoot` to `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript`.
- Install result resolved `abgOutcome.packageSourceRoot` to `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript`.

## Codex Compliance Closure - 2026-05-07

Status: completed.

Observations:

- Focused proof refreshed on 2026-05-07: `npm run test:t059` passed with 7
  tests, including `T-124 CLI install resolves the sibling ABG source checkout
  by default` and `T-124 default ABG source-root falls back to packaged
  dependency`.
- Code evidence exists in `build_tenants/typescript/code/src/spec_method/entry.ts`:
  `resolveDefaultAbgPackageSourceRoot()` prefers the sibling
  `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript`
  checkout before packaged dependency fallback.
- Ticket frontmatter now carries the current `TICKET_METHOD` fields: `type`,
  `ticket_category`, `goal`, `change_intent`, `change_class`,
  `re_entry_point`, `triaged_at`, `created_at`, and `updated_at`.
- The packaged-dependency fallback claim is now deterministic test coverage,
  not an unproven closure assertion.

Closure checklist:

- [x] Complete the STDO ticket header fields.
- [x] Add deterministic packaged-dependency fallback coverage.
- [x] Confirm sibling source-checkout default coverage through `test:t059`.
- [x] Re-run `npm run test:t059` after the code and ticket update.
