const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
const {createServer}=require('../scripts/serve.cjs');const server=createServer();let browser;
(async()=>{
 await new Promise(r=>server.listen(4178,'127.0.0.1',r));browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage();
 await page.goto(process.env.LEARN_URL||'http://127.0.0.1:4178/learn/');
 async function a(n){const root=await page.locator('#panel[open]').count()?page.locator('#panel'):page;await root.locator('[data-action="'+n+'"]').first().click();}
 await a('choose-lesson');await page.locator('[data-id="8"]').click();await a('year-plan');await page.locator('[data-quarter="Q4"]').click();
 await page.locator('[data-plan-id="g8-gp-5.1"] summary').click();await page.locator('[data-plan-id="g8-gp-5.1"] button').click();
 assert.equal(await page.locator('[data-lesson="g8-gp-5.1"]').getAttribute('aria-pressed'),'true');
 await a('picker-start');await a('next-stage');await page.screenshot({path:'output/playwright/gp-source-board.png'});
 await a('switch-class');assert.equal(await page.locator('[data-quarter="Q4"]').getAttribute('aria-pressed'),'true');
 await page.locator('[data-lesson="g8-gp-q4"]').click();await a('picker-start');
 const [paper]=await Promise.all([context.waitForEvent('page'),page.locator('.copy .exam-link').click()]);
 await paper.waitForSelector('.paper-sheet');assert.equal(await paper.locator('.question').count(),16);assert.equal(await paper.locator('.key-answer').count(),0);
 await paper.evaluate(()=>{window.print=()=>{window.printInvoked=true};});await paper.locator('#print-button').click();assert.equal(await paper.evaluate(()=>window.printInvoked),true);
 await a('tools');const [key]=await Promise.all([context.waitForEvent('page'),page.locator('#panel a').filter({hasText:'Teacher answer key'}).click()]);
 await key.waitForSelector('.key-answer');assert.equal(await key.locator('.key-answer').count(),16);
 console.log('PASS plan launch, remembered quarter, student paper, print command and separate key');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
