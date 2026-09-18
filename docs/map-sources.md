# UK map source

The UK map uses Natural Earth **1:50m Admin 0 map units**, including separate outlines for England, Scotland, Wales and Northern Ireland. Ireland and the Isle of Man are neutral context, not part of the UK. Coastlines and boundaries are generalized for this classroom scale.

- Dataset: https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-details/
- Source GeoJSON: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_map_units.geojson
- Natural Earth terms: https://www.naturalearthdata.com/about/terms-of-use/ (public domain)

Coordinates are projected with longitude scaled at 56° north and rounded to 0.1 SVG units. The resulting paths are bundled locally in `src/uk-map-paths.js`; there is no runtime map service or network dependency. The same renderer supplies classroom, enlarged and student-study maps.
