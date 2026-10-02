export function visualiseJourneyLesson(lesson,makeStage){
 if(lesson.geographyReview||!lesson.workshopMissions.some(m=>m.code==='3.1'&&m.index===1))return;
 for(const stage of lesson.stages){
  for(const frame of stage.frames){
   // Keep the existing case source and teaching prompts; give every step a visual.
   const view=stage.id==='begin'?'map':stage.id==='finish'?'exit':frame.boardRound?'case':stage.id==='teach'?'teach':'planner';
   frame.geoDisplay={...frame.geoDisplay,journey:{view}};
   if(stage.id==='finish'&&!frame.final)frame.lines=['A new journey costs 42 tokens; the budget is 40.','Add the pictured travel times. As you leave, tell your teacher the total and why the journey is not yet feasible.'];
   if(view==='planner')frame.responseHint='Enter both totals, choose a route and check. Then cancel the ferry and revise your choice.';
  }
  Object.assign(stage,makeStage(stage.id,stage.title,stage.durationMinutes,stage.frames,stage.notes+'\nPicture planner: pupils enter totals before checking. Use Cancel ferry to test the original plan; changing the budget to 60 makes the flight affordable. Reset restores the fictional 45-token budget.'));
 }
 lesson.contentRevision=6001;
}
