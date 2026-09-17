import { createIssuePerspectiveLesson } from './issue-perspective.js';
import { grade7BCourses } from '../plans/grade7b.js';
import { content as geo } from './g7b-geo-content.js';
import { content as gp } from './g7b-gp-content.js';
const f=(title,mode,lines=[],extra={})=>({title,mode,lines,...extra});
const s=(id,title,durationMinutes,start,notes,frames)=>({id,title,durationMinutes,timeRange:start+'–'+(start+durationMinutes)+' min',notes,frames});
const reviewCodes={Q1:['3.1','3.2','3.3','3.4'],Q2:['3.5','3.6','3.7','3.8'],Q3:['4.7','4.8','5.1','5.2'],Q4:['5.8','5.9','5.10']};
export const grade7BLessons=grade7BCourses.flatMap(course=>{
 const visits={};
 return course.lessons.map((entry,index)=>{
  const geography=course.subjectId==='geography',subject=geography?'Geography':'Global Perspectives',row=entry.rows[0];
  const common={id:entry.id,title:entry.title,durationMinutes:40,gp:true,summary:true,eyebrow:'7B - '+subject+' Lesson '+(index+1),
   catalog:{subjectId:course.subjectId,grades:[7],classes:['7b'],quarter:entry.quarter,unit:'Week '+entry.week+' · Lesson '+entry.slot,order:index+1},
   openingScript:'Stage 6 support. '+row.objective+' Source: '+entry.sourceFile+' / '+entry.sourceSheet+' / row '+row.sourceRow};
  const notes=[row.title,'Objective: '+row.objective,'Vocabulary: '+row.vocabulary,'Starter: '+row.starter,'Teaching: '+row.teaching,'Practice: '+row.practice,'Plenary: '+row.plenary,'Homework: '+row.homework,'Resources: '+row.resources,'Notes: '+row.notes,'40-minute core lesson. Any original 45-minute slot can use the extra five minutes for extension. Original textbook/pack resources are optional; on-screen sources supply the core example.'].join('\n\n');
  if(entry.id==='g7b-gp-w01-2')return createIssuePerspectiveLesson(common);
  if(entry.examCode)return {...common,summary:false,examId:'7B-'+(geography?'GEO':'GP')+'-'+entry.examCode,stages:[
   s('prepare','Prepare',5,0,notes+'\nUse the 12-question paper. Read instructions aloud if helpful, without explaining answers. Baseline identifies starting points; it is not expected mastery.',[f(subject+' assessment','listen',['12 questions. Four choices each.','Circle one answer for each question.'],{printExam:true}),f('Ready to begin','listen',['Write your name, class and date.','Work independently. Ask if an instruction is unclear.'])]),
   s('test','Independent work',25,5,'Start the timer only when the class is ready. No scores or names are saved here.',[f('Read, think, choose','think',['Read the short source carefully.','Circle A, B, C or D.','Check before handing in.'],{timerSeconds:1500,printExam:true})]),
   s('reflect','Collect and reflect',7,30,'Collect papers before opening the separate key in Teacher tools. Keep practical teamwork and speaking evidence alongside the MCQ result.',[f('Check and hand in','think',['Check your name and all 12 responses.','Choose one skill you want to practise.'])]),
   s('finish','Finish',3,37,'Use errors to choose a later review task.',[f('Assessment complete','listen',['Keep the room calm. Listen for the next instruction.'],{final:true})])
  ]};
  const isReview=!((geography?geo:gp)[row.code]);
  const code=isReview?(geography?reviewCodes[entry.quarter][index%reviewCodes[entry.quarter].length]:entry.quarter==='Q4'?'R2':'R1'):row.code;
  const d=(geography?geo:gp)[code],visit=visits[row.code]=(visits[row.code]||0)+1;
  const q=geography?d[3][(visit-1)%d[3].length]:[d[3],d[4],d[5]],options=q[1].slice(1),answer=index%4;
  options.splice(answer,0,q[1][0]);
  const originalTask=row.practice.replace(/^\d+ min\s*[—–-]\s*/,'').split(/Support:|Stretch:/)[0].trim();
  const support=geography?'Say: “I notice ... . This may be because ... .”':'Say: “The source says ... . I think ... because ... .”';
  const taskFrames=[
   f(isReview?'Review the example':'Try it together','pair',[d[2]],{discussionId:'guided',timerSeconds:240}),
   f('Your turn','think',[visit>1?'Improve or extend your earlier work using today’s source.':'Make your own labelled drawing, table or short answer.',support],{discussionId:'independent',timerSeconds:240}),
   f(isReview?'Review / project task':'Use today’s skill','pair',[originalTask],{discussionId:'weekly-task',timerSeconds:240}),
   f('Share and improve','share',['Show one piece of evidence or explain one method.','Listen to a partner. Make one useful correction.'],{discussionId:'share',timerSeconds:120})
  ];
  const extras=geography&&code==='5.5'?[
   f('Erosion landforms','listen',['Waterfall: a steep drop in a river. A retreating waterfall can leave a gorge.','Meander: a bend with outer-bank erosion and inner-bank deposition.']),
   f('Deposition and cut-offs','listen',['Oxbow lake: a cut-off river bend. Floodplain: low land built up by river deposits.','Natural levee: a raised bank formed by deposits beside the channel.'])
  ]:[];
  const diagram=geography?({'3.1':'uk','3.2':'uk','4.4':'valley','5.2':'cycle','5.5':'bend'})[code]:null;
  return {...common,stages:[
   s('begin','Start and recall',5,0,notes,[f('Start with what you know','think',['Recall one idea from last time.','Explain it to a partner in one sentence.']),f('Today’s idea','listen',[d[0]])]),
   s('learn','Learn with a source',10,5,notes+'\nModel the first part of the core task, then allow pupils to rehearse orally. Check vocabulary before asking for writing.',[
    f('Read the short source','listen',[d[1]],{footnote:geography?'Practice figures and unnamed places are invented. Named-place facts: see course source notes.':'Original classroom example; people and data are invented.'}),
    ...(diagram?[f('Look at the diagram','think',[],{diagram:'g7b-'+diagram})]:[]),...extras,
    f('Find and explain','pair',['Point to one useful detail in the source.',support],{discussionId:'source',timerSeconds:90})
   ]),
   s('apply',isReview?'Review, apply and reflect':visit>1?'Practise and improve':'Guided practice',15,15,notes,taskFrames),
   s('check','Check and explain',6,30,q[2],[
    f(q[0],'think',[],{type:'question',options:options.map((label,i)=>({id:String.fromCharCode(65+i),label})),answer:String.fromCharCode(65+answer),explanation:q[2],discussionId:'check'})
   ]),
   s('finish','Reflect and finish',4,36,notes,[f('My next step','think',['Show one thing you can now explain.','Complete: “Next time I will ...”.']),f('Lesson complete','listen',['Keep your work. Listen for the next instruction.'],{final:true})])
  ]};
 });
});
