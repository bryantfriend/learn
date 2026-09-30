const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createServer}=require('../scripts/serve.cjs'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1366,height:900},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('output/playwright/geography-postcards',{recursive:true});await page.goto(`http://127.0.0.1:${server.address().port}/learn/`);
 await page.evaluate(()=>{const a=n=>document.querySelector(`[data-action="${n}"]`).click();a('choose-lesson');document.querySelector('[data-id="7b"]').click();document.querySelector('[data-id="geography"]').click();document.querySelector('[data-lesson="g7b-geo-w02-1"]').click();a('picker-start');});
 assert.equal(await page.locator('.atlas-canvas svg').count(),1);await page.screenshot({path:'output/playwright/geography-postcards/prediction.png'});
 const jump=async n=>{await page.locator('[data-action="stages"]').click();await page.locator(`[data-action="jump"][data-stage="${n}"]`).click();};
 assert.deepEqual(await page.locator('.opening-choices li').allTextContents(),['Great Britain','The island of Ireland']);
 await jump(1);assert.equal(await page.locator('.atlas-comparison svg').count(),2);await page.screenshot({path:'output/playwright/geography-postcards/two-maps.png'});
 await page.locator('[data-action="next-step"]').click();for(const label of ['World','Europe','UK & Ireland']){await page.getByRole('button',{name:label,exact:true}).tap();await page.screenshot({path:`output/playwright/geography-postcards/scale-${label.replace(/\W/g,'')}.png`});}
 await page.locator('[data-action="next-step"]').click();assert.match(await page.locator('.teaching-content .geo-atlas figcaption').innerText(),/0 of 4/);
 for(const name of ['England','Scotland','Wales','Northern Ireland']){await page.getByRole('button',{name:'Reveal '+name,exact:true}).press('Enter');}
 assert.match(await page.locator('.teaching-content .geo-atlas figcaption').innerText(),/4 of 4/);await page.screenshot({path:'output/playwright/geography-postcards/filled-map.png'});
 await page.locator('[data-action="geography-evidence"]').click();assert.match(await page.locator('#panel figcaption').innerText(),/4 of 4/);await page.locator('#panel').getByRole('button',{name:'Clear country labels',exact:true}).click();await page.keyboard.press('Escape');assert.match(await page.locator('.teaching-content figcaption').innerText(),/0 of 4/);
 await page.getByRole('button',{name:'Clear country labels',exact:true}).click();assert.match(await page.locator('.teaching-content .geo-atlas figcaption').innerText(),/0 of 4/);
 await jump(2);await page.locator('[data-action="geography-postcards"]').click();await page.locator('[data-card="0"]').tap();await page.locator('[data-group="0"]').tap();assert.equal(await page.locator('[data-placed="0"]').count(),1);await page.locator('[data-action="close-panel"]').click();await page.locator('[data-action="geography-postcards"]').click();assert.equal(await page.locator('[data-placed="0"]').count(),1);
 await page.getByRole('button',{name:'Next: UK membership',exact:true}).click();assert.equal(await page.locator('[data-placed]').count(),0);await page.screenshot({path:'output/playwright/geography-postcards/sorting.png'});await page.locator('[data-action="close-panel"]').click();
 await jump(3);await page.locator('[data-action="geography-postcards"]').click();
 assert.equal(await page.locator('[data-card]').count(),2);assert.match(await page.locator('.post-map svg').textContent(),/London/);assert.match(await page.locator('.post-map svg').textContent(),/Irish Sea/);
 for(const [id,target]of [['london','England'],['cardiff','Wales']]){await page.locator(`[data-card="${id}"]`).tap();await page.locator(`[data-drop="${target}"]`).press('Enter');}
 await page.getByRole('button',{name:'Check deliveries',exact:true}).click();assert.match(await page.locator('.post-status').innerText(),/2 of 2/);
 await page.screenshot({path:'output/playwright/geography-postcards/mission-1.png'});await page.getByRole('button',{name:'Mission 2: swap jobs',exact:true}).click();
 // Real pointer path, not HTML drag-and-drop synthesis: matches touch/pen handler.
 const from=await page.locator('[data-card="belfast"]').boundingBox(),to=await page.locator('[data-drop="Northern Ireland"]').boundingBox();await page.mouse.move(from.x+from.width/2,from.y+25);await page.mouse.down();await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:15});await page.mouse.up();assert.match(await page.locator('[data-placed="belfast"]').innerText(),/Northern Ireland/);
 await page.locator('[data-card="edinburgh"]').tap();await page.locator('[data-drop="Scotland"]').press('Enter');
 await page.getByRole('button',{name:'Check deliveries',exact:true}).click();assert.match(await page.locator('.post-status').innerText(),/All four delivered/);await page.screenshot({path:'output/playwright/geography-postcards/delivered.png'});
 await page.getByRole('button',{name:'Reset activity',exact:true}).click();assert.equal(await page.locator('[data-placed]').count(),0);
 await page.locator('[data-card="london"]').focus();await page.keyboard.press('Enter');await page.locator('[data-drop="England"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-placed="london"]').count(),1);
 await page.setViewportSize({width:390,height:844});assert.equal(await page.locator('#panel').evaluate(n=>n.scrollWidth<=n.clientWidth),true);
 // Touch movement uses the same pointer handlers as a smart board, including
 // capture and release; validate both generic sorting and process sequencing.
 await page.setViewportSize({width:1366,height:900});const cdp=await page.context().newCDPSession(page);
 for(const type of ['sort','sequence']){
  await page.evaluate(async type=>{const {lessons}=await import('./src/lessons.js'),{createGeographyBoard,initialBoardState}=await import('./src/geography-board.js');const spec=lessons.flatMap(l=>l.stages.flatMap(s=>s.frames)).find(f=>f.boardActivity?.type===type).boardActivity;window.dragState=initialBoardState(spec);window.dragSpec=spec;document.querySelector('#panel').replaceChildren(createGeographyBoard(spec,window.dragState));document.querySelector('#panel').scrollTop=0;},type);
  const target=await page.evaluate(()=>window.dragSpec.type==='sort'?window.dragSpec.items[0].answer:0),a=await page.locator('[data-card="0"]').boundingBox(),b=await page.locator(`[data-drop="${target}"]`).boundingBox();
  const x=a.x+a.width/2,y=a.y+a.height/2,tx=b.x+b.width/2,ty=b.y+Math.min(b.height/2,30); await page.screenshot({path:'output/playwright/geography-postcards/touch-'+type+'.png'});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=12;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+(tx-x)*i/12,y:y+(ty-y)*i/12}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await page.evaluate(type=>type==='sort'?window.dragState.placements['0']===window.dragSpec.items[0].answer:window.dragState.order[0]==='0',type),true,type+' touch drag');
 }
 assert.deepEqual(errors,[]);console.log('PASS maps, scale controls, sorting-rule change, persistent deliveries, real pointer and touch dragging, keyboard, reset and mobile');
 }finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
