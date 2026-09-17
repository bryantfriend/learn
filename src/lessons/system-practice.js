/** Practice activities use the same frames, questions, modes and timers as the first lesson. */
const skills = ['🎨 Drawing', '⚽ Sport', '🎮 Gaming', '🎵 Music', '🗣 Languages', '🧠 Something else'];
const memoryItems = [
    { symbol: '🌍', label: 'Globe' }, { symbol: '✏️', label: 'Pencil' }, { symbol: '🐘', label: 'Elephant' },
    { symbol: '🚲', label: 'Bicycle' }, { symbol: '🍕', label: 'Pizza' }, { symbol: '🌳', label: 'Tree' },
    { symbol: '🎒', label: 'Backpack' }, { symbol: '⭐', label: 'Star' }, { symbol: '📚', label: 'Books' }
];
function choices(labels, numeric = false) {
    return labels.map(function(label, index) { return { id: numeric ? String(index + 1) : String.fromCharCode(65 + index), label }; });
}
function preferenceRound(question, index) {
    const common = {
        title: question.title, type: 'opinion', options: choices(question.labels),
        kicker: 'Would you rather? · ' + (index + 1) + ' of 3',
        responseIndex: index * 3
    };
    return [
        { ...common, mode: 'think', voiceLevel: 0, lines: ['Think quietly.'], nextLabel: 'Show how to respond' },
        { ...common, mode: 'think', voiceLevel: 0, lines: ['Show 1 finger for A.', 'Show 2 fingers for B.'], nextLabel: 'Partner talk: why?' },
        { ...common, mode: 'pair', voiceLevel: 2, timerSeconds: 30, lines: ['Tell your partner WHY.'], cue: 'Use Attention to regroup.', discussionId: 'rather-' + index, nextLabel: 'Next question' }
    ];
}
function sequenceRounds() {
    const instructions = ['Touch your shoulder.', 'Point to the ceiling.', 'Fold your arms.', 'Show a thumbs up.'];
    const frames = [{ title: 'Mission: Follow the Sequence', mode: 'listen', voiceLevel: 0, lines: ['I will reveal one instruction at a time.', 'Stay in your seat.'], nextLabel: 'Start round 1' }];
    for (let round = 1; round <= 4; round += 1) {
        for (let step = 0; step < round; step += 1) {
            frames.push({
                title: round === 2 && step === 1 ? 'Then point to the ceiling.' : instructions[step],
                mode: 'listen', voiceLevel: 0, kicker: 'Round ' + round + ' · instruction ' + (step + 1) + ' of ' + round,
                footnote: 'Stay in your seat. Move only if comfortable.',
                nextLabel: step < round - 1 ? 'Reveal next instruction' : round < 4 ? 'Start round ' + (round + 1) : 'Reflect on the sequence'
            });
        }
    }
    frames.push({
        title: 'What made that easier?', type: 'question', mode: 'think', voiceLevel: 0, discussionVoice: 2,
        options: choices(['Watching carefully.', 'Listening carefully.', 'Remembering the order.', 'All three.']),
        answer: 'D', explanation: 'Following instructions often uses more than one skill.',
        discussionId: 'sequence', responseHint: 'Show 1, 2, 3 or 4 fingers.'
    });
    return frames;
}
const oddRounds = [
    { items: ['Apple', 'Banana', 'Carrot', 'Orange'], answer: '3', explanation: 'The others are fruits.' },
    { items: ['Mountain', 'River', 'Ocean', 'Pencil'], answer: '4', explanation: 'The others are geographical features.' },
    { items: ['Book', 'Notebook', 'Chair', 'Dictionary'], answer: '3', explanation: 'The others are commonly used for reading or writing.' },
    { items: ['Bishkek', 'Tokyo', 'Paris', 'Basketball'], answer: '4', explanation: 'The others are cities.' }
];
const quiz = [
    { title: 'Which is larger?', labels: ['Ocean', 'Puddle'], answer: 'A', explanation: 'An ocean is much larger than a puddle.' },
    { title: 'Which usually has more people?', labels: ['City', 'Classroom'], answer: 'A', explanation: 'A city usually has far more people than one classroom.' },
    { title: 'Which animal is normally larger?', labels: ['Elephant', 'Cat'], answer: 'A', explanation: 'An elephant is normally larger than a cat.' },
    { title: 'Which comes first in the alphabet?', labels: ['B', 'D'], answer: 'A', explanation: 'The letter B comes before the letter D.' },
    { title: 'Which number is greater?', labels: ['18', '81'], answer: 'B', explanation: '81 is greater than 18.' },
    { title: 'Which statement is true?', labels: ['Everyone learns in exactly the same way.', 'Different people may learn better in different ways.'], answer: 'B', explanation: 'Different tasks can call for different ways to learn.' }
];
export const practiceLesson = {
    id: 'system-practice-01',
    title: 'Mission: Learn How We Learn',
    subtitle: 'A practice lesson for our new classroom system',
    durationMinutes: 40,
    target: 'Grades 7–8',
    eyebrow: 'SYSTEM PRACTICE',
    showVoiceLevels: true,
    summary: true,
    starSuggestion: 'Smooth transitions',
    openingScript: 'We are trying something new today. This lesson is partly a test of our new classroom system, so the activities are simple. You will see different modes on the board: sometimes you think quietly, sometimes you talk with a partner, and sometimes we listen together. I want to see whether this system makes our lessons easier and more fun.',
    stages: [
        {
            id: 'welcome-mission', title: 'Welcome mission', timeRange: '0–4 min', durationMinutes: 4,
            script: 'Just choose one. There is no correct answer. Keep it in your head for now.',
            notes: 'Let students begin immediately. Read the opening script briefly after they settle. Check whether students can read the board without extra explanation. No digital response is required.',
            frames: [
                { title: 'WELCOME TO YOUR FIRST MISSION', mode: 'think', voiceLevel: 0, lines: ['Today we are testing our new classroom system.'], choices: ['Sit in your place.', 'Bag under your desk.', 'Voice level 0.', 'Read the question.'], choiceLayout: 'grid', nextLabel: 'Read the question' },
                { title: 'If you could instantly become amazing at ONE skill, what would you choose?', mode: 'think', voiceLevel: 0, timerSeconds: 120, choices: skills, choiceLayout: 'grid', lines: ['Choose one in your head.', 'Do not call out yet.'], discussionId: 'skill' }
            ]
        },
        {
            id: 'first-system-test', title: 'First system test', timeRange: '4–7 min', durationMinutes: 3,
            script: 'Turn to a partner and tell them which skill you chose.',
            notes: 'Model the LISTEN screen briefly. Start the optional 45-second timer, then use the real Attention button. Resume shows the acknowledgement on the same step. Observe the transition without scoring compliance.',
            frames: [
                { title: 'System Test #1', mode: 'listen', voiceLevel: 0, quote: 'When this screen says LISTEN:', lines: ['Finish your sentence.', 'Face the board.', 'Listen for the next instruction.'], nextLabel: 'Try partner talk' },
                {
                    title: 'Turn to a partner and tell them which skill you chose.', mode: 'pair', voiceLevel: 2, timerSeconds: 45,
                    cue: 'Press the real Attention button.',
                    afterAttention: { title: 'Nice. That was our first system test.', mode: 'listen', voiceLevel: 0, lines: ['Next mission.'] }
                }
            ]
        },
        {
            id: 'would-you-rather', title: 'Would you rather?', timeRange: '7–12 min', durationMinutes: 5,
            script: 'Think first. Show one or two fingers. Then tell your partner why.',
            notes: 'Use think → respond → partner talk → Attention for each question. There are no correct answers. Mark a question discussed after the conversation, not just after showing it.',
            frames: [
                { title: 'Would you rather explore the deepest ocean 🌊 or outer space 🚀?', labels: ['Deepest ocean 🌊', 'Outer space 🚀'] },
                { title: 'Would you rather live near mountains ⛰️ or the sea 🌊?', labels: ['Mountains ⛰️', 'The sea 🌊'] },
                { title: 'Would you rather understand every language 🗣 or play every instrument 🎸?', labels: ['Every language 🗣', 'Every instrument 🎸'] }
            ].flatMap(preferenceRound)
        },
        {
            id: 'follow-sequence', title: 'Can you follow the sequence?', timeRange: '12–17 min', durationMinutes: 5,
            script: 'Stay in your seat. Watch for one instruction at a time.',
            notes: 'Reveal each action yourself. Students may point, imagine or adapt a movement if needed. Never ask them to move around, touch another student, or stand on furniture. Reveal D after responses, then discuss what helped.',
            frames: sequenceRounds()
        },
        {
            id: 'odd-one-out', title: 'Spot the odd one out', timeRange: '17–23 min', durationMinutes: 6,
            script: 'Think quietly. Show one, two, three or four fingers. Be ready to explain.',
            notes: 'Wait before revealing. The displayed answer is a suggestion; accept a different answer supported by a reasonable explanation. Observe whether students wait for the reveal and share without calling out.',
            frames: oddRounds.map(function(round, index) {
                return {
                    title: 'Which one does not belong?', kicker: 'Round ' + (index + 1) + ' of 4',
                    type: 'question', mode: 'think', voiceLevel: 0, discussionVoice: 2,
                    options: choices(round.items, true), answer: round.answer, suggested: true,
                    explanation: round.explanation, followUp: 'Can anyone defend a different answer?',
                    responseHint: 'Think quietly. Show 1, 2, 3 or 4 fingers.',
                    discussionId: 'odd-' + index, nextLabel: 'Next round'
                };
            })
        },
        {
            id: 'memory-challenge', title: 'Memory challenge', timeRange: '23–28 min', durationMinutes: 5,
            script: 'Look carefully. I will hide the items when we are ready.',
            notes: 'Use the optional 12-second timer. Nothing hides automatically. Tap Hide items, allow about 30 seconds of quiet recall, then invite partner talk. Reveal the same nine items yourself. There is no score for recall.',
            frames: [
                { title: 'Remember these nine items.', mode: 'think', voiceLevel: 0, type: 'memory', items: memoryItems, timerSeconds: 12, nextLabel: 'Hide items' },
                { title: 'How many can you remember?', mode: 'think', voiceLevel: 0, timerSeconds: 30, nextLabel: 'Tell your partner' },
                { title: 'Tell your partner.', mode: 'pair', voiceLevel: 2, timerSeconds: 30, lines: ['Which items can you remember?'], nextLabel: 'Reveal all nine items' },
                { title: 'Which item was easiest to remember?', mode: 'pair', voiceLevel: 2, type: 'memory', items: memoryItems, discussionId: 'memory', footnote: 'There is no right answer.' }
            ]
        },
        {
            id: 'quick-class-quiz', title: 'Quick class quiz', timeRange: '28–34 min', durationMinutes: 6,
            script: 'One finger for A. Two fingers for B. Wait for the reveal.',
            notes: 'Highlight either answer to discuss it. Reveal only when ready. Keep this noncompetitive: mistakes cost nothing. For the final question, avoid fixed learning-style labels; different tasks can benefit from different approaches.',
            frames: quiz.map(function(question, index) {
                return {
                    title: question.title, options: choices(question.labels), answer: question.answer,
                    explanation: question.explanation, type: 'question', mode: 'think', voiceLevel: 0,
                    timerSeconds: 30, kicker: 'Question ' + (index + 1) + ' of 6',
                    responseHint: '1 finger = A · 2 fingers = B', discussionId: 'quiz-' + index, nextLabel: 'Next question'
                };
            })
        },
        {
            id: 'system-challenge', title: 'System challenge', timeRange: '34–37 min', durationMinutes: 3,
            script: 'Let’s try the whole sequence: think, partner talk, Attention, then share.',
            notes: 'Allow about 20 seconds of thought and 30 seconds of partner talk. Use Attention before sharing. Invite volunteers; no need to call on every student. If stars are enabled, a possible manual acknowledgement is “Smooth transitions”.',
            frames: [
                { title: 'What was your favourite activity today?', kicker: 'FINAL SYSTEM TEST', mode: 'think', voiceLevel: 0, timerSeconds: 20, nextLabel: 'Partner talk' },
                { title: 'Tell your partner your answer.', mode: 'pair', voiceLevel: 2, timerSeconds: 30, cue: 'Use Attention before sharing.', nextLabel: 'After Attention: share with the class' },
                { title: 'Who would like to share?', mode: 'share', voiceLevel: 3, discussionId: 'favourite', nextLabel: 'Complete the system test' },
                { title: 'System test complete.', mode: 'listen', voiceLevel: 0, symbol: '✓' }
            ]
        },
        {
            id: 'exit-reflection', title: 'Exit reflection', timeRange: '37–40 min', durationMinutes: 3,
            script: 'Think about what helped. We will use this system in future lessons.',
            notes: 'Show one prompt at a time. Reveal the first two responses after thinking. The third is a preference, not a correct-answer question. Mark discussions you actually held. The summary counts shown steps and teacher-confirmed discussions, not individual learning or behaviour.',
            frames: [
                { title: 'When the Attention signal appears, what should happen?', kicker: 'Before we finish…', type: 'question', mode: 'think', voiceLevel: 0, answerText: 'Finish the thought, pause, and listen.', discussionId: 'exit-attention', nextLabel: 'Next reflection' },
                { title: 'Which classroom mode means partner discussion?', kicker: 'Before we finish…', type: 'question', mode: 'think', voiceLevel: 0, answerText: 'Talk with your partner.', discussionId: 'exit-mode', nextLabel: 'Next reflection' },
                { title: 'Which part of today’s system helped you most?', kicker: 'Before we finish…', type: 'opinion', mode: 'think', voiceLevel: 0, options: choices(['Timers', 'Attention signal', 'Visual instructions', 'Partner discussion', 'Something else']), discussionId: 'exit-preference', nextLabel: 'Finish together' },
                { title: 'MISSION COMPLETE', mode: 'listen', voiceLevel: 0, lines: ['Thank you for testing our new classroom system.', 'Check your space.', 'Listen for dismissal.'], final: true }
            ]
        }
    ]
};
