const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const { mkdirSync } = require('node:fs');
const { createServer } = require('../scripts/serve.cjs');
(async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  const base = process.env.TEST_URL || `http://127.0.0.1:${server.address().port}/learn/`;
  const errors = [];
  try {
    mkdirSync('output/playwright', { recursive: true });
    for (const [classId, subject, count] of [['7a', 'geography', 1], ['8', 'gp', 1], ['7b', 'geography', 2], ['7b', 'gp', 2]]) {
      const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base);
      await page.click('[data-action="choose-lesson"]');
      await page.click(`[data-action="select-class"][data-id="${classId}"]`);
      await page.click('[data-action="select-subject"][data-id="online"]');
      assert.equal(await page.locator('.lesson-option').count(), count);
      const id = `online-${classId}-${subject}-2026-10-05`;
      await page.click(`[data-action="select-lesson"][data-lesson="${id}"]`);
      await page.click('[data-action="picker-start"]');
      assert.equal(await page.getByRole('button', { name: 'Read-aloud script', exact: true }).count(), 1);
      const guideLink = page.getByRole('link', { name: 'Open continuous reading guide ↗' });
      assert.ok((await guideLink.getAttribute('href')).endsWith(`#${id}`));
      for (let stage = 0; stage < 6; stage++) {
        await page.getByRole('button', { name: 'Read-aloud script', exact: true }).click();
        const script = page.locator('.slide-teacher-script');
        assert.ok(await script.count() >= 3);
        assert.match(await script.allTextContents().then(p => p.join(' ')), /Pause\./);
        await page.click('[data-action="close-panel"]');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        if (stage < 5) await page.click('[data-action="next-stage"]');
      }
      await page.reload();
      await page.click('[data-action="resume-saved"]');
      assert.equal(await page.locator('[data-action="next-stage"]').isDisabled(), true);
      await page.click('[data-action="tools"]');
      assert.equal(await page.locator('.optional-worksheets').count(), 0);
      await page.close();
      const guide = await browser.newPage({ viewport: { width: 1366, height: 768 } });
      guide.on('pageerror', error => errors.push(error.message));
      await guide.goto(`${base}docs/online-lessons.html#${id}`);
      assert.equal(await guide.locator('article:visible').count(), 1);
      assert.equal(await guide.locator('article:visible section').count(), 6);
      assert.match(await guide.locator('article:visible').textContent(), /Optional final 10 minutes/);
      await guide.screenshot({ path: `output/playwright/${id}.png` });
      await guide.setViewportSize({ width: 390, height: 844 });
      assert.equal(await guide.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await guide.getByRole('link', { name: 'All four scripts', exact: true }).click();
      await guide.waitForFunction(() => [...document.querySelectorAll('article')].every(article => !article.hidden));
      assert.equal(await guide.locator('article:visible').count(), 4);
      await guide.close();
    }
    assert.deepEqual(errors, []);
    console.log('PASS all four online lessons: category isolation, 24 scripts, navigation, saved progress, guide links and mobile reading.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exit(1); });
