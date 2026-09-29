const ns='http://www.w3.org/2000/svg';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
export function sampleRate(a,b){return a+b?Math.round((a*.8+b*.2)/(a+b)*100):null;}
export function createGPLab(spec){
 const root=el('section',null,'gp-lab'),controls=el('div',null,'gp-controls'),view=el('div'),feedback=el('p',null,'gp-feedback');
 let state={a:10,b:10,denominator:30,percent:false,step:0,buffer:false,person:0,option:0,budget:70,selected:[],owners:[0,0,0,0],revealed:[],scope:0,leading:false};
 const initial=JSON.stringify(state);
 root.append(el('p',spec.limits,'panel-hint'),el('h3','Predict'),el('p',spec.predict),controls,view,feedback);
 const actions=el('div',null,'gp-controls');root.append(actions);
 function button(label,fn,parent=controls,pressed){const b=el('button',label);b.type='button';if(pressed!==undefined)b.setAttribute('aria-pressed',String(pressed));b.onclick=()=>{fn();render();};parent.append(b);return b;}
 let playing=false;
 const motion=button('Play arrows',()=>{playing=!playing;root.classList.toggle('gp-playing',playing);motion.textContent=playing?'Pause arrows':'Play arrows';},actions);
 button('Reset model',()=>{state=JSON.parse(initial);playing=false;root.classList.remove('gp-playing');motion.textContent='Play arrows';},actions);
 root.append(el('h3','Test'),el('p',spec.test),el('h3','Explain and transfer'),el('p',spec.debrief));
 const context=el('details');context.append(el('summary','Return to this lesson’s source and task'));
 [...spec.sources,...spec.task].forEach(t=>context.append(el('p',t)));root.append(context);
 function svgNode(tag,attrs={},text){const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text)n.textContent=text;return n;}
 function diagram(labels,active=0,values){
  const svg=svgNode('svg',{viewBox:'0 0 800 330',role:'img','aria-label':labels.join('; ')});svg.append(svgNode('title',{},labels.join('; ')));
  labels.forEach((label,i)=>{const y=25+i*70;svg.append(svgNode('rect',{x:15,y,width:770,height:56,rx:12,fill:i===active?'#d9f5e9':'#edf2fa',stroke:i===active?'#157b57':'#91a4be'}));
   if(values)svg.append(svgNode('rect',{x:300,y:y+8,width:Math.max(0,Math.min(470,values[i]*4.7)),height:40,rx:8,fill:'#4195cc',class:'gp-bar'}));
   svg.append(svgNode('text',{x:30,y:y+34,fill:'#122641','font-size':21},label));
   if(i<labels.length-1){svg.append(svgNode('path',{d:`M 760 ${y+57} v 12`,stroke:'#157b57','stroke-width':4,'stroke-dasharray':'4 3',class:'gp-flow'}));svg.append(svgNode('path',{d:`M 755 ${y+64} l 5 5 l 5 -5`,fill:'none',stroke:'#157b57','stroke-width':2}));}
   if(spec.kind==='causality'){
    const g=svgNode('g',{transform:`translate(670 ${y+7})`,fill:'none',stroke:'#176b53','stroke-width':2.5});
    const paths=['M 0 12 L 22 0 L 44 12 L 22 24 Z M 0 12 V 32 L 22 44 L 44 32 V 12 M 22 24 V 44','M 0 42 V 18 L 13 8 V 18 L 27 8 V 18 H 42 V 42 Z M 5 28 H 12 M 19 28 H 26 M 33 28 H 39','M 0 14 L 5 2 H 39 L 44 14 Z M 4 14 V 42 H 40 V 14 M 10 23 H 22 V 34 H 10 Z M 29 42 V 23 H 35','M 5 42 V 24 Q 14 15 23 24 V 42 M 25 42 V 24 Q 34 15 43 24 V 42'];
    g.append(svgNode('path',{d:paths[i]}));if(i===3){g.append(svgNode('circle',{cx:14,cy:9,r:7}),svgNode('circle',{cx:34,cy:9,r:7}));}svg.append(g);
   }
  });view.replaceChildren(svg);
 }
 function range(label,key,min,max){const wrap=el('label',`${label}: ${state[key]} `),input=el('input');input.type='range';input.min=min;input.max=max;input.value=state[key];input.setAttribute('aria-label',label);input.oninput=()=>{state[key]=Number(input.value);render();controls.querySelector(`[aria-label="${label}"]`)?.focus();};wrap.append(input);controls.append(wrap);}
 function render(){controls.replaceChildren();let message='';
 switch(spec.kind){
 case 'sampling':{
  range('Group A sampled','a',0,50);range('Group B sampled','b',0,50);
  const rate=sampleRate(state.a,state.b);diagram(['A: 80% prefer quiet','B: 20% prefer quiet',`Sample: ${rate===null?'no respondents':rate+'%'}`,'Population: 50%'],2,[80,20,rate||0,50]);
  message='Fictional population: equal-sized groups. Fixed preference rates isolate selection bias. '+(rate===null?'Select at least one respondent.':`Expected sample result: ${rate}%. Explain why changing the mix changes the result.`);break;}
 case 'data':{
  range('Group B total','denominator',12,60);button(state.percent?'Show counts':'Show percentages',()=>state.percent=!state.percent);
  const a=state.percent?60:6,b=state.percent?Math.round(1200/state.denominator):12;
  diagram([`A: ${a}${state.percent?'%':' votes'}`,`B: ${b}${state.percent?'%':' votes'}`],0,[state.percent?a:a/15*100,state.percent?b:b/15*100]);message=`A: 6 of 10; B: 12 of ${state.denominator}. Both bars start at zero; full width = ${state.percent?'100%':'15 votes'}. Which has the greater count? Which has the greater proportion?`;break;}
 case 'causality':{
  ['No interruption','Block supply','Block production'].forEach((t,i)=>button(t,()=>state.step=i,controls,state.step===i));button('Buffer stock',()=>state.buffer=!state.buffer,controls,state.buffer);
  const blocked=state.step>0&&!state.buffer;diagram([state.step===1?'Supply interrupted':'Supply available',blocked?'Production delayed':'Production continues',blocked?'Shop delivery delayed':'Shop supplied',blocked?'Customers wait':'Customers served'],state.step);message=state.buffer?'A temporary stock buffer keeps the model running. What happens when the stock runs out?':'Arrows mean “supplies the next stage”. Trace one step at a time. What other routes could exist?';break;}
 case 'perspectives':{
  ['Lin: quiet study','Sam: music rehearsal'].forEach((t,i)=>button(t,()=>state.person=i,controls,state.person===i));['Quiet room','Music room','Separate time slots'].forEach((t,i)=>button(t,()=>state.option=i,controls,state.option===i));
  diagram(['Lin needs quiet','Sam needs rehearsal space',['Quiet room chosen','Music room chosen','Time slots chosen'][state.option]],state.person);message=state.option===2?'Both activities have time, but neither can use the room whenever they want. Who decides the schedule?':state.option===state.person?'This meets the selected person’s priority. Explain the cost to the other person.':'This does not meet the selected person’s priority. Propose a change.';break;}
 case 'reliability':{
  const cards=['Method: online voluntary poll','Sample: 20 music-club members','Purpose: request a rehearsal room'];cards.forEach((t,i)=>button(state.revealed.includes(i)?t:'Reveal '+['method','sample','purpose'][i],()=>{if(!state.revealed.includes(i))state.revealed.push(i);}));diagram(['Claim: “Students want music”',...cards.map((t,i)=>state.revealed.includes(i)?t:'Unknown: '+['method','sample','purpose'][i])],state.revealed.length);message='16 of the 20 respondents wanted more rehearsal time. Does this establish what all students want? What independent evidence would help?';break;}
 case 'planning':{
  range('Budget tokens','budget',20,120);const names=['Quiet corner · 20','Rehearsal slot · 35','Shared room · 50'],costs=[20,35,50];names.forEach((t,i)=>button(t,()=>state.selected=state.selected.includes(i)?state.selected.filter(x=>x!==i):[...state.selected,i],controls,state.selected.includes(i)));const cost=state.selected.reduce((s,i)=>s+costs[i],0);diagram([`Budget: ${state.budget}`,`Cost: ${cost}`,cost<=state.budget?'Within budget':'Over budget'],2);message=`${state.budget-cost} tokens remaining. Quiet corner serves study; rehearsal slot serves music; shared room needs scheduling. Defend the package and name a need still unmet.`;break;}
 case 'teamwork':{
  const names=['Unassigned','Lin','Sam','Jo'];['Research','Check sources','Draft','Present'].forEach((t,i)=>button(`${t}: ${names[state.owners[i]]}`,()=>state.owners[i]=(state.owners[i]+1)%4));diagram(names.map((n,i)=>`${n}: ${state.owners.filter(x=>x===i).length} tasks`),0);message='Tap a task to change its owner. Check that all tasks have an owner, then discuss difficulty and hand-offs. Equal task counts do not establish equal effort.';break;}
 case 'research':{
  ['Broad topic','Defined group','Place and time'].forEach((t,i)=>button(t,()=>state.scope=i,controls,state.scope===i));button('Leading wording',()=>state.leading=!state.leading,controls,state.leading);
  const q=['What do people think of lunch?','What do Year 7 pupils think of lunch?','What do Year 7 pupils at our school think of lunch this week?'][state.scope];diagram(['Who? '+(state.scope?'Year 7 pupils':'People'),'Where? '+(state.scope===2?'Our school':'Unspecified'),'When? '+(state.scope===2?'This week':'Unspecified')],state.scope);message=state.leading?q.replace('think of lunch','dislike about lunch')+' This assumes dislike. Rewrite it neutrally.':q+' Choose a method and explain who might be missed.';break;}
 case 'communication':{
  ['Headline','Add evidence','Add limitation'].forEach((t,i)=>button(t,()=>state.step=i,controls,state.step===i));const lines=['“Students want more music time”','16 of 20 music-club respondents agreed','We have not asked students outside the club'];diagram(lines.map((t,i)=>i<=state.step?t:'Not revealed yet'),state.step);message='Rewrite the headline after each reveal. A precise version: “16 of 20 music-club respondents wanted more rehearsal time.”';break;}
 case 'reflection':{
  ['First attempt','Feedback','Revision','Next action'].forEach((t,i)=>button(t,()=>state.step=i,controls,state.step===i));const lines=['“Everyone wants more music”','Check who actually answered','“16 of 20 club respondents agreed”','Ask a sample beyond the club'];diagram(lines.map((t,i)=>i<=state.step?t:'Next step hidden'),state.step);message='Point to the specific improvement. The revised claim matches the evidence; the next action checks whether other students agree.';break;}
 }
 feedback.textContent=message;
 }
 render();return root;
}
