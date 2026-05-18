# T-102 Prompt Single-Surface Follow-Up

Status: follow-up review item discovered during T-102 implementation.

The immediate T-102 bug is fixed at the runtime boundary: evaluator carriers
are written by the installed operator interface, not by `F_P.transform`.

A broader prompt-quality review remains worthwhile. Several prompt directives
still define boundaries by listing illegal outside space instead of naming the
single lawful construction surface. That is not the same bug as evaluator
carrier ownership, but it increases ambiguity and should be swept separately.

Review rule:

```text
Prompt text should name the current lawful surface, authority inputs, and
output interface. It should not depend on long negation lists to explain
surfaces that are already outside the edge contract.
```

Candidate sweep:

- global transform axioms
- retry repair instructions
- component-depth construction directives
- test-execution preparation directives
- schedule and release preparation directives
- report/result projection directives

T-102 scope remains the evaluator-boundary fix. This follow-up should not
reopen worker ownership of evaluator carriers.
