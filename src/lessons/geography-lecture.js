import {foundations} from './geography-lecture-foundations.js';
import {regions} from './geography-lecture-regions.js';
import {ice} from './geography-lecture-ice.js';
import {rivers} from './geography-lecture-rivers.js';
import {geographyOpinions} from './geography-opinions.js';
import {addSubjectContext} from './geography-subject-context.js';
export const geographyConcepts=addSubjectContext({...foundations,...regions,...ice,...rivers});
const split=text=>text.split(/(?<=[.!?])\s+/);
const note=frame=>`${frame.title}\n${frame.teacherScript||''}${frame.oralCheck?'\nBrief check: '+frame.oralCheck.question+'\nListen for: '+frame.oralCheck.answer:''}`;
function evidence(u,phase=0){return u.code==='3.1'?{atlas:{cities:true,scales:true,caption:'Use the actual outlines, seas and north arrow while explaining.'}}:u.code==='3.2'?{atlas:{physical:true,layers:true,caption:'Country boundaries and physical features are different layers.'}}:{kind:u.mission.simulationKind||u.w.kind,code:u.code,phase,caption:'Illustrative diagram. Use the named worked example or case source for exact quantities.'};}
function conceptFrame(u,card,index){
 const applied=u.missionIndex>0;
 return {title:card.title,mode:'listen',lines:card.lines,kicker:`geog.1 · section ${u.code} · ${applied?'explain and apply':'learn the idea'}`,
  geoDisplay:card.mapView?{atlas:card.mapView}:evidence(u,index%3),teacherScript:card.script,oralCheck:{question:card.question,answer:card.answer},conceptId:`${u.code}-${index}`,teachingConcept:true,
  responseHint:'Listen and follow the explanation. Answer briefly when invited.'};
}
export function rebuildGeographyLecture(lesson,active,makeStage){
 if(!lesson.geoRedesign)return lesson;
 const previous=Object.fromEntries(lesson.stages.map(s=>[s.id,s]));
 const begin=[],teach=[],investigate=[],apply=[],check=[],finish=[];
 const introduced=new Set();
 for(const [serial,u]of active.entries()){
  const cards=geographyConcepts[u.code];if(!cards)throw Error('Missing explicit Geography teaching '+u.code);
  const reference=`geog.1 · section ${u.code} · ${lesson.geographyReview?'review and reteach':u.visit===1?'investigate':'apply in a new situation'}`;
  const c=lesson.boardCaseFiles[serial];
  const first=!introduced.has(u.code);introduced.add(u.code);
  if(first){
   begin.push({title:'Today we will understand · '+u.code,mode:'listen',lines:[cards[0].lines[0],u.p.objective],kicker:reference,geoDisplay:evidence(u),
    teacherScript:`Today's key idea: ${cards[0].title}. ${u.w.teaching.join(' ')}\nStart by pointing to the named features. Say each new term, give its plain-English meaning and connect it to something visible. Invite one short answer to the check below; use it to decide which idea needs a second explanation. Pupils stay seated and do not need to copy this slide.`,oralCheck:{question:cards[0].question,answer:cards[0].answer}});
   // Review lessons revisit selected concepts; scheduled teaching covers all four.
   const selected=lesson.geographyReview?[cards[0],cards.at(-1)]:cards;
   teach.push(...selected.map(card=>conceptFrame(u,card,cards.indexOf(card))));
  }
  // Every visit keeps its own worked example and method, rather than substituting
  // a generic topic summary for applied or combined timetable rows.
  const oldModel=previous.teach.frames.find(f=>f.kicker?.includes('section '+u.code)&&f.geoDisplay?.demo);
  const model=oldModel?{...oldModel}:{title:'See the method · '+u.p.objective,geoDisplay:{...evidence(u),demo:{steps:split(u.p.model)}}};
  teach.push({...model,mode:'listen',lines:[u.p.objective,u.p.model.split(/(?<=[.!?])\s+/)[0]],kicker:reference,teachingModel:true,
   ...(u.mission.simulationKind==='journey'?{geoDisplay:{...model.geoDisplay,journey:{view:'worked'}}}:{}),
   teacherScript:`${u.p.model}\n\n${u.p.explanation}\n\nTeaching question: ${u.p.prompt}\nCorrect reasoning: ${u.p.correct}\nContrast this with: ${u.p.wrong}\nExplain which fact or step makes the second response fail. Point to the specific part of the visual rather than asking pupils to guess from the title. Use the model's own quantities; the following case supplies different information.`,
   oralCheck:{question:u.p.prompt,answer:u.p.correct+' '+u.p.explanation}});
  // Previously authored mission explanations were silently omitted by the old generator.
  for(const [i,script]of(u.mission.teaching||[]).entries())teach.push({title:['Connect the journey legs','Count travel and waiting','Check the constraints','Revise the decision'][i]||'Explain the process',mode:'listen',lines:split(script).slice(0,2),kicker:reference,
   geoDisplay:{...evidence(u),journey:{view:'teach'}},teacherScript:script,missionTeaching:true});
  teach.push({title:'Read the new case together · '+u.mission.title,mode:'listen',lines:['Listen as your teacher explains the source.','We will use these facts in the demonstration.'],sourceCard:u.mission.source,kicker:reference,
   geoDisplay:{source:u.mission.source,workpad:u.w.kind,code:u.code,title:u.mission.title},teacherScript:`CASE SOURCE\n${u.mission.source}\n\nMODEL EXPLANATION\n${u.mission.answer}\n\nMETHOD\n${u.p.model}\n\nRead the source in small sections. Link each named place, measurement or process to the diagram. Keep the source visible when referring to a number. Demonstrate the relevant operation or connection aloud before inviting an answer. The case is a teaching example; no pupil needs to produce a written response.`,
   responseHint:'Follow the source and diagram. Your teacher will show how to use them.'});
  const oldBoard=previous.investigate.frames.find(f=>f.kicker?.includes('section '+u.code)&&f.boardActivity);
  if(first&&oldBoard)investigate.push({...oldBoard,mode:'share',lines:['Watch your teacher demonstrate one move.','One volunteer can come to the board; everyone else watches.'],
   teacherScript:`Introduce the rule before making a move. ${u.p.model}\nExplain why one choice fits and why the other does not. ${u.p.explanation}\nThen invite a volunteer for one turn if useful. Take one brief response from the class and finish by restating the geographical idea. This is the one core board activity for this topic; the teacher may operate it throughout.`,responseHint:'An occasional volunteer at the board; no pair work required.'});
  if(first&&oldBoard?.simulation)investigate.at(-1).simulation={...oldBoard.simulation};
  const boardRound=(i,stage)=>{
   const q=c.questions[i];return {title:(i===1?'Watch a second example':'Now change one condition')+' · '+u.code,mode:'listen',lines:[q.prompt],type:'question',answerText:'Show the explanation',explanation:q.answer,
    geoDisplay:{source:c.source,workpad:u.w.kind,title:'Separate teaching case · '+u.code},sourceCard:c.source,boardRound:true,boardWork:true,kicker:reference,
    teacherScript:`${c.source}\n\n${q.prompt}\n${q.answer}\n\nRelated steps in this same case:\n${c.questions.filter((_,n)=>stage==='investigate'?n<3:n>=3).map(x=>x.prompt+'\n'+x.answer).join('\n\n')}\n\nWork through the explanation aloud. Before showing the answer, ask for a short response or a hand signal. Accept an ESL answer with the correct idea even if its grammar is incomplete; restate it accurately.`,
    teacherPrompt:'Explain the source and the reasoning. Invite one short answer before revealing; correct the specific mistaken step.',discussionId:`lecture-case-${u.code}-${serial}-${i}`};
  };
  // Two distinct sourced worked cases; the whole six-question sequence remains
  // in the teaching notes so the teacher has a complete explanation to draw on.
  investigate.push(boardRound(1,'investigate'));
  apply.push({title:'Teacher demonstration · '+u.mission.title,mode:'listen',lines:[u.p.objective,'Follow your teacher’s explanation of the places, facts and steps.'],sourceCard:u.mission.source,kicker:reference,
   geoDisplay:{source:u.mission.source,workpad:u.w.kind,title:u.mission.title,code:u.code},sourceModel:{kind:u.mission.simulationKind||u.w.kind,code:u.code,variant:u.missionIndex,title:u.mission.title,prompt:'Teacher demonstration using the task source.'},
   boardWork:true,boardTask:true,workspaceId:`task-${u.code}-${u.missionIndex}`,discussionId:`mission-${u.code}-${u.missionIndex}`,
   teacherScript:`${u.mission.source}\n\nDemonstrate this process on the board:\n${u.mission.task}\n\nExplain the result:\n${u.mission.answer}\n\nUse short sentences while tracing or recording each step. Ask one pupil to supply a missing label or operation if appropriate. The teacher completes and explains the whole example; pupils are not assigned independent or partner work.`,responseHint:'Watch and listen. Give a brief idea when invited.'});
  apply.push(boardRound(3,'apply'));
  const closing=u.mission.questions?.[2];
  check.push({title:'Explain the important distinction · '+u.code,mode:'share',lines:[closing?.[0]||u.p.prompt,'Give one short answer when invited.'],sourceCard:closing?u.mission.source:u.p.model,type:'question',answerText:'Compare the explanation',explanation:closing?u.mission.answer:u.p.correct+' '+u.p.explanation,kicker:reference,
   geoDisplay:evidence(u,2),teacherScript:`The key question is: ${closing?.[0]||u.p.prompt}\nThe correct idea is: ${closing?u.mission.answer:u.p.correct+' '+u.p.explanation}\nHear one or two brief answers, correct the specific misconception, and close with the accurate geographical explanation.`});
  if(first)finish.push({title:'As you leave · '+u.code,mode:'share',lines:[u.mission.exit||u.p.prompt,'Give one spoken sentence as you leave.'],discussionId:`exit-${u.code}`,geoDisplay:evidence(u,2),teacherScript:'Listen for the core meaning rather than perfect English grammar. '+(u.mission.exit?u.mission.answer:u.p.correct+' '+u.p.explanation)});
 }
 const opinionUnit=active[0];
 check.push({title:'Your view · '+opinionUnit.code,mode:'share',lines:[geographyOpinions[opinionUnit.code],'Say: “I would choose … because …”'],
  sourceCard:opinionUnit.mission.source,geoDisplay:evidence(opinionUnit,2),opinion:true,kicker:'A view about priorities · use the facts we have learned',
  teacherScript:`Context for this discussion:\n${opinionUnit.mission.source}\n\nRelevant explanation:\n${opinionUnit.mission.answer}\n\nInvite one or two brief views, then compare the priorities they name. A preference may vary, while the geographical facts and numerical constraints remain fixed. If an answer contradicts a fact, clarify the fact before accepting the preference. End by connecting the views to the topic rather than turning this into an extended debate.`});
 // Retain the real-outline UK board tools, but remove extended pair games from
 // the mandatory route. They are teacher-operated or one short volunteer turn.
 if(lesson.id==='g7b-geo-w02-1'){
  begin[0].choices=['Great Britain','The island of Ireland'];
  begin[0].lines=['Which island is Northern Ireland on?','Follow the map as your teacher explains the answer.'];
  for(const frame of teach)frame.geoDisplay={atlas:{cities:true,scales:true,compare:frame.conceptId==='3.1-1',fill:frame.teachingModel||false}};
  investigate.splice(0,investigate.length,...previous.investigate.frames.map(f=>({...f,mode:'share',lines:['Watch the country shapes move into the island groups.','One volunteer can help. Your teacher explains why the groups differ.'],teacherScript:geographyConcepts['3.1'][1].script})));
  for(const f of investigate)if(f.postcardActivity)f.postcardActivity={...f.postcardActivity,teacherLed:true};
  const delivery=previous.apply.frames.find(f=>f.postcardActivity);
  if(delivery)apply.unshift({...delivery,postcardActivity:{...delivery.postcardActivity,teacherLed:true},mode:'share',lines:['Your teacher will read and explain one postcard clue.','A volunteer points to the destination.'],teacherScript:geographyConcepts['3.1'][2].script});
  apply.splice(apply.findIndex(f=>f.boardRound),1); // This first map lesson uses actual map tools for its two demonstrations.
 }
 // Keep explicit linking instruction in the first 7A session, delivered by the teacher.
 if(lesson.id==='g7a-geo-w02-1'){
  const link=teach.find(f=>f.conceptId==='1.1-3');link.title='What does “make a link” mean?';link.lines=['A link explains how two things affect each other.','The bridge crosses the river, so people can reach the other bank.'];
  apply.push({title:'Connection builders',mode:'listen',lines:['Watch: hill + road → explain how the hill affects the route.','Watch: river + farm → explain how water can support crops.'],discussionId:'connection-builders',geoDisplay:evidence(active[0]),teacherScript:geographyConcepts['1.1'][3].script});
 }
 // The generated journey pictures now support the teacher's demonstration.
 // Preserve real maps for the foundational geography explanations.
 if(active.some(u=>u.code==='3.1'&&u.missionIndex===1)&&!lesson.geographyReview){
  for(const frame of teach)if(frame.missionTeaching||frame.title.startsWith('Read the new case'))frame.geoDisplay={...frame.geoDisplay,journey:{view:'teach'}};
  for(const frame of apply)if(frame.discussionId?.startsWith('mission-3.1'))frame.geoDisplay={...frame.geoDisplay,journey:{view:'planner'}};
  for(const frame of [...investigate,...apply])if(frame.boardRound&&frame.kicker.includes('section 3.1'))frame.geoDisplay={...frame.geoDisplay,journey:{view:'case'}};
  const exit=finish.find(f=>!f.final);exit.geoDisplay={...exit.geoDisplay,journey:{view:'exit'}};exit.lines=['A new journey costs 42 tokens; the budget is 40.','As you leave, say its pictured total time and whether the budget is enough.'];exit.teacherScript='The pictured legs total 1 + 1 + 2 + 1 = 5 hours. Its cost is 42 tokens, exceeding the 40-token budget by 2. It is not feasible within that budget even if the service runs. Accept that meaning in a short ESL response.';
 }
 finish.push({title:'Lesson complete',mode:'listen',lines:['Listen for dismissal.'],final:true});
 const timing={begin:3,teach:22,investigate:6,apply:5,check:3,finish:1};
 const titles={begin:'Introduce the topic',teach:lesson.geographyReview?'Explain and reconnect':'Teach the Geography',investigate:'Demonstrate on the board',apply:'Explain a changed example',check:'Brief class responses',finish:'Finish and dismiss'};
 let elapsed=0;
 lesson.stages=Object.entries({begin,teach,investigate,apply,check,finish}).map(([id,frames])=>{
  const s=makeStage(id,titles[id],timing[id],frames,
   '40-minute teacher-led ESL route. Students remain seated, listen and follow the visual. Short spoken answers and occasional volunteer board turns are sufficient; notebooks, printing and student devices are not required.\n\n'+frames.map(note).join('\n\n'));
  s.timeRange=`${elapsed}–${elapsed+timing[id]} min`;elapsed+=timing[id];return s;
 });
 lesson.teacherLed=true;lesson.teachingApproach='explicit-esl';lesson.contentRevision=7000;lesson.coreMinutes=40;lesson.durationMinutes=40;
 lesson.openingScript='Teacher-led Geography for ESL learners. Introduce terms in plain English, explain the topic with a visible diagram, demonstrate the worked examples and invite brief responses. One optional volunteer board turn replaces extended pair or independent tasks. '+active.map(u=>u.p.objective).join(' / ');
 lesson.pacingNote='40-minute teaching route: introduction 3, explanations 22, board demonstration 6, changed example 5, brief responses 3, dismissal 1. Timings are estimates, not measured classroom duration. Use the supplied subject explanations; do not stretch a single question to fill a stage.';
 lesson.boardTeachingGuide={title:lesson.title,minutes:40,message:lesson.pacingNote,
  routine:['Explain the idea in short sentences.','Point to the matching part of the visual.','Invite a brief answer, then explain or correct it.'],
  stages:lesson.stages.map(s=>({title:s.title,minutes:s.durationMinutes,rounds:s.frames.filter(f=>f.boardActivity||f.postcardActivity).length,notes:s.notes})),
  quickClass:'Move through the supplied explanations and contrasting examples. Extra-time games are optional after the teaching route, not a substitute for teaching.',extra:lesson.boardCaseFiles.flatMap(c=>c.questions.map(q=>({source:c.source,...q})))
 };
}
