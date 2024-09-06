import { Schema, model } from "mongoose";
import { TCategory } from "./category.interface";

const courseCategorySchema = new Schema<TCategory>({
  name: { type: String, required: true, unique: true },
});

export const Category = model<TCategory>("Category", courseCategorySchema);
