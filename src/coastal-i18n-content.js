import {registerTranslations} from './coastal-i18n.js';
const extra=`
Take passengers to any stop matching their small symbol. Circles and squares start the game; triangles join in round 3. A rarer shape joins every five rounds, starting in round 5. Open Shape filter to highlight matching cities and show them on the map. Connect stops and keep queues moving.|Доставляйте пассажиров на любую остановку с нужным символом. Сначала появляются круги и квадраты, в раунде 3 — треугольники. С раунда 5 каждые пять раундов добавляется редкая фигура. Фильтр фигур выделяет нужные города. Соединяйте остановки и сокращайте очереди.|Жүргүнчүнү анын белгисине туура келген каалаган бекетке жеткириңиз. Адегенде тегерек жана төрт бурчтук, 3-айлампада үч бурчтук чыгат. 5-айлампадан баштап ар беш айлампада сейрек фигура кошулат. Фигура чыпкасы керектүү шаарларды көрсөтөт. Бекеттерди байланыштырып, кезекти азайтыңыз.
The first grey line circle is selected. Choose Bus in the transport tray above it. Drag from London to Oxford, then release on the stop. This costs your starting 20 💷. On a keyboard, open London and choose “Build a route from here”, then Oxford.|Выбран первый серый кружок линии. Выберите автобус над ним. Перетащите от Лондона к Оксфорду и отпустите на остановке: это стоит начальные 20 💷. Для управления с клавиатуры откройте Лондон, выберите «Создать маршрут отсюда», затем Оксфорд.|Биринчи боз каттам тегереги тандалды. Анын үстүндөгү автобусту тандаңыз. Лондондон Оксфордго сүйрөп, бекетте коё бериңиз: баштапкы 20 💷 сарпталат. Баскычтоп менен Лондонду ачып, «Бул жерден каттам түзүү», анан Оксфордду тандаңыз.
The first grey line circle is selected. Choose Marshrutka in the transport tray above it. Drag from Bishkek to Tokmok, then release on the stop. This costs your starting 20 💷. On a keyboard, open Bishkek and choose “Build a route from here”, then Tokmok.|Выбран первый серый кружок линии. Выберите маршрутку над ним. Перетащите от Бишкека к Токмоку и отпустите на остановке: это стоит начальные 20 💷. С клавиатуры откройте Бишкек, выберите «Создать маршрут отсюда», затем Токмок.|Биринчи боз каттам тегереги тандалды. Анын үстүндөгү маршрутканы тандаңыз. Бишкектен Токмокко сүйрөп, бекетте коё бериңиз: баштапкы 20 💷 сарпталат. Баскычтоп менен Бишкекти ачып, «Бул жерден каттам түзүү», анан Токмокту тандаңыз.
Press Play below the map. Each vehicle starts with one seat. Passengers get off first, then board one at a time. Each takes 0.5 seconds at a level-1 stop. Station upgrades make this faster.|Нажмите «Играть» под картой. Сначала у транспорта одно место. Пассажиры выходят, затем садятся по одному. На остановке уровня 1 каждый тратит 0,5 секунды. Улучшения станции ускоряют процесс.|Картанын алдындагы «Ойноо» баскычын басыңыз. Ар бир унаада башында бир орун бар. Жүргүнчүлөр адегенде түшүп, анан бирден отурат. 1-деңгээлдеги бекетте ар бирине 0,5 секунд керек. Бекетти жакшыртуу муну тездетет.
Watch the bus carry passengers to their matching stops. Each delivery earns 3 💷. Your first three deliveries also earn a one-time 11-💷 training grant to connect Bristol. After three deliveries, we will pause so you can expand. If paused, press Play again.|Автобус доставляет пассажиров к нужной фигуре. Каждая доставка приносит 3 💷. Первые три дают разовый грант 11 💷 для подключения Бристоля. После трёх доставок игра приостановится для расширения сети. Затем нажмите «Играть».|Автобус жүргүнчүлөрдү керектүү фигурага жеткирет. Ар жеткирүү 3 💷 берет. Алгачкы үчөө Бристолго каттам ачуу үчүн бир жолку 11 💷 грант берет. Үч жеткирүүдөн кийин тармакты кеңейтүү үчүн оюн токтойт. Андан соң «Ойноо» баскычын басыңыз.
Watch the marshrutka carry passengers to their matching stops. Each delivery earns 3 💷. Your first three deliveries also earn a one-time 11-💷 training grant to connect Kant. After three deliveries, we will pause so you can expand. If paused, press Play again.|Маршрутка доставляет пассажиров к нужной фигуре. Каждая доставка приносит 3 💷. Первые три дают разовый грант 11 💷 для подключения Канта. После трёх доставок игра приостановится для расширения сети. Затем нажмите «Играть».|Маршрутка жүргүнчүлөрдү керектүү фигурага жеткирет. Ар жеткирүү 3 💷 берет. Алгачкы үчөө Кантка каттам ачуу үчүн бир жолку 11 💷 грант берет. Үч жеткирүүдөн кийин тармакты кеңейтүү үчүн оюн токтойт. Андан соң «Ойноо» баскычын басыңыз.
You now have enough 💷 for another bus. Drag Oxford → Bristol. Passengers can transfer between routes to reach a stop farther away.|Теперь хватает 💷 на ещё один автобус. Перетащите Оксфорд → Бристоль. Пассажиры могут пересаживаться между линиями, чтобы доехать дальше.|Эми дагы бир автобуска 💷 жетет. Оксфорд → Бристоль сүйрөңүз. Алыскы бекетке жетүү үчүн жүргүнчүлөр башка каттамга которула алат.
You now have enough 💷 for another marshrutka. Drag Tokmok → Kant. Passengers can transfer between routes to reach a stop farther away.|Теперь хватает 💷 на ещё одну маршрутку. Перетащите Токмок → Кант. Пассажиры могут пересаживаться между линиями, чтобы доехать дальше.|Эми дагы бир маршруткага 💷 жетет. Токмок → Кант сүйрөңүз. Алыскы бекетке жетүү үчүн жүргүнчүлөр башка каттамга которула алат.
Press Play again. Deliver all five passengers to finish round 1. You can pause at any time to plan your network.|Снова нажмите «Играть». Доставьте всех пятерых пассажиров, чтобы завершить раунд 1. Можно поставить игру на паузу для планирования.|Кайра «Ойноо» баскычын басыңыз. 1-айлампаны бүтүрүү үчүн беш жүргүнчүнү жеткириңиз. Тармакты пландоо үчүн каалаган убакта токтотсоңуз болот.
Glowing quiz coins appear during play. Tap one and answer a question about your newest area for 15 💷. The Country atlas button shows unlocked flags, capitals, landmarks and waterways. Reading pauses the game.|Во время игры появляются светящиеся монеты. Нажмите и ответьте на вопрос о новом регионе за 15 💷. Атлас показывает флаги, столицы, достопримечательности и водоёмы. При чтении игра приостанавливается.|Оюнда жаркыраган монеталар чыгат. Аны басып, жаңы аймак тууралуу суроого жооп берсеңиз 15 💷 аласыз. Атлас желектерди, борборлорду, көрүнүктүү жерлерди жана сууларды көрсөтөт. Окуганда оюн токтойт.
Glowing quiz coins appear during play. Tap one and answer a question about your newest area for 15 💷. The Regional atlas button shows unlocked flags, capitals, landmarks and waterways. Reading pauses the game.|Во время игры появляются светящиеся монеты. Ответьте на вопрос о новом регионе за 15 💷. Региональный атлас показывает флаг, областные центры, достопримечательности и водоёмы. При чтении игра приостанавливается.|Оюнда жаркыраган монеталар чыгат. Жаңы аймак тууралуу суроого жооп берсеңиз 15 💷 аласыз. Аймактар атласы желекти, облус борборлорун, көрүнүктүү жерлерди жана сууларды көрсөтөт. Окуганда оюн токтойт.
Tap a stop for station upgrades and, later, airport construction. Tap a line colour for vehicle upgrades, spacing and extra vehicles. Use 4×4s over passes, tunnel shuttles through mountains and northern trains along the rail corridor. Follow the lakeshore; surface vehicles cannot cross lakes.|Нажмите остановку для улучшений и строительства аэропорта. Цвет линии открывает улучшения транспорта, интервалы и покупку машин. Используйте внедорожники на перевалах, шаттлы в тоннелях и поезда на северной железной дороге. Наземный транспорт идёт по берегу, не через озёра.|Бекетти басып, аны жакшыртыңыз же аэропорт куруңуз. Каттамдын түсү унаа жакшыртууларын, аралыктарын жана сатып алууну ачат. Ашууда 4×4, тоннелде атайын каттам, түндүк темир жолдо поезд колдонуңуз. Жер үстүндөгү унаа көлдөн эмес, жээктен өтөт.
Plan for the next round|План следующего раунда|Кийинки айлампаны пландоо
At round end choose one benefit and one challenge, each from three cards. Their effects last for the run. Queues that wait too long blink red: clear them before the countdown ends. You can close a line into a loop by joining its ends after at least three different stops. Removing a route refunds 100% of its construction cost, so you can rebuild freely; Retry restores the round-start budget.|В конце раунда выберите преимущество и испытание из трёх карт каждого типа. Эффекты действуют весь забег. Долгие очереди мигают красным: разгрузите их до конца отсчёта. Линию с тремя остановками можно замкнуть в кольцо. Удаление возвращает всю стоимость; повтор восстанавливает бюджет начала раунда.|Айлампа соңунда ар түрдөгү үч картадан бир артыкчылык жана бир кыйынчылык тандаңыз. Таасири оюн бүткүчө сакталат. Узак кезек кызыл күйөт: убакыт бүтө электе аны азайтыңыз. Үч бекеттүү каттамды тегерек кылсаңыз болот. Өчүргөндө толук баа кайтарылат; кайталоо айлампа башындагы каражатты калыбына келтирет.
Fog clears as Kyrgyzstan’s regions unlock. Mountain 4×4s arrive in round 6, northern trains in 8, tunnel shuttles in 10, flights in 13 and express coaches in 20. Hard mode introduces snow, wind and market crowds from round 3. Pan, zoom and use Fit map to explore.|Туман исчезает при открытии областей Кыргызстана. Внедорожники появляются в раунде 6, поезда в 8, тоннели в 10, самолёты в 13, экспресс-автобусы в 20. Сложный режим добавляет снег, ветер и наплыв людей с раунда 3. Перемещайте и масштабируйте карту.|Кыргызстандын аймактары ачылганда туман кетет. 4×4 6-айлампада, поезд 8де, тоннель 10до, учак 13тө, экспресс-автобус 20да чыгат. Татаал режимде 3-айлампадан кар, шамал жана базардагы эл көбөйөт. Картаны жылдырып, масштабын өзгөртүңүз.
Kyrgyzstan has seven regions. Bishkek is the national capital; Osh is also a city of national importance. Explore Regional atlas for landmarks and facts.|В Кыргызстане семь областей. Бишкек — столица; Ош также город республиканского значения. Изучайте достопримечательности и факты в региональном атласе.|Кыргызстанда жети облус бар. Бишкек — борбор; Ош дагы республикалык маанидеги шаар. Аймактар атласынан көрүнүктүү жерлерди жана кызыктуу маалыматтарды окуңуз.
England, Wales, Scotland and Northern Ireland form the UK. The Republic of Ireland is a separate country. Explore Country atlas for landmarks and facts.|Англия, Уэльс, Шотландия и Северная Ирландия образуют Великобританию. Республика Ирландия — отдельная страна. Изучайте достопримечательности и факты в атласе.|Англия, Уэльс, Шотландия жана Түндүк Ирландия Улуу Британияны түзөт. Ирландия Республикасы — өзүнчө өлкө. Атластан көрүнүктүү жерлерди жана кызыктуу маалыматтарды окуңуз.
Which country contains|В какой стране находится|Кайсы өлкөдө жайгашкан
Which landscape belongs on|Какой ландшафт указан на карточке|Кайсы ландшафт бул жерге таандык
City square|Городская площадь|Шаар аянты
Ancient tower|Древняя башня|Байыркы мунара
Train station|Железнодорожная станция|Темир жол бекети
Petroglyphs|Петроглифы|Петроглифтер
Mosque|Мечеть|Мечит
Craft tradition|Ремесленная традиция|Кол өнөрчүлүк салты
Mineral spring|Минеральный источник|Минералдык булак
Reservoir|Водохранилище|Суу сактагыч
Mountain landscape|Горный ландшафт|Тоо ландшафты
Market|Рынок|Базар
Flowers|Цветы|Гүлдөр
Forest|Лес|Токой
Lighthouse|Маяк|Маяк
Sports stadium|Спортивный стадион|Спорт стадиону
Natural waterfall|Природный водопад|Табигый шаркыратма
Windmill|Ветряная мельница|Жел тегирмени
Aqueduct|Акведук|Акведук
Botanical garden|Ботанический сад|Ботаникалык бак
Chuy explorer|Исследователь Чуйской долины|Чүй өрөөнүн изилдөөчү
Complete three journeys between stops in Chuy Region.|Совершите три поездки между остановками Чуйской области.|Чүй облусунун бекеттеринин ортосунда үч сапар жасаңыз.
station|станцию|бекетти
upgrades|улучшения|жакшыртуулар
Seats|Места|Орундар
Speed|Скорость|Ылдамдык
New route|Новый маршрут|Жаңы каттам
Fleet|Парк|Унаалар паркы
Delivery fare|Доход за доставку|Жеткирүү кирешеси
Route refund|Возврат за маршрут|Каттамдын кайтарылган баасы
Active card modifiers|Действующие модификаторы карт|Карталардын учурдагы таасири
No active cards affect this vehicle.|На этот транспорт не действуют карты.|Бул унаага карталардын таасири жок.
map units/s|единиц карты/с|карта бирдиги/с
Ferry challenge|Испытание паромов|Кеме кыйынчылыгы
Flexible land routes between stops on the same land.|Наземные маршруты между остановками на одной суше.|Бир кургактыктагы бекеттердин ортосундагы каттамдар.
Fast land routes. Available from round 8.|Быстрые наземные маршруты с раунда 8.|8-айлампадан баштап тез жер үстүндөгү каттамдар.
Sea crossings between harbours on different land.|Морские пути между гаванями на разных берегах.|Ар башка жээктердеги порттордун ортосундагы деңиз каттамдары.
Air routes between two airports.|Воздушные маршруты между двумя аэропортами.|Эки аэропорттун ортосундагы учак каттамдары.
High-speed land service. Uses train card bonuses. Available from round 20.|Скоростной наземный транспорт с бонусами железнодорожных карт, с раунда 20.|20-айлампадан баштап поезд карталарынын артыкчылыгын колдонгон ылдам каттам.
Rail service beneath the English Channel, linking Folkestone and Coquelles. Uses train card bonuses. Available from round 18.|Поезд под Ла-Маншем соединяет Фолкстон и Кокель с раунда 18. Использует железнодорожные карты.|18-айлампадан баштап Ла-Манштын алдындагы поезд Фолкстон менен Кокельди байланыштырат. Поезд карталарын колдонот.
Marshrutkas serve valley roads. Mountain passes need a 4×4 or a tunnel. Follow the lakeshore.|Маршрутки обслуживают долины. Для перевалов нужен внедорожник или тоннель. Следуйте по берегу озера.|Маршруткалар өрөөн жолдорунда жүрөт. Ашуу үчүн 4×4 же тоннель керек. Көл жээги менен жүрүңүз.
Northern trains serve the Bishkek–Balykchy corridor. They cannot cross the country’s mountain ranges.|Северные поезда идут по коридору Бишкек–Балыкчы. Они не пересекают горные хребты страны.|Түндүк поезддери Бишкек–Балыкчы багытында жүрөт. Алар өлкөнүн тоо кыркаларынан өтө албайт.
Mountain 4×4 vehicles cross passes and rough terrain, but never drive across lakes.|Внедорожники пересекают перевалы и пересечённую местность, но не озёра.|4×4 унаалар ашуудан жана татаал жерден өтөт, бирок көлдөн өтпөйт.
Domestic planes fly between airports, over mountains and lakes.|Внутренние самолёты летают между аэропортами над горами и озёрами.|Ички учак каттамдары аэропорттордун ортосунда тоо жана көлдүн үстүнөн учат.
Tunnel shuttles cross marked mountain passes underground. Build an expensive shortcut to avoid slow mountain roads.|Тоннельные шаттлы пересекают отмеченные перевалы под землёй. Дорогой тоннель сокращает медленный горный путь.|Тоннель каттамдары белгиленген ашуудан жер астында өтөт. Кымбат тоннель жай тоо жолун кыскартат.
Express coaches are faster valley road vehicles. They still obey mountain and lake restrictions.|Экспресс-автобусы быстрее на дорогах долин. Ограничения гор и озёр остаются.|Экспресс-автобустар өрөөн жолунда тезирээк. Тоо жана көл чектөөлөрү сакталат.
Stonehenge in Wiltshire, England, has a stone circle built about 4,500 years ago — around the same time as the Great Pyramid in Egypt!|Каменный круг Стоунхенджа в английском Уилтшире построен около 4500 лет назад — примерно во время Великой пирамиды в Египте!|Англиянын Уилтшириндеги Стоунхендж таш тегереги болжол менен 4500 жыл мурун — Египеттеги Улуу пирамида менен бир мезгилде курулган!
Cymru is the Welsh name for Wales. Welsh and English are used in Wales.|Cymru — валлийское название Уэльса. В Уэльсе используют валлийский и английский.|Cymru — Уэльстин валлийче аталышы. Уэльсте валлий жана англис тилдери колдонулат.
Scotland includes mainland landscapes and many islands.|Шотландия включает материковые территории и множество островов.|Шотландия кургактык бөлүгүн жана көп аралдарды камтыйт.
Northern Ireland and the Republic of Ireland are on the same island but belong to different countries.|Северная Ирландия и Республика Ирландия на одном острове, но относятся к разным странам.|Түндүк Ирландия жана Ирландия Республикасы бир аралда, бирок ар башка өлкөлөргө таандык.
The Republic of Ireland is a separate country from the UK.|Республика Ирландия — отдельная от Великобритании страна.|Ирландия Республикасы — Улуу Британиядан өзүнчө өлкө.
The Channel Tunnel links Folkestone in England with Coquelles in France.|Тоннель под Ла-Маншем связывает Фолкстон в Англии и Кокель во Франции.|Ла-Манш тоннели Англиядагы Фолкстонду Франциядагы Кокель менен байланыштырат.
Belgium has a coastline on the North Sea.|У Бельгии есть побережье Северного моря.|Бельгиянын Түндүк деңизинде жээги бар.
Amsterdam is the capital; the national government is based in The Hague.|Амстердам — столица; правительство страны находится в Гааге.|Амстердам — борбор; өлкөнүн өкмөтү Гаагада жайгашкан.
The Rhine continues from Germany into the Netherlands.|Рейн течёт из Германии в Нидерланды.|Рейн Германиядан Нидерланддарга агат.
Which waterway separates southern England from France?|Какой пролив отделяет юг Англии от Франции?|Англиянын түштүгүн Франциядан кайсы кысык бөлөт?
What is the Welsh name for Cardiff?|Как Кардифф называется по-валлийски?|Кардифф валлий тилинде кандай аталат?
Which Scottish landmark is a lake?|Какая шотландская достопримечательность является озером?|Шотландиянын кайсы көрүнүктүү жери көл болуп саналат?
Northern Ireland is part of which country?|В состав какой страны входит Северная Ирландия?|Түндүк Ирландия кайсы өлкөгө кирет?
Which river flows through Dublin?|Какая река течёт через Дублин?|Дублин аркылуу кайсы дарыя агат?
Which river flows through Paris?|Какая река течёт через Париж?|Париж аркылуу кайсы дарыя агат?
Which sea borders Belgium?|Какое море омывает Бельгию?|Бельгия кайсы деңиз менен чектешет?
Where is the government of the Netherlands based?|Где находится правительство Нидерландов?|Нидерланддардын өкмөтү кайда жайгашкан?
Which river connects Germany with the Netherlands?|Какая река соединяет Германию и Нидерланды?|Германия менен Нидерланддарды кайсы дарыя байланыштырат?
Thames|Темза|Темза
Seine|Сена|Сена
Liffey|Лиффи|Лиффи
Rhine|Рейн|Рейн
Great geography! +15 💷|Отлично! +15 💷|Азаматсыз! +15 💷
collected|получено|алынды
Passenger|Пассажир|Жүргүнчү
New cities|Новые города|Жаңы шаарлар
The map is focused here. Connect them, then press Play.|Карта показывает их. Соедините остановки и нажмите «Играть».|Карта ушул жерди көрсөтөт. Бекеттерди байланыштырып, «Ойноо» баскычын басыңыз.
Your map view is unchanged. Plan your routes, then press Play.|Вид карты не изменился. Спланируйте маршруты и нажмите «Играть».|Картанын көрүнүшү өзгөргөн жок. Каттамдарды пландап, «Ойноо» баскычын басыңыз.
Patient passengers|Терпеливые пассажиры|Сабырдуу жүргүнчүлөр
Wide platforms|Широкие платформы|Кең аянтчалар
Extra service time|Дополнительное время|Кошумча убакыт
Calm dispatchers|Спокойные диспетчеры|Сабырдуу диспетчерлер
Workshop voucher|Сертификат мастерской|Устакана купону
Local builders|Местные строители|Жергиликтүү куруучулар
Harbour initiative|Строительство гаваней|Порт куруу демилгеси
Airport initiative|Строительство аэропортов|Аэропорт куруу демилгеси
Extra seating|Дополнительные места|Кошумча орундар
Quiet season|Тихий сезон|Тынч мезгил
Impatient commuters|Нетерпеливые пассажиры|Сабырсыз жүргүнчүлөр
Narrow platforms|Узкие платформы|Тар аянтчалар
Short timetable|Короткое расписание|Кыска график
Strict inspector|Строгий инспектор|Катуу инспектор
Expensive parts|Дорогие детали|Кымбат тетиктер
Labour costs|Стоимость труда|Эмгек чыгымы
Dredging fees|Плата за углубление|Тереңдетүү акысы
Runway fees|Сбор за взлётную полосу|Учуу тилкесинин акысы
Rush hour|Час пик|Тыгын маалы
Material shortage|Нехватка материалов|Материал тартыштыгы
Fewer sponsors|Меньше спонсоров|Демөөрчүлөрдүн азайышы
Heavy traffic|Плотный поток|Унаалардын көбөйүшү
Holiday crowds|Праздничные толпы|Майрамдагы эл
Festival season|Сезон фестивалей|Фестиваль мезгили
Fuel surcharge|Топливная надбавка|Күйүүчү майга кошумча акы
Bus routes cost 15% less.|Автобусные маршруты дешевле на 15%.|Автобус каттамдары 15% арзан.
Marshrutka routes cost 15% less.|Маршрутки дешевле на 15%.|Маршрутка каттамдары 15% арзан.
Train routes cost 15% less.|Железнодорожные маршруты дешевле на 15%.|Поезд каттамдары 15% арзан.
Boat routes cost 15% less.|Паромные маршруты дешевле на 15%.|Кеме каттамдары 15% арзан.
Mountain 4×4 routes cost 15% less.|Маршруты внедорожников дешевле на 15%.|4×4 каттамдары 15% арзан.
Plane routes cost 15% less.|Авиамаршруты дешевле на 15%.|Учак каттамдары 15% арзан.
Buses move 15% faster.|Автобусы быстрее на 15%.|Автобустар 15% тезирээк.
Marshrutkas move 15% faster.|Маршрутки быстрее на 15%.|Маршруткалар 15% тезирээк.
Trains move 15% faster.|Поезда быстрее на 15%.|Поезддер 15% тезирээк.
Boats move 15% faster.|Паромы быстрее на 15%.|Кемелер 15% тезирээк.
Mountain 4×4 vehicles move 15% faster.|Внедорожники быстрее на 15%.|4×4 унаалар 15% тезирээк.
Planes move 15% faster.|Самолёты быстрее на 15%.|Учактар 15% тезирээк.
Earn 1 extra 💷 per delivery.|Получайте дополнительно 1 💷 за доставку.|Ар бир жеткирүүгө кошумча 1 💷 алыңыз.
Passengers wait 8 seconds longer before alarms.|Пассажиры ждут на 8 секунд дольше до тревоги.|Эскертүүгө чейин жүргүнчүлөр 8 секунд көбүрөөк күтөт.
Every stop holds 2 more waiting passengers.|Каждая остановка вмещает ещё 2 ожидающих пассажиров.|Ар бир бекетте дагы 2 жүргүнчү күтө алат.
Add 20 seconds to each round.|Каждый раунд длиннее на 20 секунд.|Ар бир айлампага 20 секунд кошулат.
Add 3 seconds to the red alarm countdown.|Красный отсчёт длиннее на 3 секунды.|Кызыл эскертүүнүн убактысына 3 секунд кошулат.
Vehicle upgrades cost 15% less.|Улучшения транспорта дешевле на 15%.|Унааны жакшыртуу 15% арзан.
Station upgrades cost 15% less.|Улучшения станций дешевле на 15%.|Бекетти жакшыртуу 15% арзан.
New harbours cost 20% less.|Новые гавани дешевле на 20%.|Жаңы порттор 20% арзан.
New airports cost 20% less.|Новые аэропорты дешевле на 20%.|Жаңы аэропорттор 20% арзан.
Every vehicle gains one seat.|Каждый транспорт получает одно место.|Ар бир унаага бир орун кошулат.
Passenger arrivals are 10% slower.|Пассажиры появляются на 10% реже.|Жүргүнчүлөр 10% сейрек чыгат.
All new route sections cost 10% less. Removed routes still give a full refund.|Новые участки дешевле на 10%. Удаление возвращает полную стоимость.|Жаңы бөлүктөр 10% арзан. Өчүргөндө баасы толук кайтарылат.
Each earned star pays 1 extra 💷.|Каждая звезда приносит ещё 1 💷.|Ар бир жылдыз кошумча 1 💷 берет.
All vehicles move 8% faster.|Весь транспорт быстрее на 8%.|Бардык унаалар 8% тезирээк.
Every boat gains one seat.|Каждый паром получает одно место.|Ар бир кемеге бир орун кошулат.
Every mountain 4×4 gains one seat.|Каждый внедорожник получает одно место.|Ар бир 4×4 унаага бир орун кошулат.
Every bus gains one seat.|Каждый автобус получает одно место.|Ар бир автобуска бир орун кошулат.
Every marshrutka gains one seat.|Каждая маршрутка получает одно место.|Ар бир маршруткага бир орун кошулат.
Every train gains one seat.|Каждый поезд получает одно место.|Ар бир поездге бир орун кошулат.
Every plane gains one seat.|Каждый самолёт получает одно место.|Ар бир учакка бир орун кошулат.
Receive 25 💷; arrivals become 5% faster.|Получите 25 💷; пассажиры появляются на 5% чаще.|25 💷 алыңыз; жүргүнчүлөр 5% бат чыгат.
All new routes cost 8% less.|Новые маршруты дешевле на 8%.|Жаңы каттамдар 8% арзан.
One extra queue space and 5 extra seconds of patience.|Ещё одно место в очереди и 5 секунд терпения.|Кезекке бир орун жана 5 секунд күтүү кошулат.
Bus routes cost 15% more.|Автобусные маршруты дороже на 15%.|Автобус каттамдары 15% кымбат.
Marshrutka routes cost 15% more.|Маршрутки дороже на 15%.|Маршрутка каттамдары 15% кымбат.
Train routes cost 15% more.|Железнодорожные маршруты дороже на 15%.|Поезд каттамдары 15% кымбат.
Boat routes cost 15% more.|Паромные маршруты дороже на 15%.|Кеме каттамдары 15% кымбат.
Mountain 4×4 routes cost 15% more.|Маршруты внедорожников дороже на 15%.|4×4 каттамдары 15% кымбат.
Plane routes cost 15% more.|Авиамаршруты дороже на 15%.|Учак каттамдары 15% кымбат.
Buses move 10% slower.|Автобусы медленнее на 10%.|Автобустар 10% жайыраак.
Marshrutkas move 10% slower.|Маршрутки медленнее на 10%.|Маршруткалар 10% жайыраак.
Trains move 10% slower.|Поезда медленнее на 10%.|Поезддер 10% жайыраак.
Boats move 10% slower.|Паромы медленнее на 10%.|Кемелер 10% жайыраак.
Mountain 4×4 vehicles move 10% slower.|Внедорожники медленнее на 10%.|4×4 унаалар 10% жайыраак.
Planes move 10% slower.|Самолёты медленнее на 10%.|Учактар 10% жайыраак.
Earn 1 fewer 💷 per delivery.|Получайте на 1 💷 меньше за доставку.|Жеткирүү үчүн 1 💷 азыраак аласыз.
Alarms start 5 seconds earlier.|Тревога начинается на 5 секунд раньше.|Эскертүү 5 секунд эрте башталат.
Each stop holds one fewer waiting passenger.|На каждой остановке на одно место меньше.|Ар бир бекетте бир орун аз.
Each round has 12 fewer seconds.|Каждый раунд короче на 12 секунд.|Ар бир айлампа 12 секунд кыска.
Red alarms end 2 seconds earlier.|Красный отсчёт заканчивается на 2 секунды раньше.|Кызыл эскертүү 2 секунд эрте бүтөт.
Vehicle upgrades cost 15% more.|Улучшения транспорта дороже на 15%.|Унааны жакшыртуу 15% кымбат.
Station upgrades cost 15% more.|Улучшения станций дороже на 15%.|Бекетти жакшыртуу 15% кымбат.
New harbours cost 20% more.|Новые гавани дороже на 20%.|Жаңы порттор 20% кымбат.
New airports cost 20% more.|Новые аэропорты дороже на 20%.|Жаңы аэропорттор 20% кымбат.
Passenger arrivals become 15% faster.|Пассажиры появляются на 15% чаще.|Жүргүнчүлөр 15% бат чыгат.
All new route sections cost 10% more. Removed routes still give a full refund.|Новые участки дороже на 10%. Удаление возвращает полную стоимость.|Жаңы бөлүктөр 10% кымбат. Өчүргөндө баасы толук кайтарылат.
Each earned star pays 1 fewer 💷.|Каждая звезда приносит на 1 💷 меньше.|Ар бир жылдыз 1 💷 азыраак берет.
All vehicles move 5% slower.|Весь транспорт медленнее на 5%.|Бардык унаалар 5% жайыраак.
Add 3 passengers to each round.|Добавьте 3 пассажиров в каждый раунд.|Ар бир айлампага 3 жүргүнчү кошулат.
Arrivals become 8% faster and add 2 passengers per round.|Пассажиры появляются на 8% чаще; добавьте 2 пассажиров за раунд.|Жүргүнчүлөр 8% бат чыгат; айлампага 2 жүргүнчү кошулат.
All new routes cost 8% more.|Новые маршруты дороже на 8%.|Жаңы каттамдар 8% кымбат.
All vehicles move 3% slower; alarms start 3 seconds sooner.|Весь транспорт медленнее на 3%; тревога на 3 секунды раньше.|Бардык унаалар 3% жайыраак; эскертүү 3 секунд эрте башталат.
Boats move 5% slower; arrivals become 5% faster.|Паромы медленнее на 5%; пассажиры появляются на 5% чаще.|Кемелер 5% жайыраак; жүргүнчүлөр 5% бат чыгат.
Mountain 4×4 vehicles move 5% slower; arrivals become 5% faster.|Внедорожники медленнее на 5%; пассажиры появляются на 5% чаще.|4×4 унаалар 5% жайыраак; жүргүнчүлөр 5% бат чыгат.
Buses move 5% slower; add 2 passengers per round.|Автобусы медленнее на 5%; добавьте 2 пассажиров за раунд.|Автобустар 5% жайыраак; айлампага 2 жүргүнчү кошулат.
Marshrutkas move 5% slower; add 2 passengers per round.|Маршрутки медленнее на 5%; добавьте 2 пассажиров за раунд.|Маршруткалар 5% жайыраак; айлампага 2 жүргүнчү кошулат.
Trains move 5% slower; add 2 passengers per round.|Поезда медленнее на 5%; добавьте 2 пассажиров за раунд.|Поезддер 5% жайыраак; айлампага 2 жүргүнчү кошулат.
Planes move 5% slower; arrivals become 5% faster.|Самолёты медленнее на 5%; пассажиры появляются на 5% чаще.|Учактар 5% жайыраак; жүргүнчүлөр 5% бат чыгат.
All|Все|Баары
New|Новая|Жаңы
Choose transport, then drag|Выберите транспорт и перетащите маршрут|Унааны тандап, каттамды сүйрөңүз
Choose a transport type, then tap two stops.|Выберите транспорт и нажмите две остановки.|Унаанын түрүн тандап, эки бекетти басыңыз.
Open atlas|Открыть атлас|Атласты ачуу
delivered|доставлено|жеткирилди
Regional centres · Marshrutkas: roads · Mountain 4×4s: passes · Trains: northern corridor · Planes: airports · Tunnels: mountains · North ↑|Областные центры · Маршрутки: дороги · 4×4: перевалы · Поезда: север · Самолёты: аэропорты · Тоннели: горы · Север ↑|Облустардын борборлору · Маршрутка: жолдор · 4×4: ашуулар · Поезд: түндүк · Учак: аэропорттор · Тоннель: тоолор · Түндүк ↑
What is the regional centre of|Какой город является центром региона|Облустун борбору кайсы
Which country contains|В какой стране находится|Кайсы өлкөдө жайгашкан
Mountain tunnel|Горный тоннель|Тоо тоннели
Mineral spring|Минеральный источник|Минералдык булак
Chuy|Чу|Чүй
Naryn|Нарын|Нарын
Talas|Талас|Талас
Ak-Buura|Ак-Буура|Ак-Буура
Kara-Balta River|Река Кара-Балта|Кара-Балта дарыясы
Sokuluk River|Река Сокулук|Сокулук дарыясы
Karakol River|Река Каракол|Каракол дарыясы
Kara-Buura River|Река Кара-Буура|Кара-Буура дарыясы
At-Bashy River|Река Ат-Башы|Ат-Башы дарыясы
Kugart River|Река Кугарт|Көгарт дарыясы
Kara Darya|Карадарья|Кара-Дарыя
Suusamyr River|Река Суусамыр|Суусамыр дарыясы
Arslanbob River|Река Арсланбоб|Арстанбап дарыясы
Kyzyl-Suu River|Река Кызыл-Суу|Кызыл-Суу дарыясы
Shakhimardan River|Река Шахимардан|Шахимардан дарыясы
Chon-Kemin River|Река Чон-Кемин|Чоң-Кемин дарыясы
Batken foothills|Предгорья Баткена|Баткендин тоо этектери
Fergana Valley|Ферганская долина|Фергана өрөөнү
Turkestan Range|Туркестанский хребет|Түркстан кырка тоосу
Walnut forest streams|Ручьи орехового леса|Жаңгак токоюнун булактары
Fergana foothills|Предгорья Ферганы|Фергана тоо этектери
Issyk-Kul shores unlocked|Открыты берега Иссык-Куля|Ысык-Көлдүн жээктери ачылды
Surface routes must go around lakes. Connect Balykchy and Cholpon-Ata along the northern shore.|Наземные маршруты должны обходить озёра. Соедините Балыкчы и Чолпон-Ату вдоль северного берега.|Жер үстүндөгү каттамдар көлдү айланып өтүшү керек. Балыкчы менен Чолпон-Атаны түндүк жээк аркылуу байланыштырыңыз.
Mountain 4×4 unlocked|Открыт горный внедорожник|Тоолук 4×4 унаа ачылды
A mountain 4×4 can cross mountain barriers. It still cannot cross a lake.|Внедорожник может пересекать горные барьеры, но не озёра.|4×4 унаа тоо тосмосунан өтө алат, бирок көлдөн өтө албайт.
Northern trains unlocked|Открыты северные поезда|Түндүк поезддери ачылды
Trains connect Bishkek, Kant, Tokmok, Kara-Balta, Sokuluk, Balykchy and Kemin. This is a northern rail corridor, not a railway across every mountain.|Поезда соединяют Бишкек, Кант, Токмок, Кара-Балту, Сокулук, Балыкчы и Кемин. Это северный коридор, а не железная дорога через все горы.|Поезддер Бишкек, Кант, Токмок, Кара-Балта, Сокулук, Балыкчы жана Кеминди байланыштырат. Бул түндүк темир жол багыты; бардык тоолордон өтүүчү жол эмес.
Mountain tunnels unlocked|Открыты горные тоннели|Тоо тоннелдери ачылды
Select Tunnel shuttle and connect stops on opposite sides of a marked mountain pass. Tunnels offer fast shortcuts, but still cannot cross lakes.|Выберите тоннельный шаттл и соедините остановки по разные стороны отмеченного перевала. Тоннели сокращают путь, но не пересекают озёра.|Тоннель каттамын тандап, белгиленген ашуунун эки тарабындагы бекеттерди байланыштырыңыз. Тоннель жолду кыскартат, бирок көлдөн өтпөйт.
Domestic flights unlocked|Открыты внутренние рейсы|Ички учак каттамдары ачылды
Build airports to fly over mountains and lakes. Plan connections to Osh, Bishkek, Karakol and Batken.|Стройте аэропорты, чтобы летать над горами и озёрами. Планируйте связи с Ошем, Бишкеком, Караколом и Баткеном.|Тоолордун жана көлдөрдүн үстүнөн учуу үчүн аэропорт куруңуз. Ош, Бишкек, Каракол жана Баткен менен байланышты пландаңыз.
Express coaches unlocked|Открыты экспресс-автобусы|Экспресс-автобустар ачылды
Express coaches are faster road vehicles. Kyrgyzstan has no high-speed railway in this game.|Экспресс-автобусы быстрее на дорогах. В этом мире нет скоростной железной дороги Кыргызстана.|Экспресс-автобустар жолдо тез жүрөт. Бул оюнда Кыргызстанда жогорку ылдамдыктагы темир жол жок.
Fog clears as Kyrgyzstan’s regions unlock. Mountain 4×4s arrive in round 6, northern trains in 8, tunnel shuttles in 10, flights in 13 and express coaches in 20. Hard mode introduces snow, wind and market crowds from round 3. Pan, zoom and use Fit map to explore.|Туман исчезает по мере открытия регионов. В раунде 6 появятся внедорожники, в 8 — северные поезда, в 10 — тоннели, в 13 — самолёты, в 20 — экспресс-автобусы. В сложном режиме с раунда 3 бывают снег, ветер и наплыв пассажиров. Двигайте и масштабируйте карту.|Аймактар ачылган сайын туман кетет. 6-айлампада 4×4, 8-де түндүк поезддери, 10-до тоннелдер, 13-дө учактар, 20-да экспресс-автобустар чыгат. Кыйын режимде 3-айлампадан тартып кар, шамал жана элдин көбөйүшү болот. Картаны жылдырып, чоңойтуп изилдеңиз.
Tap a stop for station upgrades and, later, airport construction. Tap a line colour for vehicle upgrades, spacing and extra vehicles. Use 4×4s over passes, tunnel shuttles through mountains and northern trains along the rail corridor. Follow the lakeshore; surface vehicles cannot cross lakes.|Нажмите остановку для улучшений и строительства аэропортов. Цвет линии открывает транспорт, интервалы и покупки. Используйте внедорожники на перевалах, шаттлы в тоннелях и поезда на севере. Наземный транспорт идёт по берегу, а не через озеро.|Бекетти басып жакшыртыңыз же аэропорт куруңуз. Каттамдын түсү унаа, аралык жана сатып алуу бөлүмүн ачат. Ашууда 4×4, тоодо тоннель, түндүктө поезд колдонуңуз. Жер үстүндөгү унаа көлдөн өтпөйт.
Glowing quiz coins appear during play. Tap one and answer a question about your newest area for 15 💷. The Country atlas button shows unlocked flags, capitals, landmarks and waterways. Reading pauses the game.|Во время игры появляются монеты. Нажмите и ответьте на вопрос о новом районе за 15 💷. Атлас показывает флаги, центры, достопримечательности и водоёмы. При чтении игра на паузе.|Оюнда монеталар пайда болот. Басып, жаңы аймак тууралуу суроого жооп берип, 15 💷 алыңыз. Атлас тууларды, борборлорду, көрүнүктүү жерлерди жана суу объектилерин көрсөтөт. Окуп жатканда оюн токтойт.
Glowing quiz coins appear during play. Tap one and answer a question about your newest area for 15 💷. The Regional atlas button shows unlocked flags, capitals, landmarks and waterways. Reading pauses the game.|Во время игры появляются монеты. Ответьте на вопрос о новом регионе за 15 💷. Атлас регионов показывает флаги, центры, достопримечательности и водоёмы. Чтение ставит игру на паузу.|Оюнда монеталар пайда болот. Жаңы аймак тууралуу суроого жооп берип, 15 💷 алыңыз. Аймактар атласы тууларды, борборлорду, көрүнүктүү жерлерди жана суу объектилерин көрсөтөт. Окуганда оюн токтойт.
Use shared stops to connect lines and keep transfers short.|Соединяйте линии на общих остановках, чтобы сократить пересадки.|Которулууну кыскартуу үчүн каттамдарды жалпы бекеттерде байланыштырыңыз.
Improve handling at your busiest interchange or shorten a long line.|Улучшите обслуживание на загруженной пересадке или сократите длинную линию.|Жүктөлгөн которулуу бекетин жакшыртыңыз же узун каттамды кыскартыңыз.
Station upgrades can cut boarding time on your busiest line.|Улучшения станций сокращают посадку на загруженной линии.|Бекетти жакшыртуу жүктөлгөн каттамдагы отургузуу убактысын азайтат.
Build airport|Построить аэропорт|Аэропорт куруу
Zoom in|Приблизить|Чоңойтуу
Zoom out|Отдалить|Кичирейтүү
Fit map|Вместить карту|Картаны толук көрсөтүү
Pan map|Переместить карту|Картаны жылдыруу
Zoom in for city and landmark labels|Приблизьте для подписей городов и достопримечательностей|Шаарлардын жана көрүнүктүү жерлердин аталыштарын көрүү үчүн чоңойтуңуз
North is up|Север вверху|Түндүк жогору жакта
Bus / trains: land · Boat: sea · Flight: air · Tunnel: Channel|Автобус и поезд: суша · Паром: море · Самолёт: воздух · Тоннель: Ла-Манш|Автобус жана поезд: кургактык · Кеме: деңиз · Учак: аба · Тоннель: Ла-Манш
Good job! Close the celebration to shop, or choose Continue for the next round.|Отлично! Закройте окно для покупок или продолжите к следующему раунду.|Азаматсыз! Сатып алуу үчүн терезени жабыңыз же кийинки айлампага өтүңүз.
Complete|Завершено|Бүттү
delivery|доставка|жеткирүү
Choose a benefit and a challenge|Выберите преимущество и испытание|Артыкчылык жана кыйынчылык тандаңыз
Choose one of three cards|Выберите одну из трёх карт|Үч картанын бирин тандаңыз
Choose a new stop or close the loop at the opposite end.|Выберите новую остановку или замкните кольцо на другом конце.|Жаңы бекетти тандаңыз же каттамдын башка учунда айланма түзүңүз.
This line is already a loop.|Эта линия уже кольцевая.|Бул каттам мурунтан айланма.
Remove a section to open the loop, then extend either end.|Удалите участок, чтобы разомкнуть кольцо, затем продлите любой конец.|Айланманы ачуу үчүн бөлүктү өчүрүп, анан каалаган учун узартыңыз.
This crosses|Это пересекает|Бул кесип өтөт
Bus routes cannot cross another road.|Автобусные маршруты не могут пересекать другую дорогу.|Автобус каттамы башка жолду кесип өтө албайт.
Marshrutka routes cannot cross another road.|Маршрутки не могут пересекать другую дорогу.|Маршрутка каттамы башка жолду кесип өтө албайт.
Connect through a shared stop, or sell and redraw that route.|Используйте общую остановку или удалите и перестройте маршрут.|Жалпы бекет аркылуу өтүңүз же каттамды өчүрүп кайра түзүңүз.
Extend from an end of your selected line.|Продлевайте от конца выбранной линии.|Тандалган каттамдын учунан узартыңыз.
Select a grey circle to create a new line.|Для новой линии выберите серый круг.|Жаңы каттам үчүн боз тегеректи тандаңыз.
This line is full.|Эта линия заполнена.|Бул каттам толду.
No route permits left this round.|В этом раунде закончились разрешения на маршруты.|Бул айлампада каттам куруу уруксаты бүттү.
Sell a route to free a permit.|Удалите маршрут, чтобы освободить разрешение.|Уруксат бошотуу үчүн каттамды өчүрүңүз.
Choose at least two different stops.|Выберите минимум две разные остановки.|Кеминде эки башка бекет тандаңыз.
No current card modifiers affect this vehicle.|На этот транспорт пока нет модификаторов карт.|Бул унаага азырынча карталардын таасири жок.
Each level adds one seat and 30% of base speed to every vehicle of this type. Colours and level badges show your upgrades.|Каждый уровень добавляет место и 30% базовой скорости всему транспорту этого типа. Цвет и значки показывают улучшения.|Ар бир деңгээл ушул түрдөгү унааларга бир орун жана негизги ылдамдыктын 30% кошот. Түс жана белгилер жакшыртууну көрсөтөт.
Bus upgrades cost 100, 300 and 900 base 💷. Save 💷 to invest in later levels.|Улучшения автобусов стоят 100, 300 и 900 💷. Копите на высокие уровни.|Автобусту жакшыртуу 100, 300 жана 900 💷 турат. Кийинки деңгээлдерге акча топтоңуз.
Marshrutka upgrades cost 100, 300 and 900 base 💷. Save 💷 to invest in later levels.|Улучшения маршруток стоят 100, 300 и 900 💷. Копите на высокие уровни.|Маршрутканы жакшыртуу 100, 300 жана 900 💷 турат. Кийинки деңгээлдерге акча топтоңуз.
You now have enough 💷 for another bus. Drag Oxford → Bristol. Passengers can transfer between routes to reach a stop farther away.|Теперь хватит 💷 на ещё один автобус. Перетащите Оксфорд → Бристоль. Пассажиры могут пересаживаться между линиями.|Эми дагы бир автобуска 💷 жетет. Оксфорд → Бристоль сүйрөңүз. Жүргүнчүлөр каттамдардын ортосунда которула алат.
You now have enough 💷 for another marshrutka. Drag Tokmok → Kant. Passengers can transfer between routes to reach a stop farther away.|Теперь хватит 💷 на ещё одну маршрутку. Перетащите Токмок → Кант. Пассажиры могут пересаживаться между линиями.|Эми дагы бир маршруткага 💷 жетет. Токмок → Кант сүйрөңүз. Жүргүнчүлөр каттамдардын ортосунда которула алат.
Press Play again. Deliver all five passengers to finish round 1. You can pause at any time to plan your network.|Нажмите «Играть» и доставьте всех пятерых пассажиров. Вы можете в любой момент поставить игру на паузу для планирования.|«Ойноо» баскычын басып, беш жүргүнчүнү жеткириңиз. Пландоо үчүн каалаган учурда оюнду токтото аласыз.
At round end choose one benefit and one challenge, each from three cards. Their effects last for the run. Queues that wait too long blink red: clear them before the countdown ends. You can close a line into a loop by joining its ends after at least three different stops. Removing a route refunds 100% of its construction cost, so you can rebuild freely; Retry restores the round-start budget.|После раунда выберите преимущество и испытание из трёх карт. Их эффекты действуют весь забег. Долгие очереди мигают красным: разгрузите их до конца отсчёта. Замкните линию с тремя остановками в кольцо. Удаление возвращает полную стоимость; повтор восстанавливает начальный бюджет раунда.|Айлампадан кийин үч картадан артыкчылык жана кыйынчылык тандаңыз. Таасири оюн бою сакталат. Узун кезек кызыл күйөт: убакыт бүтө электе азайтыңыз. Үч бекеттүү каттамды айланма кыла аласыз. Өчүрүлгөн каттамдын баасы толук кайтарылат; кайталоо айлампанын башындагы акчаны калыбына келтирет.
`;for(const row of extra.trim().split('\n')){const [en,ru,ky]=row.split('|');if(ky)registerTranslations(en,ru,ky);}
const rows=`
Connect places. Discover geography.|Соединяйте места. Изучайте географию.|Жерлерди байланыштырыңыз. Географияны үйрөнүңүз.
Islands · capitals · coastal connections|Острова · столицы · морские пути|Аралдар · борборлор · деңиз жолдору
Mountains · lakes · Silk Road journeys|Горы · озёра · Шёлковый путь|Тоолор · көлдөр · Жибек жолу
Valley connections|Связи между долинами|Өрөөндөрдүн байланышы
Deliver a passenger between different regions of Kyrgyzstan.|Доставьте пассажира между регионами Кыргызстана.|Жүргүнчүнү Кыргызстандын аймактарынын ортосунда жеткириңиз.
Mountain landscape|Горный ландшафт|Тоолуу аймак
Train station|Железнодорожная станция|Темир жол бекети
Ancient tower|Древняя башня|Байыркы мунара
City square|Городская площадь|Шаардын аянты
Mosque|Мечеть|Мечит
Petroglyphs|Петроглифы|Петроглифтер
Forest|Лес|Токой
Craft tradition|Ремесленная традиция|Кол өнөрчүлүк салты
Bridge|Мост|Көпүрө
Reservoir|Водохранилище|Суу сактагыч
Market|Рынок|Базар
Flowers|Цветы|Гүлдөр
Mountain pass snow|Снег на перевале|Ашуудагы кар
Mountain passes connect Kyrgyzstan’s valleys.|Перевалы соединяют долины Кыргызстана.|Ашуулар Кыргызстандын өрөөндөрүн байланыштырат.
Marshrutkas slow down for 24 seconds. Mountain 4×4s and tunnel shuttles keep moving.|Маршрутки замедляются на 24 секунды. Внедорожники и тоннельные шаттлы продолжают движение.|Маршруткалар 24 секундга жайлайт. 4×4 унаалар жана тоннель каттамдары жүрө берет.
Bishkek market crowds|Пассажиры у рынков Бишкека|Бишкектин базарларындагы эл
More passengers start in Bishkek for 24 seconds.|В течение 24 секунд больше пассажиров отправляются из Бишкека.|24 секунд бою Бишкектен көбүрөөк жүргүнчү чыгат.
Mountain wind warning|Предупреждение о горном ветре|Тоо шамалы тууралуу эскертүү
The Tien Shan shapes Kyrgyzstan’s weather.|Тянь-Шань влияет на погоду Кыргызстана.|Теңир-Тоо Кыргызстандын аба ырайына таасир этет.
Domestic flights slow down for 24 seconds.|Внутренние рейсы замедляются на 24 секунды.|Ички учак каттамдары 24 секундга жайлайт.
Trains use the northern rail corridor only.|Поезда используют только северный железнодорожный коридор.|Поезддер түндүк темир жол багытында гана жүрөт.
Tunnel shuttles need a route across a mountain pass.|Тоннельный шаттл должен пересекать горный перевал.|Тоннель каттамы тоо ашуусунан өтүшү керек.
This route crosses a lake or a mountain barrier.|Маршрут пересекает озеро или горный барьер.|Каттам көлдөн же тоо тосмосунан өтөт.
Follow the lakeshore through intermediate stops. Use a mountain 4×4 or build a tunnel for mountain passes.|Следуйте по берегу через промежуточные остановки. Для перевала используйте внедорожник или тоннель.|Көл жээги менен аралык бекеттер аркылуу жүрүңүз. Ашуу үчүн 4×4 унаа же тоннель колдонуңуз.
Planes need two airports.|Самолётам нужны два аэропорта.|Учактарга эки аэропорт керек.
Welcome, network builder!|Добро пожаловать, создатель сети!|Кош келиңиз, тармак куруучу!
Buy your first bus|Купите первый автобус|Биринчи автобусту сатып алыңыз
Buy your first marshrutka|Купите первую маршрутку|Биринчи маршруткаңызды сатып алыңыз
Start the service|Начните движение|Каттамды иштетиңиз
Earn your first fares|Получите первую выручку|Биринчи кирешени табыңыз
Connect Bristol|Соедините Бристоль|Бристолду байланыштырыңыз
Connect Kant|Соедините Кант|Кантты байланыштырыңыз
Finish your first round|Завершите первый раунд|Биринчи айлампаны бүтүрүңүз
Explore and learn|Исследуйте и учитесь|Изилдеңиз жана үйрөнүңүз
Upgrade your network|Улучшайте сеть|Тармакты жакшыртыңыз
Choose your cards|Выберите карты|Карталарыңызды тандаңыз
New to Coastal Connections?|Впервые играете в Coastal Connections?|Coastal Connections оюнун биринчи жолу ойноп жатасызбы?
Learn by building your first network.|Учитесь, создавая первую сеть.|Биринчи тармакты куруп үйрөнүңүз.
Start tutorial|Начать обучение|Үйрөтүүнү баштоо
Skip for now|Пока пропустить|Азырынча өткөрүү
Skip tutorial|Пропустить обучение|Үйрөтүүнү өткөрүү
Finish tutorial|Завершить обучение|Үйрөтүүнү бүтүрүү
Next|Далее|Кийинки
Got it|Понятно|Түшүнүктүү
LEARN BY PLAYING|УЧИМСЯ ИГРАЯ|ОЙНОП ҮЙРӨНҮҮ
GAME WALKTHROUGH|ОБЗОР ИГРЫ|ОЮН МЕНЕН ТААНЫШУУ
Your task|Ваша задача|Сиздин тапшырмаңыз
This step advances when you do the task.|Шаг завершится после выполнения задачи.|Тапшырманы аткарганда кийинки кадам ачылат.
Press Play|Нажмите «Играть»|«Ойноо» баскычын басыңыз
Deliver 3 passengers|Доставьте 3 пассажиров|3 жүргүнчү жеткириңиз
Drag London → Oxford|Перетащите Лондон → Оксфорд|Лондон → Оксфорд сүйрөңүз
Drag Bishkek → Tokmok|Перетащите Бишкек → Токмок|Бишкек → Токмок сүйрөңүз
Drag Oxford → Bristol|Перетащите Оксфорд → Бристоль|Оксфорд → Бристоль сүйрөңүз
Drag Tokmok → Kant|Перетащите Токмок → Кант|Токмок → Кант сүйрөңүз
Take passengers to any stop matching their small symbol. Circles and squares start the game; triangles join in round 3. A rarer shape joins every five rounds, starting in round 5. Open Shape filter to highlight matching cities and show them on the map. Connect stops and keep queues moving.|Доставляйте пассажиров к остановкам с нужной фигурой. Сначала есть круги и квадраты, в раунде 3 появятся треугольники. Начиная с раунда 5, каждые пять раундов добавляется редкая фигура. Фильтр фигур поможет найти нужные остановки. Соединяйте их и сокращайте очереди.|Жүргүнчүлөрдү алардын белгисине дал келген бекетке жеткириңиз. Башында тегерек жана чарчы бар; 3-айлампада үч бурчтук чыгат. 5-айлампадан тартып ар беш айлампада сейрек фигура кошулат. Фигура чыпкасы керектүү бекеттерди табууга жардам берет. Бекеттерди байланыштырып, кезекти азайтыңыз.
Press Play below the map. Each vehicle starts with one seat. Passengers get off first, then board one at a time. Each takes 0.5 seconds at a level-1 stop. Station upgrades make this faster.|Нажмите «Играть» под картой. Вначале у транспорта одно место. Пассажиры сначала выходят, потом садятся по одному. На станции уровня 1 каждому нужно 0,5 секунды. Улучшения станции ускоряют процесс.|Картанын астындагы «Ойноо» баскычын басыңыз. Ар бир унаа бир орун менен башталат. Адегенде жүргүнчүлөр түшөт, андан кийин бирден отурат. 1-деңгээлдеги бекетте ар бирине 0,5 секунд керек. Бекетти жакшыртуу муну тездетет.
The first grey line circle is selected. Choose Bus in the transport tray above it. Drag from London to Oxford, then release on the stop. This costs your starting 20 💷. On a keyboard, open London and choose “Build a route from here”, then Oxford.|Выбрана первая серая линия. Выберите автобус и перетащите маршрут от Лондона к Оксфорду. Это стоит начальные 20 💷. С клавиатуры откройте Лондон, выберите «Создать маршрут отсюда», затем Оксфорд.|Биринчи боз каттам тандалды. Автобусту тандап, Лондондон Оксфордго сүйрөңүз. Бул баштапкы 20 💷 турат. Баскычтоп менен Лондонду ачып, «Бул жерден каттам түзүү», анан Оксфордду тандаңыз.
The first grey line circle is selected. Choose Marshrutka in the transport tray above it. Drag from Bishkek to Tokmok, then release on the stop. This costs your starting 20 💷. On a keyboard, open Bishkek and choose “Build a route from here”, then Tokmok.|Выбрана первая серая линия. Выберите маршрутку и перетащите маршрут от Бишкека к Токмоку. Это стоит начальные 20 💷. С клавиатуры откройте Бишкек, выберите «Создать маршрут отсюда», затем Токмок.|Биринчи боз каттам тандалды. Маршрутканы тандап, Бишкектен Токмокко сүйрөңүз. Бул баштапкы 20 💷 турат. Баскычтоп менен Бишкекти ачып, «Бул жерден каттам түзүү», анан Токмокту тандаңыз.
The browser saves your language and world inside each journey.|Язык и мир сохраняются вместе с игрой.|Тил жана дүйнө оюн менен кошо сакталат.
Community grant|Грант сообщества|Коомдук грант
Bus dealership|Автобусный дилер|Автобус сатуучу
Rail partnership|Железнодорожное партнёрство|Темир жол өнөктөштүгү
Shipyard deal|Сделка с верфью|Кеме куруучунун сунушу
Off-road workshop|Мастерская внедорожников|4×4 унаалардын устаканасы
Airline partnership|Авиапартнёрство|Авиакомпания менен өнөктөштүк
Express buses|Экспресс-автобусы|Экспресс-автобустар
Green signals|Зелёные сигналы|Жашыл белгилер
Following wind|Попутный ветер|Жолдоочу шамал
All-terrain tyres|Внедорожные шины|Тоолук дөңгөлөктөр
Clear skies|Ясное небо|Ачык асман
Happy travellers|Счастливые пассажиры|Бактылуу жүргүнчүлөр
Queue barriers|Ограждения очередей|Кезек тосмолору
Comfortable stations|Удобные станции|Ыңгайлуу бекеттер
Safety staff|Сотрудники безопасности|Коопсуздук кызматкерлери
Building partnership|Строительное партнёрство|Курулуш өнөктөштүгү
Harbour builders|Строители гаваней|Порт куруучулар
Airport builders|Строители аэропортов|Аэропорт куруучулар
Reused materials|Повторное использование материалов|Материалдарды кайра колдонуу
Sponsor stars|Звёзды спонсора|Демөөрчүнүн жылдыздары
Network coordination|Координация сети|Тармакты координациялоо
Ferry benches|Места на паромах|Кемедеги орундар
Off-road seats|Места во внедорожниках|4×4 унаадагы орундар
Bus benches|Места в автобусах|Автобустагы орундар
Extra carriage|Дополнительный вагон|Кошумча вагон
Cabin refit|Обновление салона|Салонду жаңылоо
Expansion fund|Фонд расширения|Кеңейтүү фонду
Efficient planning|Эффективное планирование|Натыйжалуу пландоо
Covered shelters|Крытые остановки|Жабык бекеттер
Council tax|Местный налог|Жергиликтүү салык
Bus shortage|Нехватка автобусов|Автобус тартыштыгы
Steel shortage|Нехватка стали|Болот тартыштыгы
Hull shortage|Нехватка корпусов|Кеме корпусунун тартыштыгы
Tyre shortage|Нехватка шин|Дөңгөлөк тартыштыгы
Aircraft shortage|Нехватка самолётов|Учак тартыштыгы
Roadworks|Дорожные работы|Жол оңдоо
Track maintenance|Ремонт путей|Темир жол оңдоо
Headwind|Встречный ветер|Каршы шамал
Rough tracks|Неровные дороги|Тегиз эмес жолдор
Turbulence|Турбулентность|Турбуленттүүлүк
Discount tickets|Льготные билеты|Арзан билеттер
Tourist rush|Наплыв туристов|Туристтердин көбөйүшү
Commuter rush|Час пик|Тыгын маалы
Small platforms|Маленькие платформы|Кичинекей аянтчалар
Impatient crowds|Нетерпеливые пассажиры|Сабырсыз жүргүнчүлөр
Short alarms|Короткие сигналы тревоги|Кыска эскертүүлөр
Inspection fees|Плата за проверки|Текшерүү акысы
Building costs|Расходы на строительство|Курулуш чыгымы
Luxury upgrades|Дорогие улучшения|Кымбат жакшыртуулар
Permit fees|Плата за разрешения|Уруксат акысы
Fuel prices|Цены на топливо|Күйүүчү май баасы
Safety checks|Проверки безопасности|Коопсуздук текшерүүлөрү
Busy ports|Загруженные порты|Жүктөлгөн порттор
Busy mountain stops|Загруженные горные станции|Жүктөлгөн тоо бекеттери
Bus commuters|Автобусные пассажиры|Автобус жүргүнчүлөрү
Rail commuters|Железнодорожные пассажиры|Поезд жүргүнчүлөрү
Airport queues|Очереди в аэропортах|Аэропорт кезектери
Receive|Получите|Алыңыз
Pay|Заплатите|Төлөңүз
cost|стоят|баасы
costs|стоит|баасы
less|дешевле|арзан
more|дороже|кымбат
move|движутся|жүрөт
faster|быстрее|тезирээк
slower|медленнее|жайыраак
gains one seat|получает одно место|бир орун кошулат
Every|Каждый|Ар бир
routes|маршруты|каттамдар
All vehicles|Весь транспорт|Бардык унаалар
arrivals become|пассажиры появляются|жүргүнчүлөр пайда болот
add|добавьте|кошуңуз
passengers per round|пассажиров за раунд|айлампадагы жүргүнчү
seconds|секунд|секунд
patience|терпение|күтүү
queue space|место в очереди|кезектеги орун
alarms|сигналы тревоги|эскертүүлөр
sooner|раньше|эртерээк
capped at your balance|не больше вашего баланса|акчаңыздан ашпайт
per earned star|за полученную звезду|алынган жылдыз үчүн
station upgrades|улучшения станций|бекетти жакшыртуу
removed routes|удалённые маршруты|өчүрүлгөн каттамдар
full refund|полный возврат|толук кайтаруу
receive|получите|алыңыз
gain|получают|алат
one extra|один дополнительный|бир кошумча
trains|поезда|поезддер
buses|автобусы|автобустар
boats|паромы|кемелер
planes|самолёты|учактар
Learn geography to earn bonus 💷.|Изучайте географию, чтобы получать бонус 💷.|Кошумча 💷 табуу үчүн географияны үйрөнүңүз.
London is the capital of both England and the United Kingdom.|Лондон — столица Англии и Великобритании.|Лондон — Англиянын жана Улуу Британиянын борбору.
England, Wales and Scotland share the island of Great Britain.|Англия, Уэльс и Шотландия находятся на острове Великобритания.|Англия, Уэльс жана Шотландия Улуу Британия аралында жайгашкан.
The River Thames flows through London towards the North Sea.|Темза течёт через Лондон к Северному морю.|Темза Лондон аркылуу Түндүк деңизине агат.
Cardiff is the capital of Wales; its Welsh name is Caerdydd.|Кардифф — столица Уэльса; по-валлийски Caerdydd.|Кардифф — Уэльстин борбору; валлий тилинде Caerdydd.
Wales shares a land border with England and has a coast on the Irish Sea.|Уэльс граничит с Англией и имеет побережье Ирландского моря.|Уэльс Англия менен чектешет жана Ирланд деңизинин жээгине ээ.
Cardiff Castle stands in the heart of the Welsh capital.|Замок Кардифф находится в центре столицы Уэльса.|Кардифф сепили Уэльстин борборунун ортосунда жайгашкан.
Edinburgh is the capital of Scotland.|Эдинбург — столица Шотландии.|Эдинбург — Шотландиянын борбору.
Scotland occupies the northern part of Great Britain.|Шотландия занимает северную часть Великобритании.|Шотландия Улуу Британиянын түндүк бөлүгүн ээлейт.
Edinburgh Castle stands on Castle Rock, the remains of an ancient volcano.|Эдинбургский замок стоит на скале, остатке древнего вулкана.|Эдинбург сепили байыркы жанар тоодон калган аскада жайгашкан.
Belfast is the capital of Northern Ireland.|Белфаст — столица Северной Ирландии.|Белфаст — Түндүк Ирландиянын борбору.
Northern Ireland is part of the United Kingdom; the Republic of Ireland is a separate country.|Северная Ирландия входит в Великобританию; Республика Ирландия — отдельная страна.|Түндүк Ирландия Улуу Британияга кирет; Ирландия Республикасы — өзүнчө өлкө.
Northern Ireland and the Republic of Ireland share the same island.|Северная Ирландия и Республика Ирландия находятся на одном острове.|Түндүк Ирландия жана Ирландия Республикасы бир аралда жайгашкан.
Dublin is the capital of the Republic of Ireland.|Дублин — столица Республики Ирландия.|Дублин — Ирландия Республикасынын борбору.
The Irish Sea separates Ireland from Great Britain.|Ирландское море отделяет Ирландию от Великобритании.|Ирланд деңизи Ирландияны Улуу Британиядан бөлүп турат.
The Republic of Ireland shares a land border with Northern Ireland.|Республика Ирландия граничит с Северной Ирландией.|Ирландия Республикасы Түндүк Ирландия менен чектешет.
Paris is the capital of France, on the River Seine.|Париж — столица Франции на реке Сене.|Париж — Сена дарыясынын боюндагы Франциянын борбору.
The English Channel separates southern England from northern France.|Ла-Манш отделяет юг Англии от севера Франции.|Ла-Манш Англиянын түштүгүн Франциянын түндүгүнөн бөлөт.
The Channel Tunnel joins Folkestone in England to Coquelles, near Calais in France.|Тоннель под Ла-Маншем соединяет Фолкстон в Англии и Кокель во Франции, возле Кале.|Ла-Манш тоннели Англиядагы Фолкстонду Франциядагы Каленин жанындагы Кокель менен байланыштырат.
Brussels is the capital of Belgium.|Брюссель — столица Бельгии.|Брюссель — Бельгиянын борбору.
Belgium has a coast on the North Sea.|Бельгия имеет побережье Северного моря.|Бельгия Түндүк деңизинин жээгине ээ.
Amsterdam is the capital of the Netherlands; the government is based in The Hague.|Амстердам — столица Нидерландов; правительство находится в Гааге.|Амстердам — Нидерланддардын борбору; өкмөт Гаагада жайгашкан.
Amsterdam is famous for its network of canals.|Амстердам известен сетью каналов.|Амстердам каналдары менен белгилүү.
Berlin is the capital of Germany.|Берлин — столица Германии.|Берлин — Германиянын борбору.
The River Rhine flows through Germany towards the Netherlands.|Рейн течёт через Германию в Нидерланды.|Рейн Германия аркылуу Нидерланддарга агат.
Germany shares land borders with both Belgium and the Netherlands.|Германия граничит с Бельгией и Нидерландами.|Германия Бельгия жана Нидерланддар менен чектешет.
Clock tower and parliament buildings|Часовая башня и парламент|Саат мунарасы жана парламент имараттары
University library|Университетская библиотека|Университеттин китепканасы
Suspension bridge|Подвесной мост|Асма көпүрө
Public library|Публичная библиотека|Коомдук китепкана
Town hall|Ратуша|Шаардык башкаруу имараты
Castle|Замок|Сепил
Museum|Музей|Музей
Pier|Пирс|Пирс
University|Университет|Университет
Cathedral|Собор|Собор
Stone arch|Каменная арка|Таш арка
Road bridge|Автомобильный мост|Автожол көпүрөсү
Pedestrian bridge|Пешеходный мост|Жөө көпүрө
Medieval gateway|Средневековые ворота|Орто кылымдагы дарбаза
Iron tower|Железная башня|Темир мунара
Rail tunnel terminal|Железнодорожный тоннельный терминал|Темир жол тоннелинин бекети
Harbour promenade|Набережная гавани|Порттун жээгиндеги жол
Railway station|Железнодорожная станция|Темир жол бекети
Monumental gateway|Монументальные ворота|Монументалдуу дарбаза
Concert hall|Концертный зал|Концерт залы
Lighthouse|Маяк|Маяк
Sports stadium|Спортивный стадион|Спорт стадиону
Natural waterfall|Природный водопад|Табигый шаркыратма
Windmill|Ветряная мельница|Жел тегирмени
Aqueduct|Акведук|Акведук
Botanical garden|Ботанический сад|Ботаникалык бак
English-speaking world|англоязычный мир|англис тилдүү дүйнө
Being the oldest university in the English-speaking world|Старейший университет англоязычного мира|Англис тилдүү дүйнөдөгү эң байыркы университет
Cotton textiles|Хлопчатобумажные ткани|Пахта кездемелери
Canals|Каналы|Каналдар
An ancient volcanic rock|Древняя вулканическая скала|Байыркы жанар тоо аскасы
Granite|Гранит|Гранит
Copper|Медь|Жез
Atlantic Ocean|Атлантический океан|Атлантика океаны
Pacific Ocean|Тихий океан|Тынч океан
Mediterranean Sea|Средиземное море|Жер Ортолук деңизи
Baltic Sea|Балтийское море|Балтика деңизи
Manchester|Манчестер|Манчестер
Birmingham|Бирмингем|Бирмингем
Swansea|Суонси|Суонси
Bangor|Бангор|Бангор
Glasgow|Глазго|Глазго
Inverness|Инвернесс|Инвернесс
Aberdeen|Абердин|Абердин
Liverpool|Ливерпуль|Ливерпуль
Holyhead|Холихед|Холихед
Cork|Корк|Корк
Galway|Голуэй|Голуэй
Newcastle|Ньюкасл|Ньюкасл
Derry / Londonderry|Дерри / Лондондерри|Дерри / Лондондерри
Southampton|Саутгемптон|Саутгемптон
Coquelles|Кокель|Кокель
Folkestone|Фолкстон|Фолкстон
Lyon|Лион|Лион
Bordeaux|Бордо|Бордо
Antwerp|Антверпен|Антверпен
Ghent|Гент|Гент
Rotterdam|Роттердам|Роттердам
The Hague|Гаага|Гаага
Cologne|Кёльн|Кёльн
Hamburg|Гамбург|Гамбург
Big Ben|Биг-Бен|Биг-Бен
Big Ben and the Houses of Parliament|Биг-Бен и здание парламента|Биг-Бен жана парламент имараты
Stonehenge|Стоунхендж|Стоунхендж
Radcliffe Camera|Рэдклиффская камера|Рэдклифф камерасы
Clifton Suspension Bridge|Клифтонский подвесной мост|Клифтон асма көпүрөсү
Library of Birmingham|Библиотека Бирмингема|Бирмингемдин китепканасы
Manchester Town Hall|Ратуша Манчестера|Манчестердин башкаруу имараты
Cardiff Castle|Замок Кардифф|Кардифф сепили
National Waterfront Museum|Национальный музей набережной|Улуттук жээк музейи
Garth Pier|Пирс Гарт|Гарт пирси
Edinburgh Castle|Эдинбургский замок|Эдинбург сепили
University of Glasgow|Университет Глазго|Глазго университети
Inverness Castle|Замок Инвернесс|Инвернесс сепили
Marischal College|Колледж Маришаль|Маришаль колледжи
Royal Liver Building|Ройал Лайвер Билдинг|Ройал Лайвер имараты
Titanic Belfast|Титаник Белфаст|Титаник Белфаст
Ha’penny Bridge|Мост Полпенни|Полпенни көпүрөсү
Tyne Bridge|Мост Тайн|Тайн көпүрөсү
Peace Bridge|Мост Мира|Тынчтык көпүрөсү
Bargate|Баргейт|Баргейт
Eiffel Tower|Эйфелева башня|Эйфель мунарасы
Atomium|Атомиум|Атомиум
Brandenburg Gate|Бранденбургские ворота|Бранденбург дарбазасы
Cologne Cathedral|Кёльнский собор|Кёльн собору
Elbphilharmonie|Эльбская филармония|Эльба филармониясы
White Cliffs of Dover|Белые скалы Дувра|Дуврдын ак аскалары
Lake District|Озёрный край|Көлдөр аймагы
Eryri / Snowdonia|Эрири / Сноудония|Эрири / Сноудония
Loch Ness|Лох-Несс|Лох-Несс
Ben Nevis|Бен-Невис|Бен-Невис
Giant's Causeway|Дорога гигантов|Алптардын жолу
Cliffs of Moher|Скалы Мохер|Мохер аскалары
Dutch windmills|Нидерландские ветряные мельницы|Нидерланддардын жел тегирмендери
Mont-Saint-Michel|Мон-Сен-Мишель|Мон-Сен-Мишель
Build your first network, then unlock new regions.|Создайте первую сеть и открывайте новые регионы.|Биринчи тармакты куруп, жаңы аймактарды ачыңыз.
`;for(const row of rows.trim().split('\n')){const [en,ru,ky]=row.split('|');if(ky)registerTranslations(en,ru,ky);}
