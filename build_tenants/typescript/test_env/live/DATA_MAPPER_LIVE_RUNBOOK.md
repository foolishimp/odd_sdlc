# Data Mapper Live Runbook

## Purpose

The data_mapper lane tests whether odd_sdlc can build data_mapper. It is not an outside-in effort to build data_mapper by hand.

Generated data_mapper workspace defects are F_P worksite repair pressure unless the observed failure proves an odd_sdlc framework, ABG, or GTL defect.

## Pre-Run Gate

Before starting or resuming a data_mapper live lane, run:

```bash
npm run guard:data-mapper-boundary
```

Record the current framework diff before the run:

```bash
git diff --stat -- code/src test_env/tests package.json
```

Do not start a new sandbox when an existing sandbox has a resumable failure. Patch the active sandbox and resume from the failed node.

## Failure Classification

Classify generated workspace compile, test, source, lineage, and tenant-stack failures as F_P worksite repair pressure by default.

Patch odd_sdlc source only when the evidence points to an SDLC framework, ABG, or GTL defect, including:

- prompt, admission, evaluator, closure, replay, event, or projection boundary defects
- ABG/GTL runtime, traversal, continuation, process supervision, or cleanup defects
- framework-authored tenant-stack inference or hard-coded downstream technology knowledge

Do not patch odd_sdlc source merely because the generated data_mapper workspace has a language, compiler, build-tool, or test failure.

## Framework Write Lock

During a data_mapper live run, `code/src`, `package.json`, and shared test harness surfaces are write-locked until the failure has been classified as an SDLC framework, ABG, or GTL defect.

Before editing a locked framework surface, write down:

- the failing sandbox path and operator-run path
- the failed stage and node
- the exact artifact or prompt evidence
- the smallest lawful re-entry point
- why the failure is not ordinary F_P worksite repair pressure

After editing a locked framework surface:

- run `npm run guard:data-mapper-boundary`
- run the focused test that proves the framework defect
- rebuild and hot-patch the active sandbox package copy when resuming the same sandbox
- resume the failed node instead of starting a new sandbox

## Agent Instruction

When operating this lane: You are testing whether odd_sdlc can build data_mapper. Do not improve data_mapper from outside the sandbox. Only patch odd_sdlc when the observed defect is in SDLC framework law, ABG/GTL runtime, prompt/admission/evaluator boundaries, event/replay, projection, closure, or process supervision.
