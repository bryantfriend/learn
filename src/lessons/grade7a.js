import { pilotLessons } from './pilot.js';
import { createGrade7AIssuePerspectiveLesson } from './issue-perspective-7a.js';
import { grade7ACourses } from '../plans/grade7a.js';
import { content as geo } from './g7-geo-content.js';
import { content as gp } from './g7-gp-content.js';
function f(title,mode,lines=[],extra={}){return {title,mode,lines,...extra};}
function s(id,title,time,start,notes,frames){return {id,title,durationMinutes:time,timeRange:start+'–'+(start+time)+' min',notes,frames};}
export const grade7Lessons=grade7ACourses.flatMap(course=>course.lessons.map((entry,index)=>{
 const geography=course.subjectId==='geography',subject=geography?'Geography':'Global Perspectives';
 const common={id:entry.id,title:entry.title,durationMinutes:40,gp:true,summary:true,
  eyebrow:'7A - '+subject+' Lesson '+(index+1),
  catalog:{subjectId:course.subjectId,grades:[7],classes:['7a'],quarter:entry.quarter,unit:'Week '+entry.week,order:index+1,weekStart:entry.weekStart},
  openingScript:'Adapted to '+course.sessionsPerWeek+' lesson(s) per week. Week beginning '+entry.weekStart+'. Source: '+entry.sourceFile+'. '+entry.rows.map(r=>r.objective).join(' / ')};
 if(pilotLessons[entry.id])return pilotLessons[entry.id](common);
 const notes=entry.rows.map(r=>r.title+'\nObjective: '+r.objective+'\nVocabulary: '+r.vocabulary+'\nOriginal starter: '+r.starter+'\nOriginal teaching: '+r.teaching+'\nOriginal practice / optional extension: '+r.practice+'\nOriginal plenary: '+r.plenary+'\nHomework: '+r.homework+'\nResources in original plan: '+r.resources).join('\n\n');
 if(entry.id==='g7a-gp-w01-2')return createGrade7AIssuePerspectiveLesson(common);
 if(entry.examCode){
  const examId='7A-'+(geography?'GEO':'GP')+'-'+entry.examCode, count=entry.examCode==='A0'?20:12;
  return {...common,examId,summary:false,stages:[
   s('prepare','Prepare',5,0,notes+'\nUse the '+count+'-item printable student paper; keep the explained key separate. One mark per correct answer. MCQs do not replace observation of collaboration or speaking.',[
    f(subject+' assessment','listen',[count+' questions. Four answer choices each.','Read the source information and circle one answer.'],{printExam:true}),
    f('Before you start','listen',['Write your name, class and date.','Work independently; ask if an instruction is unclear.'])
   ]),
   s('test','Independent work',25,5,'Start the optional timer manually. Adapt access arrangements as needed without coaching answers.',[
    f('Read, think, choose','think',['Use the source information in the paper.','Circle A, B, C or D for each question.','Check your responses before handing in.'],{timerSeconds:1500,printExam:true})
   ]),
   s('reflect','Collect and reflect',7,30,'Collect papers before displaying answers. Teacher tools links to the separate key. Record results outside this app.',[
    f('Check and hand in','think',['Check your name and all '+count+' answers.','Which skill felt strongest? Which needs practice?'])
   ]),
   s('finish','Finish',3,37,'Use item errors to choose a later review activity.',[
    f('Assessment complete','listen',['Thank you. Listen for the next instruction.'],{final:true})
   ])
  ]};
 }
 const codes=[...new Set(entry.rows.map(r=>r.code))];
 const active=codes.map(code=>{
  let d=geography?geo[code]:gp[code];
  if(!d)d=geography?geo[entry.quarter==='Q1'?'1.3':entry.quarter==='Q2'?'1.6':entry.quarter==='Q3'?'2.4':'2.9']:gp[entry.quarter==='Q4'?'R2':'R1'];
  return {code,d};
 });
 const sources=active.flatMap(({code,d})=>[
  f('Key idea · '+code,'listen',[d[0]]),
  f('Examine the source · '+code,'think',[d[1]],{footnote:geography&&code==='1.4'?'Ironbridge facts: Ironbridge Gorge Museums Trust. Other comparison examples are invented.':'Original classroom example. Numerical case-study data and unnamed places are invented.'}),
  ...(geography&&['2.4','2.5','2.8','2.9'].includes(code)?[f('Use the practice diagram','think',[],{diagram:code})]:[])
 ]);
 const application=active.flatMap(({code,d})=>[
  f('Practise · '+code,'pair',[d[2]],{discussionId:'apply-'+code,timerSeconds:180}),
  ...(entry.slot===2?[f('Challenge and revise','pair',['Exchange work. Ask one question about evidence or method.','Improve one part and explain the change.'],{discussionId:'revise-'+code,timerSeconds:120})]:[])
 ]);
 const checks=active.map(({code,d},ci)=>{
  const q=geography?d[3][(entry.week+ci)%4]:[d[3],d[4],d[5]],options=q[1].slice(1),answer=(index+ci)%4;
  options.splice(answer,0,q[1][0]);
  return f(q[0],'think',[],{type:'question',options:options.map((label,i)=>({id:String.fromCharCode(65+i),label})),answer:String.fromCharCode(65+answer),explanation:q[2],discussionId:'check-'+code});
 });
 return {...common,stages:[
  s('begin','Start and retrieve',4,0,notes,[
   f(geography?'Geography enquiry':'Think about the issue','think',['Recall one idea from last time.','What evidence or method will help today?']),
   f('Our focus','listen',active.map(({code,d})=>d[0]))
  ]),
  s('sources','Learn and investigate',10,4,notes+'\nThe on-screen sources are original replacements for unavailable source packs. Textbook references remain optional teacher resources.',sources),
  s('apply',entry.slot===2?'Apply and improve':'Guided and independent practice',14,14,notes+'\nCore task: '+active.map(x=>x.d[2]).join(' / ')+' Support: vocabulary, a worked first step and oral rehearsal. Extension: use another example or the original weekly practice task.',application),
  s('check','Check and explain',8,28,active.map(({d})=>geography?d[3].map(q=>q[2]).join(' '):d[5]).join('\n'),checks),
  s('finish','Reflect and finish',4,36,notes,[
   f('Show your learning','think',['Explain one answer using evidence or a method.','Name one correction or next question.']),
   f('Lesson complete','listen',['Keep your work. Listen for the next instruction.'],{final:true})
  ])
 ]};
}));
