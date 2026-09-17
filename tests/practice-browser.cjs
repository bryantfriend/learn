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
let page;
async function check(name, run) {
    await run(); reports.push({name, result:'PASS'}); console.log('PASS ' + name);
}
async function action(name) {
    const root = await page.locator('#panel[open]').count() ? page.locator('#panel') : page;
    await root.locator('[data-action="' + name + '"]:visible').first().click();
}
async function state() { return page.evaluate(function() { return JSON.parse(localStorage.getItem('learn.session.v1')); }); }
async function jump(index) { await action('stages'); await page.locator('[data-stage="' + index + '"]').click(); }
async function startPractice() {
    await action('choose-lesson');
    await page.locator('[data-lesson="system-practice-01"]').click();
    await action('start-new');
    if (await page.locator('[data-action="confirm"]:visible').count()) await action('confirm');
}
async function geometry() {
    return page.evaluate(function() {
        const issues = [];
        const controls = document.querySelector('.step-controls').getBoundingClientRect();
        const content = document.querySelector('.teaching-content').getBoundingClientRect();
        const nodes = document.querySelectorAll('.copy,.copy h1,.instructions,.choice-grid,.answers,.answer-detail,.memory-grid,.explanation,.footnote,.step-controls,.toolbar,.timer-strip');
        for (const node of nodes) {
            const r = node.getBoundingClientRect();
            if (r.bottom > innerHeight + 1 || r.top < -1 || r.right > innerWidth + 1 || r.left < -1) issues.push(node.className + ' outside viewport');
            if (node.closest('.teaching-content') && (r.bottom > controls.top + 2 || r.top < content.top - 2)) issues.push(node.className + ' overlaps controls/header');
        }
        for (const control of document.querySelectorAll('.toolbar button,.step-controls button')) if (control.getBoundingClientRect().height < 56) issues.push('short touch target');
        if (document.documentElement.scrollHeight > innerHeight + 1) issues.push('page scrolls');
        return issues;
    });
}
(async function() {
    const { practiceLesson } = await import('../src/lessons/system-practice.js');
    await new Promise(function(resolve) { server.listen(4174, '127.0.0.1', resolve); });
    browser = await chromium.launch({headless:true});
    const context = await browser.newContext({viewport:{width:1280,height:720}, hasTouch:true});
    page = await context.newPage();
    await page.clock.install();
    const errors = [], requests = [];
    page.on('pageerror',function(error) { errors.push(error.message); });
    page.on('console',function(message) { if(message.type()==='error')errors.push(message.text()); });
    page.on('request',function(request) { requests.push(request.url()); });
    await page.goto('http://127.0.0.1:4174/learn/');
    await check('practice lesson selector, title, subtitle and opening scripts', async function() {
        await action('choose-lesson');
        assert.equal(await page.locator('[data-action="select-lesson"]').count(),2);
        await page.locator('[data-lesson="system-practice-01"]').tap();
        assert.match(await page.locator('.lesson-card').innerText(),/A practice lesson for our new classroom system/);
        await page.screenshot({path:path.join(output,'practice-home-1280.png')});
        await action('start-new');
        assert.match(await page.locator('#student-title').innerText(),/WELCOME TO YOUR FIRST MISSION/);
        assert.match(await page.locator('.voice-level').innerText(),/0/);
        assert.equal(await page.locator('.star-count').count(),0);
        await action('tools');await action('notes');
        assert.match(await page.locator('#panel').innerText(),/We are trying something new today/);
        assert.match(await page.locator('#panel').innerText(),/Keep it in your head/);
        await action('close-panel');await action('timer');
    });
    await check('full nine-stage practice lesson, real Attention, all reveals and manual memory challenge',async function() {
        let revealed = 0;
        for(let stageIndex=0;stageIndex<9;stageIndex+=1) {
            if(stageIndex)await action('next-stage');
            const stage = practiceLesson.stages[stageIndex];
            for(let step=0;step<stage.frames.length;step+=1) {
                const frame = stage.frames[step];
                assert.equal(await page.locator('#student-title').innerText(),frame.title);
                assert.match(await page.locator('.voice-level').innerText(),new RegExp(String(frame.voiceLevel)));
                assert.deepEqual(await geometry(),[], 'stage '+stageIndex+' step '+step);
                if(stageIndex===0 && step===1)assert.equal(await page.locator('.choice-grid li').count(),6);
                if(frame.type==='opinion') {
                    await page.locator('[data-action="select-answer"]').last().click();
                    assert.equal(await page.locator('[data-action="reveal"]').count(),0);
                    assert.equal(await page.locator('.explanation').count(),0);
                }
                if(frame.afterAttention || frame.cue) {
                    await action('toggle-timer');
                    assert.equal((await state()).timer.running,true);
                    await page.locator('.toolbar [data-action="attention"]').tap();
                    assert.equal((await state()).timer.running,false);
                    await page.clock.runFor(3200);
                    assert.equal(await page.locator('#attention-instructions:visible').count(),1);
                    await action('resume-overlay');
                    assert.equal((await state()).timer.running,true);
                    assert.equal((await state()).stage,stageIndex);
                    assert.equal((await state()).steps[stageIndex],step);
                    if(frame.afterAttention) {
                        assert.equal(await page.locator('#student-title').innerText(),frame.afterAttention.title);
                        assert.match(await page.locator('.voice-level').innerText(),/0/);
                    }
                    await action('toggle-timer');
                }
                if(frame.type==='question') {
                    if(await page.locator('[data-action="select-answer"]').count()) {
                        await page.locator('[data-action="select-answer"]').last().click();
                        assert.equal(await page.locator('.explanation').count(),0);
                    }
                    await action('reveal'); revealed+=1;
                    assert.equal(await page.locator('.explanation').count(),1);
                    if(frame.suggested)assert.match(await page.locator('.explanation').innerText(),/Suggested:.*Can anyone defend/s);
                    assert.deepEqual(await geometry(),[], 'revealed stage '+stageIndex+' step '+step);
                    if(stageIndex===6 && step===5)await page.screenshot({path:path.join(output,'practice-quiz-1280.png')});
                }
                if(stageIndex===5) {
                    if(step===0) {
                        assert.equal(await page.locator('.memory-item').count(),9);
                        await action('toggle-timer');await page.clock.runFor(13000);
                        assert.equal(await page.locator('.memory-item').count(),9,'expiry never hides grid');
                        assert.equal((await state()).timer.running,false);
                        await page.clock.runFor(7000);
                        await page.screenshot({path:path.join(output,'practice-memory-1280.png')});
                    } else if(step===1) {
                        assert.equal(await page.locator('.memory-item').count(),0);
                        await page.reload();await action('resume-saved');
                        assert.equal((await state()).lessonId,'system-practice-01');
                        assert.equal(await page.locator('.memory-item').count(),0,'hidden after refresh');
                        assert.equal((await state()).timer.running,false);
                    } else if(step===3)assert.equal(await page.locator('.memory-item').count(),9);
                }
                if(frame.discussionId)await action('mark-discussed');
                if(step<stage.frames.length-1)await action('next-step');
            }
        }
        assert.equal(revealed,13);
        assert.equal((await state()).stars,0);
        await action('summary');
        assert.equal(await page.locator('[data-summary="stages"]').innerText(),'9 / 9');
        assert.equal(await page.locator('[data-summary="questions"]').innerText(),'20');
        assert.equal(await page.locator('[data-summary="stars"]').count(),0);
        assert.match(await page.locator('[data-summary="duration"]').innerText(),/About \d+ minutes?/);
        await page.screenshot({path:path.join(output,'practice-summary-1280.png')});
        await action('close-panel');
    });
    await check('summary, voice, discussion flags and reveals survive refresh without double counting',async function() {
        const before=await state();
        await page.reload();await action('resume-saved');await action('summary');
        assert.equal(await page.locator('[data-summary="stages"]').innerText(),'9 / 9');
        assert.equal(await page.locator('[data-summary="questions"]').innerText(),'20');
        assert.equal((await state()).startedAt,before.startedAt);
        await action('close-panel');
        await jump(6);
        assert.equal(await page.locator('.explanation').count(),1);
        await action('mark-discussed');
        assert.equal((await state()).discussedQuestions.length,19);
        await action('mark-discussed');
        assert.equal((await state()).discussedQuestions.length,20);
        await action('tools');await action('toggle-stars');await action('add-star');await action('close-panel');
        await jump(8);await action('summary');
        assert.equal(await page.locator('[data-summary="stars"]').innerText(),'1');
        await action('close-panel');
    });
    await check('switching lessons never misattributes saved progress; cancel replacement is safe',async function() {
        await action('tools');await action('home');
        const before=await state();
        await action('choose-lesson');await page.locator('[data-lesson="ready-to-learn-v1"]').click();
        await action('start-new');await action('cancel-confirm');
        assert.deepEqual(await state(),before);
        await action('resume-saved');
        assert.equal((await state()).lessonId,'system-practice-01');
        assert.equal(await page.locator('.stage-dots span').count(),9);
        await action('tools');await action('home');await action('start-new');await action('confirm');
        assert.equal((await state()).lessonId,'ready-to-learn-v1');
        assert.equal(await page.locator('.stage-dots span').count(),8);
        assert.equal(await page.locator('.voice-level').count(),0);
    });
    await check('all practice frames fit all three board sizes, with timers and revealed answers',async function() {
        for(const size of [[1920,1080],[1366,768],[1280,720]]) {
            await page.setViewportSize({width:size[0],height:size[1]});
            await action('tools');await action('home');await startPractice();await action('timer');
            for(let stageIndex=0;stageIndex<9;stageIndex+=1) {
                if(stageIndex)await action('next-stage');
                for(let step=0;step<practiceLesson.stages[stageIndex].frames.length;step+=1) {
                    const frame=practiceLesson.stages[stageIndex].frames[step];
                    assert.deepEqual(await geometry(),[],size+' stage '+stageIndex+' step '+step);
                    if(frame.type==='question') {
                        await action('reveal');
                        assert.deepEqual(await geometry(),[],size+' revealed '+stageIndex+':'+step);
                    }
                    if(step<practiceLesson.stages[stageIndex].frames.length-1)await action('next-step');
                }
            }
            await action('summary');
            assert.equal(await page.locator('[data-summary="stages"]').innerText(),'9 / 9');
            assert.equal(await page.locator('[data-summary="questions"]').innerText(),'0','no automatic discussion credit');
            await action('close-panel');
        }
    });
    await check('skipped stages do not count as completed and Pause leaves a paused timer paused',async function() {
        await action('tools');await action('restart');await action('confirm');
        await jump(8);
        for(let index=0;index<3;index+=1)await action('next-step');
        await action('pause');await action('resume-overlay');
        assert.equal((await state()).timer.running,false);
        await action('summary');
        assert.equal(await page.locator('[data-summary="stages"]').innerText(),'0 / 9');
        assert.equal(await page.locator('[data-summary="questions"]').innerText(),'0');
        await action('close-panel');
    });
    await check('no console errors, external assets or student profile fields',async function() {
        assert.deepEqual(errors,[]);
        assert.ok(requests.every(function(url) { return url.startsWith('http://127.0.0.1:4174/learn/'); }));
        assert.ok(!('studentNames' in await state()));
    });
    fs.writeFileSync(path.join(output,'practice-results.json'),JSON.stringify(reports,null,2));
})().catch(async function(error) {
    console.error(error);
    reports.push({name:'Failure',error:String(error)});
    if(page)await page.screenshot({path:path.join(output,'practice-failure.png')}).catch(function(){});
    fs.writeFileSync(path.join(output,'practice-results.json'),JSON.stringify(reports,null,2));
    process.exitCode=1;
}).finally(async function() { if(browser)await browser.close();server.close(); });
