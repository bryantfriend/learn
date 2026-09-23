const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createServer}=require('../scripts/serve.cjs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch();
  const {getLesson}=await import('../src/lessons.js');
  const {visualSpec}=await import('../src/visuals.js');
  const errors=[];let count=0;
  fs.mkdirSync('output/playwright/esl',{recursive:true});
  for(const id of ['g8-gp-1.2','g8-gp-1.3','g7a-gp-w02-1','g7b-geo-w02-1']){
   const lesson=getLesson(id);assert.ok(lesson,id);
   const context=await browser.newContext({viewport:{width:1280,height:720}});
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`http://127.0.0.1:${server.address().port}/learn/`);
   const click=action=>page.locator(`[data-action="${action}"]`).first().click();
   await click('choose-lesson');
   await page.locator(`[data-id="${lesson.catalog.classes?.[0]||'8'}"]`).click();
   await page.locator(`[data-id="${lesson.catalog.subjectId}"]`).click();
   await page.locator(`[data-quarter="${lesson.catalog.quarter}"]`).click();
   await page.locator(`[data-lesson="${id}"]`).click();await click('picker-start');await click('timer');
   for(const [si,stage] of lesson.stages.entries()){
    if(si)await click('next-stage');
    for(const [fi,frame] of stage.frames.entries()){
     if(fi)await click('next-step');
     const title=await page.locator('#student-title').innerText();
     assert.ok([frame.title,visualSpec(lesson,stage,frame)?.title].includes(title),`${id}: ${title}`);count++;
     if(frame.type==='question')await click('reveal');
     const overflow=await page.evaluate(()=>{
      const limit=document.querySelector('.step-controls').getBoundingClientRect().top;
      return [...document.querySelectorAll('.copy h1,.instructions,.footnote,.lesson-visual,.answers,.answer-detail,.reveal-button')].filter(n=>{const r=n.getBoundingClientRect();return r.bottom>limit+2||r.left<0||r.right>innerWidth+1;}).map(n=>n.className);
     });
     assert.deepEqual(overflow,[],`${id} ${si}:${fi}`);
     if(id==='g8-gp-1.2'&&(si===0||frame.discussionId==='twist'))await page.screenshot({path:`output/playwright/esl/lesson3-${si}-${fi}.png`});
    }
   }
   await page.reload();await click('resume-saved');
   assert.equal(await page.locator('#student-title').innerText(),lesson.stages.at(-1).frames.at(-1).title);
   await context.close();
  }
  assert.deepEqual(errors,[]);console.log(`PASS: ${count} frames, revealed answers, saved progress and 1280×720 layout.`);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
