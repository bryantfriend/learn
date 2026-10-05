// Temporary Meet collection. Original read-aloud adaptations of the early
// course topics and the locally reviewed GP workbook Research Lesson 1.
// Keep outside the classroom enhancement pipeline: no required pupil tasks.
const section = (title, lines, script) => ({ title, lines, script });
function makeLesson(classId, subject, topic, reference, sections) {
  const id = `online-${classId}-${subject}-2026-10-05`;
  const label = classId === '8' ? '8' : classId.toUpperCase();
  return {
    id, title: `${subject === 'geography' ? 'Geography' : 'GP'} ${label} · ${topic}`,
    durationMinutes: 30, contentRevision: 1, online: true, classroomOnly: true,
    eyebrow: `ONLINE · ${label} · ${reference}`,
    catalog: { subjectId: 'online', grades: [classId === '8' ? 8 : 7], classes: [classId], unit: 'Temporary · Read aloud', order: subject === 'geography' ? 1 : 2 },
    readingGuide: `docs/online-lessons.html#${id}`,
    curriculumReference: reference,
    openingScript: 'Share the lesson screen in Google Meet. Say: “Today I will explain the lesson. You can listen quietly. You do not need to turn on your microphone, write answers or use the chat.” Read the full script using Read-aloud script, or open the continuous reading guide from the Online picker. All scenarios and research numbers are invented teaching examples. These are original adaptations, not quotations from the books.',
    pacingNote: 'About 30 minutes with slow ESL delivery, short thinking pauses and repeated examples; reading straight through will be shorter. For a 40-minute slot, spend the final 10 minutes rereading the worked examples and summary. No response is required and nothing advances automatically.',
    stages: sections.map((s, i) => ({
      id: `read-${i + 1}`, title: s.title, durationMinutes: 5, timeRange: `${i * 5}–${i * 5 + 5} min`,
      notes: 'Read the script slowly. Pause for 20–30 seconds after the quiet-thinking prompt, then supply the explanation yourself. Repeat unfamiliar terms and the worked example if useful. No cold calling, written work, breakout rooms or chat response is required. The five-minute allocation is a flexible estimate.\n\n' + s.script,
      frames: [{ title: s.title, mode: 'listen', lines: s.lines, teacherScript: s.script,
        kicker: reference, footnote: 'Listen quietly · No written work or microphone response needed.',
        nextLabel: 'Next part', ...(i === sections.length - 1 ? { final: true } : {}) }]
    }))
  };
}

const geography7A = makeLesson('7a', 'geography', 'Your geography kit: tools, maps and evidence', 'Oxford geog.1 · early sections 1.1–1.2', [
  section('Geography starts with a question', ['What is here? Where is it?', 'How do people and nature connect?'],
    `Today we are going to think about the tools a geographer uses. You can simply listen. There is no worksheet to complete. Geography is the study of places, people, natural features and the connections between them. A river is a natural feature. A bridge is something people have built. A bridge over a river connects the two: people need to cross the water, so they build a crossing.

    Imagine a school beside a river. This is an invented example. Some pupils live on the opposite bank. A bridge helps them reach school. If the river floods, their usual route might become difficult. We can ask where the bridge is, how far away it is, and whether there is another route. Those questions need different information. Looking at one photograph will not necessarily answer all of them.

    Think quietly for a moment: if I want to know where the school is, what could I use? Pause. A map could show its location. If I want to know what the entrance looks like, a photograph could help. If I want to know how long the walk takes, I could measure the distance and investigate walking time. A geography kit is useful because each tool answers a particular kind of question. We choose the question first, then the tool.`),
  section('A map and a photograph tell different stories', ['Map: location and connections.', 'Photograph: visible detail from one viewpoint.'],
    `A photograph shows a view from one position at one moment. It might show the school gate, the bridge and a tree. That is useful evidence about appearance. But a photograph can leave things out. A building behind the photographer is not visible. A street around the corner may be hidden. An empty photograph also does not prove that nobody uses the place. Perhaps the photograph was taken before school began.

    A map gives us a different view. It represents an area using selected information. A street map may show roads, buildings and paths. It is not a photograph of every roof, window and person. It simplifies the place so that we can find things and understand how they connect. An atlas is a collection of maps. Its index can help us find a named place.

    Here is a worked example. I want to find a route from the school to a park. I start with a map because I need to see connected roads and paths. I then look at a photograph of the park entrance because I want to recognise it when I arrive. Think quietly: which source would you choose to describe the colour of the school gate? Pause. A clear, relevant photograph would usually be more useful than a street map. Neither source is best for every question.`),
  section('Read the title, key and direction', ['Title: what area or topic?', 'Key: what do the symbols mean?', 'North arrow: which way is north?'],
    `Before using a map, read its title. The title might tell us that it shows a town centre, a country, or rainfall. Maps can show the same area but different information. A rainfall map and a road map are not interchangeable. We should also check the map's date when the question concerns things that may have changed, such as a new road.

    Next, look at the key, also called the legend. The key explains symbols and colours. A blue line might represent a river, but we should check rather than guess. A green area might represent a park on one map and a range of land heights on another. The colour does not explain itself. The key gives it meaning.

    A north arrow helps us describe direction. North, east, south and west are compass directions. If north is at the top of a particular map, east is to the right, south is at the bottom and west is to the left. But maps can be rotated, so we should read the arrow first.

    Imagine a map with a school symbol and a blue line beside it. Think quietly: can we immediately say the school is beside a river? Pause. We should first check the key. If the key identifies that line as a river, the map supports our description. Careful reading is better than a confident guess.`),
  section('A ruler needs a scale', ['A map distance is not the real distance.', 'Use the map scale to convert it.'],
    `A ruler measures a line on the page. It does not automatically tell us the distance on the ground. For that, we need the map's scale. A scale describes the relationship between distance on the map and distance in the real place. Maps shrink large areas so that they can fit on a page or screen.

    Here is an invented example with easy numbers. Our map says that one centimetre represents one hundred metres on the ground. A straight line from the school to the park measures four centimetres on the original map. We multiply four by one hundred. The straight-line distance is four hundred metres. If the line measured two centimetres, the distance would be two hundred metres.

    Now think quietly: does four hundred metres tell us the exact length of the walk? Pause. Not necessarily. The path may bend around buildings or follow a road. Straight-line distance and route distance can be different. We need to measure the route if we want the walking distance.

    There is another important caution for today's online lesson. If a map is enlarged on a screen, the centimetres you measure on your screen change. Do not use a printed one-centimetre statement blindly after resizing the image. A scale bar that enlarges with the map can help us keep the relationship correct. Today we are explaining the method, not asking you to measure your screen.`),
  section('Observation, explanation and evidence', ['Observation: what the source shows.', 'Explanation: why it might be that way.'],
    `Geographers use evidence carefully. An observation describes something a source shows. An explanation suggests why it is happening. Imagine a photograph of a wet road with a puddle beside a drain. We can say, “There is water on the road.” That is an observation. We might say, “It rained earlier.” That is a possible explanation. The photograph alone may not prove it. The water could have come from a leaking pipe or cleaning equipment.

    To investigate, we could look for more information. Weather records might show whether rain occurred. A second photograph might show a pipe leaking. A visit could help us see whether the drain is blocked. The right source depends on the question. More information is useful when it helps us test the explanation, rather than simply repeating the same claim.

    Here is my first sentence: “The road is wet, so it definitely rained.” Think quietly about the word definitely. Pause. That word makes the claim stronger than our evidence allows. A better sentence is, “The road is wet. Rain is one possible explanation, but we need more evidence.”

    Careful language does not mean we know nothing. We still know what the photograph shows. We separate what we can see from what we are trying to explain. That distinction is a basic geographical skill, whether we are studying a school street or a much larger area.`),
  section('Follow one small investigation', ['Choose the question, then the tool.', 'Describe the evidence before explaining it.'],
    `Let us put the whole geography kit together. Our invented question is: how could pupils walk from the school to the park? First, I use a map to locate both places. I read the title to make sure it is the correct area. I read the key to identify roads, paths and the river. I check the north arrow so that I can describe direction accurately.

    Next, I compare possible routes. I use the scale to estimate distance. I remember that a straight line across the map may cross a river or a building, so it may not be a usable walking route. I look for an actual path and a crossing. A photograph of the entrance may help pupils recognise where to go, but it does not replace the route map.

    Finally, I explain the limits. A map may not tell me whether a gate is open today or whether a pavement is temporarily closed. For those questions I would need current, relevant information. I should not promise that a route is safe just because it appears on a map.

    Think quietly about the three tools we discussed: map, photograph and ruler. Pause. The map helps with location and connections. The photograph helps with visible detail. The ruler helps measure, but needs a scale to produce a real-world distance. Geography starts with a useful question and ends with an explanation supported by evidence. That is our main idea for today.`)
]);

const geography7B = makeLesson('7b', 'geography', 'The UK jigsaw: countries, islands and maps', 'Oxford geog.1 · early chapter 3 · sections 3.1–3.2', [
  section('An island and a country are different ideas', ['Island: land surrounded by water.', 'Country: a political territory.'],
    `Today we are going to untangle some names that are easy to mix up: Great Britain, the United Kingdom and Ireland. You do not need to memorise everything immediately. Listen for the difference between a piece of land and a political territory. An island is land surrounded by water. A country is a political territory. These ideas can overlap, but they do not mean exactly the same thing.

    Imagine a large island divided into several territories. The coastline tells us where the land meets the sea. The borders tell us where one territory meets another. A coastline and a border answer different questions. Sometimes a boundary follows a river or mountain, but we cannot assume that every boundary does.

    In this part of the world, Great Britain is the island containing England, Scotland and Wales. The island of Ireland lies to its west. Northern Ireland is on the island of Ireland; it is not on the island of Great Britain. We will return to that distinction several times.

    Think quietly: could two countries share the same island? Pause. Yes. One island can contain more than one political territory. Equally, a country can include several islands. Our first rule is therefore simple: check whether a name refers to an island, a country or a group of territories before using it in an explanation.`),
  section('Build the four-part UK jigsaw', ['United Kingdom: England, Scotland, Wales, Northern Ireland.', 'Great Britain: England, Scotland and Wales.'],
    `The United Kingdom consists of England, Scotland, Wales and Northern Ireland. We often shorten its name to the UK. When we say England, we name one part of the UK. We have not named the whole UK. Scotland, Wales and Northern Ireland are not other names for England.

    Now compare that with Great Britain. Great Britain is the island containing England, Scotland and Wales. Northern Ireland is part of the UK, but it is on the island of Ireland. That is why United Kingdom and Great Britain do not describe exactly the same area. The distinction becomes clearer when we imagine the pieces of a jigsaw.

    Put England, Scotland and Wales together on the island of Great Britain. Then add Northern Ireland across the water on the island of Ireland. Together, those four parts form the UK. The Republic of Ireland occupies most of the rest of the island of Ireland and is a separate state from the UK.

    Think quietly about this sentence: “Northern Ireland is part of Great Britain.” Pause. That sentence is incorrect. Northern Ireland is part of the United Kingdom, but it is not on the island of Great Britain. Here is the corrected sentence to hear again: “Northern Ireland is part of the UK and lies on the island of Ireland.” We are matching each name to the area it actually describes.`),
  section('Use direction to place the pieces', ['Scotland is north of England.', 'Wales is west of England.', 'Ireland lies west of Great Britain.'],
    `We can describe locations without pretending that every place fits into a perfect rectangle. On a simple map with north at the top, Scotland is north of England. Wales is to the west of England. The island of Ireland lies to the west of Great Britain. Northern Ireland is in the north-eastern part of the island of Ireland.

    Notice how much the reference point matters. “West” by itself is incomplete. West of what? A useful sentence names both places. “Wales is west of England” tells us the relationship. “Ireland is west of Great Britain” gives a different relationship. The north arrow helps us read those directions even when the map has been turned.

    Water also helps us understand the arrangement. The Irish Sea lies between the island of Ireland and Great Britain. The English Channel separates southern England from northern France. We are learning these names as location clues, not trying to list every sea around the islands.

    Think quietly: if I move from Great Britain towards the island of Ireland, which general direction am I travelling? Pause. Generally west, although the exact direction depends on where the journey begins and ends. A real journey may involve roads, ports and a ferry or flight. A general direction describes location; it does not tell us the complete travel route. We should keep those two kinds of information separate.`),
  section('Political and physical maps', ['Political map: territories and borders.', 'Physical map: landforms, height and water.'],
    `A political map shows territories and their boundaries. It can help us identify England, Scotland, Wales and Northern Ireland. Different colours may help separate them. If Wales is coloured green, that does not automatically mean that Wales is flat, forested or wet. The key tells us what the colour means. It may simply identify a political area.

    A physical map focuses on natural features. It may show mountains, rivers or the height of the land. Relief means the shape and height differences of the land. A physical map can help us find upland and lowland areas. The Scottish Highlands are an upland region in northern Great Britain. The Highlands are not an additional country in our four-part UK jigsaw.

    We can combine the information. A political map tells us where Scotland is. A physical map helps us investigate its landscape. We still need to avoid saying that every part of Scotland has the same landscape. One territory can contain varied landforms and different kinds of settlement.

    Think quietly: which map would help most if my question was, “Where is the boundary between England and Wales?” Pause. A political map would be a sensible start. If my question was, “Where is the highest ground along this route?”, I would need physical information about land height. Choose the map that answers the question, then read its key.`),
  section('A dot, a colour and a line need a key', ['Symbols simplify places.', 'A border does not always follow a mountain.'],
    `Maps cannot show every detail at its real size. They use symbols. A small dot might represent a city. The dot helps us locate the city, but it may not show the city's actual shape or area. A large dot might have been drawn simply to make the place visible. Unless the key says that dot size represents population, we should not assume it does.

    The same care applies to lines. A line could mark a river, a road or a boundary. Its meaning comes from the key and the context. A political boundary does not necessarily mean that there is a wall, ridge or river along the whole line. We must compare the maps rather than invent a landscape from the boundary alone.

    Here is a small invented example. On one map, a territory is coloured purple. On another, the same territory is green. The territory has not necessarily moved or changed. The two map makers may have chosen different colours, or the maps may show different topics. We need to read what each map represents.

    Think quietly about this claim: “This country is drawn green, so it must be low land.” Pause. We cannot support that claim without checking the legend. If green identifies the country, the colour tells us political information. If it represents a height range, it tells us physical information. Good map readers explain the symbol before using it as evidence.`),
  section('Repair three geographical sentences', ['England is one part of the UK.', 'Northern Ireland is in the UK, on the island of Ireland.', 'Use the map key before interpreting a colour.'],
    `I will read three sentences and then improve them. You can think quietly before I give the explanation. First: “England and the United Kingdom are the same place.” Pause. England is one part of the United Kingdom. The UK also includes Scotland, Wales and Northern Ireland. Naming one part does not name the whole political territory.

    Second: “Northern Ireland is on Great Britain.” Pause. Northern Ireland lies on the island of Ireland. It belongs to the UK, but it is not on the island of Great Britain. Great Britain contains England, Scotland and Wales. This is the difference between the physical island and the political grouping.

    Third: “A mountain region is another country.” Pause. A mountain region describes a landscape. A country describes a political territory. The Scottish Highlands are a landscape region within Scotland, rather than an extra country to add to our UK list. Physical and political information can describe the same place in different ways.

    Let us finish by building the jigsaw once more. England, Scotland and Wales are on Great Britain. Northern Ireland is on the island of Ireland. Those four parts make up the United Kingdom. The Republic of Ireland is a separate state. Maps help us place these areas, but their titles, keys and direction arrows matter. If you remember only one idea today, remember to distinguish the land itself from the political territory drawn on it.`)
]);

const gp8 = makeLesson('8', 'gp', 'Research questions: from a big topic to a fair enquiry', 'Learner’s Skills Book 9 · opening Research Lesson 1 · pp. 3–7', [
  section('A topic is not yet a research question', ['Topic: food waste in schools.', 'Question: a focused enquiry we can investigate.'],
    `Today we will work through an early Global Perspectives research skill: turning a broad topic into a useful question. I will explain the examples, so you do not need to write or speak. Our topic is food waste in schools. This is a teacher-created example connected to the opening research work in your skills book. We have not collected evidence about our own school, and we will not pretend that we have.

    A topic is an area of interest. “Food waste” is a topic. A research question tells us what we want to find out. “What reasons do pupils give for leaving part of their school lunch?” gives us a clearer enquiry. It names a group, a behaviour and the information we want. That is more useful than trying to find out everything about food waste everywhere.

    Research involves seeking information systematically and thinking about what it can tell us. It is more than choosing a question whose answer we already like. We may discover that our first explanation was incomplete. We may find disagreement, missing evidence or a reason to change the question.

    Think quietly: if my topic is school lunches, have I already decided exactly what to investigate? Pause. No. I still need a question. A good first move is to identify who is involved, which aspect interests me, and what information I could realistically obtain.`),
  section('Repair leading and oversized questions', ['Avoid wording that pushes an answer.', 'Make the scope realistic.'],
    `Listen to this question: “Why are school lunches terrible and wasteful?” It already labels the lunches terrible. Someone who likes them may feel that their experience is unwanted. The wording pushes us towards a negative answer. We call that leading wording. A fairer question might be, “What do pupils report liking and disliking about school lunches?” We can investigate benefits and problems without deciding the result in advance.

    Now consider, “How can we end all food waste in the world?” The concern matters, but the question is too large for a short school investigation. It covers many places, causes and organisations. A smaller question can still connect to the wider topic. For example, “What might reduce lunch waste in one school over a four-week trial?” names a setting and a possible period.

    Smaller does not mean simpler in every way. We still need to decide what counts as waste, who will provide information, and how any trial would be organised. The wording helps us see those decisions instead of hiding them.

    Think quietly about the phrase, “Everyone knows pupils waste food because they are careless.” Pause. It is an unsupported claim about a whole group. Possible explanations include portion size, taste, available eating time and other factors. We would need evidence to investigate which explanations matter in a particular setting. A fair question leaves room for the answer to surprise us.`),
  section('Facts, analysis and an arguable question', ['A definition helps us begin.', 'A report question needs reasons and evidence.'],
    `Some questions ask for a straightforward definition. “What is food waste?” is useful for establishing vocabulary. It may not, by itself, support a substantial research report. A report often needs us to consider causes, effects, perspectives and possible action. We need a question that gives us something to investigate and evaluate.

    Consider this teacher-created question: “To what extent could offering smaller initial lunch portions reduce food waste without leaving pupils hungry?” There are possible benefits and possible concerns. Smaller portions might reduce leftovers, but pupils have different needs. Whether extra servings are available could matter. A useful answer would need evidence rather than enthusiasm for the idea.

    We could investigate several connected points. How much food is left now? What reasons do pupils give? Can pupils choose portions or request more? What would kitchen staff need to change? We would also have to distinguish edible leftovers from peels or other unavoidable material. Clear definitions make comparisons more meaningful.

    Think quietly: does an arguable question mean we should have a quarrel? Pause. No. It means a reasoned answer can be considered, challenged and supported with evidence. We should be able to explain why one conclusion is more convincing, and acknowledge its limits. Different well-supported conclusions may be possible. The aim is careful judgement, not winning against another person.`),
  section('Different perspectives, connected scales', ['Pupils, kitchen staff and school leaders may have different priorities.', 'A local case does not represent every school.'],
    `Imagine three people discussing smaller lunch portions. These are invented voices. A pupil says, “I want enough food and the freedom to ask for more.” A kitchen worker says, “I need a serving system that works during a busy lunch period.” A school leader says, “I want to reduce waste while keeping meals accessible.” Each person connects the proposal to a different responsibility or need.

    These are perspectives: ways of seeing the issue. We should explain them fairly before judging the proposal. We should also avoid pretending that all pupils or all staff think alike. Another pupil may prefer a smaller portion. Another kitchen worker may suggest a different serving method. A group label is not a complete description of every person in it.

    Our school case is local. A national perspective could consider school meal policies or research across schools in one country. A global perspective could compare relevant findings from different countries and examine wider environmental concerns. One interview at one school does not prove what happens nationally or globally.

    Think quietly: can we copy a successful idea from another school without asking any questions? Pause. We should check the context. Meal arrangements, ages, resources and pupil needs may differ. A comparison is useful when we explain both similarities and differences. A strong report connects scales carefully, rather than adding the word global to a local claim and assuming the evidence has become broader.`),
  section('What evidence would actually help?', ['Check method, sample, date and purpose.', 'Compare claims with relevant evidence.'],
    `Let us imagine we have two sources. A company advertisement says that its new serving trays eliminate waste. A school report describes how lunch leftovers were measured before and after a change. We should not accept or reject either source only because of its label. We ask who produced it, why it was produced, what method was used, and what evidence supports the claim.

    The advertisement has a purpose: it wants people to buy a product. We should look for the measurements behind the strong word eliminate. The school report may have useful measurements, but it also needs checking. Were the same kinds of meals compared? Did pupil attendance change? How many days were measured? Does the report distinguish a pattern from a guaranteed effect?

    Here are invented numbers for practising reasoning. Suppose leftovers weigh ten kilograms on one day and eight kilograms on another. That is a difference of two kilograms. It does not automatically prove that a new tray caused the change. Perhaps fewer pupils ate lunch, or the menu was different. We need a fair comparison and more information before making that causal claim.

    Think quietly: if twenty volunteers complete a survey, can I say that every pupil agrees with them? Pause. No. I can describe those volunteers' answers. To make a wider claim, I must consider who was included, who was missing and how people were selected. Useful evidence has a scope, and our conclusion should respect it.`),
  section('Build and defend a research plan', ['Question → sources → comparison → cautious conclusion.', 'Explain what could change your judgement.'],
    `Here is a model plan. My question is, “To what extent could smaller initial lunch portions reduce edible leftovers while meeting pupils' needs?” I define edible leftovers as food that could have been eaten but was left after the meal. I would need permission and a practical method before conducting any real school study. Today we are only modelling the reasoning.

    I would look for relevant reports and compare their methods. I would seek different perspectives from pupils and staff. If a trial were possible, I would want comparable measurements across several meals, records of attendance and information about extra servings. I would not invent findings or collect private information just to make my report look complete.

    My conclusion would need to answer the question using the evidence actually available. If I had only a small case study, I would say so. I might suggest a limited trial rather than promise a universal solution. I would explain a benefit, a possible cost and the information still missing.

    Think quietly about what could change my initial view. Pause. Evidence that pupils remained hungry, or that the serving process created new problems, could lead me to revise the proposal. Reflection means explaining how the evidence affected my thinking. Our main lesson is this: start with a focused and fair question, consider different perspectives, check relevant evidence, and reach a conclusion whose strength matches what you know.`)
]);

const gp7B = makeLesson('7b', 'gp', 'Useful research questions: one playground, different needs', 'Learner’s Skills Book 7 · opening Research Lesson 1 · pp. 3–6', [
  section('Research means finding out carefully', ['A topic is what we are interested in.', 'A question tells us what to find out.'],
    `Today we will think about useful questions. You can listen quietly while I explain. Our example is a school playground. It is an invented school, so the people and numbers in this lesson are examples rather than facts about our class. The topic connects to the opening research skills in your Global Perspectives book.

    Imagine a playground with a ball-game area, a few benches and an open space. Some pupils want to play football. Some want to sit with friends. Some want a quieter place. If we want to improve the playground, we need to find out what people need. We should not begin by assuming that everybody wants our favourite activity.

    “The playground” is a topic. It tells us what we are interested in, but it does not yet tell us what to find out. “How do pupils use the playground during lunch break?” is a research question. We could investigate it through suitable observations and questions. “Why do some pupils prefer a quieter area?” asks for reasons.

    Think quietly: is research just saying the first idea that comes into our head? Pause. No. Research means finding information carefully and considering what it shows. We can start with an idea, but we need evidence before treating that idea as a reliable answer. A useful question gives our search for information a direction.`),
  section('An issue and a perspective', ['Issue: a matter to consider or investigate.', 'Perspective: a way of seeing it.'],
    `An issue is something people may want to discuss or investigate. It does not have to be a disaster. How to use a shared playground is an issue because different activities need space and people may have different priorities. A perspective is a way of seeing the issue, influenced by a person's needs and experiences.

    Here are two invented voices. Amir says, “I sit in lessons for much of the day. I want somewhere to run and play.” Sara says, “A busy playground is tiring for me. I want a quiet place to talk or rest.” These pupils can both be honest. Different needs do not mean that one person must be lying.

    Before choosing a plan, we should describe both views fairly. Amir values active play. Sara values a calmer place. We do not need to say that Amir hates reading or that Sara never likes games. Those extra claims are not in the example. A fair explanation stays close to what the people actually said.

    Think quietly: does listening to another perspective mean that we must agree with every proposed solution? Pause. No. We can understand a reason and still have questions about the proposal. Understanding helps us compare ideas respectfully. We can ask what each plan would do, who it would help and whether it would create difficulties for somebody else.`),
  section('Questions that help, questions that push', ['Ask about needs without choosing the answer.', 'Avoid “everyone” and “always” when unsupported.'],
    `Listen to this question: “Why should we turn the whole playground into a football pitch?” The question already points towards one solution. It does not invite people to explain other uses of the playground. Now hear a fairer question: “What activities would pupils like space for during break?” This leaves room for games, talking, resting and other ideas.

    Another weak question is, “Why are quiet pupils always unhappy?” It assumes that a whole group is unhappy and uses the strong word always. We have no evidence for that assumption. A better question might be, “What do pupils who prefer a quiet break say they need?” We ask about their experience instead of deciding it for them.

    Useful wording is clear and fair. It should not make somebody feel that only one answer is welcome. If we ask, “You love football, don't you?”, we are pushing towards yes. “Which activities do you enjoy during break?” is more open. We can also provide an opportunity to name an activity that the researcher did not expect.

    Think quietly about this question: “Should we have better breaks?” Pause. Most people may say yes, but the word better is unclear. Better in what way? More space for games? Less crowding? More places to sit? A clearer question asks about a specific need so that the answers can actually help us.`),
  section('Make a question manageable', ['Who? Where? When?', 'Could we realistically find the answer?'],
    `A question can be interesting but too large for our investigation. “What does every child in the world want from a playground?” concerns an enormous number of people and places. We cannot answer it from a few conversations at one school. Our evidence would be much smaller than our claim.

    A manageable question might be, “What do Year 7 pupils at this school want to do during lunch break?” It names a group, a place and a time. We can still compare different needs within that group. If we investigate only Year 7, we should not automatically say that younger pupils want exactly the same things.

    Now consider, “How many pupils use the benches during lunch break?” We need to decide when to observe and what we will count. A single quick look on a rainy day may not describe an ordinary sunny break. Observing at several appropriate times could help us understand the pattern. Careful planning makes the answer more meaningful.

    Think quietly: which is easier to investigate responsibly, every playground in the world or one clearly defined school group? Pause. The defined group is a more realistic start. We are not saying that the larger topic is unimportant. We are matching the question to the information and time available. Useful research can begin with a small question and explain exactly what its answer covers.`),
  section('Evidence is more than the loudest opinion', ['A claim needs support.', 'Ask whose views are missing.'],
    `Imagine that one pupil says, “Everybody wants more football.” That is a claim. It may be the pupil's impression, but it is not yet evidence that everybody agrees. We could ask how they know. Did they speak to different people, or mainly to their football friends? Were pupils who prefer other activities included?

    Here is an invented survey. Ten volunteers were asked about their preferred break activity. Six chose football, three chose talking with friends and one chose quiet reading. We can say that football was the most popular of those choices among these ten volunteers. We cannot honestly say that every pupil chose football, because four of the ten chose something else.

    We also cannot assume that the ten volunteers represent the whole school. If all ten came from the football club, the selection could miss many other needs. We should ask who took part, how they were chosen and whether the question allowed a fair range of answers. A number is useful only when we understand what was counted.

    Think quietly: should we ignore the three pupils who wanted to talk and the one who wanted to read? Pause. Their needs still matter. A plan for a shared space should consider different users. Evidence can help us see both common preferences and smaller groups whose needs might otherwise be overlooked.`),
  section('Improve one question and explain why', ['Clear, fair, focused and answerable.', 'Better questions lead to more useful information.'],
    `Let us improve a question from start to finish. My first attempt is, “Why is our playground bad?” That is unclear and negative. It assumes that the playground is bad without explaining the problem. It also gives us no particular group or time to investigate.

    My second attempt is, “What do Year 7 pupils like and dislike about the playground during lunch break?” This is fairer. It allows positive and negative experiences. It names a group, a place and a time. The answers might help us find a more specific issue. Perhaps some pupils report crowding near the benches, while others say there is not enough room for a game.

    My next question could be, “How could the playground provide space for active games and a quieter break?” That is a question about possible action. Before recommending a plan, we would need information about the space, relevant school arrangements and users' needs. We should not pretend that a preferred idea has already been tested.

    Think quietly about the four checks: clear, fair, focused and answerable. Pause. Clear means people understand what we are asking. Fair means the wording does not push one answer. Focused means the enquiry is not too broad. Answerable means we can realistically seek useful information. Changing a weak question is progress. We finish today with a simple idea: listen to different needs, ask a better question, and check the evidence before making a big claim.`)
]);

export const onlineLessons = [geography7A, gp8, geography7B, gp7B];
