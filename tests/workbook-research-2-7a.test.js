import test from 'node:test';
import assert from 'node:assert/strict';
import { sevenAResearch2Lessons, lunchResearchText } from '../src/lessons/gp-workbook-research-2-7a.js';
import { lessonsFor } from '../src/catalog.js';
import { getLesson } from '../src/lessons.js';
test('7A Book 8 research sequence keeps its source and exact class budgets', () => {
  const ids = sevenAResearch2Lessons.map(l => l.id);
  assert.equal(ids.length, 3);
  assert.deepEqual(lessonsFor('7a', 'global-perspectives-books').filter(l => ids.includes(l.id)).map(l => l.id), ids);
  for (const c of ['7b', '8']) assert.ok(lessonsFor(c, 'global-perspectives-books').every(l => !ids.includes(l.id)));
  for (const l of sevenAResearch2Lessons) {
    assert.ok(getLesson(l.id));
    assert.equal(l.bookNumber, 8);
    assert.equal(l.stages.reduce((n, s) => n + s.durationMinutes, 0), 40);
    assert.ok(l.stages.at(-1).frames.at(-1).final);
    for (const s of l.stages) {
      assert.equal(s.frames.reduce((n, f) => n + f.timerSeconds, 0), s.durationMinutes * 60);
      assert.ok(s.frames.every(f => f.timerSeconds > 0));
      assert.ok(s.frames.filter(f => f.bookTask).every(f => [8, 9, 10, 11, 12].includes(f.bookTask.page)));
    }
  }
  for (const l of sevenAResearch2Lessons.slice(1)) assert.deepEqual(l.stages.flatMap(s => s.frames).filter(f => f.title.startsWith('Teacher text ·')).map(f => f.lines[0]), lunchResearchText);
});
test('7A follows the photographed paragraph-summary and evaluation tasks', () => {
  const tasks = sevenAResearch2Lessons.map(l => l.stages.flatMap(s => s.frames).filter(f => f.bookTask));
  assert.ok(tasks[0].some(f => f.title === 'Class discussion 2' && f.lines.join(' ').includes('top three')));
  assert.ok(tasks[1].some(f => f.title === 'Peer feedback 1d–e'));
  assert.ok(tasks[2].some(f => f.bookTask.page === 12 && f.title.includes('paragraphs 2–3') && f.lines.join(' ').includes('two sentences')));
  assert.ok(tasks[2].some(f => f.title.includes('choice and reason')));
  assert.ok(tasks[2].some(f => f.title.includes('evaluation skills')));
  assert.equal(tasks[2].at(-1).bookTask.page, 8);
});
