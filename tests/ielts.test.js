import test from 'node:test';
import assert from 'node:assert/strict';
import { ieltsLessons } from '../src/lessons/ielts.js';
import { getLesson } from '../src/lessons.js';
import { lessonsFor, subjectsFor, sessionKey } from '../src/catalog.js';
import { createStorage, validateSession } from '../src/storage.js';
import { prepareTimer } from '../src/timer.js';

test('all 30 IELTS lessons are shared in order by 7A and 7B and excluded from Grade 8', () => {
  assert.equal(ieltsLessons.length, 30);
  assert.equal(new Set(ieltsLessons.map(l => l.id)).size, 30);
  assert.equal(new Set(ieltsLessons.map(l => l.title)).size, 30);
  for (const classId of ['7a', '7b']) {
    assert.ok(subjectsFor(classId).some(s => s.id === 'ielts'));
    assert.deepEqual(lessonsFor(classId, 'ielts').filter(l => l.ielts).map(l => l.id), ieltsLessons.map(l => l.id));
  }
  assert.ok(!subjectsFor('8').some(s => s.id === 'ielts'));
  assert.deepEqual(lessonsFor('8', 'ielts'), []);
  for (const l of ieltsLessons) assert.equal(getLesson(l.id), l);
});

test('every lesson has a coherent timed teaching route, distinct transfer material and concealed answers', () => {
  const materials = new Set();
  for (const l of ieltsLessons) {
    assert.equal(l.stages.reduce((n, s) => n + s.durationMinutes, 0), 45, l.id);
    assert.equal(l.durationMinutes, 45);
    assert.equal(l.stages.length, 6);
    for (const s of l.stages) {
      assert.equal(s.frames.reduce((n, f) => n + f.timerSeconds, 0), s.durationMinutes * 60, `${l.id}:${s.id}`);
      assert.match(s.notes, /Mixed-level support/);
      assert.ok(s.frames.every(f => f.lines.length && f.timerSeconds > 0));
    }
    const questions = l.stages.flatMap(s => s.frames).filter(f => f.type === 'question');
    assert.equal(questions.length, 2);
    for (const q of questions) {
      assert.ok(q.explanation.length > 50);
      assert.ok(q.answerText && q.sourceCard);
      assert.ok(!q.lines.includes(q.explanation));
    }
    const source = l.stages[2].frames[0].lines.join(' ');
    assert.ok(!materials.has(source), l.id);
    materials.add(source);
    assert.notEqual(l.stages[3].frames[1].lines[0], source);
    assert.equal(l.stages.at(-1).frames.at(-1).final, true);
  }
  for (const l of ieltsLessons.slice(5, 11)) assert.match(l.stages[1].notes, /script|Route 1/i, l.id);
});

test('IELTS checkpoints validate and retain separate class progress across reload', () => {
  const disk = new Map();
  const backing = { getItem: k => disk.get(k) || null, setItem: (k, v) => disk.set(k, v), removeItem: k => disk.delete(k) };
  const store = createStorage(() => backing); store.load();
  const lesson = ieltsLessons[5];
  const make = (classId, stage) => ({ schemaVersion: 3, lessonId: lesson.id, contentRevision: lesson.contentRevision,
    classId, classLabel: classId.toUpperCase(), subjectId: 'ielts', stage, steps: lesson.stages.map(() => 0),
    responses: {}, stars: 0, preferences: { starsVisible: false, timerVisible: false }, modeOverride: null,
    timer: prepareTimer(60), seenFrames: { '0:0': true }, attentionReturns: {}, discussedQuestions: [], startedAt: 1000, finishedAt: null });
  const a = make('7a', 2), b = make('7b', 3);
  assert.ok(validateSession(a)); assert.ok(validateSession(b));
  assert.notEqual(sessionKey(a), sessionKey(b));
  store.save(a); store.save(b);
  const loaded = createStorage(() => backing); loaded.load();
  assert.equal(loaded.find(a).stage, 2);
  assert.equal(loaded.find(b).stage, 3);
  loaded.clear(a);
  assert.equal(loaded.find(a), null);
  assert.equal(loaded.find(b).stage, 3);
});
