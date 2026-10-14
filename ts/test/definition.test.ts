import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "active",
    "accessor": "Active",
    "op": "create",
    "method": "POST",
    "path": "/active/",
    "args": [],
    "select": {},
    "headers": [
      {
        "name": "create_target_if_missing",
        "wire": "Create-Target-If-Missing",
        "value": "false"
      },
      {
        "name": "markdown_patch_version",
        "wire": "Markdown-Patch-Version",
        "value": "2"
      },
      {
        "name": "reject_if_content_preexist",
        "wire": "Reject-If-Content-Preexists",
        "value": "false"
      }
    ],
    "cookies": [],
    "responseMedia": [
      "text/markdown"
    ],
    "rawBody": {
      "media": [
        "text/markdown"
      ],
      "text": true
    },
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "active",
    "accessor": "Active",
    "op": "load",
    "method": "GET",
    "path": "/active/",
    "args": [],
    "select": {},
    "headers": [
      {
        "name": "markdown_patch_version",
        "wire": "Markdown-Patch-Version",
        "value": "2"
      },
      {
        "name": "target_scope",
        "wire": "Target-Scope",
        "value": "content"
      }
    ],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "application/vnd.olrapi.document-map+json",
      "application/vnd.olrapi.note+json",
      "text/html",
      "text/markdown"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "active",
    "accessor": "Active",
    "op": "patch",
    "method": "PATCH",
    "path": "/active/",
    "args": [],
    "select": {},
    "headers": [
      {
        "name": "create_target_if_missing",
        "wire": "Create-Target-If-Missing",
        "value": "false"
      },
      {
        "name": "destination",
        "wire": "Destination",
        "value": "h2"
      },
      {
        "name": "if_match",
        "wire": "If-Match",
        "value": "h3"
      },
      {
        "name": "markdown_patch_version",
        "wire": "Markdown-Patch-Version",
        "value": "2"
      },
      {
        "name": "operation",
        "wire": "Operation",
        "value": "h5"
      },
      {
        "name": "reject_if_content_preexist",
        "wire": "Reject-If-Content-Preexists",
        "value": "false"
      },
      {
        "name": "target",
        "wire": "Target",
        "value": "h7"
      },
      {
        "name": "target_scope",
        "wire": "Target-Scope",
        "value": "content"
      },
      {
        "name": "target_type",
        "wire": "Target-Type",
        "value": "h9"
      },
      {
        "name": "within",
        "wire": "Within",
        "value": "h10"
      }
    ],
    "cookies": [],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "active",
    "accessor": "Active",
    "op": "remove",
    "method": "DELETE",
    "path": "/active/",
    "args": [],
    "select": {
      "permanent": "false"
    },
    "headers": [],
    "cookies": [],
    "query": [
      "permanent"
    ],
    "queryArgs": [
      {
        "name": "permanent",
        "wire": "permanent"
      }
    ],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 204,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "active",
    "accessor": "Active",
    "op": "update",
    "method": "PUT",
    "path": "/active/",
    "args": [],
    "select": {},
    "headers": [
      {
        "name": "markdown_patch_version",
        "wire": "Markdown-Patch-Version",
        "value": "2"
      },
      {
        "name": "reject_if_content_preexist",
        "wire": "Reject-If-Content-Preexists",
        "value": "false"
      }
    ],
    "cookies": [],
    "responseMedia": [
      "text/markdown"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "command",
    "accessor": "Command",
    "op": "create",
    "method": "POST",
    "path": "/commands/{commandId}/",
    "args": [
      {
        "name": "id",
        "wire": "commandId",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 204,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "command",
    "accessor": "Command",
    "op": "list",
    "method": "GET",
    "path": "/commands/",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "commands": [
        {
          "id": "global-search:open",
          "name": "Search: Search in all files"
        },
        {
          "id": "graph:open",
          "name": "Graph view: Open graph view"
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "entity1",
    "accessor": "Entity1",
    "op": "load",
    "method": "GET",
    "path": "/",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "authenticated": true,
      "ok": "x",
      "service": "x",
      "versions": {
        "obsidian": "x",
        "self": "x"
      }
    },
    "idField": "id"
  },
  {
    "entity": "mcp",
    "accessor": "Mcp",
    "op": "create",
    "method": "POST",
    "path": "/mcp/",
    "args": [],
    "select": {},
    "headers": [
      {
        "name": "mcp_protocol_version",
        "wire": "MCP-Protocol-Version",
        "value": "h1"
      },
      {
        "name": "mcp_session_id",
        "wire": "Mcp-Session-Id",
        "value": "h2"
      }
    ],
    "cookies": [],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "mcp",
    "accessor": "Mcp",
    "op": "load",
    "method": "GET",
    "path": "/mcp/",
    "args": [],
    "select": {},
    "headers": [
      {
        "name": "mcp_protocol_version",
        "wire": "MCP-Protocol-Version",
        "value": "h1"
      },
      {
        "name": "mcp_session_id",
        "wire": "Mcp-Session-Id",
        "value": "h2"
      }
    ],
    "cookies": [],
    "responseMedia": [
      "text/event-stream"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "open",
    "accessor": "Open",
    "op": "create",
    "method": "POST",
    "path": "/open/{filename}",
    "args": [
      {
        "name": "id",
        "wire": "filename",
        "value": "p1"
      }
    ],
    "select": {
      "new_leaf": "v1"
    },
    "headers": [],
    "cookies": [],
    "query": [
      "newLeaf"
    ],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "search",
    "accessor": "Search",
    "op": "create",
    "method": "POST",
    "path": "/search/simple/",
    "action": "simple",
    "args": [],
    "select": {
      "query": "v1",
      "context_length": 100
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "query",
      "contextLength"
    ],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": [
      {
        "filename": "x",
        "matches": [
          {
            "context": "x",
            "match": {
              "end": 1,
              "start": 1
            }
          }
        ],
        "score": 1
      }
    ],
    "idField": "id"
  },
  {
    "entity": "search",
    "accessor": "Search",
    "op": "create",
    "method": "POST",
    "path": "/search/",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": [
      {
        "filename": "x",
        "result": "x"
      }
    ],
    "idField": "id"
  },
  {
    "entity": "tag",
    "accessor": "Tag",
    "op": "list",
    "method": "GET",
    "path": "/tags/",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "tags": [
        {
          "count": 3,
          "name": "project"
        },
        {
          "count": 1,
          "name": "important"
        },
        {
          "count": 2,
          "name": "work"
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "vault",
    "accessor": "Vault",
    "op": "create",
    "method": "POST",
    "path": "/vault/{filename}",
    "args": [
      {
        "name": "id",
        "wire": "filename",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [
      {
        "name": "create_target_if_missing",
        "wire": "Create-Target-If-Missing",
        "value": "false"
      },
      {
        "name": "markdown_patch_version",
        "wire": "Markdown-Patch-Version",
        "value": "2"
      },
      {
        "name": "reject_if_content_preexist",
        "wire": "Reject-If-Content-Preexists",
        "value": "false"
      }
    ],
    "cookies": [],
    "responseMedia": [
      "text/markdown"
    ],
    "rawBody": {
      "media": [
        "text/markdown"
      ],
      "text": true
    },
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "vault",
    "accessor": "Vault",
    "op": "list",
    "method": "GET",
    "path": "/vault/",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "files": [
        "mydocument.md",
        "somedirectory/"
      ]
    },
    "idField": "id"
  },
  {
    "entity": "vault",
    "accessor": "Vault",
    "op": "patch",
    "method": "PATCH",
    "path": "/vault/{filename}",
    "args": [
      {
        "name": "id",
        "wire": "filename",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [
      {
        "name": "create_target_if_missing",
        "wire": "Create-Target-If-Missing",
        "value": "false"
      },
      {
        "name": "destination",
        "wire": "Destination",
        "value": "h2"
      },
      {
        "name": "if_match",
        "wire": "If-Match",
        "value": "h3"
      },
      {
        "name": "markdown_patch_version",
        "wire": "Markdown-Patch-Version",
        "value": "2"
      },
      {
        "name": "operation",
        "wire": "Operation",
        "value": "h5"
      },
      {
        "name": "reject_if_content_preexist",
        "wire": "Reject-If-Content-Preexists",
        "value": "false"
      },
      {
        "name": "target",
        "wire": "Target",
        "value": "h7"
      },
      {
        "name": "target_scope",
        "wire": "Target-Scope",
        "value": "content"
      },
      {
        "name": "target_type",
        "wire": "Target-Type",
        "value": "h9"
      },
      {
        "name": "within",
        "wire": "Within",
        "value": "h10"
      }
    ],
    "cookies": [],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "vault",
    "accessor": "Vault",
    "op": "remove",
    "method": "DELETE",
    "path": "/vault/{filename}",
    "args": [
      {
        "name": "id",
        "wire": "filename",
        "value": "p1"
      }
    ],
    "select": {
      "permanent": "false"
    },
    "headers": [],
    "cookies": [],
    "query": [
      "permanent"
    ],
    "queryArgs": [
      {
        "name": "permanent",
        "wire": "permanent"
      }
    ],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 204,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "vault",
    "accessor": "Vault",
    "op": "update",
    "method": "PUT",
    "path": "/vault/{filename}",
    "args": [
      {
        "name": "id",
        "wire": "filename",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [
      {
        "name": "markdown_patch_version",
        "wire": "Markdown-Patch-Version",
        "value": "2"
      },
      {
        "name": "reject_if_content_preexist",
        "wire": "Reject-If-Content-Preexists",
        "value": "false"
      }
    ],
    "cookies": [],
    "responseMedia": [
      "text/markdown"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
