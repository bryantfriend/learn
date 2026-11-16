import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { lessonsFor } from '../src/catalog.js';
test('Grade 8 analysis sequence covers the photographed tasks and uses accessible visuals',()=>{
 const items=lessonsFor('8','global-perspectives-books').filter(l=>l.id.startsWith('gp-books-8-analysis-1-'));
 assert.equal(items.length,2);
 for(const l of items){assert.equal(l.catalog.quarter,'Q2');assert.equal(l.stages.reduce((n,s)=>n+s.durationMinutes,0),40);for(const f of l.stages.flatMap(s=>s.frames))if(f.illustration)assert.ok(existsSync('assets/'+f.illustration.image));}
 const frames=items.flatMap(l=>l.stages.flatMap(s=>s.frames));
 for(const page of [55,56,57,58,59])assert.ok(frames.some(f=>f.bookTask?.page===page));
 assert.ok(frames.some(f=>f.title.includes('research in pairs')));
 assert.ok(!lessonsFor('7a','global-perspectives-books').some(l=>items.some(x=>x.id===l.id)));
});
