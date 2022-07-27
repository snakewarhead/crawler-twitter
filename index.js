require('dotenv').config()
const selenium = require('./lib/selenium')

const URL = 'https://twitter.com/'
const INTERVAL = 1 * 60 * 60 * 1000

const main = async () => {
  await selenium.init(process.env.SERVER, process.env.PROXY, 'eager', true)

  const fn = () => {
    const ts = process.env.TWITTERS.split(',')
    for (const t of ts) {
      console.log(t, '------------')
    }
    return fn
  }
  setInterval(fn(), INTERVAL)
}

main().catch(console.error)
