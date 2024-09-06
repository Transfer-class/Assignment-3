import mongoose, { Types } from "mongoose";
import { TCourse } from "./course.interface";
import { Course } from "./course.model";
import { CourseReview } from "../review/review.model";

const createCourse = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCourses = async () => {
  const result = await Course.find({}).populate("categoryId");
  return result;
};

const getCourseWithReview = async (courseId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // getting course
    const course = await Course.findById(courseId).lean();
    if (!course) {
      throw new Error("Course not found");
    }
    const courseReview = await CourseReview.find({ courseId: courseId }).lean();

    const courseWithReview = { ...course, reviews: courseReview };

    await session.commitTransaction();
    await session.endSession();
    return courseWithReview;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
  // starting transaction
};

const updateCourse = async (courseId: string, payload: Partial<TCourse>) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { details, tags, ...remainingData } = payload;
    const updateData: Record<string, unknown> = { ...remainingData };

    if (details && Object.keys(details).length > 0) {
      const entries = Object.entries(details);
      for (const [key, value] of entries) {
        updateData[`details.${key}`] = value;
      }
    }

    const updatedData = await Course.findByIdAndUpdate(courseId, updateData);

    if (!updatedData) {
      throw new Error("Failed to update data ");
    }

    // updating tags
    if (tags && tags.length > 0) {
      // detecting the tags to be deleted
      const deletedTags = tags
        .filter((tag) => tag.isDeleted === true)
        .map((e) => e.name);

      const deletedTag = await Course.findByIdAndUpdate(
        courseId,
        {
          $pull: { tags: { name: { $in: deletedTags } } },
        },
        { new: true, runValidators: true }
      );
      if (!deletedTag) {
        throw new Error("Failed to Delete tags ");
      }

      // pushing the new tag
      const addTag = tags.filter((tag) => tag.isDeleted === false);
      const updatedTag = await Course.findByIdAndUpdate(
        courseId,
        {
          $addToSet: { tags: { $each: addTag } },
        },
        { new: true, runValidators: true }
      );
      if (!updatedTag) {
        throw new Error("Failed to Add new tags ");
      }

      const finalUpdatedCourse = await Course.findById(courseId);

      await session.commitTransaction();
      await session.endSession();
      return finalUpdatedCourse;
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);
  }
};

export const CourseServices = {
  createCourse,
  getAllCourses,
  getCourseWithReview,
  updateCourse,
};
