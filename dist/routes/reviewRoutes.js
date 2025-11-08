import { Router } from "express";
import * as reviewController from "../controllers/ReviewController.js";
const router = Router();
//Lấy tất cả reviews
router.get("/", reviewController.getAllReviews);
router.get("/place/:placeId", reviewController.getAllReviews);
//Lấy một review dựa trên id của địa điểm nào đó
router.get("/:id", reviewController.getReviewById);
//Tạo một review mới
router.post("/", reviewController.createReview);
//Cập nhật review
router.put("/:id", reviewController.updateReview);
//Xóa review
router.delete("/:id", reviewController.deleteReview);
//Lấy ratings review trung bình
router.get("/average/:placeId", reviewController.getAverageRatingByPlace);
export default router;
//# sourceMappingURL=reviewRoutes.js.map