import config from './src/config/env.js';
import app from './src/app.js';
import connectDB from './src/config/mongodb.js';
import env from './src/config/env.js';

connectDB();

app.listen(config.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
