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
 'Give students 30 seconds to look silently, four minutes to discuss in pairs, then invite answers and a funny caption. Choose questions that keep the conversation moving. Ask students to distinguish observation from imagination.', [
  frame('What do you see? '+title, questions.slice(0,5), 180, {illustration:picture(name,alt)}),
  frame('Imagine the story: '+title, questions.slice(5), 180, {illustration:picture(name,alt)})
 ]));

export const collegeEnglishWeirdLesson = {
 id:'college-english-ordinary-life-gets-weird', title:'When Ordinary Life Gets Weird',
 eyebrow:'College English · Speaking · Picture conversations', durationMinutes:120, coreMinutes:120, contentRevision:1,
 classroomOnly:true, customVisuals:true,
 catalog:{subjectId:'college-english',grades:['college'],classes:['college'],unit:'Speaking · Pictures and imagination',order:3},
 openingScript:'A two-hour speaking lesson with five original humorous pictures, observation, speculation, storytelling, role-play and discussion. Students can invent details. Use the ten-minute break as needed. The full printable teacher guide is in college-english/when-ordinary-life-gets-weird.md.',
 stages:[
  stage('warmup','Would you rather?',0,10,'Pairs choose, explain and ask follow-up questions. Invite a few surprising answers.',[
   frame('Choose and explain', ['Penguin professor or dog boss?','Talk to animals or understand every human language?','Embarrassing message to the class or wave at someone who was not waving at you?','Presentation in pajamas or sing your introduction?','Why? What could go wrong?'],300),
   frame('More impossible choices', ['No phone for a month or no favorite food?','Know everyone’s thoughts or never take another exam?','Famous for something wonderful or something ridiculous?','Always 20 minutes early or 10 minutes late?','Would your answer change after a year?'],300)
  ]),
  stage('language','Useful language',10,10,'Model observation versus a possible explanation. Partners try the umbrella example.',[
   frame('Describe and suggest',['“In the foreground, I can see…” / “In the background…”','“Maybe…” / “It looks as if…” / “They might be…”','“I think that because…” / “One possible explanation is…”'],240,{mode:'listen'}),
   frame('Keep the conversation going',['“What makes you think that?” / “What happened next?”','“That’s a good point.” / “I see it differently because…”','“If I were there, I would…” / “I wonder what would happen if…”'],180,{mode:'listen'}),
   frame('Quick practice',['A person is carrying an umbrella indoors.','Give one observation, one possible explanation, and one question.','What can you actually see? What are you imagining?'],180)
  ]),
  ...pictureStages,
  stage('detectives','Picture detectives',50,10,'Pairs choose a picture and make their list, then join another pair. The other pair guesses which picture they chose.',[
   frame('Be a picture detective',['Choose a picture. Write three things you can definitely see.','Write two things that might be true.','Write one question for someone in the picture.','Read your list to another pair. Can they guess the picture?','Challenge: use “might”, “could” and “because”.'],600)
  ]),
  stage('break','Break',60,10,'Take a ten-minute break. The question is optional for early returners.',[
   frame('Take a break',['Optional: Which picture would make the best movie?','What would you call it?'],600,{mode:'think'})
  ]),
  stage('story','The story behind the picture',70,15,'Groups of three or four. Each person contributes. Prepare for eight minutes and share for seven minutes with another group or the class.',[
   frame('Create your story',['Choose one picture. Who are the characters and where are they?','What happened before the picture? What unexpected problem appeared?','What does each character want? What does someone say?','How do they solve the problem? What is the final surprise?','Start: “It was an ordinary morning until…”'],480),
   frame('Share and listen',['Tell your story to another group. Everyone contributes.','Listeners: What was your favorite detail?','What would you change about the ending?','What question would you ask a character?'],420,{mode:'share'})
  ]),
  stage('roleplay','This is getting weird',85,15,'Pairs choose a situation, prepare for three minutes and perform for another pair. Switch roles or situations. Audience asks: What happened after that?',[
   frame('Choose a role-play',['The penguin wants to join the professor’s class.','A customer ordered a small lunch; the dog chef brought a giant sandwich.','The traveler discovers a tiny person in the suitcase.','A robot interrupts a presentation.','What does each person want? What problem must they solve?'],180),
   frame('Speak, listen, solve',['“Excuse me, but could you explain…?”','“I understand, but there’s a problem.”','“What if we…?” / “That could work.”','Perform for another pair; then switch roles or situations.','Audience: “What happened after that?”'],720)
  ]),
  stage('opinions','Agree, disagree, or it depends',100,15,'Students choose a position and discuss reasons in small groups. Invite contrasting views and examples.',[
   frame('What do you think?',['Animals would make better coworkers than humans.','It is better to be funny than serious in a presentation.','Everyone should work in customer service at least once.','A good teacher should always know the answer.','Technology makes communication easier.'],450),
   frame('Explain your opinion',['Pets should be allowed at college.','A surprising experience is more valuable than a perfect plan.','It is better to ask a silly question than stay confused.','The best meals are shared with others.','Being able to laugh at yourself is an important skill.'],450)
  ]),
  stage('exit','Exit ticket',115,5,'Students write short answers. Invite a few students to share a favorite question.',[
   frame('Before you go',['Which picture was your favorite? Why?','Write one sentence about a picture using “might” or “could”.','Write one question for a character from a picture.','What useful English expression did you use or hear today?'],300,{mode:'think',final:true})
  ])
 ]
};
