// Bespoke, teacher-paced diagrams for the introductory issue/perspective lesson.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=(x,y,words,size=22)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'">'+esc(words)+'</text>';
const box=(x,y,w,h,fill,active=false)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="16" fill="'+fill+'" stroke="'+(active?'#245f6b':'#c9d8d2')+'" stroke-width="'+(active?5:2)+'"/>';
const pupil=(x,y,color)=>'<g transform="translate('+x+' '+y+')"><circle cx="22" cy="18" r="17" fill="#d7a27e"/><path d="M5 13Q9-9 31 4L39 15L27 9L5 16" fill="#4e403b"/><path d="M0 69V50Q22 32 44 50V69" fill="'+color+'"/><path d="M11 68V87M33 68V87" stroke="#33505a" stroke-width="8" stroke-linecap="round"/></g>';
const book=(x,y)=>'<g transform="translate('+x+' '+y+')"><path d="M0 0Q18-6 34 2Q50-6 68 0V37Q50 32 34 40Q18 32 0 37Z" fill="#fff8e7" stroke="#886342" stroke-width="3"/><path d="M34 2V40" stroke="#886342" stroke-width="2"/></g>';
const bubble=(x,name,lines,active,color)=>box(x,18,244,157,active?'#fff0c8':'#fffdf5',active)+t(x+16,49,name,24)+lines.map((line,i)=>t(x+16,83+29*i,line,22)).join('')+'<path d="M'+(x+100)+' 175l14 17 10-17" fill="'+(active?'#fff0c8':'#fffdf5')+'"/>'+pupil(x+99,190,color);
export function issuePerspectiveArt(spec,state){
 const p=state.phase;
 let b='',description='';
 if(spec.scene==='playground'){
  description='One fenced playground. Sam stands beside a football and goal; Amina reads beside a bench. Sam wants active play and Amina wants quiet reading.';
  b='<rect x="14" y="73" width="532" height="177" rx="18" fill="#cfe0bb" stroke="#729076" stroke-width="3"/><path d="M28 82H532M28 243H532" stroke="#eaf2de" stroke-width="4"/>';
  b+=box(22,11,247,54,p===1?'#ffe7aa':'#fffdf5',p===1)+t(39,46,'Sam: football space',22);
  b+=box(289,11,248,54,p===2?'#ffe7aa':'#fffdf5',p===2)+t(305,46,'Amina: quiet reading',21);
  b+='<path d="M45 169V100H125V169M45 117H125M45 140H125M65 100V169M87 100V169M108 100V169" fill="none" stroke="#fff" stroke-width="4"/>'+pupil(170,120,'#d47d48');
  b+='<circle cx="146" cy="205" r="18" fill="#fffdf4" stroke="#466371" stroke-width="2"/><path d="M146 194l10 7-4 12h-12l-4-12Z" fill="#466371"/>';
  b+='<path d="M376 192H511M385 203H503M391 204V229M495 204V229" stroke="#967247" stroke-width="9" stroke-linecap="round"/>'+pupil(421,96,'#577da9')+book(410,159);
  if(p===1)b+='<ellipse cx="151" cy="172" rx="110" ry="72" fill="none" stroke="#245f6b" stroke-width="4" stroke-dasharray="8 6"/>';
  if(p===2)b+='<ellipse cx="444" cy="167" rx="85" ry="72" fill="none" stroke="#245f6b" stroke-width="4" stroke-dasharray="8 6"/>';
  b+=t(64,283,p===3?'How should we share this space?':'ONE space · DIFFERENT needs',25);
 }else if(spec.scene==='issue'){
  description='Three connected cards turn the topic Playtime into the shared issue: how should we share the playground?';
  const rows=[['TOPIC','Playtime'],['SITUATION','One space, different needs'],['ISSUE','How should we share it?']];
  rows.forEach(([label,line],i)=>{const y=10+i*97;b+=box(20,y,520,81,i===2?'#e2edcc':'#fffdf5',p===i||p===3&&i===2)+t(38,y+29,label,17)+t(38,y+62,line,28);if(i<2)b+='<path d="M280 '+(y+82)+'v13m-6-6 6 6 6-6" fill="none" stroke="#467e84" stroke-width="3"/>';});
 }else if(spec.scene==='voices'){
  description='Sam: We need football space because it keeps us active. Amina: We need a quiet area because noise makes reading hard.';
  b=bubble(20,'SAM',['Football space','keeps us active.'],p===1,'#d47d48')+bubble(296,'AMINA',['A quiet area helps','me concentrate.'],p===2,'#577da9');
  b+=t(35,293,p===3?'VIEW + REASON = explain a perspective':'Same playground · two perspectives',23);
 }else if(spec.scene==='evidence'){
  description='A plan showing one playground is a checkable fact. A speech bubble stating Football is best expresses a viewpoint.';
  b=box(18,20,250,240,'#e5f0e8',p===0)+box(292,20,250,240,'#fff0d4',p===1||p===2);
  b+=t(39,54,'CHECK A FACT',22)+'<rect x="77" y="76" width="133" height="86" rx="3" fill="#bdd7a5" stroke="#547b61" stroke-width="3"/><path d="M140 76V162" stroke="#f9fff5" stroke-width="3"/><circle cx="141" cy="119" r="21" fill="none" stroke="#f9fff5" stroke-width="3"/>'+t(52,197,'One playground.',22)+t(55,231,'Count or inspect.',21);
  b+=t(313,54,'HEAR A VIEW',22)+box(315,78,204,84,'#fffdf5')+t(331,112,p===2?'Quiet reading':'Football is',23)+t(331,142,p===2?'matters to me.':'best for me.',23)+t(322,197,'A preference.',22)+t(317,231,'Ask for reasons.',21);
  b+=t(41,291,p===3?'Evidence helps us decide fairly.':'What can we check? What is valued?',24);
 }else if(spec.scene==='scale'){
  description='Widen the question from my needs, to all pupils in school, to people sharing a public park, and communities around the world.';
  const rows=[['ME','What do I need?'],['OUR SCHOOL','What do all pupils need?'],['OUR COMMUNITY','Who uses the local park?'],['AROUND THE WORLD','How do others share space?']];
  rows.forEach(([label,line],i)=>{const y=6+i*73;b+=box(15,y,530,65,p===i?'#fff0c8':'#eef3e8',p===i)+t(30,y+24,label,15)+t(30,y+51,line,23);});
 }else if(spec.scene==='library'){
  description='One library room. Lina wants to discuss a group project; Omar wants quiet so he can read. Both use the same room.';
  b=box(15,12,530,273,'#e8e5d6',p===0)+'<path d="M26 145H534" stroke="#9d8c70" stroke-width="9"/>';
  for(let i=0;i<14;i++)b+='<rect x="'+(35+i*36)+'" y="111" width="24" height="29" rx="2" fill="'+['#75999e','#bd8056','#a6b484'][i%3]+'"/>';
  b+=box(25,21,239,80,'#fffdf4',p===1)+t(40,51,'Lina: let’s discuss',21)+t(40,81,'our group project.',21);
  b+=box(295,21,239,80,'#fffdf4',p===2)+t(310,51,'Omar: I need quiet',21)+t(310,81,'to read my book.',21);
  b+=pupil(120,158,'#877bab')+pupil(397,158,'#588e88')+'<path d="M76 234H473M96 236V271M452 236V271" stroke="#a78456" stroke-width="10"/>'+book(370,198);
  b+=t(167,298,p===3?'What is the issue?':'ONE library room',24);
 }
 return '<svg viewBox="0 0 560 310" role="img" aria-label="'+esc(spec.title+'. '+description)+'"><g font-family="system-ui,sans-serif" fill="#23474a">'+b+'</g></svg>';
}
