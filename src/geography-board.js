// Touch and keyboard activities. Session state is local to the open player,
// independent of lesson marks, timers and stored student progress.
const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
export function initialBoardState(spec){return {placements:{},order:[],selected:null,round:0,choice:null,point:null,values:spec.allocations?.slice()||[],picks:[],checked:false,reveal:false};}
const questionFor=(spec,state)=>spec.rounds?.[state.round]||spec.question;
export function evaluateBoard(spec,state){
 if(spec.type==='sort')return {complete:spec.items.every(i=>state.placements[i.id]!==undefined),correct:spec.items.every(i=>state.placements[i.id]===i.answer)};
 if(spec.type==='sequence')return {complete:state.order.length===spec.items.length,correct:state.order.every((id,i)=>spec.items.find(x=>x.id===id)?.answer===i)&&state.order.length===spec.items.length};
 if(spec.type==='decision')return {complete:state.choice!==null,correct:state.choice===questionFor(spec,state).answer};
 if(spec.type==='pin')return {complete:!!state.point,correct:!!state.point&&state.point.every((v,i)=>v===spec.target[i])};
 if(spec.type==='allocation'){const total=state.values.reduce((a,b)=>a+b,0);return {complete:true,correct:total<=spec.limit&&state.values.every((v,i)=>v>=spec.minimum[i]),total};}
 if(spec.type==='budget'){const total=state.picks.reduce((sum,i)=>sum+spec.costs[i],0);return {complete:state.picks.length>0,correct:state.picks.length>0&&total<=spec.limit,total};}
 throw new Error('Unknown Geography board type: '+spec.type);
}
export function createGeographyBoard(spec,state=initialBoardState(spec)){
 const root=el('section',undefined,'geo-board');
 let focusLabel=null;
 const act=(label,fn,cls)=>{const b=el('button',label,cls);b.type='button';b.dataset.boardFocus=label;b.addEventListener('click',()=>{focusLabel=label;fn();});return b;};
 const change=fn=>{fn();state.checked=false;state.reveal=false;render();};
 const shuffled=items=>items.map((x,i)=>({x,k:(i*3+2)%items.length})).sort((a,b)=>a.k-b.k||b.x.id.localeCompare(a.x.id)).map(x=>x.x);
 const showReason=()=>{const box=el('div',undefined,'board-reason');box.append(el('h3','Explain the reasoning'),el('p',spec.type==='decision'?questionFor(spec,state).explanation:spec.rationale),el('p',spec.challenge));if(spec.type==='pin')box.append(el('p',`Target message: ${spec.square[0]}${spec.target[0]}${spec.square[1]}${spec.target[1]}. Keep the easting and its tenths together, then the northing and its tenths.`));return box;};
 function render(){
  root.replaceChildren();
  root.append(el('p',spec.facilitation,'board-instructions'));
  const q=questionFor(spec,state);
  if(spec.type==='decision'&&spec.rounds?.length>1)root.append(el('p',`Case ${state.round+1} of ${spec.rounds.length} · ${state.round?'A condition has changed. Reconsider the evidence.':'Make and defend a prediction.'}`,'board-case'));
  const prompt=spec.type==='sort'?'Tap a card, then its category. Tap a placed card to move it.':spec.type==='sequence'?'Tap cards in order. Use Undo to revise your sequence.':spec.type==='pin'?`In square ${spec.square.join('')}, place the marker ${spec.target[0]} tenths east and ${spec.target[1]} tenths north.`:spec.type==='allocation'?`Supply: ${spec.limit} water units. Classroom constraints: homes at least 20; ecosystem at least 20. Negotiate the rest.`:spec.type==='budget'?`Budget: ${spec.limit} tokens. Select a package, then defend its suitability.`:q.prompt;
  root.append(el('h3',prompt,'board-prompt'));
  if(spec.type==='decision'){
   const choices=el('div',undefined,'board-choices');
   // Alternate answer positions by activity id; never train “choose the first”.
   const indices=(spec.id.charCodeAt(0)+state.round)%2?[1,0]:[0,1];
   for(const i of indices){const b=act(q.choices[i],()=>change(()=>{state.choice=i;}),'board-choice');b.setAttribute('aria-pressed',String(state.choice===i));choices.append(b);}root.append(choices);
  }else if(['sort','sequence'].includes(spec.type)){
   const tray=el('div',undefined,'board-tray');
   for(const item of shuffled(spec.items)){
    const placed=spec.type==='sort'?state.placements[item.id]!==undefined:state.order.includes(item.id);
    if(placed)continue;
    const b=act(item.label,()=>change(()=>{if(spec.type==='sort')state.selected=item.id;else state.order.push(item.id);}),'board-card');b.dataset.card=item.id;b.setAttribute('aria-pressed',String(state.selected===item.id));tray.append(b);
   }root.append(tray);
   if(spec.type==='sort'){
    const bins=el('div',undefined,'board-bins');
    spec.groups.forEach((name,i)=>{const bin=el('section',undefined,'board-bin');const target=act(name,()=>change(()=>{if(state.selected!==null){state.placements[state.selected]=i;state.selected=null;}}),'board-bin-target');target.disabled=state.selected===null;target.dataset.group=i;bin.append(target);
     for(const item of spec.items.filter(x=>state.placements[x.id]===i)){const b=act(item.label,()=>change(()=>{delete state.placements[item.id];state.selected=item.id;}),'board-card placed');b.dataset.placed=item.id;if(state.checked)b.append(el('span',item.answer===i?' ✓':' · Reconsider'));bin.append(b);}bins.append(bin);});root.append(bins);
   }else{
    const chain=el('ol',undefined,'board-chain');state.order.forEach((id,i)=>{const item=spec.items.find(x=>x.id===id);chain.append(el('li',item.label+(state.checked?(item.answer===i?' ✓':' · Reconsider position'):'')));});root.append(chain,act('Undo last card',()=>change(()=>{state.order.pop();}),'board-undo'));
   }
  }else if(spec.type==='pin'){
   const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 620 550');svg.setAttribute('role','img');svg.setAttribute('aria-label','Grid square: east to the right; north upwards. Use the coordinate controls as a keyboard alternative.');svg.classList.add('board-grid');
   for(let i=0;i<=10;i++)for(const [x1,y1,x2,y2]of [[70+i*45,30,70+i*45,480],[70,30+i*45,520,30+i*45]]){const l=document.createElementNS(ns,'line');for(const [k,v]of Object.entries({x1,y1,x2,y2,stroke:'#819c91','stroke-width':i===0||i===10?3:1}))l.setAttribute(k,v);svg.append(l);}
   for(const [x,y,s]of [[60,510,String(spec.square[0])],[510,510,String(spec.square[0]+1)],[32,485,String(spec.square[1])],[32,40,String(spec.square[1]+1)],[260,535,'EAST →'],[75,22,'NORTH ↑']]){const t=document.createElementNS(ns,'text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('font-size',18);t.textContent=s;svg.append(t);}
   if(state.point){const c=document.createElementNS(ns,'circle');c.setAttribute('cx',70+45*state.point[0]);c.setAttribute('cy',480-45*state.point[1]);c.setAttribute('r',12);c.setAttribute('fill','#b13e17');svg.append(c);}
   svg.addEventListener('pointerdown',e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const m=svg.getScreenCTM();if(!m)return;const v=p.matrixTransform(m.inverse());if(v.x<70||v.x>520||v.y<30||v.y>480)return;change(()=>{state.point=[Math.min(9,Math.max(0,Math.round((v.x-70)/45))),Math.min(9,Math.max(0,Math.round((480-v.y)/45)))];});});
   const area=el('div',undefined,'board-pin-area'),controls=el('div',undefined,'board-coordinate-controls');
   ['Tenths east','Tenths north'].forEach((label,i)=>{const row=el('div');row.append(el('p',label+': '+(state.point?.[i]??'not placed')));for(const delta of [-1,1])row.append(act(`${label} ${delta<0?'−':'+'}`,()=>change(()=>{state.point||=[0,0];state.point[i]=Math.max(0,Math.min(9,state.point[i]+delta));})));controls.append(row);});area.append(svg,controls);root.append(area);
  }else if(spec.type==='allocation'){
   const cards=el('div',undefined,'board-allocations');spec.labels.forEach((label,i)=>{const card=el('section');card.append(el('h3',label),el('p',String(state.values[i]),'board-value'));for(const d of [-5,5]){const b=act(`${label} ${d>0?'+5':'−5'}`,()=>change(()=>{state.values[i]=Math.max(0,Math.min(spec.limit,state.values[i]+d));}));b.disabled=d<0?state.values[i]===0:state.values[i]>=spec.limit;card.append(b);}cards.append(card);});root.append(cards,el('p',`Allocated: ${state.values.reduce((a,b)=>a+b,0)} / ${spec.limit} units`,'board-total'));
  }else if(spec.type==='budget'){
   const cards=el('div',undefined,'board-choices');spec.labels.forEach((name,i)=>{const b=act(`${name} · ${spec.costs[i]} tokens`,()=>change(()=>{state.picks=state.picks.includes(i)?state.picks.filter(x=>x!==i):[...state.picks,i];}),'board-choice');b.setAttribute('aria-pressed',String(state.picks.includes(i)));cards.append(b);});root.append(cards,el('p',`Selected cost: ${evaluateBoard(spec,state).total} / ${spec.limit} tokens`,'board-total'));root.append(el('p','Several packages may be feasible. Affordability is only the first check.'));
  }
  const footer=el('div',undefined,'board-actions');footer.append(act('Check reasoning',()=>{state.checked=true;render();}));
  footer.append(act('Reset activity',()=>{Object.assign(state,initialBoardState(spec));render();}));root.append(footer);
  if(state.checked){const r=evaluateBoard(spec,state);let message=!r.complete?'Finish the choices before checking.':r.correct?'This fits the stated conditions. Explain why.':'Reconsider your choices. Discuss the evidence, then try again.';
   if(spec.type==='allocation')message+=` Total ${r.total}; limit ${spec.limit}. Homes and ecosystem each need at least 20 in this fictional exercise. A feasible allocation still needs a justification.`;
   if(spec.type==='budget')message+=` Cost ${r.total}; budget ${spec.limit}.`;
   if(spec.type==='pin'&&r.complete)message+=` Your message: ${spec.square[0]}${state.point[0]}${spec.square[1]}${state.point[1]}.`;
   const feedback=el('p',message,'board-feedback');feedback.setAttribute('role','status');root.append(feedback);
   if(r.complete){root.append(act(state.reveal?'Hide explanation':'Reveal explanation',()=>{state.reveal=!state.reveal;render();}));if(state.reveal){root.append(showReason());if(spec.type==='budget')spec.notes.forEach((n,i)=>root.append(el('p',spec.labels[i]+': '+n)));if(spec.type==='sort')root.append(el('p',spec.items.map(i=>`${i.label} → ${spec.groups[i.answer]}`).join(' · ')));if(spec.type==='sequence')root.append(el('p',spec.items.map(i=>i.label).join(' → ')));}}
  }
  if(spec.type==='decision'&&state.checked&&state.choice!==null&&state.round<(spec.rounds?.length||1)-1)root.append(act('Next changed case →',()=>change(()=>{state.round++;state.choice=null;})));
  if(focusLabel){const target=[...root.querySelectorAll('button')].find(b=>b.dataset.boardFocus===focusLabel&&!b.disabled)||root.querySelector('.board-bin-target:not(:disabled),.board-card,.board-choice,.board-actions button');target?.focus({preventScroll:true});}
 }
 render();return root;
}
