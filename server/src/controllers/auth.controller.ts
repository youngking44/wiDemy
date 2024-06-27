import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { CreateUserType } from '../schema/user.schema';
import { createUser, loginUser, logoutUser } from '../service/auth.service';
import { createActivationToken, createToken } from '../utils/token.utils';
import logger from '../utils/logger.utils';
import sendMail from '../utils/sendMail.utils';
import { IActionRequest } from '../types';
import ErrorHandler from '../utils/errorHandler.utils';
import { updateUser } from '../service/user.service';
import { redis } from '../utils/redis.utils';

const refreshTokenMaxAge = 3 * 24 * 60 * 60 * 1000;
const accessTokenMaxAge = 15 * 60 * 1000;

export const createUserHandler = async (req: Request<{}, {}, CreateUserType>, res: Response, next: NextFunction) => {
  try {
    const newUser = await createUser(req.body);
    const activationInfo = createActivationToken(newUser);
    const activationCode = activationInfo.activationCode;
    const data = { user: { name: newUser.name }, activationCode };

    await sendMail({
      email: newUser.email,
      subject: 'Activation Code',
      template: 'activation-mail.ejs',
      data,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email ${newUser.email} to activate your account`,
      activationToken: activationInfo.token,
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

type DecodedType = {
  id: string;
  activationCode: string;
};

export const activateUserHandler = async (req: Request<{}, {}, IActionRequest>, res: Response, next: NextFunction) => {
  try {
    const { activation_token, activation_code } = req.body;
    const activationSecret = config.get<string>('activationSecret');
    const decoded = jwt.verify(activation_token, activationSecret);

    if (!decoded) {
      const error = new ErrorHandler('Expired code', 401);
      return next(error);
    }

    const { id, activationCode } = decoded as DecodedType;

    if (activationCode === activation_code) {
      const user = await updateUser(id, {
        isVerified: true,
      });

      res.status(200).json({ success: true, user });
    } else {
      const error = new ErrorHandler('Invalid activation code', 401);
      next(error);
    }
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const loginUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await loginUser(req.body);

    //Sending User Session To Redis
    redis.set(user._id.toHexString(), JSON.stringify(user));

    const payload = { id: user._id, role: user.role };
    const accessToken = createToken(payload, 'accessToken');
    const refreshToken = createToken(payload, 'refreshToken');

    user.token = refreshToken;
    await updateUser(user._id, user);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', maxAge: refreshTokenMaxAge });
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: accessTokenMaxAge });
    res.status(200).json({ user, token: accessToken });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const logoutUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await logoutUser(id);

    res.cookie('refreshToken', '', { httpOnly: true, sameSite: 'lax', maxAge: 1 });
    res.cookie('accessToken', '', { httpOnly: true, sameSite: 'lax', maxAge: 1 });
    res.status(200).json({ success: true });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
