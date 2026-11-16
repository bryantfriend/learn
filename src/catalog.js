import { lessons } from './lessons.js';

export const classes = [
    { id: '7a', label: '7A', grade: 7 },
    { id: '7b', label: '7B', grade: 7 },
    { id: '8', label: '8th Grade', grade: 8 },
    { id: '9', label: '9th Grade', grade: 9 },
    { id: 'college', label: 'College', grade: 'college' },
    { id: 'substitution', label: 'Substitution', grade: 'substitution' }
];
export const subjects = [
    { id: 'college-english', label: 'College English', grades: [7, 8, 'college'], activeClasses: ['college'] },
    { id: 'ict', label: 'ICT', grades: [9] },
    { id: 'ielts', label: 'IELTS Preparation', grades: [7], classes: ['7a', '7b'] },
    { id: 'religion', label: 'Religion · Substitute lessons', grades: [7, 8, 'substitution'], activeClasses: ['substitution'] },
    { id: 'geography', label: 'Geography', grades: [7] },
    { id: 'global-perspectives', label: 'Global Perspectives', grades: [7, 8], archived: true },
    { id: 'global-perspectives-books', label: 'Global Perspectives · Workbook trial', grades: [7, 8] },
    { id: 'english', label: 'Conversational English', grades: [7], classes:['7a', '7b'], sessionsPerWeek:2 }
];
export function getClass(id) { return classes.find(function(item) { return item.id === id; }) || null; }
export function getSubject(id) { return subjects.find(function(item) { return item.id === id; }) || null; }
export function subjectsFor(classId) {
    const group = getClass(classId);
    return group ? subjects.filter(function(item) { return !item.archived && item.grades.includes(group.grade) && (!item.classes || item.classes.includes(classId)) && (!item.activeClasses || item.activeClasses.includes(classId)); }) : [];
}
export function contextLabel(value) {
    const group = getClass(value.classId), subject = getSubject(value.subjectId);
    return group && subject ? group.label + ' · ' + subject.label : (value.classLabel || 'Earlier session') + ' · Unassigned';
}
// Lessons without curriculum metadata are the original shared starter lessons.
// Future subject lessons specify catalog: { subjectId, grades: [7], unit, order }.
export function lessonsFor(classId, subjectId, source = lessons, includeArchived = false) {
    const group = getClass(classId), subject = getSubject(subjectId);
    const valid = includeArchived ? subject && subject.grades.includes(group?.grade) && (!subject.classes || subject.classes.includes(classId)) : subjectsFor(classId).some(function(item) { return item.id === subjectId; });
    if (!group || !valid) return [];
    return source.filter(function(item) {
        return !item.catalog || (item.catalog.subjectId === subjectId && item.catalog.grades.includes(group.grade) && (!item.catalog.classes || item.catalog.classes.includes(classId)));
    }).sort(function(a, b) { return (a.catalog?.order || 0) - (b.catalog?.order || 0); });
}
export function sessionKey(value) {
    return [value.classId || 'unassigned', value.subjectId || 'unassigned', value.lessonId].join(':');
}
