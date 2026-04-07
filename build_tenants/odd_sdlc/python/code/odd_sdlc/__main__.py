# Implements: REQ-F-ODDSDLC-003
"""CLI entry for the first odd_sdlc slice."""
from __future__ import annotations

import argparse
import json

from .app import bootstrap, catalog, gaps, initialize, iterate, start
from .constructor import construct_manifest
from .normalization import normalize_workspace
from .observer import observe
from .query import query_domain
from .release.install import install as install_release
from .self_test import programs, self_test


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="odd_sdlc")
    subparsers = parser.add_subparsers(dest="command", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--workspace", default=".")

    subparsers.add_parser("catalog", parents=[common])
    subparsers.add_parser("programs", parents=[common])
    subparsers.add_parser("observe", parents=[common])
    subparsers.add_parser("query-domain", parents=[common])
    subparsers.add_parser("gaps", parents=[common])
    subparsers.add_parser("iterate", parents=[common])
    subparsers.add_parser("self-test", parents=[common])
    normalize_parser = subparsers.add_parser("normalize-workspace", parents=[common])
    normalize_parser.add_argument("--project-slug")
    normalize_parser.add_argument("--platform", default="python")
    construct_parser = subparsers.add_parser("construct", parents=[common])
    construct_parser.add_argument("--manifest", required=True)
    start_parser = subparsers.add_parser("start", parents=[common])
    start_parser.add_argument("--auto", action="store_true")
    install_parser = subparsers.add_parser("install")
    install_parser.add_argument("--target", required=True)
    install_parser.add_argument("--project-slug")
    install_parser.add_argument("--platform", default="python")

    args = parser.parse_args(argv)

    if args.command == "install":
        result = install_release(
            args.target,
            project_slug=args.project_slug,
            platform=args.platform,
        )
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0

    if args.command == "normalize-workspace":
        result = normalize_workspace(
            args.workspace,
            project_slug=args.project_slug,
            platform=args.platform,
        )
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0

    app = initialize(bootstrap(workspace_root=args.workspace))

    if args.command == "catalog":
        result = catalog(app)
    elif args.command == "programs":
        result = {
            "workspace_root": str(app.config.workspace_root),
            "programs": programs(),
        }
    elif args.command == "observe":
        result = observe(app)
    elif args.command == "query-domain":
        result = query_domain(app)
    elif args.command == "gaps":
        result = gaps(app)
    elif args.command == "iterate":
        result = iterate(app)
    elif args.command == "self-test":
        result = self_test(app)
    elif args.command == "construct":
        result = construct_manifest(args.manifest, workspace_root=args.workspace)
    else:
        result = start(app, auto=args.auto)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
