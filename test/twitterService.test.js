require('dotenv').config()
const { expect } = require('chai')

const service = require('../service/twitterService')

describe('twitter service', () => {
  before(async () => {
    await service.init()
  })

  it('action', async () => {
    await service.crawl('federalreserve')
  })
})
