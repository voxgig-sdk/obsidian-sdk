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
