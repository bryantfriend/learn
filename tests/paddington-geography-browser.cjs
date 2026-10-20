const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const {lessons}=await import('../src/lessons.js');const lesson=lessons.find(l=>l.id==='g7-geo-paddington-2');
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch();const page=await browser.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  fs.mkdirSync('output/playwright/paddington',{recursive:true});
  for(const viewport of [{width:1280,height:720},{width:1920,height:1080}]){
   await page.setViewportSize(viewport);await page.goto(`http://127.0.0.1:${server.address().port}/learn/`);
   await page.evaluate(()=>localStorage.clear());await page.reload();
   await page.evaluate(()=>{
    const click=s=>{const n=document.querySelector(s);if(!n)throw Error('Missing '+s);n.click();};
    click('[data-action="choose-lesson"]');click('[data-id="7a"]');click('[data-id="geography"]');click('[data-quarter="Q1"]');click('[data-lesson="g7-geo-paddington-2"]');click('[data-action="picker-start"]');if(document.querySelector('[data-action="confirm"]'))click('[data-action="confirm"]');
   });
   const fit=async label=>{
    const overflow=await page.evaluate(()=>{
     const bad=[];const root=document.querySelector('.geo-concept-content');const controls=document.querySelector('.step-controls');
     if(root.getBoundingClientRect().bottom>controls.getBoundingClientRect().top+1)bad.push('content overlaps controls');
     if(document.documentElement.scrollWidth>innerWidth)bad.push('page too wide');
     for(const n of document.querySelectorAll('.geo-concept-content,.concept-copy,.concept-word'))if(n.scrollHeight>n.clientHeight+2)bad.push(`${n.className} scrolls by ${n.scrollHeight-n.clientHeight}px`);
     return bad;
    });assert.deepEqual(overflow,[],label);
   };
   for(let si=0;si<lesson.stages.length;si++)for(let fi=0;fi<lesson.stages[si].frames.length;fi++){
    const frame=lesson.stages[si].frames[fi];const label=`${viewport.width} ${si}:${fi} ${frame.title}`;
    await page.locator('.concept-art img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
    await fit(label);
    if(si===1&&fi===0){
     const map=page.locator('.geo-concept-content .paddington-map'),svg=map.locator('svg');
     const initial=await svg.getAttribute('viewBox');
     await map.getByRole('button',{name:'Zoom in +',exact:true}).click();assert.notEqual(await svg.getAttribute('viewBox'),initial);
     await map.getByRole('button',{name:'Peru',exact:true}).click();const peru=await svg.getAttribute('viewBox');
     await svg.focus();await page.keyboard.press('ArrowRight');assert.notEqual(await svg.getAttribute('viewBox'),peru);
     const beforeDrag=await svg.getAttribute('viewBox'),box=await svg.boundingBox();
     await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+50,box.y+box.height/2+20,{steps:5});await page.mouse.up();assert.notEqual(await svg.getAttribute('viewBox'),beforeDrag);
     await map.getByRole('button',{name:'London',exact:true}).click();assert.equal(await svg.getByText('London',{exact:true}).isVisible(),true);
     const londonView=await svg.getAttribute('viewBox');
     await page.getByRole('button',{name:'Enlarge map',exact:false}).click();const large=page.locator('dialog[open] .paddington-map');assert.equal(await large.locator('svg').getAttribute('viewBox'),londonView);
     await large.getByRole('button',{name:'Reset world',exact:true}).click();assert.equal(await large.locator('svg').getAttribute('viewBox'),initial);
     await page.keyboard.press('Escape');assert.equal(await page.locator('.geo-concept-content .paddington-map svg').getAttribute('viewBox'),initial);
     await map.getByRole('button',{name:'Place names',exact:true}).click();assert.equal(await map.getByRole('button',{name:'Place names',exact:true}).getAttribute('aria-pressed'),'false');
     await fit(label+' map controls');
    }
    assert.equal(await page.locator('.concept-rehearsal,.response-hint').count(),0,label);
    if(frame.vocabularyCards){
     assert.equal(await page.locator('.concept-word').count(),3);await page.locator('.concept-word').first().press('Enter');assert.equal(await page.locator('dialog[open]').count(),1);await page.locator('dialog[open] button').click();
    }else assert.equal(await page.locator('#student-title').innerText(),frame.title,label);
    if(viewport.width===1280)await page.screenshot({path:`output/playwright/paddington/${lesson.stages[si].id}-${fi+1}.png`});
    if(frame.type==='question'){
     assert.equal(await page.locator('.explanation').count(),0);await page.locator('[data-action="reveal"]').click();assert.equal(await page.locator('.explanation').count(),1);await fit(label+' revealed');
     if(frame.hideInstructionsOnReveal)assert.equal(await page.locator('.instructions').count(),0);
     if(si===6&&viewport.width===1280)await page.screenshot({path:`output/playwright/paddington/check-${fi+1}-revealed.png`});
     await page.locator('[data-action="hide-answer"]').click();assert.equal(await page.locator('.explanation').count(),0);if(frame.hideInstructionsOnReveal)assert.equal(await page.locator('.instructions').count(),1);
    }
    if(fi<lesson.stages[si].frames.length-1)await page.locator('[data-action="next-step"]').click();else if(si<lesson.stages.length-1)await page.locator('[data-action="next-stage"]').click();
   }
  }
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:'output/playwright/paddington/mobile-wrap-up.png',fullPage:true});
  await page.setViewportSize({width:1280,height:720});await page.locator('.concept-art .geo-enlarge').click();assert.equal(await page.locator('dialog[open] img').count(),1);await page.locator('dialog[open] button').click();
  assert.deepEqual(errors,[]);console.log('PASS: every Paddington slide at 1280×720 and 1920×1080, loaded pictures, hidden/revealed answers, illustration enlargement, mobile width and no JavaScript/HTTP errors.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});



