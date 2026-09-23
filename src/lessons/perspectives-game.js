import {f, q, open} from './pilot-tools.js';

// A complete lesson route: pacing must not add the generic repeated tasks.
export function perspectivesGame(common) {
 const stage=(id,title,minutes,notes,frames)=>({id,title,durationMinutes:minutes,notes,frames:frames.map(frame=>({...frame,timerSeconds:minutes*60/frames.length,expectedSeconds:minutes*60/frames.length}))});
 return {...common,customVisuals:true,contentRevision:4,title:'One shirt, different views',
 stages:[
  stage('notice','Vote: what matters?',4,'Accept pointing, fingers or a short phrase. Read each choice aloud. There is no correct opening vote. All people and events in this lesson are made up.',[
   f('You are buying a shirt','think',['Choose: 1 = low price, 2 = fair pay, 3 = on time.'],{lessonVisual:{kind:'perspectives',intro:true,title:'What matters to you?',prompt:'Choose: 1 = low price, 2 = fair pay, 3 = on time.',steps:['1 · A low price','2 · Fair pay for workers','3 · Getting it on time','Tell a partner why.']},footnote:'Fictional case: a made-up shirt shop.'}),
   f('Same shirt. Different views.','pair',['Tell your partner your choice.','Say: “I chose … because …”','Can you choose different things and both have a good reason?'])
  ]),
  stage('sources','Meet the people',8,'Keep the role cards visible while pupils rehearse. Explain pay = money for work; extra hours = work after the usual finish time. Read cards aloud. Partners may explain in a familiar language first.',[
   f('Three useful words','listen',['Perspective = how a person sees an issue.','Priority = what matters most to someone.','Evidence = information that supports an idea.']),
   f('Source card A: two workers','think',['Mina: “I want extra hours. I need more pay.”','Leo: “I need to leave on time to care for my brother.”','Both work in the same shirt factory.']),
   f('Source card B: buyer and manager','think',['Ali, a buyer: “I need a shirt I can afford.”','Jo, the manager: “The shop needs the shirts by Friday.”']),
   f('Who said it?','pair',['Partner A: choose a person. Say what matters to them.','Partner B: guess the person. Point to their words.','Swap jobs. Try a different person.'],{discussionId:'guess-person'})
  ]),
  stage('model','Spot the mistake',4,'Ask for thumbs up or down before showing the second frame. Model using a quotation as evidence, without treating one person as a whole group.',[
   f('“All workers want extra hours.”','think',['Thumbs up: the cards support this.','Thumbs down: a card shows something different.','Which person helps you check?']),
   f('Two workers can want different things','listen',['Mina wants more pay. Leo needs to leave on time.','Say: “They both work in the factory, but …”'])
  ]),
  stage('apply','The Friday challenge',12,'Use groups of four, or pairs taking two roles each. Assign Mina, Leo, Ali and Jo. Show the earlier cards again if needed. No acting performance is required. Allow pointing or reading the sentence starter. Spend about 3 minutes per frame.',[
   f('Choose a role','pair',['Be Mina, Leo, Ali or Jo.','Use your card: “I am … I need … because …”','Take turns. Listen to every person.'],{discussionId:'roles'}),
   f('Choose a plan together','pair',['A: Everyone works extra hours. Shirts arrive Friday.','B: No extra hours. Shirts arrive Monday.','Who does each plan help? Who has a problem?'],{discussionId:'plans'}),
   f('Surprise! A new choice','pair',['C: Workers choose extra hours, with extra pay.','Some shirts arrive Friday. The rest arrive Monday.','Would your person choose C? Say why.'],{discussionId:'twist'}),
   f('Make your group’s decision','share',['Choose A, B or C. You may suggest another plan.','Say: “We choose … because …”','Add: “This helps … but … still has a problem.”'],{discussionId:'decision'})
  ]),
  stage('check','Try it yourself',8,'Everyone chooses before the answer is revealed. For the open question accept a short phrase, drawing with labels or spoken answer. Check the distinction between different views and right/wrong facts.',[
   q('What do Mina and Leo show us?',['People in the same group can want different things.','All workers want extra hours.','Workers never care about pay.','Only the manager has a perspective.'],'A','Mina wants more pay. Leo needs time to care for his brother. Two workers have different priorities.','check'),
   open('New case: the school trip',['Sam wants a low-cost trip. Kim wants a place nearby.','What might each person need?','Say: “Sam may need … Kim may need …”'],'Sam may need to save money. Kim may need a short journey. Ask them why; we do not know their reasons yet.','transfer')
  ]),
  stage('reflect','One last thought',4,'Return to the opening vote. A changed vote is not required. Look for a reason based on another person’s needs.',[
   f('Vote again','share',['Low price, fair pay, or arriving on time?','Keep or change your first choice.','Say: “Now I think … because …”']),
   f('Lesson complete','listen',['People can see the same issue in different ways.','Keep your work. Listen for the next instruction.'],{final:true})
  ])
 ],extensions:[
  {title:'Missing voice: ask a question',minutes:5,sourceTitle:'A customer we have not heard from',source:['A customer needs a shirt for a new job on Monday.','We do not know how much money the customer has.'],lines:['Choose one question to ask this customer.','Take turns as customer and interviewer. Make up a possible answer.','Say how that answer could change the shop’s plan.'],outcome:'Say which information is from the case and which answer you made up.'},
  {title:'Draw two views',minutes:5,sourceTitle:'One shop, two customers',source:['One customer wants the cheapest shirt.','Another wants a shirt that lasts a long time.'],lines:['Draw each customer with a speech bubble.','Add a reason each person might give.','Show your partner. Ask: could both views make sense?'],outcome:'Use “may” for a reason you guessed. Ask the person to find out.'}
 ]};
}

