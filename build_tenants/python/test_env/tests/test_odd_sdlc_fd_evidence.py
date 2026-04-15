# Validates: REQ-F-ODDSDLC-004
# Validates: REQ-F-ODDSDLC-029
# Validates: REQ-F-ODDSDLC-030
# Validates: REQ-F-ODDSDLC-031
from __future__ import annotations

import contextlib
import io
import json
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest


ROOT = Path(__file__).resolve().parents[4]
GENESIS_PATH = ROOT / ".genesis"
CODE_PATH = ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))

from genesis.binding import _assemble_prompt  # noqa: E402
from gtl.operator_model import F_D  # noqa: E402
from odd_sdlc.constructor import construct_manifest  # noqa: E402
from odd_sdlc.fd_checks import main  # noqa: E402
from odd_sdlc.project_profile import tenant_design_relative_path, tenant_test_env_tests_relative_path  # noqa: E402
from odd_sdlc.traceability import traceability_scan  # noqa: E402


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _seed_traceability_workspace(workspace: Path) -> None:
    tenant_name = "scala_spark"
    _write(
        workspace / ".ai-workspace" / "context" / "project_constraints.yml",
        "\n".join(
            (
                "project:",
                '  name: "fd-evidence.test"',
                '  kind: "software-project"',
                '  language: "Scala"',
                '  test_runner: "sbt test"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "scala_spark"',
                '      output_dir: "build_tenants/scala_spark/"',
                '      description: "scala traceability lane"',
                '      test_execution_contract: "sbt test"',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "INTENT.md",
        "\n".join(
            (
                "# Intent",
                "",
                "- INT-001: Preserve explicit requirement traceability.",
                "- INT-002: Preserve independent test realization.",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "GOALS.md",
        "\n".join(
            (
                "# Goals",
                "",
                "- INT-001: Preserve explicit requirement traceability.",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "PRODUCT.md",
        "\n".join(
            (
                "# Product",
                "",
                "- Preserve a governed Scala realization lane.",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "requirements" / "01-live.md",
        "\n".join(
            (
                "# Live Requirements",
                "",
                "- REQ-TRACE-001: Carry a realized implementation path.",
                "- REQ-TRACE-002: Carry a second realized implementation path.",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "requirements" / "10-generated-bootstrap.md",
        "\n".join(
            (
                "# Generated Bootstrap Requirements",
                "",
                "- REQ-TRACE-001: Carry a realized implementation path.",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_design_relative_path(tenant_name, "40-generated-implementation-design.md"),
        "\n".join(
            (
                "# Generated Implementation Design",
                "",
                "- REQ-TRACE-001",
                "- REQ-TRACE-002",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_design_relative_path(tenant_name, "40-generated-implementation-modules.md"),
        "\n".join(
            (
                "# Generated Implementation Modules",
                "",
                "- module alpha realizes REQ-TRACE-001",
                "- module beta realizes REQ-TRACE-002",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_design_relative_path(tenant_name, "40-generated-implementation-stack.md"),
        "\n".join(
            (
                "# Generated Implementation Stack Profile",
                "",
                "- Scala 3",
                "- sbt",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_test_env_tests_relative_path(tenant_name, "40-generated-test-modules.md"),
        "\n".join(
            (
                "# Generated Test Modules",
                "",
                "- validation alpha covers REQ-TRACE-001",
                "- validation gamma covers REQ-TRACE-003",
                "",
            )
        ),
    )
    _write(
        workspace / "build_tenants" / "scala_spark" / "src" / "main" / "scala" / "pkg" / "Logic.scala",
        "\n".join(
            (
                "// Implements: REQ-TRACE-001",
                "",
                "object Logic {",
                "  def run(): Int = 1",
                "}",
                "",
            )
        ),
    )
    _write(
        workspace / "build_tenants" / "scala_spark" / "src" / "main" / "scala" / "pkg" / "Orphan.scala",
        "\n".join(
            (
                "object Orphan {",
                "  def noop(): Int = 0",
                "}",
                "",
            )
        ),
    )
    _write(
        workspace / "build_tenants" / "scala_spark" / "src" / "test" / "scala" / "pkg" / "LogicSpec.scala",
        "\n".join(
            (
                "// Validates: REQ-TRACE-001",
                "",
                "class LogicSpec",
                "",
            )
        ),
    )
    _write(
        workspace / "build_tenants" / "scala_spark" / "src" / "test" / "scala" / "pkg" / "OrphanSpec.scala",
        "\n".join(
            (
                "class OrphanSpec",
                "",
            )
        ),
    )


def _run_fd_check(check: str, workspace: Path) -> tuple[int, dict[str, object], str]:
    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        exit_code = main([check, "--workspace", str(workspace)])
    stdout = buffer.getvalue().strip()
    assert stdout
    return exit_code, json.loads(stdout), stdout


def _write_manifest(path: Path, *, target_asset: str, evaluator_name: str) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(
            {
                "manifest_id": f"test-{target_asset}",
                "edge": f"derive_{target_asset}",
                "target_asset": target_asset,
                "result_path": str(path.parent.parent / "fp_results" / f"{target_asset}.json"),
                "failing_evaluators": [
                    {
                        "name": evaluator_name,
                        "regime": "F_P",
                        "description": "test harness",
                    }
                ],
                "workflow_version": "test",
                "run_id": "run-test",
                "job_id": "job-test",
                "graph_function_id": "gf-test",
                "materialization_id": "mat-test",
                "call_id": "call-test",
                "vector_id": "vector-test",
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    return path


@pytest.mark.parametrize(
    ("check", "expected_failure_kind", "expected_subset"),
    (
        (
            "goal-surface-authority-validated",
            "authority_gap",
            {
                "missing_intent_ids": ["INT-002"],
            },
        ),
        (
            "requirement-scope-complete",
            "requirement_gap",
            {
                "missing_requirement_ids": ["REQ-TRACE-002"],
            },
        ),
        (
            "code-traceability-present",
            "traceability_gap",
            {
                "missing_requirement_ids": ["REQ-TRACE-002"],
                "orphan_code_files": [
                    "build_tenants/scala_spark/src/main/scala/pkg/Orphan.scala",
                ],
            },
        ),
        (
            "planned-test-traceability-present",
            "planned_test_gap",
            {
                "missing_requirement_ids": ["REQ-TRACE-002"],
                "unexpected_requirement_ids": ["REQ-TRACE-003"],
            },
        ),
        (
            "realized-test-traceability-present",
            "realized_test_gap",
            {
                "missing_requirement_ids": ["REQ-TRACE-002"],
                "unexpected_requirement_ids": [],
                "orphan_test_files": [
                    "build_tenants/scala_spark/src/test/scala/pkg/OrphanSpec.scala",
                ],
                "expected_test_roots": [
                    "build_tenants/scala_spark/src/test",
                    "build_tenants/scala_spark/src/test/scala",
                ],
            },
        ),
    ),
)
def test_fd_checks_emit_structured_repair_detail_for_live_traceability_gaps(
    tmp_path: Path,
    check: str,
    expected_failure_kind: str,
    expected_subset: dict[str, object],
) -> None:
    workspace = tmp_path / "fd-evidence"
    _seed_traceability_workspace(workspace)

    exit_code, payload, stdout = _run_fd_check(check, workspace)

    assert exit_code == 1
    assert payload["check"] == check
    assert payload["failure_kind"] == expected_failure_kind
    assert payload["workspace_root"] == str(workspace.resolve())
    for key, expected in expected_subset.items():
        assert payload[key] == expected
    assert "suggested_repair" in payload
    assert stdout.startswith("{")


def test_fd_checks_emit_generic_dependency_gap_detail_for_testcase_authority(tmp_path: Path) -> None:
    workspace = tmp_path / "fd-evidence"
    _seed_traceability_workspace(workspace)

    exit_code, payload, _ = _run_fd_check("testcase-authority-dependency-surfaces-present", workspace)

    assert exit_code == 1
    assert payload["check"] == "testcase-authority-dependency-surfaces-present"
    assert payload["failure_kind"] == "dependency_gap"
    generated_failures = payload["generated_contract_failures"]
    assert isinstance(generated_failures, list)
    assert generated_failures
    missing_assets = {item["asset_id"] for item in generated_failures}
    assert missing_assets == {"scenario_surface", "uat_testcases_surface"}


def test_prompt_assembly_carries_structured_fd_stdout_into_deterministic_failures(tmp_path: Path) -> None:
    workspace = tmp_path / "fd-evidence-prompt"
    _seed_traceability_workspace(workspace)
    _, _, stdout = _run_fd_check("code-traceability-present", workspace)

    evaluator = SimpleNamespace(
        name="code_traceability_present",
        description="The generated code surface carries explicit Implements traces.",
        regime=F_D,
    )
    asset_surface = SimpleNamespace(
        declared=True,
        kind="code_surface",
        standards_refs=(),
        output_contract_refs=(),
        required_contexts=(),
    )
    job = SimpleNamespace(
        vector=SimpleNamespace(
            name="derive_code_surface",
            source=SimpleNamespace(name="implementation_module_surface", markov=()),
            target=SimpleNamespace(
                name="code_surface",
                markov=(),
                schema="odd.asset.code_surface",
                asset_surface=asset_surface,
            ),
        ),
    )
    pre = SimpleNamespace(
        current_asset={},
        failing_evaluators=[evaluator],
        fd_results={
            "code_traceability_present": {
                "passes": False,
                "detail": {
                    "returncode": 1,
                    "stdout": stdout,
                    "stderr": "",
                },
            }
        },
        relevant_contexts={},
        resolved_environment=SimpleNamespace(
            bindings=(),
            ready=True,
            summary_lines=lambda: [],
            vector_source_required_contexts=(),
            asset_surface_required_contexts=(),
            asset_surface_injected_required_contexts=(),
            requires=(),
        ),
    )

    prompt = _assemble_prompt(pre, job, result_path=".ai-workspace/fp_results/mock.json")

    assert "[DETERMINISTIC FAILURES]" in prompt
    assert "missing_requirement_ids" in prompt
    assert "REQ-TRACE-002" in prompt
    assert "Orphan.scala" in prompt


def test_traceability_scan_treats_scala_main_spec_as_code_not_orphan_test(tmp_path: Path) -> None:
    workspace = tmp_path / "fd-evidence-main-spec"
    _seed_traceability_workspace(workspace)
    _write(
        workspace / "build_tenants" / "scala_spark" / "src" / "main" / "scala" / "pkg" / "LookupSpec.scala",
        "\n".join(
            (
                "// Implements: REQ-TRACE-002",
                "",
                "final case class LookupSpec(name: String)",
                "",
            )
        ),
    )

    scan = traceability_scan(workspace)

    assert "build_tenants/scala_spark/src/main/scala/pkg/LookupSpec.scala" not in scan["orphan_test_files"]
    assert scan["code_refs"]["REQ-TRACE-002"] == [
        "build_tenants/scala_spark/src/main/scala/pkg/LookupSpec.scala",
    ]


def test_code_traceability_falls_back_to_live_requirement_scope_when_implementation_claims_are_absent(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-no-impl-claims"
    _seed_traceability_workspace(workspace)
    (workspace / tenant_design_relative_path("scala_spark", "40-generated-implementation-design.md")).unlink()
    (workspace / tenant_design_relative_path("scala_spark", "40-generated-implementation-modules.md")).unlink()
    _write(
        workspace / "build_tenants" / "scala_spark" / "src" / "main" / "scala" / "pkg" / "Logic.scala",
        "\n".join(
            (
                "object Logic {",
                "  def run(): Int = 1",
                "}",
                "",
            )
        ),
    )

    exit_code, payload, _ = _run_fd_check("code-traceability-present", workspace)

    assert exit_code == 1
    assert payload["failure_kind"] == "traceability_gap"
    assert payload["missing_requirement_ids"] == ["REQ-TRACE-001"]
    assert payload["orphan_code_files"] == [
        "build_tenants/scala_spark/src/main/scala/pkg/Logic.scala",
        "build_tenants/scala_spark/src/main/scala/pkg/Orphan.scala",
    ]


def test_requirement_scope_complete_fails_when_generated_requirement_surface_lacks_marker(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-missing-requirement-marker"
    _seed_traceability_workspace(workspace)
    _write(
        workspace / "specification" / "requirements" / "10-generated-bootstrap.md",
        "\n".join(
            (
                "# Generated Bootstrap Requirements",
                "",
                "- REQ-TRACE-001: Carry a realized implementation path.",
                "- REQ-TRACE-002: Carry a second realized implementation path.",
                "",
            )
        ),
    )

    exit_code, payload, _ = _run_fd_check("requirement-scope-complete", workspace)

    assert exit_code == 1
    assert payload["check"] == "requirement-scope-complete"
    assert payload["failure_kind"] == "dependency_gap"
    assert payload["missing_requirement_ids"] == []
    failures = payload["generated_contract_failures"]
    assert isinstance(failures, list)
    assert failures
    assert failures[0]["asset_id"] == "requirement_surface"
    assert failures[0]["marker_present"] is False
    assert failures[0]["heading_matches"] is True


def test_constructor_carries_live_requirement_authority_into_generated_bootstrap_surface(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-constructor-bootstrap"
    _seed_traceability_workspace(workspace)
    _write(
        workspace / "README.md",
        "\n".join(
            (
                "# fd-evidence-demo",
                "",
                "Traceability-first downstream project.",
                "",
            )
        ),
    )
    generated_requirement = workspace / "specification" / "requirements" / "10-generated-bootstrap.md"
    if generated_requirement.exists():
        generated_requirement.unlink()

    manifest_path = _write_manifest(
        workspace / ".ai-workspace" / "fp_manifests" / "derive_requirement_surface_test.json",
        target_asset="requirement_surface",
        evaluator_name="requirement_scope_complete",
    )

    constructor_result = construct_manifest(manifest_path, workspace_root=workspace)

    assert constructor_result["target_asset"] == "requirement_surface"
    text = generated_requirement.read_text(encoding="utf-8")
    assert "REQ-TRACE-001" in text
    assert "REQ-TRACE-002" in text
    assert "project: `fd-evidence-demo`" in text
    assert "project: `Intent`" not in text

    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        exit_code = main(["requirement-scope-complete", "--workspace", str(workspace)])
    assert exit_code == 0
    assert buffer.getvalue().strip() == ""
