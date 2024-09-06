import dotenv from "dotenv";
dotenv.config();

export const configuration = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
};
