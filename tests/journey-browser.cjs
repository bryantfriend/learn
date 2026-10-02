const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const assert=require('node:assert/strict');
(async()=>{const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/learn/`);
 const frames=await page.evaluate(async()=>{const {lessons}=await import('./src/lessons.js');return lessons.find(l=>l.id==='g7b-geo-w02-2').stages.flatMap(s=>s.frames);});
 await page.evaluate(()=>{const click=s=>{const n=document.querySelector(s);if(!n)throw Error('Missing '+s);n.click();};click('[data-action="choose-lesson"]');click('[data-id="7b"]');click('[data-id="geography"]');click('[data-quarter="Q1"]');click('[data-lesson="g7b-geo-w02-2"]');click('[data-action="picker-start"]');if(document.querySelector('[data-action="confirm"]'))click('[data-action="confirm"]');});
 await page.locator('[data-action="stages"]').click();await page.locator('[data-action="jump"][data-stage="3"]').click();
 await page.waitForFunction(()=>[...document.querySelectorAll('.journey-visual img')].every(i=>i.complete&&i.naturalWidth>0));
 await page.screenshot({path:'output/playwright/journey-lesson.png'});
 assert.ok(await page.locator('.journey-visual').evaluate(n=>n.getBoundingClientRect().right<=innerWidth));
 for(const frame of frames.filter(f=>f.geoDisplay)){await page.evaluate(async spec=>{const {createGeographyEvidence}=await import('./src/geography-evidence.js');document.body.replaceChildren(createGeographyEvidence(spec));},frame.geoDisplay);await page.waitForFunction(()=>[...document.querySelectorAll('.journey-visual img')].every(i=>i.complete&&i.naturalWidth>0));assert.ok(await page.locator('.journey-visual img').evaluateAll(imgs=>imgs.every(i=>i.naturalWidth>0)));}
 const planner=frames.find(f=>f.geoDisplay?.journey?.view==='planner');await page.evaluate(async spec=>{const {createGeographyEvidence}=await import('./src/geography-evidence.js');document.body.replaceChildren(createGeographyEvidence(spec));},planner.geoDisplay);
 await page.getByLabel('A total hours').fill('7');await page.getByLabel('B total hours').fill('6');await page.getByRole('button',{name:'Choose A',exact:true}).click();await page.getByRole('button',{name:'Check plan',exact:true}).click();assert.match(await page.locator('.journey-feedback').innerText(),/meets the conditions/);
 await page.getByRole('button',{name:'Cancel ferry',exact:true}).click();await page.getByRole('button',{name:'Choose B',exact:true}).click();await page.getByRole('button',{name:'Check plan',exact:true}).click();assert.match(await page.locator('.journey-feedback').innerText(),/neither route works/);
 await page.getByRole('button',{name:'Neither works',exact:true}).click();await page.getByRole('button',{name:'Check plan',exact:true}).click();assert.match(await page.locator('.journey-feedback').innerText(),/meets the conditions/);
 await page.getByLabel('Budget tokens').fill('60');await page.getByRole('button',{name:'Choose B',exact:true}).click();await page.getByRole('button',{name:'Check plan',exact:true}).click();assert.match(await page.locator('.journey-feedback').innerText(),/meets the conditions/);
 await page.getByRole('button',{name:'Reset planner',exact:true}).click();assert.equal(await page.getByLabel('Budget tokens').inputValue(),'45');
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);console.log('PASS all journey pictures, totals, cancellation, changed budget and reset');
 }finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
