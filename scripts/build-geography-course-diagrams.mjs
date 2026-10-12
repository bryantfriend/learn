import {writeFileSync} from 'node:fs';
import {geographyArt} from '../src/geography-lab.js';
const root=new URL('../assets/geography/',import.meta.url);
const wrap=(title,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 460" role="img" aria-label="${title}"><rect width="660" height="460" rx="18" fill="#faf7ef"/><g font-family="sans-serif" fill="#112d4d">${body}</g></svg>`;
const text=(x,y,s,size=20)=>`<text x="${x}" y="${y}" font-size="${size}">${s}</text>`;
const line=(x1,y1,x2,y2,stroke='#112d4d',width=2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"/>`;
writeFileSync(new URL('teaching-grid.svg',root),geographyArt('grid',0,6,2,'2.5').replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));
let coords=text(25,35,'Latitude and longitude: a simplified sketch',24)+line(75,230,600,230)+line(300,60,300,390)+text(25,220,'0°')+text(312,75,'0°')+text(210,437,'Equator: 0° latitude',18)+text(330,403,'Prime meridian',18);
coords+=`<path d="M75 135H480V230" fill="none" stroke="#137c83" stroke-width="3" stroke-dasharray="7 5"/>`;
coords+=`<circle cx="480" cy="135" r="8" fill="#dca438"/>`+text(350,118,'20°N, 30°E',24)+text(82,125,'20°N')+text(450,260,'30°E')+text(292,53,'N')+text(292,410,'S')+text(50,238,'W')+text(610,238,'E');
writeFileSync(new URL('teaching-coordinates.svg',root),wrap('Equator and prime meridian; example point 20 degrees north, 30 degrees east',coords));
let profile=text(25,35,'Height profile: equal horizontal intervals',24)+line(80,60,80,350)+line(80,350,570,350);
for(const h of [100,120,140,160,180]){const y=320-(h-100)*3;profile+=line(80,y,510,y,'#d5dfdc',1)+text(35,y+6,h,17);}
for(const d of [0,100,200,300]){const x=80+d*1.4;profile+=line(x,350,x,357)+text(x-8,382,d,17);}
profile+=`<polyline points="80,320 220,260 360,140 500,80" fill="none" stroke="#137c83" stroke-width="5"/>`+line(220,260,360,140,'#dca438',7);
for(const [x,y,h]of [[80,320,100],[220,260,120],[360,140,160],[500,80,180]])profile+=`<circle cx="${x}" cy="${y}" r="6" fill="#112d4d"/>`+text(x+10,y-10,h+' m',17);
profile+=text(85,58,'Height (m)',18)+text(180,415,'Horizontal distance (m)',18)+text(80,448,'Steepest interval: 100–200 m; rise 40 m over 100 m.',18);
writeFileSync(new URL('teaching-height-profile.svg',root),wrap('Distance zero, one hundred, two hundred, three hundred metres; height one hundred, one hundred twenty, one hundred sixty, one hundred eighty metres',profile));
let contours=text(25,35,'Contours: equal height along each line',24);
for(const [x,y,rx,ry,h]of [[330,230,250,155,100],[365,230,180,115,120],[390,230,115,75,140],[410,230,55,40,160]])contours+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="#54896d" stroke-width="3"/>`+text(x-rx+10,y-10,h+' m',17);
contours+=text(35,418,'Contour interval: 20 m. Compare spacing on the same map.',18)+text(35,448,'The closer lines on the right indicate a steeper slope.',18);
writeFileSync(new URL('teaching-contours.svg',root),wrap('A hill shown by contours one hundred, one hundred twenty, one hundred forty and one hundred sixty metres, closer together on the east side',contours));
let oxbow=text(25,35,'From meander to isolated oxbow lake',24);
const panels=[['1. Narrowing neck','M30 280H55C75 280 72 245 72 190C72 80 160 80 160 190C160 245 157 280 185 280H205'],['2. New shorter channel','M30 280H55C75 280 72 245 72 190C72 80 160 80 160 190C160 245 157 280 185 280H205'],['3. Old bend isolated','M30 280H205']];
panels.forEach(([label,d],i)=>{
 const x=i*215;oxbow+=`<g transform="translate(${x} 70)"><rect x="8" y="0" width="205" height="305" rx="10" fill="#e4eddf"/>${text(20,30,label,17)}<path d="${d}" stroke="#58aaba" stroke-width="14" stroke-linecap="round" fill="none"/>`;
 if(i===1)oxbow+=`<path d="M55 280H185" stroke="#137c83" stroke-width="12"/>`;
 if(i===2)oxbow+=`<path d="M76 242C72 220 72 205 72 190C72 80 160 80 160 190C160 205 160 220 156 242" stroke="#58aaba" stroke-width="14" stroke-linecap="round" fill="none"/>`;
 oxbow+='</g>';
});
oxbow+=text(25,424,'A shortcut alone is not isolation.',20)+text(25,450,'Deposits or disconnection close the old bend’s entrances.',18);
writeFileSync(new URL('teaching-oxbow-sequence.svg',root),wrap('Three stages: narrowing meander neck, shorter channel, old bend isolated after its entrances disconnect',oxbow));
console.log('Built five teaching diagrams: grid, coordinates, profile, contours and oxbow sequence.');
