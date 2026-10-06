export const shapeCollection=[
 {id:'circle',name:'Circle',symbol:'●',round:1},
 {id:'square',name:'Square',symbol:'■',round:1},
 {id:'triangle',name:'Triangle',symbol:'▲',round:3},
 {id:'diamond',name:'Diamond',symbol:'◆',round:5},
 {id:'pentagon',name:'Pentagon',symbol:'⬟',round:10},
 {id:'hexagon',name:'Hexagon',symbol:'⬢',round:15},
 {id:'star',name:'Star',symbol:'★',round:20},
 {id:'cross',name:'Cross',symbol:'✚',round:25}
];
export const shapesForRound=round=>shapeCollection.filter(s=>s.round<=round);
export function stationShape(id,round,firstThisRound=false){
 const base=round<3?['circle','square'][id%2]:['circle','square','triangle'][(id-2)%3],rare=shapesForRound(round).filter(s=>s.round>=5),introduced=rare.find(s=>s.round===round);
 if(introduced&&firstThisRound)return introduced.id;
 // Most cities retain common shapes; occasional cities reuse an older rare shape.
 const hash=id*37+round*11;
 return rare.length&&hash%100<10?rare[Math.floor(hash/100)%rare.length].id:base;
}
export function installShapeFilter({side,state,stops,node,draw}){
 const panel=node('details',null,'coastal-shape-filter'),heading=node('summary','Shape filter'),buttons=node('div'),info=node('p'),focus=node('button','Show matching cities');focus.type='button';panel.append(heading,buttons,info,focus);side.prepend(panel);let key='';
 focus.onclick=()=>{const matches=stops.filter(s=>state.activeStops.includes(s.id)&&s.shape===state.shapeFilter);if(!matches.length)return;const xs=matches.map(s=>s.x),ys=matches.map(s=>s.y),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys),zoom=Math.max(.3,Math.min(1.8,800/(right-left+80),370/(bottom-top+80)));state.camera={zoom,x:500-(left+right)/2*zoom,y:280-(top+bottom)/2*zoom};state.cameraReady=true;draw();};
 function refresh(){const shapes=shapesForRound(state.round),next=JSON.stringify([state.round,state.shapeFilter,state.activeStops]);if(next===key)return;key=next;buttons.replaceChildren();for(const s of [{id:'all',name:'All',symbol:'◉'},...shapes]){const count=state.activeStops.filter(id=>stops[id].shape===s.id).length,b=node('button',s.symbol+' '+s.name+(s.id==='all'?'':' · '+count));b.type='button';b.dataset.shapeFilter=s.id;b.setAttribute('aria-pressed',String((state.shapeFilter??'all')===s.id));b.onclick=()=>{state.shapeFilter=s.id;key='';refresh();draw();};buttons.append(b);}const selected=shapeCollection.find(s=>s.id===state.shapeFilter);heading.textContent='Shape filter · '+(selected?selected.symbol+' '+selected.name:'All');const matches=selected?stops.filter(s=>state.activeStops.includes(s.id)&&s.shape===selected.id):[];info.textContent=selected?matches.length?matches.map(s=>s.name).join(' · '):'Unlocked, but no cities with this shape have opened yet.':'Common shapes repeat often. A rarer shape joins the collection every 5 rounds.';focus.hidden=!matches.length;}
 return {refresh};
}
