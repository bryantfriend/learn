import test from 'node:test';
import assert from 'node:assert/strict';
import { grade8GPPlan } from '../src/plans/grade8-gp.js';
import { schoolCalendar } from '../src/plans/calendar.js';
import { planningWeeks, validPacing } from '../src/plans/pacing.js';
import { validateSession } from '../src/storage.js';
import { lesson } from '../src/lessons.js';
import { prepareTimer } from '../src/timer.js';
test('import preserves all 43 ordered source entries, six units, five assessments and two reviews',()=>{
 const p=grade8GPPlan;
 assert.equal(p.sessionsPerWeek,3);assert.equal(p.weekdays,null);
 assert.equal(p.entries.length,43);assert.equal(new Set(p.entries.map(e=>e.id)).size,43);
 assert.equal(p.entries.filter(e=>e.unit==='Assessment').length,5);
 assert.equal(p.entries.filter(e=>e.unit==='Review').length,2);
 assert.equal(new Set(p.entries.filter(e=>/^\d$/.test(e.unit)).map(e=>e.unit)).size,6);
 assert.deepEqual(p.entries.map(e=>e.sourceRow),Array.from({length:43},(_,i)=>i+13));
 assert.equal(p.entries[0].title,'Stage 8 skills baseline and learning targets');
 assert.equal(p.entries.at(-1).title,'Final applied skills assessment');
 assert.ok(p.entries.every(e=>e.objective&&e.objectives&&e.resources&&e.status==='playable'));
});
test('weekly pacing follows quarter boundaries and supplied dates without assigning weekdays',()=>{
 const all=schoolCalendar.quarters.flatMap(q=>planningWeeks(q.id));
 assert.equal(all[0].start,'2026-09-14');
 assert.equal(all.at(-1).start,'2027-05-31');
 assert.equal(new Set(all.map(w=>w.start)).size,all.length);
 for(const w of all)assert.ok(!schoolCalendar.breaks.some(b=>b.start<=w.start&&b.end>=w.end));
 assert.ok(all.find(w=>w.start==='2027-02-22').notes.some(n=>n.includes('Defenders')));
 assert.ok(all.find(w=>w.start==='2027-04-05').notes.some(n=>n.includes('Revolution')));
 assert.deepEqual(validPacing({'2026-09-14':2,'2026-09-21':1,'2026-09-28':0,bad:1,'2026-10-05':4}),{'2026-09-14':2,'2026-09-21':1,'2026-09-28':0});
});
test('retired Grade 8 Geography progress is recoverable but no longer assigned to that subject',()=>{
 const old={schemaVersion:3,classId:'8',subjectId:'geography',classLabel:'8th Grade',lessonId:lesson.id,stage:1,steps:lesson.stages.map(()=>0),responses:{},stars:2,preferences:{starsVisible:false,timerVisible:false},timer:prepareTimer(60),seenFrames:{'1:0':true},attentionReturns:{},discussedQuestions:[],startedAt:1000,finishedAt:null};
 const recovered=validateSession(old);
 assert.equal(recovered.classId,null);assert.equal(recovered.subjectId,null);
 assert.equal(recovered.stage,1);assert.equal(recovered.stars,2);
 assert.equal(recovered.classLabel,'8th Grade · Geography');
});
