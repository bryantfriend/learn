import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {lessons} from '../src/lessons.js';
const lesson=lessons.find(l=>l.id==='g7a-geo-w03-1');
const stage=id=>lesson.stages.find(s=>s.id===id);
test('School exhibit practice produces labels, an evidence plan and a revision within ten minutes',()=>{
 assert.equal(lesson.schoolExhibit,true);
 assert.deepEqual(stage('apply').frames.map(f=>f.discussionId),['exhibit-create-labels','exhibit-plan-evidence','exhibit-improve-labels','exhibit-share-label']);
 assert.deepEqual(stage('apply').frames.map(f=>f.expectedSeconds),[240,180,120,60]);
 assert.match(stage('apply').frames[0].lines.join(' '),/three.*features/i);
 assert.match(stage('apply').frames[1].lines.join(' '),/tool.*explain/i);
 assert.ok(stage('apply').frames.every(f=>!f.fingerPractice&&!f.choices&&f.sourceCard));
 for(const s of lesson.stages)assert.equal(s.frames.reduce((n,f)=>n+f.expectedSeconds,0),s.durationMinutes*60);
});
test('Checks use a different route and require independent explanation before revealing',()=>{
 const model=stage('model').frames.find(f=>f.title.startsWith('Worked route'));
 const check=stage('check').frames[1];
 assert.match(model.lines.join(' '),/70 m/);assert.equal(check.answerText,'Walk north for 40 m.');
 assert.match(check.explanation,/4 × 10 m = 40 m/);
 for(const f of stage('check').frames){assert.equal(f.type,'question');assert.ok(f.allowHideAnswer&&f.sourceCard);assert.ok(!f.choices&&!f.options);assert.ok(!f.lines.includes(f.explanation));assert.equal(f.expectedSeconds,150);}
 const svg=readFileSync(new URL('../assets/geography/school-exhibit-map.svg',import.meta.url),'utf8');
 assert.match(svg,/4 cm/);assert.match(svg,/3 cm/);assert.match(svg,/1 cm.*10 m/);
 assert.match(stage('finish').frames[0].lines.join(' '),/Independently/);
 assert.ok(stage('finish').frames.every(f=>!f.homework));
});
test('The whole exhibit lesson uses local pictures, meaningful vocabulary and specific teaching notes',()=>{
 for(const f of lesson.stages.flatMap(s=>s.frames)){
  assert.ok(existsSync(new URL('../assets/'+f.geoArt.image,import.meta.url)),f.title);
  assert.ok(f.teacherScript,f.title);assert.ok(!f.recallCue);
  assert.doesNotMatch(f.lines.join(' '),/Think quietly|Show 1 or 2 fingers|section 1\.|Peru/);
  for(const v of f.vocabularyCards||[]){assert.ok(v.term&&v.meaning&&v.zh&&v.ru&&v.image);assert.ok(existsSync(new URL('../assets/'+v.image,import.meta.url)));}
 }
 assert.match(stage('teach').notes,/observation.*claim/i);
 assert.match(stage('check').frames[0].teacherScript,/does not prove/);
});
