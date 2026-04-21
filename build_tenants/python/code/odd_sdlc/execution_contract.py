# Implements: REQ-F-ODDSDLC-040
"""Admitted execution-contract surface for odd_sdlc dispatch."""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
from typing import Any, Mapping

from .start_targeting import resolve_start_target
from .work_item_routing import (
    STARTABLE_WORK_ITEM_STATUSES,
    load_work_item_ticket_surface,
    work_item_route_contract_from_ticket_surface,
)


EXECUTION_CONTRACT_KIND = "odd_sdlc.execution_contract_surface"
DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION = "derive_execution_contract_surface"
ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION = "admit_execution_contract_surface"
EXECUTION_CONTRACT_REGISTER_PATH = Path(".ai-workspace/runtime/odd_sdlc-execution-contract.json")
EXECUTION_CONTRACT_CONTEXT_PATH = Path(".ai-workspace/runtime/odd_sdlc-execution-contract.md")


@dataclass(frozen=True)
class BoundExecutionStart:
    scope: Any
    target: Any
    execution_contract: dict[str, Any]


def _write_if_changed(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return
    path.write_text(content, encoding="utf-8")


def _load_existing_contract(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    return payload if isinstance(payload, dict) else None


def _parse_key_value_lines(text: str) -> dict[str, str]:
    payload: dict[str, str] = {}
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- "):
            stripped = stripped[2:].strip()
        if ":" not in stripped:
            continue
        key, _, value = stripped.partition(":")
        key = key.strip()
        value = value.strip()
        if key and value:
            payload[key] = value
    return payload


def _bullet_lines(text: str) -> list[str]:
    entries: list[str] = []
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- "):
            stripped = stripped[2:].strip()
        if stripped:
            entries.append(stripped)
    return entries


def _unchecked_checklist_items(text: str) -> list[str]:
    items: list[str] = []
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- [ ] "):
            items.append(stripped[len("- [ ] "):].strip())
    return items


def _coerce_string_list(value: Any) -> list[str]:
    if isinstance(value, (list, tuple)):
        return [str(entry).strip() for entry in value if str(entry).strip()]
    if isinstance(value, str) and value.strip():
        return [value.strip()]
    return []


def _normalized_target_summary(
    *,
    raw_target: str,
    normalized_scope: str,
    until: str,
    resolved_target: Any,
    route_contract: Mapping[str, Any] | None,
) -> dict[str, Any]:
    payload = {
        "normalized_scope": normalized_scope,
        "public_target": raw_target,
        "until": until,
        "kind": str(getattr(resolved_target, "kind", "")),
        "handle": getattr(resolved_target, "handle", None),
        "target_id": getattr(resolved_target, "target_id", None),
        "graph_function_name": getattr(resolved_target, "graph_function_name", None),
        "asset_id": getattr(resolved_target, "asset_id", None),
        "asset_uri": getattr(resolved_target, "asset_uri", None),
        "asset_relative_path": getattr(resolved_target, "asset_relative_path", None),
        "binding_source": getattr(resolved_target, "binding_source", None),
        "route_contract": dict(route_contract) if isinstance(route_contract, Mapping) else None,
    }
    return {key: value for key, value in payload.items() if value not in (None, "", {})}


def _ordinary_execution_contract(
    *,
    raw_target: str,
    normalized_scope: str,
    until: str,
    resolved_target: Any,
    route_contract: Mapping[str, Any] | None,
) -> dict[str, Any]:
    target_truth = _normalized_target_summary(
        raw_target=raw_target,
        normalized_scope=normalized_scope,
        until=until,
        resolved_target=resolved_target,
        route_contract=route_contract,
    )
    return {
        "source_kind": "operator_request",
        "ticket_category": "ordinary",
        "change_class": "realization_refactor",
        "re_entry_point": "realization_surface",
        "affected_boundary": "odd_sdlc start dispatch over published graph-function target truth",
        "target_truth": target_truth,
        "closure_law": (
            "Dispatch stays open until the selected graph-function edge advances under published "
            "deterministic failure law, output contract law, and later proof/gap-analysis review."
        ),
        "evaluation_criteria": [
            "scope, target, and until are normalized before dispatch",
            "prompt assembly consumes the admitted execution contract rather than ad hoc operator phrasing",
            "later proof and gap analysis can evaluate the same admitted basis",
        ],
        "non_closure_conditions": [
            "dispatch begins without an admitted execution contract",
            "prompt or manifest provenance is derived from raw operator phrasing instead of admitted contract truth",
            "proof or gap analysis cannot attribute the turn back to the admitted execution basis",
        ],
        "proof_surface": [
            EXECUTION_CONTRACT_REGISTER_PATH.as_posix(),
            EXECUTION_CONTRACT_CONTEXT_PATH.as_posix(),
            ".ai-workspace/runtime/odd_sdlc-gap-dossier-register.json",
        ],
    }


def _ticket_execution_contract(
    *,
    workspace_root: Path,
    raw_target: str,
    normalized_scope: str,
    until: str,
    resolved_target: Any,
) -> dict[str, Any]:
    ticket_relative_path = str(getattr(resolved_target, "asset_relative_path", "") or "")
    ticket_surface = load_work_item_ticket_surface(
        workspace_root,
        ticket_relative_path=ticket_relative_path,
    )
    if ticket_surface is None:
        raise ValueError(f"ticket asset {ticket_relative_path!r} is not present in workspace state")
    metadata = dict(ticket_surface.get("metadata") or {})
    sections = dict(ticket_surface.get("sections") or {})
    migration_declaration = _parse_key_value_lines(str(sections.get("Migration Declaration") or ""))
    acceptance_lines = _bullet_lines(str(sections.get("Acceptance") or ""))
    non_closure_conditions = _unchecked_checklist_items(
        str(sections.get("Migration Checklist") or "")
    )
    target_truth_statement = str(metadata.get("target_truth") or "").strip()
    explicit_evaluation_criteria = _coerce_string_list(metadata.get("evaluation_criteria"))
    explicit_non_closure_conditions = _coerce_string_list(metadata.get("non_closure_conditions"))
    explicit_proof_surface = _coerce_string_list(metadata.get("proof_surface"))
    ticket_status = str(metadata.get("status") or "").strip()
    route_contract = work_item_route_contract_from_ticket_surface(ticket_surface)
    target_truth = _normalized_target_summary(
        raw_target=raw_target,
        normalized_scope=normalized_scope,
        until=until,
        resolved_target=resolved_target,
        route_contract=route_contract,
    )
    target_truth["ticket_id"] = str(metadata.get("id") or "")
    target_truth["ticket_relative_path"] = ticket_relative_path
    if target_truth_statement:
        target_truth["ticket_target_truth"] = target_truth_statement
    proof_surface = []
    for entry in (
        *explicit_proof_surface,
        EXECUTION_CONTRACT_REGISTER_PATH.as_posix(),
        EXECUTION_CONTRACT_CONTEXT_PATH.as_posix(),
        ".ai-workspace/runtime/odd_sdlc-gap-dossier-register.json",
    ):
        if entry and entry not in proof_surface:
            proof_surface.append(entry)
    return {
        "source_kind": "ticket_work_item",
        "ticket_id": str(metadata.get("id") or ""),
        "ticket_title": str(metadata.get("title") or ""),
        "ticket_status": ticket_status,
        "ticket_category": str(metadata.get("ticket_category") or "ordinary"),
        "change_class": str(metadata.get("change_class") or ""),
        "re_entry_point": str(metadata.get("re_entry_point") or ""),
        "affected_boundary": str(
            metadata.get("affected_boundary")
            or "odd_sdlc intake routing, dispatch prompt assembly, and closure/gap-analysis attribution"
        ),
        "target_truth": target_truth,
        "superseded_truth": str(
            metadata.get("superseded_truth")
            or migration_declaration.get("old_truth_path")
            or ""
        ),
        "closure_law": str(
            metadata.get("closure_law")
            or migration_declaration.get("closure_law")
            or metadata.get("change_intent")
            or ""
        ),
        "evaluation_criteria": explicit_evaluation_criteria or acceptance_lines,
        "non_closure_conditions": explicit_non_closure_conditions or non_closure_conditions,
        "proof_surface": proof_surface,
        "route_contract": dict(route_contract) if isinstance(route_contract, Mapping) else None,
        "required_direction": str(sections.get("Required Direction") or "").strip(),
        "acceptance": str(sections.get("Acceptance") or "").strip(),
        "migration_declaration": str(sections.get("Migration Declaration") or "").strip(),
        "migration_checklist": str(sections.get("Migration Checklist") or "").strip(),
    }


def _validate_execution_contract(contract: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if not str(contract.get("closure_law") or "").strip():
        errors.append("closure_law is required")
    if not list(contract.get("evaluation_criteria") or ()):
        errors.append("evaluation_criteria is required")
    if not list(contract.get("proof_surface") or ()):
        errors.append("proof_surface is required")
    if contract.get("source_kind") == "ticket_work_item":
        ticket_status = str(contract.get("ticket_status") or "")
        if ticket_status not in STARTABLE_WORK_ITEM_STATUSES:
            errors.append(f"ticket_status {ticket_status!r} is not start-authoritative")
        route_contract = contract.get("route_contract")
        if not isinstance(route_contract, dict) or not str(route_contract.get("reentry_vector") or ""):
            errors.append("ticket_work_item contract requires admitted routed re-entry truth")
        if str(contract.get("ticket_category") or "") == "implementation_migration":
            if not str(contract.get("migration_declaration") or "").strip():
                errors.append("implementation_migration contract requires Migration Declaration")
            if not str(contract.get("migration_checklist") or "").strip():
                errors.append("implementation_migration contract requires Migration Checklist")
            if not list(contract.get("non_closure_conditions") or ()):
                errors.append("implementation_migration contract requires explicit non-closure conditions")
    return errors


def _carrier_graph_functions() -> dict[str, str]:
    return {
        "derive": DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION,
        "admit": ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION,
    }


def _contract_id(payload: dict[str, Any]) -> str:
    digest = hashlib.sha256(
        json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    return f"execution_contract/{digest[:16]}"


def _render_execution_contract_context(contract: Mapping[str, Any]) -> str:
    lines = [
        "# Admitted Execution Contract",
        "",
        "This dispatch is governed by one admitted execution contract surface.",
        "Use this surface as the current execution basis for prompt, closure, and later gap-analysis review.",
        "",
        "## Identity",
        f"- contract_id: {contract.get('contract_id', '')}",
        f"- contract_kind: {contract.get('contract_kind', '')}",
        f"- status: {contract.get('status', '')}",
        f"- source_kind: {contract.get('source_kind', '')}",
        f"- ticket_category: {contract.get('ticket_category', '')}",
        f"- change_class: {contract.get('change_class', '')}",
        f"- re_entry_point: {contract.get('re_entry_point', '')}",
    ]
    carrier_graph_functions = contract.get("carrier_graph_functions")
    if isinstance(carrier_graph_functions, Mapping):
        lines.extend(
            [
                "",
                "## Source Carrier",
                f"- derive: {carrier_graph_functions.get('derive', '')}",
                f"- admit: {carrier_graph_functions.get('admit', '')}",
            ]
        )
    target_truth = contract.get("target_truth")
    if isinstance(target_truth, Mapping):
        lines.extend(
            [
                "",
                "## Target Truth",
                *(f"- {key}: {value}" for key, value in target_truth.items()),
            ]
        )
    closure_law = str(contract.get("closure_law") or "").strip()
    if closure_law:
        lines.extend(["", "## Closure Law", closure_law])
    evaluation_criteria = list(contract.get("evaluation_criteria") or ())
    if evaluation_criteria:
        lines.extend(["", "## Evaluation Criteria", *[f"- {entry}" for entry in evaluation_criteria]])
    non_closure_conditions = list(contract.get("non_closure_conditions") or ())
    if non_closure_conditions:
        lines.extend(
            ["", "## Non-Closure Conditions", *[f"- {entry}" for entry in non_closure_conditions]]
        )
    proof_surface = list(contract.get("proof_surface") or ())
    if proof_surface:
        lines.extend(["", "## Proof Surface", *[f"- {entry}" for entry in proof_surface]])
    if str(contract.get("migration_declaration") or "").strip():
        lines.extend(["", "## Migration Declaration", str(contract["migration_declaration"])])
    if str(contract.get("migration_checklist") or "").strip():
        lines.extend(["", "## Migration Checklist", str(contract["migration_checklist"])])
    if str(contract.get("required_direction") or "").strip():
        lines.extend(["", "## Required Direction", str(contract["required_direction"])])
    if str(contract.get("acceptance") or "").strip():
        lines.extend(["", "## Acceptance", str(contract["acceptance"])])
    return "\n".join(lines).rstrip() + "\n"


def derive_execution_contract_surface(
    *,
    workspace_root: Path,
    module: Any,
    stream: Any,
    workflow_version: str,
    work_key: str | None,
    run_id: str | None,
    normalized_scope: str,
    raw_target: str,
    until: str,
) -> dict[str, Any]:
    from .runtime_effects import publish_runtime_event

    resolved_target = resolve_start_target(workspace_root, module, raw_target).target
    if str(getattr(resolved_target, "asset_relative_path", "") or ""):
        draft = _ticket_execution_contract(
            workspace_root=workspace_root,
            raw_target=raw_target,
            normalized_scope=normalized_scope,
            until=until,
            resolved_target=resolved_target,
        )
    else:
        draft = _ordinary_execution_contract(
            raw_target=raw_target,
            normalized_scope=normalized_scope,
            until=until,
            resolved_target=resolved_target,
            route_contract=None,
        )
    draft["contract_kind"] = EXECUTION_CONTRACT_KIND
    draft["carrier_graph_functions"] = _carrier_graph_functions()
    draft["contract_id"] = _contract_id(draft)
    draft["status"] = "drafted"
    publish_runtime_event(
        stream=stream,
        event_type="execution_contract_drafted",
        data={"execution_contract": dict(draft)},
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
        aggregate_type="execution_contract",
        aggregate_id=str(draft["contract_id"]),
    )
    return draft


def admit_execution_contract_surface(
    *,
    workspace_root: Path,
    module: Any,
    stream: Any,
    workflow_version: str,
    work_key: str | None,
    run_id: str | None,
    normalized_scope: str,
    raw_target: str,
    until: str,
) -> dict[str, Any]:
    from .runtime_effects import publish_runtime_event

    draft = derive_execution_contract_surface(
        workspace_root=workspace_root,
        module=module,
        stream=stream,
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
        normalized_scope=normalized_scope,
        raw_target=raw_target,
        until=until,
    )
    errors = _validate_execution_contract(draft)
    contract = dict(draft)
    contract["status"] = "admitted" if not errors else "rejected"
    if errors:
        contract["errors"] = errors
    register_path = workspace_root / EXECUTION_CONTRACT_REGISTER_PATH
    context_path = workspace_root / EXECUTION_CONTRACT_CONTEXT_PATH
    previous_contract = _load_existing_contract(register_path)
    if (
        isinstance(previous_contract, dict)
        and str(previous_contract.get("contract_kind") or "") == EXECUTION_CONTRACT_KIND
        and str(previous_contract.get("status") or "") == "admitted"
        and str(previous_contract.get("contract_id") or "")
        and str(previous_contract.get("contract_id") or "") != str(contract["contract_id"])
    ):
        superseded = dict(previous_contract)
        superseded["status"] = "superseded"
        superseded["superseded_by_contract_id"] = str(contract["contract_id"])
        contract["supersedes_contract_id"] = str(previous_contract["contract_id"])
        publish_runtime_event(
            stream=stream,
            event_type="execution_contract_superseded",
            data={"execution_contract": superseded},
            workflow_version=workflow_version,
            work_key=work_key,
            run_id=run_id,
            aggregate_type="execution_contract",
            aggregate_id=str(previous_contract["contract_id"]),
            correlation_id=str(contract["contract_id"]),
        )
    contract["register_path"] = EXECUTION_CONTRACT_REGISTER_PATH.as_posix()
    contract["context_path"] = EXECUTION_CONTRACT_CONTEXT_PATH.as_posix()
    _write_if_changed(register_path, json.dumps(contract, indent=2, sort_keys=True))
    _write_if_changed(context_path, _render_execution_contract_context(contract))
    publish_runtime_event(
        stream=stream,
        event_type=(
            "execution_contract_admitted"
            if contract["status"] == "admitted"
            else "execution_contract_rejected"
        ),
        data={"execution_contract": dict(contract)},
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
        aggregate_type="execution_contract",
        aggregate_id=str(contract["contract_id"]),
    )
    if contract["status"] != "admitted":
        raise ValueError("; ".join(errors))
    return contract


def _module_with_injected_target_job(module: Any, *, target_id: str) -> Any:
    from gtl.module_model import Module
    from gtl.work_model import ContractRef, Job

    if any(
        contract.kind == "graph_function" and contract.target_id == target_id
        for job in module.jobs
        for contract in job.contracts
    ):
        return module
    graph_function = next(
        (candidate for candidate in module.graph_functions if candidate.id == target_id),
        None,
    )
    if graph_function is None:
        raise ValueError(f"cannot inject start target job for unknown graph function id {target_id!r}")
    injected_job = Job(
        name=f"{graph_function.name}_target_job",
        contracts=(ContractRef(kind="graph_function", target_id=graph_function.id),),
        roles=module.roles,
    )
    return Module(
        name=module.name,
        graphs=module.graphs,
        graph_functions=module.graph_functions,
        refinement_boundaries=module.refinement_boundaries,
        candidate_families=module.candidate_families,
        jobs=tuple((*module.jobs, injected_job)),
        roles=module.roles,
        operators=module.operators,
        evaluators=module.evaluators,
        rules=module.rules,
        imports=module.imports,
        metadata=module.metadata,
    )


def _start_target_from_execution_contract(contract: dict[str, Any]) -> Any:
    from genesis.services import StartTarget

    target_truth = contract.get("target_truth")
    if not isinstance(target_truth, dict):
        raise ValueError("execution contract missing target_truth")
    kind = str(target_truth.get("kind") or "")
    if kind == "next":
        return StartTarget.next()
    if kind == "graph_function":
        return StartTarget.graph_function(
            handle=str(target_truth.get("handle") or ""),
            target_id=str(target_truth.get("target_id") or ""),
            graph_function_name=str(target_truth.get("graph_function_name") or ""),
        )
    if kind == "asset":
        return StartTarget.asset(
            handle=str(target_truth.get("handle") or ""),
            target_id=str(target_truth.get("target_id") or ""),
            graph_function_name=str(target_truth.get("graph_function_name") or ""),
            asset_id=str(target_truth.get("asset_id") or ""),
            asset_uri=str(target_truth.get("asset_uri") or ""),
            asset_relative_path=(
                str(target_truth["asset_relative_path"])
                if isinstance(target_truth.get("asset_relative_path"), str)
                else None
            ),
            asset_path_kind=(
                str(target_truth["asset_path_kind"])
                if isinstance(target_truth.get("asset_path_kind"), str)
                else None
            ),
            asset_exists=(
                bool(target_truth["asset_exists"])
                if isinstance(target_truth.get("asset_exists"), bool)
                else None
            ),
            binding_source=str(target_truth.get("binding_source") or ""),
        )
    raise ValueError(f"execution contract target kind {kind!r} is not supported")


def bound_execution_start_from_contract(
    *,
    scope: Any,
    execution_contract: Mapping[str, Any],
) -> BoundExecutionStart:
    from genesis.services import Scope

    contract = dict(execution_contract)
    resolved_target = _start_target_from_execution_contract(contract)
    admitted_route_contract = (
        dict(contract["route_contract"])
        if isinstance(contract.get("route_contract"), dict)
        else None
    )
    runtime_config = dict(scope.runtime_config)
    if resolved_target.kind != "next":
        bound_scope = Scope(
            module=_module_with_injected_target_job(
                scope.module,
                target_id=str(resolved_target.target_id),
            ),
            workspace_root=scope.workspace_root,
            selector=scope.selector,
            diagnostic_edge_override=(
                str(admitted_route_contract["reentry_vector"])
                if isinstance(admitted_route_contract, dict)
                and isinstance(admitted_route_contract.get("reentry_vector"), str)
                and admitted_route_contract.get("reentry_vector")
                else scope.diagnostic_edge_override
            ),
            build=scope.build,
            runtime_identity=scope.runtime_identity,
            worker=None,
            active_workflow_path=scope.active_workflow_path,
            workflow_root=scope.workflow_root,
            work_key=scope.work_key,
            run_id=scope.run_id,
            runtime_config=runtime_config,
        )
    else:
        bound_scope = Scope(
            module=scope.module,
            workspace_root=scope.workspace_root,
            selector=scope.selector,
            diagnostic_edge_override=scope.diagnostic_edge_override,
            build=scope.build,
            runtime_identity=scope.runtime_identity,
            worker=scope.worker,
            active_workflow_path=scope.active_workflow_path,
            workflow_root=scope.workflow_root,
            work_key=scope.work_key,
            run_id=scope.run_id,
            runtime_config=runtime_config,
        )
    return BoundExecutionStart(
        scope=bound_scope,
        target=resolved_target,
        execution_contract=contract,
    )
