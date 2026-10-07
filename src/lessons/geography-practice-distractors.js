// Common confusions, rather than unrelated joke answers, for binary retrieval.
const rows=`
1.1|Road|River valley|A mountain described without any human activity|A farm belongs only to human geography, even though soil and water affect it.
1.2|A photograph with no location labels|A ruler|The north arrow|5 with no unit
1.3|Door A is always slower.|Why do people choose different doors throughout the whole year?|Use a longer counting period at only one door.|Door A had 8 waiting pupils.
1.4|River Thames|Opening in 1781|The recorded opening date.|Assume that a bridge alone explains every later change.
1.5|Give a reason for the feature.|They are beside the road because customers pass there.|There are houses.|Adding facts about a different place.
1.6|12|Every shop is at the stop.|This proves the stop caused every shop.|The recorded near-shop count.
1.7|B|1,000 m|Distance alone, without checking access.|A is best for everyone because it is shortest.
2.1|A solely because it is older|Every difference proves that one map is wrong.|Both must show every bus stop.|Only the map's title, without its date or purpose.
2.2|3 m|160 cm|120 cm|Using a different scale for each feature.
2.3|A guaranteed exact survey.|One map must be wrong if landmarks differ.|That the pupils selected features.|Count the landmarks instead of measuring the route.
2.4|West|South|The north arrow|To preserve every detail at its original size.
2.5|4523|234562|Northing|An exact point rather than a whole grid square.
2.6|4 m|300 m|1,000 m|Measure the straight line between the start and finish.
2.7|25 m|50 m|A peak by assumption|The same letter must always have the same meaning on every map.
2.8|A line joining places with the same rainfall.|100 to 120 m over 100 m.|180 m|A flatter slope.
2.9|A|A|Latitude 20°N.|They locate the same thing as four-figure local grid references.
3.1|Scotland|Irish Sea|Off its south-east coast
3.2|Mountain heights|A national border|East
3.3|22 mm|West|One rainy morning only
3.4|20|Every UK resident|Everyone in a community shares the same interests.
3.5|A|A|The map proves why every house was built.
3.6|B|A|Higher average income proves everyone has a better life.
3.7|River Severn|Displaying paintings|They guarantee every resident visits a museum.
3.8|An export from the UK|Shipping fruit boxes|Every international link moves only goods.
4.1|An exact ice age date|Present-day temperature alone|Some valleys show signs of past ice.
4.2|−3 units|Where annual ice losses always exceed gains|+3 units
4.3|Plucking|Dropping material|Rock carried by ice scratches bedrock.
4.4|A|Deposition alone widens the whole valley.|The view from directly above
4.5|U-shaped valley|Truncated spur|Broaden the ridge by depositing all eroded rock on its top.
4.6|Scraping and removing rock|Only sand sorted into equal-sized grains|Only fine sediment sorted by a river
4.7|A narrow V-shaped cross-section|60|It covers all seasons.
4.8|Only flowing liquid water|Only communities beside the glacier snout|Whether ice is mentioned
5.1|Mouth|The point where a river enters the sea|Irish Sea
5.2|Liquid becoming vapour|Surface runoff|Condensation alone
5.3|Upper|10 m|Every river is exactly 20 m wide.
5.4|Deposition|Deposition|Erosion
5.5|Only the inner bank|A tarn formed by a glacier|A watershed ridge
5.6|Only household drinking|The largest user is always the only one that matters.|Allocate every available unit to one group.
5.7|At every river source|River erosion alone|Dredging and construction cannot affect living things.
5.8|More infiltration into dry soil|Heavy rain falls.|Equal rain always creates equal flood impacts.
5.9|Heavy rain at the start of the event|All upstream rainfall flooding|Flood damage can continue after water falls.
5.10|Wall and warnings|Prevent water from reaching every property|The same defence works equally well at every site.
`;
export const practiceDistractors=Object.fromEntries(rows.trim().split('\n').map(row=>{const [code,...answers]=row.split('|');return [code,answers];}));
