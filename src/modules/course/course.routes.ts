import express from "express";
import { CourseController } from "./course.controller";

const router = express.Router();
// router.get("/", CourseController.getAllCourses);
router.post("/", CourseController.createCourse);
router.put("/:courseId", CourseController.updateCourse);
router.get("/:courseId/reviews", CourseController.getCourseWithReview);
router.get("/best", CourseController.getTheBestCourse);

// router.get("/pagination", CourseController.getPaginatingCourse);
router.get("/", CourseController.getAllCourses);

export const CourseRoute = router;
