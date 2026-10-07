import {registerTranslations} from './coastal-i18n.js';
const rows=`
Belgium shares borders with France, the Netherlands, Germany and Luxembourg.|Бельгия граничит с Францией, Нидерландами, Германией и Люксембургом.|Бельгия Франция, Нидерланддар, Германия жана Люксембург менен чектешет.
The Netherlands borders the North Sea, Belgium and Germany.|Нидерланды граничат с Северным морем, Бельгией и Германией.|Нидерланддар Түндүк деңиз, Бельгия жана Германия менен чектешет.
Amsterdam is famous for its network of canals.|Амстердам славится своей сетью каналов.|Амстердам каналдар тармагы менен белгилүү.
Close quiz ×|Закрыть вопрос ×|Суроону жабуу ×
Close atlas ×|Закрыть атлас ×|Атласты жабуу ×
Close station ×|Закрыть станцию ×|Бекетти жабуу ×
Close upgrades ×|Закрыть улучшения ×|Жакшыртууларды жабуу ×
St Cybi’s Church|Церковь Святого Киби|Ыйык Киби чиркөөсү
St Fin Barre’s Cathedral|Собор Святого Финбарра|Ыйык Финбарр собору
Spanish Arch|Испанская арка|Испан аркасы
Channel Tunnel terminal|Терминал тоннеля под Ла-Маншем|Ла-Манш тоннелинин терминалы
Folkestone Harbour Arm|Мол гавани Фолкстона|Фолкстон портунун тосмосу
Basilica of Notre-Dame de Fourvière|Базилика Нотр-Дам-де-Фурвьер|Нотр-Дам-де-Фурвьер базиликасы
Place de la Bourse|Биржевая площадь|Биржа аянты
Antwerp Central Station|Центральный вокзал Антверпена|Антверпендин борбордук вокзалы
Gravensteen|Гравенстен|Гравенстен
Amsterdam’s canal houses|Дома у каналов Амстердама|Амстердамдын канал жээгиндеги үйлөрү
Erasmus Bridge|Мост Эразма|Эразм көпүрөсү
Binnenhof and Ridderzaal|Бинненхоф и Риддерзал|Бинненхоф жана Риддерзал
Giant’s Causeway|Дорога гигантов|Алптардын жолу
County Antrim|Графство Антрим|Антрим графтыгы
County Clare|Графство Клэр|Клэр графтыгы
Southampton Water|Залив Саутгемптон-Уотер|Саутгемптон-Уотер булуңу
Clyde|Клайд|Клайд
Severn|Северн|Северн
River Severn|Река Северн|Северн дарыясы
Kinderdijk windmills|Мельницы Киндердейка|Киндердейк жел тегирмендери
Near Rotterdam|Около Роттердама|Роттердамдын жанында
North Channel|Северный пролив|Түндүк кысык
Belfast Lough|Белфаст-Лох|Белфаст-Лох
Bristol Channel|Бристольский залив|Бристоль булуңу
Luxembourg|Люксембург|Люксембург
Near Fort William|Около Форт-Уильяма|Форт-Уильямдын жанында
County Down|Графство Даун|Даун графтыгы
County Kerry|Графство Керри|Керри графтыгы
Normandy|Нормандия|Нормандия
South-west Netherlands|Юго-запад Нидерландов|Нидерланддардын түштүк-батышы
Western Germany|Западная Германия|Батыш Германия
The English Channel|Ла-Манш|Ла-Манш
The River Seine|Река Сена|Сена дарыясы
Titanic|Титаник|Титаник
Mayflower|Мейфлауэр|Мейфлауэр
Santa Maria|Санта-Мария|Санта-Мария
A country of the United Kingdom, on the island of Great Britain.|Страна в составе Великобритании, на острове Великобритания.|Улуу Британия аралындагы Улуу Британиянын курамындагы өлкө.
A country of the United Kingdom, west of England on Great Britain.|Страна в составе Великобритании, к западу от Англии.|Англиянын батышындагы Улуу Британиянын курамындагы өлкө.
A country of the United Kingdom in the northern part of Great Britain.|Страна в составе Великобритании, на севере острова.|Аралдын түндүгүндөгү Улуу Британиянын курамындагы өлкө.
Part of the United Kingdom, on the island of Ireland. It shares a land border with the Republic of Ireland.|Часть Великобритании на острове Ирландия. Имеет сухопутную границу с Республикой Ирландия.|Ирландия аралындагы Улуу Британиянын бөлүгү. Ирландия Республикасы менен кургактык чек арасы бар.
An independent country on the island of Ireland, sharing a border with Northern Ireland.|Независимая страна на острове Ирландия, граничит с Северной Ирландией.|Ирландия аралындагы өз алдынча өлкө, Түндүк Ирландия менен чектешет.
A country in mainland Europe, across the English Channel from England.|Страна на материке Европы, через Ла-Манш от Англии.|Европа материгиндеги өлкө, Англиядан Ла-Манш аркылуу бөлүнөт.
A country in mainland Europe, between France, the Netherlands and Germany, also bordering Luxembourg.|Страна в Европе между Францией, Нидерландами и Германией, также граничит с Люксембургом.|Европада Франция, Нидерланддар жана Германиянын ортосундагы өлкө, Люксембург менен да чектешет.
A country in mainland Europe, bordering Belgium and Germany.|Страна в Европе, граничит с Бельгией и Германией.|Европада Бельгия жана Германия менен чектешкен өлкө.
A country in mainland Europe, bordering the Netherlands, Belgium and France among other neighbours.|Страна в Европе, граничит с Нидерландами, Бельгией, Францией и другими странами.|Европада Нидерланддар, Бельгия, Франция жана башка өлкөлөр менен чектешкен өлкө.
The Union Flag is shown because Northern Ireland is part of the UK; it has no separate official national flag.|Показан британский флаг: Северная Ирландия входит в Великобританию и не имеет отдельного официального национального флага.|Британ желеги көрсөтүлгөн: Түндүк Ирландия Улуу Британияга кирет жана өзүнчө расмий улуттук желеги жок.
The famous bell inside the clock tower beside the Houses of Parliament.|Знаменитый колокол в часовой башне рядом с парламентом.|Парламенттин жанындагы саат мунарасынын белгилүү коңгуроосу.
A prehistoric stone circle: an example of a human-made landmark.|Доисторический каменный круг — достопримечательность, созданная человеком.|Байыркы таш тегереги — адам жасаган көрүнүктүү жер.
Chalk cliffs overlooking the English Channel towards France.|Меловые скалы с видом на Ла-Манш в сторону Франции.|Франция тарапка Ла-Маншты караган бор аскалары.
A landscape of lakes and mountains in north-west England.|Озёра и горы на северо-западе Англии.|Англиянын түндүк-батышындагы көлдөр жана тоолор.
A castle in the capital with layers of history stretching back to Roman times.|Замок в столице с историей, уходящей в римскую эпоху.|Борбордогу тарыхы Рим дооруна жеткен сепил.
A national park known for its mountain landscapes.|Национальный парк с горными пейзажами.|Тоо ландшафттары менен белгилүү улуттук парк.
A medieval castle beside the estuary of the River Conwy.|Средневековый замок у устья реки Конуи.|Конуи дарыясынын куймасындагы орто кылымдагы сепил.
A castle on Castle Rock, the remains of an ancient volcano.|Замок на Касл-Рок — остатке древнего вулкана.|Байыркы жанар тоонун калдыгы Касл-Роктогу сепил.
A long freshwater lake; loch is a Scottish word for a lake.|Длинное пресноводное озеро; «лох» по-шотландски означает озеро.|Узун тузсуз көл; шотландча «лох» көл дегенди билдирет.
The highest mountain in the United Kingdom.|Самая высокая гора Великобритании.|Улуу Британиянын эң бийик тоосу.
A coastal landscape of basalt columns formed through volcanic activity.|Прибрежные базальтовые колонны, образованные вулканической деятельностью.|Жанар тоо аракетинен түзүлгөн жээктеги базальт мамычалары.
A museum exploring the story of the Titanic and the city where it was built.|Музей истории «Титаника» и города, где его построили.|«Титаниктин» жана ал курулган шаардын тарых музейи.
Mountains in south-eastern Northern Ireland.|Горы на юго-востоке Северной Ирландии.|Түндүк Ирландиянын түштүк-чыгышындагы тоолор.
High sea cliffs on the Atlantic coast.|Высокие морские скалы на побережье Атлантики.|Атлантика жээгиндеги бийик деңиз аскалары.
A university in the capital, home to the Book of Kells.|Университет в столице, где хранится Келлская книга.|Борбордогу Келлс китеби сакталган университет.
A coastal route around the Iveragh Peninsula.|Прибрежный маршрут вокруг полуострова Айверах.|Айверах жарым аралын айланган жээк каттамы.
An iron tower and a famous landmark of the French capital.|Железная башня — известный символ французской столицы.|Франциянын борборунун белгилүү темир мунарасы.
An abbey and settlement on a tidal island.|Аббатство и поселение на приливном острове.|Суунун көтөрүлүшүнө байланышкан аралдагы монастырь жана конуш.
An art museum beside the River Seine.|Художественный музей у реки Сены.|Сена дарыясынын жанындагы көркөм өнөр музейи.
A building with large connected spheres, inspired by the structure of an iron crystal.|Здание из соединённых сфер, вдохновлённое кристаллом железа.|Темир кристаллына окшоштурулуп, чоң шарлардан бириктирилген имарат.
A historic square surrounded by decorated buildings.|Историческая площадь среди украшенных зданий.|Кооздолгон имараттар курчаган тарыхый аянт.
Waterways running through a historic city.|Водные пути через исторический город.|Тарыхый шаар аркылуу өткөн суу жолдору.
Windmills used in managing water and draining the land.|Ветряные мельницы для управления водой и осушения земли.|Сууну башкаруу жана жерди кургатуу үчүн жел тегирмендери.
A network of waterways through the capital.|Сеть водных путей через столицу.|Борбор аркылуу өткөн суу жолдорунун тармагы.
Dams and barriers built to help protect land from flooding.|Дамбы и барьеры для защиты земли от наводнений.|Жерди суу ташкынынан коргогон тосмолор жана дамбалар.
A monumental gateway in the German capital.|Монументальные ворота в немецкой столице.|Германиянын борборундагы монументалдык дарбаза.
A large Gothic cathedral beside the Rhine.|Большой готический собор у Рейна.|Рейндин жанындагы чоң готикалык собор.
A river landscape with castles, towns and vineyards.|Речной пейзаж с замками, городами и виноградниками.|Сепилдер, шаарлар жана жүзүм бактары бар дарыя ландшафты.
A prehistoric stone circle in Wiltshire: a human-made landmark.|Доисторический каменный круг в Уилтшире, созданный человеком.|Уилтширдеги адам жасаган байыркы таш тегереги.
Chalk cliffs on the English Channel, facing towards France.|Меловые скалы на Ла-Манше, обращённые к Франции.|Ла-Маншта Францияны караган бор аскалары.
A national park in north Wales known for its mountain landscapes.|Национальный парк горных пейзажей на севере Уэльса.|Уэльстин түндүгүндөгү тоолору менен белгилүү улуттук парк.
A long freshwater lake in the Scottish Highlands. Loch is a Scottish word for a lake.|Длинное пресноводное озеро Шотландского нагорья. «Лох» означает озеро.|Шотландиянын тоолуу аймагындагы узун тузсуз көл. «Лох» көл дегенди билдирет.
Basalt columns formed through volcanic activity on the coast of Northern Ireland.|Базальтовые колонны вулканического происхождения на побережье Северной Ирландии.|Түндүк Ирландия жээгиндеги жанар тоодон түзүлгөн базальт мамычалары.
High sea cliffs on the Atlantic coast of the Republic of Ireland.|Высокие скалы на атлантическом побережье Республики Ирландия.|Ирландия Республикасынын Атлантика жээгиндеги бийик аскалар.
An abbey and settlement on a tidal island in Normandy.|Аббатство и поселение на приливном острове Нормандии.|Нормандиядагы суу көтөрүлгөндө аралга айланган жердеги монастырь жана конуш.
The windmills at Kinderdijk help manage water and drain low-lying land.|Мельницы Киндердейка помогают управлять водой и осушать низины.|Киндердейктин жел тегирмендери сууну башкарып, ойдуң жерди кургатат.
Tap a stop for station upgrades and, later, harbour or airport construction. Tap your selected line colour again and choose Vehicle upgrades for its stats and fleet upgrades. Extra seats and speed help you clear queues. Select a coloured circle, then tap it again for line stats and upgrades. Drag from either end of a selected land line to extend it; select a grey circle to build another line. Use Plan a line to order several stops for one vehicle.|Нажмите остановку для улучшений и строительства порта или аэропорта. Повторное нажатие цвета линии открывает статистику и улучшения транспорта. Места и скорость сокращают очереди. Продлевайте линию от любого конца; для новой выберите серый круг. Планировщик позволяет выбрать несколько остановок для одной машины.|Бекетти басып жакшыртыңыз же порт, аэропорт куруңуз. Каттам түсүн кайра басып, унаа маалыматтарын жана жакшыртууларын ачыңыз. Орун жана ылдамдык кезекти азайтат. Каттамды каалаган четинен узартыңыз; жаңысы үчүн боз тегерек тандаңыз. Пландоочу бир унаага бир нече бекет тандаганга жардам берет.
Fog clears as new countries unlock. Trains arrive in round 8, ferries in 10, flights in 13, Channel Tunnel trains in 18 and high-speed trains in 20. Choose Normal or Hard when starting. Hard adds temporary geography events from round 3 with advance warnings. Use zoom, Fit map and drag the water to pan. Come back to Tutorial whenever you need help.|Туман исчезает при открытии стран. Поезда появляются в раунде 8, паромы в 10, самолёты в 13, тоннель под Ла-Маншем в 18, скоростные поезда в 20. Выберите обычный или сложный режим. В сложном с раунда 3 появляются события с предупреждениями. Масштабируйте карту и перетаскивайте воду. При необходимости откройте обучение.|Өлкөлөр ачылганда туман кетет. Поезд 8-айлампада, кеме 10до, учак 13тө, Ла-Манш тоннели 18де, ылдам поезд 20да чыгат. Кадимки же татаал режим тандаңыз. Татаал режимде 3-айлампадан эскертүүлүү окуялар чыгат. Картанын масштабын өзгөртүп, сууну сүйрөңүз. Керек болсо үйрөтүүнү ачыңыз.
London is the capital of which two places?|Столицей каких двух территорий является Лондон?|Лондон кайсы эки жердин борбору?
England and the United Kingdom|Англии и Великобритании|Англиянын жана Улуу Британиянын
Wales and France|Уэльса и Франции|Уэльстин жана Франциянын
Scotland and Belgium|Шотландии и Бельгии|Шотландиянын жана Бельгиянын
What is the University of Oxford especially known for?|Чем особенно известен Оксфордский университет?|Оксфорд университети эмнеси менен белгилүү?
Being the oldest university in the English-speaking world|Старейший университет англоязычного мира|Англис тилдүү дүйнөдөгү эң эски университет
Being a sea port|Морской порт|Деңиз порту
Being built inside a volcano|Построен внутри вулкана|Жанар тоонун ичинде курулган
What does Clifton Suspension Bridge cross?|Над чем проходит Клифтонский подвесной мост?|Клифтон асма көпүрөсү эмненин үстүнөн өтөт?
The Avon Gorge|Ущелье Эйвон|Эйвон капчыгайы
Which waterways helped move industrial goods around Birmingham?|Какие водные пути помогали перевозить промышленные товары в Бирмингеме?|Бирмингемде өнөр жай товарларын ташууга кайсы суу жолдору жардам берген?
Ocean straits|Океанские проливы|Океан кысыктары
Glaciers|Ледники|Мөңгүлөр
Which industry helped Manchester grow during the Industrial Revolution?|Какая отрасль помогла Манчестеру вырасти во время промышленной революции?|Өнөр жай революциясында Манчестердин өсүшүнө кайсы тармак жардам берген?
Cotton textiles|Хлопчатобумажные ткани|Пахта кездемелери
Tropical banana farming|Выращивание тропических бананов|Тропикалык банан өстүрүү
Pearl diving|Добыча жемчуга|Бермет издөө
Which metal industry gave Swansea the nickname Copperopolis?|Производство какого металла дало Суонси прозвище Копперополис?|Кайсы металлды өндүрүү Суонсиге Копперополис атын берген?
Copper|Медь|Жез
Gold|Золото|Алтын
Silver|Серебро|Күмүш
Which island is across the Menai Strait from Bangor?|Какой остров находится через пролив Менай от Бангора?|Бангордон Менай кысыгынын ары жагында кайсы арал бар?
Anglesey|Англси|Англси
Sicily|Сицилия|Сицилия
Iceland|Исландия|Исландия
What natural feature is beneath Edinburgh Castle?|Какой природный объект находится под Эдинбургским замком?|Эдинбург сепилинин астында кандай табигый түзүлүш бар?
An ancient volcanic rock|Древняя вулканическая скала|Байыркы жанар тоо аскасы
A coral reef|Коралловый риф|Коралл рифи
A sand dune|Песчаная дюна|Кум дөңсөөсү
Which country is home to the University of Glasgow?|В какой стране находится Университет Глазго?|Глазго университети кайсы өлкөдө?
Which nearby lake feeds the River Ness?|Какое озеро питает реку Несс?|Несс дарыясына кайсы жакынкы көл суу берет?
Lake Geneva|Женевское озеро|Женева көлү
Lake Garda|Озеро Гарда|Гарда көлү
Which stone gives Aberdeen its Granite City nickname?|Какой камень дал Абердину прозвище Гранитный город?|Кайсы таш Абердинге Гранит шаар атын берген?
Granite|Гранит|Гранит
Chalk|Мел|Бор
Marble|Мрамор|Мрамор
Which famous band formed in Liverpool?|Какая известная группа появилась в Ливерпуле?|Ливерпулда кайсы белгилүү топ түзүлгөн?
On which island is Holyhead located?|На каком острове находится Холихед?|Холихед кайсы аралда?
Holy Island, beside Anglesey|Холи-Айленд, рядом с Англси|Англсинин жанындагы Холи-Айленд
Isle of Wight|Остров Уайт|Уайт аралы
Isle of Skye|Остров Скай|Скай аралы
Which famous ship was built in Belfast?|Какой известный корабль построили в Белфасте?|Белфастта кайсы белгилүү кеме курулган?
Which country has Dublin as its capital?|Столицей какой страны является Дублин?|Дублин кайсы өлкөнүн борбору?
What forms an island around the centre of Cork?|Что образует остров вокруг центра Корка?|Корктун борборун курчаган аралды эмне түзөт?
Two channels of the River Lee|Два рукава реки Ли|Ли дарыясынын эки нугу
Two arms of the River Rhine|Два рукава Рейна|Рейн дарыясынын эки нугу
Which ocean is beside Galway Bay?|Какой океан омывает залив Голуэй?|Голуэй булуңу кайсы океанда?
Atlantic Ocean|Атлантический океан|Атлантика океаны
Pacific Ocean|Тихий океан|Тынч океан
Indian Ocean|Индийский океан|Инд океаны
Which part of England is Newcastle upon Tyne in?|В какой части Англии находится Ньюкасл-апон-Тайн?|Ньюкасл-апон-Тайн Англиянын кайсы бөлүгүндө?
North-east|Северо-восток|Түндүк-чыгыш
South-west|Юго-запад|Түштүк-батыш
South-east|Юго-восток|Түштүк-чыгыш
Which historic feature surrounds the old city of Derry?|Что окружает старый город Дерри?|Дерринин эски шаарын кайсы тарыхый түзүлүш курчайт?
City walls|Городские стены|Шаар дубалдары
A glacier|Ледник|Мөңгү
From which English port did Titanic begin its 1912 maiden voyage?|Из какого английского порта «Титаник» отправился в первый рейс в 1912 году?|«Титаник» 1912-жылы биринчи сапарын Англиянын кайсы портунан баштаган?
Which famous art museum is in Paris?|Какой известный художественный музей находится в Париже?|Парижде кайсы белгилүү көркөм өнөр музейи бар?
Louvre|Лувр|Лувр
Coquelles is at which end of the Channel Tunnel?|У какого конца тоннеля под Ла-Маншем находится Кокель?|Кокель Ла-Манш тоннелинин кайсы четинде?
French end|Французский конец|Франция тарабында
Welsh end|Валлийский конец|Уэльс тарабында
Scottish end|Шотландский конец|Шотландия тарабында
Folkestone connects to France through which railway link?|Какой железнодорожный путь соединяет Фолкстон с Францией?|Фолкстон Францияга кайсы темир жол аркылуу байланышат?
Channel Tunnel|Тоннель под Ла-Маншем|Ла-Манш тоннели
Gotthard Tunnel|Готардский тоннель|Готард тоннели
Severn Tunnel|Севернский тоннель|Северн тоннели
Which two rivers meet in Lyon?|Какие две реки встречаются в Лионе?|Лиондо кайсы эки дарыя кошулат?
Rhône and Saône|Рона и Сона|Рона жана Сона
Thames and Clyde|Темза и Клайд|Темза жана Клайд
Rhine and Liffey|Рейн и Лиффи|Рейн жана Лиффи
Which product is the Bordeaux region famous for?|Каким продуктом славится регион Бордо?|Бордо аймагы кайсы азыгы менен белгилүү?
Wine|Вино|Шарап
Coffee beans|Кофейные зёрна|Кофе дандары
Cocoa beans|Какао-бобы|Какао дандары
The Atomium is inspired by the structure of which material?|Строение какого материала вдохновило создателей Атомиума?|Атомиум кайсы заттын түзүлүшүнө окшоштурулган?
Iron crystal|Кристалл железа|Темир кристаллы
A snowflake|Снежинка|Кар бүртүгү
A seashell|Морская раковина|Деңиз кабыгы
Antwerp is famous for trading which gemstones?|Торговлей какими драгоценными камнями известен Антверпен?|Антверпен кайсы асыл таштардын соодасы менен белгилүү?
Diamonds|Алмазы|Алмаздар
Opals|Опалы|Опалдар
Emeralds|Изумруды|Зымырыттар
Which two rivers meet in Ghent?|Какие две реки встречаются в Генте?|Гентте кайсы эки дарыя кошулат?
Scheldt and Leie|Шельда и Лейе|Шельда жана Лейе
Seine and Thames|Сена и Темза|Сена жана Темза
Clyde and Ness|Клайд и Несс|Клайд жана Несс
Which city houses the Dutch government, although Amsterdam is the capital?|В каком городе находится правительство Нидерландов, хотя столица — Амстердам?|Борбор Амстердам болсо да, Нидерланддардын өкмөтү кайсы шаарда?
Which transport role is Rotterdam especially known for?|Какой транспортной ролью особенно известен Роттердам?|Роттердам транспортто кайсы ролу менен белгилүү?
Major sea port|Крупный морской порт|Ири деңиз порту
Mountain ski resort|Горнолыжный курорт|Тоо лыжа курорту
Desert caravan stop|Караванная стоянка в пустыне|Чөлдөгү кербен аялдамасы
Which national government is based in The Hague?|Правительство какой страны находится в Гааге?|Гаагада кайсы өлкөнүн өкмөтү жайгашкан?
Which barrier once divided Berlin?|Какое сооружение когда-то разделяло Берлин?|Берлинди мурда кайсы тосмо бөлүп турган?
Berlin Wall|Берлинская стена|Берлин дубалы
Hadrian’s Wall|Вал Адриана|Адриан дубалы
Great Wall of China|Великая Китайская стена|Улуу Кытай дубалы
Which architectural style is Cologne Cathedral known for?|В каком архитектурном стиле построен Кёльнский собор?|Кёльн собору кайсы архитектуралык стилде?
Gothic|Готический|Готикалык
Modern glass skyscraper|Современный стеклянный небоскрёб|Заманбап айнек асман тиреген имарат
Ancient Greek temple|Древнегреческий храм|Байыркы грек храмы
How does the Elbe help Hamburg’s transport connections?|Как Эльба помогает транспортным связям Гамбурга?|Эльба Гамбургдун транспорттук байланышына кандай жардам берет?
It connects the port towards the North Sea|Соединяет порт с Северным морем|Портту Түндүк деңизге байланыштырат
It connects directly to the Pacific Ocean|Напрямую соединяет с Тихим океаном|Түз Тынч океанга байланыштырат
It is a desert road|Это дорога в пустыне|Бул чөл жолу
River Thames|Река Темза|Темза дарыясы
River Cherwell|Река Чаруэлл|Чаруэлл дарыясы
River Avon|Река Эйвон|Эйвон дарыясы
River Irwell|Река Эрвелл|Эрвелл дарыясы
River Taff|Река Таф|Таф дарыясы
River Tawe|Река Тауэ|Тауэ дарыясы
Menai Strait|Пролив Менай|Менай кысыгы
Water of Leith|Река Уотер-оф-Лит|Уотер-оф-Лит дарыясы
River Clyde|Река Клайд|Клайд дарыясы
River Ness|Река Несс|Несс дарыясы
River Dee|Река Ди|Ди дарыясы
River Mersey|Река Мерси|Мерси дарыясы
River Lagan|Река Лаган|Лаган дарыясы
River Liffey|Река Лиффи|Лиффи дарыясы
River Lee|Река Ли|Ли дарыясы
River Corrib|Река Корриб|Корриб дарыясы
River Tyne|Река Тайн|Тайн дарыясы
River Foyle|Река Фойл|Фойл дарыясы
River Seine|Река Сена|Сена дарыясы
River Rhône|Река Рона|Рона дарыясы
River Garonne|Река Гаронна|Гаронна дарыясы
River Senne|Река Сенна|Сенна дарыясы
River Scheldt|Река Шельда|Шельда дарыясы
River Leie (Lys)|Река Лейе (Лис)|Лейе (Лис) дарыясы
River Amstel|Река Амстел|Амстел дарыясы
Nieuwe Maas|Ньиве-Маас|Ньиве-Маас
River Spree|Река Шпрее|Шпрее дарыясы
River Rhine|Река Рейн|Рейн дарыясы
River Elbe|Река Эльба|Эльба дарыясы
River Amazon|Река Амазонка|Амазонка дарыясы
River Nile|Река Нил|Нил дарыясы
Mediterranean Sea|Средиземное море|Жер Ортолук деңиз
Canals|Каналы|Каналдар
Clock tower and parliament buildings|Часовая башня и здания парламента|Саат мунарасы жана парламент имараттары
University library|Университетская библиотека|Университет китепканасы
Suspension bridge|Подвесной мост|Асма көпүрө
Public library|Публичная библиотека|Коомдук китепкана
Town hall|Ратуша|Шаардык башкаруу имараты
Castle|Замок|Сепил
Museum|Музей|Музей
Pier|Пирс|Пирс
University|Университет|Университет
University building|Здание университета|Университет имараты
Waterfront office building|Офисное здание на набережной|Жээктеги кеңсе имараты
Church|Церковь|Чиркөө
Pedestrian bridge|Пешеходный мост|Жөө адамдар көпүрөсү
Cathedral|Собор|Собор
Stone arch|Каменная арка|Таш арка
Road bridge|Автомобильный мост|Унаа көпүрөсү
Medieval gateway|Средневековые ворота|Орто кылымдагы дарбаза
Iron tower|Железная башня|Темир мунара
Rail tunnel terminal|Терминал железнодорожного тоннеля|Темир жол тоннелинин терминалы
Harbour promenade|Набережная гавани|Порттун жээк сейил жолу
Basilica|Базилика|Базилика
Historic square|Историческая площадь|Тарыхый аянт
Atom-shaped building|Здание в форме атома|Атом сымал имарат
Railway station|Железнодорожный вокзал|Темир жол вокзалы
Canal-side houses|Дома у каналов|Канал жээгиндеги үйлөр
Bridge|Мост|Көпүрө
Government buildings|Правительственные здания|Өкмөт имараттары
Monumental gateway|Монументальные ворота|Монументалдык дарбаза
Concert hall|Концертный зал|Концерт залы
Explore|Изучите|Изилдеңиз
on Wikipedia to learn more.|на Википедии, чтобы узнать больше.|тууралуу Википедиядан көбүрөөк окуңуз.
is a|— это|бул
in|в|жеринде
North ↑|Север ↑|Түндүк ↑
All|Все|Баары
New|Новая|Жаңы
Choose transport, then drag|Выберите транспорт и перетащите маршрут|Унааны тандап, каттамды сүйрөңүз
delivered|доставлено|жеткирилди
Choose one benefit|Выберите преимущество|Артыкчылык тандаңыз
Choose one challenge|Выберите испытание|Кыйынчылык тандаңыз
Current fleet|Текущий парк|Учурдагы парк
Map|Карта|Карта
Capital|Столица|Борбор
flag|флаг|желек
Atlas|Атлас|Атлас
Quiz|Викторину|Суроону
countries|страны|өлкөлөр
regions|регионы|аймактар
station|станцию|бекетти
route|маршрут|каттам
vehicles|транспорт|унаалар
seconds|секунд|секунд
left|осталось|калды
Chuy|Чу|Чүй
Naryn|Нарын|Нарын
Talas|Талас|Талас
Ak-Buura|Ак-Буура|Ак-Буура
Too-Ashuu|Тоо-Ашуу|Төө-Ашуу
Dolon|Долон|Долон
Ala-Bel|Ала-Бель|Ала-Бел
Taldyk|Талдык|Талдык
Coral reefs|Коралловые рифы|Коралл рифтери
Sea coast|Морское побережье|Деңиз жээги
Mountains|Горы|Тоолор
regional centre|областной центр|облустун борбору
Landmarks|Достопримечательности|Көрүнүктүү жерлер
Human-made landmark|Создано человеком|Адам жасаган көрүнүктүү жер
Natural landmark|Природная достопримечательность|Табигый көрүнүктүү жер
Close landmark notebook ×|Закрыть дневник достопримечательностей ×|Көрүнүктүү жерлер күндөлүгүн жабуу ×
Landmark notebook|Дневник достопримечательностей|Көрүнүктүү жерлер күндөлүгү
Which landscape shapes transport in Kyrgyzstan?|Какой ландшафт определяет транспорт Кыргызстана?|Кыргызстандын транспортуна кайсы ландшафт таасир берет?
What is the regional centre of|Как называется областной центр|Облустун борбору кайсы
Which landscape belongs on|Какой ландшафт указан на карточке города|Кайсы ландшафт бул жерге таандык
’s geography card?|на географической карточке?|географиялык картасында?
North|Север|Түндүк
River|Река|Дарыя
Look for|Найдите|Табыңыз
Build a route from here|Создать маршрут отсюда|Бул жерден каттам түзүү
Close round review ×|Закрыть обзор раунда ×|Айлампанын жыйынтыгын жабуу ×
stops|остановки|бекеттер
seats|места|орундар
speed|скорость|ылдамдык
Level|Уровень|Деңгээл
PATIENT PASSENGERS|ТЕРПЕЛИВЫЕ ПАССАЖИРЫ|САБЫРДУУ ЖҮРГҮНЧҮЛӨР
Explore the regions you have unlocked. Play pauses while you read.|Изучайте открытые регионы. При чтении игра приостанавливается.|Ачылган аймактарды изилдеңиз. Окуганда оюн токтойт.
Your geography atlas|Ваш географический атлас|Географиялык атласыңыз
Interesting facts|Интересные факты|Кызыктуу маалыматтар
Landmarks to remember|Достопримечательности для запоминания|Эсте калчу көрүнүктүү жерлер
Waterways|Водные пути|Суу жолдору
Read on Wikipedia ↗|Читать в Википедии ↗|Википедиядан окуу ↗
Correct|Верно|Туура
One answer · Correct = +15 💷. No penalty for an incorrect answer.|Один ответ · Правильно = +15 💷. За ошибку штрафа нет.|Бир жооп · Туура = +15 💷. Ката жоопко айып жок.
The country’s mountain passes are simplified gameplay barriers, not real road-engineering plans.|Перевалы упрощены для игры и не являются проектами реальных дорог.|Ашуулар оюн үчүн жөнөкөйлөтүлгөн, бул чыныгы жол долбоору эмес.
`;
for(const line of rows.trim().split('\n')){const [en,ru,ky]=line.split('|');registerTranslations(en,ru,ky);}
