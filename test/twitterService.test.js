require('dotenv').config()
const { expect } = require('chai')

const service = require('../service/twitterService')

describe('twitter service', () => {
  before(async () => {
    await service.init()
  })

  after(async () => {
    await service.close()
  })

  it('action', async () => {
    await service.action('Jiangzhuoer2')
  })
})
