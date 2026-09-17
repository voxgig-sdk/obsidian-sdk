

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
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[],"name":"search","op":{"create":{"input":"data","name":"create","points":[{"active":true,"args":{"query":[{"active":true,"example":100,"kind":"query","name":"context_length","orig":"context_length","reqd":false,"type":"`$NUMBER`"},{"active":true,"kind":"query","name":"query","orig":"query","reqd":true,"type":"`$STRING`"}]},"contract":{"id":"POST /search/simple/","json":"{\"parameters\":[{\"description\":\"Your search query\",\"in\":\"query\",\"name\":\"query\",\"required\":true,\"schema\":{\"type\":\"string\"}},{\"description\":\"How much context to return around the matching string\",\"in\":\"query\",\"name\":\"contextLength\",\"required\":false,\"schema\":{\"default\":100,\"type\":\"number\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"items\":{\"properties\":{\"filename\":{\"description\":\"Path to the matching file\",\"type\":\"string\"},\"matches\":{\"items\":{\"properties\":{\"context\":{\"type\":\"string\"},\"match\":{\"properties\":{\"end\":{\"type\":\"number\"},\"start\":{\"type\":\"number\"}},\"required\":[\"start\",\"end\"],\"type\":\"object\"}},\"required\":[\"match\",\"context\"],\"type\":\"object\"},\"type\":\"array\"},\"score\":{\"type\":\"number\"}},\"type\":\"object\"},\"type\":\"array\"}}},\"description\":\"Success\"}},\"security\":[{\"apiKeyAuth\":[]}],\"securitySchemes\":{\"apiKeyAuth\":{\"description\":\"Find your API Key in your Obsidian settings\\nin the \\\"Local REST API\\\" section under \\\"Plugins\\\".\\n\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/search/simple/","segments":[{"lit":"search"},{"lit":"simple"}],"select":{"$action":"simple","exist":["context_length","query"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0},{"active":true,"args":{},"contract":{"id":"POST /search/","json":"{\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/vnd.olrapi.jsonlogic+json\":{\"examples\":{\"find_by_frontmatter_url_glob\":{\"summary\":\"Find notes having URL or a matching URL glob frontmatter field.\",\"value\":\"{\\n  \\\"or\\\": [\\n    {\\\"===\\\": [{\\\"var\\\": \\\"frontmatter.url\\\"}, \\\"https://myurl.com/some/path/\\\"]},\\n    {\\\"glob\\\": [{\\\"var\\\": \\\"frontmatter.url-glob\\\"}, \\\"https://myurl.com/some/path/\\\"]}\\n  ]\\n}\\n\"},\"find_by_frontmatter_value\":{\"summary\":\"Find notes having a certain frontmatter field value.\",\"value\":\"{\\n  \\\"==\\\": [\\n    {\\\"var\\\": \\\"frontmatter.myField\\\"},\\n    \\\"myValue\\\"\\n  ]\\n}\\n\"},\"find_by_tag\":{\"summary\":\"Find notes having a certain tag\",\"value\":\"{\\n  \\\"in\\\": [\\n    \\\"myTag\\\",\\n    {\\\"var\\\": \\\"tags\\\"}\\n  ]\\n}\\n\"}},\"schema\":{\"externalDocs\":{\"url\":\"https://jsonlogic.com/operations.html\"},\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"items\":{\"properties\":{\"filename\":{\"description\":\"Path to the matching file\",\"type\":\"string\"},\"result\":{\"oneOf\":[{\"type\":\"string\"},{\"type\":\"number\"},{\"items\":{},\"type\":\"array\"},{\"type\":\"object\"},{\"type\":\"boolean\"}]}},\"required\":[\"filename\",\"result\"],\"type\":\"object\"},\"type\":\"array\"}}},\"description\":\"Success\"},\"400\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"errorCode\":{\"description\":\"A 5-digit error code uniquely identifying this particular type of error.\\n\",\"example\":40149,\"type\":\"number\"},\"message\":{\"description\":\"Message describing the error.\",\"example\":\"A brief description of the error.\",\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Bad request.  Make sure you have specified an acceptable\\nContent-Type for your search query.\\n\"}},\"security\":[{\"apiKeyAuth\":[]}],\"securitySchemes\":{\"apiKeyAuth\":{\"description\":\"Find your API Key in your Obsidian settings\\nin the \\\"Local REST API\\\" section under \\\"Plugins\\\".\\n\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/search/","segments":[{"lit":"search"}],"select":{},"transform":{"req":"`reqdata`","res":"`body`"},"index$":1}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"search","name__orig":"search","Name":"Search","name_":"search","name-":"search","NAME":"SEARCH","index$":5}, {"active":true,"entity":"search","key$":"BasicSearchFlow","kind":"basic","name":"BasicSearchFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"search_ref01"},"match":{},"op":"create","spec":[],"valid":[],"index$":0}]}, 'Search')
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
  
