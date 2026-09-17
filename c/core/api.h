// Obsidian SDK public API (generated).

#ifndef OBSIDIAN_API_H
#define OBSIDIAN_API_H

#include "sdk.h"

// Active entity.
Entity* active_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_active(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* active_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Command entity.
Entity* command_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_command(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* command_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Entity1 entity.
Entity* entity1_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_entity1(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* entity1_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Mcp entity.
Entity* mcp_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_mcp(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* mcp_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Open entity.
Entity* open_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_open(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* open_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Search entity.
Entity* search_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_search(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* search_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// System entity.
Entity* system_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_system(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* system_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Tag entity.
Entity* tag_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_tag(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* tag_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Vault entity.
Entity* vault_entity_new(ObsidianSDK* client, voxgig_value* entopts);
Entity* obsidian_vault(ObsidianSDK* client, voxgig_value* entopts);
voxgig_value* vault_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);

#endif // OBSIDIAN_API_H
