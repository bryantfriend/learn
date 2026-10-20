import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';
import {worksheetFor} from '../src/worksheets.js';
import {existsSync} from 'node:fs';
test('Boundary Detective is a complete board-led lesson with optional matching worksheet',()=>{
 const l=lessons.find(l=>l.id==='g7b-geo-w03-2');assert.ok(l.boundaryDetective);
 assert.equal(l.stages.reduce((n,s)=>n+s.durationMinutes,0),40);
 const frames=l.stages.flatMap(s=>s.frames);assert.ok(frames.length>=14);
 for(const f of frames){assert.ok(f.teacherScript.length>100);assert.ok(existsSync('assets/'+f.geoArt.image));assert.ok(!f.homework);assert.notEqual(f.mode,'pair');}
 const sheet=worksheetFor(l,'lesson',lessons);assert.equal(sheet.pages.length,1);assert.equal(sheet.pages[0].sections.length,3);
 assert.ok(frames.filter(f=>f.type==='question').every(f=>f.explanation&&f.answerText));
});
