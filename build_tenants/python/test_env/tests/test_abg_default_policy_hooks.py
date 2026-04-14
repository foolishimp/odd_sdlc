# Validates: REQ-R-ABG3-POLICY
from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
GENESIS_PATH = ROOT / ".genesis"

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))

from genesis.policy import materialize_policy_concern, resolve_policy_bundle  # noqa: E402


def test_default_proof_policy_materializes_declared_mode() -> None:
    policy = resolve_policy_bundle()
    proof = materialize_policy_concern(policy, "proof")

    assert policy["proof"]["ref"] == "genesis.policy_defaults:proof_recheck_after_fp"
    assert proof == {
        "mode": "rerun_after_fp",
        "config": {},
        "ref": "genesis.policy_defaults:proof_recheck_after_fp",
    }


def test_default_closure_policy_materializes_declared_mode() -> None:
    policy = resolve_policy_bundle()
    closure = materialize_policy_concern(policy, "closure")

    assert policy["closure"]["ref"] == "genesis.policy_defaults:closure_require_resolution_or_fh"
    assert closure == {
        "mode": "resolve_or_escalate_fh",
        "config": {},
        "ref": "genesis.policy_defaults:closure_require_resolution_or_fh",
    }
