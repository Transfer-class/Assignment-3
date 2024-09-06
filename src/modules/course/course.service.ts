import mongoose, { Types } from "mongoose";
import { TCourse } from "./course.interface";
import { Course } from "./course.model";
import { CourseReview } from "../review/review.model";

const createCourse = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

// const getAllCourses = async () => {
//   const result = await Course.find({}).populate("categoryId");
//   return result;
// };

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

const getTheBestCourse = async () => {
  const AllCourse = await CourseReview.aggregate([
    { $group: { _id: "$courseId", averageRating: { $avg: "$rating" } } },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course", // now course is an array
      },
    },
    { $unwind: "$course" }, // now course is an object
    { $sort: { averageRating: -1 } },
  ]);
  return AllCourse;
};

const getAllCourses = async (query: any) => {
  const allCourses = await Course.find({});
  console.log(query);

  let page = 1;
  let limit = 10; // default limit
  let skip = 0;

  // page , limit , skip
  if (query.page) {
    page = Number(query.page);
  }
  if (query.limit) {
    limit = Number(query.limit);
  }
  if (query.page && query.limit) {
    skip = Number((page - 1) * limit);
  }

  // valid sorting field
  const sortingField = [
    "title",
    "price",
    "startDate",
    "endDate",
    "endDate",
    "language",
    "durationInWeeks",
  ];

  let sortField;
  let ascendingOrDescending: 1 | -1 = 1;
  // checking condition
  if (
    query.sort &&
    query.sort.startsWith("-") &&
    sortingField.includes(query.sort.substring(1))
  ) {
    sortField = query.sort.substring(1);
    ascendingOrDescending = -1;
  } else if (query.sort && sortingField.includes(query.sort)) {
    sortField = query.sort;
  }

  let minPrice;
  let maxPrice;
  if (query?.minPrice) {
    minPrice = Number(query.minPrice);
  }
  if (query?.maxPrice) {
    maxPrice = Number(query.maxPrice);
  }

  // matching with tag
  let tag;
  if (query?.tag) {
    tag = query.tag;
  }

  let provider;
  if (query?.provider) {
    provider = query.provider;
  }
  let durationInWeeks;
  if (query?.durationInWeeks) {
    durationInWeeks = Number(query.durationInWeeks);
  }

  let level;
  if (query?.level) {
    level = query.level;
  }

  // all the conditional pipelines are can be done by an array and another one is below
  const paginateCourse = await Course.aggregate([
    { $match: {} },
    { $skip: skip },
    { $limit: limit },
    { $sort: { [sortField]: ascendingOrDescending } },
    {
      $match: {
        ...(minPrice !== undefined && { price: { $gte: minPrice } }),
        ...(maxPrice !== undefined && { price: { $lte: maxPrice } }),
      },
    },
    {
      $match: {
        ...(tag !== undefined && { tags: { $elemMatch: { name: tag } } }),
      },
    },
    {
      $match: {
        ...(provider && {
          provider: { $regex: `^${provider}`, $options: "i" },
        }),
      },
    },
    {
      $match: { ...(durationInWeeks && { durationInWeeks: durationInWeeks }) },
    },
    {
      $match: { ...(level && { "details.level": level }) },
    },
  ]);

  return paginateCourse;
};

export const CourseServices = {
  createCourse,
  getAllCourses,
  getCourseWithReview,
  updateCourse,
  getTheBestCourse,
  // getPaginatingCourse,
};
