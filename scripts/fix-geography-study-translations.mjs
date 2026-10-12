// Preserve numerical relationships that the local sentence model mistranslates.
import fs from 'node:fs';
const strings=JSON.parse(fs.readFileSync('students/source-strings.json','utf8'));
const overrides=JSON.parse(fs.readFileSync('students/translation-overrides.json','utf8').replace(/^\uFEFF/,''));
let fixed=0;
for(const source of strings){
 let m=source.match(/^Practice grid square (\d+)\. Rescue point A is (\d+) tenths east and (\d+) tenths north within the square\. Point B is (\d+) tenths east and (\d+) tenths north\.$/);
 if(m){const [,sq,a,b,c,d]=m;overrides[source]={
  ru:`Учебный квадрат сетки ${sq}. От нижнего левого угла точка A расположена на ${a}/10 ширины к востоку и ${b}/10 высоты к северу. Точка B: ${c}/10 ширины к востоку и ${d}/10 высоты к северу.`,
  zh:`练习方格 ${sq}。从左下角起，救援点 A 向东位于方格宽度的 ${a}/10 处，向北位于高度的 ${b}/10 处。点 B 向东为宽度的 ${c}/10，向北为高度的 ${d}/10。`,
  tr:`Alıştırma karesi ${sq}. Sol alt köşeden A noktası, kare genişliğinin ${a}/10'u kadar doğuda ve yüksekliğinin ${b}/10'u kadar kuzeydedir. B noktası genişliğin ${c}/10'u kadar doğuda ve yüksekliğin ${d}/10'u kadar kuzeydedir.`};fixed++;continue;}
 m=source.match(/^Fictional plan: a bridge crosses a river\. (\d+) homes cluster beside the bridge; (\d+) lie farther upstream\. A road links the bridge to a market\. The plan contains no interviews\.$/);
 if(m){const [,a,b]=m;overrides[source]={
  ru:`Вымышленный план: мост пересекает реку. Рядом с мостом расположены ${a} домов; ещё ${b} находятся дальше вверх по течению. Дорога соединяет мост с рынком. Интервью не проводились.`,
  zh:`虚构平面图：一座桥跨过河流。桥边聚集着 ${a} 栋住宅；另有 ${b} 栋位于更远的上游。一条道路连接桥和市场。图中没有访谈资料。`,
  tr:`Kurgusal planda bir köprü nehri geçer. Köprünün yanında ${a} ev kümelenmiştir; ${b} ev ise daha yukarıdadır. Bir yol köprüyü pazara bağlar. Görüşme verisi yoktur.`};fixed++;continue;}
 m=source.match(/^(\d+) cm\. Divide (\d+) by (\d+) when going from ground distance to map length\.$/);
 if(m){const [,result,a,b]=m;overrides[source]={ru:`${result} см. Чтобы перейти от расстояния на местности к длине на карте, разделите ${a} на ${b}.`,zh:`${result} 厘米。从实际距离换算为图上长度时，用 ${a} 除以 ${b}。`,tr:`${result} cm. Gerçek mesafeden harita uzunluğuna geçerken ${a} sayısını ${b} sayısına bölün.`};fixed++;}
}
fs.writeFileSync('students/translation-overrides.json',JSON.stringify(overrides,null,2)+'\n');
for(const lang of ['ru','zh','tr']){
 const file=`students/locales/${lang}.json`,data=JSON.parse(fs.readFileSync(file,'utf8'));
 for(const source of strings){if(overrides[source])data[source]=overrides[source][lang];if(lang==='zh'&&data[source])data[source]=data[source].replaceAll('可投资的展品标签','带有可调查问题的展示标签').replaceAll('沙丁板凳','树荫下的长椅');}
 fs.writeFileSync(file,JSON.stringify(data));
}
console.log(`Corrected ${fixed} numerical source patterns in all three study languages.`);
