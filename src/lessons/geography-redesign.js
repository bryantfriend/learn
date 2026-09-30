import {grade7ACourses} from '../plans/grade7a.js';
import {grade7BCourses} from '../plans/grade7b.js';
import {workshops} from './geography-workshops.js';
import {geographyTeaching} from './geography-teaching.js';
import {boardFor,boardQuestions} from './geography-board-data.js';
import {reviewMission} from './geography-review.js';
import {rebuildUKLesson} from './geography-uk-lesson.js';
import {deepenGeography} from './geography-depth.js';

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
// Static worked diagrams use the numbers in that demonstration, not the lab's
// separate default experiment. Investigation cards retain their own case data.
const workedValues={'2.2.0':[5,2],'2.2.1':[3,25],'2.2.2':[10,5],'2.5.0':[4,7],'2.5.1':[8,6],'2.5.2':[3,7],'2.6.0':[7,50],'2.6.2':[6,50],'2.7.0':[1,250],'2.7.1':[2,250],'2.7.2':[3,250],'4.2.0':[8,5],'4.8.0':[7,10],'5.8.0':[20,60]};
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
 const support='Read the supplied source aloud. Define the topic words before work. Demonstrate one step, then let students try. Use the model response to check reasoning, not require exact wording. Record shared drawings and calculations in the board workspace. No textbook, printout or notebook is required.';
 for(const [i,u]of active.entries()) {
  const {code,w,p,mission:ms,missionIndex}=u;
  const reference=`geog.1 · section ${code} · ${review?'retrieval challenge':u.visit===1?'investigate':'apply in a new situation'}`;
  const visual={kind:ms.simulationKind||w.kind,code,phase:0};
  const first=!introduced.has(code);introduced.add(code);
  if(first)begin.push(f('Prediction vote · '+code,'think',[p.prompt],{choices:[p.correct,p.wrong],geoDisplay:{...visual,caption:'Look first. Use one visible feature to help explain your prediction.'},discussionId:`notice-${code}`,kicker:reference,footnote:'Show 1 or 2 fingers. Keep your reason; test it after the demonstration.'}));
  if(first&&missionIndex===0)for(const [n,line] of w.teaching.entries())teach.push(f(n?'Try describing the visual':'See the idea','listen',split(line),{kicker:reference,geoDisplay:{...visual,phase:Math.min(n,2),caption:n?'Point to the part of the diagram that supports this statement.':'Trace the feature or process as your teacher explains it.'}}));
  // Every mission, including combined weeks, has its own worked demonstration.
  const modelLines=split(p.model);
  teach.push(f('Build it together · '+p.objective,'share',['Look at the diagram. Predict the next step before your teacher reveals it.','Point, trace or explain what changes.'],{kicker:reference,teachingModel:true,geoDisplay:{...visual,...(workedValues[`${code}.${missionIndex}`]?{values:workedValues[`${code}.${missionIndex}`]}:{}),phase:Math.min(missionIndex,2),demo:{steps:modelLines},caption:'A teaching example. The independent task supplies its own facts.'}}));
  const investigation=ms.simulationPrompt || `${ms.title}: ${ms.task} Use the model to test one part; state what this model cannot establish.`;
  const board=boardFor(code,missionIndex,p,ms);
  if(review){board.type='decision';board.title=ms.reviewFormat+' · '+p.objective;board.id+='-review-'+(reviewIndices.get(lesson.id)||0);}
  lab.push(f('Class board challenge · '+p.objective,'pair',[board.type==='decision'?board.question.prompt:'Make a prediction, then open the board challenge.','One pupil moves or selects; another explains. Check, discuss and retry.'],{
   geoDisplay:visual,boardActivity:{...board,visual},...(first?{simulation:{kind:ms.simulationKind||w.kind,code,variant:missionIndex,title:ms.title,prompt:investigation}}:{}),kicker:reference,discussionId:`board-${code}-${missionIndex}`}));
  apply.push(f(ms.title+' · your task','pair',split(ms.task),{geoDisplay:{workpad:visual.kind,source:ms.source,title:ms.title,code},sourceCard:ms.source,sourceModel:{kind:ms.simulationKind||w.kind,code,variant:missionIndex,title:ms.title+' · reference model',prompt:'Use this diagram as a reference while solving the independent task. Use the task source for its exact figures; this model may illustrate a separate example.'},kicker:reference,discussionId:`mission-${code}-${missionIndex}`,workSeconds:4}));
  check.push(f('Explain your solution · '+ms.title,'share',[ms.task,'Show the class the part of your map, diagram or decision that answers this task.'],{geoDisplay:{workpad:visual.kind,source:ms.source,title:ms.title,code},sourceCard:ms.source,boardWork:true,type:'question',answerText:'Compare one possible solution',explanation:ms.answer,kicker:reference,discussionId:`model-${code}-${missionIndex}`}));
  if(first)finish.push(f('At the door · '+code,'share',[p.prompt,'Say your answer to your teacher in one short sentence as you leave.'],{discussionId:`exit-${code}`}));
 }
 // Explicitly teach connecting ideas in the first 7A lesson instead of assuming the skill.
 if(lesson.id==='g7a-geo-w02-1') {
  teach.push(f('What does “make a link” mean?','listen',['A link explains how two things affect or depend on each other.','Two labels: river + bridge. A link: “The bridge crosses the river, so people can reach the other bank.”']));
  teach.push(f('Build the sentence together','pair',['Start: “People clear trees …”','Add what may change: “… so there may be less shade.”','Say why the second idea follows. “Trees and shade” alone is a list.']));
  apply.push(f('Connection builders','pair',['Use two pairs: hill + road; river + farm.','Write one “because” or “so” sentence for each.','Sketch one link with a labelled arrow. Say which part is a possibility, not a fact.'],{discussionId:'connection-builders',workSeconds:3}));
  check.push(f('A list or an explanation?','think',['“River, bridge, houses.”','“A bridge gives a river crossing, so homes on opposite banks can be connected.”'],{type:'question',answerText:'The second sentence makes a link',explanation:'The first only names features. The second explains what the bridge does and how that affects access. A useful arrow needs an action label such as “allows people to cross”.',discussionId:'link-check'}));
  finish.splice(0,finish.length,f('Say one link at the door','share',['As you leave, tell your teacher one sentence using “because” or “so”.'],{discussionId:'exit-link'}));
 }
 if(review) {
  // Review slots are diagnostic stations; no imaginary new textbook topic is introduced.
  begin.splice(0,begin.length,f('Choose your repair target','think',['Choose the topic you find hardest from the station titles.','Give a first attempt aloud. Your teacher records it on the board to compare later.'],{boardWork:true}));
  teach.splice(0,teach.length,...active.map(u=>f('Rebuild the idea · '+u.p.objective,'share',['Predict the next step. Reveal it and explain the diagram.'],{teachingModel:true,geoDisplay:{kind:u.w.kind,code:u.code,phase:Math.min(u.missionIndex,2),demo:{steps:split(u.p.model)}}})));
  // One optional model; board decisions at all stations use the current review goal.
  lab.slice(1).forEach(frame=>{delete frame.simulation;});
 }
 finish.push(f('Lesson complete','listen',['Have your spoken answer ready for the door.'],{final:true}));
 const teacherModels=active.map(u=>u.code+' '+u.p.objective+'\nDemonstrate: '+u.p.model+'\nBoard check: '+u.p.correct+' '+u.p.explanation+'\nIndependent task: '+u.mission.answer).join('\n\n');
 const stages=[
  stage('begin',review?'Diagnose a gap':'A problem to solve',4,begin,support+' Ask for initial ideas without correcting every error yet.'),
  stage('teach',review?'Station evidence':'Teach and demonstrate',10,teach,support+' Define words, model one example and ask pupils to explain it back.\n'+teacherModels),
  stage('investigate','Class board challenge',8,lab,'All pupils predict silently or with fingers. Invite a pupil to tap choices on the board; ask another for a reason, then check and retry. Explain a changed condition. If a diagram is needed, open the optional model in this same block. Divide the challenge time between topics in combined lessons.\n'+teacherModels),
  stage('apply',review?'Repair challenge':'Solve a new task',12,apply,'Plan and label the given information on the board. Invite suggestions to complete the diagram, calculation or decision. A different pupil tests one step or challenges one claim using the source. Improve the shared response and state why. For combined missions, divide the application time. Use Show task source whenever needed.\n'+teacherModels+'\n'+support),
  stage('check','Check the reasoning',4,check,'Ask for results before revealing. Discuss one likely error and how to correct it.\n'+teacherModels),
  stage('finish','A sentence at the door',2,finish,'Leave the prompt visible. Each student says one short sentence to the teacher while leaving the classroom. For combined topics, let pupils choose one prompt. No writing or extra class quiz. Use errors to choose next lesson’s recap.')
 ];
 let elapsed=0;for(const s of stages){s.timeRange=`${elapsed}–${elapsed+s.durationMinutes} min`;elapsed+=s.durationMinutes;}
 const questions=active.flatMap(u=>{
  const p=u.p,bank=u.mission.questions || [[p.prompt,[p.correct,p.wrong],p.explanation]];
  return [...bank.map(q=>({question:q,source:[u.mission.questions?u.mission.source:p.model]})),...(u.mission.questions?[]:boardQuestions(u.code,u.missionIndex,p))];
 });
 Object.assign(lesson,{title:(review?'Review and repair: ':'')+active.map(u=>u.mission.title).join(' / '),geoRedesign:true,customVisuals:true,contentRevision:4000,coreMinutes:40,durationMinutes:40,stages,extensions:undefined,
  learningObjectives:active.map(u=>u.p.objective),geographyReview:review,
  bookSections:active.map(u=>u.code),workshopMissions:active.map(u=>({code:u.code,index:u.missionIndex,title:u.mission.title})),practiceQuestions:questions,
  openingScript:'40-minute, self-contained Geography workshop. No pupil book, worksheets or internet required. Bring notebooks, pencils and a ruler for drawing tasks. '+entry.rows.map(r=>r.objective).join(' / ')+'\nBook alignment: geog.1 sections '+active.map(u=>u.code).join(', ')+'. Section references are curriculum links, not instructions to find an unavailable page.\n'+teacherModels,
  pacingNote:'40-minute core. Extra time offers four optional five-minute activities; choose 10, 15 or 20 minutes after checking what the class needs.'});
 delete lesson.pilotTopic;
 for(const frame of lesson.stages.find(s=>s.id==='teach').frames)if(!frame.geoDisplay)frame.geoDisplay={kind:active[0].w.kind,code:active[0].code,phase:1,caption:'Point to the two features, then explain the link between them.'};
 rebuildUKLesson(lesson,stage);
 deepenGeography(lesson,active,stage,reviewIndices.get(lesson.id)||0);
 return lesson;
}
