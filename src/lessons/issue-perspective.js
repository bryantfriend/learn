const f=(title,mode,lines,extra={})=>({title,mode,lines,...extra});
const v=(scene,title,steps)=>({kind:'issue-perspective',scene,title,steps,intro:false,prompt:steps[0]});
const playground=v('playground','One playground, different needs',['Notice the football area and the quiet bench.','Sam wants space to play football.','Amina wants a quiet place to read.','What decision do they need to make together?']);
const issue=v('issue','From a topic to an issue',['Playtime is a topic: a broad subject.','One small playground is the situation.','Different needs create a decision to discuss.','The issue: how should we share the playground?']);
const voices=v('voices','Two perspectives on the same issue',['Both pupils are talking about the same playground.','Sam values exercise and playing with friends.','Amina values quiet and being able to concentrate.','A perspective includes a view and the reasons behind it.']);
const evidence=v('evidence','Check a fact; understand a viewpoint',['A plan shows one playground: this can be checked.','Sam prefers football: this tells us what Sam values.','Amina prefers quiet: this tells us what Amina values.','Ask pupils and observe playtime before deciding.']);
const scale=v('scale','An issue can affect different groups',['Personal: what do I need at playtime?','School: how can all pupils use the playground?','Community: who needs space in our local park?','In many countries, communities discuss shared spaces.']);
const library=v('library','A new situation: the school library',['This fictional library has one room.','Lina wants to talk about a group project.','Omar wants quiet to read his book.','Name the shared issue before choosing a solution.']);
export function createIssuePerspectiveLesson(common){
 const s=(id,title,durationMinutes,start,notes,frames)=>({id,title,durationMinutes,timeRange:start+'–'+(start+durationMinutes)+' min',notes,frames});
 const q=(title,options,answer,explanation,id)=>f(title,'think',[],{type:'question',responseHint:'Choose A, B, C or D. Be ready to explain why.',options:options.map((label,i)=>({id:'ABCD'[i],label})),answer,explanation,discussionId:id});
 return {...common,title:'What is an Issue and a Perspective?',contentRevision:2,customVisuals:true,
 openingScript:'Today we will identify a shared issue and explain two perspectives with reasons. All people and situations in this lesson are fictional. No printing or pupil devices needed.',
 stages:[
 s('begin','Notice the issue',5,0,common.openingScript+'\nRebuilt lesson: use the on-screen fictional cases. First collect observations, not solutions. Let pupils describe the picture before introducing vocabulary. Spend 3 minutes observing and 2 minutes naming the learning goal.',[
 f('One playground. Two wishes.','think',['Look closely. What do these pupils want?','Could both wishes fit in this space?'],{lessonVisual:playground,discussionId:'notice',timerSeconds:60,footnote:'Fictional school and pupils.'}),
 f('Today’s challenge','listen',['Name the issue: what needs discussing or deciding?','Explain two perspectives: what does each person think, and why?'])
 ]),
 s('learn','Issue or perspective?',10,5,'Allow about 3 minutes for the issue, 4 for the perspectives, and 3 for checking facts. Read the speech cards aloud. An issue need not be an argument or a disaster. It is a matter people care about that can be discussed or investigated. A perspective is a way of seeing it, shaped by experience, needs and values. Avoid implying everyone in a group shares a view.',[
 f('What is an issue?','listen',['An issue is a matter people care about and can discuss or investigate.','Our issue: how should we share the playground?'],{lessonVisual:issue}),
 f('What is a perspective?','listen',['A perspective is someone’s way of seeing an issue.','Ask: “What do they think? Why does it matter to them?”'],{lessonVisual:voices}),
 f('Same issue. Different reasons.','pair',['Sam thinks: “We need space for football because it keeps us active.”','Amina thinks: “We need a quiet area because noise makes reading hard.”'],{discussionId:'reasons',timerSeconds:90}),
 f('A fact is not a preference','listen',['“There is one playground” can be checked.','“Football is the best use of it” is a viewpoint.'],{lessonVisual:evidence})
 ]),
 s('apply','Become a perspective detective',15,15,'Spend 3 minutes sorting, 4 on the partner exchange, 3 on missing voices and 5 on wider connections. Sorting key: 1 issue; 2 checkable fact in the fictional case; 3 perspective with a reason. Partner A speaks as Sam and B as Amina, then swap. Listen for accurate reasons before inviting solutions. A different perspective is not automatically a false claim or an equally well-supported claim. Ask what evidence is needed. Accept different fair proposals if justified.',[
 f('Sort these three statements','pair',['1. How should we share the playground?','2. Our school has one playground.','3. I want a quiet area because I enjoy reading.'],{discussionId:'sort',timerSeconds:120,footnote:'Label each: issue, fact, or perspective. Explain your choices.'}),
 f('Explain a view that is not yours','pair',['A: explain Sam’s view and reason. B: explain Amina’s.','Swap roles. Begin: “From ___’s perspective…”'],{lessonVisual:voices,discussionId:'role-swap',timerSeconds:180}),
 f('Whose voice is missing?','share',['Who else uses the playground? What would you ask them?','Suggest a fair plan. Say whose needs it meets.'],{lessonVisual:playground,discussionId:'missing-voice',timerSeconds:120}),
 f('Zoom out from our school','pair',['How is sharing a school playground like sharing a public park?','Name another person to ask. Do not guess their opinion.'],{lessonVisual:scale,discussionId:'wider-issue',timerSeconds:120})
 ]),
 s('check','Check your understanding',6,30,'Give about 2 minutes per question: choose, explain, then reveal. Q1 separates the shared issue from a topic or one person’s preference. Q2 identifies a viewpoint with a reason. Q3 checks that pupils ask about a perspective instead of assuming it.',[
 q('Which sentence names the issue?',['Playgrounds.','How should we share our playground?','Football is the best game.','Sam has a football.'],'B','An issue identifies the matter to discuss or investigate. Here it is how people should share a limited space.','issue-check'),
 q('Which explains Amina’s perspective?',['The playground is at school.','Sam plays football.','There is one playground.','We need a quiet area because noise makes reading hard.'],'D','This gives Amina’s view and her reason. It explains how she sees the shared issue.','perspective-check'),
 q('A new pupil joins. What should we do?',['Ask what they need at playtime and why.','Assume they agree with Sam.','Choose their opinion for them.','Ignore them because they are new.'],'A','Ask and listen. We cannot know someone’s perspective just from the group they belong to.','listen-check')
 ]),
 s('finish','Use it somewhere new',4,36,'Exit task: give 2 minutes for independent answers, then share for 1 minute and close for 1 minute. Accept: “How should we use the library room?” Lina values group discussion; Omar values quiet reading. A solution such as separate times is optional; naming the issue and explaining both reasons are the goals. If pupils write only “library”, prompt for the matter to discuss. If they give only their own preference, ask for the other person’s reason.',[
 f('Your turn: one library room','think',['Write the issue as a question.','Explain Lina’s and Omar’s perspectives using “because”.'],{lessonVisual:library,discussionId:'exit-transfer',timerSeconds:120}),
 f('I can see both perspectives','share',['An issue is the matter we discuss or investigate.','A perspective is a way of seeing it, with reasons.','Keep your exit answer. Listen for the next instruction.'],{final:true})
 ])
 ]};
}
