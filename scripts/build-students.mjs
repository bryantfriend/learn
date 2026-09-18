import fs from 'node:fs';
import {lessons,questionOptions} from '../src/lessons.js';
import {visualSpec} from '../src/visuals.js';
const diagrams={'g7b-uk':'g7b-uk','g7b-valley':'g7b-valley','g7b-cycle':'g7b-cycle','g7b-bend':'g7b-bend','2.4':'g7-plan','2.5':'g7-grid','2.8':'g7-profile','2.9':'g7-world'};
const adapt=text=>String(text||'').replace(/Use the textbook source/gi,'Use the study notes and diagrams').replace(/from the textbook/gi,'from the study notes and diagrams').replace(/Practise two examples together, then complete one independently\./g,'Study two examples, then explain one in your own words.').replace(/Exchange work\./g,'Review your work.').replace(/Explain it to a partner/gi,'Explain it in your own words').replace(/Talk to a partner/gi,'Write your ideas').replace(/Listen to a partner\. Make one useful correction\./g,'Read your answer again. Make one useful correction.').replace(/Listen for the next instruction\./g,'').replace(/Keep your work\. Listen for the next instruction\./g,'Keep your work.').trim();
const out=lessons.map(lesson=>{
 const item={id:lesson.id,title:lesson.title,classes:lesson.catalog?.classes||(lesson.catalog?.grades?.includes(8)?['8']:['7a','7b','8']),subject:lesson.catalog?.subjectId||'routines',quarter:lesson.catalog?.quarter||'Start',unit:lesson.catalog?.unit||'Classroom foundations',order:lesson.catalog?.order||0,assessment:!!lesson.examId,sections:[],questions:[],cards:[],related:[]};
 if(lesson.examId)return item;
 for(const [si,stage] of lesson.stages.entries()){
  const section={title:stage.title,blocks:[]};
  for(const [fi,frame] of stage.frames.entries()){
   if(frame.final||frame.printExam)continue;
   const key=si+'-'+fi;
   if(frame.type==='question'){
    item.questions.push({id:key,prompt:frame.title,lines:(frame.lines||[]).map(adapt),options:questionOptions(frame),answer:frame.answer||null,model:frame.explanation||frame.answerText||'',open:!!frame.answerText});
    if(frame.explanation)item.cards.push({front:frame.title,back:frame.explanation});
    continue;
   }
   const visual=visualSpec(lesson,stage,frame),lines=(frame.lines||[]).map(adapt).filter(Boolean);
   if(frame.quote)lines.push(frame.quote);
   if(visual?.steps)for(const step of visual.steps)if(!lines.includes(step))lines.push(step);
   if(!lines.length&&!visual&&!frame.diagram&&!frame.visual)continue;
   section.blocks.push({id:key,title:frame.title,lines,footnote:frame.footnote||'',visual:visual||null,imageAlt:!visual&&frame.illustration?frame.illustration.alt:'',imageCaption:!visual&&frame.illustration?frame.illustration.caption:'',image:!visual&&frame.illustration?frame.illustration.image:diagrams[frame.diagram]?diagrams[frame.diagram]+'.svg':frame.visual==='schoolyard'?'schoolyard.svg':null});
   if(frame.mode==='listen'&&lines.length&&item.cards.length<8)item.cards.push({front:frame.title,back:lines.slice(0,3).join('\n')});
  }
  if(section.blocks.length)item.sections.push(section);
 }
 item.cards=item.cards.slice(-12);return item;
});
for(const item of out.filter(x=>x.assessment)){
 const related=out.filter(x=>!x.assessment&&x.subject===item.subject&&x.quarter===item.quarter&&x.classes.some(c=>item.classes.includes(c))&&x.order<=item.order).slice(-8);
 item.related=related.map(x=>x.id);
 item.sections=[{title:'Prepare with a short revision routine',blocks:[{id:'revision',title:'Retrieval beats rereading',lines:['Read the notes from your recent lessons. Close them and explain three ideas from memory.','Practise a question, check the explanation, and correct your reasoning.','Revisit the topics you found difficult tomorrow.','This is revision practice from teaching lessons, not an assessment paper or an answer key.'],footnote:'',visual:null,image:null}]}];
 item.questions=related.flatMap(x=>x.questions.slice(0,1).map(q=>({...q,id:x.id+'-'+q.id}))).slice(0,8);
 item.cards=related.flatMap(x=>x.cards.slice(0,1)).slice(0,8);
}
fs.writeFileSync('students/lessons.json',JSON.stringify(out));
const strings=new Set();const walk=(v,key)=>{if(typeof v==='string'){if(!['id','subject','quarter','unit','answer','image','kind','scene','group','code'].includes(key)&&v.trim()&&!/^\d+$/.test(v))strings.add(v);}else if(Array.isArray(v)){if(!['classes','related','values'].includes(key))v.forEach(x=>walk(x,key));}else if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>walk(x,k));};out.forEach(x=>walk(x));
fs.writeFileSync('students/source-strings.json',JSON.stringify([...strings]));console.log(`${out.length} lessons, ${strings.size} study strings, ${[...strings].join('').length} characters.`);
