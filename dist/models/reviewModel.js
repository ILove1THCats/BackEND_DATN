import pool from "../config/db.js";
/**
 * Lấy tất cả đánh giá (có thể lọc theo place_id)
 * @param placeId - (Tuỳ chọn) ID địa điểm để lọc
 * @returns Promise<Review[]> - Danh sách review
 */
export const getAllReviews = async (placeId) => {
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
export const getReviewById = async (id) => {
    const result = await pool.query(`SELECT * FROM reviews WHERE review_id = $1`, [id]);
    return result.rows[0] || null;
};
/**
 * Tạo một review mới
 */
export const createReview = async (place_id, user_id, rating, comment) => {
    const result = await pool.query(`INSERT INTO reviews (place_id, user_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING *`, [place_id, user_id, rating, comment]);
    return result.rows[0];
};
/**
 * Cập nhật nội dung hoặc điểm đánh giá
 */
export const updateReview = async (id, rating, comment) => {
    const result = await pool.query(`UPDATE reviews
     SET rating = COALESCE($2, rating),
         comment = COALESCE($3, comment),
         created_at = NOW()
     WHERE review_id = $1
     RETURNING *`, [id, rating, comment]);
    return result.rows[0] || null;
};
/**
 * Xoá review
 */
export const deleteReview = async (id) => {
    const result = await pool.query(`DELETE FROM reviews WHERE review_id = $1 RETURNING *`, [id]);
    return result.rows[0] || null;
};
/**
 * Lấy trung bình rating theo place_id (nếu không dùng VIEW)
 */
export const getAverageRatingByPlace = async (placeId) => {
    const result = await pool.query(`SELECT 
        ROUND(AVG(rating)::numeric, 1) AS avg_rating,
        COUNT(*) AS total_reviews
     FROM reviews
     WHERE place_id = $1
     GROUP BY place_id`, [placeId]);
    return result.rows[0] || { avg_rating: 0, total_reviews: 0 };
};
export const getLikePlace = async (placeId) => {
    const { rows } = await pool.query(`SELECT COUNT(*) AS total FROM user_favorites where place_id = $1;`, [placeId]);
    return Number(rows[0].total);
};
export const upLike = async (placeId, userId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // 1) kiểm tra user tồn tại
        const u = await client.query('SELECT 1 FROM users WHERE user_id = $1', [userId]);
        if (u.rowCount === 0) {
            await client.query('ROLLBACK');
            return { error: 'User not found' };
        }
        // 2) ensure tourist_places
        await client.query(`INSERT INTO tourist_places (place_id, name, geom)
       SELECT p.id, COALESCE(p.name, 'Unnamed Place'), p.geom
       FROM places p
       WHERE p.id = $1
         AND NOT EXISTS (SELECT 1 FROM tourist_places WHERE place_id = $1)`, [placeId]);
        // 3) toggle
        const del = await client.query('DELETE FROM user_favorites WHERE user_id = $1 AND place_id = $2 RETURNING *', [userId, placeId]);
        if (del.rowCount ?? 0 > 0) {
            await client.query('COMMIT');
            return { action: 'removed' };
        }
        // 4) insert if not exists
        const ins = await client.query(`INSERT INTO user_favorites (user_id, place_id)
       SELECT $1, $2
       WHERE NOT EXISTS (SELECT 1 FROM user_favorites WHERE user_id = $1 AND place_id = $2)
       RETURNING *`, [userId, placeId]);
        await client.query('COMMIT');
        return { action: ins.rowCount ?? 0 > 0 ? 'added' : 'none' };
    }
    catch (e) {
        await client.query('ROLLBACK');
        throw e;
    }
    finally {
        client.release();
    }
};
export const getReviewFromPlace = async (placeId) => {
    const result = await pool.query(`
    SELECT r.review_id,
          r.rating,
          r.comment,
          r.created_at,
          u.full_name
    FROM reviews r
    JOIN users u
        ON u.user_id = r.user_id
    WHERE r.place_id = $1
    ORDER BY RANDOM()
    LIMIT 20;
    `, [placeId]);
    return result.rows;
};
export const reviewInsert = async (placeid, userid, rating, comment) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        // 1. Ensure tourist_place exists
        await client.query(`
      INSERT INTO tourist_places (place_id, name, geom)
      SELECT p.id, COALESCE(p.name, 'Unnamed Place'), p.geom
      FROM places p
      WHERE p.id = $1
        AND NOT EXISTS (SELECT 1 FROM tourist_places WHERE place_id = $1);
      `, [placeid]);
        // 2. Insert review
        await client.query(`
      INSERT INTO reviews (place_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      `, [placeid, userid, rating, comment]);
        await client.query("COMMIT");
        return { success: true };
    }
    catch (err) {
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
    }
};
//# sourceMappingURL=reviewModel.js.map