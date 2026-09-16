# Typed models for the Obsidian SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class Tag(TypedDict, total=False):
    count: float
    name: str


class TagListMatch(TypedDict, total=False):
    count: float
    name: str


class VaultRequired(TypedDict):
    destination: dict
    operation: str
    target: Any
    targetType: str


class Vault(VaultRequired, total=False):
    content: str
    createTargetIfMissing: bool
    files: list
    id: str
    ifMatch: str
    rejectIfContentPreexists: bool
    scope: str
    value: Any
    within: int


class VaultLoadMatch(TypedDict):
    id: str


class VaultListMatch(TypedDict, total=False):
    content: str
    createTargetIfMissing: bool
    destination: dict
    files: list
    id: str
    ifMatch: str
    operation: str
    rejectIfContentPreexists: bool
    scope: str
    target: Any
    targetType: str
    value: Any
    within: int


class VaultCreateDataRequired(TypedDict):
    id: str
    destination: dict
    operation: str
    target: Any
    targetType: str


class VaultCreateData(VaultCreateDataRequired, total=False):
    content: str
    createTargetIfMissing: bool
    files: list
    ifMatch: str
    rejectIfContentPreexists: bool
    scope: str
    value: Any
    within: int


class VaultUpdateDataRequired(TypedDict):
    id: str


class VaultUpdateData(VaultUpdateDataRequired, total=False):
    content: str
    createTargetIfMissing: bool
    destination: dict
    files: list
    ifMatch: str
    operation: str
    rejectIfContentPreexists: bool
    scope: str
    target: Any
    targetType: str
    value: Any
    within: int


class VaultRemoveMatchRequired(TypedDict):
    id: str


class VaultRemoveMatch(VaultRemoveMatchRequired, total=False):
    permanent: str
