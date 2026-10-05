import { writeFileSync } from 'node:fs';
import { onlineLessons } from '../src/lessons/online.js';
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const paragraphs = script => script.split(/\n\s*\n/).map(p => `<p>${escape(p.trim())}</p>`).join('\n');
const articles = onlineLessons.map(lesson => `<article id="${lesson.id}">
  <header><p class="eyebrow">ONLINE · 5 OCTOBER 2026</p><h1>${escape(lesson.title)}</h1>
  <p class="reference">${escape(lesson.curriculumReference)}</p></header>
  <aside><strong>Before reading</strong><p>Share the lesson screens in Meet, or keep this guide open as your script. Say: “Today I will explain the lesson. You can listen quietly. You do not need to turn on your microphone, write answers or use the chat.”</p>
  <p>${escape(lesson.pacingNote)}</p><p>Read each section slowly, pause for 20–30 seconds where prompted, then give the explanation yourself. Repeat key terms as needed. The scenarios and research numbers are invented teaching examples. This is an original adaptation of early book topics, not book text or an official answer key.</p></aside>
  ${lesson.stages.map((stage, i) => `<section><p class="eyebrow">PART ${i + 1} OF 6 · ABOUT 5 MINUTES</p><h2>${escape(stage.title)}</h2>${paragraphs(stage.frames[0].teacherScript)}</section>`).join('\n')}
  <aside><strong>Optional final 10 minutes for a 40-minute slot</strong><p>Reread the worked example in Part 4 slowly for about three minutes. Reread Part 5 and explain the mistake again for about three minutes. Finish by rereading Part 6, repeating each key term and its meaning for about four minutes. If the core reading already took the full slot, skip this recap. Pupils can continue listening; no response is required.</p></aside>
</article>`).join('\n');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Online lessons · Read-aloud guide · Learn</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f5f2ea;color:#202d35;font:21px/1.75 Georgia,serif}nav{background:#173944;color:white;padding:22px max(20px,calc((100vw - 900px)/2));font:16px/1.5 system-ui,sans-serif}nav strong{display:block;font-size:22px;margin-bottom:12px}nav a{color:white;display:inline-block;margin:4px 18px 4px 0}nav button{font:inherit;padding:8px 14px;margin-top:10px;border:1px solid #abc8cf;border-radius:6px;background:transparent;color:white;cursor:pointer}main{max-width:900px;padding:30px 24px 80px;margin:auto}h1{font-size:38px;line-height:1.2}h2{font-size:28px;line-height:1.3}section{margin:50px 0}p{margin:16px 0}.eyebrow,.reference,aside{font-family:system-ui,sans-serif}.eyebrow{font-size:13px;letter-spacing:.09em;font-weight:700;color:#36616e}.reference{font-size:17px}aside{font-size:17px;line-height:1.65;border-left:4px solid #3e7a85;padding:18px 22px;background:#e6eeeb}aside p:last-child{margin-bottom:0}article+article{border-top:2px solid #c4cdca;margin-top:80px;padding-top:40px}article[hidden]{display:none}@media(max-width:600px){body{font-size:19px}h1{font-size:29px}main{padding:20px 18px}}@media print{body{background:white;color:black;font-size:12pt;line-height:1.5}nav{display:none}main{max-width:none;padding:0}article{break-before:page}article:first-child{break-before:auto}section{margin:25px 0}h1{font-size:24pt}h2{font-size:18pt;break-after:avoid}aside{font-size:10pt}p{orphans:3;widows:3}}
</style></head><body><nav aria-label="Choose a reading script"><strong>Learn · Online read-aloud lessons</strong>
<a href="../index.html">← Back to Learn</a><a href="#all">All four scripts</a>
${onlineLessons.map(lesson => `<a href="#${lesson.id}">${escape(lesson.title.split(' · ')[0])}</a>`).join('\n')}
<br><button type="button" onclick="window.print()">Print / Save as PDF</button></nav><main>${articles}</main>
<script>function showLesson(){const id=location.hash.slice(1);const selected=document.getElementById(id);document.querySelectorAll('article').forEach(article=>{article.hidden=!!selected&&article!==selected;});}addEventListener('hashchange',showLesson);showLesson();</script>
</body></html>`;
writeFileSync(new URL('../docs/online-lessons.html', import.meta.url), html);
console.log('Built four continuous online reading scripts.');
