import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';
import {conceptVocabulary} from '../src/lessons/geography-concept-vocabulary.js';

test('Course practice has ten distinct binary questions, balanced answers and whole-lesson coverage',()=>{
 for(const l of lessons.filter(l=>l.geoRedesign)){
  const practice=l.stages.find(s=>s.id==='apply').frames;
  assert.equal(practice.length,10,l.id);
  assert.equal(new Set(practice.map(f=>f.title)).size,10,l.id);
  assert.equal(practice.filter(f=>f.answerText.startsWith('1 finger')).length,5,l.id);
  for(const f of practice){assert.ok(f.fingerPractice&&f.allowHideAnswer&&f.explanation,l.id);assert.equal(f.choices.length,2);assert.notEqual(f.choices[0].split(' · ')[1],f.choices[1].split(' · ')[1]);assert.ok(!f.options);assert.equal(f.expectedSeconds,60);}
  if(l.id!=='g7b-geo-w01-2')for(const code of new Set(l.bookSections))assert.ok(practice.some(f=>f.kicker.endsWith('· '+code)),`${l.id}: missing ${code}`);
  const checks=l.stages.find(s=>s.id==='check').frames;assert.equal(checks.length,2);
  for(const f of checks){assert.ok(f.answerText&&f.allowHideAnswer&&f.explanation&&!f.choices&&!f.options);assert.equal(f.expectedSeconds,150);}
 }
});
test('Every vocabulary card supplies English meaning and Chinese/Russian support',()=>{
 for(const [code,words]of Object.entries(conceptVocabulary))for(const v of words)assert.ok(v.term&&v.meaning&&v.zh&&v.ru,`${code}: ${v.term}`);
});
