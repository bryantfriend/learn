import test from 'node:test';
import assert from 'node:assert/strict';
import { lesson, lessons, getLesson, questionOptions } from '../src/lessons.js';
import { practiceLesson } from '../src/lessons/system-practice.js';
import { validateSession, SCHEMA } from '../src/storage.js';
import { summarizeSession, responseKeyFor, frameKey } from '../src/progress.js';
import { prepareTimer } from '../src/timer.js';
function sessionFor(selected = practiceLesson) {
    return {
        schemaVersion: SCHEMA, lessonId: selected.id, stage: 0, steps: selected.stages.map(function() { return 0; }),
        classId: null, subjectId: null, classLabel: '', responses: {}, stars: 0, modeOverride: null,
        preferences: { starsVisible: false, timerVisible: false }, timer: prepareTimer(30),
        seenFrames: { '0:0': true }, attentionReturns: {}, discussedQuestions: [], startedAt: 1000, finishedAt: null
    };
}
test('both complete lessons are registered and practice has nine stages totaling forty minutes', function() {
    assert.equal(lessons.length, 2);
    assert.equal(getLesson(lesson.id), lesson);
    assert.equal(getLesson('system-practice-01'), practiceLesson);
    assert.equal(getLesson('missing'), null);
    assert.equal(practiceLesson.stages.length, 9);
    assert.equal(practiceLesson.stages.reduce(function(sum, stage) { return sum + stage.durationMinutes; }, 0), 40);
    for (const stage of practiceLesson.stages) {
        assert.ok(stage.notes && stage.script);
        for (const frame of stage.frames) assert.ok([0,2,3].includes(frame.voiceLevel));
    }
});
test('practice contains all required sequence, memory, preference and quiz content', function() {
    assert.equal(practiceLesson.stages[2].frames.length, 9);
    assert.ok(practiceLesson.stages[2].frames.every(function(frame) { return frame.type === 'opinion' && !frame.answer; }));
    const sequence = practiceLesson.stages[3].frames;
    assert.equal(sequence.length, 12);
    assert.deepEqual(sequence.slice(7,11).map(function(frame) { return frame.title; }), ['Touch your shoulder.', 'Point to the ceiling.', 'Fold your arms.', 'Show a thumbs up.']);
    assert.equal(sequence[11].answer, 'D');
    const memory = practiceLesson.stages[5].frames;
    assert.deepEqual(memory[0].items.map(function(item) { return item.symbol; }), ['🌍','✏️','🐘','🚲','🍕','🌳','🎒','⭐','📚']);
    assert.deepEqual(memory[3].items, memory[0].items);
    assert.equal(memory[0].timerSeconds, 12);
    assert.equal(memory[1].items, undefined);
    assert.equal(memory[2].voiceLevel, 2);
    assert.deepEqual(practiceLesson.stages[6].frames.map(function(frame) { return frame.answer; }), ['A','A','A','A','B','B']);
    assert.ok(practiceLesson.stages[4].frames.every(function(frame) { return frame.suggested && frame.followUp; }));
});
test('recovery validates responses against the selected lesson and supports numeric and open questions', function() {
    const session = sessionFor();
    session.responses = { '3:11': { selected: 'D', revealed: true }, '4:0': { selected: '3', revealed: true }, '8:0': { selected: null, revealed: true } };
    session.attentionReturns = { '1:1': true };
    session.discussedQuestions = ['sequence','odd-0'];
    assert.deepEqual(validateSession(session, 2000).responses, session.responses);
    assert.equal(validateSession({ ...session, responses: { '4:0': { selected: 'D', revealed: true } } },2000), null);
    assert.equal(validateSession({ ...session, responses: { '2:0': { selected: 'A', revealed: true } } },2000), null);
    assert.equal(validateSession({ ...session, discussedQuestions: ['fake'] },2000), null);
    assert.equal(validateSession({ ...session, attentionReturns: { '4:0': true } },2000), null);
    assert.deepEqual(questionOptions(practiceLesson.stages[8].frames[0]), []);
});
test('old eight-stage sessions migrate without losing saved reveal or timer state', function() {
    const old = { ...sessionFor(lesson), schemaVersion: 1, stage: 5, responses: { '5:2': { selected: 'B', revealed: true } } };
    old.steps[5] = 2;
    old.timer = { durationMs: 80000, remainingMs: 80000, running: true, deadline: 5000 };
    const recovered = validateSession(old, 2000);
    assert.equal(recovered.schemaVersion, SCHEMA);
    assert.equal(recovered.lessonId, lesson.id);
    assert.equal(recovered.stage, 5);
    assert.equal(recovered.steps[5], 2);
    assert.equal(recovered.responses['5:2'].revealed, true);
    assert.equal(recovered.timer.remainingMs, 3000);
    assert.equal(recovered.timer.running, false);
    assert.deepEqual(recovered.discussedQuestions, []);
});
test('summary reflects actual shown stages and unique teacher-confirmed discussions, not selection or navigation', function() {
    const session = sessionFor();
    let summary = summarizeSession(session, practiceLesson, 61000);
    assert.equal(summary.completedStages, 0);
    assert.equal(summary.questionsDiscussed, 0);
    assert.equal(summary.stars, null);
    assert.equal(summary.elapsedMs, 60000);
    practiceLesson.stages.forEach(function(stage, index) {
        stage.frames.forEach(function(frame, step) {
            session.seenFrames[frameKey(index, step)] = true;
            if (frame.type === 'question') session.responses[responseKeyFor(practiceLesson,index,step)] = { selected: null, revealed: true };
        });
    });
    session.discussedQuestions = ['quiz-0','quiz-0','quiz-1'];
    session.finishedAt = 31000;
    session.preferences.starsVisible = true;
    session.stars = 2;
    summary = summarizeSession(session, practiceLesson, 61000);
    assert.equal(summary.completedStages, 9);
    assert.equal(summary.questionsDiscussed, 2);
    assert.equal(summary.stars, 2);
    assert.equal(summary.elapsedMs, 30000);
    session.responses['6:5'].revealed = false;
    assert.equal(summarizeSession(session, practiceLesson).completedStages, 8);
    delete session.seenFrames['0:1'];
    assert.equal(summarizeSession(session, practiceLesson).completedStages, 7);
});
test('preferences share their response across think, respond and partner phases', function() {
    assert.equal(responseKeyFor(practiceLesson,2,0), '2:0');
    assert.equal(responseKeyFor(practiceLesson,2,1), '2:0');
    assert.equal(responseKeyFor(practiceLesson,2,2), '2:0');
    assert.equal(responseKeyFor(practiceLesson,2,5), '2:3');
});
