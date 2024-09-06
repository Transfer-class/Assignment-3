import { Request, Response } from "express";
import { ReviewServices } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  const review = req.body;
  const result = await ReviewServices.createReview(review);
  res.status(200).send({
    success: true,
    message: "review successfully created",
    data: result,
  });
};

export const courseReviewController = {
  createReview,
};
