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

func TestActiveEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Active(nil)
		if ent == nil {
			t.Fatal("expected non-nil ActiveEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := activeBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "update", "load", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "active." + _op, _mode); _shouldSkip {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set OBSIDIAN_TEST_ACTIVE_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		activeRef01Ent := client.Active(nil)
		activeRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "active"}), "active_ref01"))

		activeRef01DataResult, err := activeRef01Ent.Create(activeRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		activeRef01Data = core.ToMapAny(entityData(activeRef01DataResult))
		if activeRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}

		// UPDATE
		activeRef01DataUp0Up := map[string]any{
		}

		activeRef01MarkdefUp0Name := "content"
		activeRef01MarkdefUp0Value := fmt.Sprintf("Mark01-active_ref01_%d", setup.now)
		activeRef01DataUp0Up[activeRef01MarkdefUp0Name] = activeRef01MarkdefUp0Value

		activeRef01ResdataUp0Result, err := activeRef01Ent.Update(activeRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		activeRef01ResdataUp0 := core.ToMapAny(entityData(activeRef01ResdataUp0Result))
		if activeRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if activeRef01ResdataUp0[activeRef01MarkdefUp0Name] != activeRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", activeRef01MarkdefUp0Name, activeRef01ResdataUp0[activeRef01MarkdefUp0Name])
		}

		// LOAD
		activeRef01MatchDt0 := map[string]any{}
		activeRef01DataDt0Loaded, err := activeRef01Ent.Load(activeRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		if activeRef01DataDt0Loaded == nil {
			t.Fatal("expected load result to be non-nil")
		}


	})
}

func activeBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "active", "ActiveTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read active test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse active test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"active01", "active02", "active03"},
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
	entidEnvRaw := os.Getenv("OBSIDIAN_TEST_ACTIVE_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"OBSIDIAN_TEST_ACTIVE_ENTID": idmap,
		"OBSIDIAN_TEST_LIVE":      "FALSE",
		"OBSIDIAN_TEST_EXPLAIN":   "FALSE",
		"OBSIDIAN_APIKEY":         "",
		"OBSIDIAN_SERVER_HOST": "127.0.0.1",
		"OBSIDIAN_SERVER_PORT": "27124",
	})

	idmapResolved := core.ToMapAny(env["OBSIDIAN_TEST_ACTIVE_ENTID"])
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
