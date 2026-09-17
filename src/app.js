import {visualSpec,createVisual,pauseVisuals} from './visuals.js';
import { lesson as firstLesson, getLesson, modes, questionOptions } from './lessons.js';
import { frameKey, responseKeyFor, summarizeSession } from './progress.js';
import { prepareTimer, remainingTime, startTimer, pauseTimer, resetTimer, addTime, formatTime } from './timer.js';
import { createStorage, SCHEMA } from './storage.js';
import { classes, subjectsFor, getClass, contextLabel, lessonsFor } from './catalog.js';

import { grade7BCourses } from './plans/grade7b.js';
import { grade7ACourses } from './plans/grade7a.js';
import { grade8GPPlan } from './plans/grade8-gp.js';
import { schoolCalendar } from './plans/calendar.js';

import { planningWeeks, validPacing, PACING_KEY } from './plans/pacing.js';
let pacing = {};
try { pacing = validPacing(JSON.parse(window.localStorage.getItem(PACING_KEY))); } catch {}
function getWeekCount(week) { return pacing[week] ?? 3; }
let planQuarter = 'Q1';
const app = document.getElementById('app');
const panel = document.getElementById('panel');
const notice = document.getElementById('notice');
const storage = createStorage(function() { return window.localStorage; });
const loaded = storage.load();
let session = loaded.session;
let lesson = session ? getLesson(session.lessonId) : firstLesson;
let selectedLessonId = lesson.id;
let selectedClassId = session?.classId || null;
let selectedSubjectId = session?.subjectId || null;
let picker = null;
let inLesson = false;
let dialogKind = '';
let confirmation = null;
let overlayWasRunning = false;
let attentionDeadline = 0;
let savingWarningShown = false;
let noticeDeadline = 0;

// Reuse one locally loaded image throughout the lesson; no stage fetches content.
const schoolyard = element('figure', { className: 'schoolyard' }, [
    element('img', { src: './assets/schoolyard.svg', alt: 'An imaginary schoolyard: one tree, a bench, a path and puddle, a closed umbrella, a school building, and no people.' }),
    element('figcaption', {}, ['An imaginary schoolyard'])
]);

function element(tag, properties = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(properties).forEach(function(entry) {
        if (entry[0] === 'className') node.className = entry[1];
        else node.setAttribute(entry[0], entry[1]);
    });
    children.forEach(function(child) {
        node.append(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
}
function button(label, action, className = '', extra = {}) {
    return element('button', { type: 'button', 'data-action': action, className, ...extra }, [label]);
}
function notify(message) {
    notice.textContent = message;
    noticeDeadline = Date.now() + 6500;
}
function save() {
    if (!storage.save(session) && !savingWarningShown) {
        savingWarningShown = true;
        notify('Saving is unavailable. Continue teaching; progress stays in memory until this page closes.');
    }
}
function currentStage() { return lesson.stages[session.stage]; }
function currentFrame() {
    const frame = currentStage().frames[session.steps[session.stage]];
    if (frame.afterAttention && session.attentionReturns[frameKey(session.stage, session.steps[session.stage])]) {
        return { ...frame, ...frame.afterAttention, cue: '' };
    }
    return frame;
}
function responseKey() { return responseKeyFor(lesson, session.stage, session.steps[session.stage]); }
function response() { return session.responses[responseKey()] || { selected: null, revealed: false }; }
function currentMode() {
    if (session.modeOverride) return session.modeOverride;
    const frame = currentFrame();
    if (frame.type === 'question' && (response().selected || response().revealed) && (!lesson.showVoiceLevels || frame.discussionVoice !== undefined)) return 'share';
    return currentFrame().mode;
}
function currentVoiceLevel() {
    const frame = currentFrame();
    if (session.modeOverride) return modes[session.modeOverride].voiceLevel;
    if (frame.discussionVoice !== undefined && (response().selected || response().revealed)) return frame.discussionVoice;
    return frame.voiceLevel === undefined ? modes[currentMode()].voiceLevel : frame.voiceLevel;
}
function recordCurrentFrame() {
    session.seenFrames[frameKey(session.stage, session.steps[session.stage])] = true;
}
function prepareCurrentTimer() {
    session.timer = prepareTimer(currentFrame().timerSeconds || currentStage().durationMinutes * 60);
}
function newSession(classLabel, lessonId = selectedLessonId, classId = selectedClassId, subjectId = selectedSubjectId) {
    lesson = getLesson(lessonId) || firstLesson;
    selectedLessonId = lesson.id;
    session = {
        schemaVersion: SCHEMA, lessonId: lesson.id, classId, subjectId, classLabel: classLabel.trim().slice(0, 30),
        stage: 0, steps: lesson.stages.map(function() { return 0; }), responses: {},
        stars: 0, modeOverride: null, preferences: { starsVisible: false, timerVisible: false },
        timer: prepareTimer(lesson.stages[0].frames[0].timerSeconds || lesson.stages[0].durationMinutes * 60),
        seenFrames: { '0:0': true }, attentionReturns: {}, discussedQuestions: [],
        startedAt: Date.now(), finishedAt: null
    };
    inLesson = true;
    save();
    render();
}
function brand() {
    return element('div', { className: 'brand' }, [
        element('span', { className: 'brand-mark', 'aria-hidden': 'true' }, ['L']),
        element('strong', {}, ['Learn']),
        element('span', { className: 'brand-divider' }, ['Oxford International School'])
    ]);
}
function renderHome() {

    const start = button('Choose class & lesson →', 'choose-lesson', 'primary');
    const actions = [start];
    if (session) actions.unshift(button('Resume last class →', 'resume-saved', 'subtle'));
    app.replaceChildren(element('main', { className: 'home' }, [
        element('header', { className: 'home-header' }, [brand(), element('span', {}, ['Mr. Friend'])]),
        element('section', { className: 'home-grid' }, [
            element('div', { className: 'home-copy' }, [
                element('p', { className: 'eyebrow' }, ['A little structure. A lot to discover.']),
                element('h1', {}, ['Clear routines.', element('br'), element('em', {}, ['Active learning.'])]),
                element('p', { className: 'home-intro' }, ['A shared screen. A fresh start. A whole class ready to think.']),
                element('div', { className: 'lesson-card' }, [
                    element('div', { className: 'lesson-picker-row' }, [element('p', { className: 'eyebrow' }, ['YOUR CLASSROOM']), element('span', { className: 'catalog-count' }, ['3 classes · 2 subjects'])]),
                    element('h2', {}, [session ? contextLabel(session) : 'Where are we learning today?']),
                    element('p', { className: 'lesson-subtitle' }, [session ? lesson.title : '7A · 7B · 8th Grade']),
                    element('p', { className: 'meta' }, ['Geography · Global Perspectives']),
                    element('div', { className: 'home-actions' }, actions),
                    session ? element('p', { className: 'saved-hint' }, ['Saved: ' + currentStage().title + ' · step ' + (session.steps[session.stage] + 1) + '. Timer resumes paused.']) : element('p', { className: 'saved-hint' }, ['Choose your class, subject, and lesson. Your place is saved separately for each.'])
                ])
            ]),
            element('div', { className: 'home-art' }, [element('div', { className: 'art-note' }, ['LOOK CLOSELY. THINK CLEARLY.']), schoolyard, element('p', {}, ['What can we see? What might we explain?'])])
        ]),
        element('footer', { className: 'home-footer' }, [
            element('span', {}, ['Teacher-led · Quiet by design']),
            button('Help & browser storage', 'help', 'text-button'),
            ...(session ? [button('Clear saved session', 'clear-session', 'text-button')] : [])
        ])
    ]));
}
function renderPlayer() {
    const stage = currentStage();
    const frame = currentFrame();
    const graphic = visualSpec(lesson,stage,frame);
    const mode = modes[currentMode()];
    const modeButton = button(mode.icon + ' ' + mode.label, 'mode', 'mode mode-' + currentMode(), { 'aria-label': 'Working mode: ' + mode.label + '. Change mode' });
    if (lesson.showVoiceLevels) modeButton.append(element('span', { className: 'voice-level' }, ['Voice level ' + currentVoiceLevel()]));
    const step = session.steps[session.stage];
    const progress = element('div', { className: 'stage-dots', 'aria-hidden': 'true' }, lesson.stages.map(function(item, index) {
        return element('span', { className: index === session.stage ? 'active' : '' });
    }));
    const header = element('header', { className: 'player-header' }, [
        brand(),
        element('div', { className: 'header-right' }, [
            button(contextLabel(session) + ' ▾', 'switch-class', 'class-label', { 'aria-label': 'Switch class or lesson' }),
            ...(session.preferences.starsVisible ? [button('★ Class stars · ' + session.stars, 'tools', 'star-count')] : []),
            element('span', { className: 'teacher-name' }, ['Mr. Friend'])
        ])
    ]);
    const heading = element('section', { className: 'stage-heading' }, [
        element('div', {}, [
            button(String(session.stage + 1).padStart(2, '0') + ' / ' + String(lesson.stages.length).padStart(2, '0') + ' · ' + stage.title + ' ▾', 'stages', 'stage-menu-button'),
            element('p', { className: 'stage-meta' }, [stage.timeRange + ' · ' + stage.durationMinutes + ' minutes planned'])
        ]),
        element('div', { className: 'mode-wrap' }, [
            modeButton,
            progress
        ])
    ]);
    const copy = element('div', { className: 'copy' }, []);
    copy.append(element('p', { className: 'eyebrow' + (lesson.catalog ? ' lesson-context' : '') }, [frame.kicker || (frame.final ? 'LESSON COMPLETE' : lesson.eyebrow || 'NOTICE · THINK · EXPLAIN')]));
    copy.append(element('h1', { id: 'student-title', tabindex: '-1' }, [graphic?.intro && lesson.catalog?.classes ? graphic.title : frame.title]));
    if (frame.quote) copy.append(element('blockquote', {}, [frame.quote]));
    if (frame.choices) copy.append(element('ol', { className: 'opening-choices' + (frame.choiceLayout === 'grid' ? ' choice-grid' : '') }, frame.choices.map(function(choice) { return element('li', {}, [choice]); })));
    if (frame.lines) copy.append(element('div', { className: 'instructions' }, (graphic?.intro ? [graphic.prompt] : frame.lines).map(function(line) { return element('p', {}, [line]); })));
    if (frame.footnote) copy.append(element('p', { className: 'footnote' }, [frame.footnote]));
    if (frame.type === 'question' || frame.type === 'opinion') renderQuestion(copy);
    if (frame.type === 'memory') copy.append(element('div', { className: 'memory-grid', 'aria-label': 'Nine items to remember' }, frame.items.map(function(item) {
        return element('div', { className: 'memory-item' }, [element('span', { 'aria-hidden': 'true' }, [item.symbol]), element('span', { className: 'memory-label' }, [item.label])]);
    })));
    if (frame.symbol) copy.append(element('div', { className: 'mission-symbol', 'aria-hidden': 'true' }, [frame.symbol]));
    const answerPanel = !frame.visual && frame.type === 'question' && response().revealed;
    if (frame.diagram && !graphic) {
        const diagrams = {'g7b-uk':['g7b-uk','Schematic UK locations; boxes are not country outlines.'],'g7b-valley':['g7b-valley','V-shaped and U-shaped valley cross-sections.'],'g7b-cycle':['g7b-cycle','Water cycle: evaporation, condensation, precipitation, runoff and infiltration.'],'g7b-bend':['g7b-bend','River bend with outer-bank erosion and inner-bank deposition.'],'2.4':['g7-plan','Invented plan: school west, pond east, park north, road south.'],'2.5':['g7-grid','Practice grid. Tree six tenths across and two tenths up inside square 2345.'],'2.8':['g7-profile','Profile: 100, 120, 160 and 180 metres at 0, 100, 200 and 300 metres distance.'],'2.9':['g7-world','Coordinate sketch: A north and east, B south and east, C at zero latitude and longitude.']};
        const item = diagrams[frame.diagram];
        copy.append(element('img', {src:'./assets/'+item[0]+'.svg',alt:item[1],className:'gp-diagram'}));
    }
    if (frame.printExam) copy.append(examLink('Open printable student paper', false));
    const content = element('section', { className: 'teaching-content' + (graphic ? ' illustrated' : '') + (frame.visual || answerPanel ? ' split' : '') + (lesson.summary ? ' practice-content' : '') + (lesson.gp ? ' gp-content' : '') + (frame.type === 'question' ? ' quiz' : ''), 'aria-labelledby': 'student-title' }, [copy]);
    if (graphic) content.append(createVisual(graphic));
    if (frame.visual) {
        const evidence = element('div', { className: 'visual-evidence' }, [schoolyard]);
        const explanation = copy.querySelector('.explanation');
        if (explanation) evidence.append(explanation);
        content.append(evidence);
    }
    if (answerPanel) {
        const explanation = copy.querySelector('.explanation');
        content.append(element('aside', { className: 'answer-detail', 'aria-label': 'Revealed answer' }, [explanation]));
    }
    const canDiscuss = frame.discussionId && (frame.type !== 'question' || response().revealed);
    const discussed = session.discussedQuestions.includes(frame.discussionId);
    const stepControls = element('section', { className: 'step-controls', 'aria-label': 'Current teaching step' }, [
        element('span', { className: 'step-label' }, ['Step ' + (step + 1) + ' of ' + stage.frames.length]),
        ...(frame.cue ? [button('◉ ' + frame.cue, 'attention', 'cue text-button')] : []),
        ...(canDiscuss ? [button(discussed ? '✓ Discussed' : 'Mark discussed', 'mark-discussed', 'subtle discussion-button', { 'aria-pressed': String(discussed) })] : []),
        ...(step > 0 ? [button('← Previous step', 'previous-step', 'subtle')] : []),
        ...(step < stage.frames.length - 1 ? [button(frame.nextLabel || 'Next step →', 'next-step', 'primary')] : []),
        ...(frame.final && lesson.summary ? [button('View lesson summary', 'summary', 'primary')] : []),
        ...(frame.final ? [button('Return home', 'home', 'primary')] : [])
    ]);
    const toolbar = element('nav', { className: 'toolbar', 'aria-label': 'Teacher controls' }, [
        button('← Back', 'back-stage', '', session.stage === 0 ? { disabled: '' } : {}),
        button('Next stage →', 'next-stage', '', session.stage === lesson.stages.length - 1 ? { disabled: '' } : {}),
        element('span', { className: 'toolbar-divider', 'aria-hidden': 'true' }),
        button('◉ Attention', 'attention', 'attention-button'),
        button('Ⅱ Pause', 'pause'),
        button('◷ Timer', 'timer', '', { 'aria-expanded': String(session.preferences.timerVisible) }),
        button('⛶ Fullscreen', 'fullscreen'),
        button('☰ Teacher tools', 'tools')
    ]);
    const player = element('main', { className: 'player' }, [header, heading, content, stepControls]);
    if (session.preferences.timerVisible) player.append(renderTimer());
    player.append(toolbar);
    app.replaceChildren(player);
}
function renderQuestion(copy) {
    const frame = currentFrame();
    const result = response();
    const options = questionOptions(frame);
    if (options.length) copy.append(element('div', { className: 'answers' + (frame.options ? ' custom-answers' : ''), 'aria-label': 'Choose a response to discuss' }, options.map(function(option) {
        return button(option.id + ' · ' + option.label, 'select-answer', result.selected === option.id ? 'selected' : '', { 'data-answer': option.id, 'aria-pressed': String(result.selected === option.id) });
    })));
    if (frame.type === 'opinion') {
        copy.append(element('p', { className: 'response-hint' }, [result.selected ? 'Discussing ' + result.selected + ' · No correct answer.' : 'No correct answer. Respond from your seat when invited.']));
        return;
    }
    if (result.revealed) {
        const answer = options.find(function(option) { return option.id === frame.answer; });
        const answerLabel = frame.answerText || (frame.options ? (frame.suggested ? 'Suggested: ' : '') + frame.answer + ' · ' + answer.label : frame.answer + ' · ' + (frame.answer === 'A' ? 'Observation' : 'Inference'));
        copy.append(element('div', { className: 'explanation', role: 'status' }, [
            element('strong', {}, [answerLabel]),
            ...(frame.explanation ? [element('p', {}, [frame.explanation])] : []),
            ...(frame.followUp ? [element('p', { className: 'follow-up' }, [frame.followUp])] : [])
        ]));
    } else {
        copy.append(element('p', { className: 'response-hint' }, [result.selected ? 'Discussing ' + result.selected + ' · Explanation is still hidden.' : frame.responseHint || (frame.answerText ? 'Think quietly. Share when invited.' : 'Think first. Show 1 or 2 fingers when invited.')]));
        copy.append(button(frame.answerText ? 'Reveal response' : frame.suggested ? 'Reveal suggested answer' : 'Reveal explanation', 'reveal', 'reveal-button'));
    }
}
function renderTimer() {
    const time = remainingTime(session.timer);
    const timer = element('section', { className: 'timer-strip', 'aria-label': 'Activity timer' }, [
        element('strong', { id: 'timer-display', role: 'timer', 'aria-label': 'Time remaining' }, [formatTime(time)]),
        element('span', { id: 'timer-status' }, [time <= 0 ? 'Time to regroup' : session.timer.running ? 'Running' : 'Paused · teacher starts']),
        button(session.timer.running ? 'Pause timer' : session.timer.remainingMs === session.timer.durationMs ? 'Start timer' : 'Resume timer', 'toggle-timer', '', time <= 0 ? { disabled: '' } : {}),
        button('Reset timer', 'reset-timer'),
        button('+30 seconds', 'add-time')
    ]);
    return timer;
}
function render() {
    const active = document.activeElement;
    const action = active && active.dataset ? active.dataset.action : '';
    const answer = active && active.dataset ? active.dataset.answer : '';
    if (inLesson) renderPlayer(); else renderHome();
    if (action && !panel.open) {
        const candidate = Array.from(app.querySelectorAll('button')).find(function(item) {
            return item.dataset.action === action && (!answer || item.dataset.answer === answer) && !item.disabled;
        });
        if (candidate) candidate.focus({ preventScroll: true });
    }
}
function openPanel(title, children, kind = 'panel') {
    pauseVisuals();
    if (panel.open) panel.close();
    dialogKind = kind;
    panel.className = kind === 'attention' || kind === 'pause' ? 'overlay-panel' : kind === 'picker' ? 'class-picker' : kind === 'year-plan' ? 'class-picker year-plan' : '';
    panel.replaceChildren(element('div', { className: 'panel-header' }, [
        element('h2', { id: 'panel-title' }, [title]),
        ...(kind === 'attention' || kind === 'pause' ? [] : [button('Close ×', 'close-panel', 'subtle')])
    ]), ...children);
    panel.showModal();
}
function closePanel() {
    panel.close();
    dialogKind = '';
    confirmation = null;
}
function confirmAction(title, message, callback, label) {
    confirmation = callback;
    openPanel(title, [element('p', {}, [message]), element('div', { className: 'dialog-actions' }, [
        button('Cancel', 'cancel-confirm'), button(label, 'confirm', 'primary')
    ])], 'confirm');
    panel.querySelector('[data-action="cancel-confirm"]').focus();
}
function showHelp() {
    openPanel('Ready for your classroom', [
        element('p', {}, ['Operate the board yourself. Students think, talk, point, or use agreed gestures from their seats. No student devices are needed.']),
        element('p', {}, ['Progress is saved separately for each class, subject, and lesson in this browser. It does not sync between your laptop and the classroom board.']),
        element('p', {}, ['Attention pauses the timer and covers the lesson. Resume restores the same screen. Next step reveals content; Next stage moves to a new section. Nothing advances automatically.']),
        element('p', {}, ['All lesson content loads at startup. Moving through a loaded lesson needs no new content requests. A first visit or page reload still needs a connection.']),
        element('p', {}, ['Teacher notes and tools are visible to anyone looking at this shared screen. They are not private or password protected. Use only a class label, never student names.']),
        element('p', {}, [storage.isUnavailable() ? 'Saving is unavailable in this browser. Keep this page open while teaching.' : 'Use Clear saved session when you want to remove progress from this board.'])
    ]);
}
function chooseLesson() {
    const remembered = getLesson(selectedLessonId);
    if (remembered?.catalog?.quarter) planQuarter = remembered.catalog.quarter;
    picker = { classId: selectedClassId, subjectId: selectedSubjectId, lessonId: selectedLessonId };
    showPicker();
}
function showPicker(focusSelector) {
    const availableSubjects = subjectsFor(picker.classId);
    if (!availableSubjects.some(function(item) { return item.id === picker.subjectId; })) picker.subjectId = availableSubjects.length === 1 ? availableSubjects[0].id : null;
    const available = lessonsFor(picker.classId, picker.subjectId).filter(function(item) { return !item.catalog?.quarter || item.catalog.quarter === planQuarter; });
    if (!available.some(function(item) { return item.id === picker.lessonId; })) picker.lessonId = null;
    const saved = picker.lessonId ? storage.find(picker) : null;
    function group(title, items, key, action) {
        return element('section', { className: 'picker-section', 'aria-label': title }, [
            element('h3', {}, [title]),
            element('div', { className: 'picker-options' }, items.map(function(item) {
                return button(item.label, action, picker[key] === item.id ? 'selected' : '', { 'data-id': item.id, 'aria-pressed': String(picker[key] === item.id) });
            }))
        ]);
    }
    const subjectLessons = available.filter(function(item) { return item.catalog; });
    const shared = available.filter(function(item) { return !item.catalog; });
    function lessonButton(item) {
        const checkpoint = storage.find({ ...picker, lessonId: item.id });
        return element('button', { type: 'button', 'data-action': 'select-lesson', 'data-lesson': item.id, className: 'lesson-option' + (picker.lessonId === item.id ? ' selected' : ''), 'aria-pressed': String(picker.lessonId === item.id) }, [
            element('strong', {}, [item.title]),
            element('span', {}, [(item.catalog?.unit ? item.catalog.unit + ' · ' : '') + item.durationMinutes + ' min' + (checkpoint ? ' · Saved at stage ' + (checkpoint.stage + 1) : '')])
        ]);
    }
    const ready = !!picker.classId && !!picker.subjectId;
    openPanel('Choose class & lesson', [
        element('p', { className: 'panel-hint' }, ['A quick start for every class. Saved progress stays with its class, subject, and lesson.']),
        element('div', { className: 'picker-context' }, [
            group('1 · Class', classes, 'classId', 'select-class'),
            group('2 · Subject', availableSubjects, 'subjectId', 'select-subject')
        ]),
        element('section', { className: 'picker-lessons', 'aria-label': '3 · Lesson' }, [
            element('h3', {}, ['3 · Lesson']),
            ...(['7a','7b'].includes(picker.classId) && picker.subjectId ? [button(getClass(picker.classId).label+' weekly plan · '+(picker.subjectId === 'geography' ? (picker.classId==='7a'?'1':'2')+' Geography lesson(s)/week' : (picker.classId==='7a'?'2':'3')+' GP lessons/week'), 'g7-plan', 'plan-link')] : []),
            ...(['8','7a','7b'].includes(picker.classId) ? [element('div', { className: 'picker-options quarter-options', 'aria-label': 'Lesson quarter' }, schoolCalendar.quarters.map(function(q) { return button(q.id, 'lesson-quarter', planQuarter === q.id ? 'selected' : '', { 'data-quarter': q.id, 'aria-pressed': String(planQuarter === q.id) }); }))] : []),
            ...(picker.classId === '8' && picker.subjectId === 'global-perspectives' ? [button('2026–2027 year plan & calendar · 43 playable lessons and assessments', 'year-plan', 'plan-link')] : []),
            ...storage.unassigned().map(function(value) { return button('Resume earlier unassigned lesson: ' + getLesson(value.lessonId).title, 'resume-earlier', 'subtle', { 'data-lesson': value.lessonId }); }),
            ...(!ready ? [element('p', { className: 'empty-curriculum' }, ['Choose a class and subject to see lessons.'])] : [
                ...(subjectLessons.length ? subjectLessons.map(lessonButton) : [element('p', { className: 'empty-curriculum' }, ['Subject lessons will appear here as classroom activities are prepared.'])]),
                ...(shared.length ? [element('p', { className: 'eyebrow' }, ['SHARED STARTER LESSONS']), ...shared.map(lessonButton)] : [])
            ])
        ]),
        element('div', { className: 'picker-footer' }, [
            element('p', { className: 'picker-status', role: 'status' }, [saved ? contextLabel(saved) + ' · Stage ' + (saved.stage + 1) + ', step ' + (saved.steps[saved.stage] + 1) + ' · Timer paused' : ready ? contextLabel(picker) + (picker.lessonId ? ' · Ready to begin' : ' · Choose a lesson to begin') : 'Three classes. One familiar lesson player.']),
            element('div', { className: 'dialog-actions' }, [
                ...(saved ? [button('Resume lesson →', 'picker-resume', 'primary')] : []),
                button(saved ? 'Start again' : 'Start lesson →', 'picker-start', saved ? 'subtle' : 'primary', picker.lessonId ? {} : { disabled: '' })
            ])
        ])
    ], 'picker');
    if (focusSelector) panel.querySelector(focusSelector)?.focus({ preventScroll: true });
}
function startSelection(resume) {
    if (!picker || !lessonsFor(picker.classId, picker.subjectId).some(function(item) { return item.id === picker.lessonId; })) return;
    const selection = { ...picker };
    const saved = storage.find(selection);
    function start() {
        selectedClassId = selection.classId; selectedSubjectId = selection.subjectId; selectedLessonId = selection.lessonId;
        closePanel();
        if (resume && saved) {
            session = saved; lesson = getLesson(session.lessonId); inLesson = true; save(); render();
        } else newSession(getClass(selection.classId).label, selection.lessonId, selection.classId, selection.subjectId);
    }
    if (saved && !resume) confirmAction('Start this lesson again?', 'This resets only ' + contextLabel(selection) + '’s progress for this lesson. Other saved lessons are kept.', start, 'Start again');
    else start();
}
function showGrade7Plan() {
    const course=[...grade7ACourses,...grade7BCourses].find(function(c){return c.classId===picker.classId && c.subjectId===picker.subjectId;});
    const classLabel=getClass(picker.classId).label;
    const subject=course.subjectId==='geography'?'Geography':'Global Perspectives';
    openPanel(classLabel+' · '+subject+' weekly plan',[
        element('p',{className:'panel-hint'},[course.sessionsPerWeek+' lesson(s) per teaching week · 40 minutes each · '+course.lessons.length+' sessions']),
        element('div',{className:'picker-options'},schoolCalendar.quarters.map(function(q){return button(q.id,'g7-quarter',planQuarter===q.id?'selected':'',{'data-quarter':q.id,'aria-pressed':String(planQuarter===q.id)});})),
        element('div',{className:'year-plan-content'},[
            element('p',{},['Dates label teaching weeks, not fixed weekdays. Original practice and homework are retained in teacher notes; extensions are optional.']),
            ...course.weeks.filter(function(w){return w.quarter===planQuarter;}).map(function(week){
                const sessions=course.lessons.filter(function(l){return l.week===week.index;});
                return element('section',{className:'planned-topic'},[
                    element('h3',{},['Week '+week.index+' · '+dateLabel(week.start)]),
                    ...(sessions.length?sessions.map(function(l){return button('Lesson '+l.slot+' · '+l.title,'g7-open','lesson-option',{'data-lesson':l.id});}):[element('p',{},['No regular lessons in the supplied weekly plan.'])])
                ]);
            })
        ]),
        element('div',{className:'picker-footer'},[element('p',{className:'picker-status'},[classLabel+' · '+course.sessionsPerWeek+' sessions per teaching week'+(picker.classId==='7b'?' · Stage 6 support':'')]),button('Back to lessons','back-picker','primary')])
    ],'year-plan');
}
function dateLabel(value) {
    return new Date(value + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}
function showYearPlan(focusSelector) {
    const quarter = schoolCalendar.quarters.find(function(item) { return item.id === planQuarter; });
    const entries = grade8GPPlan.entries.filter(function(item) { return item.quarter === planQuarter; });
    const weeks = planningWeeks(planQuarter);
    openPanel('8th Grade · Global Perspectives', [
        element('p', { className: 'panel-hint' }, ['2026–2027 · 38 teaching lessons · 5 printable assessments · Flexible weekly pacing']),
        element('div', { className: 'picker-options', 'aria-label': 'Quarter' }, schoolCalendar.quarters.map(function(item) {
            return button(item.id, 'plan-quarter', item.id === planQuarter ? 'selected' : '', { 'data-quarter': item.id, 'aria-pressed': String(item.id === planQuarter) });
        })),
        element('div', { className: 'year-plan-content' }, [
            element('p', { className: 'plan-period' }, [dateLabel(quarter.start) + ' – ' + dateLabel(quarter.end)]),
            element('details', { className: 'weekly-pacing' }, [
                element('summary', {}, ['Weekly pacing & school calendar']),
                element('p', {}, ['Three lessons is a target, not a fixed timetable. Set a week to 2, 1, or 0 when needed. Counts are saved in this browser. Topics may span several lessons; lesson sequences can be extended or revisited when your weekly timetable changes.']),
                ...weeks.map(function(week) {
                    const count = getWeekCount(week.start);
                    return element('section', { className: 'week-row' }, [
                        element('div', {}, [
                            element('strong', {}, [dateLabel(week.start) + ' – ' + dateLabel(week.end)]),
                            element('p', {}, [week.notes.join(' · ') || 'Regular teaching week'])
                        ]),
                        element('div', { className: 'week-controls', 'aria-label': 'Lessons for week of ' + week.start }, [
                            button('−', 'week-count', '', { 'data-week': week.start, 'data-count': String(count - 1), 'aria-label': 'Fewer lessons for ' + dateLabel(week.start), ...(count === 0 ? { disabled: '' } : {}) }),
                            element('span', { role: 'status' }, [String(count) + (count === 1 ? ' lesson' : ' lessons')]),
                            button('+', 'week-count', '', { 'data-week': week.start, 'data-count': String(count + 1), 'aria-label': 'More lessons for ' + dateLabel(week.start), ...(count === 3 ? { disabled: '' } : {}) })
                        ])
                    ]);
                }),
                element('p', { className: 'panel-hint' }, ['Full holiday weeks are omitted. Dates follow the supplied school calendar; assessment windows remain visible for timetable adjustments.']),
                ...schoolCalendar.breaks.filter(function(item) { return item.start >= quarter.start && item.start <= (planQuarter === 'Q1' ? '2026-11-08' : planQuarter === 'Q2' ? '2027-01-10' : planQuarter === 'Q3' ? '2027-03-28' : quarter.end); }).map(function(item) {
                    return element('p', { className: 'calendar-break' }, [dateLabel(item.start) + ' – ' + dateLabel(item.end) + ' · ' + item.title]);
                })
            ]),
            element('p', { className: 'empty-curriculum' }, ['Every topic now opens a classroom lesson. Assessments include printable four-option tests and separate teacher keys.']),
            ...entries.map(function(entry) {
                return element('details', { className: 'planned-topic', 'data-plan-id': entry.id }, [
                    element('summary', {}, [
                        element('span', { className: 'topic-meta' }, [entry.month + ' · ' + (entry.unit === 'Assessment' || entry.unit === 'Review' ? entry.unit : 'Unit ' + entry.unit) + ' · ' + entry.code]),
                        element('strong', {}, [entry.title])
                    ]),
                    button(entry.unit === 'Assessment' ? 'Open assessment' : 'Open lesson', 'open-plan-lesson', 'primary', { 'data-lesson': entry.id }),
                    element('p', {}, [entry.objective]),
                    element('p', {}, [element('strong', {}, ['Objectives: ']), entry.objectives]),
                    element('p', {}, [element('strong', {}, ['Original plan resources: ']), entry.resources]),
                    element('p', {}, [element('strong', {}, ['Thinking skills: ']), entry.bloom])
                ]);
            })
        ]),
        element('div', { className: 'picker-footer' }, [
            element('p', { className: 'picker-status' }, ['Flexible weekly pacing · Lessons and printable assessments ready']),
            button('Back to lessons', 'back-picker', 'primary')
        ])
    ], 'year-plan');
    if (focusSelector) { panel.querySelector('.weekly-pacing').open = true; panel.querySelector(focusSelector)?.focus(); }
}
function showNotes() {
    const stage = currentStage();
    openPanel('Teacher notes · visible to the class', [
        ...(session.stage === 0 && lesson.openingScript ? [element('h3', {}, ['Suggested opening script']), element('p', {}, [lesson.openingScript])] : []),
        ...(stage.script ? [element('h3', {}, ['Suggested script']), element('p', {}, [stage.script])] : []),
        element('p', {}, [stage.notes])
    ]);
}
function showSummary() {
    if (!lesson.summary || !currentFrame().final) return;
    session.timer = pauseTimer(session.timer);
    if (!session.finishedAt) session.finishedAt = Date.now();
    save(); render();
    const summary = summarizeSession(session, lesson);
    openPanel('Lesson summary', [
        element('p', { className: 'summary-lesson' }, [summary.lessonTitle]),
        element('dl', { className: 'summary-stats' }, [
            element('dt', {}, ['Stages completed']), element('dd', { 'data-summary': 'stages' }, [summary.completedStages + ' / ' + summary.totalStages]),
            element('dt', {}, ['Questions discussed']), element('dd', { 'data-summary': 'questions' }, [String(summary.questionsDiscussed)]),
            ...(summary.stars !== null ? [element('dt', {}, ['Class stars']), element('dd', { 'data-summary': 'stars' }, [String(summary.stars)])] : []),
            element('dt', {}, ['Session duration']), element('dd', { 'data-summary': 'duration' }, ['About ' + Math.round(summary.elapsedMs / 60000) + (Math.round(summary.elapsedMs / 60000) === 1 ? ' minute' : ' minutes')])
        ]),
        element('p', { className: 'panel-hint' }, ['Completed stages had all steps shown and required answers revealed. Discussions are counted only when you tap Mark discussed. These are lesson records, not student scores. Duration includes pauses and time away from this browser.']),
        button('Return to dismissal screen', 'close-panel', 'primary')
    ]);
}
function examLink(label, key) {
    return element('a', { href: './exams/?id=' + lesson.examId + (key ? '&key=1' : ''), target: '_blank', rel: 'noopener', className: 'exam-link' }, [label]);
}
function showTools() {
    openPanel('Teacher tools', [
        ...(lesson.examId ? [examLink('Print student paper', false), examLink('Teacher answer key', true)] : []),
        element('p', { className: 'panel-hint' }, ['Shared screen: students can see anything opened here.']),
        button('Read this stage’s teacher notes', 'notes'),
        button('Choose a stage', 'stages'),
        element('section', { className: 'tools-stars' }, [
            element('h3', {}, ['Class stars']),
            ...(lesson.starSuggestion ? [element('p', {}, ['Suggested reason: ' + lesson.starSuggestion + '. Award manually if appropriate.'])] : []),
            element('p', {}, ['Optional shared acknowledgements, not grades. No automatic awards, rankings, or rewards to unlock.']),
            button(session.preferences.starsVisible ? 'Hide class stars' : 'Show class stars', 'toggle-stars'),
            ...(session.preferences.starsVisible ? [
                element('p', { className: 'stars-total' }, ['★ ' + session.stars + ' class stars']),
                button('Add one star', 'add-star'),
                button('Undo most recent award', 'undo-star', '', session.stars === 0 ? { disabled: '' } : {})
            ] : [])
        ]),
        button('Help & browser storage', 'help'),
        button('Switch class or lesson', 'switch-class'),
        button('Return home', 'home'),
        element('hr'),
        button('Restart lesson', 'restart'),
        button('Clear saved session', 'clear-session')
    ]);
}
function showStages() {
    openPanel('Choose a stage', [
        element('p', {}, ['Jump when ready. Existing reveal steps are kept; the next timer is prepared paused.']),
        element('div', { className: 'stage-list' }, lesson.stages.map(function(stage, index) {
            return button((index + 1) + '. ' + stage.title + ' · ' + stage.durationMinutes + ' min', 'jump', index === session.stage ? 'selected' : '', { 'data-stage': String(index) });
        }))
    ]);
}
function goStage(index) {
    if (index < 0 || index >= lesson.stages.length) return;
    session.stage = index;
    recordCurrentFrame();
    session.finishedAt = null;
    session.modeOverride = null;
    prepareCurrentTimer();
    save(); render();
}
function goStep(direction) {
    const index = session.steps[session.stage] + direction;
    if (index < 0 || index >= currentStage().frames.length) return;
    session.steps[session.stage] = index;
    recordCurrentFrame();
    session.finishedAt = null;
    session.modeOverride = null;
    prepareCurrentTimer();
    save(); render();
    const title = document.getElementById('student-title');
    title.focus({ preventScroll: true });
}
function showOverlay(kind) {
    if (dialogKind === 'attention' || dialogKind === 'pause') return;
    overlayWasRunning = session.timer.running && remainingTime(session.timer) > 0;
    session.timer = pauseTimer(session.timer);
    attentionDeadline = kind === 'attention' ? Date.now() + 3000 : 0;
    save();
    const content = kind === 'attention' ? [
        element('div', { id: 'attention-countdown', className: 'countdown', 'aria-hidden': 'true' }, ['3']),
        element('div', { id: 'attention-instructions', hidden: '' }, [
            element('p', {}, ['Pause your conversation.']),
            element('p', {}, ['Put materials down when safe.']),
            element('p', {}, ['Listen for the next instruction.'])
        ])
    ] : [element('p', {}, ['Listen for the next instruction.'])];
    content.push(button('Resume lesson', 'resume-overlay', 'primary'));
    openPanel(kind === 'attention' ? 'A moment to listen.' : 'Pause', content, kind);
}
function resumeOverlay() {
    // Only this lesson's explicit acknowledgement changes after an Attention return.
    if (dialogKind === 'attention' && currentFrame().afterAttention) session.attentionReturns[frameKey(session.stage, session.steps[session.stage])] = true;
    if (overlayWasRunning) session.timer = startTimer(session.timer);
    overlayWasRunning = false;
    closePanel(); save(); render();
}
async function fullscreen() {
    try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
        else throw new Error('Fullscreen is unavailable');
    } catch {
        notify('Fullscreen is unavailable here. You can keep teaching in this browser window.');
    }
}
function home() {
    if (session) { session.timer = pauseTimer(session.timer); save(); }
    if (session) { selectedClassId = session.classId; selectedSubjectId = session.subjectId; selectedLessonId = session.lessonId; }
    closePanel(); inLesson = false; render();
}
function clearSession() {
    confirmAction('Clear saved session?', 'This removes only the current class, subject, and lesson’s progress, reveals, timer, and stars. Other saved lessons are kept.', function() {
        const cleared = storage.clear(session);
        session = null; inLesson = false; render();
        if (!cleared) notify('Browser storage could not be cleared. Use browser settings to remove any older saved progress.');
    }, 'Clear saved session');
}
function handleAction(event) {
    const target = event.target.closest('button[data-action]');
    if (!target || target.disabled) return;
    const action = target.dataset.action;
    if (action === 'choose-lesson' && !inLesson) chooseLesson();
    else if (action === 'g7-plan') showGrade7Plan();
    else if (action === 'g7-quarter') { planQuarter=target.dataset.quarter; showGrade7Plan(); }
    else if (action === 'g7-open') { picker.lessonId=target.dataset.lesson; showPicker(); }
    else if (action === 'lesson-quarter') { planQuarter = target.dataset.quarter; showPicker('[data-action="lesson-quarter"][data-quarter="' + planQuarter + '"]'); }
    else if (action === 'open-plan-lesson') { picker = { classId:'8', subjectId:'global-perspectives', lessonId:target.dataset.lesson }; showPicker(); }
    else if (action === 'year-plan') showYearPlan();
    else if (action === 'week-count' && dialogKind === 'year-plan') {
        const count = Number(target.dataset.count), week = target.dataset.week;
        if (!Number.isInteger(count) || count < 0 || count > 3 || !planningWeeks(planQuarter).some(function(item) { return item.start === week; })) return;
        pacing[week] = count;
        try { window.localStorage.setItem(PACING_KEY, JSON.stringify(pacing)); } catch { notify('Weekly pacing stays in memory because browser saving is unavailable.'); }
        showYearPlan('[data-week="' + week + '"]:not(:disabled)');
    }
    else if (action === 'plan-quarter') { planQuarter = target.dataset.quarter; showYearPlan(); }
    else if (action === 'back-picker') showPicker();
    else if (action === 'switch-class') { home(); chooseLesson(); }
    else if (action === 'select-class' && dialogKind === 'picker') {
        picker.classId = target.dataset.id; showPicker('[data-action="select-class"][data-id="' + picker.classId + '"]');
    } else if (action === 'select-subject' && dialogKind === 'picker') {
        picker.subjectId = target.dataset.id; showPicker('[data-action="select-subject"][data-id="' + picker.subjectId + '"]');
    } else if (action === 'select-lesson' && dialogKind === 'picker') {
        picker.lessonId = target.dataset.lesson; showPicker('[data-lesson="' + picker.lessonId + '"]');
    } else if (action === 'picker-start' || action === 'picker-resume') startSelection(action === 'picker-resume');
    else if (action === 'resume-earlier' && dialogKind === 'picker') {
        const earlier = storage.find({ classId: null, subjectId: null, lessonId: target.dataset.lesson });
        if (!earlier) return;
        session = earlier; lesson = getLesson(session.lessonId); inLesson = true; closePanel(); save(); render();
    } else if (action === 'resume-saved' && session) {
        lesson = getLesson(session.lessonId);
        selectedClassId = session.classId; selectedSubjectId = session.subjectId; selectedLessonId = session.lessonId;
        inLesson = true; render();
    } else if (action === 'confirm') {
        const callback = confirmation;
        closePanel();
        if (callback) callback();
    } else if (action === 'close-panel' || action === 'cancel-confirm') closePanel();
    else if (action === 'help') showHelp();
    else if (action === 'clear-session') clearSession();
    else if (action === 'fullscreen') fullscreen();
    else if (!session || !inLesson) return;
    else if (action === 'tools') showTools();
    else if (action === 'notes') showNotes();
    else if (action === 'summary') showSummary();
    else if (action === 'stages') showStages();
    else if (action === 'jump') { closePanel(); goStage(Number(target.dataset.stage)); }
    else if (action === 'back-stage') goStage(session.stage - 1);
    else if (action === 'next-stage') goStage(session.stage + 1);
    else if (action === 'previous-step') goStep(-1);
    else if (action === 'next-step') goStep(1);
    else if (action === 'attention' || action === 'pause') showOverlay(action);
    else if (action === 'resume-overlay') resumeOverlay();
    else if (action === 'mark-discussed') {
        const frame = currentFrame();
        if (!frame.discussionId || (frame.type === 'question' && !response().revealed)) return;
        if (session.discussedQuestions.includes(frame.discussionId)) session.discussedQuestions = session.discussedQuestions.filter(function(id) { return id !== frame.discussionId; });
        else session.discussedQuestions.push(frame.discussionId);
        save(); render();
    }
    else if (action === 'timer') { session.preferences.timerVisible = !session.preferences.timerVisible; save(); render(); }
    else if (action === 'toggle-timer') {
        session.timer = session.timer.running ? pauseTimer(session.timer) : startTimer(session.timer);
        save(); render();
    } else if (action === 'reset-timer') { session.timer = resetTimer(session.timer); save(); render(); }
    else if (action === 'add-time') { session.timer = addTime(session.timer); save(); render(); }
    else if (action === 'select-answer') {
        if (!questionOptions(currentFrame()).some(function(option) { return option.id === target.dataset.answer; })) return;
        session.responses[responseKey()] = { ...response(), selected: target.dataset.answer };
        save(); render();
    } else if (action === 'reveal') {
        if (currentFrame().type !== 'question') return;
        session.responses[responseKey()] = { ...response(), revealed: true };
        save(); render();
    } else if (action === 'mode') {
        openPanel('Set the working mode', Object.entries(modes).map(function(entry) {
            return button(entry[1].icon + ' ' + entry[1].label, 'set-mode', '', { 'data-mode': entry[0] });
        }));
    } else if (action === 'set-mode') { session.modeOverride = target.dataset.mode; closePanel(); save(); render(); }
    else if (action === 'toggle-stars') {
        session.preferences.starsVisible = !session.preferences.starsVisible; save(); render(); showTools();
    } else if (action === 'add-star' || action === 'undo-star') {
        session.stars = Math.min(10000, Math.max(0, session.stars + (action === 'add-star' ? 1 : -1)));
        save(); render(); showTools();
    } else if (action === 'restart') {
        confirmAction('Restart this lesson?', 'This clears all current progress, reveals, timer, and stars. Your class label is kept.', function() { newSession(session.classLabel, session.lessonId, session.classId, session.subjectId); }, 'Restart lesson');
    } else if (action === 'home') home();
}
function tick() {
    if (noticeDeadline && Date.now() >= noticeDeadline) { notice.textContent = ''; noticeDeadline = 0; }
    if (dialogKind === 'attention') {
        const seconds = Math.ceil(Math.max(0, attentionDeadline - Date.now()) / 1000);
        const countdown = document.getElementById('attention-countdown');
        countdown.textContent = String(seconds);
        countdown.hidden = seconds === 0;
        document.getElementById('attention-instructions').hidden = seconds > 0;
    }
    if (!inLesson || !session) return;
    const remaining = remainingTime(session.timer);
    const display = document.getElementById('timer-display');
    if (display) display.textContent = formatTime(remaining);
    if (session.timer.running && remaining === 0) {
        session.timer = pauseTimer(session.timer);
        save(); render();
        notify('Time to regroup.');
    }
}
document.addEventListener('click', handleAction);
panel.addEventListener('cancel', function(event) {
    event.preventDefault();
    if (dialogKind === 'attention' || dialogKind === 'pause') resumeOverlay();
    else closePanel();
});
window.addEventListener('pagehide', function() { if (session) save(); });
render();
if (loaded.message) notify(loaded.message);
// One scheduler for the entire page, regardless of how often controls are tapped.
window.setInterval(tick, 200);
