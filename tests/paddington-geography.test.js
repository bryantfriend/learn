import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {lessonsFor} from '../src/catalog.js';
test('Paddington special is first for both grade 7 classes in every quarter with accessible artwork',()=>{
 for(const group of ['7a','7b'])for(const quarter of ['Q1','Q2','Q3','Q4']){
  const l=lessonsFor(group,'geography').filter(l=>!l.catalog?.quarter||l.catalog.quarter===quarter)[0];
  assert.equal(l.id,'g7-geo-paddington-2');
  assert.equal(l.stages.reduce((n,s)=>n+s.durationMinutes,0),40);
  for(const f of l.stages.flatMap(s=>s.frames)){
   assert.ok(existsSync('assets/'+f.geoArt.image));assert.ok(f.geoArt.alt);
   if(f.type==='question'){assert.ok(f.answerText&&f.explanation&&f.allowHideAnswer);assert.ok(!f.lines.includes(f.explanation));}
  }
 }
 assert.ok(!lessonsFor('8','global-perspectives').some(l=>l.id==='g7-geo-paddington-2'));
});
