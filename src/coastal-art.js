// Canvas artwork stays separate from passenger simulation and route rules.
const palette={road:'#137c83',rail:'#df7154',ferry:'#dca438',flight:'#8261ae'};
export const vehiclePaint=(type,level)=>({road:['#137c83','#2563a5','#633ca8','#aa741b'],rail:['#df7154','#b64149','#7b3fb1','#aa741b'],highspeed:['#346cb7','#229fba','#6445a7','#aa741b'],tunnel:['#9b6699','#487bc0','#257e81','#aa741b'],ferry:['#dca438','#148e96','#456bb1','#aa741b'],flight:['#8261ae','#426ab1','#16847d','#aa741b']}[type]?.[level-1]??palette[type]);
const rounded=(c,x,y,w,h,r,fill)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();};
// The nose starts at the departure platform; the tail ends at the arrival
// platform. Clip carriages outside the route instead of rotating a full train.
export function trainStationVisual(type,level,position,routeLength){
 if(!['rail','highspeed','tunnel'].includes(type))return null;
 const cars=2+Math.min(2,level-1),nose=type==='rail'?19:30,tail=-19-(cars-1)*30,length=nose-tail;
 const p=Math.max(0,Math.min(1,position)),front=p*(routeLength+length);
 const left=Math.max(tail,nose-front),right=Math.min(nose,nose+routeLength-front);
 return {offset:front-routeLength*p-nose,left,right,visible:Math.max(0,right-left),length};
}
function coast(c,island){
 c.beginPath?.();
 if(!island){c.moveTo(-20,-20);c.lineTo(355,-20);c.bezierCurveTo(440,80,385,160,450,225);c.bezierCurveTo(490,270,425,330,420,410);c.bezierCurveTo(380,500,410,560,305,620);c.lineTo(-20,620);}
 else{c.moveTo(835,70);c.bezierCurveTo(955,40,980,175,945,260);c.bezierCurveTo(990,355,865,505,785,450);c.bezierCurveTo(705,400,710,290,765,225);c.bezierCurveTo(700,150,765,70,835,70);}
 c.closePath();
}
function tree(c,x,y,size=1){c.save();c.translate(x,y);c.scale(size,size);c.fillStyle='#224a4430';c.beginPath();c.ellipse(5,10,12,5,0,0,7);c.fill();rounded(c,-2,0,4,14,1,'#8e7953');for(const [dx,dy,r,col]of [[-5,-3,9,'#538d70'],[5,-5,10,'#64a17b'],[0,-13,10,'#77b489']]){c.fillStyle=col;c.beginPath();c.arc(dx,dy,r,0,7);c.fill();}c.restore();}
function house(c,x,y,col='#dc8665',scale=1){c.save();c.translate(x,y);c.scale(scale,scale);rounded(c,-14,8,35,8,3,'#234f4330');rounded(c,-14,-7,28,23,3,'#fff3d8');c.beginPath();c.moveTo(-18,-6);c.lineTo(0,-21);c.lineTo(18,-6);c.closePath();c.fillStyle=col;c.fill();rounded(c,-8,1,6,6,1,'#6b9cad');rounded(c,3,3,6,13,1,'#836c57');c.restore();}
export function createCoastalArtwork(){
 const backdrop=document.createElement('canvas');backdrop.width=1000;backdrop.height=600;const b=backdrop.getContext('2d');
 const mainland=new Path2D(),islandLand=new Path2D();coast(mainland,false);coast(islandLand,true);
 const sea=b.createLinearGradient(0,0,1000,600);sea.addColorStop(0,'#b9e5e3');sea.addColorStop(.5,'#94cfdc');sea.addColorStop(1,'#70b5d0');
 for(const island of [false]){
  coast(b,island);b.strokeStyle='#ffffff30';b.lineWidth=44;b.stroke();b.strokeStyle='#c8eeeb';b.lineWidth=29;b.stroke();b.strokeStyle='#f3deac';b.lineWidth=17;b.stroke();
  const grass=b.createLinearGradient(0,0,0,600);grass.addColorStop(0,'#cde1ae');grass.addColorStop(1,'#9ecb9b');b.fillStyle=grass;b.fill();
  b.save();coast(b,island);b.clip();
  for(let i=0;i<12;i++){b.fillStyle=i%2?'#ffffff0c':'#507f5020';b.beginPath();b.ellipse(island?790+(i*73)%180:(i*97)%420,40+(i*83)%580,90,35,-.3,0,7);b.fill();}
  for(let i=0;i<(island?18:38);i++){const x=island?770+(i*67)%170:35+(i*71)%335,y=35+(i*97)%525;if([[170,290],[410,385],[760,365],[240,135],[855,165],[110,460],[870,340]].some(([sx,sy])=>Math.hypot(sx-x,sy-y)<70))continue;tree(b,x,y,.6+(i%3)*.15);}
  b.restore();
 }
 for(const [x,y]of [[800,110],[900,95],[925,200],[790,270],[920,310],[830,225],[835,400]])tree(b,x,y,.8);
 // Town clusters, runways and wooden harbour piers.
 for(const [x,y,col,s]of [[113,244,'#cc735d',1],[145,222,'#d19b54',.8],[201,232,'#b37d72',.7],[343,350,'#ce8760',.8],[358,398,'#d9a453',.7],[805,306,'#cb795c',.8],[789,331,'#d5a44f',.6],[64,410,'#b87958',.8],[88,397,'#d09b54',.6],[910,305,'#b88164',.7]])house(b,x,y,col,s);
 for(const [x,y]of [[240,135],[855,165]]){b.save();b.translate(x-24,y-35);b.rotate(-.25);rounded(b,-40,-5,125,15,5,'#728f87');b.strokeStyle='#ffffffa0';b.lineWidth=2;b.setLineDash([10,10]);b.beginPath();b.moveTo(-30,2);b.lineTo(75,2);b.stroke();b.restore();rounded(b,x+29,y-15,23,17,3,'#f5ecd6');}
 for(const [x,y,d]of [[410,385,1],[760,365,-1]]){b.save();b.translate(x,y);rounded(b,0,-10,d*40,20,2,'#a7865f');b.strokeStyle='#e6c49a';b.lineWidth=2;for(let i=5;i<40;i+=7){b.beginPath();b.moveTo(d*i,-9);b.lineTo(d*i,9);b.stroke();}b.restore();}
 return {land(c,time){
  c.fillStyle='#94cfdc';c.fillRect(-1200,-1200,4000,4000);
  const grass=c.createLinearGradient(0,0,0,600);grass.addColorStop(0,'#cde1ae');grass.addColorStop(1,'#9ecb9b');c.fillStyle=grass;c.strokeStyle='#f3deac';c.lineWidth=16;
  c.beginPath();c.moveTo(-1200,-1200);c.lineTo(355,-1200);c.lineTo(355,0);c.bezierCurveTo(440,80,385,160,450,225);c.bezierCurveTo(490,270,425,330,420,410);c.bezierCurveTo(380,500,410,560,305,600);c.bezierCurveTo(350,700,350,780,340,850);c.bezierCurveTo(320,960,360,1800,350,3000);c.lineTo(-1200,3000);c.closePath();c.fill();c.stroke();
  c.beginPath();c.moveTo(835,70);c.bezierCurveTo(955,40,980,175,945,260);c.bezierCurveTo(1030,400,1000,560,1000,700);c.bezierCurveTo(1120,900,950,1160,820,1130);c.bezierCurveTo(640,1000,650,650,710,430);c.bezierCurveTo(705,360,710,290,765,225);c.bezierCurveTo(700,150,765,70,835,70);c.closePath();c.fill();c.stroke();
  for(let i=0;i<30;i++){tree(c,40+(i*79)%265,640+(i*97)%420,.75);tree(c,730+(i*71)%260,560+(i*89)%480,.75);}
  c.drawImage(backdrop,0,0);
  c.save();c.strokeStyle='#ffffff50';c.lineWidth=2;for(let i=0;i<35;i++){const x=465+(i*29)%185,y=30+(i*67)%1050,shift=Math.sin(time*.7+i)*6;c.beginPath();c.moveTo(x+shift,y);c.quadraticCurveTo(x+12+shift,y+5,x+25+shift,y);c.stroke();}c.restore();},vehicle(c,type,x,y,angle,time,level,moving,transit=null){
  c.save();c.translate(x,y);c.rotate(angle);const paint=vehiclePaint(type,level);
  if(transit){
   if(transit.visible<=0){c.restore();return;}
   c.translate(transit.offset,0);c.beginPath();c.rect(transit.left,-24,transit.visible,48);c.clip();
  }
  if(type==='ferry'&&moving){c.strokeStyle='#ffffff90';c.lineWidth=2;for(let i=0;i<3;i++){const tail=24+i*10+(time*20)%10;c.beginPath();c.moveTo(-tail,-5-i*3);c.lineTo(-tail-12,-9-i*3);c.moveTo(-tail,5+i*3);c.lineTo(-tail-12,9+i*3);c.stroke();}}
  c.shadowColor='#153d4855';c.shadowBlur=7;c.shadowOffsetY=5;
  if(type==='flight'){
   c.beginPath();for(const [px,py]of [[25,0],[6,5],[-5,24],[-11,24],[-6,5],[-20,7],[-24,3],[-15,0],[-24,-3],[-20,-7],[-6,-5],[-11,-24],[-5,-24],[6,-5]])c.lineTo(px,py);c.closePath();c.fillStyle='#fff8eb';c.fill();c.shadowBlur=0;rounded(c,-6,-3,24,6,3,paint);rounded(c,13,-2,6,4,2,'#345b70');
  }else if(type==='ferry'){
   if(moving)c.translate(0,Math.sin(time*4)*1.4);c.beginPath();c.moveTo(28,0);c.quadraticCurveTo(8,-16,-23,-12);c.lineTo(-23,12);c.quadraticCurveTo(8,16,28,0);c.fillStyle='#fff7e1';c.fill();c.shadowBlur=0;rounded(c,-18,-8,33,16,5,paint);rounded(c,-11,-6,17,12,3,'#fffdf3');for(let i=0;i<3;i++)rounded(c,-9+i*5,-4,3,8,1,'#4c8099');
  }else{
   const cars=['rail','highspeed','tunnel'].includes(type)?2+Math.min(2,level-1):1;
   for(let i=cars-1;i>=0;i--){const offset=-i*30;rounded(c,offset-19,-10,37,20,5,'#143c47');rounded(c,offset-19,-9,37,18,5,paint);c.shadowBlur=0;rounded(c,offset-14,-6,22,12,3,'#c2e9e9');for(let j=0;j<3;j++)rounded(c,offset-13+j*7,-5,5,10,1,'#568ca3');rounded(c,offset+11,-6,4,12,2,'#e5f3e9');c.fillStyle='#ffe1a2';c.fillRect(offset+17,-7,2,3);c.fillRect(offset+17,4,2,3);}
  }
  if(type==='highspeed'||type==='tunnel'){c.fillStyle='#fff5df';c.beginPath();c.moveTo(14,-9);c.lineTo(30,0);c.lineTo(14,9);c.closePath();c.fill();rounded(c,16,-3,7,6,2,paint);if(type==='tunnel'){c.strokeStyle='#e7d3ea';c.lineWidth=3;c.beginPath();c.arc(0,0,13,Math.PI,0);c.stroke();}}
  if(level>1){c.shadowBlur=0;rounded(c,-5,-4,12,8,3,'#ffdf7e');c.fillStyle='#68460d';c.font='bold 7px system-ui';c.textAlign='center';c.fillText(String(level),1,2);}
  c.restore();
 }};
}
