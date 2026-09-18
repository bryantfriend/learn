// Four taught stages remain visible while the focus moves along the chain.
export function supplyChainArt(state){
 const rows=[['Country A · Grow cotton','Farmer · water + land','#dcefd4'],['Country B · Weave fabric','Weaver · cotton + loom','#dcebf9'],['Country C · Sew the shirt','Garment worker · fabric + machine','#fbe6cf'],['Country D · Sell the shirt','Shop worker · finished shirts + shop','#eee1f7']];
 const icons=[
 '<path d="M22 43V19M22 34L10 27M22 29L35 21" stroke="#478355" stroke-width="4"/><g fill="white" stroke="#86a574"><circle cx="12" cy="18" r="9"/><circle cx="29" cy="13" r="10"/><circle cx="36" cy="25" r="8"/></g>',
 '<rect x="4" y="6" width="39" height="36" rx="3" fill="#74a9c6"/><path d="M12 7V42M22 7V42M32 7V42M5 16H42M5 26H42M5 36H42" stroke="white" stroke-width="3"/>',
 '<path d="M14 6L3 14L9 25L15 22V43H35V22L41 25L47 14L35 6Q25 15 14 6Z" fill="#dc8551" stroke="#975832" stroke-width="2"/>',
 '<rect x="5" y="18" width="40" height="27" rx="2" fill="white"/><path d="M3 19L9 5H41L47 19Z" fill="#a16dc0"/><path d="M12 5L9 19M24 5V19M36 5L39 19" stroke="white" stroke-width="5"/><rect x="12" y="26" width="11" height="19" fill="#ab8dc4"/><rect x="28" y="26" width="11" height="10" fill="#b9ddeb"/>'
 ];
 return '<svg viewBox="0 0 560 300" role="img" aria-label="Four-stage T-shirt supply chain: Country A grows cotton, B weaves fabric, C sews the shirt and D sells it. Arrows show dependence between stages."><g font-family="system-ui,sans-serif" fill="#23474a">'+rows.map(([title,detail,color],i)=>{
 const y=7+i*73;return '<g transform="translate(0 '+y+')"><rect x="40" y="0" width="511" height="63" rx="12" fill="'+color+'" stroke="'+(state.phase===i?'#25685e':'#cbdcd8')+'" stroke-width="'+(state.phase===i?3:1)+'"/><circle cx="20" cy="29" r="16" fill="#25685e"/><text x="20" y="35" text-anchor="middle" fill="white" font-size="20" font-weight="700">'+(i+1)+'</text>'+(i<3?'<path d="M20 47V68m-5-6 5 6 5-6" fill="none" stroke="#25685e" stroke-width="2"/>':'')+'<g transform="translate(49 8)">'+icons[i]+'</g><text x="108" y="25" font-size="22" font-weight="700">'+title+'</text><text x="108" y="49" font-size="18">'+detail+'</text></g>';
 }).join('')+'</g></svg>';
}
