import mongoose from 'mongoose';
import User from '../models/user.model';
import ErrorHandler from '../utils/errorHandler.utils';
import { redis } from '../utils/redis.utils';

type UserIdType = string | mongoose.Types.ObjectId;
interface IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
  isVerified?: boolean;
  token?: string;
}

export const getUser = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ErrorHandler('User not found', 404);
  }

  return user;
};

export const updateUser = async (id: UserIdType, payload: IUpdateUser) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ErrorHandler('User ID does not exist', 404);
  }

  if (payload.email) {
    const isEmailExist = await User.findOne({ email: payload.email });
    if (isEmailExist) throw new ErrorHandler('Email already exist, try a different email.', 404);
    user.email = payload.email;
  }

  if (payload.name) {
    user.name = payload.name;
  }

  if (payload.isVerified) {
    user.isVerified = payload.isVerified;
  }

  await user.save();
  redis.set(user._id.toHexString(), JSON.stringify(user));
  return user;
};
