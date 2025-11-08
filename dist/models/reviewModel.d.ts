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
export declare const getAllReviews: (placeId?: number) => Promise<Review[]>;
/**
 * Lấy review theo ID
 */
export declare const getReviewById: (id: number) => Promise<Review | null>;
/**
 * Tạo một review mới
 */
export declare const createReview: (place_id: number, user_id: number, rating: number, comment?: string) => Promise<Review>;
/**
 * Cập nhật nội dung hoặc điểm đánh giá
 */
export declare const updateReview: (id: number, rating?: number, comment?: string) => Promise<Review | null>;
/**
 * Xoá review
 */
export declare const deleteReview: (id: number) => Promise<Review | null>;
/**
 * Lấy trung bình rating theo place_id (nếu không dùng VIEW)
 */
export declare const getAverageRatingByPlace: (placeId: number) => Promise<{
    avg_rating: number;
    total_reviews: number;
}>;
//# sourceMappingURL=reviewModel.d.ts.map