import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonsFor } from '../src/catalog.js';
import { existsSync } from 'node:fs';
test('7A analysis lessons support the photographed pages in quarter 2',()=>{
 const items=lessonsFor('7a','global-perspectives-books').filter(l=>l.id.startsWith('gp-books-7a-analysis-1-'));
 assert.equal(items.length,2);
 for(const l of items){assert.equal(l.catalog.quarter,'Q2');assert.equal(l.stages.reduce((n,s)=>n+s.durationMinutes,0),40);for(const f of l.stages.flatMap(s=>s.frames)){if(f.illustration)assert.ok(existsSync('assets/'+f.illustration.image));}}
 const frames=items.flatMap(l=>l.stages.flatMap(s=>s.frames));
 for(const page of [52,53,54,55])assert.ok(frames.some(f=>f.bookTask?.page===page));
 assert.ok(frames.some(f=>f.title.includes('listening table')));
 assert.ok(!lessonsFor('7b','global-perspectives-books').some(l=>items.some(x=>x.id===l.id)));
});
