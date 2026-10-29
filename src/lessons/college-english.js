const frame = (title, mode, lines, seconds, extra = {}) => ({
  title, mode, lines, timerSeconds: seconds, expectedSeconds: seconds, ...extra
});
const support = 'A2: allow brief rehearsal and short answers using the visible sentence starters. B1–B2: ask for examples, alternatives and disadvantages. Invite quieter classmates into the conversation. Use invented details if preferred. Correct mainly when meaning breaks down; collect other errors for the final feedback.';
const stage = (id, title, durationMinutes, start, notes, frames) => ({
  id, title, durationMinutes, timeRange: `${start}–${start + durationMinutes} min`,
  notes: `${notes}\n${support}`, frames
});

export const collegeEnglishLesson = {
  id: 'college-english-school-better',
  title: 'Make Our School Better',
  eyebrow: 'College English · Speaking · A2–B2',
  durationMinutes: 60, coreMinutes: 60, contentRevision: 1,
  classroomOnly: true, customVisuals: true,
  catalog: { subjectId: 'college-english', grades: [7, 8], unit: 'Speaking · A2–B2', order: 1 },
  openingScript: 'Today we will give opinions, ask follow-up questions and make a group decision. We will design a school event and persuade classmates to choose it. You need only the board and paper. Every student should speak during each activity.',
  stages: [
    stage('choices', 'Quick choices', 8, 0,
      'Model the first exchange. Read one choice at a time and allow both partners to speak. Change partners after the third choice. Keep the phrases visible on the board. The first minute includes the model; then allow about a minute per choice.', [
      frame('Choose, explain, ask', 'listen', [
        'Give an opinion. Add a reason. Ask your partner a question.',
        '“I’d rather have a longer lunch because I could relax with friends. What would you do with the extra time?”',
        'Today: everyone gives opinions, asks follow-up questions and helps make a decision.'
      ], 60),
      ...[
        'Start school later or finish school earlier?',
        'Have a longer lunch or more short breaks?',
        'Do projects or take tests?',
        'Study outside or in a classroom?',
        'Have a music festival or a sports festival?',
        'Learn cooking or filmmaking?'
      ].map((prompt, i) => frame(prompt, 'pair', [
        'Both partners: choose and explain why. Ask a follow-up question.',
        'Start: “I choose … because …” / “What about you?”',
        'Challenge: explain one disadvantage of your own choice.',
        ...(i === 3 ? ['Work with a new partner now.'] : [])
      ], 70))
    ]),
    stage('interviews', 'School-life interviews', 10, 8,
      'A interviews B for four minutes, then swap for four minutes. Each interviewer asks at least two follow-up questions. Use the last two minutes to hear interesting things students learned about their partners.', [
      ...['A interviews B', 'Swap: B interviews A'].map(title => frame(title, 'pair', [
        'What is the best part of your school day? Why?',
        'Which new subject would you like to try?',
        'Where do you like spending time during breaks?',
        'What makes a lesson interesting?',
        'What school rule would you change? Why?',
        'What activity could help new students make friends?'
      ], 240, { cue: 'Ask at least two follow-ups: Why? How often? Who with? Tell me more. Can you give an example? Has that happened to you?' })),
      frame('What did your partner say?', 'share', [
        'Share one interesting thing your partner said.',
        '“My partner thinks … because …”',
        'Listen: what do you have in common?'
      ], 120)
    ]),
    stage('event', 'Plan a school event', 17, 18,
      'Groups of 3–4. Assign discussion leader, question asker, timekeeper and reporter; combine the last two roles in groups of three. Give one minute of quiet thought, then 30 seconds per student to suggest an idea before deciding. Use keywords only for notes. Split the remaining planning across the two discussion screens.', [
      frame('Your challenge', 'think', [
        'Plan one special afternoon that many different students will enjoy.',
        'You have three hours, a small budget, the school building and the playground.',
        'Think of an idea: food and culture, sports and games, music and talent, film and storytelling, art and photography — or your own idea.'
      ], 60),
      frame('Everyone suggests an idea', 'pair', [
        'Each person has 30 seconds. Listen to every idea before choosing.',
        '“I think we should … because …”',
        '“I agree because …” / “I’m not sure. Maybe we could …”',
        'Choose your event together. Ask: “What about you?”'
      ], 120),
      frame('Make your plan', 'pair', [
        'What is your event called?',
        'What three activities will students do?',
        'Where will each activity happen?',
        'What equipment or materials do you need?',
        'Start: “Let’s have a …” / “Students can …” / “We need …”'
      ], 420),
      frame('Make it work for everyone', 'pair', [
        'What can students do if they dislike performing or sports?',
        'Why will students want to come?',
        'Challenge: how will you keep costs low? What might go wrong?',
        'Which idea did you reject, and why?',
        'Prepare a two-minute pitch. Every member must speak. Use keywords only.'
      ], 420)
    ]),
    stage('pitch', 'Pitch and question', 15, 35,
      'Pair two groups together, rather than presenting one group at a time to the whole class. A presents for two minutes and B asks questions for two; swap for four more minutes. Discuss combined ideas for five minutes, then hold a two-minute spoken vote. Every group member speaks in the pitch.', [
      frame('Group A: persuade your listeners', 'share', [
        'Present your event. Every member speaks.',
        'Explain the activities, location, materials and why students will enjoy it.',
        'Listeners: prepare a question.'
      ], 120),
      frame('Group B: ask questions', 'pair', [
        'Why did you choose this event? What do I do when I arrive?',
        'Can beginners join? What if it rains?',
        'What if too many students come? What is your cheapest activity?',
        'What makes it different? How would you persuade someone who is not interested?'
      ], 120),
      frame('Group B: your pitch', 'share', [
        'Present your event. Every member speaks.',
        'Explain why your plan will work for different students.',
        'Group A: listen and prepare a question.'
      ], 120),
      frame('Group A: ask questions', 'pair', [
        'Can you give an example? How will you keep costs low?',
        'What if it rains or too many students arrive?',
        'Can beginners join? What makes your event different?',
        'Presenters: answer with a reason or example.'
      ], 120),
      frame('Combine your best ideas', 'pair', [
        'Which features from the two events could work together?',
        'What would you keep? What would you change?',
        '“I see your point, but …” / “What if we …?”',
        'Invite everyone: “What do you think?”'
      ], 300),
      frame('Vote and explain', 'share', [
        'Choose an event other than your own.',
        '“I’d choose … because …”',
        '“I especially like their idea of …”'
      ], 120)
    ]),
    stage('reflect', 'Reflect, improve and finish', 10, 50,
      'New partners discuss for five minutes. During the lesson collect two strong phrases and two anonymous sentences to improve. Put these on the board for three minutes of pair correction and teacher feedback. Finish with a two-minute spoken exit task. Do not invent student mistakes in advance.', [
      frame('Talk with a new partner', 'pair', [
        'Which idea today surprised you?',
        'Did you change your mind about anything?',
        'What did you contribute to your group?',
        'What would you improve about your event?',
        'Would you actually attend it? Why or why not?'
      ], 300),
      frame('Improve our English', 'pair', [
        'Look at the examples your teacher writes on the board.',
        'Which phrases helped people explain their ideas?',
        'Improve the two sentences with your partner.',
        'Explain your changes. Then check together.'
      ], 180),
      frame('Your final opinion', 'pair', [
        '“One change I’d like at our school is …”',
        '“It would help because …”',
        'Both partners speak. Ask one final follow-up question.',
        'Check your space and listen for dismissal.'
      ], 120, { final: true })
    ])
  ]
};
