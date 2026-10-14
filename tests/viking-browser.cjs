const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createServer}=require('../scripts/serve.cjs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(4197,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1366,height:768}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4197/learn/');
  await page.getByRole('link',{name:'Viking religion · 40 min →'}).click();
  await page.locator('[data-action="picker-start"]').click();
  await page.getByRole('heading',{name:'What might matter to this community?'}).waitFor();
  const {vikingReligionLesson:lesson}=await import('../src/lessons/viking-religion.js');
  const paths=new Set(lesson.stages.flatMap(s=>s.frames.map(f=>f.illustration?.image).filter(Boolean)));
  for(const asset of paths){assert.ok(fs.existsSync('assets/'+asset),asset);const response=await page.request.get('http://127.0.0.1:4197/learn/assets/'+asset);assert.equal(response.status(),200);}
  for(let i=0;i<lesson.stages.length;i++){
   await page.locator('[data-action="stages"]').click();
   await page.locator(`[data-action="jump"][data-stage="${i}"]`).click();
   for(let j=0;j<lesson.stages[i].frames.length;j++){
    const frame=lesson.stages[i].frames[j];
    await page.getByRole('heading',{name:frame.title,exact:true}).waitFor();
    if(frame.illustration){await page.locator('.lesson-scene img').evaluate(img=>img.decode());assert.ok(await page.locator('.lesson-scene img').evaluate(img=>img.naturalWidth>0));}
    if(frame.type==='question'){
     const reveal=page.locator('[data-action="reveal"]');await reveal.click();
     assert.ok((await page.locator('.explanation').innerText()).includes(frame.explanation));
    }
    if(j<lesson.stages[i].frames.length-1)await page.locator('[data-action="next-step"]').click();
   }
  }
  fs.mkdirSync('output/playwright',{recursive:true});
  await page.screenshot({path:'output/playwright/viking-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:4197/learn/');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.deepEqual(errors,[]);console.log('PASS: home link, lesson start, every frame, six images, reveals, mobile home, no browser errors');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
