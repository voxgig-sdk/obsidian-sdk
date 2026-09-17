# Command entity test

require "minitest/autorun"
require "json"
require_relative "../Obsidian_sdk"
require_relative "runner"

class CommandEntityTest < Minitest::Test
  def test_create_instance
    testsdk = ObsidianSDK.test(nil, nil)
    ent = testsdk.Command(nil)
    assert !ent.nil?
  end

  # Feature #4: the entity stream(action, ...) method runs the op pipeline and
  # returns an Enumerator over result items. With the streaming feature active
  # it yields the feature's incremental output; otherwise it falls back to the
  # materialised list so stream always yields.
  def test_stream
    seed = {
      "entity" => {
        "command" => {
          "s1" => { "id" => "s1" },
          "s2" => { "id" => "s2" },
          "s3" => { "id" => "s3" },
        },
      },
    }

    # Fallback: streaming inactive -> yields the materialised list items.
    base = ObsidianSDK.test(seed, nil)
    seen = base.Command(nil).stream("list", nil, nil).to_a
    assert_equal 3, seen.length

    # Inbound: streaming active -> yields each item from the feature.
    cfg = ObsidianConfig.shared_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("streaming")
      sdk = ObsidianSDK.test(seed, { "feature" => { "streaming" => { "active" => true } } })
      got = []
      sdk.Command(nil).stream("list", nil, nil).each do |item|
        if item.is_a?(Array)
          got.concat(item)
        else
          got << item
        end
      end
      assert_equal 3, got.length
    end
  end

  def test_basic_flow
    setup = command_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create", "list"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "command." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set OBSIDIAN_TEST_COMMAND_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # CREATE
    command_ref01_ent = client.Command(nil)
    command_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.command"), "command_ref01"))
    command_ref01_data["command_id"] = setup[:idmap]["command01"]

    command_ref01_data_result = command_ref01_ent.create(command_ref01_data, nil)
    command_ref01_data = Helpers.to_map(command_ref01_data_result.respond_to?(:data_get) ? command_ref01_data_result.data_get : command_ref01_data_result)
    assert !command_ref01_data.nil?
    assert !command_ref01_data["id"].nil?

    # LIST
    command_ref01_match = {}

    command_ref01_list_result = command_ref01_ent.list(command_ref01_match, nil)
    assert command_ref01_list_result.is_a?(Array)

    found_item = Vs.select(
      Runner.entity_list_to_data(command_ref01_list_result),
      { "id" => command_ref01_data["id"] })
    assert !Vs.isempty(found_item)

  end
end

def command_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "command", "CommandTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = ObsidianSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["command01", "command02", "command03"],
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
  entid_env_raw = ENV["OBSIDIAN_TEST_COMMAND_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "OBSIDIAN_TEST_COMMAND_ENTID" => idmap,
    "OBSIDIAN_TEST_LIVE" => "FALSE",
    "OBSIDIAN_TEST_EXPLAIN" => "FALSE",
    "OBSIDIAN_APIKEY" => "",
    "OBSIDIAN_SERVER_HOST" => "127.0.0.1",
    "OBSIDIAN_SERVER_PORT" => "27124",
  })

  idmap_resolved = Helpers.to_map(
    env["OBSIDIAN_TEST_COMMAND_ENTID"])
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
