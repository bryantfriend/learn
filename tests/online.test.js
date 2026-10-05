import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { onlineLessons } from '../src/lessons/online.js';
import { lessonsFor, subjectsFor } from '../src/catalog.js';
import { getLesson } from '../src/lessons.js';

test('temporary Online collection exposes exactly the requested lessons by class', () => {
  assert.equal(onlineLessons.length, 4);
  for (const [classId, expected] of [['7a', 1], ['8', 1], ['7b', 2]]) {
    assert.ok(subjectsFor(classId).some(s => s.id === 'online'));
    const available = lessonsFor(classId, 'online');
    assert.equal(available.length, expected);
    assert.ok(available.every(l => l.online && l.catalog.classes.includes(classId)));
  }
  for (const lesson of onlineLessons) {
    assert.equal(getLesson(lesson.id), lesson);
    const classId = lesson.catalog.classes[0];
    for (const subject of ['geography', 'global-perspectives', 'global-perspectives-books']) {
      assert.ok(!lessonsFor(classId, subject).includes(lesson));
    }
  }
});

test('online scripts need no student responses and generated guide contains the full reading', () => {
  const guide = readFileSync(new URL('../docs/online-lessons.html', import.meta.url), 'utf8');
  for (const lesson of onlineLessons) {
    assert.equal(lesson.stages.reduce((sum, s) => sum + s.durationMinutes, 0), 30);
    assert.ok(guide.includes(`id="${lesson.id}"`));
    const words = lesson.stages.flatMap(s => s.frames.map(f => f.teacherScript)).join(' ').split(/\s+/).length;
    assert.ok(words > 1100, `${lesson.id}: substantial spoken content (${words} words)`);
    for (const stage of lesson.stages) for (const frame of stage.frames) {
      assert.equal(frame.mode, 'listen');
      assert.ok(!frame.type && !frame.discussionId && !frame.bookTask);
      assert.ok(frame.teacherScript.includes('Pause.'));
      const firstSentence = frame.teacherScript.split('.')[0];
      assert.ok(guide.includes(firstSentence), `${lesson.id}: guide agrees with player`);
    }
    assert.equal(lesson.stages.at(-1).frames.at(-1).final, true);
  }
});
