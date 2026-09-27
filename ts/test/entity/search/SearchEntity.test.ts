

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


loadEnvLocal(__dirname + '/../../../.env.local')


describe('SearchEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when OBSIDIAN_TEST_LIVE=TRUE.
  afterEach(liveDelay('OBSIDIAN_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ObsidianSDK.test()
    const ent = testsdk.Search()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.OBSIDIAN_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'search.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{},"name":"search","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /search/simple/","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":100,"k":"query","n":"context_length","or":"context_length","r":false,"t":"`$NUMBER`","index$":0},{"a":true,"k":"query","n":"query","or":"query","r":true,"t":"`$STRING`","index$":1}]},"k":"http","m":"POST","o":"/search/simple/","q":{"$action":"simple","exist":["context_length","query"]},"r":{},"s":[{"lit":"search"},{"lit":"simple"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0},{"a":true,"co":{"id":"POST /search/","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/search/","q":{},"r":{},"s":[{"lit":"search"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":1}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"search","name__orig":"search","Name":"Search","name_":"search","name-":"search","NAME":"SEARCH","index$":5}, {"active":true,"entity":"search","key$":"BasicSearchFlow","kind":"basic","name":"BasicSearchFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"search_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0}]}, 'Search', {"POST /search/simple/":{"protocol":"http","parameters":[{"description":"Your search query","in":"query","name":"query","required":true,"schema":{"type":"string"},"index$":0},{"description":"How much context to return around the matching string","in":"query","name":"contextLength","required":false,"schema":{"default":100,"type":"number"},"index$":1}]},"POST /search/":{"protocol":"http","requestBody":{"content":{"application/vnd.olrapi.jsonlogic+json":{"examples":{"find_by_frontmatter_url_glob":{"summary":"Find notes having URL or a matching URL glob frontmatter field.","value":"{\n  \"or\": [\n    {\"===\": [{\"var\": \"frontmatter.url\"}, \"https://myurl.com/some/path/\"]},\n    {\"glob\": [{\"var\": \"frontmatter.url-glob\"}, \"https://myurl.com/some/path/\"]}\n  ]\n}\n"},"find_by_frontmatter_value":{"summary":"Find notes having a certain frontmatter field value.","value":"{\n  \"==\": [\n    {\"var\": \"frontmatter.myField\"},\n    \"myValue\"\n  ]\n}\n"},"find_by_tag":{"summary":"Find notes having a certain tag","value":"{\n  \"in\": [\n    \"myTag\",\n    {\"var\": \"tags\"}\n  ]\n}\n"}},"schema":{"externalDocs":{"url":"https://jsonlogic.com/operations.html"},"type":"object"}}},"required":true},"parameters":[]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const search_ref01_ent = client.Search()
    let search_ref01_data = setup.data.new.search['search_ref01']

    search_ref01_data = (await search_ref01_ent.create(search_ref01_data)).data()
    assert(null != search_ref01_data)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/search/SearchTestData.json')

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
    ['search01','search02','search03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'OBSIDIAN_TEST_SEARCH_ENTID': idmap,
    'OBSIDIAN_TEST_LIVE': 'FALSE',
    'OBSIDIAN_TEST_EXPLAIN': 'FALSE',
    'OBSIDIAN_APIKEY': '',
    'OBSIDIAN_SERVER_HOST': "127.0.0.1",
    'OBSIDIAN_SERVER_PORT': "27124",
  })

  idmap = env['OBSIDIAN_TEST_SEARCH_ENTID']

  const live = 'TRUE' === env.OBSIDIAN_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['OBSIDIAN_TEST_SEARCH_ENTID']
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
  
