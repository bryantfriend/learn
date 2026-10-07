import {conceptVocabulary} from './geography-concept-vocabulary.js';
import {content as foundationsBank} from './g7-geo-content.js';
import {content as regionalBank} from './g7b-geo-content.js';
import {createFingerPractice} from './geography-finger-practice.js';
export const geographySections=[['begin','Starter and recall',4],['goal','Today’s learning goal',2],['vocabulary','Key vocabulary',3],['teach','Teacher explanation',8],['model','Worked example',5],['apply','Student practice',10],['check','Check understanding',5],['finish','Exit ticket and wrap-up',3]];
const split=text=>text.split(/(?<=[.!?])\s+/);
export function geographyArt(code){
 const name=code?.startsWith('4.')?'glaciers':code?.startsWith('5.')?'rivers':code?.startsWith('3.')?'settlements':code==='1.1'||code==='1.4'?'settlements':'map-skills';
 return {image:`geography/${name}.png`,alt:{glaciers:'Illustrated mountain glacier, rocky valley and meltwater stream.',rivers:'Illustrated river bend with a steep outer bank and gravel on the inner bank.',settlements:'Illustrated imaginary coastal town, countryside and transport links.','map-skills':'Illustrated map, compass, notebook and ruler.'}[name],caption:'Imagined teaching illustration • use the lesson source for exact facts.'};
}
export function rebuildGeographyConceptFlow(lesson,active,makeStage){
 const old=Object.fromEntries(lesson.stages.map(s=>[s.id,s]));
 const unique=[...new Map(active.map(u=>[u.code,u])).values()];
 const first=active[0],isB=lesson.catalog.classes.includes('7b');
 const frames={begin:[],goal:[],vocabulary:[],teach:[],model:[],apply:[],check:[],finish:[]};
 const common=(u,frame)=>({...frame,geoArt:geographyArt(u.code),kicker:`geog.1 · ${u.code} · ${u.mission.title}`});
 for(const u of unique){
  const cards=old.teach.frames.filter(f=>f.conceptId?.startsWith(u.code+'-'));
  frames.begin.push(common(u,{title:'What do you notice?',mode:'think',lines:[cards[0]?.oralCheck?.question||u.p.prompt,'Recall one idea from last time. Then share your reason.'],recallCue:'Think • Pair • Share',teacherScript:'Ask for a first attempt without revealing the answer. '+(cards[0]?.oralCheck?.answer||u.p.correct),discussionId:`concept-recall-${u.code}`}));
  frames.goal.push(common(u,{title:u.p.objective,mode:'listen',lines:['By the end, I can…'],successCriteria:[`Use the key words in section ${u.code}.`,cards[0]?.lines[0]||u.w.teaching[0],u.p.objective],teacherScript:'Share the goal, then explain what successful work will show. '+u.p.explanation}));
  const vocabulary=conceptVocabulary[u.code];
  frames.vocabulary.push(common(u,{title:'Words for today',mode:'listen',lines:vocabulary.map(v=>`${v.term}: ${v.meaning}`),vocabularyCards:vocabulary,recallCue:'Say it • Point to it • Use it',teacherScript:vocabulary.map(v=>`${v.term}: ${v.meaning}`).join('\n')+'\nModel pronunciation and point to a matching feature. Ask for an oral example before writing.'}));
  frames.teach.push(...cards.map(f=>common(u,{...f,conceptLayout:'explanation'})));
  const oldExit=old.finish.frames.find(f=>f.discussionId===`exit-${u.code}`);
  frames.finish.push(common(u,{title:'One last question',mode:'think',lines:[u.mission.exit||u.p.prompt,'Write or say one sentence independently.'],takeaways:cards.slice(0,2).map(f=>f.lines[0]),homework:'Sketch or write one example of today’s idea. Label it with two key words.',teacherScript:oldExit?.teacherScript||('Collect an independent response before displaying a model. Listen for: '+u.p.correct+' '+u.p.explanation),discussionId:`exit-${u.code}`}));
 }
 for(const u of active){
  if(!unique.includes(u)){
   const cards=old.teach.frames.filter(f=>f.conceptId?.startsWith(u.code+'-'));
   frames.goal.push(common(u,{title:u.p.objective,mode:'listen',lines:['By the end, I can…'],successCriteria:[`Use the key words in section ${u.code}.`,cards[0]?.lines[0]||u.w.teaching[0],u.p.objective],teacherScript:'Share the goal for this second mission. '+u.p.explanation}));
   frames.finish.push(common(u,{title:'One last question',mode:'think',lines:[u.mission.exit||u.p.prompt,'Write or say one sentence independently.'],takeaways:[u.p.objective],teacherScript:'Listen for: '+u.p.correct+' '+u.p.explanation,discussionId:`exit-${u.code}-${u.missionIndex}`}));
  }
  const model=old.teach.frames.find(f=>f.teachingModel&&f.lines?.includes(u.p.objective));
  frames.model.push(common(u,{...model,title:'See the method · '+u.p.objective,mode:'listen',lines:split(u.p.model).slice(0,2),modelSteps:['Find the relevant feature or fact.','Apply the method or process.','Explain and check the result.'],teacherScript:(model?.teacherScript||u.p.model)+'\nThen ask the class to explain one step in their own words.'}));
  const sourceFrame=old.apply.frames.find(f=>f.discussionId===`mission-${u.code}-${u.missionIndex}`);
  frames.apply.push(common(u,{...sourceFrame,title:u.mission.title+' · your task',mode:isB?'pair':'think',lines:split(u.mission.task),taskInstructions:split(u.mission.task),sourceCard:u.mission.source,boardWork:true,boardTask:false,geoDisplay:sourceFrame?.geoDisplay||model?.geoDisplay,
   supportText:isB?'Say it first: “I notice ___. This happens because ___.”':'Use a feature, a number or a step as evidence for your explanation.',challengeText:'Change one condition. Explain how it affects your answer.',teacherScript:`TASK SOURCE\n${u.mission.source}\n\nTASK\n${u.mission.task}\n\nMODEL ANSWER\n${u.mission.answer}\n\n${isB?'Rehearse orally, complete one part together, then ask for an individual response.':'Allow independent work before comparing methods.'} Use the source for exact quantities.`,discussionId:`mission-${u.code}-${u.missionIndex}`,workSeconds:4}));
 }
 frames.teach.push(...old.teach.frames.filter(f=>f.missionTeaching).map(f=>({...f,geoArt:geographyArt(first.code)})));
 // Keep interactive map tools available in the worked-example section.
 for(const f of old.investigate.frames.filter(f=>f.boardActivity||f.postcardActivity))frames.model.push({...f,geoArt:geographyArt(first.code)});
 for(const f of old.apply.frames.filter(f=>f.postcardActivity))frames.model.push({...f,geoArt:geographyArt(first.code)});
 // Preserve source-linked checks, and conceal models until the teacher reveals them.
 for(const u of unique){
  const bank=(foundationsBank[u.code]||regionalBank[u.code]);const q=bank[3][u.missionIndex%bank[3].length];
  const offset=(lesson.catalog.order+u.missionIndex)%4;const answers=[...q[1]];answers.push(...answers.splice(0,offset));
  frames.check.push(common(u,{title:q[0],mode:'think',lines:['Choose an answer. Explain your reason.'],type:'question',options:answers.map((label,i)=>({id:String.fromCharCode(65+i),label})),answer:String.fromCharCode(65+answers.indexOf(q[1][0])),explanation:q[2],geoDisplay:frames.teach.find(f=>f.conceptId?.startsWith(u.code+'-'))?.geoDisplay,sourceCard:bank[1],teacherScript:'Ask for a reason before revealing. '+q[2],discussionId:`concept-check-${u.code}`}));
 }
 frames.check.push(...old.check.frames.map(f=>({...f,geoArt:geographyArt(f.kicker?.match(/section (\d+\.\d+)/)?.[1]||first.code),responseHint:'Choose or explain your answer. Use evidence before revealing.'})));
 frames.check.push(...[...old.investigate.frames,...old.apply.frames].filter(f=>f.boardRound).map(f=>({...f,geoArt:geographyArt(first.code)})));
 if(lesson.id==='g7a-geo-w02-1'){
  const link=frames.teach.find(f=>f.conceptId==='1.1-3');if(link)link.title='What does “make a link” mean?';
  frames.apply.push(common(first,{title:'Connection builders',mode:'think',lines:['Choose hill + road or river + farm.','Explain the link using “because” or “so”.'],sourceCard:first.mission.source,geoDisplay:frames.teach[0].geoDisplay,discussionId:'connection-builders',teacherScript:'A hill can affect road gradient and route; a river can provide water for crops. A list of two labels does not explain the link.'}));
 }
 // Review this lesson section by section before extending its design to the course.
 if(lesson.id==='g7b-geo-w01-2'){
  frames.apply=createFingerPractice();
  frames.check=[{
   title:'Explain Cardiff’s location',kicker:'Explain in your own words · 1 of 2',mode:'think',type:'question',
   lines:['Find Cardiff. Name its country and its island.','Explain why the country name and island name are different.'],
   responseHint:'Think on your own. Give a short explanation using the map.',
   geoDisplay:{atlas:{view:'islands',labels:true,cities:true,caption:'Use Cardiff’s city marker, the country boundaries and the coastline.'}},
   conceptLayout:'evidence',enlargeMapButton:true,geoArt:geographyArt('3.1'),
   answerText:'One possible explanation',revealLabel:'Reveal example answer',allowHideAnswer:true,
   explanation:'Cardiff is in Wales, on the island of Great Britain. Wales is a country; Great Britain is an island containing Wales, England and Scotland.',
   discussionId:'lesson-2-explain-cardiff',
   teacherScript:'Allow independent thinking without choices or finger voting. Ask two pupils to explain where Cardiff is and why the two place names describe different things. Listen for Wales as the country and Great Britain as the island. Ask pupils to point to the boundary and trace the coastline as evidence. Reveal the example only after their explanations. Accept equivalent wording; help pupils distinguish country boundaries from the sea around an island.'
  },{
   title:'Explain how the mountain helps rain form',kicker:'Explain in your own words · 2 of 2',mode:'think',type:'question',
   lines:['Follow the moist air from the sea up the mountain.','Explain the chain: rises → cools → condenses → rain can fall.'],
   responseHint:'Use “because” or “so” to link the steps. Explain what happens to the water vapour.',
   conceptLayout:'artwork',
   geoArt:{image:'geography/rain-shadow.png',contain:true,alt:'Moist air rises and cools on the windward slope, forming clouds and rain; air descends on the leeward slope.',caption:'Use the arrows as evidence for your explanation.'},
   answerText:'One possible explanation',revealLabel:'Reveal example answer',allowHideAnswer:true,
   explanation:'The mountain forces moist air to rise. As the air rises, it cools, so water vapour can condense into cloud droplets. When droplets grow large enough, rain can fall. The water comes from moisture in the air; the mountain does not create it.',
   discussionId:'lesson-2-explain-rainfall',
   teacherScript:'Ask pupils to explain the process in their own words rather than vote on choices. The arrow chain is a scaffold, not a complete answer: listen for causal links between rising, cooling, condensation and precipitation. Ask where the water came from. Invite two explanations before revealing the example. Correct the idea that the mountain creates water. Rain is possible under suitable conditions, not guaranteed whenever air rises.'
  }];
  const ukModel=frames.model.find(f=>f.teachingModel&&f.kicker.includes('3.1'));
  if(ukModel){
   Object.assign(ukModel,{
    title:'Belfast is in the UK. Is it also on Great Britain?',
    lines:['Look at the map. Think quietly, then explain your answer.'],
    modelSteps:null,enlargeMapButton:true,allowHideAnswer:true,
    type:'question',answerText:'No.',revealLabel:'Reveal answer',
    explanation:'Belfast is in the UK, but it is on the island of Ireland. It is not on Great Britain.',
    conceptLayout:'evidence',responseHint:'Point to Belfast and follow the coastline before revealing.',
    geoDisplay:{atlas:{view:'islands',cities:true,labels:true,caption:'Find Belfast. Which island contains it?'}},
    teacherScript:'Read the question without revealing the answer. Model finding Belfast in Northern Ireland, tracing the coastline of the island of Ireland, then comparing it with Great Britain. Invite pupils to answer with a reason from the map. Reveal: Belfast is in the UK, but on the island of Ireland, not Great Britain. Country membership and island location answer different questions.',
    oralCheck:{question:'Why can Belfast be in the UK without being on Great Britain?',answer:'The UK includes Northern Ireland, which is on the island of Ireland.'}
   });
  }
  const rainModel=frames.model.find(f=>f.teachingModel&&f.kicker.includes('3.3'));
  if(rainModel){
   Object.assign(rainModel,{
    title:'Less moisture reaches the mountain. What happens to the rainfall?',
    lines:['Keep the same wind and mountain. Change only the incoming air: it now contains less moisture.'],
    modelSteps:['Trace the incoming air up the windward slope.','The rising air still cools, but carries less moisture.','Predict how this changes the amount of rain.'],
    type:'question',answerText:'We expect less rain.',revealLabel:'Reveal prediction',
    explanation:'With less moisture available, we expect less rainfall if the other conditions stay the same. The mountain lifts the air; it does not create water.',
    conceptLayout:'artwork',
    geoArt:{image:'geography/rain-shadow.png',contain:true,alt:'Moist air rises and cools on the windward slope of a mountain. Air descends on the leeward slope.',caption:'Use the Stage 4 diagram to test one change: less moisture in the incoming air.'},
    responseHint:'Use the diagram from the previous stage to explain your prediction.',
    teacherScript:'Briefly recall the Stage 4 diagram rather than repeating the full explanation. Keep wind direction, mountain and other conditions the same; reduce only the incoming moisture. Trace the rising air and explain that it still cools, but there is less moisture available for precipitation. Ask for a prediction before revealing. Expect less rainfall, not a guarantee of no rain. A mountain does not create the missing water.',
    oralCheck:{question:'Does the mountain create water when the incoming air has less moisture?',answer:'No. Less moisture is available, so we expect less rainfall with other conditions unchanged.'}
   });
  }
  const transport=frames.teach.find(f=>f.conceptId==='3.1-3');
  if(transport)transport.geoDisplay={transportConnections:true};
  const weather=frames.teach.find(f=>f.conceptId==='3.3-0');
  if(weather){weather.conceptLayout='artwork';weather.geoArt={image:'geography/weather-and-climate.png',contain:true,alt:'Weather: a rainy, windy day at a coastal cottage. Climate: seasonal views of the same place and calendars showing observations across years.',caption:'Illustrative comparison: one day’s weather versus patterns over many years.'};}
  const rainShadow=frames.teach.find(f=>f.conceptId==='3.3-3');
  if(rainShadow){rainShadow.conceptLayout='artwork';rainShadow.geoArt={image:'geography/rain-shadow.png',contain:true,alt:'Moist air from the sea rises and cools on the windward slope, bringing clouds and rain. Air descends and warms on the leeward slope, where conditions are often drier.',caption:'Concept illustration: wind blows left to right. The leeward side can still receive rain.'};}
  frames.begin=[{
   title:'Look at the map',mode:'think',
   lines:['Does every country boundary have sea on both sides?'],
   type:'question',answerText:'No.',revealLabel:'Reveal answer',
   explanation:'England and Wales share a land boundary, with no sea between them.',
   responseHint:'Look for evidence on the map.',discussionMode:'think',
   revealAtlasBorder:true,
   recallCue:'Think quietly',kicker:'UK and Ireland · Country boundaries',
   conceptLayout:'evidence',
   geoDisplay:{atlas:{view:'islands',labels:true,caption:'UK and Ireland · Countries and surrounding seas'}},
   geoArt:geographyArt('3.1'),discussionId:'lesson-2-map-starter',
   teacherScript:'Give pupils quiet thinking time. Ask them to find a boundary between two countries on the map. England and Wales, or England and Scotland, share a land boundary: there is no sea between them. Invite a short answer after pupils have thought.'
  }];
  frames.goal=[{
   title:'I can explain the difference between the UK and Great Britain.',mode:'listen',
   lines:['The UK includes England, Scotland, Wales and Northern Ireland.','Great Britain is the island containing England, Scotland and Wales.','Northern Ireland is part of the UK, on the island of Ireland.'],
   successCriteria:['Name the four countries of the UK.','Identify the three countries on Great Britain.','Show a shared land boundary.'],
   conceptLayout:'evidence',kicker:'Our learning goal · UK and Great Britain',
   geoDisplay:{atlas:{membershipAnimation:true}},geoArt:geographyArt('3.1'),
   teacherScript:'Read the learning goal. Play the short map explanation: four countries belong to the UK; three are on Great Britain; Northern Ireland belongs to the UK but is on the island of Ireland. Pause or replay as needed. Point to England and Wales to connect the goal to the starter. The UK is a country made up of four constituent countries; Great Britain names an island.'
  }];
  const vocabulary=[
   {term:'United Kingdom',meaning:'England, Scotland, Wales and Northern Ireland.',zh:'英国（联合王国）',ru:'Соединённое Королевство',picture:'uk'},
   {term:'Great Britain',meaning:'The island containing England, Scotland and Wales.',zh:'大不列颠',ru:'Великобритания',picture:'gb'},
   {term:'Island',meaning:'Land surrounded by water on every side.',zh:'岛屿',ru:'Остров',picture:'island'}
  ];
  frames.vocabulary=[{title:'Words for today',mode:'listen',lines:vocabulary.map(v=>`${v.term}: ${v.meaning}`),vocabularyCards:vocabulary,geoArt:geographyArt('3.1'),recallCue:'Listen • Say the word • Look at the picture',teacherScript:'Read each English word and model its pronunciation. Use the smaller Chinese and Russian translations as support. Compare the two highlighted maps: Northern Ireland is included in the UK, but not in Great Britain. The island picture shows water all the way around the land.'}];
 }
 frames.finish.push({title:'Lesson complete',mode:'listen',lines:['Check your space. Listen for dismissal.'],geoArt:geographyArt(first.code),final:true});
 if(lesson.id==='g7b-geo-w01-2'){
  for(const frame of frames.finish){
   if(frame.discussionId==='exit-3.3'){
    frame.conceptLayout='artwork';
    frame.geoArt={image:'geography/rain-shadow.png',contain:true,alt:'Moist air rises and cools over a mountain, with rain on the windward slope and often drier conditions on the leeward side.',caption:'Use the mountain and wind arrows to support your final explanation.'};
   }else{
    frame.conceptLayout='evidence';frame.enlargeMapButton=true;
    frame.geoDisplay={atlas:{view:'islands',labels:true,cities:true,caption:frame.final?'UK and Ireland · Today’s map learning':'Use the country boundaries and coastlines to support your final sentence.'}};
   }
  }
 }
 let elapsed=0;
 lesson.stages=geographySections.map(([id,title,minutes])=>{
  const notes=frames[id].map(f=>`${f.title}\n${f.teacherScript||''}${f.oralCheck?'\nCheck: '+f.oralCheck.question+'\nAnswer: '+f.oralCheck.answer:''}`).join('\n\n');
  const stage=makeStage(id,title,minutes,frames[id],notes||'Use this section to check progress towards the lesson goal.');stage.timeRange=`${elapsed}–${elapsed+minutes} min`;elapsed+=minutes;
  stage.frames.forEach(f=>f.conceptSection=id);return stage;
 });
 lesson.geoConcept=true;lesson.teacherLed=true;lesson.teachingApproach='guided-to-independent';lesson.contentRevision=lesson.id==='g7b-geo-w01-2'?8005:8000;lesson.boardFirst=false;
 lesson.openingScript='40-minute Geography: recall, goal, vocabulary, explanation, worked example, student practice, understanding check and exit ticket. Bring an exercise book, pencil and ruler where needed. '+lesson.learningObjectives.join(' / ');
 lesson.pacingNote='40-minute route: recall 4, goal 2, vocabulary 3, explanation 8, worked example 5, practice 10, check 5, exit 3. Divide each section between the topics in combined lessons. Timings are estimates.';
 lesson.boardTeachingGuide={...lesson.boardTeachingGuide,message:lesson.pacingNote,routine:['Explain and point to the visual.','Model a worked example.','Let pupils practise, then check and improve.'],stages:lesson.stages.map(s=>({title:s.title,minutes:s.durationMinutes,notes:s.notes}))};
 return lesson;
}
export function styleGeographyAssessment(lesson){
 if(lesson.catalog?.subjectId!=='geography'||!lesson.examId)return lesson;
 lesson.geoConcept=true;
 for(const stage of lesson.stages)for(const f of stage.frames){f.geoArt=geographyArt(lesson.catalog.classes.includes('7b')?'3.1':'2.1');f.conceptSection='assessment';}
 return lesson;
}
