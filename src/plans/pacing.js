import { schoolCalendar } from './calendar.js';
export const PACING_KEY = 'learn.g8-gp.pacing.v1';
export function planningWeeks(quarterId) {
    const quarter = schoolCalendar.quarters.find(function(item) { return item.id === quarterId; });
    if (!quarter) return [];
    const date = new Date(quarter.start + 'T12:00:00Z');
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
    const weeks = [];
    while (date.toISOString().slice(0, 10) <= quarter.end) {
        const start = date.toISOString().slice(0, 10);
        const friday = new Date(date); friday.setUTCDate(friday.getUTCDate() + 4);
        const end = friday.toISOString().slice(0, 10);
        const notes = [...schoolCalendar.breaks, ...schoolCalendar.events].filter(function(item) { return item.start <= end && item.end >= start; }).map(function(item) { return item.title; });
        if (start < quarter.start) notes.unshift('Quarter starts ' + quarter.start);
        if (end > quarter.end) notes.unshift('Quarter ends ' + quarter.end);
        if (!schoolCalendar.breaks.some(function(item) { return item.start <= start && item.end >= end; })) weeks.push({ start, end, notes });
        date.setUTCDate(date.getUTCDate() + 7);
    }
    return weeks;
}
export function validPacing(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const weeks = new Set(schoolCalendar.quarters.flatMap(function(q) { return planningWeeks(q.id).map(function(w) { return w.start; }); }));
    return Object.fromEntries(Object.entries(value).filter(function([week, count]) { return weeks.has(week) && Number.isInteger(count) && count >= 0 && count <= 3; }));
}
