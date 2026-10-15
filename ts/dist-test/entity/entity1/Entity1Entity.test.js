"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('Entity1Entity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when OBSIDIAN_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('OBSIDIAN_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.ObsidianSDK.test();
        const ent = testsdk.Entity1();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.ObsidianSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Entity1().load({ "authenticated": "x" }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.OBSIDIAN_TEST_LIVE;
        for (const op of ['load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'entity1.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "authenticated": { "a": true, "h": "Authenticated", "n": "authenticated", "r": false, "sh": "Is your current request authenticated?", "t": "`$BOOLEAN`", "key$": "authenticated", "index$": 0 }, "ok": { "a": true, "h": "Ok", "n": "ok", "r": false, "sh": "'OK'", "t": "`$STRING`", "key$": "ok", "index$": 1 }, "service": { "a": true, "h": "Service", "n": "service", "r": false, "sh": "'Obsidian Local REST API'", "t": "`$STRING`", "key$": "service", "index$": 2 }, "versions": { "a": true, "h": "Versions", "n": "versions", "r": false, "t": "`$OBJECT`", "key$": "versions", "index$": 3 } }, "name": "entity1", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "GET", "o": "/", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "entity1", "name__orig": "entity1", "Name": "Entity1", "name_": "entity1", "name-": "entity1", "NAME": "ENTITY1", "index$": 2 }, { "active": true, "entity": "entity1", "key$": "BasicEntity1Flow", "kind": "basic", "name": "BasicEntity1Flow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "entity1_ref01", "srcdatavar": "entity1_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-entity1_ref01" } }], "index$": 0 }] }, 'Entity1', { "GET /": { "protocol": "http", "parameters": [] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let entity1_ref01_data = Object.values(setup.data.existing.entity1)[0];
        // LOAD
        const entity1_ref01_ent = client.Entity1();
        const entity1_ref01_match_dt0 = {};
        const entity1_ref01_data_dt0 = (await entity1_ref01_ent.load(entity1_ref01_match_dt0)).data();
        (0, node_assert_1.default)(null != entity1_ref01_data_dt0);
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/entity1/Entity1TestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.ObsidianSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['entity101', 'entity102', 'entity103'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'OBSIDIAN_TEST_ENTITY1_ENTID': idmap,
        'OBSIDIAN_TEST_LIVE': 'FALSE',
        'OBSIDIAN_TEST_EXPLAIN': 'FALSE',
        'OBSIDIAN_APIKEY': '',
        'OBSIDIAN_SERVER_HOST': "127.0.0.1",
        'OBSIDIAN_SERVER_PORT': "27124",
    });
    idmap = env['OBSIDIAN_TEST_ENTITY1_ENTID'];
    const live = 'TRUE' === env.OBSIDIAN_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['OBSIDIAN_TEST_ENTITY1_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.ObsidianSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {
                apikey: env.OBSIDIAN_APIKEY,
                server: {
                    host: env.OBSIDIAN_SERVER_HOST,
                    port: env.OBSIDIAN_SERVER_PORT,
                },
            },
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
    }
    const setup = {
        idmap,
        env,
        options,
        client,
        struct,
        data: entityData,
        explain: 'TRUE' === env.OBSIDIAN_TEST_EXPLAIN,
        live,
        transport,
        now: Date.now(),
    };
    return setup;
}
//# sourceMappingURL=Entity1Entity.test.js.map