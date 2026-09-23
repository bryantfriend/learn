import test from 'node:test';
import assert from 'node:assert/strict';
import {getLesson} from '../src/lessons.js';
import {supportEnglish} from '../src/lessons/esl.js';

test('ESL language keeps assessment keys, quantities and teacher records intact',()=>{
 const source={id:'test',catalog:{title:'Identify sources'},stages:[{id:'check',title:'Check understanding',notes:'Identify original curriculum objectives.',frames:[{title:'Identify the source.',lines:['Compare 40 of 50 with 30 of 60.'],type:'question',answer:'B',options:[{id:'A',label:'An additional source.'},{id:'B',label:'More evidence.'}],explanation:'More evidence supports the claim.'}]}]};
 const lesson=supportEnglish(structuredClone(source)),frame=lesson.stages[0].frames[0];
 assert.equal(lesson.id,source.id);assert.deepEqual(lesson.catalog,source.catalog);
 assert.equal(lesson.stages[0].notes,source.stages[0].notes);
 assert.equal(frame.answer,'B');assert.deepEqual(frame.options.map(o=>o.id),['A','B']);
 assert.deepEqual(frame.lines,source.stages[0].frames[0].lines);
 assert.equal(frame.title,'Find the source.');
});

test('Grade 8 Lesson 3 uses a varied role challenge and independent transfer',()=>{
 const lesson=getLesson('g8-gp-1.2'),frames=lesson.stages.flatMap(s=>s.frames);
 assert.equal(lesson.catalog.order,3);assert.equal(lesson.durationMinutes,50);
 assert.ok(frames.some(f=>f.discussionId==='roles'));
 assert.ok(frames.some(f=>f.discussionId==='twist'));
 assert.ok(frames.some(f=>f.discussionId==='decision'));
 assert.ok(frames.some(f=>f.discussionId==='transfer'&&f.answerText));
 assert.ok(!frames.some(f=>f.discussionId?.startsWith('pacing-')));
 assert.equal(frames.filter(f=>f.type==='question').length,2);
 assert.ok(lesson.contentRevision>100);
});
