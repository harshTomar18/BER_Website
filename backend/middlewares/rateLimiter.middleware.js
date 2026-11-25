import { ApiResponse } from '../utils/apiResponse.js';

// In-memory sliding window rate limiter (prevents spam on public form endpoints)
const requestCounts = new Map();

export const rateLimiter = (options = { windowMs: 60 * 1000, max: 10 }) => {
  const { windowMs, max } = options;

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps = requestCounts.get(ip);
    // Remove timestamps older than windowMs
    const validTimestamps = timestamps.filter((time) => now - time < windowMs);

    if (validTimestamps.length >= max) {
      return ApiResponse.error(
        res,
        'Too many requests from this IP. Please try again after 1 minute.',
        429
      );
    }

    validTimestamps.push(now);
    requestCounts.set(ip, validTimestamps);
    next();
  };
};
