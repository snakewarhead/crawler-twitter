require('dotenv').config()
const service = require('./service/twitterService')

const main = async () => {
  await service.init()

  const fn = () => {
    const ts = process.env.TWITTERS.split(',')
    for (const t of ts) {
      console.log(t, '------------')
    }
    return fn
  }
  setInterval(fn(), process.env.LOOP_WAIT)
}

main().catch(console.error)
