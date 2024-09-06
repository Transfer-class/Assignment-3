import { TReview } from "./review.interface";
import { CourseReview } from "./review.model";

const createReview = async (payload: TReview) => {
  const result = await CourseReview.create(payload);
  return result;
};

export const ReviewServices = {
  createReview,
};
