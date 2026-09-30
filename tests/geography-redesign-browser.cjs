const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
 try{
  fs.mkdirSync('output/playwright/geography-redesign',{recursive:true});
  const {lessons}=await import('../src/lessons.js');const page=await browser.newPage({viewport:{width:1280,height:720}});const errors=[],bad=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/learn/`);const captured=new Set();let frames=0;
  for(const l of lessons.filter(l=>l.geoRedesign)){
   const result=await page.evaluate(l=>{
    const click=s=>{const e=document.querySelector(s);if(!e)throw Error('Missing '+s);e.click();};const a=n=>click(`[data-action="${n}"]`);
    a(document.querySelector('[data-action="switch-class"]')?'switch-class':'choose-lesson');click(`[data-id="${l.catalog.classes[0]}"]`);click('[data-id="geography"]');click(`[data-quarter="${l.catalog.quarter}"]`);click(`[data-lesson="${l.id}"]`);a('picker-start');if(document.querySelector('[data-action="confirm"]'))a('confirm');
    const bad=[];let count=0;
    const bounds=label=>{const limit=document.querySelector('.step-controls').getBoundingClientRect().top;for(const e of document.querySelectorAll('.copy h1,.instructions,.footnote,.answer-detail,.question-bank-button,.board-work-button,.copy .explanation,.teaching-content>.geography-evidence,.teaching-content>.geo-atlas')){const r=e.getBoundingClientRect();if(r.bottom>limit+2||r.right>innerWidth+1||r.left<0)bad.push([l.id,label,e.className]);}};
    for(let si=0;si<l.stages.length;si++){for(let fi=0;fi<l.stages[si].frames.length;fi++){
     count++;bounds(si+':'+fi);const f=l.stages[si].frames[fi];
     if(f.simulation){a('geography-lab');if(!document.querySelector('.lab-canvas svg'))throw Error('Missing SVG');a('close-panel');}
     if(f.boardActivity){a('geography-board');if(!document.querySelector('.geo-board button'))throw Error('Missing board controls');a('close-panel');}
     if(typeof f.sourceCard==='string'){a('task-source');if(!document.querySelector('#panel').textContent.includes(f.sourceCard))throw Error('Missing source');a('close-panel');}
     if(f.type==='question'){a('reveal');bounds(si+':'+fi+' revealed');}
     if(fi<l.stages[si].frames.length-1)a('next-step');
    }if(si<l.stages.length-1)a('next-stage');}
    return {bad,count};
   },l);bad.push(...result.bad);frames+=result.count;
   const sim=l.stages.find(s=>s.id==='investigate').frames.find(f=>f.simulation)?.simulation;
   if(sim&&!captured.has(sim.kind)){
    captured.add(sim.kind);await page.locator('[data-action="stages"]').click();await page.locator('[data-action="jump"][data-stage="2"]').click();
    await page.evaluate(()=>{let prev;while((prev=document.querySelector('[data-action="previous-step"]'))&&!prev.disabled)prev.click();});
    await page.locator('[data-action="geography-lab"]').click();
    for(let i=0;i<3;i++){assert.ok((await page.locator('.lab-caption').innerText()).startsWith((i+1)+'/3'));await page.getByRole('button',{name:'Next case →',exact:true}).click();}
    for(const input of await page.locator('.lab-controls input').all()){await input.fill(await input.getAttribute('max'));await input.dispatchEvent('input');}
    await page.getByRole('button',{name:'Reset',exact:true}).click();await page.screenshot({path:`output/playwright/geography-redesign/${sim.kind}.png`});
    assert.equal(await page.locator('#panel').evaluate(n=>n.scrollWidth<=n.clientWidth),true);
    await page.keyboard.press('Escape');
   }
  }
  // Test optional games across Geography, GP and workbook-trial content.
  for(const id of ['g7a-geo-w02-1','g8-gp-1.1','gp-books-7a-research-1-part-1']){
   const l=lessons.find(l=>l.id===id);await page.evaluate(l=>{const a=n=>document.querySelector(`[data-action="${n}"]`).click();a('switch-class');document.querySelector(`[data-id="${l.catalog.classes?.[0]||'8'}"]`).click();document.querySelector(`[data-id="${l.catalog.subjectId}"]`).click();if(l.catalog.quarter)document.querySelector(`[data-quarter="${l.catalog.quarter}"]`).click();document.querySelector(`[data-lesson="${l.id}"]`).click();a('picker-start');if(document.querySelector('[data-action="confirm"]'))a('confirm');},l);
   const title=await page.locator('#student-title').innerText();await page.locator('[data-action="extensions"]').first().click();
   assert.equal(await page.locator('.extra-explanation').count(),0);await page.getByRole('button',{name:'Reveal explanation',exact:true}).click();assert.ok(await page.locator('.extra-explanation').innerText());
   if(await page.getByRole('button',{name:'Next round',exact:true}).isEnabled()){await page.getByRole('button',{name:'Next round',exact:true}).click();assert.equal(await page.locator('.extra-explanation').count(),0);}
   for(let i=1;i<4;i++){await page.locator(`.extra-menu [data-index="${i}"]`).click();assert.equal(await page.locator('.extra-explanation').count(),0);}
   await page.locator('.extra-menu [data-index="2"]').click();await page.getByRole('button',{name:'Hide source',exact:true}).click();assert.equal(await page.locator('.extra-source').count(),0);await page.getByRole('button',{name:'Show source',exact:true}).click();
   await page.locator('.extra-menu [data-index="0"]').click();await page.screenshot({path:`output/playwright/geography-redesign/extra-${id}.png`});await page.keyboard.press('Escape');assert.equal(await page.locator('#student-title').innerText(),title);
  }
  await page.setViewportSize({width:390,height:844});await page.locator('[data-action="extensions"]').first().click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  fs.writeFileSync('output/playwright/geography-redesign/overflow.json',JSON.stringify(bad,null,2));assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);console.log(`PASS ${frames} Geography frames; ${captured.size} model families; extra-time reveals and navigation`);
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
