export const stops=[
 {id:0,name:'Hilltown',kind:'town',land:'mainland',x:170,y:290,shape:'circle'},
 {id:1,name:'Harbour',kind:'port',land:'mainland',x:410,y:385,shape:'square'},
 {id:2,name:'Island Town',kind:'port',land:'island',x:760,y:365,shape:'triangle'},
 {id:3,name:'Mainland Airport',kind:'airport',land:'mainland',x:240,y:135},
 {id:4,name:'Island Airport',kind:'airport',land:'island',x:855,y:165}
];
const colours={road:'#137c83',ferry:'#dca438',flight:'#8261ae'};
export function routeAllowed(type,a,b){
 if(a===b)return false;
 const first=stops[a],last=stops[b];if(!first||!last)return false;
 return type==='road'?first.land===last.land:type==='ferry'?first.kind==='port'&&last.kind==='port'&&first.land!==last.land:type==='flight'?first.kind==='airport'&&last.kind==='airport':false;
}
export function createGameState(){return {tool:'road',selected:null,links:[],passengers:makePassengers(),running:false,delivered:0,ferryClosed:false,speed:1,complete:false};}
function makePassengers(){return [[0,2],[1,2],[2,0],[0,2],[2,1]].map(([at,destination],id)=>({id,at,destination,mode:'waiting'}));}
export function findRoute(state,start,destination){
 const queue=[[start]],seen=new Set([start]);
 while(queue.length){const route=queue.shift(),at=route.at(-1);if(at===destination)return route;
  for(const link of state.links){if(link.type==='ferry'&&state.ferryClosed)continue;
   const next=link.a===at?link.b:link.b===at?link.a:null;
   if(next!==null&&!seen.has(next)){seen.add(next);queue.push([...route,next]);}
  }
 }return null;
}
function board(state,link,at,next){
 for(const p of state.passengers){if(link.cargo.length>=3)break;
  if(p.mode==='waiting'&&p.at===at&&findRoute(state,at,p.destination)?.[1]===next){p.mode='riding';link.cargo.push(p.id);}
 }
}
export function advanceGame(state,seconds){
 if(!state.running||state.complete)return;
 for(let time=0;time<seconds;time+=.05){
  const dt=Math.min(.05,seconds-time)*state.speed;
  for(const link of state.links){
   if(link.type==='ferry'&&state.ferryClosed)continue;
   const start=link.direction===1?link.a:link.b,end=link.direction===1?link.b:link.a;
   if(link.position===0)board(state,link,start,end);
   const a=stops[link.a],b=stops[link.b],length=Math.hypot(a.x-b.x,a.y-b.y);
   link.position+=dt*({road:80,ferry:95,flight:155}[link.type])/length;
   if(link.position>=1){
    for(const id of link.cargo){const p=state.passengers[id];p.at=end;p.mode=end===p.destination?'delivered':'waiting';if(p.mode==='delivered')state.delivered++;}
    link.cargo=[];link.direction*=-1;link.position=0;
   }
  }
  if(state.delivered===5){state.complete=true;state.running=false;break;}
 }
}
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
export function createCoastalGame(saved){
 const state=saved?structuredClone(saved):createGameState();state.running=false;
 const root=node('section',null,'coastal-game'),head=node('header',null,'coastal-heading');
 head.append(node('h2','Coastal Connections'),node('p','Connect the towns. Carry passengers across land and sea.'));
 const body=node('div',null,'coastal-body'),map=node('div',null,'coastal-map'),canvas=node('canvas');canvas.width=1000;canvas.height=600;
 canvas.setAttribute('aria-label','Transport network: tap or drag between stops to connect them. Keyboard users can use the stop buttons.');
 const ctx=canvas.getContext('2d');map.append(canvas);
 const accessible=node('div',null,'coastal-stops');
 for(const stop of stops){const b=node('button',stop.name);b.type='button';b.setAttribute('aria-label','Connect '+stop.name);b.onclick=()=>select(stop.id);accessible.append(b);}map.append(accessible);
 const side=node('aside',null,'coastal-sidebar'),mission=node('h3','Your mission'),count=node('strong'),bar=node('progress');bar.max=5;
 const task=node('p','Deliver 5 passengers.');side.append(mission,task,count,bar);
 const tools=node('div',null,'coastal-tools'),toolButtons=[];
 for(const [type,label,description]of [['road','Road','Connect stops on the same land.'],['ferry','Ferry','Connect the two ports across the sea.'],['flight','Flight','Connect the two airports.']]){
  const b=node('button',null,'coastal-tool');b.type='button';b.dataset.tool=type;b.style.setProperty('--route',colours[type]);b.append(node('strong',label),node('span',description));
  b.onclick=()=>{state.tool=type;state.selected=null;message.textContent='Choose two stops for your '+label.toLowerCase()+'.';refresh();};tools.append(b);toolButtons.push(b);
 }
 side.append(tools);
 const message=node('p','Choose a transport type, then tap two stops.','coastal-message');message.setAttribute('role','status');side.append(message);
 const controls=node('div',null,'coastal-controls');
 function button(label,action){const b=node('button',label);b.type='button';b.onclick=action;controls.append(b);return b;}
 const play=button('▶ Play',()=>{if(state.complete)return;if(!state.links.length){message.textContent='Build a route first: choose Road and connect Hilltown to Harbour.';return;}state.running=true;message.textContent='Watch the vehicles. Waiting passengers need a connected route.';refresh();});
 const pause=button('Ⅱ Pause',()=>{state.running=false;refresh();});
 button('↶ Undo',()=>{const link=state.links.pop();if(link)for(const id of link.cargo){state.passengers[id].at=link.position<.5?(link.direction===1?link.a:link.b):(link.direction===1?link.b:link.a);state.passengers[id].mode='waiting';}refresh();});
 button('↻ Reset',()=>{Object.assign(state,createGameState());message.textContent='Choose a transport type, then tap two stops.';refresh();});
 const speed=button('1× speed',()=>{state.speed=state.speed===1?2:1;refresh();});
 const challenge=node('button','Ferry challenge','coastal-challenge');challenge.type='button';challenge.onclick=()=>{
  state.ferryClosed=!state.ferryClosed;state.passengers=makePassengers();state.delivered=0;state.complete=false;state.running=false;
  for(const link of state.links){link.cargo=[];link.position=0;link.direction=1;}
  message.textContent=state.ferryClosed?'The ferry is cancelled! Connect towns to airports by road, then use a flight.':'The ferry is open. Deliver five passengers again.';refresh();
 };controls.append(challenge);
 body.append(map,side);root.append(head,body,controls,node('p','Road: land  ·  Ferry: sea  ·  Flight: air  ·  Passenger shape = destination','coastal-legend'));
 function connect(a,b){
  if(!routeAllowed(state.tool,a,b)){message.textContent=state.tool==='road'?'Roads cannot cross the sea. Try a ferry between ports, or a flight between airports.':state.tool==='ferry'?'Ferries connect the square Harbour port and triangular Island Town port.':'Flights connect the two airport stops. Connect towns to airports by road.';state.selected=null;refresh();return;}
  if(state.links.some(l=>l.a===a&&l.b===b||l.a===b&&l.b===a)){message.textContent='These stops are already connected.';state.selected=null;refresh();return;}
  state.links.push({a,b,type:state.tool,position:0,direction:1,cargo:[]});state.selected=null;message.textContent='Route added. Build more connections or press Play.';refresh();
 }
 function select(id){if(state.selected===null){state.selected=id;message.textContent=stops[id].name+' selected. Choose the other stop.';refresh();}else if(state.selected===id){state.selected=null;refresh();}else connect(state.selected,id);}
 let dragStart=null,pointer=null;
 const location=e=>{const r=canvas.getBoundingClientRect(),scale=Math.min(r.width/1000,r.height/600),left=r.left+(r.width-1000*scale)/2,top=r.top+(r.height-600*scale)/2;return {x:(e.clientX-left)/scale,y:(e.clientY-top)/scale};};
 const nearest=p=>stops.find(s=>Math.hypot(s.x-p.x,s.y-p.y)<38)?.id??null;
 canvas.onpointerdown=e=>{const p=location(e);dragStart=nearest(p);pointer=p;canvas.setPointerCapture(e.pointerId);};
 canvas.onpointermove=e=>{if(dragStart!==null){pointer=location(e);draw();}};
 canvas.onpointerup=e=>{const end=nearest(location(e)),start=dragStart;dragStart=null;pointer=null;if(start!==null&&end!==null&&start!==end)connect(start,end);else if(end!==null)select(end);else draw();};
 canvas.onpointercancel=()=>{dragStart=null;pointer=null;draw();};
 function shape(kind,x,y,size,fill,stroke='#112d4d'){
  ctx.beginPath();if(kind==='circle')ctx.arc(x,y,size,0,Math.PI*2);else if(kind==='square')ctx.rect(x-size,y-size,size*2,size*2);else {ctx.moveTo(x,y-size*1.15);ctx.lineTo(x+size,y+size);ctx.lineTo(x-size,y+size);ctx.closePath();}
  ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();
 }
 function text(value,x,y,size=18,colour='#112d4d',align='center'){ctx.font=`${size}px system-ui`;ctx.fillStyle=colour;ctx.textAlign=align;ctx.fillText(value,x,y);}
 function land(){
  ctx.fillStyle='#dceff3';ctx.fillRect(0,0,1000,600);
  ctx.strokeStyle='#b4d8df';ctx.lineWidth=2;
  for(let y=55;y<600;y+=76)for(let x=475;x<1000;x+=110){ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+12,y+8,x+24,y);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(355,0);ctx.bezierCurveTo(440,80,385,160,450,225);ctx.bezierCurveTo(490,270,425,330,420,410);ctx.bezierCurveTo(380,500,410,560,305,600);ctx.lineTo(0,600);ctx.closePath();ctx.fillStyle='#dbe5bf';ctx.fill();ctx.strokeStyle='#e9d6a5';ctx.lineWidth=14;ctx.stroke();
  ctx.beginPath();ctx.moveTo(835,70);ctx.bezierCurveTo(955,40,980,175,945,260);ctx.bezierCurveTo(990,355,865,505,785,450);ctx.bezierCurveTo(705,400,710,290,765,225);ctx.bezierCurveTo(700,150,765,70,835,70);ctx.fillStyle='#dbe5bf';ctx.fill();ctx.stroke();
  // Small terrain details stay behind the route network.
  for(let i=0;i<22;i++){const x=40+(i*67)%300,y=45+(i*103)%500;ctx.fillStyle=i%2?'#86af87':'#6e9d80';ctx.beginPath();ctx.moveTo(x,y-11);ctx.lineTo(x+8,y+9);ctx.lineTo(x-8,y+9);ctx.fill();}
  for(const [x,y]of [[890,280],[835,420],[800,220],[890,80]]){ctx.fillStyle='#6e9d80';ctx.beginPath();ctx.moveTo(x,y-14);ctx.lineTo(x+10,y+10);ctx.lineTo(x-10,y+10);ctx.fill();}
  text('Greenstone Mainland',180,560,19,'#57776a');text('Bluewater Bay',585,170,23,'#4e8b9f');text('Sunshine Island',835,535,19,'#57776a');
 }
 function draw(){
  land();
  for(const link of state.links){const a=stops[link.a],b=stops[link.b],closed=link.type==='ferry'&&state.ferryClosed;
   ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='#fffdf8';ctx.lineWidth=11;ctx.setLineDash([]);ctx.stroke();ctx.strokeStyle=closed?'#b96a58':colours[link.type];ctx.lineWidth=6;ctx.setLineDash(link.type==='road'?[]:[12,8]);ctx.stroke();ctx.setLineDash([]);
   const t=link.direction===1?link.position:1-link.position,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
   if(!closed){ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2((b.y-a.y)*link.direction,(b.x-a.x)*link.direction));ctx.fillStyle=colours[link.type];ctx.strokeStyle='#fffdf8';ctx.lineWidth=2;
    ctx.beginPath();if(link.type==='flight'){ctx.moveTo(18,0);ctx.lineTo(2,4);ctx.lineTo(-5,14);ctx.lineTo(-9,14);ctx.lineTo(-6,3);ctx.lineTo(-14,6);ctx.lineTo(-17,3);ctx.lineTo(-10,0);ctx.lineTo(-17,-3);ctx.lineTo(-14,-6);ctx.lineTo(-6,-3);ctx.lineTo(-9,-14);ctx.lineTo(-5,-14);ctx.lineTo(2,-4);}else if(link.type==='ferry'){ctx.moveTo(-18,3);ctx.lineTo(18,3);ctx.lineTo(11,12);ctx.lineTo(-11,12);}else {ctx.rect(-15,-9,30,18);}ctx.closePath();ctx.fill();ctx.stroke();
    if(link.type==='road'){ctx.fillStyle='#fffdf8';ctx.fillRect(-11,-6,7,7);ctx.fillRect(-1,-6,7,7);ctx.fillStyle='#112d4d';ctx.beginPath();ctx.arc(-9,10,3,0,7);ctx.arc(9,10,3,0,7);ctx.fill();}
    if(link.type==='ferry'){ctx.fillStyle='#fffdf8';ctx.fillRect(-10,-7,19,9);ctx.fillStyle=colours.ferry;ctx.fillRect(-7,-12,10,5);ctx.fillStyle='#112d4d';ctx.fillRect(-7,-5,4,4);ctx.fillRect(1,-5,4,4);}ctx.restore();
    for(let i=0;i<link.cargo.length;i++)shape(stops[state.passengers[link.cargo[i]].destination].shape,x-16+i*12,y-20,5,'#fffdf8',colours[link.type]);
   }
  }
  if(dragStart!==null&&pointer){ctx.beginPath();ctx.moveTo(stops[dragStart].x,stops[dragStart].y);ctx.lineTo(pointer.x,pointer.y);ctx.strokeStyle=colours[state.tool];ctx.lineWidth=4;ctx.setLineDash([6,6]);ctx.stroke();ctx.setLineDash([]);}
  for(const stop of stops){
   if(state.selected===stop.id){ctx.beginPath();ctx.arc(stop.x,stop.y,32,0,Math.PI*2);ctx.strokeStyle='#dca438';ctx.lineWidth=4;ctx.stroke();}
   shape(stop.shape||'square',stop.x,stop.y,20,'#fffdf8');
   if(stop.kind==='airport')text('✈',stop.x,stop.y+8,27);
   text(stop.kind==='airport'?'Airport':stop.name,stop.x,stop.y+44,18);
   const queue=state.passengers.filter(p=>p.mode==='waiting'&&p.at===stop.id);
   queue.forEach((p,i)=>shape(stops[p.destination].shape,stop.x-18+i*18,stop.y+62,6,colours.ferry));
  }
  if(state.ferryClosed){text('Ferry cancelled',590,425,20,'#a44932');}
  if(state.complete){ctx.fillStyle='#fffdf8ed';ctx.fillRect(265,230,470,110);text('All five passengers delivered!',500,277,25);text('Why did this journey need a sea crossing?',500,314,18);}
 }
 function refresh(){
  count.textContent=state.delivered+' / 5 delivered';bar.value=state.delivered;play.disabled=state.running||state.complete;pause.disabled=!state.running;speed.textContent=state.speed+'× speed';challenge.textContent=state.ferryClosed?'Reopen ferry':'Ferry challenge';
  toolButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===state.tool)));
  if(state.complete)message.textContent='Mission complete! Explain which transport crossed land and which crossed water.';draw();
 }
 let alive=true,last=performance.now(),animation;
 const tick=now=>{if(!alive)return;if(root.isConnected){advanceGame(state,Math.min((now-last)/1000,.1));if(state.running||state.complete)refresh();}last=now;animation=requestAnimationFrame(tick);};animation=requestAnimationFrame(tick);
 const oldText=window.render_game_to_text,oldAdvance=window.advanceTime;
 window.render_game_to_text=()=>JSON.stringify({coordinates:'1000 × 600; origin top left; x right, y down',...state,stops});
 window.advanceTime=ms=>{advanceGame(state,ms/1000);refresh();};
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
