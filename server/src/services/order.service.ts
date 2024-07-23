import Course from '../models/course.model';
import Notification from '../models/notification.model';
import Order from '../models/order.model';
import User from '../models/user.model';

import ErrorHandler from '../utils/errorHandler.utils';
import sendMail from '../utils/sendMail.utils';

// CREATE ORDER
interface ICreateOrder {
  courseId: string;
  userId: string;
  payment_info: object;
}

export const createOrder = async (inputData: ICreateOrder) => {
  const { courseId, userId, payment_info } = inputData;

  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorHandler('User not found', 404);
  }

  const courseExist = user?.courses.find(
    (course) => course.courseId === courseId,
  );

  if (courseExist) {
    throw new ErrorHandler("You've already purchased this course", 400);
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ErrorHandler('Course not found', 404);
  }

  const orderData = {
    courseId,
    userId: user._id,
    payment_info,
  };

  const order = await Order.create(orderData);

  course.purchased += 1;
  await course.save();

  const data = {
    order: {
      _id: course._id?.toString()?.slice(0, 6),
      name: course.name,
      price: course.price,
      data: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
  };

  await sendMail({
    email: user?.email,
    subject: 'Order Confirmation',
    template: 'order-confirmation.ejs',
    data,
  });

  user?.courses.push({ courseId });

  await user.save();

  await Notification.create({
    userId: user._id,
    title: 'New Order',
    message: `You have a new order from ${course.name}`,
  });

  return order;
};

// GET ALL ORDERS
export const getAlLOrders = async () => {
  const orders = await Order.find().sort({ createdAt: -1 });

  return orders;
};
