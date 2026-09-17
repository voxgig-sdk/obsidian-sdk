// Typed models for the Obsidian SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types are mapped
// from the canonical type sentinels. Do not edit by hand.
//
// These are DOCUMENTARY: the SDK runtime is dynamic (ops take/return
// `voxgig_value*`), so nothing consumes these structs yet — they mirror the
// entity/op shapes for reference and IDE support. This header is standalone
// and is not #included by any generated .c.

#ifndef OBSIDIAN_ENTITY_TYPES_H
#define OBSIDIAN_ENTITY_TYPES_H

#include "sdk.h"

// Active is the typed data model for the active entity.
typedef struct {
  char*content;  // optional
  bool createtargetifmissing;  // optional
  voxgig_value*destination;
  char*ifmatch;  // optional
  char*operation;
  bool rejectifcontentpreexists;  // optional
  char*scope;  // optional
  voxgig_value*target;
  char*targettype;
  voxgig_value*value;  // optional
  int64_t within;  // optional
} Active;

// ActiveLoadMatch is the typed request payload for Active.load.
typedef struct {
  char*content;  // optional
  bool createtargetifmissing;  // optional
  voxgig_value*destination;  // optional
  char*ifmatch;  // optional
  char*operation;  // optional
  bool rejectifcontentpreexists;  // optional
  char*scope;  // optional
  voxgig_value*target;  // optional
  char*targettype;  // optional
  voxgig_value*value;  // optional
  int64_t within;  // optional
} ActiveLoadMatch;

// ActiveCreateData is the typed request payload for Active.create.
typedef struct {
  char*content;  // optional
  bool createtargetifmissing;  // optional
  voxgig_value*destination;
  char*ifmatch;  // optional
  char*operation;
  bool rejectifcontentpreexists;  // optional
  char*scope;  // optional
  voxgig_value*target;
  char*targettype;
  voxgig_value*value;  // optional
  int64_t within;  // optional
} ActiveCreateData;

// ActiveUpdateData is the typed request payload for Active.update.
typedef struct {
  char*content;  // optional
  bool createtargetifmissing;  // optional
  voxgig_value*destination;  // optional
  char*ifmatch;  // optional
  char*operation;  // optional
  bool rejectifcontentpreexists;  // optional
  char*scope;  // optional
  voxgig_value*target;  // optional
  char*targettype;  // optional
  voxgig_value*value;  // optional
  int64_t within;  // optional
} ActiveUpdateData;

// ActiveRemoveMatch is the typed request payload for Active.remove.
typedef struct {
  char*permanent;  // optional
} ActiveRemoveMatch;

// Command is the typed data model for the command entity.
typedef struct {
  char*id;  // optional
  char*name;  // optional
} Command;

// CommandListMatch is the typed request payload for Command.list.
typedef struct {
  char*id;  // optional
  char*name;  // optional
} CommandListMatch;

// CommandCreateData is the typed request payload for Command.create.
typedef struct {
  char*id;
  char*name;  // optional
} CommandCreateData;

// Entity1 is the typed data model for the entity1 entity.
typedef struct {
  char*obsidian;  // optional
  char*self;  // optional
} Entity1;

// Entity1LoadMatch is the typed request payload for Entity1.load.
typedef struct {
  char*obsidian;  // optional
  char*self;  // optional
} Entity1LoadMatch;

// Mcp is the typed data model for the mcp entity.
typedef struct {
  char*id;  // optional
  char*jsonrpc;
  char*method;
  voxgig_value*params;  // optional
} Mcp;

// McpLoadMatch is the typed request payload for Mcp.load.
typedef struct {
  char*id;
  char*jsonrpc;  // optional
  char*method;  // optional
  voxgig_value*params;  // optional
} McpLoadMatch;

// McpCreateData is the typed request payload for Mcp.create.
typedef struct {
  char*id;  // optional
  char*jsonrpc;
  char*method;
  voxgig_value*params;  // optional
} McpCreateData;

// Open is the typed data model for the open entity.
typedef struct {
  char*id;  // optional
} Open;

// OpenCreateData is the typed request payload for Open.create.
typedef struct {
  char*id;
  bool new_leaf;  // optional
} OpenCreateData;

// Search is the typed data model for the search entity.
typedef struct {
  char _unused;  // placeholder: no modelled members
} Search;

// SearchCreateData is the typed request payload for Search.create.
typedef struct {
  char _unused;  // placeholder: no modelled members
} SearchCreateData;

// System is the typed data model for the system entity.
typedef struct {
  char _unused;  // placeholder: no modelled members
} System;

// SystemLoadMatch is the typed request payload for System.load.
typedef struct {
  char _unused;  // placeholder: no modelled members
} SystemLoadMatch;

// Tag is the typed data model for the tag entity.
typedef struct {
  double count;  // optional
  char*name;  // optional
} Tag;

// TagListMatch is the typed request payload for Tag.list.
typedef struct {
  double count;  // optional
  char*name;  // optional
} TagListMatch;

// Vault is the typed data model for the vault entity.
typedef struct {
  char*content;  // optional
  bool createtargetifmissing;  // optional
  voxgig_value*destination;
  voxgig_value*files;  // optional
  char*id;  // optional
  char*ifmatch;  // optional
  char*operation;
  bool rejectifcontentpreexists;  // optional
  char*scope;  // optional
  voxgig_value*target;
  char*targettype;
  voxgig_value*value;  // optional
  int64_t within;  // optional
} Vault;

// VaultLoadMatch is the typed request payload for Vault.load.
typedef struct {
  char*id;
} VaultLoadMatch;

// VaultListMatch is the typed request payload for Vault.list.
typedef struct {
  char*content;  // optional
  bool createtargetifmissing;  // optional
  voxgig_value*destination;  // optional
  voxgig_value*files;  // optional
  char*id;  // optional
  char*ifmatch;  // optional
  char*operation;  // optional
  bool rejectifcontentpreexists;  // optional
  char*scope;  // optional
  voxgig_value*target;  // optional
  char*targettype;  // optional
  voxgig_value*value;  // optional
  int64_t within;  // optional
} VaultListMatch;

// VaultCreateData is the typed request payload for Vault.create.
typedef struct {
  char*id;
  char*content;  // optional
  bool createtargetifmissing;  // optional
  voxgig_value*destination;
  voxgig_value*files;  // optional
  char*ifmatch;  // optional
  char*operation;
  bool rejectifcontentpreexists;  // optional
  char*scope;  // optional
  voxgig_value*target;
  char*targettype;
  voxgig_value*value;  // optional
  int64_t within;  // optional
} VaultCreateData;

// VaultUpdateData is the typed request payload for Vault.update.
typedef struct {
  char*id;
  char*content;  // optional
  bool createtargetifmissing;  // optional
  voxgig_value*destination;  // optional
  voxgig_value*files;  // optional
  char*ifmatch;  // optional
  char*operation;  // optional
  bool rejectifcontentpreexists;  // optional
  char*scope;  // optional
  voxgig_value*target;  // optional
  char*targettype;  // optional
  voxgig_value*value;  // optional
  int64_t within;  // optional
} VaultUpdateData;

// VaultRemoveMatch is the typed request payload for Vault.remove.
typedef struct {
  char*id;
  char*permanent;  // optional
} VaultRemoveMatch;

#endif // OBSIDIAN_ENTITY_TYPES_H
