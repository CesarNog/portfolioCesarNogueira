const { chromium } = require('playwright');
const TARGET_URL = 'http://localhost:3000';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const shots = [
    { name: 'desktop-full', viewport: { width: 1440, height: 900 }, fullPage: true },
    { name: 'mobile-full', viewport: { width: 390, height: 844 }, fullPage: true },
    { name: 'desktop-hero', viewport: { width: 1440, height: 900 }, fullPage: false },
    { name: 'mobile-hero', viewport: { width: 390, height: 844 }, fullPage: false },
  ];
  for (const shot of shots) {
    const page = await browser.newPage();
    await page.setViewportSize(shot.viewport);
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `/tmp/portfolio-audit/${shot.name}.png`, fullPage: shot.fullPage });
    console.log('shot: ' + shot.name);
    await page.close();
  }
  await browser.close();
})();
