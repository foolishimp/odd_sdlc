# Implements: REQ-F-ODDSDLC-003
"""CLI entry for the active odd_sdlc software-domain package."""
from __future__ import annotations

import argparse
import json

from .analysis import refresh_analysis
from .app import bootstrap, catalog, gap_operator_analysis, gaps, initialize, iterate, start
from .continuation import continue_with_result
from .constructor import construct_manifest
from .normalization import normalize_workspace
from .observer import observe
from .operational_dispatch import dispatch_operational
from .query import query_asset_bindings, query_domain
from .release.install import install as install_release
from .sandbox_lifecycle import observe_sandbox, prepare_sandbox, reset_sandbox_runtime_state
from .self_test import programs, self_test


def _stopped_by(result: object) -> str | None:
    if not isinstance(result, dict):
        return None
    stopped_by = result.get("stopped_by")
    return stopped_by if isinstance(stopped_by, str) else None


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="odd_sdlc")
    subparsers = parser.add_subparsers(dest="command", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--workspace", default=".")

    subparsers.add_parser("catalog", parents=[common])
    subparsers.add_parser("programs", parents=[common])
    subparsers.add_parser("observe", parents=[common])
    subparsers.add_parser("query-assets", parents=[common])
    subparsers.add_parser("query-domain", parents=[common])
    subparsers.add_parser("refresh-analysis", parents=[common])
    gaps_parser = subparsers.add_parser(
        "gaps",
        parents=[common],
        help="Public odd_sdlc operator gap-analysis command",
        description=(
            "Public odd_sdlc operator gap-analysis command. Bare gaps defaults to "
            "workspace scope and returns frontier classification plus next lawful "
            "steps. Use --format json for the raw dossier carrier."
        ),
    )
    gaps_parser.add_argument("--scope", default="workspace", help="Gap scope; bare gaps defaults to workspace.")
    gaps_parser.add_argument("--from-edge")
    gaps_parser.add_argument("--to-edge")
    gaps_parser.add_argument("--zoom", choices=["coarse", "refined", "combined"], default="combined")
    gaps_parser.add_argument("--include-dependent", action="store_true", default=True)
    gaps_parser.add_argument("--direct-only", dest="include_dependent", action="store_false")
    gaps_parser.add_argument(
        "--format",
        choices=["operator", "json"],
        default="operator",
        help="Output operator analysis by default; use json for the raw machine dossier.",
    )
    gaps_parser.add_argument("--raw", dest="format", action="store_const", const="json", help=argparse.SUPPRESS)
    iterate_parser = subparsers.add_parser(
        "iterate",
        parents=[common],
        help="Internal traversal primitive",
        description="Internal traversal primitive. Not part of the public odd_sdlc operator workflow.",
    )
    iterate_parser.add_argument("--scope", default="workspace")
    subparsers.add_parser("dispatch-operational", parents=[common])
    subparsers.add_parser("self-test", parents=[common])
    subparsers.add_parser("prepare-sandbox", parents=[common])
    subparsers.add_parser("observe-sandbox", parents=[common])
    subparsers.add_parser("reset-sandbox", parents=[common])
    continue_parser = subparsers.add_parser("continue", parents=[common])
    continue_parser.add_argument("--result", required=True)
    normalize_parser = subparsers.add_parser("normalize-workspace", parents=[common])
    normalize_parser.add_argument("--project-slug")
    normalize_parser.add_argument("--platform")
    construct_parser = subparsers.add_parser("construct", parents=[common])
    construct_parser.add_argument("--manifest", required=True)
    start_parser = subparsers.add_parser(
        "start",
        parents=[common],
        help="Public odd_sdlc graph/worksite advancement command",
        description="Public odd_sdlc graph/worksite advancement command. Advance the governed graph from the declared scope toward the declared target until the declared stopping condition is reached.",
    )
    start_parser.add_argument("--scope", required=True)
    start_parser.add_argument(
        "--target",
        required=True,
        help=(
            "Public target selector: next, graph_function:<published_handle>, "
            "or asset:<published_handle> from odd_sdlc query-domain"
        ),
    )
    start_parser.add_argument(
        "--until",
        required=True,
        choices=["first_traversal", "blocked", "converged"],
    )
    start_parser.add_argument("--fh-mode", choices=["direct", "human-proxy"], default="direct")
    start_parser.add_argument("--root-mode", choices=["direct", "supervised"], default="direct")
    install_parser = subparsers.add_parser("install")
    install_parser.add_argument("--target", required=True)
    install_parser.add_argument("--project-slug")
    install_parser.add_argument("--platform", default="python")

    hidden_top_level = {"iterate"}
    subparsers._choices_actions = [
        action for action in subparsers._choices_actions if getattr(action, "dest", None) not in hidden_top_level
    ]

    args = parser.parse_args(argv)

    if args.command == "install":
        result: object = install_release(
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

    if args.command == "prepare-sandbox":
        result = prepare_sandbox(args.workspace)
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0
    if args.command == "observe-sandbox":
        result = observe_sandbox(args.workspace)
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0
    if args.command == "reset-sandbox":
        result = reset_sandbox_runtime_state(args.workspace)
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
    elif args.command == "query-assets":
        result = query_asset_bindings(app)
    elif args.command == "query-domain":
        result = query_domain(app)
    elif args.command == "refresh-analysis":
        result = refresh_analysis(args.workspace)
    elif args.command == "gaps":
        if args.format == "operator" and args.from_edge is None and args.to_edge is None:
            result = gap_operator_analysis(
                app,
                scope=args.scope,
                include_dependent=args.include_dependent,
            )
        else:
            result = gaps(
                app,
                scope=args.scope,
                from_edge=args.from_edge,
                to_edge=args.to_edge,
                zoom=args.zoom,
                include_dependent=args.include_dependent,
            )
    elif args.command == "iterate":
        result = iterate(app, scope=args.scope)
    elif args.command == "dispatch-operational":
        result = dispatch_operational(app)
    elif args.command == "self-test":
        result = self_test(app)
    elif args.command == "continue":
        result = continue_with_result(app, result_path=args.result)
    elif args.command == "construct":
        result = construct_manifest(args.manifest, workspace_root=args.workspace)
    else:
        result = start(
            app,
            scope=args.scope,
            target=args.target,
            until=args.until,
            fh_mode=args.fh_mode,
            root_mode=args.root_mode,
        )

    print(json.dumps(result, indent=2, sort_keys=True))
    stopped_by = _stopped_by(result)
    if args.command == "start" and stopped_by == "fh_gate":
        return 3
    if args.command == "start" and stopped_by == "yield":
        return 6
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
