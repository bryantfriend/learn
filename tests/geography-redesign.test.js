import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';
import {modelValues} from '../src/geography-lab.js';
import {validateSession} from '../src/storage.js';
import {prepareTimer} from '../src/timer.js';
const geo=lessons.filter(l=>l.geoRedesign);
test('all 86 Geography workshops are self-contained with exact core budgets and no repeated visual stage',()=>{
 assert.equal(geo.length,86);
 for(const l of geo){
  assert.equal(l.durationMinutes,40);
  assert.ok(l.stages.every(s=>s.frames.length&&s.notes));
  for(const s of l.stages){assert.equal(s.frames.reduce((n,f)=>n+f.expectedSeconds,0),s.durationMinutes*60,l.id);assert.ok(s.frames.every(f=>f.timerSeconds>0));}
  const simulations=l.stages.flatMap(s=>s.frames.filter(f=>f.simulation).map(f=>[s.id,f.simulation]));
  assert.ok(simulations.length||l.id==='g7b-geo-w02-1');assert.ok(simulations.every(([id])=>id==='model'));
  assert.equal(new Set(simulations.map(([,s])=>s.code)).size,simulations.length);
  const text=l.stages.flatMap(s=>s.frames.flatMap(f=>[...(f.lines||[]),typeof f.sourceCard==='string'?f.sourceCard:''])).join(' ');
  assert.doesNotMatch(text,/open section|use the book|in the book|textbook (map|key|diagram)|original weekly task/i,l.id);
  assert.ok(l.stages.find(s=>s.id==='apply').frames.every(f=>f.sourceCard||f.discussionId==='connection-builders'));
 }
});
test('the first 7A workshop explicitly models linking before independent linking',()=>{
 const l=geo.find(l=>l.id==='g7a-geo-w02-1'),frames=l.stages.flatMap(s=>s.frames);
 const model=frames.findIndex(f=>f.title==='What does “make a link” mean?');
 const independent=frames.findIndex(f=>f.title==='Connection builders');
 assert.ok(model>=0&&independent>model);assert.match(frames[model].lines.join(' '),/so people can reach/);
});
test('7A combined weeks retain their applied and independent missions',()=>{
 const kit=geo.find(l=>l.id==='g7a-geo-w04-1');
 assert.deepEqual(kit.workshopMissions.map(m=>m.index),[1,2]);
 assert.ok(kit.stages.find(s=>s.id==='apply').frames.some(f=>f.title.includes('Three equipment stations')));
 assert.equal(kit.stages.flatMap(s=>s.frames).filter(f=>f.simulation).length,1);
});
test('numerical models conserve water, convert scale and encode grid references',()=>{
 for(let rain=10;rain<=60;rain+=10)for(let rate=0;rate<=100;rate+=10){const v=modelValues('flood',rain,rate);assert.ok(Math.abs(v.infiltration+v.runoff-rain)<1e-8);}
 assert.equal(modelValues('scale',4,250).realMetres,1000);
 assert.equal(modelValues('grid',6,2).reference,'236452');
 assert.equal(modelValues('ice',4,7).balance,-3);
});
test('extra-time choices have concealed, valid answers and original context',()=>{
 for(const l of lessons.filter(l=>!l.examId)){
  assert.equal(l.extensions.length,4,l.id);
  for(const r of l.extensions[0].rounds){assert.equal(r.choices.length,2);assert.notEqual(r.choices[0],r.choices[1]);assert.ok([1,2].includes(r.answer));assert.ok(r.explanation);}
  for(const t of l.extensions)assert.ok(t.rounds.every(r=>r.followup&&r.explanation));
 }
});
test('old Geography checkpoints reset content while retaining class and preferences',()=>{
 const l=geo[0];const old={schemaVersion:3,lessonId:l.id,classId:l.catalog.classes[0],subjectId:'geography',classLabel:'Class',contentRevision:1,stage:2,steps:[0,0,0,0,0],responses:{},stars:2,preferences:{starsVisible:true,timerVisible:true},timer:prepareTimer(60),seenFrames:{},attentionReturns:{},discussedQuestions:[],startedAt:1000,finishedAt:null};
 const result=validateSession(old,2000);assert.ok(result);assert.equal(result.stage,0);assert.equal(result.stars,2);assert.equal(result.contentRevision,l.contentRevision);
});

test('Geography teaching sessions have distinct tasks, instruction and exit prompts within each class',()=>{
 for(const classId of ['7a','7b']){
  const seen=new Map();
  for(const l of geo.filter(l=>l.catalog.classes.includes(classId)&&!l.title.startsWith('Review and repair:'))){
   for(const stage of ['model','apply','finish']){
    const signature=stage+JSON.stringify(l.stages.find(s=>s.id===stage).frames.map(f=>[f.lines,f.geoDisplay?.demo?.steps]));
    assert.ok(!seen.has(signature),`${l.id} repeats ${stage} from ${seen.get(signature)}`);
    seen.set(signature,l.id);
   }
  }
 }
});
test('7B week 2 progresses from locating countries to constrained journey planning',()=>{
 const first=geo.find(l=>l.id==='g7b-geo-w02-1'),second=geo.find(l=>l.id==='g7b-geo-w02-2');
 assert.equal(second.title,'Plan an Irish Sea journey');
 assert.match(second.stages.find(s=>s.id==='teach').frames.flatMap(f=>f.geoDisplay?.demo?.steps||f.lines).join(' '),/constraint|waiting/i);
 assert.equal(second.stages.find(s=>s.id==='model').frames.find(f=>f.simulation).simulation.kind,'journey');
 const prompts=new Set(first.extensions[0].rounds.map(r=>r.prompt));
 assert.ok(second.extensions[0].rounds.every(r=>!prompts.has(r.prompt)));
 assert.ok(second.stages.find(s=>s.id==='check').frames.some(f=>/neither listed option/i.test(f.explanation)));
});
