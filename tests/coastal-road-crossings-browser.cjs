const {chromium}=require('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/learn/coastal-connections.html');await page.locator('[data-mode=normal]').click();
 await page.evaluate(async()=>{const m=await import('./src/coastal-connections.js'),s=m.createGameState(1);while(s.round<3){s.complete=true;s.cardPhase='done';m.nextRound(s);}s.credits=1000;s.tutorial.status='skipped';m.buyRoute(s,0,3,'road');document.body.replaceChildren(m.createCoastalGame(s).element);advanceTime(0);});
 const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
 const point=async id=>{const s=await state(),p=s.stops[id],r=await page.locator('canvas').boundingBox(),scale=Math.min(r.width/1000,r.height/600);return{x:r.x+(r.width-1000*scale)/2+(p.x*s.camera.zoom+s.camera.x)*scale,y:r.y+(r.height-600*scale)/2+(p.y*s.camera.zoom+s.camera.y)*scale};};
 await page.getByRole('button',{name:'Fit map',exact:true}).click();await page.locator('.coastal-line-dot[data-built=false]').first().click();
 const drag=async()=>{const a=await point(1),b=await point(4);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:12});await page.mouse.up();};
 await drag();assert.match(await page.locator('.coastal-route-feedback').innerText(),/cannot cross.*London ↔ Birmingham/s);assert.equal((await state()).credits,980);assert.equal((await state()).links.length,1);
 fs.mkdirSync('output/web-game/coastal-road-crossings',{recursive:true});await page.screenshot({path:'output/web-game/coastal-road-crossings/rejected.png'});
 await page.getByRole('button',{name:'Manage routes',exact:true}).click();await page.getByRole('button',{name:/Remove London ↔ Birmingham/}).click();await drag();assert.equal((await state()).links.length,1);assert.equal((await state()).links[0].a,1);assert.equal((await state()).links[0].b,4);assert.equal((await state()).credits,980);
 await page.screenshot({path:'output/web-game/coastal-road-crossings/redrawn.png'});assert.deepEqual(errors,[]);console.log('PASS crossing drag feedback, no spending on rejection, section removal and redrawing.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
