const { chromium }=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const {createServer}=require('../scripts/serve.cjs');
const server=createServer();let browser;
(async()=>{
 await new Promise(r=>server.listen(4176,'127.0.0.1',r));
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LEARN_URL||'http://127.0.0.1:4176/learn/');
 async function action(n){const root=await page.locator('#panel[open]').count()?page.locator('#panel'):page;await root.locator('[data-action="'+n+'"]').first().click();}
 await action('choose-lesson');
 await page.locator('[data-action="select-class"][data-id="7a"]').click();
 assert.equal(await page.locator('[data-action="select-subject"]').count(),2);
 await page.locator('[data-action="select-subject"][data-id="geography"]').click();
 await page.locator('[data-action="select-class"][data-id="8"]').click();
 assert.equal(await page.locator('[data-action="select-subject"][data-id="geography"]').count(),0);
 assert.equal(await page.locator('[data-action="select-subject"][data-id="global-perspectives"]').getAttribute('aria-pressed'),'true');
 await action('year-plan');
 let total=0;
 for(const q of ['Q1','Q2','Q3','Q4']){
  await page.locator('[data-quarter="'+q+'"]').click();
  total+=await page.locator('.planned-topic').count();
  await page.locator('.planned-topic summary').first().click();
  assert.ok((await page.locator('.planned-topic[open]').innerText()).toLowerCase().includes('resources:'));
 }
 assert.equal(total,43);
 await page.locator('[data-quarter="Q1"]').click();
 await page.locator('.weekly-pacing summary').click();
 await page.locator('[data-week="2026-09-14"][data-count="2"]').click();
 await page.locator('[data-week="2026-09-21"][data-count="2"]').click();
 await page.locator('[data-week="2026-09-21"][data-count="1"]').click();
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('learn.g8-gp.pacing.v1'))),{'2026-09-14':2,'2026-09-21':1});
 await page.screenshot({path:'output/playwright/year-plan-1280.png'});
 for(const [width,height] of [[1366,768],[390,844]]){
  await page.setViewportSize({width,height});
  assert.deepEqual(await page.evaluate(()=>{
   const r=document.querySelector('#panel').getBoundingClientRect(),f=document.querySelector('.picker-footer').getBoundingClientRect();
   return [r.left>=0,r.right<=innerWidth+1,r.bottom<=innerHeight+1,f.bottom<=innerHeight+1];
  }),[true,true,true,true]);
 }
 await page.reload();await action('choose-lesson');
 await page.locator('[data-action="select-class"][data-id="8"]').click();await action('year-plan');
 await page.locator('.weekly-pacing summary').click();
 assert.match(await page.locator('.week-row').first().innerText(),/2 lessons/);
 await action('back-picker');
 assert.equal(await page.locator('[data-action="select-subject"][data-id="geography"]').count(),0);
 await page.locator('[data-lesson="system-practice-01"]').click();await action('picker-start');
 assert.equal(await page.locator('#student-title').count(),1);
 assert.deepEqual(errors,[]);
 console.log('PASS subject correction, all 43 imported entries, flexible pacing persistence, responsive plan, and starter launch');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
