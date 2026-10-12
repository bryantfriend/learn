const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const {lessons}=await import('../src/lessons.js');const geo=lessons.filter(l=>l.catalog?.subjectId==='geography');
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch();const page=await browser.newPage();const errors=[],failures=[];let screens=0;
  page.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('output/playwright/course-model',{recursive:true});
  for(const size of [{width:1280,height:720},{width:1920,height:1080}]){
   await page.setViewportSize(size);await page.goto(`http://127.0.0.1:${server.address().port}/learn/`);
   await page.evaluate(()=>localStorage.clear());await page.reload();
   for(const lesson of geo){
    const result=await page.evaluate(l=>{
     const bad=[];let count=0;const click=s=>{const n=document.querySelector(s);if(!n)throw Error('Missing '+s);n.click();};
     click(document.querySelector('[data-action="switch-class"]')?'[data-action="switch-class"]':'[data-action="choose-lesson"]');click(`[data-id="${l.catalog.classes[0]}"]`);click('[data-id="geography"]');click(`[data-quarter="${l.catalog.quarter}"]`);click(`[data-lesson="${l.id}"]`);click('[data-action="picker-start"]');if(document.querySelector('[data-action="confirm"]'))click('[data-action="confirm"]');
     const check=(s,i,revealed=false)=>{
      const f=l.stages[s].frames[i],root=document.querySelector('.geo-concept-content'),controls=document.querySelector('.step-controls');count++;
      const issues=[];if(root.getBoundingClientRect().bottom>controls.getBoundingClientRect().top+1)issues.push('overlap');if(document.documentElement.scrollWidth>innerWidth)issues.push('page width');
      const nodes=document.querySelectorAll('.concept-copy,.concept-word,.source-evidence');
      for(const n of nodes)if(n.scrollHeight>n.clientHeight+3)issues.push(`${n.className}: ${n.scrollHeight-n.clientHeight}px scroll`);
      if(root.scrollHeight>root.clientHeight+3)issues.push('section scroll');
      if(!l.examId&&document.querySelector('.concept-rehearsal,.response-hint'))issues.push('generic cue');
      if(/\d+\.\d{3,}/.test(document.querySelector('.step-label').textContent))issues.push('unreadable timing precision');
      if(!revealed&&document.querySelector('.explanation'))issues.push('early answer');
      if(issues.length)bad.push({stage:l.stages[s].id,step:i,title:f.title,revealed,issues});
     };
     for(let s=0;s<l.stages.length;s++){
      for(let i=0;i<l.stages[s].frames.length;i++){
       const f=l.stages[s].frames[i];check(s,i);
       if(f.type==='question'){click('[data-action="reveal"]');check(s,i,true);if(f.allowHideAnswer){click('[data-action="hide-answer"]');if(f.hideInstructionsOnReveal&&!document.querySelector('.instructions'))throw Error('Instructions not restored');}}
       if(i<l.stages[s].frames.length-1)click('[data-action="next-step"]');
      }
      if(s<l.stages.length-1)click('[data-action="next-stage"]');
     }
     return {bad,count};
    },lesson);
    screens+=result.count;failures.push(...result.bad.map(x=>({lesson:lesson.id,width:size.width,...x})));
   }
  }
  const report={lessons:geo.length,screens,errors,failures};fs.writeFileSync('output/playwright/course-model/layout-audit.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({lessons:geo.length,screens,errorCount:errors.length,failures:failures.length,sample:failures.slice(0,12)},null,2));
  assert.deepEqual(errors,[]);assert.equal(failures.length,0,'See output/playwright/course-model/layout-audit.json');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
