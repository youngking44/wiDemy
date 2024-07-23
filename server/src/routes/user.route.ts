import { Router } from 'express';
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from '../middleware/verifyToken';
import validateResource from '../middleware/validateResource';
import {
  updatePasswordSchema,
  updateProfilePictureSchema,
} from '../schema/user.schema';
import {
  deleteUserHandler,
  getAllUsersHandler,
  getUserHandler,
  updateProfilePictureHandler,
  updateUserHandler,
  updateUserPasswordHandler,
  updateUserRoleHandler,
} from '../controllers/user.controller';

const router = Router();

// GET ALL USERS ROUTE
router.get('/', verifyTokenAndAdmin, getAllUsersHandler);
// GET USER ROUTE
router.get('/:id', verifyTokenAndAuthorization, getUserHandler);
// UPDATE USER ROUTE
router.put('/:id', verifyTokenAndAuthorization, updateUserHandler);
// UPDATE PASSWORD ROUTE
router.put(
  '/update-password/:id',
  verifyTokenAndAuthorization,
  validateResource(updatePasswordSchema),
  updateUserPasswordHandler,
);
// UPDATE PROFILE PICTURE ROUTE
router.put(
  '/update-profile-picture/:id',
  verifyTokenAndAuthorization,
  validateResource(updateProfilePictureSchema),
  updateProfilePictureHandler,
);
// UPDATE USER ROLE
router.put('/update-role/id', verifyTokenAndAdmin, updateUserRoleHandler);
// DELETE USER
router.delete('/:id', verifyTokenAndAdmin, deleteUserHandler);

export default router;
