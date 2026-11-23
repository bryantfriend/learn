const art=(name,alt,caption)=>({image:`geography-kit/${name}.jpg`,contain:true,alt,caption:`${caption} · AI-generated illustration`});
const maps=art('town-map','A student studies a town map at a park entrance.','Town map at a park entrance');
const compass=art('compass','A hand holds a compass marked north, east, south and west.','Handheld compass');
const views=art('photo-views','A ground-level view of a Siberian herding camp and an elevated view of reed houses and waterways.','Siberian herding camp (left) and Iraqi marshes (right)');
const satellites=art('earth-orbit','An Earth-observing satellite above a hurricane.','Earth-observing satellite and hurricane');
const globe=art('virtual-globe','A student explores mountains and a winding river on a virtual globe.','River valley on a virtual globe');
const gis=art('gis-route','A digital street map with location markers and a blue delivery route.','Mapped locations and a delivery route');
const f=(title,lines,picture,mode='listen',extra={})=>({title,lines,mode,geoArt:picture,conceptLayout:'artwork',...extra});
const q=(title,lines,picture,answerText,explanation)=>f(title,lines,picture,'think',{type:'question',answerText,explanation,responseHint:false,allowHideAnswer:true});
const stage=(id,title,durationMinutes,start,notes,frames)=>({id,title,durationMinutes,timeRange:`${start}–${start+durationMinutes} min`,notes,frames});
const sort={id:'kit-sort',type:'sort',compact:true,title:'Match the tool to its job',groups:['Map','Compass','Aerial photograph','Satellite image','GIS'],items:[{id:'streets',label:'Shows streets from above',answer:0},{id:'direction',label:'Helps find north',answer:1},{id:'drone',label:'View from a drone',answer:2},{id:'orbit',label:'Sensor observes Earth from orbit',answer:3},{id:'layers',label:'Displays and analyses mapped data',answer:4}],rationale:'Different tools answer different questions. A GIS combines location with data; a satellite sensor observes from orbit.',challenge:'Can two tools help with the same investigation? Explain.'};
export const geographyKitLesson={
 id:'g7-geography-kit',title:'What’s in Your Geography Kit?',durationMinutes:70,geoConcept:true,
 catalog:{subjectId:'geography',grades:[7],classes:['7a','7b'],quarter:'Q2',unit:'Quarter 2 · Lesson 2',order:2},
 worksheet:'./worksheets/geography-kit.html',
 worksheetTranslations:[['Русский','./worksheets/geography-kit-ru.html'],['Türkçe','./worksheets/geography-kit-tr.html'],['简体中文','./worksheets/geography-kit-zh-Hans.html']],
 openingScript:'Teach from textbook pages 8–9. Pause on each of the six generated illustrations and give students time to point out details and explain what each tool can show. Plan 56 minutes through the board challenge and worksheet, then allow 14 minutes for discussion and answer review. For two shorter periods, pause after the Google Earth section at minute 35. Print the Your Turn worksheet before class. No student devices are needed.',
 stages:[
 stage('launch','Explore from your desk',5,0,'Invite students to name ways to find out about a place. Explain that each tool gives different evidence.',[
 f('What is in a geography kit?',['How could you explore a place without going there?','Think, then tell a partner one tool and what it can show.'],maps,'pair',{timerSeconds:60}),
 f('Today we will choose the right tool',['Maps · compass · photographs · satellite images · Google Earth · GIS','Explain what each tool shows and why it helps.'],maps)
 ]),
 stage('maps','Maps and compass',10,5,'A map is a representation of a place seen from above; maps use symbols and may show themes. A compass needle indicates magnetic north, which can differ from true north. The Sun rises roughly east and sets roughly west, not precisely due east and west every day.',[
 f('Maps show places from above',['A map can show the world or a few streets.','A thematic map can show information such as rainfall.','Find maps in parks, in atlases, on phones and on computers.'],maps),
 q('Read the town map',['Point to the river and trace a road.','What can the map tell you about how they connect?'],maps,'The map shows where the road runs in relation to the river.','Trace both features and look for a crossing. In a real map, check the legend and scale before using it to plan a route.'),
 f('A compass helps us find direction',['The four main directions are north, east, south and west.','A compass needle points towards magnetic north.','The Sun rises roughly in the east and sets roughly in the west.'],compass),
 q('Look at the compass face',['Find N, E, S and W.','Imagine facing north. Which way would you turn to face east?'],compass,'Turn right a quarter turn.','Ask students to point to the east mark, then show the turn with their hands.'),
 q('Which way?',['On a north-up map, a park is above a school.','Is the park north, east, south or west of the school?'],maps,'North','On a north-up map, up represents north. Always check the map’s direction indicator; not all maps are north-up.')
 ]),
 stage('photos','Photographs and viewpoints',9,15,'Ground-level photos show a place from the photographer’s viewpoint. Aerial photos are taken from above by a camera in a plane, balloon or drone. Use the generated images to practise reading viewpoints.',[
 f('Two ways to look',['A ground-level photograph shows a place from the ground.','An aerial photograph shows a place from above.','Aerial cameras can be carried by planes, balloons or drones.'],views),
 f('Siberia and the Iraqi marshes',['A young reindeer herder in Siberia, Russia. Her family lives in a tent and moves with the herd to find pasture.','Marsh Arab communities in southern Iraq live on reed islands and travel by boat. Their way of life faces threats.'],views),
 f('Compare the two viewpoints',['Point to a detail you can see at ground level.','Then trace a route a boat could take in the view from above.','What would you want a closer view of?'],views,'pair',{timerSeconds:90}),
 q('What can each view show?',['Which view could show the layout of a village?','Which might show details at street level?'],views,'An aerial view can show layout; a ground-level view can show street details.','The best view depends on the question. Both show only what was captured at that time.')
 ]),
 stage('satellites','Satellite images and Google Earth',11,24,'A satellite image is collected by a sensor in orbit. Monitoring changes requires suitable images from different times. Discuss cloud cover, resolution and imagery dates when they affect what students can infer.',[
 f('Satellite images',['Sensors in orbit can cover large areas and track hurricanes, wildfires and forest change.','Some sensors can see objects as small as bins. Images can also reveal signs of activity at sensitive sites.','The textbook gives about 90 minutes as an example of a fast pole-to-pole orbit.'],satellites),
 q('Track the hurricane',['Point to the centre of the storm.','What would you need to see to tell which way it is moving?'],satellites,'Images of the same area taken at different times.','Compare where the centre appears in each image. Use the dates and times to put the images in order.'),
 q('Watch a rainforest',['You need to check a large rainforest repeatedly for possible logging.','Would aerial photographs or satellite images usually be more useful? Why?'],satellites,'Satellite images are useful for repeated coverage of large areas.','Compare images taken at different times. Aerial images may provide closer detail; check image dates, cloud cover and resolution.'),
 f('Explore with Google Earth',['Google Earth combines maps, satellite images, photos and 3D views.','Find your home, zoom into a village, follow a river or cross a desert.','Explore mountains and valleys on the ocean floor.'],globe),
 f('Follow the river on a virtual globe',['Trace the river through the valley on the screen.','Where would you zoom in to see more detail?','Tell a partner what you would look for there.'],globe,'pair',{timerSeconds:90})
 ]),
 stage('gis','GIS: data on a map',8,35,'A GIS is a geographic information system. It stores, displays and analyses data linked to location. Ask students to explain which additional data they need before deciding on a route.',[
 f('A geographic information system',['Record cafés near school using latitude and longitude or a postcode. Enter the data in a GIS to see the cafés on a map.','A GIS helps people make decisions, such as planning delivery routes or identifying areas with clusters of reported crime.'],gis),
 q('Plan around a road closure',['Trace the blue route on the map.','If a road on the route closed, what could you add to the GIS to help the driver?'],gis,'Add the location of the closure and the roads that are still open.','The driver can compare routes around the closure. Travel times or delivery deadlines could help decide which route to take.'),
 q('How can a GIS help?',['A delivery driver needs to plan a route.','How could mapped location information help?'],gis,'It can show stops and help compare possible routes.','GIS can combine locations with route and other data. The best route depends on the information available, such as roads and travel conditions.')
 ]),
 stage('practice','Choose your tool',13,43,'Allow about 4 minutes for the board challenge and 9 minutes for independent worksheet work. Ask students to explain a match as they place it. Keep the worksheet prompt on screen while they write.',[
 f('Match each tool to its job',['Open the board challenge. Match the cards, then check your reasoning.'],maps,'pair',{boardActivity:sort,boardActivityPrimary:true}),
 f('Your Turn worksheet',['Use the lesson examples to answer questions 1–6.','For question 7, rank three tools and explain what each would help you find out.'],views,'think',{worksheetLink:true,timerSeconds:540})
 ]),
 stage('exit','Choose and explain',4,56,'Listen for the tool, what it shows and why it fits the task. Invite partners to compare one worksheet answer before discussing it as a class.',[
 q('Which tool would you choose?',['You want to find your way around a new town.','Choose a map, compass or photographs and explain.'],maps,'A map can show streets and routes; a compass can show direction.','A map is usually the most useful for navigating unfamiliar streets. A compass and photographs can provide helpful extra information.'),
 f('Exit ticket',['Name one geography tool and one job it can do.','Finish with your reason for choosing it.'],satellites,'share')
 ]),
 stage('your-turn-answers','Your Turn answer review',10,60,'Ask students to share their reasoning before revealing each answer. Accept other well-justified answers for 3 and 7, and any three accurate examples for 5.',[
 q('1. Map and aerial photograph',['What is a map?','What is an aerial photograph?'],views,'A map represents a place as seen from above. An aerial photograph is a photo taken from above.','For example, a drone camera can take an aerial photograph.'),
 q('2. Finding your way',['Which tool is most helpful in a new town?'],maps,'A street map.','It shows street names, landmarks and how streets connect, so you can plan a route.'),
 q('3. Choosing a holiday town',['Would a map or photographs help more?'],views,'Photographs are a good choice.','They show what the town and its attractions look like. A map is also defensible if distance, location or transport guides your choice.'),
 q('4. Monitoring Brazil’s rainforest',['Which images help you check regularly for illegal logging?'],satellites,'Satellite images.','They cover large areas. Comparing images taken on different dates can reveal new clearings.'),
 q('5. Google Earth',['Give three examples of what you can do.'],globe,'Explore a city, follow a river and examine mountains on the ocean floor.','Other examples include finding your home, zooming into a village and exploring a desert.'),
 q('6. GIS',['What is it and what is it used for?'],gis,'A geographic information system displays and analyses data linked to places on a map.','For example, it can map cafés or help a driver plan deliveries.'),
 q('7. Explore a country from your desk',['Rank three tools and explain why you picked them.'],maps,'1. Google Earth   2. Maps   3. Photographs','I would start with Google Earth to explore towns and terrain. Then I would use maps to locate regions and see how places connect. Finally, I would use photographs to see what daily life and landscapes look like at ground level.')
 ])
 ]
};

