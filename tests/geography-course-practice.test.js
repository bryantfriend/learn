import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';
import {conceptVocabulary} from '../src/lessons/geography-concept-vocabulary.js';
test('Classroom application consists of sourced teacher demonstrations and brief spoken checks',()=>{
 for(const l of lessons.filter(l=>l.geoRedesign)){
  const cases=l.stages.find(s=>s.id==='apply').frames;
  assert.ok(cases.every(f=>f.mode==='listen'&&f.sourceCard&&f.teacherScript&&!f.fingerPractice&&!f.independentTask),l.id);
  assert.ok(cases.some(f=>f.changedExample),l.id);
  for(const check of l.stages.find(s=>s.id==='check').frames)assert.ok(check.allowHideAnswer&&check.explanation&&!check.choices&&!check.options,l.id);
 }
});
test('Every vocabulary card supplies English meaning and Chinese/Russian support',()=>{
 for(const [code,words]of Object.entries(conceptVocabulary))for(const v of words)assert.ok(v.term&&v.meaning&&v.zh&&v.ru,`${code}: ${v.term}`);
});
