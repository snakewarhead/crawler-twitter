require('dotenv').config()
const { expect } = require('chai')

const { Builder, until, By, Key } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const proxy = require('selenium-webdriver/proxy')

const lib = require('../lib')
const selenium = require('../lib/selenium')

describe('twitter selenium chrome', () => {
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

  it('proxy', async () => {
    await driver.get('https://twitter.com/Jiangzhuoer2')

    const res = await driver.getCurrentUrl()
    console.log(`url - ${res}`)

    const a = await driver.wait(until.elementLocated(By.css('article')), 1 * 60 * 1000, 'not found')
    console.log(`a - ${a}`)
    if (!a) {
      return
    }

    await driver.actions().keyDown(Key.PAGE_DOWN).perform()
    await lib.sleep(5 * 1000)

    const as = await driver.findElements(By.css('article > div > div > div'))
    console.log(`articles - ${as.length}`)

    const contents = []
    for (let a of as) {
      console.log('-------------')
      const ct = {}

      ct.state = ''
      const ai0 = await a.findElement(By.css('div:nth-child(1) span'))
      if (ai0) {
        const ait = await ai0.getText()
        ct.state = ait
        console.log(`0 - ${ait}`)
      }

      ct.time = ''
      const ai10 = await a.findElement(By.css('div:nth-child(2) time'))
      if (ai10) {
        const ait = await ai10.getAttribute('datetime')
        const aitstr = await ai10.getText()
        ct.time = ait
        console.log(`10 - ${ait} - ${aitstr}`)
      }

      ct.info = ''
      const ai11s = await a.findElements(By.css('div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) span'))
      if (ai11s || ai11s.length > 0) {
        for (let i = 0; i < ai11s.length; ++i) {
          ct.info += await ai11s[i].getText()
        }
        console.log(`11 - ${ct.info}`)
      }

      contents.push(ct)
    }

    console.log('-------------')
    console.log(contents)
  })
})
