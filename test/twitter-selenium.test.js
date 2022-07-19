const { expect } = require('chai')

const { Builder, By } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const proxy = require('selenium-webdriver/proxy')

const lib = require('../lib')

describe('twitter selenium chrome', () => {
  let driver
  before(async () => {
    const options = new chrome.Options()
    options.setProxy(proxy.socks('192.168.1.100:1082', 5))
    driver = await new Builder().setChromeOptions(options).forBrowser('chrome').build()
  })

  afterEach(async () => {
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

  it('proxy', async () => {
    await driver.get('https://www.google.com')

    const res = await driver.getCurrentUrl()
    console.log(`url - ${res}`)
  })
})
