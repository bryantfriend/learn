import { f, task, model, s, lesson } from './gp-workbook-research-2.js';

// Book 9 pp. 8–12, teacher photographs received 19 October 2026.
// Original fictional reading: proposed explanations and viewpoints, not research findings.
export const grade8ResearchText = [
  'A fictional school council investigates lunch waste. Pupils suggest portion size, eating time and food preferences as possible causes. Uneaten food could waste ingredients and money. These are suggestions, not findings. The council needs measurements and pupils’ explanations before recommending changes.',
  'In an imagined national discussion, a meals organiser prioritises affordable waste records across schools. A pupil representative wants pupils involved in decisions. Neither represents the whole country. Comparing school records might reveal patterns, but menus and measuring methods could differ.',
  'In an imagined international discussion, a researcher favours comparing countries. A parent asks whether ideas suit different budgets and routines. The council proposes optional smaller first portions with more available. It would compare waste before and during a trial, ask pupils and consider other explanations.'
];
const source = 'Original fictional classroom scenario, Mr. Friend’s lesson app, 19 October 2026. No real country, organisation, study or results are represented. Use as a source-analysis exercise, not evidence of actual national/global trends.\n' + grade8ResearchText.join('\n\n');
const read = () => grade8ResearchText.map((p, i) => f(`Source reading · paragraph ${i + 1}`, 'listen', [p], { footnote: 'Teacher-created fictional scenario · not real findings' }));
const talk = (title, lines) => f(title, 'pair', lines);
const build = (part, title, pages, objective, stages) => {
  const result = lesson(part, title, pages, objective, stages, { classId: '8', label: '8th Grade', bookNumber: 9,
    opening: 'Bring Book 9, pencil, another colour and notebook. These three 40-minute meetings cover photographed Research Lesson 2, pp. 8–12; objective codes 1.3 and 1.4 are skills, not lesson numbers. No printing or pupil internet needed. Use the original fictional food-waste text on screen and in notes. Discuss first, then write individually. Models are possible responses, not an official answer key.' });
  result.catalog.grades = [8];
  for (const stage of result.stages) {
    stage.notes += '\nDiscussion routine: quiet thinking first; partners take turns, then paraphrase each other before responding. Invite a pair to share and another to question or build on it. Ask “What makes you say that?” and “Who can offer another explanation?” Allow a pass and return later. End with an individual response.';
    for (const frame of stage.frames) {
      frame.questionBankTopic = 'Discuss, challenge and explain';
      frame.questionBank = ['What evidence would help us decide?', 'Who can restate that idea in their own words?', 'Who agrees or disagrees, and why?', 'Whose perspective is missing?', 'What question would you ask another group?', 'What changed your thinking?'];
    }
  }
  return result;
};
export const grade8Research2Lessons = [
  build(1, 'Predictions, questions and methods', '8–10', 'Select and justify methods that match a question and test a prediction.', [
    s('begin', 'Set goals and practise listening', 4, 'Read the three goals on pp. 8–9: suitable methods, relevant information, own-word summaries. Ask pupils to give evidence before ticking achieved.', [
      f('Open Book 9 at page 9', 'listen', ['Today: questions, predictions and methods.', 'Later: select information and summarise it.', 'Think alone, talk in pairs, then share with the class.']),
      talk('What makes research convincing?', ['Recall your last research question.', 'Tell your partner what evidence it needs.', 'Report your partner’s idea to the teacher.'])
    ]),
    s('prior', 'Which questions test predictions?', 10, 'p. 9 A links junk food with chronic disease in the UK; B asks why disease is increasing; C asks about environmental factors. Explain chronic as long-lasting. A and C suggest possible causal relationships; B is an open explanatory question and includes a trend that needs checking. Avoid a single mandatory letter. These are questions, not established health claims. Do not diagnose, give dietary advice or request personal/family health information.', [
      task(9, 'Prior learning 1', ['Read A–C with a partner.', 'Which question or questions could test a prediction?', 'State the prediction and explain your reasoning.']),
      talk('Challenge the reasoning, respectfully', ['Partner A: explain your choice. Partner B: ask what evidence would test it.', 'Swap roles. Can more than one answer be justified?', 'Tell the teacher where you agree and where you differ.']),
      model('A possible interpretation', ['How is a prediction different from a question?', 'Does asking about a cause prove it?'], 'A prediction states an expected relationship or outcome. A and C can test proposed relationships; B explores explanations. Asking a causal question does not establish the cause. A trend also needs evidence.'),
      task(9, 'Prior learning 2', ['Record whether classmates agreed.', 'Explain their reasons and any change in your thinking.'])
    ]),
    s('starter', 'Compare national and global scope', 9, 'p. 10 starter 1–3 and feedback 4–5. A explicitly names the UK; B or C could be developed across countries, with a focused scope and comparable evidence. Accept justified choices. Pupils plan research only. No live health research or medical claims are needed.', [
      task(10, 'Starter activity 1–3', ['Choose a printed question to develop national and global perspectives.', 'Suggest suitable methods and explain what each could show.', 'Write three to six useful search words.']),
      talk('Pairs join another pair', ['Can your question work within one country and across countries?', 'Would a class opinion survey answer a national health question?', 'Ask the teacher one question about your evidence plan.']),
      task(10, 'Peer feedback 4–5', ['Explain whether classmates agree.', 'Add or change method and search-word ideas in another colour.'])
    ]),
    s('transfer', 'Choose methods for a school enquiry', 13, 'Original notebook/oral practice, not an extra workbook task. Keep the food-waste topic for the next two lessons. A school sample cannot establish national patterns or causal health links.', [
      f('A prediction we can investigate', 'think', ['Prediction: optional smaller first portions could reduce lunch waste.', 'Question: what happens to waste during a short trial?', 'What would you measure, ask and keep consistent?'], { footnote: 'Teacher-created practice · notebook' }),
      talk('Method challenge circle', ['Groups of four: propose a method, explain its evidence, question it, improve it.', 'Consider waste measurements, neutral pupil questions and school records.', 'Which method cannot explain reasons by itself?']),
      model('Tell the teacher what your plan cannot show', ['Would less waste during one week prove why it changed?'], 'No. Menus, attendance or time to eat might also change. Comparable measurements and pupil feedback help, but a short trial has limits. A survey describes reported opinions; it cannot measure the amount of waste by itself.'),
      f('Write and defend your choice', 'think', ['Write a method, the evidence it provides and one limitation.', 'Share it. Ask another group a follow-up question.', 'Revise one detail after the discussion.'])
    ]),
    s('finish', 'Check progress', 4, 'Return to p. 9 methods goal; save other goals for later evidence.', [task(9, 'Learning goals · methods', ['Check your methods goal honestly.', 'Add an example or a next step.']), f('Keep your plan', 'listen', ['Next: discuss a source and select relevant notes.'], { final: true })])
  ]),
  build(2, 'Discuss a source and organise evidence', '9–11', 'Agree a focused research question and select relevant source notes about causes, consequences and perspectives.', [
    s('begin', 'Reconnect and set the topic', 4, 'Use school food waste as the teacher-selected topic on p. 10. Explain that this is a new source-analysis example after the printed health questions.', [talk('What did our methods add?', ['Explain one method and its limitation to a partner.', 'Ask one follow-up question.']), task(10, 'Main activity · topic', ['Write: school food waste.', 'Our source is an invented discussion, not real findings.'])]),
    s('read', 'Read and question the source', 10, source + '\nRead aloud, pausing for pupil explanations. Define consequence, viewpoint, national and global. Keep the text available through step controls.', [...read(), talk('Source detectives', ['Which statements are suggestions rather than results?', 'What are the people disagreeing about?', 'What does this source leave unanswered?'])]),
    s('question', 'Agree a research question', 8, 'p. 10 1a and p. 11 1b. Each pupil proposes a question before pair and pair-of-pairs agreement. Record the agreed question in the p. 11 table.', [task(10, 'Main activity 1a', ['Discuss the source with a partner.', 'Form a relevant question this source could help answer.']), task(11, 'Main activity 1b', ['Compare questions with another pair.', 'Agree a focused question and explain why it fits.']), model('Compare after your own attempt', ['Does the source prove what causes waste everywhere?', 'What smaller question could it help explore?'], 'A possible question is “What should a school consider before testing smaller first portions?” The source offers proposed causes, concerns and a possible action; it cannot establish actual national waste rates.')]),
    s('notes', 'Build the evidence table together', 14, source + '\nUse p. 11 2a: topic, research question, causes, consequences, global perspective, national perspective, course of action. Groups discuss all rows; everyone writes their own notes. Suggested causes are portion size/time/preferences, not findings; consequences are possible ingredient/money waste. National viewpoints include organiser and pupil representative; global viewpoints include researcher and parent. Geographic scope alone is not a viewpoint. Proposed action is a monitored trial. Accept “not established” and questions where evidence is missing.', [
      task(11, 'Main activity 2a · notes table', ['Record your topic and agreed research question.', 'Add brief relevant notes in all five feature rows.', 'Keep “possible”, “proposed” and “imagined” where needed.']),
      talk('Compare tables in groups of four', ['Which note helps answer your question? Which could you leave out?', 'Separate a possible cause from a possible consequence.', 'How do the national and global speakers’ priorities differ?']),
      talk('Bring a disagreement to the teacher', ['Choose one row where your group disagrees.', 'Point to the source sentence behind each interpretation.', 'Ask the class to help decide, then improve your notes.'])
    ]),
    s('finish', 'Evidence of progress', 4, 'p. 9 relevant-information goal. Next lesson completes p. 12 peer feedback and summary.', [task(9, 'Learning goals · relevant information', ['Check the relevant-information goal.', 'Give one note and explain why you selected it.']), f('Save your table', 'listen', ['Next: test your notes and write your own summary.'], { final: true })])
  ]),
  build(3, 'Summarise, discuss and improve', '9, 11–12', 'Write an accurate own-word summary and use discussion to improve understanding.', [
    s('begin', 'Recall without copying', 4, 'Start with oral recall, then verify against the source.', [talk('Explain yesterday’s source', ['Tell your partner its main idea without looking.', 'What was proposed? What was not proved?', 'Invite your partner to correct one detail.'])]),
    s('read', 'Check notes against the source', 10, source + '\np. 12 2b refers to p. 11 table. Require evidence-based feedback: identify a phrase, explain the issue, suggest a change.', [...read(), task(12, 'Peer feedback 2b', ['Share your page 11 notes.', 'Do they reflect the source accurately?', 'Add or correct notes after checking together.'])]),
    s('summary', 'Turn one feature into a summary', 10, 'p. 12 task 3 explicitly uses a separate sheet. Notebook or separate paper is appropriate. Choose ONE feature, not a compulsory summary of every row. Close the source after rereading, use notes, then reopen to check meaning. Necessary topic words may stay the same.', [
      task(12, 'Main activity 3 · separate sheet', ['Choose one feature from your table.', 'Use your notes to write a short summary in your own words.', 'Record it on a separate sheet or notebook page.']),
      talk('Rehearse before writing', ['Explain your feature aloud while your partner listens.', 'Partner: what key idea is missing or unclear?', 'Write individually, then compare meanings.']),
      model('Check a course-of-action summary', ['Try your own summary before revealing.', 'Which details preserve the proposal and its limits?'], 'The fictional council suggests testing smaller starting portions while allowing pupils to request more. It would compare waste and pupil feedback and consider other reasons for any change. This describes a proposal, not proof that it works.')
    ]),
    s('review', 'Hold a summary conference', 9, 'p. 12 task 4: groups examine everyone’s summary. Use accuracy, relevance and own wording, not identical phrasing. Each pupil revises their own work. Invite teacher follow-ups without requiring everyone to speak publicly.', [
      task(12, 'Main activity 4 · group review', ['Read each group member’s summary.', 'Check accuracy, key ideas and own words.', 'Improve summaries that change or lose the source meaning.']),
      talk('Ask, listen, build', ['Ask a classmate: “Why did you include that?”', 'Ask the teacher about one unresolved interpretation.', 'Explain one revision and whose feedback helped you.']),
      model('Spot the overclaim', ['“Schools everywhere have proved smaller portions solve waste.”', 'What needs changing?'], 'The source describes an imagined proposal, not proven results or all schools. Keep the limited scope and planned action. Changing a few words is insufficient if the meaning remains inaccurate.')
    ]),
    s('finish', 'Reflect and check all goals', 7, 'p. 12 reflection asks interest and communication, not evaluation. Offer A question-forming, B notes, C summary, D sharing summaries. Require personal examples. Return to all three goals on p. 9.', [
      task(12, 'Independent reflection · interest', ['What interested you most: questions, notes, summaries or sharing?', 'Explain why using an example.']),
      task(12, 'Independent reflection · communication', ['How did you use communication?', 'Describe a question, listening moment or explanation that helped.']),
      task(9, 'Learning goals · final check', ['Check methods, relevant information and own-word summaries.', 'Give evidence for each achieved goal.', 'For “not there yet”, name a next step.']),
      f('Research Lesson 2 complete', 'listen', ['Tell a partner one idea you understand better after discussion.'], { final: true })
    ])
  ])
];

