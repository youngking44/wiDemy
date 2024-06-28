import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import { createUserSchema, loginUserSchema, socialAuthSchema } from '../schema/user.schema';
import {
  activateUserHandler,
  createUserHandler,
  loginUserHandler,
  logoutUserHandler,
  socialAuthHandler,
  updateAccessTokenHandler,
} from '../controllers/auth.controller';
import { activateUserSchema } from '../schema/activate.schema';

const router = Router();

router.post('/register', validateResource(createUserSchema), createUserHandler);
router.post('/login', validateResource(loginUserSchema), loginUserHandler);
router.delete('/logout/:id', logoutUserHandler);
router.post('/activate-user', validateResource(activateUserSchema), activateUserHandler);
router.get('/refresh', updateAccessTokenHandler);
router.post('/social-auth', validateResource(socialAuthSchema), socialAuthHandler);

export default router;
