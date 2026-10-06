import test from 'node:test';
import assert from 'node:assert/strict';
import {shapesForRound,stationShape} from '../src/coastal-shapes.js';
import {geoStops} from '../src/coastal-geography.js';
import {createGameState,nextRound,buyRoute,advanceGame,findShapeRoute} from '../src/coastal-connections.js';
test('Collection adds one new rare shape per five rounds and stable city assignments reuse them',()=>{
 assert.deepEqual(shapesForRound(2).map(s=>s.id),['circle','square']);assert.equal(shapesForRound(3).length,3);
 for(const round of [5,10,15,20,25])assert.equal(shapesForRound(round).length,shapesForRound(round-1).length+1);
 for(const s of geoStops){assert.ok(shapesForRound(s.round).some(shape=>shape.id===s.shape));assert.equal(stationShape(s.id,s.round,s.id===geoStops.findIndex(c=>c.round===s.round)),s.shape);}
 assert.equal(geoStops.filter(s=>s.shape==='diamond').length,3);for(const shape of ['pentagon','hexagon','star','cross'])assert.equal(geoStops.filter(s=>s.shape===shape).length,1);
});
test('Passengers can request and reach an unlocked rare destination',()=>{
 const s=createGameState(1);while(s.round<5){s.complete=true;s.cardPhase='done';nextRound(s);}s.credits=1000;buyRoute(s,3,7,'road');s.passengers=[{id:0,at:3,destination:7,mode:'waiting',wait:0}];s.target=1;
 assert.deepEqual(findShapeRoute(s,3,'diamond'),[3,7]);s.running=true;advanceGame(s,10);assert.equal(s.delivered,1);assert.equal(s.complete,true);
});
