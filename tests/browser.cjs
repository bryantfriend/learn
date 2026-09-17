const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createServer } = require('../scripts/serve.cjs');
const output = path.resolve(__dirname, '../output/playwright');
fs.mkdirSync(output, { recursive: true });
const server = createServer();
const reports = [];
let browser;
async function check(name, run) {
    await run();
    reports.push({ name, result: 'PASS' });
    console.log('PASS ' + name);
}
async function action(page, name) {
    if (name === 'start-new') {
        await action(page, 'choose-lesson');
        await page.locator('[data-action="select-class"][data-id="7a"]').click();
        await page.locator('[data-action="select-subject"][data-id="geography"]').click();
        await page.locator('[data-lesson="ready-to-learn-v1"]').click();
        await action(page, 'picker-start');
        return;
    }
    const root = await page.locator('#panel[open]').count() ? page.locator('#panel') : page;
    await root.locator('[data-action="' + name + '"]:visible').first().click();
}
async function stage(page, index) {
    await action(page, 'stages');
    await page.locator('[data-action="jump"][data-stage="' + index + '"]').click();
}
async function state(page) {
    return page.evaluate(function() { return JSON.parse(localStorage.getItem('learn.session.v1')); });
}
async function geometry(page) {
    return page.evaluate(function() {
        const elements = Array.from(document.querySelectorAll('.copy,.copy h1,.copy blockquote,.instructions,.answers,.explanation,.step-controls,.toolbar,.schoolyard,.timer-strip'));
        const toolbar = document.querySelector('.step-controls').getBoundingClientRect();
        const issues = [];
        for (const el of elements) {
            const box = el.getBoundingClientRect();
            if (box.bottom > innerHeight + 1 || box.right > innerWidth + 1 || box.left < -1 || box.top < -1) issues.push(el.className + ' outside viewport ' + JSON.stringify(box.toJSON()));
            if ((el.closest('.copy') || el.matches('.explanation,.schoolyard')) && box.bottom > toolbar.top + 2) issues.push(el.className + ' overlaps step controls');
        }
        for (const btn of document.querySelectorAll('.toolbar button')) if (btn.getBoundingClientRect().height < 56) issues.push('small touch target');
        if (document.documentElement.scrollHeight > innerHeight + 1) issues.push('document scrolls');
        return issues;
    });
}
(async function() {
    await new Promise(function(resolve) { server.listen(4173, '127.0.0.1', resolve); });
    browser = await chromium.launch({ headless: true });
    const mainContext = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
        await mainContext.addInitScript(function() {
            window.schedulerCount = 0;
            const original = window.setInterval;
            window.setInterval = function() { window.schedulerCount += 1; return original.apply(window, arguments); };
        });
    const page = await mainContext.newPage();
    const errors = [];
    const requests = [];
    page.on('pageerror', function(error) { errors.push(error.message); });
    page.on('console', function(message) { if (message.type() === 'error') errors.push(message.text()); });
    page.on('request', function(request) { requests.push(request.url()); });
    await page.goto('http://127.0.0.1:4173/learn/');
    await page.waitForSelector('[data-action="choose-lesson"]');
    await page.screenshot({ path: path.join(output, 'home-1280.png') });
    const initialRequests = requests.length;
    await check('fresh startup without typing; all eight stages and six explanations; final screen', async function() {
        assert.equal(await page.locator('[data-action="resume-saved"]').count(), 0);
        await action(page, 'start-new');
        assert.equal((await state(page)).classLabel, '7A');
        for (let index = 0; index < 8; index += 1) {
            if (index) await action(page, 'next-stage');
            let steps = 0;
            do {
                if (index === 5) {
                    assert.equal(await page.locator('.explanation').count(), 0);
                    await page.locator('[data-answer="B"]').click();
                    assert.equal(await page.locator('.explanation').count(), 0);
                    await action(page, 'reveal');
                    assert.equal(await page.locator('.explanation').count(), 1);
                    steps += 1;
                }
                if (!await page.locator('[data-action="next-step"]').count()) break;
                await action(page, 'next-step');
            } while (true);
            if (index === 5) assert.equal(steps, 6);
        }
        assert.match(await page.locator('#student-title').innerText(), /Thank you/);
        assert.equal((await state(page)).stars, 0);
        assert.equal(requests.length, initialRequests, 'No new content requests during the lesson');
    });
    await check('back preserves reveals; restarting can be cancelled; new session confirmation works', async function() {
        await stage(page, 5);
        assert.equal(await page.locator('.explanation').count(), 1);
        const before = await state(page);
        await action(page, 'tools'); await action(page, 'restart'); await action(page, 'cancel-confirm');
        assert.deepEqual(await state(page), before);
        await action(page, 'tools'); await action(page, 'home');
        await action(page, 'start-new');
        assert.equal(await page.locator('#panel:visible').count(), 1);
        await action(page, 'confirm');
        assert.equal((await state(page)).stage, 0);
    });
    await check('Attention pauses a running timer, counts down, and restores the same frame and running state', async function() {
        await stage(page, 2); await action(page, 'timer'); await action(page, 'toggle-timer');
        const before = await state(page);
        await action(page, 'attention');
        assert.equal((await state(page)).timer.running, false);
        await page.waitForTimeout(3200);
        assert.equal(await page.locator('#attention-instructions:visible').count(), 1);
        assert.equal((await state(page)).stage, before.stage);
        await action(page, 'resume-overlay');
        const after = await state(page);
        assert.equal(after.timer.running, true);
        assert.deepEqual(after.steps, before.steps);
        assert.ok(after.timer.remainingMs > 28000);
    });
    await check('Pause and Attention preserve already paused timers; rapid controls do not duplicate timers', async function() {
        await action(page, 'toggle-timer');
        const before = await state(page);
        await action(page, 'pause'); await page.keyboard.press('Escape');
        assert.equal((await state(page)).timer.running, false);
        await action(page, 'attention'); await action(page, 'resume-overlay');
        assert.equal((await state(page)).timer.remainingMs, before.timer.remainingMs);
        for (let index = 0; index < 6; index += 1) await action(page, 'toggle-timer');
        assert.equal((await state(page)).timer.running, false);
        assert.equal(await page.locator('.timer-strip').count(), 1);
        await action(page, 'add-time');
        assert.ok((await state(page)).timer.remainingMs > 57000);
        await action(page, 'reset-timer');
        assert.equal((await state(page)).timer.remainingMs, 30000);
    });
    await check('refresh recovers stage, reveal, class label and expired deadline paused', async function() {
        await stage(page, 5); await action(page, 'reveal');
        await page.evaluate(function() {
            const key = 'learn.session.v1';
            const s = JSON.parse(localStorage.getItem(key));
            s.timer.running = true; s.timer.deadline = Date.now() - 2000;
            s.classLabel = '<img src=x onerror=alert(1)>';
            localStorage.setItem(key, JSON.stringify(s));
        });
        // A fresh page models a board opening after the previous session ended.
        const recovery = await page.context().newPage();
        await recovery.goto('http://127.0.0.1:4173/learn/');
        await action(recovery, 'resume-saved');
        assert.equal(await recovery.locator('.explanation').count(), 1);
        assert.match(await recovery.locator('#timer-status').innerText(), /Time to regroup/);
        assert.equal(await recovery.locator('.class-label img').count(), 0);
        await recovery.close();
        await page.reload(); await action(page, 'resume-saved');
        assert.equal(await page.locator('.explanation').count(), 1);
    });
    await check('class stars are optional and manual; undo only reverses awards', async function() {
        await action(page, 'tools'); await action(page, 'toggle-stars');
        await action(page, 'add-star');
        assert.equal((await state(page)).stars, 1);
        await action(page, 'undo-star');
        assert.equal((await state(page)).stars, 0);
        assert.equal(await page.locator('[data-action="undo-star"]').isDisabled(), true);
        await action(page, 'toggle-stars'); await action(page, 'close-panel');
    });
    await check('fullscreen rejection is nonblocking and keyboard focus works', async function() {
        await page.evaluate(function() { document.documentElement.requestFullscreen = function() { return Promise.reject(new Error('Denied')); }; });
        await action(page, 'fullscreen');
        await page.waitForTimeout(100);
        assert.match(await page.locator('#notice').innerText(), /Fullscreen is unavailable/);
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(function() { return document.activeElement.tagName; }), 'BUTTON');
    });
    await check('all frames fit 1920×1080, 1366×768 and 1280×720, including visible timer', async function() {
        for (const size of [[1920,1080],[1366,768],[1280,720]]) {
            await page.setViewportSize({ width: size[0], height: size[1] });
            await action(page, 'tools'); await action(page, 'restart'); await action(page, 'confirm'); await action(page, 'timer');
            for (let index = 0; index < 8; index += 1) {
                await stage(page, index);
                // Rewind preserved frame state.
                while (await page.locator('[data-action="previous-step"]').count()) await action(page, 'previous-step');
                do {
                    assert.deepEqual(await geometry(page), [], size.join('×') + ' unrevealed stage ' + index);
                    if (index === 5 && await page.locator('[data-action="reveal"]').count()) await action(page, 'reveal');
                    const issues = await geometry(page);
                    assert.deepEqual(issues, [], size.join('×') + ' stage ' + index + ' ' + await page.locator('#student-title').innerText() + ': ' + issues.join('; '));
                    if (index === 5 && !(await state(page)).steps[5]) await page.screenshot({ path: path.join(output, 'question-' + size[0] + '.png') });
                    if (!await page.locator('[data-action="next-step"]').count()) break;
                    await action(page, 'next-step');
                } while (true);
            }
        }
    });
    await check('corrupt, outdated, unknown and unavailable browser storage all allow a lesson', async function() {
        for (const saved of ['{bad', JSON.stringify({schemaVersion:0}), JSON.stringify({schemaVersion:1,lessonId:'unknown'})]) {
            const context = await browser.newContext();
            await context.addInitScript(function(value) { localStorage.setItem('learn.session.v1', value); }, saved);
            const p = await context.newPage(); await p.goto('http://127.0.0.1:4173/learn/');
            assert.equal(await p.locator('[data-action="resume-saved"]').count(), 0);
            await action(p, 'start-new');
            assert.match(await p.locator('#student-title').innerText(), /Welcome/);
            await context.close();
        }
        const context = await browser.newContext();
        await context.addInitScript(function() { Object.defineProperty(window, 'localStorage', { get: function() { throw new Error('Storage denied'); } }); });
        const p = await context.newPage(); await p.goto('http://127.0.0.1:4173/learn/');
        await action(p, 'start-new'); await action(p, 'next-stage');
        assert.match(await p.locator('#student-title').innerText(), /One voice/);
        await context.close();
    });
    await check('touch controls, one scheduler, and timer expiry never advance or reveal', async function() {
        const context = await browser.newContext({ hasTouch: true, viewport: { width: 1280, height: 720 } });
        const p = await context.newPage();
        await p.clock.install();
        await p.goto('http://127.0.0.1:4173/learn/');
        await action(p, 'start-new');
        await stage(p, 2);
        await p.locator('[data-action="timer"]').tap();
        await p.locator('[data-action="toggle-timer"]').tap();
        const before = await state(p);
        await p.clock.runFor(31000);
        const after = await state(p);
        assert.equal(after.stage, before.stage);
        assert.deepEqual(after.steps, before.steps);
        assert.deepEqual(after.responses, before.responses);
        assert.equal(after.timer.running, false);
        assert.equal(after.timer.remainingMs, 0);
        assert.match(await p.locator('#timer-status').innerText(), /Time to regroup/);
        await p.locator('.toolbar [data-action="attention"]').tap();
        await p.clock.runFor(3200);
        await p.locator('[data-action="resume-overlay"]').tap();
        assert.equal((await state(p)).timer.running, false);
        assert.equal(await page.evaluate(function() { return window.schedulerCount; }), 1);
        await p.screenshot({ path: path.join(output, 'lesson-touch-1280.png') });
        await context.close();
    });
    await check('clear saved session confirms and removes progress', async function() {
        await action(page, 'tools'); await action(page, 'clear-session'); await action(page, 'confirm');
        assert.equal(await page.locator('[data-action="resume-saved"]').count(), 0);
        assert.equal(await state(page), null);
    });
    await check('relative project paths and no console errors or external requests', async function() {
        assert.deepEqual(errors, []);
        assert.ok(requests.every(function(url) { return url.startsWith('http://127.0.0.1:4173/learn/'); }));
    });
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(reports, null, 2));
})().catch(function(error) {
    console.error(error);
    reports.push({ name: 'Failure', error: String(error) });
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(reports, null, 2));
    process.exitCode = 1;
}).finally(async function() {
    if (browser) await browser.close();
    server.close();
});
