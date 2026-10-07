import {geoStops as stops,regions} from './coastal-geography.js';
import {mapLandmarks} from './coastal-landmarks.js';
export function expedition(state){
 state.expedition??={visits:{},knowledge:{},stamps:{},missions:[],missionRound:0};
 const e=state.expedition;
 if(e.missionRound!==state.round){
  e.missionRound=state.round;
  const cities=state.activeStops.map(id=>stops[id]),newest=[...cities].sort((a,b)=>b.round-a.round)[0];
  e.missions=[{id:'city',title:'Welcome to '+newest.name,detail:'Deliver passengers to '+newest.name+' in '+regions.find(r=>r.id===newest.region).name+'.',target:Math.min(2,state.target),progress:0,reward:8,city:newest.id},
   {id:'journey',title:state.round<4?'England explorer':'Across the border',detail:state.round<4?'Complete three journeys between English cities.':'Deliver a passenger whose journey began in another country.',target:state.round<4?3:1,progress:0,reward:10},
   {id:'learn',title:'Geography detective',detail:'Answer a geography coin or round-review question correctly.',target:1,progress:0,reward:5}];
  if(state.world!=='kyrgyzstan'&&state.round>=10&&state.round%3===1)Object.assign(e.missions[1],{title:'Across the Irish Sea',detail:'Deliver a ferry passenger between Great Britain and the island of Ireland.',crossing:'irish-sea'});
  if(state.world!=='kyrgyzstan'&&state.round>=18&&state.round%3===0)Object.assign(e.missions[1],{title:'Under the English Channel',detail:'Deliver a passenger using the Channel Tunnel between England and France.',crossing:'channel'});
 }
 if(state.world==='kyrgyzstan'){e.missions[1].title=state.round<4?'Chuy explorer':'Valley connections';e.missions[1].detail=state.round<4?'Complete three journeys between stops in Chuy Region.':'Deliver a passenger between different regions of Kyrgyzstan.';}
 return e;
}
function progress(state,id){const m=expedition(state).missions.find(m=>m.id===id);if(!m||m.claimed)return;m.progress=Math.min(m.target,m.progress+1);if(m.progress===m.target){m.claimed=true;state.credits+=m.reward;}}
function collect(state){const e=expedition(state);for(const l of mapLandmarks){const visited=Number.isInteger(l.city)?e.visits[l.city]:Object.keys(e.visits).some(id=>stops[id].region===l.region);if(visited&&e.knowledge[l.region]&&!e.stamps[l.id])e.stamps[l.id]={round:state.round};}}
export function recordDelivery(state,p,city){const e=expedition(state);p.origin??=p.at;e.visits[city]??={round:state.round};if(city===e.missions[0].city)progress(state,'city');const crossing=e.missions[1].crossing,seaTrip=p.crossings?.includes('irish-sea'),channelTrip=p.crossings?.includes('channel');if(state.world==='kyrgyzstan'?state.round<4?stops[p.origin].region==='chuy'&&stops[city].region==='chuy':stops[p.origin].region!==stops[city].region:crossing?crossing==='irish-sea'?seaTrip:channelTrip:state.round<4?stops[p.origin].region==='england'&&stops[city].region==='england':stops[p.origin].region!==stops[city].region)progress(state,'journey');collect(state);}
export function recordKnowledge(state,region){expedition(state).knowledge[region]??={round:state.round};progress(state,'learn');collect(state);}
export function reverseAtStop(v){
 if(!v.reversePending||!v.service||v.service.passenger!=null)return false;
 const nodes=v.nodes??[v.a,v.b],at=v.service.at,loop=nodes.length>3&&nodes[0]===nodes.at(-1),count=nodes.length-1;
 let index=nodes.indexOf(at),direction=-v.direction;
 if(!loop&&(index===0||index===count)){v.reversePending=false;return false;}
 v.direction=direction;v.segment=direction===1?index:(index-1+count)%count;
 [v.a,v.b]=nodes.slice(v.segment,v.segment+2);v.position=0;v.reversePending=false;return true;
}
export function departureHeld(line,v,dt){
 if(!line.autoSpacing||v.position!==0)return false;
 const vehicles=[line,...(line.vehicles??[])],count=(line.nodes?.length??2)-1,phase=x=>(x.segment??0)+(x.direction===1?x.position:1-x.position);
 const blocked=vehicles.some(other=>other!==v&&other.direction===v.direction&&other.position>0&&((phase(other)-phase(v))*v.direction+count)%count<Math.min(.5,count/vehicles.length*.65));
 if(!blocked){v.spacingWait=0;return false;}v.spacingWait=(v.spacingWait??0)+dt;return v.spacingWait<8;
}
export function pressureReport(state,lineStops,journey,capacity){return state.links.map((line,index)=>{
 const waiting=state.passengers.filter(p=>p.mode==='waiting'),demand=waiting.filter(p=>journey(state,p)?.legs.some(l=>l.line===index)),vehicles=1+(line.vehicles?.length??0),seats=vehicles*capacity(state,line.type).capacity;
 return {index,waiting:demand.length,seats,level:demand.length>seats*2?'high':demand.length>seats?'medium':'low',transfers:[...new Set(demand.flatMap(p=>journey(state,p)?.transfers??[]))],unconnected:waiting.filter(p=>lineStops(line).includes(p.at)&&!journey(state,p)).length};
});}
export function encodeSave(state){return JSON.stringify({schema:1,savedAt:new Date().toISOString(),state});}
export function decodeSave(raw){const value=JSON.parse(raw),s=value.state;if(value.schema!==1||!s||!Number.isInteger(s.round)||s.round<1||!Array.isArray(s.links)||!Array.isArray(s.passengers)||!Array.isArray(s.activeStops)||s.activeStops.some(id=>!stops[id])||!s.camera||!s.levels||!s.terminals||!s.facilities||!s.mods||!s.danger||!Array.isArray(s.cardHistory)||!Array.isArray(s.cardOffers)||!Number.isFinite(s.credits)||!Number.isFinite(s.elapsed)||!Number.isFinite(s.camera.zoom)||s.camera.zoom<=0)throw Error('This save is damaged or uses an unsupported format.');for(const [i,p]of s.passengers.entries())if(p.id!==i||!stops[p.at]||!stops[p.destination]||!['waiting','boarding','riding','delivered'].includes(p.mode))throw Error('This save contains an invalid passenger.');for(const l of s.links){if((l.nodes??[l.a,l.b]).some(id=>!stops[id])||!Object.hasOwn(s.levels,l.type)||!Array.isArray(l.cargo)||l.vehicles&&!Array.isArray(l.vehicles))throw Error('This save contains an invalid route.');for(const v of [l,...(l.vehicles??[])])if(!Array.isArray(v.cargo)||v.cargo.some(id=>!s.passengers[id])||!Number.isFinite(v.position)||![1,-1].includes(v.direction)||v.service?.passenger!=null&&!s.passengers[v.service.passenger])throw Error('This save contains an invalid vehicle.');}s.running=false;return s;}
