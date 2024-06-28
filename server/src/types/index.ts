import mongoose from 'mongoose';

export interface IActionRequest {
  activation_token: string;
  activation_code: string;
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  token: string;
  isVerified: boolean;
}
