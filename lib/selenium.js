const { Builder, until, By } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const proxy = require('selenium-webdriver/proxy')

let driver

const TIMEOUT_SCRIPT = 10 * 1000
const TIMEOUT_PAGELOAD = 30 * 1000
const TIMEOUT_IMPLICIT = 0

const init = async (urlServer, urlProxy, strategy, headless) => {
  const options = new chrome.Options()
  urlProxy && options.setProxy(proxy.socks(urlProxy, 5))
  strategy && options.setPageLoadStrategy(strategy)
  headless && options.headless()

  const b = new Builder().forBrowser('chrome').setChromeOptions(options)
  urlServer && b.usingServer(urlServer)
  driver = await b.build()

  driver.manage().setTimeouts({ script: TIMEOUT_SCRIPT, pageLoad: TIMEOUT_PAGELOAD, implicit: TIMEOUT_IMPLICIT })

  console.log('driver inited - ', await driver.getSession())

  return driver
}

const grab = async (url, xpaths, timeout, deal) => {
  await driver.get(url)

  const es = []
  for (const p of xpaths) {
    const e = await driver.wait(until.elementLocated(By.xpath(p)), timeout, `not found - ${p}`)
    if (deal) {
      e = await deal(e)
    }
    es.push(e)

    console.log(`element - ${e}`)
  }
  return es
}

module.exports = {
  init,
  grab,
}
