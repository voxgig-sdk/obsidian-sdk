// Obsidian SDK public API (generated).

#ifndef OBSIDIAN_API_H
#define OBSIDIAN_API_H

#include "sdk.h"

// Tag entity.
Entity* tag_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_tag(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* tag_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Vault entity.
Entity* vault_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_vault(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* vault_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);

#endif // OBSIDIAN_API_H
