# Active entity test

require "minitest/autorun"
require "json"
require_relative "../Obsidian_sdk"
require_relative "runner"

class ActiveEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = ObsidianSDK.test(nil, nil)
    ent = testsdk.Active(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = ObsidianConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = ObsidianSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Active(nil).load({ "content" => 1 }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = active_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create", "update", "load", "remove"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "active." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    client = setup[:client]

    # CREATE
    active_ref01_ent = client.Active(nil)
    active_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.active"), "active_ref01"))

    active_ref01_data_result = active_ref01_ent.create(active_ref01_data, nil)
    active_ref01_data = Helpers.to_map(active_ref01_data_result.respond_to?(:data_get) ? active_ref01_data_result.data_get : active_ref01_data_result)
    assert !active_ref01_data.nil?

    # UPDATE
    active_ref01_data_up0_up = {
    }

    active_ref01_markdef_up0_name = "content"
    active_ref01_markdef_up0_value = "Mark01-active_ref01_#{setup[:now]}"
    active_ref01_data_up0_up[active_ref01_markdef_up0_name] = active_ref01_markdef_up0_value

    active_ref01_resdata_up0_result = active_ref01_ent.update(active_ref01_data_up0_up, nil)
    active_ref01_resdata_up0 = Helpers.to_map(active_ref01_resdata_up0_result.respond_to?(:data_get) ? active_ref01_resdata_up0_result.data_get : active_ref01_resdata_up0_result)
    assert !active_ref01_resdata_up0.nil?
    assert_equal active_ref01_resdata_up0[active_ref01_markdef_up0_name], active_ref01_markdef_up0_value

    # LOAD
    active_ref01_match_dt0 = {}
    active_ref01_data_dt0_loaded = active_ref01_ent.load(active_ref01_match_dt0, nil)
    assert !active_ref01_data_dt0_loaded.nil?


  end
end

def active_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "active", "ActiveTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = ObsidianSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["active01", "active02", "active03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["OBSIDIAN_TEST_ACTIVE_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "OBSIDIAN_TEST_ACTIVE_ENTID" => idmap,
    "OBSIDIAN_TEST_LIVE" => "FALSE",
    "OBSIDIAN_TEST_EXPLAIN" => "FALSE",
    "OBSIDIAN_APIKEY" => "",
    "OBSIDIAN_SERVER_HOST" => "127.0.0.1",
    "OBSIDIAN_SERVER_PORT" => "27124",
  })

  idmap_resolved = Helpers.to_map(
    env["OBSIDIAN_TEST_ACTIVE_ENTID"])
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
