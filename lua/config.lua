-- Obsidian SDK configuration

-- Build a fresh, fully materialised config table. Every call rebuilds the
-- whole structure, so prefer require("config_shared") unless you need a
-- private copy you intend to mutate.
local function make_config()
  return {
    main = {
      name = "Obsidian",
      slug = "obsidian",
      version = "0.0.1",
      target = "lua",
    },
    feature = {
      ["debug"] = {
        ["options"] = {
          ["active"] = false,
          ["max"] = 100,
          ["redact"] = {
            "authorization",
            "cookie",
            "set-cookie",
            "api-key",
            "apikey",
            "x-api-key",
            "idempotency-key",
          },
        },
        ["optspec"] = {
          ["now"] = "`$FUNCTION`",
          ["onEntry"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["idempotency"] = {
        ["options"] = {
          ["active"] = false,
          ["header"] = "Idempotency-Key",
          ["methods"] = {
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
          },
          ["ops"] = {
            "create",
            "update",
            "remove",
          },
        },
        ["optspec"] = {
          ["keygen"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["metrics"] = {
        ["options"] = {
          ["active"] = false,
        },
        ["optspec"] = {
          ["now"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["paging"] = {
        ["options"] = {
          ["active"] = false,
          ["afterVar"] = "after",
          ["cursorParam"] = "cursor",
          ["firstVar"] = "first",
          ["limitParam"] = "limit",
          ["pageParam"] = "page",
          ["startPage"] = 1,
        },
        ["optspec"] = {
          ["limit"] = "`$NUMBER`",
          ["ops"] = "`$LIST`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["ratelimit"] = {
        ["options"] = {
          ["active"] = false,
          ["burst"] = 5,
          ["rate"] = 5,
        },
        ["optspec"] = {
          ["now"] = "`$FUNCTION`",
          ["sleep"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
      ["retry"] = {
        ["options"] = {
          ["active"] = false,
          ["factor"] = 2,
          ["maxDelay"] = 2000,
          ["minDelay"] = 50,
          ["retries"] = 2,
          ["statuses"] = {
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          },
        },
        ["optspec"] = {
          ["jitter"] = "`$BOOLEAN`",
          ["sleep"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
      ["test"] = {
        ["options"] = {
          ["active"] = false,
        },
        ["optspec"] = {
          ["entity"] = "`$MAP`",
          ["net"] = "`$MAP`",
        },
        ["strict"] = false,
        ["transport"] = "base",
      },
      ["timeout"] = {
        ["options"] = {
          ["active"] = false,
          ["ms"] = 30000,
        },
        ["optspec"] = {
          ["clearTimer"] = "`$FUNCTION`",
          ["setTimer"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
    },
    options = {
      base = "http://127.0.0.1:27123",
      auth = {
        prefix = "Bearer",
      },
      headers = {
        ["content-type"] = "application/json",
      },
      entity = {
        ["tag"] = {},
        ["vault"] = {},
      },
    },
    entity = {
      ["tag"] = {
        ["fields"] = {
          {
            ["name"] = "count",
            ["short"] = "Number of times this tag is used across the vault.",
            ["type"] = "`$NUMBER`",
          },
          {
            ["name"] = "name",
            ["short"] = "Tag name without the leading `#`.",
            ["type"] = "`$STRING`",
          },
        },
        ["name"] = "tag",
        ["op"] = {
          ["list"] = {
            ["input"] = "data",
            ["name"] = "list",
            ["points"] = {
              {
                ["args"] = {},
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/tags/",
                ["segments"] = {
                  {
                    ["lit"] = "tags",
                  },
                },
                ["select"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.tags`",
                },
                ["parts"] = {
                  "tags",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["vault"] = {
        ["fields"] = {
          {
            ["name"] = "content",
            ["short"] = "String payload: a heading/block body or label, a new block id for a block `marker` rename (letters, numbers, hyphens, and underscores only), or a new frontmatter key name for a frontmatter `marker` rename.",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "createTargetIfMissing",
            ["short"] = "Create the target (heading path, block id, or frontmatter key) if it does not already exist.",
            ["type"] = "`$BOOLEAN`",
          },
          {
            ["name"] = "destination",
            ["req"] = true,
            ["short"] = "For a heading move (operation `replace`, scope `parent`): where the section is re-parented.",
            ["type"] = "`$OBJECT`",
            ["union"] = {
              ["branches"] = 3,
              ["count"] = 1,
              ["depth"] = 2,
            },
          },
          {
            ["name"] = "files",
            ["type"] = "`$ARRAY`",
          },
          {
            ["name"] = "id",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "ifMatch",
            ["short"] = "Optimistic-concurrency token (the `version` from a prior document map).",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "operation",
            ["req"] = true,
            ["short"] = "What happens to the scoped span: replace it, insert before (`prepend`) or after (`append`), or `delete` it.",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "rejectIfContentPreexists",
            ["short"] = "Fail a `prepend`/`append` when the string content already appears in the target span (makes those operations idempotent on retry).",
            ["type"] = "`$BOOLEAN`",
          },
          {
            ["name"] = "scope",
            ["short"] = "Which part of the target the operation acts on (default `content`).",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "target",
            ["req"] = true,
            ["short"] = "The node to edit.",
            ["type"] = "`$ANY`",
            ["union"] = {
              ["branches"] = 2,
              ["count"] = 1,
              ["depth"] = 0,
            },
          },
          {
            ["name"] = "targetType",
            ["req"] = true,
            ["short"] = "The kind of node to edit.",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "value",
            ["short"] = "Structured JSON payload: a frontmatter value (any JSON — string, number, boolean, array, object, null; for `prepend`/`append` this merges: list concat, dict merge, string concat), or table rows on a `block` target's `content` cell (a 2-D a…",
            ["type"] = "`$ANY`",
          },
          {
            ["name"] = "within",
            ["short"] = "Refines a heading target to one of the section's direct-body top-level blocks (a paragraph, list, table, code fence, blockquote, …): 0 is the first block in document order, and a negative index counts from the end (-1 = last).",
            ["type"] = "`$INTEGER`",
          },
        },
        ["id"] = {
          ["field"] = "id",
          ["name"] = "id",
        },
        ["name"] = "vault",
        ["op"] = {
          ["create"] = {
            ["input"] = "data",
            ["name"] = "create",
            ["points"] = {
              {
                ["args"] = {
                  ["header"] = {
                    {
                      ["example"] = "false",
                      ["kind"] = "header",
                      ["name"] = "create_target_if_missing",
                      ["orig"] = "create_target_if_missing",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["example"] = "2",
                      ["kind"] = "header",
                      ["name"] = "markdown_patch_version",
                      ["orig"] = "markdown_patch_version",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["example"] = "false",
                      ["kind"] = "header",
                      ["name"] = "reject_if_content_preexist",
                      ["orig"] = "reject_if_content_preexist",
                      ["type"] = "`$STRING`",
                    },
                  },
                  ["params"] = {
                    {
                      ["kind"] = "param",
                      ["name"] = "id",
                      ["orig"] = "filename",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                  },
                },
                ["kind"] = "http",
                ["method"] = "POST",
                ["orig"] = "/vault/{filename}",
                ["rename"] = {
                  ["param"] = {
                    ["filename"] = "id",
                  },
                },
                ["segments"] = {
                  {
                    ["lit"] = "vault",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "create_target_if_missing",
                    "id",
                    "markdown_patch_version",
                    "reject_if_content_preexist",
                  },
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["parts"] = {
                  "vault",
                  "{id}",
                },
              },
            },
          },
          ["list"] = {
            ["input"] = "data",
            ["name"] = "list",
            ["points"] = {
              {
                ["args"] = {},
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/vault/",
                ["segments"] = {
                  {
                    ["lit"] = "vault",
                  },
                },
                ["select"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.files`",
                },
                ["parts"] = {
                  "vault",
                },
              },
            },
          },
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["args"] = {
                  ["header"] = {
                    {
                      ["example"] = "2",
                      ["kind"] = "header",
                      ["name"] = "markdown_patch_version",
                      ["orig"] = "markdown_patch_version",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["example"] = "content",
                      ["kind"] = "header",
                      ["name"] = "target_scope",
                      ["orig"] = "target_scope",
                      ["type"] = "`$STRING`",
                    },
                  },
                  ["params"] = {
                    {
                      ["kind"] = "param",
                      ["name"] = "id",
                      ["orig"] = "filename",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                  },
                },
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/vault/{filename}",
                ["rename"] = {
                  ["param"] = {
                    ["filename"] = "id",
                  },
                },
                ["segments"] = {
                  {
                    ["lit"] = "vault",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                    "markdown_patch_version",
                    "target_scope",
                  },
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["parts"] = {
                  "vault",
                  "{id}",
                },
              },
              {
                ["args"] = {
                  ["params"] = {
                    {
                      ["kind"] = "param",
                      ["name"] = "id",
                      ["orig"] = "path_to_directory",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                  },
                },
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/vault/{pathToDirectory}/",
                ["rename"] = {
                  ["param"] = {
                    ["pathToDirectory"] = "id",
                  },
                },
                ["segments"] = {
                  {
                    ["lit"] = "vault",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                  },
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["parts"] = {
                  "vault",
                  "{id}",
                },
              },
            },
          },
          ["patch"] = {
            ["input"] = "data",
            ["name"] = "patch",
            ["points"] = {
              {
                ["args"] = {
                  ["header"] = {
                    {
                      ["example"] = "false",
                      ["kind"] = "header",
                      ["name"] = "create_target_if_missing",
                      ["orig"] = "create_target_if_missing",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["kind"] = "header",
                      ["name"] = "destination",
                      ["orig"] = "destination",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["kind"] = "header",
                      ["name"] = "if_match",
                      ["orig"] = "if_match",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["example"] = "2",
                      ["kind"] = "header",
                      ["name"] = "markdown_patch_version",
                      ["orig"] = "markdown_patch_version",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["kind"] = "header",
                      ["name"] = "operation",
                      ["orig"] = "operation",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["example"] = "false",
                      ["kind"] = "header",
                      ["name"] = "reject_if_content_preexist",
                      ["orig"] = "reject_if_content_preexist",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["kind"] = "header",
                      ["name"] = "target",
                      ["orig"] = "target",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["example"] = "content",
                      ["kind"] = "header",
                      ["name"] = "target_scope",
                      ["orig"] = "target_scope",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["kind"] = "header",
                      ["name"] = "target_type",
                      ["orig"] = "target_type",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["kind"] = "header",
                      ["name"] = "within",
                      ["orig"] = "within",
                      ["type"] = "`$STRING`",
                    },
                  },
                  ["params"] = {
                    {
                      ["kind"] = "param",
                      ["name"] = "id",
                      ["orig"] = "filename",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                  },
                },
                ["kind"] = "http",
                ["method"] = "PATCH",
                ["orig"] = "/vault/{filename}",
                ["rename"] = {
                  ["param"] = {
                    ["filename"] = "id",
                  },
                },
                ["segments"] = {
                  {
                    ["lit"] = "vault",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["select"] = {
                  ["exist"] = {
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
                ["transform"] = {
                  ["req"] = {
                    ["content"] = "`reqdata.content`",
                    ["createTargetIfMissing"] = "`reqdata.create_target_if_missing`",
                    ["destination"] = "`reqdata.destination`",
                    ["ifMatch"] = "`reqdata.if_match`",
                    ["operation"] = "`reqdata.operation`",
                    ["rejectIfContentPreexists"] = "`reqdata.reject_if_content_preexist`",
                    ["scope"] = "`reqdata.scope`",
                    ["target"] = "`reqdata.target`",
                    ["targetType"] = "`reqdata.target_type`",
                    ["value"] = "`reqdata.value`",
                    ["within"] = "`reqdata.within`",
                  },
                  ["res"] = "`body`",
                },
                ["parts"] = {
                  "vault",
                  "{id}",
                },
              },
            },
          },
          ["remove"] = {
            ["input"] = "data",
            ["name"] = "remove",
            ["points"] = {
              {
                ["args"] = {
                  ["params"] = {
                    {
                      ["kind"] = "param",
                      ["name"] = "id",
                      ["orig"] = "filename",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                  },
                  ["query"] = {
                    {
                      ["example"] = "false",
                      ["kind"] = "query",
                      ["name"] = "permanent",
                      ["orig"] = "permanent",
                      ["type"] = "`$STRING`",
                    },
                  },
                },
                ["kind"] = "http",
                ["method"] = "DELETE",
                ["orig"] = "/vault/{filename}",
                ["rename"] = {
                  ["param"] = {
                    ["filename"] = "id",
                  },
                },
                ["segments"] = {
                  {
                    ["lit"] = "vault",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                    "permanent",
                  },
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["parts"] = {
                  "vault",
                  "{id}",
                },
              },
            },
          },
          ["update"] = {
            ["input"] = "data",
            ["name"] = "update",
            ["points"] = {
              {
                ["args"] = {
                  ["header"] = {
                    {
                      ["example"] = "2",
                      ["kind"] = "header",
                      ["name"] = "markdown_patch_version",
                      ["orig"] = "markdown_patch_version",
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["example"] = "false",
                      ["kind"] = "header",
                      ["name"] = "reject_if_content_preexist",
                      ["orig"] = "reject_if_content_preexist",
                      ["type"] = "`$STRING`",
                    },
                  },
                  ["params"] = {
                    {
                      ["kind"] = "param",
                      ["name"] = "id",
                      ["orig"] = "filename",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                  },
                },
                ["kind"] = "http",
                ["method"] = "PUT",
                ["orig"] = "/vault/{filename}",
                ["rename"] = {
                  ["param"] = {
                    ["filename"] = "id",
                  },
                },
                ["segments"] = {
                  {
                    ["lit"] = "vault",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                    "markdown_patch_version",
                    "reject_if_content_preexist",
                  },
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["parts"] = {
                  "vault",
                  "{id}",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
    },
  }
end


local function make_feature(name)
  local features = require("features")
  local factory = features[name]
  if factory ~= nil then
    return factory()
  end
  return features.base()
end


-- Attach make_feature to the SDK class
local function setup_sdk(SDK)
  SDK._make_feature = make_feature
end


return make_config
