import { Schema, model } from "mongoose";
import { TReview } from "./review.interface";

const courseReviewSchema = new Schema<TReview>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
});

export const CourseReview = model<TReview>("Review", courseReviewSchema);
