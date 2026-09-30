import test from 'node:test';import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';import {workshops} from '../src/lessons/geography-workshops.js';import {boardCase} from '../src/lessons/geography-board-cases.js';
test('Every Geography mission has six sourced board questions with concealed teaching models',()=>{
 for(const [code,w]of Object.entries(workshops))w.missions.forEach((_,index)=>{
  const c=boardCase(code,index);assert.ok(c.source.length>40,code);assert.equal(c.questions.length,6);assert.equal(new Set(c.questions.map(q=>q.prompt)).size,6);
  c.questions.forEach(q=>assert.ok(q.prompt&&q.answer.length>5,code));
 });
 for(const l of lessons.filter(l=>l.geoRedesign)){
  const frames=l.stages.flatMap(s=>s.frames),rounds=frames.filter(f=>f.boardRound);assert.equal(rounds.length,l.id==='g7b-geo-w02-1'?0:l.boardCaseFiles.length*2,l.id);assert.ok(l.boardTeachingGuide);assert.ok(l.boardFirst);
  rounds.forEach(f=>{assert.equal(f.type,'question');assert.ok(f.sourceCard&&f.geoDisplay&&f.boardWork&&f.teacherPrompt&&f.explanation);assert.ok(!f.lines.includes(f.explanation));});
  assert.equal(l.stages.reduce((n,s)=>n+s.durationMinutes,0),40);assert.ok(l.stages.every(s=>s.frames.every(f=>f.expectedSeconds>0)));
 }
 assert.equal(lessons.find(l=>l.id==='g7b-geo-w02-1').boardTeachingGuide.extra.length,6);
});
test('Generated review examples stay geographically and mathematically valid',()=>{
 for(let review=0;review<15;review++){
  const coordinates=boardCase('2.9',2,review).source.match(/\d+°[NS]/g);assert.ok(coordinates.every(s=>parseInt(s)<=90));
  const grid=boardCase('2.5',2,review).source.match(/A is (\d) tenths east and (\d) tenths north/);assert.notEqual(grid[1],grid[2]);
  assert.doesNotMatch(boardCase('5.6',2,review).questions[0].answer,/^-\d/);
 }
});
test('Assessments keep independent assessment conditions',()=>{for(const l of lessons.filter(l=>l.catalog?.subjectId==='geography'&&l.examId)){assert.ok(!l.boardFirst);assert.ok(!l.boardCaseFiles);}});

test('Smart-board lessons have revealable models, specific reviews and spoken departures',()=>{
 for(const lesson of lessons.filter(l=>l.geoRedesign)){
  const frames=lesson.stages.flatMap(s=>s.frames);
  assert.ok(frames.some(f=>f.geoDisplay?.demo?.steps.length||f.geoDisplay?.atlas?.fill),lesson.id);
  assert.ok(!frames.some(f=>f.title==='Compare with a worked response'),lesson.id);
  for(const f of frames.filter(f=>f.solutionCheck)){
   assert.ok(f.taskInstructions[0]&&f.sourceCard&&f.geoDisplay.workpad);
   assert.ok(lesson.stages.find(s=>s.id==='apply').frames.some(task=>task.workspaceId===f.workspaceId),lesson.id);
  }
  assert.ok(lesson.stages.at(-1).frames.filter(f=>!f.final).every(f=>/as you leave/i.test(f.lines.join(' '))),lesson.id);
 }
});
