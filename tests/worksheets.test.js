import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';
import {worksheetFor} from '../src/worksheets.js';
test('classroom activity lessons provide both optional student sheets without answer keys or mutations',()=>{
 for(const l of lessons.filter(l=>!l.online)){const before=JSON.stringify(l);for(const kind of ['lesson','homework']){
  const sheet=worksheetFor(l,kind,lessons);assert.equal(sheet.lessonId,l.id);assert.equal(sheet.kind,kind);assert.match(sheet.note,/Optional/i);
  assert.ok(sheet.pages.length&&sheet.pages.some(p=>p.sections.length),l.id);
  for(const page of sheet.pages)for(const item of page.sections){assert.ok(item.title&&item.lines.length&&item.space>=3,l.id);assert.equal(item.answer,undefined);assert.equal(item.explanation,undefined);}
  assert.ok(!JSON.stringify(sheet).includes('openingScript'));
 }assert.equal(JSON.stringify(l),before,l.id);}
});
test('Geography sheets retain each investigation source and offer different homework',()=>{
 for(const l of lessons.filter(l=>l.geoRedesign)){
  const sheet=worksheetFor(l,'lesson',lessons),tasks=l.stages.find(s=>s.id==='apply').frames.filter(f=>!f.boardRound);
  assert.equal(sheet.pages.length,tasks.length,l.id);
  tasks.forEach((f,i)=>{if(typeof f.sourceCard==='string')assert.ok(sheet.pages[i].sources.includes(f.sourceCard));});
  assert.notDeepEqual(sheet.pages,worksheetFor(l,'homework',lessons).pages);
 }
});
test('assessment sheets are revision and workbook homework is independently answerable',()=>{
 for(const l of lessons.filter(l=>l.examId)){const w=worksheetFor(l,'lesson',lessons);assert.match(w.note,/revision/);assert.ok(w.pages.length);}
 for(const l of lessons.filter(l=>l.bookTrial)){const w=worksheetFor(l,'homework',lessons);assert.equal(w.pages[0].sections.length,3);assert.ok(w.pages[0].sections.every(s=>s.lines.length===3));}
});
