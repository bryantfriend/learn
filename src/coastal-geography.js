import {shapeCollection,stationShape} from './coastal-shapes.js';
export let worldId='uk';
export function setWorldProjection(id){worldId=id;}
export const project=(lon,lat)=>worldId==='kyrgyzstan'?({x:(lon-69)*105,y:(43.3-lat)*155}):({x:(lon+12)*65,y:(61-lat)*95});
export const regions=[
 {id:'england',name:'England',round:1,capital:'London',label:[-.9,53.1],colour:'#b6d797',source:'https://en.wikipedia.org/wiki/England',facts:['London is the capital of both England and the United Kingdom.','England, Wales and Scotland share the island of Great Britain.','The River Thames flows through London towards the North Sea.']},
 {id:'wales',name:'Wales',round:4,capital:'Cardiff',label:[-4.25,52.3],colour:'#b7d5ae',source:'https://en.wikipedia.org/wiki/Wales',facts:['Cardiff is the capital of Wales; its Welsh name is Caerdydd.','Wales shares a land border with England and has a coast on the Irish Sea.','Cardiff Castle stands in the heart of the Welsh capital.']},
 {id:'scotland',name:'Scotland',round:6,capital:'Edinburgh',label:[-4.4,57.35],colour:'#a7cdb2',source:'https://en.wikipedia.org/wiki/Scotland',facts:['Edinburgh is the capital of Scotland.','Scotland occupies the northern part of Great Britain.','Edinburgh Castle stands on Castle Rock, the remains of an ancient volcano.']},
 {id:'northern-ireland',name:'Northern Ireland',round:10,capital:'Belfast',label:[-7.1,54.8],colour:'#d3d9a1',source:'https://en.wikipedia.org/wiki/Northern_Ireland',facts:['Belfast is the capital of Northern Ireland.','Northern Ireland is part of the United Kingdom; the Republic of Ireland is a separate country.','Northern Ireland and the Republic of Ireland share the same island.']},
 {id:'ireland',name:'Republic of Ireland',round:10,capital:'Dublin',label:[-8.3,53.2],colour:'#b2d393',source:'https://en.wikipedia.org/wiki/Republic_of_Ireland',facts:['Dublin is the capital of the Republic of Ireland.','The Irish Sea separates Ireland from Great Britain.','The Republic of Ireland shares a land border with Northern Ireland.']},
 {id:'france',name:'France',round:16,capital:'Paris',label:[2.0,47.9],colour:'#dfd4a9',source:'https://en.wikipedia.org/wiki/France',facts:['Paris is the capital of France, on the River Seine.','The English Channel separates southern England from northern France.','The Channel Tunnel joins Folkestone in England to Coquelles, near Calais in France.']},
 {id:'belgium',name:'Belgium',round:19,capital:'Brussels',label:[4.6,50.4],colour:'#b9d6ca',source:'https://en.wikipedia.org/wiki/Belgium',facts:['Brussels is the capital of Belgium.','Belgium shares borders with France, the Netherlands, Germany and Luxembourg.','Belgium has a coast on the North Sea.']},
 {id:'netherlands',name:'Netherlands',round:22,capital:'Amsterdam',label:[5.4,52.5],colour:'#dec6a5',source:'https://en.wikipedia.org/wiki/Netherlands',facts:['Amsterdam is the capital of the Netherlands; the government is based in The Hague.','The Netherlands borders the North Sea, Belgium and Germany.','Amsterdam is famous for its network of canals.']},
 {id:'germany',name:'Germany',round:25,capital:'Berlin',label:[10.7,51.2],colour:'#c4cf9d',source:'https://en.wikipedia.org/wiki/Germany',facts:['Berlin is the capital of Germany.','The River Rhine flows through Germany towards the Netherlands.','Germany shares land borders with both Belgium and the Netherlands.']}
];
const cities=[
 ['London',-.1276,51.5072,'england',1,'capital'],['Oxford',-1.2577,51.752,'england',1],['Bristol',-2.5879,51.4545,'england',1],['Birmingham',-1.89,52.486,'england',2],['Manchester',-2.2426,53.4808,'england',3],
 ['Cardiff',-3.1791,51.4816,'wales',4,'capital'],['Swansea',-3.943,51.621,'wales',4],['Bangor',-4.128,53.228,'wales',5],
 ['Edinburgh',-3.1883,55.9533,'scotland',6,'capital'],['Glasgow',-4.2518,55.8642,'scotland',6],['Inverness',-4.2247,57.4778,'scotland',7],['Aberdeen',-2.0943,57.1497,'scotland',8],
 ['Liverpool',-2.9916,53.4084,'england',9],['Holyhead',-4.633,53.309,'wales',9],
 ['Belfast',-5.93,54.597,'northern-ireland',10,'capital'],['Dublin',-6.2603,53.3498,'ireland',10,'capital'],['Cork',-8.4756,51.8985,'ireland',11],['Galway',-9.0568,53.2707,'ireland',12],
 ['Newcastle',-1.6178,54.9783,'england',13],['Derry / Londonderry',-7.31,54.997,'northern-ireland',14],['Southampton',-1.4044,50.9097,'england',15],
 ['Paris',2.3522,48.8566,'france',16,'capital'],['Coquelles',1.815,50.936,'france',16,'tunnel'],['Folkestone',1.174,51.081,'england',16,'tunnel'],['Lyon',4.8357,45.764,'france',17],['Bordeaux',-.5792,44.8378,'france',18],
 ['Brussels',4.3517,50.8503,'belgium',19,'capital'],['Antwerp',4.4025,51.2194,'belgium',20],['Ghent',3.7167,51.0543,'belgium',21],
 ['Amsterdam',4.9041,52.3676,'netherlands',22,'capital'],['Rotterdam',4.4777,51.9244,'netherlands',23],['The Hague',4.3,52.07,'netherlands',24],
 ['Berlin',13.405,52.52,'germany',25,'capital'],['Cologne',6.96,50.9375,'germany',26],['Hamburg',9.9937,53.5511,'germany',27]
];
export const harbourWaterfronts={2:'Bristol Harbour',5:'Cardiff Bay',6:'Swansea Bay',7:'Menai Strait',12:'River Mersey',13:'Holyhead Harbour',14:'Belfast Lough',15:'Dublin Bay',16:'Cork Harbour',17:'Galway Bay',19:'River Foyle',20:'Southampton Water',23:'Folkestone Harbour',25:'Tidal River Garonne',27:'Tidal River Scheldt',30:'Rhine–Meuse delta',31:'Scheveningen Harbour',34:'Tidal River Elbe'};
export const stationShapes=shapeCollection.map(s=>s.id);
export const geoStops=cities.map(([name,lon,lat,region,round,special],id)=>({id,name,...project(lon,lat),region,round,kind:'town',capital:special==='capital',tunnel:special==='tunnel',coastal:Boolean(harbourWaterfronts[id]),waterfront:harbourWaterfronts[id]??null,land:['england','wales','scotland'].includes(region)?'great-britain':['ireland','northern-ireland'].includes(region)?'ireland':'europe',shape:stationShape(id,round,id===cities.findIndex(c=>c[4]===round))}));
export const unlockRounds={road:1,rail:8,highspeed:20,ferry:10,flight:13,tunnel:18};
export const vehicleLabels={road:'Bus',rail:'Train',highspeed:'High-speed train',ferry:'Boat',flight:'Flight',tunnel:'Tunnel train'};
export const activeForRound=round=>geoStops.filter(s=>s.round<=round).map(s=>s.id);
export function facilitiesForRound(round){if(worldId==='kyrgyzstan')return round>=13?{0:['airport'],7:['airport'],18:['airport'],21:['airport']}:{};const facilities={};if(round>=10)for(const id of [12,13,14,15])facilities[id]=['port'];if(round>=13)for(const id of [0,8,14,15])facilities[id]=[...(facilities[id]??[]),'airport'];if(round>=16)facilities[21]=['airport'];return facilities;}
export function discoveryForRound(round,seed){const newly=regions.filter(r=>r.round===round),region=newly.length?newly[seed%newly.length]:regions.filter(r=>r.round<=round)[seed%regions.filter(r=>r.round<=round).length];return {region:region.id,title:(newly.length?'Discover ':'Map moment · ')+region.name,text:region.facts[(seed>>>8)%3],source:region.source,newlyUnlocked:newly.length>0};}
export const waterways=[
 ['North Sea',3,55,1],['English Channel',-.5,50.2,1],['Atlantic Ocean',-11,54,1],['Bristol Channel',-4.5,51.35,4],['Irish Sea',-4.95,53.8,4],['Celtic Sea',-8,50,10],['North Channel',-5.5,55.15,10],['Bay of Biscay',-5.3,46.9,16],['Strait of Dover',1.75,51.0,16],['Mediterranean Sea',5,43.1,16],['Baltic Sea',13.7,55.4,25]
];
export const rivers=[
 {name:'Thames',region:'england',points:[[-1.8,51.65],[-1.25,51.55],[-.6,51.5],[-.1,51.5],[.8,51.5]]},
 {name:'Severn',region:'wales',points:[[-3.75,52.48],[-2.8,52.7],[-2.25,52.2],[-2.5,51.65],[-3.1,51.45]]},
 {name:'Clyde',region:'scotland',points:[[-3.65,55.4],[-4.25,55.85],[-4.8,55.98]]},
 {name:'Liffey',region:'ireland',points:[[-6.75,53.15],[-6.55,53.35],[-6.25,53.35]]},
 {name:'Seine',region:'france',points:[[3.6,47.5],[2.35,48.86],[1.3,49.1],[.1,49.45]]},
 {name:'Rhine',region:'germany',points:[[8.2,48.8],[7.6,50],[6.95,50.94],[6.1,51.85],[4.4,51.9]]}
];
export const landmarks=[
 ['Big Ben',-.12,51.50,'england','clock'],['Stonehenge',-1.83,51.18,'england','stones'],['White Cliffs of Dover',1.37,51.13,'england','cliffs'],['Lake District',-3.1,54.45,'england','mountain'],
 ['Cardiff Castle',-3.18,51.48,'wales','castle'],['Eryri / Snowdonia',-4.07,53.07,'wales','mountain'],
 ['Edinburgh Castle',-3.20,55.95,'scotland','castle'],['Loch Ness',-4.5,57.3,'scotland','lake'],['Ben Nevis',-5,56.8,'scotland','mountain'],
 ["Giant's Causeway",-6.5,55.24,'northern-ireland','stones'],['Cliffs of Moher',-9.43,52.97,'ireland','cliffs'],
 ['Eiffel Tower',2.295,48.858,'france','tower'],['Mont-Saint-Michel',-1.51,48.636,'france','castle'],['Atomium',4.341,50.895,'belgium','atoms'],['Dutch windmills',4.64,51.88,'netherlands','windmill'],['Brandenburg Gate',13.378,52.516,'germany','gate']
];
