const { Builder, until, By } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const proxy = require('selenium-webdriver/proxy')

let driver

const TIMEOUT_SCRIPT = 10 * 1000
const TIMEOUT_PAGELOAD = 30 * 1000
const TIMEOUT_IMPLICIT = 0

const RECT_WINDOW = { width: 1280, height: 720 }
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.101 Safari/537.36'

const init = async (urlServer, urlProxy, strategy, headless) => {
  const options = new chrome.Options()
  options.windowSize(RECT_WINDOW)

  urlProxy && options.setProxy(proxy.socks(urlProxy, 5))
  strategy && options.setPageLoadStrategy(strategy)
  headless && options.headless()

  options.addArguments('--user-agent=' + USER_AGENT)
  options.addArguments('--no-sandbox')
  options.addArguments('--nogpu')
  options.addArguments('—disable-gpu')
  options.addArguments('--enable-javascript')
  options.addArguments('--incognito')

  options.addArguments('--disable-blink-features')
  options.addArguments('--disable-blink-features=AutomationControlled')

  options.excludeSwitches(['enable-automation'])

  const b = new Builder().forBrowser('chrome').setChromeOptions(options)
  urlServer && b.usingServer(urlServer)
  driver = await b.build()

  driver.manage().setTimeouts({ script: TIMEOUT_SCRIPT, pageLoad: TIMEOUT_PAGELOAD, implicit: TIMEOUT_IMPLICIT })

  // const cdpConnection = await driver.createCDPConnection('page')
  // await driver.onLogEvent(cdpConnection, function (event) {
  //   console.log('log:', event)
  // })
  // await cdpConnection.execute('Page.addScriptToEvaluateOnNewDocument', {
  //   source: " Object.defineProperty(navigator, 'webdriver', { get: () => undefined }) ",
  // })
  // await cdpConnection.execute('Network.setUserAgentOverride', { userAgent: USER_AGENT })

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
