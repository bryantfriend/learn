// Original generated artwork supports the scenario; it is never numerical evidence.
const descriptions={
 fieldwork:'Students use a map and compass to investigate a landscape.',
 weather:'Students observe instruments at a school weather station.',
 wellbeing:'Students discuss rest, exercise and daily routines.',
 market:'A shopkeeper and customers discuss choices at a produce stall.',
 factory:'Workers, stored fabric and a delivery truck at a textile factory.',
 playground:'Students discuss football and quiet reading in a shared playground.',
 canteen:'Students and a lunch worker discuss food and reusable bowls in a school canteen.',
 library:'Students share a library for group work and quiet reading.',
 city:'Neighbours consider homes, shops, a park and public transport.',
 river:'Students observe a river, its banks and the surrounding landscape.',
 glacier:'Students and a guide observe a glacier and mountain valley.',
 energy:'Students explore energy and water use at a school.',
 digital:'Students and a teacher discuss information on a tablet.',
 research:'Students compare observations and evidence around a table.',
 transport:'A family and local volunteers meet at a transport station.',
 farm:'A farmer and visitors look at cotton growing and goods being transported.'
};
export const sceneCaption='Illustration only: use the written source for exact facts and quantities.';
export function chooseScene(text){
 const rules=[['canteen',/canteen|lunch|bowls?|food waste/],['library',/library|librar/],['playground',/playground|football|quiet space/],['factory',/factory|fabric|t-shirt|garment|supply chain|sewn|woven/],['glacier',/glacier|glacial|ice sheet|moraine|u-shaped|ice age/],['river',/river|flood|water cycle|drainage|meander|waterfall|erosion|runoff/],['farm',/farm|crop|cotton|agricultur|soil/],['weather',/weather|climate|rainfall|temperature/],['wellbeing',/wellbeing|healthy|health|sleep|exercise/],['fieldwork',/\bmaps?\b(?! the issue)|grid reference|compass|geography kit|island home|jigsaw|how far|how high|explorer|geograph/],['market',/trade|price|consumer|advertis|employment/],['digital',/\bai\b|artificial intelligence|technolog|internet|online|social media|digital|website|headline|news|phone|screen|misinformation/],['transport',/migrat|refugee|arrival|journey|commut|bus |transport|travel/],['energy',/energy|electric|solar|turbine|insulation|heating|waste|recycl|water use/],['city',/city|cities|town|urban|settlement|housing|neighbour|community|park|road|public space/]];
 return rules.find(([,pattern])=>pattern.test(text.toLowerCase()))?.[0]||'research';
}
export function illustrateExamples(lesson){
 if(!lesson.gp||lesson.examId)return lesson;
 for(const stage of lesson.stages){
  const isPractice=stage.id.startsWith('practice-');
  const context=[lesson.title,...stage.frames.flatMap(f=>[f.title,...(f.lines||[])])].join(' ');
  for(const frame of stage.frames){
   if(frame.type||frame.final||frame.diagram||frame.visual||frame.lessonVisual)continue;
   if(!isPractice&&!/source|case|example|scenario|situation/i.test(frame.title))continue;
   const ownContext=[frame.title,...(frame.lines||[])].join(" ");
   const scene=chooseScene(isPractice?context:ownContext+" "+lesson.title);
   frame.illustration={image:'illustrations/'+scene+'.webp',alt:descriptions[scene],caption:sceneCaption};
  }
 }
 return lesson;
}
