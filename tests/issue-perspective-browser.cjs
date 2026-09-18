const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('fs');
const {createServer}=require('../scripts/serve.cjs');const server=createServer();let browser;
(async()=>{
 const {getLesson}=await import('../src/lessons.js');const classId=process.env.LEARN_CLASS||'7b',l=getLesson('g'+classId+'-gp-w01-2');
 await new Promise(r=>server.listen(4185,'127.0.0.1',r));browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.LEARN_URL||'http://127.0.0.1:4185/learn/');
 fs.mkdirSync('output/playwright',{recursive:true});
 const a=n=>page.locator('[data-action="'+n+'"]').first().click();
 await a('choose-lesson');await page.locator('[data-id="'+classId+'"]').click();await page.locator('[data-id="global-perspectives"]').click();await page.locator('[data-lesson="'+l.id+'"]').click();await a('picker-start');await a('timer');
 async function bounds(label){
  assert.deepEqual(await page.evaluate(()=>{
   const limit=document.querySelector('.step-controls').getBoundingClientRect().top;
   return [...document.querySelectorAll('.copy h1,.instructions,.footnote,.lesson-visual,.answers,.answer-detail,.reveal-button')].filter(n=>{const r=n.getBoundingClientRect();return r.bottom>limit+2||r.left<0||r.right>innerWidth+1;}).map(n=>n.className);
  }),[],label);
 }
 let count=0;
 for(let si=0;si<l.stages.length;si++){
  for(let fi=0;fi<l.stages[si].frames.length;fi++){
   const f=l.stages[si].frames[fi];
   assert.equal(await page.locator('#student-title').innerText(),f.title);await bounds(f.title);count++;
   if(f.lessonVisual){
    const svg=await page.locator('.lesson-visual svg').getAttribute('aria-label');assert.ok(svg.length>70);
    if(classId==='7a'&&f.lessonVisual.chart){assert.match(svg,/18 pupils.*12.*30/);assert.match(await page.locator('.visual-data-note').innerText(),/Which space would you most like added/);await page.screenshot({path:'output/playwright/7a-survey-'+si+'.png'});}
    const before=await page.locator('.visual-caption').innerText();
    await page.getByRole('button',{name:'Next focus →',exact:true}).click();
    assert.notEqual(await page.locator('.visual-caption').innerText(),before,f.title);
    await bounds(f.title+' focus');
    if(fi===0){await page.screenshot({path:'output/playwright/issues-'+si+'.png'});}
    await page.getByRole('button',{name:'⛶ Enlarge',exact:true}).click();
    assert.equal(await page.locator('.visual-lightbox[open]').count(),1);
    await page.getByRole('button',{name:'Close visual ×'}).click();await page.locator('.teaching-content .lesson-visual').waitFor();
   }
   if(f.type){
    assert.equal(await page.locator('.explanation').count(),0);
    await page.locator('[data-answer="'+f.answer+'"]').click();
    assert.equal(await page.locator('.explanation').count(),0);await a('reveal');await bounds(f.title+' revealed');
    assert.match(await page.locator('.explanation').innerText(),new RegExp(f.explanation.slice(0,20)));
   }
   if(fi<l.stages[si].frames.length-1)await a('next-step');
  }
  if(si<l.stages.length-1)await a('next-stage');
 }
 await page.reload();await a('resume-saved');assert.equal(await page.locator('#student-title').innerText(),l.stages.at(-1).frames.at(-1).title);
 await a('summary');assert.match(await page.locator('#panel').innerText(),new RegExp(l.stages.length+' of '+l.stages.length+'|'+l.stages.length+' / '+l.stages.length));await page.keyboard.press('Escape');
 for(let i=0;i<l.stages.length-1;i++)await a('back-stage');
 for(const [width,height]of [[1366,768],[1920,1080],[390,844]]){
  await page.setViewportSize({width,height});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(width>900)await bounds('responsive '+width);
 }
 assert.deepEqual(errors,[]);console.log('PASS '+count+' frames, all diagrams and answer reveals, summary, save/reload and responsive layout');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
