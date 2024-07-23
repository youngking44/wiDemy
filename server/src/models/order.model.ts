import mongoose, { InferSchemaType, Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    courseId: { type: String, required: true },
    userId: { type: String, required: true },
    payment_info: { type: Object /* required: true */ },
  },
  { timestamps: true },
);

export type OrderType = InferSchemaType<typeof OrderSchema>;

const orderModel = mongoose.model<OrderType>('Order', OrderSchema);

export default orderModel;
