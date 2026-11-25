import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { notFoundHandler, globalErrorHandler } from './middlewares/error.middleware.js';
import apiRouter from './routes/index.js';
import { getSitemapXml } from './controllers/blog.controller.js';
import { seedDefaultAdmin } from './controllers/auth.controller.js';
import { seedDefaultHero } from './controllers/hero.controller.js';
import { seedDefaultAbout } from './controllers/about.controller.js';
import { seedDefaultServices } from './controllers/service.controller.js';
import { seedDefaultShowcase } from './controllers/showcase.controller.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

const app = express();

// Track seeding state to run seeds only once per process lifecycle
let isSeeding = false;
let isSeeded = false;

export const runInitialSeeds = async () => {
  if (isSeeded || isSeeding) return;
  isSeeding = true;
  try {
    await seedDefaultAdmin();
    await seedDefaultHero();
    await seedDefaultAbout();
    await seedDefaultServices();
    await seedDefaultShowcase();
    isSeeded = true;
    console.log('🌱 [Seeder] Default content and admin initialized.');
  } catch (err) {
    console.warn('Initial seeding notice:', err.message);
  } finally {
    isSeeding = false;
  }
};

// 1. Connection middleware: Ensure MongoDB is connected before handling incoming requests
app.use(async (req, res, next) => {
  if (config.mongoUri && mongoose.connection.readyState !== 1) {
    try {
      const conn = await connectDB();
      if (conn && !isSeeded) {
        // Run seed asynchronously in background without delaying HTTP response
        runInitialSeeds().catch((e) => console.warn('Background seed warning:', e?.message));
      }
    } catch (err) {
      console.warn('DB connect middleware notice:', err?.message || err);
    }
  }
  next();
});

// 2. Global Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // Allow vercel preview and production domains, localhost, or configured clientUrl
      if (
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin === config.clientUrl
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);
app.use('/uploads', express.static(uploadsDir));

// 3. Dynamic Sitemap Route at root
app.get('/sitemap.xml', getSitemapXml);

// 4. Mount API Routes
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);
app.use('/v1', apiRouter);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    name: 'BER Services API Gateway',
    version: '1.0.0',
    documentation: '/api/v1/health',
    sitemap: '/sitemap.xml',
  });
});

// 5. Fallback 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// 6. Server Listener (Only in standalone / non-serverless mode)
if (!process.env.VERCEL) {
  if (config.mongoUri) {
    connectDB()
      .then(() => runInitialSeeds())
      .catch((err) => console.warn('Initial DB connect/seed warning:', err.message));
  }

  const server = app.listen(config.port, () => {
    console.log(`🚀 [Server Ready] Running on http://localhost:${config.port} (${config.env})`);
  });

  // 7. Graceful Shutdown Handlers
  const handleShutdown = async (signal) => {
    console.log(`\n🛑 [${signal}] Signal received. Closing server gracefully...`);
    server.close(async () => {
      console.log('🔒 HTTP server closed.');
      try {
        await mongoose.connection.close(false);
        console.log('💾 MongoDB connection terminated cleanly.');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

export default app;
