const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 60 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const btn = page.locator('button', { hasText: /Evaluate Cesar/i }).first();
  await btn.waitFor({ timeout: 8000 });
  await btn.click();
  await page.waitForTimeout(7500);

  const before = await page.evaluate(() => {
    const d = document.querySelector('[aria-label="Assessment results"]');
    const r = d?.getBoundingClientRect();
    const h = d?.querySelector('.dialog-drag-handle')?.getBoundingClientRect();
    return { left: Math.round(r?.left||0), top: Math.round(r?.top||0), hLeft: Math.round(h?.left||0), hTop: Math.round(h?.top||0), hH: Math.round(h?.height||46) };
  });
  console.log('Before drag:', before);

  const hx = before.hLeft + 150;
  const hy = before.hTop + before.hH / 2;
  console.log(`Dragging header at (${hx}, ${hy}) → (+200, -80)`);

  await page.mouse.move(hx, hy);
  await page.mouse.down();
  await page.waitForTimeout(80);
  for (let i = 1; i <= 20; i++) {
    await page.mouse.move(hx + i*10, hy - i*4, { steps: 1 });
    await page.waitForTimeout(20);
  }
  await page.screenshot({ path: '/tmp/drag2-during.png' });
  await page.mouse.up();
  await page.waitForTimeout(200);
  await page.screenshot({ path: '/tmp/drag2-after.png' });

  const after = await page.evaluate(() => {
    const d = document.querySelector('[aria-label="Assessment results"]');
    const r = d?.getBoundingClientRect();
    return { left: Math.round(r?.left||0), top: Math.round(r?.top||0) };
  });
  console.log('After drag:', after);
  console.log('Delta:', { dx: after.left - before.left, dy: after.top - before.top });

  await browser.close();
})();
