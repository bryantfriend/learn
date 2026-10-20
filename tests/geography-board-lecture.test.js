import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {lessons} from '../src/lessons.js';
import {geographyTeachingStories} from '../src/lessons/geography-teaching-stories.js';
import {geographyConcepts} from '../src/lessons/geography-lecture.js';
import {workshops} from '../src/lessons/geography-workshops.js';
import {worksheetFor} from '../src/worksheets.js';
const geo=lessons.filter(l=>l.boardLecture);
test('Every scheduled teaching and review lesson has a complete oral teaching route',()=>{
 assert.equal(geo.length,86);assert.deepEqual(Object.keys(geographyTeachingStories).sort(),Object.keys(workshops).sort());
 for(const l of geo){
  assert.equal(l.teachingApproach,'board-led-lecture');assert.equal(l.courseModelVersion,2);
  assert.equal(l.stages.reduce((n,s)=>n+s.durationMinutes,0),40);
  const frames=l.stages.flatMap(s=>s.frames);
  assert.ok(frames.every(f=>f.teacherScript&&f.lectureScript),l.id);
  assert.ok(frames.filter(f=>!f.final).every(f=>f.geoArt||f.geoDisplay),l.id);
  assert.ok(!frames.some(f=>f.independentTask||f.revisionTask||f.homework||f.mode==='pair'),l.id);
  assert.doesNotMatch(frames.flatMap(f=>f.lines).join(' '),/write down|in your notebook|complete independently|use the book|textbook map/i,l.id);
  for(const s of l.stages){assert.equal(s.frames.reduce((n,f)=>n+f.expectedSeconds,0),s.durationMinutes*60,l.id);assert.ok(s.frames.every(f=>f.expectedSeconds>0));}
  assert.ok(frames.at(-1).final,l.id);
  for(const code of new Set(l.bookSections)){
   assert.ok(frames.some(f=>f.teachingStory&&f.kicker.includes('· '+code+' · ')),l.id);
   if(!l.geographyReview)assert.equal(frames.filter(f=>f.conceptId?.startsWith(code+'-')).length,geographyConcepts[code].length,l.id);
  }
 }
});
test('Every scheduled case retains evidence, a complete explanation and a changed example',()=>{
 for(const l of geo){const apply=l.stages.find(s=>s.id==='apply').frames;
  assert.equal(apply.filter(f=>f.worksheetTask).length,l.workshopMissions.length,l.id);
  assert.equal(apply.filter(f=>f.changedExample).length,l.workshopMissions.length,l.id);
  for(const f of l.stages.find(s=>s.id==='model').frames.filter(f=>f.teachingModel&&f.geoDisplay?.source))assert.equal(f.geoDisplay.source,f.sourceCard,l.id);
  for(const f of apply){assert.ok(f.sourceCard&&f.teacherDemonstration&&f.teacherScript,l.id);assert.equal(f.geoDisplay.source,f.sourceCard);}
  for(const f of l.stages.find(s=>s.id==='check').frames){assert.ok(f.type==='question'&&f.explanation&&f.allowHideAnswer);assert.ok(!f.choices&&!f.options);assert.ok(!f.lines.includes(f.explanation));}
 }
});
test('Printed consolidation is self-contained, optional and excludes teacher answers',()=>{
 for(const l of geo)for(const kind of ['lesson','homework']){
  const sheet=worksheetFor(l,kind,lessons);assert.match(sheet.note,/optional/i);assert.equal(sheet.pages.length,l.workshopMissions.length,l.id);
  sheet.pages.forEach((p,i)=>{assert.ok(p.sources.length&&p.sections.length===3);assert.ok(p.sections.every(s=>s.lines.length&&s.space>=3));assert.ok(!JSON.stringify(p).includes('teacherScript'));assert.ok(!p.answer);});
 }
});
test('Visuals exist and the three new teaching stories explain specific mechanisms',()=>{
 for(const l of geo)for(const f of l.stages.flatMap(s=>s.frames))assert.ok(existsSync('assets/'+f.geoArt.image),f.geoArt.image);
 assert.match(geographyTeachingStories['2.2'].explanation,/100 ÷ 20 = 5/);
 assert.match(geographyTeachingStories['3.4'].explanation,/18 \+ 12 − 5 = 25/);
 assert.match(geographyTeachingStories['4.2'].connection,/continues flowing downhill/);
 assert.match(geographyTeachingStories['5.3'].explanation,/1.6 cubic metres per second/);
 assert.match(geographyTeachingStories['5.8'].explanation,/runoff doubles/);
});
