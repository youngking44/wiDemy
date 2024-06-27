import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler.utils';

const errorHandlerMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || 'Inter Server Error';

  //Wrong Mongodb id error
  if (error.name === 'CastError') {
    const message = `Resource not found. Invalid: ${error.path}`;
    error = new ErrorHandler(message, 400);
  }

  //Duplicate key error
  if (error.code === 1100) {
    const message = `Duplicate ${Object.keys(error.keyValue)} error`;
    error = new ErrorHandler(message, 400);
  }

  //Wrong jwt error
  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid JWT token. Please try again!';
    error = new ErrorHandler(message, 401);
  }

  //JWT expired error
  if (error.name === 'TokenExpiredError') {
    const message = 'JWT token has expired. Please try again!';
    error = new ErrorHandler(message, 401);
  }

  res.status(error.statusCode).json({ success: false, message: error.message });
};

export default errorHandlerMiddleware;
