import User from '../models/user.model';
import { CreateUserType } from '../schema/user.schema';
import comparePasswords from '../utils/comparePasswords.utils';
import ErrorHandler from '../utils/errorHandler.utils';

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
    userPassword: user.password,
  });

  if (!isMatch) {
    const error = new ErrorHandler('Invalid email or password', 401);
    throw error;
  }

  return user;
};

export const logoutUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(id, { $set: { token: '' } }, { new: true });

  if (!user) {
    throw new ErrorHandler('User ID does not exist', 404);
  }
};
