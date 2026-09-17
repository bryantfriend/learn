/** Deadline-based timer. No intervals are created by this module. */
export function prepareTimer(seconds) {
    return { durationMs: seconds * 1000, remainingMs: seconds * 1000, running: false, deadline: null };
}
export function remainingTime(timer, now = Date.now()) {
    return Math.max(0, timer.running ? timer.deadline - now : timer.remainingMs);
}
export function startTimer(timer, now = Date.now()) {
    if (timer.running || timer.remainingMs <= 0) return timer;
    return { ...timer, running: true, deadline: now + timer.remainingMs };
}
export function pauseTimer(timer, now = Date.now()) {
    return { ...timer, remainingMs: remainingTime(timer, now), running: false, deadline: null };
}
export function resetTimer(timer) {
    return prepareTimer(timer.durationMs / 1000);
}
export function addTime(timer, now = Date.now()) {
    const remainingMs = remainingTime(timer, now) + 30000;
    return { ...timer, remainingMs, deadline: timer.running ? now + remainingMs : null };
}
export function recoverTimer(timer, now = Date.now()) {
    return pauseTimer(timer, now);
}
export function formatTime(milliseconds) {
    const seconds = Math.ceil(Math.max(0, milliseconds) / 1000);
    return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
}
