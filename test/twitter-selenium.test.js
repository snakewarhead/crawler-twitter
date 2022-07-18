const chai = require('chai')
const expect = chai.expect

const { Builder, By } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

const lib = require('../lib')

describe('twitter selenium chrome', () => {
  let driver
  before(async () => {
    const options = new chrome.Options()
    driver = await new Builder().setChromeOptions(options).forBrowser('chrome').build()
  })

  it.skip('open browser', async () => {
    await driver.get('https://www.bing.com')

    const res = await driver.getTitle()
    console.log(`title - ${res}`)

    await lib.sleep(3000)
    await driver.quit()
  })

  it('find element', async () => {
    await driver.get('https://www.bing.com')

    const searchBox = await driver.findElement(By.id('sb_form_q'))
    const searchButton = await driver.findElement(By.id('search_icon'))

    await searchBox.sendKeys('Selenium')
    const value = await searchBox.getAttribute('value')
    expect(value).to.be.equal('Selenium')

    await searchButton.click()

    await lib.sleep(3000)
    await driver.quit()
  })
})
