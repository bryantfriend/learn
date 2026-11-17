const art = (name, alt) => ({image:`illustrations/${name}.webp`, alt, caption:'Illustration for discussion; it does not show a particular place.'});
const f = (title, lines, picture, mode='listen', extra={}) => ({title, lines, mode, geoArt:picture, conceptLayout:'artwork', ...extra});
const q = (title, lines, picture, answerText, explanation) => f(title,lines,picture,'think',{type:'question',answerText,explanation,responseHint:false});
const stage = (id,title,durationMinutes,start,notes,frames) => ({id,title,durationMinutes,timeRange:`${start}–${start+durationMinutes} min`,notes,frames});
const generated = (name, alt) => ({image:`welcome-geography/${name}.png`, alt, caption:"Original generated illustration; an imagined example."});
const landscape=generated('physical','A coastline, mountains and the sea.');
const city=generated('human','A town with shops, a bus and a train.');
const river=generated('environment','People restoring a river habitat.');
const energy=generated('impact','A fish among plastic waste in the ocean.');
const market=generated('inequality','Two imagined neighborhoods with different services and housing.');
export const welcomeGeographyLesson={
 id:'g7-welcome-to-geography',title:'Welcome to Geography: Our Changing World',durationMinutes:40,geoConcept:true,
 catalog:{subjectId:'geography',grades:[7],classes:['7a','7b'],quarter:'Q2',unit:'Quarter 2 · Lesson 1',order:1},
 worksheet:'./worksheets/welcome-geography.html',
 worksheetTranslations:[['Русский','./worksheets/welcome-geography-ru.html'],['Türkçe','./worksheets/welcome-geography-tr.html'],['简体中文','./worksheets/welcome-geography-zh-Hans.html'],['Geography English · 中文支持','./worksheets/geography-english-chinese.html']],
 openingScript:'One 40-minute lesson. Students can speak, point or write. Print the Your Turn worksheet from this lesson. The source textbook contains historical poverty and population figures; use the concepts rather than treating its numbers as current.',
 stages:[
 stage('start','Think like a geographer',4,0,'Invite observations and questions. Geography studies Earth, places, people and their relationships.',[
 f('Welcome to geography',['Look closely: what can you see?','What questions could you ask about this place?'],landscape,'pair',{timerSeconds:60}),
 f('Geography connects people and planet',['We study places, natural processes and how people live.','We also ask how people and the environment affect each other.'],landscape)
 ]),
 stage('strands','Three strands of geography',8,4,'Explain that strands overlap: a river is physical, but people use and alter it. Ask pupils for examples before revealing.',[
 f('Physical geography: what Earth is like',['Explore mountains, rivers, oceans, weather, climate and rocks.','Natural processes include erosion, earthquakes and volcanoes.'],landscape),
 f('Human geography: how and where people live',['Explore settlements, population, jobs, transport and differences between places.'],city),
 f('Environmental geography: people and surroundings',['Investigate how people affect environments and how environments affect people.','For example: pollution, habitats and protecting nature.'],river),
 q('Which strand?',['Show 1 = physical, 2 = human, 3 = environmental.','Clouds forming · the biggest cities · plastic in the ocean'],river,'Clouds: 1 · cities: 2 · plastic: 3','Clouds are a natural process; cities concern settlements; plastic pollution connects human actions and the environment. Some topics cross strands.')
 ]),
 stage('change','Theme 1: change',6,12,'Explain that plates move slowly, while earthquakes and eruptions can happen suddenly. Rivers erode land and rocks weather into material that contributes to soil.',[
 f('Earth is always changing',['Moving plates can cause earthquakes and volcanic eruptions.','Rivers wear away rock and carry sediment.','People and populations change too.'],generated('change','A volcano erupts and lava changes the landscape.')),
 q('Natural or human-caused?',['A river erodes its bank. A forest is cleared for farms.','Which change is natural? Which is caused by people?'],river,'River erosion is natural; forest clearing is human-caused.','Both change the landscape. A change can have more than one cause, and people can also alter river erosion.')
 ]),
 stage('impact','Theme 2: impact',6,18,'Impact means an effect, positive or negative. Invite examples in both directions.',[
 f('An impact is an effect',['Earth provides water, soil, fuels and metals.','Earthquakes and floods can harm people.','People can affect habitats, air, water and climate.'],energy),
 q('Trace an impact',['A plastic bottle enters a river and reaches the sea.','What might happen to wildlife? How could people reduce the problem?'],river,'Animals may swallow plastic or become entangled; reduce litter and improve waste collection.','An action can affect places downstream. Preventing waste from entering rivers helps, alongside other solutions.')
 ]),
 stage('inequality','Theme 3: inequality',6,24,'Inequality means unequal access to resources or opportunities. Poverty and wealth vary within and between places. Do not assume all people in a country have the same experience.',[
 f('Inequality: opportunities are not equal',['People have different access to income, housing, food, education and healthcare.','Geographers ask where differences occur and why.'],market),
 q('Why might inequality matter?',['Imagine two communities: one has a nearby clinic; the other must travel far.','How might this difference affect daily life?'],city,'Travel time and cost can make healthcare harder to access.','Access depends on many factors, including affordability, transport and availability. Ask what evidence would be needed to compare real places.')
 ]),
 stage('practice','Your Turn: apply your learning',7,30,'Open and print the Your Turn worksheet from this slide or Teacher tools. Allow students to start in class and finish later. Discuss that the £4.50 prompt is a historical textbook comparison, not a current poverty measure. No student needs to disclose personal finances.',[
 f('Your Turn',['Use the printable worksheet to practise the three strands and themes.','Complete as much as you can; explain your thinking.'],landscape,'think',{worksheetLink:true,timerSeconds:300}),
 q('Check together',['Name the three themes. Give one example of an impact.'],river,'Change · impact · inequality','Examples include river erosion (change), plastic harming wildlife (impact), and unequal access to healthcare (inequality).')
 ]),
 stage('exit','Exit ticket',3,37,'Listen for a strand, a theme and a reason. Accept thoughtful examples that cross categories.',[
 f('One final geography question',['Choose a place you know. Name one natural feature and one human feature.','Describe one change or impact there.'],city,'pair',{timerSeconds:60}),
 f('You are thinking like a geographer',['Notice a place. Ask a question. Explain connections.'],landscape,'listen',{final:true})
 ])
 ]
};





