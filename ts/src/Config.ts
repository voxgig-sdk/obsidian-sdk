
import { BaseFeature } from './feature/base/BaseFeature'
import { DebugFeature } from './feature/debug/DebugFeature'
import { IdempotencyFeature } from './feature/idempotency/IdempotencyFeature'
import { MetricsFeature } from './feature/metrics/MetricsFeature'
import { PagingFeature } from './feature/paging/PagingFeature'
import { RatelimitFeature } from './feature/ratelimit/RatelimitFeature'
import { RetryFeature } from './feature/retry/RetryFeature'
import { TestFeature } from './feature/test/TestFeature'
import { TimeoutFeature } from './feature/timeout/TimeoutFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   debug: DebugFeature,
 idempotency: IdempotencyFeature,
 metrics: MetricsFeature,
 paging: PagingFeature,
 ratelimit: RatelimitFeature,
 retry: RetryFeature,
 test: TestFeature,
 timeout: TimeoutFeature,

}


// Per-feature plugin DEFINITIONS (voxgig/plugin `Definition` values), from
// the model's active plugin groups. A feature that takes a `plugins` option
// (secrets over sekreto) reads its own entry; a feature with no plugins has
// none. Named imports above make each definition statically reachable, so
// an SDK carries exactly the plugin modules its model selects — the same
// leanness the old side-effect registry imports bought, without a registry.
const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    // TODO: errors etc
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'Obsidian',
        slug: "obsidian",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     debug:     {
      "options": {
        "active": false,
        "max": 100,
        "redact": [
          "authorization",
          "cookie",
          "set-cookie",
          "api-key",
          "apikey",
          "x-api-key",
          "idempotency-key"
        ]
      },
      "optspec": {
        "now": "`$FUNCTION`",
        "onEntry": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "none"
    },
 idempotency:     {
      "options": {
        "active": false,
        "header": "Idempotency-Key",
        "methods": [
          "POST",
          "PUT",
          "PATCH",
          "DELETE"
        ],
        "ops": [
          "create",
          "update",
          "remove"
        ]
      },
      "optspec": {
        "keygen": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "none"
    },
 metrics:     {
      "options": {
        "active": false
      },
      "optspec": {
        "now": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "none"
    },
 paging:     {
      "options": {
        "active": false,
        "afterVar": "after",
        "cursorParam": "cursor",
        "firstVar": "first",
        "limitParam": "limit",
        "pageParam": "page",
        "startPage": 1
      },
      "optspec": {
        "limit": "`$NUMBER`",
        "ops": "`$LIST`"
      },
      "strict": false,
      "transport": "none"
    },
 ratelimit:     {
      "options": {
        "active": false,
        "burst": 5,
        "rate": 5
      },
      "optspec": {
        "now": "`$FUNCTION`",
        "sleep": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },
 retry:     {
      "options": {
        "active": false,
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
          504
        ]
      },
      "optspec": {
        "jitter": "`$BOOLEAN`",
        "sleep": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },
 test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },
 timeout:     {
      "options": {
        "active": false,
        "ms": 30000
      },
      "optspec": {
        "clearTimer": "`$FUNCTION`",
        "setTimer": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },

  }


  options = {
    base: "https://{host}:{port}",

    server: {
      "host": "127.0.0.1",
      "port": "27124",
    },

    auth: {
      prefix: 'Bearer',
    },

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
        active: {
        },
  
        command: {
        },
  
        entity1: {
        },
  
        mcp: {
        },
  
        open: {
        },
  
        search: {
        },
  
        system: {
        },
  
        tag: {
        },
  
        vault: {
        },
  
    }
  }


  entity = {
    "active": {
      "fields": [
        {
          "name": "content",
          "short": "String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.",
          "type": "`$STRING`"
        },
        {
          "name": "createTargetIfMissing",
          "short": "Create the target (heading path, block id, or frontmatter key) if it does not already exist.",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "destination",
          "req": true,
          "short": "For a heading move (operation `replace`, scope `parent`): where the section is re-parented.",
          "type": "`$OBJECT`",
          "union": {
            "branches": 3,
            "count": 1,
            "depth": 2
          }
        },
        {
          "name": "ifMatch",
          "short": "Optimistic-concurrency token (the `version` from a prior document map).",
          "type": "`$STRING`"
        },
        {
          "name": "operation",
          "req": true,
          "short": "What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.",
          "type": "`$STRING`"
        },
        {
          "name": "rejectIfContentPreexists",
          "short": "Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry).",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "scope",
          "short": "Which part of the target the operation acts on (default `content`).",
          "type": "`$STRING`"
        },
        {
          "name": "target",
          "req": true,
          "short": "The node to edit.",
          "type": "`$ANY`",
          "union": {
            "branches": 2,
            "count": 1,
            "depth": 0
          }
        },
        {
          "name": "targetType",
          "req": true,
          "short": "The kind of node to edit.",
          "type": "`$STRING`"
        },
        {
          "name": "value",
          "short": "Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a…",
          "type": "`$ANY`"
        },
        {
          "name": "within",
          "short": "Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last).",
          "type": "`$INTEGER`"
        }
      ],
      "name": "active",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "args": {
                "header": [
                  {
                    "example": "false",
                    "kind": "header",
                    "name": "create_target_if_missing",
                    "orig": "create_target_if_missing",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "2",
                    "kind": "header",
                    "name": "markdown_patch_version",
                    "orig": "markdown_patch_version",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "false",
                    "kind": "header",
                    "name": "reject_if_content_preexist",
                    "orig": "reject_if_content_preexist",
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "POST",
              "orig": "/active/",
              "segments": [
                {
                  "lit": "active"
                }
              ],
              "select": {
                "exist": [
                  "create_target_if_missing",
                  "markdown_patch_version",
                  "reject_if_content_preexist"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "active"
              ]
            }
          ]
        },
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "args": {
                "header": [
                  {
                    "example": "2",
                    "kind": "header",
                    "name": "markdown_patch_version",
                    "orig": "markdown_patch_version",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "content",
                    "kind": "header",
                    "name": "target_scope",
                    "orig": "target_scope",
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "GET",
              "orig": "/active/",
              "segments": [
                {
                  "lit": "active"
                }
              ],
              "select": {
                "exist": [
                  "markdown_patch_version",
                  "target_scope"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "active"
              ]
            }
          ]
        },
        "patch": {
          "input": "data",
          "name": "patch",
          "points": [
            {
              "args": {
                "header": [
                  {
                    "example": "false",
                    "kind": "header",
                    "name": "create_target_if_missing",
                    "orig": "create_target_if_missing",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "destination",
                    "orig": "destination",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "if_match",
                    "orig": "if_match",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "2",
                    "kind": "header",
                    "name": "markdown_patch_version",
                    "orig": "markdown_patch_version",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "operation",
                    "orig": "operation",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "false",
                    "kind": "header",
                    "name": "reject_if_content_preexist",
                    "orig": "reject_if_content_preexist",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "target",
                    "orig": "target",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "content",
                    "kind": "header",
                    "name": "target_scope",
                    "orig": "target_scope",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "target_type",
                    "orig": "target_type",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "within",
                    "orig": "within",
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "PATCH",
              "orig": "/active/",
              "segments": [
                {
                  "lit": "active"
                }
              ],
              "select": {
                "exist": [
                  "create_target_if_missing",
                  "destination",
                  "if_match",
                  "markdown_patch_version",
                  "operation",
                  "reject_if_content_preexist",
                  "target",
                  "target_scope",
                  "target_type",
                  "within"
                ]
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
                  "within": "`reqdata.within`"
                },
                "res": "`body`"
              },
              "parts": [
                "active"
              ]
            }
          ]
        },
        "remove": {
          "input": "data",
          "name": "remove",
          "points": [
            {
              "args": {
                "query": [
                  {
                    "example": "false",
                    "kind": "query",
                    "name": "permanent",
                    "orig": "permanent",
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "DELETE",
              "orig": "/active/",
              "segments": [
                {
                  "lit": "active"
                }
              ],
              "select": {
                "exist": [
                  "permanent"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "active"
              ]
            }
          ]
        },
        "update": {
          "input": "data",
          "name": "update",
          "points": [
            {
              "args": {
                "header": [
                  {
                    "example": "2",
                    "kind": "header",
                    "name": "markdown_patch_version",
                    "orig": "markdown_patch_version",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "false",
                    "kind": "header",
                    "name": "reject_if_content_preexist",
                    "orig": "reject_if_content_preexist",
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "PUT",
              "orig": "/active/",
              "segments": [
                {
                  "lit": "active"
                }
              ],
              "select": {
                "exist": [
                  "markdown_patch_version",
                  "reject_if_content_preexist"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "active"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "command": {
      "fields": [
        {
          "name": "id",
          "type": "`$STRING`"
        },
        {
          "name": "name",
          "type": "`$STRING`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "command",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "args": {
                "params": [
                  {
                    "kind": "param",
                    "name": "id",
                    "orig": "command_id",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "POST",
              "orig": "/commands/{commandId}/",
              "rename": {
                "param": {
                  "commandId": "id"
                }
              },
              "segments": [
                {
                  "lit": "commands"
                },
                {
                  "var": "id"
                }
              ],
              "select": {
                "exist": [
                  "id"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "commands",
                "{id}"
              ]
            }
          ]
        },
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "args": {},
              "kind": "http",
              "method": "GET",
              "orig": "/commands/",
              "segments": [
                {
                  "lit": "commands"
                }
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.commands`"
              },
              "parts": [
                "commands"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "entity1": {
      "fields": [
        {
          "name": "obsidian",
          "short": "Obsidian plugin API version",
          "type": "`$STRING`"
        },
        {
          "name": "self",
          "short": "Plugin version.",
          "type": "`$STRING`"
        }
      ],
      "name": "entity1",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "args": {},
              "kind": "http",
              "method": "GET",
              "orig": "/",
              "segments": [],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.versions`"
              },
              "parts": []
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "mcp": {
      "fields": [
        {
          "name": "id",
          "short": "Request identifier.",
          "type": "`$STRING`",
          "union": {
            "branches": 2,
            "count": 1,
            "depth": 0
          }
        },
        {
          "name": "jsonrpc",
          "req": true,
          "short": "JSON-RPC version.",
          "type": "`$STRING`"
        },
        {
          "name": "method",
          "req": true,
          "short": "MCP method to invoke.",
          "type": "`$STRING`"
        },
        {
          "name": "params",
          "short": "Method-specific parameters.",
          "type": "`$OBJECT`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "mcp",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "args": {
                "header": [
                  {
                    "kind": "header",
                    "name": "mcp_protocol_version",
                    "orig": "mcp_protocol_version",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "mcp_session_id",
                    "orig": "mcp_session_id",
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "POST",
              "orig": "/mcp/",
              "segments": [
                {
                  "lit": "mcp"
                }
              ],
              "select": {
                "exist": [
                  "mcp_protocol_version",
                  "mcp_session_id"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "mcp"
              ]
            }
          ]
        },
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "args": {
                "header": [
                  {
                    "kind": "header",
                    "name": "mcp_protocol_version",
                    "orig": "mcp_protocol_version",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "mcp_session_id",
                    "orig": "mcp_session_id",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "GET",
              "orig": "/mcp/",
              "segments": [
                {
                  "lit": "mcp"
                }
              ],
              "select": {
                "exist": [
                  "mcp_protocol_version",
                  "mcp_session_id"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "mcp"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "open": {
      "fields": [
        {
          "name": "id",
          "type": "`$STRING`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "open",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "args": {
                "params": [
                  {
                    "kind": "param",
                    "name": "id",
                    "orig": "filename",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ],
                "query": [
                  {
                    "kind": "query",
                    "name": "new_leaf",
                    "orig": "new_leaf",
                    "type": "`$BOOLEAN`"
                  }
                ]
              },
              "kind": "http",
              "method": "POST",
              "orig": "/open/{filename}",
              "rename": {
                "param": {
                  "filename": "id"
                }
              },
              "segments": [
                {
                  "lit": "open"
                },
                {
                  "var": "id"
                }
              ],
              "select": {
                "exist": [
                  "id",
                  "new_leaf"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "open",
                "{id}"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
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
              "args": {
                "query": [
                  {
                    "example": 100,
                    "kind": "query",
                    "name": "context_length",
                    "orig": "context_length",
                    "type": "`$NUMBER`"
                  },
                  {
                    "kind": "query",
                    "name": "query",
                    "orig": "query",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "POST",
              "orig": "/search/simple/",
              "segments": [
                {
                  "lit": "search"
                },
                {
                  "lit": "simple"
                }
              ],
              "select": {
                "$action": "simple",
                "exist": [
                  "context_length",
                  "query"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "search",
                "simple"
              ]
            },
            {
              "args": {},
              "kind": "http",
              "method": "POST",
              "orig": "/search/",
              "segments": [
                {
                  "lit": "search"
                }
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "search"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
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
              "args": {},
              "kind": "http",
              "method": "GET",
              "orig": "/obsidian-local-rest-api.crt",
              "segments": [
                {
                  "lit": "obsidian-local-rest-api.crt"
                }
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "obsidian-local-rest-api.crt"
              ]
            },
            {
              "args": {},
              "kind": "http",
              "method": "GET",
              "orig": "/openapi.yaml",
              "segments": [
                {
                  "lit": "openapi.yaml"
                }
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "openapi.yaml"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "tag": {
      "fields": [
        {
          "name": "count",
          "short": "Number of times this tag is used across the vault.",
          "type": "`$NUMBER`"
        },
        {
          "name": "name",
          "short": "Tag name without the leading `#`.",
          "type": "`$STRING`"
        }
      ],
      "name": "tag",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "args": {},
              "kind": "http",
              "method": "GET",
              "orig": "/tags/",
              "segments": [
                {
                  "lit": "tags"
                }
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.tags`"
              },
              "parts": [
                "tags"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "vault": {
      "fields": [
        {
          "name": "content",
          "short": "String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.",
          "type": "`$STRING`"
        },
        {
          "name": "createTargetIfMissing",
          "short": "Create the target (heading path, block id, or frontmatter key) if it does not already exist.",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "destination",
          "req": true,
          "short": "For a heading move (operation `replace`, scope `parent`): where the section is re-parented.",
          "type": "`$OBJECT`",
          "union": {
            "branches": 3,
            "count": 1,
            "depth": 2
          }
        },
        {
          "name": "files",
          "type": "`$ARRAY`"
        },
        {
          "name": "id",
          "type": "`$STRING`"
        },
        {
          "name": "ifMatch",
          "short": "Optimistic-concurrency token (the `version` from a prior document map).",
          "type": "`$STRING`"
        },
        {
          "name": "operation",
          "req": true,
          "short": "What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.",
          "type": "`$STRING`"
        },
        {
          "name": "rejectIfContentPreexists",
          "short": "Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry).",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "scope",
          "short": "Which part of the target the operation acts on (default `content`).",
          "type": "`$STRING`"
        },
        {
          "name": "target",
          "req": true,
          "short": "The node to edit.",
          "type": "`$ANY`",
          "union": {
            "branches": 2,
            "count": 1,
            "depth": 0
          }
        },
        {
          "name": "targetType",
          "req": true,
          "short": "The kind of node to edit.",
          "type": "`$STRING`"
        },
        {
          "name": "value",
          "short": "Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a…",
          "type": "`$ANY`"
        },
        {
          "name": "within",
          "short": "Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last).",
          "type": "`$INTEGER`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "vault",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "args": {
                "header": [
                  {
                    "example": "false",
                    "kind": "header",
                    "name": "create_target_if_missing",
                    "orig": "create_target_if_missing",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "2",
                    "kind": "header",
                    "name": "markdown_patch_version",
                    "orig": "markdown_patch_version",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "false",
                    "kind": "header",
                    "name": "reject_if_content_preexist",
                    "orig": "reject_if_content_preexist",
                    "type": "`$STRING`"
                  }
                ],
                "params": [
                  {
                    "kind": "param",
                    "name": "id",
                    "orig": "filename",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "POST",
              "orig": "/vault/{filename}",
              "rename": {
                "param": {
                  "filename": "id"
                }
              },
              "segments": [
                {
                  "lit": "vault"
                },
                {
                  "var": "id"
                }
              ],
              "select": {
                "exist": [
                  "create_target_if_missing",
                  "id",
                  "markdown_patch_version",
                  "reject_if_content_preexist"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "vault",
                "{id}"
              ]
            }
          ]
        },
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "args": {},
              "kind": "http",
              "method": "GET",
              "orig": "/vault/",
              "segments": [
                {
                  "lit": "vault"
                }
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.files`"
              },
              "parts": [
                "vault"
              ]
            }
          ]
        },
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "args": {
                "header": [
                  {
                    "example": "2",
                    "kind": "header",
                    "name": "markdown_patch_version",
                    "orig": "markdown_patch_version",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "content",
                    "kind": "header",
                    "name": "target_scope",
                    "orig": "target_scope",
                    "type": "`$STRING`"
                  }
                ],
                "params": [
                  {
                    "kind": "param",
                    "name": "id",
                    "orig": "filename",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "GET",
              "orig": "/vault/{filename}",
              "rename": {
                "param": {
                  "filename": "id"
                }
              },
              "segments": [
                {
                  "lit": "vault"
                },
                {
                  "var": "id"
                }
              ],
              "select": {
                "exist": [
                  "id",
                  "markdown_patch_version",
                  "target_scope"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "vault",
                "{id}"
              ]
            },
            {
              "args": {
                "params": [
                  {
                    "kind": "param",
                    "name": "id",
                    "orig": "path_to_directory",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "GET",
              "orig": "/vault/{pathToDirectory}/",
              "rename": {
                "param": {
                  "pathToDirectory": "id"
                }
              },
              "segments": [
                {
                  "lit": "vault"
                },
                {
                  "var": "id"
                }
              ],
              "select": {
                "exist": [
                  "id"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "vault",
                "{id}"
              ]
            }
          ]
        },
        "patch": {
          "input": "data",
          "name": "patch",
          "points": [
            {
              "args": {
                "header": [
                  {
                    "example": "false",
                    "kind": "header",
                    "name": "create_target_if_missing",
                    "orig": "create_target_if_missing",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "destination",
                    "orig": "destination",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "if_match",
                    "orig": "if_match",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "2",
                    "kind": "header",
                    "name": "markdown_patch_version",
                    "orig": "markdown_patch_version",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "operation",
                    "orig": "operation",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "false",
                    "kind": "header",
                    "name": "reject_if_content_preexist",
                    "orig": "reject_if_content_preexist",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "target",
                    "orig": "target",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "content",
                    "kind": "header",
                    "name": "target_scope",
                    "orig": "target_scope",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "target_type",
                    "orig": "target_type",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "header",
                    "name": "within",
                    "orig": "within",
                    "type": "`$STRING`"
                  }
                ],
                "params": [
                  {
                    "kind": "param",
                    "name": "id",
                    "orig": "filename",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "PATCH",
              "orig": "/vault/{filename}",
              "rename": {
                "param": {
                  "filename": "id"
                }
              },
              "segments": [
                {
                  "lit": "vault"
                },
                {
                  "var": "id"
                }
              ],
              "select": {
                "exist": [
                  "create_target_if_missing",
                  "destination",
                  "id",
                  "if_match",
                  "markdown_patch_version",
                  "operation",
                  "reject_if_content_preexist",
                  "target",
                  "target_scope",
                  "target_type",
                  "within"
                ]
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
                  "within": "`reqdata.within`"
                },
                "res": "`body`"
              },
              "parts": [
                "vault",
                "{id}"
              ]
            }
          ]
        },
        "remove": {
          "input": "data",
          "name": "remove",
          "points": [
            {
              "args": {
                "params": [
                  {
                    "kind": "param",
                    "name": "id",
                    "orig": "filename",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ],
                "query": [
                  {
                    "example": "false",
                    "kind": "query",
                    "name": "permanent",
                    "orig": "permanent",
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "DELETE",
              "orig": "/vault/{filename}",
              "rename": {
                "param": {
                  "filename": "id"
                }
              },
              "segments": [
                {
                  "lit": "vault"
                },
                {
                  "var": "id"
                }
              ],
              "select": {
                "exist": [
                  "id",
                  "permanent"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "vault",
                "{id}"
              ]
            }
          ]
        },
        "update": {
          "input": "data",
          "name": "update",
          "points": [
            {
              "args": {
                "header": [
                  {
                    "example": "2",
                    "kind": "header",
                    "name": "markdown_patch_version",
                    "orig": "markdown_patch_version",
                    "type": "`$STRING`"
                  },
                  {
                    "example": "false",
                    "kind": "header",
                    "name": "reject_if_content_preexist",
                    "orig": "reject_if_content_preexist",
                    "type": "`$STRING`"
                  }
                ],
                "params": [
                  {
                    "kind": "param",
                    "name": "id",
                    "orig": "filename",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "PUT",
              "orig": "/vault/{filename}",
              "rename": {
                "param": {
                  "filename": "id"
                }
              },
              "segments": [
                {
                  "lit": "vault"
                },
                {
                  "var": "id"
                }
              ],
              "select": {
                "exist": [
                  "id",
                  "markdown_patch_version",
                  "reject_if_content_preexist"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "vault",
                "{id}"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

