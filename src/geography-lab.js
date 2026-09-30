import {ukMapArt} from './uk-map-visual.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(x,y,s,size=21)=>`<text x="${x}" y="${y}" font-size="${size}">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,color='#527b78',width=4)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="${width}" fill="none"/>`;
const house=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 25L22 5L44 25" fill="#d89565"/><rect x="5" y="25" width="34" height="30" fill="#f0ce91" stroke="#765c42"/></g>`;
const tree=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 35V65" stroke="#826648" stroke-width="8"/><circle cy="20" r="22" fill="#668f56"/></g>`;
const arrow=(d,color='#17849a')=>`<path class="geo-flow" d="${d}" fill="none" stroke="${color}" stroke-width="6" stroke-dasharray="12 8"/>`;
const point=(x,y,r=8,color='#d9734f')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const scenes={
 journey:['Compare total journey time, including waiting','Check the 45-token budget','Ferry cancelled: neither original option is feasible'],
 landscape:['Natural valley: river, hill and trees','Add homes and a bridge','Clear woodland near the road: discuss possible effects'],
 tools:['Map length: use a ruler and scale','Direction: use the north arrow or compass','Location: choose an atlas; evidence of appearance: a photograph'],
 sampling:['Monday: A8, B2','Tuesday: A4, B6','Wednesday: A7, B3; the pattern varies'],
 change:['Ferry and farms','A bridge connects the banks','Homes and a workshop appear; causes still need evidence'],
 reasoning:['Identify: name the bridge','Describe: six homes near, two farther away','Explain: a crossing may improve access; test the reason'],
 routes:['A400 m: stairs; B600 m: ramp','Traveller uses a wheelchair: compare access','A closes: route availability changes the decision'],
 maps:['Historical purpose: river, bridge, mills','Travel purpose: roads and stops','Compare what each map leaves out'],
 'memory-map':['School → park → library/right turn → bridge → market','Hide landmarks; reconstruct the route','Restore the landmarks and check the sequence'],
 aerial:['View from above: buildings, pond, road, park','Replace detail with symbols','Add a key: preserve location while simplifying detail'],
 grid:['Point six tenths across, two up in2345','Change eastings only: movement is horizontal','Change northings only: movement is vertical'],
 distance:['Straight line and longer route','Compare a shorter detour','Same real route, different scale'],
 'os-map':['Read the supplied key','Measure a path at1:25,000','Compare with1:250,000: equal centimetres mean different distances'],
 contours:['Rise20, then40, then20 over equal100 m sections','Compare equal rises over different distances','Height alone does not determine steepness'],
 coordinates:['Plot north/east of the zero lines','Move south while keeping longitude','Move west while keeping latitude'],
 uk:['Four countries of the United Kingdom','Great Britain excludes Northern Ireland','Locate the seas; borders and relief answer different questions'],
 weather:['Moist air rises and cools on the windward side','Rain can fall as water condenses','Dry incoming air: less moisture for rainfall'],
 population:['Football only7, both5, music only3','Total distinct people:7+5+3=15','A football total includes the overlap; do not count it twice'],
 settlement:['Nucleated: houses cluster','Linear: houses follow a road','Dispersed: separated buildings'],
 quality:['A: income30,clinic10 min; B:40,45 min','B clinic improves to15 min','Income alone does not describe everyone’s quality of life'],
 city:['Government, culture, homes and transport','Transport connects other functions','One station closes: other routes become important'],
 network:['Goods enter: import at the receiving end','The same goods leave: export at the sending end','Port closes; information links can still operate'],
 ice:['Additions exceed losses: mass increases','Losses exceed additions: mass decreases','Ice flows downhill even while the snout retreats'],
 'erosion-ice':['Ice carries rock fragments','Debris scrapes the bed: abrasion','Ice removes a loosened block: plucking'],
 valley:['River-cut V-shaped cross-section','Ice erodes sides and floor','Broad floor and steep sides: glacial trough'],
 corrie:['Small hollows on either side','Ice erosion deepens and enlarges hollows','A narrow ridge remains: arête'],
 deposition:['Mixed debris travels with ice','Ice melts and releases debris','A mixed deposit remains near the former margin'],
 tourism:['Path A80; path B20 visitors in one hour','Divert40 visitors from A to B','New counts A40,B60; capacity matters as well as numbers'],
 river:['Source and tributaries','Tributaries join at confluences','Water continues downstream towards the mouth'],
 cycle:['Evaporation: liquid → vapour','Condensation and precipitation','Runoff and infiltration: different return pathways'],
 'river-process':['Erosion removes material','Transport carries sediment','Slower flow: deposition may occur'],
 meander:['A bend: outer bank erosion, inner bank deposition','The bend migrates and neck narrows','Possible cut-off: a shorter channel and an isolated bend'],
 allocation:['Requests:30+40+20+20=110','Supply100: shortfall10','Supply80: shortfall30; negotiate trade-offs'],
 estuary:['Fresh river water meets seawater','High tide raises water level','Low tide exposes more margin; mixing varies'],
 flood:['Keep rain equal; compare infiltration','Lower infiltration increases model runoff','Increase rain: test the resulting runoff'],
 management:['Budget60; warnings10,wetland40,wall80','Select an affordable package','Budget90: more options, but still trade-offs'],
 scale:['Convert map centimetres to real metres','Change scale while keeping drawn length','Change drawn length while keeping scale']
};
export function modelValues(kind,a,b){
 if(kind==='flood')return {rain:a,infiltration:a*b/100,runoff:a*(100-b)/100};
 if(kind==='ice')return {addition:a,loss:b,balance:a-b};
 if(['scale','tools','distance','os-map'].includes(kind))return {mapCm:a,metresPerCm:b,realMetres:a*b};
 if(kind==='grid')return {reference:`23${a}45${b}`,x:100+a*45,y:480-b*40};
 return {a,b};
}
export function geographyArt(kind,p=0,a=6,b=20,code){
 if(kind==='journey')return `<svg viewBox="0 0 900 540" role="img" aria-label="Fictional Irish Sea journey comparison">${text(35,55,'Wales → Irish Sea crossing → Northern Ireland',28)}${text(35,115,'A: coach 2h + check-in 1h + ferry 3h + coach 1h',23)}${arrow('M45 155H790')}${text(35,205,'Total 7 hours · 35 tokens',25)}${text(35,285,'B: coach 2h + check-in 2h + flight 1h + coach 1h',23)}${arrow('M45 325H790')}${text(35,375,'Total 6 hours · 60 tokens',25)}${text(35,445,p===0?'Which is faster? Which is cheaper?':p===1?'Budget 45: A fits; B exceeds it by 15 tokens.':'A cancelled. B over budget. Revise the plan.',25)}${text(35,500,'Classroom model: invented times and costs, not live travel advice.',18)}</svg>`;
 if(kind==='uk')return ukMapArt({phase:p});
 let body='';const v=modelValues(kind,a,b);
 if(['scale','tools','distance','os-map'].includes(kind)){
  body=line(90,150,90+a*45,150,'#d9734f',12)+text(80,95,`${a} cm × ${b} m per cm = ${v.realMetres} m`,30);
  for(let i=0;i<=10;i++)body+=line(90+i*45,180,90+i*45,200)+text(84+i*45,226,i,18);
  body+=text(80,290,'Map ruler: centimetres (not screen measurements)')+text(80,340,'Real distance depends on BOTH length and scale.');
  if(kind==='distance')body+=arrow('M90 390L270 350L405 430L540 390')+text(95,475,'Route sections can total more than the direct line.');
  if(kind==='os-map')body+=text(85,400,'Key: P parking · blue line stream · dashed path')+text(85,440,'Original practice diagram, not an OS extract');
 }else if(kind==='grid'){
  for(let i=0;i<=10;i++)body+=line(100+i*45,80,100+i*45,480,i===0||i===10?'#234a47':'#bed0c5',i===0||i===10?3:1)+line(100,80+i*40,550,80+i*40,i===0||i===10?'#234a47':'#bed0c5',i===0||i===10?3:1);
  body+=point(v.x,v.y)+text(90,510,'23')+text(538,510,'24')+text(60,482,'45')+text(60,86,'46')+text(580,155,v.reference,30)+text(575,210,'East first',19)+text(575,245,'North next',19);
 }else if(kind==='coordinates'){
  body=line(90,270,660,270)+line(375,55,375,475)+text(90,250,'Equator0°')+text(390,80,'Prime meridian0°',18);
  const x=p===2?250:500,y=p===1?360:160;body+=point(x,y,12)+text(x+14,y,p===2?'20°N,30°W':p===1?'20°S,30°E':'20°N,30°E')+text(375,35,'N')+text(375,510,'S')+text(50,275,'W')+text(700,275,'E');
 }else if(kind==='reasoning'){
  const labels=code==='1.6'?['Claim','Evidence','Reason / limit']:['Identify','Describe','Explain'];
  const values=code==='1.6'?['Shops cluster near the stop','12 within200 m;3 farther away','Access may help; counts do not prove cause']:['A bridge crosses the river','Six homes near; two farther away','A crossing may make travel easier'];
  labels.forEach((label,i)=>{body+=`<rect x="65" y="${60+i*145}" width="630" height="110" rx="18" fill="${p===i?'#efd79b':'#dbe6cd'}"/>`+text(85,95+i*145,label,25)+text(85,140+i*145,values[i],23);});
 }else if(kind==='contours'){
  const pts=p===0?'90,400 250,360 410,280 570,240':p===1?'90,400 330,200 570,200':'90,400 250,200 570,150';
  body=line(90,70,90,440)+line(90,440,650,440)+`<polyline points="${pts}" stroke="#35838c" stroke-width="7" fill="none"/>`;
  body+=text(90,480,'Horizontal distance →')+text(100,50,'Height ↑')+text(100,110,p===0?'0,100,200,300 m →100,120,160,180 m':p===1?'Same rise over a longer run is gentler':'Compare rise ÷ run, not summit height',23);
  body+=p===0?text(260,340,'Steepest: middle section',20):`<path d="M90 400L${p===1?570:410} 200" stroke="#bb7855" stroke-width="5" fill="none"/>`+text(110,470,'Blue and brown: compare rise over distance',20);
 }else if(['ice','erosion-ice','deposition','valley','corrie'].includes(kind)){
  if(kind==='valley'){
   const shapes=['M65 100L375 450L690 100','M65 100Q230 430 375 440Q530 430 690 100','M65 100L230 380Q250 440 375 440Q500 440 525 380L690 100'];
   body=`<path d="${shapes[p]}L690 500H65Z" fill="#bcb59a" stroke="#716f51" stroke-width="5"/>`+(p===1?`<path d="M150 140Q270 360 375 420Q485 360 600 140Z" fill="#a8dae7" opacity=".8"/>`:'')+text(75,55,'Cross-section across the valley',28);
  }else if(kind==='corrie'){
   body=`<path d="M55 450L375 60L705 450Z" fill="#aaa78d"/>`+`<ellipse cx="250" cy="${245+p*15}" rx="${65+p*22}" ry="${50+p*22}" fill="#cce8ee"/><ellipse cx="500" cy="${245+p*15}" rx="${65+p*22}" ry="${50+p*22}" fill="#cce8ee"/>`+text(325,45,'Arête',25)+text(140,405,'Corrie')+text(485,405,'Corrie');
  }else{
   const end=kind==='ice'?Math.max(260,Math.min(650,450+(a-b)*12)):kind==='deposition'?650-p*140:620;
   body=`<path d="M40 100L710 420V500H40Z" fill="#afa888"/><path d="M45 100L${end} ${150+end*.38}L${end-40} ${200+end*.38}L45 190Z" fill="#a9d9e8" stroke="#438da2" stroke-width="3"/>`+arrow('M100 155L430 300');
   for(let i=0;i<8;i++)body+=point(130+i*65,200+i*30,5+i%3*3,'#726952');
   body+=text(70,70,kind==='ice'?`Add ${a} − lose ${b} = ${v.balance>0?'+':''}${v.balance} units`:kind==='deposition'?'Mixed debris is left as the ice melts':'Rock debris scrapes or is removed',27);
   if(kind==='erosion-ice')body+=p===2?`<rect x="470" y="320" width="35" height="28" fill="#716a57"/><path d="M480 370L490 330" stroke="#d07346" stroke-width="6"/>`:line(350,330,460,385,'#615b49',5);
   body+=text(60,480,'Ice-flow arrow always points downhill',23);
  }
 }else if(kind==='flood'){
  body=`<path d="M30 310H730V500H30Z" fill="${b<30?'#aaaeb0':'#a6bd86'}"/>`;
  for(let i=0;i<10;i++)body+=arrow(`M${80+i*60} 80L${65+i*60} ${110+a*3}`);
  body+=arrow('M70 330L650 330')+arrow(`M320 350L320 ${365+v.infiltration*2}`,'#576f38');
  body+=text(40,40,`Rain ${a} units = infiltrated ${v.infiltration.toFixed(1)} + runoff ${v.runoff.toFixed(1)}`,27)+text(370,310,'Surface runoff')+text(340,430,'Infiltration');
 }else if(kind==='cycle'){
  body=`<path d="M50 410Q200 350 350 410T730 410V500H50Z" fill="#84c4dc"/><path d="M180 180Q180 110 260 140Q340 70 400 150Q470 130 480 190Z" fill="#c2d6df"/>`+arrow('M120 390Q70 230 200 170')+arrow('M430 200L490 380')+arrow('M610 410L700 410');
  body+=text(45,255,'Evaporation')+text(220,90,'Condensation')+text(480,275,'Precipitation')+text(510,465,'Runoff');body+=`<circle cx="${[120,300,490][p]}" cy="${[340,160,340][p]}" r="19" fill="#edac53"/>`;
 }else if(['river','river-process','meander','estuary'].includes(kind)){
  if(kind==='meander'){
   const ds=['M40 280C220 30 500 510 710 230','M40 280C150 40 600 30 475 220C300 460 250 430 400 275C570 100 620 490 710 300','M40 280L710 300'];
   body=`<path d="${ds[p]}" fill="none" stroke="#7ec4d8" stroke-width="40"/>`+arrow(ds[p]);if(p===2)body+=`<ellipse cx="380" cy="175" rx="95" ry="65" fill="none" stroke="#7ec4d8" stroke-width="24"/>`;
   body+=text(60,70,p===2?'Abandoned bend (oxbow)':'Outer bank: erosion; inner bank: deposition',25);
  }else if(kind==='estuary'){
   body=`<path d="M40 225Q360 210 720 ${p===1?50:130}V${p===1?460:380}Q350 300 40 285Z" fill="#83bfda"/>`+arrow('M70 250L370 250')+arrow('M680 310L440 280','#826eb1')+text(50,160,'River freshwater')+text(500,70,'Tidal seawater');
  }else{
   body=`<path d="M65 80Q220 70 310 230T700 440" fill="none" stroke="#7ab9ca" stroke-width="35"/>`+arrow('M65 80Q220 70 310 230T700 440')+`<path d="M480 80L350 285" stroke="#7ab9ca" stroke-width="20"/>`+text(60,50,'Source')+text(465,60,'Tributary')+text(400,310,'Confluence')+text(590,490,'Mouth');
   if(kind==='river-process')for(let i=0;i<8;i++)body+=point(170+i*65,120+i*40,3+i%3*3,'#947854');
  }
 }else if(kind==='weather'){
  body=`<path d="M70 430L385 100L690 430Z" fill="#a6b38b"/>`+arrow('M40 320Q180 320 335 150Q420 65 650 300')+text(70,80,p===2?'Dry incoming air':'Moist incoming air',27)+text(70,470,'Windward: rising/cooling')+text(450,470,'Leeward',23);
  if(p!==2)for(let i=0;i<6;i++)body+=line(250+i*20,150,235+i*20,230,'#479ab9',5);
 }else if(kind==='population'){
  body=`<circle cx="295" cy="255" r="155" fill="#86b6bf" fill-opacity=".6"/><circle cx="465" cy="255" r="155" fill="#e8b878" fill-opacity=".6"/>`+text(205,80,'Football12')+text(440,80,'Music8')+text(205,270,'7 only',30)+text(350,270,'5 both',28)+text(475,270,'3 only',30)+text(170,470,p===1?'Unique total =7+5+3=15':'Do not count the overlap twice',28);
 }else if(['quality','sampling','tourism','allocation','management'].includes(kind)){
  let labels,values;
  if(kind==='sampling'){labels=['Door A','Door B'];values=[[8,2],[4,6],[7,3]][p];}
  if(kind==='quality'){labels=['A income','B income','A clinic min','B clinic min'];values=[30,40,10,p===0?45:15];}
  if(kind==='tourism'){labels=['Path A','Path B'];values=p===0?[80,20]:[40,60];}
  if(kind==='allocation'){labels=['Homes','Farms','Industry','Environment'];values=[30,40,20,20];}
  if(kind==='management'){labels=['Warnings','Wetland','Wall'];values=[10,40,80];}
  const max=Math.max(...values);values.forEach((v,i)=>{const y=100+i*90;body+=text(40,y+25,labels[i],23)+`<rect x="230" y="${y}" width="${v/max*390}" height="45" fill="${i%2?'#dba76c':'#4f9baa'}"/>`+text(635,y+31,v,26);});
  body+=text(45,490,kind==='quality'?'Separate measures: income tokens and travel minutes':kind==='management'?`Budget ${p===2?90:60}; choose a package, explain a limit`:kind==='allocation'?`Total110; supply${p===2?80:100}`:'Invented counts: describe this sample only',22);
 }else if(['network','city'].includes(kind)){
  const labels=kind==='city'?['Homes','Station','Museum','Parliament']:['Sending country','Port','Receiving country','Information'];
  const positions=[[130,130],[380,130],[630,130],[380,380]];
  body+=arrow('M170 130H580')+arrow('M380 170V330');
  positions.forEach(([x,y],i)=>{body+=`<rect x="${x-95}" y="${y-38}" width="190" height="76" rx="14" fill="${p===2&&i===1?'#edb3a2':'#d1e1ca'}"/>`+text(x-87,y+7,labels[i],19);});
  if(p===2)body+=line(295,80,460,185,'#b54d32',8)+text(230,490,'Find an alternative connection',24);
 }else{
  // Plan-view scenes: relationships change in response to the case control.
  body=`<rect x="40" y="60" width="680" height="420" rx="12" fill="#dce7c8"/><path d="M410 60Q310 200 450 480" stroke="#87c6d9" stroke-width="45" fill="none"/>`+text(650,95,'N ↑',25);
  if(kind!=='landscape'||p>0)body+=`<path d="M50 370H350M475 370H710" stroke="#b5b3a7" stroke-width="25"/>`;
  if(kind==='settlement'){
   const pts=p===0?[[250,220],[305,210],[260,280],[320,290],[210,260]]:p===1?[[90,310],[205,310],[330,310],[490,310],[625,310]]:[[85,100],[250,320],[500,130],[630,390],[90,380]];
   pts.forEach(([x,y])=>body+=house(x,y));
  }else if(kind==='memory-map'){
   const labels=['School','Park','Library','Bridge','Market'];for(let i=0;i<5;i++){body+=point(100+i*125,230,12);if(p!==1)body+=text(65+i*125,195,labels[i],19);}body+=arrow('M100 230H600');
  }else if(kind==='aerial'){
   body+=p===0?house(150,220):`<rect x="150" y="235" width="55" height="40" fill="#cb8262"/>`;body+=`<ellipse cx="575" cy="250" rx="65" ry="40" fill="#87c6d9"/>`+text(100,320,'School')+text(550,320,'Pond')+text(250,110,'Park')+text(500,410,'Road');
   if(p===2)body+=text(65,465,'Key: rectangle school; oval pond; green park',20);
  }else if(kind==='routes'){
   body+=line(110,155,600,155,'#b87156',8)+line(110,155,110,320,'#648844',8)+line(110,320,600,320,'#648844',8)+line(600,320,600,155,'#648844',8)+text(175,125,'A400 m · stairs')+text(175,290,'B600 m · ramp');if(p===2)body+=text(265,195,'A CLOSED',28);
  }else{
   body+=`<path d="M70 170Q170 20 275 170" fill="#adb995"/>`+text(115,155,'Hill',20);
   if(p<2)body+=tree(500,270)+tree(540,285)+tree(580,275);else body+=text(470,275,'Cleared land',20);
   if(kind!=='landscape'||p>0)body+=house(120,190)+house(200,245)+house(545,160);
   if(p>0||kind==='reasoning')body+=`<rect x="360" y="340" width="120" height="50" fill="#8d765f"/>`+text(365,330,'Bridge');
   if(p===2)body+=house(495,360)+text(485,455,'Workshop',20);
   body+=text(80,100,kind==='change'&&p===0?'Ferry crossing':kind==='maps'&&p===0?'Historical selection':'Schematic valley',24);
  }
 }
 return `<svg viewBox="0 0 760 530" role="img" aria-label="${esc(scenes[kind]?.[p]||kind)}"><g font-family="system-ui,sans-serif" fill="#183f3b">${body}</g></svg>`;
}
export function createGeographyLab(spec){
 const root=document.createElement('section');root.className='geography-lab';let phase=0,a=6,b=20;
 if(spec.kind==='flood'){a=30;b=60;}if(spec.kind==='ice'){a=9;b=6;}if(spec.kind==='grid'){a=6;b=2;}
 if(spec.kind==='os-map'){a=2;b=250;}if(spec.kind==='distance'){a=4;b=100;}
 const initial={a,b};
 const prompt=document.createElement('p');prompt.className='lab-prompt';prompt.textContent=spec.prompt;
 const canvas=document.createElement('div');canvas.className='lab-canvas';
 const caption=document.createElement('p');caption.className='lab-caption';caption.setAttribute('aria-live','polite');
 const controls=document.createElement('div');controls.className='lab-controls';
 const make=(label,fn)=>{const el=document.createElement('button');el.type='button';el.textContent=label;el.addEventListener('click',fn);controls.append(el);return el;};
 const update=()=>{canvas.innerHTML=geographyArt(spec.kind,phase,a,b,spec.code);caption.textContent=`${phase+1}/3 · ${spec.kind==='reasoning'&&spec.code==='1.6'?['State a pattern','Support it with counts','Explain a possible mechanism and its limit'][phase]:scenes[spec.kind][phase]}`;play.hidden=!canvas.querySelector('.geo-flow');};
 make('Next case →',()=>{
  phase=(phase+1)%3;
  const presets={flood:[[30,60],[30,20],[50,20]],ice:[[9,6],[4,7],[4,7]],grid:[[6,2],[8,2],[8,8]],scale:[[6,20],[6,50],[4,50]],tools:[[6,20],[6,50],[4,50]],distance:[[4,100],[6,100],[8,50]],'os-map':[[2,250],[3,250],[3,2500]]};
  if(presets[spec.kind]){[a,b]=presets[spec.kind][phase];inputs.forEach(({input,key,output})=>{input.value=key==='a'?a:b;output.textContent=String(key==='a'?a:b);});}
  update();
 });
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const play=make('Play motion',()=>{const on=root.classList.toggle('lab-playing');play.textContent=on?'Pause motion':'Play motion';play.setAttribute('aria-pressed',String(on));});play.setAttribute('aria-pressed','false');
 if(reduced.matches){play.disabled=true;play.textContent='Reduced motion';}
 make('Reset',()=>{phase=0;a=initial.a;b=initial.b;root.classList.remove('lab-playing');play.textContent=reduced.matches?'Reduced motion':'Play motion';play.setAttribute('aria-pressed','false');inputs.forEach(({input,key,output})=>{input.value=key==='a'?a:b;output.textContent=input.value;});update();});
 const inputs=[];
 function slider(label,key,min,max,step){const wrapper=document.createElement('label');wrapper.textContent=label+' ';const output=document.createElement('output'),input=document.createElement('input');input.type='range';input.min=min;input.max=max;input.step=step;input.value=key==='a'?a:b;input.setAttribute('aria-label',label);output.textContent=input.value;input.addEventListener('input',()=>{if(key==='a')a=+input.value;else b=+input.value;output.textContent=input.value;update();});wrapper.append(output,input);controls.append(wrapper);inputs.push({input,key,output});}
 if(spec.kind==='flood'){slider('Rainfall units','a',10,60,10);slider('Infiltration percent','b',0,100,10);}
 if(spec.kind==='ice'){slider('Added ice units','a',0,15,1);slider('Lost ice units','b',0,15,1);}
 if(spec.kind==='grid'){slider('Tenths east','a',0,9,1);slider('Tenths north','b',0,9,1);}
 if(['scale','tools','distance','os-map'].includes(spec.kind)){slider('Map centimetres','a',1,10,1);slider('Metres per centimetre','b',10,spec.kind==='os-map'?2500:250,10);}
 const note=document.createElement('p');note.className='lab-limit';note.textContent=spec.kind==='flood'?'Simplified water budget: infiltration + runoff = rain. Omits evaporation, storage and flow timing; not a flood forecast.':'Schematic teaching model. Scene changes are comparisons, not measured time or an exact map. Use the task source for numerical work.';
 root.append(prompt,canvas,caption,controls,note);update();return root;
}
