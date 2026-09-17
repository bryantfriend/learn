import { lessons } from './lessons.js';

export const classes = [
    { id: '7a', label: '7A', grade: 7 },
    { id: '7b', label: '7B', grade: 7 },
    { id: '8', label: '8th Grade', grade: 8 }
];
export const subjects = [
    { id: 'geography', label: 'Geography', grades: [7] },
    { id: 'global-perspectives', label: 'Global Perspectives', grades: [7, 8] }
];
export function getClass(id) { return classes.find(function(item) { return item.id === id; }) || null; }
export function getSubject(id) { return subjects.find(function(item) { return item.id === id; }) || null; }
export function subjectsFor(classId) {
    const group = getClass(classId);
    return group ? subjects.filter(function(item) { return item.grades.includes(group.grade); }) : [];
}
export function contextLabel(value) {
    const group = getClass(value.classId), subject = getSubject(value.subjectId);
    return group && subject ? group.label + ' · ' + subject.label : (value.classLabel || 'Earlier session') + ' · Unassigned';
}
// Lessons without curriculum metadata are the original shared starter lessons.
// Future subject lessons specify catalog: { subjectId, grades: [7], unit, order }.
export function lessonsFor(classId, subjectId, source = lessons) {
    const group = getClass(classId);
    if (!group || !subjectsFor(classId).some(function(item) { return item.id === subjectId; })) return [];
    return source.filter(function(item) {
        return !item.catalog || (item.catalog.subjectId === subjectId && item.catalog.grades.includes(group.grade) && (!item.catalog.classes || item.catalog.classes.includes(classId)));
    }).sort(function(a, b) { return (a.catalog?.order || 0) - (b.catalog?.order || 0); });
}
export function sessionKey(value) {
    return [value.classId || 'unassigned', value.subjectId || 'unassigned', value.lessonId].join(':');
}
