import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';
import {visualSpec} from '../src/visuals.js';
test('all 269 curriculum teaching sessions have an opening visual without exposing quiz or exam answers',()=>{
 let count=0;
 for(const l of lessons){
  const all=l.stages.flatMap(s=>s.frames.map(f=>({s,f})));
  if(l.examId){for(const {s,f}of all)assert.equal(visualSpec(l,s,f),null);continue;}
  if(!l.gp)continue;
  const v=visualSpec(l,l.stages[0],l.stages[0].frames[0]);assert.ok(v,l.id);assert.ok(v.prompt);assert.equal(v.steps.length,4);count++;
  for(const {s,f}of all)if(f.type||f.final)assert.equal(visualSpec(l,s,f),null);
 }
 assert.equal(count,269);
});
test('visual charts and budgets retain the actual lesson quantities and context',()=>{
 const get=id=>{const l=lessons.find(l=>l.id===id);return visualSpec(l,l.stages[0],l.stages[0].frames[0]);};
 assert.deepEqual(get('g8-gp-3.2').chart.values,[180,160,120,150]);
 assert.deepEqual(get('g8-gp-5.4').chart.values,[40,30]);
 assert.match(get('g8-gp-5.4').chart.note,/40 of 50.*30 of 60/);
 assert.deepEqual(get('g8-gp-6.5').budget,{total:100,options:[['Shelter',40],['Crossing',90]]});
 assert.equal(get('g7b-geo-w35-1').budget.total,60);
});
