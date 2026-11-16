const frame = (title, mode, lines, seconds) => ({ title, mode, lines, ...(seconds ? { timerSeconds: seconds } : {}) });
const stage = (id, title, durationMinutes, start, notes, frames) => ({ id, title, durationMinutes, timeRange: `${start}–${start + durationMinutes} min`, notes, frames });

export const ictWelcomeLesson = {
  id: 'ict-9-welcome', title: 'Welcome to ICT: Meet Your Teacher and Set Up for Success',
  eyebrow: '9th Grade · ICT · First lesson', durationMinutes: 40, classroomOnly: true,
  catalog: { subjectId: 'ict', grades: [9], unit: 'Getting started', order: 1 },
  openingScript: 'Welcome! Today we will get to know one another, discuss how we will use this room, and think about what we want to learn in ICT. You do not need to use a computer today.',
  stages: [
    stage('welcome', 'Welcome and warm-up', 5, 0, 'Welcome students at the door. Give silent thinking time, then invite a few volunteers; students may pass. Accept examples beyond computers, such as phones and networks. Do not require devices.', [
      frame('Welcome to ICT', 'listen', ['Today: meet your teacher, discuss our class rules, and share your ideas about technology.', 'You can speak, listen, or take a moment to think before answering.']),
      frame('Technology in your life', 'pair', ['Think of one piece of technology you used this week.', 'What did you use it for? What would be harder without it?', 'Tell a partner; be ready to share one idea.'], 120),
      frame('A quick choice', 'share', ['Would you rather create a video, design a game, solve a computer problem, or build a website?', 'Choose one and explain why.'], 90)
    ]),
    stage('teacher', 'Meet your teacher', 8, 5, 'Introduce yourself as Mr. Bryant. Discuss your military experience and your interest in Netflix; invite questions. The learning story is an imagined example. Students can pass on personal questions.', [
      frame('A little about me', 'listen', ['My name and what you can call me.', 'A place or experience that has shaped me.', 'An interest or hobby I enjoy.']),
      frame('Your turn to guess', 'think', ['Which technology do you think I use most?', 'What do you think I enjoy doing away from a screen?', 'Make a respectful guess, then listen to the real answer.'], 90),
      frame('Why I teach', 'listen', ['Share why you enjoy teaching and one thing you hope students gain from this class.', 'Tell a short, true story about learning something new.']),
      frame('Ask your teacher', 'share', ['What would you like to know about me or this class?', 'Ask a respectful question. You may also write one down.', 'What makes a teacher helpful when a topic feels difficult?'], 120)
    ]),
    stage('rules', 'Our ICT room rules', 10, 13, 'State these as the class expectations. Explain that they protect equipment, learning time, and people. Apply school rules and accessibility or medical arrangements where relevant. Invite questions about routines without asking students to disclose private information.', [
      frame('Protect the room and our learning', 'listen', ['No food in the ICT classroom. Follow the school’s drink rules.', 'No games during class unless the teacher has assigned or approved one.', 'Use only the websites and programs needed for the lesson.']),
      frame('Why do these rules matter?', 'pair', ['What could happen if food or a drink spills near a keyboard?', 'How might an unrelated game affect your learning or someone nearby?', 'What is the difference between an assigned learning activity and an unrelated game?'], 120),
      frame('Respect people and equipment', 'listen', ['Handle devices and cables carefully. Report problems rather than trying to repair equipment.', 'Listen when someone speaks. Use respectful words and ask before touching another person’s work.', 'Keep passwords private and use your own account. Tell the teacher if something online makes you uncomfortable.']),
      frame('What would you do?', 'pair', ['A classmate opens a game after finishing early. What could they do instead?', 'You notice a damaged cable. What is the safe next step?', 'Someone asks for your password. How could you respond?'], 150),
      frame('Agree on the routine', 'share', ['When you arrive: settle in and wait for instructions.', 'During work: stay on the task, ask for help, and respect the room.', 'Before leaving: save your work, follow sign-out instructions, and leave your space tidy.', 'Which rule will be easiest to remember? Which routine needs a question?'], 90)
    ]),
    stage('students', 'Get to know the class', 12, 23, 'Use pairs or small groups. Give quiet thinking time and ensure both partners speak. Sharing personal details is optional; students can answer with an example or pass. Collect interests and support needs without promising a specific syllabus.', [
      frame('Choose questions to discuss', 'pair', ['What is one thing you already feel confident doing with technology?', 'What is something you would like to learn or create in ICT?', 'What makes a class interesting or helps you learn?', 'Choose two. Both partners answer and ask “Why?” or “Can you tell me more?”'], 240),
      frame('ICT: useful or risky?', 'think', ['Imagine an app that helps students organise homework.', 'What could make it useful? What might go wrong?', 'How could its design protect users and their information?'], 90),
      frame('Share and build on an idea', 'share', ['Share one idea from your discussion, with your partner’s permission.', 'Respond: “I agree because …” / “Another possibility is …”', 'What questions should we explore together this term?'], 180),
      frame('A classroom that works for everyone', 'pair', ['What should you do when you are stuck?', 'How can you help a classmate without doing their work for them?', 'What can I do to help you learn?'], 120)
    ]),
    stage('close', 'Check out', 5, 35, 'Invite spoken answers or collect anonymous slips. Read a few without identifying students. Revisit any unclear rules at the next lesson. Use remaining time to answer questions and practise the dismissal routine.', [
      frame('Three things before you leave', 'think', ['Name one ICT room rule and explain why it matters.', 'Name one thing you want to learn or make.', 'Ask one question about the class or your teacher.'], 120),
      frame('Ready for next time', 'share', ['Share one answer or hand in a short note.', 'Check your space and wait for dismissal.', 'Thank you for helping us make this a respectful place to learn.'])
    ])
  ]
};

// Visual and interactive additions for the introductory lesson.
const teacherFrames = ictWelcomeLesson.stages[1].frames;
teacherFrames[0].lines = ['My name is Mr. Bryant.', 'My military experience has shaped me.', 'I enjoy watching Netflix.'];
teacherFrames[0].ictGallery = ['teacher', 'military', 'netflix'];
teacherFrames[1].lines = ['Which technology do you think I use most?', 'What do you think I enjoy doing away from a screen?', 'Make a guess, then reveal each answer.'];
teacherFrames[1].ictAnswers = [
  {question:'My favourite technology', answer:'I use Google technology most: Google Pixel, Pixel Buds, Chromecast and Google Home.', image:'google'},
  {question:'Away from the screen', answer:'I enjoy hiking in the mountains.', image:'hiking'}
];
teacherFrames[2].lines = ['I enjoy helping students learn new things.', 'In ICT, we can be curious, make mistakes and solve problems together.'];
teacherFrames[2].ictStory = true;
const rules = ictWelcomeLesson.stages[2].frames;
rules[0].lines = ['No food in the ICT classroom. Follow the school’s drink rules.', 'No games during class unless the teacher has assigned or approved one.', 'Use only the websites and programs needed for the lesson.'];
rules[0].ictGallery = ['food','games','task']; rules[0].ictSplit = true;
rules[1].ictGallery = ['spill','distraction']; rules[1].ictSplit = true;
rules[2].lines = [];
rules[2].ictCards = [
 {image:'care',text:'Handle devices and cables carefully.'}, {image:'report',text:'Report damaged equipment to the teacher.'},
 {image:'listen',text:'Listen and speak respectfully.'}, {image:'work',text:'Ask before touching someone else’s work.'},
 {image:'password',text:'Keep passwords private and use your own account.'}, {image:'help',text:'Tell the teacher if something online makes you uncomfortable.'}
];
rules[4].lines = ['Choose a moment in the lesson. What should we do?'];
rules[4].ictRoutine = [
 {label:'When we arrive', text:'Settle in and wait for instructions.'},
 {label:'During work', text:'Stay on task, ask for help, and respect the room.'},
 {label:'Before leaving', text:'Save your work, follow sign-out instructions, and leave your space tidy.'}
];
const students = ictWelcomeLesson.stages[3].frames;
students[0].lines = ['Choose two questions. Both partners answer and ask “Why?” or “Tell me more.”'];
students[0].ictCards = [
 {image:'question1',text:'What do you already feel confident doing with technology?'},
 {image:'question2',text:'What would you like to learn or create in ICT?'},
 {image:'question3',text:'What makes a class interesting or helps you learn?'},
 {image:'question4',text:'What question do you have about ICT or this class?'}
];
students[1].ictGallery = ['useful','risky']; students[1].ictSplit = true; students[1].ictPhotos = true;
students[3].mode = 'share'; students[3].lines = ['Class discussion: What should you do when you are stuck?', 'How can you help a classmate without doing their work?', 'What can Mr. Bryant do to help you learn?'];
const closing = ictWelcomeLesson.stages[4].frames;
closing[0].title = 'Before you leave'; closing[0].lines = ['Name one ICT rule and explain why it matters.']; closing[0].ictGallery = ['exit']; closing[0].ictSplit = true;
closing[1].lines = []; closing[1].ictGallery = ['goodbye']; closing[1].ictFullImage = true;
