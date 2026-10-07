import {regionShapes} from './coastal-boundaries.js';
import {regions,project,waterways,rivers,worldId} from './coastal-geography.js';
import {landmarkLayout,landmarkImage} from './coastal-landmarks.js';
import {drawLandmarkArt} from './coastal-landmark-art.js';
import {kgLakes,kgPasses} from './coastal-kyrgyzstan-data.js';
import {t} from './coastal-i18n.js';
const paths=new Map(),pictures=new Map();function picture(place){const src=landmarkImage(place);if(!pictures.has(src)){const image=new Image();image.src=src;pictures.set(src,image);}return pictures.get(src);}
export function geographyBounds(round){const points=regions.filter(r=>r.round<=round).flatMap(r=>regionShapes[r.id].flat()).map(([x,y])=>project(x,y));return {left:Math.min(...points.map(p=>p.x))-80,right:Math.max(...points.map(p=>p.x))+110,top:Math.min(...points.map(p=>p.y))-60,bottom:Math.max(...points.map(p=>p.y))+100};}
function countryPath(id){const key=worldId+':'+id;if(paths.has(key))return paths.get(key);const path=new Path2D();for(const ring of regionShapes[id]){ring.forEach(([lon,lat],i)=>{const p=project(lon,lat);path[i?'lineTo':'moveTo'](p.x,p.y);});path.closePath();}paths.set(key,path);return path;}
function label(c,text,x,y,size,colour){c.font=`600 ${size}px system-ui`;c.textAlign='center';c.fillStyle=colour;c.fillText(t(text),x,y);}
export function drawGeography(c,state,time){const zoom=state.camera.zoom,visible=new Set(regions.filter(r=>r.round<=state.round).map(r=>r.id));
 c.fillStyle=worldId==='kyrgyzstan'?'#e7e3cf':'#add6df';c.fillRect(-2000,-2000,6000,6000);
 for(let i=0;i<80;i++){const x=60+(i*137)%2000,y=50+(i*197)%1750;c.strokeStyle='#ffffff30';c.lineWidth=2;c.beginPath();c.moveTo(x+Math.sin(time+i)*4,y);c.quadraticCurveTo(x+14,y+5,x+28,y);c.stroke();}
 // Locked regions remain under mist, with no country/capital/landmark labels.
 for(const r of regions){const path=countryPath(r.id);if(!visible.has(r.id)){c.fillStyle='#bbd4d9';c.fill(path);c.save();c.clip(path);for(let i=0;i<18;i++){const p=project(r.label[0],r.label[1]);c.fillStyle='#e3eceabb';c.beginPath();c.ellipse(p.x-130+(i*83)%320,p.y-200+(i*117)%470,95,50,.2,0,7);c.fill();}c.restore();continue;}
  c.strokeStyle='#fff0ce';c.lineWidth=8;c.stroke(path);c.fillStyle=r.colour;c.fill(path);c.strokeStyle='#789984';c.lineWidth=1.5;c.stroke(path);
 }
 if(worldId==='kyrgyzstan'){for(const l of kgLakes){if(state.round<(l.name==='Issyk-Kul'?4:l.name==='Song-Kol'?8:10))continue;c.beginPath();l.points.forEach(([x,y],i)=>{const p=project(x,y);c[i?'lineTo':'moveTo'](p.x,p.y);});c.closePath();c.fillStyle='#92cbd8';c.fill();c.strokeStyle='#68a6bd';c.lineWidth=2;c.stroke();}for(const [index,pass] of kgPasses.entries()){if(state.round<[6,8,10,22][index])continue;const a=project(...pass.a),b=project(...pass.b);c.strokeStyle='#b3a082';c.lineWidth=14;c.setLineDash([10,5]);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();c.setLineDash([]);label(c,t('Mountain pass')+' · '+t(pass.name),(a.x+b.x)/2,a.y-12,10,'#776347');}}
 for(const river of rivers){if(!visible.has(river.region))continue;c.strokeStyle='#6aafc6';c.lineWidth=3;c.beginPath();river.points.forEach(([lon,lat],i)=>{const p=project(lon,lat);c[i?'lineTo':'moveTo'](p.x,p.y);});c.stroke();const p=project(...river.points[0]);label(c,'River '+river.name,p.x,p.y-6,12,'#337b94');}
 for(const [name,lon,lat,round]of waterways)if(state.round>=round){const p=project(lon,lat);label(c,name,p.x,p.y,14/zoom,'#397e99');}
 for(const r of regions)if(visible.has(r.id)){const p=project(...r.label);label(c,r.name.toUpperCase(),p.x,p.y,16/zoom,'#4c786b');}
 for(const place of landmarkLayout(state)){c.save();c.strokeStyle='#68765c99';c.lineWidth=1/zoom;c.setLineDash([2/zoom,3/zoom]);c.beginPath();c.moveTo(place.x,place.y);c.lineTo(place.drawX,place.drawY);c.stroke();c.setLineDash([]);c.translate(place.drawX,place.drawY);c.scale(1/zoom,1/zoom);if(worldId==='kyrgyzstan'){const image=picture(place);if(image.complete&&image.naturalWidth){c.fillStyle='#fff8e7';c.fillRect(-place.size-2,-place.size*.72-2,place.size*2+4,place.size*1.44+4);c.drawImage(image,-place.size,-place.size*.72,place.size*2,place.size*1.44);}}else drawLandmarkArt(c,place.kind,0,0,place.size);if(place.label){c.font='600 10px system-ui';const words=t(place.name).split(' '),lines=[''];for(const word of words){const i=lines.length-1;if(c.measureText(lines[i]+' '+word).width>116&&lines[i])lines.push(word);else lines[i]+=(lines[i]?' ':'')+word;}c.textAlign='center';c.strokeStyle='#f9f5de';c.lineWidth=3;for(const [i,line]of lines.slice(0,3).entries()){c.strokeText(t(line),0,place.size+2+i*11);c.fillStyle='#3d665c';c.fillText(t(line),0,place.size+2+i*11);}}c.restore();}
 // A small north arrow gives pupils an orientation anchor on every zoom level.
 c.save();c.setTransform(1,0,0,1,0,0);label(c,'N',970,31,15,'#235d72');c.fillStyle='#235d72';c.beginPath();c.moveTo(970,42);c.lineTo(962,64);c.lineTo(970,59);c.lineTo(978,64);c.fill();c.restore();
}
