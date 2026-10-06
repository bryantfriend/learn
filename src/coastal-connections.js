import {createCoastalArtwork} from './coastal-art.js';
export const stops=[
 {id:0,name:'Hilltown',kind:'town',land:'mainland',x:170,y:290,shape:'circle'},
 {id:1,name:'Harbour',kind:'port',land:'mainland',x:410,y:385,shape:'square'},
 {id:2,name:'Island Town',kind:'port',land:'island',x:760,y:365,shape:'triangle'},
 {id:3,name:'Mainland Airport',kind:'airport',land:'mainland',x:240,y:135,shape:'diamond'},
 {id:4,name:'Island Airport',kind:'airport',land:'island',x:855,y:165,shape:'hexagon'},
 {id:5,name:'Woodland',kind:'town',land:'mainland',x:110,y:460,shape:'star'},
 {id:6,name:'Island Market',kind:'town',land:'island',x:870,y:340,shape:'pentagon'}
];
const colours={road:'#137c83',rail:'#df7154',ferry:'#dca438',flight:'#8261ae'};
export function routeAllowed(type,a,b){
 if(a===b)return false;
 const first=stops[a],last=stops[b];if(!first||!last)return false;
 return type==='road'||type==='rail'?first.land===last.land:type==='ferry'?first.kind==='port'&&last.kind==='port'&&first.land!==last.land:type==='flight'?first.kind==='airport'&&last.kind==='airport':false;
}
export const prices={road:20,rail:55,ferry:35,flight:80},deliveryReward=15;
export const vehicleUpgradeCost=(state,type)=>prices[type]*state.levels[type];
export const terminalUpgradeCost=(state,id)=>20*state.terminals[id];
export function createGameState(){return {tool:'road',selected:null,links:[],passengers:makePassengers(),running:false,delivered:0,ferryClosed:false,speed:1,complete:false,round:1,target:5,elapsed:0,spawnClock:0,pressure:0,failed:false,credits:20,levels:{road:1,rail:1,ferry:1,flight:1},terminals:Object.fromEntries(stops.map(s=>[s.id,1])),danger:{},activeStops:[0,1,2,3,4],stars:0,roundIncome:0,roundStart:null,lossReason:'',celebrationDismissed:false};}
function makePassengers(){return [[0,1],[0,1],[1,0],[1,2],[2,1]].map(([at,destination],id)=>({id,at,destination,mode:'waiting',wait:0}));}
export const roundDuration=state=>Math.max(75,45+state.target*Math.max(7,12-state.round*.4));
export function buyRoute(state,a,b,type){if(!routeAllowed(type,a,b)||!state.activeStops.includes(a)||!state.activeStops.includes(b)||(type==='rail'&&state.round<2)||state.credits<prices[type]||state.links.some(l=>l.type===type&&(l.a===a&&l.b===b||l.a===b&&l.b===a)))return false;state.credits-=prices[type];state.links.push({a,b,type,position:0,direction:1,cargo:[],paid:prices[type]});return true;}
export function removeRoute(state,index){const link=state.links[index];if(!link)return false;for(const id of link.cargo){const p=state.passengers[id];p.at=link.position<.5?(link.direction===1?link.a:link.b):(link.direction===1?link.b:link.a);p.mode='waiting';p.wait=0;}state.credits+=Math.floor((link.paid??prices[link.type])*.75);state.links.splice(index,1);return true;}
export function upgradeTerminal(state,id){if(!state.activeStops.includes(id))return false;const cost=terminalUpgradeCost(state,id);if(state.terminals[id]>=4||state.credits<cost)return false;state.credits-=cost;state.terminals[id]++;return true;}
export const vehicleStats=(state,type)=>({capacity:({road:3,rail:5,ferry:3,flight:3}[type])+(state.levels[type]-1)*2,speed:({road:80,rail:145,ferry:95,flight:155}[type])*(1+(state.levels[type]-1)*.3)});
export function upgradeVehicle(state,type){if(!(type in state.levels)||(type==='rail'&&state.round<2))return false;const cost=vehicleUpgradeCost(state,type);if(state.levels[type]>=4||state.credits<cost)return false;state.credits-=cost;state.levels[type]++;return true;}
export function nextRound(state,retry=false){
 if(!retry&&!state.complete)return false;
 if(retry&&state.roundStart){for(const key of ['credits','links','levels','terminals'])state[key]=structuredClone(state.roundStart[key]);}
 if(!retry)state.round++;
 state.target=5+(state.round-1)*4;state.activeStops=[0,1,2,3,4,...(state.round>=2?[5]:[]),...(state.round>=3?[6]:[])];
 state.passengers=state.round===1?makePassengers():[];state.delivered=0;state.elapsed=0;state.spawnClock=0;state.pressure=0;state.danger={};state.roundIncome=0;state.roundStart=null;state.lossReason='';state.celebrationDismissed=false;state.complete=false;state.failed=false;state.running=false;state.selected=null;
 for(const l of state.links){l.cargo=[];l.position=0;l.direction=1;}return true;
}
export function findRoute(state,start,destination){
 const queue=[{route:[start],cost:0}],seen=new Set();
 while(queue.length){queue.sort((a,b)=>a.cost-b.cost);const {route,cost}=queue.shift(),at=route.at(-1);if(seen.has(at))continue;seen.add(at);if(at===destination)return route;
  for(const link of state.links){if(link.type==='ferry'&&state.ferryClosed)continue;
   const next=link.a===at?link.b:link.b===at?link.a:null;
   if(next!==null&&!seen.has(next)){const a=stops[at],b=stops[next];queue.push({route:[...route,next],cost:cost+Math.hypot(a.x-b.x,a.y-b.y)/vehicleStats(state,link.type).speed});}
  }
 }return null;
}
function board(state,link,at,next){
 for(const p of state.passengers){if(link.cargo.length>=vehicleStats(state,link.type).capacity)break;
  const fastest=state.links.filter(l=>(l.a===at&&l.b===next||l.b===at&&l.a===next)&&!(l.type==='ferry'&&state.ferryClosed)).sort((a,b)=>vehicleStats(state,b.type).speed-vehicleStats(state,a.type).speed)[0];
  if(p.mode==='waiting'&&p.at===at&&fastest===link&&findRoute(state,at,p.destination)?.[1]===next){p.mode='riding';p.wait=0;link.cargo.push(p.id);}
 }
}
export function advanceGame(state,seconds){
 if(!state.running||state.complete||state.failed)return;
 if(!state.roundStart)state.roundStart=structuredClone({credits:state.credits,links:state.links,levels:state.levels,terminals:state.terminals});
 for(let time=0;time<seconds;time+=.05){
  const dt=Math.min(.05,seconds-time)*state.speed;
  state.elapsed+=dt;state.spawnClock+=dt;
  const interval=Math.max(.9,4-state.round*.35);
  if(state.round>1&&state.passengers.length<state.target&&state.spawnClock>=interval){
   state.spawnClock=0;const id=state.passengers.length,at=state.activeStops[(id*3+state.round)%state.activeStops.length],destination=state.activeStops[(id*3+state.round+1+id%(state.activeStops.length-1))%state.activeStops.length];
   state.passengers.push({id,at,destination,mode:'waiting',wait:0});
  }
  for(const p of state.passengers)if(p.mode==='waiting'||p.mode==='riding'&&state.ferryClosed&&state.links.some(l=>l.type==='ferry'&&l.cargo.includes(p.id)))p.wait=(p.wait??0)+dt;
  for(const id of state.activeStops){const queue=state.passengers.filter(p=>p.at===id&&(p.mode==='waiting'||p.mode==='riding'&&state.ferryClosed&&state.links.some(l=>l.type==='ferry'&&l.cargo.includes(p.id)))),level=state.terminals[id],crowded=queue.length>=5+(level-1)*3||queue.some(p=>p.wait>=20+(level-1)*10);state.danger[id]=crowded?(state.danger[id]??0)+dt:0;if(state.danger[id]>=10){state.failed=true;state.lossReason=stops[id].name+' stayed blocked for 10 seconds.';}}
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
    for(const id of link.cargo){const p=state.passengers[id];p.at=end;p.wait=0;p.mode=end===p.destination?'delivered':'waiting';if(p.mode==='delivered'){state.delivered++;state.credits+=deliveryReward;state.roundIncome+=deliveryReward;}}
    link.cargo=[];link.direction*=-1;link.position=0;
   }
  }
  if(state.delivered===state.target){state.complete=true;state.running=false;const stars=state.elapsed<state.target*5?3:state.elapsed<state.target*9?2:1;state.stars=stars;state.credits+=stars*5;break;}
 }
}
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
export function createCoastalGame(saved){
 const state=saved?{...createGameState(),...structuredClone(saved)}:createGameState();state.running=false;
 const root=node('section',null,'coastal-game'),head=node('header',null,'coastal-heading');
 head.append(node('h2','Coastal Connections'),node('p','Build your network. Keep queues moving. Earn upgrades each round.'));
 const body=node('div',null,'coastal-body'),map=node('div',null,'coastal-map'),canvas=node('canvas');canvas.width=1000;canvas.height=600;
 canvas.setAttribute('aria-label','Transport network: tap or drag between stops to connect them. Keyboard users can use the stop buttons.');
 const ctx=canvas.getContext('2d'),art=createCoastalArtwork(),reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;map.append(canvas);
 let visualTime=0,previousRound=state.round,previousDelivered=state.delivered,manualStepping=false;
 const effects=[],previousPassengers=new Map(),stationBirth=new Map(state.activeStops.map(id=>[id,-10]));
 function effect(id,label,colour='#137c83'){if(!reducedMotion)effects.push({id,label,colour,born:visualTime});}
 let inspected=null,removing=false,completionShown=Boolean(state.celebrationDismissed),routeListKey='';
 const hud=node('div',null,'coastal-hud'),money=node('strong'),clock=node('span'),alarm=node('strong');hud.append(money,clock,alarm);map.append(hud);
 const celebration=node('div',null,'coastal-celebration');celebration.hidden=true;celebration.setAttribute('role','dialog');celebration.setAttribute('aria-label','Round complete');
 const dismiss=node('button','×','coastal-dismiss');dismiss.type='button';dismiss.setAttribute('aria-label','Dismiss celebration');dismiss.onclick=()=>{celebration.hidden=true;state.celebrationDismissed=true;};
 const congrats=node('h3','Good job, network builder!'),goldStars=node('div',null,'coastal-gold-stars'),result=node('p'),bonus=node('p'),continueButton=node('button','Continue →');continueButton.type='button';continueButton.onclick=()=>{celebration.hidden=true;next.click();};celebration.append(dismiss,congrats,goldStars,result,bonus,continueButton);map.append(celebration);
 const accessible=node('div',null,'coastal-stops');
 for(const stop of stops){const b=node('button',stop.name);b.type='button';b.dataset.stop=stop.id;b.setAttribute('aria-label','Connect '+stop.name);b.onclick=()=>select(stop.id);accessible.append(b);}map.append(accessible);
 const side=node('aside',null,'coastal-sidebar'),mission=node('h3','Your mission'),count=node('strong'),bar=node('progress');bar.max=5;
 const task=node('p'),wallet=node('p',null,'coastal-wallet'),pressure=node('p');side.append(mission,task,count,bar,wallet,pressure);
 const tools=node('div',null,'coastal-tools'),toolButtons=[];
 for(const [type,label,description]of [['road','Bus','Flexible routes on land.'],['rail','Train','Fast, high-capacity land routes. Round 2.'],['ferry','Boat','Connect the ports across the sea.'],['flight','Flight','Connect the two airports.']]){
  const b=node('button',null,'coastal-tool');b.type='button';b.dataset.tool=type;b.style.setProperty('--route',colours[type]);b.append(node('strong',label),node('span',description));
  b.onclick=()=>{state.tool=type;state.selected=null;message.textContent='Choose two stops for your '+label.toLowerCase()+'.';refresh();};tools.append(b);toolButtons.push(b);
 }
 side.append(tools);
 const message=node('p','Choose a transport type, then tap two stops.','coastal-message');message.setAttribute('role','status');side.append(message);
 const inspector=node('div',null,'coastal-inspector'),stationName=node('strong'),stationInfo=node('p'),stationUpgrade=node('button');stationUpgrade.type='button';stationUpgrade.onclick=()=>{if(inspected!==null&&upgradeTerminal(state,inspected)){effect(inspected,'UPGRADED');refresh();}};inspector.append(stationName,stationInfo,stationUpgrade);inspector.hidden=true;side.insertBefore(inspector,message);
 const routes=node('details',null,'coastal-upgrades'),routeList=node('div');routes.append(node('summary','Manage routes · 75% refund'),routeList);side.append(routes);
 const upgrades=node('details',null,'coastal-upgrades');upgrades.append(node('summary','Vehicle upgrades'));const upgradeButtons=[];
 for(const [type,label]of [['road','Bus'],['rail','Train'],['ferry','Boat'],['flight','Plane']]){const b=node('button');b.type='button';b.dataset.upgrade=type;b.onclick=()=>{if(upgradeVehicle(state,type)){message.textContent=label+' upgraded! All its routes carry more passengers and move faster.';refresh();}};upgrades.append(b);upgradeButtons.push(b);}side.insertBefore(upgrades,tools);
 const controls=node('div',null,'coastal-controls');
 function button(label,action){const b=node('button',label);b.type='button';b.onclick=action;controls.append(b);return b;}
 const play=button('▶ Play',()=>{if(state.complete||state.failed)return;if(!state.links.length){message.textContent='Build a route first: choose Bus and connect Hilltown to Harbour.';return;}state.running=true;message.textContent='Earn 15 credits per delivery. Clear red stops before their 10-second countdown ends.';refresh();});
 const pause=button('Ⅱ Pause',()=>{state.running=false;refresh();});
 button('↶ Undo',()=>{removeRoute(state,state.links.length-1);refresh();});
 const remove=button('Remove routes',()=>{removing=!removing;state.selected=null;message.textContent=removing?'Tap a route to sell it for 75% of its purchase price.':'Choose two stops to buy a route.';refresh();});
 button('↻ Reset',()=>{Object.assign(state,createGameState());completionShown=false;celebration.hidden=true;inspected=null;message.textContent='Start with a 20-credit bus between Hilltown and Harbour.';refresh();});
 const speed=button('1× speed',()=>{state.speed=state.speed===1?2:1;refresh();});
 const next=button('Next round →',()=>{nextRound(state);celebration.hidden=true;completionShown=false;message.textContent=state.round===2?'Woodland has opened! Trains are unlocked. Connect the new stop before you play.':state.round===3?'Island Market has opened! More passengers are arriving.':'Demand is growing. Spend your credits and check every connection.';refresh();});
 const retry=button('Retry round',()=>{nextRound(state,true);completionShown=false;message.textContent='Back to the start of this round. Improve your network and try again.';refresh();});
 const challenge=node('button','Ferry challenge','coastal-challenge');challenge.type='button';challenge.onclick=()=>{
  state.ferryClosed=!state.ferryClosed;
  message.textContent=state.ferryClosed?'The ferry is cancelled! Its passengers wait onboard. Build an airport route or reopen it.':'The ferry is open again.';refresh();
 };controls.append(challenge);
 body.append(map,side);root.append(head,body,controls,node('p','Bus / train: land  ·  Boat: sea  ·  Flight: air  ·  Passenger shape = destination  ·  F: fullscreen','coastal-legend'));
 function connect(a,b){
  if(!state.activeStops.includes(a)||!state.activeStops.includes(b))return;
  if(!routeAllowed(state.tool,a,b)){message.textContent=state.tool==='road'||state.tool==='rail'?'Buses and trains cannot cross the sea. Try a boat between ports, or a flight between airports.':state.tool==='ferry'?'Boats connect the square Harbour port and triangular Island Town port.':'Flights connect the two airport stops. Connect towns to airports by road.';state.selected=null;refresh();return;}
  if(state.tool==='rail'&&state.round<2){message.textContent='Trains unlock in round 2.';return;}
  if(state.links.some(l=>l.type===state.tool&&(l.a===a&&l.b===b||l.a===b&&l.b===a))){message.textContent='These stops are already connected by this transport.';state.selected=null;refresh();return;}
  if(state.links.length>=6+state.round*2){message.textContent='No route permits left. Undo a route to redesign your network.';state.selected=null;refresh();return;}
  if(!buyRoute(state,a,b,state.tool)){message.textContent='You need '+prices[state.tool]+' credits for this route. Deliver passengers or sell a route to earn more.';state.selected=null;refresh();return;}
  effect(a,'CONNECTED',colours[state.tool]);effect(b,'CONNECTED',colours[state.tool]);state.selected=null;message.textContent='Route bought for '+prices[state.tool]+' credits. Deliveries earn 15 credits each.';refresh();
 }
 function select(id){inspected=id;if(state.selected===null){state.selected=id;message.textContent=stops[id].name+' selected. Upgrade it in the panel, or choose another stop to buy a route.';refresh();}else if(state.selected===id){state.selected=null;refresh();}else connect(state.selected,id);}
 let dragStart=null,pointer=null;
 const location=e=>{const r=canvas.getBoundingClientRect(),scale=Math.min(r.width/1000,r.height/600),left=r.left+(r.width-1000*scale)/2,top=r.top+(r.height-600*scale)/2;return {x:(e.clientX-left)/scale,y:(e.clientY-top)/scale};};
 const nearest=p=>stops.find(s=>state.activeStops.includes(s.id)&&Math.hypot(s.x-p.x,s.y-p.y)<38)?.id??null;
 canvas.onpointerdown=e=>{const p=location(e);dragStart=nearest(p);pointer=p;canvas.setPointerCapture(e.pointerId);};
 canvas.onpointermove=e=>{if(dragStart!==null){pointer=location(e);draw();}};
 canvas.onpointerup=e=>{const p=location(e),end=nearest(p),start=dragStart;dragStart=null;pointer=null;if(removing){const index=state.links.findIndex(l=>{const a=stops[l.a],b=stops[l.b],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)<14;});if(removeRoute(state,index))message.textContent='Route sold. Its passengers are safely back at a stop.';refresh();}else if(start!==null&&end!==null&&start!==end)connect(start,end);else if(end!==null)select(end);else draw();};
 canvas.onpointercancel=()=>{dragStart=null;pointer=null;draw();};
 function shape(kind,x,y,size,fill,stroke='#112d4d'){
  ctx.beginPath();if(kind==='circle')ctx.arc(x,y,size,0,Math.PI*2);else if(kind==='square')ctx.rect(x-size,y-size,size*2,size*2);else if(['diamond','hexagon','pentagon','star'].includes(kind)){const n={diamond:4,hexagon:6,pentagon:5,star:10}[kind];for(let i=0;i<n;i++){const angle=-Math.PI/2+i*Math.PI*2/n,r=size*(kind==='star'&&i%2?.5:1.15);ctx.lineTo(x+Math.cos(angle)*r,y+Math.sin(angle)*r);}ctx.closePath();}else {ctx.moveTo(x,y-size*1.15);ctx.lineTo(x+size,y+size);ctx.lineTo(x-size,y+size);ctx.closePath();}
  ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();
 }
 function text(value,x,y,size=18,colour='#112d4d',align='center'){ctx.font=`${size}px system-ui`;ctx.fillStyle=colour;ctx.textAlign=align;ctx.fillText(value,x,y);}
 function land(){art.land(ctx,visualTime);text('GREENSTONE MAINLAND',170,567,15,'#426d61');text('BLUEWATER BAY',575,140,17,'#377f98');text('SUNSHINE ISLAND',835,535,15,'#426d61');}
 function draw(){
  land();
  for(const link of state.links){const a=stops[link.a],b=stops[link.b],closed=link.type==='ferry'&&state.ferryClosed;
   ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='#fffdf8b0';ctx.lineWidth=12;ctx.setLineDash([]);ctx.stroke();ctx.strokeStyle=closed?'#b96a58':colours[link.type];ctx.lineWidth=6;ctx.setLineDash(link.type==='road'||link.type==='rail'?[]:[8,10]);ctx.lineDashOffset=link.type==='ferry'&&!reducedMotion?-visualTime*8:0;ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;
   if(link.type==='rail'){const length=Math.hypot(b.x-a.x,b.y-a.y),nx=-(b.y-a.y)/length,ny=(b.x-a.x)/length;ctx.strokeStyle='#74584b';ctx.lineWidth=2;for(let d=30;d<length-25;d+=12){const x=a.x+(b.x-a.x)*d/length,y=a.y+(b.y-a.y)*d/length;ctx.beginPath();ctx.moveTo(x-nx*6,y-ny*6);ctx.lineTo(x+nx*6,y+ny*6);ctx.stroke();}ctx.strokeStyle='#fff1d5';ctx.lineWidth=1;for(const side of [-2,2]){ctx.beginPath();ctx.moveTo(a.x+nx*side,a.y+ny*side);ctx.lineTo(b.x+nx*side,b.y+ny*side);ctx.stroke();}}
   if(link.type==='road'){ctx.strokeStyle='#b9e1dc';ctx.lineWidth=1;ctx.setLineDash([4,10]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);}
   const t=link.direction===1?link.position:1-link.position,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
   if(!closed){art.vehicle(ctx,link.type,x,y,Math.atan2((b.y-a.y)*link.direction,(b.x-a.x)*link.direction),visualTime,state.levels[link.type],state.running);
    for(let i=0;i<link.cargo.length;i++)shape(stops[state.passengers[link.cargo[i]].destination].shape,x-16+i*12,y-20,5,'#fffdf8',colours[link.type]);
   }
  }
  if(dragStart!==null&&pointer){ctx.beginPath();ctx.moveTo(stops[dragStart].x,stops[dragStart].y);ctx.lineTo(pointer.x,pointer.y);ctx.strokeStyle=colours[state.tool];ctx.lineWidth=4;ctx.setLineDash([6,6]);ctx.stroke();ctx.setLineDash([]);}
  for(const stop of stops){
   if(!state.activeStops.includes(stop.id))continue;
   const birth=visualTime-(stationBirth.get(stop.id)??-10);
   if(birth<2&&!reducedMotion){ctx.beginPath();ctx.arc(stop.x,stop.y,28+birth*25,0,Math.PI*2);ctx.strokeStyle=`rgba(19,124,131,${1-birth/2})`;ctx.lineWidth=3;ctx.stroke();text('NEW STOP',stop.x,stop.y-45,14,'#137c83');}
   if(state.selected===stop.id){ctx.beginPath();ctx.arc(stop.x,stop.y,31+(reducedMotion?0:Math.sin(visualTime*5)*3),0,Math.PI*2);ctx.strokeStyle='#e3ad41';ctx.lineWidth=4;ctx.stroke();}
   ctx.save();ctx.shadowColor='#224f4940';ctx.shadowBlur=8;ctx.shadowOffsetY=4;shape(stop.shape||'square',stop.x,stop.y,21,'#fffdf8');ctx.restore();
   if(stop.kind==='airport')text('✈',stop.x,stop.y+8,27);
   const label=stop.kind==='airport'?'Airport':stop.name;ctx.font='600 16px system-ui';const labelWidth=ctx.measureText(label).width+18;ctx.fillStyle='#fffdf8df';ctx.beginPath();ctx.roundRect(stop.x-labelWidth/2,stop.y+29,labelWidth,24,8);ctx.fill();text(label,stop.x,stop.y+46,16);
   const queue=state.passengers.filter(p=>p.mode==='waiting'&&p.at===stop.id);
   queue.forEach((p,i)=>shape(stops[p.destination].shape||'square',stop.x-18+(i%6)*15,stop.y+62+Math.floor(i/6)*16,6,colours.ferry));
   if(state.danger[stop.id]>0){ctx.beginPath();ctx.arc(stop.x,stop.y,32,0,Math.PI*2);ctx.lineWidth=5;ctx.strokeStyle=reducedMotion?'#d34e42':`rgba(211,78,66,${.55+.45*Math.sin(visualTime*Math.PI*2)})`;ctx.stroke();text(Math.ceil(10-state.danger[stop.id])+'s TO CLEAR',stop.x,stop.y-38,14,'#b73832');}
  }
  if(state.ferryClosed){text('Ferry cancelled',590,425,20,'#a44932');}
  for(let i=effects.length-1;i>=0;i--){const e=effects[i],age=visualTime-e.born;if(age>1.4){effects.splice(i,1);continue;}const s=stops[e.id];ctx.save();ctx.globalAlpha=1-age/1.4;ctx.beginPath();ctx.arc(s.x,s.y,24+age*22,0,Math.PI*2);ctx.strokeStyle=e.colour;ctx.lineWidth=3;ctx.stroke();text(e.label,s.x,s.y-35-age*25,15,e.colour);ctx.restore();}
  if(state.complete&&!reducedMotion){const age=visualTime-(stationBirth.get('celebrate')??-10);if(age<5)for(let i=0;i<90;i++){const x=(i*79)%1000+Math.sin(age+i)*18,y=-160+age*160+(i*29)%180;ctx.save();ctx.translate(x,y);ctx.rotate(age*2+i);ctx.fillStyle=['#e5b348','#137c83','#e98771','#8261ae'][i%4];ctx.fillRect(-3,-3,6,9);ctx.restore();}}
  if(state.failed){ctx.fillStyle='#fffdf8f5';ctx.beginPath();ctx.roundRect(230,220,540,140,24);ctx.fill();text('Network stopped',500,263,28,'#b73832');text(state.lossReason,500,305,18);text('Choose Retry round to try a new plan.',500,337,17);}
 }
 function refresh(){
  if(state.round!==previousRound||state.delivered<previousDelivered){previousPassengers.clear();effects.length=0;previousRound=state.round;}
  for(const id of state.activeStops)if(!stationBirth.has(id))stationBirth.set(id,visualTime);
  for(const p of state.passengers){const prior=previousPassengers.get(p.id);if(prior&&prior!==p.mode)effect(p.at,p.mode==='delivered'?'+15 CREDITS':p.mode==='riding'?'BOARDING':'TRANSFER',p.mode==='delivered'?'#137c83':'#b88128');else if(!prior&&state.round>1)effect(p.at,'NEW PASSENGER');previousPassengers.set(p.id,p.mode);}
  if(state.delivered===state.target&&previousDelivered!==state.delivered)stationBirth.set('celebrate',visualTime);previousDelivered=state.delivered;
  money.textContent='● '+state.credits+' credits';clock.textContent='Round '+state.round+' · '+Math.ceil(Math.max(0,roundDuration(state)-state.elapsed))+'s left';alarm.textContent=state.pressure>0?'⚠ CLEAR QUEUE: '+Math.ceil(10-state.pressure)+'s':'';alarm.hidden=state.pressure===0;
  if(state.complete&&!completionShown){completionShown=true;celebration.hidden=false;goldStars.textContent='★'.repeat(state.stars)+'☆'.repeat(3-state.stars);result.textContent='Round '+state.round+' complete · '+state.delivered+' passengers delivered';bonus.textContent=state.roundIncome+' delivery credits + '+state.stars*5+' star bonus';}
  if(inspected!==null){const level=state.terminals[inspected];inspector.hidden=false;stationName.textContent=stops[inspected].name+' · Level '+level;stationInfo.textContent=(5+(level-1)*3)+' queue spaces · '+(20+(level-1)*10)+'s before alarm';stationUpgrade.textContent=level===4?'Terminal fully upgraded':'Upgrade terminal · '+terminalUpgradeCost(state,inspected)+' credits';stationUpgrade.disabled=level===4||state.credits<terminalUpgradeCost(state,inspected);}else inspector.hidden=true;
  remove.setAttribute('aria-pressed',String(removing));const listKey=state.links.map(l=>[l.a,l.b,l.type,l.paid].join('-')).join('|');if(listKey!==routeListKey){routeListKey=listKey;routeList.replaceChildren();state.links.forEach((l,i)=>{const b=node('button','Sell '+stops[l.a].name+' ↔ '+stops[l.b].name+' · +'+Math.floor((l.paid??prices[l.type])*.75));b.type='button';b.onclick=()=>{removeRoute(state,i);refresh();};routeList.append(b);});}
  mission.textContent='Round '+state.round;task.textContent='Deliver '+state.target+' passengers. '+(state.round>1?'New arrivals every '+Math.max(.9,4-state.round*.35).toFixed(1)+' seconds.':'Buy a bus: Hilltown ↔ Harbour. Earn 35 credits, then buy a boat.');
  count.textContent=state.delivered+' / '+state.target+' delivered';bar.max=state.target;bar.value=state.delivered;wallet.textContent='+15 credits per delivery';pressure.textContent=state.pressure>0?'Clear the blinking stop in '+Math.ceil(10-state.pressure)+'s!':'Long waits or full queues trigger a 10s alarm.';pressure.style.color=state.pressure>0?'#b73832':'';
  play.disabled=state.running||state.complete||state.failed;pause.disabled=!state.running;speed.textContent=state.speed+'× speed';challenge.textContent=state.ferryClosed?'Reopen ferry':'Ferry challenge';next.hidden=!state.complete;retry.hidden=!state.failed;
  toolButtons.forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.tool===state.tool));b.disabled=b.dataset.tool==='rail'&&state.round<2;b.querySelector('strong').textContent=({road:'Bus',rail:'Train',ferry:'Boat',flight:'Flight'}[b.dataset.tool])+' · '+prices[b.dataset.tool];});
  for(const b of upgradeButtons){const t=b.dataset.upgrade,level=state.levels[t],stats=vehicleStats(state,t);b.textContent=({road:'Bus',rail:'Train',ferry:'Boat',flight:'Plane'}[t])+' Lv '+level+' · '+stats.capacity+' seats · '+(level===4?'MAX':vehicleUpgradeCost(state,t)+' credits');b.disabled=level===4||state.credits<vehicleUpgradeCost(state,t)||(t==='rail'&&state.round<2);}
  for(const b of accessible.children)b.disabled=!state.activeStops.includes(Number(b.dataset.stop));
  if(state.complete)message.textContent='Good job! Close the celebration to shop, or choose Continue for the next round.';if(state.failed)message.textContent=state.lossReason+' Retry restores the start-of-round budget and network.';draw();
 }
 let alive=true,last=performance.now(),animation;
 const tick=now=>{if(!alive)return;const delta=Math.min((now-last)/1000,.1);if(root.isConnected){if(!reducedMotion&&!manualStepping)visualTime+=delta;const wasRunning=state.running;if(!manualStepping)advanceGame(state,delta);if(wasRunning)refresh();else draw();}last=now;animation=requestAnimationFrame(tick);};animation=requestAnimationFrame(tick);
 const oldText=window.render_game_to_text,oldAdvance=window.advanceTime;
 window.render_game_to_text=()=>JSON.stringify({coordinates:'1000 × 600; origin top left; x right, y down',...state,stops});
 window.advanceTime=ms=>{manualStepping=true;if(!reducedMotion)visualTime+=ms/1000;advanceGame(state,ms/1000);refresh();};
 const key=e=>{if(!root.isConnected)return;if(e.key==='f'){if(document.fullscreenElement)document.exitFullscreen();else root.requestFullscreen?.();}else if(e.code==='Space'&&!['BUTTON','INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();if(state.running)pause.click();else play.click();}};document.addEventListener('keydown',key);
 refresh();
 return {element:root,state,destroy(){alive=false;cancelAnimationFrame(animation);document.removeEventListener('keydown',key);window.render_game_to_text=oldText;window.advanceTime=oldAdvance;}};
}
export function openCoastalGame(saved,onClose=()=>{}){
 const game=createCoastalGame(saved),dialog=node('dialog',null,'coastal-dialog'),close=node('button','Close game ×','coastal-close');close.type='button';close.onclick=()=>dialog.close();
 dialog.setAttribute('aria-label','Coastal Connections transport game');dialog.append(close,game.element);
 dialog.addEventListener('close',()=>{onClose(structuredClone(game.state));game.destroy();dialog.remove();},{once:true});
 document.body.append(dialog);dialog.showModal();close.focus();
}
