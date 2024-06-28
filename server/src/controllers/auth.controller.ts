import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { CreateUserType } from '../schema/user.schema';
import { createUser, loginUser, logoutUser, socialAuth } from '../services/auth.service';
import { createActivationToken, createToken } from '../utils/token.utils';
import logger from '../utils/logger.utils';
import sendMail from '../utils/sendMail.utils';
import { IActionRequest } from '../types';
import ErrorHandler from '../utils/errorHandler.utils';
import { updateUser } from '../services/user.service';
import { redis } from '../utils/redis.utils';

const refreshTokenMaxAge = 3 * 24 * 60 * 60 * 1000;
const accessTokenMaxAge = 15 * 60 * 1000;
const refreshTokenSecret = config.get<string>('refreshToken');
const accessTokenSecret = config.get<string>('accessToken');
const activationSecret = config.get<string>('activationSecret');

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

    const payload = { id: user._id, role: user.role };
    const accessToken = createToken(payload, 'accessToken');
    const refreshToken = createToken(payload, 'refreshToken');

    const newUser = await updateUser(user._id, { token: refreshToken });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', maxAge: refreshTokenMaxAge });
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: accessTokenMaxAge });
    res.status(200).json({ success: true, user: newUser, token: accessToken });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const logoutUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await logoutUser(id);

    res.cookie('refreshToken', '', { maxAge: 1 });
    res.cookie('accessToken', '', { maxAge: 1 });
    res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const updateAccessTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      const error = new ErrorHandler('Not authenticated', 401);
      throw error;
    }
    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as jwt.JwtPayload;

    if (!decoded) {
      const error = new ErrorHandler('Invalid token', 403);
      throw error;
    }

    const session = await redis.get(decoded.id);
    if (!session) {
      const error = new ErrorHandler('Not authenticated', 401);
      throw error;
    }

    //You can also check if user with such token exist in the data base, and you can checkout
    // mikeshop codebase for that, but since we are using Redis, there is no need for that

    const payload = { id: decoded._id, role: decoded.role };
    const accessToken = createToken(payload, 'accessToken');
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: accessTokenMaxAge });
    res.status(200).json({ success: true, token: accessToken });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const socialAuthHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, message } = await socialAuth(req.body);
    let statusCode;

    if (message === 'social-auth-register') {
      statusCode = 201;
    } else {
      statusCode = 200;
    }

    const payload = { id: user._id, role: user.role };
    const accessToken = createToken(payload, 'accessToken');
    const refreshToken = createToken(payload, 'refreshToken');

    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', maxAge: refreshTokenMaxAge });
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: accessTokenMaxAge });
    res.status(statusCode).json({ success: true, user, token: accessToken });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
