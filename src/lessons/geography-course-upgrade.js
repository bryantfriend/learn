import {courseMethods,courseWordExamples} from './geography-course-methods.js';
import {boardCase} from './geography-board-cases.js';
const tidy=s=>String(s||'').replace(/([A-Za-z])(\d)/g,'$1 $2').replace(/(\d)([A-Za-z])/g,'$1 $2').replace(/\s+/g,' ').trim();
const sentences=s=>tidy(s).split(/(?<=[.!?])\s+(?=[A-Z“])/);
const art=(image,alt)=>({image:'geography/'+image,contain:true,alt,caption:'Imagined concept illustration · exact case information is supplied separately.'});
const pictures={
 '1.1':art('school-garden-care.png','People watering plants in school grounds; natural and human features interact.'),
 '1.2':art('geography-tool-kit.png','Map, compass and ruler: tools providing different geographical information.'),
 '1.3':art('fieldwork.png','Students observe and record a school place.'),
 '1.4':art('land-use-change.png','Matched imagined views before and after a ferry is replaced by a bridge.'),
 '1.5':art('aerial-plan.png','School and park from above, with buildings, paths and a pond.'),
 '1.6':art('urban-access.png','Imaginary neighbourhood with shops, services and transport connections.'),
 '1.7':art('urban-access.png','Paths, services and an accessible crossing in an imagined neighbourhood.'),
 '2.1':art('map-skills.png','Fictional map and geographical tools.'),
 '2.2':art('map-with-ruler.png','A ruler placed across an illustrative map.'),
 '2.3':art('school-directions.png','Students discuss a route through school grounds.'),
 '2.4':art('aerial-plan.png','A school, pond and park viewed directly from above.'),
 '2.5':art('map-skills.png','A map used to locate places; use the supplied grid values for calculations.'),
 '2.6':art('map-with-ruler.png','A ruler and map used to investigate distance.'),
 '2.7':art('map-skills.png','Illustrative mapping tools; this is not an official Ordnance Survey extract.'),
 '2.8':art('glacial-valley-profile.png','Hills, steep slopes and a broad valley floor illustrate relief.'),
 '2.9':art('map-skills.png','Mapping materials; latitude and longitude are explained in the coordinate diagram.'),
 '3.1':art('settlements.png','An imagined settlement; use the atlas for actual UK country and island locations.'),
 '3.2':art('settlements.png','Human buildings and natural relief in an imagined landscape.'),
 '3.3':art('weather-and-climate.png','One day’s weather compared with seasonal and long-term observations.'),
 '3.4':art('urban-access.png','People share a neighbourhood with different services and activities.'),
 '3.5':art('settlements.png','Buildings arranged around roads and countryside in an imagined settlement.'),
 '3.6':art('urban-access.png','Services, transport and access affecting life in a neighbourhood.'),
 '3.7':art('settlements.png','An imagined town with homes, transport and several activities.'),
 '3.8':art('port-trade-connections.png','A port connects cargo, freight trucks and passenger travel.'),
 '4.1':art('glacial-valley-profile.png','A broad glacial valley and hanging tributary valley after ice retreat.'),
 '4.2':art('glaciers.png','Mountain glacier, valley and meltwater.'),
 '4.3':art('glacier-rock-erosion.png','Basal rock debris scrapes bedrock, while ice removes a loosened block.'),
 '4.4':art('glacial-valley-profile.png','Broad main valley with steep sides and a hanging tributary valley.'),
 '4.5':art('corrie-landscape.png','Corrie hollow, narrow ridge and pointed mountain peak.'),
 '4.6':art('glacial-deposits.png','Mixed glacial debris, moraine ridges and a transported boulder.'),
 '4.7':art('corrie-landscape.png','A glacial mountain landscape where routes and conservation matter.'),
 '4.8':art('glaciers.png','Ice stores water and releases meltwater into a valley.'),
 '5.1':art('drainage-basin.png','Tributaries joining a main river between watershed ridges.'),
 '5.2':art('water-cycle.png','Water moves between atmosphere, land, underground stores and rivers.'),
 '5.3':art('drainage-basin.png','A river network within a drainage basin.'),
 '5.4':art('transportation.png','River sediment transported in different positions relative to the bed.'),
 '5.5':art('rivers.png','River bend with an eroding outer bank and deposited material on the inner bank.'),
 '5.6':art('shared-river-uses.png','Homes, farms, industry and downstream habitat share a river system.'),
 '5.7':art('river-estuary.png','A river mouth influenced by the sea, with channels, marshes and port activities.'),
 '5.8':art('flood-management.png','River, woodland, flood storage and an embankment in an imagined landscape.'),
 '5.9':art('school-path-puddle.png','Standing water on a paved path; the image does not establish the flood’s cause.'),
 '5.10':art('flood-management.png','Several flood-management measures in a connected river landscape.')
};
export const courseTopicArt=code=>pictures[code];
const wordPictures={
 Easting:'teaching-grid.svg',Northing:'teaching-grid.svg','Grid reference':'teaching-grid.svg',Contour:'teaching-contours.svg',Relief:'glacial-valley-profile.png',Gradient:'teaching-height-profile.svg',Latitude:'teaching-coordinates.svg',Longitude:'teaching-coordinates.svg',Equator:'teaching-coordinates.svg','Oxbow lake':'teaching-oxbow-sequence.svg',
 'Physical geography':'school-shaded-bench.png','Human geography':'school-directions.png',Interaction:'school-garden-care.png',Compass:'compass-directions.svg',Scale:'map-scale-example.svg',Plan:'aerial-plan.png','Aerial view':'aerial-plan.png',Map:'school-exhibit-map.svg',Landmark:'school-directions.png',Route:'urban-access.png',Industry:'port-trade-connections.png',Change:'land-use-change.png',Weather:'weather-and-climate.png',Climate:'weather-and-climate.png',Rainfall:'rain-shadow.png',Urban:'settlements.png',Rural:'aerial-plan.png',Import:'port-trade-connections.png',Export:'port-trade-connections.png',Trade:'port-trade-connections.png',Plucking:'glacier-rock-erosion.png',Abrasion:'glacier-rock-erosion.png','U-shaped valley':'glacial-valley-profile.png','Hanging valley':'glacial-valley-profile.png','Truncated spur':'glacial-valley-profile.png',Corrie:'corrie-landscape.png','Arête':'corrie-landscape.png','Pyramidal peak':'corrie-landscape.png',Till:'glacial-deposits.png',Moraine:'glacial-deposits.png',Meltwater:'glaciers.png',Storage:'glaciers.png',Tributary:'drainage-basin.png',Mouth:'river-estuary.png',Evaporation:'water-cycle.png',Condensation:'rain-shadow.png',Precipitation:'rain-shadow.png','Drainage basin':'drainage-basin.png',Watershed:'drainage-basin.png',Meander:'rivers.png',Floodplain:'flood-management.png',Supply:'shared-river-uses.png',Demand:'shared-river-uses.png',Allocation:'shared-river-uses.png',Estuary:'river-estuary.png',Navigation:'port-trade-connections.png',Dredging:'river-estuary.png',Flood:'flood-management.png',Runoff:'water-cycle.png',Infiltration:'water-cycle.png','Flood defence':'flood-management.png'
};
const sourceDisplay=(source,title)=>({source:tidy(source),title});
const base=(u,extra)=>({mode:'listen',lines:[],geoArt:pictures[u.code],conceptLayout:'artwork',kicker:u.mission.reviewFormat?`${u.mission.reviewFormat} · ${u.code}`:u.mission.title,responseHint:false,recallCue:null,...extra});
const ask=(u,title,lines,answer,script,extra={})=>base(u,{title,lines,mode:'think',type:'question',answerText:'One possible answer',explanation:tidy(answer),revealLabel:'Reveal example answer',allowHideAnswer:true,hideInstructionsOnReveal:true,teacherScript:script,...extra});
const objective=u=>`I can ${tidy(u.p.objective).replace(/^./,s=>s.toLowerCase()).replace('an investigable exhibit label','a label with a question we can test').replace(/[.]$/,'')}.`;
function missionCase(u){
 let {source,task,answer}=u.mission;
 if(u.mission.reviewFormat&&u.code==='5.10'&&u.missionIndex===1)source='Review case: two flood-management packages fit the budget. Proposed claim: choose the most expensive. No site-performance evidence is supplied. Compare flood mechanisms, maintenance, who benefits and environmental effects.';
 if(!u.mission.reviewFormat){
  if(u.code==='2.4'&&u.missionIndex===2)source='Imagined scene: school west, pond east, road south and park north. North is at the top. The school entrance is beside the southern road.';
  if(u.code==='4.4'&&u.missionIndex===0)source='Compare a narrow V-shaped river-valley cross-section with a glacial trough: a broad floor and steep sides. Draw slices across the valleys, not a river bend viewed from above.';
  if(u.code==='4.2'&&u.missionIndex===1)source='Two glacier cases: ice flows downhill in both. In case A the snout position is steady; in case B melting at the front exceeds incoming ice and the snout retreats upslope.';
  if(u.code==='3.1'&&u.missionIndex===1)task='Sketch the islands and label Wales, Northern Ireland and the Irish Sea. Calculate each journey’s time and cost; recommend one within the budget. The ferry is then cancelled: revise the plan and explain what must change.';
  if(u.code==='5.8'&&u.missionIndex===0){
   source='Classroom runoff trials: rain is 30 units in both. Trial A: infiltration 18, runoff 12. Trial B: infiltration 6, runoff 24. The model includes only these two pathways.';
   task='Record both water budgets. Compare runoff while rainfall stays the same. Explain how the change could affect flood risk and name one factor this model omits.';
   answer='Both budgets total 30 units. Runoff rises from 12 to 24 units as infiltration falls from 18 to 6. Faster surface flow may increase river response; storage, evaporation and channel capacity are omitted.';
  }
 }
 return {source:tidy(source),task:tidy(task),answer:tidy(answer)};
}
function caseQuestion(u,index,variation){
 const c=boardCase(u.code,u.missionIndex,variation);const q=c.questions[index];
 let answer=q.answer;
 if(u.code==='1.1'&&index===1)answer='The proposed human action may change shade, infiltration or habitat. Describe the effect relevant to this source; it is a prediction until observations test it.';
 return {source:tidy(c.source),prompt:tidy(q.prompt),answer:tidy(answer)};
}
export function upgradeGeographyCourse(lesson,active,frames){
 if(lesson.id==='g7a-geo-w03-1')return;
 const unique=[...new Map(active.map(u=>[u.code,u])).values()];
 const bespoke=lesson.id==='g7b-geo-w01-2';
 const previousModels=frames.model;
 for(const u of active)if(!courseMethods[u.code]||!pictures[u.code])throw Error('Missing course audit for '+u.code);
 if(!bespoke){
  frames.begin=unique.map(u=>{
   const p=courseMethods[u.code];return ask(u,p.question,[],p.answer,`Invite an explanation before revealing. ${p.answer} Connect this to today’s task: ${u.mission.title}.`,{discussionId:`course-starter-${u.code}`,...(['3.1','3.2'].includes(u.code)?{conceptLayout:'evidence',geoDisplay:{atlas:{view:'islands',labels:true,physical:u.code==='3.2'}},enlargeMapButton:true}:{})});
  });
  frames.goal=active.map(u=>{
   const p=courseMethods[u.code];return base(u,{title:objective(u),lines:[`Today’s task: ${u.mission.title}`,`You will make ${p.product}.`],successCriteria:p.criteria,teacherScript:`Show the goal and preview the actual product: ${p.product}. Explain the three criteria: ${p.criteria.join(' ')} The independent task uses this case: ${missionCase(u).source}`,...(['3.1','3.2'].includes(u.code)?{conceptLayout:'evidence',geoDisplay:{atlas:{view:'islands',labels:true,physical:u.code==='3.2'}},enlargeMapButton:true}:{})});
  });
  for(const f of frames.vocabulary){
   const u=unique.find(u=>f.kicker.includes(`· ${u.code} ·`));if(!u)continue;
   f.geoArt=pictures[u.code];f.recallCue=null;f.responseHint=false;
   f.vocabularyCards=f.vocabularyCards.map((v,i)=>({...v,example:courseWordExamples[u.code][i],image:'geography/'+(wordPictures[v.term]||pictures[u.code].image.split('/').at(-1)),imageContain:!!wordPictures[v.term]?.endsWith('.svg')}));
   f.teacherScript=f.vocabularyCards.map(v=>`${v.term}: ${v.meaning}. Example: ${v.example}`).join('\n')+'\nPoint to the relevant part of each picture. A named example supports the meaning; exact quantities belong to the supplied case. Invite one use of a word in the task context.';
   f.lines=f.vocabularyCards.map(v=>`${v.term}: ${v.meaning}. ${v.example}`);
  }
 }
 for(const f of frames.teach){
  f.recallCue=null;f.responseHint=false;
  const code=f.conceptId?.split('-')[0];if(!code)continue;
  f.geoArt=pictures[code];
  // Retain actual UK maps and the reviewed rainfall visual; retire mismatched
  // generic numerical diagrams that previously borrowed lab defaults.
  if(!f.geoDisplay?.atlas&&!f.geoDisplay?.transportConnections){f.conceptLayout='artwork';f.enlargeMapButton=false;delete f.geoDisplay;}
  if(code==='3.3'&&f.conceptId.endsWith('-3'))f.geoArt=art('rain-shadow.png','Moist air rises and cools over a mountain; rainfall is possible on the windward side.');
  if(code==='5.5'&&/waterfall|gorge/i.test(f.title))f.geoArt=art('waterfall-and-gorge.png','Waterfall with undercut ledge, plunge pool and a downstream gorge.');
  if(code==='5.5'&&/oxbow/i.test(f.title))f.geoArt=art('teaching-oxbow-sequence.svg','Meander neck narrows, a shorter channel forms, then the old bend is isolated.');
  if(code==='5.4')f.geoArt=art(f.conceptId.endsWith('-0')?'erosion.png':f.conceptId.endsWith('-3')?'deposition.png':'transportation.png','River sediment is removed, transported or deposited; explain the action shown.');
  if(code==='2.5')f.geoArt=art('teaching-grid.svg','Square 2345 with a point six tenths east and two tenths north, giving 236452.');
  if(code==='2.9')f.geoArt=art('teaching-coordinates.svg','Equator and prime meridian with a point at 20°N, 30°E.');
  if(code==='2.8')f.geoArt=art(f.conceptId.endsWith('-1')?'teaching-contours.svg':'teaching-height-profile.svg','Equal-height contour lines or a profile with distances and heights shown explicitly.');
 }
 if(!bespoke){
  frames.model=active.flatMap(u=>{
   const p=courseMethods[u.code];
   const original=previousModels.find(f=>f.teachingModel&&f.kicker?.includes(`· ${u.code} ·`)&&(f.geoDisplay?.journey||f.geoDisplay?.atlas));
   const demo=original?{...original,modelSteps:null,recallCue:null,responseHint:false}:base(u,{title:`Worked example · ${u.mission.title}`,lines:p.criteria.slice(0,2),conceptLayout:'evidence',geoDisplay:sourceDisplay(u.p.model,'Worked example evidence'),sourceCard:tidy(u.p.model),teachingModel:true,teacherScript:`Demonstrate this complete example: ${tidy(u.p.model)} Explain each operation or causal link aloud. Then give pupils the different case on the next step.`});
   const examples=/\bwhich\b/i.test(u.p.prompt)?[`Example A: ${u.p.correct}`,`Example B: ${u.p.wrong}`]:[];
   const guided=ask(u,u.p.prompt,[],`${u.p.correct} ${u.p.explanation}`,`Use the worked example’s method on this different case. Invite pupils’ reasoning before showing: ${u.p.correct} ${u.p.explanation}`,{conceptLayout:'evidence',geoDisplay:sourceDisplay([u.p.prompt,...examples].join(' '),'Try the method on a different case'),sourceCard:[u.p.prompt,...examples].join('\n'),discussionId:`guided-course-${u.code}-${u.missionIndex}`});
   return [demo,guided];
  });
  // Keep useful map challenges, postcards and controlled models optional within
  // the worked-example block, after the explicit demonstrated method.
  frames.model.push(...previousModels.filter(f=>f.boardActivity||f.postcardActivity).map(f=>({...f,recallCue:null,responseHint:false})));
 }
 frames.apply=active.map((u,i)=>{
  const c=missionCase(u);const seconds=Math.floor(420/active.length)+(i===active.length-1?420%active.length:0);
  return base(u,{title:u.mission.title,mode:'think',lines:sentences(c.task),conceptLayout:'evidence',geoDisplay:sourceDisplay(c.source,'Your investigation evidence'),sourceCard:c.source,taskInstructions:sentences(c.task),discussionId:`course-investigation-${u.code}-${u.missionIndex}`,practiceProduct:courseMethods[u.code].product,independentTask:true,pacingSeconds:seconds,teacherScript:`Pupils create ${courseMethods[u.code].product} using the displayed evidence. Task: ${c.task}\nListen for: ${c.answer}\nAllow independent work before comparing. Do not invent missing data. Accept different justified responses where the case allows them.`});
 });
 const last=active.at(-1),allSource=active.map(u=>`${u.mission.title}: ${missionCase(u).source}`).join('\n');
 frames.apply.push(base(last,{title:'Check and improve your '+(active.length===1?courseMethods[last.code].product:'investigation work'),mode:'pair',lines:[...courseMethods[last.code].criteria.slice(0,2),'Explain one correction or useful addition to your partner.'],sourceCard:allSource,discussionId:`course-revise-${lesson.id}`,revisionTask:true,pacingSeconds:120,teacherScript:`Partners compare their work with the evidence, not just each other’s answers. Check ${courseMethods[last.code].criteria.join(' ')} In combined lessons, each partner chooses a different investigation. Keep the original response and explain one revision.`}),base(last,{title:'Share a result and explain it',mode:'share',lines:[`Show one result from ${last.mission.title}.`,`Explain how the evidence supports it, using ${courseMethods[last.code].criteria[1].replace(/[.]$/,'').toLowerCase()}.`],sourceCard:allSource,discussionId:`course-share-${lesson.id}`,pacingSeconds:60,teacherScript:`Invite two short explanations, preferably different methods or conclusions. Check each against its case source. Expected reasoning for the final case: ${missionCase(last).answer}`}));
 if(!bespoke){
  const selected=unique.length===1?[unique[0],unique[0]]:[unique[0],unique.at(-1)];
  frames.check=selected.map((u,i)=>{
   const c=caseQuestion(u,i===0?1:3,lesson.geographyReview?2:1);
   return ask(u,c.prompt,[],c.answer,`Collect an independent explanation using this new source. Do not reveal until pupils have attempted it. Listen for: ${c.answer} Accept equivalent justified wording.`,{conceptLayout:'evidence',geoDisplay:sourceDisplay(c.source,'Independent check evidence'),sourceCard:c.source,discussionId:`course-independent-${u.code}-${i}`,pacingSeconds:150});
  });
  frames.finish=active.map((u,i)=>{
   const c=caseQuestion(u,2,lesson.geographyReview?3:2);const useExit=u.code==='3.1'&&u.missionIndex===1&&u.mission.exit;
   return base(u,{title:`Exit ticket · ${u.p.objective}`,mode:'think',lines:[`Independently: ${useExit?u.mission.exit:c.prompt}`],conceptLayout:'evidence',geoDisplay:sourceDisplay(useExit?u.mission.exit:c.source,'A new exit case'),sourceCard:useExit?u.mission.exit:c.source,discussionId:`course-exit-${u.code}-${u.missionIndex}`,pacingSeconds:Math.floor(150/active.length)+(i===active.length-1?150%active.length:0),teacherScript:useExit?'Collect independent answers: the journey is 5 hours and 42 tokens exceeds the 40-token budget by 2. It is not yet feasible.':`Collect an independent response without a displayed model. Listen for: ${c.answer} Use errors to choose the next recap.`});
  });
  frames.finish.push(base(last,{title:'What you can now do',lines:unique.map(u=>`I can ${courseMethods[u.code].skill}.`),final:true,pacingSeconds:30,teacherScript:'Connect today’s actual investigation work to the goals. Keep the work for later recall; identify a remaining question rather than assigning generic homework.'}));
 }else{
  frames.goal[0].lines=['The UK includes Northern Ireland.','Great Britain is an island.'];
  const rain=frames.model.find(f=>f.title.startsWith('Less moisture'));
  if(rain){rain.title='Less moisture arrives. What happens to rain?';rain.lines=['Keep the wind and mountain the same.'];rain.modelSteps=null;rain.hideInstructionsOnReveal=true;}
  for(const check of frames.check)check.hideInstructionsOnReveal=true;
  for(const f of frames.finish){delete f.homework;delete f.takeaways;}
  const cardiff=frames.finish.find(f=>f.discussionId==='exit-3.1');
  if(cardiff){cardiff.title='Exit ticket: locate Cardiff';cardiff.lines=['Independently: name Cardiff’s country and island. Explain why the names differ.'];cardiff.teacherScript='Collect independent answers: Cardiff is in Wales, on the island of Great Britain. A country and an island describe different things.';}
  const rainfall=frames.finish.find(f=>f.discussionId==='exit-3.3');
  if(rainfall){rainfall.title='Exit ticket: explain rain formation';rainfall.lines=['Independently: explain how moist air rising over a mountain can lead to rainfall.'];rainfall.teacherScript='Collect independent explanations: rising moist air cools; water vapour can condense into cloud droplets and rain may fall. The mountain does not create water.';}
 }
 for(const stage of Object.values(frames))for(const f of stage){f.recallCue=null;f.responseHint=false;}
 lesson.learningObjectives=frames.goal.map(f=>f.title);
 lesson.courseModelVersion=1;
}
