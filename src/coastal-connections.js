import {createCoastalArtwork,trainStationVisual} from './coastal-art.js';
import {cardArtwork} from './coastal-card-art.js';
import {goodCards,badCards,drawCards,chooseCard} from './coastal-cards.js';
export {goodCards,badCards,chooseCard};
import {geoStops,regions,activeForRound,facilitiesForRound,unlockRounds,vehicleLabels,discoveryForRound,waterways} from './coastal-geography.js';
import {drawGeography,geographyBounds} from './coastal-map.js';
import {freshLearning,advanceLearning} from './coastal-learning.js';
import {installLearningUI} from './coastal-learning-ui.js';
import {freshTutorial,installTutorial} from './coastal-tutorial.js';
import {stationArt,stationArtUrl} from './coastal-station-art.js';
import {stationUpgradeArtwork} from './coastal-station-upgrade-art.js';
import {flagUrl} from './coastal-learning.js';
export const stops=geoStops;
const waterwaysForText=round=>waterways.filter(w=>w[3]<=round).map(w=>w[0]);
const colours={road:'#137c83',rail:'#df7154',ferry:'#dca438',flight:'#8261ae',highspeed:'#346cb7',tunnel:'#9b6699'};
export function routeAllowed(type,a,b,state){
 if(a===b)return false;
 const first=stops[a],last=stops[b];if(!first||!last)return false;
 const has=(s,kind)=>Boolean(s.kind===kind||state?.facilities[s.id]?.includes(kind));
 return type==='tunnel'?first.tunnel&&last.tunnel&&first.land!==last.land:type==='road'||type==='rail'||type==='highspeed'?first.land===last.land:type==='ferry'?has(first,'port')&&has(last,'port')&&first.land!==last.land:type==='flight'?has(first,'airport')&&has(last,'airport'):false;
}
export const prices={road:20,rail:55,ferry:35,flight:80,highspeed:110,tunnel:130},deliveryReward=15;
const mod=(state,key)=>state.mods?.[key]??0;
const vehicleMod=(state,type,suffix)=>mod(state,type+suffix)+(['highspeed','tunnel'].includes(type)?mod(state,'rail'+suffix):0);
export const vehicleUnlocked=(state,type)=>state.round>=unlockRounds[type];
export const routeCost=(state,type)=>Math.max(5,Math.round(prices[type]*Math.max(.3,1+vehicleMod(state,type,'Cost')+mod(state,'allCost'))));
export const vehicleUpgradeCost=(state,type)=>Math.max(5,Math.round(prices[type]*state.levels[type]*Math.max(.3,1+mod(state,'upgradeCost'))));
export const terminalUpgradeCost=(state,id)=>Math.max(5,Math.round(20*state.terminals[id]*Math.max(.3,1+mod(state,'terminalCost'))));
export const stationStats=(state,id)=>({queue:Math.max(2,5+(state.terminals[id]-1)*3+mod(state,'queue')),patience:Math.max(12,35+(state.terminals[id]-1)*10+mod(state,'patience')),alarm:Math.max(5,10+mod(state,'alarm'))});
export const arrivalInterval=state=>Math.max(.12,Math.max(6,20-state.round*.5)/state.activeStops.length/Math.max(.4,1+mod(state,'arrival')));
export const fare=state=>Math.max(5,deliveryReward+mod(state,'fare'));
export function createGameState(seed=(Date.now()+Math.floor(Math.random()*1e9))>>>0){return {worldVersion:2,tutorial:freshTutorial(),learning:freshLearning(),discovery:null,tool:'road',selected:null,links:[],passengers:makePassengers(),running:false,delivered:0,ferryClosed:false,speed:1,complete:false,round:1,target:5,elapsed:0,spawnClock:0,pressure:0,failed:false,credits:20,levels:{road:1,rail:1,ferry:1,flight:1,highspeed:1,tunnel:1},terminals:Object.fromEntries(stops.map(s=>[s.id,1])),facilities:{},mods:{},rng:seed,cardHistory:[],cardPhase:'none',cardOffers:[],camera:{zoom:1,x:0,y:0},danger:{},activeStops:activeForRound(1),stars:0,roundIncome:0,roundStart:null,lossReason:'',celebrationDismissed:false};}
function makePassengers(){return [[0,1],[0,1],[1,0],[2,1],[2,1]].map(([at,destination],id)=>({id,at,destination,mode:'waiting',wait:0}));}
export const roundDuration=state=>Math.max(75,60+state.target*Math.max(9,15-state.round*.3)+mod(state,'time'));
export const refundRate=state=>Math.max(.25,Math.min(.95,.75+mod(state,'refund')));
export function routeIssue(state,a,b,type){
 const names={road:'bus',rail:'train',ferry:'boat',flight:'plane',highspeed:'high-speed train',tunnel:'tunnel train'};
 if(!(type in prices))return {code:'tool',message:'Choose a vehicle first.'};
 if(!state.activeStops.includes(a)||!state.activeStops.includes(b))return {code:'inactive',message:'This stop has not opened yet.'};
 if(a===b)return {code:'same',message:'Choose a different stop.',hint:'Drag from one stop to another.'};
 if(!vehicleUnlocked(state,type))return {code:'locked',message:vehicleLabels[type]+' unlocks in round '+unlockRounds[type]+'.',hint:'Keep delivering passengers to explore new areas.'};
 if(!routeAllowed(type,a,b,state)){
  if(type==='tunnel')return {code:'tunnel',message:'The tunnel train links Folkestone and Coquelles only.',hint:'Connect ordinary trains to these terminals for onward journeys.'};
  if(type==='road'||type==='rail'||type==='highspeed')return {code:'sea',message:'A '+names[type]+" can't cross the sea.",hint:'Use a boat between harbours or a plane between airports.'};
  const first=stops[a],last=stops[b],mixed=first.kind==='airport'&&last.kind==='port'||first.kind==='port'&&last.kind==='airport';
  if(mixed)return {code:'mixed',message:"You can't link a harbour and an airport with a "+names[type]+'.',hint:type==='flight'?'Planes need an airport at both ends. Build an airport here, or use a bus on the same land.':'Boats need a harbour at both ends. Build a harbour here, or use a bus on the same land.'};
  return {code:'facility',message:type==='flight'?'Planes need two airports.':'Boats need two harbours on different land.',hint:'Tap a stop to build the missing facility, or choose another transport.'};
 }
 if(state.links.some(l=>l.type===type&&(l.a===a&&l.b===b||l.a===b&&l.b===a)))return {code:'duplicate',message:'This '+names[type]+' route already exists.',hint:'Upgrade its vehicles or connect another stop.'};
 if(state.links.length>=6+state.round*2)return {code:'limit',message:'No route permits left this round.',hint:'Sell a route to free a permit.'};
 const cost=routeCost(state,type);if(state.credits<cost)return {code:'credits',message:'Not enough credits.',hint:'Need '+cost+' · You have '+state.credits+' · Earn '+(cost-state.credits)+' more from deliveries or sell a route.'};
 return null;
}
export function buyRoute(state,a,b,type){if(routeIssue(state,a,b,type))return false;const cost=routeCost(state,type);state.credits-=cost;state.links.push({a,b,type,position:0,direction:1,cargo:[],paid:cost});return true;}
export function removeRoute(state,index){const link=state.links[index];if(!link)return false;for(const id of link.cargo){const p=state.passengers[id],start=link.direction===1?link.a:link.b,end=link.direction===1?link.b:link.a,nearest=link.position<.5?start:end;p.at=stops[nearest].shape===stops[p.destination].shape?start:nearest;p.mode='waiting';p.wait=0;}state.credits+=Math.floor((link.paid??prices[link.type])*refundRate(state));state.links.splice(index,1);return true;}
export const facilityCost=(state,kind)=>Math.max(10,Math.round((kind==='port'?45:85)*Math.max(.3,1+mod(state,kind+'Cost'))));
export function buildFacility(state,id,kind){if(!['port','airport'].includes(kind)||state.round<(kind==='port'?10:13)||(kind==='port'&&!stops[id]?.coastal)||!state.activeStops.includes(id)||stops[id].kind===kind||state.facilities[id]?.includes(kind)||state.credits<facilityCost(state,kind))return false;state.credits-=facilityCost(state,kind);(state.facilities[id]??=[]).push(kind);return true;}
export function upgradeTerminal(state,id){if(!state.activeStops.includes(id))return false;const cost=terminalUpgradeCost(state,id);if(state.terminals[id]>=4||state.credits<cost)return false;state.credits-=cost;state.terminals[id]++;return true;}
export const vehicleStats=(state,type)=>({capacity:Math.max(1,1+(state.levels[type]-1)+mod(state,'seats')+vehicleMod(state,type,'Seats')),speed:({road:80,rail:145,ferry:140,flight:320,highspeed:280,tunnel:230}[type])*(1+(state.levels[type]-1)*.3)*Math.max(.35,1+vehicleMod(state,type,'Speed')+mod(state,'allSpeed'))});
export function upgradeVehicle(state,type){if(!(type in state.levels)||!vehicleUnlocked(state,type))return false;const cost=vehicleUpgradeCost(state,type);if(state.levels[type]>=4||state.credits<cost)return false;state.credits-=cost;state.levels[type]++;return true;}
export function nextRound(state,retry=false){
 if(!retry&&(!state.complete||state.cardPhase!=='done'))return false;
 if(retry&&state.roundStart){for(const key of ['credits','links','levels','terminals','facilities','rng','learning'])if(key in state.roundStart)state[key]=structuredClone(state.roundStart[key]);}
 if(!retry)state.round++;
 state.learning??=freshLearning();state.learning.clock=0;state.learning.coin=null;
 state.activeStops=activeForRound(state.round);for(const [id,kinds]of Object.entries(facilitiesForRound(state.round)))state.facilities[id]=[...new Set([...(state.facilities[id]??[]),...kinds])];state.discovery=null;state.target=state.round===1?5:Math.max(state.activeStops.length,5+(state.round-1)*4+mod(state,'demand'));
 state.passengers=state.round===1?makePassengers():[];state.delivered=0;state.elapsed=0;state.spawnClock=0;state.pressure=0;state.danger={};state.roundIncome=0;state.roundStart=null;state.lossReason='';state.celebrationDismissed=false;state.cardPhase='none';state.cardOffers=[];state.complete=false;state.failed=false;state.running=false;state.selected=null;
 for(const l of state.links){l.cargo=[];l.position=0;l.direction=1;}return true;
}
export function findRoute(state,start,destination){
 return searchRoute(state,start,at=>at===destination);
}
export function findShapeRoute(state,start,destinationShape){
 return searchRoute(state,start,at=>state.activeStops.includes(at)&&stops[at].shape===destinationShape);
}
function searchRoute(state,start,reached){
 const queue=[{route:[start],cost:0}],seen=new Set();
 while(queue.length){queue.sort((a,b)=>a.cost-b.cost);const {route,cost}=queue.shift(),at=route.at(-1);if(seen.has(at))continue;seen.add(at);if(reached(at))return route;
  for(const link of state.links){if(link.type==='ferry'&&state.ferryClosed)continue;
   const next=link.a===at?link.b:link.b===at?link.a:null;
   if(next!==null&&!seen.has(next)){const a=stops[at],b=stops[next];queue.push({route:[...route,next],cost:cost+Math.hypot(a.x-b.x,a.y-b.y)/vehicleStats(state,link.type).speed});}
  }
 }return null;
}
function board(state,link,at,next){
 for(const p of state.passengers){if(link.cargo.length>=vehicleStats(state,link.type).capacity)break;
  const fastest=state.links.filter(l=>(l.a===at&&l.b===next||l.b===at&&l.a===next)&&!(l.type==='ferry'&&state.ferryClosed)).sort((a,b)=>vehicleStats(state,b.type).speed-vehicleStats(state,a.type).speed)[0];
  if(p.mode==='waiting'&&p.at===at&&fastest===link&&findShapeRoute(state,at,stops[p.destination].shape)?.[1]===next){p.mode='riding';p.wait=0;link.cargo.push(p.id);}
 }
}
export function advanceGame(state,seconds){
 if(!state.running||state.complete||state.failed)return;
 state.learning??=freshLearning();
 if(!state.roundStart)state.roundStart=structuredClone({credits:state.credits,links:state.links,levels:state.levels,terminals:state.terminals,facilities:state.facilities,rng:state.rng,learning:state.learning});
 for(let time=0;time<seconds;time+=.05){
  const dt=Math.min(.05,seconds-time)*state.speed;
  state.elapsed+=dt;state.spawnClock+=dt;
  advanceLearning(state,dt);
  const interval=arrivalInterval(state);
  if(state.round>1&&state.passengers.length<state.target&&state.spawnClock>=interval){
   state.spawnClock=0;const id=state.passengers.length,at=state.activeStops[id%state.activeStops.length];state.rng=(Math.imul(state.rng,1664525)+1013904223)>>>0;const candidates=state.activeStops.filter(id=>stops[id].shape!==stops[at].shape),destination=candidates[state.rng%candidates.length];
   state.passengers.push({id,at,destination,mode:'waiting',wait:0});
  }
  for(const p of state.passengers)if(p.mode==='waiting'||p.mode==='riding'&&state.ferryClosed&&state.links.some(l=>l.type==='ferry'&&l.cargo.includes(p.id)))p.wait=(p.wait??0)+dt;
  for(const id of state.activeStops){const queue=state.passengers.filter(p=>p.at===id&&(p.mode==='waiting'||p.mode==='riding'&&state.ferryClosed&&state.links.some(l=>l.type==='ferry'&&l.cargo.includes(p.id)))),stats=stationStats(state,id),crowded=queue.length>=stats.queue||queue.some(p=>p.wait>=stats.patience);state.danger[id]=crowded?(state.danger[id]??0)+dt:0;if(state.danger[id]>=stats.alarm){state.failed=true;state.lossReason=stops[id].name+' stayed blocked for '+stats.alarm+' seconds.';}}
  state.pressure=Math.max(0,...Object.values(state.danger));
  if(state.elapsed>=roundDuration(state)){state.failed=true;state.lossReason='The round timer ran out.';}
  if(state.failed){state.running=false;break;}
  for(const link of state.links){
   if(link.type==='ferry'&&state.ferryClosed)continue;
   const start=link.direction===1?link.a:link.b,end=link.direction===1?link.b:link.a;
   if(link.position===0)board(state,link,start,end);
   const a=stops[link.a],b=stops[link.b],length=Math.hypot(a.x-b.x,a.y-b.y);
   link.position+=dt*vehicleStats(state,link.type).speed/length;
   if(link.position>=1){
    for(const id of link.cargo){const p=state.passengers[id];p.at=end;p.wait=0;p.mode=stops[end].shape===stops[p.destination].shape?'delivered':'waiting';if(p.mode==='delivered'){state.delivered++;state.credits+=fare(state);state.roundIncome+=fare(state);}}
    link.cargo=[];link.direction*=-1;link.position=0;
   }
  }
  if(state.delivered===state.target){state.complete=true;state.running=false;const stars=state.elapsed<state.target*8?3:state.elapsed<state.target*14?2:1;state.stars=stars;state.credits+=stars*Math.max(1,5+mod(state,'star'));state.cardPhase='good';state.cardOffers=drawCards(state,'good');break;}
 }
}
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const cardPicture=id=>{const img=node('img',null,'coastal-card-picture');img.src=cardArtwork(id);img.alt='';img.setAttribute('aria-hidden','true');return img;};
export function createCoastalGame(saved){
 const state=saved?.worldVersion===2?{...createGameState(),...structuredClone(saved)}:createGameState();state.running=false;state.levels={...createGameState().levels,...state.levels};
 state.learning??=freshLearning();
 // Older saves used city-specific destinations. Keep unfinished journeys meaningful with reused shapes.
 for(const p of state.passengers)if(p.mode!=='delivered'&&stops[p.at].shape===stops[p.destination].shape){p.destination=state.activeStops.find(id=>stops[id].shape!==stops[p.at].shape);}
 state.terminals={...Object.fromEntries(stops.map(s=>[s.id,1])),...state.terminals};
 if(state.complete&&state.cardPhase==='none'){state.cardPhase='good';state.cardOffers=drawCards(state,'good');}
 const root=node('section',null,'coastal-game'),head=node('header',null,'coastal-heading');
 head.append(node('h2','Coastal Connections'),node('p','Build your network. Keep queues moving. Earn upgrades each round.'));
 const body=node('div',null,'coastal-body'),map=node('div',null,'coastal-map'),canvas=node('canvas');canvas.width=1000;canvas.height=600;
 canvas.setAttribute('aria-label','Transport network: tap or drag between stops to connect them. Keyboard users can use the stop buttons.');
 const ctx=canvas.getContext('2d'),art=createCoastalArtwork(),reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;map.append(canvas);
 let visualTime=0,previousRound=state.round,previousDelivered=state.delivered,manualStepping=false;
 const effects=[],previousPassengers=new Map(),stationBirth=new Map(state.activeStops.map(id=>[id,-10]));
 function effect(id,label,colour='#137c83'){if(!reducedMotion)effects.push({id,label,colour,born:visualTime});}
 let inspected=null,removing=false,completionShown=Boolean(state.celebrationDismissed),routeListKey='';
 let rejected=null,feedbackUntil=0;
 const toast=node('div',null,'coastal-route-feedback');toast.hidden=true;toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');map.append(toast);
 function feedback(title,hint='',kind='error',persistent=false){toast.dataset.kind=kind;toast.replaceChildren(node('strong',(kind==='error'?'✕ ':kind==='success'?'✓ ':'➜ ')+title),node('span',hint));toast.hidden=false;feedbackUntil=performance.now()+(persistent?60000:6500);message.textContent=title+(hint?' '+hint:'');message.dataset.kind=kind;}
 const hud=node('div',null,'coastal-hud'),money=node('strong'),clock=node('span'),alarm=node('strong');hud.append(money,clock,alarm);map.append(hud);
 const celebration=node('div',null,'coastal-celebration');celebration.hidden=true;celebration.setAttribute('role','dialog');celebration.setAttribute('aria-label','Round complete');
 const dismiss=node('button','×','coastal-dismiss');dismiss.type='button';dismiss.setAttribute('aria-label','Dismiss celebration');dismiss.onclick=()=>{celebration.hidden=true;state.celebrationDismissed=true;};
 const congrats=node('h3','Good job, network builder!'),goldStars=node('div',null,'coastal-gold-stars'),result=node('p'),bonus=node('p'),continueButton=node('button','Continue →');continueButton.type='button';continueButton.onclick=()=>{celebration.hidden=true;openCards();};celebration.append(dismiss,congrats,goldStars,result,bonus,continueButton);map.append(celebration);
 const accessible=node('div',null,'coastal-stops');
 for(const stop of stops){const b=node('button',stop.name);b.type='button';b.dataset.stop=stop.id;b.setAttribute('aria-label','Connect '+stop.name);b.onclick=()=>select(stop.id);accessible.append(b);}map.append(accessible);
 const side=node('aside',null,'coastal-sidebar'),mission=node('h3','Your mission'),count=node('strong'),bar=node('progress');bar.max=5;
 const task=node('p'),wallet=node('p',null,'coastal-wallet'),pressure=node('p');side.append(mission,task,count,bar,wallet,pressure);
 const tools=node('div',null,'coastal-tools coastal-vehicle-dock'),toolButtons=[],vehicleNames=vehicleLabels;
 function vehiclePicture(type,level,large=false){const image=node('img'),preview=document.createElement('canvas');preview.width=['rail','highspeed','tunnel'].includes(type)?340:type==='flight'?170:type==='ferry'?150:120;preview.height=type==='flight'?170:90;const c=preview.getContext('2d');const scale=type==='flight'?2.8:type==='ferry'?2.3:2.5;c.translate(preview.width/2+(['rail','highspeed','tunnel'].includes(type)?(1+Math.min(2,level-1))*15*scale:0),preview.height/2);c.scale(scale,scale);art.vehicle(c,type,0,0,0,0,level,false);image.src=preview.toDataURL();image.alt=vehicleNames[type]+' · Level '+level;image.className=large?'coastal-vehicle-portrait':'coastal-vehicle-picture';return image;}
 for(const [type,label,description]of [['road','Bus','Flexible routes on land.'],['rail','Train','Land routes from round 8.'],['highspeed','High-speed train','Fast land routes from round 20.'],['ferry','Boat','Connect the ports across the sea.'],['flight','Flight','Airports open in round 13.'],['tunnel','Tunnel train','Folkestone–Coquelles from round 18.']]){
  const tile=node('div',null,'coastal-vehicle-tile'),b=node('button',null,'coastal-tool');b.type='button';b.dataset.tool=type;b.style.setProperty('--route',colours[type]);b.append(vehiclePicture(type,state.levels[type]),node('strong'));b.setAttribute('aria-label','Select '+label);b.title=label+' · '+description;
  b.onclick=()=>{state.tool=type;state.selected=null;toast.hidden=true;rejected=null;message.dataset.kind='info';message.textContent='Choose two stops for your '+label.toLowerCase()+'.';refresh();};const info=node('button','i','coastal-vehicle-info');info.type='button';info.dataset.vehicleInfo=type;info.setAttribute('aria-label',label+' stats and upgrades');info.onclick=()=>openVehicle(type);tile.append(b,info);tools.append(tile);toolButtons.push(b);
 }
 map.append(tools);
 const message=node('p','Choose a transport type, then tap two stops.','coastal-message');message.setAttribute('role','status');side.append(message);
 const inspector=node('div',null,'coastal-inspector'),stationName=node('strong'),stationInfo=node('p'),stationUpgrade=node('button');stationUpgrade.type='button';stationUpgrade.onclick=()=>{if(inspected!==null&&upgradeTerminal(state,inspected)){effect(inspected,'UPGRADED');refresh();}};inspector.append(stationName,stationInfo,stationUpgrade);inspector.hidden=true;side.insertBefore(inspector,message);
 const stationFigure=node('figure',null,'coastal-station-figure'),stationPicture=node('img'),stationCaption=node('figcaption');stationPicture.decoding='async';stationFigure.append(stationPicture,stationCaption);inspector.insertBefore(stationFigure,stationInfo);
 const stationDialog=node('dialog',null,'coastal-shop coastal-station-shop'),stationClose=node('button','Close station ×'),buildButtons=[];
 stationClose.type='button';stationClose.onclick=()=>stationDialog.close();stationDialog.append(stationClose,inspector);root.append(stationDialog);
 const stationTiers=node('div',null,'coastal-vehicle-tiers coastal-station-tiers');stationUpgrade.remove();inspector.append(node('h4','Terminal upgrades'),stationTiers);let stationTierKey='';
 function stationUpgradePicture(kind,level=1){const img=node('img',null,'coastal-upgrade-picture');img.src=stationUpgradeArtwork(kind,level);img.alt=kind==='terminal'?'Terminal · Level '+level:kind==='port'?'Harbour and ferry':'Airport and plane';return img;}
 const construction=node('div',null,'coastal-construction');inspector.append(construction);
 for(const [kind,label]of [['port','harbour'],['airport','airport']]){const b=node('button');b.type='button';b.dataset.build=kind;b.append(stationUpgradePicture(kind),node('span'));b.onclick=()=>{if(buildFacility(state,inspected,kind)){effect(inspected,'NEW '+label.toUpperCase());refresh();}};construction.append(b);buildButtons.push(b);}
 const routeFrom=node('button','Build a route from here');routeFrom.type='button';routeFrom.onclick=()=>{state.selected=inspected;stationDialog.close();message.textContent='Drag from this stop, or use another keyboard stop button.';refresh();};inspector.append(routeFrom);
 let resumeStation=false;stationDialog.addEventListener('close',()=>{if(resumeStation&&!state.complete&&!state.failed)state.running=true;resumeStation=false;refresh();});
 const cardDialog=node('dialog',null,'coastal-card-dialog'),cardTitle=node('h3'),cardIntro=node('p'),cardGrid=node('div',null,'coastal-card-grid');cardDialog.append(cardTitle,cardIntro,cardGrid);cardDialog.setAttribute('aria-label','Choose round cards');cardDialog.addEventListener('cancel',e=>e.preventDefault());const discovery=node('aside',null,'coastal-discovery');cardDialog.append(discovery);root.append(cardDialog);
 function openCards(){if(state.cardPhase==='done'){beginRound();return;}if(!['good','bad'].includes(state.cardPhase))return;cardTitle.textContent=state.cardPhase==='good'?'Choose one benefit':'Choose one challenge';cardIntro.textContent=state.cardPhase==='good'?'Pick 1 of 3 good cards. Then pick 1 of 3 bad cards. Both last for this run.':'Pick the challenge you want to face. The next round begins after this choice.';state.discovery??=discoveryForRound(state.round+1,state.rng);const fact=state.discovery;discovery.replaceChildren(node('strong',fact.title+(fact.newlyUnlocked?' · Round '+(state.round+1):'')),node('p',fact.text));const source=node('a','Explore this place ↗');source.href=fact.source;source.target='_blank';source.rel='noopener';discovery.append(source);cardGrid.replaceChildren();const deck=state.cardPhase==='good'?goodCards:badCards;for(const id of state.cardOffers){const card=deck.find(c=>c.id===id),b=node('button',null,'coastal-choice '+state.cardPhase);b.type='button';b.dataset.card=id;b.append(cardPicture(id),node('span',state.cardPhase==='good'?'BENEFIT':'CHALLENGE'),node('strong',card.name),node('p',card.description));b.onclick=()=>{if(chooseCard(state,id)){if(state.cardPhase==='done'){cardDialog.close();beginRound();}else openCards();refresh();}};cardGrid.append(b);}if(!cardDialog.open)cardDialog.showModal();}
 function beginRound(){if(!nextRound(state))return;celebration.hidden=true;completionShown=false;fitMap();message.textContent='New stop opened! Drag routes to connect it, then press Play.';refresh();}
 const fleet=node('dialog',null,'coastal-shop coastal-vehicle-shop'),fleetClose=node('button','Close upgrades ×'),fleetContent=node('div');fleetClose.type='button';fleetClose.onclick=()=>fleet.close();fleet.append(fleetClose,fleetContent);root.append(fleet);let vehicleType='road',resumeFleet=false,fleetKey='';
 function openVehicle(type){vehicleType=type;resumeFleet=state.running;state.running=false;fleetKey='';refresh();fleet.showModal();}
 fleet.addEventListener('close',()=>{if(resumeFleet&&!state.complete&&!state.failed)state.running=true;resumeFleet=false;refresh();});
 function refreshFleet(){if(!fleet.open&&fleetKey)return;const type=vehicleType,key=JSON.stringify([type,state.levels,state.mods,state.cardHistory,state.credits,state.round]);if(key===fleetKey)return;fleetKey=key;const level=state.levels[type],stats=vehicleStats(state,type),name=vehicleNames[type];fleet.setAttribute('aria-label',name+' stats and upgrades');fleetContent.replaceChildren(node('h3',name+' · Level '+level),vehiclePicture(type,level,true));
  const description={highspeed:'High-speed land service. Uses train card bonuses. Available from round 20.',tunnel:'Rail service beneath the English Channel, linking Folkestone and Coquelles. Uses train card bonuses. Available from round 18.',road:'Flexible land routes between stops on the same land.',rail:'Fast land routes. Available from round 8.',ferry:'Sea crossings between harbours on different land.',flight:'Air routes between two airports.'};fleetContent.append(node('p',description[type]));
  const statsGrid=node('dl',null,'coastal-vehicle-stats');for(const [label,value]of [['Seats',stats.capacity],['Speed',Math.round(stats.speed)+' map units/s'],['New route',routeCost(state,type)+' credits'],['Fleet',state.links.filter(l=>l.type===type).length+' vehicles'],['Delivery fare',fare(state)+' credits'],['Route refund',Math.round(refundRate(state)*100)+'%']])statsGrid.append(node('dt',label),node('dd',String(value)));fleetContent.append(statsGrid,node('h4','Active card modifiers'));
  const keys=[...(['highspeed','tunnel'].includes(type)?['railCost','railSpeed','railSeats']:[]),type+'Cost',type+'Speed',type+'Seats','allCost','allSpeed','seats','upgradeCost','fare','refund'],cards=state.cardHistory.map(h=>({...h,card:[...goodCards,...badCards].find(c=>c.id===h.id)})).filter(h=>h.card&&keys.some(k=>h.card.effects[k]));const modifiers=node('div',null,'coastal-vehicle-modifiers');if(!cards.length)modifiers.append(node('p','No active cards affect this vehicle.'));for(const h of cards){const row=node('p');row.dataset.kind=h.kind;row.append(cardPicture(h.id),node('strong',h.name+' · '),document.createTextNode(h.description));modifiers.append(row);}fleetContent.append(modifiers,node('h4','Fleet upgrades'),node('p','Each level adds one seat and 30% of base speed to every vehicle of this type. Colours and level badges show your upgrades.'));
  const tiers=node('div',null,'coastal-vehicle-tiers');for(let target=1;target<=4;target++){const sample={...state,levels:{...state.levels,[type]:target}},values=vehicleStats(sample,type),card=node('article',null,'coastal-vehicle-tier');card.dataset.installed=String(target<=level);card.append(vehiclePicture(type,target),node('strong','Level '+target),node('p',values.capacity+' seat'+(values.capacity===1?'':'s')+' · '+Math.round(values.speed)+' speed'));if(target<=level)card.append(node('span',target===level?'Current fleet':'Installed'));else{const cost=vehicleUpgradeCost({...state,levels:{...state.levels,[type]:target-1}},type),b=node('button');b.type='button';b.dataset.upgrade=type;b.dataset.level=target;const locked=!vehicleUnlocked(state,type);b.textContent=locked?'Unlocks round '+unlockRounds[type]:target>level+1?'Requires level '+(target-1)+' · '+cost+' credits':state.credits<cost?'Need '+(cost-state.credits)+' more · '+cost+' credits':'Upgrade to level '+target+' · '+cost+' credits';b.disabled=target>level+1||state.credits<cost||locked;b.onclick=()=>{if(upgradeVehicle(state,type)){message.textContent=name+' upgraded!';refresh();}};card.append(b);}tiers.append(card);}fleetContent.append(tiers);
 }
 const routes=node('details',null,'coastal-upgrades'),routeList=node('div');routes.append(node('summary','Manage routes · 75% refund'),routeList);side.append(routes);
 function informationModal(label,cls){const dialog=node('dialog',null,'coastal-shop '+cls),close=node('button','Close '+label.toLowerCase()+' ×'),content=node('div'),launch=node('button',label);let resume=false;dialog.setAttribute('aria-label',label);close.type='button';close.onclick=()=>dialog.close();dialog.append(close,node('h3',label),content);root.append(dialog);launch.type='button';launch.onclick=()=>{resume=state.running;state.running=false;refresh();dialog.showModal();};side.append(launch);dialog.addEventListener('close',()=>{if(resume&&!state.complete&&!state.failed)state.running=true;resume=false;refresh();});return {dialog,content,launch};}
 const mapKey=informationModal('Map key · countries and capitals','coastal-map-key-shop'),atlasList=mapKey.content;atlasList.className='coastal-map-key-grid';
 const learningUI=installLearningUI({root,map,side,state,node,refresh});
 const runCards=informationModal('Your run cards','coastal-run-shop'),history=runCards.content;history.className='coastal-run-gallery';
 const controls=node('div',null,'coastal-controls');
 function button(label,action){const b=node('button',label);b.type='button';b.onclick=action;controls.append(b);return b;}
 async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(root.requestFullscreen)await root.requestFullscreen();else feedback('Fullscreen is unavailable in this browser.','Try opening the game in a desktop browser.','warning');}catch{feedback('Fullscreen could not open.','Try opening the game in a separate browser tab.','warning');}}
 const play=button('▶ Play',()=>{if(state.complete||state.failed)return;if(!state.links.length){feedback('Build a route first.','Choose Bus, then drag London to Oxford.','warning');return;}state.running=true;message.textContent='Earn 15 credits per delivery. Clear red stops before their 10-second countdown ends.';refresh();});
 const pause=button('Ⅱ Pause',()=>{state.running=false;refresh();});
 button('↶ Undo',()=>{removeRoute(state,state.links.length-1);refresh();});
 const remove=button('Remove routes',()=>{removing=!removing;state.selected=null;message.textContent=removing?'Tap a route to sell it for 75% of its purchase price.':'Choose two stops to buy a route.';refresh();});
 button('↻ Reset',()=>{Object.assign(state,createGameState());completionShown=false;celebration.hidden=true;inspected=null;toast.hidden=true;rejected=null;message.textContent='Start with a 20-credit bus between London and Oxford.';refresh();});
 const speed=button('1× speed',()=>{state.speed=state.speed===1?2:1;refresh();});
 const fullscreen=button('⛶ Fullscreen',toggleFullscreen);fullscreen.title='Toggle fullscreen (F)';fullscreen.setAttribute('aria-pressed','false');
 const fullscreenChanged=()=>{const active=document.fullscreenElement===root;fullscreen.textContent=active?'⛶ Exit fullscreen':'⛶ Fullscreen';fullscreen.setAttribute('aria-pressed',String(active));draw();};document.addEventListener('fullscreenchange',fullscreenChanged);
 const next=button('Choose round cards →',()=>{celebration.hidden=true;openCards();});
 const retry=button('Retry round',()=>{nextRound(state,true);completionShown=false;message.textContent='Back to the start of this round. Improve your network and try again.';refresh();});
 const challenge=node('button','Ferry challenge','coastal-challenge');challenge.type='button';challenge.onclick=()=>{
  state.ferryClosed=!state.ferryClosed;
  message.textContent=state.ferryClosed?'The ferry is cancelled! Its passengers wait onboard. Build an airport route or reopen it.':'The ferry is open again.';refresh();
 };controls.append(challenge);
 const attribution=node('small',null,'coastal-map-attribution');attribution.append(document.createTextNode('Map: Eurostat / geoBoundaries · © '));const osm=node('a','OpenStreetMap contributors');osm.href='https://www.openstreetmap.org/copyright';osm.target='_blank';osm.rel='noopener';attribution.append(osm,document.createTextNode(' · Natural Earth'));
 body.append(map,side);root.append(head,body,controls,node('p','★ Capital · Bus / trains: land · Boat: sea · Flight: air · Tunnel: Channel · North is up · Zoom in for city and landmark labels','coastal-legend'),attribution);
 const tutorialUI=installTutorial({root,map,side,controls,state,node,refresh});
 function connect(a,b){
  const tutorial=state.tutorial;if(tutorial.status==='active'&&tutorial.mode==='guided'&&[1,4].includes(tutorial.step)){const [first,last]=tutorial.step===1?[0,1]:[1,2];if(!((a===first&&b===last)||(a===last&&b===first))){state.selected=null;feedback('Follow the highlighted tutorial route.','Connect '+stops[first].name+' to '+stops[last].name+'. No credits were spent.','warning');refresh();return;}}
  const issue=routeIssue(state,a,b,state.tool);state.selected=null;
  if(issue){rejected={a,b,until:performance.now()+2400};feedback(issue.message,issue.hint);refresh();return;}
  buyRoute(state,a,b,state.tool);rejected=null;effect(a,'CONNECTED',colours[state.tool]);effect(b,'CONNECTED',colours[state.tool]);feedback('Route built · '+routeCost(state,state.tool)+' credits',state.tool==='ferry'&&state.ferryClosed?'The ferry is closed. Reopen it to carry passengers.':state.running?'Passengers can use this route now.':'Press Play when your network is ready.',state.tool==='ferry'&&state.ferryClosed?'warning':'success');refresh();
 }
 function select(id){if(state.selected!==null&&state.selected!==id){connect(state.selected,id);return;}inspected=id;resumeStation=state.running;state.running=false;stationDialog.setAttribute('aria-label',stops[id].name+' station upgrades');refresh();stationDialog.showModal();}
 let dragStart=null,pointer=null,dragOrigin=null,moved=false,panMode=false,pinch=null;
 const pointers=new Map();
 const screen=e=>{const r=canvas.getBoundingClientRect(),scale=Math.min(r.width/1000,r.height/600);return {x:(e.clientX-r.left-(r.width-1000*scale)/2)/scale,y:(e.clientY-r.top-(r.height-600*scale)/2)/scale};};
 const world=p=>({x:(p.x-state.camera.x)/state.camera.zoom,y:(p.y-state.camera.y)/state.camera.zoom});
 const nearest=p=>stops.filter(s=>state.activeStops.includes(s.id)&&Math.hypot(s.x-p.x,s.y-p.y)<24/state.camera.zoom).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]?.id??null;
 function zoomMap(factor,anchor={x:500,y:300}){const p=world(anchor),zoom=Math.max(.3,Math.min(3,state.camera.zoom*factor));state.camera={zoom,x:anchor.x-p.x*zoom,y:anchor.y-p.y*zoom};draw();}
 function fitMap(){const {left,right,top,bottom}=geographyBounds(state.round),zoom=Math.min(1.8,850/(right-left),450/(bottom-top));state.camera={zoom,x:500-(left+right)/2*zoom,y:310-(top+bottom)/2*zoom};draw();}
 const mapTools=node('div',null,'coastal-map-tools');
 for(const [label,action]of [['Zoom in',()=>zoomMap(1.2)],['Zoom out',()=>zoomMap(1/1.2)],['Fit map',()=>fitMap()],['Pan map',()=>{panMode=!panMode;panButton.setAttribute('aria-pressed',String(panMode));}]]){const b=node('button',label);b.type='button';b.onclick=action;mapTools.append(b);}const panButton=mapTools.lastChild;map.append(mapTools);
 canvas.onwheel=e=>{e.preventDefault();zoomMap(e.deltaY<0?1.12:1/1.12,screen(e));};
 canvas.onpointerdown=e=>{const p=screen(e);rejected=null;toast.hidden=true;pointers.set(e.pointerId,p);canvas.setPointerCapture(e.pointerId);if(pointers.size===2){const [a,b]=[...pointers.values()];pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom:state.camera.zoom};dragStart=null;return;}dragStart=panMode?null:nearest(world(p));pointer=world(p);dragOrigin=p;moved=false;};
 canvas.onpointermove=e=>{if(!pointers.has(e.pointerId))return;const p=screen(e),prior=pointers.get(e.pointerId);pointers.set(e.pointerId,p);if(pointers.size===2&&pinch){const [a,b]=[...pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);zoomMap(pinch.zoom*distance/pinch.distance/state.camera.zoom,{x:(a.x+b.x)/2,y:(a.y+b.y)/2});return;}if(Math.hypot(p.x-dragOrigin.x,p.y-dragOrigin.y)>5)moved=true;if(dragStart!==null){pointer=world(p);draw();}else if(moved){state.camera.x+=p.x-prior.x;state.camera.y+=p.y-prior.y;draw();}};
 canvas.onpointerup=e=>{if(!pointers.has(e.pointerId))return;const p=world(screen(e)),end=nearest(p),start=dragStart,wasPinch=Boolean(pinch);pointers.delete(e.pointerId);if(wasPinch){if(!pointers.size)pinch=null;dragStart=null;return;}dragStart=null;pointer=null;if(removing&&!moved){const index=state.links.findIndex(l=>{const a=stops[l.a],b=stops[l.b],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)<14/state.camera.zoom;});removeRoute(state,index);refresh();}else if(start!==null&&end!==null&&start!==end&&moved)connect(start,end);else if(start!==null&&moved){if(end===start)connect(start,end);else{feedback('Route not built.','Drop on a stop to connect it. Your credits have not been spent.');draw();}}else if(end!==null&&!moved&&!panMode)select(end);else draw();};
 canvas.onpointercancel=e=>{const cancelled=dragStart!==null&&moved&&!pinch;pointers.delete(e.pointerId);dragStart=null;pointer=null;pinch=null;toast.hidden=true;if(cancelled)feedback('Route cancelled.','No credits were spent. Try dragging again.','warning');draw();};
 function shape(kind,x,y,size,fill,stroke='#112d4d'){
  ctx.beginPath();if(kind==='circle')ctx.arc(x,y,size,0,Math.PI*2);else if(kind==='square')ctx.rect(x-size,y-size,size*2,size*2);else if(['diamond','hexagon','pentagon','star'].includes(kind)){const n={diamond:4,hexagon:6,pentagon:5,star:10}[kind];for(let i=0;i<n;i++){const angle=-Math.PI/2+i*Math.PI*2/n,r=size*(kind==='star'&&i%2?.5:1.15);ctx.lineTo(x+Math.cos(angle)*r,y+Math.sin(angle)*r);}ctx.closePath();}else {ctx.moveTo(x,y-size*1.15);ctx.lineTo(x+size,y+size);ctx.lineTo(x-size,y+size);ctx.closePath();}
  ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();
 }
 function text(value,x,y,size=18,colour='#112d4d',align='center'){ctx.font=`${size}px system-ui`;ctx.fillStyle=colour;ctx.textAlign=align;ctx.fillText(value,x,y);}
 function land(){drawGeography(ctx,state,visualTime);}
 function draw(){
  ctx.fillStyle='#94cfdc';ctx.fillRect(0,0,1000,600);ctx.save();ctx.translate(state.camera.x,state.camera.y);ctx.scale(state.camera.zoom,state.camera.zoom);
  land();
  tutorialUI.draw(ctx,stops);
  for(const link of state.links){const a=stops[link.a],b=stops[link.b],closed=link.type==='ferry'&&state.ferryClosed;
   ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='#fffdf8b0';ctx.lineWidth=12;ctx.setLineDash([]);ctx.stroke();ctx.strokeStyle=closed?'#b96a58':colours[link.type];ctx.lineWidth=6;ctx.setLineDash(['road','rail','highspeed'].includes(link.type)?[]:[8,10]);ctx.lineDashOffset=link.type==='ferry'&&!reducedMotion?-visualTime*8:0;ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;
   if(link.type==='tunnel')text('Channel Tunnel',(a.x+b.x)/2,(a.y+b.y)/2-28,12/state.camera.zoom,'#7b4d88');
   if(['rail','highspeed','tunnel'].includes(link.type)){const length=Math.hypot(b.x-a.x,b.y-a.y),nx=-(b.y-a.y)/length,ny=(b.x-a.x)/length;ctx.strokeStyle='#74584b';ctx.lineWidth=2;for(let d=30;d<length-25;d+=12){const x=a.x+(b.x-a.x)*d/length,y=a.y+(b.y-a.y)*d/length;ctx.beginPath();ctx.moveTo(x-nx*6,y-ny*6);ctx.lineTo(x+nx*6,y+ny*6);ctx.stroke();}ctx.strokeStyle='#fff1d5';ctx.lineWidth=1;for(const side of [-2,2]){ctx.beginPath();ctx.moveTo(a.x+nx*side,a.y+ny*side);ctx.lineTo(b.x+nx*side,b.y+ny*side);ctx.stroke();}}
   if(link.type==='road'){ctx.strokeStyle='#b9e1dc';ctx.lineWidth=1;ctx.setLineDash([4,10]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);}
   const t=link.direction===1?link.position:1-link.position,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
   if(!closed){const transit=trainStationVisual(link.type,state.levels[link.type],link.position,Math.hypot(b.x-a.x,b.y-a.y));art.vehicle(ctx,link.type,x,y,Math.atan2((b.y-a.y)*link.direction,(b.x-a.x)*link.direction),visualTime,state.levels[link.type],state.running,transit);
    ctx.save();if(transit)ctx.globalAlpha=Math.min(1,transit.visible/24);
    for(let i=0;i<link.cargo.length;i++)shape(stops[state.passengers[link.cargo[i]].destination].shape,x-16+i*12,y-20,5,'#fffdf8',colours[link.type]);ctx.restore();
   }
  }
  if(dragStart!==null&&pointer&&moved){const target=nearest(pointer),issue=target!==null?routeIssue(state,dragStart,target,state.tool):null,end=target===null?pointer:stops[target],colour=issue?'#c04436':target===null?colours[state.tool]:'#218454';ctx.beginPath();ctx.moveTo(stops[dragStart].x,stops[dragStart].y);ctx.lineTo(end.x,end.y);ctx.strokeStyle=colour;ctx.lineWidth=5;ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);if(target!==null){ctx.beginPath();ctx.arc(end.x,end.y,32,0,Math.PI*2);ctx.stroke();const title=issue?.message??'Release to build · '+routeCost(state,state.tool)+' credits',hint=issue?.hint??'Your route will connect these two stops.';if(toast.firstChild?.textContent!==((issue?'✕ ':'➜ ')+title))feedback(title,hint,issue?'error':'preview',true);}else if(toast.dataset.kind==='preview'||toast.dataset.kind==='error'){toast.hidden=true;}}
  if(rejected&&performance.now()<rejected.until){const a=stops[rejected.a],b=stops[rejected.b];ctx.save();ctx.strokeStyle='#c04436';ctx.lineWidth=4;ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);for(const s of [a,b]){ctx.beginPath();ctx.arc(s.x,s.y,32,0,Math.PI*2);ctx.stroke();}const x=(a.x+b.x)/2,y=(a.y+b.y)/2;ctx.fillStyle='#fff8f1';ctx.beginPath();ctx.arc(x,y,17,0,Math.PI*2);ctx.fill();text('×',x,y+8,28,'#c04436');ctx.restore();}
  const labels=[];
  for(const stop of [...stops].sort((a,b)=>Number(b.capital)-Number(a.capital))){
   if(!state.activeStops.includes(stop.id))continue;
   const birth=visualTime-(stationBirth.get(stop.id)??-10);
   if(birth<2&&!reducedMotion){ctx.beginPath();ctx.arc(stop.x,stop.y,28+birth*25,0,Math.PI*2);ctx.strokeStyle=`rgba(19,124,131,${1-birth/2})`;ctx.lineWidth=3;ctx.stroke();text('NEW STOP',stop.x,stop.y-45,14,'#137c83');}
   if(state.selected===stop.id){ctx.beginPath();ctx.arc(stop.x,stop.y,23+(reducedMotion?0:Math.sin(visualTime*5)*2),0,Math.PI*2);ctx.strokeStyle='#e3ad41';ctx.lineWidth=3;ctx.stroke();}
   ctx.save();ctx.shadowColor='#224f4918';ctx.shadowBlur=3;ctx.shadowOffsetY=1;shape(stop.shape||'square',stop.x,stop.y,14,'rgba(255,253,248,.5)');ctx.restore();
   if(stop.kind==='airport'||state.facilities[stop.id]?.includes('airport'))text('✈',stop.x,stop.y+6,17);
   if(stop.kind==='port'||state.facilities[stop.id]?.includes('port'))text('⚓',stop.x+21,stop.y+5,14,'#137c83');
   if(stop.capital||state.camera.zoom>=.55){const label=(stop.capital?'★ ':'')+stop.name,z=state.camera.zoom,font=12/z,h=19/z;ctx.font=font+'px system-ui';const w=ctx.measureText(label).width+12/z;let bx=stop.x-w/2,by=stop.y+29;for(const [dx,dy]of [[-w/2,29],[-w/2,-35-h],[25/z,-h/2],[-w-25/z,-h/2],[-w/2,50/z],[-w/2,-65/z-h]]){bx=stop.x+dx;by=stop.y+dy;if(!labels.some(r=>bx<r.x+r.w&&bx+w>r.x&&by<r.y+r.h&&by+h>r.y))break;}labels.push({x:bx,y:by,w,h});ctx.strokeStyle='#75908280';ctx.lineWidth=1/z;ctx.beginPath();ctx.moveTo(stop.x,stop.y);ctx.lineTo(bx+w/2,by+h/2);ctx.stroke();ctx.fillStyle='#fffdf8ee';ctx.beginPath();ctx.roundRect(bx,by,w,h,5/z);ctx.fill();text(label,bx+w/2,by+14/z,font);}
   const queue=state.passengers.filter(p=>p.mode==='waiting'&&p.at===stop.id);
   queue.forEach((p,i)=>shape(stops[p.destination].shape||'square',stop.x-18+(i%6)*15,stop.y+62+Math.floor(i/6)*16,6,colours.ferry));
   if(state.danger[stop.id]>0){ctx.beginPath();ctx.arc(stop.x,stop.y,32,0,Math.PI*2);ctx.lineWidth=5;ctx.strokeStyle=reducedMotion?'#d34e42':`rgba(211,78,66,${.55+.45*Math.sin(visualTime*Math.PI*2)})`;ctx.stroke();text(Math.ceil(stationStats(state,stop.id).alarm-state.danger[stop.id])+'s TO CLEAR',stop.x,stop.y-38,14,'#b73832');}
  }
  if(state.ferryClosed){text('Ferries paused',stops[14].x+80,stops[14].y-40,18/state.camera.zoom,'#a44932');}
  for(let i=effects.length-1;i>=0;i--){const e=effects[i],age=visualTime-e.born;if(age>1.4){effects.splice(i,1);continue;}const s=stops[e.id];ctx.save();ctx.globalAlpha=1-age/1.4;ctx.beginPath();ctx.arc(s.x,s.y,24+age*22,0,Math.PI*2);ctx.strokeStyle=e.colour;ctx.lineWidth=3;ctx.stroke();text(e.label,s.x,s.y-35-age*25,15,e.colour);ctx.restore();}
  ctx.restore();
  if(state.complete&&!reducedMotion){const age=visualTime-(stationBirth.get('celebrate')??-10);if(age<5)for(let i=0;i<90;i++){const x=(i*79)%1000+Math.sin(age+i)*18,y=-160+age*160+(i*29)%180;ctx.save();ctx.translate(x,y);ctx.rotate(age*2+i);ctx.fillStyle=['#e5b348','#137c83','#e98771','#8261ae'][i%4];ctx.fillRect(-3,-3,6,9);ctx.restore();}}
  if(state.failed){ctx.fillStyle='#fffdf8f5';ctx.beginPath();ctx.roundRect(230,220,540,140,24);ctx.fill();text('Network stopped',500,263,28,'#b73832');text(state.lossReason,500,305,18);text('Choose Retry round to try a new plan.',500,337,17);}
  if(!toast.hidden&&dragStart===null&&performance.now()>feedbackUntil)toast.hidden=true;
 }
 function refresh(){
  if(inspected!==null&&stationPicture.dataset.stop!==String(inspected)){const art=stationArt[inspected];stationPicture.dataset.stop=inspected;stationPicture.src=stationArtUrl(inspected);stationPicture.alt=art.city+' illustration featuring '+art.landmark;stationCaption.textContent=art.landmark+' · '+art.city;}
  tutorialUI.refresh();
  learningUI.refresh();
  if(state.round!==previousRound||state.delivered<previousDelivered){previousPassengers.clear();effects.length=0;previousRound=state.round;}
  for(const id of state.activeStops)if(!stationBirth.has(id))stationBirth.set(id,visualTime);
  for(const p of state.passengers){const prior=previousPassengers.get(p.id);if(prior&&prior!==p.mode)effect(p.at,p.mode==='delivered'?'+'+fare(state)+' CREDITS':p.mode==='riding'?'BOARDING':'TRANSFER',p.mode==='delivered'?'#137c83':'#b88128');else if(!prior&&state.round>1)effect(p.at,'NEW PASSENGER');previousPassengers.set(p.id,p.mode);}
  if(state.delivered===state.target&&previousDelivered!==state.delivered)stationBirth.set('celebrate',visualTime);previousDelivered=state.delivered;
  money.textContent='● '+state.credits+' credits';clock.textContent='Round '+state.round+' · '+Math.ceil(Math.max(0,roundDuration(state)-state.elapsed))+'s left';const warning=Math.min(...state.activeStops.filter(id=>state.danger[id]>0).map(id=>stationStats(state,id).alarm-state.danger[id]));alarm.textContent=state.pressure>0?'⚠ CLEAR QUEUE: '+Math.max(0,Math.ceil(warning))+'s':'';alarm.hidden=state.pressure===0;
  if(state.complete&&!completionShown){completionShown=true;celebration.hidden=false;goldStars.textContent='★'.repeat(state.stars)+'☆'.repeat(3-state.stars);result.textContent='Round '+state.round+' complete · '+state.delivered+' passengers delivered';bonus.textContent=state.roundIncome+' delivery credits · Choose a benefit and a challenge';continueButton.textContent='Choose round cards →';}
  if(inspected!==null){const level=state.terminals[inspected],stats=stationStats(state,inspected);inspector.hidden=false;stationName.textContent=stops[inspected].name+' · Level '+level;stationInfo.textContent=regions.find(r=>r.id===stops[inspected].region).name+' · '+stats.queue+' queue spaces · '+stats.patience+' seconds of patience. Upgrade adds 3 queue spaces and 10 seconds of patience.';stationUpgrade.textContent=level===4?'Terminal fully upgraded':'Upgrade terminal · '+terminalUpgradeCost(state,inspected)+' credits';stationUpgrade.disabled=level===4||state.credits<terminalUpgradeCost(state,inspected);for(const b of buildButtons){const kind=b.dataset.build,exists=stops[inspected].kind===kind||state.facilities[inspected]?.includes(kind);b.querySelector('span').textContent=exists?(kind==='port'?'Harbour built':'Airport built'):'Build '+(kind==='port'?'harbour':'airport')+' · '+facilityCost(state,kind)+' credits';const locked=state.round<(kind==='port'?10:13);if(locked)b.querySelector('span').textContent=(kind==='port'?'Harbours':'Airports')+' unlock in round '+(kind==='port'?10:13);else if(kind==='port'&&!stops[inspected].coastal)b.querySelector('span').textContent='A harbour needs a coastal stop';b.disabled=exists||locked||(kind==='port'&&!stops[inspected].coastal)||state.credits<facilityCost(state,kind);}}else inspector.hidden=true;
  if(inspected!==null){const key=JSON.stringify([inspected,state.terminals[inspected],state.credits,state.mods]);if(key!==stationTierKey){stationTierKey=key;stationTiers.replaceChildren();const level=state.terminals[inspected];for(let target=1;target<=4;target++){const sample={...state,terminals:{...state.terminals,[inspected]:target}},stats=stationStats(sample,inspected),tier=node('article',null,'coastal-vehicle-tier');tier.dataset.installed=String(target<=level);tier.append(stationUpgradePicture('terminal',target),node('strong','Level '+target),node('p',stats.queue+' queue spaces · '+stats.patience+'s patience'));if(target<=level)tier.append(node('span',target===level?'Current terminal':'Installed'));else if(target===level+1)tier.append(stationUpgrade);else tier.append(node('span','Requires level '+(target-1)));stationTiers.append(tier);}}}
  const historyKey=state.cardHistory.map(c=>c.id).join('|');if(history.dataset.key!==historyKey){history.dataset.key=historyKey;history.replaceChildren();runCards.launch.textContent='Your run cards · '+state.cardHistory.length;if(!state.cardHistory.length)history.append(node('p','Your collection starts after round 1. Choose one benefit and one challenge after each round. Their effects last for this run.','coastal-empty-cards'));for(const kind of ['good','bad']){const cards=state.cardHistory.filter(c=>c.kind===kind);if(!cards.length)continue;const group=node('section',null,'coastal-run-group'),grid=node('div',null,'coastal-run-grid');group.dataset.kind=kind;group.append(node('h4',(kind==='good'?'✓ Benefits':'⚠ Challenges')+' · '+cards.length),node('p',kind==='good'?'Your advantages for this run':'Plan your network around these challenges'));for(const c of cards){const row=node('article',null,'coastal-run-art-card');row.dataset.kind=kind;row.append(cardPicture(c.id),node('span',kind==='good'?'BENEFIT':'CHALLENGE'),node('h4',c.name),node('p',c.description));const copies=cards.filter(other=>other.id===c.id).length;if(copies>1)row.append(node('small','Chosen '+copies+' times · effects stack'));grid.append(row);}group.append(grid);history.append(group);}}
  remove.setAttribute('aria-pressed',String(removing));routes.firstChild.textContent='Manage routes · '+Math.round(refundRate(state)*100)+'% refund';const listKey=refundRate(state)+'|'+state.links.map(l=>[l.a,l.b,l.type,l.paid].join('-')).join('|');if(listKey!==routeListKey){routeListKey=listKey;routeList.replaceChildren();state.links.forEach((l,i)=>{const b=node('button','Sell '+stops[l.a].name+' ↔ '+stops[l.b].name+' · +'+Math.floor((l.paid??prices[l.type])*refundRate(state)));b.type='button';b.onclick=()=>{removeRoute(state,i);refresh();};routeList.append(b);});}
  mission.textContent='Round '+state.round;if(atlasList.dataset.round!==String(state.round)){atlasList.dataset.round=state.round;atlasList.replaceChildren();for(const r of regions.filter(r=>r.round<=state.round)){const card=node('article',null,'coastal-map-key-card'),flag=node('img');flag.src=flagUrl(r.id);flag.alt=r.name+' flag';card.append(flag,node('h4',r.name),node('strong','★ Capital · '+r.capital));atlasList.append(card);}atlasList.append(node('p','England, Wales, Scotland and Northern Ireland form the UK. The Republic of Ireland is a separate country. Explore Country atlas for landmarks and facts.','coastal-map-key-note'));}challenge.disabled=state.round<10;task.textContent='Deliver '+state.target+' passengers. '+(state.round>1?'Passengers visit every stop; arrivals every '+arrivalInterval(state).toFixed(1)+' seconds.':'Drag London → Oxford to buy a bus. Local deliveries fund Bristol.');
  count.textContent=state.delivered+' / '+state.target+' delivered';bar.max=state.target;bar.value=state.delivered;wallet.textContent='+'+fare(state)+' credits per delivery';pressure.textContent=state.pressure>0?'Clear the blinking stop in '+Math.max(0,Math.ceil(warning))+'s!':'Drag stops to connect · Tap stops to upgrade · Drag water to pan';pressure.style.color=state.pressure>0?'#b73832':'';
  play.disabled=state.running||state.complete||state.failed;pause.disabled=!state.running;speed.textContent=state.speed+'× speed';challenge.textContent=state.ferryClosed?'Reopen ferry':'Ferry challenge';next.hidden=!state.complete;retry.hidden=!state.failed;
  toolButtons.forEach(b=>{const type=b.dataset.tool;b.setAttribute('aria-pressed',String(type===state.tool));b.disabled=!vehicleUnlocked(state,type);b.title=vehicleNames[type]+(!vehicleUnlocked(state,type)?' · Unlocks round '+unlockRounds[type]:'');b.querySelector('strong').textContent=routeCost(state,type);if(b.dataset.level!==String(state.levels[type])){b.dataset.level=state.levels[type];b.querySelector('img').replaceWith(vehiclePicture(type,state.levels[type]));}});refreshFleet();
  for(const b of accessible.children)b.disabled=!state.activeStops.includes(Number(b.dataset.stop));
  if(state.complete)message.textContent='Good job! Close the celebration to shop, or choose Continue for the next round.';if(state.failed)message.textContent=state.lossReason+' Retry restores the start-of-round budget and network.';draw();
 }
 let alive=true,last=performance.now(),animation;
 const tick=now=>{if(!alive)return;const delta=Math.min((now-last)/1000,.1);if(root.isConnected){if(!reducedMotion&&!manualStepping)visualTime+=delta;const wasRunning=state.running;if(!manualStepping)advanceGame(state,delta);if(wasRunning)refresh();else draw();}last=now;animation=requestAnimationFrame(tick);};animation=requestAnimationFrame(tick);
 const oldText=window.render_game_to_text,oldAdvance=window.advanceTime;
 window.render_game_to_text=()=>JSON.stringify({coordinates:'Projected longitude/latitude; canvas 1000 × 600; north up; camera maps world to canvas',...state,stops,visibleCountries:regions.filter(r=>r.round<=state.round).map(r=>({name:r.name,capital:r.capital})),waterways:waterwaysForText(state.round)});
 window.advanceTime=ms=>{manualStepping=true;if(!reducedMotion)visualTime+=ms/1000;advanceGame(state,ms/1000);refresh();};
 const key=e=>{if(!root.isConnected||root.querySelector('dialog[open]'))return;if(e.key==='Escape'&&dragStart!==null){e.preventDefault();pointers.clear();dragStart=null;pointer=null;feedback('Route cancelled.','No credits were spent.','warning');draw();}else if(e.key==='f'){toggleFullscreen();}else if(e.code==='Space'&&!['BUTTON','INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();if(state.running)pause.click();else play.click();}};document.addEventListener('keydown',key);
 fitMap();refresh();
 return {element:root,state,destroy(){alive=false;tutorialUI.destroy();cancelAnimationFrame(animation);document.removeEventListener('keydown',key);document.removeEventListener('fullscreenchange',fullscreenChanged);window.render_game_to_text=oldText;window.advanceTime=oldAdvance;}};
}
export function openCoastalGame(saved,onClose=()=>{}){
 const game=createCoastalGame(saved),dialog=node('dialog',null,'coastal-dialog'),close=node('button','Close game ×','coastal-close');close.type='button';close.onclick=()=>dialog.close();
 dialog.setAttribute('aria-label','Coastal Connections transport game');dialog.append(close,game.element);
 dialog.addEventListener('close',()=>{onClose(structuredClone(game.state));game.destroy();dialog.remove();},{once:true});
 document.body.append(dialog);dialog.showModal();close.focus();
}
