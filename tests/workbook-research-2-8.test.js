import test from 'node:test';
import assert from 'node:assert/strict';
import { grade8Research2Lessons } from '../src/lessons/gp-workbook-research-2-8.js';
import { lessonsFor } from '../src/catalog.js';
import { getLesson } from '../src/lessons.js';
test('Grade 8 research sequence is available only to Grade 8 with usable pacing', () => {
 const ids = grade8Research2Lessons.map(l => l.id);
 assert.equal(ids.length, 3);
 assert.deepEqual(lessonsFor('8', 'global-perspectives-books').filter(l => ids.includes(l.id)).map(l => l.id), ids);
 for (const c of ['7a', '7b']) assert.ok(lessonsFor(c, 'global-perspectives-books').every(l => !ids.includes(l.id)));
 for (const l of grade8Research2Lessons) {
  assert.ok(getLesson(l.id));
  assert.equal(l.stages.reduce((n,s) => n+s.durationMinutes,0),40);
  assert.equal(l.bookNumber,9);
  assert.deepEqual(l.catalog.grades,[8]);
  assert.ok(l.stages.at(-1).frames.at(-1).final);
  for (const s of l.stages) {
   assert.equal(s.frames.reduce((n,f) => n+f.timerSeconds,0),s.durationMinutes*60);
   assert.ok(s.frames.every(f => f.timerSeconds>0));
   assert.ok(s.frames.filter(f=>f.bookTask).every(f=>[9,10,11,12].includes(f.bookTask.page)));
  }
 }
});
test('summary lesson follows the photographed single-feature and communication tasks',()=>{
 const frames=grade8Research2Lessons[2].stages.flatMap(s=>s.frames);
 assert.ok(frames.some(f=>f.bookTask?.page===12 && f.lines.some(l=>l.includes('Choose one feature'))));
 assert.ok(frames.some(f=>f.title.includes('communication')));
 assert.equal(frames.filter(f=>f.bookTask).at(-1).bookTask.page,9);
});
