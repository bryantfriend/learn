import test from 'node:test';
import assert from 'node:assert/strict';
import {createGameState,offscreenStationWarnings,stops} from '../src/coastal-connections.js';
const fixture=(dx,dy)=>{const s=createGameState(1);s.activeStops=[0];s.camera={zoom:2,x:500-stops[0].x*2+dx,y:300-stops[0].y*2+dy};s.passengers=Array.from({length:4},(_,id)=>({id,at:0,mode:'waiting',wait:0}));return s;};
test('Offscreen warnings point in all four directions and disappear in view or when cleared',()=>{
 for(const [dx,dy,edge]of [[-700,0,'left'],[700,0,'right'],[0,-400,'top'],[0,400,'bottom']]){const s=fixture(dx,dy),[w]=offscreenStationWarnings(s);assert.equal(w.edge,edge);assert.equal(w.id,0);assert.equal(w.urgent,false);assert.equal(w.queue,4);assert.ok(w.x>=85&&w.x<=915);assert.ok(w.y>=120&&w.y<=480);s.camera.x-=dx;s.camera.y-=dy;assert.deepEqual(offscreenStationWarnings(s),[]);s.camera.x+=dx;s.passengers=[];assert.deepEqual(offscreenStationWarnings(s),[]);}
});
test('Warnings respect upgraded capacity, passenger age, alarms and ferry closures',()=>{
 const s=fixture(700,0);s.terminals[0]=4;assert.deepEqual(offscreenStationWarnings(s),[]);s.passengers[0].wait=60;assert.equal(offscreenStationWarnings(s)[0].urgent,false);s.passengers[0].wait=65;s.danger[0]=7;assert.equal(offscreenStationWarnings(s)[0].remaining,3);assert.equal(offscreenStationWarnings(s)[0].urgent,true);
 s.passengers.forEach(p=>{p.mode='riding';p.wait=0;});s.danger={};s.ferryClosed=true;s.links=[{type:'ferry',cargo:[0,1,2,3]}];s.terminals[0]=1;assert.equal(offscreenStationWarnings(s)[0].queue,4);s.ferryClosed=false;assert.deepEqual(offscreenStationWarnings(s),[]);
 s.complete=true;assert.deepEqual(offscreenStationWarnings(s),[]);
});
test('Cities on the same edge group together with the most urgent first',()=>{
 const s=fixture(1000,0);s.activeStops=[0,1];s.passengers.push(...Array.from({length:5},(_,i)=>({id:i+4,at:1,mode:'boarding',wait:0})));s.danger[1]=8;const warnings=offscreenStationWarnings(s);assert.equal(warnings.length,1);assert.equal(warnings[0].id,1);assert.deepEqual(warnings[0].ids,[1,0]);assert.equal(warnings[0].remaining,2);
});
