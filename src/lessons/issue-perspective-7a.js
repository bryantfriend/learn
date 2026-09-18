import {createIssuePerspectiveLesson} from './issue-perspective.js';

// Reuse the coherent visual story, with the Grade 7 plan's deeper evidence and scale work.
export function createGrade7AIssuePerspectiveLesson(common){
 const lesson=createIssuePerspectiveLesson(common);
 lesson.title='What is an Issue and a Perspective?';
 lesson.openingScript+=' For 7A, compare reasons, distinguish evidence from an argument, and connect personal, local and global scales.';
 const [begin,learn,apply,check,finish]=lesson.stages;
 const survey={
  kind:'data',title:'Playground survey: 30 replies',description:'Fictional playground survey: 18 pupils chose football space and 12 chose quiet space. Each of the 30 respondents chose one option; these replies do not represent the whole school.',intro:false,prompt:'What do these pupils prefer?',
  chart:{labels:['Football','Quiet space'],values:[18,12],unit:'pupils (30 replies)',
   note:'Fictional survey: “Which space would you most like added?” Each pupil chose one of these two options. This is not the whole school.'},
  steps:['18 pupils chose football space.','12 pupils chose quiet space.','18 + 12 = 30 replies; each pupil chose once.','The results show preferences, not the fairest plan.']
 };
 learn.frames[2].lines=['A: explain why Sam wants football. B: check his reason.','Swap: explain why Amina wants quiet. Agree one difference.'];
 learn.frames[2].lessonVisual=learn.frames[1].lessonVisual;
 apply.frames[0].footnote='A labels a statement: issue, fact or perspective. B checks and explains why. Swap for the next statement.';
 begin.frames[1].lines=['Identify the issue and explain two perspectives.','Use evidence to support a reasoned argument.'];
 learn.notes='An issue is a matter people care about that can be discussed or investigated; it need not be a disaster. A perspective is a way of seeing it, shaped by needs, values and experience. Do not assume a whole group shares one view. For 7A, use 1 minute each for issue and perspective, 1.5 for the two voices, 1.5 for fact/evidence, and 3 for the argument. An argument is a claim supported by reasons and evidence, not a quarrel. The invented survey reports preferences only: it does not prove what is fair or represent every pupil.';
 learn.frames.push({
  title:'Read the playground survey',mode:'listen',lessonVisual:survey,
  lines:['Evidence is information that supports a claim. Read both counts.','An argument gives a claim and reasons. What plan could these results support?'],
  footnote:'Do not survey the class now. Use these invented results.'
 });
 apply.frames[1].lines=['A: argue for football using Sam’s reason.','B: argue for quiet using Amina’s reason. Swap roles.'];
 apply.frames[2].title='Make a plan using the results';
 apply.frames[2].mode='pair';
 apply.frames[2].lessonVisual=survey;
 apply.frames[2].lines=['A: propose a playground plan using one survey number.','B: say whose need it misses. Swap, then agree one change.'];
 apply.frames[3].lines=['A: name a school-space need. B: name a park user with a different need.','Together: what should you ask that park user before making a plan?'];
 apply.frames.push({
  title:'Connect the scales',mode:'pair',
  lines:['A: finish “I need space to ___.” B: explain a different need in a local park.','Swap. Together ask one question about sharing public space in different countries.','Write: “How can communities share space when ___?”'],
  footnote:'Personal = my needs. Local = our community. Global = communities across countries.',
  discussionId:'scale-transfer',timerSeconds:90
 });
 apply.notes='For every partner task, assign A and B before starting the timer. Both must speak, then swap. The survey is supplied fictional evidence, not an instruction to collect data. Keep its chart onscreen while pairs make their plan. Listen for one cited count, another need, and one agreed revision. 7A timing: sort for 2 minutes; compare perspectives for 2; propose and question a plan for 3; examine the scales for 2; connect them for 3; then use 4 minutes each for the independent canteen case and plan comparison. Sorting key: issue, checkable fact, perspective. A strong comparison states both views and reasons fairly. The survey supports providing for different needs, but does not establish the fairest layout or represent all users. Ask about sample, access, safety and missing voices. Global scale means an issue affecting people across countries; this school example alone is local. Accept public-space questions about access, safety or competing uses. Do not assume a country or group has one perspective.';
 check.frames[2]={
  title:'What does the survey show?',mode:'think',type:'question',
  lines:['30 replies: 18 chose football; 12 chose quiet space.'],
  responseHint:'Choose A, B, C or D. Be ready to explain why.',
  options:[
   {id:'A',label:'Every pupil wants football.'},
   {id:'B',label:'Quiet space is unnecessary.'},
   {id:'C',label:'The 30 respondents expressed different needs.'},
   {id:'D',label:'The fairest plan is already proven.'}
  ],answer:'C',explanation:'18 respondents wanted football and 12 wanted quiet. The survey shows different preferences in this sample; it does not settle fairness or speak for every pupil.',discussionId:'evidence-check'
 };
 check.notes='Allow 2 minutes per question. Reveal after pupils explain. Q1 identifies the shared issue; Q2 distinguishes a reasoned perspective from a fact; Q3 checks a supported conclusion and the survey’s limits.';
 finish.frames[0].lines=['Write the issue. Compare Lina’s and Omar’s views and reasons.','What evidence would help the library make a fair decision?'];
 finish.notes+=' For 7A also collect one evidence question, such as how many users need group discussion or quiet at each time. Assess the issue, both perspectives, and relevant evidence without requiring one particular solution.';
 lesson.contentRevision=4;
 begin.notes='Two-minute start: silently notice the two needs for one minute; explain the learning goal and take two short responses for one minute. Attendance and announcements are separate.';
 begin.frames[0].lines=['Write what Sam wants and what Amina wants.','What shared decision do they need to make?'];
 apply.frames.push(
  {title:'A new issue: the school canteen',mode:'think',lines:['Fictional case: Mira wants cheaper lunches because her budget is limited.','Deniz wants reusable bowls because the canteen throws away many disposable bowls.','Write the shared issue, both perspectives and one question you would investigate.'],discussionId:'canteen-independent',footnote:'Work independently: four sentences. A viewpoint needs a reason.'},
  {title:'Compare two canteen plans',mode:'pair',lines:['Plan A: keep disposable bowls and lower lunch prices.','Plan B: buy reusable bowls and keep current prices.','For each plan: who benefits, what is missing, and what evidence would you need?'],discussionId:'canteen-plans',footnote:'Write a comparison, then propose one improvement. Costs and waste totals are not supplied.'}
 );
 apply.notes+=' New independent transfer: pupils identify how the canteen should balance affordability and waste. Mira values access; Deniz values less waste. Neither plan can be declared best from the stated facts. Compare costs, cleaning facilities, waste totals and families’ needs. Collect four written sentences before paired plan comparison. Ask two pairs to defend different improvements.';
 const budgets=[[60,60],[60,60,90,90,180],[120,120,180,120,180,240,240],[120,120,120],[225,15]];
 let start=0;lesson.stages.forEach((stage,i)=>{stage.durationMinutes=budgets[i].reduce((a,b)=>a+b,0)/60;stage.timeRange=start+'–'+(start+stage.durationMinutes)+' min';start+=stage.durationMinutes;stage.frames.forEach((f,j)=>{f.expectedSeconds=budgets[i][j];f.timerSeconds=budgets[i][j];});stage.notes+=' Revised activity guide: '+stage.frames.map(f=>f.title+': '+f.expectedSeconds/60+' min').join('; ')+'. These are student-work estimates; use More practice when secure early.';});
 lesson.extensions=[
  {title:'Is the majority always fair?',minutes:5,sourceTitle:'The playground vote',source:['Fictional survey: 18 pupils chose football space and 12 chose quiet space.','The headteacher proposes giving the whole playground to football because it got more votes.'],lines:['1 minute: write what the survey proves and what it does not prove.','2 minutes: argue from the viewpoint of a pupil who needs quiet. Include a survey number.','2 minutes: propose a different plan and one way to check whether it is fair.'],outcome:'Separate a majority preference from a justified decision. Consider people who did not answer the survey.'},
  {title:'Change your mind with evidence',minutes:5,sourceTitle:'New information about the canteen',source:['Fictional follow-up: reusable bowls cost more to buy, but less per use after 100 uses.','The canteen has no space for an extra washing machine.'],lines:['1 minute: choose which original canteen plan you prefer and explain why.','2 minutes: use both new facts to challenge your choice. Suggest a revised plan.','2 minutes: compare revisions. State which fact changed your thinking and what you still need to find out.'],outcome:'A strong answer can stay with its first choice, but must address the new evidence and a practical constraint.'}
 ];
 return lesson;
}
