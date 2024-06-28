import * as express from 'express';
import { IUser } from './src/types';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
