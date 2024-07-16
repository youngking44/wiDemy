import { Request, Response, NextFunction } from 'express';
import { getUser, updateProfilePicture, updateUser, updateUserPassword } from '../services/user.service';
import logger from '../utils/logger.utils';
import { IParams } from '../types';

export const getUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user = await getUser(id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user = await updateUser(id, req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

interface IUpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}

export const updateUserPasswordHandler = async (req: Request<{}, {}, IUpdateUserPassword>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as IParams;
    const user = await updateUserPassword(id, req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const updateProfilePictureHandler = async (req: Request, res: Response, next: NextFunction) => {
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
