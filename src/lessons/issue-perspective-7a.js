import {createIssuePerspectiveLesson} from './issue-perspective.js';

// Reuse the coherent visual story, with the Grade 7 plan's deeper evidence and scale work.
export function createGrade7AIssuePerspectiveLesson(common){
 const lesson=createIssuePerspectiveLesson(common);
 lesson.title='What is an Issue and a Perspective?';
 lesson.openingScript+=' For 7A, compare reasons, distinguish evidence from an argument, and connect personal, local and global scales.';
 const [begin,learn,apply,check,finish]=lesson.stages;
 begin.frames[1].lines=['Identify the issue and explain two perspectives.','Use evidence to support a reasoned argument.'];
 learn.notes='An issue is a matter people care about that can be discussed or investigated; it need not be a disaster. A perspective is a way of seeing it, shaped by needs, values and experience. Do not assume a whole group shares one view. For 7A, use 2 minutes each for issue and perspective, 1 for the two voices, 2 for fact/evidence, and 3 for the argument. An argument is a claim supported by reasons and evidence, not a quarrel. The invented survey reports preferences only: it does not prove what is fair or represent every pupil.';
 learn.frames.push({
  title:'Evidence supports an argument',mode:'listen',
  lines:['Evidence: in our fictional survey, 18 of 30 pupils wanted football; 12 wanted quiet space.','Argument: provide both areas, because the survey shows different needs.','Limit: 30 responses do not tell us what every pupil needs.'],
  footnote:'Invented practice data. An argument is a claim supported by reasons and evidence.'
 });
 apply.frames[1].lines=['Compare Sam’s and Amina’s views, reasons and needs.','Explain the other view fairly, even if you disagree.'];
 apply.frames[2].lines=['Propose a fair plan. Use the survey as evidence.','Whose voice is missing? What else must we find out?'];
 apply.frames[3].lines=['Personal: my needs. Local: how our school shares space.','Global: how can communities worldwide provide fair access to public space?'];
 apply.frames.push({
  title:'Connect the scales',mode:'pair',
  lines:['Turn “public space” into an issue people can investigate.','Link your own needs, a local park and communities in different countries.','Suggest one question for a park user. Do not assume their view.'],
  discussionId:'scale-transfer',timerSeconds:90
 });
 apply.notes='7A timing: sort for 2 minutes; compare perspectives for 3; propose and question a plan for 4; examine the scales for 2; connect them for 4. Sorting key: issue, checkable fact, perspective. A strong comparison states both views and reasons fairly. The survey supports providing for different needs, but does not establish the fairest layout or represent all users. Ask about sample, access, safety and missing voices. Global scale means an issue affecting people across countries; this school example alone is local. Accept public-space questions about access, safety or competing uses. Do not assume a country or group has one perspective.';
 check.frames[2]={
  title:'What can our survey support?',mode:'think',type:'question',
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
