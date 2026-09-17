const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
const {createServer}=require('../scripts/serve.cjs');const server=createServer();let browser;
(async()=>{
 await new Promise(r=>server.listen(4180,'127.0.0.1',r));browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LEARN_URL||'http://127.0.0.1:4180/learn/');
 async function a(n){const root=await page.locator('#panel[open]').count()?page.locator('#panel'):page;await root.locator('[data-action="'+n+'"]').first().click();}
 await a('choose-lesson');await page.locator('[data-id="7a"]').click();await page.locator('[data-id="geography"]').click();await a('g7-plan');
 for(const size of [[1280,720],[390,844]]){
  await page.setViewportSize({width:size[0],height:size[1]});
  assert.deepEqual(await page.evaluate(()=>['#panel','.picker-footer'].filter(s=>{const r=document.querySelector(s).getBoundingClientRect();return r.top<0||r.left<0||r.bottom>innerHeight+1||r.right>innerWidth+1;})),[]);
 }
 await page.setViewportSize({width:1280,height:720});
 await page.locator('[data-quarter="Q4"]').click();await page.screenshot({path:'output/playwright/g7-weekly-plan.png'});
 await page.locator('[data-action="g7-open"][data-lesson="g7a-geo-w29-1"]').click();
 assert.equal(await page.locator('[data-lesson="g7a-geo-w29-1"]').getAttribute('aria-pressed'),'true');
 await a('picker-start');await a('next-stage');await a('next-stage');await a('next-step');await a('next-step');
 await page.locator('.lesson-visual svg,.gp-diagram').evaluate(async img=>{if(img.tagName==='IMG'){await img.decode();if(!img.naturalWidth)throw Error('Diagram failed to load');}});await page.screenshot({path:'output/playwright/g7-grid-board.png'});
 await a('switch-class');await page.locator('[data-quarter="Q4"]').click();await page.locator('[data-lesson="g7a-geo-w36-1"]').click();await a('picker-start');
 const [paper]=await Promise.all([context.waitForEvent('page'),page.locator('.copy .exam-link').click()]);
 await paper.waitForSelector('.paper-sheet');assert.equal(await paper.locator('.question').count(),12);assert.equal(await paper.locator('.key-answer').count(),0);
 await paper.evaluate(()=>{window.print=()=>{window.printInvoked=true};});await paper.locator('#print-button').click();assert.equal(await paper.evaluate(()=>window.printInvoked),true);
 await a('tools');const [key]=await Promise.all([context.waitForEvent('page'),page.locator('#panel a').filter({hasText:'Teacher answer key'}).click()]);
 await key.waitForSelector('.key-answer');assert.equal(await key.locator('.key-answer').count(),12);
 await page.keyboard.press('Escape');await a('switch-class');await page.locator('[data-id="global-perspectives"]').click();await a('g7-plan');
 assert.match(await page.locator('#panel').innerText(),/2 lesson\(s\) per teaching week/);
 await a('back-picker');await page.locator('[data-id="7b"]').click();
 assert.equal(await page.locator('[data-lesson^="g7a-"]').count(),0);
 assert.ok(await page.locator('[data-action="select-lesson"]').count()>2);
 assert.deepEqual(errors,[]);console.log('PASS 7A weekly plan, responsive layout, diagram, exam, print, key and 7B isolation');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
