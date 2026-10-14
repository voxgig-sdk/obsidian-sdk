

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { ObsidianSDK, BaseFeature, config, stdutil } from '../../..'

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


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = ObsidianSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Mcp().load({"id":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.OBSIDIAN_TEST_LIVE
    for (const op of ['create', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'mcp.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"id":{"a":true,"h":"Id","n":"id","r":false,"sh":"Request identifier.","t":"`$STRING`","union":{"branches":2,"count":1,"depth":0},"key$":"id","index$":0},"jsonrpc":{"a":true,"h":"Jsonrpc","n":"jsonrpc","r":true,"sh":"JSON-RPC version.","t":"`$STRING`","key$":"jsonrpc","index$":1},"method":{"a":true,"h":"Method","n":"method","r":true,"sh":"MCP method to invoke.","t":"`$STRING`","key$":"method","index$":2},"params":{"a":true,"h":"Params","n":"params","r":false,"sh":"Method-specific parameters.","t":"`$OBJECT`","key$":"params","index$":3}},"id":{"field":"id","name":"id"},"name":"mcp","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["id","jsonrpc","method","params"],"co":{"id":"POST /mcp/","source":"openapi3","version":2},"g":{"header":[{"a":true,"k":"header","n":"mcp_protocol_version","or":"MCP-Protocol-Version","r":false,"t":"`$STRING`","index$":0},{"a":true,"k":"header","n":"mcp_session_id","or":"Mcp-Session-Id","r":false,"t":"`$STRING`","index$":1}]},"k":"http","m":"POST","o":"/mcp/","q":{},"r":{},"s":[{"lit":"mcp"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /mcp/","source":"openapi3","version":2},"g":{"header":[{"a":true,"k":"header","n":"mcp_protocol_version","or":"MCP-Protocol-Version","r":false,"t":"`$STRING`","index$":0},{"a":true,"k":"header","n":"mcp_session_id","or":"Mcp-Session-Id","r":true,"t":"`$STRING`","index$":1}]},"k":"http","m":"GET","o":"/mcp/","q":{"exist":["mcp_session_id"]},"r":{},"rs":{"kind":"raw","media":"text/event-stream"},"s":[{"lit":"mcp"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"mcp","name__orig":"mcp","Name":"Mcp","name_":"mcp","name-":"mcp","NAME":"MCP","index$":3}, {"active":true,"entity":"mcp","key$":"BasicMcpFlow","kind":"basic","name":"BasicMcpFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"mcp_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0},{"a":true,"d":{},"i":{"ref":"mcp_ref01","srcdatavar":"mcp_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-mcp_ref01"}}],"index$":1}]}, 'Mcp', {"POST /mcp/":{"protocol":"http","requestBody":{"content":{"application/json":{"examples":{"call_vault_patch":{"summary":"Patch a heading in a vault file (tools/call)","value":{"id":3,"jsonrpc":"2.0","method":"tools/call","params":{"arguments":{"content":"New line of content\n","operation":"append","path":"path/to/note.md","target":["My Section"],"targetType":"heading"},"name":"vault_patch"}}},"call_vault_read":{"summary":"Read a vault file (tools/call)","value":{"id":2,"jsonrpc":"2.0","method":"tools/call","params":{"arguments":{"path":"path/to/note.md"},"name":"vault_read"}}},"list_tools":{"summary":"List all available MCP tools","value":{"id":1,"jsonrpc":"2.0","method":"tools/list","params":{}}},"read_openapi_resource":{"summary":"Read the OpenAPI spec resource (resources/read)","value":{"id":4,"jsonrpc":"2.0","method":"resources/read","params":{"uri":"obsidian://local-rest-api/openapi.yaml"}}}},"schema":{"description":"A JSON-RPC 2.0 request message.","properties":{"id":{"description":"Request identifier. Include for calls that expect a response; omit for notifications.","oneOf":[{"type":"string"},{"type":"number"}],"key$":"id"},"jsonrpc":{"description":"JSON-RPC version. Must be \"2.0\".","enum":["2.0"],"type":"string","key$":"jsonrpc"},"method":{"description":"MCP method to invoke.","enum":["initialize","tools/list","tools/call","resources/list","resources/read","prompts/list","prompts/get","ping"],"type":"string","key$":"method"},"params":{"description":"Method-specific parameters.","type":"object","key$":"params"}},"required":["jsonrpc","method"],"type":"object","index$":1}}},"required":true},"parameters":[{"description":"Session ID returned by the server on initialization. Omit for the initial `initialize` request; required for all subsequent requests.","in":"header","name":"Mcp-Session-Id","required":false,"schema":{"type":"string"},"index$":0},{"description":"MCP protocol version negotiated during initialization (e.g. `2025-06-18`). Required on all requests after initialization. Unrecognised values are rejected with 400.","in":"header","name":"MCP-Protocol-Version","required":false,"schema":{"type":"string"},"index$":1}]},"GET /mcp/":{"protocol":"http","parameters":[{"description":"Session ID returned by the server on initialization.","in":"header","name":"Mcp-Session-Id","required":true,"schema":{"type":"string"},"index$":0},{"description":"MCP protocol version negotiated during initialization (e.g. `2025-06-18`). Required on all requests after initialization. Unrecognised values are rejected with 400.","in":"header","name":"MCP-Protocol-Version","required":false,"schema":{"type":"string"},"index$":1}]}}, { strict: LIVE_STRICT, t })
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



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

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
  
