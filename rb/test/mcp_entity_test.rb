# Mcp entity test

require "minitest/autorun"
require "json"
require_relative "../Obsidian_sdk"
require_relative "runner"

class McpEntityTest < Minitest::Test
  def test_create_instance
    testsdk = ObsidianSDK.test(nil, nil)
    ent = testsdk.Mcp(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = mcp_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create", "load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "mcp." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set OBSIDIAN_TEST_MCP_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # CREATE
    mcp_ref01_ent = client.Mcp(nil)
    mcp_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.mcp"), "mcp_ref01"))

    mcp_ref01_data_result = mcp_ref01_ent.create(mcp_ref01_data, nil)
    mcp_ref01_data = Helpers.to_map(mcp_ref01_data_result.respond_to?(:data_get) ? mcp_ref01_data_result.data_get : mcp_ref01_data_result)
    assert !mcp_ref01_data.nil?
    assert !mcp_ref01_data["id"].nil?

    # LOAD
    mcp_ref01_match_dt0 = {
      "id" => mcp_ref01_data["id"],
    }
    mcp_ref01_data_dt0_loaded = mcp_ref01_ent.load(mcp_ref01_match_dt0, nil)
    mcp_ref01_data_dt0_load_result = Helpers.to_map(mcp_ref01_data_dt0_loaded.respond_to?(:data_get) ? mcp_ref01_data_dt0_loaded.data_get : mcp_ref01_data_dt0_loaded)
    assert !mcp_ref01_data_dt0_load_result.nil?
    assert_equal mcp_ref01_data_dt0_load_result["id"], mcp_ref01_data["id"]

  end
end

def mcp_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "mcp", "McpTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = ObsidianSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["mcp01", "mcp02", "mcp03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Detect ENTID env override before envOverride consumes it. When live
  # mode is on without a real override, the basic test runs against synthetic
  # IDs from the fixture and 4xx's. Surface this so the test can skip.
  entid_env_raw = ENV["OBSIDIAN_TEST_MCP_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "OBSIDIAN_TEST_MCP_ENTID" => idmap,
    "OBSIDIAN_TEST_LIVE" => "FALSE",
    "OBSIDIAN_TEST_EXPLAIN" => "FALSE",
    "OBSIDIAN_APIKEY" => "",
    "OBSIDIAN_SERVER_HOST" => "127.0.0.1",
    "OBSIDIAN_SERVER_PORT" => "27124",
  })

  idmap_resolved = Helpers.to_map(
    env["OBSIDIAN_TEST_MCP_ENTID"])
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
