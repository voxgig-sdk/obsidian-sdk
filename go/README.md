# Obsidian Golang SDK



The Golang SDK for the Obsidian API — an entity-oriented client using standard Go conventions. No generics required; data flows as `map[string]any`.

It exposes the API as capitalised, semantic **Entities** — e.g. `client.Active(nil)` — each with the same small set of operations (`List`, `Load`, `Create`, `Update`, `Remove`, `Patch`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Also generated from this model: `c`, `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb`, `ts` — see
> the [top-level README](../README.md).


## Install
```bash
go get github.com/voxgig-sdk/obsidian-sdk/go@latest
```

The Go module proxy resolves the version from the `go/vX.Y.Z` GitHub
release tag — see [Releases](https://github.com/voxgig-sdk/obsidian-sdk/releases) for the available versions.

To vendor from a local checkout instead, clone this repo alongside your
project and add a `replace` directive pointing at the checked-out
`go/` directory:

```bash
go mod edit -replace github.com/voxgig-sdk/obsidian-sdk/go=../obsidian-sdk/go
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### Quickstart

A complete program: create a client, then call the entity operations.
Each operation returns `(value, error)` — the value is the data itself
(there is no `{ok, data}` wrapper), so check `err` and use the value
directly.

```go
package main

import (
    "fmt"
    "os"
    sdk "github.com/voxgig-sdk/obsidian-sdk/go"
)

func main() {
    client := sdk.NewObsidianSDK(map[string]any{
        "apikey": os.Getenv("OBSIDIAN_APIKEY"),
    "server": map[string]any{
        "host": "<host>",
        "port": "<port>",
    },
    })

    // Load a single active — the value is the loaded record.
    active, err := client.Active(nil).Load(nil, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(active)

    // Create a active.
    created, err := client.Active(nil).Create(map[string]any{"destination": map[string]any{}, "operation": "example_operation", "target": "example_target", "targetType": "example_targetType"}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(created)

    // Update a active.
    updated, err := client.Active(nil).Update(map[string]any{"content": "example_content", "createTargetIfMissing": true}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(updated)

    // Remove a active.
    removed, err := client.Active(nil).Remove(nil, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(removed)
}
```


## Error handling

Every entity operation returns `(value, error)`. Check `err` before
using the value — there is no exception to catch:

```go
commands, err := client.Command(nil).List(nil, nil)
if err != nil {
    // handle err
    return
}
_ = commands
```

`Direct` follows the same `(value, error)` convention:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example_id"},
})
if err != nil {
    // handle err
}
_ = result
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

if result["ok"] == true {
    fmt.Println(result["status"]) // 200
    fmt.Println(result["data"])   // response body
}
```

### Prepare a request without sending it

```go
fetchdef, err := client.Prepare(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "DELETE",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

fmt.Println(fetchdef["url"])
fmt.Println(fetchdef["method"])
fmt.Println(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```go
client := sdk.Test()

command, err := client.Command(nil).List(
    nil, nil,
)
if err != nil {
    panic(err)
}
fmt.Println(command) // the returned mock data
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```go
mockFetch := func(url string, init map[string]any) (map[string]any, error) {
    return map[string]any{
        "status":     200,
        "statusText": "OK",
        "headers":    map[string]any{},
        "json": (func() any)(func() any {
            return map[string]any{"id": "mock01"}
        }),
    }, nil
}

client := sdk.NewObsidianSDK(map[string]any{
    "base": "http://localhost:8080",
    "system": map[string]any{
        "fetch": (func(string, map[string]any) (map[string]any, error))(mockFetch),
    },
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
OBSIDIAN_TEST_LIVE=TRUE
OBSIDIAN_APIKEY=<your-key>
```

Then run:

```bash
cd go && go test ./test/...
```


## Reference

### NewObsidianSDK

```go
func NewObsidianSDK(options map[string]any) *ObsidianSDK
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `"apikey"` | `string` | API key for authentication. |
| `"base"` | `string` | Base URL of the API server. |
| `"prefix"` | `string` | URL path prefix prepended to all requests. |
| `"suffix"` | `string` | URL path suffix appended to all requests. |
| `"feature"` | `map[string]any` | Feature activation flags. |
| `"extend"` | `[]any` | Additional Feature instances to load. |
| `"system"` | `map[string]any` | System overrides (e.g. custom `"fetch"` function). |

### TestSDK

```go
func TestSDK(testopts map[string]any, sdkopts map[string]any) *ObsidianSDK
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### ObsidianSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `OptionsMap` | `() map[string]any` | Deep copy of current SDK options. |
| `GetUtility` | `() *Utility` | Copy of the SDK utility object. |
| `Prepare` | `(fetchargs map[string]any) (map[string]any, error)` | Build an HTTP request definition without sending. |
| `Direct` | `(fetchargs map[string]any) (map[string]any, error)` | Build and send an HTTP request. |
| `Active` | `(data map[string]any) ObsidianEntity` | Create an Active entity instance. |
| `Command` | `(data map[string]any) ObsidianEntity` | Create a Command entity instance. |
| `Entity1` | `(data map[string]any) ObsidianEntity` | Create an Entity1 entity instance. |
| `Mcp` | `(data map[string]any) ObsidianEntity` | Create a Mcp entity instance. |
| `Open` | `(data map[string]any) ObsidianEntity` | Create an Open entity instance. |
| `Search` | `(data map[string]any) ObsidianEntity` | Create a Search entity instance. |
| `System` | `(data map[string]any) ObsidianEntity` | Create a System entity instance. |
| `Tag` | `(data map[string]any) ObsidianEntity` | Create a Tag entity instance. |
| `Vault` | `(data map[string]any) ObsidianEntity` | Create a Vault entity instance. |

### Entity interface (ObsidianEntity)

All entities implement the `ObsidianEntity` interface.

| Method | Signature | Description |
| --- | --- | --- |
| `Load` | `(reqmatch, ctrl map[string]any) (any, error)` | Load a single entity by match criteria. |
| `List` | `(reqmatch, ctrl map[string]any) (any, error)` | List entities matching the criteria. |
| `Create` | `(reqdata, ctrl map[string]any) (any, error)` | Create a new entity. |
| `Update` | `(reqdata, ctrl map[string]any) (any, error)` | Update an existing entity. |
| `Remove` | `(reqmatch, ctrl map[string]any) (any, error)` | Remove an entity. |
| `Data` | `(args ...any) any` | Get or set entity data. |
| `Match` | `(args ...any) any` | Get or set entity match criteria. |
| `Make` | `() Entity` | Create a new instance with the same options. |
| `GetName` | `() string` | Return the entity name. |

### Result shape

Entity operations return `(value, error)`. The `value` is the
operation's data **directly** — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `Load` / `Create` / `Update` / `Remove` | the entity record (`map[string]any`) |
| `List` | a `[]any` of entity records |

Check `err` first, then use the value directly (or the typed
`...Typed` variants, which return the entity's model struct and a typed
slice):

    active, err := client.Active(nil).Load(nil, nil)
    if err != nil { /* handle */ }
    // active is the returned record

Only `Direct()` returns a response envelope — a `map[string]any` with
`"ok"`, `"status"`, `"headers"`, and `"data"` keys.

### Entities

#### Active

| Field | Description |
| --- | --- |
| `"content"` | String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename. |
| `"createTargetIfMissing"` | Create the target (heading path, block id, or frontmatter key) if it does not already exist. |
| `"destination"` | For a heading move (operation `replace`, scope `parent`): where the section is re-parented. |
| `"ifMatch"` | Optimistic-concurrency token (the `version` from a prior document map). |
| `"operation"` | What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it. |
| `"rejectIfContentPreexists"` | Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry). |
| `"scope"` | Which part of the target the operation acts on (default `content`). |
| `"target"` | The node to edit. |
| `"targetType"` | The kind of node to edit. |
| `"value"` | Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a… |
| `"within"` | Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last). |

Operations: Create, Load, Patch, Remove, Update.

API path: `/active/`

#### Command

| Field | Description |
| --- | --- |
| `"id"` |  |
| `"name"` |  |

Operations: Create, List.

API path: `/commands/{commandId}/`

#### Entity1

| Field | Description |
| --- | --- |
| `"obsidian"` | Obsidian plugin API version |
| `"self"` | Plugin version. |

Operations: Load.

API path: `/`

#### Mcp

| Field | Description |
| --- | --- |
| `"id"` | Request identifier. |
| `"jsonrpc"` | JSON-RPC version. |
| `"method"` | MCP method to invoke. |
| `"params"` | Method-specific parameters. |

Operations: Create, Load.

API path: `/mcp/`

#### Open

| Field | Description |
| --- | --- |
| `"id"` |  |

Operations: Create.

API path: `/open/{filename}`

#### Search

| Field | Description |
| --- | --- |

Operations: Create.

API path: `/search/simple/`

#### System

| Field | Description |
| --- | --- |

Operations: Load.

API path: `/obsidian-local-rest-api.crt`

#### Tag

| Field | Description |
| --- | --- |
| `"count"` | Number of times this tag is used across the vault. |
| `"name"` | Tag name without the leading `#`. |

Operations: List.

API path: `/tags/`

#### Vault

| Field | Description |
| --- | --- |
| `"content"` | String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename. |
| `"createTargetIfMissing"` | Create the target (heading path, block id, or frontmatter key) if it does not already exist. |
| `"destination"` | For a heading move (operation `replace`, scope `parent`): where the section is re-parented. |
| `"files"` |  |
| `"id"` |  |
| `"ifMatch"` | Optimistic-concurrency token (the `version` from a prior document map). |
| `"operation"` | What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it. |
| `"rejectIfContentPreexists"` | Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry). |
| `"scope"` | Which part of the target the operation acts on (default `content`). |
| `"target"` | The node to edit. |
| `"targetType"` | The kind of node to edit. |
| `"value"` | Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a… |
| `"within"` | Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last). |

Operations: Create, List, Load, Patch, Remove, Update.

API path: `/vault/{filename}`



## Entities


### Active

Create an instance: `active := client.Active(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |
| `Create(data, ctrl)` | Create a new entity with the given data. |
| `Update(data, ctrl)` | Update an existing entity. |
| `Remove(match, ctrl)` | Remove the matching entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `content` | `string` | String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename. |
| `createTargetIfMissing` | `bool` | Create the target (heading path, block id, or frontmatter key) if it does not already exist. |
| `destination` | `map[string]any` | For a heading move (operation `replace`, scope `parent`): where the section is re-parented. |
| `ifMatch` | `string` | Optimistic-concurrency token (the `version` from a prior document map). |
| `operation` | `string` | What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it. |
| `rejectIfContentPreexists` | `bool` | Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry). |
| `scope` | `string` | Which part of the target the operation acts on (default `content`). |
| `target` | `any` | The node to edit. |
| `targetType` | `string` | The kind of node to edit. |
| `value` | `any` | Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a… |
| `within` | `int` | Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last). |

#### Example: Load

```go
active, err := client.Active(nil).Load(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(active) // the loaded record
```

#### Example: Create

```go
result, err := client.Active(nil).Create(map[string]any{
    "destination": map[string]any{},
    "operation": "example_operation",
    "target": "example_target",
    "targetType": "example_targetType",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### Command

Create an instance: `command := client.Command(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` |  |
| `name` | `string` |  |

#### Example: List

```go
commands, err := client.Command(nil).List(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(commands) // the array of records
```

#### Example: Create

```go
result, err := client.Command(nil).Create(map[string]any{
    "id": "example_id",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### Entity1

Create an instance: `entity1 := client.Entity1(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `obsidian` | `string` | Obsidian plugin API version |
| `self` | `string` | Plugin version. |

#### Example: Load

```go
entity1, err := client.Entity1(nil).Load(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(entity1) // the loaded record
```


### Mcp

Create an instance: `mcp := client.Mcp(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Request identifier. |
| `jsonrpc` | `string` | JSON-RPC version. |
| `method` | `string` | MCP method to invoke. |
| `params` | `map[string]any` | Method-specific parameters. |

#### Example: Load

```go
mcp, err := client.Mcp(nil).Load(map[string]any{"id": "mcp_id"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(mcp) // the loaded record
```

#### Example: Create

```go
result, err := client.Mcp(nil).Create(map[string]any{
    "jsonrpc": "example_jsonrpc",
    "method": "example_method",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### Open

Create an instance: `open := client.Open(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` |  |

#### Example: Create

```go
result, err := client.Open(nil).Create(map[string]any{
    "id": "example_id",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### Search

Create an instance: `search := client.Search(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Example: Create

```go
result, err := client.Search(nil).Create(map[string]any{
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### System

Create an instance: `system := client.System(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Example: Load

```go
system, err := client.System(nil).Load(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(system) // the loaded record
```


### Tag

Create an instance: `tag := client.Tag(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `count` | `float64` | Number of times this tag is used across the vault. |
| `name` | `string` | Tag name without the leading `#`. |

#### Example: List

```go
tags, err := client.Tag(nil).List(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(tags) // the array of records
```


### Vault

Create an instance: `vault := client.Vault(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |
| `Create(data, ctrl)` | Create a new entity with the given data. |
| `Update(data, ctrl)` | Update an existing entity. |
| `Remove(match, ctrl)` | Remove the matching entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `content` | `string` | String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename. |
| `createTargetIfMissing` | `bool` | Create the target (heading path, block id, or frontmatter key) if it does not already exist. |
| `destination` | `map[string]any` | For a heading move (operation `replace`, scope `parent`): where the section is re-parented. |
| `files` | `[]any` |  |
| `id` | `string` |  |
| `ifMatch` | `string` | Optimistic-concurrency token (the `version` from a prior document map). |
| `operation` | `string` | What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it. |
| `rejectIfContentPreexists` | `bool` | Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry). |
| `scope` | `string` | Which part of the target the operation acts on (default `content`). |
| `target` | `any` | The node to edit. |
| `targetType` | `string` | The kind of node to edit. |
| `value` | `any` | Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a… |
| `within` | `int` | Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last). |

#### Example: Load

```go
vault, err := client.Vault(nil).Load(map[string]any{"id": "vault_id"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(vault) // the loaded record
```

#### Example: List

```go
vaults, err := client.Vault(nil).List(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(vaults) // the array of records
```

#### Example: Create

```go
result, err := client.Vault(nil).Create(map[string]any{
    "id": "example_id",
    "destination": map[string]any{},
    "operation": "example_operation",
    "target": "example_target",
    "targetType": "example_targetType",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

## Features

This SDK ships 8 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`debug`](#debug) | Request/response capture ring buffer for debugging |
| [`idempotency`](#idempotency) | Idempotency keys for safe retries of mutating operations |
| [`metrics`](#metrics) | Statistics capture: per-operation counters and latency |
| [`paging`](#paging) | Pagination signals for list operations |
| [`ratelimit`](#ratelimit) | Client-side rate limiting via a token bucket |
| [`retry`](#retry) | Automatic retry of transient failures with exponential backoff |
| [`test`](#test) | In-memory mock transport for testing without a live server |
| [`timeout`](#timeout) | Per-request timeout with transport abort |

> **Order matters for `ratelimit`, `retry`, `timeout`.** These wrap the
> transport, so each one wraps whatever is already installed: the order you
> activate them in IS the nesting order. Activating them as an ordered list
> rather than a map is what fixes that order.

### debug

Request/response capture ring buffer for debugging.

| Option | Default |
|---|---|
| `active` | `false` |
| `max` | `100` |
| `redact` | `['authorization', 'cookie', 'set-cookie', 'api-key', 'apikey', 'x-api-key', 'idempotency-key']` |

Set `feature.debug.active` to enable it, then override any of the options above.

### idempotency

Idempotency keys for safe retries of mutating operations.

| Option | Default |
|---|---|
| `active` | `false` |
| `header` | `'Idempotency-Key'` |
| `methods` | `['POST', 'PUT', 'PATCH', 'DELETE']` |
| `ops` | `['create', 'update', 'remove']` |

Set `feature.idempotency.active` to enable it, then override any of the options above.

### metrics

Statistics capture: per-operation counters and latency.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.metrics.active` to enable it, then override any of the options above.

### paging

Pagination signals for list operations.

| Option | Default |
|---|---|
| `active` | `false` |
| `afterVar` | `'after'` |
| `cursorParam` | `'cursor'` |
| `firstVar` | `'first'` |
| `limitParam` | `'limit'` |
| `pageParam` | `'page'` |
| `startPage` | `1` |

Set `feature.paging.active` to enable it, then override any of the options above.

### ratelimit

Client-side rate limiting via a token bucket.

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

Set `feature.ratelimit.active` to enable it, then override any of the options above.

`ratelimit` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### retry

Automatic retry of transient failures with exponential backoff.

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

Set `feature.retry.active` to enable it, then override any of the options above.

`retry` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### test

In-memory mock transport for testing without a live server.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.

### timeout

Per-request timeout with transport abort.

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

Set `feature.timeout.active` to enable it, then override any of the options above.

`timeout` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.


## Open types

2 fields are carried as open values rather than typed structures.
This follows from the API definition, not from a gap in this SDK: the
definition describes them with untagged unions —
`oneOf`/`anyOf` branches with no `discriminator` — so it never states which
variant a given value is. Nothing can select a branch reliably, so the SDK
passes the value through unchanged rather than assert a shape the API does not
guarantee.

| Entity | Field | Variants | Nesting |
| --- | --- | --- | --- |
| `active` | `destination` | 3 | 2 levels |
| `vault` | `destination` | 3 | 2 levels |

These values round-trip unchanged — read them, modify them, send them back. If
the API adds a `discriminator` to the definition, regenerating will type them.
Every other field is typed normally.

## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature implements the
`Feature` interface and provides hooks — functions keyed by pipeline
stage names.

The SDK ships with built-in features:

- **DebugFeature**: Request/response capture ring buffer for debugging
- **IdempotencyFeature**: Idempotency keys for safe retries of mutating operations
- **MetricsFeature**: Statistics capture: per-operation counters and latency
- **PagingFeature**: Pagination signals for list operations
- **RatelimitFeature**: Client-side rate limiting via a token bucket
- **RetryFeature**: Automatic retry of transient failures with exponential backoff
- **TestFeature**: In-memory mock transport for testing without a live server
- **TimeoutFeature**: Per-request timeout with transport abort

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as maps

The Go SDK uses `map[string]any` throughout rather than typed structs.
This mirrors the dynamic nature of the API and keeps the SDK
flexible — no code generation is needed when the API schema changes.

Use `core.ToMapAny()` to safely cast results and nested data.

### Package structure

```
github.com/voxgig-sdk/obsidian-sdk/go/
├── obsidian.go        # Root package — type aliases and constructors
├── core/               # SDK core — client, types, pipeline
├── entity/             # Entity implementations
├── feature/            # Built-in features (Base, Test, Log)
├── utility/            # Utility functions and struct library
└── test/               # Test suites
```

The root package (`github.com/voxgig-sdk/obsidian-sdk/go`) re-exports everything needed
for normal use. Import sub-packages only when you need specific types
like `core.ToMapAny`.

### Entity state

Entity instances are stateful. After a successful `List`, the entity
stores the returned data and match criteria internally.

```go
command := client.Command(nil)
command.List(nil, nil)

// command.Data() now returns the command data from the last list
// command.Match() returns the last match criteria
```

Call `Make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`Direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `Prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
