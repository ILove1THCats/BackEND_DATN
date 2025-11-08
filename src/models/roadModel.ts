// RouteService.ts
import pool from "../config/db.js";

export async function findRoute(x1: number, y1: number, x2: number, y2: number) {
  const query = `
    SELECT json_build_object(
      'type', 'FeatureCollection',
      'features', json_agg(ST_AsGeoJSON(t.geom)::json)
    ) AS geojson
    FROM (
      SELECT geom FROM pgr_fromAtoB('roads', $1, $2, $3, $4)
    ) AS t;
  `;
  const result = await pool.query(query, [x1, y1, x2, y2]);
  return result.rows[0].geojson;
}
