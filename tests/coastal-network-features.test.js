import test from 'node:test';
import assert from 'node:assert/strict';
import {createGameState,nextRound,buyLine,buyRoute,extendLine,advanceGame,findRoute,passengerJourney,roundReview,routeIssue,lineStops,removeRoute} from '../src/coastal-connections.js';
import {planEvent,eventActive,eventSpeed} from '../src/coastal-events.js';
const fixture=(round=3,mode='normal')=>{const s=createGameState(1,mode);while(s.round<round){s.complete=true;s.cardPhase='done';nextRound(s);}s.credits=1000;return s;};
test('One multi-stop bus serves intermediate stops and reverses at the ends',()=>{
 const s=fixture();assert.equal(buyLine(s,[0,1,4],'road'),null);assert.equal(s.links.length,1);assert.equal(s.credits,960);assert.deepEqual(findRoute(s,0,4),[0,1,4]);
 s.passengers=[{id:0,at:0,destination:4,mode:'waiting',wait:0},{id:1,at:4,destination:0,mode:'waiting',wait:0}];s.target=2;
 assert.deepEqual(passengerJourney(s,s.passengers[0]).transfers,[]);s.running=true;advanceGame(s,20);
 assert.equal(s.complete,true);assert.equal(s.delivered,2);assert.equal(s.links.length,1);assert.equal(s.links[0].stats.delivered,2);assert.equal(s.links[0].stats.credits,6);assert.equal(s.links[0].stats.boarded,2);assert.ok(s.links[0].stats.service>=2);assert.ok(s.links[0].stats.travel>0);
 const review=roundReview(s);assert.ok(review.busiest);assert.ok(review.longestWait>0);assert.equal(review.best.delivered,2);
 removeRoute(s,0);assert.equal(roundReview(s).best.delivered,2);
});
test('Line purchases are atomic; extension obeys geography and the budget',()=>{
 const s=fixture(10),before=structuredClone(s);assert.equal(buyLine(s,[0,1,15],'road').code,'sea');assert.deepEqual(s.links,before.links);assert.equal(s.credits,before.credits);
 assert.equal(buyRoute(s,0,1,'road'),true);assert.equal(extendLine(s,0,4),null);assert.deepEqual(lineStops(s.links[0]),[0,1,4]);assert.equal(s.links[0].paid,40);
 const credits=s.credits;assert.equal(extendLine(s,0,1).code,'loop');assert.equal(s.credits,credits);s.credits=0;assert.equal(extendLine(s,0,3).code,'credits');
 assert.equal(routeIssue(s,1,4,'road').code,'duplicate');
});
test('Journey previews distinguish a through line from a vehicle transfer',()=>{
 const s=fixture();buyRoute(s,0,1,'road');buyRoute(s,1,4,'road');const p={at:0,destination:4};assert.deepEqual(passengerJourney(s,p).transfers,[1]);assert.equal(passengerJourney(s,{at:2,destination:4}),null);
});
test('Selling a multi-stop bus during unloading returns unfinished riders to its last departure',()=>{
 const s=fixture();buyLine(s,[0,1,4],'road');s.passengers=[{id:0,at:0,destination:4,mode:'waiting',wait:0}];s.target=1;s.running=true;
 for(let i=0;i<200&&!(s.links[0].service?.at===4&&s.links[0].service.phase==='unload');i++)advanceGame(s,.05);
 assert.equal(s.links[0].service.at,4);assert.equal(s.delivered,0);removeRoute(s,0);assert.equal(s.passengers[0].at,1);assert.equal(s.passengers[0].mode,'waiting');assert.equal(s.delivered,0);
});
test('Retry restores multi-stop lines and resets round statistics without changing mode',()=>{
 const s=fixture(3,'hard');buyLine(s,[0,1,4],'road');s.running=true;advanceGame(s,1);s.links[0].nodes.push(3);s.credits=0;
 assert.equal(nextRound(s,true),true);assert.deepEqual(lineStops(s.links[0]),[0,1,4]);assert.equal(s.links[0].segment,0);assert.equal(s.links[0].stats.delivered,0);assert.equal(s.mode,'hard');assert.equal(s.event,null);assert.equal(s.roundStats.wait,0);
});
test('Hard events give warning, affect the appropriate transport only, then expire',()=>{
 const s=fixture(3,'hard');s.event=planEvent(s);s.elapsed=18;assert.equal(eventActive(s),false);assert.equal(eventSpeed(s,'road',0,1),1);
 s.elapsed=30;assert.equal(eventActive(s),true);assert.equal(eventSpeed(s,'road',0,1),.65);assert.equal(eventSpeed(s,'rail',0,1),1);assert.equal(eventSpeed(s,'road',5,6),1);
 s.elapsed=54;assert.equal(eventActive(s),false);s.mode='normal';s.elapsed=31;assert.equal(eventSpeed(s,'road',0,1),1);assert.equal(planEvent(s),null);assert.equal(planEvent(fixture(1,'hard')),null);
 const sea=fixture(11,'hard');sea.event=planEvent(sea);assert.equal(sea.event.id,'sea-fog');sea.elapsed=31;assert.equal(eventSpeed(sea,'ferry',13,15),.5);
});
test('Festival redistributes arrivals to Edinburgh without increasing round demand',()=>{
 const s=fixture(6,'hard');s.elapsed=31;s.running=true;advanceGame(s,7);assert.equal(s.event.id,'festival');assert.ok(s.passengers.length>0);assert.equal(s.passengers[0].at,8);assert.ok(s.passengers.length<=s.target);
});
