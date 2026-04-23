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
from odd_sdlc.fd_checks import code_traceability_present, realized_test_traceability_present  # noqa: E402
from odd_sdlc.normalization import normalize_workspace  # noqa: E402
from odd_sdlc.project_profile import (  # noqa: E402
    tenant_design_relative_path,
    tenant_test_env_relative_path,
    tenant_test_env_tests_relative_path,
)
from odd_sdlc.requirement_closure import (
    build_requirement_closure_register,
    current_requirement_executability_gap,
)  # noqa: E402
from odd_sdlc.traceability_index import (
    build_requirement_traceability_index,
)  # noqa: E402
from odd_sdlc.workspace_assets import asset_marker, asset_materialization_path  # noqa: E402


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
                "**Family**: REQ-TRACE-*",
                "**Status**: Active",
                "**Category**: Capability",
                "**Carries Forward From**: None",
                "**Authoring Design**: `build_tenants/scala_spark/design/TRACEABILITY_LAW.md`",
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
        workspace / "build_tenants" / "scala_spark" / "design" / "TRACEABILITY_LAW.md",
        "\n".join(
            (
                "# Traceability Law",
                "",
                "**Status**: Active",
                "**Implements**: REQ-TRACE-001, REQ-TRACE-002",
                "**Derives From**: `specification/requirements/01-live.md`",
                "",
                "- Keep the requirement family and generated design chain explicitly linked.",
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
        workspace / tenant_design_relative_path(tenant_name, "40-generated-test-design.md"),
        "\n".join(
            (
                "# Generated Test Design",
                "",
                "- REQ-TRACE-001",
                "- REQ-TRACE-003",
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
    _write(
        workspace / tenant_test_env_relative_path(tenant_name, "50-generated-run-archive.md"),
        "\n".join(
            (
                "# Generated Test Run Archive",
                "",
                "This test run archive surface is regenerated by the bounded odd_sdlc constructor turn.",
                "",
                "- report files observed: 1",
                "- parsed reports: 1",
                "- REQ-TRACE-001",
                "",
            )
        ),
    )


def _run_fd_check(
    check: str,
    workspace: Path,
    *,
    edge: str | None = None,
) -> tuple[int, dict[str, object], str]:
    buffer = io.StringIO()
    argv = [check, "--workspace", str(workspace)]
    if edge is not None:
        argv.extend(["--edge", edge])
    with contextlib.redirect_stdout(buffer):
        exit_code = main(argv)
    stdout = buffer.getvalue().strip()
    assert stdout
    return exit_code, json.loads(stdout), stdout


def _seed_two_digit_equivalence_workspace(workspace: Path) -> None:
    tenant_name = "python"
    _write(
        workspace / ".ai-workspace" / "context" / "project_constraints.yml",
        "\n".join(
            (
                "project:",
                '  name: "two-digit-equivalence.test"',
                '  kind: "software-project"',
                '  language: "Python"',
                '  test_runner: "pytest"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "python"',
                '      output_dir: "imp_two_digit/"',
                '      description: "two-digit traceability lane"',
                '      test_execution_contract: "pytest"',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "REQUIREMENTS.md",
        "\n".join(
            (
                "# Imported Requirements",
                "",
                "- REQ-IMP-01: Carry imported literal authority.",
                "- REQ-IMP-02-A: Preserve suffixed imported authority.",
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
                "- REQ-IMP-001: Carry imported literal authority.",
                "- REQ-IMP-002-A: Preserve suffixed imported authority.",
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
                "- REQ-IMP-001",
                "- REQ-IMP-002-A",
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
                "- module alpha realizes REQ-IMP-001",
                "- module beta realizes REQ-IMP-002-A",
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
                "- Python 3.11",
                "- pytest",
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
                "- validation alpha covers REQ-IMP-01",
                "- validation beta covers REQ-IMP-02-A",
                "",
            )
        ),
    )
    _write(
        workspace / "imp_two_digit" / "src" / "main" / "logic.py",
        "\n".join(
            (
                "# Implements: REQ-IMP-01",
                "# Implements: REQ-IMP-02-A",
                "",
                "def run() -> int:",
                "    return 1",
                "",
            )
        ),
    )
    _write(
        workspace / "imp_two_digit" / "src" / "tests" / "test_logic.py",
        "\n".join(
            (
                "# Validates: REQ-IMP-01",
                "# Validates: REQ-IMP-02-A",
                "",
                "def test_run() -> None:",
                "    assert True",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_test_env_relative_path(tenant_name, "50-generated-run-archive.md"),
        "\n".join(
            (
                "# Generated Test Run Archive",
                "",
                "- REQ-IMP-001",
                "- REQ-IMP-002-A",
                "",
            )
        ),
    )


def _write_manifest(path: Path, *, target_asset: str, evaluator_name: str) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(
            {
                "manifest_id": f"test-{target_asset}",
                "edge": f"derive_{target_asset}",
                "target_asset": target_asset,
                "result_path": str(path.parent.parent / "fp_results" / f"{target_asset}.json"),
                "fulfillment_obligations": [
                    {
                        "id": evaluator_name,
                        "evaluator": evaluator_name,
                        "statement": "test harness fulfillment obligation",
                        "source_refs": [f"manifest://test-{target_asset}#fulfillment_obligations/0"],
                        "source_kind": "manifest_fulfillment_obligations",
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
                "missing_requirement_ids": [],
                "unexpected_requirement_ids": ["REQ-TRACE-003"],
            },
        ),
        (
            "realized-test-traceability-present",
            "realized_test_gap",
            {
                "missing_requirement_ids": ["REQ-TRACE-003"],
                "unexpected_requirement_ids": [],
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


def test_fd_checks_fail_on_invalid_current_produced_design_surface(tmp_path: Path) -> None:
    workspace = tmp_path / "fd-evidence-producer-contract"
    _seed_traceability_workspace(workspace)
    _write(
        asset_materialization_path(workspace, "feature_decomp_surface"),
        "\n".join(
            (
                "# Generated Feature Decomposition",
                "",
                asset_marker("feature_decomp_surface"),
                "",
                "- REQ-TRACE-001: feature alpha",
                "- REQ-TRACE-002: feature beta",
                "",
            )
        ),
    )
    _write(
        asset_materialization_path(workspace, "design_surface"),
        "\n".join(
            (
                "# Draft Design Notes",
                "",
                "- missing governed marker on purpose",
                "",
            )
        ),
    )

    exit_code, payload, _ = _run_fd_check("design-dependency-surfaces-present", workspace)

    assert exit_code == 1
    assert payload["check"] == "design-dependency-surfaces-present"
    generated_failures = {
        item["asset_id"]: item
        for item in payload["generated_contract_failures"]
    }
    assert "design_surface" in generated_failures
    assert generated_failures["design_surface"]["contract_satisfied"] is False
    assert generated_failures["design_surface"]["marker_present"] is False


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
        evaluators=(),
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

    prompt = _assemble_prompt(pre, job, result_path=".ai-workspace/fp_results/mock.json").prompt

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

    scan = build_requirement_traceability_index(workspace).traceability_scan()

    assert "build_tenants/scala_spark/src/main/scala/pkg/LookupSpec.scala" not in scan["orphan_test_files"]
    assert scan["code_refs"]["REQ-TRACE-002"] == [
        "build_tenants/scala_spark/src/main/scala/pkg/LookupSpec.scala",
    ]


def test_traceability_scan_counts_governed_code_and_test_files(tmp_path: Path) -> None:
    workspace = tmp_path / "fd-evidence-counts"
    _seed_traceability_workspace(workspace)

    scan = build_requirement_traceability_index(workspace).traceability_scan()

    assert scan["code_file_count"] == 2
    assert scan["test_file_count"] == 2


def test_t020_runtime_code_does_not_import_traceability_facade() -> None:
    code_root = ROOT / "build_tenants" / "python" / "code" / "odd_sdlc"
    offenders: list[str] = []
    for path in sorted(code_root.rglob("*.py")):
        if path.name == "traceability.py":
            continue
        text = path.read_text(encoding="utf-8")
        if (
            "from .traceability import" in text
            or "from odd_sdlc.traceability import" in text
            or "odd_sdlc.traceability:" in text
        ):
            offenders.append(path.relative_to(ROOT).as_posix())
    assert offenders == []


def test_t020_fd_and_closure_do_not_fallback_to_traceability_facade(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    import odd_sdlc.traceability as legacy_traceability

    workspace = tmp_path / "fd-evidence-no-legacy-fallback"
    _seed_traceability_workspace(workspace)

    def _fail_legacy(*_args, **_kwargs):
        raise AssertionError("legacy traceability facade was used as authority")

    monkeypatch.setattr(legacy_traceability, "build_requirement_traceability_index", _fail_legacy)
    monkeypatch.setattr(legacy_traceability, "build_requirement_closure_register", _fail_legacy)

    register = build_requirement_closure_register(workspace)
    assert register["register_kind"] == "odd_sdlc.requirement_closure_register"
    assert code_traceability_present(workspace) == 1


def test_t020_fd_and_closure_fail_closed_when_traceability_index_carrier_is_unavailable(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    import odd_sdlc.fd_checks as fd_checks_module
    import odd_sdlc.requirement_closure as requirement_closure_module

    workspace = tmp_path / "fd-evidence-carrier-unavailable"
    _seed_traceability_workspace(workspace)

    def _fail_carrier(*_args, **_kwargs):
        raise RuntimeError("traceability index carrier unavailable")

    monkeypatch.setattr(fd_checks_module, "build_requirement_traceability_index", _fail_carrier)
    monkeypatch.setattr(
        requirement_closure_module,
        "build_requirement_traceability_index",
        _fail_carrier,
    )

    with pytest.raises(RuntimeError, match="traceability index carrier unavailable"):
        build_requirement_closure_register(workspace)

    with pytest.raises(RuntimeError, match="traceability index carrier unavailable"):
        code_traceability_present(workspace)


@pytest.mark.parametrize(
    ("check", "expected_reason"),
    (
        ("code-traceability-present", "governed_code_surface_empty"),
        ("realized-test-traceability-present", "governed_realized_test_surface_empty"),
    ),
)
def test_fd_checks_fail_explicitly_on_zero_surface_traceability(
    tmp_path: Path,
    check: str,
    expected_reason: str,
) -> None:
    workspace = tmp_path / "fd-evidence-zero-surface"
    _seed_traceability_workspace(workspace)
    for path in (workspace / "build_tenants" / "scala_spark" / "src").rglob("*.scala"):
        path.unlink()

    exit_code, payload, _ = _run_fd_check(check, workspace)

    assert exit_code == 1
    assert payload["failure_kind"] == "zero_surface_gap"
    assert payload["surface_failure_reason"] == expected_reason
    assert payload["code_file_count"] == 0
    assert payload["test_file_count"] == 0


def test_two_digit_imported_requirement_ids_remain_trace_equivalent_after_normalization(tmp_path: Path) -> None:
    workspace = tmp_path / "fd-evidence-two-digit"
    _seed_two_digit_equivalence_workspace(workspace)
    normalize_workspace(
        workspace,
        project_slug="fd_evidence_two_digit",
        platform="python",
    )

    register = build_requirement_closure_register(workspace)
    entries = {
        entry["requirement_id"]: entry
        for entry in register["requirements"]
    }

    index = build_requirement_traceability_index(workspace)
    assert index.missing_requirement_ids_from_current_surface() == ()
    assert code_traceability_present(workspace) == 0
    assert realized_test_traceability_present(workspace) == 0
    assert entries["REQ-IMP-001"]["present_in_authority"] is True
    assert entries["REQ-IMP-001"]["authority_refs"] == ["specification/requirements/00-imported-sources.md"]
    assert entries["REQ-IMP-001"]["code_refs"] == ["build_tenants/python/src/main/logic.py"]
    assert entries["REQ-IMP-001"]["test_refs"] == ["build_tenants/python/src/tests/test_logic.py"]
    assert entries["REQ-IMP-002-A"]["present_in_authority"] is True
    assert entries["REQ-IMP-002-A"]["authority_refs"] == ["specification/requirements/00-imported-sources.md"]
    assert entries["REQ-IMP-002-A"]["code_refs"] == ["build_tenants/python/src/main/logic.py"]
    assert entries["REQ-IMP-002-A"]["test_refs"] == ["build_tenants/python/src/tests/test_logic.py"]


def test_current_requirement_executability_gap_keeps_global_convergence_open_until_requirements_are_realized(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-global-executability"
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

    gap = current_requirement_executability_gap(workspace)

    assert gap["edge_converged"] is False
    assert gap["requires_build_out"] is True
    assert gap["edge_converged"] is False
    assert gap["carry_converged"] is True
    assert gap["fulfillment_converged"] is False
    assert gap["combined_delta"] == pytest.approx(0.5)
    assert gap["combined_delta"] == pytest.approx(0.5)
    assert gap["carry_delta"] == pytest.approx(0.0)
    assert gap["fulfillment_delta"] == pytest.approx(0.5)
    assert gap["obligation_source_ref"] == "authority_requirement_surface"
    assert gap["obligation_source_kind"] == "requirement_surface"
    assert gap["obligation_source_admission_basis"] == "authority"
    assert gap["derivation_rule"] == "identity"
    assert gap["expected_count"] == 2
    assert gap["expected_count"] == 2
    assert gap["carried_count"] == 2
    assert gap["fulfilled_count"] == 1
    assert gap["missing_count"] == 0
    assert gap["extra_count"] == 0
    assert gap["unfulfilled_count"] == 1
    assert gap["partial_count"] == 1
    assert gap["blocking_count"] == 1
    assert gap["blocking_reasons"] == ["missing_code_realization"]
    assert gap["blocking_obligation_ids"] == ["REQ-TRACE-002"]
    assert gap["blocking_status_counts"] == {"planned": 1}
    assert gap["carry_counts"] == {"carried": 2}
    assert gap["fulfillment_detail_counts"] == {"fulfilled": 1, "planned": 1}
    assert gap["fulfillment_counts"] == {"fulfilled": 1, "not_fulfilled": 1}
    obligations = {item["id"]: item for item in gap["obligations"]}
    assert obligations["REQ-TRACE-001"]["kind"] == "requirement"
    assert obligations["REQ-TRACE-001"]["carry_status"] == "carried"
    assert obligations["REQ-TRACE-001"]["fulfillment_status"] == "fulfilled"
    assert obligations["REQ-TRACE-001"]["statement"] == "- REQ-TRACE-001: Carry a realized implementation path."
    assert obligations["REQ-TRACE-001"]["source_refs"][0] == "specification/requirements/10-generated-bootstrap.md"
    assert "specification/requirements/01-live.md" in obligations["REQ-TRACE-001"]["source_refs"]
    assert "build_tenants/scala_spark/src/main/scala/pkg/Logic.scala" in obligations["REQ-TRACE-001"]["evidence_refs"]
    assert "build_tenants/scala_spark/src/test/scala/pkg/LogicSpec.scala" in obligations["REQ-TRACE-001"]["evidence_refs"]
    assert obligations["REQ-TRACE-002"]["carry_status"] == "carried"
    assert obligations["REQ-TRACE-002"]["fulfillment_status"] == "not_fulfilled"
    assert obligations["REQ-TRACE-002"]["fulfillment_detail"] == "planned"
    assert obligations["REQ-TRACE-002"]["blocking_reasons"] == ["missing_code_realization"]
    blocking = gap["blocking_obligations"][0]
    assert blocking["id"] == "REQ-TRACE-002"
    assert blocking["id"] == "REQ-TRACE-002"
    assert blocking["carry_status"] == "carried"
    assert blocking["fulfillment_status"] == "not_fulfilled"
    assert blocking["fulfillment_detail"] == "planned"
    assert blocking["blocking_reasons"] == ["missing_code_realization"]


def test_current_requirement_executability_gap_blocks_traceable_stubbed_code(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-stubbed-code"
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
    _write(
        workspace / "build_tenants" / "scala_spark" / "src" / "main" / "scala" / "pkg" / "Logic.scala",
        "\n".join(
            (
                "// Implements: REQ-TRACE-001",
                "",
                "sealed trait Logic",
                "",
            )
        ),
    )

    register = build_requirement_closure_register(workspace)
    entries = {entry["requirement_id"]: entry for entry in register["requirements"]}
    assert entries["REQ-TRACE-001"]["status"] == "realized"
    assert entries["REQ-TRACE-001"]["carry_status"] == "carried"
    assert entries["REQ-TRACE-001"]["fulfillment_detail"] == "traceable_stub"
    assert entries["REQ-TRACE-001"]["fulfillment_status"] == "not_fulfilled"
    assert entries["REQ-TRACE-001"]["behavioral_code_refs"] == []
    assert entries["REQ-TRACE-001"]["blocking_reasons"] == ["behavioral_realization_missing"]

    gap = current_requirement_executability_gap(workspace)

    assert gap["edge_converged"] is False
    assert gap["carry_converged"] is True
    assert gap["fulfillment_converged"] is False
    assert "REQ-TRACE-001" in gap["blocking_obligation_ids"]
    stubbed = next(item for item in gap["blocking_obligations"] if item["id"] == "REQ-TRACE-001")
    assert stubbed["carry_status"] == "carried"
    assert stubbed["fulfillment_status"] == "not_fulfilled"
    assert stubbed["fulfillment_detail"] == "traceable_stub"
    assert stubbed["blocking_reasons"] == ["behavioral_realization_missing"]


def test_current_requirement_executability_gap_exposes_missing_carry_forward_requirements(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-missing-carry"
    _seed_traceability_workspace(workspace)

    gap = current_requirement_executability_gap(workspace)

    assert gap["edge_converged"] is False
    assert gap["carry_converged"] is False
    assert gap["fulfillment_converged"] is True
    assert gap["expected_count"] == 2
    assert gap["carried_count"] == 1
    assert gap["missing_count"] == 1
    assert gap["extra_count"] == 0
    assert gap["carry_delta"] == pytest.approx(0.5)
    assert gap["fulfillment_delta"] == pytest.approx(0.0)
    assert gap["blocking_obligation_ids"] == ["REQ-TRACE-002"]
    missing = gap["blocking_obligations"][0]
    assert missing["id"] == "REQ-TRACE-002"
    assert missing["carry_status"] == "missing"
    assert missing["fulfillment_status"] == "unassessed"
    assert missing["fulfillment_detail"] == "planned"
    assert missing["blocking_reasons"] == [
        "missing_from_current_requirement_surface",
        "missing_code_realization",
    ]


def test_declared_obligation_carry_gate_fails_when_edge_loses_requirement_membership(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-declared-obligation-carry"
    _seed_traceability_workspace(workspace)

    exit_code, payload, _ = _run_fd_check(
        "obligation-ledger-carry-converged",
        workspace,
        edge="derive_test_design_surface",
    )

    assert exit_code == 1
    assert payload["check"] == "obligation-ledger-carry-converged"
    assert payload["edge"] == "derive_test_design_surface"
    assert payload["carry_converged"] is False
    assert payload["missing_count"] == 0
    assert payload["extra_count"] == 1
    assert payload["blocking_obligation_ids"] == ["REQ-TRACE-003"]


def test_declared_obligation_carry_gate_fails_for_implementation_design_when_target_surface_drops_requirements(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-implementation-design-carry"
    _seed_traceability_workspace(workspace)
    _write(
        workspace / tenant_design_relative_path("scala_spark", "40-generated-implementation-design.md"),
        "\n".join(
            (
                "# Generated Implementation Design",
                "",
                "- REQ-TRACE-001",
                "- REQ-TRACE-003",
                "",
            )
        ),
    )

    exit_code, payload, _ = _run_fd_check(
        "obligation-ledger-carry-converged",
        workspace,
        edge="derive_implementation_design_surface",
    )

    assert exit_code == 1
    assert payload["check"] == "obligation-ledger-carry-converged"
    assert payload["edge"] == "derive_implementation_design_surface"
    assert payload["carry_converged"] is False
    assert payload["missing_count"] == 0
    assert payload["extra_count"] == 1
    assert payload["blocking_obligation_ids"] == ["REQ-TRACE-003"]


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


def test_code_surface_construction_does_not_delete_tenant_governance_surfaces(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-code-preserves-governance"
    tenant_name = "scala_spark"
    _write(
        workspace / ".ai-workspace" / "context" / "project_constraints.yml",
        "\n".join(
            (
                "project:",
                '  name: "fd-evidence-code-preserves-governance"',
                '  kind: "software-project"',
                '  language: "Scala"',
                '  test_runner: "sbt test"',
                '  module_structure: "multi_module(app-core)"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "scala_spark"',
                '      output_dir: "build_tenants/scala_spark/"',
                '      description: "scala traceability lane"',
                '      test_execution_contract: "sbt test"',
                "  root_code_policy: reject",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "INTENT.md",
        "\n".join(("# Intent", "", "**Project**: fd-evidence-code-preserves-governance", "")),
    )
    _write(
        workspace / "specification" / "requirements" / "01-live.md",
        "\n".join(("# Live Requirements", "", "- REQ-TRACE-001: Preserve governance surfaces.", "")),
    )
    feature_decomp = workspace / tenant_design_relative_path(tenant_name, "20-generated-feature-decomp.md")
    _write(
        feature_decomp,
        "\n".join(
            (
                "# Generated Feature Decomposition",
                "",
                asset_marker("feature_decomp_surface"),
                "",
                "- REQ-TRACE-001",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_design_relative_path(tenant_name, "40-generated-implementation-modules.md"),
        "\n".join(("# Generated Implementation Modules", "", "- app-core realizes REQ-TRACE-001", "")),
    )
    _write(
        workspace / tenant_design_relative_path(tenant_name, "40-generated-implementation-stack.md"),
        "\n".join(("# Generated Implementation Stack Profile", "", "- Scala", "- sbt", "")),
    )
    manifest_path = _write_manifest(
        workspace / ".ai-workspace" / "fp_manifests" / "derive_code_surface_test.json",
        target_asset="code_surface",
        evaluator_name="code_surface_semantically_converged",
    )

    constructor_result = construct_manifest(manifest_path, workspace_root=workspace)

    assert constructor_result["target_asset"] == "code_surface"
    assert feature_decomp.read_text(encoding="utf-8").startswith("# Generated Feature Decomposition")
    assert (workspace / "build_tenants" / "scala_spark" / "build.sbt").is_file()
    materialization = constructor_result["work_report"]["materialization_report"]
    assert materialization["delete_policy"] == "no_existing_entries_deleted"
    assert materialization["removed_entries"] == []
    assert "build_tenants/scala_spark/design" in materialization["preserved_existing_entries"]


def test_requirement_family_traceability_publication_is_projected_into_closure_register(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-family-traceability"
    _seed_traceability_workspace(workspace)

    publication = build_requirement_traceability_index(workspace).requirement_family_traceability_scan()
    assert publication["summary"]["active_requirement_family_count"] == 1
    assert publication["summary"]["missing_carry_publication_count"] == 0
    assert publication["summary"]["missing_authoring_design_publication_count"] == 0
    assert publication["summary"]["invalid_carry_ref_count"] == 0
    assert publication["summary"]["invalid_authoring_design_ref_count"] == 0
    assert publication["summary"]["missing_authoring_design_backlink_count"] == 0

    register = build_requirement_closure_register(workspace)
    assert register["summary"]["requirement_families_missing_carry_publication"] == 0
    assert register["summary"]["requirement_families_missing_authoring_design_publication"] == 0
    assert register["summary"]["requirement_family_invalid_authoring_design_refs"] == 0
    assert register["summary"]["requirement_family_missing_design_backlinks"] == 0


def test_requirement_family_traceability_check_fails_when_authoring_design_publication_is_missing(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "fd-evidence-family-traceability-missing-design"
    _seed_traceability_workspace(workspace)
    _write(
        workspace / "specification" / "requirements" / "01-live.md",
        "\n".join(
            (
                "# Live Requirements",
                "",
                "**Family**: REQ-TRACE-*",
                "**Status**: Active",
                "**Category**: Capability",
                "**Carries Forward From**: None",
                "",
                "- REQ-TRACE-001: Carry a realized implementation path.",
                "- REQ-TRACE-002: Carry a second realized implementation path.",
                "",
            )
        ),
    )

    exit_code, payload, _ = _run_fd_check("requirement-family-traceability-published", workspace)

    assert exit_code == 1
    assert payload["failure_kind"] == "traceability_publication_gap"
    assert payload["missing_authoring_design_fields"] == [
        "specification/requirements/01-live.md"
    ]
