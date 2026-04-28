import dotenv from 'dotenv';
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error(
    'Warning: GEMINI_API_KEY is not set. Please set it in the .env file.'
  );
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error(
    'Warning: JWT_SECRET is not set. Please set it in the .env file.'
  );
  process.exit(1);
}

if (!process.env.JWT_EXPIRES_IN) {
  console.error(
    'Warning: JWT_EXPIRES_IN is not set. Please set it in the .env file.'
  );
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('Warning: DB_URI is not set. Please set it in the .env file.');
  process.exit(1);
}

if (!process.env.PORT) {
  console.error('Warning: PORT is not set. Please set it in the .env file.');
  process.exit(1);
}

const config = {
  port: process.env.PORT,
  dbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  geminiApiKey: process.env.GEMINI_API_KEY
};

export default Object.freeze(config);
