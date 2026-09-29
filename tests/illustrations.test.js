import test from 'node:test';import assert from 'node:assert/strict';import {lessons} from '../src/lessons.js';import fs from 'node:fs';
test('Practice illustrations exist and the factory stock scenario uses textile artwork',()=>{
 assert.ok(lessons.every(l=>l.stages.every(s=>!s.id.startsWith('practice-'))));
 for(const l of lessons)for(const s of l.stages)for(const f of s.frames){if(f.illustration){assert.ok(fs.existsSync('assets/'+f.illustration.image));assert.match(f.illustration.caption,/Read the source for the facts and numbers/);assert.ok(f.illustration.alt);assert.ok(!l.examId);}if(l.extensions&&s.id.startsWith('practice-')&&!f.type)assert.ok(f.illustration||f.lessonVisual||f.diagram||f.visual,l.id);}
});
