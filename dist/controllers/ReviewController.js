import * as reviewModel from '../models/reviewModel.js';
///////////////////////////////////////
// Controller xử lý logic cho bảng review
///////////////////////////////////////
/**
 * Lấy tất cả đánh giá (hoặc theo địa điểm)
 * GET /reviews hoặc /reviews/place/:placeId
 */
export const getAllReviews = async (req, res, next) => {
    try {
        const { placeId } = req.params;
        const reviews = await reviewModel.getAllReviews(placeId ? Number(placeId) : undefined);
        res.json(reviews);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Lấy review theo ID
 * GET /reviews/:id
 */
export const getReviewById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const review = await reviewModel.getReviewById(id);
        if (!review)
            return res.status(404).json({ message: "Review not found" });
        res.json(review);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Tạo mới review
 * POST /reviews
 * body: { place_id, user_id, rating, comment }
0000000 */
export const createReview = async (req, res, next) => {
    try {
        const { place_id, user_id, rating, comment } = req.body;
        if (!place_id || !user_id || !rating)
            return res.status(400).json({ message: "Missing required fields" });
        const newReview = await reviewModel.createReview(place_id, user_id, rating, comment);
        res.status(201).json(newReview);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Cập nhật review
 * PUT /reviews/:id
 * body: { rating?, comment? }
 */
export const updateReview = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { rating, comment } = req.body;
        const updated = await reviewModel.updateReview(id, rating, comment);
        if (!updated)
            return res.status(404).json({ message: "Review not found" });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Xoá review
 * DELETE /reviews/:id
 */
export const deleteReview = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const deleted = await reviewModel.deleteReview(id);
        if (!deleted)
            return res.status(404).json({ message: "Review not found" });
        res.json({ message: "Review deleted", deleted });
    }
    catch (error) {
        next(error);
    }
};
//Lấy like địa điểm hiện tại
export const getlikePlace = async (req, res, next) => {
    try {
        const placeId = Number(req.params.placeId);
        console.log("place id là: ", placeId);
        const like = await reviewModel.getLikePlace(placeId);
        res.json(like);
    }
    catch (e) {
        next(e);
    }
};
//Code này lần 1 là like, chạy lần 2 là bỏ like
export const upLike = async (req, res, next) => {
    try {
        const userid = req.body.userid;
        const placeid = req.body.placeid;
        await reviewModel.upLike(placeid, userid);
        return res.status(200).json({ message: "Toggle like success" });
    }
    catch (e) {
        next(e);
    }
};
export const getReviewFromPlace = async (req, res, next) => {
    try {
        const place = Number(req.params.placeId);
        const result = await reviewModel.getReviewFromPlace(place);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
export const reviewInsert = async (req, res, next) => {
    try {
        const { placeid, userid, rating, comment } = req.body.review;
        const result = await reviewModel.reviewInsert(placeid, userid, rating, comment);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=ReviewController.js.map