const { expect } = require('chai')

const { Builder, until, By } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const proxy = require('selenium-webdriver/proxy')

const lib = require('../lib')

describe('twitter selenium chrome', () => {
  let driver
  before(async () => {
    const options = new chrome.Options()
    options.setProxy(proxy.socks('192.168.1.100:1082', 5))
    options.setPageLoadStrategy('eager')
    // options.headless()
    driver = await new Builder().usingServer('http://192.168.1.105:4444').forBrowser('chrome').setChromeOptions(options).build()

    console.log('driver inited - ', await driver.getSession())
  })

  after(async () => {
    await lib.sleep(3000)
    await driver.quit()
  })

  it.skip('open browser', async () => {
    await driver.get('https://www.bing.com')

    const res = await driver.getTitle()
    console.log(`title - ${res}`)
  })

  it.skip('find element', async () => {
    await driver.get('https://www.bing.com')

    const searchBox = await driver.findElement(By.id('sb_form_q'))
    const searchButton = await driver.findElement(By.id('search_icon'))

    await searchBox.sendKeys('Selenium')
    const value = await searchBox.getAttribute('value')
    expect(value).to.be.equal('Selenium')

    await searchButton.click()
  })

  it.skip('Rect', async () => {
    await driver.get('https://www.bing.com')

    const res = await driver.getCurrentUrl()
    console.log(`url - ${res}`)

    const r = await driver.manage().window().getRect()
    console.log('rect', r)
  })

  it('proxy', async () => {
    await driver.get('https://twitter.com/bitfish1')

    const res = await driver.getCurrentUrl()
    console.log(`url - ${res}`)

    const a = await driver.wait(until.elementLocated(By.css('article')), 1 * 60 * 1000, 'not found')
    console.log(`a - ${a}`)
    if (!a) {
      return
    }

    const as = await driver.findElements(By.css('article > div > div > div'))
    console.log(`as - ${as.length}`)

    const contents = []
    for (let a of as) {
      console.log('-------------')
      const ais = await a.findElements(By.css('div:nth-child(n)'))
      const ct = {}

      ct.state = ''
      const ai0 = await ais[0].findElement(By.css('span'))
      if (ai0) {
        const ait = await ai0.getText()
        ct.state = ait
        console.log(`0 - ${ait}`)
      }

      ct.time = ''
      const ai10 = await ais[1].findElement(By.css('time'))
      if (ai10) {
        const ait = await ai10.getText()
        ct.time = ait
        console.log(`10 - ${ait}`)
      }

      ct.info = ''
      const ai11 = await ais[1].findElement(By.css('div:nth-child(2) > div:nth-child(2) > div:nth-child(1) span'))
      if (ai11) {
        const ait = await ai11.getText()
        ct.info = ait
        console.log(`11 - ${ait}`)
      }

      contents.push(ct)
    }

    console.log(contents)
  })
})
