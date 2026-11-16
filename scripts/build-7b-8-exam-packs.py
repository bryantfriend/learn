"""Create the requested remaining class packs; keep examination files local."""
from pathlib import Path
import importlib.util, json, random, itertools, copy, math
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('base',ROOT/'scripts/build-7a-exam-packs.py')
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
W,H=b.W,b.H;M=b.M;CW=b.CW
OUT=ROOT/'output/pdf/7b-8-exams';OUT.mkdir(parents=True,exist_ok=True)
WORK=ROOT/'tmp/pdfs/7b-8-exams';WORK.mkdir(parents=True,exist_ok=True)
READINGS=json.loads((WORK/'class-readings.json').read_text(encoding='utf-8'))
for name,file in [('Chinese','msyh.ttc'),('ChineseBold','msyhbd.ttc')]:
 pdfmetrics.registerFont(TTFont(name,'C:/Windows/Fonts/'+file,subfontIndex=0))
pdfmetrics.registerFontFamily('Chinese',normal='Chinese',bold='ChineseBold',italic='Chinese',boldItalic='ChineseBold')
UI=copy.deepcopy(b.L)
UI['zh']=dict(gp='全球视野',geo='地理',exam='考试试卷',term='第一学期',name='学生姓名',grade='年级／班级',subject='科目',date='日期',version='试卷编号',duration='考试时间',minutes='60分钟',score='总分',signature='教师签名',instructions='答题说明',rules=['请回答全部25题。每题只有一个正确答案。','在每题旁圈出A、B、C或D。每答对一题得4分。','请用蓝色或黑色笔独立作答。不得使用笔记或电子设备。','相关材料在第1页。完成后请检查所有答案。'],reading='阅读以下虚构的学校案例',questions='选择题',marks='25题，每题4分，共100分',page='第',of='／',end='试卷结束。请检查是否已回答全部25题。')
for lang in ['en','ru']:
 UI[lang]['rules'][3]={'en':'Use the material on page 1 where needed. Check all answers before finishing.','ru':'При необходимости используйте материал на странице 1. В конце проверьте все ответы.'}[lang]
GROUPS=[
 dict(key='7B_Group1',grade='7B',label='7B Group 1',prefix='7B1',langs=['en']*10+['ru'],subjects=['gp7b','geo7b']),
 dict(key='7B_Group2',grade='7B',label='7B Group 2',prefix='7B2',langs=['zh']*4,subjects=['gp7b','geo7b']),
 dict(key='Grade8_Class1',grade='8',label='Grade 8 Class 1',prefix='8C1',langs=['en']*9+['ru']*5,subjects=['gp8']),
 dict(key='Grade8_Class2',grade='8',label='Grade 8 Class 2',prefix='8C2',langs=['en']*9+['ru']*2+['zh'],subjects=['gp8'])]
BANK={s:[] for s in ['gp7b','geo7b','gp8']}
def q(subject,code,stems,options,reason):
 assert len(stems)==3 and len(options)==3 and all(len(o)==4 for o in options)
 BANK[subject].append(dict(code=code,stem=dict(zip(['en','ru','zh'],stems)),choices=dict(zip(['en','ru','zh'],options)),reason=reason))

# Book 7: break spaces, methods, notes and a whole-text summary.
q('gp7b','B01',[
 'Which question is most neutral?','Какой вопрос наиболее нейтрален?','哪个问题最中立？'],[
 ['What do pupils like and dislike about their break spaces?','Why does everyone hate quiet spaces?','Why are all games bad?','Why does nobody want to read?'],
 ['Что ученикам нравится и не нравится в местах отдыха?','Почему все ненавидят тихие места?','Почему все игры плохие?','Почему никто не хочет читать?'],
 ['学生喜欢和不喜欢课间活动场所的哪些方面？','为什么所有人都讨厌安静的地方？','为什么所有游戏都不好？','为什么没有人想阅读？']],
 'A neutral question permits positive, negative and mixed answers.')
q('gp7b','B02',[
 'Which question is most focused for a small class investigation?','Какой вопрос наиболее конкретен для небольшого исследования класса?','哪个问题最适合小规模的班级调查？'],[
 ['How do pupils use our school playground during breaks this week?','How can every country solve every problem?','Why do people do things?','What is everything about schools?'],
 ['Как ученики используют нашу площадку на переменах этой недели?','Как всем странам решить все проблемы?','Почему люди что-то делают?','Что вообще известно о школах?'],
 ['本周课间，学生如何使用我们学校的操场？','所有国家如何解决所有问题？','人为什么做事情？','关于学校的一切是什么？']],
 'It specifies the school, activity, break times and week.')
q('gp7b','B03',[
 'Which method best shows how many pupils use each break area?','Какой метод лучше показывает число учеников в каждой зоне отдыха?','哪种方法最能了解各课间活动区有多少学生？'],[
 ['Observe the areas and count pupils.','Ask one pupil to guess every count.','Only read a story about another school.','Only count classroom doors.'],
 ['Наблюдать за зонами и считать учеников.','Попросить одного ученика угадать все числа.','Только прочитать рассказ о другой школе.','Только посчитать двери классов.'],
 ['观察各区域并清点学生人数。','让一名学生猜出所有人数。','只阅读另一个学校的故事。','只数教室的门。']],
 'Observation and counting provide direct information about use at the stated times.')
q('gp7b','B04',[
 'How can researchers best learn WHY pupils prefer a quiet space?','Как лучше узнать, ПОЧЕМУ ученики предпочитают тихое место?','研究者怎样最能了解学生为什么喜欢安静的地方？'],[
 ['Ask pupils neutral questions about their reasons.','Only count the benches.','Only measure the length of a path.','Assume every pupil has the same reason.'],
 ['Задать ученикам нейтральные вопросы о причинах.','Только посчитать скамейки.','Только измерить длину дорожки.','Считать, что у всех одна причина.'],
 ['向学生提出中立问题，询问他们的理由。','只数长椅。','只测量小路长度。','假设每名学生的理由都相同。']],
 'Reported reasons require asking pupils; counts alone do not explain preferences.')
q('gp7b','B05',[
 'What can counting pupils NOT explain on its own?','Что подсчёт учеников сам по себе НЕ объясняет?','只清点学生人数，不能解释什么？'],[
 ['Why each pupil chose that area.','The number counted in an area.','Which area had more pupils at that time.','The difference between two recorded counts.'],
 ['Почему каждый ученик выбрал эту зону.','Число учеников, посчитанных в зоне.','В какой зоне в тот момент было больше учеников.','Разницу между двумя записанными числами.'],
 ['每名学生为什么选择那个区域。','某个区域清点到的人数。','当时哪个区域的学生更多。','两个记录人数之间的差。']],
 'Observation records use; it does not establish each person\'s reasons.')
q('gp7b','B06',[
 'Why observe more than one break time?','Зачем наблюдать больше одной перемены?','为什么要观察不止一次课间活动？'],[
 ['Use of an area may change between breaks.','One count proves what always happens.','Repeated observation makes every count equal.','It removes the need to record times.'],
 ['Использование зоны может меняться на разных переменах.','Один подсчёт доказывает, что происходит всегда.','Повторное наблюдение делает все числа одинаковыми.','Тогда не нужно записывать время.'],
 ['不同课间，区域的使用情况可能不同。','一次清点能证明每次的情况。','重复观察会让所有人数相同。','这样就不用记录时间。']],
 'Repeated observation checks variation instead of treating one break as universal.')
q('gp7b','B07',[
 'Why combine observations with pupils\' replies?','Зачем сочетать наблюдения с ответами учеников?','为什么要结合观察记录和学生的回答？'],[
 ['They provide information about use and reported reasons.','They guarantee everyone agrees.','They prove that one activity suits everyone.','They remove the need to check evidence.'],
 ['Они дают сведения об использовании и сообщённых причинах.','Они гарантируют согласие всех.','Они доказывают, что одно занятие подходит всем.','Тогда не нужно проверять данные.'],
 ['它们能提供使用情况和学生所报告的理由。','它们能保证所有人意见一致。','它们能证明一种活动适合所有人。','它们能免去核查证据的需要。']],
 'The methods supply complementary information.')
q('gp7b','B08',[
 'Only two close friends were asked. What is the main limit?','Опросили только двух близких друзей. Каково главное ограничение?','只询问了两名好朋友。主要局限是什么？'],[
 ['Their views may not represent other pupils.','Two pupils always represent the whole school.','Friends can never provide useful information.','The survey proves every pupil wants games.'],
 ['Их мнения могут не отражать мнения других учеников.','Два ученика всегда представляют всю школу.','Друзья никогда не дают полезных сведений.','Опрос доказывает, что все хотят играть.'],
 ['他们的观点可能不能代表其他学生。','两名学生总能代表全校。','朋友永远不能提供有用信息。','这份调查证明所有学生都想玩游戏。']],
 'A small, narrow sample cannot safely stand for the whole school.')
q('gp7b','B09',[
 'Before using a website as a source, what should you check?','Что нужно проверить перед использованием сайта как источника?','使用网站作为资料来源之前，应检查什么？'],[
 ['Its author, date, purpose and supporting evidence.','Only its colours.','Only whether its title agrees with you.','Only how many pictures it has.'],
 ['Автора, дату, цель и подтверждающие данные.','Только его цвета.','Только совпадает ли заголовок с вашим мнением.','Только число картинок.'],
 ['作者、日期、目的以及支持性证据。','只检查颜色。','只检查标题是否符合自己的看法。','只检查图片数量。']],
 'A source needs evaluation; being online does not establish reliability.')
q('gp7b','B10',[
 'What is the main idea of the reading?','Какова главная мысль текста?','阅读材料的主旨是什么？'],[
 ['Different break-space needs can be investigated by observing and asking pupils.','Every pupil wants the same activity.','Only the number of benches matters.','Researchers have proved that quiet spaces are useless.'],
 ['Разные потребности в отдыхе можно изучать наблюдением и вопросами ученикам.','Все ученики хотят одного занятия.','Важно только число скамеек.','Исследователи доказали бесполезность тихих мест.'],
 ['可以通过观察和询问学生，研究不同的课间活动需求。','每名学生都想做同一种活动。','只有长椅数量重要。','研究者已经证明安静的地方没有用。']],
 'The main idea connects different needs with observation and questions.')
q('gp7b','B11',[
 'Which title best fits all three paragraphs?','Какой заголовок лучше подходит ко всем трём абзацам?','哪个标题最适合全部三个段落？'],[
 ['Investigating pupils\' break-space needs','All pupils hate reading','The final proof that games solve everything','How to paint a classroom door'],
 ['Исследование потребностей учеников в местах отдыха','Все ученики ненавидят чтение','Доказательство того, что игры решают всё','Как покрасить дверь класса'],
 ['调查学生的课间活动场所需求','所有学生都讨厌阅读','游戏能解决所有问题的最终证明','如何粉刷教室的门']],
 'An accurate title covers the whole text without inventing results.')
q('gp7b','B12',[
 'Which is a useful subject term for this investigation?','Какой термин полезен для этого исследования?','哪个词是这项调查中有用的学科术语？'],[
 ['Observation','Beautiful','Suddenly','Yesterday'],['Наблюдение','Красивый','Внезапно','Вчера'],['观察','美丽','突然','昨天']],
 'Observation names a research method used in the reading.')
q('gp7b','B13',[
 'What is the main point of paragraph 1?','Какова главная мысль абзаца 1?','第1段的要点是什么？'],[
 ['Pupils need choices because they want different activities.','Every pupil must run at every break.','No pupil wants a quiet place.','All break spaces are already identical.'],
 ['Ученикам нужен выбор, так как они хотят разных занятий.','Каждый должен бегать на каждой перемене.','Никому не нужно тихое место.','Все места отдыха уже одинаковы.'],
 ['学生想做不同活动，因此需要有选择。','每名学生每次课间都必须跑步。','没有学生想要安静的地方。','所有课间活动场所都已经相同。']],
 'Paragraph 1 establishes varied needs and the value of choices.')
q('gp7b','B14',[
 'Which note best represents paragraph 2?','Какая заметка лучше передаёт абзац 2?','哪条笔记最准确地概括第2段？'],[
 ['Observe activities and counts at different breaks; reasons remain unknown.','One count explains every pupil\'s reason.','Never record which area is used.','Observation proves everyone wants one activity.'],
 ['Наблюдать занятия и числа на разных переменах; причины ещё неизвестны.','Один подсчёт объясняет причины всех учеников.','Никогда не записывать используемую зону.','Наблюдение доказывает, что все хотят одного занятия.'],
 ['在不同课间观察活动并记录人数；原因仍不清楚。','一次清点能解释每名学生的理由。','从不记录哪个区域被使用。','观察证明所有人都想做同一种活动。']],
 'The note selects the method and retains its limit.')
q('gp7b','B15',[
 'Which statement best captures paragraph 3?','Какое утверждение лучше передаёт абзац 3?','哪句话最能概括第3段？'],[
 ['Ask neutral questions, compare replies with observations and report missing views.','Ask only questions that force agreement.','Ignore observations once a friend replies.','Claim that one pupil represents every country.'],
 ['Задавать нейтральные вопросы, сравнивать с наблюдениями и указать недостающие мнения.','Задавать только вопросы, вынуждающие согласиться.','Игнорировать наблюдения после ответа друга.','Считать, что один ученик представляет все страны.'],
 ['提出中立问题，将回答与观察比较，并说明缺少哪些观点。','只提出迫使别人同意的问题。','朋友回答之后就忽略观察。','声称一名学生代表所有国家。']],
 'Paragraph 3 links neutral questions, comparison and scope.')
q('gp7b','B16',[
 'What should useful notes keep?','Что должны сохранять полезные заметки?','有用的笔记应保留什么？'],[
 ['Main points, relevant details and important limits.','Every word copied without selection.','Only words that are easy to spell.','Unsupported opinions added as facts.'],
 ['Главные мысли, нужные детали и важные ограничения.','Все слова, скопированные без отбора.','Только слова, которые легко написать.','Неподтверждённые мнения как факты.'],
 ['主要观点、相关细节和重要局限。','不加选择地抄下每个词。','只保留容易拼写的词。','把没有证据的意见加为事实。']],
 'Notes should select relevant meaning without losing qualifications.')
q('gp7b','B17',[
 'What is a good whole-text summary?','Что такое хорошее краткое изложение всего текста?','好的全文摘要是什么样的？'],[
 ['A shorter own-word account of the main idea and key points across the text.','Only the first sentence copied exactly.','An unrelated personal story.','A longer text with invented results.'],
 ['Более короткий пересказ своими словами главной мысли и ключевых пунктов всего текста.','Только первое предложение, скопированное точно.','Личный рассказ на другую тему.','Более длинный текст с выдуманными результатами.'],
 ['用自己的话简要表达全文主旨和各部分要点。','只原样抄下第一句话。','讲一个无关的个人故事。','写更长的文字并编造结果。']],
 'A whole-text summary selects key ideas across the reading, not only one paragraph.')
q('gp7b','B18',[
 'In the 7B workbook task, what do you summarise?','Что нужно кратко изложить в задании 7B по рабочей тетради?','7B练习册任务要求概括什么？'],[
 ['The whole text, using the workbook starters to help.','Only one word from paragraph 1.','Only a different country\'s weather.','Two copied sentences from every paragraph without checking.'],
 ['Весь текст с помощью начальных фраз рабочей тетради.','Только одно слово из абзаца 1.','Только погоду другой страны.','По два скопированных предложения из каждого абзаца без проверки.'],
 ['借助练习册的句子开头来概括全文。','只概括第1段的一个词。','只概括另一个国家的天气。','每段抄两句话，不作核查。']],
 'Book 7 uses a whole-text summary; do not apply the 7A paragraph-by-paragraph task.')
q('gp7b','B19',[
 'Which feedback most helps a writer improve a summary?','Какой отзыв лучше помогает улучшить краткое изложение?','哪条反馈最能帮助作者改进摘要？'],[
 ['Add the questions method from paragraph 3; your summary only covers observation.','Good!','Make it better somehow.','Keep missing ideas because a friend agrees.'],
 ['Добавьте вопросы из абзаца 3: у вас изложено только наблюдение.','Хорошо!','Как-нибудь сделайте лучше.','Оставьте пропуски: друг согласен.'],
 ['补上第3段的询问方法；你的摘要只写了观察。','很好！','想办法写得更好。','朋友同意，所以继续漏掉要点。']],
 'Specific feedback points to a missing idea and offers a source-based improvement.')
q('gp7b','B20',[
 'Two partners disagree about a summary. What should they check?','Два ученика не согласны с кратким изложением. Что проверить?','两名同学对摘要有分歧，应检查什么？'],[
 ['The meaning in the source text.','Who speaks louder.','Who writes faster.','Which answer is more popular.'],
 ['Смысл исходного текста.','Кто говорит громче.','Кто пишет быстрее.','Какой ответ популярнее.'],
 ['原文表达的意思。','谁说话声音更大。','谁写得更快。','哪个答案更受欢迎。']],
 'Return to the evidence rather than deciding by popularity or speed.')
q('gp7b','B21',[
 'Which reflection includes a difficulty and a useful next step?','Какое размышление указывает трудность и полезный следующий шаг?','哪条反思说明了困难和有用的下一步？'],[
 ['I missed paragraph 3; next time I will note each paragraph before summarising.','I was perfect at everything.','I finished first, so I need no practice.','I will never check a source again.'],
 ['Я пропустил абзац 3; в следующий раз сделаю заметки по каждому абзацу.','Я всё сделал идеально.','Я закончил первым, поэтому практика не нужна.','Я больше никогда не проверю источник.'],
 ['我漏掉了第3段；下次先记下每段要点，再写摘要。','我所有方面都很完美。','我最先完成，所以不必练习。','我再也不检查资料来源了。']],
 'The response identifies a specific difficulty and a practical improvement.')
q('gp7b','B22',[
 'How many pupils were recorded reading quietly at Break 1?','Сколько учеников тихо читали на перемене 1 по таблице?','表中第1次课间安静阅读的学生有多少人？'],[
 ['{quiet1}','{quiet2}','{quiet3}','{quiettotal}'],['{quiet1}','{quiet2}','{quiet3}','{quiettotal}'],['{quiet1}','{quiet2}','{quiet3}','{quiettotal}']],
 'Read the quiet-reading count for Break 1 in this version\'s table.')
q('gp7b','B23',[
 'Which break had the greatest recorded active-games count?','На какой перемене записано больше всего играющих в активные игры?','哪次课间记录到参加活动游戏的学生最多？'],[
 ['Break {maxbreak}','Break {otherbreak1}','Break {otherbreak2}','All three breaks had equal counts.'],['Перемена {maxbreak}','Перемена {otherbreak1}','Перемена {otherbreak2}','На всех трёх переменах поровну.'],['第{maxbreak}次课间','第{otherbreak1}次课间','第{otherbreak2}次课间','三次课间人数相同。']],
 'Compare the active-games counts, not the quiet-reading column.')
q('gp7b','B24',[
 'What is the sum of the three quiet-reading counts?','Какова сумма трёх записанных чисел тихо читающих учеников?','三次记录的安静阅读人数之和是多少？'],[
 ['{quiettotal}','{quietwrong1}','{quietwrong2}','{quietwrong3}'],['{quiettotal}','{quietwrong1}','{quietwrong2}','{quietwrong3}'],['{quiettotal}','{quietwrong1}','{quietwrong2}','{quietwrong3}']],
 'Add the three recorded counts. They need not be different individual pupils.')
q('gp7b','B25',[
 'At Break 2, how many MORE pupils played active games than read quietly?','На перемене 2 на сколько БОЛЬШЕ учеников играли, чем тихо читали?','第2次课间，参加活动游戏的学生比安静阅读的多多少人？'],[
 ['{gap}','{gapwrong1}','{gapwrong2}','{gapwrong3}'],['{gap}','{gapwrong1}','{gapwrong2}','{gapwrong3}'],['{gap}','{gapwrong1}','{gapwrong2}','{gapwrong3}']],
 'Subtract the quiet-reading count from the active-games count at Break 2.')

# 7B Geography: UK membership and capitals, basic weather and instrument readings.
def ge(code,en,ru,zh,oe,orr,oz,reason):q('geo7b',code,[en,ru,zh],[oe,orr,oz],reason)
ge('G01','What is the capital of England?','Какова столица Англии?','英格兰的首府是哪座城市？',['London','Cardiff','Edinburgh','Belfast'],['Лондон','Кардифф','Эдинбург','Белфаст'],['伦敦','加的夫','爱丁堡','贝尔法斯特'],'England\'s capital is London.')
ge('G02','What is the capital of Scotland?','Какова столица Шотландии?','苏格兰的首府是哪座城市？',['Edinburgh','Glasgow','London','Cardiff'],['Эдинбург','Глазго','Лондон','Кардифф'],['爱丁堡','格拉斯哥','伦敦','加的夫'],'Scotland\'s capital is Edinburgh, not Glasgow.')
ge('G03','What is the capital of Wales?','Какова столица Уэльса?','威尔士的首府是哪座城市？',['Cardiff','London','Belfast','Edinburgh'],['Кардифф','Лондон','Белфаст','Эдинбург'],['加的夫','伦敦','贝尔法斯特','爱丁堡'],'Wales\'s capital is Cardiff.')
ge('G04','What is the capital of Northern Ireland?','Какова столица Северной Ирландии?','北爱尔兰的首府是哪座城市？',['Belfast','Dublin','Cardiff','London'],['Белфаст','Дублин','Кардифф','Лондон'],['贝尔法斯特','都柏林','加的夫','伦敦'],'Northern Ireland\'s capital is Belfast; Dublin is the capital of the separate state Ireland.')
ge('G05','What is the capital of the United Kingdom?','Какова столица Соединённого Королевства?','联合王国的首都是哪座城市？',['London','Edinburgh','Cardiff','Dublin'],['Лондон','Эдинбург','Кардифф','Дублин'],['伦敦','爱丁堡','加的夫','都柏林'],'London is the capital of both England and the United Kingdom.')
ge('G06','Which list contains all four countries of the UK?','В каком списке все четыре части Соединённого Королевства?','哪个选项列出了联合王国的全部四个构成国？',
 ['England, Scotland, Wales, Northern Ireland.','England, Scotland, Wales, Ireland.','England, Wales, France, Northern Ireland.','Scotland, Wales, Ireland, France.'],
 ['Англия, Шотландия, Уэльс, Северная Ирландия.','Англия, Шотландия, Уэльс, Ирландия.','Англия, Уэльс, Франция, Северная Ирландия.','Шотландия, Уэльс, Ирландия, Франция.'],
 ['英格兰、苏格兰、威尔士、北爱尔兰。','英格兰、苏格兰、威尔士、爱尔兰。','英格兰、威尔士、法国、北爱尔兰。','苏格兰、威尔士、爱尔兰、法国。'],'The UK comprises England, Scotland, Wales and Northern Ireland.')
ge('G07','Which three countries are on the island of Great Britain?','Какие три части находятся на острове Великобритания?','大不列颠岛上有哪三个构成国？',
 ['England, Scotland and Wales.','England, Wales and Northern Ireland.','Scotland, Wales and Ireland.','England, Ireland and Northern Ireland.'],
 ['Англия, Шотландия и Уэльс.','Англия, Уэльс и Северная Ирландия.','Шотландия, Уэльс и Ирландия.','Англия, Ирландия и Северная Ирландия.'],
 ['英格兰、苏格兰和威尔士。','英格兰、威尔士和北爱尔兰。','苏格兰、威尔士和爱尔兰。','英格兰、爱尔兰和北爱尔兰。'],'Great Britain is the large island containing England, Scotland and Wales.')
ge('G08','Which is in the UK but not on Great Britain?','Что входит в Соединённое Королевство, но не на острове Великобритания?','哪个构成国属于联合王国，但不在大不列颠岛上？',
 ['Northern Ireland','Wales','Scotland','England'],['Северная Ирландия','Уэльс','Шотландия','Англия'],['北爱尔兰','威尔士','苏格兰','英格兰'],'Northern Ireland is in the UK and on the island of Ireland.')
ge('G09','Which statement about Ireland is correct?','Какое утверждение об Ирландии верно?','关于爱尔兰，哪个说法正确？',
 ['It is a separate state outside the UK, with Dublin as its capital.','It is another name for England.','It is the same as Northern Ireland.','Its capital is Cardiff and it is in the UK.'],
 ['Это отдельное государство вне Соединённого Королевства со столицей Дублин.','Это другое название Англии.','Это то же самое, что Северная Ирландия.','Его столица Кардифф; оно входит в Соединённое Королевство.'],
 ['它是联合王国以外的独立国家，首都是都柏林。','它是英格兰的另一个名称。','它与北爱尔兰相同。','它的首都是加的夫，并属于联合王国。'],'Distinguish the separate state Ireland from Northern Ireland and from the island.')
ge('G10','On which island is Belfast?','На каком острове находится Белфаст?','贝尔法斯特位于哪个岛上？',['The island of Ireland.','Great Britain.','Iceland.','The Isle of Wight.'],['На острове Ирландия.','На острове Великобритания.','На острове Исландия.','На острове Уайт.'],['爱尔兰岛。','大不列颠岛。','冰岛。','怀特岛。'],'Belfast is in Northern Ireland on the island of Ireland.')
ge('G11','Where is Wales in relation to England?','Где находится Уэльс по отношению к Англии?','威尔士位于英格兰的哪个方向？',['To the west.','To the east.','Far to the south across the Channel.','Inside Northern Ireland.'],['К западу.','К востоку.','Далеко к югу через пролив Ла-Манш.','Внутри Северной Ирландии.'],['西面。','东面。','隔英吉利海峡的遥远南面。','北爱尔兰内部。'],'Wales lies west of England.')
ge('G12','Where is Scotland in relation to England?','Где находится Шотландия по отношению к Англии?','苏格兰位于英格兰的哪个方向？',['To the north.','To the south.','Inside Wales.','On the island of Ireland.'],['К северу.','К югу.','Внутри Уэльса.','На острове Ирландия.'],['北面。','南面。','威尔士内部。','爱尔兰岛上。'],'Scotland is north of England.')
ge('G13','What is weather?','Что такое погода?','什么是天气？',
 ['Short-term conditions of the atmosphere in a place.','Only a place\'s patterns over many years.','The names of a country\'s capitals.','The shape of a map symbol.'],
 ['Кратковременное состояние атмосферы в определённом месте.','Только закономерности места за много лет.','Названия столиц страны.','Форма условного знака карты.'],
 ['某地短期的大气状况。','仅指某地多年的规律。','一个国家的首都名称。','地图符号的形状。'],'Weather describes short-term atmospheric conditions.')
ge('G14','What is climate?','Что такое климат?','什么是气候？',
 ['Long-term patterns of weather over many years.','The weather during one lunch break only.','One rainy afternoon only.','The direction to a capital city.'],
 ['Многолетние закономерности погоды.','Погода только на одной обеденной перемене.','Только один дождливый день.','Направление к столице.'],
 ['多年来的长期天气规律。','仅指一次午间休息时的天气。','仅指一个下雨的下午。','前往首都的方向。'],'Climate concerns long-term weather patterns, rather than a single event.')
ge('G15','Which instrument measures temperature?','Какой прибор измеряет температуру?','哪种仪器测量气温？',['Thermometer','Rain gauge','Anemometer','Wind vane'],['Термометр','Осадкомер','Анемометр','Флюгер'],['温度计','雨量计','风速计','风向标'],'A thermometer measures temperature.')
ge('G16','Which instrument measures rainfall?','Какой прибор измеряет количество осадков?','哪种仪器测量降雨量？',['Rain gauge','Thermometer','Wind vane','Magnetic compass'],['Осадкомер','Термометр','Флюгер','Магнитный компас'],['雨量计','温度计','风向标','磁罗盘'],'A rain gauge measures rainfall.')
ge('G17','Which instrument measures wind speed?','Какой прибор измеряет скорость ветра?','哪种仪器测量风速？',['Anemometer','Wind vane','Rain gauge','Ruler'],['Анемометр','Флюгер','Осадкомер','Линейка'],['风速计','风向标','雨量计','直尺'],'An anemometer measures wind speed.')
ge('G18','Which instrument shows wind direction?','Какой прибор показывает направление ветра?','哪种仪器显示风向？',['Wind vane','Thermometer','Rain gauge','Measuring jug'],['Флюгер','Термометр','Осадкомер','Мерный кувшин'],['风向标','温度计','雨量计','量杯'],'A wind vane shows wind direction.')
ge('G19','Where does a northerly wind come FROM?','ОТКУДА дует северный ветер?','北风是从哪个方向吹来的？',['North','South','East','West'],['С севера','С юга','С востока','С запада'],['北方','南方','东方','西方'],'Wind direction names where the air comes from, not where it goes.')
ge('G20','Which unit is normally used for temperature in these weather records?','Какая единица используется для температуры в этих записях?','这些天气记录用哪个单位表示气温？',['Degrees Celsius (°C).','Millimetres (mm).','Kilometres per hour (km/h).','Kilograms (kg).'],['Градусы Цельсия (°C).','Миллиметры (мм).','Километры в час (км/ч).','Килограммы (кг).'],['摄氏度（°C）。','毫米（mm）。','千米／小时（km/h）。','千克（kg）。'],'Temperature is recorded here in degrees Celsius.')
ge('G21','Which unit is used for rainfall in the table?','Какая единица используется для осадков в таблице?','表中用哪个单位表示降雨量？',['Millimetres (mm).','Degrees Celsius (°C).','Kilograms (kg).','Kilometres per hour (km/h).'],['Миллиметры (мм).','Градусы Цельсия (°C).','Килограммы (кг).','Километры в час (км/ч).'],['毫米（mm）。','摄氏度（°C）。','千克（kg）。','千米／小时（km/h）。'],'Rainfall depth is recorded in millimetres.')
ge('G22','Which recorded day had the highest temperature?','В какой день записана самая высокая температура?','记录中哪一天气温最高？',
 ['Day {warmday}','Day {warmother1}','Day {warmother2}','All three temperatures are equal.'],['День {warmday}','День {warmother1}','День {warmother2}','Все три температуры одинаковы.'],['第{warmday}天','第{warmother1}天','第{warmother2}天','三天气温相同。'],'Compare the temperature column, not rainfall or wind speed.')
ge('G23','What is the total rainfall recorded over the three days?','Какова сумма осадков, записанных за три дня?','三天记录的总降雨量是多少？',
 ['{raintotal} mm','{rainwrong1} mm','{rainwrong2} mm','{rainwrong3} mm'],['{raintotal} мм','{rainwrong1} мм','{rainwrong2} мм','{rainwrong3} мм'],['{raintotal} mm','{rainwrong1} mm','{rainwrong2} mm','{rainwrong3} mm'],'Add all three daily rainfall amounts and keep the unit mm.')
ge('G24','What is the difference between the highest and lowest temperatures?','Какова разница между самой высокой и самой низкой температурой?','最高气温与最低气温相差多少？',
 ['{temprange} °C','{tempwrong1} °C','{tempwrong2} °C','{tempwrong3} °C'],['{temprange} °C','{tempwrong1} °C','{tempwrong2} °C','{tempwrong3} °C'],['{temprange} °C','{tempwrong1} °C','{tempwrong2} °C','{tempwrong3} °C'],'Subtract the lowest temperature from the highest.')
ge('G25','Which day had the highest recorded wind speed?','В какой день записана самая высокая скорость ветра?','哪一天记录的风速最大？',
 ['Day {windday}','Day {windother1}','Day {windother2}','All three wind speeds are equal.'],['День {windday}','День {windother1}','День {windother2}','Все три скорости одинаковы.'],['第{windday}天','第{windother1}天','第{windother2}天','三天风速相同。'],'Read the wind-speed column and identify its maximum.')

# Book 9 retains appropriate common research items, with additional perspective skills.
REUSE=[1,2,3,4,5,6,7,8,9,13,14,17,18,19,20,21]
ZH_REUSE={
 1:('哪个问题最中立？',['学生喜欢和不喜欢午餐的哪些方面？','为什么每名学生都讨厌午餐？','为什么所有学校的食物都不好？','为什么没有人想吃健康食物？']),
 2:('哪个研究问题最聚焦？',['我们学校本周浪费了多少午餐食物？','每所学校如何解决所有问题？','人为什么吃饭？','关于食物的一切是什么？']),
 3:('哪种方法最适合测量未吃完食物的数量？',['每天用相同方法称量剩余食物。','让一名学生猜重量。','阅读一个餐馆故事。','数有多少学生在微笑。']),
 4:('哪种方法最能了解学生为什么剩下食物？',['中立地询问学生的理由。','只称量剩余食物。','只数餐桌。','只拍摄厨房的门。']),
 5:('只称量剩余食物，不能说明什么？',['学生为什么剩下食物。','剩余食物的测量重量。','记录中哪一天浪费更多。','两个记录重量之间的差。']),
 6:('一名学生只询问两名好朋友。主要局限是什么？',['他们的观点可能不能代表其他学生。','两个人总能代表全校。','朋友永远不能提供有用信息。','小样本能证明所有原因。']),
 7:('使用文章作为证据之前，应检查什么？',['作者、日期、目的以及支持性证据。','只检查彩色图片。','只检查标题是否符合自己的看法。','只数它说了多少次“真实”。']),
 8:('为什么要结合食物浪费测量和访谈？',['它们能提供数量和人们所报告的理由。','它们能保证每名学生意见一致。','它们能免去记录证据的需要。','它们能证明拟议试验已经有效。']),
 9:('为什么每天使用相同的称量方法？',['使测量结果更便于公平比较。','强迫所有重量完全相同。','避免记录菜单。','不必询问就知道每名学生的理由。']),
 13:('哪条笔记最准确地表达拟议试验？',['拟议较小的第一份食物；可添饭；尚未试验。','已经证明小份食物对所有人都有效。','所有学生必须少吃；不许添饭。','小组已经停止收集信息。']),
 14:('资料说“可能减少浪费”。哪个改写保留了原意？',['也许能减少浪费。','已经证明浪费将完全消失。','在每所学校都总能减少浪费。','绝不可能影响浪费。']),
 17:('哪条反馈最能帮助作者纠正缺少证据的论断？',['把“已证明”改为“拟议”，因为没有给出试验结果。','做得好！','想办法写得更好。','朋友喜欢“已证明”，所以保留它。']),
 18:('两名同学对摘要有分歧。接下来应怎么做？',['回到原文核查意思。','选择说话声音更大的人。','接受写得更快的人的答案。','忽略原文，对事实进行投票。']),
 19:('哪条反思提供了学习的证据？',['样本有限，所以我把“所有学生”改成了“被询问的学生”。','我每个方面都很完美。','我比其他人先完成。','我再也不核查资料来源了。']),
 20:('小组只询问在食堂吃饭的学生，应报告什么？',['未包括自带午餐的学生。','全校每名学生都发表了意见。','这些回答代表所有国家。','调查证明所有学生都会剩下食物。']),
 21:('阅读材料对较小的第一份食物说明了什么？',['它是一项拟议试验，尚无试验结果。','它已经解决了所有学校的浪费问题。','它保证每名学生都会同意。','它证明菜单造成了所有浪费。'])}
for number in REUSE:
 item=copy.deepcopy(next(q for q in b.BANK['gp'] if q['code']==f'GP{number:02d}'))
 item['code']=f'E{number:02d}'
 item['stem'].pop('tr');item['choices'].pop('tr')
 item['stem']['zh'],item['choices']['zh']=ZH_REUSE[number]
 BANK['gp8'].append(item)
q('gp8','E26',[
 'Which plan best tests the prediction that smaller first portions reduce waste?','Какой план лучше проверяет прогноз, что меньшие первые порции уменьшают остатки?','哪个方案最适合检验“较小的第一份食物会减少浪费”的预测？'],[
 ['Compare waste before and during a trial with consistent methods, ask pupils and consider other causes.','Assume the prediction is true because it sounds good.','Only ask whether one friend likes the idea.','Change the menu and measuring method, then ignore those changes.'],
 ['Сравнить остатки до и во время испытания одним методом, опросить учеников и учесть другие причины.','Считать прогноз верным, потому что он хорошо звучит.','Только спросить, нравится ли идея одному другу.','Изменить меню и метод, а затем не учитывать эти изменения.'],
 ['用一致方法比较试验前和试验期间的浪费，询问学生并考虑其他原因。','因为预测听起来好，就假设它是真的。','只问一名朋友是否喜欢这个想法。','改变菜单和测量方法，却忽略这些变化。']],
 'A fair before/during comparison, pupil explanations and alternative explanations test the prediction.')
q('gp8','E27',[
 'Which is a POSSIBLE CAUSE of lunch waste suggested in the reading?','Что в тексте предложено как ВОЗМОЖНАЯ ПРИЧИНА остатков обеда?','阅读材料提出了哪个可能的午餐浪费原因？'],[
 ['Portion size.','Money lost because food is wasted.','Wasted ingredients as a result.','The cost of throwing uneaten food away.'],
 ['Размер порций.','Деньги, потерянные из-за выброшенной еды.','Ингредиенты, потраченные впустую в результате.','Расходы на выбрасывание несъеденной еды.'],
 ['份量大小。','因浪费食物而损失的钱。','作为结果被浪费的食材。','处理未吃完食物的费用。']],
 'Portion size is a suggested cause; wasted ingredients and money are possible consequences.')
q('gp8','E28',[
 'Which is a possible CONSEQUENCE of leaving food uneaten?','Что может быть ПОСЛЕДСТВИЕМ оставленной еды?','食物没有吃完，可能带来哪个后果？'],[
 ['Ingredients and money may be wasted.','Pupils may have different food preferences.','The first portion may be too large.','The time allowed for eating may be short.'],
 ['Ингредиенты и деньги могут тратиться впустую.','У учеников могут быть разные вкусы.','Первая порция может быть слишком большой.','Времени на еду может быть мало.'],
 ['食材和钱可能被浪费。','学生可能有不同的食物喜好。','第一份食物可能太多。','用餐时间可能太短。']],
 'Wasted ingredients and money are possible effects, rather than explanations for leaving food.')
q('gp8','E29',[
 'In the imagined national discussion, what does the meals organiser prioritise?','Что ценит организатор питания в вымышленном обсуждении на уровне страны?','在虚构的全国层面讨论中，供餐组织者最重视什么？'],[
 ['Affordable waste records across schools.','Only which pupil speaks loudest.','A ban on comparing school records.','Proof that one pupil speaks for the country.'],
 ['Доступный по стоимости учёт остатков в школах.','Только то, какой ученик говорит громче.','Запрет сравнивать школьные записи.','Доказательство, что один ученик говорит за всю страну.'],
 ['各学校负担得起的浪费记录方法。','只重视哪名学生声音最大。','禁止比较学校记录。','证明一名学生代表全国。']],
 'The organiser values affordable records; this person does not represent the whole country.')
q('gp8','E30',[
 'In the imagined international discussion, what does the parent ask about?','О чём спрашивает родитель в вымышленном международном обсуждении?','在虚构的国际讨论中，家长关心什么？'],[
 ['Whether ideas fit different budgets and routines.','Whether all countries have identical routines.','Whether one school proves a global pattern.','Whether pupils should never give opinions.'],
 ['Подходят ли идеи разным бюджетам и привычному распорядку.','Одинаков ли распорядок во всех странах.','Доказывает ли одна школа мировую закономерность.','Следует ли навсегда запретить мнения учеников.'],
 ['这些想法是否适合不同预算和日常安排。','所有国家的日常安排是否完全一样。','一所学校是否证明了全球规律。','是否应永远禁止学生发表意见。']],
 'The parent prioritises whether an idea suits differing resources and routines.')
q('gp8','E31',[
 'Which statement gives a perspective, rather than only a geographical label?','Что выражает точку зрения, а не только географическую метку?','哪个表述体现了一个视角，而不只是地理范围标签？'],[
 ['A pupil representative values pupils taking part in decisions.','National.','International.','Global.'],
 ['Представитель учеников ценит их участие в решениях.','Национальный.','Международный.','Глобальный.'],
 ['学生代表重视学生参与决策。','全国层面。','国际层面。','全球层面。']],
 'A perspective identifies who is speaking and their priorities, not only scale.')
q('gp8','E32',[
 'For Grade 8\'s ONE-FEATURE summary task, which best summarises the course of action?','Что лучше излагает план действий в задании 8 класса об ОДНОМ аспекте?','在8年级的单项摘要任务中，哪个选项最准确地概括了行动方案？'],[
 ['Propose smaller first portions with more available; compare waste and pupils\' replies during a trial.','List only possible causes without mentioning an action.','Claim smaller portions have already worked everywhere.','Copy every paragraph without selecting one feature.'],
 ['Предложить меньшие первые порции с добавкой; сравнить остатки и ответы во время испытания.','Перечислить только возможные причины без действий.','Утверждать, что меньшие порции уже помогли везде.','Скопировать все абзацы, не выбирая один аспект.'],
 ['提议较小的第一份食物并允许添饭；试行时比较浪费和学生回答。','只列出可能的原因，不提任何行动。','声称小份食物已经在所有地方有效。','抄下全部段落，不选择一个方面。']],
 'The task selects ONE feature and preserves the proposed, untested status of the action.')
q('gp8','E33',[
 'Which baseline day has the greatest recorded waste?','В какой исходный день записано больше всего остатков?','哪一天的基线记录中，浪费最多？'],[
 ['Day {maxday}','Day {otherday1}','Day {otherday2}','All three days are equal.'],['День {maxday}','День {otherday1}','День {otherday2}','Во все три дня поровну.'],['第{maxday}天','第{otherday1}天','第{otherday2}天','三天相同。']],
 'Compare the three baseline amounts; no trial outcome is established.')
q('gp8','E34',[
 'What is the total baseline waste recorded over the three days?','Сколько всего остатков записано за три исходных дня?','三天的基线记录中，总浪费量是多少？'],[
 ['{total} kg','{sumwrong1} kg','{sumwrong2} kg','{sumwrong3} kg'],['{total} кг','{sumwrong1} кг','{sumwrong2} кг','{sumwrong3} кг'],['{total} kg','{sumwrong1} kg','{sumwrong2} kg','{sumwrong3} kg']],
 'Add the three baseline weights. A total does not establish a cause or trial result.')

LANG='en'
def font(bold=False):return ('ChineseBold' if bold else 'Chinese') if LANG=='zh' else ('ArialBold' if bold else 'Arial')
def para(text,width=CW,size=10.5,bold=False):
 return Paragraph(escape(str(text)),ParagraphStyle('p',fontName=font(bold),fontSize=size,leading=size*1.23,wordWrap='CJK' if LANG=='zh' else None))
def p(c,text,x,top,width=CW,size=10.5,bold=False):
 a=para(text,width,size,bold);_,h=a.wrap(width,1000);a.drawOn(c,x,top-h);return top-h
def tab(c,rows,x,top,widths,size=10,heights=None):
 rows=[[para(value,widths[i]-12,size) for i,value in enumerate(row)] for row in rows]
 t=Table(rows,colWidths=widths,rowHeights=heights)
 t.setStyle(TableStyle([('GRID',(0,0),(-1,-1),.5,colors.black),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
 _,h=t.wrap(1000,1000);t.drawOn(c,x,top-h);return top-h
def label(subject,lang='en'):return UI[lang]['geo' if subject=='geo7b' else 'gp']
def vals(subject,n):
 rng=random.Random(30421+n*41);v={}
 if subject=='gp7b':
  quiet=[5+n,7+n,6+n];active=[quiet[0]+3,quiet[1]+7,quiet[2]+5]
  pairs=list(zip(quiet,active));rng.shuffle(pairs);quiet,active=map(list,zip(*pairs))
  v.update(quiet1=quiet[0],quiet2=quiet[1],quiet3=quiet[2],quiettotal=sum(quiet),active1=active[0],active2=active[1],active3=active[2],gap=active[1]-quiet[1])
  v['maxbreak']=active.index(max(active))+1
  other=[k for k in [1,2,3] if k!=v['maxbreak']];v.update(otherbreak1=other[0],otherbreak2=other[1])
  for j in range(1,4):v['quietwrong'+str(j)]=v['quiettotal']+j*3;v['gapwrong'+str(j)]=v['gap']+j*2
 elif subject=='geo7b':
  t=[8+n,11+n+n%4,9+n];rain=[1+n%5,4+n,2+n%3];wind=[10+n,18+n,13+n]
  rng.shuffle(t);rng.shuffle(rain);rng.shuffle(wind)
  for i in range(3):v['t'+str(i+1)]=t[i];v['r'+str(i+1)]=rain[i];v['w'+str(i+1)]=wind[i]
  v.update(raintotal=sum(rain),temprange=max(t)-min(t),warmday=t.index(max(t))+1,windday=wind.index(max(wind))+1)
  for stem in ['warm','wind']:
   other=[k for k in [1,2,3] if k!=v[stem+'day']]
   for j,k in enumerate(other,1):v[stem+'other'+str(j)]=k
  for j in range(1,4):v['rainwrong'+str(j)]=v['raintotal']+j*2;v['tempwrong'+str(j)]=v['temprange']+j*2
 else:
  a=8+n;daily=[a,a+4+n%3,a-2-n%2];rng.shuffle(daily)
  v.update(d1=daily[0],d2=daily[1],d3=daily[2],total=sum(daily),maxday=daily.index(max(daily))+1)
  other=[k for k in [1,2,3] if k!=v['maxday']];v.update(otherday1=other[0],otherday2=other[1])
  for j in range(1,4):v['sumwrong'+str(j)]=v['total']+j*3
 return v
def versions(group,subject,used,offset):
 result=[]
 for i,lang in enumerate(group['langs']):
  rng=random.Random(89010+offset*1257+i*139+['gp7b','geo7b','gp8'].index(subject)*789)
  for _ in range(100000):
   seq=list(range(4))*6+[i%4];rng.shuffle(seq)
   if any(len(list(g))>3 for _,g in itertools.groupby(seq)):continue
   if all(sum(a!=b for a,b in zip(seq,prev))>=14 for prev in used):break
  else:raise AssertionError('Answer-sequence separation failed')
  used.append(seq[:]);order=list(range(25));rng.shuffle(order);v=vals(subject,offset+i);questions=[]
  for number,(bankidx,position) in enumerate(zip(order,seq),1):
   item=BANK[subject][bankidx];option_order=[1,2,3];rng.shuffle(option_order);option_order.insert(position,0)
   choices=[item['choices'][lang][n].format(**v) for n in option_order]
   assert len(set(choices))==4,(subject,i,item['code'],choices)
   questions.append(dict(number=number,code=item['code'],stem=item['stem'][lang].format(**v),choices=choices,answer='ABCD'[position],correct_en=item['choices']['en'][0].format(**v)))
  result.append(dict(id=f"{group['prefix']}-{'GE' if subject=='geo7b' else 'GP'}-{i+1:02d}",group=group['key'],grade=group['grade'],index=i+1,lang=lang,subject=subject,values=v,questions=questions,sequence=''.join('ABCD'[n] for n in seq)))
 return result
def foot(c,v,page):
 u=UI[v['lang']];c.setStrokeColor(colors.HexColor('#aaaaaa'));c.line(M,32,W-M,32);c.setFillColor(colors.black);c.setFont('Arial',8);c.drawString(M,20,v['id']);c.setFont(font(),8);c.drawRightString(W-M,20,f"{u['page']} {page} {u['of']} 4")
def cover(c,v):
 u=UI[v['lang']];c.setFillColor(colors.black);c.setFont('ArialBold',17);c.drawCentredString(W/2,H-43,'OXFORD INTERNATIONAL SCHOOL');c.setFont(font(True),12);c.drawCentredString(W/2,H-66,u['exam']);y=H-86
 y=p(c,f"{u['term']}  |  {u['version']}: {v['id']}  |  {u['duration']}: {u['minutes']}",M,y,size=9.3)
 y=p(c,u['name']+': '+'_'*62,M,y-15,size=10.5)
 y=p(c,f"{u['grade']}: {v['grade']}   {u['subject']}: {label(v['subject'],v['lang'])}   {u['date']}: __________",M,y-10,size=10)
 y=tab(c,[[u['score']+': ____ / 100',u['signature']+': __________________']],M,y-12,[200,CW-200],10)
 y=p(c,u['instructions'],M,y-15,bold=True)
 for i,rule in enumerate(u['rules'],1):y=p(c,str(i)+'. '+rule,M,y-3,size=9.8)
 y=p(c,u['marks'],M,y-12,bold=True,size=10)-18
 data=v['values'];lang=v['lang'];subject=v['subject']
 if subject in ['gp7b','gp8']:
  y=p(c,u['reading'],M,y,bold=True,size=11)
  case=READINGS[lang]['7b' if subject=='gp7b' else '8']
  for i,text in enumerate(case['passages'],1):y=p(c,str(i)+'. '+text,M,y-9,size=10.5)
  if subject=='gp7b':
   title={'en':'Separate made-up practice observations for this exam','ru':'Отдельные вымышленные наблюдения для этого экзамена','zh':'本试卷另外提供的虚构观察记录'}[lang]
   note={'en':'Counts are for each break; the same pupil may appear at more than one break.','ru':'Числа относятся к каждой перемене; один ученик мог быть посчитан несколько раз.','zh':'人数按每次课间记录；同一名学生可能在多次课间被记录。'}[lang]
   headers={'en':['Break','Quiet reading','Active games'],'ru':['Перемена','Тихое чтение','Активные игры'],'zh':['课间次数','安静阅读人数','活动游戏人数']}[lang]
   rows=[headers]+[[i,data['quiet'+str(i)],data['active'+str(i)]] for i in range(1,4)]
   y=p(c,title,M,y-14,size=10,bold=True);y=tab(c,rows,M,y-7,[100,155,155],10)
   y=p(c,note,M,y-8,size=9)
  else:
   title={'en':'Separate made-up baseline data before any trial','ru':'Отдельные вымышленные исходные данные до испытания','zh':'任何试验开始前，另外提供的虚构基线数据'}[lang]
   headers={'en':['Day','Uneaten food (kg)'],'ru':['День','Остатки еды (кг)'],'zh':['天数','未吃完食物（kg）']}[lang]
   y=p(c,title,M,y-14,size=10,bold=True);y=tab(c,[headers]+[[i,data['d'+str(i)]] for i in range(1,4)],M,y-7,[100,200],10)
 else:
  intro={'en':'This paper tests UK countries and capitals, Great Britain, and basic weather. Use your knowledge for the UK questions. Use the table below for the weather-data questions.','ru':'Работа проверяет части Соединённого Королевства и их столицы, остров Великобритания и основы погоды. В вопросах о странах используйте свои знания. Для вопросов о погодных данных используйте таблицу.','zh':'本试卷考查联合王国的构成国及其首府、大不列颠岛，以及天气基础知识。有关联合王国的问题请运用所学知识；有关天气数据的问题请使用下表。'}[lang]
  y=p(c,intro,M,y,size=10.5)
  title={'en':'Made-up weather observations for this paper','ru':'Вымышленные погодные наблюдения для этого варианта','zh':'本试卷的虚构天气观察记录'}[lang]
  headers={'en':['Day','Temperature (°C)','Rainfall (mm)','Wind speed (km/h)'],'ru':['День','Температура (°C)','Осадки (мм)','Скорость ветра (км/ч)'],'zh':['天数','气温（°C）','降雨量（mm）','风速（km/h）']}[lang]
  y=p(c,title,M,y-20,bold=True,size=11)
  y=tab(c,[headers]+[[i,data['t'+str(i)],data['r'+str(i)],data['w'+str(i)]] for i in range(1,4)],M,y-10,[55,145,130,CW-330],10)
  note={'en':'The records describe three days at one made-up location. They do not establish a long-term climate pattern. Each measurement was recorded once per day.','ru':'Это записи за три дня в одном вымышленном месте. Они не устанавливают многолетние закономерности климата. Каждое измерение записано один раз в день.','zh':'这些记录描述一个虚构地点三天的天气，不能确定长期气候规律。各项测量每天记录一次。'}[lang]
  y=p(c,note,M,y-14,size=10)
 assert y>48,(v['id'],'cover overflow',y)
 foot(c,v,1);return y
def qheight(qn):
 h=para(str(qn['number'])+'. '+qn['stem'],size=10.5,bold=True).wrap(CW,1000)[1]+3
 return h+sum(para(letter+') '+choice,CW-15,10.2).wrap(CW-15,1000)[1] for letter,choice in zip('ABCD',qn['choices']))+9
def partitions(qs):
 choices=[]
 for a in range(7,11):
  for d in range(a+7,min(a+11,25)):
   groups=[qs[:a],qs[a:d],qs[d:]]
   if not all(6<=len(g)<=10 for g in groups):continue
   heights=[sum(qheight(qn) for qn in g) for g in groups]
   if max(heights)<=H-155:choices.append((max(heights)-min(heights),groups))
 assert choices,'Questions do not fit three pages at the chosen readable font size'
 return min(choices,key=lambda p:p[0])[1]
def questions(c,v,qs,page):
 u=UI[v['lang']];c.setFillColor(colors.black);c.setFont(font(True),11);c.drawString(M,H-36,v['grade']+'  '+label(v['subject'],v['lang']));c.setFont('Arial',9);c.drawRightString(W-M,H-36,v['id']);c.line(M,H-45,W-M,H-45)
 y=p(c,u['questions'],M,H-61,bold=True,size=12)-15
 for qn in qs:
  y=p(c,str(qn['number'])+'. '+qn['stem'],M,y,bold=True,size=10.5)-3
  for letter,choice in zip('ABCD',qn['choices']):y=p(c,letter+') '+choice,M+15,y,width=CW-15,size=10.2)
  y-=9
 assert y>65,(v['id'],'questions overflow',y)
 if page==4:p(c,u['end'],M,57,size=8.5)
 foot(c,v,page);return y
def write_pack(group,subject,vs):
 global LANG
 filename=group['key']+'_'+('Geography' if subject=='geo7b' else 'Global_Perspectives')+'_Student_Exams.pdf'
 path=OUT/filename;c=canvas.Canvas(str(path),pagesize=(W,H));c.setTitle(group['label']+' '+label(subject)+' student exams');c.setAuthor('Oxford International School');bottoms=[]
 for v in vs:
  LANG=v['lang'];c.bookmarkPage(v['id']);c.addOutlineEntry(v['id']+' '+v['lang'].upper(),v['id'],level=0)
  bottoms.append(cover(c,v));c.showPage()
  for page,qs in enumerate(partitions(v['questions']),2):bottoms.append(questions(c,v,qs,page));c.showPage()
 c.save();assert len(PdfReader(path).pages)==4*len(vs)
 return path,min(bottoms)
def teacher(c,title,page):
 c.setFillColor(colors.black);c.setFont('ArialBold',14);c.drawString(M,H-40,title);c.setFont('Arial',8);c.drawRightString(W-M,20,f'TEACHER ONLY  |  {page}');return H-64
def teacher_keys(allv):
 global LANG
 LANG='en';path=OUT/'7B_and_Grade8_Teacher_Answer_Keys.pdf';c=canvas.Canvas(str(path),pagesize=(W,H));c.setTitle('7B and Grade 8 private teacher answer keys');c.setAuthor('Oxford International School');page=1;y=teacher(c,'7B and Grade 8 marking and distribution',page)
 for text in [
  'Each pupil receives a unique four-page exam. Each paper has 25 multiple-choice questions, 4 marks per correct answer, 100 marks total and a 60-minute duration. Wrong or unanswered questions earn zero. If multiple choices remain circled, award zero for that question.',
  'The six student packs contain 56 papers in total. 7B Group 1: 11 papers per subject (10 English, 1 Russian). 7B Group 2: 4 Chinese papers per subject. Grade 8 Class 1: 14 Global Perspectives papers (9 English, 5 Russian). Grade 8 Class 2: 12 Global Perspectives papers (9 English, 2 Russian, 1 Chinese).',
  'Print each student pack on A4 at actual size, double-sided with long-edge binding. Every student starts on a fresh sheet. Bookmarks lead to individual paper codes. Registers on the next pages show the exact page range and language for every pupil.',
  'Assign the same pupil number in both 7B subjects. Codes distinguish 7B1, 7B2, 8C1 and 8C2. Match the entire paper code to its key before marking. Student files contain no answer keys.',
  'Across both groups of each subject, every answer sequence is unique and differs from every other sequence in at least 14 of 25 positions. Correct letters are balanced (6 or 7 of each), with no run longer than three. Question order, option order and practice data vary. No new sunflower or all-C papers are included; those were requested for 7A.',
  '7B Global Perspectives uses Book 7 break spaces, research methods, main ideas, notes, whole-text summaries, feedback and reflection. Grade 8 uses Book 9 predictions, evidence, causes and consequences, national/global perspectives, proposed action and a one-feature summary. Separate numerical tables are clearly labelled as made-up practice data; they do not invent completed results for the class reading.',
  '7B Geography covers the four UK countries and capitals, the distinction between the UK and Great Britain, Ireland, and basic weather measurements. Translated papers assess the same concepts. These are teacher-created classroom papers, not official Cambridge exams.'
 ]:y=p(c,text,M,y-10,size=10)
 assert y>45;c.showPage();page+=1
 for group in GROUPS:
  y=teacher(c,group['label']+' distribution register',page)
  y=p(c,'Same page ranges apply to both subjects where this group has Geography and Global Perspectives.',M,y,size=10)-20
  rows=[['Pupil','Language','Student pack pages','Assigned name']]
  for i,lang in enumerate(group['langs']):rows.append([str(i+1).zfill(2),{'en':'English','ru':'Russian','zh':'Chinese'}[lang],f'{4*i+1}-{4*i+4}',''])
  tab(c,rows,M,y,[60,90,120,CW-270],10,[24]+[24]*len(group['langs']))
  c.showPage();page+=1
 keypairs=[]
 for group in GROUPS:
  if group['grade']=='7B':
   keypairs.extend(zip(allv[group['key']]['gp7b'],allv[group['key']]['geo7b']))
  else:
   vs=allv[group['key']]['gp8'];keypairs.extend([vs[i:i+2] for i in range(0,len(vs),2)])
 for pair in keypairs:
  y=teacher(c,'Answer keys',page)
  for v,x in zip(pair,[M,M+CW/2+8]):
   width=CW/2-8;yt=p(c,v['id']+'  '+v['lang'].upper(),x,y,width,bold=True,size=11)-7;yt=p(c,label(v['subject']),x,yt,width,size=10)-10
   rows=[['Q','Answer','Reference']]+[[q['number'],q['answer'],q['code']] for q in v['questions']]
   bot=tab(c,rows,x,yt,[35,55,width-90],10,[23]+[18]*25)
   data=v['values']
   if v['subject']=='gp7b':notes=f"Quiet counts: {data['quiet1']}, {data['quiet2']}, {data['quiet3']}. Quiet-count sum: {data['quiettotal']}. Greatest active count: Break {data['maxbreak']}. Break 2 difference: {data['gap']}."
   elif v['subject']=='geo7b':notes=f"Warmest: Day {data['warmday']}. Rainfall sum: {data['raintotal']} mm. Temperature difference: {data['temprange']} °C. Fastest wind: Day {data['windday']}."
   else:notes=f"Baseline kg: {data['d1']}, {data['d2']}, {data['d3']}. Total: {data['total']} kg. Greatest waste: Day {data['maxday']}."
   p(c,notes,x,bot-15,width,size=9.3)
  c.showPage();page+=1
 for subject in BANK:
  for start in [0,13]:
   y=teacher(c,{'gp7b':'7B Global Perspectives','geo7b':'7B Geography','gp8':'Grade 8 Global Perspectives'}[subject]+' explanations',page)
   for item in BANK[subject][start:start+13]:y=p(c,item['code']+'  '+item['reason'],M,y-12,size=10)
   assert y>45;c.showPage();page+=1
 c.save();return path
def main():
 assert all(len(v)==25 for v in BANK.values())
 allv={};used={s:[] for s in BANK};offset={s:0 for s in BANK};files=[];report={}
 for group in GROUPS:
  allv[group['key']]={}
  for subject in group['subjects']:
   vs=versions(group,subject,used[subject],offset[subject]);offset[subject]+=len(vs);allv[group['key']][subject]=vs
   path,bottom=write_pack(group,subject,vs);files.append(path)
   report[path.name]=dict(papers=len(vs),pages=4*len(vs),languages={lang:group['langs'].count(lang) for lang in set(group['langs'])},lowest_content_y=round(bottom,2))
 teacherfile=teacher_keys(allv);files.append(teacherfile)
 for subject,seqs in used.items():
  assert len({tuple(s) for s in seqs})==len(seqs)
  dist=min(sum(a!=b for a,b in zip(x,y)) for x,y in itertools.combinations(seqs,2))
  assert dist>=14;report[subject+'_minimum_answer_distance']=dist
 for group in GROUPS:
  for subject in group['subjects']:
   vs=allv[group['key']][subject]
   assert [v['lang'] for v in vs]==group['langs']
   for v in vs:
    for qn in v['questions']:
     item=next(item for item in BANK[subject] if item['code']==qn['code'])
     correct=item['choices'][v['lang']][0].format(**v['values'])
     assert qn['choices']['ABCD'.index(qn['answer'])]==correct
     assert not any('{' in t or '}' in t for t in [qn['stem'],*qn['choices']])
 for f in files:
  pdf=PdfReader(f)
  for page in pdf.pages:
   assert abs(float(page.mediabox.width)-W)<1 and abs(float(page.mediabox.height)-H)<1
   assert page.extract_text().strip()
 report['teacher_pages']=len(PdfReader(teacherfile).pages)
 (WORK/'versions.json').write_text(json.dumps(allv,ensure_ascii=False,indent=2),encoding='utf-8')
 (WORK/'validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
 print(json.dumps({'files':[str(f) for f in files],'validation':report},indent=2))
if __name__=='__main__':main()
