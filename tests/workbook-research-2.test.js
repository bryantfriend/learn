import test from 'node:test';
import assert from 'node:assert/strict';
import { workbookResearch2Lessons, breakSpacesText } from '../src/lessons/gp-workbook-research-2.js';
import { lessonsFor } from '../src/catalog.js';
import { getLesson } from '../src/lessons.js';

test('Book 7 Research Lesson 2 is available only for 7B in workbook order', () => {
  assert.equal(workbookResearch2Lessons.length, 3);
  const ids = workbookResearch2Lessons.map(l => l.id);
  assert.deepEqual(lessonsFor('7b', 'global-perspectives-books').filter(l => ids.includes(l.id)).map(l => l.id), ids);
  for (const classId of ['7a', '8']) assert.ok(lessonsFor(classId, 'global-perspectives-books').every(l => !ids.includes(l.id)));
  for (const l of workbookResearch2Lessons) {
    const rendered = getLesson(l.id);
    assert.ok(rendered);
    assert.equal(l.stages.reduce((n, s) => n + s.durationMinutes, 0), 40);
    assert.ok(l.stages.at(-1).frames.at(-1).final);
    for (const s of l.stages) {
      assert.equal(s.frames.reduce((n, f) => n + f.timerSeconds, 0), s.durationMinutes * 60);
      assert.ok(s.frames.every(f => f.timerSeconds > 0));
      for (const f of s.frames.filter(f => f.bookTask)) assert.ok([8, 9, 10, 11, 12].includes(f.bookTask.page));
    }
    const source = l.stages.flatMap(s => s.frames).filter(f => f.title.startsWith('Break spaces for everyone · paragraph'));
    assert.deepEqual(source.map(f => f.lines[0]), breakSpacesText);
  }
});

test('workbook sequence separates whole-text idea, paragraph notes and final summary', () => {
  const tasks = workbookResearch2Lessons.map(l => l.stages.flatMap(s => s.frames).filter(f => f.bookTask).map(f => f.bookTask.activity));
  assert.ok(tasks[0].includes('Main activity 1a–b · upper table'));
  assert.ok(tasks[1].includes('Main activity 2a–b · paragraph table'));
  assert.ok(tasks[2].includes('Main activity 3 · text summary'));
  assert.ok(tasks[2].includes('Peer feedback · questions 1–4'));
});
