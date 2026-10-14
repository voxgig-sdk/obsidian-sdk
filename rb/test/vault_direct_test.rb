# Vault direct test

require "minitest/autorun"
require "json"
require_relative "../Obsidian_sdk"
require_relative "runner"

class VaultDirectTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def live_ok(result)
    status = Helpers.to_int(result["status"])
    result["err"].nil? && result["ok"] && status >= 200 && status < 300
  end

  def test_direct_list_vault
    setup = vault_direct_setup([
      { "id" => "direct01" },
      { "id" => "direct02" },
    ])
    _should_skip, _reason = Runner.is_control_skipped("direct", "direct-list-vault", setup[:live] ? "live" : "unit")
    if _should_skip
      skip(_reason || "skipped via sdk-test-control.json")
      return
    end
    client = setup[:client]

    params = {}

    result = client.direct({
      "path" => "vault",
      "method" => "GET",
      "params" => params,
    })
    if setup[:live]
      unless live_ok(result)
        Runner.live_miss(LIVE_STRICT, "Live list failed: " + Runner.live_describe(result))
      end
      if Runner.live_list(result["data"]).nil?
        Runner.live_miss(LIVE_STRICT, "Live list returned no list: " + Runner.live_describe(result))
      end
      assert Runner.live_list(result["data"]).is_a?(Array)
    else
      assert_nil result["err"]
      assert result["ok"]
      assert_equal 200, Helpers.to_int(result["status"])
      assert result["data"].is_a?(Array)
      assert_equal 2, result["data"].length
      assert_equal 1, setup[:calls].length
    end
  end

  def test_direct_load_vault
    setup = vault_direct_setup({ "id" => "direct01" })
    _should_skip, _reason = Runner.is_control_skipped("direct", "direct-load-vault", setup[:live] ? "live" : "unit")
    if _should_skip
      skip(_reason || "skipped via sdk-test-control.json")
      return
    end
    client = setup[:client]

    params = {}
    query = {}
    if setup[:live]
      list_result = client.direct({
        "path" => "vault",
        "method" => "GET",
        "params" => {},
      })
      unless live_ok(list_result)
        Runner.live_miss(LIVE_STRICT, "Live list discovery failed: " + Runner.live_describe(list_result))
      end
      records = Runner.live_list(list_result["data"])
      if records.nil?
        Runner.live_miss(LIVE_STRICT, "Live list discovery returned no list: " + Runner.live_describe(list_result))
      end
      if records.empty?
        Runner.live_empty("The account has no vault record to load")
      end
      first = records[0].is_a?(Hash) ? records[0] : {}
      found = first.fetch("id", first["id"])
      if found.nil?
        Runner.live_miss(LIVE_STRICT, "Live load blocked: discovery returned no usable identity")
      end
      params["id"] = found
    else
      params["id"] = "direct01"
    end

    result = client.direct({
      "path" => "vault/{id}",
      "method" => "GET",
      "params" => params,
      "query" => query,
    })
    if setup[:live]
      unless live_ok(result)
        Runner.live_miss(LIVE_STRICT, "Live load failed: " + Runner.live_describe(result))
      end
      if result["data"].nil?
        Runner.live_miss(LIVE_STRICT, "Live load returned no data: " + Runner.live_describe(result))
      end
      assert !result["data"].nil?
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


def vault_direct_setup(mockres)
  Runner.load_env_local

  calls = []

  env = Runner.env_override({
    "OBSIDIAN_TEST_VAULT_ENTID" => {},
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
    idmap = env["OBSIDIAN_TEST_VAULT_ENTID"]
    return {
      client: client,
      calls: calls,
      live: true,
      idmap: idmap.is_a?(Hash) ? idmap : {},
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
