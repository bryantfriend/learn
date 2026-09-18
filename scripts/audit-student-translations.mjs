import fs from 'node:fs';
const source=JSON.parse(fs.readFileSync('students/source-strings.json','utf8'));
const overrides=JSON.parse(fs.readFileSync('students/translation-overrides.json','utf8').replace(/^\uFEFF/,''));
for(const lang of ['ru','zh','tr']){
 const file=`students/locales/${lang}.json`,data=JSON.parse(fs.readFileSync(file,'utf8'));
 for(const [key,values] of Object.entries(overrides))if(key in data)data[key]=values[lang];
 const months={ru:['сентябрь','октябрь','ноябрь','декабрь','январь','февраль','март','апрель','май'],zh:['9月','10月','11月','12月','1月','2月','3月','4月','5月'],tr:['Eylül','Ekim','Kasım','Aralık','Ocak','Şubat','Mart','Nisan','Mayıs']};
 const monthNames=['September','October','November','December','January','February','March','April','May'];
 const units={ru:{kg:'кг',m:'м',cm:'см',km:'км'},zh:{kg:'千克',m:'米',cm:'厘米',km:'千米'},tr:{kg:'kg',m:'m',cm:'cm',km:'km'}};
 for(const key of source){
  if(/^[A-Z]$/.test(key)||/^[\d\s.,%−÷×=+:/()–-]+$/.test(key))data[key]=key;
  if(/^[\d\s.,%−÷×=+:/()–-]+ (kg|cm|km|m)\.$/.test(key))data[key]=key.replace(/(kg|cm|km|m)\.$/,m=>units[lang][m.slice(0,-1)]+'.');
  const foot=key.match(/^([\d.R]+) · ([A-Za-z]+) · (Q[1-4])$/);
  if(foot&&monthNames.includes(foot[2]))data[key]=foot[1]+' · '+months[lang][monthNames.indexOf(foot[2])]+' · '+foot[3];
  const measurement=key.match(/^(\d[\d,.]*) (kg|cm|km|m)$/);
  if(measurement)data[key]=measurement[1]+' '+units[lang][measurement[2]];
  if(/^Examine the source · [\d.]+$/.test(key))data[key]=({ru:'Изучи источник',zh:'分析资料',tr:'Kaynağı incele'})[lang]+' · '+key.split(' · ')[1];
  if(/^Practise · [\d.]+$/.test(key))data[key]=({ru:'Практика',zh:'练习',tr:'Alıştırma'})[lang]+' · '+key.split(' · ')[1];
 }
 for(const key of source){const parts=key.split('\n');if(parts.length>1&&parts.every(part=>data[part]))data[key]=parts.map(part=>data[part]).join('\n');}
 fs.writeFileSync(file,JSON.stringify(data));
 const missing=source.filter(s=>typeof data[s]!=='string'||!data[s].trim());
 const suspicious=source.filter(s=>data[s]&&data[s].length>Math.max(150,s.length*5));
 const numberChanges=source.filter(s=>{const before=s.match(/\d+(?:[.,]\d+)?/g)||[],after=data[s]?.match(/\d+(?:[.,]\d+)?/g)||[];return before.length&&JSON.stringify(before)!==JSON.stringify(after);});
 console.log(JSON.stringify({lang,translated:Object.keys(data).length,missing:missing.length,suspicious:suspicious.length,numberChanges:numberChanges.length,samples:['What is an Issue and a Perspective?','An issue is a matter people care about and can discuss or investigate.','A perspective is someone’s way of seeing an issue.'].map(key=>({en:key,translation:data[key]}))}));
 fs.writeFileSync(`output/translation-audit-${lang}.json`,JSON.stringify({missing,suspicious:suspicious.map(en=>({en,translation:data[en]})),numberChanges:numberChanges.map(en=>({en,translation:data[en]}))},null,2));
 if(missing.length)process.exitCode=1;
}
