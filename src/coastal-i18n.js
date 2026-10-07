let language='en';
const dictionary=new Map(),foldedDictionary=new Map();
export function registerTranslations(en,ru,ky){dictionary.set(en,[ru,ky]);foldedDictionary.set(en.toLowerCase(),[ru,ky]);}
export function setLanguage(value){language=['en','ru','ky'].includes(value)?value:'en';}
export const currentLanguage=()=>language;
const entries=`
United Kingdom|Великобритания|Улуу Британия
Kyrgyzstan|Кыргызстан|Кыргызстан
Choose your journey|Выберите путешествие|Саякатыңызды тандаңыз
Choose your world|Выберите мир|Дүйнөнү тандаңыз
Language|Язык|Тил
Difficulty|Сложность|Кыйынчылык
Start journey|Начать путешествие|Саякатты баштоо
Coming soon|Скоро|Жакында
Normal|Обычный|Кадимки
Hard|Сложный|Кыйын
Normal mode|Обычный режим|Кадимки режим
Hard mode|Сложный режим|Кыйын режим
Normal: build and learn at your own pace.|Обычный: стройте и изучайте в своём темпе.|Кадимки: өз ыргагыңызда куруп, үйрөнүңүз.
Hard: geography events disrupt your network.|Сложный: географические события влияют на сеть.|Кыйын: географиялык окуялар тармагыңызга таасир этет.
Travel journal|Дневник путешествий|Саякат күндөлүгү
FIELD NOTES|ПОЛЕВЫЕ ЗАМЕТКИ|САЯКАТ ЖАЗУУЛАРЫ
Delivery progress|Доставленные пассажиры|Жеткирилген жүргүнчүлөр
Manage routes|Управление маршрутами|Каттамдарды башкаруу
Map key|Условные обозначения|Картанын белгилери
Run cards|Карты забега|Оюндун карталары
Your run cards|Ваши карты|Сиздин карталарыңыз
Help|Помощь|Жардам
Network tools|Инструменты сети|Тармактын куралдары
Stations flowing|Станции работают|Бекеттер иштеп жатат
Network review|Обзор сети|Тармакты кароо
Route performance|Работа маршрута|Каттамдын иштеши
Passenger journeys|Пути пассажиров|Жүргүнчүлөрдүн сапарлары
Passenger journey|Путь пассажира|Жүргүнчүнүн сапары
Line planner|Планировщик линий|Каттамды пландоо
Plan a line|Спланировать линию|Каттамды пландоо
Vehicle upgrades|Улучшения транспорта|Унааны жакшыртуу
Fleet upgrades|Улучшения парка|Унаалар паркын жакшыртуу
Terminal upgrades|Улучшения станции|Бекетти жакшыртуу
Card modifiers|Модификаторы карт|Карталардын таасири
Current fleet|Текущий парк|Учурдагы унаалар
Installed|Установлено|Орнотулган
Current terminal|Текущая станция|Учурдагы бекет
Terminal fully upgraded|Станция полностью улучшена|Бекет толук жакшыртылды
Build a route from here|Создать маршрут отсюда|Бул жерден каттам түзүү
Create route from here|Создать маршрут отсюда|Бул жерден каттам түзүү
Play|Играть|Ойноо
Pause|Пауза|Токтотуу
Undo|Отменить|Артка кайтаруу
Reset|Начать заново|Кайра баштоо
Remove routes|Удалить участки|Каттамдарды өчүрүү
Fullscreen|Полный экран|Толук экран
Exit fullscreen|Выйти из полного экрана|Толук экрандан чыгуу
Tutorial|Обучение|Үйрөтүү
Retry round|Повторить раунд|Айлампаны кайталоо
Choose round cards|Выбрать карты раунда|Айлампанын карталарын тандоо
Choose a benefit|Выберите преимущество|Артыкчылыкты тандаңыз
Choose a challenge|Выберите испытание|Кыйынчылыкты тандаңыз
Continue|Продолжить|Улантуу
Return to map|Вернуться к карте|Картага кайтуу
Close|Закрыть|Жабуу
Open|Открыть|Ачуу
Learn more|Узнать больше|Көбүрөөк билүү
Read on Wikipedia|Читать в Википедии|Википедиядан окуу
Explore|Исследовать|Изилдөө
Discover|Откройте|Таанышыңыз
Capital|Столица|Борбор
Regional centre|Областной центр|Облустун борбору
Regional atlas|Атлас регионов|Аймактар атласы
Country atlas|Атлас стран|Өлкөлөр атласы
countries and capitals|страны и столицы|өлкөлөр жана борборлор
countries|страны|өлкөлөр
regions|регионы|аймактар
unlocked|открыто|ачылды
flag|флаг|туу
Waterways|Реки и озёра|Дарыялар жана көлдөр
Landmarks|Достопримечательности|Көрүнүктүү жерлер
Natural landmark|Природная достопримечательность|Табигый көрүнүктүү жер
Human-made landmark|Созданная человеком достопримечательность|Адам жасаган көрүнүктүү жер
Landmark notebook|Дневник достопримечательностей|Көрүнүктүү жерлердин күндөлүгү
Atlas|Атлас|Атлас
Geography question|Вопрос по географии|Географиялык суроо
Geography bonus|Бонус по географии|Географиялык бонус
GEOGRAPHY BONUS|БОНУС ПО ГЕОГРАФИИ|ГЕОГРАФИЯЛЫК БОНУС
GEOGRAPHY MISSIONS|ГЕОГРАФИЧЕСКИЕ ЗАДАНИЯ|ГЕОГРАФИЯЛЫК ТАПШЫРМАЛАР
Discovery collection|Коллекция открытий|Ачылыштар жыйнагы
Save / resume|Сохранить / продолжить|Сактоо / улантуу
Save and resume|Сохранение и продолжение|Сактоо жана улантуу
Empty slot|Пустая ячейка|Бош орун
Practice|Практика|Машыгуу
Year 8|8 класс|8-класс
All countries|Все страны|Бардык өлкөлөр
All regions|Все регионы|Бардык аймактар
Route pressure|Нагрузка маршрутов|Каттамдардын жүгү
Enable automatic spacing|Включить интервалы|Аралыкты жөнгө салуу
Automatic spacing on|Интервалы включены|Аралыкты жөнгө салуу күйгүзүлдү
Cancel reverse request|Отменить разворот|Бурулууну жокко чыгаруу
Reverse at next stop|Развернуть на следующей остановке|Кийинки бекетте артка буруу
Show journey on map|Показать путь на карте|Сапарды картада көрсөтүү
Clear journey highlight|Убрать выделение пути|Сапардын белгиленишин алып салуу
Round review|Обзор раунда|Айлампанын жыйынтыгы
Review this round|Обзор этого раунда|Бул айлампаны кароо
EXPEDITION PASSPORT|ПАСПОРТ ЭКСПЕДИЦИИ|ЭКСПЕДИЦИЯНЫН ПАСПОРТУ
PLACES · PEOPLE · TRANSPORT|МЕСТА · ЛЮДИ · ТРАНСПОРТ|ЖЕРЛЕР · АДАМДАР · УНААЛАР
GEOGRAPHY DISCOVERY|ГЕОГРАФИЧЕСКОЕ ОТКРЫТИЕ|ГЕОГРАФИЯЛЫК АЧЫЛЫШ
LEARNING SPOTLIGHT|ГЕОГРАФИЧЕСКИЙ ФАКТ|ГЕОГРАФИЯЛЫК МААЛЫМАТ
YOUR ROUND STATISTICS|СТАТИСТИКА РАУНДА|АЙЛАМПАНЫН СТАТИСТИКАСЫ
YOUR ROUTE THIS ROUND|ВАШ МАРШРУТ В ЭТОМ РАУНДЕ|БУЛ АЙЛАМПАДАГЫ КАТТАМЫҢЫЗ
NETWORK TIP|СОВЕТ ПО СЕТИ|ТАРМАК БОЮНЧА КЕҢЕШ
UNLOCKED IN YOUR PASSPORT|ОТКРЫТО В ПАСПОРТЕ|ПАСПОРТУҢУЗДА АЧЫЛДЫ
GEOGRAPHY TAKES YOU FURTHER|ГЕОГРАФИЯ РАСШИРЯЕТ ГОРИЗОНТЫ|ГЕОГРАФИЯ ДҮЙНӨНҮ ТААНЫТАТ
EXPLORE · LEARN · CONNECT|ИССЛЕДУЙ · УЧИСЬ · СОЕДИНЯЙ|ИЗИЛДЕ · ҮЙРӨН · БАЙЛАНЫШТЫР
Round|Раунд|Айлампа
Level|Уровень|Деңгээл
seat|место|орун
seats|места|орун
speed|скорость|ылдамдык
waiting|ожидают|күтүүдө
onboard|на борту|унаада
outbound|туда|алдыга
inbound|обратно|артка
Delivered this round|Доставлено за раунд|Айлампада жеткирилди
Fare 💷 earned|Доход 💷|Түшкөн киреше 💷
Boardings|Посадки|Отургузуу
Travelling|В пути|Жолдо
Boarding / unloading|Посадка / высадка|Отургузуу / түшүрүү
passengers delivered|пассажиров доставлено|жүргүнчү жеткирилди
longest wait|максимальное ожидание|эң узак күтүү
busiest city|самая загруженная остановка|эң жүктөлгөн бекет
Peak queue|Максимальная очередь|Эң чоң кезек
Best line|Лучшая линия|Мыкты каттам
Correct|Верно|Туура
The answer is|Правильный ответ|Туура жооп
Not enough 💷.|Недостаточно 💷.|💷 жетишсиз.
Not enough|Недостаточно|Жетишсиз
Need|Нужно|Керек
Requires level|Нужен уровень|Керектүү деңгээл
Upgrade to level|Улучшить до уровня|Жакшыртуу деңгээли
Upgrade terminal|Улучшить станцию|Бекетти жакшыртуу
Buy|Купить|Сатып алуу
Build|Построить|Куруу
Remove|Удалить|Өчүрүү
Inspect|Осмотреть|Карап чыгуу
Extend line|Продлить линию|Каттамды узартуу
per section|за участок|ар бир бөлүк үчүн
Loop service|Кольцевой маршрут|Айланма каттам
Line service|Линейный маршрут|Түз каттам
stops|остановки|бекеттер
vehicle|транспорт|унаа
vehicles|транспорт|унаалар
queue spaces|мест в очереди|кезектеги орун
seconds of patience|секунд терпения|күтүү секунддары
per passenger|на пассажира|ар бир жүргүнчүгө
to board or unload|на посадку или высадку|отургузуу же түшүрүү үчүн
benefit|преимущество|артыкчылык
challenge|испытание|кыйынчылык
BENEFIT|ПРЕИМУЩЕСТВО|АРТЫКЧЫЛЫК
CHALLENGE|ИСПЫТАНИЕ|КЫЙЫНЧЫЛЫК
Benefits|Преимущества|Артыкчылыктар
Challenges|Испытания|Кыйынчылыктар
Your advantages for this run|Ваши преимущества в этом забеге|Бул оюндагы артыкчылыктарыңыз
Plan your network around these challenges|Учитывайте испытания при планировании сети|Тармакты пландоодо бул кыйынчылыктарды эске алыңыз
Bus|Автобус|Автобус
Train|Поезд|Поезд
Boat|Паром|Кеме
Flight|Самолёт|Учак
High-speed train|Скоростной поезд|Ылдам поезд
Tunnel train|Тоннельный поезд|Тоннель поезди
Marshrutka|Маршрутка|Маршрутка
Northern train|Северный поезд|Түндүк поезди
Mountain 4×4|Горный внедорожник|Тоолук 4×4 унаа
Domestic plane|Внутренний самолёт|Ички каттам учагы
Tunnel shuttle|Тоннельный шаттл|Тоннель каттамы
Express coach|Экспресс-автобус|Экспресс-автобус
Airport|Аэропорт|Аэропорт
Build airport|Построить аэропорт|Аэропорт куруу
Airport built|Аэропорт построен|Аэропорт курулду
Harbour|Гавань|Порт
Build harbour|Построить гавань|Порт куруу
Harbour built|Гавань построена|Порт курулду
Airports unlock in round|Аэропорты открываются в раунде|Аэропорт ачылган айлампа
Harbours unlock in round|Гавани открываются в раунде|Порт ачылган айлампа
Shape filter|Фильтр фигур|Фигура чыпкасы
All shapes|Все фигуры|Бардык фигуралар
Circle|Круг|Тегерек
Square|Квадрат|Чарчы
Triangle|Треугольник|Үч бурчтук
Diamond|Ромб|Ромб
Pentagon|Пятиугольник|Беш бурчтук
Hexagon|Шестиугольник|Алты бурчтук
Star|Звезда|Жылдыз
Cross|Крест|Крест
circle|круг|тегерек
square|квадрат|чарчы
triangle|треугольник|үч бурчтук
diamond|ромб|ромб
pentagon|пятиугольник|беш бурчтук
hexagon|шестиугольник|алты бурчтук
star|звезда|жылдыз
cross|крест|крест
NEW STOP|НОВАЯ ОСТАНОВКА|ЖАҢЫ БЕКЕТ
NEW PASSENGER|НОВЫЙ ПАССАЖИР|ЖАҢЫ ЖҮРГҮНЧҮ
BOARDING|ПОСАДКА|ОТУРГУЗУУ
ON BOARD|НА БОРТУ|УНААДА
TRANSFER|ПЕРЕСАДКА|КОТОРУЛУУ
Network stopped|Сеть остановлена|Тармак токтоду
CLEAR QUEUE|РАЗГРУЗИТЕ ОЧЕРЕДЬ|КЕЗЕКТИ АЗАЙТЫҢЫЗ
TO CLEAR|ДЛЯ РАЗГРУЗКИ|КЕЗЕКТИ АЗАЙТУУГА
River|Река|Дарыя
Mountains|Горы|Тоолор
Sea coast|Морское побережье|Деңиз жээги
Coral reefs|Коралловые рифы|Коралл рифтери
Which landscape shapes transport in Kyrgyzstan?|Какой ландшафт влияет на транспорт Кыргызстана?|Кыргызстандын унаа жолдоруна кайсы рельеф таасир этет?
Bishkek is the capital of Kyrgyzstan.|Бишкек — столица Кыргызстана.|Бишкек — Кыргызстандын борбору.
Kyrgyzstan is a landlocked country in Central Asia.|Кыргызстан — страна Центральной Азии без выхода к морю.|Кыргызстан — Борбордук Азиядагы деңизге чыгууга мүмкүнчүлүгү жок өлкө.
England|Англия|Англия
Wales|Уэльс|Уэльс
Scotland|Шотландия|Шотландия
Northern Ireland|Северная Ирландия|Түндүк Ирландия
Republic of Ireland|Республика Ирландия|Ирландия Республикасы
France|Франция|Франция
Belgium|Бельгия|Бельгия
Netherlands|Нидерланды|Нидерланддар
Germany|Германия|Германия
London|Лондон|Лондон
Oxford|Оксфорд|Оксфорд
Bristol|Бристоль|Бристоль
Cardiff|Кардифф|Кардифф
Edinburgh|Эдинбург|Эдинбург
Belfast|Белфаст|Белфаст
Dublin|Дублин|Дублин
Paris|Париж|Париж
Brussels|Брюссель|Брюссель
Amsterdam|Амстердам|Амстердам
Berlin|Берлин|Берлин
Irish Sea|Ирландское море|Ирланд деңизи
English Channel|Ла-Манш|Ла-Манш
North Sea|Северное море|Түндүк деңизи
River Thames|Река Темза|Темза дарыясы
Issyk-Kul|Иссык-Куль|Ысык-Көл
Song-Kol|Сон-Куль|Соң-Көл
Chuy River|Река Чу|Чүй дарыясы
Naryn River|Река Нарын|Нарын дарыясы
Talas River|Река Талас|Талас дарыясы
Ak-Buura River|Река Ак-Буура|Ак-Буура дарыясы
Too-Ashuu|Тоо-Ашуу|Төө-Ашуу
Dolon|Долон|Долон
Ala-Bel|Ала-Бель|Ала-Бел
Taldyk|Талдык|Талдык
Mountain pass|Горный перевал|Тоо ашуусу
Mountain challenge|Горное испытание|Тоолук кыйынчылык
Reopen mountain route|Открыть горный маршрут|Тоо каттамын ачуу
Mountain 4×4 paused|Внедорожники остановлены|4×4 унаалар токтоду
New geography stamps|Новые географические отметки|Жаңы географиялык белгилер
Geography detective|Знаток географии|География билерманы
Across the border|Через границу|Чек арадан өтүү
Across the Irish Sea|Через Ирландское море|Ирланд деңизинен өтүү
Under the English Channel|Под Ла-Маншем|Ла-Манштын алдынан өтүү
Passport|Паспорт|Паспорт
Collected|Получено|Алынды
landmark stamps|отметки достопримечательностей|көрүнүктүү жерлердин белгилери
earned|заработано|табылды
Save to|Сохранить в|Сактоо
Resume|Продолжить|Улантуу
Autosave active|Автосохранение включено|Автоматтык сактоо күйгүзүлдү
Saved to|Сохранено в|Сакталды
Autosaved to|Автосохранено в|Автоматтык сакталды
Resumed|Продолжено|Улантылды
Welcome to|Добро пожаловать в|Кош келиңиз
Deliver passengers to|Доставьте пассажиров в|Жүргүнчүлөрдү жеткириңиз
Answer a geography coin or round-review question correctly.|Ответьте правильно на вопрос монеты или обзора раунда.|Монетанын же айлампанын суроосуна туура жооп бериңиз.
Complete three journeys between English cities.|Завершите три поездки между английскими городами.|Англиянын шаарларынын ортосунда үч сапар жасаңыз.
Deliver a passenger whose journey began in another country.|Доставьте пассажира из другой страны.|Башка өлкөдөн келген жүргүнчүнү жеткириңиз.
No connected journey yet. Build a route to a matching destination symbol.|Путь ещё не создан. Соедините с остановкой нужной формы.|Сапар али түзүлө элек. Керектүү фигурадагы бекетке каттам түзүңүз.
The round timer ran out.|Время раунда истекло.|Айлампанын убактысы бүттү.
Choose Retry round to try a new plan.|Нажмите «Повторить раунд», чтобы попробовать новый план.|Жаңы план үчүн «Айлампаны кайталоо» баскычын басыңыз.
Both modes include geography quizzes, expanding maps and round cards.|В обоих режимах есть вопросы по географии, расширение карты и карты раундов.|Эки режимде тең географиялык суроолор, кеңейген карта жана айлампа карталары бар.
Each upgrade adds space, patience and faster handling.|Улучшения добавляют места, терпение и ускоряют посадку.|Жакшыртуулар орунду, күтүү убактысын жана отургузуу ылдамдыгын көбөйтөт.
Choose a vehicle first.|Сначала выберите транспорт.|Адегенде унааны тандаңыз.
This stop has not opened yet.|Эта остановка ещё не открыта.|Бул бекет али ачыла элек.
Choose a different stop.|Выберите другую остановку.|Башка бекетти тандаңыз.
Drag from one stop to another.|Перетащите от одной остановки к другой.|Бир бекеттен башкасына сүйрөңүз.
Keep delivering passengers to explore new areas.|Доставляйте пассажиров, чтобы открыть новые районы.|Жаңы аймактарды ачуу үчүн жүргүнчүлөрдү жеткириңиз.
Route cancelled.|Маршрут отменён.|Каттам жокко чыгарылды.
No 💷 were spent.|💷 не потрачены.|💷 коротулган жок.
Paused|Пауза|Токтотулду
Tap colour for details|Нажмите цвет для деталей|Маалымат үчүн түстү басыңыз
Extend or join ends to loop|Продлите или замкните линию|Узартыңыз же айланма каттам түзүңүз
Choose your first stop|Выберите первую остановку|Биринчи бекетти тандаңыз
Undo last stop|Убрать последнюю остановку|Акыркы бекетти алып салуу
Build a multi-stop line|Построить линию с остановками|Көп бекеттүү каттам түзүү
Plan a multi-stop line|Спланировать линию с остановками|Көп бекеттүү каттамды пландоо
Extend your line|Продлить линию|Каттамды узартуу
Figures cover this round. Boarding time includes transfers; fares are earned when a passenger reaches their matching shape.|Статистика за этот раунд. Пересадки входят во время посадки; доход поступает при доставке к нужной фигуре.|Бул айлампанын статистикасы. Которулуу отургузуу убактысына кирет; керектүү фигурага жеткенде киреше түшөт.
Extra vehicles share your fleet upgrades.|Дополнительный транспорт использует улучшения парка.|Кошумча унаалар парктагы жакшыртууларды колдонот.
Spacing holds departures briefly at stops when another vehicle is just ahead. Reverse requests take effect at the next stop; passengers remain onboard.|Интервалы задерживают отправление, если впереди другой транспорт. Разворот происходит на следующей остановке, пассажиры остаются внутри.|Алдыда башка унаа болсо, жөнөө бир аз кармалат. Артка бурулуу кийинки бекетте болот; жүргүнчүлөр унаада калат.
Correct! Geography bonus collected.|Верно! Географический бонус получен.|Туура! Географиялык бонус алынды.
One answer · Correct = +5 💷|Один ответ · Верно = +5 💷|Бир жооп · Туура = +5 💷
Great work! You connected places, moved people and explored our world.|Отлично! Вы соединили места, перевезли людей и изучили мир.|Азаматсыз! Жерлерди байланыштырдыңыз, адамдарды жеткирдиңиз жана дүйнөнү изилдедиңиз.
Explore your network and collect geography notes as you travel.|Исследуйте сеть и собирайте географические заметки.|Тармакты изилдеп, географиялык жазууларды чогултуңуз.
Same places. Brighter minds.|Знакомые места. Новые знания.|Тааныш жерлер. Жаңы билим.
Your new geography stamps|Ваши новые географические отметки|Жаңы географиялык белгилериңиз
Deliver passengers to cities and answer geography questions to start collecting.|Доставляйте пассажиров и отвечайте на вопросы, чтобы начать коллекцию.|Жыйнакты баштоо үчүн жүргүнчүлөрдү жеткирип, суроолорго жооп бериңиз.
North|Север|Түндүк
North ↑|Север ↑|Түндүк ↑
Yellow line|Жёлтая линия|Сары каттам
Red line|Красная линия|Кызыл каттам
Blue line|Синяя линия|Көк каттам
Green line|Зелёная линия|Жашыл каттам
Purple line|Фиолетовая линия|Кызгылт көк каттам
Orange line|Оранжевая линия|Кызгылт сары каттам
Pink line|Розовая линия|Кызгылт каттам
Teal line|Бирюзовая линия|Бирюза каттам
left|осталось|калды
complete|завершён|бүттү
field notes|полевые заметки|саякат жазуулары
explorer|исследователь|изилдөөчү
of|из|ичинен
for|для|үчүн
in|в|ичинде
and|и|жана
to|в|багытында
from|из|тарабынан
with|с|менен
at|на|боюнда
more|ещё|дагы
new|новые|жаңы
speed|скорость|ылдамдык
refund|возврат|кайтаруу
on this line|на этой линии|бул каттамда
per delivery|за доставку|жеткирүү үчүн
starts|начинается|башталат
ends|заканчивается|бүтөт
Unlocks round|Откроется в раунде|Ачылуучу айлампа
unlocks in round|открывается в раунде|ачылуучу айлампа
unconnected|без маршрута|каттамсыз
transfer|пересадка|которулуу
transfers|пересадки|которулуулар
Direct service: stay on the same line.|Прямой маршрут: оставайтесь на той же линии.|Түз каттам: ошол эле каттамда калыңыз.
No passengers are waiting. Tap a passenger symbol on the map during play.|Нет ожидающих пассажиров. Во время игры нажмите на символ пассажира.|Күткөн жүргүнчүлөр жок. Оюн учурунда жүргүнчүнүн белгисин басыңыз.
Destination symbol|Фигура назначения|Бара турган фигура
Choose a waiting passenger|Выберите ожидающего пассажира|Күтүп турган жүргүнчүнү тандаңыз
Change at|Пересадка на|Которулуу бекети
Save|Сохранить|Сактоо
journeys|поездки|сапарлар
missions completed|заданий выполнено|тапшырма аткарылды
Passport discoveries this round|Открытия паспорта за раунд|Бул айлампадагы паспорт ачылыштары
stamps|отметки|белгилер
Visit|Посетите|Барыңыз
answer a geography question|ответьте на вопрос по географии|географиялык суроого жооп бериңиз
What is the capital of|Как называется столица|Борбору кайсы
Which landmark would you visit in|Какую достопримечательность вы посетите в|Кайсы көрүнүктүү жерге барасыз
Which waterway belongs on|Какой водоём указан на карточке города|Кайсы суу объектиси бул жерге таандык
geography card|географическая карточка|географиялык карта
In which country is|В какой стране находится|Кайсы өлкөдө жайгашкан
In which region is|В каком регионе находится|Кайсы аймакта жайгашкан
Which landmark belongs to|Какая достопримечательность связана с|Кайсы көрүнүктүү жер бул жерге таандык
What kind of landmark is|Какой тип достопримечательности|Көрүнүктүү жердин түрү кандай
is associated with|связан с|менен байланыштуу
is in|находится в|жайгашкан
Keep exploring! The answer is|Продолжайте изучать! Ответ|Изилдөөнү улантыңыз! Жооп
Great geography!|Отличное знание географии!|Географияны жакшы билесиз!
The browser could not save this journey. Free some storage and try again.|Браузер не смог сохранить игру. Освободите место и повторите.|Браузер оюнду сактай алган жок. Орун бошотуп, кайра аракет кылыңыз.
This save is damaged or uses an unsupported format.|Сохранение повреждено или имеет неподдерживаемый формат.|Сакталган оюн бузулган же форматы колдоого алынбайт.
Unreadable save — you can replace it with a new save.|Сохранение не читается — замените новым.|Сакталган оюн окулбайт — жаңысы менен алмаштырыңыз.
Four separate saves on this browser and device. Choose Save to replace a slot; Resume pauses the saved journey so you can inspect your network. The selected slot autosaves every 30 seconds during play.|Четыре сохранения в этом браузере. «Сохранить» заменяет ячейку; «Продолжить» открывает игру на паузе. Выбранная ячейка сохраняется каждые 30 секунд.|Бул браузерде төрт сактоо орду бар. «Сактоо» орунду алмаштырат; «Улантуу» оюнду токтоп турган абалда ачат. Тандалган орун ар 30 секундда автоматтык сакталат.
Route pressure: green = seats available · amber = add capacity · red = overloaded. Purple rings mark transfer stops. Unconnected passengers need a route to their destination shape.|Нагрузка: зелёный — места есть; жёлтый — добавьте транспорт; красный — перегрузка. Фиолетовые кольца — пересадки. Пассажирам без маршрута нужен путь к нужной фигуре.|Жүк: жашыл — орун бар; сары — унаа кошуңуз; кызыл — ашыкча жүк. Кызгылт көк тегеректер — которулуу бекеттери. Каттамсыз жүргүнчүгө керектүү фигурага жол керек.
Deliver passengers to a city and answer a question about its country to earn its stamp.|Доставьте пассажира в город и ответьте на вопрос о стране, чтобы получить отметку.|Белги алуу үчүн жүргүнчүнү шаарга жеткирип, өлкө тууралуу суроого жооп бериңиз.
Landmarks outside city stops are earned by visiting their country and answering a question.|Для отметок вне городов посетите страну и ответьте на вопрос.|Шаардан тышкары жердин белгиси үчүн өлкөгө барып, суроого жооп бериңиз.
Choose one benefit and one challenge after each round.|После каждого раунда выберите преимущество и испытание.|Ар бир айлампадан кийин артыкчылык жана кыйынчылык тандаңыз.
Their effects last for this run.|Их эффекты действуют весь забег.|Алардын таасири оюн бүткүчө сакталат.
Your collection starts after round 1.|Коллекция начинается после раунда 1.|Жыйнак 1-айлампадан кийин башталат.
`;for(const row of entries.trim().split('\n')){const [en,ru,ky]=row.split('|');if(ky)registerTranslations(en,ru,ky);}
let ordered=[],regex;export function t(text){if(language==='en'||typeof text!=='string')return text;const index=language==='ru'?0:1,exact=dictionary.get(text.trim())??foldedDictionary.get(text.trim().toLowerCase());if(exact)return text.replace(text.trim(),exact[index]);if(text===text.toUpperCase()){const key=[...dictionary.keys()].find(k=>k.toUpperCase()===text.trim());if(key)return dictionary.get(key)[index].toUpperCase();}if(ordered.length!==dictionary.size){ordered=[...dictionary.keys()].sort((a,b)=>b.length-a.length);regex=new RegExp('(^|[^A-Za-z])('+ordered.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?=$|[^A-Za-z])','gi');}return text.replace(regex,(_,lead,key)=>lead+foldedDictionary.get(key.toLowerCase())[index]);}
export function installLocalization(root,state,convert=t){
 root.lang=state.language??'en';const originals=new WeakMap();
 function visit(n){if(n.nodeType===3){const old=originals.get(n);if(old&&n.nodeValue===old.output)return;const source=n.nodeValue,output=convert(source);originals.set(n,{source,output});if(output!==source)n.nodeValue=output;return;}if(n.nodeType!==1)return;for(const attr of ['aria-label','title','alt'])if(n.hasAttribute(attr)){const value=n.getAttribute(attr),output=convert(value);if(value!==output)n.setAttribute(attr,output);}for(const child of n.childNodes)visit(child);}
 const observer=new MutationObserver(records=>{observer.disconnect();for(const r of records)visit(r.type==='characterData'?r.target:r.target);observe();});function observe(){observer.observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt']});}visit(root);observe();return {destroy(){observer.disconnect();},refresh(){visit(root);}};
}
