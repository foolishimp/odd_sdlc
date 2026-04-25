"""Shared admission helpers for residual public-start subordinate payloads."""
from __future__ import annotations

from collections.abc import Mapping, Sequence

from genesis.fulfillment_ledger import coerce_published_fulfillment_ledger_ref
from genesis.policy import admit_resolved_policy

from .public_start_contract import (
    EvidenceItemPayload,
    FulfillmentAssessmentPayload,
    FulfillmentStatus,
    GenesisPolicyConcernPayload,
    PromptCompactionPayload,
    PromptCompactionSizeUnit,
    PublishedFulfillmentLedgerRefPayload,
    ResolvedPolicyPayload,
)

def _string(value: object, *, field: str) -> str:
    if isinstance(value, str) and value:
        return value
    raise ValueError(f"{field} must be a non-empty string")


def _string_sequence(value: object, *, field: str) -> list[str]:
    if not isinstance(value, Sequence) or isinstance(value, (str, bytes, bytearray)):
        raise ValueError(f"{field} must be a sequence[str]")
    normalized: list[str] = []
    for item in value:
        if not isinstance(item, str):
            raise ValueError(f"{field} must be a sequence[str]")
        normalized.append(item)
    return normalized


def _non_negative_int(value: object, *, field: str) -> int:
    if isinstance(value, int) and not isinstance(value, bool) and value >= 0:
        return value
    raise ValueError(f"{field} must be a non-negative integer")


def _prompt_compaction_size_unit(value: object, *, field: str) -> PromptCompactionSizeUnit:
    if value == "chars":
        return "chars"
    if value == "items":
        return "items"
    if value == "bindings":
        return "bindings"
    raise ValueError(f"{field} has invalid value")


def _fulfillment_status(value: object, *, field: str) -> FulfillmentStatus:
    if value == "fulfilled":
        return "fulfilled"
    if value == "partial":
        return "partial"
    if value == "blocked":
        return "blocked"
    if value == "unfulfilled":
        return "unfulfilled"
    raise ValueError(f"{field} is invalid")


def _policy_concern(value: object, *, field: str) -> GenesisPolicyConcernPayload:
    if not isinstance(value, Mapping):
        raise ValueError(f"{field} must be an object")
    ref = _string(value.get("ref"), field=f"{field}.ref")
    config_value = value.get("config")
    if not isinstance(config_value, Mapping):
        raise ValueError(f"{field}.config must be an object")
    return {
        "ref": ref,
        "config": {str(key): item for key, item in config_value.items()},
    }


def admit_evidence_items(value: object) -> list[EvidenceItemPayload]:
    if not isinstance(value, list):
        raise ValueError("evidence must be a list")
    projected: list[EvidenceItemPayload] = []
    for index, item in enumerate(value):
        if not isinstance(item, Mapping):
            raise ValueError(f"evidence[{index}] must be an object")
        projected_item: EvidenceItemPayload = {
            "evidence_role": _string(item.get("evidence_role"), field=f"evidence[{index}].evidence_role")
        }
        binding = item.get("binding")
        if isinstance(binding, str) and binding:
            projected_item["binding"] = binding
        detail = item.get("detail")
        if isinstance(detail, str) and detail:
            projected_item["detail"] = detail
        excerpt = item.get("excerpt")
        if isinstance(excerpt, str) and excerpt:
            projected_item["excerpt"] = excerpt
        name = item.get("name")
        if isinstance(name, str) and name:
            projected_item["name"] = name
        projected.append(projected_item)
    return projected


def admit_resolved_policy_payload(value: object) -> ResolvedPolicyPayload:
    admitted = admit_resolved_policy(value)
    payload = admitted.to_dict()
    sources_value = payload.get("sources")
    if not isinstance(sources_value, Mapping):
        raise ValueError("resolved_policy.sources must be an object")
    projected: ResolvedPolicyPayload = {
        "resolved_policy_bundle_ref": _string(
            payload.get("resolved_policy_bundle_ref"),
            field="resolved_policy.resolved_policy_bundle_ref",
        ),
        "bundle_refs": _string_sequence(payload.get("bundle_refs"), field="resolved_policy.bundle_refs"),
        "sources": {
            str(key): _string(item, field=f"resolved_policy.sources.{key}")
            for key, item in sources_value.items()
        },
        "dispatch": _policy_concern(payload.get("dispatch"), field="resolved_policy.dispatch"),
        "evaluation": _policy_concern(payload.get("evaluation"), field="resolved_policy.evaluation"),
        "escalation": _policy_concern(payload.get("escalation"), field="resolved_policy.escalation"),
        "proof": _policy_concern(payload.get("proof"), field="resolved_policy.proof"),
        "closure": _policy_concern(payload.get("closure"), field="resolved_policy.closure"),
    }
    return projected


def admit_prompt_compactions(value: object) -> list[PromptCompactionPayload]:
    if not isinstance(value, list):
        raise ValueError("prompt_compactions must be a list")
    projected: list[PromptCompactionPayload] = []
    for index, item in enumerate(value):
        if not isinstance(item, Mapping):
            raise ValueError(f"prompt_compactions[{index}] must be an object")
        projected.append(
            {
                "surface": _string(item.get("surface"), field=f"prompt_compactions[{index}].surface"),
                "reason": _string(item.get("reason"), field=f"prompt_compactions[{index}].reason"),
                "size_unit": _prompt_compaction_size_unit(
                    item.get("size_unit"),
                    field=f"prompt_compactions[{index}].size_unit",
                ),
                "original_size": _non_negative_int(
                    item.get("original_size"),
                    field=f"prompt_compactions[{index}].original_size",
                ),
                "emitted_size": _non_negative_int(
                    item.get("emitted_size"),
                    field=f"prompt_compactions[{index}].emitted_size",
                ),
                "budget_size": _non_negative_int(
                    item.get("budget_size"),
                    field=f"prompt_compactions[{index}].budget_size",
                ),
                "inspection_ref": _string(
                    item.get("inspection_ref"),
                    field=f"prompt_compactions[{index}].inspection_ref",
                ),
            }
        )
    return projected


def admit_published_fulfillment_ledger_ref(
    value: object,
) -> PublishedFulfillmentLedgerRefPayload:
    normalized = coerce_published_fulfillment_ledger_ref(value)
    return {
        "kind": normalized["kind"],
        "resolver": normalized["resolver"],
        "manifest_id": normalized["manifest_id"],
    }


def admit_fulfillment_assessments(value: object) -> list[FulfillmentAssessmentPayload]:
    if not isinstance(value, list) or not value:
        raise ValueError("fulfillment_assessments must be a non-empty list")
    projected: list[FulfillmentAssessmentPayload] = []
    seen_ids: set[str] = set()
    for index, item in enumerate(value):
        if not isinstance(item, Mapping):
            raise ValueError(f"fulfillment_assessments[{index}] must be an object")
        obligation_id = _string(item.get("id"), field=f"fulfillment_assessments[{index}].id")
        evaluator_value = item.get("evaluator")
        evaluator = (
            evaluator_value
            if isinstance(evaluator_value, str) and evaluator_value
            else obligation_id
        )
        detail = item.get("fulfillment_detail", "")
        if detail is None:
            detail = ""
        if not isinstance(detail, str):
            raise ValueError(f"fulfillment_assessments[{index}].fulfillment_detail must be a string")
        if obligation_id in seen_ids:
            raise ValueError(f"duplicate fulfillment assessment id: {obligation_id}")
        seen_ids.add(obligation_id)
        projected.append(
            {
                "id": obligation_id,
                "evaluator": evaluator,
                "fulfillment_status": _fulfillment_status(
                    item.get("fulfillment_status"),
                    field=f"fulfillment_assessments[{index}].fulfillment_status",
                ),
                "fulfillment_detail": detail,
                "blocking_reasons": _string_sequence(
                    item.get("blocking_reasons", []),
                    field=f"fulfillment_assessments[{index}].blocking_reasons",
                ),
                "evidence_refs": _string_sequence(
                    item.get("evidence_refs", []),
                    field=f"fulfillment_assessments[{index}].evidence_refs",
                ),
            }
        )
    return projected
