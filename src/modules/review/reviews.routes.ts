import { Router } from "express";
import { courseReviewController } from "./review.controller";

const router = Router();

router.post("/", courseReviewController.createReview);

export const reviewRouter = router;
