const frame = (title, lines, seconds, extra = {}) => ({title, lines, mode:'pair', timerSeconds:seconds, expectedSeconds:seconds, ...extra});
const stage = (id, title, start, durationMinutes, notes, frames) => ({id, title, durationMinutes, timeRange:`${start}–${start + durationMinutes} min`, notes, frames});
const picture = (name, alt) => ({image:`../college-english/images/${name}.png`, alt, caption:'Look closely: what can you see, and what might be happening?'});
const scenes = [
 ['The unexpected student','penguin','A penguin in a suit raises its flipper in a university lecture hall.',[
  'What do you see? Describe three details.','How are the other students reacting?','What question does the penguin want to ask?','Why might the penguin be wearing a suit?','What subject is the class studying? Why?',
  'What happened five minutes before this picture?','Would the penguin be a good classmate? Why?','What would you say if the penguin sat next to you?','What might the professor say next?','Give the picture a funny title.']],
 ['The chef’s special','chef','A dog chef presents a huge sandwich to a surprised customer.',[
  'Describe the customer’s expression. What might he be thinking?','What ingredients can you see?','Why is the sandwich so enormous?','How much should it cost? Explain.','Would you eat it? Why or why not?',
  'What is the chef proud of?','What would be a good name for the restaurant?','What could go wrong if the customer eats it alone?','What might an online review say?','Invent a line of dialogue for each character.']],
 ['The suitcase surprise','suitcase','A traveler discovers tiny people inside a suitcase on a train.',[
  'Where are the people? What unusual thing can you see?','How does the traveler feel?','Who might the tiny people be?','How did they get into the suitcase?','What might they need from the traveler?',
  'Where could they be traveling?','What problems would you face if you were very small?','What would you do first?','Would you tell the passengers or keep it secret? Why?','What should happen next?']],
 ['A very unusual audience','robots','A student presents to an audience of robots.',[
  'What is the person doing?','Describe two things you notice about the audience.','What might the presentation be about?','How does the presenter probably feel? Why?','What might the robots ask afterward?',
  'Would you rather present to robots or humans? Why?','What makes a presentation interesting?','What should a speaker do when the audience seems bored?','If a robot interrupted, what might it say?','Give the presentation a surprising title.']],
 ['The busiest cashier','octopus','An octopus works as a cashier in a supermarket.',[
  'What is happening in the supermarket?','What tasks is the cashier trying to do?','What might the customers be thinking?','Would eight arms make this job easier? Why?','What other job might an octopus be excellent at?',
  'What job might be difficult for an octopus?','Is the cashier having a good or stressful day? What clues do you see?','What would you say to the cashier?','What questions were asked at the job interview?','Create a short advertisement for the supermarket.']]
];
const pictureStages = scenes.map(([title,name,alt,questions], index) => stage(`picture-${name}`, title, 20 + index * 6, 6,
 '0:00–0:30: show the picture silently. 0:30–1:30: ask three students for things they can see; point to each detail. 1:30–3:00: partners discuss the first questions. 3:00–4:30: ask different students what might be happening and follow up with “What makes you think that?” 4:30–5:30: ask someone to invent dialogue; invite another student to answer in character. 5:30–6:00: take two funny titles and let the class choose. Use Next step to reveal the second question set. Not every question needs an answer.', [
  frame('What do you see? '+title, questions.slice(0,5), 180, {illustration:picture(name,alt)}),
  frame('Imagine the story: '+title, questions.slice(5), 180, {illustration:picture(name,alt)})
 ]));

export const collegeEnglishWeirdLesson = {
 id:'college-english-ordinary-life-gets-weird', title:'When Ordinary Life Gets Weird',
 eyebrow:'College English · Speaking · Picture conversations', durationMinutes:120, coreMinutes:120, contentRevision:2,
 classroomOnly:true, customVisuals:true,
 catalog:{subjectId:'college-english',grades:['college'],classes:['college'],unit:'Speaking · Pictures and imagination',order:3},
 openingScript:'A two-hour teacher-guided speaking lesson with five humorous pictures, an around-the-room question round, storytelling, role-play and discussion. Read each stage’s teacher notes for a minute-by-minute plan. Students can invent details. The ten-minute break begins at minute 65.',
 stages:[
  stage('warmup','Would you rather?',0,10,'Minutes 0–2: welcome students and answer the first question yourself, with a reason. Minutes 2–6: pairs take turns choosing and explaining; circulate and ask “Why?” Minutes 6–9: ask four students from different parts of the room and invite classmates to disagree. Minute 9–10: ask whose answer surprised them. Students can invent answers or say “come back to me.”',[
   frame('Choose and explain', ['Penguin professor or dog boss?','Talk to animals or understand every human language?','Embarrassing message to the class or wave at someone who was not waving at you?','Presentation in pajamas or sing your introduction?','Why? What could go wrong?'],300),
   frame('More impossible choices', ['No phone for a month or no favorite food?','Know everyone’s thoughts or never take another exam?','Famous for something wonderful or something ridiculous?','Always 20 minutes early or 10 minutes late?','Would your answer change after a year?'],300)
  ]),
  stage('language','Useful language',10,10,'Minutes 10–13: read and model the describing expressions. Minutes 13–16: demonstrate a follow-up with a volunteer. Minutes 16–19: partners practise the umbrella example. Minute 19–20: ask two pairs to share an observation and a possible explanation. Recast an unclear sentence gently; accept short answers.',[
   frame('Describe and suggest',['“In the foreground, I can see…” / “In the background…”','“Maybe…” / “It looks as if…” / “They might be…”','“I think that because…” / “One possible explanation is…”'],240,{mode:'listen'}),
   frame('Keep the conversation going',['“What makes you think that?” / “What happened next?”','“That’s a good point.” / “I see it differently because…”','“If I were there, I would…” / “I wonder what would happen if…”'],180,{mode:'listen'}),
   frame('Quick practice',['A person is carrying an umbrella indoors.','Give one observation, one possible explanation, and one question.','What can you actually see? What are you imagining?'],180)
  ]),
  ...pictureStages,
  stage('teacher-round','Around the room: keep it going',50,15,'Spend three minutes on each screen. First give everyone 15 seconds to rehearse with a neighbour. Ask three to five students from different parts of the room; after each answer ask a follow-up, then invite another student to respond. For the final 30 seconds, partners compare answers. Say “come back to me” is fine; return after rehearsal. Accept a short answer and prompt “because…”; challenge confident speakers to explain a consequence or disagree politely.',[
   frame('A surprise classmate',['A penguin joins our class. What would you ask it?','What would it be good at? What might it find difficult?','What funny rule would it suggest for class?','Teacher follow-up: “What makes you think that?”'],180,{mode:'share'}),
   frame('The strange restaurant',['What is the strangest restaurant you can imagine?','What is on the menu? Who works there?','Would you take a friend? Why or why not?','Teacher follow-up: “Who would order something different?”'],180,{mode:'share'}),
   frame('Small enough for a suitcase',['If you were tiny for a day, where would you explore?','What ordinary object would be useful?','What might be dangerous or funny?','Teacher follow-up: “How would you solve that?”'],180,{mode:'share'}),
   frame('A robot in your life',['What job would you give a robot?','What should a robot never do for you? Why?','What would happen if your robot misunderstood an instruction?','Teacher follow-up: “Does anyone have a different idea?”'],180,{mode:'share'}),
   frame('Eight arms, one busy day',['If you had eight arms for a day, what would you do?','Which job would become easier? Which would still be difficult?','What is the funniest mistake you could make?','Teacher follow-up: “Would you keep the eight arms? Why?”'],180,{mode:'share'})
  ]),
  stage('break','Break',65,10,'Take a ten-minute break. The question is optional for early returners.',[
   frame('Take a break',['Optional: Which picture would make the best movie?','What would you call it?'],600,{mode:'think'})
  ]),
  stage('story','The story behind the picture',75,15,'Minutes 75–77: model a three-sentence story using one picture. Minutes 77–83: groups of three or four create their own; visit each group and ask who, what went wrong, and what happens next. Minutes 83–87: groups tell another group their story, with each student contributing. Minutes 87–90: invite two endings and ask the class to compare them.',[
   frame('Create your story',['Choose one picture. Who are the characters and where are they?','What happened before the picture? What unexpected problem appeared?','What does each character want? What does someone say?','How do they solve the problem? What is the final surprise?','Start: “It was an ordinary morning until…”'],480),
   frame('Share and listen',['Tell your story to another group. Everyone contributes.','Listeners: What was your favorite detail?','What would you change about the ending?','What question would you ask a character?'],420,{mode:'share'})
  ]),
  stage('roleplay','This is getting weird',90,15,'Minutes 90–92: model a short exchange with a volunteer. Minutes 92–95: pairs select and prepare a situation. Minutes 95–100: pairs perform for another pair, then swap. Minutes 100–103: repeat with swapped roles or a new situation. Minutes 103–105: invite one exchange and ask the audience “What happened after that?” Circulate and prompt both partners to ask a question.',[
   frame('Choose a role-play',['The penguin wants to join the professor’s class.','A customer ordered a small lunch; the dog chef brought a giant sandwich.','The traveler discovers a tiny person in the suitcase.','A robot interrupts a presentation.','What does each person want? What problem must they solve?'],180),
   frame('Speak, listen, solve',['“Excuse me, but could you explain…?”','“I understand, but there’s a problem.”','“What if we…?” / “That could work.”','Perform for another pair; then switch roles or situations.','Audience: “What happened after that?”'],720)
  ]),
  stage('opinions','Agree, disagree, or it depends',105,10,'Minutes 105–106: explain agree, disagree and it depends. Minutes 106–113: choose four or five statements; for each, students signal their choice, rehearse with a partner, and two students give different reasons. Ask “Can you give an example?” and “Who sees it differently?” Minutes 113–115: ask if anyone changed their mind and why.',[
   frame('What do you think?',['Animals would make better coworkers than humans.','It is better to be funny than serious in a presentation.','Everyone should work in customer service at least once.','A good teacher should always know the answer.','Technology makes communication easier.'],300),
   frame('Explain your opinion',['Pets should be allowed at college.','A surprising experience is more valuable than a perfect plan.','It is better to ask a silly question than stay confused.','The best meals are shared with others.','Being able to laugh at yourself is an important skill.'],300)
  ]),
  stage('exit','Exit ticket',115,5,'Students write short answers. Invite a few students to share a favorite question.',[
   frame('Before you go',['Which picture was your favorite? Why?','Write one sentence about a picture using “might” or “could”.','Write one question for a character from a picture.','What useful English expression did you use or hear today?'],300,{mode:'think',final:true})
  ])
 ]
};
