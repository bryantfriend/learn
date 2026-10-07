import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {lessons} from '../src/lessons.js';
import {geographySections} from '../src/lessons/geography-concept-flow.js';
import {conceptVocabulary} from '../src/lessons/geography-concept-vocabulary.js';
import {workshops} from '../src/lessons/geography-workshops.js';
test('All Geography lessons have local art, and assessment conditions stay separate',()=>{
 const geo=lessons.filter(l=>l.catalog?.subjectId==='geography');assert.equal(geo.length,96);
 for(const l of geo){assert.ok(l.geoConcept,l.id);for(const f of l.stages.flatMap(s=>s.frames))assert.ok(existsSync(new URL('../assets/'+f.geoArt.image,import.meta.url)),l.id);
  if(l.examId){assert.deepEqual(l.stages.map(s=>s.id),['prepare','test','reflect','finish']);assert.ok(l.stages.flatMap(s=>s.frames).some(f=>f.printExam));assert.ok(!l.stages.some(s=>s.id==='vocabulary'));}
  else{assert.deepEqual(l.stages.map(s=>s.id),geographySections.map(s=>s[0]));assert.equal(l.stages.reduce((n,s)=>n+s.durationMinutes,0),40);}
 }
});
test('Every topic has vocabulary, success criteria, practice evidence and a concealed checkpoint',()=>{
 assert.deepEqual(Object.keys(conceptVocabulary).sort(),Object.keys(workshops).sort());
 for(const l of lessons.filter(l=>l.geoRedesign)){
  const stage=id=>l.stages.find(s=>s.id===id);
  assert.ok(stage('goal').frames.every(f=>f.successCriteria.length===3));
  assert.equal(stage('goal').frames.length,l.id==='g7b-geo-w01-2'?1:l.workshopMissions.length,l.id);
  assert.ok(stage('vocabulary').frames.every(f=>f.vocabularyCards.length===3&&f.vocabularyCards.every(v=>v.term&&v.meaning)));
  assert.ok(stage('apply').frames.every(f=>f.sourceCard&&f.teacherScript&&f.lines.length));
  const questions=stage('check').frames.filter(f=>f.options);
  {
   assert.equal(stage('check').frames.length,2);
   assert.equal(questions.length,0);
   for(const f of stage('check').frames){assert.equal(f.type,'question');assert.ok(f.answerText&&f.explanation&&f.teacherScript);assert.ok(!f.choices);assert.ok(!f.lines.includes(f.explanation));}
  }
  for(const f of questions){assert.equal(f.options.length,4);assert.equal(new Set(f.options.map(o=>o.label)).size,4);assert.ok(f.options.some(o=>o.id===f.answer));assert.ok(f.explanation&&!f.lines.includes(f.explanation));}
  assert.doesNotMatch(JSON.stringify(l),/undefined/);
 }
});
