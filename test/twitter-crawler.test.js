const Crawler = require('crawler')
const Agent = require('socks5-https-client/lib/Agent')

describe('twitter crawler', () => {
  let crawler
  before(() => {
    crawler = new Crawler({
      rateLimit: 3000,
      maxConnections: 1,
      agentClass: Agent,
      agentOptions: {
        socksHost: '127.0.0.1',
        socksPort: 1080,
      },
    })
  })

  it('crawl', (done) => {
    crawler.direct({
      uri: 'https://twitter.com/elonmusk',
      callback: (error, response) => {
        if (error) {
          console.log(error)
          return
        }
        console.log(response)
        done()
      },
    })
  })
})
