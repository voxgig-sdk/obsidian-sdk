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


class ActiveRequired(TypedDict):
    destination: dict
    operation: str
    target: Any
    targetType: str


class Active(ActiveRequired, total=False):
    content: str
    createTargetIfMissing: bool
    ifMatch: str
    rejectIfContentPreexists: bool
    scope: str
    value: Any
    within: int


class ActiveLoadMatch(TypedDict, total=False):
    content: str
    createTargetIfMissing: bool
    destination: dict
    ifMatch: str
    operation: str
    rejectIfContentPreexists: bool
    scope: str
    target: Any
    targetType: str
    value: Any
    within: int


class ActiveCreateDataRequired(TypedDict):
    destination: dict
    operation: str
    target: Any
    targetType: str


class ActiveCreateData(ActiveCreateDataRequired, total=False):
    content: str
    createTargetIfMissing: bool
    ifMatch: str
    rejectIfContentPreexists: bool
    scope: str
    value: Any
    within: int


class ActiveUpdateData(TypedDict, total=False):
    content: str
    createTargetIfMissing: bool
    destination: dict
    ifMatch: str
    operation: str
    rejectIfContentPreexists: bool
    scope: str
    target: Any
    targetType: str
    value: Any
    within: int


class ActiveRemoveMatch(TypedDict, total=False):
    permanent: str


class Command(TypedDict, total=False):
    id: str
    name: str


class CommandListMatch(TypedDict, total=False):
    id: str
    name: str


class CommandCreateDataRequired(TypedDict):
    id: str


class CommandCreateData(CommandCreateDataRequired, total=False):
    name: str


class Entity1(TypedDict, total=False):
    obsidian: str
    self: str


class Entity1LoadMatch(TypedDict, total=False):
    obsidian: str
    self: str


class McpRequired(TypedDict):
    jsonrpc: str
    method: str


class Mcp(McpRequired, total=False):
    id: str
    params: dict


class McpLoadMatchRequired(TypedDict):
    id: str


class McpLoadMatch(McpLoadMatchRequired, total=False):
    jsonrpc: str
    method: str
    params: dict


class McpCreateDataRequired(TypedDict):
    jsonrpc: str
    method: str


class McpCreateData(McpCreateDataRequired, total=False):
    id: str
    params: dict


class Open(TypedDict, total=False):
    id: str


class OpenCreateDataRequired(TypedDict):
    id: str


class OpenCreateData(OpenCreateDataRequired, total=False):
    new_leaf: bool


class Search(TypedDict):
    pass


class SearchCreateData(TypedDict):
    pass


class System(TypedDict):
    pass


class SystemLoadMatch(TypedDict):
    pass


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
