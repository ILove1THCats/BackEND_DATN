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
