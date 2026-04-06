# Implements: REQ-F-RUNTIME-003
# Implements: REQ-F-ODDSDLC-004
"""Deterministic checks for the first odd_sdlc slice."""
from __future__ import annotations

import argparse
from pathlib import Path


def _require_exists(path: Path) -> bool:
    return path.exists()


def bootstrap_input_set_present(workspace_root: Path) -> int:
    required = (
        workspace_root / "specification" / "INTENT.md",
        workspace_root / "specification" / "PRODUCT.md",
        workspace_root / "specification" / "GOALS.md",
    )
    return 0 if all(_require_exists(path) for path in required) else 1


def requirements_boundary_sources_present(workspace_root: Path) -> int:
    required = (
        workspace_root / "specification" / "INTENT.md",
        workspace_root / "specification" / "PRODUCT.md",
        workspace_root / "specification" / "GOALS.md",
        workspace_root / "specification" / "requirements",
    )
    return 0 if all(_require_exists(path) for path in required) else 1


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="odd_sdlc.fd_checks")
    parser.add_argument(
        "check",
        choices=("bootstrap-input-set-present", "requirements-boundary-sources-present"),
    )
    parser.add_argument("--workspace", default=".")
    args = parser.parse_args(argv)

    workspace_root = Path(args.workspace).resolve()
    if args.check == "bootstrap-input-set-present":
        return bootstrap_input_set_present(workspace_root)
    return requirements_boundary_sources_present(workspace_root)


if __name__ == "__main__":
    raise SystemExit(main())
