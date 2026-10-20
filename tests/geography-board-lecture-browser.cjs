const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const {lessons}=await import('../src/lessons.js');const geo=lessons.filter(l=>l.boardLecture);
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
 const folder='output/playwright/board-led';fs.mkdirSync(folder,{recursive:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const root=`http://127.0.0.1:${server.address().port}/learn/`;await page.goto(root);
  for(const l of geo){
   await page.evaluate(l=>{const click=s=>document.querySelector(s).click();click(document.querySelector('[data-action="switch-class"]')?'[data-action="switch-class"]':'[data-action="choose-lesson"]');click(`[data-id="${l.catalog.classes[0]}"]`);click('[data-id="geography"]');click(`[data-quarter="${l.catalog.quarter}"]`);click(`[data-lesson="${l.id}"]`);click('[data-action="picker-start"]');if(document.querySelector('[data-action="confirm"]'))click('[data-action="confirm"]');},l);
   const read=page.locator('.lecture-script-button');assert.equal(await read.count(),1);assert.ok(await read.isVisible());
   await read.click();assert.equal(await page.locator('.slide-teacher-script').allTextContents().then(p=>p.join('\n\n')),l.stages[0].frames[0].teacherScript);await page.locator('[data-action="close-panel"]').click();
  }
  for(const code of ['1.3','2.5','3.2','3.7','4.2','5.4']){
   const l=geo.find(l=>!l.geographyReview&&l.bookSections.includes(code));
   await page.evaluate(l=>{const click=s=>document.querySelector(s).click();click('[data-action="switch-class"]');click(`[data-id="${l.catalog.classes[0]}"]`);click('[data-id="geography"]');click(`[data-quarter="${l.catalog.quarter}"]`);click(`[data-lesson="${l.id}"]`);click('[data-action="picker-start"]');if(document.querySelector('[data-action="confirm"]'))click('[data-action="confirm"]');click('[data-action="stages"]');click('[data-action="jump"][data-stage="3"]');},l);
   const story=l.stages[3].frames.findIndex(f=>f.teachingStory&&f.kicker.includes('· '+code+' ·'));
   for(let i=0;i<story;i++)await page.locator('[data-action="next-step"]').click();
   await page.locator('img').evaluateAll(a=>Promise.all(a.map(x=>x.decode())));await page.screenshot({path:`${folder}/topic-${code}.png`});
   if(code==='4.2'){await page.locator('.lecture-script-button').click();await page.screenshot({path:`${folder}/read-script.png`});await page.locator('[data-action="close-panel"]').click();}
  }
  let sheets=0;
  for(const l of geo){await page.goto(root+'worksheets/?lesson='+l.id);assert.equal(await page.locator('.sheet').count(),l.workshopMissions.length);assert.ok((await page.locator('#paper').textContent()).includes('Optional'));sheets++;}
  await page.goto(root+'worksheets/?lesson=g7b-geo-w03-2');await page.screenshot({path:`folder/worksheet.png`.replace('folder',folder),fullPage:true});
  await page.goto(root+'docs/geography-teacher-guide.html#g7b-geo-w03-2');assert.equal(await page.locator('article:not([hidden])').count(),1);assert.ok((await page.locator('article:not([hidden])').textContent()).includes('Wales'));
  await page.setViewportSize({width:390,height:844});await page.goto(root);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);console.log(JSON.stringify({scriptDialogs:geo.length,lessonWorksheets:sheets,screenshots:8,errors}));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
