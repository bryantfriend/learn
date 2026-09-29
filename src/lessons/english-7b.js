const f=(title,mode,lines,extra={})=>({title,mode,lines,...extra});
const s=(id,title,minutes,notes,frames)=>({id,title,durationMinutes:minutes,notes,frames});
// Context-specific Simplified Chinese support, authored locally; no translation service.
export const englishVocabulary={
 like:{zh:'喜欢',pinyin:'xǐ huan',meaning:'Enjoy something or think it is good.',example:'I like music.'},
 please:{zh:'请（用于礼貌地提出请求）',pinyin:'qǐng',meaning:'A word that makes a request more polite.',example:'Water, please.'},
 'do you like':{zh:'你喜欢……吗？',pinyin:'nǐ xǐ huan … ma',meaning:'A question about what someone enjoys.',example:'Do you like drawing?'},
 'what about you':{zh:'你呢？',pinyin:'nǐ ne',meaning:'Ask the same question back to the other person.',example:'I like music. What about you?'},
 'nice to meet you':{zh:'很高兴认识你',pinyin:'hěn gāo xìng rèn shi nǐ',meaning:'A friendly phrase when you first meet someone.',example:'Hi! I’m Sam. Nice to meet you.'},
 'thank you':{zh:'谢谢你',pinyin:'xiè xie nǐ',meaning:'A polite way to show thanks.',example:'Thank you for your help.'},
 'of course':{zh:'当然可以（在这里表示同意请求）',pinyin:'dāng rán kě yǐ',meaning:'A friendly yes to a request here.',example:'“Can I have water?” “Of course.”'},
 'you’re welcome':{zh:'不客气',pinyin:'bú kè qi',meaning:'A polite reply to thank you.',example:'“Thank you!” “You’re welcome.”'},
 partner:{zh:'搭档；一起练习的人',pinyin:'dā dàng',meaning:'The person you practise with.',example:'Ask your partner a question.'},
 hobby:{zh:'爱好',pinyin:'ài hào',meaning:'Something you enjoy doing in your free time.',example:'My hobby is drawing.'},
 enjoy:{zh:'喜欢；享受',pinyin:'xǐ huan; xiǎng shòu',meaning:'Like doing something.',example:'I enjoy playing football.'},
 prefer:{zh:'更喜欢',pinyin:'gèng xǐ huan',meaning:'Like one choice more than another.',example:'I prefer drawing to dancing.'},
 favourite:{zh:'最喜欢的',pinyin:'zuì xǐ huan de',meaning:'The one you like most.',example:'What is your favourite game?'},
 usually:{zh:'通常',pinyin:'tōng cháng',meaning:'On most occasions.',example:'I usually play after school.'},
 sometimes:{zh:'有时候',pinyin:'yǒu shí hou',meaning:'On some occasions, but not always.',example:'I sometimes draw at home.'},
 because:{zh:'因为',pinyin:'yīn wèi',meaning:'Introduces a reason.',example:'I like music because it is fun.'},
 question:{zh:'问题；提问',pinyin:'wèn tí; tí wèn',meaning:'Something you ask to find out more.',example:'Ask one more question.'},
 repeat:{zh:'重复；再说一遍',pinyin:'chóng fù; zài shuō yí biàn',meaning:'Say it again.',example:'Could you repeat that, please?'},
 slowly:{zh:'慢慢地',pinyin:'màn màn de',meaning:'Not quickly.',example:'Please speak slowly.'},
 agree:{zh:'同意',pinyin:'tóng yì',meaning:'Have the same opinion.',example:'I agree. Let’s choose drawing.'},
 different:{zh:'不同的',pinyin:'bù tóng de',meaning:'Not the same.',example:'We like different games.'},
 together:{zh:'一起',pinyin:'yì qǐ',meaning:'With another person or people.',example:'Let’s practise together.'},
 choose:{zh:'选择',pinyin:'xuǎn zé',meaning:'Pick one possibility.',example:'Choose a club.'},
 invite:{zh:'邀请',pinyin:'yāo qǐng',meaning:'Ask someone to join you.',example:'Invite your partner to the club.'},
 drawing:{zh:'画画',pinyin:'huà huà',meaning:'Making pictures with a pen or pencil.',example:'I like drawing animals.'},
 football:{zh:'足球',pinyin:'zú qiú',meaning:'A team game played by kicking a ball.',example:'Do you like football?'},
 music:{zh:'音乐',pinyin:'yīn yuè',meaning:'Sounds made or performed as songs or tunes.',example:'I like listening to music.'},
 dancing:{zh:'跳舞',pinyin:'tiào wǔ',meaning:'Moving your body to music.',example:'Do you enjoy dancing?'},
 polite:{zh:'有礼貌的',pinyin:'yǒu lǐ mào de',meaning:'Showing respect and consideration.',example:'Use a polite request.'},
 request:{zh:'请求',pinyin:'qǐng qiú',meaning:'Something you ask someone to do or give you.',example:'Can I have some water, please?'},
 menu:{zh:'菜单',pinyin:'cài dān',meaning:'A list of food and drinks you can order.',example:'Look at the menu.'},
 customer:{zh:'顾客',pinyin:'gù kè',meaning:'The person buying something.',example:'The customer orders a sandwich.'},
 server:{zh:'服务员（在本课的餐饮场景中）',pinyin:'fú wù yuán',meaning:'The person taking the order in this café.',example:'The server asks, “Anything else?”'},
 order:{zh:'点餐（在本课中）',pinyin:'diǎn cān',meaning:'Ask for food or drink in a café.',example:'I would like to order some juice.'},
 sandwich:{zh:'三明治',pinyin:'sān míng zhì',meaning:'Food with a filling between pieces of bread.',example:'Can I have a sandwich, please?'},
 juice:{zh:'果汁',pinyin:'guǒ zhī',meaning:'A drink made from fruit.',example:'I would like some juice.'},
 water:{zh:'水',pinyin:'shuǐ',meaning:'A drink.',example:'Can I have some water, please?'},
 total:{zh:'总数；总价',pinyin:'zǒng shù; zǒng jià',meaning:'The amount after adding everything.',example:'The total is five tokens.'},
 token:{zh:'代币（本课用于练习，不是真钱）',pinyin:'dài bì',meaning:'A pretend unit used in our classroom café.',example:'One water costs one token.'},
 tokens:{zh:'代币（本课用于练习，不是真钱）',pinyin:'dài bì',meaning:'Pretend units used to practise prices.',example:'The sandwich costs four tokens.'},
 'sold out':{zh:'售完了',pinyin:'shòu wán le',meaning:'There is none left to buy.',example:'Sorry, the juice is sold out.'},
 instead:{zh:'代替；改为',pinyin:'dài tì; gǎi wéi',meaning:'In place of the first choice.',example:'Can I have water instead?'},
 'anything else':{zh:'还需要别的吗？',pinyin:'hái xū yào bié de ma',meaning:'A question asking if you want another item.',example:'Anything else? No, thank you.'},
 'how much':{zh:'多少钱？（询问价格时）',pinyin:'duō shao qián',meaning:'Used to ask the price here.',example:'How much is the sandwich?'},
 'would like':{zh:'想要（较礼貌的说法）',pinyin:'xiǎng yào',meaning:'A polite way to say what you want.',example:'I would like some juice, please.'},
 'me too':{zh:'我也是',pinyin:'wǒ yě shì',meaning:'You feel or do the same thing.',example:'“I like music.” “Me too!”'}
};
const support='Mixed-level support: model with a confident volunteer, then let everyone rehearse quietly with a partner. Accept pointing plus a word first, then invite the short sentence. Let learners use Chinese briefly to check meaning; click underlined vocabulary for Simplified Chinese and pinyin. Do not require personal disclosures: invented names and preferences are welcome. Correct one useful phrase after the exchange, not every error while a learner is speaking. Stretch: follow up naturally and give a reason without reading the model.';
function finish(id,title,number,stages,practiceQuestions,conversation){
 let elapsed=0;
 for(const stage of stages){stage.timeRange=`${elapsed}–${elapsed+stage.durationMinutes} min`;elapsed+=stage.durationMinutes;stage.notes+='\n'+support;
  let remaining=stage.durationMinutes*60;stage.frames.forEach((frame,i)=>{const n=i===stage.frames.length-1?remaining:Math.floor(stage.durationMinutes*60/stage.frames.length/15)*15;frame.timerSeconds=n;frame.expectedSeconds=n;remaining-=n;});
 }
 return {id,title,durationMinutes:40,coreMinutes:40,contentRevision:1,customVisuals:true,english:true,classroomOnly:true,eyebrow:`7B · Conversational English · Lesson ${number}`,
  catalog:{subjectId:'english',grades:[7],classes:['7b'],unit:`Week 1 · Lesson ${number} of 2`,order:number},
  sessionsPerWeek:2,vocabulary:englishVocabulary,stages,practiceQuestions,
  openingScript:'Teacher-led conversational English. Two lessons per week; these are the first two sessions, with no fixed weekdays. Each has a 40-minute core. No textbook, student device, food or purchase is needed. Students may stay seated throughout. '+support,
  conversation};
}
const meetCards={title:'Conversation club mixer',rounds:[
 {title:'Round 1 · Find a shared interest',scenario:'Choose football, drawing, music or dancing. You may invent your choice.',roleA:'Ask what your partner likes.',roleB:'Answer, then ask “What about you?”',challenge:'Find one thing you both enjoy. It is also OK to like different things.',support:['A: Do you like ___?','B: Yes, I do. / No, I don’t. What about you?','A: I like ___.'],example:['A: Do you like music?','B: Yes, I do. What about you?','A: Me too! I like music.']},
 {title:'Round 2 · Keep it going',scenario:'Switch roles. Choose a different activity.',roleA:'Answer a question about an activity.',roleB:'Ask one more question about the answer.',challenge:'Use “What…?”, “When…?” or “Who…?”',support:['What is your favourite ___?','When do you usually ___?','Who do you ___ with?'],example:['A: I like football.','B: When do you usually play?','A: After school. What about you?']},
 {title:'Round 3 · Choose a club',scenario:'One person prefers music. The other prefers drawing. Your club can combine activities.',roleA:'Invite your partner to a club.',roleB:'Suggest a way to include both interests.',challenge:'Agree on one club idea and say why.',support:['Let’s choose ___.','I prefer ___. Can we ___ together?','We could ___ because ___.'],example:['A: Let’s choose music.','B: I prefer drawing. Can we draw posters for a music club?','A: Good idea! We can work together.']}
]};
const menu='Practice menu: water 1 token; juice 2 tokens; apple 2 tokens; sandwich 4 tokens. Pretend money only.';
const cafeCards={title:'The pop-up café',rounds:[
 {title:'Round 1 · Open for business',scenario:menu+' Customer budget: 6 tokens.',roleA:'Customer: order a drink and one food item.',roleB:'Server: greet the customer, confirm the order and give the total.',challenge:'Both people speak at least three times.',support:['Can I have ___, please?','Anything else?','That is ___ tokens.','Thank you. / You’re welcome.'],example:['Customer: Can I have a sandwich, please?','Server: Of course. Anything else?','Customer: Water, please. How much is it?','Server: Five tokens altogether.','Customer: Thank you!']},
 {title:'Round 2 · A surprise',scenario:menu+' The juice is sold out. Customer budget: 5 tokens.',roleA:'Customer: ask for juice first, then choose something else.',roleB:'Server: explain the problem politely and offer water instead.',challenge:'Solve the problem in English; do not restart from the beginning.',support:['Sorry, the juice is sold out.','Can I have water instead?','Of course. Anything else?'],example:['Customer: I would like juice, please.','Server: Sorry, the juice is sold out. Would you like water instead?','Customer: Yes, please. And an apple.','Server: Three tokens, please.']},
 {title:'Round 3 · Fix the mix-up',scenario:menu+' The customer ordered water and an apple. The server accidentally says “sandwich”.',roleA:'Customer: politely correct the item.',roleB:'Server: apologise and confirm the corrected order.',challenge:'Finish with the correct total and a polite goodbye.',support:['Sorry, I asked for ___, not ___.','Sorry about that. ___ and ___?','Yes, thank you.'],example:['Server: A sandwich and water?','Customer: Sorry, an apple and water, please.','Server: Sorry about that. An apple and water: three tokens.','Customer: Thank you. Goodbye!']}
]};
export const english7BLessons=[
 finish('g7b-english-01','Find Your People',1,[
  s('begin','Choose your corner',4,'Show the four choices. Pupils point or show 1–4 fingers from their seats; movement is optional. Ask two pupils to model a short preference. Do not ask beginners for a long explanation yet.',[
   f('What do you enjoy?','think',['1 · Football   2 · Drawing','3 · Music   4 · Dancing','Choose one. Point, say the word, or say “I like ___.”'],{footnote:'Tap an underlined word for Chinese help. Invented preferences are welcome.'}),
   f('One small conversation','pair',['A: Hi! I’m ___. What’s your name?','B: I’m ___. Nice to meet you!','A: Nice to meet you, too.'])]),
  s('teach','Build a conversation',8,'Model the first exchange twice: once normally, then with roles visibly separated. Class repeats only the useful chunks. Pairs rehearse, swap roles, then substitute a different activity. Demonstrate a follow-up rather than giving a vocabulary lecture.',[
   f('Ask, answer, return','listen',['A: Do you like music?','B: Yes, I do. What about you?','A: Me too! I like music.']),
   f('Different is OK','pair',['A: Do you like football?','B: No, I don’t. I like drawing.','A: That’s interesting. What do you like drawing?']),
   f('Need help? Say it!','pair',['Could you repeat that, please?','Please speak slowly.','What does “hobby” mean?'])]),
  s('investigate','Conversation club mixer',8,'Open the conversation cards. Use the first two rounds here: 1 minute teacher model, 2 minutes each role, 1 minute partner change or role swap, 2 minutes follow-up challenge. Everyone rehearses, not only pupils at the board. Leave the support visible for beginners; hide it for confident pairs.',[
   f('Meet someone new','pair',['Ask about an activity. Listen to the answer.','Ask one more question. Then swap roles.','Try a new activity in the next round.'],{conversationCards:meetCards})]),
  s('apply','Create a club together',12,'2 minutes choose imaginary preferences, 4 minutes negotiate a club, 3 minutes rehearse a four-turn exchange, 3 minutes share with another pair. Beginners use the two-line invitation and agree on a name; confident pupils combine different interests and explain why. The goal is a negotiated choice, not a long written poster.',[
   f('Your club needs both of you','pair',['Choose music, football, drawing or dancing.','A: Let’s choose ___. What do you think?','B: I prefer ___. Can we ___ together?'],{sourceCard:'Available club ideas: football, music, drawing and dancing. A club may combine two activities. You may invent preferences. Useful words: together, prefer, because.'}),
   f('Give your club a name','pair',['Agree on one club idea.','Say: “Our club is ___. We can ___ together.”','Invite another pair: “Would you like to join?”'])]),
  s('check','Conversation detectives',5,'Act out a deliberately unhelpful exchange: “Do you like music?” “Yes.” Then stop. Ask pupils to improve it. Hear several valid versions. Check whether each partner asks, answers and responds; do not grade accents.',[
   f('Repair the conversation','think',['A: Do you like music?','B: Yes.','How could B keep the conversation going?'],{type:'question',answerText:'One possible continuation',explanation:'Yes, I do. What about you? A fuller answer and a return question invite the other person to speak.'}),
   f('Try your improved version','pair',['Both people ask a question.','Both people answer.','Add “Me too!” or one more question.'])]),
  s('finish','One last exchange',3,'Give 30 seconds to prepare, then partners perform without teacher interruption. Offer pointing plus one word as an entry point; invite a sentence on a second try. Note who needs more rehearsal next lesson.',[
   f('Your conversation ticket','pair',['Ask about one activity.','Answer and ask “What about you?”','Thank your partner.'],{final:true})])
 ],[
  {question:['Someone says “I like drawing.” Which question keeps the topic going?',['What do you like drawing?','What is the price of water?'],'The follow-up connects to what the person just said.'],source:['A: I like drawing. B wants to find out more.']},
  {question:['You did not hear your partner. What can you say?',['Could you repeat that, please?','I must stop speaking forever.'],'Asking for repetition helps you continue.'],source:['Your partner speaks too quickly for you.']},
  {question:['Your partner likes a different activity. Which response helps?',['That’s interesting. Tell me more.','You must like my activity.'],'Different preferences are fine; listen and ask a question.'],source:['One person likes music; the other likes football.']}
 ],meetCards),
 finish('g7b-english-02','The Pop-up Café',2,[
  s('begin','Open a café',4,'Welcome pupils as customers. Show the menu; no real food or money is required. Read the four items aloud with pointing. Let pupils choose with fingers, then model adding “please”.',[
   f('What would you like?','think',['Water · 1 token     Juice · 2 tokens','Apple · 2 tokens     Sandwich · 4 tokens','Point to an item, then say its name.'],{sourceCard:menu}),
   f('Make it polite','pair',['“Water!” → “Water, please.”','“Can I have some water, please?”','Choose another item and try.'])]),
  s('teach','Order, confirm, thank',8,'Model with two voices or a volunteer. The class practises short chunks before reading the whole exchange. Explain server means the café worker here. Accept “A sandwich, please” first; build towards the full request. Prices are a support for speaking, not a maths test.',[
   f('The customer starts','listen',['Customer: Can I have a sandwich, please?','Server: Of course. Anything else?','Customer: Some water, please.']),
   f('Check and finish','pair',['Server: A sandwich and water. Five tokens, please.','Customer: Thank you.','Server: You’re welcome!']),
   f('Ask for the price','pair',['Customer: How much is the juice?','Server: Two tokens.','Customer: I would like juice, please.'])]),
  s('investigate','Café role-play cards',8,'Use round 1 for two short rehearsals, swapping customer/server. Then use round 2 for the sold-out surprise. Keep the menu visible in the card. Allow 30 seconds preparation before each exchange; prompt with the first few words only.',[
   f('Your café is open','pair',['One customer. One server.','Order, confirm, ask the price and say thank you.','Swap roles. Then handle a surprise.'],{conversationCards:cafeCards})]),
  s('apply','Solve a café problem',12,'2 minutes model the repair phrase, 4 minutes prepare and perform the sold-out exchange, 3 minutes swap roles for a wrong-item scenario, 3 minutes perform for another pair. The listener checks whether the problem was solved politely. Beginners may read the support; confident speakers add a price question without a script.',[
   f('The juice is sold out','pair',['Customer: I would like juice, please.','Server: Sorry, the juice is sold out.','Continue: choose another drink and finish the order.'],{sourceCard:menu+' Juice is sold out. Customer has 5 tokens. Phrase: “Can I have water instead?”'}),
   f('That is not my order','pair',['You ordered water and an apple.','The server offers a sandwich by mistake.','Correct the order politely, then confirm the total.'],{sourceCard:menu+' Phrase: “Sorry, I asked for an apple, not a sandwich.” An apple and water cost 3 tokens.'})]),
  s('check','Friendly café challenge',5,'Teacher plays the customer and deliberately says “Give me that!” Pupils suggest a more polite request. Then invite one pair to solve a wrong-item problem. Praise understandable communication and a successful repair, not speed.',[
   f('Improve the request','think',['“Give me that!”','How could you ask more politely?'],{type:'question',answerText:'One useful request',explanation:'Can I have a sandwich, please? Naming the item and using please makes the request clearer and more polite.'}),
   f('Listen for three things','share',['Did the customer ask politely?','Did the server confirm the item?','Did both people finish the conversation?'])]),
  s('finish','Your final order',3,'One minute each role, then a short self-check. Ask for one request and a response without reading if possible. A short successful exchange is enough; collect no personal information or payments.',[
   f('One request, one response','pair',['Order one item politely.','Your partner answers. Swap roles.','Say thank you and goodbye.'],{final:true})])
 ],[
  {question:['Which request is polite and clear?',['Can I have some water, please?','Give me that!'],'The first names the drink and includes please.'],source:[menu]},
  {question:['Juice is sold out. What could the customer say?',['Can I have water instead?','You must give me juice that is not available.'],'Instead introduces an alternative.'],source:[menu+' Juice is sold out.']},
  {question:['The server brings the wrong item. What helps?',['Sorry, I asked for an apple, not a sandwich.','Say nothing and hope the order changes.'],'A polite correction identifies what needs to change.'],source:['The customer ordered an apple. The server offers a sandwich.']}
 ],cafeCards)
];
