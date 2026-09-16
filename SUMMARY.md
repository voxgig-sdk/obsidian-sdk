# Obsidian Local REST API

The Local REST API plugin for Obsidian, which serves the open vault over HTTP on the machine Obsidian is running on. Scoped here to the vault itself: list the vault, read, create, replace, append to and delete a file, and list the tags in use. Upstream specification by the plugin authors, reduced by Voxgig. Not an official Obsidian document, and not an API Obsidian ships: the plugin must be installed and its API key configured.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 2 entities and 8 HTTP routes. There are 7 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### [Tag](docs/api/tag.html)

Results: A list of tags with their usage counts.

SDK operations: `list`.

Key fields to recognise:

- `count`: Number of times this tag is used across the vault.
- `name`: Tag name without the leading `#`.

### [Vault](docs/api/vault.html)

Results: Success; content appended to the targeted section (via URL path elements). The full updated file content is returned. Any advisory warnings (for example a heading rebased past level 6) are JSON-encoded, then percent-encoded, in the `Markdown-Patch-Warnings` response header.; Success; content appended to end of file.; Success; Success. The body is the patched document. Any advisory warnings (for example a heading rebased past level 6) are JSON-encoded, then percent-encoded, in the `Markdown-Patch-Warnings` response header.; Success; targeted section replaced (via URL path elements). The full updated file content is returned. Any advisory warnings (for example a heading rebased past level 6) are JSON-encoded, then percent-encoded, in the `Markdown-Patch-Warnings` response header.; Success; entire file replaced.

SDK operations: `create`, `list`, `load`, `patch`, `remove`, `update`.

Key fields to recognise:

- `content`: String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.
- `createTargetIfMissing`: Create the target (heading path, block id, or frontmatter key) if it does not already exist.
- `destination`: For a heading move (operation `replace`, scope `parent`): where the section is re-parented.
- `ifMatch`: Optimistic-concurrency token (the `version` from a prior document map).
- `operation`: What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| [Tag](docs/api/tag.html) | `list` | `GET /tags/` | Required |
| [Vault](docs/api/vault.html) | `create` | `POST /vault/{filename}` | Required |
| [Vault](docs/api/vault.html) | `list` | `GET /vault/` | Required |
| [Vault](docs/api/vault.html) | `load` | `GET /vault/{filename}` | Required |
| [Vault](docs/api/vault.html) | `load` | `GET /vault/{pathToDirectory}/` | Required |
| [Vault](docs/api/vault.html) | `patch` | `PATCH /vault/{filename}` | Required |
| [Vault](docs/api/vault.html) | `remove` | `DELETE /vault/{filename}` | Required |
| [Vault](docs/api/vault.html) | `update` | `PUT /vault/{filename}` | Required |

## Connect to the API

- The Local REST API plugin, enabled inside Obsidian. HTTPS runs on 27124 with a self-signed certificate.: `http://127.0.0.1:27123`

The default credential is sent in the `Authorization` header with the `Bearer` prefix.

Find your API Key in your Obsidian settings in the &quot;Local REST API&quot; section under &quot;Plugins&quot;.

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| [C](docs/sdks/c.html) | `c/` | Build from source |
| [Golang](docs/sdks/go.html) | `go/` | Build from source |
| [Lua](docs/sdks/lua.html) | `lua/` | Build from source |
| [PHP](docs/sdks/php.html) | `php/` | Build from source |
| [Python](docs/sdks/py.html) | `py/` | Build from source |
| [Ruby](docs/sdks/rb.html) | `rb/` | Build from source |
| [TypeScript](docs/sdks/ts.html) | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### [Go CLI](docs/tools/go-cli.html)

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### [Go MCP server](docs/tools/go-mcp.html)

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `obsidian_list`: List records for an entity. Supported entities: `tag`, `vault`.
- `obsidian_load`: Load one record for an entity. Supported entities: `vault`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- [`debug`](docs/features/debug.html): Request/response capture ring buffer for debugging
- [`idempotency`](docs/features/idempotency.html): Idempotency keys for safe retries of mutating operations
- [`metrics`](docs/features/metrics.html): Statistics capture: per-operation counters and latency
- [`paging`](docs/features/paging.html): Pagination signals for list operations
- [`ratelimit`](docs/features/ratelimit.html): Client-side rate limiting via a token bucket
- [`retry`](docs/features/retry.html): Automatic retry of transient failures with exponential backoff
- [`test`](docs/features/test.html): In-memory mock transport for testing without a live server
- [`timeout`](docs/features/timeout.html): Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the [first-call guide](docs/guides/first-call.html) for the setup sequence.
- Read the [authentication guide](docs/guides/authentication.html) before using protected routes.
- Use the [API reference](docs/api/index.html) for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

