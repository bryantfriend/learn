"""Teacher-only, deterministic 7A examination packs. No web publication."""
from pathlib import Path
import random, math, json, itertools, hashlib
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf/7a-exams';OUT.mkdir(parents=True,exist_ok=True)
WORK=ROOT/'tmp/pdfs/7a-exams';WORK.mkdir(parents=True,exist_ok=True)
for name,file in [('Arial','arial.ttf'),('ArialBold','arialbd.ttf')]:
 pdfmetrics.registerFont(TTFont(name,'C:/Windows/Fonts/'+file))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold',italic='Arial',boldItalic='ArialBold')
W,H=A4;M=36;CW=W-2*M
LANGS=['en']*17+['ru']*5+['tr']
L={
 'en':dict(gp='Global Perspectives',geo='Geography',exam='EXAMINATION PAPER',term='Term 1',name='Student name',grade='Grade / Class',subject='Subject',date='Date',version='Exam version',duration='Duration',minutes='60 minutes',score='Final score',signature="Teacher's signature",instructions='INSTRUCTIONS',rules=['Answer all 25 questions. Choose ONE answer for each question.','Circle A, B, C or D beside each question. Each correct answer earns 4 marks.','Use a blue or black pen. Work on your own. No notes or devices.','Use the reading or map on page 1. Check your work before finishing.'],reading='Read this made-up school example',baseline='Made-up baseline measurements before any trial',day='Day',waste='Uneaten food (kg)',map='Practice map',key='Map key',north='North',school='School',pond='Pond',bridge='Bridge',wood='Woodland',mapnote='North is up. A grid reference gives the column letter, then the row number. The sketch is not to scale; use the written lengths in questions.',data='Values for this paper',scale='Scale',ruler='Ruler line',route='Bending route',fromto='from {start} cm to {end} cm',questions='Multiple choice questions',marks='25 questions x 4 marks = 100 marks',page='Page',of='of',end='End of paper. Check that you have answered all 25 questions.'),
 'ru':dict(gp='Глобальные перспективы',geo='География',exam='ЭКЗАМЕНАЦИОННАЯ РАБОТА',term='Четверть 1',name='Имя ученика',grade='Класс',subject='Предмет',date='Дата',version='Вариант',duration='Время',minutes='60 минут',score='Итоговый балл',signature='Подпись учителя',instructions='ИНСТРУКЦИИ',rules=['Ответьте на все 25 вопросов. Выберите ОДИН ответ на каждый вопрос.','Обведите A, B, C или D рядом с вопросом. За каждый верный ответ - 4 балла.','Пишите синей или чёрной ручкой. Работайте самостоятельно. Без записей и устройств.','Используйте текст или карту на странице 1. В конце проверьте ответы.'],reading='Прочитайте вымышленный пример о школе',baseline='Вымышленные исходные измерения до испытания',day='День',waste='Остатки еды (кг)',map='Учебная карта',key='Условные обозначения',north='Север',school='Школа',pond='Пруд',bridge='Мост',wood='Лес',mapnote='Север вверху. Ссылка на клетку: сначала буква столбца, затем номер строки. Схема не в масштабе; для расчётов используйте длины из вопросов.',data='Данные этого варианта',scale='Масштаб',ruler='Отрезок на линейке',route='Маршрут с поворотом',fromto='от {start} см до {end} см',questions='Вопросы с выбором ответа',marks='25 вопросов x 4 балла = 100 баллов',page='Страница',of='из',end='Конец работы. Проверьте ответы на все 25 вопросов.'),
 'tr':dict(gp='Küresel Perspektifler',geo='Coğrafya',exam='SINAV KAĞIDI',term='1. Dönem',name='Öğrencinin adı',grade='Sınıf',subject='Ders',date='Tarih',version='Sınav kodu',duration='Süre',minutes='60 dakika',score='Toplam puan',signature='Öğretmenin imzası',instructions='YÖNERGELER',rules=['25 sorunun hepsini cevaplayın. Her soruda BİR cevap seçin.','Her soruda A, B, C veya D harfini daire içine alın. Her doğru cevap 4 puandır.','Mavi veya siyah kalem kullanın. Tek başınıza çalışın. Not ve cihaz kullanmayın.','1. sayfadaki metni veya haritayı kullanın. Bitirmeden önce cevaplarınızı kontrol edin.'],reading='Okulla ilgili bu hayalî örneği okuyun',baseline='Herhangi bir denemeden önceki hayalî başlangıç ölçümleri',day='Gün',waste='Yenmemiş yemek (kg)',map='Alıştırma haritası',key='Harita anahtarı',north='Kuzey',school='Okul',pond='Gölet',bridge='Köprü',wood='Orman',mapnote='Kuzey yukarıdadır. Kare adresinde önce sütun harfi, sonra satır numarası yazılır. Çizim ölçekli değildir; hesaplamalarda sorulardaki uzunlukları kullanın.',data='Bu sınavın değerleri',scale='Ölçek',ruler='Cetveldeki çizgi',route='Dönemeçli yol',fromto='{start} cm ile {end} cm arası',questions='Çoktan seçmeli sorular',marks='25 soru x 4 puan = 100 puan',page='Sayfa',of='/',end='Sınav bitti. 25 sorunun hepsini cevapladığınızı kontrol edin.')
}
PASSAGE={
 'en':[
 'A team asks how the school could reduce uneaten lunch food while meeting pupils\' needs. It plans to measure waste over several days with the same method and record the meals served. Measurements show amounts, but cannot explain pupils\' reasons on their own.',
 'The team also plans to ask pupils neutral questions about their preferences and reasons. It will compare replies with measurements before suggesting changes. It must say whose views were included and what information is still missing.',
 'One proposed trial is smaller first portions, with more food available if wanted. This trial has not been tested. The table gives made-up baseline measurements from three days, before any trial. These numbers do not prove why pupils left food.'
 ],
 'ru':[
 'Группа изучает, как школа могла бы уменьшить остатки обеда и учитывать потребности учеников. Она планирует несколько дней измерять остатки одним и тем же способом и записывать меню. Измерения показывают количество, но сами по себе не объясняют причины.',
 'Группа также планирует задать ученикам нейтральные вопросы об их предпочтениях и причинах. Перед предложением изменений она сравнит ответы с измерениями. Нужно указать, чьи мнения учтены и каких сведений ещё не хватает.',
 'Предложено испытать меньшие первые порции с возможностью взять добавку. Это ещё не проверено. В таблице приведены вымышленные исходные измерения за три дня до испытания. Эти числа не доказывают, почему ученики оставляли еду.'
 ],
 'tr':[
 'Bir ekip, öğrencilerin ihtiyaçlarını karşılayarak okulda yenmemiş öğle yemeğini nasıl azaltabileceğini araştırır. Birkaç gün boyunca aynı yöntemle yemek artıklarını ölçmeyi ve menüleri kaydetmeyi planlar. Ölçümler miktarı gösterir; tek başına öğrencilerin nedenlerini açıklamaz.',
 'Ekip ayrıca öğrencilere tercihleri ve nedenleri hakkında tarafsız sorular sormayı planlar. Değişiklik önermeden önce cevapları ölçümlerle karşılaştıracaktır. Kimlerin görüşlerinin alındığını ve hangi bilgilerin eksik olduğunu belirtmelidir.',
 'Önerilen bir deneme, ilk porsiyonları küçültmek ve isteyenlere ek yemek vermektir. Bu deneme henüz yapılmamıştır. Tablo, denemeden önceki üç güne ait hayalî başlangıç ölçümlerini gösterir. Bu sayılar, öğrencilerin neden yemek bıraktığını kanıtlamaz.'
 ]
}
BANK={'gp':[],'geo':[]}
def q(subject,code,stems,choices,reason):
 assert len(stems)==3 and len(choices)==3 and all(len(c)==4 for c in choices)
 BANK[subject].append(dict(code=code,stem=dict(zip(['en','ru','tr'],stems)),choices=dict(zip(['en','ru','tr'],choices)),reason=reason))

# The first semantic answer is correct before each paper's independent shuffle.
q('gp','GP01',[
 'Which question is most neutral?','Какой вопрос наиболее нейтрален?','Hangi soru en tarafsızdır?'],[
 ['What do pupils like and dislike about lunch?','Why does every pupil hate lunch?','Why is all school food bad?','Why does nobody want healthy food?'],
 ['Что ученикам нравится и не нравится в обеде?','Почему все ученики ненавидят обед?','Почему вся школьная еда плохая?','Почему никто не хочет полезную еду?'],
 ['Öğrenciler öğle yemeğinde neleri sever ve sevmez?','Neden her öğrenci öğle yemeğinden nefret eder?','Neden bütün okul yemekleri kötüdür?','Neden kimse sağlıklı yemek istemez?']],
 'A neutral question allows positive, negative and mixed responses.')
q('gp','GP02',[
 'Which research question is most focused?','Какой исследовательский вопрос наиболее конкретен?','Hangi araştırma sorusu en odaklıdır?'],[
 ['How much lunch food does our school waste this week?','How can every school solve every problem?','Why do people eat?','What is everything about food?'],
 ['Сколько еды остаётся после обеда в нашей школе за эту неделю?','Как всем школам решить все проблемы?','Почему люди едят?','Что вообще известно о еде?'],
 ['Okulumuz bu hafta öğle yemeğinde ne kadar yemek artığı oluşturur?','Bütün okullar bütün sorunları nasıl çözer?','İnsanlar neden yemek yer?','Yemek hakkında her şey nedir?']],
 'The question specifies the place, issue and time period.')
q('gp','GP03',[
 'Which method best measures the amount of uneaten food?','Какой метод лучше всего измеряет количество остатков еды?','Yenmemiş yemek miktarını en iyi hangi yöntem ölçer?'],[
 ['Weigh the leftovers using the same method each day.','Ask one pupil to guess the weight.','Read a story about a restaurant.','Count how many pupils smile.'],
 ['Взвешивать остатки одним способом каждый день.','Попросить одного ученика угадать вес.','Прочитать рассказ о ресторане.','Посчитать улыбающихся учеников.'],
 ['Artıkları her gün aynı yöntemle tartmak.','Bir öğrenciden ağırlığı tahmin etmesini istemek.','Bir restoran hakkında hikâye okumak.','Gülümseyen öğrencileri saymak.']],
 'Repeated weighing directly measures amounts, rather than preferences.')
q('gp','GP04',[
 'Which method best explores why pupils leave food?','Какой метод лучше помогает узнать, почему ученики оставляют еду?','Öğrencilerin neden yemek bıraktığını en iyi hangi yöntem araştırır?'],[
 ['Ask pupils neutral questions about their reasons.','Only weigh the leftovers.','Only count the tables.','Only photograph the kitchen door.'],
 ['Задать ученикам нейтральные вопросы о причинах.','Только взвесить остатки.','Только посчитать столы.','Только сфотографировать дверь кухни.'],
 ['Öğrencilere nedenleri hakkında tarafsız sorular sormak.','Yalnızca artıkları tartmak.','Yalnızca masaları saymak.','Yalnızca mutfak kapısını fotoğraflamak.']],
 'Pupils can report their own reasons; amounts alone cannot supply them.')
q('gp','GP05',[
 'What can weighing leftovers NOT show on its own?','Что взвешивание остатков само по себе НЕ показывает?','Artıkları tartmak tek başına neyi GÖSTEREMEZ?'],[
 ['Why pupils left the food.','The measured weight of leftovers.','Which recorded day had more waste.','A difference between two recorded weights.'],
 ['Почему ученики оставили еду.','Измеренный вес остатков.','В какой из записанных дней остатков больше.','Разницу между двумя записанными весами.'],
 ['Öğrencilerin yemeği neden bıraktığını.','Artıkların ölçülen ağırlığını.','Kaydedilen hangi günde daha çok artık olduğunu.','Kaydedilen iki ağırlık arasındaki farkı.']],
 'Measurement establishes amounts, not the pupils\' reasons.')
q('gp','GP06',[
 'A pupil asks only two close friends. What is the main limit?','Ученик опросил только двух близких друзей. В чём главное ограничение?','Bir öğrenci sadece iki yakın arkadaşına sorar. Temel sınırlılık nedir?'],[
 ['Their views may not represent other pupils.','Two people always represent the whole school.','Friends can never give useful information.','A small sample proves every cause.'],
 ['Их мнения могут не отражать мнения других учеников.','Два человека всегда представляют всю школу.','Друзья никогда не дают полезных сведений.','Малая выборка доказывает все причины.'],
 ['Görüşleri diğer öğrencileri temsil etmeyebilir.','İki kişi her zaman bütün okulu temsil eder.','Arkadaşlar asla yararlı bilgi veremez.','Küçük bir örneklem her nedeni kanıtlar.']],
 'The sample is small and narrowly selected; do not generalise to everyone.')
q('gp','GP07',[
 'Before using an article as evidence, what should you check?','Что нужно проверить перед использованием статьи как доказательства?','Bir yazıyı kanıt olarak kullanmadan önce neyi kontrol etmelisiniz?'],[
 ['Its author, date, purpose and supporting evidence.','Only its colourful pictures.','Only whether its title agrees with you.','Only how many times it says "true".'],
 ['Автора, дату, цель и подтверждающие данные.','Только яркие картинки.','Только совпадает ли заголовок с вашим мнением.','Только сколько раз написано «правда».'],
 ['Yazarını, tarihini, amacını ve destekleyici kanıtlarını.','Sadece renkli resimlerini.','Sadece başlığının sizinle aynı fikirde olup olmadığını.','Sadece kaç kez "doğru" dediğini.']],
 'Evaluate the source and its support, rather than appearance or agreement.')
q('gp','GP08',[
 'Why combine waste measurements with interviews?','Зачем сочетать измерение остатков с интервью?','Artık ölçümleri ile görüşmeler neden birlikte kullanılır?'],[
 ['They provide amounts and reported reasons.','They guarantee that every pupil agrees.','They remove the need to record evidence.','They prove a proposed trial already worked.'],
 ['Они дают количество и сообщённые учениками причины.','Они гарантируют согласие всех учеников.','Они отменяют необходимость записывать данные.','Они доказывают успех ещё не проведённого испытания.'],
 ['Miktarları ve bildirilen nedenleri sağlarlar.','Her öğrencinin aynı fikirde olmasını garanti ederler.','Kanıt kaydetme ihtiyacını ortadan kaldırırlar.','Henüz yapılmamış bir denemenin işe yaradığını kanıtlarlar.']],
 'The methods answer different, complementary parts of the question.')
q('gp','GP09',[
 'Why use the same weighing method each day?','Зачем каждый день использовать один способ взвешивания?','Neden her gün aynı tartma yöntemi kullanılır?'],[
 ['To make the measurements easier to compare fairly.','To force all weights to be identical.','To avoid recording the menu.','To learn every pupil\'s reason without asking.'],
 ['Чтобы корректнее сравнивать измерения.','Чтобы все значения веса стали одинаковыми.','Чтобы не записывать меню.','Чтобы узнать причины всех учеников без вопросов.'],
 ['Ölçümleri daha adil biçimde karşılaştırmak için.','Bütün ağırlıkları aynı yapmak için.','Menüyü kaydetmemek için.','Sormadan her öğrencinin nedenini öğrenmek için.']],
 'Consistent methods improve comparability; they do not force identical results.')
q('gp','GP10',[
 'What is the main idea of the reading on page 1?','Какова главная мысль текста на странице 1?','1. sayfadaki metnin ana fikri nedir?'],[
 ['Plan an investigation of lunch waste using amounts and pupils\' reasons.','Prove that all pupils dislike every meal.','Describe only the colour of a school building.','Announce that a trial has solved the problem.'],
 ['Спланировать исследование остатков еды по количеству и причинам учеников.','Доказать, что всем ученикам не нравятся все блюда.','Описать только цвет здания школы.','Объявить, что испытание уже решило проблему.'],
 ['Miktarlar ve öğrencilerin nedenleriyle yemek artığını araştırmayı planlamak.','Bütün öğrencilerin bütün yemekleri sevmediğini kanıtlamak.','Yalnızca okul binasının rengini anlatmak.','Bir denemenin sorunu çözdüğünü duyurmak.']],
 'The main idea connects all paragraphs without inventing trial results.')
q('gp','GP11',[
 'Which title best fits the reading?','Какой заголовок лучше всего подходит к тексту?','Metne en uygun başlık hangisidir?'],[
 ['Investigating school lunch waste','The trial has already worked everywhere','All pupils have the same opinion','A guide to building school kitchens'],
 ['Исследование остатков школьного обеда','Испытание уже помогло везде','У всех учеников одинаковое мнение','Руководство по строительству школьной кухни'],
 ['Okuldaki yemek artıklarını araştırmak','Deneme her yerde başarıya ulaştı','Bütün öğrenciler aynı fikirde','Okul mutfağı inşa etme rehberi']],
 'The title covers the investigation without claiming an untested solution works.')
q('gp','GP12',[
 'Which is a useful subject term for notes about this investigation?','Какой термин полезен для заметок об этом исследовании?','Bu araştırmanın notları için hangi konu terimi yararlıdır?'],[
 ['Measurement','Beautiful','Suddenly','Yesterday'],['Измерение','Красивый','Внезапно','Вчера'],['Ölçüm','Güzel','Aniden','Dün']],
 'Measurement names a relevant research concept, unlike the everyday words.')
q('gp','GP13',[
 'Which note best keeps the meaning of the proposed trial?','Какая заметка точнее передаёт смысл предложенного испытания?','Önerilen denemenin anlamını en iyi hangi not korur?'],[
 ['Smaller first portions proposed; more available; not tested yet.','Smaller portions proved successful for everyone.','All pupils must eat less; no extra food allowed.','The team has stopped collecting information.'],
 ['Предложены меньшие первые порции; есть добавка; ещё не проверено.','Меньшие порции доказали успех для всех.','Все должны есть меньше; добавка запрещена.','Группа прекратила сбор сведений.'],
 ['Daha küçük ilk porsiyon önerildi; ek yemek var; henüz denenmedi.','Küçük porsiyonların herkes için başarılı olduğu kanıtlandı.','Herkes daha az yemeli; ek yemek yasak.','Ekip bilgi toplamayı durdurdu.']],
 'The note preserves the proposal, optional extra food and lack of trial results.')
q('gp','GP14',[
 'A source says "could reduce waste". Which change keeps its meaning?','Источник говорит «могло бы уменьшить остатки». Какая замена сохраняет смысл?','Bir kaynak "artıkları azaltabilir" der. Hangi değişiklik anlamı korur?'],[
 ['Might reduce waste.','Has proved that waste will disappear.','Always reduces waste in every school.','Cannot possibly affect waste.'],
 ['Возможно, уменьшит остатки.','Доказано, что остатки исчезнут.','Всегда уменьшает остатки в каждой школе.','Никак не может повлиять на остатки.'],
 ['Artıkları belki azaltır.','Artıkların yok olacağını kanıtladı.','Her okulda artıkları her zaman azaltır.','Artıkları hiçbir şekilde etkileyemez.']],
 'Might retains uncertainty; the other options change the claim.')
q('gp','GP15',[
 'What should a good summary do?','Что должно быть в хорошем кратком изложении?','İyi bir özet ne yapmalıdır?'],[
 ['Keep the key meaning in shorter, own-word sentences.','Copy every sentence without selecting ideas.','Add an unsupported opinion as a fact.','Replace all topic terms, even if meaning is lost.'],
 ['Сохранить главный смысл в более коротких предложениях своими словами.','Скопировать все предложения без отбора мыслей.','Добавить неподтверждённое мнение как факт.','Заменить все термины, даже потеряв смысл.'],
 ['Temel anlamı daha kısa cümlelerle kendi sözleriyle vermeli.','Fikir seçmeden her cümleyi kopyalamalı.','Desteklenmeyen bir görüşü gerçek olarak eklemeli.','Anlam kaybolsa da bütün konu terimlerini değiştirmeli.']],
 'A summary selects key ideas, is concise and preserves meaning in the learner\'s wording.')
q('gp','GP16',[
 'In the 7A workbook task, what is needed for EACH paragraph?','Что нужно для КАЖДОГО абзаца в задании 7A по рабочей тетради?','7A çalışma kitabı görevinde HER paragraf için ne gerekir?'],[
 ['A sub-heading and two own-word sentences.','A copied paragraph with no changes.','One title for the whole text and no sentences.','Five unrelated facts about a different topic.'],
 ['Подзаголовок и два предложения своими словами.','Скопированный абзац без изменений.','Один заголовок всего текста без предложений.','Пять несвязанных фактов на другую тему.'],
 ['Bir alt başlık ve kendi sözleriyle iki cümle.','Hiç değiştirilmeden kopyalanmış bir paragraf.','Bütün metin için bir başlık ve hiç cümle olmaması.','Başka bir konuda ilgisiz beş bilgi.']],
 'This is the class-specific Book 8 paragraph-summary task.')
q('gp','GP17',[
 'Which feedback best helps a writer correct an unsupported claim?', 'Какой отзыв лучше помогает исправить неподтверждённое утверждение?','Hangi geri bildirim, desteklenmeyen bir iddiayı düzeltmeye en çok yardım eder?'],[
 ['Change "proved" to "proposed", because no trial result is given.','Good work!','Make it better somehow.','Keep "proved" because your friend likes it.'],
 ['Замените «доказано» на «предложено»: результатов испытания нет.','Хорошая работа!','Как-нибудь сделайте лучше.','Оставьте «доказано»: вашему другу нравится.'],
 ['"Kanıtlandı" yerine "önerildi" yaz; çünkü deneme sonucu verilmemiş.','Güzel çalışma!','Bir şekilde daha iyi yap.','Arkadaşın sevdiği için "kanıtlandı" ifadesini koru.']],
 'Useful feedback identifies the wording, explains the evidence problem and suggests a revision.')
q('gp','GP18',[
 'Two partners disagree about a summary. What should they do next?','Два ученика не согласны с кратким изложением. Что делать дальше?','İki öğrenci bir özet hakkında anlaşamaz. Sonra ne yapmalıdırlar?'],[
 ['Return to the source and check the meaning.','Choose whoever speaks louder.','Accept the answer of the faster writer.','Ignore the source and vote on the facts.'],
 ['Вернуться к источнику и проверить смысл.','Выбрать того, кто говорит громче.','Принять ответ того, кто быстрее пишет.','Не читать источник и проголосовать за факты.'],
 ['Kaynağa dönüp anlamı kontrol etmeliler.','Daha yüksek sesle konuşanı seçmeliler.','Daha hızlı yazanın cevabını kabul etmeliler.','Kaynağı bırakıp gerçekler için oylama yapmalılar.']],
 'Revisions should be supported by the source, not popularity or speed.')
q('gp','GP19',[
 'Which reflection gives evidence of learning?','Какое размышление содержит пример обучения?','Hangi değerlendirme, öğrenmeye dair kanıt verir?'],[
 ['I replaced "all pupils" with "pupils asked" because the sample was limited.','I was perfect at everything.','I finished before everyone.','I will never check a source again.'],
 ['Я заменил «все ученики» на «опрошенные ученики»: выборка ограничена.','Я всё сделал идеально.','Я закончил раньше всех.','Я больше никогда не проверю источник.'],
 ['Örneklem sınırlı olduğu için "bütün öğrenciler" yerine "sorulan öğrenciler" yazdım.','Her şeyi kusursuz yaptım.','Herkesten önce bitirdim.','Bir daha hiçbir kaynağı kontrol etmeyeceğim.']],
 'The response identifies a concrete revision and explains why it was needed.')
q('gp','GP20',[
 'The team asks only pupils who eat in the canteen. What should it report?','Группа опросила только питающихся в столовой. Что нужно указать?','Ekip yalnızca yemekhanede yiyen öğrencilere sorar. Neyi belirtmelidir?'],[
 ['Pupils who bring lunch from home were not included.','Every pupil in the school gave a view.','The replies represent every country.','The survey proves all pupils leave food.'],
 ['Ученики с обедом из дома не были включены.','Каждый ученик школы высказал мнение.','Ответы представляют все страны.','Опрос доказывает, что все оставляют еду.'],
 ['Evden yemek getiren öğrencilerin dahil edilmediğini.','Okuldaki her öğrencinin görüş verdiğini.','Cevapların her ülkeyi temsil ettiğini.','Anketin bütün öğrencilerin yemek bıraktığını kanıtladığını.']],
 'State the sample boundary and the missing group.')
q('gp','GP21',[
 'What does the reading establish about smaller first portions?','Что текст сообщает о меньших первых порциях?','Metin, daha küçük ilk porsiyonlar hakkında ne söyler?'],[
 ['They are a proposed trial, with no trial results yet.','They have already solved waste in all schools.','They guarantee every pupil will agree.','They prove the menu caused all waste.'],
 ['Это предложенное испытание; результатов ещё нет.','Они уже решили проблему во всех школах.','Они гарантируют согласие всех учеников.','Они доказывают, что меню вызвало все остатки.'],
 ['Bunlar önerilen bir denemedir; henüz deneme sonucu yoktur.','Bütün okullarda artık sorununu çözmüştür.','Her öğrencinin aynı fikirde olmasını garanti eder.','Bütün artıkların nedeninin menü olduğunu kanıtlar.']],
 'Distinguish a proposal from a tested outcome.')
q('gp','GP22',[
 'How much uneaten food was recorded on Day 1?','Сколько остатков еды записано в день 1?','1. gün ne kadar yenmemiş yemek kaydedilmiştir?'],[
 ['{d1} kg','{d2} kg','{d3} kg','{total} kg'],['{d1} кг','{d2} кг','{d3} кг','{total} кг'],['{d1} kg','{d2} kg','{d3} kg','{total} kg']],
 'Read the Day 1 value in this version\'s baseline table.')
q('gp','GP23',[
 'Which day in the table has the greatest recorded waste?','В какой день в таблице записано больше всего остатков?','Tabloda en çok yemek artığı hangi gündedir?'],[
 ['Day {maxday}','Day {otherday1}','Day {otherday2}','All three days are equal.'],['День {maxday}','День {otherday1}','День {otherday2}','Во все три дня поровну.'],['{maxday}. gün','{otherday1}. gün','{otherday2}. gün','Üç günde de eşit.']],
 'Compare all three values; the maximum day is varied between papers.')
q('gp','GP24',[
 'What is the difference between the greatest and smallest recorded waste?','Какова разница между наибольшим и наименьшим количеством остатков?','En çok ve en az yemek artığı arasındaki fark nedir?'],[
 ['{diff} kg','{diffwrong1} kg','{diffwrong2} kg','{total} kg'],['{diff} кг','{diffwrong1} кг','{diffwrong2} кг','{total} кг'],['{diff} kg','{diffwrong1} kg','{diffwrong2} kg','{total} kg']],
 'Subtract the smallest baseline amount from the greatest amount.')
q('gp','GP25',[
 'What is the total recorded waste over all three days?','Сколько всего остатков записано за три дня?','Üç günde kaydedilen toplam yemek artığı ne kadardır?'],[
 ['{total} kg','{sumwrong1} kg','{sumwrong2} kg','{sumwrong3} kg'],['{total} кг','{sumwrong1} кг','{sumwrong2} кг','{sumwrong3} кг'],['{total} kg','{sumwrong1} kg','{sumwrong2} kg','{sumwrong3} kg']],
 'Add the three daily baseline values; the total is not evidence of a cause.')

q('geo','GE01',[
 'What does a map key explain?','Что объясняют условные обозначения карты?','Harita anahtarı neyi açıklar?'],[
 ['The meaning of the symbols on that map.','The age of every building.','The weather on every day.','The names of all map readers.'],['Значение символов на этой карте.','Возраст каждого здания.','Погоду в каждый день.','Имена всех читателей карты.'],['O haritadaki sembollerin anlamını.','Her binanın yaşını.','Her günün hava durumunu.','Haritayı okuyan herkesin adını.']],
 'The key defines the symbols for the particular map.')
q('geo','GE02',[
 'What is the main purpose of a map title?','Для чего прежде всего нужен заголовок карты?','Harita başlığının temel amacı nedir?'],[
 ['To identify the place or information shown.','To measure a line in centimetres.','To show every compass direction.','To explain the price of a ruler.'],['Указать место или показанную информацию.','Измерить линию в сантиметрах.','Показать все направления компаса.','Объяснить цену линейки.'],['Gösterilen yeri veya bilgiyi belirtmek.','Bir çizgiyi santimetreyle ölçmek.','Bütün pusula yönlerini göstermek.','Bir cetvelin fiyatını açıklamak.']],
 'The title identifies the map\'s subject or location.')
q('geo','GE03',[
 'What does a north arrow establish on a map?','Что показывает стрелка севера на карте?','Haritadaki kuzey oku neyi gösterir?'],[
 ['Which direction is north.','How old the map is.','How many people live there.','How long every road is.'],['В каком направлении север.','Сколько лет карте.','Сколько людей там живёт.','Длину каждой дороги.'],['Kuzeyin hangi yönde olduğunu.','Haritanın kaç yıllık olduğunu.','Orada kaç kişinin yaşadığını.','Her yolun uzunluğunu.']],
 'The arrow establishes orientation.')
q('geo','GE04',[
 'What is a compass rose?','Что такое роза направлений?','Pusula gülü nedir?'],[
 ['A diagram that shows directions.','A tool that measures rainfall.','A list of building ages.','A line that measures food waste.'],['Схема, показывающая направления.','Прибор для измерения осадков.','Список возрастов зданий.','Линия для измерения остатков еды.'],['Yönleri gösteren bir şekil.','Yağışı ölçen bir araç.','Binaların yaş listesi.','Yemek artıklarını ölçen bir çizgi.']],
 'A compass rose is a direction diagram, rather than a measuring instrument.')
q('geo','GE05',[
 'Which order gives the four main directions clockwise from north?','В каком порядке идут главные направления по часовой стрелке от севера?','Kuzeyden başlayarak saat yönünde dört ana yönün sırası hangisidir?'],[
 ['North, east, south, west.','North, west, south, east.','North, south, east, west.','North, east, west, south.'],['Север, восток, юг, запад.','Север, запад, юг, восток.','Север, юг, восток, запад.','Север, восток, запад, юг.'],['Kuzey, doğu, güney, batı.','Kuzey, batı, güney, doğu.','Kuzey, güney, doğu, batı.','Kuzey, doğu, batı, güney.']],
 'Clockwise cardinal order is north, east, south, west.')
q('geo','GE06',[
 'Which direction is between north and east?','Какое направление находится между севером и востоком?','Kuzey ile doğu arasında hangi yön vardır?'],[
 ['North-east.','South-east.','South-west.','North-west.'],['Северо-восток.','Юго-восток.','Юго-запад.','Северо-запад.'],['Kuzeydoğu.','Güneydoğu.','Güneybatı.','Kuzeybatı.']],
 'North-east is the intermediate point between north and east.')
q('geo','GE07',[
 'Where should the start of a line be placed when measuring with a ruler?','С какой отметкой линейки совмещают начало измеряемого отрезка?','Cetvelle ölçerken çizginin başlangıcı nereye yerleştirilmelidir?'],[
 ['At the zero mark.','Always at the wooden or plastic edge.','Always at the 1 cm mark, without subtracting.','At the largest number on the ruler.'],['С нулевой отметкой.','Всегда с краем дерева или пластика.','Всегда с отметкой 1 см, без вычитания.','С самым большим числом линейки.'],['Sıfır işaretine.','Her zaman ahşap veya plastik kenara.','Çıkarmadan, her zaman 1 cm işaretine.','Cetvelin en büyük sayısına.']],
 'Use the zero tick; the physical edge need not coincide with zero.')
q('geo','GE08',[
 'The ruler line goes from {start} cm to {end} cm. How long is it?','Отрезок идёт от {start} см до {end} см. Какова его длина?','Cetveldeki çizgi {start} cm ile {end} cm arasındadır. Uzunluğu nedir?'],[
 ['{length} cm','{end} cm','{rwrong1} cm','{rwrong2} cm'],['{length} см','{end} см','{rwrong1} см','{rwrong2} см'],['{length} cm','{end} cm','{rwrong1} cm','{rwrong2} cm']],
 'Subtract the starting reading from the ending reading.')
q('geo','GE09',[
 'Use this paper\'s scale. What real distance does {cm1} cm represent?','Используйте масштаб этого варианта. Какому расстоянию соответствует {cm1} см?','Bu sınavın ölçeğini kullanın. {cm1} cm gerçekte ne kadar mesafeyi gösterir?'],[
 ['{real1} m','{distwrong1} m','{distwrong2} m','{distwrong3} m'],['{real1} м','{distwrong1} м','{distwrong2} м','{distwrong3} м'],['{real1} m','{distwrong1} m','{distwrong2} m','{distwrong3} m']],
 'Multiply the stated map length by metres per centimetre.')
q('geo','GE10',[
 'Use this paper\'s scale. How many map centimetres represent {real2} m?','Используйте масштаб этого варианта. Скольким сантиметрам карты соответствует {real2} м?','Bu sınavın ölçeğini kullanın. Gerçekte {real2} m, haritada kaç santimetredir?'],[
 ['{cm2} cm','{reversewrong1} cm','{reversewrong2} cm','{reversewrong3} cm'],['{cm2} см','{reversewrong1} см','{reversewrong2} см','{reversewrong3} см'],['{cm2} cm','{reversewrong1} cm','{reversewrong2} cm','{reversewrong3} cm']],
 'Divide the real distance by the stated metres per centimetre.')
q('geo','GE11',[
 'A bending route has sections of {cm1} cm and {cm2} cm. What real distance is it?','Маршрут с поворотом состоит из {cm1} см и {cm2} см. Каково реальное расстояние?','Dönemeçli bir yolun bölümleri {cm1} cm ve {cm2} cm\'dir. Gerçek mesafesi nedir?'],[
 ['{route} m','{real1} m','{real2} m','{routewrong} m'],['{route} м','{real1} м','{real2} м','{routewrong} м'],['{route} m','{real1} m','{real2} m','{routewrong} m']],
 'Add both map sections before applying the scale.')
q('geo','GE12',[
 'Why can a straight line give the wrong length for a bending walking route?','Почему прямая линия может дать неверную длину маршрута с поворотами?','Dönemeçli yürüyüş yolunu neden düz bir çizgiyle ölçmek yanlış olabilir?'],[
 ['It may not follow the path people must walk.','Every route has exactly the same length.','A ruler can measure only buildings.','A straight line always includes every bend.'],['Она может не совпадать с путём, по которому идут люди.','У всех маршрутов одна длина.','Линейкой можно измерять только здания.','Прямая всегда включает все повороты.'],['İnsanların yürümek zorunda olduğu yolu izlemeyebilir.','Her yolun uzunluğu tamamen aynıdır.','Cetvel sadece binaları ölçebilir.','Düz çizgi her dönemeçi her zaman içerir.']],
 'Measure the actual usable route, including its sections and bends.')
q('geo','GE13',[
 'Which is a unit of length suitable for a small line on paper?','Какая единица длины подходит для небольшого отрезка на бумаге?','Kâğıttaki küçük bir çizgi için hangi uzunluk birimi uygundur?'],[
 ['Centimetres.','Kilograms.','Degrees Celsius.','Litres.'],['Сантиметры.','Килограммы.','Градусы Цельсия.','Литры.'],['Santimetre.','Kilogram.','Santigrat derece.','Litre.']],
 'Centimetres measure length; the others measure mass, temperature and volume.')
q('geo','GE14',[
 'Which feature normally forms through natural processes?','Какой объект обычно образуется естественными процессами?','Hangi özellik genellikle doğal süreçlerle oluşur?'],[
 ['A river.','A bridge.','A school building.','A canal.'],['Река.','Мост.','Здание школы.','Канал.'],['Nehir.','Köprü.','Okul binası.','Kanal.']],
 'A river is a natural feature; the alternatives are constructed by people.')
q('geo','GE15',[
 'Which feature is built by people?','Какой объект строят люди?','Hangisi insanlar tarafından yapılır?'],[
 ['A road bridge.','A naturally formed valley.','A mountain.','A natural river.'],['Дорожный мост.','Естественная долина.','Гора.','Естественная река.'],['Kara yolu köprüsü.','Doğal oluşmuş vadi.','Dağ.','Doğal nehir.']],
 'A bridge is a constructed, human-made feature.')
q('geo','GE16',[
 'Why is a reservoir usually classed as human-made?','Почему водохранилище обычно относят к объектам, созданным человеком?','Bir baraj gölü neden genellikle insan yapımı sayılır?'],[
 ['People create or enlarge the water store, often with a dam.','All water is made by people.','Anything blue must be human-made.','Every natural lake is a reservoir.'],['Люди создают или увеличивают запас воды, часто с помощью плотины.','Вся вода создана людьми.','Любой синий объект создан человеком.','Любое естественное озеро - водохранилище.'],['İnsanlar genellikle barajla su birikimini oluşturur veya büyütür.','Bütün su insanlar tarafından yapılır.','Mavi olan her şey insan yapımıdır.','Her doğal göl bir baraj gölüdür.']],
 'Its origin and management, not colour or water alone, explain the classification.')
q('geo','GE17',[
 'A park is green. Can colour alone prove it is a natural feature?','Парк зелёный. Доказывает ли только цвет его естественное происхождение?','Bir park yeşildir. Yalnızca rengi onun doğal olduğunu kanıtlar mı?'],[
 ['No. People may have planted and managed it.','Yes. Everything green forms without people.','Yes. Parks can never be managed.','No. All green places are buildings.'],['Нет. Люди могли его посадить и обустроить.','Да. Всё зелёное возникает без людей.','Да. За парками никогда не ухаживают.','Нет. Все зелёные места - здания.'],['Hayır. İnsanlar bitkileri dikmiş ve parkı düzenlemiş olabilir.','Evet. Yeşil olan her şey insan olmadan oluşur.','Evet. Parklar asla yönetilemez.','Hayır. Bütün yeşil yerler binadır.']],
 'Classify by how the feature formed; appearance alone is insufficient.')
q('geo','GE18',[
 'Which example shows an interaction between a natural and a human-made feature?','Какой пример показывает взаимодействие естественного и созданного человеком объекта?','Hangi örnek doğal ve insan yapımı özelliklerin etkileşimini gösterir?'],[
 ['A bridge across a river lets people cross.','A mountain is given a name.','A ruler is put into a pencil case.','A compass rose is drawn in a notebook.'],['Мост через реку позволяет людям переходить её.','Горе дают название.','Линейку кладут в пенал.','Розу направлений рисуют в тетради.'],['Nehir üzerindeki köprü insanların karşıya geçmesini sağlar.','Bir dağa isim verilir.','Cetvel kalem kutusuna konur.','Deftere pusula gülü çizilir.']],
 'The constructed bridge changes access across the natural river.')
q('geo','GE19',[
 'You find an unfamiliar map symbol. What should you do first?','На карте найден незнакомый символ. Что нужно сделать сначала?','Haritada tanımadığınız bir sembol var. İlk ne yapmalısınız?'],[
 ['Read the key for that map.','Assume colour always has the same meaning.','Guess from a different map only.','Ignore the symbol in every question.'],['Посмотреть условные обозначения этой карты.','Считать, что цвет всегда имеет один смысл.','Угадать только по другой карте.','Всегда игнорировать этот символ.'],['O haritanın anahtarına bakmak.','Rengin her zaman aynı anlama geldiğini varsaymak.','Yalnızca başka bir haritadan tahmin etmek.','Her soruda sembolü görmezden gelmek.']],
 'Map symbols and their meaning must be checked against the particular key.')
q('geo','GE20',[
 'Which instrument points towards magnetic north?','Какой прибор указывает направление на магнитный север?','Hangi araç manyetik kuzeyi gösterir?'],[
 ['A magnetic compass.','A ruler.','A rain gauge.','A map title.'],['Магнитный компас.','Линейка.','Осадкомер.','Заголовок карты.'],['Manyetik pusula.','Cetvel.','Yağış ölçer.','Harita başlığı.']],
 'A magnetic compass is an instrument; a compass rose is a printed diagram.')
q('geo','GE21',[
 'On your map, which direction is the pond from the school?','В каком направлении от школы находится пруд на вашей карте?','Haritanızda gölet, okulun hangi yönündedir?'],[
 ['{diag_en}','{diagwrong1_en}','{diagwrong2_en}','{diagwrong3_en}'],['{diag_ru}','{diagwrong1_ru}','{diagwrong2_ru}','{diagwrong3_ru}'],['{diag_tr}','{diagwrong1_tr}','{diagwrong2_tr}','{diagwrong3_tr}']],
 'Read from the school to the pond using the north arrow; layouts vary.')
q('geo','GE22',[
 'On your map, which direction is the school from the pond?','В каком направлении от пруда находится школа на вашей карте?','Haritanızda okul, göletin hangi yönündedir?'],[
 ['{rev_en}','{revwrong1_en}','{revwrong2_en}','{revwrong3_en}'],['{rev_ru}','{revwrong1_ru}','{revwrong2_ru}','{revwrong3_ru}'],['{rev_tr}','{revwrong1_tr}','{revwrong2_tr}','{revwrong3_tr}']],
 'Reverse the pond-from-school direction; do not keep the outward direction.')
q('geo','GE23',[
 'Which grid reference contains the school on your map?','В какой клетке находится школа на вашей карте?','Haritanızda okul hangi kare adresindedir?'],[
 ['{schoolref}','{pondref}','{bridgeref}','{woodref}'],['{schoolref}','{pondref}','{bridgeref}','{woodref}'],['{schoolref}','{pondref}','{bridgeref}','{woodref}']],
 'Read the school\'s column letter before its row number.')
q('geo','GE24',[
 'Which grid reference contains the woodland on your map?','В какой клетке находится лес на вашей карте?','Haritanızda orman hangi kare adresindedir?'],[
 ['{woodref}','{pondref}','{schoolref}','{bridgeref}'],['{woodref}','{pondref}','{schoolref}','{bridgeref}'],['{woodref}','{pondref}','{schoolref}','{bridgeref}']],
 'Locate the woodland symbol with the key, then read column and row.')
q('geo','GE25',[
 'On your map, which direction is the bridge from the school?','В каком направлении от школы находится мост на вашей карте?','Haritanızda köprü, okulun hangi yönündedir?'],[
 ['{card_en}','{cardwrong1_en}','{cardwrong2_en}','{cardwrong3_en}'],['{card_ru}','{cardwrong1_ru}','{cardwrong2_ru}','{cardwrong3_ru}'],['{card_tr}','{cardwrong1_tr}','{cardwrong2_tr}','{cardwrong3_tr}']],
 'Read from the school to the bridge; cardinal directions vary by layout.')

DIR={
 'en':['North','North-east','East','South-east','South','South-west','West','North-west'],
 'ru':['Север','Северо-восток','Восток','Юго-восток','Юг','Юго-запад','Запад','Северо-запад'],
 'tr':['Kuzey','Kuzeydoğu','Doğu','Güneydoğu','Güney','Güneybatı','Batı','Kuzeybatı']}
def direction(a,b):
 dx=(b[0]>a[0])-(b[0]<a[0]);dy=(b[1]>a[1])-(b[1]<a[1])
 return {(0,1):0,(1,1):1,(1,0):2,(1,-1):3,(0,-1):4,(-1,-1):5,(-1,0):6,(-1,1):7}[dx,dy]
def map_layouts():
 layouts=[]
 for flip in [False,True]:
  for rot in range(4):
   for ox in range(3):
    for oy in range(3):
     points=[]
     for x,y in [(0,0),(1,1),(1,0),(0,1)]:
      if flip:x=1-x
      for _ in range(rot):x,y=1-y,x
      points.append((x+ox,y+oy))
     layouts.append(points)
 random.Random(761029).shuffle(layouts)
 assert len({tuple(p) for p in layouts})==72
 return layouts[:23]
LAYOUTS=map_layouts()
def values(i):
 v={};rng=random.Random(7821+i)
 a=8+i;daily=[a,a+4+i%4,a-2-i%2];rng.shuffle(daily)
 v.update(d1=daily[0],d2=daily[1],d3=daily[2],total=sum(daily),diff=max(daily)-min(daily))
 v['diffwrong1']=v['diff']+2;v['diffwrong2']=v['diff']+4
 v['sumwrong1']=v['total']+3;v['sumwrong2']=v['total']-3;v['sumwrong3']=v['total']+6
 v['maxday']=daily.index(max(daily))+1
 other=[n for n in [1,2,3] if n!=v['maxday']];v.update(otherday1=other[0],otherday2=other[1])
 start=1+i%4;length=2+i//4;scale=[10,20,25,50,100][i%5];cm1=3+i//5;cm2=1+i%2
 v.update(start=start,end=start+length,length=length,rwrong1=start+length+2,rwrong2=start+length+4,scale=scale,cm1=cm1,cm2=cm2,real1=cm1*scale,real2=cm2*scale,route=(cm1+cm2)*scale,routewrong=(cm1+cm2+2)*scale)
 v.update(distwrong1=(cm1+1)*scale,distwrong2=(cm1+2)*scale,distwrong3=(cm1+3)*scale,reversewrong1=cm2+2,reversewrong2=cm2+4,reversewrong3=cm2+6)
 points=LAYOUTS[i]
 for name,p in zip(['school','pond','bridge','wood'],points):v[name+'ref']='ABCD'[p[0]]+str(p[1]+1)
 for name,idx,candidates in [('diag',direction(points[0],points[1]),[1,3,5,7]),('rev',direction(points[1],points[0]),[1,3,5,7]),('card',direction(points[0],points[2]),[0,2,4,6])]:
  for lang in DIR:
   v[name+'_'+lang]=DIR[lang][idx]
   for n,k in enumerate([d for d in candidates if d!=idx],1):v[f'{name}wrong{n}_{lang}']=DIR[lang][k]
 return v
def fmt(text,v):return text.format(**v)
def make_versions(subject):
 used=[];versions=[]
 for i,lang in enumerate(LANGS):
  rng=random.Random(926101+(subject=='geo')*10000+i*983)
  special=i==16
  if special:sequence=[2]*25
  else:
   for _ in range(100000):
    sequence=[0]*6+[1]*6+[2]*6+[3]*6+[i%4];rng.shuffle(sequence)
    if any(len(list(g))>3 for _,g in itertools.groupby(sequence)):continue
    if all(sum(a!=b for a,b in zip(sequence,p))>=14 for p in used):break
   else:raise AssertionError('Cannot generate sufficiently distinct answer sequences')
  used.append(sequence[:]);order=list(range(25));rng.shuffle(order);v=values(i);questions=[]
  for number,(bankindex,pos) in enumerate(zip(order,sequence),1):
   item=BANK[subject][bankindex];options=list(range(1,4));rng.shuffle(options);options.insert(pos,0)
   choices=[fmt(item['choices'][lang][k],v) for k in options]
   assert len(set(choices))==4,(subject,item['code'],i,choices)
   questions.append(dict(number=number,code=item['code'],stem=fmt(item['stem'][lang],v),choices=choices,answer='ABCD'[pos],answer_en=fmt(item['choices']['en'][0],v)))
  versions.append(dict(subject=subject,index=i+1,lang=lang,special=special,id=f"7A-{'GP' if subject=='gp' else 'GE'}-{i+1:02d}",values=v,questions=questions,sequence=''.join('ABCD'[n] for n in sequence)))
 return versions

STYLE=ParagraphStyle('body',fontName='Arial',fontSize=10.5,leading=13,spaceAfter=0)
def paragraph(c,text,x,top,width=CW,size=10.5,leading=None,bold=False):
 style=ParagraphStyle('p',parent=STYLE,fontName='ArialBold' if bold else 'Arial',fontSize=size,leading=leading or size*1.23)
 p=Paragraph(escape(text),style);_,h=p.wrap(width,1000);p.drawOn(c,x,top-h);return top-h
def sunflower(c,x,y):
 c.saveState();c.setStrokeColor(colors.black)
 for i in range(14):
  c.saveState();c.translate(x,y);c.rotate(i*360/14);c.setFillColor(colors.HexColor('#f4c542'));c.ellipse(-4,7,4,24,fill=1,stroke=1);c.restoreState()
 c.setFillColor(colors.HexColor('#6d4727'));c.circle(x,y,10,fill=1,stroke=1)
 c.setFillColor(colors.HexColor('#e4b866'))
 for dx,dy in [(-4,-3),(3,4),(-3,4),(4,-3),(0,0)]:c.circle(x+dx,y+dy,.9,fill=1,stroke=0)
 c.restoreState()
def footer(c,version,page):
 u=L[version['lang']];c.setStrokeColor(colors.HexColor('#aaaaaa'));c.line(M,32,W-M,32)
 c.setFont('Arial',8);c.drawString(M,20,version['id']);c.drawRightString(W-M,20,f"{u['page']} {page} {u['of']} 4")
def continuation(c,version,page):
 u=L[version['lang']];c.setFillColor(colors.black);c.setFont('ArialBold',11);c.drawString(M,H-36,f"7A  {u[version['subject']]}")
 c.setFont('Arial',9);c.drawRightString(W-M,H-36,version['id']);c.line(M,H-45,W-M,H-45);footer(c,version,page)
 return H-61
def table(c,rows,x,top,widths,fontsize=10,rowheights=None):
 t=Table(rows,colWidths=widths,rowHeights=rowheights)
 t.setStyle(TableStyle([('FONTNAME',(0,0),(-1,-1),'Arial'),('FONTSIZE',(0,0),(-1,-1),fontsize),('GRID',(0,0),(-1,-1),.5,colors.black),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
 w,h=t.wrap(1000,1000);t.drawOn(c,x,top-h);return top-h
def symbol(c,kind,x,y,size=8):
 c.saveState();c.setStrokeColor(colors.black);c.setFillColor(colors.white);c.setLineWidth(1)
 if kind=='school':
  c.rect(x-size/2,y-size/2,size,size,fill=1);p=c.beginPath();p.moveTo(x-size*.7,y+size/2);p.lineTo(x,y+size);p.lineTo(x+size*.7,y+size/2);c.drawPath(p)
 elif kind=='pond':c.ellipse(x-size*.7,y-size*.4,x+size*.7,y+size*.4,fill=1)
 elif kind=='wood':
  for dx in [-4,4]:
   p=c.beginPath();p.moveTo(x+dx,y+size*.8);p.lineTo(x+dx-size*.5,y-size*.3);p.lineTo(x+dx+size*.5,y-size*.3);p.close();c.drawPath(p);c.line(x+dx,y-size*.3,x+dx,y-size*.7)
 else:
  c.line(x-size,y-3,x+size,y-3);c.line(x-size,y+3,x+size,y+3)
  for dx in [-size,size]:c.line(x+dx,y-6,x+dx,y+6)
 c.restoreState()
def cover(c,version):
 u=L[version['lang']];subject=version['subject'];v=version['values'];c.setFillColor(colors.black)
 c.setFont('ArialBold',17);c.drawCentredString(W/2,H-43,'OXFORD INTERNATIONAL SCHOOL')
 c.setFont('ArialBold',12);c.drawCentredString(W/2,H-66,u['exam'])
 if version['special']:sunflower(c,W-M-18,H-92)
 top=H-86
 top=paragraph(c,f"{u['term']}     |     {u['version']}: {version['id']}     |     {u['duration']}: {u['minutes']}",M,top,size=9.3)
 top-=15;top=paragraph(c,u['name']+': '+'_'*66,M,top,size=10.5)
 top-=10;top=paragraph(c,f"{u['grade']}: 7A     {u['subject']}: {u[subject]}     {u['date']}: __________",M,top,size=10)
 top-=12
 top=table(c,[[u['score']+': ______ / 100',u['signature']+': __________________']],M,top,[200,CW-200],10)
 top-=15;top=paragraph(c,u['instructions'],M,top,bold=True)
 for n,rule in enumerate(u['rules'],1):top=paragraph(c,str(n)+'. '+rule,M,top-3,size=9.8)
 top-=12;top=paragraph(c,u['marks'],M,top,bold=True,size=10)
 top-=18
 if subject=='gp':
  top=paragraph(c,u['reading'],M,top,bold=True,size=11)
  for n,p in enumerate(PASSAGE[version['lang']],1):top=paragraph(c,f'{n}. {p}',M,top-9,size=10.5)
  top-=15;top=paragraph(c,u['baseline'],M,top,size=10,bold=True)
  top=table(c,[[u['day'],u['waste']],[1,v['d1']],[2,v['d2']],[3,v['d3']]],M,top-8,[90,190],10)
 else:
  top=paragraph(c,u['map'],M,top,bold=True,size=11)
  gx=M+25;cell=46;gy=top-211
  c.setStrokeColor(colors.HexColor('#777777'));c.setLineWidth(.5)
  for n in range(5):c.line(gx+n*cell,gy,gx+n*cell,gy+4*cell);c.line(gx,gy+n*cell,gx+4*cell,gy+n*cell)
  c.setFont('ArialBold',10)
  for n in range(4):c.drawCentredString(gx+(n+.5)*cell,gy-15,'ABCD'[n]);c.drawRightString(gx-7,gy+(n+.5)*cell-3,str(n+1))
  for kind,(x,y) in zip(['school','pond','bridge','wood'],LAYOUTS[version['index']-1]):symbol(c,kind,gx+(x+.5)*cell,gy+(y+.5)*cell,12)
  kx=M+260;ky=top-20;ky=paragraph(c,u['key'],kx,ky,width=220,size=10.5,bold=True)
  for kind in ['school','pond','bridge','wood']:
   ky-=27;symbol(c,kind,kx+10,ky-3,9);paragraph(c,u[kind],kx+30,ky+3,width=180,size=10.5)
  c.setLineWidth(1.5);nx=gx+4*cell+25;ny=gy+150;c.line(nx,ny,nx,ny+28);c.line(nx,ny+28,nx-4,ny+21);c.line(nx,ny+28,nx+4,ny+21)
  paragraph(c,u['north'],nx-18,ny+45,width=70,size=8)
  top=gy-32;top=paragraph(c,u['mapnote'],M,top,size=9.5)
  top-=17;top=paragraph(c,u['data'],M,top,bold=True)
  top=paragraph(c,f"{u['scale']}: 1 cm = {v['scale']} m",M,top-10,size=11)
  top=paragraph(c,u['ruler']+': '+u['fromto'].format(**v),M,top-9,size=10.5)
  top=paragraph(c,f"{u['route']}: {v['cm1']} cm + {v['cm2']} cm",M,top-9,size=10.5)
 assert top>48,(version['id'],'cover overflow',top)
 footer(c,version,1)
 return top
def draw_questions(c,version,questions,page):
 u=L[version['lang']];top=continuation(c,version,page)
 top=paragraph(c,u['questions'],M,top,bold=True,size=12)-15
 for question in questions:
  top=paragraph(c,f"{question['number']}. {question['stem']}",M,top,bold=True,size=10.5)
  top-=3
  for letter,choice in zip('ABCD',question['choices']):top=paragraph(c,letter+') '+choice,M+15,top,size=10.2)
  top-=12
 assert top>47,(version['id'],page,'question overflow',top)
 if page==4:
  paragraph(c,u['end'],M,43+14,width=CW,size=8.5)
 return top
def write_pack(subject,versions):
 path=OUT/f'7A_{"Global_Perspectives" if subject=="gp" else "Geography"}_Student_Exams.pdf'
 c=canvas.Canvas(str(path),pagesize=A4);c.setTitle(f'7A {L["en"][subject]} student exam pack');c.setAuthor('Oxford International School')
 positions=[]
 for version in versions:
  positions.append(cover(c,version));c.showPage()
  for page,questions in enumerate([version['questions'][:9],version['questions'][9:17],version['questions'][17:]],2):
   positions.append(draw_questions(c,version,questions,page));c.showPage()
 c.save();assert len(PdfReader(path).pages)==92
 return path,positions
def teacher_page(c,title,page):
 c.setFont('ArialBold',15);c.drawString(M,H-40,title);c.setFont('Arial',8);c.drawRightString(W-M,20,f'TEACHER ONLY  |  {page}');return H-64
def write_keys(allversions):
 path=OUT/'7A_Teacher_Answer_Keys.pdf';c=canvas.Canvas(str(path),pagesize=A4);c.setTitle('7A teacher answer keys and distribution register');c.setAuthor('Oxford International School')
 top=teacher_page(c,'7A examination distribution and marking',1)
 for p in [
  'Each student PDF contains 23 consecutive four-page papers: 17 English, 5 Russian and 1 Turkish. There are no answer keys in student files. Print at actual size on A4. For duplex printing, flip on the long edge; every student starts on a fresh sheet.',
  'Assign one number to each pupil and use that number in BOTH subjects. Versions 01-17 are English, 18-22 Russian and 23 Turkish. Each front page is repeated with a unique subject-specific code. Use the blank register below for pupil names.',
  'Version 17 in each subject is the requested sunflower paper: every answer is C. The student paper does not announce this. Keep its identity in this teacher file. Other papers use balanced answer letters with no run longer than three.',
  'Award 4 marks for each correct answer, zero for an incorrect or missing answer, and zero if multiple choices remain circled. Total 100; no negative marking. Use the key for the exact code printed on the paper, not another pupil\'s key.',
  'Question order, option order, maps and numerical values vary. Each pair of answer sequences within a subject differs in at least 14 of 25 positions. This discourages copying but cannot guarantee that cheating is impossible. The translated papers assess the same skills.',
  'The school header, student fields and score/signature table follow the supplied 9 ICT reference. The assessment uses 25 four-option questions throughout so that the sunflower paper can have C as every answer. A 60-minute duration is supplied as an editable teacher choice. These are teacher-created classroom exams, not official Cambridge papers.'
 ]:top=paragraph(c,p,M,top-8,size=9.8)
 top-=16
 rows=[['Paper number','Language','Student pack pages','Assigned pupil']]
 for i,lang in enumerate(LANGS):rows.append([f'{i+1:02d}'+(' *' if i==16 else ''),{'en':'English','ru':'Russian','tr':'Turkish'}[lang],f'{4*i+1}-{4*i+4}',''])
 table(c,rows,M,top,[90,85,115,CW-290],9,rowheights=[21]+[17]*23)
 c.showPage();pageno=2
 for gp,geo in zip(allversions['gp'],allversions['geo']):
  top=teacher_page(c,f"Keys for pupil number {gp['index']:02d}  |  {gp['lang'].upper()}",pageno)
  if gp['special']:top=paragraph(c,'SUNFLOWER PAPERS - ALL 25 ANSWERS ARE C IN BOTH SUBJECTS',M,top,bold=True,size=10)-15
  for version,x in [(gp,M),(geo,M+CW/2+8)]:
   width=CW/2-8;ytop=paragraph(c,version['id'],x,top,width,bold=True,size=11)-7
   ytop=paragraph(c,L['en'][version['subject']],x,ytop,width,size=10)-10
   rows=[['Q','Answer','Bank reference']]+[[q['number'],q['answer'],q['code']] for q in version['questions']]
   bottom=table(c,rows,x,ytop,[35,55,width-90],10,rowheights=[23]+[18]*25)
   data=version['values']
   notes=(f"Baseline kg: {data['d1']}, {data['d2']}, {data['d3']}. Total {data['total']} kg; range {data['diff']} kg. Greatest: Day {data['maxday']}." if version['subject']=='gp' else f"Scale: 1 cm = {data['scale']} m. Ruler: {data['length']} cm. Distance: {data['real1']} m. Reverse: {data['cm2']} cm. Route: {data['route']} m. School {data['schoolref']}; woodland {data['woodref']}. Pond from school: {data['diag_en']}; reverse: {data['rev_en']}; bridge from school: {data['card_en']}.")
   paragraph(c,notes,x,bottom-15,width,size=9.3)
  c.showPage();pageno+=1
 for subject in ['gp','geo']:
  for start in [0,13]:
   top=teacher_page(c,L['en'][subject]+' marking explanations',pageno)
   for item in BANK[subject][start:start+13]:
    top=paragraph(c,item['code']+'  '+item['reason'],M,top-10,size=10)
   assert top>45
   c.showPage();pageno+=1
 c.save();return path
def validate(versions):
 sequences=[v['sequence'] for v in versions]
 assert len(versions)==23 and len(set(sequences))==23
 assert [v['lang'] for v in versions]==LANGS
 assert [v['index'] for v in versions if v['special']]==[17]
 assert versions[16]['sequence']=='C'*25
 distance=min(sum(x!=y for x,y in zip(a,b)) for a,b in itertools.combinations(sequences,2))
 assert distance>=14
 assert len({tuple(q['code'] for q in v['questions']) for v in versions})==23
 for v in versions:
  assert len(v['questions'])==25 and set(q['code'] for q in v['questions'])==set(q['code'] for q in BANK[v['subject']])
  for qn in v['questions']:assert all('{' not in s and '}' not in s for s in [qn['stem'],*qn['choices']])
 return distance
def main():
 assert all(len(BANK[s])==25 for s in BANK)
 versions={s:make_versions(s) for s in BANK}
 report={};files=[]
 for subject,vs in versions.items():
  distance=validate(vs);path,bottoms=write_pack(subject,vs);files.append(path)
  report[subject]=dict(papers=23,pages=92,languages={'English':17,'Russian':5,'Turkish':1},minimum_answer_distance=distance,lowest_content_y=round(min(bottoms),2),sunflower_version=vs[16]['id'])
 key=write_keys(versions);files.append(key)
 for file in files:
  pdf=PdfReader(file);assert all(abs(float(p.mediabox.width)-W)<1 and abs(float(p.mediabox.height)-H)<1 for p in pdf.pages)
  for i,page in enumerate(pdf.pages):assert page.extract_text().strip(),(file,i)
 for subject in BANK:
  file=next(f for f in files if ('Global_Perspectives' if subject=='gp' else 'Geography') in f.name)
  pdf=PdfReader(file)
  for i,v in enumerate(versions[subject]):
   for p in pdf.pages[4*i:4*i+4]:assert v['id'] in p.extract_text()
   text='\n'.join(p.extract_text() for p in pdf.pages[4*i+1:4*i+4])
   for qn in v['questions']:assert f"{qn['number']}." in text
 (WORK/'versions.json').write_text(json.dumps(versions,ensure_ascii=False,indent=2),encoding='utf-8')
 (WORK/'validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
 print(json.dumps({'files':[str(f) for f in files],'validation':report},indent=2))
if __name__=='__main__':main()
