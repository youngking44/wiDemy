import { Router } from 'express';
import { getUserHandler, updateUserHandler } from '../controllers/user.controller';

const router = Router();

router.get('/:id', getUserHandler);
router.put('/:id', updateUserHandler);

export default router;
