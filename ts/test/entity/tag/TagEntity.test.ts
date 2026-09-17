

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


describe('TagEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when OBSIDIAN_TEST_LIVE=TRUE.
  afterEach(liveDelay('OBSIDIAN_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ObsidianSDK.test()
    const ent = testsdk.Tag()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.OBSIDIAN_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'tag.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"count","req":false,"short":"Number of times this tag is used across the vault.","type":"`$NUMBER`","index$":0},{"active":true,"name":"name","req":false,"short":"Tag name without the leading `#`.","type":"`$STRING`","index$":1}],"name":"tag","op":{"list":{"input":"data","name":"list","points":[{"active":true,"args":{},"contract":{"id":"GET /tags/","json":"{\"parameters\":[],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"example\":{\"tags\":[{\"count\":3,\"name\":\"project\"},{\"count\":1,\"name\":\"important\"},{\"count\":2,\"name\":\"work\"},{\"count\":2,\"name\":\"work/tasks\"}]},\"schema\":{\"properties\":{\"tags\":{\"items\":{\"properties\":{\"count\":{\"description\":\"Number of times this tag is used across the vault.\",\"type\":\"number\"},\"name\":{\"description\":\"Tag name without the leading `#`.\",\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"}},\"type\":\"object\"}}},\"description\":\"A list of tags with their usage counts.\"}},\"security\":[{\"apiKeyAuth\":[]}],\"securitySchemes\":{\"apiKeyAuth\":{\"description\":\"Find your API Key in your Obsidian settings\\nin the \\\"Local REST API\\\" section under \\\"Plugins\\\".\\n\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/tags/","segments":[{"lit":"tags"}],"select":{},"transform":{"req":"`reqdata`","res":"`body.tags`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"tag","name__orig":"tag","Name":"Tag","name_":"tag","name-":"tag","NAME":"TAG","index$":7}, {"active":true,"entity":"tag","key$":"BasicTagFlow","kind":"basic","name":"BasicTagFlow","param":{},"step":[{"active":true,"data":{},"input":{},"match":{},"op":"list","spec":[],"valid":[{"apply":"ItemExists","def":{"ref":"tag_ref01"}}],"index$":0}]}, 'Tag')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let tag_ref01_data = Object.values(setup.data.existing.tag)[0] as any

    // LIST
    const tag_ref01_ent = client.Tag()
    const tag_ref01_match: any = {}

    const tag_ref01_list = (await tag_ref01_ent.list(tag_ref01_match)).map((e: any) => e.data())


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/tag/TagTestData.json')

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
    ['tag01','tag02','tag03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'OBSIDIAN_TEST_TAG_ENTID': idmap,
    'OBSIDIAN_TEST_LIVE': 'FALSE',
    'OBSIDIAN_TEST_EXPLAIN': 'FALSE',
    'OBSIDIAN_APIKEY': '',
    'OBSIDIAN_SERVER_HOST': "127.0.0.1",
    'OBSIDIAN_SERVER_PORT': "27124",
  })

  idmap = env['OBSIDIAN_TEST_TAG_ENTID']

  const live = 'TRUE' === env.OBSIDIAN_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['OBSIDIAN_TEST_TAG_ENTID']
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
  
