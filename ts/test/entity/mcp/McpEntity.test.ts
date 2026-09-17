

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { ObsidianSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
loadEnvLocal(__dirname + '/../../../.env.local')


describe('McpEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when OBSIDIAN_TEST_LIVE=TRUE.
  afterEach(liveDelay('OBSIDIAN_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ObsidianSDK.test()
    const ent = testsdk.Mcp()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.OBSIDIAN_TEST_LIVE
    for (const op of ['create', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'mcp.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"id","req":false,"short":"Request identifier.","type":"`$STRING`","union":{"branches":2,"count":1,"depth":0},"index$":0},{"active":true,"name":"jsonrpc","req":true,"short":"JSON-RPC version.","type":"`$STRING`","index$":1},{"active":true,"name":"method","req":true,"short":"MCP method to invoke.","type":"`$STRING`","index$":2},{"active":true,"name":"params","req":false,"short":"Method-specific parameters.","type":"`$OBJECT`","index$":3}],"id":{"field":"id","name":"id"},"name":"mcp","op":{"create":{"input":"data","name":"create","points":[{"active":true,"args":{"header":[{"active":true,"kind":"header","name":"mcp_protocol_version","orig":"mcp_protocol_version","reqd":false,"type":"`$STRING`"},{"active":true,"kind":"header","name":"mcp_session_id","orig":"mcp_session_id","reqd":false,"type":"`$STRING`"}]},"contract":{"id":"POST /mcp/","json":"{\"parameters\":[{\"description\":\"Session ID returned by the server on initialization. Omit for the initial `initialize` request; required for all subsequent requests.\",\"in\":\"header\",\"name\":\"Mcp-Session-Id\",\"required\":false,\"schema\":{\"type\":\"string\"}},{\"description\":\"MCP protocol version negotiated during initialization (e.g. `2025-06-18`). Required on all requests after initialization. Unrecognised values are rejected with 400.\",\"in\":\"header\",\"name\":\"MCP-Protocol-Version\",\"required\":false,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"examples\":{\"call_vault_patch\":{\"summary\":\"Patch a heading in a vault file (tools/call)\",\"value\":{\"id\":3,\"jsonrpc\":\"2.0\",\"method\":\"tools/call\",\"params\":{\"arguments\":{\"content\":\"New line of content\\n\",\"operation\":\"append\",\"path\":\"path/to/note.md\",\"target\":[\"My Section\"],\"targetType\":\"heading\"},\"name\":\"vault_patch\"}}},\"call_vault_read\":{\"summary\":\"Read a vault file (tools/call)\",\"value\":{\"id\":2,\"jsonrpc\":\"2.0\",\"method\":\"tools/call\",\"params\":{\"arguments\":{\"path\":\"path/to/note.md\"},\"name\":\"vault_read\"}}},\"list_tools\":{\"summary\":\"List all available MCP tools\",\"value\":{\"id\":1,\"jsonrpc\":\"2.0\",\"method\":\"tools/list\",\"params\":{}}},\"read_openapi_resource\":{\"summary\":\"Read the OpenAPI spec resource (resources/read)\",\"value\":{\"id\":4,\"jsonrpc\":\"2.0\",\"method\":\"resources/read\",\"params\":{\"uri\":\"obsidian://local-rest-api/openapi.yaml\"}}}},\"schema\":{\"description\":\"A JSON-RPC 2.0 request message.\",\"properties\":{\"id\":{\"description\":\"Request identifier. Include for calls that expect a response; omit for notifications.\",\"oneOf\":[{\"type\":\"string\"},{\"type\":\"number\"}]},\"jsonrpc\":{\"description\":\"JSON-RPC version. Must be \\\"2.0\\\".\",\"enum\":[\"2.0\"],\"type\":\"string\"},\"method\":{\"description\":\"MCP method to invoke.\",\"enum\":[\"initialize\",\"tools/list\",\"tools/call\",\"resources/list\",\"resources/read\",\"prompts/list\",\"prompts/get\",\"ping\"],\"type\":\"string\"},\"params\":{\"description\":\"Method-specific parameters.\",\"type\":\"object\"}},\"required\":[\"jsonrpc\",\"method\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"description\":\"Message handled. Response body contains the JSON-RPC result, or may be empty for notifications. On session initialization the `Mcp-Session-Id` response header contains the new session ID.\",\"headers\":{\"Mcp-Session-Id\":{\"description\":\"Session ID assigned by the server. Present only on the `initialize` response.\",\"schema\":{\"type\":\"string\"}}}},\"400\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"errorCode\":{\"description\":\"A 5-digit error code uniquely identifying this particular type of error.\\n\",\"example\":40149,\"type\":\"number\"},\"message\":{\"description\":\"Message describing the error.\",\"example\":\"A brief description of the error.\",\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Unsupported MCP-Protocol-Version.\"},\"401\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"$ref\":\"#/responses/400/content/application~1json/schema/properties\"},\"type\":\"object\"}}},\"description\":\"API key required.\"},\"404\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"$ref\":\"#/responses/400/content/application~1json/schema/properties\"},\"type\":\"object\"}}},\"description\":\"Session not found.\"}},\"security\":[{\"apiKeyAuth\":[]}],\"securitySchemes\":{\"apiKeyAuth\":{\"description\":\"Find your API Key in your Obsidian settings\\nin the \\\"Local REST API\\\" section under \\\"Plugins\\\".\\n\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/mcp/","segments":[{"lit":"mcp"}],"select":{"exist":["mcp_protocol_version","mcp_session_id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"load":{"input":"data","name":"load","points":[{"active":true,"args":{"header":[{"active":true,"kind":"header","name":"mcp_protocol_version","orig":"mcp_protocol_version","reqd":false,"type":"`$STRING`"},{"active":true,"kind":"header","name":"mcp_session_id","orig":"mcp_session_id","reqd":true,"type":"`$STRING`"}]},"contract":{"id":"GET /mcp/","json":"{\"parameters\":[{\"description\":\"Session ID returned by the server on initialization.\",\"in\":\"header\",\"name\":\"Mcp-Session-Id\",\"required\":true,\"schema\":{\"type\":\"string\"}},{\"description\":\"MCP protocol version negotiated during initialization (e.g. `2025-06-18`). Required on all requests after initialization. Unrecognised values are rejected with 400.\",\"in\":\"header\",\"name\":\"MCP-Protocol-Version\",\"required\":false,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"text/event-stream\":{\"schema\":{\"type\":\"string\"}}},\"description\":\"SSE stream opened. The server pushes JSON-RPC messages as server-sent events.\"},\"400\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"errorCode\":{\"description\":\"A 5-digit error code uniquely identifying this particular type of error.\\n\",\"example\":40149,\"type\":\"number\"},\"message\":{\"description\":\"Message describing the error.\",\"example\":\"A brief description of the error.\",\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Unsupported MCP-Protocol-Version.\"},\"401\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"$ref\":\"#/responses/400/content/application~1json/schema/properties\"},\"type\":\"object\"}}},\"description\":\"API key required.\"},\"404\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"$ref\":\"#/responses/400/content/application~1json/schema/properties\"},\"type\":\"object\"}}},\"description\":\"Session not found.\"}},\"security\":[{\"apiKeyAuth\":[]}],\"securitySchemes\":{\"apiKeyAuth\":{\"description\":\"Find your API Key in your Obsidian settings\\nin the \\\"Local REST API\\\" section under \\\"Plugins\\\".\\n\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/mcp/","segments":[{"lit":"mcp"}],"select":{"exist":["mcp_protocol_version","mcp_session_id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"mcp","name__orig":"mcp","Name":"Mcp","name_":"mcp","name-":"mcp","NAME":"MCP","index$":3}, {"active":true,"entity":"mcp","key$":"BasicMcpFlow","kind":"basic","name":"BasicMcpFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"mcp_ref01"},"match":{},"op":"create","spec":[],"valid":[],"index$":0},{"active":true,"data":{},"input":{"ref":"mcp_ref01","srcdatavar":"mcp_ref01_data","suffix":"_dt0"},"match":{},"op":"load","spec":[],"valid":[{"apply":"TextFieldMark","def":{"mark":"Mark01-mcp_ref01"}}],"index$":1}]}, 'Mcp')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const mcp_ref01_ent = client.Mcp()
    let mcp_ref01_data = setup.data.new.mcp['mcp_ref01']

    mcp_ref01_data = (await mcp_ref01_ent.create(mcp_ref01_data)).data()
    assert(null != mcp_ref01_data.id)


    // LOAD
    const mcp_ref01_match_dt0: any = {}
    mcp_ref01_match_dt0.id = mcp_ref01_data.id
    const mcp_ref01_data_dt0 = (await mcp_ref01_ent.load(mcp_ref01_match_dt0)).data()
    assert(mcp_ref01_data_dt0.id === mcp_ref01_data.id)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/mcp/McpTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = ObsidianSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['mcp01','mcp02','mcp03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'OBSIDIAN_TEST_MCP_ENTID': idmap,
    'OBSIDIAN_TEST_LIVE': 'FALSE',
    'OBSIDIAN_TEST_EXPLAIN': 'FALSE',
    'OBSIDIAN_APIKEY': '',
    'OBSIDIAN_SERVER_HOST': "127.0.0.1",
    'OBSIDIAN_SERVER_PORT': "27124",
  })

  idmap = env['OBSIDIAN_TEST_MCP_ENTID']

  const live = 'TRUE' === env.OBSIDIAN_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['OBSIDIAN_TEST_MCP_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new ObsidianSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
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
    ]))
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
  }

  return setup
}
  
