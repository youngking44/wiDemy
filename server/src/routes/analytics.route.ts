import { Router } from 'express';
import { verifyTokenAndAdmin } from '../middleware/verifyToken';
import { getUserAnalyticsHandler } from '../controllers/analytics.controller';

const router = Router();

// USER ANALYTICS ROUTE
router.get('/stats', verifyTokenAndAdmin, getUserAnalyticsHandler);

export default router;
