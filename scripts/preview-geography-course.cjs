const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('./serve.cjs');const fs=require('node:fs');
(async()=>{
 const {lessons}=await import('../src/lessons.js');const ids=['g7a-geo-w05-1','g7a-geo-w22-1','g7a-geo-w29-1','g7a-geo-w34-1','g7a-geo-w35-1','g7b-geo-w02-2','g7b-geo-w05-1','g7b-geo-w19-1','g7b-geo-w20-1','g7b-geo-w31-1','g7b-geo-w35-1','g7b-geo-w36-1'];
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/learn/`);await page.evaluate(()=>localStorage.clear());await page.reload();
  fs.mkdirSync('output/playwright/course-model/previews',{recursive:true});
  for(const id of ids){const l=lessons.find(l=>l.id===id);
   await page.evaluate(l=>{const click=s=>document.querySelector(s).click();click(document.querySelector('[data-action="switch-class"]')?'[data-action="switch-class"]':'[data-action="choose-lesson"]');click(`[data-id="${l.catalog.classes[0]}"]`);click('[data-id="geography"]');click(`[data-quarter="${l.catalog.quarter}"]`);click(`[data-lesson="${l.id}"]`);click('[data-action="picker-start"]');if(document.querySelector('[data-action="confirm"]'))click('[data-action="confirm"]');},l);
   for(const stage of [1,2,3,4,5,6]){
    await page.locator('[data-action="stages"]').click();await page.locator(`[data-action="jump"][data-stage="${stage}"]`).click();
    if(id==='g7a-geo-w29-1'&&stage===3){const step=l.stages[stage].frames.findIndex(f=>f.conceptId==='2.5-2');for(let i=0;i<step;i++)await page.locator('[data-action="next-step"]').click();}
    if(id==='g7a-geo-w34-1'&&stage===3)await page.locator('[data-action="next-step"]').click();
    if(id==='g7b-geo-w31-1'&&stage===3)for(let i=0;i<2;i++)await page.locator('[data-action="next-step"]').click();
    await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(e=>{throw new Error(img.src+': '+e.message)}))));
    await page.screenshot({path:`output/playwright/course-model/previews/${id}-${l.stages[stage].id}.png`});
   }
  }
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'output/playwright/course-model/previews/mobile.png',fullPage:true});
  if(errors.length)throw Error(errors.join('\n'));console.log('Saved 72 classroom previews and one mobile view.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
