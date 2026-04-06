# Validates: REQ-F-ASSETMODEL-001
# Validates: REQ-F-ASSETMODEL-002
# Validates: REQ-F-ASSETMODEL-003
# Validates: REQ-F-ASSETMODEL-004
# Validates: REQ-F-ASSETMODEL-005
# Validates: REQ-F-ODDSDLC-001
# Validates: REQ-F-ODDSDLC-002
# Validates: REQ-F-ODDSDLC-003
# Validates: REQ-F-ODDSDLC-004
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[5]
GENESIS_PATH = ROOT / ".genesis"
CODE_PATH = ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))

from odd_sdlc.app import bootstrap, catalog, initialize  # noqa: E402
from odd_sdlc.gtl_module import module as odd_sdlc_module  # noqa: E402


def _seed_workspace(path: Path) -> None:
    (path / "specification" / "requirements").mkdir(parents=True, exist_ok=True)
    (path / "specification" / "INTENT.md").write_text("# Intent\n", encoding="utf-8")
    (path / "specification" / "PRODUCT.md").write_text("# Product\n", encoding="utf-8")
    (path / "specification" / "GOALS.md").write_text("# Goals\n", encoding="utf-8")
    (path / "specification" / "requirements" / "10-bootstrap.md").write_text(
        "# Bootstrap Requirements\n",
        encoding="utf-8",
    )


def _read_events(workspace_root: Path) -> list[dict]:
    events_path = workspace_root / ".ai-workspace" / "events" / "events.jsonl"
    return [
        json.loads(line)
        for line in events_path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def test_module_publishes_first_asset_function_catalog() -> None:
    module = odd_sdlc_module()
    graph_function_names = [graph_function.name for graph_function in module.graph_functions]
    assert graph_function_names == [
        "derive_intent_surface",
        "derive_product_surface",
        "derive_goal_surface",
        "derive_requirement_surface",
        "derive_feature_decomp_surface",
        "derive_uat_testcases_surface",
    ]
    input_signatures = {
        graph_function.name: [node.name for node in graph_function.inputs]
        for graph_function in module.graph_functions
    }
    assert input_signatures == {
        "derive_intent_surface": ["input_set"],
        "derive_product_surface": ["input_set", "intent_surface"],
        "derive_goal_surface": ["input_set", "intent_surface", "product_surface"],
        "derive_requirement_surface": [
            "input_set",
            "intent_surface",
            "product_surface",
            "goal_surface",
        ],
        "derive_feature_decomp_surface": ["requirement_surface"],
        "derive_uat_testcases_surface": ["requirement_surface"],
    }
    assert [job.name for job in module.jobs] == [
        "derive_intent_surface_job",
        "derive_product_surface_job",
        "derive_goal_surface_job",
        "derive_requirement_surface_job",
        "derive_feature_decomp_surface_job",
        "derive_uat_testcases_surface_job",
    ]


def test_catalog_reports_uri_assets_and_bindings(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))
    result = catalog(app)

    semantic_facets = {facet["name"] for facet in result["semantic_facets"]}
    assert {
        "structured_document",
        "spec_surface",
        "verification_surface",
        "authority_surface",
        "argument_surface",
        "singleton_surface",
        "collection_surface",
        "generated_surface",
    } <= semantic_facets

    asset_types = {asset_type["name"]: asset_type for asset_type in result["asset_types"]}
    assert asset_types["singleton_spec_document"]["library_level"] == "generic"
    assert asset_types["requirement_collection_surface"]["library_level"] == "generic"
    assert asset_types["derived_structure_surface"]["library_level"] == "generic"
    assert asset_types["verification_collection_surface"]["library_level"] == "generic"
    assert asset_types["intent_doc"]["semantic_facets"] == [
        "structured_document",
        "spec_surface",
        "argument_surface",
        "singleton_surface",
        "generated_surface",
    ]
    assert asset_types["intent_doc"]["specializes"] == ["singleton_spec_document"]
    assert asset_types["intent_doc"]["library_level"] == "specialized"
    assert asset_types["requirement_surface"]["specializes"] == ["requirement_collection_surface"]
    assert asset_types["feature_decomp_surface"]["specializes"] == ["derived_structure_surface"]
    assert asset_types["uat_testcases_surface"]["specializes"] == ["verification_collection_surface"]
    assert asset_types["proof_surface"]["mutable_default"] is False

    asset_uris = {asset["uri"] for asset in result["assets"]}
    assert "file://specification/INTENT.md" in asset_uris
    assert "file://specification/PRODUCT.md" in asset_uris
    assert "file://specification/GOALS.md" in asset_uris
    assert "file://specification/requirements" in asset_uris
    assert "file://build_tenants/common/design/20-generated-feature-decomp.md" in asset_uris
    assert "file://specification/scenarios/20-generated-uat-testcases.md" in asset_uris

    intent_asset = next(asset for asset in result["assets"] if asset["asset_id"] == "intent_surface")
    assert intent_asset["provenance"] == {
        "model": "projected_checkpoint",
        "source": "workspace_materialized_state",
        "mutable": True,
        "history_basis": "runtime_and_constructive_event_history",
    }
    assert intent_asset["checkpoint"]["exists"] is True
    assert intent_asset["checkpoint"]["path_kind"] == "file"
    assert intent_asset["checkpoint"]["content_digest"]
    assert intent_asset["checkpoint"]["bytes"] is not None
    feature_asset = next(asset for asset in result["assets"] if asset["asset_id"] == "feature_decomp_surface")
    assert feature_asset["checkpoint"]["exists"] is False

    bindings = {binding["node"]: tuple(binding["asset_ids"]) for binding in result["bindings"]}
    assert bindings["input_set"] == ("intent_surface", "product_surface", "goal_surface")
    assert bindings["intent_surface"] == ("intent_surface",)
    assert bindings["product_surface"] == ("product_surface",)
    assert bindings["goal_surface"] == ("goal_surface",)
    assert bindings["requirement_surface"] == ("requirement_surface",)
    assert bindings["feature_decomp_surface"] == ("feature_decomp_surface",)
    assert bindings["uat_testcases_surface"] == ("uat_testcases_surface",)


def test_observe_exposes_ui_steel_thread_payload(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    env = {
        **os.environ,
        "PYTHONPATH": os.pathsep.join((str(GENESIS_PATH), str(CODE_PATH))),
    }
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "odd_sdlc",
            "observe",
            "--workspace",
            str(tmp_path),
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env=env,
        check=True,
    )

    payload = json.loads(result.stdout)
    assert sorted(payload.keys()) == [
        "asset_types",
        "assets",
        "bindings",
        "continuations",
        "functions",
        "gaps",
        "graph_calls",
        "query_contract",
        "recent_events",
        "runs",
        "semantic_facets",
        "workspace_root",
    ]
    assert len(payload["assets"]) == 6
    assert len(payload["functions"]) == 6
    assert payload["gaps"]["converged"] is False
    assert payload["runs"] == []
    assert payload["graph_calls"] == []
    assert payload["continuations"] == []
    assert payload["recent_events"] == []
    assert all(asset["projection_source"] == "workspace_scan" for asset in payload["assets"])


def test_query_domain_exposes_domain_views_without_runtime_duplication(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    env = {
        **os.environ,
        "PYTHONPATH": os.pathsep.join((str(GENESIS_PATH), str(CODE_PATH))),
    }
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "odd_sdlc",
            "query-domain",
            "--workspace",
            str(tmp_path),
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env=env,
        check=True,
    )

    payload = json.loads(result.stdout)
    assert sorted(payload.keys()) == [
        "asset_types",
        "assets",
        "bindings",
        "functions",
        "gaps",
        "query_contract",
        "semantic_facets",
        "workspace_root",
    ]
    assert payload["query_contract"] == {
        "name": "odd_sdlc.query-domain",
        "version": "v1",
        "top_level_keys": [
            "query_contract",
            "workspace_root",
            "semantic_facets",
            "asset_types",
            "assets",
            "functions",
            "bindings",
            "gaps",
        ],
        "runtime_model": "abg-native",
        "query_model": "odd-domain-plugin",
    }
    assert "runs" not in payload
    assert "graph_calls" not in payload
    assert "continuations" not in payload
    assert len(payload["assets"]) == 6
    assert len(payload["functions"]) == 6
    assert payload["gaps"]["converged"] is False
    functions = {entry["name"]: entry for entry in payload["functions"]}
    assert functions["derive_product_surface"]["inputs"] == ["input_set", "intent_surface"]
    assert functions["derive_goal_surface"]["inputs"] == [
        "input_set",
        "intent_surface",
        "product_surface",
    ]
    assert functions["derive_feature_decomp_surface"]["inputs"] == ["requirement_surface"]
    assert functions["derive_uat_testcases_surface"]["inputs"] == ["requirement_surface"]


def test_start_runs_through_declared_entry_and_emits_abg_facts(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    env = {
        **os.environ,
        "PYTHONPATH": os.pathsep.join((str(GENESIS_PATH), str(CODE_PATH))),
    }
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "odd_sdlc",
            "start",
            "--workspace",
            str(tmp_path),
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env=env,
        check=True,
    )

    payload = json.loads(result.stdout)
    assert payload["status"] == "iterated"
    assert payload["edge"] == "derive_intent_surface"
    assert "run_id" in payload
    assert "call_id" in payload

    events = _read_events(tmp_path)
    event_types = [event["event_type"] for event in events]
    assert "graph_call_opened" in event_types
    assert "vector_started" in event_types
    assert "fp_dispatched" in event_types

    graph_call_event = next(event for event in events if event["event_type"] == "graph_call_opened")
    assert graph_call_event["aggregate_type"] == "graph_call"
    assert graph_call_event["aggregate_id"] == payload["call_id"]
