import { Router } from 'express';
import { verifyTokenAndAuthorization } from '../middleware/verifyToken';
import validateResource from '../middleware/validateResource';
import { updatePasswordSchema, updateProfilePictureSchema } from '../schema/user.schema';
import { getUserHandler, updateProfilePictureHandler, updateUserHandler, updateUserPasswordHandler } from '../controllers/user.controller';

const router = Router();

router.get('/:id', verifyTokenAndAuthorization, getUserHandler);
router.put('/:id', verifyTokenAndAuthorization, updateUserHandler);
router.put('/update-password/:id', verifyTokenAndAuthorization, validateResource(updatePasswordSchema), updateUserPasswordHandler);
router.put('/update-profile-picture/:id', verifyTokenAndAuthorization, validateResource(updateProfilePictureSchema), updateProfilePictureHandler);

export default router;
