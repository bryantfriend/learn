import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {lessons} from '../src/lessons.js';
const l=lessons.find(l=>l.id==='g7a-geo-w03-1');
test('The school exhibit and equipment topics are fully demonstrated without a written product',()=>{
 assert.ok(l.boardLecture);assert.deepEqual(l.bookSections,['1.1','1.2']);
 const apply=l.stages.find(s=>s.id==='apply').frames;
 assert.equal(apply.filter(f=>f.worksheetTask).length,2);assert.ok(apply.every(f=>f.mode==='listen'&&f.sourceCard&&f.teacherScript));
 assert.ok(!apply.some(f=>f.independentTask));
 const teach=l.stages.find(s=>s.id==='teach').frames;
 assert.ok(teach.some(f=>f.conceptId==='1.1-3'));assert.ok(teach.some(f=>f.conceptId==='1.2-2'));
 for(const f of l.stages.flatMap(s=>s.frames)){assert.ok(existsSync('assets/'+f.geoArt.image));assert.ok(f.teacherScript);}
});
test('School exhibit checks conceal explanations and allow short spoken answers',()=>{
 for(const f of l.stages.find(s=>s.id==='check').frames){assert.ok(f.type==='question'&&f.allowHideAnswer&&f.explanation);assert.ok(!f.lines.includes(f.explanation));}
 assert.ok(l.stages.find(s=>s.id==='finish').frames.every(f=>!f.homework&&f.mode==='listen'));
});
