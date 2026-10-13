// Book 7, Research Lesson 2, pp. 7–12. Teacher photographs received 2026-10-12.
// The reading below is original classroom material, not Cambridge text or real findings.
export const breakSpacesText = [
  'School break spaces can support different activities. Some pupils want to run and play games, while others want to read or talk quietly. A useful break space gives pupils choices. One activity may not meet everyone’s needs.',
  'Researchers can find out how pupils use a space by observing it. They can record which activities happen and count how many pupils use each area. Observations at different breaks may show different patterns. Watching an area does not explain why a pupil chooses it.',
  'Researchers can also ask pupils what they prefer and why. They should use questions that allow different answers and record the replies carefully. Comparing these replies with observations can help them suggest changes. They should explain whose views they collected and what they still need to find out.'
];
export const f = (title, mode, lines, extra = {}) => ({ title, mode, lines, ...extra });
export const task = (page, activity, lines) => f(activity, 'think', lines, {
  bookTask: { page, activity }, footnote: `WRITE IN YOUR BOOK · p. ${page} · ${activity}`
});
export const model = (title, lines, explanation) => f(title, 'think', lines, {
  type: 'question', answerText: 'Compare a possible response', explanation,
  footnote: 'Teacher-created example · explain before revealing'
});
const reading = () => breakSpacesText.map((text, i) => f(`Break spaces for everyone · paragraph ${i + 1}`, 'listen', [text], {
  footnote: 'Original teacher-provided reading · keep this text available for workbook tasks'
}));
export const s = (id, title, durationMinutes, notes, frames) => ({ id, title, durationMinutes, notes, frames });
const support = ' Support: read aloud, explain vocabulary, let pupils rehearse orally before writing. Stretch: explain what the text leaves unanswered. Models are possible responses, not an official answer key.';
export function lesson(part, title, pages, objective, stages, config = {}) {
  const { classId = '7b', label = '7B', bookNumber = 7, opening } = config;
  let elapsed = 0;
  for (const stage of stages) {
    stage.timeRange = `${elapsed}–${elapsed + stage.durationMinutes} min`;
    elapsed += stage.durationMinutes;
    stage.notes += support;
    const weights = stage.frames.map(frame => frame.final ? 1 : frame.bookTask ? 5 : frame.mode === 'listen' ? 3 : 4);
    const total = weights.reduce((a, b) => a + b, 0);
    let remaining = stage.durationMinutes * 60;
    stage.frames.forEach((frame, i) => {
      const seconds = i === weights.length - 1 ? remaining : Math.floor(stage.durationMinutes * 60 * weights[i] / total / 15) * 15;
      remaining -= seconds;
      Object.assign(frame, { expectedSeconds: seconds, timerSeconds: seconds,
        kicker: `Book ${bookNumber} · Research Lesson 2 · Part ${part}${frame.bookTask ? ` · p. ${frame.bookTask.page}` : ''}` });
    });
  }
  return {
    id: `gp-books-${classId}-research-2-part-${part}`, title: `Research Lesson 2 · Part ${part} · ${title}`,
    durationMinutes: 40, coreMinutes: 40, contentRevision: classId === '7b' && part === 3 ? 2 : 1,
    gp: true, bookTrial: true, customVisuals: true, summary: true, bookNumber,
    workbookLesson: 'Starting with research skills: Lesson 2', bookPages: pages,
    eyebrow: `${label} · Book ${bookNumber} · Research Lesson 2 · Part ${part}`,
    catalog: { subjectId: 'global-perspectives-books', grades: [7], classes: [classId], unit: `Book ${bookNumber} · Research Lesson 2 · pp. ${pages}`, order: 3 + part },
    openingScript: `${objective} ${opening || 'Bring Book 7, a pencil, a second colour and a notebook. These three classroom lessons teach the single printed Research Lesson 2. Objectives 1.2, 1.3 and 1.4 on p. 7 are skill codes. No printing or student internet is needed. The original reading “Break spaces for everyone” is supplied on screen and in teacher notes; use the same text throughout. If using a different teacher text, choose three short paragraphs and adapt the models.'}`,
    pacingNote: '40-minute core. Keep the final goal check. Extra practice goes in the notebook.',
    stages
  };
}
const sourceNotes = `Teacher-provided text: Break spaces for everyone. Original classroom text, Mr. Friend’s lesson app, 12 October 2026. This explains possible research methods; it does not report a completed school investigation.\n${breakSpacesText.map((p, i) => `Paragraph ${i + 1}: ${p}`).join('\n')}`;
export const workbookResearch2Lessons = [
  lesson(1, 'Find information and the main idea', '7–10', 'Understand research, choose a fitting method and identify a text’s main idea.', [
    s('begin', 'Reconnect and set goals', 5, 'Use the actual best question from Research Lesson 1. If absent, help pupils choose from their previous questions. Read p. 7 goals and p. 8 self-assessment; leave achievement judgements until the end.', [
      f('Open Book 7 at pages 7 and 8', 'listen', ['Today: how to find information and what a text is mainly about.', 'Later: paragraph notes, then a short summary in your own words.']),
      task(8, 'Prior learning', ['Bring forward your best research question.', 'Write the question and explain why it is useful.'])
    ]),
    s('methods', 'Find information in different ways', 10, 'Research is a planned search for information to answer a question. Accept reading books/articles, watching informative media, asking/interviewing, surveys and observing. Explain that websites are sources, while searching is a way of locating them. Match the method to the question rather than claiming one is always best.', [
      task(9, 'Starter activity 1', ['List different ways to find information for research.', 'Try to fill all five rows.']),
      model('Which method would help?', ['How many pupils use a quiet area? How do they feel about it?', 'Would you observe, ask, read, or combine methods?'], 'Observation can provide a count at a stated time. Asking can explore reported feelings and reasons. A book or video can give background ideas, but cannot tell us this class’s views.'),
      task(9, 'Class discussion 2', ['Look back at your best question on page 8.', 'Write the best way to find information for that question.', 'Explain your choice to a partner.'])
    ]),
    s('read', 'Read the teacher’s text', 10, sourceNotes + '\nRead all three paragraphs aloud; revisit these frames through the step controls whenever needed. Pupils need the source, not only the model. Explain observing, researchers, patterns and replies. The passage supports the existing school-break topic while pupils retain their own research questions.', [
      task(9, 'Main activity · topic', ['Write today’s reading topic: school break spaces.', 'The text title is “Break spaces for everyone”.']),
      ...reading(),
      f('What is the whole text mainly about?', 'pair', ['Look for repeated ideas across all three paragraphs.', 'Explain the whole text in one sentence.', 'A single example is smaller than the main idea.'])
    ]),
    s('record', 'Record the main idea and topic words', 11, 'p. 9 tasks 1a–b continue into the upper table on p. 10. Record the whole-text idea here; save the lower paragraph table for Part 2. Pupils can mark subject words in their notebook copy or list them if they cannot underline an on-screen text. Do not tell them to mark the workbook instructions as the reading.', [
      task(10, 'Main activity 1a–b · upper table', ['Write the whole-text main idea in the left column.', 'Identify subject-specific words and write them in the right column.', 'For the on-screen text, list the words in your notebook instead of underlining them on screen.']),
      model('Check your idea and words', ['Does your sentence connect choices at break with finding out pupils’ needs?', 'Which words explain the topic or research methods?'], 'Possible main idea: Researchers can use observations and pupils’ replies to understand different break-space needs. Possible words: break spaces, activities, researchers, observing, record, patterns, replies. “School” alone is too broad; “some pupils read” is only one detail.'),
      task(10, 'Peer feedback 1c', ['Compare your main idea and words with a partner.', 'Explain a difference. Add helpful ideas in another colour.'])
    ]),
    s('finish', 'Check progress', 4, 'Return to p. 8. Pupils may achieve the research and main-idea goals while leaving note-taking as not there yet. Ask for an example rather than a compulsory achieved tick.', [
      task(8, 'Learning goals · first progress check', ['Check your research and main-idea goals honestly.', 'Add an example from today. Leave note-taking for the next lesson if needed.']),
      f('Keep your text and main idea', 'listen', ['Next lesson: turn each paragraph into useful notes.'], { final: true })
    ])
  ]),
  lesson(2, 'Make useful paragraph notes', '8–10', 'Identify paragraph main ideas and record key information in short notes in your own words.', [
    s('begin', 'Retrieve the main idea', 5, 'Use the upper p. 10 table from Part 1. Distinguish whole-text idea from a paragraph idea. Keep the source available throughout.', [
      f('Open page 10', 'think', ['Read your whole-text main idea and topic words.', 'Explain research to a partner in one sentence.']),
      f('Today’s target', 'listen', ['One main idea for each paragraph.', 'Short bullet notes that keep the meaning.'])
    ]),
    s('reread', 'Read and discuss each paragraph', 9, sourceNotes + '\nFollow p. 10 task 2: reread each paragraph and discuss what it is about. Use the same original source; return to it while writing.', [
      ...reading(),
      f('Give each paragraph a short heading', 'pair', ['Paragraph 1: what do different pupils need?', 'Paragraph 2: what can looking and counting show?', 'Paragraph 3: what do replies add?'])
    ]),
    s('model', 'Turn a sentence into notes', 7, 'Model with paragraph 1 after pupils try. A note can be a phrase; a summary uses connected sentences. Preserve qualifiers such as some and may. “In your own words” means preserve meaning, not replace every topic word.', [
      model('Which note keeps the meaning?', ['Text: “One activity may not meet everyone’s needs.”', 'A: Everyone dislikes games.', 'B: one activity → may miss some needs', 'Explain your choice.'], 'B keeps the cautious meaning in a short phrase. A invents a claim the source does not make.'),
      model('Try paragraph 1 notes first', ['State its main idea.', 'Choose two or three key points; avoid copying full sentences.'], 'Main idea: Different pupils need different break choices. Notes: active games / quiet reading or talk; choices for pupils; one activity may not suit all.')
    ]),
    s('write', 'Complete the paragraph table', 14, 'Allow about nine minutes independent writing and five minutes comparison/revision. p. 10 lower table: title, paragraph main ideas and key notes. Two useful bullets are better than three invented details. Partners explain disagreements against the source.', [
      task(10, 'Main activity 2a–b · paragraph table', ['Write the text title above the lower table.', 'Write a main idea for each of the three paragraphs.', 'Beside each idea, write two or three short bullet notes in your own words.']),
      f('Partner check: compare against the text', 'pair', ['Do the notes match the right paragraph?', 'Have you kept the key information and careful wording?', 'Improve one note after checking the source.']),
      model('Compare paragraphs 2 and 3', ['Explain your notes before revealing.', 'Keep the difference between observing and asking.'], 'Paragraph 2 idea: Observation records how spaces are used. Notes: activities + counts by area; different breaks / different patterns; cannot explain reasons. Paragraph 3 idea: Asking adds preferences and reasons. Notes: fair questions + careful records; compare replies with observations; name whose views / what is missing.')
    ]),
    s('finish', 'Check the note-taking goal', 5, 'Use actual notes as evidence on p. 8. Ensure the notebook/source and p. 10 notes are retained for Part 3.', [
      task(8, 'Learning goals · note-taking check', ['Check whether you can take notes in your own words.', 'Add one example from your page 10 table.', 'If not there yet, name what you will improve.']),
      f('Ready to use your notes', 'listen', ['Next lesson: write a short summary from the notes.'], { final: true })
    ])
  ]),
  lesson(3, 'Write and improve a summary', '8, 10–12', 'Use notes to write an accurate short summary, give peer feedback, revise and reflect on difficulties.', [
    s('begin', 'Retrieve your notes', 4, 'Use completed p. 10 notes. If unfinished, give a brief oral recap and help pupils finish one key note per paragraph. Do not display the final model before drafting.', [
      f('Open pages 10 and 11', 'pair', ['Tell your partner the whole-text main idea.', 'Use your notes to explain one point from each paragraph.']),
      f('What makes a useful summary?', 'think', ['Shorter than the source.', 'Includes the main idea and key information.', 'Uses your own wording without adding new claims.'])
    ]),
    s('source', 'Check notes against the source', 6, sourceNotes + '\nPupils reread the source before writing. A summary describes this text; it must not claim these methods have already produced findings.', [
      ...reading(),
      model('Spot a claim the source does not support', ['“The research proved every pupil wants a quiet space.”', 'What is wrong? How could we improve it?'], 'No completed research results are given, and pupils have different needs. A supported sentence is: The text explains how researchers could explore break-space needs using observation and questions.')
    ]),
    s('draft', 'Write a short summary', 13, 'Follow p. 11 task 3: discuss recorded information with a partner, then write using the five printed starters. Aim for about five concise sentences that fit the book; no fixed word limit is printed. Notes should guide the writing; pupils may revisit the source to check accuracy.', [
      f('Rehearse before writing', 'pair', ['Use your notes to explain the topic, main idea and three paragraphs.', 'Your partner checks for missing key information.']),
      task(11, 'Main activity 3 · text summary', ['Use the five printed sentence starters.', 'Include the topic, main idea and a key point from each paragraph.', 'Write in your own words. Keep it shorter than the reading.'])
    ]),
    s('feedback', 'Review and revise', 10, 'The printed Yes/No prompts can be ambiguous: ask partners to explain their judgement and identify wording that supports it. A good summary preserves the difference between counts and reasons, and includes uncertainty. Add a specific improvement on p. 11, then revise in book space or notebook.', [
      task(11, 'Peer feedback · questions 1–4', ['Exchange summaries. Is the length suitable?', 'Does it include key information? Is it in the writer’s own words?', 'Write one specific way to improve it.']),
      model('Compare a possible summary', ['Compare this example with your draft.'], 'The text is about break spaces. Its main idea is researching different pupils’ needs. The first paragraph explains the need for activity choices. The second shows how observation records use, but not reasons. The last describes fair questions, comparing replies with observations, and recognising missing information.'),
      f('Make one useful revision', 'think', ['Use your partner’s suggestion and check the text.', 'Correct a claim, add a missing key idea, or shorten repetition.', 'Read your improved summary aloud.'])
    ]),
    s('finish', 'Reflect independently and check goals', 7, 'Use the photographed p. 12 independent reflection after revision: allow four minutes for A–D and other skills, then about three minutes to check p. 8 and close. Pupils explain difficulties honestly; if an area was manageable, they can say why. Other skills are pupil-selected; listening, collaboration and giving feedback are examples, not a printed fixed list. The p. 12 Check your learning box sends pupils back to the p. 8 goals table. Accept not there yet with a specific next step. Collect the summary as evidence of main-idea selection, accurate notes and own-word writing.', [
      task(12, 'Independent reflection · A–B', ['Work on your own. Which parts were difficult? Explain why if you can.', 'A: knowing where to get information from.', 'B: identifying the main idea of a text.']),
      task(12, 'Independent reflection · C–D and other skills', ['C: writing down subject-specific words.', 'D: using your own words to write a text summary.', 'Write other skills you used today, with an example.']),
      task(8, 'Learning goals · final check', ['Review all three goals.', 'Give an example from your method choice, main idea or notes.', 'Say what helped your summary and what you still need to practise.']),
      f('Research Lesson 2 complete', 'listen', ['Keep your main idea, notes and revised summary together.'], { final: true })
    ])
  ])
];
