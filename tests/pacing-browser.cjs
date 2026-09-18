const {chromium}=require(process.env.PLAYWRIGHT_MODULE),assert=require('node:assert/strict'),fs=require('node:fs');const {createServer}=require('../scripts/serve.cjs');
(async()=>{const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();try{
 const {lessons}=await import('../src/lessons.js');const teaching=lessons.filter(l=>l.extensions);const errors=[],bad=[];const page=await browser.newPage({viewport:{width:1280,height:720}});page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.TEST_URL||`http://127.0.0.1:${server.address().port}/learn/`);
 const sizes=process.env.FOCUSED?[[1280,720],[1920,1080]]:[[1280,720]];
 for(const [width,height]of sizes){await page.setViewportSize({width,height});let n=0;
 for(const l of (process.env.FOCUSED?teaching.filter(l=>['g8-gp-1.1','g7a-gp-w01-2'].includes(l.id)):teaching)){
 const result=await page.evaluate(l=>{
 const click=selector=>{const e=document.querySelector(selector);if(!e)throw Error('Missing '+selector);e.click();};const a=id=>click(`[data-action="${id}"]`);
 if(document.querySelector('[data-action="switch-class"]'))a('switch-class');else a('choose-lesson');
 click(`[data-id="${l.catalog.classes?.[0]||'8'}"]`);click(`[data-id="${l.catalog.subjectId}"]`);click(`[data-quarter="${l.catalog.quarter}"]`);click(`[data-lesson="${l.id}"]`);a('picker-start');if(document.querySelector('[data-action=confirm]'))a('confirm');a('timer');
 const issues=[];let checked=0;
 for(let si=0;si<l.stages.length;si++){for(let fi=0;fi<l.stages[si].frames.length;fi++){
 const f=l.stages[si].frames[fi];const limit=document.querySelector('.step-controls').getBoundingClientRect().top;
 // All new/retimed frames and every frame of the two reported lessons.
 if(f.expectedSeconds){checked++;for(const e of document.querySelectorAll('.copy h1,.instructions,.footnote,.lesson-visual,.answers')){const r=e.getBoundingClientRect();if(r.bottom>limit+2||r.right>innerWidth+1||r.left<0)issues.push([l.id,si,fi,e.className]);}}
 if(fi<l.stages[si].frames.length-1)a('next-step');}if(si<l.stages.length-1)a('next-stage');}
 a('extensions');if(!document.querySelector('#panel.reserve-panel[open]'))throw Error('Reserve unavailable');
 const text=document.querySelector('#panel').textContent;if(!text.includes(l.extensions[0].source[0]))throw Error('Missing source');
 click('[data-action="extensions"][data-index="1"]');if(!document.querySelector('#panel').textContent.includes(l.extensions[1].title))throw Error('Missing second reserve');a('close-panel');
 return {issues,checked};},l);bad.push(...result.issues);if(process.env.FOCUSED){await page.evaluate(id=>{document.querySelector('[data-action=stages]').click();document.querySelector('[data-action=jump][data-stage="'+(id==='g8-gp-1.1'?3:2)+'"]').click();while(document.querySelector('[data-action=previous-step]'))document.querySelector('[data-action=previous-step]').click();for(let i=0;i<(id==='g8-gp-1.1'?3:5);i++)document.querySelector('[data-action=next-step]').click();},l.id);await page.screenshot({path:'output/pacing-'+l.id+'-'+width+'.png'});}n++;if(n%50===0)console.log('Checked '+n+' lessons');
 }
 console.log('Checked teaching catalog at '+width);
 }
 // Core timer pauses, same slide/progress survives reserve, keyboard Escape closes it.
 await page.evaluate(()=>{document.querySelector('[data-action="back-stage"]').click();document.querySelector('[data-action="toggle-timer"]').click();});const title=await page.locator('#student-title').textContent();await page.locator('[data-action="extensions"]').first().click();await page.screenshot({path:'output/pacing-reserve.png'});await page.keyboard.press('Escape');assert.equal(await page.locator('#student-title').textContent(),title);assert.match(await page.locator('#timer-status').textContent(),/Paused/);
 fs.writeFileSync('output/pacing-overflow.json',JSON.stringify(bad,null,2));assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);console.log('PASS activity layouts, reserve content/navigation, paused timer and preserved frame');
 }finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
