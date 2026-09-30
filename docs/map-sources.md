# UK map source

The UK map uses Natural Earth **1:50m Admin 0 map units**, including separate outlines for England, Scotland, Wales and Northern Ireland. Ireland and the Isle of Man are neutral context, not part of the UK. Coastlines and boundaries are generalized for this classroom scale.

- Dataset: https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-details/
- Source GeoJSON: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_map_units.geojson
- Natural Earth terms: https://www.naturalearthdata.com/about/terms-of-use/ (public domain)

Coordinates are projected with longitude scaled at 56° north and rounded to 0.1 SVG units. The resulting paths are bundled locally in `src/uk-map-paths.js`; there is no runtime map service or network dependency. The same renderer supplies classroom, enlarged and student-study maps.

## Classroom atlas and postcards

The new classroom atlas also bundles Natural Earth **1:110m Admin 0 countries** for the World and Europe views. Source: [Natural Earth countries](https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/), [GeoJSON](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson). The data is public domain under the terms linked above. Coastlines are generalised; the maps are location references, not navigation maps.

To rebuild, download that GeoJSON to `output/ne-countries.geojson`, then run `node scripts/build-atlas.mjs`. Generated paths are in `src/atlas-paths.js`. World uses equirectangular coordinates; Europe scales longitude and latitude separately for a regional view. Switching views changes geographical extent, not a fixed printed ratio or an area comparison. No network requests occur during lessons.

City markers are approximate classroom locations. The optional Highlands region and Thames course are schematic overlays on the geographic coastline and are labelled as approximate. The postcard pictures are original vector illustrations (clock tower, castle, hill and crane), not photographs or precise architectural drawings.
