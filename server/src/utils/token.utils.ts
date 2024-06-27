import jwt from 'jsonwebtoken';
import config from 'config';
import { Types } from 'mongoose';
import { IUser } from '../types';

const accessToken = config.get<string>('accessToken');
const refreshToken = config.get<string>('refreshToken');

export interface IPayload {
  id: Types.ObjectId;
  role: string;
}

export const createToken = (payload: IPayload, tokenType: string) => {
  const tokenSecret = tokenType === 'accessToken' ? accessToken : refreshToken;
  const expiresIn = tokenType === 'accessToken' ? '15m' : '3d';
  const token = jwt.sign(payload, tokenSecret, { expiresIn });
  return token;
};

export const createActivationToken = (user: IUser) => {
  const activationSecret = config.get<string>('activationSecret');
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign({ id: user._id, activationCode }, activationSecret, {
    expiresIn: '5m',
  });

  return { token, activationCode };
};
