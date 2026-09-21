// Compact diagnostic items. The first choice is correct before balanced shuffling.
const gpCore = [
 ['Which statement is a fact?', ['The club has 12 members.', 'Our club is the best.', 'Clubs are boring.', 'Everyone should join.'], 'A membership count can be checked.'],
 ['A perspective is a person’s…', ['viewpoint.', 'age.', 'address.', 'test score.'], 'A perspective is a way of viewing an issue.'],
 ['Two pupils disagree. What should you do first?', ['Hear both reasons.', 'Ignore one pupil.', 'Choose the louder voice.', 'Stop all discussion.'], 'Listening helps you understand both views.'],
 ['Which question is neutral?', ['How do you travel to school?', 'Why is walking best?', 'You hate buses, right?', 'Why is cycling awful?'], 'It does not suggest the desired answer.'],
 ['8 of 20 pupils chose music. Which claim fits?', ['Eight chose music.', 'Everyone chose music.', 'Nobody likes sport.', 'Most chose music.'], 'Only the stated count is supported.'],
 ['Which source best gives today’s club start time?', ['Today’s club notice.', 'Last year’s timetable.', 'A guess from a friend.', 'An unrelated advert.'], 'A current relevant notice is the best of these sources.'],
 ['A group has ten minutes. What helps?', ['Agree roles and a deadline.', 'All wait for instructions.', 'One person does everything.', 'Choose roles after finishing.'], 'Roles and a deadline help share work.'],
 ['Which response shows useful reflection?', ['Next time I will check my facts.', 'I never need to improve.', 'Longer work is always better.', 'Mistakes are always others’ fault.'], 'It identifies a specific improvement.'],
 ['One pupil dislikes lunch. What can you conclude?', ['That pupil dislikes lunch.', 'All pupils dislike lunch.', 'No pupils eat lunch.', 'Lunch must be unhealthy.'], 'One view does not establish everyone’s view.'],
 ['Which action checks a doubtful claim?', ['Compare independent evidence.', 'Repeat it more loudly.', 'Count its words.', 'Trust the prettiest page.'], 'Independent evidence can support or challenge a claim.'],
 ['A pupil prefers a quiet library. What could explain this?', ['They need to concentrate.', 'They dislike all classmates.', 'They never read books.', 'They speak for everyone.'], 'Concentration is a plausible reason, not a judgement about the pupil.'],
 ['Which is evidence for “the tap leaks”?', ['Water drips when it is off.', 'The tap looks attractive.', 'Someone dislikes the sink.', 'The room is large.'], 'Dripping when closed directly supports the claim.']
];
const gpExtras = {
 '7B': [
  ['Which issue affects a whole class?', ['How to share class books.', 'One pupil’s favourite colour.', 'One pupil’s shoe size.', 'A pencil’s brand.'], 'Sharing resources is a common class concern.'],
  ['What helps a quiet group member contribute?', ['Invite their idea and wait.', 'Speak for them.', 'Interrupt them.', 'Skip their turn.'], 'An invitation and thinking time make participation easier.'],
  ['Which is an opinion?', ['The park is beautiful.', 'The park has two gates.', 'The gate closes at six.', 'There are five benches.'], 'Beauty is a personal judgement.'],
  ['You record a class survey. What must stay accurate?', ['The number of each response.', 'Only your favourite answer.', 'Only the biggest number.', 'A guess of the total.'], 'Accurate counts preserve what respondents said.'],
  ['Which is a useful interview question?', ['What would improve the playground?', 'You agree with me, yes?', 'Why are you always wrong?', 'Everyone wants swings, right?'], 'An open question invites the interviewee’s own ideas.'],
  ['A poster’s text is hard to read. What helps?', ['Use clear, larger lettering.', 'Add more tiny text.', 'Hide the title.', 'Remove all spacing.'], 'Readable lettering improves communication.'],
  ['Two sources disagree. What should you do?', ['Check their evidence and dates.', 'Discard both immediately.', 'Trust the longer one.', 'Pick the first one.'], 'Checking evidence and timing helps explain differences.'],
  ['What shows an improvement in your work?', ['A clearer reason with evidence.', 'More pages with no reasons.', 'A brighter cover only.', 'The same mistake repeated.'], 'Better reasoning and support are meaningful improvements.']
 ],
 '7A': [
  ['Only football players answer a sports survey. What is missing?', ['Views of other pupils.', 'More football questions.', 'A colourful heading.', 'The interviewer’s opinion.'], 'Other pupils may have different preferences.'],
  ['A shop advert praises its own product. What should you check?', ['Independent product evidence.', 'The advert’s colour.', 'The shop’s slogan length.', 'How often it repeats.'], 'The seller has an interest in sales; independent evidence helps check claims.'],
  ['Which is a local issue?', ['Litter outside our school.', 'Ocean pollution worldwide.', 'Global climate change.', 'Trade between continents.'], 'The stated location is the school neighbourhood.'],
  ['Which is a global issue?', ['Plastic pollution across oceans.', 'A broken classroom chair.', 'Our class seating plan.', 'One missing library book.'], 'Ocean pollution crosses national boundaries.'],
  ['A park plan removes a path. Whom should you consult?', ['People who use the path.', 'Only the plan’s author.', 'Only visitors who drive.', 'Nobody until it is built.'], 'People affected by the change have relevant perspectives.'],
  ['Which claim is best supported by 15 of 25 votes?', ['A majority voted yes.', 'Everyone voted yes.', 'Nobody voted no.', 'All families agree.'], 'Fifteen is more than half of twenty-five.'],
  ['A team changes its plan after feedback. This shows…', ['a willingness to improve.', 'that feedback is useless.', 'that the first plan was perfect.', 'that nobody worked.'], 'Feedback can guide a useful revision.'],
  ['Which conclusion is most careful?', ['Our sample preferred the first option.', 'Everyone everywhere agrees.', 'No more research is needed.', 'Other views must be wrong.'], 'It limits the conclusion to the people studied.']
 ],
 '8': [
  ['Scores rose after a new club began. What is uncertain?', ['Whether the club caused the rise.', 'Whether scores rose.', 'Whether the club began.', 'Whether scores can be recorded.'], 'A sequence alone does not establish causation.'],
  ['A poll includes only volunteers. What is a risk?', ['Volunteers may differ from others.', 'All answers must be false.', 'The total cannot be counted.', 'No opinion is useful.'], 'Self-selection can make a sample unrepresentative.'],
  ['Two articles copy one report. Are they independent evidence?', ['No, they share one source.', 'Yes, there are two titles.', 'Yes, if fonts differ.', 'Always, if online.'], 'Repeating the same report does not provide independent confirmation.'],
  ['“All pupils own phones” is used without checking. It is…', ['an unsupported assumption.', 'a measured result.', 'a neutral question.', 'a proven conclusion.'], 'The argument takes an unverified claim for granted.'],
  ['Which evidence best tests whether a break improves focus?', ['Comparable focus measures before and after.', 'A vote on favourite snacks.', 'The break’s name.', 'One pupil’s prediction.'], 'Relevant measurements help test the proposed effect.'],
  ['A cheaper plan is less accessible. This is…', ['a trade-off to consider.', 'proof it is best.', 'an irrelevant detail.', 'proof cost never matters.'], 'The plan has competing benefits and drawbacks.'],
  ['Which finding should change a conclusion?', ['Reliable contradictory evidence.', 'A less colourful cover.', 'An unpopular author’s name.', 'A shorter title.'], 'Conclusions should respond to the quality of evidence.'],
  ['Which action protects interview participants?', ['Ask consent and allow skipping questions.', 'Publish names without asking.', 'Require every answer.', 'Hide the purpose.'], 'Consent and choice respect participants.']
 ]
};
const geoA = [
 ['Which is a natural feature?', ['A river.', 'A road.', 'A bridge.', 'A factory.'], 'Rivers form through natural processes.'],
 ['Which is a human feature?', ['A railway.', 'A mountain.', 'A valley.', 'An ocean.'], 'People construct railways.'],
 ['Which tool shows directions?', ['A compass.', 'A rain gauge.', 'A thermometer.', 'A stopwatch.'], 'A compass indicates direction.'],
 ['Which direction is opposite north?', ['South.', 'East.', 'West.', 'North-east.'], 'South is opposite north.'],
 ['On a north-up map, right is…', ['east.', 'west.', 'south.', 'north.'], 'East lies to the right when north is up.'],
 ['What explains symbols on a map?', ['The key.', 'The border.', 'The date alone.', 'The page number.'], 'The key explains what map symbols mean.'],
 ['A map scale is 1 cm = 2 km. What is 3 cm?', ['6 km.', '3 km.', '2 km.', '5 km.'], 'Multiply 3 by 2 to get 6 km.'],
 ['Which tool measures temperature?', ['A thermometer.', 'A compass.', 'A ruler.', 'A rain gauge.'], 'A thermometer measures temperature.'],
 ['Which tool measures rainfall?', ['A rain gauge.', 'A compass.', 'A clock.', 'A weighing scale.'], 'A rain gauge collects and measures rainfall.'],
 ['Which describes weather?', ['It is raining today.', 'Winters are usually cold.', 'Deserts are generally dry.', 'Average summers are warm.'], 'Weather describes atmospheric conditions at a particular time.'],
 ['Climate describes weather patterns over…', ['many years.', 'one minute.', 'one afternoon.', 'one journey.'], 'Climate concerns long-term patterns.'],
 ['Which is a renewable energy source?', ['Wind.', 'Coal.', 'Oil.', 'Natural gas.'], 'Wind is naturally replenished.'],
 ['A settlement is…', ['a place where people live.', 'only an empty field.', 'a weather instrument.', 'a map direction.'], 'Settlements are places of human habitation.'],
 ['Why might a settlement grow near a bridge?', ['It provides a river crossing.', 'It stops all trade.', 'It guarantees no floods.', 'It removes the need for roads.'], 'A crossing helps movement of people and goods.'],
 ['Which activity is farming?', ['Growing wheat.', 'Building cars.', 'Selling phones.', 'Driving a bus.'], 'Growing crops is agriculture.'],
 ['A factory makes goods. This is…', ['manufacturing.', 'farming.', 'fishing.', 'forestry.'], 'Manufacturing converts materials into products.'],
 ['Which is a service?', ['Teaching a class.', 'Mining coal.', 'Growing cotton.', 'Making bricks.'], 'Teaching provides a service rather than extracting or making goods.'],
 ['Which change can reduce floodwater soaking into soil?', ['Covering soil with concrete.', 'Planting a garden.', 'Leaving grass.', 'Keeping woodland.'], 'Concrete reduces infiltration.'],
 ['Which action helps conserve water?', ['Fixing a leaking tap.', 'Leaving a tap running.', 'Ignoring broken pipes.', 'Watering during rain.'], 'Fixing leaks prevents water waste.'],
 ['A graph shows 10, 15, then 20 visitors. The pattern is…', ['an increase.', 'a decrease.', 'no change.', 'a fall to zero.'], 'The visitor count rises each time.']
];
const geoB = [
 ['Which place is part of the United Kingdom?', ['Wales.', 'France.', 'Spain.', 'Italy.'], 'Wales is one of the four countries of the UK.'],
 ['How many countries form the UK?', ['Four.', 'Two.', 'Three.', 'Five.'], 'England, Scotland, Wales and Northern Ireland form the UK.'],
 ['What is the capital of the UK?', ['London.', 'Paris.', 'Dublin.', 'Rome.'], 'London is the UK capital.'],
 ['Which is a physical feature?', ['A mountain.', 'A motorway.', 'A school.', 'A railway.'], 'A mountain is a natural landform.'],
 ['Which map best shows country borders?', ['A political map.', 'A rainfall map.', 'A temperature map.', 'A rock map.'], 'Political maps show administrative boundaries.'],
 ['What does a map key explain?', ['Symbols.', 'Tomorrow’s weather.', 'Travel costs.', 'Population changes.'], 'A key explains map symbols.'],
 ['Which direction is opposite east?', ['West.', 'North.', 'South.', 'North-east.'], 'West is opposite east.'],
 ['On a map, 1 cm = 5 km. What is 2 cm?', ['10 km.', '5 km.', '2 km.', '7 km.'], 'Two times five is ten.'],
 ['Where does a river begin?', ['At its source.', 'At its mouth.', 'At a port.', 'At the sea every time.'], 'The source is the beginning of a river.'],
 ['Where does a river enter the sea?', ['At its mouth.', 'At its source.', 'At a hilltop.', 'At every bridge.'], 'The mouth is where a river flows into the sea or another body of water.'],
 ['A smaller river joining a larger one is a…', ['tributary.', 'glacier.', 'cliff.', 'tide.'], 'A tributary feeds another river.'],
 ['The place where two rivers meet is a…', ['confluence.', 'source.', 'watershed.', 'waterfall.'], 'A confluence is the meeting point of rivers.'],
 ['Rivers generally flow…', ['downhill under gravity.', 'uphill without a force.', 'only towards the north.', 'only in straight lines.'], 'Gravity drives water downhill.'],
 ['A bend in a river is a…', ['meander.', 'mountain.', 'glacier.', 'border.'], 'Meanders are river bends.'],
 ['Erosion means…', ['wearing away material.', 'dropping carried material.', 'freezing all water.', 'building a bridge.'], 'Erosion wears away and removes material.'],
 ['Deposition happens when a river…', ['drops carried material.', 'creates rainfall.', 'flows uphill.', 'melts a glacier.'], 'Deposition is the laying down of sediment.'],
 ['Which river flows through London?', ['The Thames.', 'The Nile.', 'The Amazon.', 'The Danube.'], 'London stands on the Thames.'],
 ['Which event can increase river flood risk?', ['Prolonged heavy rain.', 'A long dry spell.', 'Less water entering.', 'Lower river levels.'], 'Heavy rainfall can add more water than the channel can carry.'],
 ['A floodplain is usually…', ['flat land beside a river.', 'a steep mountain peak.', 'the deepest ocean.', 'a country border.'], 'Floodplains are relatively flat areas beside rivers that may flood.'],
 ['Which action helps keep a river clean?', ['Treating wastewater.', 'Dumping plastic.', 'Pouring oil into drains.', 'Leaving litter on banks.'], 'Treatment removes pollutants before water is discharged.']
];
const positions = [1,3,0,2,2,0,3,1,0,2,1,3,3,1,2,0,2,0,3,1];
function paper(id, grade, subject, items) {
 const questions = items.map(([prompt, choices, explanation], i) => {
  const options = choices.slice(1), correct = positions[i];
  options.splice(correct, 0, choices[0]);
  return {number:i+1, prompt, options, answer:'ABCD'[correct], explanation, topic:'core-skills'};
 });
 return {id, grade, subject, title:`${grade === '8' ? 'Grade 8' : grade} ${subject} — Baseline`, minutes:40, totalMarks:20, compact:true,
  blocks:[{title:'Starting points', source:'Choose one best answer for each question.', questions}]};
}
export const baselineExams = {
 '7A-GEO-A0':paper('7A-GEO-A0','7A','Geography',geoA),
 '7B-GEO-A0':paper('7B-GEO-A0','7B','Geography',geoB),
 ...Object.fromEntries(['7A','7B','8'].map(grade => {
  const id = grade === '8' ? 'A0' : `${grade}-GP-A0`;
  return [id,paper(id,grade,'Global Perspectives',[...gpCore,...gpExtras[grade]])];
 }))
};
