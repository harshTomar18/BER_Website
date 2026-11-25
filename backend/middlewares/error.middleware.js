import { ApiResponse } from '../utils/apiResponse.js';
import { config } from '../config/env.js';

export const notFoundHandler = (req, res, next) => {
  return ApiResponse.error(
    res,
    `Cannot find resource at [${req.method}] ${req.originalUrl}`,
    404
  );
};

export const globalErrorHandler = (err, req, res, next) => {
  console.error('🔥 [Unhandled Error]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return ApiResponse.error(
    res,
    message,
    statusCode,
    config.env === 'development' ? { stack: err.stack } : null
  );
};
