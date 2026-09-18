import test from 'node:test';
import assert from 'node:assert/strict';
import {getLesson} from '../src/lessons.js';
import {validateSession} from '../src/storage.js';
import {prepareTimer} from '../src/timer.js';
const lesson=getLesson('g7b-gp-w01-2');
const saved={schemaVersion:3,lessonId:lesson.id,classId:'7b',subjectId:'global-perspectives',classLabel:'7B',stage:3,steps:[1,1,3,0,0],responses:{'3:0':{selected:'A',revealed:true}},stars:5,preferences:{starsVisible:true,timerVisible:true},timer:prepareTimer(60),seenFrames:{'3:0':true},attentionReturns:{},discussedQuestions:['guided','check'],startedAt:1000,finishedAt:null};
test('rewritten lesson discards outdated answers while preserving class and preferences',()=>{
 const migrated=validateSession(saved,2000);
 assert.ok(migrated);assert.equal(migrated.contentRevision,lesson.contentRevision);assert.equal(migrated.stage,0);
 assert.deepEqual(migrated.responses,{});assert.deepEqual(migrated.discussedQuestions,[]);
 assert.equal(migrated.classId,'7b');assert.equal(migrated.stars,5);assert.deepEqual(migrated.preferences,saved.preferences);
 const si=lesson.stages.findIndex(s=>s.frames.some(f=>f.type==='question')),fi=lesson.stages[si].frames.findIndex(f=>f.type==='question');
 const steps=lesson.stages.map(()=>0);steps[si]=fi;
 const current={...migrated,stage:si,steps,responses:{[si+':'+fi]:{selected:'A',revealed:true}}};
 assert.deepEqual(validateSession(current,2000),current);
 assert.equal(validateSession({...current,contentRevision:lesson.contentRevision+1},2000),null);
});
test('another lesson retains its existing checkpoint',()=>{
 const other={...saved,lessonId:'g7b-gp-w01-3',contentRevision:getLesson('g7b-gp-w01-3').contentRevision,discussedQuestions:[]};
 assert.equal(validateSession(other,2000).stage,3);assert.deepEqual(validateSession(other,2000).responses,other.responses);
});
