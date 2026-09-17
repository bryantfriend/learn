import { grade7Lessons } from './lessons/grade7a.js';
import { gpLessons } from './lessons/grade8-gp.js';
import { practiceLesson } from './lessons/system-practice.js';
/**
 * A lesson contains stages; each stage contains teacher-controlled frames.
 * A frame has a title, short instruction lines, a mode, and optional visual,
 * choices, question answer/explanation, timerSeconds and nextLabel.
 */
export const modes = {
    listen: { icon: '◉', label: 'Listen', voiceLevel: 0 },
    think: { icon: '◇', label: 'Think quietly', voiceLevel: 0 },
    pair: { icon: '↔', label: 'Talk with your partner', voiceLevel: 2 },
    share: { icon: '◎', label: 'Share with the class', voiceLevel: 3 }
};
const visual = 'schoolyard';
export const lesson = {
    id: 'ready-to-learn-v1',
    title: 'Ready to Learn: Notice, Think, Explain',
    durationMinutes: 40,
    stages: [
        {
            id: 'arrive', title: 'Arrive and begin', durationMinutes: 4, timeRange: '0–4 min',
            notes: 'Greet students, direct them to their places, and explain the task briefly. Students can respond with fingers when invited. Do not run a competition to see who finishes first. There is no correct answer to the opening question.',
            frames: [
                { title: 'Welcome, class.', mode: 'think', lines: ['Sit in your place.', 'Put your bag under your desk.', 'Think about the question.'], nextLabel: 'Show the question' },
                { title: 'What helps you learn?', mode: 'think', choices: ['Quiet thinking.', 'A helpful partner.', 'Clear instructions.'], lines: ['Choose one. Be ready to explain.'], footnote: 'Different answers are welcome.' }
            ]
        },
        {
            id: 'routines', title: 'Our three routines', durationMinutes: 3, timeRange: '4–7 min',
            notes: 'Suggested script: “This is a fresh start. We will have time to talk and time to listen. We will practise the routines so everyone can learn. You do not have to get every answer right.” Model each routine. Follow school policy for individual concerns; this app does not set sanctions.',
            frames: [
                { title: 'One voice during instructions.', mode: 'listen', kicker: 'Routine 1 of 3', nextLabel: 'Reveal routine 2' },
                { title: 'Stay in your agreed place for the task.', mode: 'listen', kicker: 'Routine 2 of 3', nextLabel: 'Reveal routine 3' },
                { title: 'Start the task, or ask for help.', mode: 'listen', kicker: 'Routine 3 of 3', lines: ['You do not have to get every answer right.'] }
            ]
        },
        {
            id: 'attention', title: 'Practise the attention signal', durationMinutes: 3, timeRange: '7–10 min',
            notes: 'Model the routine first. Start the optional short timer, then tap the actual Attention control. Resume returns to the same screen; tap “Show the routine” when ready. Allow reasonable processing time. Acknowledge students without embarrassing those who need another explanation. Handle continuing disruption individually according to school policy.',
            frames: [
                { title: 'Tell your partner one thing that helps you learn.', mode: 'pair', timerSeconds: 30, lines: ['Take turns.'], cue: 'Practise with the Attention button below.', nextLabel: 'After the signal: show the routine' },
                { title: 'When the signal appears:', mode: 'listen', lines: ['Finish your sentence.', 'Pause.', 'Listen.'], nextLabel: 'Practise once more' },
                { title: 'Tell your partner one thing you enjoy learning.', mode: 'pair', timerSeconds: 30, cue: 'Use Attention again, then resume.', nextLabel: 'After the signal: show the routine' },
                { title: 'When the signal appears:', mode: 'listen', lines: ['Finish your sentence.', 'Pause.', 'Listen.'] }
            ]
        },
        {
            id: 'notice', title: 'Notice or think?', durationMinutes: 5, timeRange: '10–15 min',
            notes: 'This is an original illustration, not a photograph of a real school. Keep explanations short and ask students what they can actually see. A puddle does not prove it rained. Invite a brief thinking pause before revealing another explanation.',
            frames: [
                { title: 'Observation', mode: 'listen', visual, lines: ['What the picture shows.'], quote: 'There is a puddle.', nextLabel: 'Introduce inference' },
                { title: 'Inference', mode: 'listen', visual, lines: ['A possible explanation.'], quote: 'It may have rained.', nextLabel: 'What does an inference need?' },
                { title: 'An inference needs evidence.', mode: 'listen', visual, lines: ['It might still be wrong.'], nextLabel: 'Ask another question' },
                { title: 'Could the puddle have another explanation?', mode: 'think', visual, nextLabel: 'Reveal one possibility' },
                { title: 'Someone may have spilled water.', mode: 'listen', visual, lines: ['That is another possible explanation.'] }
            ]
        },
        {
            id: 'pair-share', title: 'Think, pair, share', durationMinutes: 7, timeRange: '15–22 min',
            notes: 'Think for about 1 minute; partners talk for about 3 minutes; share for about 3 minutes. Use Attention between partner talk and whole-class sharing, then advance when ready. Allow pointing, a short phrase, or a partner sharing an idea. No one needs to come to the board.',
            frames: [
                { title: 'Find two things you can see.', mode: 'think', visual, timerSeconds: 60, quote: 'I can see…', nextLabel: 'Move to partner talk' },
                { title: 'Share your observations.', mode: 'pair', visual, timerSeconds: 180, lines: ['Suggest one possible explanation.'], quote: 'I think… because…', cue: 'Use Attention before moving to class sharing.', nextLabel: 'After Attention: share with the class' },
                { title: 'Do we see it, or are we explaining it?', mode: 'share', visual, timerSeconds: 180, lines: ['One person speaks.', 'Others listen.'] }
            ]
        },
        {
            id: 'questions', title: 'See it or think it?', durationMinutes: 8, timeRange: '22–30 min',
            notes: 'Students can show one or two fingers, or use an agreed gesture, from their seats. Begin with quiet thinking, then invite discussion. Select A or B to discuss that response; this is not a vote count or a score. Only Reveal explanation shows the key. Keep the illustration visible as evidence.',
            frames: [
                { title: 'There is a puddle on the path.', answer: 'A', explanation: 'We can see the puddle.' },
                { title: 'It rained earlier.', answer: 'B', explanation: 'Rain is a possible explanation, but the picture does not prove it.' },
                { title: 'The bench is beside the tree.', answer: 'A', explanation: 'We can see where the bench is.' },
                { title: 'Someone left the umbrella behind.', answer: 'B', explanation: 'We can see the umbrella, but we do not know why it is there.' },
                { title: 'There are no people in the picture.', answer: 'A', explanation: 'No people are shown.' },
                { title: 'The school is closed today.', answer: 'B', explanation: 'An empty picture does not prove that the school is closed.' }
            ].map(function(question, index) {
                return { ...question, mode: 'think', type: 'question', visual, timerSeconds: 80, kicker: 'Question ' + (index + 1) + ' of 6', nextLabel: 'Next question' };
            })
        },
        {
            id: 'mistake', title: 'Spot my mistake', durationMinutes: 5, timeRange: '30–35 min',
            notes: 'Allow quiet thinking before discussion. Accept other sensible explanations. The model sentence is one example, not the only valid answer. Encourage evidence and careful language rather than guessing what the teacher wants.',
            frames: [
                { title: 'What is the mistake?', mode: 'think', visual, kicker: 'Mr. Friend says:', quote: '“There is a puddle, so it definitely rained.”', nextLabel: 'Reveal the observation' },
                { title: 'The puddle is an observation.', mode: 'share', visual, nextLabel: 'Reveal the explanation' },
                { title: 'Rain is only one possible explanation.', mode: 'share', visual, nextLabel: 'Improve the sentence' },
                { title: 'Improve the sentence.', mode: 'share', visual, nextLabel: 'Reveal a model response' },
                { title: 'One possible response', mode: 'share', quote: 'There is a puddle. It may have rained, but the water could have come from somewhere else.', lines: ['Other sensible explanations are welcome.'] }
            ]
        },
        {
            id: 'exit', title: 'Exit and finish', durationMinutes: 5, timeRange: '35–40 min',
            notes: 'Allow quiet thinking, then a short partner response before inviting a few volunteers to share. Use the working-mode control if moving to partner talk or sharing. Advance each prompt yourself. The timer never dismisses the class; finish with your own dismissal instruction.',
            frames: [
                { title: 'One observation I made was…', mode: 'think', lines: ['Think first. Then share when invited.'], nextLabel: 'Next reflection' },
                { title: 'One possible explanation was…', mode: 'share', nextLabel: 'Reflect on our routine' },
                { title: 'When the attention signal appears, I will…', mode: 'share', nextLabel: 'Finish together' },
                { title: 'Thank you for learning together.', mode: 'listen', lines: ['Check your space.', 'Listen for dismissal.'], final: true }
            ]
        }
    ]
};

export const lessons = [lesson, practiceLesson, ...gpLessons, ...grade7Lessons];
export function getLesson(id) {
    return lessons.find(function(item) { return item.id === id; }) || null;
}
export function questionOptions(frame) {
    if (frame.options) return frame.options;
    if (frame.answerText) return [];
    if (frame.type !== 'question') return [];
    return [
        { id: 'A', label: 'Observation: the picture shows it.' },
        { id: 'B', label: 'Inference: a possible explanation.' }
    ];
}
