import app from "./app";
import { configuration } from "./config";
import mongoose from "mongoose";

// getting-started.js

async function main() {
  try {
    await mongoose.connect(configuration.database_url as string);

    app.listen(configuration.port, () => {
      console.log(`Example app listening on port ${configuration.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
