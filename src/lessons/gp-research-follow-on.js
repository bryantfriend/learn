// Teacher-created follow-on from the Year 8 closing-page photo received 2026-10-08.
// This is not a transcription of the next workbook lesson; all work is in notebooks.
const frame = (title, mode, lines, extra = {}) => ({ title, mode, lines,
  footnote: 'Teacher-created follow-on · write in your notebook', ...extra });
const question = (title, lines, explanation) => frame(title, 'think', lines,
  { type: 'question', answerText: 'Compare your reasoning', explanation });
const stages = [
  { id: 'begin', title: 'Use your chosen question', durationMinutes: 4,
    notes: 'Start from the best question and reflection pupils completed on the photographed closing page of Research Lesson 1. If unfinished, allow two minutes to finish that reflection before recalling the question. Use the existing question rather than requiring a new topic.', frames: [
      frame('Bring your research question forward', 'think', ['Open your completed Research Lesson 1 work.', 'Copy your chosen question into your notebook.', 'Name one change you made and why it improved the question.']),
      frame('Today: make an evidence plan', 'listen', ['I can match a question to evidence.', 'I can compare perspectives fairly.', 'I can explain a limitation of my plan.'])
    ] },
  { id: 'model', title: 'Match evidence to the question', durationMinutes: 8,
    notes: 'Model the difference between quantity and reasons. These are hypothetical methods, not evidence already collected. Pupils need no internet or real food-handling activity. Explain evidence (information supporting an answer), method (how it is gathered), and limitation (what it cannot establish).', frames: [
      frame('Two questions need different evidence', 'listen', ['“How much lunch is left?” needs a recorded amount and a clear time period.', '“Why do pupils leave lunch?” needs their reasons, collected with neutral questions.', 'A count alone cannot tell us what people think.']),
      question('Does this method answer the question?', ['Question: Why do pupils leave some lunch?', 'Plan: count the plates with leftovers.', 'What can this count tell us? What is missing?'], 'The count shows how many observed plates had leftovers. It does not tell us why. Neutral pupil questions could explore reasons; observations and pupil reports each have limits.'),
      frame('A plan in four columns', 'listen', ['What do I need to find out?', 'What evidence could help, and how would I obtain it?', 'What would this evidence still leave uncertain?'])
    ] },
  { id: 'guided', title: 'Test claims and perspectives', durationMinutes: 8,
    notes: 'Read the fictional evidence card aloud. Give thinking time before revealing. Do not generalise from volunteers or treat stakeholder roles as fixed opinions. A perspective is a viewpoint, not proof that its proposal works. National/global comparisons are plans to seek evidence, not findings.', frames: [
      frame('Fictional practice evidence', 'think', ['Ten volunteers answer a lunch survey.', 'Six say their portions are too large; four give other reasons.', 'These are invented responses for practice.']),
      question('How far can we take this claim?', ['Claim: “Large portions cause food waste across our country.”', 'Do ten volunteers justify a national claim?', 'Rewrite it to fit our practice evidence.'], 'Six of ten volunteers reported oversized portions. This does not establish national views or prove that smaller portions reduce waste. Volunteers may differ from other pupils.'),
      frame('Compare possible viewpoints', 'pair', ['One pupil may want smaller first portions with seconds available.', 'A cook may ask whether serving seconds is practical.', 'What evidence would help judge both concerns fairly?'])
    ] },
  { id: 'apply', title: 'Build your own evidence plan', durationMinutes: 12,
    notes: 'Use about six minutes for the plan, three for peer feedback and three for revision. Pupils plan only; no survey, interviews or internet searches are required. For a report question, distinguish local evidence from a national claim and name relevant evidence to seek from another country. A second country is a comparison, not automatically representative of the world. Support: start with two rows and oral rehearsal. Stretch: explain how differences between schools could limit comparisons.', frames: [
      frame('Plan evidence for your question', 'think', ['Draw four columns: need to know; evidence; method or source; limitation.', 'Add two or three rows for your chosen question.', 'Include evidence that could challenge your first idea.']),
      frame('Add perspectives and comparisons', 'think', ['Name two possible viewpoints and the reasons to investigate.', 'What evidence from Kyrgyzstan could help?', 'What relevant evidence from another country could you compare?']),
      frame('Swap, question, improve', 'pair', ['Partner: does each method answer the question?', 'Point out one assumption or gap.', 'Revise one row and explain why the change helps.'])
    ] },
  { id: 'check', title: 'Defend a first research step', durationMinutes: 4,
    notes: 'Ask pupils to explain their own first step, not copy the model. Look for a method tied to the chosen question and a specific limitation. Assess the plan, not whether they share the teacher’s initial view.', frames: [
      question('Is one interview enough?', ['A school report question asks whether smaller portions should be prioritised.', 'A pupil plans to interview one friend and use that as the whole report.', 'What is missing? Suggest a stronger plan.'], 'One friend offers one experience. Seek a wider range of pupils’ views, relevant waste records and practical concerns, and compare suitable national and international evidence. None alone guarantees a conclusion; explain sample and setting limits.'),
      frame('Explain your first step', 'pair', ['“I would seek ___ because my question asks ___.”', '“This could help show ___, but cannot establish ___.”'])
    ] },
  { id: 'finish', title: 'Reflect and choose your next step', durationMinutes: 4,
    notes: 'Collect the notebook plan as the lesson outcome. Check a relevant method, two perspectives, an evidence-based revision and a limitation. An appropriate exit identifies evidence that could change the pupil’s view. The next workbook lesson/pages remain unverified until supplied by the teacher.', frames: [
      frame('Show what changed', 'think', ['Which discussion or evaluation improved your evidence plan? Explain why.', 'How did you use communication, collaboration or reflection?', 'Give one specific example from today.']),
      frame('Exit: what could change your view?', 'think', ['Write your first research step and one limitation.', 'Name evidence that could make you rethink your current view.', 'Keep the plan beside your chosen question.']),
      frame('Evidence plan complete', 'listen', ['Keep your notebook and workbook for the next lesson.'], { final: true })
    ] }
];
function timeStages(stages, label) {
 let elapsed = 0;
 for (const stage of stages) {
  stage.timeRange = `${elapsed}–${elapsed + stage.durationMinutes} min`;
  elapsed += stage.durationMinutes;
  const weights = stage.frames.map(f => f.final ? 1 : f.mode === 'listen' ? 2 : 4);
  const total = weights.reduce((a, b) => a + b, 0);
  let remaining = stage.durationMinutes * 60;
  stage.frames.forEach((f, i) => {
    const seconds = i === stage.frames.length - 1 ? remaining : Math.floor(stage.durationMinutes * 60 * weights[i] / total / 15) * 15;
    remaining -= seconds;
    f.timerSeconds = seconds; f.expectedSeconds = seconds;
    f.kicker = `${label} · After Research Lesson 1 · Evidence planning`;
  });
 }
 return stages;
}
const sevenAStages = [
  { id: 'begin', title: 'Return to your improved questions', durationMinutes: 4,
    notes: 'The latest 7A photos show Book 8 Research Lesson 1 pp. 4–7. Bring forward one of the three questions reworded in p. 6 task 4. If pupils have not finished, give two minutes to reword one question and explain why; do not assume photographed blank spaces prove completed work. Keep their existing topic. Today is teacher-created notebook practice following that sequence, not the next printed lesson.', frames: [
      frame('Choose one question to investigate', 'think', ['Open your Research Lesson 1 work on page 6.', 'Copy one improved question into your notebook.', 'Tell a partner why it is clearer or fairer now.']),
      frame('Today: plan how to find out', 'listen', ['I can choose a method that fits my question.', 'I can write a fair question to ask people.', 'I can explain what my plan cannot tell me.'])
    ] },
  { id: 'model', title: 'Choose a way to find out', durationMinutes: 8,
    notes: 'Use school lunch waste as an original practice topic, not a claim about this school. Observation means looking carefully and recording; a survey asks the same questions to several people; a written source provides recorded information. Read these terms aloud. A method can help answer part of a question without answering it all. No food handling or actual data collection is required.', frames: [
      frame('Three ways to collect information', 'listen', ['Observe and record: what happens?', 'Ask people fairly: what do they think or report?', 'Read a relevant source: what information is already recorded?']),
      question('Which method fits?', ['Question: Why do pupils leave some lunch?', 'Would counting plates tell us their reasons?', 'Suggest a better way to find out.'], 'Counting plates can record leftovers, but not explain reasons. Neutral questions to a range of pupils could help. Their answers describe what they report; other evidence may still be needed.'),
      frame('See a simple plan', 'listen', ['Question: What makes pupils leave part of lunch?', 'Method: ask several pupils the same neutral question.', 'Limit: a few answers may miss other pupils’ experiences.'])
    ] },
  { id: 'guided', title: 'Make your questions fair', durationMinutes: 8,
    notes: 'Connect to the five checks on p. 5 and the non-leading criterion on p. 6. Explain leading as wording that pushes toward an answer. Pupils rehearse with a partner using invented answers; they do not run a real survey today. Accept several fair versions. A clear research question and an interview question can serve different purposes.', frames: [
      question('Repair this question', ['“Don’t you agree our school lunches are awful?”', 'What answer does it push people toward?', 'Rewrite it so different views are possible.'], 'It pushes toward a negative answer. Try: “What do you think about school lunches, and why?” A fair question leaves room for positive, negative or mixed views.'),
      frame('Practise asking and listening', 'pair', ['A: ask your fair question. B: invent a possible response.', 'A: listen, then ask “Can you explain why?”', 'Swap roles. Did either question suggest the answer?']),
      frame('Check a source before using it', 'think', ['Who made it, and how did they find out?', 'Does it help answer your question?', 'What information or viewpoint might be missing?'])
    ] },
  { id: 'apply', title: 'Write your research plan', durationMinutes: 12,
    notes: 'Allow six minutes to write, three to exchange feedback and three to revise. Use pupils’ own topic and question. Support: orally rehearse each sentence before writing; start with one method. Stretch: combine two methods and explain what each adds. Plans to ask people must avoid private details and allow people to decline. No internet, printing or real interviews are needed.', frames: [
      frame('Make a plan in your notebook', 'think', ['Write: My question is … I need to find out …', 'My method or source will be … because …', 'This could tell me … but may not tell me …']),
      frame('Prepare your first research step', 'think', ['If asking people: write two neutral questions.', 'If observing: say what you would record and when.', 'If reading: name the information and source you would seek.']),
      frame('Give feedback that helps', 'pair', ['Does the method fit the research question?', 'Is the wording fair? Whose experience might be missing?', 'Revise one part of your plan and explain the change.'])
    ] },
  { id: 'check', title: 'Keep claims within the evidence', durationMinutes: 4,
    notes: 'Use the fictional card as supplied classroom evidence, not a real survey. Assess whether pupils restrict the claim to the respondents. A broader sample could improve coverage, but does not automatically prove what everyone thinks.', frames: [
      frame('Fictional practice evidence', 'think', ['Four friends answer a lunch question.', 'Three report that portions are too large.', 'These are invented answers for this activity.']),
      question('Can we say everyone agrees?', ['Claim: “Everyone at school wants smaller portions.”', 'Do four friends support this claim?', 'Write a claim that fits the information.'], 'Three of these four friends reported that portions were too large. We cannot speak for everyone at school. Their responses also do not establish that they all want smaller portions.'),
      frame('Defend your plan', 'pair', ['Name your first step and why it fits.', 'Explain one thing it may leave unanswered.'])
    ] },
  { id: 'finish', title: 'Reflect on your progress', durationMinutes: 4,
    notes: 'Follow the reflection structure visible on p. 7: independent work, partner work, whole-class discussion and writing; communication, collaboration, evaluation and reflection. These are notebook reflections on today’s follow-on, not repeated workbook tasks. Ask pupils to give examples of actual learning. Collect one focused question, a relevant method, fair wording where appropriate and a limitation.', frames: [
      frame('What helped you learn today?', 'think', ['Working alone, with a partner, as a class, or writing?', 'Choose what helped you and explain why.', 'Give an example from your plan.']),
      frame('Show another skill you used', 'think', ['Choose communication, collaboration, evaluation or reflection.', 'Explain how you used it today.', 'Exit: write your first research step and one limitation.']),
      frame('Your research plan is ready', 'listen', ['Keep your plan with your improved research question.'], { final: true })
    ] }
];
const sevenBStages = [
  { id: 'begin', title: 'Recall your class question', durationMinutes: 4,
    notes: 'The 7B photographs show the ranking continuation, mind map, three chosen questions, reasons, best class question and reflection from Book 7 Research Lesson 1. These match the existing pp. 4–6 sequence; page numerals are cropped or unclear in the new photos. Blank answer spaces do not show whether pupils have finished. Use their actual class question; if absent, spend two minutes choosing one from their three questions. Keep the existing topic. Today is teacher-created notebook practice, not a transcription of the partly visible next lesson.', frames: [
      frame('Find the question you chose', 'think', ['Open your Research Lesson 1 work.', 'Read your best class question and its reason.', 'Copy the question into your notebook.']),
      frame('Today: choose how to find out', 'listen', ['I can choose information that helps my question.', 'I can ask a fair question and listen.', 'I can say one thing I still need to find out.'])
    ] },
  { id: 'model', title: 'Look, ask or read?', durationMinutes: 8,
    notes: 'Use school break spaces as an original modelling topic, consistent with the existing 7B workbook trial. Explain information as something we can use to help answer a question. Observe means look carefully and record. Asking people can reveal reported needs; counting cannot establish their reasons. No internet, worksheets or actual playground survey are needed.', frames: [
      frame('Different questions need different information', 'listen', ['How many benches? Look and count.', 'Why do pupils want a quiet space? Ask and listen.', 'When may pupils use the library? Read the school rules.']),
      question('Can counting tell us why?', ['Question: Why do pupils avoid a break space?', 'Plan: count the benches there.', 'What other information would help?'], 'A bench count does not explain pupils’ reasons. Ask pupils a fair question about how they use the space. Their answers may differ; listen to more than one person.'),
      frame('A first step that fits', 'listen', ['Question: What helps pupils read quietly at break?', 'First step: ask where they read and what helps.', 'Still unknown: whether the same place works for everyone.'])
    ] },
  { id: 'guided', title: 'Ask without choosing the answer', durationMinutes: 8,
    notes: 'Explain fair wording in everyday language: let people give their own answer. This extends the photographed checks about importance, scope and possible information. Do not describe it as an additional printed criterion. Practise with invented replies rather than collect personal information. Model listening and reporting accurately.', frames: [
      question('Which question lets people choose?', ['A: “Everyone wants football, don’t they?”', 'B: “What do you like doing at break, and why?”', 'Choose one and explain your reason.'], 'B allows different activities and reasons. A pushes people toward football and assumes everyone agrees. A fair question lets people give their own answer.'),
      frame('Try a fair question with a partner', 'pair', ['A: ask “What helps you enjoy break time?”', 'B: invent a reply. A: listen and repeat its meaning.', 'Swap roles. Check that you heard the reason correctly.']),
      frame('Improve your own wording', 'think', ['Write one question you could ask about your topic.', 'Does it allow different answers?', 'Change a word if it pushes people toward your view.'])
    ] },
  { id: 'apply', title: 'Make a small information plan', durationMinutes: 12,
    notes: 'Allow five minutes for the plan, four for partner rehearsal and three for revision. Use pupils’ chosen question, not an imposed replacement. Support: oral rehearsal then copy sentence starters; one method is sufficient. Stretch: add a second method and explain what it adds. Replies are invented practice and must not be recorded as real findings. Plans involving people should allow them to decline and avoid private details.', frames: [
      frame('Write three planning sentences', 'think', ['My research question is …', 'I could look, ask or read … because …', 'This could help me find out …']),
      frame('Practise your first step', 'pair', ['If asking: try a fair question with an invented reply.', 'If looking: describe what you would count or record.', 'If reading: say what information you would look for.']),
      frame('Use your partner’s feedback', 'think', ['Does your first step help answer the question?', 'Improve one part of your plan.', 'Add: “I would still need to find out …”'])
    ] },
  { id: 'check', title: 'Say only what the information shows', durationMinutes: 4,
    notes: 'Read the fictional practice results aloud. Assess accurate reporting and awareness of missing voices. A count of preferences does not prove which provision is best or why people prefer it. Do not label classmates with these invented responses.', frames: [
      frame('Invented break-time replies', 'think', ['Three imaginary pupils answer a question.', 'Two prefer quiet reading; one prefers a ball game.', 'These are practice replies, not our class results.']),
      question('Does everyone prefer reading?', ['A pupil says: “Everyone wants quiet reading.”', 'Does that fit the three replies?', 'What could we say instead?'], 'Two of these three imaginary pupils prefer quiet reading; one prefers a ball game. We cannot speak for everyone. Ask a wider range of pupils to understand other needs.')
    ] },
  { id: 'finish', title: 'Explain what helped you learn', durationMinutes: 4,
    notes: 'Use the photographed reflection options: working alone, with a partner, whole-class discussion and writing. The book also asks for other skills used without supplying a fixed list; communication and collaboration here are teacher-created examples. Reflect on today’s notebook practice. Check a chosen question, a fitting first step and an unanswered point. Use honest evidence of progress, not a compulsory achieved tick.', frames: [
      frame('What helped today?', 'think', ['Working alone, with a partner, as a class, or writing?', 'Choose what helped and explain why.', 'Give one example from your plan or practice.']),
      frame('Your next step', 'think', ['Name another skill you used, such as listening or teamwork.', 'Write your first step and why it helps your question.', 'Name one thing you still need to find out.']),
      frame('Your information plan is ready', 'listen', ['Keep the plan with your research question.'], { final: true })
    ] }
];
export const researchFollowOnLessons = [{
  id: 'gp-books-8-research-evidence-plan', title: 'Next lesson · From question to evidence plan',
  durationMinutes: 40, coreMinutes: 40, contentRevision: 1,
  gp: true, bookTrial: true, customVisuals: true, summary: true,
  eyebrow: '8th Grade · Teacher-created research follow-on', bookNumber: 9,
  catalog: { subjectId: 'global-perspectives-books', grades: [8], classes: ['8'],
    unit: 'After Research Lesson 1 · Notebook practice', order: 3 },
  openingScript: 'Continue from the best-question discussion and reflection shown in the teacher’s Year 8 photograph. Use pupils’ existing questions to build a feasible evidence plan. Bring the workbook, notebook and pencil. No printing or student internet is needed. This teacher-created bridge does not assign unseen workbook pages.',
  stages: timeStages(stages, 'Year 8')
}, {
  id: 'gp-books-7a-research-method-plan', title: 'Next lesson · Plan how to answer your question',
  durationMinutes: 40, coreMinutes: 40, contentRevision: 1,
  gp: true, bookTrial: true, customVisuals: true, summary: true,
  eyebrow: '7A · Teacher-created research follow-on', bookNumber: 8,
  catalog: { subjectId: 'global-perspectives-books', grades: [7], classes: ['7a'],
    unit: 'After Research Lesson 1 · Notebook practice', order: 3 },
  openingScript: 'Continue from the Research Lesson 1 sequence shown in the teacher’s 7A photographs, pp. 4–7. Use one of the questions pupils improved on p. 6 to plan a suitable method, practise neutral questioning and explain a limitation. Bring the workbook, notebook and pencil. All new work goes in the notebook. This is teacher-created follow-on practice; next workbook pages have not been supplied.',
  stages: timeStages(sevenAStages, '7A')
}, {
  id: 'gp-books-7b-research-information-plan', title: 'Next lesson · Choose how to find out',
  durationMinutes: 40, coreMinutes: 40, contentRevision: 1,
  gp: true, bookTrial: true, customVisuals: true, summary: true,
  eyebrow: '7B · Teacher-created research follow-on', bookNumber: 7,
  catalog: { subjectId: 'global-perspectives-books', grades: [7], classes: ['7b'],
    unit: 'After Research Lesson 1 · Notebook practice', order: 3 },
  openingScript: 'Continue from the best class question and reflection shown in the teacher’s 7B photographs. Use the chosen question to select information, practise asking fairly and plan a small first step. Bring the workbook, notebook and pencil. No printing or student internet is needed. New work goes in the notebook; the next printed lesson is not sufficiently visible to assign its tasks.',
  stages: timeStages(sevenBStages, '7B')
}];
