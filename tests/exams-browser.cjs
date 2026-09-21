const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createServer}=require('../scripts/serve.cjs');
const server=createServer();
let browser;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url=`http://127.0.0.1:${server.address().port}/learn/`;
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 let prints=0;await page.exposeFunction('recordPrint',()=>prints++);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 fs.mkdirSync('output/playwright/exams',{recursive:true});
 await page.goto(url);
 await page.getByRole('link',{name:'Exams',exact:true}).click();
 await page.locator('.exam-card').first().waitFor();
 assert.equal(await page.locator('.exam-card').count(),5);
 await page.screenshot({path:'output/playwright/exams/library.png',fullPage:true});
 for(const period of ['Baseline','Term 1','Term 2','Term 3','Term 4']){
  await page.goto(url+'exams/');
  await page.getByRole('link',{name:period,exact:true}).click();
  await page.locator('.exam-card').first().waitFor();
  assert.equal(await page.locator('.exam-card').count(),3);
  const grades=await page.locator('.exam-card').evaluateAll(nodes=>nodes.map(n=>n.href));
  for(const grade of grades){
   await page.goto(grade);
   await page.locator('.exam-card,.paper-sheet').first().waitFor();
   const papers=await page.locator('.exam-card').evaluateAll(nodes=>nodes.map(n=>n.href));
   for(const paper of papers.length?papers:[grade]){
    await page.goto(paper);
    await page.locator('.paper-sheet').first().waitFor();
    const id=new URL(page.url()).searchParams.get('id');
    assert.ok(await page.getByRole('button',{name:'Print / Save as PDF'}).isVisible());
    assert.equal(await page.locator('.key-answer').count(),0);
    if(period==='Baseline'){
     assert.equal(await page.locator('.question').count(),20);
     await page.emulateMedia({media:'print'});
     const layout=await page.evaluate(()=>{
      const sheet=document.querySelector('.paper-sheet').getBoundingClientRect();
      const footer=document.querySelector('footer').getBoundingClientRect();
      const qs=[...document.querySelectorAll('.question')].map(q=>q.getBoundingClientRect());
      return {height:sheet.height,maxBottom:Math.max(...qs.map(q=>q.bottom)),footerTop:footer.top,overflow:qs.some(q=>q.left<sheet.left||q.right>sheet.right)};
     });
     assert.ok(layout.height<=1123,id+' exceeds A4 height '+JSON.stringify(layout));
     assert.ok(layout.maxBottom<layout.footerTop,id+' overlaps footer');
     assert.equal(layout.overflow,false);
     const pdf=await page.pdf({path:`output/playwright/exams/${id}.pdf`,preferCSSPageSize:true});
     assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,1,id+' PDF must be one page');
     await page.screenshot({path:`output/playwright/exams/${id}.png`,fullPage:true});
     await page.emulateMedia({media:'screen'});
     await page.getByRole('link',{name:'Teacher answer key'}).click();
     await page.locator('.key-answer').first().waitFor();
     assert.equal(await page.locator('.key-answer').count(),20);
     const keyPdf=await page.pdf({path:`output/playwright/exams/${id}-key.pdf`,preferCSSPageSize:true});
     assert.equal((keyPdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,2,id+' key pages');
     await page.getByRole('link',{name:'Student paper',exact:true}).click();
     prints=0;
     await page.evaluate(()=>{window.print=()=>window.recordPrint();});
     await page.getByRole('button',{name:'Print / Save as PDF'}).click();
     await page.waitForFunction(()=>true);assert.equal(prints,1);
    }else assert.equal(await page.locator('.question').count(),id.startsWith('7')?12:16);
   }
  }
 }
 await page.setViewportSize({width:390,height:844});
 for(const path of ['exams/','exams/?period=A0','exams/?period=A0&grade=7A','exams/?id=7A-GP-A0']){
  await page.goto(url+path);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path+' mobile overflow');
 }
 assert.deepEqual(errors,[]);
 console.log('All 25 papers reachable; five 20-question baselines print on one A4 page; keys, print actions and mobile layouts pass.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
