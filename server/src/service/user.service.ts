import mongoose from 'mongoose';
import User from '../models/user.model';
import { IUser, IVerificationUpdate } from '../types';
import ErrorHandler from '../utils/errorHandler.utils';

type UserIdType = string | mongoose.Types.ObjectId;

export const updateUser = async (id: UserIdType, payload: IUser | IVerificationUpdate) => {
  const user = await User.findByIdAndUpdate(id, { $set: payload }, { new: true });

  if (!user) {
    throw new ErrorHandler('User ID does not exist', 404);
  }

  return user;
};
