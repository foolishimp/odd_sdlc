# Implements: REQ-F-ODDSVC-003
# Implements: REQ-F-ODDSVC-004
# Implements: REQ-F-ODDSVC-005
from __future__ import annotations

import argparse
import json

from .service import approve
from .service import attach_worker
from .service import catalog
from .service import detach_worker
from .service import gaps
from .service import observe
from .service import reject
from .service import run
from .service import start
from .service import status
from .service import step
from .service import workers


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="odd_service")
    subparsers = parser.add_subparsers(dest="command", required=True)

    workspace_common = argparse.ArgumentParser(add_help=False)
    workspace_common.add_argument("--workspace", default=".")

    run_common = argparse.ArgumentParser(add_help=False)
    run_common.add_argument("--workspace", default=".")
    run_common.add_argument("--run-id", required=True)

    worker_common = argparse.ArgumentParser(add_help=False)
    worker_common.add_argument("--worker-name")
    worker_common.add_argument("--agent")

    subparsers.add_parser("status", parents=[workspace_common])
    subparsers.add_parser("catalog", parents=[workspace_common])
    subparsers.add_parser("workers", parents=[workspace_common])

    attach = subparsers.add_parser("attach", parents=[workspace_common])
    attach.add_argument("--worker-name", required=True)
    attach.add_argument("--agent", required=True)
    attach.add_argument("--transport", default="local")
    attach.add_argument("--authority-ref", default="runtime://odd_service")

    detach = subparsers.add_parser("detach", parents=[workspace_common])
    detach.add_argument("--worker-name", required=True)

    start_parser = subparsers.add_parser("start", parents=[workspace_common, worker_common])
    del start_parser
    run_parser = subparsers.add_parser("run", parents=[workspace_common, worker_common])
    run_parser.add_argument("--human-proxy", action="store_true")

    subparsers.add_parser("step", parents=[run_common])
    gaps_parser = subparsers.add_parser("gaps", parents=[run_common])
    del gaps_parser
    observe_parser = subparsers.add_parser("observe", parents=[run_common])
    observe_parser.add_argument("--since")

    approve_parser = subparsers.add_parser("approve", parents=[run_common])
    approve_parser.add_argument("--edge")
    approve_parser.add_argument("--actor", default="human")

    reject_parser = subparsers.add_parser("reject", parents=[run_common])
    reject_parser.add_argument("--edge")
    reject_parser.add_argument("--actor", default="human")
    reject_parser.add_argument("--reason", required=True)

    args = parser.parse_args(argv)

    if args.command == "status":
        result = status(args.workspace)
    elif args.command == "catalog":
        result = catalog(args.workspace)
    elif args.command == "workers":
        result = workers(args.workspace)
    elif args.command == "attach":
        result = attach_worker(
            args.workspace,
            name=args.worker_name,
            agent=args.agent,
            transport=args.transport,
            authority_ref=args.authority_ref,
        )
    elif args.command == "detach":
        result = detach_worker(args.workspace, name=args.worker_name)
    elif args.command == "start":
        result = start(args.workspace, worker_name=args.worker_name, agent=args.agent)
    elif args.command == "run":
        result = run(
            args.workspace,
            worker_name=args.worker_name,
            agent=args.agent,
            human_proxy=args.human_proxy,
        )
    elif args.command == "step":
        result = step(args.workspace, run_id=args.run_id)
    elif args.command == "gaps":
        result = gaps(args.workspace, run_id=args.run_id)
    elif args.command == "observe":
        result = observe(args.workspace, run_id=args.run_id, since=args.since)
    elif args.command == "approve":
        result = approve(args.workspace, run_id=args.run_id, edge=args.edge, actor=args.actor)
    else:
        result = reject(
            args.workspace,
            run_id=args.run_id,
            edge=args.edge,
            actor=args.actor,
            reason=args.reason,
        )

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
