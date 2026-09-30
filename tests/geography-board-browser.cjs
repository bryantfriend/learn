const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
 try{
  const base=`http://127.0.0.1:${server.address().port}/learn/`,page=await browser.newPage({viewport:{width:1366,height:900},hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('output/playwright/geography-board',{recursive:true});
  const {lessons}=await import('../src/lessons.js');
  await page.goto(base);
  // Actual player: open, interact, close, reopen; keep choices, not lesson marks.
  const l=lessons.find(l=>l.id==='g7a-geo-w02-1');
  await page.evaluate(l=>{const a=n=>document.querySelector(`[data-action="${n}"]`).click();a('choose-lesson');document.querySelector('[data-id="7a"]').click();document.querySelector('[data-id="geography"]').click();document.querySelector(`[data-lesson="${l.id}"]`).click();a('picker-start');a('stages');document.querySelector('[data-action="jump"][data-stage="2"]').click();a('geography-board');},l);
  await page.locator('[data-card="0"]').tap();await page.locator('[data-group="0"]').tap();
  await page.locator('[data-action="close-panel"]').click();await page.locator('[data-action="geography-board"]').click();assert.equal(await page.locator('[data-placed="0"]').count(),1);
  await page.getByRole('button',{name:'Reset activity',exact:true}).click();assert.equal(await page.locator('[data-placed]').count(),0);
  await page.locator('[data-action="close-panel"]').click();
  await page.locator('[data-action="stages"]').click();await page.locator('[data-action="jump"][data-stage="3"]').click();await page.locator('[data-action="task-source"]').click();
  await page.getByRole('button',{name:'View reference model ⛶',exact:true}).click();assert.equal(await page.locator('.lab-canvas svg').count(),1);
  await page.getByRole('button',{name:'← Return to task source',exact:true}).click();assert.match(await page.locator('#panel').innerText(),/model valley/);await page.locator('[data-action="close-panel"]').click();
  // Exercise every activity's rendered data with touch, then all six mechanics.
  const activities=lessons.filter(l=>l.geoRedesign).flatMap(l=>l.stages.flatMap(s=>s.frames.filter(f=>f.boardActivity).map(f=>f.boardActivity)));
  const unique=[...new Map(activities.map(a=>[a.id,a])).values()];
  await page.evaluate(()=>{document.body.innerHTML='<dialog id="panel" class="geography-board-panel"></dialog>';document.querySelector('#panel').showModal();});
  for(const spec of unique){
   await page.evaluate(async spec=>{const {createGeographyBoard,initialBoardState}=await import('./src/geography-board.js');window.boardState=initialBoardState(spec);document.querySelector('#panel').replaceChildren(createGeographyBoard(spec,window.boardState));},spec);
   assert.equal(await page.locator('.board-prompt').count(),1,spec.id);
   assert.equal(await page.locator('#panel').evaluate(n=>n.scrollWidth<=n.clientWidth),true,spec.id);
   assert.ok(await page.locator('.geo-board button').evaluateAll(bs=>bs.filter(b=>b.getClientRects().length).every(b=>b.getBoundingClientRect().height>=52)),spec.id);
  }
  for(const type of ['sort','sequence','decision','pin','allocation','budget']){
   const spec=unique.find(a=>a.type===type);
   await page.evaluate(async spec=>{const {createGeographyBoard,initialBoardState}=await import('./src/geography-board.js');window.boardState=initialBoardState(spec);document.querySelector('#panel').replaceChildren(createGeographyBoard(spec,window.boardState));},spec);
   assert.equal(await page.locator('.board-reason').count(),0);
   await page.getByRole('button',{name:'Check reasoning',exact:true}).click();
   if(['sort','sequence','decision','pin'].includes(type))assert.match(await page.locator('.board-feedback').innerText(),/Finish/);
   if(type==='sort'){
    await page.locator('[data-card="0"]').tap();await page.locator(`[data-group="${(spec.items[0].answer+1)%spec.groups.length}"]`).tap();
    await page.locator('[data-placed="0"]').tap();await page.locator(`[data-group="${spec.items[0].answer}"]`).tap();
    for(const item of spec.items.slice(1)){await page.locator(`[data-card="${item.id}"]`).tap();await page.locator(`[data-group="${item.answer}"]`).tap();}
   }else if(type==='sequence'){
    await page.locator(`[data-card="${spec.items.at(-1).id}"]`).tap();await page.getByRole('button',{name:'Undo last card'}).click();
    for(const item of spec.items)await page.locator(`[data-card="${item.id}"]`).tap();
   }else if(type==='decision'){
    await page.getByRole('button',{name:spec.question.choices[1],exact:true}).tap();await page.getByRole('button',{name:'Check reasoning',exact:true}).click();assert.match(await page.locator('.board-feedback').innerText(),/Reconsider/);
    await page.getByRole('button',{name:spec.question.choices[0],exact:true}).focus();await page.keyboard.press('Enter');assert.equal(await page.locator('button[aria-pressed="true"]').count(),1);
   }else if(type==='pin'){
    const pos=await page.locator('.board-grid').evaluate((svg,target)=>{const p=svg.createSVGPoint();p.x=70+45*target[0];p.y=480-45*target[1];const s=p.matrixTransform(svg.getScreenCTM());return {x:s.x,y:s.y};},spec.target);
    await page.touchscreen.tap(pos.x,pos.y);
   }else if(type==='allocation'){
    await page.getByRole('button',{name:'Farms −5',exact:true}).tap();await page.getByRole('button',{name:'Farms −5',exact:true}).tap();
   }else if(type==='budget'){
    await page.getByRole('button',{name:'Wall · 80 tokens',exact:true}).tap();await page.getByRole('button',{name:'Check reasoning',exact:true}).click();assert.match(await page.locator('.board-feedback').innerText(),/Reconsider/);
    await page.getByRole('button',{name:'Wall · 80 tokens',exact:true}).tap();await page.getByRole('button',{name:'Warnings · 10 tokens',exact:true}).tap();await page.getByRole('button',{name:'Wetland storage · 40 tokens',exact:true}).tap();
   }
   await page.getByRole('button',{name:'Check reasoning',exact:true}).click();assert.match(await page.locator('.board-feedback').innerText(),/fits the stated conditions/,type);
   await page.getByRole('button',{name:'Reveal explanation',exact:true}).click();assert.ok(await page.locator('.board-reason').innerText());
   if(type==='decision'&&spec.rounds?.length>1){
    await page.getByRole('button',{name:'Next changed case →',exact:true}).tap();assert.equal(await page.locator('.board-reason').count(),0);assert.match(await page.locator('.board-case').innerText(),/Case 2/);
    await page.getByRole('button',{name:spec.rounds[1].choices[0],exact:true}).tap();await page.getByRole('button',{name:'Check reasoning',exact:true}).click();assert.match(await page.locator('.board-feedback').innerText(),/fits/);
   }
   await page.screenshot({path:`output/playwright/geography-board/${type}.png`,fullPage:true});
   await page.getByRole('button',{name:'Reset activity',exact:true}).click();assert.equal(await page.locator('.board-feedback').count(),0);
   await page.setViewportSize({width:390,height:844});assert.equal(await page.locator('#panel').evaluate(n=>n.scrollWidth<=n.clientWidth),true,type);await page.setViewportSize({width:1366,height:900});
  }
  assert.deepEqual(errors,[]);console.log(`PASS ${unique.length} board activity views; six mechanics; touch, keyboard, reset and reopen.`);
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
