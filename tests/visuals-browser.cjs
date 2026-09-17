const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('fs');
const {createServer}=require('../scripts/serve.cjs');const server=createServer();let browser;
(async()=>{
 const {lessons}=await import('../src/lessons.js'),{visualSpec}=await import('../src/visuals.js');
 await new Promise(r=>server.listen(4183,'127.0.0.1',r));browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));const url=process.env.LEARN_URL||'http://127.0.0.1:4183/learn/';
 await page.goto(url);fs.mkdirSync('output/playwright',{recursive:true});
 async function load(l,stage=0,step=0){
  await page.evaluate(({l,stage,step})=>{localStorage.clear();const steps=l.stages.map(()=>0);steps[stage]=step;localStorage.setItem('learn.session.v1',JSON.stringify({schemaVersion:3,lessonId:l.id,contentRevision:l.contentRevision,classId:l.catalog.classes?.[0]||'8',subjectId:l.catalog.subjectId,classLabel:'',stage,steps,responses:{},stars:0,preferences:{starsVisible:false,timerVisible:true},timer:{durationMs:60000,remainingMs:60000,running:false,deadline:null},seenFrames:{},attentionReturns:{},discussedQuestions:[],startedAt:Date.now(),finishedAt:null}));},{l,stage,step});
  await page.evaluate(()=>{const seeded=localStorage.getItem('learn.session.v1');window.addEventListener('pagehide',()=>{localStorage.clear();localStorage.setItem('learn.session.v1',seeded);},{once:true});});
  await page.reload();await page.locator('[data-action="resume-saved"]').click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('learn.session.v1')).lessonId),l.id);
 }
 let count=0,covered=0;
 if(!process.env.CONTROLS_ONLY)for(const l of lessons){
  let did=false;
  for(let si=0;si<l.stages.length;si++)for(let fi=0;fi<l.stages[si].frames.length;fi++){
   if(!visualSpec(l,l.stages[si],l.stages[si].frames[fi]))continue;
   await load(l,si,fi);
   const bad=await page.evaluate(()=>{const c=document.querySelector('.step-controls').getBoundingClientRect();return [...document.querySelectorAll('.copy h1,.instructions,.footnote,.lesson-visual')].filter(n=>{const r=n.getBoundingClientRect();return r.bottom>c.top+2||r.left<0||r.right>innerWidth+1;}).map(n=>n.className);});
   assert.deepEqual(bad,[],l.id+' '+si+':'+fi);assert.equal(await page.locator('.lesson-visual svg').count(),1);count++;did=true;
  }
  if(did){covered++;console.log('PASS illustrated '+l.id);}
 }
 await load(lessons.find(l=>l.id==='g8-gp-6.5'));await page.locator('[data-choice="0"]').click();await page.locator('[data-choice="1"]').click();assert.match(await page.locator('.visual-caption').innerText(),/130 \/ 100/);await page.screenshot({path:'output/playwright/visual-budget-board.png'});await page.getByRole('button',{name:'↺ Reset',exact:true}).click();assert.match(await page.locator('.visual-caption').innerText(),/0 \/ 100/);
 const cycle=lessons.find(l=>l.id==='g7b-geo-w18-1');await load(cycle);
 const phase=await page.evaluate(()=>JSON.parse(localStorage.getItem('learn.session.v1')).stage);
 assert.equal(await page.locator('.lesson-visual.is-playing').count(),0);
 await page.getByRole('button',{name:'▶ Play',exact:true}).click();
 assert.equal(await page.locator('.lesson-visual.is-playing').count(),1);
 await page.getByRole('button',{name:'Next focus →',exact:true}).click();assert.match(await page.locator('.visual-caption').innerText(),/Moving ice/);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('learn.session.v1')).stage),phase);
 await page.locator('[data-action="attention"]').click();assert.equal(await page.locator('.lesson-visual.is-playing').count(),0);await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'⛶ Enlarge',exact:true}).click();assert.equal(await page.locator('.visual-lightbox[open]').count(),1);
 await page.screenshot({path:'output/playwright/visual-cycle-large.png'});
 await page.getByRole('button',{name:'Close visual ×'}).click();await page.locator('.teaching-content .lesson-visual').waitFor();assert.equal(await page.locator('.teaching-content .lesson-visual').count(),1);
 await page.getByRole('button',{name:'▶ Play',exact:true}).click();assert.equal(await page.locator('.lesson-visual.is-playing').count(),1);
 await page.getByRole('button',{name:'↺ Reset',exact:true}).click();assert.equal(await page.locator('.lesson-visual.is-playing').count(),0);
 const flood=lessons.find(l=>l.id==='g7b-geo-w33-1');await load(flood);
 await page.getByRole('button',{name:'Add rain',exact:true}).click();const soil=await page.locator('.water-level').getAttribute('height');
 await page.getByRole('button',{name:'Surface: soil',exact:true}).click();const paved=await page.locator('.water-level').getAttribute('height');assert.ok(Number(paved)>Number(soil));
 await page.screenshot({path:'output/playwright/visual-flood-board.png'});
 for(const [width,height] of [[1366,768],[1920,1080],[390,844]]){
  await page.setViewportSize({width,height});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 await page.setViewportSize({width:1280,height:720});await page.emulateMedia({reducedMotion:'reduce'});await load(cycle);
 assert.equal(await page.locator('.visual-play').isDisabled(),true);assert.equal(await page.evaluate(()=>document.querySelector('.lesson-visual').getAnimations({subtree:true}).length),0);
 await page.getByRole('button',{name:'Next focus →',exact:true}).click();assert.match(await page.locator('.visual-caption').innerText(),/Moving ice/);
 await page.emulateMedia({reducedMotion:'no-preference'});await load(lessons.find(l=>l.id==='g8-gp-1.2'));await page.screenshot({path:'output/playwright/visual-perspectives-board.png'});
 await load(lessons.find(l=>l.id==='g7b-gp-w09-3'));await page.screenshot({path:'output/playwright/visual-data-board.png'});
 assert.deepEqual(errors,[]);console.log('PASS '+count+' visual frames across '+covered+' lessons; teacher controls, Attention, enlarged view, runoff interaction, reduced motion and responsive checks');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
