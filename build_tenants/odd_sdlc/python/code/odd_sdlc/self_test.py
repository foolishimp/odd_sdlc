# Implements: REQ-F-ODDSDLC-006
"""Executive odd_program runner for the current odd_sdlc steel thread."""
from __future__ import annotations

from typing import Any

from genesis.result_ingest import ingest_fp_result

from .app import OddSdlcApp, start
from .constructor import construct_manifest
from .program_catalog import BOOTSTRAP_RELEASE_SELF_TEST, PROGRAM_CATALOG, program_by_name


def programs() -> list[dict[str, Any]]:
    return [entry.to_dict() for entry in PROGRAM_CATALOG]


def run_program(app: OddSdlcApp, *, name: str) -> dict[str, Any]:
    program = program_by_name(name)
    workspace_root = app.config.workspace_root
    steps: list[dict[str, Any]] = []

    for expected_edge in program.steps:
        start_result = start(app)
        status = start_result.get("status")
        if status != "iterated":
            raise RuntimeError(
                f"odd_program {program.name!r} expected {expected_edge!r} "
                f"but start returned non-iterated status {status!r}"
            )
        actual_edge = start_result.get("edge")
        if actual_edge != expected_edge:
            raise RuntimeError(
                f"odd_program {program.name!r} expected {expected_edge!r} "
                f"but start selected {actual_edge!r}"
            )
        manifest_path = start_result.get("fp_manifest_path")
        if not isinstance(manifest_path, str) or not manifest_path:
            raise RuntimeError(
                f"odd_program {program.name!r} step {expected_edge!r} "
                "did not produce fp_manifest_path"
            )
        constructor_result = construct_manifest(manifest_path, workspace_root=workspace_root)
        assessed_result = ingest_fp_result(constructor_result["result_path"], workspace_root)
        steps.append(
            {
                "edge": expected_edge,
                "start": start_result,
                "constructor": constructor_result,
                "assessed": assessed_result,
            }
        )

    final_state = start(app)
    return {
        "status": "ok",
        "program": program.to_dict(),
        "completed_edges": [step["edge"] for step in steps],
        "steps": steps,
        "final_state": final_state,
    }


def self_test(app: OddSdlcApp) -> dict[str, Any]:
    return run_program(app, name=BOOTSTRAP_RELEASE_SELF_TEST.name)
