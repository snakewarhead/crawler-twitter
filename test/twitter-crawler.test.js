// const Crawler = require('crawler')

// const PROXY = 'http://127.0.0.1:1081'

// describe('twitter crawler', () => {
//   let crawler
//   before(() => {
//     crawler = new Crawler({
//       rateLimit: 3000,
//       maxConnections: 1,
//       userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:102.0) Gecko/20100101 Firefox/102.0',
//     })
//   })

//   it.skip('crawl google', (done) => {
//     const URL = 'https://www.google.com/'
//     crawler.direct({
//       uri: URL,
//       proxy: PROXY,
//       callback: (error, res) => {
//         if (error) {
//           console.error(error)
//           return
//         }

//         console.log(res.statusCode, '-------------')
//         console.log(res.$('#SIvCob > a:nth-child(1)').text())

//         done()
//       },
//     })
//   })

//   it('crawl twitter', (done) => {
//     const URL = 'https://twitter.com/elonmusk'
//     crawler.queue({
//       uri: URL,
//       proxy: PROXY,
//       callback: (error, res) => {
//         if (error) {
//           console.error(error)
//           return
//         }

//         console.log(res.statusCode, '-------------')
//         console.log(res.body) // JavaScript is not available.
//         console.log('content', res.$('#id__9nfs1ilbodo > span:nth-child(1)').text())

//         done()
//       },
//     })
//   })
// })
