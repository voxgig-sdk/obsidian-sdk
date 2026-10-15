<?php
declare(strict_types=1);

// Mcp entity test

require_once __DIR__ . '/../obsidian_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class McpEntityTest extends TestCase
{
    // main.kit.test.live.strict is true (the default is true): a live
    // request that fails, or a live test missing an input it needs,
    // fails the test.
    // An account with no record for a test to read skips it either way.
    private const LIVE_STRICT = true;

    public function test_create_instance(): void
    {
        $testsdk = ObsidianSDK::test(null, null);
        $ent = $testsdk->Mcp(null);
        $this->assertNotNull($ent);
    }

    public function test_validate(): void
    {
        $cfg = ObsidianConfig::shared_config();
        if (!isset($cfg["feature"]["validate"])) {
            $this->markTestSkipped('feature not present in this SDK: validate');
        }
        $client = ObsidianSDK::test(null, ["feature" => ["validate" => ["active" => true]]]);
        $err = null;
        try {
            $client->Mcp(null)->load(["id" => 1], null);
        } catch (\Throwable $e) {
            $err = $e;
        }
        $this->assertSame('validate_failed', $err->sdk_code ?? null);
    }

    public function test_basic_flow(): void
    {
        $setup = mcp_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create", "load"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "mcp." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        $client = $setup["client"];

        // CREATE
        $mcp_ref01_ent = $client->Mcp(null);
        $mcp_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.mcp"), "mcp_ref01"));

        $mcp_ref01_data_result = $mcp_ref01_ent->create($mcp_ref01_data, null);
        $mcp_ref01_data = Helpers::to_map(is_object($mcp_ref01_data_result) && method_exists($mcp_ref01_data_result, 'data_get') ? $mcp_ref01_data_result->data_get() : $mcp_ref01_data_result);
        $this->assertNotNull($mcp_ref01_data);
        $this->assertNotNull($mcp_ref01_data["id"]);

        // LOAD
        $mcp_ref01_match_dt0 = [
            "id" => $mcp_ref01_data["id"],
        ];
        $mcp_ref01_data_dt0_loaded = $mcp_ref01_ent->load($mcp_ref01_match_dt0, null);
        $mcp_ref01_data_dt0_load_result = Helpers::to_map(is_object($mcp_ref01_data_dt0_loaded) && method_exists($mcp_ref01_data_dt0_loaded, 'data_get') ? $mcp_ref01_data_dt0_loaded->data_get() : $mcp_ref01_data_dt0_loaded);
        $this->assertNotNull($mcp_ref01_data_dt0_load_result);
        $this->assertEquals($mcp_ref01_data_dt0_load_result["id"], $mcp_ref01_data["id"]);

    }
}

function mcp_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/mcp/McpTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = ObsidianSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["mcp01", "mcp02", "mcp03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Whether *_ENTID supplied the idmap, read before env_override consumes
    // it: without it, the ids a live flow binds are the fixture's synthetic ones.
    $entid_env_raw = getenv("OBSIDIAN_TEST_MCP_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "OBSIDIAN_TEST_MCP_ENTID" => $idmap,
        "OBSIDIAN_TEST_LIVE" => "FALSE",
        "OBSIDIAN_TEST_EXPLAIN" => "FALSE",
        "OBSIDIAN_APIKEY" => "",
        "OBSIDIAN_SERVER_HOST" => '127.0.0.1',
        "OBSIDIAN_SERVER_PORT" => '27124',
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["OBSIDIAN_TEST_MCP_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["OBSIDIAN_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            Runner::live_client_options(),
            [
                "apikey" => $env["OBSIDIAN_APIKEY"],
                "server" => [
                    "host" => $env["OBSIDIAN_SERVER_HOST"],
                    "port" => $env["OBSIDIAN_SERVER_PORT"],
                ],
            ],
            // ismap, not a plain "?? []" default: an empty PHP array is a
            // LIST, and a non-map later entry REPLACES the accumulated map in
            // merge - so the no-extras call discarded live_client_options()
            // and the apikey/server map above it.
            Vs::ismap($extra) ? $extra : new \stdClass(),
        ]);
        // "?? []" because merge legitimately answers with a stdClass when every
        // contributing entry is an EMPTY map - an SDK with no apikey and no
        // server variables generates an empty middle entry, so that is the
        // common case, not the edge one. to_map returns null for a non-array by
        // design, and the constructor takes a non-nullable array, so without the
        // fallback every such SDK died on "must be of type array, null given"
        // the moment live mode was switched on. Offline mode never reaches this
        // branch, which is why the offline suite stayed green.
        $client = new ObsidianSDK(Helpers::to_map($merged_opts) ?? []);
    }

    $live = $env["OBSIDIAN_TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["OBSIDIAN_TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
