// Printable student tasks only. Never include teacher notes, answer keys or session data.
const unique=items=>[...new Set(items.filter(Boolean))];
const clean=line=>line.replace(/on screen/gi,'in the source').replace(/with a partner/gi,'with a partner or independently');
export function worksheetFor(lesson,kind,allLessons){
 const homework=kind==='homework';let teaching=lesson;
 if(lesson.examId){
  teaching=allLessons.filter(l=>!l.examId&&l.catalog?.subjectId===lesson.catalog.subjectId&&l.catalog?.classes?.some(c=>lesson.catalog.classes?.includes(c))&&l.catalog.order<lesson.catalog.order).at(-1);
 }
 const base={lessonId:lesson.id,title:lesson.title,kind:homework?'homework':'lesson',classes:lesson.catalog?.classes||[],reference:lesson.bookSections?.length?'geog.1 sections '+unique(lesson.bookSections).join(', '):lesson.bookNumber?'Learner’s Skills Book '+lesson.bookNumber+' · '+lesson.workbookLesson:'',
  note:lesson.examId?'Optional revision, separate from the assessment.': 'Optional: use only if your teacher assigns it. You can do the lesson without this sheet.',pages:[]};
 if(!teaching){
  base.pages=[{title:'Prepare and reflect',sources:[],sections:[
   {title:'What I already know',lines:['Draw or describe two things you already know about '+(lesson.catalog?.subjectId==='geography'?'places, maps or landscapes.':'researching questions and explaining ideas.')],space:5},
   {title:'A question I want to investigate',lines:['Write a question about this subject. Explain why it interests you and how you could find out more.'],space:5},
   {title:'My next step',lines:['After your teacher returns feedback, choose one idea to practise and explain how you will practise it.'],space:4}]}];return base;
 }
 if(lesson.examId)base.note+=' Revision topic: '+teaching.title+'. This sheet contains no assessment questions or answers.';
 const frames=teaching.stages.flatMap(s=>s.frames);
 const rounds=teaching.extensions?.[0]?.rounds||[];
 if(homework||teaching.bookTrial){
  const chosen=homework?rounds.slice(-3):rounds.slice(0,3);
  base.pages=[{title:homework?'Independent practice':'Think, choose and explain',sources:[],sections:chosen.map((r,i)=>({title:(i+1)+'. '+r.prompt,sources:r.source||[],lines:r.choices.map((c,j)=>(j+1)+'. '+c).concat('Circle your choice. Explain your reason.'),space:3}))}];
  if(chosen.length&&chosen[0].source?.length&&chosen.every(r=>JSON.stringify(r.source)===JSON.stringify(chosen[0].source))){
   base.pages[0].sources=chosen[0].source;
   base.pages[0].sections.forEach(s=>{s.sources=[];});
  }
  if(teaching.bookTrial&&!homework){
   base.pages[0].sections.push({title:'Create your own research question',sources:[],lines:['Write a clear, fair question you could investigate at school. Name one source of information that would help answer it.'],space:4});
   base.note+=' These are additional teacher-created activities; no workbook is needed to complete this sheet.';
  }
  return base;
 }
 if(teaching.geoRedesign){
  const tasks=teaching.stages.find(s=>s.id==='apply').frames.filter(f=>!f.boardRound);
  const common=frames.filter(f=>f.sourceCard===true).flatMap(f=>f.lines||[]);
  base.pages=tasks.map((f,i)=>({title:f.title.replace(' · your task',''),sources:typeof f.sourceCard==='string'?[f.sourceCard]:common,
   sections:[{title:'Your investigation',lines:f.lines.map(clean),space:8},{title:'Explain your reasoning',lines:['Explain one choice or step using a detail from the source. Label any diagram you use.'],space:3}]}));
  return base;
 }
 const sourceFrames=teaching.stages.filter(s=>['sources','learn','teach'].includes(s.id)).flatMap(s=>s.frames).filter(f=>!f.type&&!f.discussionId&&f.lines?.length);
 const sources=unique(sourceFrames.flatMap(f=>[f.quote,...f.lines]));
 if(teaching.english)sources.push(...unique(frames.map(f=>typeof f.sourceCard==='string'?f.sourceCard:null)));
 // Bespoke lessons may use different stage names. Use their supplied source cards.
 if(!sources.length)sources.push(...unique(frames.filter(f=>!f.type&&/source|case|scenario/i.test(f.title)).flatMap(f=>[f.quote,...(f.lines||[])])));
 let tasks=teaching.stages.filter(s=>s.id==='apply').flatMap(s=>s.frames).filter(f=>!f.final&&!f.type&&!/^pacing-/.test(f.discussionId||''));
 tasks=tasks.filter(f=>f.lines?.length&&!/exchange|share and improve|compare two|test and improve/i.test(f.title)).slice(0,2);
 if(!tasks.length){
  // A self-contained retrieval sheet is safer than instructions needing a live screen/game.
  base.pages=[{title:'Practise the lesson ideas',sources:[],sections:rounds.slice(0,3).map((r,i)=>({title:(i+1)+'. '+r.prompt,sources:r.source||[],lines:r.choices.map((c,j)=>(j+1)+'. '+c).concat('Choose an answer and explain your reason.'),space:4}))}];
 }else{
  base.pages=[{title:'Source material',sources:sources.length?sources:teaching.extensions?.[0]?.source||[],sections:[]},
   {title:'Class activities',sources:[],sections:tasks.map((f,i)=>({title:(i+1)+'. '+f.title,lines:f.lines.map(clean),space:7}))}];
  // A diagram may carry essential information. The print view renders the same source visual.
  const visualFrame=sourceFrames.find(f=>f.diagram||f.visual||f.lessonVisual)||frames.find(f=>f.diagram||f.visual||f.lessonVisual);
  if(visualFrame)base.pages[0].visualFrame=visualFrame;
 }
 return base;
}
