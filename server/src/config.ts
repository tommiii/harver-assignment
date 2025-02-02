import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB in bytes
  },
} as const;

export default config; 