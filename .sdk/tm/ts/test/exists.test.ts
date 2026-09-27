
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { ObsidianSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = ObsidianSDK.test()
    equal(testsdk instanceof ObsidianSDK, true,
      'ObsidianSDK.test() must return a client synchronously')
  })

})
