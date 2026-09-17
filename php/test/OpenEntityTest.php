<?php
declare(strict_types=1);

// Open entity test

require_once __DIR__ . '/../obsidian_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class OpenEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = ObsidianSDK::test(null, null);
        $ent = $testsdk->Open(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = open_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "open." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set OBSIDIAN_TEST_OPEN_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $open_ref01_ent = $client->Open(null);
        $open_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.open"), "open_ref01"));
        $open_ref01_data["filename"] = $setup["idmap"]["filename01"];

        $open_ref01_data_result = $open_ref01_ent->create($open_ref01_data, null);
        $open_ref01_data = Helpers::to_map(is_object($open_ref01_data_result) && method_exists($open_ref01_data_result, 'data_get') ? $open_ref01_data_result->data_get() : $open_ref01_data_result);
        $this->assertNotNull($open_ref01_data);
        $this->assertNotNull($open_ref01_data["id"]);

    }
}

function open_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/open/OpenTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = ObsidianSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["open01", "open02", "open03", "filename01"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("OBSIDIAN_TEST_OPEN_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "OBSIDIAN_TEST_OPEN_ENTID" => $idmap,
        "OBSIDIAN_TEST_LIVE" => "FALSE",
        "OBSIDIAN_TEST_EXPLAIN" => "FALSE",
        "OBSIDIAN_APIKEY" => "",
        "OBSIDIAN_SERVER_HOST" => '127.0.0.1',
        "OBSIDIAN_SERVER_PORT" => '27124',
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["OBSIDIAN_TEST_OPEN_ENTID"]);
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
