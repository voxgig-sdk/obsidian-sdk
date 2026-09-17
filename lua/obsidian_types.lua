-- Typed models for the Obsidian SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Active
---@field content? string
---@field createTargetIfMissing? boolean
---@field destination table
---@field ifMatch? string
---@field operation string
---@field rejectIfContentPreexists? boolean
---@field scope? string
---@field target any
---@field targetType string
---@field value? any
---@field within? number

---@class ActiveLoadMatch
---@field content? string
---@field createTargetIfMissing? boolean
---@field destination? table
---@field ifMatch? string
---@field operation? string
---@field rejectIfContentPreexists? boolean
---@field scope? string
---@field target? any
---@field targetType? string
---@field value? any
---@field within? number

---@class ActiveCreateData
---@field content? string
---@field createTargetIfMissing? boolean
---@field destination table
---@field ifMatch? string
---@field operation string
---@field rejectIfContentPreexists? boolean
---@field scope? string
---@field target any
---@field targetType string
---@field value? any
---@field within? number

---@class ActiveUpdateData
---@field content? string
---@field createTargetIfMissing? boolean
---@field destination? table
---@field ifMatch? string
---@field operation? string
---@field rejectIfContentPreexists? boolean
---@field scope? string
---@field target? any
---@field targetType? string
---@field value? any
---@field within? number

---@class ActiveRemoveMatch
---@field permanent? string

---@class Command
---@field id? string
---@field name? string

---@class CommandListMatch
---@field id? string
---@field name? string

---@class CommandCreateData
---@field id string
---@field name? string

---@class Entity1
---@field obsidian? string
---@field self? string

---@class Entity1LoadMatch
---@field obsidian? string
---@field self? string

---@class Mcp
---@field id? string
---@field jsonrpc string
---@field method string
---@field params? table

---@class McpLoadMatch
---@field id string
---@field jsonrpc? string
---@field method? string
---@field params? table

---@class McpCreateData
---@field id? string
---@field jsonrpc string
---@field method string
---@field params? table

---@class Open
---@field id? string

---@class OpenCreateData
---@field id string
---@field new_leaf? boolean

---@class Search

---@class SearchCreateData

---@class System

---@class SystemLoadMatch

---@class Tag
---@field count? number
---@field name? string

---@class TagListMatch
---@field count? number
---@field name? string

---@class Vault
---@field content? string
---@field createTargetIfMissing? boolean
---@field destination table
---@field files? table
---@field id? string
---@field ifMatch? string
---@field operation string
---@field rejectIfContentPreexists? boolean
---@field scope? string
---@field target any
---@field targetType string
---@field value? any
---@field within? number

---@class VaultLoadMatch
---@field id string

---@class VaultListMatch
---@field content? string
---@field createTargetIfMissing? boolean
---@field destination? table
---@field files? table
---@field id? string
---@field ifMatch? string
---@field operation? string
---@field rejectIfContentPreexists? boolean
---@field scope? string
---@field target? any
---@field targetType? string
---@field value? any
---@field within? number

---@class VaultCreateData
---@field id string
---@field content? string
---@field createTargetIfMissing? boolean
---@field destination table
---@field files? table
---@field ifMatch? string
---@field operation string
---@field rejectIfContentPreexists? boolean
---@field scope? string
---@field target any
---@field targetType string
---@field value? any
---@field within? number

---@class VaultUpdateData
---@field id string
---@field content? string
---@field createTargetIfMissing? boolean
---@field destination? table
---@field files? table
---@field ifMatch? string
---@field operation? string
---@field rejectIfContentPreexists? boolean
---@field scope? string
---@field target? any
---@field targetType? string
---@field value? any
---@field within? number

---@class VaultRemoveMatch
---@field id string
---@field permanent? string

local M = {}

return M
