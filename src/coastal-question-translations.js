import {registerTranslations,setLanguage,t} from './coastal-i18n.js';
import {geoStops,regions} from './coastal-geography.js';
import {cityQuestions} from './coastal-city-learning.js';
import {countryQuestions} from './coastal-learning.js';
import {stationArt} from './coastal-station-art.js';
// Translate complete sentences so question grammar does not rely on word replacement.
export function registerQuestionTranslations(world,language){
 const names=text=>{setLanguage('ru');const ru=t(text);setLanguage('ky');const ky=t(text);return [ru,ky];};
 for(const city of geoStops){const [ru,ky]=names(city.name),region=regions.find(r=>r.id===city.region),[rr,kr]=names(region.name),art=stationArt[city.id],[rl,kl]=names(art.landmark);
  for(const q of cityQuestions(city.id)){
   const topic=q.id.split(':').at(-1);let pair;
   if(topic==='country')pair=[`В ${world==='kyrgyzstan'?'каком регионе':'какой стране'} находится ${ru}?`,`${ky} кайсы ${world==='kyrgyzstan'?'аймакта':'өлкөдө'} жайгашкан?`];
   if(topic==='landmark')pair=[`Какая достопримечательность находится в городе ${ru}?`,`${ky}: кайсы көрүнүктүү жер ушул шаарга таандык?`];
   if(topic==='type')pair=[`Что представляет собой ${rl}?`,`${kl}: көрүнүктүү жердин түрү кандай?`];
   if(topic==='water')pair=[`Какой ${q.prompt.startsWith('Which landscape')?'ландшафт':'водоём'} связан с городом ${ru}?`,`${ky}: кайсы ${q.prompt.startsWith('Which landscape')?'ландшафт':'суу объектиси'} ушул жерге таандык?`];
   if(topic==='fact'&&world==='kyrgyzstan')pair=[`В какой стране находится ${ru}?`,`${ky} кайсы өлкөдө жайгашкан?`];
   if(pair)registerTranslations(q.prompt,...pair);
   if(topic==='country')registerTranslations(q.explanation,`${ru} — ${rr}.`,`${ky} — ${kr}.`);
   if(topic==='landmark')registerTranslations(q.explanation,`${rl} — достопримечательность города ${ru}.`,`${kl} — ${ky} шаарынын көрүнүктүү жери.`);
   if(topic==='type'){const [rt,kt]=names(q.options[0]);registerTranslations(q.explanation,`${rl}: ${rt}.`,`${kl}: ${kt}.`);}
   if(topic==='water'){const [rw,kw]=names(q.options[0]);registerTranslations(q.explanation,`${ru}: ${rw}.`,`${ky}: ${kw}.`);}
  }
 }
 for(const region of regions){const [ru,ky]=names(region.name);for(const q of countryQuestions(region.id)){if(q.prompt.startsWith('What is'))registerTranslations(q.prompt,world==='kyrgyzstan'?`Какой город — областной центр региона «${ru}»?`:`Как называется столица страны «${ru}»?`,`${ky}: ${world==='kyrgyzstan'?'облустун борбору':'өлкөнүн борбору'} кайсы?`);if(q.prompt.startsWith('Which landmark'))registerTranslations(q.prompt,`Какую достопримечательность вы посетите в регионе «${ru}»?`,`${ky}: кайсы көрүнүктүү жерге барсаңыз болот?`);}
  registerTranslations('Explore '+region.name+' in your atlas','Открыть в атласе: '+ru,'Атластан ачуу: '+ky);
 }
 setLanguage(language);
}
