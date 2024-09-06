import express from "express";
import { CourseController } from "./course.controller";

const router = express.Router();
router.get("/", CourseController.getAllCourses);
router.post("/", CourseController.createCourse);
router.put("/:courseId", CourseController.updateCourse);
router.get("/:courseId/reviews", CourseController.getCourseWithReview);

export const CourseRoute = router;
