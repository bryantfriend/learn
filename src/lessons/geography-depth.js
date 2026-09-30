import {boardCase} from './geography-board-cases.js';
import {workshops} from './geography-workshops.js';
const routine=['Everyone thinks first.','Hear two answers and ask what in the source supports each.','Reveal the model, then let a pupil repair or improve the class answer.'];
const roles=['Find and point','Work it out together','Challenge the claim','Change the conditions','Defend a decision','Teach it back'];
function roundFrame(c,q,index,code,serial){return {
 title:roles[index]+' · board case '+(serial+1),mode:index===0?'think':'share',lines:[q.prompt],
 type:'question',answerText:'Teaching model',explanation:q.answer,responseHint:'Think → discuss → hear two answers → reveal and improve.',
 geoDisplay:{source:c.source,workpad:workshops[code].kind,title:'Build the case diagram · '+code},sourceCard:c.source,
 boardRound:true,boardWork:true,discussionId:`board-case-${code}-${serial}-${index}`,
 kicker:`geog.1 · section ${code} · guided board practice`,
 teacherPrompt:rq(index),...(index===5?{followUp:'Invite a different pupil to explain the answer using their own words.'}:{})
 };}
function rq(i){return ['Read the source aloud. Give 20 seconds to look. Ask one pupil to point and another to name the evidence.','Let everyone calculate or reason silently. Take two methods, then work through one visibly on the board.','Read both the claim and source. Pupils identify the exact word or step to change; do not accept only “wrong”.','Pause before revealing. Hear a prediction and a reason, then compare it with the changed conditions.','Take two proposals. Ask each speaker which source detail supports the choice and what is still unknown.','Ask a pupil to teach the answer back in simple language. A second pupil adds a missing condition.'][i];}
export function deepenGeography(lesson,active,makeStage,reviewSerial=0){
 if(!lesson.geoRedesign)return lesson;
 const stages=lesson.stages,find=id=>stages.find(s=>s.id===id);
 const caseFiles=active.map((u,i)=>({code:u.code,index:u.missionIndex,...boardCase(u.code,u.missionIndex,lesson.geographyReview?reviewSerial+1:0)}));
 // Two purposeful core questions per case. The rest stay in the teacher guide
 // so a lesson does not become a repeated six-question reading exercise.
 const selected=caseFiles.flatMap((c,serial)=>[1,3].map(i=>roundFrame(c,c.questions[i],i,c.code,serial)));
 if(lesson.id==='g7b-geo-w02-1'){
  selected.length=0;
 }
 /* The UK workshop already has a complete map investigation and two delivery
    rounds. Its question bank remains in the teacher guide, outside the core. */
 const half=Math.ceil(selected.length/2);
 find('investigate').frames.push(...selected.slice(0,half));
 find('apply').frames.push(...selected.slice(half));
 // Make existing application tasks usable from the board, with an explicit
 // place to draw and record a shared result. Printing/writing stay optional.
 for(const s of stages)for(const frame of s.frames){
  if(frame.discussionId?.startsWith('mission-')||frame.discussionId?.startsWith('model-'))frame.workspaceId=frame.discussionId.replace(/^(mission|model)-/,'task-');
  if(frame.discussionId?.startsWith('model-')){frame.solutionCheck=true;frame.boardTask=true;frame.taskInstructions=frame.lines.slice(0,1);frame.lines=[frame.lines[0].split(/(?<=[.!?])\s+/)[0]];frame.title=frame.title.replace('Explain your solution · ','Check · ');frame.responseHint='Open your class diagram, explain it, then compare the example.';}
  if(s.id==='apply'&&!frame.type&&!frame.postcardActivity){
   frame.boardWork=true;frame.boardTask=true;
   frame.responseHint='Work together on the board. No book or printout needed.';
  }
  if(frame.teachingModel&&!frame.geoDisplay?.atlas?.fill&&!frame.geoDisplay?.demo)frame.boardWork=true;
 }
 const timing={begin:2,teach:8,investigate:12,apply:14,check:3,finish:1};
 const order={begin:'Notice and predict',teach:'Build the idea together',investigate:'Map and diagram challenges',apply:'Solve and change the case',check:'Explain your solution',finish:'A sentence at the door'};
 let elapsed=0;
 for(const s of stages){
  const count=s.frames.filter(f=>f.boardRound).length;
  const activityMinutes=s.id==='investigate'?(count>3?3:5):(count>3?5:8);
  const plan=count?`${timing[s.id]}-minute route: about ${activityMinutes} minutes for the original ${s.id==='investigate'?'interactive challenge':'application'}, then ${timing[s.id]-activityMinutes} minutes across ${count} new board rounds. Each round needs a pupil response, a reason and a checked or improved class answer. Do not read all models straight through. `:'';
  const coaching=s.frames.filter(f=>f.boardRound).map(f=>`${f.title}: ${f.lines[0]}\nRun it: ${f.teacherPrompt}\nModel: ${f.explanation}`).join('\n\n');
  const notes=plan+s.notes+'\n\nBoard participation: '+routine.join(' ')+' Use the board workspace to point, circle, calculate or sketch. Pair talk is optional; pupils can prepare silently and respond to the class. '+coaching;
  const rebuilt=makeStage(s.id,lesson.id==='g7b-geo-w02-1'?s.title:order[s.id],lesson.id==='g7b-geo-w02-1'?s.durationMinutes:timing[s.id],s.frames,notes);Object.assign(s,rebuilt);s.timeRange=`${elapsed}–${elapsed+s.durationMinutes} min`;elapsed+=s.durationMinutes;
 }
 lesson.boardCaseFiles=caseFiles;lesson.boardFirst=true;lesson.contentRevision=6000;
 lesson.boardTeachingGuide={
  title:lesson.title,minutes:40,
  message:'The timings are teaching plans, not evidence that reading the slides will take 40 minutes. Use the guided rounds for everyone to reason, hear contrasting answers, record a class response and repair it.',
  routine,
  stages:stages.map(s=>({title:s.title,minutes:s.durationMinutes,rounds:s.frames.filter(f=>f.boardRound||f.boardTask||f.postcardActivity||f.boardActivity).length,notes:s.notes})),
  quickClass:'If answers come quickly, ask pupils to defend a second method, challenge the model or change one condition on the board. Hear a prediction before testing the changed case. This checks transfer, rather than reading the same answer again.',
  extra:caseFiles.flatMap(c=>c.questions.filter((q,i)=>lesson.id==='g7b-geo-w02-1'||![1,3].includes(i)).map(q=>({source:c.source,...q})))
 };
 lesson.openingScript='Board-led Geography. No student book, worksheet or notebook is required. Optional paper can be used for private thinking. '+lesson.openingScript.replace(/Bring notebooks, pencils and a ruler for drawing tasks\./,'Use the board workspace for shared diagrams and calculations.');
 lesson.pacingNote='40-minute board-led route. Keep the core challenges short; use the teacher guide for optional questions. Leave the exit prompt visible for one spoken sentence at the door.';
 return lesson;
}
