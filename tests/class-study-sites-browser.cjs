const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  const root=`http://127.0.0.1:${server.address().port}/learn/study-guides/`;
  const sites=JSON.parse(fs.readFileSync('study-guides/qr/sites.json','utf8'));
  for(const site of sites){
   await page.goto(root+site.slug+'/');
   assert.equal(await page.locator('body').getAttribute('data-guide'),site.guide);
   assert.equal(await page.locator('.illustrated-poster').count(),5);
   assert.ok(await page.locator('.poster-gallery img').evaluateAll(images=>Promise.all(images.map(i=>i.decode().then(()=>true)) ).then(a=>a.every(Boolean))));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('.sidebar nav a').first().click();
   assert.ok(page.url().includes('/'+site.slug+'/#'));
   await page.reload();
   assert.equal(await page.locator('body').getAttribute('data-guide'),site.guide);
   await page.locator('header select').selectOption('ru');
   assert.ok(page.url().includes('/'+site.slug+'/?lang=ru'));
   await page.reload();
   assert.equal(await page.locator('html').getAttribute('lang'),'ru');
   await page.goBack();
   assert.equal(await page.locator('body').getAttribute('data-guide'),site.guide);
  }
  await page.goto(root);
  await page.locator('.guide-card').first().click();
  await page.reload();
  assert.equal(await page.locator('body').getAttribute('data-guide'),'geo7a');
  await page.goto(root+'qr/');
  assert.equal(await page.locator('article').count(),5);
  assert.equal(await page.locator('a[download]').count(),5);
  for(const link of await page.locator('a[download]').evaluateAll(a=>a.map(x=>x.href))){
   assert.equal((await page.request.get(link)).status(),200);
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  fs.mkdirSync('output/playwright/class-study-sites',{recursive:true});
  await page.setViewportSize({width:1280,height:900});
  await page.screenshot({path:'output/playwright/class-study-sites/qr-cards.png',fullPage:true});
  await page.goto(root+'7a-global-perspectives/');
  await page.screenshot({path:'output/playwright/class-study-sites/7a-gp.png',fullPage:false});
  assert.deepEqual(errors,[]);
  console.log('PASS all five direct URLs, images, mobile width, anchors, reload, language switching, history, hub navigation and QR downloads');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
