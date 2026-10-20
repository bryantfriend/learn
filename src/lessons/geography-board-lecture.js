import {geographyConcepts} from './geography-lecture.js';
import {geographyTeachingStories} from './geography-teaching-stories.js';
import {courseTopicArt,missionCase} from './geography-course-upgrade.js';
import {courseMethods,courseWordExamples} from './geography-course-methods.js';
import {boardCase} from './geography-board-cases.js';
import {conceptVocabulary} from './geography-concept-vocabulary.js';
const sentences=s=>String(s).split(/(?<=[.!?])\s+/);
const text=s=>String(s).replace(/\s+/g,' ').trim();
const art=(image,alt,caption)=>({image:'geography/'+image,alt,caption,contain:true});
const newArt={
 '1.3':art('enquiry-evidence.png','Three illustrated enquiry steps: observing two queues, repeating a matched count, comparing the records.','Illustrative enquiry • use the case source for numerical counts.'),
 '3.2':art('boundary-detective.png','A boundary on low ground, mountain relief, and a river crossing a boundary.','Imaginary landscapes • a political line is not a landform.'),
 '3.7':art('town-network.png','Homes, a bridge, a clinic and a school connected by roads; a longer alternative crossing remains available.','Imaginary town • trace a journey before and after a bridge closure.'),
 '4.2':art('glacier-motion-retreat.png','Two matched views show a glacier front retreating while ice-flow arrows point downhill in both.','Schematic sequence • front position and ice movement describe different changes.')
};
const display=(source,title)=>({source,title});
export function rebuildBoardLecture(lesson,active,makeStage){
 const unique=[...new Map(active.map(u=>[u.code,u])).values()];
 const previous=Object.fromEntries(lesson.stages.map(s=>[s.id,s]));
 const route={begin:[],goal:[],vocabulary:[],teach:[],model:[],apply:[],check:[],finish:[]};
 const base=(u,f)=>({mode:'listen',geoArt:courseTopicArt(u.code),conceptLayout:'artwork',responseHint:false,recallCue:null,kicker:`Geography · ${u.code} · ${u.mission.title}`,lectureScript:true,...f});
 const visual=u=>['3.1','3.2'].includes(u.code)?{conceptLayout:'evidence',geoDisplay:{atlas:{labels:true,physical:u.code==='3.2',layers:u.code==='3.2',cities:u.code==='3.1'}},enlargeMapButton:true}:{};
 const reveal=(u,f)=>base(u,{mode:'think',type:'question',answerText:'Explain the answer',revealLabel:'Reveal explanation',allowHideAnswer:true,hideInstructionsOnReveal:true,...f});
 for(const u of unique){
  const cards=geographyConcepts[u.code],story=geographyTeachingStories[u.code];
  if(!story||!cards)throw Error('Missing board lecture content: '+u.code);
  const picture=newArt[u.code]||courseTopicArt(u.code);
  route.begin.push(base(u,{title:story.title,lines:[cards[0].question],geoArt:picture,...visual(u),teacherScript:sentences(story.explanation).slice(0,3).join(" "),storyCode:u.code}));
  route.vocabulary.push(base(u,{title:'Words we will use',lines:conceptVocabulary[u.code].map(v=>v.term+': '+v.meaning),vocabularyCards:previous.vocabulary?.frames.find(f=>f.vocabularyCards&&f.kicker?.includes(u.code))?.vocabularyCards||conceptVocabulary[u.code],teacherScript:conceptVocabulary[u.code].map((v,i)=>`${v.term} means ${v.meaning.toLowerCase()}. ${courseWordExamples[u.code][i]}`).join('\n\n')}));
  const selected=lesson.geographyReview?[cards[0],...cards.slice(-2)]:cards;
  for(const c of selected){
   const index=cards.indexOf(c),old=previous.teach?.frames.find(f=>f.conceptId===`${u.code}-${index}`);
   route.teach.push(base(u,{...old,title:c.title,lines:c.lines,mode:'listen',conceptId:`${u.code}-${index}`,teachingConcept:true,geoArt:old?.geoArt||picture,teacherScript:c.script,oralCheck:{question:c.question,answer:c.answer},...(!old?.geoDisplay?visual(u):{}),lectureScript:true}));
  }
  route.teach.push(base(u,{title:story.title,lines:[sentences(story.explanation)[0],sentences(story.connection)[0]],geoArt:picture,...(u.code==='3.1'?visual(u):{}),teacherScript:`${story.explanation}\n\n${story.connection}`,teachingStory:true}));
  // Brief checks stay oral. Their examples are concealed until the teacher chooses to reveal.
  const last=cards.at(-1);
  route.check.push(reveal(u,{title:last.question,lines:['Think about the explanation. Answer aloud when invited.'],...visual(u),sourceCard:last.lines.join(' '),explanation:last.answer,teacherScript:`${last.script}\n\nListen for this distinction: ${last.answer}`,discussionId:`lecture-oral-${u.code}`}));
  route.finish.push(base(u,{title:'What this case teaches',lines:[cards[0].lines[0],u.p.correct],geoArt:picture,...visual(u),teacherScript:`${story.connection}\n\n${last.answer}`}));
 }
 for(const [i,u] of active.entries()){
  const story=geographyTeachingStories[u.code],c=missionCase(u);
  route.goal.push(base(u,{title:u.p.objective,lines:['Follow the map, diagram and explanation.','No copying is needed. The printed sheet is optional.'],successCriteria:geographyConcepts[u.code].slice(0,3).map(c=>c.lines[0]),teacherScript:`This lesson explains how to ${courseMethods[u.code].skill}. The worked example shows the method, and the scheduled case shows how it applies to a different situation. Read the three geographical ideas aloud, then connect each one to a feature in the visual. Students can follow the demonstration without producing a written answer.`}));
  const original=previous.model?.frames.find(f=>f.teachingModel&&f.kicker?.includes(u.code));
  route.model.push(base(u,{...(original?.simulation?{simulation:original.simulation}:{}),title:'Worked example · '+u.code,mode:'listen',lines:sentences(u.p.model).slice(0,2),modelSteps:null,teachingModel:true,sourceCard:text(u.p.model),conceptLayout:'evidence',geoDisplay:original?.geoDisplay?.atlas||original?.geoDisplay?.journey?original.geoDisplay:display(text(u.p.model),'Worked example • teacher explains each step'),teacherScript:`${text(u.p.model)}\n\n${text(u.p.explanation)}\n\n${story.connection}`,discussionId:`lecture-model-${u.code}-${i}`}));
  route.model.push(base(u,{title:'Explain the contrast',lines:[u.p.prompt],sourceCard:`Response A: ${u.p.correct}\nResponse B: ${u.p.wrong}`,geoDisplay:display(`${u.p.prompt}\nResponse A: ${u.p.correct}\nResponse B: ${u.p.wrong}`,'Compare the reasoning'),conceptLayout:'evidence',teacherScript:`Response A: ${text(u.p.correct)}\n\n${text(u.p.explanation)}\n\nCompare it with response B: ${text(u.p.wrong)}. The difference matters because ${story.connection[0].toLowerCase()+story.connection.slice(1)}`,teacherContrast:true}));
  route.apply.push(base(u,{title:(u.mission.reviewFormat?u.mission.reviewFormat+' · ':'')+'Case explained · '+u.code,lines:sentences(c.answer).slice(0,2),sourceCard:c.source,conceptLayout:'evidence',geoDisplay:display(c.source,'Case evidence • read together'),teacherScript:`Here is the case we are explaining. ${c.source}\n\n${c.answer}\n\nThe geographical connection is this: ${story.connection}`,teacherDemonstration:true,caseCode:u.code,caseIndex:u.missionIndex,discussionId:`lecture-case-${u.code}-${i}`}));
  // Store the complete source and question separately for optional printing.
  route.apply.at(-1).worksheetTask={source:c.source,prompt:c.task,answer:c.answer,question:geographyConcepts[u.code][0].question,words:conceptVocabulary[u.code].map(v=>v.term+": "+v.meaning).join("; ")};
  const changed=boardCase(u.code,u.missionIndex,lesson.geographyReview?Number(lesson.id.match(/w(\d+)/)?.[1]||2):1),cq=changed.questions[3];
  route.apply.push(base(u,{title:'Change the example · '+u.code,lines:sentences(cq.answer).slice(0,2),sourceCard:changed.source,conceptLayout:'evidence',geoDisplay:display(changed.source,'A different classroom example'),teacherScript:`${changed.source}\n\nThe question is: ${cq.prompt}\n\n${cq.answer}`,teacherDemonstration:true,changedExample:true}));
  for(const script of u.mission.teaching||[])route.teach.push(base(u,{title:'Connect the journey stages',lines:sentences(script).slice(0,2),geoDisplay:{journey:{view:'teach'}},conceptLayout:'evidence',teacherScript:script,missionTeaching:true}));
 }
 // Keep actual maps and teacher-operated tools available without assigning a class activity.
 const tools=(previous.model?.frames||[]).filter(f=>f.boardActivity||f.postcardActivity);
 for(const f of tools)route.model.push({...f,mode:'listen',lines:['Follow the teacher’s demonstration on the map.'],teacherScript:`${geographyTeachingStories[active[0].code].explanation}\n\n${geographyTeachingStories[active[0].code].connection}`,responseHint:false,recallCue:null,lectureScript:true,...(f.postcardActivity?{postcardActivity:{...f.postcardActivity,teacherLed:true}}:{})});
 if(route.check.length===1){const u=active.at(-1);route.check.push(reveal(u,{title:u.p.prompt,lines:['Give a short explanation when invited.'],sourceCard:u.p.model,geoDisplay:display(u.p.model,'Use the worked example'),conceptLayout:'evidence',explanation:u.p.correct+' '+u.p.explanation,teacherScript:`${u.p.correct}\n\n${u.p.explanation}\n\n${u.p.model}`,discussionId:'lecture-case-check'}));}
 const lastUnit=active.at(-1);
 route.finish.push(base(lastUnit,{title:'Lesson complete',lines:['Listen for dismissal.'],final:true,teacherScript:`The key explanation is: ${geographyConcepts[lastUnit.code][0].lines.join(' ')} ${geographyTeachingStories[lastUnit.code].connection} The optional sheet consolidates these ideas after teaching; it is not required to follow the lesson.`}));
 const sections=[['begin','Introduce the geographical question',3],['goal','What this lesson explains',2],['vocabulary','Make the words clear',3],['teach',lesson.geographyReview?'Reconnect and explain':'Teach the Geography',17],['model','Work through the examples',7],['apply','Explain the scheduled case',4],['check','Brief spoken checks',3],['finish','What to remember',1]];
 let elapsed=0;lesson.stages=sections.map(([id,title,minutes])=>{const frames=route[id];frames.forEach(f=>{f.conceptSection=id;delete f.independentTask;delete f.taskInstructions;delete f.homework;delete f.pacingSeconds;});const s=makeStage(id,title,minutes,frames,frames.map(f=>f.title+'\n'+f.teacherScript+(f.oralCheck?'\nOptional oral check: '+f.oralCheck.question+'\nAnswer: '+f.oralCheck.answer:'')).join('\n\n'));s.timeRange=`${elapsed}–${elapsed+minutes} min`;elapsed+=minutes;return s;});
 Object.assign(lesson,{boardLecture:true,teacherLed:true,boundaryDetective:lesson.workshopMissions.some(m=>m.title==='The boundary detective'),courseModelVersion:2,teachingApproach:'board-led-lecture',contentRevision:20261021,coreMinutes:40,durationMinutes:40,learningObjectives:active.map(u=>u.p.objective),openingScript:'Teach from the board: introduce the place or process, explain the vocabulary, trace the visual and work through the examples. Full scripts are available on every screen and in the printable teaching guide. Short spoken answers are optional; students need no notebooks or devices. The matching worksheet is optional.',pacingNote:'40-minute planning estimate: introduction 3, goal 2, vocabulary 3, explanation 17, worked examples 7, case explanation 4, spoken checks 3, recap 1. Divide each block between topics in combined lessons. Adjust to the class; elapsed classroom teaching time has not been measured.'});
 lesson.boardTeachingGuide={title:lesson.title,minutes:40,message:lesson.pacingNote,routine:['Explain the subject using the map or diagram.','Read or adapt the full teaching script.','Work through the scheduled example aloud.','Use a brief spoken check if useful.'],stages:lesson.stages.map(s=>({title:s.title,minutes:s.durationMinutes,notes:s.notes}))};
 return lesson;
}
