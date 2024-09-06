import { Request, Response } from "express";
import { CourseServices } from "./course.service";

const createCourse = async (req: Request, res: Response) => {
  const result = await CourseServices.createCourse(req.body);
  res.status(200).send({
    success: true,
    message: "Course created successfully",
    data: result,
  });
};

const getAllCourses = async (req: Request, res: Response) => {
  const result = await CourseServices.getAllCourses();
  res.status(200).send({
    success: true,
    message: "All courses retrieved successfully",
    data: result,
  });
};

const getCourseWithReview = async (req: Request, res: Response) => {
  const courseId = req.params.courseId;
  const result = await CourseServices.getCourseWithReview(courseId);
  res.status(200).send({
    success: true,
    message: "Course retrieved successfully",
    data: result,
  });
};

const updateCourse = async (req: Request, res: Response) => {
  const courseId = req.params.courseId;
  const updateData = req.body;
  const result = await CourseServices.updateCourse(courseId, updateData);
  res.status(200).send({
    success: true,
    message: "Course updated successfully",
    data: result,
  });
};

const getTheBestCourse = async (req: Request, res: Response) => {
  const result = await CourseServices.getTheBestCourse();
  res.status(200).send({
    success: true,
    message: "Best course retrieved successfully",
    data: result,
  });
};

export const CourseController = {
  createCourse,
  getAllCourses,
  getCourseWithReview,
  updateCourse,
  getTheBestCourse,
};
