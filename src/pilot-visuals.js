const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=(x,y,s,n=22)=>'<text x="'+x+'" y="'+y+'" font-size="'+n+'">'+esc(s)+'</text>';
const rect=(x,y,w,h,c='#fffdf2')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="12" fill="'+c+'" stroke="#93afa8" stroke-width="2"/>';
const line=(d,c='#56858a',w=4)=>'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round"/>';
const house=(x,y)=>'<g transform="translate('+x+' '+y+')"><path d="M0 15L20 0L40 15V45H0Z" fill="#e2b882" stroke="#8c6b48" stroke-width="2"/><rect x="15" y="27" width="10" height="18" fill="#fff7e8"/></g>';
const arrow=(x,y)=>line('M'+x+' '+y+'h42m-10-8 10 8-10 8');
export function pilotArt(spec,state){
 const p=state.phase,k=spec.scene;let b='',desc='';
 if(k==='settlement'){
  desc='Fictional sketch: a river runs down the middle, crossed by a bridge. Six houses cluster near the bridge and two are farther away.';
  b='<path d="M268 8Q230 70 278 128T274 280" fill="none" stroke="#81c1d2" stroke-width="38"/>'+line('M30 158H530','#c7b590',14)+'<rect x="240" y="139" width="63" height="37" fill="#e4d1aa" stroke="#8b7857" stroke-width="3"/>';
  for(const [x,y]of [[165,87],[204,188],[315,98],[327,192],[130,176],[363,134],[27,29],[478,29]])b+=house(x,y);
  b+=t(220,125,'Bridge',19)+t(24,284,'What is shown? What might explain it?',24);
 }else if(k==='shops'){
  desc='Twelve shops are recorded within 200 metres of a bus stop and three farther away. No customer interviews were made.';
  b=t(25,35,'Recorded shop locations',27)+rect(25,55,295,163,'#e5efd5')+rect(339,55,196,163,'#f6dfbe');
  for(let i=0;i<12;i++)b+=house(42+(i%6)*43,72+Math.floor(i/6)*66);
  for(let i=0;i<3;i++)b+=house(355+i*55,119);
  b+=t(54,248,'Within 200 m: 12',24)+t(349,248,'Farther: 3',24)+t(45,284,'Pattern ≠ proven cause',24);
 }else if(k==='map'){
  desc='North is up. A school west, pond east, park north and road south connect by paths through a central junction. Key: square school, oval pond, tree park, line path.';
  b='<path d="M30 230H530" stroke="#afb7b2" stroke-width="22"/>'+line('M95 160H444M277 68V230','#be9566',9);
  b+=rect(32,109,125,66,'#edd2a1')+t(49,148,'School',24)+'<ellipse cx="450" cy="141" rx="77" ry="41" fill="#96cbd8" stroke="#5d929f" stroke-width="2"/>'+t(418,149,'Pond',24)+rect(205,10,143,69,'#b3d3a3')+t(245,53,'Park',24)+t(462,36,'N ↑',26)+t(255,238,'Road',19);
  b+=t(17,280,'Key: □ school · oval pond · green park',18)+t(111,304,'Brown line = path',19);
 }else if(k==='headline'){
  desc='A fictional news headline claims quiet breaks make pupils ready to learn. The source is not yet shown.';
  b=rect(24,24,512,253,'#fff9e9')+t(52,66,'THE SCHOOL NEWS',24)+line('M50 84H510')+t(51,131,'QUIET BREAKS',34)+t(51,176,'MAKE PUPILS READY',29)+t(51,217,'TO LEARN',34)+t(55,260,'Supported—or too strong?',24);
 }else if(k==='study'){
  desc='Ten volunteer responses: eight report readiness, two do not report readiness. This represents 8 of 10 respondents, not the whole school.';
  b=t(35,32,'Ten quiet-break volunteers',26);
  for(let i=0;i<10;i++){const x=69+(i%5)*106,y=87+Math.floor(i/5)*76;b+='<circle cx="'+x+'" cy="'+y+'" r="26" fill="'+(i<8?'#73a997':'#e4bc8e')+'"/>'+t(x-7,y+8,i<8?'✓':'–',24);}
  b+=t(35,229,'8 report ready · 2 do not',26)+t(35,273,'What was measured? Who answered?',23);
 }else if(k==='settings'){
  desc='Mira needs a live science demonstration but has no safe equipment at home. Dani needs to edit a story, with books at home and feedback at school.';
  b=rect(18,15,255,263,'#dfede8')+rect(287,15,255,263,'#f5e4c5')+t(39,51,'MIRA · science',25)+t(308,51,'DANI · writing',25);
  b+='<path d="M110 76V103L88 153Q82 169 106 170H145Q164 169 154 151L131 103V76Z" fill="#92cbd1" stroke="#427980" stroke-width="3"/>'+line('M105 77H137');
  b+=rect(362,77,99,92,'#fffdf6')+line('M375 99H445M375 119H441M375 139H423','#ac9c7b',4);
  b+=t(38,202,'Needs equipment',22)+t(38,235,'and a demonstration',21)+t(306,202,'Needs quiet time',22)+t(306,235,'and useful feedback',21)+t(115,304,'Same criteria · different needs',23);
 }else if(k==='survey'){
  desc=spec.repeat?'A draft asks about games and messages together and has answer options one to two, three to four, five or more, with zero missing.':'A draft asks Do you agree games waste homework time, pushing the respondent toward a preferred answer.';
  b=rect(28,12,504,272,'#fffaf0')+t(52,48,'DRAFT SURVEY',25)+t(52,99,spec.repeat?'Games AND messages…':'“Don’t you agree…?”',27)+t(52,143,spec.repeat?'Two things in one question?':'Does this invite disagreement?',22);
  for(let i=0;i<3;i++)b+=rect(57+i*151,184,137,53,['#ddebe4','#eddec0','#d7e7ea'][i])+t(73+i*151,218,spec.repeat?['1–2','3–4','5+'][i]:['Yes','No','Skip'][i],24);
  b+=t(54,268,spec.repeat?'Where can “zero” go?':'Words can steer an answer.',23);
 }else if(k.startsWith('drop-')){
  desc='Water model with a hillside, soil, a river, cloud and sun. '+(k==='drop-land'?'A raindrop has reached the surface; learners predict its route.':k==='drop-paved'?'Paving covers the ground; learners predict a changed route.':k==='drop-branches'?'Arrows show possible runoff to the river and infiltration into soil.':'Unlabelled arrows show movement between river, air, clouds and land.');
  b='<rect x="0" y="0" width="560" height="310" fill="#e6f2f5"/><circle cx="62" cy="48" r="28" fill="#e6bd60"/><path d="M279 51Q291 11 333 30Q372 6 397 41Q438 27 447 63H279Z" fill="#fff" stroke="#a5c0c6" stroke-width="2"/><path d="M0 155L155 117L365 240L560 228V310H0Z" fill="#adc6a0"/><path d="M0 198L160 158L357 270H560V310H0Z" fill="#ccba97"/><path d="M338 253Q424 223 560 249V310H338Z" fill="#80c2d5"/>';
  b+='<path d="M157 105Q135 130 157 138Q179 130 157 105Z" fill="#297cb0"/>'+t(20,279,'Soil',24)+t(425,285,'River',24);
  if(k==='drop-branches')b+=line('M170 149L319 236m-21-3 21 3-9-18','#3e7b9c',6)+line('M151 151V228m-9-13 9 13 9-13','#8b624b',6)+t(176,189,'Runoff',21)+t(59,252,'Infiltration',20);
  if(k==='drop-paved')b+=line('M8 158L155 124L353 241','#7e8a8f',17)+t(253,170,'Paved ground',23);
  if(k==='drop-cycle')b+=line('M459 230Q510 153 434 91m5 19-5-19 20 7','#3e7b9c',6)+line('M279 80L175 105m20 5-20-5 10-15','#3e7b9c',6)+t(302,157,'Name the arrows',21);
 }else if(k==='network'){
  desc='A farm in Country A connects across a border to a market in Country B along a 20-minute bridge road or a 50-minute hill road. Market supplies a school kitchen needing goods within 40 minutes. A separate message reports delivery time.'+(spec.blocked?' The bridge road is closed.':'');
  b=rect(16,93,133,85,'#e6edcb')+t(50,145,'Farm',27)+rect(386,93,155,85,'#f3dcbb')+t(418,145,'Market',27)+line('M151 137H382','#a78b68',8)+line('M150 108L218 47H326L385 108','#789b7f',6);
  b+='<path d="M280 47V218" stroke="#a99cba" stroke-width="2" stroke-dasharray="5 6"/>'+t(24,78,'Country A',20)+t(400,78,'Country B',20);
  b+=t(195,28,'Hill: 50 min',23)+t(179,177,'Bridge: 20 min',22)+t(169,210,'Message → arrival time',20);
  b+=line('M460 179V237m-8-10 8 10 8-10')+rect(327,238,215,59,'#dae9e9')+t(340,262,'School kitchen',21)+t(346,286,'Deadline: 40 min',18);
  if(spec.blocked)b+=line('M248 115L292 155M292 115L248 155','#b35c45',9)+t(19,273,'CLOSED',23);
 }else if(k==='square'){
  desc='An empty 6-column by 4-row planning grid, with west and east gates. Students allocate a connected route, stalls and play space.'+(spec.storage?' Four north-edge cells are reserved for storage until noon.':'');
  b=t(85,27,'NORTH EDGE',21);
  for(let r=0;r<4;r++)for(let c=0;c<6;c++)b+='<rect x="'+(80+c*68)+'" y="'+(42+r*56)+'" width="68" height="56" fill="'+(spec.storage&&r===0&&c<4?'#e4bb83':'#edf0df')+'" stroke="#89a6a0" stroke-width="2"/>';
  b+=t(9,174,'Gate',20)+t(493,174,'Gate',20)+line('M53 166H78M489 166H510')+t(92,294,spec.storage?'Shaded cells: storage until noon':'Route + stalls + play · no overlap',22);
 }else if(k==='city-plan'){
  desc='A street sketch shows bus stop and shops opposite homes. Learners decide improvements before seeing a model.'+(spec.missing?' New voices: a night-shift worker needs daytime quiet and a parent needs a clear pavement.':'');
  b=rect(23,25,139,83,'#b7d6dd')+t(41,76,'Bus stop',25)+rect(353,25,183,83,'#ecd1a9')+t(408,76,'Shops',25)+'<path d="M0 173H560" stroke="#aab8b1" stroke-width="61"/>'+line('M0 173H560','#f8f8e8',3)+t(120,135,'Keep the pavement usable',21);
  for(const x of [58,135,362,439])b+=house(x,218);
  b+=t(222,264,'Homes',24);
  if(spec.missing)b+=rect(155,26,193,83,'#fff2ca')+t(170,55,'Daytime sleep',21)+t(170,88,'Clear path',21);
 }else if(k==='access'){
  desc='Kai uses a walking frame and needs a clear path from the gate to the playground bench. A dotted route crosses the play area, prompting pupils to revise their own plan.';
  b=rect(20,27,520,239,'#dbe8c8')+t(28,62,'Gate',23)+line('M52 79L290 155L480 212','#bf8962',5)+t(179,110,'Football area',23)+'<circle cx="276" cy="149" r="21" fill="#fffdf5" stroke="#56757b" stroke-width="2"/>'+line('M397 217H514M410 222V247M499 222V247','#95714b',9)+t(405,193,'Bench',23);
  b+='<circle cx="86" cy="163" r="18" fill="#d9a784"/>'+line('M86 183V220M87 201L119 211M79 221L73 250M92 221L105 246','#568390',9)+line('M117 203H146V250M120 203L111 250','#6c7786',5)+t(180,293,'Kai needs a clear route.',25);
 }
 const regions={
 settlement:[[225,125,91,58],[117,76,296,157],[15,12,526,258],[14,266,535,40]],
 shops:[[25,55,295,163],[339,55,196,163],[25,55,510,200],[20,257,520,48]],
 map:[[455,8,90,43],[368,96,170,92],[153,86,210,146],[10,262,540,45]],
 headline:[[40,98,471,132],[40,144,472,45],[40,238,472,41],[24,24,512,253]],
 study:[[30,8,492,37],[34,53,494,66],[338,132,190,63],[23,250,515,43]],
 settings:[[27,36,237,206],[27,186,237,58],[300,36,229,206],[300,186,229,58]],
 survey:[[44,69,472,91],[43,69,471,49],[46,170,469,72],[44,247,472,34]],
 'drop-land':[[121,92,71,71],[152,122,237,136],[22,204,278,70],[325,235,226,72]],
 'drop-branches':[[121,92,71,71],[164,143,163,104],[37,179,170,81],[0,108,552,199]],
 'drop-cycle':[[338,242,215,66],[420,90,114,166],[270,15,184,82],[28,139,310,161]],
 'drop-paved':[[124,95,64,68],[155,122,207,141],[2,149,202,99],[8,28,540,277]],
 network:[[16,93,133,85],[166,111,197,70],[173,8,221,75],[152,184,248,39]],
 square:[[54,140,462,44],[80,42,408,224],[80,42,408,224],[75,37,418,234]],
 'city-plan':[[17,20,149,93],[348,20,193,93],[39,210,458,79],[6,15,546,285]],
 access:[[55,134,105,127],[30,63,493,190],[186,114,143,91],[22,26,517,237]]
}[k]?.[p];
 const focus=regions?'<rect x="'+regions[0]+'" y="'+regions[1]+'" width="'+regions[2]+'" height="'+regions[3]+'" rx="10" fill="none" stroke="#356970" stroke-width="3" stroke-dasharray="6 5" aria-hidden="true"/>':'';

 return '<svg viewBox="0 0 560 310" role="img" aria-label="'+esc(spec.title+'. '+desc)+'"><g font-family="system-ui,sans-serif" fill="#24494d">'+b+focus+'</g></svg>';
}
