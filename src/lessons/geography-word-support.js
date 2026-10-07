// Language support accompanies, rather than replaces, the English definition.
const rows=`
Physical geography|自然地理|Физическая география
Human geography|人文地理|Общественная география
Interaction|相互作用|Взаимодействие
Atlas|地图集|Атлас
Compass|指南针|Компас
Scale|比例尺|Масштаб
Observation|观察|Наблюдение
Evidence|证据|Доказательства
Enquiry|探究|Исследование
Land use|土地利用|Землепользование
Industry|产业|Промышленность
Change|变化|Изменение
Identify|指出名称|Назвать
Describe|描述|Описать
Explain|解释|Объяснить
Claim|论断|Утверждение
Reasoning|推理|Обоснование
Route|路线|Маршрут
Constraint|限制条件|Ограничение
Preference|偏好|Предпочтение
Map|地图|Карта
Survey|测量调查|Съёмка местности
Layer|图层|Слой
Plan|平面图|План
Symbol|符号|Условный знак
Mental map|心理地图|Ментальная карта
Landmark|地标|Ориентир
Aerial view|俯视图|Вид сверху
Key|图例|Легенда карты
Easting|东向坐标|Координата по горизонтали
Northing|北向坐标|Координата по вертикали
Grid reference|网格坐标|Координаты по сетке
Distance|距离|Расстояние
Unit|单位|Единица измерения
Ordnance Survey|英国国家测绘局|Национальная картографическая служба Великобритании
Contour|等高线|Горизонталь
Relief|地形|Рельеф
Gradient|坡度|Уклон
Latitude|纬度|Широта
Longitude|经度|Долгота
Equator|赤道|Экватор
United Kingdom|英国（联合王国）|Соединённое Королевство
Great Britain|大不列颠|Великобритания
Island|岛屿|Остров
Boundary|边界|Граница
Region|区域|Регион
Physical feature|自然地理特征|Природный объект
Weather|天气|Погода
Climate|气候|Климат
Rainfall|降雨|Дождевые осадки
Population|人口|Население
Community|社区|Сообщество
Diversity|多样性|Разнообразие
Settlement|聚落|Поселение
Urban|城市的|Городской
Rural|乡村的|Сельский
Quality of life|生活质量|Качество жизни
Indicator|指标|Показатель
Average|平均值|Среднее значение
Capital|首都|Столица
Function|功能|Функция
Connection|联系|Связь
Import|进口|Импорт
Export|出口|Экспорт
Trade|贸易|Торговля
Glaciation|冰川作用|Оледенение
Ice sheet|冰盖|Ледниковый щит
Glacier|冰川|Ледник
Accumulation|积累|Накопление
Ablation|消融|Абляция
Plucking|拔蚀|Ледниковое выламывание
Abrasion|磨蚀|Истирание
Erosion|侵蚀|Эрозия
U-shaped valley|U形谷|Троговая долина
Hanging valley|悬谷|Висячая долина
Truncated spur|截断山嘴|Срезанный отрог
Corrie|冰斗|Кар
Arête|刃脊|Острый гребень
Pyramidal peak|角峰|Пирамидальная вершина
Deposition|沉积|Отложение наносов
Till|冰碛物|Несортированные ледниковые отложения
Moraine|冰碛|Морена
Glacial landscape|冰川地貌|Ледниковый ландшафт
Tourism|旅游|Туризм
Conservation|保护|Охрана природы
Meltwater|融水|Талая вода
Storage|储存|Запас воды
Water balance|水量平衡|Водный баланс
Source|河源|Исток
Tributary|支流|Приток
Mouth|河口|Устье
Evaporation|蒸发|Испарение
Condensation|凝结|Конденсация
Precipitation|降水|Осадки
Drainage basin|流域|Речной бассейн
Watershed|分水岭|Водораздел
Discharge|流量|Расход воды
Transportation|搬运|Перенос наносов
Meander|河曲|Меандр
Floodplain|洪泛平原|Пойма
Oxbow lake|牛轭湖|Старица
Supply|供给|Доступный объём
Demand|需求|Потребность
Allocation|分配|Распределение
Estuary|河口湾|Эстуарий
Navigation|航行|Судоходство
Dredging|疏浚|Дноуглубление
Flood|洪水|Наводнение
Runoff|地表径流|Поверхностный сток
Infiltration|下渗|Инфильтрация
Cause|原因|Причина
Impact|影响|Последствие
Response|应对|Меры реагирования
Flood defence|防洪措施|Защита от наводнений
Warning|预警|Предупреждение
Risk|风险|Риск
`;
export const geographyWordSupport=Object.fromEntries(rows.trim().split('\n').map(row=>{const [term,zh,ru]=row.split('|');return [term,{zh,ru}];}));
