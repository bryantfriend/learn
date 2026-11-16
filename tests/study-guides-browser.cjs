const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch(),errors=[],folder='output/playwright/study-guides-v2';
 fs.mkdirSync(folder,{recursive:true});let checks=0,posters=0;
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  const root=`http://127.0.0.1:${server.address().port}/learn/study-guides/`;
  const {posterPlans}=await import('../study-guides/illustrated-infographics.js');
  for(const lang of ['en','ru','tr','zh']){
   const d=(await import(`../study-guides/data/${lang}.js`)).default;
   for(const guide of Object.keys(posterPlans)){
    for(const size of [{width:1280,height:720},{width:1920,height:1080},{width:390,height:844}]){
     await page.setViewportSize(size);await page.goto(root+`?guide=${guide}&lang=${lang}`);
     await page.locator('.illustrated-poster').first().waitFor();
     assert.equal(await page.locator('h1').textContent(),d.guides[guide][0]);
     assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-Hans':lang);
     assert.equal(await page.locator('.content figure').count(),5);
     assert.deepEqual(await page.locator('.content figure').evaluateAll(a=>a.map(n=>n.dataset.poster)),posterPlans[guide].map(p=>p[0]));
     await page.locator('.poster-image').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode();})));
     assert.equal(await page.locator('.poster-image').evaluateAll(a=>a.filter(n=>n.naturalWidth>=1024).length),5);
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${guide}/${lang}/${size.width}: page overflow`);
     assert.equal(await page.getByText('undefined',{exact:false}).count(),0);
     if(guide==='geo7a')assert.equal(await page.locator('#countries,#uk,#weather,#snow,#vortex').count(),0);
     if(guide==='geo7b')assert.equal(await page.locator('#map,#compass,#scale,#features').count(),0);
     for(const section of await page.locator('section:has(.quiz)').all()){
      const id=await section.getAttribute('id');assert.ok(!(await section.locator('.result').isVisible()));
      await section.locator(`input[value="${d.topics[id].check.answer}"]`).check();await section.locator('.quiz button').click();
      assert.ok((await section.locator('.result').textContent()).includes(d.ui.correct));checks++;
     }
     posters+=5;
     if(size.width===1280&&lang==='en')for(const[id]of posterPlans[guide])await page.locator(`[data-poster=${id}]`).screenshot({path:`${folder}/${id}.png`});
     if(size.width===390){await page.locator('.illustrated-poster').first().scrollIntoViewIfNeeded();await page.screenshot({path:`${folder}/${guide}-${lang}-mobile.png`});}
    }
   }
  }
  await page.setViewportSize({width:1280,height:720});await page.goto(root+'?guide=geo7a&lang=en');
  await page.locator('#scale input[type=range]').fill('6');assert.match(await page.locator('output').first().textContent(),/300 m/);
  await page.locator('[data-understood=map]').click();await page.reload();assert.equal(await page.locator('[data-understood=map]').getAttribute('aria-pressed'),'true');
  await page.locator('header select').selectOption('ru');assert.equal(await page.locator('[data-understood=map]').getAttribute('aria-pressed'),'true');
  await page.locator('aside input[type=checkbox]').check();await page.reload();assert.ok(await page.locator('#compass [data-english-terms]').isVisible());
  for(const guide of Object.keys(posterPlans)){
   await page.goto(root+`?guide=${guide}&lang=ru`);const id=posterPlans[guide][0][0];
   await page.locator(`[data-enlarge=${id}]`).click();assert.ok(await page.locator('dialog').isVisible());
   await page.locator('dialog .poster-image').evaluate(n=>n.decode());await page.keyboard.press('Escape');assert.ok(!(await page.locator('dialog').isVisible()));
  }
  await page.goto(root+'?guide=geo7b&lang=en');await page.locator('path[data-country="Northern Ireland"]').first().dispatchEvent('click');
  assert.match(await page.locator('.country-output').first().textContent(),/Belfast/);
  await page.locator('.country-controls').first().locator('button').nth(1).click();assert.match(await page.locator('.country-output').first().textContent(),/not on Great Britain/);
  await page.goto(root+'?lang=tr');assert.equal(await page.locator('.guide-card').count(),5);
  await page.locator('.guide-card').first().click();assert.ok(page.url().includes('/7a-geography/'));
  const base=root.replace('study-guides/','');await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('a[href="./study-guides/"]').click();await page.locator('.guide-card').first().waitFor();
  await page.setViewportSize({width:390,height:844});
  for(const l of ['en','ru','tr','zh']){
   await page.goto(base+'students/?lang='+l,{waitUntil:'domcontentloaded'});
   await page.locator('a[href="../study-guides/?lang='+l+'"]').waitFor();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'student entry overflow '+l);
   await page.locator('a[href="../study-guides/?lang='+l+'"]').click();await page.locator('.guide-card').first().waitFor();assert.ok(page.url().includes('lang='+l));
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({versions:20,viewports:3,checks,posters,originalArtworks:25,errors}));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
