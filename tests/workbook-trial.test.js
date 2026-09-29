import test from 'node:test';
import assert from 'node:assert/strict';
import { workbookTrialLessons, workbookSubjectId } from '../src/lessons/gp-workbook-trial.js';
import { lessonsFor } from '../src/catalog.js';
import { lessons } from '../src/lessons.js';
import { visualSpec } from '../src/visuals.js';

test('trial exposes two separate lessons per assigned class and preserves original catalogues', () => {
  assert.equal(workbookTrialLessons.length, 6);
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  for (const [classId, count] of [['7b',95], ['7a',64], ['8',45]]) {
    const trial = lessonsFor(classId, workbookSubjectId).filter(l => l.catalog);
    assert.equal(trial.length, 2);
    assert.ok(trial.every(l => l.bookTrial && l.catalog.classes.includes(classId)));
    assert.equal(lessonsFor(classId, 'global-perspectives').length, count);
    assert.ok(lessonsFor(classId, 'global-perspectives').every(l => !l.bookTrial));
  }
});

test('all trials have a timed 40-minute core, optional practice, page tasks and hidden models', () => {
  for (const l of workbookTrialLessons) {
    const optional = l.stages.filter(s => s.id.startsWith('reserve-'));
    assert.equal(optional.reduce((n,s) => n+s.durationMinutes,0),0);
    assert.equal(l.extensions.reduce((n,t) => n+t.minutes,0),20);
    assert.equal(l.stages.filter(s => !optional.includes(s)).reduce((n,s) => n+s.durationMinutes,0),40);
    assert.ok(l.stages.at(-1).frames.at(-1).final);
    const tasks = l.stages.flatMap(s => s.frames).filter(f => f.bookTask);
    assert.ok(tasks.length >= 3);
    assert.ok(tasks.every(f => f.bookTask.page >= 3 && f.bookTask.page <= 7 && f.footnote.includes('WRITE IN YOUR BOOK')));
    for (const s of l.stages) {
      assert.equal(s.frames.reduce((n,f) => n+f.timerSeconds,0),s.durationMinutes*60);
      for (const f of s.frames) {
        assert.equal(visualSpec(l,s,f),null);
        if(f.type === 'question') assert.ok(f.answerText && f.explanation);
      }
    }
  }
});
