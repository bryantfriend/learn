// Editable lesson prose; layouts, diagrams, IDs and classroom behaviour stay intact.
export const EDITS_KEY = 'learn.lesson-edits.v1';
const originals = new Map();
const copy = value => JSON.parse(JSON.stringify(value));
const fields = {
 lesson: ['title','subtitle','openingScript','starSuggestion'],
 stage: ['title','notes','script'],
 frame: ['title','kicker','lines','quote','cue','footnote','nextLabel','answer','answerText','explanation','choices']
};
function blocks(lesson) {
 const result=[{name:'Lesson',object:lesson,kind:'lesson'}];
 lesson.stages.forEach((stage,i)=>{
  result.push({name:`Stage ${i+1}`,object:stage,kind:'stage'});
  stage.frames.forEach((frame,j)=>{
   result.push({name:`Stage ${i+1} / Slide ${j+1}`,object:frame,kind:'frame'});
   if(frame.afterAttention)result.push({name:`Stage ${i+1} / Slide ${j+1} / After attention`,object:frame.afterAttention,kind:'frame'});
  });
 });return result;
}
function entries(block){
 const list=fields[block.kind].filter(key=>key==='title'||Object.hasOwn(block.object,key)).map(key=>({label:key,key}));
 (block.object.options||[]).forEach((option,i)=>list.push({label:`option ${option.id}`,key:'options',index:i}));
 return list;
}
function value(block,entry){return entry.index===undefined?block.object[entry.key]:block.object.options[entry.index].label;}
export function lessonToText(lesson){
 return blocks(lesson).map(block=>`[${block.name}]\n`+entries(block).map(entry=>{
  const raw=value(block,entry);const text=Array.isArray(raw)?raw.join('\n'):String(raw??'');
  return `${entry.label}: ${text.replace(/\n/g,'\n  ')}`;
 }).join('\n')).join('\n\n');
}
export function textToLesson(text,base){
 if(typeof text!=='string'||text.length>500000)throw Error('Use a lesson text under 500,000 characters.');
 const next=copy(base),allowed=new Map(blocks(next).map(block=>[block.name,block]));
 let current=null,last=null;const seen=new Set(),filled=new Set();
 const source=text.replace(/\r/g,'').trim().replace(/^```[^\n]*\n/,'').replace(/\n```$/,'');
 for(const [index,line] of source.split('\n').entries()){
  if(/^  /.test(line)&&last){last.text+='\n'+line.slice(2);continue;}
  if(!line.trim())continue;
  const heading=line.match(/^\[([^\]]+)\]$/);
  if(heading){const name=heading[1];if(!allowed.has(name)||seen.has(name))throw Error(`Line ${index+1}: unknown or repeated section [${name}]. Keep the template headings.`);current=allowed.get(name);seen.add(name);last=null;continue;}
  const match=line.match(/^([^:]+): ?(.*)$/);
  if(!current||!match)throw Error(`Line ${index+1}: use a section heading or a labelled field. Indent extra lines with two spaces.`);
  const entry=entries(current).find(item=>item.label===match[1]);
  const key=current.name+' / '+match[1];
  if(!entry||filled.has(key))throw Error(`Line ${index+1}: unknown or repeated field ${match[1]}.`);
  filled.add(key);last={block:current,entry,text:match[2]};current.values??=[];current.values.push(last);
 }
 for(const block of allowed.values()){
  if(!seen.has(block.name))throw Error(`Missing [${block.name}]. Paste the entire lesson, including all section headings.`);
  for(const entry of entries(block))if(!filled.has(block.name+' / '+entry.label))throw Error(`Missing ${entry.label}: in [${block.name}]. Keep the label; leave optional text blank to clear it.`);
  for(const item of block.values||[]){
   if(item.text.length>12000)throw Error(`${block.name}: shorten ${item.entry.label} to under 12,000 characters.`);
   if(item.entry.key==='title'&&!item.text.trim())throw Error(`${block.name}: a title is required.`);
   if(item.entry.index!==undefined){if(!item.text.trim())throw Error(`${block.name}: option labels cannot be empty.`);block.object.options[item.entry.index].label=item.text;}
   else block.object[item.entry.key]=Array.isArray(value(block,item.entry))?(item.text?item.text.split('\n'):[]):item.text;
  }
  const frame=block.object;
  if(frame.type==='question'&&frame.answer&&!frame.answerText){const ids=frame.options?.map(x=>x.id)||['A','B'];if(!ids.includes(frame.answer))throw Error(`${block.name}: answer must be ${ids.join(' or ')}.`);}
 }
 return next;
}
export function registerLessons(lessons,storage){
 let saved={};try{saved=JSON.parse(storage?.getItem(EDITS_KEY)||'{}')||{};}catch{}
 for(const lesson of lessons){originals.set(lesson.id,copy(lesson));const edit=saved[lesson.id];if(edit&&edit.baseRevision===(lesson.contentRevision||0)&&Number.isSafeInteger(edit.revision)){try{Object.assign(lesson,textToLesson(edit.text,lesson),{contentRevision:edit.revision});}catch{}}}
}
export function saveLessonText(lesson,text,storage){
 const base=originals.get(lesson.id),next=textToLesson(text,base);let saved;
 try{saved=JSON.parse(storage.getItem(EDITS_KEY)||'{}');if(!saved||Array.isArray(saved)||typeof saved!=='object')throw Error();}catch{throw Error('Lesson storage is unavailable. Download your text before closing.');}
 const revision=Date.now();saved[lesson.id]={text,revision,baseRevision:base.contentRevision||0};
 try{storage.setItem(EDITS_KEY,JSON.stringify(saved));}catch{throw Error('Could not save in this browser. Download your text before closing.');}
 Object.assign(lesson,next,{contentRevision:revision});return lesson;
}
export function originalLessonText(id){return lessonToText(originals.get(id));}
