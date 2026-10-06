import test from 'node:test';
import assert from 'node:assert/strict';
import {createGameState,buyRoute,advanceGame,removeRoute,nextRound,stationStats} from '../src/coastal-connections.js';
const setup=()=>{const s=createGameState(1);s.passengers=[{id:0,at:0,destination:1,mode:'waiting',wait:0},{id:1,at:0,destination:1,mode:'waiting',wait:0},{id:2,at:1,destination:0,mode:'waiting',wait:0}];s.target=3;s.levels.road=2;buyRoute(s,0,1,'road');s.running=true;return s;};
test('Each boarding passenger takes half a second, and vehicles stay parked until loading finishes',()=>{
 const s=setup(),l=s.links[0];advanceGame(s,.25);assert.equal(s.passengers[0].mode,'boarding');assert.equal(l.cargo.length,0);assert.equal(l.position,0);
 advanceGame(s,.25);assert.deepEqual(l.cargo,[0]);assert.equal(l.position,0);advanceGame(s,.5);assert.deepEqual(l.cargo,[0,1]);assert.equal(l.service,null);assert.equal(l.position,0);advanceGame(s,.1);assert.ok(l.position>0);
});
test('Passengers unload one by one before any return passengers board; fares are paid after unloading',()=>{
 const s=setup(),l=s.links[0];advanceGame(s,1);while(!l.service)advanceGame(s,.05);assert.equal(l.service.phase,'unload');assert.equal(s.delivered,0);const cash=s.credits;
 advanceGame(s,.5);assert.equal(s.delivered,1);assert.equal(s.credits,cash+3);assert.deepEqual(l.cargo,[1]);assert.equal(s.passengers[2].mode,'waiting');
 advanceGame(s,.5);assert.equal(s.delivered,2);assert.equal(l.cargo.length,0);assert.equal(s.passengers[2].mode,'waiting');advanceGame(s,.25);assert.equal(s.passengers[2].mode,'boarding');assert.equal(l.position,0);advanceGame(s,.25);assert.deepEqual(l.cargo,[2]);assert.equal(l.service,null);
});
test('Station upgrades shorten both directions of passenger handling',()=>{
 const s=setup();for(const [level,seconds]of [[1,.5],[2,.4],[3,.3],[4,.2]]){s.terminals[0]=level;assert.ok(Math.abs(stationStats(s,0).handling-seconds)<1e-9);}
 s.terminals[0]=4;advanceGame(s,.4);assert.deepEqual(s.links[0].cargo,[0,1]);assert.equal(s.links[0].position,0);
});
test('Pausing and ferry closure freeze handling; cancelled boarding releases its passenger',()=>{
 const s=setup();advanceGame(s,.25);const clock=s.links[0].service.clock;s.running=false;advanceGame(s,5);assert.equal(s.links[0].service.clock,clock);removeRoute(s,0);assert.equal(s.passengers[0].mode,'waiting');assert.equal(s.passengers[0].at,0);
 const t=setup();advanceGame(t,1);while(!t.links[0].service)advanceGame(t,.05);removeRoute(t,0);assert.equal(t.passengers[0].at,0);assert.equal(t.passengers[0].mode,'waiting');assert.equal(t.delivered,0);
 const f=createGameState();f.round=10;f.activeStops=[13,15];f.facilities={13:['port'],15:['port']};f.credits=100;f.passengers=[{id:0,at:13,destination:15,mode:'waiting',wait:0}];f.target=1;buyRoute(f,13,15,'ferry');f.running=true;advanceGame(f,.25);f.ferryClosed=true;advanceGame(f,1);assert.equal(f.links[0].service.clock,.25);f.ferryClosed=false;advanceGame(f,.25);assert.deepEqual(f.links[0].cargo,[0]);
});
test('Retry and the next round clear old service clocks and boarding reservations',()=>{const s=setup();advanceGame(s,.25);nextRound(s,true);assert.equal(s.links[0].service,undefined);assert.ok(s.passengers.every(p=>p.mode==='waiting'));s.complete=true;s.cardPhase='done';nextRound(s);assert.equal(s.links[0].service,undefined);assert.equal(s.links[0].cargo.length,0);});
