const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
function art(spec){const figure=node('figure',null,'concept-art');const img=node('img');img.src='./assets/'+spec.image;img.alt=spec.alt;img.decoding='async';figure.append(img,node('figcaption',spec.caption));return figure;}
function card(title,text,cls){const root=node('aside',null,cls);root.append(node('strong',title),node('p',text));return root;}
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
   const visual=node('div',null,'concept-word-art');visual.style.backgroundImage=`linear-gradient(0deg,#102c4c30,#102c4c05),url("./assets/${v.image||frame.geoArt.image}")`;visual.style.backgroundPosition=`${i*50}% center`;if(!v.image)visual.append(node('span',v.symbol,'concept-word-symbol'));
   tile.append(visual,node('h3',v.term),node('p',v.meaning));grid.append(tile);
  }
  copy.querySelector('.instructions')?.remove();copy.querySelector('h1').hidden=true;body.append(grid,copy);root.classList.add('concept-wide');
 }else{
  const useArt=['begin','goal','finish','assessment'].includes(frame.conceptSection)||!frame.geoDisplay;body.append(useArt?art(frame.geoArt):evidence(),copy);
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
