const puppeteer = require('puppeteer');
const logger = require('pino')();
(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const timeout = 5000;
  page.setDefaultTimeout(timeout);

  try {
    await page.goto("http://localhost:8000");
    await page.waitForSelector(`#fname`, {timeout, visible: true});

    const title = await page.title();
    logger.info(title);
  } catch (err) {
    logger.error(err);
  } finally {
    await browser.close();
  }
})();