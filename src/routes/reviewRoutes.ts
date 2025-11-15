import { Router } from "express";
import * as reviewController from "../controllers/ReviewController.js";


const router = Router();

//Lấy tất cả reviews
router.get("/", reviewController.getAllReviews);
router.get("/like_place/:placeId", reviewController.getlikePlace);
router.get("/reviewfetch/:placeId" ,reviewController.getReviewFromPlace);

//Lấy một review dựa trên id của địa điểm nào đó
router.get("/:id", reviewController.getReviewById);

//Tạo một review mới
router.post("/", reviewController.createReview);
router.post("/uplike", reviewController.upLike);
router.post("/review_insert", reviewController.reviewInsert);

//Cập nhật review
router.put("/:id", reviewController.updateReview);
 
//Xóa review
router.delete("/:id", reviewController.deleteReview);

export default router;