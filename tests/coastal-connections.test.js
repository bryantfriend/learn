import test from 'node:test';
import assert from 'node:assert/strict';
import {routeAllowed,createGameState,findRoute,advanceGame,nextRound,upgradeVehicle,vehicleStats,buyRoute,removeRoute,upgradeTerminal,roundDuration} from '../src/coastal-connections.js';
const link=(a,b,type)=>({a,b,type,position:0,direction:1,cargo:[]});
test('Coastal transport respects land, ports and airports',()=>{
 assert.equal(routeAllowed('road',0,1),true);assert.equal(routeAllowed('road',0,2),false);
 assert.equal(routeAllowed('ferry',1,2),true);assert.equal(routeAllowed('ferry',0,2),false);
 assert.equal(routeAllowed('flight',3,4),true);assert.equal(routeAllowed('flight',0,2),false);
});
test('Round rewards buy fleet upgrades and new rounds keep the network',()=>{
 const s=createGameState();s.links=[link(0,1,'road'),link(1,2,'ferry')];s.running=true;advanceGame(s,90);
 const credits=s.credits;assert.ok(credits>=4);assert.equal(upgradeVehicle(s,'ferry'),true);assert.equal(s.credits,credits-35);assert.equal(vehicleStats(s,'ferry').capacity,5);
 assert.equal(nextRound(s),true);assert.equal(s.round,2);assert.equal(s.target,9);assert.ok(s.activeStops.includes(5));assert.equal(s.links.length,2);assert.equal(s.levels.ferry,2);
 s.credits=0;s.running=true;assert.equal(upgradeVehicle(s,'road'),false);advanceGame(s,8);assert.ok(s.passengers.length>0&&s.passengers.length<9);
});
test('Trains take the fastest land route; crowding can be retried without losing upgrades',()=>{
 const s=createGameState();s.links=[link(0,1,'road'),link(1,2,'ferry'),link(0,1,'rail')];assert.equal(routeAllowed('rail',0,2),false);
 s.running=true;advanceGame(s,.05);assert.equal(s.links[0].cargo.length,0);assert.ok(s.links[2].cargo.length>0);
 const crowded=createGameState();crowded.target=8;crowded.passengers=Array.from({length:8},(_,id)=>({id,at:0,destination:2,mode:'waiting'}));crowded.links=[link(1,2,'ferry')];crowded.levels.road=2;crowded.running=true;advanceGame(crowded,25);assert.equal(crowded.failed,true);assert.equal(crowded.running,false);
 nextRound(crowded,true);assert.equal(crowded.failed,false);assert.equal(crowded.levels.road,2);assert.equal(crowded.links.length,1);assert.equal(crowded.round,1);
});
test('Passengers transfer between vehicles and arrive at their own destination',()=>{
 const s=createGameState();s.links=[link(0,1,'road'),link(1,2,'ferry')];s.running=true;advanceGame(s,90);
 assert.equal(s.delivered,5);assert.equal(s.complete,true);assert.equal(s.running,false);
 assert.ok(s.passengers.every(p=>p.mode==='delivered'&&p.at===p.destination));
 const stalled=createGameState();stalled.links=[link(0,1,'road')];stalled.running=true;advanceGame(stalled,90);assert.equal(stalled.delivered,3);
});
test('Cancelled ferry needs a valid airport route; pause preserves simulation',()=>{
 const s=createGameState();s.ferryClosed=true;s.links=[link(0,1,'road'),link(1,2,'ferry')];
 assert.equal(findRoute(s,0,2),null);const before=JSON.stringify(s);advanceGame(s,10);assert.equal(JSON.stringify(s),before);
 s.links.push(link(0,3,'road'),link(3,4,'flight'),link(4,2,'road'));
 assert.deepEqual(findRoute(s,0,2),[0,3,4,2]);s.running=true;advanceGame(s,150);assert.equal(s.delivered,5);
});
test('Starting budget funds the bus, local fares fund a boat, and deliveries pay once',()=>{
 const s=createGameState();assert.equal(buyRoute(s,1,2,'ferry'),false);assert.equal(buyRoute(s,0,1,'road'),true);assert.equal(s.credits,0);s.running=true;advanceGame(s,8);assert.equal(s.delivered,3);assert.equal(s.credits,45);assert.equal(buyRoute(s,1,2,'ferry'),true);advanceGame(s,30);assert.equal(s.complete,true);assert.equal(s.roundIncome,75);const balance=s.credits;advanceGame(s,10);assert.equal(s.credits,balance);
});
test('Selling a ridden route returns passengers safely and refunds only 75 percent',()=>{
 const s=createGameState();buyRoute(s,0,1,'road');s.running=true;advanceGame(s,1);assert.ok(s.links[0].cargo.length);removeRoute(s,0);assert.equal(s.credits,15);assert.ok(s.passengers.every(p=>p.mode!=='riding'));assert.equal(removeRoute(s,0),false);assert.equal(s.credits,15);
});
test('Long waits and full queues start a ten-second alarm; terminal upgrades relieve it',()=>{
 const s=createGameState();s.running=true;advanceGame(s,21);assert.ok(s.danger[0]>0);assert.equal(s.failed,false);s.running=false;const danger=s.danger[0];advanceGame(s,9);assert.equal(s.danger[0],danger);s.credits=40;assert.equal(upgradeTerminal(s,0),true);assert.equal(upgradeTerminal(s,1),true);s.running=true;advanceGame(s,1);assert.equal(s.danger[0],0);advanceGame(s,20);assert.equal(s.failed,true);assert.match(s.lossReason,/10 seconds/);
 const timer=createGameState();timer.passengers=[];timer.running=true;advanceGame(timer,roundDuration(timer)+1);assert.equal(timer.failed,true);assert.match(timer.lossReason,/timer/);
});
test('Retry rolls back spending and delivery income to prevent farming credits',()=>{
 const s=createGameState();buyRoute(s,0,1,'road');s.running=true;advanceGame(s,8);buyRoute(s,1,2,'ferry');nextRound(s,true);assert.equal(s.credits,0);assert.equal(s.links.length,1);assert.equal(s.delivered,0);assert.equal(s.roundIncome,0);
});
