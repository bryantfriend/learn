import {geographyArt} from './geography-lab.js';
import {createAtlas,atlasArt} from './geography-atlas.js';
import {workpadArt} from './geography-workpads.js';
import {createJourneyVisual} from './journey-visual.js';
import {openCoastalGame} from './coastal-connections.js';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
export function createGeographyEvidence(spec,onChange=()=>{}){
 if(spec.transportConnections){
  const root=el('figure',null,'geography-evidence transport-connections');
  root.append(el('h3','Different transport for land and sea'));
  const pictures=el('div',null,'transport-picture-grid');
  for(const [kind,title,description]of [['coach','Road','Travel over land.'],['ferry','Ferry','Carry people across the sea.'],['flight','Flight','Fly across the sea.']]){
   const panel=el('article',null,'transport-picture-card'),img=el('img');
   img.src=`./assets/illustrations/journey-${kind}.png`;img.alt={coach:'Coach travelling on a road',ferry:'Passenger ferry crossing the sea',flight:'Airplane flying above the sea'}[kind];
   panel.append(img,el('h4',title),el('p',description));pictures.append(panel);
  }
  root.append(pictures,el('figcaption','A road alone cannot cross the sea. Use a ferry or a flight for the crossing.'));
  const play=el('button','Play Coastal Connections','transport-game-button');play.type='button';
  play.onclick=()=>openCoastalGame(spec.coastalState,state=>{spec={...spec,coastalState:state};onChange(spec);play.focus();});root.append(play);
  return root;
 }
 if(spec.journey)return createJourneyVisual(spec,onChange);
 if(spec.atlas)return createAtlas(spec.atlas,atlas=>onChange({...spec,atlas}));
 if(spec.kind==='uk'&&!spec.demo)return createAtlas({layers:spec.code==='3.2',physical:spec.code==='3.2',caption:spec.code==='3.2'?'Country boundaries and physical features answer different questions. Toggle the physical layer.':spec.caption},atlas=>onChange({...spec,atlas}));
 const root=el('figure',null,'geography-evidence');
 if(spec.demo){
  root.classList.add('geography-demo');
  const canvas=el('div',null,'evidence-canvas'),caption=el('p',null,'demo-step'),controls=el('div',null,'atlas-controls');let step=spec.demo.step??-1;
  caption.setAttribute('aria-live','polite');
  const [a,b]=spec.values||({ice:[9,6],flood:[30,60],grid:[6,2],scale:[6,20],distance:[4,100],'os-map':[2,250]}[spec.kind]||[6,20]);
  const update=()=>{canvas.innerHTML=spec.kind==='uk'?atlasArt({physical:spec.code==='3.2'}):geographyArt(spec.kind,spec.phase||0,a,b,spec.code);
   const labels=[...canvas.querySelectorAll('text')],visible=Math.ceil(labels.length*(step+1)/spec.demo.steps.length);
   labels.forEach((n,i)=>{n.style.visibility=i<visible?'visible':'hidden';if(i<visible)n.classList.add('demo-label');});
   caption.textContent=step<0?'Predict the first step. Tap Reveal next step when the class is ready.':`${step+1} / ${spec.demo.steps.length} · ${spec.demo.steps[step]}`;next.disabled=step>=spec.demo.steps.length-1;back.disabled=step<0;onChange({...spec,demo:{...spec.demo,step}});};
  const control=(label,fn)=>{const b=el('button',label);b.type='button';b.onclick=()=>{fn();update();};controls.append(b);return b;};
  const back=control('Previous step',()=>step--),next=control('Reveal next step',()=>step++);control('Start again',()=>step=-1);
  root.currentEvidenceState=()=>({...spec,demo:{...spec.demo,step}});
  root.append(canvas,caption,controls);update();return root;
 }
 if(spec.source){
  root.classList.add('source-evidence');root.append(el('figcaption',spec.title||'Your investigation evidence'));
  if(spec.workpad){const guide=el('div',null,'workpad-preview');guide.innerHTML=workpadArt(spec.workpad);root.append(guide);}
  // Keep exact case facts next to the task, never replace them with a generic model.
  const pieces=spec.source.split(/(?<=[.!?])\s+(?=[A-Z])/);
  pieces.forEach((s,i)=>{const p=el('p',null,'evidence-fact');p.append(el('span',String(i+1).padStart(2,'0'),'evidence-number'));const text=el('span');
   s.split(/(\d+(?:[.,]\d+)?(?:%|°[NSEW]|\s?(?:cm|mm|km|m|hours?|tokens?|units?))?)/g).forEach((part,j)=>text.append(j%2?el('mark',part):document.createTextNode(part)));p.append(text);root.append(p);});
  return root;
 }
 const canvas=el('div',null,'evidence-canvas');
 const values={ice:[9,6],flood:[30,60],grid:[6,2],scale:[6,20],distance:[4,100],'os-map':[2,250]};const [a,b]=spec.values||values[spec.kind]||[6,20];
 canvas.innerHTML=geographyArt(spec.kind,spec.phase||0,a,b,spec.code);
 root.append(canvas,el('figcaption',spec.caption||'Concept diagram: use the investigation source for its exact facts and figures.'));
 return root;
}
