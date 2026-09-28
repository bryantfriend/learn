const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('fs');
const {createServer}=require('../scripts/serve.cjs');const server=createServer();let browser;
(async()=>{
 const {getLesson}=await import('../src/lessons.js'),{workbookTrialLessons}=await import('../src/lessons/gp-workbook-trial.js');
 await new Promise(r=>server.listen(4193,'127.0.0.1',r));browser=await chromium.launch({headless:true});
 const errors=[],bad=[],topics=new Set();let frames=0;
 fs.mkdirSync('output/playwright/workbook-trial',{recursive:true});
 for(const id of workbookTrialLessons.map(l=>l.id)){
  const l=getLesson(id),context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(id+': '+e.message));await page.goto(process.env.LEARN_URL||'http://127.0.0.1:4193/learn/');
  const a=n=>page.locator('[data-action="'+n+'"]').first().click();
  await a('choose-lesson');await page.locator('[data-id="'+(l.catalog.classes?.[0]||'8')+'"]').click();
  await page.locator('[data-id="'+l.catalog.subjectId+'"]').click();assert.equal(await page.locator('[data-action="g7-plan"]').count(),0);assert.equal(await page.locator('[data-action="lesson-quarter"]').count(),0);
  await page.locator('[data-lesson="'+id+'"]').click();await a('picker-start');await a('timer');
  async function bounds(label){
   const issues=await page.evaluate(()=>{
    const limit=document.querySelector('.step-controls').getBoundingClientRect().top;
    return [...document.querySelectorAll('.copy h1,.instructions,.footnote,.lesson-visual,.answers,.answer-detail,.reveal-button')].filter(n=>{const r=n.getBoundingClientRect();return r.bottom>limit+2||r.left<0||r.right>innerWidth+1;}).map(n=>n.className);
   });
   if(issues.length){bad.push(id+' '+label+': '+issues.join(','));await page.screenshot({path:'output/playwright/workbook-trial/overflow-'+bad.length+'.png'});}
  }
  for(let si=0;si<l.stages.length;si++){
   for(let fi=0;fi<l.stages[si].frames.length;fi++){
    const f=l.stages[si].frames[fi];assert.equal(await page.locator('#student-title').innerText(),f.title);frames++;
    await bounds(si+':'+fi); if(si===3&&fi===0)await page.screenshot({path:'output/playwright/workbook-trial/'+id+'.png'});
    if(f.lessonVisual){
     assert.equal(await page.locator('.lesson-visual svg').count(),1);
     for(let phase=0;phase<3;phase++)await page.getByRole('button',{name:'Next focus →',exact:true}).click();
     await bounds(si+':'+fi+' focus');
     if(!topics.has(l.pilotTopic)){topics.add(l.pilotTopic);await page.screenshot({path:'output/playwright/workbook-trial/'+l.pilotTopic+'.png'});}
     if(si===0){await page.getByRole('button',{name:'⛶ Enlarge',exact:true}).click();assert.equal(await page.locator('.visual-lightbox[open]').count(),1);await page.getByRole('button',{name:'Close visual ×'}).click();await page.locator('.teaching-content .lesson-visual').waitFor();}
    }
    if(f.type==='question'){
     assert.equal(await page.locator('.explanation').count(),0);
     if(f.options)await page.locator('[data-answer="'+f.answer+'"]').click();
     assert.equal(await page.locator('.explanation').count(),0);await a('reveal');await bounds(si+':'+fi+' revealed');
     assert.ok((await page.locator('.explanation').innerText()).includes(f.explanation));
    }
    if(fi<l.stages[si].frames.length-1)await a('next-step');
   }
   if(si<l.stages.length-1)await a('next-stage');
  }
  await page.reload();await a('resume-saved');assert.equal(await page.locator('#student-title').innerText(),l.stages.at(-1).frames.at(-1).title);
  await a('summary');const n=l.stages.length;assert.match(await page.locator('#panel').innerText(),new RegExp(n+' of '+n+'|'+n+' / '+n));await page.keyboard.press('Escape');
  for(let i=0;i<l.stages.length-1;i++)await a('back-stage');
  for(const [width,height]of [[1366,768],[1920,1080],[390,844]]){await page.setViewportSize({width,height});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,id+' responsive');if(width>900)await bounds('responsive '+width);}
  console.log('PASS flow '+id);await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);console.log('PASS '+frames+' frames across 6 workbook trial lessons; reveals, summary, reload and responsive checks');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});

