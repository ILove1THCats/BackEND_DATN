import { Router } from "express";
import * as roadController from "../controllers/RoadController.js";

const router = Router();

router.get("/", roadController.getRoute);

export default router;



