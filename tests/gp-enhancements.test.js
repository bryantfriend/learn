import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';
import {sampleRate} from '../src/gp-lab.js';
import {gpLabMethods} from '../src/lessons/gp-enhancements.js';
test('Every GP session has a guide; teaching models stay within existing stages',()=>{
 const gp=lessons.filter(l=>['global-perspectives','global-perspectives-books'].includes(l.catalog?.subjectId));assert.equal(gp.length,207);
 for(const l of gp){assert.ok(l.teacherGuide,l.id);assert.equal(l.teacherGuide.stages.length,l.stages.length);
  if(l.examId){assert.ok(!l.gpLab);continue;}
  assert.ok(gpLabMethods[l.gpLab.kind]);assert.ok(l.gpLab.sources.length,l.id);assert.ok(l.gpLab.task.length,l.id);
  assert.equal(l.stages.flatMap(s=>s.frames).filter(f=>f.gpLab).length,1,l.id);
  assert.ok(l.teacherGuide.simulation.minutes<=4);assert.ok(l.teacherGuide.support);assert.ok(l.teacherGuide.misconception);
 }
 assert.equal(new Set(gp.filter(l=>l.gpLab).map(l=>l.gpLab.kind)).size,10);
});
test('Sampling illustrates composition effects and handles an empty sample',()=>{
 assert.equal(sampleRate(0,0),null);assert.equal(sampleRate(10,10),50);assert.equal(sampleRate(50,0),80);assert.equal(sampleRate(0,50),20);assert.equal(sampleRate(40,10),68);
});
