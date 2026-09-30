// Pointer events support a mouse, pen and a smart-board touch. Ordinary clicks
// remain available for tap-then-target and keyboard operation.
export function makeDraggable(node,{id,root,drop}){
 node.classList.add('draggable-card');let gesture=null,ignoreClick=false;
 node.addEventListener('click',e=>{if(ignoreClick){e.preventDefault();e.stopImmediatePropagation();ignoreClick=false;}},true);
 node.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;gesture={x:e.clientX,y:e.clientY,pointer:e.pointerId,ghost:null};node.setPointerCapture(e.pointerId);
 });
 node.addEventListener('pointermove',e=>{
  if(!gesture||e.pointerId!==gesture.pointer)return;
  if(!gesture.ghost&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>8){const ghost=node.cloneNode(true);ghost.removeAttribute('id');ghost.setAttribute('aria-hidden','true');ghost.classList.add('drag-ghost');ghost.style.width=node.getBoundingClientRect().width+'px';root.append(ghost);gesture.ghost=ghost;}
  if(gesture.ghost){gesture.ghost.style.left=e.clientX+12+'px';gesture.ghost.style.top=e.clientY+12+'px';}
 });
 function end(e,cancel){if(!gesture)return;const moved=!!gesture.ghost;gesture.ghost?.remove();gesture=null;if(node.hasPointerCapture(e.pointerId))node.releasePointerCapture(e.pointerId);if(moved){ignoreClick=true;setTimeout(()=>ignoreClick=false,0);if(!cancel){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop]');if(target&&root.contains(target))drop(id,target.dataset.drop);}}}
 node.addEventListener('pointerup',e=>end(e,false));node.addEventListener('pointercancel',e=>end(e,true));
}
