// Book 8 Research Lesson 2, photographed pp. 8–12, received 2026-10-12.
import { f, task, model, s, lesson as buildLesson } from './gp-workbook-research-2.js';
export const lunchResearchText = [
  'In this fictional school project, a research team wants to understand lunch waste. The team asks how the school could reduce uneaten food while still meeting pupils’ needs. Researchers need information about both the amount left and the reasons pupils give. They should not assume that every pupil leaves food for the same reason.',
  'The team plans to observe lunch over several days. It will record the amount of uneaten food using the same measuring method each day. It will also record which meals were served, so it can compare patterns. These observations could show differences in waste, but cannot explain pupils’ reasons by themselves.',
  'The team also plans to ask pupils neutral questions about their lunches. Pupils can explain their preferences and reasons without being pushed toward an answer. The researchers will compare these replies with their observation records before suggesting changes. They will explain whose views were included and what further information is needed.'
];
const read = () => lunchResearchText.map((p, i) => f(`Teacher text · paragraph ${i + 1}`, 'listen', [p], {
  footnote: 'Original fictional project scenario · choose your own title'
}));
const source = 'Original teacher-provided text, Mr. Friend’s lesson app, 12 October 2026. Fictional proposed project, not real findings. Leave the source untitled until pupils propose titles. Keep it accessible using step controls.\n' + lunchResearchText.map((p, i) => `Paragraph ${i + 1}: ${p}`).join('\n');
const lesson = (...args) => buildLesson(...args, { classId: '7a', label: '7A', bookNumber: 8,
  opening: 'Bring Book 8, a pencil, another colour and a notebook. Three class meetings cover the single printed Research Lesson 2, pp. 8–12. Objective codes 1.3 and 1.4 are not lesson numbers. No printing or student internet is needed. An original untitled three-paragraph fictional school lunch-waste project is provided on screen and in teacher notes. Retain this source across the sequence. The urbanisation questions are the printed prior-learning task; lunch waste fills the teacher-selected reading topic. Models are possible responses, not an official answer key.' });
export const sevenAResearch2Lessons = [
  lesson(1, 'Choose and justify research methods', '8–10', 'Compare research questions and justify three appropriate ways to find information.', [
    s('begin', 'Set the two learning goals', 4, 'Read p. 8 goals: select methods and summarise in own words. Do not require achieved ticks before pupils have evidence.', [
      f('Open Book 8 at page 8', 'listen', ['I can select appropriate research methods.', 'I can summarise information in my own words.', 'Today: choosing methods. Next: titles and paragraph summaries.'])
    ]),
    s('prior', 'Judge the printed research questions', 11, 'p. 9 A asks about a relationship between urbanisation and biodiversity/ecosystem loss; B asks why houses are being built; C asks what causes wildlife loss. Explain urbanisation as growth of towns/cities, biodiversity as variety of living things, ecosystem as living things and their surroundings. Compare clarity, scope and feasible evidence. A is a defensible choice, not a mandatory answer; all need a place/time and clearer scope. No environmental findings are being asserted.', [
      task(9, 'Prior learning 1', ['Compare the three printed questions A, B and C.', 'Choose the best research question and write a reason.', 'Think about focus and what evidence you could find.']),
      model('Defend a choice', ['Which question gives you a relationship to investigate?', 'What would you need to narrow before researching it?'], 'A connects urbanisation with environmental change. It still needs a location, time period and clear measures. B could work if focused on one area; C covers many possible causes. Accept a different choice with a sound explanation.'),
      task(9, 'Prior learning 2', ['Compare choices with classmates.', 'Record whether they agree and explain why.'])
    ]),
    s('methods', 'Build a methods menu', 10, 'Starter rows 1–5 are p. 9 and rows 6–10 p. 10. Aim for variety, not ten synonyms. Examples: books, research articles, official reports, maps, photographs, documentaries, interviews, questionnaires, observations and measurements. Distinguish sources from ways of gathering information. No live research is required.', [
      task(9, 'Starter activity 1 · rows 1–5', ['Discuss ways of finding information with a partner.', 'Write your first five ideas on page 9.']),
      task(10, 'Starter activity 1 · rows 6–10', ['Continue the list on page 10.', 'Consider reading, asking, watching, comparing records and measuring.']),
      model('Match a method to its evidence', ['Could interviewing residents show a change in wildlife numbers?', 'What else would help investigate change over time?'], 'Interviews can provide reported experiences and viewpoints. Comparable wildlife records and land-use maps from different dates could help examine change. Reports alone do not prove a cause; methods answer different parts of the question.')
    ]),
    s('choose', 'Justify your top three methods', 11, 'Follow p. 10 class discussion task 2. Use each pupil’s best question from p. 9. Each reason must name useful information, not merely say easy. For A, comparable land-use maps, wildlife records and a relevant report are plausible plans; pupils need not collect them today. Stretch: explain a limitation or what another method adds.', [
      task(10, 'Class discussion 2', ['Choose your top three ways to answer your best question.', 'Write each method and its own “because” reason.', 'Explain what information each could provide.']),
      f('Check your reasons with a partner', 'pair', ['Does each method help answer the chosen question?', 'Do the three methods add different information?', 'Improve one reason if it is too general.'])
    ]),
    s('finish', 'Check the methods goal', 4, 'Use p. 8 methods goal only; summary goal can remain not there yet. Require an example from the justified method choices.', [
      task(8, 'Learning goals · methods check', ['Check your progress on selecting methods.', 'Add an example from your page 10 choices.']),
      f('Keep your methods plan', 'listen', ['Next lesson: read a teacher text and agree a useful title.'], { final: true })
    ])
  ]),
  lesson(2, 'Choose a title and topic words', '8, 10–11', 'Read a text, evaluate possible titles and identify topic-specific words.', [
    s('begin', 'Connect methods to reading', 4, 'Explain the shift from the printed urbanisation questions to the teacher-selected school lunch-waste reading. A text can explain planned methods without reporting results.', [
      f('Recall your methods', 'pair', ['Name one method and what information it provides.', 'Today’s reading describes a fictional school project.']),
      task(10, 'Main activity · topic', ['Write today’s topic: school lunch waste.', 'The teacher text has no title yet: you will choose one.'])
    ]),
    s('read', 'Read the untitled source', 10, source + '\nRead aloud; explain uneaten, neutral, preferences, observations and measuring method. Do not reveal proposed titles before pupils attempt one.', [
      ...read(),
      f('Connect the three paragraphs', 'pair', ['What question is the team trying to answer?', 'What do the two methods add?', 'What idea runs through the whole text?'])
    ]),
    s('title', 'Propose and agree a title', 10, 'Follow p. 10 1a–b. Pupils propose titles in notebook space, then record the agreed title in p. 11 upper table. Assess coverage, accuracy and specificity. A title must not suggest completed findings.', [
      f('Main activity 1a · propose a title', 'think', ['Write a possible title in your notebook.', 'Use the main idea across all three paragraphs.'], { footnote: 'p. 10 instructions · record final title in p. 11 table' }),
      f('Main activity 1b · agree with a partner', 'pair', ['Compare your titles. Which best fits the whole text?', 'Agree a title and explain why it is stronger.']),
      model('Evaluate two possible titles', ['A: “All pupils dislike lunch”', 'B: “Investigating school lunch waste”', 'Which fits the text, and why?'], 'B describes the planned investigation across all three paragraphs. A invents a result and speaks for all pupils. Other accurate titles can work; check them against the whole text.')
    ]),
    s('words', 'Record and review topic words', 12, 'Follow p. 11 1c–e: table then partner and class feedback in another colour. Accept both food-topic and research vocabulary when pupils explain relevance. Examples: lunch waste, uneaten food, researchers, observations, measuring method, neutral questions, preferences, records. Do not require every ordinary word.', [
      task(11, 'Main activity 1c · upper table', ['Write your agreed text title and topic.', 'Find topic-specific words in all three paragraphs.', 'Record them in the upper table.']),
      task(11, 'Peer feedback 1d–e', ['Share words with a partner, then titles and words with classmates.', 'Agree the best title using reasons from the source.', 'Add helpful words and improvements in another colour.'])
    ]),
    s('finish', 'Explain a judgement', 4, 'Prepare for p. 12 evaluation reflection by asking what criteria pupils used. This is oral/notebook practice, not an extra printed task.', [
      f('What made your title better?', 'think', ['Explain one judgement you made using the text.', 'How did a classmate’s idea help?']),
      f('Keep your agreed title and source', 'listen', ['Next lesson: sub-headings and two-sentence paragraph summaries.'], { final: true })
    ])
  ]),
  lesson(3, 'Summarise each paragraph and reflect', '8, 11–12', 'Give each paragraph a sub-heading, write two sentences in your own words and explain evaluation skills.', [
    s('begin', 'Retrieve the title and topic', 4, 'Use completed p. 11 upper table. Distinguish a whole-text title from a paragraph sub-heading.', [
      f('Open pages 11 and 12', 'pair', ['Read your agreed title and topic words.', 'Explain the difference between a title and a sub-heading.'])
    ]),
    s('reread', 'Reread and identify key ideas', 8, source + '\nFollow p. 11 task 2. Discuss each paragraph. Keep the source available while pupils write.', [
      ...read(),
      f('Find one idea per paragraph', 'pair', ['Paragraph 1: the investigation’s purpose.', 'Paragraph 2: what observation can show.', 'Paragraph 3: what asking adds.'])
    ]),
    s('model', 'Practise own-word summaries', 6, 'The book requires two sentences per paragraph, not bullet notes or a single whole-text summary. Demonstrate meaning-preserving paraphrase after an oral attempt. Pupils may retain necessary topic words. Do not treat a planned method as a completed result.', [
      model('Try paragraph 1 first', ['Suggest a sub-heading.', 'Explain its key information in two sentences.'], 'Possible sub-heading: Purpose of the enquiry. A fictional team wants to investigate reducing uneaten lunches while meeting pupils’ needs. It needs both amounts and reasons because pupils may leave food for different reasons.'),
      model('Check careful wording', ['“The team proved that meals caused the waste.”', 'Does this match paragraph 2?'], 'No results or causes have been established. The team plans to compare meals and recorded amounts; observation alone cannot explain pupils’ reasons.')
    ]),
    s('write', 'Complete all three paragraph summaries', 15, 'Allow roughly eleven minutes writing and four minutes checking. p. 11 lower table has title and paragraph 1; p. 12 continues paragraphs 2 and 3. Write a sub-heading and exactly two concise sentences for each. Read pupils’ responses against the original source rather than demanding model wording.', [
      task(11, 'Main activity 2a–b · paragraph 1', ['Copy the agreed title above the lower table.', 'Discuss paragraph 1 and write its sub-heading.', 'Write two sentences summarising it in your own words.']),
      task(12, 'Main activity 2a–b · paragraphs 2–3', ['For each remaining paragraph, discuss and write a sub-heading.', 'Write two sentences per paragraph in your own words.', 'Keep the distinction between a plan and findings.']),
      f('Check and improve with a partner', 'pair', ['Does each sub-heading match its paragraph?', 'Are there two accurate sentences in your own words?', 'Check missing key ideas and revise one sentence.']),
      model('Compare paragraph 2', ['Check your own response before revealing.'], 'Sub-heading: Observing lunch waste. The team plans to measure uneaten food consistently over several days and record the meals served. This could reveal patterns in amounts, but would not explain pupils’ reasons.'),
      model('Compare paragraph 3', ['Check your own response before revealing.'], 'Sub-heading: Asking and comparing. Neutral questions could collect pupils’ preferences and reasons to compare with observations. Researchers would explain whose views were included and what information is still missing.')
    ]),
    s('finish', 'Reflect and check learning', 7, 'p. 12 asks what was interesting, not what was difficult. Pupils choose one A–E option and explain why, then describe evaluation. Evaluation examples: comparing titles against main ideas, selecting relevant words or checking summary accuracy. Return to both goals on p. 8 as the Check your learning box directs. Accept honest not there yet judgements with next steps.', [
      task(12, 'Independent reflection · choice and reason', ['Choose what you found interesting and explain why.', 'A: giving a title. B: sharing title ideas. C: topic-specific words.', 'D: paragraph sub-headings. E: own-word paragraph summaries.']),
      task(12, 'Independent reflection · evaluation skills', ['Explain how you used evaluation today.', 'Name a choice or judgement, the criteria you used, and an example.']),
      task(8, 'Learning goals · final check', ['Check both learning goals honestly.', 'Add examples from your method choices and paragraph summaries.', 'If not there yet, name your next step.']),
      f('Research Lesson 2 complete', 'listen', ['Keep your methods, title, words and summaries together.'], { final: true })
    ])
  ])
];
