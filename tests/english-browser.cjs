const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {createServer}=require('../scripts/serve.cjs');const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();try{
 const base=`http://127.0.0.1:${server.address().port}/learn/`,page=await browser.newPage({viewport:{width:1280,height:800},hasTouch:true});const errors=[],bad=[];page.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('output/playwright/english',{recursive:true});await page.goto(base);
 const {lessons}=await import('../src/lessons.js');let count=0;
 for(const lesson of lessons.filter(l=>l.english)){
  await page.evaluate(l=>{const a=n=>document.querySelector(`[data-action="${n}"]`).click();a(document.querySelector('[data-action="switch-class"]')?'switch-class':'choose-lesson');document.querySelector('[data-id="7b"]').click();document.querySelector('[data-id="english"]').click();document.querySelector(`[data-lesson="${l.id}"]`).click();a('picker-start');},lesson);
  for(let si=0;si<lesson.stages.length;si++){
   for(let fi=0;fi<lesson.stages[si].frames.length;fi++){
    count++;const frame=lesson.stages[si].frames[fi];
    const check=async()=>{const errors=await page.evaluate(()=>{const limit=document.querySelector('.step-controls').getBoundingClientRect().top;return [...document.querySelectorAll('.copy h1,.instructions,.footnote,.answer-detail,.question-bank-button')].filter(n=>{const r=n.getBoundingClientRect();return r.bottom>limit+2||r.right>innerWidth+1;}).map(n=>n.className);});if(errors.length)bad.push([lesson.id,si,fi,errors]);};
    await check();
    if(si===0&&fi===0){const before=await page.locator('#student-title').innerText();await page.locator('.vocab-word').first().tap();assert.ok(await page.locator('.vocabulary-chinese').innerText());await page.screenshot({path:`output/playwright/english/${lesson.id}-vocabulary.png`});await page.keyboard.press('Escape');await page.waitForSelector('.vocabulary-dialog',{state:'detached'});assert.equal(await page.locator('.vocabulary-dialog').count(),0);assert.equal(await page.locator('#student-title').innerText(),before);}
    if(frame.conversationCards){
     await page.locator('[data-action="conversation-cards"]').click();assert.equal(await page.locator('.conversation-example').count(),0);
     await page.locator('#panel .vocab-word').first().tap();assert.equal(await page.locator('#panel').evaluate(n=>n.open),true);await page.locator('.vocabulary-close').click();assert.equal(await page.locator('.conversation-cards').count(),1);
     await page.getByRole('button',{name:'Show one example',exact:true}).click();assert.ok(await page.locator('.conversation-example').innerText());
     await page.getByRole('button',{name:'Next round →',exact:true}).click();assert.equal(await page.locator('.conversation-example').count(),0);await page.getByRole('button',{name:'Next round →',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Next round →',exact:true}).isDisabled(),true);
     await page.screenshot({path:`output/playwright/english/${lesson.id}-cards.png`});await page.locator('[data-action="close-panel"]').click();
    }
    if(frame.type==='question'){await page.locator('[data-action="reveal"]').click();await check();}
    if(fi<lesson.stages[si].frames.length-1)await page.locator('[data-action="next-step"]').click();
   }if(si<lesson.stages.length-1)await page.locator('[data-action="next-stage"]').click();
  }
 }
 await page.setViewportSize({width:390,height:844});await page.locator('.vocab-word').first().click();assert.equal(await page.locator('.vocabulary-dialog').evaluate(n=>n.scrollWidth<=n.clientWidth),true);await page.keyboard.press('Escape');await page.waitForSelector('.vocabulary-dialog',{state:'detached'});
 fs.writeFileSync('output/playwright/english/overflow.json',JSON.stringify(bad,null,2));assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);console.log(`PASS ${count} English frames, Chinese popups, nested role cards, touch and mobile popup.`);
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
