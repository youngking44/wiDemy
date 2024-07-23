import { Request, Response, NextFunction } from 'express';
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateProfilePicture,
  updateUser,
  updateUserPassword,
  updateUserRole,
} from '../services/user.service';
import logger from '../utils/logger.utils';
import { IParams } from '../types';

// GET USER HANDLER
export const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const user = await getUser(id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// GET ALL USERS HANDLER
export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// UPDATE USER HANDLER
export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const user = await updateUser(id, req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// UPDATE USER PASSWORD HANDLER
interface IUpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}

export const updateUserPasswordHandler = async (
  req: Request<{}, {}, IUpdateUserPassword>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as IParams;
    const user = await updateUserPassword(id, req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// UPDATE PROFILE PICTURE HANDLER
export const updateProfilePictureHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;
    const user = await updateProfilePicture({ id, avatar });
    res.status(200).json({ success: true, user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// UPDATE USER ROLE
type UpdateRoleParamsType = {
  id: string;
};

interface IUpdateRoleRequestBody {
  role: string;
}
export const updateUserRoleHandler = async (
  req: Request<UpdateRoleParamsType, {}, IUpdateRoleRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await updateUserRole({ id, role });
    res.status(200).json({ success: true, user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

//DELETE USER HANDLER
export const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.sendStatus(204);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
