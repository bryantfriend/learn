export const f=(title,mode,lines,extra={})=>({title,mode,lines,...extra});
export const q=(title,options,answer,explanation,id)=>f(title,'think',[],{type:'question',options:options.map((label,i)=>({id:'ABCD'[i],label})),answer,explanation,discussionId:id,responseHint:'Everyone choose A, B, C or D first. Then compare reasons.'});
export const open=(title,lines,explanation,id)=>f(title,'think',lines,{type:'question',answerText:'One possible response',explanation,discussionId:id});
export const v=(scene,title,steps,extra={})=>({kind:'pilot',scene,title,steps,intro:false,prompt:steps[0],...extra});
export const task=(id,seconds=120)=>({discussionId:id,timerSeconds:seconds});
export const done=achievement=>f('Show what you can do','share',[achievement,'Keep your work. Listen for the next instruction.'],{final:true});
export function build(common,title,topic,stages){
 let start=0;
 return {...common,title,customVisuals:true,contentRevision:3,pilotTopic:topic,
 openingScript:common.openingScript+' All pilot cases and figures are fictional. Use notebooks, seated pairs and the shared board. Everyone makes an individual attempt before a representative or teacher reveals anything.',
 stages:stages.map(([label,minutes,notes,frames],i)=>{const s={id:'pilot-'+i,title:label,durationMinutes:minutes,timeRange:start+'–'+(start+minutes)+' min',notes:(i===0?common.openingScript+'\n':'')+notes+(i===stages.length-1?' Pilot observation: could everyone start, did both partners contribute, and could quieter pupils complete the independent transfer? Record examples rather than treating screen completion as mastery.':''),frames};start+=minutes;return s;})};
}
