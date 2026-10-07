import {content as foundations} from './g7-geo-content.js';
import {content as regional} from './g7b-geo-content.js';
import {geographyTeaching} from './geography-teaching.js';
import {conceptVocabulary} from './geography-concept-vocabulary.js';
import {boardCase} from './geography-board-cases.js';
import {practiceDistractors} from './geography-practice-distractors.js';

// Two transfer questions supplement each regional/process topic's retrieval bank.
// Correct answer is stored first; display order alternates independently.
const transfer={
 '3.1':[['Is Belfast on Great Britain?','No: it is on the island of Ireland.','Yes: every UK city is on Great Britain.','UK membership and island location are different.'],['Does a port symbol prove a ferry runs today?','No: check a current timetable.','Yes: the symbol guarantees a daily ferry.','Location does not establish current service availability.']],
 '3.2':[['Can a river cross a country boundary?','Yes: physical features can cross political boundaries.','No: every river stops at a boundary.','Natural features and political divisions need not coincide.'],['Do all places in a region have identical conditions?','No: shared features can coexist with local differences.','Yes: a region must be uniform in every way.','A regional pattern does not describe every place identically.']],
 '3.3':[['Does one cold morning disprove a warming climate?','No: compare long-term observations.','Yes: one morning establishes the climate.','Weather varies over short periods; climate describes long-term patterns.'],['Does a mountain create the water in relief rainfall?','No: moisture arrives in the air.','Yes: rising rock turns into rainwater.','Rising moist air cools; condensation can form cloud droplets.']],
 '3.4':[['Two communities have the same population. Must their age profiles match?','No: totals can conceal different age profiles.','Yes: equal totals mean identical communities.','Population size and population composition measure different things.'],['Can one photograph establish a community’s whole population?','No: use suitable population records.','Yes: count visible people and stop.','A photograph covers only one place and moment.']],
 '3.5':[['Homes follow one road. Which pattern fits?','Linear settlement.','Dispersed settlement.','Linear describes a line of buildings; dispersed buildings are spread apart.'],['Does a settlement photograph prove why every resident lives there?','No: ask for evidence of residents’ reasons.','Yes: appearance reveals everyone’s reason.','Visible location is evidence of pattern, not every individual motive.']],
 '3.6':[['Two districts have the same average income. Must everyone have equal income?','No: an average can hide inequality.','Yes: everyone earns the average.','Different distributions can produce the same average.'],['Is income alone enough to compare quality of life?','No: consider services, health and other conditions.','Yes: income measures every aspect of life.','Quality of life involves several dimensions.']],
 '3.7':[['Must the capital be a country’s largest city?','No: capital describes a government role.','Yes: capital always means largest.','A city’s function and population size are different characteristics.'],['Can a city serve several functions?','Yes: government, trade and education can coexist.','No: a city can have only one function.','Activities and connections can support multiple city roles.']],
 '3.8':[['Goods enter Country A from Country B. What are they for A?','Imports.','Exports.','Trade direction is defined from the country’s viewpoint.'],['Does a trade link guarantee deliveries can never be disrupted?','No: transport and supply conditions can change.','Yes: a link guarantees permanent delivery.','A connection creates a route, not a guarantee of uninterrupted supply.']],
 '4.1':[['Does a U-shaped valley prove ice still covers it?','No: a glacial landform can remain after retreat.','Yes: shaped-by-ice means currently ice-covered.','Evidence of past glaciation can survive without present ice.'],['Can one landform establish an exact date of glaciation?','No: dating needs further evidence.','Yes: shape gives the exact year.','Shape supports a process interpretation; chronology requires dating evidence.']],
 '4.2':[['Ice gains 8 units and loses 5. What happens to its balance?','It gains 3 units.','It loses 3 units.','Accumulation minus ablation is 8 − 5 = +3 in this classroom model.'],['Can glacier ice flow while its snout retreats?','Yes: loss can exceed the supply to the snout.','No: retreat means every ice particle flows uphill.','Ice movement and change in glacier extent are different.']],
 '4.3':[['Rock embedded in ice scrapes bedrock. Which process fits?','Abrasion.','Deposition.','Abrasion wears rock through scraping; deposition leaves material.'],['Ice removes loosened blocks. Which process fits?','Plucking.','Condensation.','Plucking removes blocks; condensation concerns water vapour.']],
 '4.4':[['Why can a tributary valley hang above the main valley?','The main glacier can erode its valley more deeply.','The tributary valley must have floated upward.','Unequal glacial erosion can leave valley floors at different heights.'],['A broad valley has steep sides. Is its shape alone proof of current ice?','No: inspect additional evidence and present conditions.','Yes: all such valleys currently contain glaciers.','A landform can outlast the glacier that shaped it.']],
 '4.5':[['A tarn remains in a corrie. What is the tarn?','A small lake in the hollow.','The sharp ridge between hollows.','The hollow may retain water behind its rock lip; a ridge is an arête.'],['Several corries erode a mountain from different sides. Which feature may remain?','A pyramidal peak.','A river delta.','Erosion from several sides can sharpen a peak.']],
 '4.6':[['Till includes mixed particle sizes. Has ice sorted it by size?','No: till is unsorted.','Yes: till is always arranged in equal-sized layers.','Direct glacial deposition commonly leaves mixed material.'],['An erratic differs from local bedrock. What explanation should be tested?','Ice transported it from elsewhere.','It proves all local rock changed colour.','Compare rock type and possible transport routes before concluding.']],
 '4.7':[['More visitors wear a path. What is a suitable response to investigate?','Path repair and visitor management.','Assume visitor numbers have no effects.','Management should address the observed pathway of damage.'],['Does a tourism benefit rule out environmental costs?','No: evaluate benefits and costs together.','Yes: any benefit means no costs exist.','Jobs and access can coexist with habitat pressure or erosion.']],
 '4.8':[['Does more meltwater today necessarily mean more ice remains for future summers?','No: storage may be declining.','Yes: higher melt always increases stored ice.','Water release and remaining ice storage are different quantities.'],['Inputs are 12 units and outputs 15. What happens to storage?','It falls by 3 units.','It rises by 27 units.','The simplified balance is inputs minus outputs: 12 − 15 = −3.']],
 '5.1':[['A smaller river joins a larger one. What is the joining point?','A confluence.','A watershed.','A confluence joins channels; a watershed divides drainage basins.'],['Must every river source be a glacier?','No: sources include springs and other headwaters.','Yes: every river starts in land ice.','Rivers can begin in several environments.']],
 '5.2':[['Water evaporates. Has the water ceased to exist?','No: it changes into water vapour.','Yes: it is destroyed by warmth.','Evaporation changes state and location, not the existence of water.'],['Can water be stored before returning to the sea?','Yes: in soil, lakes, groundwater or ice.','No: all rain immediately reaches the sea.','Stores and flow paths affect the timing of water movement.']],
 '5.3':[['Rain falls across a watershed ridge. Can it feed another river system?','Yes: drainage may go into the neighbouring basin.','No: a ridge sends all rain to one river.','A watershed separates surface drainage towards different systems.'],['Is discharge just the river’s speed?','No: it is volume passing a point per second.','Yes: discharge and speed are identical.','Discharge combines flow velocity with cross-sectional area.']],
 '5.4':[['A deposited grain meets stronger flow. Can it move again?','Yes: if flow can entrain it.','No: deposition permanently fixes every grain.','Deposits can be eroded and transported again.'],['Does transport require a grain to dissolve?','No: grains can roll, bounce or remain suspended.','Yes: every transported grain must dissolve.','Rivers move material in several forms.']],
 '5.5':[['Which bank builds up in a simplified meander model?','The inner bank.','The outer bank.','Deposition commonly builds the inner bank while erosion acts on the outer bank.'],['A bend is cut off from the main channel. What may form?','An oxbow lake.','A glacier corrie.','A cut-off meander can remain as a lake before later silting.']],
 '5.6':[['Demand exceeds supply. Can every requested allocation be met?','No: priorities or demand must change.','Yes: allocations create extra water.','Giving shares does not increase the total available water.'],['Should ecosystem needs be considered in water allocation?','Yes: maintaining river flows is also a water need.','No: only household demand can matter.','Allocation decisions balance several users and environmental requirements.']],
 '5.7':[['Why can the water level in an estuary change through a day?','Tides can raise and lower it.','Its water is permanently motionless.','An estuary is influenced by the sea as well as river flow.'],['Does dredging guarantee no future sediment build-up?','No: further sediment can arrive.','Yes: one dredging permanently stops deposition.','Sediment transport continues, so navigation channels may need further maintenance.']],
 '5.8':[['Same rain, less infiltration: what often increases?','Surface runoff.','The amount of rain created by the ground.','Less water entering soil can leave more flowing over the surface.'],['Does high rainfall always cause identical flood impacts?','No: capacity, storage, exposure and timing matter.','Yes: equal rain guarantees equal damage.','Flood impacts depend on pathways and on what is exposed.']],
 '5.9':[['A road closes after overflow. Is the closure a cause or impact?','An impact.','The rainfall trigger.','Road closure is a consequence of flooding.'],['Warnings are issued before overflow. What kind of action is this?','A response helping preparation.','A guarantee that water cannot overflow.','Warnings support action but do not physically remove floodwater.']],
 '5.10':[['Does an affordable flood defence automatically suit a site?','No: check the flood mechanism and local effects.','Yes: price alone proves effectiveness.','Budget feasibility and geographical suitability are separate checks.'],['Can a local wall affect flood risk elsewhere?','Yes: it may redirect water.','No: all effects end at the wall.','Defences must be considered within the wider river system.']]
};

export function createCoursePractice(lesson,units,art){
 const pools=units.map(u=>{
  const bank=foundations[u.code]||regional[u.code];
  const questions=bank[3].map((q,i)=>[q[0],q[1][0],practiceDistractors[u.code][i],q[2],bank[1]]);
  questions.push(...Object.entries(geographyTeaching).filter(([id])=>id.startsWith(u.code+'.')).map(([,p])=>[p.prompt,p.correct,p.wrong,p.explanation]));
  questions.push(...conceptVocabulary[u.code].map((v,i,words)=>[`Which definition matches “${v.term}”?`,v.meaning,words[(i+1)%words.length].meaning,`${v.term}: ${v.meaning}.`]));
  questions.push(...(transfer[u.code]||[]));
  const offset=(lesson.catalog.order+u.missionIndex)%questions.length;
  questions.push(...questions.splice(0,offset));
  return {u,questions};
 });
 const selected=[];
 // Round-robin coverage keeps combined lessons balanced across their topics.
 for(let round=0;selected.length<10;round++)for(const {u,questions}of pools){
  if(selected.length===10)break;
  if(questions[round])selected.push({u,q:questions[round]});
  if(round>20)throw new Error('Insufficient distinct practice for '+lesson.id);
 }
 return selected.map(({u,q:[title,correct,wrong,explanation,source]},i)=>{
  const correctFinger=i%2+1,answers=correctFinger===1?[correct,wrong]:[wrong,correct];
  return {title,mode:'think',type:'question',fingerPractice:true,kicker:`1 or 2 fingers · Question ${i+1} of 10 · ${u.code}`,
   choices:answers.map((text,index)=>`${index+1} ${index?'fingers':'finger'} · ${text}`),
   lines:[...(source&&/fictional|imagined|classroom|log:|source:|\d/.test(source.toLowerCase())?[source]:[]),'Think quietly. Show 1 or 2 fingers together when your teacher says “Vote”.'],responseHint:'Explain the evidence behind your choice.',
   answerText:`${correctFinger} ${correctFinger===1?'finger':'fingers'} · ${correct}`,explanation,revealLabel:'Reveal answer',allowHideAnswer:true,
   discussionId:`course-fingers-${lesson.id}-${i+1}`,sourceCard:`${title}\n1: ${answers[0]}\n2: ${answers[1]}`,
   conceptLayout:'artwork',geoArt:art(u.code==='2.4'?'2.1':u.code),
   ...(['3.1','3.2'].includes(u.code)?{conceptLayout:'evidence',geoDisplay:{atlas:{view:'islands',labels:true,cities:true}},enlargeMapButton:true}:{}),
   teacherScript:`Allow quiet thinking, then vote together. Ask for a reason before revealing. Answer: ${correctFinger} fingers. ${explanation} Use about one minute for this round.`};
 });
}

export function createCourseChecks(lesson,units,art){
 const chosen=units.length===1?[units[0],units[0]]:[units[0],units.at(-1)];
 return chosen.map((u,i)=>{
  const c=boardCase(u.code,u.missionIndex,lesson.geographyReview?1:0);
  const q=c.questions[i===0?1:5];
  return {title:q.prompt,kicker:`Explain independently · ${i+1} of 2 · ${u.code}`,mode:'think',type:'question',
   lines:[c.source,'Write or say your own answer. Support it with a detail from this source.'],sourceCard:c.source,
   responseHint:'Use a number, feature or causal link. Compare explanations after everyone has thought.',
   answerText:'One possible answer',explanation:q.answer,revealLabel:'Reveal example answer',allowHideAnswer:true,
   conceptLayout:'artwork',geoArt:art(u.code),discussionId:`course-explain-${lesson.id}-${i+1}`,
   ...(['3.1','3.2'].includes(u.code)?{conceptLayout:'evidence',geoDisplay:{atlas:{view:'islands',labels:true,cities:true}},enlargeMapButton:true}:{}),
   teacherScript:`Use the supplied fictional source as evidence; the illustration is not measured data. Allow independent responses. Listen for: ${q.answer} Accept equivalent justified wording, then reveal and improve one explanation.`};
 });
}
