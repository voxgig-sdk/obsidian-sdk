

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


describe('Entity1Entity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when OBSIDIAN_TEST_LIVE=TRUE.
  afterEach(liveDelay('OBSIDIAN_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ObsidianSDK.test()
    const ent = testsdk.Entity1()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.OBSIDIAN_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'entity1.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"obsidian","req":false,"short":"Obsidian plugin API version","type":"`$STRING`","index$":0},{"active":true,"name":"self","req":false,"short":"Plugin version.","type":"`$STRING`","index$":1}],"name":"entity1","op":{"load":{"input":"data","name":"load","points":[{"active":true,"args":{},"contract":{"id":"GET /","json":"{\"parameters\":[],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"authenticated\":{\"description\":\"Is your current request authenticated?\",\"type\":\"boolean\"},\"ok\":{\"description\":\"'OK'\",\"type\":\"string\"},\"service\":{\"description\":\"'Obsidian Local REST API'\",\"type\":\"string\"},\"versions\":{\"properties\":{\"obsidian\":{\"description\":\"Obsidian plugin API version\",\"type\":\"string\"},\"self\":{\"description\":\"Plugin version.\",\"type\":\"string\"}},\"type\":\"object\"}},\"type\":\"object\"}}},\"description\":\"Success\"}},\"security\":[{\"apiKeyAuth\":[]}],\"securitySchemes\":{\"apiKeyAuth\":{\"description\":\"Find your API Key in your Obsidian settings\\nin the \\\"Local REST API\\\" section under \\\"Plugins\\\".\\n\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/","segments":[],"select":{},"transform":{"req":"`reqdata`","res":"`body.versions`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"entity1","name__orig":"entity1","Name":"Entity1","name_":"entity1","name-":"entity1","NAME":"ENTITY1","index$":2}, {"active":true,"entity":"entity1","key$":"BasicEntity1Flow","kind":"basic","name":"BasicEntity1Flow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"entity1_ref01","srcdatavar":"entity1_ref01_data","suffix":"_dt0"},"match":{},"op":"load","spec":[],"valid":[{"apply":"TextFieldMark","def":{"mark":"Mark01-entity1_ref01"}}],"index$":0}]}, 'Entity1')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let entity1_ref01_data = Object.values(setup.data.existing.entity1)[0] as any

    // LOAD
    const entity1_ref01_ent = client.Entity1()
    const entity1_ref01_match_dt0: any = {}
    const entity1_ref01_data_dt0 = (await entity1_ref01_ent.load(entity1_ref01_match_dt0)).data()
    assert(null != entity1_ref01_data_dt0)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/entity1/Entity1TestData.json')

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
    ['entity101','entity102','entity103'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'OBSIDIAN_TEST_ENTITY1_ENTID': idmap,
    'OBSIDIAN_TEST_LIVE': 'FALSE',
    'OBSIDIAN_TEST_EXPLAIN': 'FALSE',
    'OBSIDIAN_APIKEY': '',
    'OBSIDIAN_SERVER_HOST': "127.0.0.1",
    'OBSIDIAN_SERVER_PORT': "27124",
  })

  idmap = env['OBSIDIAN_TEST_ENTITY1_ENTID']

  const live = 'TRUE' === env.OBSIDIAN_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['OBSIDIAN_TEST_ENTITY1_ENTID']
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
  
