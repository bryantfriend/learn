import {ukMapPaths} from './uk-map-paths.js';
// Regional equirectangular projection, longitude scaled at 56° N.
export function ukMapArt(state={phase:0}){
 const fills={'England':'#efb56b','Scotland':'#64ad9b','Wales':'#a3c866','Northern Ireland':'#b39ad0','Ireland':'#e2e5dc','Isle of Man':'#e2e5dc'};
 const label=(x,y,name,color)=>`<text x="${x}" y="${y}" font-size="25" font-weight="750" fill="${color}" paint-order="stroke" stroke="#f0f8fa" stroke-width="5" stroke-linejoin="round">${name}</text>`;
 const sea=(x,y,name)=>`<text x="${x}" y="${y}" fill="${state.phase===2?'#15597b':'#4b7e92'}" font-size="21" font-style="italic" font-weight="${state.phase===2?750:500}">${name}</text>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 520" role="img" aria-label="Geographic map of the United Kingdom: Scotland north of England; Wales west of England; Northern Ireland in the northeast of the island of Ireland. Ireland and the Isle of Man are shown in grey and are not part of the UK." style="overflow:hidden;border-radius:16px"><g font-family="system-ui,sans-serif">
 <rect width="720" height="520" fill="#dfedf2"/>
 <path d="M0 95H720M0 250H720M0 405H720M190 0V520M360 0V520M530 0V520" stroke="#c9dfe7" stroke-width="1"/>
 ${Object.entries(ukMapPaths).map(([name,d])=>`<path d="${d}" fill="${fills[name]}" stroke="#527c80" stroke-width="1.25" stroke-linejoin="round" opacity="${state.phase===1&&name==='Northern Ireland'?0.45:1}"><title>${name}</title></path>`).join('')}
 <g fill="none" stroke="#395c65" stroke-width="1.5"><path d="M527 135H438L370 180"/><path d="M218 233H253L307 270"/><path d="M225 385H297L358 365"/><path d="M524 371H468L419 353"/></g>
 ${label(530,137,'Scotland','#225f52')}
 ${label(27,221,'Northern','#695287')}${label(27,248,'Ireland','#695287')}
 ${label(135,391,'Wales','#476529')}${label(530,378,'England','#855222')}
 <text x="238" y="329" font-size="19" fill="#626e69" text-anchor="middle">Ireland</text>
 ${sea(542,263,'North Sea')}${sea(32,121,'Atlantic')}${sea(34,147,'Ocean')}${sea(459,479,'English Channel')}
 <g transform="translate(54 387)"><text x="0" y="-11" text-anchor="middle" fill="#315762" font-size="19" font-weight="700">N</text><path d="M0 0L-10 27L0 21L10 27Z" fill="#315762"/><path d="M0 23V50" stroke="#315762" stroke-width="2"/></g>
 <rect x="22" y="486" width="355" height="24" rx="7" fill="#f8fbfa"/>
 <text x="32" y="503" font-size="14" fill="#426269">UK countries in colour · neighbouring territory in grey</text>
 <text x="705" y="516" font-size="10" fill="#50727e" text-anchor="end">Coastlines: Natural Earth · 1:50m</text>
 </g></svg>`;
}
