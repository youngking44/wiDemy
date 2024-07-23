import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';
import { createOrder, getAlLOrders } from '../services/order.service';
import { OrderType } from '../models/order.model';

// CREATE ORDER HANDLER
export const createOrderHandler = async (
  req: Request<{}, {}, OrderType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { courseId, payment_info } = req.body;
    const order = await createOrder({
      courseId,
      payment_info,
      userId: req.user?._id.toString(),
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// GET ALL ORDERS HANDLER
export const getAllOrdersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await getAlLOrders();
    res.status(200).json({ success: true, orders });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
