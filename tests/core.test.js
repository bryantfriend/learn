import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareTimer, startTimer, pauseTimer, addTime, resetTimer, recoverTimer, remainingTime } from '../src/timer.js';
import { createStorage, validateSession } from '../src/storage.js';
import { lesson } from '../src/lessons.js';

function validSession() {
    return {
        schemaVersion: 1, lessonId: lesson.id, stage: 0, classLabel: '',
        steps: lesson.stages.map(function() { return 0; }), responses: {}, stars: 0,
        preferences: { starsVisible: false, timerVisible: false }, modeOverride: null,
        timer: prepareTimer(60)
    };
}
test('lesson has eight complete stages totaling forty minutes and the six exact answer keys', function() {
    assert.equal(lesson.stages.length, 8);
    assert.equal(lesson.stages.reduce(function(sum, stage) { return sum + stage.durationMinutes; }, 0), 40);
    assert.deepEqual(lesson.stages[5].frames.map(function(frame) { return frame.answer; }), ['A','B','A','B','A','B']);
    for (const stage of lesson.stages) { assert.ok(stage.notes); assert.ok(stage.frames.length); }
});
test('deadline handles delayed callbacks and repeated start without drifting', function() {
    let timer = startTimer(prepareTimer(60), 1000);
    assert.equal(startTimer(timer, 2000), timer);
    assert.equal(remainingTime(timer, 36500), 24500);
    assert.equal(remainingTime(timer, 100000), 0);
    timer = pauseTimer(timer, 36500);
    assert.equal(timer.remainingMs, 24500);
    assert.equal(pauseTimer(timer, 50000).remainingMs, 24500);
    assert.equal(startTimer(timer, 50000).deadline, 74500);
});
test('add thirty seconds and reset are silent and never autostart', function() {
    const timer = prepareTimer(10);
    assert.equal(addTime(timer, 1000).remainingMs, 40000);
    const running = startTimer(timer, 1000);
    assert.equal(addTime(running, 6000).deadline, 41000);
    assert.deepEqual(resetTimer(running), timer);
});
test('recovery accounts for elapsed time and always pauses', function() {
    const timer = startTimer(prepareTimer(60), 1000);
    assert.equal(recoverTimer(timer, 31000).remainingMs, 30000);
    assert.equal(recoverTimer(timer, 100000).remainingMs, 0);
    assert.equal(recoverTimer(timer, 31000).running, false);
});
test('storage rejects unknown schema, lesson, steps, answers and impossible timers', function() {
    const s = validSession();
    assert.ok(validateSession(s));
    for (const change of [{ schemaVersion: 2 }, { lessonId: 'unknown' }, { stage: 99 }, { steps: [100] }, { stars: -1 }, { responses: { '5:0': { selected: 'C', revealed: false } } }, { timer: { remainingMs: -2 } }]) {
        assert.equal(validateSession({ ...s, ...change }), null);
    }
});
test('missing, corrupt and denied storage never crash the lesson', function() {
    assert.equal(createStorage(function() { return { getItem: function() { return null; } }; }).load().session, null);
    assert.match(createStorage(function() { return { getItem: function() { return '{bad'; } }; }).load().message, /unreadable/);
    const denied = createStorage(function() { throw new Error('Denied'); });
    assert.equal(denied.load().session, null);
    assert.equal(denied.save(validSession()), false);
    assert.equal(denied.clear(), false);
});
