import Notification from '../models/notification.model';
import ErrorHandler from '../utils/errorHandler.utils';

// GET ALL NOTIFICATIONS
export const getAllNotifications = async () => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  return notifications;
};

// UPDATE NOTIFICATION
export const updateNotification = async (id: string) => {
  const notification = await Notification.findById(id);

  if (!notification) {
    throw new ErrorHandler('Notification not found', 404);
  }

  notification.status = 'read';
  await notification.save();

  const notifications = await Notification.find().sort({ createdAt: -1 });

  return notifications;
};
