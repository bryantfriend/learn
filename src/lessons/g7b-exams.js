import { grade7BCourses } from '../plans/grade7b.js';
import { content as geo } from './g7b-geo-content.js';
import { content as gp } from './g7b-gp-content.js';
import { grade7Exams } from './g7-exams.js';
const positions=[1,3,0,2,2,0,3,1,0,2,1,3];
const geoSources={'3.1':'Use your knowledge of the UK and its location.','3.2':'Use political and physical geography to answer.','3.7':'Consider the functions of a capital city.','4.5':'Use your knowledge of glacial landforms.','5.1':'Use your knowledge of rivers and the Thames.','5.7':'Use your knowledge of river mouths and tides.'};
export const grade7BExams={};
for(const course of grade7BCourses){
 const geography=course.subjectId==='geography',content=geography?geo:gp;
 for(const entry of course.lessons.filter(l=>l.examCode)){
  const before=course.lessons.filter(l=>l.week<entry.week||(l.week===entry.week&&l.slot<entry.slot));
  let codes=[...new Set(before.filter(l=>l.quarter===entry.quarter).map(l=>l.rows[0].code).filter(c=>content[c]))];
  if(entry.examCode==='A0')codes=geography?['3.1','3.2','5.1','5.2']:['1.1','1.2','1.3','1.4','1.5','1.6'];
  const previous=[...new Set(before.map(l=>l.rows[0].code).filter(c=>content[c]&&!codes.includes(c)))].reverse();
  const make=code=>(geography?content[code][3]:[[content[code][3],content[code][4],content[code][5]]]).map(q=>({source:geography?(geoSources[code]||content[code][1]):content[code][1],q,code}));
  let bank=codes.flatMap(make);
  for(const c of previous){if(bank.length>=12)break;bank.push(...make(c));}
  if(bank.length<12&&!geography){
   const fallback=grade7Exams['7A-GP-A0'].blocks.flatMap(b=>b.questions).filter(q=>q.topic==='core-skills');
   for(const item of fallback){if(bank.length>=12)break;const correct=item.answer.charCodeAt(0)-65;bank.push({source:item.context,q:[item.prompt,[item.options[correct],...item.options.filter((_,i)=>i!==correct)],item.explanation],code:'core-skills'});}
  }
  if(bank.length<12)throw Error('Not enough exam items '+entry.id);
  const selected=Array.from({length:12},(_,i)=>bank[Math.floor(i*bank.length/12)]);
  const id='7B-'+(geography?'GEO':'GP')+'-'+entry.examCode,subject=geography?'Geography':'Global Perspectives';
  const questions=selected.map(({source,q,code},i)=>{const options=q[1].slice(1);options.splice(positions[i],0,q[1][0]);return {number:i+1,prompt:q[0],context:source,options,answer:String.fromCharCode(65+positions[i]),explanation:q[2],topic:code};});
  grade7BExams[id]={id,title:'7B '+subject+' — '+(entry.examCode==='A0'?'Baseline':entry.examCode+' assessment'),grade:'7B',subject,minutes:40,totalMarks:12,
   blocks:Array.from({length:4},(_,i)=>({title:'Questions '+(i*3+1)+'–'+(i*3+3),source:'Read each short source. Use it and your learning to choose one best answer.',questions:questions.slice(i*3,i*3+3)}))};
 }
}
