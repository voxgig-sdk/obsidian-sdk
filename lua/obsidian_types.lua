-- Typed models for the Obsidian SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

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
