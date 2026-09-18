// Pacing is an estimate for pupil work, not a script-reading target.
const task=(title,mode,lines,id)=>({title,mode,lines,discussionId:id});
export function strengthenPacing(lesson){
 if(!lesson.gp||lesson.examId)return lesson;
 const standard=!lesson.customVisuals;
 if(standard){
  const find=id=>lesson.stages.find(s=>s.id===id);
  const begin=lesson.stages[0],source=find('sources')||find('learn'),apply=find('apply'),check=find('check');
  if(lesson.id!=='g8-gp-1.1'&&find('model'))find('model').frames.push(task('Try the reasoning yourself','pair',['Use one detail from the lesson source in your own explanation.','Say which part is supported and which part is still uncertain.','Your partner asks for evidence; improve the explanation.'],'pacing-model'));
  const timing=lesson.catalog.grades.includes(8)?[2,8,4,14,8,4]:[2,8,18,8,4];
  lesson.contentRevision=(lesson.contentRevision||0)+10;
  if(lesson.id!=='g8-gp-1.1'){
   begin.frames[0].lines=['Write one idea you remember about today’s topic.','Compare with a partner. Keep one question you want this lesson to answer.'];
   source.frames.push(task('Make an evidence record','think',['Write two precise details from the source or diagram.','Beside each, explain what it helps you understand.','Write one question the source does not answer.'],'pacing-evidence'));
   if(apply.frames.length<4){
    apply.frames.push(task('Show your reasoning independently','think',['Use the task you have just tried. Write your own complete response.','Show your steps, evidence or labelled diagram.','Explain why your answer fits this example.'],'pacing-independent'));
    apply.frames.push(task('Test and improve your work','pair',['Exchange answers. Point to the evidence or step behind one claim.','Ask your partner to explain one unclear part.','Revise your own work and underline the change.'],'pacing-revise'));
   }
   apply.frames.push(task('Compare two approaches','share',['Two pairs: show different answers or methods from this task.','Everyone: write one similarity and one difference.','Decide which explanation is clearer and justify your choice.'],'pacing-compare'));
   if(check.frames.length<3){
    check.frames.push(task('Explain without the choices','think',['Answer without looking at the choices.','Write your answer as an explanation, including evidence or working.','Add why one other answer would not fit.'],'pacing-explain'));
    check.frames.push(task('Check a partner’s reasoning','pair',['Read your explanations to each other.','Check each claim against the source, diagram or method.','Correct one error or add one missing step.'],'pacing-check'));
   }
  }
  if(lesson.id==='g8-gp-1.1'){
   const model=find('model');model.frames[1].mode='pair';model.frames[1].lines.push('Now explain a different link yourself. Your partner points to the evidence.');
   const end=lesson.stages.at(-1);end.frames.splice(1,0,task('Compare your exit answers','share',['Two students: explain different links in the chain.','Everyone: add one useful detail to your own explanation.'],'pacing-exit'));
  }
  let start=0;
  for(const [i,stage] of lesson.stages.entries()){
   stage.durationMinutes=timing[i];stage.timeRange=`${start}–${start+timing[i]} min`;start+=timing[i];
   // Distribute the stage budget across actual pupil tasks; final directions take 15 seconds.
   const weights=stage.frames.map(f=>f.final?0:f.mode==='listen'?1:f.type==='question'?2:3);
   const usable=stage.durationMinutes*60-stage.frames.filter(f=>f.final).length*15,total=weights.reduce((a,b)=>a+b,0);
   let assigned=0;const last=weights.findLastIndex(w=>w>0);
   stage.frames.forEach((f,j)=>{f.expectedSeconds=f.final?15:j===last?usable-assigned:Math.floor(usable*weights[j]/total/15)*15;if(!f.final)assigned+=f.expectedSeconds;f.timerSeconds=f.expectedSeconds;});
   if(lesson.id==='g8-gp-1.1'){
    const explicit={notice:[90,30],sources:[30,30,180,240],model:[60,180],apply:[180,240,180,240],check:[180,120,180],reflect:[120,105,15]}[stage.id];
    stage.frames.forEach((f,j)=>{f.expectedSeconds=explicit[j];f.timerSeconds=explicit[j];});
   }
   stage.notes+='\nPacing guide (student work, not teacher talk): '+stage.frames.map(f=>`${f.title}: ${f.expectedSeconds/60} min`).join('; ')+'. Move on when pupils can demonstrate the outcome. Use More practice if the class is ready early. Attendance and announcements are outside this teaching allocation.';
  }
 }
 const frames=lesson.stages.flatMap(s=>s.frames);
 const sourceStage=lesson.stages.find(s=>['sources','learn'].includes(s.id));
 const anchor=(sourceStage?.frames.find(f=>/source/i.test(f.title)&&f.lines?.length))||frames.find(f=>f.lessonVisual&&f.lines?.length)||frames.find(f=>f.lines?.length&&!f.final);
 const source=[...(anchor.lines||[]),...(anchor.lessonVisual?.steps||[])];
 lesson.extensions=lesson.extensions||[
  {title:'Build a better explanation',minutes:5,sourceTitle:anchor.title,source,
   lines:['1 minute: choose two details from this lesson example.','2 minutes: draw a labelled explanation or write a worked answer connecting them.','2 minutes: compare with a partner. Add a missing link and explain the improvement.'],outcome:'Keep your first version and your improved version so you can show what changed.'},
  {title:'Create a challenge for another pair',minutes:5,sourceTitle:anchor.title,source,
   lines:['2 minutes: write a new question that can be answered using this source. Prepare an answer with evidence.','2 minutes: swap questions. Answer without seeing the other pair’s explanation.','1 minute: compare answers. Fix any ambiguity or unsupported claim.'],outcome:'Your question must require an explanation or a method, not just copying a word.'}
 ];
 if(lesson.id==='g8-gp-1.1')lesson.extensions=[
  {title:'Can the factory keep working?',minutes:5,sourceTitle:'A new stock problem',source:['Fictional example: a factory uses 10 rolls of fabric each day.','It has 40 rolls in storage. Its next delivery is 3 days late.'],lines:['1 minute: work out how many days the stock lasts. Show your calculation.','2 minutes: decide whether it can cover the delay. State your assumptions.','2 minutes: demand doubles to 20 rolls a day. Recalculate and explain what changes.'],outcome:'Compare both situations. Name one fact you would check before promising the shop its delivery.'},
  {title:'Whose problem is it?',minutes:5,sourceTitle:'One delay, three viewpoints',source:['Fictional example: shirts will reach the shop two days late.','A shop worker has promised a customer a shirt for Friday.','A factory manager wants workers to do extra hours to catch up.'],lines:['1 minute: each person chooses the shop worker, customer or garment worker. Write what matters to them.','2 minutes: share the different views. Suggest a plan that considers all three.','2 minutes: identify a drawback of your plan. Write a question to ask the people affected.'],outcome:'Explain a trade-off. Do not assume workers agree to extra hours or that customers can wait.'}
 ];
 // Put both practice activities before the final reflection in normal navigation.
 const practice=lesson.extensions.map((extra,i)=>{
  const chunks=[];for(let j=0;j<extra.source.length;j+=2)chunks.push(extra.source.slice(j,j+2));
  const frames=chunks.map((lines,j)=>({title:extra.sourceTitle,mode:'think',lines,expectedSeconds:60/chunks.length,timerSeconds:60/chunks.length,kicker:'Practice '+(i+1)+' · Read the example '+(j+1)+'/'+chunks.length}));
  frames.push({title:extra.title,mode:'pair',lines:extra.lines.map(line=>line.replace(/^\d+ minutes?: /,'').replace(/^[a-z]/,c=>c.toUpperCase())),footnote:extra.outcome,discussionId:'included-practice-'+i,expectedSeconds:240,timerSeconds:240});
  return {id:'practice-'+(i+1),title:extra.title,durationMinutes:5,notes:'Included five-minute practice: read the supplied example for one minute, then spend four minutes producing and comparing responses. '+extra.outcome+' Use one of these two activities for about five extra minutes, or both for ten. Keep the final reflection.',frames};
 });
 lesson.stages.splice(lesson.stages.length-1,0,...practice);
 let elapsed=0;for(const stage of lesson.stages){stage.timeRange=elapsed+'–'+(elapsed+stage.durationMinutes)+' min';elapsed+=stage.durationMinutes;}
 lesson.durationMinutes=elapsed;
 lesson.contentRevision=(lesson.contentRevision||0)+100;
 lesson.pacingNote='About 50 minutes of teaching and student work, including two five-minute practice activities before the final reflection. Use one for a 45-minute route, or both for 50 minutes. Times are estimates; attendance and announcements are separate.';
 return lesson;
}
