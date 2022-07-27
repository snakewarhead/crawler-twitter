const { Builder, By } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const proxy = require('selenium-webdriver/proxy')

let driver

const init = async (urlServer, urlProxy, strategy, headless) => {
  const options = new chrome.Options()
  urlProxy && options.setProxy(proxy.socks(urlProxy, 5))
  strategy && options.setPageLoadStrategy(strategy)
  headless && options.headless()
  driver = await new Builder().usingServer(urlServer).forBrowser('chrome').setChromeOptions(options).build()
  console.log(driver)
}

const grab = async (url, xpaths, deal) => {
  await driver.get(url)

  const es = []
  for (const p of xpaths) {
    let e = await driver.findElement(By.xpath(p))
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
