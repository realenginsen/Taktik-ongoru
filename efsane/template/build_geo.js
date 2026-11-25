// world-atlas (Natural Earth 50m) -> geo.js : GEO=[{id,n,p:[[lon,lat,...flat]]}]
const topo = require('world-atlas/countries-50m.json');
const { feature } = require('topojson-client');
const fc = feature(topo, topo.objects.countries);
const out = [];
for (const f of fc.features) {
  const g = f.geometry; if (!g) continue;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  const p = [];
  for (const poly of polys) {
    const ring = poly[0]; if (ring.length < 8) continue;
    const flat = []; let lx = 1e9, ly = 1e9;
    for (const [x, y] of ring) { if (Math.abs(x - lx) + Math.abs(y - ly) < 0.08) continue; flat.push(+x.toFixed(2), +y.toFixed(2)); lx = x; ly = y; }
    if (flat.length >= 8) p.push(flat);
  }
  out.push({ id: f.id, n: f.properties.name, p });
}
require('fs').writeFileSync('geo.js', 'const GEO=' + JSON.stringify(out) + ';\n');
console.log(out.length, require('fs').statSync('geo.js').size);
