import { supplyChainArt } from './supply-chain-visuals.js';
import {pilotArt} from './pilot-visuals.js';
import {issuePerspectiveArt} from './issue-perspective-visuals.js';
import {grade7ACourses} from './plans/grade7a.js';
import {grade7BCourses} from './plans/grade7b.js';
import {grade8GPPlan} from './plans/grade8-gp.js';
const topics=new Map();
for(const c of [...grade7ACourses,...grade7BCourses])for(const e of c.lessons)topics.set(e.id,{code:e.rows[0].code,subject:c.subjectId,group:c.classId,quarter:e.quarter,title:e.title});
for(const e of grade8GPPlan.entries)topics.set(e.id,{code:e.code,subject:'global-perspectives',group:'8',quarter:e.quarter,title:e.title});
const definitions={
 plan:['Read the plan',['Find north using the direction arrow.','Locate the school and the pond.','Describe the park relative to the road.','Choose symbols and make a key.']],
 valley:['Compare valley shapes',['Trace the narrow V-shaped section.','Trace the broad floor of the U-shaped section.','Moving ice can widen and deepen a valley.','Explain the shape using erosion.']],
 uk:['Locate the UK',['England, Scotland, Wales and Northern Ireland form the UK.','Great Britain includes England, Scotland and Wales.','Use the surrounding seas to describe location.','This is a schematic locator, not an outline map.']],
 profile:['Compare the slopes',['Read heights at equal distance intervals.','Compare the height gain along each section.','A rise of 40 m over 100 m is steeper than 20 m over 100 m.','The total rise is the last height minus the first.']],
 cycle:['Follow a drop',['Evaporation: liquid water becomes vapour.','Condensation: vapour becomes liquid droplets.','Precipitation: water falls from clouds.','Runoff and infiltration move water over and into land.']],
 glacier:['Ice shapes the landscape',['Snow builds up and becomes ice.','Moving ice carries rock fragments.','Rock and ice erode the valley.','Melting ice leaves deposited material.']],
 river:['Read the river bend',['Follow the river downstream.','The outer bank is commonly eroded.','Material is deposited on the inner bank.','Over time, a bend can migrate.']],
 flood:['Investigate runoff',['Choose a surface, then add rain.','Water can soak into permeable ground.','Paving can increase rapid surface runoff.','Compare the model; real floods have many causes.']],
 grid:['Find the location',['Read along: find the easting.','Read up: find the northing.','Use tenths for a more precise position.','Try another square and explain your method.']],
 distance:['Two routes, one destination',['Compare the direct line and travelled route.','Count every section of the route.','Apply the scale to each measured length.','Check units before comparing distances.']],
 terrain:['Read the shape of the land',['Find the lowest and highest points.','Compare rises over equal distances.','A larger rise over the same distance is steeper.','Use a profile to explain the landscape.']],
 coordinates:['Locate a point on Earth',['The Equator separates north and south.','The prime meridian separates east and west.','Latitude comes before longitude.','Use both coordinates to describe a position.']],
 place:['Build a sense of place',['Locate the places and use the key.','Describe their relative positions.','Compare physical and human features.','Explain a connection between the places.']],
 weather:['Watch the weather pattern',['Observe cloud, sun, wind and rain.','Describe weather at a particular time.','Compare observations across places.','Climate needs records over many years.']],
 settlement:['How places connect',['Notice the pattern of buildings.','Find routes and shared spaces.','Ask why people might choose these locations.','A pattern suggests questions; it does not prove a cause.']],
 city:['A city has many users',['Find homes, routes and shared services.','Consider who uses each place.','Look for needs that may conflict.','Propose a change and explain a trade-off.']],
 network:['Trace the connections',['Choose a starting point.','Follow a link to another place or group.','Explain what moves along that link.','Ask how a change could affect another part.']],
 chain:['Follow the supply chain',['Cotton is grown.','Fabric is made.','Clothes are sewn.','Shops connect the product with buyers.']],
 perspectives:['One issue, different views',['Identify the shared issue.','Ask what each person values.','Look for evidence behind each viewpoint.','Whose perspective is still missing?']],
 sources:['Investigate a source',['Who made the source?','What is its purpose?','What evidence does it provide?','What can it not tell us?']],
 data:['Make the pattern visible',['Read the labels and units.','Compare the values on the same scale.','Describe one pattern with numbers.','State a limit before making a claim.']],
 team:['Build it together',['Agree the task and hear each idea.','Share useful roles.','Bring evidence together.','Reflect and improve the shared outcome.']],
 decision:['Make a justified choice',['Read the available options.','Compare cost, benefit and access.','Explain a trade-off.','Choose what evidence to collect next.']],
 inquiry:['Turn a question into evidence',['Ask a focused question.','Choose a useful observation or source.','Record what you find.','Explain a conclusion and its limits.']]
};
const geoA={'1.1':'place','1.2':'inquiry','1.3':'inquiry','1.4':'network','1.5':'sources','1.6':'data','1.7':'distance','2.1':'place','2.2':'distance','2.3':'place','2.4':'plan','2.5':'grid','2.6':'distance','2.7':'grid','2.8':'profile','2.9':'coordinates'};
const geoB={'3.1':'uk','3.2':'uk','3.3':'weather','3.4':'perspectives','3.5':'settlement','3.6':'data','3.7':'city','3.8':'network','4.1':'glacier','4.2':'glacier','4.3':'glacier','4.4':'glacier','4.5':'terrain','4.6':'glacier','4.7':'terrain','4.8':'glacier','5.1':'river','5.2':'cycle','5.3':'data','5.4':'river','5.5':'river','5.6':'perspectives','5.7':'river','5.8':'flood','5.9':'flood','5.10':'decision'};
const gpKind=code=>/\.([456])$/.test(code)?({'4':'sources','5':'decision','6':'team'})[code.at(-1)]:code.endsWith('.3')?'data':code.endsWith('.2')?'perspectives':'network';
const budgets={"8:global-perspectives:2.6":{"total":100,"options":[["Language",40],["Housing",35],["Transport",60]]},"8:global-perspectives:3.5":{"total":90,"options":[["Insulation",80],["Lighting",30]]},"8:global-perspectives:3.6":{"total":100,"options":[["Insulation",80],["Lights",30],["Monitoring",10]]},"8:global-perspectives:6.5":{"total":100,"options":[["Shelter",40],["Crossing",90]]},"7a:global-perspectives:5.5":{"total":60,"options":[["Tap repair",40],["Posters",15],["Refill station",100]]},"7b:global-perspectives:5.5":{"total":60,"options":[["Tap repair",40],["Posters",15],["Refill station",100]]},"7b:geography:5.10":{"total":60,"options":[["Warnings",10],["Wetland",40],["Flood wall",80]]}};
const charts={...{"8:global-perspectives:1.3":{"labels":["2025","2026"],"values":[20,16],"unit":"shirt price (tokens)","note":"Factory jobs rose from 100 to 120. This does not establish a cause."},"8:global-perspectives:2.3":{"labels":["2020","2025"],"values":[10000,20000],"unit":"city population","note":"New arrivals: 1,000 then 1,500. Compare counts and population shares."},"8:global-perspectives:3.2":{"labels":["Jan","Feb","Mar","Apr"],"values":[180,160,120,150],"unit":"energy units","note":"Four months of fictional school data; explain the change in April."},"8:global-perspectives:5.4":{"labels":["Group A","Group B"],"values":[40,30],"unit":"pupils with internet","note":"A: 40 of 50. B: 30 of 60. The group sizes differ."},"8:global-perspectives:6.3":{"labels":["Before","After"],"values":[40,30],"unit":"bus journey (minutes)","note":"Car journeys changed from 25 to 28 minutes. Check both groups."},"8:global-perspectives:6.6":{"labels":["Bus users","Shopkeepers","Residents"],"values":[60,20,15],"unit":"requests","note":"Voluntary responses may overlap; do not treat these as separate shares."}},
 '7a:geography:1.6':{labels:['Near stop','Farther away'],values:[12,3],unit:'shops'},
 '7b:geography:3.6':{labels:['Town A','Town B'],values:[30,40],unit:'income tokens'},
 '7b:geography:5.3':{labels:['Upper','Middle','Lower'],values:[2,8,20],unit:'width (m)'},
 '7a:global-perspectives:3.3':{labels:['School A','School B'],values:[30,40],unit:'club pupils',note:'A: 30 of 40. B: 40 of 80. Counts and shares differ.'},
 '7b:global-perspectives:3.3':{labels:['Monday','Tuesday'],values:[18,16],unit:'pupils attending',note:'The same group of 20; reasons are not given.'},
 '7a:global-perspectives:2.5':{labels:['Print','Screen'],values:[9,6],unit:'respondents'},
 '7b:global-perspectives:2.5':{labels:['Paper','Screen'],values:[9,6],unit:'respondents'},
 '7b:global-perspectives:5.3':{labels:['Monday','Tuesday','Wednesday'],values:[12,9,6],unit:'waste (kg)',note:'100 meals were served each day.'},
 '7a:global-perspectives:4.4':{labels:['Quiet','Active','Social'],values:[4,2,2],unit:'responses'},
 '7b:global-perspectives:4.4':{labels:['Quiet','Active','Social'],values:[4,2,2],unit:'responses'}
};
export function visualSpec(lesson,stage,frame){
 if(!lesson.gp||lesson.examId||frame.type||frame.final)return null;
 if(frame.lessonVisual)return frame.lessonVisual;
 if(lesson.customVisuals)return null;
 const base=topics.get(lesson.id);if(!base)return null;
 const sourceCode=frame.title.match(/· ([1-6]\.[1-9]|R[12])$/)?.[1];
 const topic=sourceCode?{...base,code:sourceCode}:base;
 const intro=stage===lesson.stages[0]&&frame===stage.frames[0];
 const source=['sources','learn'].includes(stage.id)&&(/Examine the source|Read the short source|Source card A/.test(frame.title));
 if(!intro&&!source&&!frame.diagram)return null;
 // Keep longer source passages at full reading width; the introduction still has the graphic.
 if(!intro&&!frame.diagram&&(frame.lines||[]).join(' ').length>250)return null;
 let kind=topic.subject==='geography'?(topic.group==='7a'?geoA:geoB)[topic.code]||'inquiry':gpKind(topic.code);
 if(topic.subject==='global-perspectives'){
  if(topic.code==='1.3'||topic.code==='2.3'||topic.code==='4.1')kind='sources';
  if(topic.code==='R1')kind='inquiry';if(topic.code==='R2')kind='team';
  if(topic.group==='8'&&topic.code==='1.1')kind='chain';
 }
 const key=topic.group+':'+topic.subject+':'+topic.code;
 const chart=charts[key],budget=budgets[key];
 if(chart)kind='data';if(budget)kind='decision';
 if(kind==='data'&&!chart)kind='sources';
 if(frame.diagram)kind=({'2.4':'plan','2.5':'grid','2.8':'profile','2.9':'coordinates','g7b-uk':'uk','g7b-valley':'valley','g7b-cycle':'cycle','g7b-bend':'river'})[frame.diagram]||kind;
 return {kind,chart,budget,intro,prompt:({"distance":"Which route would you measure? Explain why the direct line and travelled route differ.","plan":"Where is the pond relative to the school? Use the north arrow to explain.","valley":"How do these valley shapes differ? Which could have been changed by moving ice?","cycle":"Where will the drop go next? Trace two different routes back to the river.","glacier":"How can moving ice change a valley? Predict what will be left when it melts.","river":"Where might this river wear away its bank? Where might sand settle?","flood":"Which surface will send more rainwater into the river? Predict, then test.","grid":"How would you describe the tree’s location? Read along before reading up.","profile":"Which section looks steepest? Explain using the height change.","terrain":"Where is the slope steepest? What evidence can you point to?","coordinates":"What do A and B share? What is different about their positions?","uk":"Which countries form the UK? How is that different from Great Britain?","place":"What do you notice about these places? Describe a position or connection.","weather":"What would you record to compare the weather in two places?","settlement":"Why might people build here? Suggest a reason and evidence you would need.","city":"Who uses this space? What might they disagree about?","network":"If one link changes, who else could be affected? Trace a possible effect.","chain":"Where has your T-shirt been before reaching you? Follow the chain.","perspectives":"Who might see this issue differently? What would you ask them?","sources":"Should we trust this source? Choose the first question you would investigate.","data":"Which difference or change stands out? Use a number to explain.","team":"How will you share the work so that everyone contributes?","decision":"Which choice would you make? Test an option and explain a trade-off.","inquiry":"What could we investigate? Turn your idea into a question we can answer."})[kind],title:definitions[kind][0],steps:definitions[kind][1],topic:topic.title};
}
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(x,y,s,size=22)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'">'+esc(s)+'</text>';
const house=(x,y,color='#e5b267')=>'<g transform="translate('+x+' '+y+')"><path d="M0 30L35 0L70 30" fill="'+color+'"/><rect y="30" width="70" height="55" rx="5" fill="#fff8e8"/><rect x="28" y="52" width="17" height="33" fill="#375e60"/><rect x="9" y="42" width="13" height="13" fill="#9bcbd5"/></g>';
const person=(x,y,c)=>'<g transform="translate('+x+' '+y+')"><circle cx="25" cy="22" r="20" fill="'+c+'"/><path d="M0 85V66Q25 40 50 66V85Z" fill="'+c+'"/><circle cx="19" cy="19" r="2" fill="#173e40"/><circle cx="32" cy="19" r="2" fill="#173e40"/><path d="M20 30Q25 34 31 29" fill="none" stroke="#173e40" stroke-width="2"/></g>';
const arrow=(x,y)=>'<path d="M'+x+' '+y+'h45m-12-10 12 10-12 10" stroke="#42797b" stroke-width="4" fill="none"/>';
function art(spec,state){
 if(spec.kind==='supply-chain')return supplyChainArt(state);
 if(spec.kind==='pilot')return pilotArt(spec,state);
 if(spec.kind==='issue-perspective')return issuePerspectiveArt(spec,state);
 const p=state.phase,k=spec.kind;
 let body='';
 if(k==='decision'&&spec.budget){
 const spent=state.selected.reduce((sum,i)=>sum+spec.budget.options[i][1],0),remaining=spec.budget.total-spent;
 body='<circle cx="107" cy="132" r="76" fill="'+(remaining<0?'#e8b6a5':'#e9c776')+'"/>'+text(60,124,'Budget',23)+text(66,167,spec.budget.total,38);
 spec.budget.options.forEach(([label,cost],i)=>{const y=25+i*69;body+='<rect x="225" y="'+y+'" width="295" height="58" rx="15" fill="'+(state.selected.includes(i)?'#a8cfc0':'#fffaf0')+'"/>'+text(240,y+37,(state.selected.includes(i)?'✓ ':'')+label+' · '+cost,22);});
 body+=text(222,264,remaining<0?'Over budget by '+(-remaining):'Remaining: '+remaining,25);
 }else if(k==='plan'){
 body='<rect x="215" y="20" width="145" height="58" rx="20" fill="#a7c590"/><rect x="35" y="108" width="153" height="85" rx="12" fill="#ecd09d"/><ellipse cx="445" cy="150" rx="85" ry="46" fill="#8ccbd9"/><path d="M0 245H560" stroke="#afbab4" stroke-width="34"/>'+text(254,56,'Park',24)+text(70,155,'School',24)+text(418,157,'Pond',24)+text(260,253,'Road',22)+text(480,35,'N ↑',25)+text(65,290,'Invented plan • not to scale',20);
 }else if(k==='valley'){
 body='<path d="M20 50L136 245L250 50M310 50L326 180Q340 245 422 245Q500 245 514 180L535 50" stroke="#8b7962" stroke-width="9" fill="none"/>'+text(65,34,'V-shaped',23)+text(367,34,'U-shaped',23)+text(61,282,'Narrow floor',21)+text(355,282,'Broad floor',21);
 }else if(k==='uk'){
 body='<path d="M0 0H560V300H0Z" fill="#dceef2"/><rect x="255" y="15" width="143" height="70" rx="30" fill="#8ab5a5"/><rect x="285" y="101" width="143" height="114" rx="30" fill="#edc081"/><rect x="173" y="134" width="102" height="76" rx="25" fill="#b9cda0"/><rect x="21" y="81" width="142" height="75" rx="25" fill="#baa7c9"/>'+text(276,57,'Scotland',22)+text(312,160,'England',22)+text(191,179,'Wales',22)+text(33,111,'Northern',21)+text(47,138,'Ireland',21)+text(425,68,'North Sea',19)+text(13,241,'Atlantic',19)+text(267,258,'English Channel',19)+text(45,289,'Schematic positions • not country shapes',18);
 }else if(k==='profile'){
 body='<path d="M55 20V247H529" stroke="#71958a" stroke-width="3" fill="none"/><path d="M65 224L210 183L355 100L500 59" stroke="#c58852" stroke-width="7" fill="none"/>'+text(31,18,'Height (m)',20)+text(38,221,'100',18)+text(187,173,'120',20)+text(332,91,'160',20)+text(478,48,'180',20)+text(53,275,'0',19)+text(192,275,'100',19)+text(337,275,'200',19)+text(482,275,'300',19)+text(197,299,'Distance (m)',19);
 }else if(k==='cycle'){
  body='<circle cx="65" cy="52" r="30" fill="#f5c95e"/><path d="M0 220Q120 185 225 226T560 215V300H0" fill="#84c6d3"/><path d="M325 226L410 115L520 215Z" fill="#93b898"/><path d="M170 60Q175 22 213 38Q242 5 272 40Q317 27 330 65Z" fill="#fff"/><path class="flow" d="M120 205Q85 100 176 76M336 79L395 159M419 190Q375 244 263 235" fill="none" stroke="#387eae" stroke-width="7" stroke-dasharray="9 12"/>'+text(60,147,'↑ Vapour',19)+text(180,100,'Cloud droplets',19)+text(350,113,'Rain ↓',19)+text(325,277,'Runoff →',19)+'<circle class="float-drop" cx="141" cy="132" r="9" fill="#287da6"/>';
 }else if(k==='glacier'){
  body='<path d="M0 220L95 80L175 160L270 42L390 172L470 73L560 225V300H0" fill="#829f9b"/><path d="M75 103L95 80L120 110L103 105L93 118Z M219 97L270 42L330 110L288 90L270 106L253 85Z" fill="#f5fcff"/><path class="ice-body" d="M245 100Q200 160 220 207Q275 267 424 239L411 273Q221 297 172 218Q155 160 210 119Z" fill="#b5e0eb" stroke="#edfaff" stroke-width="4"/><g class="ice-debris" fill="#677776"><circle cx="264" cy="232" r="8"/><circle cx="306" cy="251" r="6"/><circle cx="356" cy="251" r="10"/></g>'+text(22,37,'Snow → ice → moving glacier',23)+text(15,291,'Erosion • transport • deposition',21);
 }else if(k==='river'){
  body='<path d="M-25 171C110 172 108 68 260 70C400 71 397 233 570 218" fill="none" stroke="#abd5c0" stroke-width="108"/><path d="M-25 171C110 172 108 68 260 70C400 71 397 233 570 218" fill="none" stroke="#62b6cd" stroke-width="65"/><path class="flow" d="M-25 171C110 172 108 68 260 70C400 71 397 233 570 218" fill="none" stroke="#e4f9ff" stroke-width="4" stroke-dasharray="12 20"/><path d="M220 33Q266 29 296 48" fill="none" stroke="#cd7959" stroke-width="'+(p===1?12:6)+'"/><ellipse cx="259" cy="107" rx="32" ry="10" fill="#e8bd76"/>'+text(150,24,'Outer: erosion',21)+text(125,151,'Inner: deposition',21)+text(20,278,'Follow the current →',23);
 }else if(k==='flood'){
  const high=state.rain?(state.paved?78:35):5;
  body='<path d="M0 184H560V300H0" fill="'+(state.paved?'#a9aead':'#aad0a1')+'"/>'+house(335,106)+house(435,106)+'<rect class="water-level" x="0" y="'+(290-high)+'" width="560" height="'+high+'" fill="#65b5d0" opacity=".8"/><path class="'+(state.rain?'rain flow':'')+'" d="M70 45L55 80M120 45L105 80M170 45L155 80M220 45L205 80M270 45L255 80" stroke="'+(state.rain?'#3689b3':'#b5d4de')+'" stroke-width="6"/>'+text(20,126,state.paved?'Paved surface':'Permeable ground',24)+text(20,160,state.rain?(state.paved?'More rapid surface runoff':'More water can soak in'):'Predict before adding rain',20)+text(20,281,'Illustrative model • not a flood forecast',17);
 }else if(k==='grid'){
  for(let i=0;i<4;i++)body+='<path d="M'+(110+i*95)+' 30V240M110 '+(30+i*70)+'H395" stroke="#81b3b1" stroke-width="2"/>';
  for(let i=0;i<4;i++)body+=text(99+i*95,266,23+i,21)+text(65,247-i*70,45+i,21);
  body+='<circle cx="167" cy="226" r="10" fill="#dd9457"/><path d="M110 283H167" stroke="#d77a47" stroke-width="6"/>'+text(212,289,'Along, then up',22)+text(405,139,'Tree',21);
  if(p>1)body+=text(405,173,'2345',22);
  if(p>2)body+=text(400,207,'236452',20);
 }else if(k==='distance'){
  body='<path d="M70 224L490 64" stroke="#bd8055" stroke-width="4" stroke-dasharray="9 7"/><path class="flow" d="M70 224H245V64H490" fill="none" stroke="#3b95ac" stroke-width="8" stroke-dasharray="14 5"/><circle cx="70" cy="224" r="15" fill="#f0b168"/><circle cx="490" cy="64" r="15" fill="#5f9c7c"/>'+text(45,267,'Start',23)+text(451,38,'Finish',23)+text(272,232,'Direct line',21)+text(45,111,'Route',21)+text(198,289,'Which distance do you need?',22);
 }else if(k==='terrain'){
  body='<path d="M35 250L130 210L245 130L365 58L515 110V260H35" fill="#a5c2a0"/><path class="flow" d="M35 250L130 210L245 130L365 58L515 110" fill="none" stroke="#426d68" stroke-width="5" stroke-dasharray="10 5"/>'+text(31,282,'Distance →',22)+text(20,29,'Height ↑',22)+text(215,81,'Compare slopes',24);
 }else if(k==='coordinates'){
  body='<ellipse cx="280" cy="144" rx="170" ry="124" fill="#d4e9e6" stroke="#5b969a" stroke-width="3"/><ellipse cx="280" cy="144" rx="74" ry="124" fill="none" stroke="#7faeb0" stroke-width="2"/><path d="M110 144H450M280 20V268" stroke="#4d878f" stroke-width="3"/><circle cx="350" cy="99" r="10" fill="#df965e"/><circle cx="350" cy="189" r="10" fill="#6a87b4"/>'+text(360,92,'A',22)+text(360,213,'B',22)+text(288,165,'C: 0°, 0°',18)+text(20,142,'Equator',18)+text(297,31,'N',20)+text(460,147,'E',20)+text(80,297,'A: 20°N, 30°E • B: 20°S, 30°E',21);
 }else if(k==='weather'){
  body='<circle class="sun-spin" cx="130" cy="89" r="45" fill="#f0c15b"/><path d="M210 115Q209 73 250 71Q279 27 322 69Q375 52 403 109Z" fill="#b8d0dc"/><path class="flow" d="M240 135L215 205M290 135L265 205M340 135L315 205M390 135L365 205" stroke="#428ead" stroke-width="7" stroke-dasharray="12 8"/><path d="M30 250Q130 186 255 241T550 238V300H30" fill="#a4c3a3"/>'+text(24,33,'Weather changes',24)+text(180,285,'Observe • record • compare',22);
 }else if(k==='data'){
  const c=spec.chart,max=Math.max(...c.values);
  body=text(15,26,c.unit,23)+'<path fill="none" d="M50 40V240H540" stroke="#87a6a1" stroke-width="2"/>';
  c.values.forEach((v,i)=>{const x=85+i*(420/c.values.length),w=Math.min(94,300/c.values.length),h=v/max*170;body+='<rect class="chart-bar" x="'+x+'" y="'+(240-h)+'" width="'+w+'" height="'+h+'" rx="7" fill="'+['#4297a5','#e7ac63','#819e73'][i%3]+'"/>'+text(x+w/2-9,229-h,v,24)+text(x-8,271,c.labels[i],18);});
 }else if(['place','settlement','city'].includes(k)){
  body='<path d="M0 240Q180 155 310 229T560 221V300H0" fill="#a7c3a0"/><path d="M0 178H560M281 87V292" stroke="#cad4c7" stroke-width="26"/><path class="flow" d="M0 178H560" stroke="#fffdf3" stroke-width="3" stroke-dasharray="15 15"/>'+house(55,71)+house(156,81,'#d98265')+house(360,66,'#729cab')+house(445,208,'#cdae76')+'<circle cx="431" cy="49" r="25" fill="#6e9b77"/><rect x="427" y="61" width="8" height="40" fill="#9c7b52"/>'+text(20,36,k==='city'?'Shared spaces, different needs':k==='settlement'?'Spot the settlement pattern':'Explore the place',25)+text(18,285,'Schematic place • not a map of a real town',18);
 }else if(k==='chain'){
  const labels=['Cotton','Fabric','Clothes','Shop'];
  labels.forEach((label,i)=>{const x=15+i*140;body+='<rect x="'+x+'" y="82" width="112" height="118" rx="19" fill="'+(p===i?'#e9b879':'#d9e6da')+'"/>';if(i<3)body+=arrow(x+114,140);body+=text(x+12,232,label,22);});
  body+='<g fill="#fffdf4"><circle cx="70" cy="130" r="23"/><circle cx="48" cy="146" r="18"/><circle cx="92" cy="146" r="18"/></g><path d="M176 111H229V166H176Z" fill="#779dab"/><path d="M178 120H226M178 135H226M178 150H226" stroke="#e7f0ee" stroke-width="3"/><path d="M305 113L324 101H346L365 113L355 135L345 129V170H325V129L315 135Z" fill="#c87960"/>'+house(435,96)+'<path class="flow" d="M20 263H540" stroke="#71a6a4" stroke-width="4" stroke-dasharray="9 14"/>';
 }else if(['perspectives','team','decision'].includes(k)){
  body=person(62,144,'#d39774')+person(249,144,'#729ea8')+person(437,144,'#90a574');
  const labels=k==='team'?['Investigate','Connect','Explain']:k==='decision'?['Benefits','Costs','Who is affected?']:['Viewpoint A','Viewpoint B','Missing voice'];
  labels.forEach((label,i)=>{const x=12+i*186;body+='<rect x="'+x+'" y="49" width="164" height="70" rx="18" fill="'+(p%3===i?'#f5d594':'#fffdf3')+'" stroke="#d7e2d9"/><path d="M'+(x+65)+' 119l17 15 6-15" fill="'+(p%3===i?'#f5d594':'#fffdf3')+'"/>'+text(x+12,91,label,19);});
  body+='<path class="flow" d="M105 252H454" stroke="#79a5a7" stroke-width="4" stroke-dasharray="10 11"/>'+text(110,286,k==='team'?'One shared outcome':'Listen • compare • explain',23);
 }else if(k==='sources'||k==='inquiry'){
  body='<rect x="175" y="20" width="208" height="231" rx="17" fill="#fffdf5" stroke="#ceded5" stroke-width="3"/><path d="M203 60H350M203 87H325M203 114H350M203 141H306M203 169H345M203 195H319" stroke="#9ebdb5" stroke-width="9" stroke-linecap="round"/><circle class="lens" cx="'+(p%2?320:265)+'" cy="'+(p>1?157:106)+'" r="48" fill="#c3e7ed" fill-opacity=".65" stroke="#376b76" stroke-width="10"/><path d="M'+(p%2?355:300)+' '+(p>1?192:141)+'l54 52" stroke="#376b76" stroke-width="15" stroke-linecap="round"/>'+text(17,282,k==='sources'?'Author → purpose → evidence → limits':'Question → investigate → explain',24);
 }else{
  body='<path class="flow" d="M90 77L278 144L470 74M90 230L278 144L470 235" fill="none" stroke="#75aaac" stroke-width="6" stroke-dasharray="9 9"/>';
  [[90,77],[470,74],[90,230],[470,235],[278,144]].forEach(([x,y],i)=>{body+='<circle cx="'+x+'" cy="'+y+'" r="'+(i===4?47:31)+'" fill="'+(p===i?'#e6af64':'#c8ded5')+'"/>'+text(x-10,y+8,['A','B','C','D','?'][i],26);});
 }
 return '<svg viewBox="0 0 560 300" role="img" aria-label="'+esc(spec.description||spec.title)+'"><g font-family="system-ui,sans-serif" fill="#23474a">'+body+'</g></svg>';
}
export function createVisual(spec){
 const root=document.createElement('figure');root.className='lesson-visual';root.setAttribute('aria-label',spec.title);
 const state={phase:0,rain:false,paved:false,selected:[]};let playing=false;
 const tag=document.createElement('div');tag.className='visual-tag';tag.textContent='VISUAL INVESTIGATION';
 const canvas=document.createElement('div');canvas.className='visual-canvas';
 const caption=document.createElement('figcaption');caption.className='visual-caption';caption.setAttribute('aria-live','polite');
 const controls=document.createElement('div');controls.className='visual-controls';
 const make=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);controls.append(b);return b;};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const play=make('▶ Play',()=>{playing=!root.classList.contains('is-playing');root.classList.toggle('is-playing',playing);play.textContent=playing?'Ⅱ Stop':'▶ Play';play.setAttribute('aria-pressed',String(playing));});
 play.hidden=!['cycle','glacier','river','flood','distance','weather','network','chain','settlement','city','place'].includes(spec.kind);
 play.className='visual-play';play.setAttribute('aria-pressed','false');
 const motion=()=>{if(reduced.matches){playing=false;root.classList.remove('is-playing');play.textContent='Motion reduced';play.disabled=true;}else {play.disabled=false;play.textContent='▶ Play';}};
 motion();
 const update=()=>{canvas.innerHTML=art(spec,state);caption.textContent=(state.phase+1)+' / 4 · '+spec.steps[state.phase]+(spec.budget?' · Selected cost: '+state.selected.reduce((sum,i)=>sum+spec.budget.options[i][1],0)+' / '+spec.budget.total:'');};
 make('Next focus →',()=>{state.phase=(state.phase+1)%4;update();});
 make('↺ Reset',()=>{state.phase=0;state.rain=false;state.paved=false;state.selected=[];root.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed','false'));playing=false;root.classList.remove('is-playing');play.textContent=reduced.matches?'Motion reduced':'▶ Play';play.setAttribute('aria-pressed','false');if(surface)surface.textContent='Surface: soil';if(rain)rain.textContent='Add rain';update();});
 let surface,rain;
 if(spec.kind==='flood'){
  surface=make('Surface: soil',()=>{state.paved=!state.paved;surface.textContent='Surface: '+(state.paved?'paved':'soil');update();});
  rain=make('Add rain',()=>{state.rain=!state.rain;rain.textContent=state.rain?'Clear rain':'Add rain';update();});
 }
 if(spec.budget){root.classList.add('budget-visual');spec.budget.options.forEach(([label,cost],i)=>{const b=make(label+' · '+cost,()=>{state.selected=state.selected.includes(i)?state.selected.filter(n=>n!==i):[...state.selected,i];b.setAttribute('aria-pressed',String(state.selected.includes(i)));update();});b.dataset.choice=String(i);b.setAttribute('aria-pressed','false');});}
 root.append(tag,canvas,caption);
 if(spec.chart){const note=document.createElement('p');note.className='visual-data-note';note.textContent='Lesson dataset · '+(spec.chart.note||'Invented classroom data; use the source for context.');root.append(note);}
 const expand=make('⛶ Enlarge',()=>{
  pauseVisuals();
  const home=root.parentNode,next=root.nextSibling,dialog=document.createElement('dialog');dialog.className='visual-lightbox';
  const close=document.createElement('button');close.textContent='Close visual ×';close.className='visual-close';close.addEventListener('click',()=>dialog.close());
  const heading=document.createElement('h2');heading.textContent=spec.title;dialog.append(close,heading);document.body.append(dialog);dialog.append(root);
  dialog.addEventListener('close',()=>{pauseVisuals();if(home.isConnected)home.insertBefore(root,next);dialog.remove();expand.focus();},{once:true});dialog.showModal();close.focus();
 });
 root.append(controls);update();return root;
}
export function pauseVisuals(){
 for(const root of document.querySelectorAll('.lesson-visual.is-playing')){root.classList.remove('is-playing');const b=root.querySelector('.visual-play');b.textContent='▶ Play';b.setAttribute('aria-pressed','false');}
}
