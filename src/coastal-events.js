import {geoStops} from './coastal-geography.js';
// Fictional disruptions for Hard mode; facts describe the real locations.
export function planEvent(state){
 if(state.mode!=='hard'||state.round<3)return null;
 if(state.world==='kyrgyzstan'){const deck=[{id:'mountain-snow',title:'Mountain pass snow',type:'road',fact:'Mountain passes connect Kyrgyzstan’s valleys.',advice:'Marshrutkas slow down for 24 seconds. Mountain 4×4s and tunnel shuttles keep moving.'},{id:'valley-market',title:'Bishkek market crowds',city:0,fact:'Bishkek is the capital of Kyrgyzstan.',advice:'More passengers start in Bishkek for 24 seconds.'}];if(state.round>=13)deck.push({id:'mountain-wind',title:'Mountain wind warning',type:'flight',fact:'The Tien Shan shapes Kyrgyzstan’s weather.',advice:'Domestic flights slow down for 24 seconds.'});return {...deck[(state.round-3)%deck.length],warningAt:18,start:30,end:54};}
 const deck=[{id:'river-flood',title:'River Thames flood warning',type:'road',region:'england',fact:'The River Thames flows through London.',advice:'English buses will run at 65% speed for 24 seconds. Plan spare capacity.'}];
 if(state.activeStops.includes(8))deck.push({id:'festival',title:'Edinburgh festival crowds',city:8,fact:'Edinburgh is the capital of Scotland.',advice:'More of this round’s passengers will start in Edinburgh for 24 seconds.'});
 if(state.round>=10)deck.push({id:'sea-fog',title:'Irish Sea fog warning',type:'ferry',fact:'The Irish Sea lies between Great Britain and Ireland.',advice:'Ferries will run at 50% speed for 24 seconds. Consider alternate connections.'});
 const event=deck[(state.round-3)%deck.length];return {...event,warningAt:18,start:30,end:54};
}
export const eventActive=state=>state.mode==='hard'&&state.event&&state.elapsed>=state.event.start&&state.elapsed<state.event.end;

export function eventSpeed(state,type,a,b){if(!eventActive(state)||state.event.type!==type)return 1;if(state.event.id==='mountain-snow'||state.event.id==='mountain-wind')return .65;if(state.event.id==='sea-fog')return .5;if(state.event.id==='river-flood'&&[a,b].some(id=>geoStops[id]?.region==='england'))return .65;return 1;}
