import {atlasArt} from './geography-atlas.js';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
export const journeyRoutes=[
 {id:'A',name:'Ferry',cost:35,legs:[['coach','Coach to port',2],['checkin','Check-in',1],['ferry','Sea crossing',3],['coach','Onward coach',1]]},
 {id:'B',name:'Flight',cost:60,legs:[['coach','Coach to airport',2],['checkin','Check-in',2],['flight','Air crossing',1],['coach','Onward coach',1]]}
];
export function journeyFeasible(route,budget,cancelled){return route.cost<=budget&&!(route.id==='A'&&cancelled);}
export function createJourneyVisual(spec,onChange){
 const cfg=spec.journey,state={budget:45,cancelled:false,totals:{},choice:'',checked:false,step:0,...cfg.state};
 const root=el('figure',null,'geography-evidence journey-visual');
 const save=()=>onChange({...spec,journey:{...cfg,state:{...state,totals:{...state.totals}}}});
 const button=(label,fn)=>{const b=el('button',label);b.type='button';b.onclick=()=>{fn();save();render();};return b;};
 const image=(kind,alt)=>{const i=el('img');i.src='./assets/illustrations/journey-'+kind+'.png';i.alt=alt;i.decoding='async';return i;};
 function render(){
  root.replaceChildren();
  root.append(el('figcaption','Wales → Northern Ireland · fictional school journey'));
  if(cfg.view==='map'){
   const map=el('div',null,'journey-map');map.innerHTML=atlasArt({cities:true});root.append(map,el('p','Point to Wales, Northern Ireland and the Irish Sea. What needs to cross the water?'));
   const pictures=el('div',null,'journey-pair');pictures.append(image('ferry','Passenger ferry crossing the sea'),image('flight','Airplane crossing the sea'));root.append(pictures);
  }else if(cfg.view==='case'){
   const pictures=el('div',null,'journey-pair');pictures.append(image('ferry','Ferry option: check whether it is available'),image('flight','Flight option: check whether it is affordable'));root.append(pictures,el('p',spec.source||'Use the case source for its own figures.'));
  }else if(cfg.view==='worked'){
   const chain=el('div',null,'journey-chain');
   for(const [kind,name,hours]of [['coach','Coach',1],['checkin','Waiting',2],['ferry','Crossing',2]]){const card=el('div',null,'journey-leg');card.append(image(kind,name),el('strong',name),el('span',hours+' h'));chain.append(card);}
   root.append(el('p','Separate worked example · include the waiting'),chain,button('Reveal total',()=>state.step=1),button('Start again',()=>state.step=0),el('p',state.step?'1 + 2 + 2 = 5 hours. Waiting is part of the journey.':'Predict the total before your teacher reveals it.'));
  }else if(cfg.view==='exit'){
   const chain=el('div',null,'journey-chain');for(const [kind,name,hours]of [['coach','Coach',1],['checkin','Check-in',1],['ferry','Ferry',2],['coach','Coach',1]]){const c=el('div',null,'journey-leg');c.append(image(kind,name),el('strong',name),el('span',hours+' h'));chain.append(c);}root.append(chain,el('p','New journey: 42 tokens · budget 40. Add the time. Is it feasible?'));
  }else{
   const interactive=cfg.view==='planner';
   root.append(el('p','Include waiting. Check cost AND availability.','journey-rule'));
   for(const route of journeyRoutes){
    const row=el('section',null,'journey-route');row.append(el('h3',`${route.id} · ${route.name} · ${route.cost} tokens`));
    const chain=el('div',null,'journey-chain');
    for(const [kind,name,hours]of route.legs){const card=el('div',null,'journey-leg');card.append(image(kind,name),el('strong',name),el('span',hours+' h'));chain.append(card);}
    row.append(chain);
    if(interactive){const label=el('label',`${route.id} total hours `);const input=el('input');input.type='number';input.min='0';input.max='24';input.value=state.totals[route.id]??'';input.setAttribute('aria-label',`${route.id} total hours`);input.oninput=()=>{state.totals[route.id]=input.value;state.checked=false;feedback.textContent='';save();};label.append(input);row.append(label);}
    root.append(row);
   }
   if(interactive){
    const controls=el('div',null,'journey-controls');const label=el('label','Budget (tokens) '),budget=el('input');budget.type='number';budget.min='0';budget.max='100';budget.value=state.budget;budget.setAttribute('aria-label','Budget tokens');budget.oninput=()=>{state.budget=Math.max(0,Number(budget.value)||0);state.checked=false;feedback.textContent='';save();};label.append(budget);controls.append(label,button(state.cancelled?'Restore ferry':'Cancel ferry',()=>{state.cancelled=!state.cancelled;state.checked=false;}));
    root.append(controls,el('p',state.cancelled?'Ferry cancelled · route A unavailable':'Both services available in this model','journey-status'));
    const choices=el('div',null,'journey-controls');for(const [id,name]of [['A','Choose A'],['B','Choose B'],['none','Neither works']]){const b=button(name,()=>{state.choice=id;state.checked=false;});b.setAttribute('aria-pressed',String(state.choice===id));choices.append(b);}choices.append(button('Check plan',()=>state.checked=true),button('Reset planner',()=>Object.assign(state,{budget:45,cancelled:false,choice:'',totals:{},checked:false})));root.append(choices);
   }else if(spec.demo){
    root.append(button('Reveal next step',()=>state.step=Math.min(state.step+1,spec.demo.steps.length)),button('Start again',()=>state.step=0));root.append(el('p',state.step?spec.demo.steps[state.step-1]:'Predict a step before revealing the explanation.'));
   }
  }
  const feedback=el('p',null,'journey-feedback');feedback.setAttribute('aria-live','polite');
  if(state.checked){const correctTotals=journeyRoutes.every(r=>Number(state.totals[r.id])===r.legs.reduce((n,l)=>n+l[2],0));const feasible=journeyRoutes.filter(r=>journeyFeasible(r,state.budget,state.cancelled));const valid=state.choice==='none'?!feasible.length:feasible.some(r=>r.id===state.choice);feedback.textContent=!correctTotals?'Try the totals again: add all four legs, including check-in.':!state.choice?'Totals checked. Choose a route or “Neither works”.':valid?'Your plan meets the conditions. Explain the time, cost and availability.':`Revise your choice: ${feasible.length?'check the budget and service status.':'neither route works. Postpone, find another service or seek an authorised budget change.'}`;}
  root.append(feedback,el('p','Illustrations show the travel steps. All times, costs and service changes are invented classroom data.','journey-note'));
 }
 root.currentEvidenceState=()=>({...spec,journey:{...cfg,state}});render();return root;
}
