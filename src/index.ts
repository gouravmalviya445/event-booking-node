import { app } from "./app";
import { connectDB } from "./db";
import { ENV } from "./env";

connectDB()
  .then(() => {
    const port = ENV.port || 5501;
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    })
  })
  .catch(() => {
    console.log("Database Connection Failed")
  })