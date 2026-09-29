const node=(tag,text,cls)=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;};
const escapeRegex=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function markVocabulary(root,vocabulary){
 if(!vocabulary)return;
 const keys=Object.keys(vocabulary).sort((a,b)=>b.length-a.length);
 const pattern=new RegExp(`(?<![A-Za-z])(${keys.map(escapeRegex).join('|')})(?![A-Za-z])`,'gi');
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),texts=[];
 while(walker.nextNode())if(!walker.currentNode.parentElement.closest('button,a,svg,textarea,input,[lang="zh-Hans"]'))texts.push(walker.currentNode);
 for(const text of texts){pattern.lastIndex=0;const matches=[...text.textContent.matchAll(pattern)];if(!matches.length)continue;
  const fragment=document.createDocumentFragment();let cursor=0;
  for(const m of matches){fragment.append(text.textContent.slice(cursor,m.index));const b=node('button',m[0],'vocab-word');b.type='button';b.dataset.vocab=m[0].toLowerCase();b.setAttribute('aria-label',m[0]+' — show Chinese meaning');b.addEventListener('click',()=>showVocabulary(m[0],vocabulary[m[0].toLowerCase()]));fragment.append(b);cursor=m.index+m[0].length;}
  fragment.append(text.textContent.slice(cursor));text.replaceWith(fragment);
 }
}
export function showVocabulary(word,entry){
 const dialog=document.createElement('dialog');dialog.className='vocabulary-dialog';dialog.setAttribute('aria-labelledby','vocabulary-title');
 const h=node('h2',word);h.id='vocabulary-title';const close=node('button','Close ×','vocabulary-close');close.type='button';close.addEventListener('click',()=>dialog.close());
 const zh=node('p',entry.zh,'vocabulary-chinese');zh.lang='zh-Hans';
 dialog.append(close,h,zh,node('p',entry.pinyin,'vocabulary-pinyin'),node('p',entry.meaning),node('p',entry.example,'vocabulary-example'));
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>dialog.remove(),{once:true});document.body.append(dialog);dialog.showModal();close.focus();
}
export function createConversationCards(spec,vocabulary){
 let index=0,phrases=true,example=false;
 const root=node('section','','conversation-cards');
 const button=(label,fn)=>{const b=node('button',label);b.type='button';b.addEventListener('click',fn);return b;};
 function render(){const round=spec.rounds[index];root.replaceChildren();
  root.append(node('p',`${index+1} / ${spec.rounds.length} · Everyone speaks with a partner.`,'conversation-count'),node('h3',round.title),node('p',round.scenario,'conversation-scenario'));
  const roles=node('div','','conversation-roles');roles.append(node('p','A · '+round.roleA),node('p','B · '+round.roleB));root.append(roles,node('p',round.challenge,'conversation-challenge'));
  const controls=node('div','','conversation-controls');
  const phraseButton=button(phrases?'Hide helpful phrases':'Show helpful phrases',()=>{phrases=!phrases;render();root.querySelector('[data-phrases]').focus();});phraseButton.dataset.phrases='';phraseButton.setAttribute('aria-expanded',String(phrases));controls.append(phraseButton);
  const exampleButton=button(example?'Hide example':'Show one example',()=>{example=!example;render();root.querySelector('[data-example]').focus();});exampleButton.dataset.example='';exampleButton.setAttribute('aria-expanded',String(example));controls.append(exampleButton);
  root.append(controls);
  if(phrases){const list=node('div','','conversation-support');round.support.forEach(s=>list.append(node('p',s)));root.append(list);}
  if(example){const list=node('div','','conversation-example');round.example.forEach(s=>list.append(node('p',s)));root.append(list);}
  const nav=node('div','','conversation-controls');const prev=button('← Previous round',()=>{index--;example=false;render();root.querySelector('h3').focus();}),next=button('Next round →',()=>{index++;example=false;render();root.querySelector('h3').focus();});prev.disabled=index===0;next.disabled=index===spec.rounds.length-1;nav.append(prev,next);root.append(nav);root.querySelector('h3').tabIndex=-1;
  markVocabulary(root,vocabulary);
 }
 render();return root;
}
