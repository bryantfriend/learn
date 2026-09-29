const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {createServer}=require('../scripts/serve.cjs');const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();try{
 const base=`http://127.0.0.1:${server.address().port}/learn/`;const {lessons}=await import('../src/lessons.js');const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('output/playwright/worksheets',{recursive:true});
 // Unit tests cover every generated sheet; exercise representative browser layouts.
 for(const l of lessons.filter((l,i)=>i===0||['g7a-geo-w02-1','g7a-geo-w04-1','g7b-geo-w31-1','g8-gp-1.1','gp-books-7a-research-1-part-1'].includes(l.id)||l.examId==='7A-GEO-A0'||l.examId==='7A-GEO-Q1'))for(const kind of ['lesson','homework']){
  await page.goto(base+`worksheets/?lesson=${l.id}&kind=${kind}`);assert.ok(await page.locator('.task').count(),l.id);
  assert.equal(await page.locator('#print').isVisible(),true);assert.equal(await page.locator('.sheet').evaluateAll(nodes=>nodes.some(n=>n.scrollWidth>n.clientWidth)),false,l.id);
 }
 for(const [id,kind]of [['g7a-geo-w02-1','lesson'],['g7a-geo-w04-1','lesson'],['g7b-geo-w31-1','lesson'],['g8-gp-1.1','lesson'],['g8-gp-1.1','homework'],['gp-books-7a-research-1-part-1','homework']]){
  await page.goto(base+`worksheets/?lesson=${id}&kind=${kind}`);await page.screenshot({path:`output/playwright/worksheets/${id}-${kind}.png`,fullPage:true});
  const pdf=await page.pdf({path:`output/playwright/worksheets/${id}-${kind}.pdf`,format:'A4',preferCSSPageSize:true,printBackground:true});
  const count=(pdf.toString('latin1').match(/\/Type \/Page\b/g)||[]).length;assert.ok(count>=1&&count<=5,`${id}: ${count} pages`);console.log(id,kind,count+' printed pages');
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.print-toolbar').isVisible(),false);await page.emulateMedia({media:'screen'});
 }
 await page.goto(base);const a=n=>page.locator(`[data-action="${n}"]`).first().click();await a('choose-lesson');await page.locator('[data-id="7a"]').click();await page.locator('[data-id="geography"]').click();await page.locator('[data-lesson="g7a-geo-w02-1"]').click();await a('picker-start');await a('tools');
 const before=await page.evaluate(()=>localStorage.getItem('learn.session.v1'));const popupPromise=page.waitForEvent('popup');await page.getByRole('link',{name:'Print homework worksheet',exact:true}).click();const popup=await popupPromise;await popup.waitForSelector('.task');await popup.close();assert.equal(await page.evaluate(()=>localStorage.getItem('learn.session.v1')),before);
 await page.goto(base+'worksheets/?lesson=missing');assert.equal(await page.locator('#print').isVisible(),false);assert.match(await page.locator('#paper').innerText(),/Choose a lesson/);
 assert.deepEqual(errors,[]);console.log('PASS representative worksheet views and A4 prints, optional links and unchanged progress');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
