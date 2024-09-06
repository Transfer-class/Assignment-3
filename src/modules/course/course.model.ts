import { Schema, model } from "mongoose";
import { TCourse, TDetails, TTag, Tperson } from "./course.interface";

const courseDetailsSchema = new Schema<TDetails>({
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  description: { type: String, required: true },
});

const TagSchema = new Schema<TTag>(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  instructor: { type: String, required: true },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: [TagSchema],
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  language: { type: String, required: true },
  provider: { type: String, required: true },
  durationInWeeks: { type: Number, required: true },

  details: courseDetailsSchema,
});

export const Course = model<TCourse>("Course", courseSchema);

// person model
// const personSchema = new Schema<Tperson>({
//   name: { type:Number },
//   man: {
//     age: { type: Number },
//   },
// });
