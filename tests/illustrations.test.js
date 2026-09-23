import test from 'node:test';import assert from 'node:assert/strict';import {lessons} from '../src/lessons.js';import fs from 'node:fs';
test('Practice illustrations exist and the factory stock scenario uses textile artwork',()=>{
 const lesson=lessons.find(l=>l.id==='g8-gp-1.1');assert.equal(lesson.stages.find(s=>s.id==='practice-1').frames[0].illustration.image,'illustrations/factory.webp');
 for(const l of lessons)for(const s of l.stages)for(const f of s.frames){if(f.illustration){assert.ok(fs.existsSync('assets/'+f.illustration.image));assert.match(f.illustration.caption,/Read the source for the facts and numbers/);assert.ok(f.illustration.alt);assert.ok(!l.examId);}if(l.extensions&&s.id.startsWith('practice-')&&!f.type)assert.ok(f.illustration||f.lessonVisual||f.diagram||f.visual,l.id);}
});
