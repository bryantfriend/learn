import {ukMapPaths} from './uk-map-paths.js';
import {atlasPaths} from './atlas-paths.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const ukCountries=['England','Scotland','Wales','Northern Ireland'];
export const countryColours={'England':'#e6b35a','Scotland':'#69ad94','Wales':'#a6c660','Northern Ireland':'#b49bd6','Ireland':'#e0e4dc','Isle of Man':'#e0e4dc'};
const txt=(x,y,s,size=21,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${esc(s)}</text>`;
const labelled=(x,y,s,size=22)=>txt(x,y,s,size,'paint-order="stroke" stroke="#edf7fb" stroke-width="5" stroke-linejoin="round" font-weight="700"');
export function atlasArt({view='islands',labels=true,highlight='',cities=false,physical=false,revealed=null,marker=false}={}){
 let body='',width=720,height=520;
 if(['world','europe'].includes(view)){
  width=900;height=view==='world'?450:640;
  body=atlasPaths.map(f=>`<path d="${f[view]}" fill="${f.name==='United Kingdom'?'#dd733c':'#d6dfcd'}" stroke="#768d88" stroke-width="${view==='world'?.55:1}"/>`).join('');
  if(view==='world')body+=`<circle cx="442" cy="87" r="18" fill="none" stroke="#b94f22" stroke-width="3"/>`+labelled(471,74,'UK',25)+labelled(460,136,'Europe',25)+txt(260,210,'Atlantic Ocean',24)+txt(560,90,'Asia',24)+txt(448,247,'Africa',24);
  else body+=labelled(105,291,'United Kingdom',25)+`<path d="M275 286L307 346" fill="none" stroke="#97542d" stroke-width="3"/>`+labelled(260,539,'France',25)+labelled(555,190,'Norway',25)+txt(26,440,'Atlantic Ocean',24)+txt(360,290,'North Sea',24)+labelled(455,435,'Mainland Europe',25)+txt(24,510,'English Channel',19)+`<path d="M182 504L310 444" fill="none" stroke="#306d88" stroke-width="2"/>`;
 }else{
  body=Object.entries(ukMapPaths).map(([name,d])=>{
   const on=!highlight||highlight==='uk'&&ukCountries.includes(name)||highlight==='gb'&&['England','Scotland','Wales'].includes(name)||highlight==='ireland-island'&&['Ireland','Northern Ireland'].includes(name)||highlight===name;
   return `<path data-country="${esc(name)}" d="${d}" fill="${revealed&&!revealed.includes(name)?'#dbe1dc':on?(['ireland-island','Ireland'].includes(highlight)?'#6aabd0':countryColours[name]):'#dbe1dc'}" stroke="#4c706b" stroke-width="1.3"><title>${esc(name)}</title></path>`;
  }).join('');
  const show=name=>labels&&(!revealed||revealed.includes(name));
  for(const [name,x,y,path]of [['Scotland',520,160,'M515 155H430L369 180'],['England',520,358,'M515 353H467L426 340'],['Wales',135,400,'M204 395H289L358 370'],['Northern Ireland',30,230,'M165 241H253L303 269']])if(show(name))body+=`<g class="atlas-label">${name==='Northern Ireland'?labelled(x,y,'Northern')+labelled(x,y+25,'Ireland'):labelled(x,y,name)}<path d="${path}" fill="none" stroke="#45665f" stroke-width="1.7"/></g>`;
  if(labels)body+=txt(218,328,'Ireland',18);
  if(marker)body+=`<circle cx="306" cy="267" r="23" fill="none" stroke="#b34e21" stroke-width="4"/>${labelled(62,300,'Find this place',18)}<path d="M185 295L283 272" stroke="#b34e21" stroke-width="2"/>`;
  body+=`<g fill="#306d88" font-style="italic">${txt(532,270,'North Sea',21)}${txt(28,130,'Atlantic Ocean',20)}${txt(459,479,'English Channel',19)}${txt(405,295,'Irish Sea',19)}<path d="M402 298L348 307" fill="none" stroke="#306d88"/></g>`;
  if(cities){for(const [name,x,y,lx,ly]of [['London',447,391,503,422],['Cardiff',376,392,241,443],['Edinburgh',376,211,470,214],['Belfast',314,272,65,285]])body+=`<circle cx="${x}" cy="${y}" r="5" fill="#873f26"/><path d="M${x} ${y}L${lx} ${ly-6}" stroke="#873f26" fill="none"/>${labelled(lx,ly,name,18)}`;}
  if(physical)body+=`<ellipse cx="350" cy="167" rx="30" ry="36" fill="#816b40" opacity=".35"/><path d="M402 391Q417 385 430 395T471 414" stroke="#147fb0" stroke-width="4" fill="none"/><path d="M380 175H475M444 406H516" stroke="#755f33"/>${labelled(478,179,'Scottish Highlands',17)}${labelled(520,411,'Thames',18)}${txt(25,473,'Physical features: approximate region / river course',15)}`;
  body+=txt(40,40,'N ↑',24)+txt(24,506,revealed?'Tap a UK country to add its colour and name.':highlight?'Highlighted group: '+({uk:'United Kingdom',gb:'Great Britain','ireland-island':'Island of Ireland'}[highlight]||highlight):'Colour = UK countries · grey = neighbouring territory',15);
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(view==='world'?'World map highlighting the UK in north-west Europe':view==='europe'?'UK offshore from mainland Europe, with France and the North Sea':`UK and Ireland map${labels?', with countries and surrounding seas labelled':''}`)}"><rect width="100%" height="100%" fill="#e3f1f7"/><g font-family="system-ui,sans-serif" fill="#294f54">${body}</g></svg>`;
}
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
export function createAtlas(spec={},onChange=()=>{}){
 const root=el('figure',null,'geo-atlas'),controls=el('div',null,'atlas-controls'),canvas=el('div',null,'atlas-canvas'),caption=el('figcaption');
 let view=spec.view||'islands',highlight=spec.highlight||'',labels=spec.labels!==false,physical=!!spec.physical;
 let revealed=[...(spec.revealed||[])];
 const descriptions={world:'World view: the UK is in north-west Europe. Which ocean lies to its west?',europe:'Regional view: describe the UK relative to mainland Europe and the North Sea.',islands:'Island view: locate the two islands, then describe one country relative to another.'};
 root.currentAtlasState=()=>({...spec,view,highlight,labels,physical,revealed:[...revealed]});
 function update(){
  if(spec.compare){
   canvas.replaceChildren();canvas.classList.add('atlas-comparison');
   for(const [key,title,subtitle]of [['uk','United Kingdom','England + Scotland + Wales + Northern Ireland'],['gb','Great Britain','England + Scotland + Wales · one island']]){const map=el('section');map.append(el('h3',title),el('p',subtitle));const art=el('div');art.innerHTML=atlasArt({highlight:key});map.append(art);canvas.append(map);}
  }else canvas.innerHTML=atlasArt({view,highlight,labels,cities:spec.cities,physical,marker:spec.marker,revealed:spec.fill?revealed:null});
  if(spec.fill){
   canvas.querySelector('svg').setAttribute('role','group');
   for(const path of canvas.querySelectorAll('[data-country]')){const name=path.dataset.country;if(!ukCountries.includes(name))continue;
    path.setAttribute('role','button');path.setAttribute('tabindex','0');path.setAttribute('aria-label','Reveal '+name);path.setAttribute('aria-pressed',String(revealed.includes(name)));
    const reveal=()=>{if(!revealed.includes(name))revealed.push(name);update();canvas.querySelector(`[data-country="${name}"]`).focus({preventScroll:true});};path.onclick=reveal;path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();reveal();}};
   }
  }
  caption.textContent=spec.fill?`${revealed.length} of 4 countries labelled. ${revealed.length===4?'Now point to the country on the other island.':'Predict a name, then tap its outline to add it.'}`:spec.caption||descriptions[view];
  controls.querySelectorAll('button').forEach(b=>{if(b.dataset.view)b.setAttribute('aria-pressed',String(b.dataset.view===view));if(b.dataset.highlight)b.setAttribute('aria-pressed',String(b.dataset.highlight===highlight));});
  onChange(root.currentAtlasState());
 }
 function control(label,fn,key,value){const b=el('button',label);b.type='button';if(key)b.dataset[key]=value;b.onclick=()=>{fn();update();};controls.append(b);return b;}
 if(spec.scales)for(const [key,name]of [['world','World'],['europe','Europe'],['islands','UK & Ireland']])control(name,()=>view=key,'view',key);
 if(spec.fill){control('Reveal next country',()=>{const next=ukCountries.find(n=>!revealed.includes(n));if(next)revealed.push(next);});control('Clear country labels',()=>revealed=[]);}
 if(spec.revealLabels)control('Show / hide country names',()=>labels=!labels);
 if(spec.layers)control('Show / hide physical features',()=>physical=!physical);
 root.append(controls,canvas,caption);update();return root;
}
