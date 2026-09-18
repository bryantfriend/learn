const visual={kind:'supply-chain',title:'One T-shirt, four connected stages',intro:false,
 prompt:'Follow the arrows. What does each stage need from the one before it?',
 steps:['1. Country A: grow cotton. A farmer needs water and land.','2. Country B: weave fabric. A weaver needs cotton and a loom.','3. Country C: sew the shirt. A garment worker needs fabric and a sewing machine.','4. Country D: sell the shirt. A shop worker needs finished shirts and a shop.']};
const frame=(title,mode,lines,extra={})=>({title,mode,lines,lessonVisual:visual,...extra});
export function guideSupplyChainLesson(lesson){
 if(lesson.id!=='g8-gp-1.1')return lesson;
 lesson.contentRevision=1;
 const stage=id=>lesson.stages.find(s=>s.id===id);
 stage('notice').frames[0]=frame('Follow a T-shirt','think',['Follow this shirt from cotton to the shop.','Which stage makes the fabric? Which stage uses it?']);
 stage('sources').frames[0].lessonVisual=visual;
 stage('sources').frames[1].lessonVisual=visual;
 stage('sources').notes+=' The diagram supplies worker and resource examples for this fictional chain. There are four stages. Transport connects them; do not ask for an extra fifth stage.';
 stage('model').notes='Model one dependence: sewing in C needs fabric from B. Point to the link while explaining. Separate the known connection from a possible delay; stored fabric could keep production going. Then let pupils predict a different connection during the cotton-delay task.';
 stage('model').frames[1]=frame('Explain one connection','listen',['The garment worker in C needs fabric from B to sew a shirt.','Without fabric, sewing may have to wait. “May” shows a possible effect, not a proven fact.']);
 stage('apply').notes='Use the four-stage diagram throughout. Spend 3 minutes tracing the chain, 4 discussing the delay and 3 sharing. Partners take turns pointing and explaining; use notebooks if preferred. The worker/resource examples are provided, not prior knowledge to guess. A delayed harvest might delay fabric production, then sewing or shop deliveries. Stored supplies could prevent a delay: accept this with a reason. Do not assume wages or prices will change. Ask for delivery dates or stock records to test a prediction. Transport links the four taught stages; it is not a fifth stage in this task.';
 stage('apply').frames=[
 frame('Your challenge: follow four stages','pair',['Take turns pointing: grow cotton → weave fabric → sew → sell.','Choose one stage. Name its worker and one resource from the picture.','Tell your partner: “This stage needs ___ so that ___.”'],{timerSeconds:180,discussionId:'apply-trace'}),
 frame('What if the cotton arrives late?','pair',['Imagine the cotton harvest in A is delayed.','Who in B needs that cotton? What might they have to wait to do?','Follow one more arrow. How could that delay affect C or D?'],{timerSeconds:240,discussionId:'apply-delay',footnote:'Use “might” or “could”: we are predicting, not reporting a fact.'}),
 frame('Explain your idea in 30 seconds','share',['“If cotton arrives late, ___ might ___ because ___.”','Partner: point to the link in the picture. Does the explanation fit?','What would you check: delivery dates, stored cotton, or something else?'],{timerSeconds:180,discussionId:'share',footnote:'You need one clear connection and one way to check it.'})
 ];
 return lesson;
}
