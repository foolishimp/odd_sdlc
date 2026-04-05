# ADR-003 - Scenario-Driven Installed-Dev Proof

**Status**: Active
**Date**: 2026-04-05
**Implements**: REQ-F-VERIFY-001, REQ-F-VERIFY-002, REQ-F-VERIFY-003, REQ-F-VERIFY-004

## Context

`odd_method` is a new line and cannot rely on ambient confidence, source-only checks,
or unlabeled tests.

The method requires written testcase authority, scenario bundles, and
installed-dev proof where capability claims are meaningful.

## Decision

`odd_method` adopts scenario-driven testcase authority as the first proving surface.

The proving model is:

- every live requirement family maps to written testcase authority
- capability claims are exercised through scenario bundles with declared
  significant paths
- installed-dev proof is the decisive proving lane once the product is
  installable or runnable
- the first proving lane focuses on the first constructive edge and requires
  full substrate fact truth for both success and failure

## Consequences

- capability claims stay operationally meaningful
- runtime and graph-function claims can be proved without hidden assumptions
- later executable tests have a named constitutional proving target from the
  start
