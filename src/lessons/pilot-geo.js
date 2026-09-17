import {f,q,v,task,done,build} from './pilot-tools.js';
const settlement=v('settlement','Read the settlement sketch',['Locate the bridge.','Look at the house pattern.','Point to a detail that you could describe.','Which reasons would still need evidence?']);
const map=v('map','A map with a purpose',['North is up. Start at the school.','Use the key to find the pond.','Trace the paths through the junction.','Check whether another person can follow your route.']);
const grid={kind:'grid',title:'Locate the tree',intro:false,prompt:'Locate the tree.',steps:['Find easting 23.','Find northing 45.','Measure tenths across, then up.','Write the easting part before the northing part.']};
export function commandLesson(common,extension){
 const a=extension?'12 shops near a bus stop; 3 farther away.':'Six houses stand near the bridge; two are farther away.';
 return build(common,extension?'Repair an explanation':'The confused explorer','command',[
 ['Spot the mismatch',5,'Collect an individual choice before discussing. Do not name the correct response yet. All locations are fictional.',[
 f('An explorer needs a better answer','think',['Question: describe the house pattern.','Choose: A “a bridge”; B “houses cluster near the bridge”; C “crossing may attract people”.'],{lessonVisual:settlement,footnote:'Fictional settlement sketch.',...task('first-choice')}),
 f('Compare your first choices','pair',['A: choose the answer that follows the command.','B: point to map evidence. Then swap roles.'],task('compare'))]],
 ['Name, describe, explain',8,'Identify names a feature; describe states a pattern; explain links a possible reason. B describes the pattern. C suggests a reason, but the map cannot prove it. Model one different example: identify a river; describe its bends; explain how flow may shape banks.',[
 f('Three different jobs','listen',['IDENTIFY: name the feature. DESCRIBE: say what is shown.','EXPLAIN: link a reason to the pattern.'],{lessonVisual:settlement}),
 f('Repair the explorer’s answer','pair',['The question says EXPLAIN. The answer says “There are houses.”','A adds a possible reason. B checks the link and what is still unknown.'],task('repair',180))]],
 ['Produce and test',15,'Allow 5 minutes writing, 5 checking and 5 revision. In the second scheduled session use the shop counts to cover the paired 1.6 objective: claim, evidence, reasoning and limitation. Near means within 200 m. No interviews or comparison over time were made.',[
 f(extension?'New source: the bus stop':'Your three-part field note','think',[a,extension?'Near means within 200 m. No customer interviews were made.':'Write one identify, one describe and one explain answer.'],extension?{lessonVisual:v('shops','Shop counts',['Read the near count.','Read the far count.','Use both values in a comparison.','Counts alone cannot establish the cause.'])}:{lessonVisual:settlement}),
 f('One writes; one checks','pair',[extension?'A writes a claim using both counts. B links a possible reason.':'A writes an explanation. B checks: does it explain the pattern?','Swap. Mark one claim that the source does not prove.'],task('write-check',240)),
 f('Improve one sentence','share',['Read your first and revised versions.','Everyone: name the command followed and one piece of evidence used.'],task('revise'))]],
 ['Check the thinking',7,'Choose individually, then partners explain one tempting wrong answer before reveal. The explanation question distinguishes an observed pattern from a causal link.',[
 q('Which answer explains the pattern?',['Six houses are near the bridge.','A bridge crosses the river.','Crossing the river may improve access, attracting houses.','The houses are closer to the bridge than the hill.'],'C','C links access to settlement. A and D describe; B identifies. The reason is plausible but needs evidence.','check-command'),
 q(extension?'What do the shop counts establish?':'What would strengthen the explanation?',extension?['Access caused every shop to open.','There are more recorded shops near the stop.','Most customers arrive by bus.','All shops opened after the stop.']:['Another drawing of the same pattern.','Counting the houses again.','Making the bridge label clearer.','Evidence about residents’ travel and reasons for living there.'],extension?'B':'D',extension?'12 versus 3 supports a comparison. It does not establish customer travel or why shops opened.':'Evidence of use and reasons helps test the proposed access explanation; the map alone cannot.','check-evidence')]],
 ['Transfer',5,'Assess a new location, not recall of wording. Accept different possible reasons when linked to the pattern and qualified. Each learner writes independently before sharing.',[
 f('New place: stalls near a station','think',['A sketch shows 5 stalls by a station and 1 farther away.','Describe the pattern. Suggest a linked reason. Name evidence needed to test it.'],task('exit')),
 done('Show an answer that follows its command and separates a pattern from a possible reason.')]]
 ]);
}
export function mapLesson(common,extension){
 return build(common,extension?'Test a map and grid reference':'Can another team use your map?','map',[
 ['Navigate before you draw',5,'Students draw a route privately before one person points on the board. The sketch shows an imaginary school, pond, road and park with connecting paths. Multiple routes are acceptable if they follow paths.',[
 f('Get a visitor to the pond','think',['Start at the school. Use the paths to reach the pond.','Draw your route first. Then give a partner two clear directions.'],{lessonVisual:map,footnote:'Fictional plan; not to scale.',...task('route')})]],
 ['Choose useful symbols',8,'A map selects information for a purpose. Model a different symbol: a square could mean a library if the key says so. Do not give a completed map to copy. Require north, key, destinations and paths.',[
 f('What must a visitor know?','pair',['A lists essential details. B names one detail you can leave out.','Agree a north arrow, path symbol and key.'],{lessonVisual:map,...task('key')}),
 f('A key makes a symbol usable','listen',['A symbol does not explain itself. Label its meaning in a key.','An aerial view shows detail; your map selects what helps the journey.'])]],
 ['Draw, exchange, test',15,'Give 5 minutes to draw, 4 to test without pointing, 3 to diagnose and 3 to revise. On the return session require a four- and six-figure tree reference too: 2345 and 236452. Teach along then up; tenths refine the square.',[
 f('Make a visitor’s map','think',['Draw the school, pond, park and paths as simple symbols.','Add north and a key. Do not write the route on the map.'],{lessonVisual:map,...task('make',240)}),
 f('Can your partner use it?','pair',['A hands over the map and stays silent. B traces school to pond.','B explains any guess. Swap maps and roles; each repairs one problem.'],task('test-repair',240)),
 ...(extension?[f('Add a precise meeting point','listen',['Read eastings along, then northings up. Four figures name a square.','Our tree is 6 tenths across and 2 tenths up inside square 2345.'],{lessonVisual:grid}),f('Send a grid reference','pair',['A gives the tree’s six-figure reference. B plots it.','Swap: choose a new point and test whether your partner finds it.'],task('grid-test'))]:[f('Change the destination','pair',['Now guide a visitor from the school to the park.','Use only the map and key. Improve anything that caused a wrong turn.'],task('new-route'))])]],
 ['Diagnose a wrong turn',7,'Discuss why plausible map mistakes fail: a key gives meaning, north gives orientation and paths show connections. For grid practice use 236452, not northing first or bundled square digits.',[
 q('Your partner treats the pond symbol as a shop. What fixes it?',['Add a key explaining the symbol.','Make the symbol larger.','Add more detail to the school.','Rotate the paper.'],'A','A key explains meaning. Size and detail do not resolve an ambiguous symbol.','symbol-check'),
 q(extension?'Which is the tree’s six-figure reference?':'Where is the pond relative to the school?',extension?['234562','452236','236452','234526']:['West','North','South','East'],extension?'C':'D',extension?'Easting 23 plus 6 tenths gives 236; northing 45 plus 2 tenths gives 452.':'North is up, so the pond on the right is east of the school.','position-check')]],
 ['Prove your map works',5,'Each pupil records the result of a real partner test. If the route fails, that is useful evidence: name and repair the confusing detail rather than claiming success.',[
 f('Final visitor test','pair',['Give your revised map to a partner for a new route.','Record: destination reached, or where the visitor got stuck—and your fix.'],task('exit')),
 done('Show the route your partner followed and the map change that made it clearer.')]]
 ]);
}
export function waterLesson(common){
 const water=(scene,title)=>v(scene,title,['Locate the drop.','Everyone predicts a next route.','Name the process behind your prediction.','Keep a second possible route in mind.']);
 return build(common,'Journey of a drop','water',[
 ['Predict a journey',5,'Begin with a raindrop landing on a hillside. Everyone sketches an arrow before the board advances. Accept runoff or infiltration; do not imply the water cycle has only one fixed route.',[
 f('The drop lands. Where next?','think',['A drop lands on this hillside. Draw one possible next move.','Tell your partner: “It could ___ because ___.”'],{lessonVisual:water('drop-land','Choose a route for rain'),footnote:'Fictional landscape model.',...task('predict')})]],
 ['Name the processes',8,'Use the reveal only after predictions. Runoff moves over land; infiltration enters soil. Evaporation is liquid to vapour; condensation is vapour to droplets. Clouds are droplets/ice, not visible water vapour.',[
 f('Two routes can be right','listen',['Runoff: water flows over the ground.','Infiltration: water enters the soil.'],{lessonVisual:water('drop-branches','Rain has more than one route'),learningRole:'evidence-reveal'}),
 f('Liquid, vapour, droplets','pair',['A: explain what warming can do to water in a puddle.','B: explain what cooling water vapour can do. Swap and check the words.'],task('process-talk')),
 f('Check your process words','listen',['Evaporation: liquid water becomes water vapour.','Condensation: water vapour becomes tiny liquid droplets.'])]],
 ['Travel, then reroute',15,'Give 4 minutes to choose a route, 3 to label it, 4 to switch surface and 4 to compare. Paving may increase runoff; it does not guarantee a flood. No automatic animation is used to supply the next answer.',[
 f('Build your drop’s journey','pair',['A draws: rain → river → vapour → cloud droplets.','B labels the processes. Then swap and add a route through soil.'],{lessonVisual:water('drop-cycle','Trace a route without labels'),...task('journey',240)}),
 f('New clue: the ground is paved','think',['The rain now lands on a paved car park.','Predict which route becomes easier and which becomes harder.'],{lessonVisual:water('drop-paved','Change one surface'),learningRole:'evidence-reveal',...task('change')}),
 f('Revise your route','pair',['A changes the arrows. B explains the change using runoff and infiltration.','Swap: explain why paving alone does not prove there will be a flood.'],task('revision',180))]],
 ['Check a misconception',7,'Spend time justifying and rejecting the closest distractor. Heat supplies energy for evaporation; cooling vapour produces condensation. Do not conflate infiltration with evaporation.',[
 q('A cool lid collects droplets above warm water. Which change formed them?',['Liquid to vapour: evaporation.','Vapour to liquid: condensation.','Water enters soil: infiltration.','Water flows downhill: runoff.'],'B','Water vapour cooled into liquid droplets on the lid. Evaporation is the opposite change.','condensation'),
 q('After paving, why might more rain reach the river quickly?',['More rain must fall on paving.','Condensation speeds up over paving.','Paving turns rain straight into vapour.','Less water can enter the ground, so more runs off.'],'D','Paving often reduces infiltration and increases rapid runoff. Rainfall amount and other conditions still matter.','runoff')]],
 ['A second journey',5,'Require each student to draw a different route and correctly name at least two processes. Oral explanations are fine; assess each learner, not just the pair drawing.',[
 f('Your drop takes another route','think',['Draw rain → soil → stream, then add a way back to the air.','Name at least two processes. Explain one arrow to a partner.'],task('exit')),
 done('Show two possible routes for water and correctly name the processes.')]]
 ]);
}
export function networkLesson(common,repeat){
 const net=(blocked=false)=>v('network','A small fictional supply network',['Farm in Country A supplies a market in Country B.','A van uses the bridge road.','A hill road is longer.','A message tells the market when deliveries arrive.'],{blocked});
 return build(common,repeat?'One message fails':'One connection breaks','network',[
 ['Trace the dependency',5,'Before the interruption, pupils trace goods, people and information across a border. The driver crosses with the goods; arrival information is a separate link. Discuss how this international connection helps the school but creates dependence on a route. On the return session the message link fails rather than the bridge, creating a new reasoning task.',[
 f('How does food cross a border?','think',['Farm (Country A) → van → market (Country B) → school kitchen.','Draw the links. Mark what moves: goods, people or information.'],{lessonVisual:net(),footnote:'Fictional network and travel times.',...task('trace')})]],
 ['Know the network',8,'Bridge road: 20 minutes; hill road: 50 minutes. Kitchen needs the delivery within 40 minutes. There is a message link to report arrival time. Do not offer the alternative plan before pupils attempt one.',[
 f('Read the constraints','listen',['Bridge road: 20 min. Hill road: 50 min.','The kitchen needs vegetables within 40 min. Messages report arrival time.'],{lessonVisual:net()}),
 f('Who depends on whom?','pair',['A follows the vegetables. B follows the arrival message.','Swap. Explain who is affected by a late van.'],task('dependencies'))]],
 ['Interrupt and repair',15,'Allow 3 minutes independent prediction, 5 pair plan, 4 challenge and 3 revision. Accept using stored food or changing meal timing with a consequence; the hill road alone misses the deadline. In the message variant the road is open: verify arrival another way rather than sending a second unneeded delivery.',[
 f(repeat?'The message does not arrive':'The bridge road closes','think',[repeat?'The van can travel, but the market gets no arrival message.':'The van must use the 50-minute hill road today.','Draw who is affected next. Predict one problem before choosing a fix.'],{lessonVisual:net(!repeat),learningRole:'evidence-reveal',...task('break')}),
 f('Make a repair plan','pair',['A proposes an alternative. B checks the 40-minute deadline.','Swap: name one person helped and one remaining problem.'],task('repair',240)),
 f('New clue from the kitchen','listen',['The kitchen has enough stored food for one meal.','A plan can use that stock today, but must replace it for tomorrow.'],{learningRole:'evidence-reveal'}),
 f('Improve your first plan','share',['Show what you changed and why.','Everyone: identify one benefit and one cost of the new plan.'],task('revise'))]],
 ['Test the explanation',7,'The distractors target ignoring a deadline and treating a communication failure as a transport failure. Require the relevant source detail before revealing.',[
 q(repeat?'A missing message proves…':'Does the hill road meet the original deadline?',repeat?['the vegetables were not grown.','the van cannot cross the bridge.','only that arrival information is missing.','the market has no vegetables.']:['Yes: any alternative road solves it.','No: 50 minutes exceeds 40 minutes.','Yes: the bridge takes only 20 minutes.','No: all roads take the same time.'],repeat?'C':'B',repeat?'Check the delivery separately. A failed information link does not establish that the goods failed to arrive.':'The hill road can deliver, but it misses the original deadline by 10 minutes. A repair must also address timing.','network-check'),
 q('Which plan considers tomorrow too?',['Use today’s stock and arrange its replacement.','Use today’s stock without checking what remains.','Send another van without checking the first.','Keep the original deadline and wait.'],'A','A workable repair considers the next consequence, not just today’s immediate gap.','consequence-check')]],
 ['Break a different link',5,'Use a new individual application. Check a clear chain of effects and an alternative with a limitation.',[
 f('Your transfer challenge','think',['A school bus route is closed; a longer route is still open.','Draw two effects on people. Propose one change and one problem it may leave.'],task('exit')),
 done('Show how one broken link affects others, and a repair with a remaining cost.')]]
 ]);
}
