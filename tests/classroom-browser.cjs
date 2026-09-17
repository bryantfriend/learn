const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createServer } = require('../scripts/serve.cjs');
const server=createServer();let browser;
(async()=>{
 await new Promise(resolve=>server.listen(4175,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:720},hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=process.env.LEARN_URL||'http://127.0.0.1:4175/learn/';
 await page.goto(url);
 const action=async name=>{const root=await page.locator('#panel[open]').count()?page.locator('#panel'):page;await root.locator('[data-action="'+name+'"]').first().click()};
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('learn.session.v1')));
 const select=async(c,s)=>{
  await page.locator('[data-action="select-class"][data-id="'+c+'"]').tap();
  await page.locator('[data-action="select-subject"][data-id="'+s+'"]').tap();
  await page.locator('[data-lesson="system-practice-01"]').tap();
 };
 await action('choose-lesson');
 assert.equal(await page.locator('[data-action="picker-start"]').isDisabled(),true);
 await select('7a','geography');
 fs.mkdirSync('output/playwright',{recursive:true});
 await page.screenshot({path:'output/playwright/class-picker-1280.png'});
 for(const size of [[1920,1080],[1366,768],[1280,720],[390,844]]) {
  await page.setViewportSize({width:size[0],height:size[1]});
  assert.deepEqual(await page.evaluate(()=>{
   const issues=[];for(const selector of ['#panel','.picker-footer','.picker-context']){
    const r=document.querySelector(selector).getBoundingClientRect();
    if(r.top<0||r.left<0||r.bottom>innerHeight+1||r.right>innerWidth+1)issues.push(selector);
   }return issues;
  }),[],String(size));
 }
 await page.setViewportSize({width:1280,height:720});
 await page.keyboard.press('Escape');assert.equal(await state(),null);
 let index=0;
 for(const c of ['7a','7b','8'])for(const s of (c==='8'?['global-perspectives']:['geography','global-perspectives'])){
  await action(index?'switch-class':'choose-lesson');await select(c,s);await action('picker-start');
  assert.equal((await state()).classId,c);assert.equal((await state()).subjectId,s);assert.equal((await state()).stage,0);
  for(let n=0;n<=index;n++)await action('next-stage');
  index++;
 }
 await page.reload();await action('resume-saved');assert.equal((await state()).stage,5);
 index=0;
 for(const c of ['7a','7b','8'])for(const s of (c==='8'?['global-perspectives']:['geography','global-perspectives'])){
  await action('switch-class');await select(c,s);await action('picker-resume');
  assert.equal((await state()).stage,++index);
  assert.equal((await state()).timer.running,false);
 }
 console.log('PASS all five contexts keep independent progress across switches and reload');
 await action('switch-class');await select('7a','geography');await action('picker-start');await action('cancel-confirm');
 assert.equal((await state()).classId,'8');
 await action('choose-lesson');await select('7a','geography');await action('picker-resume');
 await action('tools');await action('clear-session');await action('confirm');
 await action('choose-lesson');await select('7b','geography');await action('picker-resume');assert.equal((await state()).stage,3);
 console.log('PASS cancel and clear preserve other classes');
 await page.reload();
 await page.screenshot({path:'output/playwright/classroom-home-1280.png'});
 const legacy={...(await state()),schemaVersion:2,classLabel:'Old group'};
 delete legacy.classId;delete legacy.subjectId;
 const oldContext=await browser.newContext();
 const oldPage=await oldContext.newPage();await oldPage.goto(url);
 await oldPage.evaluate(value=>localStorage.setItem('learn.session.v1',JSON.stringify(value)),legacy);
 await oldPage.reload();
 await oldPage.locator('[data-action="resume-saved"]').click();
 assert.match(await oldPage.locator('.class-label').innerText(),/Unassigned/);
 assert.equal(await oldPage.evaluate(()=>JSON.parse(localStorage.getItem('learn.session.v1')).stage),3);
 await oldPage.locator('[data-action="switch-class"]').click();
 await oldPage.locator('[data-action="select-class"][data-id="8"]').click();
 await oldPage.locator('[data-action="select-subject"][data-id="global-perspectives"]').click();
 await oldPage.locator('[data-lesson="ready-to-learn-v1"]').click();
 await oldPage.locator('[data-action="picker-start"]').click();
 await oldPage.locator('[data-action="switch-class"]').click();
 await oldPage.locator('[data-action="resume-earlier"]').click();
 assert.match(await oldPage.locator('.class-label').innerText(),/Unassigned/);
 assert.equal(await oldPage.evaluate(()=>JSON.parse(localStorage.getItem('learn.session.v1')).stage),3);
 await oldContext.close();
 console.log('PASS legacy progress stays accessible after starting another class');
 assert.deepEqual(errors,[]);
 console.log('PASS picker sizing, touch selection, Escape and browser error checks');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
