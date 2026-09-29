import {grade7ACourses} from '../plans/grade7a.js';
import {grade7BCourses} from '../plans/grade7b.js';
import {workshops} from './geography-workshops.js';
import {geographyTeaching} from './geography-teaching.js';
import {boardFor,boardQuestions} from './geography-board-data.js';
import {reviewMission} from './geography-review.js';

const entries = new Map();
const reviewIndices=new Map();
for(const course of [...grade7ACourses,...grade7BCourses].filter(c=>c.subjectId==='geography')) {
 const visits={};let reviewSerial=0;
 for(const entry of course.lessons) {
  const units=[...new Set(entry.rows.map(r=>r.code))].filter(code=>workshops[code]).map(code=>({code,visit:visits[code]=(visits[code]||0)+1}));
  entries.set(entry.id,{entry,units});
  if(!units.length&&!entry.rows.some(r=>/^A\d|^E\d/.test(r.code)))reviewIndices.set(entry.id,reviewSerial++);
 }
}
const f=(title,mode,lines,extra={})=>({title,mode,lines,...extra});
const split=text=>text.split(/(?<=[.!?])\s+/).reduce((a,s)=>{if(a.length&&a.at(-1).length+s.length<160)a[a.length-1]+=' '+s;else a.push(s);return a;},[]);
function stage(id,title,minutes,frames,notes) {
 const weights=frames.map(x=>x.final?0.25:x.workSeconds?x.workSeconds: x.mode==='listen'?1:2);
 const total=weights.reduce((a,b)=>a+b,0);let left=minutes*60;
 frames.forEach((x,i)=>{const seconds=i===frames.length-1?left:Math.max(15,Math.floor(minutes*60*weights[i]/total/15)*15);x.expectedSeconds=seconds;x.timerSeconds=seconds;left-=seconds;});
 return {id,title,durationMinutes:minutes,notes,frames};
}
function reviewUnits(lesson,entry) {
 const prior=[...entries.values()].filter(x=>x.entry.id.startsWith(lesson.catalog.classes[0]==='7a'?'g7a-geo':'g7b-geo')&&x.entry.week<entry.week&&x.entry.quarter===entry.quarter).flatMap(x=>x.units.map(u=>u.code));
 const unique=[...new Set(prior)];
 return (unique.length?unique.slice(-3):['3.1','3.3']).map((code,i)=>({code,visit:1,review:true,missionIndex:(entry.slot+i)%workshops[code].missions.length}));
}
export function redesignGeography(lesson) {
 if(lesson.catalog?.subjectId!=='geography'||lesson.examId)return lesson;
 const {entry,units}=entries.get(lesson.id);
 const review=!units.length;
 const scheduled=review?reviewUnits(lesson,entry):lesson.catalog.classes[0]==='7a'?units.flatMap(u=>{
  const phases=[...new Set(entry.rows.filter(r=>r.code===u.code).map(r=>/independent enquiry/i.test(r.title)?2:/applied practice/i.test(r.title)?1:0))];
  if(u.code==='1.1')return [{...u,missionIndex:phases.includes(2)?1:0}];
  return phases.map(missionIndex=>({...u,missionIndex}));
 }):units;
 const active=scheduled.map(u=>{
  const w=workshops[u.code];const missionIndex=u.missionIndex??Math.min(u.visit-1,w.missions.length-1);
  // Consecutive visits advance the task, not just the wording of the opening slide.
  const p=geographyTeaching[`${u.code}.${missionIndex}`];
  if(!p)throw new Error(`Missing authored Geography teaching: ${u.code}.${missionIndex}`);
  const original=w.missions[missionIndex];
  return {...u,w,p,mission:review?reviewMission(original,p,reviewIndices.get(lesson.id)||0,scheduled.indexOf(u)):original,missionIndex};
 });
 const begin=[],teach=[],lab=[],apply=[],check=[],finish=[];const introduced=new Set();
 const support='Read the supplied source aloud. Define the topic words before work. Demonstrate one step, then let students try. Use the model response to check reasoning, not require exact wording. No textbook or printout is required; notebooks and pencils suffice.';
 for(const [i,u]of active.entries()) {
  const {code,w,p,mission:ms,missionIndex}=u;
  const reference=`geog.1 · section ${code} · ${review?'retrieval challenge':u.visit===1?'investigate':'apply in a new situation'}`;
  const first=!introduced.has(code);introduced.add(code);
  if(first)begin.push(f('Prediction vote · '+code,'think',[p.prompt,`1: ${p.correct}`,`2: ${p.wrong}`],{discussionId:`notice-${code}`,kicker:reference,footnote:'Vote before teaching. Keep your reason; after the demonstration, test whether you still agree.'}));
  if(first&&missionIndex===0)for(const line of w.teaching)teach.push(f('The idea you need','listen',split(line),{kicker:reference}));
  // Every mission, including combined weeks, has its own worked demonstration.
  const modelLines=split(p.model);
  for(let j=0;j<modelLines.length;j+=2)teach.push(f('Worked demonstration · '+p.objective,'listen',modelLines.slice(j,j+2),{kicker:reference,teachingModel:true}));
  const sourceLines=split(ms.source);
  for(let j=0;j<sourceLines.length;j+=3)teach.push(f('Read the investigation source'+(sourceLines.length>3?' · '+(j/3+1):''),'think',sourceLines.slice(j,j+3),{sourceCard:true,kicker:reference,footnote:'All required information is on screen. Numerical cases are classroom examples.'}));
  const investigation=ms.simulationPrompt || `${ms.title}: ${ms.task} Use the model to test one part; state what this model cannot establish.`;
  const board=boardFor(code,missionIndex,p,ms);
  if(review){board.type='decision';board.title=ms.reviewFormat+' · '+p.objective;board.id+='-review-'+(reviewIndices.get(lesson.id)||0);}
  lab.push(f('Class board challenge · '+p.objective,'pair',[board.type==='decision'?p.prompt:'Make a prediction, then open the board challenge.','Everyone proposes an answer. One pupil enters the choice; another explains it. Check and retry.'],{
   boardActivity:board,...(first?{simulation:{kind:ms.simulationKind||w.kind,code,variant:missionIndex,title:ms.title,prompt:investigation}}:{}),kicker:reference,discussionId:`board-${code}-${missionIndex}`}));
  apply.push(f(ms.title+' · your task','pair',split(ms.task),{sourceCard:ms.source,sourceModel:{kind:ms.simulationKind||w.kind,code,variant:missionIndex,title:ms.title+' · reference model',prompt:'Use this diagram as a reference while solving the independent task. Use the task source for its exact figures; this model may illustrate a separate example.'},kicker:reference,discussionId:`mission-${code}-${missionIndex}`,workSeconds:4}));
  check.push(f('Compare with a worked response','think',['Show your result before revealing the model.','Explain one step; different justified decisions can be valid.'],{type:'question',answerText:'Worked response',explanation:ms.answer,kicker:reference,discussionId:`model-${code}-${missionIndex}`}));
  if(first)finish.push(f('Exit ticket · '+code,'think',[ms.exit || `For ${ms.title.toLowerCase()}: give your conclusion, a supporting source detail and one step in your reasoning.`, 'Use one precise detail from today’s investigation.'],{discussionId:`exit-${code}`}));
 }
 // Explicitly teach connecting ideas in the first 7A lesson instead of assuming the skill.
 if(lesson.id==='g7a-geo-w02-1') {
  teach.push(f('What does “make a link” mean?','listen',['A link explains how two things affect or depend on each other.','Two labels: river + bridge. A link: “The bridge crosses the river, so people can reach the other bank.”']));
  teach.push(f('Build the sentence together','pair',['Start: “People clear trees …”','Add what may change: “… so there may be less shade.”','Say why the second idea follows. “Trees and shade” alone is a list.']));
  apply.push(f('Connection builders','pair',['Use two pairs: hill + road; river + farm.','Write one “because” or “so” sentence for each.','Sketch one link with a labelled arrow. Say which part is a possibility, not a fact.'],{discussionId:'connection-builders',workSeconds:3}));
  check.push(f('A list or an explanation?','think',['“River, bridge, houses.”','“A bridge gives a river crossing, so homes on opposite banks can be connected.”'],{type:'question',answerText:'The second sentence makes a link',explanation:'The first only names features. The second explains what the bridge does and how that affects access. A useful arrow needs an action label such as “allows people to cross”.',discussionId:'link-check'}));
  finish.splice(0,finish.length,f('Make one link yourself','think',['Choose a natural feature and a human activity.','Use “because” or “so” to explain how they connect.','Circle the words that explain the connection.'],{discussionId:'exit-link'}));
 }
 if(review) {
  // Review slots are diagnostic stations; no imaginary new textbook topic is introduced.
  begin.splice(0,begin.length,f('Choose your repair target','think',['Mark the topic you find hardest from the station titles.','Write a first attempt. Keep it to compare with your final attempt.']));
  teach.splice(0,teach.length,...active.flatMap(u=>split(u.p.model).map(line=>f('Repair model · '+u.p.objective,'listen',[line],{teachingModel:true}))));
  // One optional model; board decisions at all stations use the current review goal.
  lab.slice(1).forEach(frame=>{delete frame.simulation;});
 }
 finish.push(f('Lesson complete','listen',['Keep your investigation and exit ticket.'],{final:true}));
 const teacherModels=active.map(u=>u.code+' '+u.p.objective+'\nDemonstrate: '+u.p.model+'\nBoard check: '+u.p.correct+' '+u.p.explanation+'\nIndependent task: '+u.mission.answer).join('\n\n');
 const stages=[
  stage('begin',review?'Diagnose a gap':'A problem to solve',4,begin,support+' Ask for initial ideas without correcting every error yet.'),
  stage('teach',review?'Station evidence':'Teach and demonstrate',10,teach,support+' Define words, model one example and ask pupils to explain it back.\n'+teacherModels),
  stage('investigate','Class board challenge',8,lab,'2 minutes: all pupils predict on paper or with fingers. 4 minutes: tap choices on the board, ask for reasons, check and retry. 2 minutes: explain a changed condition. If a diagram is needed, open the optional model in this same block. Divide time between challenges in combined lessons.\n'+teacherModels),
  stage('apply',review?'Repair challenge':'Solve a new task',12,apply,'2 minutes: plan and label the given information. 5 minutes: complete the diagram, calculation or decision. 3 minutes: partners test one step or challenge one claim using the source. 2 minutes: revise independently and state why. For combined missions, divide the block. Use Show task source whenever needed.\n'+teacherModels+'\n'+support),
  stage('check','Check the reasoning',4,check,'Ask for results before revealing. Discuss one likely error and how to correct it.\n'+teacherModels),
  stage('finish','Independent exit',2,finish,'Collect a short independent response. If a pupil can only list words, model the missing connection next lesson. Optional extra-time activities are separate from the 40-minute core.')
 ];
 let elapsed=0;for(const s of stages){s.timeRange=`${elapsed}–${elapsed+s.durationMinutes} min`;elapsed+=s.durationMinutes;}
 const questions=active.flatMap(u=>{
  const p=u.p,bank=u.mission.questions || [[p.prompt,[p.correct,p.wrong],p.explanation]];
  return [...bank.map(q=>({question:q,source:[u.mission.questions?u.mission.source:p.model]})),...(u.mission.questions?[]:boardQuestions(u.code,u.missionIndex,p))];
 });
 Object.assign(lesson,{title:(review?'Review and repair: ':'')+active.map(u=>u.mission.title).join(' / '),geoRedesign:true,customVisuals:true,contentRevision:3003,coreMinutes:40,durationMinutes:40,stages,extensions:undefined,
  learningObjectives:active.map(u=>u.p.objective),geographyReview:review,
  bookSections:active.map(u=>u.code),workshopMissions:active.map(u=>({code:u.code,index:u.missionIndex,title:u.mission.title})),practiceQuestions:questions,
  openingScript:'40-minute, self-contained Geography workshop. No pupil book, worksheets or internet required. Bring notebooks, pencils and a ruler for drawing tasks. '+entry.rows.map(r=>r.objective).join(' / ')+'\nBook alignment: geog.1 sections '+active.map(u=>u.code).join(', ')+'. Section references are curriculum links, not instructions to find an unavailable page.\n'+teacherModels,
  pacingNote:'40-minute core. Extra time offers four optional five-minute activities; choose 10, 15 or 20 minutes after checking what the class needs.'});
 delete lesson.pilotTopic;
 return lesson;
}
