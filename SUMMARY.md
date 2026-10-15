# Local REST API for Obsidian

> The Obsidian Local REST API with MCP plugin gives you two ways to interact with your Obsidian vault programmatically:
>
> - **REST API**, standard HTTP endpoints for reading and writing notes, searching vault contents, and more. Useful from scripts, applications, or any HTTP client.
> - **MCP server**, exposes the same capabilities as structured tools for AI assistants (Claude, Cursor, and other MCP-compatible clients). See the `POST /mcp/` endpoint for connection details.
>
> ## Testing with this interface
>
> Select any operation in the sidebar, then open the **Try It** tab to send a live request to your running Obsidian instance.
>
> **Authentication**, all requests require a Bearer token. In the **Try It** panel, expand the **Security** section and paste the API key shown in Obsidian under **Settings → Local REST API with MCP**.
>
> **Certificate warning**, the plugin generates a self-signed TLS certificate on first run. Most browsers will block requests to an untrusted certificate, so you may need to add it as a trusted certificate in your OS or browser settings before requests will go through. The steps vary by environment, search for &quot;trust self-signed certificate&quot; plus your OS or browser name if you&#39;re unsure. If that proves too cumbersome, you can enable the insecure HTTP server in your plugin settings instead and select &quot;HTTP (insecure mode)&quot; from the **Try It** section.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 9 entities and 23 HTTP routes. There are 7 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### Active

Results: Success; content appended to the targeted section (via URL path elements). The full updated file content is returned. Any advisory warnings (for example a heading rebased past level 6) are JSON-encoded, then percent-encoded, in the `Markdown-Patch-Warnings` response header.; Success; content appended to end of file.; Success; Success. The body is the patched document. Any advisory warnings (for example a heading rebased past level 6) are JSON-encoded, then percent-encoded, in the `Markdown-Patch-Warnings` response header.; Success; targeted section replaced (via URL path elements). The full updated file content is returned. Any advisory warnings (for example a heading rebased past level 6) are JSON-encoded, then percent-encoded, in the `Markdown-Patch-Warnings` response header.; Success; entire file replaced.

SDK operations: `create`, `load`, `patch`, `remove`, `update`.

Key fields to recognise:

- `content`: String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.
- `createTargetIfMissing`: Create the target (heading path, block id, or frontmatter key) if it does not already exist.
- `destination`: For a heading move (operation `replace`, scope `parent`): where the section is re-parented.
- `ifMatch`: Optimistic-concurrency token (the `version` from a prior document map).
- `operation`: What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.

### Command

Results: Success; A list of available commands.

SDK operations: `create`, `list`.

### Entity1

Results: Success.

SDK operations: `load`.

Key fields to recognise:

- `authenticated`: Is your current request authenticated?
- `ok`: &#39;OK&#39;
- `service`: &#39;Obsidian Local REST API&#39;

### Mcp

Results: Message handled. Response body contains the JSON-RPC result, or may be empty for notifications. On session initialization the `Mcp-Session-Id` response header contains the new session ID.; SSE stream opened. The server pushes JSON-RPC messages as server-sent events.

SDK operations: `create`, `load`.

Key fields to recognise:

- `id`: Request identifier.
- `jsonrpc`: JSON-RPC version.
- `method`: MCP method to invoke.
- `params`: Method-specific parameters.

### Open

Results: Success.

SDK operations: `create`.

### Search

Results: Success.

SDK operations: `create`.

### System

Results: Success.

SDK operations: `load`.

### Tag

Results: A list of tags with their usage counts.

SDK operations: `list`.

Key fields to recognise:

- `count`: Number of times this tag is used across the vault.
- `name`: Tag name without the leading `#`.

### Vault

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
| Active | `create` | `POST /active/` | Required |
| Active | `load` | `GET /active/` | Required |
| Active | `patch` | `PATCH /active/` | Required |
| Active | `remove` | `DELETE /active/` | Required |
| Active | `update` | `PUT /active/` | Required |
| Command | `create` | `POST /commands/{commandId}/` | Required |
| Command | `list` | `GET /commands/` | Required |
| Entity1 | `load` | `GET /` | Required |
| Mcp | `create` | `POST /mcp/` | Required |
| Mcp | `load` | `GET /mcp/` | Required |
| Open | `create` | `POST /open/{filename}` | Required |
| Search | `create` | `POST /search/simple/` | Required |
| Search | `create` | `POST /search/` | Required |
| System | `load` | `GET /obsidian-local-rest-api.crt` | Required |
| System | `load` | `GET /openapi.yaml` | Required |
| Tag | `list` | `GET /tags/` | Required |
| Vault | `create` | `POST /vault/{filename}` | Required |
| Vault | `list` | `GET /vault/` | Required |
| Vault | `load` | `GET /vault/{filename}` | Required |
| Vault | `load` | `GET /vault/{pathToDirectory}/` | Required |
| Vault | `patch` | `PATCH /vault/{filename}` | Required |
| Vault | `remove` | `DELETE /vault/{filename}` | Required |
| Vault | `update` | `PUT /vault/{filename}` | Required |

## Connect to the API

- HTTPS (Secure Mode): `https://{host}:{port}`
- HTTP (Insecure Mode): `http://{host}:{port}`

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
| C | `c/` | Build from source |
| Golang | `go/` | Build from source |
| Lua | `lua/` | Build from source |
| PHP | `php/` | Build from source |
| Python | `py/` | Build from source |
| Ruby | `rb/` | Build from source |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### Go CLI

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### Go MCP server

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `obsidian_list`: List records for an entity. Supported entities: `command`, `tag`, `vault`.
- `obsidian_load`: Load one record for an entity. Supported entities: `active`, `entity1`, `mcp`, `system`, `vault`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `debug`: Request/response capture ring buffer for debugging
- `idempotency`: Idempotency keys for safe retries of mutating operations
- `metrics`: Statistics capture: per-operation counters and latency
- `paging`: Pagination signals for list operations
- `ratelimit`: Client-side rate limiting via a token bucket
- `retry`: Automatic retry of transient failures with exponential backoff
- `station`: Station control surface binding for outbound integrations
- `test`: In-memory mock transport for testing without a live server
- `timeout`: Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

