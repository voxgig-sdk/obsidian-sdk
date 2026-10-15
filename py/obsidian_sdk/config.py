# Obsidian SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "Obsidian",
            "slug": "obsidian",
            "version": "0.0.1",
            "target": "py",
        },
        "feature": {
            "debug": {
        "options": {
          "active": False,
          "max": 100,
          "redact": [
            "authorization",
            "cookie",
            "set-cookie",
            "api-key",
            "apikey",
            "x-api-key",
            "idempotency-key",
          ],
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "onEntry": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "idempotency": {
        "options": {
          "active": False,
          "header": "Idempotency-Key",
          "methods": [
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
          ],
          "ops": [
            "create",
            "update",
            "remove",
          ],
        },
        "optspec": {
          "keygen": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "metrics": {
        "options": {
          "active": False,
        },
        "optspec": {
          "now": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "paging": {
        "options": {
          "active": False,
          "afterVar": "after",
          "cursorParam": "cursor",
          "firstVar": "first",
          "limitParam": "limit",
          "pageParam": "page",
          "startPage": 1,
        },
        "optspec": {
          "limit": "`$NUMBER`",
          "ops": "`$LIST`",
        },
        "strict": False,
        "transport": "none",
      },
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
          "factor": 2,
          "maxDelay": 2000,
          "minDelay": 50,
          "retries": 2,
          "statuses": [
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "station": {
        "options": {
          "active": False,
          "capture": "meta",
          "fromEnv": True,
          "instance": "",
          "profile": "",
          "register": True,
          "secret": "",
          "url": "",
        },
        "optspec": {},
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "now": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
        },
        "options": {
            "base": "https://{host}:{port}",
            "server": {
                "host": "127.0.0.1",
                "port": "27124",
            },
            "auth": {
                "prefix": "Bearer",
            },
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "active": {},
                "command": {},
                "entity1": {},
                "mcp": {},
                "open": {},
                "search": {},
                "system": {},
                "tag": {},
                "vault": {},
            },
        },
        "entity": {
      "active": {
        "fields": [
          {
            "name": "content",
            "title": "Content",
            "type": "`$STRING`",
            "short": "String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.",
          },
          {
            "name": "createTargetIfMissing",
            "title": "Create Target If Missing",
            "type": "`$BOOLEAN`",
            "short": "Create the target (heading path, block id, or frontmatter key) if it does not already exist.",
          },
          {
            "name": "destination",
            "title": "Destination",
            "type": "`$OBJECT`",
            "req": True,
            "short": "For a heading move (operation `replace`, scope `parent`): where the section is re-parented.",
          },
          {
            "name": "ifMatch",
            "title": "If Match",
            "type": "`$STRING`",
            "short": "Optimistic-concurrency token (the `version` from a prior document map).",
          },
          {
            "name": "operation",
            "title": "Operation",
            "type": "`$STRING`",
            "req": True,
            "short": "What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.",
          },
          {
            "name": "rejectIfContentPreexists",
            "title": "Reject If Content Preexists",
            "type": "`$BOOLEAN`",
            "short": "Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry).",
          },
          {
            "name": "scope",
            "title": "Scope",
            "type": "`$STRING`",
            "short": "Which part of the target the operation acts on (default `content`).",
          },
          {
            "name": "target",
            "title": "Target",
            "type": "`$ANY`",
            "req": True,
            "short": "The node to edit.",
          },
          {
            "name": "targetType",
            "title": "Target Type",
            "type": "`$STRING`",
            "req": True,
            "short": "The kind of node to edit.",
          },
          {
            "name": "value",
            "title": "Value",
            "type": "`$ANY`",
            "short": "Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a…",
          },
          {
            "name": "within",
            "title": "Within",
            "type": "`$INTEGER`",
            "short": "Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last).",
          },
        ],
        "name": "active",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/active/",
                "segments": [
                  {
                    "lit": "active",
                  },
                ],
                "parts": [
                  "active",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "header": [
                    {
                      "name": "create_target_if_missing",
                      "orig": "Create-Target-If-Missing",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "false",
                    },
                    {
                      "name": "markdown_patch_version",
                      "orig": "Markdown-Patch-Version",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "2",
                    },
                    {
                      "name": "reject_if_content_preexist",
                      "orig": "Reject-If-Content-Preexists",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "false",
                    },
                  ],
                },
                "select": {},
                "body": {
                  "kind": "raw",
                  "media": "text/markdown",
                },
                "response": {
                  "kind": "raw",
                  "media": "text/markdown",
                },
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/active/",
                "segments": [
                  {
                    "lit": "active",
                  },
                ],
                "parts": [
                  "active",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "header": [
                    {
                      "name": "markdown_patch_version",
                      "orig": "Markdown-Patch-Version",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "2",
                    },
                    {
                      "name": "target_scope",
                      "orig": "Target-Scope",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "content",
                    },
                  ],
                },
                "select": {},
                "response": {
                  "alternatives": [
                    {
                      "kind": "json",
                      "media": "application/vnd.olrapi.document-map+json",
                    },
                    {
                      "kind": "json",
                      "media": "application/vnd.olrapi.note+json",
                    },
                    {
                      "kind": "raw",
                      "media": "text/html",
                    },
                    {
                      "kind": "raw",
                      "media": "text/markdown",
                    },
                  ],
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
          "patch": {
            "input": "data",
            "name": "patch",
            "points": [
              {
                "kind": "http",
                "method": "PATCH",
                "orig": "/active/",
                "segments": [
                  {
                    "lit": "active",
                  },
                ],
                "parts": [
                  "active",
                ],
                "rename": {},
                "transform": {
                  "req": {
                    "content": "`reqdata.content`",
                    "createTargetIfMissing": "`reqdata.create_target_if_missing`",
                    "destination": "`reqdata.destination`",
                    "ifMatch": "`reqdata.if_match`",
                    "operation": "`reqdata.operation`",
                    "rejectIfContentPreexists": "`reqdata.reject_if_content_preexist`",
                    "scope": "`reqdata.scope`",
                    "target": "`reqdata.target`",
                    "targetType": "`reqdata.target_type`",
                    "value": "`reqdata.value`",
                    "within": "`reqdata.within`",
                  },
                  "res": "`body`",
                },
                "args": {
                  "header": [
                    {
                      "name": "create_target_if_missing",
                      "orig": "Create-Target-If-Missing",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "false",
                    },
                    {
                      "name": "destination",
                      "orig": "Destination",
                      "type": "`$STRING`",
                      "kind": "header",
                      "field": True,
                    },
                    {
                      "name": "if_match",
                      "orig": "If-Match",
                      "type": "`$STRING`",
                      "kind": "header",
                    },
                    {
                      "name": "markdown_patch_version",
                      "orig": "Markdown-Patch-Version",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "2",
                    },
                    {
                      "name": "operation",
                      "orig": "Operation",
                      "type": "`$STRING`",
                      "kind": "header",
                      "field": True,
                    },
                    {
                      "name": "reject_if_content_preexist",
                      "orig": "Reject-If-Content-Preexists",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "false",
                    },
                    {
                      "name": "target",
                      "orig": "Target",
                      "type": "`$STRING`",
                      "kind": "header",
                      "field": True,
                    },
                    {
                      "name": "target_scope",
                      "orig": "Target-Scope",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "content",
                    },
                    {
                      "name": "target_type",
                      "orig": "Target-Type",
                      "type": "`$STRING`",
                      "kind": "header",
                    },
                    {
                      "name": "within",
                      "orig": "Within",
                      "type": "`$STRING`",
                      "kind": "header",
                      "field": True,
                    },
                  ],
                },
                "select": {},
                "body": {
                  "alternatives": [
                    {
                      "kind": "json",
                      "media": "application/vnd.olrapi.patch-instruction+json",
                    },
                    {
                      "kind": "raw",
                      "media": "text/markdown",
                    },
                  ],
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
          "remove": {
            "input": "data",
            "name": "remove",
            "points": [
              {
                "kind": "http",
                "method": "DELETE",
                "orig": "/active/",
                "segments": [
                  {
                    "lit": "active",
                  },
                ],
                "parts": [
                  "active",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "query": [
                    {
                      "name": "permanent",
                      "orig": "permanent",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "false",
                    },
                  ],
                },
                "select": {},
              },
            ],
          },
          "update": {
            "input": "data",
            "name": "update",
            "points": [
              {
                "kind": "http",
                "method": "PUT",
                "orig": "/active/",
                "segments": [
                  {
                    "lit": "active",
                  },
                ],
                "parts": [
                  "active",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "header": [
                    {
                      "name": "markdown_patch_version",
                      "orig": "Markdown-Patch-Version",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "2",
                    },
                    {
                      "name": "reject_if_content_preexist",
                      "orig": "Reject-If-Content-Preexists",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "false",
                    },
                  ],
                },
                "select": {},
                "body": {
                  "alternatives": [
                    {
                      "kind": "raw",
                      "media": "text/markdown",
                    },
                  ],
                  "kind": "json",
                  "media": "application/json",
                },
                "response": {
                  "kind": "raw",
                  "media": "text/markdown",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "command": {
        "fields": [
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
          },
          {
            "name": "name",
            "title": "Name",
            "type": "`$STRING`",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "command",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/commands/{commandId}/",
                "segments": [
                  {
                    "lit": "commands",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "commands",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "commandId": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "commandId",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
              },
            ],
          },
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/commands/",
                "segments": [
                  {
                    "lit": "commands",
                  },
                ],
                "parts": [
                  "commands",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.commands`",
                },
                "args": {},
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "entity1": {
        "fields": [
          {
            "name": "authenticated",
            "title": "Authenticated",
            "type": "`$BOOLEAN`",
            "short": "Is your current request authenticated?",
          },
          {
            "name": "ok",
            "title": "Ok",
            "type": "`$STRING`",
            "short": "'OK'",
          },
          {
            "name": "service",
            "title": "Service",
            "type": "`$STRING`",
            "short": "'Obsidian Local REST API'",
          },
          {
            "name": "versions",
            "title": "Versions",
            "type": "`$OBJECT`",
          },
        ],
        "name": "entity1",
        "op": {
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/",
                "segments": [],
                "parts": [],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "mcp": {
        "fields": [
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
            "short": "Request identifier.",
          },
          {
            "name": "jsonrpc",
            "title": "Jsonrpc",
            "type": "`$STRING`",
            "req": True,
            "short": "JSON-RPC version.",
          },
          {
            "name": "method",
            "title": "Method",
            "type": "`$STRING`",
            "req": True,
            "short": "MCP method to invoke.",
          },
          {
            "name": "params",
            "title": "Params",
            "type": "`$OBJECT`",
            "short": "Method-specific parameters.",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "mcp",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/mcp/",
                "segments": [
                  {
                    "lit": "mcp",
                  },
                ],
                "parts": [
                  "mcp",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "header": [
                    {
                      "name": "mcp_protocol_version",
                      "orig": "MCP-Protocol-Version",
                      "type": "`$STRING`",
                      "kind": "header",
                    },
                    {
                      "name": "mcp_session_id",
                      "orig": "Mcp-Session-Id",
                      "type": "`$STRING`",
                      "kind": "header",
                    },
                  ],
                },
                "select": {},
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/mcp/",
                "segments": [
                  {
                    "lit": "mcp",
                  },
                ],
                "parts": [
                  "mcp",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "header": [
                    {
                      "name": "mcp_protocol_version",
                      "orig": "MCP-Protocol-Version",
                      "type": "`$STRING`",
                      "kind": "header",
                    },
                    {
                      "name": "mcp_session_id",
                      "orig": "Mcp-Session-Id",
                      "type": "`$STRING`",
                      "kind": "header",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "mcp_session_id",
                  ],
                },
                "response": {
                  "kind": "raw",
                  "media": "text/event-stream",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "open": {
        "fields": [
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "open",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/open/{filename}",
                "segments": [
                  {
                    "lit": "open",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "open",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "filename": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "filename",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                  "query": [
                    {
                      "name": "new_leaf",
                      "orig": "newLeaf",
                      "type": "`$BOOLEAN`",
                      "kind": "query",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "search": {
        "fields": [],
        "name": "search",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/search/simple/",
                "segments": [
                  {
                    "lit": "search",
                  },
                  {
                    "lit": "simple",
                  },
                ],
                "parts": [
                  "search",
                  "simple",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "query": [
                    {
                      "name": "context_length",
                      "orig": "contextLength",
                      "type": "`$NUMBER`",
                      "kind": "query",
                      "example": 100,
                    },
                    {
                      "name": "query",
                      "orig": "query",
                      "type": "`$STRING`",
                      "kind": "query",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "$action": "simple",
                  "exist": [
                    "query",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
              {
                "kind": "http",
                "method": "POST",
                "orig": "/search/",
                "segments": [
                  {
                    "lit": "search",
                  },
                ],
                "parts": [
                  "search",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {},
                "body": {
                  "kind": "json",
                  "media": "application/vnd.olrapi.jsonlogic+json",
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "system": {
        "fields": [],
        "name": "system",
        "op": {
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/obsidian-local-rest-api.crt",
                "segments": [
                  {
                    "lit": "obsidian-local-rest-api.crt",
                  },
                ],
                "parts": [
                  "obsidian-local-rest-api.crt",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {},
              },
              {
                "kind": "http",
                "method": "GET",
                "orig": "/openapi.yaml",
                "segments": [
                  {
                    "lit": "openapi.yaml",
                  },
                ],
                "parts": [
                  "openapi.yaml",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {},
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "tag": {
        "fields": [
          {
            "name": "count",
            "title": "Count",
            "type": "`$NUMBER`",
            "short": "Number of times this tag is used across the vault.",
          },
          {
            "name": "name",
            "title": "Name",
            "type": "`$STRING`",
            "short": "Tag name without the leading `#`.",
          },
        ],
        "name": "tag",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/tags/",
                "segments": [
                  {
                    "lit": "tags",
                  },
                ],
                "parts": [
                  "tags",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.tags`",
                },
                "args": {},
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "vault": {
        "fields": [
          {
            "name": "content",
            "title": "Content",
            "type": "`$STRING`",
            "short": "String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.",
          },
          {
            "name": "createTargetIfMissing",
            "title": "Create Target If Missing",
            "type": "`$BOOLEAN`",
            "short": "Create the target (heading path, block id, or frontmatter key) if it does not already exist.",
          },
          {
            "name": "destination",
            "title": "Destination",
            "type": "`$OBJECT`",
            "req": True,
            "short": "For a heading move (operation `replace`, scope `parent`): where the section is re-parented.",
          },
          {
            "name": "files",
            "title": "Files",
            "type": "`$ARRAY`",
          },
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
          },
          {
            "name": "ifMatch",
            "title": "If Match",
            "type": "`$STRING`",
            "short": "Optimistic-concurrency token (the `version` from a prior document map).",
          },
          {
            "name": "operation",
            "title": "Operation",
            "type": "`$STRING`",
            "req": True,
            "short": "What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.",
          },
          {
            "name": "rejectIfContentPreexists",
            "title": "Reject If Content Preexists",
            "type": "`$BOOLEAN`",
            "short": "Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry).",
          },
          {
            "name": "scope",
            "title": "Scope",
            "type": "`$STRING`",
            "short": "Which part of the target the operation acts on (default `content`).",
          },
          {
            "name": "target",
            "title": "Target",
            "type": "`$ANY`",
            "req": True,
            "short": "The node to edit.",
          },
          {
            "name": "targetType",
            "title": "Target Type",
            "type": "`$STRING`",
            "req": True,
            "short": "The kind of node to edit.",
          },
          {
            "name": "value",
            "title": "Value",
            "type": "`$ANY`",
            "short": "Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a…",
          },
          {
            "name": "within",
            "title": "Within",
            "type": "`$INTEGER`",
            "short": "Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last).",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "vault",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/vault/{filename}",
                "segments": [
                  {
                    "lit": "vault",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "vault",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "filename": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "header": [
                    {
                      "name": "create_target_if_missing",
                      "orig": "Create-Target-If-Missing",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "false",
                    },
                    {
                      "name": "markdown_patch_version",
                      "orig": "Markdown-Patch-Version",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "2",
                    },
                    {
                      "name": "reject_if_content_preexist",
                      "orig": "Reject-If-Content-Preexists",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "false",
                    },
                  ],
                  "params": [
                    {
                      "name": "id",
                      "orig": "filename",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "body": {
                  "kind": "raw",
                  "media": "text/markdown",
                },
                "response": {
                  "kind": "raw",
                  "media": "text/markdown",
                },
              },
            ],
          },
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/vault/",
                "segments": [
                  {
                    "lit": "vault",
                  },
                ],
                "parts": [
                  "vault",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.files`",
                },
                "args": {},
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/vault/{filename}",
                "segments": [
                  {
                    "lit": "vault",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "vault",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "filename": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "header": [
                    {
                      "name": "markdown_patch_version",
                      "orig": "Markdown-Patch-Version",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "2",
                    },
                    {
                      "name": "target_scope",
                      "orig": "Target-Scope",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "content",
                    },
                  ],
                  "params": [
                    {
                      "name": "id",
                      "orig": "filename",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "response": {
                  "alternatives": [
                    {
                      "kind": "json",
                      "media": "application/vnd.olrapi.document-map+json",
                    },
                    {
                      "kind": "json",
                      "media": "application/vnd.olrapi.note+json",
                    },
                    {
                      "kind": "raw",
                      "media": "text/html",
                    },
                    {
                      "kind": "raw",
                      "media": "text/markdown",
                    },
                  ],
                  "kind": "json",
                  "media": "application/json",
                },
              },
              {
                "kind": "http",
                "method": "GET",
                "orig": "/vault/{pathToDirectory}/",
                "segments": [
                  {
                    "lit": "vault",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "vault",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "pathToDirectory": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "pathToDirectory",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
          "patch": {
            "input": "data",
            "name": "patch",
            "points": [
              {
                "kind": "http",
                "method": "PATCH",
                "orig": "/vault/{filename}",
                "segments": [
                  {
                    "lit": "vault",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "vault",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "filename": "id",
                  },
                },
                "transform": {
                  "req": {
                    "content": "`reqdata.content`",
                    "createTargetIfMissing": "`reqdata.create_target_if_missing`",
                    "destination": "`reqdata.destination`",
                    "ifMatch": "`reqdata.if_match`",
                    "operation": "`reqdata.operation`",
                    "rejectIfContentPreexists": "`reqdata.reject_if_content_preexist`",
                    "scope": "`reqdata.scope`",
                    "target": "`reqdata.target`",
                    "targetType": "`reqdata.target_type`",
                    "value": "`reqdata.value`",
                    "within": "`reqdata.within`",
                  },
                  "res": "`body`",
                },
                "args": {
                  "header": [
                    {
                      "name": "create_target_if_missing",
                      "orig": "Create-Target-If-Missing",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "false",
                    },
                    {
                      "name": "destination",
                      "orig": "Destination",
                      "type": "`$STRING`",
                      "kind": "header",
                      "field": True,
                    },
                    {
                      "name": "if_match",
                      "orig": "If-Match",
                      "type": "`$STRING`",
                      "kind": "header",
                    },
                    {
                      "name": "markdown_patch_version",
                      "orig": "Markdown-Patch-Version",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "2",
                    },
                    {
                      "name": "operation",
                      "orig": "Operation",
                      "type": "`$STRING`",
                      "kind": "header",
                      "field": True,
                    },
                    {
                      "name": "reject_if_content_preexist",
                      "orig": "Reject-If-Content-Preexists",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "false",
                    },
                    {
                      "name": "target",
                      "orig": "Target",
                      "type": "`$STRING`",
                      "kind": "header",
                      "field": True,
                    },
                    {
                      "name": "target_scope",
                      "orig": "Target-Scope",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "content",
                    },
                    {
                      "name": "target_type",
                      "orig": "Target-Type",
                      "type": "`$STRING`",
                      "kind": "header",
                    },
                    {
                      "name": "within",
                      "orig": "Within",
                      "type": "`$STRING`",
                      "kind": "header",
                      "field": True,
                    },
                  ],
                  "params": [
                    {
                      "name": "id",
                      "orig": "filename",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "body": {
                  "alternatives": [
                    {
                      "kind": "json",
                      "media": "application/vnd.olrapi.patch-instruction+json",
                    },
                    {
                      "kind": "raw",
                      "media": "text/markdown",
                    },
                  ],
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
          "remove": {
            "input": "data",
            "name": "remove",
            "points": [
              {
                "kind": "http",
                "method": "DELETE",
                "orig": "/vault/{filename}",
                "segments": [
                  {
                    "lit": "vault",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "vault",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "filename": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "filename",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                  "query": [
                    {
                      "name": "permanent",
                      "orig": "permanent",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "false",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
              },
            ],
          },
          "update": {
            "input": "data",
            "name": "update",
            "points": [
              {
                "kind": "http",
                "method": "PUT",
                "orig": "/vault/{filename}",
                "segments": [
                  {
                    "lit": "vault",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "vault",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "filename": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "header": [
                    {
                      "name": "markdown_patch_version",
                      "orig": "Markdown-Patch-Version",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "2",
                    },
                    {
                      "name": "reject_if_content_preexist",
                      "orig": "Reject-If-Content-Preexists",
                      "type": "`$STRING`",
                      "kind": "header",
                      "example": "false",
                    },
                  ],
                  "params": [
                    {
                      "name": "id",
                      "orig": "filename",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "body": {
                  "alternatives": [
                    {
                      "kind": "raw",
                      "media": "text/markdown",
                    },
                  ],
                  "kind": "json",
                  "media": "application/json",
                },
                "response": {
                  "kind": "raw",
                  "media": "text/markdown",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
