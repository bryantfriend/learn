const f=(title,mode,lines,extra={})=>({title,mode,lines,kicker:'geog.1 · section 3.1',...extra});
const atlas=(options={})=>({atlas:options});
export function rebuildUKLesson(lesson,stage){
 if(lesson.id!=='g7b-geo-w02-1')return;
 const source='Use the labelled map: London is in England; Cardiff in Wales; Edinburgh in Scotland; Belfast in Northern Ireland. North Sea: east of Great Britain. Irish Sea: between Great Britain and the island of Ireland. The English Channel separates southern England from northern France.';
 lesson.stages=[
  stage('begin','One or two fingers?',3,[
   f('Which island is Northern Ireland on?','think',['Find the circled place. Show your prediction with one or two fingers.'],{choices:['Great Britain','The island of Ireland'],geoDisplay:atlas({labels:false,marker:true}),footnote:'1 finger = Great Britain · 2 fingers = island of Ireland. We will test this shortly.',discussionId:'uk-prediction'})
  ],'Point to the circled area without naming its island. Everyone votes with one or two fingers; ask two pupils for a reason. Do not mark answers yet. Return to the prediction when the two maps are compared.'),
  stage('teach','Build the map together',10,[
   f('United Kingdom and Great Britain','pair',['Compare both maps. Point to the extra country in the UK.','Now reconsider your finger vote. What does the map show?'],{geoDisplay:atlas({compare:true,caption:'Coloured land belongs to the named group. Grey land is outside that group.'}),discussionId:'uk-compare'}),
   f('Seas and neighbours','share',['Trace the Irish Sea between the islands. Find the North Sea to the east.','Switch to Europe: point towards France, across the English Channel.'],{geoDisplay:atlas({scales:true,cities:false,caption:'Use the sea labels and north arrow. Switch views to locate France in mainland Europe.'}),discussionId:'uk-seas'}),
   f('You build the United Kingdom','share',['Predict a country name, then tap its shape to fill it in.','Add all four countries. Which one is on a different island?'],{geoDisplay:atlas({fill:true}),teachingModel:true,discussionId:'uk-fill'})
  ],'Compare the two maps side by side for 3 minutes. Take the second finger vote: Northern Ireland is on the island of Ireland. Spend 3 minutes locating seas and nearby land with the map views. For the next 4 minutes invite pupils to predict each country before tapping the outline. Reveal one at a time; keep the completed labels visible. Enlarge the map for board use.'),
  stage('investigate','Same outlines, new rule',8,[
   f('Island sorting office','pair',['Move the country shapes into the two island maps.','Change the rule to UK membership. Explain why Northern Ireland moves group.'],{geoDisplay:atlas(),postcardActivity:{id:'uk-islands',mode:'sorting',title:'Island sorting office'},discussionId:'uk-sort'})
  ],'Use two rounds only: island, then UK membership. Each pupil makes a move and the class explains the map evidence. The country Ireland is outside the UK. End once the class can explain Northern Ireland: on the island of Ireland and in the UK. Spend remaining time inviting pupils to point and explain; do not repeat the sorting loop.'),
  stage('apply','Two postcard missions',12,[
   f('Post office: read, point, deliver','pair',['Two rounds, two postcards per round. Both partners use the same map and clues.','One pupil explains the clue; the other taps or drags onto the country itself. Swap jobs next round.'],{geoDisplay:atlas({cities:true}),postcardActivity:{id:'uk-postcards',mode:'postcards',title:'Map delivery missions'},sourceCard:source,discussionId:'uk-deliver',workSeconds:4}),
   f('Invent a better address','pair',['Choose a city on the map. Give two clues without saying its name.','A partner points to the city. If two places fit, add one better clue.'],{geoDisplay:atlas({cities:true,scales:true}),sourceCard:source,discussionId:'uk-address',workSeconds:3})
  ],'Allow about 6 minutes for the two delivery rounds, then stop the game. Keep map country labels, city markers, seas and compass visible alongside both clues. Incorrect deliveries stay editable. Use the next 6 minutes for pupil-created clues: one about direction or a sea and one about island or UK membership. The class tests whether the clues identify only one city.'),
  stage('check','Fix the travel message',5,[
   f('Keep the fact; fix the mistake','pair',['“Belfast is in the UK, so it must be on Great Britain.”','Point to Belfast. Say a corrected sentence using “but”.'],{geoDisplay:atlas({cities:true}),type:'question',answerText:'One possible correction',explanation:'Belfast is in the UK, but it is on the island of Ireland. The UK includes places on two islands.',discussionId:'uk-repair'})
  ],'Hear two pupil corrections before showing the example. Ask a different pupil to trace the Irish Sea and explain the original mistake. This checks the opening prediction using a new travel message.'),
  stage('finish','Your spoken exit ticket',2,[
   f('On your way out…','share',['Tell your teacher one country and the island it is on.','One spoken sentence as you leave.'],{discussionId:'uk-exit'}),
   f('Lesson complete','listen',['Have your sentence ready for the door.'],{final:true})
  ],'Students say one country and its island as they leave: for example, “Wales is on Great Britain” or “Northern Ireland is on the island of Ireland”. No writing or second class quiz. Note any confusion for the next lesson.')
 ];
 let elapsed=0;for(const s of lesson.stages){s.timeRange=`${elapsed}–${elapsed+s.durationMinutes} min`;elapsed+=s.durationMinutes;}
 lesson.title='UK map detectives and postcard delivery';lesson.workshopMissions=[{code:'3.1',index:0,title:lesson.title}];
 lesson.openingScript='40-minute map workshop: finger prediction, two-map comparison, tap-to-label demonstration, two sorting rounds, two postcard rounds, pupil-created clues, a corrected travel message and a spoken exit at the door. No books or printouts required. '+lesson.stages.map(s=>s.title+': '+s.notes).join('\n');
}
