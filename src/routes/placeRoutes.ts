import { Router } from "express";
import * as placeController from "../controllers/PlaceController.js";

const router = Router();

router.get("/", placeController.getAllPlaces);
// router.get("/:id([0-9]+)", placeController.getPlaceById);
//Lấy loại để chọn
router.get("/amenity", placeController.getAmenityTypes);
router.get("/amenity/:amenity", placeController.getSpecificPlace);
router.get("/nearby", placeController.getNearbyPlaces);


router.post("/", placeController.createPlace);
router.put("/:id", placeController.updatePlace);
router.delete("/:id", placeController.deletePlace);
router.get("/:id/rating", placeController.getAverageRatingByPlace);

export default router;
