import test from 'node:test';
import assert from 'node:assert/strict';
import en from '../study-guides/data/en.js';
import ru from '../study-guides/data/ru.js';
import tr from '../study-guides/data/tr.js';
import zh from '../study-guides/data/zh.js';
import {visualIds} from '../study-guides/infographics.js';
import {breakSpacesText} from '../src/lessons/gp-workbook-research-2.js';
import {lunchResearchText} from '../src/lessons/gp-workbook-research-2-7a.js';
import {grade8ResearchText} from '../src/lessons/gp-workbook-research-2-8.js';
test('complete classroom sources are preserved, including proposals and scope',()=>{assert.deepEqual(en.cases['7a'].passages,lunchResearchText);assert.deepEqual(en.cases['7b'].passages,breakSpacesText);assert.deepEqual(en.cases['8'].passages,grade8ResearchText);assert.equal(en.cases['7a'].summary.length,3);for(const p of en.cases['7a'].summary)assert.equal((p.match(/[.!?](?:\s|$)/g)||[]).length,2);assert.match(en.cases['8'].task,/ONE feature/);assert.match(en.cases['7b'].task,/whole-text/);});
for(const [lang,d]of Object.entries({en,ru,tr,zh})){test(`${lang}: substantive translations include every topic, reading, model and diagram label`,()=>{assert.deepEqual(Object.keys(d.ui),Object.keys(en.ui));assert.deepEqual(Object.keys(d.labels),Object.keys(en.labels));assert.deepEqual(Object.keys(d.topics),Object.keys(en.topics));for(const[id,t]of Object.entries(d.topics)){assert.ok(t.body.length>=2);assert.ok(t.facts.length>=3);assert.equal(t.check.choices.length,3);assert.ok(t.check.choices[t.check.answer]);assert.ok(t.check.explanation.length>(lang==='zh'?8:25));for(const visual of t.visuals)assert.ok(visualIds.includes(visual));if(lang!=='en'){assert.notEqual(t.title,en.topics[id].title);assert.notDeepEqual(t.body,en.topics[id].body);}}for(const[id,c]of Object.entries(d.cases)){assert.equal(c.passages.length,3);assert.equal(c.headings.length,3);assert.equal(c.notes.length,3);assert.ok(c.task.length>(lang==='zh'?25:60));assert.ok(c.reflection.length>(lang==='zh'?20:50));if(lang!=='en')assert.notDeepEqual(c.passages,en.cases[id].passages);}});}
test('33 infographic designs cover the curriculum; weather mechanisms retain limits',()=>{assert.equal(new Set(visualIds).size,33);assert.match(en.topics.vortex.body[0],/does not guarantee UK snow/);assert.match(en.topics.vortex.body[1],/reaching the ground/);assert.match(en.topics.snow.body[1],/New snow need not/);assert.equal(zh.topics.mainIdea.check.choices[1],'准确概括所有段落的共同内容');});
