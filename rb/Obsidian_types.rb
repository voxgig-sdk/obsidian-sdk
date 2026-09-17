# frozen_string_literal: true

# Typed models for the Obsidian SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Active entity data model.
#
# @!attribute [rw] content
#   @return [String, nil]
#
# @!attribute [rw] createTargetIfMissing
#   @return [Boolean, nil]
#
# @!attribute [rw] destination
#   @return [Hash]
#
# @!attribute [rw] ifMatch
#   @return [String, nil]
#
# @!attribute [rw] operation
#   @return [String]
#
# @!attribute [rw] rejectIfContentPreexists
#   @return [Boolean, nil]
#
# @!attribute [rw] scope
#   @return [String, nil]
#
# @!attribute [rw] target
#   @return [Object]
#
# @!attribute [rw] targetType
#   @return [String]
#
# @!attribute [rw] value
#   @return [Object, nil]
#
# @!attribute [rw] within
#   @return [Integer, nil]
Active = Struct.new(
  :content,
  :createTargetIfMissing,
  :destination,
  :ifMatch,
  :operation,
  :rejectIfContentPreexists,
  :scope,
  :target,
  :targetType,
  :value,
  :within,
  keyword_init: true
)

# Request payload for Active#load.
#
# @!attribute [rw] content
#   @return [String, nil]
#
# @!attribute [rw] createTargetIfMissing
#   @return [Boolean, nil]
#
# @!attribute [rw] destination
#   @return [Hash, nil]
#
# @!attribute [rw] ifMatch
#   @return [String, nil]
#
# @!attribute [rw] operation
#   @return [String, nil]
#
# @!attribute [rw] rejectIfContentPreexists
#   @return [Boolean, nil]
#
# @!attribute [rw] scope
#   @return [String, nil]
#
# @!attribute [rw] target
#   @return [Object, nil]
#
# @!attribute [rw] targetType
#   @return [String, nil]
#
# @!attribute [rw] value
#   @return [Object, nil]
#
# @!attribute [rw] within
#   @return [Integer, nil]
ActiveLoadMatch = Struct.new(
  :content,
  :createTargetIfMissing,
  :destination,
  :ifMatch,
  :operation,
  :rejectIfContentPreexists,
  :scope,
  :target,
  :targetType,
  :value,
  :within,
  keyword_init: true
)

# Request payload for Active#create.
#
# @!attribute [rw] content
#   @return [String, nil]
#
# @!attribute [rw] createTargetIfMissing
#   @return [Boolean, nil]
#
# @!attribute [rw] destination
#   @return [Hash]
#
# @!attribute [rw] ifMatch
#   @return [String, nil]
#
# @!attribute [rw] operation
#   @return [String]
#
# @!attribute [rw] rejectIfContentPreexists
#   @return [Boolean, nil]
#
# @!attribute [rw] scope
#   @return [String, nil]
#
# @!attribute [rw] target
#   @return [Object]
#
# @!attribute [rw] targetType
#   @return [String]
#
# @!attribute [rw] value
#   @return [Object, nil]
#
# @!attribute [rw] within
#   @return [Integer, nil]
ActiveCreateData = Struct.new(
  :content,
  :createTargetIfMissing,
  :destination,
  :ifMatch,
  :operation,
  :rejectIfContentPreexists,
  :scope,
  :target,
  :targetType,
  :value,
  :within,
  keyword_init: true
)

# Request payload for Active#update.
#
# @!attribute [rw] content
#   @return [String, nil]
#
# @!attribute [rw] createTargetIfMissing
#   @return [Boolean, nil]
#
# @!attribute [rw] destination
#   @return [Hash, nil]
#
# @!attribute [rw] ifMatch
#   @return [String, nil]
#
# @!attribute [rw] operation
#   @return [String, nil]
#
# @!attribute [rw] rejectIfContentPreexists
#   @return [Boolean, nil]
#
# @!attribute [rw] scope
#   @return [String, nil]
#
# @!attribute [rw] target
#   @return [Object, nil]
#
# @!attribute [rw] targetType
#   @return [String, nil]
#
# @!attribute [rw] value
#   @return [Object, nil]
#
# @!attribute [rw] within
#   @return [Integer, nil]
ActiveUpdateData = Struct.new(
  :content,
  :createTargetIfMissing,
  :destination,
  :ifMatch,
  :operation,
  :rejectIfContentPreexists,
  :scope,
  :target,
  :targetType,
  :value,
  :within,
  keyword_init: true
)

# Request payload for Active#remove.
#
# @!attribute [rw] permanent
#   @return [String, nil]
ActiveRemoveMatch = Struct.new(
  :permanent,
  keyword_init: true
)

# Command entity data model.
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
Command = Struct.new(
  :id,
  :name,
  keyword_init: true
)

# Request payload for Command#list.
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
CommandListMatch = Struct.new(
  :id,
  :name,
  keyword_init: true
)

# Request payload for Command#create.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] name
#   @return [String, nil]
CommandCreateData = Struct.new(
  :id,
  :name,
  keyword_init: true
)

# Entity1 entity data model.
#
# @!attribute [rw] obsidian
#   @return [String, nil]
#
# @!attribute [rw] self
#   @return [String, nil]
Entity1 = Struct.new(
  :obsidian,
  :self,
  keyword_init: true
)

# Request payload for Entity1#load.
#
# @!attribute [rw] obsidian
#   @return [String, nil]
#
# @!attribute [rw] self
#   @return [String, nil]
Entity1LoadMatch = Struct.new(
  :obsidian,
  :self,
  keyword_init: true
)

# Mcp entity data model.
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] jsonrpc
#   @return [String]
#
# @!attribute [rw] method
#   @return [String]
#
# @!attribute [rw] params
#   @return [Hash, nil]
Mcp = Struct.new(
  :id,
  :jsonrpc,
  :method,
  :params,
  keyword_init: true
)

# Request payload for Mcp#load.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] jsonrpc
#   @return [String, nil]
#
# @!attribute [rw] method
#   @return [String, nil]
#
# @!attribute [rw] params
#   @return [Hash, nil]
McpLoadMatch = Struct.new(
  :id,
  :jsonrpc,
  :method,
  :params,
  keyword_init: true
)

# Request payload for Mcp#create.
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] jsonrpc
#   @return [String]
#
# @!attribute [rw] method
#   @return [String]
#
# @!attribute [rw] params
#   @return [Hash, nil]
McpCreateData = Struct.new(
  :id,
  :jsonrpc,
  :method,
  :params,
  keyword_init: true
)

# Open entity data model.
#
# @!attribute [rw] id
#   @return [String, nil]
Open = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Open#create.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] new_leaf
#   @return [Boolean, nil]
OpenCreateData = Struct.new(
  :id,
  :new_leaf,
  keyword_init: true
)

# Search entity data model.
class Search
end

# Request payload for Search#create.
class SearchCreateData
end

# System entity data model.
class System
end

# Request payload for System#load.
class SystemLoadMatch
end

# Tag entity data model.
#
# @!attribute [rw] count
#   @return [Float, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
Tag = Struct.new(
  :count,
  :name,
  keyword_init: true
)

# Request payload for Tag#list.
#
# @!attribute [rw] count
#   @return [Float, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
TagListMatch = Struct.new(
  :count,
  :name,
  keyword_init: true
)

# Vault entity data model.
#
# @!attribute [rw] content
#   @return [String, nil]
#
# @!attribute [rw] createTargetIfMissing
#   @return [Boolean, nil]
#
# @!attribute [rw] destination
#   @return [Hash]
#
# @!attribute [rw] files
#   @return [Array, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] ifMatch
#   @return [String, nil]
#
# @!attribute [rw] operation
#   @return [String]
#
# @!attribute [rw] rejectIfContentPreexists
#   @return [Boolean, nil]
#
# @!attribute [rw] scope
#   @return [String, nil]
#
# @!attribute [rw] target
#   @return [Object]
#
# @!attribute [rw] targetType
#   @return [String]
#
# @!attribute [rw] value
#   @return [Object, nil]
#
# @!attribute [rw] within
#   @return [Integer, nil]
Vault = Struct.new(
  :content,
  :createTargetIfMissing,
  :destination,
  :files,
  :id,
  :ifMatch,
  :operation,
  :rejectIfContentPreexists,
  :scope,
  :target,
  :targetType,
  :value,
  :within,
  keyword_init: true
)

# Request payload for Vault#load.
#
# @!attribute [rw] id
#   @return [String]
VaultLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Vault#list.
#
# @!attribute [rw] content
#   @return [String, nil]
#
# @!attribute [rw] createTargetIfMissing
#   @return [Boolean, nil]
#
# @!attribute [rw] destination
#   @return [Hash, nil]
#
# @!attribute [rw] files
#   @return [Array, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] ifMatch
#   @return [String, nil]
#
# @!attribute [rw] operation
#   @return [String, nil]
#
# @!attribute [rw] rejectIfContentPreexists
#   @return [Boolean, nil]
#
# @!attribute [rw] scope
#   @return [String, nil]
#
# @!attribute [rw] target
#   @return [Object, nil]
#
# @!attribute [rw] targetType
#   @return [String, nil]
#
# @!attribute [rw] value
#   @return [Object, nil]
#
# @!attribute [rw] within
#   @return [Integer, nil]
VaultListMatch = Struct.new(
  :content,
  :createTargetIfMissing,
  :destination,
  :files,
  :id,
  :ifMatch,
  :operation,
  :rejectIfContentPreexists,
  :scope,
  :target,
  :targetType,
  :value,
  :within,
  keyword_init: true
)

# Request payload for Vault#create.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] content
#   @return [String, nil]
#
# @!attribute [rw] createTargetIfMissing
#   @return [Boolean, nil]
#
# @!attribute [rw] destination
#   @return [Hash]
#
# @!attribute [rw] files
#   @return [Array, nil]
#
# @!attribute [rw] ifMatch
#   @return [String, nil]
#
# @!attribute [rw] operation
#   @return [String]
#
# @!attribute [rw] rejectIfContentPreexists
#   @return [Boolean, nil]
#
# @!attribute [rw] scope
#   @return [String, nil]
#
# @!attribute [rw] target
#   @return [Object]
#
# @!attribute [rw] targetType
#   @return [String]
#
# @!attribute [rw] value
#   @return [Object, nil]
#
# @!attribute [rw] within
#   @return [Integer, nil]
VaultCreateData = Struct.new(
  :id,
  :content,
  :createTargetIfMissing,
  :destination,
  :files,
  :ifMatch,
  :operation,
  :rejectIfContentPreexists,
  :scope,
  :target,
  :targetType,
  :value,
  :within,
  keyword_init: true
)

# Request payload for Vault#update.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] content
#   @return [String, nil]
#
# @!attribute [rw] createTargetIfMissing
#   @return [Boolean, nil]
#
# @!attribute [rw] destination
#   @return [Hash, nil]
#
# @!attribute [rw] files
#   @return [Array, nil]
#
# @!attribute [rw] ifMatch
#   @return [String, nil]
#
# @!attribute [rw] operation
#   @return [String, nil]
#
# @!attribute [rw] rejectIfContentPreexists
#   @return [Boolean, nil]
#
# @!attribute [rw] scope
#   @return [String, nil]
#
# @!attribute [rw] target
#   @return [Object, nil]
#
# @!attribute [rw] targetType
#   @return [String, nil]
#
# @!attribute [rw] value
#   @return [Object, nil]
#
# @!attribute [rw] within
#   @return [Integer, nil]
VaultUpdateData = Struct.new(
  :id,
  :content,
  :createTargetIfMissing,
  :destination,
  :files,
  :ifMatch,
  :operation,
  :rejectIfContentPreexists,
  :scope,
  :target,
  :targetType,
  :value,
  :within,
  keyword_init: true
)

# Request payload for Vault#remove.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] permanent
#   @return [String, nil]
VaultRemoveMatch = Struct.new(
  :id,
  :permanent,
  keyword_init: true
)

