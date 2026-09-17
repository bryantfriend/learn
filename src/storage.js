import { lesson, modes } from './lessons.js';
import { recoverTimer } from './timer.js';
export const STORAGE_KEY = 'learn.session.v1';
const SCHEMA = 1;
function integer(value, minimum, maximum) {
    return Number.isInteger(value) && value >= minimum && value <= maximum;
}
export function validateSession(value, now = Date.now()) {
    if (!value || value.schemaVersion !== SCHEMA || value.lessonId !== lesson.id) return null;
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
        if (!/^5:[0-5]$/.test(key)) return null;
        const response = value.responses[key];
        if (!response || !['A', 'B', null].includes(response.selected) || typeof response.revealed !== 'boolean') return null;
        responses[key] = { selected: response.selected, revealed: response.revealed };
    }
    return {
        schemaVersion: SCHEMA, lessonId: lesson.id, classLabel: value.classLabel,
        stage: value.stage, steps: value.steps.slice(), responses,
        stars: value.stars, preferences: { starsVisible: value.preferences.starsVisible, timerVisible: value.preferences.timerVisible },
        modeOverride: Object.hasOwn(modes, value.modeOverride) ? value.modeOverride : null,
        timer: recoverTimer(timer, now)
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
