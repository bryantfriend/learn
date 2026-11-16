const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../scripts/serve.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const root=process.env.TEST_URL||`http://127.0.0.1:${server.address().port}/learn/study-guides/`;
  const sites=JSON.parse(fs.readFileSync('study-guides/qr/sites.json','utf8'));
  let images=0;
  for(const site of sites){
   await page.goto(root+site.slug+'/');
   await page.locator('.poster-image').first().waitFor();
   await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
   assert.equal(await page.locator('.poster-image').evaluateAll(imgs=>imgs.filter(i=>i.complete&&i.naturalWidth>=1024).length),5);
   assert.equal(await page.locator('.poster-gallery img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&i.naturalWidth>=384).length),5);
   images+=10;
   const buttons=page.locator('[data-enlarge]');
   for(let i=0;i<5;i++){
    await buttons.nth(i).click();
    await page.locator('dialog .poster-image').evaluate(i=>i.decode());
    await page.keyboard.press('Escape');
    images++;
   }
  }
  let interrupted=0;
  await page.route('**/assets/illustrated/gp8-perspectives.webp*',async route=>{if(new URL(route.request().url()).searchParams.has('retry'))return route.continue();interrupted++;await route.abort();});
  await page.goto(root+'8-global-perspectives/#poster-gp8-perspectives');
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('img')).length===10&&Array.from(document.querySelectorAll('img')).every(i=>i.complete&&i.naturalWidth>0));
  assert.ok(interrupted>0,'test must interrupt the original image request');
  assert.ok(await page.locator('#poster-gp8-perspectives img').getAttribute('src').then(s=>s.includes('retry=')));
  await page.unroute('**/assets/illustrated/gp8-perspectives.webp*');
  await page.locator('header select').selectOption('ru');
  await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  fs.mkdirSync('output/playwright/study-image-fix',{recursive:true});
  await page.goto(root+'8-global-perspectives/#poster-gp8-perspectives');
  await page.locator('#poster-gp8-perspectives img').evaluate(i=>i.decode());
  await page.locator('#poster-gp8-perspectives').screenshot({path:'output/playwright/study-image-fix/grade8-perspectives.png'});
  console.log(JSON.stringify({imagesDecoded:images,interruptedRequests:interrupted,automaticRecovery:true}));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
