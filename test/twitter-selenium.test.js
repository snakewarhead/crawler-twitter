require('dotenv').config()
const { expect } = require('chai')

const { until, By, Key } = require('selenium-webdriver')

const lib = require('../lib')
const selenium = require('../lib/selenium')

describe('selenium chrome', () => {
  let driver
  before(async () => {
    driver = await selenium.init(process.env.SERVER, process.env.PROXY, 'eager', false)
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

    await lib.sleep(2000)

    const a1 = await driver.findElement(By.css('#b-scopeListItem-images > a'))
    const a1a = await a1.getAttribute('href')
    const a1p = await a1.getProperty('href')
    console.log(a1a, '-', a1p)
  })

  it.skip('tag time', async () => {
    await driver.get('https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_time')

    const btn = await driver.findElement(By.id('runbtn'))
    await btn.click()

    await driver.sleep(2000)

    await driver.switchTo().frame('iframeResult')
    const t = await driver.findElement(By.css('body > p:nth-child(3) > time:nth-child(1)'))
    const td = await t.getAttribute('datetime')
    console.log(td)
  })

  it.skip('Rect', async () => {
    await driver.get('https://www.bing.com')

    const res = await driver.getCurrentUrl()
    console.log(`url - ${res}`)

    const r = await driver.manage().window().getRect()
    console.log('rect', r)
  })

  it.skip('session', async () => {
    let res

    const fn = async (url) => {
      await driver.get(url)
      await driver.sleep(3000)
      res = await driver.getCurrentUrl()
      console.log(`url - ${res}`)
    }

    await Promise.all([fn('https://www.bing.com'), fn('https://www.baidu.com/')])
  })

  it('proxy', async () => {
    await driver.get('https://www.google.com/')

    // const tagInput = await driver.findElement(By.css('.gLFyf'))
    // await tagInput.sendKeys('aaabbb')

    // const tagBtn = await driver.findElement(By.css('.CqAVzb > center:nth-child(2) > input:nth-child(1)'))
    const tagBtn = await driver.findElement(By.css('.FPdoLc > center:nth-child(1) > input:nth-child(2)'))
    await tagBtn.click()
  })
})
