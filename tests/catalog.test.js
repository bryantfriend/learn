import test from 'node:test';
import assert from 'node:assert/strict';
import { classes, subjectsFor, lessonsFor } from '../src/catalog.js';
import { createStorage, validateSession, STORAGE_KEY, SESSIONS_KEY } from '../src/storage.js';
import { lesson } from '../src/lessons.js';
import { prepareTimer } from '../src/timer.js';
function session(classId = '7a', subjectId = 'geography') {
 return { schemaVersion:3, lessonId:lesson.id, classId, subjectId, classLabel:'7A', stage:0, steps:lesson.stages.map(()=>0),
 responses:{}, stars:0, preferences:{starsVisible:false,timerVisible:false}, modeOverride:null, timer:prepareTimer(60),
 seenFrames:{'0:0':true}, attentionReturns:{}, discussedQuestions:[], startedAt:1000, finishedAt:null };
}
function backing() { const values=new Map(); return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}; }
test('all five class/subject combinations expose starters; future lessons filter by grade and subject',()=>{
 assert.equal(classes.flatMap(c=>subjectsFor(c.id)).length,5);
 assert.deepEqual(subjectsFor('8').map(s=>s.id),['global-perspectives']);
 assert.deepEqual(lessonsFor('8','geography'),[]);
 for(const c of classes)for(const s of subjectsFor(c.id))assert.equal(lessonsFor(c.id,s.id).length,2);
 const source=[{id:'shared'}, {id:'geo7',catalog:{subjectId:'geography',grades:[7]}}, {id:'gp8',catalog:{subjectId:'global-perspectives',grades:[8]}}];
 assert.deepEqual(lessonsFor('7a','geography',source).map(x=>x.id),['shared','geo7']);
 assert.deepEqual(lessonsFor('7b','geography',source).map(x=>x.id),['shared','geo7']);
 assert.deepEqual(lessonsFor('8','global-perspectives',source).map(x=>x.id),['shared','gp8']);
 assert.equal(lessonsFor('missing','geography').length,0);
});
test('class, subject and lesson checkpoints survive reload and clearing only one slot',()=>{
 const disk=backing(), store=createStorage(()=>disk);
 for(const c of classes)for(const s of subjectsFor(c.id))store.save({...session(c.id,s.id),stars:c.grade+(s.id==='geography'?0:10)});
 const loaded=createStorage(()=>disk); loaded.load();
 for(const c of classes)for(const s of subjectsFor(c.id))assert.equal(loaded.find(session(c.id,s.id)).stars,c.grade+(s.id==='geography'?0:10));
 loaded.clear(session());
 assert.equal(loaded.find(session()),null);
 assert.equal(createStorage(()=>disk).find(session('7b')).stars,7);
 const copy=loaded.find(session('7b')); copy.stars=99;
 assert.equal(loaded.find(session('7b')).stars,7);
});
test('old progress migrates to unassigned without being attributed to a class',()=>{
 const disk=backing(), old={...session(),schemaVersion:2,stage:2,stars:3};
 delete old.classId;delete old.subjectId;
 disk.setItem(STORAGE_KEY,JSON.stringify(old));
 const store=createStorage(()=>disk);
 assert.equal(store.load().session.classId,null);
 store.save(session('7b'));
 const reloaded=createStorage(()=>disk);reloaded.load();
 assert.equal(reloaded.unassigned()[0].stars,3);
 assert.equal(reloaded.find(session()),null);
 assert.equal(reloaded.find(session('7b')).stars,0);
});
test('invalid class or subject rejected and damaged collection does not hide a valid active checkpoint',()=>{
 assert.equal(validateSession({...session(),classId:'9a'}),null);
 assert.equal(validateSession({...session(),subjectId:null}),null);
 const disk=backing();disk.setItem(SESSIONS_KEY,'broken');disk.setItem(STORAGE_KEY,JSON.stringify(session()));
 assert.equal(createStorage(()=>disk).load().session.classId,'7a');
});
test('denied storage still retains separate checkpoints in memory',()=>{
 const store=createStorage(()=>{throw Error('Denied')});store.load();
 assert.equal(store.save({...session(),stars:4}),false);
 store.save(session('7b'));
 assert.equal(store.find(session()).stars,4);
 store.clear(session('7b'));
 assert.equal(store.find(session()).stars,4);
});
