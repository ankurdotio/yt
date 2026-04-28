import env from "./src/config/env.js";
import app from "./src/app.js";
import connectDB from "./src/config/mongodb.js";
connectDB();

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});