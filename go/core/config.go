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
						"title": "Content",
						"type": "`$STRING`",
						"short": "String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.",
					},
					map[string]any{
						"name": "createTargetIfMissing",
						"title": "Create Target If Missing",
						"type": "`$BOOLEAN`",
						"short": "Create the target (heading path, block id, or frontmatter key) if it does not already exist.",
					},
					map[string]any{
						"name": "destination",
						"title": "Destination",
						"type": "`$OBJECT`",
						"req": true,
						"short": "For a heading move (operation `replace`, scope `parent`): where the section is re-parented.",
					},
					map[string]any{
						"name": "ifMatch",
						"title": "If Match",
						"type": "`$STRING`",
						"short": "Optimistic-concurrency token (the `version` from a prior document map).",
					},
					map[string]any{
						"name": "operation",
						"title": "Operation",
						"type": "`$STRING`",
						"req": true,
						"short": "What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.",
					},
					map[string]any{
						"name": "rejectIfContentPreexists",
						"title": "Reject If Content Preexists",
						"type": "`$BOOLEAN`",
						"short": "Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry).",
					},
					map[string]any{
						"name": "scope",
						"title": "Scope",
						"type": "`$STRING`",
						"short": "Which part of the target the operation acts on (default `content`).",
					},
					map[string]any{
						"name": "target",
						"title": "Target",
						"type": "`$ANY`",
						"req": true,
						"short": "The node to edit.",
					},
					map[string]any{
						"name": "targetType",
						"title": "Target Type",
						"type": "`$STRING`",
						"req": true,
						"short": "The kind of node to edit.",
					},
					map[string]any{
						"name": "value",
						"title": "Value",
						"type": "`$ANY`",
						"short": "Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a…",
					},
					map[string]any{
						"name": "within",
						"title": "Within",
						"type": "`$INTEGER`",
						"short": "Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last).",
					},
				},
				"name": "active",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/active/",
								"segments": []any{
									map[string]any{
										"lit": "active",
									},
								},
								"parts": []any{
									"active",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"name": "create_target_if_missing",
											"orig": "create_target_if_missing",
											"type": "`$STRING`",
											"kind": "header",
											"example": "false",
										},
										map[string]any{
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
											"kind": "header",
											"example": "2",
										},
										map[string]any{
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
											"kind": "header",
											"example": "false",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"create_target_if_missing",
										"markdown_patch_version",
										"reject_if_content_preexist",
									},
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/active/",
								"segments": []any{
									map[string]any{
										"lit": "active",
									},
								},
								"parts": []any{
									"active",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
											"kind": "header",
											"example": "2",
										},
										map[string]any{
											"name": "target_scope",
											"orig": "target_scope",
											"type": "`$STRING`",
											"kind": "header",
											"example": "content",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"markdown_patch_version",
										"target_scope",
									},
								},
							},
						},
					},
					"patch": map[string]any{
						"input": "data",
						"name": "patch",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "PATCH",
								"orig": "/active/",
								"segments": []any{
									map[string]any{
										"lit": "active",
									},
								},
								"parts": []any{
									"active",
								},
								"rename": map[string]any{},
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
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"name": "create_target_if_missing",
											"orig": "create_target_if_missing",
											"type": "`$STRING`",
											"kind": "header",
											"example": "false",
										},
										map[string]any{
											"name": "destination",
											"orig": "destination",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "if_match",
											"orig": "if_match",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
											"kind": "header",
											"example": "2",
										},
										map[string]any{
											"name": "operation",
											"orig": "operation",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
											"kind": "header",
											"example": "false",
										},
										map[string]any{
											"name": "target",
											"orig": "target",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "target_scope",
											"orig": "target_scope",
											"type": "`$STRING`",
											"kind": "header",
											"example": "content",
										},
										map[string]any{
											"name": "target_type",
											"orig": "target_type",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "within",
											"orig": "within",
											"type": "`$STRING`",
											"kind": "header",
										},
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
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "DELETE",
								"orig": "/active/",
								"segments": []any{
									map[string]any{
										"lit": "active",
									},
								},
								"parts": []any{
									"active",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "permanent",
											"orig": "permanent",
											"type": "`$STRING`",
											"kind": "query",
											"example": "false",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"permanent",
									},
								},
							},
						},
					},
					"update": map[string]any{
						"input": "data",
						"name": "update",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "PUT",
								"orig": "/active/",
								"segments": []any{
									map[string]any{
										"lit": "active",
									},
								},
								"parts": []any{
									"active",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
											"kind": "header",
											"example": "2",
										},
										map[string]any{
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
											"kind": "header",
											"example": "false",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"markdown_patch_version",
										"reject_if_content_preexist",
									},
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
						"title": "Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
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
								"kind": "http",
								"method": "POST",
								"orig": "/commands/{commandId}/",
								"segments": []any{
									map[string]any{
										"lit": "commands",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"commands",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"commandId": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "command_id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/commands/",
								"segments": []any{
									map[string]any{
										"lit": "commands",
									},
								},
								"parts": []any{
									"commands",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.commands`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
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
						"title": "Obsidian",
						"type": "`$STRING`",
						"short": "Obsidian plugin API version",
					},
					map[string]any{
						"name": "self",
						"title": "Self",
						"type": "`$STRING`",
						"short": "Plugin version.",
					},
				},
				"name": "entity1",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/",
								"segments": []any{},
								"parts": []any{},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.versions`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
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
						"title": "Id",
						"type": "`$STRING`",
						"short": "Request identifier.",
					},
					map[string]any{
						"name": "jsonrpc",
						"title": "Jsonrpc",
						"type": "`$STRING`",
						"req": true,
						"short": "JSON-RPC version.",
					},
					map[string]any{
						"name": "method",
						"title": "Method",
						"type": "`$STRING`",
						"req": true,
						"short": "MCP method to invoke.",
					},
					map[string]any{
						"name": "params",
						"title": "Params",
						"type": "`$OBJECT`",
						"short": "Method-specific parameters.",
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
								"kind": "http",
								"method": "POST",
								"orig": "/mcp/",
								"segments": []any{
									map[string]any{
										"lit": "mcp",
									},
								},
								"parts": []any{
									"mcp",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"name": "mcp_protocol_version",
											"orig": "mcp_protocol_version",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "mcp_session_id",
											"orig": "mcp_session_id",
											"type": "`$STRING`",
											"kind": "header",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"mcp_protocol_version",
										"mcp_session_id",
									},
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/mcp/",
								"segments": []any{
									map[string]any{
										"lit": "mcp",
									},
								},
								"parts": []any{
									"mcp",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"name": "mcp_protocol_version",
											"orig": "mcp_protocol_version",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "mcp_session_id",
											"orig": "mcp_session_id",
											"type": "`$STRING`",
											"kind": "header",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"mcp_protocol_version",
										"mcp_session_id",
									},
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
						"title": "Id",
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
								"kind": "http",
								"method": "POST",
								"orig": "/open/{filename}",
								"segments": []any{
									map[string]any{
										"lit": "open",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"open",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "filename",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
									"query": []any{
										map[string]any{
											"name": "new_leaf",
											"orig": "new_leaf",
											"type": "`$BOOLEAN`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
										"new_leaf",
									},
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
								"parts": []any{
									"search",
									"simple",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "context_length",
											"orig": "context_length",
											"type": "`$NUMBER`",
											"kind": "query",
											"example": 100,
										},
										map[string]any{
											"name": "query",
											"orig": "query",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"$action": "simple",
									"exist": []any{
										"context_length",
										"query",
									},
								},
							},
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/search/",
								"segments": []any{
									map[string]any{
										"lit": "search",
									},
								},
								"parts": []any{
									"search",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
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
								"kind": "http",
								"method": "GET",
								"orig": "/obsidian-local-rest-api.crt",
								"segments": []any{
									map[string]any{
										"lit": "obsidian-local-rest-api.crt",
									},
								},
								"parts": []any{
									"obsidian-local-rest-api.crt",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/openapi.yaml",
								"segments": []any{
									map[string]any{
										"lit": "openapi.yaml",
									},
								},
								"parts": []any{
									"openapi.yaml",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
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
						"title": "Count",
						"type": "`$NUMBER`",
						"short": "Number of times this tag is used across the vault.",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
						"short": "Tag name without the leading `#`.",
					},
				},
				"name": "tag",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/tags/",
								"segments": []any{
									map[string]any{
										"lit": "tags",
									},
								},
								"parts": []any{
									"tags",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.tags`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
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
						"title": "Content",
						"type": "`$STRING`",
						"short": "String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.",
					},
					map[string]any{
						"name": "createTargetIfMissing",
						"title": "Create Target If Missing",
						"type": "`$BOOLEAN`",
						"short": "Create the target (heading path, block id, or frontmatter key) if it does not already exist.",
					},
					map[string]any{
						"name": "destination",
						"title": "Destination",
						"type": "`$OBJECT`",
						"req": true,
						"short": "For a heading move (operation `replace`, scope `parent`): where the section is re-parented.",
					},
					map[string]any{
						"name": "files",
						"title": "Files",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "ifMatch",
						"title": "If Match",
						"type": "`$STRING`",
						"short": "Optimistic-concurrency token (the `version` from a prior document map).",
					},
					map[string]any{
						"name": "operation",
						"title": "Operation",
						"type": "`$STRING`",
						"req": true,
						"short": "What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.",
					},
					map[string]any{
						"name": "rejectIfContentPreexists",
						"title": "Reject If Content Preexists",
						"type": "`$BOOLEAN`",
						"short": "Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry).",
					},
					map[string]any{
						"name": "scope",
						"title": "Scope",
						"type": "`$STRING`",
						"short": "Which part of the target the operation acts on (default `content`).",
					},
					map[string]any{
						"name": "target",
						"title": "Target",
						"type": "`$ANY`",
						"req": true,
						"short": "The node to edit.",
					},
					map[string]any{
						"name": "targetType",
						"title": "Target Type",
						"type": "`$STRING`",
						"req": true,
						"short": "The kind of node to edit.",
					},
					map[string]any{
						"name": "value",
						"title": "Value",
						"type": "`$ANY`",
						"short": "Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a…",
					},
					map[string]any{
						"name": "within",
						"title": "Within",
						"type": "`$INTEGER`",
						"short": "Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last).",
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
								"kind": "http",
								"method": "POST",
								"orig": "/vault/{filename}",
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"vault",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"name": "create_target_if_missing",
											"orig": "create_target_if_missing",
											"type": "`$STRING`",
											"kind": "header",
											"example": "false",
										},
										map[string]any{
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
											"kind": "header",
											"example": "2",
										},
										map[string]any{
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
											"kind": "header",
											"example": "false",
										},
									},
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "filename",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
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
							},
						},
					},
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/vault/",
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
								},
								"parts": []any{
									"vault",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.files`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/vault/{filename}",
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"vault",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
											"kind": "header",
											"example": "2",
										},
										map[string]any{
											"name": "target_scope",
											"orig": "target_scope",
											"type": "`$STRING`",
											"kind": "header",
											"example": "content",
										},
									},
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "filename",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
										"markdown_patch_version",
										"target_scope",
									},
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/vault/{pathToDirectory}/",
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"vault",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"pathToDirectory": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "path_to_directory",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
					"patch": map[string]any{
						"input": "data",
						"name": "patch",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "PATCH",
								"orig": "/vault/{filename}",
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"vault",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
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
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"name": "create_target_if_missing",
											"orig": "create_target_if_missing",
											"type": "`$STRING`",
											"kind": "header",
											"example": "false",
										},
										map[string]any{
											"name": "destination",
											"orig": "destination",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "if_match",
											"orig": "if_match",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
											"kind": "header",
											"example": "2",
										},
										map[string]any{
											"name": "operation",
											"orig": "operation",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
											"kind": "header",
											"example": "false",
										},
										map[string]any{
											"name": "target",
											"orig": "target",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "target_scope",
											"orig": "target_scope",
											"type": "`$STRING`",
											"kind": "header",
											"example": "content",
										},
										map[string]any{
											"name": "target_type",
											"orig": "target_type",
											"type": "`$STRING`",
											"kind": "header",
										},
										map[string]any{
											"name": "within",
											"orig": "within",
											"type": "`$STRING`",
											"kind": "header",
										},
									},
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "filename",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
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
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "DELETE",
								"orig": "/vault/{filename}",
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"vault",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "filename",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
									"query": []any{
										map[string]any{
											"name": "permanent",
											"orig": "permanent",
											"type": "`$STRING`",
											"kind": "query",
											"example": "false",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
										"permanent",
									},
								},
							},
						},
					},
					"update": map[string]any{
						"input": "data",
						"name": "update",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "PUT",
								"orig": "/vault/{filename}",
								"segments": []any{
									map[string]any{
										"lit": "vault",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"vault",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"filename": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"header": []any{
										map[string]any{
											"name": "markdown_patch_version",
											"orig": "markdown_patch_version",
											"type": "`$STRING`",
											"kind": "header",
											"example": "2",
										},
										map[string]any{
											"name": "reject_if_content_preexist",
											"orig": "reject_if_content_preexist",
											"type": "`$STRING`",
											"kind": "header",
											"example": "false",
										},
									},
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "filename",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
										"markdown_patch_version",
										"reject_if_content_preexist",
									},
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
