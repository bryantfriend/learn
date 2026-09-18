import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,getLesson} from '../src/lessons.js';
import {validateSession} from '../src/storage.js';
import {prepareTimer} from '../src/timer.js';
test('every curriculum teaching lesson has ten minutes of source-based practice included in normal navigation',()=>{
 const teaching=lessons.filter(l=>l.gp&&!l.examId);assert.equal(teaching.length,269);
 for(const l of teaching){assert.equal(l.stages.reduce((n,s)=>n+s.durationMinutes,0),50,l.id);assert.equal(l.durationMinutes,50,l.id);assert.deepEqual(l.stages.slice(-3,-1).map(s=>s.id),['practice-1','practice-2'],l.id);assert.ok(l.stages.at(-1).frames.some(f=>f.final),l.id);assert.equal(l.extensions.reduce((n,t)=>n+t.minutes,0),10,l.id);for(const t of l.extensions){assert.ok(t.source.length&&t.lines.length===3&&t.outcome,l.id);}}
 for(const l of lessons.filter(l=>l.examId))assert.equal(l.extensions,undefined);
});
test('standard lessons have complete activity budgets and old checkpoints cannot skip added work',()=>{
 for(const l of lessons.filter(l=>l.extensions&&!l.customVisuals)){
  assert.equal(l.stages[0].durationMinutes,2,l.id);
  for(const s of l.stages){assert.equal(s.frames.reduce((n,f)=>n+f.expectedSeconds,0),s.durationMinutes*60,l.id+s.id);assert.ok(s.frames.every(f=>f.timerSeconds>0));}
  const old={schemaVersion:3,lessonId:l.id,classId:l.catalog.classes?.[0]||'8',subjectId:l.catalog.subjectId,classLabel:'Class',stage:2,steps:l.stages.map(()=>0),responses:{},stars:0,preferences:{starsVisible:false,timerVisible:true},timer:prepareTimer(60),seenFrames:{},attentionReturns:{},discussedQuestions:[],startedAt:1000,finishedAt:null};
  const current=validateSession(old,2000);assert.equal(current.stage,0,l.id);assert.equal(current.contentRevision,l.contentRevision);
 }
 const l=getLesson('g8-gp-1.1');assert.deepEqual(l.stages[1].frames.map(f=>f.timerSeconds),[30,30,180,240]);assert.equal(l.stages.find(s=>s.id==='apply').frames.length,4);
});
