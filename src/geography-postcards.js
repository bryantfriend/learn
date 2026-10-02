import {atlasArt,ukCountries,countryColours} from './geography-atlas.js';
import {ukMapPaths} from './uk-map-paths.js';
import {makeDraggable} from './board-drag.js';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
export const postcards=[
 {id:'london',city:'London',answer:'England',clue:'I am in the UK capital, on Great Britain. My country is south of Scotland.',detail:'London is in England. England lies south of Scotland on Great Britain.',icon:'clock'},
 {id:'cardiff',city:'Cardiff',answer:'Wales',clue:'I am in a capital city west of England, on the same island.',detail:'Cardiff is in Wales, west of England on Great Britain.',icon:'castle'},
 {id:'edinburgh',city:'Edinburgh',answer:'Scotland',clue:'I am in a capital city north of England, on Great Britain.',detail:'Edinburgh is in Scotland, north of England on Great Britain.',icon:'hill'},
 {id:'belfast',city:'Belfast',answer:'Northern Ireland',clue:'I am in a UK capital city on the island of Ireland, across the Irish Sea from Great Britain.',detail:'Belfast is in Northern Ireland, on the island of Ireland. Northern Ireland is part of the UK.',icon:'crane'}
];
function picture(icon){
 const art={clock:'<path d="M55 90V30H95V90M50 30H100L75 8Z" fill="#e6bc76"/><circle cx="75" cy="44" r="10" fill="#fff9dd"/><path d="M75 37V44H81M68 90V66H83V90"/>',castle:'<path d="M25 90V35H40V45H50V35H65V90M100 90V35H115V45H125V35H140V90M65 58H100V90H65Z" fill="#d6b391"/><path d="M77 90V72Q83 61 90 72V90"/>',hill:'<path d="M5 90L70 30L160 90" fill="#87aa70"/><path d="M50 67V25H65V35H80V25H95V67Z" fill="#b7a889"/>',crane:'<path d="M40 90V24H135M36 24L90 8L135 24M100 24V64M85 90V35M30 90H50" fill="none" stroke-width="5"/><path d="M12 95H150" stroke="#4a96ad" stroke-width="9"/>'};
 return `<svg viewBox="0 0 170 105" aria-hidden="true"><rect width="170" height="105" fill="#d7edf5"/><circle cx="140" cy="20" r="12" fill="#f3d389"/><g stroke="#77664e" stroke-width="2">${art[icon]}</g></svg>`;
}
function outline(name){return `<svg viewBox="200 30 300 440" aria-hidden="true"><path d="${ukMapPaths[name]}" fill="${countryColours[name]}" stroke="#426c60" stroke-width="2"/></svg>`;}
export function initialPostState(){return {placements:{},selected:null,checked:false,round:0,cities:true};}
export function checkPostcards(state){return postcards.every(c=>state.placements[c.id]===c.answer);}
export function createPostcardGame(spec,state=initialPostState()){
 const root=el('section',null,'post-office');root.classList.add(spec.mode==='sorting'?'island-office':'postcard-office');
 const sorting=spec.mode==='sorting';let focus=null;
 const button=(name,fn,cls)=>{const b=el('button',name,cls);b.type='button';b.onclick=()=>{focus=name;fn();render();};return b;};
 let items=[];
 const place=(id,target)=>{state.placements[id]=target;state.selected=null;state.checked=false;};
 function render(){
  root.replaceChildren();
  items=sorting?[...ukCountries,'Ireland'].map((name,i)=>({id:String(i),name,answer:state.round?(name==='Ireland'?'Outside the UK':'In the UK'):['England','Scotland','Wales'].includes(name)?'Great Britain':'Island of Ireland'})):postcards.slice(state.round*2,state.round*2+2);
  root.append(el('p',sorting?(state.round?'Round 2 · Same places, a different question: which are in the UK?':'Round 1 · Sort the country outlines by island.'):spec.teacherLed?`Teacher demonstration ${state.round+1} · Read a clue, explain it and point to the country.`:`Mission ${state.round+1} of 2 · ${state.round?'Swap jobs: explain, then deliver.':'One reader, one map detective. Deliver these two postcards.'}`,'post-mission'));
  root.append(el('p','Drag a card to a destination, or tap a card then tap a destination. Placed cards can be moved again.','post-help'));
  const layout=el('div',null,'post-layout'),map=el('div',null,'post-map'),tray=el('div',null,'post-tray');
  map.innerHTML=atlasArt({labels:true,cities:!sorting});
  const destinations=sorting?(state.round?['In the UK','Outside the UK']:['Great Britain','Island of Ireland']):ukCountries;
  const targets=el('div',null,'post-targets');
  if(sorting)destinations.forEach((name,i)=>{
   const target=button(name,()=>{if(state.selected!==null)place(state.selected,name);},'post-destination');target.dataset.drop=name;target.dataset.group=i;
   if(sorting){const art=el('span',null,'island-mini');art.innerHTML=atlasArt({labels:false,highlight:name==='Great Britain'?'gb':name==='In the UK'?'uk':name==='Outside the UK'?'Ireland':'ireland-island'});target.prepend(art);}
   const assigned=items.filter(c=>state.placements[c.id]===name);if(assigned.length)target.append(el('span',assigned.map(c=>sorting?c.name:c.city).join(' · '),'delivered-list'));targets.append(target);
  });
  if(sorting)map.append(targets);
  else {
   map.querySelector('svg').setAttribute('role','group');
   map.querySelector('svg').setAttribute('aria-label','Delivery map. Select a postcard then choose its country outline.');
   for(const path of map.querySelectorAll('[data-country]')){
    const name=path.dataset.country;if(!ukCountries.includes(name))continue;
    path.dataset.drop=name;path.setAttribute('role','button');path.setAttribute('tabindex','0');path.setAttribute('aria-label','Deliver to '+name);
    const deliver=()=>{if(state.selected!==null){place(state.selected,name);render();root.querySelector(`[data-drop="${name}"]`).focus({preventScroll:true});}};
    path.onclick=deliver;path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();deliver();}};
   }
   // Keep labels and delivery stamps from intercepting taps or pointer drops.
   map.querySelectorAll('text,circle,g>path:not([data-country])').forEach(n=>n.style.pointerEvents='none');
   const pins={'England':[432,356],'Wales':[355,365],'Scotland':[357,179],'Northern Ireland':[305,268]};
   for(const c of items){const target=state.placements[c.id];if(!pins[target])continue;const [x,y]=pins[target];const stamp=document.createElementNS('http://www.w3.org/2000/svg','g');stamp.classList.add('post-delivery');stamp.setAttribute('transform',`translate(${x} ${y})`);stamp.innerHTML='<rect x="-12" y="-8" width="24" height="16" rx="3" fill="#fff7d8" stroke="#853f25" stroke-width="2"/><path d="M-12-8L0 1L12-8" fill="none" stroke="#853f25" stroke-width="2"/>';map.querySelector('svg').append(stamp);}
  }
  layout.append(map,tray);
  for(const c of items){
   const card=button('',()=>{state.selected=state.selected===c.id?null:c.id;state.checked=false;},sorting?'country-postcard':'picture-postcard');card.setAttribute('aria-label',sorting?c.name:`Postcard from ${c.city}`);card.setAttribute('aria-pressed',String(state.selected===c.id));card.dataset.card=c.id;
   const art=el('span',null,'post-picture');art.innerHTML=sorting?outline(c.name):picture(c.icon);card.append(art,el('strong',sorting?c.name:'Greetings from '+c.city));
   if(!sorting)card.append(el('span',c.clue,'post-clue'),el('span','Illustrated city postcard','post-stamp'));
   const placed=state.placements[c.id];if(placed!==undefined){card.dataset.placed=c.id;card.append(el('span','→ '+placed,'post-address'));if(state.checked)card.append(el('span',placed===c.answer?'✓ Delivered':'Try a different destination','post-result'));}
   makeDraggable(card,{id:c.id,root,drop:(id,target)=>{place(id,target);render();}});tray.append(card);
  }
  root.append(layout);
  const actions=el('div',null,'post-actions');actions.append(button('Check deliveries',()=>state.checked=true),button('Reset activity',()=>Object.assign(state,initialPostState())));
  if(sorting)actions.append(button(state.round?'Back to islands':'Next: UK membership',()=>{state.round=state.round?0:1;state.placements={};state.selected=null;state.checked=false;}));
  if(!sorting&&state.round===0){const next=button('Mission 2: swap jobs',()=>{state.round=1;state.selected=null;state.checked=false;});next.disabled=!state.checked||!items.every(c=>state.placements[c.id]===c.answer);actions.append(next);}
  if(!sorting&&state.round===1)actions.append(button('Revisit mission 1',()=>{state.round=0;state.selected=null;state.checked=false;}));
  root.append(actions);
  const status=el('p',null,'post-status');status.setAttribute('role','status');
  const complete=items.every(c=>state.placements[c.id]!==undefined),correct=items.filter(c=>state.placements[c.id]===c.answer).length;
  status.textContent=state.checked?(!complete?(sorting?'Place every country, then check again.':'Deliver both postcards, then check again.'):`${correct} of ${items.length} destinations match. `+(correct===items.length?(sorting?'Explain why Northern Ireland changes group when the question changes.':spec.teacherLed?'Your teacher explains the map clue. Continue only if another short demonstration is useful.':state.round?'All four delivered. Finish the game: invent a new two-clue address for your partner.':'Explain one map clue, then swap jobs for mission 2.'):'Use the map and address clues to repair a delivery.')):state.selected!==null?'Card selected. Tap its country on the map or drag it there.':'Choose a card to begin.';root.append(status);
  if(state.checked&&complete&&!sorting){const detail=el('details');detail.append(el('summary','Teacher: delivery explanations'));items.forEach(c=>detail.append(el('p',c.detail)));root.append(detail);}
  if(focus)[...root.querySelectorAll('button')].find(b=>b.textContent===focus)?.focus({preventScroll:true});
 }
 render();return root;
}
