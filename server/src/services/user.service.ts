import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import User from '../models/user.model';
import ErrorHandler from '../utils/errorHandler.utils';
import { redis } from '../utils/redis.utils';
import comparePasswords from '../utils/comparePasswords.utils';

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

interface IUpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const updateUserPassword = async (id: string, payload: IUpdatePasswordPayload) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ErrorHandler('User ID does not exist', 404);
  }

  const isMatch = await comparePasswords({ inputPassword: payload.oldPassword, userPassword: user.password || '' });

  if (!isMatch) {
    throw new ErrorHandler('Old password is incorrect', 401);
  }

  user.password = payload.newPassword;
  const newUser = await user.save();
  //Updating redis with the updated user
  await redis.set(newUser._id.toHexString(), JSON.stringify(newUser));

  //Return newUser cause is the one that has the updated encrypted password, cause one you call the
  //save() it encrypt the password before saving to DB
  return newUser;
};

interface IUpdateProfilePicture {
  id: string;
  avatar: string;
}

export const updateProfilePicture = async ({ id, avatar }: IUpdateProfilePicture) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ErrorHandler('User not found', 404);
  }

  if (user?.avatar?.public_id) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: 'avatars',
      width: 150,
    });

    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  } else {
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: 'avatars',
      width: 150,
    });

    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await user.save();
  await redis.set(user._id.toHexString(), JSON.stringify(user));

  return user;
};
