// Typed models for the Obsidian SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import (
	"encoding/json"

	"github.com/voxgig-sdk/obsidian-sdk/go/core"
)

// Active is the typed data model for the active entity.
type Active struct {
	Content *string `json:"content,omitempty"`
	CreateTargetIfMissing *bool `json:"createTargetIfMissing,omitempty"`
	Destination map[string]any `json:"destination"`
	IfMatch *string `json:"ifMatch,omitempty"`
	Operation string `json:"operation"`
	RejectIfContentPreexists *bool `json:"rejectIfContentPreexists,omitempty"`
	Scope *string `json:"scope,omitempty"`
	Target any `json:"target"`
	TargetType string `json:"targetType"`
	Value *any `json:"value,omitempty"`
	Within *int `json:"within,omitempty"`
}

// ActiveLoadMatch is the typed request payload for Active.LoadTyped.
type ActiveLoadMatch struct {
	Content *string `json:"content,omitempty"`
	CreateTargetIfMissing *bool `json:"createTargetIfMissing,omitempty"`
	Destination *map[string]any `json:"destination,omitempty"`
	IfMatch *string `json:"ifMatch,omitempty"`
	Operation *string `json:"operation,omitempty"`
	RejectIfContentPreexists *bool `json:"rejectIfContentPreexists,omitempty"`
	Scope *string `json:"scope,omitempty"`
	Target *any `json:"target,omitempty"`
	TargetType *string `json:"targetType,omitempty"`
	Value *any `json:"value,omitempty"`
	Within *int `json:"within,omitempty"`
}

// ActiveCreateData is the typed request payload for Active.CreateTyped.
type ActiveCreateData struct {
	Content *string `json:"content,omitempty"`
	CreateTargetIfMissing *bool `json:"createTargetIfMissing,omitempty"`
	Destination map[string]any `json:"destination"`
	IfMatch *string `json:"ifMatch,omitempty"`
	Operation string `json:"operation"`
	RejectIfContentPreexists *bool `json:"rejectIfContentPreexists,omitempty"`
	Scope *string `json:"scope,omitempty"`
	Target any `json:"target"`
	TargetType string `json:"targetType"`
	Value *any `json:"value,omitempty"`
	Within *int `json:"within,omitempty"`
}

// ActiveUpdateData is the typed request payload for Active.UpdateTyped.
type ActiveUpdateData struct {
	Content *string `json:"content,omitempty"`
	CreateTargetIfMissing *bool `json:"createTargetIfMissing,omitempty"`
	Destination *map[string]any `json:"destination,omitempty"`
	IfMatch *string `json:"ifMatch,omitempty"`
	Operation *string `json:"operation,omitempty"`
	RejectIfContentPreexists *bool `json:"rejectIfContentPreexists,omitempty"`
	Scope *string `json:"scope,omitempty"`
	Target *any `json:"target,omitempty"`
	TargetType *string `json:"targetType,omitempty"`
	Value *any `json:"value,omitempty"`
	Within *int `json:"within,omitempty"`
}

// ActiveRemoveMatch is the typed request payload for Active.RemoveTyped.
type ActiveRemoveMatch struct {
	Permanent *string `json:"permanent,omitempty"`
}

// Command is the typed data model for the command entity.
type Command struct {
	Id *string `json:"id,omitempty"`
	Name *string `json:"name,omitempty"`
}

// CommandListMatch is the typed request payload for Command.ListTyped.
type CommandListMatch struct {
	Id *string `json:"id,omitempty"`
	Name *string `json:"name,omitempty"`
}

// CommandCreateData is the typed request payload for Command.CreateTyped.
type CommandCreateData struct {
	Id string `json:"id"`
	Name *string `json:"name,omitempty"`
}

// Entity1 is the typed data model for the entity1 entity.
type Entity1 struct {
	Obsidian *string `json:"obsidian,omitempty"`
	Self *string `json:"self,omitempty"`
}

// Entity1LoadMatch is the typed request payload for Entity1.LoadTyped.
type Entity1LoadMatch struct {
	Obsidian *string `json:"obsidian,omitempty"`
	Self *string `json:"self,omitempty"`
}

// Mcp is the typed data model for the mcp entity.
type Mcp struct {
	Id *string `json:"id,omitempty"`
	Jsonrpc string `json:"jsonrpc"`
	Method string `json:"method"`
	Params *map[string]any `json:"params,omitempty"`
}

// McpLoadMatch is the typed request payload for Mcp.LoadTyped.
type McpLoadMatch struct {
	Id string `json:"id"`
	Jsonrpc *string `json:"jsonrpc,omitempty"`
	Method *string `json:"method,omitempty"`
	Params *map[string]any `json:"params,omitempty"`
}

// McpCreateData is the typed request payload for Mcp.CreateTyped.
type McpCreateData struct {
	Id *string `json:"id,omitempty"`
	Jsonrpc string `json:"jsonrpc"`
	Method string `json:"method"`
	Params *map[string]any `json:"params,omitempty"`
}

// Open is the typed data model for the open entity.
type Open struct {
	Id *string `json:"id,omitempty"`
}

// OpenCreateData is the typed request payload for Open.CreateTyped.
type OpenCreateData struct {
	Id string `json:"id"`
	NewLeaf *bool `json:"new_leaf,omitempty"`
}

// Search is the typed data model for the search entity.
type Search struct {
}

// SearchCreateData is the typed request payload for Search.CreateTyped.
type SearchCreateData struct {
}

// System is the typed data model for the system entity.
type System struct {
}

// SystemLoadMatch is the typed request payload for System.LoadTyped.
type SystemLoadMatch struct {
}

// Tag is the typed data model for the tag entity.
type Tag struct {
	Count *float64 `json:"count,omitempty"`
	Name *string `json:"name,omitempty"`
}

// TagListMatch is the typed request payload for Tag.ListTyped.
type TagListMatch struct {
	Count *float64 `json:"count,omitempty"`
	Name *string `json:"name,omitempty"`
}

// Vault is the typed data model for the vault entity.
type Vault struct {
	Content *string `json:"content,omitempty"`
	CreateTargetIfMissing *bool `json:"createTargetIfMissing,omitempty"`
	Destination map[string]any `json:"destination"`
	Files *[]any `json:"files,omitempty"`
	Id *string `json:"id,omitempty"`
	IfMatch *string `json:"ifMatch,omitempty"`
	Operation string `json:"operation"`
	RejectIfContentPreexists *bool `json:"rejectIfContentPreexists,omitempty"`
	Scope *string `json:"scope,omitempty"`
	Target any `json:"target"`
	TargetType string `json:"targetType"`
	Value *any `json:"value,omitempty"`
	Within *int `json:"within,omitempty"`
}

// VaultLoadMatch is the typed request payload for Vault.LoadTyped.
type VaultLoadMatch struct {
	Id string `json:"id"`
}

// VaultListMatch is the typed request payload for Vault.ListTyped.
type VaultListMatch struct {
	Content *string `json:"content,omitempty"`
	CreateTargetIfMissing *bool `json:"createTargetIfMissing,omitempty"`
	Destination *map[string]any `json:"destination,omitempty"`
	Files *[]any `json:"files,omitempty"`
	Id *string `json:"id,omitempty"`
	IfMatch *string `json:"ifMatch,omitempty"`
	Operation *string `json:"operation,omitempty"`
	RejectIfContentPreexists *bool `json:"rejectIfContentPreexists,omitempty"`
	Scope *string `json:"scope,omitempty"`
	Target *any `json:"target,omitempty"`
	TargetType *string `json:"targetType,omitempty"`
	Value *any `json:"value,omitempty"`
	Within *int `json:"within,omitempty"`
}

// VaultCreateData is the typed request payload for Vault.CreateTyped.
type VaultCreateData struct {
	Id string `json:"id"`
	Content *string `json:"content,omitempty"`
	CreateTargetIfMissing *bool `json:"createTargetIfMissing,omitempty"`
	Destination map[string]any `json:"destination"`
	Files *[]any `json:"files,omitempty"`
	IfMatch *string `json:"ifMatch,omitempty"`
	Operation string `json:"operation"`
	RejectIfContentPreexists *bool `json:"rejectIfContentPreexists,omitempty"`
	Scope *string `json:"scope,omitempty"`
	Target any `json:"target"`
	TargetType string `json:"targetType"`
	Value *any `json:"value,omitempty"`
	Within *int `json:"within,omitempty"`
}

// VaultUpdateData is the typed request payload for Vault.UpdateTyped.
type VaultUpdateData struct {
	Id string `json:"id"`
	Content *string `json:"content,omitempty"`
	CreateTargetIfMissing *bool `json:"createTargetIfMissing,omitempty"`
	Destination *map[string]any `json:"destination,omitempty"`
	Files *[]any `json:"files,omitempty"`
	IfMatch *string `json:"ifMatch,omitempty"`
	Operation *string `json:"operation,omitempty"`
	RejectIfContentPreexists *bool `json:"rejectIfContentPreexists,omitempty"`
	Scope *string `json:"scope,omitempty"`
	Target *any `json:"target,omitempty"`
	TargetType *string `json:"targetType,omitempty"`
	Value *any `json:"value,omitempty"`
	Within *int `json:"within,omitempty"`
}

// VaultRemoveMatch is the typed request payload for Vault.RemoveTyped.
type VaultRemoveMatch struct {
	Id string `json:"id"`
	Permanent *string `json:"permanent,omitempty"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// entityData unwraps an entity to its data map.
//
// Operations resolve to the ENTITY, not the raw data (see AGENTS.md), and an
// entity's fields are UNEXPORTED — marshalling one directly yields `{}`, so
// every typed accessor would silently hand back a zero-valued struct. The
// typed boundary therefore takes the data hop first.
func entityData(v any) any {
	if ent, ok := v.(core.Entity); ok {
		return ent.Data()
	}
	return v
}

// typedFrom decodes a runtime value (an entity, or the map[string]any the op
// pipeline produced) into a typed model T via a JSON round-trip. On any error
// it returns the zero value of T; the op's own (value, error) tuple carries
// the real error.
func typedFrom[T any](v any) T {
	var out T
	v = entityData(v)
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value into a typed slice []T via a
// JSON round-trip, for list ops. `list` resolves to a slice of ENTITY
// instances, so each element takes the data hop.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	if list, ok := v.([]any); ok {
		unwrapped := make([]any, 0, len(list))
		for _, item := range list {
			unwrapped = append(unwrapped, entityData(item))
		}
		v = unwrapped
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
