# Mcp direct test

require "minitest/autorun"
require "json"
require_relative "../Obsidian_sdk"
require_relative "runner"

class McpDirectTest < Minitest::Test
  def test_direct_load_mcp
    setup = mcp_direct_setup({ "id" => "direct01" })
    _should_skip, _reason = Runner.is_control_skipped("direct", "direct-load-mcp", setup[:live] ? "live" : "unit")
    if _should_skip
      skip(_reason || "skipped via sdk-test-control.json")
      return
    end
    client = setup[:client]


    result = client.direct({
      "path" => "mcp",
      "method" => "GET",
      "params" => {},
    })
    if setup[:live]
      # Live mode is lenient: synthetic IDs frequently 4xx. Skip rather
      # than fail when the load endpoint isn't reachable with the IDs
      # we can construct from setup.idmap.
      if !result["err"].nil?
        skip("load call failed (likely synthetic IDs against live API): #{result["err"]}")
        return
      end
      unless result["ok"]
        skip("load call not ok (likely synthetic IDs against live API)")
        return
      end
      status = Helpers.to_int(result["status"])
      if status < 200 || status >= 300
        skip("expected 2xx status, got #{status}")
        return
      end
    else
      assert_nil result["err"]
      assert result["ok"]
      assert_equal 200, Helpers.to_int(result["status"])
      assert !result["data"].nil?
      if result["data"].is_a?(Hash)
        assert_equal "direct01", result["data"]["id"]
      end
      assert_equal 1, setup[:calls].length
    end
  end

end


def mcp_direct_setup(mockres)
  Runner.load_env_local

  calls = []

  env = Runner.env_override({
    "OBSIDIAN_TEST_MCP_ENTID" => {},
    "OBSIDIAN_TEST_LIVE" => "FALSE",
    "OBSIDIAN_APIKEY" => "",
    "OBSIDIAN_SERVER_HOST" => "127.0.0.1",
    "OBSIDIAN_SERVER_PORT" => "27124",
  })

  live = env["OBSIDIAN_TEST_LIVE"] == "TRUE"

  if live
    # Merged so the generated fields win: sdk-test-control.json's
    # test.client.options adds to the live client, it does not redirect it.
    merged_opts = Runner.live_client_options.merge({
      "apikey" => env["OBSIDIAN_APIKEY"],
      "server" => {
        "host" => env["OBSIDIAN_SERVER_HOST"],
        "port" => env["OBSIDIAN_SERVER_PORT"],
      },
    })
    client = ObsidianSDK.new(merged_opts)
    return {
      client: client,
      calls: calls,
      live: true,
      idmap: {},
    }
  end

  mock_fetch = ->(url, init) {
    calls.push({ "url" => url, "init" => init })
    return {
      "status" => 200,
      "statusText" => "OK",
      "headers" => {},
      "json" => ->() {
        if !mockres.nil?
          return mockres
        end
        return { "id" => "direct01" }
      },
      "body" => "mock",
    }, nil
  }

  client = ObsidianSDK.new({
    "base" => "http://localhost:8080",
    "system" => {
      "fetch" => mock_fetch,
    },
  })

  {
    client: client,
    calls: calls,
    live: false,
    idmap: {},
  }
end
