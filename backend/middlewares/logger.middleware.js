export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toLocaleTimeString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusEmoji = status < 400 ? '🟢' : status < 500 ? '🟡' : '🔴';

    console.log(
      `${statusEmoji} [${timestamp}] ${req.method} ${req.originalUrl} - ${status} (${duration}ms)`
    );
  });

  next();
};
