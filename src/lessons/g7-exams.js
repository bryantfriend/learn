import { grade7ACourses } from '../plans/grade7a.js';
import { baselineExams } from './baseline-exams.js';
import { content as geo } from './g7-geo-content.js';
import { content as gp } from './g7-gp-content.js';
const examSources={'1.1':'Consider natural features, built features and interactions between people and their environment.','1.2':'Choose a suitable geographical tool or measurement for each task.','1.5':'Fictional settlement: houses cluster near a bridge.'};
const positions=[1,3,0,2,2,0,3,1,0,2,1,3];
export const grade7Exams={};
for(const course of grade7ACourses){
 const geography=course.subjectId==='geography',subject=geography?'Geography':'Global Perspectives';
 for(const entry of course.lessons.filter(e=>e.examCode)){
  let codes;
  if(geography){
   const taught=[...new Set(course.lessons.filter(e=>e.week<=entry.week&&!e.examCode).flatMap(e=>e.rows.map(r=>r.code)).filter(c=>geo[c]))];
   codes=entry.examCode==='A0'?['1.1','1.2','1.3']:taught;
  }else{
   codes=course.longTerm.filter(e=>gp[e.code]&&(entry.examCode==='A0'?e.unit==='1':e.quarter===entry.quarter)).map(e=>e.code);
  }
  let bank=[];
  if(geography)for(const code of codes)for(const q of geo[code][3])bank.push({source:examSources[code]||geo[code][1],q,code});
  else for(const code of codes)bank.push({source:gp[code][1],q:[gp[code][3],gp[code][4],gp[code][5]],code});
  if(!geography && bank.length<12){
   const revision=[
    ['Two pupils disagree about where to hold a club.','What helps compare their perspectives?',['Ask each pupil for a reason.','Assume the first speaker is correct.','Ignore both views.','Vote before hearing any reasons.'],'Reasons help explain the viewpoints.'],
    ['A report says 8 of 20 pupils chose music.','Which statement accurately reports the result?',['Eight of the twenty chose music.','Every pupil chose music.','Eight pupils disliked all music.','No pupil chose music.'],'Use the stated count without adding assumptions.'],
    ['You want to know what classmates value about a local place.','Which question is most neutral?',['What do you value about this place, if anything?','Why does everyone love this place?','Why is this place terrible?','You agree it is perfect, right?'],'The neutral question allows positive, negative or mixed responses.'],
    ['A group must prepare a poster in ten minutes.','Which plan best shares responsibility?',['Agree roles and check progress together.','Let one pupil do all the work.','Give everyone the same job without talking.','Wait until time runs out to assign jobs.'],'Clear roles and a joint check support shared work.'],
    ['One interviewee says a celebration matters because it brings relatives together.','Which claim stays within the evidence?',['This interviewee values time with relatives.','All people value only food.','Every family has the same tradition.','No one values music.'],'A single account supports a claim about that speaker.'],
    ['Your first explanation used no evidence. You revise it using two relevant examples.','Which reflection explains the improvement?',['My examples now support the claim.','Longer writing is always better.','Evidence never changes an answer.','My first answer needed no checking.'],'Reflection identifies how the revision improves support.']
   ];
   for(const [source,prompt,options,explanation] of revision){if(bank.length>=12)break;bank.push({source,q:[prompt,options,explanation],code:'core-skills'});}
  }
  const selected=Array.from({length:12},(_,i)=>bank[Math.floor(i*bank.length/12)]);
  const id='7A-'+(geography?'GEO':'GP')+'-'+entry.examCode;
  const questions=selected.map(({source,q,code},i)=>{
   const options=q[1].slice(1);options.splice(positions[i],0,q[1][0]);
   return {number:i+1,prompt:q[0],context:source,options,answer:String.fromCharCode(65+positions[i]),explanation:q[2],topic:code};
  });
  grade7Exams[id]={id,title:'7A '+subject+' — '+(entry.examCode==='A0'?'Baseline':entry.examCode+' assessment'),grade:'7A',subject,minutes:40,totalMarks:12,
   blocks:Array.from({length:4},(_,i)=>({title:'Questions '+(i*3+1)+'–'+(i*3+3),source:'Use the information provided with each question. Choose one best answer. Unnamed case studies and numerical datasets are classroom examples.',questions:questions.slice(i*3,i*3+3)}))};
 }
}
// Keep the existing fallback bank for unchanged term papers.
export const grade7CoreFallback = grade7Exams['7A-GP-A0'].blocks.flatMap(b=>b.questions).filter(q=>q.topic==='core-skills');
for(const id of ['7A-GEO-A0','7A-GP-A0'])grade7Exams[id]=baselineExams[id];
