import mongoose from 'mongoose';

export interface IParams {
  id: string;
}

export interface IActionRequest {
  activation_token: string;
  activation_code: string;
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  avatar?: { public_id: string; url: string };
  role: string;
  token: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
}
