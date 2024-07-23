import mongoose, { InferSchemaType, Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true, default: 'unread' },
  },
  { timestamps: true },
);

type Notification = InferSchemaType<typeof NotificationSchema>;

const notificationModel = mongoose.model<Notification>(
  'Notification',
  NotificationSchema,
);
export default notificationModel;
