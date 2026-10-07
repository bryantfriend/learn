import {geoStops,regions,landmarks,waterways,rivers,unlockRounds,vehicleLabels,setWorldProjection,worldId} from './coastal-geography.js';
import {regionShapes} from './coastal-boundaries.js';
import {kgBoundaries} from './coastal-kyrgyzstan-boundaries.js';
import {kgCities,kgRegions,kgLandmarks,kgLakes,kgPasses,kgShorePaths} from './coastal-kyrgyzstan-data.js';
import {stationShape} from './coastal-shapes.js';
import {stationArt} from './coastal-station-art.js';
import {mapLandmarks,resetLandmarkAnchors} from './coastal-landmarks.js';
import {countryLearning} from './coastal-learning.js';
import {goodCards,badCards} from './coastal-cards.js';
import {setLanguage,t,registerTranslations} from './coastal-i18n.js';
import './coastal-i18n-content.js';
import './coastal-i18n-geography.js';
import {registerQuestionTranslations} from './coastal-question-translations.js';
const arrays={geoStops,regions,landmarks,waterways,rivers,stationArt,mapLandmarks};
const objects={regionShapes,unlockRounds,vehicleLabels,countryLearning};
const uk=Object.fromEntries([...Object.entries(arrays),...Object.entries(objects)].map(([k,v])=>[k,structuredClone(v)]));
const ukCards=structuredClone([...goodCards,...badCards]);
const wiki=title=>'https://en.wikipedia.org/wiki/'+encodeURIComponent(title.replaceAll(' ','_'));
export const kgAsset=id=>new URL('../assets/coastal/kyrgyzstan/'+id+'.jpg',import.meta.url).href;
const regionSource={chuy:'Chuy_Region','issyk-kul':'Issyk-Kul_Region',talas:'Talas_Region',naryn:'Naryn_Region','jalal-abad':'Jalal-Abad_Region',osh:'Osh_Region',batken:'Batken_Region'};
for(const c of kgCities){registerTranslations(c[0],c[1],c[2]);registerTranslations(c[7],c[8],c[9]);}
for(const r of kgRegions){registerTranslations(r[1],r[2],r[3]);registerTranslations(r[8],r[9],r[10]);}
for(const l of kgLandmarks)registerTranslations(l[1],l[2],l[3]);
export function activateWorld(world='uk',language='en'){
 if(!['uk','kyrgyzstan'].includes(world))world='uk';setLanguage(language);setWorldProjection(world);
 for(const [key,target]of Object.entries(arrays))target.splice(0,target.length,...structuredClone(uk[key]));
 for(const [key,target]of Object.entries(objects)){for(const k of Object.keys(target))delete target[k];Object.assign(target,structuredClone(uk[key]));}
 [...goodCards,...badCards].forEach((c,i)=>Object.assign(c,structuredClone(ukCards[i])));
 if(world==='kyrgyzstan'){
  const projection=(lon,lat)=>({x:(lon-69)*105,y:(43.3-lat)*155});
  regions.splice(0,regions.length,...kgRegions.map((r,i)=>({id:r[0],name:r[1],round:r[4],capital:r[5],label:[r[6],r[7]],colour:['#b9d8a0','#b5d1b9','#ded3a3','#c9d5b3','#acd4bc','#ddd0a4','#c8d8a5'][i],source:wiki(regionSource[r[0]]),facts:[r[8],'Bishkek is the capital of Kyrgyzstan.','Kyrgyzstan is a landlocked country in Central Asia.']})));
  geoStops.splice(0,geoStops.length,...kgCities.map((c,id)=>({id,name:c[0],...projection(c[3],c[4]),lon:c[3],lat:c[4],region:c[5],round:c[6],kind:'town',capital:kgRegions.some(r=>r[5]===c[0]),nationalCapital:id===0,tunnel:true,coastal:false,land:'kyrgyzstan',shape:stationShape(id,c[6],id===kgCities.findIndex(x=>x[6]===c[6]))})));
  stationArt.splice(0,stationArt.length,...kgCities.map((c,id)=>({id,city:c[0],slug:'city-'+id,landmark:c[7],image:kgAsset('city-'+id)})));
  landmarks.splice(0,landmarks.length,...kgLandmarks.map(l=>[l[1],l[4],l[5],l[6],l[7]]));
  mapLandmarks.splice(0,mapLandmarks.length,...kgCities.map((c,id)=>({id:'kg-city-'+id,name:c[7],...projection(c[3],c[4]),region:c[5],city:id,kind:['clock','tower','gate','mountain','mountain','lake','stones','castle'][id%8],natural:[3,4,5,10,11,13,15,22,25,26,27,28,29,30,31,32,33,34].includes(id),description:c[7]+' · '+c[0]+'. '+kgRegions.find(r=>r[0]===c[5])[8],source:wiki(c[0]),image:kgAsset('city-'+id)})),...kgLandmarks.map(l=>({id:'kg-'+l[0],name:l[1],...projection(l[4],l[5]),region:l[6],kind:l[7],natural:!['castle','gate'].includes(l[7]),description:kgRegions.find(r=>r[0]===l[6])[8],source:wiki(l[1].replace(' lake','').replace(' mountains','')),image:kgAsset(l[0])})));
  Object.assign(regionShapes,kgBoundaries);for(const id of Object.keys(regionShapes))if(!kgBoundaries[id])delete regionShapes[id];
  waterways.splice(0,waterways.length,['Issyk-Kul',77.15,42.43,4],['Song-Kol',75.20,41.86,8],['Toktogul Reservoir',73.0,41.77,10]);
  rivers.splice(0,rivers.length,{name:'Chuy',region:'chuy',points:[[75.8,42.8],[75.3,42.87],[74.6,43.0],[73.8,43.05]]},{name:'Naryn',region:'naryn',points:[[76.5,41.5],[75.99,41.43],[74.8,41.45],[74.0,41.4],[73.0,41.8],[72.25,41.35]]},{name:'Talas',region:'talas',points:[[72.5,42.5],[72.24,42.52],[71.5,42.8]]},{name:'Ak-Buura',region:'osh',points:[[72.95,40.2],[72.8,40.53],[72.75,40.7]]});
  Object.assign(unlockRounds,{road:1,rail:8,ferry:6,flight:13,tunnel:10,highspeed:20});Object.assign(vehicleLabels,{road:'Marshrutka',rail:'Northern train',ferry:'Mountain 4×4',flight:'Domestic plane',tunnel:'Tunnel shuttle',highspeed:'Express coach'});
  for(const key of Object.keys(countryLearning))delete countryLearning[key];
  for(const r of kgRegions){const places=mapLandmarks.filter(l=>l.region===r[0]);countryLearning[r[0]]={setting:r[8],water:kgCities.filter(c=>c[5]===r[0]).map(c=>c[10]).filter((v,i,a)=>a.indexOf(v)===i).join(', '),source:wiki(regionSource[r[0]]),landmarks:places.slice(0,3).map(l=>[l.name,r[1],l.description,'🏔']),extra:[r[8]],question:['Which landscape shapes transport in Kyrgyzstan?','Mountains','Sea coast','Coral reefs']};}
  const replacements={'Shipyard deal':['Off-road workshop','Mountain 4×4 routes cost 15% less.'],'Following wind':['All-terrain tyres','Mountain 4×4 vehicles move 15% faster.'],'Ferry benches':['Off-road seats','Every mountain 4×4 gains one seat.'],'Hull shortage':['Tyre shortage','Mountain 4×4 routes cost 15% more.'],'Headwind':['Rough tracks','Mountain 4×4 vehicles move 10% slower.'],'Busy ports':['Busy mountain stops','Mountain 4×4 vehicles move 5% slower; arrivals become 5% faster.']};
  for(const c of [...goodCards,...badCards])if(replacements[c.name])[c.name,c.description]=replacements[c.name];
 }
 registerQuestionTranslations(world,language);resetLandmarkAnchors();return world;
}
function inside(p,ring){let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
export function kgWaterClear(a,b){if(kgShorePaths[[a.id,b.id].sort((a,b)=>a-b).join(',')])return true;for(let i=1;i<50;i++){const f=i/50,p=[a.lon+(b.lon-a.lon)*f,a.lat+(b.lat-a.lat)*f];if(kgLakes.some(l=>inside(p,l.points)))return false;}return true;}
export function kgMountainCrossings(a,b){return kgPasses.filter(pass=>{const [[x1,y1],[x2,y2]]=[pass.a,pass.b],y=y1;if((a.lat-y)*(b.lat-y)>=0)return false;const x=a.lon+(b.lon-a.lon)*(y-a.lat)/(b.lat-a.lat);return x>=Math.min(x1,x2)&&x<=Math.max(x1,x2);});}
export function kgRouteAllowed(type,a,b,state){if(!a||!b||a===b)return false;if(type==='flight')return state.facilities[a.id]?.includes('airport')&&state.facilities[b.id]?.includes('airport');if(!kgWaterClear(a,b))return false;const passes=kgMountainCrossings(a,b),north=new Set([0,1,2,3,4,5,33]);if(type==='rail')return north.has(a.id)&&north.has(b.id)&&passes.length===0;if(type==='tunnel')return passes.length>0;if(type==='ferry')return true;return passes.length===0||[24,25].includes(a.id)||[24,25].includes(b.id);}
export function kgTerrainSpeed(state,type,a,b){if(state.world!=='kyrgyzstan')return 1;if(type==='ferry'||type==='tunnel'||type==='flight')return 1;return geoStops[a].region===geoStops[b].region?1:.72;}
export function worldLabel(state,text){if(state.world!=='kyrgyzstan')return t(text);if(text.startsWith('★ Capital ·'))return t('Regional centres · Marshrutkas: roads · Mountain 4×4s: passes · Trains: northern corridor · Planes: airports · Tunnels: mountains · North ↑');return t(text.replaceAll('🇬🇧','🇰🇬').replaceAll('London','Bishkek').replaceAll('Oxford','Tokmok').replaceAll('Bristol','Kant').replaceAll('countries','regions').replaceAll('Country atlas','Regional atlas').replaceAll('★ Capital','★ Regional centre').replace(/\bBus\b/g,'Marshrutka').replace(/\bbus\b/g,'marshrutka').replace(/\bBuses\b/g,'Marshrutkas').replace(/\bbuses\b/g,'marshrutkas').replaceAll('Capital ·','Regional centre ·').replaceAll('Ferry challenge','Mountain challenge').replaceAll('Ferries paused','Mountain 4×4 paused').replaceAll('Reopen ferry','Reopen mountain route').replaceAll('The ferry is cancelled!','The mountain route is closed!').replaceAll('The ferry is open again.','The mountain route is open again.').replaceAll('boat between harbours','4×4 over mountain passes').replaceAll('Bus / trains: land · Boat: sea · Flight: air · Tunnel: Channel','Marshrutka: roads · 4×4: passes · Train: northern corridor · Plane: airports · Tunnel: mountains'));}
