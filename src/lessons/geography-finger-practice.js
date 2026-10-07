// Whole-class retrieval for the reviewed UK maps and rainfall lesson.
const rounds=[
 ['Which list contains all four countries of the UK?', ['England, Scotland, Wales and Northern Ireland','England, Scotland, Wales and Ireland'],1,'Northern Ireland is part of the UK. The country Ireland is outside the UK.','map'],
 ['Which group is on the island of Great Britain?', ['England, Wales and Northern Ireland','England, Scotland and Wales'],2,'Great Britain contains England, Scotland and Wales. Northern Ireland is on the island of Ireland.','map'],
 ['England and Wales meet at a boundary. What lies between them?', ['A shared land border','Sea all the way along the border'],1,'England and Wales share a land border. A country boundary does not always mean a sea crossing.','map'],
 ['Which sea lies between Great Britain and the island of Ireland?', ['North Sea','Irish Sea'],2,'The Irish Sea lies between the two islands. The North Sea is east of Great Britain.','map'],
 ['A journey must cross the Irish Sea. Which plan can make the crossing?', ['Road travel to a port, then a ferry','A continuous road journey across the sea'],1,'A road alone cannot cross the Irish Sea. A ferry can provide the crossing; a flight is another option.','map'],
 ['A map shows a port. Does this prove a ferry leaves today?', ['Yes: a port proves a service runs today','No: check a current timetable'],2,'A map shows location. A current timetable is needed to check whether and when a ferry runs.','map'],
 ['“It is rainy and windy here this afternoon.” What does this describe?', ['Climate','Weather'],2,'Weather describes conditions at a particular time and place. One afternoon does not establish the climate.','weather'],
 ['Which evidence helps us describe a place’s climate?', ['Weather observations collected over many years','One very cold morning'],1,'Climate concerns long-term weather patterns. Many observations across years are needed.','weather'],
 ['Moist air rises up a mountain. What happens as it rises?', ['It warms, so the mountain creates water','It cools; condensation can form cloud and rain'],2,'Rising air cools. Water vapour can condense into droplets, and precipitation may follow. The mountain does not create water.','rain'],
 ['Which statement about the leeward side is more accurate?', ['It is often drier, but can still receive rain','It can never receive rain'],1,'Descending air warms on the leeward side, which can discourage cloud formation. Other weather conditions can still bring rain.','rain']
];
export function createFingerPractice(){
 return rounds.map(([title,answers,correct,explanation,visual],i)=>{
  const map=visual==='map';
  const image=visual==='rain'?'rain-shadow':'weather-and-climate';
  return {
   title,mode:'think',type:'question',kicker:`1 or 2 fingers · Question ${i+1} of 10`,
   choices:answers.map((text,index)=>`${index+1} ${index===0?'finger':'fingers'} · ${text}`),
   lines:['Think quietly. Show 1 or 2 fingers when your teacher says “Vote”.'],
   responseHint:'Be ready to explain your choice.',answerText:`${correct} ${correct===1?'finger':'fingers'} · ${answers[correct-1]}`,
   revealLabel:'Reveal answer',allowHideAnswer:true,explanation,
   discussionId:`lesson-2-fingers-${i+1}`,discussionMode:'share',
   sourceCard:`Question: ${title}\n1 finger: ${answers[0]}\n2 fingers: ${answers[1]}`,
   conceptLayout:map?'evidence':'artwork',fingerPractice:true,
   ...(map?{geoDisplay:{atlas:{view:'islands',labels:true,cities:true,caption:'Use the country outlines, sea labels and north arrow.'}},enlargeMapButton:true}:{}),
   geoArt:map?{image:'geography/settlements.png',alt:'Illustrated coastal town.',caption:'Teaching illustration.'}:{image:`geography/${image}.png`,contain:true,alt:visual==='rain'?'Moist air rises over a mountain; rain falls on the windward slope and the leeward side is often drier.':'One day of weather compared with observations across seasons and years.',caption:visual==='rain'?'Use the mountain diagram to explain your vote.':'Weather at one time; climate over many years.'},
   teacherScript:`Question ${i+1} of 10. Read both choices. Allow about 10 seconds of quiet thinking, then say “Vote” so everyone shows 1 or 2 fingers together. Ask one or two pupils for a reason before revealing. Correct answer: ${correct} ${correct===1?'finger':'fingers'}. ${explanation} Allow about one minute for this round; move on when pupils can explain the idea.`
  };
 });
}
