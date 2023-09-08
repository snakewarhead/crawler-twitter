require('dotenv').config()
const { until, By, Key } = require('selenium-webdriver')

const selenium = require('../lib/selenium')
const emailSend = require('../lib/emailSend')
const dbTweet = require('../db/dbTweet')

const URL = 'https://twitter.com/'
const TIMEOUT_WAIT_ARTICLE = 30 * 1000
const LENGHT_TRIM = 100
const DEBUG = process.env.DEBUG

const init = async () => {
  const driver = await selenium.init(process.env.SERVER, process.env.PROXY, 'eager', eval(process.env.HEADLESS))
  return driver
}

const close = async (driver) => {
  if (!driver) {
    return
  }
  // await driver.sleep(3000)
  await driver.quit()
}

const crawl = async (name) => {
  console.log(`crawl - ${name} - ${new Date()}`)

  const driver = await init()

  const contents = []
  try {
    await driver.get(URL + name)

    // await driver.executeScript('console.log(navigator.userAgent)')
    // console.log('navigator-----')

    // const shot = await driver.takeScreenshot()
    // require('fs').writeFileSync('out.png', shot, 'base64', function (err) {
    //   console.log('screenshoted')
    // })

    const a = await driver.wait(until.elementLocated(By.css('article')), TIMEOUT_WAIT_ARTICLE, 'not found')
    if (!a) {
      return
    }
    DEBUG && console.log(`page loaded`)

    await driver.actions().keyDown(Key.PAGE_DOWN).perform()
    await driver.sleep(5 * 1000)

    const as = await driver.findElements(By.css('article > div > div'))
    DEBUG && console.log(`articles - ${as.length}`)

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
  } catch (e) {
    console.error(`${name} - ${e}`)
  } finally {
    await close(driver)
  }

  DEBUG && console.log('-------------')
  DEBUG && console.log(contents)

  return contents
}

const action = async (name) => {
  const notice = { name, msg: '' }
  const contents = await crawl(name)
  if (!contents?.length) {
    return
  }

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
  await emailSend.send(notice.name, notice.msg, undefined, undefined, { translate: true })
}

module.exports = {
  init,
  close,
  crawl,
  action,
}
