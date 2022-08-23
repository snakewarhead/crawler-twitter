require('dotenv').config()
const { expect } = require('chai')

const service = require('../service/twitterService')

describe('twitter service', () => {
  it('action', async () => {
    await service.crawl('bagetanbi1')
  })
})
