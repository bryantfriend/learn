import test from 'node:test';
import assert from 'node:assert/strict';
import {roadSegmentsConflict} from '../src/coastal-route-geography.js';
import {createGameState,nextRound,buyRoute,routeIssue,removeRoute} from '../src/coastal-connections.js';
test('Road geometry blocks intersections and overlaps but permits station junctions',()=>{
 const p=(x,y)=>({x,y}),a=p(0,0),b=p(10,10),c=p(0,10),d=p(10,0);
 for(const [u,v,w,z]of [[a,b,c,d],[b,a,c,d],[c,d,a,b]])assert.equal(roadSegmentsConflict(u,v,w,z),true);
 assert.equal(roadSegmentsConflict(a,b,b,p(20,0)),false);
 assert.equal(roadSegmentsConflict(a,b,p(5,5),p(5,10)),true);
 assert.equal(roadSegmentsConflict(a,b,a,p(5,5)),true);
 assert.equal(roadSegmentsConflict(a,b,b,p(20,20)),false);
 assert.equal(roadSegmentsConflict(a,b,p(0,2),p(10,12)),false);
 assert.equal(roadSegmentsConflict(a,b,p(20,20),p(30,30)),false);
});
const fixture=()=>{const s=createGameState(1);while(s.round<8){s.complete=true;s.cardPhase='done';nextRound(s);}s.credits=1000;return s;};
test('Crossing bus purchases spend nothing; selling the conflict allows redrawing',()=>{
 const s=fixture();assert.equal(buyRoute(s,0,3,'road'),true);const credits=s.credits;
 for(const [a,b]of [[1,4],[4,1]]){assert.equal(routeIssue(s,a,b,'road').code,'crossing');assert.equal(buyRoute(s,a,b,'road'),false);assert.equal(s.credits,credits);assert.equal(s.links.length,1);}
 assert.equal(buyRoute(s,0,1,'road'),true);assert.equal(routeIssue(s,3,0,'road').code,'duplicate');
 assert.equal(removeRoute(s,0),true);assert.equal(buyRoute(s,1,4,'road'),true);
});
test('Road crossing rule leaves train crossings available',()=>{
 const s=fixture();assert.equal(buyRoute(s,0,3,'road'),true);assert.equal(buyRoute(s,1,4,'rail'),true);
 const t=fixture();assert.equal(buyRoute(t,0,3,'rail'),true);assert.equal(buyRoute(t,1,4,'road'),true);
});
