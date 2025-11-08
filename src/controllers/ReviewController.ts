import { Request, Response, NextFunction } from "express";
import * as reviewModel from '../models/reviewModel.js';

///////////////////////////////////////
// Controller xử lý logic cho bảng review
///////////////////////////////////////

/**
 * Lấy tất cả đánh giá (hoặc theo địa điểm)
 * GET /reviews hoặc /reviews/place/:placeId
 */
export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { placeId } = req.params;
    const reviews = await reviewModel.getAllReviews(placeId ? Number(placeId) : undefined);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
}; 

/**
 * Lấy review theo ID
 * GET /reviews/:id
 */
export const getReviewById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const review = await reviewModel.getReviewById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo mới review
 * POST /reviews
 * body: { place_id, user_id, rating, comment }
0000000 */
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { place_id, user_id, rating, comment } = req.body;

    if (!place_id || !user_id || !rating)
      return res.status(400).json({ message: "Missing required fields" });

    const newReview = await reviewModel.createReview(place_id, user_id, rating, comment);
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật review
 * PUT /reviews/:id
 * body: { rating?, comment? }
 */
export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { rating, comment } = req.body;

    const updated = await reviewModel.updateReview(id, rating, comment);
    if (!updated) return res.status(404).json({ message: "Review not found" });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Xoá review
 * DELETE /reviews/:id
 */
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deleted = await reviewModel.deleteReview(id);
    if (!deleted) return res.status(404).json({ message: "Review not found" });

    res.json({ message: "Review deleted", deleted });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy trung bình rating của một địa điểm
 * GET /reviews/average/:placeId
 */
export const getAverageRatingByPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const placeId = Number(req.params.placeId);
    const data = await reviewModel.getAverageRatingByPlace(placeId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
