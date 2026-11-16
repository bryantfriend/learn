# River map sources

The Thames, Severn, Trent, Wye, Tay, Shannon, Seine, Loire, Garonne, Rhine, Elbe and Naryn centre lines come from Natural Earth's public-domain 1:10 million river datasets, simplified to 0.0025 degrees and rounded to four decimal places.

- https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/
- https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_rivers_lake_centerlines.geojson
- https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_rivers_europe.geojson

Clyde and Liffey are approximate classroom-scale courses; Chuy, Talas and Ak-Buura retain the game's approximate location anchors. These smaller rivers are not survey-grade traces. All rivers are rendered as smoothed centre lines with cartographically exaggerated widths for readability, clipped to the currently unlocked land boundaries. Lake centre-line segments in the source connect river courses through reservoirs. Source geometry is stored in `src/coastal-river-data.js`.
