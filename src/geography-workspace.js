import {createGeographyEvidence} from './geography-evidence.js';
const ns='http://www.w3.org/2000/svg',el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
export const initialWorkspaceState=(frame)=>({paths:[],colour:'#b34227',diagram:!!(frame?.geoDisplay?.atlas||frame?.geoDisplay?.workpad)});
export function createGeographyWorkspace(frame,state=initialWorkspaceState()){
 const root=el('section',null,'geo-workspace'),task=el('aside',null,'workspace-task'),tools=el('div',null,'workspace-tools'),surface=el('div',null,'workspace-surface');
 task.append(el('h3',frame.title));(frame.taskInstructions||frame.lines)?.forEach(t=>task.append(el('p',t)));
 if(typeof frame.sourceCard==='string'){const source=el('details');source.open=true;source.append(el('summary','Case evidence'),el('p',frame.sourceCard));task.append(source);}
 if(frame.explanation){const answer=el('details');answer.append(el('summary','Reveal teaching model'),el('p',frame.explanation));task.append(answer);}
 const button=(label,fn)=>{const b=el('button',label);b.type='button';b.onclick=fn;tools.append(b);return b;};
 const backdrop=el('div',null,'workspace-backdrop');surface.append(backdrop);
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 900 560');svg.setAttribute('aria-label','Drawing surface. Draw with a finger, pen or mouse, or use the typed class answer.');svg.setAttribute('role','img');svg.classList.add('workspace-ink');surface.append(svg);
 let drawing=null,activePointer=null;
 function draw(){svg.replaceChildren();for(const stroke of state.paths){const path=document.createElementNS(ns,'path');path.setAttribute('d',stroke.points.map(([x,y],i)=>(i?'L':'M')+x+','+y).join(' '));path.setAttribute('fill','none');path.setAttribute('stroke',stroke.colour);path.setAttribute('stroke-width','4');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.append(path);}}
 function point(event){const p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;const transform=svg.getScreenCTM();if(!transform)return null;const v=p.matrixTransform(transform.inverse());return [Math.round(v.x),Math.round(v.y)];}
 svg.addEventListener('pointerdown',e=>{if(e.button!==0||drawing)return;const p=point(e);if(!p)return;e.preventDefault();svg.setPointerCapture(e.pointerId);activePointer=e.pointerId;drawing={points:[p,[p[0]+.1,p[1]+.1]],colour:state.colour};state.paths.push(drawing);draw();});
 svg.addEventListener('pointermove',e=>{if(drawing&&e.pointerId===activePointer){const p=point(e);if(p){drawing.points.push(p);draw();}}});
 const finish=e=>{if(e.pointerId!==activePointer)return;drawing=null;activePointer=null;if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);};svg.addEventListener('pointerup',finish);svg.addEventListener('pointercancel',finish);svg.addEventListener('lostpointercapture',finish);
 button('Undo stroke',()=>{state.paths.pop();draw();});button('Clear drawing',()=>{state.paths=[];draw();});
 for(const [label,colour]of [['Red pen','#b34227'],['Blue pen','#19528b'],['Dark pen','#153d35']]){const b=button(label,()=>{state.colour=colour;tools.querySelectorAll('[data-colour]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.colour===colour)));});b.dataset.colour=colour;b.setAttribute('aria-pressed',String(state.colour===colour));}
 const updateBackdrop=()=>{backdrop.replaceChildren();if(state.diagram&&frame.geoDisplay){const evidence=createGeographyEvidence(frame.geoDisplay);const art=evidence.querySelector('svg');if(art)backdrop.append(art);}surface.classList.toggle('with-diagram',!!backdrop.childNodes.length);};
 if(frame.geoDisplay&&(!frame.geoDisplay.source||frame.geoDisplay.workpad))button('Show / hide diagram',()=>{state.diagram=!state.diagram;updateBackdrop();});
 const label=el('label','Class answer · typing alternative'),answer=el('textarea');answer.rows=3;answer.value=state.text||'';answer.setAttribute('aria-label','Class answer');answer.oninput=()=>state.text=answer.value;label.append(answer);
 const board=el('div',null,'workspace-board');board.append(tools,surface,label);root.append(task,board);updateBackdrop();draw();return root;
}
