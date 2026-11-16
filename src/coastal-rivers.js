import {project,rivers,worldId} from './coastal-geography.js';
import {t,registerTranslations} from './coastal-i18n.js';

for(const [en,ru,ky]of [
 ['Thames','Темза','Темза'],['Severn','Северн','Северн'],['Trent','Трент','Трент'],
 ['Wye','Уай','Уай'],['Clyde','Клайд','Клайд'],['Tay','Тей','Тей'],
 ['Shannon','Шаннон','Шаннон'],['Liffey','Лиффи','Лиффи'],['Seine','Сена','Сена'],
 ['Loire','Луара','Луара'],['Garonne','Гаронна','Гаронна'],['Rhine','Рейн','Рейн'],
 ['Elbe','Эльба','Эльба'],['Chuy','Чу','Чүй'],['Naryn','Нарын','Нарын'],
 ['Talas','Талас','Талас'],['Ak-Buura','Ак-Буура','Ак-Буура']
])registerTranslations('River '+en,'Река '+ru,ky+' дарыясы');

const cache=new Map();
function geometry(river){
 const key=worldId+':'+river.name;
 if(cache.has(key))return cache.get(key);
 const paths=(river.paths??[river.points]).map(points=>{
  const p=points.map(([lon,lat])=>project(lon,lat)),segments=[];
  // Midpoint quadratic joins preserve the geographic bends without sharp elbows.
  let start=p[0];
  for(let i=1;i<p.length;i++){
   const end=i===p.length-1?p[i]:{x:(p[i].x+p[i+1].x)/2,y:(p[i].y+p[i+1].y)/2};
   const path=new Path2D();path.moveTo(start.x,start.y);
   path.quadraticCurveTo(p[i].x,p[i].y,end.x,end.y);
   segments.push({path,fraction:i/(p.length-1)});start=end;
  }
  return segments;
 });
 cache.set(key,paths);return paths;
}

export function drawRivers(c,state,land,visible){
 const zoom=state.camera.zoom;
 c.save();c.clip(land);c.lineCap='round';c.lineJoin='round';
 for(const river of rivers){
  // Country clipping reveals cross-border rivers only as their regions unlock.
  const paths=geometry(river),width=river.width??2.6;
  for(const [colour,extra]of [['#689b9270',1.8],['#4d95b0',0],['#b4e1e8',-.9]]){
   c.strokeStyle=colour;
   for(const segments of paths)for(const {path,fraction}of segments){
    const size=width*(.4+.6*fraction)+extra;
    c.lineWidth=Math.max(.35,size)/Math.pow(Math.max(.65,zoom),.45);c.stroke(path);
   }
  }
 }
 c.restore();
 for(const river of rivers){
  if(!visible.has(river.region))continue;
  const p=project(...(river.label??river.points[Math.floor(river.points.length/2)]));
  c.save();c.font=`italic 600 ${11/zoom}px system-ui`;c.textAlign='center';
  c.strokeStyle='#f4f4dbcc';c.lineWidth=3/zoom;c.lineJoin='round';
  const name=t('River '+river.name);c.strokeText(name,p.x,p.y-8/zoom);
  c.fillStyle='#357d95';c.fillText(name,p.x,p.y-8/zoom);c.restore();
 }
}
