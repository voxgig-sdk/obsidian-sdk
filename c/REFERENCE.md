# Obsidian C SDK Reference

Complete API reference for the Obsidian C SDK.


## ObsidianSDK

### Constructor

```c
#include "core/api.h"

ObsidianSDK* client = obsidian_sdk_new(options);
```

Create a new SDK client instance. `options` is a `voxgig_value*` map
(`NULL` for none).

**Parameters (`options` map keys):**

| Key | Value type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL for API requests. |
| `prefix` | `string` | URL prefix appended after base. |
| `suffix` | `string` | URL suffix appended after path. |
| `headers` | `map` | Custom headers for all requests. |
| `feature` | `map` | Feature configuration. |
| `system` | `map` | System overrides. |


### Test Constructor

#### `ObsidianSDK* test_sdk(voxgig_value* testopts, voxgig_value* sdkopts)`

Create a test client with mock features active. Both arguments may be
`NULL`.

```c
ObsidianSDK* client = test_sdk(NULL, NULL);
```


### Entity Accessors

#### `Entity* obsidian_active(ObsidianSDK* client, voxgig_value* entopts)`

Create a new `Active` entity instance. Pass `NULL` for no initial
options.

#### `Entity* obsidian_command(ObsidianSDK* client, voxgig_value* entopts)`

Create a new `Command` entity instance. Pass `NULL` for no initial
options.

#### `Entity* obsidian_entity1(ObsidianSDK* client, voxgig_value* entopts)`

Create a new `Entity1` entity instance. Pass `NULL` for no initial
options.

#### `Entity* obsidian_mcp(ObsidianSDK* client, voxgig_value* entopts)`

Create a new `Mcp` entity instance. Pass `NULL` for no initial
options.

#### `Entity* obsidian_open(ObsidianSDK* client, voxgig_value* entopts)`

Create a new `Open` entity instance. Pass `NULL` for no initial
options.

#### `Entity* obsidian_search(ObsidianSDK* client, voxgig_value* entopts)`

Create a new `Search` entity instance. Pass `NULL` for no initial
options.

#### `Entity* obsidian_system(ObsidianSDK* client, voxgig_value* entopts)`

Create a new `System` entity instance. Pass `NULL` for no initial
options.

#### `Entity* obsidian_tag(ObsidianSDK* client, voxgig_value* entopts)`

Create a new `Tag` entity instance. Pass `NULL` for no initial
options.

#### `Entity* obsidian_vault(ObsidianSDK* client, voxgig_value* entopts)`

Create a new `Vault` entity instance. Pass `NULL` for no initial
options.

#### `voxgig_value* sdk_direct(ObsidianSDK* client, voxgig_value* fetchargs, PNError** err)`

Make a direct HTTP request to any API endpoint. Returns a result map with
`ok`, `status`, `headers`, and `data` (or `err` on failure). This escape
hatch never sets `*err` for a non-2xx response — branch on
`getp(result, "ok")`.

**Parameters (`fetchargs` map keys):**

| Key | Value type | Description |
| --- | --- | --- |
| `path` | `string` | URL path with optional `{param}` placeholders. |
| `method` | `string` | HTTP method (default: `"GET"`). |
| `params` | `map` | Path parameter values. |
| `query` | `map` | Query string parameters. |
| `headers` | `map` | Request headers (merged with defaults). |
| `body` | `any` | Request body (maps are JSON-serialized). |

#### `voxgig_value* sdk_prepare(ObsidianSDK* client, voxgig_value* fetchargs, PNError** err)`

Prepare a fetch definition without sending. Returns the fetchdef and sets
`*err` on failure.


---

## Active

```c
Entity* active = obsidian_active(client, NULL);
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | `char*` | No | String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename. |
| `createTargetIfMissing` | `bool` | No | Create the target (heading path, block id, or frontmatter key) if it does not already exist. |
| `destination` | `voxgig_value* (map)` | Yes | For a heading move (operation `replace`, scope `parent`): where the section is re-parented. |
| `ifMatch` | `char*` | No | Optimistic-concurrency token (the `version` from a prior document map). |
| `operation` | `char*` | Yes | What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it. |
| `rejectIfContentPreexists` | `bool` | No | Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry). |
| `scope` | `char*` | No | Which part of the target the operation acts on (default `content`). |
| `target` | `voxgig_value*` | Yes | The node to edit. |
| `targetType` | `char*` | Yes | The kind of node to edit. |
| `value` | `voxgig_value*` | No | Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a… |
| `within` | `int64_t` | No | Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last). |

### Operations

#### `vt->create(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err)`

Create a new entity with the given data. Returns the created entity data and sets `*err` on failure.

```c
Entity* active = obsidian_active(client, NULL);
voxgig_value* result = active->vt->create(active, cmap(4,
    "destination", v_map(),  // voxgig_value* (map)
    "operation", v_str("example_operation"),  // char*
    "target", v_str("example_target"),  // voxgig_value*
    "targetType", v_str("example_targetType"))  // char*
, NULL, &err);
```

#### `vt->load(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err)`

Load a single entity matching the given criteria. Returns the entity data and sets `*err` on failure.

```c
Entity* active = obsidian_active(client, NULL);
voxgig_value* result = active->vt->load(active, NULL, NULL, &err);
```

#### `vt->remove(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err)`

Remove the entity matching the given criteria. Sets `*err` on failure.

```c
Entity* active = obsidian_active(client, NULL);
voxgig_value* result = active->vt->remove(active, NULL, NULL, &err);
```

#### `vt->update(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err)`

Update an existing entity. The data must include the entity id. Returns the updated entity data.

```c
Entity* active = obsidian_active(client, NULL);
voxgig_value* result = active->vt->update(active, NULL, NULL, &err);
```

### Common Methods

#### `voxgig_value* vt->data(Entity* e, voxgig_value* args)`

Get the entity data. Pass a map to set it.

#### `voxgig_value* vt->matchv(Entity* e, voxgig_value* args)`

Get the entity match criteria. Pass a map to set it.

#### `Entity* vt->make(Entity* e)`

Create a new `Active` entity instance with the same options.

#### `const char* vt->get_name(Entity* e)`

Return the entity name.


---

## Command

```c
Entity* command = obsidian_command(client, NULL);
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `char*` | No |  |
| `name` | `char*` | No |  |

### Operations

#### `vt->create(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err)`

Create a new entity with the given data. Returns the created entity data and sets `*err` on failure.

```c
Entity* command = obsidian_command(client, NULL);
voxgig_value* result = command->vt->create(command, cmap(1,
    "id", v_str("example_id"))  // char*
, NULL, &err);
```

#### `vt->list(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err)`

List entities matching the given criteria. The match is optional — pass `NULL` to list all records. Returns a List.

```c
Entity* command = obsidian_command(client, NULL);
voxgig_value* results = command->vt->list(command, NULL, NULL, &err);
for (size_t i = 0; i < (size_t)voxgig_size(results); i++) {
    printf("%s\n", voxgig_to_json(voxgig_getelem(results, v_int(i), NULL)));
}
```

### Common Methods

#### `voxgig_value* vt->data(Entity* e, voxgig_value* args)`

Get the entity data. Pass a map to set it.

#### `voxgig_value* vt->matchv(Entity* e, voxgig_value* args)`

Get the entity match criteria. Pass a map to set it.

#### `Entity* vt->make(Entity* e)`

Create a new `Command` entity instance with the same options.

#### `const char* vt->get_name(Entity* e)`

Return the entity name.


---

## Entity1

```c
Entity* entity1 = obsidian_entity1(client, NULL);
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `obsidian` | `char*` | No | Obsidian plugin API version |
| `self` | `char*` | No | Plugin version. |

### Operations

#### `vt->load(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err)`

Load a single entity matching the given criteria. Returns the entity data and sets `*err` on failure.

```c
Entity* entity1 = obsidian_entity1(client, NULL);
voxgig_value* result = entity1->vt->load(entity1, NULL, NULL, &err);
```

### Common Methods

#### `voxgig_value* vt->data(Entity* e, voxgig_value* args)`

Get the entity data. Pass a map to set it.

#### `voxgig_value* vt->matchv(Entity* e, voxgig_value* args)`

Get the entity match criteria. Pass a map to set it.

#### `Entity* vt->make(Entity* e)`

Create a new `Entity1` entity instance with the same options.

#### `const char* vt->get_name(Entity* e)`

Return the entity name.


---

## Mcp

```c
Entity* mcp = obsidian_mcp(client, NULL);
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `char*` | No | Request identifier. |
| `jsonrpc` | `char*` | Yes | JSON-RPC version. |
| `method` | `char*` | Yes | MCP method to invoke. |
| `params` | `voxgig_value* (map)` | No | Method-specific parameters. |

### Operations

#### `vt->create(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err)`

Create a new entity with the given data. Returns the created entity data and sets `*err` on failure.

```c
Entity* mcp = obsidian_mcp(client, NULL);
voxgig_value* result = mcp->vt->create(mcp, cmap(2,
    "jsonrpc", v_str("example_jsonrpc"),  // char*
    "method", v_str("example_method"))  // char*
, NULL, &err);
```

#### `vt->load(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err)`

Load a single entity matching the given criteria. Returns the entity data and sets `*err` on failure.

```c
Entity* mcp = obsidian_mcp(client, NULL);
voxgig_value* result = mcp->vt->load(mcp, cmap(1, "id", v_str("mcp_id")), NULL, &err);
```

### Common Methods

#### `voxgig_value* vt->data(Entity* e, voxgig_value* args)`

Get the entity data. Pass a map to set it.

#### `voxgig_value* vt->matchv(Entity* e, voxgig_value* args)`

Get the entity match criteria. Pass a map to set it.

#### `Entity* vt->make(Entity* e)`

Create a new `Mcp` entity instance with the same options.

#### `const char* vt->get_name(Entity* e)`

Return the entity name.


---

## Open

```c
Entity* open = obsidian_open(client, NULL);
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `char*` | No |  |

### Operations

#### `vt->create(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err)`

Create a new entity with the given data. Returns the created entity data and sets `*err` on failure.

```c
Entity* open = obsidian_open(client, NULL);
voxgig_value* result = open->vt->create(open, cmap(1,
    "id", v_str("example_id"))  // char*
, NULL, &err);
```

### Common Methods

#### `voxgig_value* vt->data(Entity* e, voxgig_value* args)`

Get the entity data. Pass a map to set it.

#### `voxgig_value* vt->matchv(Entity* e, voxgig_value* args)`

Get the entity match criteria. Pass a map to set it.

#### `Entity* vt->make(Entity* e)`

Create a new `Open` entity instance with the same options.

#### `const char* vt->get_name(Entity* e)`

Return the entity name.


---

## Search

```c
Entity* search = obsidian_search(client, NULL);
```

### Operations

#### `vt->create(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err)`

Create a new entity with the given data. Returns the created entity data and sets `*err` on failure.

```c
Entity* search = obsidian_search(client, NULL);
voxgig_value* result = search->vt->create(search, NULL, NULL, &err);
```

### Common Methods

#### `voxgig_value* vt->data(Entity* e, voxgig_value* args)`

Get the entity data. Pass a map to set it.

#### `voxgig_value* vt->matchv(Entity* e, voxgig_value* args)`

Get the entity match criteria. Pass a map to set it.

#### `Entity* vt->make(Entity* e)`

Create a new `Search` entity instance with the same options.

#### `const char* vt->get_name(Entity* e)`

Return the entity name.


---

## System

```c
Entity* system = obsidian_system(client, NULL);
```

### Operations

#### `vt->load(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err)`

Load a single entity matching the given criteria. Returns the entity data and sets `*err` on failure.

```c
Entity* system = obsidian_system(client, NULL);
voxgig_value* result = system->vt->load(system, NULL, NULL, &err);
```

### Common Methods

#### `voxgig_value* vt->data(Entity* e, voxgig_value* args)`

Get the entity data. Pass a map to set it.

#### `voxgig_value* vt->matchv(Entity* e, voxgig_value* args)`

Get the entity match criteria. Pass a map to set it.

#### `Entity* vt->make(Entity* e)`

Create a new `System` entity instance with the same options.

#### `const char* vt->get_name(Entity* e)`

Return the entity name.


---

## Tag

```c
Entity* tag = obsidian_tag(client, NULL);
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | `double` | No | Number of times this tag is used across the vault. |
| `name` | `char*` | No | Tag name without the leading `#`. |

### Operations

#### `vt->list(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err)`

List entities matching the given criteria. The match is optional — pass `NULL` to list all records. Returns a List.

```c
Entity* tag = obsidian_tag(client, NULL);
voxgig_value* results = tag->vt->list(tag, NULL, NULL, &err);
for (size_t i = 0; i < (size_t)voxgig_size(results); i++) {
    printf("%s\n", voxgig_to_json(voxgig_getelem(results, v_int(i), NULL)));
}
```

### Common Methods

#### `voxgig_value* vt->data(Entity* e, voxgig_value* args)`

Get the entity data. Pass a map to set it.

#### `voxgig_value* vt->matchv(Entity* e, voxgig_value* args)`

Get the entity match criteria. Pass a map to set it.

#### `Entity* vt->make(Entity* e)`

Create a new `Tag` entity instance with the same options.

#### `const char* vt->get_name(Entity* e)`

Return the entity name.


---

## Vault

```c
Entity* vault = obsidian_vault(client, NULL);
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | `char*` | No | String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename. |
| `createTargetIfMissing` | `bool` | No | Create the target (heading path, block id, or frontmatter key) if it does not already exist. |
| `destination` | `voxgig_value* (map)` | Yes | For a heading move (operation `replace`, scope `parent`): where the section is re-parented. |
| `files` | `voxgig_value* (list)` | No |  |
| `id` | `char*` | No |  |
| `ifMatch` | `char*` | No | Optimistic-concurrency token (the `version` from a prior document map). |
| `operation` | `char*` | Yes | What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it. |
| `rejectIfContentPreexists` | `bool` | No | Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry). |
| `scope` | `char*` | No | Which part of the target the operation acts on (default `content`). |
| `target` | `voxgig_value*` | Yes | The node to edit. |
| `targetType` | `char*` | Yes | The kind of node to edit. |
| `value` | `voxgig_value*` | No | Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a… |
| `within` | `int64_t` | No | Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last). |

### Operations

#### `vt->create(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err)`

Create a new entity with the given data. Returns the created entity data and sets `*err` on failure.

```c
Entity* vault = obsidian_vault(client, NULL);
voxgig_value* result = vault->vt->create(vault, cmap(5,
    "id", v_str("example_id"),  // char*
    "destination", v_map(),  // voxgig_value* (map)
    "operation", v_str("example_operation"),  // char*
    "target", v_str("example_target"),  // voxgig_value*
    "targetType", v_str("example_targetType"))  // char*
, NULL, &err);
```

#### `vt->list(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err)`

List entities matching the given criteria. The match is optional — pass `NULL` to list all records. Returns a List.

```c
Entity* vault = obsidian_vault(client, NULL);
voxgig_value* results = vault->vt->list(vault, NULL, NULL, &err);
for (size_t i = 0; i < (size_t)voxgig_size(results); i++) {
    printf("%s\n", voxgig_to_json(voxgig_getelem(results, v_int(i), NULL)));
}
```

#### `vt->load(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err)`

Load a single entity matching the given criteria. Returns the entity data and sets `*err` on failure.

```c
Entity* vault = obsidian_vault(client, NULL);
voxgig_value* result = vault->vt->load(vault, cmap(1, "id", v_str("vault_id")), NULL, &err);
```

#### `vt->remove(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err)`

Remove the entity matching the given criteria. Sets `*err` on failure.

```c
Entity* vault = obsidian_vault(client, NULL);
voxgig_value* result = vault->vt->remove(vault, cmap(1, "id", v_str("vault_id")), NULL, &err);
```

#### `vt->update(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err)`

Update an existing entity. The data must include the entity id. Returns the updated entity data.

```c
Entity* vault = obsidian_vault(client, NULL);
voxgig_value* result = vault->vt->update(vault, cmap(1, "id", v_str("vault_id")), NULL, &err);
```

### Common Methods

#### `voxgig_value* vt->data(Entity* e, voxgig_value* args)`

Get the entity data. Pass a map to set it.

#### `voxgig_value* vt->matchv(Entity* e, voxgig_value* args)`

Get the entity match criteria. Pass a map to set it.

#### `Entity* vt->make(Entity* e)`

Create a new `Vault` entity instance with the same options.

#### `const char* vt->get_name(Entity* e)`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `debug` | 0.0.1 | Request/response capture ring buffer for debugging |
| `idempotency` | 0.0.1 | Idempotency keys for safe retries of mutating operations |
| `metrics` | 0.0.1 | Statistics capture: per-operation counters and latency |
| `paging` | 0.0.1 | Pagination signals for list operations |
| `ratelimit` | 0.0.1 | Client-side rate limiting via a token bucket |
| `retry` | 0.0.1 | Automatic retry of transient failures with exponential backoff |
| `test` | 0.0.1 | In-memory mock transport for testing without a live server |
| `timeout` | 0.0.1 | Per-request timeout with transport abort |


Features are activated via the `feature` option:

```c
ObsidianSDK* client = obsidian_sdk_new(cmap(1,
    "feature", cmap(8,
        "debug", cmap(1, "active", v_bool(true)),
        "idempotency", cmap(1, "active", v_bool(true)),
        "metrics", cmap(1, "active", v_bool(true)),
        "paging", cmap(1, "active", v_bool(true)),
        "ratelimit", cmap(1, "active", v_bool(true)),
        "retry", cmap(1, "active", v_bool(true)),
        "test", cmap(1, "active", v_bool(true)),
        "timeout", cmap(1, "active", v_bool(true)))
));
```


### Configuring features

Each feature is inactive until switched on, and an SDK with no feature
configured does no feature work at all. Every option below keeps its default
unless you name it.

The array form of \`feature\` is significant: several features wrap the
transport, and the order you list them in is the order they nest.

#### Ordering

`ratelimit`, `retry`, `timeout` wrap the transport. Each
wraps whatever is already installed, so **activation order is nesting order**:
a feature activated later sits OUTSIDE one activated earlier, and sees the call
first.

That decides behaviour, not just sequence: a feature that short-circuits the
call, such as a cache serving a hit, stops every feature nested inside it from
ever seeing that call.

`debug`, `idempotency`, `metrics`, `paging`, `test` attach to pipeline hooks
rather than the transport, so their order does not affect what they observe.

#### `debug`

Request/response capture ring buffer for debugging.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `max` | `100` |
| `redact` | `['authorization', 'cookie', 'set-cookie', 'api-key', 'apikey', 'x-api-key', 'idempotency-key']` |

| Option | Type |
|---|---|
| `now` | function |
| `onEntry` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.debug.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Inactive by default: leaving it out costs nothing at runtime.

#### `idempotency`

Idempotency keys for safe retries of mutating operations.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `header` | `'Idempotency-Key'` |
| `methods` | `['POST', 'PUT', 'PATCH', 'DELETE']` |
| `ops` | `['create', 'update', 'remove']` |

| Option | Type |
|---|---|
| `keygen` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.idempotency.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Inactive by default: leaving it out costs nothing at runtime.

#### `metrics`

Statistics capture: per-operation counters and latency.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `now` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.metrics.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Inactive by default: leaving it out costs nothing at runtime.

#### `paging`

Pagination signals for list operations.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `afterVar` | `'after'` |
| `cursorParam` | `'cursor'` |
| `firstVar` | `'first'` |
| `limitParam` | `'limit'` |
| `pageParam` | `'page'` |
| `startPage` | `1` |

| Option | Type |
|---|---|
| `limit` | number |
| `ops` | list |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.paging.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Inactive by default: leaving it out costs nothing at runtime.

#### `ratelimit`

Client-side rate limiting via a token bucket.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

| Option | Type |
|---|---|
| `now` | function |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.ratelimit.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `retry`

Automatic retry of transient failures with exponential backoff.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

| Option | Type |
|---|---|
| `jitter` | boolean |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.retry.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `test`

In-memory mock transport for testing without a live server.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `entity` | map |
| `net` | map |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.test.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Installs the BASE transport that the wrapping features wrap, so it must be
  activated before them.
- Inactive by default: leaving it out costs nothing at runtime.

#### `timeout`

Per-request timeout with transport abort.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

| Option | Type |
|---|---|
| `clearTimer` | function |
| `setTimer` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.timeout.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

