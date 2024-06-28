import { Request, Response, NextFunction } from 'express';
import { getUser, updateUser } from '../services/user.service';
import logger from '../utils/logger.utils';

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
