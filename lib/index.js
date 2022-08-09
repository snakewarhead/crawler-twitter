const sleep = async (interval) => {
  return new Promise((resolve) => setTimeout(resolve, interval))
}

const timeNow = () => {
  return new Date().toISOString()
}

// yyyy-MM-dd
const dateNow = () => {
  return timeNow().slice(0, 10)
}

const trimFloat = (n = 0, decimas = 6) => {
  return parseFloat(n.toFixed(decimas) + '')
}

module.exports = {
  sleep,
  dateNow,
  timeNow,
  trimFloat,
}
