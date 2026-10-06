import test from 'node:test';
import assert from 'node:assert/strict';
import {routeAllowed,createGameState,findRoute,advanceGame} from '../src/coastal-connections.js';
const link=(a,b,type)=>({a,b,type,position:0,direction:1,cargo:[]});
test('Coastal transport respects land, ports and airports',()=>{
 assert.equal(routeAllowed('road',0,1),true);assert.equal(routeAllowed('road',0,2),false);
 assert.equal(routeAllowed('ferry',1,2),true);assert.equal(routeAllowed('ferry',0,2),false);
 assert.equal(routeAllowed('flight',3,4),true);assert.equal(routeAllowed('flight',0,2),false);
});
test('Passengers transfer between vehicles and arrive at their own destination',()=>{
 const s=createGameState();s.links=[link(0,1,'road'),link(1,2,'ferry')];s.running=true;advanceGame(s,90);
 assert.equal(s.delivered,5);assert.equal(s.complete,true);assert.equal(s.running,false);
 assert.ok(s.passengers.every(p=>p.mode==='delivered'&&p.at===p.destination));
 const stalled=createGameState();stalled.links=[link(0,1,'road')];stalled.running=true;advanceGame(stalled,90);assert.equal(stalled.delivered,0);
});
test('Cancelled ferry needs a valid airport route; pause preserves simulation',()=>{
 const s=createGameState();s.ferryClosed=true;s.links=[link(0,1,'road'),link(1,2,'ferry')];
 assert.equal(findRoute(s,0,2),null);const before=JSON.stringify(s);advanceGame(s,10);assert.equal(JSON.stringify(s),before);
 s.links.push(link(0,3,'road'),link(3,4,'flight'),link(4,2,'road'));
 assert.deepEqual(findRoute(s,0,2),[0,3,4,2]);s.running=true;advanceGame(s,150);assert.equal(s.delivered,5);
});
