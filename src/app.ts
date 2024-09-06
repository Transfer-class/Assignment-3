import express from "express";
import cors from "cors";
import { CourseRoute } from "./modules/course/course.routes";
import { categoryRoute } from "./modules/category/category.routes";
import { reviewRouter } from "./modules/review/reviews.routes";
const app = express();

// parser
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/course", CourseRoute);
app.use("/api/category", categoryRoute);
app.use("/api/review", reviewRouter);
export default app;
