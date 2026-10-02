const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();try{
 fs.mkdirSync('output/playwright/geography-lecture',{recursive:true});
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/learn/`);
 const {lessons}=await import('../src/lessons.js');const geo=lessons.filter(l=>l.teacherLed);let count=0;
 const select=async l=>page.evaluate(l=>{const click=s=>{const n=document.querySelector(s);if(!n)throw Error('Missing '+s);n.click();};click(document.querySelector('[data-action="switch-class"]')?'[data-action="switch-class"]':'[data-action="choose-lesson"]');click(`[data-id="${l.catalog.classes[0]}"]`);click('[data-id="geography"]');click(`[data-quarter="${l.catalog.quarter}"]`);click(`[data-lesson="${l.id}"]`);click('[data-action="picker-start"]');if(document.querySelector('[data-action="confirm"]'))click('[data-action="confirm"]');},l);
 for(const viewport of process.env.SKIP_FRAME_WALK?[]:[{width:1280,height:720},{width:1366,height:768}]){
  await page.setViewportSize(viewport);
  for(const l of geo){await select(l);const bad=await page.evaluate(l=>{
   const bad=[],a=n=>document.querySelector(`[data-action="${n}"]`).click();
   function check(label){const limit=document.querySelector('.step-controls').getBoundingClientRect().top;for(const n of document.querySelectorAll('.copy h1,.instructions,.copy .explanation,.copy>[data-action="slide-teaching-notes"],.copy>[data-action="slide-understanding-check"],.teaching-content>.geography-evidence,.teaching-content>.geo-atlas')){const r=n.getBoundingClientRect();if(r.bottom>limit+2||r.right>innerWidth+1||r.left<0)bad.push([l.id,label,n.className,n.dataset.action]);}}
   for(let si=0;si<l.stages.length;si++){for(let fi=0;fi<l.stages[si].frames.length;fi++){check(`${si}:${fi}`);if(l.stages[si].frames[fi].type==='question'){a('reveal');check(`${si}:${fi}:answer`);}if(fi<l.stages[si].frames.length-1)a('next-step');}if(si<l.stages.length-1)a('next-stage');}return bad;
  },l);assert.deepEqual(bad,[],`${viewport.width} ${l.id}`);count+=l.stages.flatMap(s=>s.frames).length;}
 }
 const journey=geo.find(l=>l.id==='g7b-geo-w02-2');await select(journey);await page.locator('[data-action="stages"]').click();await page.locator('[data-action="jump"][data-stage="1"]').click();
 await page.screenshot({path:'output/playwright/geography-lecture/island-and-country.png'});
 await page.locator('[data-action="slide-teaching-notes"]').click();assert.match(await page.locator('#panel').innerText(),/An island is a physical area/);await page.screenshot({path:'output/playwright/geography-lecture/teacher-explanation.png'});await page.locator('[data-action="close-panel"]').click();
 await page.locator('[data-action="slide-understanding-check"]').click();assert.match(await page.locator('#panel').innerText(),/every country boundary/);assert.equal(await page.locator('#panel details').getAttribute('open'),null);await page.locator('#panel summary').click();assert.match(await page.locator('#panel details').innerText(),/share land boundaries/);await page.locator('[data-action="close-panel"]').click();
 // Script content is editable without changing the actual diagram or controls.
 await page.locator('[data-action="next-step"]').click();await page.screenshot({path:'output/playwright/geography-lecture/uk-and-great-britain.png'});
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.goto(`http://127.0.0.1:${server.address().port}/learn/docs/geography-teacher-guide.html#g7b-geo-w02-2`);
 assert.equal(await page.locator('article:not([hidden])').count(),1);assert.match(await page.locator('article:not([hidden])').innerText(),/An island is a physical area/);
 assert.equal(await page.locator('nav a').count(),86);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.setViewportSize({width:1366,height:768});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'output/playwright/geography-lecture/teacher-guide.png'});
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('article:visible').count(),1);
 assert.deepEqual(errors,[]);console.log(`PASS ${count} rebuilt screen checks at two classroom sizes; slide teaching notes and concealed oral-check explanations`);
 }finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
