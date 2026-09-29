import test from 'node:test';import assert from 'node:assert/strict';
import {lessons} from '../src/lessons.js';import {subjectsFor,lessonsFor} from '../src/catalog.js';
import {englishVocabulary} from '../src/lessons/english-7b.js';import {worksheetFor} from '../src/worksheets.js';
test('English is a two-session subject for 7B with complete distinct 40-minute lessons',()=>{
 assert.equal(subjectsFor('7b').find(s=>s.id==='english').sessionsPerWeek,2);
 assert.ok(!subjectsFor('7a').some(s=>s.id==='english'));assert.ok(!subjectsFor('8').some(s=>s.id==='english'));
 const english=lessonsFor('7b','english').filter(l=>l.english);assert.equal(english.length,2);
 for(const l of english){assert.equal(l.durationMinutes,40);assert.equal(l.stages.reduce((n,s)=>n+s.durationMinutes,0),40);
  for(const s of l.stages){assert.ok(s.notes.includes('Mixed-level support'));assert.equal(s.frames.reduce((n,f)=>n+f.timerSeconds,0),s.durationMinutes*60);}
  const cards=l.stages.flatMap(s=>s.frames).find(f=>f.conversationCards).conversationCards;assert.equal(cards.rounds.length,3);assert.ok(cards.rounds.every(r=>r.roleA&&r.roleB&&r.support.length&&r.example.length));
 }
 assert.notDeepEqual(english[0].conversation,english[1].conversation);
});
test('Chinese vocabulary has contextual definitions and cafe worksheets retain their menu',()=>{
 for(const [word,v]of Object.entries(englishVocabulary)){assert.match(v.zh,/[\u3400-\u9fff]/,word);assert.ok(v.pinyin&&v.meaning&&v.example);}
 const cafe=lessons.find(l=>l.id==='g7b-english-02');const printed=JSON.stringify(worksheetFor(cafe,'lesson',lessons));assert.match(printed,/sandwich 4 tokens/);assert.match(printed,/juice 2 tokens/);
});
