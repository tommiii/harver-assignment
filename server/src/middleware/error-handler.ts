import { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';
import logger from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next
) => {
  logger.error({
    err,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: 'error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const setupErrorHandling = () => {
  process.on('unhandledRejection', (reason: Error) => {
    logger.error({
      err: reason,
      message: reason.message,
      stack: reason.stack,
    }, 'Unhandled Promise Rejection');
    
    process.exit(1);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error({
      err: error,
      message: error.message,
      stack: error.stack,
    }, 'Uncaught Exception');
    
    process.exit(1);
  });
}; 