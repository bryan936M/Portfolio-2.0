# Globe geography

The original globe uses Natural Earth’s public-domain vector data, retrieved 2026-11-21. [Terms of use](https://www.naturalearthdata.com/about/terms-of-use/).

- Coastlines: [Natural Earth 1:110m land](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson), rounded to four decimal places in `src/content/globe-land.json`.
- Country names and label coordinates: [Natural Earth 1:50m countries](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson). `src/content/african-countries.json` contains the 54 African sovereign countries, including Mauritius and Seychelles (classified as ocean islands in the source’s continent field). Country label coordinates are geographic display anchors, not claims about a specific city or workplace.

`npm run prepare:globe` triangulates the checked-in coastlines, subdivides long triangle edges before projecting onto the sphere, adds shallow coastline walls, and prepares the corresponding orthographic SVG path. The camera faces longitude 20°, latitude 4°. Its prepared outputs are `public/models/work-globe.json` and `src/content/globe-shape.json`. Builds and browsers require no map API or external geographic requests.

The visual references inform material and movement only. No Framer component code or Zeam artwork is redistributed.
