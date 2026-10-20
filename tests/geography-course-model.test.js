import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';
import {courseMethods,courseWordExamples} from '../src/lessons/geography-course-methods.js';
import {workshops} from '../src/lessons/geography-workshops.js';
const geo=lessons.filter(l=>l.catalog?.subjectId==='geography');
test('The course model teaches all 42 topics through board-led explanations',()=>{
 assert.deepEqual(Object.keys(courseMethods).sort(),Object.keys(workshops).sort());
 for(const code of Object.keys(courseMethods)){assert.equal(courseMethods[code].criteria.length,3);assert.equal(courseWordExamples[code].length,3);}
 const teaching=geo.filter(l=>!l.examId);assert.equal(teaching.length,86);
 for(const l of teaching){assert.ok(l.boardLecture&&l.courseModelVersion===2,l.id);const cases=l.stages.find(s=>s.id==='apply').frames;assert.ok(cases.every(f=>f.teacherDemonstration&&f.sourceCard&&!f.independentTask));}
});
test('Runoff and visitor cases retain their corrected evidence',()=>{
 const runoff=geo.find(l=>l.id==='g7b-geo-w33-1').stages.find(s=>s.id==='apply').frames.find(f=>f.worksheetTask);
 assert.match(runoff.sourceCard,/rain is 30 units in both/);assert.match(runoff.sourceCard,/infiltration 18, runoff 12/);assert.match(runoff.sourceCard,/infiltration 6, runoff 24/);
 const visitor=geo.find(l=>l.id==='g7a-geo-w29-1').stages.find(s=>s.id==='apply').frames.find(f=>f.worksheetTask);assert.match(visitor.sourceCard,/school west, pond east, road south/);
});
test('All ten assessments retain independent conditions without teaching hints',()=>{
 const exams=geo.filter(l=>l.examId);assert.equal(exams.length,10);
 for(const l of exams){assert.deepEqual(l.stages.map(s=>s.id),['prepare','test','reflect','finish']);assert.ok(!l.boardLecture);for(const f of l.stages.flatMap(s=>s.frames)){assert.equal(f.geoArt.image,'geography/assessment-paper.svg');assert.ok(!f.explanation&&!f.vocabularyCards&&!f.options);}}
});
