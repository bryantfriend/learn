import test from 'node:test';
import assert from 'node:assert/strict';
import { grade7ACourses } from '../src/plans/grade7a.js';
import { grade7Lessons } from '../src/lessons/grade7a.js';
import { grade7Exams } from '../src/lessons/g7-exams.js';
import { lessonsFor } from '../src/catalog.js';
import { validateSession } from '../src/storage.js';
import { prepareTimer } from '../src/timer.js';
test('7A pacing preserves every source row, with 33 Geography and 62 GP sessions',()=>{
 const [geo,gp]=grade7ACourses;
 assert.equal(geo.lessons.length,33);assert.equal(gp.lessons.length,62);
 assert.equal(geo.lessons.flatMap(l=>l.rows).length,63);assert.equal(gp.lessons.flatMap(l=>l.rows).length,93);
 for(const c of grade7ACourses){
  assert.equal(c.lessons.filter(l=>l.examCode).length,5);
  assert.equal(new Set(c.lessons.map(l=>l.id)).size,c.lessons.length);
  for(const w of c.weeks)assert.equal(c.lessons.filter(l=>l.week===w.index).length,w.rows.length?c.sessionsPerWeek:0);
  assert.ok(c.lessons.every(l=>l.rows.every(r=>r.code&&r.objective)));
 }
 const codes=new Set(gp.lessons.flatMap(l=>l.rows.map(r=>r.code)));
 for(const row of gp.longTerm)assert.ok(codes.has(row.code),row.code);
});
test('7A-only lessons have expanded playable content and valid checkpoints',()=>{
 assert.equal(grade7Lessons.length,95);
 for(const l of grade7Lessons){
  assert.equal(l.stages.reduce((s,x)=>s+x.durationMinutes,0),l.examId?40:50);
  assert.ok(l.stages.every(s=>s.notes&&s.frames.length));
  assert.ok(l.stages.at(-1).frames.at(-1).final);
  assert.ok(lessonsFor('7a',l.catalog.subjectId).includes(l));
  assert.ok(!lessonsFor('7b',l.catalog.subjectId).includes(l));
  assert.ok(!lessonsFor('8','global-perspectives').includes(l));
  const saved={schemaVersion:3,lessonId:l.id,classId:'7a',subjectId:l.catalog.subjectId,classLabel:'7A',stage:0,steps:l.stages.map(()=>0),responses:{},stars:0,preferences:{starsVisible:false,timerVisible:false},timer:prepareTimer(60),seenFrames:{'0:0':true},attentionReturns:{},discussedQuestions:[],startedAt:1000,finishedAt:null};
  assert.ok(validateSession(saved));
  assert.equal(validateSession({...saved,classId:'7b'}),null);
 }
});
test('ten 7A assessments contain twelve unique four-option questions and explained keys',()=>{
 assert.equal(Object.keys(grade7Exams).length,10);
 for(const e of Object.values(grade7Exams)){
  const qs=e.blocks.flatMap(b=>b.questions);
  assert.equal(qs.length,12);assert.equal(e.totalMarks,12);
  assert.equal(new Set(qs.map(q=>q.context+'|'+q.prompt)).size,12,e.id);
  for(const q of qs){assert.equal(new Set(q.options).size,4);assert.ok(q.explanation);assert.match(q.answer,/^[A-D]$/);}
  for(const a of 'ABCD')assert.equal(qs.filter(q=>q.answer===a).length,3);
 }
});
