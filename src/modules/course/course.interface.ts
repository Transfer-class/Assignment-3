import { Types } from "mongoose";

export type TDetails = {
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
};

export type TTag = {
  name: string;
  isDeleted: boolean;
};

export type TCourse = {
  title: string;
  age: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: TTag[];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks: number;
  details: TDetails;

  //   // interface
  //   man: {
  //     age: string;
  //   };
};

// person interface

export type Tperson = {
  name: string;
  man: {
    age: string;
  };
};
