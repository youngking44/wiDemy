import mongoose, { Document, InferSchemaType, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    avatar: { public_id: String, url: String },
    role: { type: String, default: 'user' },
    token: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true },
);

type User = InferSchemaType<typeof UserSchema>;

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  next();
});

const userModel = mongoose.model<User>('User', UserSchema);

export default userModel;
