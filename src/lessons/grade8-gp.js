import { guideSupplyChainLesson } from './supply-chain.js';
import { perspectivesGame } from './perspectives-game.js';
import { pilotLessons } from './pilot.js';
import { grade8GPPlan } from '../plans/grade8-gp.js';
import { gpContent } from './gp-content.js';
import { gpExams } from './gp-exams.js';
function f(title,mode,lines=[],extra={}) { return {title,mode,lines,...extra}; }
function s(id,title,minutes,start,notes,frames) { return {id,title,durationMinutes:minutes,timeRange:start+'–'+(start+minutes)+' min',notes,frames}; }
export const gpLessons=grade8GPPlan.entries.map(function(entry,index){
 const common={id:entry.id,title:entry.title,durationMinutes:40,gp:true,summary:true,eyebrow:'8th Grade - Global Perspectives Lesson '+(index+1),
 catalog:{subjectId:'global-perspectives',grades:[8],unit:['Assessment','Review'].includes(entry.unit)?entry.unit:'Unit '+entry.unit,order:index+1,quarter:entry.quarter,month:entry.month},
 openingScript:'Objective: '+entry.objective+' References from your plan: '+entry.objectives};
 if(entry.code==='1.2')return perspectivesGame(common);
 if(pilotLessons[entry.id])return pilotLessons[entry.id](common);
 if(entry.unit==='Assessment'){
  const exam=gpExams[entry.code];
  return {...common,examId:entry.code,summary:false,stages:[
   s('prepare','Prepare the assessment',4,0,'Print one student paper per pupil, separate from the key. Each has '+exam.totalMarks+' single-answer questions. Award one mark per correct answer; no negative marking. This MCQ adaptation checks reasoning about the planned skills; use other classroom evidence for actual collaboration and speaking.',[
    f(exam.title,'listen',[exam.totalMarks+' questions. Choose one answer each.','Choose one answer, A, B, C or D, for each question.'],{printExam:true}),
    f('Before you begin','listen',['Write your name, class and date.','Read each source before answering.','All case-study data in this paper is fictional.'])
   ]),
   s('test','Independent test',30,4,'Distribute the papers. Start the timer manually. Answer procedural questions without indicating correct choices. Adapt access arrangements to class needs.',[
    f('Work independently','think',['Read carefully and circle one answer per question.','Use the supplied sources; no internet is needed.','Check your choices if you finish early.'],{timerSeconds:1800,printExam:true})
   ]),
   s('collect','Collect and reflect',4,34,'Collect papers before reviewing answers. The separate key is in Teacher tools. Record marks on paper; this app stores no pupil scores.',[
    f('Check and hand in','think',['Check your name and all '+exam.totalMarks+' responses.','Hand in your paper when asked.']),
    f('Reflect on your approach','think',['Which question needed the closest reading?','What will you do differently next time?'])
   ]),
   s('finish','Finish',2,38,'Mark one point per correct answer. Use common misconceptions to plan a later review.',[
    f('Assessment complete','listen',['Thank you for your careful work.','Listen for the next instruction.'],{final:true})
   ])
  ]};
 }
 const d=gpContent[entry.code];if(!d)throw Error('Missing content '+entry.code);
 const note='Objective: '+entry.objective+' Codes: '+entry.objectives+'. All cases and figures are fictional teaching materials, not factual claims about named places. Use notebooks or oral responses; no devices or external packs are needed.';
 const options=d[5].slice(1),correct=index%4;options.splice(correct,0,d[5][0]);
 return guideSupplyChainLesson({...common,stages:[
  s('notice','Notice and question',4,0,note,[
   f(d[0],'think',['What would you need to know before reaching a conclusion?']),
   f('Today’s thinking tool','listen',[d[1]],{footnote:entry.code+' · '+entry.month+' · '+entry.quarter})
  ]),
  s('sources','Examine the evidence',8,4,note+' Read aloud if helpful. Distinguish source statements from inferences.',[
   f('Source card A','think',[d[2]],{footnote:'Fictional case / data for this lesson.'}),
   f('Source card B','think',[d[3]],{footnote:'Fictional case / data for this lesson.'}),
   f('What can we claim?','pair',['Name a supported detail, an inference and a missing piece of evidence.'],{discussionId:'source-talk',timerSeconds:90})
  ]),
  s('model','Model the reasoning',6,12,'Separate a claim, its evidence and its limits. Model: '+d[8],[
   f('Build an explanation','listen',[d[1],'Use: “The evidence suggests … because …; however …”']),
   f('A worked example','listen',[d[8]])
  ]),
  s('apply','Apply and discuss',10,18,'Task: '+d[7]+' Success criteria: use source evidence, consider another view or explanation, state a limit. For role tasks use teams of four; combine roles if needed. Allow planning, contrasting proposals and revision.',[
   f('Your challenge','pair',[d[7]],{timerSeconds:240,discussionId:'apply'}),
   f('Check your explanation','pair',['Use one precise source detail.','Consider another view or explanation.','State what the evidence cannot tell you.'],{timerSeconds:120}),
   f('Share and improve','share',['Explain in 45 seconds.','Listeners: ask one fair question.','Revise one part after hearing another view.'],{discussionId:'share'})
  ]),
  s('check','Check understanding',8,28,'Rationale: '+d[6]+' Discuss why distractors overclaim or misread evidence. Accept other well-justified open responses.',[
   f(d[4],'think',[],{type:'question',options:options.map((label,i)=>({id:String.fromCharCode(65+i),label})),answer:String.fromCharCode(65+correct),explanation:d[6],discussionId:'check'}),
   f('Explain your choice','pair',['Justify your answer using the source.','Explain why one other option is weaker.'],{discussionId:'reasoning'}),
   f('Transfer the skill','think',[d[9]],{type:'question',answerText:'Suggested response',explanation:d[10],discussionId:'transfer'})
  ]),
  s('reflect','Reflect and finish',4,36,'Use an oral exit response or a short notebook entry. Look for a specific change in reasoning.',[
   f('Your exit response','think',['Complete: “At first I thought …; now I think … because …”','Name one question you would investigate next.']),
   f('Lesson complete','listen',['Keep your work for your skills portfolio.','Listen for the next instruction.'],{final:true})
  ])
 ]});
});
