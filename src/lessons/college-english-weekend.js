const frame = (title, lines, seconds, extra = {}) => ({
  title, mode: 'pair', lines, timerSeconds: seconds, expectedSeconds: seconds, ...extra
});
const support = 'A2: model a short answer, allow 15 seconds to rehearse, and keep sentence starters visible. B1–B2: justify, ask for detail, compare alternatives and negotiate a compromise. Do not let stronger speakers answer for others. Students may invent personal details. Collect errors for later feedback; interrupt only when meaning breaks down.';
const stage = (id, title, durationMinutes, start, notes, frames) => ({
  id, title, durationMinutes, timeRange: `${start}–${start + durationMinutes} min`,
  notes: `${notes}\n${support}`, frames
});
const followUps = 'Ask: Why? Who with? What happened next? Can you give an example? What about you?';

export const collegeEnglishWeekendLesson = {
  id: 'college-english-weekend-rescue',
  title: 'Weekend Rescue: Talk, Plan, Change!',
  eyebrow: 'College English · Speaking · A2–B2 · Lesson 2',
  durationMinutes: 60, coreMinutes: 60, contentRevision: 1,
  classroomOnly: true, customVisuals: true,
  catalog: { subjectId: 'college-english', grades: [7, 8], unit: 'Speaking · Plans and problem-solving', order: 2 },
  openingScript: 'Today you will keep conversations going, explain preferences and negotiate a plan when something changes. You need a board and scrap paper, with no devices or worksheets. Most work happens in pairs or groups of four at the same time. Aim for every student to speak in every round. The timers are teacher-controlled planning guides.',
  stages: [
    stage('speed-chat', 'Speed chat: keep it going', 8, 0,
      'Model the three-turn exchange in the first minute. Each two-minute round: A speaks and B asks follow-ups for one minute, then swap for one minute. Signal the swap halfway. Change partners between rounds, or move one row if space permits; seated partner changes are fine. Use the final minute for pairs to recall something they learned. No whole-class reporting queue.', [
      frame('Answer + detail + question', [
        'A: “I like watching films at home because it is relaxing. What about you?”',
        'B: “I prefer the cinema. What was the last film you enjoyed?”',
        'A: “It was a comedy. I watched it with my cousin.”',
        'Your target: keep talking. Ask two follow-up questions each round.'
      ], 60, { mode: 'listen' }),
      ...[
        ['Your perfect free afternoon', 'What do you enjoy doing? Where? Who with?', 'What do you do when you have no money to spend?'],
        ['Something worth trying', 'What new activity would you like to try? Why?', 'What would make you nervous? Who could help?'],
        ['A plan that changed', 'Tell your partner about a plan that changed. Invent a story if you like.', 'What happened? What did you do instead? Did it turn out well?']
      ].map(([title, ...lines]) => frame(title, [...lines, 'One minute each: answer, give detail, ask back.', followUps], 120)),
      frame('Show you listened', [
        'Tell your partner one thing you remember about them.',
        '“You said … Have I understood correctly?”',
        'Your partner adds one more detail.'
      ], 60)
    ]),
    stage('detective', 'Find the surprising connection', 10, 8,
      'New pairs: one minute to choose questions, then four minutes of interviewing with two minutes per person. Give the swap signal. Allow three minutes to discover a connection beyond a one-word match, then two minutes to tell another pair. Students may use invented details and need not disclose private information.', [
      frame('Choose three questions', [
        'What activity makes you forget the time?',
        'What can you teach someone in ten minutes?',
        'What place near here would you recommend? Why?',
        'What food or activity would you like to try?',
        'Do you prefer planning everything or deciding on the day?',
        'Which is more important on a day out: the place or the people?'
      ], 60, { mode: 'think' }),
      frame('Interview: two minutes each', [
        'Ask your three chosen questions. Follow up on each answer.',
        '“Tell me more about …” / “How did you learn that?”',
        '“When did you last …?” / “What would you recommend?”',
        'Swap after two minutes. Remember a detail, not just a yes or no.'
      ], 240),
      frame('Find your connection', [
        'Find two things you have in common and one difference.',
        'Go deeper: why do you both like it? Are your reasons the same?',
        '“We both …, but I … and you …”',
        'Challenge: agree on an activity you could enjoy together.'
      ], 180),
      frame('Tell another pair', [
        'Each person shares one discovery about their partner.',
        'The listeners each ask a follow-up question.',
        '“Were you surprised?” / “Could all four of us enjoy that?”'
      ], 120)
    ]),
    stage('roleplay', 'Say it another way', 12, 18,
      'Same pairs. Take one minute to model a polite invitation, refusal and alternative. Each three-minute role-play has a fresh situation; swap the inviter halfway so both students practise both roles. Give the swap signal at 90 seconds. A refusal should lead to a new suggestion rather than end the conversation. Use the last two minutes to repeat one exchange more fluently.', [
      frame('Invite, respond, suggest', [
        '“Would you like to …?” / “How about …?”',
        '“That sounds good. What time?”',
        '“I’d like to, but … Could we … instead?”',
        '“That works for me.” / “Let’s meet at …”',
        'Challenge: “I see your point, although …” / “What if we …?”'
      ], 60, { mode: 'listen' }),
      frame('Round 1: different interests', [
        'A wants an active afternoon outdoors. B wants something quiet.',
        'Invite your partner. Explain what you like and ask about their preference.',
        'Agree on a plan with something for both people.',
        'After 90 seconds swap roles and make a different plan.'
      ], 180),
      frame('Round 2: different budgets', [
        'A suggests an activity costing 12 credits. B can spend only 6.',
        'Credits are imaginary money for this task.',
        'Refuse politely, explain the problem and suggest an alternative.',
        'Agree on an affordable plan. Swap roles halfway.'
      ], 180),
      frame('Round 3: a late change', [
        'You planned to meet at 11:00. One person is now free only after 13:00.',
        'The other person must leave by 15:00.',
        'Explain the change. Ask questions and agree on a time and activity.',
        'Swap who explains the change halfway through.'
      ], 180),
      frame('Try again, more smoothly', [
        'Repeat your hardest conversation without reading every starter.',
        'Both people: ask a question, give a reason and suggest an alternative.',
        'Finish with a clear agreement: what, where and when?'
      ], 120)
    ]),
    stage('plan', 'The weekend challenge', 15, 30,
      'Groups of four; groups of three combine roles C and D. Assign A–D aloud; preferences are public, so there are no secret cards to copy. Give one minute to read, then one minute per person to explain their preference. During seven-minute negotiation, everyone must ask a question and propose a compromise. Allow three minutes to rehearse the plan. Each member explains a different part. All prices and travel conditions are fictional.', [
      frame('Four friends, one afternoon', [
        'Plan Saturday from 12:00 to 16:00. Budget: 15 credits per person.',
        'Choose two activities. Everyone stays together. Walking takes no time in this imaginary town.',
        'A wants something active. B wants time to talk.',
        'C wants a new experience. D wants to spend no more than 10 credits.',
        'Help each other meet all four preferences.'
      ], 60),
      frame('Everyone explains their priority', [
        'One minute each: say what you want and why.',
        'Ask the speaker one question before the next person begins.',
        '“For me, … matters because …”',
        '“Would you be happy with …?” / “What do you mean by …?”'
      ], 240),
      frame('Choose and negotiate', [
        'Park games: 60 minutes, free. Café: 60 minutes, 4 credits.',
        'Bowling: 60 minutes, 8 credits. Art workshop: 90 minutes, 6 credits.',
        'Food market: 60 minutes, 5 credits. Museum: 60 minutes, free.',
        'Choose two activities, set start/end times and check the cost per person.',
        'Everyone asks a question and proposes a compromise.',
        '“Could we combine … with …?” / “That would work if …”'
      ], 420),
      frame('Rehearse your agreement', [
        'A explains the activities. B explains the times.',
        'C explains the cost. D explains how you included everyone.',
        'Only write keywords. Check: does everyone accept the plan?',
        'Challenge: which alternative did you reject, and why?'
      ], 180)
    ]),
    stage('rescue', 'Rescue the plan', 10, 45,
      'Reveal only the first change initially. Groups have four minutes to negotiate a replacement plan. Then reveal the second change and give three minutes; use any spare time for breaks or conversation, but keep the time window, two activities and public preferences. Finally pair groups: each has one minute to explain its rescue and 30 seconds for a listener question. Keep everyone involved; avoid a single reporter.', [
      frame('Change 1: the weather turns', [
        'It will rain all afternoon. Park games are unavailable.',
        'If your plan used the park, replace it. Otherwise, propose a second possible plan.',
        'All other activities stay available indoors at the same prices and lengths.',
        'Everyone suggests one solution. Agree together; check times and costs.',
        '“Our first idea will not work because … We could … instead.”'
      ], 240),
      frame('Change 2: less time!', [
        'Now everyone must leave at 14:30. You still start at 12:00.',
        'Keep two activities and spend no more than 10 credits per person.',
        'Check the activity lengths. Explain what you can keep or change.',
        'Challenge: persuade a friend who dislikes your compromise.'
      ], 180),
      frame('Tell another group how you rescued it', [
        'Each group has one minute. Everyone contributes a sentence.',
        '“Originally, we planned … Then … So we decided …”',
        'Listeners: use 30 seconds to ask a question.',
        'Does the new plan fit the time, budget and different preferences?'
      ], 180)
    ]),
    stage('finish', 'Speak again and notice progress', 5, 55,
      'New partners: one minute per student to explain the rescue without a script; partner asks one follow-up. Then use two minutes for two useful expressions and two anonymous corrections collected during the lesson. The final minute is a spoken exit, 30 seconds each. Praise specific communication moves such as inviting someone in or asking a real follow-up.', [
      frame('One-minute story: no script', [
        'Tell a new partner: what was your plan, what changed, and how did you solve it?',
        'Partner: listen and ask one follow-up question. Swap after one minute.',
        'Try to give a reason and use “but”, “so” or “instead”.'
      ], 120),
      frame('Make our language clearer', [
        'Look at the examples your teacher writes on the board.',
        'Notice two expressions that helped the conversation.',
        'Improve two anonymous sentences with your partner. Explain your changes.'
      ], 120),
      frame('Before you go: both speak', [
        '“Today I kept a conversation going by …”',
        '“One useful phrase I can use again is …”',
        '“Next time I want to …”',
        'Listen to your partner, then check your space and listen for dismissal.'
      ], 60, { final: true })
    ])
  ]
};
