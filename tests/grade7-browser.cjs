const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const {createServer}=require('../scripts/serve.cjs');
const server=createServer();let browser;
(async()=>{
 const {grade7Lessons}=await import('../src/lessons/grade7a.js');
 await new Promise(r=>server.listen(4179,'127.0.0.1',r));
 browser=await chromium.launch({headless:true});
 const url=process.env.LEARN_URL||'http://127.0.0.1:4179/learn/';
 fs.mkdirSync('output/playwright',{recursive:true});
 const errors=[];
 for(const lesson of (process.env.PRINT_ONLY?[]:grade7Lessons)){
  const context=await browser.newContext({viewport:{width:1280,height:720}});
  await context.addInitScript(l=>{
   const key='learn.session.v1';
   if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({schemaVersion:3,lessonId:l.id,classId:'7a',subjectId:l.catalog.subjectId,classLabel:'7A',stage:0,steps:l.stages.map(()=>0),responses:{},stars:0,preferences:{starsVisible:false,timerVisible:true},timer:{durationMs:60000,remainingMs:60000,running:false,deadline:null},seenFrames:{'0:0':true},attentionReturns:{},discussedQuestions:[],startedAt:Date.now(),finishedAt:null}));
  },lesson);
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.locator('[data-action="resume-saved"]').click();
  async function fit(label){
   const bad=await page.evaluate(()=>{
    const controls=document.querySelector('.step-controls').getBoundingClientRect(),issues=[];
    for(const node of document.querySelectorAll('.copy h1,.instructions,.answers,.explanation,.footnote,.exam-link,.gp-diagram')){
     const r=node.getBoundingClientRect();
     if(r.bottom>controls.top+2||r.left<0||r.right>innerWidth+1)issues.push(node.className);
    }
    if(document.documentElement.scrollHeight>innerHeight+1)issues.push('document scrolls');
    return issues;
   });
   assert.deepEqual(bad,[],lesson.id+' '+label);
  }
  for(let si=0;si<lesson.stages.length;si++){
   if(si)await page.locator('[data-action="next-stage"]').click();
   for(let fi=0;fi<lesson.stages[si].frames.length;fi++){
    if(fi)await page.locator('[data-action="next-step"]').click();
    if(lesson.stages[si].frames[fi].diagram)await page.locator('.gp-diagram').evaluate(async img=>{await img.decode();if(!img.naturalWidth)throw Error('Diagram failed to load');});
    await fit(si+':'+fi);
    if(lesson.stages[si].frames[fi].type==='question'){
     await page.locator('[data-action="reveal"]').click();await fit('revealed '+si+':'+fi);
    }
   }
  }
  if(lesson.id==='g7a-geo-w02-1'){
   await page.locator('[data-action="summary"]').click();assert.match(await page.locator('[data-summary="stages"]').innerText(),/5 \/ 5/);
   await page.keyboard.press('Escape');
   await page.reload();await page.locator('[data-action="resume-saved"]').click();assert.match(await page.locator('#student-title').innerText(),/Lesson complete/);
   await page.screenshot({path:'output/playwright/g7-lesson-complete.png'});
  }
  await context.close();console.log('PASS playable '+lesson.id);
 }
 const printPage=await browser.newPage({viewport:{width:1000,height:1200}});
 for(const id of Object.keys((await import('../src/lessons/g7-exams.js')).grade7Exams))for(const key of [false,true]){
  await printPage.goto(url+'exams/?id='+id+(key?'&key=1':''));
  await printPage.waitForSelector('.paper-sheet');
  assert.equal(await printPage.locator('.question').count(),12);
  assert.equal(await printPage.locator('.question li').count(),48);
  assert.equal(await printPage.locator('.key-answer').count(),key?12:0);
  await printPage.emulateMedia({media:'print'});
  assert.equal(await printPage.locator('.print-toolbar').isVisible(),false);
  const bounds=await printPage.evaluate(()=>Array.from(document.querySelectorAll('.paper-sheet')).map(s=>{
   const box=s.getBoundingClientRect(),last=s.querySelector('.question:last-of-type').getBoundingClientRect(),foot=s.querySelector('footer').getBoundingClientRect();
   return {height:box.height,overlap:last.bottom>foot.top};
  }));
  for(const b of bounds){assert.ok(b.height<1124,id+' A4 height '+b.height);assert.equal(b.overlap,false,id+' footer overlap');}
  if(id==='7A-GEO-Q1')await printPage.locator('.paper-sheet').first().screenshot({path:'output/playwright/g7-exam-q1-'+(key?'key':'student')+'.png'});
  await printPage.emulateMedia({media:'screen'});
 }
 assert.deepEqual(errors,[]);console.log('PASS all student papers and answer keys fit four A4 pages each; no printed answer leaks');
 await printPage.close();
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
