import {f,q,v,task,done,build} from './pilot-tools.js';
import {createIssuePerspectiveLesson} from './issue-perspective.js';
export function headlineLesson(common){
 const headline=v('headline','A headline to investigate',['Read the claim.','Underline the claimed cause.','Make a first judgement.','Name the evidence you would need.']);
 const study=v('study','What did the survey measure?',['Ten pupils chose quiet breaks.','Eight reported feeling ready.','Two did not report feeling ready.','The count describes this group, not a cause.']);
 return build(common,'Catch the headline','headline',[
 ['Judge before the study',5,'This is data literacy, not medical advice. All case details are fictional. Record provisional judgement: supported, too strong, or need more evidence. Do not reveal the study until everyone has a first view.',[
 f('“Quiet breaks make pupils ready to learn”','think',['Would you publish this headline? Choose: yes, no, or need more evidence.','Write one thing you would check.'],{lessonVisual:headline,footnote:'Fictional headline and survey.',...task('headline-choice')})]],
 ['Reveal what was measured',8,'First reveal only 8/10. Let pupils calculate. Then reveal self-selection and absent comparison. Readiness is self-report, not learning measured by a test. This also covers the paired trustworthy-claim objective 4.1.',[
 f('Open the study','think',['8 of 10 pupils who chose a quiet break said they felt ready for class.','What fraction and percentage is that?'],{lessonVisual:study,learningRole:'evidence-reveal',...task('calculate')}),
 f('What the headline leaves out','listen',['Pupils chose their own break. No other group was studied.','The survey asked how ready they felt; it did not measure learning.'],{learningRole:'evidence-reveal'}),
 f('Compare two explanations','pair',['A: explain how quiet might help. B: suggest another influence.','Swap: say what evidence could distinguish the explanations.'],task('alternative'))]],
 ['Edit the newsroom copy',15,'Allow 4 minutes drafting, 4 peer editing, 3 new clue and 4 revision. Alternatives include prior readiness, sleep, interest or selection; these are hypotheses, not established causes. New clue does not prove quiet has no effect.',[
 f('Rewrite without overclaiming','think',['Keep the useful number. State who answered and what was measured.','Write a headline that does not claim a proven cause.'],task('draft',180)),
 f('Editor and fact-checker','pair',['A reads the headline. B checks sample, measure and causal words.','Swap. Underline one phrase to change and explain why.'],task('edit',180)),
 f('New clue: before the break','listen',['Seven of the same ten already reported feeling ready before the break.','We do not know which individuals changed their answers.'],{learningRole:'evidence-reveal'}),
 f('Keep, change or reject?','share',['Revise your headline. Explain what the new clue changes.','Name one comparison that would help test a causal claim.'],task('revision'))]],
 ['Challenge believable mistakes',7,'80% is the group’s reported readiness, not an 80% improvement or 80% of the whole school. A comparison with prior readiness and other influences is useful but is not automatic proof.',[
 q('Which statement matches the first survey?',['Readiness improved by 80%.','80% of the school benefited.','80% of these 10 respondents reported readiness.','Quiet breaks caused readiness in 8 pupils.'],'C','8/10 = 80% of this sample. There is no measured improvement or causal conclusion in that count.','share-check'),
 q('Which evidence would best test the headline?',['A larger headline with the same number.','Readiness before and after, plus a comparable group taking another break.','Only answers from pupils who like quiet.','More preferences collected once after a break.'],'B','A fair comparison and earlier measurements help examine changes and alternative explanations. A bigger preference count alone does not isolate cause.','cause-check')]],
 ['Publish a careful conclusion',5,'A model appears only after pupils have committed and revised. It is one acceptable wording; do not require copying. Exit transfer must be independent.',[
 f('Compare with an editor’s version','listen',['“8 of 10 quiet-break volunteers reported readiness.”','This says what the survey found; it does not say quiet caused it.'],{learningRole:'model'}),
 f('A different headline','think',['“Library visits cause higher grades.” Visitors had higher grades in one survey.','Rewrite it cautiously. Suggest another explanation and one useful check.'],task('exit')),
 done('Show a headline that matches its evidence and a question that could test its cause.')]]
 ]);
}
export function settingsLesson(common,extension){
 const settings=v('settings','Two tasks, different constraints',['Mira needs a live science demonstration.','Mira has no safe equipment at home.','Dani needs quiet time to edit a story.','Dani has books at home and feedback at school.']);
 return build(common,extension?'Design an access trial':'Choose the learning setup','settings',[
 ['Commit to a choice',5,'Use specific learner/task pairs so there is no general winner. Everyone recommends a setting before hearing a partner. Imaginary learners; no personal disclosure needed.',[
 f('Where should each learner work?','think',['Choose classroom, home, or a sequence of both for each task.','Write one reason. You may revise your plan.'],{lessonVisual:settings,footnote:'Fictional learners, constraints and budgets.',...task('choice')})]],
 ['Use the same criteria',8,'Compare access to resources, feedback and time for both options. Model a smaller unrelated choice: two places to practise a speech, using noise and audience. Do not settle the main learners’ plans.',[
 f('Make a fair comparison','pair',['A checks resources in both settings. B checks feedback in both.','Swap. Add time and one thing you still need to know.'],{lessonVisual:settings,...task('criteria')}),
 f('Explain a fit, not a favourite','listen',['“For this task, ___ helps because ___.”','A setting can suit one task and still create a problem for another.'])]],
 ['Design, challenge, revise',15,'Spend 4 minutes on a plan, 3 on the new clue, 4 on revision, 4 on peer review. Second session includes original 3.6 access proposal: 50-token budget, materials loan 30, travel 45, combined 75. Require cost and a review measure.',[
 f(extension?'Trial budget: 50 tokens':'Plan two learning journeys','pair',[extension?'Materials loan: 30. Travel support: 45. Both cost 75.':'A plans Mira’s task. B plans Dani’s task.',
 extension?'A checks costs. B checks who can use the trial. Swap and agree one option.':'Swap plans. Check resources, feedback and time; identify one weak point.'],{lessonVisual:settings,...task('plan',240)}),
 f('A constraint you missed','listen',[extension?'Some learners need transport before they can collect borrowed materials.':'Dani’s home is noisy this week. The classroom is quiet only before lessons.',
 'Does your first plan still work?'],{learningRole:'evidence-reveal'}),
 f('Revise and name the cost','pair',['Change your plan or defend it using a source detail.','Say who benefits, what remains difficult, and how you would check whether it helps.'],task('revise',180))]],
 ['Test the recommendation',7,'Use choices that confuse consistency of criteria, task fit and access. Reject claims of a universal winner without dismissing the useful features of each setting.',[
 q('Which comparison is most useful?',['School has a teacher; home has nicer chairs.','Compare resources, feedback and time in both settings.','Choose whichever place most pupils prefer.','Compare only the best feature of each setting.'],'B','Using the same criteria reveals trade-offs relevant to the task rather than comparing unrelated advantages.','criteria-check'),
 q(extension?'Which trial fits the 50-token budget?':'What should change after Dani’s new constraint?',extension?['Materials and travel for 50.','Two materials loans for 50.','Travel for 45, with materials need still unresolved.','Two travel programmes for 50.']:['Keep home because it is always quiet.','Move every task to school permanently.','Ignore timing and just choose school.','Check whether the quiet school time is available to Dani.'],extension?'C':'D',extension?'45 fits within 50, but travel alone does not provide materials. A feasible plan still has limits.':'Access includes when Dani can use the setting, not only whether the room is quiet.','constraint-check')]],
 ['Recommend for someone new',5,'Independent transfer: no universal correct venue. Require task, constraint, justified fit and a practical check. In the access session also ask what evidence would show the trial helped.',[
 f('New learner: a group presentation','think',['A learner needs rehearsal feedback but can only stay after school on Friday.','Recommend a setting and time. Name one thing to check before committing.'],task('exit')),
 done('Show a recommendation that fits a learner’s task, constraints and need for feedback.')]]
 ]);
}
export function surveyLesson(common,repeat){
 const forms=v('survey','Repair the wording',['Read the question exactly.','Look for words that suggest a preferred answer.','Check the time period and answer options.','Allow someone to disagree or skip.'],{repeat});
 return build(common,repeat?'Test another team’s survey':'Survey repair shop','survey',[
 ['Try answering a flawed question',5,'Use only invented responses; do not ask for personal habits, names, accounts or passwords. Learners privately identify a wording problem before any repair is shown.',[
 f(repeat?'Can everyone answer this?':'Would this push your answer?','think',[repeat?'“How much do games and messages interrupt your homework?”':'“Don’t you agree games waste homework time?”','Underline a problem. Explain it using a fictional respondent.'],{lessonVisual:forms,footnote:'Practice only: use fictional respondents.',...task('diagnose')})]],
 ['Learn the repair tools',8,'For the first session show two flaws: leading wording and unclear time. For the return session focus on double questions and answer choices that omit zero. Model with an unrelated book question before the main repair.',[
 f('A small repair example','listen',['“You love books, don’t you?” pushes toward yes.','Try: “How much do you enjoy reading books?” Include a range and “prefer not to say”.']),
 f('Four checks for a fair question','pair',['A checks: one idea, clear time.','B checks: neutral words, answers that include none and skip. Swap.'],{lessonVisual:forms,...task('tools')})]],
 ['Run the repair shop',15,'Allow 4 minutes individual drafts, 5 exchange, 3 imagined respondent test, 3 revision. Teams repair different items. Explain neutral does not mean perfect: wording can be fair while a sample is still limited.',[
 f('Two repair jobs','pair',[repeat?'A repairs a question mixing messages and games. B repairs options 1–2 / 3–4 / 5+ that omit zero.':'A repairs “Games ruin homework, right?” B repairs “Do you often get too many messages?”',
 'Each writes a clear question and answer choices before sharing.'],task('draft',240)),
 f('Swap with the next pair','pair',['Read their question exactly as written.','A plays someone who answers “none”. B plays someone who wants to skip.'],task('test',180)),
 f('Return one useful repair note','share',['“This wording pushes me toward ___” or “I cannot answer because ___.”','The authors revise. Each person explains one change.'],task('revision')),
 f('Check what you collect','listen',['Use anonymous, voluntary replies in a real approved class survey.','For today, invented replies are enough. No names, accounts or passwords.'])]],
 ['Compare plausible questions',7,'Ask pupils to explain why each distractor creates a problem. B is bounded and neutral; the alternatives lead, blame or leave the time frame vague.',[
 q('Which question is clearest and most neutral?',['Why do games distract you from homework?','On how many of the last 5 school days did game alerts interrupt homework?','Do you agree game alerts distract most pupils?','Do game alerts interrupt homework a lot?'],'B','B asks one bounded question without assuming interruption occurred. Include zero and a skip option.','wording'),
 q('Which response set includes all counts for the last 5 days?',['1–2 / 3–4 / 5','Never / often / always','Yes / no / sometimes','0 / 1–2 / 3–4 / 5 / prefer not to say'],'D','D covers zero through five without overlap, and permits a voluntary skip.','options')]],
 ['Prove the repair works',5,'Use the transfer question independently. Successful work permits both agreement and disagreement without pushing and supplies usable response options.',[
 f('New topic: a school club','think',['Write one neutral question about which club activities pupils would prefer.','Add fair choices and a skip option. Let a partner try to disagree.'],task('exit')),
 done('Show a survey question that a respondent can answer honestly, including “none” or a skip.')]]
 ]);
}
export function playgroundLesson(common){
 const old=createIssuePerspectiveLesson(common),[start,learn,apply,check,finish]=old.stages;
 const playground=start.frames[0].lessonVisual,voices=learn.frames[1].lessonVisual;
 const newNeed=v('access','Another playground user',['Kai uses a walking frame.','The gate-to-bench route has to stay clear.','Look for a crossing or obstacle in your plan.','Revise without erasing Sam’s and Amina’s needs.']);
 return build(common,'What is an Issue and a Perspective?','playground',[
 ['Make a first decision',4,'Everyone sketches an initial use of space before discussion. Do not reveal a preferred plan. Keep the first sketch for comparison.',[
 f('How would you share this space?','think',['Draw your first playground plan. Mark football and quiet space.','Keep it: later you may discover something it misses.'],{lessonVisual:playground,footnote:'Fictional pupils and playground.',...task('first-plan')})]],
 ['Name the issue',4,learn.notes,[learn.frames[0],learn.frames[1]]],
 ['Represent both voices',6,'Each partner must represent both pupils. Listener checks the reason, not whether they agree. Take turns so neither learner only watches.',[
 f('Can you explain the other view?','pair',['A speaks for Sam. B checks Sam’s reason. Then swap.','Repeat for Amina: what does she need, and why?'],{lessonVisual:voices,...task('role-swap',180)})]],
 ['Design a shared playground',8,'Give 2 minutes independent suggestions, 4 combined sketch and 2 justification. Each student labels a different need. Accept zones, times or another justified arrangement.',[
 f('Make your plan together','pair',['A adds a way to play football. B adds a quiet space.','Swap: check the other person’s need. Label why each choice helps.'],{lessonVisual:playground,...task('draft-plan',240)})]],
 ['Listen, then revise',6,'Reveal Kai only after a plan exists. Kai uses a walking frame and needs a clear route from gate to bench. This is one individual’s stated need, not an assumption about all disabled people. No real access measurements are specified.',[
 f('A voice you had not heard','listen',['Kai says: “I need a clear route from the gate to the bench.”','Look at your plan. Would Kai need to pass through the football game?'],{lessonVisual:newNeed,learningRole:'evidence-reveal'}),
 f('Change something that matters','pair',['Each person marks a problem or checks that the route works.','Revise the plan. Explain one change and whose need it meets.'],task('revise',180))]],
 ['Compare and check',7,'Allow 3 minutes comparing sketches and 4 minutes for short checks with explanations. A solution can meet more needs without resolving everything. Keep issue and perspective distinct.',[
 f('Show your before and after','share',['Explain a change using one person’s reason.','Everyone listening: name one need met and one problem still left.'],task('compare')),
 check.frames[0],check.frames[1]]],
 ['Transfer independently',5,'Use the original library transfer with no partner help at first. Check each learner can name the shared issue and explain both views with reasons.',[
 finish.frames[0],done('Show the issue and two perspectives in your library answer—not just your own preference.')]]
 ]);
}
