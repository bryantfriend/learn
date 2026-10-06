const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/learn/`);
  const {lessons}=await import('../src/lessons.js');const geo=lessons.filter(l=>l.geoConcept);
  fs.mkdirSync('output/playwright/geography-concepts',{recursive:true});
  const select=async l=>page.evaluate(l=>{
   const click=s=>{const n=document.querySelector(s);if(!n)throw Error('Missing '+s);n.click();};
   click(document.querySelector('[data-action="switch-class"]')?'[data-action="switch-class"]':'[data-action="choose-lesson"]');
   click(`[data-id="${l.catalog.classes[0]}"]`);click('[data-id="geography"]');click(`[data-quarter="${l.catalog.quarter}"]`);click(`[data-lesson="${l.id}"]`);click('[data-action="picker-start"]');if(document.querySelector('[data-action="confirm"]'))click('[data-action="confirm"]');
  },l);
  let screens=0;
  for(const viewport of [{width:1280,height:720},{width:1920,height:1080}]){
   await page.setViewportSize(viewport);
   for(const lesson of geo){
    await select(lesson);
    const bad=await page.evaluate(l=>{
     const bad=[],click=a=>document.querySelector(`[data-action="${a}"]`).click();
     function check(si,fi){
      const player=document.querySelector('.geography-concept-player');if(!player)bad.push('missing concept player');
      const content=document.querySelector('.geo-concept-content'),limit=document.querySelector('.step-controls').getBoundingClientRect().top;
      const r=content.getBoundingClientRect();if(r.bottom>limit+1||r.right>innerWidth+1||document.documentElement.scrollWidth>innerWidth)bad.push(`${si}:${fi}: viewport overflow`);
      const frame=l.stages[si].frames[fi];
      if(frame.vocabularyCards&&document.querySelectorAll('.concept-word').length!==3)bad.push('missing vocabulary cards');
      if(frame.successCriteria&&document.querySelectorAll('.concept-success-card').length!==3)bad.push('missing success criteria');
      if(frame.type==='question'){
       if(document.querySelector('.explanation'))bad.push('answer revealed early');click('reveal');if(!document.querySelector('.explanation'))bad.push('missing explanation');
      }
     }
     for(let si=0;si<l.stages.length;si++){
      for(let fi=0;fi<l.stages[si].frames.length;fi++){check(si,fi);if(fi<l.stages[si].frames.length-1)click('next-step');}
      if(si<l.stages.length-1)click('next-stage');
     }
     return bad;
    },lesson);
    assert.deepEqual(bad,[],`${viewport.width}: ${lesson.id}`);screens+=lesson.stages.flatMap(s=>s.frames).length;
   }
  }
  const river=geo.find(l=>l.bookSections?.includes('5.4'));
  await page.setViewportSize({width:1366,height:768});await select(river);
  for(let i=0;i<8;i++){
   await page.locator('[data-action="stages"]').click();await page.locator(`[data-action="jump"][data-stage="${i}"]`).click();
   await page.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode().catch(()=>{}))));
   await page.screenshot({path:`output/playwright/geography-concepts/0${i+1}-${river.stages[i].id}.png`});
  }
  await page.locator('[data-action="stages"]').click();await page.locator('[data-action="jump"][data-stage="3"]').click();
  await page.locator('.concept-tools summary').click();await page.locator('[data-action="slide-teaching-notes"]').click();assert.ok((await page.locator('#panel').innerText()).length>100);await page.locator('[data-action="close-panel"]').click();
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'output/playwright/geography-concepts/mobile.png',fullPage:true});
  await page.setViewportSize({width:1366,height:768});await select(geo.find(l=>l.examId));assert.equal(await page.locator('[data-action="print-exam"]').count(),0);assert.ok(await page.locator('a[href*="exams"]').count());
  await page.goto(`http://127.0.0.1:${server.address().port}/learn/docs/geography-teacher-guide.html#${river.id}`);
  assert.equal(await page.locator('nav a').count(),86);assert.equal(await page.locator('article:not([hidden]) section').count(),8);
  assert.match(await page.locator('article:not([hidden])').innerText(),/Student practice/);
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('article:visible').count(),1);
  assert.deepEqual(errors,[]);console.log(`PASS ${geo.length} Geography lessons; ${screens} classroom screens; 8 section previews; mobile layout; hidden answers and teacher notes.`);
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
