import { Request, Response, NextFunction } from "express";
/**
 * Lấy tất cả đánh giá (hoặc theo địa điểm)
 * GET /reviews hoặc /reviews/place/:placeId
 */
export declare const getAllReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Lấy review theo ID
 * GET /reviews/:id
 */
export declare const getReviewById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Tạo mới review
 * POST /reviews
 * body: { place_id, user_id, rating, comment }
0000000 */
export declare const createReview: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Cập nhật review
 * PUT /reviews/:id
 * body: { rating?, comment? }
 */
export declare const updateReview: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Xoá review
 * DELETE /reviews/:id
 */
export declare const deleteReview: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Lấy trung bình rating của một địa điểm
 * GET /reviews/average/:placeId
 */
export declare const getAverageRatingByPlace: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const likeUpdatePlace: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=ReviewController.d.ts.map