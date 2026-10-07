import test from 'node:test';
import assert from 'node:assert/strict';
import {routeAllowed,createGameState,findRoute,findShapeRoute,advanceGame,nextRound,upgradeVehicle,vehicleUpgradeCost,vehicleStats,buyRoute,removeRoute,repairGeography,upgradeTerminal,roundDuration,chooseCard,goodCards,badCards,buildFacility,arrivalInterval,routeIssue,vehicleUnlocked} from '../src/coastal-connections.js';
import {regions,geoStops,activeForRound,discoveryForRound} from '../src/coastal-geography.js';
import {drawCards} from '../src/coastal-cards.js';
const atRound=r=>{const s=createGameState(123);while(s.round<r){s.complete=true;s.cardPhase='done';nextRound(s);}s.credits=1000;return s;};

test('Bus upgrades require growing investments but careful players can buy level 4 before round 20',()=>{
 const s=atRound(15);s.credits=1300;
 for(const cost of [100,300]){assert.equal(vehicleUpgradeCost(s,'road'),cost);const before=s.credits;assert.equal(upgradeVehicle(s,'road'),true);assert.equal(s.credits,before-cost);}
 assert.equal(vehicleUpgradeCost(s,'road'),900);const before=s.credits;
 assert.equal(before,900);s.credits=899;assert.equal(upgradeVehicle(s,'road'),false);assert.equal(s.credits,899);assert.equal(s.levels.road,3);
 s.credits=900;assert.equal(upgradeVehicle(s,'road'),true);assert.equal(s.credits,0);assert.equal(s.levels.road,4);assert.equal(upgradeVehicle(s,'road'),false);
});
test('Upgrade discounts let careful savers buy bus level 4 earlier',()=>{
 const s=atRound(15);s.mods.upgradeCost=-.5;s.levels.road=3;
 assert.equal(vehicleUpgradeCost(s,'road'),450);assert.equal(upgradeVehicle(s,'road'),true);assert.equal(s.credits,550);
});
test('Older water routes and inland harbours are refunded once on repair',()=>{const s=atRound(18);s.facilities[22]=['port'];s.links.push({a:9,b:7,type:'road',position:0,direction:1,cargo:[],paid:20});const credits=s.credits;assert.equal(repairGeography(s),2);assert.equal(s.credits,credits+65);assert.equal(s.links.length,0);assert.ok(!s.facilities[22].includes('port'));assert.equal(repairGeography(s),0);assert.equal(s.credits,credits+65);});
test('Land routes reject water crossings within the same island without spending credits',()=>{
 const s=atRound(20);for(const type of ['road','rail','highspeed']){for(const [a,b]of [[9,7],[7,9],[2,5],[5,2]]){const credits=s.credits;assert.equal(routeAllowed(type,a,b,s),false);assert.equal(routeIssue(s,a,b,type).code,'sea');assert.equal(buyRoute(s,a,b,type),false);assert.equal(s.credits,credits);}assert.equal(routeAllowed(type,9,8,s),true);assert.equal(routeAllowed(type,3,7,s),true);}
});
test('Harbours require a named coastal or tidal waterfront even when credits are available',()=>{
 const s=atRound(18);for(const id of [0,1,3,4,8,9,10,21,22,24]){const credits=s.credits;assert.equal(buildFacility(s,id,'port'),false);assert.equal(s.credits,credits);assert.equal(geoStops[id].coastal,false);}
 assert.equal(buildFacility(s,5,'port'),true);assert.equal(buildFacility(s,7,'port'),true);assert.equal(buildFacility(s,2,'port'),true);

});
test('Common reusable shapes start early and rare shapes join every five rounds',()=>{
 for(const r of [1,2])assert.deepEqual(new Set(activeForRound(r).map(id=>geoStops[id].shape)),new Set(['circle','square']));
 assert.equal(geoStops[4].round,3);assert.equal(geoStops[4].shape,'triangle');
 for(const [round,shape]of [[5,'diamond'],[10,'pentagon'],[15,'hexagon'],[20,'star'],[25,'cross']]){assert.ok(!activeForRound(round-1).some(id=>geoStops[id].shape===shape));assert.ok(activeForRound(round).some(id=>geoStops[id].shape===shape));}
 assert.ok(geoStops.filter(s=>!['circle','square','triangle'].includes(s.shape)).length<=geoStops.length*.25);
 assert.equal(geoStops[0].shape,geoStops[2].shape);
});
test('Passengers reach any matching shape through transfers, even with their representative city disconnected',()=>{
 const s=atRound(3);s.passengers=[{id:0,at:0,destination:3,mode:'waiting',wait:0}];s.target=1;
 buyRoute(s,0,4,'road');buyRoute(s,4,1,'road');
 assert.equal(findRoute(s,0,3),null);assert.deepEqual(findShapeRoute(s,0,'square'),[0,4,1]);
 s.running=true;advanceGame(s,20);assert.equal(s.complete,true);assert.equal(s.passengers[0].at,1);assert.equal(s.delivered,1);
});
test('Generated passengers always request a shape different from their starting station',()=>{
 for(const round of [2,3,10,27]){const s=atRound(round);s.running=true;advanceGame(s,arrivalInterval(s)*s.activeStops.length*1.5);assert.ok(s.passengers.length>0);for(const p of s.passengers)assert.notEqual(geoStops[p.at].shape,geoStops[p.destination].shape);}
});
test('Selling a vehicle before arrival returns matching-shape riders to a usable departure stop',()=>{
 const s=createGameState();buyRoute(s,0,1,'road');s.running=true;advanceGame(s,1.1);assert.ok(s.links[0].position>.5);removeRoute(s,0);assert.equal(s.passengers[0].at,0);assert.equal(s.passengers[0].mode,'waiting');assert.equal(s.delivered,0);
});
test('Starts in England with one-seat vehicles and only a bus budget',()=>{const s=createGameState(1);assert.deepEqual(s.activeStops,[0,1,2]);assert.equal(s.credits,20);for(const type of Object.keys(s.levels))assert.equal(vehicleStats(s,type).capacity,1);assert.equal(vehicleUnlocked(s,'road'),true);assert.equal(vehicleUnlocked(s,'ferry'),false);});
test('Training grant funds only the first expansion and retry cannot compound it',()=>{
 const s=createGameState(1);buyRoute(s,0,1,'road');s.running=true;advanceGame(s,8);assert.equal(s.roundIncome,9);assert.equal(s.credits,30);assert.equal(s.starterGrantPaid,true);advanceGame(s,3);assert.equal(s.credits,30);
 nextRound(s,true);assert.equal(s.credits,0);assert.equal(s.starterGrantPaid,false);s.running=true;advanceGame(s,8);assert.equal(s.credits,30);
});
test('Early income cannot fund a complete network and maxed bus fleet by round 4',()=>{
 // Optimistic budget: three stars every round, no paid upgrades or challenge taxes.
 const faresThroughFour=[5,9,13,17].reduce((n,target)=>n+target*3,0),stars=4*3*2,starter=20+11;
 const minimumNetwork=6*20,fullFleet=100+300+900;
 assert.equal(starter+faresThroughFour+stars-minimumNetwork,67);
 assert.ok(starter+faresThroughFour+stars<minimumNetwork+fullFleet);
});
test('Country unlocks expose capitals and preserve country distinctions',()=>{for(const r of regions){assert.ok(!activeForRound(r.round-1).some(id=>geoStops[id].region===r.id));assert.ok(activeForRound(r.round).some(id=>geoStops[id].region===r.id&&geoStops[id].capital));}assert.equal(geoStops[14].region,'northern-ireland');assert.equal(geoStops[15].region,'ireland');assert.equal(geoStops[14].land,geoStops[15].land);});
test('Vehicle unlocks cannot be bypassed through purchases or upgrades',()=>{for(const [type,round]of Object.entries({rail:8,highspeed:20,ferry:10,flight:13,tunnel:18})){const s=atRound(round-1);assert.equal(vehicleUnlocked(s,type),false);assert.equal(upgradeVehicle(s,type),false);assert.equal(buyRoute(s,0,1,type),false);assert.equal(vehicleUnlocked(atRound(round),type),true);}});
test('Roads and rail share Great Britain but cannot cross to Ireland or France',()=>{const s=atRound(25);for(const type of ['road','rail','highspeed']){assert.equal(routeAllowed(type,3,5,s),true);assert.equal(routeAllowed(type,1,8,s),true);assert.equal(routeAllowed(type,0,15,s),false);assert.equal(routeAllowed(type,0,21,s),false);assert.equal(routeAllowed(type,21,26,s),true);}assert.equal(routeAllowed('road',14,15,s),false);});
test('Ferries use harbours and flights use airports after introduction',()=>{const s=atRound(13);assert.ok(s.facilities[13].includes('port'));assert.equal(routeAllowed('ferry',13,15,s),true);assert.equal(routeAllowed('ferry',0,15,s),false);assert.equal(routeAllowed('flight',0,15,s),true);assert.equal(routeAllowed('flight',1,15,s),false);});
test('Channel Tunnel links only Folkestone and Coquelles',()=>{const s=atRound(18);assert.equal(buyRoute(s,23,22,'tunnel'),true);assert.equal(routeAllowed('tunnel',22,23,s),true);assert.equal(routeIssue(s,0,21,'tunnel').code,'tunnel');assert.equal(routeAllowed('rail',23,22,s),false);assert.equal(routeAllowed('flight',23,22,s),false);});
test('Starter local deliveries fund Bristol and complete round 1',()=>{const s=createGameState(2);assert.equal(buyRoute(s,0,1,'road'),true);s.running=true;advanceGame(s,8);assert.equal(s.delivered,3);assert.equal(s.credits,30);assert.equal(buyRoute(s,1,2,'road'),true);advanceGame(s,12);assert.equal(s.complete,true);assert.equal(s.failed,false);assert.equal(s.delivered,5);assert.equal(nextRound(s),false);chooseCard(s,s.cardOffers[0]);chooseCard(s,s.cardOffers[0]);assert.equal(nextRound(s),true);assert.equal(s.links.length,2);assert.ok(s.activeStops.includes(3));});
test('All 60 card effects work and unavailable transport is not offered',()=>{assert.equal(goodCards.length,30);assert.equal(badCards.length,30);for(const c of [...goodCards,...badCards]){const s=atRound(27);s.cardPhase=goodCards.includes(c)?'good':'bad';s.cardOffers=[c.id];assert.equal(chooseCard(s,c.id),true);assert.equal(s.cardHistory[0].id,c.id);}for(let seed=1;seed<20;seed++){const s=createGameState(seed),offered=drawCards(s,'good');assert.ok(!offered.some(id=>['boat-sale','air-sale','harbour-seats','airports','ports'].includes(id)));assert.deepEqual(offered,drawCards(createGameState(seed),'good'));}});
test('High-speed and tunnel fleets inherit rail bonuses and have independent upgrades',()=>{const s=atRound(20);s.mods={railSeats:1,railSpeed:.15};for(const t of ['rail','highspeed','tunnel']){assert.equal(vehicleStats(s,t).capacity,2);const speed=vehicleStats(s,t).speed;assert.equal(upgradeVehicle(s,t),true);assert.equal(vehicleStats(s,t).capacity,3);assert.ok(vehicleStats(s,t).speed>speed);}assert.ok(vehicleStats(s,'highspeed').speed>vehicleStats(s,'rail').speed);});
test('Facilities need the correct round and coastal site',()=>{const s=atRound(9),credits=s.credits;assert.equal(buildFacility(s,2,'port'),false);assert.equal(s.credits,credits);const t=atRound(10);assert.equal(buildFacility(t,0,'port'),false);assert.equal(buildFacility(t,2,'port'),true);assert.equal(buildFacility(t,2,'port'),false);assert.equal(buildFacility(t,0,'airport'),false);assert.equal(buildFacility(atRound(13),1,'airport'),true);});
test('Route failures explain errors and never spend credits',()=>{const s=atRound(10);s.credits=0;assert.equal(routeIssue(s,13,15,'ferry').code,'credits');assert.equal(buyRoute(s,13,15,'ferry'),false);assert.equal(s.credits,0);s.credits=100;assert.equal(buyRoute(s,13,15,'ferry'),true);assert.equal(routeIssue(s,13,15,'ferry').code,'duplicate');assert.equal(routeIssue(s,13,13,'ferry').code,'same');assert.equal(routeIssue(s,13,21,'ferry').code,'inactive');});
test('Waiting passengers trigger alarms and retry rolls spending back',()=>{const s=createGameState(5);s.running=true;advanceGame(s,36);assert.ok(s.pressure>0);advanceGame(s,10);assert.equal(s.failed,true);const credits=s.roundStart.credits;s.credits=999;s.levels.road=4;assert.equal(nextRound(s,true),true);assert.equal(s.credits,credits);assert.equal(s.levels.road,1);assert.equal(s.failed,false);assert.equal(s.round,1);});
test('Terminal upgrades relieve pressure and require credits',()=>{const s=createGameState(2);assert.equal(upgradeTerminal(s,0),true);assert.equal(s.terminals[0],2);assert.equal(upgradeTerminal(s,0),false);s.running=true;advanceGame(s,40);assert.equal(s.danger[0],0);});
test('Selling routes returns riders safely and refunds the full purchase cost',()=>{const s=createGameState(1);buyRoute(s,0,1,'road');s.running=true;advanceGame(s,.6);assert.equal(s.links[0].cargo.length,1);assert.equal(removeRoute(s,0),true);assert.equal(s.credits,20);assert.equal(s.passengers[0].mode,'waiting');assert.equal(s.links.length,0);});
test('Ferry and tunnel passengers reach destinations; cancelled ferries pause cargo',()=>{for(const [round,a,b,type]of [[10,13,15,'ferry'],[18,23,22,'tunnel']]){const s=atRound(round);s.passengers=[{id:0,at:a,destination:b,mode:'waiting',wait:0}];s.target=1;buyRoute(s,a,b,type);s.running=true;if(type==='ferry'){s.ferryClosed=true;advanceGame(s,2);assert.equal(s.delivered,0);s.ferryClosed=false;}advanceGame(s,10);assert.equal(s.delivered,1);assert.equal(s.complete,true);}});
test('Rounds grow stop count and per-stop arrival frequency',()=>{const a=atRound(4),b=atRound(10);assert.ok(b.activeStops.length>a.activeStops.length);assert.ok(arrivalInterval(b)*b.activeStops.length<arrivalInterval(a)*a.activeStops.length);b.running=true;advanceGame(b,arrivalInterval(b)*b.activeStops.length*1.5);assert.equal(new Set(b.passengers.map(p=>p.at)).size,b.activeStops.length);});
test('Discovery facts choose from three and focus new country unlocks',()=>{for(const r of regions){assert.equal(r.facts.length,3);const facts=new Set();for(const seed of [0,256,512]){const f=discoveryForRound(r.round,seed);assert.equal(f.newlyUnlocked,true);assert.ok(regions.find(x=>x.id===f.region).facts.includes(f.text));facts.add(f.text);assert.deepEqual(f,discoveryForRound(r.round,seed));}assert.equal(facts.size,3);}assert.equal(discoveryForRound(4,123).region,'wales');assert.equal(discoveryForRound(6,123).region,'scotland');});
test('Deadline and pause work, and passengers choose the fastest service',()=>{const s=atRound(20);s.passengers=[{id:0,at:0,destination:1,mode:'waiting',wait:0}];s.target=1;buyRoute(s,0,1,'road');buyRoute(s,0,1,'highspeed');assert.deepEqual(findRoute(s,0,1),[0,1]);advanceGame(s,10);assert.equal(s.elapsed,0);s.running=true;advanceGame(s,.5);assert.equal(s.links[0].cargo.length,0);assert.equal(s.links[1].cargo.length,1);const t=createGameState();t.elapsed=roundDuration(t)-.1;t.running=true;advanceGame(t,.2);assert.equal(t.failed,true);assert.match(t.lossReason,/timer/);});
