import pool from "../config/db.js";

///////////////////////////////////////
// Bộ công cụ thao tác dữ liệu của bảng tourist_places
///////////////////////////////////////

export interface Place {
  id: number;
  geom: string; // dạng WKT hoặc GeoJSON string khi insert/update
  fid: number;
  full_id: string;
  osm_id: string;
  osm_type: string;
  amenity: string;
  opening_hours: string;
  brand_wikidata: string;
  brand: string;
  operator: string;
  name: string;
  path: string;
}

/**
 * Lấy toàn bộ địa điểm du lịch
 * @returns Promise<Place[]> - Danh sách tất cả địa điểm
 */
export const getAllPlaces = async (): Promise<Place[]> => {
  const result = await pool.query(`SELECT * FROM places ORDER BY place_id ASC`);
  return result.rows;
};

/**
 * Lấy theo thứ đang tìm cafe, hotel, v.v....
 * @param amenity - địa điểm cần
 * @return 
 */
export const getSpecificPlace = async (amenity: string): Promise<Place[]> => {
  const result = await pool.query(
  `SELECT ST_X(geom) AS long, ST_Y(geom) AS lat FROM places where amenity = $1`, [amenity]);

  return result.rows;
}

export const amenityType = async (): Promise<Place[]> => {
  const result = await pool.query(`SELECT distinct amenity FROM places `);

  return result.rows;
}

/**
 * Lấy địa điểm theo ID
 * @param id - ID địa điểm
 * @returns Promise<Place | null>
 */
export const getPlaceById = async (id: number): Promise<Place | null> => {
  const result = await pool.query(
    `SELECT * FROM places WHERE place_id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Tạo địa điểm mới
 */
//TODO: Chưa ổn định
export const createPlace = async (
  name: string,
  description: string,
  address: string,
  type_id: number,
  region_id: number,
  created_by: number,
  geom: string // ví dụ: 'POINT(105.123 21.456)'
): Promise<Place> => {
  const result = await pool.query(
    `INSERT INTO places 
        (name, description, address, type_id, region_id, created_by, geom)
     VALUES ($1, $2, $3, $4, $5, $6, ST_GeomFromText($7, 4326))
     RETURNING *`,
    [name, description, address, type_id, region_id, created_by, geom]
  );
  return result.rows[0];
};

/**
 * Cập nhật địa điểm
 */
//TODO: Chưa ổn định
export const updatePlace = async (
  id: number,
  name?: string,
  description?: string,
  address?: string,
  type_id?: number,
  region_id?: number,
  geom?: string
): Promise<Place | null> => {
  const result = await pool.query(
    `UPDATE places
     SET name = COALESCE($2, name),
         description = COALESCE($3, description),
         address = COALESCE($4, address),
         type_id = COALESCE($5, type_id),
         region_id = COALESCE($6, region_id),
         geom = COALESCE(ST_GeomFromText($7, 4326), geom),
         updated_at = NOW()
     WHERE place_id = $1
     RETURNING *`,
    [id, name, description, address, type_id, region_id, geom]
  );
  return result.rows[0] || null;
};

/**
 * Xoá địa điểm
 */
export const deletePlace = async (id: number): Promise<Place | null> => {
  const result = await pool.query(
    `DELETE FROM places WHERE place_id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Lấy địa điểm kèm trung bình rating
 */
//TODO: Chưa ổn định
export const getPlaceWithAverageRating = async (
  placeId: number
): Promise<Place & { avg_rating: number; total_reviews: number } | null> => {
  const result = await pool.query(
    `SELECT 
        p.*, 
        COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) AS avg_rating,
        COUNT(r.review_id) AS total_reviews
     FROM tourist_places p
     LEFT JOIN reviews r ON r.place_id = p.place_id
     WHERE p.place_id = $1
     GROUP BY p.place_id`,
    [placeId]
  );
  return result.rows[0] || null;
};
