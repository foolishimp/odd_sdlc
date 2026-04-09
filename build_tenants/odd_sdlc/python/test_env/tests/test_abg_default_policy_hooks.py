# Validates: REQ-R-ABG3-POLICY
from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[5]
GENESIS_PATH = ROOT / ".genesis"

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))

from genesis.policy import materialize_policy_concern, resolve_policy_bundle  # noqa: E402
from genesis.policy_defaults import execute_closure_policy, execute_proof_policy  # noqa: E402


def test_default_proof_policy_executes_declared_mode() -> None:
    policy = resolve_policy_bundle()
    proof = materialize_policy_concern(policy, "proof")

    passing = execute_proof_policy(
        proof,
        assessments=(
            {"evaluator": "example.fp", "result": "pass"},
            {"evaluator": "example.fd", "result": "pass"},
        ),
    )
    failing = execute_proof_policy(
        proof,
        assessments=(
            {"evaluator": "example.fp", "result": "pass"},
            {"evaluator": "example.fd", "result": "fail"},
        ),
    )

    assert proof["mode"] == "rerun_after_fp"
    assert passing == {
        "mode": "rerun_after_fp",
        "passed": True,
        "reason": "all_assessments_passed",
        "assessment_count": 2,
    }
    assert failing == {
        "mode": "rerun_after_fp",
        "passed": False,
        "reason": "assessment_failure_detected",
        "assessment_count": 2,
    }


def test_default_closure_policy_executes_declared_mode() -> None:
    policy = resolve_policy_bundle()
    closure = materialize_policy_concern(policy, "closure")

    passed = execute_closure_policy(
        closure,
        proof_decision={"passed": True},
    )
    forced = execute_closure_policy(
        {
            **closure,
            "config": {"force_fail": True},
        },
        proof_decision={"passed": True},
    )
    proof_blocked = execute_closure_policy(
        closure,
        proof_decision={"passed": False},
    )

    assert closure["mode"] == "resolve_or_escalate_fh"
    assert passed == {
        "mode": "resolve_or_escalate_fh",
        "passed": True,
        "reason": "resolved_without_fh",
    }
    assert forced == {
        "mode": "resolve_or_escalate_fh",
        "passed": False,
        "reason": "forced_closure_failure",
    }
    assert proof_blocked == {
        "mode": "resolve_or_escalate_fh",
        "passed": False,
        "reason": "proof_not_passed",
    }
