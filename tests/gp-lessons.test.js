import test from 'node:test';
import assert from 'node:assert/strict';
import { gpLessons } from '../src/lessons/grade8-gp.js';
import { gpContent } from '../src/lessons/gp-content.js';
import { gpExams } from '../src/lessons/gp-exams.js';
import { grade8GPPlan } from '../src/plans/grade8-gp.js';
import { validateSession } from '../src/storage.js';
import { prepareTimer } from '../src/timer.js';
test('all 43 plan entries have complete playable lessons with stable IDs and correct availability',()=>{
 assert.equal(gpLessons.length,43);assert.equal(Object.keys(gpContent).length,38);
 assert.deepEqual(gpLessons.map(l=>l.id),grade8GPPlan.entries.map(e=>e.id));
 for(const l of gpLessons){
  assert.deepEqual(l.catalog.grades,[8]);assert.equal(l.catalog.subjectId,'global-perspectives');
  assert.equal(l.stages.reduce((a,s)=>a+s.durationMinutes,0),l.examId?40:50);
  assert.ok(l.stages.every(s=>s.notes&&s.frames.length));
  assert.ok(l.stages.at(-1).frames.at(-1).final);
  if(!l.examId){
   const frames=l.stages.flatMap(s=>s.frames);
   assert.ok(frames.some(f=>f.footnote?.includes('Fictional')));
   assert.equal(frames.filter(f=>f.type==='question').length,2);
   const q=frames.find(f=>f.options);assert.equal(q.options.length,4);assert.ok(q.options.some(o=>o.id===q.answer));
  }
  const value={schemaVersion:3,lessonId:l.id,classId:'8',subjectId:'global-perspectives',classLabel:'8th Grade',stage:0,steps:l.stages.map(()=>0),responses:{},stars:0,preferences:{starsVisible:false,timerVisible:false},timer:prepareTimer(60),seenFrames:{'0:0':true},attentionReturns:{},discussedQuestions:[],startedAt:1000,finishedAt:null};
  assert.ok(validateSession(value),l.id+' can save and recover');
 }
});
test('five printable exams each have 16 four-option items and separate rationales',()=>{
 assert.deepEqual(Object.keys(gpExams),['A0','Q1','Q2','Q3','Q4']);
 for(const exam of Object.values(gpExams)){
  const qs=exam.blocks.flatMap(b=>b.questions);
  assert.equal(qs.length,16);assert.equal(exam.totalMarks,16);
  assert.deepEqual(qs.map(q=>q.number),Array.from({length:16},(_,i)=>i+1));
  for(const q of qs){assert.equal(new Set(q.options).size,4);assert.match(q.answer,/^[A-D]$/);assert.ok(q.explanation);}
  for(const letter of 'ABCD')assert.equal(qs.filter(q=>q.answer===letter).length,4);
 }
});
