# Vault entity test

require "minitest/autorun"
require "json"
require_relative "../Obsidian_sdk"
require_relative "runner"

class VaultEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = ObsidianSDK.test(nil, nil)
    ent = testsdk.Vault(nil)
    assert !ent.nil?
  end

  def test_list_entities
    seed = {
      "entity" => {
        "vault" => {
          "l1" => { "id" => "l1" },
          "l2" => { "id" => "l2" },
        },
      },
    }
    items = ObsidianSDK.test(seed, nil).Vault(nil).list(nil, nil)
    # list resolves to one entity per record; data_get reads the record.
    assert_equal 2, items.length
    items.each do |item|
      assert item.respond_to?(:data_get)
      assert item.data_get.is_a?(Hash)
    end
  end

  # Feature #4: the entity stream(action, ...) method runs the op pipeline and
  # returns an Enumerator over result items. With the streaming feature active
  # it yields the feature's incremental output; otherwise it falls back to the
  # materialised list so stream always yields.
  def test_stream
    seed = {
      "entity" => {
        "vault" => {
          "s1" => { "id" => "s1" },
          "s2" => { "id" => "s2" },
          "s3" => { "id" => "s3" },
        },
      },
    }

    # Fallback: streaming inactive -> yields the materialised list items.
    base = ObsidianSDK.test(seed, nil)
    seen = base.Vault(nil).stream("list", nil, nil).to_a
    assert_equal 3, seen.length

    # Inbound: streaming active -> yields each item from the feature.
    cfg = ObsidianConfig.shared_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("streaming")
      sdk = ObsidianSDK.test(seed, { "feature" => { "streaming" => { "active" => true } } })
      got = []
      sdk.Vault(nil).stream("list", nil, nil).each do |item|
        if item.is_a?(Array)
          got.concat(item)
        else
          got << item
        end
      end
      assert_equal 3, got.length
    end
  end

  class FailHook < ObsidianBaseFeature
    attr_reader :unexpected

    def initialize
      super()
      @name = "failhook"
      @unexpected = 0
    end

    def PreSpec(ctx)
      raise "vault hook failed"
    end

    def PreUnexpected(ctx)
      @unexpected += 1
    end
  end

  def test_stream_error
    offline = { "net" => { "offline" => true } }
    err = assert_raises(StandardError) do
      ObsidianSDK.test(offline, nil).Vault(nil).stream("list", nil, nil).to_a
    end
    assert_match(/offline/, err.message)

    ObsidianSDK.test(offline, nil).Vault(nil)
      .stream("list", nil, { "ctrl" => { "throw" => false } }).to_a

    cfg = ObsidianConfig.shared_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("rbac")
      denied = ObsidianSDK.test(nil, { "feature" => { "rbac" => { "active" => true, "deny" => true } } })
      err = assert_raises(StandardError) do
        denied.Vault(nil).stream("list", nil, nil).to_a
      end
      assert_equal "rbac_denied", err.code
    end
  end

  def test_stream_ctrl
    explain = {}
    ctrl = { "explain" => explain }
    ObsidianSDK.test(nil, nil).Vault(nil).stream("list", nil, { "ctrl" => ctrl }).to_a
    assert_equal ["explain"], ctrl.keys
    assert_same explain, ctrl["explain"]
    refute_empty explain
  end

  def test_unexpected
    hook = FailHook.new
    client = ObsidianSDK.new({ "feature" => { "test" => { "active" => true } }, "extend" => [hook] })

    err = assert_raises(StandardError) do
      client.Vault(nil).list(nil, nil)
    end
    assert_match(/hook failed/, err.message)
    assert_operator hook.unexpected, :>, 0

    fired = hook.unexpected
    assert_nil client.Vault(nil).list(nil, { "throw" => false })
    assert_operator hook.unexpected, :>, fired
  end

  def test_validate
    cfg = ObsidianConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = ObsidianSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Vault(nil).list({ "content" => 1 }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = vault_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["list", "update", "load", "remove"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "vault." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    if setup[:live]
      Runner.live_miss(LIVE_STRICT, "Live entity test blocked: " + "the flow updates a vault record it did not create")
    end
    client = setup[:client]

    # Bootstrap entity data from existing test data.
    vault_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.vault")))
    vault_ref01_data = nil
    if vault_ref01_data_raw.length > 0
      vault_ref01_data = Helpers.to_map(vault_ref01_data_raw[0][1])
    end

    # LIST
    vault_ref01_ent = client.Vault(nil)
    vault_ref01_match = {}

    vault_ref01_list_result = vault_ref01_ent.list(vault_ref01_match, nil)
    assert vault_ref01_list_result.is_a?(Array)

    # UPDATE
    vault_ref01_data_up0_up = {
      "id" => vault_ref01_data["id"],
    }

    vault_ref01_markdef_up0_name = "content"
    vault_ref01_markdef_up0_value = "Mark01-vault_ref01_#{setup[:now]}"
    vault_ref01_data_up0_up[vault_ref01_markdef_up0_name] = vault_ref01_markdef_up0_value

    vault_ref01_resdata_up0_result = vault_ref01_ent.update(vault_ref01_data_up0_up, nil)
    vault_ref01_resdata_up0 = Helpers.to_map(vault_ref01_resdata_up0_result.respond_to?(:data_get) ? vault_ref01_resdata_up0_result.data_get : vault_ref01_resdata_up0_result)
    assert !vault_ref01_resdata_up0.nil?
    assert_equal vault_ref01_resdata_up0["id"], vault_ref01_data_up0_up["id"]
    assert_equal vault_ref01_resdata_up0[vault_ref01_markdef_up0_name], vault_ref01_markdef_up0_value

    # LOAD
    vault_ref01_match_dt0 = {
      "id" => vault_ref01_data["id"],
    }
    vault_ref01_data_dt0_loaded = vault_ref01_ent.load(vault_ref01_match_dt0, nil)
    vault_ref01_data_dt0_load_result = Helpers.to_map(vault_ref01_data_dt0_loaded.respond_to?(:data_get) ? vault_ref01_data_dt0_loaded.data_get : vault_ref01_data_dt0_loaded)
    assert !vault_ref01_data_dt0_load_result.nil?
    assert_equal vault_ref01_data_dt0_load_result["id"], vault_ref01_data["id"]

  end
end

def vault_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "vault", "VaultTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = ObsidianSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["vault01", "vault02", "vault03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["OBSIDIAN_TEST_VAULT_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "OBSIDIAN_TEST_VAULT_ENTID" => idmap,
    "OBSIDIAN_TEST_LIVE" => "FALSE",
    "OBSIDIAN_TEST_EXPLAIN" => "FALSE",
    "OBSIDIAN_APIKEY" => "",
    "OBSIDIAN_SERVER_HOST" => "127.0.0.1",
    "OBSIDIAN_SERVER_PORT" => "27124",
  })

  idmap_resolved = Helpers.to_map(
    env["OBSIDIAN_TEST_VAULT_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["OBSIDIAN_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
        "apikey" => env["OBSIDIAN_APIKEY"],
        "server" => {
          "host" => env["OBSIDIAN_SERVER_HOST"],
          "port" => env["OBSIDIAN_SERVER_PORT"],
        },
      },
      extra || {},
    ])
    client = ObsidianSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["OBSIDIAN_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["OBSIDIAN_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
