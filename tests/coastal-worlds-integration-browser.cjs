const {chromium}=require('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright');
const fs=require('fs'),assert=require('node:assert/strict');
const dir='output/web-game/coastal-worlds';fs.mkdirSync(dir,{recursive:true});
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 for(const language of ['en','ru','ky'])for(const world of ['uk','kyrgyzstan']){
  await page.goto('http://127.0.0.1:4173/learn/coastal-connections.html');await page.locator('[data-language]').selectOption(language);await page.locator('[data-world='+world+']').click();
  assert.equal(await page.locator('.coastal-world-coming').count(),3);
  if(language==='en'&&world==='kyrgyzstan'){await page.waitForTimeout(150);await page.screenshot({path:dir+'/world-picker.png'});}
  await page.locator('[data-start-journey]').click();await page.waitForTimeout(80);
  const s=await page.evaluate(()=>JSON.parse(render_game_to_text()));assert.equal(s.world,world);assert.equal(s.language,language);assert.equal(await page.locator('.coastal-vehicle-info:visible').count(),1);
 }
 await page.evaluate(async()=>{
  const m=await import('./src/coastal-connections.js');window.engine=m;
  const exp=await import('./src/coastal-expedition.js');localStorage.setItem('coastal-journey-slot-0',exp.encodeSave(m.createGameState(5,'normal','uk','ru')));
  const s=m.createGameState(3,'normal','kyrgyzstan','ru');s.tutorial.status='skipped';window.testGame=m.createCoastalGame(s);document.body.replaceChildren(testGame.element);
  m.buyRoute(testGame.state,0,1,'road');testGame.state.running=true;advanceTime(8000);m.buyRoute(testGame.state,1,2,'road');advanceTime(20000);
 });
 const complete=await page.evaluate(()=>JSON.parse(render_game_to_text()));assert.equal(complete.complete,true);
 // The completion celebration offers a review; closing it exposes card selection.
 await page.locator('.coastal-celebration').getByRole('button').first().click();
 await page.locator('.coastal-journal-extras summary').click();
 await page.getByRole('button',{name:'Обзор сети',exact:true}).click();
 await page.locator('.coastal-passport-close').click();await page.waitForTimeout(100);
 assert.ok(await page.locator('.coastal-choice').count()>=3);
 await page.screenshot({path:dir+'/kg-ru-cards.png'});
 await page.evaluate(async()=>{
  testGame.destroy();const m=engine,s=m.createGameState(2,'hard','kyrgyzstan','ky');s.tutorial.status='skipped';while(s.round<27){s.complete=true;s.cardPhase='done';m.nextRound(s);}s.credits=1000;s.complete=false;s.cardPhase='done';window.testGame=m.createCoastalGame(s);document.body.replaceChildren(testGame.element);window.advanceTime(0);
  const map=await import('./src/coastal-map.js'),bounds=map.geographyBounds(27),z=Math.min(1000/(bounds.right-bounds.left),600/(bounds.bottom-bounds.top));testGame.state.camera={zoom:z,x:500-(bounds.left+bounds.right)/2*z,y:300-(bounds.top+bounds.bottom)/2*z};advanceTime(0);
 });
 await page.waitForTimeout(500);await page.screenshot({path:dir+'/kg-full-map.png'});
 const assets=await page.evaluate(async()=>{const a=await import('./assets/coastal/kyrgyzstan/art-prompts.json',{with:{type:'json'}}).catch(()=>null);return a?.default??[];});
 const manifest=JSON.parse(fs.readFileSync('assets/coastal/kyrgyzstan/art-prompts.json','utf8'));
 const broken=await page.evaluate(async ids=>{const checks=await Promise.all(ids.map(id=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(null);i.onerror=()=>resolve(id);i.src='./assets/coastal/kyrgyzstan/'+id+'.jpg';})));return checks.filter(Boolean);},manifest.map(x=>x.id));assert.deepEqual(broken,[]);assert.equal(manifest.length,53);
 // Raw answer values survive translation and award the correct credit amount.
 await page.evaluate(async()=>{const s=testGame.state;s.learning.coin={id:1,city:0,region:'chuy',question:3,x:50,y:50};s.complete=false;s.running=false;advanceTime(0);});
 await page.locator('.coastal-quiz-coin').click();const before=await page.evaluate(()=>testGame.state.credits);
 await page.locator('[data-answer="Chuy River"]').click();assert.ok(await page.evaluate(()=>testGame.state.credits)>=before+15);assert.equal(await page.evaluate(()=>testGame.state.learning.earned),15);
 await page.screenshot({path:dir+'/kg-ky-quiz.png'});await page.locator('.coastal-quiz-shop button').first().click();
 await page.locator('[data-stop="0"]').evaluate(el=>el.click());const station=await page.locator('dialog[open]').innerText();assert.ok(!station.includes('harbour'));assert.ok(station.includes('Бекетти жакшыртуу'));await page.screenshot({path:dir+'/kg-ky-station.png'});await page.locator('dialog[open] button').first().click();
 await page.locator('.coastal-vehicle-info').first().click();assert.ok((await page.locator('dialog[open]').innerText()).includes('Маршрутка'));await page.screenshot({path:dir+'/kg-ky-vehicle.png'});await page.locator('dialog[open] button').first().click();
 // Saved journeys switch the active world and language as well as round state.
 await page.getByRole('button',{name:'▣ Сактоо / улантуу',exact:true}).evaluate(el=>el.click());
 await page.locator('.coastal-save-slot').first().getByRole('button').last().click();await page.waitForTimeout(150);
 assert.equal(await page.evaluate(()=>testGame.state.world),'uk');assert.equal(await page.evaluate(()=>testGame.state.language),'ru');assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).stops[0].name),'London');
 const mobile=await browser.newPage({viewport:{width:390,height:844}});await mobile.goto('http://127.0.0.1:4173/learn/coastal-connections.html');await mobile.locator('[data-language]').selectOption('ky');assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await mobile.screenshot({path:dir+'/picker-mobile.png',fullPage:true});await mobile.locator('[data-world=kyrgyzstan]').click();await mobile.locator('[data-start-journey]').click();await mobile.waitForTimeout(200);assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);console.log('PASS both worlds × 3 languages, first-round completion/cards, 53 art assets, translated quiz rewards, station/vehicle modals, mobile layout.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
