const art=(name,alt)=>({image:`geography-kit/${name}.png`,alt,caption:'Original generated illustration of an imagined example; not geographic evidence.'});
const maps=art('maps','Students study a map and compass.');
const views=art('views','Two illustrated views of a riverside settlement from ground level and above.');
const satellites=art('satellites','An imagined satellite observes Earth and a computer displays geographic information.');
const f=(title,lines,picture,mode='listen',extra={})=>({title,lines,mode,geoArt:picture,conceptLayout:'artwork',...extra});
const q=(title,lines,picture,answerText,explanation)=>f(title,lines,picture,'think',{type:'question',answerText,explanation,responseHint:false,allowHideAnswer:true});
const stage=(id,title,durationMinutes,start,notes,frames)=>({id,title,durationMinutes,timeRange:`${start}–${start+durationMinutes} min`,notes,frames});
const sort={id:'kit-sort',type:'sort',title:'Match the tool to its job',facilitation:'Tap a card and then a category, or drag it. Check and explain your choices together.',groups:['Map','Compass','Aerial photograph','Satellite image','GIS'],items:[{id:'streets',label:'Shows streets from above',answer:0},{id:'direction',label:'Helps find north',answer:1},{id:'drone',label:'View from a drone',answer:2},{id:'orbit',label:'Sensor observes Earth from orbit',answer:3},{id:'layers',label:'Displays and analyses mapped data',answer:4}],rationale:'Different tools answer different questions. A GIS combines location with data; a satellite sensor observes from orbit.',challenge:'Can two tools help with the same investigation? Explain.'};
export const geographyKitLesson={
 id:'g7-geography-kit',title:'What’s in Your Geography Kit?',durationMinutes:40,geoConcept:true,
 catalog:{subjectId:'geography',grades:[7],classes:['7a','7b'],quarter:'Q2',unit:'Quarter 2 · Lesson 2',order:2},
 worksheet:'./worksheets/geography-kit.html',
 openingScript:'A 40-minute teacher-led lesson based on textbook pages 8–9. Use the board challenge and discussion questions before handing out the printable Your Turn worksheet. Generated illustrations are imagined, not photographs or maps for navigation. No accounts or student devices are needed.',
 stages:[
 stage('launch','Explore from your desk',4,0,'Invite students to name ways to find out about a place. Explain that each tool gives different evidence.',[
 f('What is in a geography kit?',['How could you explore a place without going there?','Think, then tell a partner one tool and what it can show.'],maps,'pair',{timerSeconds:60}),
 f('Today we will choose the right tool',['Maps · compass · photographs · satellite images · Google Earth · GIS','Explain what each tool shows and why it helps.'],maps)
 ]),
 stage('maps','Maps and compass',7,4,'A map is a representation of a place seen from above; maps use symbols and may show themes. A compass needle indicates magnetic north, which can differ from true north. The Sun rises roughly east and sets roughly west, not precisely due east and west every day.',[
 f('Maps show places from above',['A map can show the world or a few streets.','A thematic map can show information such as rainfall.','Maps may be on paper, in an atlas or on a screen.'],maps),
 f('A compass helps us find direction',['The four main directions are north, east, south and west.','A compass needle points towards magnetic north.'],maps),
 q('Which way?',['On a north-up map, a park is above a school.','Is the park north, east, south or west of the school?'],maps,'North','On a north-up map, up represents north. Always check the map’s direction indicator; not all maps are north-up.')
 ]),
 stage('photos','Photographs and viewpoints',6,11,'Ground-level photos show a place from the photographer’s viewpoint. Aerial photos are taken from above by a camera in a plane, balloon or drone. Illustrations are not evidence about real people or places.',[
 f('Two ways to look',['A ground-level photograph shows a place from the ground.','An aerial photograph shows a place from above.','Aerial cameras can be carried by planes, balloons or drones.'],views),
 q('What can each view show?',['Which view could show the layout of a village?','Which might show details at street level?'],views,'An aerial view can show layout; a ground-level view can show street details.','The best view depends on the question. Both show only what was captured at that time.')
 ]),
 stage('satellites','Satellite images and Google Earth',7,17,'A satellite image is collected by a sensor in orbit. Monitoring changes requires suitable images from different times; clouds, resolution and timing can limit the evidence. Google Earth is available on the web and other platforms; its coverage and imagery dates vary.',[
 f('Satellite images',['Sensors in satellites collect images from high above Earth.','They can cover large areas and help track storms, wildfires or changes in forests.'],satellites),
 q('Watch a rainforest',['You need to check a large rainforest repeatedly for possible logging.','Would aerial photographs or satellite images usually be more useful? Why?'],satellites,'Satellite images are useful for repeated coverage of large areas.','Compare images taken at different times. Aerial images may provide closer detail; check image dates, cloud cover and resolution.'),
 f('Explore with Google Earth',['Google Earth combines maps, satellite imagery and other views.','Explore a city, follow a river or look at mountains.','Zoom in and out; check the imagery date where available.'],satellites,'pair',{timerSeconds:60})
 ]),
 stage('gis','GIS: data on a map',6,24,'A GIS is a geographic information system. It stores, displays and analyses data linked to location. The café example is hypothetical. A digital map alone is not necessarily a full GIS analysis.',[
 f('A geographic information system',['A GIS connects information to places on a map.','For example, record café locations and display them together.','People can analyse mapped data to help make decisions.'],satellites),
 q('How can a GIS help?',['A delivery driver needs to plan a route.','How could mapped location information help?'],maps,'It can show stops and help compare possible routes.','GIS can combine locations with route and other data. The best route depends on the information available, such as roads and travel conditions.')
 ]),
 stage('practice','Choose your tool',6,30,'Open the touch or keyboard board challenge. Ask students to explain each match and recognise that more than one tool can sometimes be useful. Then print the worksheet from the slide or Teacher tools.',[
 f('Match each tool to its job',['Open the board challenge. Match the cards, then check your reasoning.'],maps,'pair',{boardActivity:sort,boardActivityPrimary:true}),
 f('Your Turn worksheet',['Use the printed worksheet to choose and explain tools.','Use the lesson examples to help you.'],views,'think',{worksheetLink:true,timerSeconds:180})
 ]),
 stage('exit','Choose and explain',4,36,'Listen for tool, purpose and reason. Worksheet question 7 can continue after the lesson.',[
 q('Which tool would you choose?',['You want to find your way around a new town.','Choose a map, compass or photographs and explain.'],maps,'A map can show streets and routes; a compass can show direction.','A map is usually the most useful for navigating unfamiliar streets. A compass and photographs can provide helpful extra information.'),
 f('Exit ticket',['Name one geography tool and one job it can do.','Finish: “I would use … because …”'],satellites,'share',{final:true})
 ])]
};

