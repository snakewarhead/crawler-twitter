require('dotenv').config()
const service = require('./service/twitterService')

const main = async () => {
  await service.init()

  const fn = () => {
    const actions = []
    const ts = process.env.TWITTERS.split(',')
    for (const t of ts) {
      actions.push(service.action(t))
    }
    Promise.all(actions).then(() => console.log('looping end---------'))

    return fn
  }
  setInterval(fn(), process.env.LOOP_WAIT)
}

main().catch(console.error)
