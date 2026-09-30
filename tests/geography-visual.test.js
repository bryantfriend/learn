import test from 'node:test';import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';import {atlasArt} from '../src/geography-atlas.js';import {postcards,initialPostState,checkPostcards} from '../src/geography-postcards.js';
import {initialBoardState,placeSequenceCard,evaluateBoard} from '../src/geography-board.js';
test('Dragging into a numbered sequence slot preserves the slot and does not count gaps as complete',()=>{
 const spec={type:'sequence',items:[{id:'a',answer:0},{id:'b',answer:1},{id:'c',answer:2}]},state=initialBoardState(spec);
 placeSequenceCard(state,'c',2);assert.deepEqual(state.order,[null,null,'c']);assert.equal(evaluateBoard(spec,state).complete,false);assert.equal(evaluateBoard(spec,state).correct,false);
 placeSequenceCard(state,'a',0);placeSequenceCard(state,'b',1);assert.equal(evaluateBoard(spec,state).correct,true);
 placeSequenceCard(state,'a',2);assert.deepEqual(state.order,[null,'b','a']);assert.equal(evaluateBoard(spec,state).complete,false);
 state.order=state.orderHistory.pop();assert.equal(evaluateBoard(spec,state).correct,true);
});
test('UK lesson has maps, three view scales, distinct games and a spoken exit',()=>{
 const l=lessons.find(l=>l.id==='g7b-geo-w02-1');
 assert.ok(l.stages.filter(s=>['begin','teach'].includes(s.id)).every(s=>s.frames.every(f=>f.geoDisplay.atlas)));
 assert.ok(l.stages[1].frames.some(f=>f.geoDisplay.atlas.scales));
 assert.deepEqual(l.stages.flatMap(s=>s.frames).filter(f=>f.postcardActivity).map(f=>f.postcardActivity.mode),['sorting','postcards']);
 assert.match(l.stages.at(-1).frames[0].lines.join(' '),/spoken sentence as you leave/);
 assert.deepEqual(l.stages[0].frames[0].choices,['Great Britain','The island of Ireland']);
 assert.ok(l.stages[1].frames.some(f=>f.geoDisplay.atlas.compare));assert.ok(l.stages[1].frames.some(f=>f.geoDisplay.atlas.fill));
 for(const view of ['world','europe','islands'])assert.match(atlasArt({view}),/<svg/);
 assert.match(atlasArt(),/Irish Sea/);assert.match(atlasArt({labels:false}),/data-country="Northern Ireland"/);
});
test('Postcards require four correct countries, not merely four placements',()=>{
 const s=initialPostState();assert.equal(checkPostcards(s),false);for(const c of postcards)s.placements[c.id]=c.answer;assert.equal(checkPostcards(s),true);s.placements.belfast='England';assert.equal(checkPostcards(s),false);
});
test('All workshops display teaching diagrams and source evidence; exits ask for speech',()=>{
 for(const l of lessons.filter(l=>l.geoRedesign)){
  assert.ok(l.stages.find(s=>s.id==='teach').frames.every(f=>f.geoDisplay),l.id);
  for(const f of l.stages.find(s=>s.id==='apply').frames)if(f.sourceCard)assert.ok(f.geoDisplay,l.id);
  assert.ok(!l.stages.find(s=>s.id==='teach').frames.some(f=>f.title.startsWith('Read the investigation source')),l.id);
  assert.ok(l.stages.at(-1).frames.filter(f=>!f.final).every(f=>f.mode==='share'&&f.lines.length<=2),l.id);
 }
});
