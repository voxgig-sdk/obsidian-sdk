# Search entity test

import json
import os
import time

import pytest

from obsidian_sdk.utility.voxgig_struct import voxgig_struct as vs
from obsidian_sdk import ObsidianSDK
from obsidian_sdk.core import helpers

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner


class TestSearchEntity:

    def test_should_create_instance(self):
        testsdk = ObsidianSDK.test(None, None)
        ent = testsdk.Search(None)
        assert ent is not None

    def test_should_run_basic_flow(self):
        setup = _search_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["create"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "search." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        # The basic flow consumes synthetic IDs from the fixture. In live mode
        # without an *_ENTID env override, those IDs hit the live API and 4xx.
        if setup.get("synthetic_only"):
            pytest.skip("live entity test uses synthetic IDs from fixture — "
                        "set OBSIDIAN_TEST_SEARCH_ENTID JSON to run live")
        client = setup["client"]

        # CREATE
        search_ref01_ent = client.Search(None)
        search_ref01_data = helpers.to_map(vs.getprop(
            vs.getpath(setup["data"], "new.search"), "search_ref01"))

        search_ref01_data = helpers.to_map(runner.entity_data(search_ref01_ent.create(search_ref01_data, None)))
        assert search_ref01_data is not None



def _search_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/search/SearchTestData.json")
    with open(entity_data_file, "r") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = ObsidianSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["search01", "search02", "search03"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Detect ENTID env override before envOverride consumes it. When live
    # mode is on without a real override, the basic test runs against synthetic
    # IDs from the fixture and 4xx's. We surface this so the test can skip.
    _entid_env_raw = os.environ.get(
        "OBSIDIAN_TEST_SEARCH_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "OBSIDIAN_TEST_SEARCH_ENTID": idmap,
        "OBSIDIAN_TEST_LIVE": "FALSE",
        "OBSIDIAN_TEST_EXPLAIN": "FALSE",
        "OBSIDIAN_APIKEY": "",
        "OBSIDIAN_SERVER_HOST": "127.0.0.1",
        "OBSIDIAN_SERVER_PORT": "27124",
    })

    idmap_resolved = helpers.to_map(
        env.get("OBSIDIAN_TEST_SEARCH_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("OBSIDIAN_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            # FIRST, so the generated fields below win: sdk-test-control.json's
            # test.client.options adds to the live client, it does not
            # redirect it.
            runner.live_client_options(),
            {
                "apikey": env.get("OBSIDIAN_APIKEY"),
                "server": {
                    "host": env.get("OBSIDIAN_SERVER_HOST"),
                    "port": env.get("OBSIDIAN_SERVER_PORT"),
                },
            },
            extra or {},
        ])
        client = ObsidianSDK(helpers.to_map(merged_opts))

    _live = env.get("OBSIDIAN_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("OBSIDIAN_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
