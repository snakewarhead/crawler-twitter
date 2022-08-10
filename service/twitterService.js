require('dotenv').config()
const { until, By, Key } = require('selenium-webdriver')
const selenium = require('../lib/selenium')

const URL = 'https://twitter.com/'
const DEBUG = process.env.DEBUG

let driver

const init = async () => {
  driver = await selenium.init(process.env.SERVER, process.env.PROXY, 'eager', true)
  return driver
}

const close = async () => {
  await driver.sleep(3000)
  await driver.quit()
}

const action = async (name) => {
  await driver.get(URL + name)

  const res = await driver.getCurrentUrl()
  console.log(`url - ${res}`)

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

    ct.state = ''
    const ai0 = await a.findElement(By.css('div:nth-child(1) span'))
    if (ai0) {
      const ait = await ai0.getText()
      ct.state = ait
      DEBUG && console.log(`0 - ${ait}`)
    }

    ct.time = ''
    const ai10 = await a.findElement(By.css('div:nth-child(2) time'))
    if (ai10) {
      const ait = await ai10.getAttribute('datetime')
      const aitstr = await ai10.getText()
      ct.time = ait
      DEBUG && console.log(`10 - ${ait} - ${aitstr}`)
    }

    ct.info = ''
    const ai11s = await a.findElements(By.css('div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) span'))
    if (ai11s || ai11s.length > 0) {
      for (let i = 0; i < ai11s.length; ++i) {
        ct.info += await ai11s[i].getText()
      }
      DEBUG && console.log(`11 - ${ct.info}`)
    }

    contents.push(ct)
  }

  DEBUG && console.log('-------------')
  DEBUG && console.log(contents)

  return contents
}

module.exports = {
  init,
  close,
  action,
}
