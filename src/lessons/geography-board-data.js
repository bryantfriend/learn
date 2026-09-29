import {geographyTwists} from './geography-twists.js';
// Short original card sets: label > group index, or process steps in order.
// These are guided cases, separate from the independent workshop sources.
const sets = `
1.1|sort|Feature / interaction|Physical;Human;Interaction|Rocky hill>0;Railway platform>1;People dam a river to store water>2;Rain erodes a bare slope>0;A road covers soil and changes runoff>2
1.2|sort|Tool dispatch|Atlas;Compass / north arrow;Ruler + scale;Dated photograph|Locate a country>0;Find north>1;Convert map length to metres>2;Record a building's visible change>3
1.3|sort|Evidence detective|Observation;Possible explanation;Investigation plan|Six people wait at noon>0;The door may open later>1;Count at noon on five days>2;Nine bags are in Zone A>0;Zone A may serve more pupils>1
1.4|sort|Before, after, or inference?|Recorded in the model;Needs further evidence|Before: ferry, after: bridge>0;The river remains in both scenes>0;Every worker is now wealthier>1;The workshop appears in the later scene>0;The bridge caused all growth>1
1.5|sort|Command-word editor|Identify;Describe;Explain|Footbridge>0;Five homes cluster beside the junction>1;Passing customers may attract shops>2;River>0;Two buildings are east of the park>1
1.6|sort|Build an explanation|Claim;Evidence;Possible mechanism;Limitation|Most stalls are near the gate>0;Seven of nine stalls are within 50 m>1;Visitors may pass these stalls first>2;We have no customer interviews>3
1.7|sort|Route briefing|Known fact;User need;Information to check|Route C is 450 m>0;Traveller needs step-free access>1;Ramp gradient>2;Route D includes stairs>0;Whether the path is open today>2
2.1|sort|Choose a map|Historical enquiry;Current navigation|Investigate former factory sites>0;Find today's bus connection>1;Compare old land use with today>0;Locate a currently open entrance>1
2.2|sequence|Scale-plan recipe||Measure or read the real dimensions;Choose one scale for the whole plan;Divide real lengths by metres per centimetre;Draw and label the scaled features;Multiply back to check the real sizes
2.3|sequence|Recover the route||Leave the school gate;Pass the mural before the junction;Turn right at the junction;Cross the footbridge after the turn;Reach the library beyond the bridge
2.4|sort|Visitor-map editor|Keep for this journey;Omit unless needed|Entrance from the street>0;Path leading to reception>0;Reception symbol and key>0;Every chair in an unrelated room>1;Colour of every window curtain>1
2.5|sequence|Send a grid message||Read the left easting;Estimate tenths across the square;Read the bottom northing;Estimate tenths up the square;Join the three easting digits then three northing digits
2.6|sequence|Measure a winding path||Break the path into measurable sections;Measure all sections in map centimetres;Add the map lengths;Multiply by ground metres per centimetre;Label the result and check its size
2.7|sort|Map-reading checks|Key;Scale;Grid;Date|What does the dashed line mean?>0;How far does 2 cm represent?>1;Where is this square?>2;Could a new path be missing?>3
2.8|sort|Height or steepness?|Elevation;Gradient evidence|Summit is 300 m above sea level>0;Path rises 40 m over 100 m>1;Valley floor is 80 m above sea level>0;Contours are closer at the same scale and interval>1
2.9|sort|Coordinate dispatch|North-east;North-west;South-east;South-west|10°N, 20°E>0;15°N, 30°W>1;25°S, 40°E>2;5°S, 10°W>3
3.1|sort|Island sorting office|Great Britain;Island of Ireland|England>0;Northern Ireland>1;Scotland>0;Wales>0
3.2|sort|Switch the map layer|Political;Physical|Country boundary>0;Capital-city status>0;Mountain range>1;River>1;Coastal cliff>1
3.3|sequence|Build the rainfall mechanism||Moist air approaches high ground;Air rises on the windward slope;Rising air cools;Water vapour may condense into droplets;Precipitation may fall if conditions allow
3.4|sort|Venn diagram without double counting|Walk only;Cycle only;Both|Amina walks but does not cycle>0;Ben cycles but does not walk>1;Chen walks and cycles>2;Dana cycles and walks>2
3.5|sort|Settlement planner|Nucleated;Linear;Dispersed|Buildings cluster around a crossroads>0;Homes form a row beside a road>1;Separated farms spread among fields>2;Compact group around a market square>0
3.6|sort|Quality-of-life evidence|Supports a specific comparison;Overclaims from one measure|Clinic journey falls from 30 to 10 minutes>0;Higher average income means every person is happier>1;Bus frequency rises from 2 to 4 per hour>0;A new park solves every housing problem>1
3.7|sort|City function connections|Transport;Culture;Government;Housing|Station connects commuters to work>0;Museum hosts an exhibition>1;Council office provides local services>2;Apartment building provides homes>3
3.8|sort|Label the UK viewpoint|Import of goods;Export of goods;Movement of people;Information|Goods arrive from abroad>0;UK-made goods leave for another country>1;Visitors fly into the UK>2;An email confirms a delivery>3
4.1|sort|Observation or interpretation?|Observation;Interpretation / claim|Parallel scratches appear on exposed rock>0;Moving ice probably made the scratches>1;The valley has a broad floor>0;Ice vanished exactly 9,000 years ago>1
4.2|sort|Ice-accountant challenge|Store grows;Store shrinks;No net change|Add 9, lose 5>0;Add 4, lose 7>1;Add 6, lose 6>2;Add 2, lose 8>1
4.3|sort|Name the action|Plucking;Transport;Abrasion;Deposition|Ice removes a loosened rock block>0;Ice carries debris downhill>1;Debris scrapes the bed beneath moving ice>2;Melting ice releases its debris>3
4.4|sort|Choose the view|Plan view;Cross-section|Shows which way the valley bends>0;Shows floor width and side slopes>1;Looks down from above>0;Slices across the valley>1
4.5|sort|Mountain guide clues|Corrie;Arête|Armchair-like glacial hollow>0;Narrow ridge between glacial hollows>1;Steep back wall around a hollow>0;Sharp remaining divide after erosion on both sides>1
4.6|sequence|From rock to deposit||Rock is loosened and removed;Ice incorporates and carries debris;Moving ice transports the load;Ice melts at a margin;Released debris remains as a deposit
4.7|sort|Visitor-management evidence|Pressure measure;Condition measure;Proposed response|Visitors per hour>0;Width of bare ground beside a path>1;Redirect some visitors to another path>2;Number of walkers in each group>0;Depth of erosion on a path>1
4.8|sort|Water store or flow?|Stored water;Input;Output|Ice already in the glacier>0;New snowfall added to the glacier>1;Meltwater leaving the glacier>2;Ice remaining at the end of the year>0
5.1|sequence|Follow the model river||Begin at the upland source;A tributary joins at the first confluence;The combined river passes the model town;The river reaches its tidal stretch;Water reaches the sea at the mouth
5.2|sort|Name the water process|Evaporation;Condensation;Precipitation;Infiltration|Liquid water becomes vapour>0;Vapour forms liquid droplets>1;Rain falls from a cloud>2;Water enters the soil>3
5.3|sort|Basin vocabulary|Watershed;Tributary;Confluence;Outlet|High divide separating drainage areas>0;Smaller stream joining a main river>1;Meeting point of two streams>2;Point through which basin water leaves>3
5.4|sort|Sediment action sorter|Erosion;Transport;Deposition|Material is removed from a bank>0;A grain is carried downstream>1;Sand settles on a bar>2;A bed particle is dislodged>0;Fine particles travel in suspension>1
5.5|sequence|Create an oxbow lake||Meander bends grow and the neck narrows;A shorter channel breaks through the neck;More flow takes the shorter route;Sediment blocks the old bend's entrances;An isolated curved water body remains
5.6|sort|Water negotiation briefing|Demand;Supply;Consequence / trade-off|Farm requests 30 units>0;Reservoir can release 80 units>1;A factory reduces production after a cut>2;Homes request 20 units>0
5.7|sort|Estuary hearing|Navigation evidence;Habitat evidence;Both / shared context|Channel depth through a tidal cycle>0;Location of feeding grounds>1;Sediment movement after dredging>2;Distribution of sensitive species>1
5.8|sequence|Explain one possible flood pathway||Prolonged rain leaves soil saturated;More rainfall becomes rapid surface runoff;River flow rises beyond channel capacity;Water spreads onto normally dry land;Homes or roads in its path may be affected
5.9|sort|Organise a fictional flood log|Cause;Immediate impact;Later impact;Response|Prolonged rainfall>0;Homes flooded on the day>1;Repairs continue for four weeks>2;Warnings issued to residents>3;A temporary road diversion opens>3
5.10|sort|What does the measure do?|Helps people respond;Stores water;Blocks / redirects flow|Flood warning>0;Suitable flood-storage area>1;Flood wall>2;Evacuation planning>0
`;
export const geographyBoardSets=Object.fromEntries(sets.trim().split('\n').map(line=>{
 const [code,type,title,labels,data]=line.split('|');
 return [code,{type,title,groups:labels?labels.split(';'):[],items:data.split(';').map((value,index)=>{
  const [label,group]=value.split('>');return {id:String(index),label,answer:type==='sort'?Number(group):index};
 })}];
}));

export function boardFor(code,index,p,mission){
 const base=geographyBoardSets[code];
 const round={prompt:p.prompt,choices:[p.correct,p.wrong],answer:0,explanation:p.explanation};
 // Applied sessions start from a new case, not the introductory sorting set.
 const twist=geographyTwists[`${code}.${index}`];
 const activity=index===0?{...base,items:base.items.map(x=>({...x}))}:{type:'decision',title:p.objective,rounds:twist?[round,twist]:[round]};
 if(code==='2.5')Object.assign(activity,{type:'pin',title:'Send the rescue location',target:[[6,2],[3,8],[8,1]][index],square:[23,45]});
 if(code==='5.6')Object.assign(activity,{type:'allocation',title:'Water council',limit:index===0?100:80,allocations:[30,40,20,20],labels:['Homes','Farms','Industry','River ecosystem'],minimum:[20,0,0,20],unit:'water units'});
 if(code==='5.10')Object.assign(activity,{type:'budget',title:'Choose a flood package',limit:index===0?60:90,costs:[10,40,80],labels:['Warnings','Wetland storage','Wall'],notes:['Supports preparation; does not stop water.','May store water if the site is suitable.','Can exclude water locally but may transfer risk.']});
 return {...activity,id:`${code}.${index}`,question:round,...(index?{source:mission.source}:{}),
  rationale:p.model,followup:p.explanation,
  facilitation:'Everyone predicts from their seat first. Invite a pupil to enter the class choice, or tap it yourself. Ask a different pupil for the reason. Check, discuss the feedback, then retry one disputed choice. No speed score.',
  challenge:index?'Explain which detail would change your decision. State what still needs checking.':'Change one card or one condition. Ask a partner to explain how the answer would change.'};
}

// Optional practice revisits concrete ideas, not generic advice about answering.
export function boardQuestions(code,index,p){
 const base=geographyBoardSets[code];
 const source=[p.model];
 if(code==='2.5'){
  const [x,y]=[[6,2],[3,8],[8,1]][index];
  return [{question:[`In square 2345, locate ${x} tenths east and ${y} tenths north. Which message fits?`,[`23${x}45${y}`,`23${y}45${x}`],'Read eastings and their tenths first, then northings and their tenths.'],source}];
 }
 if(base.type==='sort')return base.items.slice(index,index+3).map(item=>({
  question:[`Classify this clue: ${item.label}`,[base.groups[item.answer],base.groups[(item.answer+1)%base.groups.length]],`${item.label} belongs with ${base.groups[item.answer]}. Explain the defining feature before choosing.`],source
 }));
 return base.items.slice(index,Math.min(index+3,base.items.length-1)).map((item,i)=>({
  question:[`In the ${base.title.toLowerCase()} sequence, what follows “${item.label}”?`,[base.items[item.answer+1].label,item.label],'Follow the supplied sequence; repeating the current step does not advance the explanation.'],source:['Sequence to study: '+base.items.map(x=>x.label).join(' → ')]
 }));
}
