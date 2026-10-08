// Keep the entire desktop book on screen without changing the browser's zoom.
// Fixed unscaled width prevents fitting from reflowing and measuring itself forever.
export function installPassportFit(dialog){
 let frame=0;
 function fit(){frame=0;if(!dialog.open)return;
  if(window.innerWidth<=800){dialog.style.removeProperty('width');dialog.style.removeProperty('zoom');return;}
  dialog.style.width=Math.min(1200,window.innerWidth-24)+'px';
  const height=Math.min(window.innerHeight,window.visualViewport?.height??window.innerHeight)-24;
  const scale=Math.min(1,height/Math.max(1,dialog.offsetHeight));
  dialog.style.zoom=String(Math.floor(scale*1000)/1000);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(fit);}
 const changes=new MutationObserver(schedule);changes.observe(dialog,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['open']});
 const sizes=new ResizeObserver(schedule);sizes.observe(dialog);
 dialog.addEventListener('load',schedule,true);window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);
 return {destroy(){cancelAnimationFrame(frame);changes.disconnect();sizes.disconnect();dialog.removeEventListener('load',schedule,true);window.removeEventListener('resize',schedule);window.visualViewport?.removeEventListener('resize',schedule);}};
}
