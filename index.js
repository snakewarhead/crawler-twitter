require('dotenv').config()
const db = require('./db')
const service = require('./service/twitterService')

const main = async () => {
  await db.connect()
  await service.init()

  const fn = () => {
    console.log(`looping ${new Date()} ---------`)

    const actions = []
    const ts = process.env.TWITTERS.split(',')
    for (const t of ts) {
      actions.push(service.action(t))
    }
    Promise.all(actions)
      .then(() => console.log('looping end ---------'))
      .catch((e) => console.error(`looping end error - ${new Date()} - ${e}`))

    return fn
  }
  setInterval(fn(), process.env.LOOP_WAIT)
}

main().catch(console.error)
