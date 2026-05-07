// Implements: B-086

import {
  parseEnumValue,
  parseNonEmptyString
} from "./validation.js";

export type SdlcFdFieldClass =
  | "exact_protocol"
  | "exact_contract"
  | "alias_admissible"
  | "fp_escalation"
  | "reject";

export function admitExactProtocolString(input: {
  readonly value: unknown;
  readonly label: string;
  readonly expected: string;
}): string {
  const value = parseNonEmptyString(input.value, input.label);
  if (value !== input.expected) {
    throw new TypeError(`${input.label}: unexpected protocol value`);
  }
  return value;
}

export function admitExactProtocolVersion(input: {
  readonly value: unknown;
  readonly label: string;
  readonly expected: string;
}): string {
  const value = parseNonEmptyString(input.value, input.label);
  if (value !== input.expected) {
    throw new TypeError(`${input.label}: unsupported version`);
  }
  return value;
}

export function admitExactContractEnum<T extends string>(
  input: {
    readonly value: unknown;
    readonly label: string;
    readonly values: readonly T[];
  }
): T {
  return parseEnumValue(input.value, input.label, input.values);
}

export function admitDeclaredAlias<T extends string>(input: {
  readonly value: unknown;
  readonly label: string;
  readonly values: readonly T[];
  readonly aliases?: Readonly<Record<string, T>>;
}): T {
  const value = parseNonEmptyString(input.value, input.label);
  const alias = input.aliases?.[value];
  if (alias !== undefined) {
    return parseEnumValue(alias, `${input.label}.alias`, input.values);
  }
  return parseEnumValue(value, input.label, input.values);
}
