// Typed models for the Obsidian SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Active {
  content?: string
  createTargetIfMissing?: boolean
  destination: Record<string, any>
  ifMatch?: string
  operation: string
  rejectIfContentPreexists?: boolean
  scope?: string
  target: any
  targetType: string
  value?: any
  within?: number
}

export interface ActiveLoadMatch {
  content?: string
  createTargetIfMissing?: boolean
  destination?: Record<string, any>
  ifMatch?: string
  operation?: string
  rejectIfContentPreexists?: boolean
  scope?: string
  target?: any
  targetType?: string
  value?: any
  within?: number
}

export interface ActiveCreateData {
  content?: string
  createTargetIfMissing?: boolean
  destination: Record<string, any>
  ifMatch?: string
  operation: string
  rejectIfContentPreexists?: boolean
  scope?: string
  target: any
  targetType: string
  value?: any
  within?: number
}

export interface ActiveUpdateData {
  content?: string
  createTargetIfMissing?: boolean
  destination?: Record<string, any>
  ifMatch?: string
  operation?: string
  rejectIfContentPreexists?: boolean
  scope?: string
  target?: any
  targetType?: string
  value?: any
  within?: number
}

export interface ActiveRemoveMatch {
  permanent?: string
}

export interface Command {
  id?: string
  name?: string
}

export interface CommandListMatch {
  id?: string
  name?: string
}

export interface CommandCreateData {
  id: string
  name?: string
}

export interface Entity1 {
  obsidian?: string
  self?: string
}

export interface Entity1LoadMatch {
  obsidian?: string
  self?: string
}

export interface Mcp {
  id?: string
  jsonrpc: string
  method: string
  params?: Record<string, any>
}

export interface McpLoadMatch {
  id: string
  jsonrpc?: string
  method?: string
  params?: Record<string, any>
}

export interface McpCreateData {
  id?: string
  jsonrpc: string
  method: string
  params?: Record<string, any>
}

export interface Open {
  id?: string
}

export interface OpenCreateData {
  id: string
  new_leaf?: boolean
}

export interface Search {
}

export interface SearchCreateData {

  // Selects a custom action instead of the plain create:
  //   'simple'
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
}

export interface System {
}

export interface SystemLoadMatch {
}

export interface Tag {
  count?: number
  name?: string
}

export interface TagListMatch {
  count?: number
  name?: string
}

export interface Vault {
  content?: string
  createTargetIfMissing?: boolean
  destination: Record<string, any>
  files?: any[]
  id?: string
  ifMatch?: string
  operation: string
  rejectIfContentPreexists?: boolean
  scope?: string
  target: any
  targetType: string
  value?: any
  within?: number
}

export interface VaultLoadMatch {
  id: string
}

export interface VaultListMatch {
  content?: string
  createTargetIfMissing?: boolean
  destination?: Record<string, any>
  files?: any[]
  id?: string
  ifMatch?: string
  operation?: string
  rejectIfContentPreexists?: boolean
  scope?: string
  target?: any
  targetType?: string
  value?: any
  within?: number
}

export interface VaultCreateData {
  id: string
  content?: string
  createTargetIfMissing?: boolean
  destination: Record<string, any>
  files?: any[]
  ifMatch?: string
  operation: string
  rejectIfContentPreexists?: boolean
  scope?: string
  target: any
  targetType: string
  value?: any
  within?: number
}

export interface VaultUpdateData {
  id: string
  content?: string
  createTargetIfMissing?: boolean
  destination?: Record<string, any>
  files?: any[]
  ifMatch?: string
  operation?: string
  rejectIfContentPreexists?: boolean
  scope?: string
  target?: any
  targetType?: string
  value?: any
  within?: number
}

export interface VaultRemoveMatch {
  id: string
  permanent?: string
}

