import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';
import {workshops} from '../src/lessons/geography-workshops.js';
import {geographyTeaching} from '../src/lessons/geography-teaching.js';
import {geographyTwists} from '../src/lessons/geography-twists.js';
import {initialBoardState,evaluateBoard} from '../src/geography-board.js';
const geo=lessons.filter(l=>l.geoRedesign);
test('every Geography mission has authored instruction and every session has a board challenge',()=>{
 for(const [code,w]of Object.entries(workshops))w.missions.forEach((m,i)=>{
  const p=geographyTeaching[`${code}.${i}`];assert.ok(p,`${code}.${i}`);
  for(const k of ['objective','model','prompt','correct','wrong','explanation'])assert.ok(p[k]?.trim().length>=2,`${code}.${i}: ${k}`);
  assert.notEqual(p.correct,p.wrong);
  if(i>0){const twist=geographyTwists[`${code}.${i}`];assert.ok(twist,`${code}.${i} needs a changed case`);assert.notEqual(twist.prompt,p.prompt);assert.ok(twist.explanation);}
 });
 for(const l of geo){
  const frames=l.stages.flatMap(s=>s.frames);
  assert.ok(frames.some(f=>f.teachingModel),l.id);
  assert.ok(frames.some(f=>f.boardActivity),l.id);
  assert.ok(l.learningObjectives.length,l.id);
  assert.doesNotMatch(JSON.stringify(l),/Transfer the method, not the old result|Assume a plausible answer needs no evidence|Keep the previous answer without checking/);
 }
});
test('reviews as well as teaching sessions have distinct independent tasks within each class',()=>{
 for(const classId of ['7a','7b']){const seen=new Map();
  for(const l of geo.filter(l=>l.catalog.classes.includes(classId))){
   const key=JSON.stringify(l.stages.find(s=>s.id==='apply').frames.map(f=>[f.lines,f.sourceCard]));
   assert.ok(!seen.has(key),`${l.id} duplicates ${seen.get(key)}`);seen.set(key,l.id);
  }
 }
});
test('all six board mechanics distinguish incomplete, incorrect and feasible responses',()=>{
 const kinds=new Set();
 for(const l of geo)for(const f of l.stages.flatMap(s=>s.frames).filter(f=>f.boardActivity)){
  const a=f.boardActivity,s=initialBoardState(a);kinds.add(a.type);
  if(a.type==='sort'){assert.equal(evaluateBoard(a,s).complete,false);a.items.forEach(i=>s.placements[i.id]=i.answer);assert.equal(evaluateBoard(a,s).correct,true);s.placements[a.items[0].id]=(a.items[0].answer+1)%a.groups.length;}
  if(a.type==='sequence'){assert.equal(evaluateBoard(a,s).complete,false);s.order=a.items.map(i=>i.id);assert.equal(evaluateBoard(a,s).correct,true);s.order.reverse();}
  if(a.type==='decision'){assert.equal(evaluateBoard(a,s).complete,false);s.choice=a.question.answer;assert.equal(evaluateBoard(a,s).correct,true);s.choice=1-a.question.answer;}
  if(a.type==='pin'){assert.equal(evaluateBoard(a,s).complete,false);s.point=a.target.slice();assert.equal(evaluateBoard(a,s).correct,true);s.point[0]=(s.point[0]+1)%10;}
  if(a.type==='allocation'){s.values=a.minimum.slice();assert.equal(evaluateBoard(a,s).correct,true);s.values=[a.limit,20,20,20];}
  if(a.type==='budget'){s.picks=[0];assert.equal(evaluateBoard(a,s).correct,true);s.picks=a.costs.map((_,i)=>i);}
  assert.equal(evaluateBoard(a,s).correct,false,`${l.id} ${a.type}`);
  if(a.type==='decision'&&a.rounds?.length>1){s.round=1;s.choice=a.rounds[1].answer;assert.equal(evaluateBoard(a,s).correct,true);s.choice=1-a.rounds[1].answer;assert.equal(evaluateBoard(a,s).correct,false);}
 }
 assert.deepEqual([...kinds].sort(),['allocation','budget','decision','pin','sequence','sort']);
});
