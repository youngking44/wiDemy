import { Router } from 'express';
import {
  getAllNotificationsHandler,
  updateNotificationHandler,
} from '../controllers/notification.controller';
import { verifyTokenAndAdmin } from '../middleware/verifyToken';

const router = Router();

// GET ALL NOTIFICATION ROUTES
router.get('/', verifyTokenAndAdmin, getAllNotificationsHandler);
// UPDATE NOTIFICATION ROUTE
router.put('/:id', verifyTokenAndAdmin, updateNotificationHandler);

export default router;
