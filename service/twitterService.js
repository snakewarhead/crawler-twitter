require('dotenv').config()
const { until, By, Key } = require('selenium-webdriver')

const selenium = require('../lib/selenium')
const emailSend = require('../lib/emailSend')
const dbTweet = require('../db/dbTweet')

const URL = 'https://twitter.com/'
const LENGHT_TRIM = 20
const DEBUG = process.env.DEBUG

let driver

const init = async () => {
  driver = await selenium.init(process.env.SERVER, process.env.PROXY, 'eager', true)
  return driver
}

const close = async () => {
  if (!driver) {
    return
  }
  await driver.sleep(3000)
  await driver.quit()
}

const crawl = async (name) => {
  console.log(`crawl - ${name}`)

  await init()
  try {
    await driver.get(URL + name)

    const a = await driver.wait(until.elementLocated(By.css('article')), 1 * 60 * 1000, 'not found')
    DEBUG && console.log(`a - ${a}`)
    if (!a) {
      return
    }

    await driver.actions().keyDown(Key.PAGE_DOWN).perform()
    await driver.sleep(5 * 1000)

    const as = await driver.findElements(By.css('article > div > div > div'))
    DEBUG && console.log(`articles - ${as.length}`)

    const contents = []
    for (let a of as) {
      DEBUG && console.log('-------------')
      const ct = { user: name }

      ct.state = 0
      const ai0 = await a.findElement(By.css('div:nth-child(1) span'))
      if (ai0) {
        const ait = await ai0.getText()
        ct.state = ait === '置顶推文' || ait === 'Pinned Tweet' ? 1 : 0
        DEBUG && console.log(`0 - ${ait}`)
      }

      ct.publishTime = ''
      const ai10 = await a.findElement(By.css('div:nth-child(2) time'))
      if (ai10) {
        const ait = await ai10.getAttribute('datetime')
        const aitstr = await ai10.getText()
        ct.publishTime = ait
        DEBUG && console.log(`10 - ${ait} - ${aitstr}`)
      }

      ct.content = ''
      const ai11s = await a.findElements(By.css('div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) span'))
      if (ai11s || ai11s.length > 0) {
        for (let i = 0; i < ai11s.length; ++i) {
          ct.content += await ai11s[i].getText()
        }
        DEBUG && console.log(`11 - ${ct.content}`)
      }

      contents.push(ct)
    }

    DEBUG && console.log('-------------')
    DEBUG && console.log(contents)

    return contents
  } catch (e) {
    console.error(`${name} - ${e}`)
  } finally {
    await close()
  }
}

const action = async (name) => {
  const notice = { name, msg: '' }
  const contents = await crawl(name)
  for (let i = 0; i < contents.length; ++i) {
    const ct = contents[i]
    const exist = await dbTweet.exist(ct.user, ct.state, ct.publishTime)
    if (exist) {
      continue
    }
    notice.msg += `${ct.publishTime} - ${ct.content.substring(0, LENGHT_TRIM)} || `
  }
  if (!notice.msg) {
    console.log(`twitterService action not news - ${name}`)
    return
  }
  await dbTweet.update(contents)

  DEBUG && console.log(`send - ${notice.name} - ${notice.msg}`)
  await emailSend.send(notice.name, notice.msg)
}

module.exports = {
  init,
  close,
  action,
}
