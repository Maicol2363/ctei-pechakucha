// Builds data/cundinamarca-map.js: the 116 municipal outlines of Cundinamarca joined to DANE's 2022 FIES estimates.
// Inputs are local files (nothing is downloaded here):
//   --geo        geoBoundaries gbOpen COL ADM2 simplified GeoJSON (build 9469f09; DANE MGN 2020 boundaries, CC BY 4.0)
//   --divipola   DIVIPOLA for cod_dpto 25 from datos.gov.co (dataset gdxc-w37w); each municipal seat must fall in exactly one polygon
//   --estimates  JSON extracted from DANE's anex-FIES-Municipal-2022.xlsx (Cuadro 1) for department 25
//   --out        output module (default data/cundinamarca-map.js)
// Boundaries and estimates come from different products. They are joined only by the DANE municipal code (cod_mpio).
import { readFile, writeFile } from 'node:fs/promises'

const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback }
const geo = JSON.parse(await readFile(arg('geo'), 'utf8'))
const divipola = JSON.parse(await readFile(arg('divipola'), 'utf8'))
const estimates = new Map(JSON.parse(await readFile(arg('estimates'), 'utf8')).map(row => [row.c, row]))
const out = arg('out', new URL('../data/cundinamarca-map.js', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const WIDTH = 520, TOL = 0.3

const polys = g => g.type === 'Polygon' ? [g.coordinates] : g.coordinates
const inRing = (x, y, ring) => {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x1, y1] = ring[i], [x2, y2] = ring[j]
    if ((y1 > y) !== (y2 > y) && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) inside = !inside
  }
  return inside
}
const contains = (g, x, y) => polys(g).some(p => inRing(x, y, p[0]) && !p.slice(1).some(h => inRing(x, y, h)))
const num = s => Number(String(s).replace(',', '.'))

const chosen = new Map()
for (const m of divipola) {
  const x = num(m.longitud), y = num(m.latitud)
  const hit = geo.features.filter(f => contains(f.geometry, x, y))
  if (hit.length !== 1) throw new Error(`${m.cod_mpio} ${m.nom_mpio}: ${hit.length} polygons contain the seat`)
  chosen.set(m.cod_mpio, hit[0])
}
if (chosen.size !== 116 || new Set(chosen.values()).size !== 116) throw new Error('Expected 116 distinct polygons')
const bogota = geo.features.find(f => /^bogot/i.test(f.properties.shapeName))

const all = [...chosen.values()].flatMap(f => polys(f.geometry).flatMap(p => p[0]))
const lon0 = Math.min(...all.map(p => p[0])), lon1 = Math.max(...all.map(p => p[0]))
const lat0 = Math.min(...all.map(p => p[1])), lat1 = Math.max(...all.map(p => p[1]))
const k = Math.cos(((lat0 + lat1) / 2) * Math.PI / 180)
const S = WIDTH / ((lon1 - lon0) * k)
const project = ([lon, lat]) => [(lon - lon0) * k * S, (lat1 - lat) * S]

function rdp(points, tolerance) {
  if (points.length < 3) return points
  const keep = new Array(points.length).fill(false)
  keep[0] = keep[points.length - 1] = true
  const stack = [[0, points.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    const [ax, ay] = points[a], [bx, by] = points[b]
    const dx = bx - ax, dy = by - ay, length = Math.hypot(dx, dy) || 1e-9
    let worst = 0, at = -1
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * (points[i][0] - ax) - dx * (points[i][1] - ay)) / length
      if (d > worst) { worst = d; at = i }
    }
    if (worst > tolerance && at > 0) { keep[at] = true; stack.push([a, at], [at, b]) }
  }
  return points.filter((_, i) => keep[i])
}
const area = ring => Math.abs(ring.reduce((s, p, i) => { const q = ring[(i + 1) % ring.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)) / 2
const f1 = n => String(Math.round(n * 10) / 10)
function toPath(g) {
  let d = '', sx = 0, sy = 0, sa = 0
  for (const poly of polys(g)) {
    for (const ring of poly) {
      let r = ring.map(project)
      if (r.length > 1 && r[0][0] === r.at(-1)[0] && r[0][1] === r.at(-1)[1]) r = r.slice(0, -1)
      r = rdp(r, TOL)
      if (r.length < 3 || area(r) < 1) continue
      d += 'M' + r.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L') + 'Z'
      if (ring === poly[0]) {
        const a = area(r)
        sa += a; sx += r.reduce((s, p) => s + p[0], 0) / r.length * a; sy += r.reduce((s, p) => s + p[1], 0) / r.length * a
      }
    }
  }
  return { d, x: Math.round(sx / sa), y: Math.round(sy / sa) }
}

// DANE Figure 20 classes: below 20%, 20-30%, 30-40%, 40-60%, above 60%. Estimates with cvlog > 30% are not
// published in the figure (class 5, 'Sin estimacion'), so their value is not carried into the data module.
const band = value => value < 0.2 ? 0 : value < 0.3 ? 1 : value < 0.4 ? 2 : value < 0.6 ? 3 : 4
const municipalities = divipola.map(m => {
  const row = estimates.get(m.cod_mpio)
  if (!row) throw new Error(`No DANE estimate row for ${m.cod_mpio}`)
  return { c: m.cod_mpio, n: row.n, ...toPath(chosen.get(m.cod_mpio).geometry), k: row.flag ? 5 : band(row.e), q: row.flag ? 1 : 0 }
})
const height = Math.ceil((lat1 - lat0) * S)
const data = {
  w: WIDTH,
  h: height,
  m: municipalities,
  bogota: bogota && toPath(bogota.geometry),
  proj: { lon0, lon1, lat0, lat1, k, S },
}
const header = `/* Generated by scripts/build-map.mjs. Do not edit by hand.
   Boundaries: DANE Marco Geoestadistico Nacional (2020) via geoBoundaries gbOpen COL ADM2, CC BY 4.0.
   Municipal codes and seats: DIVIPOLA, datos.gov.co dataset gdxc-w37w (department 25, 116 municipalities).
   Estimates: DANE, FIES Municipal 2022, annex Cuadro 1 (small area estimation). k = Figure 20 class (5 = no estimate published), q = 1 when cvlog > 30%.
   Bogota, D. C. is not one of the 116 and is drawn separately. */
`
await writeFile(out, `${header}export const cundinamarca = ${JSON.stringify(data)}\n`)
const flagged = municipalities.filter(m => m.q).map(m => m.n)
const counts = [0, 1, 2, 3, 4, 5].map(i => municipalities.filter(m => m.k === i).length)
console.log(`${out}: 116 municipalities, viewBox ${data.w}x${data.h}, classes ${counts}, flagged ${flagged}`)
