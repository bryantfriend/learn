import { lesson as firstLesson, getLesson, modes, questionOptions } from './lessons.js';
import { recoverTimer } from './timer.js';
import { frameKey } from './progress.js';
// Keep the existing key so the first release's saved lesson can be migrated in place.
export const STORAGE_KEY = 'learn.session.v1';
export const SCHEMA = 2;
function integer(value, minimum, maximum) {
    return Number.isInteger(value) && value >= minimum && value <= maximum;
}
function frameAt(lesson, key) {
    if (!/^\d+:\d+$/.test(key)) return null;
    const parts = key.split(':').map(Number);
    const stage = lesson.stages[parts[0]];
    return stage && stage.frames[parts[1]] ? stage.frames[parts[1]] : null;
}
function validFrameFlags(value, lesson, attentionOnly = false) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const result = {};
    for (const key of Object.keys(value)) {
        const frame = frameAt(lesson, key);
        if (!frame || value[key] !== true || (attentionOnly && !frame.afterAttention)) return null;
        result[key] = true;
    }
    return result;
}
export function validateSession(value, now = Date.now()) {
    if (!value || ![1, SCHEMA].includes(value.schemaVersion)) return null;
    const lesson = getLesson(value.lessonId);
    if (!lesson || (value.schemaVersion === 1 && lesson.id !== firstLesson.id)) return null;
    if (!integer(value.stage, 0, lesson.stages.length - 1) || !Array.isArray(value.steps) || value.steps.length !== lesson.stages.length) return null;
    for (let index = 0; index < value.steps.length; index += 1) {
        if (!integer(value.steps[index], 0, lesson.stages[index].frames.length - 1)) return null;
    }
    if (typeof value.classLabel !== 'string' || value.classLabel.length > 30 || !integer(value.stars, 0, 10000)) return null;
    const timer = value.timer;
    if (!timer || !Number.isFinite(timer.durationMs) || timer.durationMs <= 0 || timer.durationMs > 3600000 ||
        !Number.isFinite(timer.remainingMs) || timer.remainingMs < 0 || timer.remainingMs > 86400000 ||
        typeof timer.running !== 'boolean' || (timer.running && (!Number.isFinite(timer.deadline) || timer.deadline > now + 86400000))) return null;
    if (!value.preferences || typeof value.preferences.starsVisible !== 'boolean' || typeof value.preferences.timerVisible !== 'boolean') return null;
    if (!value.responses || typeof value.responses !== 'object' || Array.isArray(value.responses)) return null;
    const responses = {};
    for (const key of Object.keys(value.responses)) {
        const frame = frameAt(lesson, key);
        if (!frame || !['question', 'opinion'].includes(frame.type)) return null;
        const response = value.responses[key];
        const allowed = questionOptions(frame).map(function(option) { return option.id; }).concat([null]);
        if (!response || !allowed.includes(response.selected) || typeof response.revealed !== 'boolean' || (frame.type === 'opinion' && response.revealed)) return null;
        responses[key] = { selected: response.selected, revealed: response.revealed };
    }
    const legacy = value.schemaVersion === 1;
    const seenFrames = legacy ? { [frameKey(value.stage, value.steps[value.stage])]: true } : validFrameFlags(value.seenFrames, lesson);
    const attentionReturns = legacy ? {} : validFrameFlags(value.attentionReturns, lesson, true);
    const discussedQuestions = legacy ? [] : value.discussedQuestions;
    const allowedDiscussionIds = new Set(lesson.stages.flatMap(function(stage) {
        return stage.frames.map(function(frame) { return frame.discussionId; }).filter(Boolean);
    }));
    if (!seenFrames || !attentionReturns || !Array.isArray(discussedQuestions) || !discussedQuestions.every(function(id) { return allowedDiscussionIds.has(id); })) return null;
    const startedAt = legacy ? now : value.startedAt;
    const finishedAt = legacy ? null : value.finishedAt;
    if (!Number.isFinite(startedAt) || startedAt < 0 || startedAt > now ||
        (finishedAt !== null && (!Number.isFinite(finishedAt) || finishedAt < startedAt || finishedAt > now))) return null;
    return {
        schemaVersion: SCHEMA, lessonId: lesson.id, classLabel: value.classLabel,
        stage: value.stage, steps: value.steps.slice(), responses,
        stars: value.stars, preferences: { starsVisible: value.preferences.starsVisible, timerVisible: value.preferences.timerVisible },
        modeOverride: Object.hasOwn(modes, value.modeOverride) ? value.modeOverride : null,
        timer: recoverTimer(timer, now), seenFrames, attentionReturns,
        discussedQuestions: Array.from(new Set(discussedQuestions)), startedAt, finishedAt
    };
}
export function createStorage(getStorage) {
    let unavailable = false;
    return {
        load: function() {
            try {
                const raw = getStorage().getItem(STORAGE_KEY);
                if (!raw) return { session: null, message: '' };
                const session = validateSession(JSON.parse(raw));
                return { session, message: session ? '' : 'Saved progress could not be restored. Start a new lesson.' };
            } catch (error) {
                if (error instanceof SyntaxError) return { session: null, message: 'Saved progress is unreadable. Start a new lesson.' };
                unavailable = true;
                return { session: null, message: 'Saving is unavailable. This lesson will work in memory.' };
            }
        },
        save: function(session) {
            try { getStorage().setItem(STORAGE_KEY, JSON.stringify(session)); return true; }
            catch { unavailable = true; return false; }
        },
        clear: function() {
            try { getStorage().removeItem(STORAGE_KEY); return true; }
            catch { unavailable = true; return false; }
        },
        isUnavailable: function() { return unavailable; }
    };
}
