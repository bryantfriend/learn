import { lesson as firstLesson, getLesson, modes, questionOptions } from './lessons.js';
import { prepareTimer, recoverTimer } from './timer.js';
import { frameKey } from './progress.js';
import { getClass, getSubject, lessonsFor, sessionKey } from './catalog.js';
// Keep the existing key so the first release's saved lesson can be migrated in place.
export const STORAGE_KEY = 'learn.session.v1';
export const SCHEMA = 3;
export const SESSIONS_KEY = 'learn.sessions.v1';
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
    if (!value || ![1, 2, SCHEMA].includes(value.schemaVersion)) return null;
    const lesson = getLesson(value.lessonId);
    if (!lesson || (value.schemaVersion === 1 && lesson.id !== firstLesson.id)) return null;
    // Rewritten lessons start afresh; class preferences and other lesson saves survive.
    if (lesson.contentRevision && value.contentRevision !== lesson.contentRevision) {
        if (value.contentRevision !== undefined && (!Number.isInteger(value.contentRevision) || value.contentRevision > lesson.contentRevision)) return null;
        value = { ...value, contentRevision: lesson.contentRevision, stage: 0,
            steps: lesson.stages.map(() => 0), responses: {}, seenFrames: { '0:0': true },
            attentionReturns: {}, discussedQuestions: [], modeOverride: null,
            timer: prepareTimer(lesson.stages[0].durationMinutes * 60), startedAt: now, finishedAt: null };
    }
    if (!integer(value.stage, 0, lesson.stages.length - 1) || !Array.isArray(value.steps) || value.steps.length !== lesson.stages.length) return null;
    for (let index = 0; index < value.steps.length; index += 1) {
        if (!integer(value.steps[index], 0, lesson.stages[index].frames.length - 1)) return null;
    }
    if (typeof value.classLabel !== 'string' || value.classLabel.length > 30 || !integer(value.stars, 0, 10000)) return null;
    const retired = value.classId === '8' && value.subjectId === 'geography';
    const classId = value.schemaVersion < 3 || retired ? null : value.classId;
    const subjectId = value.schemaVersion < 3 || retired ? null : value.subjectId;
    if (!(classId === null && subjectId === null) && (!getClass(classId) || !getSubject(subjectId) || !lessonsFor(classId, subjectId).some(function(item) { return item.id === lesson.id; }))) return null;
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
        schemaVersion: SCHEMA, lessonId: lesson.id, ...(lesson.contentRevision ? { contentRevision: lesson.contentRevision } : {}), classId, subjectId, classLabel: retired ? '8th Grade · Geography' : getClass(classId)?.label || value.classLabel,
        stage: value.stage, steps: value.steps.slice(), responses,
        stars: value.stars, preferences: { starsVisible: value.preferences.starsVisible, timerVisible: value.preferences.timerVisible },
        modeOverride: Object.hasOwn(modes, value.modeOverride) ? value.modeOverride : null,
        timer: recoverTimer(timer, now), seenFrames, attentionReturns,
        discussedQuestions: Array.from(new Set(discussedQuestions)), startedAt, finishedAt
    };
}
export function createStorage(getStorage) {
    let unavailable = false, hydrated = false, active = null;
    const sessions = new Map();
    function hydrate() {
        if (hydrated) return '';
        hydrated = true;
        let message = '';
        try {
            const raw = getStorage().getItem(SESSIONS_KEY);
            if (raw) {
                try {
                    const values = JSON.parse(raw);
                    if (!Array.isArray(values)) throw new SyntaxError();
                    values.forEach(function(value) {
                        const valid = validateSession(value);
                        if (valid) sessions.set(sessionKey(valid), valid);
                    });
                } catch { message = 'Some saved progress could not be restored.'; }
            }
            const rawActive = getStorage().getItem(STORAGE_KEY);
            if (rawActive) {
                active = validateSession(JSON.parse(rawActive));
                if (active) sessions.set(sessionKey(active), active);
                else message = 'Saved progress could not be restored. Choose a class to begin.';
            }
        } catch (error) {
            if (error instanceof SyntaxError) message = 'Saved progress is unreadable. Choose a class to begin.';
            else { unavailable = true; message = 'Saving is unavailable. This lesson will work in memory.'; }
        }
        return message;
    }
    return {
        load: function() { const message = hydrate(); return { session: active, message }; },
        unassigned: function() { hydrate(); return Array.from(sessions.values()).filter(function(value) { return !value.classId; }).map(function(value) { return validateSession(value); }); },
        find: function(context) {
            hydrate();
            const value = sessions.get(sessionKey(context));
            return value ? validateSession(value) : null;
        },
        save: function(session) {
            hydrate();
            active = structuredClone(session);
            sessions.set(sessionKey(active), active);
            try {
                getStorage().setItem(SESSIONS_KEY, JSON.stringify(Array.from(sessions.values())));
                getStorage().setItem(STORAGE_KEY, JSON.stringify(active));
                return true;
            } catch { unavailable = true; return false; }
        },
        clear: function(session = active) {
            hydrate();
            if (session) sessions.delete(sessionKey(session));
            active = null;
            try {
                getStorage().setItem(SESSIONS_KEY, JSON.stringify(Array.from(sessions.values())));
                getStorage().removeItem(STORAGE_KEY);
                return true;
            } catch { unavailable = true; return false; }
        },
        isUnavailable: function() { return unavailable; }
    };
}
