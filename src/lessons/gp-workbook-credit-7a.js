// Based on the teacher's photograph of Book 8, page 14. The facing page is not available.
import { f, task, model, s } from './gp-workbook-research-2.js';
const question=(title,a,b,answer,explanation)=>f(title,'think',[],{type:'question',options:[{id:'1',label:a},{id:'2',label:b}],answer:String(answer),explanation,responseHint:'Think first. On the teacher’s signal, show 1 or 2 fingers.',revealLabel:'Reveal answer'});
const stages=[
 s('begin','Why credit a source?',7,'Page 14 prior learning question 1 allows more than one reason. Respect and fairness are strong reasons; credit can also let readers find and check sources. Payment is not automatic, and citing others does not itself guarantee credit for your own work. Invite pupils to explain different defensible views.',[
  f('Open your workbook at page 14','listen',['Today: why we credit other people’s work and how a reference helps a reader find a source.','A reference list records the sources used in your work.']),
  task(14,'Prior learning · question 1',['Read choices A–D. Choose the reasons you find convincing; more than one may apply.','Explain your choice in the book. Compare with a partner and record their reasons.']),
  task(14,'Prior learning · question 2',['Write another reason for giving credit to other people’s work.'])
 ]),
 s('concept','Meet the reference detective',8,'Explain that a citation in the work points to a source, while a reference list provides details to locate it. Formats vary. The class example uses author, year and title; source type may require publisher, URL and access date. Do not claim one universal format.',[
  f('Three useful words','listen',['Source: where an idea or information comes from.','Citation: a short acknowledgement in your work.','Reference: details that help a reader find a source.']),
  f('A fictional classroom source','listen',['Amina Karim (2024), School Gardens, Green Leaf Press.','Author: Amina Karim · Year: 2024 · Title: School Gardens · Publisher: Green Leaf Press.','This is an invented example for practice.']),
  question('Why give a source credit?','To recognise the creator and help readers find the source.','To guarantee that the creator receives money.',1,'Credit acknowledges the creator and helps readers trace information. It does not automatically produce payment.'),
  question('Which detail is the title?','Amina Karim','School Gardens',2,'School Gardens is the title; Amina Karim is the fictional author.')
 ]),
 s('starter','Inspect the teacher’s reference',10,'This deliberately incomplete fictional book reference omits the author. It includes a year, title and publisher; the supplied source card gives the missing author. Different styles order and punctuate details differently. Pupils should follow the teacher’s required style.',[
  f('Reference detective: spot the gap','think',['Source card: author Amina Karim; year 2024; title School Gardens; publisher Green Leaf Press.','Reference shown: (2024), School Gardens, Green Leaf Press.','Is it complete for our classroom format? What is missing?']),
  task(14,'Starter activity · questions 1–2',['Discuss the reference with your partner. Is it written correctly?','If not, write what is missing.']),
  model('Reveal the missing clue',['Compare the source card and reference. Which detail is absent?'],'The author, Amina Karim, is missing. A possible completed reference is: Karim, Amina (2024), School Gardens, Green Leaf Press.'),
  question('Does the incomplete reference identify the author?','Yes','No',2,'The source card identifies the author, but the displayed reference leaves the author out.')
 ]),
 s('create','Make and check a reference',11,'Students invent a source; do not present invented references as real. Check the class format against the source card, allowing valid differences in punctuation and ordering. A web page may also require a URL and access date, depending on the chosen style.',[
  task(14,'Starter activity · question 3',['Invent a book source: author, year, title and publisher.','Write a complete reference for it on page 14.']),
  f('Swap with a partner','pair',['Give your partner the source details and your reference.','Can they find the author, year, title and publisher? Suggest one improvement.'],{discussionId:'reference-peer-check'}),
  model('Compare a possible invented reference',['Author: Deniz Yılmaz · Year: 2023 · Title: Rivers in Our Town · Publisher: Blue Hill Press.','Write your own version before revealing.'],'Yılmaz, Deniz (2023), Rivers in Our Town, Blue Hill Press. Other consistent punctuation or ordering may be acceptable in the teacher’s chosen style.')
 ]),
 s('finish','Show what you learned',4,'Check each pupil can give a reason for crediting and identify a missing reference detail. Page 14 is the only supplied page; do not assume the content of the facing page.',[
  question('A reference includes author, year and publisher, but no book title. Is it complete for our class format?','Yes','No',2,'The title is missing; include it so a reader can identify the book.'),
  f('Exit ticket','think',['In your notebook, give one reason to credit a source.','Name two details that help a reader find a book.']),
  f('Lesson complete','listen',['Keep your reference and partner feedback.'],{final:true})
 ])
];
let elapsed=0; for(const stage of stages){stage.timeRange=`${elapsed}–${elapsed+stage.durationMinutes} min`;elapsed+=stage.durationMinutes;}
export const sevenACreditLesson={id:'gp-books-7a-research-credit-p14',title:'Research · Giving credit and writing references',durationMinutes:40,coreMinutes:40,contentRevision:1,gp:true,bookTrial:true,customVisuals:true,summary:true,bookNumber:8,workbookLesson:'Research · Giving credit',bookPages:'14',eyebrow:'7A · Book 8 · Research · p. 14',catalog:{subjectId:'global-perspectives-books',grades:[7],classes:['7a'],quarter:'Q2',unit:'Book 8 · Research · p. 14',order:7},openingScript:'Bring Book 8, page 14, a pencil and a notebook. Complete the photographed prior learning and starter activity. The reference examples are invented and are not real sources. No student internet or printing is needed.',pacingNote:'40-minute core; the teacher controls each reveal.',stages};
