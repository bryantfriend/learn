import { gpExams } from '../src/lessons/gp-exams.js';
import { grade7Exams } from '../src/lessons/g7-exams.js';
import { grade7BExams } from '../src/lessons/g7b-exams.js';
const allExams = {...gpExams,...grade7Exams,...grade7BExams};
const params=new URLSearchParams(location.search),exam=allExams[params.get('id')],key=params.get('key')==='1';
const root=document.getElementById('paper');
function el(tag,text,cls){const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;}
if(!exam){
 document.title='Learn · Assessment papers';
 root.append(el('h1','Classroom assessment papers'));
 for(const item of Object.values(allExams)){
  const row=el('p'),a=el('a',item.title+' — student paper');a.href='./?id='+item.id;row.append(a);root.append(row);
 }
 document.getElementById('print-button').hidden=true;
}else{
 document.title=exam.title+(key?' — Teacher key':' — Student paper');
 const other=document.getElementById('other-version');other.href='./?id='+exam.id+(key?'':'&key=1');other.textContent=key?'Student paper':'Teacher answer key';
 exam.blocks.forEach(function(block,index){
  const sheet=el('section',null,'paper-sheet');
  sheet.append(el('div','Oxford International School · Mr. Friend','school'),el('h1',exam.title),el('p',(exam.grade ? exam.grade+' '+exam.subject : 'Grade 8 Global Perspectives')+' · '+(key?'TEACHER ANSWER KEY':'STUDENT PAPER')+' · '+exam.totalMarks+' marks','paper-meta'));
  if(index===0){
   if(!key)sheet.append(el('p','Name: ________________________  Class: ______  Date: __________','identity'));
   sheet.append(el('p',key?'One mark per correct answer; no negative marking. MCQs assess reasoning about the skills. Observe actual collaboration and oral communication separately.':'40-minute session, including instructions and checking. Circle one answer (A–D) per question. Each question is worth 1 mark. Use the sources below; no internet is needed.','instructions'));
  }
  sheet.append(el('h2','Source '+String.fromCharCode(65+index)+' · '+block.title),el('p',block.source,'source'),el('p',exam.grade?'Unnamed cases and data are invented; named historical facts are identified in the course notes.':'Fictional teaching case and data.','fictional'));
  for(const q of block.questions){
   const item=el('section',null,'question');if(q.context)item.append(el('p',q.context,'question-context'));item.append(el('h3',q.number+'. '+q.prompt));
   const list=el('ol');list.type='A';
   for(const option of q.options)list.append(el('li',option));
   item.append(list);
   if(key)item.append(el('p','Answer '+q.answer+' — '+q.explanation,'key-answer'));
   sheet.append(item);
  }
  sheet.append(el('footer',exam.id+' · '+(key?'Teacher key':'Student paper')+' · Page '+(index+1)+' of '+exam.blocks.length));
  root.append(sheet);
 });
}
document.getElementById('print-button').addEventListener('click',()=>window.print());
