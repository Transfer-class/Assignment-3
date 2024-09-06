import { Request, Response } from "express";
import { CategoryServices } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
  const result = await CategoryServices.createCategory(req.body);
  res.send(result);
};

const getAllCategories = async (req: Request, res: Response) => {
  const result = await CategoryServices.getAllCategories();
  res.send(result);
};

export const categoryController = {
  createCategory,
  getAllCategories,
};
