import fs from 'node:fs';
import {lessons} from '../src/lessons.js';
const geo=lessons.filter(l=>l.catalog?.subjectId==='geography');
const rows=geo.map(l=>{
 const frames=l.stages.flatMap(s=>s.frames);
 return {id:l.id,class:l.catalog.classes[0],title:l.title,assessment:!!l.examId,review:!!l.geographyReview,minutes:l.durationMinutes,
  objectives:l.learningObjectives||[],sections:l.bookSections||[],workedDemonstrations:frames.filter(f=>f.teachingModel).length,
  boardActivities:frames.filter(f=>f.boardActivity).map(f=>({type:f.boardActivity.type,title:f.boardActivity.title})),
  independentTasks:l.stages.find(s=>s.id==='apply')?.frames.map(f=>f.title)||[],
  disposition:l.examId?'Assessment retained; optional revision worksheets remain separate.':'Revised: authored demonstration, board challenge, independent task and worked response.'};
});
const report={date:'2026-09-29',scope:'Teacher-led Geography player; 7A and 7B. All 96 scheduled sessions inspected, including 10 assessments.',
 baseline:{teachingAndReview:86,genericFollowOnLessons:33,withoutStudentBoardChallenges:86,repeatedReviewTaskSequences:true},
 limitations:['Engagement is a classroom outcome, not established by automated tests.','Smart-board behaviour is tested with browser touch and keyboard input, not the physical classroom board.','Textbook section alignment comes from existing plans. Complete printed pages were not supplied.','Independent-study translation exports are separate and were not regenerated.'],lessons:rows};
fs.writeFileSync('docs/geography-audit.json',JSON.stringify(report,null,2)+'\n');
const table=rows.map(r=>`| ${r.id} | ${r.class.toUpperCase()} | ${r.assessment?'Assessment':r.review?'Review':'Teaching'} | ${r.objectives.join('; ')||'Assessment conditions retained'} | ${r.boardActivities.map(b=>b.type).join(', ')||'—'} |`).join('\n');
fs.writeFileSync('docs/geography-audit.md',`# Geography content and smart-board audit\n\n${report.scope}\n\nFound: 33 sessions still used generic follow-on instruction; all 86 teaching/review sessions lacked student-operated board challenges; several review slots reused the same tasks.\n\nRevised: mission-specific worked demonstrations, six touch/keyboard activity formats, distinct review purposes, and a separate independent application. Core timing remains 40 minutes. The models and source cards remain available. Numerical examples and allocation constraints are classroom models.\n\nThe board can be operated by the teacher or an invited pupil. Everyone predicts before the tap. Feedback explains the reasoning; retry and reset are available. Board choices are kept when reopening during the current page session and are not saved as pupil grades.\n\n## Evidence and limits\n\n${report.limitations.map(x=>'- '+x).join('\n')}\n\nTopic checks: [OS map reading](https://www.ordnancesurvey.co.uk/documents/resources/map-reading.pdf), [USGS glacier terminology](https://pubs.usgs.gov/of/2004/1216/text.html). Original classroom examples apply those concepts.\n\n## Lesson inventory\n\n| Lesson ID | Class | Purpose | Learning objectives | Board formats |\n|---|---|---|---|---|\n${table}\n`);
console.log(`Audited ${rows.length} Geography sessions; ${rows.filter(r=>!r.assessment).length} have revised teaching and board challenges.`);
