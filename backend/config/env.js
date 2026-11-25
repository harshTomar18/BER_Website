import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder first, fallback to root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'ber_media_enterprise_jwt_secret_key_2026_x89a!secure',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  adminDefaultEmail: process.env.ADMIN_DEFAULT_EMAIL || 'admin@thebermedia.com',
  adminDefaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || 'BerAdmin@2026',
};

if (!config.mongoUri) {
  console.warn('⚠️ [MongoDB Warning]: MONGODB_URI is not set. Ensure it is added in Vercel Environment Variables.');
}
