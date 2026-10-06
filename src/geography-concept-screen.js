import {atlasArt} from './geography-atlas.js';
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
function vocabularyPicture(kind){
 const visual=node('div',null,'concept-word-art concept-word-picture');
 if(kind==='island'){
  visual.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 280" role="img" aria-label="An island with water surrounding every side"><rect width="360" height="280" fill="#e3f1f7"/><g fill="none" stroke="#87bccd" stroke-width="3" stroke-linecap="round"><path d="M25 55q15 12 30 0t30 0M240 45q15 12 30 0t30 0M20 140q15 12 30 0M295 145q15 12 30 0M35 240q15 12 30 0t30 0M240 230q15 12 30 0t30 0"/></g><path d="M95 95Q135 48 197 73T264 130Q290 173 245 201T153 215Q76 211 80 163T95 95Z" fill="#e8cf91" stroke="#d0b275" stroke-width="2"/><path d="M105 105Q145 65 195 85T252 136Q274 170 237 190T156 203Q90 198 93 163T105 105Z" fill="#81b595"/><path d="M141 154l22-38 23 38Z" fill="#4c8776"/><path d="M175 157l20-29 20 29Z" fill="#5d9780"/><text x="180" y="258" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#294f54">Water on every side</text></svg>';
 }else{
  visual.innerHTML=atlasArt({labels:false,highlight:kind});
  const svg=visual.querySelector('svg');svg.setAttribute('viewBox','185 50 340 420');
  svg.querySelector('rect').setAttribute('width','720');svg.querySelector('rect').setAttribute('height','520');
  for(const n of [...svg.querySelector(':scope > g').children])if(!n.matches('path[data-country]'))n.remove();
  svg.setAttribute('aria-label',kind==='uk'?'Map highlighting the four UK countries, including Northern Ireland':'Map highlighting England, Scotland and Wales on Great Britain; Northern Ireland is grey');
  visual.append(node('span',kind==='uk'?'4 countries':'3 countries · 1 island','concept-map-badge'));
 }
 return visual;
}
function art(spec){const figure=node('figure',null,'concept-art'+(spec.contain?' concept-art-labelled':''));const img=node('img');img.src='./assets/'+spec.image;img.alt=spec.alt;img.decoding='async';figure.append(img,node('figcaption',spec.caption));return figure;}
function card(title,text,cls){const root=node('aside',null,cls);root.append(node('strong',title),node('p',text));return root;}
function enlargeVocabularyCard(tile){
 const dialog=node('dialog',null,'concept-vocabulary-modal');
 dialog.setAttribute('aria-labelledby','enlarged-vocabulary-title');
 const close=node('button','Close ×','concept-vocabulary-close');close.type='button';close.onclick=()=>dialog.close();
 const enlarged=tile.cloneNode(true);enlarged.classList.remove('concept-word-interactive');
 for(const attr of ['role','tabindex','aria-haspopup','aria-label'])enlarged.removeAttribute(attr);
 enlarged.querySelector('h3').id='enlarged-vocabulary-title';
 dialog.append(close,enlarged);
 dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
 });
 dialog.addEventListener('close',()=>{dialog.remove();if(tile.isConnected)tile.focus();},{once:true});
 document.body.append(dialog);dialog.showModal();close.focus();
}
export function createConceptScreen(lesson,stage,frame,copy,evidence){
 const root=node('section',null,'teaching-content geo-concept-content concept-'+frame.conceptSection);root.setAttribute('aria-labelledby','student-title');
 root.append(node('h2',stage.title,'concept-section-title'));
 const body=node('div',null,'concept-body');root.append(body);copy.classList.add('concept-copy');
 const tools=node('details',null,'concept-tools');tools.append(node('summary','Teaching aids'));
 for(const control of [...copy.querySelectorAll(':scope > .text-button,:scope > .geo-frame-actions,:scope > .question-bank-button,:scope > .board-work-button,:scope > .geo-enlarge')])tools.append(control);
 if(tools.children.length>1)copy.append(tools);
 if(frame.vocabularyCards){
  const grid=node('div',null,'concept-vocabulary');
  for(const [i,v]of frame.vocabularyCards.entries()){
   const tile=node('article',null,'concept-word');
   const visual=v.picture?vocabularyPicture(v.picture):node('div',null,'concept-word-art');
   if(!v.picture){visual.style.backgroundImage=`linear-gradient(0deg,#102c4c30,#102c4c05),url("./assets/${v.image||frame.geoArt.image}")`;visual.style.backgroundPosition=`${i*50}% center`;if(!v.image)visual.append(node('span',v.symbol,'concept-word-symbol'));}
   tile.append(visual,node('h3',v.term));
   if(v.zh||v.ru){const translations=node('div',null,'concept-word-translations');for(const [lang,text]of [['zh-Hans',v.zh],['ru',v.ru]])if(text){const line=node('p',text);line.lang=lang;translations.append(line);}tile.append(translations);}
   tile.append(node('p',v.meaning));
   if(lesson.id==='g7b-geo-w01-2'){
    tile.classList.add('concept-word-interactive');tile.tabIndex=0;tile.setAttribute('role','button');tile.setAttribute('aria-haspopup','dialog');tile.setAttribute('aria-label','Enlarge '+v.term+' vocabulary card');
    tile.onclick=()=>enlargeVocabularyCard(tile);
    tile.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();enlargeVocabularyCard(tile);}};
   }
   grid.append(tile);
  }
  copy.querySelector('.instructions')?.remove();copy.querySelector('h1').hidden=true;body.append(grid,copy);root.classList.add('concept-wide');
 }else{
  const useArt=frame.conceptLayout==='artwork'||frame.conceptLayout!=='evidence'&&(['begin','goal','finish','assessment'].includes(frame.conceptSection)||!frame.geoDisplay);body.append(useArt?art(frame.geoArt):evidence(),copy);
 }
 if(frame.successCriteria){const criteria=node('div',null,'concept-success');frame.successCriteria.forEach((text,i)=>criteria.append(card('0'+(i+1),text,'concept-success-card')));root.append(criteria);}
 if(frame.modelSteps){const steps=node('ol',null,'concept-model-steps');frame.modelSteps.forEach(text=>steps.append(node('li',text)));copy.insertBefore(steps,copy.querySelector('.instructions'));}
 if(frame.supportText)copy.append(card('Sentence support',frame.supportText,'concept-support'));
 if(frame.challengeText)copy.append(card('Challenge',frame.challengeText,'concept-challenge'));
 if(frame.takeaways)copy.append(card('Remember',frame.takeaways.join(' • '),'concept-takeaway'));
 if(frame.homework)copy.append(card('Homework',frame.homework,'concept-homework'));
 if(frame.recallCue)root.append(node('p',frame.recallCue,'concept-rehearsal'));
 return root;
}
