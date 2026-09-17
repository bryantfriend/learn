import { lesson, modes } from './lessons.js';
import { prepareTimer, remainingTime, startTimer, pauseTimer, resetTimer, addTime, formatTime } from './timer.js';
import { createStorage } from './storage.js';

const app = document.getElementById('app');
const panel = document.getElementById('panel');
const notice = document.getElementById('notice');
const storage = createStorage(function() { return window.localStorage; });
const loaded = storage.load();
let session = loaded.session;
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
function currentFrame() { return currentStage().frames[session.steps[session.stage]]; }
function responseKey() { return session.stage + ':' + session.steps[session.stage]; }
function response() { return session.responses[responseKey()] || { selected: null, revealed: false }; }
function currentMode() {
    if (session.modeOverride) return session.modeOverride;
    if (currentFrame().type === 'question' && response().selected) return 'share';
    return currentFrame().mode;
}
function prepareCurrentTimer() {
    session.timer = prepareTimer(currentFrame().timerSeconds || currentStage().durationMinutes * 60);
}
function newSession(classLabel) {
    session = {
        schemaVersion: 1, lessonId: lesson.id, classLabel: classLabel.trim().slice(0, 30),
        stage: 0, steps: lesson.stages.map(function() { return 0; }), responses: {},
        stars: 0, modeOverride: null, preferences: { starsVisible: false, timerVisible: false },
        timer: prepareTimer(240)
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
    const start = button('Start new lesson →', 'start-new', 'primary');
    const actions = [start];
    if (session) actions.unshift(button('Resume lesson →', 'resume-saved', 'primary'));
    app.replaceChildren(element('main', { className: 'home' }, [
        element('header', { className: 'home-header' }, [brand(), element('span', {}, ['Mr. Friend'])]),
        element('section', { className: 'home-grid' }, [
            element('div', { className: 'home-copy' }, [
                element('p', { className: 'eyebrow' }, ['A little structure. A lot to discover.']),
                element('h1', {}, ['Clear routines.', element('br'), element('em', {}, ['Active learning.'])]),
                element('p', { className: 'home-intro' }, ['A shared screen. A fresh start. A whole class ready to think.']),
                element('div', { className: 'lesson-card' }, [
                    element('p', { className: 'eyebrow' }, ['TODAY’S LESSON · 01']),
                    element('h2', {}, [lesson.title]),
                    element('p', { className: 'meta' }, ['40 minutes · Whole class · No student devices']),
                    element('label', { for: 'class-label' }, ['Class label ', element('span', { className: 'muted' }, ['(optional)'])]),
                    element('input', { id: 'class-label', maxlength: '30', placeholder: 'e.g. 7A', value: session ? session.classLabel : '', autocomplete: 'off' }),
                    element('div', { className: 'home-actions' }, actions),
                    session ? element('p', { className: 'saved-hint' }, ['Saved: ' + currentStage().title + ' · step ' + (session.steps[session.stage] + 1) + '. Timer resumes paused.']) : element('p', { className: 'saved-hint' }, ['No setup needed. Start when your class is ready.'])
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
    const mode = modes[currentMode()];
    const step = session.steps[session.stage];
    const progress = element('div', { className: 'stage-dots', 'aria-hidden': 'true' }, lesson.stages.map(function(item, index) {
        return element('span', { className: index === session.stage ? 'active' : '' });
    }));
    const header = element('header', { className: 'player-header' }, [
        brand(),
        element('div', { className: 'header-right' }, [
            ...(session.classLabel ? [element('span', { className: 'class-label' }, [session.classLabel])] : []),
            ...(session.preferences.starsVisible ? [button('★ Class stars · ' + session.stars, 'tools', 'star-count')] : []),
            element('span', { className: 'teacher-name' }, ['Mr. Friend'])
        ])
    ]);
    const heading = element('section', { className: 'stage-heading' }, [
        element('div', {}, [
            button(String(session.stage + 1).padStart(2, '0') + ' / 08 · ' + stage.title + ' ▾', 'stages', 'stage-menu-button'),
            element('p', { className: 'stage-meta' }, [stage.timeRange + ' · ' + stage.durationMinutes + ' minutes planned'])
        ]),
        element('div', { className: 'mode-wrap' }, [
            button(mode.icon + ' ' + mode.label, 'mode', 'mode mode-' + currentMode(), { 'aria-label': 'Working mode: ' + mode.label + '. Change mode' }),
            progress
        ])
    ]);
    const copy = element('div', { className: 'copy' }, []);
    copy.append(element('p', { className: 'eyebrow' }, [frame.kicker || (frame.final ? 'LESSON COMPLETE' : 'NOTICE · THINK · EXPLAIN')]));
    copy.append(element('h1', { id: 'student-title', tabindex: '-1' }, [frame.title]));
    if (frame.quote) copy.append(element('blockquote', {}, [frame.quote]));
    if (frame.choices) copy.append(element('ol', { className: 'opening-choices' }, frame.choices.map(function(choice) { return element('li', {}, [choice]); })));
    if (frame.lines) copy.append(element('div', { className: 'instructions' }, frame.lines.map(function(line) { return element('p', {}, [line]); })));
    if (frame.footnote) copy.append(element('p', { className: 'footnote' }, [frame.footnote]));
    if (frame.type === 'question') renderQuestion(copy);
    const content = element('section', { className: 'teaching-content' + (frame.visual ? ' split' : '') + (frame.type === 'question' ? ' quiz' : ''), 'aria-labelledby': 'student-title' }, [copy]);
    if (frame.visual) {
        const evidence = element('div', { className: 'visual-evidence' }, [schoolyard]);
        const explanation = copy.querySelector('.explanation');
        if (explanation) evidence.append(explanation);
        content.append(evidence);
    }
    const stepControls = element('section', { className: 'step-controls', 'aria-label': 'Current teaching step' }, [
        element('span', { className: 'step-label' }, ['Step ' + (step + 1) + ' of ' + stage.frames.length]),
        ...(frame.cue ? [button('◉ ' + frame.cue, 'attention', 'cue text-button')] : []),
        ...(step > 0 ? [button('← Previous step', 'previous-step', 'subtle')] : []),
        ...(step < stage.frames.length - 1 ? [button(frame.nextLabel || 'Next step →', 'next-step', 'primary')] : []),
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
    const result = response();
    copy.append(element('div', { className: 'answers', 'aria-label': 'Choose a response to discuss' }, [
        button('A · Observation: the picture shows it.', 'select-answer', result.selected === 'A' ? 'selected' : '', { 'data-answer': 'A', 'aria-pressed': String(result.selected === 'A') }),
        button('B · Inference: a possible explanation.', 'select-answer', result.selected === 'B' ? 'selected' : '', { 'data-answer': 'B', 'aria-pressed': String(result.selected === 'B') })
    ]));
    if (result.revealed) {
        copy.append(element('div', { className: 'explanation', role: 'status' }, [
            element('strong', {}, [currentFrame().answer + ' · ' + (currentFrame().answer === 'A' ? 'Observation' : 'Inference')]),
            element('p', {}, [currentFrame().explanation])
        ]));
    } else {
        copy.append(element('p', { className: 'response-hint' }, [result.selected ? 'Discussing ' + result.selected + ' · Explanation is still hidden.' : 'Think first. Show 1 or 2 fingers when invited.']));
        copy.append(button('Reveal explanation', 'reveal', 'reveal-button'));
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
    if (panel.open) panel.close();
    dialogKind = kind;
    panel.className = kind === 'attention' || kind === 'pause' ? 'overlay-panel' : '';
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
        element('p', {}, ['Progress is saved only in this browser. It does not sync between your laptop and the classroom board.']),
        element('p', {}, ['Attention pauses the timer and covers the lesson. Resume restores the same screen. Next step reveals content; Next stage moves to a new section. Nothing advances automatically.']),
        element('p', {}, ['All lesson content loads at startup. Moving through a loaded lesson needs no new content requests. A first visit or page reload still needs a connection.']),
        element('p', {}, ['Teacher notes and tools are visible to anyone looking at this shared screen. They are not private or password protected. Use only a class label, never student names.']),
        element('p', {}, [storage.isUnavailable() ? 'Saving is unavailable in this browser. Keep this page open while teaching.' : 'Use Clear saved session when you want to remove progress from this board.'])
    ]);
}
function showTools() {
    openPanel('Teacher tools', [
        element('p', { className: 'panel-hint' }, ['Shared screen: students can see anything opened here.']),
        button('Read this stage’s teacher notes', 'notes'),
        button('Choose a stage', 'stages'),
        element('section', { className: 'tools-stars' }, [
            element('h3', {}, ['Class stars']),
            element('p', {}, ['Optional shared acknowledgements, not grades. No automatic awards, rankings, or rewards to unlock.']),
            button(session.preferences.starsVisible ? 'Hide class stars' : 'Show class stars', 'toggle-stars'),
            ...(session.preferences.starsVisible ? [
                element('p', { className: 'stars-total' }, ['★ ' + session.stars + ' class stars']),
                button('Add one star', 'add-star'),
                button('Undo most recent award', 'undo-star', '', session.stars === 0 ? { disabled: '' } : {})
            ] : [])
        ]),
        button('Help & browser storage', 'help'),
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
    session.modeOverride = null;
    prepareCurrentTimer();
    save(); render();
}
function goStep(direction) {
    const index = session.steps[session.stage] + direction;
    if (index < 0 || index >= currentStage().frames.length) return;
    session.steps[session.stage] = index;
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
    closePanel(); inLesson = false; render();
}
function clearSession() {
    confirmAction('Clear saved session?', 'This removes this browser’s lesson progress, class label, reveals, timer, and stars, and returns home.', function() {
        const cleared = storage.clear();
        session = null; inLesson = false; render();
        if (!cleared) notify('Browser storage could not be cleared. Use browser settings to remove any older saved progress.');
    }, 'Clear saved session');
}
function handleAction(event) {
    const target = event.target.closest('button[data-action]');
    if (!target || target.disabled) return;
    const action = target.dataset.action;
    if (action === 'start-new') {
        const label = document.getElementById('class-label').value;
        if (session) confirmAction('Start a new lesson?', 'This clears the saved lesson’s progress, reveals, timer, and stars.', function() { newSession(label); }, 'Start new lesson');
        else newSession(label);
    } else if (action === 'resume-saved') {
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
    else if (action === 'notes') openPanel('Teacher notes · visible to the class', [element('p', {}, [currentStage().notes])]);
    else if (action === 'stages') showStages();
    else if (action === 'jump') { closePanel(); goStage(Number(target.dataset.stage)); }
    else if (action === 'back-stage') goStage(session.stage - 1);
    else if (action === 'next-stage') goStage(session.stage + 1);
    else if (action === 'previous-step') goStep(-1);
    else if (action === 'next-step') goStep(1);
    else if (action === 'attention' || action === 'pause') showOverlay(action);
    else if (action === 'resume-overlay') resumeOverlay();
    else if (action === 'timer') { session.preferences.timerVisible = !session.preferences.timerVisible; save(); render(); }
    else if (action === 'toggle-timer') {
        session.timer = session.timer.running ? pauseTimer(session.timer) : startTimer(session.timer);
        save(); render();
    } else if (action === 'reset-timer') { session.timer = resetTimer(session.timer); save(); render(); }
    else if (action === 'add-time') { session.timer = addTime(session.timer); save(); render(); }
    else if (action === 'select-answer') {
        session.responses[responseKey()] = { ...response(), selected: target.dataset.answer };
        save(); render();
    } else if (action === 'reveal') {
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
        confirmAction('Restart this lesson?', 'This clears all current progress, reveals, timer, and stars. Your class label is kept.', function() { newSession(session.classLabel); }, 'Restart lesson');
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
