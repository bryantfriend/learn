import {regionShapes} from './coastal-boundaries.js';
import {regions,project,waterways,rivers,landmarks} from './coastal-geography.js';
const paths=new Map();
export function geographyBounds(round){const points=regions.filter(r=>r.round<=round).flatMap(r=>regionShapes[r.id].flat()).map(([x,y])=>project(x,y));return {left:Math.min(...points.map(p=>p.x))-80,right:Math.max(...points.map(p=>p.x))+110,top:Math.min(...points.map(p=>p.y))-60,bottom:Math.max(...points.map(p=>p.y))+100};}
function countryPath(id){if(paths.has(id))return paths.get(id);const path=new Path2D();for(const ring of regionShapes[id]){ring.forEach(([lon,lat],i)=>{const p=project(lon,lat);path[i?'lineTo':'moveTo'](p.x,p.y);});path.closePath();}paths.set(id,path);return path;}
function label(c,text,x,y,size,colour){c.font=`600 ${size}px system-ui`;c.textAlign='center';c.fillStyle=colour;c.fillText(text,x,y);}
function landmark(c,kind,x,y){c.save();c.translate(x,y);c.lineWidth=3;c.strokeStyle='#56796f';c.fillStyle='#e8c380';
 if(kind==='tower'){c.beginPath();c.moveTo(0,-30);c.lineTo(-16,24);c.lineTo(-10,24);c.quadraticCurveTo(0,0,10,24);c.lineTo(16,24);c.closePath();c.fill();c.stroke();for(const yy of [-10,3,14]){c.beginPath();c.moveTo(-9,yy);c.lineTo(9,yy);c.stroke();}}
 else if(kind==='clock'){c.fillRect(-8,-24,16,46);c.fillStyle='#9c886e';c.beginPath();c.moveTo(-12,-24);c.lineTo(0,-39);c.lineTo(12,-24);c.fill();c.fillStyle='#fff8de';c.beginPath();c.arc(0,-15,6,0,7);c.fill();c.beginPath();c.moveTo(0,-19);c.lineTo(0,-15);c.lineTo(3,-13);c.stroke();}
 else if(kind==='castle'||kind==='gate'){c.fillRect(-22,-8,44,29);for(const xx of [-22,8]){c.fillRect(xx,-22,14,43);for(let i=0;i<3;i++)c.fillRect(xx+i*5,-28,4,8);}c.fillStyle='#5c7a76';c.beginPath();c.arc(0,10,7,Math.PI,0);c.lineTo(7,21);c.lineTo(-7,21);c.fill();}
 else if(kind==='mountain'){c.beginPath();c.moveTo(-24,20);c.lineTo(0,-28);c.lineTo(25,20);c.closePath();c.fillStyle='#849c8a';c.fill();c.beginPath();c.moveTo(-8,-12);c.lineTo(0,-28);c.lineTo(8,-12);c.lineTo(1,-16);c.closePath();c.fillStyle='#fff8ec';c.fill();}
 else if(kind==='windmill'){c.fillRect(-8,-2,16,26);c.strokeStyle='#9c8060';for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*25,Math.sin(a)*25);c.stroke();}c.fillStyle='#b78c5c';c.beginPath();c.moveTo(-12,-2);c.lineTo(0,-17);c.lineTo(12,-2);c.fill();}
 else if(kind==='atoms'){for(const [xx,yy]of [[0,0],[-19,-17],[19,-17],[-19,17],[19,17]]){c.beginPath();c.moveTo(0,0);c.lineTo(xx,yy);c.stroke();c.fillStyle='#b8c5c6';c.beginPath();c.arc(xx,yy,6,0,7);c.fill();}}
 else if(kind==='lake'){c.fillStyle='#6bafc0';c.beginPath();c.ellipse(0,0,23,13,-.3,0,7);c.fill();c.strokeStyle='#dfefe7';c.beginPath();c.moveTo(-15,0);c.quadraticCurveTo(0,7,15,0);c.stroke();}
 else if(kind==='stones'){for(const xx of [-18,0,18]){c.fillStyle='#949b8e';c.fillRect(xx-5,-18,10,36);}c.fillRect(-24,-24,47,9);}
 else if(kind==='cliffs'){c.fillStyle='#fbf5df';c.beginPath();c.moveTo(-28,-15);c.lineTo(25,-20);c.lineTo(19,25);c.lineTo(-28,15);c.fill();c.stroke();c.fillStyle='#99bf91';c.fillRect(-28,-20,52,7);}
 c.restore();}
export function drawGeography(c,state,time){const zoom=state.camera.zoom,visible=new Set(regions.filter(r=>r.round<=state.round).map(r=>r.id));
 c.fillStyle='#add6df';c.fillRect(-2000,-2000,6000,6000);
 for(let i=0;i<80;i++){const x=60+(i*137)%2000,y=50+(i*197)%1750;c.strokeStyle='#ffffff30';c.lineWidth=2;c.beginPath();c.moveTo(x+Math.sin(time+i)*4,y);c.quadraticCurveTo(x+14,y+5,x+28,y);c.stroke();}
 // Locked regions remain under mist, with no country/capital/landmark labels.
 for(const r of regions){const path=countryPath(r.id);if(!visible.has(r.id)){c.fillStyle='#bbd4d9';c.fill(path);c.save();c.clip(path);for(let i=0;i<18;i++){const p=project(r.label[0],r.label[1]);c.fillStyle='#e3eceabb';c.beginPath();c.ellipse(p.x-130+(i*83)%320,p.y-200+(i*117)%470,95,50,.2,0,7);c.fill();}c.restore();continue;}
  c.strokeStyle='#fff0ce';c.lineWidth=8;c.stroke(path);c.fillStyle=r.colour;c.fill(path);c.strokeStyle='#789984';c.lineWidth=1.5;c.stroke(path);
 }
 for(const river of rivers){if(!visible.has(river.region))continue;c.strokeStyle='#6aafc6';c.lineWidth=3;c.beginPath();river.points.forEach(([lon,lat],i)=>{const p=project(lon,lat);c[i?'lineTo':'moveTo'](p.x,p.y);});c.stroke();const p=project(...river.points[0]);label(c,'River '+river.name,p.x,p.y-6,12,'#337b94');}
 for(const [name,lon,lat,round]of waterways)if(state.round>=round){const p=project(lon,lat);label(c,name,p.x,p.y,14/zoom,'#397e99');}
 for(const r of regions)if(visible.has(r.id)){const p=project(...r.label);label(c,r.name.toUpperCase(),p.x,p.y,16/zoom,'#4c786b');}
 for(const [name,lon,lat,region,kind]of landmarks)if(visible.has(region)){const p=project(lon,lat),x=p.x+42,y=p.y-57;c.save();c.globalAlpha=.9;c.strokeStyle='#617c6744';c.lineWidth=1;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(x,y+20);c.stroke();c.save();c.translate(x,y);c.scale(1/Math.sqrt(zoom),1/Math.sqrt(zoom));landmark(c,kind,0,0);c.restore();if(zoom>=.55)label(c,name,x,y-43/Math.sqrt(zoom),11/zoom,'#5b7464');c.restore();}
 // A small north arrow gives pupils an orientation anchor on every zoom level.
 c.save();c.setTransform(1,0,0,1,0,0);label(c,'N',970,31,15,'#235d72');c.fillStyle='#235d72';c.beginPath();c.moveTo(970,42);c.lineTo(962,64);c.lineTo(970,59);c.lineTo(978,64);c.fill();c.restore();
}
