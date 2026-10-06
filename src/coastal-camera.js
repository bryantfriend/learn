// Automatic round framing prioritises readable city markers over the whole world.
export const automaticMinimumZoom=.9;
export function cameraForNewStops(camera,stops){
 if(!stops.length)return {...camera};
 const left=Math.min(...stops.map(s=>s.x)),right=Math.max(...stops.map(s=>s.x)),top=Math.min(...stops.map(s=>s.y)),bottom=Math.max(...stops.map(s=>s.y));
 const zoom=Math.max(automaticMinimumZoom,Math.min(Math.max(automaticMinimumZoom,camera.zoom),1.8,720/(right-left+120),360/(bottom-top+120)));
 return {zoom,x:500-(left+right)/2*zoom,y:280-(top+bottom)/2*zoom};
}
