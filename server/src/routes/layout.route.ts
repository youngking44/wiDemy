import { Router } from 'express';
import { verifyTokenAndAdmin } from '../middleware/verifyToken';
import {
  createLayoutHandler,
  getLayoutHandler,
  updateLayoutHandler,
} from '../controllers/layout.controller';

const router = Router();

// GET LAYOUT ROUTE
router.get('/', getLayoutHandler);
// CREATE LAYOUT ROUTE
router.post('/', verifyTokenAndAdmin, createLayoutHandler);
// UPDATE LAYOUT ROUTE
router.put('/', verifyTokenAndAdmin, updateLayoutHandler);
export default router;
