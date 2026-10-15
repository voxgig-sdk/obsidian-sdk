# Search entity test

import json
import os
import time

import pytest

from obsidian_sdk.utility.voxgig_struct import voxgig_struct as vs
from obsidian_sdk import ObsidianSDK
from obsidian_sdk.core import helpers
from obsidian_sdk.config import shared_config
from obsidian_sdk.feature.base_feature import ObsidianBaseFeature

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner



# main.kit.test.live.strict is true (the default is true): a live
# request that fails, or a live test missing an input it needs,
# fails the test.
# An account with no record for a test to read skips it either way.
LIVE_STRICT = True


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
    with open(entity_data_file, "r", encoding="utf-8") as f:
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

    # Whether *_ENTID supplied the idmap, read before env_override consumes
    # it: without it, the ids a live flow binds are the fixture's synthetic ones.
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
