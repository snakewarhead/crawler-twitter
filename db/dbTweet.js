const db = require('./index')

const coll = 'tweet'

/*
tweet - {
  _id: xxx,
  user: xxx,
  name: '',
  state: 1, // 1 - 置顶
  content: '',
  publishTime: '',
  updateTime: '',
}
*/

const find = async (fitler, options) => {
  return await db.find(coll, fitler, options)
}

const count = async (filter) => {
  return await db.countDocuments(coll, filter)
}

const update = async (tweets) => {
  const opers = []
  tweets.forEach((i) => {
    i.updateTime = new Date().toISOString()
    const o = {
      updateOne: {
        filter: { user: i.user, publishTime: i.publishTime },
        update: { $set: i },
        upsert: true,
      },
    }
    opers.push(o)
  })
  if (opers.length === 0) {
    return false
  }

  return await db.bulkWrite(coll, opers)
}

module.exports = {
  find,
  count,
  update,
}
