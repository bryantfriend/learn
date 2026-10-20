import {atlasPaths} from './atlas-paths.js';
const ns='http://www.w3.org/2000/svg';
const point=(lon,lat)=>[(lon+180)*2.5,(90-lat)*2.5];
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};

// Local Natural Earth outlines use the same equirectangular projection as build-atlas.mjs.
// The camera stays in SVG coordinates, independent of screen size and enlargement.
export function createPaddingtonMap(spec={},onChange=()=>{}){
 const root=node('figure');root.className='geography-evidence paddington-map';
 const controls=node('div');controls.className='atlas-controls';
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('role','group');svg.setAttribute('aria-label','World map. Drag to move. Use plus and minus to zoom or arrow keys to move.');svg.setAttribute('tabindex','0');
 svg.style.cssText='width:100%;height:100%;min-height:220px;touch-action:none;cursor:grab;background:#e3f1f7;display:block';
 const canvas=node('div');canvas.className='paddington-map-canvas';canvas.style.cssText='flex:1;min-height:220px;overflow:hidden;border-radius:12px';canvas.append(svg);
 const status=node('figcaption');status.setAttribute('aria-live','polite');
 let zoom=Math.max(1,Math.min(16,spec.zoom||1)),cx=spec.cx??450,cy=spec.cy??225,labels=spec.labels!==false;
 const make=(tag,attrs,text)=>{const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text)n.textContent=text;svg.append(n);return n;};
 make('rect',{x:0,y:0,width:900,height:450,fill:'#e3f1f7'});
 for(const country of atlasPaths){const path=make('path',{d:country.world,fill:'#d4dfc4',stroke:'#69827a','stroke-width':.7,'vector-effect':'non-scaling-stroke'});const title=document.createElementNS(ns,'title');title.textContent=country.name;path.append(title);}
 make('path',{d:'M0 225H900',stroke:'#7c9dad','stroke-dasharray':'5 5','vector-effect':'non-scaling-stroke',fill:'none'});
 make('path',{d:'M450 0V450',stroke:'#7c9dad','stroke-dasharray':'5 5','vector-effect':'non-scaling-stroke',fill:'none'});
 const textLabels=[];
 for(const [name,lon,lat,minZoom]of [['South America',-58,-25,1],['North America',-105,40,1],['Europe',25,53,1],['Africa',22,5,1],['Asia',95,40,1],['Oceania',140,-25,1],['Pacific Ocean',-130,-10,1],['Atlantic Ocean',-32,15,1],['Peru',-75,-10,2],['United Kingdom',-3,58,2],['London',-.1276,51.5072,5],['Equator',110,0,1]]){
  const [x,y]=point(lon,lat);const text=make('text',{x,y,fill:'#153f39','font-family':'system-ui,sans-serif','text-anchor':'middle','paint-order':'stroke',stroke:'#f6faf5','stroke-linejoin':'round'},name);textLabels.push({text,minZoom,name});
 }
 const [lx,ly]=point(-.1276,51.5072);const london=make('circle',{cx:lx,cy:ly,fill:'#a33b28',stroke:'#fff','vector-effect':'non-scaling-stroke','stroke-width':1});
 const update=()=>{
  const w=900/zoom,h=450/zoom;cx=Math.max(w/2,Math.min(900-w/2,cx));cy=Math.max(h/2,Math.min(450-h/2,cy));
  svg.setAttribute('viewBox',`${cx-w/2} ${cy-h/2} ${w} ${h}`);
  for(const item of textLabels){item.text.style.display=labels&&zoom>=item.minZoom?'':'none';item.text.setAttribute('font-size',14/zoom);item.text.setAttribute('stroke-width',3/zoom);if(item.name==='London'){item.text.setAttribute('y',ly-8/zoom);}}
  london.setAttribute('r',3/zoom);london.style.display=labels&&zoom>=5?'':'none';
  status.textContent=`Zoom ${zoom.toFixed(1)}× · Names: countries 2×, London 5×. Natural Earth · simplified outlines.`;
  labelButton.setAttribute('aria-pressed',String(labels));minus.disabled=zoom<=1;plus.disabled=zoom>=16;
  onChange({...spec,zoom,cx,cy,labels});
 };
 const button=(label,fn)=>{const b=node('button',label);b.type='button';b.onclick=()=>{fn();update();};controls.append(b);return b;};
 const plus=button('Zoom in +',()=>zoom=Math.min(16,zoom*1.6));
 const minus=button('Zoom out −',()=>zoom=Math.max(1,zoom/1.6));
 button('←',()=>cx-=120/zoom).setAttribute('aria-label','Move map west');button('→',()=>cx+=120/zoom).setAttribute('aria-label','Move map east');
 button('↑',()=>cy-=90/zoom).setAttribute('aria-label','Move map north');button('↓',()=>cy+=90/zoom).setAttribute('aria-label','Move map south');
 button('Reset world',()=>{zoom=1;cx=450;cy=225;});
 const labelButton=button('Place names',()=>labels=!labels);
 // Optional teacher shortcuts also make tiny targets reachable on a shared screen.
 for(const [name,lon,lat,z]of [['South America',-65,-20,2.5],['Peru',-75,-10,6],['UK',-3,55,12],['London',-.1276,51.5072,16]])button(name,()=>{[cx,cy]=point(lon,lat);zoom=z;});
 let drag=null;
 svg.onpointerdown=e=>{if(e.button!==0)return;const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const pos=p.matrixTransform(svg.getScreenCTM().inverse());drag={id:e.pointerId,x:pos.x,y:pos.y,cx,cy,matrix:svg.getScreenCTM().inverse()};svg.setPointerCapture(e.pointerId);svg.style.cursor='grabbing';};
 svg.onpointermove=e=>{if(!drag||e.pointerId!==drag.id)return;const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const pos=p.matrixTransform(drag.matrix);cx=drag.cx-(pos.x-drag.x);cy=drag.cy-(pos.y-drag.y);update();};
 svg.onpointerup=svg.onpointercancel=()=>{drag=null;svg.style.cursor='grab';};
 svg.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(1,Math.min(16,zoom*(e.deltaY<0?1.2:1/1.2)));update();},{passive:false});
 svg.onkeydown=e=>{const actions={ArrowLeft:()=>cx-=100/zoom,ArrowRight:()=>cx+=100/zoom,ArrowUp:()=>cy-=75/zoom,ArrowDown:()=>cy+=75/zoom,'+':()=>zoom=Math.min(16,zoom*1.6),'=':()=>zoom=Math.min(16,zoom*1.6),'-':()=>zoom=Math.max(1,zoom/1.6),Home:()=>{zoom=1;cx=450;cy=225;}};if(actions[e.key]){e.preventDefault();actions[e.key]();update();}};
 root.append(controls,canvas,status);update();return root;
}
