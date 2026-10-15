-- Vault entity test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("obsidian_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

local _test_dir = debug.getinfo(1, "S").source:match("^@(.+/)")  or "./"

-- main.kit.test.live.strict is true (the default is true): a live
-- request that fails, or a live test missing an input it needs,
-- fails the test.
-- An account with no record for a test to read skips it either way.
local LIVE_STRICT = true


local BaseFeature = require("feature.base_feature")

local FailHook = {}
FailHook.__index = FailHook
setmetatable(FailHook, { __index = BaseFeature })

function FailHook.new()
  local self = setmetatable(BaseFeature.new(), FailHook)
  self.name = "failhook"
  self.unexpected = 0
  return self
end

function FailHook:init(_ctx, _options) end
function FailHook:PreSpec(_ctx) error("vault hook failed") end
function FailHook:PreUnexpected(_ctx) self.unexpected = self.unexpected + 1 end

local function errtext(err)
  if type(err) == "table" then
    return tostring(err.msg or err.message or "")
  end
  return tostring(err)
end

describe("VaultEntity", function()
  it("should create instance", function()
    local testsdk = sdk.test(nil, nil)
    local ent = testsdk:Vault(nil)
    assert.is_not_nil(ent)
  end)

  -- Feature #4: the entity stream(action, ...) method runs the op pipeline and
  -- returns an iterator over result items. With the streaming feature active it
  -- yields the feature's incremental output; otherwise it falls back to the
  -- materialised list so stream always yields.
  it("should stream", function()
    local seed = {
      entity = {
        ["vault"] = {
          s1 = { id = "s1" },
          s2 = { id = "s2" },
          s3 = { id = "s3" },
        },
      },
    }

    -- Fallback: streaming inactive -> yields the materialised list items.
    local base = sdk.test(seed, nil)
    local seen = {}
    for item in base:Vault(nil):stream("list", nil, nil) do
      table.insert(seen, item)
    end
    assert.are.equal(3, #seen)

    -- Inbound: streaming active -> yields each item from the feature.
    local config = require("config_shared")()
    if type(config.feature) == "table" and config.feature.streaming ~= nil then
      local streamsdk = sdk.test(seed, { feature = { streaming = { active = true } } })
      local got = {}
      for item in streamsdk:Vault(nil):stream("list", nil, nil) do
        if vs.islist(item) then
          for _, sub in ipairs(item) do
            table.insert(got, sub)
          end
        else
          table.insert(got, item)
        end
      end
      assert.are.equal(3, #got)
    end
  end)

  it("should report a failed stream", function()
    local offline = { net = { offline = true } }
    local ok, err = pcall(function()
      for _ in sdk.test(offline, nil):Vault(nil):stream("list", nil, nil) do end
    end)
    assert.is_false(ok)
    assert.truthy(string.find(errtext(err), "offline", 1, true))

    for _ in sdk.test(offline, nil):Vault(nil):stream("list", nil, { ctrl = { throw = false } }) do end

    local config = require("config_shared")()
    if type(config.feature) == "table" and config.feature.rbac ~= nil then
      local denied = sdk.test(nil, { feature = { rbac = { active = true, deny = true } } })
      local dok, derr = pcall(function()
        for _ in denied:Vault(nil):stream("list", nil, nil) do end
      end)
      assert.is_false(dok)
      assert.are.equal("rbac_denied", type(derr) == "table" and derr.code or nil)
    end
  end)

  it("should leave the caller's ctrl", function()
    local explain = {}
    local ctrl = { explain = explain }
    for _ in sdk.test(nil, nil):Vault(nil):stream("list", nil, { ctrl = ctrl }) do end
    assert.is_nil(ctrl.stream)
    assert.are.equal(explain, ctrl.explain)
    assert.is_not_nil(next(explain))
  end)

  it("should fire PreUnexpected", function()
    local hook = FailHook.new()
    local client = sdk.new({ feature = { test = { active = true } }, extend = { hook } })

    local out, err = client:Vault(nil):list(nil, nil)
    assert.is_nil(out)
    assert.truthy(string.find(errtext(err), "hook failed", 1, true))
    assert.is_true(hook.unexpected > 0)

    local fired = hook.unexpected
    out, err = client:Vault(nil):list(nil, { throw = false })
    assert.is_nil(err)
    assert.is_true(hook.unexpected > fired)
  end)

  it("should refuse an invalid request", function()
    local config = require("config_shared")()
    if type(config.feature) ~= "table" or config.feature.validate == nil then
      pending("feature not present in this SDK: validate")
      return
    end
    local client = sdk.test(nil, { feature = { validate = { active = true } } })
    local _, err = client:Vault(nil):list({ ["content"] = 1 }, nil)
    assert.are.equal("validate_failed", type(err) == "table" and err.code or nil)
  end)

  it("should run basic flow", function()
    local setup = vault_basic_setup(nil)
    -- Per-op sdk-test-control.json skip.
    local _live = setup.live or false
    for _, _op in ipairs({"list", "update", "load", "remove"}) do
      local _should_skip, _reason = runner.is_control_skipped("entityOp", "vault." .. _op, _live and "live" or "unit")
      if _should_skip then
        pending(_reason or "skipped via sdk-test-control.json")
        return
      end
    end
    if setup.live then
      runner.live_miss(pending, LIVE_STRICT, "Live entity test blocked: " .. "the flow updates a vault record it did not create")
    end
    local client = setup.client

    -- Bootstrap entity data from existing test data.
    local vault_ref01_data_raw = vs.items(helpers.to_map(
      vs.getpath(setup.data, "existing.vault")))
    local vault_ref01_data = nil
    if #vault_ref01_data_raw > 0 then
      vault_ref01_data = helpers.to_map(vault_ref01_data_raw[1][2])
    end

    -- LIST
    local vault_ref01_ent = client:Vault(nil)
    local vault_ref01_match = {}

    local vault_ref01_list_result, err = vault_ref01_ent:list(vault_ref01_match, nil)
    assert.is_nil(err)
    assert.is_table(vault_ref01_list_result)

    -- UPDATE
    local vault_ref01_data_up0_up = {
      id = vault_ref01_data["id"],
    }

    local vault_ref01_markdef_up0_name = "content"
    local vault_ref01_markdef_up0_value = "Mark01-vault_ref01_" .. tostring(setup.now)
    vault_ref01_data_up0_up[vault_ref01_markdef_up0_name] = vault_ref01_markdef_up0_value

    local vault_ref01_resdata_up0_result, err = vault_ref01_ent:update(vault_ref01_data_up0_up, nil)
    assert.is_nil(err)
    local vault_ref01_resdata_up0 = helpers.to_map(type(vault_ref01_resdata_up0_result) == 'table' and vault_ref01_resdata_up0_result.data_get and vault_ref01_resdata_up0_result:data_get() or vault_ref01_resdata_up0_result)
    assert.is_not_nil(vault_ref01_resdata_up0)
    assert.are.equal(vault_ref01_resdata_up0["id"], vault_ref01_data_up0_up["id"])
    assert.are.equal(vault_ref01_resdata_up0[vault_ref01_markdef_up0_name], vault_ref01_markdef_up0_value)

    -- LOAD
    local vault_ref01_match_dt0 = {
      id = vault_ref01_data["id"],
    }
    local vault_ref01_data_dt0_loaded, err = vault_ref01_ent:load(vault_ref01_match_dt0, nil)
    assert.is_nil(err)
    local vault_ref01_data_dt0_load_result = helpers.to_map(type(vault_ref01_data_dt0_loaded) == 'table' and vault_ref01_data_dt0_loaded.data_get and vault_ref01_data_dt0_loaded:data_get() or vault_ref01_data_dt0_loaded)
    assert.is_not_nil(vault_ref01_data_dt0_load_result)
    assert.are.equal(vault_ref01_data_dt0_load_result["id"], vault_ref01_data["id"])

  end)
end)

function vault_basic_setup(extra)
  runner.load_env_local()

  local entity_data_file = _test_dir .. "../../.sdk/test/entity/vault/VaultTestData.json"
  local f = io.open(entity_data_file, "r")
  if f == nil then
    error("failed to read vault test data: " .. entity_data_file)
  end
  local entity_data_source = f:read("*a")
  f:close()

  local entity_data = json.decode(entity_data_source)

  local options = {}
  options["entity"] = entity_data["existing"]

  local client = sdk.test(options, extra)

  -- Generate idmap via transform.
  local idmap = vs.transform(
    { "vault01", "vault02", "vault03" },
    {
      ["`$PACK`"] = { "", {
        ["`$KEY`"] = "`$COPY`",
        ["`$VAL`"] = { "`$FORMAT`", "upper", "`$COPY`" },
      }},
    }
  )

  -- Whether *_ENTID supplied the idmap, read before env_override consumes
  -- it: without it, the ids a live flow binds are the fixture's synthetic ones.
  local entid_env_raw = os.getenv("OBSIDIAN_TEST_VAULT_ENTID")
  local idmap_overridden = entid_env_raw ~= nil and entid_env_raw:match("^%s*{") ~= nil

  local env = runner.env_override({
    ["OBSIDIAN_TEST_VAULT_ENTID"] = idmap,
    ["OBSIDIAN_TEST_LIVE"] = "FALSE",
    ["OBSIDIAN_TEST_EXPLAIN"] = "FALSE",
    ["OBSIDIAN_APIKEY"] = "",
    ["OBSIDIAN_SERVER_HOST"] = "127.0.0.1",
    ["OBSIDIAN_SERVER_PORT"] = "27124",
  })

  local idmap_resolved = helpers.to_map(
    env["OBSIDIAN_TEST_VAULT_ENTID"])
  if idmap_resolved == nil then
    idmap_resolved = helpers.to_map(idmap)
  end

  if env["OBSIDIAN_TEST_LIVE"] == "TRUE" then
    local merged_opts = vs.merge({
      -- FIRST, so the generated fields below win: sdk-test-control.json's
      -- test.client.options adds to the live client, it does not redirect it.
      runner.live_client_options(),
      {
        apikey = env["OBSIDIAN_APIKEY"],
        server = {
          ["host"] = env["OBSIDIAN_SERVER_HOST"],
          ["port"] = env["OBSIDIAN_SERVER_PORT"],
        },
      },
      extra or {},
    })
    client = sdk.new(helpers.to_map(merged_opts))
  end

  local live = env["OBSIDIAN_TEST_LIVE"] == "TRUE"
  return {
    client = client,
    data = entity_data,
    idmap = idmap_resolved,
    env = env,
    explain = env["OBSIDIAN_TEST_EXPLAIN"] == "TRUE",
    live = live,
    synthetic_only = live and not idmap_overridden,
    now = os.time() * 1000,
  }
end
