package sdktest

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/obsidian-sdk/go"
	"github.com/voxgig-sdk/obsidian-sdk/go/core"

	vs "github.com/voxgig-sdk/obsidian-sdk/go/utility/struct"
)

func TestVaultEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Vault(nil)
		if ent == nil {
			t.Fatal("expected non-nil VaultEntity")
		}
	})

	// Feature #4: the entity Stream(action, ...) method runs the op pipeline and
	// returns a channel over result items. With the streaming feature active it
	// yields the feature's incremental output; otherwise it falls back to the
	// materialised list so Stream always yields.
	t.Run("stream", func(t *testing.T) {
		seed := map[string]any{
			"entity": map[string]any{
				"vault": map[string]any{
					"s1": map[string]any{"id": "s1"},
					"s2": map[string]any{"id": "s2"},
					"s3": map[string]any{"id": "s3"},
				},
			},
		}

		// Fallback: streaming inactive -> yields the materialised list items.
		base := sdk.TestSDK(seed, nil)
		var seen []any
		for item := range base.Vault(nil).Stream("list", nil, nil) {
			seen = append(seen, item)
		}
		if len(seen) != 3 {
			t.Fatalf("expected 3 streamed items, got %d", len(seen))
		}

		// Inbound: streaming active -> yields each item from the feature iterator.
		hasStreaming := false
		if fm, ok := core.SharedConfig()["feature"].(map[string]any); ok {
			_, hasStreaming = fm["streaming"]
		}
		if hasStreaming {
			streamSdk := sdk.TestSDK(seed, map[string]any{
				"feature": map[string]any{"streaming": map[string]any{"active": true}},
			})
			var got []any
			for item := range streamSdk.Vault(nil).Stream("list", nil, nil) {
				if sub, ok := item.([]any); ok {
					got = append(got, sub...)
				} else {
					got = append(got, item)
				}
			}
			if len(got) != 3 {
				t.Fatalf("expected 3 items via streaming feature, got %d", len(got))
			}
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := vaultBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "list", "update", "load", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "vault." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set OBSIDIAN_TEST_VAULT_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		vaultRef01Ent := client.Vault(nil)
		vaultRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "vault"}), "vault_ref01"))
		vaultRef01Data["filename"] = setup.idmap["filename01"]

		vaultRef01DataResult, err := vaultRef01Ent.Create(vaultRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		vaultRef01Data = core.ToMapAny(entityData(vaultRef01DataResult))
		if vaultRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if vaultRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// LIST
		vaultRef01Match := map[string]any{}

		vaultRef01ListResult, err := vaultRef01Ent.List(vaultRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		vaultRef01List, vaultRef01ListOk := vaultRef01ListResult.([]any)
		if !vaultRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", vaultRef01ListResult)
		}

		foundItem := vs.Select(entityListToData(vaultRef01List), map[string]any{"id": vaultRef01Data["id"]})
		if vs.IsEmpty(foundItem) {
			t.Fatal("expected to find created entity in list")
		}

		// UPDATE
		vaultRef01DataUp0Up := map[string]any{
			"id": vaultRef01Data["id"],
		}

		vaultRef01MarkdefUp0Name := "content"
		vaultRef01MarkdefUp0Value := fmt.Sprintf("Mark01-vault_ref01_%d", setup.now)
		vaultRef01DataUp0Up[vaultRef01MarkdefUp0Name] = vaultRef01MarkdefUp0Value

		vaultRef01ResdataUp0Result, err := vaultRef01Ent.Update(vaultRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		vaultRef01ResdataUp0 := core.ToMapAny(entityData(vaultRef01ResdataUp0Result))
		if vaultRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if vaultRef01ResdataUp0["id"] != vaultRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}
		if vaultRef01ResdataUp0[vaultRef01MarkdefUp0Name] != vaultRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", vaultRef01MarkdefUp0Name, vaultRef01ResdataUp0[vaultRef01MarkdefUp0Name])
		}

		// LOAD
		vaultRef01MatchDt0 := map[string]any{
			"id": vaultRef01Data["id"],
		}
		vaultRef01DataDt0Loaded, err := vaultRef01Ent.Load(vaultRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		vaultRef01DataDt0LoadResult := core.ToMapAny(entityData(vaultRef01DataDt0Loaded))
		if vaultRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if vaultRef01DataDt0LoadResult["id"] != vaultRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

		// REMOVE
		vaultRef01MatchRm0 := map[string]any{
			"id": vaultRef01Data["id"],
		}
		_, err = vaultRef01Ent.Remove(vaultRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

		// LIST
		vaultRef01MatchRt0 := map[string]any{}

		vaultRef01ListRt0Result, err := vaultRef01Ent.List(vaultRef01MatchRt0, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		vaultRef01ListRt0, vaultRef01ListRt0Ok := vaultRef01ListRt0Result.([]any)
		if !vaultRef01ListRt0Ok {
			t.Fatalf("expected list result to be an array, got %T", vaultRef01ListRt0Result)
		}

		notFoundItem := vs.Select(entityListToData(vaultRef01ListRt0), map[string]any{"id": vaultRef01Data["id"]})
		if !vs.IsEmpty(notFoundItem) {
			t.Fatal("expected removed entity to not be in list")
		}

	})
}

func vaultBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "vault", "VaultTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read vault test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse vault test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"vault01", "vault02", "vault03", "filename01"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("OBSIDIAN_TEST_VAULT_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"OBSIDIAN_TEST_VAULT_ENTID": idmap,
		"OBSIDIAN_TEST_LIVE":      "FALSE",
		"OBSIDIAN_TEST_EXPLAIN":   "FALSE",
		"OBSIDIAN_APIKEY":         "",
		"OBSIDIAN_SERVER_HOST": "127.0.0.1",
		"OBSIDIAN_SERVER_PORT": "27124",
	})

	idmapResolved := core.ToMapAny(env["OBSIDIAN_TEST_VAULT_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["OBSIDIAN_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
				"apikey": env["OBSIDIAN_APIKEY"],
				"server": map[string]any{
					"host": env["OBSIDIAN_SERVER_HOST"],
					"port": env["OBSIDIAN_SERVER_PORT"],
				},
			},
			extraOpts,
		})
		client = sdk.NewObsidianSDK(core.ToMapAny(mergedOpts))
	}

	live := env["OBSIDIAN_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["OBSIDIAN_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
