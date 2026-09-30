// Unsolved SVG canvases for class construction. The source beside the canvas
// supplies the case values; these guides never substitute example numbers.
import {atlasArt} from './geography-atlas.js';
const text=(x,y,t)=>`<text x="${x}" y="${y}" font-size="22" fill="#24584e">${t}</text>`;
const box=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#fff" stroke="#8fac9e" stroke-width="2" stroke-dasharray="7 5"/>`;
export function workpadArt(kind){
 if(kind==='uk'||kind==='journey')return atlasArt({cities:true});
 let art='';
 if(['grid','coordinates'].includes(kind)){
  for(let i=0;i<=10;i++)art+=`<path d="M${150+i*40} 45V445M150 ${45+i*40}H550" stroke="#bed0c9"/>`;
  art+=`<path d="M150 45V445H550" fill="none" stroke="#24584e" stroke-width="3"/>`+text(200,490,kind==='grid'?'Eastings → · mark northings up':'Longitude → · latitude ↑');
  if(kind==='coordinates')art+=`<path d="M350 45V445M150 245H550" stroke="#ad6634" stroke-width="3"/>`+text(360,235,'0°, 0°');
 }else if(kind==='population'){
  art=`<circle cx="295" cy="250" r="155" fill="#b8dcd3" fill-opacity=".5" stroke="#328676" stroke-width="3"/><circle cx="475" cy="250" r="155" fill="#ffe1a6" fill-opacity=".5" stroke="#bc872c" stroke-width="3"/>`+text(140,55,'Label each group. Count the overlap once.');
 }else if(['contours','sampling','quality','tourism'].includes(kind)){
  art=`<path d="M100 65V430H680" fill="none" stroke="#24584e" stroke-width="3"/>`;
  for(let i=1;i<=5;i++)art+=`<path d="M100 ${430-i*60}H680" stroke="#d5e2da"/>`;
  art+=text(180,485,'Choose labels, units and a fair scale.');
 }else if(['scale','aerial','maps','os-map','tools'].includes(kind)){
  art=box(85,90,480,350)+text(110,65,'Build your plan')+box(590,90,150,350)+text(625,65,'Key')+text(590,480,'N ↑');
 }else if(['routes','distance','memory-map'].includes(kind)){
  art=`<circle cx="125" cy="270" r="30" fill="#c6e4d5"/><circle cx="620" cy="270" r="30" fill="#ffdfa0"/>`+text(90,330,'Start')+text(585,330,'Finish')+text(100,75,'Draw routes. Add landmarks, distances and a key.');
 }else if(['allocation','management','ice'].includes(kind)){
  art=box(55,95,200,300)+box(280,95,200,300)+box(505,95,200,300)+text(95,70,kind==='ice'?'Inputs':'Available')+text(310,70,kind==='ice'?'Ice store':'Allocate')+text(540,70,kind==='ice'?'Outputs':'Remaining')+text(70,475,'Add case values. Show and check the calculation.');
 }else if(['change','settlement','valley','corrie','estuary'].includes(kind)){
  art=box(30,95,330,340)+box(400,95,330,340)+text(70,65,'First view')+text(440,65,'Second view')+text(80,480,'Use matching viewpoints. Label what changes.');
 }else{
  art=box(25,120,215,290)+box(275,120,215,290)+box(525,120,215,290)+text(245,270,'→')+text(495,270,'→')+text(40,75,'Draw three connected ideas. Label each arrow.')+text(65,465,'Use the case facts. Mark any predicted effects.');
 }
 return `<svg viewBox="0 0 760 530" role="img" aria-label="Unfinished class diagram; add labels and evidence using the board workspace"><rect width="760" height="530" rx="16" fill="#f0f6ef"/><g font-family="system-ui,sans-serif">${art}</g></svg>`;
}
