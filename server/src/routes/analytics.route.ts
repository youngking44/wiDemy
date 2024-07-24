import { Router } from 'express';
import { verifyTokenAndAdmin } from '../middleware/verifyToken';
import {
  getCoursesAnalyticsHandler,
  getOrdersAnalyticsHandler,
  getUserAnalyticsHandler,
} from '../controllers/analytics.controller';

const router = Router();

// USERS ANALYTICS ROUTE
router.get('/users-stats', verifyTokenAndAdmin, getUserAnalyticsHandler);
// COURSES ANALYTICS ROUTE
router.get('/courses-stats', verifyTokenAndAdmin, getCoursesAnalyticsHandler);
// ORDER ANALYTICS ROUTE
router.get('/orders-stats', verifyTokenAndAdmin, getOrdersAnalyticsHandler);

export default router;
