import User from '../models/user.model';
import { CreateUserType } from '../schema/user.schema';
import comparePasswords from '../utils/comparePasswords.utils';
import ErrorHandler from '../utils/errorHandler.utils';
import { redis } from '../utils/redis.utils';

export const createUser = async (input: CreateUserType) => {
  const user = await User.findOne({ email: input.email });

  if (user) {
    throw new ErrorHandler('Email has been used', 400);
  }
  return await User.create(input);
};

interface ILogin {
  email: string;
  password: string;
}

export const loginUser = async (input: ILogin) => {
  const user = await User.findOne({ email: input.email });

  if (!user) {
    const error = new ErrorHandler('Invalid email or password', 401);
    throw error;
  }

  const isMatch = await comparePasswords({
    inputPassword: input.password,
    userPassword: user?.password || '',
  });

  if (!isMatch) {
    const error = new ErrorHandler('Invalid email or password', 401);
    throw error;
  }

  //Sending User Session To Redis
  await redis.set(user._id.toHexString(), JSON.stringify(user));

  return user;
};

export const logoutUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: { token: '' } },
    { new: true },
  );

  if (!user) {
    throw new ErrorHandler('User ID does not exist', 404);
  }

  await redis.del(user._id.toHexString());
};

export const socialAuth = async (input: CreateUserType) => {
  const user = await User.findOne({ email: input.email });

  if (user) {
    await redis.set(user._id.toHexString(), JSON.stringify(user));
    return { user, message: 'social-auth-login' };
  } else {
    const newUser = await User.create(input);
    await redis.set(newUser._id.toHexString(), JSON.stringify(newUser));
    return { user: newUser, message: 'social-auth-register' };
  }
};
