package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "Obsidian",
			"slug": "obsidian",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"debug": map[string]any{
				"options": map[string]any{
					"active": false,
					"max": 100,
					"redact": []any{
						"authorization",
						"cookie",
						"set-cookie",
						"api-key",
						"apikey",
						"x-api-key",
						"idempotency-key",
					},
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"onEntry": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"idempotency": map[string]any{
				"options": map[string]any{
					"active": false,
					"header": "Idempotency-Key",
					"methods": []any{
						"POST",
						"PUT",
						"PATCH",
						"DELETE",
					},
					"ops": []any{
						"create",
						"update",
						"remove",
					},
				},
				"optspec": map[string]any{
					"keygen": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"metrics": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"paging": map[string]any{
				"options": map[string]any{
					"active": false,
					"afterVar": "after",
					"cursorParam": "cursor",
					"firstVar": "first",
					"limitParam": "limit",
					"pageParam": "page",
					"startPage": 1,
				},
				"optspec": map[string]any{
					"limit": "`$NUMBER`",
					"ops": "`$LIST`",
				},
				"strict": false,
				"transport": "none",
			},
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "https://{host}:{port}",
			"server": map[string]any{
				"host": "127.0.0.1",
				"port": "27124",
			},
			"auth": map[string]any{
				"prefix": "Bearer",
			},
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"active": map[string]any{},
				"command": map[string]any{},
				"entity1": map[string]any{},
				"mcp": map[string]any{},
				"open": map[string]any{},
				"search": map[string]any{},
				"system": map[string]any{},
				"tag": map[string]any{},
				"vault": map[string]any{},
			},
		},
		"entity": map[string]any{
			"active": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "content",
						"short": "String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "createTargetIfMissing",
						"short": "Create the target (heading path, block id, or frontmatter key) if it does not already exist.",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "destination",
						"req": true,
						"short": "For a heading move (operation `replace`, scope `parent`): where the section is re-parented.",
						"type": "`$OBJECT`",
						"union": map[string]any{
							"branches": 3,
							"count": 1,
							"depth": 2,
						},
					},
					map[string]any{
						"name": "ifMatch",
						"short": "Optimistic-concurrency token (the `version` from a prior document map).",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "operation",
						"req": true,
						"short": "What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "rejectIfContentPreexists",
						"short": "Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry).",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "scope",
						"short": "Which part of the target the operation acts on (default `content`).",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "target",
						"req": true,
						"short": "The node to edit.",
						"type": "`$ANY`",
						"union": map[string]any{
							"branches": 2,
							"count": 1,
							"depth": 0,
						},
					},
					map[string]any{
						"name": "targetType",
						"req": true,
						"short": "The kind of node to edit.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "value",
						"short": "Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a…",
						"type": "`$ANY`",
					},
					map[string]any{
						"name": "within",
						"short": "Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last).",
						"type": "`$INTEGER`",
					},
				},
				"name": "active",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"example": "false",
											"kind": "header",
											"name": "create_target_if_missing",
											"orig": "create_target_if_missing",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "2",
											"kind": "header",
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "false",
											"kind": "header",
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "POST",
								"orig": "/active/",
								"segments": []any{
									map[string]any{
										"lit": "active",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"create_target_if_missing",
										"markdown_patch_version",
										"reject_if_content_preexist",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"active",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"example": "2",
											"kind": "header",
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "content",
											"kind": "header",
											"name": "target_scope",
											"orig": "target_scope",
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "GET",
								"orig": "/active/",
								"segments": []any{
									map[string]any{
										"lit": "active",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"markdown_patch_version",
										"target_scope",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"active",
								},
							},
						},
					},
					"patch": map[string]any{
						"input": "data",
						"name": "patch",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"example": "false",
											"kind": "header",
											"name": "create_target_if_missing",
											"orig": "create_target_if_missing",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "destination",
											"orig": "destination",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "if_match",
											"orig": "if_match",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "2",
											"kind": "header",
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "operation",
											"orig": "operation",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "false",
											"kind": "header",
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "target",
											"orig": "target",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "content",
											"kind": "header",
											"name": "target_scope",
											"orig": "target_scope",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "target_type",
											"orig": "target_type",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "within",
											"orig": "within",
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "PATCH",
								"orig": "/active/",
								"segments": []any{
									map[string]any{
										"lit": "active",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"create_target_if_missing",
										"destination",
										"if_match",
										"markdown_patch_version",
										"operation",
										"reject_if_content_preexist",
										"target",
										"target_scope",
										"target_type",
										"within",
									},
								},
								"transform": map[string]any{
									"req": map[string]any{
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
								"parts": []any{
									"active",
								},
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"example": "false",
											"kind": "query",
											"name": "permanent",
											"orig": "permanent",
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "DELETE",
								"orig": "/active/",
								"segments": []any{
									map[string]any{
										"lit": "active",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"permanent",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"active",
								},
							},
						},
					},
					"update": map[string]any{
						"input": "data",
						"name": "update",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"example": "2",
											"kind": "header",
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "false",
											"kind": "header",
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "PUT",
								"orig": "/active/",
								"segments": []any{
									map[string]any{
										"lit": "active",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"markdown_patch_version",
										"reject_if_content_preexist",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"active",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"command": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "name",
						"type": "`$STRING`",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "command",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "id",
											"orig": "command_id",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "POST",
								"orig": "/commands/{commandId}/",
								"rename": map[string]any{
									"param": map[string]any{
										"commandId": "id",
									},
								},
								"segments": []any{
									map[string]any{
										"lit": "commands",
									},
									map[string]any{
										"var": "id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"commands",
									"{id}",
								},
							},
						},
					},
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "GET",
								"orig": "/commands/",
								"segments": []any{
									map[string]any{
										"lit": "commands",
									},
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.commands`",
								},
								"parts": []any{
									"commands",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"entity1": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "obsidian",
						"short": "Obsidian plugin API version",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "self",
						"short": "Plugin version.",
						"type": "`$STRING`",
					},
				},
				"name": "entity1",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "GET",
								"orig": "/",
								"segments": []any{},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.versions`",
								},
								"parts": []any{},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"mcp": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "id",
						"short": "Request identifier.",
						"type": "`$STRING`",
						"union": map[string]any{
							"branches": 2,
							"count": 1,
							"depth": 0,
						},
					},
					map[string]any{
						"name": "jsonrpc",
						"req": true,
						"short": "JSON-RPC version.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "method",
						"req": true,
						"short": "MCP method to invoke.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "params",
						"short": "Method-specific parameters.",
						"type": "`$OBJECT`",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "mcp",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"kind": "header",
											"name": "mcp_protocol_version",
											"orig": "mcp_protocol_version",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "mcp_session_id",
											"orig": "mcp_session_id",
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "POST",
								"orig": "/mcp/",
								"segments": []any{
									map[string]any{
										"lit": "mcp",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"mcp_protocol_version",
										"mcp_session_id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"mcp",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"kind": "header",
											"name": "mcp_protocol_version",
											"orig": "mcp_protocol_version",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "mcp_session_id",
											"orig": "mcp_session_id",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "GET",
								"orig": "/mcp/",
								"segments": []any{
									map[string]any{
										"lit": "mcp",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"mcp_protocol_version",
										"mcp_session_id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"mcp",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"open": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "id",
						"type": "`$STRING`",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "open",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "id",
											"orig": "filename",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
									"query": []any{
										map[string]any{
											"kind": "query",
											"name": "new_leaf",
											"orig": "new_leaf",
											"type": "`$BOOLEAN`",
										},
									},
								},
								"kind": "http",
								"method": "POST",
								"orig": "/open/{filename}",
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"segments": []any{
									map[string]any{
										"lit": "open",
									},
									map[string]any{
										"var": "id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
										"new_leaf",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"open",
									"{id}",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"search": map[string]any{
				"fields": []any{},
				"name": "search",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"example": 100,
											"kind": "query",
											"name": "context_length",
											"orig": "context_length",
											"type": "`$NUMBER`",
										},
										map[string]any{
											"kind": "query",
											"name": "query",
											"orig": "query",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "POST",
								"orig": "/search/simple/",
								"segments": []any{
									map[string]any{
										"lit": "search",
									},
									map[string]any{
										"lit": "simple",
									},
								},
								"select": map[string]any{
									"$action": "simple",
									"exist": []any{
										"context_length",
										"query",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"search",
									"simple",
								},
							},
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "POST",
								"orig": "/search/",
								"segments": []any{
									map[string]any{
										"lit": "search",
									},
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"search",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"system": map[string]any{
				"fields": []any{},
				"name": "system",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "GET",
								"orig": "/obsidian-local-rest-api.crt",
								"segments": []any{
									map[string]any{
										"lit": "obsidian-local-rest-api.crt",
									},
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"obsidian-local-rest-api.crt",
								},
							},
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "GET",
								"orig": "/openapi.yaml",
								"segments": []any{
									map[string]any{
										"lit": "openapi.yaml",
									},
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"openapi.yaml",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"tag": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "count",
						"short": "Number of times this tag is used across the vault.",
						"type": "`$NUMBER`",
					},
					map[string]any{
						"name": "name",
						"short": "Tag name without the leading `#`.",
						"type": "`$STRING`",
					},
				},
				"name": "tag",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "GET",
								"orig": "/tags/",
								"segments": []any{
									map[string]any{
										"lit": "tags",
									},
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.tags`",
								},
								"parts": []any{
									"tags",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"vault": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "content",
						"short": "String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "createTargetIfMissing",
						"short": "Create the target (heading path, block id, or frontmatter key) if it does not already exist.",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "destination",
						"req": true,
						"short": "For a heading move (operation `replace`, scope `parent`): where the section is re-parented.",
						"type": "`$OBJECT`",
						"union": map[string]any{
							"branches": 3,
							"count": 1,
							"depth": 2,
						},
					},
					map[string]any{
						"name": "files",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "ifMatch",
						"short": "Optimistic-concurrency token (the `version` from a prior document map).",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "operation",
						"req": true,
						"short": "What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "rejectIfContentPreexists",
						"short": "Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry).",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "scope",
						"short": "Which part of the target the operation acts on (default `content`).",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "target",
						"req": true,
						"short": "The node to edit.",
						"type": "`$ANY`",
						"union": map[string]any{
							"branches": 2,
							"count": 1,
							"depth": 0,
						},
					},
					map[string]any{
						"name": "targetType",
						"req": true,
						"short": "The kind of node to edit.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "value",
						"short": "Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a…",
						"type": "`$ANY`",
					},
					map[string]any{
						"name": "within",
						"short": "Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last).",
						"type": "`$INTEGER`",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "vault",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"example": "false",
											"kind": "header",
											"name": "create_target_if_missing",
											"orig": "create_target_if_missing",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "2",
											"kind": "header",
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "false",
											"kind": "header",
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
										},
									},
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "id",
											"orig": "filename",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "POST",
								"orig": "/vault/{filename}",
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"create_target_if_missing",
										"id",
										"markdown_patch_version",
										"reject_if_content_preexist",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"vault",
									"{id}",
								},
							},
						},
					},
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "GET",
								"orig": "/vault/",
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.files`",
								},
								"parts": []any{
									"vault",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"example": "2",
											"kind": "header",
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "content",
											"kind": "header",
											"name": "target_scope",
											"orig": "target_scope",
											"type": "`$STRING`",
										},
									},
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "id",
											"orig": "filename",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "GET",
								"orig": "/vault/{filename}",
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
										"markdown_patch_version",
										"target_scope",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"vault",
									"{id}",
								},
							},
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "id",
											"orig": "path_to_directory",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "GET",
								"orig": "/vault/{pathToDirectory}/",
								"rename": map[string]any{
									"param": map[string]any{
										"pathToDirectory": "id",
									},
								},
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"vault",
									"{id}",
								},
							},
						},
					},
					"patch": map[string]any{
						"input": "data",
						"name": "patch",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"example": "false",
											"kind": "header",
											"name": "create_target_if_missing",
											"orig": "create_target_if_missing",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "destination",
											"orig": "destination",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "if_match",
											"orig": "if_match",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "2",
											"kind": "header",
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "operation",
											"orig": "operation",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "false",
											"kind": "header",
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "target",
											"orig": "target",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "content",
											"kind": "header",
											"name": "target_scope",
											"orig": "target_scope",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "target_type",
											"orig": "target_type",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "header",
											"name": "within",
											"orig": "within",
											"type": "`$STRING`",
										},
									},
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "id",
											"orig": "filename",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "PATCH",
								"orig": "/vault/{filename}",
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"select": map[string]any{
									"exist": []any{
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
										"within",
									},
								},
								"transform": map[string]any{
									"req": map[string]any{
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
								"parts": []any{
									"vault",
									"{id}",
								},
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "id",
											"orig": "filename",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
									"query": []any{
										map[string]any{
											"example": "false",
											"kind": "query",
											"name": "permanent",
											"orig": "permanent",
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "DELETE",
								"orig": "/vault/{filename}",
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
										"permanent",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"vault",
									"{id}",
								},
							},
						},
					},
					"update": map[string]any{
						"input": "data",
						"name": "update",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"example": "2",
											"kind": "header",
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
										},
										map[string]any{
											"example": "false",
											"kind": "header",
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
										},
									},
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "id",
											"orig": "filename",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "PUT",
								"orig": "/vault/{filename}",
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
										"markdown_patch_version",
										"reject_if_content_preexist",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"vault",
									"{id}",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "debug":
		if NewDebugFeatureFunc != nil {
			return NewDebugFeatureFunc()
		}
	case "idempotency":
		if NewIdempotencyFeatureFunc != nil {
			return NewIdempotencyFeatureFunc()
		}
	case "metrics":
		if NewMetricsFeatureFunc != nil {
			return NewMetricsFeatureFunc()
		}
	case "paging":
		if NewPagingFeatureFunc != nil {
			return NewPagingFeatureFunc()
		}
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
