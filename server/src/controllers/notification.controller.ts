import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';
import {
  getAllNotifications,
  updateNotification,
} from '../services/notification.service';
import cron from 'node-cron';
import Notification from '../models/notification.model';

// GET ALL NOTIFICATIONS HANDLER
export const getAllNotificationsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notifications = await getAllNotifications();

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// UPDATE NOTIFICATION HANDLER
export const updateNotificationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const notifications = await updateNotification(id);

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// DELETE NOTIFICATION USING CRON JOB
cron.schedule('0 0 0 * * *', async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    await Notification.deleteMany({
      status: 'read',
      createdAt: { $lt: thirtyDaysAgo },
    });

    logger.info('Deleted Notifications Successfully');
  } catch (err) {
    logger.error(err);
  }
});
