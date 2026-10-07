import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';
import {geographyConcepts} from '../src/lessons/geography-lecture.js';
import {workshops} from '../src/lessons/geography-workshops.js';
import {journeyFeasible,journeyRoutes} from '../src/journey-visual.js';
test('Every Geography section has subject explanations, visual slide text and an answered oral check',()=>{
 assert.deepEqual(Object.keys(geographyConcepts).sort(),Object.keys(workshops).sort());
 for(const [code,cards]of Object.entries(geographyConcepts)){
  assert.ok(cards.length>=4,code);assert.equal(new Set(cards.map(c=>c.title)).size,cards.length,code);
  for(const c of cards){assert.equal(c.lines.length,2);assert.ok(c.script&&c.question&&c.answer,code);assert.ok(!c.script.includes('undefined'));}
 }
});
test('All 86 teaching/review lessons preserve explanations in the eight-section timetable',()=>{
 const geo=lessons.filter(l=>l.geoRedesign);assert.equal(geo.length,86);
 for(const l of geo){
  assert.equal(l.teacherLed,true,l.id);assert.ok(l.contentRevision>=8000,l.id);
  assert.deepEqual(l.stages.map(s=>s.durationMinutes),[4,2,3,8,5,10,5,3],l.id);
  const frames=l.stages.flatMap(s=>s.frames);
  assert.ok(frames.filter(f=>!f.final).every(f=>f.teacherScript&&(f.geoDisplay||f.geoArt)),l.id);
  assert.ok(l.stages.find(s=>s.id==='check').frames.every(f=>/expla|source/i.test(f.responseHint)||f.lines.some(line=>/explain/i.test(line))),l.id);
  assert.ok(l.stages.find(s=>s.id==='teach').frames.some(f=>f.teachingConcept),l.id);
  if(!l.geographyReview)for(const code of new Set(l.bookSections)){
   assert.equal(new Set(frames.filter(f=>f.conceptId?.startsWith(code+'-')).map(f=>f.conceptId)).size,geographyConcepts[code].length,l.id);
  }
  const instructions=frames.flatMap(f=>f.lines||[]).join(' ');
  assert.match(instructions,/independently/i,l.id);
  assert.ok(l.stages.find(s=>s.id==='apply').frames.some(f=>['think','pair'].includes(f.mode)),l.id);
 }
});
test('Journey lesson teaches geography before arithmetic and actually includes its four authored explanations',()=>{
 const l=lessons.find(l=>l.id==='g7b-geo-w02-2'),teach=l.stages.find(s=>s.id==='teach').frames;
 assert.deepEqual(teach.slice(0,4).map(f=>f.conceptId),['3.1-0','3.1-1','3.1-2','3.1-3']);
 for(const script of workshops['3.1'].missions[1].teaching)assert.ok(teach.some(f=>f.teacherScript===script));
 assert.ok(l.stages.find(s=>s.id==='model').frames.find(f=>f.teachingModel).geoDisplay.journey.view==='worked');
 assert.match(l.stages.find(s=>s.id==='finish').frames[0].teacherScript,/5 hours/);
 assert.equal(journeyFeasible(journeyRoutes[0],45,false),true);
 assert.equal(journeyFeasible(journeyRoutes[0],45,true),false);
 assert.equal(journeyFeasible(journeyRoutes[1],45,true),false);
 assert.equal(journeyFeasible(journeyRoutes[1],60,true),true);
});
