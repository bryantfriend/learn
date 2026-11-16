"""Twenty-question, two-page replacements for every requested class pack."""
from pathlib import Path
import importlib.util,copy,json,random,itertools,zipfile
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph,Table,TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('classes',ROOT/'scripts/build-7b-8-exam-packs.py')
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c);b=c.b
OUT=ROOT/'output/pdf/compact-exams';OUT.mkdir(parents=True,exist_ok=True)
WORK=ROOT/'tmp/pdfs/compact-exams';WORK.mkdir(parents=True,exist_ok=True)
W,H=b.W,b.H;M=30;CW=W-2*M;GAP=18;COL=(CW-GAP)/2;LANG='en'
BANK={'gp7a':copy.deepcopy(b.BANK['gp']),'geo7a':copy.deepcopy(b.BANK['geo']),**copy.deepcopy(c.BANK)}
SELECT={
 'gp7a':['GP'+str(n).zfill(2) for n in [1,2,3,4,5,6,7,8,10,11,13,14,15,16,17,19,21,22,24,25]],
 'geo7a':['GE'+str(n).zfill(2) for n in range(1,26) if n not in [5,16,17,18,24]],
 'gp7b':['B'+str(n).zfill(2) for n in range(1,26) if n not in [12,13,15,20,23]],
 'geo7b':['G'+str(n).zfill(2) for n in range(1,26) if n not in [5,10,11,20,21]],
 'gp8':['E'+str(n).zfill(2) for n in [1,3,4,6,7,8,13,17,19,20,21,26,27,28,29,30,31,32,33,34]]}
def short(subject,code,lang,stem,choices):
 item=next(i for i in BANK[subject] if i['code']==code)
 item['stem'][lang]=stem;item['choices'][lang]=choices

# Shorter wording preserves the original concepts and first correct option.
COMMON={
1:{'en':('Which lunch question is neutral?',['What do pupils think about lunch?','Why does everyone hate lunch?','Why is all school food bad?','Why does nobody want healthy food?']),
   'ru':('Какой вопрос об обеде нейтрален?',['Что ученики думают об обеде?','Почему все ненавидят обед?','Почему вся школьная еда плохая?','Почему никто не хочет полезную еду?'])},
3:{'en':('How should lunch waste be measured?',['Use the same weighing method daily.','Ask one pupil to guess.','Read a restaurant story.','Count smiling pupils.']),
   'ru':('Как измерять остатки обеда?',['Взвешивать одним методом каждый день.','Попросить ученика угадать вес.','Прочитать рассказ о ресторане.','Посчитать улыбающихся учеников.']),
   'tr':('Yemek artığı nasıl ölçülmeli?',['Her gün aynı yöntemle tartarak.','Bir öğrenciye tahmin ettirerek.','Restoran hikâyesi okuyarak.','Gülümseyen öğrencileri sayarak.'])},
4:{'en':('How can pupils\' reasons be explored?',['Ask pupils neutral questions.','Only weigh leftovers.','Only count tables.','Only photograph a door.']),
   'ru':('Как узнать причины учеников?',['Задать нейтральные вопросы.','Только взвесить остатки.','Только посчитать столы.','Только сфотографировать дверь.']),
   'tr':('Öğrencilerin nedenleri nasıl öğrenilir?',['Tarafsız sorular sorarak.','Sadece artıkları tartarak.','Sadece masaları sayarak.','Sadece kapıyı fotoğraflayarak.'])},
5:{'en':('Weighing leftovers alone cannot show...',['Why pupils left food.','The recorded weights.','Which recorded day had more waste.','The difference between two weights.']),
   'ru':('Одно взвешивание не показывает...',['Почему ученики оставили еду.','Записанные значения веса.','В какой день остатков больше.','Разницу между двумя весами.']),
   'tr':('Artıkları tartmak tek başına neyi göstermez?',['Yemeğin neden bırakıldığını.','Kaydedilen ağırlıkları.','Hangi gün daha çok artık olduğunu.','İki ağırlık arasındaki farkı.'])},
6:{'en':('Only two friends are asked. Main limit?',['Their views may not represent others.','Two people represent the whole school.','Friends never give useful information.','A small sample proves every cause.']),
   'ru':('Опросили двух друзей. Ограничение?',['Могут не отражать мнения остальных.','Два человека представляют всю школу.','Друзья не дают полезных сведений.','Малая выборка доказывает все причины.']),
   'tr':('İki arkadaşa sorulur. Temel sınırlılık?',['Görüşleri diğerlerini temsil etmeyebilir.','İki kişi bütün okulu temsil eder.','Arkadaşlar yararlı bilgi veremez.','Küçük örneklem her nedeni kanıtlar.'])},
7:{'en':('What helps you check a source?',['Author, date, purpose and evidence.','Only colourful pictures.','Only agreement with your opinion.','Only how often it says "true".']),
   'ru':('Что помогает проверить источник?',['Автор, дата, цель и доказательства.','Только яркие картинки.','Только согласие с вашим мнением.','Только число слов «правда».'])},
8:{'en':('Why combine weighing and interviews?',['Amounts and reported reasons.','Guaranteed agreement from everyone.','No need to record evidence.','Proof an untested trial worked.']),
   'ru':('Зачем сочетать взвешивание и интервью?',['Количество и сообщённые причины.','Гарантия согласия всех.','Чтобы не записывать данные.','Доказать успех ещё не проверенного плана.']),
   'tr':('Tartım ve görüşme neden birleştirilir?',['Miktarlar ve bildirilen nedenler için.','Herkesin aynı fikirde olması için.','Kanıt kaydetmemek için.','Denenmemiş planı başarılı saymak için.'])},
10:{'en':('What is the reading\'s main idea?',['Investigate lunch waste: amounts and reasons.','All pupils dislike every meal.','Only the school building\'s colour.','A trial has already solved the problem.']),
    'ru':('Какова главная мысль текста?',['Изучить остатки еды: количество и причины.','Всем не нравятся все блюда.','Только цвет здания школы.','Испытание уже решило проблему.']),
    'tr':('Metnin ana fikri nedir?',['Yemek artığını miktar ve nedenlerle araştırmak.','Herkes her yemeği sevmez.','Sadece okul binasının rengi.','Deneme sorunu zaten çözdü.'])},
13:{'en':('Which note fits the smaller-portion trial?',['Proposed, not tested; more food available.','Proved successful for everyone.','Less food for all; no extra allowed.','The team stopped collecting information.']),
    'ru':('Какая заметка верна о меньших порциях?',['Предложено, не проверено; есть добавка.','Успех для всех уже доказан.','Всем меньше еды; добавка запрещена.','Группа прекратила сбор сведений.']),
    'tr':('Küçük porsiyon denemesi için doğru not?',['Önerildi, denenmedi; ek yemek var.','Herkes için başarısı kanıtlandı.','Herkese az yemek; ek yemek yasak.','Ekip bilgi toplamayı bıraktı.'])},
15:{'en':('What should a good summary do?',['Keep key meaning briefly in your own words.','Copy every sentence.','Add an unsupported opinion as fact.','Remove terms even if meaning is lost.']),
    'ru':('Что делает хорошее краткое изложение?',['Кратко сохраняет смысл своими словами.','Копирует все предложения.','Добавляет мнение как факт без доказательств.','Убирает термины даже при потере смысла.']),
    'tr':('İyi bir özet ne yapar?',['Temel anlamı kendi sözleriyle kısaca verir.','Her cümleyi kopyalar.','Kanıtsız görüşü gerçek diye ekler.','Anlam kaybolsa da terimleri siler.'])},
16:{'en':('7A\'s task needs what for EACH paragraph?',['A subheading and two own-word sentences.','An unchanged copy of the paragraph.','Only one title for the whole text.','Five unrelated facts.']),
    'ru':('Что нужно для КАЖДОГО абзаца в 7A?',['Подзаголовок и два предложения своими словами.','Копия абзаца без изменений.','Только один заголовок всего текста.','Пять несвязанных фактов.']),
    'tr':('7A görevinde HER paragraf için ne gerekir?',['Alt başlık ve kendi sözlerinle iki cümle.','Değiştirilmeden kopyalanmış paragraf.','Bütün metin için tek başlık.','İlgisiz beş bilgi.'])},
17:{'en':('Which feedback fixes an unsupported claim?',['Use "proposed", not "proved": no results.','Good work!','Make it better somehow.','Keep "proved": a friend likes it.']),
    'ru':('Какой отзыв исправляет вывод без доказательств?',['«Предложено», а не «доказано»: результатов нет.','Хорошая работа!','Как-нибудь сделайте лучше.','Оставьте «доказано»: другу нравится.']),
    'tr':('Kanıtsız iddiayı hangi geri bildirim düzeltir?',['"Önerildi" yaz, "kanıtlandı" değil; sonuç yok.','Güzel çalışma!','Bir şekilde daha iyi yap.','Arkadaşın sevdiği için "kanıtlandı" kalsın.'])},
19:{'en':('Which reflection shows learning?',['I changed "all" to "those asked": small sample.','I was perfect at everything.','I finished before everyone.','I will never check a source again.']),
    'ru':('Какое размышление показывает обучение?',['Заменил «все» на «опрошенные»: выборка мала.','Я всё сделал идеально.','Я закончил раньше всех.','Больше не буду проверять источники.']),
    'tr':('Hangi değerlendirme öğrenmeyi gösterir?',['"Herkes" yerine "sorulanlar" yazdım: örneklem küçük.','Her şeyi kusursuz yaptım.','Herkesten önce bitirdim.','Bir daha kaynak kontrol etmeyeceğim.'])},
20:{'en':('Only canteen users are asked. Report...',['Home-lunch pupils were not included.','Every pupil gave a view.','The replies represent all countries.','All pupils are proved to waste food.']),
    'ru':('Опросили только посетителей столовой. Указать...',['Ученики с обедом из дома не включены.','Каждый ученик высказал мнение.','Ответы представляют все страны.','Доказано: все оставляют еду.'])},
21:{'en':('What is known about smaller first portions?',['Proposed; not yet tested.','They worked in all schools.','They guarantee everyone agrees.','The menu caused all waste.']),
    'ru':('Что известно о меньших первых порциях?',['Предложены; ещё не проверены.','Они помогли во всех школах.','Они гарантируют согласие всех.','Меню вызвало все остатки.']),
    'tr':('Küçük ilk porsiyonlar hakkında ne biliniyor?',['Önerildi; henüz denenmedi.','Bütün okullarda işe yaradı.','Herkesin onayını garanti eder.','Bütün artıkların nedeni menüdür.'])}}
for n,langs in COMMON.items():
 for lang,(stem,options) in langs.items():
  short('gp7a',f'GP{n:02d}',lang,stem,options)
  if any(i['code']==f'E{n:02d}' for i in BANK['gp8']) and lang!='tr':short('gp8',f'E{n:02d}',lang,stem,options)
for code,stems,oe,orr in [
 ('E26',['How best to test the smaller-portion prediction?','Как лучше проверить прогноз о меньших порциях?'],['Compare before/during fairly; ask pupils; check other causes.','Assume a good-sounding idea is true.','Ask only one friend.','Change methods, then ignore the change.'],['Честно сравнить до/во время; опросить; учесть другие причины.','Считать красивую идею верной.','Спросить только одного друга.','Сменить метод и не учитывать это.']),
 ('E27',['Which is a POSSIBLE CAUSE of waste?','Что является ВОЗМОЖНОЙ ПРИЧИНОЙ остатков?'],['Portion size.','Money lost through wasted food.','Ingredients wasted as a result.','The cost of throwing food away.'],['Размер порций.','Деньги, потерянные из-за остатков.','Ингредиенты, потраченные впустую.','Расходы на выбрасывание еды.']),
 ('E28',['Which is a possible CONSEQUENCE of waste?','Что может быть ПОСЛЕДСТВИЕМ остатков?'],['Ingredients and money are wasted.','Different food preferences.','Large first portions.','Short eating time.'],['Ингредиенты и деньги тратятся впустую.','Разные пищевые предпочтения.','Большие первые порции.','Мало времени на еду.']),
 ('E29',['What does the national meals organiser value?','Что ценит организатор питания в обсуждении страны?'],['Affordable waste records across schools.','Only the loudest pupil.','Banning school-record comparisons.','One pupil speaking for the whole country.'],['Доступный учёт остатков в школах.','Только самого громкого ученика.','Запрет сравнения школьных записей.','Мнение одного за всю страну.']),
 ('E30',['What does the parent in the global discussion ask?','О чём спрашивает родитель в мировом обсуждении?'],['Does the idea fit different budgets and routines?','Are all countries\' routines identical?','Does one school prove a global pattern?','Should pupils never give opinions?'],['Подходит ли идея разным бюджетам и распорядку?','Одинаков ли распорядок во всех странах?','Доказывает ли одна школа мировой вывод?','Нельзя ли ученикам давать мнения?']),
 ('E31',['Which gives a perspective, not only a scale label?','Что выражает точку зрения, а не только масштаб?'],['A pupil representative values pupil involvement.','National.','International.','Global.'],['Представитель ценит участие учеников.','Национальный.','Международный.','Глобальный.']),
 ('E32',['Which ONE-FEATURE summary covers the action?','Какое изложение ОДНОГО аспекта описывает действие?'],['Propose smaller portions with more available; trial and compare.','List causes only, with no action.','Say it already works everywhere.','Copy all paragraphs without selecting.'],['Предложить меньшие порции с добавкой; испытать и сравнить.','Только причины, без действия.','Сказать: это уже помогает везде.','Скопировать всё без отбора.'])]:
 for lang,stem,options in zip(['en','ru'],stems,[oe,orr]):short('gp8',code,lang,stem,options)
for code,stems,oe,orr in [
 ('B01',['Which break-space question is neutral?','Какой вопрос о местах отдыха нейтрален?'],['What do pupils think of break spaces?','Why does everyone hate quiet spaces?','Why are all games bad?','Why does nobody want to read?'],['Что ученики думают о местах отдыха?','Почему все ненавидят тихие места?','Почему все игры плохие?','Почему никто не хочет читать?']),
 ('B02',['Which research question is focused?','Какой вопрос исследования конкретен?'],['How is our playground used at breaks this week?','How can all countries solve all problems?','Why do people do things?','What is everything about schools?'],['Как используют нашу площадку на переменах этой недели?','Как всем странам решить все проблемы?','Почему люди что-то делают?','Что вообще известно о школах?']),
 ('B03',['How best to count use of break areas?','Как лучше узнать число учеников в зонах отдыха?'],['Observe the areas and count pupils.','Ask one pupil to guess.','Only read another school\'s story.','Only count classroom doors.'],['Наблюдать зоны и считать учеников.','Попросить ученика угадать.','Только прочитать о другой школе.','Только посчитать двери классов.']),
 ('B04',['How best to learn WHY pupils prefer quiet spaces?','Как узнать, ПОЧЕМУ выбирают тихое место?'],['Ask pupils neutral questions.','Only count benches.','Only measure a path.','Assume everyone has the same reason.'],['Задать ученикам нейтральные вопросы.','Только посчитать скамейки.','Только измерить дорожку.','Считать, что у всех одна причина.']),
 ('B05',['Counting pupils alone cannot explain...','Подсчёт учеников сам по себе не объясняет...'],['Why they chose the area.','The number in an area.','Which area had more pupils then.','The difference between two counts.'],['Почему они выбрали эту зону.','Число учеников в зоне.','В какой зоне тогда было больше людей.','Разницу двух записанных чисел.']),
 ('B06',['Why observe several breaks?','Зачем наблюдать несколько перемен?'],['Area use may change between breaks.','One count proves what always happens.','Repeating makes all counts equal.','No need to record times.'],['Использование зон может меняться.','Один подсчёт доказывает, что бывает всегда.','Повторение делает числа равными.','Тогда не нужно записывать время.']),
 ('B07',['Why combine observations and replies?','Зачем сочетать наблюдения и ответы?'],['Use of spaces and reported reasons.','Guaranteed agreement.','Proof one activity suits all.','No need to check evidence.'],['Использование зон и сообщённые причины.','Гарантия согласия всех.','Доказать: одно занятие подходит всем.','Чтобы не проверять данные.']),
 ('B08',['Only two friends are asked. Main limit?','Опросили двух друзей. Ограничение?'],['Their views may not represent others.','Two pupils represent the whole school.','Friends never give useful information.','All pupils are proved to want games.'],['Могут не отражать мнения остальных.','Два ученика представляют всю школу.','Друзья не дают полезных сведений.','Доказано: все хотят играть.']),
 ('B09',['What helps check a website source?','Что помогает проверить сайт-источник?'],['Author, date, purpose and evidence.','Only its colours.','Only agreement with your opinion.','Only the number of pictures.'],['Автор, дата, цель и доказательства.','Только цвета сайта.','Только согласие с вашим мнением.','Только число картинок.']),
 ('B10',['What is the reading\'s main idea?','Какова главная мысль текста?'],['Study varied break-space needs by observing and asking.','Everyone wants the same activity.','Only bench numbers matter.','Quiet spaces are proved useless.'],['Изучать разные потребности наблюдением и вопросами.','Все хотят одного занятия.','Важно только число скамеек.','Бесполезность тихих мест доказана.']),
 ('B14',['Which note fits paragraph 2?','Какая заметка передаёт абзац 2?'],['Observe activities and counts at several breaks; reasons unknown.','One count explains every reason.','Never record area use.','Everyone wants one activity.'],['Наблюдать занятия и числа на разных переменах; причины неизвестны.','Один подсчёт объясняет все причины.','Никогда не записывать зону.','Все хотят одного занятия.']),
 ('B16',['What should useful notes keep?','Что сохраняют полезные заметки?'],['Main points, relevant details and limits.','Every word copied.','Only easy-to-spell words.','Unsupported opinions as facts.'],['Главные мысли, нужные детали и ограничения.','Все слова без отбора.','Только простые для написания слова.','Мнения без доказательств как факты.']),
 ('B17',['What is a whole-text summary?','Что такое краткое изложение всего текста?'],['Main idea and key points, briefly in your own words.','Only the first sentence copied.','An unrelated personal story.','A longer text with invented results.'],['Главная мысль и ключевые пункты кратко своими словами.','Копия только первого предложения.','Личный рассказ на другую тему.','Длинный текст с выдуманными итогами.']),
 ('B18',['What does 7B\'s workbook task summarise?','Что излагают в задании рабочей тетради 7B?'],['The whole text, using the starters.','Only one word from paragraph 1.','Only another country\'s weather.','Copied sentences without checking.'],['Весь текст с помощью начальных фраз.','Одно слово из абзаца 1.','Только погоду другой страны.','Скопированные фразы без проверки.']),
 ('B19',['Which feedback helps improve a summary?','Какой отзыв помогает улучшить изложение?'],['Add asking from paragraph 3; you only covered observation.','Good!','Make it better somehow.','Keep missing ideas: a friend agrees.'],['Добавьте вопросы из абзаца 3: есть только наблюдение.','Хорошо!','Как-нибудь сделайте лучше.','Оставьте пропуски: друг согласен.']),
 ('B21',['Which reflection gives a useful next step?','Какое размышление даёт полезный следующий шаг?'],['I missed paragraph 3; next time I will note each paragraph.','I was perfect at everything.','I finished first, so need no practice.','I will never check a source again.'],['Пропустил абзац 3; затем буду делать заметки по каждому.','Я всё сделал идеально.','Я первый, поэтому практика не нужна.','Больше не буду проверять источники.']),
 ('B22',['Quiet-reading count at Break 1?','Сколько тихо читали на перемене 1?'],['{quiet1}','{quiet2}','{quiet3}','{quiettotal}'],['{quiet1}','{quiet2}','{quiet3}','{quiettotal}']),
 ('B24',['Sum of all three quiet-reading counts?','Какова сумма трёх чисел тихо читающих?'],['{quiettotal}','{quietwrong1}','{quietwrong2}','{quietwrong3}'],['{quiettotal}','{quietwrong1}','{quietwrong2}','{quietwrong3}']),
 ('B25',['Break 2: how many MORE played than read?','На перемене 2 на сколько БОЛЬШЕ играли, чем читали?'],['{gap}','{gapwrong1}','{gapwrong2}','{gapwrong3}'],['{gap}','{gapwrong1}','{gapwrong2}','{gapwrong3}'])]:
 for lang,stem,options in zip(['en','ru'],stems,[oe,orr]):short('gp7b',code,lang,stem,options)
short('gp8','E19','zh','哪条反思体现了学习？',['样本有限，我把“所有人”改为“被询问者”','我所有方面都很完美','我比别人先完成','我再也不核查资料来源'])
short('gp8','E17','zh','哪条反馈能纠正缺少证据的论断？',['没有结果，把“已证明”改为“拟议”','做得好','想办法写得更好','朋友喜欢，所以保留“已证明”'])
short('gp8','E26','zh','哪个方案最适合检验小份食物减少浪费的预测？',['用同一方法比较试验前与试验期间，询问学生并考虑其他原因','听起来好，就假设预测正确','只问一名朋友是否喜欢','改变菜单和测量方法，却忽略变化'])
short('gp8','E32','zh','哪个单项摘要准确概括了行动方案？',['提议较小首份并允许添饭；试行时比较浪费和回答','只列原因，不提行动','声称它已在所有地方有效','抄下全部段落，不作选择'])
for items in BANK.values():
 for item in items:
  if 'zh' in item['choices']:item['choices']['zh']=[s.rstrip('。') for s in item['choices']['zh']]
UI=copy.deepcopy(c.UI)
for lang,u in UI.items():
 if lang=='en':
  u['rules']=['Answer all 20 questions. Choose ONE answer for each.','Circle A, B, C or D. Each correct answer earns 5 marks.','Use a blue or black pen. Work alone. No notes or devices.','Questions 1-10 are in the left column; 11-20 are in the right.']
  u['marks']='20 questions x 5 marks = 100 marks';u['end']='End of paper. Check all 20 answers.'
 elif lang=='ru':
  u['rules']=['Ответьте на все 20 вопросов. Выберите ОДИН ответ на каждый.','Обведите A, B, C или D. Верный ответ - 5 баллов.','Пишите синей или чёрной ручкой. Работайте сами. Без записей и устройств.','Вопросы 1-10 в левом столбце; 11-20 - в правом.']
  u['marks']='20 вопросов x 5 баллов = 100 баллов';u['end']='Конец работы. Проверьте все 20 ответов.'
 elif lang=='tr':
  u['rules']=['20 sorunun hepsini cevaplayın. Her soruda BİR cevap seçin.','A, B, C veya D harfini daire içine alın. Her doğru cevap 5 puandır.','Mavi veya siyah kalem kullanın. Tek çalışın. Not ve cihaz kullanmayın.','1-10. sorular sol sütunda, 11-20. sorular sağ sütundadır.']
  u['marks']='20 soru x 5 puan = 100 puan';u['end']='Sınav bitti. 20 cevabınızı kontrol edin.'
 else:
  u['rules']=['请回答全部20题。每题只有一个正确答案。','圈出A、B、C或D。每答对一题得5分。','用蓝色或黑色笔独立作答。不得使用笔记或电子设备。','第1-10题在左栏，第11-20题在右栏。']
  u['marks']='20题，每题5分，共100分';u['end']='试卷结束。请检查全部20题。'
def font(bold=False):return ('ChineseBold' if bold else 'Chinese') if LANG=='zh' else ('ArialBold' if bold else 'Arial')
def para(text,width,size=10,bold=False,leading=None):
 return Paragraph(escape(str(text)),ParagraphStyle('compact',fontName=font(bold),fontSize=size,leading=leading or size*1.16,wordWrap='CJK' if LANG=='zh' else None))
def p(can,text,x,y,width=CW,size=10,bold=False,leading=None):
 a=para(text,width,size,bold,leading);_,h=a.wrap(width,2000);a.drawOn(can,x,y-h);return y-h
def table(can,rows,x,y,widths,size=9.5):
 cells=[[para(value,widths[i]-10,size) for i,value in enumerate(row)] for row in rows]
 t=Table(cells,colWidths=widths);t.setStyle(TableStyle([('GRID',(0,0),(-1,-1),.5,colors.black),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
 _,h=t.wrap(CW,2000);t.drawOn(can,x,y-h);return y-h
def pack_list():
 olda=json.loads((ROOT/'tmp/pdfs/7a-exams/versions.json').read_text(encoding='utf-8'))
 oldc=json.loads((ROOT/'tmp/pdfs/7b-8-exams/versions.json').read_text(encoding='utf-8'))
 packs=[]
 for subj,vs in olda.items():
  subject='gp7a' if subj=='gp' else 'geo7a'
  packs.append(dict(key='7A',label='7A',subject=subject,filename='7A_'+('Global_Perspectives' if subj=='gp' else 'Geography')+'_20Q.pdf',old=vs))
 for group in c.GROUPS:
  for subject in group['subjects']:
   packs.append(dict(key=group['key'],label=group['label'],subject=subject,filename=group['key']+'_'+('Geography' if subject=='geo7b' else 'Global_Perspectives')+'_20Q.pdf',old=oldc[group['key']][subject]))
 return packs
def subject_label(s,lang):return UI[lang]['geo' if s.startswith('geo') else 'gp']
def question_height(q,size=9.5):
 h=para(str(q['number'])+'. '+q['stem'],COL,size+.3,True).wrap(COL,2000)[1]+2
 return h+sum(para(letter+') '+text,COL-7,size).wrap(COL-7,2000)[1] for letter,text in zip('ABCD',q['choices']))+5
def balance(items,v,rng):
 global LANG
 LANG=v['lang'];weighted=[]
 for item in items:
  example=dict(number=20,stem=item['stem'][LANG].format(**v['values']),choices=[s.format(**v['values']) for s in item['choices'][LANG]])
  weighted.append((question_height(example),rng.random(),item))
 weighted.sort(key=lambda x:(-x[0],x[1]));cols=[[],[]];totals=[0,0]
 for item in weighted:
  choices=[n for n in [0,1] if len(cols[n])<10];n=min(choices,key=lambda k:totals[k]);cols[n].append(item);totals[n]+=item[0]
 for _ in range(100):
  swaps=[(abs((totals[0]-a[0]+d[0])-(totals[1]-d[0]+a[0])),i,j) for i,a in enumerate(cols[0]) for j,d in enumerate(cols[1])]
  diff,i,j=min(swaps)
  if diff>=abs(totals[0]-totals[1])-.01:break
  a,d=cols[0][i],cols[1][j];cols[0][i],cols[1][j]=d,a;totals=[totals[0]-a[0]+d[0],totals[1]-d[0]+a[0]]
 for col in cols:rng.shuffle(col)
 return [item[2] for col in cols for item in col]
def prepare(packs):
 used={s:[] for s in BANK};report={}
 for pack in packs:
  subject=pack['subject'];selected=[item for item in BANK[subject] if item['code'] in SELECT[subject]];assert len(selected)==20
  result=[]
  for original in pack['old']:
   v=copy.deepcopy(original);v.update(subject=subject,id=original['id']+'-20',grade='7A' if pack['key']=='7A' else original['grade'],special=pack['key']=='7A' and original['index']==17)
   rng=random.Random(sum(ord(ch)*(i+1) for i,ch in enumerate(v['id']))+20261025)
   if v['special']:seq=[2]*20
   else:
    for _ in range(200000):
     seq=list(range(4))*5;rng.shuffle(seq)
     if any(len(list(g))>3 for _,g in itertools.groupby(seq)):continue
     if all(sum(a!=b for a,b in zip(seq,previous))>=12 for previous in used[subject]):break
    else:raise AssertionError('Cannot separate answer sequences')
   used[subject].append(seq[:]);order=balance(selected,v,rng);qs=[]
   for n,(item,pos) in enumerate(zip(order,seq),1):
    others=[1,2,3];rng.shuffle(others);others.insert(pos,0)
    choices=[t.format(**v['values']) for t in item['choices'][v['lang']]]
    assert len(set(choices))==4
    qs.append(dict(number=n,code=item['code'],stem=item['stem'][v['lang']].format(**v['values']),choices=[choices[k] for k in others],answer='ABCD'[pos],correct_en=item['choices']['en'][0].format(**v['values'])))
   v['questions']=qs;v['sequence']=''.join('ABCD'[i] for i in seq);result.append(v)
  pack['versions']=result
 for subject,seqs in used.items():
  distance=min(sum(a!=b for a,b in zip(x,y)) for x,y in itertools.combinations(seqs,2))
  assert distance>=12;report[subject]=distance
 return report
def measure(packs):
 global LANG
 records=[]
 for pack in packs:
  for v in pack['versions']:
   LANG=v['lang']
   heights=[sum(question_height(q) for q in v['questions'][i:i+10]) for i in [0,10]]
   records.append(dict(id=v['id'],lang=LANG,heights=[round(h,1) for h in heights]))
 return records
def footer(can,v,page):
 u=UI[v['lang']];can.setStrokeColor(colors.HexColor('#aaaaaa'));can.line(M,30,W-M,30);can.setFillColor(colors.black);can.setFont('Arial',8);can.drawString(M,18,v['id']);can.setFont(font(),8);can.drawRightString(W-M,18,f"{u['page']} {page} {u['of']} 2")
def cover(can,v):
 u=UI[v['lang']];can.setFillColor(colors.black);can.setFont('ArialBold',16);can.drawCentredString(W/2,H-40,'OXFORD INTERNATIONAL SCHOOL');can.setFont(font(True),12);can.drawCentredString(W/2,H-63,u['exam'])
 if v['special']:b.sunflower(can,W-M-18,H-92)
 y=p(can,f"{u['term']}  |  {u['version']}: {v['id']}  |  {u['duration']}: {u['minutes']}",M,H-84,size=9)
 y=p(can,u['name']+': '+'_'*62,M,y-14,size=10.5)
 y=p(can,f"{u['grade']}: {v['grade']}   {u['subject']}: {subject_label(v['subject'],v['lang'])}   {u['date']}: __________",M,y-10,size=10)
 y=table(can,[[u['score']+': ____ / 100',u['signature']+': __________________']],M,y-12,[200,CW-200],10)
 y=p(can,u['instructions'],M,y-14,bold=True,size=10.5)
 for i,rule in enumerate(u['rules'],1):y=p(can,str(i)+'. '+rule,M,y-4,size=10)
 y=p(can,u['marks'],M,y-12,bold=True,size=10.5)-18
 lang=v['lang'];subject=v['subject'];d=v['values']
 if subject=='geo7a':
  y=p(can,u['map'],M,y,bold=True,size=11);gx=M+22;cell=47;gy=y-211
  can.setStrokeColor(colors.HexColor('#777777'));can.setLineWidth(.5)
  for n in range(5):can.line(gx+n*cell,gy,gx+n*cell,gy+4*cell);can.line(gx,gy+n*cell,gx+4*cell,gy+n*cell)
  can.setFont(font(True),10)
  for n in range(4):can.drawCentredString(gx+(n+.5)*cell,gy-15,'ABCD'[n]);can.drawRightString(gx-7,gy+(n+.5)*cell-3,str(n+1))
  for kind,(x,yy) in zip(['school','pond','bridge','wood'],b.LAYOUTS[v['index']-1]):b.symbol(can,kind,gx+(x+.5)*cell,gy+(yy+.5)*cell,12)
  kx=M+270;ky=p(can,u['key'],kx,y-20,width=220,bold=True)
  for kind in ['school','pond','bridge','wood']:
   ky-=27;b.symbol(can,kind,kx+10,ky-3,9);p(can,u[kind],kx+30,ky+3,width=180)
  nx=gx+4*cell+25;ny=gy+150;can.setLineWidth(1.5);can.line(nx,ny,nx,ny+28);can.line(nx,ny+28,nx-4,ny+21);can.line(nx,ny+28,nx+4,ny+21);p(can,u['north'],nx-18,ny+45,width=70,size=8)
  y=p(can,u['mapnote'],M,gy-32,size=9.5);y=p(can,u['data'],M,y-16,bold=True)
  y=p(can,f"{u['scale']}: 1 cm = {d['scale']} m",M,y-10,size=11)
  y=p(can,u['ruler']+': '+u['fromto'].format(**d),M,y-10,size=10.5)
  y=p(can,f"{u['route']}: {d['cm1']} cm + {d['cm2']} cm",M,y-10,size=10.5)
 elif subject=='geo7b':
  intro={'en':'Use your knowledge for the UK countries, capitals and Great Britain questions. Use the table for weather-data questions.','ru':'Для вопросов о частях Соединённого Королевства, столицах и острове Великобритания используйте знания. Для погодных данных используйте таблицу.','zh':'有关联合王国构成国、首府及大不列颠岛的问题请运用所学知识。天气数据题请使用下表。'}[lang]
  y=p(can,intro,M,y,size=10.5)
  title={'en':'Made-up weather observations for this paper','ru':'Вымышленные погодные наблюдения для этого варианта','zh':'本试卷的虚构天气观察记录'}[lang]
  head={'en':['Day','Temperature (°C)','Rainfall (mm)','Wind speed (km/h)'],'ru':['День','Температура (°C)','Осадки (мм)','Скорость ветра (км/ч)'],'zh':['天数','气温（°C）','降雨量（mm）','风速（km/h）']}[lang]
  y=p(can,title,M,y-18,bold=True,size=11);y=table(can,[head]+[[i,d['t'+str(i)],d['r'+str(i)],d['w'+str(i)]] for i in range(1,4)],M,y-10,[55,145,130,CW-330],10)
  note={'en':'These are three daily records at one made-up place, not a long-term climate pattern.','ru':'Это три дневные записи в одном вымышленном месте, а не многолетняя закономерность климата.','zh':'这些记录是同一虚构地点三天的天气，不是长期气候规律。'}[lang];y=p(can,note,M,y-14,size=10)
 else:
  y=p(can,u['reading'],M,y,bold=True,size=11)
  passages=b.PASSAGE[lang] if subject=='gp7a' else c.READINGS[lang]['7b' if subject=='gp7b' else '8']['passages']
  for i,text in enumerate(passages,1):y=p(can,str(i)+'. '+text,M,y-9,size=10.5)
  if subject=='gp7b':
   title={'en':'Separate made-up practice observations for this exam','ru':'Отдельные вымышленные наблюдения для этого экзамена','zh':'本试卷另外提供的虚构观察记录'}[lang]
   head={'en':['Break','Quiet reading','Active games'],'ru':['Перемена','Тихое чтение','Активные игры'],'zh':['课间次数','安静阅读人数','活动游戏人数']}[lang]
   rows=[head]+[[i,d['quiet'+str(i)],d['active'+str(i)]] for i in range(1,4)]
   y=p(can,title,M,y-14,bold=True);y=table(can,rows,M,y-8,[100,155,155],10)
   note={'en':'The same pupil may be recorded at more than one break.','ru':'Один ученик мог быть записан на нескольких переменах.','zh':'同一名学生可能在多次课间被记录。'}[lang];y=p(can,note,M,y-8,size=9.5)
  else:
   title={'en':'Separate made-up baseline measurements before any trial','ru':'Отдельные вымышленные исходные измерения до испытания','tr':'Denemeden önceki ayrı hayalî başlangıç ölçümleri','zh':'任何试验开始前，另外提供的虚构基线测量'}[lang]
   head={'en':['Day','Uneaten food (kg)'],'ru':['День','Остатки еды (кг)'],'tr':['Gün','Yenmemiş yemek (kg)'],'zh':['天数','未吃完食物（kg）']}[lang]
   y=p(can,title,M,y-14,bold=True);y=table(can,[head]+[[i,d['d'+str(i)]] for i in range(1,4)],M,y-8,[100,200],10)
 assert y>45,(v['id'],'cover overflow',y)
 footer(can,v,1);return y
def question_page(can,v):
 u=UI[v['lang']];can.setFillColor(colors.black);can.setFont(font(True),11);can.drawString(M,H-30,v['grade']+'  '+subject_label(v['subject'],v['lang']));can.setFont('Arial',8.5);can.drawRightString(W-M,H-30,v['id']);can.line(M,H-39,W-M,H-39)
 can.setStrokeColor(colors.HexColor('#cccccc'));can.line(W/2,H-48,W/2,62);can.setStrokeColor(colors.black)
 bottoms=[]
 for column in range(2):
  x=M+column*(COL+GAP);y=H-60
  for qn in v['questions'][column*10:column*10+10]:
   start=y;y=p(can,str(qn['number'])+'. '+qn['stem'],x,y,width=COL,size=9.8,bold=True)-2
   for letter,text in zip('ABCD',qn['choices']):y=p(can,letter+') '+text,x+7,y,width=COL-7,size=9.5)
   y-=5
   assert abs((start-y)-question_height(qn))<.1
  bottoms.append(y)
 assert min(bottoms)>58,(v['id'],'column overflow',bottoms)
 p(can,u['end'],M,49,size=8.5);footer(can,v,2);return min(bottoms)
def write_pack(pack):
 global LANG
 path=OUT/pack['filename'];can=canvas.Canvas(str(path),pagesize=(W,H));can.setAuthor('Oxford International School');can.setTitle(pack['label']+' '+subject_label(pack['subject'],'en')+' 20-question exams')
 bottoms=[]
 for v in pack['versions']:
  LANG=v['lang'];can.bookmarkPage(v['id']);can.addOutlineEntry(v['id']+' '+v['lang'].upper(),v['id'])
  bottoms.append(cover(can,v));can.showPage();bottoms.append(question_page(can,v));can.showPage()
 can.save();assert len(PdfReader(path).pages)==2*len(pack['versions']);return path,min(bottoms)
def key_header(can,title,page):
 can.setFillColor(colors.black);can.setFont('ArialBold',14);can.drawString(M,H-32,title);can.setFont('Arial',8);can.drawRightString(W-M,18,f'TEACHER ONLY  |  COMPACT 20Q  |  {page}')
 return H-53
def write_keys(packs):
 global LANG
 LANG='en';path=OUT/'All_Classes_20Q_Teacher_Keys.pdf';can=canvas.Canvas(str(path),pagesize=(W,H));can.setTitle('All classes compact 20-question teacher keys');can.setAuthor('Oxford International School');page=1
 groups=[]
 for key in ['7A','7B_Group1','7B_Group2','Grade8_Class1','Grade8_Class2']:
  group_packs=[pack for pack in packs if pack['key']==key];groups.append((group_packs[0]['label'],group_packs[0]['versions'],group_packs))
 y=key_header(can,'Compact exams 20 questions per paper',page)
 for text in [
  'These keys REPLACE the 25-question keys. Use only papers whose codes end in -20. Each exam has two A4 pages: page 1 contains instructions and source material; page 2 has ten questions in each of two columns. Print double-sided, long-edge flip: ONE physical sheet per pupil per subject. Single-sided uses TWO sheets.',
  'Award 5 marks per correct answer; maximum 100. Wrong, missing or multiple remaining choices earn zero. Duration remains 60 minutes. Keep these keys separate from student papers. Use the full paper code, not only the pupil number.',
  'Language allocations and pupil numbers are unchanged. 7A pupil 17 is the sunflower/all-C version in BOTH subjects. All other versions have five of each correct letter and no run longer than three. Within each subject, every pair of 20-answer sequences differs in at least 12 positions. Question order, option order and numerical data vary.'
 ]:y=p(can,text,M,y-7,size=9)
 for gi,(name,vs,group_packs) in enumerate(groups):
  need=40+(len(vs)+1)*14
  if y-need<43:can.showPage();page+=1;y=key_header(can,'Distribution registers',page)
  y=p(can,name+' - '+('both subjects' if len(group_packs)>1 else 'Global Perspectives'),M,y-13,bold=True,size=10.5)-6
  rows=[['Pupil','Language','Pages in EACH student PDF','Assigned pupil name']]+[[f"{v['index']:02d}"+(' *' if v['special'] else ''),{'en':'English','ru':'Russian','tr':'Turkish','zh':'Chinese'}[v['lang']],f'{2*i+1}-{2*i+2}',''] for i,v in enumerate(vs)]
  t=Table(rows,colWidths=[60,80,180,CW-320],rowHeights=[17]+[14]*len(vs));t.setStyle(TableStyle([('FONTNAME',(0,0),(-1,-1),'Arial'),('FONTSIZE',(0,0),(-1,-1),8.3),('GRID',(0,0),(-1,-1),.4,colors.black),('VALIGN',(0,0),(-1,-1),'MIDDLE')]))
  _,height=t.wrap(CW,2000);t.drawOn(can,M,y-height);y-=height
 can.showPage();page+=1
 allv=[v for pack in packs for v in pack['versions']]
 for start in range(0,len(allv),4):
  key_header(can,'Answer keys - match the complete paper code',page)
  for k,v in enumerate(allv[start:start+4]):
   x=M+(k%2)*(COL+GAP);yt=H-63-(k//2)*345
   yt=p(can,v['id']+'  '+v['lang'].upper()+('  SUNFLOWER' if v['special'] else ''),x,yt,width=COL,bold=True,size=10)-5
   rows=[['Q','Answer','Bank reference']]+[[qn['number'],qn['answer'],qn['code']] for qn in v['questions']]
   t=Table(rows,colWidths=[35,55,COL-90],rowHeights=[16]+[12]*20)
   t.setStyle(TableStyle([('FONTNAME',(0,0),(-1,-1),'Arial'),('FONTSIZE',(0,0),(-1,-1),8.4),('GRID',(0,0),(-1,-1),.35,colors.black),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),1),('BOTTOMPADDING',(0,0),(-1,-1),1)]))
   _,height=t.wrap(COL,1000);t.drawOn(can,x,yt-height);assert yt-height>50
  can.showPage();page+=1
 for subject in BANK:
  name={'gp7a':'7A Global Perspectives','geo7a':'7A Geography','gp7b':'7B Global Perspectives','geo7b':'7B Geography','gp8':'Grade 8 Global Perspectives'}[subject]
  y=key_header(can,name+' explanations',page)
  for item in BANK[subject]:
   if item['code'] in SELECT[subject]:y=p(can,item['code']+'  '+item['reason'],M,y-10,size=9.5)
  assert y>45;can.showPage();page+=1
 can.save();return path
def validate(packs,files):
 expected=[23,23,11,11,4,4,14,12];assert [len(pack['versions']) for pack in packs]==expected
 count=0
 for pack,path in zip(packs,files):
  pdf=PdfReader(path);assert len(pdf.pages)==2*len(pack['versions'])
  for i,v in enumerate(pack['versions']):
   assert len(v['questions'])==20
   if v['special']:assert v['lang']=='en' and v['sequence']=='C'*20
   else:assert all(v['sequence'].count(letter)==5 for letter in 'ABCD')
   for pn in [2*i,2*i+1]:assert v['id'] in pdf.pages[pn].extract_text()
   text=pdf.pages[2*i+1].extract_text()
   assert all(str(n)+'.' in text for n in range(1,21))
   for qn in v['questions']:
    bank=next(item for item in BANK[pack['subject']] if item['code']==qn['code'])
    assert qn['choices']['ABCD'.index(qn['answer'])]==bank['choices'][v['lang']][0].format(**v['values'])
   count+=20
  assert [v['lang'] for v in pack['versions']]==[v['lang'] for v in pack['old']]
 return count
def main():
 packs=pack_list();distances=prepare(packs);measurements=measure(packs);files=[];layout={}
 for pack in packs:
  path,bottom=write_pack(pack);files.append(path);layout[path.name]=dict(papers=len(pack['versions']),pages=len(pack['versions'])*2,min_content_y=round(bottom,2))
 questions=validate(packs,files);key=write_keys(packs);files.append(key)
 bundle=OUT/'All_Classes_20Q_Exam_Packs.zip'
 with zipfile.ZipFile(bundle,'w',compression=zipfile.ZIP_DEFLATED) as archive:
  for file in files:archive.write(file,file.name)
 report=dict(student_papers=102,student_pages=204,questions_checked=questions,minimum_answer_distances=distances,packs=layout,teacher_key_pages=len(PdfReader(key).pages))
 (WORK/'versions.json').write_text(json.dumps([{k:v for k,v in pack.items() if k!='old'} for pack in packs],ensure_ascii=False,indent=2),encoding='utf-8')
 (WORK/'validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
 (WORK/'measurement.json').write_text(json.dumps(measurements,indent=2),encoding='utf-8')
 print(json.dumps(report,indent=2));print(str(bundle))
if __name__=='__main__':main()
