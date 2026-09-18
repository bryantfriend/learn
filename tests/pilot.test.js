import test from 'node:test';
import assert from 'node:assert/strict';
import {getLesson,lessons} from '../src/lessons.js';
import {pilotLessons} from '../src/lessons/pilot.js';
import {visualSpec} from '../src/visuals.js';
import {validateSession} from '../src/storage.js';
import {prepareTimer} from '../src/timer.js';
test('pilot covers ten topics in fifteen scheduled lessons with explicit relevant openings',()=>{
 const selected=Object.keys(pilotLessons).map(getLesson);
 assert.equal(selected.length,15);assert.equal(new Set(selected.map(l=>l.pilotTopic)).size,10);
 for(const l of selected){
  assert.equal(l.stages.reduce((sum,s)=>sum+s.durationMinutes,0),50);
  const first=l.stages[0].frames[0],v=visualSpec(l,l.stages[0],first);
  assert.ok(v);assert.equal(v.intro,false);assert.equal(first.mode,'think');assert.ok(first.discussionId);
  const frames=l.stages.flatMap(s=>s.frames),ids=frames.map(f=>f.discussionId).filter(Boolean);
  assert.equal(new Set(ids).size,ids.length,l.id);
  for(const f of frames.filter(f=>f.options)){assert.equal(f.options.length,4);assert.equal(new Set(f.options.map(o=>o.label)).size,4);assert.ok(f.options.some(o=>o.id===f.answer));}
  for(const s of l.stages)for(const f of s.frames)if(f.type||f.final)assert.equal(visualSpec(l,s,f),null);
  const model=frames.findIndex(f=>f.learningRole==='model');
  if(model>=0)assert.ok(frames.slice(0,model).filter(f=>f.discussionId&&f.mode==='pair').length>=2,l.id+' model follows student attempts');
 }
 assert.equal(lessons.length,296);
});
test('every pilot migrates old checkpoints and preserves current reveals',()=>{
 for(const id of Object.keys(pilotLessons)){
  const l=getLesson(id),classId=l.catalog.classes?.[0]||'8';
  const old={schemaVersion:3,lessonId:id,contentRevision:2,classId,subjectId:l.catalog.subjectId,classLabel:classId,stage:3,steps:[0,0,0,0,0],responses:{'3:0':{selected:'A',revealed:true}},stars:4,preferences:{starsVisible:true,timerVisible:true},timer:prepareTimer(60),seenFrames:{'3:0':true},attentionReturns:{},discussedQuestions:['old-task'],startedAt:1000,finishedAt:null};
  const fresh=validateSession(old,2000);assert.ok(fresh,id);assert.equal(fresh.stage,0);assert.equal(fresh.stars,4);assert.deepEqual(fresh.responses,{});
  const si=l.stages.findIndex(s=>s.frames.some(f=>f.options)),fi=l.stages[si].frames.findIndex(f=>f.options);
  fresh.stage=si;fresh.steps[si]=fi;fresh.responses[si+':'+fi]={selected:l.stages[si].frames[fi].answer,revealed:true};
  assert.deepEqual(validateSession(fresh,2000),fresh,id);
 }
});
