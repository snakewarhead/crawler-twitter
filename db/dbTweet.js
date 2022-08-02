const db = require('./index')

const coll = 'tweet'

const find = async (fitler, options) => {
  return await db.find(coll, fitler, options)
}

const count = async (filter) => {
  return await db.countDocuments(coll, filter)
}

module.exports = {
  find,
  count,
}
