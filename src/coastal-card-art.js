// Local vector illustrations: each card has an authored scene and effect cue.
// Shared visual vocabulary keeps a bus, clock or extra seat recognisable in play.
const stroke='#254b58',gold='#edb442',teal='#218f87',red='#cb6255';
const rect=(x,y,w,h,fill,r=8)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const line=(x,y,a,b,c=stroke,w=5)=>`<path d="M${x} ${y}L${a} ${b}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
const circle=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const group=(x,y,art,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">${art}</g>`;
function coin(x,y){return circle(x,y,16,'#b88029')+circle(x,y-3,16,gold)+circle(x,y-3,11,'#f8d97a')+`<path d="M${x-3} ${y-11}v15m6-15v15" stroke="#b88029" stroke-width="3"/>`;}
function coins(){return coin(-17,10)+coin(13,4)+coin(-6,-15);}
function person(x,y,colour=teal,mood='happy'){return circle(x,y-20,11,'#f0c095')+rect(x-13,y-5,26,32,colour,10)+line(x-6,y+26,x-8,y+40)+line(x+6,y+26,x+8,y+40)+circle(x-4,y-23,1.5,stroke)+circle(x+4,y-23,1.5,stroke)+`<path d="M${x-4} ${y-17}q4 ${mood==='happy'?5:-5} 8 0" stroke="${stroke}" stroke-width="2" fill="none"/>`;}
function crowd(n=5){return Array.from({length:n},(_,i)=>person(-65+(i%5)*32,15+Math.floor(i/5)*28,[teal,'#537bb2','#d99a4d','#8e63aa','#ba6860'][i%5])).join('');}
function vehicle(type){if(type==='boat')return `<path d="M-66 12H67L44 40H-43Z" fill="#dba53d"/>${rect(-40,-17,65,30,'#fffaf0')}${rect(-22,-37,40,23,teal)}${[-26,-5,16].map(x=>rect(x,-9,14,12,'#6cabc3',3)).join('')}<path d="M-80 48q15 12 30 0t30 0t30 0t30 0t30 0" fill="none" stroke="#fff" stroke-width="5"/>`;
 if(type==='plane')return `<path d="M75 0L10 12L-20 58H-39L-21 12L-65 16L-78 4L-46 0L-78-4L-65-16L-21-12L-39-58H-20L10-12Z" fill="#fffaf0" stroke="#8d70b1" stroke-width="4"/>${rect(-27,-7,75,14,'#8462ab',7)}${rect(40,-6,18,12,'#54839b',6)}`;
 const rail=type==='train',body=rail?'#de775a':teal;return (rail?rect(-79,-10,39,38,body)+line(-40,15,-28,15):'')+rect(-32,-23,105,54,stroke,12)+rect(-29,-24,99,45,body,10)+[-18,8,34].map(x=>rect(x,-15,20,25,'#b9e4e5',4)).join('')+rect(59,-14,7,26,'#ffdf92',3)+circle(-12,30,10,stroke)+circle(53,30,10,stroke)+circle(-12,30,4,'#c6d9d9')+circle(53,30,4,'#c6d9d9');}
function clock(){return circle(0,0,44,stroke)+circle(0,0,37,'#fff8e8')+Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return circle(Math.sin(a)*29,-Math.cos(a)*29,2,'#89a7a4');}).join('')+line(0,0,0,-23)+line(0,0,20,12)+circle(0,0,5,gold);}
function chair(){return rect(-26,-38,49,42,'#5089b1',10)+rect(-30,4,60,17,'#76b7c5',7)+line(-22,20,-22,42)+line(22,20,22,42);}
function station(){return rect(-65,-10,130,57,'#fff8e8')+`<path d="M-79-10L0-57L79-10Z" fill="#dc9564"/>`+rect(-19,10,38,37,teal)+rect(-52,3,23,24,'#88bbc5',3)+rect(30,3,23,24,'#88bbc5',3);}
function harbour(){return rect(-65,25,130,14,'#b68960',3)+[-50,-10,30,58].map(x=>rect(x,38,7,24,'#846348',2)).join('')+`<path d="M-8-41v61M-40-3q0 42 32 42T24-3M-29-9H13" fill="none" stroke="${teal}" stroke-width="9" stroke-linecap="round"/>`+circle(-8,-46,9,teal);}
function airport(){return rect(-74,-18,148,43,'#6a8587',5)+`<path d="M-65 3H65" stroke="white" stroke-width="3" stroke-dasharray="13 10"/>`+rect(48,-60,14,48,'#d6d9cd',3)+rect(36,-64,38,17,'#6eafbf',5)+group(-15,-5,vehicle('plane'),.55);}
function tools(){return `<path d="M-47-47L-14-20L-36 6L-68-24Z" fill="#a6b6b1"/><path d="M-22-14L45 53" stroke="#a07750" stroke-width="18" stroke-linecap="round"/><path d="M56-44q-28-15-37 15L-38 35q-13 14 0 23t22-5L35-5q35 7 32-26L51-18L38-31Z" fill="#508b9e"/>`;}
function ticket(){return rect(-60,-34,120,68,'#fff8dc',10)+`<path d="M23-29v58" stroke="#d4ab61" stroke-width="3" stroke-dasharray="5 6"/>`+circle(-60,0,9,'#dcebdc')+circle(60,0,9,'#dcebdc')+`<path d="M-32 17L-18-20L-4 17M-28 7H-8" fill="none" stroke="${teal}" stroke-width="5"/>`;}
function star(){return `<path d="M0-49L15-17L50-13L24 12L31 47L0 30L-31 47L-24 12L-50-13L-15-17Z" fill="${gold}" stroke="#bd8930" stroke-width="4"/>`;}
function route(){return `<path d="M-63 37L-10-24L60 27M-63 37L60 27" fill="none" stroke="${teal}" stroke-width="8" stroke-linecap="round"/>`+circle(-63,37,12,'#fff8e8')+circle(-10,-24,12,'#fff8e8')+circle(60,27,12,'#fff8e8');}
const heroes={coins,clock,chair,station,harbour,airport,tools,ticket,star,route,crowd,
 grant:()=>rect(-63,-15,126,65,'#c79a67')+rect(-68,-26,136,22,teal)+group(0,-27,coins(),.9),
 bank:()=>rect(-62,-4,124,62,'#faf1d7')+`<path d="M-75-6L0-48L75-6Z" fill="#a98e76"/>`+[-43,-4,35].map(x=>rect(x,2,13,48,'#bdc7be',2)).join('')+rect(-73,53,146,10,'#a98e76',2),
 shelter:()=>line(-60,-5,-60,54)+line(60,-5,60,54)+`<path d="M-74-9L0-42L74-9Z" fill="${teal}"/>`+rect(-43,27,86,10,'#d2a668',3)+group(0,0,chair(),.45),
 festival:()=>`<path d="M-86-50Q0-3 86-50" stroke="#c29466" stroke-width="3" fill="none"/>`+[-70,-38,-5,28,60].map((x,i)=>`<path d="M${x}-39l20 5-9 23Z" fill="${[gold,teal,red][i%3]}"/>`).join('')+group(0,0,crowd(),.8),
 fuel:()=>rect(-34,-49,66,99,red)+rect(-23,-36,44,31,'#e2ede3',4)+`<path d="M33-29h17v60q0 18 16 12V-13l-12-17" stroke="${stroke}" stroke-width="7" fill="none"/>`+rect(-47,48,93,11,stroke,3),
 barrier:()=>rect(-73,-10,145,28,'#fff5db',4)+[-65,-20,25].map(x=>`<path d="M${x}-10l24 28h19l-24-28Z" fill="${red}"/>`).join('')+line(-50,18,-50,52)+line(50,18,50,52),
 shield:()=>`<path d="M0-53L49-33V7Q49 42 0 59Q-49 42-49 7V-33Z" fill="#688ea0" stroke="${stroke}" stroke-width="4"/><path d="M-24 0l17 18L25-17" stroke="#fff4da" stroke-width="9" stroke-linecap="round" fill="none"/>`,
 suitcase:()=>rect(-29,-44,58,19,stroke,6)+rect(-60,-31,120,79,'#d3a158',12)+line(-37,-26,-37,44,'#fff0c5',7)+line(37,-26,37,44,'#fff0c5',7),
 signal:()=>rect(-20,-60,40,103,stroke,15)+circle(0,-39,11,'#769989')+circle(0,-7,11,'#efd065')+circle(0,24,11,teal)+line(0,44,0,66),
 wind:()=>`<path d="M-65-18H35q27 0 25-20t-28 0M-70 8H60M-53 32H14q27 0 27 19t-28 0" fill="none" stroke="#6ba9bf" stroke-width="9" stroke-linecap="round"/>`,
 cloud:()=>circle(-29,0,27,'#fbf8ec')+circle(1,-17,36,'#fbf8ec')+circle(38,3,28,'#fbf8ec')+rect(-28,1,69,28,'#fbf8ec'),
 contract:()=>rect(-40,-55,81,106,'#fff8e5',6)+[-30,-8,14].map(y=>line(-24,y,22,y,'#97b3a6',5)).join('')+circle(21,38,17,gold),
 crane:()=>line(-53,54,-53,-45,'#b99162',8)+line(-77,-45,57,-45,'#b99162',8)+line(35,-45,35,-4,'#567e8c',4)+rect(11,-4,48,36,'#d2b088',3),
 dispatcher:()=>group(0,12,person(0,0,teal),1.1)+`<path d="M-18-13Q-18-44 0-44T18-13" fill="none" stroke="${stroke}" stroke-width="6"/>`+line(18,-13,18,0)+line(18,0,9,0)
};
// [main subject, effect symbol, secondary subject]. Explicit entries avoid generic fallback art.
export const cardScenes={
 grant:['grant','plus','coins'],'bus-sale':['bus','discount','contract'],'rail-sale':['train','discount','signal'],'boat-sale':['boat','discount','harbour'],'air-sale':['plane','discount','airport'],
 'bus-fast':['bus','fast','route'],'rail-fast':['train','fast','signal'],'boat-fast':['boat','fast','wind'],'air-fast':['plane','fast','cloud'],fares:['ticket','plus','crowd'],
 patient:['crowd','time','clock'],platforms:['station','expand','crowd'],clock:['clock','plus','route'],calm:['dispatcher','time','shield'],workshop:['tools','discount','bus'],
 builders:['station','discount','tools'],ports:['harbour','discount','crane'],airports:['airport','discount','contract'],seats:['chair','plus','route'],quiet:['crowd','less','suitcase'],
 refund:['coins','return','bus'],bonus:['star','plus','coins'],speed:['route','fast','dispatcher'],'harbour-seats':['boat','seat','chair'],'bus-seats':['bus','seat','chair'],
 'rail-seats':['train','seat','chair'],'air-seats':['plane','seat','chair'],fund:['grant','crowds','suitcase'],efficient:['route','discount','contract'],shelters:['shelter','time','crowd'],
 tax:['bank','minus','coins'],'bus-price':['bus','price','coins'],'rail-price':['train','price','crane'],'boat-price':['boat','price','harbour'],'air-price':['plane','price','airport'],
 'bus-slow':['bus','slow','barrier'],'rail-slow':['train','slow','tools'],'boat-slow':['boat','slow','wind'],'air-slow':['plane','slow','cloud'],'fares-down':['ticket','minus','coins'],
 impatient:['crowd','urgent','clock'],narrow:['station','shrink','crowd'],short:['clock','minus','route'],urgent:['dispatcher','urgent','shield'],repair:['tools','price','coins'],
 labour:['station','price','contract'],dredge:['harbour','price','crane'],runway:['airport','price','barrier'],rush:['crowd','crowds','clock'],resale:['coins','minus','bus'],
 sponsors:['star','minus','coins'],traffic:['route','slow','barrier'],holiday:['suitcase','crowds','crowd'],festival:['festival','crowds','clock'],fuel:['fuel','price','coins'],
 safety:['shield','urgent','clock'],'busy-ports':['harbour','crowds','boat'],'bus-demand':['bus','crowds','crowd'],'rail-demand':['train','crowds','crowd'],'air-demand':['plane','crowds','crowd']
};
const subject=id=>['bus','train','boat','plane'].includes(id)?vehicle(id):heroes[id]();
function cue(kind,bad){const colour=bad?red:teal;const plus=line(-14,0,14,0,'white',6)+line(0,-14,0,14,'white',6),minus=line(-14,0,14,0,'white',6);
 const glyph={plus,minus,discount:`<path d="M-23-19H10L23 0L10 19H-23Z" fill="white"/>${circle(-13,0,3,colour)}${line(-1,9,12,-9,colour,3)}${circle(1,-7,3,colour)}${circle(10,7,3,colour)}`,
 price:`<path d="M-17 15V-8H-25L0-26L25-8H17V15Z" fill="white"/>`,
 fast:`<path d="M-24-16L-5 0L-24 16M0-16L19 0L0 16" stroke="white" stroke-width="7" stroke-linecap="round" fill="none"/>`,
 slow:rect(-15,-17,10,34,'white',2)+rect(5,-17,10,34,'white',2),time:group(0,0,clock(),.49),urgent:`<path d="M-6-23H7L4 5H-3Z" fill="white"/>${circle(0,16,4,'white')}`,
 seat:group(0,0,chair(),.48),crowds:group(0,4,person(-10,0,'white')+person(13,0,'#ffe0b2'),.48),
 return:`<path d="M17-14A22 22 0 1 1-20-3M-22-17V0H-6" stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/>`,
 expand:`<path d="M-5 0H-24l9-9m-9 9 9 9M5 0H24l-9-9m9 9-9 9" stroke="white" stroke-width="5" fill="none"/>`,
 shrink:`<path d="M-26 0H-6l-9-9m9 9-9 9M26 0H6l9-9m-9 9 9 9" stroke="white" stroke-width="5" fill="none"/>`,less:group(0,0,person(0,0,'white'),.55)}[kind];return circle(0,0,32,colour)+circle(0,0,27,colour)+glyph;}
const cache=new Map();
export function cardArtwork(id){if(cache.has(id))return cache.get(id);const spec=cardScenes[id];if(!spec)throw new Error('Missing card illustration: '+id);const [hero,effect,secondary]=spec,bad=['tax','bus-price','rail-price','boat-price','air-price','bus-slow','rail-slow','boat-slow','air-slow','fares-down','impatient','narrow','short','urgent','repair','labour','dredge','runway','rush','resale','sponsors','traffic','holiday','festival','fuel','safety','busy-ports','bus-demand','rail-demand','air-demand'].includes(id);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${bad?'#f1d7c6':'#d4eeea'}"/><stop offset="1" stop-color="#fff6dd"/></linearGradient><filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#264e55" flood-opacity=".17"/></filter></defs>${rect(0,0,360,220,'url(#sky)',18)}${circle(298,43,27,'#fff1b4')}<path d="M0 161Q92 124 190 157T360 147V220H0Z" fill="${bad?'#c8c7a4':'#b3d2b3'}"/><path d="M0 202Q134 162 360 197" fill="none" stroke="#fffae8" stroke-width="22"/>${group(61,112,subject(secondary),.45)}<ellipse cx="196" cy="176" rx="92" ry="14" fill="#32575b18"/><g filter="url(#shadow)">${group(195,118,subject(hero),1.08)}${group(294,165,cue(effect,bad))}</g>${bad?`<path d="M21 25l8-14 8 14Z" fill="${red}"/>`: `<path d="M20 20l6 6 12-14" stroke="${teal}" stroke-width="5" fill="none" stroke-linecap="round"/>`}</svg>`;
 const data='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);cache.set(id,data);return data;
}
