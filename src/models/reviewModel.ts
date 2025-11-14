import pool from "../config/db.js";

///////////////////////////////////////
// Bộ công cụ thao tác dữ liệu của bảng review
///////////////////////////////////////

export interface Review {
  review_id: number;
  place_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: Date;
}

/**
 * Lấy tất cả đánh giá (có thể lọc theo place_id)
 * @param placeId - (Tuỳ chọn) ID địa điểm để lọc
 * @returns Promise<Review[]> - Danh sách review
 */
export const getAllReviews = async (placeId?: number): Promise<Review[]> => {
  const query = placeId
    ? `SELECT * FROM reviews WHERE place_id = $1 ORDER BY created_at DESC`
    : `SELECT * FROM reviews ORDER BY created_at DESC`;
  const params = placeId ? [placeId] : [];
  const result = await pool.query(query, params);
  return result.rows;
};

/**
 * Lấy review theo ID
 */
export const getReviewById = async (id: number): Promise<Review | null> => {
  const result = await pool.query(
    `SELECT * FROM reviews WHERE review_id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Tạo một review mới
 */
export const createReview = async (
  place_id: number,
  user_id: number,
  rating: number,
  comment?: string
): Promise<Review> => {
  const result = await pool.query(
    `INSERT INTO reviews (place_id, user_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [place_id, user_id, rating, comment]
  );
  return result.rows[0];
};
 
/**
 * Cập nhật nội dung hoặc điểm đánh giá
 */
export const updateReview = async (
  id: number,
  rating?: number,
  comment?: string
): Promise<Review | null> => {
  const result = await pool.query(
    `UPDATE reviews
     SET rating = COALESCE($2, rating),
         comment = COALESCE($3, comment),
         created_at = NOW()
     WHERE review_id = $1
     RETURNING *`,
    [id, rating, comment]
  );
  return result.rows[0] || null;
};

/**
 * Xoá review
 */
export const deleteReview = async (id: number): Promise<Review | null> => {
  const result = await pool.query(
    `DELETE FROM reviews WHERE review_id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Lấy trung bình rating theo place_id (nếu không dùng VIEW)
 */
export const getAverageRatingByPlace = async (
  placeId: number
): Promise<{ avg_rating: number; total_reviews: number }> => {
  const result = await pool.query(
    `SELECT 
        ROUND(AVG(rating)::numeric, 1) AS avg_rating,
        COUNT(*) AS total_reviews
     FROM reviews
     WHERE place_id = $1
     GROUP BY place_id`,
    [placeId]
  );
  return result.rows[0] || { avg_rating: 0, total_reviews: 0 };
};

export const getLikePlace = async(placeId: number) => {
  const { rows } = await pool.query(
    `SELECT 
      COUNT(f.user_id) AS total_favorites
    FROM places p
    JOIN place_mapping m ON p.id = m.place_id
    JOIN tourist_places t ON m.tourist_place_id = t.place_id
    LEFT JOIN user_favorites f ON t.place_id = f.place_id
    WHERE p.id = $1
    GROUP BY p.id;`, [placeId]
  );

  return rows.length > 0 ? Number(rows[0].total_favorites) : 0;
}

export const upLike = async (placeId: number, userId: number) => {
  const result = await pool.query(`
    DO $$
    DECLARE
        _user_id INT := ${userId};
        _place_id INT := ${placeId};
    BEGIN
        -- Chèn tourist_places nếu chưa có
        IF NOT EXISTS (
            SELECT 1 FROM tourist_places WHERE place_id = _place_id
        ) THEN
            INSERT INTO tourist_places (place_id, name, description, address, geom)
            SELECT p.id,
                   COALESCE(p.name, 'Unnamed Place'),
                   NULL,
                   NULL,
                   p.geom
            FROM places p
            WHERE p.id = _place_id;
        END IF;

        -- Toggle user_favorites
        IF EXISTS (
            SELECT 1 FROM user_favorites
            WHERE user_id = _user_id AND place_id = _place_id
        ) THEN
            DELETE FROM user_favorites
            WHERE user_id = _user_id AND place_id = _place_id;
        ELSE
            INSERT INTO user_favorites (user_id, place_id)
            VALUES (_user_id, _place_id);
        END IF;
    END $$;
  `);

  return result;
};

export const getReviewFromPlace = async (placeId: number) => {
  const result = await pool.query(
    `
    SELECT r.review_id,
          r.rating,
          r.comment,
          r.created_at,
          u.full_name
    FROM reviews r
    JOIN tourist_places tp
        ON r.place_id = tp.place_id
    JOIN place_mapping pm
        ON pm.tourist_place_id = tp.place_id
    JOIN places p
        ON p.id = pm.place_id
    JOIN users u
        ON u.user_id = r.user_id
    WHERE p.id = $1
    ORDER BY RANDOM()
    LIMIT 20;
    `, [placeId]);

    return result.rows;
};

export const reviewInsert = async( placeid:number, userid:number, rating:number, comment:string, time:string ) => {
  const result = await pool.query(`
      DO $$
      DECLARE
          _user_id INT := $1;
          _place_id INT := $2;
          _rating INT := $3;
          _comment TEXT := $4;
          _time TIMESTAMP := $5;
      BEGIN
          -- 1. Nếu place chưa có trong tourist_places → tạo mới từ bảng places
          IF NOT EXISTS (
              SELECT 1 FROM tourist_places WHERE place_id = _place_id
          ) THEN
              INSERT INTO tourist_places (place_id, name, description, address, geom)
              SELECT p.id,
                    COALESCE(p.name, 'Unnamed Place'),
                    NULL,
                    NULL,
                    p.geom
              FROM places p
              WHERE p.id = _place_id;
          END IF;

          -- 2. Insert review
          INSERT INTO reviews (place_id, user_id, rating, comment, created_at)
          VALUES (_place_id, _user_id, _rating, _comment, _time);

      END $$;

    `, [placeid, userid, rating, comment, time]);
    return result.rows
}