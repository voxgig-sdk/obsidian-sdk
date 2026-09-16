# Vault entity test

import json
import os
import time

import pytest

from obsidian_sdk.utility.voxgig_struct import voxgig_struct as vs
from obsidian_sdk import ObsidianSDK
from obsidian_sdk.core import helpers

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner


class TestVaultEntity:

    def test_should_create_instance(self):
        testsdk = ObsidianSDK.test(None, None)
        ent = testsdk.Vault(None)
        assert ent is not None

    def test_should_stream(self):
        # Feature #4: the entity stream(action, ...) method runs the op
        # pipeline and yields result items. With the streaming feature active
        # it yields the feature's incremental output; otherwise it falls back
        # to the materialised list so stream always yields.
        seed = {
            "entity": {
                "vault": {
                    "s1": {"id": "s1"},
                    "s2": {"id": "s2"},
                    "s3": {"id": "s3"},
                }
            }
        }

        # Fallback: streaming inactive -> yields the materialised list items.
        base = ObsidianSDK.test(seed, None)
        seen = list(base.Vault(None).stream("list", None, None))
        assert len(seen) == 3

        # Inbound: streaming active -> yields each item from the feature.
        from obsidian_sdk.config import shared_config
        cfg = shared_config()
        if isinstance(cfg.get("feature"), dict) and "streaming" in cfg["feature"]:
            sdk = ObsidianSDK.test(
                seed, {"feature": {"streaming": {"active": True}}})
            got = []
            for item in sdk.Vault(None).stream("list", None, None):
                if isinstance(item, list):
                    got.extend(item)
                else:
                    got.append(item)
            assert len(got) == 3

    def test_should_run_basic_flow(self):
        setup = _vault_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["create", "list", "update", "load", "remove"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "vault." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        # The basic flow consumes synthetic IDs from the fixture. In live mode
        # without an *_ENTID env override, those IDs hit the live API and 4xx.
        if setup.get("synthetic_only"):
            pytest.skip("live entity test uses synthetic IDs from fixture — "
                        "set OBSIDIAN_TEST_VAULT_ENTID JSON to run live")
        client = setup["client"]

        # CREATE
        vault_ref01_ent = client.Vault(None)
        vault_ref01_data = helpers.to_map(vs.getprop(
            vs.getpath(setup["data"], "new.vault"), "vault_ref01"))
        vault_ref01_data["filename"] = setup["idmap"]["filename01"]

        vault_ref01_data = helpers.to_map(runner.entity_data(vault_ref01_ent.create(vault_ref01_data, None)))
        assert vault_ref01_data is not None
        assert vault_ref01_data["id"] is not None

        # LIST
        vault_ref01_match = {}

        vault_ref01_list_result = vault_ref01_ent.list(vault_ref01_match, None)
        assert isinstance(vault_ref01_list_result, list)

        found_item = vs.select(
            runner.entity_list_to_data(vault_ref01_list_result),
            {"id": vault_ref01_data["id"]})
        assert not vs.isempty(found_item)

        # UPDATE
        vault_ref01_data_up0_up = {
            "id": vault_ref01_data["id"],
        }

        vault_ref01_markdef_up0_name = "content"
        vault_ref01_markdef_up0_value = "Mark01-vault_ref01_" + str(setup["now"])
        vault_ref01_data_up0_up[vault_ref01_markdef_up0_name] = vault_ref01_markdef_up0_value

        vault_ref01_resdata_up0 = helpers.to_map(runner.entity_data(vault_ref01_ent.update(vault_ref01_data_up0_up, None)))
        assert vault_ref01_resdata_up0 is not None
        assert vault_ref01_resdata_up0["id"] == vault_ref01_data_up0_up["id"]
        assert vault_ref01_resdata_up0[vault_ref01_markdef_up0_name] == vault_ref01_markdef_up0_value

        # LOAD
        vault_ref01_match_dt0 = {
            "id": vault_ref01_data["id"],
        }
        vault_ref01_data_dt0_loaded = vault_ref01_ent.load(vault_ref01_match_dt0, None)
        vault_ref01_data_dt0_load_result = helpers.to_map(runner.entity_data(vault_ref01_data_dt0_loaded))
        assert vault_ref01_data_dt0_load_result is not None
        assert vault_ref01_data_dt0_load_result["id"] == vault_ref01_data["id"]

        # REMOVE
        vault_ref01_match_rm0 = {
            "id": vault_ref01_data["id"],
        }
        vault_ref01_ent.remove(vault_ref01_match_rm0, None)

        # LIST
        vault_ref01_match_rt0 = {}

        vault_ref01_list_rt0_result = vault_ref01_ent.list(vault_ref01_match_rt0, None)
        assert isinstance(vault_ref01_list_rt0_result, list)

        not_found_item = vs.select(
            runner.entity_list_to_data(vault_ref01_list_rt0_result),
            {"id": vault_ref01_data["id"]})
        assert vs.isempty(not_found_item)



def _vault_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/vault/VaultTestData.json")
    with open(entity_data_file, "r") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = ObsidianSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["vault01", "vault02", "vault03", "filename01"],
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
        "OBSIDIAN_TEST_VAULT_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "OBSIDIAN_TEST_VAULT_ENTID": idmap,
        "OBSIDIAN_TEST_LIVE": "FALSE",
        "OBSIDIAN_TEST_EXPLAIN": "FALSE",
        "OBSIDIAN_APIKEY": "",
    })

    idmap_resolved = helpers.to_map(
        env.get("OBSIDIAN_TEST_VAULT_ENTID"))
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
