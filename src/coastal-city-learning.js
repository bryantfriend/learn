import {geoStops,regions,worldId} from './coastal-geography.js';
import {stationArt} from './coastal-station-art.js';
// Wikipedia city articles checked for the geography facts. Correct answers are first.
export const cityDetails=[
 ['London','River Thames','Clock tower and parliament buildings','London is the capital of which two places?','England and the United Kingdom','Wales and France','Scotland and Belgium'],
 ['Oxford','River Cherwell','University library','What is the University of Oxford especially known for?','Being the oldest university in the English-speaking world','Being a sea port','Being built inside a volcano'],
 ['Bristol','River Avon','Suspension bridge','What does Clifton Suspension Bridge cross?','The Avon Gorge','The English Channel','The River Seine'],
 ['Birmingham','Canals','Public library','Which waterways helped move industrial goods around Birmingham?','Canals','Ocean straits','Glaciers'],
 ['Manchester','River Irwell','Town hall','Which industry helped Manchester grow during the Industrial Revolution?','Cotton textiles','Tropical banana farming','Pearl diving'],
 ['Cardiff','River Taff','Castle','What is the Welsh name for Cardiff?','Caerdydd','Eryri','Abertawe'],
 ['Swansea','River Tawe','Museum','Which metal industry gave Swansea the nickname Copperopolis?','Copper','Gold','Silver'],
 ['Bangor,_Gwynedd','Menai Strait','Pier','Which island is across the Menai Strait from Bangor?','Anglesey','Sicily','Iceland'],
 ['Edinburgh','Water of Leith','Castle','What natural feature is beneath Edinburgh Castle?','An ancient volcanic rock','A coral reef','A sand dune'],
 ['Glasgow','River Clyde','University','Which country is home to the University of Glasgow?','Scotland','France','Germany'],
 ['Inverness','River Ness','Castle','Which nearby lake feeds the River Ness?','Loch Ness','Lake Geneva','Lake Garda'],
 ['Aberdeen','River Dee','University building','Which stone gives Aberdeen its Granite City nickname?','Granite','Chalk','Marble'],
 ['Liverpool','River Mersey','Waterfront office building','Which famous band formed in Liverpool?','The Beatles','ABBA','Daft Punk'],
 ['Holyhead','Irish Sea','Church','On which island is Holyhead located?','Holy Island, beside Anglesey','Isle of Wight','Isle of Skye'],
 ['Belfast','River Lagan','Museum','Which famous ship was built in Belfast?','Titanic','Mayflower','Santa Maria'],
 ['Dublin','River Liffey','Pedestrian bridge','Which country has Dublin as its capital?','Republic of Ireland','Northern Ireland','Wales'],
 ['Cork_(city)','River Lee','Cathedral','What forms an island around the centre of Cork?','Two channels of the River Lee','The English Channel','Two arms of the River Rhine'],
 ['Galway','River Corrib','Stone arch','Which ocean is beside Galway Bay?','Atlantic Ocean','Pacific Ocean','Indian Ocean'],
 ['Newcastle_upon_Tyne','River Tyne','Road bridge','Which part of England is Newcastle upon Tyne in?','North-east','South-west','South-east'],
 ['Derry','River Foyle','Pedestrian bridge','Which historic feature surrounds the old city of Derry?','City walls','A glacier','A coral reef'],
 ['Southampton','Southampton Water','Medieval gateway','From which English port did Titanic begin its 1912 maiden voyage?','Southampton','Manchester','Oxford'],
 ['Paris','River Seine','Iron tower','Which famous art museum is in Paris?','Louvre','Titanic Belfast','National Waterfront Museum'],
 ['Coquelles','English Channel','Rail tunnel terminal','Coquelles is at which end of the Channel Tunnel?','French end','Welsh end','Scottish end'],
 ['Folkestone','English Channel','Harbour promenade','Folkestone connects to France through which railway link?','Channel Tunnel','Gotthard Tunnel','Severn Tunnel'],
 ['Lyon','River Rhône','Basilica','Which two rivers meet in Lyon?','Rhône and Saône','Thames and Clyde','Rhine and Liffey'],
 ['Bordeaux','River Garonne','Historic square','Which product is the Bordeaux region famous for?','Wine','Coffee beans','Cocoa beans'],
 ['Brussels','River Senne','Atom-shaped building','The Atomium is inspired by the structure of which material?','Iron crystal','A snowflake','A seashell'],
 ['Antwerp','River Scheldt','Railway station','Antwerp is famous for trading which gemstones?','Diamonds','Opals','Emeralds'],
 ['Ghent','River Leie (Lys)','Castle','Which two rivers meet in Ghent?','Scheldt and Leie','Seine and Thames','Clyde and Ness'],
 ['Amsterdam','River Amstel','Canal-side houses','Which city houses the Dutch government, although Amsterdam is the capital?','The Hague','Rotterdam','Antwerp'],
 ['Rotterdam','Nieuwe Maas','Bridge','Which transport role is Rotterdam especially known for?','Major sea port','Mountain ski resort','Desert caravan stop'],
 ['The_Hague','North Sea','Government buildings','Which national government is based in The Hague?','Netherlands','Belgium','Germany'],
 ['Berlin','River Spree','Monumental gateway','Which barrier once divided Berlin?','Berlin Wall','Hadrian’s Wall','Great Wall of China'],
 ['Cologne','River Rhine','Cathedral','Which architectural style is Cologne Cathedral known for?','Gothic','Modern glass skyscraper','Ancient Greek temple'],
 ['Hamburg','River Elbe','Concert hall','How does the Elbe help Hamburg’s transport connections?','It connects the port towards the North Sea','It connects directly to the Pacific Ocean','It is a desert road']
];
import {kgCities} from './coastal-kyrgyzstan-data.js';
const kgWaterArticles={'Chuy River':'Chu_(river)','Naryn River':'Naryn_(river)','Talas River':'Talas_(river)','Issyk-Kul':'Issyk-Kul'};
const kgWaterSource=id=>kgWaterArticles[kgCities[id][10]]?'https://en.wikipedia.org/wiki/'+kgWaterArticles[kgCities[id][10]]:cityWikipedia(id);
export const cityWikipedia=id=>worldId==='kyrgyzstan'?'https://en.wikipedia.org/wiki/'+encodeURIComponent(kgCities[id][0].replaceAll(' ','_')):'https://en.wikipedia.org/wiki/'+encodeURIComponent(cityDetails[id][0]);
export function cityQuestions(id){const s=geoStops[id],d=worldId==='kyrgyzstan'?[kgCities[id][0],kgCities[id][10],({0:'City square',1:'Ancient tower',2:'Train station',6:'Petroglyphs',7:'Mosque',8:'Museum',12:'Craft tradition',14:'Mineral spring',15:'Reservoir',17:'Bridge',18:'Mountain landscape',19:'Ancient tower',20:'Market',21:'Flowers',24:'Mountain pass',27:'Forest',28:'Forest'}[id]??'Mountain landscape'),'Which country contains '+s.name+'?','Kyrgyzstan','United Kingdom','France']:cityDetails[id],r=regions.find(r=>r.id===s.region),art=stationArt[id],q=(topic,prompt,options,explanation)=>({id:'city:'+id+':'+topic,city:id,prompt,options,explanation,source:topic==='water'&&worldId==='kyrgyzstan'?kgWaterSource(id):topic==='water'&&id===0&&worldId!=='kyrgyzstan'?'https://en.wikipedia.org/wiki/River_Thames':cityWikipedia(id)});
 const alternatives=stationArt.filter(a=>a.id!==id&&geoStops[a.id].region!==s.region).slice((id%3),id%3+2),types=['Lighthouse','Sports stadium','Natural waterfall','Windmill','Aqueduct','Botanical garden'],waterOptions=d[1].startsWith('River')?['River Amazon','River Nile']:['Pacific Ocean','Mediterranean Sea'];
 return [q('country',(worldId==='kyrgyzstan'?'In which region is ':'In which country is ')+s.name+'?', [r.name,...regions.filter(x=>x.id!==r.id).slice(id%3,id%3+2).map(x=>x.name)],s.name+' is in '+r.name+'.'),q('landmark','Which landmark belongs to '+s.name+'?', [art.landmark,...alternatives.map(a=>a.landmark)],art.landmark+' is associated with '+s.name+'.'),q('type','What kind of landmark is '+art.landmark+'?', [d[2],...types.slice(id%4,id%4+2)],art.landmark+' is a '+d[2].toLowerCase()+' in '+s.name+'.'),q('water',(worldId==='kyrgyzstan'&&[21,22,23,28,34].includes(id)?'Which landscape belongs on ':'Which waterway belongs on ')+s.name+'’s geography card?', [d[1],...waterOptions],s.name+' is associated with '+d[1]+'.'),q('fact',d[3],d.slice(4),d[4]+'. Explore '+s.name+' on Wikipedia to learn more.')];
}
