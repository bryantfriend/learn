import {regionShapes} from './coastal-boundaries.js';
import {project} from './coastal-geography.js';
const polygons=Object.values(regionShapes).flat().map(ring=>ring.map(([lon,lat])=>project(lon,lat)));
const cross=(a,b)=>a.x*b.y-a.y*b.x;
// A shared station is a junction; overlapping road interiors are conflicts.
export function roadSegmentsConflict(a,b,c,d){
 const r={x:b.x-a.x,y:b.y-a.y},s={x:d.x-c.x,y:d.y-c.y},q={x:c.x-a.x,y:c.y-a.y},den=cross(r,s),epsilon=1e-7;
 if(Math.abs(den)>epsilon){const t=cross(q,s)/den,u=cross(q,r)/den;if(t<-epsilon||t>1+epsilon||u<-epsilon||u>1+epsilon)return false;return !((t<epsilon||t>1-epsilon)&&(u<epsilon||u>1-epsilon));}
 if(Math.abs(cross(q,r))>epsilon)return false;
 const length=r.x*r.x+r.y*r.y;if(length<epsilon)return false;
 const t=(q.x*r.x+q.y*r.y)/length,v=t+(s.x*r.x+s.y*r.y)/length;
 return Math.min(1,Math.max(t,v))-Math.max(0,Math.min(t,v))>epsilon;
}
function inside(p,ring){let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)yes=!yes;}return yes;}
const cache=new Map();
export function landRouteClear(a,b){const key=[a.x+','+a.y,b.x+','+b.y].sort().join('|');if(!cache.has(key))cache.set(key,checkLandRoute(a,b));return cache.get(key);}
function checkLandRoute(a,b){
 const d={x:b.x-a.x,y:b.y-a.y},cuts=[0,1];
 for(const ring of polygons)for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length],edge={x:q.x-p.x,y:q.y-p.y},offset={x:p.x-a.x,y:p.y-a.y},den=cross(d,edge);if(Math.abs(den)<1e-9)continue;const t=cross(offset,edge)/den,u=cross(offset,d)/den;if(t>0&&t<1&&u>=0&&u<=1)cuts.push(t);}
 cuts.sort((a,b)=>a-b);
 for(let i=1;i<cuts.length;i++){if(cuts[i]-cuts[i-1]<1e-7)continue;const t=(cuts[i]+cuts[i-1])/2,p={x:a.x+d.x*t,y:a.y+d.y*t};if(!polygons.some(ring=>inside(p,ring))){
   // Coastal city centres can fall just outside a simplified polygon. Only
   // tolerate the shoreline hidden beneath the 14-unit endpoint marker.
   const length=Math.hypot(d.x,d.y);if(cuts[i]*length<=14||(1-cuts[i-1])*length<=14)continue;
   return false;
  }}
 return true;
}
