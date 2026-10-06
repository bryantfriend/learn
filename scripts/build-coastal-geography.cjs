// Run after placing the documented source GeoJSONs in output/. No runtime downloads.
const fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync('output/'+p,'utf8'));
function simplify(points){if(points.length<4)return points;const a=points[0],b=points.at(-1),dx=b[0]-a[0],dy=b[1]-a[1];let best=.018,index=-1;for(let i=1;i<points.length-1;i++){const p=points[i],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1))),d=Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);if(d>best){best=d;index=i;}}return index<0?[a,b]:[...simplify(points.slice(0,index+1)).slice(0,-1),...simplify(points.slice(index))];}
function polygons(g){const polys=g.type==='Polygon'?[g.coordinates]:g.coordinates;return polys.filter(p=>p[0].some(([x,y])=>x>-13&&x<16&&y>43&&y<62)).map(p=>simplify(p[0]).map(([x,y])=>[+x.toFixed(4),+y.toFixed(4)])).filter(p=>p.length>3);}
const shapes={};for(const f of read('uk-regions.geojson').features)shapes[{'England':'england','Wales':'wales','Scotland':'scotland','Northern Ireland':'northern-ireland'}[f.properties.shapeName]]=polygons(f.geometry);
shapes.ireland=polygons(read('ireland-border.geojson').features[0].geometry);
for(const f of read('europe-countries.geojson').features)if(['France','Belgium','Netherlands','Germany'].includes(f.properties.NAME))shapes[f.properties.NAME.toLowerCase()]=polygons(f.geometry);
fs.writeFileSync('src/coastal-boundaries.js','// Simplified Eurostat/geoBoundaries UK (CC BY 4.0), © OpenStreetMap contributors Ireland (ODbL 1.0), Natural Earth Europe (public domain). See docs/coastal-geography.md.\nexport const regionShapes='+JSON.stringify(shapes)+';\n');
console.log('Built country outlines:',Object.keys(shapes).join(', '));
