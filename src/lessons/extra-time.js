// Optional retrieval games are separate from the lesson's core teaching sequence.
const unique=items=>[...new Map(items.map(x=>[JSON.stringify(x),x])).values()];
const mini=(source,prompt,correct,wrong,why)=>({source:[source],prompt,correct,wrong,why});
function relatedChallenges(lesson,source){
 const context=(lesson.title+' '+source.join(' ')).toLowerCase();
 if(/chain|trade|factory|cotton|transport/.test(context))return [
  mini('New fictional case: fabric comes from A; a factory in B makes bags; a shop in C sells them. A delivery from A is late.','Which stage is directly waiting for material?','The factory in B.','Only the customers in A.','The next production stage in B needs the fabric; later stages may also be affected.'),
  mini('The factory has30 rolls and uses10 per day. No new rolls arrive.','How long can the stock cover normal use?','Three days.','Thirty days.','30 ÷10 =3 days, assuming normal use and usable stock.'),
  mini('The shop suggests faster shipping; the factory says it costs more.','Which response considers the trade-off?','Compare avoided delays with the added cost.','Assume faster shipping has no disadvantage.','A proposal can have a benefit and a cost; compare both before deciding.')];
 if(/data|survey|sample|graph|percentage|statistic/.test(context))return [
  mini('New sample:6 of10 pupils in A agree;12 of30 in B agree.','Which group has the higher proportion agreeing?','Group A.','Group B.','A is60%; B is40%. Bigger counts need not mean a bigger proportion.'),
  mini('A class surveys only volunteers at a football club.','Can it assume this represents every pupil’s sporting interests?','No; the selection may favour football interests.','Yes; any group represents everyone.','Who is selected can influence the result; seek a wider sample.'),
  mini('A graph shows ice-cream sales and swimming visits rising on hot days.','Does this establish that ice cream causes swimming?','No; hot weather may affect both.','Yes; two rising lines prove a direct cause.','An association is not enough to establish the proposed causal link.')];
 if(/team|collaborat|role|group work|conflict/.test(context))return [
  mini('A team gives all four members the same task; nobody checks the final answer.','Which change directly closes the gap?','Agree a checking role and a shared deadline.','Repeat the task without assigning a check.','Responsibilities should cover the whole task, including review.'),
  mini('Two teammates disagree about a source.','Which response helps the task?','Compare the evidence behind both interpretations.','Choose whoever speaks loudest.','A decision should depend on reasons and evidence, not volume.'),
  mini('One member finishes early while another is stuck.','Which response supports shared progress?','Ask what help is needed and agree a useful next task.','Take over silently and exclude the other member.','Support should help participation and the agreed outcome.')];
 if(/communicat|present|audience|listen|report/.test(context))return [
  mini('A presentation for younger pupils uses five unexplained technical terms.','What is the clearest first improvement?','Explain necessary terms with a simple example.','Add more unfamiliar terms.','Language and examples should help this audience understand the idea.'),
  mini('A speaker gives a claim and a chart with no labels.','What should listeners ask for?','The chart’s labels, units and source.','A louder repetition of the claim only.','Without labels and context the chart cannot be interpreted reliably.'),
  mini('A listener disagrees before the speaker finishes.','What is a useful next step?','Summarise the speaker’s point, then ask about the evidence.','Assume the strongest opposing argument was never made.','Accurate listening helps make the disagreement specific and fair.')];
 if(/perspective|view|opinion|stakeholder|fair|identity|culture/.test(context))return [
  mini('New case: a pupil wants a quiet library; another needs a place for group discussion.','Must one pupil be dishonest?','No; they can have different needs.','Yes; only one need can be real.','Different experiences and priorities can lead to different views.'),
  mini('A plan for the library was discussed only with pupils who like group work.','Whose view is missing?','Pupils who need quiet study.','No view could be missing.','The sample excludes people affected in a different way.'),
  mini('A proposal creates quiet times and group-work times.','What would help evaluate it?','Feedback from both groups and observations of use.','Only the proposer’s confidence.','Check whether the plan works for the people it aims to serve.')];
 if(/reflect|progress|learning|improve/.test(context))return [
  mini('A learner writes “I was good today” with no example.','Which addition makes the reflection useful?','A specific action, result and next step.','More praise with no example.','Reflection should connect a judgement to evidence and improvement.'),
  mini('A learner changed an answer after seeing stronger evidence.','Does changing an answer always mean failure?','No; it can show learning.','Yes; the first answer must always be kept.','Explain what new evidence justified the revision.'),
  mini('A team’s next step is “do better”.','Which revision is more actionable?','Check every chart label before presenting next time.','Be perfect at everything immediately.','A specific action can be carried out and checked.')];
 if(/solution|action|decision|cost|budget|evaluat/.test(context))return [
  mini('New fictional plan: A costs40 tokens and helps20 users; B costs20 and helps15. Budget30.','Which single plan currently fits the budget?','B.','A.','B costs20≤30; A exceeds the budget. Affordability is only one criterion.'),
  mini('A cheap plan works quickly but leaves a problem for another group.','What should the evaluation include?','The transferred cost or harm as well as the benefit.','Only the low price.','Effects on other people are relevant to the decision.'),
  mini('A proposed solution has never been tested in this setting.','Which next step strengthens the decision?','A small monitored trial with clear success criteria.','Claim guaranteed success.','A trial can reveal benefits and limitations before a wider change.')];
 return [
  mini('New source: a company advert says its own product is best but gives no method or data.','What is a sensible next step?','Seek independent evidence and the basis of the claim.','Accept the claim because it is confident.','Purpose and missing evidence matter; confidence is not proof.'),
  mini('A question asks: “Why is our school obviously the worst?”','Which change makes it fairer?','Ask what pupils value and what they would improve.','Keep “obviously” and demand agreement.','The first invites evidence of strengths and problems instead of assuming the answer.'),
  mini('A source has an author, date and link.','Do those details alone guarantee the claim is correct?','No; the evidence and method still need checking.','Yes; a named author cannot be wrong.','Reference details help trace a source; they do not prove every claim.')];
}
function questionsFor(lesson){
 const fromBank=(lesson.practiceQuestions||[]).map(item=>{const q=item.question;return {prompt:q[0],correct:q[1][0],wrong:q[1][1],why:q[2],source:item.source};});
 const context=sourceFor(lesson);
 const fromFrames=lesson.stages.flatMap(s=>s.frames).filter(f=>f.options?.length&&f.answer).map(f=>({prompt:f.title,correct:f.options.find(o=>o.id===f.answer)?.label,wrong:f.options.find(o=>o.id!==f.answer)?.label,why:f.explanation,source:f.lines?.length?f.lines:context}));
 return unique([...fromBank,...fromFrames]).filter(q=>q.correct&&q.wrong&&q.why);
}
function sourceFor(lesson){
 const frames=lesson.stages.flatMap(s=>s.frames);
 const candidates=frames.filter(f=>!f.type&&!f.final&&!f.simulation&&(f.sourceCard===true||/source|case|example|scenario/i.test(f.title)));
 const fallback=frames.filter(f=>!f.type&&!f.final&&f.mode==='listen');
 return unique((candidates.length?candidates:fallback).flatMap(f=>f.lines||[])).filter(s=>s.length>25).slice(0,3);
}
export function addExtraTime(lesson){
 if(lesson.examId)return lesson;
 // Retire the old generic padding and retain genuinely authored core teaching.
 const removed=lesson.stages.some(s=>s.id.startsWith('practice-')||s.id.startsWith('reserve-'));
 lesson.stages=lesson.stages.filter(s=>!s.id.startsWith('practice-')&&!s.id.startsWith('reserve-'));
 let elapsed=0;for(const s of lesson.stages){s.timeRange=`${elapsed}–${elapsed+s.durationMinutes} min`;elapsed+=s.durationMinutes;}
 lesson.durationMinutes=elapsed;lesson.coreMinutes=elapsed;
 if(removed)lesson.contentRevision=(lesson.contentRevision||0)+1000;
 const source=sourceFor(lesson), qs=questionsFor(lesson);
 if(lesson.gp&&!lesson.geoRedesign&&!lesson.bookTrial)qs.push(...relatedChallenges(lesson,source));
 if(lesson.bookTrial) {
  const research=[
   ['Which question allows a fair answer?','What benefits and problems do pupils report?','Why is everything about school bad?','The first allows different findings; the second assumes a negative answer.'],
   ['Which question has a manageable scope?','How much food does our class leave over five days?','How can every country stop all waste forever?','One class and a defined time can be investigated; every country and forever is unmanageable.'],
   ['Which method helps understand pupils’ reasons?','Ask neutral interview questions.','Count chairs and guess what pupils think.','An interview can explore reasons. A chair count does not establish opinions.'],
   ['A survey has ten volunteers. What can we claim directly?','These ten volunteers gave these responses.','Everyone in the country thinks the same.','Volunteer responses describe those respondents; the sample may not represent everyone.'],
   ['Which revision improves a leading question?','Replace an assumption with a question allowing alternatives.','Add “obviously” to make the answer sound certain.','Fair wording leaves room for evidence to support different conclusions.'],
   ['What makes useful peer feedback?','Name a specific wording or evidence problem and suggest a change.','Say “good” without explaining.','Specific feedback gives the writer an action they can use.']
  ];
  qs.splice(0,qs.length,...research.map(([prompt,correct,wrong,why])=>({prompt,correct,wrong,why,source:[]})));
 }
 // Open-response lessons use their explicitly supplied models as evidence cards.
 if(!qs.length){
  const models=lesson.stages.flatMap(s=>s.frames).filter(f=>f.explanation).slice(0,4);
  for(const f of models)qs.push({prompt:f.title,correct:'Explain a reason using the example.',wrong:'Give a confident answer without a reason.',why:f.explanation,source:f.lines||[]});
 }
 if(!qs.length)qs.push({prompt:'How should we support an answer in this lesson?',correct:'Use a relevant detail and explain it.',wrong:'Repeat the title without explaining.',why:'A reason connects your answer to something in the example.'});
 const finger=qs.slice(0,6).map((q,i)=>({prompt:q.prompt,source:q.source||[],choices:i%2?[q.wrong,q.correct]:[q.correct,q.wrong],answer:i%2?2:1,explanation:q.why,followup:'Ask someone who chose the other option to explain their reasoning. Partners discuss for 30 seconds, then vote again. What changed your mind?'}));
 const repairs=qs.slice(-4).map(q=>({prompt:'Catch the teacher’s mistake',source:q.source||[],statement:`Question: ${q.prompt}\nTeacher says: “${q.wrong}”`,explanation:`Correction: ${q.correct}. ${q.why}`,followup:'Give a precise correction, then explain why the mistaken answer might tempt someone. Invent a clue that would help them avoid it.'}));
 const memory=[{prompt:'Look, cover, reconstruct',source,statement:'Read the evidence for 30 seconds. Hide it. In pairs, recover three details and explain one connection. Reopen it to check.',explanation:'Compare your record against the exact source. Award one informal point per accurate detail and one for explaining a connection. Correct additions that the source never stated.',followup:'Partner A describes one detail without saying its main word. Partner B identifies it and explains its role. Swap. Use notebook sketches if speaking is difficult.'}];
 const defend=qs.slice(0,3).map(q=>({prompt:'Could the other answer ever work?',source:q.source||[],statement:`In this question: ${q.prompt}\nThe supported answer is “${q.correct}”. What would need to change for “${q.wrong}” to become reasonable?`,explanation:`Start with the actual case: ${q.why} If the alternative is impossible or a category error, explain why; do not invent evidence to make it true.`,followup:'One pair proposes a changed condition or rejects the possibility. Another pair challenges it. Finish by restating what remains true in the original case.'}));
 const pack=(title,rounds,steps,outcome)=>({title,minutes:5,sourceTitle:'Optional extra-time activity',source,lines:steps,outcome,rounds});
 lesson.extensions=[
  pack('1 or 2 fingers · vote, explain, vote again',finger,['1 minute: show the two choices; everyone votes together.','3 minutes: hear reasons, reveal, discuss and re-vote; use several rounds.','1 minute: ask for an explanation without saying the option number.'],'Check understanding without a worksheet.'),
  pack('Catch the teacher · repair a mistake',repairs,['1 minute: read the deliberately mistaken response.','3 minutes: pairs diagnose and repair it; compare explanations.','1 minute: give a clue that would prevent the mistake.'],'Correct the idea, not just the answer.'),
  pack('Memory detectives · look, cover, reconstruct',memory,['30 seconds: study the source; then hide it.','3 minutes: reconstruct three details and teach a partner one connection.','90 seconds: compare, correct and try a word-free clue.'],'Retrieve accurately and distinguish remembering from guessing.'),
  pack('Change one condition · defend or reject',defend,['1 minute: read the original case and alternative.','3 minutes: change one condition, or explain why the alternative cannot work.','1 minute: another pair tests the reasoning; return to the original case.'],'Apply the idea flexibly without confusing a hypothetical with a fact.')
 ];
 lesson.extraTimeVersion=1;
 if(!lesson.teacherLed)lesson.pacingNote=`${elapsed}-minute core. Optional Extra time: choose any two five-minute games for 10 minutes, three for 15, or all four for 20. Reveal answers only after everyone has responded. The games do not mark core lesson work complete.`;
 return lesson;
}
