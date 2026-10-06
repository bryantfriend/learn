# Coastal Connections: geography map

The map uses a north-up equirectangular game projection. Longitude/latitude positions are real approximate city locations. Country outlines are simplified; transport lines are schematic player-built connections, not a representation of actual roads, railways, service frequencies or ticket prices. High-speed trains in the game are fictional network options. The Channel Tunnel service is restricted to Folkestone and Coquelles, near Calais.

## Progression

England rounds 1–3; Wales 4; Scotland 6; regular trains 8; Northern Ireland and the Republic of Ireland, with four starting harbours, 10; airport construction and four starting airports 13; France 16; Channel Tunnel trains 18; Belgium 19; high-speed trains 20; Netherlands 22; Germany 25. Cities continue opening through round 27. Players can build additional harbours at marked coastal stops and airports at any unlocked stop once the respective transport unlocks. Cities on Great Britain share one land network, cities on the island of Ireland another, and the continental countries share a third. Northern Ireland is in the UK; the Republic of Ireland is a separate country.

The map starts focused on England. Other countries are under mist; their names, capitals, landmarks and stops become available on their unlock round. Fit map includes the revealed country extents; pan and zoom support closer inspection. Landmark labels appear when zoomed in. Every country has three short discovery facts. One seeded fact is shown below the benefit and challenge cards for the upcoming area; it stays the same between both picks and after reopening. On other rounds a known country's fact is shown. Cards for unavailable transport are excluded from offers until that transport is about to unlock.

## Boundary data and attribution

`src/coastal-boundaries.js` contains simplified exterior rings derived from:

- **United Kingdom country boundaries:** Eurostat / European Commission, distributed by [geoBoundaries GBR ADM1](https://github.com/wmgeolab/geoBoundaries/tree/main/releaseData/gbOpen/GBR/ADM1), boundary year 2021, CC BY 4.0. Credit: Eurostat, European Commission; geoBoundaries (William & Mary geoLab). Changes: simplified vertices, removed interior holes, rounded coordinates.
- **Republic of Ireland:** © OpenStreetMap contributors, Wambacher, distributed by [geoBoundaries IRL ADM0](https://github.com/wmgeolab/geoBoundaries/tree/main/releaseData/gbOpen/IRL/ADM0), boundary year 2017. [Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/). The adapted Ireland coordinate database remains under ODbL 1.0 and is supplied in source in `regionShapes.ireland`; it can be extracted independently. Changes: simplified vertices, removed interior holes, rounded coordinates. [OSM copyright](https://www.openstreetmap.org/copyright).
- **France, Belgium, Netherlands and Germany:** [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/), 1:110m administrative countries, public domain. Overseas polygons excluded. Source [natural-earth-vector](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson).

The collection preserves the individual licences above. Regenerate with `scripts/build-coastal-geography.cjs` after downloading the documented GeoJSONs to output/uk-regions.geojson, output/ireland-border.geojson and output/europe-countries.geojson. These ignored downloads are not runtime dependencies.

## Fact references

Facts are original concise summaries of stable map relationships and destination information. Supporting references:

- [VisitBritain](https://www.visitbritain.com/en/destinations), [English Heritage: Stonehenge](https://www.english-heritage.org.uk/visit/places/stonehenge/).
- [Visit Wales: Cardiff](https://www.visitwales.com/destinations/south-wales/cardiff), [Wales.com: castles](https://www.wales.com/visit/visiting-wales/castles-wales).
- [VisitScotland: Edinburgh](https://www.visitscotland.com/places-to-go/edinburgh), [Edinburgh Castle](https://www.edinburghcastle.scot/).
- [Tourism Ireland destinations](https://www.ireland.com/en/destinations/where-to-go/).
- [LeShuttle terminals](https://www.leshuttle.com/uk-en/eurotunnel), [Visit Brussels](https://www.visit.brussels/en/visitors), [Holland.com](https://www.holland.com/global/tourism), [Germany Travel: Berlin](https://www.germany.travel/en/cities-culture/berlin.html).

No claims about current transport availability, opening hours or fares are used in the classroom facts.
