// Based on the teacher's photographed Research Lesson 1, received 2026-09-28.
// Photo provenance and page sequencing: docs/gp-workbook-trial.md.
// Original supporting examples are distinct from the students' printed tasks.
export const workbookSubjectId = 'global-perspectives-books';
const frame = (title, mode, lines = [], extra = {}) => ({ title, mode, lines, ...extra });
const talk = (title, lines, id) => frame(title, 'pair', lines, { discussionId: id });
const book = (page, activity, lines) => frame(activity, 'think', lines, {
  bookTask: { page, activity }, footnote: `WRITE IN YOUR BOOK · p. ${page} · ${activity}`
});
const example = (title, lines) => frame(title, 'listen', lines, { footnote: 'Teacher-created example · practise orally or in your notebook.' });
const reveal = (title, lines, explanation, id) => frame(title, 'think', lines, {
  type: 'question', answerText: 'A possible explanation', explanation, discussionId: id,
  footnote: 'Teacher-created practice · explain before revealing.'
});
const stage = (id, title, minutes, notes, frames) => ({ id, title, durationMinutes: minutes, notes, frames });
const supplies = 'Have the correct Learner’s Skills Book, a pencil and a notebook for extra practice. No photocopies or student internet access are needed. Give thinking time before showing model responses. The numbered objectives 1.1/1.2 are not separate lesson numbers. These two classroom parts teach the printed Research Lesson 1.';
const support = 'Support: read the task aloud, explain one word at a time, let pupils rehearse orally, then write their own answer. Stretch: justify the scope, name a feasible source, and explain a limitation. Accept different questions and reasoned judgements; the on-screen models are not an official Cambridge answer key.';
const topic7 = 'School break spaces';
const topic8 = 'School lunch waste';
const topic9 = 'Food waste in schools';

function reserve(title, source, lines, outcome, model) {
  return { title, minutes: 5, sourceTitle: 'Extra teacher-created practice', source, lines, outcome, model };
}
function finishLesson({ classId, label, bookNumber, part, pages, title, objective, stages, extras, notes }) {
  const reference = `Book ${bookNumber} · Research Lesson 1 · Part ${part}`;
  const ending = stages.pop();
  extras.forEach((extra, i) => stages.push(stage(`reserve-${i + 1}`, `Optional: ${extra.title}`, 5,
    'Optional five-minute practice. For a 40-minute lesson, use the stage menu to jump to Reflect and finish. ' + extra.outcome + '\nSuggested response: ' + extra.model,
    [frame(extra.title, 'pair', extra.source, { footnote: 'Optional practice · use your notebook, not a new workbook task.' }),
      reveal('Try it, then compare', extra.lines, extra.model, `reserve-${i + 1}`)])));
  stages.push(ending);
  let elapsed = 0;
  for (const s of stages) {
    s.timeRange = `${elapsed}–${elapsed + s.durationMinutes} min`; elapsed += s.durationMinutes;
    s.notes += '\n' + support;
    // Each suggested timer accounts for pupil thinking/writing, not just slide reading.
    const weights = s.frames.map(f => f.final ? 1 : f.bookTask ? 6 : f.mode === 'listen' ? 2 : 4);
    const total = weights.reduce((a, b) => a + b, 0);
    let remaining = s.durationMinutes * 60;
    s.frames.forEach((f, i) => {
      const seconds = i === s.frames.length - 1 ? remaining : Math.max(15, Math.floor(s.durationMinutes * 60 * weights[i] / total / 15) * 15);
      remaining -= seconds;
      f.expectedSeconds = seconds; f.timerSeconds = seconds;
      f.kicker = reference + (f.bookTask ? ` · p. ${f.bookTask.page}` : '');
    });
  }
  return {
    id: `gp-books-${classId}-research-1-part-${part}`, title: `Part ${part} · ${title}`,
    durationMinutes: elapsed, coreMinutes: 40, contentRevision: 1, bookTrial: true,
    gp: true, customVisuals: true, summary: true, eyebrow: `${label} · ${reference}`,
    bookNumber, workbookLesson: 'Starting with research skills: Lesson 1', bookPages: pages,
    catalog: { subjectId: workbookSubjectId, grades: [classId === '8' ? 8 : 7], classes: [classId], unit: `Book ${bookNumber} · pp. ${pages}`, order: part },
    openingScript: `${objective}\n${supplies}\n${notes}\n40-minute route: skip the two Optional stages using the stage menu and keep Reflect and finish. Use one optional stage for 45 minutes or both for 50.`,
    pacingNote: '40-minute core + two optional five-minute practice stages. Skip optional stages using the stage menu; keep the final reflection. Times include student work.',
    extensions: extras, stages
  };
}

function sevenPart1() {
  return finishLesson({ classId: '7b', label: '7B', bookNumber: 7, part: 1, pages: '3–4',
    title: 'What makes a useful research question?', objective: 'Explain research and use interest, scope and available evidence to judge questions.',
    notes: 'Read the learning goals on p. 2. Today completes prior learning and the starter on pp. 3–4. Leave the mind map on p. 5 for Part 2. Page 4 was included in 7A.zip; the Book 8 overview in 7BC.zip is not part of this book.',
    stages: [
      stage('begin', 'Open the book and think', 4, 'Ask for an initial definition before teaching it. Do not mark the goals achieved at the start.', [
        frame('Open Book 7 at page 3', 'listen', ['Find “Starting with research skills: Lesson 1”.', 'Today: judge questions. Next lesson: write your own.', 'You will write in your book on pages 3 and 4.']),
        book(3, 'Prior learning', ['Write what you think research means.', 'You can begin: “Research is finding out …”', 'Keep this first idea so you can improve it later.'])
      ]),
      stage('model', 'Research needs a question', 8, 'Research involves gathering and examining information to answer a question. Copying a sentence alone is not enough. A simple factual question can be useful, even if it is too small for an extended enquiry.', [
        example('A guess or research?', ['Guess: “Everyone wants a longer break.”', 'Research: ask pupils, observe break time and compare what you find.', 'Use the evidence to answer a clear question.']),
        reveal('Which pupil is researching?', ['Mina guesses what games pupils like.', 'Aziz asks pupils which games they use and records their answers.'], 'Aziz gathers information. Mina has an idea to test, but a guess is not evidence. Aziz must also ask a fair range of pupils.', 'research-or-guess'),
        example('Three useful checks', ['Does the question matter to people?', 'Is it focused enough to investigate?', 'Can we find information to answer it?']),
        example('Make a large question smaller', ['Too large: “How can we improve every school?”', 'More focused: “How could our school make break time better for pupils who want a quiet space?”', 'We could ask pupils and observe how spaces are used.'])
      ]),
      stage('guided', 'Practise judging questions', 8, 'Ask pairs to name the problem before revealing an improvement. Broad means too much to cover; vague means unclear. A narrow factual question can be a helpful first step but may offer little discussion.', [
        reveal('What is unclear?', ['“Is it better?”', 'What would you need to know before answering?'], 'We do not know what “it” means or what “better” measures. Try: “Which break-time space helps our pupils read quietly?”', 'vague'),
        reveal('Does this question already choose a side?', ['“Why are all computer games a waste of time?”'], 'It assumes every game is a waste of time. A fairer question is: “What benefits and problems do pupils report when playing computer games?”', 'leading'),
        reveal('Is a short answer always useless?', ['“How many benches are in our playground?”', '“Would more benches help pupils use the playground?”'], 'Counting benches is useful background evidence. The second question needs more evidence about pupils’ needs, space and cost. Both can help at different stages.', 'narrow'),
        talk('Repair one question together', ['Choose: “What is sport?” or “Why is homework terrible?”', 'Make it clearer and fairer.', 'Name one person or source that could help answer it.'], 'repair')
      ]),
      stage('workbook', 'Rank the book’s four questions', 12, 'Book p. 3 Starter task 1 has A school starting age, B removing sugar, C poverty, D social networking being bad. A defensible initial order is B, A, C, D, but do not require that order. B allows debate but “all sugar” needs clarification; A needs a country/context and may be a quick fact; C is a definition and very wide for an enquiry; D assumes harm. Assess reasons, not the chosen order. Do not turn this into dietary advice.', [
        book(4, 'Starter activity · task 1 answer lines', ['Read questions A–D at the bottom of page 3.', 'Rank them from most useful to least useful.', 'Use the four answer lines at the top of page 4.']),
        talk('Test your ranking', ['For each question: does it matter, is it focused, and can we find evidence?', 'Use task 2a–c on page 4.', 'A different order is welcome if you can explain it.'], 'book-ranking'),
        book(4, 'Starter activity · task 3', ['Compare your order with a partner.', 'Write your final order and your reason.', 'Explain whether classmates agreed and why.'])
      ]),
      stage('check', 'Explain a change', 4, 'Invite examples of revisions to the printed questions. An example, not a mandatory answer: “How do social networking sites affect friendships among pupils aged 11–13?” It still needs feasible sources and fair sampling.', [
        reveal('Improve the social networking question', ['The book asks why social networking sites are bad.', 'How could you investigate benefits as well as problems?'], 'Try: “What benefits and problems do pupils report when using social networking sites?” Ask a fair range of pupils and compare their experiences. Do not collect private accounts or messages.', 'transfer'),
        talk('Show the evidence for your judgement', ['Read one reason you wrote on page 4.', 'Point to the word or feature in the question that supports your reason.'], 'reason')
      ]),
      stage('finish', 'Reflect and finish', 4, 'Check that p. 4 contains a reason, not just four letters. Keep the p. 6 final reflection for Part 2.', [
        frame('Before you close your book', 'think', ['In your notebook: explain research in one sentence.', 'Name one feature you will check when writing a question.', 'Next time: bring Book 7 for pages 5–6.']),
        frame('Part 1 complete', 'listen', ['Keep your ranking and reasons.', 'Listen for the next instruction.'], { final: true })
      ])
    ], extras: [
      reserve('The mystery question', ['“Why do they do that?”', '“Why do pupils leave the reading area during break?”'], ['Explain which question is clearer.', 'Improve the unclear question.', 'Name information you would collect.'], 'Write a focused question with a possible source.', 'The second names the people, action and setting. An observation and voluntary pupil comments could help; do not assume the reason beforehand.'),
      reserve('A question for a new topic', ['Topic: getting to school.', 'A quick count can tell us how pupils travel, but not why.'], ['Write a useful factual question.', 'Write a question that needs reasons.', 'Explain how the two could work together.'], 'Distinguish background facts from a larger enquiry.', '“How many pupils walk?” gives a count. “What makes walking to school easier or harder?” explores reasons. Counts and pupil comments answer different parts of the enquiry.')
    ] });
}

function sevenPart2() {
  return finishLesson({ classId: '7b', label: '7B', bookNumber: 7, part: 2, pages: '5–6',
    title: 'Write and improve your research questions', objective: 'Generate questions, choose three using reasons, and reflect on the way you learned.',
    notes: 'Follow on from pp. 3–4. Use the teacher-chosen topic School break spaces in the book’s topic line. This is still printed Research Lesson 1. Return to the goals table on p. 3 at the end.',
    stages: [
      stage('begin', 'Recall and choose the topic', 4, 'Have pupils use their own work from Part 1. The topic is supplied because the printed activity intentionally leaves it for the teacher.', [
        frame('Open Book 7 at page 5', 'think', ['Recall the three checks: important, focused, answerable.', 'Tell a partner one improvement you made last lesson.']),
        book(5, 'Main activity · topic line', [`Write: ${topic7}.`, 'Think about places for games, talking, resting and reading.'])
      ]),
      stage('model', 'See a question grow', 8, 'These are original examples for modelling, not answers pupils must copy. A question can be improved more than once. Do not claim to know pupils’ preferences before collecting evidence.', [
        example('Start with different branches', ['People: who uses each break space?', 'Places: where can pupils be active or quiet?', 'Choices: what could improve the way spaces are shared?']),
        example('From topic to a question', ['Topic: school break spaces.', 'First idea: “Is our playground good?”', 'Improved: “How well does our playground meet the needs of pupils who want quiet activities?”']),
        example('Give a reason for choosing it', ['It matters because pupils have different needs.', 'It focuses on quiet activities in one school.', 'We can ask pupils and observe the available spaces.']),
        reveal('Improve a different idea', ['“Why should football take all the space?”'], 'Try: “How could pupils share playground space between ball games and other activities?” It allows different views without assuming football should have everything.', 'model-repair')
      ]),
      stage('guided', 'Build a varied mind map', 8, 'Pupils can start with three branches if writing is difficult; target six questions where possible. What/where/who questions can support how/why questions. Do not require one of every question word mechanically.', [
        book(5, 'Main activity · task 1', ['Put the topic in the centre of the mind map.', 'Add questions on different branches.', 'Aim for six questions; include more than one kind of need.']),
        talk('Use a partner to add a new angle', ['Read your questions aloud.', 'Which pupils or activities have you missed?', 'Add a question that is different from your first ideas.'], 'mind-map-feedback'),
        example('If you need a starting point', ['What spaces do pupils use most?', 'Why do some pupils avoid noisy areas?', 'How could active and quiet activities share the space?'])
      ]),
      stage('workbook', 'Choose three and explain why', 12, 'Spend about six minutes selecting/rewording questions and six on written reasons. Each reason should refer to that specific question. Prompt a source rather than accepting “because it is good”.', [
        book(5, 'Main activity · task 2a', ['Choose your three best questions with a partner.', 'Check importance, focus and possible information.', 'Write the three questions and record whether your partner agrees.']),
        book(6, 'Main activity · task 2b', ['Give a reason for choosing each question.', 'Use: “This matters because …” and “I could find out by …”', 'Make each reason fit that question.']),
        talk('Check one another’s reasons', ['Point to one clear reason.', 'Ask about one word that could be more precise.', 'Improve your own question or explanation.'], 'specific-feedback')
      ]),
      stage('check', 'Choose a class question', 4, 'Take two or three volunteer questions. Compare against the checks, not a popularity vote. All pupils record the agreed question and a reason. Accept a different best question if its defence is strong.', [
        book(6, 'Class discussion · task 3', ['Listen to two or three proposed questions.', 'Agree which would make a useful class enquiry.', 'Write the best question and your reason.'])
      ]),
      stage('finish', 'Reflect and finish', 4, 'Collect evidence of learning from pupils’ actual questions. Self-assessment is not a compulsory “Achieved” tick.', [
        book(6, 'Independent reflection activity', ['Explain which way of working helped you learn.', 'Give one example from today.', 'Name another skill you used.']),
        book(3, 'How will I know if I reach my goals?', ['Review each goal honestly.', 'Use one of your questions as evidence of progress.', 'Leave “Not there yet” where you still need help.']),
        frame('Research Lesson 1 complete', 'listen', ['Keep your questions for a future enquiry.', 'Listen for the next instruction.'], { final: true })
      ])
    ], extras: [
      reserve('Give useful peer feedback', ['A pupil writes: “Why is the playground awful?”', 'Their reason is: “It is a good question.”'], ['Name two things to improve.', 'Rewrite the question fairly.', 'Write a reason that names possible evidence.'], 'Produce feedback the writer can act on.', 'The question assumes the playground is awful; the reason gives no evidence. Try: “Which changes would help pupils use our playground?” We could observe activities and ask a range of pupils.'),
      reserve('Plan the first research step', ['Choose one of your three questions.', 'You have one school break to begin finding out.'], ['Name one practical method.', 'Explain what it would tell you.', 'Name something it would not tell you.'], 'Connect a question with realistic information.', 'Observe which spaces are used during one break. This shows use at that time; it does not explain everyone’s reasons or show whether every day is similar.')
    ] });
}

const eightQuestions = [
  'A · Why is all school food terrible?',
  'B · What is food?',
  'C · How much edible food is left after lunch in our class over five school days?',
  'D · What do pupils say makes them leave part of their school lunch?',
  'E · How can every country stop all waste forever?'
];
function eightPart1() {
  return finishLesson({ classId: '7a', label: '7A', bookNumber: 8, part: 1, pages: '4–5',
    title: 'Recognise a good research question', objective: 'Explain research and judge questions for clarity, focus, fairness and available evidence.',
    notes: 'Use Prior learning and Starter activity on pp. 4–5. The full p. 5 photograph is in 8.zip; it belongs to Book 8, not Book 9. Leave the p. 5 Main activity mind map for Part 2. The five labelled questions on screen supply the questions requested by the book.',
    stages: [
      stage('begin', 'What counts as research?', 4, 'Book 8 prior learning: B, C and D describe useful parts of research; A (copying) alone is not sufficient. Quoting is possible when clearly marked and credited, but simply copying is not research.', [
        frame('Open Book 8 at page 4', 'listen', ['Find the red Prior learning box.', 'Today: judge questions. Part 2: make your own.', 'Use pages 4–5 for this lesson.']),
        book(4, 'Prior learning · tasks 1–3', ['Discuss statements A–D and write your thoughts.', 'Explain whether your classmates agree.', 'Add another idea about what research involves.'])
      ]),
      stage('model', 'Use five checks', 8, 'A clear question is not necessarily a useful question. Discuss interest, clarity, manageable scope, neutral wording and feasible evidence. A descriptive question can be valid at this stage; do not insist that every question is a debate.', [
        example('Research follows a purpose', ['Ask a question.', 'Gather relevant information and think about what it shows.', 'Explain an answer and recognise what is still uncertain.']),
        example('Five checks for a question', ['Interesting and clear.', 'Focused: not too broad, too narrow or vague.', 'Fairly worded and answerable using research.']),
        example('Remove the assumption', ['Leading: “Why do pupils always waste lunch?”', 'Fairer: “What reasons do pupils give for leaving food at lunch?”', 'The fairer version allows different answers.']),
        reveal('Which change makes the scope clearer?', ['“How much waste is there?”', '“How much edible food is left after our class lunch over five days?”'], 'The second specifies the kind of waste, group and time period. We still need a safe, consistent way to measure it and permission for any observation.', 'scope')
      ]),
      stage('guided', 'Compare teacher questions', 8, 'Show the complete question bank across two frames; use Previous step to revisit. These labels remain stable for workbook answers. C and D are strong choices with different purposes. A is leading; B is a definition; E is unmanageably broad and absolute.', [
        frame('Question bank · A and B', 'think', eightQuestions.slice(0, 2), { footnote: 'Teacher questions for the Starter activity on pp. 4–5.' }),
        frame('Question bank · C, D and E', 'think', eightQuestions.slice(2), { footnote: 'Teacher questions for the Starter activity on pp. 4–5.' }),
        talk('Compare a strong and a weak question', ['Choose one from each group.', 'Explain their differences using the five checks.', 'Say what evidence would help answer the stronger one.'], 'compare-questions'),
        reveal('Can C and D both be useful?', ['C counts food left over.', 'D asks pupils about their reasons.'], 'Yes. C measures an amount over a defined period. D explores reasons. Counts alone do not explain why people leave food; reported reasons do not directly measure the amount.', 'different-methods')
      ]),
      stage('workbook', 'Choose, test and reconsider', 12, 'Use the stable A–E question bank above. Pupils choose two questions and write their wording, not only letters. C and D are a defensible pair, but accept other carefully improved choices. For task 2 use oral discussion or notebook notes if the book provides no lines.', [
        book(4, 'Starter activity · task 1', [`Write the topic: ${topic8}.`, 'Choose two useful questions from the question bank.', 'Write each question and explain why you chose it.']),
        book(5, 'Starter activity · task 2a–e', ['Test both choices against all five printed checks.', 'Discuss one strength and one possible improvement.', 'Use your notebook for extra notes.']),
        book(5, 'Starter activity · task 3a–b', ['Decide whether you still support each choice.', 'Write Yes or No and explain why.', 'A well-explained change of mind shows learning.'])
      ].map(f => ({ ...f, questionBank: eightQuestions }))),
      stage('check', 'Improve a new question', 4, 'Focus on an actionable change and a reason. Do not demand the exact model wording.', [
        reveal('Repair this question', ['“Why should we ban every packed lunch?”', 'Keep the topic but allow more than one answer.'], 'Try: “How does food left over from packed lunches compare with food left over from school meals in our class over a week?” Compare like-for-like measures; the question does not assume a ban is best.', 'repair-packed-lunch'),
        talk('Explain your repair', ['Which word or assumption did you change?', 'What information would you need now?'], 'explain-repair')
      ]),
      stage('finish', 'Reflect and finish', 4, 'Check p. 4 choices and p. 5 justifications. Full book reflection comes after the main activity in Part 2.', [
        frame('Save your best thinking', 'think', ['In your notebook, write one weak question and your improvement.', 'Explain which check helped you improve it.', 'Next time: the Main activity on pages 5–7.']),
        frame('Part 1 complete', 'listen', ['Bring Book 8 and your question ideas next time.', 'Listen for the next instruction.'], { final: true })
      ])
    ], extras: [
      reserve('Too broad, too narrow or just right?', ['“What is every cause of waste worldwide?”', '“How many peas are on this one plate?”'], ['Explain the scope of each question.', 'Write a manageable question about lunch waste.', 'Identify an information source.'], 'Make scope appropriate to a short school enquiry.', 'The first is too broad for a short project. The second is a narrow count that tells little about a wider issue. A class food-waste tally over five days gives a manageable starting point.'),
      reserve('Write a fair survey question', ['“Don’t you agree that our lunches are disgusting?”'], ['Identify the words that push an answer.', 'Write a neutral replacement.', 'Explain why neutral wording improves research.'], 'Avoid leading participants.', '“What do you like or dislike about school lunches?” allows positive, negative and mixed answers. It does not tell the respondent what to think.')
    ] });
}

function eightPart2() {
  return finishLesson({ classId: '7a', label: '7A', bookNumber: 8, part: 2, pages: '5–7',
    title: 'Develop and test your own questions', objective: 'Write three research questions, use feedback, and improve their wording.',
    notes: 'Complete Main activity task 1 on p. 5; tasks 2–4 on p. 6; reflection on p. 7. The goals table on the photographed opening spread is on p. 3 by the photographed page sequence. Locate it by its heading if needed.',
    stages: [
      stage('begin', 'Return to the topic', 4, 'Ask pupils to retrieve the criteria before showing them. This lesson creates questions; it does not require pupils to carry out the research today.', [
        frame('Open Book 8 at page 5', 'think', ['Find the Main activity below the Starter activity.', 'Recall the five checks from Part 1.']),
        book(5, 'Main activity · topic line', [`Write: ${topic8}.`, 'Today you will write questions, get feedback and improve them.'])
      ]),
      stage('model', 'Build questions with different purposes', 8, 'Model variety and feasibility without turning this into a lesson about actual nutrition or health. All examples are original; no school data is being asserted.', [
        example('Measure something', ['“How much edible food is left after our class lunch over five days?”', 'Possible information: a consistent food-waste tally.', 'Limit: one class and one week may not represent everyone.']),
        example('Explore reasons', ['“What reasons do pupils give for leaving food at lunch?”', 'Possible information: a short, neutral survey.', 'Limit: reported reasons may not explain every case.']),
        example('Compare possible changes', ['“Which lunch changes do pupils think would reduce food waste?”', 'Ask about several options, including keeping things as they are.', 'A preference is not proof that the change will work.']),
        reveal('Improve the feedback', ['A partner says: “Make your question better.”', 'What could they say that you can act on?'], '“Name which pupils and which time period you mean.” This points to a specific missing detail and gives the writer a clear next step.', 'actionable-feedback')
      ]),
      stage('guided', 'Create your mind map', 8, 'Pupils make their own questions before selecting three. Encourage branches about amounts, reasons, choices and different groups of people.', [
        book(5, 'Main activity · task 1', ['Write questions around the topic in the mind map.', 'Aim for six different ideas.', 'Include a question about reasons and one about possible changes.']),
        talk('Check relevance with a partner', ['Use task 2a on page 6.', 'Does each question help investigate school lunch waste?', 'Add a missing angle rather than copying your partner’s whole list.'], 'relevance'),
        example('Useful question starters', ['How much … over …?', 'What reasons do … give for …?', 'How could … reduce …, and what problems might arise?'])
      ]),
      stage('workbook', 'Write, discuss and improve', 12, 'Allow four minutes for three questions, four for peer feedback and four for discussion/rewording. If pupils need longer, use the optional practice time for these book tasks instead. Feedback must include a reason for each judgement.', [
        book(6, 'Main activity · task 2b', ['Choose three questions from your mind map.', 'Check interest, clarity, fair wording, scope and evidence.', 'Write your three questions in the numbered spaces.']),
        book(6, 'Main activity · task 2c', ['Ask your partner to check each question.', 'Record Yes or No and the reason for each.', 'Listen for specific improvements.']),
        book(6, 'Class discussion · tasks 3–4', ['After discussion, add two more useful questions in task 3.', 'Reword your original three questions in task 4.', 'Keep your first versions so you can see the improvement.'])
      ]),
      stage('check', 'Show what improved', 4, 'Look for substantive improvement, not only spelling. Pupils should be able to state how the change makes the research feasible or fair.', [
        talk('Before and after', ['Read your first version and your revised version.', 'Name the check that caused the change.', 'Name a possible source for the new question.'], 'before-after'),
        reveal('Is this a real improvement?', ['Before: “Why do lazy pupils waste food?”', 'After: “What reasons do pupils give for leaving food?”'], 'Yes. It removes the assumption that pupils are lazy and allows several reasons. It could be made more focused by naming a group or setting.', 'neutral-rewrite')
      ]),
      stage('finish', 'Reflect and finish', 4, 'Use the exact book reflection. The self-assessment is based on pupil evidence, not whether their question matches the teacher example.', [
        book(7, 'Independent reflection activity', ['Explain what helped your learning and why.', 'Name another skill you used and give an example.', 'Point to a question that shows your progress.']),
        frame('Check your learning goals', 'think', ['Return to the goals table at the start of Research Lesson 1.', 'Mark your progress honestly and add an example.', 'Choose one question you may investigate later.']),
        frame('Research Lesson 1 complete', 'listen', ['Keep all versions of your questions.', 'Listen for the next instruction.'], { final: true })
      ])
    ], extras: [
      reserve('Feedback clinic', ['Question: “Why is the canteen bad?”', 'Feedback: “I like it.”'], ['Replace the feedback with one useful comment.', 'Rewrite the question.', 'Explain what you would investigate.'], 'Give feedback tied to the criteria.', 'Ask the writer to replace “bad” with a specific feature and remove the negative assumption. For example: “How do pupils rate waiting time in the canteen, and why?”'),
      reserve('Match evidence to the question', ['A tally measures how much food is left.', 'An interview explores people’s reasons.'], ['Choose one of your questions.', 'Select and justify a method.', 'Name one limitation and a second source that could help.'], 'Distinguish amounts, reasons and claims about effectiveness.', 'A question about reasons fits a neutral interview or survey. Observing leftovers could check whether reported reasons fit the pattern; neither method alone proves that a proposed change works.')
    ] });
}

const nineQuestions = [
  'A · What is food waste?',
  'B · Why are pupils too careless to finish lunch?',
  'C · Can all food waste everywhere end tomorrow?',
  'D · How much food is left on one plate today?',
  'E · Should schools in Kyrgyzstan prioritise smaller first portions to reduce lunchtime food waste?'
];
function ninePart1() {
  return finishLesson({ classId: '8', label: '8th Grade', bookNumber: 9, part: 1, pages: '3–5',
    title: 'Evaluate questions for a research report', objective: 'Recognise effective research and choose a question with scope for evidence, perspectives and action.',
    notes: 'Use Book 9 p. 3 prior learning, p. 4 starter and p. 5 starter task 2b. Leave the p. 5 Main activity for Part 2. The other p. 5 photograph in 8.zip is Book 8 and is used for 7A. The question bank supplies the teacher questions required by the book.',
    stages: [
      stage('begin', 'What makes research effective?', 4, 'Book p. 3: checking author expertise, relevant notes and references (A, C, D) support research. Copy/paste alone (B) does not demonstrate understanding. A properly marked and referenced quotation can be evidence, but still needs analysis.', [
        frame('Open Book 9 at page 3', 'listen', ['Find Prior learning under the goals table.', 'Today: choose a useful report question.', 'Next lesson: develop your own question.']),
        book(3, 'Prior learning · tasks 1–3', ['Discuss which features support effective research.', 'Write your judgement and explain any disagreement.', 'Add one further feature of effective research.'])
      ]),
      stage('model', 'Judge a question and its possibilities', 8, 'Teach clear, interesting, focused, neutral and answerable questions. For this extended-report task add arguable: evidence may support different reasoned conclusions. Avoid suggesting that all research questions must be arguable.', [
        example('Three research habits', ['Check who made a source and what evidence they used.', 'Take relevant notes in your own words.', 'Record source details so someone else can check them.']),
        example('Five checks, then one more', ['Check interest, clarity, scope, fair wording and evidence.', 'For a report: can informed people reach different conclusions?', 'A factual definition may help research but is usually too small for the whole report.']),
        example('A report question opens several routes', ['“Should schools offer smaller first portions to reduce food waste?”', 'We can examine causes, effects and alternative actions.', 'We can compare different people’s views and evidence from different countries.']),
        reveal('Does “should” guarantee a good question?', ['“Should everything be better everywhere?”'], 'No. It is unclear and far too broad. A useful report question names a specific issue and manageable setting, and can be investigated with evidence.', 'should-test')
      ]),
      stage('guided', 'Evaluate the five teacher questions', 8, 'A is useful background but not a full report; B assumes a cause and blames pupils; C is absolute and impractical; D is too narrow for a report; E allows evaluation but requires definitions, sources, alternatives and attention to access to enough food. It is a research proposal, not a dietary recommendation.', [
        frame('Question bank · A, B and C', 'think', nineQuestions.slice(0, 3), { footnote: 'Teacher-supplied questions for Book 9 p. 4.' }),
        frame('Question bank · D and E', 'think', nineQuestions.slice(3), { footnote: 'Teacher-supplied questions for Book 9 p. 4.' }),
        talk('Give a judgement with a reason', ['Choose one weak question and explain its main problem.', 'Compare it with question E.', 'Name one challenge you would still need to solve with E.'], 'evaluate-bank'),
        example('Clarify the strongest option', ['Define “smaller first portions” as an option with more available if wanted.', 'Compare it with other changes, such as more choice or better scheduling.', 'Investigate effects and trade-offs before recommending an action.'])
      ]),
      stage('workbook', 'Choose a question for a report', 12, 'Use p. 4 task 1 for five brief judgements; task 2a is a discussion supported by the Question space. Complete agreement at top of p. 5. E is the strongest of these five for a report, but evidence could lead to either conclusion.', [
        book(4, 'Starter activity · task 1', [`Write the topic: ${topic9}.`, 'Use the five teacher questions A–E.', 'In Question 1–5, record a judgement and reason for each.']),
        book(4, 'Starter activity · task 2a', ['Choose the best question for a research report.', 'Check causes/effects, global and national views, action and reflection.', 'Write your chosen question in the space provided.']),
        book(5, 'Starter activity · task 2b', ['Compare your choice with classmates.', 'Discuss whether they agree and explain why.', 'Use a notebook if you need more writing space.'])
      ]),
      stage('check', 'Connect the question to perspectives', 4, 'Distinguish scale from opinion. A global perspective needs evidence and viewpoints beyond one country, not just the word global. National scope does not imply everyone in that country agrees. Examples are plans for research, not researched claims.', [
        reveal('Where could the report find different perspectives?', ['Question E focuses on schools in Kyrgyzstan.', 'How could the report still use global evidence?'], 'Compare evidence and experiences from schools in other countries, then consider how relevant they are locally. Investigate national conditions and different pupils’ or staff members’ views; do not assume one survey represents a whole country.', 'global-national'),
        talk('What would change your mind?', ['State one piece of evidence you would want before recommending smaller portions.', 'Explain why that evidence matters.'], 'change-mind')
      ]),
      stage('finish', 'Reflect and finish', 4, 'Check that every pupil has evaluated the question bank, not simply copied the preferred question.', [
        frame('Your exit explanation', 'think', ['In your notebook: explain why your chosen question suits a report.', 'Name one uncertainty you would investigate.', 'Next time: create your own question on pages 5–7.']),
        frame('Part 1 complete', 'listen', ['Keep your judgements and reasons.', 'Listen for the next instruction.'], { final: true })
      ])
    ], extras: [
      reserve('Source-checking clinic', ['Fictional source A: a supplier advert says its lunch trays end all waste.', 'Fictional source B: one school records leftovers for five days, with no comparison school.'], ['Give one useful feature or limitation of each.', 'Decide what each can actually support.', 'Name an additional source you would seek.'], 'Avoid treating a claim or short observation as proof.', 'A has a sales purpose and gives no evidence here. B supplies observations but cannot prove a cause or represent every school. Seek independent comparisons, methods and perspectives from pupils and staff.'),
      reserve('Turn a fact into a report question', ['“How many bins does our school have?”'], ['Explain why this is a background question.', 'Develop a question that allows different conclusions.', 'Name an action and a competing option.'], 'Create an arguable question without deciding the answer.', 'Counting bins gives background information. “Should our school prioritise better sorting facilities or reducing waste at source?” allows comparison of cost, effects and feasibility; research may support a combined approach.')
    ] });
}

function ninePart2() {
  return finishLesson({ classId: '8', label: '8th Grade', bookNumber: 9, part: 2, pages: '5–7',
    title: 'Design and defend a research question', objective: 'Develop three questions and refine one for a report using evidence, perspectives and peer feedback.',
    notes: 'Use p. 5 Main task 1, p. 6 tasks 2–4 and p. 7 discussion/reflection. Return to the p. 3 goals table. This is question design, not a completed research report. Pupils plan evidence they need; they must not invent findings.',
    stages: [
      stage('begin', 'Return to the enquiry', 4, 'Ask pupils to retrieve what makes a report question useful. Keep the topic common for meaningful feedback; pupils should write their own questions.', [
        frame('Open Book 9 at page 5', 'think', ['Find the Main activity.', 'Recall one weak question from Part 1 and why it was weak.']),
        book(5, 'Main activity · topic line', [`Write: ${topic9}.`, 'Your task is to design questions, not answer them yet.'])
      ]),
      stage('model', 'Design questions worth investigating', 8, 'The examples show different possible enquiries, not a recommended school policy. Do not require pupils to reuse the smaller-portions question. Recognise a question may contain more than one dimension but should still be manageable.', [
        example('Three different enquiry routes', ['Causes: what influences how much food pupils leave?', 'Choices: should schools prioritise menu choice or portion choice?', 'Action: how could schools reduce waste while meeting pupils’ needs?']),
        example('Make a broad idea manageable', ['Too broad: “How can the world stop wasting food?”', 'Focused: “Should schools in Kyrgyzstan prioritise pupil menu choice to reduce lunchtime food waste?”', 'Now ask what evidence could support and challenge it.']),
        example('A question needs an evidence plan', ['National: investigate conditions and perspectives in Kyrgyzstan.', 'Global: compare relevant evidence from other countries.', 'Personal: explain what you think now and what could change your view.']),
        reveal('Is this ready for a report?', ['“Why is menu choice obviously the only solution?”'], 'No. It assumes both effectiveness and that no alternative is useful. Try: “How does pupil menu choice compare with portion choice as a way to reduce school food waste?” Define the context and suitable evidence.', 'report-repair')
      ]),
      stage('guided', 'Generate and compare ideas', 8, 'Encourage six questions before narrowing to three. Avoid demanding that pupils complete full national/global research today. They only identify possible evidence and perspectives.', [
        book(5, 'Main activity · task 1', ['Discuss the topic with a partner.', 'Create a mind map with several different questions.', 'Include causes, effects and possible actions.']),
        talk('Ask another pair for feedback', ['Use task 2a on page 6.', 'Are the questions relevant and clear?', 'Identify one assumption or scope problem to fix.'], 'pair-to-pair'),
        example('A useful feedback sentence', ['“Your question assumes …”', '“You could make the setting clearer by …”', '“To answer this, you would need evidence about …”'])
      ]),
      stage('workbook', 'Refine three questions into one', 12, 'p. 6 includes arguable as a criterion. Check each of the three questions before choosing one. Use notebook space to explain a test of the five report requirements if the printed space is small. Target a feasible plan, not fabricated research.', [
        book(6, 'Peer feedback · task 2b', ['Write your three best questions.', 'Check the six printed criteria, including “arguable”.', 'Make each question manageable and open to evidence.']),
        book(6, 'Peer feedback · tasks 3–4', ['Check the questions with another pair.', 'Choose one question and reword it if necessary.', 'Write your final question in the space provided.']),
        frame('Test your chosen question', 'think', ['Can you explore causes and effects?', 'Can you use national and global perspectives?', 'Can you discuss an action, reach a conclusion and reflect on your view?'], { footnote: 'Book 9 · p. 6 · task 4 · Use a notebook for your planning notes.' })
      ]),
      stage('check', 'Defend your choice', 4, 'Compare two or three pupil questions using the criteria. Do not choose simply by voting. Listen for discussion of evidence and at least one limitation.', [
        book(7, 'Class discussion', ['Discuss the strongest questions as a class.', 'Write the best research question and explain why.', 'Use specific criteria, not “because it is interesting” alone.'])
      ]),
      stage('finish', 'Reflect and finish', 4, 'Pupils should record a concrete change and honestly evaluate their progress. A future report would need real sources and appropriately credited evidence.', [
        book(7, 'Independent reflection activity', ['Explain what helped develop your research skills.', 'Describe how you used another skill.', 'Give a specific example from your question revisions.']),
        book(3, 'How will I know if I reach my goals?', ['Review the goals and add evidence of progress.', 'Mark “Not there yet” where appropriate.', 'Name the first information you would seek next.']),
        frame('Research Lesson 1 complete', 'listen', ['Keep your question and feedback for future research.', 'Listen for the next instruction.'], { final: true })
      ])
    ], extras: [
      reserve('Stress-test your question', ['Use the question you chose on page 6.', 'Imagine a classmate reaches the opposite conclusion.'], ['State their strongest possible reason.', 'Identify evidence that could test it.', 'Improve your question if it prevents a fair answer.'], 'Keep an enquiry open to more than one conclusion.', 'For menu choice, someone might argue that choice increases cost without reducing waste. Comparative waste and cost records could help test this. Evidence, not wording, should determine the conclusion.'),
      reserve('A report route in five steps', ['Use your final question. Plan; do not invent findings.'], ['List causes/effects you would investigate.', 'Name national and global evidence plus an action to compare.', 'State what could change your personal view.'], 'Outline how the chosen question supports a whole report.', 'Investigate why food is left, compare relevant school evidence in Kyrgyzstan and elsewhere, weigh menu choice against portion choice, and explain what findings would change your initial judgement. Check how comparable the settings are.')
    ] });
}

export const workbookTrialLessons = [sevenPart1(), sevenPart2(), eightPart1(), eightPart2(), ninePart1(), ninePart2()];
