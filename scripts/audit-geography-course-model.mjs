import {writeFileSync,existsSync} from 'node:fs';
import {lessons} from '../src/lessons.js';
import {courseMethods,courseWordExamples} from '../src/lessons/geography-course-methods.js';
const geo=lessons.filter(l=>l.catalog?.subjectId==='geography'),issues=[];
const check=(ok,id,message)=>{if(!ok)issues.push({lesson:id,message});};
const report=geo.map(l=>{
 for(const s of l.stages)for(const f of s.frames){
  check(existsSync(new URL('../assets/'+f.geoArt.image,import.meta.url)),l.id,'Missing artwork: '+f.geoArt.image);
  check(!f.recallCue&&!f.responseHint,l.id,'Generic student cue: '+f.title);
  for(const v of f.vocabularyCards||[])if(v.image)check(existsSync(new URL('../assets/'+v.image,import.meta.url)),l.id,'Missing vocabulary picture: '+v.image);
 }
 if(!l.examId){
  for(const code of new Set(l.bookSections)){check(!!courseMethods[code],l.id,'Missing topic audit: '+code);check(courseWordExamples[code]?.length===3,l.id,'Missing concrete vocabulary examples: '+code);}
  check(l.stages.every(s=>s.frames.reduce((n,f)=>n+f.expectedSeconds,0)===s.durationMinutes*60),l.id,'Stage timing does not sum to its budget');
  check(l.stages.find(s=>s.id==='goal').frames.every(f=>f.successCriteria.length===3&&!f.successCriteria.some(x=>/section \d|Use the key words/.test(x))),l.id,'Unspecific success criterion');
  check(l.stages.find(s=>s.id==='apply').frames.every(f=>!f.fingerPractice&&!f.choices&&f.sourceCard),l.id,'Case explanation lacks displayed evidence');
  check(l.stages.find(s=>s.id==='check').frames.every(f=>f.type==='question'&&f.answerText&&f.explanation&&f.allowHideAnswer&&!f.choices&&!f.options),l.id,'Spoken check lacks concealed explanation');
  const text=l.stages.flatMap(s=>s.frames.flatMap(f=>f.lines||[])).join(' ');
  check(!/Think quietly\. Share an observation|Think.*Pair.*Share|Use the key words in section|use the book|in the book|textbook (map|diagram)/i.test(text),l.id,'Generic instruction or unavailable source');
 }else{
  check(l.stages.map(s=>s.id).join(',')==='prepare,test,reflect,finish',l.id,'Assessment conditions changed');
  check(l.stages.flatMap(s=>s.frames).every(f=>!f.explanation&&!f.options&&!f.vocabularyCards&&f.geoArt.image==='geography/assessment-paper.svg'),l.id,'Assessment supplies a content hint');
 }
 return {id:l.id,title:l.title,type:l.examId?'assessment':l.geographyReview?'review':'teaching',topics:l.bookSections||[],stages:l.stages.map(s=>({id:s.id,minutes:s.durationMinutes,slides:s.frames.length,outcomes:s.frames.filter(f=>f.teacherDemonstration).map(f=>({title:f.title,product:'teacher explanation of the case',source:f.sourceCard})),artwork:[...new Set(s.frames.map(f=>f.geoArt.image))]}))};
});
const audit={method:'Board-led Geography: geographical question, concrete vocabulary, substantive subject explanations, demonstrated methods, explained scheduled and changed cases, concealed oral checks and spoken recap. No written student product is required.',summary:{total:geo.length,teachingAndReview:geo.filter(l=>!l.examId).length,assessments:geo.filter(l=>l.examId).length,topics:Object.keys(courseMethods).length,issues:issues.length},issues,lessons:report};
writeFileSync('docs/geography-course-model-audit.json',JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify(audit.summary));if(issues.length){console.error(JSON.stringify(issues,null,2));process.exitCode=1;}
