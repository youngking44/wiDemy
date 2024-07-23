import { Router } from 'express';
import {
  createOrderHandler,
  getAllOrdersHandler,
} from '../controllers/order.controller';
import { verifyToken, verifyTokenAndAdmin } from '../middleware/verifyToken';

const router = Router();

//CREATE ORDER ROUTE
router.post('/', verifyToken, createOrderHandler);
// GET ALL ORDERS
router.get('/', verifyTokenAndAdmin, getAllOrdersHandler);

export default router;
