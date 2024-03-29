require('dotenv').config()
const { expect } = require('chai')

const service = require('../service/twitterService')

describe('twitter service', () => {
  before(async () => {
    await service.init()
  })

  it('action', async () => {
    const ts = process.env.TWITTERS.split(',')
    for (const t of ts) {
      // await service.crawl(t)
      await service.action(t)
    }
  })
})
