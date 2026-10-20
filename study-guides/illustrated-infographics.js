import {el,infographic} from './infographics.js';

// The five posters are selected by guide, never by a shared Geography list.
export const posterPlans={
 geo7a:[['geo7a-map','map'],['geo7a-compass','compass'],['geo7a-ruler','scale'],['geo7a-scale','scale'],['geo7a-features','features']],
 geo7b:[['geo7b-countries','countries'],['geo7b-uk','uk'],['geo7b-weather','weather'],['geo7b-snow','snow'],['geo7b-vortex','vortex']],
 gp7a:[['gp7a-methods','methods'],['gp7a-main','mainIdea'],['gp7a-notes','notes'],['gp7a-summary','summary'],['gp7a-evaluate','feedback']],
 gp7b:[['gp7b-question','question'],['gp7b-methods','methods'],['gp7b-main','mainIdea'],['gp7b-notes','notes'],['gp7b-summary','summary']],
 gp8:[['gp8-prediction','question'],['gp8-methods','methods'],['gp8-features','perspectives'],['gp8-perspectives','perspectives'],['gp8-action-summary','summary']]
};
export const posterIds=Object.values(posterPlans).flat().map(p=>p[0]);

function copy(id,d,c){const l=d.labels,u=d.ui,t=d.topics;switch(id){
case'geo7a-map':return{title:t.map.title,points:[[l.woodland,`${l.symbol} → ${l.meaning}`],[l.pond,`${l.symbol} → ${l.meaning}`],[l.bridge,`${l.symbol} → ${l.meaning}`]],note:t.map.body[0],tool:'map'};
case'geo7a-compass':return{title:t.compass.title,points:[[l.northArrow,t.compass.facts[2][1]],[`${l.school} → ${l.pond}`,l.NE],[`${l.pond} → ${l.school}`,l.SW]],note:t.compass.body[1],tool:'compass'};
case'geo7a-ruler':return{title:l.ruler,points:[[l.zero,d.posters.ruler[0]],[l.ruler,d.posters.ruler[1]],[u.example,'5.5 − 2 = 3.5 cm']],tool:'ruler'};
case'geo7a-scale':return{title:t.scale.title,points:[[l.scale,'1 cm = 50 m'],[u.example,'4 × 50 = 200 m'],[l.route,'(2 + 3) × 50 = 250 m']],note:t.scale.body[1],tool:'calculator'};
case'geo7a-features':return{title:t.features.title,points:t.features.facts,note:t.features.body[1]};
case'geo7b-countries':return{title:t.countries.title,points:t.countries.facts,note:t.countries.body[0],tool:'countries'};
case'geo7b-uk':return{title:t.uk.title,points:[...t.uk.facts.slice(0,2),[l.islandIreland,t.uk.body[1]]],note:t.uk.lead};
case'geo7b-weather':return{title:t.weather.title,points:[[l.temperature,`${l.thermometer} · °C`],[l.rainfall,`${l.rainGauge} · mm`],[l.windSpeed,l.anemometer],[l.windDirection,l.windVane]],note:`${d.extra.weather[0]}: ${d.extra.weather[1]}. ${d.extra.weather[2]}: ${d.extra.weather[3]}. ${t.weather.body[1]}`};
case'geo7b-snow':return{title:t.snow.title,points:[[l.cloudIce,l.moisture],[l.snowflakes,l.groundSnow],[l.blizzard,`${l.wind} + ${l.visibility} + ${l.drifts}`]],note:t.snow.body.join(' ')};
case'geo7b-vortex':return{title:t.vortex.title,points:[[l.polar,t.vortex.body[0]],[l.tornado,t.vortex.body[1]]],note:t.vortex.facts[2][1]};
case'gp7a-methods':case'gp7b-methods':case'gp8-methods':return{title:t.methods.title,points:d.extra.methods[id.startsWith('gp7a')?'7a':id.startsWith('gp7b')?'7b':'8'],note:u.methodsNote};
case'gp7a-main':case'gp7b-main':return{title:t.mainIdea.title,points:c.headings.map((heading,i)=>[`${u.paragraph} ${i+1}`,heading]),note:`${l.mainIdea}: ${c.title}. ${t.mainIdea.lead}`};
case'gp7a-notes':case'gp7b-notes':return{title:t.notes.title,points:c.notes.map((note,i)=>[`${u.paragraph} ${i+1} · ${c.headings[i]}`,note]),note:t.notes.lead};
case'gp7a-summary':return{title:t.summary.title,points:c.summary.map((s,i)=>[`${u.paragraph} ${i+1} · ${c.headings[i]}`,s]),note:c.task};
case'gp7a-evaluate':return{title:t.feedback.title,points:t.feedback.facts,note:c.reflection};
case'gp7b-question':return{title:t.question.title,points:[[l.question,d.posters.breakQuestion],[l.focused,t.question.facts[0][1]],[l.neutral,t.question.facts[1][1]]],note:t.question.lead};
case'gp7b-summary':return{title:t.summary.title,points:[[l.keyPoints,c.notes.join(' ')],[u.model,c.summary],[l.review,t.feedback.lead]],note:c.task};
case'gp8-prediction':return{title:t.question.title,points:[[l.cause,t.perspectives.facts[0][1]],[l.plan,t.methods.lead],[u.evidence,t.question.facts[2][1]]],note:t.question.body[1]};
case'gp8-features':return{title:t.perspectives.title,points:t.perspectives.facts,note:t.perspectives.body[0]};
case'gp8-perspectives':return{title:l.priority,points:d.posters.perspectives,note:t.perspectives.body[1]};
case'gp8-action-summary':return{title:t.summary.title,points:[[l.action,t.perspectives.facts[2][1]],[l.trial,d.extra.methods['8'][0][1]],[u.model,c.summary]],note:c.task};
default:throw Error('Unknown class infographic '+id);
}}

function tool(name,d,topicId,c){
 const old=infographic(['ruler','calculator'].includes(name)?'scale':name,d,topicId,c);
 if(name==='ruler'){const wrap=el('div',{class:'poster-tool'});wrap.append(old.querySelector('svg'),el('p',{class:'diagram-note'},[d.ui.scaleNote]));return wrap;}
 if(name==='calculator'){const wrap=el('div',{class:'poster-calculator'});wrap.append(old.querySelector('.scale-control'),old.querySelector('output'),el('p',{class:'diagram-note'},[d.ui.scaleNote]));return wrap;}
 return old.querySelector('.art');
}

export function posterTitle(id,d,c){return copy(id,d,c).title;}

export function illustratedInfographic(id,d,guide,c){
 const index=posterPlans[guide].findIndex(p=>p[0]===id);if(index<0)throw Error('Infographic belongs to another class');
 const topicId=posterPlans[guide][index][1],p=copy(id,d,c);
 const image=el('img',{src:`./assets/illustrated/${id}.webp`,alt:p.title,width:1536,height:1024,loading:'lazy',decoding:'async',class:'poster-image'});
 const imagePanel=el('div',{class:'poster-illustration'},[image]);
 const points=el('ol',{class:'poster-callouts points-'+p.points.length},p.points.map(([title,body])=>el('li',{},[el('strong',{},[title]),el('p',{},[body])])));
 const content=el('div',{class:'poster-body'},[imagePanel,points]);
 if(p.tool){const inset=el('div',{class:`poster-live poster-live-${p.tool}`},[el('h3',{},[d.ui.example]),tool(p.tool,d,topicId,c)]);if(p.tool!=='calculator')inset.append(el('p',{class:'pan-hint'},[d.extra.pan]));content.append(inset);}
 if(guide.startsWith('gp'))content.append(el('p',{class:'poster-art-caption'},[d.posters.artCaption]));
 if(p.note)content.append(el('p',{class:'poster-note'},[p.note]));
 return el('figure',{class:'visual illustrated-poster',id:'poster-'+id,'data-poster':id,'data-visual':id,'data-guide':guide},[
 el('figcaption',{},[el('span',{class:'poster-heading'},[el('span',{class:'poster-count'},[`${String(index+1).padStart(2,'0')} / 05`]),p.title]),el('button',{type:'button','data-enlarge':id},[d.ui.enlarge])]),content
 ]);
}
