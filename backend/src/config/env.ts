import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

if (!ENV.DATABASE_URL) {
  console.warn('WARNING: DATABASE_URL environment variable is not set. Database operations will fail.');
}
