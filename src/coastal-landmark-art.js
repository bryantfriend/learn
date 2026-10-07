const cache=new Map();
export function drawLandmarkArt(ctx,kind,x,y,size=40){let sprite=cache.get(kind);if(!sprite){const canvas=document.createElement('canvas');canvas.width=160;canvas.height=160;const c=canvas.getContext('2d');c.translate(80,83);c.scale(2,2);paint(c,kind);cache.set(kind,canvas);sprite=canvas;}ctx.drawImage(sprite,x-size,y-size,size*2,size*2);}
function paint(c,kind){
 const ink='#526d68',stone='#d7bc89',light='#f3dfb3',shade='#b79d73',roof='#548a87';c.lineWidth=1.15;c.lineJoin='round';c.strokeStyle=ink;
 function poly(points,fill){c.beginPath();points.forEach(([x,y],i)=>c[i?'lineTo':'moveTo'](x,y));c.closePath();c.fillStyle=fill;c.fill();c.stroke();}
 function rect(x,y,w,h,fill=stone){c.fillStyle=fill;c.fillRect(x,y,w,h);c.strokeRect(x,y,w,h);}
 function arch(x,y,w,h,fill=ink){c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+w/2);c.arc(x+w/2,y+w/2,w/2,Math.PI,0);c.lineTo(x+w,y+h);c.closePath();c.fillStyle=fill;c.fill();}
 function windows(x,y,cols,rows,step=7){for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)arch(x+col*step,y+row*8,3,5,'#527c83');}
 function circle(x,y,r,fill){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=fill;c.fill();c.stroke();}
 c.fillStyle='#496c5f22';c.beginPath();c.ellipse(0,26,31,5,0,0,Math.PI*2);c.fill();
 if(kind==='bridge'||kind==='pier'){
  poly([[-32,22],[-23,18],[31,18],[23,25]],'#80b9c0');c.strokeStyle='#d6eff0';for(let y=20;y<26;y+=3){c.beginPath();c.moveTo(-20,y);c.lineTo(24,y);c.stroke();}c.strokeStyle=ink;
  rect(-31,5,62,5,light);for(const x of [-19,17]){rect(x-3,-18,6,43,stone);poly([[x-5,-18],[x,-24],[x+5,-18]],roof);}c.beginPath();c.moveTo(-31,5);c.quadraticCurveTo(-19,-28,-5,5);c.quadraticCurveTo(8,10,17,-18);c.quadraticCurveTo(24,-2,31,5);c.stroke();for(let x=-26;x<30;x+=5){c.beginPath();c.moveTo(x,4);c.lineTo(x,-3);c.stroke();}
  if(kind==='pier'){rect(-6,-7,12,12,light);poly([[-9,-7],[0,-15],[9,-7]],'#ca8b69');}
 }else if(kind==='clock'){
  rect(-25,8,50,18);windows(-22,12,7,1);rect(-8,-23,16,49,light);rect(-10,-25,20,3);poly([[-9,-26],[0,-39],[9,-26]],roof);rect(-3,-34,6,9,roof);circle(0,-17,6,'#fff8e7');c.beginPath();c.moveTo(0,-21);c.lineTo(0,-17);c.lineTo(3,-15);c.stroke();windows(-5,-5,2,3,6);for(const x of [-25,20])rect(x,0,5,26,shade);
 }else if(kind==='tower'){
  poly([[-20,26],[-7,-8],[0,-39],[7,-8],[20,26],[12,26],[0,4],[-12,26]],'#b7a58a');for(const y of [-7,7,19]){rect(-10-y/5,y,20+y/2,2,shade);}c.beginPath();c.moveTo(-15,19);c.lineTo(10,7);c.moveTo(15,19);c.lineTo(-10,7);c.stroke();
 }else if(kind==='mountain'){
  poly([[-33,24],[-14,-11],[0,7],[16,-31],[35,24]],'#7c9b8c');poly([[-22,24],[3,-28],[26,24]],'#a8bca1');poly([[-7,-11],[3,-28],[12,-10],[4,-15]],'#fff7df');poly([[7,-14],[16,-31],[24,-13],[17,-18]],'#f4f0d7');
 }else if(kind==='cliffs'){
  poly([[-33,15],[32,11],[34,28],[-32,29]],'#8ac0c9');poly([[-31,-17],[26,-24],[30,17],[-31,23]],'#fff4d8');poly([[-31,-17],[26,-24],[30,-17],[-31,-10]],'#8ab183');for(const x of [-22,-11,1,13,23]){c.strokeStyle='#d0c4a8';c.beginPath();c.moveTo(x,-8);c.lineTo(x+2,17);c.stroke();}
 }else if(kind==='lake'){
  poly([[-33,8],[-17,-12],[-5,3],[16,-18],[33,9]],'#91af9a');c.fillStyle='#67acbd';c.beginPath();c.ellipse(0,15,29,10,-.15,0,Math.PI*2);c.fill();c.strokeStyle='#d1e7df';for(let y=10;y<24;y+=4){c.beginPath();c.moveTo(-15,y);c.quadraticCurveTo(0,y+3,16,y);c.stroke();}
 }else if(kind==='stones'||kind==='basalt'){
  if(kind==='basalt'){for(let i=0;i<9;i++){const x=-25+i*6,h=12+(i%4)*5;rect(x,24-h,6,h,'#929e92');poly([[x,24-h],[x+3,21-h],[x+7,24-h],[x+3,27-h]],'#b2b7a2');}}else{for(const x of [-23,-6,12]){poly([[x,23],[x-2,-9],[x+8,-11],[x+10,24]],'#a3a68e');}rect(-26,-16,24,7,'#bfc0a6');rect(-7,-18,28,7,'#c5c3ab');}
 }else if(kind==='atoms'){
  for(const [x,y]of [[-23,-17],[23,-17],[-21,20],[21,20],[0,-32]]){c.beginPath();c.moveTo(0,1);c.lineTo(x,y);c.stroke();circle(x,y,6,'#b5cbc4');circle(x-1,y-2,2,'#e6f0df');}circle(0,1,8,'#a3bfba');
 }else if(kind==='windmill'){
  poly([[-11,26],[-7,-7],[7,-7],[12,26]],light);poly([[-11,-7],[0,-17],[11,-7]],roof);for(let i=0;i<4;i++){c.save();c.rotate(Math.PI*i/2+.5);rect(2,-3,26,5,'#c2a97c');for(let x=8;x<28;x+=6){c.beginPath();c.moveTo(x,-3);c.lineTo(x,2);c.stroke();}c.restore();}arch(-3,15,6,11);circle(0,0,3,stone);
 }else if(kind==='houses'){
  for(let i=0;i<4;i++){const x=-28+i*14;rect(x,-9-i%2*7,13,34+i%2*7,['#c48c66','#e2bd84','#789c90','#cba486'][i]);poly([[x,-9-i%2*7],[x+6,-22-i%2*7],[x+13,-9-i%2*7]],light);windows(x+3,0,2,3,5);}poly([[-32,27],[32,27],[28,32],[-30,32]],'#74b1bf');
 }else if(kind==='ship'||kind==='concert'){
  rect(-28,8,56,18,'#c99c7f');if(kind==='ship'){poly([[-28,8],[-18,-10],[-4,0],[6,-20],[27,8]],'#d6e0d7');poly([[-18,5],[-8,-16],[6,0],[20,-14],[28,8]],'#b0c4bc');}else{poly([[-28,8],[-29,-16],[-15,-23],[-6,-8],[4,-20],[15,-6],[27,-21],[28,8]],'#aec9ca');}windows(-23,12,7,1);c.strokeStyle='#eef3e1';for(let x=-23;x<28;x+=7){c.beginPath();c.moveTo(x,1);c.lineTo(x,7);c.stroke();}
 }else if(kind==='tunnel'){
  poly([[-32,24],[-25,-6],[25,-6],[33,24]],'#a7ad94');arch(-15,-5,30,29,'#446d70');c.fillStyle='#789894';c.fillRect(-10,20,20,5);c.strokeStyle='#e3dfcb';for(const x of [-7,7]){c.beginPath();c.moveTo(x,24);c.lineTo(x/2,8);c.stroke();}rect(-7,10,14,9,'#dfb95c');windows(-4,12,2,1,5);
 }else if(kind==='castle'||kind==='gate'||kind==='arch'){
  rect(-24,0,48,25,light);for(const x of [-25,12]){rect(x,-19,13,44);for(let i=0;i<3;i++)rect(x+i*5,-25,4,7,light);windows(x+5,-10,1,3);}arch(-7,9,14,16);if(kind==='gate'){c.clearRect(-40,-40,80,80);rect(-29,-14,58,7,light);for(let x=-22;x<26;x+=9)rect(x,-7,4,32,light);rect(-31,25,62,3,shade);rect(-16,-22,32,8,stone);rect(-6,-30,12,7,roof);circle(0,-32,3,roof);}if(kind==='arch'){c.clearRect(-40,-40,80,80);rect(-28,-12,56,38);arch(-18,-9,15,35,'#7d9d85');arch(4,-9,15,35,'#7d9d85');rect(-31,-17,62,5,light);}
 }else if(kind==='cathedral'||kind==='church'||kind==='university'){
  rect(-27,0,54,26,light);for(const x of [-26,15]){rect(x,-24,11,50);poly([[x-2,-24],[x+5,-39],[x+13,-24]],roof);windows(x+4,-15,1,4);}poly([[-16,0],[0,-16],[16,0]],shade);circle(0,1,5,'#b3c7b4');arch(-6,10,12,16);windows(-18,7,2,2,6);windows(11,7,2,2,6);
 }else if(kind==='dome'||kind==='palace'||kind==='townhall'){
  rect(-26,3,52,23,light);rect(-12,-11,24,14);c.beginPath();c.ellipse(0,-11,13,12,0,Math.PI,0);c.fillStyle=roof;c.fill();c.stroke();rect(-2,-29,4,6,shade);windows(-22,8,7,2);arch(-4,15,8,11);for(const x of [-27,23])rect(x,0,4,26,shade);
 }else if(kind==='square'){
  poly([[-33,28],[0,4],[33,28],[0,35]],'#dcd2b2');for(const x of [-27,9]){rect(x,-13,18,32,light);poly([[x-2,-13],[x+9,-23],[x+20,-13]],roof);windows(x+3,-7,2,3);}circle(0,23,6,'#8db4b7');
 }else{
  rect(-28,-4,56,30,light);rect(-30,-10,60,7,roof);windows(-24,1,8,2);arch(-5,12,10,14);if(kind==='station'){circle(0,-4,5,'#fff8e9');}if(kind==='library'){c.clearRect(-40,-40,80,80);for(const [x,y,w,h,fill]of [[-27,13,54,13,light],[-31,0,62,13,roof],[-23,-15,46,15,stone],[-14,-28,28,13,roof]]){rect(x,y,w,h,fill);for(let xx=x+5;xx<x+w-3;xx+=7)circle(xx,y+h/2,3,'#d9c693');}}if(kind==='museum'){rect(-21,-21,42,16,roof);windows(-17,-17,5,1);}
 }
}
