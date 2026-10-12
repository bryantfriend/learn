import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {lessons} from '../src/lessons.js';
import {workshops} from '../src/lessons/geography-workshops.js';
import {courseMethods,courseWordExamples} from '../src/lessons/geography-course-methods.js';
const geo=lessons.filter(l=>l.catalog?.subjectId==='geography');
test('The model covers every topic and all 86 teaching/review lessons without replacing authored investigations with voting',()=>{
 assert.deepEqual(Object.keys(courseMethods).sort(),Object.keys(workshops).sort());
 for(const code of Object.keys(courseMethods)){assert.equal(courseMethods[code].criteria.length,3);assert.equal(courseWordExamples[code].length,3);}
 const teaching=geo.filter(l=>!l.examId);assert.equal(teaching.length,86);
 for(const l of teaching){
  assert.ok(l.schoolExhibit||l.courseModelVersion===1,l.id);
  const practice=l.stages.find(s=>s.id==='apply').frames;
  assert.ok(practice.every(f=>!f.fingerPractice&&!f.choices&&f.sourceCard),l.id);
  if(!l.schoolExhibit){assert.equal(practice.filter(f=>f.independentTask).length,l.workshopMissions.length,l.id);assert.equal(practice.filter(f=>f.revisionTask).length,1,l.id);}
  for(const f of l.stages.flatMap(s=>s.frames)){assert.ok(!f.recallCue&&!f.responseHint,l.id);assert.ok(existsSync(new URL('../assets/'+f.geoArt.image,import.meta.url)));}
 }
});
test('New practice cases supply their own evidence and budget exactly ten minutes',()=>{
 for(const l of geo.filter(l=>!l.examId)){
  const practice=l.stages.find(s=>s.id==='apply');assert.equal(practice.frames.reduce((n,f)=>n+f.expectedSeconds,0),600,l.id);
  for(const f of practice.frames.filter(f=>f.independentTask)){assert.equal(f.geoDisplay.source,f.sourceCard,l.id);assert.ok(f.taskInstructions.length&&f.practiceProduct&&f.teacherScript.includes('Listen for:'));}
  for(const f of l.stages.find(s=>s.id==='check').frames){assert.ok(f.allowHideAnswer&&f.explanation&&!f.options&&!f.choices);assert.ok(!f.lines.includes(f.explanation));}
 }
 const runoff=geo.find(l=>l.id==='g7b-geo-w33-1').stages.find(s=>s.id==='apply').frames[0];
 assert.match(runoff.sourceCard,/rain is 30 units in both/);assert.match(runoff.sourceCard,/infiltration 18, runoff 12/);assert.match(runoff.sourceCard,/infiltration 6, runoff 24/);
 const visitor=geo.find(l=>l.id==='g7a-geo-w29-1').stages.find(s=>s.id==='apply').frames[0];assert.match(visitor.sourceCard,/school west, pond east, road south/);
});
test('All ten assessments remain independent and contain no content hints',()=>{
 const exams=geo.filter(l=>l.examId);assert.equal(exams.length,10);
 for(const l of exams){assert.deepEqual(l.stages.map(s=>s.id),['prepare','test','reflect','finish']);for(const f of l.stages.flatMap(s=>s.frames)){assert.equal(f.geoArt.image,'geography/assessment-paper.svg');assert.ok(!f.explanation&&!f.vocabularyCards&&!f.options);}}
});
