import {lessons,getLesson} from '../src/lessons.js';
import {worksheetFor} from '../src/worksheets.js';
import {createVisual} from '../src/visuals.js';
const params=new URLSearchParams(location.search),lesson=getLesson(params.get('lesson')),kind=params.get('kind')==='homework'?'homework':'lesson';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text.replace(/([a-z])(\d)/g,'$1 $2');if(cls)n.className=cls;return n;};
const paper=document.querySelector('#paper');
if(!lesson){paper.append(el('h1','Choose a lesson first'),el('p','Open Teacher tools in a lesson, then choose the lesson or homework worksheet.'));}
else{
 document.body.classList.add(kind==='homework'?'homework':'classwork');
 const data=worksheetFor(lesson,kind,lessons);document.title=`${kind==='homework'?'Homework':'Lesson worksheet'} · ${lesson.title}`;
 const print=document.querySelector('#print');print.hidden=false;print.onclick=()=>window.print();
 const other=document.querySelector('#switch');other.hidden=false;other.href=`?lesson=${encodeURIComponent(lesson.id)}&kind=${kind==='homework'?'lesson':'homework'}`;other.textContent=kind==='homework'?'Lesson worksheet':'Homework worksheet';
 const diagrams={'g7b-uk':'g7b-uk','g7b-valley':'g7b-valley','g7b-cycle':'g7b-cycle','g7b-bend':'g7b-bend','2.4':'g7-plan','2.5':'g7-grid','2.8':'g7-profile','2.9':'g7-world'};
 function source(lines,parent){if(!lines?.length)return;const box=el('section',null,'source');box.append(el('h3','Source / information'));for(const line of [...new Set(lines)])box.append(el('p',line));parent.append(box);}
 for(const [i,page]of data.pages.entries()){
  const sheet=el('article',null,'sheet');sheet.append(el('p',`Oxford International School · ${kind==='homework'?'Optional homework':'Optional lesson worksheet'}`,'eyebrow'),el('h1',data.title),el('p','Name: __________________________  Class: __________  Date: __________','identity'),el('p',data.note,'note'));
  if(data.reference)sheet.append(el('p',data.reference,'reference'));
  sheet.append(el('h2',page.title));source(page.sources,sheet);
  if(page.visualFrame){const f=page.visualFrame;if(f.lessonVisual){const visual=createVisual(f.lessonVisual);visual.querySelector('.visual-controls')?.remove();sheet.append(visual);}else if(f.diagram||f.visual==='schoolyard'){const name=f.visual==='schoolyard'?'schoolyard':diagrams[f.diagram];if(name){const img=el('img');img.src='../assets/'+name+'.svg';img.alt='Lesson source diagram';img.className='source-diagram';sheet.append(img);}}}
  for(const item of page.sections){const section=el('section',null,'task');section.append(el('h3',item.title));source(item.sources,section);for(const line of item.lines)section.append(el('p',line));const drawing=/draw|sketch|plot|create.*diagram/i.test(item.lines.join(' '));const space=el('div',null,'answer-space'+(drawing?' drawing-space':''));space.setAttribute('aria-label','Space for your answer or diagram');for(let n=0;n<item.space;n++)space.append(el('div',null,'answer-line'));section.append(space);sheet.append(section);}
  sheet.append(el('footer',`Mr. Friend · ${kind==='homework'?'Homework':'Lesson'} · Section ${i+1} of ${data.pages.length}`));paper.append(sheet);
 }
}
