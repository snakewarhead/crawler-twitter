require('dotenv').config()
const { TwitterApi } = require('twitter-api-v2')
const HttpProxyAgent = require('https-proxy-agent')

describe('twitter api v2', () => {
  let client

  before(() => {
    const httpAgent = process.env.PROXY_HTTP && new HttpProxyAgent(process.env.PROXY_HTTP)
    client = new TwitterApi(process.env.API_TOKEN, { httpAgent })
  })

  it('get current user', async () => {
    const meUser = await client.v2.me()
    console.log(meUser)
  })
})
