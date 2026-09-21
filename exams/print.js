import { gpExams } from '../src/lessons/gp-exams.js';
import { grade7Exams } from '../src/lessons/g7-exams.js';
import { grade7BExams } from '../src/lessons/g7b-exams.js';
const allExams = {...gpExams,...grade7Exams,...grade7BExams};
const params=new URLSearchParams(location.search),exam=allExams[params.get('id')],key=params.get('key')==='1';
const root=document.getElementById('paper');
function el(tag,text,cls){const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;}
const periods={A0:'Baseline',Q1:'Term 1',Q2:'Term 2',Q3:'Term 3',Q4:'Term 4'};
function link(label,href,cls='exam-card'){const a=el('a',label,cls);a.href=href;return a;}
if(!exam){
 root.className='exam-library';
 const period=periods[params.get('period')]?params.get('period'):null;
 const grade=['7A','7B','8'].includes(params.get('grade'))?params.get('grade'):null;
 document.title='Learn · Exams'+(period?' · '+periods[period]:'');
 root.append(el('p','OXFORD INTERNATIONAL SCHOOL · MR. FRIEND','library-eyebrow'));
 if(params.has('id'))root.append(el('p','That exam could not be found. Choose a paper below.','library-notice'));
 root.append(el('h1',period?periods[period]:'Exams'),el('p',period?(grade?'Choose a subject to open the printable paper.':'Choose a grade.'): 'Choose an exam, then a grade to view and print.'));
 const cards=el('div',null,'exam-cards');
 if(!period){
  for(const [code,label] of Object.entries(periods))cards.append(link(label,'./?period='+code));
 }else{
  root.append(link('← All exams','./','library-back'));
  if(!grade){
   for(const value of ['7A','7B','8']){
    const matches=Object.values(allExams).filter(e=>(e.grade||'8')===value&&(e.id===period||e.id.endsWith('-'+period)));
    cards.append(link(value==='8'?'Grade 8':value,matches.length===1?'./?id='+matches[0].id:'./?period='+period+'&grade='+value));
   }
  }else{
   root.append(el('h2',grade),link('← Choose another grade','./?period='+period,'library-back'));
   for(const item of Object.values(allExams).filter(e=>(e.grade||'8')===grade&&(e.id===period||e.id.endsWith('-'+period))))cards.append(link(item.subject||'Global Perspectives','./?id='+item.id));
  }
 }
 root.append(cards);
}else{
 document.getElementById('print-button').hidden=false;
 document.title=exam.title+(key?' — Teacher key':' — Student paper');
 const other=document.getElementById('other-version');other.hidden=false;other.href='./?id='+exam.id+(key?'':'&key=1');other.textContent=key?'Student paper':'Teacher answer key';
 const period=exam.id.split('-').at(-1);
 other.after(link('← '+periods[period]+' grades','./?period='+period,'library-back'));
 const blocks=exam.compact&&key?[0,1].map(i=>({...exam.blocks[0],questions:exam.blocks[0].questions.slice(i*10,i*10+10)})):exam.blocks;
 blocks.forEach(function(block,index){
  const sheet=el('section',null,'paper-sheet'+(exam.compact?(key?' baseline-key':' baseline-sheet'):''));
  sheet.append(el('div','Oxford International School · Mr. Friend','school'),el('h1',exam.title),el('p',(exam.grade ? exam.grade+' '+exam.subject : 'Grade 8 Global Perspectives')+' · '+(key?'TEACHER ANSWER KEY':'STUDENT PAPER')+' · '+exam.totalMarks+' marks','paper-meta'));
  if(index===0){
   if(!key)sheet.append(el('p','Name: ________________________  Class: ______  Date: __________','identity'));
   sheet.append(el('p',key?'One mark per correct answer; no negative marking. MCQs assess reasoning about the skills. Observe actual collaboration and oral communication separately.':exam.compact?'40 minutes including checking · 20 questions · 1 mark each. Circle one answer (A–D) per question. Examples and survey data are fictional.':'40-minute session, including instructions and checking. Circle one answer (A–D) per question. Each question is worth 1 mark. Use the sources below; no internet is needed.','instructions'));
  }
  if(!exam.compact)sheet.append(el('h2','Source '+String.fromCharCode(65+index)+' · '+block.title),el('p',block.source,'source'),el('p',exam.grade?'Unnamed cases and data are invented; named historical facts are identified in the course notes.':'Fictional teaching case and data.','fictional'));
  const questions=el('div',null,exam.compact&&!key?'baseline-questions':'questions');
  const columns=exam.compact&&!key?[el('div',null,'baseline-column'),el('div',null,'baseline-column')]:null;
  if(columns)questions.append(...columns);
  for(const q of block.questions){
   const item=el('section',null,'question');if(q.context)item.append(el('p',q.context,'question-context'));item.append(el('h3',q.number+'. '+q.prompt));
   const list=el('ol');list.type='A';
   for(const option of q.options)list.append(el('li',option));
   if(!exam.compact||!key)item.append(list);
   if(key)item.append(el('p','Answer '+q.answer+' — '+(exam.compact?q.options[q.answer.charCodeAt(0)-65]+' ':'')+q.explanation,'key-answer'));
   (columns?columns[q.number<=10?0:1]:questions).append(item);
  }
  sheet.append(questions);
  sheet.append(el('footer',exam.id+' · '+(key?'Teacher key':'Student paper')+' · Page '+(index+1)+' of '+blocks.length));
  root.append(sheet);
 });
}
document.getElementById('print-button').addEventListener('click',()=>window.print());
