import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';
import {
  getCoursesAnalytics,
  getOrdersAnalytics,
  getUserAnalytics,
} from '../services/analytics.service';

// USERS ANALYTICS HANDLER
export const getUserAnalyticsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getUserAnalytics();
    res.status(200).json({ success: true, data });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

//COURSES ANALYTICS HANDLER
export const getCoursesAnalyticsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getCoursesAnalytics();
    res.status(200).json({ success: true, data });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

//ORDERS ANALYTICS HANDLER
export const getOrdersAnalyticsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getOrdersAnalytics();
    res.status(200).json({ success: true, data });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
