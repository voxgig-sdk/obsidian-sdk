// Typed models for the Obsidian SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

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

