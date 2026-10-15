# Obsidian TypeScript SDK



The TypeScript SDK for the Obsidian API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Active()` — each with a small set of operations (`list`, `load`, `create`, `update`, `patch`, `remove`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.

> Also generated from this model: `c`, `go`, `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb` — see
> the [top-level README](../README.md).


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/obsidian-sdk/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/obsidian-sdk
npm install ./obsidian-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { ObsidianSDK } from '@voxgig-sdk/obsidian-sdk'

const client = new ObsidianSDK({
  apikey: process.env.OBSIDIAN_APIKEY,
  // Required: this API's server URL is templated on these.
  server: {
    host: '<host>',
    port: '<port>',
  },
})
```

### 3. Load an active

`load()` returns the entity and throws on failure; `.data()` reads its record:

```ts
try {
  const active = await client.Active().load()
  console.log(active.data())
} catch (err) {
  console.error('load failed:', err)
}
```

### 4. Create, update, and remove

```ts
// Create — returns the created Active ENTITY (.data() for the record)
const created = await client.Active().create({
  destination: {},
  operation: 'example_operation',
  target: 'example_target',
  targetType: 'example_targetType',
})

// Update
const updated = await client.Active().update({
  content: 'example_content',
  createTargetIfMissing: true,
})

// Patch — sends only the fields given
const patched = await client.Active().patch({
  content: 'example_content',
  createTargetIfMissing: true,
})

// Remove
await client.Active().remove()
```


## Use with Station

This SDK ships as a [voxgig/station](https://github.com/voxgig/station)
plugin: bind it to a local `Station` and outbound configuration,
credentials, and observability move to one place. The feature is
present but **off by default** — nothing changes until you bind.

### Declarative: `station.json` + `station.sdk()`

Declare an instance in `station.json` at the repo root (committable —
names and stores, never values):

```json
{ "station": 1,
  "profiles": { "default": {
    "sdk": { "obsidian": {
      "package": "@voxgig-sdk/obsidian-sdk" } } } } }
```

Then get the client where you need it:

1. `station = Station.open()` — reads and validates `station.json`;
   constructs nothing.
2. `client = station.sdk('obsidian')` — built on first ask and cached,
   so the same name returns the same client.

Loading this package is the whole bootstrap: it registers its own
factory (constructor plus embedded config) with the station library at
module init, so `station.sdk()` needs no SDK import in application
code. That is what the `package` key above is for — it names the module
for station to load, since nothing else in this example would execute
it. An application that imports this SDK for its types anyway can drop
the key: that import is itself the bootstrap.

A second instance of the same API is one more key — `"obsidian$test"`
beside `"obsidian"` — and `station.sdk('obsidian$test')` returns it.
SDK features are configured in the same file too: fleet-wide, per api,
or per instance. `station.check()` resolves and constructs every
active instance without sending a request — run it in CI.

### The secret name derives from the instance

The credential comes from [sekreto](https://github.com/voxgig/sekreto)
under a name derived from the **instance** name — the instance token
lowercased, plus `.apikey`. The untagged instance `obsidian` derives
`obsidian.apikey` — by default the `OBSIDIAN_APIKEY` environment
variable this README already documents, unchanged. A tagged instance
derives its own: `obsidian$test` → `obsidian_test.apikey` →
`OBSIDIAN_TEST_APIKEY` — each instance is a separate credentialed use
of the API, and its env var is derivable from the name you chose. To
pin a name instead, set `secret` on the instance block, or at the
api level for several instances sharing one key. Point a profile at a
vault later and application code does not change; sekreto's own
documentation covers the stores. The key stays out of `options()` and
`prepare()` output; `station.tap(...)` shows live traffic.

### Imperative: `connect()` — the retrofit path

Bind by passing the SDK class to the station:

1. `station = Station.open()` — profile, env, and proxy all defaulted.
2. `client = station.connect(ObsidianSDK)` — replaces direct
   construction; `connect(ObsidianSDK, { as: 'test' })` binds
   a second, tagged instance.

With no `station.json` at all this runs solo with everything
defaulted — the two-line form is how an existing application starts.

Station failures surface through this SDK's own error path
(`err.code`, `station_*`); the codes are catalogued in
[station error codes](https://github.com/voxgig/sdkgen/blob/main/docs/reference/station-errors.md).

## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const entity1 = await client.Entity1().load()
  console.log(entity1.data())
} catch (err) {
  console.error('load failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = ObsidianSDK.test()

const entity1 = await client.Entity1().load()
// entity1 is the Entity1 entity; .data() reads its mock record
console.log(entity1.data())
```

You can also use the instance method:

```ts
const client = new ObsidianSDK({ apikey: '...' })
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Entity1()

// First call runs the operation and stores its result
await entity.load()

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new ObsidianSDK({
  apikey: '...',
  extend: [logger],
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
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### ObsidianSDK

#### Constructor

```ts
new ObsidianSDK(options?: {
  apikey?: string
  server?: { host: string, port: string }
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `server` | `object` | **Required.** Values for the server-URL variables: `host`, `port`. The API base URL is a template over them. |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Active(data?)` | `ActiveEntity` | Create an Active entity instance. |
| `Command(data?)` | `CommandEntity` | Create a Command entity instance. |
| `Entity1(data?)` | `Entity1Entity` | Create an Entity1 entity instance. |
| `Mcp(data?)` | `McpEntity` | Create a Mcp entity instance. |
| `Open(data?)` | `OpenEntity` | Create an Open entity instance. |
| `Search(data?)` | `SearchEntity` | Create a Search entity instance. |
| `System(data?)` | `SystemEntity` | Create a System entity instance. |
| `Tag(data?)` | `TagEntity` | Create a Tag entity instance. |
| `Vault(data?)` | `VaultEntity` | Create a Vault entity instance. |
| `tester(testopts?, sdkopts?)` | `ObsidianSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `ObsidianSDK.test(testopts?, sdkopts?)` | `ObsidianSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity, and return it. |
| `update` | `update(reqdata?, ctrl?): Promise<Entity>` | Update an existing entity, and return it. |
| `patch` | `patch(reqdata?, ctrl?): Promise<Entity>` | Change part of an existing entity, and return it. |
| `remove` | `remove(reqmatch?, ctrl?): Promise<Entity>` | Remove an entity, and return it marked as deleted. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): ObsidianSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `load`, `create`, `update` and `patch` resolve to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).
- `remove` resolves to the entity, marked as deleted.

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### Active

| Field | Description |
| --- | --- |
| `content` | String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename. |
| `createTargetIfMissing` | Create the target (heading path, block id, or frontmatter key) if it does not already exist. |
| `destination` | For a heading move (operation `replace`, scope `parent`): where the section is re-parented. |
| `ifMatch` | Optimistic-concurrency token (the `version` from a prior document map). |
| `operation` | What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it. |
| `rejectIfContentPreexists` | Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry). |
| `scope` | Which part of the target the operation acts on (default `content`). |
| `target` | The node to edit. |
| `targetType` | The kind of node to edit. |
| `value` | Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a… |
| `within` | Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last). |

Operations: create, load, patch, remove, update.

API path: `/active/`

#### Command

| Field | Description |
| --- | --- |
| `id` |  |
| `name` |  |

Operations: create, list.

API path: `/commands/{commandId}/`

#### Entity1

| Field | Description |
| --- | --- |
| `authenticated` | Is your current request authenticated? |
| `ok` | 'OK' |
| `service` | 'Obsidian Local REST API' |
| `versions` |  |

Operations: load.

API path: `/`

#### Mcp

| Field | Description |
| --- | --- |
| `id` | Request identifier. |
| `jsonrpc` | JSON-RPC version. |
| `method` | MCP method to invoke. |
| `params` | Method-specific parameters. |

Operations: create, load.

API path: `/mcp/`

#### Open

| Field | Description |
| --- | --- |
| `id` |  |

Operations: create.

API path: `/open/{filename}`

#### Search

| Field | Description |
| --- | --- |

Operations: create.

API path: `/search/simple/`

#### System

| Field | Description |
| --- | --- |

Operations: load.

API path: `/obsidian-local-rest-api.crt`

#### Tag

| Field | Description |
| --- | --- |
| `count` | Number of times this tag is used across the vault. |
| `name` | Tag name without the leading `#`. |

Operations: list.

API path: `/tags/`

#### Vault

| Field | Description |
| --- | --- |
| `content` | String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename. |
| `createTargetIfMissing` | Create the target (heading path, block id, or frontmatter key) if it does not already exist. |
| `destination` | For a heading move (operation `replace`, scope `parent`): where the section is re-parented. |
| `files` |  |
| `id` |  |
| `ifMatch` | Optimistic-concurrency token (the `version` from a prior document map). |
| `operation` | What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it. |
| `rejectIfContentPreexists` | Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry). |
| `scope` | Which part of the target the operation acts on (default `content`). |
| `target` | The node to edit. |
| `targetType` | The kind of node to edit. |
| `value` | Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a… |
| `within` | Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last). |

Operations: create, list, load, patch, remove, update.

API path: `/vault/{filename}`



## Entities


### Active

Create an instance: `const active = client.Active()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `load(match)` | Load a single entity by match criteria. |
| `patch(data)` | Change part of an existing entity. |
| `remove(match)` | Remove the matching entity. |
| `update(data)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `content` | `string` | String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename. |
| `createTargetIfMissing` | `boolean` | Create the target (heading path, block id, or frontmatter key) if it does not already exist. |
| `destination` | `Record<string, any>` | For a heading move (operation `replace`, scope `parent`): where the section is re-parented. |
| `ifMatch` | `string` | Optimistic-concurrency token (the `version` from a prior document map). |
| `operation` | `string` | What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it. |
| `rejectIfContentPreexists` | `boolean` | Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry). |
| `scope` | `string` | Which part of the target the operation acts on (default `content`). |
| `target` | `any` | The node to edit. |
| `targetType` | `string` | The kind of node to edit. |
| `value` | `any` | Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a… |
| `within` | `number` | Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last). |

#### Example: Load

```ts
const active = await client.Active().load()
```

#### Example: Create

```ts
const active = await client.Active().create({
  destination: {},
  operation: 'example_operation',
  target: 'example_target',
  targetType: 'example_targetType',
})
```


### Command

Create an instance: `const command = client.Command()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` |  |
| `name` | `string` |  |

#### Example: List

```ts
const commands = await client.Command().list()
```

#### Example: Create

```ts
const command = await client.Command().create({
  id: 'example_id',
})
```


### Entity1

Create an instance: `const entity1 = client.Entity1()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `authenticated` | `boolean` | Is your current request authenticated? |
| `ok` | `string` | 'OK' |
| `service` | `string` | 'Obsidian Local REST API' |
| `versions` | `Record<string, any>` |  |

#### Example: Load

```ts
const entity1 = await client.Entity1().load()
```


### Mcp

Create an instance: `const mcp = client.Mcp()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Request identifier. |
| `jsonrpc` | `string` | JSON-RPC version. |
| `method` | `string` | MCP method to invoke. |
| `params` | `Record<string, any>` | Method-specific parameters. |

#### Example: Load

```ts
const mcp = await client.Mcp().load({ id: 'mcp_id' })
```

#### Example: Create

```ts
const mcp = await client.Mcp().create({
  jsonrpc: 'example_jsonrpc',
  method: 'example_method',
})
```


### Open

Create an instance: `const open = client.Open()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` |  |

#### Example: Create

```ts
const open = await client.Open().create({
  id: 'example_id',
})
```


### Search

Create an instance: `const search = client.Search()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Example: Create

```ts
const search = await client.Search().create({
})
```


### System

Create an instance: `const system = client.System()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Example: Load

```ts
const system = await client.System().load()
```


### Tag

Create an instance: `const tag = client.Tag()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `count` | `number` | Number of times this tag is used across the vault. |
| `name` | `string` | Tag name without the leading `#`. |

#### Example: List

```ts
const tags = await client.Tag().list()
```


### Vault

Create an instance: `const vault = client.Vault()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |
| `patch(data)` | Change part of an existing entity. |
| `remove(match)` | Remove the matching entity. |
| `update(data)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `content` | `string` | String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename. |
| `createTargetIfMissing` | `boolean` | Create the target (heading path, block id, or frontmatter key) if it does not already exist. |
| `destination` | `Record<string, any>` | For a heading move (operation `replace`, scope `parent`): where the section is re-parented. |
| `files` | `any[]` |  |
| `id` | `string` |  |
| `ifMatch` | `string` | Optimistic-concurrency token (the `version` from a prior document map). |
| `operation` | `string` | What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it. |
| `rejectIfContentPreexists` | `boolean` | Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry). |
| `scope` | `string` | Which part of the target the operation acts on (default `content`). |
| `target` | `any` | The node to edit. |
| `targetType` | `string` | The kind of node to edit. |
| `value` | `any` | Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a… |
| `within` | `number` | Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last). |

#### Example: Load

```ts
const vault = await client.Vault().load({ id: 'vault_id' })
```

#### Example: List

```ts
const vaults = await client.Vault().list()
```

#### Example: Create

```ts
const vault = await client.Vault().create({
  id: 'example_id',
  destination: {},
  operation: 'example_operation',
  target: 'example_target',
  targetType: 'example_targetType',
})
```

## Features

This SDK ships 9 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`debug`](#debug) | Debug capture |
| [`idempotency`](#idempotency) | Idempotency |
| [`metrics`](#metrics) | Metrics |
| [`paging`](#paging) | Paging |
| [`ratelimit`](#ratelimit) | Rate limiting |
| [`retry`](#retry) | Retry |
| [`station`](#station) | Station control surface binding for outbound integrations |
| [`test`](#test) | Test transport |
| [`timeout`](#timeout) | Timeout |

> **Order matters for `ratelimit`, `retry`, `station`, `timeout`.** These wrap the
> transport, so each one wraps whatever is already installed: the order you
> activate them in IS the nesting order. Activating them as an ordered list
> rather than a map is what fixes that order.

### debug

Debug capture.

| Option | Default |
|---|---|
| `active` | `false` |
| `max` | `100` |
| `redact` | `['authorization', 'cookie', 'set-cookie', 'api-key', 'apikey', 'x-api-key', 'idempotency-key']` |

Set `feature.debug.active` to enable it, then override any of the options above.

### idempotency

Idempotency.

| Option | Default |
|---|---|
| `active` | `false` |
| `header` | `'Idempotency-Key'` |
| `methods` | `['POST', 'PUT', 'PATCH', 'DELETE']` |
| `ops` | `['create', 'update', 'remove']` |

Set `feature.idempotency.active` to enable it, then override any of the options above.

### metrics

Metrics.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.metrics.active` to enable it, then override any of the options above.

### paging

Paging.

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

Rate limiting.

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

Retry.

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

### station

Station control surface binding for outbound integrations.

| Option | Default |
|---|---|
| `active` | `false` |
| `capture` | `'meta'` |
| `fromEnv` | `true` |
| `instance` | `''` |
| `profile` | `''` |
| `register` | `true` |
| `secret` | `''` |
| `url` | `''` |

Set `feature.station.active` to enable it, then override any of the options above.

`station` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.

### timeout

Timeout.

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

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **DebugFeature**: Debug capture
- **IdempotencyFeature**: Idempotency
- **MetricsFeature**: Metrics
- **PagingFeature**: Paging
- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **StationFeature**: Station control surface binding for outbound integrations
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
obsidian/
├── src/
│   ├── ObsidianSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { ObsidianSDK } from '@voxgig-sdk/obsidian-sdk'
```

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const entity1 = client.Entity1()
await entity1.load()

// entity1.data() now returns the entity1 data from the last `load`
// entity1.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
