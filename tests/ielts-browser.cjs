const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createServer}=require('../scripts/serve.cjs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(4198,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1366,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base=process.env.LEARN_URL||'http://127.0.0.1:4198/learn/';
  await page.goto(base);
  const {ieltsLessons}=await import('../src/lessons/ielts.js');
  async function pick(classId,id,resume=false){
   await page.locator('[data-action="choose-lesson"], [data-action="switch-class"]').first().click();
   await page.locator(`[data-action="select-class"][data-id="${classId}"]`).click();
   await page.locator('[data-action="select-subject"][data-id="ielts"]').click();
   assert.equal(await page.locator('[data-lesson^="g7-ielts-"]').count(),30);
   await page.locator(`[data-lesson="${id}"]`).click();
   await page.locator(`[data-action="${resume?'picker-resume':'picker-start'}"]`).click();
  }
  async function jump(i){
   await page.locator('[data-action="stages"]').click();
   await page.locator(`[data-action="jump"][data-stage="${i}"]`).click();
  }
  let frames=0;
  for(const lesson of ieltsLessons){
   await pick('7a',lesson.id);
   for(let i=0;i<lesson.stages.length;i++){
    await jump(i);
    for(let j=0;j<lesson.stages[i].frames.length;j++){
     const f=lesson.stages[i].frames[j];
     await page.getByRole('heading',{name:f.title,exact:true}).waitFor();
     if(f.type==='question'){
      assert.equal(await page.locator('.explanation').count(),0);
      await page.locator('[data-action="reveal"]').click();
      assert.ok((await page.locator('.explanation').innerText()).includes(f.explanation));
     }
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
     frames++;
     if(j<lesson.stages[i].frames.length-1)await page.locator('[data-action="next-step"]').click();
    }
   }
  }
  // Starting this same lesson in 7B must not inherit 7A's completed stage.
  await pick('7b',ieltsLessons[0].id);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('learn.session.v1')).stage),0);
  await jump(2);await page.reload();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('learn.session.v1')).classId),'7b');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('learn.session.v1')).stage),2);
  await pick('7a',ieltsLessons[0].id,true);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('learn.session.v1')).stage),5);
  await page.setViewportSize({width:390,height:844});
  await pick('7b',ieltsLessons[29].id);
  await jump(3);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  fs.mkdirSync('output/playwright',{recursive:true});
  await page.screenshot({path:'output/playwright/ielts-mobile.png',fullPage:true});
  await page.setViewportSize({width:1366,height:900});
  await page.locator('[data-action="choose-lesson"], [data-action="switch-class"]').first().click();
  await page.screenshot({path:'output/playwright/ielts-picker.png',fullPage:true});
  assert.deepEqual(errors,[]);
  console.log(`PASS: ${frames} frames, 60 concealed answer reveals, 30 choices in both classes, separate progress, reload, mobile layout, no browser errors`);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
