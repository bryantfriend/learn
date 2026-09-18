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
 learn.notes='An issue is a matter people care about that can be discussed or investigated; it need not be a disaster. A perspective is a way of seeing it, shaped by needs, values and experience. Do not assume a whole group shares one view. For 7A, use 2 minutes each for issue and perspective, 1 for the two voices, 2 for fact/evidence, and 3 for the argument. An argument is a claim supported by reasons and evidence, not a quarrel. The invented survey reports preferences only: it does not prove what is fair or represent every pupil.';
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
 apply.notes='For every partner task, assign A and B before starting the timer. Both must speak, then swap. The survey is supplied fictional evidence, not an instruction to collect data. Keep its chart onscreen while pairs make their plan. Listen for one cited count, another need, and one agreed revision. 7A timing: sort for 2 minutes; compare perspectives for 3; propose and question a plan for 4; examine the scales for 2; connect them for 4. Sorting key: issue, checkable fact, perspective. A strong comparison states both views and reasons fairly. The survey supports providing for different needs, but does not establish the fairest layout or represent all users. Ask about sample, access, safety and missing voices. Global scale means an issue affecting people across countries; this school example alone is local. Accept public-space questions about access, safety or competing uses. Do not assume a country or group has one perspective.';
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
 return lesson;
}
