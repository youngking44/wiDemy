import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';
import { getUserAnalytics } from '../services/analytics.service';

// USER ANALYTICS HANDLER
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
