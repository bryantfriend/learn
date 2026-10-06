import {geoStops} from './coastal-geography.js';
// Fictional disruptions for Hard mode; facts describe the real locations.
export function planEvent(state){
 if(state.mode!=='hard'||state.round<3)return null;
 const deck=[{id:'river-flood',title:'River Thames flood warning',type:'road',region:'england',fact:'The River Thames flows through London.',advice:'English buses will run at 65% speed for 24 seconds. Plan spare capacity.'}];
 if(state.activeStops.includes(8))deck.push({id:'festival',title:'Edinburgh festival crowds',city:8,fact:'Edinburgh is the capital of Scotland.',advice:'More of this round’s passengers will start in Edinburgh for 24 seconds.'});
 if(state.round>=10)deck.push({id:'sea-fog',title:'Irish Sea fog warning',type:'ferry',fact:'The Irish Sea lies between Great Britain and Ireland.',advice:'Ferries will run at 50% speed for 24 seconds. Consider alternate connections.'});
 const event=deck[(state.round-3)%deck.length];return {...event,warningAt:18,start:30,end:54};
}
export const eventActive=state=>state.mode==='hard'&&state.event&&state.elapsed>=state.event.start&&state.elapsed<state.event.end;

export function eventSpeed(state,type,a,b){if(!eventActive(state)||state.event.type!==type)return 1;if(state.event.id==='sea-fog')return .5;if(state.event.id==='river-flood'&&[a,b].some(id=>geoStops[id]?.region==='england'))return .65;return 1;}
