// Teacher-led question banks for the extended Weekend Rescue lesson.
// One bank screen is a three-minute conversation, not a three-minute monologue.
const round = (id, title, start, notes, cards) => ({
  id, title, durationMinutes: 15, timeRange: `${start}–${start + 15} min`,
  notes: `Walk around the room and ask students directly. For each three-minute screen: give everyone 15 seconds to try an answer with a neighbour, invite 3–5 students from different parts of the room, ask a follow-up, then invite a classmate to react or ask the next question. Choose from the questions; do not rush through every one. Keep a simple seating-plan tally so you reach different students. Students may say “come back to me” and rehearse before you return. A2: accept a short answer, then prompt “because…”. B1–B2: ask for an example, consequence or counterargument. Invented answers are welcome. ${notes}`,
  frames: cards.map(([title, questions, starter, followUp]) => ({
    title, mode: 'share', timerSeconds: 180, expectedSeconds: 180,
    lines: [...questions, `Start: ${starter}`, `Ask back: ${followUp}`],
    cue: 'Teacher: move around the room. Ask someone, follow up, then invite a classmate to respond. Everyone rehearses briefly with a neighbour first.'
  }))
});

export const weekendQuestionRounds = [
  round('teacher-hot-seat', 'Around the room: the impossible weekend', 8,
    'Keep the tone playful. Model one imaginative answer yourself. After an answer ask “Who would choose something different?” or “Who wants to go with them, and why?” Listen for reasons rather than a correct answer. Finish each screen with two neighbours comparing their own choices.', [
    ['A ridiculous superpower', [
      'For one weekend you can fly, become invisible, or talk to animals. Which do you choose?',
      'What is the first thing you do? What could go wrong?',
      'Which power would be the most annoying to live with?'
    ], 'I would choose … because …', 'Would you choose the same power? Why?'],
    ['Your very strange guest', [
      'An alien is visiting for Saturday. Where do you take it first?',
      'Which everyday thing would confuse it the most?',
      'How would you explain a school, a pizza or a football match?'
    ], 'First, I would show it …', 'What would the alien ask us?'],
    ['Swap lives for a day', [
      'Would you rather be a famous singer, a professional gamer, or the school principal for one day?',
      'What would you do first? What would be difficult?',
      'If you were principal, what funny but useful rule would you introduce?'
    ], 'If I were …, I would …', 'Would your idea work in real life?'],
    ['The mystery door', [
      'Three doors lead to a beach, a snowy mountain, or a city in the future. Which do you open?',
      'You may take only one object. What do you bring?',
      'Which classmate would be a useful travel partner, and what skill would they bring?'
    ], 'I would open … and bring …', 'What if you could not come home until Monday?'],
    ['A weekend without the usual things', [
      'No phones or internet for 48 hours: what would you actually do?',
      'You can invent one new game for your friends. How does it work?',
      'Would the weekend be better or worse? Convince us.'
    ], 'We could … The best part would be …', 'Who disagrees, and why?']
  ]),
  round('teacher-would-you-rather', 'Choose a side: defend the silly choice', 33,
    'Read the two options, then let everyone signal A or B from their seat. Ask one student on each side to explain. Visit another part of the room for a challenge question. Students can change their vote after hearing a convincing reason. Ask “Whose answer changed your mind?” No physical movement or public scoring is needed.', [
    ['The strange restaurant', [
      'A: eat your favourite meal every day for a month. B: try a completely new meal every day.',
      'What meal would you choose? What food would you refuse to try?',
      'Invent the strangest pizza that might actually taste good.'
    ], 'I choose A/B because …', 'Would you still choose that after two weeks?'],
    ['The awkward talent', [
      'A: sing every time you answer a question. B: dance every time you enter a room.',
      'Which would be less embarrassing? When would it cause trouble?',
      'Could you turn it into a useful talent? How?'
    ], 'I would rather … because …', 'What would happen during an exam?'],
    ['The tiny travel problem', [
      'A: travel anywhere, but carry a giant teddy bear. B: travel only nearby, with whatever you want.',
      'Where would you go? What would people say?',
      'Give the teddy bear a name and explain its job on the trip.'
    ], 'I would go to … The problem is …', 'How would you solve that problem?'],
    ['Time travel trouble', [
      'A: visit your town 100 years ago. B: visit it 100 years in the future.',
      'What do you most want to see? What would you ask someone?',
      'What modern object would you take to the past, or bring back from the future?'
    ], 'I want to find out whether …', 'What might surprise you most?'],
    ['The dream weekend trade-off', [
      'A: a free trip, but a stranger plans everything. B: stay nearby and choose everything yourself.',
      'What would make you accept the free trip? What would be a deal-breaker?',
      'Can you persuade someone on the other side to change their choice?'
    ], 'I understand your point, but …', 'What would make you change your mind?']
  ]),
  round('teacher-story', 'Story trouble: what happened next?', 60,
    'Tell each short opening aloud. Ask one student for a next event, another for a reason, and another for a solution. Each response should connect to what was said before. After three responses ask pairs to invent a different ending, then hear one. Use “First … then … but … so … finally …” on the board. Accept present-tense storytelling from A2 students; offer past-tense reformulations without stopping the story.', [
    ['The wrong bag', [
      'You arrive for a picnic and open your bag. Inside are 20 rubber ducks and one sock.',
      'Whose bag is it? Where is your lunch? What do you do next?',
      'How could the ducks unexpectedly save the day?'
    ], 'First … Then we realised …', 'Why were the ducks there?'],
    ['The mysterious message', [
      'Your friend texts: “Do not bring the cake. Bring a spoon and a hat. I will explain later.”',
      'Where are you going? What has happened?',
      'What do you reply? Give the story a surprising ending.'
    ], 'Maybe … I would reply …', 'What clue makes you think that?'],
    ['Famous for the wrong reason', [
      'You enter a café. Everyone starts clapping and someone asks for your autograph.',
      'Who do they think you are? What do you say?',
      'Your friend makes the situation more confusing. What do they do?'
    ], 'They think I am …, so I …', 'How do you explain the mistake?'],
    ['The worst tour guide', [
      'Your tour guide says: “I have never been here before. Who knows where we are?”',
      'You have a map, a sandwich and a toy compass. What is your plan?',
      'A friendly local offers help, but speaks only in song. What happens?'
    ], 'We could use … to …', 'What is your backup plan?'],
    ['The unexpected ending', [
      'Your boring Saturday becomes the best day of the year because of one small mistake.',
      'What was the mistake? Who did you meet? What changed?',
      'Tell a two-sentence ending, then ask someone to improve it.'
    ], 'We meant to …, but … In the end …', 'Would you want this to happen to you?']
  ]),
  round('teacher-pitch', 'Sell me the funniest day out', 100,
    'Keep groups from the planning challenge. For each screen allow 30 seconds of group preparation, then visit several groups and question a different member each time. Ask classmates to act as customers and challenge the answer. Each group invents a clearly fictional event; absurd ideas are welcome if they can explain how the event works. No written advert is needed. At the end let everyone tell a neighbour which event they would book and why.', [
    ['Invent a wonderfully weird attraction', [
      'Choose or invent: a silent disco for dogs, an upside-down café, or a museum of terrible inventions.',
      'What is its name? What do visitors actually do there?',
      'Why would anyone pay to visit?'
    ], 'Welcome to … Here you can …', 'Who is this attraction perfect for?'],
    ['Teacher as a difficult customer', [
      '“I am bored very easily. Why should I come?”',
      '“I do not like crowds. What can you offer me?”',
      '“My friend thinks your idea is ridiculous. Convince them.”'
    ], 'You might enjoy … because …', 'What do you normally enjoy doing?'],
    ['Explain your strangest rule', [
      'Your event must have one strange rule: everyone wears a hat, speaks in rhyme, or walks backwards in one safe game area.',
      'Choose a rule or invent a safer alternative. Why does it make the event fun?',
      'What can visitors do if they cannot or do not want to follow it?'
    ], 'Our rule is … Visitors can also …', 'Would that put anyone off?'],
    ['Handle a ridiculous complaint', [
      '“Your talking robot keeps calling me Grandma!” What do you say?',
      '“The mystery snack is just a carrot!” How do you respond?',
      '“It rained during your indoor beach party!” Explain and offer a solution.'
    ], 'I am sorry about … We can offer …', 'Would that solution make you happy?'],
    ['The final sales pitch', [
      'Give your event a ten-second slogan. Make us remember it.',
      'A classmate asks: “Why is your event better than staying home?”',
      'Which other group would you book? Explain your choice to a neighbour.'
    ], 'Try … because you will never forget …', 'What is included in the price?']
  ])
];
